import React, { useState, useEffect } from "react";
import { warehouseAPI } from "../api/api";
import "../styles/Warehouse.css";
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    Tabs,
    Space,
    Popconfirm,
    message,
    Typography,
    Divider,
    Pagination
} from "antd";
import {
    UserOutlined,
    PlusOutlined,
    EyeOutlined,
    EditOutlined,
    DeleteOutlined,
    UndoOutlined,
    SearchOutlined
} from "@ant-design/icons";

const { TabPane } = Tabs;
const { Title } = Typography;
const { TextArea } = Input;

const Warehouse = () => {
    // State variables
    const [warehouse, setWarehouse] = useState([]);
    const [archivedWarehouse, setArchivedWarehouse] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [searchValue, setSearchValue] = useState("");
    const [archivedSearchValue, setArchivedSearchValue] = useState("");
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [viewDetailsModalVisible, setViewDetailsModalVisible] = useState(false);

    // Pagination states
    const [activeTab] = useState("warehouse");
    const [warehousePagination, setWarehousePagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });

    // Modal states
    const [warehouseModalVisible, setWarehouseModalVisible] = useState(false);
    const [archiveModalVisible, setArchiveModalVisible] = useState(false);
    const [modalMode, setModalMode] = useState("add"); // "add" or "edit"

    // Form states
    const [warehouseForm] = Form.useForm();

    useEffect(() => {
        fetchWarehouse();  // Fetch the warehouse data when the component mounts
    }, []);  // Empty dependency array ensures it runs once on mount

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Data fetching functions
    const fetchWarehouse = async (searchTerm = "", orderField = "", orderDirection = "") => {
        setLoading(true);
        try {
            const data = await warehouseAPI.getWarehouses({
                search: searchTerm,
                ordering: orderDirection === "descend" ? `-${orderField}` : orderField
            });
            setWarehouse(data.results || data);
            setWarehousePagination(prev => ({
                ...prev,
                total: (data.results || data).length
            }));
        } catch (error) {
            message.error("Failed to fetch warehouse");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchArchivedWarehouse = async (searchTerm = "", orderField = "", orderDirection = "") => {
        setLoading(true);
        try {
            // Create params object with search term
            const params = {
                search: searchTerm || "",
            };

            // Add ordering if provided
            if (orderField) {
                params.ordering = orderDirection === "descend" ? `-${orderField}` : orderField;
            }

            const data = await warehouseAPI.getArchivedWarehouses(params);
            setArchivedWarehouse(data.results || data);
            setArchiveModalVisible(true);
        } catch (error) {
            message.error("Failed to fetch archived warehouses");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Update the handleArchivedSearch function
    const handleArchivedSearch = (value) => {
        setArchivedSearchValue(value);
        fetchArchivedWarehouse(value);
    };

    // Handle pagination changes
    const handleWarehousePaginationChange = (page, pageSize) => {
        setWarehousePagination(prev => ({
            ...prev,
            current: page,
            pageSize
        }));
    };

    // User form handlers
    const handleAddWarehouse = () => {
        setModalMode("add");
        warehouseForm.resetFields();
        setWarehouseModalVisible(true);
    };

    const handleViewDetails = (record) => {
        setSelectedRecord(record);
        setViewDetailsModalVisible(true);
    };

    const handleEditWarehouse = (record) => {
        setModalMode("edit");
        setSelectedRecord(record);
        warehouseForm.setFieldsValue({
            warehouse_location: record.warehouse_location,
            stored_materials: record.stored_materials,
        });
        setWarehouseModalVisible(true);
    };

    const handleWarehouseFormSubmit = async (values) => {
        try {
            if (modalMode === "add") {
                await warehouseAPI.createWarehouse(values);
                message.success("Warehouse created successfully");
            } else {
                await warehouseAPI.updateWarehouse(selectedRecord.warehouse_id, values);
                message.success("Warehouse updated successfully");
            }
            setWarehouseModalVisible(false);
            fetchWarehouse();
        } catch (error) {
            message.error(`Failed to ${modalMode} warehouse: ${error.response?.data?.message || error.message}`);
        }
    };

    const handleArchiveWarehouse = async (warehouseId) => {
        try {
            await warehouseAPI.archiveWarehouse(warehouseId);
            message.success("Warehouse archived successfully");
            fetchWarehouse();
        } catch (error) {
            message.error("Failed to archive warehouse");
        }
    };

    const handleRestoreWarehouse = async (roleId) => {
        try {
            await warehouseAPI.restoreWarehouse(roleId);
            message.success("Warehouse restored successfully");
            fetchArchivedWarehouse(archivedSearchValue); // Keep current search term
            fetchWarehouse(); // Refresh active roles list
        } catch (error) {
            message.error("Failed to restore warehouse");
        }
    };

    // Handle search with debounce
    const handleSearch = (value) => {
        setSearchValue(value);
        if (activeTab === "warehouse") {
            fetchWarehouse(value);
        }
    };

    // Handle table sorting
    const handleTableChange = (pagination, filters, sorter, extra) => {
        if (sorter && sorter.field) {
            const orderField = sorter.field;
            const orderDirection = sorter.order;
            fetchWarehouse(searchValue, orderField, orderDirection);
        }
    };

    const handleArchivedTableChange = (pagination, filters, sorter, extra) => {
        if (sorter && sorter.field) {
            const orderField = sorter.field;
            const orderDirection = sorter.order;
            fetchArchivedWarehouse(archivedSearchValue, orderField, orderDirection);
        }
    };

    // Table columns definitions with sorting added
    const warehouseColumns = [
        {
            title: "Warehouse ID",
            dataIndex: "warehouse_id",
            key: "warehouse_id",
            sorter: true,
            width: 120,
        },
        {
            title: "Warehouse Location",
            dataIndex: "warehouse_location",
            key: "warehouse_location",
            sorter: true,
            width: 120,
        },
        {
            title: "Stored Materials",
            dataIndex: "stored_materials",
            key: "stored_materials",
            sorter: true,
            width: 300,
        },
        {
            title: "Actions",
            key: "actions",
            width: 80, // Increased width for 3 buttons
            align: "center",
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        size="small"
                        onClick={() => handleEditWarehouse(record)}
                    />
                    <Popconfirm
                        title="Are you sure you want to archive this warehouse?"
                        onConfirm={() => handleArchiveWarehouse(record.warehouse_id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            danger
                            icon={<DeleteOutlined />}
                            size="small"
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const archivedWarehouseColumns = [
        {
            title: "Warehouse ID",
            dataIndex: "warehouse_id",
            key: "warehouse_id",
            sorter: true,
            sortDirections: ['ascend', 'descend'],
            width: 200,
        },
        {
            title: "Warehouse Location",
            dataIndex: "warehouse_location",
            key: "warehouse_location",
            sorter: true,
            sortDirections: ['ascend', 'descend'],
            render: (text) => text.replace("ARCHIVED_", ""),
        },
        {
            title: "Stored Materials",
            dataIndex: "stored_materials",
            key: "stored_materials",
            sorter: true,
            sortDirections: ['ascend', 'descend'],
        },
        {
            title: "Actions",
            key: "actions",
            width: 80,
            align: "center",
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="primary"
                        icon={<EyeOutlined />}
                        size="small"
                        onClick={() => handleViewDetails(record)}
                    />
                    <Popconfirm
                        title="Are you sure you want to restore this warehouse?"
                        onConfirm={() => handleRestoreWarehouse(record.warehouse_id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            type="primary"
                            icon={<UndoOutlined />}
                            size="small"
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    // Calculate table data for pagination
    const getWarehouseTableData = () => {
        const { current, pageSize } = warehousePagination;
        const start = (current - 1) * pageSize;
        const end = start + pageSize;
        return warehouse.slice(start, end);
    };

    // Render main component
    return (
        <div className="warehouse">
            <div className="warehouse-container">
                <Title level={4} className="page-title">
                    {activeTab === "warehouse" ? "Warehouse Management" : ""}
                </Title>
                <Divider className="title-divider" />

                <div className="tabs-wrapper">
                    <Tabs
                        activeKey={activeTab}
                        size="middle"
                        tabBarGutter={8}
                        className="warehouse-tabs"
                        type={windowWidth <= 768 ? "card" : "line"}
                        tabPosition="top"
                        destroyInactiveTabPane={false}
                        tabBarExtraContent={{
                            right: (
                                <div className="header-right-content">
                                    <div className="search-container">
                                        <Space style={{ float: "right" }} size="middle">
                                            <Input.Search
                                                placeholder={activeTab === "warehouse" ? "Search warehouses..." : ""}
                                                allowClear
                                                onSearch={handleSearch}
                                                value={searchValue}
                                                onChange={(e) => setSearchValue(e.target.value)}
                                                prefix={<SearchOutlined />}
                                            />
                                            <Button
                                                icon={<EyeOutlined />}
                                                onClick={() => {
                                                    setArchivedSearchValue("");
                                                    fetchArchivedWarehouse("");
                                                }}
                                                className={`archive-btn ${windowWidth <= 576 ? "icon-only-btn" : ""}`}
                                            >
                                                {windowWidth > 576 ? "View Archived" : ""}
                                            </Button>
                                        </Space>
                                    </div>
                                    <div className="action-buttons">
                                        {activeTab === "warehouse" && (
                                            <Button
                                                type="primary"
                                                icon={<PlusOutlined />}
                                                onClick={handleAddWarehouse}
                                                className={windowWidth <= 576 ? "icon-only-btn" : ""}
                                            >
                                                {windowWidth > 576 ? "Add Warehouse" : ""}
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            )
                        }}
                    >
                        <TabPane
                            tab={<span><UserOutlined /> {windowWidth > 576 ? "Warehouses" : ""}</span>}
                            key="warehouse"
                        >
                            {/* Warehouse tab content */}
                            <div className="table-meta-info">
                                <span className="record-count">Total Warehouses: {warehouse.length}</span>
                                <div className="table-pagination">
                                    <Pagination
                                        current={warehousePagination.current}
                                        pageSize={warehousePagination.pageSize}
                                        total={warehouse.length}
                                        onChange={handleWarehousePaginationChange}
                                        showSizeChanger={false}
                                        size="small"
                                    />
                                </div>
                            </div>

                            <div className="table-container">
                                <Table
                                    dataSource={getWarehouseTableData()}
                                    columns={warehouseColumns}
                                    rowKey="warehouse_id"
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

                {/* Warehouse Modal */}
                <Modal
                    title={modalMode === "add" ? "Add New Warehouse" : "Edit Warehouse"}
                    visible={warehouseModalVisible}
                    onCancel={() => setWarehouseModalVisible(false)}
                    footer={null}
                    width={700}
                    className="custom-modal"
                >
                    <Form
                        form={warehouseForm}
                        layout="vertical"
                        onFinish={handleWarehouseFormSubmit}
                    >
                        <Form.Item
                            name="warehouse_location"
                            label="Warehouse Location"
                            rules={[{ required: true, message: "Please enter warehouse location" }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="stored_materials"
                            label="Stored Materials"
                        >
                            <TextArea rows={4} />
                        </Form.Item>

                        <Form.Item className="form-actions">
                            <Space>
                                <Button type="primary" htmlType="submit">
                                    {modalMode === "add" ? "Create" : "Update"}
                                </Button>
                                <Button onClick={() => setWarehouseModalVisible(false)}>
                                    Cancel
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </Modal>

                {/* View Details Modal */}
                <Modal
                    title="Warehouse Details"
                    visible={viewDetailsModalVisible}
                    onCancel={() => setViewDetailsModalVisible(false)}
                    footer={[
                        <Button key="close" onClick={() => setViewDetailsModalVisible(false)}>
                            Close
                        </Button>
                    ]}
                    width={700}
                    className="custom-modal"
                >
                    {selectedRecord && (
                        <div className="warehouse-details">
                            <div className="detail-item">
                                <Typography.Text strong>Warehouse ID:</Typography.Text>
                                <Typography.Text>{selectedRecord.warehouse_id}</Typography.Text>
                            </div>
                            <div className="detail-item">
                                <Typography.Text strong>Warehouse Location:</Typography.Text>
                                <Typography.Text>
                                    {selectedRecord.warehouse_location && selectedRecord.warehouse_location.startsWith("ARCHIVED_") 
                                        ? selectedRecord.warehouse_location.replace("ARCHIVED_", "") 
                                        : selectedRecord.warehouse_location}
                                </Typography.Text>
                            </div>
                            <div className="detail-item">
                                <Typography.Text strong>Stored Materials:</Typography.Text>
                                <Typography.Paragraph>
                                    {selectedRecord.stored_materials || "No materials information available"}
                                </Typography.Paragraph>
                            </div>
                        </div>
                    )}
                </Modal>

                {/* Archived Warehouses Modal */}
                <Modal
                    title="Archived Warehouse"
                    visible={archiveModalVisible}
                    onCancel={() => setArchiveModalVisible(false)}
                    footer={[
                        <Button key="close" onClick={() => setArchiveModalVisible(false)}>
                            Close
                        </Button>
                    ]}
                    width={900}
                    className="custom-modal"
                >
                    <div className="archived-search-container" style={{ marginBottom: '16px' }}>
                        <Input.Search
                            placeholder="Search archived warehouses..."
                            allowClear
                            onSearch={handleArchivedSearch}
                            value={archivedSearchValue}
                            onChange={(e) => setArchivedSearchValue(e.target.value)}
                            prefix={<SearchOutlined />}
                        />
                    </div>
                    <Table
                        dataSource={archivedWarehouse}
                        columns={archivedWarehouseColumns}
                        rowKey="warehouse_id"
                        loading={loading}
                        scroll={{ x: 'max-content' }}
                        pagination={{
                            pageSize: 7,
                            responsive: true,
                            size: 'small',
                            position: ['bottomCenter']
                        }}
                        bordered
                        size="middle"
                        showSorterTooltip={false}
                        sortDirections={['ascend', 'descend']}
                        onChange={handleArchivedTableChange}
                    />
                </Modal>
            </div>
        </div>
    );
};

export default Warehouse;