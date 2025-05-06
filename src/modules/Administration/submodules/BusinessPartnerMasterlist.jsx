import React, { useState, useEffect } from "react";
import { businessPartnerAPI, vendorAPI } from "../api/api";
import "../styles/BusinessPartner.css";
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
  Typography,
  Divider,
  Pagination,
  Descriptions
} from "antd";
import { 
  UserOutlined, 
  ShopOutlined, 
  EditOutlined, 
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined
} from "@ant-design/icons";

const { TabPane } = Tabs;
const { Title } = Typography;
const { Option } = Select;

const BusinessPartnerMasterlist = () => {
  // State variables
  const [activeTab, setActiveTab] = useState("partners");

  const [partners, setPartners] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  // Pagination states
  const [partnerPagination, setPartnerPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  
  const [vendorPagination, setVendorPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  // Modal states
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [partnerEditModalVisible, setPartnerEditModalVisible] = useState(false);
  const [vendorEditModalVisible, setVendorEditModalVisible] = useState(false);

  // Form states
  const [partnerForm] = Form.useForm();
  const [vendorForm] = Form.useForm();

  // Fetch data when component mounts or tab changes
  useEffect(() => {
    if (activeTab === "partners") {
      fetchPartners();
    } else if (activeTab === "vendors") {
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
  const fetchPartners = async (searchTerm = "", orderField = "", orderDirection = "") => {
    setLoading(true);
    try {
      const data = await businessPartnerAPI.getBusinessPartners({ 
        search: searchTerm,
        ordering: orderDirection === "descend" ? `-${orderField}` : orderField
      });
      setPartners(data.results || data);
      setPartnerPagination(prev => ({
        ...prev,
        total: (data.results || data).length
      }));
    } catch (error) {
      message.error("Failed to fetch business partners");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVendors = async (searchTerm = "", orderField = "", orderDirection = "") => {
    setLoading(true);
    try {
      const data = await vendorAPI.getVendors({ 
        search: searchTerm,
        ordering: orderDirection === "descend" ? `-${orderField}` : orderField
      });
      setVendors(data.results || data);
      setVendorPagination(prev => ({
        ...prev,
        total: (data.results || data).length
      }));
    } catch (error) {
      message.error("Failed to fetch vendors");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Prevent layout jump when changing tabs
  const handleTabChange = (key) => {
    // Save current scroll position
    const scrollPosition = window.scrollY;
    
    setActiveTab(key);
    setSearchValue(""); // Clear search when switching tabs

    setTimeout(() => {
      window.scrollTo(0, scrollPosition);
    }, 0);
  };

  const handleTableChange = (pagination, filters, sorter, extra) => {
    if (sorter && sorter.field) {
      const orderField = sorter.field;
      const orderDirection = sorter.order;
      
      if (activeTab === "partners") {
        fetchPartners(searchValue, orderField, orderDirection);
      } else if (activeTab === "vendors") {
        fetchVendors(searchValue, orderField, orderDirection);
      }
    }
  };

  // Handle pagination changes
  const handlePartnerPaginationChange = (page, pageSize) => {
    setPartnerPagination(prev => ({
      ...prev,
      current: page,
      pageSize
    }));
  };

  const handleVendorPaginationChange = (page, pageSize) => {
    setVendorPagination(prev => ({
      ...prev,
      current: page,
      pageSize
    }));
  };

  // View details handler
  const handleViewDetails = (record) => {
    setSelectedRecord(record);
    setDetailModalVisible(true);
  };

  // Partner edit handlers
  const handleEditPartner = (record) => {
    setSelectedRecord(record);
    partnerForm.setFieldsValue({
      partner_name: record.partner_name,
      category: record.category,
      contact_info: record.contact_info
    });
    setPartnerEditModalVisible(true);
  };

  const handlePartnerFormSubmit = async (values) => {
    try {
      await businessPartnerAPI.updateBusinessPartner(selectedRecord.partner_id, values);
      message.success("Business partner updated successfully");
      setPartnerEditModalVisible(false);
      fetchPartners(searchValue);
    } catch (error) {
      message.error(`Failed to update business partner: ${error.response?.data?.message || error.message}`);
    }
  };

  // Vendor edit handlers
    const handleEditVendor = (record) => {
      setSelectedRecord(record);
      vendorForm.setFieldsValue({
        vendor_name: record.vendor_name,
        contact_person: record.contact_person,
        status: record.status
      });
      setVendorEditModalVisible(true);
    };

  const handleVendorFormSubmit = async (values) => {
    try {
      await vendorAPI.updateVendor(selectedRecord.vendor_code, values);
      message.success("Vendor updated successfully");
      setVendorEditModalVisible(false);
      fetchVendors(searchValue);
    } catch (error) {
      message.error(`Failed to update vendor: ${error.response?.data?.message || error.message}`);
    }
  };

  // Handle search with debounce
  const handleSearch = (value) => {
    setSearchValue(value);
    if (activeTab === "partners") {
      fetchPartners(value);
    } else {
      fetchVendors(value);
    }
  };

  // Table columns definitions with sorting added
  const partnerColumns = [
    {
      title: "Partner ID",
      dataIndex: "partner_id",
      key: "partner_id",
      sorter: true,
      width: 180,
    },
    {
      title: "Partner Name",
      dataIndex: "partner_name",
      key: "partner_name",
      sorter: true,
      width: 150,
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      sorter: true,
      width: 100,
      render: (category) => (
        <Tag color={
          category === "Employee" ? "blue" : 
          category === "Customer" ? "green" : 
          category === "Vendor" ? "orange" : "default"
        }>
          {category}
        </Tag>
      ),
    },
    {
      title: "Contact Info",
      dataIndex: "contact_info",
      key: "contact_info",
      sorter: true,
      width: 120,
    }
  ];

  // Calculate table data for pagination
  const getPartnerTableData = () => {
    const { current, pageSize } = partnerPagination;
    const start = (current - 1) * pageSize;
    const end = start + pageSize;
    return partners.slice(start, end);
  };

  // Render main component
  return (
    <div className="partner-manage">
      <div className="partner-container">
        <Title level={4} className="page-title">
          {activeTab === "partners" ? "Business Partner Masterlist" : "Vendor Masterlist"}
        </Title>
        <Divider className="title-divider" />
        
        <div className="tabs-wrapper">
          <Tabs 
            activeKey={activeTab} 
            onChange={handleTabChange}
            size="middle"
            tabBarGutter={8}
            className="partner-tabs"
            type={windowWidth <= 768 ? "card" : "line"}
            tabPosition="top"
            destroyInactiveTabPane={false}
            tabBarExtraContent={{
              right: (
                <div className="header-right-content">
                  <div className="search-container">
                    <Input.Search
                      placeholder={activeTab === "partners" ? "Search partners..." : "Search vendors..."}
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
              tab={<span><UserOutlined /> {windowWidth > 576 ? "Business Partners" : ""}</span>} 
              key="partners"
            >
              {/* Partners tab content */}
              <div className="table-meta-info">
                <span className="record-count">Total Business Partners: {partners.length}</span>
                <div className="table-pagination">
                  <Pagination 
                    current={partnerPagination.current}
                    pageSize={partnerPagination.pageSize}
                    total={partners.length}
                    onChange={handlePartnerPaginationChange}
                    showSizeChanger={false}
                    size="small"
                  />
                </div>
              </div>
              
              <div className="table-container">
                <Table 
                  dataSource={getPartnerTableData()} 
                  columns={partnerColumns} 
                  rowKey="partner_id"
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
        
        {/* Details Modal */}
        <Modal
          title="View Details"
          visible={detailModalVisible}
          onCancel={() => setDetailModalVisible(false)}
          footer={[
            <Button key="close" type="primary" onClick={() => setDetailModalVisible(false)}>
              Close
            </Button>
          ]}
          width={500}
          className="custom-modal"
        >
        </Modal>
        
        {/* Partner Edit Modal */}
        <Modal
          title="Edit Business Partner"
          visible={partnerEditModalVisible}
          onCancel={() => setPartnerEditModalVisible(false)}
          footer={null}
          width={500}
          className="custom-modal"
        >
          <Form
            form={partnerForm}
            layout="vertical"
            onFinish={handlePartnerFormSubmit}
          >
            <Form.Item
              name="partner_name"
              label="Partner Name"
              rules={[{ required: true, message: "Please enter partner name" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="category"
              label="Category"
              rules={[{ required: true, message: "Please select a category" }]}
            >
              <Select>
                <Option value="Employee">Employee</Option>
                <Option value="Customer">Customer</Option>
                <Option value="Vendor">Vendor</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="contact_info"
              label="Contact Information"
              rules={[{ required: true, message: "Please enter contact information" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item className="form-actions">
              <Space>
                <Button type="primary" htmlType="submit">
                  Update
                </Button>
                <Button onClick={() => setPartnerEditModalVisible(false)}>
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        {/* Vendor Edit Modal */}
        <Modal
          title="Edit Vendor"
          visible={vendorEditModalVisible}
          onCancel={() => setVendorEditModalVisible(false)}
          footer={null}
          width={500}
          className="custom-modal"
        >
          <Form
            form={vendorForm}
            layout="vertical"
            onFinish={handleVendorFormSubmit}
          >
            <Form.Item
              name="vendor_name"
              label="Vendor Name"
              rules={[{ required: true, message: "Please enter vendor name" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="contact_person"
              label="Contact Person"
              rules={[{ required: true, message: "Please enter contact person" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true, message: "Please select a status" }]}
            >
              <Select>
                <Option value="Active">Active</Option>
                <Option value="Inactive">Inactive</Option>
              </Select>
            </Form.Item>

            <Form.Item className="form-actions">
              <Space>
                <Button type="primary" htmlType="submit">
                  Update
                </Button>
                <Button onClick={() => setVendorEditModalVisible(false)}>
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default BusinessPartnerMasterlist;