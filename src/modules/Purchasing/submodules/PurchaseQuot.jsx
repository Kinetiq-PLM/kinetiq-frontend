import React, { useState } from "react";
import "../styles/PurchaseQuot.css";
import PurchForQuotForm from "./PurchForQuotForm";

const PurchaseQuotBody = () => {
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showDateDropdown, setShowDateDropdown] = useState(false);
    const [selectedDate, setSelectedDate] = useState("Last 30 days");
    const [searchTerm, setSearchTerm] = useState("");
    const [showNewForm, setShowNewForm] = useState(false);

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
    };

    const handleCompare = () => {
        // Add compare logic here
        console.log("Compare button clicked");
    };

    const handleDateOptionSelect = (option) => {
        setSelectedDate(option);
        setShowDateDropdown(false);
    };

    const handleNewForm = () => {
        setShowNewForm(true);
    };

    const handleSendTo = () => {
        // Add send to logic here
        console.log("Send to clicked");
    };

    return (
        <div className="purchquote">
            {showNewForm ? (
                <PurchForQuotForm onClose={() => setShowNewForm(false)} />
            ) : (
                <div className="body-content-container">
                    <div className="purchquote-header">
                        <button className="purchquote-back" onClick={handleBack}>← Back</button>
                        <div className="purchquote-filters">
                            <div className="purchquote-date-filter">
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
                            <div className="purchquote-filter-btn" onClick={handleFilter}>
                                <span>Filter by</span>
                                <span>▼</span>
                            </div>
                            <div className="purchquote-search">
                                <input 
                                    type="text" 
                                    placeholder="Search for RQF number, supplier, date"
                                    value={searchTerm}
                                    onChange={handleSearch}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="purchquote-content">
                        <div className="purchquote-table">
                            <div className="purchquote-table-header">
                                <div className="purchquote-checkbox"><input type="checkbox" /></div>
                                <div>Purchase Quotation</div>
                                <div>Ref: Purchase Request</div>
                                <div>Status</div>
                                <div>Shipped Date</div>
                                <div>RFQ Deadline</div>
                            </div>

                            <div className="purchquote-table-rows">
                                <div className="purchquote-row">
                                    <div className="purchquote-checkbox">
                                        <input type="checkbox" />
                                    </div>
                                    <div>PR0001</div>
                                    <div>RFQ000001</div>
                                    <div><span className="status-closed">Closed</span></div>
                                    <div>01/01/2025</div>
                                    <div>01/01/2025</div>
                                </div>

                                <div className="purchquote-row">
                                    <div className="purchquote-checkbox">
                                        <input type="checkbox" />
                                    </div>
                                    <div>PR0001</div>
                                    <div>RFQ000002</div>
                                    <div><span className="status-open">Open</span></div>
                                    <div>01/01/2025</div>
                                    <div>01/01/2025</div>
                                </div>

                                <div className="purchquote-row">
                                    <div className="purchquote-checkbox">
                                        <input type="checkbox" />
                                    </div>
                                    <div>PR0002</div>
                                    <div>RFQ000003</div>
                                    <div><span className="status-cancelled">Cancelled</span></div>
                                    <div>01/01/2025</div>
                                    <div>01/01/2025</div>
                                </div>

                                <div className="purchquote-row">
                                    <div className="purchquote-checkbox">
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

                    <div className="purchquote-footer">
                        <button className="purchquote-new-form" onClick={handleNewForm}>New Form</button>
                        <div className="purchquote-footer-right">
                            <button className="purchquote-compare" onClick={handleCompare}>Compare</button>
                            <button className="purchquote-send-to" onClick={handleSendTo}>Send to</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PurchaseQuotBody;
