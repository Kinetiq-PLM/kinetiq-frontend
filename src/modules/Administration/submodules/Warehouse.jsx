import React, { useState } from "react";
import "../styles/Warehouse.css";

const initialWarehouses = [
    { warehouseId: "Maria", location: "Mari123", materials: "Qwdw" },
    { warehouseId: "Maria", location: "Mari123", materials: "Qwdw" },
    { warehouseId: "Maria", location: "Mari123", materials: "Qwdw" },
];

const Warehouse = () => {
    const [warehouses, setWarehouses] = useState(initialWarehouses);
    const [showForm, setShowForm] = useState(false);
    const [previewIndex, setPreviewIndex] = useState(null);

    const handleTogglePreview = (index) => {
        setPreviewIndex(previewIndex === index ? null : index);
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Warehouse</h2>

            {/* Toolbar */}
            <div className="flex items-center gap-4 mb-4 border-b pb-2">
                <input
                    type="text"
                    placeholder="Search..."
                    className="border border-gray-300 px-3 py-2 rounded-md text-sm"
                />
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-teal-500 text-white px-4 py-2 rounded-md text-sm"
                >
                    Add
                </button>
                <select className="border border-gray-300 px-3 py-2 rounded-md text-sm">
                    <option>Vendor Info</option>
                    <option>Warehouse Type</option>
                </select>
            </div>

            {/* Table */}
            <div className="bg-white shadow-md rounded-xl p-4 overflow-x-auto">
                <table className="w-full border-collapse border border-gray-200 rounded-xl">
                    <thead>
                        <tr className="bg-gray-100">
                            {["Warehouse ID", "Warehouse Location", "Stored Materials", ""].map((header, i) => (
                                <th key={i} className="px-4 py-3 border border-gray-200 text-left">{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {warehouses.map((w, index) => (
                            <tr key={index} className="border border-gray-200 odd:bg-gray-50 hover:bg-gray-100">
                                <td className="px-4 py-3 border border-gray-200">{w.warehouseId}</td>
                                <td className="px-4 py-3 border border-gray-200">{w.location}</td>
                                <td className="px-4 py-3 border border-gray-200">{w.materials}</td>
                                <td className="px-4 py-3 border border-gray-200 text-right">
                                    <button
                                        onClick={() => handleTogglePreview(index)}
                                        className="text-sm text-teal-600 underline hover:text-teal-800"
                                    >
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add/Edit Modal */}
            {showForm && (
                <div className="fixed inset-0 backdrop-blur-sm bg-white/10 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 shadow-xl w-[450px]">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold text-gray-800">Warehouse</h3>
                            <button
                                onClick={() => setShowForm(false)}
                                className="text-gray-500 hover:text-gray-700 text-lg"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-4">
                            {[
                                { label: "Warehouse ID*", placeholder: "OABC00WE" },
                                { label: "Warehouse Location", placeholder: "Vaccshauts Dept." },
                                { label: "Stored Materials", placeholder: "XYZ Materials" }
                            ].map((field, i) => (
                                <div key={i}>
                                    <label className="block text-sm text-teal-700 mb-1">{field.label}</label>
                                    <input
                                        type="text"
                                        placeholder={field.placeholder}
                                        className="w-full border px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end gap-2 mt-6">
                            <button className="bg-teal-500 text-white px-6 py-2 rounded-md text-sm">Add</button>
                            <button className="border border-teal-500 text-teal-600 px-6 py-2 rounded-md text-sm">Edit</button>
                            <button className="border border-gray-400 text-gray-700 px-6 py-2 rounded-md text-sm">Archive</button>
                        </div>
                    </div>
                </div>
            )}

            {/* View Modal */}
            {previewIndex !== null && (
                <div className="fixed inset-0 backdrop-blur-sm bg-white/10 flex items-center justify-center z-40">
                    <div className="bg-white rounded-2xl p-6 shadow-xl w-[450px]">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold text-gray-800">Warehouse</h3>
                            <button
                                onClick={() => setPreviewIndex(null)}
                                className="text-gray-500 hover:text-gray-700 text-lg"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-teal-700 mb-1">Warehouse ID*</label>
                                <p className="text-gray-800">OABC00WE</p>
                            </div>
                            <div>
                                <label className="block text-sm text-teal-700 mb-1">Warehouse Location</label>
                                <p className="text-gray-800">Vaccshauts Dept.</p>
                            </div>
                            <div>
                                <label className="block text-sm text-teal-700 mb-1">Stored Materials</label>
                                <p className="text-gray-800">XYZ Materials</p>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-6">
                            <button className="bg-teal-500 text-white px-6 py-2 rounded-md text-sm">Add</button>
                            <button className="border border-teal-500 text-teal-600 px-6 py-2 rounded-md text-sm">Edit</button>
                            <button className="border border-gray-400 text-gray-700 px-6 py-2 rounded-md text-sm">Archive</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Warehouse;
