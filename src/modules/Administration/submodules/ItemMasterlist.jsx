import React, { useState, useEffect } from "react";
import { 
  itemMasterDataAPI, 
  assetsAPI, 
  productsAPI, 
  rawMaterialsAPI,
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
    "Each", "Pair", "Set", "Pack", "Box", "Carton", "Pallet",
    "Meter", "Centimeter", "Foot", "Inch", "Yard",
    "Kilogram", "Gram", "Pound", "Ounce", "Ton",
    "Liter", "Milliliter", "Gallon", "Quart", "Pint",
    "Hour", "Minute", "Day", "Week", "Month",
    "Square Meter", "Square Foot", "Cubic Meter", "Cubic Foot"
  ];

  // Fetch data when component mounts or tab changes
  useEffect(() => {
    if (activeTab === "items") {
      fetchItems();
    } else if (activeTab === "assets") {
      fetchAssets();
    } else if (activeTab === "products") {
      fetchProducts();
    } else if (activeTab === "materials") {
      fetchRawMaterials();
    }
    
    // Fetch vendors for dropdowns
    fetchVendors();
    
    // Mock content IDs for demonstration (replace with actual API if available)
    const mockContentIds = [
      "OPS-DOI-2025-32ef23",
      "FIN-DOI-2025-ab7812",
      "HR-DOI-2025-9df451",
      "PROD-DOI-2025-f45e12"
    ];
    setContentIds(mockContentIds);
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
    try {
      const data = await vendorAPI.getVendors();
      setVendors(data.results || data);
    } catch (error) {
      console.error('Error fetching vendors:', error);
      // Don't show an error message to users since this is background data
    }
  };

  const fetchArchivedItems = async (searchTerm = "") => {
    setLoading(true);
    try {
      const data = await itemMasterDataAPI.getArchivedItems({ search: searchTerm });
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

  const fetchArchivedAssets = async (searchTerm = "") => {
    setLoading(true);
    try {
      const data = await assetsAPI.getArchivedAssets({ search: searchTerm });
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

  const fetchArchivedProducts = async (searchTerm = "") => {
    setLoading(true);
    try {
      const data = await productsAPI.getArchivedProducts({ search: searchTerm });
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

  const fetchArchivedRawMaterials = async (searchTerm = "") => {
    setLoading(true);
    try {
      const data = await rawMaterialsAPI.getArchivedRawMaterials({ search: searchTerm });
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
      item_name: record.item_name,
      item_type: record.item_type,
      unit_of_measure: record.unit_of_measure,
      item_status: record.item_status,
      manage_item_by: record.manage_item_by,
      preferred_vendor: record.preferred_vendor,
      preferred_vendor_name: record.preferred_vendor_name,
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
      preferred_vendor_name: record.preferred_vendor_name,
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
      // Add other product fields
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
      title: "Item Type",
      dataIndex: "item_type",
      key: "item_type",
      sorter: true,
      width: 100,
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
      title: "Preferred Vendor",
      dataIndex: "preferred_vendor_name",
      key: "preferred_vendor_name",
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
      render: (price) => price ? `$${parseFloat(price).toFixed(2)}` : '-',
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
      width: 180,
    },
    {
      title: "Product Name",
      dataIndex: "product_name",
      key: "product_name",
      sorter: true,
      width: 180,
    },
    // Add other product columns as needed
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
      width: 180,
    },
    {
      title: "Material Name",
      dataIndex: "material_name",
      key: "material_name",
      sorter: true,
      width: 180,
    },
    // Add other material columns as needed
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
      width: 100,
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
      title: "Actions",
      key: "actions",
      width: 80,
      align: "center",
      render: (_, record) => (
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
        render: (price) => price ? `$${parseFloat(price).toFixed(2)}` : '-',
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


