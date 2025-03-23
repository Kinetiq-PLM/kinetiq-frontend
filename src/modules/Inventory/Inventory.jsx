import React, { useState } from "react";
import "./styles/Inventory.css";
import InvNav from "./components/InvNav";
import InvProductTable from "./components/InvProductTable";
import InvRestockForm from "./components/InvRestockForm";
import InvItemCards from "./components/InvItemCards";

const BodyContent = () => {
    // Sample Data for place holders muna
    const productData = Array(20).fill({
        "Name": "Product Name",
        "Total Stock": "000",
        "Ordered Stock": "000",
        "Commited Stock": "000",
        "Available Stock": "000"
    });

    const assetData = Array(20).fill({
        "Name": "Asset Name",
        "Available Stock": "000"
    });

    const rawmatData = Array(20).fill({
        "Name": "Raw Material Name",
        "Available Stock": "000"
    });

    // Table Configurations
    const tableConfigs = {
        Products: {
            columns: ["Name", "Total Stock", "Ordered Stock", "Commited Stock", "Available Stock"],
            data: productData,
        },
        Assets: {
            columns: ["Name", "Available Stock"],
            data: assetData,
        },
        "Raw Materials": {
            columns: ["Name", "Available Stock"],
            data: rawmatData,
        },
    };

    // --- STATES ----

    // State management para kay active tab
    const [activeTab, setActiveTab] = useState("Products");
    const currentConfig = tableConfigs[activeTab];

    // State management para sa selected item
    const [selectedItem, setSelectedItem] = useState(productData[0]);

    // Modal Stock Request
    const [showModal, setShowModal] = useState(false);

    // Open/Close Modal
    const toggleModal = () => setShowModal(!showModal);

    return (
        <div className={`inv ${showModal ? "blurred" : ""}`}>
            <div className="body-content-container flex">
                <InvNav activeTab={activeTab} onTabChange={setActiveTab} />

                <InvProductTable
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
                            {Object.entries(selectedItem).map(([label, value]) => (
                                <div key={label}>
                                    <p className="text-cyan-600 font-medium">{label}</p>
                                    <p>{value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Inventory Item Cards for Small Screens  */}
                <div className="inventory-cards-container w-full  overflow-y-auto max-h-[80vh]">
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
