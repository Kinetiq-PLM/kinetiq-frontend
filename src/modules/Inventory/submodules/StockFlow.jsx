import React, { useState, useEffect, use } from "react";
import InvRestockForm from "../components/TransferStockForm";
import NoSelectedItemModal from "../components/NoSelectedItemModal";
import "../styles/StockFlow.css";


const BodyContent = () => {

     // State to store warehouse movements data
    const [warehouseMovementsView, setWarehouseMovementsView] = useState([]);

    // State to store warehouse data\
    const[warehouseItemsData, setWarehouseItemsData] = useState([]); 

    // State management to store warehouse loc data
    const[warehouseList, setWarehouseListData] = useState([]); 

    // Status for fetching data
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State to manage active tab
    const [activeTab, setActiveTab] = useState("Warehouse"); 

    // State to manage the selected item/row sa table
    const [selectedItem, setSelectedItem] = useState(null); 

    // Filter States
    const [selectedWarehouse, setWarehouse] = useState("");
    const [selectedExpiry, setExpiry] = useState("");

    const[caputredItem, setCapturedItem] = useState(null);
    
    const [showModal, setShowModal] = useState(false);
    const toggleModal = () => {
        setShowModal(!showModal
    )};

    useEffect(() => {
        setSelectedItem(null);
    }, [activeTab]);




    // Fetch data from Warehouse Movements view 
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8000/api/warehousemovement-data/");
                if (!response.ok) throw new Error("Failed to fetch data");
                const data = await response.json();
                setWarehouseMovementsView(data);
                console.log("Fetched Data:", data); 
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []); 

    // Fetch data from Items per Warehouse  API
    useEffect(() => {
        const fetchWarehouseItemsData = async () => { 
            try {
                const response = await fetch("http://127.0.0.1:8000/api/warehouse-item-list/");
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


    // Fetch data from Warehouse List 
    useEffect(() => {
        const fetchWarehouseListData = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8000/api/warehouse-list/");
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





    // Filter Functions for Warehouse Locations & Expiry
    
       // Filter function for expiry dates
       const filterByExpiry = (items, range) => {
        if (!range) return items;
        
        const now = new Date();
        return items.filter(item => {
            if (!item.expiry) return false;
            
            const expiryDate = new Date(item.expiry);
            if (isNaN(expiryDate)) return false;

            switch (range) {
                case "Next 30 Days":
                    const in30Days = new Date();
                    in30Days.setDate(now.getDate() + 30);
                    return expiryDate >= now && expiryDate <= in30Days;
                
                case "Next 6 Months":
                    const in6Months = new Date();
                    in6Months.setMonth(now.getMonth() + 6);
                    return expiryDate >= now && expiryDate <= in6Months;
                
                case "Within this Year":
                    return expiryDate.getFullYear() === now.getFullYear();
                
                case "expired":
                    return expiryDate < now;
                
                default:
                    return true;
            }
        });
    };


    // Apply filters whenever criteria change

    const expiryFilteredData = filterByExpiry(warehouseItemsData, selectedExpiry);

    const filteredData = expiryFilteredData.filter((item) => {
        const warehouseMatch = selectedWarehouse ? item.warehouse_location?.toLowerCase() === selectedWarehouse.toLowerCase() : true;
        return warehouseMatch;
    });

        
    
    
    


    // Table Configurations per Active Tab
    const stockFlowTableConfigs = {
        "Warehouse": {
            Columns: ["Item Name", "Type", "Item Management", "Quantity", "Expiry"],
            Data:  filteredData.map((item) => {
                return {
                    "Inventory Item ID": item?.inventory_item_id || "none",
                    "Item Name": item?.item_name || "Unknown",
                    "Type": item?.item_type || "Unspecified",
                    "Item Management": item.item_management || "-",
                    "Quantity": item?.current_quantity || "-",
                    "Expiry": item?.expiry || "-" 
                }
            })
        },
        "Transfer History": {
            Columns: ["Movement ID", "Movement Date", "Origin", "Destination","Remarks", "Status" ],
            Data: warehouseMovementsView.map((item) => {
                return {
                    "Movement ID": item?.movement_id || "-",
                    "Movement Date": item?.movement_date || "-",
                    "Origin": item?.source_location || "-",
                    "Destination": item.destination_location || "-",
                    "Remarks": item?.comments || "-",
                    "Status": item?.movement_status || "-" 
                }
            })
        },
        
        
    };

    

    const activeConfig = stockFlowTableConfigs[activeTab];


    return (
        <div className={`stockflow ${showModal ? "blurred" : ""}`}>
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
                <section className="flex flex-wrap w-full h-full  rounded-lg">
                    <div className="flex-1 border max-h-[800px] border-gray-300 rounded-lg scroll-container overflow-y-auto p-3">
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
                                            <tr key={index} className="border-b border-gray-300" onClick={() => setSelectedItem(filteredData[index])}>
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
                    <div className={`flex flex-col  rounded-lg min-h-full w-[230px] ml-4 p-1 ${activeTab !== "Warehouse" ? "hidden" : ""}`}>
                        <div className="flex flex-col justify-between space-y-2">
                            
                            {/* Warehouse Filter */}
                            
                            <select name="" id="" className="border rounded-lg border-gray-300 h-[30px] text-gray-600 cursor-pointer p-1" onChange={(e) => {
                                    setWarehouse(e.target.value);
                                    setSelectedItem(null);
                            }}>
                                <option value="" className="text-gray-600">Select Warehouse</option>
                                {warehouseList.map((warehouse) => (
                                    <option className="text-gray-600 cursor-pointer" key={warehouse.warehouse_location} value={warehouse.warehouse_location}>
                                        {warehouse.warehouse_location}
                                    </option>
                                ))}
                            </select>

                            {/* Expiry */}
                            <select name="" id="" className="border rounded-lg border-gray-300 h-[30px] text-gray-600 cursor-pointer p-1" onChange={(e) => {
                                    setExpiry(e.target.value);
                                    setSelectedItem(null);
                                    }
                                }>
                                <option value="" >Select Expiry</option>
                                {["Next 30 Days", "Next 6 Months", "Within this Year"].map((d) => (
                                        <option key={d} value={d}>{d}</option>
                                    ))}
                                
                            </select>

                            <button
                                onClick={toggleModal}
                                className="mt-4 bg-cyan-600 text-white px-3 py-1 rounded cursor-pointer"
                            >
                                Transfer Stock
                            </button>
                        </div>

                        {/* Selected Items and Item Deatils Label */}
                        <div className="mt-4">
                            <h3 className="text-center text-gray-600 mt-2"></h3>

                            {/* Selected Items Container */}
                            <div className="min-h-[300px] border rounded-lg border-gray-300 p-2">
                            {
                                selectedItem !== null ? (
                                    <>
                                        {[
                                            {label: "Selected Item", value: selectedItem?.item_name || "Unknown"},
                                            {label: "Item Type", value: selectedItem?.item_type},
                                            {label: "Item Management", value: selectedItem?.item_management + ": " + selectedItem?.item_management_id},
                                            {label: "Quantity", value: selectedItem?.current_quantity},
                                            {label: "Expiry", value: selectedItem?.expiry},
                                            {label: "Warehouse Location", value: selectedItem?.warehouse_location || "Unknown"}
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

            {showModal && (
                <InvRestockForm
                    onClose={() => {
                        toggleModal();
                        setSelectedItem(null);
                        // refreshInventory();
                    }}
                    selectedItem={warehouseItemsData[selectedItem]}
                    warehouseList={warehouseList}
                    
                 />
            )}


        </div>
    );
};

export default BodyContent;