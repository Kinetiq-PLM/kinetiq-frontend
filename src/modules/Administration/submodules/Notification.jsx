import React, { useState, useEffect } from "react";
import { notificationsAPI } from "../api/api";
import "../styles/Notifications.css";
import {
    Table,
    Input,
    Tabs,
    message,
    Typography,
    Divider,
    Pagination,
    Badge,
    Tag
} from "antd";
import {
    BellOutlined,
    SearchOutlined,
    FilterOutlined,
} from "@ant-design/icons";

const { TabPane } = Tabs;
const { Title } = Typography;

const Notifications = () => {
    // State variables
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    // Pagination states
    const [activeTab] = useState("notifications");
    const [notificationsPagination, setNotificationsPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });

    useEffect(() => {
        fetchNotifications();
    }, []);  // Empty dependency array ensures it runs once on mount

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Data fetching functions
    const fetchNotifications = async (searchTerm = "", orderField = "", orderDirection = "") => {
        setLoading(true);
        try {
            const data = await notificationsAPI.getNotifications({
                search: searchTerm,
                ordering: orderDirection === "descend" ? `-${orderField}` : orderField
            });
            setNotifications(data.results || data);
            setNotificationsPagination(prev => ({
                ...prev,
                total: (data.results || data).length
            }));
        } catch (error) {
            message.error("Failed to fetch notifications");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Handle pagination changes
    const handleNotificationsPaginationChange = (page, pageSize) => {
        setNotificationsPagination(prev => ({
            ...prev,
            current: page,
            pageSize
        }));
    };

    // Handle search with debounce
    const handleSearch = (value) => {
        setSearchValue(value);
        if (activeTab === "notifications") {
            fetchNotifications(value);
        }
    };

    const handleTableChange = (pagination, filters, sorter, extra) => {
        if (sorter && sorter.field) {
            const orderField = sorter.field;
            const orderDirection = sorter.order;

            fetchNotifications(searchValue, orderField, orderDirection);
        }
    };

    // Get status tag with appropriate color
    const getStatusTag = (status) => {
        let color = '';
        switch(status) {
            case 'Read':
                color = 'green';
                break;
            case 'Unread':
                color = 'blue';
                break;
            case 'Archived':
                color = 'red';
                break;
            default:
                color = 'default';
        }
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
    };

    // Table columns definitions with sorting added
    const notificationsColumns = [
        {
            title: "ID",
            dataIndex: "notifications_id",
            key: "notifications_id",
            sorter: true,
            width: 150,
        },
        {
            title: "Module",
            dataIndex: "module",
            key: "module",
            sorter: true,
            width: 120,
        },
        {
            title: "User ID",
            dataIndex: "to_user_id",
            key: "to_user_id",
            sorter: true,
            width: 120,
        },
        {
            title: "Message",
            dataIndex: "message",
            key: "message",
            sorter: true,
            width: 250,
        },
        {
            title: "Status",
            dataIndex: "notifications_status",
            key: "notifications_status",
            sorter: true,
            width: 60,
            render: (status) => getStatusTag(status),
        },
        {
            title: "Created At",
            dataIndex: "created_at",
            key: "created_at",
            sorter: true,
            width: 160,
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
                return `${datePart}, ${timePart}`;
            },
        },
    ];

    // Calculate table data for pagination
    const getNotificationsTableData = () => {
        const { current, pageSize } = notificationsPagination;
        const start = (current - 1) * pageSize;
        const end = start + pageSize;
        return notifications.slice(start, end);
    };

    // Count unread notifications
    const unreadCount = notifications.filter(n => n.notifications_status === 'unread').length;

    // Render main component
    return (
        <div className="notifications">
            <div className="notifications-container">
                <Title level={4} className="page-title">
                    {activeTab === "notifications" ? "Notifications" : ""}
                </Title>
                <Divider className="title-divider" />

                <div className="tabs-wrapper">
                    <Tabs
                        activeKey={activeTab}
                        size="middle"
                        tabBarGutter={8}
                        className="notifications-tabs"
                        type={windowWidth <= 768 ? "card" : "line"}
                        tabPosition="top"
                        destroyInactiveTabPane={false}
                        tabBarExtraContent={{
                            right: (
                                <div className="header-right-content">
                                    <div className="search-container">
                                        <Input.Search
                                            placeholder="Search notifications..."
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
                            tab={
                                <span>
                                    <Badge count={unreadCount} size="small" offset={[5, -3]}>
                                        <BellOutlined />
                                    </Badge>
                                    {windowWidth > 576 ? " Notifications" : ""}
                                </span>
                            }
                            key="notifications"
                        >
                            {/* Notifications tab content */}
                            <div className="table-meta-info">
                                <span className="record-count">
                                    Total Notifications: {notifications.length} 
                                    {unreadCount > 0 && ` (${unreadCount} unread)`}
                                </span>
                                <div className="table-pagination">
                                    <Pagination
                                        current={notificationsPagination.current}
                                        pageSize={notificationsPagination.pageSize}
                                        total={notifications.length}
                                        onChange={handleNotificationsPaginationChange}
                                        showSizeChanger={false}
                                        size="small"
                                    />
                                </div>
                            </div>

                            <div className="table-container">
                                <Table
                                    dataSource={getNotificationsTableData()}
                                    columns={notificationsColumns}
                                    rowKey="notifications_id"
                                    loading={loading}
                                    scroll={{ x: true, y: 400 }}
                                    pagination={false}
                                    bordered
                                    size="middle"
                                    showSorterTooltip={false}
                                    sortDirections={['ascend', 'descend']}
                                    onChange={handleTableChange}
                                    className="scrollable-table"
                                    rowClassName={(record) => record.notifications_status === 'unread' ? 'unread-row' : ''}
                                />
                            </div>
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        </div>
    );
};

export default Notifications;