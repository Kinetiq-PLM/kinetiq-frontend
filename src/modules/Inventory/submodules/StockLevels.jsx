import React, { useEffect, useState } from "react";
import "../styles/PCounts.css";

const BodyContent = () => {
    const [pcounts, setPcounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedRow, setSelectedRow] = useState(null); 

    // Tab Management
    const tabs = ["Products", "Assets", "Raw Materials"];
    const [activeTab, setActiveTab] = useState(tabs[0]);    
    const onTabChange = (tab) => {
        setActiveTab(tab);
        setSelectedRow(null); // Reset selected row when tab changes
    }


    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/depreciation-report/")
            .then((res) => res.json())
            .then((data) => {
                setPcounts(data);
                setLoading(false);
                console.log("Fetched depreication reports:", data);
            })
            .catch((err) => {
                console.error("Error fetching cyclic counts:", err);
                setLoading(false);
            });
    }, []);

    const tabConfig = {
        "Raw Materials": "raw_material_id",
        "Assets": "asset_id",
        "Products": "productdocu_id",
    }
    console.log("Tab Config:", tabConfig[activeTab]);
    
   
    const fieldName = tabConfig[activeTab];
    console.log("Field to filter by:", fieldName)

    // Filter data based on selected Tab
    const filteredTabConfig = pcounts.filter((item) => item[fieldName] !== null);
    
    

    // const filterByDateRange = (data, range) => {
    //     const now = new Date();
    //     return data.filter((item) => {
    //         const period = item.time_period?.toLowerCase();
    //         if (!period) return false;

    //         switch (range) {
    //             case "Last 24 Hours": return period === "daily";
    //             case "Last Week": return period === "weekly";
    //             case "Last 30 Days": return period === "monthly";
    //             case "Last 6 Months": return period === "quarterly" || period === "biannually";
    //             default: return true;
    //         }
    //     });
    // };


    const filterByDateRange = (data, range) => {
        const now = new Date(); // Get current date and time
    
        return data.filter((item) => {
            if (!item.time_period) return false; // Skip if time_period is missing
    
            const itemDate = new Date(item.time_period); // Convert string to Date object
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
    

    const filteredData = filteredTabConfig.filter((item) => {
        const statusMatch = selectedStatus ? item.status?.toLowerCase() === selectedStatus.toLowerCase() : true;
        const dateMatch = selectedDate ? filterByDateRange([item], selectedDate).length > 0 : true;
        return statusMatch && dateMatch;
    });

    

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
                                        {['Product Name', 'Identification', 'Expiry Date', 'Quantity', 'Status'].map((header) => (
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
                                                <td className="p-2">{
                                                item.productdocu_id !== null ? item.productdocu_id : 
                                                item.raw_material_id != null ? item.raw_material_id : 
                                                item.asset_id != null ? item.asset_id : 
                                                "N/A"
                                                }</td>
                                                <td className="p-2">{item.item_actually_counted ?? "-"}</td>
                                                <td className="p-2">{item.expiry_date || "-"}</td>
                                                <td className="p-2">{item.employee || "Unassigned"}</td>
                                                <td className={`p-2 ${item.status === 'Approved' ? 'text-green-600' : 'text-yellow-800'}`}>
                                                    {item.status}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Filters + Details Panel */}
                        <div className="flex flex-col justify-between h-full">
                            <div className="self-center text-sm text-gray-500">00 - 00 - 0000 / 00:00 UTC</div>


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

                            {/* P-Count Details */}
                            <div>
                                <p className="text-gray-600 font-bold text-center"> Item Details</p>
                                <div className="w-60 border border-gray-300 rounded-lg p-3">
                                    {[
                                        { label: "Selected Item", value: selectedRow?.product_name || "N/A" },
                                        { label: "Identification", value: selectedRow?.item_actually_counted ?? "-" },
                                        { label: "Expiry Date", value: selectedRow?.employee || "Unassigned" },
                                        {label: "Quantity", value: selectedRow?.quantity || "-" },
                                        { label: "Status", value: selectedRow?.status || "-" },
                                        { label: "Reported Date", value: selectedRow?.time_period || "-" },
                                        
                                    ].map(({ label, value }) => (
                                        <div key={label} className="mb-2">
                                            <h4 className="text-cyan-600 text-sm font-semibold">{label}</h4>
                                            <p className="text-gray-500 text-sm">{value}</p>
                                        </div>
                                    ))}
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
