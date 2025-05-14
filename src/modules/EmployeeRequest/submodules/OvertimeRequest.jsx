import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/OvertimeRequest.css";

const OvertimeRequest = () => {
  // Form state
  const [formData, setFormData] = useState({
    employee_id: "",
    employee_name: "",
    date: new Date().toISOString().split('T')[0], // Today's date
    start_time: "",
    end_time: "",
    reason: "",
  });

  // UI states
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [fetchingEmployees, setFetchingEmployees] = useState(false);

  // Fetch employees on component mount
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setFetchingEmployees(true);
        const response = await axios.get("http://127.0.0.1:8000///api/employees");
        // Filter only active employees
        const activeEmployees = response.data.filter(emp => emp.status === "Active");
        setEmployees(activeEmployees);
      } catch (err) {
        console.error("Error fetching employees:", err);
        showToast("Failed to load employee list", false);
      } finally {
        setFetchingEmployees(false);
      }
    };
    
    fetchEmployees();
  }, []);

  // Toast message helper
  const showToast = (message, success = true) => {
    setToast({ message, success });
    setTimeout(() => setToast(null), 3000);
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for employee_id selection
    if (name === "employee_id" && value) {
      const selectedEmployee = employees.find(emp => emp.employee_id === value);
      if (selectedEmployee) {
        // Update both employee_id and employee_name
        setFormData(prev => ({
          ...prev,
          employee_id: selectedEmployee.employee_id,
          employee_name: `${selectedEmployee.first_name} ${selectedEmployee.last_name}`
        }));
        return;
      }
    }
    
    // Special handling for employee_name selection
    if (name === "employee_name" && value) {
      // Find the employee by name
      const selectedOption = e.target.options[e.target.selectedIndex];
      const employeeId = selectedOption.getAttribute('data-employee-id');
      
      if (employeeId) {
        setFormData(prev => ({
          ...prev,
          employee_id: employeeId,
          employee_name: value
        }));
        return;
      }
    }
    
    // Normal handling for other fields
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.employee_id || !formData.date || !formData.start_time || 
        !formData.end_time || !formData.reason) {
      showToast("Please fill all required fields", false);
      return;
    }
    
    try {
      setLoading(true);
      
      // Submit to API
      const payload = {
        employee_id: formData.employee_id,
        date: formData.date,
        start_time: formData.start_time,
        end_time: formData.end_time,
        reason: formData.reason
      };
      
      await axios.post(
        "http://127.0.0.1:8000///api/overtime_requests/",
        payload
      );
      
      showToast("Overtime request submitted successfully", true);
      setSubmitted(true);
      
      // Reset form
      setFormData({
        employee_id: "",
        employee_name: "",
        date: new Date().toISOString().split('T')[0],
        start_time: "",
        end_time: "",
        reason: "",
      });
      
    } catch (err) {
      console.error("Error submitting overtime request:", err);
      const errorMessage = err.response?.data?.detail || 
                         Object.values(err.response?.data || {}).flat().join(", ") || 
                         "Failed to submit overtime request";
      showToast(errorMessage, false);
    } finally {
      setLoading(false);
    }
  };

  // Calculate hours difference between start and end time
  const calculateHours = () => {
    if (!formData.start_time || !formData.end_time) return null;
    
    const [startHours, startMinutes] = formData.start_time.split(':').map(Number);
    const [endHours, endMinutes] = formData.end_time.split(':').map(Number);
    
    let hoursDiff = endHours - startHours;
    let minutesDiff = endMinutes - startMinutes;
    
    if (minutesDiff < 0) {
      hoursDiff--;
      minutesDiff += 60;
    }
    
    if (hoursDiff < 0) {
      // Handle case where end time is next day
      hoursDiff += 24;
    }
    
    return hoursDiff + (minutesDiff / 60);
  };

  const hours = calculateHours();

  return (
    <div className="over-req">
      <div className="body-content-container">
        <div className="over-req-scrollable">
          <div className="over-req-heading">
            <h2><strong>Overtime Request Form</strong></h2>
          </div>
          
          {submitted ? (
            <div className="over-req-success-container">
              <h3>Overtime Request Submitted</h3>
              <p>Your overtime request has been submitted successfully.</p>
              <button 
                onClick={() => setSubmitted(false)} 
                className="over-req-new-button"
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <div className="over-req-form-container">
              <form onSubmit={handleSubmit} className="over-req-form">
                <div className="over-req-form-columns">
                  <div className="over-req-form-column">
                    <div className="over-req-form-group">
                      <label>Employee ID *</label>
                      {fetchingEmployees ? (
                        <div className="over-req-loading-dropdown">Loading employees...</div>
                      ) : (
                        <select
                          name="employee_id"
                          value={formData.employee_id}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">-- Select Employee ID --</option>
                          {employees.map(emp => (
                            <option key={emp.employee_id} value={emp.employee_id}>
                              {emp.employee_id}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                    
                    <div className="over-req-form-group">
                      <label>Employee Name *</label>
                      {fetchingEmployees ? (
                        <div className="over-req-loading-dropdown">Loading employees...</div>
                      ) : (
                        <select
                          name="employee_name"
                          value={formData.employee_name}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">-- Select Employee Name --</option>
                          {employees.map(emp => (
                            <option 
                              key={emp.employee_id} 
                              value={`${emp.first_name} ${emp.last_name}`}
                              data-employee-id={emp.employee_id}
                            >
                              {emp.first_name} {emp.last_name}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>
                  
                  <div className="over-req-form-column">
                    <div className="over-req-form-group">
                      <label>Date *</label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="over-req-form-row">
                      <div className="over-req-form-group">
                        <label>Start Time *</label>
                        <input
                          type="time"
                          name="start_time"
                          value={formData.start_time}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div className="over-req-form-group">
                        <label>End Time *</label>
                        <input
                          type="time"
                          name="end_time"
                          value={formData.end_time}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    
                    {hours !== null && (
                      <div className="over-req-hours-display">
                        <span>Total Hours: </span>
                        <strong>{hours.toFixed(2)}</strong>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="over-req-form-group full-width">
                  <label>Reason for Overtime *</label>
                  <textarea
                    name="reason"
                    value={formData.reason}
                    onChange={handleInputChange}
                    rows="5"
                    required
                    placeholder="Please provide the reason why overtime work is required"
                  />
                </div>
                
                <div className="over-req-form-buttons">
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        employee_id: "",
                        employee_name: "",
                        date: new Date().toISOString().split('T')[0],
                        start_time: "",
                        end_time: "",
                        reason: "",
                      });
                    }}
                    className="cancel-btn"
                  >
                    Clear Form
                  </button>
                  
                  <button
                    type="submit"
                    className="submit-btn"
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : "Submit Request"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
      
      {/* Toast notification */}
      {toast && (
        <div 
          className="over-req-toast"
          style={{ backgroundColor: toast.success ? "#4CAF50" : "#F44336" }}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default OvertimeRequest;