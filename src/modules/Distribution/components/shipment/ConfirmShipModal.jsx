import React, { useState } from 'react';
import { FaShippingFast, FaTruck, FaWeightHanging, FaRuler, FaMoneyBillWave, FaCheck, FaExclamationTriangle, FaInfoCircle, FaTimes, FaLayerGroup } from 'react-icons/fa';
import PropTypes from 'prop-types';
import axios from 'axios'; // Make sure axios is imported

const ConfirmShipModal = ({ shipment, onConfirm, onCancel }) => {
  // Add loading state for API calls
  const [isProcessing, setIsProcessing] = useState(false);
  const [nextBatchStatus, setNextBatchStatus] = useState(null);

  // Helper function to format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(value || 0);
  };
  
  // Calculate total cost - Add safe checks to avoid undefined errors
  const totalShippingCost = 
    (shipment.shipping_cost_info?.total_shipping_cost) || 
    ((shipment.shipping_cost_info?.weight_kg || 0) * (shipment.shipping_cost_info?.cost_per_kg || 0)) +
    ((shipment.shipping_cost_info?.distance_km || 0) * (shipment.shipping_cost_info?.cost_per_km || 0)) || 0;
    
  const totalOperationalCost = 
    (shipment.operational_cost_info?.total_operational_cost) || 
    (totalShippingCost + 
    (shipment.packing_list_info?.packing_cost_info?.total_packing_cost || 0) + 
    (shipment.operational_cost_info?.additional_cost || 0)) || 0;
  
  // Check for warnings
  const hasNoCarrier = !shipment.carrier_id;
  const hasInvalidDimensions = 
    (!shipment.shipping_cost_info?.weight_kg || shipment.shipping_cost_info.weight_kg <= 0) || 
    (!shipment.shipping_cost_info?.distance_km || shipment.shipping_cost_info.distance_km <= 0);
  
  // Check if we can proceed (has warnings but not blockers)
  const canProceed = !isProcessing; // Disable during processing
  
  // Check if this is likely a partial delivery (based on delivery type and items)
  const isPartialDelivery = shipment.delivery_type === 'sales' && 
    shipment.items_details && shipment.items_details.some(item => item.delivery_note_id);
  
  // Function to create next batch picking list
  const createNextBatchPickingList = async () => {
    setNextBatchStatus({ status: 'loading', message: 'Creating next batch picking list...' });
    
    try {
      // Call the API to create the next batch
      const response = await axios.post(`https://r7d8au0l77.execute-api.ap-southeast-1.amazonaws.com/dev/api/shipments/${shipment.shipment_id}/create-next-batch/`);
      
      if (response.data.success) {
        setNextBatchStatus({ 
          status: 'success', 
          message: 'Next batch picking list created successfully' 
        });
      } else {
        setNextBatchStatus({ 
          status: 'info', 
          message: response.data.message || 'No next batch required or all deliveries complete' 
        });
      }
    } catch (error) {
      console.error('Error creating next batch:', error);
      setNextBatchStatus({ 
        status: 'error', 
        message: error.response?.data?.error || 'Failed to create next batch picking list' 
      });
    }
  };
  
  // Handle confirmed shipment with processing for partial deliveries
  const handleConfirmWithProcessing = async () => {
    setIsProcessing(true);
    
    try {
      // First confirm the shipment (call the original onConfirm)
      await onConfirm();
      
      // If this is a partial delivery, trigger the next batch creation
      if (isPartialDelivery) {
        await createNextBatchPickingList();
      }
    } catch (error) {
      console.error('Error during shipment processing:', error);
      setNextBatchStatus({ 
        status: 'error', 
        message: 'Error processing shipment' 
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Fixed style objects with safe defaults to prevent undefined errors
  const infoContainerStyle = {
    margin: '1rem 0',
    padding: '0.75rem',
    backgroundColor: 'rgba(0, 123, 255, 0.1)',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center'
  };
  
  const infoIconStyle = { 
    color: '#007bff', 
    marginRight: '0.75rem',
    fontSize: '1.25rem'
  };
  
  const infoPrimaryTextStyle = {
    margin: 0, 
    fontWeight: 500, 
    color: '#007bff'
  };
  
  const infoSecondaryTextStyle = {
    margin: '0.25rem 0 0 0', 
    fontSize: '0.875rem'
  };
  
  const statusContainerStyle = (status) => ({
    margin: '1rem 0',
    padding: '0.75rem',
    borderRadius: '4px',
    backgroundColor: status === 'success' 
      ? 'rgba(40, 167, 69, 0.1)' 
      : status === 'error'
        ? 'rgba(220, 53, 69, 0.1)'
        : status === 'loading'
          ? 'rgba(0, 0, 0, 0.05)'
          : 'rgba(0, 123, 255, 0.1)',
    color: status === 'success' 
      ? '#28a745' 
      : status === 'error'
        ? '#dc3545'
        : status === 'loading'
          ? '#666'
          : '#007bff',
  });
  
  const spinnerStyle = {
    display: 'inline-block',
    width: '1rem',
    height: '1rem',
    marginRight: '0.5rem',
    borderRadius: '50%',
    border: '2px solid currentColor',
    borderTopColor: 'transparent',
    animation: 'spin 1s linear infinite'
  };
  
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
            disabled={isProcessing}
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
          
          {/* Partial delivery notice - only shown for partial deliveries */}
          {isPartialDelivery && (
            <div className="info-container" style={infoContainerStyle}>
              <FaLayerGroup style={infoIconStyle} />
              <div>
                <p style={infoPrimaryTextStyle}>
                  Partial Delivery Detected
                </p>
                <p style={infoSecondaryTextStyle}>
                  After confirming this shipment, the next batch will be automatically prepared for processing.
                </p>
              </div>
            </div>
          )}
          
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
          
          {/* Next batch status - only shown if there's a status */}
          {nextBatchStatus && (
            <div className={`status-container status-${nextBatchStatus.status || 'info'}`} 
                 style={statusContainerStyle(nextBatchStatus.status)}>
              {nextBatchStatus.status === 'loading' && (
                <div className="spinner" style={spinnerStyle}></div>
              )}
              {nextBatchStatus.message || 'Processing...'}
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
                <span className="detail-value">{shipment.tracking_number || 'Not Generated'}</span>
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
                <span className={`detail-value ${!shipment.shipping_cost_info?.weight_kg || shipment.shipping_cost_info.weight_kg <= 0 ? 'warning-value' : ''}`}>
                  {shipment.shipping_cost_info?.weight_kg || 0} kg
                </span>
              </div>
              
              <div className="detail-item">
                <span className="detail-label">
                  <FaRuler className="detail-icon" /> Distance
                </span>
                <span className={`detail-value ${!shipment.shipping_cost_info?.distance_km || shipment.shipping_cost_info.distance_km <= 0 ? 'warning-value' : ''}`}>
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
              
              {isPartialDelivery && (
                <div className="step-item">
                  <div className="step-marker">6</div>
                  <div className="step-text">The next batch picking list will be created for partial delivery</div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="modal-footer">
          <button 
            type="button" 
            className="cancel-button"
            onClick={onCancel}
            disabled={isProcessing}
          >
            Cancel
          </button>
          
          <button 
            type="button" 
            className="confirm-button"
            onClick={handleConfirmWithProcessing}
            disabled={!canProceed}
          >
            {isProcessing ? (
              <>
                <span className="spinner" style={spinnerStyle}></span>
                Processing...
              </>
            ) : (
              <>
                <FaShippingFast className="button-icon" />
                Confirm Shipment
              </>
            )}
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
    delivery_type: PropTypes.string,
    items_details: PropTypes.array,
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