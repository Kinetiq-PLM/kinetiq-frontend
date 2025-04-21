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
    
    // For external deliveries, also need a warehouse
    if (pickingList.is_external && !selectedWarehouse) {
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
  
  return (
    <div className="picking modal-overlay" onClick={onClose}>
      <div className="edit-picking-modal improved" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-container">
            <h3>{isCompleted ? 'Picking List Details' : 'Edit Picking List'}</h3>
            <span className="modal-subtitle">ID: {pickingList.picking_list_id}</span>
          </div>
          <button className="close-button" onClick={onClose} aria-label="Close modal">×</button>
        </div>
        
        <div className="modal-body">
          {/* Status indicator - New addition */}
          <div className={`status-indicator status-${pickingList.picked_status?.toLowerCase().replace(' ', '-')}`}>
            <span className="status-icon">{getStatusIcon(pickingList.picked_status)}</span>
            <span className="status-text">{pickingList.picked_status}</span>
          </div>

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
                  <span className="detail-value count-badge">{pickingList.items_count || 0}</span>
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
            
            {/* Warehouse Section */}
            <div className="edit-section">
              <h4 className="section-title">
                <span className="section-icon">🏢</span>
                Warehouse
                {!isCompleted && pickingList.is_external && <span className="required-indicator">*</span>}
              </h4>
              
              {pickingList.is_external && !isCompleted ? (
                <div className="warehouse-selection improved">
                  <select 
                    className="warehouse-dropdown"
                    value={selectedWarehouse}
                    onChange={handleWarehouseChange}
                    disabled={isCompleted}
                    required={pickingList.is_external}
                  >
                    <option value="">Select a warehouse...</option>
                    {warehouses.map(warehouse => (
                      <option key={warehouse.id} value={warehouse.id}>
                        {warehouse.name}
                      </option>
                    ))}
                  </select>
                  {!selectedWarehouse && pickingList.is_external && !isCompleted && (
                    <div className="field-hint">Warehouse selection is required for external deliveries</div>
                  )}
                </div>
              ) : (
                <div className="warehouse-display">
                  <div className="warehouse-info">
                    <span className="warehouse-value">
                      {pickingList.is_external 
                        ? getWarehouseName(pickingList.warehouse_id)
                        : pickingList.warehouse_name || 'Not assigned'}
                    </span>
                    {!pickingList.is_external && (
                      <div className="warehouse-note">
                        <small>For internal deliveries, warehouse is automatically assigned</small>
                      </div>
                    )}
                  </div>
                </div>
              )}
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
                      selectedWarehouse
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
                      {!selectedEmployee ? 'Please assign an employee to start picking' : 
                      (pickingList.is_external && !selectedWarehouse) ? 'Please select a warehouse for this external delivery' : ''}
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