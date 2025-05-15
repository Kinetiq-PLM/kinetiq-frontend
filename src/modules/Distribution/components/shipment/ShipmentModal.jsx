import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleMap, Marker, DirectionsService, DirectionsRenderer, useLoadScript, Polyline } from '@react-google-maps/api';
import PropTypes from 'prop-types';
import { 
  FaBox, 
  FaBoxes, 
  FaBoxOpen, 
  FaWarehouse, 
  FaMapMarkerAlt, 
  FaFlag, 
  FaTruck, 
  FaFileInvoiceDollar, 
  FaInfoCircle, 
  FaExclamationTriangle, 
  FaRoad, 
  FaClock, 
  FaLightbulb, 
  FaMapMarkedAlt, 
  FaSave, 
  FaMoneyBillWave, 
  FaReceipt, 
  FaClipboardCheck, 
  FaExclamationCircle, 
  FaFileAlt
} from "react-icons/fa";

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
  const [formData, setFormData] = useState({
    carrier_id: shipment.carrier_id || '',
    weight_kg: shipment.shipping_cost_info?.weight_kg || 0,
    distance_km: shipment.shipping_cost_info?.distance_km || 0,
    cost_per_kg: shipment.shipping_cost_info?.cost_per_kg || 150,
    cost_per_km: shipment.shipping_cost_info?.cost_per_km || 20
  });

  const [formErrors, setFormErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  
  const [activeTab, setActiveTab] = useState('details');
  
  const mapsInitializedRef = useRef(false);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyAby5p9XBIsWC1aoy1_RyHxrnlzHhjIoOU",
    preventGoogleFontsLoading: true
  });

  const [sourceCoordinates, setSourceCoordinates] = useState(null);
  const [destinationCoordinates, setDestinationCoordinates] = useState(null);
  const [mapLoading, setMapLoading] = useState(true);
  const [mapError, setMapError] = useState(null);

  const [directions, setDirections] = useState(null);
  const [routeError, setRouteError] = useState(null);
  const [travelMode, setTravelMode] = useState('DRIVING');
  
  const [routeMetrics, setRouteMetrics] = useState({
    distance: 0,
    duration: 0
  });

  const [warehouseCoordinates, setWarehouseCoordinates] = useState([]);
  const [multipleRoutes, setMultipleRoutes] = useState([]);

  // Add this new state to track if distance was auto-calculated
  const [isDistanceAutoSet, setIsDistanceAutoSet] = useState(false);

  const mapContainerStyle = {
    width: '100%',
    height: '300px',
    borderRadius: '4px'
  };

  const defaultCenter = {
    lat: 14.5995,
    lng: 120.9842
  };

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
              if (setCoordinates) {
                setCoordinates(coordinates);
              }
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
        const warehouseCoords = [];
        
        if (shipment.destination_location) {
          try {
            destCoords = await geocodeLocation(shipment.destination_location, setDestinationCoordinates);
          } catch (error) {
            console.error("Destination location geocoding failed:", error);
          }
        }
        
        if (shipment.source_warehouses && shipment.source_warehouses.length > 0) {
          const warehouses = [];
          
          for (const warehouse of shipment.source_warehouses) {
            try {
              const coords = await geocodeLocation(warehouse.location, null);
              if (coords) {
                warehouses.push({
                  id: warehouse.id,
                  location: warehouse.location,
                  name: warehouse.name,
                  coordinates: coords
                });
                warehouseCoords.push(coords);
              }
            } catch (error) {
              console.error(`Geocoding failed for warehouse ${warehouse.location}:`, error);
            }
          }
          
          setWarehouseCoordinates(warehouses);
          
          if (warehouses.length > 0) {
            sourceCoords = warehouses[0].coordinates;
            setSourceCoordinates(sourceCoords);
          }
        } 
        else if (shipment.items_details && shipment.items_details.length > 0) {
          const uniqueWarehouses = {};
          
          for (const item of shipment.items_details) {
            if (item.warehouse_name && !uniqueWarehouses[item.warehouse_id]) {
              uniqueWarehouses[item.warehouse_id] = {
                id: item.warehouse_id,
                name: item.warehouse_name,
                location: item.warehouse_name
              };
            }
          }
          
          const warehouses = [];
          
          for (const warehouseId in uniqueWarehouses) {
            const warehouse = uniqueWarehouses[warehouseId];
            try {
              const coords = await geocodeLocation(warehouse.location, null);
              if (coords) {
                warehouses.push({
                  ...warehouse,
                  coordinates: coords
                });
                warehouseCoords.push(coords);
              }
            } catch (error) {
              console.error(`Geocoding failed for warehouse ${warehouse.location}:`, error);
            }
          }
          
          setWarehouseCoordinates(warehouses);
          
          if (warehouses.length > 0) {
            sourceCoords = warehouses[0].coordinates;
            setSourceCoordinates(sourceCoords);
          }
        } 
        else if (shipment.source_location) {
          try {
            sourceCoords = await geocodeLocation(shipment.source_location, setSourceCoordinates);
            if (sourceCoords) {
              warehouseCoords.push(sourceCoords);
              setWarehouseCoordinates([{
                location: shipment.source_location,
                coordinates: sourceCoords
              }]);
            }
          } catch (error) {
            console.error("Source location geocoding failed:", error);
          }
        }
        
        if (destCoords && warehouseCoords.length > 0) {
          if (warehouseCoords.length > 1) {
            const routePromises = warehouseCoords.map(wCoords => 
              fetchDirectionsPromise(wCoords, destCoords, 'DRIVING')
            );
            
            Promise.allSettled(routePromises).then(results => {
              const validRoutes = results
                .filter(r => r.status === 'fulfilled')
                .map(r => r.value);
              
              let totalDistance = 0;
              let maxDuration = 0;
              
              validRoutes.forEach(route => {
                if (route.routes && route.routes[0] && route.routes[0].legs && route.routes[0].legs[0]) {
                  const leg = route.routes[0].legs[0];
                  totalDistance += leg.distance.value / 1000;
                  const routeDuration = leg.duration.value / 3600;
                  maxDuration = Math.max(maxDuration, routeDuration);
                }
              });
              
              setRouteMetrics({
                distance: totalDistance.toFixed(2),
                duration: maxDuration.toFixed(1)
              });
              
              // Update to set isDistanceAutoSet flag
              if (parseFloat(formData.distance_km) === 0) {
                setFormData(prev => ({
                  ...prev,
                  distance_km: totalDistance.toFixed(2)
                }));
                setIsDistanceAutoSet(true);
              }
              
              setMultipleRoutes(validRoutes);
              setMapLoading(false);
            });
          } else {
            fetchDirections(sourceCoords, destCoords, 'DRIVING');
          }
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
  }, [shipment, isLoaded]);

  const fetchDirections = useCallback((origin, destination, mode) => {
    if (!window.google || !origin || !destination) return;
    
    setMapLoading(true);
    const directionsService = new window.google.maps.DirectionsService();
    
    directionsService.route(
      {
        origin: new window.google.maps.LatLng(origin.lat, origin.lng),
        destination: new window.google.maps.LatLng(destination.lat, destination.lng),
        travelMode: window.google.maps.TravelMode[mode],
        avoidFerries: false,
        avoidHighways: false,
        avoidTolls: false,
        optimizeWaypoints: true
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);
          
          const route = result.routes[0];
          if (route && route.legs && route.legs[0]) {
            const leg = route.legs[0];
            
            const distanceInKm = leg.distance.value / 1000;
            const durationInHours = leg.duration.value / 3600;
            
            setRouteMetrics({
              distance: distanceInKm.toFixed(2),
              duration: durationInHours.toFixed(1)
            });
            
            // Update to set isDistanceAutoSet flag
            if (parseFloat(formData.distance_km) === 0) {
              setFormData(prev => ({
                ...prev,
                distance_km: distanceInKm.toFixed(2)
              }));
              setIsDistanceAutoSet(true);
            }
          }
          
          setRouteError(null);
          setMapLoading(false);
        } else {
          console.warn(`Directions request failed: ${status}`);
          
          const straightLineDistance = calculateHaversineDistance(origin, destination);
          
          setRouteMetrics({
            distance: straightLineDistance.toFixed(2),
            duration: (straightLineDistance / 50).toFixed(1)
          });
          
          // Update to set isDistanceAutoSet flag for straight line distance too
          if (parseFloat(formData.distance_km) === 0) {
            setFormData(prev => ({
              ...prev,
              distance_km: straightLineDistance.toFixed(2)
            }));
            setIsDistanceAutoSet(true);
          }
          
          setRouteError(`Unable to calculate route: ${status}. Using straight-line distance instead.`);
          setDirections(null);
          setMapLoading(false);
        }
      }
    );
  }, [formData.distance_km]);
  
  const calculateHaversineDistance = (point1, point2) => {
    const toRad = value => value * Math.PI / 180;
    const R = 6371;
    
    const dLat = toRad(point2.lat - point1.lat);
    const dLng = toRad(point2.lng - point1.lng);
    
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(toRad(point1.lat)) * Math.cos(toRad(point2.lat)) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const fetchDirectionsPromise = (origin, destination, mode) => {
    return new Promise((resolve, reject) => {
      if (!window.google || !origin || !destination) {
        reject("Google Maps not loaded or invalid coordinates");
        return;
      }
      
      const directionsService = new window.google.maps.DirectionsService();
      
      directionsService.route(
        {
          origin: new window.google.maps.LatLng(origin.lat, origin.lng),
          destination: new window.google.maps.LatLng(destination.lat, destination.lng),
          travelMode: window.google.maps.TravelMode[mode],
          avoidFerries: false,
          avoidHighways: false,
          avoidTolls: false,
          optimizeWaypoints: true
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            resolve(result);
          } else {
            reject(status);
          }
        }
      );
    });
  };

  const getRouteColor = (index) => {
    const colors = ["#0aaceb","#00a8a8", "#ff7043", "#5c6bc0", "#66bb6a", "#ffa726"];
    return colors[index % colors.length];
  };

  const onMapLoad = useCallback((map) => {
    if (warehouseCoordinates.length > 0 && destinationCoordinates) {
      const bounds = new window.google.maps.LatLngBounds();
      warehouseCoordinates.forEach(warehouse => bounds.extend(warehouse.coordinates));
      bounds.extend(destinationCoordinates);
      map.fitBounds(bounds);
    } else if (destinationCoordinates && sourceCoordinates) {
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
  }, [sourceCoordinates, destinationCoordinates, warehouseCoordinates]);

  const calculateShippingCost = () => {
    const weight = parseFloat(formData.weight_kg) || 0;
    const distance = parseFloat(formData.distance_km) || 0;
    const costPerKg = parseFloat(formData.cost_per_kg) || 0;
    const costPerKm = parseFloat(formData.cost_per_km) || 0;
    
    return (weight * costPerKg) + (distance * costPerKm);
  };
  
  const calculateOperationalCost = () => {
    return calculateShippingCost();
  };
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
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
  
  const ErrorSummary = () => {
    if (Object.keys(formErrors).length === 0 || !hasAttemptedSubmit) return null;
    
    return (
      <div className="error-summary" style={{ 
        backgroundColor: 'rgba(220, 53, 69, 0.1)',
        padding: '0.75rem',
        marginBottom: '1rem',
        borderRadius: '4px',
        border: '1px solid rgba(220, 53, 69, 0.3)',
        color: '#dc3545'
      }}>
        <div style={{ fontWeight: '500', marginBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>
          <FaExclamationTriangle style={{ marginRight: '0.5rem' }} />
          Please fix the following issues:
        </div>
        <ul style={{ margin: '0', paddingLeft: '1.5rem' }}>
          {formErrors.carrier_id && <li>Select a carrier for this shipment</li>}
          {formErrors.weight_kg && <li>{formErrors.weight_kg}</li>}
          {formErrors.distance_km && <li>{formErrors.distance_km}</li>}
          {!hasValidShippingDetails && <li>Both weight and distance must be greater than zero</li>}
        </ul>
      </div>
    );
  };  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
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
    
    const error = validateField(name, finalValue);
    setFormErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };
  
  const validateForm = () => {
    const errors = {};
    
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
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!isShipmentEditable) {
      return;
    }
    
    if (!validateForm()) {
      return;
    }
    
    const updates = {};
    
    if (formData.carrier_id !== shipment.carrier_id) {
      updates.carrier_id = formData.carrier_id;
    }
    
    const shippingCostChanged = 
      formData.weight_kg != shipment.shipping_cost_info?.weight_kg ||
      formData.distance_km != shipment.shipping_cost_info?.distance_km ||
      formData.cost_per_kg != shipment.shipping_cost_info?.cost_per_kg ||
      formData.cost_per_km != shipment.shipping_cost_info?.cost_per_km;
    
    if (shippingCostChanged) {
      const shippingCost = calculateShippingCost();
      
      updates.shipping_cost = {
        weight_kg: parseFloat(formData.weight_kg) || 0,
        distance_km: parseFloat(formData.distance_km) || 0,
        cost_per_kg: parseFloat(formData.cost_per_kg) || 0,
        cost_per_km: parseFloat(formData.cost_per_km) || 0,
        total_shipping_cost: shippingCost
      };
      
      updates.operational_cost = {
        additional_cost: 0,
        total_operational_cost: shippingCost
      };
    }
    
    onSave(shipment, updates);
    
    setIsDirty(false);
  };
  
  const handleShip = () => {
    setHasAttemptedSubmit(true);
    
    if (!validateForm()) {
      toast.error('Please fix the validation errors before shipping');
      
      if (formErrors.carrier_id) {
        setActiveTab('details');
      } else if (formErrors.weight_kg || formErrors.distance_km) {
        setActiveTab('costs');
      }
      
      return;
    }
    
    const shippingCost = calculateShippingCost();
    
    onShip(shipment, {
      carrier_id: formData.carrier_id,
      shipping_cost_info: {
        weight_kg: parseFloat(formData.weight_kg) || 0,
        distance_km: parseFloat(formData.distance_km) || 0,
        cost_per_kg: parseFloat(formData.cost_per_kg) || 0,
        cost_per_km: parseFloat(formData.cost_per_km) || 0,
        total_shipping_cost: shippingCost
      },
      operational_cost_info: {
        additional_cost: 0,
        total_operational_cost: shippingCost
      }
    });
  };
  
  const handleClose = () => {
    if (isDirty) {
      const message = Object.keys(formErrors).length > 0
        ? 'You have unsaved changes with validation errors. If you close now, your changes will be lost.'
        : 'You have unsaved changes. Would you like to save before closing?';
      
      if (window.confirm(message)) {
        onClose();
      }
    } else {
      onClose();
    }
  };
  
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
  
  const getCarrierName = (carrierId) => {
    const carrier = carriers.find(c => c.carrier_id === carrierId);
    return carrier ? carrier.carrier_name : 'Not Assigned';
  };

  const canBeShipped = shipment.shipment_status === 'Pending';
  const hasDeliveryReceipt = shipment.shipment_status === 'Shipped' || shipment.shipment_status === 'Delivered';
  const canBeFailed = shipment.shipment_status === 'Pending' || shipment.shipment_status === 'Shipped';
  const isShipmentEditable = shipment.shipment_status === 'Pending';
  const hasValidShippingDetails = parseFloat(formData.weight_kg) > 0 && parseFloat(formData.distance_km) > 0;
  const isActionDisabled = !formData.carrier_id || !hasValidShippingDetails;
  const shouldShowMap = shipment.destination_location || shipment.source_location;
  const polylinePath = sourceCoordinates && destinationCoordinates ? [sourceCoordinates, destinationCoordinates] : [];
  
  const polylineOptions = {
    strokeColor: "#4285F4",
    strokeOpacity: 0.8,
    strokeWeight: 5,
    geodesic: true,
  };
  
  const getStatusInfo = (status) => {
    switch (status) {
      case 'Pending':
        return { 
          class: 'status-pending', 
          icon: <FaExclamationCircle />, 
          color: '#6c757d',
          bgColor: 'rgba(108, 117, 125, 0.1)'
        };
      case 'Shipped':
        return { 
          class: 'status-shipped', 
          icon: <FaTruck />, 
          color: '#007bff',
          bgColor: 'rgba(0, 123, 255, 0.1)'
        };
      case 'Delivered':
        return { 
          class: 'status-delivered', 
          icon: <FaClipboardCheck />, 
          color: '#28a745',
          bgColor: 'rgba(40, 167, 69, 0.1)'
        };
      case 'Failed':
        return { 
          class: 'status-failed', 
          icon: <FaExclamationTriangle />, 
          color: '#dc3545',
          bgColor: 'rgba(220, 53, 69, 0.1)'
        };
      default:
        return { 
          class: '', 
          icon: <FaInfoCircle />, 
          color: '#6c757d',
          bgColor: 'rgba(108, 117, 125, 0.1)'
        };
    }
  };
  
  const statusInfo = getStatusInfo(shipment.shipment_status);
  
  const renderItemsByWarehouses = () => {
    const warehouseGroups = [];
    const warehouseMap = {};
    let totalQuantity = 0;
    
    if (shipment?.items_details?.length) {
      shipment.items_details.forEach(item => {
        const warehouseId = item.warehouse_id || 'unknown';
        totalQuantity += parseInt(item.quantity) || 0;
        
        if (!warehouseMap[warehouseId]) {
          const group = {
            warehouseId,
            warehouseName: item.warehouse_name || 'Unknown Warehouse',
            items: [],
            totalQuantity: 0
          };
          warehouseMap[warehouseId] = group;
          warehouseGroups.push(group);
        }
        warehouseMap[warehouseId].items.push(item);
        warehouseMap[warehouseId].totalQuantity += parseInt(item.quantity) || 0;
      });
    }
  
    const hasMultipleWarehouses = warehouseGroups.length > 1;
  
    return (
      <>
        <h4 className="section-title">
          <FaBoxOpen className="section-icon" style={{marginRight: '8px'}} />
          Shipment Items ({shipment?.items_details?.length || 0} items, {totalQuantity} units)
        </h4>
  
        {warehouseGroups.length > 0 ? (
          warehouseGroups.map((group, groupIndex) => (
            <div key={group.warehouseId} className="warehouse-group">
              <h5 className="warehouse-name">
                <FaWarehouse className="warehouse-icon" style={{marginRight: '8px'}} /> {group.warehouseName}
                <span className="warehouse-items-count">
                  {group.items.length} item{group.items.length !== 1 ? 's' : ''}, {group.totalQuantity} units
                </span>
              </h5>
              
              <div className="items-table-container">
                <table className="items-table">
                  <thead>
                    <tr>
                      <th>Item Name</th>
                      <th>Item Number</th>
                      <th>Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.items.map((item, itemIndex) => (
                      <tr key={itemIndex}>
                        <td>{item.item_name}</td>
                        <td>{item.item_no || '-'}</td>
                        <td>{item.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {groupIndex < warehouseGroups.length - 1 && <hr className="warehouse-divider" />}
            </div>
          ))
        ) : (
          <div className="items-table-container empty-state">
            <div className="no-items-message">
              <FaBoxOpen className="empty-icon" style={{fontSize: '2rem', marginBottom: '1rem', color: '#dee2e6'}} />
              <p>No item details available for this shipment</p>
            </div>
          </div>
        )}
      </>
    );
  };

  // Add a function to manually override the auto-set distance
  const handleOverrideDistance = () => {
    if (window.confirm("Are you sure you want to override the calculated distance? The automatically calculated distance is based on optimal routing.")) {
      setIsDistanceAutoSet(false);
    }
  };

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
                // display: 'inline-block',
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
        
        <div className="tab-navigation">
          <button 
            className={`tab ${activeTab === 'details' ? 'active' : ''}`}
            onClick={() => setActiveTab('details')}
          >
            Shipment Details
          </button>
          <button 
            className={`tab ${activeTab === 'items' ? 'active' : ''}`} 
            onClick={() => setActiveTab('items')}
          >
            {/* <FaBoxOpen style={{marginRight: '6px', fontSize: '0.9rem'}} /> */}
            Items ({shipment?.items_details?.length || 0})
          </button>
          <button 
            className={`tab ${activeTab === 'route' ? 'active' : ''}`}
            onClick={() => setActiveTab('route')}
            disabled={!shouldShowMap}
          >
            {/* <FaMapMarkedAlt style={{marginRight: '6px', fontSize: '0.9rem'}} /> */}
            Route Map
          </button>
          <button 
            className={`tab ${activeTab === 'costs' ? 'active' : ''}`}
            onClick={() => setActiveTab('costs')}
          >
            {/* <FaMoneyBillWave style={{marginRight: '6px', fontSize: '0.9rem'}} /> */}
            Shipping Costs
          </button>
          <button 
            className={`tab ${activeTab === 'related' ? 'active' : ''}`}
            onClick={() => setActiveTab('related')}
          >
            {/* <FaFileAlt style={{marginRight: '6px', fontSize: '0.9rem'}} /> */}
            Related Info
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
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
                  <FaInfoCircle style={{fontSize: '0.8rem'}} />
                </div>
                <span style={{ color: statusInfo.color }}>
                  This shipment has been processed and cannot be edited. You can only view details or manage the delivery receipt.
                </span>
              </div>
            )}
            
            {activeTab === 'details' && (
              <div className="tab-content">
                {hasAttemptedSubmit && formErrors.carrier_id && <ErrorSummary />}
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
                        <FaMapMarkerAlt style={{ marginRight: '0.5rem', color: '#00a8a8' }} />
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
                        <FaFlag style={{ marginRight: '0.5rem', color: '#dc3545' }} />
                        Destination
                      </div>
                      <div style={{ fontSize: '0.9rem' }}>
                        {shipment.destination_location || 'Not specified'}
                      </div>
                    </div>
                  </div>
                </div>
                
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
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center' 
                    }}>
                      <FaExclamationTriangle style={{ marginRight: '0.25rem' }} />
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
                          <FaRoad style={{ marginRight: '0.5rem', color: '#007bff' }} />
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
                          <FaClock style={{ marginRight: '0.5rem', color: '#007bff' }} />
                          {routeMetrics.duration > 0 ? `${routeMetrics.duration} hours` : `${Math.ceil(formData.distance_km / 50)} hours`}
                        </div>
                      </div>
                    </div>
                    
                    <div className="map-container" style={{ position: 'relative' }}>
                    {isLoaded ? (
                          <GoogleMap
                            mapContainerStyle={mapContainerStyle}
                            center={destinationCoordinates || sourceCoordinates || defaultCenter}
                            zoom={14}
                            onLoad={onMapLoad}
                          >
                            {warehouseCoordinates.length > 0 && warehouseCoordinates.map((warehouse, index) => (
                              <Marker
                                key={`warehouse-${warehouse.id || index}`}
                                position={warehouse.coordinates}
                                icon={{
                                  url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
                                  labelOrigin: new window.google.maps.Point(15, -10)
                                }}
                                label={{
                                  text: `Warehouse ${index + 1}`,
                                  color: "#333",
                                  fontSize: "12px",
                                  fontWeight: "bold"
                                }}
                              />
                            ))}
                            
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
                            
                            {multipleRoutes.length > 0 && multipleRoutes.map((route, index) => (
                              <DirectionsRenderer
                                key={`route-${index}`}
                                directions={route}
                                options={{
                                  suppressMarkers: true,
                                  polylineOptions: {
                                    strokeColor: getRouteColor(index),
                                    strokeOpacity: 0.8,
                                    strokeWeight: 5,
                                  }
                                }}
                              />
                            ))}
                            
                            {directions && multipleRoutes.length === 0 && (
                              <DirectionsRenderer
                                directions={directions}
                                options={{
                                  suppressMarkers: true,
                                  polylineOptions: {
                                    strokeColor: "#0f53ff",
                                    strokeOpacity: 0.8,
                                    strokeWeight: 5,
                                  }
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
                            <FaMapMarkedAlt style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#6c757d' }} />
                            <div>Loading Google Maps...</div>
                          </div>
                        </div>
                      )}
                      
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
                          <FaExclamationTriangle style={{ marginRight: '0.5rem' }} />
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
                          <FaExclamationTriangle style={{ marginRight: '0.5rem' }} />
                          {mapError || "Failed to load Google Maps"}
                        </div>
                      )}
                    </div>
                    
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
                      <FaLightbulb style={{ marginRight: '0.5rem' }} />
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
                    <FaMapMarkedAlt style={{ fontSize: '3rem', marginBottom: '1rem', color: '#6c757d' }} />
                    <h4 style={{ marginBottom: '0.5rem' }}>No Route Data Available</h4>
                    <p>Source or destination location information is missing.</p>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'costs' && (
              <div className="tab-content">
                {hasAttemptedSubmit && (formErrors.weight_kg || formErrors.distance_km) && <ErrorSummary />}
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
                          }}>
                            <FaExclamationTriangle />
                          </div>
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
                          disabled={!isShipmentEditable || isDistanceAutoSet}
                          style={{ 
                            borderColor: formErrors.distance_km ? '#dc3545' : '',
                            backgroundColor: isDistanceAutoSet ? '#f0f8ff' : '',
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
                          }}>
                            <FaExclamationTriangle />
                          </div>
                        )}
                        {isDistanceAutoSet && (
                          <div className="auto-set-icon" style={{ 
                            position: 'absolute', 
                            right: '10px', 
                            top: '50%', 
                            transform: 'translateY(-50%)',
                            color: '#007bff',
                            fontSize: '0.8rem'
                          }}>
                            <FaMapMarkedAlt />
                          </div>
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
                      {isDistanceAutoSet && (
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginTop: '0.25rem'
                        }}>
                          <small style={{ color: '#007bff', display: 'flex', alignItems: 'center' }}>
                            <FaInfoCircle style={{ marginRight: '0.25rem', fontSize: '0.75rem' }} />
                            Auto-calculated from map
                          </small>
                          {isShipmentEditable && (
                            <button
                              type="button"
                              onClick={handleOverrideDistance}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#6c757d',
                                fontSize: '0.75rem',
                                textDecoration: 'underline',
                                cursor: 'pointer'
                              }}
                            >
                              Override
                            </button>
                          )}
                        </div>
                      )}
                      {!isDistanceAutoSet && (
                        <small className="limit-text">Maximum: 2000km</small>
                      )}
                    </div>
                  </div>
                </div>
                
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
                    
                    <div className="cost-total-row" style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      padding: '0.75rem',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '4px',
                      marginTop: '0.75rem'
                    }}>
                      <span className="cost-total-label" style={{ fontWeight: '600' }}>Total Cost:</span>
                      <span className="cost-total-value" style={{ 
                        fontWeight: '700',
                        fontSize: '1.1rem',
                        color: '#00a8a8'
                      }}>
                        {formatCurrency(calculateShippingCost())}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'related' && (
              <div className="tab-content">
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
                        <FaBoxes style={{ 
                          fontSize: '1.25rem', 
                          marginRight: '0.5rem',
                          color: shipment.packing_list_id ? '#00a8a8' : '#6c757d'
                        }} />
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
                        <FaReceipt style={{ 
                          fontSize: '1.25rem', 
                          marginRight: '0.5rem',
                          color: shipment.delivery_receipt_id ? '#00a8a8' : '#6c757d'
                        }} />
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
                        <FaTruck style={{ 
                          fontSize: '1.25rem', 
                          marginRight: '0.5rem',
                          color: shipment.delivery_id ? '#00a8a8' : '#6c757d'
                        }} />
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

            {activeTab === 'items' && (
              <div className="items-section">
                {renderItemsByWarehouses()}
              </div>
            )}
            
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
                <FaTruck style={{ marginRight: '0.5rem', color: '#00a8a8' }} />
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
                  <FaClipboardCheck style={{ marginRight: '0.5rem' }} />
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
                  <FaExclamationTriangle style={{ marginRight: '0.5rem' }} />
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
                    >
                      <FaBox style={{ marginRight: '0.5rem' }} />
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
                      <FaReceipt style={{ marginRight: '0.5rem' }} />
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
                        cursor: 'pointer',
                        backgroundColor: '#dc3545'
                      }}
                    >
                      <FaExclamationTriangle style={{ marginRight: '0.5rem' }} />
                      Report Failure
                    </button>
                  )}

                  {/* {canBeShipped && isActionDisabled && (
                    <div style={{ 
                      fontSize: '0.8rem', 
                      color: '#666', 
                      padding: '0.5rem',
                      backgroundColor: 'rgba(0, 0, 0, 0.05)',
                      borderRadius: '4px'
                    }}>
                      <span style={{ fontWeight: '500' }}>To ship this package:</span>
                      <ul style={{ margin: '0.25rem 0 0 0', paddingLeft: '1.25rem' }}>
                        {!formData.carrier_id && <li>Select a carrier</li>}
                        {parseFloat(formData.weight_kg) <= 0 && <li>Enter package weight</li>}
                        {parseFloat(formData.distance_km) <= 0 && <li>Enter shipping distance</li>}
                      </ul>
                    </div>
                  )} */}
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
                  <FaExclamationCircle style={{ marginRight: '0.25rem' }} />
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
                  <FaSave style={{ marginRight: '0.35rem' }} />
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