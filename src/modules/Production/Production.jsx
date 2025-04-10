import React, { useState } from "react";
import "./styles/Production.css";

const BodyContent = () => {
    const [selectedOption, setSelectedOption] = useState("All Projects");
    const [searchQuery, setSearchQuery] = useState("");

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
                            <div className="purch-box">
                                <span className="purch-number">16,408</span>
                                <span className="purch-label">Total Project</span>
                            </div>
                            <div className="purch-box">
                                <span className="purch-number">8,204</span>
                                <span className="purch-label">In progress</span>
                            </div>
                            <div className="purch-box">
                                <span className="purch-number">3,234</span>
                                <span className="purch-label">Planned</span>
                            </div>
                            <div className="purch-box">
                                <span className="purch-number">4,970</span>
                                <span className="purch-label">Completed</span>
                            </div>
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
                                <button className="edit-btn">
                              
                                    Edit
                                </button>
                            </div>
                        </div>

                        <div className="big-container-wrapper">
                            <div className="dashboard-container">
                                
                                
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="right-column">
                <h2>List of Projects </h2>
                <div className="right-small-containers">
                    <div className="right-container">
                    </div>
                    <div className="small-container">
                    </div>
                </div>
                    </div>
                </div>
            </div>
       
    );
};

export default BodyContent;

