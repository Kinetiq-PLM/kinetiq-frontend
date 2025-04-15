// components/packing/StatusFilter.jsx
import React from "react";

const StatusFilter = ({ selectedStatus, onStatusChange }) => {
  return (
    <div className="filter-container">
      <span className="filter-label">Status:</span>
      <div className="status-buttons">
        <button
          className={`status-button ${selectedStatus === "All" ? "active" : ""}`}
          onClick={() => onStatusChange("All")}
        >
          All
        </button>
        <button
          className={`status-button pending ${selectedStatus === "Pending" ? "active" : ""}`}
          onClick={() => onStatusChange("Pending")}
        >
          Pending
        </button>
        <button
          className={`status-button packed ${selectedStatus === "Packed" ? "active" : ""}`}
          onClick={() => onStatusChange("Packed")}
        >
          Packed
        </button>
        <button
          className={`status-button shipped ${selectedStatus === "Shipped" ? "active" : ""}`}
          onClick={() => onStatusChange("Shipped")}
        >
          Shipped
        </button>
      </div>
    </div>
  );
};

export default StatusFilter;