import React, { useState, useEffect } from "react";
import { auditLogAPI } from "../api/api";
import "../styles/AuditLogs.css";
import {
    Table,
    Input,
    Tabs,
    message,
    Typography,
    Divider,
    Pagination,
    DatePicker,
    Space,
    Button
} from "antd";
import {
    BookOutlined,
    SearchOutlined,
    ClockCircleOutlined,
    CalendarOutlined,
    FilterOutlined
} from "@ant-design/icons";

const { TabPane } = Tabs;
const { Title } = Typography;
const { RangePicker } = DatePicker;

const AuditLog = () => {
    // State variables
    const [auditLog, setAuditLog] = useState([]);
    const [recentAuditLog, setRecentAuditLog] = useState([]);
    const [loading, setLoading] = useState(false);
    const [recentLoading, setRecentLoading] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [recentSearchValue, setRecentSearchValue] = useState("");
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [dateRange, setDateRange] = useState(null);
    const [showDateFilter, setShowDateFilter] = useState(false);

    // Pagination states
    const [activeTab, setActiveTab] = useState("recentLogs"); // Set "recentLogs" as default tab
    const [auditLogPagination, setAuditLogPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });
    const [recentAuditLogPagination, setRecentAuditLogPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });

    useEffect(() => {
        if (activeTab === "allLogs") {
            fetchAuditLog();
        } else {
            fetchRecentAuditLog();
        }
    }, [activeTab]);  // Fetch data when tab changes

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Data fetching functions
    const fetchAuditLog = async (searchTerm = "", orderField = "", orderDirection = "") => {
        setLoading(true);
        try {
            // Build params object
            const params = {
                search: searchTerm,
                ordering: orderDirection === "descend" ? `-${orderField}` : orderField
            };
            
            // Add date range params if available
            if (dateRange && dateRange.length === 2) {
                params.start_date = dateRange[0].format('YYYY-MM-DD');
                params.end_date = dateRange[1].format('YYYY-MM-DD');
            }

            const data = await auditLogAPI.getAuditLogs(params);
            setAuditLog(data.results || data);
            setAuditLogPagination(prev => ({
                ...prev,
                total: data.count || (data.results || data).length
            }));
        } catch (error) {
            message.error("Failed to fetch audit logs");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRecentAuditLog = async (searchTerm = "", orderField = "", orderDirection = "") => {
        setRecentLoading(true);
        try {
            const params = {
                search: searchTerm,
                ordering: orderDirection === "descend" ? `-${orderField}` : orderField
            };

            const data = await auditLogAPI.getRecentAuditLogs(params);
            setRecentAuditLog(data.results || data);
            setRecentAuditLogPagination(prev => ({
                ...prev,
                total: data.count || (data.results || data).length
            }));
        } catch (error) {
            message.error("Failed to fetch recent audit logs");
            console.error(error);
        } finally {
            setRecentLoading(false);
        }
    };

    // Handle date range change
    const handleDateRangeChange = (dates) => {
        setDateRange(dates);
    };

    // Apply date range filter
    const applyDateFilter = () => {
        if (activeTab === "allLogs") {
            fetchAuditLog(searchValue);
        }
    };

    // Reset date filter
    const resetDateFilter = () => {
        setDateRange(null);
        if (activeTab === "allLogs") {
            fetchAuditLog(searchValue);
        }
    };

    // Toggle date filter visibility
    const toggleDateFilter = () => {
        setShowDateFilter(!showDateFilter);
    };

    // Handle pagination changes
    const handleAuditLogPaginationChange = (page, pageSize) => {
        setAuditLogPagination(prev => ({
            ...prev,
            current: page,
            pageSize
        }));
    };

    const handleRecentAuditLogPaginationChange = (page, pageSize) => {
        setRecentAuditLogPagination(prev => ({
            ...prev,
            current: page,
            pageSize
        }));
    };

    // Handle search with debounce
    const handleSearch = (value) => {
        if (activeTab === "allLogs") {
            setSearchValue(value);
            fetchAuditLog(value);
        } else {
            setRecentSearchValue(value);
            fetchRecentAuditLog(value);
        }
    };

    const handleTableChange = (pagination, filters, sorter, extra) => {
        if (sorter && sorter.field) {
            const orderField = sorter.field;
            const orderDirection = sorter.order;

            if (activeTab === "allLogs") {
                fetchAuditLog(searchValue, orderField, orderDirection);
            } else {
                fetchRecentAuditLog(recentSearchValue, orderField, orderDirection);
            }
        }
    };

    const handleTabChange = (key) => {
        setActiveTab(key);
        // Reset pagination when changing tabs
        if (key === "allLogs") {
            setAuditLogPagination(prev => ({
                ...prev,
                current: 1
            }));
        } else {
            setRecentAuditLogPagination(prev => ({
                ...prev,
                current: 1
            }));
        }
    };

    // Table columns definitions with sorting added
    const auditLogColumns = [
        {
            title: "Log ID",
            dataIndex: "log_id",
            key: "log_id",
            sorter: true,
            width: 100,
        },
        // {
        //     title: "User ID",
        //     dataIndex: "user_id",
        //     key: "user_id",
        //     sorter: true,
        //     width: 120,
        // },
        {
            title: "Action",
            dataIndex: "action",
            key: "action",
            sorter: true,
            width: 180,
        },
        {
            title: "Timestamp",
            dataIndex: "timestamp",
            key: "timestamp",
            sorter: true,
            width: 130,
            render: (text) => {
                if (!text) return "-";
                const date = new Date(text);
                const options = {
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                };
                const timeOptions = {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true,
                };
        
                const datePart = date.toLocaleDateString(undefined, options);
                const timePart = date.toLocaleTimeString(undefined, timeOptions);
                return `${datePart} ,  ${timePart}`;
            },
        },
        {
            title: "IP Address",
            dataIndex: "ip_address",
            key: "ip_address",
            sorter: true,
            width: 130,
        },
    ];

    // Calculate table data for pagination
    const getAuditLogTableData = () => {
        const { current, pageSize } = auditLogPagination;
        const start = (current - 1) * pageSize;
        const end = start + pageSize;
        return auditLog.slice(start, end);
    };

    const getRecentAuditLogTableData = () => {
        const { current, pageSize } = recentAuditLogPagination;
        const start = (current - 1) * pageSize;
        const end = start + pageSize;
        return recentAuditLog.slice(start, end);
    };

    // Render date filter section
    const renderDateFilter = () => {
        if (!showDateFilter || activeTab !== "allLogs") return null;
        
        return (
            <div className="date-filter-container">
                <Space>
                    <RangePicker
                        value={dateRange}
                        onChange={handleDateRangeChange}
                        format="YYYY-MM-DD"
                    />
                    <Button 
                        type="primary" 
                        onClick={applyDateFilter}
                        disabled={!dateRange}
                    >
                        Apply
                    </Button>
                    <Button 
                        onClick={resetDateFilter}
                        disabled={!dateRange}
                    >
                        Reset
                    </Button>
                </Space>
            </div>
        );
    };

    // Render main component
    return (
        <div className="auditLog">
            <div className="log-container">
                <Title level={4} className="page-title">
                    Audit Logs
                </Title>
                <Divider className="title-divider" />

                <div className="tabs-wrapper">
                    <Tabs
                        activeKey={activeTab}
                        onChange={handleTabChange}
                        size="middle"
                        tabBarGutter={8}
                        className="log-tabs"
                        type={windowWidth <= 768 ? "card" : "line"}
                        tabPosition="top"
                        destroyInactiveTabPane={false}
                        tabBarExtraContent={{
                            right: (
                                <div className="header-right-content">
                                    {activeTab === "allLogs" && (
                                        <Button 
                                            icon={<CalendarOutlined />} 
                                            onClick={toggleDateFilter}
                                            type={showDateFilter ? "primary" : "default"}
                                            className="date-filter-button"
                                        >
                                            {windowWidth > 576 ? "Date Filter" : ""}
                                        </Button>
                                    )}
                                    <div className="search-container">
                                        <Input.Search
                                            placeholder="Search logs..."
                                            allowClear
                                            onSearch={handleSearch}
                                            value={activeTab === "allLogs" ? searchValue : recentSearchValue}
                                            onChange={(e) => activeTab === "allLogs" 
                                                ? setSearchValue(e.target.value) 
                                                : setRecentSearchValue(e.target.value)}
                                            prefix={<SearchOutlined />}
                                        />
                                    </div>
                                </div>
                            )
                        }}
                    >
                        <TabPane
                            tab={<span><ClockCircleOutlined /> {windowWidth > 576 ? "Recent (24h)" : "Recent"}</span>}
                            key="recentLogs"
                        >
                            <div className="table-meta-info">
                                <span className="record-count">Recent Logs (Last 24 Hours): {recentAuditLog.length}</span>
                                <div className="table-pagination">
                                    <Pagination
                                        current={recentAuditLogPagination.current}
                                        pageSize={recentAuditLogPagination.pageSize}
                                        total={recentAuditLog.length}
                                        onChange={handleRecentAuditLogPaginationChange}
                                        showSizeChanger={false}
                                        size="small"
                                    />
                                </div>
                            </div>

                            <div className="table-container">
                                <Table
                                    dataSource={getRecentAuditLogTableData()}
                                    columns={auditLogColumns}
                                    rowKey="log_id"
                                    loading={recentLoading}
                                    scroll={{ x: true, y: 400 }}
                                    pagination={false}
                                    bordered
                                    size="middle"
                                    showSorterTooltip={false}
                                    sortDirections={['ascend', 'descend']}
                                    onChange={handleTableChange}
                                    className="scrollable-table"
                                />
                            </div>
                        </TabPane>
                        
                        <TabPane
                            tab={<span><BookOutlined /> {windowWidth > 576 ? "All Logs" : "All"}</span>}
                            key="allLogs"
                        >
                            {renderDateFilter()}
                            
                            <div className="table-meta-info">
                                <span className="record-count">
                                    Total Logs: {auditLog.length}
                                    {dateRange && dateRange.length === 2 && (
                                        <span className="date-range-indicator">
                                            {` (${dateRange[0].format('MMM DD, YYYY')} - ${dateRange[1].format('MMM DD, YYYY')})`}
                                        </span>
                                    )}
                                </span>
                                <div className="table-pagination">
                                    <Pagination
                                        current={auditLogPagination.current}
                                        pageSize={auditLogPagination.pageSize}
                                        total={auditLog.length}
                                        onChange={handleAuditLogPaginationChange}
                                        showSizeChanger={false}
                                        size="small"
                                    />
                                </div>
                            </div>

                            <div className="table-container">
                                <Table
                                    dataSource={getAuditLogTableData()}
                                    columns={auditLogColumns}
                                    rowKey="log_id"
                                    loading={loading}
                                    scroll={{ x: true, y: 400 }}
                                    pagination={false}
                                    bordered
                                    size="middle"
                                    showSorterTooltip={false}
                                    sortDirections={['ascend', 'descend']}
                                    onChange={handleTableChange}
                                    className="scrollable-table"
                                />
                            </div>
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        </div>
    );
};

export default AuditLog;