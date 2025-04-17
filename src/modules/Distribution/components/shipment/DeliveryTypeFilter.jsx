// components/shipment/DeliveryTypeFilter.jsx
import React from 'react';

const DeliveryTypeFilter = ({ selectedType, onTypeChange }) => {
  return (
    <div className="filter-container">
      <span className="filter-label">Delivery Type:</span>
      
      <select 
        className="filter-select"
        value={selectedType}
        onChange={(e) => onTypeChange(e.target.value)}
      >
        <option value="All">All Types</option>
        <option value="Internal Delivery">Internal</option>
        <option value="External Delivery">External</option>
      </select>
    </div>
  );
};

export default DeliveryTypeFilter;