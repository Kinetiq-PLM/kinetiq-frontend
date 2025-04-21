import React, { useState, useEffect } from "react";
import "../styles/TaskMonitoring.css";
import { 
  fetchInternalTasks, 
  fetchExternalTasks, 
  createInternalTask, 
  createExternalTask, 
  deleteInternalTask, 
  deleteExternalTask,
  getInternalProjects,
  getExternalProjects,
  getInternalLabor,
  getExternalLabor
}  from "/src/modules/ProjectManagement/services/taskService";

const TaskMonitoring = () => {
  const [newProjectID, setNewProjectID] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskdeadline, setNewTaskdeadline] = useState("");
  const [selectedTaskstatus, setSelectedTaskstatus] = useState("");
  const [newLaborid, setNewLaborid] = useState("");
  const [newTaskid, setNewTaskid] = useState("");

  const [currentForm, setCurrentForm] = useState(1);
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

  useEffect(() => {
    const loadTasks = async () => {
      setLoading(true);
      setError(null);
      try {
        if (selectedNavtask === "External Task") {
          const data = await fetchExternalTasks();
          setTaskdata(data.results || data);
        } else {
          const data = await fetchInternalTasks();
          setTaskdata2(data.results || data);
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
        const internalProjectsData = await getInternalProjects();
        setInternalProjects(internalProjectsData);
        
        const externalProjectsData = await getExternalProjects();
        setExternalProjects(externalProjectsData);
        
        const internalLaborData = await getInternalLabor();
        setInternalLabor(internalLaborData);
        
        const externalLaborData = await getExternalLabor();
        setExternalLabor(externalLaborData);
      } catch (err) {
        console.error("Error loading dropdown options:", err);
      }
    };
    
    loadDropdownOptions();
  }, []);

  const handleNavClick = (nav) => {
    setSelectedNavtask(nav);
    console.log(`Nav clicked: ${nav}`);
    setCurrentForm(1);
    setShowTasklist(false);
    setSelectedReports([]); 
  };

  const handleFirstSubmitTask = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const taskId = newTaskid || `TASK-${Date.now().toString(36)}`;
    
    const newData = {
      Taskid: taskId,
      ProjectID: newProjectID,
      TaskDescription: newTaskDescription,
      TaskStatus: selectedTaskstatus,
      Taskdeadline: newTaskdeadline,
      Laborid: newLaborid,
    };
    
    try {
      console.log("Submitting task data:", newData);
      const response = await createExternalTask(newData);
      console.log("External task created:", response);
      
      const updatedTasks = await fetchExternalTasks();
      setTaskdata(updatedTasks.results || updatedTasks);
      
      setShowTasklist(true);
      setCurrentForm(null);
      resetExternalForm();
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
      Taskid: newTaskid,
      ProjectID: newProjectID,
      TaskDescription: newTaskDescription,
      TaskStatus: selectedTaskstatus,
      Taskdeadline: newTaskdeadline,
      Laborid: newLaborid,
    };
    
    try {
      const response = await createInternalTask(newData);
      console.log("Internal task created:", response);
      
      const updatedTasks = await fetchInternalTasks();
      setTaskdata2(updatedTasks.results || updatedTasks);
      
      setShowTasklist(true);
      setCurrentForm(null);
      resetExternalForm();
    } catch (err) {
      setError("Failed to create task. Please check your inputs and try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  
  const resetExternalForm = () => {
    setNewProjectID("");
    setNewTaskDescription("");
    setSelectedTaskstatus("");
    setNewTaskdeadline("");
    setNewLaborid("");
    setNewTaskid("");
  };

  const handleBackClick = () => {
    setShowTasklist(false);
    setCurrentForm(1);
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
        const deletePromises = selectedReports.map(index => {
          const taskId = taskdata[index].task_id;
          return deleteExternalTask(taskId);
        });
        
        await Promise.all(deletePromises);
        
        const updatedTasks = await fetchExternalTasks();
        setTaskdata(updatedTasks.results || updatedTasks);
      } else {
        const deletePromises = selectedReports.map(index => {
          const taskId = taskdata2[index].intrnl_task_id;
          return deleteInternalTask(taskId);
        });
        
        await Promise.all(deletePromises);
        
        const updatedTasks = await fetchInternalTasks();
        setTaskdata2(updatedTasks.results || updatedTasks);
      }
      
      setSelectedReports([]);
    } catch (err) {
      setError("Failed to delete tasks. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const mapExternalTasksToDisplay = (tasks) => {
    return tasks.map(task => ({
      Taskid: task.task_id,
      ProjectID: task.project_id,
      TaskDescription: task.task_description,
      TaskStatus: task.task_status,
      Taskdeadline: task.task_deadline,
      Laborid: task.project_labor_id,
    }));
  };

  const mapInternalTasksToDisplay = (tasks) => {
    return tasks.map(task => ({
      Taskid: task.intrnl_task_id,
      ProjectID: task.intrnl_project_id,
      TaskDescription: task.intrnl_task_description,
      TaskStatus: task.intrnl_task_status,
      Taskdeadline: task.intrnl_task_deadline,
      Laborid: task.intrnl_project_labor_id,
    }));
  };

  
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
  
        {!showTasklist ? (
          <div className="task-form-container">
            <h2 className="form-title">New Project Task</h2>
            
            <form onSubmit={selectedNavtask === "External Task" ? handleFirstSubmitTask : handleSecondSubmitTask}>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="projectID">Project ID*</label>
                  <select
                    id="projectID"
                    value={newProjectID}
                    onChange={(e) => setNewProjectID(e.target.value)}
                    required
                  >
                    <option value="">Select Project ID</option>
                    {(selectedNavtask === "External Task" ? externalProjects : internalProjects).map((project) => (
                      <option 
                        key={project.project_id || project.intrnl_project_id} 
                        value={project.project_id || project.intrnl_project_id}
                      >
                        {project.project_id || project.intrnl_project_id} 
                        {project.project_name ? ` - ${project.project_name}` : 
                         project.intrnl_project_name ? ` - ${project.intrnl_project_name}` : ''}
                      </option>
                    ))}
                  </select>
                </div>
  
                <div className="form-group">
                  <label htmlFor="laborID">Labor ID*</label>
                  <select
                    id="laborID"
                    value={newLaborid}
                    onChange={(e) => setNewLaborid(e.target.value)}
                    required
                  >
                    <option value="">Select Labor ID</option>
                    {(selectedNavtask === "External Task" ? externalLabor : internalLabor).map((labor) => (
                      <option 
                        key={labor.project_labor_id || labor.intrnl_project_labor_id} 
                        value={labor.project_labor_id || labor.intrnl_project_labor_id}
                      >
                        {labor.project_labor_id || labor.intrnl_project_labor_id} 
                        {labor.employee_id ? ` - ${labor.employee_id}` : ''}
                      </option>
                    ))}
                  </select>
                </div>
  
                <div className="form-group">
                  <label htmlFor="taskStatus">Task Status</label>
                  <select
                    id="taskStatus"
                    value={selectedTaskstatus}
                    onChange={(e) => setSelectedTaskstatus(e.target.value)}
                    required
                  >
                    <option value="">Select Status</option>
                    <option value="completed">Completed</option>
                    <option value="in_progress">In Progress</option>
                    <option value="pending">Pending</option>
                    <option value="canceled">Canceled</option>
                  </select>
                </div>
  
                <div className="form-group">
                  <label htmlFor="taskDeadline">Task Deadline</label>
                  <input
                    id="taskDeadline"
                    type="date"
                    value={newTaskdeadline}
                    onChange={(e) => setNewTaskdeadline(e.target.value)}
                    required
                  />
                </div>
  
                <div className="form-group full-width">
                  <label htmlFor="taskDescription">Task Description</label>
                  <textarea
                    id="taskDescription"
                    placeholder="Enter task description..."
                    value={newTaskDescription}
                    onChange={(e) => setNewTaskDescription(e.target.value)}
                    required
                  />
                </div>
              </div>
  
              <div className="form-actions">
                <button 
                  type="button" 
                  className="secondary-button"
                  onClick={() => setShowTasklist(true)}
                >
                  View Tasks
                </button>
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
              <table className="task-table">
                <thead>
                  <tr>
                    <th className="select-col"></th>
                    <th>Task ID</th>
                    <th>Project ID</th>
                    <th>Labor ID</th>
                    <th>Status</th>
                    <th>Deadline</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {(selectedNavtask === "External Task" 
                    ? mapExternalTasksToDisplay(taskdata) 
                    : mapInternalTasksToDisplay(taskdata2)).map((item, index) => (
                    <tr key={index}>
                      <td className="select-col">
                        <input
                          type="checkbox"
                          checked={selectedReports.includes(index)}
                          onChange={() => handleCheckboxChange(index)}
                        />
                      </td>
                      <td><strong>{item.Taskid}</strong></td>
                      <td>{item.ProjectID}</td>
                      <td>{item.Laborid}</td>
                      <td>
                        <span className={`status-badge ${item.TaskStatus.replace('_', '-')}`}>
                          {item.TaskStatus.replace('_', ' ')}
                        </span>
                      </td>
                      <td>{item.Taskdeadline}</td>
                      <td className="description-cell">{item.TaskDescription}</td>
                    </tr>
                  ))}
                  {((selectedNavtask === "External Task" && taskdata.length === 0) || 
                    (selectedNavtask === "Internal Task" && taskdata2.length === 0)) && (
                    <tr>
                      <td colSpan="7" className="no-tasks">
                        No tasks found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  export default TaskMonitoring;