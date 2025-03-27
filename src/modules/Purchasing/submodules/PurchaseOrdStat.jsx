import React, { useState } from "react";
import "../styles/PurchaseAPInvoice.css";

const PurchaseOrdStatBody = () => {
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showDateDropdown, setShowDateDropdown] = useState(false);
    const [selectedDate, setSelectedDate] = useState("Last 30 days");

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
        // Add search logic here
        console.log("Searching for:", e.target.value);
    };

    const handleCompare = () => {
        // Add compare logic here
        console.log("Compare button clicked");
    };

    const handleDateOptionSelect = (option) => {
        setSelectedDate(option);
        setShowDateDropdown(false);
    };

    return (
        <div className="apinvoice">
            <div className="body-content-container">
                <div className="apinvoice-header">
                    <button className="apinvoice-back" onClick={handleBack}>← Back</button>
                    <div className="apinvoice-filters">
                        <div className="apinvoice-date-filter">
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
                        <div className="apinvoice-filter-btn" onClick={handleFilter}>
                            <span>Filter by</span>
                            <span>▼</span>
                        </div>
                        <div className="apinvoice-search">
                            <input 
                                type="text" 
                                placeholder="Search for RQF number, supplier, date"
                                onChange={handleSearch}
                            />
                        </div>
                    </div>
                </div>

                <div className="apinvoice-content">
                    <div className="apinvoice-table">
                        <div className="apinvoice-table-header">
                            <div className="apinvoice-checkbox"><input type="checkbox" /></div>
                            <div>Purchase Order</div>
                            <div>Ref: RFQ</div>
                            <div>Status</div>
                            <div>Shipped Date</div>
                            <div>RFQ Deadline</div>
                        </div>

                        <div className="apinvoice-table-rows">
                            <div className="apinvoice-row">
                                <div className="apinvoice-checkbox">
                                    <input type="checkbox" />
                                </div>
                                <div>PR0001</div>
                                <div>RFQ000001</div>
                                <div><span className="status-closed">Closed</span></div>
                                <div>01/01/2025</div>
                                <div>01/01/2025</div>
                            </div>

                            <div className="apinvoice-row">
                                <div className="apinvoice-checkbox">
                                    <input type="checkbox" />
                                </div>
                                <div>PR0001</div>
                                <div>RFQ000002</div>
                                <div><span className="status-open">Open</span></div>
                                <div>01/01/2025</div>
                                <div>01/01/2025</div>
                            </div>

                            <div className="apinvoice-row">
                                <div className="apinvoice-checkbox">
                                    <input type="checkbox" />
                                </div>
                                <div>PR0002</div>
                                <div>RFQ000003</div>
                                <div><span className="status-cancelled">Cancelled</span></div>
                                <div>01/01/2025</div>
                                <div>01/01/2025</div>
                            </div>

                            <div className="apinvoice-row">
                                <div className="apinvoice-checkbox">
                                    <input type="checkbox" />
                                </div>
                                <div>PR0002</div>
                                <div>RFQ000003</div>
                                <div><span className="status-draft">Draft</span></div>
                                <div>01/01/2025</div>
                                <div>01/01/2025</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="apinvoice-footer">
                    <button className="apinvoice-compare" onClick={handleCompare}>Compare</button>
                </div>
            </div>
        </div>
    );
};

export default PurchaseOrdStatBody;
