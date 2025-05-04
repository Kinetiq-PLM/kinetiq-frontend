// components/picking/PickingActions.jsx
import React, { useState, useEffect } from 'react';
import '../../styles/Picking.css';

const PickingActions = ({ pickingList, onAssignEmployee, onStatusUpdate, employees, warehouses }) => {
  const [selectedEmployee, setSelectedEmployee] = useState('');
  
  // Set initial values when picking list changes
  useEffect(() => {
    if (pickingList) {
      setSelectedEmployee(pickingList.picked_by || '');
    }
  }, [pickingList]);
  
  // Handle employee selection
  const handleEmployeeChange = (e) => {
    setSelectedEmployee(e.target.value);
  };
  
  // Handle assign employee button click
  const handleAssignEmployee = () => {
    if (!selectedEmployee) {
      alert('Please select an employee to assign');
      return;
    }
    
    onAssignEmployee(pickingList, selectedEmployee);
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
  
  // Updated warehouse display function
  const getWarehouseDisplay = () => {
    // If there's a warehouse name in the picking list, use it
    if (pickingList.warehouse_name) return pickingList.warehouse_name;
    if (pickingList.warehouse_id) {
      const warehouse = warehouses.find(wh => wh.id === pickingList.warehouse_id);
      if (warehouse) return warehouse.name;
    }
    
    // Check for multiple warehouses in items
    if (pickingList.items_details && pickingList.items_details.length > 0) {
      const uniqueWarehouses = new Set(
        pickingList.items_details
          .filter(item => item.warehouse_id || item.warehouse_name)
          .map(item => item.warehouse_id || item.warehouse_name)
      );
      
      if (uniqueWarehouses.size > 1) {
        return "Multiple Warehouses";
      } else if (uniqueWarehouses.size === 1) {
        // Get the first (and only) warehouse name
        return pickingList.items_details.find(item => item.warehouse_name)?.warehouse_name || 
               Array.from(uniqueWarehouses)[0] || 'Not assigned';
      }
    }
    
    return 'Not assigned';
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
          {/* Display count based on items_details array */}
          <span className="detail-value">{pickingList.items_details?.length || 0}</span>
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
      
      {/* Warehouse display section */}
      <div className="action-section">
        <h4>Warehouse</h4>
        <div className="warehouse-display">
          <div className="warehouse-info">
            <span className="warehouse-label">Location:</span>
            <span className="warehouse-value">
              {/* Use the updated warehouse display function */}
              {getWarehouseDisplay()}
            </span>
            <div className="warehouse-note">
              <small>Warehouse is predetermined by the module sending the delivery request</small>
            </div>
          </div>
        </div>
      </div>
      
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