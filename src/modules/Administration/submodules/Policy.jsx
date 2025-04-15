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
        <div className="policy-container">
            <div className="policy-header">
                <h2>Policies</h2>
                <div className="policy-controls">
                    <button onClick={() => setShowForm(true)}>Policy</button>
                    <input type="text" placeholder="Search..." />
                </div>
            </div>

            <table className="policy-table">
                <thead>
                    <tr>
                        <th>Policy ID</th>
                        <th>Policy Name</th>
                        <th>Description</th>
                        <th>Effective Date</th>
                        <th>Status</th>
                        <th>View</th>
                    </tr>
                </thead>
                <tbody>
                    {policies.map((policy, index) => (
                        <tr key={index}>
                            <td>{policy.policyId}</td>
                            <td>{policy.policyName}</td>
                            <td>{policy.description}</td>
                            <td>{policy.effectiveDate}</td>
                            <td>
                                <select defaultValue={policy.status}>
                                    <option>Active</option>
                                    <option>Inactive</option>
                                </select>
                            </td>
                            <td>
                                <button onClick={() => handleToggle(index)}>View</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Upload/Entry Form */}
            {showForm && (
                <div className="policy-modal">
                    <h3>Policy</h3>
                    <label>Policy ID</label>
                    <input type="text" placeholder="Enter policy ID" />
                    <label>Policy Name</label>
                    <input type="text" placeholder="Enter policy name" />
                    <label>Effective Date</label>
                    <input type="date" />
                    <label>Status</label>
                    <input type="text" placeholder="Enter status" />
                    <label>Description</label>
                    <textarea placeholder="Enter description"></textarea>
                    <div className="policy-btns">
                        <button className="btn-submit">Submit</button>
                        <button onClick={() => setShowForm(false)}>Cancel</button>
                    </div>
                </div>
            )}

            {/* Content Preview */}
            {previewIndex !== null && (
                <div className="policy-preview">
                    <div className="preview-header">
                        <span>Download ⬇</span>
                        <button onClick={() => setPreviewIndex(null)}>X</button>
                    </div>
                    <div className="preview-body">
                        <p>KINETIQ POLICY AND PROCEDURAL MANUAL</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Policy;
