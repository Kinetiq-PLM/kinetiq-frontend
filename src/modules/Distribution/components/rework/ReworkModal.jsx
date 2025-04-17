// components/rework/ReworkModal.jsx
import React from 'react';
import { format } from 'date-fns';

const ReworkModal = ({ rework, employees, onClose, onAssign, onComplete }) => {
  // Function to get employee name from ID
  const getEmployeeName = (employeeId) => {
    if (!employeeId) return 'Unassigned';
    const employee = employees.find(emp => emp.employee_id === employeeId);
    return employee ? employee.full_name : employeeId;
  };
  
  // Function to format date with fallback
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return dateString;
    }
  };
  
  const isCompletable = rework.rework_status === 'In Progress';
  const isAssignable = rework.rework_status !== 'Completed';
  
  return (
    <div className="modal-overlay">
      <div className="rework-modal">
        <div className="modal-header">
          <h3>Rework Order Details</h3>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        
        <div className="modal-body">
          {/* Basic Info Section */}
          <div className="info-section">
            <h4>Rework Information</h4>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Rework ID</span>
                <span className="info-value">{rework.rework_id}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Status</span>
                <span className={`info-value status-${rework.rework_status}`}>
                  {rework.rework_status}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Type</span>
                <span className="info-value">{rework.rework_types}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Assigned To</span>
                <span className="info-value">{getEmployeeName(rework.assigned_to)}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Rework Date</span>
                <span className="info-value">{formatDate(rework.rework_date)}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Expected Completion</span>
                <span className="info-value">{formatDate(rework.expected_completion)}</span>
              </div>
            </div>
          </div>
          
          {/* Source Information Section */}
          <div className="info-section">
            <h4>Source Information</h4>
            {rework.rework_types === 'Rejection' && rework.rejection_info && (
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Rejection ID</span>
                  <span className="info-value">{rework.rejection_info.rejection_id}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Rejection Date</span>
                  <span className="info-value">{formatDate(rework.rejection_info.rejection_date)}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Rejection Status</span>
                  <span className="info-value">{rework.rejection_info.rejection_status}</span>
                </div>
                <div className="info-item full-width">
                  <span className="info-label">Rejection Reason</span>
                  <span className="info-value reason-text">{rework.rejection_info.rejection_reason}</span>
                </div>
              </div>
            )}
            
            {rework.rework_types === 'Failed Shipment' && rework.failed_shipment_info && (
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Failed Shipment ID</span>
                  <span className="info-value">{rework.failed_shipment_info.failed_shipment_id}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Failure Date</span>
                  <span className="info-value">{formatDate(rework.failed_shipment_info.failure_date)}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Resolution Status</span>
                  <span className="info-value">{rework.failed_shipment_info.resolution_status}</span>
                </div>
                <div className="info-item full-width">
                  <span className="info-label">Failure Reason</span>
                  <span className="info-value reason-text">{rework.failed_shipment_info.failure_reason}</span>
                </div>
              </div>
            )}
          </div>
          
          {/* Original Order Section */}
          {rework.original_order_info && (
            <div className="info-section">
              <h4>Original Order Information</h4>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Order ID</span>
                  <span className="info-value">{rework.original_order_info.order_id}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Order Date</span>
                  <span className="info-value">{formatDate(rework.original_order_info.order_date)}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Order Status</span>
                  <span className="info-value">{rework.original_order_info.order_status}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Order Total Amount</span>
                  <span className="info-value">₱{rework.original_order_info.order_total_amount?.toFixed(2) || 'N/A'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Customer ID</span>
                  <span className="info-value">{rework.original_order_info.customer_id}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Customer Name</span>
                  <span className="info-value">{rework.original_order_info.customer_name || 'N/A'}</span>
                </div>
              </div>
            </div>
          )}
          
          {/* Actions Section */}
          {rework.rework_status !== 'Completed' && (
            <div className="action-section">
              <h4>Actions</h4>
              <div className="action-buttons">
                <button 
                  className="action-button assign-button"
                  onClick={() => onAssign(rework)}
                  disabled={!isAssignable}
                >
                  {rework.assigned_to ? 'Reassign' : 'Assign'}
                </button>
                
                <button 
                  className="action-button complete-button"
                  onClick={() => onComplete(rework)}
                  disabled={!isCompletable}
                >
                  Mark as Completed
                </button>
              </div>
            </div>
          )}
          
          {/* Completed Message */}
          {rework.rework_status === 'Completed' && (
            <div className="completed-message">
              This rework has been completed.
            </div>
          )}
        </div>
        
        <div className="modal-footer">
          <button className="cancel-button" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default ReworkModal;