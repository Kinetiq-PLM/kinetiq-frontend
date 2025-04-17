// components/picking/PickingActions.jsx
import React, { useState, useEffect } from 'react';
import '../../styles/Picking.css';

const PickingActions = ({ pickingList, employees, warehouses, onAssignEmployee, onUpdateWarehouse, onStatusUpdate }) => {
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedWarehouse, setSelectedWarehouse] = useState('');
  
  // Set initial values when picking list changes
  useEffect(() => {
    if (pickingList) {
      setSelectedEmployee(pickingList.picked_by || '');
      setSelectedWarehouse(pickingList.warehouse_id || '');
    }
  }, [pickingList]);
  
  // Handle employee selection
  const handleEmployeeChange = (e) => {
    setSelectedEmployee(e.target.value);
  };
  
  // Handle warehouse selection
  const handleWarehouseChange = (e) => {
    setSelectedWarehouse(e.target.value);
  };
  
  // Handle assign employee button click
  const handleAssignEmployee = () => {
    if (!selectedEmployee) {
      alert('Please select an employee to assign');
      return;
    }
    
    onAssignEmployee(pickingList, selectedEmployee);
  };
  
  // Handle update warehouse button click
  const handleUpdateWarehouse = () => {
    if (!selectedWarehouse) {
      alert('Please select a warehouse');
      return;
    }
    
    onUpdateWarehouse(pickingList, selectedWarehouse);
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
  
  // Check if status action is available
  const isStatusActionAvailable = () => {
    return pickingList.picked_status !== 'Completed';
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
      case 'sales': return 'Sales Order';
      case 'service': return 'Service Order';
      case 'content': return 'Content Delivery';
      case 'stock': return 'Stock Transfer';
      default: return 'Unknown';
    }
  };
  
  if (!pickingList) return null;
  
  return (
    <div className="picking-actions">
      <h3 className="actions-title">Picking List Actions</h3>
      
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
      
      <div className="action-section">
        <h4>Assign Employee</h4>
        <div className="employee-selection">
          <select 
            className="employee-dropdown"
            value={selectedEmployee}
            onChange={handleEmployeeChange}
          >
            <option value="">Select an employee...</option>
            {employees.map(employee => (
              <option key={employee.employee_id} value={employee.employee_id}>
                {employee.full_name}
              </option>
            ))}
          </select>
          <button 
            className="assign-button"
            onClick={handleAssignEmployee}
            disabled={!selectedEmployee}
          >
            Assign
          </button>
        </div>
      </div>
      
      {/* Warehouse selection section - Only shown for external orders */}
      {pickingList.is_external && (
        <div className="action-section">
          <h4>Update Warehouse</h4>
          <div className="warehouse-selection">
            <select 
              className="warehouse-dropdown"
              value={selectedWarehouse}
              onChange={handleWarehouseChange}
            >
              <option value="">Select a warehouse...</option>
              {warehouses.map(warehouse => (
                <option key={warehouse.id} value={warehouse.id}>
                  {warehouse.name}
                </option>
              ))}
            </select>
            <button 
              className="update-button"
              onClick={handleUpdateWarehouse}
              disabled={!selectedWarehouse}
            >
              Update
            </button>
          </div>
        </div>
      )}
      
      {/* For internal orders, just display the warehouse name */}
      {!pickingList.is_external && (
        <div className="action-section">
          <h4>Warehouse</h4>
          <div className="warehouse-display">
            <div className="warehouse-info">
              <span className="warehouse-label">Location:</span>
              <span className="warehouse-value">{pickingList.warehouse_name || 'Not assigned'}</span>
              <div className="warehouse-note">
                <small>Warehouse for internal deliveries is automatically assigned and cannot be modified.</small>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="action-section">
        <h4>Update Status</h4>
        <div className="status-action">
          {isStatusActionAvailable() ? (
            <button 
              className={`status-update-button status-${getNextStatus(pickingList.picked_status)?.toLowerCase().replace(' ', '-')}`}
              onClick={() => onStatusUpdate(pickingList, getNextStatus(pickingList.picked_status))}
            >
              {getStatusActionLabel(pickingList.picked_status)}
            </button>
          ) : (
            <div className="completed-message">
              This picking list is already completed.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PickingActions;