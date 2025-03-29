import React, { useState, useEffect } from "react";
import "../styles/InvRestockForm.css";

const InvRestockForm = ({ onClose, selectedItem }) => {
  const [itemId, setItemId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [managerId, setManagerId] = useState("");
  const [productDescription, setProductDescription] = useState("");

  useEffect(() => {
    if (selectedItem) {
      setItemId(String(selectedItem.material_id || ""));
    }
  }, [selectedItem]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newRequest = {
      request_id: 'REQ-' + Date.now(), 
      employee_id: managerId,          
      item_id: itemId,                 
      purchase_quantity: quantity,
      purchase_description: productDescription
    };
    

    try {
      const response = await fetch("http://127.0.0.1:8000/api/purchase-requests/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRequest),
      });

      if (!response.ok) {
        throw new Error("Failed to submit purchase request");
      }

      const data = await response.json();
      console.log("Successfully submitted purchase request:", data);
      onClose(); 
    } catch (error) {
      console.error("Error submitting purchase request:", error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Restock Request Form</h2>
          <button onClick={onClose} className="close-btn">✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <label>Item ID</label>
          <input
            type="text"
            placeholder="Enter numeric item_id"
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
            <button type="button" onClick={onClose} className="clear-btn">
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
