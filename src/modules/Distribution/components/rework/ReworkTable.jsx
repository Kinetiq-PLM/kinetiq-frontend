// components/rework/ReworkTable.jsx
import React from 'react';
import { format } from 'date-fns';

const ReworkTable = ({ 
  reworks, 
  onReworkSelect, 
  selectedRework, 
  employees,
  onStatusUpdate,
  showCompleted 
}) => {
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
  
  return (
    <div className="rework-table-container">
      <div className="table-metadata">
        <span>Showing {reworks.length} rework orders</span>
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
              <th>Original Order</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reworks.length === 0 ? (
              <tr>
                <td colSpan="8" className="no-data">
                  No rework orders found.
                </td>
              </tr>
            ) : (
              reworks.map((rework, index) => (
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
                    <span className={`status-cell status-${rework.rework_status}`}>
                      {rework.rework_status}
                    </span>
                  </td>
                  <td>{getEmployeeName(rework.assigned_to)}</td>
                  <td>{formatDate(rework.rework_date)}</td>
                  <td>{formatDate(rework.expected_completion)}</td>
                  <td>
                    {rework.original_order_info ? (
                      <span className="order-link" title={`Customer: ${rework.original_order_info.customer_name || 'N/A'}`}>
                        {rework.original_order_info.order_id}
                      </span>
                    ) : (
                      <span className="no-order">No Order</span>
                    )}
                  </td>
                  <td className="actions-cell">
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
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReworkTable;