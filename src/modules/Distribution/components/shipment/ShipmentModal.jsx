// components/shipment/ShipmentModal.jsx
import React, { useState, useEffect } from 'react';

const ShipmentModal = ({ 
  shipment, 
  carriers, 
  onClose, 
  onSave, 
  onShip,
  onShowDeliveryReceipt,
  onReportFailure
}) => {
  // Create state for editable fields
  const [formData, setFormData] = useState({
    carrier_id: shipment.carrier_id || '',
    weight_kg: shipment.shipping_cost_info?.weight_kg || 0,
    distance_km: shipment.shipping_cost_info?.distance_km || 0,
    cost_per_kg: shipment.shipping_cost_info?.cost_per_kg || 150,
    cost_per_km: shipment.shipping_cost_info?.cost_per_km || 20,
    additional_cost: shipment.operational_cost_info?.additional_cost || 0,
  });
  
  // Calculate total shipping cost
  const calculateShippingCost = () => {
    const weight = parseFloat(formData.weight_kg) || 0;
    const distance = parseFloat(formData.distance_km) || 0;
    const costPerKg = parseFloat(formData.cost_per_kg) || 0;
    const costPerKm = parseFloat(formData.cost_per_km) || 0;
    
    return (weight * costPerKg) + (distance * costPerKm);
  };
  
  // Calculate total operational cost
  const calculateOperationalCost = () => {
    const additionalCost = parseFloat(formData.additional_cost) || 0;
    const shippingCost = calculateShippingCost();
    const packingCost = shipment.packing_list_info?.packing_cost_info?.total_packing_cost || 0;
    
    return additionalCost + shippingCost + packingCost;
  };
  
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Prepare updates object
    const updates = {};
    
    // Only include fields that have changed
    if (formData.carrier_id !== shipment.carrier_id) {
      updates.carrier_id = formData.carrier_id;
    }
    
    // Check if shipping cost fields have changed
    const shippingCostChanged = 
      formData.weight_kg != shipment.shipping_cost_info?.weight_kg ||
      formData.distance_km != shipment.shipping_cost_info?.distance_km ||
      formData.cost_per_kg != shipment.shipping_cost_info?.cost_per_kg ||
      formData.cost_per_km != shipment.shipping_cost_info?.cost_per_km;
    
    if (shippingCostChanged) {
      updates.shipping_cost = {
        weight_kg: parseFloat(formData.weight_kg),
        distance_km: parseFloat(formData.distance_km),
        cost_per_kg: parseFloat(formData.cost_per_kg),
        cost_per_km: parseFloat(formData.cost_per_km),
        total_shipping_cost: calculateShippingCost()
      };
    }
    
    // Check if additional cost has changed
    if (formData.additional_cost != shipment.operational_cost_info?.additional_cost) {
      updates.additional_cost = parseFloat(formData.additional_cost);
    }
    
    // Save changes
    onSave(shipment, updates);
  };
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Not Set';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Get carrier name by ID
  const getCarrierName = (carrierId) => {
    const carrier = carriers.find(c => c.carrier_id === carrierId);
    return carrier ? carrier.carrier_name : 'Not Assigned';
  };
  
  // Determine if shipment can be marked as shipped
  const canBeShipped = shipment.shipment_status === 'Pending';
  
  // Determine if delivery receipt can be accessed
  const hasDeliveryReceipt = shipment.shipment_status === 'Shipped' || shipment.shipment_status === 'Delivered';
  
  // Determine if shipment can be marked as failed
  const canBeFailed = shipment.shipment_status === 'Pending' || shipment.shipment_status === 'Shipped';
  
  return (
    <div className="modal-overlay">
      <div className="shipment-modal">
        <div className="modal-header">
          <h3>Shipment Details</h3>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Shipment Information Section */}
            <div className="info-section">
              <h4>Shipment Information</h4>
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
                  <span className="info-label">Status</span>
                  <span className={`info-value status-${shipment.shipment_status.toLowerCase()}`}>
                    {shipment.shipment_status}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Shipment Date</span>
                  <span className="info-value">{formatDate(shipment.shipment_date)}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Estimated Arrival</span>
                  <span className="info-value">{formatDate(shipment.estimated_arrival_date)}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Actual Arrival</span>
                  <span className="info-value">{formatDate(shipment.actual_arrival_date)}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Delivery Type</span>
                  <span className="info-value">{shipment.delivery_type || 'Unknown'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">From</span>
                  <span className="info-value">{shipment.source_location || 'Unknown'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">To</span>
                  <span className="info-value">{shipment.destination_location || 'Unknown'}</span>
                </div>
              </div>
            </div>
            
            {/* Carrier Selection Section */}
            <div className="edit-section">
              <h4>Carrier Information</h4>
              <div className="carrier-selection">
                <select
                  className="carrier-dropdown"
                  name="carrier_id"
                  value={formData.carrier_id}
                  onChange={handleInputChange}
                >
                  <option value="">-- Select Carrier --</option>
                  {carriers.map(carrier => (
                    <option key={carrier.carrier_id} value={carrier.carrier_id}>
                      {carrier.carrier_name} - {carrier.service_type || 'Standard'}
                    </option>
                  ))}
                </select>
              </div>
              {!formData.carrier_id && (
                <p className="info-value" style={{ color: '#dc3545', marginTop: '0.5rem', fontSize: '0.875rem' }}>
                  Warning: No carrier assigned. It's recommended to assign a carrier before shipping.
                </p>
              )}
            </div>
            
            {/* Shipping Cost Section */}
            <div className="edit-section">
              <h4>Shipping Details & Cost</h4>
              <div className="dimensions-grid">
                <div className="dimension-item">
                  <span className="dimension-label">Weight (kg)</span>
                  <input
                    type="number"
                    className="dimension-input"
                    name="weight_kg"
                    value={formData.weight_kg}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="dimension-item">
                  <span className="dimension-label">Distance (km)</span>
                  <input
                    type="number"
                    className="dimension-input"
                    name="distance_km"
                    value={formData.distance_km}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="dimension-item">
                  <span className="dimension-label">Cost per kg (₱)</span>
                  <input
                    type="number"
                    className="dimension-input"
                    name="cost_per_kg"
                    value={formData.cost_per_kg}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="dimension-item">
                  <span className="dimension-label">Cost per km (₱)</span>
                  <input
                    type="number"
                    className="dimension-input"
                    name="cost_per_km"
                    value={formData.cost_per_km}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              
              <div className="cost-editing">
                <div className="cost-input-row">
                  <span className="cost-label">Shipping Cost:</span>
                  <span className="cost-value">₱ {calculateShippingCost().toFixed(2)}</span>
                </div>
                <div className="cost-input-row">
                  <span className="cost-label">Packing Cost:</span>
                  <span className="cost-value">₱ {(shipment.packing_list_info?.packing_cost_info?.total_packing_cost || 0).toFixed(2)}</span>
                </div>
                <div className="cost-input-row">
                  <span className="cost-label">Additional Cost:</span>
                  <input
                    type="number"
                    className="cost-input"
                    name="additional_cost"
                    value={formData.additional_cost}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="cost-total-row">
                  <span className="cost-total-label">Total Operational Cost:</span>
                  <span className="cost-total-value">₱ {calculateOperationalCost().toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            {/* Related Information Section */}
            <div className="info-section">
              <h4>Related Information</h4>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Packing List ID</span>
                  <span className="info-value">{shipment.packing_list_id || 'Not Available'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Packing Status</span>
                  <span className="info-value">{shipment.packing_list_info?.packing_status || 'Not Available'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Delivery Receipt ID</span>
                  <span className="info-value">{shipment.delivery_receipt_id || 'Not Available'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Receipt Status</span>
                  <span className="info-value">{shipment.delivery_receipt_info?.receipt_status || 'Not Available'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Delivery Order Type</span>
                  <span className="info-value">{shipment.delivery_type || 'Unknown'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Delivery Reference</span>
                  <span className="info-value">{shipment.delivery_id || 'Not Available'}</span>
                </div>
              </div>
            </div>
            
            {/* Status Action Section */}
            <div className="status-section">
              <h4>Status Actions</h4>
              
              {shipment.shipment_status === 'Delivered' && (
                <div className="delivered-message">
                  This shipment has been delivered successfully. No further actions required.
                </div>
              )}
              
              {shipment.shipment_status === 'Failed' && (
                <div className="failed-message">
                  This shipment has failed. Please check the failure details.
                </div>
              )}
              
              {canBeShipped && (
                <button
                  type="button"
                  className="status-update-button ship"
                  onClick={() => onShip(shipment)}
                >
                  Mark as Shipped
                </button>
              )}
              
              {hasDeliveryReceipt && (
                <button
                  type="button"
                  className="status-update-button delivery"
                  onClick={() => onShowDeliveryReceipt(shipment)}
                  style={{ marginTop: canBeShipped ? '0.5rem' : '0' }}
                >
                  Manage Delivery Receipt
                </button>
              )}
              
              {canBeFailed && (
                <button
                  type="button"
                  className="status-update-button failure"
                  onClick={() => onReportFailure(shipment)}
                  style={{ marginTop: (canBeShipped || hasDeliveryReceipt) ? '0.5rem' : '0' }}
                >
                  Report Failure
                </button>
              )}
            </div>
          </div>
          
          <div className="modal-footer">
            <button 
              type="button" 
              className="cancel-button"
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="save-button"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShipmentModal;