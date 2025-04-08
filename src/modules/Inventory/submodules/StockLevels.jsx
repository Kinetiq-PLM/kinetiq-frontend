import React, { useEffect, useState } from "react";
import "../styles/PCounts.css";

const BodyContent = () => {
    const [productsData, setProductsData] = useState([]);
    const [assetsData, setAssetsData] = useState([]);
    const [rawMaterialsData, setRawMaterialsData] = useState([]);


    const [loading, setLoading] = useState(true);

    // State for selected status and date
    const [selectedStatus, setSelectedStatus] = useState("");
    const [selectedDate, setSelectedDate] = useState("");

    // State for selected row
    const [selectedRow, setSelectedRow] = useState(null); 

    // Tab Management
    const tabs = ["Products", "Assets", "Raw Materials"];
    const [activeTab, setActiveTab] = useState(tabs[0]);    
    const onTabChange = (tab) => {
        setActiveTab(tab);
        setSelectedRow(null); 
        setSelectedStatus("")
        setSelectedDate("")// Reset selected row when tab changes
    }

    

    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/product-depreciation-report/")
            .then((res) => res.json())
            .then((data) => {
                setProductsData(data);
                setLoading(false);
                console.log("Fetched products depreication reports:", data);
            })
            .catch((err) => {
                console.error("Error products depreication reports:", err);
                setLoading(false);
            });
    }, []);

    // assets fetching
    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/assets-depreciation-report/")
            .then((res) => res.json())
            .then((data) => {
                setAssetsData(data);
                setLoading(false);
                console.log("Fetched assets depreication reports:", data);
            })
            .catch((err) => {
                console.error("Error assets depreication reports:", err);
                setLoading(false);
            });
    }, []);


    // raw materials fetching
    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/raw-material-depreciation-report/")
            .then((res) => res.json())
            .then((data) => {
                setRawMaterialsData(data);
                setLoading(false);
                console.log("Fetched raw materials depreication reports:", data);
            })
            .catch((err) => {
                console.error("Error raw materials depreication reports:", err);
                setLoading(false);
            });
    }, []);


    // Filtered Tab Config
    const tableConfig = {
        Products: {
            columns: ["Product Name", "Inventory Item ID", "Expiry Date", "Quantity", "Status"],
            data: productsData.map((item) => ({
                "Product Name": item?.product_name || "---",
                "Inventory Item ID": item?.inventory_item_id || "---",
                "Expiry Date": item?.expiry,
                "Quantity": item?.quantity,
                "Status": item?.status,
            })),
        },

        Assets: {
            columns: ["Asset Name", "Inventory Item ID", "Expiry Date", "Quantity", "Status"],
            data: assetsData.map((item) => ({
                "Asset Name": item?.asset_name || "---",
                "Content ID": item?.inventory_item_id || "---",
                "Expiry Date": item?.expiry,
                "Quantity": item?.quantity,
                "Status": item?.status,
            })),
        },
        
        "Raw Materials": {
            columns: ["Material Name", "Inventory Item ID", "Expiry Date", "Quantity", "Status"],
            data: rawMaterialsData.map((item) => ({
                "Material Name": item?.material_name || "---",
                "Content ID": item?.inventory_item_id || "---",
                "Expiry Date": item?.expiry,
                "Quantity": item?.quantity,
                "Status": item?.status,
            })),
        },
    }

    // Current Config
    const currentConfig = tableConfig[activeTab];

    const currentData = currentConfig.data || [];
    console.log("Current Config:", currentConfig);

    
    const filterByDateRange = (data, range) => {
        const now = new Date(); // Get current date and time
    
        return data.filter((item) => {
            if (!item["Expiry Date"]) return false;
    
            const itemDate = new Date(item["Expiry Date"]); // Convert string to Date object
            if (isNaN(itemDate)) return false; // Skip invalid dates
    
            switch (range) {
                case "Next 30 Days":
                    return itemDate >= now && itemDate <= new Date(now.getFullYear(), now.getMonth(), now.getDate() + 30);
                
                case "Next 6 Months":
                    return itemDate >= now && itemDate <= new Date(now.getFullYear(), now.getMonth() + 6, now.getDate());
    
                case "Within This Year":
                    return itemDate.getFullYear() === now.getFullYear();
    
                default:
                    return true; // No filtering applied if range is not recognized
            }
        });
    };
    

    const filteredData = currentData.filter((item) => {
        const statusMatch = selectedStatus ? item["Status"]?.toLowerCase() === selectedStatus.toLowerCase() : true;
        console.log("Status Match:", statusMatch, "item status:", item.status, "selected status from filter:",selectedStatus);
        const dateMatch = selectedDate ? filterByDateRange([item], selectedDate).length > 0 : true;
        return statusMatch && dateMatch;
    });

    // current config
    console.log("Selected Row:", selectedRow);

    return (
        <div className="pcounts">
            <div className="body-content-container">

                {/* Flex container seperating nav and main content */}
                <div className="flex w-full h-full flex-col min-h-screen p-10">
                    
                    <nav className="md:flex md:flex-wrap justify-between items-center p-2">
                        <div className="invNav flex border-b border-gray-300 mt-1 space-x-8 mt-3 md:order-1">
                            {tabs.map((tab) => (
                            <span
                                key={tab}
                                className={`cursor-pointer text-lg font-semibold transition-colors ${
                                activeTab === tab
                                    ? "text-cyan-600 border-b-2 border-cyan-600"
                                    : "text-gray-500"
                                }`}
                                onClick={() => onTabChange(tab)}
                            >
                                {tab}
                            </span>
                            ))}
                        </div>
                    </nav>

                    {/* main content */}
                    <main className="flex w-full h-full space-x-4 py-2">

                        {/* Main Table */}
                        <div className="pcounts-table-container flex-2 border border-gray-300 rounded-lg scroll-container overflow-y-auto min-h-40 p-3">
                            <table className="w-full table-layout:fixed text-center cursor-pointer">
                                <thead>
                                    <tr className="border-b border-gray-300">
                                        {tableConfig[activeTab].columns.map((header) => (
                                            <th key={header} className="p-2 text-gray-600">{header}</th>
                                        ))}
                                    </tr>
                                </thead>


                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan="5" className="p-2 text-gray-400">Loading...</td></tr>
                                    ) : (                                               

                                        filteredData.map((item, index) => (
                                            <tr
                                                key={index}
                                                className="border-b border-gray-300 hover:bg-gray-100"
                                                onClick={() => setSelectedRow(item)} // ← Set selected row
                                            >
                                                {currentConfig.columns.map((col) => (
                                                    <td key={col} className="p-2">{item[col] || "---"}</td>
                                                ))}
                                                
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Filters + Details Panel */}
                        <div className="flex flex-col justify-between h-full">
                            <div className="self-center text-sm text-gray-500">00 - 00 - 0000 / 00:00 UTC</div>
                            
                            <div className="flex flex-col  space-y-4 mt-2 w-60">

                                {/* Status Filter */}
                                <select
                                    className="w-full border border-gray-300 rounded-lg p-2 text-gray-500 cursor-pointer"
                                    value={selectedStatus}
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                >
                                    <option value="">Filter Status Status</option>
                                    {["Pending", "Approved"].map((s) => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>

                                {/* Date Filter */}
                                <select
                                    className="w-full border border-gray-300 rounded-lg p-2 text-gray-500 cursor-pointer"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                >
                                    <option value="">Filter Deprecation Date</option>
                                    {["Next 30 Days", "Next 6 Months", "Within this Year"].map((d) => (
                                        <option key={d} value={d}>{d}</option>
                                    ))}
                                </select>

                            </div>



                            {/* Selected Item details Details */}
                            <div className="">
                                <p className="text-gray-600 font-bold text-center"> Item Details</p>
                                <div className="w-60 border border-gray-300 rounded-lg p-3 h-80">

                                    {selectedRow && (
                                        Object.keys(selectedRow).map((col) => (
                                            <div key={col} className="mb-2">
                                                <h4 className="text-cyan-600 text-sm font-semibold">{col}</h4>
                                                <p className="text-gray-500 text-sm">{selectedRow[col] || "---"}</p>
                                            </div>
                                        ))
                                    )}



                                </div>  
                            </div>
                            

                           
                        </div>

                    </main>


                </div>
                {/* End of First Container (Seperating nav and main content) */}
                
            </div>
        </div>
    );
};

export default BodyContent;
