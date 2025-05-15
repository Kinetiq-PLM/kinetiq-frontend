import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/LeaveRequest.css";

const LeaveRequest = () => {
  // Form state
  const [formData, setFormData] = useState({
    employee_id: "",
    employee_name: "",
    dept_id: "",
    dept_name: "",
    leave_type: "",
    start_date: "",
    end_date: "",
    is_paid: true,
    reason: "",
  });

  // UI states
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [fetchingEmployees, setFetchingEmployees] = useState(false);
  const [fetchingDepartments, setFetchingDepartments] = useState(false);

  // Properly use the error state
  const [renderError, setRenderError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Add a new state for leave balances
  const [leaveBalances, setLeaveBalances] = useState(null);
  const [fetchingLeaveBalances, setFetchingLeaveBalances] = useState(false);

  // Fetch employees on component mount with improved error handling
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setFetchingEmployees(true);
        
        // Use the real API endpoint to fetch employees
        const response = await axios.get("https://1wj5891jxg.execute-api.ap-southeast-1.amazonaws.com/dev/api/employees");

        if (!response || !response.data) {
          throw new Error("Invalid response from employees API");
        }

        // Filter only active employees with "Regular" employment type
        const regularEmployees = response.data.filter(emp => 
          emp && 
          emp.status === "Active" && 
          emp.employment_type === "Regular"
        ) || [];
        
        setEmployees(regularEmployees);
      } catch (err) {
        console.error("Error fetching employees:", err);
        showToast("Failed to load employee list", false);
        setEmployees([]);
      } finally {
        setFetchingEmployees(false);
      }
    };

    fetchEmployees().catch(error => {
      setRenderError(true);
      setErrorMessage("Failed to fetch employee data: " + error.message);
    });
  }, []);

  // Fetch departments on component mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setFetchingDepartments(true);
        
        // Use the real API endpoint to fetch departments
        const response = await axios.get("https://1wj5891jxg.execute-api.ap-southeast-1.amazonaws.com/dev/api/departments/department/");
        setDepartments(response.data);
      } catch (err) {
        console.error("Error fetching departments:", err);
        showToast("Failed to load department list", false);
      } finally {
        setFetchingDepartments(false);
      }
    };

    fetchDepartments();
  }, []);

  // Add a function to fetch employee leave balances when employee changes
  useEffect(() => {
    const fetchLeaveBalances = async () => {
      if (!formData.employee_id) return;
      
      try {
        setFetchingLeaveBalances(true);
        
        // Fetch the current year's leave balances for this employee
        const response = await axios.get(`https://1wj5891jxg.execute-api.ap-southeast-1.amazonaws.com/dev/api/employee_leave_balances/balances/${formData.employee_id}/`);
        
        if (response && response.data) {
          setLeaveBalances(response.data);
        }
      } catch (err) {
        console.error("Error fetching leave balances:", err);
        // Don't show a toast here to avoid annoying the user
        setLeaveBalances(null);
      } finally {
        setFetchingLeaveBalances(false);
      }
    };

    fetchLeaveBalances();
  }, [formData.employee_id]);

  // Toast message helper with improved error handling
  const showToast = (message, success = true) => {
    try {
      setToast({ message, success });
      
      // Auto-hide the toast after a delay
      // Use a longer timeout for error messages
      const timeoutDuration = success ? 3000 : 6000;
      setTimeout(() => setToast(null), timeoutDuration);
    } catch (err) {
      console.error("Error showing toast:", err);
      // Fallback if toast fails
      alert(message);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Special handling for date fields with validation
    if (name === 'start_date' || name === 'end_date') {
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time for fair comparison
      
      // For start date, ensure it's not in the past
      if (name === 'start_date' && selectedDate < today) {
        showToast("Start date cannot be in the past", false);
        return;
      }
      
      // For end date, ensure it's not before start date
      if (name === 'end_date' && formData.start_date && selectedDate < new Date(formData.start_date)) {
        showToast("End date cannot be before start date", false);
        return;
      }
    }

    // Special handling for employee_id selection
    if (name === "employee_id" && value) {
      const selectedEmployee = employees.find(emp => emp.employee_id === value);
      if (selectedEmployee) {
        const deptId = selectedEmployee.dept?.dept_id || "";
        const deptName = selectedEmployee.dept?.dept_name || "";

        // Update both employee_id, employee_name and department info
        setFormData(prev => ({
          ...prev,
          employee_id: selectedEmployee.employee_id,
          employee_name: `${selectedEmployee.first_name} ${selectedEmployee.last_name}`,
          dept_id: deptId,
          dept_name: deptName,
        }));
        return;
      }
    }

    // Special handling for employee_name selection
    if (name === "employee_name" && value) {
      const selectedOption = e.target.options[e.target.selectedIndex];
      const employeeId = selectedOption.getAttribute('data-employee-id');

      if (employeeId) {
        const selectedEmployee = employees.find(emp => emp.employee_id === employeeId);
        if (selectedEmployee) {
          const deptId = selectedEmployee.dept?.dept_id || "";
          const deptName = selectedEmployee.dept?.dept_name || "";

          setFormData(prev => ({
            ...prev,
            employee_id: employeeId,
            employee_name: value,
            dept_id: deptId,
            dept_name: deptName,
          }));
        }
        return;
      }
    }

    // Special handling for department selection
    if (name === "dept_id" && value) {
      const selectedDept = departments.find(dept => dept.dept_id === value);
      if (selectedDept) {
        setFormData(prev => ({
          ...prev,
          dept_id: selectedDept.dept_id,
          dept_name: selectedDept.dept_name,
        }));
        return;
      }
    }

    // Special handling for leave type to determine if the leave is paid
    if (name === "leave_type") {
      let isPaid = true;

      // Unpaid leave is not paid by default
      if (value === "Unpaid") {
        isPaid = false;
      }

      setFormData(prev => ({
        ...prev,
        [name]: value,
        is_paid: isPaid
      }));
      return;
    }

    // Normal handling for other fields
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Calculate total days between start and end date with safe checks
  const calculateTotalDays = () => {
    if (!formData.start_date || !formData.end_date) return 0;

    try {
      const start = new Date(formData.start_date);
      const end = new Date(formData.end_date);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return 0;
      }

      // Reset time part to avoid time zone issues
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);

      // Calculate the difference in milliseconds
      const differenceMs = end - start;

      // Convert to days and add 1 to include both start and end date
      return Math.floor(differenceMs / (1000 * 60 * 60 * 24)) + 1;
    } catch (err) {
      console.error("Error calculating days:", err);
      return 0;
    }
  };

  // Add a validation function for leave balances
  const validateLeaveRequest = () => {
    const totalDays = calculateTotalDays();
    
    if (!leaveBalances) {
      // If we can't fetch leave balances, we'll let the server validate
      return { valid: true };
    }
    
    const leaveType = formData.leave_type;
    
    // Validate based on leave type
    switch (leaveType) {
      case "Sick":
        if (totalDays > leaveBalances.sick_leave_remaining) {
          return {
            valid: false,
            message: `Insufficient sick leave balance. Remaining: ${leaveBalances.sick_leave_remaining} days`
          };
        }
        break;
        
      case "Vacation":
        if (totalDays > leaveBalances.vacation_leave_remaining) {
          return {
            valid: false,
            message: `Insufficient vacation leave balance. Remaining: ${leaveBalances.vacation_leave_remaining} days`
          };
        }
        break;
        
      case "Maternity":
        if (totalDays > 105) {
          return {
            valid: false,
            message: "Maternity leave cannot exceed 105 days"
          };
        }
        if (totalDays > leaveBalances.maternity_leave_remaining) {
          return {
            valid: false,
            message: `Insufficient maternity leave balance. Remaining: ${leaveBalances.maternity_leave_remaining} days`
          };
        }
        break;
        
      case "Paternity":
        if (totalDays > 7) {
          return {
            valid: false,
            message: "Paternity leave cannot exceed 7 days"
          };
        }
        if (totalDays > leaveBalances.paternity_leave_remaining) {
          return {
            valid: false,
            message: `Insufficient paternity leave balance. Remaining: ${leaveBalances.paternity_leave_remaining} days`
          };
        }
        break;
        
      case "Solo Parent":
        if (totalDays > 7) {
          return {
            valid: false,
            message: "Solo parent leave cannot exceed 7 days per year"
          };
        }
        if (totalDays > leaveBalances.solo_parent_leave_remaining) {
          return {
            valid: false,
            message: `Insufficient solo parent leave balance. Remaining: ${leaveBalances.solo_parent_leave_remaining} days`
          };
        }
        break;
        
      // For other leave types (e.g., Unpaid, Emergency), no specific validation
      default:
        break;
    }
    
    return { valid: true };
  };

  // Form submission with enhanced error handling for database validation errors
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!formData.employee_id || !formData.dept_id || !formData.leave_type ||
      !formData.start_date || !formData.end_date || !formData.reason) {
      showToast("Please fill all required fields", false);
      return;
    }

    // Validate dates
    const startDate = new Date(formData.start_date);
    const endDate = new Date(formData.end_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time portion for fair comparison

    if (endDate < startDate) {
      showToast("End date must be after start date", false);
      return;
    }
    
    // Client-side validation for leave balances
    const validation = validateLeaveRequest();
    if (!validation.valid) {
      showToast(validation.message, false);
      return;
    }

    try {
      setLoading(true);

      // Submit to API
      const payload = {
        employee_id: formData.employee_id,
        leave_type: formData.leave_type,
        start_date: formData.start_date,
        end_date: formData.end_date,
        is_paid: formData.is_paid,
        reason: formData.reason
      };

      // Use the actual API request
      await axios.post(
        "https://1wj5891jxg.execute-api.ap-southeast-1.amazonaws.com/dev/api/employee_leave_requests/leave_requests/",
        payload
      );

      showToast("Leave request submitted successfully", true);
      setSubmitted(true);

      // Reset form
      setFormData({
        employee_id: "",
        employee_name: "",
        dept_id: "",
        dept_name: "",
        leave_type: "",
        start_date: "",
        end_date: "",
        is_paid: true,
        reason: "",
      });

    } catch (err) {
      console.error("Error submitting leave request:", err);
      
      // Enhanced error handling to extract specific validation messages
      let errorMessage = "Failed to submit leave request";
      
      // Extract the specific error message from the response
      if (err.response) {
        // Check if it's a validation error with detail field
        if (err.response.data?.detail) {
          errorMessage = err.response.data.detail;
          
          // Look for specific database validation error patterns
          if (typeof errorMessage === 'string') {
            // Extract balance-related error messages
            if (errorMessage.includes('Insufficient') || 
                errorMessage.includes('leave cannot exceed') ||
                errorMessage.includes('leave balance')) {
              // This is likely a validation error from the DB trigger
              errorMessage = errorMessage.replace(/.*?Failed to create leave request: /g, '');
              errorMessage = errorMessage.replace(/.*?IntegrityError: /g, '');
              errorMessage = errorMessage.replace(/.*?DETAIL: /g, '');
            }
          }
        } 
        // Check if there are field-specific errors
        else if (err.response.data) {
          const errorFields = Object.keys(err.response.data);
          if (errorFields.length > 0) {
            const messages = [];
            errorFields.forEach(field => {
              if (Array.isArray(err.response.data[field])) {
                messages.push(`${field}: ${err.response.data[field].join(', ')}`);
              } else if (typeof err.response.data[field] === 'string') {
                messages.push(`${field}: ${err.response.data[field]}`);
              }
            });
            if (messages.length > 0) {
              errorMessage = messages.join('; ');
            }
          }
        }
      }
      
      showToast(errorMessage, false);
    } finally {
      setLoading(false);
    }
  };

  // Get total days
  const totalDays = calculateTotalDays();

  // Enhanced error handling for the entire component
  if (renderError) {
    return (
      <div className="leave-req" style={{ padding: "20px", textAlign: "center" }}>
        <h2>Error Loading Leave Request</h2>
        <p>{errorMessage || "There was an error loading the Leave Request form."}</p>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: "10px 15px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginTop: "15px"
          }}
        >
          Reload Page
        </button>
      </div>
    );
  }

  // Wrap the return statement in try-catch to handle rendering errors
  try {
    return (
      <div className="leave-req">
        <div className="body-content-container">
          <div className="leave-req-scrollable">
            <div className="leave-req-heading">
              <h2><strong>Leave Request Form</strong></h2>
            </div>

            {submitted ? (
              <div className="leave-req-success-container">
                <h3>Leave Request Submitted</h3>
                <p>Your leave request has been submitted successfully.</p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="leave-req-new-button"
                >
                  Submit Another Request
                </button>
              </div>
            ) : (
              <div className="leave-req-form-container">
                <form onSubmit={handleSubmit} className="leave-req-form">
                  <div className="leave-req-form-columns">
                    <div className="leave-req-form-column">
                      <div className="leave-req-form-group">
                        <label>Employee ID *</label>
                        {fetchingEmployees ? (
                          <div className="leave-req-loading-dropdown">Loading employees...</div>
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

                      <div className="leave-req-form-group">
                        <label>Employee Name *</label>
                        {fetchingEmployees ? (
                          <div className="leave-req-loading-dropdown">Loading employees...</div>
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

                      <div className="leave-req-form-group">
                        <label>Department ID *</label>
                        {fetchingDepartments ? (
                          <div className="leave-req-loading-dropdown">Loading departments...</div>
                        ) : (
                          <select
                            name="dept_id"
                            value={formData.dept_id}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="">-- Select Department --</option>
                            {departments.map(dept => (
                              <option key={dept.dept_id} value={dept.dept_id}>
                                {dept.dept_id} - {dept.dept_name}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>

                      <div className="leave-req-form-group">
                        <label>Department Name</label>
                        <input
                          type="text"
                          name="dept_name"
                          value={formData.dept_name}
                          readOnly
                        />
                      </div>
                    </div>

                    <div className="leave-req-form-column">
                      <div className="leave-req-form-group">
                        <label>Leave Type *</label>
                        <select
                          name="leave_type"
                          value={formData.leave_type}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">-- Select Leave Type --</option>
                          <option value="Sick">Sick</option>
                          <option value="Vacation">Vacation</option>
                          <option value="Emergency">Emergency</option>
                          <option value="Maternity">Maternity</option>
                          <option value="Paternity">Paternity</option>
                          <option value="Solo Parent">Solo Parent</option>
                          <option value="Unpaid">Unpaid</option>
                        </select>
                      </div>

                      <div className="leave-req-form-row">
                        <div className="leave-req-form-group">
                          <label>Start Date *</label>
                          <input
                            type="date"
                            name="start_date"
                            value={formData.start_date}
                            onChange={handleInputChange}
                            required
                            min={new Date().toISOString().split('T')[0]} // Set minimum date to today
                            className="leave-req-date-picker"
                            onClick={(e) => {
                              // Ensure click is focused on this input
                              e.currentTarget.showPicker();
                            }}
                          />
                          <small className="leave-req-helper-text">Cannot be in the past</small>
                        </div>

                        <div className="leave-req-form-group">
                          <label>End Date *</label>
                          <input
                            type="date"
                            name="end_date"
                            value={formData.end_date}
                            onChange={handleInputChange}
                            required
                            min={formData.start_date || new Date().toISOString().split('T')[0]} // Set minimum to start date or today
                            className="leave-req-date-picker"
                            disabled={!formData.start_date} // Disable until start date is selected
                            onClick={(e) => {
                              // Ensure click is focused on this input
                              if (!e.currentTarget.disabled) {
                                e.currentTarget.showPicker();
                              }
                            }}
                          />
                          <small className="leave-req-helper-text">Must be after start date</small>
                        </div>
                      </div>

                      {totalDays !== null && (
                        <div className="leave-req-days-display">
                          <span>Total Days: </span>
                          <strong>{totalDays}</strong>
                          
                          {formData.leave_type && leaveBalances && (
                            <div className="leave-req-balance-info">
                              {formData.leave_type === "Sick" && (
                                <small>Available Sick Leave: {leaveBalances.sick_leave_remaining} days</small>
                              )}
                              {formData.leave_type === "Vacation" && (
                                <small>Available Vacation Leave: {leaveBalances.vacation_leave_remaining} days</small>
                              )}
                              {formData.leave_type === "Maternity" && (
                                <small>Available Maternity Leave: {leaveBalances.maternity_leave_remaining} days (max 105)</small>
                              )}
                              {formData.leave_type === "Paternity" && (
                                <small>Available Paternity Leave: {leaveBalances.paternity_leave_remaining} days (max 7)</small>
                              )}
                              {formData.leave_type === "Solo Parent" && (
                                <small>Available Solo Parent Leave: {leaveBalances.solo_parent_leave_remaining} days (max 7)</small>
                              )}
                            </div>
                          )}
                          
                          {fetchingLeaveBalances && (
                            <div className="leave-req-loading-balance">Loading leave balances...</div>
                          )}
                        </div>
                      )}

                      <div className="leave-req-form-group">
                        <label>Is Paid Leave</label>
                        <div className="leave-req-checkbox-wrapper">
                          <input
                            type="checkbox"
                            name="is_paid"
                            checked={formData.is_paid}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              is_paid: e.target.checked
                            }))}
                            disabled={formData.leave_type === "Unpaid"}
                          />
                          <span className="leave-req-checkbox-label">
                            {formData.is_paid ? "Yes" : "No"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="leave-req-form-group full-width">
                    <label>Reason for Leave *</label>
                    <textarea
                      name="reason"
                      value={formData.reason}
                      onChange={handleInputChange}
                      rows="5"
                      required
                      placeholder="Please provide the reason for your leave request"
                    />
                  </div>

                  <div className="leave-req-form-buttons">
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({
                          employee_id: "",
                          employee_name: "",
                          dept_id: "",
                          dept_name: "",
                          leave_type: "",
                          start_date: "",
                          end_date: "",
                          is_paid: true,
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
            className={`leave-req-toast ${!toast.success ? 'error' : ''}`}
            style={{ backgroundColor: toast.success ? "#4CAF50" : "#F44336" }}
          >
            {toast.message}
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error("Error rendering Leave Request form:", error);
    // Update the error state so we can show the error UI on the next render
    setRenderError(true);
    setErrorMessage(error.message || "Unknown rendering error");

    return (
      <div className="leave-req" style={{ padding: "20px", textAlign: "center" }}>
        <h2>Rendering Error</h2>
        <p>There was an error rendering the Leave Request form.</p>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: "10px 15px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginTop: "15px"
          }}
        >
          Reload Page
        </button>
      </div>
    );
  }
};

export default LeaveRequest;