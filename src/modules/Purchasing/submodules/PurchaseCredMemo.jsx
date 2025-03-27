import React, { useState } from "react";
import "../styles/PurchaseCredMemo.css";

const PurchaseCredMemoBody = () => {
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showDateDropdown, setShowDateDropdown] = useState(false);
    const [selectedDate, setSelectedDate] = useState("Last 30 days");
    const [searchTerm, setSearchTerm] = useState("");

    const timeOptions = [
        "Last 30 days",
        "Last 20 days",
        "Last 10 days",
        "Last 3 days",
        "Last 1 day"
    ];

    const handleBack = () => {
        // Add navigation logic here
        console.log("Back button clicked");
    };

    const handleFilter = () => {
        // Add filter logic here
        console.log("Filter clicked");
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        console.log("Searching for:", e.target.value);
    };

    const handleCompare = () => {
        // Add compare logic here
        console.log("Compare clicked");
    };

    const handleDateOptionSelect = (option) => {
        setSelectedDate(option);
        setShowDateDropdown(false);
    };

    return (
        <div className="credmemo">
            <div className="credmemo-body-content-container">
                <div className="credmemo-header">
                    <button className="credmemo-back" onClick={handleBack}>← Back</button>
                    <div className="credmemo-filters">
                        <div className="credmemo-date-filter">
                            <div 
                                className="date-display"
                                onClick={() => setShowDateDropdown(!showDateDropdown)}
                            >
                                <span>{selectedDate}</span>
                                <span>▼</span>
                            </div>
                            {showDateDropdown && (
                                <div className="date-options-dropdown">
                                    {timeOptions.map((option) => (
                                        <div
                                            key={option}
                                            className="date-option"
                                            onClick={() => handleDateOptionSelect(option)}
                                        >
                                            {option}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="credmemo-filter-btn" onClick={handleFilter}>
                            <span>Filter by</span>
                            <span>▼</span>
                        </div>
                        <div className="credmemo-search">
                            <input 
                                type="text" 
                                placeholder="Search for RQF number, supplier, date"
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                        </div>
                    </div>
                </div>

                <div className="credmemo-content">
                    <div className="credmemo-table">
                        <div className="credmemo-table-header">
                            <div className="credmemo-checkbox"><input type="checkbox" /></div>
                            <div>Credit Memo</div>
                            <div>Ref: Purchase Order</div>
                            <div>Status</div>
                            <div>Credit Memo Date</div>
                            <div>Due Date</div>
                        </div>

                        <div className="credmemo-table-rows">
                            <div className="credmemo-row">
                                <div className="credmemo-checkbox">
                                    <input type="checkbox" />
                                </div>
                                <div>CM0001</div>
                                <div>RFQ000001</div>
                                <div><span className="status-closed">Closed</span></div>
                                <div>01/01/2025</div>
                                <div>01/01/2025</div>
                            </div>

                            <div className="credmemo-row">
                                <div className="credmemo-checkbox">
                                    <input type="checkbox" />
                                </div>
                                <div>CM0001</div>
                                <div>RFQ000002</div>
                                <div><span className="status-open">Open</span></div>
                                <div>01/01/2025</div>
                                <div>01/01/2025</div>
                            </div>

                            <div className="credmemo-row">
                                <div className="credmemo-checkbox">
                                    <input type="checkbox" />
                                </div>
                                <div>CM0002</div>
                                <div>RFQ000003</div>
                                <div><span className="status-cancelled">Cancelled</span></div>
                                <div>01/01/2025</div>
                                <div>01/01/2025</div>
                            </div>

                            <div className="credmemo-row">
                                <div className="credmemo-checkbox">
                                    <input type="checkbox" />
                                </div>
                                <div>CM0003</div>
                                <div>RFQ000003</div>
                                <div><span className="status-draft">Draft</span></div>
                                <div>01/01/2025</div>
                                <div>01/01/2025</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="credmemo-footer">
                    <button className="credmemo-compare" onClick={handleCompare}>Compare</button>
                </div>
            </div>
        </div>
    );
};

export default PurchaseCredMemoBody;
