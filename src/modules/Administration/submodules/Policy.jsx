import React, { useState } from "react";
import "../styles/Policy.css";

const initialPolicies = [
    {
        policyId: "POL-001",
        policyName: "Employee Conduct Policy",
        description: "Policy about employee behavior and rules.",
        effectiveDate: "2023-12-03",
        status: "Active",
    },
    {
        policyId: "POL-002",
        policyName: "Data Security Policy",
        description: "Guidelines for handling company data.",
        effectiveDate: "2024-01-10",
        status: "Inactive",
    },
    {
        policyId: "POL-003",
        policyName: "Workplace Safety Policy",
        description: "Safety regulations at the office.",
        effectiveDate: "2024-02-18",
        status: "Active",
    },
];

const Policy = () => {
    const [policies, setPolicies] = useState(initialPolicies);
    const [showForm, setShowForm] = useState(false);
    const [previewIndex, setPreviewIndex] = useState(null);

    const handleToggle = (index) => {
        setPreviewIndex(previewIndex === index ? null : index);
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Policies</h2>

            <div className="flex justify-between items-center mb-4">
                <div></div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-teal-500 text-white px-4 py-2 rounded-md text-sm"
                    >
                        Policy
                    </button>
                    <input
                        type="text"
                        placeholder="Search..."
                        className="border border-gray-300 px-3 py-2 rounded-md text-sm"
                    />
                </div>
            </div>

            <div className="bg-white shadow-md rounded-xl p-4 overflow-x-auto">
                <table className="w-full border-collapse border border-gray-200 rounded-xl">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="px-4 py-3 border border-gray-200 text-left">Policy ID</th>
                            <th className="px-4 py-3 border border-gray-200 text-left">Policy Name</th>
                            <th className="px-4 py-3 border border-gray-200 text-left">Description</th>
                            <th className="px-4 py-3 border border-gray-200 text-left">Effective Date</th>
                            <th className="px-4 py-3 border border-gray-200 text-left">Status</th>
                            <th className="px-4 py-3 border border-gray-200 text-left">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {policies.map((policy, index) => (
                            <tr
                                key={index}
                                className="border border-gray-200 odd:bg-gray-50 hover:bg-gray-100"
                            >
                                <td className="px-4 py-3 border border-gray-200">{policy.policyId}</td>
                                <td className="px-4 py-3 border border-gray-200">{policy.policyName}</td>
                                <td className="px-4 py-3 border border-gray-200">{policy.description}</td>
                                <td className="px-4 py-3 border border-gray-200">{policy.effectiveDate}</td>
                                <td className="px-4 py-3 border border-gray-200">
                                    <select
                                        defaultValue={policy.status}
                                        className="w-full border px-2 py-1 rounded-md"
                                    >
                                        <option>Active</option>
                                        <option>Inactive</option>
                                    </select>
                                </td>
                                <td className="px-4 py-3 border border-gray-200">
                                    <button
                                        onClick={() => handleToggle(index)}
                                        className="text-teal-600 hover:underline text-sm"
                                    >
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Policy Modal */}
            {showForm && (
                <div className="fixed inset-0 backdrop-blur-sm bg-white/10 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 w-[600px] shadow-lg relative">
                        <h3 className="text-2xl font-bold mb-6 text-gray-800">Policy</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    Policy ID
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter policy ID"
                                    className="w-full border px-3 py-2 rounded-md text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    Policy Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter policy name"
                                    className="w-full border px-3 py-2 rounded-md text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    Effective Date
                                </label>
                                <input
                                    type="date"
                                    className="w-full border px-3 py-2 rounded-md text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    Status
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter status"
                                    className="w-full border px-3 py-2 rounded-md text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    placeholder="Enter description"
                                    className="w-full border px-3 py-2 rounded-md text-sm"
                                    rows={4}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button className="bg-teal-500 text-white px-6 py-2 rounded-md text-sm">
                                Submit
                            </button>
                            <button
                                onClick={() => setShowForm(false)}
                                className="border border-gray-400 text-gray-700 px-6 py-2 rounded-md text-sm"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Preview */}
            {previewIndex !== null && (
                <div className="fixed inset-0 backdrop-blur-sm bg-white/10 flex items-center justify-center z-40">
                    <div className="bg-white rounded-xl p-6 w-[500px] shadow-lg relative">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-teal-700 font-medium">Download ⬇</span>
                            <button
                                onClick={() => setPreviewIndex(null)}
                                className="text-gray-500 hover:text-black"
                            >
                                ✖
                            </button>
                        </div>
                        <div className="text-center text-gray-800 font-semibold">
                            KINETIQ POLICY AND PROCEDURAL MANUAL
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Policy;
