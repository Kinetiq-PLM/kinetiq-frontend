import React, { useState, useEffect } from "react";
import { 
  itemMasterDataAPI, 
  vendorAPI
} from "../api/api";
import "../styles/ItemMasterlist.css";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Tabs,
  Space,
  Tag,
  Popconfirm,
  message,
  Spin,
  InputNumber,
  Typography,
  Divider,
  Pagination
} from "antd";
import { 
  ToolOutlined, 
  ShoppingOutlined, 
  ExperimentOutlined, 
  AppstoreOutlined, 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  UndoOutlined,
  EyeOutlined,
  SearchOutlined
} from "@ant-design/icons";

const { TabPane } = Tabs;
const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const ItemMasterManagement = () => {
  // State variables
  const [activeTab, setActiveTab] = useState("items");
  const [items, setItems] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [archivedItems, setArchivedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [archivedSearchValue, setArchivedSearchValue] = useState("");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  // Pagination states
  const [itemPagination, setItemPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  // Modal states
  const [itemModalVisible, setItemModalVisible] = useState(false);
  const [addItemModalVisible, setAddItemModalVisible] = useState(false);
  const [archiveModalVisible, setArchiveModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add", "edit", or "view"
  const [archiveType, setArchiveType] = useState(""); // To track which archive modal is open

  // Form states
  const [itemForm] = Form.useForm();
  const [addItemForm] = Form.useForm();

  // Unit of measure options
  const uomOptions = [
    "kg",
    "mm",
    "sh",
    "bx",
    "l",
    "m",
    "gal",
    "pcs",
    "set",
    "unit",
  ];

  // Item type options
  const itemTypeOptions = [
    "Asset",
    "Product",
    "Raw Material"
  ];

  // Item management options
  const manageByOptions = [
    "Serial Number",
    "Batch Number",
    "None"
  ];

  // Fetch data when component mounts or tab changes
  useEffect(() => {
    if (activeTab === "items") {
      fetchItems();
      fetchVendors();
    }
  }, [activeTab]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Data fetching functions
  const fetchItems = async (searchTerm = "", orderField = "", orderDirection = "") => {
    setLoading(true);
    try {
      const data = await itemMasterDataAPI.getItems({ 
        search: searchTerm,
        ordering: orderDirection === "descend" ? `-${orderField}` : orderField
      });
      setItems(data.results || data);
      setItemPagination(prev => ({
        ...prev,
        total: (data.results || data).length
      }));
    } catch (error) {
      message.error("Failed to fetch items");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVendors = async () => {
    setLoading(true);
    try {
        const data = await vendorAPI.getVendors();
        setVendors(data.results || data);
    } catch (error) {
        message.error("Failed to fetch vendors");
        console.error(error);
    } finally {
        setLoading(false);
    }
  };

  const fetchArchivedItems = async (searchTerm = "", orderField = "", orderDirection = "") => {
    setLoading(true);
    try {
      const params = {
        search: searchTerm || "",
      };
  
      if (orderField) {
        params.ordering = orderDirection === "descend" ? `-${orderField}` : orderField;
      }
  
      const data = await itemMasterDataAPI.getArchivedItems(params);
      setArchivedItems(data.results || data);
      setArchiveType("items");
      setArchiveModalVisible(true);
    } catch (error) {
      message.error("Failed to fetch archived items");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle archived search
  const handleArchivedSearch = (value) => {
    setArchivedSearchValue(value);
    if (archiveType === "items")
      fetchArchivedItems(value);
  };

  // Prevent layout jump when changing tabs
  const handleTabChange = (key) => {
    // Save current scroll position
    const scrollPosition = window.scrollY;
    
    setActiveTab(key);
    setSearchValue(""); // Clear search when switching tabs
    
    // Restore scroll position after state update
    setTimeout(() => {
      window.scrollTo(0, scrollPosition);
    }, 0);
  };

  const handleTableChange = (pagination, filters, sorter, extra) => {
    if (sorter && sorter.field) {
      const orderField = sorter.field;
      const orderDirection = sorter.order;
      
      if (activeTab === "items")
        fetchItems(searchValue, orderField, orderDirection);
    }
  };

  const handleArchivedTableChange = (pagination, filters, sorter, extra) => {
    if (sorter && sorter.field) {
      const orderField = sorter.field;
      const orderDirection = sorter.order;
      
      if (activeTab === "items")
        fetchArchivedItems(searchValue, orderField, orderDirection);
    }
  };

  // Handle pagination changes
  const handleItemPaginationChange = (page, pageSize) => {
    setItemPagination(prev => ({
      ...prev,
      current: page,
      pageSize
    }));
  };

  // Add Item handler
  const handleAddItem = () => {
    setModalMode("add");
    // Set default values for required fields
    addItemForm.resetFields();
    addItemForm.setFieldsValue({
      item_type: "Product",
      unit_of_measure: "kg",
      item_status: "Active",
      manage_item_by: "Serial Number"
    });
    setAddItemModalVisible(true);
  };

  // handleAddItemSubmit function - For the Add/Edit Item modal
const handleAddItemSubmit = async (values) => {
  try {
    // Process form values to ensure empty fields are set to null
    const processedValues = Object.keys(values).reduce((acc, key) => {
      // Check if the value is undefined, null, empty string, or NaN
      const isEmpty = values[key] === undefined || 
                      values[key] === null || 
                      values[key] === '' || 
                      (typeof values[key] === 'number' && isNaN(values[key]));
      
      // Set required fields to their default values if empty
      if (isEmpty) {
        if (key === 'item_type') {
          acc[key] = modalMode === "edit" ? selectedRecord.item_type : "Product";
        } else if (key === 'unit_of_measure') {
          acc[key] = modalMode === "edit" ? selectedRecord.unit_of_measure : "kg";
        } else if (key === 'item_status') {
          acc[key] = modalMode === "edit" ? selectedRecord.item_status : "Active";
        } else if (key === 'manage_item_by') {
          acc[key] = modalMode === "edit" ? selectedRecord.manage_item_by : "Serial Number";
        } else {
          // For non-required fields, set to null if empty
          acc[key] = null;
        }
      } else {
        // Keep the original value if not empty
        acc[key] = values[key];
      }
      return acc;
    }, {});
    
    if (modalMode === "add") {
      await itemMasterDataAPI.createItem(processedValues);
      message.success("Item created successfully");
    } else {
      await itemMasterDataAPI.updateItem(selectedRecord.item_id, processedValues);
      message.success("Item updated successfully");
    }
    setAddItemModalVisible(false);
    fetchItems();
  } catch (error) {
    message.error(`Failed to ${modalMode === "add" ? "create" : "update"} item: ${error.response?.data?.message || error.message}`);
  }
};

  // Item form handlers
  const handleViewItem = (record) => {
    setModalMode("view");
    setSelectedRecord(record);
    itemForm.setFieldsValue({      
      preferred_vendor: record.preferred_vendor,
      purchasing_uom: record.purchasing_uom,
      items_per_purchase_unit: record.items_per_purchase_unit,
      purchase_quantity_per_package: record.purchase_quantity_per_package,
      sales_uom: record.sales_uom,
      items_per_sale_unit: record.items_per_sale_unit,
      sales_quantity_per_package: record.sales_quantity_per_package
    });
    setItemModalVisible(true);
  };

  const handleEditItem = (record) => {
    setModalMode("edit");
    setSelectedRecord(record);
    setAddItemModalVisible(true);
    
    // Set all form fields with existing values from the record
    addItemForm.setFieldsValue({
      item_name: record.item_name,
      item_description: record.item_description,
      item_type: record.item_type,
      unit_of_measure: record.unit_of_measure,
      item_status: record.item_status,
      manage_item_by: record.manage_item_by,
      preferred_vendor: record.preferred_vendor,
      purchasing_uom: record.purchasing_uom,
      items_per_purchase_unit: record.items_per_purchase_unit,
      purchase_quantity_per_package: record.purchase_quantity_per_package,
      sales_uom: record.sales_uom,
      items_per_sale_unit: record.items_per_sale_unit,
      sales_quantity_per_package: record.sales_quantity_per_package
    });
  };

  // Item form handlers - For the view/edit modal
const handleItemFormSubmit = async (values) => {
  try {
    // Process form values to ensure empty fields are set to null
    const processedValues = Object.keys(values).reduce((acc, key) => {
      // Check if the value is undefined, null, empty string, or NaN
      const isEmpty = values[key] === undefined || 
                      values[key] === null || 
                      values[key] === '' || 
                      (typeof values[key] === 'number' && isNaN(values[key]));
      
      // For all fields in this form, set to null if empty (these are all non-required fields)
      acc[key] = isEmpty ? null : values[key];
      return acc;
    }, {});
    
    await itemMasterDataAPI.updateItem(selectedRecord.item_id, processedValues);
    message.success("Item updated successfully");
    setItemModalVisible(false);
    fetchItems();
  } catch (error) {
    message.error(`Failed to update item: ${error.response?.data?.message || error.message}`);
  }
};

  // Archive/Restore handlers
  const handleArchiveItem = async (itemId) => {
    try {
      await itemMasterDataAPI.archiveItem(itemId);
      message.success("Item archived successfully");
      fetchItems();
    } catch (error) {
      message.error("Failed to archive item");
    }
  };

  const handleRestoreItem = async (itemId) => {
    try {
      await itemMasterDataAPI.restoreItem(itemId);
      message.success("Item restored successfully");
      fetchArchivedItems(archivedSearchValue);
      fetchItems();
    } catch (error) {
      message.error("Failed to restore item");
    }
  };

  // Handle search with debounce
  const handleSearch = (value) => {
    setSearchValue(value);
    if (activeTab === "items")
      fetchItems(value);
  };

  // Table columns definitions
  const itemColumns = [
    {
      title: "Item ID",
      dataIndex: "item_id",
      key: "item_id",
      sorter: true,
      width: 150,
    },
    {
      title: "Item Name",
      dataIndex: "item_name",
      key: "item_name",
      sorter: true,
      width: 180,
    },
    {
      title: "Item Description",
      dataIndex: "item_description",
      key: "item_description",
      sorter: true,
      width: 200,
    },
    {
      title: "Type",
      dataIndex: "item_type",
      key: "item_type",
      sorter: true,
      width: 40,
      render: (type) => {
        let color = "default";
        if (type === "Asset") color = "blue";
        if (type === "Product") color = "green";
        if (type === "Raw Material") color = "orange";
        
        return (
          <Tag color={color}>
            {type}
          </Tag>
        );
      },
    },
    {
      title: "UOM",
      dataIndex: "unit_of_measure",
      key: "unit_of_measure",
      sorter: true,
      width: 80,
    },
    {
      title: "Status",
      dataIndex: "item_status",
      key: "item_status",
      sorter: true,
      width: 80,
      render: (status) => (
        <Tag color={status === "Active" ? "green" : "red"}>
          {status}
        </Tag>
      ),
    },
    {
      title: "Manage By",
      dataIndex: "manage_item_by",
      key: "manage_item_by",
      sorter: true,
      width: 110,
      render: (text) => text || "None",
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
      align: "center",
      render: (_, record) => (
        <Space size="small">
          <Button 
            icon={<EyeOutlined />} 
            size="small"
            onClick={() => handleViewItem(record)}
          />
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            size="small"
            onClick={() => handleEditItem(record)}
          />
          <Popconfirm
            title="Are you sure you want to archive this item?"
            popupPlacement="topRight"
            onConfirm={() => handleArchiveItem(record.item_id)}
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

  const archivedItemColumns = [
    {
        title: "Item ID",
        dataIndex: "item_id",
        key: "item_id",
        sorter: true,
        width: 180,
      },
      {
        title: "Item Name",
        dataIndex: "item_name",
        key: "item_name",
        sorter: true,
        width: 180,
      },
      {
        title: "Item Description",
        dataIndex: "item_description",
        key: "item_description",
        sorter: true,
        width: 200,
      },
      {
        title: "Item Type",
        dataIndex: "item_type",
        key: "item_type",
        sorter: true,
        width: 60,
        render: (type) => {
          let color = "default";
          if (type === "Asset") color = "blue";
          if (type === "Product") color = "green";
          if (type === "Raw Material") color = "orange";
          
          return (
            <Tag color={color}>
              {type}
            </Tag>
          );
        },
      },
      {
        title: "Unit of Measure",
        dataIndex: "unit_of_measure",
        key: "unit_of_measure",
        sorter: true,
        width: 120,
      },
      {
        title: "Status",
        dataIndex: "item_status",
        key: "item_status",
        sorter: true,
        width: 100,
        render: (status) => (
          <Tag color={status === "Active" ? "green" : "red"}>
            {status}
          </Tag>
        ),
      },
      {
        title: "Manage By",
        dataIndex: "manage_item_by",
        key: "manage_item_by",
        sorter: true,
        width: 150,
        render: (text) => text || "None",
      },
      {
        title: "Actions",
        key: "actions",
        width: 100,
        align: "center",
        render: (_, record) => (
          <Space size="small">
            <Button 
              icon={<EyeOutlined />} 
              size="small"
              onClick={() => handleViewItem(record)}
            />
            <Popconfirm
            title="Are you sure you want to restore this item?"
            onConfirm={() => handleRestoreItem(record.item_id)}
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
  const getItemTableData = () => {
    const { current, pageSize } = itemPagination;
    const start = (current - 1) * pageSize;
    const end = start + pageSize;
    return items.slice(start, end);
  };

  // Render main component
  return (
    <div className="item-master">
      <div className="item-master-container">
        <Title level={4} className="page-title">
          {activeTab === "items" ? "Item Master" :
           activeTab === "assets" ? "Asset Management" :
           "Raw Material Management"}
        </Title>
        <Divider className="title-divider" />
        
        <div className="tabs-wrapper">
          <Tabs 
            activeKey={activeTab} 
            onChange={handleTabChange}
            size="middle"
            tabBarGutter={8}
            className="item-tabs"
            type={windowWidth <= 768 ? "card" : "line"}
            tabPosition="top"
            destroyInactiveTabPane={false}
            tabBarExtraContent={{
              right: (
                <div className="header-right-content">
                  <div className="search-container">
                    <Input.Search
                      placeholder={`Search ${activeTab}...`}
                      allowClear
                      onSearch={handleSearch}
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      prefix={<SearchOutlined />}
                    />
                  </div>
                  <div className="action-buttons">
                    {activeTab === "items" && (
                      <>
                        <Button 
                          icon={<EyeOutlined />} 
                          onClick={() => fetchArchivedItems("")}
                          className={`archive-btn ${windowWidth <= 576 ? "icon-only-btn" : ""}`}
                        >
                          {windowWidth > 576 ? "View Archived" : ""}
                        </Button>
                        <Button 
                          type="primary" 
                          icon={<PlusOutlined />} 
                          onClick={handleAddItem}
                          className={windowWidth <= 576 ? "icon-only-btn" : ""}
                        >
                          {windowWidth > 576 ? "Add Item" : ""}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              )
            }}
          >
            <TabPane 
              tab={<span><AppstoreOutlined /> {windowWidth > 576 ? "Items" : ""}</span>} 
              key="items"
            >
              {/* Items tab content */}
              <div className="table-meta-info">
                <span className="record-count">Total Items: {items.length}</span>
                <div className="table-pagination">
                  <Pagination 
                    current={itemPagination.current}
                    pageSize={itemPagination.pageSize}
                    total={items.length}
                    onChange={handleItemPaginationChange}
                    showSizeChanger={false}
                    size="small"
                  />
                </div>
              </div>
              
              <div className="table-container">
                <Table 
                  dataSource={getItemTableData()} 
                  columns={itemColumns} 
                  rowKey="item_id"
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

        {/* Item Modal */}
        <Modal
          title={modalMode === "view" ? "Item Details" : "Edit Item Details"}
          visible={itemModalVisible}
          onCancel={() => setItemModalVisible(false)}
          footer={modalMode === "view" ? [
              <Button key="close" onClick={() => setItemModalVisible(false)}>
              Close
              </Button>
          ] : null}
          width={600}
          className="custom-modal"
        >
          {modalMode === "view" ? (
            <div className="info-view">
              <div className="info-section">
                <h3>Vendor Information</h3>
                <div className="info-content">
                  <div className="info-item">
                    <span className="info-label">Preferred Vendor:</span>
                    <span className="info-value">{
                      selectedRecord?.preferred_vendor ? 
                        vendors.find(v => v.vendor_code === selectedRecord.preferred_vendor)?.company_name || 'None' : 
                        'None'
                    }</span>
                  </div>
                </div>
              </div>

              <div className="info-section">
                <h3>Purchasing Information</h3>
                <div className="info-content">
                  <div className="info-item">
                    <span className="info-label">Purchasing UOM:</span>
                    <span className="info-value">{selectedRecord?.purchasing_uom || 'None'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Items Per Purchase Unit:</span>
                    <span className="info-value">{selectedRecord?.items_per_purchase_unit || '0'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Purchase Quantity Per Package:</span>
                    <span className="info-value">{selectedRecord?.purchase_quantity_per_package || '0'}</span>
                  </div>
                </div>
              </div>
              
              <div className="info-section">
                <h3>Sales Information</h3>
                <div className="info-content">
                  <div className="info-item">
                    <span className="info-label">Sales UOM:</span>
                    <span className="info-value">{selectedRecord?.sales_uom || 'None'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Items Per Sale Unit:</span>
                    <span className="info-value">{selectedRecord?.items_per_sale_unit || '0'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Sales Quantity Per Package:</span>
                    <span className="info-value">{selectedRecord?.sales_quantity_per_package || '0'}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Form
              form={itemForm}
              layout="vertical"
              onFinish={handleItemFormSubmit}
            >
              <Form.Item
                name="preferred_vendor"
                label="Preferred Vendor"
              >
                <Select allowClear placeholder="Select a vendor">
                  {vendors.map(vendor => (
                    <Option key={vendor.vendor_code} value={vendor.vendor_code}>
                      {vendor.company_name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Divider orientation="left" style={{ borderColor: '#00A8A8', color: '#00A8A8' }}>Purchasing Information</Divider>
              <Form.Item
                name="purchasing_uom"
                label="Purchasing UOM"
              >
                <Select allowClear placeholder="Select unit of measure">
                  {uomOptions.map(uom => (
                    <Option key={uom} value={uom}>
                      {uom}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="items_per_purchase_unit"
                label="Items Per Purchase Unit"
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item
                name="purchase_quantity_per_package"
                label="Purchase Quantity Per Package"
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>

              <Divider orientation="left" style={{ borderColor: '#00A8A8', color: '#00A8A8' }}>Sales Information</Divider>
              <Form.Item
                name="sales_uom"
                label="Sales UOM"
              >
                <Select allowClear placeholder="Select unit of measure">
                  {uomOptions.map(uom => (
                    <Option key={uom} value={uom}>
                      {uom}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="items_per_sale_unit"
                label="Items Per Sale Unit"
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item
                name="sales_quantity_per_package"
                label="Sales Quantity Per Package"
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item className="form-actions">
                <Space>
                  <Button 
                    type="primary" 
                    htmlType="submit"
                    style={{ backgroundColor: '#00A8A8', borderColor: '#00A8A8' }}
                  >
                    Update
                  </Button>
                  <Button onClick={() => setItemModalVisible(false)}>
                    Cancel
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          )}
        </Modal>

        {/* Add/Edit Item Modal */}
        <Modal
          title={modalMode === "add" ? "Add New Item" : "Edit Item"}
          visible={addItemModalVisible}
          onCancel={() => setAddItemModalVisible(false)}
          footer={null}
          width={600}
          className="custom-modal"
        >
          <Form
            form={addItemForm}
            layout="vertical"
            onFinish={handleAddItemSubmit}
            initialValues={{
              item_type: "Product",
              unit_of_measure: "kg",
              item_status: "Active",
              manage_item_by: "Serial Number"
            }}
          >
            <Form.Item
              name="item_name"
              label="Item Name"
              rules={[{ required: true, message: "Please enter item name" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="item_description"
              label="Item Description"
              rules={[{ required: true, message: "Please enter item description" }]}
            >
              <TextArea rows={3} />
            </Form.Item>

            <Form.Item
              name="item_type"
              label="Item Type"
              rules={[{ required: true, message: "Please select item type" }]}
            >
              <Select placeholder="Select item type">
                {itemTypeOptions.map(type => (
                  <Option key={type} value={type}>
                    {type}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="unit_of_measure"
              label="Unit of Measure"
              rules={[{ required: true, message: "Please select unit of measure" }]}
            >
              <Select placeholder="Select unit of measure">
                {uomOptions.map(uom => (
                  <Option key={uom} value={uom}>
                    {uom}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="manage_item_by"
              label="Manage By"
              rules={[{ required: true, message: "Please select management method" }]}
            >
              <Select placeholder="Select management method">
                {manageByOptions.map(option => (
                  <Option key={option} value={option}>
                    {option}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="item_status"
              label="Status"
              rules={[{ required: true, message: "Please select status" }]}
            >
              <Select>
                <Option value="Active">Active</Option>
                <Option value="Inactive">Inactive</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="preferred_vendor"
              label="Preferred Vendor"
            >
              <Select allowClear placeholder="Select a vendor">
                {vendors.map(vendor => (
                  <Option key={vendor.vendor_code} value={vendor.vendor_code}>
                    {vendor.company_name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Divider orientation="left" style={{ borderColor: '#00A8A8', color: '#00A8A8' }}>Purchasing Information</Divider>
            <Form.Item
              name="purchasing_uom"
              label="Purchasing UOM"
            >
              <Select allowClear placeholder="Select unit of measure">
              {uomOptions.map(uom => (
                  <Option key={uom} value={uom}>
                    {uom}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="items_per_purchase_unit"
              label="Items Per Purchase Unit"
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="purchase_quantity_per_package"
              label="Purchase Quantity Per Package"
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>

            <Divider orientation="left" style={{ borderColor: '#00A8A8', color: '#00A8A8' }}>Sales Information</Divider>
            <Form.Item
              name="sales_uom"
              label="Sales UOM"
            >
              <Select allowClear placeholder="Select unit of measure">
                {uomOptions.map(uom => (
                  <Option key={uom} value={uom}>
                    {uom}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="items_per_sale_unit"
              label="Items Per Sale Unit"
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="sales_quantity_per_package"
              label="Sales Quantity Per Package"
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item className="form-actions">
              <Space>
                <Button 
                  type="primary" 
                  htmlType="submit"
                  style={{ backgroundColor: '#00A8A8', borderColor: '#00A8A8' }}
                >
                  {modalMode === "add" ? "Create" : "Update"}
                </Button>
                <Button onClick={() => setAddItemModalVisible(false)}>
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        {/* Archived Items Modal */}
        <Modal
          title="Archived Items"
          visible={archiveModalVisible}
          onCancel={() => setArchiveModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setArchiveModalVisible(false)}>
              Close
            </Button>
          ]}
          width={900}
          className="archive-modal"
        >
          <div className="archived-search-container">
            <Input.Search
              placeholder="Search archived items..."
              allowClear
              onSearch={handleArchivedSearch}
              value={archivedSearchValue}
              onChange={(e) => setArchivedSearchValue(e.target.value)}
              style={{ marginBottom: 16 }}
            />
          </div>
          <Table 
            dataSource={archivedItems} 
            columns={archivedItemColumns} 
            rowKey="item_id"
            loading={loading}
            pagination={{ pageSize: 5 }}
            scroll={{ x: true }}
            size="middle"
            onChange={handleArchivedTableChange}
          />
        </Modal>
      </div>
    </div>
  );
};

export default ItemMasterManagement;