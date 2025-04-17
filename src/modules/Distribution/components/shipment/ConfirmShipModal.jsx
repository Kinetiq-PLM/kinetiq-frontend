// components/shipment/ConfirmShipModal.jsx
import React from 'react';

const ConfirmShipModal = ({ shipment, onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay">
      <div className="confirm-modal">
        <div className="modal-header">
          <h3>Confirm Shipment</h3>
          <button className="close-button" onClick={onCancel}>&times;</button>
        </div>
        
        <div className="modal-body">
          <p>Are you sure you want to mark this shipment as shipped?</p>
          <p>Tracking Number: <strong>{shipment.tracking_number}</strong></p>
          
          <div className="info-section" style={{ marginTop: '1rem' }}>
            <h4>What happens next?</h4>
            <ul>
              <li>The shipment status will be updated to "Shipped"</li>
              <li>The shipment date will be set to today</li>
              <li>An estimated arrival date will be calculated</li>
              <li>A delivery receipt will be automatically created</li>
              <li>The associated packing list will be marked as "Shipped"</li>
            </ul>
          </div>
          
          {!shipment.carrier_id && (
            <div className="failed-message" style={{ marginTop: '1rem' }}>
              Warning: No carrier has been assigned to this shipment. It is recommended to assign a carrier before shipping.
            </div>
          )}
          
          {(shipment.shipping_cost_info?.weight_kg <= 0 || shipment.shipping_cost_info?.distance_km <= 0) && (
            <div className="failed-message" style={{ marginTop: '1rem' }}>
              Warning: Weight or distance is not properly set. This may affect cost calculations.
            </div>
          )}
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
            type="button" 
            className="confirm-button"
            onClick={onConfirm}
          >
            Confirm Shipment
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmShipModal;