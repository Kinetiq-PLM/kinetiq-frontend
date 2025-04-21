import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/PurchaseCredMemo.css";
import PurchaseCredMemoForm from "./PurchaseCredMemoForm";

const PurchaseCredMemoBody = () => {
  const [showForm, setShowForm] = useState(false);
  const [creditMemos, setCreditMemos] = useState([]);
  const [filteredMemos, setFilteredMemos] = useState([]);
  const [selectedMemo, setSelectedMemo] = useState(null);
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
    "Approved",
    "Pending",
    "Completed",
    "Rejected"
  ];

  const handleNewForm = () => setShowForm(true);
  const handleSendTo = () => alert("Send To feature not implemented yet.");

  // Add back button handler to toggle dashboard
  const handleBackToDashboard = () => {
    const event = new CustomEvent('purchasing-back-to-dashboard');
    window.dispatchEvent(event);
  };

  useEffect(() => {
    const fetchCreditMemos = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/credit-memo/list/");
        setCreditMemos(response.data);
        setFilteredMemos(response.data);
      } catch (error) {
        console.error("Error fetching credit memos:", error);
      }
    };

    fetchCreditMemos();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [selectedDate, selectedStatus, searchTerm, creditMemos]);

  const applyFilters = () => {
    let result = [...creditMemos];

    // Date filter
    if (selectedDate !== "All") {
      const days = parseInt(selectedDate.match(/\d+/)[0], 10);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      result = result.filter(memo => new Date(memo.document_date) >= cutoffDate);
    }

    // Status filter
    if (selectedStatus !== "All") {
      result = result.filter(memo => {
        if (selectedStatus === "Completed") {
          // Completed: status is 'Completed'
          return memo.status === "Completed";
        }
        return memo.status === selectedStatus;
      });
    }

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(memo => 
        (memo.credit_memo_id && memo.credit_memo_id.toString().toLowerCase().includes(term)) ||
        (memo.purchase_order && memo.purchase_order.toString().toLowerCase().includes(term)) ||
        (memo.document_date && memo.document_date.toString().toLowerCase().includes(term)) ||
        (memo.status && memo.status.toLowerCase().includes(term))
      );
    }

    setFilteredMemos(result);
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

  return (
    <div className="credmemo">
      {showForm ? (
        <PurchaseCredMemoForm onClose={() => setShowForm(false)} />
      ) : selectedMemo ? (
        <PurchaseCredMemoForm memoData={selectedMemo} onClose={() => setSelectedMemo(null)} />
      ) : (
        <div className="credmemo-body-content-container">
          <div className="credmemo-header">
            <button className="credmemo-back" onClick={handleBackToDashboard}>← Back</button>
            <div className="credmemo-filters" style={{ marginLeft: 'auto' }}>
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
              <div 
                className="credmemo-status-filter"
                onClick={() => setShowStatusFilter(!showStatusFilter)}
              >
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
              <div className="credmemo-search">
                <input 
                  type="text" 
                  placeholder="Search by Memo ID, PO..." 
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
            </div>
          </div>

          <div className="credmemo-content">
            <div className="credmemo-table-header">
              <div className="credmemo-checkbox"><input type="checkbox" /></div>
              <div>Credit Memo</div>
              <div>Ref: A/P Invoice</div>
              <div>Status</div>
              <div>Document Date</div>
              <div>Due Date</div>
            </div>
            <div className="credmemo-table-scrollable">
              <div className="credmemo-table-rows">
                {filteredMemos.length > 0 ? filteredMemos.map((memo) => (
                  <div key={memo.id} className="credmemo-row" onClick={() => setSelectedMemo(memo)}>
                    <div className="credmemo-checkbox"><input type="checkbox" /></div>
                    <div>{memo.credit_memo_id}</div>
                    <div>{memo.purchase_order}</div>
                    <div>
                      <span className={`status-${memo.status.toLowerCase()}`}>{memo.status}</span>
                    </div>
                    <div>{memo.document_date}</div>
                    <div>{memo.due_date}</div>
                  </div>
                )) : (
                  <div className="credmemo-no-data">No credit memos found matching your criteria</div>
                )}
              </div>
            </div>
          </div>

          <div className="credmemo-footer">
            <button className="credmemo-new-form" onClick={handleNewForm}>New Form</button>
            <div className="credmemo-footer-right">
              <button className="credmemo-send-to" onClick={handleSendTo}>Send to</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseCredMemoBody;