import React from 'react';
import { FaBox, FaBoxes, FaTruck, FaClipboardCheck, FaArrowRight, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';
import '../../styles/Picking.css';

const PartialDeliveryInfo = ({ pickingList, deliveryNotesInfo }) => {
  if (!deliveryNotesInfo || !deliveryNotesInfo.is_partial_delivery) {
    return null;
  }

  let currentDelivery = deliveryNotesInfo.current_delivery;
  const totalDeliveries = deliveryNotesInfo.total_deliveries;
  const completedDeliveries = deliveryNotesInfo.completed_deliveries;

  if (currentDelivery > totalDeliveries) {
    currentDelivery = totalDeliveries;
  }

  const progressPercentage = (completedDeliveries / totalDeliveries) * 100;

  const getStatusBadgeClass = (status) => {
    const lowerStatus = String(status).toLowerCase();
    switch (lowerStatus) {
      case 'pending': return 'status-badge-pending';
      case 'shipped': return 'status-badge-shipped';
      case 'delivered': return 'status-badge-delivered';
      case 'failed': return 'status-badge-failed';
      default: return 'status-badge-pending';
    }
  };

  const getStatusDisplay = (status) => {
    if (!status) return 'Pending';
    
    const lowerStatus = String(status).toLowerCase();
    switch (lowerStatus) {
      case 'pending': return 'Pending';
      case 'shipped': return 'Shipped';
      case 'delivered': return 'Delivered';
      case 'failed': return 'Failed';
      default: return status;
    }
  };

  return (
    <div className="partial-delivery-info" role="region" aria-label="Partial delivery information">
      <div className="partial-delivery-header">
        <div className="partial-delivery-title">
          <FaBoxes className="partial-delivery-icon" aria-hidden="true" />
          <h4>Partial Delivery in Progress</h4>
        </div>
        <div className="partial-delivery-counter">
          <span className="delivery-counter-text">Batch</span>
          <span className="delivery-counter-numbers">{currentDelivery} of {totalDeliveries}</span>
        </div>
      </div>

      <div className="partial-delivery-progress">
        <div className="progress-bar-container">
          <div 
            className="progress-bar" 
            style={{ width: `${progressPercentage}%` }}
            role="progressbar"
            aria-valuenow={progressPercentage}
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
        </div>
        <div className="progress-text">
          {completedDeliveries} of {totalDeliveries} deliveries completed
        </div>
      </div>

      <div className="delivery-notes-list" tabIndex="0">
        {deliveryNotesInfo.delivery_notes.map((note, index) => (
          <div 
            key={note.delivery_note_id} 
            className={`delivery-note-item ${
              index + 1 === currentDelivery ? 'current-delivery' : 
              index + 1 < currentDelivery ? 'completed-delivery' : 'pending-delivery'
            }`}
          >
            <div className="delivery-note-sequence" aria-hidden="true">{index + 1}</div>
            <div className="delivery-note-content">
              <div className="delivery-note-id">{note.delivery_note_id}</div>
              <div className="delivery-note-details">
                <span className="item-count">{note.total_quantity || 0} items</span>
                <span className={`status-badge ${getStatusBadgeClass(note.shipment_status)}`}>
                  {getStatusDisplay(note.shipment_status)}
                </span>
              </div>
              {note.admin_override && (
                <div className="admin-override-warning">
                  <FaExclamationTriangle className="warning-icon" aria-hidden="true" />
                  <span>Admin override by {note.admin_override}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="delivery-notes-info">
        <div className="info-message">
          <FaInfoCircle className="info-icon" aria-hidden="true" />
          <span>Partial deliveries must be processed sequentially. After current batch is shipped, the next batch will automatically be available in a new picking list.</span>
        </div>
      </div>
    </div>
  );
};

export default PartialDeliveryInfo;