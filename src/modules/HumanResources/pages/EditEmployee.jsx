import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/EditEmployee.css";
import { getEmployeeById, updateEmployee, getDepartments, getPositions } from "../services/employeeService";

const EditEmployee = () => {
  const { empId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  // Fetch employee data and reference data (departments, positions)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [employeeData, departmentsData, positionsData] = await Promise.all([
          getEmployeeById(empId),
          getDepartments(),
          getPositions()
        ]);
        
        setFormData(employeeData);
        setDepartments(departmentsData);
        setPositions(positionsData);
        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load employee data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [empId]);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setSaveError(null);
      
      // Prepare the data for sending to API
      // We need to prepare the data format to match what the API expects
      const dataToSend = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
        employment_type: formData.employment_type,
        status: formData.status,
        reports_to: formData.reports_to,
        is_supervisor: formData.is_supervisor,
        dept: formData.dept?.id || null,
        position: formData.position?.id || null
      };
      
      await updateEmployee(empId, dataToSend);
      navigate("/employees");
    } catch (err) {
      console.error("Error saving employee:", err);
      setSaveError("Failed to save employee data. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/employees");
  };

  if (loading) {
    return (
      <div className="hr-edit-employee">
        <div className="hr-edit-body-content-container">
          <div className="hr-edit-loading">
            <p>Loading employee data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="hr-edit-employee">
        <div className="hr-edit-body-content-container">
          <div className="hr-edit-error">
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        </div>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="hr-edit-employee">
        <div className="hr-edit-body-content-container">
          <div className="hr-edit-error">
            <p>Employee not found.</p>
            <button onClick={() => navigate("/employees")}>Back to Employees</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="hr-edit-employee">
      <div className="hr-edit-body-content-container">
        <div className="hr-edit-scrollable">
          <div className="hr-edit-heading">
            <h2>Edit Employee: {formData.employee_id}</h2>
          </div>
          
          {saveError && (
            <div className="hr-edit-save-error">
              <p>{saveError}</p>
            </div>
          )}
          
          <form className="hr-edit-form">
            <label>
              First Name:
              <input
                type="text"
                value={formData.first_name || ''}
                onChange={(e) => handleChange("first_name", e.target.value)}
                required
              />
            </label>
            
            <label>
              Last Name:
              <input
                type="text"
                value={formData.last_name || ''}
                onChange={(e) => handleChange("last_name", e.target.value)}
                required
              />
            </label>
            
            <label>
              Phone:
              <input
                type="text"
                value={formData.phone || ''}
                onChange={(e) => handleChange("phone", e.target.value)}
                required
              />
            </label>
            
            <label>
              Department:
              <select
                value={formData.dept?.id || ''}
                onChange={(e) => {
                  const selectedDept = departments.find(d => d.id === e.target.value) || null;
                  handleChange("dept", selectedDept);
                }}
              >
                <option value="">-- Select Department --</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </label>
            
            <label>
              Position:
              <select
                value={formData.position?.id || ''}
                onChange={(e) => {
                  const selectedPosition = positions.find(p => p.id === e.target.value) || null;
                  handleChange("position", selectedPosition);
                }}
              >
                <option value="">-- Select Position --</option>
                {positions.map(position => (
                  <option key={position.id} value={position.id}>
                    {position.title}
                  </option>
                ))}
              </select>
            </label>
            
            <label>
              Employment Type:
              <select
                value={formData.employment_type || 'Regular'}
                onChange={(e) => handleChange("employment_type", e.target.value)}
              >
                <option value="Regular">Regular</option>
                <option value="Contractual">Contractual</option>
                <option value="Seasonal">Seasonal</option>
              </select>
            </label>
            
            <label>
              Status:
              <select
                value={formData.status || 'Active'}
                onChange={(e) => handleChange("status", e.target.value)}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </label>
            
            <label>
              Reports To:
              <input
                type="text"
                value={formData.reports_to || ''}
                onChange={(e) => handleChange("reports_to", e.target.value)}
                placeholder="Employee ID of supervisor"
              />
            </label>
            
            <label>
              Is Supervisor:
              <select
                value={formData.is_supervisor ? 'true' : 'false'}
                onChange={(e) => handleChange("is_supervisor", e.target.value === 'true')}
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </label>
          </form>
          
          <div className="hr-edit-buttons">
            <button onClick={handleCancel}>Cancel</button>
            <button 
              onClick={handleSave} 
              className="save-btn"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditEmployee;