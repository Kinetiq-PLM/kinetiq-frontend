import React from "react";
import "../styles/InvRestockForm.css";

const InvRestockForm = ({ onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Restock Request Form</h2>
          <button onClick={onClose} className="close-btn">✕</button>
        </div>

        {/* Form */}
        <form>
          <label>Product Id</label>
          <input type="text" placeholder="Enter Product Id" />

          <label>Request Quantity</label>
          <input type="number" placeholder="Enter Quantity" />

          <label>Manager ID / Employee ID</label>
          <input type="text" placeholder="Enter Manager ID" />        

          <label>Warehouse Destination</label>
          <select>
            <option>Please Select Warehouse</option>
            <option>Warehouse A</option>
            <option>Warehouse B</option>
          </select>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="clear-btn">Clear Forms</button>
            <button type="submit" onClick={onClose} className="submit-btn">Submit Forms</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvRestockForm;
