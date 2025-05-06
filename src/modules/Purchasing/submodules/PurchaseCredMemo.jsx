import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/PurchaseCredMemo.css";
import PurchaseCredMemoForm from "./PurchaseCredMemoForm";

const PurchaseCredMemoBody = ({ onBackToDashboard }) => {
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
    "All",
    "Last 30 days",
    "Last 20 days",
    "Last 10 days",
    "Last 3 days",
    "Last 1 day",
  ];
  const statusOptions = ["All", "Approved", "Under Review", "Forwarded"];


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

  useEffect(() => {
    const fetchCreditMemos = async () => {
      try {
        const response = await axios.get(
          "https://yi92cir5p0.execute-api.ap-southeast-1.amazonaws.com/dev/api/credit-memo/list/"
        );
        console.log("Credit Memos API Response:", response.data);
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
      const days = parseInt(selectedDate.match(/\d+/)[0], 10); // Extract the number of days from the selectedDate
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days); // Calculate the cutoff date
      console.log("Cutoff Date:", cutoffDate);

      result = result.filter((memo) => {
        if (!memo.document_date) {
          return true; // Include items with missing dates
        }
        return new Date(memo.document_date) >= cutoffDate;
      });
      console.log("After Date Filter:", result.length);
    }

    // Status filter
    if (selectedStatus !== "All") {
      result = result.filter((memo) => {
        if (selectedStatus === "Completed") {
          return memo.status === "Completed";
        }
        return memo.status === selectedStatus;
      });
      console.log("After Status Filter:", result.length);
    }

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (memo) =>
          (memo.credit_memo_id &&
            memo.credit_memo_id.toString().toLowerCase().includes(term)) ||
          (memo.invoice_id &&
            memo.invoice_id.toString().toLowerCase().includes(term)) ||
          (memo.document_date &&
            memo.document_date.toString().toLowerCase().includes(term)) ||
          (memo.status && memo.status.toLowerCase().includes(term))
      );
      console.log("After Search Filter:", result.length);
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
        <PurchaseCredMemoForm
          memoData={selectedMemo}
          onClose={() => setSelectedMemo(null)}
        />
      ) : (
        <div className="credmemo-body-content-container">
          <div className="credmemo-header">
            <button className="credmemo-back" onClick={handleBackToDashboard}>
              ← Back
            </button>
            <div className="credmemo-filters" style={{ marginLeft: "auto" }}>
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
                  placeholder="Search by Memo ID, Invoice ID..."
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
            </div>
          </div>

          <div className="credmemo-content">
            <div className="credmemo-table-header">
              <div>Credit Memo</div>
              <div>Invoice ID</div>
              <div>Status</div>
              <div>Document Date</div>
              <div>Due Date</div>
            </div>
            <div className="credmemo-table-scrollable">
              <div className="credmemo-table-rows">
                {filteredMemos.length > 0 ? (
                  filteredMemos.map((memo) => (
                    <div
                      key={memo.credit_memo_id}
                      className="credmemo-row"
                      onClick={() => setSelectedMemo(memo)}
                    >
                      <div>{memo.credit_memo_id}</div>
                      <div>{memo.invoice_id || "N/A"}</div>
                      <div>
                        <span
                          className={`status-${memo.status.toLowerCase()}`}
                        >
                          {memo.status}
                        </span>
                      </div>
                      <div>{memo.document_date}</div>
                      <div>{memo.due_date}</div>
                    </div>
                  ))
                ) : (
                  <div className="credmemo-no-data">
                    No credit memos found matching your criteria
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default PurchaseCredMemoBody;