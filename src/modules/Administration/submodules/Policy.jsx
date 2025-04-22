import React, { useState, useEffect } from "react";
import { policiesAPI } from "../api/api";
import "../styles/Policy.css";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Space,
  Tag,
  Popconfirm,
  message,
  Spin,
  Typography,
  Divider,
  Pagination,
  DatePicker,
  Upload,
  Tabs
} from "antd";
import { 
  FileOutlined, 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  UndoOutlined,
  EyeOutlined,
  SearchOutlined,
  UploadOutlined
} from "@ant-design/icons";
import moment from 'moment';

const { Title } = Typography;
const { TextArea } = Input;
const { TabPane } = Tabs;

const PolicyManagement = () => {
  // State variables
  const [policies, setPolicies] = useState([]);
  const [archivedPolicies, setArchivedPolicies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [archivedSearchValue, setArchivedSearchValue] = useState("");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [viewDocumentUrl, setViewDocumentUrl] = useState(null);
  const [activeTab, setActiveTab] = useState("policies");
  
  // Pagination state
  const [policyPagination, setPolicyPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  // Modal states
  const [policyModalVisible, setPolicyModalVisible] = useState(false);
  const [archiveModalVisible, setArchiveModalVisible] = useState(false);
  const [documentViewModalVisible, setDocumentViewModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" or "edit"

  // Form state
  const [policyForm] = Form.useForm();

  // Fetch data when component mounts
  useEffect(() => {
    fetchPolicies();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Data fetching functions
  const fetchPolicies = async (searchTerm = "", orderField = "", orderDirection = "") => {
    setLoading(true);
    try {
      const data = await policiesAPI.getPolicies({ 
        search: searchTerm,
        ordering: orderDirection === "descend" ? `-${orderField}` : orderField
      });
      setPolicies(data.results || data);
      setPolicyPagination(prev => ({
        ...prev,
        total: (data.results || data).length
      }));
    } catch (error) {
      message.error("Failed to fetch policies");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchArchivedPolicies = async (searchTerm = "", orderField = "", orderDirection = "") => {
    setLoading(true);
    try {
      const params = {
        search: searchTerm || "",
      };
      
      if (orderField) {
        params.ordering = orderDirection === "descend" ? `-${orderField}` : orderField;
      }
      
      const data = await policiesAPI.getArchivedPolicies(params);
      setArchivedPolicies(data.results || data);
      setArchiveModalVisible(true);
    } catch (error) {
      message.error("Failed to fetch archived policies");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle search functions
  const handleSearch = (value) => {
    setSearchValue(value);
    fetchPolicies(value);
  };

  const handleArchivedSearch = (value) => {
    setArchivedSearchValue(value);
    fetchArchivedPolicies(value);
  };

  // Handle tab change
  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  // Table change handlers
  const handleTableChange = (pagination, filters, sorter, extra) => {
    if (sorter && sorter.field) {
      const orderField = sorter.field;
      const orderDirection = sorter.order;
      fetchPolicies(searchValue, orderField, orderDirection);
    }
  };

  const handleArchivedTableChange = (pagination, filters, sorter, extra) => {
    if (sorter && sorter.field) {
      const orderField = sorter.field;
      const orderDirection = sorter.order;
      fetchArchivedPolicies(archivedSearchValue, orderField, orderDirection);
    }
  };

  // Pagination change handler
  const handlePolicyPaginationChange = (page, pageSize) => {
    setPolicyPagination(prev => ({
      ...prev,
      current: page,
      pageSize
    }));
  };

  // Policy form handlers
  const handleAddPolicy = () => {
    setModalMode("add");
    policyForm.resetFields();
    setPolicyModalVisible(true);
  };

  const handleEditPolicy = (record) => {
    setModalMode("edit");
    setSelectedRecord(record);
    policyForm.setFieldsValue({
      policy_name: record.policy_name,
      description: record.description,
      effective_date: record.effective_date ? moment(record.effective_date) : null,
      status: record.status
    });
    setPolicyModalVisible(true);
  };

  const handleViewDocument = (record) => {
    setSelectedRecord(record);
    if (record.document_url) {
      // Prepend the local development server URL if needed
      const documentUrl = record.document_url.startsWith('http') ? record.document_url : `http://127.0.0.1:8000${record.document_url}`;
      setViewDocumentUrl(documentUrl);
    } else {
      setViewDocumentUrl(null);
    }
    setDocumentViewModalVisible(true);
  };

  const handlePolicyFormSubmit = async (values) => {
    try {
      const formData = new FormData();
      
      // Add all form values to formData
      Object.keys(values).forEach(key => {
        if (key === 'effective_date' && values[key]) {
          formData.append(key, values[key].format('YYYY-MM-DD'));
        } else if (key === 'document' && values[key]) {
          if (values[key].fileList && values[key].fileList.length > 0) {
            formData.append('document', values[key].fileList[0].originFileObj);
          }
        } else if (values[key] !== undefined) {
          formData.append(key, values[key]);
        }
      });

      if (modalMode === "add") {
        await policiesAPI.createPolicy(formData);
        message.success("Policy created successfully");
      } else {
        await policiesAPI.updatePolicy(selectedRecord.policy_id, formData);
        message.success("Policy updated successfully");
      }
      setPolicyModalVisible(false);
      fetchPolicies();
    } catch (error) {
      message.error(`Failed to ${modalMode} policy: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleArchivePolicy = async (policyId) => {
    try {
      await policiesAPI.archivePolicy(policyId);
      message.success("Policy archived successfully");
      fetchPolicies();
    } catch (error) {
      message.error("Failed to archive policy");
    }
  };

  const handleRestorePolicy = async (policyId) => {
    try {
      await policiesAPI.restorePolicy(policyId);
      message.success("Policy restored successfully");
      fetchArchivedPolicies(archivedSearchValue);
      fetchPolicies();
    } catch (error) {
      message.error("Failed to restore policy");
    }
  };

  // Calculate table data for pagination
  const getPolicyTableData = () => {
    const { current, pageSize } = policyPagination;
    const start = (current - 1) * pageSize;
    const end = start + pageSize;
    return policies.slice(start, end);
  };

  // Table columns definitions
  const policyColumns = [
    {
      title: "Policy ID",
      dataIndex: "policy_id",
      key: "policy_id",
      sorter: true,
      width: 220,
    },
    {
      title: "Policy Name",
      dataIndex: "policy_name",
      key: "policy_name",
      sorter: true,
      width: 200,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      sorter: true,
      width: 400,
      render: (text) => (
        <div className="description-cell">
          {text}
        </div>
      ),
    },
    {
      title: "Effective Date",
      dataIndex: "effective_date",
      key: "effective_date",
      sorter: true,
      width: 150,
      render: (date) => date ? moment(date).format('YYYY-MM-DD') : '-',
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      sorter: true,
      width: 100,
      render: (status) => (
        <Tag color={status === "Active" ? "green" : "red"}>
          {status}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      align: "center",
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="primary" 
            icon={<EyeOutlined />} 
            size="small"
            onClick={() => handleViewDocument(record)}
          />
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            size="small"
            onClick={() => handleEditPolicy(record)}
          />
          <Popconfirm
            title="Are you sure you want to archive this policy?"
            onConfirm={() => handleArchivePolicy(record.policy_id)}
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

  const archivedPolicyColumns = [
    {
      title: "Policy ID",
      dataIndex: "policy_id",
      key: "policy_id",
      sorter: true,
      width: 220,
    },
    {
      title: "Policy Name",
      dataIndex: "policy_name",
      key: "policy_name",
      sorter: true,
      width: 200,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      sorter: true,
      width: 400,
    },
    {
      title: "Effective Date",
      dataIndex: "effective_date",
      key: "effective_date",
      sorter: true,
      width: 150,
      render: (date) => date ? moment(date).format('YYYY-MM-DD') : '-',
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      sorter: true,
      width: 100,
      render: (status) => (
        <Tag color={status === "Inactive" ? "red" : "orange"}>
          {status}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 80,
      align: "center",
      render: (_, record) => (
        <Space size="small">
          <Popconfirm
            title="Are you sure you want to restore this policy?"
            onConfirm={() => handleRestorePolicy(record.policy_id)}
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

  // Custom file upload components
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  // Render main component
  return (
    <div className="policy-manage">
      <div className="policies-container">
        <Title level={4} className="page-title">
          {activeTab === "policies" ? "Policy Management" : ""}
        </Title>
        <Divider className="title-divider" />
  
        <div className="tabs-wrapper">
          <Tabs
            activeKey={activeTab}
            onChange={handleTabChange}
            size="middle"
            tabBarGutter={8}
            className="policy-tabs"
            type={windowWidth <= 768 ? "card" : "line"}
            tabPosition="top"
            destroyInactiveTabPane={false}
            tabBarExtraContent={{
              right: (
                <div className="header-right-content">
                  <div className="search-container">
                    <Input.Search
                      placeholder="Search policies..."
                      allowClear
                      onSearch={handleSearch}
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      prefix={<SearchOutlined />}
                    />
                  </div>
                  <div className="action-buttons">
                    <Button 
                      icon={<EyeOutlined />} 
                      onClick={() => {
                        setArchivedSearchValue("");
                        fetchArchivedPolicies("");
                      }}
                      className={`archive-btn ${windowWidth <= 576 ? "icon-only-btn" : ""}`}
                    >
                      {windowWidth > 576 ? "View Archived" : ""}
                    </Button>
                    <Button 
                      type="primary" 
                      icon={<PlusOutlined />} 
                      onClick={handleAddPolicy}
                      className={windowWidth <= 576 ? "icon-only-btn" : ""}
                    >
                      {windowWidth > 576 ? "Add Policy" : ""}
                    </Button>
                  </div>
                </div>
              )
            }}
          >
            <TabPane
              tab={<span><FileOutlined /> {windowWidth > 576 ? "Policies" : ""}</span>}
              key="policies"
            >
              <div className="table-meta-info">
                <span className="record-count">Total Policies: {policies.length}</span>
                <div className="table-pagination">
                  <Pagination 
                    current={policyPagination.current}
                    pageSize={policyPagination.pageSize}
                    total={policies.length}
                    onChange={handlePolicyPaginationChange}
                    showSizeChanger={false}
                    size="small"
                  />
                </div>
              </div>
              
              <div className="table-container">
                <Table 
                  dataSource={getPolicyTableData()} 
                  columns={policyColumns} 
                  rowKey="policy_id"
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
  
        {/* Policy Modal */}
        <Modal
          title={modalMode === "add" ? "Add New Policy" : "Edit Policy"}
          visible={policyModalVisible}
          onCancel={() => setPolicyModalVisible(false)}
          footer={null}
          width={700}
          className="custom-modal"
        >
          <Form
            form={policyForm}
            layout="vertical"
            onFinish={handlePolicyFormSubmit}
            encType="multipart/form-data"
          >
            <Form.Item
              name="policy_name"
              label="Policy Name"
              rules={[{ required: true, message: "Please enter policy name" }]}
            >
              <Input />
            </Form.Item>
  
            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true, message: "Please enter policy description" }]}
            >
              <TextArea rows={4} />
            </Form.Item>
  
            <Form.Item
              name="effective_date"
              label="Effective Date"
              rules={[{ required: true, message: "Please select effective date" }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
  
            <Form.Item
              name="status"
              label="Status"
              initialValue="Active"
              rules={[{ required: true, message: "Please select status" }]}
            >
              <Select>
                <Select.Option value="Active">Active</Select.Option>
                <Select.Option value="Inactive">Inactive</Select.Option>
              </Select>
            </Form.Item>
  
            <Form.Item
              name="document"
              label="Document"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              extra="Upload PDF document for this policy"
            >
              <Upload 
                name="document" 
                accept=".pdf,.doc,.docx" 
                maxCount={1}
                beforeUpload={() => false} // Prevent auto upload
              >
                <Button icon={<UploadOutlined />}>Select File</Button>
              </Upload>
            </Form.Item>
  
            <Form.Item className="form-actions">
              <Space>
                <Button type="primary" htmlType="submit">
                  {modalMode === "add" ? "Create" : "Update"}
                </Button>
                <Button onClick={() => setPolicyModalVisible(false)}>
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
  
        {/* Archived Policies Modal */}
        <Modal
          title="Archived Policies"
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
              placeholder="Search archived policies..."
              allowClear
              onSearch={handleArchivedSearch}
              value={archivedSearchValue}
              onChange={(e) => setArchivedSearchValue(e.target.value)}
              prefix={<SearchOutlined />}
            />
          </div>
          <Table 
            dataSource={archivedPolicies} 
            columns={archivedPolicyColumns} 
            rowKey="policy_id"
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
  
        {/* Document View Modal */}
        <Modal
          title="Policy Document"
          visible={documentViewModalVisible}
          onCancel={() => setDocumentViewModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setDocumentViewModalVisible(false)}>
              Close
            </Button>
          ]}
          width={900}
          height={700}
          className="document-modal"
        >
          {viewDocumentUrl ? (
            <div className="document-viewer">
              <iframe
                src={viewDocumentUrl}
                title="Policy Document"
                width="100%"
                height="600"
                frameBorder="0"
                style={{ border: "1px solid #d9d9d9" }}
              />
            </div>
          ) : (
            <div className="no-document-message" style={{ textAlign: 'center', padding: '40px' }}>
              <Typography.Title level={4}>No File Available</Typography.Title>
              <Typography.Paragraph>There is no document attached to this policy.</Typography.Paragraph>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default PolicyManagement;