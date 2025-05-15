import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiSearch } from "react-icons/fi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./styles/WorkforceRequest.css";

const WorkforceRequest = () => {
  const [activeTab, setActiveTab] = useState("form");
  // States for form data - simplified with only the necessary fields
  const [formData, setFormData] = useState({
    requesting_dept_id: "",
    current_dept_id: "",
    required_skills: "",
    task_description: "",
    start_date: "",
    end_date: "",
    // Hidden fields with default values
    hr_approver: "",
    employee_id: "",
    status: "Draft",
    approval_status: "Pending",
    rejection_reason: ""
  });

  // States for form validation
  const [formErrors, setFormErrors] = useState({});

  // States for list view and shared functionality 
  const [requests, setRequests] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sortField, setSortField] = useState("all");
  const [toast, setToast] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Toast notification helper
  const showToast = (message, success = true) => {
    setToast({ message, success });
    setTimeout(() => setToast(null), 3000);
  };

  // Fetch departments, employees, and requests
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get("https://1wj5891jxg.execute-api.ap-southeast-1.amazonaws.com/dev/api/departments/department/");
        setDepartments(response.data.filter(dept => !dept.is_archived));
      } catch (err) {
        console.error("Error fetching departments:", err);
        showToast("Failed to load departments", false);
      }
    };

    const fetchRequests = async () => {
      try {
        const response = await axios.get("https://1wj5891jxg.execute-api.ap-southeast-1.amazonaws.com/dev/api/workforce_allocation/workforce_allocations/");
        setRequests(response.data);
      } catch (err) {
        console.error("Error fetching requests:", err);
        showToast("Failed to load requests", false);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
    fetchRequests();
  }, []);

  // Form handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle date changes specifically
  const handleDateChange = (date, name) => {
    // Format date to YYYY-MM-DD for backend compatibility
    const formattedDate = date ? date.toISOString().split('T')[0] : "";
    
    setFormData(prev => ({
      ...prev,
      [name]: formattedDate
    }));
  };

  const validateForm = () => {
    const errors = {};
    
    // Enhanced date validation
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Reset time portion for accurate comparison
    
    if (!formData.start_date) {
      errors.start_date = "Start date is required";
    } else {
      const startDate = new Date(formData.start_date);
      // Check if start date is not in the past
      if (startDate < currentDate) {
        errors.start_date = "Start date cannot be in the past";
      }
    }
    
    if (!formData.end_date) {
      errors.end_date = "End date is required";
    } else if (formData.start_date) {
      const startDate = new Date(formData.start_date);
      const endDate = new Date(formData.end_date);
      
      // Check if end date is after start date
      if (endDate < startDate) {
        errors.end_date = "End date must be after start date";
      }
      
      // Check if duration is reasonable (max 1 year)
      const oneYear = 365 * 24 * 60 * 60 * 1000; // milliseconds in a year
      if (endDate - startDate > oneYear) {
        errors.end_date = "Maximum allocation duration is 1 year";
      }
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setSubmitting(false);
      return;
    }
    
    try {
      await axios.post("https://1wj5891jxg.execute-api.ap-southeast-1.amazonaws.com/dev/api/workforce_allocation/workforce_allocations/", formData);
      showToast("Request submitted successfully");
      setFormData({
        requesting_dept_id: "",
        current_dept_id: "",
        required_skills: "",
        task_description: "",
        start_date: "",
        end_date: "",
        // Keep default values for hidden fields
        hr_approver: "",
        employee_id: "",
        status: "Draft",
        approval_status: "Pending",
        rejection_reason: ""
      });
    } catch (err) {
      console.error("Submit error:", err);
      
      // Improved error handling
      if (err.response) {
        if (err.response.data) {
          console.error("Error details:", err.response.data);
          // Set form errors from API response
          setFormErrors(err.response.data || {});
          
          // Show toast with meaningful error message
          if (err.response.data.detail) {
            showToast(err.response.data.detail, false);
          } else if (err.response.data.non_field_errors) {
            showToast(err.response.data.non_field_errors[0], false);
          } else {
            showToast("Failed to submit request. Please check the form for errors.", false);
          }
        } else {
          showToast("Failed to submit request", false);
        }
      } else {
        showToast(`Failed to submit request: ${err.message}`, false);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      requesting_dept_id: "",
      current_dept_id: "",
      required_skills: "",
      task_description: "",
      start_date: "",
      end_date: "",
      // Keep default values for hidden fields
      hr_approver: "",
      employee_id: "",
      status: "Draft",
      approval_status: "Pending",
      rejection_reason: ""
    });
  };

  // List filtering and pagination
  const filterAndPaginate = (data) => {
    const filtered = data.filter(item => 
      Object.values(item).some(val => 
        val?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    if (sortField !== "all") {
      filtered.sort((a, b) => {
        const valA = a[sortField]?.toString().toLowerCase() || "";
        const valB = b[sortField]?.toString().toLowerCase() || "";
        return valA.localeCompare(valB);
      });
    }

    const start = (currentPage - 1) * itemsPerPage;
    const paginated = filtered.slice(start, start + itemsPerPage);
    const totalPages = Math.ceil(filtered.length / itemsPerPage);

    return { paginated, totalPages };
  };

  // Render request list
  const renderRequestList = () => {
    if (loading) return <div className="request-no-results">Loading requests...</div>;

    const { paginated, totalPages } = filterAndPaginate(requests);
    if (!paginated.length) return <div className="request-no-results">No requests found.</div>;

    return (
      <>
        <div className="request-table-wrapper">
          <div className="request-table-scrollable">
            <table className="request-table">
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Department</th>
                  <th>Required Skills</th>
                  <th>Task Description</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map(request => (
                  <tr key={request.request_id}>
                    <td>{request.request_id}</td>
                    <td>{request.requesting_dept_id}</td>
                    <td>{request.required_skills}</td>
                    <td>{request.task_description}</td>
                    <td>{request.start_date}</td>
                    <td>{request.end_date}</td>
                    <td>
                      <span className={`hr-tag ${request.status?.toLowerCase()}`}>
                        {request.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="request-pagination">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={i + 1 === currentPage ? "active" : ""}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <select
            className="request-pagination-size"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(parseInt(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>
      </>
    );
  };

  return (
    <div className="request-workforce-request">
      <div className="request-workforce-request-body-content-container">
        <div className="request-workforce-request-scrollable">
          <div className="request-workforce-request-heading">
            <h2><strong>Workforce Request</strong></h2>
          </div>

          <div className="request-workforce-request-header">
            <div className="request-workforce-request-tabs">
              <button
                className={activeTab === "form" ? "active" : ""}
                onClick={() => setActiveTab("form")}
              >
                Workforce Request Form
              </button>
            </div>
          </div>

          {activeTab === "form" ? (
            <div className="request-workforce-request-form-container">
              <form onSubmit={handleSubmit} className="request-workforce-request-form">
                <div className="left-column">
                  <div className="form-group">
                    <label>Requesting Department</label>
                    <select
                      name="requesting_dept_id"
                      value={formData.requesting_dept_id}
                      onChange={handleChange}
                      required
                    >
                      <option value="">-- Select Department --</option>
                      {departments.map(dept => (
                        <option key={dept.dept_id} value={dept.dept_id}>
                          {dept.dept_name}
                        </option>
                      ))}
                    </select>
                    {formErrors.requesting_dept_id && <div className="form-error">{formErrors.requesting_dept_id}</div>}
                  </div>
                  
                  <div className="form-group">
                    <label>Current Department</label>
                    <select
                      name="current_dept_id"
                      value={formData.current_dept_id}
                      onChange={handleChange}
                      required
                    >
                      <option value="">-- Select Department --</option>
                      {departments.map(dept => (
                        <option key={dept.dept_id} value={dept.dept_id}>
                          {dept.dept_name}
                        </option>
                      ))}
                    </select>
                    {formErrors.current_dept_id && <div className="form-error">{formErrors.current_dept_id}</div>}
                  </div>
                </div>

                <div className="right-column">
                  <div className="form-group">
                    <label>Start Date</label>
                    <DatePicker
                      selected={formData.start_date ? new Date(formData.start_date) : null}
                      onChange={(date) => handleDateChange(date, "start_date")}
                      dateFormat="yyyy-MM-dd"
                      minDate={new Date()} // Can't select dates in the past
                      placeholderText="Select start date"
                      className="date-picker-input"
                      required
                    />
                    {formErrors.start_date && <div className="form-error">{formErrors.start_date}</div>}
                  </div>

                  <div className="form-group">
                    <label>End Date</label>
                    <DatePicker
                      selected={formData.end_date ? new Date(formData.end_date) : null}
                      onChange={(date) => handleDateChange(date, "end_date")}
                      dateFormat="yyyy-MM-dd"
                      minDate={formData.start_date ? new Date(formData.start_date) : new Date()} // Can't select dates before start date
                      placeholderText="Select end date"
                      className="date-picker-input"
                      required
                    />
                    {formErrors.end_date && <div className="form-error">{formErrors.end_date}</div>}
                  </div>
                </div>

                <div className="form-group full-width">
                  <label>Required Skills</label>
                  <textarea
                    name="required_skills"
                    value={formData.required_skills}
                    onChange={handleChange}
                    required
                  />
                  {formErrors.required_skills && <div className="form-error">{formErrors.required_skills}</div>}
                </div>
                
                <div className="form-group full-width">
                  <label>Task Description</label>
                  <textarea
                    name="task_description"
                    value={formData.task_description}
                    onChange={handleChange}
                    required
                  />
                  {formErrors.task_description && <div className="form-error">{formErrors.task_description}</div>}
                </div>

                <div className="form-group full-width">
                  {formErrors.non_field_errors && (
                    <div className="form-error">{formErrors.non_field_errors}</div>
                  )}
                </div>

                <div className="request-workforce-request-form-buttons">
                  <button type="button" onClick={handleCancel} className="cancel-btn">
                    Cancel
                  </button>
                  <button type="submit" className="submit-btn" disabled={submitting}>
                    {submitting ? "Submitting..." : "Save"}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="request-workforce-request-list-container">
              <div className="request-workforce-request-controls">
                <div className="request-workforce-request-search-wrapper">
                  <FiSearch className="request-workforce-request-search-icon" />
                  <input
                    type="text"
                    className="request-workforce-request-search"
                    placeholder="Search..."
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </div>
                <select
                  className="request-workforce-request-filter"
                  value={sortField}
                  onChange={(e) => setSortField(e.target.value)}
                >
                  <option value="all">No Sorting</option>
                  <option value="request_id">Sort by Request ID</option>
                  <option value="requesting_dept_id">Sort by Department</option>
                  <option value="start_date">Sort by Start Date</option>
                </select>
              </div>
              {renderRequestList()}
            </div>
          )}
        </div>
      </div>

      {toast && (
        <div
          className="request-workforce-request-toast"
          style={{ backgroundColor: toast.success ? "#4CAF50" : "#F44336" }}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default WorkforceRequest;