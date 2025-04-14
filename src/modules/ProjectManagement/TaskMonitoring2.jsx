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
  // Form state
  const [newProjectID, setNewProjectID] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskdeadline, setNewTaskdeadline] = useState("");
  const [selectedTaskstatus, setSelectedTaskstatus] = useState("");
  const [newLaborid, setNewLaborid] = useState("");
  const [newTaskid, setNewTaskid] = useState("");

  // UI state
  const [currentForm, setCurrentForm] = useState(1);
  const [selectedNavtask, setSelectedNavtask] = useState("External Task");
  const [showTasklist, setShowTasklist] = useState(false);
  const [selectedReports, setSelectedReports] = useState([]);
  
  // Data state
  const [taskdata, setTaskdata] = useState([]);
  const [taskdata2, setTaskdata2] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Dropdown options
  const [internalProjects, setInternalProjects] = useState([]);
  const [externalProjects, setExternalProjects] = useState([]);
  const [internalLabor, setInternalLabor] = useState([]);
  const [externalLabor, setExternalLabor] = useState([]);

  // Load tasks when component mounts or when task type changes
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

  // Load dropdown options
  useEffect(() => {
    const loadDropdownOptions = async () => {
      try {
        // Load projects
        const internalProjectsData = await getInternalProjects();
        setInternalProjects(internalProjectsData);
        
        const externalProjectsData = await getExternalProjects();
        setExternalProjects(externalProjectsData);
        
        // Load labor options
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
    
    // Generate a task ID if needed
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
      
      // Refresh the task list
      const updatedTasks = await fetchExternalTasks();
      setTaskdata(updatedTasks.results || updatedTasks);
      
      // Reset form and show task list
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
      
      // Refresh the task list
      const updatedTasks = await fetchInternalTasks();
      setTaskdata2(updatedTasks.results || updatedTasks);
      
      // Reset form and show task list
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
        // Delete selected external tasks
        const deletePromises = selectedReports.map(index => {
          const taskId = taskdata[index].task_id;
          return deleteExternalTask(taskId);
        });
        
        await Promise.all(deletePromises);
        
        // Refresh the task list
        const updatedTasks = await fetchExternalTasks();
        setTaskdata(updatedTasks.results || updatedTasks);
      } else {
        // Delete selected internal tasks
        const deletePromises = selectedReports.map(index => {
          const taskId = taskdata2[index].intrnl_task_id;
          return deleteInternalTask(taskId);
        });
        
        await Promise.all(deletePromises);
        
        // Refresh the task list
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

  // Map API data to display format
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
    <div className="body-content-container">
      {loading && <div className="loading-spinner">Loading...</div>}
      {error && <div className="error-message">{error}</div>}

      <div className="planningnav">
        <button
          className={`nav-button ${
            selectedNavtask === "Internal Task" ? "selected1" : ""
          }`}
          onClick={() => handleNavClick("Internal Task")}
        >
          <b>Internal</b>
        </button>

        <button
          className={`nav-button ${
            selectedNavtask === "External Task" ? "selected1" : ""
          }`}
          onClick={() => handleNavClick("External Task")}
        >
          <b>External</b>
        </button>
      </div>

      {selectedNavtask === "External Task" && currentForm === 1 && (
        <form onSubmit={handleFirstSubmitTask}>
          <h1 className="projecttask">
            <b>New Project Task</b>
          </h1>
          <label className="projectidtask">
            <b>Project ID*</b>
          </label>
          <br />
          <select
            className="projectidtask2"
            value={newProjectID}
            onChange={(e) => setNewProjectID(e.target.value)}
            required
          >
            <option value="">Select Project ID</option>
            {externalProjects.map((project) => (
              <option key={project.project_id} value={project.project_id}>
                {project.project_id} {project.project_name ? `- ${project.project_name}` : ''}
              </option>
            ))}
          </select>
          <br />

          <label className="taskdescrip">
            <b>Task Description</b>
          </label>
          <br />

          <textarea
            className="taskdescrip2"
            placeholder="Add Description"
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
            required
          />
          <br />

          <label className="taskstatus">
            <b>Task Status</b>
          </label>
          <br />
          <select
            name="Reporttype"
            className="taskstatus2"
            value={selectedTaskstatus}
            onChange={(e) => setSelectedTaskstatus(e.target.value)}
            required
          >
            <option value="">Status</option>
            <option value="completed">Completed</option>
            <option value="in_progress">In Progress</option>
            <option value="pending">Pending</option>
            <option value="canceled">Canceled</option>
          </select>
          <br />

          <label className="taskdeadline">
            <b>Task Deadline</b>
          </label>
          <br />

          <input
            className="taskdeadline2"
            type="date"
            placeholder="00/00/0000"
            value={newTaskdeadline}
            onChange={(e) => setNewTaskdeadline(e.target.value)}
            required
          />
          <br />

          <label className="laborid">
            <b>Labor ID*</b>
          </label>
          <br />

          <select
            className="laborid2"
            value={newLaborid}
            onChange={(e) => setNewLaborid(e.target.value)}
            required
          >
            <option value="">Select Labor ID</option>
            {externalLabor.map((labor) => (
              <option key={labor.project_labor_id} value={labor.project_labor_id}>
                {labor.project_labor_id} {labor.employee_id ? `- ${labor.employee_id}` : ''}
              </option>
            ))}
          </select>
          <br />

          <h1 className="projecttasklist">Project Task List</h1>

          <button type="submit" className="savetask" disabled={loading}>
            <b>{loading ? "Saving..." : "Save"}</b>
          </button>
          <button type="button" className="edittask" onClick={() => setShowTasklist(true)}>
            <b>View Tasks</b>
          </button>
        </form>
      )}

      {selectedNavtask === "Internal Task" && currentForm === 1 && (
        <form onSubmit={handleSecondSubmitTask}>
          <h1 className="projecttask">
            <b>New Project Task</b>
          </h1>
          <label className="projectidtask">
            <b>Project ID*</b>
          </label>
          <br />
          <select
            className="projectidtask2"
            value={newProjectID}
            onChange={(e) => setNewProjectID(e.target.value)}
            required
          >
            <option value="">Select Project ID</option>
            {internalProjects.map((project) => (
              <option key={project.intrnl_project_id} value={project.intrnl_project_id}>
                {project.intrnl_project_id} {project.intrnl_project_name ? `- ${project.intrnl_project_name}` : ''}
              </option>
            ))}
          </select>
          <br />

          <label className="taskdescrip">
            <b>Task Description</b>
          </label>
          <br />

          <textarea
            className="taskdescrip2"
            placeholder="Add Description"
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
            required
          />
          <br />

          <label className="taskstatus">
            <b>Task Status</b>
          </label>
          <br />
          <select
            name="Reporttype"
            className="taskstatus2"
            value={selectedTaskstatus}
            onChange={(e) => setSelectedTaskstatus(e.target.value)}
            required
          >
            <option value="">Status</option>
            <option value="completed">Completed</option>
            <option value="in_progress">In Progress</option>
            <option value="pending">Pending</option>
            <option value="canceled">Canceled</option>
          </select>
          <br />

          <label className="taskdeadline">
            <b>Task Deadline</b>
          </label>
          <br />

          <input
            className="taskdeadline2"
            type="date"
            placeholder="00/00/0000"
            value={newTaskdeadline}
            onChange={(e) => setNewTaskdeadline(e.target.value)}
            required
          />
          <br />

          <label className="laborid">
            <b>Labor ID*</b>
          </label>
          <br />

          <select
            className="laborid2"
            value={newLaborid}
            onChange={(e) => setNewLaborid(e.target.value)}
            required
          >
            <option value="">Select Labor ID</option>
            {internalLabor.map((labor) => (
              <option key={labor.intrnl_project_labor_id} value={labor.intrnl_project_labor_id}>
                {labor.intrnl_project_labor_id} {labor.employee_id ? `- ${labor.employee_id}` : ''}
              </option>
            ))}
          </select>
          <br />

          <h1 className="projecttasklist">Project Task List</h1>
          <button type="submit" className="savetask" disabled={loading}>
            <b>{loading ? "Saving..." : "Save"}</b>
          </button>
          <button type="button" className="edittask" onClick={() => setShowTasklist(true)}>
            <b>View Tasks</b>
          </button>
        </form>
      )}

      {selectedNavtask === "External Task" && showTasklist && (
        <>
          <h1 className="reportmonitorlist">
            <b>Project List</b>
          </h1>
          <button onClick={handleBackClick} className="addreport">
            <b>Add Task</b>
          </button>
          <button 
            onClick={handleRemoveReports} 
            className="removereport" 
            disabled={selectedReports.length === 0 || loading}
          >
            <b>{loading ? "Removing..." : "Remove Task"}</b>
          </button>
          <div className="replisttable1">
            <table className="replist">
              <thead>
                <tr>
                  <th>
                    <input type="checkbox" disabled />
                  </th>
                  <th>
                    <b>TaskID</b>
                  </th>
                  <th>
                    <b>Project ID</b>
                  </th>
                  <th>
                    <b>Labor ID</b>
                  </th>
                  <th>
                    <b>Status</b>
                  </th>
                  <th>
                    <b>Deadline</b>
                  </th>
                  <th>
                    <b>Description</b>
                  </th>
                </tr>
              </thead>
              <tbody>
                {mapExternalTasksToDisplay(taskdata).map((item, index) => (
                  <tr key={index}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedReports.includes(index)}
                        onChange={() => handleCheckboxChange(index)}
                      />
                    </td>
                    <td>
                      <b>{item.Taskid}</b>
                    </td>
                    <td>{item.ProjectID}</td>
                    <td>{item.Laborid}</td>
                    <td>{item.TaskStatus}</td>
                    <td>{item.Taskdeadline}</td>
                    <td>{item.TaskDescription}</td>
                  </tr>
                ))}
                {taskdata.length === 0 && (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center" }}>
                      No tasks found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {selectedNavtask === "Internal Task" && showTasklist && (
        <>
          <h1 className="reportmonitorlist">
            <b>Project List</b>
          </h1>
          <button onClick={handleBackClick} className="addreport">
            <b>Add Task</b>
          </button>
          <button 
            onClick={handleRemoveReports} 
            className="removereport"
            disabled={selectedReports.length === 0 || loading}
          >
            <b>{loading ? "Removing..." : "Remove Task"}</b>
          </button>
          <div className="replisttable1">
            <table className="replist">
              <thead>
                <tr>
                  <th>
                    <input type="checkbox" disabled />
                  </th>
                  <th>
                    <b>TaskID</b>
                  </th>
                  <th>
                    <b>Project ID</b>
                  </th>
                  <th>
                    <b>Labor ID</b>
                  </th>
                  <th>
                    <b>Status</b>
                  </th>
                  <th>
                    <b>Deadline</b>
                  </th>
                  <th>
                    <b>Description</b>
                  </th>
                </tr>
              </thead>
              <tbody>
                {mapInternalTasksToDisplay(taskdata2).map((item, index) => (
                  <tr key={index}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedReports.includes(index)}
                        onChange={() => handleCheckboxChange(index)}
                      />
                    </td>
                    <td>
                      <b>{item.Taskid}</b> 
                    </td>
                    <td>{item.ProjectID}</td> 
                    <td>{item.Laborid}</td> 
                    <td>{item.TaskStatus}</td> 
                    <td>{item.Taskdeadline}</td> 
                    <td>{item.TaskDescription}</td> 
                  </tr>
                ))}
                {taskdata2.length === 0 && (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center" }}>
                      No tasks found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default TaskMonitoring;