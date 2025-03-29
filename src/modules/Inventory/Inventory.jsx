import React, { useEffect, useState } from "react";
import "./styles/Inventory.css";
import InvNav from "./components/InvNav";
import InvProductTable from "./components/InvProductTable";
import InvRestockForm from "./components/InvRestockForm";
import InvItemCards from "./components/InvItemCards";

const BodyContent = () => {
  const [productData, setProductData] = useState([]);
  const [assetData, setAssetData] = useState([]);
  const [rawMaterialData, setRawMaterialData] = useState([]);

  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingAssets, setLoadingAssets] = useState(true);
  const [loadingRawMats, setLoadingRawMats] = useState(true);

  const [activeTab, setActiveTab] = useState("Products");
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/products/")
      .then((res) => res.json())
      .then((data) => {
        setProductData(data);
        setLoadingProducts(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setLoadingProducts(false);
      });
  }, []);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/assets/")
      .then((res) => res.json())
      .then((data) => {
        setAssetData(data);
        setLoadingAssets(false);
      })
      .catch((err) => {
        console.error("Error fetching assets:", err);
        setLoadingAssets(false);
      });
  }, []);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/raw-materials/")
      .then((res) => res.json())
      .then((data) => {
        setRawMaterialData(data);
        setLoadingRawMats(false);
      })
      .catch((err) => {
        console.error("Error fetching raw materials:", err);
        setLoadingRawMats(false);
      });
  }, []);

  const tableConfigs = {
    Products: {
      columns: [
        "Name",
        "Item ID",
        "Total Stock",
        "Ordered Stock",
        "Commited Stock",
        "Available Stock"
      ],
      data: productData.map((product) => {
        const itemId = product.admin_item?.item_id || product.item || "???";
        const inventoryData = product.admin_item || {};

        return {
          product_id: product.product_id || "???",
          item_id: itemId,
          Name: product.product_name,
          "Item ID": itemId,
          "Total Stock": inventoryData.total_stock || "000",
          "Ordered Stock": inventoryData.stock_on_order || "000",
          "Commited Stock": inventoryData.stock_committed || "000",
          "Available Stock": inventoryData.available_stock || "000",
        };
      }),
      loading: loadingProducts,
    },
    
    Assets: {
      columns: ["Name", "Item ID", "Serial No", "Purchase Date", "Available Stock"],
      data: assetData.map((asset) => ({
        item_id: asset.item_id || "???",
        asset_id: asset.asset_id || "???",
        Name: asset.asset_name || "Asset Name",
        "Item ID": asset.item_id || "???",
        "Serial No": asset.serial_no || "N/A",
        "Purchase Date": asset.purchase_date || "N/A",
        "Available Stock": asset.available_stock || "000",
      })),
      loading: loadingAssets,
    },
    
    "Raw Materials": {
      columns: ["Name", "Item ID", "Description", "Unit", "Available Stock"],
      data: rawMaterialData.map((mat) => ({
        item_id: mat.item_id || "???",
        material_id: mat.material_id || "???",
        Name: mat.material_name || "Raw Material Name",
        "Item ID": mat.item_id || "???",
        "Description": mat.description || "No description available",
        "Unit": mat.unit_of_measure || "N/A",
        "Available Stock": mat.available_stock || "000",
      })),
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
    .sort((a, b) => (a.Name || "").localeCompare(b.Name || ""));

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

        {/* Product Table */}
        <InvProductTable
          loading={currentConfig.loading}
          columns={currentConfig.columns}
          data={filteredData}
          onSelectProduct={setSelectedItem}
        />

        <div className="w-full hidden md:block">
          <div className="flex justify-between items-center p-3 h-15">
            <h2 className="text-lg font-semibold mt-6">
              Selected Item Details
            </h2>
            <button
              onClick={toggleModal}
              className="mt-4 bg-cyan-600 text-white px-3 py-1 rounded cursor-pointer"
            >
              Restock Request
            </button>
          </div>

          <div className="border border-gray-300 rounded-lg p-6 mt-2">
            <div className="grid grid-cols-5 gap-4">
              {selectedItem ? (
                <>
                  {activeTab === "Products" && (
                    <div>
                      <p className="text-cyan-600 font-medium">Product ID</p>
                      <p>{selectedItem.product_id || "N/A"}</p>
                    </div>
                  )}
                  {activeTab === "Assets" && (
                    <div>
                      <p className="text-cyan-600 font-medium">Asset ID</p>
                      <p>{selectedItem.asset_id || "N/A"}</p>
                    </div>
                  )}
                  {activeTab === "Raw Materials" && (
                    <div>
                      <p className="text-cyan-600 font-medium">Material ID</p>
                      <p>{selectedItem.material_id || "N/A"}</p>
                    </div>
                  )}
                  {Object.entries(selectedItem)
                    // Hide item_id from display (but keep it for restock)
                    .filter(([key]) => !["product_id", "asset_id", "material_id", "item_id"].includes(key))
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
        <InvRestockForm onClose={toggleModal} selectedItem={selectedItem} />
      )}
    </div>
  );
};

export default BodyContent;
