import React, { useState, useEffect } from "react";
import "../styles/PurchaseCredMemo.css";
import PurchaseCredMemoForm from "./PurchaseCredMemoForm";

const PurchaseCredMemoBody = () => {
    const [creditMemos, setCreditMemos] = useState([]);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showDateDropdown, setShowDateDropdown] = useState(false);
    const [selectedDate, setSelectedDate] = useState("Last 30 days");
    const [searchTerm, setSearchTerm] = useState("");
    const [showForm, setShowForm] = useState(false);

    const timeOptions = [
        "Last 30 days",
        "Last 20 days",
        "Last 10 days",
        "Last 3 days",
        "Last 1 day"
    ];

    useEffect(() => {
        // Fetch credit memos from the API
        fetch("http://127.0.0.1:8000/api/credit-memo/list/")
            .then((response) => response.json())
            .then((data) => {
                console.log("Fetched credit memos:", data); // Log the API response structure
                setCreditMemos(data);
            })
            .catch((error) => {
                console.error("Error fetching credit memos:", error);
            });
    }, []);

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

    const handleNewForm = () => {
        setShowForm(true);
    };

    const handleSendTo = () => {
        // Add send to logic here
        console.log("Send to clicked");
    };

    return (
        <div className="credmemo">
            {showForm ? (
                <PurchaseCredMemoForm onClose={() => setShowForm(false)} />
            ) : (
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
                                <div>Document Date</div> {/* Updated field name */}
                                <div>Due Date</div>
                            </div>

                            <div className="credmemo-table-rows">
                                {creditMemos.length > 0 ? creditMemos.map((memo) => (
                                    <div key={memo.id} className="credmemo-row">
                                        <div className="credmemo-checkbox">
                                            <input type="checkbox" />
                                        </div>
                                        <div>{memo.credit_memo_id}</div> {/* Display Credit Memo ID */}
                                        <div>{memo.purchase_order}</div>
                                        <div>
                                            <span className={`status-${memo.status.toLowerCase()}`}>
                                                {memo.status}
                                            </span>
                                        </div>
                                        <div>{memo.document_date}</div> {/* Updated to display Document Date */}
                                        <div>{memo.due_date}</div> {/* Display Due Date */}
                                    </div>
                                )) : (
                                    <div>No credit memos found</div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="credmemo-footer">
                        <button className="credmemo-new-form" onClick={handleNewForm}>New Form</button>
                        <div className="credmemo-footer-right">
                            <button className="credmemo-compare" onClick={handleCompare}>Compare</button>
                            <button className="credmemo-send-to" onClick={handleSendTo}>Send to</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PurchaseCredMemoBody;
