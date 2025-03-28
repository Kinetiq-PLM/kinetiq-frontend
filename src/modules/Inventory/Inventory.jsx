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
      columns: ["Name", "Total Stock", "Ordered Stock", "Commited Stock", "Available Stock"],
      data: productData.map((product) => {
        const itemData =
          product.item_master_data && product.item_master_data.length > 0
            ? product.item_master_data[0]
            : {};
        return {
          Name: product.product_name,
          "Total Stock": itemData.total_stock || "000",
          "Ordered Stock": itemData.stock_on_order || "000",
          "Commited Stock": itemData.stock_committed || "000",
          "Available Stock": itemData.available_stock || "000",
        };
      }),
      loading: loadingProducts,
    },
    Assets: {
      columns: ["Name", "Available Stock"],
      data: assetData.map((asset) => ({
        Name: asset.asset_name || "Asset Name",
        "Available Stock": asset.available_stock || "000",
      })),
      loading: loadingAssets,
    },
    "Raw Materials": {
      columns: ["Name", "Available Stock"],
      data: rawMaterialData.map((mat) => ({
        Name: mat.material_name || "Raw Material Name",
        "Available Stock": mat.available_stock || "000",
      })),
      loading: loadingRawMats,
    },
  };

  const currentConfig = tableConfigs[activeTab];

  const toggleModal = () => setShowModal(!showModal);

  return (
    <div className={`inv ${showModal ? "blurred" : ""}`}>
      <div className="body-content-container flex">

        <InvNav activeTab={activeTab} onTabChange={setActiveTab} />

        <InvProductTable
          loading={currentConfig.loading}
          columns={currentConfig.columns}
          data={currentConfig.data}
          onSelectProduct={setSelectedItem}
        />

        <div className="w-full hidden md:block">
          <div className="flex justify-between items-center p-3 h-15">
            <h2 className="text-lg font-semibold mt-6">Selected Item Details</h2>
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
                Object.entries(selectedItem).map(([label, value]) => (
                  <div key={label}>
                    <p className="text-cyan-600 font-medium">{label}</p>
                    <p>{value}</p>
                  </div>
                ))
              ) : (
                <p>No item selected</p>
              )}
            </div>
          </div>
        </div>

        <div className="inventory-cards-container w-full overflow-y-auto max-h-[80vh]">
          <InvItemCards
            items={currentConfig.data}
            onSelectItem={setSelectedItem}
            openModal={toggleModal}
          />
        </div>
      </div>

      {showModal && <InvRestockForm onClose={toggleModal} />}
    </div>
  );
};

export default BodyContent;
