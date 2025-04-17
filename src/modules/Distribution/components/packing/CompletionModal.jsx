// components/packing/CompletionModal.jsx
import React from "react";

const CompletionModal = ({ packingList, onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay">
      <div className="completion-modal">
        <div className="modal-header">
          <h3>Confirm Packing Completion</h3>
        </div>
        
        <div className="modal-body">
          <p>
            You are about to mark this packing list as <strong>Packed</strong>.
          </p>
          
          <p>
            This action will:
          </p>
          <ul>
            <li>Update the packing list status to "Packed"</li>
            <li>Set today's date as the packing date</li>
            <li>Create a new shipment record for this package</li>
            <li>Create shipping cost and operational cost records</li>
          </ul>
          
          <p>
            <strong>This action cannot be undone.</strong> Are you sure you want to proceed?
          </p>
        </div>
        
        <div className="modal-footer">
          <button className="cancel-button" onClick={onCancel}>
            Cancel
          </button>
          <button className="confirm-button" onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompletionModal;