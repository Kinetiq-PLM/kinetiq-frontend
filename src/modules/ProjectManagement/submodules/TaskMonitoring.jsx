import React, { useState, useEffect, useRef } from "react";
import "../styles/TaskMonitoring.css";
import axios from 'axios';

const API_URL = '/project-tasks/api';
const ITEMS_PER_PAGE = 5; // Number of items to show per page

const TaskMonitoring = () => {
  // Create a ref for the container
  const containerRef = useRef(null);
  
  // State management
  const [newProjectID, setNewProjectID] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskdeadline, setNewTaskdeadline] = useState("");
  const [selectedTaskstatus, setSelectedTaskstatus] = useState("");
  const [newLaborid, setNewLaborid] = useState("");
  
  const [selectedNavtask, setSelectedNavtask] = useState("External Task");
  const [selectedReports, setSelectedReports] = useState([]);
  
  const [taskdata, setTaskdata] = useState([]);
  const [taskdata2, setTaskdata2] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [internalProjects, setInternalProjects] = useState([]);
  const [externalProjects, setExternalProjects] = useState([]);
  const [internalLabor, setInternalLabor] = useState([]);
  const [externalLabor, setExternalLabor] = useState([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPage2, setCurrentPage2] = useState(1);
  
  // Employee details modal state
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employeeDetails, setEmployeeDetails] = useState(null);
  const [employeeModalLoading, setEmployeeModalLoading] = useState(false);
  const [employeeModalError, setEmployeeModalError] = useState(null);

  // Success message state
  const [successMessage, setSuccessMessage] = useState(null);

  // Effect to hide external UI elements
  useEffect(() => {
    // Function to hide the unwanted UI elements
    const hideExternalUI = () => {
      // Find and hide any external "Project Task List" headers or similar elements
      const taskListHeaders = document.querySelectorAll('div[class*="task-list-header"], div[class*="project-task-header"]');
      taskListHeaders.forEach(header => {
        if (!containerRef.current?.contains(header)) {
          header.style.display = 'none';
        }
      });
      
      // Also try to find by content
      document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(heading => {
        if (heading.textContent.includes('Project Task List') && !containerRef.current?.contains(heading)) {
          // Find the closest container and hide it
          const container = heading.closest('div');
          if (container) {
            container.style.display = 'none';
          }
        }
      });
      
      // Hide any buttons that might be part of the external UI
      document.querySelectorAll('button').forEach(button => {
        if ((button.textContent.includes('Add New Task') || button.textContent.includes('Remove Selected')) 
            && !containerRef.current?.contains(button)) {
          button.style.display = 'none';
        }
      });
    };
    
    // Call once on mount
    hideExternalUI();
    
    // And set up an observer to handle dynamically added elements
    const observer = new MutationObserver(hideExternalUI);
    observer.observe(document.body, { childList: true, subtree: true });
    
    return () => {
      // Clean up the observer on component unmount
      observer.disconnect();
    };
  }, []);

  // Effect to auto-hide success message after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // API functions with error handling
  const fetchData = async (url, errorMessage) => {
    try {
      console.log(`Fetching data from: ${url}`);
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error(`${errorMessage}:`, error);
      // Return empty array instead of throwing error
      return [];
    }
  };

  const postData = async (url, data, errorMessage) => {
    try {
      console.log(`Posting data to: ${url}`, data);
      const response = await axios.post(url, data);
      return response.data;
    } catch (error) {
      console.error(`${errorMessage}:`, error);
      throw error;
    }
  };

  const deleteData = async (url, errorMessage) => {
    try {
      console.log(`Deleting data from: ${url}`);
      const response = await axios.delete(url);
      return response.data;
    } catch (error) {
      console.error(`${errorMessage}:`, error);
      throw error;
    }
  };

  // Format date for display - now used in the employee modal
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Get employee details from employee ID - Updated with better debugging
  const fetchEmployeeDetails = async (employeeId) => {
    if (!employeeId) {
      console.error("Cannot fetch employee details: Employee ID is missing");
      setEmployeeModalError("Employee ID is missing");
      return;
    }
    
    setEmployeeModalLoading(true);
    setEmployeeModalError(null);
    
    try {
      // Log the URL being requested
      console.log(`Fetching employee details from: ${API_URL}/employee-details/${employeeId}/`);
      
      // Make a real API call to fetch employee details
      const response = await axios.get(`${API_URL}/employee-details/${employeeId}/`);
      
      // Log the response data
      console.log("Employee details response:", response.data);
      
      if (response.data) {
        setEmployeeDetails(response.data);
      } else {
        setEmployeeModalError("No employee details found");
      }
    } catch (err) {
      console.error("Error fetching employee details:", err);
      setEmployeeModalError(`Failed to load employee details: ${err.response?.data?.detail || err.message}`);
    } finally {
      setEmployeeModalLoading(false);
    }
  };

  // Handle employee avatar click - Updated to prevent showing modal without employee ID
  const handleEmployeeClick = (employee) => {
    console.log("Employee clicked:", employee);
    
    if (!employee || !employee.employee_id) {
      console.error("Missing employee ID:", employee);
      // Don't show the modal if there's no employee ID
      alert("Cannot view employee details: Employee ID is missing");
      return;
    }
    
    setSelectedEmployee(employee);
    setShowEmployeeModal(true);
    setEmployeeDetails(null); // Clear previous employee details
    fetchEmployeeDetails(employee.employee_id);
  };

  // Load tasks based on selected tab
  useEffect(() => {
    const loadTasks = async () => {
      setLoading(true);
      setError(null);
      try {
        if (selectedNavtask === "External Task") {
          const data = await fetchData(`${API_URL}/external-tasks/`, 'Error fetching external tasks');
          setTaskdata(Array.isArray(data) ? data : []);
          setCurrentPage(1); // Reset to first page when switching
        } else {
          const data = await fetchData(`${API_URL}/internal-tasks/`, 'Error fetching internal tasks');
          setTaskdata2(Array.isArray(data) ? data : []);
          setCurrentPage2(1); // Reset to first page when switching
        }
      } catch (err) {
        setError("Failed to load tasks. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, [selectedNavtask]);

  // Load dropdown options
  useEffect(() => {
    const loadDropdownOptions = async () => {
      try {
        const internalProjectsData = await fetchData(`${API_URL}/internal-projects/`, 'Error fetching internal projects');
        setInternalProjects(Array.isArray(internalProjectsData) ? internalProjectsData : []);
        
        const externalProjectsData = await fetchData(`${API_URL}/external-projects/`, 'Error fetching external projects');
        setExternalProjects(Array.isArray(externalProjectsData) ? externalProjectsData : []);
        
        const internalLaborData = await fetchData(`${API_URL}/internal-labor/`, 'Error fetching internal labor');
        setInternalLabor(Array.isArray(internalLaborData) ? internalLaborData : []);
        
        const externalLaborData = await fetchData(`${API_URL}/external-labor/`, 'Error fetching external labor');
        setExternalLabor(Array.isArray(externalLaborData) ? externalLaborData : []);
      } catch (err) {
        console.error("Error loading dropdown options:", err);
      }
    };
    
    loadDropdownOptions();
  }, []);

  // Pagination logic
  const getPaginatedData = (data, page) => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return data.slice(startIndex, endIndex);
  };

  const totalPages = (data) => Math.ceil(data.length / ITEMS_PER_PAGE);

  const handleNextPage = () => {
    if (selectedNavtask === "External Task") {
      if (currentPage < totalPages(taskdata)) {
        setCurrentPage(currentPage + 1);
      }
    } else {
      if (currentPage2 < totalPages(taskdata2)) {
        setCurrentPage2(currentPage2 + 1);
      }
    }
  };

  const handlePrevPage = () => {
    if (selectedNavtask === "External Task") {
      if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } else {
      if (currentPage2 > 1) {
        setCurrentPage2(currentPage2 - 1);
      }
    }
  };

  const handleNavClick = (nav) => {
    setSelectedNavtask(nav);
    setSelectedReports([]);
  };

  // Form submission for external tasks
  const handleFirstSubmitTask = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const newData = {
      ProjectID: newProjectID,
      TaskDescription: newTaskDescription,
      TaskStatus: selectedTaskstatus,
      Taskdeadline: newTaskdeadline,
      Laborid: newLaborid,
    };
    
    try {
      console.log("Submitting external task data:", newData);
      await postData(`${API_URL}/external-tasks/create/`, newData, 'Error creating external task');
      
      const updatedTasks = await fetchData(`${API_URL}/external-tasks/`, 'Error fetching external tasks');
      setTaskdata(Array.isArray(updatedTasks) ? updatedTasks : []);
      
      // Show success message
      setSuccessMessage("External task created successfully!");
      
      // Reset form
      resetForm();
    } catch (err) {
      setError(`Failed to create task: ${err.response?.data?.detail || err.message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Form submission for internal tasks
  const handleSecondSubmitTask = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const newData = {
      ProjectID: newProjectID,
      TaskDescription: newTaskDescription,
      TaskStatus: selectedTaskstatus,
      Taskdeadline: newTaskdeadline,
      Laborid: newLaborid,
    };
    
    try {
      console.log("Submitting internal task data:", newData);
      await postData(`${API_URL}/internal-tasks/create/`, newData, 'Error creating internal task');
      
      const updatedTasks = await fetchData(`${API_URL}/internal-tasks/`, 'Error fetching internal tasks');
      setTaskdata2(Array.isArray(updatedTasks) ? updatedTasks : []);
      
      // Show success message
      setSuccessMessage("Internal task created successfully!");
      
      // Reset form
      resetForm();
    } catch (err) {
      setError(`Failed to create task: ${err.response?.data?.detail || err.message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setNewProjectID("");
    setNewTaskDescription("");
    setSelectedTaskstatus("");
    setNewTaskdeadline("");
    setNewLaborid("");
  };

  const handleCheckboxChange = (index) => {
    const isSelected = selectedReports.includes(index);
    if (isSelected) {
      setSelectedReports(selectedReports.filter((item) => item !== index));
    } else {
      setSelectedReports([...selectedReports, index]);
    }
  };

  // Delete selected tasks
  const handleRemoveReports = async () => {
    if (selectedReports.length === 0) return;
    
    setLoading(true);
    setError(null);
    
    try {
      if (selectedNavtask === "External Task") {
        // Get the actual indices from the full data array
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const deletePromises = selectedReports.map(index => {
          const actualIndex = startIndex + index;
          const taskId = taskdata[actualIndex]?.task_id;
          if (!taskId) return Promise.resolve();
          return deleteData(`${API_URL}/external-tasks/${taskId}/`, `Error deleting external task ${taskId}`);
        });
        
        await Promise.all(deletePromises);
        
        const updatedTasks = await fetchData(`${API_URL}/external-tasks/`, 'Error fetching external tasks');
        setTaskdata(Array.isArray(updatedTasks) ? updatedTasks : []);
        
        // Show success message
        setSuccessMessage(`Successfully deleted ${selectedReports.length} external task(s)!`);
      } else {
        // Get the actual indices from the full data array
        const startIndex = (currentPage2 - 1) * ITEMS_PER_PAGE;
        const deletePromises = selectedReports.map(index => {
          const actualIndex = startIndex + index;
          const taskId = taskdata2[actualIndex]?.task_id;
          if (!taskId) return Promise.resolve();
          return deleteData(`${API_URL}/internal-tasks/${taskId}/`, `Error deleting internal task ${taskId}`);
        });
        
        await Promise.all(deletePromises);
        
        const updatedTasks = await fetchData(`${API_URL}/internal-tasks/`, 'Error fetching internal tasks');
        setTaskdata2(Array.isArray(updatedTasks) ? updatedTasks : []);
        
        // Show success message
        setSuccessMessage(`Successfully deleted ${selectedReports.length} internal task(s)!`);
      }
      
      setSelectedReports([]);
    } catch (err) {
      setError("Failed to delete tasks. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Get the current page data
  const currentData = selectedNavtask === "External Task" 
    ? getPaginatedData(taskdata, currentPage)
    : getPaginatedData(taskdata2, currentPage2);
  
  // Get the current page number and total pages
  const currentPageNum = selectedNavtask === "External Task" ? currentPage : currentPage2;
  const totalPagesNum = selectedNavtask === "External Task" 
    ? totalPages(taskdata) 
    : totalPages(taskdata2);
  
  // Helper function to format status for display
  const formatStatus = (status) => {
    if (!status) return '';
    return status.replace('_', ' ');
  };
  
  // Helper function to get status class
  const getStatusClass = (status) => {
    if (!status) return '';
    return status.replace('_', '-');
  };
  
  // Count tasks by status
  const getTaskCounts = () => {
    const data = selectedNavtask === "External Task" ? taskdata : taskdata2;
    return {
      completed: data.filter(t => t.task_status === 'completed').length,
      inProgress: data.filter(t => t.task_status === 'in_progress').length,
      pending: data.filter(t => t.task_status === 'pending').length
    };
  };
  
  const taskCounts = getTaskCounts();
  
  // Render a simple loading state if we're still loading initial data
  if (loading && !taskdata.length && !taskdata2.length) {
    return (
      <div className="task-monitoring-container" ref={containerRef}>
        <div className="loading-overlay">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading tasks...</p>
          </div>
        </div>
      </div>
    );
  }
  
  // Add CSS to hide unwanted elements
  const hideExternalHeadersStyle = `
    .project-task-list-header, 
    .task-list-header:not(.task-monitoring-container *),
    div:has(> h1:contains("Project Task List")),
    div:has(> h2:contains("Project Task List")),
    div:has(> h3:contains("Project Task List")),
    div:has(> button:contains("Add New Task")):not(.task-monitoring-container *),
    div:has(> button:contains("Remove Selected")):not(.task-monitoring-container *) {
      display: none !important;
    }
  `;
  
  return (
    <div className="task-monitoring-container" ref={containerRef}>
      {/* Inject style to hide external headers */}
      <style>{hideExternalHeadersStyle}</style>
      
      <div className="header-section">
        <h1 className="dashboard-title">
          <i className="fas fa-tasks"></i>
          Task Management Dashboard
        </h1>
      </div>
      
      <div className="dashboard-content">
        <div className="task-nav-container">
          <button
            className={`task-nav-button ${selectedNavtask === "Internal Task" ? "active" : ""}`}
            onClick={() => handleNavClick("Internal Task")}
          >
            <i className="fas fa-project-diagram"></i> Internal Tasks
          </button>
          <button
            className={`task-nav-button ${selectedNavtask === "External Task" ? "active" : ""}`}
            onClick={() => handleNavClick("External Task")}
          >
            <i className="fas fa-external-link-alt"></i> External Tasks
          </button>
        </div>

        {loading && (
          <div className="loading-overlay">
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Processing your request...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="error-alert">
            <div>
              <i className="fas fa-exclamation-circle"></i>
              <span>{error}</span>
            </div>
            <button onClick={() => setError(null)}>&times;</button>
          </div>
        )}
        
        {/* Success message toast */}
        {successMessage && (
          <div className="success-toast">
            <div>
              <i className="fas fa-check-circle"></i>
              <span>{successMessage}</span>
            </div>
            <button onClick={() => setSuccessMessage(null)}>&times;</button>
          </div>
        )}

        {/* Tasks List Card - Now this is the main task list instead of "Current Tasks" */}
        <div className="task-list-card">
          <div className="card-header">
            <div className="header-content">
              <h2><i className="fas fa-clipboard-list"></i> Current Tasks</h2>
            </div>
            <div className="task-summary">
              <div className="summary-item">
                <i className="fas fa-check-circle completed"></i>
                <span>{taskCounts.completed} Completed</span>
              </div>
              <div className="summary-item">
                <i className="fas fa-spinner in-progress"></i>
                <span>{taskCounts.inProgress} In Progress</span>
              </div>
              <div className="summary-item">
                <i className="fas fa-clock pending"></i>
                <span>{taskCounts.pending} Pending</span>
              </div>
              <button 
                onClick={handleRemoveReports} 
                className="danger-button"
                disabled={selectedReports.length === 0 || loading}
              >
                {loading ? <><i className="fas fa-spinner fa-spin"></i> Removing...</> : <><i className="fas fa-trash-alt"></i> Remove Selected</>}
              </button>
            </div>
          </div>

          <div className="task-table-container">
            <div className="table-responsive">
              <table className="task-table">
                <thead>
                  <tr>
                    <th className="select-col"></th>
                    <th>Task ID</th>
                    <th>Project Name</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Deadline</th>
                    <th>Assigned To</th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.map((task, index) => {
                    // Get initials for avatar
                    const firstName = task?.first_name || '';
                    const lastName = task?.last_name || '';
                    const initials = (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
                    
                    // Check if deadline is past
                    const deadlineDate = task?.task_deadline ? new Date(task.task_deadline) : null;
                    const isPastDeadline = deadlineDate && deadlineDate < new Date();
                    
                    // Check if we have a valid employee ID
                    const hasEmployeeId = !!task?.employee_id;
                    
                    return (
                      <tr key={index} className={selectedReports.includes(index) ? 'selected-row' : ''}>
                        <td className="select-col">
                          <input
                            type="checkbox"
                            checked={selectedReports.includes(index)}
                            onChange={() => handleCheckboxChange(index)}
                          />
                        </td>
                        <td>
                          <span className="task-id">{task?.task_id || ''}</span>
                        </td>
                        <td>{task?.ext_project_name || task?.project_name || ''}</td>
                        <td className="description-cell">
                          <div className="description-content">
                            {task?.task_description || ''}
                          </div>
                        </td>
                        <td>
                          {task?.task_status ? (
                            <span className={`status-badge ${getStatusClass(task.task_status)}`}>
                              <i className={
                                task.task_status === 'completed' ? 'fas fa-check-circle' :
                                task.task_status === 'in_progress' ? 'fas fa-spinner fa-spin' :
                                task.task_status === 'pending' ? 'fas fa-clock' : 'fas fa-ban'
                              }></i>
                              {formatStatus(task.task_status)}
                            </span>
                          ) : ''}
                        </td>
                        <td>
                          <div className={`deadline-cell ${isPastDeadline ? 'past-deadline' : ''}`}>
                            {isPastDeadline && <i className="fas fa-exclamation-triangle warning-icon"></i>}
                            {task?.task_deadline || ''}
                          </div>
                        </td>
                        <td>
                          <div className="assigned-user">
                            <div 
                              className="user-avatar"
                              style={{ cursor: hasEmployeeId ? 'pointer' : 'not-allowed' }} 
                              onClick={() => {
                                if (hasEmployeeId) {
                                  handleEmployeeClick({
                                    employee_id: task.employee_id,
                                    first_name: task.first_name,
                                    last_name: task.last_name
                                  });
                                } else {
                                  alert("Cannot view employee details: Employee ID is missing");
                                }
                              }}
                              title={hasEmployeeId ? "Click to view employee details" : "No employee ID available"}
                            >
                              {initials || 'N/A'}
                            </div>
                            <div className="user-info">
                              <div className="user-name">{`${task?.first_name || ''} ${task?.last_name || ''}`}</div>
                              <div className="user-id">{task?.employee_id ? `ID: ${task.employee_id}` : 'No ID'}</div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {currentData.length === 0 && (
                    <tr>
                      <td colSpan="7" className="no-tasks">
                        <i className="fas fa-clipboard-list"></i>
                        <h3>No tasks found</h3>
                        <p>Create a new task below to get started</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Controls */}
            {(selectedNavtask === "External Task" ? taskdata.length : taskdata2.length) > ITEMS_PER_PAGE && (
              <div className="pagination-controls">
                <button 
                  onClick={handlePrevPage} 
                  disabled={currentPageNum === 1}
                  className="pagination-button"
                >
                  <i className="fas fa-chevron-left"></i> Previous
                </button>
                <span className="pagination-info">
                  Page {currentPageNum} of {totalPagesNum}
                </span>
                <button 
                  onClick={handleNextPage} 
                  disabled={currentPageNum === totalPagesNum}
                  className="pagination-button"
                >
                  Next <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Task Form Card - Now always visible below the task list */}
        <div className="task-form-card">
          <div className="card-header">
            <h2 className="form-title"><i className="fas fa-plus-circle"></i> New Project Task</h2>
          </div>
          
          <form onSubmit={selectedNavtask === "External Task" ? handleFirstSubmitTask : handleSecondSubmitTask}>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="projectID"><i className="fas fa-project-diagram"></i> Project*</label>
                <select
                  id="projectID"
                  value={newProjectID}
                  onChange={(e) => setNewProjectID(e.target.value)}
                  required
                  className="form-control"
                >
                  <option value="">Select Project</option>
                  {(selectedNavtask === "External Task" ? externalProjects : internalProjects).map((project, idx) => (
                    <option 
                      key={idx} 
                      value={project?.project_id || project?.intrnl_project_id || ''}
                    >
                      {project?.ext_project_name || project?.project_name || project?.project_id || project?.intrnl_project_id || ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="laborID"><i className="fas fa-user-tie"></i> Assigned To*</label>
                <select
                  id="laborID"
                  value={newLaborid}
                  onChange={(e) => setNewLaborid(e.target.value)}
                  required
                  className="form-control"
                >
                  <option value="">Select Employee</option>
                  {(selectedNavtask === "External Task" ? externalLabor : internalLabor).map((labor, idx) => (
                    <option 
                      key={idx} 
                      value={labor?.project_labor_id || ''}
                    >
                      {`${labor?.first_name || ''} ${labor?.last_name || ''} ${labor?.employee_id ? `(${labor.employee_id})` : ''}`}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="taskStatus"><i className="fas fa-tasks"></i> Task Status*</label>
                <select
                  id="taskStatus"
                  value={selectedTaskstatus}
                  onChange={(e) => setSelectedTaskstatus(e.target.value)}
                  required
                  className="form-control"
                >
                  <option value="">Select Status</option>
                  <option value="completed">Completed</option>
                  <option value="in_progress">In Progress</option>
                  <option value="pending">Pending</option>
                  <option value="canceled">Canceled</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="taskDeadline"><i className="fas fa-calendar-alt"></i> Task Deadline*</label>
                <input
                  id="taskDeadline"
                  type="date"
                  value={newTaskdeadline}
                  onChange={(e) => setNewTaskdeadline(e.target.value)}
                  required
                  className="form-control"
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="taskDescription"><i className="fas fa-align-left"></i> Task Description*</label>
                <textarea
                  id="taskDescription"
                  placeholder="Enter task description..."
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                  required
                  className="form-control"
                  rows="4"
                />
              </div>
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                className="primary-button"
                disabled={loading}
              >
                {loading ? <><i className="fas fa-spinner fa-spin"></i> Saving...</> : <><i className="fas fa-save"></i> Save Task</>}
              </button>
            </div>
          </form>
        </div>
        
        {/* Employee Details Modal - Now using selectedEmployee and formatDate */}
        {showEmployeeModal && (
          <div className="modal-overlay" onClick={() => setShowEmployeeModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>
                  <i className="fas fa-user-circle"></i>                   {selectedEmployee ? 
                    `Employee: ${selectedEmployee.first_name} ${selectedEmployee.last_name}` : 
                    'Employee Details'}
                </h3>
                <button className="modal-close" onClick={() => setShowEmployeeModal(false)}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              
              {employeeModalLoading ? (
                <div className="modal-loading">
                  <div className="spinner"></div>
                  <p>Loading employee details...</p>
                </div>
              ) : employeeModalError ? (
                <div className="modal-body">
                  <div className="error-message">
                    <i className="fas fa-exclamation-circle"></i>
                    <p>{employeeModalError}</p>
                    {selectedEmployee && (
                      <p>Could not load details for employee ID: {selectedEmployee.employee_id}</p>
                    )}
                  </div>
                </div>
              ) : employeeDetails ? (
                <div className="modal-body">
                  <div className="employee-profile">
                    <div className="employee-avatar-large">
                      {(employeeDetails.first_name?.charAt(0) || '') + (employeeDetails.last_name?.charAt(0) || '')}
                    </div>
                    <div className="employee-name-section">
                      <h2>{`${employeeDetails.first_name || ''} ${employeeDetails.last_name || ''}`}</h2>
                      <span className={`employee-status ${employeeDetails.status?.toLowerCase().replace(' ', '-') || ''}`}>
                        <i className={
                          employeeDetails.status === 'Active' ? 'fas fa-circle' : 
                          employeeDetails.status === 'On leave' ? 'fas fa-umbrella-beach' : 
                          'fas fa-plane-departure'
                        }></i>
                        {employeeDetails.status || 'Unknown'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="employee-details-grid">
                    <div className="employee-detail-item">
                      <div className="detail-label">
                        <i className="fas fa-id-badge"></i> Employee ID
                      </div>
                      <div className="detail-value">{employeeDetails.employee_id || '-'}</div>
                    </div>
                    
                    <div className="employee-detail-item">
                      <div className="detail-label">
                        <i className="fas fa-building"></i> Department
                      </div>
                      <div className="detail-value">
                        {employeeDetails.dept_name || employeeDetails.dept_id || '-'}
                      </div>
                    </div>
                    
                    <div className="employee-detail-item">
                      <div className="detail-label">
                        <i className="fas fa-briefcase"></i> Position
                      </div>
                      <div className="detail-value">
                        {employeeDetails.position_title || employeeDetails.position_id || '-'}
                      </div>
                    </div>
                    
                    <div className="employee-detail-item">
                      <div className="detail-label">
                        <i className="fas fa-phone"></i> Phone
                      </div>
                      <div className="detail-value">{employeeDetails.phone || '-'}</div>
                    </div>
                    
                    <div className="employee-detail-item">
                      <div className="detail-label">
                        <i className="fas fa-user-tie"></i> Employment Type
                      </div>
                      <div className="detail-value">{employeeDetails.employment_type || '-'}</div>
                    </div>
                    
                    {/* Use formatDate for date fields */}
                    {employeeDetails.created_at && (
                      <div className="employee-detail-item">
                        <div className="detail-label">
                          <i className="fas fa-calendar-plus"></i> Joined Date
                        </div>
                        <div className="detail-value">{formatDate(employeeDetails.created_at)}</div>
                      </div>
                    )}
                    
                    {employeeDetails.updated_at && (
                      <div className="employee-detail-item">
                        <div className="detail-label">
                          <i className="fas fa-calendar-check"></i> Last Updated
                        </div>
                        <div className="detail-value">{formatDate(employeeDetails.updated_at)}</div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="modal-body">
                  <p className="no-data">
                    {selectedEmployee ? 
                      `No details available for ${selectedEmployee.first_name} ${selectedEmployee.last_name}` : 
                      'No employee details available'}
                  </p>
                </div>
              )}
              
              <div className="modal-footer">
                <button className="secondary-button" onClick={() => setShowEmployeeModal(false)}>
                  <i className="fas fa-times"></i> Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskMonitoring;