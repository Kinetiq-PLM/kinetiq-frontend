import React, { useState, useEffect } from 'react';
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
  FaArrowRight,
  FaFileAlt,
  FaExclamationCircle
} from 'react-icons/fa';
import '../../styles/Picking.css';

const CompletionModal = ({ pickingList, employees, warehouses, onConfirm, onCancel }) => {
  const [deliveryNotesInfo, setDeliveryNotesInfo] = useState(null);
  
  // Fetch delivery notes info when the modal opens, if this is a sales order
  useEffect(() => {
    if (pickingList && pickingList.delivery_type === 'sales') {
      fetchDeliveryNotesInfo(pickingList.delivery_id);
    }
  }, [pickingList]);
  
  // Function to fetch delivery notes info
  const fetchDeliveryNotesInfo = async (orderID) => {
    if (!orderID) return;
    
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/delivery-notes/order/${orderID}/`);
      
      if (response.ok) {
        const data = await response.json();
        setDeliveryNotesInfo(data);
      } else {
        console.error('Failed to fetch delivery notes info');
      }
    } catch (error) {
      console.error('Error fetching delivery notes info:', error);
    }
  };
  
  // Function to get employee name from ID
  const getEmployeeName = (employeeId) => {
    if (!employeeId) return 'Not assigned';
    const employee = employees.find(emp => emp.employee_id === employeeId);
    return employee ? employee.full_name : employeeId;
  };

  // Function to get warehouse name from ID
  const getWarehouseName = (warehouseId) => {
    if (pickingList.warehouse_name) return pickingList.warehouse_name;
    
    if (!warehouseId) return 'Not assigned';
    const warehouse = warehouses?.find(wh => wh.id === warehouseId);
    return warehouse ? warehouse.name : warehouseId;
  };

  // Function to get delivery type icon
  const getDeliveryTypeIcon = () => {
    return pickingList.is_external ? <FaTruck className="icon-spacing" /> : <FaWarehouse className="icon-spacing" />;
  };
  
  // Check if this is a partial delivery
  const isPartialDelivery = deliveryNotesInfo && deliveryNotesInfo.is_partial_delivery;
  
  // Get current delivery info for partial deliveries
  const currentDelivery = isPartialDelivery ? deliveryNotesInfo.current_delivery : null;
  const totalDeliveries = isPartialDelivery ? deliveryNotesInfo.total_deliveries : null;

  return (
    <div className="picking modal-overlay" onClick={onCancel}>
      <div className="completion-modal improved" onClick={e => e.stopPropagation()} aria-labelledby="modal-title">
        <div className="modal-header">
          <h3 id="modal-title">
            <FaClipboardCheck className="title-icon" />
            Complete Picking List
            {isPartialDelivery && (
              <span className="partial-delivery-badge">
                Partial Delivery {currentDelivery} of {totalDeliveries}
              </span>
            )}
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
                This will automatically create a new packing list
                {isPartialDelivery && ' for this partial delivery'}.
              </p>
            </div>
          </div>
          
          {/* Partial delivery info */}
          {isPartialDelivery && (
            <div className="partial-delivery-alert">
              <FaExclamationCircle className="alert-icon" />
              <div className="alert-text">
                <p className="alert-title">Partial Delivery in Progress</p>
                <p className="alert-message">
                  You are completing delivery {currentDelivery} of {totalDeliveries}.
                  After this delivery is shipped, the next one will become available for picking.
                </p>
              </div>
            </div>
          )}
          
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
                      <span className="count-badge">{pickingList.items_details?.length || 0}</span>
                    </div>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Delivery Type</span>
                    <div className="detail-value-with-icon">
                      {getDeliveryTypeIcon()}
                      {pickingList.is_external ? 'External' : 'Internal'} - 
                      {pickingList.delivery_type === 'sales' ? ' Sales Order' : 
                       pickingList.delivery_type === 'service' ? ' Service Order' : 
                       pickingList.delivery_type === 'content' ? ' Content' : 
                       pickingList.delivery_type === 'stock' ? ' Stock Transfer' : ''}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Notes Information */}
            {pickingList.picking_items && pickingList.picking_items.some(item => item.delivery_note_id) && (
              <div className="detail-row">
                <div className="detail-item full-width">
                  <span className="detail-label">Delivery Notes</span>
                  <div className="detail-value-list">
                    {Array.from(new Set(
                      pickingList.picking_items
                        .filter(item => item.delivery_note_id)
                        .map(item => item.delivery_note_id)
                    )).map(noteId => (
                      <span key={noteId} className="delivery-note-badge">
                        <FaFileAlt className="delivery-note-badge-icon" />
                        {noteId}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

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
                    <div className="step-text">
                      {isPartialDelivery 
                        ? 'After shipping, the next partial delivery will be ready for picking'
                        : 'You\'ll be able to track the order in the Packing module'}
                    </div>
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