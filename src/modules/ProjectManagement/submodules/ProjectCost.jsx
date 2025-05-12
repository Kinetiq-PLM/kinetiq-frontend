import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar, Pie, Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement, Filler } from 'chart.js';
import "../styles/Projectcost.css";
axios.defaults.baseURL = 'https://htm0n3ydog.execute-api.ap-southeast-1.amazonaws.com/dev';


// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement, Filler);

// Custom color palette based on the reference image
const colors = {
  primary: '#00BFB3', // Teal/turquoise
  secondary: '#7CE0D3', // Lighter teal
  tertiary: '#D6F5F2', // Very light teal
  accent: '#00A99D', // Darker teal
  lightGray: '#F5F7F9',
  textDark: '#2D3748',
  textMedium: '#4A5568',
  textLight: '#718096'
};

const BodyContent = () => {
  const [reportData, setReportData] = useState([]);
  const [selectedReports, setSelectedReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("internal"); // "internal" or "external"
  const [costChartData, setCostChartData] = useState(null);
  const [costTrendData, setCostTrendData] = useState(null);
  const [chartLoading, setChartLoading] = useState(false);
  const [costDistributionData, setCostDistributionData] = useState(null);

  useEffect(() => {
    // Fetch project costs when component mounts
    fetchProjectCosts();
  }, []);

  useEffect(() => {
    // When tab changes to internal, fetch chart data
    if (activeTab === "internal") {
      fetchCostChartData();
      fetchCostTrendData();
      updateCostDistributionData();
    }
  }, [activeTab, reportData]);

  const fetchProjectCosts = async () => {
    setLoading(true);
    try {
      // Try the regular API endpoint first
      const response = await axios.get('/api/project-cost/costs/all_projects/');
      console.log("API Response:", response.data);
      
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        processApiData(response.data);
      } else {
        // If no data or empty array, try the direct SQL approach
        const directResponse = await axios.get('/api/project-cost/direct-costs/');
        console.log("Direct SQL Response:", directResponse.data);
        
        if (directResponse.data && directResponse.data.success && 
            Array.isArray(directResponse.data.data) && directResponse.data.data.length > 0) {
          processApiData(directResponse.data.data);
        } else {
          throw new Error("No data available from either API endpoint");
        }
      }
    } catch (err) {
      console.error("Error fetching project costs:", err);
      setError("Failed to load project costs. Please try again later.");
      // Use sample data as a fallback
      setReportData([
        {
          newProjectName: "Sample External Project",
          newProjectID: "PRJ001",
          newInternalprojectID: "",
          newBillofMaterials: "BOM001",
          newBudgetApprovalID: "BA001",
          newOverallProjectCost: "50000.00",
          newApprovalID: "Pending",
          newLaborCost: "20000.00",
          newUtilityCost: "15000.00",
          newOutsourcedCost: "15000.00",
          projectType: "external",
          resourceId: "RES001"
        },
        {
          newProjectName: "Sample Internal Project 1",
          newProjectID: "",
          newInternalprojectID: "INT001",
          newBillofMaterials: "BOM002",
          newBudgetApprovalID: "BA002",
          newOverallProjectCost: "30000.00",
          newApprovalID: "Approved",
          newLaborCost: "15000.00",
          newUtilityCost: "5000.00",
          newOutsourcedCost: "10000.00",
          projectType: "internal",
          resourceId: "RES002"
        },
        {
          newProjectName: "Sample Internal Project 2",
          newProjectID: "",
          newInternalprojectID: "INT002",
          newBillofMaterials: "BOM003",
          newBudgetApprovalID: "BA003",
          newOverallProjectCost: "45000.00",
          newApprovalID: "Pending",
          newLaborCost: "25000.00",
          newUtilityCost: "10000.00",
          newOutsourcedCost: "10000.00",
          projectType: "internal",
          resourceId: "RES003"
        },
        {
          newProjectName: "Sample Internal Project 3",
          newProjectID: "",
          newInternalprojectID: "INT003",
          newBillofMaterials: "BOM004",
          newBudgetApprovalID: "BA004",
          newOverallProjectCost: "60000.00",
          newApprovalID: "Approved",
          newLaborCost: "30000.00",
          newUtilityCost: "15000.00",
          newOutsourcedCost: "15000.00",
          projectType: "internal",
          resourceId: "RES004"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCostChartData = async () => {
    setChartLoading(true);
    try {
      // In a real implementation, you would make an API call here
      // For now, we'll generate data from the reportData
      
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Filter for internal projects only
      const internalProjects = reportData.filter(item => item.projectType === "internal");
      
      if (internalProjects.length === 0) {
        setCostChartData(null);
        return;
      }
      
      // Create chart data
      const chartData = {
        labels: internalProjects.slice(0, 7).map(item => item.newProjectName.substring(0, 20)),
        datasets: [
          {
            label: 'Labor Cost',
            data: internalProjects.slice(0, 7).map(item => parseFloat(item.newLaborCost)),
            backgroundColor: colors.primary,
            borderColor: colors.primary,
            borderWidth: 1,
          },
          {
            label: 'Utility Cost',
            data: internalProjects.slice(0, 7).map(item => parseFloat(item.newUtilityCost)),
            backgroundColor: colors.secondary,
            borderColor: colors.secondary,
            borderWidth: 1,
          },
          {
            label: 'Outsourced Cost',
            data: internalProjects.slice(0, 7).map(item => parseFloat(item.newOutsourcedCost)),
            backgroundColor: colors.accent,
            borderColor: colors.accent,
            borderWidth: 1,
          }
        ]
      };
      
      setCostChartData(chartData);
    } catch (err) {
      console.error("Error fetching cost chart data:", err);
    } finally {
      setChartLoading(false);
    }
  };

  const fetchCostTrendData = async () => {
    try {
      // In a real implementation, you would make an API call here
      // For now, we'll generate trend data
      
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate mock trend data
      const internalProjects = reportData.filter(item => item.projectType === "internal");
      
      if (internalProjects.length === 0) {
        setCostTrendData(null);
        return;
      }
      
      // Calculate average costs
      const averageLaborCost = internalProjects.reduce((sum, item) => sum + parseFloat(item.newLaborCost), 0) / internalProjects.length;
      const averageUtilityCost = internalProjects.reduce((sum, item) => sum + parseFloat(item.newUtilityCost), 0) / internalProjects.length;
      const averageOutsourcedCost = internalProjects.reduce((sum, item) => sum + parseFloat(item.newOutsourcedCost), 0) / internalProjects.length;
      
      // Create trend data (simulating monthly data for the past 6 months)
      const months = ['January', 'February', 'March', 'April', 'May', 'June'];
      
      // Create random variations around the average
      const laborTrend = months.map(() => averageLaborCost * (0.85 + Math.random() * 0.3));
      const utilityTrend = months.map(() => averageUtilityCost * (0.85 + Math.random() * 0.3));
      const outsourcedTrend = months.map(() => averageOutsourcedCost * (0.85 + Math.random() * 0.3));
      
      // Calculate total for area chart
      const totalTrend = months.map((_, index) => 
        laborTrend[index] + utilityTrend[index] + outsourcedTrend[index]
      );
      
      const trendData = {
        labels: months,
        datasets: [
          {
            label: 'Total Cost',
            data: totalTrend,
            borderColor: colors.primary,
            backgroundColor: colors.tertiary,
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            borderWidth: 2
          },
          {
            label: 'Labor Cost',
            data: laborTrend,
            borderColor: colors.primary,
            backgroundColor: 'transparent',
            tension: 0.4,
            borderWidth: 2,
            pointRadius: 4,
            pointBackgroundColor: colors.primary
          },
          {
            label: 'Utility Cost',
            data: utilityTrend,
            borderColor: colors.secondary,
            backgroundColor: 'transparent',
            tension: 0.4,
            borderWidth: 2,
            pointRadius: 4,
            pointBackgroundColor: colors.secondary
          },
          {
            label: 'Outsourced Cost',
            data: outsourcedTrend,
            borderColor: colors.accent,
            backgroundColor: 'transparent',
            tension: 0.4,
            borderWidth: 2,
            pointRadius: 4,
            pointBackgroundColor: colors.accent
          }
        ]
      };
      
      setCostTrendData(trendData);
    } catch (err) {
      console.error("Error fetching cost trend data:", err);
    }
  };

  const updateCostDistributionData = () => {
    try {
      // Calculate total costs by category across all internal projects
      const internalProjects = reportData.filter(item => item.projectType === "internal");
      
      if (internalProjects.length === 0) {
        setCostDistributionData(null);
        return;
      }
      
      const totalLaborCost = internalProjects.reduce((sum, item) => sum + parseFloat(item.newLaborCost), 0);
      const totalUtilityCost = internalProjects.reduce((sum, item) => sum + parseFloat(item.newUtilityCost), 0);
      const totalOutsourcedCost = internalProjects.reduce((sum, item) => sum + parseFloat(item.newOutsourcedCost), 0);
      
      const distributionData = {
        labels: ['Labor Cost', 'Utility Cost', 'Outsourced Cost'],
        datasets: [
          {
            data: [totalLaborCost, totalUtilityCost, totalOutsourcedCost],
            backgroundColor: [
              colors.primary,
              colors.secondary,
              colors.accent
            ],
            borderColor: [
              colors.primary,
              colors.secondary,
              colors.accent
            ],
            borderWidth: 1,
          }
        ]
      };
      
      setCostDistributionData(distributionData);
    } catch (err) {
      console.error("Error updating cost distribution data:", err);
    }
  };

  const processApiData = (data) => {
    // Transform the API data to the format expected by the UI
    const formattedData = data.map(item => {
      // Determine project type
      let projectType = "unknown";
      let projectName = "Unnamed Project";
      
      if (item.project_id && !item.intrnl_project_id) {
        projectType = "external";
        projectName = `External Project ${item.project_id}`;
      } else if (item.intrnl_project_id && !item.project_id) {
        projectType = "internal";
        projectName = `Internal Project ${item.intrnl_project_id}`;
      } else if (item.project_id && item.intrnl_project_id) {
        // If both IDs are present, prioritize internal
        projectType = "internal";
        projectName = `Internal Project ${item.intrnl_project_id}`;
      }
      
      // Parse cost values, ensuring they are numbers
      const laborCost = parseFloat(item.outside_labor_costs) || 0;
      const utilityCost = parseFloat(item.utility_costs) || 0;
      const outsourcedCost = parseFloat(item.outsourced_costs) || 0;
      
      // Calculate total cost by summing the components
      let overallCost = parseFloat(item.overall_project_costs);
      
      // If overall cost is missing or zero, calculate it from components
      if (!overallCost) {
        overallCost = laborCost + utilityCost + outsourcedCost;
      }
      
      return {
        newProjectName: projectName,
        newProjectID: item.project_id || "",
        newInternalprojectID: item.intrnl_project_id || "",
        newBillofMaterials: item.bom_id || "",
        newBudgetApprovalID: item.budget_approvals_id || "",
        newOverallProjectCost: overallCost.toFixed(2),
        newApprovalID: item.budget_approvals_id || "Pending",
        newLaborCost: laborCost.toFixed(2),
        newUtilityCost: utilityCost.toFixed(2),
        newOutsourcedCost: outsourcedCost.toFixed(2),
        resourceId: item.project_resources_id,
        projectType: projectType
      };
    });
    
    console.log("Formatted data:", formattedData);
    setReportData(formattedData);
    setError(null);
  };

  const handleRowClick = (project) => {
    setSelectedProject(project);
  };

  const handleBackToList = () => {
    setSelectedProject(null);
  };

  const getStatusClass = (status) => {
    if (!status) return 'pending';
    
    const statusLower = status.toLowerCase();
    if (statusLower.includes('approved') || statusLower.includes('completed')) {
      return 'approved';
    } else if (statusLower.includes('reject') || statusLower.includes('cancel')) {
      return 'rejected';
    } else {
      return 'pending';
    }
  };

  // Filter data based on search term and active tab
  const filteredReportData = reportData.filter(item => {
    // First apply tab filter
    if (item.projectType !== activeTab) {
      return false;
    }
    
    // Then apply search filter
    return (
      item.newProjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.newInternalprojectID && item.newInternalprojectID.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.resourceId && item.resourceId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.newLaborCost && item.newLaborCost.toString().includes(searchTerm)) ||
      (item.newUtilityCost && item.newUtilityCost.toString().includes(searchTerm)) ||
      (item.newOutsourcedCost && item.newOutsourcedCost.toString().includes(searchTerm)) ||
      (item.newOverallProjectCost && item.newOverallProjectCost.toString().includes(searchTerm))
    );
  });

  const calculatePercentage = (part, total) => {
    const partValue = parseFloat(part) || 0;
    const totalValue = parseFloat(total) || 1; // Avoid division by zero
    return (partValue / totalValue * 100).toFixed(0) + '%';
  };

  // Get project counts for the tabs
  const projectCounts = {
    internal: reportData.filter(p => p.projectType === "internal").length,
    external: reportData.filter(p => p.projectType === "external").length
  };

  // Calculate total cost for internal projects
  const internalTotalCost = reportData
    .filter(item => item.projectType === "internal")
    .reduce((sum, item) => sum + parseFloat(item.newOverallProjectCost), 0)
    .toFixed(2);

  // Render appropriate table based on active tab
  const renderProjectTable = () => {
    if (loading) {
      return (
        <div className="loading-state">
          <div className="loader"></div>
          <p>Loading project costs...</p>
        </div>
      );
    }
    
    if (filteredReportData.length === 0) {
      return (
        <div className="empty-state">
          <i className="fas fa-folder-open empty-icon"></i>
          <p>No project costs found for the selected tab.</p>
          {searchTerm && (
            <button className="btn btn-outline-secondary" onClick={() => setSearchTerm("")}>
              Clear search
            </button>
          )}
        </div>
      );
    }
    
    if (activeTab === "internal") {
      return (
        <table className="data-table">
          <thead>
            <tr>
              <th>Project Name</th>
              <th>Outside Labor Cost</th>
              <th>Utility Cost</th>
              <th>Outsourced Cost</th>
              <th>Overall Project Cost</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReportData.map((item, index) => (
              <tr 
                key={index} 
                className={selectedReports.includes(index) ? "selected" : ""}
                onClick={() => handleRowClick(item)}
                style={{ cursor: 'pointer' }}
              >
                <td className="project-name">{item.newProjectName}</td>
                <td>₱{item.newLaborCost}</td>
                <td>₱{item.newUtilityCost}</td>
                <td>₱{item.newOutsourcedCost}</td>
                <td>₱{item.newOverallProjectCost}</td>
                <td className="action-column">
                  <button className="action-btn" onClick={(e) => {
                    e.stopPropagation();
                    handleRowClick(item);
                  }}>
                    <i className="fas fa-eye"></i>
                  </button>
                  <button className="action-btn" onClick={(e) => {
                    e.stopPropagation();
                    // Add edit functionality
                  }}>
                    <i className="fas fa-edit"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    } else {
      return (
        <table className="data-table">
          <thead>
            <tr>
              <th>Project Name</th>
              <th>Project Resources ID</th>
              <th>BOM ID</th>
              <th>Budget Approvals ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReportData.map((item, index) => (
              <tr 
                key={index} 
                className={selectedReports.includes(index) ? "selected" : ""}
                onClick={() => handleRowClick(item)}
                style={{ cursor: 'pointer' }}
              >
                <td className="project-name">{item.newProjectName}</td>
                <td>{item.resourceId}</td>
                <td>{item.newBillofMaterials}</td>
                <td>{item.newBudgetApprovalID}</td>
                <td className="action-column">
                  <button className="action-btn" onClick={(e) => {
                    e.stopPropagation();
                    handleRowClick(item);
                  }}>
                    <i className="fas fa-eye"></i>
                  </button>
                  <button className="action-btn" onClick={(e) => {
                    e.stopPropagation();
                    // Add edit functionality
                  }}>
                    <i className="fas fa-edit"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
  };

  // Render charts for internal projects
  const renderInternalProjectCharts = () => {
    if (activeTab !== "internal") return null;
    
    return (
      <div className="charts-container">
        <h2 className="charts-title">Internal Projects Cost Analysis</h2>
        
        <div className="cost-summary-cards">
          <div className="cost-card">
            <div className="cost-card-icon" style={{ backgroundColor: colors.primary }}>
              <i className="fas fa-dollar-sign"></i>
            </div>
            <div className="cost-card-content">
              <h3>Total Project Costs</h3>
              <p className="cost-card-value">₱{internalTotalCost}</p>
            </div>
          </div>
          
          <div className="cost-card">
            <div className="cost-card-icon" style={{ backgroundColor: colors.secondary }}>
              <i className="fas fa-project-diagram"></i>
            </div>
            <div className="cost-card-content">
              <h3>Total Internal Projects</h3>
              <p className="cost-card-value">{projectCounts.internal}</p>
            </div>
          </div>
          
          <div className="cost-card">
            <div className="cost-card-icon" style={{ backgroundColor: colors.accent }}>
              <i className="fas fa-chart-line"></i>
            </div>
            <div className="cost-card-content">
              <h3>Average Cost Per Project</h3>
              <p className="cost-card-value">
                ₱{(internalTotalCost / (projectCounts.internal || 1)).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="charts-grid">
          <div className="chart-card">
            <div className="chart-card-header">
              <h3>Cost Breakdown by Project</h3>
              <p>Comparison of labor, utility, and outsourced costs across projects</p>
            </div>
            <div className="chart-card-body">
              {chartLoading ? (
                <div className="chart-loading">
                  <div className="loader"></div>
                  <p>Loading chart data...</p>
                </div>
              ) : costChartData ? (
                <Bar 
                  data={costChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top',
                      },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            return `${context.dataset.label}: ₱${context.raw.toFixed(2)}`;
                          }
                        }
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        title: {
                          display: true,
                          text: 'Cost (₱)'
                        },
                        grid: {
                          color: 'rgba(0, 0, 0, 0.05)'
                        }
                      },
                      x: {
                        grid: {
                          display: false
                        }
                      }
                    }
                  }}
                  height={300}
                />
              ) : (
                <div className="no-chart-data">
                  <i className="fas fa-chart-bar"></i>
                  <p>No chart data available</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="chart-card">
            <div className="chart-card-header">
              <h3>Cost Distribution</h3>
              <p>Overall distribution of costs by category</p>
            </div>
            <div className="chart-card-body">
              {costDistributionData ? (
                <Pie 
                  data={costDistributionData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'right',
                      },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.raw / total) * 100).toFixed(1);
                            return `${context.label}: ₱${context.raw.toFixed(2)} (${percentage}%)`;
                          }
                        }
                      }
                    }
                  }}
                  height={300}
                />
              ) : (
                <div className="no-chart-data">
                  <i className="fas fa-chart-pie"></i>
                  <p>No distribution data available</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="chart-card full-width">
            <div className="chart-card-header">
              <h3>Cost Trends</h3>
              <p>Monthly trends in project costs</p>
            </div>
            <div className="chart-card-body">
              {costTrendData ? (
                <Line 
                  data={costTrendData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top',
                      },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            return `${context.dataset.label}: ₱${context.raw.toFixed(2)}`;
                          }
                        }
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        title: {
                          display: true,
                          text: 'Cost (₱)'
                        },
                        grid: {
                          color: 'rgba(0, 0, 0, 0.05)'
                        }
                      },
                      x: {
                        grid: {
                          color: 'rgba(0, 0, 0, 0.05)'
                        }
                      }
                    }
                  }}
                  height={300}
                />
              ) : (
                <div className="no-chart-data">
                  <i className="fas fa-chart-line"></i>
                  <p>No trend data available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="body-content-container">
      {!selectedProject && (
        <div className="report-list-container">
          <div className="list-header">
            <div className="list-title-section">
              <h1 className="list-title">
                <i className="fas fa-project-diagram mr-2"></i>
                Project Costing
              </h1>
            </div>
          </div>

          {error && (
            <div className="error-message">
              <i className="fas fa-exclamation-circle mr-2"></i>
              {error}
            </div>
          )}

          <div className="tabs-container">
            <div className="tabs-header">
              <div 
                className={`tab ${activeTab === 'internal' ? 'active' : ''}`} 
                onClick={() => setActiveTab('internal')}
              >
                <i className="fas fa-building mr-2"></i>
                Internal Projects
                <span className="tab-count">{projectCounts.internal}</span>
              </div>
              <div 
                className={`tab ${activeTab === 'external' ? 'active' : ''}`} 
                onClick={() => setActiveTab('external')}
              >
                <i className="fas fa-globe mr-2"></i>
                External Projects
                <span className="tab-count">{projectCounts.external}</span>
              </div>
            </div>
          </div>

          {/* Charts section - only for internal projects (now above the table) */}
          {activeTab === 'internal' && renderInternalProjectCharts()}

          <div className="table-responsive custom-shadow">
            <div className="table-header">
              <div className="table-title">
                {activeTab === 'internal' ? 'Internal Project Costs' : 'External Project Costs'}
              </div>
              <div className="table-actions">
                <div className="search-container">
                  <i className="fas fa-search search-icon"></i>
                  <input 
                    type="text" 
                    className="search-input" 
                    placeholder="Search projects..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {renderProjectTable()}
          </div>
        </div>
      )}

      {selectedProject && (
        <div className="project-detail-container">
          <div className="detail-header">
            <div className="detail-title-section">
              <h1 className="detail-title">
                <i className={`fas ${selectedProject.projectType === 'internal' ? 'fa-building' : 'fa-globe'} mr-2`}></i>
                {selectedProject.newProjectName}
              </h1>
              <div className="detail-subtitle">
                <span className="detail-id">
                  {selectedProject.projectType === 'internal' ? 
                    `Internal ID: ${selectedProject.newInternalprojectID}` : 
                    `Project Resources ID: ${selectedProject.resourceId}`}
                </span>
                <span className={`status-badge large-badge ${getStatusClass(selectedProject.newApprovalID)}`}>
                  {selectedProject.newApprovalID}
                </span>
              </div>
            </div>
            <div className="detail-controls">
              <button onClick={handleBackToList} className="btn btn-secondary">
                <i className="fas fa-arrow-left mr-2"></i>
                Back to List
              </button>
              <button className="btn btn-primary">
                <i className="fas fa-edit mr-2"></i>
                Edit Project
              </button>
            </div>
          </div>
          
          <div className="detail-content-grid">
            {selectedProject.projectType === 'internal' ? (
              <>
                <div className="detail-card">
                  <div className="detail-card-header">
                    <h3><i className="fas fa-info-circle mr-2"></i>Internal Project Information</h3>
                  </div>
                  <div className="detail-card-body">
                    <div className="details-grid">
                      <div className="detail-item">
                        <h3 className="detail-label">Project Name</h3>
                        <p className="detail-value project-name">{selectedProject.newProjectName}</p>
                      </div>
                      <div className="detail-item">
                        <h3 className="detail-label">Internal Project ID</h3>
                        <p className="detail-value">{selectedProject.newInternalprojectID}</p>
                      </div>
                      <div className="detail-item">
                        <h3 className="detail-label">Approval Status</h3>
                        <p className="detail-value">
                          <span className={`status-badge ${getStatusClass(selectedProject.newApprovalID)}`}>
                            {selectedProject.newApprovalID}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="detail-card">
                  <div className="detail-card-header">
                    <h3><i className="fas fa-chart-pie mr-2"></i>Cost Breakdown</h3>
                  </div>
                  <div className="detail-card-body">
                    <div className="details-grid">
                      <div className="detail-item">
                        <h3 className="detail-label">Labor Cost</h3>
                        <p className="detail-value">₱{selectedProject.newLaborCost}</p>
                      </div>
                      <div className="detail-item">
                        <h3 className="detail-label">Utility Cost</h3>
                        <p className="detail-value">₱{selectedProject.newUtilityCost}</p>
                      </div>
                      <div className="detail-item">
                        <h3 className="detail-label">Outsourced Cost</h3>
                        <p className="detail-value">₱{selectedProject.newOutsourcedCost}</p>
                      </div>
                      <div className="detail-item">
                        <h3 className="detail-label">Overall Project Cost</h3>
                        <p className="detail-value cost-highlight">₱{selectedProject.newOverallProjectCost}</p>
                      </div>
                    </div>
                    
                    <div className="cost-chart-container">
                      <h4 className="chart-title">Cost Distribution</h4>
                      <div className="cost-bars">
                        <div className="cost-bar-item">
                          <div className="cost-bar-label">Labor</div>
                          <div className="cost-bar-container">
                            <div 
                              className="cost-bar labor-bar" 
                              style={{ 
                                width: calculatePercentage(selectedProject.newLaborCost, selectedProject.newOverallProjectCost),
                                backgroundColor: colors.primary
                              }}
                            ></div>
                          </div>
                          <div className="cost-bar-value">₱{selectedProject.newLaborCost}</div>
                        </div>
                        <div className="cost-bar-item">
                          <div className="cost-bar-label">Utility</div>
                          <div className="cost-bar-container">
                            <div 
                              className="cost-bar utility-bar" 
                              style={{ 
                                width: calculatePercentage(selectedProject.newUtilityCost, selectedProject.newOverallProjectCost),
                                backgroundColor: colors.secondary
                              }}
                            ></div>
                          </div>
                          <div className="cost-bar-value">₱{selectedProject.newUtilityCost}</div>
                        </div>
                        <div className="cost-bar-item">
                          <div className="cost-bar-label">Outsourced</div>
                          <div className="cost-bar-container">
                            <div 
                              className="cost-bar outsourced-bar" 
                              style={{ 
                                width: calculatePercentage(selectedProject.newOutsourcedCost, selectedProject.newOverallProjectCost),
                                backgroundColor: colors.accent
                              }}
                            ></div>
                          </div>
                          <div className="cost-bar-value">₱{selectedProject.newOutsourcedCost}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="project-cost-chart">
                      <h4 className="chart-title">Project Cost Visualization</h4>
                      <div style={{ height: '250px' }}>
                        <Pie 
                          data={{
                            labels: ['Labor Cost', 'Utility Cost', 'Outsourced Cost'],
                            datasets: [{
                              data: [
                                parseFloat(selectedProject.newLaborCost),
                                parseFloat(selectedProject.newUtilityCost),
                                parseFloat(selectedProject.newOutsourcedCost)
                              ],
                              backgroundColor: [
                                colors.primary,
                                colors.secondary,
                                colors.accent
                              ],
                              borderColor: [
                                colors.primary,
                                colors.secondary,
                                colors.accent
                              ],
                              borderWidth: 1
                            }]
                          }}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: {
                                position: 'right',
                              },
                              tooltip: {
                                callbacks: {
                                  label: function(context) {
                                    const total = parseFloat(selectedProject.newOverallProjectCost);
                                    const percentage = ((context.raw / total) * 100).toFixed(1);
                                    return `${context.label}: ₱${context.raw.toFixed(2)} (${percentage}%)`;
                                  }
                                }
                              }
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="detail-card">
                  <div className="detail-card-header">
                    <h3><i className="fas fa-info-circle mr-2"></i>External Project Information</h3>
                  </div>
                  <div className="detail-card-body">
                    <div className="details-grid">
                      <div className="detail-item">
                        <h3 className="detail-label">Project Name</h3>
                        <p className="detail-value project-name">{selectedProject.newProjectName}</p>
                      </div>
                      <div className="detail-item">
                        <h3 className="detail-label">Project Resources ID</h3>
                        <p className="detail-value">{selectedProject.resourceId}</p>
                      </div>
                      <div className="detail-item">
                        <h3 className="detail-label">Project ID</h3>
                        <p className="detail-value">{selectedProject.newProjectID}</p>
                      </div>
                      <div className="detail-item">
                        <h3 className="detail-label">Bill of Materials</h3>
                        <p className="detail-value">{selectedProject.newBillofMaterials || "—"}</p>
                      </div>
                      <div className="detail-item">
                        <h3 className="detail-label">Budget Approvals ID</h3>
                        <p className="detail-value">{selectedProject.newBudgetApprovalID || "—"}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="detail-card">
                  <div className="detail-card-header">
                    <h3><i className="fas fa-chart-pie mr-2"></i>Cost Information</h3>
                  </div>
                  <div className="detail-card-body">
                    <div className="details-grid">
                      <div className="detail-item">
                        <h3 className="detail-label">Labor Cost</h3>
                        <p className="detail-value">₱{selectedProject.newLaborCost}</p>
                      </div>
                      <div className="detail-item">
                        <h3 className="detail-label">Utility Cost</h3>
                        <p className="detail-value">₱{selectedProject.newUtilityCost}</p>
                      </div>
                      <div className="detail-item">
                        <h3 className="detail-label">Outsourced Cost</h3>
                        <p className="detail-value">₱{selectedProject.newOutsourcedCost}</p>
                      </div>
                      <div className="detail-item">
                        <h3 className="detail-label">Overall Project Cost</h3>
                        <p className="detail-value cost-highlight">₱{selectedProject.newOverallProjectCost}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BodyContent;