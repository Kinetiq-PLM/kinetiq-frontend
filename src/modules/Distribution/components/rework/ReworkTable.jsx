// components/rework/ReworkTable.jsx
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

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

  // Get current reworks for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReworks = reworks.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(reworks.length / itemsPerPage);

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
              <th>Rework ID</th>
              <th>Type</th>
              <th>Status</th>
              <th>Assigned To</th>
              <th>Rework Date</th>
              <th>Expected Completion</th>
              {/* <th>Original Order</th> */}
              {/* <th>Actions</th> */}
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
                  {/* <td className="actions-cell">
                    {!showCompleted && (
                      <>
                        {rework.rework_status === 'Pending' && (
                          <button 
                            className="action-button in-progress-button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onStatusUpdate(rework, 'In Progress');
                            }}
                          >
                            Start
                          </button>
                        )}
                        {rework.rework_status === 'In Progress' && (
                          <button 
                            className="action-button complete-button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onStatusUpdate(rework, 'Completed');
                            }}
                          >
                            Complete
                          </button>
                        )}
                      </>
                    )}
                    <button 
                      className="action-button view-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onReworkSelect(rework);
                      }}
                    >
                      View
                    </button>
                  </td> */}
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