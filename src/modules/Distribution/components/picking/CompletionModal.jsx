import React from 'react';
import '../../styles/Picking.css';

const CompletionModal = ({ pickingList, employees, warehouses, onConfirm, onCancel }) => {
  // Function to get employee name from ID
  const getEmployeeName = (employeeId) => {
    if (!employeeId) return 'Not assigned';
    const employee = employees.find(emp => emp.employee_id === employeeId);
    return employee ? employee.full_name : employeeId;
  };

  // Function to get warehouse name from ID
  const getWarehouseName = (warehouseId) => {
    // First try to use the name directly from the picking list if available
    if (pickingList.warehouse_name) return pickingList.warehouse_name;
    
    // Otherwise look up the name from the warehouses array
    if (!warehouseId) return 'Not assigned';
    const warehouse = warehouses?.find(wh => wh.id === warehouseId);
    return warehouse ? warehouse.name : warehouseId;
  };

  return (
    <div className="modal-overlay">
      <div className="completion-modal">
        <div className="modal-header">
          <h3>Complete Picking List</h3>
        </div>
        
        <div className="modal-body">
          <p>
            Are you sure you want to mark this picking list as completed?
            This will automatically create a new packing list.
          </p>
          
          <div className="picking-details">
            <div className="detail-item">
              <span className="detail-label">Picking ID:</span>
              <span className="detail-value">{pickingList.picking_list_id}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Warehouse:</span>
              <span className="detail-value">{getWarehouseName(pickingList.warehouse_id)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Assigned To:</span>
              <span className="detail-value">{getEmployeeName(pickingList.picked_by)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Items Count:</span>
              <span className="detail-value">{pickingList.items_count || 0}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Delivery Type:</span>
              <span className="detail-value">
                {pickingList.is_external ? 'External' : 'Internal'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="modal-footer">
          <button 
            className="cancel-button"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button 
            className="confirm-button"
            onClick={onConfirm}
          >
            Complete Picking
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompletionModal;