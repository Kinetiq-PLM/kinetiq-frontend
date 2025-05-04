import React, { useState, useEffect } from "react";
import { userAPI, roleAPI } from "../api/api";
import "../styles/User.css";
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
  Checkbox,
  Popover,
  Typography,
  Divider,
  Pagination,
  Tree
} from "antd";
import { 
  UserOutlined, 
  TeamOutlined, 
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

const UserManagement = () => {
  // State variables
  const [activeTab, setActiveTab] = useState("users");

  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [archivedRoles, setArchivedRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [archivedSearchValue, setArchivedSearchValue] = useState("");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  // Pagination states
  const [userPagination, setUserPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0
  });
  
  const [rolePagination, setRolePagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0
  });

  // Modal states
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [roleModalVisible, setRoleModalVisible] = useState(false);
  const [archiveModalVisible, setArchiveModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" or "edit"

  // Form states
  const [userForm] = Form.useForm();
  const [roleForm] = Form.useForm();

  // Fetch data when component mounts or tab changes
  useEffect(() => {
    if (activeTab === "users") {
      fetchUsers();
      fetchRoles(); // Need roles for user form dropdown
    } else if (activeTab === "roles") {
      fetchRoles();
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
  const fetchUsers = async (searchTerm = "", orderField = "", orderDirection = "") => {
    setLoading(true);
    try {
      const data = await userAPI.getUsers({ 
        search: searchTerm,
        ordering: orderDirection === "descend" ? `-${orderField}` : orderField
      });
      setUsers(data.results || data);
      setUserPagination(prev => ({
        ...prev,
        total: (data.results || data).length
      }));
    } catch (error) {
      message.error("Failed to fetch users");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async (searchTerm = "", orderField = "", orderDirection = "") => {
    setLoading(true);
    try {
      // Make sure to pass search param correctly to API
      const data = await roleAPI.getRoles({ 
        search: searchTerm,
        ordering: orderDirection === "descend" ? `-${orderField}` : orderField
      });
      setRoles(data.results || data);
      setRolePagination(prev => ({
        ...prev,
        total: (data.results || data).length
      }));
    } catch (error) {
      message.error("Failed to fetch roles");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchArchivedRoles = async (searchTerm = "", orderField = "", orderDirection = "") => {
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
      
      const data = await roleAPI.getArchivedRoles(params);
      setArchivedRoles(data.results || data);
      setArchiveModalVisible(true);
    } catch (error) {
      message.error("Failed to fetch archived roles");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Update the handleArchivedSearch function
  const handleArchivedSearch = (value) => {
    setArchivedSearchValue(value);
    fetchArchivedRoles(value);
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
      
      if (activeTab === "users") {
        fetchUsers(searchValue, orderField, orderDirection);
      } else if (activeTab === "roles") {
        fetchRoles(searchValue, orderField, orderDirection);
      }
    }
  };

  const handleArchivedTableChange = (pagination, filters, sorter, extra) => {
    if (sorter && sorter.field) {
      const orderField = sorter.field;
      const orderDirection = sorter.order;
      
      fetchArchivedRoles(archivedSearchValue, orderField, orderDirection);
    }
  };

  // Handle pagination changes
  const handleUserPaginationChange = (page, pageSize) => {
    setUserPagination(prev => ({
      ...prev,
      current: page,
      pageSize
    }));
  };

  const handleRolePaginationChange = (page, pageSize) => {
    setRolePagination(prev => ({
      ...prev,
      current: page,
      pageSize
    }));
  };

  // User form handlers
  const handleAddUser = () => {
    setModalMode("add");
    userForm.resetFields();
    setUserModalVisible(true);
  };

  const checkEmailExists = async (email) => {
    try {
      const data = await userAPI.getUsers({ search: email });
      const users = data.results || data;
      return users.some(user => 
        user.email.toLowerCase() === email.toLowerCase() && 
        (modalMode === "add" || user.user_id !== selectedRecord?.user_id)
      );
    } catch (error) {
      console.error("Error checking email:", error);
      return false;
    }
  };

  const handleEditUser = (record) => {
    setModalMode("edit");
    setSelectedRecord(record);
    userForm.setFieldsValue({
      first_name: record.first_name,
      last_name: record.last_name,
      email: record.email,
      status: record.status,
      role_id: record.role_id,
      password: ""  // Clear password field for security
    });
    setUserModalVisible(true);
  };

  const handleUserFormSubmit = async (values) => {
    try {
      if (modalMode === "add") {
        await userAPI.createUser(values);
        message.success("User created successfully");
      } else {
        // Create a copy of the values
        const updateData = {...values};
        
        // If password is empty, remove it from the update data
        if (!updateData.password) {
            delete updateData.password;
          } else if (updateData.password.length < 8) {
            return message.error("Password must be at least 8 characters long");
          }
        
        await userAPI.updateUser(selectedRecord.user_id, updateData);
        message.success("User updated successfully");
      }
      setUserModalVisible(false);
      fetchUsers();
    } catch (error) {
      message.error(`Failed to ${modalMode} user: ${error.response?.data?.message || error.message}`);
    }
  };

  // Role form handlers
  // Updated Tree selection logic for the role form
  const handleTreeCheck = (checkedKeys, info) => {
    // Convert from ant design's format
    const actualCheckedKeys = Array.isArray(checkedKeys) ? checkedKeys : checkedKeys.checked;
    
    // Create a set for efficient lookups
    const checkedKeysSet = new Set(actualCheckedKeys);
    const optimizedPermissions = [];
    
    // Process each checked key
    actualCheckedKeys.forEach(key => {
      // Trim any whitespace
      const trimmedKey = key.trim();
      
      // Skip if this key is already covered by a parent
      for (const existingKey of optimizedPermissions) {
        if (trimmedKey.startsWith(existingKey) && trimmedKey !== existingKey) {
          return; // Skip this key as it's covered by a parent
        }
      }
      
      // Check if this is a parent (has trailing slash)
      if (trimmedKey.endsWith('/')) {
        // Add this parent key and remove any of its children from the optimized list
        optimizedPermissions.push(trimmedKey);
        // Remove any children that might have been added before
        for (let i = optimizedPermissions.length - 1; i >= 0; i--) {
          if (optimizedPermissions[i].startsWith(trimmedKey) && optimizedPermissions[i] !== trimmedKey) {
            optimizedPermissions.splice(i, 1);
          }
        }
      } else {
        // This is a child key, check if we should add it
        const parts = trimmedKey.split('/');
        const parentKey = parts.slice(0, -1).join('/') + '/';
        
        // Only add if parent is not checked
        if (!checkedKeysSet.has(parentKey)) {
          optimizedPermissions.push(trimmedKey);
        }
      }
    });
    
    roleForm.setFieldsValue({ department_permissions: optimizedPermissions });
  };

  // Function to convert stored permissions to display checked keys
  const getExpandedCheckedKeys = (permissions) => {
    if (!permissions || !Array.isArray(permissions)) return [];
    
    const allKeys = [];
    
    permissions.forEach(perm => {
      // Trim any whitespace from the permission
      const trimmedPerm = perm.trim();
      
      // Always add the permission itself
      allKeys.push(trimmedPerm);
      
      // If it's a parent module (ends with '/')
      if (trimmedPerm.endsWith('/')) {
        // Find this parent in departmentOptions
        const parentModule = departmentOptions.find(dept => dept.key === trimmedPerm);
        if (parentModule && parentModule.children) {
          // Add all children for display purposes
          parentModule.children.forEach(child => {
            allKeys.push(child.key);
          });
        }
      }
    });
    
    return allKeys;
  };

  // Function to update role form before showing modal
  const prepareRoleForm = (record = null) => {
    if (record) {
      // Edit mode
      const expandedKeys = getExpandedCheckedKeys(record.department_permissions || []);
      
      roleForm.setFieldsValue({
        role_name: record.role_name,
        description: record.description,
        department_permissions: record.department_permissions || []
      });
      
      return expandedKeys;
    } else {
      // Add mode
      roleForm.resetFields();
      roleForm.setFieldsValue({ department_permissions: [] });
      return [];
    }
  };

  // Add state for tree check management
  const [checkedKeys, setCheckedKeys] = useState([]);

  // Updated Role Add/Edit handlers
  const handleAddRole = () => {
    setModalMode("add");
    setSelectedRecord(null);
    setCheckedKeys(prepareRoleForm());
    setRoleModalVisible(true);
  };

  const handleEditRole = (record) => {
    setModalMode("edit");
    setSelectedRecord(record);
    setCheckedKeys(prepareRoleForm(record));
    setRoleModalVisible(true);
  };

  const handleRoleFormSubmit = async (values) => {
    try {
      // Ensure all permissions are properly trimmed
      if (values.department_permissions && Array.isArray(values.department_permissions)) {
        values.department_permissions = values.department_permissions.map(perm => perm.trim());
      }
      
      if (modalMode === "add") {
        await roleAPI.createRole(values);
        message.success("Role created successfully");
      } else {
        await roleAPI.updateRole(selectedRecord.role_id, values);
        message.success("Role updated successfully");
      }
      setRoleModalVisible(false);
      fetchRoles();
    } catch (error) {
      message.error(`Failed to ${modalMode} role: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleArchiveRole = async (roleId) => {
    try {
      await roleAPI.archiveRole(roleId);
      message.success("Role archived successfully");
      fetchRoles();
    } catch (error) {
      message.error("Failed to archive role");
    }
  };

  const handleRestoreRole = async (roleId) => {
    try {
      await roleAPI.restoreRole(roleId);
      message.success("Role restored successfully");
      fetchArchivedRoles(archivedSearchValue); // Keep current search term
      fetchRoles(); // Refresh active roles list
    } catch (error) {
      message.error("Failed to restore role");
    }
  };

  // Handle search with debounce
  const handleSearch = (value) => {
    setSearchValue(value);
    if (activeTab === "users") {
      fetchUsers(value);
    } else {
      fetchRoles(value);
    }
  };

  const DepartmentPermissions = ({ permissions }) => {
    if (!permissions || permissions.length === 0) return null;
  
    // Ensure permissions are trimmed
    const cleanedPermissions = permissions.map(perm => perm.trim());
    
    const displayCount = cleanedPermissions.length === 4 ? 4 : 3;
    const hasMore = cleanedPermissions.length > displayCount;
    const displayed = cleanedPermissions.slice(0, displayCount);
    const hidden = cleanedPermissions.slice(displayCount);
  
    const content = (
      <div className="popover-tags">
        {hidden.map((perm) => (
          <Tag color="blue" key={perm} className="permission-tag">{perm}</Tag>
        ))}
      </div>
    );
  
    return (
      <div className="tag-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
        {displayed.map((perm) => (
          <Tag color="blue" key={perm} className="permission-tag">{perm}</Tag>
        ))}
        {hasMore && (
          <Popover 
            content={content} 
            trigger="click"
            overlayClassName="permissions-popover"
            placement="bottom"
          >
            <Tag className="more-tag" style={{ cursor: 'pointer' }}>
              +{hidden.length} More
            </Tag>
          </Popover>
        )}
      </div>
    );
  };

  // Table columns definitions with sorting added
  const userColumns = [
    {
      title: "User ID",
      dataIndex: "user_id",
      key: "user_id",
      sorter: true,
      width: 180,
    },
    {
      title: "First Name",
      dataIndex: "first_name",
      key: "first_name",
      sorter: true,
      width: 120,
    },
    {
      title: "Last Name",
      dataIndex: "last_name",
      key: "last_name",
      sorter: true,
      width: 120,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: true,
      width: 200,
    },
    {
      title: "Role",
      dataIndex: "role_display",
      key: "role_display",
      sorter: true,
      width: 200,
      render: (text) => text || "No Role Assigned",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      sorter: true,
      width: 50,
      render: (status) => (
        <Tag color={status === "Active" ? "green" : "red"}>
          {status}
        </Tag>
      ),
      
    },
    {
      title: "Actions",
      key: "actions",
      width: 60, // Fixed width for actions column
      align: "center",
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            size="small"
            onClick={() => handleEditUser(record)}
          />
        </Space>
      ),
    },
  ];

  const roleColumns = [
    {
      title: "Role ID",
      dataIndex: "role_id",
      key: "role_id",
      sorter: true,
      width: 200,
    },
    {
      title: "Role Name",
      dataIndex: "role_name",
      key: "role_name",
      sorter: true,
      width: 220,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      sorter: true,
      width: 400,
    },
    {
      title: "Department Permissions",
      dataIndex: "department_permissions",
      key: "department_permissions",
      render: (permissions) => <DepartmentPermissions permissions={permissions} />,
      width: 400,
    },
    {
      title: "Actions",
      key: "actions",
      width: 80, // Fixed width for actions column
      align: "center",
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            size="small"
            onClick={() => handleEditRole(record)}
          />
          <Popconfirm
            title="Are you sure you want to archive this role?"
            popupPlacement="topRight"
            onConfirm={() => handleArchiveRole(record.role_id)}
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

  const archivedRoleColumns = [
    {
      title: "Role ID",
      dataIndex: "role_id",
      key: "role_id",
      sorter: true,
      sortDirections: ['ascend', 'descend'],
      width: 200,
    },
    {
      title: "Role Name",
      dataIndex: "role_name",
      key: "role_name",
      sorter: true,
      sortDirections: ['ascend', 'descend'],
      render: (text) => text.replace("ARCHIVED_", ""),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      sorter: true,
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: "Department Permissions",
      dataIndex: "department_permissions",
      key: "department_permissions",
      render: (permissions) => <DepartmentPermissions permissions={permissions} />
    },
    {
      title: "Actions",
      key: "actions",
      width: 10, // Fixed width for actions column
      align: "center",
      render: (_, record) => (
        <Space size="small">
          <Popconfirm
            title="Are you sure you want to restore this role?"
            onConfirm={() => handleRestoreRole(record.role_id)}
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

  // Available departments for role permissions
  const departmentOptions = [
    {
      title: 'Accounting',
      key: 'Accounting/',
      children: [
        { title: 'Chart of Accounts', key: 'Accounting/Chart of Accounts' },
        { title: 'Journal', key: 'Accounting/Journal' },
        { title: 'Journal Entry', key: 'Accounting/Journal Entry' },
        { title: 'General Ledger', key: 'Accounting/General Ledger' },
        { title: 'General Ledger Accounts', key: 'Accounting/General Ledger Accounts' },
        { title: 'Official Receipts', key: 'Accounting/Official Receipts' },
        { title: 'Payroll Accounting', key: 'Accounting/Payroll Accounting' },
        { title: 'Tax and Remittance', key: 'Accounting/Tax and Remittance' },
        { title: 'Accounts Payable Receipts', key: 'Accounting/Accounts Payable Receipts' },
      ],
    },
    {
      title: 'Administration',
      key: 'Administration/',
      children: [
        { title: 'User', key: 'Administration/User' },
        { title: 'Item Masterlist', key: 'Administration/Item Masterlist' },
        { title: 'Business Partner Masterlist', key: 'Administration/Business Partner Masterlist' },
        { title: 'Audit Logs', key: 'Administration/Audit Logs' },
        { title: 'Policy', key: 'Administration/Policy' },
        { title: 'Currency', key: 'Administration/Currency' },
        { title: 'Warehouse', key: 'Administration/Warehouse' },
        { title: 'Notification', key: 'Administration/Notification' },
      ],
    },
    {
      title: 'CRM',
      key: 'CRM/',
      children: [
        { title: 'Leads', key: 'CRM/Leads' },
        { title: 'Opportunity', key: 'CRM/Opportunity' },
        { title: 'Campaign', key: 'CRM/Campaign' },
        { title: 'Contacts', key: 'CRM/Contacts' },
        { title: 'Cases', key: 'CRM/Cases' },
      ],
    },
    {
      title: 'Distribution',
      key: 'Distribution/',
      children: [
        { title: 'External Delivery', key: 'Distribution/External Delivery' },
        { title: 'Internal Delivery', key: 'Distribution/Internal Delivery' },
        { title: 'Picking', key: 'Distribution/Picking' },
        { title: 'Packing', key: 'Distribution/Packing' },
        { title: 'Shipment', key: 'Distribution/Shipment' },
        { title: 'Rework', key: 'Distribution/Rework' },
      ],
    },
    {
      title: 'Financials',
      key: 'Financials/',
      children: [
        { title: 'Reports', key: 'Financials/Reports' },
        { title: 'Validations', key: 'Financials/Validations' },
        { title: 'Approvals', key: 'Financials/Approvals' },
        { title: 'Forms', key: 'Financials/Forms' },
      ],
    },
    {
      title: 'Human Resources',
      key: 'Human Resources/',
      children: [
        { title: 'Employees', key: 'Human Resources/Employees' },
        { title: 'Recruitment', key: 'Human Resources/Recruitment' },
        { title: 'Attendance Tracking', key: 'Human Resources/Attendance Tracking' },
        { title: 'Payroll', key: 'Human Resources/Payroll' },
        { title: 'Departments', key: 'Human Resources/Departments' },
        { title: 'Workforce Allocation', key: 'Human Resources/Workforce Allocation' },
        { title: 'Leave Requests', key: 'Human Resources/Leave Requests' },
        { title: 'Employee Performance', key: 'Human Resources/Employee Performance' },
        { title: 'Employee Salary', key: 'Human Resources/Employee Salary' },
      ],
    },
    {
      title: 'Inventory',
      key: 'Inventory/',
      children: [
        { title: 'Shelf Life', key: 'Inventory/Shelf Life' },
        { title: 'P-Counts', key: 'Inventory/P-Counts' },
        { title: 'Stock Flow', key: 'Inventory/Stock Flow' },
      ],
    },
    {
      title: 'Job Posting',
      key: 'Job Posting/',
      children: [],
    },
    {
      title: 'Management',
      key: 'Management/',
      children: [
        { title: 'Dashboard', key: 'Management/Dashboard' },
        { title: 'Project Approval', key: 'Management/Project Approval' },
        { title: 'User Roles', key: 'Management/User Roles' },
        { title: 'Access Control', key: 'Management/Access Control' },
        { title: 'Settings', key: 'Management/Settings' },
      ],
    },
    {
      title: 'MRP',
      key: 'MRP/',
      children: [
        { title: 'Material Requirements Planning', key: 'MRP/Material Requirements Planning' },
        { title: 'Bills Of Material', key: 'MRP/Bills Of Material' },
        { title: 'Product Materials', key: 'MRP/Product Materials' },
      ],
    },
    {
      title: 'Operations',
      key: 'Operations/',
      children: [
        { title: 'Goods Tracking', key: 'Operations/Goods Tracking' },
        { title: 'Internal Transfer', key: 'Operations/Internal Transfer' },
        { title: 'Delivery Approval', key: 'Operations/Delivery Approval' },
        { title: 'Delivery Receipt', key: 'Operations/Delivery Receipt' },
        { title: 'Item Removal', key: 'Operations/Item Removal' },
      ],
    },
    {
      title: 'Production',
      key: 'Production/',
      children: [
        { title: 'Equipment and Labor', key: 'Production/Equipment and Labor' },
        { title: 'Cost of Production', key: 'Production/Cost of Production' },
      ],
    },
    {
      title: 'Project Management',
      key: 'Project Management/',
      children: [
        { title: 'Project List', key: 'Project Management/Project List' },
        { title: 'Project Planning', key: 'Project Management/Project Planning' },
        { title: 'Project Request', key: 'Project Management/Project Request' },
        { title: 'Tasks', key: 'Project Management/Tasks' },
        { title: 'Report Monitoring', key: 'Project Management/Report Monitoring' },
        { title: 'Warranty Monitoring', key: 'Project Management/Warranty Monitoring' },
        { title: 'Project Cost', key: 'Project Management/Project Cost' },
      ],
    },
    {
      title: 'Project Request',
      key: 'Project Request/',
      children: [],
    },
    {
      title: 'Purchase Request',
      key: 'Purchase Request/',
      children: [],
    },
    {
      title: 'Purchasing',
      key: 'Purchasing/',
      children: [
        { title: 'Purchase Request List', key: 'Purchasing/Purchase Request List' },
        { title: 'Puchase Quotation List', key: 'Purchasing/Puchase Quotation List' },
        { title: 'Purchase Order Status', key: 'Purchasing/Purchase Order Status' },
        { title: 'A/P Invoice', key: 'Purchasing/A/P Invoice' },
        { title: 'Credit Memo', key: 'Purchasing/Credit Memo' },
        { title: 'Vendor Application Form', key: 'Purchasing/Vendor Application Form' },
      ],
    },
    {
      title: 'Sales',
      key: 'Sales/',
      children: [
        { title: 'Quotation', key: 'Sales/Quotation' },
        { title: 'Order', key: 'Sales/Order' },
        { title: 'Delivery', key: 'Sales/Delivery' },
        { title: 'Transactions', key: 'Sales/Transactions' },
      ],
    },
    {
      title: 'Support & Services',
      key: 'Support & Services/',
      children: [
        { title: 'Service Ticket', key: 'Support & Services/Service Ticket' },
        { title: 'Service Call', key: 'Support & Services/Service Call' },
        { title: 'Service Request', key: 'Support & Services/Service Request' },
        { title: 'Warranty Renewal', key: 'Support & Services/Warranty Renewal' },
        { title: 'Service Analysis', key: 'Support & Services/Service Analysis' },
        { title: 'Service Billing', key: 'Support & Services/Service Billing' },
        { title: 'Service Report', key: 'Support & Services/Service Report' },
        { title: 'Service Contract', key: 'Support & Services/Service Contract' },
      ],
    },
    {
      title: 'Report Generator',
      key: 'Report Generator/',
      children: [],
    },
    {
      title: 'Workforce Request',
      key: 'Workforce Request/',
      children: [],
    },
    {
      title: 'Employee Request',
      key: 'Employee Request/',
      children: [
        { title: 'Resignation Request', key: 'Employee Request/Resignation Request' },
        { title: 'Overtime Request', key: 'Employee Request/Overtime Request' },
        { title: 'Leave Request', key: 'Employee Request/Leave Request' },
      ],
    },
  ];


  // Helper function to get all department paths
  const getAllDepartmentPaths = () => {
    const paths = [];
    
    const extractPaths = (items) => {
      items.forEach(item => {
        paths.push(item.key);
        if (item.children && item.children.length > 0) {
          extractPaths(item.children);
        }
      });
    };
    
    extractPaths(departmentOptions);
    return paths;
  };
  
  // All department paths for reference
  const allDepartmentPaths = getAllDepartmentPaths();

  
  // Calculate table data for pagination
  const getUserTableData = () => {
    const { current, pageSize } = userPagination;
    const start = (current - 1) * pageSize;
    const end = start + pageSize;
    return users.slice(start, end);
  };

  const getRoleTableData = () => {
    const { current, pageSize } = rolePagination;
    const start = (current - 1) * pageSize;
    const end = start + pageSize;
    return roles.slice(start, end);
  };

  // Render main component
  return (
    <div className="user-manage">
      <div className="users-container">
        <Title level={4} className="page-title">
          {activeTab === "users" ? "User Management" : "Role Management"}
        </Title>
        <Divider className="title-divider" />
        
        <div className="tabs-wrapper">
          <Tabs 
            activeKey={activeTab} 
            onChange={handleTabChange}
            size="middle"
            tabBarGutter={8}
            className="user-tabs"
            type={windowWidth <= 768 ? "card" : "line"}
            tabPosition="top"
            destroyInactiveTabPane={false}
            tabBarExtraContent={{
              right: (
                <div className="header-right-content">
                  <div className="search-container">
                    <Input.Search
                      placeholder={activeTab === "users" ? "Search users..." : "Search roles..."}
                      allowClear
                      onSearch={handleSearch}
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      prefix={<SearchOutlined />}
                    />
                  </div>
                  <div className="action-buttons">
                    {activeTab === "users" && (
                      <Button 
                        type="primary" 
                        icon={<PlusOutlined />} 
                        onClick={handleAddUser}
                        className={windowWidth <= 576 ? "icon-only-btn" : ""}
                      >
                        {windowWidth > 576 ? "Add User" : ""}
                      </Button>
                    )}
                    {activeTab === "roles" && (
                      <>
                        <Button 
                          icon={<EyeOutlined />} 
                          onClick={() => {
                            setArchivedSearchValue("");
                            fetchArchivedRoles("");
                          }}
                          className={`archive-btn ${windowWidth <= 576 ? "icon-only-btn" : ""}`}
                        >
                          {windowWidth > 576 ? "View Archived" : ""}
                        </Button>
                        <Button 
                          type="primary" 
                          icon={<PlusOutlined />} 
                          onClick={handleAddRole}
                          className={windowWidth <= 576 ? "icon-only-btn" : ""}
                        >
                          {windowWidth > 576 ? "Add Role" : ""}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              )
            }}
          >
            <TabPane 
              tab={<span><UserOutlined /> {windowWidth > 576 ? "Users" : ""}</span>} 
              key="users"
            >
              {/* Users tab content */}
              <div className="table-meta-info">
                <span className="record-count">Total Users: {users.length}</span>
                <div className="table-pagination">
                  <Pagination 
                    current={userPagination.current}
                    pageSize={userPagination.pageSize}
                    total={users.length}
                    onChange={handleUserPaginationChange}
                    showSizeChanger={false}
                    size="small"
                  />
                </div>
              </div>
              
              <div className="table-container">
                <Table 
                  dataSource={getUserTableData()} 
                  columns={userColumns} 
                  rowKey="user_id"
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

            <TabPane 
              tab={<span><TeamOutlined /> {windowWidth > 576 ? "Roles" : ""}</span>} 
              key="roles"
            >
              {/* Roles tab content */}
              <div className="table-meta-info">
                <span className="record-count">Total Roles: {roles.length}</span>
                <div className="table-pagination">
                  <Pagination 
                    current={rolePagination.current}
                    pageSize={rolePagination.pageSize}
                    total={roles.length}
                    onChange={handleRolePaginationChange}
                    showSizeChanger={false}
                    size="small"
                  />
                </div>
              </div>
              <div className="table-container">
                <Table 
                  dataSource={getRoleTableData()} 
                  columns={roleColumns} 
                  rowKey="role_id"
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
        
        
        {/* User Modal */}
        <Modal
          title={modalMode === "add" ? "Add New User" : "Edit User"}
          visible={userModalVisible}
          onCancel={() => setUserModalVisible(false)}
          footer={null}
          width={600}
          className="custom-modal"
        >
          <Form
            form={userForm}
            layout="vertical"
            onFinish={handleUserFormSubmit}
          >
            <Form.Item
              name="first_name"
              label="First Name"
              rules={[{ required: true, message: "Please enter first name" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="last_name"
              label="Last Name"
              rules={[{ required: true, message: "Please enter last name" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Please enter email" },
                { type: "email", message: "Please enter valid email" },
                {
                  validator: async (_, value) => {
                    if (!value) return Promise.resolve();
                    
                    const exists = await checkEmailExists(value);
                    if (exists) {
                      return Promise.reject(new Error('This email already exists'));
                    }
                    return Promise.resolve();
                  },
                }
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[
                { 
                  required: modalMode === "add", 
                  message: "Please enter password" 
                },
                {
                  min: 8,
                  message: "Password must be at least 8 characters long"
                }
              ]}
            >
              <Input.Password placeholder={modalMode === "edit" ? "Leave blank to keep current password" : ""} />
            </Form.Item>

            <Form.Item
              name="role_id"
              label="Role"
            >
              <Select allowClear placeholder="Select a role">
                {roles.map(role => (
                  <Option key={role.role_id} value={role.role_id}>
                    {role.role_name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="status"
              label="Status"
              initialValue="Active"
            >
              <Select>
                <Option value="Active">Active</Option>
                <Option value="Inactive">Inactive</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="type"
              label="Type"
              initialValue="Employee"
              hidden={true}
            >
              <Input />
            </Form.Item>

            <Form.Item className="form-actions">
              <Space>
                <Button type="primary" htmlType="submit">
                  {modalMode === "add" ? "Create" : "Update"}
                </Button>
                <Button onClick={() => setUserModalVisible(false)}>
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        {/* Role Modal */}
        <Modal
          title={modalMode === "add" ? "Add New Role" : "Edit Role"}
          visible={roleModalVisible}
          onCancel={() => setRoleModalVisible(false)}
          footer={null}
          width={700}
          className="custom-modal"
        >
          <Form
            form={roleForm}
            layout="vertical"
            onFinish={handleRoleFormSubmit}
          >
            <Form.Item
              name="role_name"
              label="Role Name"
              rules={[{ required: true, message: "Please enter role name" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="description"
              label="Description"
            >
              <TextArea rows={4} />
            </Form.Item>

            <Form.Item
              name="department_permissions"
              label="Department Permissions"
              rules={[{ required: true, message: "Please select at least one department" }]}
            >
              <Tree
                checkable
                treeData={departmentOptions}
                defaultExpandAll
                checkedKeys={checkedKeys}
                onCheck={(checked, info) => {
                  setCheckedKeys(checked);
                  handleTreeCheck(checked, info);
                }}
              />
            </Form.Item>

            <Form.Item className="form-actions">
              <Space>
                <Button type="primary" htmlType="submit">
                  {modalMode === "add" ? "Create" : "Update"}
                </Button>
                <Button onClick={() => setRoleModalVisible(false)}>
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        {/* Archived Roles Modal */}
        <Modal
          title="Archived Roles"
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
              placeholder="Search archived roles..."
              allowClear
              onSearch={handleArchivedSearch}
              value={archivedSearchValue}
              onChange={(e) => setArchivedSearchValue(e.target.value)}
              prefix={<SearchOutlined />}
            />
          </div>
          <Table 
            dataSource={archivedRoles} 
            columns={archivedRoleColumns} 
            rowKey="role_id"
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

export default UserManagement;