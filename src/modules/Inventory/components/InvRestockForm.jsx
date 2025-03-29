import React, { useState, useEffect } from "react";
import "../styles/InvRestockForm.css";

const InvRestockForm = ({ onClose, selectedItem }) => {
  const [itemId, setItemId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [managerId, setManagerId] = useState("");
  const [productDescription, setProductDescription] = useState("");

  useEffect(() => {
    if (selectedItem) {
      // Use the item_id instead of product_id when populating the form
      setItemId(selectedItem.item_id || "");
    }
  }, [selectedItem]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting Restock Request:", {
      itemId,
      quantity,
      managerId,
      productDescription,
    });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Restock Request Form</h2>
          <button onClick={onClose} className="close-btn">
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <label>Product Id</label>
          <input
            type="text"
            placeholder="Enter Item Id"
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

          <label>Manager ID / Employee ID</label>
          <input
            type="text"
            placeholder="Enter Manager ID"
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
