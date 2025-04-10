import React, { useState } from "react";
import "../styles/Equipment&Materials.css";



const BodyContent = () => {
    const [activeTab, setActiveTab] = useState("component");
    const [searchTerm, setSearchTerm] = useState("");

    // Sample table components
    const renderTable = () => {
        switch (activeTab) {
            case "equipment":
                return <EquipmentTable />;
            case "component":
                return <ComponentTable />;
            case "labor":
                return <LaborTable />;
            default:
                return null;
        }
    };

    return (
        <div className="container">
            {/* Updated Header Section */}
            <div className="header-section">
                <div className="header">Equipment & Materials</div>
                <div className="button-group-materials">
                    <button className="refresh-button">Refresh</button>
                    <button className="request-form-button">Request Form</button>
                </div>
            </div>

            <div className="columns">
                {/* First Column */}
                <div className="column expanded">
                    <div className="top-section">
                        <div className="button-group">
                            <button
                                className={`equipment-button ${activeTab === "equipment" ? "active" : ""}`}
                                onClick={() => setActiveTab("equipment")}
                            >
                                Equipment
                            </button>
                            <button
                                className={`component-button ${activeTab === "component" ? "active" : ""}`}
                                onClick={() => setActiveTab("component")}
                            >
                                Component
                            </button>
                            <button
                                className={`labor-button ${activeTab === "labor" ? "active" : ""}`}
                                onClick={() => setActiveTab("labor")}
                            >
                                Labor
                            </button>
                        </div>
                        <div className="s-bar">
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="EM-table">
                        {renderTable()}
                    </div>
                </div>
                <div className="column expanded">
                    <div className="notification-container">
                        <div className="header-notification">Notification</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Equipment Table Component
const EquipmentTable = () => (
    <table>
        <thead>
            <tr>
                <th>Equipment ID</th>
                <th>Equipment Name</th>
                <th>Description</th>
                <th>Last Maintenance Date</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            {/* Table content removed */}
        </tbody>
    </table>
);

// Component Table Component
const ComponentTable = () => (
    <table>
        <thead>
            <tr>
                <th>Component Name</th>
                <th>Component ID</th>
                <th>Description</th>
                <th>Unit of Measure</th>
                <th>Current Stock</th>
            </tr>
        </thead>
        <tbody>
            {/* Table content removed */}
        </tbody>
    </table>
);

// Labor Table Component
const LaborTable = () => (
    <table>
        <thead>
            <tr>
                <th>Worker Name</th>
                <th>Role</th>
                <th>Shift</th>
            </tr>
        </thead>
        <tbody>
            {/* Table content removed */}
        </tbody>
    </table>
);

export default BodyContent;
