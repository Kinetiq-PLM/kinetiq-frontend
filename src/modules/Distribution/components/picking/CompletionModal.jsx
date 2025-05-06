import React, { useState, useEffect } from 'react';
import { 
  FaCheck, 
  FaWarehouse, 
  FaUser, 
  FaBoxes, 
  FaTruck, 
  FaInfoCircle, 
  FaClipboardList,
  FaClipboardCheck,
  FaBox,
  FaArrowRight,
  FaFileAlt,
  FaExclamationTriangle,
  FaShippingFast,
  FaBoxOpen
} from 'react-icons/fa';
import '../../styles/Picking.css';

const CompletionModal = ({ pickingList, employees, warehouses, onConfirm, onCancel }) => {
  const [deliveryNotesInfo, setDeliveryNotesInfo] = useState(null);
  
  useEffect(() => {
    if (pickingList && pickingList.delivery_type === 'sales') {
      fetchDeliveryNotesInfo(pickingList.delivery_id);
    }
  }, [pickingList]);
  
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
  
  const getEmployeeName = (employeeId) => {
    if (!employeeId) return 'Not assigned';
    const employee = employees.find(emp => emp.employee_id === employeeId);
    return employee ? employee.full_name : employeeId;
  };

  const getWarehouseName = (warehouseId) => {
    if (pickingList.warehouse_name) return pickingList.warehouse_name;
    
    if (!warehouseId) return 'Not assigned';
    const warehouse = warehouses?.find(wh => wh.id === warehouseId);
    return warehouse ? warehouse.name : warehouseId;
  };

  const getDeliveryTypeIcon = () => {
    return pickingList.is_external ? <FaTruck className="icon-spacing" aria-hidden="true" /> : <FaWarehouse className="icon-spacing" aria-hidden="true" />;
  };
  
  const isPartialDelivery = deliveryNotesInfo && deliveryNotesInfo.is_partial_delivery;
  const currentDelivery = isPartialDelivery ? deliveryNotesInfo.current_delivery : null;
  const totalDeliveries = isPartialDelivery ? deliveryNotesInfo.total_deliveries : null;

  // Escape key handler
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onCancel();
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onCancel]);

  return (
    <div 
      className="picking modal-overlay" 
      onClick={onCancel} 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="modal-title"
    >
      <div className="completion-modal improved" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 id="modal-title">
            <FaClipboardCheck className="title-icon" aria-hidden="true" />
            Complete Picking List
            {isPartialDelivery && (
              <span className="partial-delivery-badge">
                Batch {currentDelivery} of {totalDeliveries}
              </span>
            )}
          </h3>
          <button 
            className="close-button" 
            onClick={onCancel} 
            aria-label="Close modal"
            type="button"
          >
            &times;
          </button>
        </div>
        
        <div className="modal-body">
          <div className="confirmation-banner">
            <div className="confirmation-icon">
              <FaInfoCircle aria-hidden="true" />
            </div>
            <div className="confirmation-text">
              <p className="confirmation-message">
                {isPartialDelivery 
                  ? `Are you sure you want to complete Batch ${currentDelivery} of ${totalDeliveries}?`
                  : 'Are you sure you want to mark this picking list as completed?'
                }
              </p>
              <p className="confirmation-submessage">
                {isPartialDelivery
                  ? `This will complete the picking for the current batch (${currentDelivery}/${totalDeliveries}) and create a packing list for these items.`
                  : 'This will automatically create a new packing list.'
                }
              </p>
            </div>
          </div>
          
          <div className="modal-content-scroll">
            {/* Batch Information - for partial delivery only */}
            {isPartialDelivery && (
              <div className="info-section">
                <h4 className="section-header">
                  <FaFileAlt className="icon-spacing" aria-hidden="true" /> 
                  Batch Information
                </h4>
                <div className="batch-info">
                  <div className="detail-row">
                    <div className="detail-item">
                      <span className="detail-label">Current Batch</span>
                      <div className="detail-value-with-icon">
                        <span className="count-badge">{currentDelivery} of {totalDeliveries}</span>
                      </div>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Status</span>
                      <div className="detail-value-with-icon">
                        <span className="status-badge status-badge-picking">Picking</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Picking List Details - for all orders */}
            <div className="info-section">
              <h4 className="section-header">
                <FaClipboardList className="icon-spacing" aria-hidden="true" /> 
                Picking List Details
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
                      <FaWarehouse className="detail-icon" aria-hidden="true" />
                      {getWarehouseName(pickingList.warehouse_id)}
                    </div>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Assigned To</span>
                    <div className="detail-value-with-icon">
                      <FaUser className="detail-icon" aria-hidden="true" />
                      {getEmployeeName(pickingList.picked_by)}
                    </div>
                  </div>
                </div>
                
                <div className="detail-row">
                  <div className="detail-item">
                    <span className="detail-label">Items Count</span>
                    <div className="detail-value-with-icon">
                      <FaBoxes className="detail-icon" aria-hidden="true" />
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

            {/* Delivery Notes - if applicable */}
            {pickingList.picking_items && pickingList.picking_items.some(item => item.delivery_note_id) && (
              <div className="info-section">
                <h4 className="section-header">
                  <FaFileAlt className="icon-spacing" aria-hidden="true" /> 
                  Delivery Notes
                </h4>
                <div className="delivery-notes-grid">
                  {Array.from(new Set(
                    pickingList.picking_items
                      .filter(item => item.delivery_note_id)
                      .map(item => item.delivery_note_id)
                  )).map(noteId => (
                    <div key={noteId} className="delivery-note-card">
                      <div className="delivery-note-header">
                        <div className="delivery-note-title">
                          <FaFileAlt className="delivery-note-icon" aria-hidden="true" />
                          <span className="delivery-note-id">{noteId}</span>
                        </div>
                        {/* <span className="status-badge status-badge-picking">Ready for Shipping</span> */}
                      </div>
                      <div className="delivery-note-content">
                        <div className="delivery-note-info-row">
                          <div className="info-item">
                            <span className="info-label">Items</span>
                            <span className="info-value">
                              <strong>{pickingList.picking_items.filter(item => item.delivery_note_id === noteId).length}</strong>
                            </span>
                          </div>
                          
                          {isPartialDelivery && deliveryNotesInfo && (
                            <div className="info-item">
                              <span className="info-label">Batch</span>
                              <span className="info-value">
                                <strong>{deliveryNotesInfo.delivery_notes.findIndex(note => note.delivery_note_id === noteId) + 1}</strong> of {deliveryNotesInfo.total_deliveries}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* What happens next - for both normal and partial deliveries */}
            {!isPartialDelivery ? (
              <div className="info-section">
                <h4 className="section-header status-completed">
                  <FaCheck className="icon-spacing" aria-hidden="true" />
                  What happens next?
                </h4>
                
                <div className="next-steps-container">
                  <div className="next-step-item">
                    <div className="step-number">1</div>
                    <div className="step-content">
                      <FaClipboardCheck className="step-icon" aria-hidden="true" />
                      <div className="step-text">The picking list status will be updated to "Completed"</div>
                    </div>
                  </div>
                  
                  <div className="step-connector" aria-hidden="true"></div>
                  
                  <div className="next-step-item">
                    <div className="step-number">2</div>
                    <div className="step-content">
                      <FaBox className="step-icon" aria-hidden="true" />
                      <div className="step-text">A new packing list will be automatically created</div>
                    </div>
                  </div>
                  
                  <div className="step-connector" aria-hidden="true"></div>
                  
                  <div className="next-step-item">
                    <div className="step-number">3</div>
                    <div className="step-content">
                      <FaBoxes className="step-icon" aria-hidden="true" />
                      <div className="step-text">All picked items will be added to the packing list</div>
                    </div>
                  </div>
                  
                  <div className="step-connector" aria-hidden="true"></div>
                  
                  <div className="next-step-item">
                    <div className="step-number">4</div>
                    <div className="step-content">
                      <FaArrowRight className="step-icon" aria-hidden="true" />
                      <div className="step-text">You'll be able to track the order in the Packing module</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="info-section">
                <h4 className="section-header status-in-progress">
                  <FaClipboardList className="icon-spacing" aria-hidden="true" />
                  What happens next?
                </h4>
                
                <div className="next-steps-container">
                  <div className="next-step-item">
                    <div className="step-number">1</div>
                    <div className="step-content">
                      <FaClipboardCheck className="step-icon" aria-hidden="true" />
                      <div className="step-text">Complete picking for batch {currentDelivery} of {totalDeliveries}</div>
                    </div>
                  </div>
                  
                  <div className="step-connector" aria-hidden="true"></div>
                  
                  <div className="next-step-item">
                    <div className="step-number">2</div>
                    <div className="step-content">
                      <FaBoxOpen className="step-icon" aria-hidden="true" />
                      <div className="step-text">Pack the items for this batch</div>
                    </div>
                  </div>
                  
                  <div className="step-connector" aria-hidden="true"></div>
                  
                  <div className="next-step-item">
                    <div className="step-number">3</div>
                    <div className="step-content">
                      <FaShippingFast className="step-icon" aria-hidden="true" />
                      <div className="step-text">Ship this batch to the customer</div>
                    </div>
                  </div>
                  
                  <div className="step-connector" aria-hidden="true"></div>
                  
                  <div className="next-step-item">
                    <div className="step-number">4</div>
                    <div className="step-content">
                      <FaArrowRight className="step-icon" aria-hidden="true" />
                      <div className="step-text">The next batch will become available for picking</div>
                    </div>
                  </div>
                </div>
                <p className="info-note">After this batch is shipped, the next batch will automatically become available for picking.</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="modal-footer">
          <button 
            className="cancel-button"
            onClick={onCancel}
            type="button"
          >
            Cancel
          </button>
          <button 
            className="confirm-button"
            onClick={onConfirm}
            type="button"
          >
            <FaCheck className="button-icon" aria-hidden="true" />
            {isPartialDelivery 
              ? `Complete Batch ${currentDelivery}/${totalDeliveries}`
              : 'Complete Picking'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompletionModal;