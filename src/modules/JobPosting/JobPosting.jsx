import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiSearch } from "react-icons/fi";
import "./styles/JobPostingReqs.css";

const JobPostingReqs = () => {
  // Data states
  const [postings, setPostings] = useState([]);
  const [archivedPostings, setArchivedPostings] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);

  // UI States
  const [showArchived, setShowArchived] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sortField, setSortField] = useState("all");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState("form");

  // Modal states
  const [newPosting, setNewPosting] = useState({
    dept_id: "",
    position_id: "",
    description: "",
    requirements: "",
    base_salary: null,
    daily_rate: null,
    status: "Draft",
    employment_type: "Regular",
    duration_days: null
  });

  // Toast helper
  const showToast = (message, success = true) => {
    setToast({ message, success });
    setTimeout(() => setToast(null), 3000);
  };

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postingsRes, archivedRes, deptsRes, posRes] = await Promise.all([
          axios.get("http://127.0.0.1:8000///api/job_posting/job_postings/"),
          axios.get("http://127.0.0.1:8000///api/job_posting/job_postings/archived/"),
          axios.get("http://127.0.0.1:8000///api/departments/department/"),
          axios.get("http://127.0.0.1:8000///api/positions/positions/")
        ]);

        setPostings(postingsRes.data);
        setArchivedPostings(archivedRes.data);
        setDepartments(deptsRes.data);
        setPositions(posRes.data);
      } catch (err) {
        console.error("Fetch error:", err);
        showToast("Failed to fetch data", false);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Form handlers
  const handleAddPosting = async (e) => {
    e.preventDefault();
    
    try {
      // Validate required fields
      if (!newPosting.dept_id || !newPosting.position_id || 
          !newPosting.description || !newPosting.requirements) {
        showToast("Please fill all required fields", false);
        return;
      }

      // Add validation for base salary and daily rate
      if (newPosting.employment_type === "Regular" && 
          (newPosting.base_salary === null || 
           newPosting.base_salary === '' || 
           isNaN(parseFloat(newPosting.base_salary)) ||
           parseFloat(newPosting.base_salary) <= 0)) {
        showToast("Base salary is required for Regular positions", false);
        return;
      }

      if (newPosting.employment_type !== "Regular" && 
          (newPosting.daily_rate === null || 
           newPosting.daily_rate === '' || 
           isNaN(parseFloat(newPosting.daily_rate)) ||
           parseFloat(newPosting.daily_rate) <= 0)) {
        showToast("Daily rate is required and must be greater than zero for non-Regular positions", false);
        return;
      }

      // Validate duration_days for non-Regular employment types
      if (newPosting.employment_type !== "Regular") {
        if (!newPosting.duration_days) {
          showToast("Duration days is required for non-Regular positions", false);
          return;
        }
        
        if (newPosting.employment_type === "Seasonal" && 
            (newPosting.duration_days < 1 || newPosting.duration_days > 29)) {
          showToast("Seasonal positions require duration between 1 and 29 days", false);
          return;
        }
        
        if (newPosting.employment_type === "Contractual" && 
            (newPosting.duration_days < 30 || newPosting.duration_days > 180)) {
          showToast("Contractual positions require duration between 30 and 180 days", false);
          return;
        }
      }
      
      // Format data based on employment type
      const selectedPosition = positions.find(p => p.position_id === newPosting.position_id);
      const isRegular = newPosting.employment_type === "Regular"; // Use the form's employment type instead
      
      const jobPostingData = {
        ...newPosting,
        position_title: selectedPosition?.position_title || "",
        base_salary: newPosting.employment_type === "Regular" ? 
          (parseFloat(newPosting.base_salary) || 0) : 0,
        daily_rate: !isRegular ? (parseFloat(newPosting.daily_rate) || 0) : 0, 
        duration_days: !isRegular ? parseInt(newPosting.duration_days) : null
      };
      
      console.log("Form state before submission:", {
        employment_type: newPosting.employment_type,
        base_salary: newPosting.base_salary, // Check if truly null
        daily_rate: newPosting.daily_rate,
        formattedData: jobPostingData
      });
      
      console.log("About to submit with:", {
        employmentType: newPosting.employment_type,
        baseSalary: newPosting.base_salary,
        dailyRate: newPosting.daily_rate,
        durationDays: newPosting.duration_days,
        formattedData: jobPostingData
      });
      
      // Send to API
      const response = await axios.post(
        "http://127.0.0.1:8000///api/job_posting/job_postings/", 
        jobPostingData
      );
      
      // Show success message
      showToast("Job posting created successfully", true);
      
      // Reset form
      handleCancel();
      
      // Refresh data
      const postingsRes = await axios.get("http://127.0.0.1:8000///api/job_posting/job_postings/");
      setPostings(postingsRes.data);
      
    } catch (err) {
      console.error("Error creating job posting:", err.response?.data || err);
      const errorMessage = err.response?.data?.detail || 
                          Object.values(err.response?.data || {}).flat().join(", ") || 
                          "Failed to create job posting";
      showToast(errorMessage, false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // If changing position, check employment type
    if (name === "position_id") {
      const selectedPosition = positions.find(p => p.position_id === value);
      const isRegular = selectedPosition?.employment_type === "Regular";

      setNewPosting(prev => ({
        ...prev,
        [name]: value,
        employment_type: selectedPosition?.employment_type || "Regular",
        base_salary: isRegular ? (prev.base_salary || '') : null,
        daily_rate: !isRegular ? 0 : null
      }));
    } 
    // If changing employment type, update salary fields
    else if (name === "employment_type") {
      const isRegular = value === "Regular";
      setNewPosting(prev => ({
        ...prev,
        [name]: value,
        base_salary: isRegular ? (prev.base_salary || '') : null,
        daily_rate: !isRegular ? '' : null, // Change from 0 to '' (empty string)
        duration_days: !isRegular ? (value === "Seasonal" ? 1 : 30) : null
      }));
    }
    else {
      setNewPosting(prev => ({
        ...prev,
        [name]: value
      }));
    }
    console.log("Current base salary:", newPosting.base_salary, typeof newPosting.base_salary);
  };

  const handleCancel = () => {
    setNewPosting({
      dept_id: "",
      position_id: "",
      description: "",
      requirements: "",
      base_salary: null,
      daily_rate: null,
      status: "Draft",
      employment_type: "Regular",
      duration_days: null
    });
  };

  const renderJobPostingsTable = (data, isArchived = false) => {
    if (loading) return <div className="hr-no-results">Loading job postings...</div>;
    if (!data.length) return <div className="hr-no-results">No job postings found.</div>;

    return (
      <div className="jp-table-wrapper">
        <div className="jp-table-scrollable">
          <table className="jp-table">
            <thead>
              <tr>
                <th>Posting ID</th>
                <th>Department</th>
                <th>Position</th>
                <th>Description</th>
                <th>Requirements</th>
                <th>Base Salary</th>
                <th>Daily Rate</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((posting, index) => (
                <tr key={posting.id}>
                  <td>{posting.id}</td>
                  <td>{posting.dept_name}</td>
                  <td>{posting.position_title}</td>
                  <td>{posting.description}</td>
                  <td>{posting.requirements}</td>
                  <td>{posting.base_salary}</td>
                  <td>{posting.daily_rate}</td>
                  <td>
                    <span className={`hr-tag ${posting.status.toLowerCase()}`}>
                      {posting.status}
                    </span>
                  </td>
                  <td className="hr-department-actions">
                    {/* Add action buttons here */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="jp-container">
      <div className="jp-content-container">
        <div className="jp-scrollable">
          <div className="jp-heading">
            <h2><strong>Job Posting Requests</strong></h2>
          </div>

          <div className="job-posting-header">
            <div className="job-posting-tabs">
              <button
                className={activeTab === "form" ? "active" : ""}
                onClick={() => setActiveTab("form")}
              >
                Job Posting Form
              </button>
              {/* <button
                className={activeTab === "list" ? "active" : ""}
                onClick={() => setActiveTab("list")}
              >
                Job Posting List
              </button> */}
            </div>
          </div>

          {activeTab === "form" ? (
            <div className="jp-form-container">
              <form onSubmit={handleAddPosting} className="jp-form">
                {/* First Column */}
                <div>
                  <div className="jp-form-group">
                    <label>Department</label>
                    <select
                      name="dept_id"
                      value={newPosting.dept_id}
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
                  </div>

                  <div className="jp-form-group">
                    <label>Position</label>
                    <select
                      name="position_id"
                      value={newPosting.position_id}
                      onChange={handleChange}
                      required
                    >
                      <option value="">-- Select Position --</option>
                      {positions.map(pos => (
                        <option key={pos.position_id} value={pos.position_id}>
                          {pos.position_title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="jp-form-group">
                    <label>Status</label>
                    <select
                      name="status"
                      value={newPosting.status}
                      onChange={handleChange}
                      required
                    >
                      <option value="Draft">Draft</option>
                      <option value="Published">Published</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                </div>

                {/* Second Column */}
                <div>
                  <div className="jp-form-group">
                    <label>Employment Type</label>
                    <select
                      name="employment_type"
                      value={newPosting.employment_type}
                      onChange={handleChange}
                      required
                    >
                      <option value="Regular">Regular</option>
                      <option value="Contractual">Contractual</option>
                      <option value="Seasonal">Seasonal</option>
                    </select>
                  </div>

                  <div className="jp-form-group">
                    <label>Base Salary</label>
                    <input
                      type="number"
                      name="base_salary"
                      value={newPosting.base_salary === null ? '' : newPosting.base_salary}
                      onChange={(e) => {
                        const value = e.target.value;
                        const numValue = value === '' ? null : parseFloat(value);
                        console.log("Setting base salary to:", numValue);
                        setNewPosting(prev => ({
                          ...prev,
                          base_salary: numValue
                        }));
                      }}
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div className="jp-form-group">
                    <label>Daily Rate</label>
                    <input
                      type="number"
                      name="daily_rate"
                      value={newPosting.daily_rate === null ? '' : newPosting.daily_rate}
                      onChange={(e) => {
                        const value = e.target.value;
                        const numValue = value === '' ? null : parseFloat(value);
                        if (numValue <= 0 && newPosting.employment_type !== "Regular") {
                          // Don't accept zero or negative values for non-regular positions
                          return;
                        }
                        setNewPosting(prev => ({
                          ...prev,
                          daily_rate: numValue
                        }));
                      }}
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                {/* Third Column */}
                <div>
                  <div className="jp-form-group">
                    <label>Duration (Days)</label>
                    <input
                      type="number"
                      name="duration_days"
                      value={newPosting.duration_days || ''}
                      onChange={handleChange}
                      min={newPosting.employment_type === "Seasonal" ? 1 : 30}
                      max={newPosting.employment_type === "Seasonal" ? 29 : 180}
                      disabled={newPosting.employment_type === "Regular"}
                      required={newPosting.employment_type !== "Regular"}
                    />
                    {newPosting.employment_type === "Seasonal" && 
                      <small>Must be between 1-29 days</small>
                    }
                    {newPosting.employment_type === "Contractual" && 
                      <small>Must be between 30-180 days</small>
                    }
                  </div>
                </div>

                {/* Requirements - spans all columns */}
                <div className="jp-form-group requirements">
                  <label>Requirements</label>
                  <textarea
                    name="requirements"
                    value={newPosting.requirements}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Description - spans all columns */}
                <div className="jp-form-group description">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={newPosting.description}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Buttons - spans all columns */}
                <div className="jp-form-buttons">
                  <button type="button" onClick={handleCancel} className="cancel-btn">
                    Cancel
                  </button>
                  <button type="submit" className="submit-btn">
                    Save
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="job-posting-list-container">
              <div className="job-posting-controls">
                <div className="job-posting-search-wrapper">
                  <FiSearch className="job-posting-search-icon" />
                  <input
                    type="text"
                    className="job-posting-search"
                    placeholder="Search..."
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </div>
                <select
                  className="job-posting-filter"
                  value={sortField}
                  onChange={(e) => setSortField(e.target.value)}
                >
                  <option value="all">No Sorting</option>
                  <option value="id">Sort by ID</option>
                  <option value="status">Sort by Status</option>
                </select>
              </div>
              {renderJobPostingsTable(showArchived ? archivedPostings : postings)}
            </div>
          )}
        </div>
      </div>

      {toast && (
        <div
          className="job-posting-toast"
          style={{ backgroundColor: toast.success ? "#4CAF50" : "#F44336" }}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default JobPostingReqs;