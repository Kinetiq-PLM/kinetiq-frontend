// components/shipment/ShipmentTable.jsx
import React, { useState } from 'react';

const ShipmentTable = ({ shipments, onShipmentSelect, selectedShipment, carriers }) => {
  const [sortField, setSortField] = useState('shipment_id');
  const [sortDirection, setSortDirection] = useState('asc');
  
  // Handle sort change
  const handleSort = (field) => {
    if (sortField === field) {
      // If already sorting by this field, toggle direction
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New sort field, default to ascending
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Get carrier name by ID
  const getCarrierName = (carrierId) => {
    const carrier = carriers.find(c => c.carrier_id === carrierId);
    return carrier ? carrier.carrier_name : 'Not Assigned';
  };
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Not Set';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Sort shipments
  const sortedShipments = [...shipments].sort((a, b) => {
    // Handle null/undefined values
    if (a[sortField] === null || a[sortField] === undefined) return 1;
    if (b[sortField] === null || b[sortField] === undefined) return -1;
    
    // For dates
    if (sortField.includes('date')) {
      const dateA = a[sortField] ? new Date(a[sortField]) : new Date(0);
      const dateB = b[sortField] ? new Date(b[sortField]) : new Date(0);
      
      return sortDirection === 'asc' 
        ? dateA - dateB 
        : dateB - dateA;
    }
    
    // For strings
    if (typeof a[sortField] === 'string') {
      const valueA = a[sortField].toLowerCase();
      const valueB = b[sortField].toLowerCase();
      
      return sortDirection === 'asc'
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }
    
    // For numbers and other types
    return sortDirection === 'asc'
      ? a[sortField] - b[sortField]
      : b[sortField] - a[sortField];
  });
  
  // Get status class
  const getStatusClass = (status) => {
    switch (status) {
      case 'Pending': return 'status-pending';
      case 'Shipped': return 'status-shipped';
      case 'Delivered': return 'status-delivered';
      case 'Failed': return 'status-failed';
      default: return '';
    }
  };
  
  // Get row class
  const getRowClass = (shipment, index) => {
    let classes = [];
    
    // Add even/odd class
    classes.push(index % 2 === 0 ? 'even-row' : 'odd-row');
    
    // Add selected class if this shipment is selected
    if (selectedShipment && selectedShipment.shipment_id === shipment.shipment_id) {
      classes.push('selected-row');
    }
    
    return classes.join(' ');
  };
  
  // Get sort icon
  const getSortIcon = (field) => {
    if (sortField !== field) return null;
    
    return (
      <span className="sort-icon">
        {sortDirection === 'asc' ? '↑' : '↓'}
      </span>
    );
  };

  return (
    <div className="shipment-table-container">
      <div className="table-metadata">
        <span>{sortedShipments.length} shipments found</span>
      </div>
      
      <div className="table-wrapper">
        <table className="shipment-table">
          <thead>
            <tr>
              <th 
                className="sortable"
                onClick={() => handleSort('shipment_id')}
              >
                Shipment ID {getSortIcon('shipment_id')}
              </th>
              <th 
                className="sortable"
                onClick={() => handleSort('tracking_number')}
              >
                Tracking Number {getSortIcon('tracking_number')}
              </th>
              <th 
                className="sortable"
                onClick={() => handleSort('carrier_id')}
              >
                Carrier {getSortIcon('carrier_id')}
              </th>
              <th 
                className="sortable"
                onClick={() => handleSort('shipment_date')}
              >
                Shipment Date {getSortIcon('shipment_date')}
              </th>
              <th 
                className="sortable"
                onClick={() => handleSort('estimated_arrival_date')}
              >
                Est. Arrival {getSortIcon('estimated_arrival_date')}
              </th>
              <th 
                className="sortable"
                onClick={() => handleSort('delivery_type')}
              >
                Type {getSortIcon('delivery_type')}
              </th>
              <th 
                className="sortable"
                onClick={() => handleSort('shipment_status')}
              >
                Status {getSortIcon('shipment_status')}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedShipments.length > 0 ? (
              sortedShipments.map((shipment, index) => (
                <tr 
                  key={shipment.shipment_id} 
                  className={getRowClass(shipment, index)}
                  onClick={() => onShipmentSelect(shipment)}
                >
                  <td>{shipment.shipment_id}</td>
                  <td>{shipment.tracking_number}</td>
                  <td>{getCarrierName(shipment.carrier_id)}</td>
                  <td>{formatDate(shipment.shipment_date)}</td>
                  <td>{formatDate(shipment.estimated_arrival_date)}</td>
                  <td className="centered-cell">{shipment.delivery_type || 'Unknown'}</td>
                  <td className={`status-cell ${getStatusClass(shipment.shipment_status)}`}>
                    {shipment.shipment_status}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-data">
                  No shipments found. Try adjusting your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShipmentTable;