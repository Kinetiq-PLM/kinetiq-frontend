// components/rework/AssignModal.jsx
import React, { useState } from 'react';

const AssignModal = ({ rework, employees, onAssign, onCancel }) => {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [error, setError] = useState('');
  
  // Function to get current assigned employee name
  const getCurrentAssignee = () => {
    if (!rework.assigned_to) return 'Unassigned';
    const employee = employees.find(emp => emp.employee_id === rework.assigned_to);
    return employee ? employee.full_name : rework.assigned_to;
  };
  
  const handleSubmit = () => {
    if (!selectedEmployeeId) {
      setError('Please select an employee');
      return;
    }
    
    onAssign(selectedEmployeeId);
  };
  
  return (
    <div className="modal-overlay">
      <div className="assign-modal">
        <div className="modal-header">
          <h3>Assign Rework</h3>
          <button className="close-button" onClick={onCancel}>&times;</button>
        </div>
        
        <div className="modal-body">
          <p>Assign this rework order to an employee:</p>
          
          <div className="form-row">
            <label className="form-label">Rework ID:</label>
            <input 
              type="text" 
              className="form-input" 
              value={rework.rework_id}
              readOnly
            />
          </div>
          
          <div className="form-row">
            <label className="form-label">Current Assignee:</label>
            <input 
              type="text" 
              className="form-input" 
              value={getCurrentAssignee()}
              readOnly
            />
          </div>
          
          <div className="form-row">
            <label className="form-label">Select Employee:</label>
            <select 
              className="form-select"
              value={selectedEmployeeId}
              onChange={(e) => {
                setSelectedEmployeeId(e.target.value);
                setError('');
              }}
            >
              <option value="">-- Select an employee --</option>
              {employees.map(employee => (
                <option 
                  key={employee.employee_id} 
                  value={employee.employee_id}
                >
                  {employee.full_name}
                  {/* {employee.full_name} - {employee.job_title || 'N/A'} */}

                </option>
              ))}
            </select>
            {error && <div className="error-text">{error}</div>}
          </div>
        </div>
        
        <div className="modal-footer">
          <button className="cancel-button" onClick={onCancel}>Cancel</button>
          <button className="save-button" onClick={handleSubmit}>Assign</button>
        </div>
      </div>
    </div>
  );
};

export default AssignModal;