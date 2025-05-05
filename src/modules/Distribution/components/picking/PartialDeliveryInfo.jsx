import React from 'react';
import { FaBox, FaBoxes, FaTruck, FaClipboardCheck, FaArrowRight, FaExclamationTriangle } from 'react-icons/fa';
import '../../styles/Picking.css';

const PartialDeliveryInfo = ({ pickingList, deliveryNotesInfo }) => {
  if (!deliveryNotesInfo || !deliveryNotesInfo.is_partial_delivery) {
    return null;
  }

  const currentDelivery = deliveryNotesInfo.current_delivery;
  const totalDeliveries = deliveryNotesInfo.total_deliveries;
  const completedDeliveries = deliveryNotesInfo.completed_deliveries;

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
    <div className="partial-delivery-info">
      <div className="partial-delivery-header">
        <div className="partial-delivery-title">
          <FaBoxes className="partial-delivery-icon" />
          <h4>Partial Delivery in Progress</h4>
        </div>
        <div className="partial-delivery-counter">
          <span className="delivery-counter-text">Delivery</span>
          <span className="delivery-counter-numbers">{currentDelivery} of {totalDeliveries}</span>
        </div>
      </div>

      <div className="partial-delivery-progress">
        <div className="progress-bar-container">
          <div 
            className="progress-bar" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <div className="progress-text">
          {completedDeliveries} of {totalDeliveries} deliveries completed
        </div>
      </div>

      <div className="delivery-notes-list">
        {deliveryNotesInfo.delivery_notes.map((note, index) => (
          <div 
            key={note.delivery_note_id} 
            className={`delivery-note-item ${
              index + 1 === currentDelivery ? 'current-delivery' : 
              index + 1 < currentDelivery ? 'completed-delivery' : 'pending-delivery'
            }`}
          >
            <div className="delivery-note-sequence">{index + 1}</div>
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
                  <FaExclamationTriangle className="warning-icon" />
                  <span>Admin override by {note.admin_override}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="delivery-notes-info">
        <div className="info-message">
          <FaExclamationTriangle className="info-icon" />
          <span>Partial deliveries must be processed sequentially. Complete this delivery before proceeding to the next.</span>
        </div>
      </div>
    </div>
  );
};

export default PartialDeliveryInfo;