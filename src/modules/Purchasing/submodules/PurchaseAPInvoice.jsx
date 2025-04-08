import React, { useState, useEffect } from "react";
import "../styles/PurchaseAPInvoice.css";
import PurchaseAPInvoiceForm from "./PurchaseAPInvoiceForm";

const PurchaseAPInvoiceBody = () => {
    const [invoices, setInvoices] = useState([]);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showDateDropdown, setShowDateDropdown] = useState(false);
    const [selectedDate, setSelectedDate] = useState("Last 30 days");
    const [showNewForm, setShowNewForm] = useState(false);

    const timeOptions = [
        "Last 30 days",
        "Last 20 days",
        "Last 10 days",
        "Last 3 days",
        "Last 1 day"
    ];

    useEffect(() => {
        // Fetch invoices from the API
        fetch("http://127.0.0.1:8000/api/invoices/list/")
            .then((response) => response.json())
            .then((data) => {
                console.log("Fetched data:", data); // Log to check API response structure
                setInvoices(data);
            })
            .catch((error) => {
                console.error("Error fetching invoices:", error);
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
        // Add search logic here
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
        setShowNewForm(true);
    };

    const handleSendTo = () => {
        // Add send to logic here
        console.log("Send to clicked");
    };

    return (
        <div className="apinvoice">
            {showNewForm ? (
                <PurchaseAPInvoiceForm onClose={() => setShowNewForm(false)} />
            ) : (
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
                                <div>Invoice ID</div>
                                <div>Purchase Order</div>
                                <div>Status</div>
                                <div>Due Date</div> {/* Updated header */}
                                <div>Document Date</div>
                            </div>

                            <div className="apinvoice-table-rows">
                                {invoices.length > 0 ? invoices.map((invoice) => (
                                    <div key={invoice.id} className="apinvoice-row">
                                        <div className="apinvoice-checkbox">
                                            <input type="checkbox" />
                                        </div>
                                        <div>{invoice.invoice_id}</div> {/* Display invoice_id */}
                                        <div>{invoice.purchase_order}</div>
                                        <div>
                                            <span className={`status-${invoice.status.toLowerCase()}`}>
                                                {invoice.status}
                                            </span>
                                        </div>
                                        <div>{invoice.due_date}</div> {/* Updated to display due_date */}
                                        <div>{invoice.document_date}</div> {/* Display document_date */}
                                    </div>
                                )) : (
                                    <div>No invoices found</div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="apinvoice-footer">
                        <button className="apinvoice-new-form" onClick={handleNewForm}>New Form</button>
                        <div className="apinvoice-footer-right">
                            <button className="apinvoice-compare" onClick={handleCompare}>Compare</button>
                            <button className="apinvoice-send-to" onClick={handleSendTo}>Send to</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PurchaseAPInvoiceBody;
