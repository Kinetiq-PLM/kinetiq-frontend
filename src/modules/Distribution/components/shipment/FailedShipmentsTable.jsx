// components/shipment/FailedShipmentsTable.jsx
import React, { useState } from 'react';

const FailedShipmentsTable = ({ failedShipments, onShipmentSelect, selectedShipment, carriers, employees, getEmployeeFullName }) => {
  const [sortField, setSortField] = useState('failure_date');
  const [sortDirection, setSortDirection] = useState('desc');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7);
  
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
  
  // Sort failed shipments
  const sortedShipments = [...failedShipments].sort((a, b) => {
    // Get values based on sort field, handling the new structure
    const getValueByField = (item, field) => {
      if (field === 'tracking_number' || field === 'delivery_type') {
        return item.shipment_details?.[field] || '';
      }
      return item[field] || '';
    };
    
    const valueA = getValueByField(a, sortField);
    const valueB = getValueByField(b, sortField);
    
    // For dates
    if (sortField === 'failure_date') {
      const dateA = valueA ? new Date(valueA) : new Date(0);
      const dateB = valueB ? new Date(valueB) : new Date(0);
      
      return sortDirection === 'asc' 
        ? dateA - dateB 
        : dateB - dateA;
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
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedShipments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedShipments.length / itemsPerPage);
  
  // Get row class
  const getRowClass = (failedShipment, index) => {
    let classes = [];
    
    // Add even/odd class
    classes.push(index % 2 === 0 ? 'even-row' : 'odd-row');
    
    // Add selected class if this shipment is selected
    if (selectedShipment && selectedShipment.shipment_id === failedShipment.shipment_id) {
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

  // Handle the click to show shipment details - adapt to the new structure
  const handleRowClick = (failedShipment) => {
    // If there's shipment_details in the failed shipment, pass those to the parent
    if (failedShipment.shipment_details) {
      // Merge important failed shipment details into the shipment object
      const shipmentWithFailureDetails = {
        ...failedShipment.shipment_details,
        failed_shipment_info: {
          failed_shipment_id: failedShipment.failed_shipment_id,
          failure_date: failedShipment.failure_date,
          failure_reason: failedShipment.failure_reason,
          resolution_status: failedShipment.resolution_status
        }
      };
      onShipmentSelect(shipmentWithFailureDetails);
    } else {
      // Fallback if structure is unexpected
      onShipmentSelect(failedShipment);
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
        <table className="shipment-table failed-shipments-table">
          <thead>
            <tr>
              <th 
                className="sortable"
                onClick={() => handleSort('failed_shipment_id')}
              >
                Failed Shipment ID {getSortIcon('failed_shipment_id')}
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
              currentItems.map((failedShipment, index) => (
                <tr 
                  key={failedShipment.failed_shipment_id} 
                  className={getRowClass(failedShipment, index)}
                  onClick={() => handleRowClick(failedShipment)}
                >
                  <td>{failedShipment.failed_shipment_id}</td>
                  <td>{failedShipment.shipment_details?.tracking_number || 'N/A'}</td>
                  <td>{formatDate(failedShipment.failure_date)}</td>
                  <td className="failure-reason-cell">
                    {failedShipment.failure_reason ? 
                      (failedShipment.failure_reason.length > 50 
                        ? `${failedShipment.failure_reason.substring(0, 50)}...` 
                        : failedShipment.failure_reason)
                      : 'N/A'}
                  </td>
                  <td className="centered-cell">{failedShipment.shipment_details?.delivery_type || 'Unknown'}</td>
                  <td className={`status-cell ${getResolutionStatusClass(failedShipment.resolution_status)}`}>
                    {failedShipment.resolution_status}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={window.innerWidth <= 576 ? 3 : 6} className="no-data">
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