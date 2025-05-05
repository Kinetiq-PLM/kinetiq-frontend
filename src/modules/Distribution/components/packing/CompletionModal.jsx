import React from "react";
import { 
  FaCheck, 
  FaUser, 
  FaBoxes, 
  FaTags, 
  FaMoneyBillWave, 
  FaInfoCircle, 
  FaShippingFast,
  FaBox,
  FaCalendarCheck,
  FaExclamationTriangle,
  FaArrowRight,
  FaClipboard
} from "react-icons/fa";
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
  
  // Check if this is a partial delivery
  const isPartialDelivery = !!(packingList.delivery_notes_info && packingList.delivery_notes_info.is_partial_delivery);
  
  // Get partial delivery info if available
  const currentDelivery = isPartialDelivery ? packingList.delivery_notes_info.current_delivery : null;
  const totalDeliveries = isPartialDelivery ? packingList.delivery_notes_info.total_deliveries : null;
  const currentDeliveryNotes = isPartialDelivery ? packingList.delivery_notes_info.current_delivery_notes : [];
  
  // Get delivery notes display if available
  const getDeliveryNotesDisplay = () => {
    if (!isPartialDelivery || !currentDeliveryNotes || currentDeliveryNotes.length === 0) {
      return null;
    }
    
    return (
      <div className="delivery-notes-section">
        <h5 className="notes-header">
          <FaClipboard className="notes-icon" /> 
          Delivery Notes Included in This Batch
        </h5>
        <div className="delivery-notes-list">
          {currentDeliveryNotes.map(noteId => (
            <div key={noteId} className="delivery-note-item">
              <span className="delivery-note-id">{noteId}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  return (
    <div className="packing modal-overlay" onClick={onCancel}>
      <div className="completion-modal improved" onClick={e => e.stopPropagation()} aria-labelledby="modal-title">
        <div className="modal-header">
          <h3 id="modal-title">
            <FaBoxes className="title-icon" /> 
            {isPartialDelivery
              ? `Confirm Packing Completion (Batch ${currentDelivery} of ${totalDeliveries})`
              : 'Confirm Packing Completion'}
          </h3>
          <button className="close-button" onClick={onCancel} aria-label="Close modal">&times;</button>
        </div>
        
        <div className="modal-content-wrapper">
          {/* Important alert banner */}
          <div className="alert-banner">
            <div className="alert-icon-container">
              <FaInfoCircle className="alert-icon" />
            </div>
            <div className="alert-content">
              <p className="alert-heading">
                You are about to mark this packing list as <strong>Packed</strong>
                {isPartialDelivery && (
                  <span> (Batch {currentDelivery} of {totalDeliveries})</span>
                )}
              </p>
              <p className="alert-message">
                This action will create a new shipment record
                {isPartialDelivery && ' for this partial delivery batch'}.
              </p>
            </div>
          </div>
          
          {/* Partial delivery alert */}
          {isPartialDelivery && (
            <div className="partial-delivery-alert">
              <FaExclamationTriangle className="alert-icon" />
              <div className="alert-text">
                <p className="alert-title">Partial Delivery in Progress</p>
                <p className="alert-message">
                  You are completing batch {currentDelivery} of {totalDeliveries}.
                  After this batch is shipped, the next batch will become available for picking.
                </p>
              </div>
            </div>
          )}
          
          <div className="modal-scrollable-content">
            {/* Packing list details section */}
            <div className="info-section">
              <h4 className="section-header">
                <FaBoxes className="icon-spacing" /> Packing Details
              </h4>
              
              <div className="details-container">
                <div className="detail-row">
                  <div className="detail-item">
                    <span className="detail-label">Packing ID</span>
                    <span className="detail-value highlight">{packingList.packing_list_id}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Items Count</span>
                    <div className="detail-value-with-icon">
                      <FaBoxes className="detail-icon" />
                      <span className="count-badge">
                        {packingList.total_items_packed || 0}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="detail-row">
                  <div className="detail-item">
                    <span className="detail-label">Assigned To</span>
                    <div className="detail-value-with-icon">
                      <FaUser className="detail-icon" />
                      {getEmployeeName(packingList.packed_by)}
                    </div>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Packing Type</span>
                    <div className="detail-value-with-icon">
                      <FaTags className="detail-icon" />
                      {getPackingTypeName(packingList.packing_type)}
                    </div>
                  </div>
                </div>
                
                {/* Display delivery notes if partial delivery */}
                {getDeliveryNotesDisplay()}
              </div>
            </div>
            
            {/* What happens next section */}
            <div className="info-section">
              <h4 className="section-header status-packed">
                <FaShippingFast className="icon-spacing" />
                What happens next?
              </h4>
              
              <div className="workflow-steps">
                <div className="workflow-step">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <div className="step-icon-container">
                      <FaCalendarCheck className="step-icon" />
                    </div>
                    <div className="step-description">
                      Update the packing list status to "Packed"
                    </div>
                  </div>
                </div>
                
                <div className="workflow-connector"></div>
                
                <div className="workflow-step">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <div className="step-icon-container">
                      <FaCalendarCheck className="step-icon" />
                    </div>
                    <div className="step-description">
                      Set today's date as the packing date
                    </div>
                  </div>
                </div>
                
                <div className="workflow-connector"></div>
                
                <div className="workflow-step">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <div className="step-icon-container">
                      <FaBox className="step-icon" />
                    </div>
                    <div className="step-description">
                      {isPartialDelivery 
                        ? `Create a new shipment record for batch ${currentDelivery}`
                        : 'Create a new shipment record for this package'}
                    </div>
                  </div>
                </div>
                
                {isPartialDelivery && (
                  <>
                    <div className="workflow-connector"></div>
                    <div className="workflow-step">
                      <div className="step-number">4</div>
                      <div className="step-content">
                        <div className="step-icon-container">
                          <FaArrowRight className="step-icon" />
                        </div>
                        <div className="step-description">
                          After shipping, the next batch will become available
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {/* Warning message */}
            <div className="warning-section">
              <FaExclamationTriangle className="warning-icon" />
              <p className="warning-text">
                <strong>This action cannot be undone.</strong> Are you sure you want to proceed?
              </p>
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
            <FaCheck className="button-icon" />
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompletionModal;