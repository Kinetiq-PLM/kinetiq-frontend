// ProjectManagement.jsx with improved API integration, autocomplete, and Project Summary
import React, { useState, useEffect } from "react";
import "./styles/ProjectManagement.css";
import axios from "axios";
import { debounce } from 'lodash'; // You'll need to install lodash: npm install lodash

const BodyContent = () => {
    const [overdueTasks, setOverdueTasks] = useState([]);
    const [todayTasks, setTodayTasks] = useState([]);
    const [dataExternal, setDataExternal] = useState([]);
    const [dataInternal, setDataInternal] = useState([]);
    const [projectSummary, setProjectSummary] = useState([]);
  
    const [selectedNav3, setSelectedNav3] = useState('All3');
    const [selectedNav2, setSelectedNav2] = useState('Internal Project');
    const [showAddProjectForm, setShowAddProjectForm] = useState(false);
    const [selectedNavplan, setSelectedNavplan] = useState("External");
  
    // External project form state
    const [newProjectIDExternal, setNewProjectIDExternal] = useState("");
    const [selectedProjectMilestoneExternal, setSelectedProjectMilestoneExternal] = useState("");
    const [newStartDateExternal, setNewStartDateExternal] = useState("");
    const [newEndDateExternal, setNewEndDateExternal] = useState("");
    const [newProjectIssueExternal, setNewProjectIssueExternal] = useState("");
    const [newProjectWarrantyIDExternal, setNewProjectWarrantyIDExternal] = useState("");
  
    // Internal project form state
    const [newProjectIDInternal, setNewProjectIDInternal] = useState("");
    const [newStartDateInternal, setNewStartDateInternal] = useState("");
    const [newEndDateInternal, setNewEndDateInternal] = useState("");
    const [newProjectIssueInternal, setNewProjectIssueInternal] = useState("");
    const [newProjectRequestIDInternal, setNewProjectRequestIDInternal] = useState("");
    
    // Search results state
    const [externalProjectSearchResults, setExternalProjectSearchResults] = useState([]);
    const [internalProjectSearchResults, setInternalProjectSearchResults] = useState([]);
    const [warrantySearchResults, setWarrantySearchResults] = useState([]);
    const [projectRequestSearchResults, setProjectRequestSearchResults] = useState([]);
    
    // Loading states
    const [isLoading, setIsLoading] = useState({
        overdueTasks: false,
        todayTasks: false,
        externalProjects: false,
        internalProjects: false,
        projectSummary: false
    });
    
    // Error states
    const [errors, setErrors] = useState({
        overdueTasks: null,
        todayTasks: null,
        externalProjects: null,
        internalProjects: null,
        projectSummary: null
    });
  
    // Fetch data on component mount
    useEffect(() => {
        fetchOverdueTasks();
        fetchTodayTasks();
        fetchExternalProjects();
        fetchInternalProjects();
        fetchProjectSummary();
    }, []);
  
    const fetchInitialExternalProjects = async () => {
      try {
          const response = await axios.get('/api/search-external-project/');
          setExternalProjectSearchResults(response.data);
      } catch (error) {
          console.error("Error fetching initial external projects:", error);
      }
  };
  
  const fetchInitialInternalProjects = async () => {
      try {
          const response = await axios.get('/api/search-internal-project/');
          setInternalProjectSearchResults(response.data);
      } catch (error) {
          console.error("Error fetching initial internal projects:", error);
      }
  };
  
  const fetchInitialWarranties = async () => {
      try {
          const response = await axios.get('/api/search-warranty/');
          setWarrantySearchResults(response.data);
      } catch (error) {
          console.error("Error fetching initial warranties:", error);
      }
  };
  
  const fetchInitialProjectRequests = async () => {
      try {
          const response = await axios.get('/api/search-project-request/');
          setProjectRequestSearchResults(response.data);
      } catch (error) {
          console.error("Error fetching initial project requests:", error);
      }
  };

    const fetchOverdueTasks = async () => {
        setIsLoading(prev => ({ ...prev, overdueTasks: true }));
        try {
            const response = await axios.get('/api/overdue-tasks/');
            setOverdueTasks(response.data);
            setErrors(prev => ({ ...prev, overdueTasks: null }));
        } catch (error) {
            console.error("Error fetching overdue tasks:", error);
            setErrors(prev => ({ ...prev, overdueTasks: "Failed to load overdue tasks" }));
        } finally {
            setIsLoading(prev => ({ ...prev, overdueTasks: false }));
        }
    };
  
    const fetchTodayTasks = async () => {
        setIsLoading(prev => ({ ...prev, todayTasks: true }));
        try {
            const response = await axios.get('/api/today-tasks/');
            setTodayTasks(response.data);
            setErrors(prev => ({ ...prev, todayTasks: null }));
        } catch (error) {
            console.error("Error fetching today's tasks:", error);
            setErrors(prev => ({ ...prev, todayTasks: "Failed to load today's tasks" }));
        } finally {
            setIsLoading(prev => ({ ...prev, todayTasks: false }));
        }
    };
  
    const fetchExternalProjects = async () => {
        setIsLoading(prev => ({ ...prev, externalProjects: true }));
        try {
            const response = await axios.get('/api/external-projects/');
            setDataExternal(response.data);
            setErrors(prev => ({ ...prev, externalProjects: null }));
        } catch (error) {
            console.error("Error fetching external projects:", error);
            setErrors(prev => ({ ...prev, externalProjects: "Failed to load external projects" }));
        } finally {
            setIsLoading(prev => ({ ...prev, externalProjects: false }));
        }
    };
  
    const fetchInternalProjects = async () => {
        setIsLoading(prev => ({ ...prev, internalProjects: true }));
        try {
            const response = await axios.get('/api/internal-projects/');
            setDataInternal(response.data);
            setErrors(prev => ({ ...prev, internalProjects: null }));
        } finally {
            setIsLoading(prev => ({ ...prev, internalProjects: false }));
        }
    };
    
    const fetchProjectSummary = async () => {
      setIsLoading(prev => ({ ...prev, projectSummary: true }));
      try {
          const response = await axios.get('/api/project-summary/');
          console.log("Project summary data:", response.data); // Add this for debugging
          setProjectSummary(response.data);
          setErrors(prev => ({ ...prev, projectSummary: null }));
      } catch (error) {
          console.error("Error fetching project summary:", error);
          setErrors(prev => ({ ...prev, projectSummary: "Failed to load project summary" }));
      } finally {
          setIsLoading(prev => ({ ...prev, projectSummary: false }));
      }
  };
  
    
    // Debounced search functions
    const searchExternalProjects = debounce(async (query) => {
        if (!query) {
            setExternalProjectSearchResults([]);
            return;
        }
        
        try {
            const response = await axios.get(`/api/search-external-project/?query=${query}`);
            setExternalProjectSearchResults(response.data);
        } catch (error) {
            console.error("Error searching external projects:", error);
            setExternalProjectSearchResults([]);
        }
    }, 300);
    
    const searchInternalProjects = debounce(async (query) => {
        if (!query) {
            setInternalProjectSearchResults([]);
            return;
        }
        
        try {
            const response = await axios.get(`/api/search-internal-project/?query=${query}`);
            setInternalProjectSearchResults(response.data);
        } catch (error) {
            console.error("Error searching internal projects:", error);
            setInternalProjectSearchResults([]);
        }
    }, 300);
    
    const searchWarranties = debounce(async (query) => {
        if (!query) {
            setWarrantySearchResults([]);
            return;
        }
        
        try {
            const response = await axios.get(`/api/search-warranty/?query=${query}`);
            setWarrantySearchResults(response.data);
        } catch (error) {
            console.error("Error searching warranties:", error);
            setWarrantySearchResults([]);
        }
    }, 300);
    
    const searchProjectRequests = debounce(async (query) => {
        if (!query) {
            setProjectRequestSearchResults([]);
            return;
        }
        
        try {
            const response = await axios.get(`/api/search-project-request/?query=${query}`);
            setProjectRequestSearchResults(response.data);
        } catch (error) {
            console.error("Error searching project requests:", error);
            setProjectRequestSearchResults([]);
        }
    }, 300);
  
const handleNavClickdash = (nav) => {
    setSelectedNavplan(nav);
    
    if (nav === "External") {
        fetchInitialExternalProjects();
        fetchInitialWarranties();
    } else {
        fetchInitialInternalProjects();
        fetchInitialProjectRequests();
    }
};

  
    const handleNavClick = (navItem) => {
        setSelectedNav2(navItem);
    };
  
    const handleNavClick2 = (navItem) => {
        setSelectedNav3(navItem);
    };
  
    const handleAddProjectClick = () => {
      setShowAddProjectForm(true);
      
      // Fetch initial data for the forms
      if (selectedNavplan === "External") {
          fetchInitialExternalProjects();
          fetchInitialWarranties();
      } else {
          fetchInitialInternalProjects();
          fetchInitialProjectRequests();
      }
  };
  
    const handleAddExternalProject = async (e) => {
        e.preventDefault();
        try {
            const projectData = {
                project_id: newProjectIDExternal,
                project_milestone: selectedProjectMilestoneExternal,
                start_date: newStartDateExternal,
                estimated_end_date: newEndDateExternal,
                project_warranty_id: newProjectWarrantyIDExternal,
                project_issue: newProjectIssueExternal
            };
            
            await axios.post('/api/create-external-project/', projectData);
            await fetchExternalProjects(); // Refresh the list after adding
            await fetchProjectSummary(); // Also refresh the summary
            setShowAddProjectForm(false);
            resetExternalForm();
        } catch (error) {
            console.error("Error creating external project:", error);
            alert("Failed to create external project. Please try again.");
        }
    };
  
    const handleAddInternalProject = async (e) => {
        e.preventDefault();
        try {
            const projectData = {
                project_id: newProjectIDInternal,
                start_date: newStartDateInternal,
                estimated_end_date: newEndDateInternal,
                project_issue: newProjectIssueInternal,
                project_request_id: newProjectRequestIDInternal
            };
            
            await axios.post('/api/create-internal-project/', projectData);
            await fetchInternalProjects(); // Refresh the list after adding
            await fetchProjectSummary(); // Also refresh the summary
            setShowAddProjectForm(false);
            resetInternalForm();
        } catch (error) {
            console.error("Error creating internal project:", error);
            alert("Failed to create internal project. Please try again.");
        }
    };
  
    const resetExternalForm = () => {
        setNewProjectIDExternal("");
        setSelectedProjectMilestoneExternal("");
        setNewStartDateExternal("");
        setNewEndDateExternal("");
        setNewProjectWarrantyIDExternal("");
        setNewProjectIssueExternal("");
        setExternalProjectSearchResults([]);
        setWarrantySearchResults([]);
    };
  
    const resetInternalForm = () => {
        setNewProjectIDInternal("");
        setNewStartDateInternal("");
        setNewEndDateInternal("");
        setNewProjectIssueInternal("");
        setNewProjectRequestIDInternal("");
        setInternalProjectSearchResults([]);
        setProjectRequestSearchResults([]);
    };
  
    const handleCancelAddProject = () => {
        setShowAddProjectForm(false);
        resetExternalForm();
        resetInternalForm();
    };
    
    // Handle project ID search input
    const handleExternalProjectIDChange = (e) => {
        const value = e.target.value;
        setNewProjectIDExternal(value);
        searchExternalProjects(value);
    };
    
    const handleInternalProjectIDChange = (e) => {
        const value = e.target.value;
        setNewProjectIDInternal(value);
        searchInternalProjects(value);
    };
    
    // Handle warranty ID search input
    const handleWarrantyIDChange = (e) => {
        const value = e.target.value;
        setNewProjectWarrantyIDExternal(value);
        searchWarranties(value);
    };
    
    // Handle project request ID search input
    const handleProjectRequestIDChange = (e) => {
        const value = e.target.value;
        setNewProjectRequestIDInternal(value);
        searchProjectRequests(value);
    };
    
    // Select a project from search results
    const selectExternalProject = (project) => {
        setNewProjectIDExternal(project.project_id);
        setExternalProjectSearchResults([]);
    };
    
    const selectInternalProject = (project) => {
        setNewProjectIDInternal(project.intrnl_project_id);
        setInternalProjectSearchResults([]);
    };
    
    // Select a warranty from search results
    const selectWarranty = (warranty) => {
        setNewProjectWarrantyIDExternal(warranty.id);
        setWarrantySearchResults([]);
    };
    
    // Select a project request from search results
    const selectProjectRequest = (request) => {
        setNewProjectRequestIDInternal(request.project_request_id);
        setProjectRequestSearchResults([]);
    };
    return (
        <div className="project-management-container">
            {!showAddProjectForm ? (
                <div className="dashboard-view">
                    {/* Header Section */}
                    <div className="dashboard-header">
                        <h1 className="dashboard-title">Project Overview</h1>
                        <button className="new-task-btn">+ New Task</button>
                    </div>

                    {/* Main Dashboard Sections */}
                    <div className="dashboard-sections">
                        {/* Overdue Tasks Section */}
                        <div className="dashboard-section overdue-tasks-section">
                            <div className="section-header">
                                <h2>Overdue Tasks</h2>
                            </div>
                            <div className="section-content">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Overdue</th>
                                            <th>Task</th>
                                            <th>Deadline</th>
                                            <th>Employee</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {isLoading.overdueTasks ? (
                                            <tr><td colSpan="4" className="loading-cell">Loading...</td></tr>
                                        ) : errors.overdueTasks ? (
                                            <tr><td colSpan="4" className="error-cell">Error: {errors.overdueTasks}</td></tr>
                                        ) : overdueTasks.length === 0 ? (
                                            <tr><td colSpan="4" className="no-data-cell">No overdue tasks</td></tr>
                                        ) : (
                                            overdueTasks.map((item, index) => (
                                                <tr key={index}>
                                                    <td className="due"><b>{item.Overdue}</b></td>
                                                    <td>{item.Task}</td>
                                                    <td>{item.Deadline}</td>
                                                    <td>{item.Employee}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Today's Tasks Section */}
                        <div className="dashboard-section todays-tasks-section">
                            <div className="section-header">
                                <h2>Today's Tasks</h2>
                            </div>
                            <div className="section-content">
                                <div className="task-tabs">
                                    <button
                                        className={`task-tab ${selectedNav3 === 'All3' ? 'active' : ''}`}
                                        onClick={() => handleNavClick2('All3')}
                                    >
                                        All
                                    </button>
                                    <button
                                        className={`task-tab ${selectedNav3 === 'Important' ? 'active' : ''}`}
                                        onClick={() => handleNavClick2('Important')}
                                    >
                                        Important
                                    </button>
                                    <button
                                        className={`task-tab ${selectedNav3 === 'Notes' ? 'active' : ''}`}
                                        onClick={() => handleNavClick2('Notes')}
                                    >
                                        Notes
                                    </button>
                                    <button
                                        className={`task-tab ${selectedNav3 === 'Links' ? 'active' : ''}`}
                                        onClick={() => handleNavClick2('Links')}
                                    >
                                        Links
                                    </button>
                                </div>

                                {selectedNav3 === 'All3' && (
                                    <div className="task-list-container">
                                        {isLoading.todayTasks ? (
                                            <div className="loading-cell">Loading...</div>
                                        ) : errors.todayTasks ? (
                                            <div className="error-cell">Error: {errors.todayTasks}</div>
                                        ) : todayTasks.length === 0 ? (
                                            <div className="no-data-cell">No tasks for today</div>
                                        ) : (
                                            <form className="task-list-form">
                                                {todayTasks.map((task, index) => (
                                                    <div key={index} className="task-item">
                                                        <input 
                                                            type="checkbox" 
                                                            id={`task-${index}`} 
                                                            name={`task-${index}`} 
                                                        />
                                                        <label htmlFor={`task-${index}`}>{task.Task}</label>
                                                    </div>
                                                ))}
                                            </form>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Project Summary Section */}
                        <div className="dashboard-section project-summary-section">
                            <div className="section-header">
                                <h2>Project Summary</h2>
                            </div>
                            <div className="section-content">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Project ID</th>
                                            <th>Type</th>
                                            <th>Start Date</th>
                                            <th>End Date</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {isLoading.projectSummary ? (
                                            <tr><td colSpan="6" className="loading-cell">Loading...</td></tr>
                                        ) : errors.projectSummary ? (
                                            <tr><td colSpan="6" className="error-cell">Error: {errors.projectSummary}</td></tr>
                                        ) : projectSummary.length === 0 ? (
                                            <tr><td colSpan="6" className="no-data-cell">No projects found</td></tr>
                                        ) : (
                                            projectSummary.map((project, index) => (
                                                <tr key={index} className={project.issue ? "has-issue" : ""}>
                                                    <td>{project.id}</td>
                                                    <td><b>{project.projectId}</b></td>
                                                    <td>{project.type}</td>
                                                    <td>{project.startDate}</td>
                                                    <td>{project.endDate}</td>
                                                    <td>
                                                        {project.issue ? 
                                                            <span className="status-badge issue">Has Issues</span> : 
                                                            <span className="status-badge ok">On Track</span>
                                                        }
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Projects Section */}
                        <div className="dashboard-section projects-section">
                            <div className="section-header">
                                <div className="project-type-tabs">
                                    <button
                                        className={`project-tab ${selectedNav2 === "Internal Project" ? "active" : ""}`}
                                        onClick={() => handleNavClick("Internal Project")}
                                    >
                                        Internal Projects
                                    </button>
                                    <button
                                        className={`project-tab ${selectedNav2 === "External Project" ? "active" : ""}`}
                                        onClick={() => handleNavClick("External Project")}
                                    >
                                        External Projects
                                    </button>
                                </div>
                                <button className="add-project-btn" onClick={handleAddProjectClick}>
                                    + Add Project
                                </button>
                            </div>
                            <div className="section-content">
                                {selectedNav2 === "External Project" && (
                                    <div className="table-container">
                                        <table className="data-table">
                                            <thead>
                                                <tr>
                                                    <th>Project Tracking ID</th>
                                                    <th>Project ID</th>
                                                    <th>Project Milestone</th>
                                                    <th>Start Date</th>
                                                    <th>Est. End Date</th>
                                                    <th>Project Warranty ID</th>
                                                    <th>Project Issue</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {isLoading.externalProjects ? (
                                                    <tr><td colSpan="7" className="loading-cell">Loading...</td></tr>
                                                ) : errors.externalProjects ? (
                                                    <tr><td colSpan="7" className="error-cell">Error: {errors.externalProjects}</td></tr>
                                                ) : dataExternal.length === 0 ? (
                                                    <tr><td colSpan="7" className="no-data-cell">No external projects</td></tr>
                                                ) : (
                                                    dataExternal.map((item, index) => (
                                                        <tr key={index} className={item.ProjectIssue ? "has-issue" : ""}>
                                                            <td>{item.ProjectTrackingID}</td>
                                                            <td><b>{item.ProjectID}</b></td>
                                                            <td>{item.ProjectMilestone}</td>
                                                            <td>{item.StartDate}</td>
                                                            <td>{item.EstimatedEndDate}</td>
                                                            <td>{item.ProjectWarrantyStatus}</td>
                                                            <td>{item.ProjectIssue}</td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                                {selectedNav2 === "Internal Project" && (
                                    <div className="table-container">
                                        <table className="data-table">
                                            <thead>
                                                <tr>
                                                    <th>Project Tracking ID</th>
                                                    <th>Project ID</th>
                                                    <th>Start Date</th>
                                                    <th>Est. End Date</th>
                                                    <th>Project Issue</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {isLoading.internalProjects ? (
                                                    <tr><td colSpan="5" className="loading-cell">Loading...</td></tr>
                                                ) : errors.internalProjects ? (
                                                    <tr><td colSpan="5" className="error-cell">Error: {errors.internalProjects}</td></tr>
                                                ) : dataInternal.length === 0 ? (
                                                    <tr><td colSpan="5" className="no-data-cell">No internal projects</td></tr>
                                                ) : (
                                                    dataInternal.map((item, index) => (
                                                        <tr key={index} className={item.ProjectIssue ? "has-issue" : ""}>
                                                            <td>{item.ProjectTrackingID}</td>
                                                            <td><b>{item.ProjectID}</b></td>
                                                            <td>{item.StartDate}</td>
                                                            <td>{item.EstimatedEndDate}</td>
                                                            <td>{item.ProjectIssue}</td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="add-project-modal">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>New Project Plan</h2>
                            <div className="project-type-tabs">
                                <button
                                    className={`project-tab ${selectedNavplan === "Internal" ? "active" : ""}`}
                                    onClick={() => handleNavClickdash("Internal")}
                                >
                                    Internal
                                </button>
                                <button
                                    className={`project-tab ${selectedNavplan === "External" ? "active" : ""}`}
                                    onClick={() => handleNavClickdash("External")}
                                >
                                    External
                                </button>
                            </div>
                        </div>

                        <div className="modal-body">
                            <h3 className="section-title">Project Tracking</h3>
                            
                            {selectedNavplan === "External" && (
                                <form onSubmit={handleAddExternalProject} className="project-form">
                                    <div className="form-row">
                                        <div className="form-column">
                                            <div className="form-group">
                                                <label className="form-label">
                                                    Project ID*
                                                </label>
                                                <div className="search-container">
                                                    <input 
                                                        className="form-input"
                                                        type="text"
                                                        placeholder="Project ID"
                                                        value={newProjectIDExternal}
                                                        onChange={handleExternalProjectIDChange}
                                                        onFocus={() => fetchInitialExternalProjects()}
                                                        required
                                                    />
                                                    {externalProjectSearchResults.length > 0 && (
                                                        <div className="search-results">
                                                            {externalProjectSearchResults.map((project, index) => (
                                                                <div 
                                                                    key={index} 
                                                                    className="search-result-item"
                                                                    onClick={() => selectExternalProject(project)}
                                                                >
                                                                    {project.project_id}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <div className="form-group">
                                                <label className="form-label">
                                                    Project Milestone
                                                </label>
                                                <select
                                                    className="form-input"
                                                    value={selectedProjectMilestoneExternal}
                                                    onChange={(e) => setSelectedProjectMilestoneExternal(e.target.value)}
                                                    required
                                                >
                                                    <option value="">Choose Project Milestone</option>
                                                    <option value="Project Initiation Completed">Project Initiation Completed</option>
                                                    <option value="Project Initiation Ongoing">Project Initiation Ongoing</option>
                                                    <option value="Project Initiation Rejected">Project Initiation Rejected</option>
                                                </select>
                                            </div>
                                            
                                            <div className="form-group">
                                                <label className="form-label">
                                                    Start Date
                                                </label>
                                                <input
                                                    className="form-input"
                                                    type="date"
                                                    value={newStartDateExternal}
                                                    onChange={(e) => setNewStartDateExternal(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            
                                            <div className="form-group">
                                                <label className="form-label">
                                                    Est. End Date
                                                </label>
                                                <input
                                                    className="form-input"
                                                    type="date"
                                                    value={newEndDateExternal}
                                                    onChange={(e) => setNewEndDateExternal(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            
                                            <div className="form-group">
                                                <label className="form-label">
                                                    Project Warranty ID
                                                </label>
                                                <div className="search-container">
                                                    <input
                                                        className="form-input"
                                                        type="text"
                                                        placeholder="Insert Warranty ID"
                                                        value={newProjectWarrantyIDExternal}
                                                        onChange={handleWarrantyIDChange}
                                                        onFocus={() => fetchInitialWarranties()}
                                                    />
                                                    {warrantySearchResults.length > 0 && (
                                                        <div className="search-results">
                                                            {warrantySearchResults.map((warranty, index) => (
                                                                <div 
                                                                    key={index} 
                                                                    className="search-result-item"
                                                                    onClick={() => selectWarranty(warranty)}
                                                                >
                                                                    {warranty.id} - {warranty.coverage_years} years
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="form-column">
                                            <div className="form-group">
                                                <label className="form-label">
                                                    Project Issue
                                                </label>
                                                <textarea
                                                    className="form-textarea"
                                                    placeholder="Add Project Issue"
                                                    value={newProjectIssueExternal}
                                                    onChange={(e) => setNewProjectIssueExternal(e.target.value)}
                                                    rows="10"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="form-actions">
                                        <button type="button" className="cancel-btn" onClick={handleCancelAddProject}>
                                            Cancel
                                        </button>
                                        <button type="submit" className="save-btn">
                                            Save Project
                                        </button>
                                    </div>
                                </form>
                            )}
                            
                            {selectedNavplan === "Internal" && (
                                <form onSubmit={handleAddInternalProject} className="project-form">
                                    <div className="form-row">
                                        <div className="form-column">
                                            <div className="form-group">
                                                <label className="form-label">
                                                    Project ID*
                                                </label>
                                                <div className="search-container">
                                                    <input 
                                                        className="form-input"
                                                        type="text"
                                                        placeholder="Project ID"
                                                        value={newProjectIDInternal}
                                                        onChange={handleInternalProjectIDChange}
                                                        onFocus={() => fetchInitialInternalProjects()}
                                                        required
                                                    />
                                                    {internalProjectSearchResults.length > 0 && (
                                                        <div className="search-results">
                                                            {internalProjectSearchResults.map((project, index) => (
                                                                <div 
                                                                    key={index} 
                                                                    className="search-result-item"
                                                                    onClick={() => selectInternalProject(project)}
                                                                >
                                                                    {project.intrnl_project_id}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <div className="form-group">
                                                <label className="form-label">
                                                    Project Request ID
                                                </label>
                                                <div className="search-container">
                                                    <input
                                                        className="form-input"
                                                        type="text"
                                                        placeholder="Insert Project Request ID"
                                                        value={newProjectRequestIDInternal}
                                                        onChange={handleProjectRequestIDChange}
                                                        onFocus={() => fetchInitialProjectRequests()}
                                                    />
                                                    {projectRequestSearchResults.length > 0 && (
                                                        <div className="search-results">
                                                            {projectRequestSearchResults.map((request, index) => (
                                                                <div 
                                                                    key={index} 
                                                                    className="search-result-item"
                                                                    onClick={() => selectProjectRequest(request)}
                                                                >
                                                                    {request.project_request_id} - {request.project_name}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <div className="form-group">
                                                <label className="form-label">
                                                    Start Date
                                                </label>
                                                <input
                                                    className="form-input"
                                                    type="date"
                                                    value={newStartDateInternal}
                                                    onChange={(e) => setNewStartDateInternal(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            
                                            <div className="form-group">
                                                <label className="form-label">
                                                    Est. End Date
                                                </label>
                                                <input
                                                    className="form-input"
                                                    type="date"
                                                    value={newEndDateInternal}
                                                    onChange={(e) => setNewEndDateInternal(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="form-column">
                                            <div className="form-group">
                                                <label className="form-label">
                                                    Project Issue
                                                </label>
                                                <textarea
                                                    className="form-textarea"
                                                    placeholder="Add Project Issue"
                                                    value={newProjectIssueInternal}
                                                    onChange={(e) => setNewProjectIssueInternal(e.target.value)}
                                                    rows="10"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="form-actions">
                                        <button type="button" className="cancel-btn" onClick={handleCancelAddProject}>
                                            Cancel
                                        </button>
                                        <button type="submit" className="save-btn">
                                            Save Project
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );};
export default BodyContent;