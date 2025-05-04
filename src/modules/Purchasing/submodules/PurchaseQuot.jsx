import React, { useState, useEffect } from "react";
import "../styles/PurchaseQuot.css";
import PurchForQuotForm from "./PurchForQuotForm";
import PurchaseQuotEdit from "./PurchaseQuotEdit"; // Import the edit component

const PurchaseQuotBody = ({ onBackToDashboard }) => {
  const [quotations, setQuotations] = useState([]);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [editingQuotation, setEditingQuotation] = useState(null); // State for the quotation being edited
  const [view, setView] = useState("list");

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
    {quotations.length > 0 ? (
      [...quotations]
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