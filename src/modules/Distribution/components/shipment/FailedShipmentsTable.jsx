// components/shipment/FailedShipmentsTable.jsx
import React, { useState } from 'react';

const FailedShipmentsTable = ({ failedShipments, onShipmentSelect, selectedShipment, carriers, employees, getEmployeeFullName }) => {
  const [sortField, setSortField] = useState('failure_date');
  const [sortDirection, setSortDirection] = useState('desc');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);
  
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
    const carrier = carriers.find(c => c.carrier_id === carrierId);
    if (carrier) {
      return carrier.employee_name || carrier.carrier_name;
    }
    return 'Not Assigned';
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
  
  // Get failure info
  const getFailureInfo = (shipment) => {
    if (!shipment.failed_shipment_info) {
      return {
        failure_date: null,
        failure_reason: 'Not available',
        resolution_status: 'Unknown'
      };
    }
    return {
      failure_date: shipment.failed_shipment_info.failure_date,
      failure_reason: shipment.failed_shipment_info.failure_reason || 'Not specified',
      resolution_status: shipment.failed_shipment_info.resolution_status || 'Pending'
    };
  };
  
  // Sort failed shipments
  const sortedShipments = [...failedShipments].sort((a, b) => {
    // Special handling for fields in the failed_shipment_info object
    if (sortField === 'failure_date' || sortField === 'failure_reason' || sortField === 'resolution_status') {
      const infoA = getFailureInfo(a);
      const infoB = getFailureInfo(b);
      
      if (sortField === 'failure_date') {
        const dateA = infoA.failure_date ? new Date(infoA.failure_date) : new Date(0);
        const dateB = infoB.failure_date ? new Date(infoB.failure_date) : new Date(0);
        
        return sortDirection === 'asc' 
          ? dateA - dateB 
          : dateB - dateA;
      }
      
      const valueA = infoA[sortField].toLowerCase();
      const valueB = infoB[sortField].toLowerCase();
      
      return sortDirection === 'asc'
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }
    
    // For other fields, use standard comparison
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
  
  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedShipments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedShipments.length / itemsPerPage);
  
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
  
  // Get resolution status class
  const getResolutionStatusClass = (status) => {
    switch (status) {
      case 'Pending': return 'status-pending';
      case 'In Progress': return 'status-shipped';
      case 'Resolved': return 'status-delivered';
      default: return '';
    }
  };

  return (
    <div className="shipment-table-container">
      <div className="table-metadata">
        <span className="record-count">{sortedShipments.length} failed shipments found</span>
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
                onClick={() => handleSort('failure_date')}
              >
                Failure Date {getSortIcon('failure_date')}
              </th>
              <th 
                className="sortable"
                onClick={() => handleSort('failure_reason')}
              >
                Failure Reason {getSortIcon('failure_reason')}
              </th>
              <th 
                className="sortable"
                onClick={() => handleSort('delivery_type')}
              >
                Delivery Type {getSortIcon('delivery_type')}
              </th>
              <th 
                className="sortable"
                onClick={() => handleSort('resolution_status')}
              >
                Resolution Status {getSortIcon('resolution_status')}
              </th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((shipment, index) => {
                const failureInfo = getFailureInfo(shipment);
                return (
                  <tr 
                    key={shipment.shipment_id} 
                    className={getRowClass(shipment, index)}
                    onClick={() => onShipmentSelect(shipment)}
                  >
                    <td>{shipment.shipment_id}</td>
                    <td>{shipment.tracking_number}</td>
                    <td>{formatDate(failureInfo.failure_date)}</td>
                    <td className="failure-reason-cell">
                      {failureInfo.failure_reason.length > 50 
                        ? `${failureInfo.failure_reason.substring(0, 50)}...` 
                        : failureInfo.failure_reason}
                    </td>
                    <td className="centered-cell">{shipment.delivery_type || 'Unknown'}</td>
                    <td className={`status-cell ${getResolutionStatusClass(failureInfo.resolution_status)}`}>
                      {failureInfo.resolution_status}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="no-data">
                  No failed shipments found. Try adjusting your search.
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

export default FailedShipmentsTable;