// components/picking/WarehouseFilter.jsx
import React from 'react';
import '../../styles/Picking.css';

const WarehouseFilter = ({ warehouses, selectedWarehouse, onWarehouseChange }) => {
  return (
    <div className="filter-container">
      <span className="filter-label">Warehouse:</span>
      <select
        className="warehouse-filter"
        value={selectedWarehouse}
        onChange={(e) => onWarehouseChange(e.target.value)}
      >
        <option value="All">All Warehouses</option>
        {warehouses.map(warehouse => (
          <option key={warehouse.id} value={warehouse.id}>
            {warehouse.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default WarehouseFilter;