import React, { useState, useRef, useEffect } from "react";
import "../styles/ItemMasterlist.css";


const units = ["kg", "sh", "bx", "L", "m", "gal", "pcs", "set", "mm", "unit"];
const manageOptions = ["None", "Serial Number", "Batches"];
const itemTypes = ["Assets", "Product", "Raw Materials"];

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
    const [showAddDropdown, setShowAddDropdown] = useState(false);
    const AddDropdownRef = useRef(null);

    const [editTab, setEditTab] = useState(null);
    const [editDataIndex, setEditDataIndex] = useState(null);
    const [editDataValues, setEditDataValues] = useState({});

    const [editIndex, setEditIndex] = useState(null);
    const [editValues, setEditValues] = useState({ itemName: "", unit: "", purchasing: "" });

    const [showAssetAddForm, setShowAssetAddForm] = useState(false);
    const assetAddRef = useRef(null);


    const openDataEdit = (tab, index, rowData) => {
        setEditTab(tab);
        setEditDataIndex(index);
        setEditDataValues({ ...rowData });
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest(".dropdown-asset-raw")) {
                setOpenMenuIndex(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    
    const saveDataEdit = () => {
        if (editTab === "Assets") {
            const updated = [...assetRows];
            updated[editDataIndex] = editDataValues;
            setAssetRows(updated);
        } else if (editTab === "Product") {
            const updated = [...productRows];
            updated[editDataIndex] = editDataValues;
            setProductRows(updated);
        } else if (editTab === "Raw Materials") {
            const updated = [...rawMaterialRows];
            updated[editDataIndex] = editDataValues;
            setRawMaterialRows(updated);
        }
        setEditTab(null);
        setEditDataIndex(null);
        setEditDataValues({});
    };

    const openEditForm = (index) => {
        const item = data[index];
        setEditValues({
            itemName: item.itemName,
            unit: item.unit,
            purchasing: item.purchasing
        });
        setEditIndex(index);
    };

    const handleEditChange = (field, value) => {
        setEditValues({ ...editValues, [field]: value });
    };

    const saveEdit = () => {
        const updated = [...data];
        updated[editIndex] = {
            ...updated[editIndex],
            ...editValues
        };
        setData(updated);
        setEditIndex(null);
    };

    const toggleMenu = (index) => {
        setOpenMenuIndex(openMenuIndex === index ? null : index);
    };

    const handleChange = (index, key, value) => {
        const updated = [...data];
        updated[index][key] = value;
        setData(updated);
    };

    useEffect(() => {
    const handleClickOutside = (event) => {
        if (formDropdownRef.current && !formDropdownRef.current.contains(event.target)) {
        setShowAddDropdown(false);
        }
    };
    

    if (showAddDropdown) {
        document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
    }, [showAddDropdown]);


    const renderDropdown = (type) => {
        if (type === "Assets") {
            return (
                <div className="dropdown-asset-raw absolute top-full right-0 mt-2 bg-white shadow-xl border rounded-lg p-6 z-50 w-[460px] max-h-[90vh] overflow-y-auto">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Assets</h3>
                    <div className="flex flex-col gap-4">
                        {[
                            { label: "Asset ID*", placeholder: "Please enter document name" },
                            { label: "Asset Name", placeholder: "Please select category" },
                            { label: "Purchase Date", placeholder: "Please select category" },
                            { label: "Serial No.", placeholder: "Please select category" },
                            { label: "Purchase price", placeholder: "Please select category" },
                            { label: "Content ID", placeholder: "Please select category" }
                        ].map((field, index) => (
                            <div key={index}>
                                <label className="block text-sm font-semibold text-teal-700 mb-1">{field.label}</label>
                                <input
                                    type="text"
                                    placeholder={field.placeholder}
                                    className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                                />
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <button className="bg-teal-500 text-white px-6 py-2 rounded-md text-sm">Add</button>
                        <button className="border border-teal-500 text-teal-600 px-6 py-2 rounded-md text-sm">Edit</button>
                        <button className="border border-gray-400 text-gray-700 px-6 py-2 rounded-md text-sm">Archive</button>
                    </div>
                </div>
            );
        }

        if (type === "Raw Materials") {
            return (
                <div className="dropdown-asset-raw absolute top-full right-0 mt-2 bg-white shadow-xl border rounded-lg p-6 z-50 w-[460px] max-h-[90vh] overflow-y-auto">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Raw Materials</h3>
                    <div className="flex flex-col gap-4">
                        {[
                            { label: "Material ID*", placeholder: "Item ID" },
                            { label: "Material Name", placeholder: "Please select Material Name" },
                            { label: "Description", placeholder: "Please select Description" },
                            { label: "Unit Of Measure", isSelect: true },
                            { label: "Cost Per Unit", placeholder: "Please select Cost per Unit" },
                            { label: "Vendor code", placeholder: "Please select Unit Of measure" }
                        ].map((field, index) => (
                            <div key={index}>
                                <label className="block text-sm font-semibold text-teal-700 mb-1">{field.label}</label>
                                {field.isSelect ? (
                                    <select className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm text-gray-600 focus:outline-none">
                                        <option value="">unit of measure</option>
                                        {units.map((unit, i) => (
                                            <option key={i} value={unit}>{unit}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        type="text"
                                        placeholder={field.placeholder}
                                        className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <button className="bg-teal-500 text-white px-6 py-2 rounded-md text-sm">Add</button>
                        <button className="border border-teal-500 text-teal-600 px-6 py-2 rounded-md text-sm">Edit</button>
                        <button className="border border-gray-400 text-gray-700 px-6 py-2 rounded-md text-sm">Archive</button>
                    </div>
                </div>
            );
        }

        if (type === "Product"){
            return (
                <div className="dropdown-asset-raw absolute top-full right-0 mt-2 bg-white shadow-xl border rounded-lg p-6 z-50 w-[460px] max-h-[90vh] overflow-y-auto">
                    <h3 className="text-xl font-semibold text-teal-600 mb-4 border-b pb-2">Product</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            "Item Id", "Asset Id", "Product Id", "Material Id", "Item Type", "Item Name",
                            "Unit of Measure", "Manage Item", "Sales quantity per package",
                            "Item Status", "Preferred Vendor", "Item per purchase unit",
                            "Purchasing Oum", "purchase quantity per package", "Sale Oum", "items per sale unit"
                        ].map((label, i) => (
                            <div key={i}>
                                <label className="block text-sm font-semibold text-teal-600 mb-1">{label}</label>
                                {["Item Type", "Unit of Measure", "Manage Item", "Purchasing Oum", "Sale Oum"].includes(label) ? (
                                    <select className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm">
                                        <option>Select {label}</option>
                                        {units.map(u => <option key={u}>{u}</option>)}
                                    </select>
                                ) : (
                                    <input
                                        type="text"
                                        placeholder="Enter Description"
                                        className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-end mt-6 gap-3">
                        <button className="bg-teal-500 text-white px-6 py-2 rounded-md">Add</button>
                        <button className="border border-teal-500 text-teal-600 px-6 py-2 rounded-md">Edit</button>
                        <button className="border border-gray-400 text-gray-700 px-6 py-2 rounded-md">Archive</button>
                    </div>
                </div>)
        }
        return null;
    };

    const renderAddDropdownContent = () => {
        const tabToType = {
            "Item Masterlist": "Product",
            "Assets": "Assets",
            "Product": "Product",
            "Raw Materials": "Raw Materials",
        };

        const type = tabToType[activeTab];

        if (type === "Assets") {
            return (
                <div className="dropdown-asset-raw absolute top-full right-0 mt-2 bg-white shadow-xl border rounded-lg p-6 z-50 w-[460px] max-h-[90vh] overflow-y-auto">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Assets</h3>
                    <div className="flex flex-col gap-4">
                        {[
                            { label: "Asset ID*", placeholder: "Please enter document name" },
                            { label: "Asset Name", placeholder: "Please select category" },
                            { label: "Purchase Date", placeholder: "Please select category" },
                            { label: "Serial No.", placeholder: "Please select category" },
                            { label: "Purchase price", placeholder: "Please select category" },
                            { label: "Content ID", placeholder: "Please select category" }
                        ].map((field, index) => (
                            <div key={index}>
                                <label className="block text-sm font-semibold text-teal-700 mb-1">{field.label}</label>
                                <input
                                    type="text"
                                    placeholder={field.placeholder}
                                    className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                                />
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <button className="bg-teal-500 text-white px-6 py-2 rounded-md text-sm">Add</button>
                        <button className="border border-teal-500 text-teal-600 px-6 py-2 rounded-md text-sm">Edit</button>
                        <button className="border border-gray-400 text-gray-700 px-6 py-2 rounded-md text-sm">Archive</button>
                    </div>
                </div>
            );
        }

        if (type === "Raw Materials") {
            return (
                <div className="dropdown-asset-raw absolute top-full right-0 mt-2 bg-white shadow-xl border rounded-lg p-6 z-50 w-[460px] max-h-[90vh] overflow-y-auto">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Raw Materials</h3>
                    <div className="flex flex-col gap-4">
                        {[
                            { label: "Material ID*", placeholder: "Item ID" },
                            { label: "Material Name", placeholder: "Please select Material Name" },
                            { label: "Description", placeholder: "Please select Description" },
                            { label: "Unit Of Measure", isSelect: true },
                            { label: "Cost Per Unit", placeholder: "Please select Cost per Unit" },
                            { label: "Vendor code", placeholder: "Please select Unit Of measure" }
                        ].map((field, index) => (
                            <div key={index}>
                                <label className="block text-sm font-semibold text-teal-700 mb-1">{field.label}</label>
                                {field.isSelect ? (
                                    <select className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm text-gray-600 focus:outline-none">
                                        <option value="">unit of measure</option>
                                        {units.map((unit, i) => (
                                            <option key={i} value={unit}>{unit}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        type="text"
                                        placeholder={field.placeholder}
                                        className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <button className="bg-teal-500 text-white px-6 py-2 rounded-md text-sm">Add</button>
                        <button className="border border-teal-500 text-teal-600 px-6 py-2 rounded-md text-sm">Edit</button>
                        <button className="border border-gray-400 text-gray-700 px-6 py-2 rounded-md text-sm">Archive</button>
                    </div>
                </div>
            );
        }

        if (type === "Product") {
            return (
                <div className="dropdown-asset-raw absolute top-full right-0 mt-2 bg-white shadow-xl border rounded-lg p-6 z-50 w-[700px] max-h-[90vh] overflow-y-auto">
                    <h3 className="text-xl font-semibold text-teal-600 mb-4 border-b pb-2">Product</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            "Item Id", "Asset Id", "Product Id", "Material Id", "Item Type", "Item Name",
                            "Unit of Measure", "Manage Item", "Sales quantity per package",
                            "Item Status", "Preferred Vendor", "Item per purchase unit",
                            "Purchasing Oum", "purchase quantity per package", "Sale Oum", "items per sale unit"
                        ].map((label, i) => (
                            <div key={i}>
                                <label className="block text-sm font-semibold text-teal-600 mb-1">{label}</label>
                                {["Item Type", "Unit of Measure", "Manage Item", "Purchasing Oum", "Sale Oum"].includes(label) ? (
                                    <select className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm">
                                        <option>Select {label}</option>
                                        {units.map(u => <option key={u}>{u}</option>)}
                                    </select>
                                ) : (
                                    <input
                                        type="text"
                                        placeholder="Enter Description"
                                        className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-end mt-6 gap-3">
                        <button className="bg-teal-500 text-white px-6 py-2 rounded-md">Add</button>
                        <button className="border border-teal-500 text-teal-600 px-6 py-2 rounded-md">Edit</button>
                        <button className="border border-gray-400 text-gray-700 px-6 py-2 rounded-md">Archive</button>
                    </div>
                </div>
            );
        }

        return null;
    };


    const renderTable = () => {
        if (activeTab === "Item Masterlist") {
            return rows;
        } else if (activeTab === "Assets") {
            return assetRows;
        } else if (activeTab === "Product") {
            return productRows;
        } else if (activeTab === "Raw Materials") {
            return rawMaterialRows;
        }
        return [];
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Item Masterlist</h2>

            <div className="flex items-center gap-4 mb-4 border-b">
                {[
                    "Item Masterlist",
                    "Assets",
                    "Product",
                    "Raw Materials"
                ].map((tab, idx) => (
                    <button
                        key={idx}
                        onClick={() => setActiveTab(tab)}
                        className={`py-2 border-b-2 ${activeTab === tab
                                ? "border-teal-500 text-teal-600 font-semibold"
                                : "border-transparent text-gray-600"
                            } px-3`}
                    >
                        {tab}
                    </button>
                ))}
                <div className="ml-auto flex items-center gap-2 relative">
                    <input
                        type="text"
                        placeholder="Search"
                        className="border border-gray-300 px-3 py-2 rounded-md text-sm"
                    />
                    <div className="relative">
                        <button
                            onClick={() => setShowAddDropdown(prev => !prev)}
                            className="bg-teal-500 text-white px-4 py-2 rounded-md text-sm"
                        >
                            Add
                        </button>
                        {showAddDropdown && renderAddDropdownContent()}
                    </div>
                </div>
            </div>

            <div className="itemmasterlist-table-container">
                {/* Table rendering is unchanged; your full table logic goes here */}
                <div className="itemmasterlist-scroll-wrapper" style={{ overflowX: 'auto', maxWidth: '1800px' }}>
                    <table className="itemmasterlist-table" style={{ minWidth: '2000px' }}>
                        <thead className="bg-gray-100">
                            <tr>
                                {/* Conditionally render headers based on tab */}
                                {activeTab === "Item Masterlist" && [
                                    "Item ID", "Asset ID", "Product ID", "Material ID", "Item Type", "Item Name",
                                    "Unit Of Measure", "Manage Item By", "Item Status", "Preferred Vendor",
                                    "Purchasing Oum", "Item Per Purchase Unit", "Purchase Quantity Per Package",
                                    "Sales Oum", "Items Per Sale Unit", "Sales Quantity Per Package", ""
                                ].map((col, i) => <th key={i} className="min-w-[150px] px-4 py-3 border border-gray-200 text-left">{col}</th>)}

                                {activeTab === "Assets" && [
                                    "Asset ID", "Asset Name", "Purchase Date", "Serial No.", "Purchased Price", "Content ID", ""
                                ].map((col, i) => <th key={i} className="min-w-[150px] px-4 py-3 border border-gray-200 text-left">{col}</th>)}

                                {activeTab === "Product" && [
                                    "Product ID", "Product Name", "Description", "Selling Price", "Stock Level", ""
                                ].map((col, i) => <th key={i} className="min-w-[150px] px-4 py-3 border border-gray-200 text-left">{col}</th>)}

                                {activeTab === "Raw Materials" && [
                                    "Material ID", "Material Name", "Description", "Unit Of Measure", "Cost Per Unit", "Vendor Code", ""
                                ].map((col, i) => <th key={i} className="min-w-[150px] px-4 py-3 border border-gray-200 text-left">{col}</th>)}
                            </tr>
                        </thead>

                        <tbody>
                            {activeTab === "Item Masterlist" && data.map((row, index) => (
                                <tr key={index} className="border border-gray-200 odd:bg-gray-50 hover:bg-gray-100">
                                    <td className="px-4 py-3 border border-gray-200">{row.itemId}</td>
                                    <td className="px-4 py-3 border border-gray-200">{row.assetId}</td>
                                    <td className="px-4 py-3 border border-gray-200">{row.productId}</td>
                                    <td className="px-4 py-3 border border-gray-200">{row.materialId}</td>
                                    <td className="px-4 py-3 border border-gray-200">{row.itemType}</td>
                                    <td className="px-4 py-3 border border-gray-200">{row.itemName}</td>
                                    <td className="px-4 py-3 border border-gray-200">{row.unit}</td>
                                    <td className="px-4 py-3 border border-gray-200">{row.manageBy}</td>
                                    <td className="px-4 py-3 border border-gray-200">{row.status}</td>
                                    <td className="px-4 py-3 border border-gray-200">{row.vendor}</td>
                                    <td className="px-4 py-3 border border-gray-200">{row.purchasing}</td>
                                    <td className="px-4 py-3 border border-gray-200">{row.purchaseUnit}</td>
                                    <td className="px-4 py-3 border border-gray-200">{row.purchaseQty}</td>
                                    <td className="px-4 py-3 border border-gray-200">{row.saleUom}</td>
                                    <td className="px-4 py-3 border border-gray-200">{row.itemPerSaleUnit}</td>
                                    <td className="px-4 py-3 border border-gray-200">{row.saleQtyPerPack}</td>
                                        <td className="px-4 py-3 border border-gray-200 relative text-right">
                                        <button onClick={() => setShowAddDropdown(prev => !prev)} className="text-xl hover:bg-gray-200 px-2 rounded">⋮</button>
                                    </td>
                                </tr>
                            ))}

                            {activeTab === "Assets" && assetRows.map((row, idx) => (
                                <tr key={idx} className="odd:bg-gray-50 hover:bg-gray-100">
                                    <td className="px-4 py-3 border border-gray-200">{row.assetId}</td>
                                    <td className="px-4 py-3 border border-gray-200">{row.assetName}</td>
                                    <td className="px-4 py-3 border border-gray-200">{row.purchaseDate}</td>
                                    <td className="px-4 py-3 border border-gray-200">{row.serialNo}</td>
                                    <td className="px-4 py-3 border border-gray-200">{row.price}</td>
                                    <td className="px-4 py-3 border border-gray-200 text-teal-600 cursor-pointer underline" onClick={() => openModal(row.contentId)}>
                                        {row.contentId}
                                    </td>
                                    <td className="px-4 py-3 border border-gray-200 relative">
                                        <button
                                            onClick={() => {
                                                openDataEdit("Assets", idx, row);
                                                setOpenMenuIndex(idx);
                                            }}
                                            className="text-xl hover:bg-gray-200 px-2 rounded"
                                        >
                                            ⋮
                                        </button>
                                        {openMenuIndex === idx && renderDropdown("Assets")}
                                    </td>
                                </tr>   
                            ))}

                            {/* Product Table */}
                            {activeTab === "Product" &&
                                productRows.map((row, idx) => (
                                    <tr key={idx} className="odd:bg-gray-50 hover:bg-gray-100">
                                        <td className="px-4 py-3 border border-gray-200">{row.productId}</td>
                                        <td className="px-4 py-3 border border-gray-200">{row.productName}</td>
                                        <td className="px-4 py-3 border border-gray-200">{row.description}</td>
                                        <td className="px-4 py-3 border border-gray-200">{row.price}</td>
                                        <td className="px-4 py-3 border border-gray-200">{row.stockLevel}</td>
                                        <td className="px-4 py-3 border border-gray-200 relative">
                                            <button
                                                onClick={() => {
                                                    openDataEdit("Product", idx, row);
                                                    setOpenMenuIndex(idx); 
                                                }}
                                                className="text-xl hover:bg-gray-200 px-2 rounded"
                                            >
                                                ⋮
                                            </button>
                                            {openMenuIndex === idx && renderDropdown("Product")}
                                        </td>
                                    </tr>
                                ))}

                            {/* Raw Materials Table */}
                            {activeTab === "Raw Materials" &&
                                rawMaterialRows.map((row, idx) => (
                                    <tr key={idx} className="odd:bg-gray-50 hover:bg-gray-100">
                                        <td className="px-4 py-3 border border-gray-200">{row.materialId}</td>
                                        <td className="px-4 py-3 border border-gray-200">{row.materialName}</td>
                                        <td className="px-4 py-3 border border-gray-200">{row.description}</td>
                                        <td className="px-4 py-3 border border-gray-200">{row.unit}</td>
                                        <td className="px-4 py-3 border border-gray-200">{row.cost}</td>
                                        <td className="px-4 py-3 border border-gray-200">{row.vendorCode}</td>
                                        <td className="px-4 py-3 border border-gray-200 relative">
                                            <button
                                                onClick={() => {
                                                    openDataEdit("Raw Materials", idx, row);
                                                    setOpenMenuIndex(idx); 
                                                }}
                                                className="text-xl hover:bg-gray-200 px-2 rounded"
                                            >
                                                ⋮
                                            </button>
                                            {openMenuIndex === idx && renderDropdown("Raw Materials")}
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

export default ItemMasterList;
