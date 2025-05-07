// components/shipment/DeliveredShipmentsTable.jsx
import React, { useState } from 'react';

const DeliveredShipmentsTable = ({ shipments, onShipmentSelect, selectedShipment, carriers, employees, getEmployeeFullName, getReadableShipmentType }) => {
  const [sortField, setSortField] = useState('shipment_id');
  const [sortDirection, setSortDirection] = useState('asc');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  
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
    // Reset to first page when sorting changes
    setCurrentPage(1);
  };
  
  // Get carrier name by ID
  const getCarrierName = (carrierId) => {
    if (!carrierId) return 'Not Assigned';
    const carrier = carriers.find(c => c.carrier_id === carrierId);
    if (!carrier) return 'Not Assigned';
    
    // Use the getEmployeeFullName function to get the employee's full name
    return getEmployeeFullName(carrier.carrier_name);
  };
  
  // Format date with better error handling
  const formatDate = (dateString) => {
    if (!dateString) return 'Not Set';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Error';
    }
  };
  
  // Sort shipments with null/undefined protection
  const sortedShipments = [...shipments].sort((a, b) => {
    // Handle null/undefined values
    const valueA = a[sortField];
    const valueB = b[sortField];
    
    if (valueA === null || valueA === undefined) return sortDirection === 'asc' ? 1 : -1;
    if (valueB === null || valueB === undefined) return sortDirection === 'asc' ? -1 : 1;
    
    // For dates
    if (sortField.includes('date')) {
      const dateA = valueA ? new Date(valueA) : new Date(0);
      const dateB = valueB ? new Date(valueB) : new Date(0);
      
      return sortDirection === 'asc' 
        ? dateA - dateB 
        : dateB - dateA;
    }
    
    // For carrier_id, sort by employee name
    if (sortField === 'carrier_id') {
      const carrierA = carriers.find(c => c.carrier_id === valueA);
      const carrierB = carriers.find(c => c.carrier_id === valueB);
      
      const nameA = carrierA && carrierA.carrier_name ? getEmployeeFullName(carrierA.carrier_name).toLowerCase() : '';
      const nameB = carrierB && carrierB.carrier_name ? getEmployeeFullName(carrierB.carrier_name).toLowerCase() : '';
      
      return sortDirection === 'asc'
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    }

    // For strings
    if (typeof valueA === 'string') {
      return sortDirection === 'asc'
        ? valueA.toLowerCase().localeCompare(valueB.toLowerCase())
        : valueB.toLowerCase().localeCompare(valueA.toLowerCase());
    }
    
    // For numbers and other types
    return sortDirection === 'asc'
      ? valueA - valueB
      : valueB - valueA;
  });
  
  // Calculate pagination
  const totalItems = sortedShipments.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  
  const indexOfLastItem = safeCurrentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedShipments.slice(indexOfFirstItem, indexOfLastItem);
  
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
        {sortDirection === 'asc' ? '▲' : '▼'}
      </span>
    );
  };

  return (
    <div className="shipment-table-container">
      <div className="table-metadata">
        <span className="record-count">{sortedShipments.length} deliveries found</span>
        <span className="pagination-info">
          Page {currentPage} of {totalPages || 1}
        </span>
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
                onClick={() => handleSort('actual_arrival_date')}
              >
                Delivery Date {getSortIcon('actual_arrival_date')}
              </th>
              <th 
                className="sortable"
                onClick={() => handleSort('delivery_type')}
              >
                Type {getSortIcon('delivery_type')}
              </th>
              <th>Receipt Status</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((shipment, index) => (
                <tr 
                  key={shipment.shipment_id} 
                  className={getRowClass(shipment, index)}
                  onClick={() => onShipmentSelect(shipment)}
                >
                  <td>{shipment.shipment_id}</td>
                  <td>{shipment.tracking_number}</td>
                  <td>{getCarrierName(shipment.carrier_id)}</td>
                  <td>{formatDate(shipment.shipment_date)}</td>
                  <td>{formatDate(shipment.actual_arrival_date)}</td>
                  <td className="centered-cell">{getReadableShipmentType(shipment)}</td> {/* Pass the whole shipment object */}
                  <td className="status-cell status-delivered">
                    {shipment.delivery_receipt_info?.receipt_status || 'Received'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={window.innerWidth <= 576 ? 3 : 7} className="no-data">
                  No delivered shipments found. Try adjusting your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="pagination-controls">
          <button
            className="pagination-button"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          
          <div className="page-numbers">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Logic to show relevant page numbers around current page
              const pageNum = totalPages <= 5 
                ? i + 1
                : currentPage <= 3
                  ? i + 1
                  : currentPage >= totalPages - 2
                    ? totalPages - 4 + i
                    : currentPage - 2 + i;
              
              return (
                <button
                  key={pageNum}
                  className={`page-number ${currentPage === pageNum ? 'active' : ''}`}
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          
          <button
            className="pagination-button"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default DeliveredShipmentsTable;