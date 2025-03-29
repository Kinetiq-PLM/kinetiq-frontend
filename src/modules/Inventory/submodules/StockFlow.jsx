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
                const response = await fetch("http://localhost:8000/api/warehouse-list/");
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
            Columns: ["Warehouse_ID", "Warehouse_Location"],
            Data:  warehouseData
        },
        
    };

    const activeConfig = stockFlowTableConfigs[activeTab];

    return (
        <div className="stockflow">
            <div className="body-content-container">
                
                {/* Navigation Tabs */}
                <nav className="top-0 left-0 flex flex-wrap justify-between space-x-8 w-full p-2">
                    <div className="invNav flex border-b border-gray-200 space-x-8 md:w-auto mt-3 mb-1">
                        {Object.keys(stockFlowTableConfigs).map((tab) => (
                            <span
                                key={tab}
                                className={`cursor-pointer text:xs md:text-lg font-semibold transition-colors ${
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
                <section className="w-full h-100 overflow-y-auto rounded-lg grid">
                    <div className="pcounts-table-container flex-2 border border-gray-300 rounded-lg scroll-container overflow-y-auto m-h-auto p-3">
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
                                                    <td key={col} className="p-2">
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
                </section>
            </div>               
        </div>
    );
};

export default BodyContent;
