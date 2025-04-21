import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiSearch } from "react-icons/fi";
import "../styles/JobPostingReqs.css";

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
    status: "Draft"
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
          axios.get("https://x0crs910m2.execute-api.ap-southeast-1.amazonaws.com/dev/api/job_postings/"),
          axios.get("https://x0crs910m2.execute-api.ap-southeast-1.amazonaws.com/dev/api/job_postings/archived/"),
          axios.get("https://x0crs910m2.execute-api.ap-southeast-1.amazonaws.com/dev/api/departments/"),
          axios.get("https://x0crs910m2.execute-api.ap-southeast-1.amazonaws.com/dev/api/positions/")
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
  const handleAddPosting = (e) => {
    e.preventDefault();
    // Add form submission logic here
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
        base_salary: isRegular ? 0 : null,
        daily_rate: !isRegular ? 0 : null
      }));
    } else {
      setNewPosting(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleCancel = () => {
    setNewPosting({
      dept_id: "",
      position_id: "",
      description: "",
      requirements: "",
      base_salary: null,
      daily_rate: null,
      status: "Draft"
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
              <button
                className={activeTab === "list" ? "active" : ""}
                onClick={() => setActiveTab("list")}
              >
                Job Posting List
              </button>
            </div>
          </div>

          {activeTab === "form" ? (
            <div className="jp-form-container">
              <form onSubmit={handleAddPosting} className="jp-form">
                {/* Left Column */}
                <div className="jp-form-left-column">
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

                  <div className="jp-form-group">
                    <label>Base Salary</label>
                    <input
                      type="number"
                      name="base_salary"
                      value={newPosting.base_salary || ''}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div className="jp-form-group">
                    <label>Daily Rate</label>
                    <input
                      type="number"
                      name="daily_rate"
                      value={newPosting.daily_rate || ''}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="jp-form-right-column">
                  <div className="jp-form-group requirements">
                    <label>Requirements</label>
                    <textarea
                      name="requirements"
                      value={newPosting.requirements}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="jp-form-group description">
                    <label>Description</label>
                    <textarea
                      name="description"
                      value={newPosting.description}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="jp-form-buttons">
                    <button type="button" onClick={handleCancel} className="cancel-btn">
                      Cancel
                    </button>
                    <button type="submit" className="submit-btn">
                      Save
                    </button>
                  </div>
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