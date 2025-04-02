import React, { useState, useEffect } from "react";
import "../styles/StockFlow.css";

const BodyContent = () => {
    const [warehouseMovements, setWarehouseMovements] = useState([]); // State to store fetched data
    const[warehouseData, setWarehouseData] = useState([]); // State to store warehouse data
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("Transfer History"); // State to manage active tab

    // Fetch data from Warehouse Transfers Django API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:8000/api/warehouse-transfers/");
                if (!response.ok) throw new Error("Failed to fetch data");
                const data = await response.json();
                setWarehouseMovements(data);
                console.log("Fetched Data:", data); 
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []); 

    // Fetch data from Warehouse API
    useEffect(() => {
        const fetchWarehouseData = async () => { 
            try {
                const response = await fetch("http://localhost:8000/api/warehouse-item-list/");
                if (!response.ok) throw new Error("Failed to fetch data");
                const data = await response.json();
                setWarehouseData(data);
                console.log("Fetched Warehouse Data:", data); 
            }
            catch (err) {
                setError(err.message);
            }
            finally {
                setLoading(false);
            }
        };
        
        fetchWarehouseData();
    }, []); 


    // Table Configurations per Active Tab
    const stockFlowTableConfigs = {
        "Transfer History": {
            Columns: ["movement_id", "item", "movement_type", "movement_date","Quantity", "Origin" ],
            Data: warehouseMovements
        },
        "Warehouse": {
            Columns: ["Item Name", "Type", "Item Management", "Quantity", "Expiry"],
            Data:  warehouseData
        },
        
    };

    const activeConfig = stockFlowTableConfigs[activeTab];

    return (
        <div className="stockflow">
            <div className="body-content-container">
                
                {/* Navigation Tabs */}
                <nav className="top-0 left-0 flex flex-wrap justify-between max-h-[50px] space-x-8 w-full p-2">
                    <div className="invNav flex border-b border-gray-200 space-x-8 md:w-auto mt-1 mb-1">
                        {Object.keys(stockFlowTableConfigs).map((tab) => (
                            <span
                                key={tab}
                                className={`cursor-pointer text:xs md:text-md font-semibold transition-colors ${
                                    activeTab === tab ? "text-cyan-600 border-b-2 border-cyan-600" : "text-gray-500"
                                }`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab}
                            </span>
                        ))}
                    </div>
                </nav>

                {/* Data Table Section */}
                <section className="flex w-full h-100 overflow-y-auto rounded-lg">
                    <div className="flex-1 border min-h-[400px] border-gray-300 rounded-lg scroll-container overflow-y-auto p-3">
                        {loading ? (
                            <p className="text-center text-gray-600">Loading data...</p>
                        ) : error ? (
                            <p className="text-center text-red-600">{error}</p>
                        ) : (
                            <table className="w-full table-layout:fixed text-center cursor-pointer">
                                <thead>
                                    <tr className="border-b border-gray-300">
                                        {activeConfig.Columns.map((header) => (
                                            <th key={header} className="p-2 text-gray-600">{header}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {activeConfig.Data.length === 0 ? (
                                        <tr>
                                            <td colSpan={activeConfig.Columns.length} className="text-gray-500 p-2">
                                                No data available
                                            </td>
                                        </tr>
                                    ) : (
                                        activeConfig.Data.map((item, index) => (
                                            <tr key={index} className="border-b border-gray-300">
                                                {activeConfig.Columns.map((col) => (
                                                    <td key={col} className="text-sm p-2">
                                                        {item[col.toLowerCase().replace(/\s+/g, "_")]} {/* Convert column names to match API keys */}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                    
                    {/* side section for filters and item details */}
                    <div className={`flex flex-col justify-between  rounded-lg min-h-full w-[230px] ml-4 p-1 ${activeTab !== "Warehouse" ? "hidden" : ""}`}>
                        <div className="flex flex-col justify-between space-y-2">
                            
                            {/* Warehouse Filyer */}
                            <select name="" id="" className="border rounded-lg border-gray-300 h-[30px] text-gray-600 cursor-pointer p-1">
                                <option value="" className="text-gray-600">Select Warehouse</option>
                                {warehouseData.map((warehouse) => (
                                    <option className="text-gray-600 cursor-pointer" key={warehouse.warehouse_id} value={warehouse.warehouse_id}>
                                        {warehouse.warehouse_location}
                                    </option>
                                ))}
                            </select>

                            {/* Expiry */}
                            <select name="" id="" className="border rounded-lg border-gray-300 h-[30px] text-gray-600 cursor-pointer p-1">
                                <option value="">Select Expiry</option>
                            </select>
                        </div>
                        <div>
                            <h2 className="text-center text-gray-600">ITEM DETAILS</h2>
                            <div className="h-[290px] border rounded-lg border-gray-300 p-2">

                            </div>  
                        </div>
                        
                    </div>
                </section>
            </div>               
        </div>
    );
};

export default BodyContent;
