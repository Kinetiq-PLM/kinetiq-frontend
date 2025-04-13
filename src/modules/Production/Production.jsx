import React, { useState } from "react";
import "./styles/Production.css";

const BodyContent = () => {
    const [selectedOption, setSelectedOption] = useState("All Projects");
    const [searchQuery, setSearchQuery] = useState("");
    const [statuses, setStatuses] = useState(Array(7).fill("available"));


    const handleStatusChange = (index, newStatus) => {
        const updatedStatuses = [...statuses];
        updatedStatuses[index] = newStatus;
        setStatuses(updatedStatuses);
    };

    const handleSelectChange = (event) => {
        setSelectedOption(event.target.value);
    };


    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };




    return (
        <div className="prod">
            <div className="flex-container">
                <div className="left-column">
                    <div className="body-content-container">
                        <div className="purch-box-container">
                            {["Total Project", "In Progress", "Planned", "Completed"].map((label, index) => (
                                <div className="purch-box" key={index}>
                                    <span className="purch-number">-</span>
                                    <span className="purch-label">{label}</span>
                                </div>
                            ))}
                        </div>


                        <div className="search-dropdown-container">
                            <select className="dropdown" value={selectedOption} onChange={handleSelectChange}>
                                <option value="All Projects">All Projects</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Planned">Planned</option>
                                <option value="Completed">Completed</option>
                            </select>

                            <div className="search-wrapper">
                                <img src="/icons/search-icon.png" alt="Search" className="search-icon" />
                                <input
                                    type="text"
                                    className="search-bar"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                />

                            </div>
                        </div>


                        <div className="big-container-wrapper">
                            <div className="dashboard-container">
                                <div className="table-container">
                                    <table className="production-table">
                                        <thead>
                                            <tr>
                                                <th>Production Order ID</th>
                                                <th>Task ID</th>
                                                <th>BOM ID</th>
                                                <th>Start Date</th>
                                                <th>End Date</th>
                                                <th>Target Quantity</th>
                                                <th>Remarks</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {[...Array(10)].map((_, index) => (
                                                <tr key={index}>
                                                    <td style={{ fontWeight: "bold" }}>P0OO1</td>
                                                    <td>111201</td>
                                                    <td>null</td>
                                                    <td>2024-03-05</td>
                                                    <td>2024-03-15</td>
                                                    <td>10</td>
                                                    <td>Make it blue.</td>
                                                    <td>  <select
                                                        className={`availability-dropdown ${statuses[index]}`}
                                                        value={statuses[index]}
                                                        onChange={(e) => handleStatusChange(index, e.target.value)}
                                                    >
                                                        <option value="available">Available</option>
                                                        <option value="unavailable">Unavailable</option>
                                                        <option value="undermaintenance">Under Maintenance</option>
                                                    </select></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>


                <div className="right-column">
                    <h2>List of Tasks</h2>
                    <div className="right-small-containers">
                        <div className="tasks-from-pm">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Task ID</th>
                                        <th>Due Date</th>
                                        <th></th>
                                    </tr>
                                </thead>
                            </table>


                            <div className="table-container">
                                <table>
                                    <tbody>
                                        {[...Array(7)].map((_, index) => (
                                            <tr key={index}>
                                                <td>11120{index + 1}</td>
                                                <td>2/1{index + 3}/2025</td>
                                                <td><button className="add-btn">Add</button></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>


                        </div>

                        <div className="progress-container">
                            <div className="progress-wheel">
                                <svg className="circular-progress" viewBox="0 0 36 36">
                                    <path
                                        className="circle-background"
                                        d="M18 2.0845
           a 15.9155 15.9155 0 1 1 0 31.831
           a 15.9155 15.9155 0 1 1 0 -31.831"
                                    />
                                    <path
                                        className="circle-progress"
                                        d="M18 2.0845
           a 15.9155 15.9155 0 1 1 0 31.831
           a 15.9155 15.9155 0 1 1 0 -31.831"
                                        strokeDasharray="50, 100"
                                    />
                                </svg>
                                <div className="progress-text">50%</div>
                            </div>

                            {/* Bars below */}
                            <div className="progress-details">
                                <div className="progress-item">
                                    <span>In Progress</span>
                                    <div className="bar-container">
                                        <div className="bar" style={{ width: '50%' }}></div>
                                    </div>
                                    <span>50%</span>
                                </div>
                                <div className="progress-item">
                                    <span>Planned</span>
                                    <div className="bar-container">
                                        <div className="bar" style={{ width: '19%' }}></div>
                                    </div>
                                    <span>19%</span>
                                </div>
                                <div className="progress-item">
                                    <span>Completed</span>
                                    <div className="bar-container">
                                        <div className="bar" style={{ width: '30%' }}></div>
                                    </div>
                                    <span>30%</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default BodyContent;