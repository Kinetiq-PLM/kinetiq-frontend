import React from 'react';
import { 
  FaCheck, 
  FaWarehouse, 
  FaUser, 
  FaBoxes, 
  FaTruck, 
  FaInfoCircle, 
  FaListAlt,
  FaClipboardCheck,
  FaBox,
  FaArrowRight
} from 'react-icons/fa';
import '../../styles/Picking.css';

const CompletionModal = ({ pickingList, employees, warehouses, onConfirm, onCancel }) => {
  // Function to get employee name from ID
  const getEmployeeName = (employeeId) => {
    if (!employeeId) return 'Not assigned';
    const employee = employees.find(emp => emp.employee_id === employeeId);
    return employee ? employee.full_name : employeeId;
  };

  // Function to get warehouse name from ID
  const getWarehouseName = (warehouseId) => {
    // First try to use the name directly from the picking list if available
    if (pickingList.warehouse_name) return pickingList.warehouse_name;
    
    // Otherwise look up the name from the warehouses array
    if (!warehouseId) return 'Not assigned';
    const warehouse = warehouses?.find(wh => wh.id === warehouseId);
    return warehouse ? warehouse.name : warehouseId;
  };

  // Function to get delivery type icon
  const getDeliveryTypeIcon = () => {
    return pickingList.is_external ? <FaTruck className="icon-spacing" /> : <FaWarehouse className="icon-spacing" />;
  };

  return (
    <div className="picking modal-overlay" onClick={onCancel}>
      <div className="completion-modal improved" onClick={e => e.stopPropagation()} aria-labelledby="modal-title">
        <div className="modal-header">
          <h3 id="modal-title">
            <FaClipboardCheck className="title-icon" />
            Complete Picking List
          </h3>
          <button 
            className="close-button" 
            onClick={onCancel} 
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>
        
        <div className="modal-body">
          {/* Main confirmation message */}
          <div className="confirmation-banner">
            <div className="confirmation-icon">
              <FaInfoCircle />
            </div>
            <div className="confirmation-text">
              <p className="confirmation-message">
                Are you sure you want to mark this picking list as completed?
              </p>
              <p className="confirmation-submessage">
                This will automatically create a new packing list.
              </p>
            </div>
          </div>
          
          <div className="modal-content-scroll">
            {/* Picking list details section */}
            <div className="info-section">
              <h4 className="section-header">
                <FaListAlt className="icon-spacing" /> Picking List Details
              </h4>
              
              <div className="picking-details enhanced">
                <div className="detail-row">
                  <div className="detail-item">
                    <span className="detail-label">Picking ID</span>
                    <span className="detail-value highlight">{pickingList.picking_list_id}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Order ID</span>
                    <span className="detail-value">{pickingList.delivery_id || '-'}</span>
                  </div>
                </div>
                
                <div className="detail-row">
                  <div className="detail-item">
                    <span className="detail-label">Warehouse</span>
                    <div className="detail-value-with-icon">
                      <FaWarehouse className="detail-icon" />
                      {getWarehouseName(pickingList.warehouse_id)}
                    </div>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Assigned To</span>
                    <div className="detail-value-with-icon">
                      <FaUser className="detail-icon" />
                      {getEmployeeName(pickingList.picked_by)}
                    </div>
                  </div>
                </div>
                
                <div className="detail-row">
                  <div className="detail-item">
                    <span className="detail-label">Items Count</span>
                    <div className="detail-value-with-icon">
                      <FaBoxes className="detail-icon" />
                      <span className="count-badge">{pickingList.items_count || 0}</span>
                    </div>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Delivery Type</span>
                    <div className="detail-value-with-icon">
                      {getDeliveryTypeIcon()}
                      {pickingList.is_external ? 'External' : 'Internal'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* What happens next section */}
            <div className="info-section">
              <h4 className="section-header status-completed">
                <FaCheck className="icon-spacing" />
                What happens next?
              </h4>
              
              <div className="next-steps-container">
                <div className="next-step-item">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <FaClipboardCheck className="step-icon" />
                    <div className="step-text">The picking list status will be updated to "Completed"</div>
                  </div>
                </div>
                
                <div className="step-connector"></div>
                
                <div className="next-step-item">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <FaBox className="step-icon" />
                    <div className="step-text">A new packing list will be automatically created</div>
                  </div>
                </div>
                
                <div className="step-connector"></div>
                
                <div className="next-step-item">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <FaBoxes className="step-icon" />
                    <div className="step-text">All picked items will be added to the packing list</div>
                  </div>
                </div>
                
                <div className="step-connector"></div>
                
                <div className="next-step-item">
                  <div className="step-number">4</div>
                  <div className="step-content">
                    <FaArrowRight className="step-icon" />
                    <div className="step-text">You'll be able to track the order in the Packing module</div>
                  </div>
                </div>
              </div>
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
            Complete Picking
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompletionModal;