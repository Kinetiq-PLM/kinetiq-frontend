import React, { useState, useEffect } from "react";
import { 
  itemMasterDataAPI, 
  assetsAPI, 
  productsAPI, 
  rawMaterialsAPI,
  vendorAPI,
  policiesAPI
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
  DatePicker,
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
  SearchOutlined,
  ContainerOutlined
} from "@ant-design/icons";
import dayjs from 'dayjs';

const { TabPane } = Tabs;
const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const ItemMasterManagement = () => {
  // State variables
  const [activeTab, setActiveTab] = useState("items");

  const [items, setItems] = useState([]);
  const [assets, setAssets] = useState([]);
  const [products, setProducts] = useState([]);
  const [rawMaterials, setRawMaterials] = useState([]);

  const [vendors, setVendors] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [contentIds, setContentIds] = useState([]);
  
  const [archivedItems, setArchivedItems] = useState([]);
  const [archivedAssets, setArchivedAssets] = useState([]);
  const [archivedProducts, setArchivedProducts] = useState([]);
  const [archivedRawMaterials, setArchivedRawMaterials] = useState([]);
  
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
  
  const [assetPagination, setAssetPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  
  const [productPagination, setProductPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  
  const [materialPagination, setMaterialPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  // Modal states
  const [itemModalVisible, setItemModalVisible] = useState(false);
  const [assetModalVisible, setAssetModalVisible] = useState(false);
  const [productModalVisible, setProductModalVisible] = useState(false);
  const [materialModalVisible, setMaterialModalVisible] = useState(false);
  const [archiveModalVisible, setArchiveModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add", "edit", or "view"
  const [archiveType, setArchiveType] = useState(""); // To track which archive modal is open

  // Form states
  const [itemForm] = Form.useForm();
  const [assetForm] = Form.useForm();
  const [productForm] = Form.useForm();
  const [materialForm] = Form.useForm();

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

  // Fetch data when component mounts or tab changes
  useEffect(() => {
    if (activeTab === "items") {
      fetchItems();
      fetchVendors();
    } else if (activeTab === "assets") {
      fetchAssets();
      fetchContentIds();
    } else if (activeTab === "products") {
      fetchProducts();
      fetchPolicies();
    } else if (activeTab === "materials") {
      fetchRawMaterials();
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

  const fetchAssets = async (searchTerm = "", orderField = "", orderDirection = "") => {
    setLoading(true);
    try {
      const data = await assetsAPI.getAssets({ 
        search: searchTerm,
        ordering: orderDirection === "descend" ? `-${orderField}` : orderField
      });
      setAssets(data.results || data);
      setAssetPagination(prev => ({
        ...prev,
        total: (data.results || data).length
      }));
    } catch (error) {
      message.error("Failed to fetch assets");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchContentIds = async () => {
    try {
      const data = await assetsAPI.getContentIds();
      setContentIds(data);
    } catch (error) {
      console.error('Failed to fetch content IDs:', error);
    }
  };

  const fetchPolicies = async () => {
    try {
      const data = await productsAPI.getPolicies();
      setPolicies(data.results || data);
    } catch (error) {
      message.error("Failed to fetch policies");
      console.error(error);
    }
  };

  const fetchProducts = async (searchTerm = "", orderField = "", orderDirection = "") => {
    setLoading(true);
    try {
      const data = await productsAPI.getProducts({ 
        search: searchTerm,
        ordering: orderDirection === "descend" ? `-${orderField}` : orderField
      });
      setProducts(data.results || data);
      setProductPagination(prev => ({
        ...prev,
        total: (data.results || data).length
      }));
    } catch (error) {
      message.error("Failed to fetch products");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRawMaterials = async (searchTerm = "", orderField = "", orderDirection = "") => {
    setLoading(true);
    try {
      const data = await rawMaterialsAPI.getRawMaterials({ 
        search: searchTerm,
        ordering: orderDirection === "descend" ? `-${orderField}` : orderField
      });
      setRawMaterials(data.results || data);
      setMaterialPagination(prev => ({
        ...prev,
        total: (data.results || data).length
      }));
    } catch (error) {
      message.error("Failed to fetch raw materials");
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
  
  const fetchArchivedAssets = async (searchTerm = "", orderField = "", orderDirection = "") => {
    setLoading(true);
    try {
      const params = {
        search: searchTerm || "",
      };
  
      if (orderField) {
        params.ordering = orderDirection === "descend" ? `-${orderField}` : orderField;
      }
  
      const data = await assetsAPI.getArchivedAssets(params);
      setArchivedAssets(data.results || data);
      setArchiveType("assets");
      setArchiveModalVisible(true);
    } catch (error) {
      message.error("Failed to fetch archived assets");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchArchivedProducts = async (searchTerm = "", orderField = "", orderDirection = "") => {
    setLoading(true);
    try {
      const params = {
        search: searchTerm || "",
      };
  
      if (orderField) {
        params.ordering = orderDirection === "descend" ? `-${orderField}` : orderField;
      }
  
      const data = await productsAPI.getArchivedProducts(params);
      setArchivedProducts(data.results || data);
      setArchiveType("products");
      setArchiveModalVisible(true);
    } catch (error) {
      message.error("Failed to fetch archived products");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchArchivedRawMaterials = async (searchTerm = "", orderField = "", orderDirection = "") => {
    setLoading(true);
    try {
      const params = {
        search: searchTerm || "",
      };
  
      if (orderField) {
        params.ordering = orderDirection === "descend" ? `-${orderField}` : orderField;
      }
  
      const data = await rawMaterialsAPI.getArchivedRawMaterials(params);
      setArchivedRawMaterials(data.results || data);
      setArchiveType("materials");
      setArchiveModalVisible(true);
    } catch (error) {
      message.error("Failed to fetch archived raw materials");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  

  // Handle archived search
  const handleArchivedSearch = (value) => {
    setArchivedSearchValue(value);
    if (archiveType === "items") {
      fetchArchivedItems(value);
    } else if (archiveType === "assets") {
      fetchArchivedAssets(value);
    } else if (archiveType === "products") {
      fetchArchivedProducts(value);
    } else if (archiveType === "materials") {
      fetchArchivedRawMaterials(value);
    }
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
      
      if (activeTab === "items") {
        fetchItems(searchValue, orderField, orderDirection);
      } else if (activeTab === "assets") {
        fetchAssets(searchValue, orderField, orderDirection);
      } else if (activeTab === "products") {
        fetchProducts(searchValue, orderField, orderDirection);
      } else if (activeTab === "materials") {
        fetchRawMaterials(searchValue, orderField, orderDirection);
      }
    }
  };

  const handleArchivedTableChange = (pagination, filters, sorter, extra) => {
    if (sorter && sorter.field) {
      const orderField = sorter.field;
      const orderDirection = sorter.order;
      
      if (activeTab === "items") {
        fetchArchivedItems(searchValue, orderField, orderDirection);
      } else if (activeTab === "assets") {
        fetchArchivedAssets(searchValue, orderField, orderDirection);
      } else if (activeTab === "products") {
        fetchArchivedProducts(searchValue, orderField, orderDirection);
      } else if (activeTab === "materials") {
        fetchArchivedRawMaterials(searchValue, orderField, orderDirection);
      }
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

  const handleAssetPaginationChange = (page, pageSize) => {
    setAssetPagination(prev => ({
      ...prev,
      current: page,
      pageSize
    }));
  };

  const handleProductPaginationChange = (page, pageSize) => {
    setProductPagination(prev => ({
      ...prev,
      current: page,
      pageSize
    }));
  };

  const handleMaterialPaginationChange = (page, pageSize) => {
    setMaterialPagination(prev => ({
      ...prev,
      current: page,
      pageSize
    }));
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

  const handleItemFormSubmit = async (values) => {
    try {
      await itemMasterDataAPI.updateItem(selectedRecord.item_id, values);
      message.success("Item updated successfully");
      setItemModalVisible(false);
      fetchItems();
    } catch (error) {
      message.error(`Failed to update item: ${error.response?.data?.message || error.message}`);
    }
  };

  // Asset form handlers
  const handleAddAsset = () => {
    setModalMode("add");
    assetForm.resetFields();
    setAssetModalVisible(true);
  };

  const handleEditAsset = (record) => {
    setModalMode("edit");
    setSelectedRecord(record);
    assetForm.setFieldsValue({
      asset_name: record.asset_name,
      purchase_date: record.purchase_date ? dayjs(record.purchase_date) : null,
      purchase_price: record.purchase_price,
      serial_no: record.serial_no,
      content_id: record.content_id
    });
    setAssetModalVisible(true);
  };

  const handleAssetFormSubmit = async (values) => {
    // Format date to string format if it exists
    if (values.purchase_date) {
      values.purchase_date = values.purchase_date.format('YYYY-MM-DD');
    }
    
    try {
      if (modalMode === "add") {
        await assetsAPI.createAsset(values);
        message.success("Asset created successfully");
      } else {
        await assetsAPI.updateAsset(selectedRecord.asset_id, values);
        message.success("Asset updated successfully");
      }
      setAssetModalVisible(false);
      fetchAssets();
    } catch (error) {
      message.error(`Failed to ${modalMode} asset: ${error.response?.data?.message || error.message}`);
    }
  };

  // Product form handlers
  const handleAddProduct = () => {
    setModalMode("add");
    productForm.resetFields();
    setProductModalVisible(true);
  };

  const handleEditProduct = (record) => {
    setModalMode("edit");
    setSelectedRecord(record);
    // Set form values based on your product structure
    productForm.setFieldsValue({
      product_name: record.product_name,
      description: record.description,
      selling_price: record.selling_price,
      stock_level: record.stock_level,
      unit_of_measure: record.unit_of_measure,
      batch_no: record.batch_no,
      item_status: record.item_status,
      warranty_period: record.warranty_period,
      policy_id: record.policy_id,
      content_id: record.content_id
    });
    setProductModalVisible(true);
  };

  const handleProductFormSubmit = async (values) => {
    try {
      if (modalMode === "add") {
        await productsAPI.createProduct(values);
        message.success("Product created successfully");
      } else {
        await productsAPI.updateProduct(selectedRecord.product_id, values);
        message.success("Product updated successfully");
      }
      setProductModalVisible(false);
      fetchProducts();
    } catch (error) {
      message.error(`Failed to ${modalMode} product: ${error.response?.data?.message || error.message}`);
    }
  };

  // Raw Material form handlers
  const handleAddMaterial = () => {
    setModalMode("add");
    materialForm.resetFields();
    setMaterialModalVisible(true);
  };

  const handleEditMaterial = (record) => {
    setModalMode("edit");
    setSelectedRecord(record);
    // Set form values based on your raw material structure
    materialForm.setFieldsValue({
      material_name: record.material_name,
      // Add other material fields
    });
    setMaterialModalVisible(true);
  };

  const handleMaterialFormSubmit = async (values) => {
    try {
      if (modalMode === "add") {
        await rawMaterialsAPI.createRawMaterial(values);
        message.success("Raw material created successfully");
      } else {
        await rawMaterialsAPI.updateRawMaterial(selectedRecord.material_id, values);
        message.success("Raw material updated successfully");
      }
      setMaterialModalVisible(false);
      fetchRawMaterials();
    } catch (error) {
      message.error(`Failed to ${modalMode} raw material: ${error.response?.data?.message || error.message}`);
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

  const handleArchiveAsset = async (assetId) => {
    try {
      await assetsAPI.archiveAsset(assetId);
      message.success("Asset archived successfully");
      fetchAssets();
    } catch (error) {
      message.error("Failed to archive asset");
    }
  };

  const handleArchiveProduct = async (productId) => {
    try {
      await productsAPI.archiveProduct(productId);
      message.success("Product archived successfully");
      fetchProducts();
    } catch (error) {
      message.error("Failed to archive product");
    }
  };

  const handleArchiveMaterial = async (materialId) => {
    try {
      await rawMaterialsAPI.archiveRawMaterial(materialId);
      message.success("Raw material archived successfully");
      fetchRawMaterials();
    } catch (error) {
      message.error("Failed to archive raw material");
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

  const handleRestoreAsset = async (assetId) => {
    try {
      await assetsAPI.restoreAsset(assetId);
      message.success("Asset restored successfully");
      fetchArchivedAssets(archivedSearchValue);
      fetchAssets();
    } catch (error) {
      message.error("Failed to restore asset");
    }
  };

  const handleRestoreProduct = async (productId) => {
    try {
      await productsAPI.restoreProduct(productId);
      message.success("Product restored successfully");
      fetchArchivedProducts(archivedSearchValue);
      fetchProducts();
    } catch (error) {
      message.error("Failed to restore product");
    }
  };

  const handleRestoreMaterial = async (materialId) => {
    try {
      await rawMaterialsAPI.restoreRawMaterial(materialId);
      message.success("Raw material restored successfully");
      fetchArchivedRawMaterials(archivedSearchValue);
      fetchRawMaterials();
    } catch (error) {
      message.error("Failed to restore raw material");
    }
  };

  // Handle search with debounce
  const handleSearch = (value) => {
    setSearchValue(value);
    if (activeTab === "items") {
      fetchItems(value);
    } else if (activeTab === "assets") {
      fetchAssets(value);
    } else if (activeTab === "products") {
      fetchProducts(value);
    } else if (activeTab === "materials") {
      fetchRawMaterials(value);
    }
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
     title: "Asset ID",
     dataIndex: "asset_id",
     key: "asset_id",
     sorter: true,
     width: 150,
     render: (text) => text || "---",
    },
    {
     title: "Product ID",
     dataIndex: "product_id",
     key: "product_id",
     sorter: true,
     width: 150,
     render: (text) => text || "---",
    },
    {
     title: "Material ID",
     dataIndex: "material_id",
     key: "material_id",
     sorter: true,
     width: 150,
     render: (text) => text || "---",
    },
    {
      title: "Item Name",
      dataIndex: "item_name",
      key: "item_name",
      sorter: true,
      width: 180,
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

  const assetColumns = [
    {
      title: "Asset ID",
      dataIndex: "asset_id",
      key: "asset_id",
      sorter: true,
      width: 180,
    },
    {
      title: "Asset Name",
      dataIndex: "asset_name",
      key: "asset_name",
      sorter: true,
      width: 180,
    },
    {
      title: "Purchase Date",
      dataIndex: "purchase_date",
      key: "purchase_date",
      sorter: true,
      width: 120,
      render: (date) => date ? new Date(date).toLocaleDateString() : '-',
    },
    {
      title: "Purchase Price",
      dataIndex: "purchase_price",
      key: "purchase_price",
      sorter: true,
      width: 120,
      render: (price) => price ? `₱${parseFloat(price).toFixed(2)}` : '-',
    },
    {
      title: "Serial No",
      dataIndex: "serial_no",
      key: "serial_no",
      width: 150,
      render: (text) => text || "-",
    },
    {
      title: "Content ID",
      dataIndex: "content_id",
      key: "content_id",
      width: 180,
      render: (text) => text || "-",
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
      align: "center",
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            size="small"
            onClick={() => handleEditAsset(record)}
          />
          <Popconfirm
            title="Are you sure you want to archive this asset?"
            onConfirm={() => handleArchiveAsset(record.asset_id)}
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

  const productColumns = [
    {
      title: "Product ID",
      dataIndex: "product_id",
      key: "product_id",
      sorter: true,
      width: 140,
    },
    {
      title: "Product Name",
      dataIndex: "product_name",
      key: "product_name",
      sorter: true,
      width: 100,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      sorter: true,
      width: 180,
    },
    {
      title: "Price",
      dataIndex: "selling_price",
      key: "selling_price",
      sorter: true,
      width: 100,
    },
    {
      title: "Stock Qty",
      dataIndex: "stock_level",
      key: "stock_level",
      sorter: true,
      width: 80,
    },
    {
      title: "UOM",
      dataIndex: "unit_of_measure",
      key: "unit_of_measure",
      sorter: true,
      width: 60,
    },
    {
      title: "Batch No",
      dataIndex: "batch_no",
      key: "batch_no",
      sorter: true,
      width: 100,
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
      title: "Warranty Period",
      dataIndex: "warranty_period",
      key: "warranty_period",
      sorter: true,
      width: 80,
    },
    {
      title: "Policy ID",
      dataIndex: "policy_id",
      key: "policy_id",
      sorter: true,
      width: 100,
    },
    {
      title: "Content ID",
      dataIndex: "content_id",
      key: "content_id",
      sorter: true,
      width: 100,
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
      align: "center",
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            size="small"
            onClick={() => handleEditProduct(record)}
          />
          <Popconfirm
            title="Are you sure you want to archive this product?"
            onConfirm={() => handleArchiveProduct(record.product_id)}
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

  const materialColumns = [
    {
      title: "Material ID",
      dataIndex: "material_id",
      key: "material_id",
      sorter: true,
      width: 100,
    },
    {
      title: "Material Name",
      dataIndex: "material_name",
      key: "material_name",
      sorter: true,
      width: 120,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      sorter: true,
      width: 140,
    },
    {
      title: "UOM",
      dataIndex: "unit_of_measure",
      key: "unit_of_measure",
      sorter: true,
      width: 60,
    },
    {
      title: "Cost",
      dataIndex: "cost_per_unit",
      key: "cost_per_unit",
      sorter: true,
      width: 80,
    },
    {
      title: "Vendor Code",
      dataIndex: "vendor_code",
      key: "vendor_code",
      sorter: true,
      width: 100,
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
      align: "center",
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            size="small"
            onClick={() => handleEditMaterial(record)}
          />
          <Popconfirm
            title="Are you sure you want to archive this raw material?"
            onConfirm={() => handleArchiveMaterial(record.material_id)}
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
       title: "Asset ID",
       dataIndex: "asset_id",
       key: "asset_id",
       sorter: true,
       width: 150,
       render: (text) => text || "---",
      },
      {
       title: "Product ID",
       dataIndex: "product_id",
       key: "product_id",
       sorter: true,
       width: 150,
       render: (text) => text || "---",
      },
      {
       title: "Material ID",
       dataIndex: "material_id",
       key: "material_id",
       sorter: true,
       width: 150,
       render: (text) => text || "---",
      },
      {
        title: "Item Name",
        dataIndex: "item_name",
        key: "item_name",
        sorter: true,
        width: 180,
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
            onConfirm={() => handleRestoreRole(record.item_id)}
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

  const archivedAssetColumns = [
    {
        title: "Asset ID",
        dataIndex: "asset_id",
        key: "asset_id",
        sorter: true,
        width: 180,
    },
    {
        title: "Asset Name",
        dataIndex: "asset_name",
        key: "asset_name",
        sorter: true,
        width: 180,
    },
    {
        title: "Purchase Date",
        dataIndex: "purchase_date",
        key: "purchase_date",
        sorter: true,
        width: 120,
        render: (date) => date ? new Date(date).toLocaleDateString() : '-',
    },
    {
        title: "Purchase Price",
        dataIndex: "purchase_price",
        key: "purchase_price",
        sorter: true,
        width: 120,
        render: (price) => price ? `₱${parseFloat(price).toFixed(2)}` : '-',
    },
    {
        title: "Serial No",
        dataIndex: "serial_no",
        key: "serial_no",
        sorter: true,
        width: 150,
        render: (text) => text || "-",
    },
    {
        title: "Content ID",
        dataIndex: "content_id",
        key: "content_id",
        sorter: true,
        width: 180,
        render: (text) => text || "-",
    },
    {
        title: "Actions",
        key: "actions",
        width: 80,
        align: "center",
        render: (_, record) => (
            <Popconfirm
                title="Are you sure you want to restore this asset?"
                onConfirm={() => handleRestoreAsset(record.asset_id)}
                okText="Yes"
                cancelText="No"
            >
                <Button 
                    type="primary" 
                    icon={<UndoOutlined />} 
                    size="small"
                />
            </Popconfirm>
        ),
    },
    ];
    
const archivedProductColumns = [
    {
      title: "Product ID",
      dataIndex: "product_id",
      key: "product_id",
      sorter: true,
      width: 120,
    },
    {
      title: "Product Name",
      dataIndex: "product_name",
      key: "product_name",
      sorter: true,
      width: 140,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      sorter: true,
      width: 180,
    },
    {
      title: "Price",
      dataIndex: "selling_price",
      key: "selling_price",
      sorter: true,
      width: 100,
    },
    {
      title: "Stock Qty",
      dataIndex: "stock_level",
      key: "stock_level",
      sorter: true,
      width: 80,
    },
    {
      title: "UOM",
      dataIndex: "unit_of_measure",
      key: "unit_of_measure",
      sorter: true,
      width: 60,
    },
    {
      title: "Batch No",
      dataIndex: "batch_no",
      key: "batch_no",
      sorter: true,
      width: 100,
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
      title: "Warranty Period",
      dataIndex: "warranty_period",
      key: "policy_id",
      sorter: true,
      width: 60,
    },
    {
      title: "Policy ID",
      dataIndex: "policy_id",
      key: "policy_id",
      sorter: true,
      width: 100,
    },
    {
      title: "Content ID",
      dataIndex: "content_id",
      key: "content_id",
      sorter: true,
      width: 100,
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
      align: "center",
      render: (_, record) => (
        <Popconfirm
          title="Are you sure you want to restore this product?"
          onConfirm={() => handleRestoreProduct(record.product_id)}
          okText="Yes"
          cancelText="No"
        >
          <Button 
            type="primary" 
            icon={<UndoOutlined />} 
            size="small"
          />
        </Popconfirm>
      ),
    },
  ];

  const archivedMaterialColumns = [
    {
      title: "Material ID",
      dataIndex: "material_id",
      key: "material_id",
      sorter: true,
      width: 100,
    },
    {
      title: "Material Name",
      dataIndex: "material_name",
      key: "material_name",
      sorter: true,
      width: 120,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      sorter: true,
      width: 140,
    },
    {
      title: "UOM",
      dataIndex: "unit_of_measure",
      key: "unit_of_measure",
      sorter: true,
      width: 60,
    },
    {
      title: "Cost",
      dataIndex: "cost_per_unit",
      key: "cost_per_unit",
      sorter: true,
      width: 80,
    },
    {
      title: "Vendor Code",
      dataIndex: "vendor_code",
      key: "vendor_code",
      sorter: true,
      width: 100,
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
      align: "center",
      render: (_, record) => (
        <Popconfirm
          title="Are you sure you want to restore this raw material?"
          onConfirm={() => handleRestoreMaterial(record.material_id)}
          okText="Yes"
          cancelText="No"
        >
          <Button 
            type="primary" 
            icon={<UndoOutlined />} 
            size="small"
          />
        </Popconfirm>
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

  const getAssetTableData = () => {
    const { current, pageSize } = assetPagination;
    const start = (current - 1) * pageSize;
    const end = start + pageSize;
    return assets.slice(start, end);
  };

  const getProductTableData = () => {
    const { current, pageSize } = productPagination;
    const start = (current - 1) * pageSize;
    const end = start + pageSize;
    return products.slice(start, end);
  };

  const getMaterialTableData = () => {
    const { current, pageSize } = materialPagination;
    const start = (current - 1) * pageSize;
    const end = start + pageSize;
    return rawMaterials.slice(start, end);
  };

  // Render main component
  return (
    <div className="item-master">
      <div className="item-master-container">
        <Title level={4} className="page-title">
          {activeTab === "items" ? "Item Master" :
           activeTab === "assets" ? "Asset Management" :
           activeTab === "products" ? "Product Management" :
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
                      <Button 
                        icon={<EyeOutlined />} 
                        onClick={() => fetchArchivedItems("")}
                        className={`archive-btn ${windowWidth <= 576 ? "icon-only-btn" : ""}`}
                      >
                        {windowWidth > 576 ? "View Archived" : ""}
                      </Button>
                    )}
                    {activeTab === "assets" && (
                      <>
                        <Button 
                          icon={<EyeOutlined />} 
                          onClick={() => fetchArchivedAssets("")}
                          className={`archive-btn ${windowWidth <= 576 ? "icon-only-btn" : ""}`}
                        >
                          {windowWidth > 576 ? "View Archived" : ""}
                        </Button>
                        <Button 
                          type="primary" 
                          icon={<PlusOutlined />} 
                          onClick={handleAddAsset}
                          className={windowWidth <= 576 ? "icon-only-btn" : ""}
                        >
                          {windowWidth > 576 ? "Add Asset" : ""}
                        </Button>
                      </>
                    )}
                    {activeTab === "products" && (
                      <>
                        <Button 
                          icon={<EyeOutlined />} 
                          onClick={() => fetchArchivedProducts("")}
                          className={`archive-btn ${windowWidth <= 576 ? "icon-only-btn" : ""}`}
                        >
                          {windowWidth > 576 ? "View Archived" : ""}
                        </Button>
                        <Button 
                          type="primary" 
                          icon={<PlusOutlined />} 
                          onClick={handleAddProduct}
                          className={windowWidth <= 576 ? "icon-only-btn" : ""}
                        >
                          {windowWidth > 576 ? "Add Product" : ""}
                        </Button>
                      </>
                    )}
                    {activeTab === "materials" && (
                      <>
                        <Button 
                          icon={<EyeOutlined />} 
                          onClick={() => fetchArchivedRawMaterials("")}
                          className={`archive-btn ${windowWidth <= 576 ? "icon-only-btn" : ""}`}
                        >
                          {windowWidth > 576 ? "View Archived" : ""}
                        </Button>
                        <Button 
                          type="primary" 
                          icon={<PlusOutlined />} 
                          onClick={handleAddMaterial}
                          className={windowWidth <= 576 ? "icon-only-btn" : ""}
                        >
                          {windowWidth > 576 ? "Add Material" : ""}
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

            <TabPane 
              tab={<span><ToolOutlined /> {windowWidth > 576 ? "Assets" : ""}</span>} 
              key="assets"
            >
              {/* Assets tab content */}
              <div className="table-meta-info">
                <span className="record-count">Total Assets: {assets.length}</span>
                <div className="table-pagination">
                  <Pagination 
                    current={assetPagination.current}
                    pageSize={assetPagination.pageSize}
                    total={assets.length}
                    onChange={handleAssetPaginationChange}
                    showSizeChanger={false}
                    size="small"
                  />
                </div>
              </div>
              <div className="table-container">
                <Table 
                  dataSource={getAssetTableData()} 
                  columns={assetColumns} 
                  rowKey="asset_id"
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
              tab={<span><ShoppingOutlined /> {windowWidth > 576 ? "Products" : ""}</span>} 
              key="products"
            >
              {/* Products tab content */}
              <div className="table-meta-info">
                <span className="record-count">Total Products: {products.length}</span>
                <div className="table-pagination">
                  <Pagination 
                    current={productPagination.current}
                    pageSize={productPagination.pageSize}
                    total={products.length}
                    onChange={handleProductPaginationChange}
                    showSizeChanger={false}
                    size="small"
                  />
                </div>
              </div>
              <div className="table-container">
                <Table 
                  dataSource={getProductTableData()} 
                  columns={productColumns} 
                  rowKey="product_id"
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
              tab={<span><ExperimentOutlined /> {windowWidth > 576 ? "Raw Materials" : ""}</span>} 
              key="materials"
            >
              {/* Raw Materials tab content */}
              <div className="table-meta-info">
                <span className="record-count">Total Raw Materials: {rawMaterials.length}</span>
                <div className="table-pagination">
                  <Pagination 
                    current={materialPagination.current}
                    pageSize={materialPagination.pageSize}
                    total={rawMaterials.length}
                    onChange={handleMaterialPaginationChange}
                    showSizeChanger={false}
                    size="small"
                  />
                </div>
              </div>
              <div className="table-container">
                <Table 
                  dataSource={getMaterialTableData()} 
                  columns={materialColumns} 
                  rowKey="material_id"
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
                            vendors.find(v => v.vendor_code === selectedRecord.preferred_vendor)?.vendor_name || 'None' : 
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
                
                <div className="action-row">
                    <Button 
                    type="primary" 
                    onClick={() => {
                        setModalMode("edit");
                        itemForm.setFieldsValue({
                        preferred_vendor: selectedRecord?.preferred_vendor,
                        purchasing_uom: selectedRecord?.purchasing_uom,
                        items_per_purchase_unit: selectedRecord?.items_per_purchase_unit,
                        purchase_quantity_per_package: selectedRecord?.purchase_quantity_per_package,
                        sales_uom: selectedRecord?.sales_uom,
                        items_per_sale_unit: selectedRecord?.items_per_sale_unit,
                        sales_quantity_per_package: selectedRecord?.sales_quantity_per_package
                        });
                    }}
                    style={{ backgroundColor: '#00A8A8', borderColor: '#00A8A8' }}
                    >
                    Edit
                    </Button>
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
                        {vendor.vendor_name}
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

        {/* Asset Modal */}
        <Modal
          title={modalMode === "add" ? "Add New Asset" : modalMode === "edit" ? "Edit Asset" : "View Asset"}
          visible={assetModalVisible}
          onCancel={() => setAssetModalVisible(false)}
          footer={modalMode === "view" ? [
            <Button key="close" onClick={() => setAssetModalVisible(false)}>
              Close
            </Button>
          ] : null}
          width={600}
          className="custom-modal"
        >
          <Form
            form={assetForm}
            layout="vertical"
            disabled={modalMode === "view"}
            onFinish={handleAssetFormSubmit}
          >
            <Form.Item
              name="asset_name"
              label="Asset Name"
              rules={[{ required: true, message: "Please enter asset name" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="purchase_date"
              label="Purchase Date"
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="purchase_price"
              label="Purchase Price"
            >
              <InputNumber 
                min={0}
                style={{ width: '100%' }}
              />
            </Form.Item>

            <Form.Item
              name="serial_no"
              label="Serial Number"
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="content_id"
              label="Content ID"
            >
              <Select allowClear placeholder="Select content ID">
                {contentIds.map(contentIds => (
                  <Option key={contentIds} value={contentIds}>
                    {contentIds}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {modalMode !== "view" && (
              <Form.Item className="form-actions">
                <Space>
                  <Button type="primary" htmlType="submit">
                    {modalMode === "add" ? "Create" : "Update"}
                  </Button>
                  <Button onClick={() => setAssetModalVisible(false)}>
                    Cancel
                  </Button>
                </Space>
              </Form.Item>
            )}
          </Form>
        </Modal>

        {/* Product Modal */}
        <Modal
          title={modalMode === "add" ? "Add New Product" : modalMode === "edit" ? "Edit Product" : "View Product"}
          visible={productModalVisible}
          onCancel={() => setProductModalVisible(false)}
          footer={modalMode === "view" ? [
            <Button key="close" onClick={() => setProductModalVisible(false)}>
              Close
            </Button>
          ] : null}
          width={600}
          className="custom-modal"
        >
          <Form
            form={productForm}
            layout="vertical"
            disabled={modalMode === "view"}
            onFinish={handleProductFormSubmit}
          >
            <Form.Item
              name="product_name"
              label="Product Name"
              rules={[{ required: true, message: "Please enter product name" }]}
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
              name="selling_price"
              label="Selling Price"
            >
              <InputNumber 
                min={0}
                style={{ width: '100%' }}
                formatter={value => `₱ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>

            <Form.Item
              name="stock_level"
              label="Stock Level"
            >
              <InputNumber 
                min={0}
                style={{ width: '100%' }}
              />
            </Form.Item>

            <Form.Item
              name="unit_of_measure"
              label="Unit of Measure"
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
              name="batch_no"
              label="Batch No"
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="item_status"
              label="Status"
              initialValue="Active"
            >
              <Select>
                <Option value="Active">Active</Option>
                <Option value="Inactive">Inactive</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="warranty_period"
              label="Warranty Period"
            >
              <InputNumber 
                min={0}
                style={{ width: '100%' }}
              />
            </Form.Item>

            <Form.Item
              name="policy_id"
              label="Policy ID"
            >
              <Select allowClear placeholder="Select policy ID">
                {policies.map(policies => (
                  <Option key={policies} value={policies}>
                    {policies}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="content_id"
              label="Content ID"
            >
              <Select allowClear placeholder="Select content ID">
                {contentIds.map(contentIds => (
                  <Option key={contentIds} value={contentIds}>
                    {contentIds}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {modalMode !== "view" && (
              <Form.Item className="form-actions">
                <Space>
                  <Button type="primary" htmlType="submit">
                    {modalMode === "add" ? "Create" : "Update"}
                  </Button>
                  <Button onClick={() => setProductModalVisible(false)}>
                    Cancel
                  </Button>
                </Space>
              </Form.Item>
            )}
          </Form>
        </Modal>

        {/* Raw Material Modal */}
        <Modal
          title={modalMode === "add" ? "Add New Raw Material" : modalMode === "edit" ? "Edit Raw Material" : "View Raw Material"}
          visible={materialModalVisible}
          onCancel={() => setMaterialModalVisible(false)}
          footer={modalMode === "view" ? [
            <Button key="close" onClick={() => setMaterialModalVisible(false)}>
              Close
            </Button>
          ] : null}
          width={600}
          className="custom-modal"
        >
          <Form
            form={materialForm}
            layout="vertical"
            disabled={modalMode === "view"}
            onFinish={handleMaterialFormSubmit}
          >
            <Form.Item
              name="material_name"
              label="Material Name"
              rules={[{ required: true, message: "Please enter material name" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="material_code"
              label="Material Code"
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
              name="category"
              label="Category"
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="unit_cost"
              label="Unit Cost"
            >
              <InputNumber 
                min={0}
                style={{ width: '100%' }}
                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>

            <Form.Item
              name="unit_of_measure"
              label="Unit of Measure"
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
              name="preferred_vendor"
              label="Preferred Vendor"
            >
              <Select allowClear placeholder="Select a vendor">
                {vendors.map(vendor => (
                  <Option key={vendor.vendor_id} value={vendor.vendor_id}>
                    {vendor.vendor_name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {modalMode !== "view" && (
              <Form.Item className="form-actions">
                <Space>
                  <Button type="primary" htmlType="submit">
                    {modalMode === "add" ? "Create" : "Update"}
                  </Button>
                  <Button onClick={() => setMaterialModalVisible(false)}>
                    Cancel
                  </Button>
                </Space>
              </Form.Item>
            )}
          </Form>
        </Modal>

        {/* Archive Modal */}
        <Modal
          title={`Archived ${
            archiveType === "items" ? "Items" : 
            archiveType === "assets" ? "Assets" : 
            archiveType === "products" ? "Products" : 
            "Raw Materials"
          }`}
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
              placeholder={`Search archived ${
                archiveType === "items" ? "items" : 
                archiveType === "assets" ? "assets" : 
                archiveType === "products" ? "products" : 
                "raw materials"
              }...`}
              allowClear
              onSearch={handleArchivedSearch}
              value={archivedSearchValue}
              onChange={(e) => setArchivedSearchValue(e.target.value)}
              prefix={<SearchOutlined />}
            />
          </div>
          {archiveType === "items" && (
            <Table 
              dataSource={archivedItems} 
              columns={archivedItemColumns} 
              rowKey="item_id"
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
          )}
          {archiveType === "assets" && (
            <Table 
              dataSource={archivedAssets} 
              columns={archivedAssetColumns} 
              rowKey="asset_id"
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
          )}
          {archiveType === "products" && (
            <Table 
              dataSource={archivedProducts} 
              columns={archivedProductColumns} 
              rowKey="product_id"
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
          )}
          {archiveType === "materials" && (
            <Table 
              dataSource={archivedRawMaterials} 
              columns={archivedMaterialColumns} 
              rowKey="material_id"
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
          )}
        </Modal>
      </div>
    </div>
  );
};

export default ItemMasterManagement;