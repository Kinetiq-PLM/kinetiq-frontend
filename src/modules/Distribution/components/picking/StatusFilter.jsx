// components/picking/StatusFilter.jsx
import React from 'react';
import '../../styles/Picking.css';

const StatusFilter = ({ selectedStatus, onStatusChange }) => {
  const statuses = ['All', 'Not Started', 'In Progress', 'Completed'];
  
  return (
    <div className="filter-container">
      <span className="filter-label">Status:</span>
      <div className="status-buttons">
        {statuses.map(status => (
          <button
            key={status}
            className={`status-button ${selectedStatus === status ? 'active' : ''} ${status.toLowerCase().replace(' ', '-')}`}
            onClick={() => onStatusChange(status)}
          >
            {status}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StatusFilter;