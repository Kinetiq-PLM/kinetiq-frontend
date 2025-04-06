import React, { useState, useEffect } from "react";
import "../styles/InvPcountForm.css";

const InvPcountForm = ({ onClose, selectedItem, activeTab }) => {
  const [quantity, setQuantity] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [purchaseDescription, setPurchaseDescription] = useState("");
  const [purchaseItem, setPurchaseItem] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Generate a request ID with prefix
  const generateRequestId = () => {
    const prefix = activeTab === "Assets" ? "ASST-" : "MAT-";
    return `${prefix}${Date.now()}`;
  };

  useEffect(() => {
    if (selectedItem) {
      setPurchaseItem(selectedItem.product_data || "");  
      setQuantity(selectedItem.item_actually_counted || "");
      setEmployeeId(selectedItem.employee || "");
    } else {
      setPurchaseItem("");
      setQuantity("");
      setEmployeeId("");
      setPurchaseDescription("");
    }
  }, [selectedItem, activeTab]);
  
  const handleClear = () => {
    setQuantity("");
    setEmployeeId("");
    setPurchaseDescription("");
    if (selectedItem) {
      if (activeTab === "Assets") {
        setPurchaseItem(selectedItem.asset_id || selectedItem.Name || "");
      } else if (activeTab === "Raw Materials") {
        setPurchaseItem(selectedItem.material_id || selectedItem.Name || "");
      } else {
        setPurchaseItem(selectedItem.product_name || selectedItem.item_id || "");
      }
    } else {
      setPurchaseItem("");
    }
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
  
    if (!selectedItem) {
      setErrorMessage("No item selected. Please select an item first.");
      return;
    }
  
    if (!quantity || !employeeId) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }
  
    const requestData = {
      request_id: "REQ-" + Date.now(), 
      employee_id: employeeId,
      item_id: purchaseItem,
      purchase_quantity: quantity,
      purchase_description: purchaseDescription
    };
  
    if (activeTab === "Assets") {
      requestData.asset_id = selectedItem.asset_id;
    } else if (activeTab === "Raw Materials") {
      requestData.material_id = selectedItem.material_id;
    }
  
    try {
      const response = await fetch("http://127.0.0.1:8000/api/purchase-requests/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });
  
      if (!response.ok) {
        const clonedResponse = response.clone();
        let errorDetails = "";
  
        try {
          const errorData = await response.json();
          errorDetails = errorData.detail || JSON.stringify(errorData);
        } catch {
          const textData = await clonedResponse.text();
          if (textData.includes("<!DOCTYPE") || textData.includes("<html")) {
            errorDetails = "Server error occurred";
          } else {
            errorDetails = textData.slice(0, 200) + "...";
          }
        }
        throw new Error(`Submission failed: ${errorDetails || "Unexpected error."}`);
      }
  
      const data = await response.json();
      console.log("Successfully submitted purchase request:", data);
      setSuccessMessage("Purchase request submitted successfully!");
      
      // Optionally reset the form fields after successful submission
      setQuantity("");
      setEmployeeId("");
      setPurchaseDescription("");
      
      setTimeout(() => onClose(), 2000);
    } catch (error) {
      console.error("Error submitting purchase request:", error);
      setErrorMessage(error.message || "An unexpected error occurred.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Add P-counts Form</h2>
          <button onClick={onClose} className="close-btn">✕</button>
        </div>

        {successMessage && (
          <p style={{ color: "green", marginBottom: "1rem" }}>
            {successMessage}
          </p>
        )}
        {errorMessage && (
          <p style={{ color: "red", marginBottom: "1rem" }}>
            {errorMessage}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <label>Inventory Item ID</label>
          <input
            type="text"
            value={purchaseItem}
            onChange={(e) => setPurchaseItem(e.target.value)}
            readOnly={!!selectedItem}
            className={selectedItem ? "bg-gray-100" : ""}
          />

          <label>Physical Count <span className="text-red-500">*</span></label>
          <input
            type="number"
            placeholder="Enter Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />

          <label>Employee ID <span className="text-red-500">*</span></label>
          <input
            type="text"
            placeholder="Enter Employee ID"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            required
          />

          <label>Remarks</label>
          <textarea
            placeholder="Enter Remarks"
            value={purchaseDescription} 
            onChange={(e) => setPurchaseDescription(e.target.value)}
            rows="4"
          />

          <div className="form-actions">
            <button
              type="button"
              onClick={handleClear}
              className="clear-btn"
            >
              Clear Forms
            </button>
            <button type="submit" className="submit-btn">
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvPcountForm;
