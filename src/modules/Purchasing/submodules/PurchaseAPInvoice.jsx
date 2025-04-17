import React, { useState, useEffect } from "react";
import "../styles/PurchaseAPInvoice.css";
import PurchaseAPInvoiceForm from "./PurchaseAPInvoiceForm";

const PurchaseAPInvoiceBody = () => {
    const [invoices, setInvoices] = useState([]);
    const [filteredInvoices, setFilteredInvoices] = useState([]);
    const [selectedInvoice, setSelectedInvoice] = useState(null); // Selected invoice
    const [selectedDate, setSelectedDate] = useState("Last 30 days");
    const [selectedStatus, setSelectedStatus] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const [showDateDropdown, setShowDateDropdown] = useState(false);
    const [showStatusFilter, setShowStatusFilter] = useState(false);

    const timeOptions = [
        "Last 30 days",
        "Last 20 days",
        "Last 10 days",
        "Last 3 days",
        "Last 1 day"
    ];

    const statusOptions = [
        "All",
        "Rejected",
        "Completed",
        "Approved",
        "Pending"
    ];

    useEffect(() => {
        // Fetch invoices from the API
        fetch("http://127.0.0.1:8000/api/invoices/list/")
            .then((response) => response.json())
            .then((data) => {
                console.log("Fetched data:", data);
                setInvoices(data);
                setFilteredInvoices(data); // Initialize filtered invoices
            })
            .catch((error) => {
                console.error("Error fetching invoices:", error);
            });
    }, []);

    useEffect(() => {
        // Apply all filters whenever any filter changes
        applyFilters();
    }, [selectedDate, selectedStatus, searchTerm, invoices]);

    const applyFilters = () => {
        let result = [...invoices];

        // 1. Apply date filter
        if (selectedDate !== "All") {
            const days = parseInt(selectedDate.match(/\d+/)[0], 10);
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - days);
            result = result.filter(invoice => new Date(invoice.document_date) >= cutoffDate);
        }

        // 2. Apply status filter
        if (selectedStatus !== "All") {
            result = result.filter(invoice => invoice.status === selectedStatus);
        }

        // 3. Apply search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(invoice => 
                (invoice.invoice_id && invoice.invoice_id.toString().toLowerCase().includes(term)) ||
                (invoice.purchase_order && invoice.purchase_order.toString().toLowerCase().includes(term)) ||
                (invoice.document_date && invoice.document_date.toString().toLowerCase().includes(term)) ||
                (invoice.status && invoice.status.toLowerCase().includes(term))
            );
        }

        setFilteredInvoices(result);
    };

    const handleDateOptionSelect = (option) => {
        setSelectedDate(option);
        setShowDateDropdown(false);
    };

    const handleStatusSelect = (status) => {
        setSelectedStatus(status);
        setShowStatusFilter(false);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleInvoiceClick = (invoice) => {
        setSelectedInvoice(invoice); // Set the selected invoice
    };

    // Add back button handler to toggle dashboard
    const handleBackToDashboard = () => {
        const event = new CustomEvent('purchasing-back-to-dashboard');
        window.dispatchEvent(event);
    };

    return (
        <div className="apinvoice">
            {selectedInvoice ? (
                <PurchaseAPInvoiceForm 
                    invoiceData={selectedInvoice} 
                    onClose={() => setSelectedInvoice(null)} 
                />
            ) : (
                <div className="body-content-container">
                    <div className="apinvoice-header">
                        <button className="apinvoice-back" onClick={handleBackToDashboard}>← Back</button>
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
                            <div className="apinvoice-filter-btn" onClick={() => setShowStatusFilter(!showStatusFilter)}>
                                <span>Filter by: {selectedStatus}</span>
                                <span>▼</span>
                                {showStatusFilter && (
                                    <div className="status-options-dropdown">
                                        {statusOptions.map((status) => (
                                            <div
                                                key={status}
                                                className="status-option"
                                                onClick={() => handleStatusSelect(status)}
                                            >
                                                {status}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="apinvoice-search">
                                <input 
                                    type="text" 
                                    placeholder="Search for Invoice ID, PO, Status, Date"
                                    value={searchTerm}
                                    onChange={handleSearch}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="apinvoice-content">
                        <div className="apinvoice-table-header">
                            <div className="apinvoice-checkbox"><input type="checkbox" /></div>
                            <div>Invoice ID</div>
                            <div>Purchase Order</div>
                            <div>Status</div>
                            <div>Document Date</div>
                            <div>Due Date</div>
                        </div>
                        <div className="apinvoice-table-scrollable">
                            <div className="apinvoice-table-rows">
                                {filteredInvoices.length > 0 ? (
                                    filteredInvoices.map((invoice) => (
                                        <div 
                                            key={invoice.id} 
                                            className="apinvoice-row"
                                            onClick={() => handleInvoiceClick(invoice)}
                                        >
                                            <div className="apinvoice-checkbox">
                                                <input type="checkbox" />
                                            </div>
                                            <div>{invoice.invoice_id}</div>
                                            <div>{invoice.purchase_order}</div>
                                            <div>
                                                <span className={`status-${invoice.status?.toLowerCase()}`}>{invoice.status}</span>
                                            </div>
                                            <div>{invoice.document_date}</div>
                                            <div>{invoice.due_date}</div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="apinvoice-no-data">No invoices found matching your criteria</div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="apinvoice-footer">
                        {/* Removed New Form, Compare, and Send To buttons as requested */}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PurchaseAPInvoiceBody;