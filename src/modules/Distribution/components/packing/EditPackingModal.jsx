import React, { useState, useEffect } from "react";
import { 
  FaUser, 
  FaBox, 
  FaMoneyBillWave, 
  FaClipboardCheck, 
  FaInfoCircle, 
  FaTags,
  FaWarehouse,
  FaCalendarAlt,
  FaRegCheckCircle,
  FaCheckDouble,
  FaShippingFast,
  FaChevronDown,
  FaChevronUp,
  FaArrowRight,
  FaExclamationCircle
} from "react-icons/fa";

const EditPackingModal = ({ packingList, employees, packingTypes, onClose, onSave, onStatusUpdate }) => {
  // State for edited values
  const [editedValues, setEditedValues] = useState({});
  // State for the current packing cost values
  const [packingCost, setPackingCost] = useState({
    material_cost: 0,
    labor_cost: 0,
    total_packing_cost: 0
  });
  const [maxItemsCount, setMaxItemsCount] = useState(0);
  
  // Accordion state for collapsible sections
  const [expandedSections, setExpandedSections] = useState({
    info: true,
    pickingInfo: true,
    employee: true,
    packingType: true,
    costs: true
  });
  
  // Check if packing list is already packed or shipped (both are final states for this module)
  const isPacked = packingList?.packing_status === 'Packed';
  const isShipped = packingList?.packing_status === 'Shipped';
  const isNotEditable = isPacked || isShipped;
  
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
  
  useEffect(() => {
    // If we have picking_list_id, fetch the items_count to use as max value
    if (packingList && packingList.picking_list_id) {
      const fetchPickingListDetails = async () => {
        try {
          const response = await fetch(`http://127.0.0.1:8000/api/picking-lists/${packingList.picking_list_id}/`);
          if (response.ok) {
            const pickingList = await response.json();
            if (pickingList.items_count) {
              // Store the max items count
              setMaxItemsCount(pickingList.items_count);
              
              // If total_items_packed is null, initialize it with items_count
              if (!packingList.total_items_packed || packingList.total_items_packed === null) {
                handleInputChange('total_items_packed', pickingList.items_count);
              }
            }
          }
        } catch (error) {
          console.error("Error fetching picking list:", error);
        }
      };
      
      fetchPickingListDetails();
    }
  }, [packingList]);

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    // Don't update if packed or shipped
    if (isNotEditable) return;
    
    // For total_items_packed, limit to the max items count from picking list
    if (field === 'total_items_packed') {
      const numValue = parseInt(value) || 0;
      // Ensure value doesn't exceed the max items count
      const limitedValue = Math.min(numValue, maxItemsCount);
      
      setEditedValues(prev => ({
        ...prev,
        [field]: limitedValue
      }));
      return;
    }
    
    // For other fields, update normally
    setEditedValues(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Handle cost input changes
  const handleCostChange = (field, value) => {
    // Don't update if packed or shipped
    if (isNotEditable) return;
    
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
    if (isNotEditable) return;
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
      default:
        return '';
    }
  };
  
  // Get next status value based on current status
  const getNextStatus = () => {
    switch (packingList.packing_status) {
      case 'Pending':
        return 'Packed';
      default:
        return null;
    }
  };
  
  // Check if status can be updated - only pending can be updated to packed
  const canUpdateStatus = () => {
    return packingList.packing_status === 'Pending';
  };
  
  // Check if status update button should be disabled
  const isStatusUpdateDisabled = () => {
    // Always require 100% completion before allowing status update
    if (getCompletionPercentage() < 100) {
      return true;
    }
    
    // Need an employee assigned
    if (!editedValues.packed_by && !packingList.packed_by) {
      return true;
    }
    
    // Need a packing type selected
    if (!editedValues.packing_type && !packingList.packing_type) {
      return true;
    }
    
    // Make sure there are valid costs
    if (packingCost.material_cost <= 0 && packingCost.labor_cost <= 0) {
      return true;
    }
    
    return false;
  };
  
  // Get validation message for status update
  const getValidationMessage = () => {
    if (getCompletionPercentage() < 100) {
      return 'All required fields must be completed (100%)';
    }
    
    if (!editedValues.packed_by && !packingList.packed_by) {
      return 'Please assign an employee for packing';
    }
    
    if (!editedValues.packing_type && !packingList.packing_type) {
      return 'Please select a packing type';
    }
    
    if (packingCost.material_cost <= 0 && packingCost.labor_cost <= 0) {
      return 'Please enter valid packing costs';
    }
    
    return '';
  };
  
  // Handle status update button click
  const handleStatusUpdate = () => {
    if (isNotEditable) return;
    
    const nextStatus = getNextStatus();
    if (nextStatus) {
      // Create an object with all current edited values
      const updatedValues = {
        ...editedValues,
        packed_by: editedValues.packed_by || packingList.packed_by,
        packing_type: editedValues.packing_type || packingList.packing_type,
        material_cost: packingCost.material_cost,
        labor_cost: packingCost.labor_cost,
        total_packing_cost: packingCost.total_packing_cost
      };
      
      // Call onStatusUpdate with all the edited values
      onStatusUpdate(packingList, nextStatus, updatedValues);
    }
  };
  
  // Get employee name from ID
  const getEmployeeName = (employeeId) => {
    const employee = employees.find(emp => emp.employee_id === employeeId);
    return employee ? employee.full_name : 'Not assigned';
  };
  
  // Get packing type name from ID
  const getPackingTypeName = (typeId) => {
    const packingType = packingTypes.find(type => type.id === typeId);
    return packingType ? packingType.name : 'Not specified';
  };
  
  // Get status badge class
  const getStatusBadgeClass = (status) => {
    if (!status) return '';
    
    return `status-badge status-${status.toLowerCase()}`;
  };
  
  // Get completion percentage based on filled fields
  const getCompletionPercentage = () => {
    let totalScore = 0;
    let maxScore = 5; // Now including 5 factors (4 original + items packed)
    
    // Original factors
    if (editedValues.packed_by || packingList.packed_by) totalScore++;
    if (editedValues.packing_type || packingList.packing_type) totalScore++;
    if (packingCost.material_cost > 0) totalScore++;
    if (packingCost.labor_cost > 0) totalScore++;
    
    // Add factor for packed items (as a percentage of max items)
    const currentItemsCount = editedValues.total_items_packed || packingList.total_items_packed || 0;
    if (maxItemsCount > 0) {
      const itemsPercentage = currentItemsCount / maxItemsCount;
      totalScore += itemsPercentage; // This will add up to 1.0 for 100% packed
    }
    
    return (totalScore / maxScore) * 100;
  };
  
  return (
    <div className="packing modal-overlay" onClick={onClose}>
      <div className="edit-packing-modal improved" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-container">
            <h3>{isNotEditable ? 'View Packing List' : 'Edit Packing List'}</h3>
            <div className="modal-subtitle">
              <span className={getStatusBadgeClass(packingList.packing_status)}>
                {packingList.packing_status || 'No Status'}
              </span>
            </div>
          </div>
          <button className="close-button" onClick={onClose} aria-label="Close modal">×</button>
        </div>
        
        <div className="modal-body">
          <div className="modal-scrollable-content">
            {/* Basic Information */}
            <div className="accordion-section">
              <div 
                className="accordion-header" 
                onClick={() => toggleSection('info')}
                aria-expanded={expandedSections.info}
              >
                <div className="accordion-title">
                  <FaBox className="section-icon" /> Packing Information
                </div>
                <div className="accordion-toggle">
                  {expandedSections.info ? <FaChevronUp /> : <FaChevronDown />}
                </div>
              </div>
              
              {expandedSections.info && (
                <div className="accordion-content">
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="info-label">Packing ID</span>
                      <span className="info-value highlight">{packingList.packing_list_id}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Order Type</span>
                      <span className="info-value">
                        {packingList.is_external ? 'External Order' : 'Internal Order'}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Status</span>
                      <span className={`info-value status-${packingList.packing_status?.toLowerCase()}`}>
                        {packingList.packing_status || '-'}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">
                        Packed Items Count
                        <span className="items-max-info">(Max: {maxItemsCount})</span>
                      </span>
                      {isNotEditable ? (
                        <span className="info-value">{packingList.total_items_packed || '0'}</span>
                      ) : (
                        <div className="items-count-input-container">
                          <input
                            type="number"
                            className="form-control"
                            value={editedValues.total_items_packed || packingList.total_items_packed || ''}
                            onChange={(e) => handleInputChange('total_items_packed', parseInt(e.target.value) || 0)}
                            min="0"
                            max={maxItemsCount}
                          />
                          <div className="slider-container">
                            <input
                              type="range"
                              min="0"
                              max={maxItemsCount}
                              value={editedValues.total_items_packed || packingList.total_items_packed || 0}
                              onChange={(e) => handleInputChange('total_items_packed', parseInt(e.target.value))}
                              className="range-slider"
                            />
                            <div className="range-labels">
                              <span>0</span>
                              <span>{maxItemsCount}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    {packingList.packing_date && (
                      <div className="info-item">
                        <span className="info-label">Packing Date</span>
                        <div className="info-value-with-icon">
                          {/* <FaCalendarAlt className="info-icon" /> */}
                          <span>{new Date(packingList.packing_date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* Packing Assignment Section */}
            <div className="accordion-section">
              <div 
                className="accordion-header" 
                onClick={() => toggleSection('employee')}
                aria-expanded={expandedSections.employee}
              >
                <div className="accordion-title">
                  <FaUser className="section-icon" /> Assign Packer
                  {!isNotEditable && (!editedValues.packed_by && !packingList.packed_by) && 
                    <span className="required-indicator">*</span>
                  }
                </div>
                <div className="accordion-toggle">
                  {expandedSections.employee ? <FaChevronUp /> : <FaChevronDown />}
                </div>
              </div>
              
              {expandedSections.employee && (
                <div className="accordion-content">
                  {isNotEditable ? (
                    <div className="employee-display info-display">
                      <FaUser className="display-icon" />
                      <span className="display-value">
                        {getEmployeeName(packingList.packed_by)}
                      </span>
                    </div>
                  ) : (
                    <div className="input-container">
                      <select
                        className="form-select"
                        value={editedValues.packed_by || packingList.packed_by || ''}
                        onChange={(e) => handleInputChange('packed_by', e.target.value)}
                        disabled={isNotEditable}
                      >
                        <option value="">-- Select Employee --</option>
                        {employees.map((employee) => (
                          <option key={employee.employee_id} value={employee.employee_id}>
                            {employee.full_name}
                          </option>
                        ))}
                      </select>
                      
                      {(!editedValues.packed_by && !packingList.packed_by) && (
                        <div className="field-hint">Employee assignment is required</div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Packing Type Section */}
            <div className="accordion-section">
              <div 
                className="accordion-header" 
                onClick={() => toggleSection('packingType')}
                aria-expanded={expandedSections.packingType}
              >
                <div className="accordion-title">
                  <FaTags className="section-icon" /> Packing Type
                  {!isNotEditable && (!editedValues.packing_type && !packingList.packing_type) && 
                    <span className="required-indicator">*</span>
                  }
                </div>
                <div className="accordion-toggle">
                  {expandedSections.packingType ? <FaChevronUp /> : <FaChevronDown />}
                </div>
              </div>
              
              {expandedSections.packingType && (
                <div className="accordion-content">
                  {isNotEditable ? (
                    <div className="packing-type-display info-display">
                      <FaTags className="display-icon" />
                      <span className="display-value">
                        {getPackingTypeName(packingList.packing_type)}
                      </span>
                    </div>
                  ) : (
                    <div className="input-container">
                      <select
                        className="form-select"
                        value={editedValues.packing_type || packingList.packing_type || ''}
                        onChange={(e) => handleInputChange('packing_type', e.target.value)}
                        disabled={isNotEditable}
                      >
                        <option value="">-- Select Packing Type --</option>
                        {packingTypes.map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.name}
                          </option>
                        ))}
                      </select>
                      
                      {(!editedValues.packing_type && !packingList.packing_type) && (
                        <div className="field-hint">Packing type is required</div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Packing Cost Section */}
            <div className="accordion-section">
              <div 
                className="accordion-header" 
                onClick={() => toggleSection('costs')}
                aria-expanded={expandedSections.costs}
              >
                <div className="accordion-title">
                  <FaMoneyBillWave className="section-icon" /> Packing Costs
                  {!isNotEditable && (packingCost.material_cost <= 0 && packingCost.labor_cost <= 0) && 
                    <span className="required-indicator">*</span>
                  }
                </div>
                <div className="accordion-toggle">
                  {expandedSections.costs ? <FaChevronUp /> : <FaChevronDown />}
                </div>
              </div>
              
              {expandedSections.costs && (
                <div className="accordion-content">
                  {isNotEditable ? (
                    <div className="cost-display">
                      <div className="cost-info-row">
                        <span className="cost-label">Material Cost:</span>
                        <span className="cost-value">{formatCurrency(packingCost.material_cost)}</span>
                      </div>
                      <div className="cost-info-row">
                        <span className="cost-label">Labor Cost:</span>
                        <span className="cost-value">{formatCurrency(packingCost.labor_cost)}</span>
                      </div>
                      <div className="cost-total-row">
                        <span className="cost-total-label">Total Cost:</span>
                        <span className="cost-total-value">
                          {formatCurrency(packingCost.total_packing_cost)}
                        </span>
                      </div>
                    </div>
                  ) : (
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
                          disabled={isNotEditable}
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
                          disabled={isNotEditable}
                        />
                      </div>
                      <div className="cost-total-row">
                        <span className="cost-total-label">Total Cost:</span>
                        <span className="cost-total-value">
                          {formatCurrency(packingCost.total_packing_cost)}
                        </span>
                      </div>
                      
                      {(packingCost.material_cost <= 0 && packingCost.labor_cost <= 0) && (
                        <div className="field-hint">At least one cost value must be greater than zero</div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Status Update Section */}
            {canUpdateStatus() && (
              <div className="status-update-section">
                <h4>Status Update</h4>
                
                {/* Progress indicator */}
                <div className="progress-container">
                  <div className="progress-label">Completion Status</div>
                  <div className="progress-bar-container">
                    <div 
                      className="progress-bar" 
                      style={{width: `${getCompletionPercentage()}%`}}
                    ></div>
                  </div>
                  <div className="progress-percentage">{Math.round(getCompletionPercentage())}%</div>
                </div>
                
                <button
                  className={`status-update-button status-${getNextStatus().toLowerCase()}`}
                  onClick={handleStatusUpdate}
                  disabled={isStatusUpdateDisabled()}
                >
                  <FaShippingFast className="button-icon" />
                  {getNextStatusLabel()}
                </button>
                
                {isStatusUpdateDisabled() && (
                  <div className="validation-message">
                    <FaExclamationCircle className="validation-icon" />
                    {getValidationMessage()}
                  </div>
                )}
                
                {/* Next steps info when button is enabled */}
                {!isStatusUpdateDisabled() && (
                  <div className="next-steps-info">
                    <h5><FaInfoCircle className="info-icon" /> What happens when you mark as packed?</h5>
                    <div className="next-steps-content">
                      <div className="next-step-item">
                        <div className="step-indicator">1</div>
                        <span>The packing list status will change to "Packed"</span>
                      </div>
                      <div className="next-step-item">
                        <div className="step-indicator">2</div>
                        <span>The packing costs will be recorded</span>
                      </div>
                      <div className="next-step-item">
                        <div className="step-indicator">3</div>
                        <span>A new shipment record will be created automatically</span>
                      </div>
                      <div className="next-step-item">
                        <div className="step-indicator">4</div>
                        <span>The item will move to the shipping stage</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Status message for packed items */}
            {isPacked && (
              <div className="status-message-section status-packed">
                <FaRegCheckCircle className="status-icon" />
                <div className="status-message">
                  <h5>This packing list has been completed</h5>
                  <p>The items are now ready to be shipped.</p>
                </div>
              </div>
            )}
            
            {/* Status message for shipped items */}
            {isShipped && (
              <div className="status-message-section status-shipped">
                <FaCheckDouble className="status-icon" />
                <div className="status-message">
                  <h5>This packing list has been shipped</h5>
                  <p>This record cannot be modified and is for reference only.</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="modal-footer">
          <button className="cancel-button" onClick={onClose}>
            {isNotEditable ? 'Close' : 'Cancel'}
          </button>
          {!isNotEditable && (
            <button
              className="save-button"
              onClick={handleSave}
              disabled={!hasChanges() || isNotEditable}
            >
              <FaRegCheckCircle className="button-icon" />
              Save Changes
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditPackingModal;