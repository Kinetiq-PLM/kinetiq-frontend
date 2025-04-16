import React from "react";
import { FaCheck, FaUser, FaBoxes, FaTags, FaMoneyBillWave, FaInfoCircle, FaShippingFast } from "react-icons/fa";
import "../../styles/Packing.css";

const CompletionModal = ({ packingList, employees, packingTypes, onConfirm, onCancel }) => {
  // Function to get employee name from ID
  const getEmployeeName = (employeeId) => {
    if (!employeeId) return 'Not assigned';
    const employee = employees.find(emp => emp.employee_id === employeeId);
    return employee ? employee.full_name : employeeId;
  };

  // Function to get packing type name from ID
  const getPackingTypeName = (typeId) => {
    if (!typeId) return 'Not specified';
    const packingType = packingTypes.find(type => type.id === typeId);
    return packingType ? packingType.name : typeId;
  };
  
  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(value || 0);
  };
  
  return (
    <div className="packing modal-overlay">
      <div className="completion-modal">
        <div className="modal-header">
          <h3>
            <FaBoxes className="icon-spacing" /> Confirm Packing Completion
          </h3>
          <button className="close-button" onClick={onCancel}>&times;</button>
        </div>
        
        <div className="modal-body">
          {/* Main confirmation message */}
          <div className="info-section">
            <div className="icon-message">
              <FaInfoCircle className="info-icon" />
              <p className="confirmation-message">
                You are about to mark this packing list as <strong>Packed</strong>.
              </p>
            </div>
          </div>
          
          {/* Packing list details section */}
          <div className="info-section">
            <h4 className="section-header">
              <FaBoxes className="icon-spacing" /> Packing Details
            </h4>
            
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Packing ID:</span>
                <span className="detail-value highlight">{packingList.packing_list_id}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">
                  <FaUser className="icon-spacing" /> Assigned To:
                </span>
                <span className="detail-value">{getEmployeeName(packingList.packed_by)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">
                  <FaTags className="icon-spacing" /> Packing Type:
                </span>
                <span className="detail-value">{getPackingTypeName(packingList.packing_type)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">
                  <FaBoxes className="icon-spacing" /> Items Count:
                </span>
                <span className="detail-value">{packingList.total_items_packed || 0}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">
                  <FaMoneyBillWave className="icon-spacing" /> Total Cost:
                </span>
                <span className="detail-value">{formatCurrency(packingList.total_packing_cost)}</span>
              </div>
            </div>
          </div>
          
          {/* What happens next section */}
          <div className="info-section">
            <h4 className="section-header status-packed">
              <FaShippingFast className="icon-spacing" />
              What happens next?
            </h4>
            <ul className="next-steps-list">
              <li>Update the packing list status to "Packed"</li>
              <li>Set today's date as the packing date</li>
              <li>Create a new shipment record for this package</li>
              <li>Create shipping cost and operational cost records</li>
            </ul>
            
            <p className="warning-note">
              <strong>This action cannot be undone.</strong> Are you sure you want to proceed?
            </p>
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
            <FaCheck className="button-icon" />
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompletionModal;