import React, { useState } from "react";
import { 
  FaSort, 
  FaSortUp, 
  FaSortDown, 
  FaChevronLeft, 
  FaChevronRight,
  FaShoppingCart,
  FaTools,
  FaExchangeAlt,
  FaBox,
  FaClipboardList,
  FaExclamationTriangle
} from "react-icons/fa";

const PackingTable = ({ packingLists, onListSelect, selectedList, employees }) => {
  // Add sorting state
  const [sortField, setSortField] = useState('packing_list_id');
  const [sortDirection, setSortDirection] = useState('desc');
  
  // Add pagination states
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
  
  // Get the delivery type name and icon
  const getDeliveryTypeInfo = (type) => {
    switch (type) {
      case 'sales':
        return { name: 'Sales Order', icon: <FaShoppingCart className="delivery-type-icon" /> };
      case 'service':
        return { name: 'Service Order', icon: <FaTools className="delivery-type-icon" /> };
      case 'content':
        return { name: 'Content Order', icon: <FaBox className="delivery-type-icon" /> };
      case 'stock':
        return { name: 'Stock Transfer', icon: <FaExchangeAlt className="delivery-type-icon" /> };
      default:
        return { name: 'Unknown', icon: <FaClipboardList className="delivery-type-icon" /> };
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
  
  // Get appropriate sort icon
  const getSortIcon = (field) => {
    if (sortField !== field) return <FaSort className="sort-icon neutral" />;
    return sortDirection === 'asc' ? 
      <FaSortUp className="sort-icon ascending" /> : 
      <FaSortDown className="sort-icon descending" />;
  };
  
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
                  Packing ID {getSortIcon('packing_list_id')}
                </th>
                <th className="sortable" onClick={() => handleSort('delivery_type')}>
                  Delivery Type {getSortIcon('delivery_type')}
                </th>
                <th className="sortable" onClick={() => handleSort('delivery_id')}>
                  Delivery ID {getSortIcon('delivery_id')}
                </th>
                <th className="sortable" onClick={() => handleSort('packing_status')}>
                  Status {getSortIcon('packing_status')}
                </th>
                <th className="sortable" onClick={() => handleSort('packed_by')}>
                  Packed By {getSortIcon('packed_by')}
                </th>
                <th className="sortable" onClick={() => handleSort('total_items_packed')}>
                  Items Count {getSortIcon('total_items_packed')}
                </th>
                <th className="sortable" onClick={() => handleSort('packing_type')}>
                  Packing Type {getSortIcon('packing_type')}
                </th>
                <th className="sortable" onClick={() => handleSort('packing_date')}>
                  Packing Date {getSortIcon('packing_date')}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={window.innerWidth <= 576 ? 4 : 8} className="no-data">
                  <FaExclamationTriangle className="no-data-icon" />
                  No packing lists found
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Add this function to calculate total quantity
  const getTotalQuantity = (list) => {
    if (!list.items_details || !list.items_details.length) {
      return list.total_items_packed || 0;
    }
    
    return list.items_details.reduce((sum, item) => {
      return sum + (parseInt(item.quantity) || 0);
    }, 0);
  };

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
                Packing ID {getSortIcon('packing_list_id')}
              </th>
              <th className="sortable" onClick={() => handleSort('delivery_type')}>
                Delivery Type {getSortIcon('delivery_type')}
              </th>
              <th className="sortable" onClick={() => handleSort('delivery_id')}>
                Delivery ID {getSortIcon('delivery_id')}
              </th>
              <th className="sortable" onClick={() => handleSort('packing_status')}>
                Status {getSortIcon('packing_status')}
              </th>
              <th className="sortable" onClick={() => handleSort('packed_by')}>
                Packed By {getSortIcon('packed_by')}
              </th>
              <th className="sortable" onClick={() => handleSort('total_items_packed')}>
                Items Count {getSortIcon('total_items_packed')}
              </th>
              <th className="sortable" onClick={() => handleSort('packing_type')}>
                Packing Type {getSortIcon('packing_type')}
              </th>
              <th className="sortable" onClick={() => handleSort('packing_date')}>
                Packing Date {getSortIcon('packing_date')}
              </th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((list, index) => {
              const deliveryTypeInfo = getDeliveryTypeInfo(list.delivery_type);
              return (
                <tr
                  key={list.packing_list_id}
                  className={`
                    ${index % 2 === 0 ? 'even-row' : 'odd-row'} 
                    ${selectedList && selectedList.packing_list_id === list.packing_list_id ? 'selected-row' : ''}
                  `}
                  onClick={() => onListSelect(list)}
                >
                  <td>{list.packing_list_id}</td>
                  <td className="delivery-type-cell">
                    {/* {deliveryTypeInfo.icon} */}
                    {deliveryTypeInfo.name}
                  </td>
                  <td>{list.delivery_id || '-'}</td>
                  <td className={`status-cell ${getStatusClass(list.packing_status)}`}>
                    {list.packing_status || '-'}
                  </td>
                  <td>{getEmployeeName(list.packed_by)}</td>
                  
                  {/* Update this line to show total quantity */}
                  <td className="centered-cell">
                    {getTotalQuantity(list)}
                    {list.items_details?.length > 0 && (
                      <span className="item-count-badge">({list.items_details.length} items)</span>
                    )}
                  </td>
                  
                  <td>{list.packing_type || '-'}</td>
                  <td>{formatDate(list.packing_date)}</td>
                </tr>
              );
            })}
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
            aria-label="Previous page"
          >
            <FaChevronLeft className="pagination-icon" aria-hidden="true" />
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
                  aria-label={`Go to page ${pageNum}`}
                  aria-current={currentPage === pageNum ? 'page' : undefined}
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
            aria-label="Next page"
          >
            Next
            <FaChevronRight className="pagination-icon" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
};

export default PackingTable;