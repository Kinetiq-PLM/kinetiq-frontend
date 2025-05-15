import React, { useState, useEffect, useCallback, useRef } from "react";
import "../styles/Project List.css";
import axios from 'axios';
axios.defaults.baseURL = 'https://hp0w1llp43.execute-api.ap-southeast-1.amazonaws.com/dev';

// Custom hook for debouncing values
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
};

// Retry mechanism for API calls
const fetchWithRetry = async (fetchFunction, maxRetries = 2) => {
  let retries = 0;
  while (retries < maxRetries) {
    try {
      return await fetchFunction();
    } catch (error) {
      retries++;
      if (retries === maxRetries) throw error;
      // Exponential backoff: wait longer between each retry
      await new Promise(resolve => setTimeout(resolve, 1000 * retries));
    }
  }
};

const ProjectList = () => {
  const [selectedNav, setSelectedNav] = useState("Internal Request");
  const [selectedNavdetails, setSelectedNavdetails] = useState("Internal Details");
  const [selectedRequests, setSelectedRequests] = useState([]);
  const [showProjectRequestList, setShowProjectRequestList] = useState(true);

  // State for data
  const [internalRequests, setInternalRequests] = useState([]);
  const [externalRequests, setExternalRequests] = useState([]);
  const [internalDetails, setInternalDetails] = useState([]);
  const [externalDetails, setExternalDetails] = useState([]);
  const [error, setError] = useState(null);
  
  // Pagination state
  const [internalRequestsPage, setInternalRequestsPage] = useState(1);
  const [externalRequestsPage, setExternalRequestsPage] = useState(1);
  const [internalDetailsPage, setInternalDetailsPage] = useState(1);
  const [externalDetailsPage, setExternalDetailsPage] = useState(1);
  const [internalRequestsPagination, setInternalRequestsPagination] = useState({});
  const [externalRequestsPagination, setExternalRequestsPagination] = useState({});
  const [internalDetailsPagination, setInternalDetailsPagination] = useState({});
  const [externalDetailsPagination, setExternalDetailsPagination] = useState({});
  
  // Filter state
  const [showFilter, setShowFilter] = useState(false);
  const [internalFilters, setInternalFilters] = useState({
    project_name: '',
    approval_id: '',
    employee_id: '',
    dept_id: '',
    status: ''
  });
  const [externalFilters, setExternalFilters] = useState({
    project_name: '',
    approval_id: '',
    item_id: '',
    status: ''
  });
  
  // Refs for filter inputs
  const projectNameInputRef = useRef(null);
  const approvalIdInputRef = useRef(null);
  const employeeIdInputRef = useRef(null);
  const deptIdInputRef = useRef(null);
  const statusSelectRef = useRef(null);
  const externalProjectNameInputRef = useRef(null);
  const externalApprovalIdInputRef = useRef(null);
  const itemIdInputRef = useRef(null);
  const externalStatusSelectRef = useRef(null);
  
  // Debounced filters for automatic searching
  const debouncedInternalFilters = useDebounce(internalFilters, 500);
  const debouncedExternalFilters = useDebounce(externalFilters, 500);
  
  // Loading states for individual data types
  const [loadingStates, setLoadingStates] = useState({
    internalRequests: false,
    externalRequests: false,
    internalDetails: false,
    externalDetails: false,
    archivedInternal: false,
    archivedExternal: false
  });

  // New state for archived projects
  const [showArchivedProjects, setShowArchivedProjects] = useState(false);
  const [archivedNav, setArchivedNav] = useState("Internal Archived");
  const [archivedInternalRequests, setArchivedInternalRequests] = useState([]);
  const [archivedExternalRequests, setArchivedExternalRequests] = useState([]);
  const [archivedInternalPage, setArchivedInternalPage] = useState(1);
  const [archivedExternalPage, setArchivedExternalPage] = useState(1);
  const [archivedInternalPagination, setArchivedInternalPagination] = useState({});
  const [archivedExternalPagination, setArchivedExternalPagination] = useState({});
  const [selectedArchivedRequests, setSelectedArchivedRequests] = useState([]);

  // Add notification state
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: 'success' // or 'error'
  });

  // API base URL
  const API_URL = '/api/project-management';

  // Helper function to determine status class for status dots
  const getStatusClass = (status) => {
    if (!status) return 'pending';
    
    status = status.toLowerCase();
    if (status === 'approved') return 'approved';
    if (status === 'rejected' || status === 'not approved') return 'not-approved';
    if (status === 'ongoing') return 'ongoing';
    if (status === 'pending') return 'pending';
    if (status === 'completed') return 'approved'; // Treat completed as approved
    
    return 'pending'; // Default
  };

  // Function to show notification
  const showNotification = (message, type = 'success') => {
    setNotification({
      show: true,
      message,
      type
    });
    
    // Auto-hide notification after 3 seconds
    setTimeout(() => {
      setNotification(prev => ({...prev, show: false}));
    }, 3000);
  };

  // Function to close notification
  const closeNotification = () => {
    setNotification(prev => ({...prev, show: false}));
  };

  // Helper to build query string from filters
  const buildQueryString = (filters) => {
    return Object.entries(filters)
      .filter(([_, value]) => value)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');
  };

  // Fetch data from API with pagination and filters
  const fetchInternalRequests = useCallback(async (page = 1) => {
    setLoadingStates(prev => ({ ...prev, internalRequests: true }));
    try {
      return await fetchWithRetry(async () => {
        const queryString = buildQueryString(internalFilters);
        const url = `${API_URL}/internal-requests/?page=${page}${queryString ? '&' + queryString : ''}`;
        
        console.log("Fetching internal requests with URL:", url);
        
        const response = await axios.get(url);
        setInternalRequests(response.data.results || []);
        setInternalRequestsPagination({
          count: response.data.count,
          next: response.data.next,
          previous: response.data.previous,
          total_pages: response.data.total_pages || Math.ceil(response.data.count / 10),
          current_page: response.data.current_page || page
        });
        setInternalRequestsPage(page);
        return true;
      });
    } catch (err) {
      console.error('Error loading internal requests:', err);
      if (err.response && err.response.status === 404) {
        setInternalRequestsPage(1);
        return fetchInternalRequests(1);
      }
      showNotification('Failed to load internal requests', 'error');
      return false;
    } finally {
      setLoadingStates(prev => ({ ...prev, internalRequests: false }));
    }
  }, [internalFilters]);
  
  const fetchExternalRequests = useCallback(async (page = 1) => {
    setLoadingStates(prev => ({ ...prev, externalRequests: true }));
    try {
      return await fetchWithRetry(async () => {
        const queryString = buildQueryString(externalFilters);
        const url = `${API_URL}/external-requests/?page=${page}${queryString ? '&' + queryString : ''}`;
        
        console.log("Fetching external requests with URL:", url); // Debug log
        
        const response = await axios.get(url);
        setExternalRequests(response.data.results || []);
        setExternalRequestsPagination({
          count: response.data.count,
          next: response.data.next,
          previous: response.data.previous,
          total_pages: response.data.total_pages || Math.ceil(response.data.count / 10),
          current_page: response.data.current_page || page
        });
        setExternalRequestsPage(page);
        return true;
      });
    } catch (err) {
      console.error('Error loading external requests:', err);
      if (err.response && err.response.status === 404) {
        setExternalRequestsPage(1);
        return fetchExternalRequests(1);
      }
      showNotification('Failed to load external requests', 'error');
      return false;
    } finally {
      setLoadingStates(prev => ({ ...prev, externalRequests: false }));
    }
  }, [externalFilters]);

  const fetchInternalDetails = useCallback(async (page = 1) => {
    setLoadingStates(prev => ({ ...prev, internalDetails: true }));
    try {
      return await fetchWithRetry(async () => {
        const response = await axios.get(`${API_URL}/internal-projects/?page=${page}`);
        setInternalDetails(response.data.results || []);
        setInternalDetailsPagination({
          count: response.data.count,
          next: response.data.next,
          previous: response.data.previous,
          total_pages: response.data.total_pages || Math.ceil(response.data.count / 10),
          current_page: response.data.current_page || page
        });
        setInternalDetailsPage(page);
        return true;
      });
    } catch (err) {
      console.error('Error loading internal details:', err);
      if (err.response && err.response.status === 404) {
        setInternalDetailsPage(1);
        return fetchInternalDetails(1);
      }
      showNotification('Failed to load internal project details', 'error');
      return false;
    } finally {
      setLoadingStates(prev => ({ ...prev, internalDetails: false }));
    }
  }, []);

  const fetchExternalDetails = useCallback(async (page = 1) => {
    setLoadingStates(prev => ({ ...prev, externalDetails: true }));
    try {
      return await fetchWithRetry(async () => {
        const response = await axios.get(`${API_URL}/external-projects/?page=${page}`);
        setExternalDetails(response.data.results || []);
        setExternalDetailsPagination({
          count: response.data.count,
          next: response.data.next,
          previous: response.data.previous,
          total_pages: response.data.total_pages || Math.ceil(response.data.count / 10),
          current_page: response.data.current_page || page
        });
        setExternalDetailsPage(page);
        return true;
      });
    } catch (err) {
      console.error('Error loading external details:', err);
      if (err.response && err.response.status === 404) {
        setExternalDetailsPage(1);
        return fetchExternalDetails(1);
      }
      showNotification('Failed to load external project details', 'error');
      return false;
    } finally {
      setLoadingStates(prev => ({ ...prev, externalDetails: false }));
    }
  }, []);

  // New functions for archived data
  const fetchArchivedInternalRequests = useCallback(async (page = 1) => {
    setLoadingStates(prev => ({ ...prev, archivedInternal: true }));
    try {
      return await fetchWithRetry(async () => {
        const response = await axios.get(`${API_URL}/archived-projects/internal_requests/?page=${page}`);
        // Always clear previous state before setting new data
        setArchivedInternalRequests([]);
        setArchivedInternalRequests(response.data.results || []);
        setArchivedInternalPagination({
          count: response.data.count,
          next: response.data.next,
          previous: response.data.previous,
          total_pages: response.data.total_pages || Math.ceil(response.data.count / 10),
          current_page: response.data.current_page || page
        });
        setArchivedInternalPage(page);
        console.log('[DEBUG] Archived Internal Requests IDs:', (response.data.results || []).map(r => r.project_request_id));
        return true;
      });
    } catch (err) {
      console.error('Error loading archived internal requests:', err);
      if (err.response && err.response.status === 404) {
        setArchivedInternalPage(1);
        return fetchArchivedInternalRequests(1);
      }
      showNotification('Failed to load archived internal requests', 'error');
      return false;
    } finally {
      setLoadingStates(prev => ({ ...prev, archivedInternal: false }));
    }
  }, []);

  const fetchArchivedExternalRequests = useCallback(async (page = 1) => {
    setLoadingStates(prev => ({ ...prev, archivedExternal: true }));
    try {
      return await fetchWithRetry(async () => {
        const response = await axios.get(`${API_URL}/archived-projects/external_requests/?page=${page}`);
        // Always clear previous state before setting new data
        setArchivedExternalRequests([]);
        setArchivedExternalRequests(response.data.results || []);
        setArchivedExternalPagination({
          count: response.data.count,
          next: response.data.next,
          previous: response.data.previous,
          total_pages: response.data.total_pages || Math.ceil(response.data.count / 10),
          current_page: response.data.current_page || page
        });
        setArchivedExternalPage(page);
        console.log('[DEBUG] Archived External Requests IDs:', (response.data.results || []).map(r => r.ext_project_request_id));
        return true;
      });
    } catch (err) {
      console.error('Error loading archived external requests:', err);
      if (err.response && err.response.status === 404) {
        setArchivedExternalPage(1);
        return fetchArchivedExternalRequests(1);
      }
      showNotification('Failed to load archived external requests', 'error');
      return false;
    } finally {
      setLoadingStates(prev => ({ ...prev, archivedExternal: false }));
    }
  }, []);

  // Effect for applying debounced filters
  useEffect(() => {
    if (selectedNav === "Internal Request" && !showArchivedProjects) {
      fetchInternalRequests(1);
    }
  }, [debouncedInternalFilters, fetchInternalRequests, selectedNav, showArchivedProjects]);

  useEffect(() => {
    if (selectedNav === "External Request" && !showArchivedProjects) {
      fetchExternalRequests(1);
    }
  }, [debouncedExternalFilters, fetchExternalRequests, selectedNav, showArchivedProjects]);

  // Initial data loading
  useEffect(() => {
    const loadInitialData = async () => {
      setError(null);
      
      // Load data based on current view
      if (showProjectRequestList) {
        if (showArchivedProjects) {
          if (archivedNav === "Internal Archived") {
            fetchArchivedInternalRequests();
            // Preload external archived in background for faster switching
            fetchArchivedExternalRequests();
          } else {
            fetchArchivedExternalRequests();
            // Preload internal archived in background for faster switching
            fetchArchivedInternalRequests();
          }
        } else {
          if (selectedNav === "Internal Request") {
            fetchInternalRequests();
            // Preload external in background for faster switching
            fetchExternalRequests();
          } else {
            fetchExternalRequests();
            // Preload internal in background for faster switching
            fetchInternalRequests();
          }
        }
      } else {
        if (selectedNavdetails === "Internal Details") {
          fetchInternalDetails();
          // Preload external details in background for faster switching
          fetchExternalDetails();
        } else {
          fetchExternalDetails();
          // Preload internal details in background for faster switching
          fetchInternalDetails();
        }
      }
    };

    loadInitialData();
  }, [
    selectedNav, 
    selectedNavdetails, 
    showProjectRequestList, 
    showArchivedProjects, 
    archivedNav,
    fetchInternalRequests,
    fetchExternalRequests,
    fetchInternalDetails,
    fetchExternalDetails,
    fetchArchivedInternalRequests,
    fetchArchivedExternalRequests
  ]);

  // Handle navigation click
  const handleNavClick = (nav) => {
    setSelectedNav(nav);
    setSelectedRequests([]);
    
    // Load appropriate data when switching tabs
    if (nav === "Internal Request") {
      fetchInternalRequests(internalRequestsPage);
    } else {
      fetchExternalRequests(externalRequestsPage);
    }
  };

  const handleNavDetailsClick = (navdetails) => {
    setSelectedNavdetails(navdetails);
    
    // Load appropriate data when switching detail tabs
    if (navdetails === "Internal Details") {
      fetchInternalDetails(internalDetailsPage);
    } else {
      fetchExternalDetails(externalDetailsPage);
    }
  };

  const handleCheckboxChange = (index) => {
    const updatedSelection = [...selectedRequests];
    updatedSelection[index] = !updatedSelection[index];
    setSelectedRequests(updatedSelection);
  };

  const handleArchivedCheckboxChange = (index) => {
    const updatedSelection = [...selectedArchivedRequests];
    updatedSelection[index] = !updatedSelection[index];
    setSelectedArchivedRequests(updatedSelection);
  };

  const handleArchiveRequests = async () => {
    try {
      const selectedIds = [];
      if (selectedNav === "Internal Request") {
        internalRequests.forEach((item, index) => {
          if (selectedRequests[index]) {
            selectedIds.push(item.project_request_id);
          }
        });

        if (selectedIds.length > 0) {
          const response = await axios.post(`${API_URL}/internal-requests/bulk_archive/`, { ids: selectedIds });
          showNotification(`Successfully archived ${response.data.success_count} of ${response.data.total_count} requests`);
          // Always reset to page 1 after archiving
          fetchInternalRequests(1);
          setInternalRequestsPage(1);
        }
      } else if (selectedNav === "External Request") {
        externalRequests.forEach((item, index) => {
          if (selectedRequests[index]) {
            selectedIds.push(item.ext_project_request_id);
          }
        });

        if (selectedIds.length > 0) {
          const response = await axios.post(`${API_URL}/external-requests/bulk_archive/`, { ids: selectedIds });
          showNotification(`Successfully archived ${response.data.success_count} of ${response.data.total_count} requests`);
          fetchExternalRequests(externalRequestsPage);
        }
      }
      setSelectedRequests([]);
    } catch (err) {
      console.error('Failed to archive requests:', err);
      showNotification('Failed to archive selected items', 'error');
    }
  };

  const handleRestoreRequests = async () => {
    try {
      const selectedIds = [];
      if (archivedNav === "Internal Archived") {
        archivedInternalRequests.forEach((item, index) => {
          if (selectedArchivedRequests[index]) {
            selectedIds.push(item.project_request_id);
          }
        });
        if (selectedIds.length > 0) {
          const response = await axios.post(`${API_URL}/archived-projects/restore_internal/`, { ids: selectedIds });
          showNotification(`Successfully restored ${response.data.success_count} of ${response.data.total_count} requests`);
          // Force refresh archived list twice for real-time update
          await fetchArchivedInternalRequests(1);
          await fetchArchivedInternalRequests(1);
          setArchivedInternalPage(1);
          await fetchInternalRequests(1);
          setInternalRequestsPage(1);
        }
      } else if (archivedNav === "External Archived") {
        archivedExternalRequests.forEach((item, index) => {
          if (selectedArchivedRequests[index]) {
            selectedIds.push(item.ext_project_request_id);
          }
        });
        if (selectedIds.length > 0) {
          const response = await axios.post(`${API_URL}/archived-projects/restore_external/`, { ids: selectedIds });
          showNotification(`Successfully restored ${response.data.success_count} of ${response.data.total_count} requests`);
          // Force refresh archived list twice for real-time update
          await fetchArchivedExternalRequests(1);
          await fetchArchivedExternalRequests(1);
          setArchivedExternalPage(1);
          await fetchExternalRequests(1);
          setExternalRequestsPage(1);
        }
      }
      setSelectedArchivedRequests([]);
    } catch (err) {
      console.error('Failed to restore requests:', err);
      showNotification('Failed to restore selected items', 'error');
    }
  };

  const handleBackClick = () => {
    setShowProjectRequestList(true);
  };

  const handleProjectRequestDetailsClick = () => {
    setShowProjectRequestList(false);
    
    // Load appropriate details data
    if (selectedNavdetails === "Internal Details") {
      fetchInternalDetails();
    } else {
      fetchExternalDetails();
    }
  };

  // Pagination handlers
  const handlePageChange = (type, newPage) => {
    switch(type) {
      case 'internalRequests':
        fetchInternalRequests(newPage);
        break;
      case 'externalRequests':
        fetchExternalRequests(newPage);
        break;
      case 'internalDetails':
        fetchInternalDetails(newPage);
        break;
      case 'externalDetails':
        fetchExternalDetails(newPage);
        break;
      case 'archivedInternal':
        fetchArchivedInternalRequests(newPage);
        break;
      case 'archivedExternal':
        fetchArchivedExternalRequests(newPage);
        break;
      default:
        break;
    }
  };
  
  // Filter handlers
  const toggleFilter = () => {
    setShowFilter(!showFilter);
  };
  
  // Filter panel component with local state to prevent focus issues
  const FilterPanel = () => {
    if (!showFilter) return null;
    
    // Local state for filter inputs to prevent losing focus
    const [localInternalFilters, setLocalInternalFilters] = useState({...internalFilters});
    const [localExternalFilters, setLocalExternalFilters] = useState({...externalFilters});
    
    // Handle local filter changes without triggering parent component re-renders
    const handleLocalFilterChange = (type, field, value) => {
      if (type === 'internal') {
        setLocalInternalFilters(prev => ({
          ...prev,
          [field]: value
        }));
      } else {
        setLocalExternalFilters(prev => ({
          ...prev,
          [field]: value
        }));
      }
    };
    
    // Apply filters from local state to parent state only when button is clicked
    const handleApplyFilters = () => {
      if (selectedNav === "Internal Request") {
        // Apply the filters from local state to the main state
        setInternalFilters(localInternalFilters);
        // Reset to page 1 when applying new filters
        setInternalRequestsPage(1);
        fetchInternalRequests(1);
      } else {
        setExternalFilters(localExternalFilters);
        setExternalRequestsPage(1);
        fetchExternalRequests(1);
      }
      setShowFilter(false);
    };
    
    // Clear local filters and parent filters
    const handleClearFilters = () => {
      const emptyFilters = {
        project_name: '',
        approval_id: '',
        employee_id: '',
        dept_id: '',
        status: ''
      };
      
      const emptyExternalFilters = {
        project_name: '',
        approval_id: '',
        item_id: '',
        status: ''
      };
      
      if (selectedNav === "Internal Request") {
        setLocalInternalFilters(emptyFilters);
        setInternalFilters(emptyFilters);
        setInternalRequestsPage(1);
        fetchInternalRequests(1);
      } else {
        setLocalExternalFilters(emptyExternalFilters);
        setExternalFilters(emptyExternalFilters);
        setExternalRequestsPage(1);
        fetchExternalRequests(1);
      }
      setShowFilter(false);
    };
    
    return (
      <div className="filter-panel">
        <div className="filter-header">
          <h3>Filter Projects</h3>
          <button className="close-filter" onClick={toggleFilter}>×</button>
        </div>
        
        {selectedNav === "Internal Request" ? (
          <div className="filter-form">
            <div className="filter-field">
              <label>Project Name</label>
              <input 
                type="text" 
                ref={projectNameInputRef}
                value={localInternalFilters.project_name} 
                onChange={(e) => handleLocalFilterChange('internal', 'project_name', e.target.value)}
                placeholder="Filter by project name"
              />
            </div>
            <div className="filter-field">
              <label>Approval ID</label>
              <input 
                type="text" 
                ref={approvalIdInputRef}
                value={localInternalFilters.approval_id} 
                onChange={(e) => handleLocalFilterChange('internal', 'approval_id', e.target.value)}
                placeholder="Filter by approval ID"
              />
            </div>
            <div className="filter-field">
              <label>Employee ID</label>
              <input 
                type="text" 
                ref={employeeIdInputRef}
                value={localInternalFilters.employee_id} 
                onChange={(e) => handleLocalFilterChange('internal', 'employee_id', e.target.value)}
                placeholder="Filter by employee ID"
              />
            </div>
            <div className="filter-field">
              <label>Department ID</label>
              <input 
                type="text" 
                ref={deptIdInputRef}
                value={localInternalFilters.dept_id} 
                onChange={(e) => handleLocalFilterChange('internal', 'dept_id', e.target.value)}
                placeholder="Filter by department ID"
              />
            </div>
            <div className="filter-field">
              <label>Project Status</label>
              <select 
                ref={statusSelectRef}
                value={localInternalFilters.status} 
                onChange={(e) => handleLocalFilterChange('internal', 'status', e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        ) : (
          <div className="filter-form">
            <div className="filter-field">
              <label>Project Name</label>
              <input 
                type="text" 
                ref={externalProjectNameInputRef}
                value={localExternalFilters.project_name} 
                onChange={(e) => handleLocalFilterChange('external', 'project_name', e.target.value)}
                placeholder="Filter by project name"
              />
            </div>
            <div className="filter-field">
              <label>Approval ID</label>
              <input 
                type="text" 
                ref={externalApprovalIdInputRef}
                value={localExternalFilters.approval_id} 
                onChange={(e) => handleLocalFilterChange('external', 'approval_id', e.target.value)}
                placeholder="Filter by approval ID"
              />
            </div>
            <div className="filter-field">
              <label>Item ID</label>
              <input 
                type="text" 
                ref={itemIdInputRef}
                value={localExternalFilters.item_id} 
                onChange={(e) => handleLocalFilterChange('external', 'item_id', e.target.value)}
                placeholder="Filter by item ID"
              />
            </div>
            <div className="filter-field">
              <label>Project Status</label>
              <select 
                ref={externalStatusSelectRef}
                value={localExternalFilters.status} 
                onChange={(e) => handleLocalFilterChange('external', 'status', e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        )}
        
        <div className="filter-actions">
          <button className="btn btn-secondary" onClick={handleClearFilters}>Clear Filters</button>
          <button className="btn btn-primary" onClick={handleApplyFilters}>Apply Filters</button>
        </div>
      </div>
    );
  };

  // Toggle between active and archived projects
  const toggleArchivedView = () => {
    setShowArchivedProjects(!showArchivedProjects);
    setSelectedRequests([]);
    setSelectedArchivedRequests([]);
    
    if (!showArchivedProjects) {
      // Switching to archived view
      if (archivedNav === "Internal Archived") {
        fetchArchivedInternalRequests();
      } else {
        fetchArchivedExternalRequests();
      }
    } else {
      // Switching to active view
      if (selectedNav === "Internal Request") {
        fetchInternalRequests();
      } else {
        fetchExternalRequests();
      }
    }
  };

  // Handle archived navigation
  const handleArchivedNavClick = (nav) => {
    setArchivedNav(nav);
    setSelectedArchivedRequests([]);
    
    if (nav === "Internal Archived") {
      fetchArchivedInternalRequests(archivedInternalPage);
    } else {
      fetchArchivedExternalRequests(archivedExternalPage);
    }
  };

  // Check if any requests are selected
  const hasSelectedRequests = selectedRequests.some(selected => selected);
  const hasSelectedArchivedRequests = selectedArchivedRequests.some(selected => selected);

  // Skeleton loading component
  const SkeletonRow = ({ columns }) => (
    <tr className="skeleton-row">
      {Array(columns).fill().map((_, i) => (
        <td key={i}><div className="skeleton-cell"></div></td>
      ))}
    </tr>
  );

  // Notification component
  const Notification = () => {
    if (!notification.show) return null;
    
    return (
      <div className={`notification ${notification.type}`}>
        <div className="notification-content">
          {notification.type === 'success' && (
            <span className="notification-icon success-icon">✓</span>
          )}
          {notification.type === 'error' && (
            <span className="notification-icon error-icon">✕</span>
          )}
          <span className="notification-message">{notification.message}</span>
          <button 
            className="notification-close" 
            onClick={closeNotification}
          >
            ×
          </button>
        </div>
      </div>
    );
  };

  // Pagination component
  const Pagination = ({ type, currentPage, pagination }) => {
    if (!pagination || !pagination.count) return null;
    
    const totalPages = pagination.total_pages || Math.ceil(pagination.count / 10);
    
    return (
      <div className="pagination">
        <button 
          className="pagination-button" 
          disabled={currentPage <= 1}
          onClick={() => handlePageChange(type, currentPage - 1)}
        >
          Previous
        </button>
        <span className="pagination-info">Page {currentPage} of {totalPages}</span>
        <button 
          className="pagination-button" 
          disabled={currentPage >= totalPages}
          onClick={() => handlePageChange(type, currentPage + 1)}
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div className="project-list-container">
      {/* Add the notification component */}
      <Notification />
      
      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="retry-button"
          >
            Retry
          </button>
        </div>
      )}
      
      <div className="content-wrapper">
        {showProjectRequestList ? (
          <>
            <div className="header-section">
              <h1 className="page-title">
                {showArchivedProjects ? "Archived Projects" : "Project Request Management"}
              </h1>
              <div className="action-buttons">
                <button className="btn btn-secondary" onClick={toggleArchivedView}>
                  {showArchivedProjects ? "View Active Projects" : " Archived Projects"}
                </button>
                
                {!showArchivedProjects && (
                  <>
                    <button className="btn btn-filter" onClick={toggleFilter}>
                      <i className="filter-icon"></i>
                      Filter Projects
                    </button>
                    {hasSelectedRequests && (
                      <button className="btn btn-warning" onClick={handleArchiveRequests}>
                        <i className="archive-icon"></i>
                        Archive Selected
                      </button>
                    )}
                  </>
                )}
                
                {showArchivedProjects && hasSelectedArchivedRequests && (
                  <button className="btn btn-success" onClick={handleRestoreRequests}>
                    <i className="restore-icon"></i>
                    Restore Selected
                  </button>
                )}
                
                <button className="btn btn-primary" onClick={handleProjectRequestDetailsClick}>
                  <i className="details-icon"></i>
                  Project Details
                </button>
              </div>
            </div>

            {!showArchivedProjects && <FilterPanel />}

            <div className="tab-navigation">
              {showArchivedProjects ? (
                <>
                  <button
                    className={`tab-button ${archivedNav === "Internal Archived" ? "active" : ""}`}
                    onClick={() => handleArchivedNavClick("Internal Archived")}
                  >
                    Archived Internal Requests
                  </button>
                  <button
                    className={`tab-button ${archivedNav === "External Archived" ? "active" : ""}`}
                    onClick={() => handleArchivedNavClick("External Archived")}
                  >
                    Archived External Requests
                  </button>
                  
                </>
              ) : (
                <>
                  <button
                    className={`tab-button ${selectedNav === "Internal Request" ? "active" : ""}`}
                    onClick={() => handleNavClick("Internal Request")}
                  >
                    Internal Requests
                  </button>
                  <button
                    className={`tab-button ${selectedNav === "External Request" ? "active" : ""}`}
                    onClick={() => handleNavClick("External Request")}
                  >
                    External Requests
                  </button>
                  <div className="status-indicators-projectlist">
                <span className="status-indicator approved">
                  <div className="status-dot"></div>
                  <span>Approved</span>
                </span>
                <span className="status-indicator not-approved">
                  <div className="status-dot"></div>
                  <span>Not Approved</span>
                </span>
                <span className="status-indicator ongoing">
                  <div className="status-dot"></div>
                  <span>Ongoing</span>
                </span>
              </div>
                </>
              )}
            </div>

            <div className="table-container">
              {/* Active Internal Requests */}
              {!showArchivedProjects && selectedNav === "Internal Request" && (
                <div className="data-table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th className="select-col"></th>                 
                        <th>Project Request ID</th>
                        <th>Project Name</th>
                        <th>Approval ID</th>
                        <th>Request Date</th>
                        <th>Employee</th>
                        <th>Department</th> 
                        <th>Project Status</th>
                        <th className="status-col">Status</th>
                      </tr>
                    </thead>
                    {loadingStates.internalRequests ? (
                      <tbody>
                        {Array(5).fill().map((_, i) => (
                          <SkeletonRow key={i} columns={9} />
                        ))}
                      </tbody>
                    ) : (
                      <tbody>
                        {internalRequests.length > 0 ? (
                          internalRequests.map((item, index) => (
                            <tr key={index}>
                              <td className="select-col">
                                <input
                                  type="checkbox"
                                  checked={selectedRequests[index] || false}
                                  onChange={() => handleCheckboxChange(index)}
                                />
                              </td>
                              <td>{item.project_request_id}</td>
                              <td>{item.project_name}</td>
                              <td>{item.approval_id}</td>
                              <td>{item.request_date}</td>
                              <td>{item.employee_name}</td>
                              <td>{item.department}</td> 
                              <td>
                                <span className={`status-badge ${item.project_status?.toLowerCase() || 'pending'}`}>
                                  {item.project_status || 'Pending'}
                                </span>
                              </td>
                              <td className="status-col">
                                <div className={`status-indicator-dot ${getStatusClass(item.project_status)}`}></div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="9" className="no-data">
                              No internal request data available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    )}
                  </table>
                  <Pagination 
                    type="internalRequests" 
                    currentPage={internalRequestsPage} 
                    pagination={internalRequestsPagination} 
                  />
                </div>
              )}

              {/* Active External Requests */}
              {!showArchivedProjects && selectedNav === "External Request" && (
                <div className="data-table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th className="select-col"></th>
                        
                        <th>Project Request ID</th>
                        <th>Project Name</th>
                        <th>Approval ID</th>
                        <th>Item ID</th>
                        <th>Start Date</th>
                        <th>Project Status</th>
                        <th className="status-col">Status</th>
                      </tr>
                    </thead>
                    {loadingStates.externalRequests ? (
                      <tbody>
                        {Array(5).fill().map((_, i) => (
                          <SkeletonRow key={i} columns={8} />
                        ))}
                      </tbody>
                    ) : (
                      <tbody>
                        {externalRequests.length > 0 ? (
                          externalRequests.map((item, index) => (
                            <tr key={index}>
                              <td className="select-col">
                                <input
                                  type="checkbox"
                                  checked={selectedRequests[index] || false}
                                  onChange={() => handleCheckboxChange(index)}
                                />
                              </td>
                              
                              <td>{item.ext_project_request_id}</td>
                              <td>{item.project_name}</td>
                              <td>{item.approval_id}</td>
                              <td>{item.item_id}</td>
                              <td>{item.start_date}</td>
                              <td>
                                <span className={`status-badge ${item.project_status?.toLowerCase() || 'pending'}`}>
                                  {item.project_status || 'Pending'}
                                </span>
                              </td>
                              <td className="status-col">
                                <div className={`status-indicator-dot ${getStatusClass(item.project_status)}`}></div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="8" className="no-data">
                              No external request data available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    )}
                  </table>
                  <Pagination 
                    type="externalRequests" 
                    currentPage={externalRequestsPage} 
                    pagination={externalRequestsPagination} 
                  />
                </div>
              )}

              {/* Archived Internal Requests */}
              {showArchivedProjects && archivedNav === "Internal Archived" && (
                <div className="data-table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th className="select-col"></th>
                        <th className="status-col">Status</th>
                        <th>Project Request ID</th>
                        <th>Project Name</th>
                        <th>Approval ID</th>
                        <th>Request Date</th>
                        <th>Employee ID</th>
                        <th>Department ID</th>
                        <th>Project Status</th>
                        <th>Archived Date</th>
                      </tr>
                    </thead>
                    {loadingStates.archivedInternal ? (
                      <tbody>
                        {Array(5).fill().map((_, i) => (
                          <SkeletonRow key={i} columns={10} />
                        ))}
                      </tbody>
                    ) : (
                      <tbody>
                        {archivedInternalRequests.length > 0 ? (
                          archivedInternalRequests.map((item, index) => (
                            <tr key={index}>
                              <td className="select-col">
                                <input
                                  type="checkbox"
                                  checked={selectedArchivedRequests[index] || false}
                                  onChange={() => handleArchivedCheckboxChange(index)}
                                />
                              </td>
                              <td className="status-col">
                                <div className={`status-indicator-dot ${getStatusClass(item.project_status)}`}></div>
                              </td>
                              <td>{item.project_request_id}</td>
                              <td>{item.project_name}</td>
                              <td>{item.approval_id}</td>
                              <td>{item.request_date}</td>
                              <td>{item.employee_id}</td>
                              <td>{item.dept_id}</td>
                              <td>
                                <span className={`status-badge ${item.project_status?.toLowerCase() || 'pending'}`}>
                                  {item.project_status || 'Pending'}
                                </span>
                              </td>
                              <td className="archived-date">{item.archived_date}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="10" className="no-data">
                              No archived internal request data available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    )}
                  </table>
                  <Pagination 
                    type="archivedInternal" 
                    currentPage={archivedInternalPage} 
                    pagination={archivedInternalPagination} 
                  />
                </div>
              )}

              {/* Archived External Requests */}
              {showArchivedProjects && archivedNav === "External Archived" && (
                <div className="data-table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th className="select-col"></th>
                        <th className="status-col">Status</th>
                        <th>Project Request ID</th>
                        <th>Project Name</th>
                        <th>Approval ID</th>
                        <th>Item ID</th>
                        <th>Start Date</th>
                        <th>Project Status</th>
                        <th>Archived Date</th>
                      </tr>
                    </thead>
                    {loadingStates.archivedExternal ? (
                      <tbody>
                        {Array(5).fill().map((_, i) => (
                          <SkeletonRow key={i} columns={9} />
                        ))}
                      </tbody>
                    ) : (
                      <tbody>
                        {archivedExternalRequests.length > 0 ? (
                          archivedExternalRequests.map((item, index) => (
                            <tr key={index}>
                              <td className="select-col">
                                <input
                                  type="checkbox"
                                  checked={selectedArchivedRequests[index] || false}
                                  onChange={() => handleArchivedCheckboxChange(index)}
                                />
                              </td>
                              <td className="status-col">
                                <div className={`status-indicator-dot ${getStatusClass(item.project_status)}`}></div>
                              </td>
                              <td>{item.ext_project_request_id}</td>
                              <td>{item.project_name}</td>
                              <td>{item.approval_id}</td>
                              <td>{item.item_id}</td>
                              <td>{item.start_date}</td>
                              <td>
                                <span className={`status-badge ${item.project_status?.toLowerCase() || 'pending'}`}>
                                  {item.project_status || 'Pending'}
                                </span>
                              </td>
                              <td className="archived-date">{item.archived_date}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="9" className="no-data">
                              No archived external request data available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    )}
                  </table>
                  <Pagination 
                    type="archivedExternal" 
                    currentPage={archivedExternalPage} 
                    pagination={archivedExternalPagination}
                  />
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="header-section">
              <h1 className="page-title">Project Details</h1>
              <button onClick={handleBackClick} className="btn btn-back">
                <i className="back-icon"></i>
                Back to Projects
              </button>
            </div>

            <div className="tab-navigation">
              <button
                className={`tab-button ${selectedNavdetails === "Internal Details" ? "active" : ""}`}
                onClick={() => handleNavDetailsClick("Internal Details")}
              >
                Internal Project Details
              </button>
              <button
                className={`tab-button ${selectedNavdetails === "External Details" ? "active" : ""}`}
                onClick={() => handleNavDetailsClick("External Details")}
              >
                External Project Details
              </button>
            </div>

            <div className="table-container">
              {selectedNavdetails === "Internal Details" && (
                <div className="data-table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th className="status-col">Status</th>
                        <th>Project ID</th>
                        <th>Request ID</th>
                        <th>Project Name</th>
                        <th>Status</th>
                        <th>Approval ID</th>
                        <th>Employee ID</th>
                        <th>Department</th>                  
                        <th>Description</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Issues</th>
                      </tr>
                    </thead>
                    {loadingStates.internalDetails ? (
                      <tbody>
                        {Array(5).fill().map((_, i) => (
                          <SkeletonRow key={i} columns={12} />
                        ))}
                      </tbody>
                    ) : (
                      <tbody>
                        {internalDetails.length > 0 ? (
                          internalDetails.map((item, index) => (
                            <tr key={index}>
                              <td className="status-col">
                                <div className={`status-indicator-dot ${getStatusClass(item.status)}`}></div>
                              </td>
                              <td>{item.intrnl_project_id}</td>
                              <td>{item.project_request_id}</td>
                              <td>{item.project_name}</td>
                              <td>
                                <span className={`status-badge ${item.status?.toLowerCase() || 'pending'}`}>
                                  {item.status || 'Pending'}
                                </span>
                              </td>
                              <td>{item.approval_id}</td>
                              <td>{item.employee_id}</td>
                              <td>{item.department}</td>
                              <td>{item.description}</td>
                              <td>{item.start_date}</td>
                              <td>{item.estimated_end_date}</td>
                              <td>{item.project_issues}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="12" className="no-data">
                              No internal details available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    )}
                  </table>
                  <Pagination 
                    type="internalDetails" 
                    currentPage={internalDetailsPage} 
                    pagination={internalDetailsPagination} 
                  />
                </div>
              )}

              {selectedNavdetails === "External Details" && (
                <div className="data-table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th className="status-col">Status</th>
                        <th>Project ID</th>
                        <th>Project Name</th>
                        <th>Approval ID</th>
                        <th>Item ID</th>
                        <th>Start Date</th>
                        <th>Project Status</th>
                        <th>Project Milestone</th>
                        <th>End Date</th>
                        <th>Warranty Coverage</th>
                        <th>Warranty Start</th>
                        <th>Warranty End</th>
                        <th>Warranty Status</th>
                        <th>Issues</th>
                      </tr>
                    </thead>
                    {loadingStates.externalDetails ? (
                      <tbody>
                        {Array(5).fill().map((_, i) => (
                          <SkeletonRow key={i} columns={14} />
                        ))}
                      </tbody>
                    ) : (
                      <tbody>
                        {externalDetails.length > 0 ? (
                          externalDetails.map((item, index) => (
                            <tr key={index}>
                              <td className="status-col">
                                <div className={`status-indicator-dot ${getStatusClass(item.project_status)}`}></div>
                              </td>
                              <td>{item.project_id}</td>
                              <td>{item.project_name}</td>
                              <td>{item.approval_id}</td>
                              <td>{item.item_id}</td>
                              <td>{item.start_date}</td>
                              <td>
                                <span className={`status-badge ${item.project_status?.toLowerCase() || 'pending'}`}>
                                  {item.project_status || 'Pending'}
                                </span>
                              </td>
                              <td>{item.project_milestone}</td>
                              <td>{item.estimated_end_date}</td>
                              <td>{item.warranty_coverage_yr}</td>
                              <td>{item.warranty_start_date}</td>
                              <td>{item.warranty_end_date}</td>
                              <td>{item.warranty_status}</td>
                              <td>{item.project_issues}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="14" className="no-data">
                              No external details available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    )}
                  </table>
                  <Pagination 
                    type="externalDetails" 
                    currentPage={externalDetailsPage} 
                    pagination={externalDetailsPagination} 
                  />
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProjectList;