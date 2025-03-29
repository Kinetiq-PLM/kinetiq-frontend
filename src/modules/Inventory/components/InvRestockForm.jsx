import React, { useState, useEffect } from "react";
import "../styles/InvRestockForm.css";

const InvRestockForm = ({ onClose, selectedItem, activeTab }) => {
  const [itemId, setItemId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [managerId, setManagerId] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Decide label for itemId based on tab
  const itemIdLabel = activeTab === "Assets" ? "Asset ID" : "Material ID";

  // Sync itemId with the selected item
  useEffect(() => {
    if (!selectedItem) {
      setItemId("");
      return;
    }
    if (activeTab === "Assets") {
      setItemId(String(selectedItem.asset_id || ""));
    } else if (activeTab === "Raw Materials") {
      setItemId(String(selectedItem.material_id || ""));
    } else {
      setItemId("");
    }
  }, [selectedItem, activeTab]);

  const handleClear = () => {
    setItemId("");
    setQuantity("");
    setManagerId("");
    setProductDescription("");
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const newRequest = {
      request_id: "REQ-" + Date.now(),
      employee_id: managerId,
      item_id: itemId,
      purchase_quantity: quantity,
      purchase_description: productDescription,
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/api/purchase-requests/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRequest),
      });

      if (!response.ok) {
        const clonedResponse = response.clone();
        let errorDetails = "";

        try {
          const errorData = await response.json();
          errorDetails =
            errorData.item_id ||
            errorData.detail ||
            JSON.stringify(errorData);
        } catch {

          const textData = await clonedResponse.text();

          if (textData.includes("<!DOCTYPE") || textData.includes("<html")) {
            errorDetails = "";
          } else {
      
            errorDetails = textData.slice(0, 200) + "...";
          }
        }

        throw new Error(`Submission failed: ${errorDetails || "Unexpected error."}`);
      }

      
      const data = await response.json();
      console.log("Successfully submitted purchase request:", data);
      setSuccessMessage("Purchase request submitted successfully!");
      
      setQuantity("");
      setManagerId("");
      setProductDescription("");
      
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
          <h2 className="text-xl font-semibold">Restock Request Form</h2>
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
          <label>{itemIdLabel}</label>
          <input
            type="text"
            placeholder={`Enter ${itemIdLabel}`}
            value={itemId}
            onChange={(e) => setItemId(e.target.value)}
          />

          <label>Request Quantity</label>
          <input
            type="number"
            placeholder="Enter Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />

          <label>Manager (Employee) ID</label>
          <input
            type="text"
            placeholder="Enter Employee ID"
            value={managerId}
            onChange={(e) => setManagerId(e.target.value)}
          />

          <label>Product Description</label>
          <textarea
            placeholder="Enter product description"
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
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
              Submit Forms
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvRestockForm;
