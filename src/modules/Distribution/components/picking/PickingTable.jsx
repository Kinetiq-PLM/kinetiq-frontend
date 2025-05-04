// components/picking/PickingTable.jsx
import React, { useState } from 'react';
import '../../styles/Picking.css';

const PickingTable = ({ pickingLists, onListSelect, selectedList, employees }) => {
  const [sortField, setSortField] = useState('picking_list_id');
  const [sortDirection, setSortDirection] = useState('desc');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
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
  
  // Sort the picking lists
  const sortedLists = [...pickingLists].sort((a, b) => {
    let aValue = a[sortField] || '';
    let bValue = b[sortField] || '';
    
    // Handle date comparison
    if (sortField === 'picked_date' && aValue && bValue) {
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
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  // Get status display class
  const getStatusClass = (status) => {
    switch (status) {
      case 'Not Started': return 'status-not-started';
      case 'In Progress': return 'status-in-progress';
      case 'Completed': return 'status-completed';
      default: return '';
    }
  };
  
  // Get delivery type display
  const getDeliveryTypeDisplay = (type) => {
    switch (type) {
      case 'sales': return 'Sales Order';
      case 'service': return 'Service Order';
      case 'content': return 'Content Delivery';
      case 'stock': return 'Stock Transfer';
      default: return 'Unknown';
    }
  };
  
  const getEmployeeName = (employeeId) => {
    if (!employeeId) return '-';
    const employee = employees.find(emp => emp.employee_id === employeeId);
    return employee ? employee.full_name : employeeId;
  };

  // New function to determine warehouse display value
  const getWarehouseDisplay = (list) => {
    // If there's a warehouse name, return it
    if (list.warehouse_name) return list.warehouse_name;
    if (list.warehouse_id) return list.warehouse_id;
    
    // If we have items from multiple warehouses
    if (list.items_details && list.items_details.length > 0) {
      // Get unique warehouse IDs
      const uniqueWarehouses = new Set(
        list.items_details
          .filter(item => item.warehouse_id || item.warehouse_name)
          .map(item => item.warehouse_id || item.warehouse_name)
      );
      
      if (uniqueWarehouses.size > 1) {
        return "Multiple Warehouses";
      } else if (uniqueWarehouses.size === 1) {
        // Get the first (and only) warehouse name
        return list.items_details.find(item => item.warehouse_name)?.warehouse_name || 
               Array.from(uniqueWarehouses)[0] || '-';
      }
    }
    
    return '-';
  };

  return (
    <div className="picking-table-container">
      <div className="table-metadata">
        <span className="record-count">{sortedLists.length} picking lists found</span>
        <span className="pagination-info">
          Page {currentPage} of {totalPages || 1}
        </span>
      </div>
      
      <div className="table-wrapper">
        <table className="picking-table">
          <thead>
            <tr>
              {/* Commented out Picking ID column
              <th 
                className="sortable" 
                onClick={() => handleSort('picking_list_id')}
              >
                Picking ID
                {sortField === 'picking_list_id' && (
                  <span className="sort-icon">{sortDirection === 'asc' ? '▲' : '▼'}</span>
                )}
              </th>
              */}
              
              {/* Commented out Order Type column
              <th 
                className="sortable" 
                onClick={() => handleSort('is_external')}
              >
                Order Type
                {sortField === 'is_external' && (
                  <span className="sort-icon">{sortDirection === 'asc' ? '▲' : '▼'}</span>
                )}
              </th>
              */}

              <th 
                className="sortable" 
                onClick={() => handleSort('delivery_id')}
              >
                Delivery ID
                {sortField === 'delivery_id' && (
                  <span className="sort-icon">{sortDirection === 'asc' ? '▲' : '▼'}</span>
                )}
              </th>

              <th 
                className="sortable" 
                onClick={() => handleSort('delivery_type')}
              >
                Delivery Type
                {sortField === 'delivery_type' && (
                  <span className="sort-icon">{sortDirection === 'asc' ? '▲' : '▼'}</span>
                )}
              </th>

              <th 
                className="sortable" 
                onClick={() => handleSort('warehouse_name')}
              >
                Warehouse
                {sortField === 'warehouse_name' && (
                  <span className="sort-icon">{sortDirection === 'asc' ? '▲' : '▼'}</span>
                )}
              </th>
              
              <th 
                className="sortable" 
                onClick={() => handleSort('items_details')}
              >
                Items
                {sortField === 'items_details' && (
                  <span className="sort-icon">{sortDirection === 'asc' ? '▲' : '▼'}</span>
                )}
              </th>
              
              <th 
                className="sortable" 
                onClick={() => handleSort('picked_by')}
              >
                Assigned To
                {sortField === 'picked_by' && (
                  <span className="sort-icon">{sortDirection === 'asc' ? '▲' : '▼'}</span>
                )}
              </th>
              
              <th 
                className="sortable" 
                onClick={() => handleSort('picked_status')}
              >
                Status
                {sortField === 'picked_status' && (
                  <span className="sort-icon">{sortDirection === 'asc' ? '▲' : '▼'}</span>
                )}
              </th>
              
              <th 
                className="sortable" 
                onClick={() => handleSort('picked_date')}
              >
                Date Picked
                {sortField === 'picked_date' && (
                  <span className="sort-icon">{sortDirection === 'asc' ? '▲' : '▼'}</span>
                )}
              </th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((list, index) => (
                <tr 
                  key={list.picking_list_id}
                  className={`${index % 2 === 0 ? 'even-row' : 'odd-row'} ${selectedList && selectedList.picking_list_id === list.picking_list_id ? 'selected-row' : ''}`}
                  onClick={() => onListSelect(list)}
                >
                  {/* Commented out Picking ID cell
                  <td>{list.picking_list_id}</td>
                  */}
                  
                  {/* Commented out Order Type cell
                  <td>{list.is_external ? 'External' : 'Internal'}</td>
                  */}
                  
                  <td>{list.delivery_id || '-'}</td>
                  <td>{getDeliveryTypeDisplay(list.delivery_type)}</td>
                  <td>{getWarehouseDisplay(list)}</td>
                  <td className="centered-cell">{list.items_details?.length || 0}</td>
                  <td>{getEmployeeName(list.picked_by)}</td>
                  <td className={`status-cell ${getStatusClass(list.picked_status)}`}>
                    {list.picked_status || 'Unknown'}
                  </td>
                  <td>{formatDate(list.picked_date)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={window.innerWidth <= 576 ? 6 : 7} className="no-data">
                  No picking lists found with the current filters
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

export default PickingTable;