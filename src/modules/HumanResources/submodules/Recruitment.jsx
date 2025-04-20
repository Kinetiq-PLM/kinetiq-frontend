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
  
  // Modal visibility states
  const [showAddJobModal, setShowAddJobModal] = useState(false);
  const [showAddResignationModal, setShowAddResignationModal] = useState(false); // New state for resignation modal
  const [showEditResignationModal, setShowEditResignationModal] = useState(false); // New state for editing resignation
  
  // Reference data
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [employees, setEmployees] = useState([]); // New state for employees list
  
  // Form data states
  const [newJobPosting, setNewJobPosting] = useState({
    dept_id: "",
    position_id: "",
    position_title: "",
    description: "",
    requirements: "",
    employment_type: "Regular",
    base_salary: "",
    daily_rate: "",
    duration_days: "",
    posting_status: "Draft"
  });
  
  // New state for resignation form data
  const [newResignation, setNewResignation] = useState({
    employee_id: "",
    notice_period_days: 30,
    hr_approver_id: "",
    approval_status: "Pending",
    clearance_status: "Pending"
  });
  
  // State for editing a resignation
  const [editingResignation, setEditingResignation] = useState(null);

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
  const [showEditJobModal, setShowEditJobModal] = useState(false);
  const [editingJobPosting, setEditingJobPosting] = useState(null);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Existing fetch calls
        const [candidatesRes, archivedCandidatesRes] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/candidates/candidates/"),
          axios.get("http://127.0.0.1:8000/api/candidates/candidates/archived/")
        ]);
  
        console.log('Candidates data:', candidatesRes.data);
        if (candidatesRes.data && candidatesRes.data.length > 0) {
          console.log('Sample candidate:', candidatesRes.data[0]);
        }
  
        // Add this debugging code
        console.log('CANDIDATE DATA STRUCTURE:');
        if (candidatesRes.data && candidatesRes.data.length > 0) {
          const sampleCandidate = candidatesRes.data[0];
          console.log('Sample candidate object keys:', Object.keys(sampleCandidate));
          console.log('Full sample candidate:', sampleCandidate);
        }
  
        const [jobPostingsRes, archivedJobPostingsRes] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/job_posting/job_postings/"),
          axios.get("http://127.0.0.1:8000/api/job_posting/job_postings/archived/")
        ]);
  
        const resignationsRes = await axios.get("http://127.0.0.1:8000/api/resignation/resignations/");
  
        // New fetch calls for departments, positions, and employees
        const [deptsRes, positionsRes, employeesRes] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/departments/department/"),
          axios.get("http://127.0.0.1:8000/api/positions/positions/"),
          axios.get("http://127.0.0.1:8000/api/employees/") // Add this line to fetch employees
        ]);
  
        // Add this debugging to see what's coming back
        console.log('Departments data:', deptsRes.data);
        console.log('Positions data:', positionsRes.data);
        console.log('Employees data:', employeesRes.data);
  
        // Ensure we're working with arrays
        const departmentsData = ensureArray(deptsRes.data);
        const positionsData = ensureArray(positionsRes.data);
        const employeesData = ensureArray(employeesRes.data);
        
        setCandidates(candidatesRes.data);
        setArchivedCandidates(archivedCandidatesRes.data);
        setJobPostings(jobPostingsRes.data);
        setArchivedJobPostings(archivedJobPostingsRes.data);
        setResignations(resignationsRes.data);
        setDepartments(departmentsData);
        setPositions(positionsData);
        setEmployees(employeesData);
      } catch (err) {
        console.error("Error fetching data:", err);
        showToast("Failed to fetch data", false);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  
  // Add this helper function near the top of your component
  const ensureArray = (data) => {
    if (Array.isArray(data)) {
      return data;
    } else if (data && typeof data === 'object') {
      // If it's an object, it might be a response with results property
      if (data.results && Array.isArray(data.results)) {
        return data.results;
      }
      // Or it might be an object where values are what we want
      return Object.values(data);
    }
    // Default to empty array
    return [];
  };
  
  // Also add a showToast function if it doesn't exist yet
  const showToast = (message, success = true) => {
    setToast({ message, success });
    setTimeout(() => setToast(null), 3000);
  };

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
  
    if (sortField !== "all") {
      filtered.sort((a, b) => {
        if (!a || !b) return 0;
        const valA = a[sortField] != null ? a[sortField].toString().toLowerCase() : '';
        const valB = b[sortField] != null ? b[sortField].toString().toLowerCase() : '';
        return valA.localeCompare(valB);
      });
    }
  
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginated = filtered.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  
    return { paginated, totalPages };
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
                      <span className={`recruitment-tag ${posting.employment_type?.toLowerCase() || 'unknown'}`}>
                        {posting.employment_type || 'Unknown'}
                      </span>
                    </td>
                    <td>{posting.base_salary}</td>
                    <td>{posting.daily_rate}</td>
                    <td>{posting.duration_days}</td>
                    <td>
                      <span className={`recruitment-tag ${posting.finance_approval_status ? 
                        `${posting.finance_approval_status.toLowerCase()}-finance` : 'pending-finance'}`}>
                        {posting.finance_approval_status || 'Pending'}
                      </span>
                    </td>
                    <td>
                      <span className={`recruitment-tag ${posting.posting_status ? 
                        posting.posting_status.toLowerCase() : 'unknown'}`}>
                        {posting.posting_status || 'Unknown'}
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
                              onClick={() => handleEditJobPosting(posting)}
                            >
                              Edit
                            </div>
                            <div 
                              className="recruitment-dropdown-item"
                              onClick={() => isArchived ? handleRestoreJobPosting(posting) : handleArchiveJobPosting(posting)}
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
                  <th>Candidate ID</th>
                  <th>Job ID</th>
                  <th>Position</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Application Status</th>
                  <th>Created At</th>
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
                    <td>{candidate.candidate_id || candidate.id}</td>
                    <td>{candidate.job?.job_id || candidate.job_posting_id || candidate.job_id || candidate.jobId || candidate.posting_id || candidate.jobPostingId || "-"}</td>
                    <td>{candidate.position_title || candidate.applied_position}</td>
                    <td>{candidate.first_name}</td>
                    <td>{candidate.last_name}</td>
                    <td>{candidate.email}</td>
                    <td>{candidate.phone}</td>
                    <td>
                      <span className={`recruitment-tag ${
                        candidate.application_status 
                          ? candidate.application_status.toLowerCase().replace(/\s+/g, '-')
                          : candidate.status
                            ? candidate.status.toLowerCase().replace(/\s+/g, '-')
                            : 'unknown'
                      }`}>
                        {candidate.application_status || candidate.status || 'Unknown'}
                      </span>
                    </td>
                    <td>{candidate.created_at}</td>
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
                      <span className={`recruitment-tag ${resignation.clearance_status ? resignation.clearance_status.toLowerCase() : 'unknown'}`}>
                        {resignation.clearance_status || 'Unknown'}
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
                            <div 
                              className="recruitment-dropdown-item"
                              onClick={() => handleEditResignation(resignation)}
                            >
                              Edit
                            </div>
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
      <button 
        className="recruitment-pagination-arrow" 
        onClick={() => setCurrentPage(1)} 
        disabled={currentPage === 1}
      >
        &#171; {/* Double left arrow */}
      </button>
      
      <button 
        className="recruitment-pagination-arrow" 
        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
        disabled={currentPage === 1}
      >
        &#8249; {/* Single left arrow */}
      </button>
      
      <div className="recruitment-pagination-numbers">
        {(() => {
          const pageNumbers = [];
          const maxVisiblePages = 5;
          
          if (totalPages <= maxVisiblePages + 2) {
            // Show all pages if there are few
            for (let i = 1; i <= totalPages; i++) {
              pageNumbers.push(
                <button
                  key={i}
                  className={i === currentPage ? "active" : ""}
                  onClick={() => setCurrentPage(i)}
                >
                  {i}
                </button>
              );
            }
          } else {
            // Always show first page
            pageNumbers.push(
              <button
                key={1}
                className={1 === currentPage ? "active" : ""}
                onClick={() => setCurrentPage(1)}
              >
                1
              </button>
            );
            
            // Calculate range around current page
            let startPage = Math.max(2, currentPage - Math.floor(maxVisiblePages / 2));
            let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);
            
            // Adjust if we're near the end
            if (endPage - startPage < maxVisiblePages - 1) {
              startPage = Math.max(2, endPage - maxVisiblePages + 1);
            }
            
            // Add ellipsis after first page if needed
            if (startPage > 2) {
              pageNumbers.push(<span key="ellipsis1" className="recruitment-pagination-ellipsis">...</span>);
            }
            
            // Add middle pages
            for (let i = startPage; i <= endPage; i++) {
              pageNumbers.push(
                <button
                  key={i}
                  className={i === currentPage ? "active" : ""}
                  onClick={() => setCurrentPage(i)}
                >
                  {i}
                </button>
              );
            }
            
            // Add ellipsis before last page if needed
            if (endPage < totalPages - 1) {
              pageNumbers.push(<span key="ellipsis2" className="recruitment-pagination-ellipsis">...</span>);
            }
            
            // Always show last page
            pageNumbers.push(
              <button
                key={totalPages}
                className={totalPages === currentPage ? "active" : ""}
                onClick={() => setCurrentPage(totalPages)}
              >
                {totalPages}
              </button>
            );
          }
          
          return pageNumbers;
        })()}
      </div>
      
      <button 
        className="recruitment-pagination-arrow" 
        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
        disabled={currentPage === totalPages}
      >
        &#8250; {/* Single right arrow */}
      </button>
      
      <button 
        className="recruitment-pagination-arrow" 
        onClick={() => setCurrentPage(totalPages)} 
        disabled={currentPage === totalPages}
      >
        &#187; {/* Double right arrow */}
      </button>
      
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

  // Job Posting handling functions
  const handleEditJobPosting = (posting) => {
    // Create a copy of the posting to edit
    setEditingJobPosting({
      ...posting,
      // Ensure fields are properly set for editing
      base_salary: posting.base_salary || "",
      daily_rate: posting.daily_rate || "",
      duration_days: posting.duration_days || ""
    });
    setShowEditJobModal(true);
    setDotsMenuOpen(null);
  };

  // New function to handle editing a resignation
  const handleEditResignation = (resignation) => {
    setEditingResignation({
      ...resignation,
      // Make sure we have all fields properly set
      notice_period_days: resignation.notice_period_days || 30,
      hr_approver_id: resignation.hr_approver_id || "",
      approval_status: resignation.approval_status || "Pending",
      clearance_status: resignation.clearance_status || "Pending"
    });
    setShowEditResignationModal(true);
    setDotsMenuOpen(null);
  };

  const handleAddClick = () => {
    if (activeTab === "Job Postings") {
      setNewJobPosting({
        dept_id: "",
        position_id: "",
        position_title: "",
        description: "",
        requirements: "",
        employment_type: "Regular",
        base_salary: "",
        daily_rate: "",
        duration_days: "",
        posting_status: "Draft"
      });
      setShowAddJobModal(true);
    } 
    else if (activeTab === "Resignations") {
      // Initialize new resignation form data
      setNewResignation({
        employee_id: "",
        notice_period_days: 30,
        hr_approver_id: "",
        approval_status: "Pending",
        clearance_status: "Pending"
      });
      setShowAddResignationModal(true);
    }
    // Add handlers for other tabs when needed
  };

  // Handle resignation form input changes
  const handleResignationChange = (e) => {
    const { name, value, type } = e.target;
    
    // Handle numeric inputs differently
    if (type === "number") {
      const numValue = value === "" ? "" : parseInt(value);
      setNewResignation(prev => ({
        ...prev,
        [name]: numValue
      }));
    } else {
      setNewResignation(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle resignation form submission
  const handleResignationSubmit = async (e) => {
    e.preventDefault();
    
    // Create a copy of the data to send to the API
    const resignationData = { ...newResignation };
    
    try {
      // Validate required fields
      if (!resignationData.employee_id || !resignationData.notice_period_days) {
        showToast("Please fill all required fields", false);
        return;
      }
      
      // Validate notice period days (must be a positive number)
      if (resignationData.notice_period_days <= 0) {
        showToast("Notice period days must be positive", false);
        return;
      }
      
      console.log("Sending resignation data:", resignationData);
      
      const response = await axios.post(
        "http://127.0.0.1:8000/api/resignation/resignations/", 
        resignationData
      );
      
      showToast("Resignation submitted successfully", true);
      setShowAddResignationModal(false);
      
      // Refresh resignations
      const resignationsRes = await axios.get("http://127.0.0.1:8000/api/resignation/resignations/");
      setResignations(resignationsRes.data);
    } catch (err) {
      console.error("Error creating resignation:", err.response?.data || err);
      const errorMessage = err.response?.data?.detail || 
                         Object.values(err.response?.data || {}).flat().join(", ") || 
                         "Failed to create resignation";
      showToast(errorMessage, false);
    }
  };

  // Handle editing resignation form changes
  const handleEditResignationChange = (e) => {
    const { name, value, type } = e.target;
    
    // Handle numeric inputs differently
    if (type === "number") {
      const numValue = value === "" ? "" : parseInt(value);
      setEditingResignation(prev => ({
        ...prev,
        [name]: numValue
      }));
    } else {
      setEditingResignation(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle editing resignation form submission
  const handleEditResignationSubmit = async (e) => {
    e.preventDefault();
    
    // Create a copy of the data to send to the API
    const resignationData = { ...editingResignation };
    
    try {
      // Validate required fields for update
      if (!resignationData.approval_status || !resignationData.clearance_status) {
        showToast("Please fill all required fields", false);
        return;
      }
      
      // For updating resignations, we only need the approval status and clearance status
      // according to the ResignationUpdateSerializer
      const updateData = {
        approval_status: resignationData.approval_status,
        clearance_status: resignationData.clearance_status
      };
      
      console.log("Sending resignation update data:", updateData);
      
      await axios.patch(
        `http://127.0.0.1:8000/api/resignation/resignations/${resignationData.resignation_id}/`, 
        updateData
      );
      
      showToast("Resignation updated successfully", true);
      setShowEditResignationModal(false);
      
      // Refresh resignations
      const resignationsRes = await axios.get("http://127.0.0.1:8000/api/resignation/resignations/");
      setResignations(resignationsRes.data);
    } catch (err) {
      console.error("Error updating resignation:", err.response?.data || err);
      const errorMessage = err.response?.data?.detail || 
                         Object.values(err.response?.data || {}).flat().join(", ") || 
                         "Failed to update resignation";
      showToast(errorMessage, false);
    }
  };

  const handleJobPostingChange = (e) => {
    const { name, value, type } = e.target;
    
    // If changing position, update position_title automatically
    if (name === "position_id") {
      const selectedPosition = positions.find(p => p.position_id === value);
      setNewJobPosting(prev => ({
        ...prev,
        [name]: value,
        position_title: selectedPosition?.position_title || ""
      }));
    } 
    // Handle employment type changes with proper field handling
    else if (name === "employment_type") {
      if (value === "Regular") {
        setNewJobPosting(prev => ({
          ...prev,
          employment_type: value,
          base_salary: prev.base_salary || "", // Keep existing value or use empty string
          daily_rate: null, // Explicitly set to null for Regular
          duration_days: null  // Set duration_days to null for Regular employees
        }));
      } else if (value === "Contractual") {
        setNewJobPosting(prev => ({
          ...prev,
          employment_type: value,
          base_salary: null, // Explicitly set to null for Contractual
          daily_rate: prev.daily_rate || "", // Keep existing value or use empty string
          duration_days: prev.duration_days || 30 // Set default to minimum valid value
        }));
      } else if (value === "Seasonal") {
        setNewJobPosting(prev => ({
          ...prev,
          employment_type: value,
          base_salary: null, // Explicitly set to null for Seasonal
          daily_rate: prev.daily_rate || "", // Keep existing value or use empty string
          duration_days: prev.duration_days || 1 // Set default to minimum valid value
        }));
      }
    }
    // Handle numeric inputs
    else if (type === "number") {
      const numValue = value === "" ? "" : 
                      (name === "duration_days" ? parseInt(value) : parseFloat(value));
      setNewJobPosting(prev => ({
        ...prev,
        [name]: numValue
      }));
    }
    // Handle all other inputs
    else {
      setNewJobPosting(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleEditJobPostingSubmit = async (e) => {
    e.preventDefault();
    
    // Create a copy of the data to send to the API
    const jobPostingData = { ...editingJobPosting };
    
    try {
      // Validate required fields
      if (!jobPostingData.dept_id || !jobPostingData.position_id || 
          !jobPostingData.description || !jobPostingData.requirements) {
        showToast("Please fill all required fields", false);
        return;
      }
      
      // Apply the same formatting and validation as in the create function
      if (jobPostingData.employment_type === "Regular") {
        if (!jobPostingData.base_salary) {
          showToast("Base salary is required for Regular positions", false);
          return;
        }
        jobPostingData.daily_rate = 0;
        jobPostingData.duration_days = null;
        jobPostingData.base_salary = parseFloat(jobPostingData.base_salary);
      } else if (jobPostingData.employment_type === "Contractual") {
        if (!jobPostingData.daily_rate) {
          showToast("Daily rate is required for Contractual positions", false);
          return;
        }
        if (!jobPostingData.duration_days || 
            jobPostingData.duration_days < 30 || 
            jobPostingData.duration_days > 180) {
          showToast("Contractual positions require duration between 30 and 180 days", false);
          return;
        }
        jobPostingData.base_salary = 0;
        jobPostingData.daily_rate = parseFloat(jobPostingData.daily_rate);
      } else if (jobPostingData.employment_type === "Seasonal") {
        if (!jobPostingData.daily_rate) {
          showToast("Daily rate is required for Seasonal positions", false);
          return;
        }
        if (!jobPostingData.duration_days || 
            jobPostingData.duration_days < 1 || 
            jobPostingData.duration_days > 29) {
          showToast("Seasonal positions require duration between 1 and 29 days", false);
          return;
        }
        jobPostingData.base_salary = 0;
        jobPostingData.daily_rate = parseFloat(jobPostingData.daily_rate);
      }
      
      // Convert duration_days to a number if it exists and not null
      if (jobPostingData.duration_days !== null) {
        jobPostingData.duration_days = parseInt(jobPostingData.duration_days);
      }
      
      await axios.patch(
        `http://127.0.0.1:8000/api/job_posting/job_postings/${editingJobPosting.job_id}/`, 
        jobPostingData
      );
      
      showToast("Job posting updated successfully", true);
      setShowEditJobModal(false);
      
      // Refresh job postings
      const jobPostingsRes = await axios.get("http://127.0.0.1:8000/api/job_posting/job_postings/");
      setJobPostings(jobPostingsRes.data);
    } catch (err) {
      console.error("Error updating job posting:", err.response?.data || err);
      const errorMessage = err.response?.data?.detail || 
                        Object.values(err.response?.data || {}).flat().join(", ") || 
                        "Failed to update job posting";
      showToast(errorMessage, false);
    }
  };

  const handleEditJobPostingChange = (e) => {
    const { name, value, type } = e.target;
    
    // If changing position, update position_title automatically
    if (name === "position_id") {
      const selectedPosition = positions.find(p => p.position_id === value);
      setEditingJobPosting(prev => ({
        ...prev,
        [name]: value,
        position_title: selectedPosition?.position_title || ""
      }));
    } 
    // Handle employment type changes with proper field handling
    else if (name === "employment_type") {
      if (value === "Regular") {
        setEditingJobPosting(prev => ({
          ...prev,
          employment_type: value,
          base_salary: prev.base_salary || "", 
          daily_rate: null,
          duration_days: null
        }));
      } else if (value === "Contractual") {
        setEditingJobPosting(prev => ({
          ...prev,
          employment_type: value,
          base_salary: null,
          daily_rate: prev.daily_rate || "", 
          duration_days: prev.duration_days || 30
        }));
      } else if (value === "Seasonal") {
        setEditingJobPosting(prev => ({
          ...prev,
          employment_type: value,
          base_salary: null,
          daily_rate: prev.daily_rate || "",
          duration_days: prev.duration_days || 1
        }));
      }
    }
    // Handle numeric inputs
    else if (type === "number") {
      const numValue = value === "" ? "" : 
                     (name === "duration_days" ? parseInt(value) : parseFloat(value));
      setEditingJobPosting(prev => ({
        ...prev,
        [name]: numValue
      }));
    }
    // Handle all other inputs
    else {
      setEditingJobPosting(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleJobPostingSubmit = async (e) => {
    e.preventDefault();
    
    // Create a copy of the data to send to the API
    const jobPostingData = { ...newJobPosting };
    
    try {
      // Validate required fields
      if (!jobPostingData.dept_id || !jobPostingData.position_id || 
          !jobPostingData.description || !jobPostingData.requirements) {
        showToast("Please fill all required fields", false);
        return;
      }
      
      // Apply proper formatting and validation based on employment type
      if (jobPostingData.employment_type === "Regular") {
        if (!jobPostingData.base_salary) {
          showToast("Base salary is required for Regular positions", false);
          return;
        }
        // For Regular positions, set daily_rate to null explicitly and duration_days to null
        jobPostingData.daily_rate = 0;
        jobPostingData.duration_days = null;
        
        // Ensure base_salary is a number
        jobPostingData.base_salary = parseFloat(jobPostingData.base_salary);
      } else if (jobPostingData.employment_type === "Contractual") {
        // For Contractual positions
        if (!jobPostingData.daily_rate) {
          showToast("Daily rate is required for Contractual positions", false);
          return;
        }
        
        // Validate duration days for Contractual (30-180 days)
        if (!jobPostingData.duration_days || 
            jobPostingData.duration_days < 30 || 
            jobPostingData.duration_days > 180) {
          showToast("Contractual positions require duration between 30 and 180 days", false);
          return;
        }
        
        // Set base_salary to null explicitly
        jobPostingData.base_salary = 0;
        
        // Ensure daily_rate is a number
        jobPostingData.daily_rate = parseFloat(jobPostingData.daily_rate);
      } else if (jobPostingData.employment_type === "Seasonal") {
        // For Seasonal positions
        if (!jobPostingData.daily_rate) {
          showToast("Daily rate is required for Seasonal positions", false);
          return;
        }
        
        // Validate duration days for Seasonal (1-29 days)
        if (!jobPostingData.duration_days || 
            jobPostingData.duration_days < 1 || 
            jobPostingData.duration_days > 29) {
          showToast("Seasonal positions require duration between 1 and 29 days", false);
          return;
        }
        
        // Set base_salary to null explicitly
        jobPostingData.base_salary = 0;
        
        // Ensure daily_rate is a number
        jobPostingData.daily_rate = parseFloat(jobPostingData.daily_rate);
      }
      
      // Convert duration_days to a number if it exists and not null
      if (jobPostingData.duration_days !== null) {
        jobPostingData.duration_days = parseInt(jobPostingData.duration_days);
      }
      
      console.log("Sending job posting data:", jobPostingData);
      
      const response = await axios.post(
        "http://127.0.0.1:8000/api/job_posting/job_postings/", 
        jobPostingData
      );
      
      showToast("Job posting created successfully", true);
      setShowAddJobModal(false);
      
      // Refresh job postings
      const jobPostingsRes = await axios.get("http://127.0.0.1:8000/api/job_posting/job_postings/");
      setJobPostings(jobPostingsRes.data);
    } catch (err) {
      console.error("Error creating job posting:", err.response?.data || err);
      const errorMessage = err.response?.data?.detail || 
                         Object.values(err.response?.data || {}).flat().join(", ") || 
                         "Failed to create job posting";
      showToast(errorMessage, false);
    }
  };

  const handleArchiveJobPosting = async (jobPosting) => {
    try {
      console.log("Job posting to archive:", jobPosting);
      
      // Create a properly formatted update data object
      const updateData = {
        is_archived: true,
        employment_type: jobPosting.employment_type || "Seasonal", // Provide fallback
        dept_id: jobPosting.dept_id,
        position_id: jobPosting.position_id || "", // Empty string instead of null
        position_title: jobPosting.position_title || "", // Empty string instead of null
        description: jobPosting.description || "",
        requirements: jobPosting.requirements || "",
        // Handle salary fields based on employment type
        base_salary: jobPosting.employment_type === "Regular" ? 
                     (jobPosting.base_salary || 0) : 0,
        daily_rate: jobPosting.employment_type !== "Regular" ? 
                    (jobPosting.daily_rate || 0) : 0,
        duration_days: jobPosting.duration_days || 
                      (jobPosting.employment_type === "Seasonal" ? 1 : 
                       jobPosting.employment_type === "Contractual" ? 30 : null),
        posting_status: jobPosting.posting_status || "Draft"
      };
      
      console.log("Sending update data:", updateData);
      
      // Call API to archive the job posting with all the required data
      await axios.patch(
        `http://127.0.0.1:8000/api/job_posting/job_postings/${jobPosting.job_id}/`, 
        updateData
      );
      
      // Update UI state
      showToast("Job posting archived successfully", true);
      setJobPostings(prev => prev.filter(item => item.job_id !== jobPosting.job_id));
      setArchivedJobPostings(prev => [...prev, {...jobPosting, is_archived: true}]);
      setDotsMenuOpen(null);
    } catch (err) {
      console.error("Error archiving job posting:", err.response?.data || err);
      const errorMessage = err.response?.data?.detail || 
                          Object.values(err.response?.data || {}).flat().join(", ") || 
                          "Failed to archive job posting";
      showToast(errorMessage, false);
    }
  };

  const handleRestoreJobPosting = async (jobPosting) => {
    try {
      console.log("Job posting to restore:", jobPosting);
      
      // Create a properly formatted update data object
      const updateData = {
        is_archived: false,
        employment_type: jobPosting.employment_type || "Seasonal", // Provide fallback
        dept_id: jobPosting.dept_id,
        position_id: jobPosting.position_id || "", // Empty string instead of null
        position_title: jobPosting.position_title || "", // Empty string instead of null
        description: jobPosting.description || "",
        requirements: jobPosting.requirements || "",
        // Handle salary fields based on employment type
        base_salary: jobPosting.employment_type === "Regular" ? 
                     (jobPosting.base_salary || 0) : 0,
        daily_rate: jobPosting.employment_type !== "Regular" ? 
                    (jobPosting.daily_rate || 0) : 0,
        duration_days: jobPosting.duration_days || 
                      (jobPosting.employment_type === "Seasonal" ? 1 : 
                       jobPosting.employment_type === "Contractual" ? 30 : null),
        posting_status: jobPosting.posting_status || "Draft"
      };
      
      console.log("Sending update data:", updateData);
      
      // Call API to restore the job posting with all the required data
      await axios.patch(
        `http://127.0.0.1:8000/api/job_posting/job_postings/${jobPosting.job_id}/`, 
        updateData
      );
      
      // Update UI state
      showToast("Job posting restored successfully", true);
      setArchivedJobPostings(prev => prev.filter(item => item.job_id !== jobPosting.job_id));
      setJobPostings(prev => [...prev, {...jobPosting, is_archived: false}]);
      setDotsMenuOpen(null);
    } catch (err) {
      console.error("Error restoring job posting:", err.response?.data || err);
      const errorMessage = err.response?.data?.detail || 
                          Object.values(err.response?.data || {}).flat().join(", ") || 
                          "Failed to restore job posting";
      showToast(errorMessage, false);
    }
  };

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
                <option value="id">Sort by ID</option>
                <option value="status">Sort by Status</option>
              </select>
              <button 
                className="recruitment-add-btn" 
                onClick={handleAddClick}
              >
                {activeTab === "Candidates" ? "+ Add Candidate" : 
                 activeTab === "Job Postings" ? "+ Add Job Posting" : 
                 "+ Add Resignation"}
              </button>
              <button
                className="recruitment-add-btn"
                onClick={() => setShowArchived(!showArchived)}
              >
                {showArchived ? "View Active" : "View Archived"}
              </button>
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
            <h3>Add New Job Posting</h3>
            <form onSubmit={handleJobPostingSubmit} className="recruitment-form">
              <div className="recruitment-form-two-columns">
                <div className="form-column">
                  <div className="form-group">
                    <label>Department *</label>
                    <select 
                      name="dept_id" 
                      value={newJobPosting.dept_id} 
                      onChange={handleJobPostingChange}
                      required
                    >
                      <option value="">-- Select Department --</option>
                      {Array.isArray(departments) ? departments.map(dept => (
                        <option key={dept.dept_id} value={dept.dept_id}>
                          {dept.dept_name}
                        </option>
                      )) : <option value="">No departments available</option>}
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
                      {Array.isArray(positions) ? positions.map(pos => (
                        <option key={pos.position_id} value={pos.position_id}>
                          {pos.position_title}
                        </option>
                      )) : <option value="">No positions available</option>}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Employment Type *</label>
                    <select 
                      name="employment_type" 
                      value={newJobPosting.employment_type} 
                      onChange={handleJobPostingChange}
                      required
                    >
                      <option value="Regular">Regular</option>
                      <option value="Contractual">Contractual</option>
                      <option value="Seasonal">Seasonal</option>
                    </select>
                  </div>
                  
                  {/* Conditionally render salary field based on employment type */}
                  {newJobPosting.employment_type === "Regular" ? (
                    <div className="form-group">
                      <label>Base Salary *</label>
                      <input 
                        type="number" 
                        name="base_salary" 
                        value={newJobPosting.base_salary} 
                        onChange={handleJobPostingChange}
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                  ) : (
                    <div className="form-group">
                      <label>Daily Rate *</label>
                      <input 
                        type="number" 
                        name="daily_rate" 
                        value={newJobPosting.daily_rate} 
                        onChange={handleJobPostingChange}
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                  )}
                </div>
                
                <div className="form-column">
                  <div className="form-group">
                    <label>Duration (Days){newJobPosting.employment_type !== "Regular" ? " *" : ""}</label>
                    <input 
                      type="number" 
                      name="duration_days" 
                      value={newJobPosting.employment_type === "Regular" ? "" : newJobPosting.duration_days} 
                      onChange={handleJobPostingChange}
                      min={newJobPosting.employment_type === "Seasonal" ? 1 : 30}
                      max={newJobPosting.employment_type === "Seasonal" ? 29 : 180}
                      disabled={newJobPosting.employment_type === "Regular"}
                      className={newJobPosting.employment_type === "Regular" ? "disabled-input" : ""}
                      required={newJobPosting.employment_type !== "Regular"}
                    />
                    {newJobPosting.employment_type === "Regular" && 
                      <small className="input-help-text">Not applicable for Regular employees</small>
                    }
                    {newJobPosting.employment_type === "Contractual" && 
                      <small className="input-help-text">Must be between 30 and 180 days</small>
                    }
                    {newJobPosting.employment_type === "Seasonal" && 
                      <small className="input-help-text">Must be between 1 and 29 days</small>
                    }
                  </div>
                  
                  <div className="form-group">
                    <label>Posting Status *</label>
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
                  
                  <div className="form-group">
                    <label>Description *</label>
                    <textarea 
                      name="description" 
                      value={newJobPosting.description} 
                      onChange={handleJobPostingChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Requirements *</label>
                    <textarea 
                      name="requirements" 
                      value={newJobPosting.requirements} 
                      onChange={handleJobPostingChange}
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="recruitment-modal-buttons">
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

      {/* Add Resignation Modal */}
      {showAddResignationModal && (
        <div className="recruitment-modal-overlay">
          <div className="recruitment-modal">
            <h3>Add New Resignation</h3>
            <form onSubmit={handleResignationSubmit} className="recruitment-form">
              <div className="recruitment-form-two-columns">
                <div className="form-column">
                  <div className="form-group">
                    <label>Employee *</label>
                    <select 
                      name="employee_id" 
                      value={newResignation.employee_id} 
                      onChange={handleResignationChange}
                      required
                    >
                      <option value="">-- Select Employee --</option>
                      {Array.isArray(employees) ? employees.map(employee => (
                        <option key={employee.employee_id} value={employee.employee_id}>
                          {employee.first_name} {employee.last_name}
                        </option>
                      )) : <option value="">No employees available</option>}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Notice Period (Days) *</label>
                    <input 
                      type="number" 
                      name="notice_period_days" 
                      value={newResignation.notice_period_days} 
                      onChange={handleResignationChange}
                      min="1"
                      required
                    />
                    <small className="input-help-text">Standard notice period is 30 days</small>
                  </div>
                </div>
                
                <div className="form-column">
                  <div className="form-group">
                      <label>HR Approver</label>
                      <select 
                        name="hr_approver_id" 
                        value={newResignation.hr_approver_id} 
                        onChange={handleResignationChange}
                      >
                        <option value="">-- Select HR Approver --</option>
                        {Array.isArray(employees) ? employees
                          .filter(employee => 
                            // Check for both top-level and nested structures
                            employee.dept_name === "Human Resources" || 
                            employee.dept_id === "HR-DEPT-2025-e9fa93" ||
                            employee.dept?.dept_name === "Human Resources" || 
                            employee.dept?.dept_id === "HR-DEPT-2025-e9fa93"
                          )
                          .map(employee => (
                            <option key={employee.employee_id} value={employee.employee_id}>
                              {employee.first_name} {employee.last_name}
                            </option>
                          )) : <option value="">No HR employees available</option>}
                      </select>
                      <small className="input-help-text">Optional - can be assigned later</small>
                    </div>
                  
                  <div className="form-group">
                    <label>Approval Status</label>
                    <select 
                      name="approval_status" 
                      value={newResignation.approval_status} 
                      onChange={handleResignationChange}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Clearance Status</label>
                    <select 
                      name="clearance_status" 
                      value={newResignation.clearance_status} 
                      onChange={handleResignationChange}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Completed">Completed</option>
                      <option value="In Progress">In Progress</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="recruitment-modal-buttons">
                <button type="submit" className="submit-btn">Submit Resignation</button>
                <button 
                  type="button" 
                  className="cancel-btn" 
                  onClick={() => setShowAddResignationModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Resignation Modal */}
      {showEditResignationModal && editingResignation && (
        <div className="recruitment-modal-overlay">
          <div className="recruitment-modal">
            <h3>Edit Resignation</h3>
            <form onSubmit={handleEditResignationSubmit} className="recruitment-form">
              <div className="recruitment-form-two-columns">
                <div className="form-column">
                  <div className="form-group">
                    <label>Resignation ID</label>
                    <input 
                      type="text" 
                      value={editingResignation.resignation_id} 
                      disabled
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Employee ID</label>
                    <input 
                      type="text" 
                      value={editingResignation.employee_id} 
                      disabled
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Notice Period (Days)</label>
                    <input 
                      type="number" 
                      value={editingResignation.notice_period_days} 
                      disabled
                    />
                  </div>
                </div>
                
                <div className="form-column">
                  <div className="form-group">
                    <label>HR Approver</label>
                    <select 
                      name="hr_approver_id" 
                      value={editingResignation.hr_approver_id || ""} 
                      onChange={handleEditResignationChange}
                    >
                        <option value="">-- Select HR Approver --</option>
                        {Array.isArray(employees) ? employees
                          .filter(employee => 
                            // Check for both top-level and nested structures
                            employee.dept_name === "Human Resources" || 
                            employee.dept_id === "HR-DEPT-2025-e9fa93" ||
                            employee.dept?.dept_name === "Human Resources" || 
                            employee.dept?.dept_id === "HR-DEPT-2025-e9fa93"
                          )
                          .map(employee => (
                            <option key={employee.employee_id} value={employee.employee_id}>
                              {employee.first_name} {employee.last_name}
                            </option>
                        )) : <option value="">No HR employees available</option>}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Approval Status *</label>
                    <select 
                      name="approval_status" 
                      value={editingResignation.approval_status} 
                      onChange={handleEditResignationChange}
                      required
                    >
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Clearance Status *</label>
                    <select 
                      name="clearance_status" 
                      value={editingResignation.clearance_status} 
                      onChange={handleEditResignationChange}
                      required
                    >
                      <option value="Pending">Pending</option>
                      <option value="Completed">Completed</option>
                      <option value="In Progress">In Progress</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="recruitment-modal-buttons">
                <button type="submit" className="submit-btn">Save Changes</button>
                <button 
                  type="button" 
                  className="cancel-btn" 
                  onClick={() => setShowEditResignationModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Job Posting Modal */}
      {showEditJobModal && editingJobPosting && (
        <div className="recruitment-modal-overlay">
          <div className="recruitment-modal">
            <h3>Edit Job Posting</h3>
            <form onSubmit={handleEditJobPostingSubmit} className="recruitment-form">
              <div className="recruitment-form-two-columns">
                <div className="form-column">
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
                      onChange={handleEditJobPostingChange}
                      required
                    >
                      <option value="">-- Select Department --</option>
                      {Array.isArray(departments) ? departments.map(dept => (
                        <option key={dept.dept_id} value={dept.dept_id}>
                          {dept.dept_name}
                        </option>
                      )) : <option value="">No departments available</option>}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Position *</label>
                    <select 
                      name="position_id" 
                      value={editingJobPosting.position_id || ''} 
                      onChange={handleEditJobPostingChange}
                      required
                    >
                      <option value="">-- Select Position --</option>
                      {Array.isArray(positions) ? positions.map(pos => (
                        <option key={pos.position_id} value={pos.position_id}>
                          {pos.position_title}
                        </option>
                      )) : <option value="">No positions available</option>}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Employment Type *</label>
                    <select 
                      name="employment_type" 
                      value={editingJobPosting.employment_type || 'Regular'} 
                      onChange={handleEditJobPostingChange}
                      required
                    >
                      <option value="Regular">Regular</option>
                      <option value="Contractual">Contractual</option>
                      <option value="Seasonal">Seasonal</option>
                    </select>
                  </div>
                  
                  {editingJobPosting.employment_type === "Regular" ? (
                    <div className="form-group">
                      <label>Base Salary *</label>
                      <input 
                        type="number" 
                        name="base_salary" 
                        value={editingJobPosting.base_salary || ''} 
                        onChange={handleEditJobPostingChange}
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                  ) : (
                    <div className="form-group">
                      <label>Daily Rate *</label>
                      <input 
                        type="number" 
                        name="daily_rate" 
                        value={editingJobPosting.daily_rate || ''} 
                        onChange={handleEditJobPostingChange}
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                  )}
                </div>
                
                <div className="form-column">
                  <div className="form-group">
                    <label>Duration (Days){editingJobPosting.employment_type !== "Regular" ? " *" : ""}</label>
                    <input 
                      type="number" 
                      name="duration_days" 
                      value={editingJobPosting.employment_type === "Regular" ? "" : editingJobPosting.duration_days || ""} 
                      onChange={handleEditJobPostingChange}
                      min={editingJobPosting.employment_type === "Seasonal" ? 1 : 30}
                      max={editingJobPosting.employment_type === "Seasonal" ? 29 : 180}
                      disabled={editingJobPosting.employment_type === "Regular"}
                      className={editingJobPosting.employment_type === "Regular" ? "disabled-input" : ""}
                      required={editingJobPosting.employment_type !== "Regular"}
                    />
                    {editingJobPosting.employment_type === "Regular" && 
                      <small className="input-help-text">Not applicable for Regular employees</small>
                    }
                    {editingJobPosting.employment_type === "Contractual" && 
                      <small className="input-help-text">Must be between 30 and 180 days</small>
                    }
                    {editingJobPosting.employment_type === "Seasonal" && 
                      <small className="input-help-text">Must be between 1 and 29 days</small>
                    }
                  </div>
                  
                  <div className="form-group">
                    <label>Posting Status *</label>
                    <select 
                      name="posting_status" 
                      value={editingJobPosting.posting_status || 'Draft'} 
                      onChange={handleEditJobPostingChange}
                      required
                    >
                      <option value="Draft">Draft</option>
                      <option value="Open">Open</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Description *</label>
                    <textarea 
                      name="description" 
                      value={editingJobPosting.description || ''} 
                      onChange={handleEditJobPostingChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Requirements *</label>
                    <textarea 
                      name="requirements" 
                      value={editingJobPosting.requirements || ''} 
                      onChange={handleEditJobPostingChange}
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="recruitment-modal-buttons">
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