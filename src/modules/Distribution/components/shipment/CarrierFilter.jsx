// components/shipment/CarrierFilter.jsx
import React from 'react';

const CarrierFilter = ({ carriers, employees, selectedCarrier, onCarrierChange, getEmployeeFullName }) => {
  return (
    <div className="filter-container">
      <span className="filter-label">Carrier:</span>
      
      <select 
        className="filter-select"
        value={selectedCarrier}
        onChange={(e) => onCarrierChange(e.target.value)}
      >
        <option value="All">All Carriers</option>
        
        {carriers.map(carrier => (
          <option key={carrier.carrier_id} value={carrier.carrier_id}>
            {getEmployeeFullName(carrier.carrier_name)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CarrierFilter;