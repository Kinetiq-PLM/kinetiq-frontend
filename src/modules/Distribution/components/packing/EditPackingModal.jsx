// components/packing/EditPackingModal.jsx
import React, { useState, useEffect } from "react";

const EditPackingModal = ({ packingList, employees, packingTypes, onClose, onSave, onStatusUpdate }) => {
  // State for edited values
  const [editedValues, setEditedValues] = useState({});
  // State for the current packing cost values
  const [packingCost, setPackingCost] = useState({
    material_cost: 0,
    labor_cost: 0,
    total_packing_cost: 0
  });
  
  // Load packing cost data from packingList when modal opens
  useEffect(() => {
    if (packingList && packingList.packing_cost_info) {
      setPackingCost({
        material_cost: packingList.packing_cost_info.material_cost || 0,
        labor_cost: packingList.packing_cost_info.labor_cost || 0,
        total_packing_cost: packingList.packing_cost_info.total_packing_cost || 0
      });
    }
  }, [packingList]);
  
  // Handle input changes
  const handleInputChange = (field, value) => {
    setEditedValues(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Handle cost input changes
  const handleCostChange = (field, value) => {
    const numericValue = parseFloat(value);
    
    // Update local state for display
    setPackingCost(prev => {
      const newCost = {
        ...prev,
        [field]: isNaN(numericValue) ? 0 : numericValue
      };
      
      // Calculate total automatically
      newCost.total_packing_cost = newCost.material_cost + newCost.labor_cost;
      
      return newCost;
    });
    
    // Also add to editedValues for saving
    setEditedValues(prev => ({
      ...prev,
      [field]: isNaN(numericValue) ? 0 : numericValue
    }));
  };
  
  // Handle save button click
  const handleSave = () => {
    onSave(packingList, editedValues);
  };
  
  // Helper to check if the values have changed
  const hasChanges = () => {
    return Object.keys(editedValues).length > 0;
  };
  
  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(value);
  };
  
  // Get appropriate action label based on status
  const getNextStatusLabel = () => {
    switch (packingList.packing_status) {
      case 'Pending':
        return 'Mark as Packed';
      case 'Packed':
        return 'Mark as Shipped';
      default:
        return '';
    }
  };
  
  // Get next status value based on current status
  const getNextStatus = () => {
    switch (packingList.packing_status) {
      case 'Pending':
        return 'Packed';
      case 'Packed':
        return 'Shipped';
      default:
        return null;
    }
  };
  
  // Check if status can be updated
  const canUpdateStatus = () => {
    return packingList.packing_status !== 'Shipped' && Boolean(getNextStatus());
  };
  
  // Handle status update button click
  const handleStatusUpdate = () => {
    const nextStatus = getNextStatus();
    if (nextStatus) {
      onStatusUpdate(packingList, nextStatus);
    }
  };
  
  return (
    <div className="modal-overlay">
      <div className="edit-packing-modal">
        <div className="modal-header">
          <h3>Edit Packing List</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          {/* Basic Information */}
          <div className="info-section">
            <h4>Packing Information</h4>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Packing ID:</span>
                <span className="info-value">{packingList.packing_list_id}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Order Type:</span>
                <span className="info-value">{packingList.is_external ? 'External' : 'Internal'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Status:</span>
                <span className={`info-value status-${packingList.packing_status?.toLowerCase()}`}>
                  {packingList.packing_status || '-'}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Items Count:</span>
                <span className="info-value">{packingList.total_items_packed || '0'}</span>
              </div>
              {packingList.packing_date && (
                <div className="info-item">
                  <span className="info-label">Packing Date:</span>
                  <span className="info-value">{new Date(packingList.packing_date).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Related Picking List */}
          {packingList.picking_list_info && (
            <div className="info-section">
              <h4>Related Picking List</h4>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Picking ID:</span>
                  <span className="info-value">{packingList.picking_list_info.picking_list_id}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Picked By:</span>
                  <span className="info-value">{packingList.picking_list_info.picked_by || '-'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Status:</span>
                  <span className={`info-value status-${packingList.picking_list_info.picked_status?.toLowerCase().replace(' ', '-')}`}>
                    {packingList.picking_list_info.picked_status || '-'}
                  </span>
                </div>
                {packingList.picking_list_info.warehouse_name && (
                  <div className="info-item">
                    <span className="info-label">Warehouse:</span>
                    <span className="info-value">{packingList.picking_list_info.warehouse_name}</span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Packing Assignment Section */}
          <div className="edit-section">
            <h4>Assign Packer</h4>
            <div className="employee-selection">
              <select
                className="employee-dropdown"
                value={editedValues.packed_by || packingList.packed_by || ''}
                onChange={(e) => handleInputChange('packed_by', e.target.value)}
              >
                <option value="">-- Select Employee --</option>
                {employees.map((employee) => (
                  <option key={employee.employee_id} value={employee.employee_id}>
                    {employee.full_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Packing Type Section */}
          <div className="edit-section">
            <h4>Packing Type</h4>
            <div className="packing-type-selection">
              <select
                className="packing-type-dropdown"
                value={editedValues.packing_type || packingList.packing_type || ''}
                onChange={(e) => handleInputChange('packing_type', e.target.value)}
              >
                <option value="">-- Select Packing Type --</option>
                {packingTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Packing Cost Section */}
          <div className="edit-section">
            <h4>Packing Costs</h4>
            <div className="cost-editing">
              <div className="cost-input-row">
                <label className="cost-label">Material Cost:</label>
                <input
                  type="number"
                  className="cost-input"
                  value={packingCost.material_cost}
                  onChange={(e) => handleCostChange('material_cost', e.target.value)}
                  step="0.01"
                  min="0"
                />
              </div>
              <div className="cost-input-row">
                <label className="cost-label">Labor Cost:</label>
                <input
                  type="number"
                  className="cost-input"
                  value={packingCost.labor_cost}
                  onChange={(e) => handleCostChange('labor_cost', e.target.value)}
                  step="0.01"
                  min="0"
                />
              </div>
              <div className="cost-total-row">
                <span className="cost-total-label">Total Cost:</span>
                <span className="cost-total-value">
                  {formatCurrency(packingCost.total_packing_cost)}
                </span>
              </div>
            </div>
          </div>
          
          {/* Status Update Button */}
          {canUpdateStatus() && (
            <div className="status-section">
              <h4>Status Update</h4>
              <button
                className={`status-update-button status-${getNextStatus().toLowerCase()}`}
                onClick={handleStatusUpdate}
              >
                {getNextStatusLabel()}
              </button>
            </div>
          )}
          
          {/* Already shipped indicator */}
          {packingList.packing_status === 'Shipped' && (
            <div className="shipped-message">
              This packing list has been marked as shipped and cannot be modified further.
            </div>
          )}
        </div>
        
        <div className="modal-footer">
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button
            className="save-button"
            onClick={handleSave}
            disabled={!hasChanges() || packingList.packing_status === 'Shipped'}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPackingModal;