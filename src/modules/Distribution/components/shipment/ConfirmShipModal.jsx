import React from 'react';

const ConfirmShipModal = ({ shipment, onConfirm, onCancel }) => {
  // Helper function to get carrier name
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(value || 0);
  };
  
  // Calculate total cost
  const totalShippingCost = shipment.shipping_cost_info?.total_shipping_cost || 
    (shipment.shipping_cost_info?.weight_kg * shipment.shipping_cost_info?.cost_per_kg) +
    (shipment.shipping_cost_info?.distance_km * shipment.shipping_cost_info?.cost_per_km) || 0;
    
  const totalOperationalCost = shipment.operational_cost_info?.total_operational_cost || 
    (totalShippingCost + 
    (shipment.packing_list_info?.packing_cost_info?.total_packing_cost || 0) + 
    (shipment.operational_cost_info?.additional_cost || 0)) || 0;
  
  return (
    <div className="modal-overlay">
      <div className="confirm-modal">
        <div className="modal-header">
          <h3>Confirm Shipment</h3>
          <button className="close-button" onClick={onCancel}>&times;</button>
        </div>
        
        <div className="modal-body">
          <p>Are you sure you want to mark this shipment as shipped?</p>
          
          <div className="shipping-details">
            <div className="detail-item">
              <span className="detail-label">Shipment ID:</span>
              <span className="detail-value">{shipment.shipment_id}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Tracking Number:</span>
              <span className="detail-value">{shipment.tracking_number}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Carrier:</span>
              <span className="detail-value">
                {shipment.carrier_name || 'Not Assigned'}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Weight:</span>
              <span className="detail-value">
                {shipment.shipping_cost_info?.weight_kg || 0} kg
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Distance:</span>
              <span className="detail-value">
                {shipment.shipping_cost_info?.distance_km || 0} km
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Shipping Cost:</span>
              <span className="detail-value">
                {formatCurrency(totalShippingCost)}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Total Operational Cost:</span>
              <span className="detail-value">
                {formatCurrency(totalOperationalCost)}
              </span>
            </div>
          </div>
          
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