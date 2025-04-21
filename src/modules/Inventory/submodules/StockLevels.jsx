import React, { useEffect, useState } from "react";
import "../styles/StockLevels.css";

const BodyContent = () => {
    const [expiringItemsData, setExpiringItemsData] = useState([]);
    const [assetsData, setAssetsData] = useState([]);
    const [warehouseList, setWarehouseList] = useState([]);


    const [loading, setLoading] = useState(true);

    // State for selected status and date
    const [selectedStatus, setSelectedStatus] = useState("");
    const [selectedDate, setSelectedDate] = useState("");

    // State for selected row
    const [selectedRow, setSelectedRow] = useState(null); 

    // Tab Management
    const tabs = ["Expiring Items"];
    const [activeTab, setActiveTab] = useState(tabs[0]);    
    const onTabChange = (tab) => {
        setActiveTab(tab);
        setSelectedRow(null); 
        setSelectedStatus("")
        setSelectedDate("")// Reset selected row when tab changes
    }

    

    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/expiry-report/")
            .then((res) => res.json())
            .then((data) => {
                setExpiringItemsData(data);
                setLoading(false);
                console.log("Fetched Expiring Reports Data:", data);
            })
            .catch((err) => {
                console.error("Error Expiring Reports Data:", err);
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


    // warehouse list fetching
    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/warehouse-list/")
            .then((res) => res.json())
            .then((data) => {
                setWarehouseList(data);
                setLoading(false);
                console.log("Fetched rwarehouse list", data);
            })
            .catch((err) => {
                console.error("Error fetching warehouse list:", err);
                setLoading(false);
            });
    }, []);


    // Filtered Tab Config
    const tableConfig = {
        "Expiring Items": {
            columns: ["Item Name", "Item Type", "Item Management ID", "Expiry Date", "Quantity", "Status"],
            data: expiringItemsData.map((item) => ({
                "Item Name": item?.item_name || "---",
                "Item Type": item?.item_type || "---",
                "Item Management ID": item?.item_management_id || "---",
                "Expiry Date": item?.expiry,
                "Quantity": item?.current_quantity,
                "Status": item?.expiry_report_status,
            })),
        },

        "Deprecating Assets": {
            columns: ["Asset Name", "Serial No", "Valid Until", "Quantity", "Status"],
            data: assetsData.map((item) => ({
                "Asset Name": item?.asset_name || "---",
                "Serial No": item?.inventory_item_id || "---",
                "Valid Until": item?.expiry,
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


        // Format time for Philippine Time Zone (UTC+8)
        const formatPhilippineTime = (date) => {
            // Adjust for Philippine time (UTC+8)
            const philippineDate = new Date(Date.UTC(
              date.getUTCFullYear(),
              date.getUTCMonth(),
              date.getUTCDate(),
              date.getUTCHours() + 8,
              date.getUTCMinutes(),
              date.getUTCSeconds()
            ));
          
            const hours24 = philippineDate.getUTCHours();
            const hours12 = hours24 % 12 || 12; // Convert to 12-hour format
            const minutes = philippineDate.getUTCMinutes().toString().padStart(2, '0');
            const seconds = philippineDate.getUTCSeconds().toString().padStart(2, '0');
            const amPm = hours24 < 12 ? 'AM' : 'PM';
          
            const year = philippineDate.getUTCFullYear();
            const month = (philippineDate.getUTCMonth() + 1).toString().padStart(2, '0');
            const day = philippineDate.getUTCDate().toString().padStart(2, '0');
          
            return `${day}/${month}/${year}, ${hours12}:${minutes} ${amPm} PHT`;
          };
    const currentTime = new Date();

    // current config
    console.log("Selected Row:", selectedRow);

    return (
        <div className="stocklvl">
            <div className="body-content-container">

                {/* Flex container seperating nav and main content */}
                <div className="flex w-full  flex-col min-h-screen px-3 py-12">
                    
                    <nav className="md:flex md:flex-wrap justify-between items-center p-2">
                        <div className="invNav flex border-b border-gray-300 mt-1 space-x-8 md:order-1">
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
                        
                        <div className="text-sm text-gray-500 order-2">
                        {formatPhilippineTime(currentTime)}
                        </div>
                    </nav>
                    
                    {/* FILTER SECTION */}
                    <div className="flex h-8 space-x-3 mt-1">
                        <select className="border border-gray-300 rounded-md p-1 text-gray-500   cursor-pointer" value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                            <option value="">Filter Status</option>
                                {["Pending", "Approved"].map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                        </select>

                        <select  className="border border-gray-300 rounded-md p-1 text-gray-500 cursor-pointer" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}>
                            <option value="">Filter Period</option>
                                {["Next 30 Days", "Next 6 Months", "Within this Year"].map((d) => (
                                    <option key={d} value={d}>{d}</option>
                                ))}
                        </select>

                        <select  className="warehouse-filter border border-gray-300 rounded-md p-1 text-gray-500 cursor-pointer"> 
                            <option value="">Filter Warehouse</option>
                                {warehouseList.map((d) => (
                                    <option key={d} value={d}>{d.warehouse_location}</option>
                                ))}
                        </select>
                        {/* value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} */}


                    </div>

                    {/* main content */}
                    <main className="flex flex-row w-full h-full space-x-4 py-2">

                        {/* Main Table */}
                        <div className="pcounts-table-container flex-2 border border-gray-300 rounded-lg scroll-container overflow-y-auto min-h-40 w-full p-1">
                            <table className="w-full table-layout:fixed text-center cursor-pointer">
                                <thead>
                                    <tr className="border-b border-gray-300">
                                        {tableConfig[activeTab].columns.map((header) => (
                                            <th key={header} className=" p-2 text-gray-600">{header}</th>
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
                                                onClick={() => setSelectedRow(filteredData[index])} // ← Set selected row
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


                        {/* Selected Item details Details */}
                        <div className="">
                            
                            <div className="w-full min-w-[180px] border border-gray-300 rounded-lg p-3 flex-row flex-wrap justify-between">
                                <p className="text-center text-gray-600 font-bold mb-2">ITEM DETAILS</p>
                                {selectedRow && (
                                    Object.keys(selectedRow).map((col) => (
                                        <div key={col} className="mb-2">
                                            <h4 className="text-cyan-600 text-sm font-semibold">{col}</h4>
                                            <p className="text-gray-500 text-xs">{selectedRow[col] || "---"}</p>
                                        </div>
                                    ))
                                )}



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
