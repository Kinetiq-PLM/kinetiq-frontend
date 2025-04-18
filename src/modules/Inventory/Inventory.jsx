import React, { useEffect, useState } from "react";
import "./styles/Inventory.css";
import InvNav from "./components/InvNav";
import InvProductTable from "./components/InvProductTable";
import InvRestockForm from "./components/InvRestockForm";
import InvItemCards from "./components/InvItemCards";

const BodyContent = () => {
  const [productData, setProductData] = useState([]);
  const [productInventoryData, setProductInventoryData] = useState([]);
  const [assetData, setAssetData] = useState([]);
  const [assetInventoryData, setAssetInventoryData] = useState([]);
  const [rawMaterialData, setRawMaterialData] = useState([]);
  const [materialInventoryData, setMaterialInventoryData] = useState([]);

  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingAssets, setLoadingAssets] = useState(true);
  const [loadingRawMats, setLoadingRawMats] = useState(true);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState("Products");
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Refresh states for API refetching
  const [refreshProducts, setRefreshProducts] = useState(0);
  const [refreshAssets, setRefreshAssets] = useState(0);
  const [refreshRawMats, setRefreshRawMats] = useState(0);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]);

  useEffect(() => {
    setError(null);
    setLoadingProducts(true);

    // Fetch basic product data
    fetch("http://127.0.0.1:8000/api/products/")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setProductData(data);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setError("Failed to load product data");
      });

    // Fetch product inventory data from new endpoint
    fetch(`http://127.0.0.1:8000/api/product-inventory/`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Inventory data received:", data);
        if (Array.isArray(data)) {
          setProductInventoryData(data);
        } else {
          console.error("Expected array but got:", data);
          setError("Invalid inventory data format");
        }
        setLoadingProducts(false);
      })
      .catch((err) => {
        console.error("Error fetching product inventory:", err);
        setError(`Failed to load inventory data: ${err.message}`);
        setLoadingProducts(false);
      });
  }, [refreshProducts]);

  useEffect(() => {
    setLoadingAssets(true);

    // Fetch basic asset data
    fetch("http://127.0.0.1:8000/api/assets/")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setAssetData(data);
      })
      .catch((err) => {
        console.error("Error fetching assets:", err);
        setError("Failed to load asset data");
      });

    // Fetch asset inventory data
    fetch("http://127.0.0.1:8000/api/asset-inventory/")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Asset inventory data received:", data);
        if (Array.isArray(data)) {
          setAssetInventoryData(data);
        } else {
          console.error("Expected array but got:", data);
          setError("Invalid asset inventory data format");
        }
        setLoadingAssets(false);
      })
      .catch((err) => {
        console.error("Error fetching asset inventory:", err);
        setError(`Failed to load asset inventory data: ${err.message}`);
        setLoadingAssets(false);
      });
  }, [refreshAssets]);

  useEffect(() => {
    setLoadingRawMats(true);

    // Fetch basic raw material data
    fetch("http://127.0.0.1:8000/api/raw-materials/")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setRawMaterialData(data);
      })
      .catch((err) => {
        console.error("Error fetching raw materials:", err);
        setError("Failed to load raw material data");
      });

    // Fetch material inventory data
    fetch(`http://127.0.0.1:8000/api/material-inventory/`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Material inventory data received:", data);
        if (Array.isArray(data)) {
          setMaterialInventoryData(data);
        } else {
          console.error("Expected array but got:", data);
          setError("Invalid material inventory data format");
        }
        setLoadingRawMats(false);
      })
      .catch((err) => {
        console.error("Error fetching material inventory:", err);
        setError(`Failed to load material inventory data: ${err.message}`);
        setLoadingRawMats(false);
      });
  }, [refreshRawMats]);

  const refreshInventory = () => {
    // Refresh data based on active tab
    if (activeTab === "Products") {
      setRefreshProducts(prev => prev + 1);
    } else if (activeTab === "Assets") {
      setRefreshAssets(prev => prev + 1);
    } else if (activeTab === "Raw Materials") {
      setRefreshRawMats(prev => prev + 1);
    }
  };

  // Merge product data with inventory data
  const mergedProductData = productData.map(product => {
    const inventoryInfo = productInventoryData.find(inv => inv.product_id === product.product_id);
    return {
      ...product,
      inventory_data: inventoryInfo ? {
        total_stock: inventoryInfo.total_stock || 0,
        stock_committed: inventoryInfo.stock_committed || 0,
        available_stock: inventoryInfo.available_stock || 0,
        minimum_threshold: inventoryInfo.minimum_threshold || 0,
        maximum_threshold: inventoryInfo.maximum_threshold || 0,
        last_update: inventoryInfo.last_update
      } : {
        total_stock: 0,
        stock_committed: 0,
        available_stock: 0,
        minimum_threshold: 0,
        maximum_threshold: 0
      }
    };
  });

  // Merge asset data with inventory data
  const mergedAssetData = assetData.map(asset => {
    const inventoryInfo = assetInventoryData.find(inv => inv.asset_id === asset.asset_id);
    return {
      ...asset,
      inventory_data: inventoryInfo ? {
        total_stock: inventoryInfo.total_stock || 0,
        stock_on_order: inventoryInfo.stock_on_order || 0,
        minimum_threshold: inventoryInfo.minimum_threshold || 0,
        maximum_threshold: inventoryInfo.maximum_threshold || 0,
        last_update: inventoryInfo.last_update
      } : {
        total_stock: 0,
        stock_on_order: 0,
        minimum_threshold: 0,
        maximum_threshold: 0
      }
    };
  });

  // Merge raw material data with inventory data
  const mergedMaterialData = rawMaterialData.map(material => {
    const inventoryInfo = materialInventoryData.find(inv => inv.material_id === material.material_id);
    return {
      ...material,
      inventory_data: inventoryInfo ? {
        total_stock: inventoryInfo.total_stock || 0,
        stock_on_order: inventoryInfo.stock_on_order || 0,
        minimum_threshold: inventoryInfo.minimum_threshold || 0,
        maximum_threshold: inventoryInfo.maximum_threshold || 0,
        last_update: inventoryInfo.last_update
      } : {
        total_stock: 0,
        stock_on_order: 0,
        minimum_threshold: 0,
        maximum_threshold: 0
      }
    };
  });

  const tableConfigs = {
    Products: {
      columns: [
        "Name",
        "Item ID",
        "Total Stock",
        "Committed Stock",
        "Available Stock",
        "Status"
      ],
      data: mergedProductData.map((product) => {
        const itemId = product.item_id || "???";
        const inventoryData = product.inventory_data || {};

        let status = "In Stock";
        if (inventoryData.available_stock === 0) {
          status = "Out of Stock";
        } else if (inventoryData.available_stock < inventoryData.minimum_threshold) {
          status = "Low Stock";
        }

        return {
          product_id: product.product_id || "???",
          item_id: itemId,
          Name: product.product_name,
          "Item ID": itemId,
          "Total Stock": inventoryData.total_stock || 0,
          "Committed Stock": inventoryData.stock_committed || 0,
          "Available Stock": inventoryData.available_stock || 0,
          "Status": status,
          "Minimum Threshold": inventoryData.minimum_threshold || 0,
          "Maximum Threshold": inventoryData.maximum_threshold || 0,
          "Last Updated": inventoryData.last_update ? new Date(inventoryData.last_update).toLocaleString() : "Unknown"
        };
      }),
      loading: loadingProducts,
    },

    Assets: {
      columns: ["Name", "Item ID", "Serial No", "Total Stock", "On Order", "Status"],
      data: mergedAssetData.map((asset) => {
        const inventoryData = asset.inventory_data || {};

        let status = "In Stock";
        if (inventoryData.total_stock === 0) {
          status = "Out of Stock";
        } else if (inventoryData.total_stock < inventoryData.minimum_threshold) {
          status = "Low Stock";
        }

        return {
          item_id: asset.item_id || "???",
          asset_id: asset.asset_id || "???",
          Name: asset.asset_name || "Asset Name",
          "Item ID": asset.item_id || "???",
          "Serial No": asset.serial_no || "N/A",
          "Purchase Date": asset.purchase_date || "N/A",
          "Total Stock": inventoryData.total_stock || 0,
          "On Order": inventoryData.stock_on_order || 0,
          "Status": status,
          "Minimum Threshold": inventoryData.minimum_threshold || 0,
          "Maximum Threshold": inventoryData.maximum_threshold || 0,
          "Last Updated": inventoryData.last_update ? new Date(inventoryData.last_update).toLocaleString() : "Unknown"
        };
      }),
      loading: loadingAssets,
    },

    "Raw Materials": {
      columns: ["Name", "Item ID", "Description", "Total Stock", "On Order", "Status"],
      data: mergedMaterialData.map((material) => {
        const inventoryData = material.inventory_data || {};

        let status = "In Stock";
        if (inventoryData.total_stock === 0) {
          status = "Out of Stock";
        } else if (inventoryData.total_stock < inventoryData.minimum_threshold) {
          status = "Low Stock";
        }

        return {
          item_id: material.item_id || "???",
          material_id: material.material_id || "???",
          Name: material.material_name || "Raw Material Name",
          "Item ID": material.item_id || "???",
          "Description": material.description || "No description available",
          "Unit": material.unit_of_measure || "N/A",
          "Total Stock": inventoryData.total_stock || 0,
          "On Order": inventoryData.stock_on_order || 0,
          "Status": status,
          "Minimum Threshold": inventoryData.minimum_threshold || 0,
          "Maximum Threshold": inventoryData.maximum_threshold || 0,
          "Last Updated": inventoryData.last_update ? new Date(inventoryData.last_update).toLocaleString() : "Unknown"
        };
      }),
      loading: loadingRawMats,
    },
  };

  const currentConfig = tableConfigs[activeTab];

  const search = debouncedSearchTerm.toLowerCase().trim();
  const filteredData = currentConfig.data
    .filter((item) => {
      const nameVal = (item.Name || "").toLowerCase();
      return search === "" || nameVal.startsWith(search);
    })
    .sort((a, b) => {
      // If product tab, show low stock items first
      if (activeTab === "Products") {
        const isLowStockA = (a["Available Stock"] || 0) < (a["Minimum Threshold"] || 0);
        const isLowStockB = (b["Available Stock"] || 0) < (b["Minimum Threshold"] || 0);

        if (isLowStockA && !isLowStockB) return -1;
        if (!isLowStockA && isLowStockB) return 1;
      }

      // If asset or raw material tab, show low stock items first
      if (activeTab === "Assets" || activeTab === "Raw Materials") {
        const isLowStockA = (a["Total Stock"] || 0) < (a["Minimum Threshold"] || 0);
        const isLowStockB = (b["Total Stock"] || 0) < (b["Minimum Threshold"] || 0);

        if (isLowStockA && !isLowStockB) return -1;
        if (!isLowStockA && isLowStockB) return 1;
      }

      // General stock-based sorting
      const stockField = (activeTab === "Assets" || activeTab === "Raw Materials") ? "Total Stock" : "Available Stock";
      const stockA = parseInt(a[stockField] || "0");
      const stockB = parseInt(b[stockField] || "0");

      if (stockA !== stockB) {
        return stockA - stockB; // Lower stock comes first
      }

      return (a.Name || "").localeCompare(b.Name || "");
    });

  const toggleModal = () => setShowModal(!showModal);

  return (
    <div className={`inv ${showModal ? "blurred" : ""}`}>
      <div className="body-content-container flex">
        <InvNav
          activeTab={activeTab}
          onTabChange={setActiveTab}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        {/* Error message display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Product Table */}
        <InvProductTable
          loading={currentConfig.loading}
          columns={currentConfig.columns}
          data={filteredData}
          onSelectProduct={setSelectedItem}
        />

        <div className="w-full hidden md:block">
          {/* <div className="flex justify-between items-center p-3 h-15">
            <h2 className="text-lg font-semibold mt-6">
              Selected Item Details
            </h2>
            {(activeTab === "Assets" || activeTab === "Raw Materials" || 
              (activeTab === "Products" && selectedItem && 
               selectedItem["Available Stock"] < selectedItem["Minimum Threshold"])) && (
              <button
                onClick={toggleModal}
                className="mt-4 bg-cyan-600 text-white px-3 py-1 rounded cursor-pointer"
              >
                Restock Request
              </button>
            )}
          </div> */}

          <div className="min-h-[150px] border border-gray-300 rounded-lg p-6 mt-2">
            <div className="grid grid-cols-5 gap-4">
              {selectedItem ? (
                <>
                  {activeTab === "Products" && (
                    <>
                      <div>
                        <p className="text-cyan-600 font-medium">Product ID</p>
                        <p>{selectedItem.product_id || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-cyan-600 font-medium">Minimum Threshold</p>
                        <p>{selectedItem["Minimum Threshold"] || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-cyan-600 font-medium">Maximum Threshold</p>
                        <p>{selectedItem["Maximum Threshold"] || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-cyan-600 font-medium">Last Updated</p>
                        <p>{selectedItem["Last Updated"] || "N/A"}</p>
                      </div>
                    </>
                  )}
                  {activeTab === "Assets" && (
                    <>
                      <div>
                        <p className="text-cyan-600 font-medium">Asset ID</p>
                        <p>{selectedItem.asset_id || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-cyan-600 font-medium">Minimum Threshold</p>
                        <p>{selectedItem["Minimum Threshold"] || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-cyan-600 font-medium">Maximum Threshold</p>
                        <p>{selectedItem["Maximum Threshold"] || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-cyan-600 font-medium">Last Updated</p>
                        <p>{selectedItem["Last Updated"] || "N/A"}</p>
                      </div>
                    </>
                  )}
                  {activeTab === "Raw Materials" && (
                    <>
                      <div>
                        <p className="text-cyan-600 font-medium">Material ID</p>
                        <p>{selectedItem.material_id || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-cyan-600 font-medium">Minimum Threshold</p>
                        <p>{selectedItem["Minimum Threshold"] || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-cyan-600 font-medium">Maximum Threshold</p>
                        <p>{selectedItem["Maximum Threshold"] || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-cyan-600 font-medium">Last Updated</p>
                        <p>{selectedItem["Last Updated"] || "N/A"}</p>
                      </div>
                    </>
                  )}
                  {Object.entries(selectedItem)
                    .filter(([key]) => !["product_id", "asset_id", "material_id", "item_id", "Minimum Threshold", "Maximum Threshold", "Last Updated"].includes(key))
                    .map(([label, value]) => (
                      <div key={label}>
                        <p className="text-cyan-600 font-medium">{label}</p>
                        <p>{value}</p>
                      </div>
                    ))}
                </>
              ) : (
                <p>No item selected</p>
              )}
            </div>
          </div>
        </div>

        <div className="inventory-cards-container w-full overflow-y-auto max-h-[80vh]">
          <InvItemCards
            items={filteredData}
            onSelectItem={setSelectedItem}
            openModal={toggleModal}
          />
        </div>
      </div>

      {showModal && (
        <InvRestockForm
          onClose={() => {
            toggleModal();
            refreshInventory();
          }}
          selectedItem={selectedItem}
          activeTab={activeTab}
        />
      )}
    </div>
  );
};

export default BodyContent;