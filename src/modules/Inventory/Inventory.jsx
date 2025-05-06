import React, { useEffect, useState, useMemo } from "react";
import "./styles/Inventory.css";
import InvNav from "./components/InvNav";
import InvProductTable from "./components/InvProductTable";
import InvRestockForm from "./components/InvRestockForm";
// Removed InvItemCards as it wasn't used in the provided snippet
// import InvItemCards from "./components/InvItemCards";

// Define the base URL for your local backend API
const BASE_API_URL = "https://y7jvlug8j6.execute-api.ap-southeast-1.amazonaws.com/dev/api";

// --- Helper Function for API Fetching ---
const fetchData = async (url, setData, setLoading, setError, entityName) => {
  setLoading(true);
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status} fetching ${entityName} from ${url}`);
    }
    const data = await response.json();
    console.log(`${entityName} data received:`, data);
    if (Array.isArray(data)) {
      setData(data);
    } else {
      console.error(`Expected array for ${entityName} but got:`, data);
      throw new Error(`Invalid ${entityName} data format`);
    }
  } catch (err) {
    console.error(`Error fetching ${entityName}:`, err);
    // Append new errors, don't overwrite existing ones from parallel fetches
    setError(prev => prev ? `${prev}\nFailed to load ${entityName} data: ${err.message}` : `Failed to load ${entityName} data: ${err.message}`);
    setData([]); // Clear data on error
  } finally {
    setLoading(false);
  }
};


const BodyContent = () => {
  // --- State Definitions ---
  // Data states
  const [productData, setProductData] = useState([]);
  const [assetData, setAssetData] = useState([]); // Holds individual InventoryItem data for assets
  const [rawMaterialBatchData, setRawMaterialBatchData] = useState([]); // Holds individual batches
  const [aggregatedRawMaterialData, setAggregatedRawMaterialData] = useState([]); // Holds aggregated type data

  // Loading states
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingAssets, setLoadingAssets] = useState(true);
  const [loadingRawMatBatches, setLoadingRawMatBatches] = useState(true);
  const [loadingAggregatedRawMats, setLoadingAggregatedRawMats] = useState(true); // New loading state
  const [loadingWarehouses, setLoadingWarehouses] = useState(true);
  const [error, setError] = useState(null); // Combined error state

  // UI states
  const [activeTab, setActiveTab] = useState("Products");
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Refresh trigger
  const [refreshCounter, setRefreshCounter] = useState(0);

  // Warehouse states
  const [warehouseList, setWarehouseList] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState("");


  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(timerId);
  }, [searchTerm]);

  // Fetch Warehouse List
  useEffect(() => {
    // Clear errors before starting fetches for this cycle
    setError(null);
    fetchData("https://y7jvlug8j6.execute-api.ap-southeast-1.amazonaws.com/dev/api/warehouse-list/", setWarehouseList, setLoadingWarehouses, setError, "Warehouse List");
  }, []); // Runs once

  // Fetch Product Data (Aggregated, filtered for stock > 0)
  useEffect(() => {
    const url = selectedWarehouse
      ? `${BASE_API_URL}/warehouse-stock/all-items/?warehouse_id=${selectedWarehouse}&item_type=Product`
      : `${BASE_API_URL}/products/`;
    fetchData(url, setProductData, setLoadingProducts, setError, "Products");
  }, [selectedWarehouse, refreshCounter]);

  // Fetch Asset Data (Individual Items)
  useEffect(() => {
    const url = selectedWarehouse
      ? `${BASE_API_URL}/warehouse-stock/all-items/?warehouse_id=${selectedWarehouse}&item_type=Asset`
      : `${BASE_API_URL}/assets/`;
    fetchData(url, setAssetData, setLoadingAssets, setError, "Assets");
  }, [selectedWarehouse, refreshCounter]);

  // Fetch Raw Material Batch Data (Individual Items)
  useEffect(() => {
    const url = selectedWarehouse
      ? `${BASE_API_URL}/warehouse-stock/all-items/?warehouse_id=${selectedWarehouse}&item_type=Raw Material`
      : `${BASE_API_URL}/raw-materials/`;
    fetchData(url, setRawMaterialBatchData, setLoadingRawMatBatches, setError, "Raw Material Batches");
  }, [selectedWarehouse, refreshCounter]);

  useEffect(() => {

    const aggregateUrl = `${BASE_API_URL}/material-inventory/`;
    console.log(`Fetching aggregated raw materials from: ${aggregateUrl}`);
    fetchData(aggregateUrl, setAggregatedRawMaterialData, setLoadingAggregatedRawMats, setError, "Aggregated Raw Materials");
  }, [refreshCounter]);

  const selectedWarehouseLocation = useMemo(() => {
    if (!selectedWarehouse) return "All Warehouses";
    const found = warehouseList.find(w => w.warehouse_id === selectedWarehouse);
    return found ? found.warehouse_location : "Unknown Warehouse";
  }, [selectedWarehouse, warehouseList]);

  const aggregatedRawMaterialMap = useMemo(() => {
    const map = new Map();
    aggregatedRawMaterialData.forEach(item => {
      map.set(item.item_id, {
        total_stock: item.total_stock || 0,
        stock_on_order: item.stock_on_order || 0,
        minimum_threshold: item.minimum_threshold || 0,
        maximum_threshold: item.maximum_threshold || 0
      });
    });
    return map;
  }, [aggregatedRawMaterialData]);


  const tableConfigs = {
    Products: {
      columns: ["Name", "Item ID", "Total Stock", "Committed Stock", "Available Stock", "Status"],
      data: productData.map((product) => {
        const totalStock = product.total_stock || 0;
        const availableStock = product.available_stock || 0; // Assuming backend provides this
        const minThreshold = product.minimum_threshold || 0;
        let status = "In Stock";
        // Use 'available_stock' for status check if available, otherwise fallback to total_stock
        const stockForStatus = product.hasOwnProperty('available_stock') ? availableStock : totalStock;
        if (stockForStatus <= 0) status = "Out of Stock";
        else if (stockForStatus < minThreshold && minThreshold > 0) status = "Low Stock";
        return {
          ...product,
          Name: product.item_name || "Unknown Product",
          "Item ID": product.item_id || "???",
          "Total Stock": totalStock,
          "Committed Stock": product.stock_committed || 0, // Assuming backend provides this
          "Available Stock": availableStock,
          Status: status,
          "Minimum Threshold": minThreshold,
          "Maximum Threshold": product.maximum_threshold || 0,
          "Last Updated": product.last_update ? new Date(product.last_update).toLocaleString() : "Unknown"
        };
      }),
      loading: loadingProducts,
    },
    Assets: {
      columns: ["Name", "Item ID", "Serial No", "Quantity", "Status", "Warehouse"],
      data: assetData.map((asset) => {
        const status = (asset.current_quantity ?? 0) > 0 ? "In Stock" : "Out of Stock";
        // If 'expiry' exists and is past, set status to 'Expired' (optional)
        // if (asset.expiry && new Date(asset.expiry) < new Date()) status = "Expired";
        return {
          ...asset,
          Name: asset.item_name || "Unknown Asset",
          "Item ID": asset.item_id_display || "???", // Use item_id_display from InventoryItem
          "Serial No": asset.item_no || "N/A",
          Quantity: asset.current_quantity ?? 0,
          Status: status,
          Warehouse: asset.warehouse_id || "N/A", // Warehouse from InventoryItem
          "Last Updated": asset.last_update ? new Date(asset.last_update).toLocaleString() : "Unknown",
          "Minimum Threshold": "N/A", // Not applicable to individual items
          "Maximum Threshold": "N/A", // Not applicable to individual items
        };
      }),
      loading: loadingAssets,
    },
    "Raw Materials": {
      // Columns now show Batch details + Aggregated Type totals
      columns: ["Name", "Item ID", "Batch No.", "Batch Qty", "Total Stock (Type)", "On Order (Type)", "Status", "Warehouse", "Expiry"],
      data: rawMaterialBatchData.map((batch) => {
        // Look up aggregated info using the batch's item_id_display
        const aggregateInfo = aggregatedRawMaterialMap.get(batch.item_id_display) || {};
        const totalStockType = aggregateInfo.total_stock ?? 0;
        const onOrderType = aggregateInfo.stock_on_order ?? 0;
        const minThresholdType = aggregateInfo.minimum_threshold ?? 0;

        const batchQty = batch.current_quantity ?? 0;
        let status = batchQty > 0 ? "In Stock" : "Out of Stock"; // Batch status based on its own qty

        // Check for expiry first
        if (batch.expiry && new Date(batch.expiry) < new Date()) {
          status = "Expired";
        }
        // If not expired and batch has stock, check against type's threshold
        else if (status === "In Stock" && totalStockType < minThresholdType && minThresholdType > 0) {
          status = "Low Stock (Type)"; // Indicate low stock based on overall type
        }

        return {
          ...batch, // Include original batch fields
          Name: batch.item_name || "Unknown Material",
          "Item ID": batch.item_id_display || "???",
          "Batch No.": batch.item_no || "N/A",
          "Batch Qty": batchQty,
          "Total Stock (Type)": totalStockType,
          "On Order (Type)": onOrderType,
          "Status": status,
          "Warehouse": batch.warehouse_id || "N/A",
          "Expiry": batch.expiry ? new Date(batch.expiry).toLocaleDateString() : "N/A",
          "Last Updated": batch.last_update ? new Date(batch.last_update).toLocaleString() : "Unknown",

          "Minimum Threshold (Type)": minThresholdType,
          "Maximum Threshold (Type)": aggregateInfo.maximum_threshold ?? 0,
        };
      }),
      // Loading depends on both batch data and aggregate data
      loading: loadingRawMatBatches || loadingAggregatedRawMats,
    },
  };

  const currentConfig = tableConfigs[activeTab];

  // --- Filtering and Sorting ---
  const search = debouncedSearchTerm.toLowerCase().trim();
  const filteredData = currentConfig.data
    .filter((item) => {
      if (!item) return false; // Add safety check
      const nameVal = (item.Name || "").toLowerCase();
      const idVal = (item["Item ID"] || "").toLowerCase();
      let specificIdentifierVal = "";
      if (activeTab === "Assets") specificIdentifierVal = (item["Serial No"] || "").toLowerCase();
      else if (activeTab === "Raw Materials") specificIdentifierVal = (item["Batch No."] || "").toLowerCase();

      return search === "" || nameVal.startsWith(search) || idVal.includes(search) || (specificIdentifierVal && specificIdentifierVal.includes(search));
    })
    .sort((a, b) => {
      // Status Order: Expired -> Low Stock (Type) -> Low Stock -> Out of Stock -> In Stock
      const statusOrder = { "Expired": 0, "Low Stock (Type)": 1, "Low Stock": 1, "Out of Stock": 2, "In Stock": 3 };
      const statusA = statusOrder[a.Status] ?? 99; // Use ?? for safety
      const statusB = statusOrder[b.Status] ?? 99;
      if (statusA !== statusB) return statusA - statusB;

      // Expiry Date (Raw Materials) - Sooner first
      if (activeTab === "Raw Materials") {
        const expiryA = a.Expiry && a.Expiry !== "N/A" ? new Date(a.expiry) : null; // Use raw expiry field
        const expiryB = b.Expiry && b.Expiry !== "N/A" ? new Date(b.expiry) : null;
        if (expiryA && expiryB) { if (expiryA.getTime() !== expiryB.getTime()) return expiryA.getTime() - expiryB.getTime(); }
        else if (expiryA) return -1; // Items with expiry come before those without
        else if (expiryB) return 1;
      }

      // Stock/Quantity (Lower first)
      let stockA, stockB;
      if (activeTab === "Products") { stockA = a["Available Stock"] ?? 0; stockB = b["Available Stock"] ?? 0; }
      else if (activeTab === "Assets") { stockA = a["Quantity"] ?? 0; stockB = b["Quantity"] ?? 0; }
      else { stockA = a["Batch Qty"] ?? 0; stockB = b["Batch Qty"] ?? 0; } // Raw Mats use Batch Qty
      if (stockA !== stockB) return stockA - stockB;

      // Fallback Sorting: Name -> Item ID -> Specific ID
      const nameCompare = (a.Name || "").localeCompare(b.Name || ""); if (nameCompare !== 0) return nameCompare;
      const idCompare = (a["Item ID"] || "").localeCompare(b["Item ID"] || ""); if (idCompare !== 0) return idCompare;
      if (activeTab === "Assets") { const serialCompare = (a["Serial No"] || "").localeCompare(b["Serial No"] || ""); if (serialCompare !== 0) return serialCompare; }
      else if (activeTab === "Raw Materials") { const batchCompare = (a["Batch No."] || "").localeCompare(b["Batch No."] || ""); if (batchCompare !== 0) return batchCompare; }
      return 0;
    });

  // --- Event Handlers & Other Logic ---
  // Reset selected item when tab changes
  useEffect(() => { setSelectedItem(null); }, [activeTab]);
  const toggleModal = () => setShowModal(!showModal);
  const manualRefresh = () => {
    setError(null); // Clear errors on refresh
    setRefreshCounter(prev => prev + 1);
  }

  // --- Dashboard Box Logic ---
  const lowStockCount = useMemo(() => {
    if (currentConfig.loading) return '...';
    if (activeTab === "Products") {
      // Counts products where status is Low Stock or Out of Stock
      return filteredData.filter(item => item.Status === 'Low Stock' || item.Status === 'Out of Stock').length;
    } else if (activeTab === "Raw Materials") {
      // Counts batches that are Expired or belong to a Low Stock (Type) or are Out of Stock
      return filteredData.filter(item => item.Status === 'Expired' || item.Status === 'Low Stock (Type)' || item.Status === 'Out of Stock').length;
    } else if (activeTab === "Assets") {
      // Counts assets that are Out of Stock (or Expired if logic added)
      return filteredData.filter(item => item.Status === 'Out of Stock').length;
    }
    return 0;
  }, [activeTab, filteredData, currentConfig.loading]);

  // Adjust label based on what's counted
  const lowStockLabel = useMemo(() => {
    if (activeTab === "Products") return "Low/Out of Stock Products";
    if (activeTab === "Raw Materials") return "Critical Batches"; // Expired, Low Type, Out of Stock
    if (activeTab === "Assets") return "Out of Stock Assets";
    return "Items Needing Attention";
  }, [activeTab]);


  // --- Render ---
  return (
    <div className={`inv ${showModal ? "blurred" : ""}`}>
      <div className="body-content-container">

        {/* Header Section */}
        <div className=" w-full min-h-[200px]">
          <div className=" w-full min-h-[80px] flex justify-between items-start gap-5 mb-5">
            <div className="flex-col w-full">
              <h2 className="text-cyan-600 text-3xl font-semibold">INVENTORY DASHBOARD</h2>
              <p className="text-base font-semibold mt-1">Selected Warehouse: <span className="font-normal">{selectedWarehouseLocation}</span></p>
            </div>
            <div className="mt-0 w-64">
              <label htmlFor="warehouse-select" className="block text-sm font-medium text-gray-700 mb-1">Filter by Warehouse</label>
              <select id="warehouse-select" className="w-full border border-gray-300 rounded-lg p-2 text-gray-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500" value={selectedWarehouse} onChange={(e) => setSelectedWarehouse(e.target.value)} disabled={loadingWarehouses}>
                <option value="">All Warehouses</option>
                {warehouseList.map((w) => (<option key={w.warehouse_id} value={w.warehouse_id} className="text-gray-600 cursor-pointer">{w.warehouse_location || `Warehouse ${w.warehouse_id}`}</option>))}
              </select>
              {loadingWarehouses && <p className="text-xs text-gray-500 mt-1">Loading warehouses...</p>}
            </div>
          </div>

          {/* Dashboard Top Boxes */}
          <div className=" w-full min-h-[100px] grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-10">
            {/* Box 1 */}
            <div className=" flex items-center justify-start gap-5 rounded-xl p-4 w-full bg-gray-100 border border-gray-200">
              <span className=" flex items-center justify-center h-[50px] w-[50px] bg-cyan-100 rounded-full text-cyan-600 text-2xl"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg></span>
              <span><p className="text-base font-semibold text-gray-700">Total Items ({activeTab})</p><p className="text-xl font-bold text-cyan-700">{currentConfig.loading ? '...' : filteredData.length}<span className="text-sm font-normal text-gray-500"> Items</span></p></span>
            </div>
            {/* Box 2 */}
            <div className=" flex items-center justify-start gap-5 rounded-xl p-4 w-full bg-gray-100 border border-gray-200">
              <span className=" flex items-center justify-center h-[50px] w-[50px] bg-emerald-100 rounded-full text-emerald-600 text-2xl"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h6.375M9 12h6.375m-6.375 5.25h6.375M5.25 21h13.5" /></svg></span>
              <span><p className="text-base font-semibold text-gray-700">Warehouses Active</p><p className="text-xl font-bold text-emerald-700">{loadingWarehouses ? '...' : warehouseList.length}<span className="text-sm font-normal text-gray-500"> Active</span></p></span>
            </div>
            {/* Box 3 */}
            <div className=" flex items-center justify-start gap-5 rounded-xl p-4 w-full bg-gray-100 border border-gray-200">
              <span className=" flex items-center justify-center h-[50px] w-[50px] bg-amber-100 rounded-full text-amber-600 text-2xl"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg></span>
              <span><p className="text-base font-semibold text-gray-700">{lowStockLabel} ({activeTab})</p><p className="text-xl font-bold text-amber-700">{lowStockCount}<span className="text-sm font-normal text-gray-500"> Items</span></p></span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs and Search */}
        <InvNav activeTab={activeTab} onTabChange={setActiveTab} searchTerm={searchTerm} onSearchChange={setSearchTerm} />

        {/* Error message display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            <pre className="block sm:inline whitespace-pre-wrap">{error}</pre> {/* Use pre for newlines */}
            <button onClick={() => setError(null)} className="absolute top-0 bottom-0 right-0 px-4 py-3"><svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" /></svg></button>
          </div>
        )}

        {/* Inventory Table */}
        <InvProductTable loading={currentConfig.loading} columns={currentConfig.columns} data={filteredData} onSelectProduct={setSelectedItem} activeTab={activeTab} selectedItem={selectedItem} />



      </div> {/* End body-content-container */}

      {/* Restock Modal */}
      {showModal && (
        <InvRestockForm onClose={() => { toggleModal(); manualRefresh(); }} selectedItem={selectedItem} activeTab={activeTab} />
      )}
    </div> // End inv div
  );
};

export default BodyContent;
