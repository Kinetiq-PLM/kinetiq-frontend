import React, { useState, useEffect } from 'react';
import '../../styles/Picking.css';
import { 
  FaRegSquare, 
  FaCheckSquare, 
  FaWarehouse, 
  FaBoxOpen, 
  FaClock, 
  FaFileAlt, 
  FaBoxes,
  FaInfoCircle,
  FaShoppingCart,
  FaTools,
  FaExchangeAlt,
  FaQuestionCircle,
  FaSpinner,
  FaCheckCircle,
  FaSave,
  FaPlay,
  FaCheck,
  FaUser,
  FaClipboardList,
  FaExclamationTriangle
} from 'react-icons/fa';
import PartialDeliveryInfo from './PartialDeliveryInfo';

const EditPickingModal = ({ show, onClose, pickingList, onSave, employees, warehouses, onStatusUpdate }) => {
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [modified, setModified] = useState(false);
  const [activeTab, setActiveTab] = useState('general'); // Add state for tab navigation
  const [pickingItems, setPickingItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pickingProgress, setPickingProgress] = useState(0);
  const [deliveryNotesInfo, setDeliveryNotesInfo] = useState(null);
  
  // Check if picking list is completed
  const isCompleted = pickingList?.picked_status === 'Completed';
  
  // Initialize selectedEmployee when pickingList changes
  useEffect(() => {
    if (pickingList) {
      setSelectedEmployee(pickingList.picked_by || '');
      setModified(false); // Reset modified state when picking list changes
      
      // If this is a sales order, fetch delivery notes info
      if (pickingList.delivery_type === 'sales') {
        fetchDeliveryNotesInfo(pickingList.delivery_id);
      } else {
        // Reset delivery notes info for non-sales orders
        setDeliveryNotesInfo(null);
      }
    }
  }, [pickingList]);
  
  // Fetch delivery notes info for sales orders
  const fetchDeliveryNotesInfo = async (orderID) => {
    if (!orderID) return;
    
    try {
      const response = await fetch(`https://r7d8au0l77.execute-api.ap-southeast-1.amazonaws.com/dev/api/delivery-notes/order/${orderID}/`);
      
      if (response.ok) {
        const data = await response.json();
        setDeliveryNotesInfo(data);
      } else {
        console.error('Failed to fetch delivery notes info');
      }
    } catch (error) {
      console.error('Error fetching delivery notes info:', error);
    }
  };
  
  // Add this function to get the batch display text based on delivery notes info
  const getBatchDisplay = () => {
    if (!deliveryNotesInfo || !deliveryNotesInfo.is_partial_delivery) return null;
    
    return (
      <span className="batch-badge">
        Batch {deliveryNotesInfo.current_delivery} of {deliveryNotesInfo.total_deliveries}
      </span>
    );
  };

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
  
  const getDisplayName = (item, field, defaultValue) => {
    if (item && item[field] && item[field] !== 'Unknown Item' && item[field] !== 'Unknown Warehouse') {
      return item[field];
    }
    
    // For warehouse lookups, try to get from the warehouses list
    if (field === 'warehouse_name' && item.warehouse_id) {
      const warehouse = warehouses.find(w => w.id === item.warehouse_id);
      if (warehouse) return warehouse.name;
    }
    
    return defaultValue;
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
      case 'Not Started': return <FaClock className="status-icon" />;
      case 'In Progress': return <FaSpinner className="status-icon" />;
      case 'Completed': return <FaCheckCircle className="status-icon" />;
      default: return <FaQuestionCircle className="status-icon" />;
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
      case 'sales': return <FaShoppingCart className="icon-spacing" />;
      case 'service': return <FaTools className="icon-spacing" />;
      case 'content': return <FaBoxOpen className="icon-spacing" />;
      case 'stock': return <FaExchangeAlt className="icon-spacing" />;
      default: return <FaQuestionCircle className="icon-spacing" />;
    }
  };
  
  // Function to render items tab with warehouse and delivery note grouping
  const renderItemsTab = () => {
    // Group items by warehouse and delivery note
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
    
    // Use pickingItems if available, otherwise fall back to items_details
    const items = pickingItems.length > 0 ? pickingItems : 
      (pickingList?.items_details?.length ? pickingList.items_details : []);
    
    // Only process if we have items
    if (items.length) {
      // First group by warehouse
      items.forEach(item => {
        const warehouseId = item.warehouse_id || 'unknown';
        
        if (!warehouseMap[warehouseId]) {
          const group = {
            warehouseId,
            warehouseName: item.warehouse_name || 'Unknown Warehouse',
            deliveryNotes: {}
          };
          warehouseMap[warehouseId] = group;
          warehouseGroups.push(group);
        }
        
        // Now group by delivery note within each warehouse
        const deliveryNoteId = item.delivery_note_id || 'none';
        
        if (!warehouseMap[warehouseId].deliveryNotes[deliveryNoteId]) {
          warehouseMap[warehouseId].deliveryNotes[deliveryNoteId] = {
            deliveryNoteId,
            items: []
          };
        }
        
        warehouseMap[warehouseId].deliveryNotes[deliveryNoteId].items.push(item);
      });
    }
    
    const hasMultipleWarehouses = warehouseGroups.length > 1;
    
    return (
      <div className="items-section">
        
        {/* Progress bar remains unchanged */}
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
          warehouseGroups.map((warehouse, warehouseIndex) => (
            <div key={warehouse.warehouseId} className="warehouse-group">
              <h5 className="warehouse-name">
              <FaWarehouse className="warehouse-icon" /> {getDisplayName(warehouse, 'warehouseName', 'Unknown Warehouse')}
                {Object.values(warehouse.deliveryNotes).length > 1 && (
                  <span className="warehouse-progress">
                    Multiple Delivery Notes ({Object.values(warehouse.deliveryNotes).length})
                  </span>
                )}
              </h5>
              
              {Object.values(warehouse.deliveryNotes).map((deliveryNote, dnIndex) => (
                <div key={deliveryNote.deliveryNoteId} className="delivery-note-group">
                  {/* Add a header for the delivery note if it exists */}
                  {/* {deliveryNote.deliveryNoteId !== 'none' && (
                    <div className="delivery-note-header">
                      <FaFileAlt className="delivery-note-icon" /> 
                      <span className="delivery-note-id">
                        Delivery Note: {deliveryNote.deliveryNoteId}
                      </span>
                      <span className="item-count">
                        ({deliveryNote.items.length} items)
                      </span>
                    </div>
                  )} */}
                  
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
                        {deliveryNote.items.map((item, index) => (
                          <tr 
                            key={item.inventory_item_id || index}
                            className={`${index % 2 === 0 ? 'even-row' : 'odd-row'} ${item.is_picked ? 'picked-row' : ''}`}
                          >
                            <td>
                              {item.is_picked ? 
                                <span className="picked-status">Picked</span> : 
                                <span className="not-picked-status">Not Picked</span>
                              }
                            </td>
                            <td>{getDisplayName(item, 'item_name', 'Unknown Item')}</td>
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
                  
                  {/* Add a separator between delivery notes */}
                  {dnIndex < Object.values(warehouse.deliveryNotes).length - 1 && (
                    <hr className="delivery-note-divider" />
                  )}
                </div>
              ))}
              
              {/* Add a separator between warehouses */}
              {warehouseIndex < warehouseGroups.length - 1 && (
                <hr className="warehouse-divider" />
              )}
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
        const createResponse = await fetch(`https://r7d8au0l77.execute-api.ap-southeast-1.amazonaws.com/dev/api/picking-lists/${pickingList.picking_list_id}/create-items/`, {
          method: 'POST'
        });
        
        if (!createResponse.ok) {
          throw new Error('Failed to create picking items');
        }
        
        // Wait a moment to ensure the database has processed the creation
        // and populated the names from related tables
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Fetch again after creating
        response = await fetch(`https://r7d8au0l77.execute-api.ap-southeast-1.amazonaws.com/dev/api/picking-lists/${pickingList.picking_list_id}/items/`);
        
        // Check if we received items with names
        data = await response.json();
        
        // If we still have missing data, fetch one more time after a delay
        if (data.length > 0 && data.some(item => !item.item_name || !item.warehouse_name)) {
          await new Promise(resolve => setTimeout(resolve, 700));
          response = await fetch(`https://r7d8au0l77.execute-api.ap-southeast-1.amazonaws.com/dev/api/picking-lists/${pickingList.picking_list_id}/items/`);
          data = await response.json();
        }
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
      
      // Now update the item status - THIS IS THE MAIN FIX - METHOD NEEDS TO BE PUT
      const response = await fetch(`https://r7d8au0l77.execute-api.ap-southeast-1.amazonaws.com/dev/api/picking-items/${item.picking_item_id}/update/`, {
        method: 'PUT', // CHANGED: Added method: 'PUT' here - this was missing!
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          is_picked: !item.is_picked,
          picked_by: selectedEmployee,
          picked_at: !item.is_picked ? new Date().toISOString() : null,
          quantity_picked: !item.is_picked ? item.quantity : 0,
          // ADDED: Include these fields to preserve them
          item_name: item.item_name,
          warehouse_name: item.warehouse_name,
          warehouse_id: item.warehouse_id,
          item_no: item.item_no,
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
            {getStatusIcon(pickingList.picked_status)}
            <span className="status-text">{pickingList.picked_status}</span>
          </div>

          {/* Show partial delivery info if this is a partial delivery */}
          {deliveryNotesInfo && deliveryNotesInfo.is_partial_delivery && (
            <PartialDeliveryInfo 
              pickingList={pickingList} 
              deliveryNotesInfo={deliveryNotesInfo} 
            />
          )}

          {/* Tab Navigation */}
          <div className="modal-tabs">
            <button 
              className={`tab-button ${activeTab === 'general' ? 'active' : ''}`}
              onClick={() => setActiveTab('general')}
            >
              <FaInfoCircle className="tab-icon" />
              General Info
            </button>
            <button 
              className={`tab-button ${activeTab === 'items' ? 'active' : ''}`}
              onClick={() => setActiveTab('items')}
            >
              <FaBoxes className="tab-icon" />
              Items ({pickingList.items_details?.length || 0})
            </button>
          </div>

          {/* General Tab Content */}
          {activeTab === 'general' && (
            <>
              {/* Main information panel */}
              <div className="info-panel">
                <div className="picking-details enhanced">
                  <div className="detail-row">
                    <div className="detail-item">
                      <span className="detail-label">Delivery Type</span>
                      <span className="detail-value">
                        {getDeliveryTypeIcon(pickingList.delivery_type)}
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
                    <FaUser className="section-icon" />
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
                    <FaWarehouse className="section-icon" />
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
                    <FaClipboardList className="section-icon" />
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
                          {pickingList.picked_status === 'Not Started' ? <FaPlay /> : <FaCheck />}
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
                    <FaCheckCircle className="completed-icon" />
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
              <FaSave className="button-icon" />
              Save Changes
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditPickingModal;