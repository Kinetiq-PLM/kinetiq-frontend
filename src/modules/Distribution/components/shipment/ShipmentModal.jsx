import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleMap, Marker, DirectionsService, DirectionsRenderer, useLoadScript, Polyline } from '@react-google-maps/api';
import PropTypes from 'prop-types';

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
  // Create state for editable fields with proper default values
  const [formData, setFormData] = useState({
    carrier_id: shipment.carrier_id || '',
    weight_kg: shipment.shipping_cost_info?.weight_kg || 0,
    distance_km: shipment.shipping_cost_info?.distance_km || 0,
    cost_per_kg: shipment.shipping_cost_info?.cost_per_kg || 150,
    cost_per_km: shipment.shipping_cost_info?.cost_per_km || 20,
    additional_cost: shipment.operational_cost_info?.additional_cost || 0,
  });

  // Form validation state
  const [formErrors, setFormErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);
  
  // Tabs for better organization
  const [activeTab, setActiveTab] = useState('details');
  
  const mapsInitializedRef = useRef(false);

  // Use the useLoadScript hook for Google Maps
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyAby5p9XBIsWC1aoy1_RyHxrnlzHhjIoOU",
    preventGoogleFontsLoading: true
  });

  // Map state
  const [sourceCoordinates, setSourceCoordinates] = useState(null);
  const [destinationCoordinates, setDestinationCoordinates] = useState(null);
  const [mapLoading, setMapLoading] = useState(true);
  const [mapError, setMapError] = useState(null);

  // Add state for directions
  const [directions, setDirections] = useState(null);
  const [routeError, setRouteError] = useState(null);
  const [travelMode, setTravelMode] = useState('DRIVING');
  
  // Add state for route metrics
  const [routeMetrics, setRouteMetrics] = useState({
    distance: 0,
    duration: 0
  });

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
    setRouteError(null);
    
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
        
        if (shipment.source_location) {
          try {
            sourceCoords = await geocodeLocation(shipment.source_location, setSourceCoordinates);
          } catch (error) {
            console.error("Source location geocoding failed:", error);
          }
        }
        
        if (shipment.destination_location) {
          try {
            destCoords = await geocodeLocation(shipment.destination_location, setDestinationCoordinates);
          } catch (error) {
            console.error("Destination location geocoding failed:", error);
          }
        }
        
        // Get directions if both coordinates are available - use DRIVING as default mode
        if (sourceCoords && destCoords) {
          fetchDirections(sourceCoords, destCoords, 'DRIVING');
        } else {
          setMapLoading(false);
        }
        
        mapsInitializedRef.current = true;
      } catch (error) {
        setMapError(`Error: ${error}`);
        setMapLoading(false);
      }
    };
    
    initializeLocations();
  }, [shipment.source_location, shipment.destination_location, isLoaded]);

  // Add function to fetch directions
  const fetchDirections = useCallback((origin, destination, mode) => {
    if (!window.google || !origin || !destination) return;
    
    setMapLoading(true);
    const directionsService = new window.google.maps.DirectionsService();
    
    directionsService.route(
      {
        origin: new window.google.maps.LatLng(origin.lat, origin.lng),
        destination: new window.google.maps.LatLng(destination.lat, destination.lng),
        travelMode: window.google.maps.TravelMode[mode],
        // Optimize for shipping - avoid tolls, optimize waypoints, etc.
        avoidFerries: false, // Allow ferries for shipping
        avoidHighways: false, // Allow highways for shipping
        avoidTolls: false, // Allow toll roads for shipping
        optimizeWaypoints: true // Optimize the route
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);
          
          // Update route metrics
          const route = result.routes[0];
          if (route && route.legs && route.legs[0]) {
            const leg = route.legs[0];
            
            // Get distance in kilometers
            const distanceInKm = leg.distance.value / 1000;
            
            // Get duration in hours
            const durationInHours = leg.duration.value / 3600;
            
            setRouteMetrics({
              distance: distanceInKm.toFixed(2),
              duration: durationInHours.toFixed(1)
            });
            
            // Update the distance in formData (only if it was 0)
            if (parseFloat(formData.distance_km) === 0) {
              setFormData(prev => ({
                ...prev,
                distance_km: distanceInKm.toFixed(2)
              }));
            }
          }
          
          setRouteError(null);
          setMapLoading(false);
        } else {
          console.warn(`Directions request failed: ${status}`);
          
          // Calculate straight-line distance as fallback
          const straightLineDistance = calculateHaversineDistance(origin, destination);
          
          setRouteMetrics({
            distance: straightLineDistance.toFixed(2),
            duration: (straightLineDistance / 50).toFixed(1) // Rough estimate
          });
          
          // Update the distance in formData if it was 0
          if (parseFloat(formData.distance_km) === 0) {
            setFormData(prev => ({
              ...prev,
              distance_km: straightLineDistance.toFixed(2)
            }));
          }
          
          setRouteError(`Unable to calculate route: ${status}. Using straight-line distance instead.`);
          setDirections(null); // Clear directions to fall back to Polyline
          setMapLoading(false);
        }
      }
    );
  }, [formData.distance_km]);
  
  // Add a helper function to calculate straight-line distance using the Haversine formula
  const calculateHaversineDistance = (point1, point2) => {
    const toRad = value => value * Math.PI / 180;
    const R = 6371; // Earth's radius in km
    
    const dLat = toRad(point2.lat - point1.lat);
    const dLng = toRad(point2.lng - point1.lng);
    
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(toRad(point1.lat)) * Math.cos(toRad(point2.lat)) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // if need travel mode
  // // Add handler for travel mode change
  // const handleTravelModeChange = (mode) => {
  //   setTravelMode(mode);
  //   if (sourceCoordinates && destinationCoordinates) {
  //     setMapLoading(true);
  //     fetchDirections(sourceCoordinates, destinationCoordinates, mode);
  //   }
  // };

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

  // Calculate shipping cost
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
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  // Validate form fields
  const validateField = (name, value) => {
    switch (name) {
      case 'weight_kg':
        if (value <= 0) return 'Weight must be greater than 0';
        if (value > 2000) return 'Weight cannot exceed 2000kg';
        return '';
      case 'distance_km':
        if (value <= 0) return 'Distance must be greater than 0';
        if (value > 2000) return 'Distance cannot exceed 2000km';
        return '';
      case 'carrier_id':
        if (!value) return 'Please select a carrier';
        return '';
      default:
        return '';
    }
  };
  
  // Handle input changes with validation
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Apply limits for weight and distance
    let finalValue = value;
    if (name === 'weight_kg' && parseFloat(value) > 2000) {
      finalValue = '2000';
    }
    
    if (name === 'distance_km' && parseFloat(value) > 2000) {
      finalValue = '2000';
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: finalValue
    }));
    
    setIsDirty(true);
    
    // Validate the field
    const error = validateField(name, finalValue);
    setFormErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };
  
  // Validate entire form before submission
  const validateForm = () => {
    const errors = {};
    
    // Check required fields
    if (!formData.carrier_id) {
      errors.carrier_id = 'Please select a carrier';
    }
    
    if (parseFloat(formData.weight_kg) <= 0) {
      errors.weight_kg = 'Weight must be greater than 0';
    }
    
    if (parseFloat(formData.distance_km) <= 0) {
      errors.distance_km = 'Distance must be greater than 0';
    }
    
    setFormErrors(errors);
    
    return Object.keys(errors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Prevent saving if shipment is not editable
    if (!isShipmentEditable) {
      return;
    }
    
    // Validate form
    if (!validateForm()) {
      // Show error toast or notification
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
    
    // Reset dirty flag
    setIsDirty(false);
  };
  
  // Handle mark as shipped
  const handleShip = () => {
    // Validate form first
    if (!validateForm()) {
      return;
    }
    
    onShip(shipment, {
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
    });
  };
  
  // Handle modal close with unsaved changes warning
  const handleClose = () => {
    if (isDirty) {
      // Show confirmation dialog
      if (window.confirm('You have unsaved changes. Are you sure you want to close?')) {
        onClose();
      }
    } else {
      onClose();
    }
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
  
  // Get status indicator class and icon
  const getStatusInfo = (status) => {
    switch (status) {
      case 'Pending':
        return { 
          class: 'status-pending', 
          icon: '⦿', 
          color: '#6c757d',
          bgColor: 'rgba(108, 117, 125, 0.1)'
        };
      case 'Shipped':
        return { 
          class: 'status-shipped', 
          icon: '⦿', 
          color: '#007bff',
          bgColor: 'rgba(0, 123, 255, 0.1)'
        };
      case 'Delivered':
        return { 
          class: 'status-delivered', 
          icon: '⦿', 
          color: '#28a745',
          bgColor: 'rgba(40, 167, 69, 0.1)'
        };
      case 'Failed':
        return { 
          class: 'status-failed', 
          icon: '⦿', 
          color: '#dc3545',
          bgColor: 'rgba(220, 53, 69, 0.1)'
        };
      default:
        return { 
          class: '', 
          icon: '⦿', 
          color: '#6c757d',
          bgColor: 'rgba(108, 117, 125, 0.1)'
        };
    }
  };
  
  const statusInfo = getStatusInfo(shipment.shipment_status);
  
  return (
    <div className="shipment modal-overlay">
      <div className="shipment-modal">
        <div className="modal-header">
          <div className="header-left">
            <h3>Shipment Details</h3>
            <span 
              className="shipment-id"
              style={{ 
                fontSize: '0.9rem', 
                color: '#666', 
                marginLeft: '0.5rem',
                backgroundColor: '#f8f9fa',
                padding: '0.25rem 0.5rem',
                borderRadius: '4px'
              }}
            >
              ID: {shipment.shipment_id}
            </span>
            <span 
              className={`status-badge ${statusInfo.class}`}
              style={{
                display: 'inline-block',
                padding: '0.25rem 0.5rem',
                borderRadius: '4px',
                fontSize: '0.8rem',
                fontWeight: '500',
                marginLeft: '0.5rem',
                color: statusInfo.color,
                backgroundColor: statusInfo.bgColor
              }}
            >
              <span className="status-icon" style={{ marginRight: '0.25rem' }}>{statusInfo.icon}</span>
              {shipment.shipment_status}
            </span>
          </div>
          <button className="close-button" onClick={handleClose}>&times;</button>
        </div>
        
        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button 
            className={`tab ${activeTab === 'details' ? 'active' : ''}`}
            onClick={() => setActiveTab('details')}
          >
            Shipment Details
          </button>
          <button 
            className={`tab ${activeTab === 'route' ? 'active' : ''}`}
            onClick={() => setActiveTab('route')}
            disabled={!shouldShowMap}
          >
            Route Map
          </button>
          <button 
            className={`tab ${activeTab === 'costs' ? 'active' : ''}`}
            onClick={() => setActiveTab('costs')}
          >
            Shipping Costs
          </button>
          <button 
            className={`tab ${activeTab === 'related' ? 'active' : ''}`}
            onClick={() => setActiveTab('related')}
          >
            Related Info
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Display message if shipment is not editable */}
            {!isShipmentEditable && (
              <div className="info-message" style={{ 
                margin: '0 0 1rem', 
                padding: '0.75rem', 
                backgroundColor: statusInfo.bgColor, 
                borderRadius: '4px', 
                display: 'flex',
                alignItems: 'center'
              }}>
                <div style={{ 
                  backgroundColor: statusInfo.color, 
                  color: 'white', 
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '0.75rem'
                }}>
                  <span style={{ fontSize: '0.8rem' }}>i</span>
                </div>
                <span style={{ color: statusInfo.color }}>
                  This shipment has been processed and cannot be edited. You can only view details or manage the delivery receipt.
                </span>
              </div>
            )}
            
            {/* Tab Content */}
            {activeTab === 'details' && (
              <div className="tab-content">
                <div className="info-section">
                  <h4>Shipment Information</h4>
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="info-label">Tracking Number</span>
                      <span className="info-value">{shipment.tracking_number}</span>
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
                  </div>
                </div>
                
                <div className="info-section">
                  <h4>Locations</h4>
                  <div className="locations-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="location-card" style={{ 
                      padding: '1rem', 
                      backgroundColor: '#f8f9fa', 
                      borderRadius: '4px',
                      border: '1px solid #e0e0e0'
                    }}>
                      <div style={{ 
                        fontWeight: '500', 
                        marginBottom: '0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        color: '#495057'
                      }}>
                        <span style={{ marginRight: '0.5rem' }}>📍</span>
                        Source Location
                      </div>
                      <div style={{ fontSize: '0.9rem' }}>
                        {shipment.source_location || 'Not specified'}
                      </div>
                    </div>
                    <div className="location-card" style={{ 
                      padding: '1rem', 
                      backgroundColor: '#f8f9fa', 
                      borderRadius: '4px',
                      border: '1px solid #e0e0e0'
                    }}>
                      <div style={{ 
                        fontWeight: '500', 
                        marginBottom: '0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        color: '#495057'
                      }}>
                        <span style={{ marginRight: '0.5rem' }}>🏁</span>
                        Destination
                      </div>
                      <div style={{ fontSize: '0.9rem' }}>
                        {shipment.destination_location || 'Not specified'}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Carrier Selection Section */}
                <div className="edit-section">
                  <h4>Carrier Information</h4>
                  <div className="carrier-selection">
                    <select
                      className={`carrier-dropdown ${formErrors.carrier_id ? 'error' : ''}`}
                      name="carrier_id"
                      value={formData.carrier_id}
                      onChange={handleInputChange}
                      disabled={!isShipmentEditable}
                      style={{
                        borderColor: formErrors.carrier_id ? '#dc3545' : ''
                      }}
                    >
                      <option value="">-- Select Carrier --</option>
                      {carriers.map(carrier => (
                        <option key={carrier.carrier_id} value={carrier.carrier_id}>
                          {getEmployeeFullName(carrier.carrier_name)} - {carrier.service_type || 'Standard'}
                        </option>
                      ))}
                    </select>
                  </div>
                  {formErrors.carrier_id && (
                    <p className="error-message" style={{ 
                      color: '#dc3545', 
                      // marginTop: '0.5rem', 
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center' 
                    }}>
                      <span style={{ marginRight: '0.25rem' }}>⚠️</span>
                      {formErrors.carrier_id}
                    </p>
                  )}
                </div>
              </div>
            )}
            
            {activeTab === 'route' && (
              <div className="tab-content">
                {shouldShowMap ? (
                  <div className="info-section">
                    <h4>Shipping Route</h4>
                    
                    {/* Remove travel mode selector */}
                    
                    <div className="route-summary" style={{ 
                      display: 'flex', 
                      gap: '1rem',
                      marginBottom: '1rem'
                    }}>
                      <div className="route-distance" style={{
                        padding: '0.75rem',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '4px',
                        flex: '1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column'
                      }}>
                        <div style={{ 
                          fontSize: '0.8rem', 
                          color: '#666',
                          marginBottom: '0.25rem'
                        }}>
                          Shipping Distance
                        </div>
                        <div style={{ 
                          fontSize: '1.25rem', 
                          fontWeight: '500',
                          color: '#333',
                          display: 'flex',
                          alignItems: 'center'
                        }}>
                          <span style={{ marginRight: '0.5rem' }}>🛣️</span>
                          {routeMetrics.distance > 0 ? `${routeMetrics.distance} km` : `${formData.distance_km} km`}
                        </div>
                      </div>
                      <div className="estimated-time" style={{
                        padding: '0.75rem',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '4px',
                        flex: '1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column'
                      }}>
                        <div style={{ 
                          fontSize: '0.8rem', 
                          color: '#666',
                          marginBottom: '0.25rem'
                        }}>
                          Est. Delivery Time
                        </div>
                        <div style={{ 
                          fontSize: '1.25rem', 
                          fontWeight: '500',
                          color: '#333',
                          display: 'flex',
                          alignItems: 'center'
                        }}>
                          <span style={{ marginRight: '0.5rem' }}>⏱️</span>
                          {routeMetrics.duration > 0 ? `${routeMetrics.duration} hours` : `${Math.ceil(formData.distance_km / 50)} hours`}
                        </div>
                      </div>
                    </div>
                    
                    <div className="map-container" style={{ position: 'relative' }}>
                      {isLoaded ? (
                        <GoogleMap
                          mapContainerStyle={mapContainerStyle}
                          center={destinationCoordinates || sourceCoordinates || defaultCenter}
                          zoom={15}
                          onLoad={onMapLoad}
                          options={{
                            fullscreenControl: true,
                            streetViewControl: false,
                            mapTypeControl: true,
                            zoomControl: true
                          }}
                        >
                          {/* Use DirectionsRenderer instead of Polyline when directions are available */}
                          {directions && (
                            <DirectionsRenderer
                              directions={directions}
                              options={{
                                suppressMarkers: true, // We'll add our own custom markers
                                polylineOptions: {
                                  strokeColor: "#4285F4",
                                  strokeOpacity: 0.8,
                                  strokeWeight: 5
                                }
                              }}
                            />
                          )}
                          
                          {/* Fallback to Polyline if directions aren't available */}
                          {!directions && sourceCoordinates && destinationCoordinates && (
                            <Polyline
                              path={[sourceCoordinates, destinationCoordinates]}
                              options={polylineOptions}
                            />
                          )}
                          
                          {/* Render source marker */}
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
                          
                          {/* Render destination marker */}
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
                        <div className="map-placeholder" style={{ 
                          height: '300px', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          backgroundColor: '#f8f9fa',
                          borderRadius: '4px',
                          border: '1px solid #e0e0e0'
                        }}>
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🗺️</div>
                            <div>Loading Google Maps...</div>
                          </div>
                        </div>
                      )}
                      
                      {/* Show route error if any */}
                      {routeError && (
                        <div className="route-error" style={{ 
                          position: 'absolute', 
                          bottom: '10px',
                          left: '10px',
                          right: '10px',
                          background: 'rgba(255, 255, 255, 0.9)',
                          padding: '0.75rem',
                          borderRadius: '4px',
                          color: '#dc3545',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          fontSize: '0.85rem'
                        }}>
                          <span style={{ marginRight: '0.5rem' }}>⚠️</span>
                          {routeError}
                        </div>
                      )}

                      {mapLoading && isLoaded && (
                        <div className="map-loading" style={{ 
                          position: 'absolute', 
                          top: '50%', 
                          left: '50%', 
                          transform: 'translate(-50%, -50%)',
                          background: 'rgba(255, 255, 255, 0.9)',
                          padding: '1rem',
                          borderRadius: '4px',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center'
                        }}>
                          <div className="spinner" style={{ 
                            border: '3px solid rgba(0, 0, 0, 0.1)',
                            borderLeft: '3px solid #00a8a8',
                            borderRadius: '50%',
                            width: '24px',
                            height: '24px',
                            animation: 'spin 1s linear infinite',
                            marginBottom: '0.5rem'
                          }}></div>
                          <div>Loading route data...</div>
                        </div>
                      )}
                      
                      {(mapError || loadError) && (
                        <div className="map-error" style={{ 
                          position: 'absolute', 
                          top: '50%', 
                          left: '50%', 
                          transform: 'translate(-50%, -50%)',
                          background: 'rgba(255, 255, 255, 0.9)',
                          padding: '1rem',
                          borderRadius: '4px',
                          color: '#dc3545',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                          display: 'flex',
                          alignItems: 'center'
                        }}>
                          <span style={{ marginRight: '0.5rem' }}>⚠️</span>
                          {mapError || "Failed to load Google Maps"}
                        </div>
                      )}
                    </div>
                    
                    {/* Update the map tip to be more shipping-focused */}
                    <div className="map-tip" style={{ 
                      marginTop: '0.75rem',
                      padding: '0.5rem',
                      backgroundColor: 'rgba(0, 168, 168, 0.1)',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      color: '#00a8a8',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      <span style={{ marginRight: '0.5rem' }}>💡</span>
                      <span>The route shown represents the optimal shipping path. Actual routes may vary depending on logistics constraints and carrier capabilities.</span>
                    </div>
                  </div>
                  ) : (
                  <div className="no-route-data" style={{ 
                    padding: '2rem', 
                    textAlign: 'center',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '4px',
                    color: '#666'
                  }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🗺️</div>
                    <h4 style={{ marginBottom: '0.5rem' }}>No Route Data Available</h4>
                    <p>Source or destination location information is missing.</p>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'costs' && (
              <div className="tab-content">
                {/* Shipping Cost Section */}
                <div className="edit-section">
                  <h4>Shipping Details & Dimensions</h4>
                  <div className="dimensions-grid">
                    <div className="dimension-item">
                      <span className="dimension-label">Weight (kg)</span>
                      <div className="input-with-error" style={{ position: 'relative' }}>
                        <input
                          type="number"
                          className={`dimension-input ${formErrors.weight_kg ? 'error' : ''}`}
                          name="weight_kg"
                          value={formData.weight_kg}
                          onChange={handleInputChange}
                          min="0"
                          max="2000"
                          step="0.01"
                          disabled={!isShipmentEditable}
                          style={{ 
                            borderColor: formErrors.weight_kg ? '#dc3545' : '',
                            width: '100%'
                          }}
                        />
                        {formErrors.weight_kg && (
                          <div className="error-icon" style={{ 
                            position: 'absolute', 
                            right: '10px', 
                            top: '50%', 
                            transform: 'translateY(-50%)',
                            color: '#dc3545',
                            fontSize: '0.8rem'
                          }}>⚠️</div>
                        )}
                      </div>
                      {formErrors.weight_kg && (
                        <p className="error-message" style={{ 
                          color: '#dc3545', 
                          margin: '0.25rem 0 0', 
                          fontSize: '0.8rem' 
                        }}>
                          {formErrors.weight_kg}
                        </p>
                      )}
                      <small className="limit-text">Maximum: 2000kg</small>
                    </div>
                    <div className="dimension-item">
                      <span className="dimension-label">Distance (km)</span>
                      <div className="input-with-error" style={{ position: 'relative' }}>
                        <input
                          type="number"
                          className={`dimension-input ${formErrors.distance_km ? 'error' : ''}`}
                          name="distance_km"
                          value={formData.distance_km}
                          onChange={handleInputChange}
                          min="0"
                          max="2000"
                          step="0.01"
                          disabled={!isShipmentEditable}
                          style={{ 
                            borderColor: formErrors.distance_km ? '#dc3545' : '',
                            width: '100%'
                          }}
                        />
                        {formErrors.distance_km && (
                          <div className="error-icon" style={{ 
                            position: 'absolute', 
                            right: '10px', 
                            top: '50%', 
                            transform: 'translateY(-50%)',
                            color: '#dc3545',
                            fontSize: '0.8rem'
                          }}>⚠️</div>
                        )}
                      </div>
                      {formErrors.distance_km && (
                        <p className="error-message" style={{ 
                          color: '#dc3545', 
                          margin: '0.25rem 0 0', 
                          fontSize: '0.8rem' 
                        }}>
                          {formErrors.distance_km}
                        </p>
                      )}
                      <small className="limit-text">Maximum: 2000km</small>
                    </div>
                  </div>
                </div>
                
                {/* Cost breakdown section */}
                <div className="edit-section">
                  <h4>Cost Breakdown</h4>
                  
                  <div className="cost-rate-section" style={{ 
                    backgroundColor: '#f8f9fa',
                    padding: '0.75rem',
                    borderRadius: '4px',
                    marginBottom: '1rem'
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      marginBottom: '0.5rem'
                    }}>
                      <span style={{ fontSize: '0.875rem', color: '#495057' }}>Cost per kg:</span>
                      <span style={{ fontWeight: '500' }}>
                        {formatCurrency(formData.cost_per_kg)}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.875rem', color: '#495057' }}>Cost per km:</span>
                      <span style={{ fontWeight: '500' }}>
                        {formatCurrency(formData.cost_per_km)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="cost-calculation" style={{ marginBottom: '1rem' }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      marginBottom: '0.5rem',
                      padding: '0.5rem',
                      backgroundColor: 'rgba(0, 123, 255, 0.05)',
                      borderRadius: '4px'
                    }}>
                      <span style={{ fontSize: '0.875rem', color: '#495057' }}>
                        Weight cost: {formData.weight_kg} kg × {formatCurrency(formData.cost_per_kg)}
                      </span>
                      <span style={{ fontWeight: '500' }}>
                        {formatCurrency(formData.weight_kg * formData.cost_per_kg)}
                      </span>
                    </div>
                    
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      marginBottom: '0.5rem',
                      padding: '0.5rem',
                      backgroundColor: 'rgba(0, 123, 255, 0.05)',
                      borderRadius: '4px'
                    }}>
                      <span style={{ fontSize: '0.875rem', color: '#495057' }}>
                        Distance cost: {formData.distance_km} km × {formatCurrency(formData.cost_per_km)}
                      </span>
                      <span style={{ fontWeight: '500' }}>
                        {formatCurrency(formData.distance_km * formData.cost_per_km)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="cost-editing">
                    <div className="cost-input-row" style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      marginBottom: '0.5rem',
                      backgroundColor: 'rgba(0, 168, 168, 0.05)',
                      padding: '0.75rem',
                      borderRadius: '4px'
                    }}>
                      <span className="cost-label" style={{ fontWeight: '500' }}>Shipping Cost:</span>
                      <span className="cost-value" style={{ fontWeight: '600' }}>
                        {formatCurrency(calculateShippingCost())}
                      </span>
                    </div>
                    <div className="cost-input-row" style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      marginBottom: '0.5rem'
                    }}>
                      <span className="cost-label">Packing Cost:</span>
                      <span className="cost-value">
                        {formatCurrency(shipment.packing_list_info?.packing_cost_info?.total_packing_cost || 0)}
                      </span>
                    </div>
                    <div className="cost-input-row" style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      marginBottom: '0.5rem',
                      alignItems: 'center'
                    }}>
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
                        style={{ 
                          width: '150px',
                          textAlign: 'right',
                          padding: '0.5rem'
                        }}
                      />
                    </div>
                    <div className="cost-total-row" style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      padding: '0.75rem',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '4px',
                      marginTop: '0.75rem'
                    }}>
                      <span className="cost-total-label" style={{ fontWeight: '600' }}>Total Operational Cost:</span>
                      <span className="cost-total-value" style={{ 
                        fontWeight: '700',
                        fontSize: '1.1rem',
                        color: '#00a8a8'
                      }}>
                        {formatCurrency(calculateOperationalCost())}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'related' && (
              <div className="tab-content">
                {/* Related Information Section */}
                <div className="info-section">
                  <h4>Related Documents</h4>
                  <div className="documents-grid" style={{ 
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: '1rem',
                    marginBottom: '1.5rem'
                  }}>
                    <div className="document-card" style={{ 
                      padding: '1rem',
                      border: '1px solid #e0e0e0',
                      borderRadius: '4px',
                      backgroundColor: shipment.packing_list_id ? '#fff' : '#f8f9fa'
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        marginBottom: '0.75rem'
                      }}>
                        <span style={{ 
                          fontSize: '1.25rem', 
                          marginRight: '0.5rem',
                          color: shipment.packing_list_id ? '#00a8a8' : '#6c757d'
                        }}>
                          📦
                        </span>
                        <span style={{ fontWeight: '500', color: '#333' }}>Packing List</span>
                      </div>
                      <div style={{ 
                        display: 'flex', 
                        flexDirection: 'column',
                        gap: '0.5rem'
                      }}>
                        <div>
                          <span style={{ fontSize: '0.75rem', color: '#666' }}>ID:</span>
                          <span style={{ 
                            fontSize: '0.875rem', 
                            display: 'block',
                            fontWeight: '500'
                          }}>
                            {shipment.packing_list_id || 'Not Available'}
                          </span>
                        </div>
                        <div>
                          <span style={{ fontSize: '0.75rem', color: '#666' }}>Status:</span>
                          <span style={{ 
                            fontSize: '0.875rem', 
                            display: 'block',
                            fontWeight: '500',
                            color: shipment.packing_list_info?.packing_status === 'Completed' ? '#28a745' : '#6c757d'
                          }}>
                            {shipment.packing_list_info?.packing_status || 'Not Available'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="document-card" style={{ 
                      padding: '1rem',
                      border: '1px solid #e0e0e0',
                      borderRadius: '4px',
                      backgroundColor: shipment.delivery_receipt_id ? '#fff' : '#f8f9fa'
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        marginBottom: '0.75rem'
                      }}>
                        <span style={{ 
                          fontSize: '1.25rem', 
                          marginRight: '0.5rem',
                          color: shipment.delivery_receipt_id ? '#00a8a8' : '#6c757d'
                        }}>
                          🧾
                        </span>
                        <span style={{ fontWeight: '500', color: '#333' }}>Delivery Receipt</span>
                      </div>
                      <div style={{ 
                        display: 'flex', 
                        flexDirection: 'column',
                        gap: '0.5rem'
                      }}>
                        <div>
                          <span style={{ fontSize: '0.75rem', color: '#666' }}>ID:</span>
                          <span style={{ 
                            fontSize: '0.875rem', 
                            display: 'block',
                            fontWeight: '500'
                          }}>
                            {shipment.delivery_receipt_id || 'Not Available'}
                          </span>
                        </div>
                        <div>
                          <span style={{ fontSize: '0.75rem', color: '#666' }}>Status:</span>
                          <span style={{ 
                            fontSize: '0.875rem', 
                            display: 'block',
                            fontWeight: '500',
                            color: shipment.delivery_receipt_info?.receipt_status === 'Signed' ? '#28a745' : '#6c757d'
                          }}>
                            {shipment.delivery_receipt_info?.receipt_status || 'Not Available'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="document-card" style={{ 
                      padding: '1rem',
                      border: '1px solid #e0e0e0',
                      borderRadius: '4px',
                      backgroundColor: shipment.delivery_id ? '#fff' : '#f8f9fa'
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        marginBottom: '0.75rem'
                      }}>
                        <span style={{ 
                          fontSize: '1.25rem', 
                          marginRight: '0.5rem',
                          color: shipment.delivery_id ? '#00a8a8' : '#6c757d'
                        }}>
                          🚚
                        </span>
                        <span style={{ fontWeight: '500', color: '#333' }}>Delivery Order</span>
                      </div>
                      <div style={{ 
                        display: 'flex', 
                        flexDirection: 'column',
                        gap: '0.5rem'
                      }}>
                        <div>
                          <span style={{ fontSize: '0.75rem', color: '#666' }}>Reference:</span>
                          <span style={{ 
                            fontSize: '0.875rem', 
                            display: 'block',
                            fontWeight: '500'
                          }}>
                            {shipment.delivery_id || 'Not Available'}
                          </span>
                        </div>
                        <div>
                          <span style={{ fontSize: '0.75rem', color: '#666' }}>Type:</span>
                          <span style={{ 
                            fontSize: '0.875rem', 
                            display: 'block',
                            fontWeight: '500'
                          }}>
                            {shipment.delivery_type || 'Unknown'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Status Action Section - Always visible at bottom */}
            <div className="status-section" style={{ 
              marginTop: '1rem',
              padding: '1rem',
              borderRadius: '4px',
              backgroundColor: '#f8f9fa',
              border: '1px solid #e0e0e0'
            }}>
              <h4 style={{ 
                marginBottom: '0.75rem',
                display: 'flex',
                alignItems: 'center'
              }}>
                <span style={{ marginRight: '0.5rem' }}>🔄</span>
                Status Actions
              </h4>
              
              {shipment.shipment_status === 'Delivered' && (
                <div className="delivered-message" style={{ 
                  backgroundColor: 'rgba(40, 167, 69, 0.1)',
                  color: '#28a745',
                  padding: '0.75rem',
                  borderRadius: '4px',
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  {/* <span style={{ marginRight: '0.5rem', fontSize: '1.25rem' }}>✅</span> */}
                  This shipment has been delivered successfully. No further actions required.
                </div>
              )}
              
              {shipment.shipment_status === 'Failed' && (
                <div className="failed-message" style={{
                  backgroundColor: 'rgba(220, 53, 69, 0.1)',
                  color: '#dc3545',
                  padding: '0.75rem',
                  borderRadius: '4px',
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  {/* <span style={{ marginRight: '0.5rem', fontSize: '1.25rem' }}>❌</span> */}
                  This shipment has failed. Please check the failure details.
                </div>
              )}
              
              {(canBeShipped || hasDeliveryReceipt || canBeFailed) && (
                <div className="action-buttons" style={{ 
                  display: 'flex',
                  gap: '0.75rem',
                  flexWrap: 'wrap'
                }}>
                  {canBeShipped && (
                    <button
                      type="button"
                      className={`status-update-button ship ${isActionDisabled ? 'disabled' : ''}`}
                      onClick={handleShip}
                      disabled={isActionDisabled}
                      style={{ 
                        flex: '1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: isActionDisabled ? 'not-allowed' : 'pointer',
                        backgroundColor: isActionDisabled ? '#99c2ff' : '#007bff',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <span style={{ marginRight: '0.5rem', fontSize: '1.1rem' }}>📦</span>
                      Mark as Shipped
                    </button>
                  )}
                  
                  {hasDeliveryReceipt && (
                    <button
                      type="button"
                      className="status-update-button delivery"
                      onClick={() => onShowDeliveryReceipt(shipment)}
                      style={{ 
                        flex: '1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: canBeShipped ? '0.5rem' : '0',
                        backgroundColor: '#28a745'
                      }}
                    >
                      <span style={{ marginRight: '0.5rem', fontSize: '1.1rem' }}>🧾</span>
                      Manage Delivery Receipt
                    </button>
                  )}

                  {canBeFailed && (
                    <button
                      type="button"
                      className="status-update-button failure"
                      onClick={() => onReportFailure(shipment)}
                      style={{ 
                        flex: '1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        // marginTop: (canBeShipped || hasDeliveryReceipt) ? '0.5rem' : '0',
                        cursor: 'pointer',
                        backgroundColor: '#dc3545'
                      }}
                    >
                      <span style={{ marginRight: '0.5rem', fontSize: '1.1rem' }}>⚠️</span>
                      Report Failure
                    </button>
                  )}
                </div>
              )}
              
            </div>
          </div>
          
          <div className="modal-footer" style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '1rem',
            borderTop: '1px solid #e0e0e0'
          }}>
            <div className="footer-left">
              {isDirty && isShipmentEditable && (
                <div className="unsaved-changes" style={{ 
                  fontSize: '0.8rem',
                  color: '#dc3545',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <span style={{ marginRight: '0.25rem' }}>*</span>
                  You have unsaved changes
                </div>
              )}
            </div>
            <div className="footer-right" style={{ display: 'flex', gap: '0.75rem' }}>
              <button 
                type="button" 
                className="cancel-button"
                onClick={handleClose}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: 'white',
                  color: '#333',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                Close
              </button>
              {isShipmentEditable && (
                <button 
                  type="submit" 
                  className="save-button"
                  disabled={!isDirty}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: isDirty ? '#00a8a8' : '#cccccc',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '0.875rem',
                    cursor: isDirty ? 'pointer' : 'not-allowed',
                    transition: 'background-color 0.2s ease',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <span style={{ marginRight: '0.35rem' }}>💾</span>
                  Save Changes
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

// PropTypes for better documentation and validation
ShipmentModal.propTypes = {
  shipment: PropTypes.object.isRequired,
  carriers: PropTypes.array.isRequired,
  employees: PropTypes.array.isRequired,
  getEmployeeFullName: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onShip: PropTypes.func.isRequired,
  onShowDeliveryReceipt: PropTypes.func.isRequired,
  onReportFailure: PropTypes.func.isRequired
};

export default ShipmentModal;