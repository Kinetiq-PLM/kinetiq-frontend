import React from "react";

const CompletionModal = ({ packingList, employees, packingTypes, onConfirm, onCancel }) => {
  // Function to get employee name from ID
  const getEmployeeName = (employeeId) => {
    if (!employeeId) return 'Not assigned';
    const employee = employees.find(emp => emp.employee_id === employeeId);
    return employee ? employee.full_name : employeeId;
  };

  // Function to get packing type name from ID
  const getPackingTypeName = (typeId) => {
    if (!typeId) return 'Not specified';
    const packingType = packingTypes.find(type => type.id === typeId);
    return packingType ? packingType.name : typeId;
  };
  
  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(value || 0);
  };
  
  return (
    <div className="modal-overlay">
      <div className="completion-modal">
        <div className="modal-header">
          <h3>Confirm Packing Completion</h3>
        </div>
        
        <div className="modal-body">
          <p>
            You are about to mark this packing list as <strong>Packed</strong>.
          </p>
          
          <div className="packing-details">
            <div className="detail-item">
              <span className="detail-label">Packing ID:</span>
              <span className="detail-value">{packingList.packing_list_id}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Assigned To:</span>
              <span className="detail-value">{getEmployeeName(packingList.packed_by)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Packing Type:</span>
              <span className="detail-value">{getPackingTypeName(packingList.packing_type)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Items Count:</span>
              <span className="detail-value">{packingList.total_items_packed || 0}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Total Cost:</span>
              <span className="detail-value">{formatCurrency(packingList.total_packing_cost)}</span>
            </div>
          </div>
          
          <p>
            This action will:
          </p>
          <ul>
            <li>Update the packing list status to "Packed"</li>
            <li>Set today's date as the packing date</li>
            <li>Create a new shipment record for this package</li>
            <li>Create shipping cost and operational cost records</li>
          </ul>
          
          <p>
            <strong>This action cannot be undone.</strong> Are you sure you want to proceed?
          </p>
        </div>
        
        <div className="modal-footer">
          <button className="cancel-button" onClick={onCancel}>
            Cancel
          </button>
          <button className="confirm-button" onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompletionModal;