import React from 'react';
import { FaShippingFast, FaTruck, FaWeightHanging, FaRuler, FaMoneyBillWave, FaCheck, FaExclamationTriangle, FaInfoCircle, FaTimes } from 'react-icons/fa';
import PropTypes from 'prop-types';

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
  const hasInvalidDimensions = 
    (shipment.shipping_cost_info?.weight_kg <= 0) || 
    (shipment.shipping_cost_info?.distance_km <= 0);
  
  // Check if we can proceed (has warnings but not blockers)
  const canProceed = true; // We're letting them proceed with warnings
  
  return (
    <div className="shipment modal-overlay">
      <div className="confirm-ship-modal">
        <div className="modal-header">
          <div className="header-content">
            <FaShippingFast className="header-icon" />
            <h3>Confirm Shipment</h3>
          </div>
          <button 
            className="close-button" 
            onClick={onCancel} 
            aria-label="Close modal"
          >
            <FaTimes />
          </button>
        </div>
        
        <div className="modal-body">
          {/* Main confirmation message */}
          <div className="confirmation-message-container">
            <div className="confirmation-icon-wrapper">
              <FaInfoCircle className="confirmation-icon" />
            </div>
            <p className="confirmation-text">
              Are you sure you want to mark this shipment as shipped?
            </p>
          </div>
          
          {/* Warnings section - only shown if there are warnings */}
          {(hasNoCarrier || hasInvalidDimensions) && (
            <div className="warning-container">
              <div className="warning-header">
                <FaExclamationTriangle className="warning-icon" />
                <span className="warning-title">Please review before proceeding:</span>
              </div>
              <ul className="warning-list">
                {hasNoCarrier && (
                  <li>No carrier has been assigned to this shipment.</li>
                )}
                {hasInvalidDimensions && (
                  <li>Weight or distance is not properly set. This may affect cost calculations.</li>
                )}
              </ul>
            </div>
          )}
          
          {/* Shipment details section */}
          <div className="details-section">
            <h4 className="section-title">
              <FaTruck className="section-icon" /> 
              <span>Shipment Details</span>
            </h4>
            
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Shipment ID</span>
                <span className="detail-value">{shipment.shipment_id}</span>
              </div>
              
              <div className="detail-item">
                <span className="detail-label">Tracking Number</span>
                <span className="detail-value">{shipment.tracking_number}</span>
              </div>
              
              <div className="detail-item">
                <span className="detail-label">
                  <FaTruck className="detail-icon" /> Carrier
                </span>
                <span className={`detail-value ${hasNoCarrier ? 'warning-value' : ''}`}>
                  {shipment.carrier_name || 'Not Assigned'}
                </span>
              </div>
              
              <div className="detail-item">
                <span className="detail-label">
                  <FaWeightHanging className="detail-icon" /> Weight
                </span>
                <span className={`detail-value ${shipment.shipping_cost_info?.weight_kg <= 0 ? 'warning-value' : ''}`}>
                  {shipment.shipping_cost_info?.weight_kg || 0} kg
                </span>
              </div>
              
              <div className="detail-item">
                <span className="detail-label">
                  <FaRuler className="detail-icon" /> Distance
                </span>
                <span className={`detail-value ${shipment.shipping_cost_info?.distance_km <= 0 ? 'warning-value' : ''}`}>
                  {shipment.shipping_cost_info?.distance_km || 0} km
                </span>
              </div>
              
              <div className="detail-item">
                <span className="detail-label">
                  <FaMoneyBillWave className="detail-icon" /> Shipping Cost
                </span>
                <span className="detail-value">{formatCurrency(totalShippingCost)}</span>
              </div>
            </div>
            
            <div className="total-cost">
              <span className="total-cost-label">
                <FaMoneyBillWave className="total-cost-icon" /> Total Operational Cost
              </span>
              <span className="total-cost-value">
                {formatCurrency(totalOperationalCost)}
              </span>
            </div>
          </div>
          
          {/* What happens next section */}
          <div className="next-steps-section">
            <h4 className="section-title">
              <FaCheck className="section-icon" />
              <span>What happens next?</span>
            </h4>
            
            <div className="steps-container">
              <div className="step-item">
                <div className="step-marker">1</div>
                <div className="step-text">The shipment status will be updated to "Shipped"</div>
              </div>
              
              <div className="step-item">
                <div className="step-marker">2</div>
                <div className="step-text">The shipment date will be set to today</div>
              </div>
              
              <div className="step-item">
                <div className="step-marker">3</div>
                <div className="step-text">An estimated arrival date will be calculated</div>
              </div>
              
              <div className="step-item">
                <div className="step-marker">4</div>
                <div className="step-text">A delivery receipt will be automatically created</div>
              </div>
              
              <div className="step-item">
                <div className="step-marker">5</div>
                <div className="step-text">The associated packing list will be marked as "Shipped"</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="modal-footer">
          <button 
            type="button" 
            className="cancel-button"
            onClick={onCancel}
          >
            <FaTimes className="button-icon" />
            Cancel
          </button>
          
          <button 
            type="button" 
            className="confirm-button"
            onClick={onConfirm}
            disabled={!canProceed}
          >
            <FaShippingFast className="button-icon" />
            Confirm Shipment
          </button>
        </div>
      </div>
    </div>
  );
};

ConfirmShipModal.propTypes = {
  shipment: PropTypes.shape({
    shipment_id: PropTypes.string.isRequired,
    tracking_number: PropTypes.string,
    carrier_id: PropTypes.string,
    carrier_name: PropTypes.string,
    shipping_cost_info: PropTypes.shape({
      weight_kg: PropTypes.number,
      distance_km: PropTypes.number,
      cost_per_kg: PropTypes.number,
      cost_per_km: PropTypes.number,
      total_shipping_cost: PropTypes.number
    }),
    operational_cost_info: PropTypes.shape({
      additional_cost: PropTypes.number,
      total_operational_cost: PropTypes.number
    }),
    packing_list_info: PropTypes.shape({
      packing_cost_info: PropTypes.shape({
        total_packing_cost: PropTypes.number
      })
    })
  }).isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default ConfirmShipModal;