import React, { useState } from "react";
import "../styles/ItemMasterlist.css";

const categories = ["Employee", "Vendor", "Customer"];

const bpRows = [
    {
        partnerId: "Maria",
        employeeId: "Clara",
        vendorCode: "Mari123",
        customerId: "Masikip",
        partnerName: "Sad",
        category: "Employee",
        contactInfo: "Qwdw",
    },
];

const vendorRowsInit = [
    {
        vendorCode: "OABC00WE",
        applicationRef: "Mari123",
        partnerId: "Vaccshouts Dept.",
        vendorName: "XYZ Materials",
        contactPerson: "956GUY",
        status: "Active",
    },
];

const BusinessPartnerMasterlist = () => {
    const [activeTab, setActiveTab] = useState("Business Partners Masterlist");
    const [bpData, setBpData] = useState(bpRows);
    const [vendorData, setVendorData] = useState(vendorRowsInit);
    const [openMenuIndex, setOpenMenuIndex] = useState(null);

    const toggleDropdown = (index) => {
        setOpenMenuIndex(openMenuIndex === index ? null : index);
    };

    const renderDropdown = (type) => {
        const fields =
            type === "Vendor"
                ? ["Vendor Code*", "Partner ID*", "Vendor Name", "Contact Person"]
                : [
                    "Partner ID",
                    "Employee ID",
                    "Vendor code",
                    "Customer ID",
                    "Partner Name",
                    "Contact Info",
                ];

        return (
            <div className="absolute right-0 mt-2 bg-white shadow-lg border rounded p-4 z-10 w-96">
                <h3 className="font-semibold text-lg mb-2">
                    {type === "Vendor" ? "Vendor Information" : "Business Partners Masterlist"}
                </h3>
                <div className="grid gap-3">
                    {fields.map((label, i) => (
                        <div key={i}>
                            <label className="text-sm text-gray-700 mb-1 block">{label}</label>
                            <input
                                type="text"
                                placeholder={`Please select ${label}`}
                                className="w-full border px-2 py-1 rounded-md"
                            />
                        </div>
                    ))}
                </div>
                <div className="flex justify-end gap-2 mt-4">
                    <button className="bg-teal-500 text-white px-4 py-1 rounded-md">Add</button>
                    <button className="border border-teal-500 text-teal-600 px-4 py-1 rounded-md">
                        {type === "Vendor" ? "Alter" : "Remove"}
                    </button>
                    <button className="border border-teal-500 text-teal-600 px-4 py-1 rounded-md">Delete</button>
                    <button className="border border-gray-300 text-gray-600 px-4 py-1 rounded-md">Cancel</button>
                </div>
            </div>
        );
    };

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Business Partner Masterlist</h2>

            <div className="flex items-center gap-4 mb-4 border-b">
                {["Business Partners Masterlist", "Vendor"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`py-2 border-b-2 ${activeTab === tab
                                ? "border-teal-500 text-teal-600 font-semibold"
                                : "border-transparent text-gray-600"
                            } px-3`}
                    >
                        {tab}
                    </button>
                ))}
                <div className="ml-auto flex items-center gap-2">
                    <input
                        type="text"
                        placeholder="Search"
                        className="border border-gray-300 px-3 py-2 rounded-md text-sm"
                    />
                    <button className="border border-gray-300 px-3 py-2 rounded-md text-sm flex items-center gap-1">
                        {activeTab === "Vendor" ? "Vendor Info" : "Customize"} <span>&#9662;</span>
                    </button>
                </div>
            </div>

            {/* TABLE CONTENTS */}
            <div className="itemmasterlist-table-container">
                <div className="itemmasterlist-scroll-wrapper">
                    <table className="itemmasterlist-table">
                        <thead className="bg-gray-100">
                            <tr>
                                {activeTab === "Vendor"
                                    ? ["Vendor Code", "Application Reference", "Vendor Name", "Contact Person", "Status", ""]
                                        .map((col, i) => (
                                            <th key={i} className="px-4 py-3 border border-gray-200 text-left">
                                                {col}
                                            </th>
                                        ))
                                    : ["Partner ID", "Employee ID", "Vendor Code", "Customer ID", "Partner Name", "Category", "Contact Info", ""]
                                        .map((header, idx) => (
                                            <th key={idx} className="px-4 py-3 border border-gray-200 text-left">
                                                {header}
                                            </th>
                                        ))}
                            </tr>
                        </thead>
                        <tbody>
                            {activeTab === "Vendor"
                                ? vendorData.map((row, idx) => (
                                    <tr key={idx} className="odd:bg-gray-50 hover:bg-gray-100 relative">
                                        <td className="px-4 py-3 border border-gray-200">
                                            <input type="checkbox" className="mr-2" />
                                            {row.vendorCode}
                                        </td>
                                        <td className="px-4 py-3 border border-gray-200">{row.applicationRef}</td>
                                        <td className="px-4 py-3 border border-gray-200">{row.vendorName}</td>
                                        <td className="px-4 py-3 border border-gray-200">{row.contactPerson}</td>
                                        <td className="px-4 py-3 border border-gray-200">
                                            <select
                                                value={row.status}
                                                onChange={(e) => {
                                                    const updated = [...vendorData];
                                                    updated[idx].status = e.target.value;
                                                    setVendorData(updated);
                                                }}
                                                className="w-full border px-2 py-1 rounded-md"
                                            >
                                                <option value="Active">Active</option>
                                                <option value="Inactive">Inactive</option>
                                            </select>
                                        </td>
                                        <td className="px-4 py-3 border border-gray-200 relative">
                                            <button
                                                onClick={() => toggleDropdown(idx)}
                                                className="text-xl hover:bg-gray-200 px-2 rounded"
                                            >
                                                ⋮
                                            </button>
                                            {openMenuIndex === idx && renderDropdown("Vendor")}
                                        </td>
                                    </tr>
                                ))
                                : bpData.map((row, idx) => (
                                    <tr key={idx} className="odd:bg-gray-50 hover:bg-gray-100 relative">
                                        <td className="px-4 py-3 border border-gray-200">
                                            <input type="checkbox" className="mr-2" />
                                            {row.partnerId}
                                        </td>
                                        <td className="px-4 py-3 border border-gray-200">{row.employeeId}</td>
                                        <td className="px-4 py-3 border border-gray-200">{row.vendorCode}</td>
                                        <td className="px-4 py-3 border border-gray-200">{row.customerId}</td>
                                        <td className="px-4 py-3 border border-gray-200">{row.partnerName}</td>
                                        <td className="px-4 py-3 border border-gray-200">
                                            <select
                                                value={row.category}
                                                onChange={(e) => {
                                                    const updated = [...bpData];
                                                    updated[idx].category = e.target.value;
                                                    setBpData(updated);
                                                }}
                                                className="w-full border px-2 py-1 rounded-md"
                                            >
                                                {categories.map((cat) => (
                                                    <option key={cat} value={cat}>
                                                        {cat}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-4 py-3 border border-gray-200">{row.contactInfo}</td>
                                        <td className="px-4 py-3 border border-gray-200 relative">
                                            <button
                                                onClick={() => toggleDropdown(idx)}
                                                className="text-xl hover:bg-gray-200 px-2 rounded"
                                            >
                                                ⋮
                                            </button>
                                            {openMenuIndex === idx && renderDropdown("BusinessPartner")}
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default BusinessPartnerMasterlist;
