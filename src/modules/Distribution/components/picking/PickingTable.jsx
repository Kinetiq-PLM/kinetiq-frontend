import React, { useState } from 'react';
import '../../styles/Picking.css';
import { FaSortUp, FaSortDown } from 'react-icons/fa';

const PickingTable = ({ pickingLists, onListSelect, selectedList, employees }) => {
  const [sortField, setSortField] = useState('picking_list_id'); // Default sort can be changed
  const [sortDirection, setSortDirection] = useState('desc');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Adjusted items per page

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

    // Handle specific field comparisons if needed (e.g., date, numbers)
    if (sortField === 'picked_date' && aValue && bValue) {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    } else if (sortField === 'items_count') {
      // Use items_details length for sorting items count
      aValue = a.items_details?.length || 0;
      bValue = b.items_details?.length || 0;
    }

    // Handle missing values
    if (aValue === null || aValue === undefined) aValue = '';
    if (bValue === null || bValue === undefined) bValue = '';

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
    try {
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return '';
      }
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (e) {
      console.error("Error formatting date:", dateString, e);
      return ''; // Return empty string if formatting fails
    }
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

  // Get employee name
  const getEmployeeName = (employeeId) => {
    if (!employeeId) return '-';
    const employee = employees.find(emp => emp.employee_id === employeeId);
    return employee ? employee.full_name : employeeId; // Show ID if name not found
  };

  // Function to determine warehouse display value
  const getWarehouseDisplay = (list) => {
    // Prefer warehouse_name if available directly from the list object
    if (list.warehouse_name) return list.warehouse_name;
    // Fallback to warehouse_id if name is not present
    if (list.warehouse_id) return list.warehouse_id;
    // If neither is present, indicate not assigned
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
              <th
                className="sortable"
                onClick={() => handleSort('delivery_id')}
              >
                Delivery ID
                {sortField === 'delivery_id' && (
                  <span className="sort-icon">
                    {sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />}
                  </span>
                )}
              </th>
              <th
                className="sortable"
                onClick={() => handleSort('delivery_type')}
              >
                Delivery Type
                {sortField === 'delivery_type' && (
                  <span className="sort-icon">
                    {sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />}
                  </span>
                )}
              </th>
              <th
                className="sortable"
                // Use warehouse_name for sorting, as it's the displayed value
                onClick={() => handleSort('warehouse_name')}
              >
                Warehouse
                {sortField === 'warehouse_name' && (
                  <span className="sort-icon">
                    {sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />}
                  </span>
                )}
              </th>
              <th
                className="sortable"
                // Sort by the number of items
                onClick={() => handleSort('items_count')} // Use a consistent field name if possible, like 'items_count' from serializer
              >
                Items
                {sortField === 'items_count' && ( // Match the sort field name
                  <span className="sort-icon">
                    {sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />}
                  </span>
                )}
              </th>
              <th
                className="sortable"
                onClick={() => handleSort('picked_by')}
              >
                Assigned To
                {sortField === 'picked_by' && (
                  <span className="sort-icon">
                    {sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />}
                  </span>
                )}
              </th>
              <th
                className="sortable"
                onClick={() => handleSort('picked_status')}
              >
                Status
                {sortField === 'picked_status' && (
                  <span className="sort-icon">
                    {sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />}
                  </span>
                )}
              </th>
              <th
                className="sortable"
                onClick={() => handleSort('picked_date')}
              >
                Date Picked
                {sortField === 'picked_date' && (
                  <span className="sort-icon">
                    {sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />}
                  </span>
                )}
              </th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((list, index) => (
                <tr
                  key={list.picking_list_id}
                  className={`${index % 2 === 0 ? 'even-row' : 'odd-row'} ${
                    selectedList && selectedList.picking_list_id === list.picking_list_id ?
                    'selected-row' : ''
                  }`}
                  onClick={() => onListSelect(list)}
                >
                  <td>{list.delivery_id || '-'}</td>
                  <td>{getDeliveryTypeDisplay(list.delivery_type)}</td>
                  <td>{getWarehouseDisplay(list)}</td>
                  {/* Display the count of items */}
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
                {/* Adjusted colspan to 7 */}
                <td colSpan={7} className="no-data">
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

              // Ensure pageNum is within valid range [1, totalPages]
              if (pageNum < 1 || pageNum > totalPages) return null;

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