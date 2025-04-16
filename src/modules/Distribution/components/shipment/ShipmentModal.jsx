import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleMap, LoadScript, Marker, Polyline, useLoadScript } from '@react-google-maps/api';

const ShipmentModal = ({ 
  shipment, 
  carriers, 
  employees,               
  getEmployeeFullName,     
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
  
  const mapsInitializedRef = useRef(false);

  // Use the useLoadScript hook instead of LoadScript component
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyAby5p9XBIsWC1aoy1_RyHxrnlzHhjIoOU",
    preventGoogleFontsLoading: true
  });

  // Map state
  const [sourceCoordinates, setSourceCoordinates] = useState(null);
  const [destinationCoordinates, setDestinationCoordinates] = useState(null);
  const [mapLoading, setMapLoading] = useState(true);
  const [mapError, setMapError] = useState(null);

  // Map styles and settings
  const mapContainerStyle = {
    width: '100%',
    height: '300px',
    borderRadius: '4px'
  };

  // Philippines center (default)
  const defaultCenter = {
    lat: 14.5995,
    lng: 120.9842
  };

  // Geocode both source and destination addresses
  useEffect(() => {
    if (!isLoaded || mapsInitializedRef.current) return;
    
    setMapLoading(true);
    setMapError(null);
    
    const geocodeLocation = async (locationString, setCoordinates) => {
      if (!locationString) return null;
      
      try {
        const geocoder = new window.google.maps.Geocoder();
        
        return new Promise((resolve, reject) => {
          geocoder.geocode({ address: locationString }, (results, status) => {
            if (status === "OK" && results && results.length > 0) {
              const location = results[0].geometry.location;
              const coordinates = {
                lat: location.lat(),
                lng: location.lng()
              };
              setCoordinates(coordinates);
              resolve(coordinates);
            } else {
              console.error(`Geocoding failed for ${locationString}: ${status}`);
              reject(`Geocoding failed: ${status}`);
            }
          });
        });
      } catch (error) {
        console.error("Geocoding error:", error);
        return null;
      }
    };

    const initializeLocations = async () => {
      try {
        let sourceCoords = null;
        let destCoords = null;
        
        // Geocode source location if available
        if (shipment.source_location) {
          sourceCoords = await geocodeLocation(shipment.source_location, setSourceCoordinates);
        }
        
        // Geocode destination location if available
        if (shipment.destination_location) {
          destCoords = await geocodeLocation(shipment.destination_location, setDestinationCoordinates);
        }
        
        // If both coordinates are available, calculate straight-line distance
        if (sourceCoords && destCoords) {
          // Calculate distance using the Haversine formula
          const R = 6371; // Radius of the earth in km
          const dLat = (destCoords.lat - sourceCoords.lat) * Math.PI / 180;
          const dLon = (destCoords.lng - sourceCoords.lng) * Math.PI / 180;
          const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(sourceCoords.lat * Math.PI / 180) * Math.cos(destCoords.lat * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
          const distance = R * c; // Distance in km
          
          // Only update distance if it's currently zero
          if (parseFloat(formData.distance_km) === 0) {
            setFormData(prev => ({
              ...prev,
              distance_km: parseFloat(distance.toFixed(2))
            }));
          }
        }
        
        setMapLoading(false);
        mapsInitializedRef.current = true;
      } catch (error) {
        setMapError(`Error: ${error}`);
        setMapLoading(false);
      }
    };
    
    initializeLocations();
  }, [shipment.source_location, shipment.destination_location, isLoaded, formData.distance_km]);

  // Handle map load
  const onMapLoad = useCallback((map) => {
    // Set appropriate center and zoom based on available coordinates
    if (destinationCoordinates && sourceCoordinates) {
      // Create bounds that include both points
      const bounds = new window.google.maps.LatLngBounds();
      bounds.extend(sourceCoordinates);
      bounds.extend(destinationCoordinates);
      map.fitBounds(bounds);
    } else if (destinationCoordinates) {
      map.setCenter(destinationCoordinates);
    } else if (sourceCoordinates) {
      map.setCenter(sourceCoordinates);
    }
    
    setMapLoading(false);
  }, [sourceCoordinates, destinationCoordinates]);

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
    
    // Apply limits for weight and distance
    if (name === 'weight_kg' && parseFloat(value) > 2000) {
      setFormData(prev => ({
        ...prev,
        [name]: 2000
      }));
      return;
    }
    
    if (name === 'distance_km' && parseFloat(value) > 2000) {
      setFormData(prev => ({
        ...prev,
        [name]: 2000
      }));
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Prevent saving if shipment is not editable
    if (!isShipmentEditable) {
      return;
    }
    
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
  
  // Determine if shipment is editable (only Pending shipments can be edited)
  const isShipmentEditable = shipment.shipment_status === 'Pending';
  
  // Check if shipping details are valid
  const hasValidShippingDetails = 
    parseFloat(formData.weight_kg) > 0 && 
    parseFloat(formData.distance_km) > 0;
  
  // Combined validation for action buttons
  const isActionDisabled = !formData.carrier_id || !hasValidShippingDetails;
  
  // Determine if we should show the map section
  const shouldShowMap = shipment.destination_location || shipment.source_location;
  
  // Create polyline path (straight line between source and destination)
  const polylinePath = sourceCoordinates && destinationCoordinates ? 
    [sourceCoordinates, destinationCoordinates] : [];
  
  // Polyline options for the route line
  const polylineOptions = {
    strokeColor: "#4285F4", // Google Maps blue
    strokeOpacity: 0.8,
    strokeWeight: 5,
    geodesic: true, // Follow the curvature of the earth
  };
  
  return (
    <div className="modal-overlay">
      <div className="shipment-modal">
      <div className="modal-header">
          <h3>Shipment Details</h3>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
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
                  <span className="info-label">Destination</span>
                  <span className="info-value">{shipment.destination_location || 'Unknown'}</span>
                </div>
              </div>
            </div>
            
            {/* Shipping Route Map Section */}
            {shouldShowMap && (
              <div className="info-section">
                <h4>Shipping Route</h4>
                <div className="map-container" style={{ position: 'relative' }}>
                  {isLoaded ? (
                    <GoogleMap
                      mapContainerStyle={mapContainerStyle}
                      center={destinationCoordinates || sourceCoordinates || defaultCenter}
                      zoom={15}
                      onLoad={onMapLoad}
                    >
                      {/* Draw straight line between points if both exist */}
                      {sourceCoordinates && destinationCoordinates && (
                        <Polyline
                          path={polylinePath}
                          options={polylineOptions}
                        />
                      )}
                      
                      {/* Add the thick blue glow effect under the main line */}
                      {sourceCoordinates && destinationCoordinates && (
                        <Polyline
                          path={polylinePath}
                          options={{
                            strokeColor: "#4285F4",
                            strokeOpacity: 0.4,
                            strokeWeight: 9,
                            geodesic: true,
                            zIndex: 1
                          }}
                        />
                      )}
                      
                      {/* Add the main line on top */}
                      {sourceCoordinates && destinationCoordinates && (
                        <Polyline
                          path={polylinePath}
                          options={{
                            strokeColor: "#4285F4",
                            strokeOpacity: 1,
                            strokeWeight: 5,
                            geodesic: true,
                            zIndex: 2
                          }}
                        />
                      )}
                      
                      {/* Render source marker if coordinates are available */}
                      {sourceCoordinates && (
                        <Marker
                          position={sourceCoordinates}
                          icon={{
                            url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
                            labelOrigin: new window.google.maps.Point(15, -10)
                          }}
                          label={{
                            text: "Source",
                            color: "#333",
                            fontSize: "12px",
                            fontWeight: "bold"
                          }}
                        />
                      )}
                      
                      {/* Render destination marker if coordinates are available */}
                      {destinationCoordinates && (
                        <Marker
                          position={destinationCoordinates}
                          icon={{
                            url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
                            labelOrigin: new window.google.maps.Point(15, -10)
                          }}
                          label={{
                            text: "Destination",
                            color: "#333",
                            fontSize: "12px",
                            fontWeight: "bold"
                          }}
                        />
                      )}
                    </GoogleMap>
                  ) : (
                    <div className="map-loading" style={{ 
                      position: 'absolute', 
                      top: '50%', 
                      left: '50%', 
                      transform: 'translate(-50%, -50%)',
                      background: 'rgba(255, 255, 255, 0.8)',
                      padding: '10px',
                      borderRadius: '4px'
                    }}>
                      Loading Google Maps...
                    </div>
                  )}
                  
                  {mapLoading && isLoaded && (
                    <div className="map-loading" style={{ 
                      position: 'absolute', 
                      top: '50%', 
                      left: '50%', 
                      transform: 'translate(-50%, -50%)',
                      background: 'rgba(255, 255, 255, 0.8)',
                      padding: '10px',
                      borderRadius: '4px'
                    }}>
                      Loading map...
                    </div>
                  )}
                  
                  {(mapError || loadError) && (
                    <div className="map-error" style={{ 
                      position: 'absolute', 
                      top: '50%', 
                      left: '50%', 
                      transform: 'translate(-50%, -50%)',
                      background: 'rgba(255, 255, 255, 0.8)',
                      padding: '10px',
                      borderRadius: '4px',
                      color: '#dc3545'
                    }}>
                      Error: {mapError || "Failed to load Google Maps"}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Display message if shipment is not editable */}
            {!isShipmentEditable && (
              <div className="info-message" style={{ margin: '10px 0', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px', borderLeft: '4px solid #e9452a' }}>
                <i className="info-icon" style={{ marginRight: '8px' }}>🔴</i>
                <span>This shipment has been processed and cannot be edited. You can only view details or manage the delivery receipt.</span>
              </div>
            )}
            
            {/* Carrier Selection Section */}
            <div className="edit-section">
              <h4>Carrier Information</h4>
              <div className="carrier-selection">
                <select
                  className="carrier-dropdown"
                  name="carrier_id"
                  value={formData.carrier_id}
                  onChange={handleInputChange}
                  disabled={!isShipmentEditable}
                >
                  <option value="">-- Select Carrier --</option>
                  {carriers.map(carrier => (
                    <option key={carrier.carrier_id} value={carrier.carrier_id}>
                      {getEmployeeFullName(carrier.carrier_name)} - {carrier.service_type || 'Standard'}
                    </option>
                  ))}
                </select>
              </div>
              {!formData.carrier_id && isShipmentEditable && (
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
                    max="2000"
                    step="0.01"
                    disabled={!isShipmentEditable}
                  />
                  <small className="limit-text">Maximum: 2000kg</small>
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
                    max="2000"
                    step="0.01"
                    disabled={!isShipmentEditable}
                  />
                  <small className="limit-text">Maximum: 2000km</small>
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
                    disabled={!isShipmentEditable}
                  />
                </div>
                <div className="cost-total-row">
                  <span className="cost-total-label">Total Operational Cost:</span>
                  <span className="cost-total-value">₱ {calculateOperationalCost().toFixed(2)}</span>
                </div>
              </div>
            </div>
            {!hasValidShippingDetails && isShipmentEditable && (
                <p className="info-value" style={{ color: '#dc3545', marginTop: '0.5rem', fontSize: '0.875rem' }}>
                  Warning: Weight and distance must be greater than zero for shipping.
                </p>
              )}
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
                  className={`status-update-button ship ${isActionDisabled ? 'disabled' : ''}`}
                  onClick={() => onShip(shipment, {
                    carrier_id: formData.carrier_id,
                    shipping_cost_info: {
                      weight_kg: parseFloat(formData.weight_kg) || 0,
                      distance_km: parseFloat(formData.distance_km) || 0,
                      cost_per_kg: parseFloat(formData.cost_per_kg) || 0,
                      cost_per_km: parseFloat(formData.cost_per_km) || 0,
                      total_shipping_cost: calculateShippingCost()
                    },
                    operational_cost_info: {
                      additional_cost: parseFloat(formData.additional_cost) || 0,
                      total_operational_cost: calculateOperationalCost()
                    }
                  })}
                  disabled={!formData.carrier_id}
                  style={{ cursor: !formData.carrier_id ? 'not-allowed' : 'pointer' }}
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
                  className={`status-update-button failure ${!formData.carrier_id ? 'disabled' : ''}`}
                  onClick={() => onReportFailure(shipment)}
                  style={{ 
                    marginTop: (canBeShipped || hasDeliveryReceipt) ? '0.5rem' : '0',
                    cursor: !formData.carrier_id ? 'not-allowed' : 'pointer'
                  }}
                  disabled={!formData.carrier_id}
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
            {isShipmentEditable && (
              <button 
                type="submit" 
                className="save-button"
              >
                Save Changes
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShipmentModal;