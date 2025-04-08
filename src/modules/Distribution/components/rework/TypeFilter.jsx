// components/rework/TypeFilter.jsx
import React from 'react';

const TypeFilter = ({ selectedType, onTypeChange }) => {
  return (
    <div className="filter-container">
      <span className="filter-label">Type:</span>
      <select 
        className="filter-select"
        value={selectedType}
        onChange={(e) => onTypeChange(e.target.value)}
      >
        <option value="All">All Types</option>
        <option value="Rejection">Rejection</option>
        <option value="Failed Shipment">Failed Shipment</option>
      </select>
    </div>
  );
};

export default TypeFilter;