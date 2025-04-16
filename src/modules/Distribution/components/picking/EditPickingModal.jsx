import React, { useState, useEffect } from 'react';
import '../../styles/Picking.css';

const EditPickingModal = ({ 
  pickingList, 
  employees, 
  warehouses, 
  onClose, 
  onSave,
  onStatusUpdate 
}) => {
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedWarehouse, setSelectedWarehouse] = useState('');
  const [modified, setModified] = useState(false);
  
  // Check if picking list is completed
  const isCompleted = pickingList?.picked_status === 'Completed';
  
  // Set initial values when picking list changes
  useEffect(() => {
    if (pickingList) {
      setSelectedEmployee(pickingList.picked_by || '');
      setSelectedWarehouse(pickingList.warehouse_id || '');
      setModified(false);
    }
  }, [pickingList]);
  
  // Handle employee selection
  const handleEmployeeChange = (e) => {
    setSelectedEmployee(e.target.value);
    setModified(true);
  };
  
  // Handle warehouse selection
  const handleWarehouseChange = (e) => {
    setSelectedWarehouse(e.target.value);
    setModified(true);
  };
  
  // Handle save button click
  const handleSave = () => {
    // Don't allow saving if completed
    if (isCompleted) {
      return;
    }
    
    const updates = {};
    
    if (selectedEmployee !== pickingList.picked_by) {
      updates.picked_by = selectedEmployee;
    }
    
    if (selectedWarehouse !== pickingList.warehouse_id && pickingList.is_external) {
      updates.warehouse_id = selectedWarehouse;
    }
    
    onSave(pickingList, updates);
  };
  
  // Get next status based on current status
  const getNextStatus = (currentStatus) => {
    switch (currentStatus) {
      case 'Not Started': return 'In Progress';
      case 'In Progress': return 'Completed';
      default: return null;
    }
  };
  
  // Get status action label
  const getStatusActionLabel = (currentStatus) => {
    switch (currentStatus) {
      case 'Not Started': return 'Start Picking';
      case 'In Progress': return 'Complete Picking';
      default: return 'No Action Available';
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Not picked yet';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  // Get delivery type display
  const getDeliveryTypeDisplay = (type) => {
    switch (type) {
      case 'sales': return ' Sales Order';
      case 'service': return ' Service Order';
      case 'content': return ' Content Delivery';
      case 'stock': return ' Stock Transfer';
      default: return 'Unknown';
    }
  };
  
  if (!pickingList) return null;
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="edit-picking-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{isCompleted ? 'View Picking List' : 'Edit Picking List'}</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="picking-details">
            <div className="detail-item">
              <span className="detail-label">Picking ID:</span>
              <span className="detail-value">{pickingList.picking_list_id}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Delivery Type:</span>
              <span className="detail-value">
                {pickingList.is_external ? 'External' : 'Internal'} - 
                {getDeliveryTypeDisplay(pickingList.delivery_type)}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Delivery ID:</span>
              <span className="detail-value">{pickingList.delivery_id || '-'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Current Status:</span>
              <span className={`detail-value status-${pickingList.picked_status?.toLowerCase().replace(' ', '-')}`}>
                {pickingList.picked_status}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Date Picked:</span>
              <span className="detail-value">{formatDate(pickingList.picked_date)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Items Count:</span>
              <span className="detail-value">{pickingList.items_count || 0}</span>
            </div>
          </div>
          
          <div className="edit-section">
            <h4>Assign Employee</h4>
            {isCompleted ? (
              <div className="employee-display">
                <span className="employee-value">
                  {employees.find(emp => emp.employee_id === pickingList.picked_by)?.full_name || 'Not assigned'}
                </span>
              </div>
            ) : (
              <div className="employee-selection">
                <select 
                  className="employee-dropdown"
                  value={selectedEmployee}
                  onChange={handleEmployeeChange}
                  disabled={isCompleted}
                >
                  <option value="">Select an employee...</option>
                  {employees.map(employee => (
                    <option key={employee.employee_id} value={employee.employee_id}>
                      {employee.full_name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          
          {/* Warehouse section - Different display based on picking list type and completion status */}
          <div className="edit-section">
            <h4>Warehouse</h4>
            
            {pickingList.is_external && !isCompleted ? (
              <div className="warehouse-selection">
                <select 
                  className="warehouse-dropdown"
                  value={selectedWarehouse}
                  onChange={handleWarehouseChange}
                  disabled={isCompleted}
                >
                  <option value="">Select a warehouse...</option>
                  {warehouses.map(warehouse => (
                    <option key={warehouse.id} value={warehouse.id}>
                      {warehouse.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="warehouse-display">
                <div className="warehouse-info">
                  <span className="warehouse-value">{pickingList.warehouse_name || 'Not assigned'}</span>
                  {!pickingList.is_external && (
                    <div className="warehouse-note">
                      <small>Warehouse for internal deliveries is automatically assigned and cannot be modified.</small>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div className="edit-section">
            <h4>Status</h4>
            <div className="status-action">
              {!isCompleted ? (
                <button 
                className={`status-update-button status-${getNextStatus(pickingList.picked_status)?.toLowerCase().replace(' ', '-')}`}
                onClick={() => onStatusUpdate(
                  pickingList, 
                  getNextStatus(pickingList.picked_status), 
                  selectedEmployee, 
                  selectedWarehouse
                )}
              >
                {getStatusActionLabel(pickingList.picked_status)}
              </button>
              ) : (
                <div className="completed-message">
                  This picking list is completed and cannot be modified.
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="modal-footer">
          <button className="cancel-button" onClick={onClose}>
            {isCompleted ? 'Close' : 'Cancel'}
          </button>
          {!isCompleted && (
            <button 
              className="save-button" 
              onClick={handleSave}
              disabled={!modified || isCompleted}
            >
              Save Changes
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditPickingModal;