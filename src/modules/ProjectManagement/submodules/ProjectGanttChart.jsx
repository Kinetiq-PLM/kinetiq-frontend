// ProjectGanttChart.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/ProjectGanttChart.css";
import { 
  FaArrowLeft, 
  FaCalendarAlt, 
  FaFilter, 
  FaSearch, 
  FaExternalLinkAlt, 
  FaBuilding,
  FaPlus,
  FaMinus,
  FaCog,
  FaSave,
  FaDownload,
  FaExclamationCircle
} from "react-icons/fa";
axios.defaults.baseURL = 'https://hp0w1llp43.execute-api.ap-southeast-1.amazonaws.com/dev';


const ProjectGanttChart = ({ onBack }) => {
  // State for projects data
  const [externalProjects, setExternalProjects] = useState([]);
  const [internalProjects, setInternalProjects] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [selectedProjectType, setSelectedProjectType] = useState('external');
  
  // State for gantt chart configuration
  const [timeScale, setTimeScale] = useState('month'); // 'day', 'week', 'month'
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(new Date().setMonth(new Date().getMonth() + 3)));
  const [zoomLevel, setZoomLevel] = useState(100);
  
  // State for tasks
  const [tasks, setTasks] = useState([]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({
    name: '',
    start: new Date().toISOString().split('T')[0],
    end: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0],
    progress: 0,
    dependencies: [],
    assignee: ''
  });
  
  // State for filtering and searching
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // State for loading and errors
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch projects data on component mount
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const [externalRes, internalRes] = await Promise.all([
          axios.get('/api/project-planning/get-external-project-requests-list/').catch(() => ({ data: [] })),
          axios.get('/api/project-planning/get-internal-project-requests-list/').catch(() => ({ data: [] }))
        ]);
        
        // Process external projects data
        const processedExternalProjects = externalRes.data.map(project => ({
          id: project.project_request_id,
          name: project.project_name || 'Unnamed Project',
          start: project.start_date || new Date().toISOString().split('T')[0],
          status: project.project_status || 'Not Started',
          type: 'external'
        }));
        
        // Process internal projects data
        const processedInternalProjects = internalRes.data.map(project => ({
          id: project.project_request_id,
          name: project.project_name || 'Unnamed Project',
          start: project.request_date || new Date().toISOString().split('T')[0],
          status: project.project_status || 'Not Started',
          type: 'internal',
          department: project.department || 'Unknown'
        }));
        
        setExternalProjects(processedExternalProjects);
        setInternalProjects(processedInternalProjects);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError("Failed to load projects. Please try again later.");
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, []);
  
  // Function to generate time periods based on scale
  const generateTimePeriods = () => {
    const periods = [];
    let current = new Date(startDate);
    
    while (current <= endDate) {
      let label = '';
      
      if (timeScale === 'day') {
        label = current.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      } else if (timeScale === 'week') {
        const weekEnd = new Date(current);
        weekEnd.setDate(weekEnd.getDate() + 6);
        label = `${current.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
      } else {
        label = current.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      }
      
      periods.push({
        date: new Date(current),
        label
      });
      
      if (timeScale === 'day') {
        current.setDate(current.getDate() + 1);
      } else if (timeScale === 'week') {
        current.setDate(current.getDate() + 7);
      } else {
        current.setMonth(current.getMonth() + 1);
      }
    }
    
    return periods;
  };
  
  // Function to handle project selection
  const handleProjectSelect = (project) => {
    setSelectedProjects(prev => {
      const isSelected = prev.some(p => p.id === project.id);
      
      if (isSelected) {
        return prev.filter(p => p.id !== project.id);
      } else {
        // When adding a project, also generate some sample tasks for it
        generateSampleTasks(project);
        return [...prev, project];
      }
    });
  };
  
  // Function to generate sample tasks for a project
  const generateSampleTasks = (project) => {
    const projectStart = new Date(project.start || new Date());
    
    // Generate 3-5 sample tasks for the project
    const numTasks = Math.floor(Math.random() * 3) + 3;
    const newTasks = [];
    
    for (let i = 0; i < numTasks; i++) {
      const taskStart = new Date(projectStart);
      taskStart.setDate(taskStart.getDate() + (i * 7)); // Each task starts a week after the previous
      
      const taskEnd = new Date(taskStart);
      taskEnd.setDate(taskEnd.getDate() + Math.floor(Math.random() * 14) + 7); // 1-3 weeks duration
      
      const taskTypes = ["Planning", "Design", "Development", "Testing", "Deployment", "Review"];
      const taskProgress = Math.floor(Math.random() * 101); // 0-100%
      
      newTasks.push({
        id: `${project.id}-task-${i + 1}`,
        projectId: project.id,
        name: `${taskTypes[i % taskTypes.length]} Phase`,
        start: taskStart.toISOString().split('T')[0],
        end: taskEnd.toISOString().split('T')[0],
        progress: taskProgress,
        dependencies: i > 0 ? [`${project.id}-task-${i}`] : [],
        assignee: 'Unassigned'
      });
    }
    
    setTasks(prev => [...prev, ...newTasks]);
  };
  
  // Function to add a new task
  const handleAddTask = () => {
    if (!newTask.name || !selectedProjects.length) return;
    
    const projectId = selectedProjects[0].id;
    
    const task = {
      id: `${projectId}-task-${tasks.length + 1}`,
      projectId,
      name: newTask.name,
      start: newTask.start,
      end: newTask.end,
      progress: parseInt(newTask.progress) || 0,
      dependencies: newTask.dependencies,
      assignee: newTask.assignee || 'Unassigned'
    };
    
    setTasks([...tasks, task]);
    setNewTask({
      name: '',
      start: new Date().toISOString().split('T')[0],
      end: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0],
      progress: 0,
      dependencies: [],
      assignee: ''
    });
    setShowAddTask(false);
  };
  
  // Function to update a task
  const handleTaskUpdate = (taskId, field, value) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === taskId ? { ...task, [field]: value } : task
      )
    );
  };
  
  // Function to delete a task
  const handleTaskDelete = (taskId) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };
  
  // Function to calculate task position and width in the chart
  const calculateTaskPosition = (task) => {
    const periods = generateTimePeriods();
    if (!periods.length) return { left: 0, width: 0 };
    
    const taskStart = new Date(task.start);
    const taskEnd = new Date(task.end);
    
    // Calculate total chart width
    const chartStart = periods[0].date;
    const chartEnd = periods[periods.length - 1].date;
    const totalDuration = chartEnd - chartStart;
    
    // Calculate task position
    const taskStartOffset = Math.max(0, taskStart - chartStart);
    const taskDuration = taskEnd - taskStart;
    
    const left = (taskStartOffset / totalDuration) * 100;
    const width = (taskDuration / totalDuration) * 100;
    
    return { left: `${left}%`, width: `${width}%` };
  };
  
  // Function to filter projects
  const filterProjects = (projects) => {
    return projects.filter(project => {
      // Filter by search query
      const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           project.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filter by status
      const matchesStatus = filterStatus === 'all' || 
                           project.status.toLowerCase().includes(filterStatus.toLowerCase());
      
      return matchesSearch && matchesStatus;
    });
  };
  
  // Function to filter tasks by selected projects
  const getProjectTasks = () => {
    const selectedProjectIds = selectedProjects.map(p => p.id);
    return tasks.filter(task => selectedProjectIds.includes(task.projectId));
  };
  
  // Function to handle time scale change
  const handleTimeScaleChange = (scale) => {
    setTimeScale(scale);
    
    // Adjust date range based on scale
    const now = new Date();
    let newEndDate = new Date(now);
    
    if (scale === 'day') {
      newEndDate.setDate(now.getDate() + 30); // Show 30 days
    } else if (scale === 'week') {
      newEndDate.setDate(now.getDate() + 84); // Show 12 weeks
    } else {
      newEndDate.setMonth(now.getMonth() + 12); // Show 12 months
    }
    
    setEndDate(newEndDate);
  };
  
  // Function to handle zoom level change
  const handleZoomChange = (direction) => {
    const newZoom = direction === 'in' 
      ? Math.min(zoomLevel + 25, 200) 
      : Math.max(zoomLevel - 25, 50);
    setZoomLevel(newZoom);
  };
  
  // Function to export chart as PDF
  const handleExportChart = () => {
    alert("Export functionality would be implemented here. This would typically use a library like jsPDF to generate a PDF of the current Gantt chart view.");
  };
  
  // Function to save chart configuration
  const handleSaveChart = () => {
    alert("Save functionality would be implemented here. This would save the current chart configuration and tasks to the backend.");
  };
  
  // Render loading state
  if (loading) {
    return (
      <div className="gantt-chart-container">
        <div className="gantt-loading">
          <div className="spinner"></div>
          <p>Loading project data...</p>
        </div>
      </div>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <div className="gantt-chart-container">
        <div className="gantt-error">
          <FaExclamationCircle />
          <p>{error}</p>
          <button onClick={onBack}>Return to Dashboard</button>
        </div>
      </div>
    );
  }
  
  // Generate time periods for the chart
  const timePeriods = generateTimePeriods();
  const filteredExternalProjects = filterProjects(externalProjects);
  const filteredInternalProjects = filterProjects(internalProjects);
  const projectTasks = getProjectTasks();
  
  return (
    <div className="gantt-chart-container">
      <div className="gantt-header">
        <div className="gantt-title">
          <h2><FaCalendarAlt /> Project Gantt Chart</h2>
          <button className="back-button" onClick={onBack}>
            <FaArrowLeft /> Back to Dashboard
          </button>
        </div>
        
        <div className="gantt-controls">
          <div className="search-filter">
            <div className="search-box">
              <FaSearch />
              <input 
                type="text" 
                placeholder="Search projects..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="filter-box">
              <FaFilter />
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="not started">Not Started</option>
                <option value="in progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
          
          <div className="time-controls">
            <div className="time-scale">
              <span>Scale:</span>
              <button 
                className={timeScale === 'day' ? 'active' : ''}
                onClick={() => handleTimeScaleChange('day')}
              >
                Day
              </button>
              <button 
                className={timeScale === 'week' ? 'active' : ''}
                onClick={() => handleTimeScaleChange('week')}
              >
                Week
              </button>
              <button 
                className={timeScale === 'month' ? 'active' : ''}
                onClick={() => handleTimeScaleChange('month')}
              >
                Month
              </button>
            </div>
            
            <div className="zoom-controls">
              <span>Zoom:</span>
              <button onClick={() => handleZoomChange('out')}><FaMinus /></button>
              <span>{zoomLevel}%</span>
              <button onClick={() => handleZoomChange('in')}><FaPlus /></button>
            </div>
          </div>
          
          <div className="chart-actions">
            <button className="save-button" onClick={handleSaveChart}>
              <FaSave /> Save
            </button>
            <button className="export-button" onClick={handleExportChart}>
              <FaDownload /> Export
            </button>
          </div>
        </div>
      </div>
      
      <div className="gantt-content">
        <div className="project-selection">
          <div className="project-tabs">
            <button 
              className={selectedProjectType === 'external' ? 'active' : ''}
              onClick={() => setSelectedProjectType('external')}
            >
              <FaExternalLinkAlt /> External Projects
            </button>
            <button 
              className={selectedProjectType === 'internal' ? 'active' : ''}
              onClick={() => setSelectedProjectType('internal')}
            >
              <FaBuilding /> Internal Projects
            </button>
          </div>
          
          <div className="projects-list">
            <h3>Select Projects to Display</h3>
            <div className="projects-container">
              {selectedProjectType === 'external' ? (
                filteredExternalProjects.length > 0 ? (
                  filteredExternalProjects.map(project => (
                    <div 
                      key={project.id} 
                      className={`project-item ${selectedProjects.some(p => p.id === project.id) ? 'selected' : ''}`}
                      onClick={() => handleProjectSelect(project)}
                    >
                      <div className="project-checkbox">
                        <input 
                          type="checkbox" 
                          checked={selectedProjects.some(p => p.id === project.id)}
                          readOnly
                        />
                      </div>
                      <div className="project-info">
                        <div className="project-name">{project.name}</div>
                        <div className="project-details">
                          <span className="project-id">#{project.id}</span>
                          <span className={`project-status status-${project.status?.toLowerCase().replace(/\s+/g, '-')}`}>
                            {project.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-projects">No external projects found</div>
                )
              ) : (
                filteredInternalProjects.length > 0 ? (
                  filteredInternalProjects.map(project => (
                    <div 
                      key={project.id} 
                      className={`project-item ${selectedProjects.some(p => p.id === project.id) ? 'selected' : ''}`}
                      onClick={() => handleProjectSelect(project)}
                    >
                      <div className="project-checkbox">
                        <input 
                          type="checkbox" 
                          checked={selectedProjects.some(p => p.id === project.id)}
                          readOnly
                        />
                      </div>
                      <div className="project-info">
                        <div className="project-name">{project.name}</div>
                        <div className="project-details">
                          <span className="project-id">#{project.id}</span>
                          <span className="project-department">{project.department}</span>
                          <span className={`project-status status-${project.status?.toLowerCase().replace(/\s+/g, '-')}`}>
                            {project.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-projects">No internal projects found</div>
                )
              )}
            </div>
          </div>
          
          <div className="task-controls">
            <h3>Tasks</h3>
            {selectedProjects.length > 0 && (
              <button 
                className="add-task-button"
                onClick={() => setShowAddTask(!showAddTask)}
              >
                {showAddTask ? 'Cancel' : 'Add Task'}
              </button>
            )}
            
            {showAddTask && (
              <div className="add-task-form">
                <input 
                  type="text" 
                  placeholder="Task name" 
                  value={newTask.name}
                  onChange={(e) => setNewTask({...newTask, name: e.target.value})}
                  required
                />
                <div className="form-row">
                  <div className="form-group">
                    <label>Start Date</label>
                    <input 
                      type="date" 
                      value={newTask.start}
                      onChange={(e) => setNewTask({...newTask, start: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>End Date</label>
                    <input 
                      type="date" 
                      value={newTask.end}
                      onChange={(e) => setNewTask({...newTask, end: e.target.value})}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Progress (%)</label>
                    <input 
                      type="number" 
                      min="0" 
                      max="100" 
                      value={newTask.progress}
                      onChange={(e) => setNewTask({...newTask, progress: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Assignee</label>
                    <input 
                      type="text" 
                      placeholder="Assignee name" 
                      value={newTask.assignee}
                      onChange={(e) => setNewTask({...newTask, assignee: e.target.value})}
                    />
                  </div>
                </div>
                <button 
                  className="submit-task-button"
                  onClick={handleAddTask}
                >
                  Add Task
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="gantt-chart">
          <div className="chart-header">
            <div className="task-header">Tasks</div>
            <div className="timeline-header" style={{ width: `${zoomLevel}%` }}>
              {timePeriods.map((period, index) => (
                <div key={index} className="time-period">
                  {period.label}
                </div>
              ))}
            </div>
          </div>
          
          <div className="chart-body">
            {selectedProjects.length === 0 ? (
              <div className="no-selection-message">
                <p>Select one or more projects from the list to display the Gantt chart</p>
              </div>
            ) : projectTasks.length === 0 ? (
              <div className="no-tasks-message">
                <p>No tasks found for the selected projects. Add tasks to get started.</p>
              </div>
            ) : (
              <>
                {selectedProjects.map(project => (
                  <div key={project.id} className="project-group">
                    <div className="project-row">
                      <div className="task-cell project-name">
                        <span className="project-type-indicator">
                          {project.type === 'external' ? <FaExternalLinkAlt /> : <FaBuilding />}
                        </span>
                        {project.name}
                      </div>
                      <div className="timeline-cell" style={{ width: `${zoomLevel}%` }}>
                        <div className="project-timeline"></div>
                      </div>
                    </div>
                    
                    {projectTasks
                      .filter(task => task.projectId === project.id)
                      .map(task => {
                        const { left, width } = calculateTaskPosition(task);
                        return (
                          <div key={task.id} className="task-row">
                            <div className="task-cell">
                              <div className="task-name">{task.name}</div>
                              <div className="task-details">
                                <span className="task-dates">
                                  {new Date(task.start).toLocaleDateString()} - {new Date(task.end).toLocaleDateString()}
                                </span>
                                <span className="task-assignee">{task.assignee}</span>
                                <span className="task-progress">{task.progress}%</span>
                              </div>
                            </div>
                            <div className="timeline-cell" style={{ width: `${zoomLevel}%` }}>
                              <div 
                                className={`task-bar progress-${Math.floor(task.progress / 25) * 25}`}
                                style={{ left, width }}
                                title={`${task.name} (${task.progress}% complete)`}
                              >
                                <div 
                                  className="progress-indicator"
                                  style={{ width: `${task.progress}%` }}
                                ></div>
                                <div className="task-label">{task.name}</div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectGanttChart;