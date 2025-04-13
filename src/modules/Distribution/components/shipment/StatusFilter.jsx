// components/shipment/StatusFilter.jsx
import React from 'react';

const StatusFilter = ({ selectedStatus, onStatusChange }) => {
  return (
    <div className="filter-container">
      <span className="filter-label">Status:</span>
      
      <div className="status-buttons">
        <button
          className={`status-button ${selectedStatus === 'All' ? 'active' : ''}`}
          onClick={() => onStatusChange('All')}
        >
          All
        </button>
        
        <button
          className={`status-button pending ${selectedStatus === 'Pending' ? 'active' : ''}`}
          onClick={() => onStatusChange('Pending')}
        >
          Pending
        </button>
        
        <button
          className={`status-button shipped ${selectedStatus === 'Shipped' ? 'active' : ''}`}
          onClick={() => onStatusChange('Shipped')}
        >
          Shipped
        </button>
        
        <button
          className={`status-button delivered ${selectedStatus === 'Delivered' ? 'active' : ''}`}
          onClick={() => onStatusChange('Delivered')}
        >
          Delivered
        </button>
        
        <button
          className={`status-button failed ${selectedStatus === 'Failed' ? 'active' : ''}`}
          onClick={() => onStatusChange('Failed')}
        >
          Failed
        </button>
      </div>
    </div>
  );
};

export default StatusFilter;