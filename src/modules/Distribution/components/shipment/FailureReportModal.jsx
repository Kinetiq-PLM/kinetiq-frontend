// components/shipment/FailureReportModal.jsx
import React, { useState } from 'react';

const FailureReportModal = ({ shipment, onSubmit, onCancel }) => {
  const [failureReason, setFailureReason] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ failure_reason: failureReason });
  };
  
  return (
    <div className="modal-overlay">
      <div className="failure-report-modal">
        <div className="modal-header">
          <h3>Report Shipment Failure</h3>
          <button className="close-button" onClick={onCancel}>&times;</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="info-section">
              <h4>Shipment Information</h4>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Shipment ID</span>
                  <span className="info-value">{shipment.shipment_id}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Tracking Number</span>
                  <span className="info-value">{shipment.tracking_number}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Current Status</span>
                  <span className={`info-value status-${shipment.shipment_status.toLowerCase()}`}>
                    {shipment.shipment_status}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="form-row" style={{ marginTop: '1rem' }}>
              <label className="form-label">Failure Reason:</label>
              <textarea
                className="form-textarea"
                value={failureReason}
                onChange={(e) => setFailureReason(e.target.value)}
                placeholder="Please provide a detailed explanation of why this shipment failed"
                required
              />
            </div>
            
            <div className="info-section" style={{ marginTop: '1rem' }}>
              <h4>What happens next?</h4>
              <ul>
                <li>The shipment status will be updated to "Failed"</li>
                <li>A failed shipment record will be created</li>
                <li>A rework order will be automatically generated</li>
                {shipment.delivery_type === 'External Delivery' && (
                  <li>If this is a sales order, the sales order will be linked to the rework order</li>
                )}
              </ul>
            </div>
          </div>
          
          <div className="modal-footer">
            <button 
              type="button" 
              className="cancel-button"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="danger-button"
              disabled={!failureReason.trim()}
            >
              Report Failure
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FailureReportModal;