// components/rework/CompleteModal.jsx
import React from 'react';

const CompleteModal = ({ rework, onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay">
      <div className="complete-modal">
        <div className="modal-header">
          <h3>Complete Rework</h3>
          <button className="close-button" onClick={onCancel}>&times;</button>
        </div>
        
        <div className="modal-body">
          <p>Are you sure you want to mark this rework as completed?</p>
          
          <div className="rework-info">
            <strong>Rework ID:</strong> {rework.rework_id}<br />
            <strong>Type:</strong> {rework.rework_types}<br />
            {rework.original_order_info && (
              <>
                <strong>Order ID:</strong> {rework.original_order_info.order_id}<br />
                <strong>Customer:</strong> {rework.original_order_info.customer_name || 'N/A'}
              </>
            )}
          </div>
          
          <p className="warning-text">
            This action cannot be undone. The rework will be marked as completed and moved to the completed reworks list.
          </p>
        </div>
        
        <div className="modal-footer">
          <button className="cancel-button" onClick={onCancel}>Cancel</button>
          <button className="confirm-button" onClick={onConfirm}>Complete Rework</button>
        </div>
      </div>
    </div>
  );
};

export default CompleteModal;