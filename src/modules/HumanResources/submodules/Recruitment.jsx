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
  const [showAddJobModal, setShowAddJobModal] = useState(false);
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const [showInterviewDetailsModal, setShowInterviewDetailsModal] = useState(false);
  const [showOfferDetailsModal, setShowOfferDetailsModal] = useState(false);
  const [showContractDetailsModal, setShowContractDetailsModal] = useState(false);
  const [showUploadDocumentModal, setShowUploadDocumentModal] = useState(false);
  const [showEditCandidateModal, setShowEditCandidateModal] = useState(false);
  const [showAddCandidateModal, setShowAddCandidateModal] = useState(false);
  const [showEditJobModal, setShowEditJobModal] = useState(false);
  const [showAddInterviewModal, setShowAddInterviewModal] = useState(false);
  const [showAddOnboardingModal, setShowAddOnboardingModal] = useState(false);
  
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
  const [activeTab, setActiveTab] = useState("Job Postings");
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
  const [selectedArchivedInterviews, setSelectedArchivedInterviews] = useState([]);
  const [selectedArchivedOnboardingTasks, setSelectedArchivedOnboardingTasks] = useState([]);


  // Add these after other state variables
  const [interviews, setInterviews] = useState([]);
  const [archivedInterviews, setArchivedInterviews] = useState([]);
  const [onboardingTasks, setOnboardingTasks] = useState([]);
  const [archivedOnboardingTasks, setArchivedOnboardingTasks] = useState([]);

  // For modals
  const [showEditInterviewModal, setShowEditInterviewModal] = useState(false);
  const [editingInterview, setEditingInterview] = useState(null);
  const [newInterview, setNewInterview] = useState({
    candidate_id: "",
    interview_date: "",
    interview_time: "",
    interview_type: "Technical", // Default value
    interviewer_id: "",
    status: "Scheduled", // Default value
    notes: "",
    feedback: "",
    rating: null
  });

  const [showEditOnboardingModal, setShowEditOnboardingModal] = useState(false);
  const [editingOnboardingTask, setEditingOnboardingTask] = useState(null);
  const [newOnboardingTask, setNewOnboardingTask] = useState({
    employee_id: "",
    task_name: "",
    description: "",
    due_date: "",
    status: "Pending", // Default value
    assigned_to: "",
    priority: "Medium" // Default value
  });
  
// Add this near the beginning of your component after the useState declarations
useEffect(() => {
  // Debug log whenever data changes
  console.log("Data state:", {
    candidates: candidates.length,
    archivedCandidates: archivedCandidates.length,
    jobPostings: jobPostings.length,
    archivedJobPostings: archivedJobPostings.length,
    interviews: interviews.length,
    archivedInterviews: archivedInterviews.length,
    onboardingTasks: onboardingTasks.length,
    archivedOnboardingTasks: archivedOnboardingTasks.length
  });
}, [candidates, archivedCandidates, jobPostings, archivedJobPostings, 
    interviews, archivedInterviews, onboardingTasks, archivedOnboardingTasks]);

  // Fetch data on component mount
  useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch candidates
      try {
        const [candidatesRes, archivedCandidatesRes] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/candidates/candidates/"),
          axios.get("http://127.0.0.1:8000/api/candidates/candidates/archived/")
        ]);
        setCandidates(ensureArray(candidatesRes.data));
        setArchivedCandidates(ensureArray(archivedCandidatesRes.data));
        console.log("Candidates data loaded:", ensureArray(candidatesRes.data).length);
      } catch (err) {
        console.error("Error fetching candidates:", err);
        setCandidates([]);
        setArchivedCandidates([]);
      }

      // Fetch job postings
      try {
        const [jobPostingsRes, archivedJobPostingsRes] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/job_posting/job_postings/"),
          axios.get("http://127.0.0.1:8000/api/job_posting/job_postings/archived/")
        ]);
        setJobPostings(ensureArray(jobPostingsRes.data));
        setArchivedJobPostings(ensureArray(archivedJobPostingsRes.data));
        console.log("Job postings data loaded:", ensureArray(jobPostingsRes.data).length);
      } catch (err) {
        console.error("Error fetching job postings:", err);
        setJobPostings([]);
        setArchivedJobPostings([]);
      }

      // Fetch interviews
      try {
        const [activeInterviewsRes, archivedInterviewsRes] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/interviews/?is_archived=false"),
          axios.get("http://127.0.0.1:8000/api/interviews/?is_archived=true")
        ]);
        setInterviews(ensureArray(activeInterviewsRes.data));
        setArchivedInterviews(ensureArray(archivedInterviewsRes.data));
        console.log("Interviews data loaded:", ensureArray(activeInterviewsRes.data).length, "archived:", ensureArray(archivedInterviewsRes.data).length);
      } catch (err) {
        console.error("Error fetching interviews:", err);
        setInterviews([]);
        setArchivedInterviews([]);
      }
      try {
        const [onboardingRes, archivedOnboardingRes] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/onboarding/"),
          axios.get("http://127.0.0.1:8000/api/onboarding/?is_archived=true")
        ]);
        setOnboardingTasks(ensureArray(onboardingRes.data));
        setArchivedOnboardingTasks(ensureArray(archivedOnboardingRes.data));
        console.log("Onboarding data loaded:", ensureArray(onboardingRes.data).length, "archived:", ensureArray(archivedOnboardingRes.data).length);
      } catch (err) {
        console.error("Error fetching onboarding tasks:", err);
        setOnboardingTasks([]);
        setArchivedOnboardingTasks([]);
      }

      // Fetch reference data
      try {
        const [deptsRes, positionsRes, employeesRes] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/departments/department/"),
          axios.get("http://127.0.0.1:8000/api/positions/positions/"),
          axios.get("http://127.0.0.1:8000/api/employees/")
        ]);
        setDepartments(ensureArray(deptsRes.data));
        setPositions(ensureArray(positionsRes.data));
        setEmployees(ensureArray(employeesRes.data));
        console.log("Reference data loaded");
      } catch (err) {
        console.error("Error fetching reference data:", err);
        setDepartments([]);
        setPositions([]);
        setEmployees([]);
      }
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);
  
  // Add this helper function near the top of your component
  const ensureArray = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (data && typeof data === 'object') {
      // If it's an object, it might be a response with results property
      if (data.results && Array.isArray(data.results)) {
        return data.results;
      }
      // Or it might be an object where values are what we want
      if (data.values && Array.isArray(data.values)) {
        return data.values;
      }
      // Last resort: if it has no results but is an object, check if it might be an array-like object
      if (Object.keys(data).length > 0 && typeof Object.keys(data)[0] === 'number') {
        return Object.values(data);
      }
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
      await axios.post(`http://127.0.0.1:8000/api/candidates/candidates/${candidate.candidate_id || candidate.id}/archive/`);
      showToast("Candidate archived successfully", true);
      
      // Refresh candidate lists
      const [candidatesRes, archivedCandidatesRes] = await Promise.all([
        axios.get("http://127.0.0.1:8000/api/candidates/candidates/"),
        axios.get("http://127.0.0.1:8000/api/candidates/candidates/archived/")
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
      await axios.post(`http://127.0.0.1:8000/api/candidates/candidates/${candidate.candidate_id || candidate.id}/restore/`);
      showToast("Candidate restored successfully", true);
      
      // Refresh candidate lists
      const [candidatesRes, archivedCandidatesRes] = await Promise.all([
        axios.get("http://127.0.0.1:8000/api/candidates/candidates/"),
        axios.get("http://127.0.0.1:8000/api/candidates/candidates/archived/")
      ]);
      
      setCandidates(candidatesRes.data);
      setArchivedCandidates(archivedCandidatesRes.data);
    } catch (err) {
      console.error("Error restoring candidate:", err);
      showToast("Failed to restore candidate", false);
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
        `http://127.0.0.1:8000/api/candidates/candidates/${editingCandidate.candidate_id || editingCandidate.id}/`,
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
      const candidatesRes = await axios.get("http://127.0.0.1:8000/api/candidates/candidates/");
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

  const toggleSelectArchivedInterview = (id) => {
    if (selectedArchivedInterviews.includes(id)) {
      setSelectedArchivedInterviews(prev => prev.filter(item => item !== id));
    } else {
      setSelectedArchivedInterviews(prev => [...prev, id]);
    }
  };

  const toggleSelectArchivedOnboardingTask = (id) => {
    if (selectedArchivedOnboardingTasks.includes(id)) {
      setSelectedArchivedOnboardingTasks(prev => prev.filter(item => item !== id));
    } else {
      setSelectedArchivedOnboardingTasks(prev => [...prev, id]);
    }
  };

  // Add bulk unarchive functions
  const bulkUnarchiveCandidates = async () => {
    try {
      setLoading(true);
      
      // Create an array of promises for each selected candidate
      const promises = selectedArchivedCandidates.map(id => 
        axios.post(`http://127.0.0.1:8000/api/candidates/candidates/${id}/restore/`)
      );
      
      // Execute all promises
      await Promise.all(promises);
      
      // Show success message
      showToast("Selected candidates restored successfully", true);
      
      // Reset selection
      setSelectedArchivedCandidates([]);
      
      // Refresh candidate lists
      const [candidatesRes, archivedCandidatesRes] = await Promise.all([
        axios.get("http://127.0.0.1:8000/api/candidates/candidates/"),
        axios.get("http://127.0.0.1:8000/api/candidates/candidates/archived/")
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
          `http://127.0.0.1:8000/api/job_posting/job_postings/${id}/`, 
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
        axios.get("http://127.0.0.1:8000/api/job_posting/job_postings/"),
        axios.get("http://127.0.0.1:8000/api/job_posting/job_postings/archived/")
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
  // Add these functions for interview management
const handleArchiveInterview = async (interview) => {
  try {
    await axios.post(`http://127.0.0.1:8000/api/interviews/${interview.interview_id}/archive/`);
    showToast("Interview archived successfully", true);
    
    // Refresh interview lists
    const [activeInterviewsRes, archivedInterviewsRes] = await Promise.all([
      axios.get("http://127.0.0.1:8000/api/interviews/?is_archived=false"),
      axios.get("http://127.0.0.1:8000/api/interviews/?is_archived=true")
    ]);
    
    setInterviews(ensureArray(activeInterviewsRes.data));
    setArchivedInterviews(ensureArray(archivedInterviewsRes.data));
  } catch (err) {
    console.error("Error archiving interview:", err);
    showToast("Failed to archive interview", false);
  }
};

const handleRestoreInterview = async (interview) => {
  try {
    await axios.post(`http://127.0.0.1:8000/api/interviews/${interview.interview_id}/unarchive/`);
    showToast("Interview restored successfully", true);
    
    // Refresh interview lists
    const [activeInterviewsRes, archivedInterviewsRes] = await Promise.all([
      axios.get("http://127.0.0.1:8000/api/interviews/?is_archived=false"),
      axios.get("http://127.0.0.1:8000/api/interviews/?is_archived=true")
    ]);
    
    setInterviews(ensureArray(activeInterviewsRes.data));
    setArchivedInterviews(ensureArray(archivedInterviewsRes.data));
  } catch (err) {
    console.error("Error restoring interview:", err);
    showToast("Failed to restore interview", false);
  }
};

const handleEditInterview = (interview) => {
  // Extract time from the interview_date
  let date = "";
  let time = "";
  
  if (interview.interview_date) {
    const parts = interview.interview_date.split('T');
    date = parts[0];
    time = parts.length > 1 ? parts[1].substring(0, 5) : ""; // Extract HH:MM
  }

  setEditingInterview({
    interview_id: interview.interview_id,
    candidate: interview.candidate_id,
    job: interview.job_id,
    interview_date: date,
    interview_time: time,
    interviewer: interview.interviewer_id,
    status: interview.status || 'Scheduled',
    feedback: interview.feedback || '',
    rating: interview.rating || null,
    // Store name values for display purposes
    candidate_name: interview.candidate_name,
    job_title: interview.job_title,
    interviewer_name: interview.interviewer_name
  });
  
  setShowEditInterviewModal(true);
  setDotsMenuOpen(null);
};

const handleEditInterviewSubmit = async (e) => {
  e.preventDefault();
  try {
    setLoading(true);
    
    // Combine date and time for interview_date
    const combinedData = {
      ...editingInterview,
      interview_date: editingInterview.interview_date && editingInterview.interview_time ?
        `${editingInterview.interview_date}T${editingInterview.interview_time}:00` :
        editingInterview.interview_date
    };
    
    // Convert field names to match backend model
    const apiData = {
      ...combinedData,
      candidate_id: combinedData.candidate,
      job_id: combinedData.job,
      interviewer_id: combinedData.interviewer
    };
    
    // Remove old field names
    delete apiData.candidate;
    delete apiData.job;
    delete apiData.interviewer;
    delete apiData.interview_time; // This is combined into interview_date
    
    // Submit to API
    const response = await axios.patch(
      `http://127.0.0.1:8000/api/interviews/${editingInterview.interview_id}/`,
      apiData
    );
    
    showToast("Interview updated successfully", true);
    setShowEditInterviewModal(false);
    
    // Refresh interviews list
    const [activeInterviews, archivedInterviews] = await Promise.all([
      axios.get("http://127.0.0.1:8000/api/interviews/?is_archived=false"),
      axios.get("http://127.0.0.1:8000/api/interviews/?is_archived=true")
    ]);
    setInterviews(ensureArray(activeInterviews.data));
    setArchivedInterviews(ensureArray(archivedInterviews.data));
    
  } catch (err) {
    console.error("Error updating interview:", err);
    const errorMessage = err.response?.data?.detail || 
                       Object.values(err.response?.data || {}).flat().join(", ") || 
                       "Failed to update interview";
    showToast(errorMessage, false);
  } finally {
    setLoading(false);
  }
};

// Add this function to handle bulk unarchiving of interviews
const bulkUnarchiveInterviews = async () => {
  try {
    setLoading(true);
    
    // Create an array of promises for each selected interview
    const promises = selectedArchivedInterviews.map(id => 
      axios.post(`http://127.0.0.1:8000/api/interviews/${id}/unarchive/`)
    );
    
    // Execute all promises
    await Promise.all(promises);
    
    // Show success message
    showToast("Selected interviews restored successfully", true);
    
    // Reset selection
    setSelectedArchivedInterviews([]);
    
    // Refresh interview lists
    const [activeInterviews, archivedInterviews] = await Promise.all([
      axios.get("http://127.0.0.1:8000/api/interviews/?is_archived=false"),
      axios.get("http://127.0.0.1:8000/api/interviews/?is_archived=true")
    ]);
    
    setInterviews(ensureArray(activeInterviews.data));
    setArchivedInterviews(ensureArray(archivedInterviews.data));
  } catch (err) {
    console.error("Error restoring interviews:", err);
    showToast("Failed to restore interviews", false);
  } finally {
    setLoading(false);
  }
};


// Also add the selected archived interviews state if you haven't already

  // Utility functions
  const filterAndPaginate = (data) => {
    // Safety check for empty/null data
    if (!data || !Array.isArray(data)) {
      return { paginated: [], totalPages: 0 };
    }

    // Filter based on search term
    let filtered = data;
    if (searchTerm) {
      filtered = data.filter(item => {
        if (!item) return false;
        // Check all properties that might be strings for a match
        return Object.entries(item).some(([key, value]) => {
          if (typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase())) {
            return true;
          }
          if (typeof value === 'number' && value.toString().includes(searchTerm)) {
            return true;
          }
          return false;
        });
      });
    }

    // Sort if needed
    if (sortField !== 'all') {
      filtered = [...filtered].sort((a, b) => {
        if (!a || !b) return 0;
        
        if (sortField === 'id') {
          const aId = a.job_id || a.candidate_id || a.interview_id || a.task_id || '';
          const bId = b.job_id || b.candidate_id || b.interview_id || b.task_id || '';
          return aId.toString().localeCompare(bId.toString());
        } else if (sortField === 'status') {
          const aStatus = a.posting_status || a.application_status || a.status || '';
          const bStatus = b.posting_status || b.application_status || b.status || '';
          return aStatus.toString().localeCompare(bStatus.toString());
        }
        return 0;
      });
    }

    // Paginate
    const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginated = filtered.slice(startIndex, startIndex + itemsPerPage);

    return { paginated, totalPages };
  };
  // Render functions for each table
const renderJobPostingsTable = (data, isArchived = false) => {
  if (loading) return <div className="recruitment-no-results">Loading job postings...</div>;
  
  // Safety check for data
  if (!data || !Array.isArray(data) || data.length === 0) {
    return <div className="recruitment-no-results">
      {isArchived ? "No archived job postings found." : "No job postings found."}
    </div>;
  }
  
  const { paginated, totalPages } = filterAndPaginate(data);
  
  if (!paginated || paginated.length === 0) {
    return <div className="recruitment-no-results">No matching job postings found with the current filters.</div>;
  }

  return (
    <>
      <div className="recruitment-table-wrapper">
        <div className="recruitment-table-scrollable">
          <table className="recruitment-table">
            <thead>
              <tr>
                {isArchived && <th>Select</th>}
                <th>Job ID</th>
                <th>Department ID</th>
                <th>Position ID</th>
                <th>Position Title</th>
                <th>Description</th>
                <th>Requirements</th>
                <th>Employment Type</th>
                <th>Base Salary</th>
                <th>Daily Rate</th>
                <th>Duration (Days)</th>
                <th>Finance Approval Status</th>
                <th>Posting Status</th>
                <th>Created At</th>
                <th>Updated At</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((posting, index) => (
                <tr key={posting.job_id || index} className={isArchived ? "recruitment-archived-row" : ""}>
                  {isArchived && (
                    <td>
                      <input 
                        type="checkbox" 
                        checked={selectedArchivedJobPostings.includes(posting.job_id)}
                        onChange={() => toggleSelectArchivedJobPosting(posting.job_id)}
                      />
                    </td>
                  )}
                  <td>{posting.job_id || '-'}</td>
                  <td>{posting.dept_id || '-'}</td>
                  <td>{posting.position_id || '-'}</td>
                  <td>{posting.position_title || '-'}</td>
                  <td>{posting.description || '-'}</td>
                  <td>{posting.requirements || '-'}</td>
                  <td>
                    <span className={`recruitment-tag ${(posting.employment_type?.toLowerCase() || 'unknown')}`}>
                      {posting.employment_type || 'Unknown'}
                    </span>
                  </td>
                  <td>{posting.base_salary || '-'}</td>
                  <td>{posting.daily_rate || '-'}</td>
                  <td>{posting.duration_days || '-'}</td>
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
                  <td>{formatDate(posting.created_at)}</td>
                  <td>{formatDate(posting.updated_at)}</td>
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
                    <td>{candidate.phone || '-'}</td>
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

// Function to render interviews table
const renderInterviewsTable = (data, isArchived = false) => {
  const { paginated, totalPages } = filterAndPaginate(data);
  
  if (loading) return <div className="recruitment-no-results">Loading interviews...</div>;
  if (!paginated.length) return <div className="recruitment-no-results">No interviews found.</div>;
  
  // Log the data to help debug
  console.log("Interview data in rendering function:", paginated);
  
  return (
    <>
      <div className="recruitment-table-wrapper">
        <div className="recruitment-table-scrollable">
          <table className="recruitment-table">
            <thead>
              <tr>
                {isArchived && <th>Select</th>}
                <th>Interview ID</th>
                <th>Candidate</th>
                <th>Candidate ID</th>
                <th>Job ID</th>
                <th>Interview Date</th>
                <th>Status</th>
                <th>Interviewer</th>
                <th>Interviewer ID</th>
                <th>Feedback</th>
                <th>Rating</th>
                <th>Created At</th>
                <th>Updated At</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((interview, index) => {
                // Extract date and time from interview_date if it exists
                const interviewDate = interview.interview_date ? 
                  new Date(interview.interview_date) : null;
                const formattedDate = interviewDate ? 
                  interviewDate.toLocaleDateString() : '-';
                const formattedTime = interviewDate ? 
                  interviewDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '-';
                
                // Get candidate name from candidates list if not already available
                let candidateName = interview.candidate_name;
                if (!candidateName && interview.candidate_id) {
                  const candidate = candidates.find(c => c.candidate_id === interview.candidate_id);
                  if (candidate) {
                    candidateName = `${candidate.first_name} ${candidate.last_name}`;
                  }
                }
                
                return (
                <tr key={interview.interview_id} className={isArchived ? "recruitment-archived-row" : ""}>
                  {isArchived && (
                    <td>
                      <input 
                        type="checkbox" 
                        checked={selectedArchivedInterviews.includes(interview.interview_id)}
                        onChange={() => toggleSelectArchivedInterview(interview.interview_id)}
                      />
                    </td>
                  )}
                  <td>{interview.interview_id}</td>
                  <td>{candidateName || 'Unknown'}</td>
                  <td>{interview.candidate_id}</td>
                  <td>{interview.job_id}</td>
                  <td>{formattedDate} {formattedTime}</td>
                  <td>
                    <span className={`recruitment-tag ${(interview.status || '').toLowerCase().replace(/\s+/g, '-')}`}>
                      {interview.status || 'Not Set'}
                    </span>
                  </td>
                  <td>{interview.interviewer_name || 'Unknown'}</td>
                  <td>{interview.interviewer_id}</td>
                  <td>{interview.feedback || '-'}</td>
                  <td>{interview.rating ? `${interview.rating}/5` : '-'}</td>
                  <td>{formatDate(interview.created_at)}</td>
                  <td>{formatDate(interview.updated_at)}</td>
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
                              onClick={() => handleEditInterview(interview)}
                            >
                              Edit
                            </div>
                            {!isArchived && (
                              <div 
                                className="recruitment-dropdown-item"
                                onClick={() => handleArchiveInterview(interview)}
                              >
                                Archive
                              </div>
                            )}
                            {isArchived && (
                              <div 
                                className="recruitment-dropdown-item"
                                onClick={() => handleRestoreInterview(interview)}
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
              )})}
            </tbody>
          </table>
        </div>
      </div>
      {isArchived && selectedArchivedInterviews.length > 0 && (
        <div className="recruitment-bulk-actions">
          <button 
            className="recruitment-bulk-action-btn" 
            onClick={bulkUnarchiveInterviews}
          >
            Restore Selected Interviews
          </button>
        </div>
      )}
      {renderPagination(totalPages)}
    </>
  );
};

  // Function to render onboarding tasks table
const renderOnboardingTable = (data, isArchived = false) => {
  const { paginated, totalPages } = filterAndPaginate(data);
  
  if (loading) return <div className="recruitment-no-results">Loading onboarding tasks...</div>;
  if (!paginated.length) return <div className="recruitment-no-results">No onboarding tasks found.</div>;
  
  // Log the data to help debug
  console.log("Onboarding data in rendering function:", paginated);
  
  return (
    <>
      <div className="recruitment-table-wrapper">
        <div className="recruitment-table-scrollable">
          <table className="recruitment-table">
            <thead>
              <tr>
                {isArchived && <th>Select</th>}
                <th>Onboarding ID</th>
                <th>Candidate</th>
                <th>Job</th>
                <th>Status</th>
                <th>Offer Details</th>
                <th>Contract Details</th>
                <th>Created At</th>
                <th>Updated At</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((task, index) => (
                <tr key={task.onboarding_id} className={isArchived ? "recruitment-archived-row" : ""}>
                  {isArchived && (
                    <td>
                      <input 
                        type="checkbox" 
                        checked={selectedArchivedOnboardingTasks.includes(task.onboarding_id)}
                        onChange={() => toggleSelectArchivedOnboardingTask(task.onboarding_id)}
                      />
                    </td>
                  )}
                  <td>{task.onboarding_id}</td>
                  <td>{task.candidate}</td>
                  <td>{task.job}</td>
                  <td>
                    <span className={`recruitment-tag ${task.status ? task.status.toLowerCase().replace(/\s+/g, '-') : 'unknown'}`}>
                      {task.status || 'Unknown'}
                    </span>
                  </td>
                  <td>{task.offer_details ? 
                      <button onClick={() => handleViewOfferDetails(task.offer_details)} className="recruitment-view-btn">View Details</button> : 
                      '-'}
                  </td>
                  <td>{task.contract_details ? 
                      <button onClick={() => handleViewContractDetails(task.contract_details)} className="recruitment-view-btn">View Details</button> : 
                      '-'}
                  </td>
                  <td>{formatDate(task.created_at)}</td>
                  <td>{formatDate(task.updated_at)}</td>
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
                              onClick={() => handleEditOnboardingTask(task)}
                            >
                              Edit
                            </div>
                            {!isArchived && (
                              <div 
                                className="recruitment-dropdown-item"
                                onClick={() => handleArchiveOnboardingTask(task)}
                              >
                                Archive
                              </div>
                            )}
                            {isArchived && (
                              <div 
                                className="recruitment-dropdown-item"
                                onClick={() => handleRestoreOnboardingTask(task)}
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
      {isArchived && selectedArchivedOnboardingTasks.length > 0 && (
        <div className="recruitment-bulk-actions">
          <button 
            className="recruitment-bulk-action-btn" 
            onClick={bulkUnarchiveOnboardingTasks}
          >
            Restore Selected Tasks
          </button>
        </div>
      )}
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
    setShowAddJobModal(true);
  } else if (activeTab === "Candidates") {
    handleAddCandidate();
  } else if (activeTab === "Interviews") {
    // Reset the new interview form values
    setNewInterview({
      candidate_id: "",
      interview_date: "",
      interview_time: "",
      interview_type: "Technical",
      interviewer_id: "",
      status: "Scheduled",
      notes: "",
      feedback: "",
      rating: null
    });
    setShowAddInterviewModal(true);
  } else if (activeTab === "Onboarding") {
    setNewOnboardingTask({
      candidate_id: "",
      job_id: "",
      status: "Pending",
      offer_details: {
        salary: "",
        start_date: "",
        benefits: ""
      },
      contract_details: {
        type: "",
        duration: "",
        terms: ""
      }
    });
    setShowAddOnboardingModal(true);
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
    const response = await axios.post("http://127.0.0.1:8000/api/job_posting/job_postings/", jobPostingData);
    showToast("Job posting created successfully!", true);
    
    // Refresh job postings and close modal
    const jobPostingsRes = await axios.get("http://127.0.0.1:8000/api/job_posting/job_postings/");
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
      "http://127.0.0.1:8000/api/candidates/candidates/",
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
    const candidatesRes = await axios.get("http://127.0.0.1:8000/api/candidates/candidates/");
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
        filename: uploadingFile.name,
        directory: directory,
        contentType: uploadingFile.type
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
      const candidateResponse = await axios.get(`http://127.0.0.1:8000/api/candidates/candidates/${currentCandidate.candidate_id || currentCandidate.id}/`);
      
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
        `http://127.0.0.1:8000/api/candidates/candidates/${currentCandidate.candidate_id || currentCandidate.id}/`, 
        { documents: JSON.stringify(documents) }
      );
      
      showToast("Document uploaded successfully", true);
      
      // Refresh candidates data
      const candidatesRes = await axios.get("http://127.0.0.1:8000/api/candidates/candidates/");
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

// Interview handlers
const handleInterviewChange = (e) => {
  const { name, value } = e.target;
  setNewInterview(prev => ({
    ...prev,
    [name]: value
  }));
};

const handleInterviewSubmit = async (e) => {
  e.preventDefault();
  try {
    setLoading(true);
    
    // Create a formatted interview object
    const interviewData = {
      candidate_id: newInterview.candidate_id,
      job_id: candidates.find(c => c.candidate_id === newInterview.candidate_id)?.job_id,
      interview_date: `${newInterview.interview_date}T${newInterview.interview_time || '00:00'}:00`,
      interviewer_id: newInterview.interviewer_id,
      status: newInterview.status || 'Scheduled',
      feedback: newInterview.notes || "",
      rating: 0 // Default to 0 for new interviews
    };
    
    console.log("Creating interview with data:", interviewData);
    
    // Submit to API
    const response = await axios.post(
      "http://127.0.0.1:8000/api/interviews/",
      interviewData
    );
    
    showToast("Interview scheduled successfully", true);
    setShowAddInterviewModal(false);
    
    // Refresh interviews list
    const [activeInterviews, archivedInterviews] = await Promise.all([
      axios.get("http://127.0.0.1:8000/api/interviews/?is_archived=false"),
      axios.get("http://127.0.0.1:8000/api/interviews/?is_archived=true")
    ]);
    
    setInterviews(ensureArray(activeInterviews.data));
    setArchivedInterviews(ensureArray(archivedInterviews.data));
    
  } catch (err) {
    console.error("Error scheduling interview:", err);
    const errorMessage = err.response?.data?.detail || 
                       Object.values(err.response?.data || {}).flat().join(", ") || 
                       "Failed to schedule interview";
    showToast(errorMessage, false);
  } finally {
    setLoading(false);
  }
};

// Onboarding task handlers
const handleOnboardingTaskChange = (e) => {
  const { name, value } = e.target;
  
  if (name.startsWith('offer_details.') || name.startsWith('contract_details.')) {
    const [objName, field] = name.split('.');
    setNewOnboardingTask(prev => ({
      ...prev,
      [objName]: {
        ...(prev[objName] || {}),
        [field]: value
      }
    }));
  } else {
    setNewOnboardingTask(prev => ({
      ...prev,
      [name]: value
    }));
  }
};

const handleEditOnboardingTaskChange = (e) => {
  const { name, value } = e.target;
  
  if (name.startsWith('offer_details.') || name.startsWith('contract_details.')) {
    const [objName, field] = name.split('.');
    setEditingOnboardingTask(prev => ({
      ...prev,
      [objName]: {
        ...(prev[objName] || {}),
        [field]: value
      }
    }));
  } else {
    setEditingOnboardingTask(prev => ({
      ...prev,
      [name]: value
    }));
  }
};

const handleOnboardingTaskSubmit = async (e) => {
  e.preventDefault();
  try {
    setLoading(true);
    
    // Format data for API
    const onboardingData = {
      candidate: newOnboardingTask.candidate_id,
      job: newOnboardingTask.job_id,
      offer_details: newOnboardingTask.offer_details || {},
      contract_details: newOnboardingTask.contract_details || {},
      status: newOnboardingTask.status || 'Pending'
    };
    
    // Submit to API
    const response = await axios.post(
      "http://127.0.0.1:8000/api/onboarding/",
      onboardingData
    );
    
    showToast("Onboarding task created successfully", true);
    setShowAddOnboardingModal(false);
    
    // Refresh onboarding tasks list
    const onboardingRes = await axios.get("http://127.0.0.1:8000/api/onboarding/");
    setOnboardingTasks(ensureArray(onboardingRes.data));
    
  } catch (err) {
    console.error("Error creating onboarding task:", err);
    const errorMessage = err.response?.data?.detail || 
                       Object.values(err.response?.data || {}).flat().join(", ") || 
                       "Failed to create onboarding task";
    showToast(errorMessage, false);
  } finally {
    setLoading(false);
  }
};

const handleEditOnboardingTaskSubmit = async (e) => {
  e.preventDefault();
  try {
    setLoading(true);
    
    // Format data for API
    const onboardingData = {
      candidate: editingOnboardingTask.candidate,
      job: editingOnboardingTask.job,
      offer_details: editingOnboardingTask.offer_details || {},
      contract_details: editingOnboardingTask.contract_details || {},
      status: editingOnboardingTask.status || 'Pending'
    };
    
    // Submit to API
    const response = await axios.patch(
      `http://127.0.0.1:8000/api/onboarding/${editingOnboardingTask.onboarding_id}/`,
      onboardingData
    );
    
    showToast("Onboarding task updated successfully", true);
    setShowEditOnboardingModal(false);
    
    // Refresh onboarding tasks list
    const onboardingRes = await axios.get("http://127.0.0.1:8000/api/onboarding/");
    setOnboardingTasks(ensureArray(onboardingRes.data));
    
  } catch (err) {
    console.error("Error updating onboarding task:", err);
    const errorMessage = err.response?.data?.detail || 
                       Object.values(err.response?.data || {}).flat().join(", ") || 
                       "Failed to update onboarding task";
    showToast(errorMessage, false);
  } finally {
    setLoading(false);
  }
};

const handleArchiveOnboardingTask = async (task) => {
  try {
    await axios.post(`http://127.0.0.1:8000/api/onboarding/${task.onboarding_id}/archive/`);
    showToast("Onboarding task archived successfully", true);
    
    // Refresh onboarding task lists
    const onboardingRes = await axios.get("http://127.0.0.1:8000/api/onboarding/");
    setOnboardingTasks(ensureArray(onboardingRes.data));
    
    // Also fetch archived tasks if available
    try {
      const archivedOnboardingRes = await axios.get("http://127.0.0.1:8000/api/onboarding/?is_archived=true");
      setArchivedOnboardingTasks(ensureArray(archivedOnboardingRes.data));
    } catch (err) {
      console.error("Error fetching archived onboarding tasks:", err);
    }
  } catch (err) {
    console.error("Error archiving onboarding task:", err);
    showToast("Failed to archive onboarding task", false);
  }
};

const handleRestoreOnboardingTask = async (task) => {
  try {
    await axios.post(`http://127.0.0.1:8000/api/onboarding/${task.onboarding_id}/unarchive/`);
    showToast("Onboarding task restored successfully", true);
    
    // Refresh onboarding task lists
    const onboardingRes = await axios.get("http://127.0.0.1:8000/api/onboarding/");
    setOnboardingTasks(ensureArray(onboardingRes.data));
    
    // Also fetch archived tasks if available
    try {
      const archivedOnboardingRes = await axios.get("http://127.0.0.1:8000/api/onboarding/?is_archived=true");
      setArchivedOnboardingTasks(ensureArray(archivedOnboardingRes.data));
    } catch (err) {
      console.error("Error fetching archived onboarding tasks:", err);
    }
  } catch (err) {
    console.error("Error restoring onboarding task:", err);
    showToast("Failed to restore onboarding task", false);
  }
};

const bulkUnarchiveOnboardingTasks = async () => {
  try {
    setLoading(true);
    
    // Create an array of promises for each selected onboarding task
    const promises = selectedArchivedOnboardingTasks.map(id => 
      axios.post(`http://127.0.0.1:8000/api/onboarding/${id}/unarchive/`)
    );
    
    // Execute all promises
    await Promise.all(promises);
    
    // Show success message
    showToast("Selected onboarding tasks restored successfully", true);
    
    // Reset selection
    setSelectedArchivedOnboardingTasks([]);
    
    // Refresh onboarding task lists
    const onboardingRes = await axios.get("http://127.0.0.1:8000/api/onboarding/");
    setOnboardingTasks(ensureArray(onboardingRes.data));
    
    // Also fetch archived tasks if available
    try {
      const archivedOnboardingRes = await axios.get("http://127.0.0.1:8000/api/onboarding/?is_archived=true");
      setArchivedOnboardingTasks(ensureArray(archivedOnboardingRes.data));
    } catch (err) {
      console.error("Error fetching archived onboarding tasks:", err);
    }
  } catch (err) {
    console.error("Error restoring onboarding tasks:", err);
    showToast("Failed to restore onboarding tasks", false);
  } finally {
    setLoading(false);
  }
};

const handleEditOnboardingTask = (task) => {
  setEditingOnboardingTask({
    onboarding_id: task.onboarding_id,
    candidate: task.candidate_id,
    job: task.job_id,
    candidate_name: task.candidate,
    job_title: task.job,
    offer_details: task.offer_details || {},
    contract_details: task.contract_details || {},
    status: task.status || 'Pending',
  });
  setShowEditOnboardingModal(true);
  setDotsMenuOpen(null);
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
              
              {activeTab === "Interviews" && (
                <button className="recruitment-add-btn" onClick={handleAddClick}>
                  <FiPlus className="icon" /> Add Interview
                </button>
              )}
              {activeTab === "Onboarding" && (
                <button className="recruitment-add-btn" onClick={handleAddClick}>
                  <FiPlus className="icon" /> Add Onboarding
                </button>
              )}
              {activeTab !== "Job Postings" && (
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
                className={activeTab === "Interviews" ? "active" : ""}
                onClick={() => {
                  setActiveTab("Interviews");
                  setShowArchived(false);
                  setCurrentPage(1);
                }}
              >
                Interviews <span className="recruitment-count">{interviews.length}</span>
              </button>
              <button
                className={activeTab === "Onboarding" ? "active" : ""}
                onClick={() => {
                  setActiveTab("Onboarding");
                  setShowArchived(false);
                  setCurrentPage(1);
                }}
              >
                Onboarding <span className="recruitment-count">{onboardingTasks.length}</span>
              </button>
            </div>
          </div>

          <div className="recruitment-table-container">
            {activeTab === "Candidates" && renderCandidatesTable(showArchived ? archivedCandidates : candidates, showArchived)}
            {activeTab === "Job Postings" && renderJobPostingsTable(showArchived ? archivedJobPostings : jobPostings, showArchived)}
            {activeTab === "Interviews" && (
              <>
                {renderInterviewsTable(showArchived ? archivedInterviews : interviews, showArchived)}
              </>
            )}
            {activeTab === "Onboarding" && renderOnboardingTable(showArchived ? archivedOnboardingTasks : onboardingTasks, showArchived)}
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

      {/* Interview Add Modal */}
      {showAddInterviewModal && (
        <div className="recruitment-modal-overlay">
          <div className="recruitment-modal">
            <h3>Schedule New Interview</h3>
            <form onSubmit={handleInterviewSubmit} className="recruitment-form">
              <div className="recruitment-form-two-columns">
                <div className="form-column">
                  <div className="form-group">
                    <label>Candidate *</label>
                    <select 
                      name="candidate_id" 
                      value={newInterview.candidate_id} 
                      onChange={handleInterviewChange}
                      required
                    >
                      <option value="">-- Select Candidate --</option>
                      {candidates.map(candidate => (
                        <option key={candidate.candidate_id} value={candidate.candidate_id}>
                          {candidate.first_name} {candidate.last_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Interview Date *</label>
                    <input 
                      type="date" 
                      name="interview_date" 
                      value={newInterview.interview_date} 
                      onChange={handleInterviewChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Interview Time *</label>
                    <input 
                      type="time" 
                      name="interview_time" 
                      value={newInterview.interview_time} 
                      onChange={handleInterviewChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-column">
                  <div className="form-group">
                    <label>Interviewer *</label>
                    <select
                      name="interviewer_id"
                      value={newInterview.interviewer_id}
                      onChange={handleInterviewChange}
                      required
                    >
                      <option value="">-- Select Interviewer --</option>
                      {employees.map(emp => (
                        <option key={emp.employee_id} value={emp.employee_id}>
                          {emp.first_name} {emp.last_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      name="status"
                      value={newInterview.status}
                      onChange={handleInterviewChange}
                    >
                      <option value="Scheduled">Scheduled</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                      <option value="Rescheduled">Rescheduled</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-group full-width">
                  <label>Notes</label>
                  <textarea
                    name="notes"
                    value={newInterview.notes || ""}
                    onChange={handleInterviewChange}
                    placeholder="Additional notes about the interview..."
                  />
                </div>
              </div>
              
              <div className="recruitment-modal-buttons">
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? "Scheduling..." : "Schedule Interview"}
                </button>
                <button 
                  type="button" 
                  className="cancel-btn" 
                  onClick={() => setShowAddInterviewModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
{/* Edit Interview Modal */}
{showEditInterviewModal && editingInterview && (
  <div className="recruitment-modal-overlay">
    <div className="recruitment-modal">
      <h3>Edit Interview</h3>
      <form onSubmit={handleEditInterviewSubmit} className="recruitment-form">
        <div className="recruitment-form-two-columns">
          <div className="form-column">
            <div className="form-group">
              <label>Candidate *</label>
              <select 
                name="candidate" 
                value={editingInterview.candidate || ""} 
                onChange={(e) => setEditingInterview({...editingInterview, candidate: e.target.value})}
                required
              >
                <option value="">-- Select Candidate --</option>
                {candidates.map(candidate => (
                  <option key={candidate.candidate_id} value={candidate.candidate_id}>
                    {candidate.first_name} {candidate.last_name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Interview Date *</label>
              <input 
                type="date" 
                name="interview_date" 
                value={editingInterview.interview_date ? editingInterview.interview_date.split('T')[0] : ""} 
                onChange={(e) => setEditingInterview({...editingInterview, interview_date: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Interview Time *</label>
              <input 
                type="time" 
                name="interview_time" 
                value={editingInterview.interview_time || (editingInterview.interview_date && editingInterview.interview_date.includes('T') ? 
                  editingInterview.interview_date.split('T')[1].substring(0, 5) : "")} 
                onChange={(e) => setEditingInterview({...editingInterview, interview_time: e.target.value})}
                required
              />
            </div>
          </div>
          
          <div className="form-column">
            <div className="form-group">
              <label>Interviewer *</label>
              <select
                name="interviewer"
                value={editingInterview.interviewer || ""}
                onChange={(e) => setEditingInterview({...editingInterview, interviewer: e.target.value})}
                required
              >
                <option value="">-- Select Interviewer --</option>
                {employees.map(emp => (
                  <option key={emp.employee_id} value={emp.employee_id}>
                    {emp.first_name} {emp.last_name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Status</label>
              <select
                name="status"
                value={editingInterview.status}
                onChange={(e) => setEditingInterview({...editingInterview, status: e.target.value})}
              >
                <option value="Scheduled">Scheduled</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Rescheduled">Rescheduled</option>
              </select>
            </div>
          </div>
          
          <div className="form-group full-width">
            <label>Feedback</label>
            <textarea
              name="feedback"
              value={editingInterview.feedback || ""}
              onChange={(e) => setEditingInterview({...editingInterview, feedback: e.target.value})}
              placeholder="Detailed feedback on the interview..."
            />
          </div>
          
          <div className="form-group">
            <label>Rating (1-5)</label>
            <input 
              type="number" 
              name="rating" 
              value={editingInterview.rating || ""} 
              onChange={(e) => setEditingInterview({...editingInterview, rating: e.target.value})}
              min="1"
              max="5"
            />
          </div>
        </div>
        
        <div className="recruitment-modal-buttons">
          <button type="submit" className="submit-btn">Save Changes</button>
          <button 
            type="button" 
            className="cancel-btn" 
            onClick={() => setShowEditInterviewModal(false)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
)}
      {/* Onboarding Add Modal */}
      {showAddOnboardingModal && (
        <div className="recruitment-modal-overlay">
          <div className="recruitment-modal">
            <h3>Create Onboarding Task</h3>
            <form onSubmit={handleOnboardingTaskSubmit} className="recruitment-form">
              <div className="recruitment-form-two-columns">
                <div className="form-column">
                  <div className="form-group">
                    <label>Candidate *</label>
                    <select 
                      name="candidate_id" 
                      value={newOnboardingTask.candidate_id || ""} 
                      onChange={handleOnboardingTaskChange}
                      required
                    >
                      <option value="">-- Select Candidate --</option>
                      {candidates.map(candidate => (
                        <option key={candidate.candidate_id} value={candidate.candidate_id}>
                          {candidate.first_name} {candidate.last_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Job *</label>
                    <select 
                      name="job_id" 
                      value={newOnboardingTask.job_id || ""} 
                      onChange={handleOnboardingTaskChange}
                      required
                    >
                      <option value="">-- Select Job --</option>
                      {jobPostings.map(job => (
                        <option key={job.job_id} value={job.job_id}>
                          {job.position_title}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      name="status"
                      value={newOnboardingTask.status || "Pending"}
                      onChange={handleOnboardingTaskChange}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                      <option value="Offer Pending">Offer Pending</option>
                      <option value="Offer Sent">Offer Sent</option>
                      <option value="Offer Accepted">Offer Accepted</option>
                      <option value="Offer Rejected">Offer Rejected</option>
                      <option value="Contract Pending">Contract Pending</option>
                      <option value="Contract Signed">Contract Signed</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-column">
                  <h4>Offer Details</h4>
                  <div className="form-group">
                    <label>Salary</label>
                    <input 
                      type="text" 
                      name="offer_details.salary" 
                      value={newOnboardingTask.offer_details?.salary || ""} 
                      onChange={handleOnboardingTaskChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Start Date</label>
                    <input 
                      type="date" 
                      name="offer_details.start_date" 
                      value={newOnboardingTask.offer_details?.start_date || ""} 
                      onChange={handleOnboardingTaskChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Benefits</label>
                    <input 
                      type="text" 
                      name="offer_details.benefits" 
                      value={newOnboardingTask.offer_details?.benefits || ""} 
                      onChange={handleOnboardingTaskChange}
                    />
                  </div>
                </div>
                
                <div className="form-column full-width">
                  <h4>Contract Details</h4>
                  <div className="form-group">
                    <label>Contract Type</label>
                    <select
                      name="contract_details.type"
                      value={newOnboardingTask.contract_details?.type || ""}
                      onChange={handleOnboardingTaskChange}
                    >
                      <option value="">-- Select Contract Type --</option>
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contractual">Contractual</option>
                      <option value="Seasonal">Seasonal</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Duration (months)</label>
                    <input 
                      type="number" 
                      name="contract_details.duration" 
                      value={newOnboardingTask.contract_details?.duration || ""} 
                      onChange={handleOnboardingTaskChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Additional Terms</label>
                    <textarea
                      name="contract_details.terms"
                      value={newOnboardingTask.contract_details?.terms || ""}
                      onChange={handleOnboardingTaskChange}
                    />
                  </div>
                </div>
              </div>
              
              <div className="recruitment-modal-buttons">
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? "Creating..." : "Create Onboarding Task"}
                </button>
                <button 
                  type="button" 
                  className="cancel-btn" 
                  onClick={() => setShowAddOnboardingModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Onboarding Modal */}
      {showEditOnboardingModal && editingOnboardingTask && (
        <div className="recruitment-modal-overlay">
          <div className="recruitment-modal">
            <h3>Edit Onboarding Task</h3>
            <form onSubmit={handleEditOnboardingTaskSubmit} className="recruitment-form">
              <div className="recruitment-form-two-columns">
                <div className="form-column">
                  <div className="form-group">
                    <label>Candidate *</label>
                    <select 
                      name="candidate" 
                      value={editingOnboardingTask.candidate || ""} 
                      onChange={handleEditOnboardingTaskChange}
                      required
                    >
                      <option value="">-- Select Candidate --</option>
                      {candidates.map(candidate => (
                        <option key={candidate.candidate_id} value={candidate.candidate_id}>
                          {candidate.first_name} {candidate.last_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Job *</label>
                    <select 
                      name="job" 
                      value={editingOnboardingTask.job || ""} 
                      onChange={handleEditOnboardingTaskChange}
                      required
                    >
                      <option value="">-- Select Job --</option>
                      {jobPostings.map(job => (
                        <option key={job.job_id} value={job.job_id}>
                          {job.position_title}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      name="status"
                      value={editingOnboardingTask.status || "Pending"}
                      onChange={handleEditOnboardingTaskChange}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                      <option value="Offer Pending">Offer Pending</option>
                      <option value="Offer Sent">Offer Sent</option>
                      <option value="Offer Accepted">Offer Accepted</option>
                      <option value="Offer Rejected">Offer Rejected</option>
                      <option value="Contract Pending">Contract Pending</option>
                      <option value="Contract Signed">Contract Signed</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-column">
                  <h4>Offer Details</h4>
                  <div className="form-group">
                    <label>Salary</label>
                    <input 
                      type="text" 
                      name="offer_details.salary" 
                      value={editingOnboardingTask.offer_details?.salary || ""} 
                      onChange={handleEditOnboardingTaskChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Start Date</label>
                    <input 
                      type="date" 
                      name="offer_details.start_date" 
                      value={editingOnboardingTask.offer_details?.start_date || ""} 
                      onChange={handleEditOnboardingTaskChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Benefits</label>
                    <input 
                      type="text" 
                      name="offer_details.benefits" 
                      value={editingOnboardingTask.offer_details?.benefits || ""} 
                      onChange={handleEditOnboardingTaskChange}
                    />
                  </div>
                </div>
                
                <div className="form-column full-width">
                  <h4>Contract Details</h4>
                  <div className="form-group">
                    <label>Contract Type</label>
                    <select
                      name="contract_details.type"
                      value={editingOnboardingTask.contract_details?.type || ""}
                      onChange={handleEditOnboardingTaskChange}
                    >
                      <option value="">-- Select Contract Type --</option>
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contractual">Contractual</option>
                      <option value="Seasonal">Seasonal</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Duration (months)</label>
                    <input 
                      type="number" 
                      name="contract_details.duration" 
                      value={editingOnboardingTask.contract_details?.duration || ""} 
                      onChange={handleEditOnboardingTaskChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Additional Terms</label>
                    <textarea
                      name="contract_details.terms"
                      value={editingOnboardingTask.contract_details?.terms || ""}
                      onChange={handleEditOnboardingTaskChange}
                    />
                  </div>
                </div>
              </div>
              
              <div className="recruitment-modal-buttons">
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </button>
                <button 
                  type="button" 
                  className="cancel-btn" 
                  onClick={() => setShowEditOnboardingModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add/Create Onboarding Modal */}
      {showAddOnboardingModal && (
        <div className="recruitment-modal-overlay">
          <div className="recruitment-modal">
            <h3>Create Onboarding Task</h3>
            <form onSubmit={handleOnboardingTaskSubmit} className="recruitment-form">
              <div className="recruitment-form-two-columns">
                <div className="form-column">
                  <div className="form-group">
                    <label>Candidate *</label>
                    <select 
                      name="candidate_id" 
                      value={newOnboardingTask.candidate_id || ""} 
                      onChange={handleOnboardingTaskChange}
                      required
                    >
                      <option value="">-- Select Candidate --</option>
                      {candidates.map(candidate => (
                        <option key={candidate.candidate_id} value={candidate.candidate_id}>
                          {candidate.first_name} {candidate.last_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Job *</label>
                    <select 
                      name="job_id" 
                      value={newOnboardingTask.job_id || ""} 
                      onChange={handleOnboardingTaskChange}
                      required
                    >
                      <option value="">-- Select Job --</option>
                      {jobPostings.map(job => (
                        <option key={job.job_id} value={job.job_id}>
                          {job.position_title}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      name="status"
                      value={newOnboardingTask.status || "Pending"}
                      onChange={handleOnboardingTaskChange}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                      <option value="Offer Pending">Offer Pending</option>
                      <option value="Offer Sent">Offer Sent</option>
                      <option value="Offer Accepted">Offer Accepted</option>
                      <option value="Offer Rejected">Offer Rejected</option>
                      <option value="Contract Pending">Contract Pending</option>
                      <option value="Contract Signed">Contract Signed</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-column">
                  <h4>Offer Details</h4>
                  <div className="form-group">
                    <label>Salary</label>
                    <input 
                      type="text" 
                      name="offer_details.salary" 
                      value={newOnboardingTask.offer_details?.salary || ""} 
                      onChange={handleOnboardingTaskChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Start Date</label>
                    <input 
                      type="date" 
                      name="offer_details.start_date" 
                      value={newOnboardingTask.offer_details?.start_date || ""} 
                      onChange={handleOnboardingTaskChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Benefits</label>
                    <input 
                      type="text" 
                      name="offer_details.benefits" 
                      value={newOnboardingTask.offer_details?.benefits || ""} 
                      onChange={handleOnboardingTaskChange}
                    />
                  </div>
                </div>
                
                <div className="form-column full-width">
                  <h4>Contract Details</h4>
                  <div className="form-group">
                    <label>Contract Type</label>
                    <select
                      name="contract_details.type"
                      value={newOnboardingTask.contract_details?.type || ""}
                      onChange={handleOnboardingTaskChange}
                    >
                      <option value="">-- Select Contract Type --</option>
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contractual">Contractual</option>
                      <option value="Seasonal">Seasonal</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Duration (months)</label>
                    <input 
                      type="number" 
                      name="contract_details.duration" 
                      value={newOnboardingTask.contract_details?.duration || ""} 
                      onChange={handleOnboardingTaskChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Additional Terms</label>
                    <textarea
                      name="contract_details.terms"
                      value={newOnboardingTask.contract_details?.terms || ""}
                      onChange={handleOnboardingTaskChange}
                    />
                  </div>
                </div>
              </div>
              
              <div className="recruitment-modal-buttons">
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? "Creating..." : "Create Onboarding Task"}
                </button>
                <button 
                  type="button" 
                  className="cancel-btn" 
                  onClick={() => setShowAddOnboardingModal(false)}
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