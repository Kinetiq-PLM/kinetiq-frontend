import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiSearch } from "react-icons/fi";
import "../styles/Recruitment.css";

const Recruitment = () => {
  // Data states for each section
  const [candidates, setCandidates] = useState([]);
  const [archivedCandidates, setArchivedCandidates] = useState([]);
  const [jobPostings, setJobPostings] = useState([]);
  const [archivedJobPostings, setArchivedJobPostings] = useState([]);
  const [resignations, setResignations] = useState([]);
  
  // New states for departments and positions
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);

  // UI States
  const [activeTab, setActiveTab] = useState("Candidates");
  const [showArchived, setShowArchived] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sortField, setSortField] = useState("all");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [dotsMenuOpen, setDotsMenuOpen] = useState(null);
  const [showAddJobModal, setShowAddJobModal] = useState(false);
  const [newJobPosting, setNewJobPosting] = useState({
    dept_id: "",
    position_id: "",
    description: "",
    requirements: "",
    base_salary: null,
    daily_rate: null,
    posting_status: "Draft"
  });
  const [showEditJobModal, setShowEditJobModal] = useState(false);
  const [editingJobPosting, setEditingJobPosting] = useState(null);

  // Show toast message
  const showToast = (message, success = true) => {
    setToast({ message, success });
    setTimeout(() => setToast(null), 3000);
  };

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch candidates and job postings
        const [candidatesRes, archivedCandidatesRes] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/candidates/candidates/"),
          axios.get("http://127.0.0.1:8000/api/candidates/candidates/archived/")
        ]);

        const [jobPostingsRes, archivedJobPostingsRes] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/job_posting/job_postings/"),
          axios.get("http://127.0.0.1:8000/api/job_posting/job_postings/archived/")
        ]);

        const resignationsRes = await axios.get("http://127.0.0.1:8000/api/resignation/resignations/");
        
        // Fetch departments and positions for dropdowns
        const [departmentsRes, positionsRes] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/departments/"),
          axios.get("http://127.0.0.1:8000/api/positions/")
        ]);

        setCandidates(candidatesRes.data);
        setArchivedCandidates(archivedCandidatesRes.data);
        setJobPostings(jobPostingsRes.data);
        setArchivedJobPostings(archivedJobPostingsRes.data);
        setResignations(resignationsRes.data);
        setDepartments(departmentsRes.data);
        setPositions(positionsRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        showToast("Failed to fetch data", false);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Utility functions
  const filterAndPaginate = (data) => {
    if (!data || !Array.isArray(data)) {
      return { paginated: [], totalPages: 0 };
    }
  
    const term = (searchTerm || '').toLowerCase();
    
    const filtered = data.filter(item => {
      if (!item) return false;
      return Object.values(item).some(val => {
        if (val == null) return false;
        try {
          return val.toString().toLowerCase().includes(term);
        } catch (err) {
          return false;
        }
      });
    });
  
    // The existing filterAndPaginate function logic handles sorting well
    if (sortField !== "all") {
      filtered.sort((a, b) => {
        if (!a || !b) return 0;
        
        // Get values to compare
        const valA = a[sortField];
        const valB = b[sortField];
        
        // Handle null/undefined values
        if (valA == null && valB == null) return 0;
        if (valA == null) return 1;
        if (valB == null) return -1;
        
        // Handle dates (check if field might contain date values)
        if (sortField.includes('date') || sortField.includes('created_at') || sortField.includes('updated_at')) {
          return new Date(valA) - new Date(valB);
        }
        
        // Handle numeric values (IDs or numbers)
        if (sortField.includes('id') || !isNaN(valA)) {
          return Number(valA) - Number(valB);
        }
        
        // Default: case-insensitive string comparison
        return valA.toString().toLowerCase().localeCompare(valB.toString().toLowerCase());
      });
    }
  
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginated = filtered.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  
    return { paginated, totalPages };
  };

  // Handle form input changes
  const handleJobPostingChange = (e) => {
    const { name, value, type } = e.target;
    
    // Log selected department for debugging
    if (name === "dept_id") {
      console.log("Selected department:", value);
      console.log("Available departments:", departments);
    }
    
    // Handle base_salary and daily_rate mutual exclusivity
    if (name === "base_salary" && value) {
      setNewJobPosting((prev) => ({
        ...prev,
        [name]: value,
        daily_rate: null
      }));
    } else if (name === "daily_rate" && value) {
      setNewJobPosting((prev) => ({
        ...prev,
        [name]: value,
        base_salary: null
      }));
    } else {
      setNewJobPosting((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle form submission
  const handleAddJobPosting = async (e) => {
    e.preventDefault();
    try {
      // Add validation logic as needed
      if (!newJobPosting.dept_id || !newJobPosting.description || 
          !newJobPosting.requirements || (!newJobPosting.base_salary && !newJobPosting.daily_rate)) {
        showToast("Please fill in all required fields", false);
        return;
      }

      // API call to add job posting
      await axios.post("http://127.0.0.1:8000/api/job_posting/job_postings/", newJobPosting);
      
      setShowAddJobModal(false);
      showToast("Job posting added successfully");
      
      // Refresh job postings data
      const jobPostingsRes = await axios.get("http://127.0.0.1:8000/api/job_posting/job_postings/");
      setJobPostings(jobPostingsRes.data);
    } catch (err) {
      console.error("Add job posting error:", err);
      showToast("Failed to add job posting", false);
    }
  };

  const handleEditJobPosting = async (e) => {
    e.preventDefault();
    try {
      if (!editingJobPosting.dept_id || !editingJobPosting.description || 
          !editingJobPosting.requirements || (!editingJobPosting.base_salary && !editingJobPosting.daily_rate)) {
        showToast("Please fill in all required fields", false);
        return;
      }

      await axios.patch(`http://127.0.0.1:8000/api/job_posting/job_postings/${editingJobPosting.job_id}/`, editingJobPosting);
      
      setShowEditJobModal(false);
      showToast("Job posting updated successfully");
      
      // Refresh job postings data
      const jobPostingsRes = await axios.get("http://127.0.0.1:8000/api/job_posting/job_postings/");
      setJobPostings(jobPostingsRes.data);
    } catch (err) {
      console.error("Edit job posting error:", err);
      showToast("Failed to update job posting", false);
    }
  };

  const handleArchiveJobPosting = async (jobId) => {
    try {
      await axios.post(`http://127.0.0.1:8000/api/job_posting/job_postings/${jobId}/archive/`);
      showToast("Job posting archived successfully");
      
      // Refresh job postings data
      const [jobPostingsRes, archivedJobPostingsRes] = await Promise.all([
        axios.get("http://127.0.0.1:8000/api/job_posting/job_postings/"),
        axios.get("http://127.0.0.1:8000/api/job_posting/job_postings/archived/")
      ]);
      
      setJobPostings(jobPostingsRes.data);
      setArchivedJobPostings(archivedJobPostingsRes.data);
    } catch (err) {
      console.error("Archive job posting error:", err);
      showToast("Failed to archive job posting", false);
    }
  };

  const handleUnarchiveJobPosting = async (jobId) => {
    try {
      await axios.post(`http://127.0.0.1:8000/api/job_posting/job_postings/${jobId}/unarchive/`);
      showToast("Job posting unarchived successfully");
      
      // Refresh job postings data
      const [jobPostingsRes, archivedJobPostingsRes] = await Promise.all([
        axios.get("http://127.0.0.1:8000/api/job_posting/job_postings/"),
        axios.get("http://127.0.0.1:8000/api/job_posting/job_postings/archived/")
      ]);
      
      setJobPostings(jobPostingsRes.data);
      setArchivedJobPostings(archivedJobPostingsRes.data);
    } catch (err) {
      console.error("Unarchive job posting error:", err);
      showToast("Failed to unarchive job posting", false);
    }
  };

  // Helper function for duration class
  const getDurationClass = (days) => {
    if (!days) return "unknown";
    if (days <= 30) return "short-duration";
    if (days <= 90) return "medium-duration";
    return "long-duration";
  };

  // Helper function for finance approval class
  const getFinanceApprovalClass = (status) => {
    if (!status) return "pending-finance";
    if (status.toLowerCase().includes("approved")) return "approved-finance";
    if (status.toLowerCase().includes("rejected")) return "rejected-finance";
    return "pending-finance";
  };

  // Add a helper function for clearance status
  const getClearanceStatusClass = (status) => {
    if (!status) return "pending-clearance";
    if (status.toLowerCase().includes("cleared")) return "cleared";
    if (status.toLowerCase().includes("rejected")) return "rejected-clearance";
    return "pending-clearance";
  };

  // Render functions for each table
  const renderJobPostingsTable = (data, isArchived = false) => {
    const { paginated, totalPages } = filterAndPaginate(data);
    
    if (loading) return <div className="recruitment-no-results">Loading job postings...</div>;
    if (!paginated.length) return <div className="recruitment-no-results">No job postings found.</div>;

    return (
      <>
        <div className="recruitment-table-wrapper">
          <div className="recruitment-table-scrollable">
            <table className="recruitment-table">
              <thead>
                <tr>
                  {isArchived && <th>Select</th>}
                  <th>Job ID</th>
                  <th>Department</th>
                  <th>Position</th>
                  <th>Description</th>
                  <th>Requirements</th>
                  <th>Employment Type</th>
                  <th>Base Salary</th>
                  <th>Daily Rate</th>
                  <th>Duration (Days)</th>
                  <th>Finance Approval</th>
                  <th>Posting Status</th>
                  <th>Created At</th>
                  <th>Updated At</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((posting, index) => (
                  <tr key={posting.job_id} className={isArchived ? "recruitment-archived-row" : ""}>
                    {isArchived && (
                      <td>
                        <input type="checkbox" />
                      </td>
                    )}
                    <td>{posting.job_id}</td>
                    <td>{posting.dept_id}</td>
                    <td>{posting.position_title}</td>
                    <td>{posting.description}</td>
                    <td>{posting.requirements}</td>
                    <td>
                      <span className={`recruitment-tag ${posting.employment_type ? posting.employment_type.toLowerCase() : 'unknown'}`}>
                        {posting.employment_type || 'Unknown'}
                      </span>
                    </td>
                    <td>{posting.base_salary}</td>
                    <td>{posting.daily_rate}</td>
                    <td>
                      {posting.duration_days ? (
                        <span className={`recruitment-tag ${getDurationClass(posting.duration_days)}`}>
                          {posting.duration_days} days
                        </span>
                      ) : "—"}
                    </td>
                    <td>
                      <span className={`recruitment-tag ${getFinanceApprovalClass(posting.finance_approval_status)}`}>
                        {posting.finance_approval_status || 'Pending'}
                      </span>
                    </td>
                    <td>
                      <span className={`recruitment-tag ${posting.status ? posting.status.toLowerCase() : 'unknown'}`}>
                        {posting.status || 'Unknown'}
                      </span>
                    </td>
                    <td>{posting.created_at}</td>
                    <td>{posting.updated_at}</td>
                    <td className="recruitment-actions">
                      <div
                        className="recruitment-dots"
                        onClick={() => setDotsMenuOpen(dotsMenuOpen === index ? null : index)}
                      >
                        ⋮
                        {dotsMenuOpen === index && (
                          <div className="recruitment-dropdown">
                            <div 
                              className="recruitment-dropdown-item" 
                              onClick={() => {
                                setEditingJobPosting(posting);
                                setShowEditJobModal(true);
                                setDotsMenuOpen(null);
                              }}
                            >
                              Edit
                            </div>
                            <div 
                              className="recruitment-dropdown-item"
                              onClick={() => {
                                if (isArchived) {
                                  handleUnarchiveJobPosting(posting.job_id);
                                } else {
                                  handleArchiveJobPosting(posting.job_id);
                                }
                                setDotsMenuOpen(null);
                              }}
                            >
                              {isArchived ? "Restore" : "Archive"}
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {renderPagination(totalPages)}
      </>
    );
  };

  const renderCandidatesTable = (data, isArchived = false) => {
    const { paginated, totalPages } = filterAndPaginate(data);
    if (loading) return <div className="recruitment-no-results">Loading candidates...</div>;
    if (!paginated.length) return <div className="recruitment-no-results">No candidates found.</div>;
    return (
      <>
        <div className="recruitment-table-wrapper">
          <div className="recruitment-table-scrollable">
            <table className="recruitment-table">
              <thead>
                <tr>
                  {isArchived && <th>Select</th>}
                  <th>ID</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Applied Position</th>
                  <th>Applied Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((candidate, index) => (
                  <tr key={candidate.id} className={isArchived ? "recruitment-archived-row" : ""}>
                    {isArchived && (
                      <td>
                        <input type="checkbox" />
                      </td>
                    )}
                    <td>{candidate.id}</td>
                    <td>{candidate.first_name}</td>
                    <td>{candidate.last_name}</td>
                    <td>{candidate.email}</td>
                    <td>{candidate.phone}</td>
                    <td>
                      <span className={`recruitment-tag ${candidate.status ? candidate.status.toLowerCase() : 'unknown'}`}>
                        {candidate.status || 'Unknown'}
                      </span>
                    </td>
                    <td>{candidate.applied_position}</td>
                    <td>{candidate.applied_date}</td>
                    <td className="recruitment-actions">
                      <div
                        className="recruitment-dots"
                        onClick={() => setDotsMenuOpen(dotsMenuOpen === index ? null : index)}
                      >
                        ⋮
                        {dotsMenuOpen === index && (
                          <div className="recruitment-dropdown">
                            <div className="recruitment-dropdown-item">Edit</div>
                            <div className="recruitment-dropdown-item">Archive</div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {renderPagination(totalPages)}
      </>
    );
  };

  const renderResignationsTable = (data) => {
    const { paginated, totalPages } = filterAndPaginate(data);
    if (loading) return <div className="recruitment-no-results">Loading resignations...</div>;
    if (!paginated.length) return <div className="recruitment-no-results">No resignations found.</div>;
    return (
      <>
        <div className="recruitment-table-wrapper">
          <div className="recruitment-table-scrollable">
            <table className="recruitment-table">
              <thead>
                <tr>
                  <th>Resignation ID</th>
                  <th>Employee ID</th>
                  <th>Submission Date</th>
                  <th>Notice Period (Days)</th>
                  <th>HR Approver</th>
                  <th>Approval Status</th>
                  <th>Clearance Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((resignation, index) => (
                  <tr key={resignation.resignation_id}>
                    <td>{resignation.resignation_id}</td>
                    <td>{resignation.employee_id}</td>
                    <td>{resignation.submission_date ? new Date(resignation.submission_date).toLocaleDateString() : 'N/A'}</td>
                    <td>{resignation.notice_period_days || 'N/A'}</td>
                    <td>{resignation.hr_approver_id || 'Pending'}</td>
                    <td>
                      <span className={`recruitment-tag ${resignation.approval_status ? resignation.approval_status.toLowerCase() : 'unknown'}`}>
                        {resignation.approval_status || 'Unknown'}
                      </span>
                    </td>
                    <td>
                      <span className={`recruitment-tag ${getClearanceStatusClass(resignation.clearance_status)}`}>
                        {resignation.clearance_status || 'Pending'}
                      </span>
                    </td>
                    <td className="recruitment-actions">
                      <div
                        className="recruitment-dots"
                        onClick={() => setDotsMenuOpen(dotsMenuOpen === index ? null : index)}
                      >
                        ⋮
                        {dotsMenuOpen === index && (
                          <div className="recruitment-dropdown">
                            <div className="recruitment-dropdown-item">View</div>
                            <div className="recruitment-dropdown-item">Archive</div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {renderPagination(totalPages)}
      </>
    );
  };

  const renderPagination = (totalPages) => (
    <div className="recruitment-pagination">
      <div className="recruitment-pagination-numbers">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            className={i + 1 === currentPage ? "active" : ""}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
      <select
        className="recruitment-pagination-size"
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
  );

  return (
    <div className="recruitment">
      <div className="recruitment-body-content-container">
        <div className="recruitment-scrollable">
          <div className="recruitment-heading">
            <h2><strong>Recruitment</strong></h2>
            <div className="recruitment-right-controls">
              <div className="recruitment-search-wrapper">
                <FiSearch className="recruitment-search-icon" />
                <input
                  type="text"
                  className="recruitment-search"
                  placeholder="Search..."
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="recruitment-filter"
                value={sortField}
                onChange={(e) => setSortField(e.target.value)}
              >
                <option value="all">No Sorting</option>
                {activeTab === "Candidates" ? (
                  <>
                    <option value="id">Sort by ID</option>
                    <option value="first_name">Sort by First Name</option>
                    <option value="last_name">Sort by Last Name</option>
                    <option value="email">Sort by Email</option>
                    <option value="phone">Sort by Phone</option>
                    <option value="status">Sort by Status</option>
                    <option value="applied_position">Sort by Applied Position</option>
                    <option value="applied_date">Sort by Applied Date</option>
                  </>
                ) : activeTab === "Job Postings" ? (
                  <>
                    <option value="job_id">Sort by Job ID</option>
                    <option value="dept_id">Sort by Department</option>
                    <option value="position_title">Sort by Position</option>
                    <option value="description">Sort by Description</option>
                    <option value="employment_type">Sort by Employment Type</option>
                    <option value="base_salary">Sort by Base Salary</option>
                    <option value="daily_rate">Sort by Daily Rate</option>
                    <option value="status">Sort by Status</option>
                    <option value="created_at">Sort by Created Date</option>
                  </>
                ) : (
                  // Resignations tab
                  <>
                    <option value="resignation_id">Sort by Resignation ID</option>
                    <option value="employee_id">Sort by Employee ID</option>
                    <option value="submission_date">Sort by Submission Date</option>
                    <option value="notice_period_days">Sort by Notice Period</option>
                    <option value="approval_status">Sort by Approval Status</option>
                    <option value="clearance_status">Sort by Clearance Status</option>
                  </>
                )}
              </select>
              <button 
                className="recruitment-add-btn" 
                onClick={() => {
                  if (activeTab === "Job Postings") {
                    setShowAddJobModal(true);
                  }
                  // Add handling for other tabs if needed
                }}
              >
                {activeTab === "Candidates" && "+ Add Candidate"}
                {activeTab === "Job Postings" && "+ Add Job Posting"}
                {activeTab === "Resignations" && "+ Add Resignation"}
              </button>
              {/* Only show View Archived button for Candidates and Job Postings */}
              {activeTab !== "Resignations" && (
                <button
                  className="recruitment-add-btn"
                  onClick={() => setShowArchived(!showArchived)}
                >
                  {showArchived ? "View Active" : "View Archived"}
                </button>
              )}
            </div>
          </div>

          <div className="recruitment-header">
            <div className="recruitment-tabs">
              <button
                className={activeTab === "Candidates" ? "active" : ""}
                onClick={() => {
                  setActiveTab("Candidates");
                  setShowArchived(false);
                  setCurrentPage(1);
                  setSortField("all"); // Reset sort field
                }}
              >
                Candidates <span className="recruitment-count">{candidates.length}</span>
              </button>
              <button
                className={activeTab === "Job Postings" ? "active" : ""}
                onClick={() => {
                  setActiveTab("Job Postings");
                  setShowArchived(false);
                  setCurrentPage(1);
                }}
              >
                Job Postings <span className="recruitment-count">{jobPostings.length}</span>
              </button>
              <button
                className={activeTab === "Resignations" ? "active" : ""}
                onClick={() => {
                  setActiveTab("Resignations");
                  setShowArchived(false);
                  setCurrentPage(1);
                }}
              >
                Resignations <span className="recruitment-count">{resignations.length}</span>
              </button>
            </div>
          </div>

          <div className="recruitment-table-container">
            {activeTab === "Candidates" && renderCandidatesTable(showArchived ? archivedCandidates : candidates, showArchived)}
            {activeTab === "Job Postings" && renderJobPostingsTable(showArchived ? archivedJobPostings : jobPostings, showArchived)}
            {activeTab === "Resignations" && renderResignationsTable(resignations)}
          </div>
        </div>
      </div>

      {toast && (
        <div 
          className="recruitment-toast"
          style={{ backgroundColor: toast.success ? "#4CAF50" : "#F44336" }}
        >
          {toast.message}
        </div>
      )}

      {showAddJobModal && (
        <div className="recruitment-modal-overlay">
          <div className="recruitment-modal">
            <h3 style={{ marginBottom: "1rem" }}>Add New Job Posting</h3>
            <form onSubmit={handleAddJobPosting} className="recruitment-modal-form recruitment-two-col">
              {/* Left Column */}
              <div className="form-group">
                <label>Department *</label>
                <select
                  name="dept_id"
                  value={newJobPosting.dept_id}
                  onChange={handleJobPostingChange}
                  required
                >
                  <option value="">-- Select Department --</option>
                  {departments && departments.length > 0 && departments.map(dept => (
                    <option 
                      key={dept.dept_id || dept.id} 
                      value={dept.dept_id || dept.id}
                    >
                      {dept.dept_name || dept.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Position *</label>
                <select
                  name="position_id"
                  value={newJobPosting.position_id}
                  onChange={handleJobPostingChange}
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
              
              <div className="form-group">
                <label>Base Salary</label>
                <input
                  type="number"
                  name="base_salary"
                  value={newJobPosting.base_salary || ''}
                  onChange={handleJobPostingChange}
                  disabled={newJobPosting.daily_rate !== null}
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div className="form-group">
                <label>Daily Rate</label>
                <input
                  type="number"
                  name="daily_rate"
                  value={newJobPosting.daily_rate || ''}
                  onChange={handleJobPostingChange}
                  disabled={newJobPosting.base_salary !== null}
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div className="form-group">
                <label>Status *</label>
                <select
                  name="posting_status"
                  value={newJobPosting.posting_status}
                  onChange={handleJobPostingChange}
                  required
                >
                  <option value="Draft">Draft</option>
                  <option value="Open">Open</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
              
              {/* Right Column - Full width textareas */}
              <div className="form-group full-width">
                <label>Job Description *</label>
                <textarea
                  name="description"
                  value={newJobPosting.description}
                  onChange={handleJobPostingChange}
                  required
                  rows="5"
                ></textarea>
              </div>
              
              <div className="form-group full-width">
                <label>Requirements *</label>
                <textarea
                  name="requirements"
                  value={newJobPosting.requirements}
                  onChange={handleJobPostingChange}
                  required
                  rows="5"
                ></textarea>
              </div>
              
              <div className="recruitment-modal-buttons recruitment-two-col-buttons">
                <button type="submit" className="submit-btn">Add</button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowAddJobModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditJobModal && editingJobPosting && (
        <div className="recruitment-modal-overlay">
          <div className="recruitment-modal">
            <h3 style={{ marginBottom: "1rem" }}>Edit Job Posting</h3>
            <form onSubmit={handleEditJobPosting} className="recruitment-modal-form recruitment-two-col">
              {/* Left Column */}
              <div className="form-group">
                <label>Job ID</label>
                <input
                  type="text"
                  value={editingJobPosting.job_id || ''}
                  disabled
                />
              </div>
              
              <div className="form-group">
                <label>Department *</label>
                <select
                  name="dept_id"
                  value={editingJobPosting.dept_id || ''}
                  onChange={(e) => setEditingJobPosting({...editingJobPosting, dept_id: e.target.value})}
                  required
                >
                  <option value="">-- Select Department --</option>
                  {departments && departments.length > 0 && departments.map(dept => (
                    <option 
                      key={dept.dept_id || dept.id} 
                      value={dept.dept_id || dept.id}
                    >
                      {dept.dept_name || dept.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Position *</label>
                <select
                  name="position_id"
                  value={editingJobPosting.position_id || ''}
                  onChange={(e) => setEditingJobPosting({...editingJobPosting, position_id: e.target.value})}
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
              
              <div className="form-group">
                <label>Base Salary</label>
                <input
                  type="number"
                  name="base_salary"
                  value={editingJobPosting.base_salary || ''}
                  onChange={(e) => setEditingJobPosting({
                    ...editingJobPosting, 
                    base_salary: e.target.value,
                    daily_rate: null
                  })}
                  disabled={editingJobPosting.daily_rate !== null}
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div className="form-group">
                <label>Daily Rate</label>
                <input
                  type="number"
                  name="daily_rate"
                  value={editingJobPosting.daily_rate || ''}
                  onChange={(e) => setEditingJobPosting({
                    ...editingJobPosting, 
                    daily_rate: e.target.value,
                    base_salary: null
                  })}
                  disabled={editingJobPosting.base_salary !== null}
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div className="form-group">
                <label>Status *</label>
                <select
                  name="posting_status"
                  value={editingJobPosting.posting_status || 'Draft'}
                  onChange={(e) => setEditingJobPosting({...editingJobPosting, posting_status: e.target.value})}
                  required
                >
                  <option value="Draft">Draft</option>
                  <option value="Open">Open</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
              
              {/* Right Column - Full width textareas */}
              <div className="form-group full-width">
                <label>Job Description *</label>
                <textarea
                  name="description"
                  value={editingJobPosting.description || ''}
                  onChange={(e) => setEditingJobPosting({...editingJobPosting, description: e.target.value})}
                  required
                  rows="5"
                ></textarea>
              </div>
              
              <div className="form-group full-width">
                <label>Requirements *</label>
                <textarea
                  name="requirements"
                  value={editingJobPosting.requirements || ''}
                  onChange={(e) => setEditingJobPosting({...editingJobPosting, requirements: e.target.value})}
                  required
                  rows="5"
                ></textarea>
              </div>
              
              <div className="recruitment-modal-buttons recruitment-two-col-buttons">
                <button type="submit" className="submit-btn">Save Changes</button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowEditJobModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recruitment;
