import React, { useState, useEffect } from 'react';
import '../../styles/Picking.css';

const EditPickingModal = ({ show, onClose, pickingList, onSave, employees, warehouses, onStatusUpdate }) => {
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [modified, setModified] = useState(false);
  const [activeTab, setActiveTab] = useState('general'); // Add state for tab navigation
  
  // Check if picking list is completed
  const isCompleted = pickingList?.picked_status === 'Completed';
  
  // Set initial values when picking list changes
  useEffect(() => {
    if (pickingList) {
      setSelectedEmployee(pickingList.picked_by || '');
      setModified(false);
    }
  }, [pickingList]);
  
  // Handle employee selection
  const handleEmployeeChange = (e) => {
    setSelectedEmployee(e.target.value);
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
    
    // Removed warehouse update logic since warehouse is predetermined
    
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

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Not Started': return '⏱️';
      case 'In Progress': return '🔄';
      case 'Completed': return '✅';
      default: return '❓';
    }
  };
  
  // Check if status update button should be disabled
  const isStatusUpdateDisabled = () => {
    // Always need an employee assigned
    if (!selectedEmployee) {
      return true;
    }
    
    return false;
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Not picked yet';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  // Get delivery type icon
  const getDeliveryTypeIcon = (type) => {
    switch (type) {
      case 'sales': return '🛒';
      case 'service': return '🔧';
      case 'content': return '📦';
      case 'stock': return '🔄';
      default: return '❓';
    }
  };
  
  if (!pickingList) return null;

  // Get employee name from ID
  const getEmployeeName = (employeeId) => {
    const employee = employees.find(emp => emp.employee_id === employeeId);
    return employee ? employee.full_name : 'Not assigned';
  };

  // Get warehouse name from ID
  const getWarehouseName = (warehouseId) => {
    const warehouse = warehouses.find(wh => wh.id === warehouseId);
    return warehouse ? warehouse.name : 'Not assigned';
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

  return (
    <div className={`picking modal-overlay ${show ? 'show' : ''}`} onClick={onClose}>
      <div className="edit-picking-modal improved" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-container">
            <h3>{isCompleted ? 'Picking List Details' : 'Edit Picking List'}</h3>
            <span className="modal-subtitle">ID: {pickingList.picking_list_id}</span>
          </div>
          <button className="close-button" onClick={onClose} aria-label="Close modal">×</button>
        </div>
        
        <div className="modal-body">
          {/* Status indicator */}
          <div className={`status-indicator status-${pickingList.picked_status?.toLowerCase().replace(' ', '-')}`}>
            <span className="status-icon">{getStatusIcon(pickingList.picked_status)}</span>
            <span className="status-text">{pickingList.picked_status}</span>
          </div>

          {/* Tab Navigation */}
          <div className="modal-tabs">
            <button 
              className={`tab-button ${activeTab === 'general' ? 'active' : ''}`}
              onClick={() => setActiveTab('general')}
            >
              <span className="tab-icon">ℹ️</span>
              General Info
            </button>
            <button 
              className={`tab-button ${activeTab === 'items' ? 'active' : ''}`}
              onClick={() => setActiveTab('items')}
            >
              <span className="tab-icon">📦</span>
              Items ({pickingList.items_details?.length || 0})
            </button>
          </div>

          {/* General Tab Content */}
          {activeTab === 'general' && (
            <>
              {/* Main information panel */}
              <div className="info-panel">
                <h4 className="section-title">General Information</h4>
                <div className="picking-details enhanced">
                  <div className="detail-row">
                    <div className="detail-item">
                      <span className="detail-label">Delivery Type</span>
                      <span className="detail-value">
                        <span className="icon">{getDeliveryTypeIcon(pickingList.delivery_type)}</span>
                        {pickingList.is_external ? 'External' : 'Internal'} - 
                        {getDeliveryTypeDisplay(pickingList.delivery_type)}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Delivery ID</span>
                      <span className="detail-value highlight">{pickingList.delivery_id || '-'}</span>
                    </div>
                  </div>
                  
                  <div className="detail-row">
                    <div className="detail-item">
                      <span className="detail-label">Date Picked</span>
                      <span className="detail-value">{formatDate(pickingList.picked_date)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Items Count</span>
                      <span className="detail-value count-badge">{pickingList.items_details?.length || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Assignment sections */}
              <div className="assignment-sections">
                {/* Employee Assignment Section */}
                <div className="edit-section">
                  <h4 className="section-title">
                    <span className="section-icon">👤</span>
                    Assign Employee
                    {!isCompleted && <span className="required-indicator">*</span>}
                  </h4>
                  
                  {isCompleted ? (
                    <div className="employee-display">
                      <span className="employee-value">
                        {getEmployeeName(pickingList.picked_by)}
                      </span>
                    </div>
                  ) : (
                    <div className="employee-selection improved">
                      <select 
                        className="employee-dropdown"
                        value={selectedEmployee}
                        onChange={handleEmployeeChange}
                        disabled={isCompleted}
                        required
                      >
                        <option value="">Select an employee...</option>
                        {employees.map(employee => (
                          <option key={employee.employee_id} value={employee.employee_id}>
                            {employee.full_name}
                          </option>
                        ))}
                      </select>
                      {!selectedEmployee && !isCompleted && (
                        <div className="field-hint">Employee assignment is required</div>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Warehouse Section - Display Only */}
                <div className="edit-section">
                  <h4 className="section-title">
                    <span className="section-icon">🏢</span>
                    Warehouse
                  </h4>
                  
                  <div className="warehouse-display">
                    <div className="warehouse-info">
                      <span className="warehouse-value">
                        {/* Use the updated warehouse display function */}
                        {getWarehouseDisplay()}
                      </span>
                      <div className="warehouse-note">
                        <small>Warehouse is predetermined by the module sending the delivery request</small>
                        {pickingList.items_details && 
                         new Set(pickingList.items_details.map(item => item.warehouse_id || item.warehouse_name)).size > 1 && (
                          <div className="warehouse-warning">
                            <small><strong>Note:</strong> This order includes items from multiple warehouses</small>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Status Workflow Section */}
              {!isCompleted && (
                <div className="edit-section status-workflow-section">
                  <h4 className="section-title">
                    <span className="section-icon">📋</span>
                    Workflow Actions
                  </h4>
                  
                  <div className="status-workflow">
                    <div className="workflow-steps">
                      <div className={`workflow-step ${pickingList.picked_status === 'Not Started' ? 'current' : 'complete'}`}>
                        <div className="step-indicator">1</div>
                        <div className="step-label">Not Started</div>
                      </div>
                      <div className="workflow-connector"></div>
                      <div className={`workflow-step ${pickingList.picked_status === 'In Progress' ? 'current' : (pickingList.picked_status === 'Completed' ? 'complete' : '')}`}>
                        <div className="step-indicator">2</div>
                        <div className="step-label">In Progress</div>
                      </div>
                      <div className="workflow-connector"></div>
                      <div className={`workflow-step ${pickingList.picked_status === 'Completed' ? 'current' : ''}`}>
                        <div className="step-indicator">3</div>
                        <div className="step-label">Completed</div>
                      </div>
                    </div>
                    
                    <div className="status-action">
                      <button 
                        className={`status-update-button status-${getNextStatus(pickingList.picked_status)?.toLowerCase().replace(' ', '-')}`}
                        onClick={() => onStatusUpdate(
                          pickingList, 
                          getNextStatus(pickingList.picked_status), 
                          selectedEmployee, 
                          null // No longer passing warehouse ID
                        )}
                        disabled={isStatusUpdateDisabled()}
                      >
                        <span className="button-icon">
                          {pickingList.picked_status === 'Not Started' ? '▶' : '✓'}
                        </span>
                        {getStatusActionLabel(pickingList.picked_status)}
                      </button>
                      
                      {isStatusUpdateDisabled() && (
                        <div className="validation-message">
                          {!selectedEmployee ? 'Please assign an employee to start picking' : ''}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Completed Message */}
              {isCompleted && (
                <div className="completed-section">
                  <div className="completed-message">
                    <span className="completed-icon">✅</span>
                    This picking list was completed on {formatDate(pickingList.picked_date)}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Items Tab Content */}
          {activeTab === 'items' && (
            <div className="items-section">
              <h4 className="section-title">
                <span className="section-icon">📦</span>
                Items to Pick ({pickingList.items_details?.length || 0})
              </h4>
              
              <div className="items-table-container">
                <table className="items-table">
                  <thead>
                    <tr>
                      <th>Item No.</th>
                      <th>Item Name</th>
                      <th>Quantity</th>
                      <th>Warehouse</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pickingList.items_details && pickingList.items_details.length > 0 ? (
                      pickingList.items_details.map((item, index) => (
                        <tr key={item.inventory_item_id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                          <td>{item.item_no || '-'}</td>
                          <td>{item.item_name || 'Unknown Item'}</td>
                          <td className="centered-cell">{item.quantity || 0}</td>
                          <td>{item.warehouse_name || '-'}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="no-data">No items to display</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Show warning if items are from multiple warehouses */}
              {pickingList.items_details && 
               new Set(pickingList.items_details.map(item => item.warehouse_id)).size > 1 && (
                <div className="multi-warehouse-warning">
                  <span className="warning-icon">⚠️</span>
                  <span className="warning-text">
                    This order contains items from multiple warehouses. Items may need to be picked from different locations.
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="modal-footer">
          <button className="cancel-button" onClick={onClose}>
            {isCompleted ? 'Close' : 'Cancel'}
          </button>
          {!isCompleted && activeTab === 'general' && (
            <button 
              className="save-button" 
              onClick={handleSave}
              disabled={!modified || isCompleted}
            >
              <span className="button-icon">💾</span>
              Save Changes
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditPickingModal;