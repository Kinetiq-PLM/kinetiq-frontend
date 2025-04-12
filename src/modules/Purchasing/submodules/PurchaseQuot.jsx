import React, { useState, useEffect } from "react";
import "../styles/PurchaseQuot.css";
import PurchForQuotForm from "./PurchForQuotForm";
import PurchaseOrdStat from "./PurchaseOrdStat"; // Import the PurchaseOrdStat component

const PurchaseQuotBody = () => {
    const [showDateDropdown, setShowDateDropdown] = useState(false);
    const [selectedDate, setSelectedDate] = useState("Last 30 days");
    const [searchTerm, setSearchTerm] = useState("");
    const [showNewForm, setShowNewForm] = useState(false);
    const [quotations, setQuotations] = useState([]);
    const [selectedQuotation, setSelectedQuotation] = useState(null); // Store the selected quotation
    const [view, setView] = useState("list"); // Manage the current view (list, form, or order status)

    const timeOptions = [
        "Last 30 days",
        "Last 20 days",
        "Last 10 days",
        "Last 3 days",
        "Last 1 day",
    ];

    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/purchase_quotation/list/")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch quotations");
                }
                return response.json();
            })
            .then((data) => {
                console.log("Fetched Quotations:", data);
                setQuotations(data.results || data);
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    const filterByDate = (dateRange) => {
        const days = parseInt(dateRange.match(/\d+/)[0], 10);
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);

        return quotations.filter((q) => new Date(q.document_date) >= cutoffDate);
    };

    const handleDateOptionSelect = (option) => {
        setSelectedDate(option);
        setShowDateDropdown(false);
    };

    const handleRowClick = (quotation) => {
        setSelectedQuotation(quotation); // Store the selected quotation
        setView("form"); // Switch to the PurchForQuotForm view
    };

    const filteredQuotations = filterByDate(selectedDate).filter((q) =>
        q.document_no.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        (q.status && q.status.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="purchquote">
            {view === "list" ? (
                <div className="body-content-container">
                    <div className="purchquote-header">
                        <button className="purchquote-back">← Back</button>
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
                            <div className="purchquote-search">
                                <input
                                    type="text"
                                    placeholder="Search for Document No, Status"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="purchquote-content">
                        <div className="purchquote-table">
                            <div className="purchquote-table-header">
                                <div className="purchquote-column">Document No</div>
                                <div className="purchquote-column">Quotation ID</div>
                                <div className="purchquote-column">Status</div>
                                <div className="purchquote-column">Document Date</div>
                            </div>

                            <div className="purchquote-table-rows">
                                {filteredQuotations.length > 0 ? (
                                    filteredQuotations.map((q) => (
                                        <div
                                            className="purchquote-row"
                                            key={q.quotation_id}
                                            onClick={() => handleRowClick(q)} // Handle row click
                                        >
                                            <div className="purchquote-column">{q.document_no}</div>
                                            <div className="purchquote-column">{q.quotation_id}</div>
                                            <div className="purchquote-column">
                                                <span className={`status-${q.status.toLowerCase()}`}>
                                                    {q.status}
                                                </span>
                                            </div>
                                            <div className="purchquote-column">
                                                {new Date(q.document_date).toLocaleDateString()}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="purchquote-no-data">No quotations found</div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            ) : view === "form" ? (
                <PurchForQuotForm
                    onClose={() => setView("list")} // Go back to the list view
                    request={selectedQuotation} // Pass the selected quotation
                />
            ) : (
                <PurchaseOrdStat
                    onClose={() => setView("list")} // Go back to the list view
                    request={selectedQuotation} // Pass the selected quotation
                />
            )}
        </div>
    );
};

export default PurchaseQuotBody;
