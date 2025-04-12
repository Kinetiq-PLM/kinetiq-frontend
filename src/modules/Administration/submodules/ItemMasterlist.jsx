import React, { useState } from "react";
import "../styles/ItemMasterlist.css";

const units = ["kg", "sh", "bx", "L", "m", "gal", "pcs", "set", "mm", "unit"];
const manageOptions = ["None", "Serial Number", "Batches"];
const itemTypes = ["Assets", "Product", "Raw Materials"];

{/* Sample data for the table rows */}
const rows = [
    {
        unit: "kg",
        manageBy: "Serial Number",
        status: "Active",
        vendor: "Acme Inc",
        purchasing: "pcs",
        itemId: "Item001",
        assetId: "Asset001",
        productId: "Prod001",
        materialId: "Mat001",
        itemType: "Assets",
        itemName: "Screw",
        purchaseUnit: "Unit001",
        purchaseQty: "100",
        saleUom: "pcs",
        itemPerSaleUnit: "1",
        saleQtyPerPack: "10",
    },
    {
        unit: "L",
        manageBy: "Batches",
        status: "Inactive",
        vendor: "Beta Ltd",
        purchasing: "gal",
        itemId: "Item002",
        assetId: "Asset002",
        productId: "Prod002",
        materialId: "Mat002",
        itemType: "Product",
        itemName: "Glue",
        purchaseUnit: "Unit002",
        purchaseQty: "200",
        saleUom: "gal",
        itemPerSaleUnit: "2",
        saleQtyPerPack: "20",
    },
    {
        unit: "bx",
        manageBy: "None",
        status: "Pending",
        vendor: "Gamma Corp",
        purchasing: "set",
        itemId: "Item003",
        assetId: "Asset003",
        productId: "Prod003",
        materialId: "Mat003",
        itemType: "Raw Materials",
        itemName: "Wires",
        purchaseUnit: "Unit003",
        purchaseQty: "300",
        saleUom: "set",
        itemPerSaleUnit: "3",
        saleQtyPerPack: "30",
    },
    {
        unit: "pcs",
        manageBy: "Serial Number",
        status: "Active",
        vendor: "Delta Ltd",
        purchasing: "pcs",
        itemId: "Item004",
        assetId: "Asset004",
        productId: "Prod004",
        materialId: "Mat004",
        itemType: "Assets",
        itemName: "Washer",
        purchaseUnit: "Unit004",
        purchaseQty: "150",
        saleUom: "pcs",
        itemPerSaleUnit: "5",
        saleQtyPerPack: "50",
    },
    {
        unit: "sh",
        manageBy: "Batches",
        status: "Inactive",
        vendor: "Omega Inc",
        purchasing: "sh",
        itemId: "Item005",
        assetId: "Asset005",
        productId: "Prod005",
        materialId: "Mat005",
        itemType: "Product",
        itemName: "Oil",
        purchaseUnit: "Unit005",
        purchaseQty: "120",
        saleUom: "sh",
        itemPerSaleUnit: "2",
        saleQtyPerPack: "15",
    },
    {
        unit: "m",
        manageBy: "None",
        status: "Active",
        vendor: "Echo Supplies",
        purchasing: "m",
        itemId: "Item006",
        assetId: "Asset006",
        productId: "Prod006",
        materialId: "Mat006",
        itemType: "Raw Materials",
        itemName: "Cable",
        purchaseUnit: "Unit006",
        purchaseQty: "75",
        saleUom: "m",
        itemPerSaleUnit: "1",
        saleQtyPerPack: "25",
    },
    {
        unit: "unit",
        manageBy: "None",
        status: "Active",
        vendor: "Nova Tools",
        purchasing: "pcs",
        itemId: "Item007",
        assetId: "Asset007",
        productId: "Prod007",
        materialId: "Mat007",
        itemType: "Assets",
        itemName: "Drill",
        purchaseUnit: "Unit007",
        purchaseQty: "45",
        saleUom: "pcs",
        itemPerSaleUnit: "1",
        saleQtyPerPack: "10",
    }
];


const assetRows = [
    { assetId: "AST001", assetName: "Lathe", purchaseDate: "01/01/25", serialNo: "SN001", price: "5000", contentId: "C001" },
    { assetId: "AST002", assetName: "Compressor", purchaseDate: "02/05/25", serialNo: "SN002", price: "3500", contentId: "C002" },
    { assetId: "AST003", assetName: "CNC Machine", purchaseDate: "03/12/25", serialNo: "SN003", price: "12000", contentId: "C003" },
    { assetId: "AST004", assetName: "Welder", purchaseDate: "04/08/25", serialNo: "SN004", price: "2500", contentId: "C004" },
    { assetId: "AST005", assetName: "Forklift", purchaseDate: "05/06/25", serialNo: "SN005", price: "15000", contentId: "C005" },
    { assetId: "AST006", assetName: "Mixer", purchaseDate: "06/10/25", serialNo: "SN006", price: "4200", contentId: "C006" },
    { assetId: "AST007", assetName: "Pump", purchaseDate: "07/20/25", serialNo: "SN007", price: "1800", contentId: "C007" }
];


const productRows = [
    { productId: "PROD001", productName: "Sealant", description: "Waterproof bonding", price: "80", stockLevel: "120" },
    { productId: "PROD002", productName: "Primer", description: "Base coat", price: "55", stockLevel: "90" },
    { productId: "PROD003", productName: "Paint", description: "Latex white", price: "150", stockLevel: "60" },
    { productId: "PROD004", productName: "Thinner", description: "Solvent", price: "40", stockLevel: "100" },
    { productId: "PROD005", productName: "Hardener", description: "Epoxy mix", price: "65", stockLevel: "75" },
    { productId: "PROD006", productName: "Cleaner", description: "Surface prep", price: "30", stockLevel: "85" },
    { productId: "PROD007", productName: "Glue Gun", description: "Hot glue device", price: "150", stockLevel: "40" }
];


const rawMaterialRows = [
    { materialId: "MAT001", materialName: "Copper Wire", description: "High grade", unit: "kg", cost: "200", vendorCode: "V001" },
    { materialId: "MAT002", materialName: "Resin", description: "Clear finish", unit: "L", cost: "350", vendorCode: "V002" },
    { materialId: "MAT003", materialName: "Sawdust", description: "Fine", unit: "bx", cost: "50", vendorCode: "V003" },
    { materialId: "MAT004", materialName: "Granules", description: "Plastic base", unit: "sh", cost: "180", vendorCode: "V004" },
    { materialId: "MAT005", materialName: "Steel Rod", description: "Solid", unit: "m", cost: "400", vendorCode: "V005" },
    { materialId: "MAT006", materialName: "Nails", description: "Galvanized", unit: "pcs", cost: "10", vendorCode: "V006" },
    { materialId: "MAT007", materialName: "Cloth Tape", description: "Heat resistant", unit: "set", cost: "100", vendorCode: "V007" }
];


const ItemMasterList = () => {
    const [data, setData] = useState(rows);
    const [openMenuIndex, setOpenMenuIndex] = useState(null);
    const [activeTab, setActiveTab] = useState("Item Masterlist");

    const [modalVisible, setModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState(null);

    const handleChange = (index, key, value) => {
        const updated = [...data];
        updated[index][key] = value;
        setData(updated);
    };

    const toggleMenu = (index) => {
        setOpenMenuIndex(openMenuIndex === index ? null : index);
    };

    const openModal = (contentId) => {
        setModalContent(`goods receipt purchase order`);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setModalContent(null);
    };

    const handleDownload = () => {
        alert("Downloading content...");
    };

    const renderDropdown = (type) => {
        let fields = [];
        if (type === "Product") {
            fields = ["Product ID", "Product Name", "Description", "Selling Price", "Stock Level", "Warranty Period", "Policy ID", "Batch No.", "Content ID"];
        } else if (type === "Assets") {
            fields = ["Asset ID", "Asset Name", "Purchase Date", "Serial No.", "Purchase price", "Content ID"];
        } else if (type === "Raw Materials") {
            fields = ["Material ID", "Material Name", "Description", "Cost Per Unit", "Vendor code", "Unit Of Measure"];
        }

        return (
            <div className="absolute right-0 mt-2 bg-white shadow-lg border rounded p-4 z-10 w-96">
                <h3 className="font-semibold text-lg mb-2">{type}</h3>
                <div className="grid grid-cols-2 gap-3">
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
                    <button className="border border-teal-500 text-teal-600 px-4 py-1 rounded-md">Alter</button>
                    <button className="border border-teal-500 text-teal-600 px-4 py-1 rounded-md">Delete</button>
                    <button className="border border-gray-300 text-gray-600 px-4 py-1 rounded-md">Cancel</button>
                </div>
            </div>
        );
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Item Masterlist</h2>

            <div className="flex items-center gap-4 mb-4 border-b">
                {["Item Masterlist", "Assets", "Product", "Raw Materials"].map((tab, idx) => (
                    <button
                        key={idx}
                        onClick={() => setActiveTab(tab)}
                        className={`py-2 border-b-2 ${activeTab === tab ? "border-teal-500 text-teal-600 font-semibold" : "border-transparent text-gray-600"} px-3`}
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
                        {activeTab} <span>&#9662;</span>
                    </button>
                </div>
            </div>

            <div className="itemmasterlist-table-container">
                <div className="itemmasterlist-scroll-wrapper">
                    <table className="itemmasterlist-table">
                        <thead className="bg-gray-100">
                            {activeTab === "Item Masterlist" && (
                                <tr>{["Item ID", "Asset ID", "Product ID", "Material ID", "Item Type", "Item Name", "Unit Of Measure", "Manage Item By", "Item Status", "Preferred Vendor", "Purchasing Oum", "Item Per Purchase Unit", "Purchase Quantity Per Package", "Sales Oum", "Items Per Sale Unit", "Sales Quantity Per Package", ""].map((title, i) => (<th key={i} className="min-w-[150px] px-4 py-3 border border-gray-200 text-left">{title}</th>))}</tr>
                            )}
                            {activeTab === "Assets" && (
                                <tr>{["Asset ID", "Asset Name", "Purchase Date", "Serial No.", "Purchased Price", "Content ID", ""].map((col, i) => (<th key={i} className="px-4 py-3 border border-gray-200 text-left">{col}</th>))}</tr>
                            )}
                            {activeTab === "Product" && (
                                <tr>{["Product ID", "Product Name", "Description", "Selling Price", "Stock Level", ""].map((col, i) => (<th key={i} className="px-4 py-3 border border-gray-200 text-left">{col}</th>))}</tr>
                            )}
                            {activeTab === "Raw Materials" && (
                                <tr>{["Material ID", "Material Name", "Description", "Unit Of Measure", "Cost Per Unit", "Vendor Code", ""].map((col, i) => (<th key={i} className="px-4 py-3 border border-gray-200 text-left">{col}</th>))}</tr>
                            )}
                        </thead>

                        <tbody>
                            {activeTab === "Item Masterlist" && data.map((row, index) => (
                                <tr key={index} className="border border-gray-200 odd:bg-gray-50 hover:bg-gray-100">
                                    <td className="px-4 py-3 border border-gray-200"><input type="checkbox" className="mr-2" />{row.itemId}</td>
                                    <td className="px-4 py-3 border border-gray-200">{row.assetId}</td>
                                    <td className="px-4 py-3 border border-gray-200">{row.productId}</td>
                                    <td className="px-4 py-3 border border-gray-200">{row.materialId}</td>
                                    <td className="px-4 py-3 border border-gray-200">
                                        <select value={row.itemType} onChange={(e) => handleChange(index, "itemType", e.target.value)} className="w-full border px-2 py-1 rounded-md">
                                            <option value="">Item Type</option>
                                            {itemTypes.map((t) => (<option key={t} value={t}>{t}</option>))}
                                        </select>
                                    </td>
                                    <td className="px-4 py-3 border border-gray-200">{row.itemName}</td>
                                    <td className="px-4 py-3 border border-gray-200">
                                        <select value={row.unit} onChange={(e) => handleChange(index, "unit", e.target.value)} className="w-full border px-2 py-1 rounded-md">
                                            {units.map((u) => (<option key={u}>{u}</option>))}
                                        </select>
                                    </td>
                                    <td className="px-4 py-3 border border-gray-200">
                                        <select value={row.manageBy} onChange={(e) => handleChange(index, "manageBy", e.target.value)} className="w-full border px-2 py-1 rounded-md">
                                            {manageOptions.map((opt) => (<option key={opt}>{opt}</option>))}
                                        </select>
                                    </td>
                                    <td className="px-4 py-3 border border-gray-200">{row.status}</td>
                                    <td className="px-4 py-3 border border-gray-200">{row.vendor}</td>
                                    <td className="px-4 py-3 border border-gray-200">{row.purchasing}</td>
                                    <td className="px-4 py-3 border border-gray-200">{row.purchaseUnit}</td>
                                    <td className="px-4 py-3 border border-gray-200">{row.purchaseQty}</td>
                                    <td className="px-4 py-3 border border-gray-200">{row.saleUom}</td>
                                    <td className="px-4 py-3 border border-gray-200">{row.itemPerSaleUnit}</td>
                                    <td className="px-4 py-3 border border-gray-200">{row.saleQtyPerPack}</td>
                                    <td className="px-4 py-3 border border-gray-200 relative">
                                        <button onClick={() => toggleMenu(index)} className="text-xl hover:bg-gray-200 px-2 rounded">⋮</button>
                                        {openMenuIndex === index && renderDropdown("Product")}
                                    </td>
                                </tr>
                            ))}

                            {activeTab === "Assets" && assetRows.map((row, idx) => (
                                <tr key={idx} className="odd:bg-gray-50 hover:bg-gray-100">
                                    <td className="px-4 py-3 border border-gray-200"><input type="checkbox" className="mr-2" />{row.assetId}</td>
                                    <td className="px-4 py-3 border border-gray-200">{row.assetName}</td>
                                    <td className="px-4 py-3 border border-gray-200">{row.purchaseDate}</td>
                                    <td className="px-4 py-3 border border-gray-200">{row.serialNo}</td>
                                    <td className="px-4 py-3 border border-gray-200">{row.price}</td>
                                    <td className="px-4 py-3 border border-gray-200 text-teal-600 cursor-pointer underline" onClick={() => openModal(row.contentId)}>
                                        {row.contentId}
                                    </td>
                                    <td className="px-4 py-3 border border-gray-200 relative">
                                        <button onClick={() => toggleMenu(idx)} className="text-xl hover:bg-gray-200 px-2 rounded">⋮</button>
                                        {openMenuIndex === idx && renderDropdown("Assets")}
                                    </td>
                                </tr>
                            ))}

                            {/* Products and Raw Materials stay unchanged... */}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {modalVisible && (
                <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg w-[600px] h-[400px] relative p-8">
                        <button onClick={closeModal} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl">
                            &times;
                        </button>
                        <button
                            onClick={handleDownload}
                            className="absolute top-3 right-14 bg-white border px-3 py-1 rounded-md text-sm shadow hover:bg-gray-50"
                        >
                            Download <span className="ml-1">&#8681;</span>
                        </button>
                        <div className="h-full flex items-center justify-center text-lg text-gray-700">
                            {modalContent}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ItemMasterList;