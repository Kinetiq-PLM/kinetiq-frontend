import React from "react";
import "../styles/PCounts.css";

const BodyContent = () => {
    // Dummy data for 20 items
    const dummyData = Array.from({ length: 20 }, (_, i) => ({
        productName: `Product ${i + 1}`,
        pCount: Math.floor(Math.random() * 100),
        dateChecked: `2024-03-${String(i + 1).padStart(2, '0')}`,
        managerId: `MGR${1000 + i}`,
        status: i % 2 === 0 ? "Verified" : "Pending",
    }));

    return (
        <div className="pcounts">
            <div className="body-content-container">

                <div className="flex w-full h-full flex-col min-h-screen p-5">
                    <div className="flex w-full h-full space-x-4 py-7">

                        {/* Main Table */} 
                        {/* Table Container */}
                        <div className="pcounts-table-container flex-2 border border-gray-300 rounded-lg scroll-container overflow-y-auto min-h-40 p-3">
                            <table className="w-full table-layout:fixed text-center cursor-pointer">
                                <thead>
                                    <tr className="border-b border-gray-300">
                                        {['Product Name', 'P-Count', 'Date Checked', 'Manager ID', 'Status'].map((header) => (
                                            <th key={header} className="p-2 text-gray-600">{header}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {dummyData.map((item, index) => (
                                        <tr key={index} className="border-b border-gray-300">
                                            <td className="p-2">{item.productName}</td>
                                            <td className="p-2">{item.pCount}</td>
                                            <td className="p-2">{item.dateChecked}</td>
                                            <td className="p-2">{item.managerId}</td>
                                            <td className={`p-2 ${item.status === 'Verified' ? 'text-green-600' : 'text-yellow-600'}`}>{item.status}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                     
                        <div className="grid grid-rows-4 gap-3 justify-between h-full">
                            <div className="self-center text-sm text-gray-500">00 - 00 - 0000 / 00:00 UTC</div>

                            {/* Warehouse Filter */}
                            <select name="" id="" className="w-full border border-gray-300 rounded-lg p-2 text-gray-500 cursor-pointer">
                                <option>Select Warehouse</option>
                                {["Warehouse 1", "Warehouse 2", "Warehouse 3"].map((warehouse) => (
                                    <option key={warehouse}>{warehouse}</option>))}
                            </select>

                            {/* Status Filter */}
                            <select name="" id="" className="w-full border border-gray-300 rounded-lg p-2 text-gray-500 cursor-pointer" onFocus={``}>
                                <option>Select Status</option>
                                {["Verified", "In-review", "Unattended"].map((warehouse) => (
                                    <option key={warehouse}>{warehouse}</option>))}
                            </select>

                            {/* Date Filter */}
                            <select name="" id="" className="w-full border border-gray-300 rounded-lg p-2 text-gray-500 cursor-pointer">
                                <option>Select Date</option>
                                {["Last 24 Hours", "Last Week", "Last 30 Days", "Last 6 mSonths"].map((warehouse) => (
                                    <option key={warehouse}>{warehouse}</option>))}
                            </select>


                            {/* P-Count Details */}
                            <h3 className="text-gray-600 font-semibold">P-Count Details</h3>
                            <div className="w-60 border border-gray-300 rounded-lg p-3">
                                
                                {[
                                    'Selected Product',
                                    'Total Quantity Checked',
                                    'Manager in Supervision',
                                    'Date Checked'
                                ].map((label) => (
                                    <div key={label} className="mb-2">
                                        <h4 className="text-cyan-600 text-sm font-semibold">{label}</h4>
                                        <p className="text-gray-500 text-sm">Value</p>
                                    </div>
                                ))}
                            </div>

                            {/* Report Button */}
                            <button className="w-full bg-cyan-600 text-white rounded-lg p-2 hover:bg-cyan-700">
                                Report a Discrepancy
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default BodyContent;
