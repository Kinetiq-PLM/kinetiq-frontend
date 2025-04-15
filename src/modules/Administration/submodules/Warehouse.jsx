import React, { useState } from "react";
import "../styles/warehouse.css";

const initialWarehouses = [
    {
        warehouseId: "Maria",
        location: "Mari123",
        materials: "Qwdw"
    },
    {
        warehouseId: "Maria",
        location: "Mari123",
        materials: "Qwdw"
    },
    {
        warehouseId: "Maria",
        location: "Mari123",
        materials: "Qwdw"
    }
];

const Warehouse = () => {
    const [warehouses, setWarehouses] = useState(initialWarehouses);
    const [showForm, setShowForm] = useState(false);
    const [previewIndex, setPreviewIndex] = useState(null);

    const handleTogglePreview = (index) => {
        setPreviewIndex(previewIndex === index ? null : index);
    };

    return (
        <div className="warehouse-container">
            <div className="warehouse-header">
                <h2>Warehouse</h2>
                <div className="warehouse-controls">
                    <input type="text" placeholder="Search..." />
                    <button onClick={() => setShowForm(true)}>Add</button>
                    <select>
                        <option>Vendor Info</option>
                        <option>Warehouse Type</option>
                    </select>
                </div>
            </div>

            <table className="warehouse-table">
                <thead>
                    <tr>
                        <th>Warehouse ID</th>
                        <th>Warehouse Location</th>
                        <th>Stored Materials</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {warehouses.map((w, index) => (
                        <tr key={index}>
                            <td>{w.warehouseId}</td>
                            <td>{w.location}</td>
                            <td>{w.materials}</td>
                            <td>
                                <button onClick={() => handleTogglePreview(index)}>View</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showForm && (
                <div className="warehouse-modal">
                    <h3>Warehouse</h3>
                    <label>Warehouse ID</label>
                    <input type="text" placeholder="Enter warehouse ID" />
                    <label>Warehouse Location</label>
                    <input type="text" placeholder="Enter location" />
                    <label>Stored Materials</label>
                    <input type="text" placeholder="Enter materials stored" />
                    <div className="warehouse-btns">
                        <button className="btn-submit">Add</button>
                        <button className="btn-edit">Edit</button>
                        <button onClick={() => setShowForm(false)}>Delete</button>
                    </div>
                </div>
            )}

            {previewIndex !== null && (
                <div className="warehouse-preview">
                    <div className="preview-header">
                        <span>Warehouse</span>
                        <button onClick={() => setPreviewIndex(null)}>X</button>
                    </div>
                    <div className="preview-body">
                        <div>
                            <strong>Warehouse ID</strong>
                            <p>DABC00WE</p>
                        </div>
                        <div>
                            <strong>Warehouse Location</strong>
                            <p>Vocsachuts Dept.</p>
                        </div>
                        <div>
                            <strong>Stored Materials</strong>
                            <p>XYZ Materials</p>
                        </div>
                        <div className="warehouse-btns">
                            <button className="btn-submit">Add</button>
                            <button className="btn-edit">Edit</button>
                            <button className="btn-delete">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Warehouse;
