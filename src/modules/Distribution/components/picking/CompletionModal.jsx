// components/picking/CompletionModal.jsx
import React from 'react';
import '../../styles/Picking.css';

const CompletionModal = ({ pickingList, onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay">
      <div className="completion-modal">
        <div className="modal-header">
          <h3>Complete Picking List</h3>
        </div>
        
        <div className="modal-body">
          <p>
            Are you sure you want to mark this picking list as completed?
            This will automatically create a new packing list.
          </p>
          
          <div className="picking-details">
            <div className="detail-item">
              <span className="detail-label">Picking ID:</span>
              <span className="detail-value">{pickingList.picking_list_id}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Warehouse:</span>
              <span className="detail-value">{pickingList.warehouse_name || 'Unknown'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Items Count:</span>
              <span className="detail-value">{pickingList.items_count || 0}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Delivery Type:</span>
              <span className="detail-value">
                {pickingList.is_external ? 'External' : 'Internal'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="modal-footer">
          <button 
            className="cancel-button"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button 
            className="confirm-button"
            onClick={onConfirm}
          >
            Complete Picking
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompletionModal;