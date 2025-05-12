import React, { useState, useEffect } from 'react';
import '../../styles/Picking.css';
import { FaRegSquare, FaCheckSquare, FaWarehouse, FaBoxOpen, FaClock } from 'react-icons/fa';

const EditPickingModal = ({ show, onClose, pickingList, onSave, employees, warehouses, onStatusUpdate }) => {
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [modified, setModified] = useState(false);
  const [activeTab, setActiveTab] = useState('general'); // Add state for tab navigation
  const [pickingItems, setPickingItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pickingProgress, setPickingProgress] = useState(0);
  
  // Check if picking list is completed
  const isCompleted = pickingList?.picked_status === 'Completed';
  
  // Initialize selectedEmployee when pickingList changes
  useEffect(() => {
    if (pickingList) {
      setSelectedEmployee(pickingList.picked_by || '');
      setModified(false); // Reset modified state when picking list changes
    }
  }, [pickingList]);
  
  // Fetch picking items when picking list changes
  useEffect(() => {
    if (pickingList && (pickingList.picked_status === 'In Progress' || pickingList.picked_status === 'Completed')) {
      fetchPickingItems();
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
  
  // Function to render items tab with warehouse grouping
  const renderItemsTab = () => {
    // Group items by warehouse
    const warehouseGroups = [];
    const warehouseMap = {};
  
    // Show loading indicator
    if (loading) {
      return (
        <div className="items-section loading">
          <div className="spinner"></div>
          <p>Loading items...</p>
        </div>
      );
    }
  
    // If status is "Not Started", show instruction message
    if (pickingList.picked_status === 'Not Started') {
      return (
        <div className="items-section not-started">
          <div className="info-message">
            <FaClock className="info-icon" />
            <h4>Picking Not Started Yet</h4>
            <p>To view and pick items, please:</p>
            <ol>
              <li>Go to the General Info tab</li>
              <li>Assign an employee</li>
              <li>Click "Start Picking" button</li>
            </ol>
            <p>Or simply try to mark an item as picked and the system will automatically update the status.</p>
          </div>
        </div>
      );
    }

    // If no employee is assigned, show a message
    if (!selectedEmployee) {
      return (
        <div className="items-section no-employee">
          <div className="warning-message">
            <FaClock className="warning-icon" />
            <h4>Employee Assignment Required</h4>
            <p>Please assign an employee in the General Info tab before picking items.</p>
          </div>
        </div>
      );
    }
  
    // Use pickingItems if available, otherwise fall back to items_details
    const items = pickingItems.length > 0 ? pickingItems : 
      (pickingList?.items_details?.length ? pickingList.items_details : []);
  
    // Only process if we have items
    if (items.length) {
      // Group items by warehouse
      items.forEach(item => {
        const warehouseId = item.warehouse_id || 'unknown';
        if (!warehouseMap[warehouseId]) {
          const group = {
            warehouseId,
            warehouseName: item.warehouse_name || 'Unknown Warehouse',
            items: []
          };
          warehouseMap[warehouseId] = group;
          warehouseGroups.push(group);
        }
        warehouseMap[warehouseId].items.push(item);
      });
    }
  
    const hasMultipleWarehouses = warehouseGroups.length > 1;
  
    return (
      <div className="items-section">
        <h4 className="section-title">
          <span className="section-icon">📦</span>
          Items to Pick ({items.length})
        </h4>
  
        {/* Add progress bar */}
        {isCompleted ? (
          <div className="picking-progress">
            <div className="progress-bar-container">
              <div className="progress-bar" style={{ width: '100%' }}></div>
            </div>
            <div className="progress-text">All items have been picked</div>
          </div>
        ) : (
          <div className="picking-progress">
            <div className="progress-bar-container">
              <div className="progress-bar" style={{ width: `${pickingProgress}%` }}></div>
            </div>
            <div className="progress-text">{pickingProgress}% completed</div>
          </div>
        )}
  
        {warehouseGroups.length > 0 ? (
          warehouseGroups.map((group, groupIndex) => (
            <div key={group.warehouseId} className="warehouse-group">
              <h5 className="warehouse-name">
                <FaWarehouse className="warehouse-icon" /> {group.warehouseName}
                <span className="warehouse-progress">
                  {group.items.filter(item => item.is_picked).length} / {group.items.length} items picked
                </span>
              </h5>
              
              <div className="items-table-container">
                <table className="items-table">
                  <thead>
                    <tr>
                      <th>Status</th>
                      <th>Item Name</th>
                      <th>Quantity</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.items.map((item, index) => (
                      <tr key={item.inventory_item_id || index} 
                          className={`${index % 2 === 0 ? 'even-row' : 'odd-row'} ${item.is_picked ? 'picked-row' : ''}`}>
                        <td>
                          {item.is_picked ? 
                            <span className="picked-status">Picked</span> : 
                            <span className="not-picked-status">Not Picked</span>
                          }
                        </td>
                        <td>{item.item_name || 'Unknown Item'}</td>
                        <td className="centered-cell">{parseInt(item.quantity) || 0}</td>
                        <td>
                          {!isCompleted && (
                            <button 
                              className={`item-toggle-button ${item.is_picked ? 'unpick' : 'pick'}`}
                              onClick={() => toggleItemPicked(item)}
                              disabled={!selectedEmployee}
                            >
                              {item.is_picked ? 
                                <>
                                  <FaCheckSquare /> Unpick
                                </> : 
                                <>
                                  <FaRegSquare /> Mark as Picked
                                </>
                              }
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {groupIndex < warehouseGroups.length - 1 && <hr className="warehouse-divider" />}
            </div>
          ))
        ) : (
          <div className="items-table-container">
            <table className="items-table">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Item Name</th>
                  <th>Quantity</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="4" className="no-data">No items to display</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
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

  // Function to fetch picking items
  const fetchPickingItems = async () => {
    if (!pickingList) return;
    
    try {
      setLoading(true);
      // First try to get existing items
      let response = await fetch(`https://r7d8au0l77.execute-api.ap-southeast-1.amazonaws.com/dev/api/picking-lists/${pickingList.picking_list_id}/items/`);
      let data = await response.json();
      
      // If no items exist yet, create them
      if (!response.ok || data.length === 0) {
        await fetch(`https://r7d8au0l77.execute-api.ap-southeast-1.amazonaws.com/dev/api/picking-lists/${pickingList.picking_list_id}/create-items/`, {
          method: 'POST'
        });
        
        // Fetch again after creating
        response = await fetch(`https://r7d8au0l77.execute-api.ap-southeast-1.amazonaws.com/dev/api/picking-lists/${pickingList.picking_list_id}/items/`);
        data = await response.json();
      }
      
      setPickingItems(data);
      
      // Calculate progress
      const totalItems = data.length;
      const pickedItems = data.filter(item => item.is_picked).length;
      setPickingProgress(totalItems > 0 ? Math.round((pickedItems / totalItems) * 100) : 0);
      
    } catch (err) {
      console.error('Error fetching picking items:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch picking items when picking list changes
  useEffect(() => {
    if (pickingList && pickingList.picked_status === 'In Progress') {
      fetchPickingItems();
    }
  }, [pickingList]);

  // Function to toggle item picked status
  const toggleItemPicked = async (item) => {
    if (isCompleted) return;
    
    try {
      // Check if employee has changed but hasn't been saved
      if (selectedEmployee !== pickingList.picked_by) {
        // First save the employee change
        const saveResponse = await fetch(`https://r7d8au0l77.execute-api.ap-southeast-1.amazonaws.com/dev/api/picking-lists/${pickingList.picking_list_id}/update/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            picked_by: selectedEmployee
          }),
        });
        
        if (!saveResponse.ok) {
          throw new Error('Failed to save employee assignment');
        }
        
        // Update local state to match what was saved
        pickingList.picked_by = selectedEmployee;
        setModified(false);
      }
      
      // Check if the picking list is still in "Not Started" status
      // If so, automatically update to "In Progress" first
      if (pickingList.picked_status === 'Not Started') {
        const statusUpdateResponse = await fetch(`https://r7d8au0l77.execute-api.ap-southeast-1.amazonaws.com/dev/api/picking-lists/${pickingList.picking_list_id}/update/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            picked_status: 'In Progress',
            picked_by: selectedEmployee
          }),
        });
        
        if (!statusUpdateResponse.ok) {
          throw new Error('Failed to update picking list status to In Progress');
        }
        
        // Update local state
        pickingList.picked_status = 'In Progress';
        
        // If this is the first time moving to "In Progress", we need to create picking items
        await fetchPickingItems();
        
        // Notify the parent component about status change
        onStatusUpdate(pickingList, 'In Progress', selectedEmployee, null);
      }
      
      // Now update the item status
      const response = await fetch(`https://r7d8au0l77.execute-api.ap-southeast-1.amazonaws.com/dev/api/picking-items/${item.picking_item_id}/update/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          is_picked: !item.is_picked,
          picked_by: selectedEmployee,
          picked_at: !item.is_picked ? new Date().toISOString() : null,
          quantity_picked: !item.is_picked ? item.quantity : 0,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update item status');
      }
      
      // Update local state with the new item data
      const updatedItem = await response.json();
      
      // Create a new array with the updated item
      const updatedItems = pickingItems.map(i => 
        i.picking_item_id === updatedItem.picking_item_id ? updatedItem : i
      );
      
      // Update the picking items state
      setPickingItems(updatedItems);
      
      // Calculate progress based on the updated items array
      const totalItems = updatedItems.length;
      const pickedItems = updatedItems.filter(i => i.is_picked).length;
      const newProgress = totalItems > 0 ? Math.round((pickedItems / totalItems) * 100) : 0;
      
      // Update the progress state
      setPickingProgress(newProgress);
      
    } catch (err) {
      console.error('Error updating item status:', err);
      alert('Error: ' + err.message);
    }
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

          {/* Items Tab Content - Using the new grouping function */}
          {activeTab === 'items' && renderItemsTab()}
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