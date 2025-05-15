import React, { useState, useEffect } from "react";
import "../styles/PurchaseQuot.css";
import PurchForQuotForm from "./PurchForQuotForm";
import PurchaseQuotEdit from "./PurchaseQuotEdit"; // Import the edit component

const PurchaseQuotBody = ({ onBackToDashboard }) => {
  const [quotations, setQuotations] = useState([]);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [editingQuotation, setEditingQuotation] = useState(null); // State for the quotation being edited
  const [view, setView] = useState("list");
  
  // Add state for filters and search
  const [selectedDate, setSelectedDate] = useState("Last 30 days");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const [filteredQuotations, setFilteredQuotations] = useState([]);

  const timeOptions = [
    "Last 30 days",
    "Last 20 days",
    "Last 10 days",
    "Last 3 days",
    "Last 1 day"
  ];
  
  const statusOptions = [
    "All",
    "Pending",
    "Approved",
    "Rejected",
    "Quotation Sent"
  ];

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

  useEffect(() => {
    fetch("https://yi92cir5p0.execute-api.ap-southeast-1.amazonaws.com/dev/api/purchase_quotation/list/")
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

  // Filtering logic
  useEffect(() => {
    let result = [...quotations];
    // Date filter
    if (selectedDate && selectedDate !== 'Last 30 days') {
      let days = 30;
      if (selectedDate.includes('1 day')) days = 1;
      else if (selectedDate.includes('3 days')) days = 3;
      else if (selectedDate.includes('10 days')) days = 10;
      else if (selectedDate.includes('20 days')) days = 20;
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      result = result.filter((quotation) => {
        if (!quotation.document_date) return true;
        return new Date(quotation.document_date) >= cutoffDate;
      });
    }
    // Status filter
    if (selectedStatus !== 'All') {
      result = result.filter((quotation) => {
        return quotation.status === selectedStatus;
      });
    }
    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (quotation) =>
          (quotation.document_no && quotation.document_no.toString().toLowerCase().includes(term)) ||
          (quotation.quotation_id && quotation.quotation_id.toString().toLowerCase().includes(term)) ||
          (quotation.document_date && quotation.document_date.toString().toLowerCase().includes(term)) ||
          (quotation.status && quotation.status.toLowerCase().includes(term))
      );
    }
    setFilteredQuotations(result);
  }, [quotations, selectedDate, selectedStatus, searchTerm]);

  const handleRowClick = (quotation) => {
    setSelectedQuotation(quotation);
    setView("form");
  };

  const handleEditClick = (quotation, e) => {
    e.stopPropagation(); // Prevent row click from triggering
    setEditingQuotation(quotation);
  };

  const handleUpdateSuccess = (updatedQuotation) => {
    // Update the local state with the edited quotation
    setQuotations((prevQuotations) =>
      prevQuotations.map((quotation) =>
        quotation.quotation_id === updatedQuotation.quotation_id ? updatedQuotation : quotation
      )
    );
    setEditingQuotation(null);
  };

  return (
    <div className="purchquote">
      {view === "list" ? (
        <div className="purchquote-body-content-container">
          <div className="purchquote-header">
            <button className="purchquote-back" onClick={onBackToDashboard}>
              ← Back
            </button>
            
            <div className="purchquote-filters">
              <div 
                className="purchquote-date-filter"
                tabIndex={0}
                onClick={() => setShowDateDropdown((prev) => !prev)}
                onBlur={() => setShowDateDropdown(false)}
              >
                <div className="date-display">
                  <span>{selectedDate}</span>
                  <span>▼</span>
                </div>
                {showDateDropdown && (
                  <div className="date-options-dropdown">
                    {timeOptions.map((option) => (
                      <div
                        key={option}
                        className="date-option"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleDateOptionSelect(option);
                        }}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div 
                className="purchquote-status-filter"
                tabIndex={0}
                onClick={() => setShowStatusFilter((prev) => !prev)}
                onBlur={() => setShowStatusFilter(false)}
              >
                <div className="status-display">
                  <span>Filter by: {selectedStatus}</span>
                  <span>▼</span>
                </div>
                {showStatusFilter && (
                  <div className="purchquote-status-options-dropdown">
                    {statusOptions.map((status) => (
                      <div
                        key={status}
                        className="status-option"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleStatusSelect(status);
                        }}
                      >
                        {status}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="purchquote-search">
                <input
                  type="text"
                  placeholder="Search by Doc no., ID, Status, Date"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
            </div>
          </div>

          <div className="purchquote-content">
            <div className="purchquote-table-header">
              <div>Document No</div>
              <div>Quotation ID</div>
              <div>Status</div>
              <div>Document Date</div>
              <div>Actions</div>
            </div>
            <div className="purchquote-table-scrollable">
  <div className="purchquote-table-rows">
    {filteredQuotations.length > 0 ? (
      [...filteredQuotations]
        .sort((a, b) => {
          if (a.document_no < b.document_no) return -1;
          if (a.document_no > b.document_no) return 1;
          return 0;
        })
        .map((q) => (
          <div
            key={q.quotation_id}
            className="purchquote-row"
            onClick={() => handleRowClick(q)}
          >
            <div>{q.document_no}</div>
            <div>{q.quotation_id}</div>
            <div>
              <span className={`status-${q.status?.toLowerCase().replace(/\s+/g, "-")}`}>
                {q.status}
              </span>
            </div>
            <div>
              {q.document_date ? new Date(q.document_date).toLocaleDateString() : ""}
            </div>
            <div className="purchquote-actions">
              <button
                className="purchquote-edit-button"
                onClick={(e) => handleEditClick(q, e)}
              >
                Edit
              </button>
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
      ) : (
        <PurchForQuotForm
          onClose={() => setView("list")}
          request={selectedQuotation}
        />
      )}

      {/* Edit Modal */}
      {editingQuotation && (
        <PurchaseQuotEdit
          quotation={editingQuotation}
          onClose={() => setEditingQuotation(null)}
          onSuccess={handleUpdateSuccess}
        />
      )}
    </div>
  );
};

export default PurchaseQuotBody;