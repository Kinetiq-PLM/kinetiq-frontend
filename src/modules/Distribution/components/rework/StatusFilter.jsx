// components/rework/StatusFilter.jsx
import React from 'react';

const StatusFilter = ({ selectedStatus, onStatusChange, showCompleted }) => {
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
        
        {!showCompleted && (
          <>
            <button 
              className={`status-button pending ${selectedStatus === 'Pending' ? 'active' : ''}`}
              onClick={() => onStatusChange('Pending')}
            >
              Pending
            </button>
            <button 
              className={`status-button in-progress ${selectedStatus === 'In Progress' ? 'active' : ''}`}
              onClick={() => onStatusChange('In Progress')}
            >
              In Progress
            </button>
          </>
        )}
        
        {showCompleted && (
          <button 
            className={`status-button completed ${selectedStatus === 'Completed' ? 'active' : ''}`}
            onClick={() => onStatusChange('Completed')}
          >
            Completed
          </button>
        )}
      </div>
    </div>
  );
};

export default StatusFilter;