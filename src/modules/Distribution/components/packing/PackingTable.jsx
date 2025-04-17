// components/packing/PackingTable.jsx
import React, { useState } from "react";

const PackingTable = ({ packingLists, onListSelect, selectedList, employees }) => {
  // Add sorting state
  const [sortField, setSortField] = useState('packing_list_id');
  const [sortDirection, setSortDirection] = useState('desc');
  
  // Add pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  
  // Handle sort change
  const handleSort = (field) => {
    if (sortField === field) {
      // If already sorting by this field, toggle direction
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Otherwise, sort by the new field in ascending order
      setSortField(field);
      setSortDirection('asc');
    }
    // Reset to first page when sorting changes
    setCurrentPage(1);
  };
  
  // Get the delivery type name
  const getDeliveryTypeName = (type) => {
    switch (type) {
      case 'sales':
        return 'Sales Order';
      case 'service':
        return 'Service Order';
      case 'content':
        return 'Content Order';
      case 'stock':
        return 'Stock Transfer';
      default:
        return 'Unknown';
    }
  };
  
  // Format date string
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit'
      }).format(date);
    } catch (e) {
      return dateString;
    }
  };
  
  // Helper for employee names
  const getEmployeeName = (employeeId) => {
    if (!employeeId) return '-';
    const employee = employees.find(emp => emp.employee_id === employeeId);
    return employee ? employee.full_name : employeeId;
  };
  
  // Find the associated class based on status
  const getStatusClass = (status) => {
    switch (status) {
      case 'Pending':
        return 'status-pending';
      case 'Packed':
        return 'status-packed';
      case 'Shipped':
        return 'status-shipped';
      default:
        return '';
    }
  };
  
  // Sort the packing lists
  const sortedLists = [...packingLists || []].sort((a, b) => {
    let aValue = a[sortField] || '';
    let bValue = b[sortField] || '';
    
    // Handle date comparison
    if (sortField === 'packing_date' && aValue && bValue) {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }
    
    // Handle missing values
    if (!aValue && bValue) return 1;
    if (aValue && !bValue) return -1;
    if (!aValue && !bValue) return 0;
    
    // Compare values
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });
  
  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedLists.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedLists.length / itemsPerPage);
  
  // Render empty state when no data
  if (!packingLists || packingLists.length === 0) {
    return (
      <div className="packing-table-container">
        <div className="table-metadata">
          <span className="record-count">0 packing lists</span>
        </div>
        <div className="table-wrapper">
          <table className="packing-table">
            <thead>
              <tr>
                <th className="sortable" onClick={() => handleSort('packing_list_id')}>
                  Packing ID
                  {sortField === 'packing_list_id' && (
                    <span className="sort-icon">{sortDirection === 'asc' ? '▲' : '▼'}</span>
                  )}
                </th>
                <th className="sortable" onClick={() => handleSort('delivery_type')}>
                  Delivery Type
                  {sortField === 'delivery_type' && (
                    <span className="sort-icon">{sortDirection === 'asc' ? '▲' : '▼'}</span>
                  )}
                </th>
                <th className="sortable" onClick={() => handleSort('delivery_id')}>
                  Delivery ID
                  {sortField === 'delivery_id' && (
                    <span className="sort-icon">{sortDirection === 'asc' ? '▲' : '▼'}</span>
                  )}
                </th>
                <th className="sortable" onClick={() => handleSort('packing_status')}>
                  Status
                  {sortField === 'packing_status' && (
                    <span className="sort-icon">{sortDirection === 'asc' ? '▲' : '▼'}</span>
                  )}
                </th>
                <th className="sortable" onClick={() => handleSort('packed_by')}>
                  Packed By
                  {sortField === 'packed_by' && (
                    <span className="sort-icon">{sortDirection === 'asc' ? '▲' : '▼'}</span>
                  )}
                </th>
                <th className="sortable" onClick={() => handleSort('total_items_packed')}>
                  Items Count
                  {sortField === 'total_items_packed' && (
                    <span className="sort-icon">{sortDirection === 'asc' ? '▲' : '▼'}</span>
                  )}
                </th>
                <th className="sortable" onClick={() => handleSort('packing_type')}>
                  Packing Type
                  {sortField === 'packing_type' && (
                    <span className="sort-icon">{sortDirection === 'asc' ? '▲' : '▼'}</span>
                  )}
                </th>
                <th className="sortable" onClick={() => handleSort('packing_date')}>
                  Packing Date
                  {sortField === 'packing_date' && (
                    <span className="sort-icon">{sortDirection === 'asc' ? '▲' : '▼'}</span>
                  )}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="8" className="no-data">No packing lists found</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="packing-table-container">
      <div className="table-metadata">
        <span className="record-count">{sortedLists.length} packing lists found</span>
        <span className="pagination-info">
          Page {currentPage} of {totalPages || 1}
        </span>
      </div>
      <div className="table-wrapper">
        <table className="packing-table">
          <thead>
            <tr>
              <th className="sortable" onClick={() => handleSort('packing_list_id')}>
                Packing ID
                {sortField === 'packing_list_id' && (
                  <span className="sort-icon">{sortDirection === 'asc' ? '▲' : '▼'}</span>
                )}
              </th>
              <th className="sortable" onClick={() => handleSort('delivery_type')}>
                Delivery Type
                {sortField === 'delivery_type' && (
                  <span className="sort-icon">{sortDirection === 'asc' ? '▲' : '▼'}</span>
                )}
              </th>
              <th className="sortable" onClick={() => handleSort('delivery_id')}>
                Delivery ID
                {sortField === 'delivery_id' && (
                  <span className="sort-icon">{sortDirection === 'asc' ? '▲' : '▼'}</span>
                )}
              </th>
              <th className="sortable" onClick={() => handleSort('packing_status')}>
                Status
                {sortField === 'packing_status' && (
                  <span className="sort-icon">{sortDirection === 'asc' ? '▲' : '▼'}</span>
                )}
              </th>
              <th className="sortable" onClick={() => handleSort('packed_by')}>
                Packed By
                {sortField === 'packed_by' && (
                  <span className="sort-icon">{sortDirection === 'asc' ? '▲' : '▼'}</span>
                )}
              </th>
              <th className="sortable" onClick={() => handleSort('total_items_packed')}>
                Items Count
                {sortField === 'total_items_packed' && (
                  <span className="sort-icon">{sortDirection === 'asc' ? '▲' : '▼'}</span>
                )}
              </th>
              <th className="sortable" onClick={() => handleSort('packing_type')}>
                Packing Type
                {sortField === 'packing_type' && (
                  <span className="sort-icon">{sortDirection === 'asc' ? '▲' : '▼'}</span>
                )}
              </th>
              <th className="sortable" onClick={() => handleSort('packing_date')}>
                Packing Date
                {sortField === 'packing_date' && (
                  <span className="sort-icon">{sortDirection === 'asc' ? '▲' : '▼'}</span>
                )}
              </th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((list, index) => (
              <tr
                key={list.packing_list_id}
                className={`
                  ${index % 2 === 0 ? 'even-row' : 'odd-row'} 
                  ${selectedList && selectedList.packing_list_id === list.packing_list_id ? 'selected-row' : ''}
                `}
                onClick={() => onListSelect(list)}
              >
                <td>{list.packing_list_id}</td>
                <td>{getDeliveryTypeName(list.delivery_type)}</td>
                <td>{list.delivery_id || '-'}</td>
                <td className={`status-cell ${getStatusClass(list.packing_status)}`}>
                  {list.packing_status || '-'}
                </td>
                <td>{getEmployeeName(list.packed_by)}</td>
                <td className="centered-cell">{list.total_items_packed || '0'}</td>
                <td>{list.packing_type || '-'}</td>
                <td>{formatDate(list.packing_date)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add pagination controls */}
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

export default PackingTable;