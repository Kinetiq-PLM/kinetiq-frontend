import React from 'react';
import { FaShippingFast, FaTruck, FaWeightHanging, FaRuler, FaMoneyBillWave, FaCheck, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';

const ConfirmShipModal = ({ shipment, onConfirm, onCancel }) => {
  // Helper function to format currency
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
  
  // Check for warnings
  const hasNoCarrier = !shipment.carrier_id;
  const hasInvalidDimensions = shipment.shipping_cost_info?.weight_kg <= 0 || shipment.shipping_cost_info?.distance_km <= 0;
  
  return (
    <div className="shipment modal-overlay">
      <div className="confirm-modal">
        <div className="modal-header">
          <h3>
            Confirm Shipment
          </h3>
          <button className="close-button" onClick={onCancel}>&times;</button>
        </div>
        
        <div className="modal-body">
          {/* Main confirmation message */}
          <div className="info-section">
            <div className="icon-message">
              <FaInfoCircle className="info-icon" />
              <p className="confirmation-message">
                Are you sure you want to mark this shipment as shipped?
              </p>
            </div>
          </div>
          
          {/* Warnings section - only shown if there are warnings */}
          {(hasNoCarrier || hasInvalidDimensions) && (
            <div className="failed-message">
              <div className="icon-message">
                <FaExclamationTriangle className="warning-icon" />
                <div className="warning-content">
                  <div className="warning-title">Please review before proceeding:</div>
                  <ul className="warning-list">
                    {hasNoCarrier && (
                      <li>No carrier has been assigned to this shipment.</li>
                    )}
                    {hasInvalidDimensions && (
                      <li>Weight or distance is not properly set. This may affect cost calculations.</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}
          
          {/* Shipment details section */}
          <div className="info-section">
            <h4 className="section-header">
              <FaTruck className="icon-spacing" /> Shipment Details
            </h4>
            
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Shipment ID</span>
                <span className="info-value">{shipment.shipment_id}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Tracking Number</span>
                <span className="info-value">{shipment.tracking_number}</span>
              </div>
              <div className="info-item">
                <span className="info-label">
                  <FaTruck className="icon-spacing" /> Carrier
                </span>
                <span className={`info-value ${hasNoCarrier ? 'status-failed' : ''}`}>
                  {shipment.carrier_name || 'Not Assigned'}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">
                  <FaWeightHanging className="icon-spacing" /> Weight
                </span>
                <span className={`info-value ${shipment.shipping_cost_info?.weight_kg <= 0 ? 'status-failed' : ''}`}>
                  {shipment.shipping_cost_info?.weight_kg || 0} kg
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">
                  <FaRuler className="icon-spacing" /> Distance
                </span>
                <span className={`info-value ${shipment.shipping_cost_info?.distance_km <= 0 ? 'status-failed' : ''}`}>
                  {shipment.shipping_cost_info?.distance_km || 0} km
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">
                  <FaMoneyBillWave className="icon-spacing" /> Shipping Cost
                </span>
                <span className="info-value">{formatCurrency(totalShippingCost)}</span>
              </div>
            </div>
            
            <div className="cost-total-row">
              <span className="cost-total-label">
                <FaMoneyBillWave className="icon-spacing" /> Total Operational Cost
              </span>
              <span className="cost-total-value status-shipped">
                {formatCurrency(totalOperationalCost)}
              </span>
            </div>
          </div>
          
          {/* What happens next section */}
          <div className="info-section">
            <h4 className="section-header status-delivered">
              <FaCheck className="icon-spacing" />
              What happens next?
            </h4>
            <ul className="next-steps-list">
              <li>The shipment status will be updated to "Shipped"</li>
              <li>The shipment date will be set to today</li>
              <li>An estimated arrival date will be calculated</li>
              <li>A delivery receipt will be automatically created</li>
              <li>The associated packing list will be marked as "Shipped"</li>
            </ul>
          </div>
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
            <FaShippingFast className="button-icon" />
            Confirm Shipment
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmShipModal;