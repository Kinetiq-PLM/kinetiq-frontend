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
    Pagination
} from "antd";
import {
    UserOutlined,
    SearchOutlined
} from "@ant-design/icons";

const { TabPane } = Tabs;
const { Title } = Typography;

const AuditLog = () => {
    // State variables
    const [auditLog, setAuditLog] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    // Pagination states
    const [activeTab] = useState("auditLog");
    const [auditLogPagination, setAuditLogPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });

    useEffect(() => {
        fetchAuditLog();
    }, []);  // Empty dependency array ensures it runs once on mount

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
            const data = await auditLogAPI.getAuditLogs({
                search: searchTerm,
                ordering: orderDirection === "descend" ? `-${orderField}` : orderField
            });
            setAuditLog(data.results || data);
            setAuditLogPagination(prev => ({
                ...prev,
                total: (data.results || data).length
            }));
        } catch (error) {
            message.error("Failed to fetch log");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Handle pagination changes
    const handleAuditLogPaginationChange = (page, pageSize) => {
        setAuditLogPagination(prev => ({
            ...prev,
            current: page,
            pageSize
        }));
    };

    // Handle search with debounce
    const handleSearch = (value) => {
        setSearchValue(value);
        if (activeTab === "auditLog") {
            fetchAuditLog(value);
        }
    };

    const handleTableChange = (pagination, filters, sorter, extra) => {
        if (sorter && sorter.field) {
            const orderField = sorter.field;
            const orderDirection = sorter.order;

            fetchAuditLog(searchValue, orderField, orderDirection);
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
        {
            title: "User ID",
            dataIndex: "user_id",
            key: "user_id",
            sorter: true,
            width: 120,
        },
        { // need baguhin
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
        { // not sure pano render neto
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

    // Render main component
    return (
        <div className="auditLog">
            <div className="log-container">
                <Title level={4} className="page-title">
                    {activeTab === "auditLog" ? "Audit Logs" : ""}
                </Title>
                <Divider className="title-divider" />

                <div className="tabs-wrapper">
                    <Tabs
                        activeKey={activeTab}
                        size="middle"
                        tabBarGutter={8}
                        className="log-tabs"
                        type={windowWidth <= 768 ? "card" : "line"}
                        tabPosition="top"
                        destroyInactiveTabPane={false}
                        tabBarExtraContent={{
                            right: (
                                <div className="header-right-content">
                                    <div className="search-container">
                                        <Input.Search
                                            placeholder="Search logs..."
                                            allowClear
                                            onSearch={handleSearch}
                                            value={searchValue}
                                            onChange={(e) => setSearchValue(e.target.value)}
                                            prefix={<SearchOutlined />}
                                        />
                                    </div>
                                </div>
                            )
                        }}
                    >
                        <TabPane
                            tab={<span><UserOutlined /> {windowWidth > 576 ? "Notification" : ""}</span>}
                            key="auditLog"
                        >
                            {/* Notif tab content */}
                            <div className="table-meta-info">
                                <span className="record-count">Total Logs: {auditLog.length}</span>
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

