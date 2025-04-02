import React, { useState, useEffect, use } from "react";
import "../styles/StockFlow.css";

const BodyContent = () => {
    const [warehouseMovements, setWarehouseMovements] = useState([]); // State to store warehouse movements data
    const[warehouseItemsData, setWarehouseItemsData] = useState([]); // State to store warehouse data\
    const[warehouseList, setWarehouseListData] = useState([]); // State management to store warehouse loc data
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("Transfer History"); // State to manage active tab
    const [selectedItem, setSelectedItem] = useState(null); // State to manage the selected item/row sa table
    const [selectedWarehouse, setWarehouse] = useState("");
    const [selectedExpiry, setExpiry] = useState("");
    const [filteredData, setFilteredData] = useState([])

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
        const fetchWarehouseItemsData = async () => { 
            try {
                const response = await fetch("http://localhost:8000/api/warehouse-item-list/");
                if (!response.ok) throw new Error("Failed to fetch data");
                const data = await response.json();
                setWarehouseItemsData(data);
                console.log("Fetched Warehouse Data:", data); 
            }
            catch (err) {
                setError(err.message);
            }
            finally {
                setLoading(false);
            }
        };
        
        fetchWarehouseItemsData();
    }, []); 


    // Fetch data from Warehouse Transfers Django API
    useEffect(() => {
        const fetchWarehouseListData = async () => {
            try {
                const response = await fetch("http://localhost:8000/api/warehouse-list/");
                if (!response.ok) throw new Error("Failed to fetch data");
                const data = await response.json();
                setWarehouseListData(data);
                console.log("Fetched Data:", data); 
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchWarehouseListData();
    }, []); 





    // Filter Function for Warehouse Locations & Expiry
    
       // Filter function for expiry dates
       const filterByExpiry = (items, range) => {
        if (!range) return items;
        
        const now = new Date();
        return items.filter(item => {
            if (!item.expiry_date) return false;
            
            const expiryDate = new Date(item.expiry_date);
            if (isNaN(expiryDate)) return false;

            switch (range) {
                case "Next 30 days":
                    const in30Days = new Date();
                    in30Days.setDate(now.getDate() + 30);
                    return expiryDate >= now && expiryDate <= in30Days;
                
                case "Next 6 months":
                    const in6Months = new Date();
                    in6Months.setMonth(now.getMonth() + 6);
                    return expiryDate >= now && expiryDate <= in6Months;
                
                case "Within this year":
                    return expiryDate.getFullYear() === now.getFullYear();
                
                case "expired":
                    return expiryDate < now;
                
                default:
                    return true;
            }
        });
    };

    // Apply filters whenever criteria change
    // Apply filters whenever criteria change
    useEffect(() => {
        if (activeTab !== "Warehouse") return;
        
        let result = warehouseItemsData;

        // Apply warehouse filter
        if (selectedWarehouse) {
            result = result.filter(item => 
                item.warehouse_loc && item.warehouse_loc.toLowerCase() === selectedWarehouse.toLowerCase()
            );
        }

        // Apply expiry filter
        if (selectedExpiry) {
            result = filterByExpiry(result, selectedExpiry);
        }

        console.log("Filtered Data:", result); // Debugging
        setFilteredData(result);
    }, [selectedWarehouse, selectedExpiry, warehouseItemsData, activeTab]);


    // Table Configurations per Active Tab
    const stockFlowTableConfigs = {
        "Transfer History": {
            Columns: ["movement_id", "item", "movement_type", "movement_date","Quantity", "Origin" ],
            Data: warehouseMovements
        },
        "Warehouse": {
            Columns: ["Item Name", "Type", "Item Management", "Quantity", "Expiry"],
            Data:  filteredData.map((item) => {
                return {
                    "Item Name": item.item_name || "Unknown",
                    "Type": item.type || "Unspecified",
                    "Item Management": item.item_management || "-",
                    "Quantity": item.quantity || "-",
                    "Expiry": item.expiry_date || "-" 
                }
            })
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
                                            <tr key={index} className="border-b border-gray-300" onClick={() => setSelectedItem(index)}>
                                                {activeConfig.Columns.map((col) => (
                                                    <td key={col} className="text-sm p-2">
                                                        {item[col]} {/* Convert column names to match API keys */}
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
                            
                            {/* Warehouse Filter */}
                            <select name="" id="" className="border rounded-lg border-gray-300 h-[30px] text-gray-600 cursor-pointer p-1" onChange={(e) => setWarehouse(e.target.value)}>
                                <option value="" className="text-gray-600">Select Warehouse</option>
                                {warehouseList.map((warehouse) => (
                                    <option className="text-gray-600 cursor-pointer" key={warehouse.warehouse_id} value={warehouse.warehouse_location}>
                                        {warehouse.warehouse_location}
                                    </option>
                                ))}
                            </select>

                            {/* Expiry */}
                            <select name="" id="" className="border rounded-lg border-gray-300 h-[30px] text-gray-600 cursor-pointer p-1" onChange={(e) => setExpiry(e.target.value)}>
                                <option value="" >Select Expiry</option>
                                {["Next 30 Days", "Next 6 Months", "Within this Year"].map((d) => (
                                        <option key={d} value={d}>{d}</option>
                                    ))}
                                
                            </select>
                        </div>

                        {/* Selected Items and Item Deatils Label */}
                        <div>
                            <h3 className="text-center text-gray-600 mt-2"></h3>

                            {/* Selected Items Container */}
                            <div className="h-[300px] border rounded-lg border-gray-300 p-2">
                            {
                                selectedItem !== null ? (
                                    <>
                                        {[
                                            {label: "Selected Item", value: warehouseItemsData[selectedItem]?.item_name || "Unknown"},
                                            {label: "Item Type", value: warehouseItemsData[selectedItem]?.type},
                                            {label: "Item Management", value: warehouseItemsData[selectedItem]?.item_management + ": " + warehouseItemsData[selectedItem]?.identifier},
                                            {label: "Quantity", value: warehouseItemsData[selectedItem]?.quantity},
                                            {label: "Expiry", value: warehouseItemsData[selectedItem]?.expiry_date},
                                            {label: "Warehouse Location", value: warehouseItemsData[selectedItem]?.warehouse_loc}
                                        ].map(({label, value}) => (
                                            <div key={label} className="mb-1">
                                                <h5 className="text-gray-700 text-[15px] font-semibold">{label}</h5>
                                                <p className="text-gray-500 text-[14px]">{value}</p>
                                            </div>
                                        ))}
                                    </>
                                ) : (
                                    <p className="mt-[100px] text-gray-600 text-sm text-center">Select a Row to View Details</p>                                      
                                )
                            }
                            </div>  
                        </div>
                        
                    </div>
                </section>
            </div>               
        </div>
    );
};

export default BodyContent;
