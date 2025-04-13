import React, { useState } from "react";
import "../styles/Equipment&Labor.css";

const BodyContent = () => {
    const [activeTab, setActiveTab] = useState("equipment");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedValue, setSelectedValue] = useState("available");

    const renderTable = () => {
        switch (activeTab) {
            case "equipment":
                return <EquipmentTable />;
            case "labor":
                return <LaborTable />;
            default:
                return null;
        }
    };

    return (
        <div className="equimaprod">
            <div className="equimaprod-header-section">
                <h1>Equipment & Labor</h1>
            </div>

            <div className="equimaprodcolumns">
                <div className="column expanded">
                    <div className="top-section">
                        <div className="equimaprod-button-group">
                            <button
                                className={`equipment-button ${activeTab === "equipment" ? "active" : ""}`}
                                onClick={() => setActiveTab("equipment")}
                            >
                                Equipment
                            </button>
                            <button
                                className={`labor-button ${activeTab === "labor" ? "active" : ""}`}
                                onClick={() => setActiveTab("labor")}
                            >
                                Labor
                            </button>
                        </div>
                        <div className="equimaprodsearch-bar">
                            <img src="/icons/search-icon.png" alt="Search Icon" className="search-icon" />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="equimaprodbutton-group-materials">
                            <button className="refresh-button">Refresh</button>
                            <button className="EMsave-button">Save</button>
                        </div>
                    </div>
                    <div className="EM-table">
                        {renderTable()}
                    </div>
                </div>
            </div>
        </div>
    );
};

const EquipmentTable = () => {
    const [statuses, setStatuses] = useState(Array(7).fill("available"));
    const [maintenanceDates, setMaintenanceDates] = useState(
        Array(7).fill("2024-03-01")
    );
    const [costs, setCosts] = useState(Array(7).fill("750,000"));

    const handleStatusChange = (index, value) => {
        const updatedStatuses = [...statuses];
        updatedStatuses[index] = value;
        setStatuses(updatedStatuses);
    };

    const handleMaintenanceDateChange = (index, value) => {
        const updatedDates = [...maintenanceDates];
        updatedDates[index] = value;
        setMaintenanceDates(updatedDates);
    };

    const handleCostChange = (index, value) => {
        const updatedCosts = [...costs];
        updatedCosts[index] = value;
        setCosts(updatedCosts);
    };

    return (
        <div className="table-container">
            <table className="equipment-table">
                <thead>
                    <tr>
                        <th>Equipment ID</th>
                        <th>Equipment Name</th>
                        <th>Description</th>
                        <th style={{ width: "150px" }}>Last Maintenance Date</th>
                        <th>Equipment Cost</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {statuses.map((status, index) => (
                        <tr key={index}>
                            <td><h1>E001</h1></td>
                            <td><h2>CNC Milling Machine</h2></td>
                            <td>High-precision 3-axis CNC milling machine for complex parts.</td>
                            <td>
                                <input
                                    type="date"
                                    value={maintenanceDates[index]}
                                    onChange={(e) => handleMaintenanceDateChange(index, e.target.value)}
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    value={costs[index]}
                                    onChange={(e) => handleCostChange(index, e.target.value)}
                                />
                            </td>
                            <td>
                                <select
                                    className={`availability-dropdown ${status}`}
                                    value={status}
                                    onChange={(e) => handleStatusChange(index, e.target.value)}
                                >
                                    <option value="available">Available</option>
                                    <option value="unavailable">Unavailable</option>
                                    <option value="undermaintenance">Under Maintenance</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};


const LaborTable = () => {
    const [laborStatuses, setLaborStatuses] = useState(Array(7).fill("available"));
    const [datesWorked, setDatesWorked] = useState(Array(7).fill("2024-03-01"));
    const [daysWorked, setDaysWorked] = useState(Array(7).fill("8"));

    const handleLaborStatusChange = (index, value) => {
        const updatedStatuses = [...laborStatuses];
        updatedStatuses[index] = value;
        setLaborStatuses(updatedStatuses);
    };

    const handleDatesWorkedChange = (index, value) => {
        const updatedDates = [...datesWorked];
        updatedDates[index] = value;
        setDatesWorked(updatedDates);
    };

    const handleDaysWorkedChange = (index, value) => {
        const updatedDays = [...daysWorked];
        updatedDays[index] = value;
        setDaysWorked(updatedDays);
    };

    return (
        <div className="table-container">
            <table className="labor-table">
                <thead>
                    <tr>
                        <th>Labor ID</th>
                        <th>Production Order ID</th>
                        <th>Employee ID</th>
                        <th>Date Worked</th>
                        <th>Days Worked</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {laborStatuses.map((status, index) => (
                        <tr key={index}>
                            <td><h1>L001</h1></td>
                            <td><h2>P0001</h2></td>
                            <td>EMO1</td>
                            <td>
                            <input
                                    type="date"
                                    value={datesWorked[index]}
                                    onChange={(e) => handleDatesWorkedChange(index, e.target.value)}
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    value={daysWorked[index]}
                                    onChange={(e) => handleDaysWorkedChange(index, e.target.value)}
                                />
                            </td>
                            <td>
                                <select
                                    className={`availability-dropdown ${status}`}
                                    value={status}
                                    onChange={(e) => handleLaborStatusChange(index, e.target.value)}
                                >
                                    <option value="available">Available</option>
                                    <option value="unavailable">Unavailable</option>
                                    <option value="undermaintenance">Under Maintenance</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};


export default BodyContent;
