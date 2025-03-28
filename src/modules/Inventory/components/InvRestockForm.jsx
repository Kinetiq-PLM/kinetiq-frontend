import React, { useState, useEffect } from "react";
import "../styles/InvRestockForm.css";

const InvRestockForm = ({ onClose, selectedItem }) => {
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [managerId, setManagerId] = useState("");
  const [warehouse, setWarehouse] = useState("");

  useEffect(() => {
    if (selectedItem) {
      setProductId(selectedItem.item_id || "");
    }
  }, [selectedItem]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting Restock Request:", {
      productId,
      quantity,
      managerId,
      warehouse,
    });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Restock Request Form</h2>
          <button onClick={onClose} className="close-btn">✕</button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <label>Product Id</label>
          <input
            type="text"
            placeholder="Enter Product Id"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
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

          <label>Warehouse Destination</label>
          <select
            value={warehouse}
            onChange={(e) => setWarehouse(e.target.value)}
          >
            <option value="">Please Select Warehouse</option>
            <option value="Warehouse A">Warehouse A</option>
            <option value="Warehouse B">Warehouse B</option>
          </select>

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
