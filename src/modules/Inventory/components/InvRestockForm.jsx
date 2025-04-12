import React, { useState, useEffect } from "react";
import "../styles/InvRestockForm.css";

const InvRestockForm = ({ onClose, selectedItem, activeTab }) => {
  const [quantity, setQuantity] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [purchaseDescription, setPurchaseDescription] = useState("");
  const [purchaseItem, setPurchaseItem] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (selectedItem) {
      if (activeTab === "Assets") {
        setPurchaseItem(selectedItem.asset_id || "");
      } else if (activeTab === "Raw Materials") {
        setPurchaseItem(selectedItem.material_id || "");
      }
    } else {
      setPurchaseItem("");
    }
  }, [selectedItem, activeTab]);
  
  const handleClear = () => {
    setQuantity("");
    setEmployeeId("");
    setPurchaseDescription("");
    if (selectedItem) {
      if (activeTab === "Assets") {
        setPurchaseItem(selectedItem.asset_id || "");
      } else if (activeTab === "Raw Materials") {
        setPurchaseItem(selectedItem.material_id || "");
      }
    } else {
      setPurchaseItem("");
    }
    setErrorMessage("");
    setSuccessMessage("");
  };

  const getItemLabel = () => {
    if (activeTab === "Assets") {
      return "Asset ID";
    } else if (activeTab === "Raw Materials") {
      return "Material ID";
    }
    return "Item ID";
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
    
    try {
      const purchaseRequestData = {
        employee_id: employeeId
      };
  
      const requestResponse = await fetch("http://127.0.0.1:8000/api/purchase-requests/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(purchaseRequestData),
      });
  
      if (!requestResponse.ok) {
        throw new Error(`Failed to create purchase request: ${await requestResponse.text()}`);
      }
  
      const requestData = await requestResponse.json();
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const quotationContentData = {
        request: requestData.request_id,
        purchase_quantity: quantity,
        unit_price: 0,
        discount: 0,
        total: 0
      };
  
      if (activeTab === "Assets") {
        quotationContentData.asset = selectedItem.asset_id;
      } else if (activeTab === "Raw Materials") {
        quotationContentData.material = selectedItem.material_id;
      }
  
      const quotationContentResponse = await fetch("http://127.0.0.1:8000/api/quotation-contents/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quotationContentData),
      });
  
      if (!quotationContentResponse.ok) {
        throw new Error(`Failed to create quotation content: ${await quotationContentResponse.text()}`);
      }
      
      console.log("Successfully submitted purchase request and quotation content");
      setSuccessMessage("Purchase request submitted successfully!");
      
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
          <label>{getItemLabel()}</label>
          <input
            type="text"
            value={purchaseItem}
            onChange={(e) => setPurchaseItem(e.target.value)}
            readOnly={!!selectedItem}
            className={selectedItem ? "bg-gray-100" : ""}
          />

          <label>Request Quantity <span className="text-red-500">*</span></label>
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

          <label>Item Description</label>
          <textarea
            placeholder="Enter item description"
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

export default InvRestockForm;