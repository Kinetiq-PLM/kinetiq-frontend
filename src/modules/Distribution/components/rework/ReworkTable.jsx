// components/rework/ReworkTable.jsx
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';

const ReworkTable = ({ 
  reworks, 
  onReworkSelect, 
  selectedRework, 
  employees,
  onStatusUpdate,
  showCompleted 
}) => {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  
  // Add sorting state
  const [sortField, setSortField] = useState('rework_id');
  const [sortDirection, setSortDirection] = useState('desc');

  // Reset to first page when reworks data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [reworks.length]);

  // Function to get employee name from ID
  const getEmployeeName = (employeeId) => {
    if (!employeeId) return 'Unassigned';
    const employee = employees.find(emp => emp.employee_id === employeeId);
    return employee ? employee.full_name : employeeId;
  };
  
  // Function to format date with fallback
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return dateString;
    }
  };
  
  // Add sort function
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
  
  // Add get sort icon function
  const getSortIcon = (field) => {
    if (sortField !== field) return <FaSort className="sort-icon neutral" />;
    return sortDirection === 'asc' ? 
      <FaSortUp className="sort-icon ascending" /> : 
      <FaSortDown className="sort-icon descending" />;
  };
  
  // Sort the reworks based on current sort settings
  const sortedReworks = [...reworks].sort((a, b) => {
    // Special handling for dates
    if (field => field.includes('date')) {
      const dateA = a[sortField] ? new Date(a[sortField]) : new Date(0);
      const dateB = b[sortField] ? new Date(b[sortField]) : new Date(0);
      
      return sortDirection === 'asc' 
        ? dateA - dateB 
        : dateB - dateA;
    }
    
    // For employee names
    if (sortField === 'assigned_to') {
      const nameA = getEmployeeName(a.assigned_to).toLowerCase();
      const nameB = getEmployeeName(b.assigned_to).toLowerCase();
      
      return sortDirection === 'asc'
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    }
    
    // For string values
    if (typeof a[sortField] === 'string') {
      return sortDirection === 'asc'
        ? a[sortField].localeCompare(b[sortField])
        : b[sortField].localeCompare(a[sortField]);
    }
    
    // For numeric values
    return sortDirection === 'asc'
      ? a[sortField] - b[sortField]
      : b[sortField] - a[sortField];
  });

  // Get current reworks for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReworks = sortedReworks.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedReworks.length / itemsPerPage);

  // Change page handler
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  
  return (
    <div className="rework-table-container">
      <div className="table-metadata">
        <span>
          Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, reworks.length)} of {reworks.length} rework orders
        </span>
      </div>
      
      <div className="table-wrapper">
        <table className="rework-table">
          <thead>
            <tr>
              <th className="sortable" onClick={() => handleSort('rework_id')}>
                Rework ID {getSortIcon('rework_id')}
              </th>
              <th className="sortable" onClick={() => handleSort('rework_types')}>
                Type {getSortIcon('rework_types')}
              </th>
              <th className="sortable" onClick={() => handleSort('rework_status')}>
                Status {getSortIcon('rework_status')}
              </th>
              <th className="sortable" onClick={() => handleSort('assigned_to')}>
                Assigned To {getSortIcon('assigned_to')}
              </th>
              <th className="sortable" onClick={() => handleSort('rework_date')}>
                Rework Date {getSortIcon('rework_date')}
              </th>
              <th className="sortable" onClick={() => handleSort('expected_completion')}>
                Expected Completion {getSortIcon('expected_completion')}
              </th>
            </tr>
          </thead>
          <tbody>
            {currentReworks.length === 0 ? (
              <tr>
                <td colSpan={window.innerWidth <= 576 ? 4 : 6} className="no-data">
                  No rework orders found.
                </td>
              </tr>
            ) : (
              currentReworks.map((rework, index) => (
                <tr 
                  key={rework.rework_id}
                  className={`
                    ${index % 2 === 0 ? 'even-row' : 'odd-row'}
                    ${selectedRework && selectedRework.rework_id === rework.rework_id ? 'selected-row' : ''}
                  `}
                  onClick={() => onReworkSelect(rework)}
                >
                  <td>{rework.rework_id}</td>
                  <td>
                    {rework.rework_types === 'Rejection' ? (
                      <span className="badge badge-danger">Rejection</span>
                    ) : (
                      <span className="badge badge-warning">Failed Shipment</span>
                    )}
                  </td>
                  <td>
                    <span className={`status-cell status-${rework.rework_status.replace(' ', '-')}`}>
                      {rework.rework_status}
                    </span>
                  </td>
                  <td>{getEmployeeName(rework.assigned_to)}</td>
                  <td>{formatDate(rework.rework_date)}</td>
                  <td>{formatDate(rework.expected_completion)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {reworks.length > 0 && (
        <div className="pagination-controls">
          <button 
            onClick={prevPage} 
            disabled={currentPage === 1}
            className="pagination-button"
          >
            &laquo; Prev
          </button>
          
          <div className="page-numbers">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => paginate(index + 1)}
                className={`page-number ${currentPage === index + 1 ? 'active' : ''}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
          
          <button 
            onClick={nextPage} 
            disabled={currentPage === totalPages}
            className="pagination-button"
          >
            Next &raquo;
          </button>
        </div>
      )}
    </div>
  );
};

export default ReworkTable;