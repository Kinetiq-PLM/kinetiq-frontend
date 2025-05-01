import React, { useState, useEffect } from "react";
import "../styles/TaskMonitoring.css";
import axios from 'axios';

const API_URL = '/project-tasks/api';
const ITEMS_PER_PAGE = 5; // Number of items to show per page

const TaskMonitoring = () => {
  const [newProjectID, setNewProjectID] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskdeadline, setNewTaskdeadline] = useState("");
  const [selectedTaskstatus, setSelectedTaskstatus] = useState("");
  const [newLaborid, setNewLaborid] = useState("");
  
  const [selectedNavtask, setSelectedNavtask] = useState("External Task");
  const [showTasklist, setShowTasklist] = useState(false);
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
    setShowTasklist(false);
    setSelectedReports([]); 
  };

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
      
      setShowTasklist(true);
      resetForm();
    } catch (err) {
      setError(`Failed to create task: ${err.response?.data?.detail || err.message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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
      
      setShowTasklist(true);
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

  const handleBackClick = () => {
    setShowTasklist(false);
    setSelectedReports([]); 
  };

  const handleCheckboxChange = (index) => {
    const isSelected = selectedReports.includes(index);
    if (isSelected) {
      setSelectedReports(selectedReports.filter((item) => item !== index));
    } else {
      setSelectedReports([...selectedReports, index]);
    }
  };

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
  
  // Render a simple loading state if we're still loading initial data
  if (loading && !taskdata.length && !taskdata2.length) {
    return (
      <div className="task-monitoring-container">
        <div className="loading-overlay">
          <div className="loading-spinner">Loading...</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="task-monitoring-container">
      <div className="task-nav-container">
        <button
          className={`task-nav-button ${selectedNavtask === "Internal Task" ? "active" : ""}`}
          onClick={() => handleNavClick("Internal Task")}
        >
          Internal Tasks
        </button>
        <button
          className={`task-nav-button ${selectedNavtask === "External Task" ? "active" : ""}`}
          onClick={() => handleNavClick("External Task")}
        >
          External Tasks
        </button>
      </div>

      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner">Loading...</div>
        </div>
      )}

      {error && (
        <div className="error-alert">
          <span>{error}</span>
          <button onClick={() => setError(null)}>&times;</button>
        </div>
      )}

      {/* Tasks Table */}
      <div className="tasks-table-container">
        <h3>Current Tasks</h3>
        <div className="table-responsive">
          <table className="tasks-table">
            <thead>
              <tr>
                <th>Task ID</th>
                <th>Project Name</th>
                <th>Description</th>
                <th>Status</th>
                <th>Deadline</th>
                <th>Assigned To</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((task, index) => (
                <tr key={index}>
                  <td>{task?.task_id || ''}</td>
                  <td>{task?.ext_project_name || task?.project_name || ''}</td>
                  <td>{task?.task_description || ''}</td>
                  <td>
                    {task?.task_status ? (
                      <span className={`status-badge ${(task.task_status || '').replace('_', '-')}`}>
                        {(task.task_status || '').replace('_', ' ')}
                      </span>
                    ) : ''}
                  </td>
                  <td>{task?.task_deadline || ''}</td>
                  <td>{`${task?.first_name || ''} ${task?.last_name || ''}`}</td>
                </tr>
              ))}
              {currentData.length === 0 && (
                <tr>
                  <td colSpan="6" className="no-tasks">
                    No tasks found
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
              Previous
            </button>
            <span className="pagination-info">
              Page {currentPageNum} of {totalPagesNum}
            </span>
            <button 
              onClick={handleNextPage} 
              disabled={currentPageNum === totalPagesNum}
              className="pagination-button"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {!showTasklist ? (
        <div className="task-form-container">
          <h2 className="form-title">New Project Task</h2>
          
          <form onSubmit={selectedNavtask === "External Task" ? handleFirstSubmitTask : handleSecondSubmitTask}>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="projectID">Project*</label>
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
                <label htmlFor="laborID">Assigned To*</label>
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
                <label htmlFor="taskStatus">Task Status*</label>
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
                <label htmlFor="taskDeadline">Task Deadline*</label>
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
                <label htmlFor="taskDescription">Task Description*</label>
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
                {loading ? "Saving..." : "Save Task"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="task-list-container">
          <div className="task-list-header">
            <h2>Project Task List</h2>
            <div className="list-actions">
              <button 
                onClick={handleBackClick} 
                className="secondary-button"
              >
                Add New Task
              </button>
              <button 
                onClick={handleRemoveReports} 
                className="danger-button"
                disabled={selectedReports.length === 0 || loading}
              >
                {loading ? "Removing..." : "Remove Selected"}
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
                    <th>Assigned To</th>
                    <th>Status</th>
                    <th>Deadline</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.map((task, index) => (
                    <tr key={index}>
                      <td className="select-col">
                        <input
                          type="checkbox"
                          checked={selectedReports.includes(index)}
                          onChange={() => handleCheckboxChange(index)}
                        />
                      </td>
                      <td><strong>{task?.task_id || ''}</strong></td>
                      <td>{task?.ext_project_name || task?.project_name || ''}</td>
                      <td>{`${task?.first_name || ''} ${task?.last_name || ''}`}</td>
                      <td>
                        {task?.task_status ? (
                          <span className={`status-badge ${(task.task_status || '').replace('_', '-')}`}>
                            {(task.task_status || '').replace('_', ' ')}
                          </span>
                        ) : ''}
                      </td>
                      <td>{task?.task_deadline || ''}</td>
                      <td className="description-cell">{task?.task_description || ''}</td>
                    </tr>
                  ))}
                  {currentData.length === 0 && (
                    <tr>
                      <td colSpan="7" className="no-tasks">
                        No tasks found
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
                  Previous
                </button>
                <span className="pagination-info">
                  Page {currentPageNum} of {totalPagesNum}
                </span>
                <button 
                  onClick={handleNextPage} 
                  disabled={currentPageNum === totalPagesNum}
                  className="pagination-button"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskMonitoring;