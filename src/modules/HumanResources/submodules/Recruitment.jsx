import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiSearch, FiUpload, FiPlus } from "react-icons/fi";
import "../styles/Recruitment.css";

const S3_BASE_DIRECTORY = "Human_Resource_Management/Candidates/";

const Recruitment = () => {
  // Data states for each section
  const [candidates, setCandidates] = useState([]);
  const [archivedCandidates, setArchivedCandidates] = useState([]);
  const [jobPostings, setJobPostings] = useState([]);
  const [archivedJobPostings, setArchivedJobPostings] = useState([]);
  const [resignations, setResignations] = useState([]);
  const [showAddJobModal, setShowAddJobModal] = useState(false);
  const [showAddResignationModal, setShowAddResignationModal] = useState(false); // New state for resignation modal
  const [showEditResignationModal, setShowEditResignationModal] = useState(false); // New state for editing resignation
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const [showInterviewDetailsModal, setShowInterviewDetailsModal] = useState(false);
  const [showOfferDetailsModal, setShowOfferDetailsModal] = useState(false);
  const [showContractDetailsModal, setShowContractDetailsModal] = useState(false);
  const [showUploadDocumentModal, setShowUploadDocumentModal] = useState(false);
  const [showEditCandidateModal, setShowEditCandidateModal] = useState(false);
  const [showAddCandidateModal, setShowAddCandidateModal] = useState(false);
  const [showEditJobModal, setShowEditJobModal] = useState(false);
  
  // Reference data
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [employees, setEmployees] = useState([]); // Add the employees state variable
  const [newJobPosting, setNewJobPosting] = useState({
    dept_id: "",
    position_id: "",
    position_title: "",
    description: "",
    requirements: "",
    employment_type: "",
    base_salary: "",
    daily_rate: "",
    duration_days: "",
    posting_status: "Draft" // Default status
  });

  const [newResignation, setNewResignation] = useState({
    employee_id: "",
    notice_period_days: "",
    hr_approver_id: "",
    approval_status: "Pending", // Default value
    clearance_status: "Not Started" // Default value
  });

  const [editingResignation, setEditingResignation] = useState(null);

  const [newCandidate, setNewCandidate] = useState({
    job_id: "",
    position_title: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    resume_path: null,
    application_status: "Applied", // Default status
    documents: null,
    interview_details: null,
    offer_details: null,
    contract_details: null,
    resume_file: null // New field for storing the actual file
  });

  const [editingCandidate, setEditingCandidate] = useState(null);
  const [editingJobPosting, setEditingJobPosting] = useState(null);

  // UI States
  const [activeTab, setActiveTab] = useState("Candidates");
  const [showArchived, setShowArchived] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sortField, setSortField] = useState("all");
  const [loading, setLoading] = useState(false); // General loading state
  const [toast, setToast] = useState(null);
  const [dotsMenuOpen, setDotsMenuOpen] = useState(null);
  const [viewingDocuments, setViewingDocuments] = useState(null);
  const [viewingInterviewDetails, setViewingInterviewDetails] = useState(null);
  const [viewingOfferDetails, setViewingOfferDetails] = useState(null);
  const [viewingContractDetails, setViewingContractDetails] = useState(null);
  const [currentCandidate, setCurrentCandidate] = useState(null);
  const [uploadingDocumentType, setUploadingDocumentType] = useState('');
  const [uploadingDocumentCategory, setUploadingDocumentCategory] = useState('');
  const [uploadingFile, setUploadingFile] = useState(null);
  const [uploadingStatus, setUploadingStatus] = useState('idle'); // Upload-specific state

  // Add these state variables after the other state declarations
  const [selectedArchivedCandidates, setSelectedArchivedCandidates] = useState([]);
  const [selectedArchivedJobPostings, setSelectedArchivedJobPostings] = useState([]);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Existing fetch calls
        const [candidatesRes, archivedCandidatesRes] = await Promise.all([
          axios.get("https://x0crs910m2.execute-api.ap-southeast-1.amazonaws.com/dev/api/candidates/candidates/"),
          axios.get("https://x0crs910m2.execute-api.ap-southeast-1.amazonaws.com/dev/api/candidates/candidates/archived/")
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
          axios.get("https://x0crs910m2.execute-api.ap-southeast-1.amazonaws.com/dev/api/job_posting/job_postings/"),
          axios.get("https://x0crs910m2.execute-api.ap-southeast-1.amazonaws.com/dev/api/job_posting/job_postings/archived/")
        ]);

        const resignationsRes = await axios.get("https://x0crs910m2.execute-api.ap-southeast-1.amazonaws.com/dev/api/resignation/resignations/");

        // New fetch calls for departments, positions, and employees - THIS WAS MISSING
        const [deptsRes, positionsRes, employeesRes] = await Promise.all([
          axios.get("https://x0crs910m2.execute-api.ap-southeast-1.amazonaws.com/dev/api/departments/department/"),
          axios.get("https://x0crs910m2.execute-api.ap-southeast-1.amazonaws.com/dev/api/positions/positions/"),
          axios.get("https://x0crs910m2.execute-api.ap-southeast-1.amazonaws.com/dev/api/employees/")
        ]);

        // Add this debugging to see what's coming back
        console.log('Departments data:', deptsRes.data);
        console.log('Positions data:', positionsRes.data);
        console.log('Employees data:', employeesRes.data);

        // Ensure we're working with arrays
        const departmentsData = ensureArray(deptsRes.data);
        const positionsData = ensureArray(positionsRes.data);
        const employeesData = ensureArray(employeesRes.data);
        
        // Set all the state values with the fetched data
        setCandidates(candidatesRes.data);
        setArchivedCandidates(archivedCandidatesRes.data);
        setJobPostings(jobPostingsRes.data);
        setArchivedJobPostings(archivedJobPostingsRes.data);
        setResignations(resignationsRes.data);
        setDepartments(departmentsData);
        setPositions(positionsData);
        setEmployees(employeesData); // Add this line to save employees
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
      return data.values;
    }
    // Default to empty array
    return [];
  };
  
  // Also add a showToast function if it doesn't exist yet
  const showToast = (message, success = true) => {
    setToast({ message, success });
    setTimeout(() => setToast(null), 3000);
  };

  // Add these helper functions in your component
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleString();
    } catch (e) {
      return dateString;
    }
  };

  // Handle document viewing
  const handleViewDocuments = (documents) => {
    if (typeof documents === 'string') {
      try {
        documents = JSON.parse(documents);
      } catch (e) {
        console.error("Error parsing documents JSON:", e);
        showToast("Could not parse document data", false);
        return;
      }
    }
    
    // Set state and show modal to display documents
    setViewingDocuments(documents);
    setShowDocumentsModal(true);
  };

  // Handle viewing interview details
  const handleViewInterviewDetails = (details) => {
    if (typeof details === 'string') {
      try {
        details = JSON.parse(details);
      } catch (e) {
        console.error("Error parsing interview details JSON:", e);
        showToast("Could not parse interview data", false);
        return;
      }
    }
    
    setViewingInterviewDetails(details);
    setShowInterviewDetailsModal(true);
  };

  // Handle viewing offer details
  const handleViewOfferDetails = (details) => {
    if (typeof details === 'string') {
      try {
        details = JSON.parse(details);
      } catch (e) {
        console.error("Error parsing offer details JSON:", e);
        showToast("Could not parse offer data", false);
        return;
      }
    }
    
    setViewingOfferDetails(details);
    setShowOfferDetailsModal(true);
  };

  // Handle viewing contract details
  const handleViewContractDetails = (details) => {
    if (typeof details === 'string') {
      try {
        details = JSON.parse(details);
      } catch (e) {
        console.error("Error parsing contract details JSON:", e);
        showToast("Could not parse contract data", false);
        return;
      }
    }
    
    setViewingContractDetails(details);
    setShowContractDetailsModal(true);
  };

  // Function to handle document upload for a candidate
  const handleUploadDocument = (candidate) => {
    setCurrentCandidate(candidate);
    setShowUploadDocumentModal(true);
    setDotsMenuOpen(null);
  };

  // Function to handle editing a candidate
  const handleEditCandidate = (candidate) => {
    setEditingCandidate({
      ...candidate,
      // Ensure all required fields exist
      job_id: candidate.job_id || "",
      first_name: candidate.first_name || "",
      last_name: candidate.last_name || "",
      email: candidate.email || "",
      phone: candidate.phone || "",
      application_status: candidate.application_status || "Applied",
      resume_file: null // For new file uploads
    });
    setShowEditCandidateModal(true);
    setDotsMenuOpen(null);
  };

  // Function to handle adding a new candidate
  const handleAddCandidate = () => {
    // Reset the form values
    setNewCandidate({
      job_id: "",
      position_title: "",
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      resume_path: null,
      application_status: "Applied",
      documents: null,
      interview_details: null,
      offer_details: null,
      contract_details: null,
      resume_file: null
    });
    setShowAddCandidateModal(true);
  };

  // Handle resume file upload
  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewCandidate(prev => ({
        ...prev,
        resume_file: file // Store the actual file
      }));
    }
  };

  const handleEditResumeUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setEditingCandidate(prev => ({
        ...prev,
        resume_file: e.target.files[0]
      }));
    }
  };

  // Archive and restore functions
  const handleArchiveCandidate = async (candidate) => {
    try {
      await axios.post(`https://x0crs910m2.execute-api.ap-southeast-1.amazonaws.com/dev/api/candidates/candidates/${candidate.candidate_id || candidate.id}/archive/`);
      showToast("Candidate archived successfully", true);
      
      // Refresh candidate lists
      const [candidatesRes, archivedCandidatesRes] = await Promise.all([
        axios.get("https://x0crs910m2.execute-api.ap-southeast-1.amazonaws.com/dev/api/candidates/candidates/"),
        axios.get("https://x0crs910m2.execute-api.ap-southeast-1.amazonaws.com/dev/api/candidates/candidates/archived/")
      ]);
      
      setCandidates(candidatesRes.data);
      setArchivedCandidates(archivedCandidatesRes.data);
    } catch (err) {
      console.error("Error archiving candidate:", err);
      showToast("Failed to archive candidate", false);
    }
  };

  const handleRestoreCandidate = async (candidate) => {
    try {
      await axios.post(`https://x0crs910m2.execute-api.ap-southeast-1.amazonaws.com/dev/api/candidates/candidates/${candidate.candidate_id || candidate.id}/restore/`);
      showToast("Candidate restored successfully", true);
      
      // Refresh candidate lists
      const [candidatesRes, archivedCandidatesRes] = await Promise.all([
        axios.get("https://x0crs910m2.execute-api.ap-southeast-1.amazonaws.com/dev/api/candidates/candidates/"),
        axios.get("https://x0crs910m2.execute-api.ap-southeast-1.amazonaws.com/dev/api/candidates/candidates/archived/")
      ]);
      
      setCandidates(candidatesRes.data);
      setArchivedCandidates(archivedCandidatesRes.data);
    } catch (err) {
      console.error("Error restoring candidate:", err);
      showToast("Failed to restore candidate", false);
    }
  };

  const handleEditResignation = (resignation) => {
    // Create a copy of the resignation to edit
    setEditingResignation({
      ...resignation
    });
    setShowEditResignationModal(true);
    setDotsMenuOpen(null);
  };

  const handleViewResignationDetails = (resignation) => {
    // View resignation details logic
    console.log("Viewing resignation details:", resignation);
    setDotsMenuOpen(null);
  };

  const handleEditResignationSubmit = async (e) => {
    e.preventDefault();
    try {
      // Update resignation logic here
      await axios.patch(
        `https://x0crs910m2.execute-api.ap-southeast-1.amazonaws.com/dev/api/resignation/resignations/${editingResignation.resignation_id}/`, 
        editingResignation
      );
      
      showToast("Resignation updated successfully", true);
      setShowEditResignationModal(false);
      
      // Refresh resignations
      const resignationsRes = await axios.get("https://x0crs910m2.execute-api.ap-southeast-1.amazonaws.com/dev/api/resignation/resignations/");
      setResignations(resignationsRes.data);
    } catch (err) {
      console.error("Error updating resignation:", err.response?.data || err);
      const errorMessage = err.response?.data?.detail || 
                         Object.values(err.response?.data || {}).flat().join(", ") || 
                         "Failed to update resignation";
      showToast(errorMessage, false);
    }
  };

  const handleEditCandidateSubmit = async (e) => {
    e.preventDefault();
    
    // Create FormData for file uploads
    const formData = new FormData();
    
    // Add all text fields
    Object.keys(editingCandidate).forEach(key => {
      if (key !== 'resume_file' && key !== 'resume_path' && editingCandidate[key] !== null) {
        formData.append(key, editingCandidate[key]);
      }
    });
    
    // Add resume file if present
    if (editingCandidate.resume_file) {
      formData.append('resume', editingCandidate.resume_file);
    }
    
    try {
      setLoading(true);
      
      // Submit to API
      const response = await axios.patch(
        `https://x0crs910m2.execute-api.ap-southeast-1.amazonaws.com/dev/api/candidates/candidates/${editingCandidate.candidate_id || editingCandidate.id}/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      showToast("Candidate updated successfully", true);
      setShowEditCandidateModal(false);
      
      // Refresh the candidates list
      const candidatesRes = await axios.get("https://x0crs910m2.execute-api.ap-southeast-1.amazonaws.com/dev/api/candidates/candidates/");
      setCandidates(candidatesRes.data.filter(c => !c.is_archived));
      setArchivedCandidates(candidatesRes.data.filter(c => c.is_archived));
      
    } catch (err) {
      console.error("Error updating candidate:", err);
      const errorMessage = err.response?.data?.detail || 
                         Object.values(err.response?.data || {}).flat().join(", ") || 
                         "Failed to update candidate";
      showToast(errorMessage, false);
    } finally {
      setLoading(false);
    }
  };

  // Add these toggle selection functions
  const toggleSelectArchivedCandidate = (id) => {
    if (selectedArchivedCandidates.includes(id)) {
      setSelectedArchivedCandidates(prev => prev.filter(item => item !== id));
    } else {
      setSelectedArchivedCandidates(prev => [...prev, id]);
    }
  };

  const toggleSelectArchivedJobPosting = (id) => {
    if (selectedArchivedJobPostings.includes(id)) {
      setSelectedArchivedJobPostings(prev => prev.filter(item => item !== id));
    } else {
      setSelectedArchivedJobPostings(prev => [...prev, id]);
    }
  };

  // Add bulk unarchive functions
  const bulkUnarchiveCandidates = async () => {
    try {
      setLoading(true);
      
      // Create an array of promises for each selected candidate
      const promises = selectedArchivedCandidates.map(id => 
        axios.post(`https://x0crs910m2.execute-api.ap-southeast-1.amazonaws.com/dev/api/candidates/candidates/${id}/restore/`)
      );
      
      // Execute all promises
      await Promise.all(promises);
      
      // Show success message
      showToast("Selected candidates restored successfully", true);
      
      // Reset selection
      setSelectedArchivedCandidates([]);
      
      // Refresh candidate lists
      const [candidatesRes, archivedCandidatesRes] = await Promise.all([
        axios.get("https://x0crs910m2.execute-api.ap-southeast-1.amazonaws.com/dev/api/candidates/candidates/"),
        axios.get("https://x0crs910m2.execute-api.ap-southeast-1.amazonaws.com/dev/api/candidates/candidates/archived/")
      ]);
      
      setCandidates(candidatesRes.data);
      setArchivedCandidates(archivedCandidatesRes.data);
    } catch (err) {
      console.error("Error restoring candidates:", err);
      showToast("Failed to restore candidates", false);
    } finally {
      setLoading(false);
    }
  };

  const bulkUnarchiveJobPostings = async () => {
    try {
      setLoading(true);
      
      // Create an array of promises for each selected job posting
      const promises = selectedArchivedJobPostings.map(id => {
        // Find the job posting to restore
        const jobPosting = archivedJobPostings.find(job => job.job_id === id);
        
        // Create update data similar to handleRestoreJobPosting
        const updateData = {
          is_archived: false,
          employment_type: jobPosting.employment_type || "Seasonal",
          dept_id: jobPosting.dept_id,
          position_id: jobPosting.position_id || "",
          position_title: jobPosting.position_title || "",
          description: jobPosting.description || "",
          requirements: jobPosting.requirements || "",
          base_salary: jobPosting.employment_type === "Regular" ? 
                        (jobPosting.base_salary || 0) : 0,
          daily_rate: jobPosting.employment_type !== "Regular" ? 
                      (jobPosting.daily_rate || 0) : 0,
          duration_days: jobPosting.duration_days || 
                        (jobPosting.employment_type === "Seasonal" ? 1 : 
                          jobPosting.employment_type === "Contractual" ? 30 : null),
          posting_status: jobPosting.posting_status || "Draft"
        };
        
        // Send update request
        return axios.patch(
          `https://x0crs910m2.execute-api.ap-southeast-1.amazonaws.com/dev/api/job_posting/job_postings/${id}/`, 
          updateData
        );
      });
      
      // Execute all promises
      await Promise.all(promises);
      
      // Show success message
      showToast("Selected job postings restored successfully", true);
      
      // Reset selection
      setSelectedArchivedJobPostings([]);
      
      // Refresh job posting lists
      const [jobPostingsRes, archivedJobPostingsRes] = await Promise.all([
        axios.get("https://x0crs910m2.execute-api.ap-southeast-1.amazonaws.com/dev/api/job_posting/job_postings/"),
        axios.get("https://x0crs910m2.execute-api.ap-southeast-1.amazonaws.com/dev/api/job_posting/job_postings/archived/")
      ]);
      
      setJobPostings(jobPostingsRes.data);
      setArchivedJobPostings(archivedJobPostingsRes.data);
    } catch (err) {
      console.error("Error restoring job postings:", err);
      showToast("Failed to restore job postings", false);
    } finally {
      setLoading(false);
    }
  };

  // Utility functions
  const filterAndPaginate = (data) => {
    // Filter based on search term
    let filtered = data;
    if (searchTerm) {
      filtered = data.filter(item => {
        // Adjust these properties based on your data structure
        return (
          (item.resignation_id?.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (item.employee_id?.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (item.approval_status?.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (item.clearance_status?.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      });
    }
  
    // Sort if needed
    if (sortField !== 'all') {
      filtered = [...filtered].sort((a, b) => {
        if (sortField === 'id') {
          return a.resignation_id?.localeCompare(b.resignation_id);
        } else if (sortField === 'status') {
          return a.approval_status?.localeCompare(b.approval_status);
        }
        return 0;
      });
    }
  
    // Paginate
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginated = filtered.slice(startIndex, startIndex + itemsPerPage);
  
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
                        <input 
                          type="checkbox" 
                          checked={selectedArchivedJobPostings.includes(posting.job_id)}
                          onChange={() => toggleSelectArchivedJobPosting(posting.job_id)}
                        />
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
        {isArchived && selectedArchivedJobPostings.length > 0 && (
          <div className="recruitment-bulk-actions">
            <button 
              className="recruitment-bulk-action-btn" 
              onClick={bulkUnarchiveJobPostings}
            >
              Restore Selected Job Postings
            </button>
          </div>
        )}
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
                  <th>Position Title</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Resume Path</th>
                  <th>Application Status</th>
                  <th>Documents</th>
                  <th>Interview Details</th>
                  <th>Offer Details</th>
                  <th>Contract Details</th>
                  <th>Created At</th>
                  <th>Updated At</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((candidate, index) => (
                  <tr key={candidate.id} className={isArchived ? "recruitment-archived-row" : ""}>
                    {isArchived && (
                      <td>
                        <input 
                          type="checkbox" 
                          checked={selectedArchivedCandidates.includes(candidate.candidate_id || candidate.id)}
                          onChange={() => toggleSelectArchivedCandidate(candidate.candidate_id || candidate.id)}
                        />
                      </td>
                    )}
                    <td>{candidate.candidate_id || candidate.id}</td>
                    <td>{candidate.job_id || '-'}</td>
                    <td>{candidate.position_title || candidate.applied_position || '-'}</td>
                    <td>{candidate.first_name}</td>
                    <td>{candidate.last_name}</td>
                    <td>{candidate.email}</td>
                    <td>
                      {candidate.resume_path ? (
                        <a href={candidate.resume_path} target="_blank" rel="noopener noreferrer">
                          View Resume
                        </a>
                      ) : (
                        '-'
                      )}
                    </td>
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
                    <td>
                      <div className="recruitment-document-actions">
                        {candidate.documents ? (
                          <button 
                            className="recruitment-view-btn"
                            onClick={() => handleViewDocuments(candidate.documents)}
                          >
                            View Files
                          </button>
                        ) : (
                          '-'
                        )}
                        {!isArchived && (
                          <button 
                            className="recruitment-upload-btn"
                            onClick={() => handleUploadDocument(candidate)}
                          >
                            <FiUpload className="upload-icon" /> Upload Document
                          </button>
                        )}
                      </div>
                    </td>
                    <td>
                      {candidate.interview_details ? (
                        <button 
                          className="recruitment-view-btn"
                          onClick={() => handleViewInterviewDetails(candidate.interview_details)}
                        >
                          View Details
                        </button>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td>
                      {candidate.offer_details ? (
                        <button 
                          className="recruitment-view-btn"
                          onClick={() => handleViewOfferDetails(candidate.offer_details)}
                        >
                          View Offer
                        </button>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td>
                      {candidate.contract_details ? (
                        <button 
                          className="recruitment-view-btn"
                          onClick={() => handleViewContractDetails(candidate.contract_details)}
                        >
                          View Contract
                        </button>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td>{formatDate(candidate.created_at)}</td>
                    <td>{formatDate(candidate.updated_at)}</td>
                    <td className="recruitment-actions">
                      <div className="recruitment-action-buttons">
                        <div
                          className="recruitment-dots"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDotsMenuOpen(dotsMenuOpen === index ? null : index);
                          }}
                        >
                          ⋮
                          {dotsMenuOpen === index && (
                            <div className="recruitment-dropdown">
                              <div 
                                className="recruitment-dropdown-item"
                                onClick={() => handleEditCandidate(candidate)}
                              >
                                Edit
                              </div>
                              <div 
                                className="recruitment-dropdown-item"
                                onClick={() => handleViewDocuments(candidate)}
                              >
                                View Documents
                              </div>
                              {!isArchived && (
                                <div 
                                  className="recruitment-dropdown-item"
                                  onClick={() => handleArchiveCandidate(candidate)}
                                >
                                  Archive
                                </div>
                              )}
                              {isArchived && (
                                <div 
                                  className="recruitment-dropdown-item"
                                  onClick={() => handleRestoreCandidate(candidate)}
                                >
                                  Restore
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {isArchived && selectedArchivedCandidates.length > 0 && (
          <div className="recruitment-bulk-actions">
            <button 
              className="recruitment-bulk-action-btn" 
              onClick={bulkUnarchiveCandidates}
            >
              Restore Selected Candidates
            </button>
          </div>
        )}
        {renderPagination(totalPages)}
      </>
    );
  };

  const renderResignationsTable = (data) => {
    const { paginated, totalPages } = filterAndPaginate(data);
    if (loading) return <div className="recruitment-loading">Loading...</div>;
    if (!paginated.length) return <div className="recruitment-no-results">No resignations found</div>;
    
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
                            <div 
                              className="recruitment-dropdown-item"
                              onClick={() => handleViewResignationDetails(resignation)}
                            >
                              View Details
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

  const renderPagination = (totalPages) => {
    return (
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
  };

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

const handleAddClick = () => {
  if (activeTab === "Job Postings") {
    setNewJobPosting({
      dept_id: null,
      position_id: null,
      position_title: "",
      description: "",
      requirements: "",
      employment_type: null,
      base_salary: null,
      daily_rate: null,
      duration_days: null,
      posting_status: null
    });
    setShowAddJobModal(true);
  } else if (activeTab === "Resignations") {
    setNewResignation({
      employee_id: "",
      notice_period_days: "",
      hr_approver_id: "",
      approval_status: "Pending",
      clearance_status: "Not Started"
    });
    setShowAddResignationModal(true);
  } else if (activeTab === "Candidates") {
    handleAddCandidate();
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
    // Set appropriate values based on employment type
    if (value === "Regular") {
      setNewJobPosting(prev => ({
        ...prev,
        employment_type: value,
        // Keep base_salary as is
        daily_rate: null,
        duration_days: null
      }));
    } else if (value === "Contractual") {
      setNewJobPosting(prev => ({
        ...prev,
        employment_type: value,
        base_salary: null,
        // Keep daily_rate as is
        duration_days: prev.duration_days || 30
      }));
    } else if (value === "Seasonal") {
      setNewJobPosting(prev => ({
        ...prev,
        employment_type: value,
        base_salary: null,
        // Keep daily_rate as is
        duration_days: prev.duration_days || 1
      }));
    } else {
      // Empty selection
      setNewJobPosting(prev => ({
        ...prev,
        employment_type: value
      }));
    }
  }
  // Handle numeric inputs
  else if (type === "number") {
    const numValue = value === "" ? null : 
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

const handleResignationChange = (e) => {
  const { name, value } = e.target;
  setNewResignation(prev => ({
    ...prev,
    [name]: value
  }));
};

const handleCandidateChange = (e) => {
  const { name, value, type } = e.target;
  
  if (name === "job_id") {
    // If changing job ID, update position_title automatically
    const selectedJob = jobPostings.find(job => job.job_id === value);
    setNewCandidate(prev => ({
      ...prev,
      [name]: value,
      position_title: selectedJob?.position_title || ""
    }));
  } else {
    // For all other fields
    setNewCandidate(prev => ({
      ...prev,
      [name]: value
    }));
  }
};

const handleEditCandidateChange = (e) => {
  const { name, value, type } = e.target;
  
  if (name === "job_id") {
    // If changing job ID, update position_title automatically
    const selectedJob = jobPostings.find(job => job.job_id === value);
    setEditingCandidate(prev => ({
      ...prev,
      [name]: value,
      position_title: selectedJob?.position_title || ""
    }));
  } else {
    // For all other fields
    setEditingCandidate(prev => ({
      ...prev,
      [name]: value
    }));
  }
};

const handleEditJobPostingSubmit = async (e) => {
  e.preventDefault();
  
  // Create a copy of the data to send to the API
  const jobPostingData = { ...editingJobPosting };
  
  // Add this console log to see what's being sent
  console.log("Submitting job posting update with data:", jobPostingData);
  
  try {
    // Validate required fields
    if (!jobPostingData.dept_id || !jobPostingData.position_id || 
        !jobPostingData.description || !jobPostingData.requirements) {
      showToast("Please fill all required fields", false);
      return;
    }
    
    // Apply proper formatting based on employment type
    if (jobPostingData.employment_type === "Regular") {
      if (!jobPostingData.base_salary) {
        showToast("Base salary is required for Regular positions", false);
        return;
      }
      jobPostingData.daily_rate = null;
      jobPostingData.duration_days = null;
    } else if (jobPostingData.employment_type === "Contractual") {
      if (!jobPostingData.daily_rate) {
        showToast("Daily rate is required for Contractual positions", false);
        return;
      }
      jobPostingData.base_salary = null;
      if (!jobPostingData.duration_days || 
          jobPostingData.duration_days < 30 || 
          jobPostingData.duration_days > 180) {
        showToast("Contractual positions require duration between 30 and 180 days", false);
        return;
      }
    } else if (jobPostingData.employment_type === "Seasonal") {
      if (!jobPostingData.daily_rate) {
        showToast("Daily rate is required for Seasonal positions", false);
        return;
      }
      jobPostingData.base_salary = null;
      if (!jobPostingData.duration_days || 
          jobPostingData.duration_days < 1 || 
          jobPostingData.duration_days > 29) {
        showToast("Seasonal positions require duration between 1 and 29 days", false);
        return;
      }
    }
    
    // Set a default posting status if not provided
    if (jobPostingData.posting_status === null || jobPostingData.posting_status === "") {
      jobPostingData.posting_status = "Draft";
    }
    
    await axios.patch(
      `https://x0crs910m2.execute-api.ap-southeast-1.amazonaws.com/dev/api/job_posting/job_postings/${editingJobPosting.job_id}/`, 
      jobPostingData
    );
    
    showToast("Job posting updated successfully", true);
    setShowEditJobModal(false);
    
    // Refresh job postings
    const jobPostingsRes = await axios.get("https://x0crs910m2.execute-api.ap-southeast-1.amazonaws.com/dev/api/job_posting/job_postings/");
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
    const numValue = value === "" ? null : 
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
  
  try {
    // Create a copy of the job posting data
    const jobPostingData = {...newJobPosting};
    
    // Make sure employment type is set
    if (!jobPostingData.employment_type) {
      showToast("Please select a valid employment type", false);
      return;
    }
    
    // Set appropriate values based on employment type
    if (jobPostingData.employment_type === "Regular") {
      // For Regular employees, explicitly set daily_rate and duration_days to null
      jobPostingData.daily_rate = null;
      jobPostingData.duration_days = null;
      
      if (!jobPostingData.base_salary) {
        showToast("Base salary is required for Regular positions", false);
        return;
      }
    } else if (["Contractual", "Seasonal"].includes(jobPostingData.employment_type)) {
      // For Contractual/Seasonal employees, explicitly set base_salary to null
      jobPostingData.base_salary = null;
      
      if (!jobPostingData.daily_rate) {
        showToast("Daily rate is required for Contractual/Seasonal positions", false);
        return;
      }
      
      // Validate duration_days based on employment type
      if (jobPostingData.employment_type === "Contractual") {
        if (!jobPostingData.duration_days || jobPostingData.duration_days < 30 || jobPostingData.duration_days > 180) {
          showToast("Contractual positions require duration between 30 and 180 days", false);
          return;
        }
      } else if (jobPostingData.employment_type === "Seasonal") {
        if (!jobPostingData.duration_days || jobPostingData.duration_days < 1 || jobPostingData.duration_days > 29) {
          showToast("Seasonal positions require duration between 1 and 29 days", false);
          return;
        }
      }
    } else {
      showToast("Please select a valid employment type", false);
      return;
    }
    
    // Set a default posting status if not provided
    if (jobPostingData.posting_status === null || jobPostingData.posting_status === "") {
      jobPostingData.posting_status = "Draft";
    }
    
    console.log("Submitting job posting data:", jobPostingData);
    // Submit the modified data
    const response = await axios.post("https://x0crs910m2.execute-api.ap-southeast-1.amazonaws.com/dev/api/job_posting/job_postings/", jobPostingData);
    showToast("Job posting created successfully!", true);
    
    // Refresh job postings and close modal
    const jobPostingsRes = await axios.get("https://x0crs910m2.execute-api.ap-southeast-1.amazonaws.com/dev/api/job_posting/job_postings/");
    setJobPostings(jobPostingsRes.data);
    setShowAddJobModal(false);
    
    // Reset form
    setNewJobPosting({
      dept_id: "",
      position_id: "",
      position_title: "",
      description: "",
      requirements: "",
      employment_type: "",
      base_salary: "",
      daily_rate: "",
      duration_days: "",
      posting_status: "Draft"
    });
  } catch (err) {
    console.error("Error creating job posting:", err);
    const errorMessage = err.response?.data?.detail || 
                       Object.values(err.response?.data || {}).flat().join(", ") || 
                       "Failed to create job posting";
    showToast(errorMessage, false);
  }
};

const handleResignationSubmit = async (e) => {
  e.preventDefault();
  
  try {
    // Validate required fields
    if (!newResignation.employee_id || !newResignation.notice_period_days) {
      showToast("Please fill all required fields", false);
      return;
    }
    
    // Send resignation data to the API
    const response = await axios.post(
      "https://x0crs910m2.execute-api.ap-southeast-1.amazonaws.com/dev/api/resignation/resignations/", 
      newResignation
    );
    
    showToast("Resignation created successfully", true);
    setShowAddResignationModal(false);
    
    // Refresh resignations
    const resignationsRes = await axios.get("https://x0crs910m2.execute-api.ap-southeast-1.amazonaws.com/dev/api/resignation/resignations/");
    setResignations(resignationsRes.data);
  } catch (err) {
    console.error("Error creating resignation:", err.response?.data || err);
    const errorMessage = err.response?.data?.detail || 
                       Object.values(err.response?.data || {}).flat().join(", ") || 
                       "Failed to create resignation";
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
      `https://x0crs910m2.execute-api.ap-southeast-1.amazonaws.com/dev/api/job_posting/job_postings/${jobPosting.job_id}/`, 
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
      `https://x0crs910m2.execute-api.ap-southeast-1.amazonaws.com/dev/api/job_posting/job_postings/${jobPosting.job_id}/`, 
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

const submitCandidateForm = async (e) => {
  e.preventDefault();
  
  // Create FormData for file uploads
  const formData = new FormData();
  
  // Add all text fields
  Object.keys(newCandidate).forEach(key => {
    if (key !== 'resume_file' && newCandidate[key] !== null) {
      formData.append(key, newCandidate[key]);
    }
  });
  
  // Add resume file if present
  if (newCandidate.resume_file) {
    formData.append('resume', newCandidate.resume_file);
  }
  
  try {
    setLoading(true);
    
    // Submit to API
    const response = await axios.post(
      "https://x0crs910m2.execute-api.ap-southeast-1.amazonaws.com/dev/api/candidates/candidates/",
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    showToast("Candidate added successfully", true);
    setShowAddCandidateModal(false);
    
    // Refresh the candidates list
    const candidatesRes = await axios.get("https://x0crs910m2.execute-api.ap-southeast-1.amazonaws.com/dev/api/candidates/candidates/");
    setCandidates(candidatesRes.data);
    
  } catch (err) {
    console.error("Error adding candidate:", err);
    showToast("Failed to add candidate: " + (err.response?.data?.message || err.message), false);
  } finally {
    setLoading(false);
  }
};

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentCandidate || !uploadingFile || !uploadingDocumentType || !uploadingDocumentCategory) {
      showToast("Please select a file, document type, and category", false);
      return;
    }
    
    try {
      setUploadingStatus('uploading');
      
      // Define S3 directory based on candidate ID and document category
      const S3_BASE_DIRECTORY = `Human_Resource_Management/Candidates/${currentCandidate.candidate_id || currentCandidate.id}/`;
      const directory = `${S3_BASE_DIRECTORY}${uploadingDocumentCategory}/${uploadingDocumentType}`;
      
      console.log("Uploading to directory:", directory);
      
      // Step 1: Get the upload URL from the API
      const getUrlResponse = await axios.post('https://s9v4t5i8ej.execute-api.ap-southeast-1.amazonaws.com/dev/api/upload-to-s3/', {
        fileName: uploadingFile.name,
        directory: directory
      });
      
      console.log("S3 URL response:", getUrlResponse.data);
      
      // Step 2: Extract the upload URL and public file URL
      const { uploadUrl, fileUrl } = getUrlResponse.data;
      
      // Step 3: Upload the file to the provided URL with proper content type
      await axios.put(uploadUrl, uploadingFile, {
        headers: {
          'Content-Type': uploadingFile.type
        }
      });
      
      // Step 4: Fetch current documents for the candidate
      const candidateResponse = await axios.get(`https://x0crs910m2.execute-api.ap-southeast-1.amazonaws.com/dev/api/candidates/candidates/${currentCandidate.candidate_id || currentCandidate.id}/`);
      
      // Step 5: Parse existing documents or create a new structure
      let documents = { required: {}, optional: {} };
      
      if (candidateResponse.data.documents) {
        try {
          // Parse if it's a string, otherwise use as is
          documents = typeof candidateResponse.data.documents === 'string' 
            ? JSON.parse(candidateResponse.data.documents) 
            : candidateResponse.data.documents;
            
          // Ensure the structure has required and optional properties
          documents.required = documents.required || {};
          documents.optional = documents.optional || {};
        } catch (e) {
          console.error("Error parsing documents:", e);
        }
      }
      
      // Step 6: Update the documents structure with the new file
      if (uploadingDocumentCategory === 'required') {
        documents.required[uploadingDocumentType] = {
          verified: false,
          path: fileUrl,
          verified_by: null
        };
      } else {
        documents.optional[uploadingDocumentType] = {
          path: fileUrl
        };
      }
      
      // Step 7: Update the candidate's documents in your backend
      await axios.patch(
        `https://x0crs910m2.execute-api.ap-southeast-1.amazonaws.com/dev/api/candidates/candidates/${currentCandidate.candidate_id || currentCandidate.id}/`, 
        { documents: JSON.stringify(documents) }
      );
      
      showToast("Document uploaded successfully", true);
      
      // Refresh candidates data
      const candidatesRes = await axios.get("https://x0crs910m2.execute-api.ap-southeast-1.amazonaws.com/dev/api/candidates/candidates/");
      setCandidates(candidatesRes.data.filter(c => !c.is_archived));
      setArchivedCandidates(candidatesRes.data.filter(c => c.is_archived));
      
      // Reset form and close modal
      setUploadingFile(null);
      setUploadingDocumentType('');
      setUploadingDocumentCategory('');
      setShowUploadDocumentModal(false);
    } catch (err) {
      console.error("Error uploading document:", err);
      // More detailed error logging
      if (err.response) {
        console.error("Response data:", err.response.data);
        console.error("Response status:", err.response.status);
      }
      const errorMessage = err.response?.data?.detail || 
                         Object.values(err.response?.data || {}).flat().join(", ") || 
                         "Failed to upload document";
      showToast(errorMessage, false);
    } finally {
      setUploadingStatus('idle');
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
              {activeTab === "Candidates" && (
                <button className="recruitment-add-btn" onClick={handleAddClick}>
                  <FiPlus className="icon" /> Add Candidate
                </button>
              )}

              {activeTab === "Job Postings" && (
                <button className="recruitment-add-btn" onClick={handleAddClick}>
                  <FiPlus className="icon" /> Add Job Posting
                </button>
              )}

              {activeTab === "Resignations" && (
                <button className="recruitment-add-btn" onClick={handleAddClick}>
                  <FiPlus className="icon" /> Add Resignation
                </button>
              )}
              
              {activeTab !== "Resignations" && (
                <button
                  className="recruitment-add-btn"
                  onClick={() => setShowArchived(!showArchived)}
                >
                  {showArchived ? "View Active" : "View Archived"}
                </button>
              )}
              
              {activeTab === "Candidates" && showArchived && selectedArchivedCandidates.length > 0 && (
                <button
                  className="recruitment-add-btn"
                  onClick={bulkUnarchiveCandidates}
                >
                  Unarchive Selected ({selectedArchivedCandidates.length})
                </button>
              )}
              
              {activeTab === "Job Postings" && showArchived && selectedArchivedJobPostings.length > 0 && (
                <button
                  className="recruitment-add-btn"
                  onClick={bulkUnarchiveJobPostings}
                >
                  Unarchive Selected ({selectedArchivedJobPostings.length})
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

      {uploadingStatus === 'uploading' && (
        <div className="recruitment-loading-overlay">
          <div className="recruitment-spinner"></div>
          <p>Uploading document...</p>
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
                      {departments.map(dept => (
                        <option key={dept.dept_id} value={dept.dept_id}>
                          {dept.dept_name}
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
                    <label>Position Title</label>
                    <input
                      type="text"
                      name="position_title"
                      value={newJobPosting.position_title}
                      disabled
                      placeholder="Auto-filled from position selection"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Employment Type *</label>
                    <select
                      name="employment_type"
                      value={newJobPosting.employment_type || ""}
                      onChange={handleJobPostingChange}
                      required
                    >
                      <option value="">-- Select Employment Type --</option>
                      <option value="Regular">Regular</option>
                      <option value="Contractual">Contractual</option>
                      <option value="Seasonal">Seasonal</option>
                    </select>
                  </div>
                  
                  {newJobPosting.employment_type === "Regular" ? (
                    <div className="form-group">
                      <label>Base Salary *</label>
                      <input 
                        type="number" 
                        name="base_salary" 
                        value={newJobPosting.base_salary || ""} 
                        onChange={handleJobPostingChange}
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                  ) : (
                    <>
                      {newJobPosting.employment_type && (
                        <div className="form-group">
                          <label>Daily Rate *</label>
                          <input 
                            type="number" 
                            name="daily_rate" 
                            value={newJobPosting.daily_rate || ""} 
                            onChange={handleJobPostingChange}
                            min="0"
                            step="0.01"
                            required
                          />
                        </div>
                      )}
                    </>
                  )}
                  
                  {newJobPosting.employment_type && newJobPosting.employment_type !== "Regular" && (
                    <div className="form-group">
                      <label>Duration (Days) *</label>
                      <input 
                        type="number" 
                        name="duration_days" 
                        value={newJobPosting.duration_days || ""} 
                        onChange={handleJobPostingChange}
                        min={newJobPosting.employment_type === "Seasonal" ? 1 : 30}
                        max={newJobPosting.employment_type === "Seasonal" ? 29 : 180}
                        required
                      />
                    </div>
                  )}
                </div>
                
                <div className="form-column">
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
                  
                  <div className="form-group">
                    <label>Posting Status</label>
                    <select
                      name="posting_status"
                      value={newJobPosting.posting_status}
                      onChange={handleJobPostingChange}
                    >
                      <option value="Draft">Draft</option>
                      <option value="Open">Open</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="recruitment-modal-buttons">
                <button type="submit" className="submit-btn">Submit</button>
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
                      {Array.isArray(employees) ? employees.map(emp => (
                        <option key={emp.employee_id} value={emp.employee_id}>
                          {emp.first_name} {emp.last_name}
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
                    <label>Approval Status</label>
                    <select
                      name="approval_status"
                      value={newResignation.approval_status || "Pending"}
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
                      value={newResignation.clearance_status || "Not Started"}
                      onChange={handleResignationChange}
                    >
                      <option value="Not Started">Not Started</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="recruitment-modal-buttons">
                <button type="submit" className="submit-btn">Submit</button>
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

      {showEditResignationModal && editingResignation && (
        <div className="recruitment-modal-overlay">
          <div className="recruitment-modal">
            <h3>Edit Resignation</h3>
            <form onSubmit={handleEditResignationSubmit} className="recruitment-form">
              <div className="recruitment-form-two-columns">
                <div className="form-column">
                  <div className="form-group">
                    <label>Employee ID</label>
                    <input 
                      type="text"
                      value={editingResignation.employee_id || ""}
                      disabled
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Notice Period (Days)</label>
                    <input 
                      type="number"
                      value={editingResignation.notice_period_days || ""}
                      disabled
                    />
                  </div>
                </div>
                
                <div className="form-column">
                  <div className="form-group">
                    <label>Approval Status *</label>
                    <select
                      name="approval_status"
                      value={editingResignation.approval_status || "Pending"}
                      onChange={(e) => setEditingResignation({
                        ...editingResignation,
                        approval_status: e.target.value
                      })}
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
                      value={editingResignation.clearance_status || "Not Started"}
                      onChange={(e) => setEditingResignation({
                        ...editingResignation,
                        clearance_status: e.target.value
                      })}
                      required
                    >
                      <option value="Not Started">Not Started</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
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

      {/* Documents Modal */}
      {showDocumentsModal && viewingDocuments && (
        <div className="recruitment-modal-overlay" onClick={() => setShowDocumentsModal(false)}>
          <div className="recruitment-modal" onClick={e => e.stopPropagation()}>
            <h3>Candidate Documents</h3>
            
            {viewingDocuments.required && (
              <div className="documents-section">
                <h4>Required Documents</h4>
                <table className="recruitment-documents-table">
                  <thead>
                    <tr>
                      <th>Document Type</th>
                      <th>Status</th>
                      <th>Verified By</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(viewingDocuments.required).map(([docType, docInfo]) => (
                      <tr key={docType}>
                        <td>{docType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</td>
                        <td>
                          <span className={`recruitment-tag ${docInfo.verified ? 'approved' : 'pending'}`}>
                            {docInfo.verified ? 'Verified' : 'Pending'}
                          </span>
                        </td>
                        <td>{docInfo.verified_by || '-'}</td>
                        <td>
                          {docInfo.path && (
                            <a 
                              href={docInfo.path} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="recruitment-download-btn"
                            >
                              View / Download
                            </a>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {viewingDocuments.optional && (
              <div className="documents-section">
                <h4>Optional Documents</h4>
                <table className="recruitment-documents-table">
                  <thead>
                    <tr>
                      <th>Document Type</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(viewingDocuments.optional).map(([docType, docInfo]) => (
                      <tr key={docType}>
                        <td>{docType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</td>
                        <td>
                          {docInfo.path && (
                            <a 
                              href={docInfo.path} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="recruitment-download-btn"
                            >
                              View / Download
                            </a>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            <div className="recruitment-modal-buttons">
              <button className="cancel-btn" onClick={() => setShowDocumentsModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Document Modal */}
      {showUploadDocumentModal && (
        <div className="recruitment-modal-overlay">
          <div className="recruitment-modal">
            <h3>Upload Document for {currentCandidate?.first_name} {currentCandidate?.last_name}</h3>
            
            <form onSubmit={handleUploadSubmit} className="recruitment-form">
              <div className="form-group">
                <label htmlFor="document-category">Document Category *</label>
                <select 
                  id="document-category"
                  value={uploadingDocumentCategory}
                  onChange={(e) => setUploadingDocumentCategory(e.target.value)}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="required">Required Documents</option>
                  <option value="optional">Optional Documents</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="document-type">Document Type *</label>
                <select 
                  id="document-type"
                  value={uploadingDocumentType}
                  onChange={(e) => setUploadingDocumentType(e.target.value)}
                  required
                  disabled={!uploadingDocumentCategory}
                >
                  <option value="">Select Document Type</option>
                  {uploadingDocumentCategory === "required" && (
                    <>
                      <option value="resume">Resume</option>
                      <option value="psa_birth_cert">PSA Birth Certificate</option>
                      <option value="nbi_clearance">NBI Clearance</option>
                      <option value="diploma">College Diploma</option>
                      <option value="tor">Transcript of Records</option>
                    </>
                  )}
                  {uploadingDocumentCategory === "optional" && (
                    <>
                      <option value="cover_letter">Cover Letter</option>
                      <option value="recommendation">Recommendation Letter</option>
                      <option value="certificate">Certificates</option>
                      <option value="portfolio">Portfolio</option>
                      <option value="other">Other</option>
                    </>
                  )}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="document-file">File *</label>
                <input 
                  type="file"
                  id="document-file"
                  onChange={(e) => setUploadingFile(e.target.files[0])}
                  required
                />
                <span className="input-help-text">
                  Max file size: 5MB. Supported formats: PDF, DOC, DOCX, JPG, PNG.
                </span>
              </div>
              
              <div className="recruitment-modal-buttons">
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => {
                    setShowUploadDocumentModal(false);
                    setUploadingDocumentCategory("");
                    setUploadingDocumentType("");
                    setUploadingFile(null);
                  }}
                >
                  Cancel
                </button>
                
                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={uploadingStatus === 'uploading' || !uploadingFile || !uploadingDocumentType || !uploadingDocumentCategory}
                >
                  {uploadingStatus === 'uploading' ? 'Uploading...' : 'Upload Document'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Document Details Modal */}
      {showInterviewDetailsModal && viewingInterviewDetails && (
        <div className="recruitment-modal-overlay" onClick={() => setShowInterviewDetailsModal(false)}>
          <div className="recruitment-modal" onClick={e => e.stopPropagation()}>
            <h3>Interview Details</h3>
            {/* Interview details content here */}
            <div className="recruitment-modal-buttons">
              <button className="cancel-btn" onClick={() => setShowInterviewDetailsModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Offer Details Modal */}
      {showOfferDetailsModal && viewingOfferDetails && (
        <div className="recruitment-modal-overlay" onClick={() => setShowOfferDetailsModal(false)}>
          <div className="recruitment-modal" onClick={e => e.stopPropagation()}>
            <h3>Offer Details</h3>
            {/* Offer details content here */}
            <div className="recruitment-modal-buttons">
              <button className="cancel-btn" onClick={() => setShowOfferDetailsModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Contract Details Modal */}
      {showContractDetailsModal && viewingContractDetails && (
        <div className="recruitment-modal-overlay" onClick={() => setShowContractDetailsModal(false)}>
          <div className="recruitment-modal" onClick={e => e.stopPropagation()}>
            <h3>Contract Details</h3>
            {/* Contract details content here */}
            <div className="recruitment-modal-buttons">
              <button className="cancel-btn" onClick={() => setShowContractDetailsModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Candidate Modal */}
      {showEditCandidateModal && editingCandidate && (
        <div className="recruitment-modal-overlay" onClick={() => setShowEditCandidateModal(false)}>
          <div className="recruitment-modal" style={{ width: "1200px", maxWidth: "95vw" }} onClick={e => e.stopPropagation()}>
            <h3>Edit Candidate Information</h3>
            
            <form onSubmit={handleEditCandidateSubmit} className="recruitment-form">
              <div className="recruitment-form-two-columns">
                <div className="form-column">
                  <div className="form-group">
                    <label htmlFor="edit-job-id">Job Posting *</label>
                    <select 
                      id="edit-job-id" 
                      name="job_id" 
                      value={editingCandidate?.job_id || ""} 
                      onChange={handleEditCandidateChange}
                      required
                    >
                      <option value="">-- Select Job Posting --</option>
                      {jobPostings.map(job => (
                        <option key={job.job_id} value={job.job_id}>
                          {job.job_id} - {job.position_title}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="edit-first-name">First Name *</label>
                    <input 
                      type="text" 
                      id="edit-first-name" 
                      name="first_name" 
                      value={editingCandidate?.first_name || ""} 
                      onChange={handleEditCandidateChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="edit-last-name">Last Name *</label>
                    <input 
                      type="text" 
                      id="edit-last-name" 
                      name="last_name" 
                      value={editingCandidate?.last_name || ""} 
                      onChange={handleEditCandidateChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-column">
                  <div className="form-group">
                    <label htmlFor="edit-email">Email *</label>
                    <input 
                      type="email" 
                      id="edit-email" 
                      name="email" 
                      value={editingCandidate?.email || ""} 
                      onChange={handleEditCandidateChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="edit-phone">Phone *</label>
                    <input 
                      type="tel" 
                      id="edit-phone" 
                      name="phone" 
                      value={editingCandidate?.phone || ""} 
                      onChange={handleEditCandidateChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="edit-application-status">Application Status *</label>
                    <select 
                      id="edit-application-status" 
                      name="application_status" 
                      value={editingCandidate?.application_status || ""} 
                      onChange={handleEditCandidateChange}
                      required
                    >
                      <option value="Applied">Applied</option>
                      <option value="Screening">Screening</option>
                      <option value="Interviewing">Interviewing</option>
                      <option value="Hired">Hired</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Waitlisted">Waitlisted</option>
                    </select>
                  </div>
                </div>

                <div className="form-group full-width">
                  <label htmlFor="edit-resume">Resume</label>
                  <div className="resume-info">
                    {editingCandidate?.resume_path ? (
                      <div className="current-resume">
                        <span>Current resume: {editingCandidate.resume_path.split('/').pop()}</span>
                        <a 
                          href={editingCandidate.resume_path} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="recruitment-view-btn"
                          style={{ marginLeft: '10px' }}
                        >
                          View
                        </a>
                      </div>
                    ) : (
                      <span>No resume uploaded</span>
                    )}
                  </div>
                  <input 
                    type="file" 
                    id="edit-resume" 
                    name="resume" 
                    onChange={handleEditResumeUpload}
                    accept=".pdf,.doc,.docx"
                  />
                  <span className="input-help-text">Accepted formats: PDF, DOC, DOCX</span>
                  <span className="input-help-text">
                    Leave empty to keep the current resume. Upload a new file to replace it.
                  </span>
                </div>
              </div>
              
              <div className="recruitment-modal-buttons">
                <button 
                  type="button" 
                  className="cancel-btn" 
                  onClick={() => setShowEditCandidateModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Candidate Modal */}
      {showAddCandidateModal && (
        <div className="recruitment-modal-overlay">
          <div className="recruitment-modal" style={{ width: "1200px", maxWidth: "95vw" }}>
            <h3>Add New Candidate</h3>
            
            <form onSubmit={submitCandidateForm} className="recruitment-form">
              <div className="recruitment-form-two-columns">
                <div className="form-column">
                  <div className="form-group">
                    <label htmlFor="job_id">Job Posting *</label>
                    <select 
                      id="job_id" 
                      name="job_id" 
                      value={newCandidate.job_id} 
                      onChange={handleCandidateChange}
                      required
                    >
                      <option value="">-- Select Job Posting --</option>
                      {jobPostings.map(job => (
                        <option key={job.job_id} value={job.job_id}>
                          {job.job_id} - {job.position_title}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="first_name">First Name *</label>
                    <input 
                      type="text" 
                      id="first_name" 
                      name="first_name" 
                      value={newCandidate.first_name} 
                      onChange={handleCandidateChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="last_name">Last Name *</label>
                    <input 
                      type="text" 
                      id="last_name" 
                      name="last_name" 
                      value={newCandidate.last_name} 
                      onChange={handleCandidateChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-column">
                  <div className="form-group">
                    <label htmlFor="email">Email *</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      value={newCandidate.email} 
                      onChange={handleCandidateChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="phone">Phone *</label>
                    <input 
                      type="tel" 
                      id="phone" 
                      name="phone" 
                      value={newCandidate.phone} 
                      onChange={handleCandidateChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="application_status">Application Status *</label>
                    <select 
                      id="application_status" 
                      name="application_status" 
                      value={newCandidate.application_status} 
                      onChange={handleCandidateChange}
                      required
                    >
                      <option value="Applied">Applied</option>
                      <option value="Screening">Screening</option>
                      <option value="Interviewing">Interviewing</option>
                      <option value="Hired">Hired</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Waitlisted">Waitlisted</option>
                    </select>
                  </div>
                </div>

                <div className="form-group full-width">
                  <label htmlFor="resume">Resume</label>
                  <input 
                    type="file" 
                    id="resume" 
                    name="resume" 
                    onChange={handleResumeUpload}
                    accept=".pdf,.doc,.docx"
                  />
                  <span className="input-help-text">Accepted formats: PDF, DOC, DOCX</span>
                  <span className="input-help-text">
                    Additional details like Documents, Interview Details, Offer Details, and Contract Details 
                    can be added after creating the candidate.
                  </span>
                </div>
              </div>
              
              <div className="recruitment-modal-buttons">
                <button 
                  type="button" 
                  className="cancel-btn" 
                  onClick={() => setShowAddCandidateModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Add Candidate"}
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
                    <label>Department *</label>
                    <select 
                      name="dept_id" 
                      value={editingJobPosting.dept_id || ""} 
                      onChange={handleEditJobPostingChange}
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
                  
                  <div className="form-group">
                    <label>Position *</label>
                    <select
                      name="position_id"
                      value={editingJobPosting.position_id || ""}
                      onChange={handleEditJobPostingChange}
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
                    <label>Position Title</label>
                    <input
                      type="text"
                      name="position_title"
                      value={editingJobPosting.position_title || ""}
                      disabled
                      placeholder="Auto-filled from position selection"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Employment Type *</label>
                    <select
                      name="employment_type"
                      value={editingJobPosting.employment_type || ""}
                      onChange={handleEditJobPostingChange}
                      required
                    >
                      <option value="">-- Select Employment Type --</option>
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
                        value={editingJobPosting.base_salary || ""} 
                        onChange={handleEditJobPostingChange}
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                  ) : (
                    <>
                      {editingJobPosting.employment_type && (
                        <div className="form-group">
                          <label>Daily Rate *</label>
                          <input 
                            type="number" 
                            name="daily_rate" 
                            value={editingJobPosting.daily_rate || ""} 
                            onChange={handleEditJobPostingChange}
                            min="0"
                            step="0.01"
                            required
                          />
                        </div>
                      )}
                    </>
                  )}
                  
                  {editingJobPosting.employment_type && editingJobPosting.employment_type !== "Regular" && (
                    <div className="form-group">
                      <label>Duration (Days) *</label>
                      <input 
                        type="number" 
                        name="duration_days" 
                        value={editingJobPosting.duration_days || ""} 
                        onChange={handleEditJobPostingChange}
                        min={editingJobPosting.employment_type === "Seasonal" ? 1 : 30}
                        max={editingJobPosting.employment_type === "Seasonal" ? 29 : 180}
                        required
                      />
                    </div>
                  )}
                </div>
                
                <div className="form-column">
                  <div className="form-group">
                    <label>Description *</label>
                    <textarea
                      name="description"
                      value={editingJobPosting.description || ""}
                      onChange={handleEditJobPostingChange}
                      required
                    />
                  </div>
                  
                  {editingJobPosting.employment_type !== "Regular" && (
                    <div className="form-group">
                      <label>Duration (Days){editingJobPosting.employment_type !== "Regular" ? " *" : ""}</label>
                      <input 
                        type="number" 
                        name="duration_days" 
                        value={editingJobPosting.duration_days || ""} 
                        onChange={handleEditJobPostingChange}
                        min={editingJobPosting.employment_type === "Seasonal" ? 1 : 30}
                        max={editingJobPosting.employment_type === "Seasonal" ? 29 : 180}
                        required={editingJobPosting.employment_type !== "Regular"}
                      />
                    </div>
                  )}
                  
                  <div className="form-group">
                    <label>Requirements *</label>
                    <textarea 
                      name="requirements" 
                      value={editingJobPosting.requirements || ""} 
                      onChange={handleEditJobPostingChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Posting Status</label>
                    <select
                      name="posting_status"
                      value={editingJobPosting.posting_status || ""}
                      onChange={handleEditJobPostingChange}
                    >
                      <option value="Draft">Draft</option>
                      <option value="Open">Open</option>
                      <option value="Closed">Closed</option>
                    </select>
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