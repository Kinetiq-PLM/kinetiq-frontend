import React, { useState, useEffect } from "react";
// import { notificationAPI } from "../api/api";
import "../styles/Notification.css";
import {
    Table,
    Button,
    Form,
    Input,
    Tabs,
    Tag,
    Space,
    Popconfirm,
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

const Notification = () => {
    // State variables
    const [notification, setNotification] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    // Pagination states
    const [activeTab] = useState("notification");
    const [notificationPagination, setNotificationPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });

    useEffect(() => {
        fetchNotification();  // idk ano papalit 
    }, []);  // Empty dependency array ensures it runs once on mount

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Data fetching functions
    const fetchNotification = async (searchTerm = "", orderField = "", orderDirection = "") => {
        setLoading(true);
        try {
            const data = await notificationAPI.getNotification({
                search: searchTerm,
                ordering: orderDirection === "descend" ? `-${orderField}` : orderField
            });
            setNotification(data.results || data);
            setNotificationPagination(prev => ({
                ...prev,
                total: (data.results || data).length
            }));
        } catch (error) {
            message.error("Failed to fetch notification");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Handle pagination changes
    const handleNotificationPaginationChange = (page, pageSize) => {
        setNotificationPagination(prev => ({
            ...prev,
            current: page,
            pageSize
        }));
    };

    // Handle search with debounce
    const handleSearch = (value) => {
        setSearchValue(value);
        if (activeTab === "notification") {
            fetchNotification(value);
        }
    };


    // Table columns definitions with sorting added
    const notificationColumns = [
        {
            title: "Notification ID",
            dataIndex: "notification_id",
            key: "notification_id",
            sorter: true,
            width: 100,
        },
        {
            title: "Module",
            dataIndex: "module",
            key: "module",
            sorter: true,
            width: 100,
        },
        {
            title: "To",
            dataIndex: "to_user_id",
            key: "to_user_id",
            sorter: true,
            width: 100,
        },
        {
            title: "Message",
            dataIndex: "message",
            key: "message",
            sorter: true,
            width: 180,
        },        
        {
            title: "Status",
            dataIndex: "notification_status",
            key: "notification_status",
            sorter: true,
            width: 80,
            render: (status) => (
              <Tag color={status === "Read" ? "green" : "red"}>
                {status}
              </Tag>
            ),
        },
        {
            title: "Created At",
            dataIndex: "created_at",
            key: "created_at",
            sorter: true,
            width: 100,
            render: (text) => text ? new Date(text).toLocaleDateString() : '-',
        },     
    ];

    // Calculate table data for pagination
    const getNotificationTableData = () => {
        const { current, pageSize } = notificationPagination;
        const start = (current - 1) * pageSize;
        const end = start + pageSize;
        return notification.slice(start, end);
    };

    // Render main component
    return (
        <div className="notification">
            <div className="notif-container">
                <Title level={4} className="page-title">
                    {activeTab === "notification" ? "Notification" : ""}
                </Title>
                <Divider className="title-divider" />

                <div className="tabs-wrapper">
                    <Tabs
                        activeKey={activeTab}
                        size="middle"
                        tabBarGutter={8}
                        className="notif-tabs"
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
                            tab={<span><UserOutlined /> {windowWidth > 576 ? "Notification" : ""}</span>}
                            key="notification"
                        >
                            {/* Notif tab content */}
                            <div className="table-meta-info">
                                <span className="record-count">Total Notifications: {notification.length}</span>
                                <div className="table-pagination">
                                    <Pagination
                                        current={notificationPagination.current}
                                        pageSize={notificationPagination.pageSize}
                                        total={notification.length}
                                        onChange={handleNotificationPaginationChange}
                                        showSizeChanger={false}
                                        size="small"
                                    />
                                </div>
                            </div>

                            <div className="table-container">
                                <Table
                                    dataSource={getNotificationTableData()}
                                    columns={notificationColumns}
                                    rowKey="notification_id"
                                    loading={loading}
                                    scroll={{ x: true, y: 400 }}
                                    pagination={false}
                                    bordered
                                    size="middle"
                                    showSorterTooltip={false}
                                    sortDirections={['ascend', 'descend']}
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

export default Notification;

