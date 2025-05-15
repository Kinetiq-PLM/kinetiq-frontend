// components/shipment/CarrierManagementModal.jsx
import React, { useState } from 'react';
import { toast } from 'react-toastify';

const CarrierManagementModal = ({ onClose, carriers, employees, refreshCarriers }) => {
  const [selectedCarrier, setSelectedCarrier] = useState(null);
  const [formData, setFormData] = useState({
    carrier_name: '',
    service_type: 'Standard',
    carrier_count: 0
  });
  const [isEditing, setIsEditing] = useState(false);
  
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Reset form to create new carrier
  const handleNew = () => {
    setSelectedCarrier(null);
    setIsEditing(true);
    setFormData({
      carrier_name: employees.length > 0 ? employees[0].employee_id : '',
      service_type: 'Standard',
      carrier_count: 0
    });
  };
  
  // Edit existing carrier
  const handleEdit = (carrier) => {
    setSelectedCarrier(carrier);
    setIsEditing(true);
    setFormData({
      carrier_name: carrier.carrier_name,
      service_type: carrier.service_type || 'Standard',
      carrier_count: carrier.carrier_count || 0
    });
  };
  
  // Cancel editing
  const handleCancel = () => {
    setIsEditing(false);
    if (selectedCarrier) {
      setFormData({
        carrier_name: selectedCarrier.carrier_name,
        service_type: selectedCarrier.service_type || 'Standard',
        carrier_count: selectedCarrier.carrier_count || 0
      });
    } else {
      setFormData({
        carrier_name: employees.length > 0 ? employees[0].employee_id : '',
        service_type: 'Standard',
        carrier_count: 0
      });
    }
  };
  
  // Save carrier changes
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.carrier_name) {
      toast.error("Employee selection is required");
      return;
    }
    
    try {
      if (selectedCarrier) {
        // Update existing carrier
        const response = await fetch(`http://127.0.0.1:8000/api/carriers/${selectedCarrier.carrier_id}/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to update carrier');
        }
        
        // Show success notification
        toast.success(`Carrier ${getEmployeeFullName(formData.carrier_name)} updated successfully!`);
      } else {
        // Create new carrier
        const response = await fetch('http://127.0.0.1:8000/api/carriers/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create carrier');
        }
        
        // Show success notification
        toast.success(`New carrier ${getEmployeeFullName(formData.carrier_name)} added successfully!`);
      }
      
      // Refresh carrier list and reset form
      refreshCarriers();
      setIsEditing(false);
      setSelectedCarrier(null);
      setFormData({
        carrier_name: employees.length > 0 ? employees[0].employee_id : '',
        service_type: 'Standard',
        carrier_count: 0
      });
      
    } catch (err) {
      // Show error notification
      toast.error(`Error: ${err.message}`);
    }
  };
  
  // Helper function to get employee full name
  const getEmployeeFullName = (employeeId) => {
    const employee = employees.find(emp => emp.employee_id === employeeId);
    return employee ? employee.full_name : employeeId;
  };
  
  return (
    <div className="modal-overlay">
      <div className="shipment-modal">
        <div className="modal-header">
          <h3>Carrier Management</h3>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        
        <div className="modal-body">
          <div className="carrier-list-section">
            <div className="carriers-header">
              <h4>Available Carriers</h4>
              <button 
                type="button" 
                className="save-button"
                onClick={handleNew}
              >
                Add New Carrier
              </button>
            </div>
            
            <div className="table-wrapper" style={{ maxHeight: '300px', overflowY: 'auto' }}>
              <table className="shipment-table">
                <thead>
                  <tr>
                    <th>Carrier Employee</th>
                    <th>Service Type</th>
                    <th>Count</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {carriers.length > 0 ? (
                    carriers.map((carrier, index) => (
                      <tr 
                        key={carrier.carrier_id} 
                        className={index % 2 === 0 ? 'even-row' : 'odd-row'}
                      >
                        <td>{getEmployeeFullName(carrier.carrier_name)}</td>
                        <td>{carrier.service_type || 'Standard'}</td>
                        <td>{carrier.carrier_count || 0}</td>
                        <td>
                          <button 
                            type="button" 
                            className="save-button"
                            onClick={() => handleEdit(carrier)}
                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="no-data">
                        No carriers found. Add your first carrier.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          {isEditing && (
            <div className="edit-section" style={{ marginTop: '1.5rem' }}>
              <h4>{selectedCarrier ? 'Edit Carrier' : 'Add New Carrier'}</h4>
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <label className="form-label">Employee:</label>
                  <select
                    className="form-select"
                    name="carrier_name"
                    value={formData.carrier_name}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select an employee</option>
                    {employees.map(employee => (
                      <option key={employee.employee_id} value={employee.employee_id}>
                        {employee.full_name} ({employee.employee_id})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-row">
                  <label className="form-label">Service Type:</label>
                  <select
                    className="form-select"
                    name="service_type"
                    value={formData.service_type}
                    onChange={handleInputChange}
                  >
                    <option value="Standard">Standard</option>
                    <option value="Express">Express</option>
                    <option value="Same-day">Same-day</option>
                  </select>
                </div>
                
                <div className="form-row">
                  <label className="form-label">Carrier Count:</label>
                  <input
                    type="number"
                    className="form-input"
                    name="carrier_count"
                    value={formData.carrier_count}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>
                
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                  <button 
                    type="button" 
                    className="cancel-button"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="save-button"
                  >
                    {selectedCarrier ? 'Update Carrier' : 'Add Carrier'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
        
        <div className="modal-footer">
          <button 
            type="button" 
            className="cancel-button"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarrierManagementModal;