import React, { useState, useEffect } from "react";
import "../styles/PurchaseAPInvoice.css";
import axios from "axios";
import PurchaseAPInvoiceForm from "./PurchaseAPInvoiceForm";

const PurchaseAPInvoiceBody = ({ onBackToDashboard }) => {
    const [invoices, setInvoices] = useState([]);
    const [filteredInvoices, setFilteredInvoices] = useState([]);
    const [selectedInvoice, setSelectedInvoice] = useState(null); // Selected invoice
    const [selectedDate, setSelectedDate] = useState("Last 30 days");
    const [selectedStatus, setSelectedStatus] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const [showDateDropdown, setShowDateDropdown] = useState(false);
    const [showStatusFilter, setShowStatusFilter] = useState(false);
    const [purchaseOrders, setPurchaseOrders] = useState({}); // Map of content_id to purchase_id

    const timeOptions = [
        "Last 30 days",
        "Last 20 days",
        "Last 10 days",
        "Last 3 days",
        "Last 1 day"
    ];

    const statusOptions = [
        "All",
        "Over Due",
        "Paid",
        "Received",
        "Forwarded"
    ];

    useEffect(() => {
        // Fetch invoices from the API
        const fetchInvoices = async () => {
            try {
                const response = await axios.get(
                    "https://yi92cir5p0.execute-api.ap-southeast-1.amazonaws.com/dev/api/invoices/list/"
                );
                console.log("Fetched invoices:", response.data);
                setInvoices(response.data);
                setFilteredInvoices(response.data); // Initialize filtered invoices
            } catch (error) {
                console.error("Error fetching invoices:", error);
            }
        };

        fetchInvoices();
    }, []);

    useEffect(() => {
        // Fetch purchase orders using content_id from external-module
        const fetchPurchaseOrders = async () => {
            try {
                const externalModulesResponse = await axios.get(
                    "https://yi92cir5p0.execute-api.ap-southeast-1.amazonaws.com/dev/api/invoices/external-modules/"
                );
                const purchaseOrdersResponse = await axios.get(
                    "https://yi92cir5p0.execute-api.ap-southeast-1.amazonaws.com/dev/api/purchase-orders/list/"
                );

                const purchaseOrderMap = {};
                externalModulesResponse.data.forEach((module) => {
                    const purchaseOrder = purchaseOrdersResponse.data.find(
                        (order) => order.purchase_id === module.purchase_id
                    );
                    if (purchaseOrder) {
                        purchaseOrderMap[module.content_id] = purchaseOrder.purchase_id;
                    }
                });

                console.log("Mapped Purchase Orders:", purchaseOrderMap);
                setPurchaseOrders(purchaseOrderMap);
            } catch (error) {
                console.error("Error fetching purchase orders:", error);
            }
        };

        fetchPurchaseOrders();
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
                (invoice.content_id && purchaseOrders[invoice.content_id]?.toString().toLowerCase().includes(term)) ||
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

    // Back button handler to toggle dashboard
    const handleBackToDashboard = () => {
        if (onBackToDashboard) {
            onBackToDashboard();
        } else {
            // Fallback to the old method if prop is not provided
            const event = new CustomEvent('purchasing-back-to-dashboard');
            window.dispatchEvent(event);
        }
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
                                            <div>{invoice.invoice_id}</div>
                                            <div>{purchaseOrders[invoice.content_id] || "N/A"}</div>
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