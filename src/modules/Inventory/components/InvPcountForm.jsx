import React, { useState, useEffect } from "react";
import "../styles/InvPcountForm.css";

const InvPcountForm = ({ onClose, selectedItem }) => {
  const [inventoryItemId, setInventoryItemId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [status, setStatus] = useState("");
  const [timePeriod, setTimePeriod] = useState("");
  const [warehouse, setWarehouse] = useState("");
  const [remarks, setRemarks] = useState("");

  // Success/error messages
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Prefill fields from selectedItem if available
  useEffect(() => {
    if (selectedItem) {
      setInventoryItemId(selectedItem.inventory_item_id || "");
      setQuantity(selectedItem.item_actually_counted || "");
      setEmployeeId(selectedItem.employee_id || "");
      setStatus(selectedItem.status || "");
      setTimePeriod(selectedItem.time_period || "");
      setWarehouse(selectedItem.warehouse || "");
      setRemarks(selectedItem.remarks || "");
    } else {
      handleClear();
    }
  }, [selectedItem]);

  // Clear all form fields
  const handleClear = () => {
    setInventoryItemId("");
    setQuantity("");
    setEmployeeId("");
    setStatus("");
    setTimePeriod("");
    setWarehouse("");
    setRemarks("");
    setSuccessMessage("");
    setErrorMessage("");
  };

  // Submit form to create a new row in inventory_cyclic_counts
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // Basic validation
    if (
      !inventoryItemId ||
      !quantity ||
      !employeeId ||
      !status ||
      !timePeriod ||
      !warehouse
    ) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    // Define item_onhand (defaulting to 0 if not provided) and compute difference_in_qty
    const itemOnHand = 0; // Default value; update if available from selectedItem
    const actualCounted = Number(quantity);
    const diffQty = itemOnHand - actualCounted;

    // Build request payload
    const newRecord = {
      inventory_item_id: inventoryItemId,
      item_onhand: itemOnHand,
      item_actually_counted: actualCounted,
      difference_in_qty: diffQty,
      employee_id: employeeId,
      status: status,
      time_period: timePeriod,
      remarks: remarks,
      warehouse: warehouse,
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/api/cyclic_counts/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRecord),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to insert record: ${errorText}`);
      }

      const data = await response.json();
      console.log("Successfully inserted new record:", data);
      setSuccessMessage("Successfully inserted new record!");

      // Optionally clear the form or close the modal after success
      setTimeout(() => {
        handleClear();
        onClose();
      }, 1500);
    } catch (err) {
      console.error("Error inserting record:", err);
      setErrorMessage(err.message || "An unexpected error occurred.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* Header */}
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">Add P-count</h2>
          <button onClick={onClose} className="close-btn">
            ✕
          </button>
        </div>

        {/* Success / Error messages */}
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

        {/* Form Fields */}
        <form onSubmit={handleSubmit}>
          <label>
            Inventory Item ID <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter Inventory Item ID"
            value={inventoryItemId}
            onChange={(e) => setInventoryItemId(e.target.value)}
            required
          />

          <label>
            Physical Count <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            placeholder="Enter Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />

          <label>
            Employee ID <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter Employee ID"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            required
          />

          <label>
            Status <span className="text-red-500">*</span>
          </label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} required>
            <option value="">Select Status</option>
            <option value="Completed">Completed</option>
            <option value="In Progress">In Progress</option>
            <option value="Open">Open</option>
            <option value="Closed">Closed</option>
          </select>

          <label>
            Time Period <span className="text-red-500">*</span>
          </label>
          <select
            value={timePeriod}
            onChange={(e) => setTimePeriod(e.target.value)}
            required
          >
            <option value="">Select Time Period</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
          </select>

          <label>
            Warehouse <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter Warehouse"
            value={warehouse}
            onChange={(e) => setWarehouse(e.target.value)}
            required
          />

          <label>Remarks</label>
          <textarea
            placeholder="Enter Remarks"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            rows="3"
          />

          {/* Buttons */}
          <div className="form-actions">
            <button type="button" onClick={handleClear} className="clear-btn">
              Clear
            </button>
            <button type="submit" className="submit-btn">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvPcountForm;
