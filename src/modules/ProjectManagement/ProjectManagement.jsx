import React, { useState, useEffect, useCallback } from "react";
import { Doughnut, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Legend, Filler } from 'chart.js';
import "./styles/ProjectManagement.css";
import axios from "axios";
axios.defaults.baseURL = 'https://htm0n3ydog.execute-api.ap-southeast-1.amazonaws.com/dev';

ChartJS.register(
  ArcElement, 
  Tooltip, 
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Legend,
  Filler
);

const ITEMS_PER_PAGE = 10;

const BodyContent = () => {
    // State management
    const [selectedProject, setSelectedProject] = useState(null);
    const [projectDetail, setProjectDetail] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [overdueTasks, setOverdueTasks] = useState([]);
    const [todayTasks, setTodayTasks] = useState([]);
    const [projectSummary, setProjectSummary] = useState([]);
    const [isLoadingDetail, setIsLoadingDetail] = useState(false);
    const [detailError, setDetailError] = useState(null);
    const [selectedProjectType, setSelectedProjectType] = useState('All');
    const [dashboardStats, setDashboardStats] = useState({
        existingProjects: 0,
        ongoingProjects: 0,
        delayedProjects: 0,
        completedProjects: 0,
        overallProgress: 0
    });
    const [taskCompletionData, setTaskCompletionData] = useState({
        labels: [],
        complete: [],
        incomplete: []
    });

    
    
    // Employee details state
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [showEmployeeModal, setShowEmployeeModal] = useState(false);
    const [employeeDetails, setEmployeeDetails] = useState(null);
    const [isLoadingEmployee, setIsLoadingEmployee] = useState(false);
    const [employeeError, setEmployeeError] = useState(null);
    
    // Pagination states
    const [currentPage, setCurrentPage] = useState({
        overdueTasks: 1,
        projectSummary: 1,
        todayTasks: 1
    });
    
    // Loading states
    const [isLoading, setIsLoading] = useState({
        overdueTasks: false,
        todayTasks: false,
        projectSummary: false,
        dashboardStats: false
    });
    
    // Error states
    const [errors, setErrors] = useState({
        overdueTasks: null,
        todayTasks: null,
        projectSummary: null,
        dashboardStats: null
    });
    
    // Reminder states
    const [activeTab, setActiveTab] = useState('Notes');
    const [reminderItems, setReminderItems] = useState([
        {
            id: 1,
            title: 'Project Scheduling',
            description: 'Plan tasks and track deadlines. Also, assign responsibilities, and monitor.',
            overdue: '2 days',
            task: 'Review project timeline',
            deadline: '2023-11-30',
            employee: 'John Smith',
            completed: false,
        },
        {
            id: 2,
            title: 'Project Scheduling',
            description: 'Plan tasks and track deadlines. Also, assign responsibilities, and monitor.',
            overdue: '1 day',
            task: 'Assign team resources',
            deadline: '2023-11-29',
            employee: 'Jane Doe',
            completed: true,
        }
    ]);
    const [showForm, setShowForm] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [newOverdue, setNewOverdue] = useState('');
    const [newTask, setNewTask] = useState('');
    const [newDeadline, setNewDeadline] = useState('');
    const [newEmployee, setNewEmployee] = useState('');
    const [newStatus, setNewStatus] = useState('');
    const [newAssignedto, setNewAssignedto] = useState('');

  
    // Fetch data on component mount
    useEffect(() => {
        fetchOverdueTasks();
        fetchTodayTasks();
        fetchProjectSummary();
    }, []);

    const calculateDashboardStats = useCallback(() => {
        if (!Array.isArray(projectSummary)) {
            setDashboardStats({
                existingProjects: 0,
                ongoingProjects: 0,
                delayedProjects: 0,
                completedProjects: 0,
                overallProgress: 0
            });
            return;
        }
        
        const stats = {
            existingProjects: projectSummary.length,
            ongoingProjects: 0,
            delayedProjects: 0,
            completedProjects: 0,
            overallProgress: 0
        };
        
        let totalProjects = projectSummary.length;
        let completedWeight = 0;
        
        projectSummary.forEach(project => {
            const status = project.status ? project.status.toLowerCase() : '';
            
            // Count ongoing projects (in progress)
            if (status.includes('progress') || status.includes('ongoing')) {
                stats.ongoingProjects++;
                completedWeight += 0.5; // 50% weight for in-progress projects
            }
            
            // Count delayed projects (not started)
            else if (status.includes('not started') || status.includes('delayed')) {
                stats.delayedProjects++;
                // No weight for not started projects
            }
            
            // Count completed projects
            else if (status.includes('complete')) {
                stats.completedProjects++;
                completedWeight += 1; // 100% weight for completed projects
            }
        });
        
        // Calculate overall progress percentage
        stats.overallProgress = totalProjects > 0 
            ? Math.round((completedWeight / totalProjects) * 100) 
            : 0;
        
        setDashboardStats(stats);
    }, [projectSummary]);

    // Generate task completion data
    const generateTaskCompletionData = useCallback(() => {
        // In a real application, this would be fetched from the API
        // For now, we'll generate some realistic data
        const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'];
        const complete = [5, 7, 12, 14, 15, 20];
        const incomplete = [10, 15, 18, 22, 25, 30];
        
        setTaskCompletionData({
            labels: weeks,
            complete: complete,
            incomplete: incomplete
        });
    }, []);

    // Calculate dashboard stats when project summary changes
    useEffect(() => {
        if (Array.isArray(projectSummary) && projectSummary.length > 0) {
            calculateDashboardStats();
            generateTaskCompletionData();
        }
    }, [projectSummary, calculateDashboardStats, generateTaskCompletionData]);

    const fetchOverdueTasks = async () => {
        setIsLoading(prev => ({ ...prev, overdueTasks: true }));
        try {
            const response = await axios.get('/api/dashboard/overdue-tasks/');
            setOverdueTasks(Array.isArray(response.data) ? response.data : []);
            setErrors(prev => ({ ...prev, overdueTasks: null }));
        } catch (error) {
            console.error("Error fetching overdue tasks:", error);
            setErrors(prev => ({ ...prev, overdueTasks: "Failed to load overdue tasks" }));
            setOverdueTasks([]);
        } finally {
            setIsLoading(prev => ({ ...prev, overdueTasks: false }));
        }
    };
  
    const fetchTodayTasks = async () => {
        setIsLoading(prev => ({ ...prev, todayTasks: true }));
        try {
            // Get only today's tasks from the today-tasks endpoint
            const response = await axios.get('/api/dashboard/today-tasks/');
            setTodayTasks(Array.isArray(response.data) ? response.data : []);
            setErrors(prev => ({ ...prev, todayTasks: null }));
        } catch (error) {
            console.error("Error fetching today's tasks:", error);
            setErrors(prev => ({ ...prev, todayTasks: "Failed to load today's tasks" }));
            setTodayTasks([]);
        } finally {
            setIsLoading(prev => ({ ...prev, todayTasks: false }));
        }
    };
    
    const fetchProjectSummary = async () => {
        setIsLoading(prev => ({ ...prev, projectSummary: true }));
        try {
            const response = await axios.get('/api/dashboard/project-summary/');
            setProjectSummary(Array.isArray(response.data) ? response.data : []);
            setErrors(prev => ({ ...prev, projectSummary: null }));
        } catch (error) {
            console.error("Error fetching project summary:", error);
            setErrors(prev => ({ ...prev, projectSummary: "Failed to load project summary" }));
            setProjectSummary([]);
        } finally {
            setIsLoading(prev => ({ ...prev, projectSummary: false }));
        }
    };
  
    const fetchProjectDetail = async (project) => {
        setIsLoadingDetail(true);
        setDetailError(null);
        
        try {
            const response = await axios.get(`/api/dashboard/project-detail/${project.type}/${project.id}/`);
            setProjectDetail(response.data);
        } catch (error) {
            console.error("Error fetching project details:", error);
            setDetailError(error.response?.data?.detail || "Failed to load project details");
        } finally {
            setIsLoadingDetail(false);
        }
    };
    
    const fetchEmployeeDetails = async (employeeId) => {
        if (!employeeId) return;
        
        setIsLoadingEmployee(true);
        setEmployeeError(null);
        
        try {
            const response = await axios.get(`/api/dashboard/employee-details/${employeeId}/`);
            setEmployeeDetails(response.data);
        } catch (error) {
            console.error("Error fetching employee details:", error);
            setEmployeeError(error.response?.data?.detail || "Failed to load employee details");
        } finally {
            setIsLoadingEmployee(false);
        }
    };
    
    const handleProjectRowClick = (project) => {
        setSelectedProject(project);
        fetchProjectDetail(project);
        setShowDetailsModal(true);
    };

    const closeDetailsModal = () => {
        setShowDetailsModal(false);
        setProjectDetail(null);
    };
    
    const closeEmployeeModal = () => {
        setShowEmployeeModal(false);
        setEmployeeDetails(null);
        setSelectedEmployee(null);
    };
    
    const handlePageChange = (section, page) => {
        setCurrentPage(prev => ({ ...prev, [section]: page }));
    };

    const handleTaskStatusChange = async (taskId, newStatus) => {
        try {
            await axios.post(`/api/dashboard/update-task-status/${taskId}/`, {
                status: newStatus
            });
            
            // Refresh the tasks lists
            fetchTodayTasks();
            fetchOverdueTasks();
        } catch (error) {
            console.error("Error updating task status:", error);
            alert("Failed to update task status");
        }
    };

    // Filter projects based on selected type
    const filteredProjects = Array.isArray(projectSummary) 
        ? projectSummary.filter(project => 
            selectedProjectType === 'All' || project.type === selectedProjectType)
        : [];
    
    // Paginate data
    const paginatedOverdueTasks = overdueTasks.slice(
        (currentPage.overdueTasks - 1) * ITEMS_PER_PAGE, 
        currentPage.overdueTasks * ITEMS_PER_PAGE
    );
    
    const paginatedProjects = filteredProjects.slice(
        (currentPage.projectSummary - 1) * ITEMS_PER_PAGE, 
        currentPage.projectSummary * ITEMS_PER_PAGE
    );
    
    const paginatedTodayTasks = todayTasks.slice(
        (currentPage.todayTasks - 1) * ITEMS_PER_PAGE, 
        currentPage.todayTasks * ITEMS_PER_PAGE
    );
    
    // Calculate total pages
    const totalOverduePages = Math.ceil(overdueTasks.length / ITEMS_PER_PAGE);
    const totalProjectPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
    const totalTodayTasksPages = Math.ceil(todayTasks.length / ITEMS_PER_PAGE);
    
    // Get employee initials
    const getInitials = (name) => {
        if (!name || name === 'Unassigned') return '--';
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };
    
    // Format task deadline
    const formatDeadline = (deadline) => {
        if (!deadline) return 'N/A';
        return deadline;
    };
    
    // Updated Employee Display Component
    const EmployeeDisplay = ({ employee, expandedByDefault = false }) => {
        const [expanded, setExpanded] = useState(expandedByDefault);
        
        if (!employee || !employee.EmployeeID) {
            return <span>Unassigned</span>;
        }
        
        const openEmployeeModal = (e) => {
            e.stopPropagation();
            setSelectedEmployee(employee);
            fetchEmployeeDetails(employee.EmployeeID);
            setShowEmployeeModal(true);
        };
        
        return (
            <div className="employee-display">
                {!expanded ? (
                    <div className="employee-compact" onClick={() => setExpanded(true)}>
                        <div className="employee-avatar">
                            {getInitials(employee.EmployeeName)}
                        </div>
                    </div>
                ) : (
                    <div className="employee-expanded">
                        <div className="employee-compact">
                            <div 
                                className="employee-avatar"
                                onClick={openEmployeeModal}
                            >
                                {getInitials(employee.EmployeeName)}
                            </div>
                            <div className="employee-info">
                                <div className="employee-name">{employee.EmployeeName}</div>
                                <div className="employee-id">ID: {employee.EmployeeID}</div>
                            </div>
                        </div>
                        <button 
                            className="employee-toggle" 
                            onClick={(e) => {
                                e.stopPropagation();
                                setExpanded(false);
                            }}
                        >
                            Hide details
                        </button>
                    </div>
                )}
            </div>
        );
    };

    // Chart data for Overall Progress
    const progressChartData = {
        datasets: [{
            data: [dashboardStats.overallProgress, 100 - dashboardStats.overallProgress],
            backgroundColor: ['#087D7D', '#E8E8E8'],
            borderWidth: 0,
            circumference: 270,
            rotation: 225,
        }],
    };
    
    // Chart data for Ongoing Projects
    const ongoingChartData = {
        datasets: [{
            data: [dashboardStats.ongoingProjects, Math.max(dashboardStats.existingProjects - dashboardStats.ongoingProjects, 0)],
            backgroundColor: ['#469FC2', '#E8E8E8'],
            borderWidth: 0,
            circumference: 270,
            rotation: 225,
        }],
    };
    
    // Chart data for Delayed Projects
    const delayedChartData = {
        datasets: [{
            data: [dashboardStats.delayedProjects, Math.max(dashboardStats.existingProjects - dashboardStats.delayedProjects, 0)],
            backgroundColor: ['#00A8A8', '#E8E8E8'],
            borderWidth: 0,
            circumference: 270,
            rotation: 225,
        }],
    };
    
    // Chart data for Completed Projects
    const completedChartData = {
        datasets: [{
            data: [dashboardStats.completedProjects, Math.max(dashboardStats.existingProjects - dashboardStats.completedProjects, 0)],
            backgroundColor: ['#00A8A8', '#E8E8E8'],
            borderWidth: 0,
            circumference: 270,
            rotation: 225,
        }],
    };
    
    // Common chart options
    const doughnutOptions = {
        cutout: '80%',
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            tooltip: { enabled: false },
            legend: { display: false },
        },
    };
    
    // Line chart data for Task Completion
    const lineChartData = {
        labels: taskCompletionData.labels,
        datasets: [
            {
                label: 'Complete',
                data: taskCompletionData.complete,
                backgroundColor: 'rgba(20, 162, 160, 1)',
                borderColor: 'rgba(20, 162, 160, 1)',
                fill: false,
                tension: 0.4,
            },
            {
                label: 'Incomplete',
                data: taskCompletionData.incomplete,
                backgroundColor: 'rgba(173, 238, 238, 0.7)',
                borderColor: 'rgba(173, 238, 238, 1)',
                fill: 'origin',
                tension: 0.4,
            }
        ]
    };
    
    const lineChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                grid: { display: false }
            },
            y: {
                beginAtZero: true,
                grid: { color: 'rgba(200, 200, 200, 0.3)' },
                ticks: { stepSize: 5 }
            }
        },
        plugins: {
            legend: {
                position: 'top',
                align: 'end',
                labels: {
                    usePointStyle: true,
                    boxWidth: 10
                }
            },
            title: {
                display: false
            }
        },
        elements: {
            line: { tension: 0.4 }
        }
    };
    
    // Calculate weekly improvement percentage
    const calculateWeeklyImprovement = () => {
        if (taskCompletionData.complete.length >= 2) {
            const currentWeek = taskCompletionData.complete[taskCompletionData.complete.length - 1];
            const previousWeek = taskCompletionData.complete[taskCompletionData.complete.length - 2];
            
            if (previousWeek > 0) {
                return Math.round(((currentWeek - previousWeek) / previousWeek) * 100);
            }
        }
        return 0;
    };
    
    const weeklyImprovement = calculateWeeklyImprovement();
    
    // Render pagination controls
    const renderPagination = (section, currentPage, totalPages) => {
        if (totalPages <= 1) return null;

        
        return (
            <div className="pagination-controls">
                <button 
                    className="pagination-btn"
                    onClick={() => handlePageChange(section, Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                >
                    &laquo; Prev
                </button>
                <span className="pagination-info">
                    Page {currentPage} of {totalPages}
                </span>
                <button 
                    className="pagination-btn"
                    onClick={() => handlePageChange(section, Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                >
                    Next &raquo;
                </button>
            </div>
        );
    };

    // Reminder form handlers
    const handleAddClick = () => {
        setShowForm(true);
    };

    const handleSubmit = (e) => {
    e.preventDefault();
    
    if (newTitle.trim() !== '') {
        const newItem = {
            id: Date.now(),
            title: newTitle,
            description: newDescription,
            overdue: newOverdue,
            task: newTask,
            deadline: newDeadline,
            employee: newEmployee, // Fix: newEmpployee -> newEmployee
            status: newStatus,
            assignedTo: newAssignedto,
            completed: false
        };
        
        setReminderItems([...reminderItems, newItem]);
        setNewTitle('');
        setNewDescription('');
        setNewOverdue('');
        setNewTask('');
        setNewDeadline('');
        setNewEmployee('');
        setNewStatus('');
        setNewAssignedto('');
        setShowForm(false);
    }
};

    const handleCancel = () => {
        setShowForm(false);
        setNewTitle('');
        setNewDescription('');
        setNewOverdue('');
        setNewTask('');
        setNewDeadline('');
        setNewEmployee('');
    };
    
    return (
        <div className="project-management-container">
            <div className="dashboard-view">
                {/* Header Section */}
                <div className="dashboard-header">
                    <h1 className="dashboard-title">Project Overview</h1>
                </div>

                {/* Main Dashboard Sections */}
                <div className="dashboard-sections">
                    {/* Overall Progress Section */}
                    <div className="dashboard-section overall-progress-section">
                        <div className="section-header">
                            <h2><b>Overall Progress</b></h2>
                        </div>
                        <div className="chart-wrapper">
                            <div className="doughnut-wrapper">
                                <Doughnut data={progressChartData} options={doughnutOptions} />
                                <div className="progress-text">
                                    <div className="progress-percentage">{dashboardStats.overallProgress}%</div>
                                    <div className="progress-label">Activity Progress</div>
                                </div>
                            </div>
                        </div>

                        <div className="stats-container">
                            <div className="stat-box">
                                <div className="stat-value">{dashboardStats.delayedProjects}</div>
                                <div className="stat-label">Pending</div>
                            </div>
                            <div className="divider"></div>
                            <div className="stat-box">
                                <div className="stat-value">{dashboardStats.ongoingProjects}</div>
                                <div className="stat-label">Need Action</div>
                            </div>
                        </div>

                        <div className="improvement-text">
                            You completed <strong>{weeklyImprovement}%</strong> more task this week
                        </div>
                    </div>
                    
                    {/* Project Stats Cards */}
                    <div className="dashboard-column">
                        <div className="dashboard-section-monitoring">
                            {/* Existing Projects Card */}
                            <div className="dashboard-section existing-project-section">
                                <div className="section-header">
                                    <h2><b>Existing Project</b></h2>
                                </div>
                                <div className="center-stat">
                                    <div className="big-stat">{dashboardStats.existingProjects}</div>
                                </div>
                            </div>

                            {/* Ongoing Projects Card */}
                            <div className="dashboard-section ongoing-project-section">
                                <div className="section-header">
                                    <h2><b>Ongoing</b></h2>
                                </div>
                                <div className="chart-wrapper">
                                    <div className="doughnut-wrapper">
                                        <Doughnut data={ongoingChartData} options={doughnutOptions} />
                                        <div className="progress-text">
                                            <div className="progress-percentage">{dashboardStats.ongoingProjects}</div>
                                        </div>
                                    </div>
                                </div>
                                
                            </div>
                        </div>

                        <div className="dashboard-section-monitoring">
                            {/* Delayed Projects Card */}
                            <div className="dashboard-section delayed-project-section">
                                <div className="section-header">
                                    <h2><b>Delayed</b></h2>
                                </div>
                                <div className="chart-wrapper">
                                    <div className="doughnut-wrapper">
                                        <Doughnut data={delayedChartData} options={doughnutOptions} />
                                        <div className="progress-text">
                                            <div className="progress-percentage">{dashboardStats.delayedProjects}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Completed Projects Card */}
                            <div className="dashboard-section completed-project-section">
                                <div className="section-header">
                                    <h2><b>Completed</b></h2>
                                </div>
                                <div className="chart-wrapper">
                                    <div className="doughnut-wrapper">
                                        <Doughnut data={completedChartData} options={doughnutOptions} />
                                        <div className="progress-text">
                                            <div className="progress-percentage">{dashboardStats.completedProjects}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>                       
                        </div>
                    </div>

                    <div className="reminder-card">
                        <div className="reminder-header">
                            <h2>Reminder</h2>
                            <button className="add-button" onClick={handleAddClick}>
                                <span><b>+</b></span>
                            </button>
                        </div>
                        
                        <div className="tabs-container">
                            <div className={`tab ${activeTab === 'Notes' ? 'active' : ''}`} onClick={() => setActiveTab('Notes')}>
                                <div className="tab-icon">✓</div>
                                <div className="tab-text"><b>Notes</b></div>
                            </div>
                        </div>
                        
                        {showForm && (
                            <div className="reminder-form">
                                <form onSubmit={handleSubmit} className="reminder-form-container">
                                    <div className="form-header">
                                        <h3>Add New Reminder</h3>
                                        <button 
                                            type="button" 
                                            className="close-button" 
                                            onClick={handleCancel}
                                            aria-label="Close form"
                                        >
                                            &times;
                                        </button>
                                    </div>
                                    
                                    <div className="form-group">
                                        <label htmlFor="reminder-title">Title</label>
                                        <input
                                            id="reminder-title"
                                            type="text"
                                            placeholder="Enter reminder title"
                                            value={newTitle}
                                            onChange={(e) => setNewTitle(e.target.value)}
                                            className="form-control"
                                            required
                                        />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label htmlFor="reminder-description">Description</label>
                                        <textarea
                                            id="reminder-description"
                                            placeholder="Enter reminder details"
                                            value={newDescription}
                                            onChange={(e) => setNewDescription(e.target.value)}
                                            className="form-control"
                                            rows="4"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="reminder-overdue">Overdue</label>
                                        <input
                                            id="reminder-overdue"
                                            type="text"
                                            placeholder="Enter Due Date"
                                            value={newOverdue}
                                            onChange={(e) => setNewOverdue(e.target.value)}
                                            className="form-control"
                                            required
                                        />
                                    </div>

                                     <div className="form-group">
                                        <label htmlFor="reminder-task">Task</label>
                                        <input
                                            id="reminder-task"
                                            type="text"
                                            placeholder="Enter Task"
                                            value={newTask}
                                            onChange={(e) => setNewTask(e.target.value)}
                                            className="form-control"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="reminder-deadline">Deadline</label>
                                        <input
                                            id="reminder-deadline"
                                            type=""
                                            placeholder="Enter Deadline"
                                            value={newDeadline}
                                            onChange={(e) => setNewDeadline(e.target.value)}
                                            className="form-control"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="reminder-employee">Employee</label>
                                        <input
                                            id="reminder-employee"
                                            type="text"
                                            placeholder="Enter Employee"
                                            value={newEmployee}
                                            onChange={(e) => setNewEmployee(e.target.value)}
                                            className="form-control"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="reminder-status">Status</label>
                                        <input
                                            id="reminder-status"
                                            type="text"
                                            placeholder="Enter Status"
                                            value={newStatus}
                                            onChange={(e) => setNewStatus(e.target.value)}
                                            className="form-control"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="reminder-assignedto">Assigned To</label>
                                        <input
                                            id="reminder-assignedto"
                                            type="text"
                                            placeholder="Assigned To:"
                                            value={newAssignedto}
                                            onChange={(e) => setNewAssignedto(e.target.value)}
                                            className="form-control"
                                            required
                                        />
                                    </div>
                                    
                                    <div className="form-buttons">
                                        <button 
                                            type="button" 
                                            onClick={handleCancel}
                                            className="btn btn-secondary"
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            type="submit"
                                            className="btn btn-primary"
                                        >
                                            Add Reminder
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                        
                        <div className="reminder-list">
                            {reminderItems.map(item => (
                                <div className="reminder-item" key={item.id}>
                                    <div className="reminder-content">
                                        <h3><b>{item.title}</b></h3>
                                        <p>{item.description}</p>
                                        {item.overdue && (
                                            <div className="reminder-detail">
                                                <span className="detail-label">Overdue:</span>
                                                <span className="detail-value">{item.overdue}</span>
                                            </div>
                                        )}
                                        {item.task && (
                                            <div className="reminder-detail">
                                                <span className="detail-label">Task:</span>
                                                <span className="detail-value">{item.task}</span>
                                            </div>
                                        )}
                                        {item.deadline && (
                                            <div className="reminder-detail">
                                                <span className="detail-label">Deadline:</span>
                                                <span className="detail-value">{item.deadline}</span>
                                            </div>
                                        )}
                                        {item.employee && (
                                            <div className="reminder-detail">
                                                <span className="detail-label">Employee:</span>
                                                <span className="detail-value">{item.employee}</span>
                                            </div>
                                        )}

                                         {item.Status && (
                                            <div className="reminder-detail">
                                                <span className="detail-label">Status:</span>
                                                <span className="detail-value">{item.Status}</span>
                                            </div>
                                        )}

                                        {item.Assignedto && (
                                            <div className="reminder-detail">
                                                <span className="detail-label">Assigned To:</span>
                                                <span className="detail-value">{item.Assignedto}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="reminder-actions">
                                        <div 
                                            className={`status-indicator-dashboard ${item.completed ? 'completed' : ''}`}
                                            onClick={() => {
                                                const updatedItems = reminderItems.map(i => 
                                                    i.id === item.id ? {...i, completed: !i.completed} : i
                                                );
                                                setReminderItems(updatedItems);
                                            }}
                                        >
                                            {item.completed ? '✓' : ''}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Task Completion Overtime Chart */}
                    <div className="dashboard-section task-completion-section">
                        <div className="section-header">
                            <h2><b>Task Completion Overtime</b></h2>
                        </div>
                        <div className="chart-wrapper2">
                            <Line data={lineChartData} options={lineChartOptions} />
                        </div>
                    </div>
                    

                    {/* Project Summary Section */}
                    <div className="dashboard-section project-summary-section">
                        <div className="section-header">
                            <h2>Project Summary</h2>
                            <div className="project-type-tabs">
                                <button
                                    className={`project-tab ${selectedProjectType === 'All' ? 'active' : ''}`}
                                    onClick={() => setSelectedProjectType('All')}
                                >
                                    All Projects
                                </button>
                                <button
                                    className={`project-tab ${selectedProjectType === 'Internal' ? 'active' : ''}`}
                                    onClick={() => setSelectedProjectType('Internal')}
                                >
                                    Internal
                                </button>
                                <button
                                    className={`project-tab ${selectedProjectType === 'External' ? 'active' : ''}`}
                                    onClick={() => setSelectedProjectType('External')}
                                >
                                    External
                                </button>
                            </div>
                        </div>
                        <div className="section-content">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Project Tracking ID</th>
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
                                    ) : paginatedProjects.length === 0 ? (
                                        <tr><td colSpan="6" className="no-data-cell">No projects found</td></tr>
                                    ) : (
                                        paginatedProjects.map((project, index) => (
                                            <tr 
                                                key={index} 
                                                className={`${project.issue ? "has-issue" : ""} clickable-row`}
                                                onClick={() => handleProjectRowClick(project)}
                                            >
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
                            {renderPagination('projectSummary', currentPage.projectSummary, totalProjectPages)}
                        </div>
                    </div>
                </div>
            </div>

            {/* Project Details Modal */}
            {showDetailsModal && selectedProject && (
                <div className="project-details-modal">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>Project Details</h2>
                            <button className="close-button" onClick={closeDetailsModal}>×</button>
                        </div>
                        <div className="modal-body">
                            {isLoadingDetail ? (
                                <div className="loading-cell">Loading project details...</div>
                            ) : detailError ? (
                                <div className="error-cell">Error: {detailError}</div>
                            ) : projectDetail ? (
                                <div className="project-details-grid">
                                    {/* External Project */}
                                    {selectedProject.type === 'External' && (
                                        <>
                                            <div className="detail-item">
                                                <span className="detail-label">Project Tracking ID:</span>
                                                <span className="detail-value">{projectDetail.project_tracking_id}</span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="detail-label">Project ID:</span>
                                                <span className="detail-value">{projectDetail.project_id}</span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="detail-label">Project Type:</span>
                                                <span className="detail-value">External</span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="detail-label">Start Date:</span>
                                                <span className="detail-value">{projectDetail.start_date}</span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="detail-label">Estimated End Date:</span>
                                                <span className="detail-value">{projectDetail.estimated_end_date}</span>
                                            </div>
                                            <div className="detail-item full-width">
                                                <span className="detail-label">Project Milestone:</span>
                                                <span className="detail-value">{projectDetail.project_milestone}</span>
                                            </div>
                                            {projectDetail.project_warranty_id && (
                                                <div className="detail-item">
                                                    <span className="detail-label">Project Warranty ID:</span>
                                                    <span className="detail-value">{projectDetail.project_warranty_id}</span>
                                                </div>
                                            )}
                                            {projectDetail.project_issues && (
                                                <div className="detail-item full-width">
                                                    <span className="detail-label">Project Issue:</span>
                                                    <span className="detail-value">{projectDetail.project_issues}</span>
                                                </div>
                                            )}
                                        </>
                                    )}
                                    
                                    {/* Internal Project */}
                                    {selectedProject.type === 'Internal' && (
                                        <>
                                            <div className="detail-item">
                                                <span className="detail-label">Project Tracking ID:</span>
                                                <span className="detail-value">{projectDetail.intrnl_project_tracking_id}</span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="detail-label">Project ID:</span>
                                                <span className="detail-value">{projectDetail.intrnl_project_id}</span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="detail-label">Project Type:</span>
                                                <span className="detail-value">Internal</span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="detail-label">Start Date:</span>
                                                <span className="detail-value">{projectDetail.intrnl_start_date}</span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="detail-label">Estimated End Date:</span>
                                                <span className="detail-value">{projectDetail.intrnl_estimated_end_date}</span>
                                            </div>
                                            {projectDetail.intrnl_project_issue && (
                                                <div className="detail-item full-width">
                                                    <span className="detail-label">Project Issue:</span>
                                                    <span className="detail-value">{projectDetail.intrnl_project_issue}</span>
                                                </div>
                                            )}
                                        </>
                                    )}
                                    
                                    {/* Project Tasks Section */}
                                    {projectDetail.tasks && projectDetail.tasks.length > 0 && (
                                        <div className="detail-item full-width">
                                            <span className="detail-label">Project Tasks:</span>
                                            <div className="tasks-container">
                                                <table className="details-table">
                                                    <thead>
                                                        <tr>
                                                            <th>Task</th>
                                                            <th>Status</th>
                                                            <th>Deadline</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {projectDetail.tasks.map((task, idx) => (
                                                            <tr key={idx}>
                                                                <td>{task.description}</td>
                                                                <td>
                                                                    <span className={`status-badge ${task.status === 'completed' ? 'ok' : 'issue'}`}>
                                                                        {task.status}
                                                                    </span>
                                                                </td>
                                                                <td>{task.deadline}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="no-data-cell">No detailed information available for this project.</div>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button className="cancel-btn" onClick={closeDetailsModal}>Close</button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Employee Details Modal */}
            {showEmployeeModal && selectedEmployee && (
                <div className="employee-details-modal">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>Employee: {selectedEmployee.EmployeeName}</h2>
                            <button className="close-button" onClick={closeEmployeeModal}>×</button>
                        </div>
                        <div className="modal-body">
                            {isLoadingEmployee ? (
                                <div className="loading-cell">Loading employee details...</div>
                            ) : employeeError ? (
                                <div className="error-cell">Error: {employeeError}</div>
                            ) : employeeDetails ? (
                                <div className="employee-details-container">
                                    <div className="employee-avatar-large">
                                        <div className="avatar-circle">
                                            {getInitials(selectedEmployee.EmployeeName)}
                                        </div>
                                        <h3>{employeeDetails.first_name} {employeeDetails.last_name}</h3>
                                        <div className="employee-status-badge">
                                            {employeeDetails.status}
                                        </div>
                                    </div>
                                    
                                    <div className="employee-info-grid">
                                        <div className="info-item">
                                            <div className="info-label">Employee ID</div>
                                            <div className="info-value">{employeeDetails.employee_id}</div>
                                        </div>
                                        
                                        <div className="info-item">
                                            <div className="info-label">Department</div>
                                            <div className="info-value">{employeeDetails.dept_name || 'Not Assigned'}</div>
                                        </div>
                                        
                                        <div className="info-item">
                                            <div className="info-label">Position</div>
                                            <div className="info-value">{employeeDetails.position_title || 'Not Assigned'}</div>
                                        </div>
                                        
                                        <div className="info-item">
                                            <div className="info-label">Phone</div>
                                            <div className="info-value">{employeeDetails.phone || 'Not Available'}</div>
                                        </div>
                                        
                                        <div className="info-item">
                                            <div className="info-label">Employment Type</div>
                                            <div className="info-value">{employeeDetails.employment_type || 'Not Specified'}</div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="no-data-cell">No detailed information available for this employee.</div>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button className="primary-btn" onClick={closeEmployeeModal}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BodyContent;