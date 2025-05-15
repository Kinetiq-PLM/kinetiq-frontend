import React, { useEffect, useState } from "react";
import "../styles/InvShelfLife.css";

const BodyContent = () => {
    const [expiringItemsData, setExpiringItemsData] = useState([]);
    const [assetsData, setAssetsData] = useState([]);
    const [warehouseList, setWarehouseList] = useState([]);


    const [loading, setLoading] = useState(true);

    // State for selected status and date
    const [selectedStatus, setSelectedStatus] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedWarehouse, setSelectedWarehouse] = useState("");

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


    // Local: http://127.0.0.1:8000/
    // AWS: https://65umlgnumg.execute-api.ap-southeast-1.amazonaws.com/dev

    useEffect(() => {
        fetch("https://65umlgnumg.execute-api.ap-southeast-1.amazonaws.com/dev/api/expiry-report/")
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
        fetch("https://65umlgnumg.execute-api.ap-southeast-1.amazonaws.com/dev/api/assets-depreciation-report/")
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
        fetch("https://65umlgnumg.execute-api.ap-southeast-1.amazonaws.com/dev/api/warehouse-list/")
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
            columns: ["Item Name", "Item Type", "Item No", "Expiry Date", "Quantity", "Status", "Warehouse"],
            data: expiringItemsData.map((item) => ({
                "Item Name": item?.item_name || "---",
                "Item Type": item?.item_type || "---",
                "Item No": item?.item_no || "---",
                "Expiry Date": item?.expiry.split("T")[0] || "---",
                "Quantity": item?.current_quantity,
                "Status": item?.expiry_report_status,
                "Warehouse": item?.warehouse_location || "---",
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
        console.log("Status Match:", statusMatch, "item status:", item.status, "selected status from filter:", selectedStatus);
        const dateMatch = selectedDate ? filterByDateRange([item], selectedDate).length > 0 : true;
        const warehouseMatch = selectedWarehouse ? item["Warehouse"]?.toLowerCase() === selectedWarehouse.toLowerCase() : true;
        return statusMatch && dateMatch && warehouseMatch;
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
        <div className="selflife">
            <div className="body-content-container">

                {/* Flex container seperating nav and main content */}
                <div className="flex-col flex-wrap w-full min-h-screen space-y-2 px-3 py-[5rem]">
                
                {/* Header Section */}
                <div className=" w-full max-h-[80px] flex justify-between items-start gap-5">
                    <div className=" w-full max-h-[80px] flex justify-between items-start gap-5">
                        <div className="flex-col w-full">
                        <h2 className="text-cyan-600 text-3xl font-semibold">INVENTORY: SHELF LIFE</h2>
                        <p className="text-base font-semibold mt-1">Selected Warehouse: <span className="font-normal">{selectedWarehouse}</span></p>
                    </div>

                        <div className="w-">

                            {/* Select Warehouse & Transfer Form Parent Box */}

                            <label htmlFor="warehouse-select" className="block text-sm font-medium text-gray-700 mb-1">Filter by Warehouse</label>
                            <select className="w-full md:w-[300px] border border-gray-300 rounded-md p-1 text-gray-500 h-8 text-sm cursor-pointer" value={selectedWarehouse} onChange={(e) => setSelectedWarehouse(e.target.value)}>
                                <option value="">All Warehouses</option>
                                {warehouseList.map((d) => (
                                    <option key={d} value={d.warehouse_location}>{d.warehouse_location}</option>
                                ))}
                            </select>

                        
                        </div>
                    </div>
                </div>
                
                    {/* NAVIGATION SECTION */}
                    {/* <nav className="md:flex flex-1 justify-between items-center p-2">

                        

                        <div className="invNav flex border-b border-gray-300 mt-1 space-x-8 md:order-1">
                            {tabs.map((tab) => (
                                <span
                                    key={tab}
                                    className={`cursor-pointer text-lg font-semibold transition-colors ${activeTab === tab
                                        ? "text-cyan-600 border-b-2 border-cyan-600"
                                        : "text-gray-500"
                                        }`}
                                    onClick={() => onTabChange(tab)}
                                >
                                    {tab}
                                </span>
                            ))}
                        </div>


                    </nav> */}

                    {/* FILTER SECTION */}
                    <div className="flex flex-wrap justify-between md:max-h-8 space-x-3 space-y-3 mt-5 mb-1 p-1">
                        <div className="flex flex-wrap md:max-h-8 space-x-3 space-y-3">
                            <select className="w-full md:w-[130px] border border-gray-300 rounded-md p-1 text-gray-500 h-8 text-sm cursor-pointer" value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                                <option value="">Filter Status</option>
                                {["Pending", "Approved"].map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>

                            <select className="w-full md:w-[230px] border border-gray-300 rounded-md p-1 text-gray-500 h-8 text-sm cursor-pointer" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}>
                                <option value="">Filter Period</option>
                                {["Next 30 Days", "Next 6 Months", "Within this Year"].map((d) => (
                                    <option key={d} value={d}>{d}</option>
                                ))}
                            </select>                            
                        </div>



                        <div className="text-sm text-gray-500 md:order-2">
                            {formatPhilippineTime(currentTime)}
                        </div>


                    </div>

                    {/* main content */}
                    <main className="flex w-full space-x-4 py-2">

                        {/* Main Table */}
                        <div className="expiry-table-container flex-2 border border-gray-300 rounded-lg scroll-container overflow-y-auto min-h-30 w-full p-1">
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
                        {/* <div className="">
                            
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
                        </div> */}

                    </main>


                </div>
                {/* End of First Container (Seperating nav and main content) */}

            </div>
        </div>
    );
};

export default BodyContent;
