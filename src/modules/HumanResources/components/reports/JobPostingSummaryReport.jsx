import React, { useState, useEffect } from "react";
import axios from "axios";
import { isEqual } from 'lodash'; 
import { 
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line 
} from 'recharts';

const JobPostingSummaryReport = ({ jobPostings: propsJobPostings = [] }) => {
  // Add state variables for data management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [jobPostings, setJobPostings] = useState(propsJobPostings);
  const [departments, setDepartments] = useState([]);
  // Fetch data if not provided through props
  useEffect(() => {
    const fetchData = async () => {
      // If we already have sufficient data from props, use it
      if (propsJobPostings.length > 0) {
        setJobPostings(propsJobPostings);
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching job postings data directly...");
        const response = await axios.get("https://x0crs910m2.execute-api.ap-southeast-1.amazonaws.com/dev/api/job_posting/job_postings/");
        setJobPostings(response.data || []);
      } catch (err) {
        console.error("Error fetching job postings data:", err);
        setError("Failed to load job posting data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [propsJobPostings]);
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get("https://x0crs910m2.execute-api.ap-southeast-1.amazonaws.com/dev/api/departments/department/");
        setDepartments(response.data || []);
      } catch (err) {
        console.error("Error fetching departments data:", err);
      }
    };
  
    fetchDepartments();
  }, []);
  // Add this helper function inside your component, after the useEffect hooks
  const getDepartmentName = (deptId) => {
    if (!deptId) return "Unspecified";
    const dept = departments.find(d => d.dept_id === deptId);
    return dept ? dept.dept_name : deptId; // Fallback to ID if name not found
  };
  // Show loading state
  if (loading) {
    return (
      <div className="hr-report-container" style={{ textAlign: 'center', padding: '50px 0' }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
        <p style={{ fontSize: '18px', color: '#687C7B' }}>Loading job postings data...</p>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="hr-report-container" style={{ textAlign: 'center', padding: '50px 0' }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>⚠️</div>
        <p style={{ fontSize: '18px', color: '#ff8042' }}>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          style={{
            padding: '8px 16px',
            backgroundColor: '#00a9ac',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '15px'
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  // Calculate metrics
  const totalJobs = jobPostings.length;
  const openJobs = jobPostings.filter(job => job.posting_status === "Open").length;
  const draftJobs = jobPostings.filter(job => job.posting_status === "Draft").length;
  const closedJobs = jobPostings.filter(job => job.posting_status === "Closed").length;
  const pendingFinanceJobs = jobPostings.filter(job => job.finance_approval_status === "Pending").length;
  const approvedFinanceJobs = jobPostings.filter(job => job.finance_approval_status === "Approved").length;
  
  // Job posting status breakdown for pie chart
  const statusData = [
    { name: 'Open', value: openJobs },
    { name: 'Draft', value: draftJobs },
    { name: 'Closed', value: closedJobs }
  ].filter(item => item.value > 0);
  
  // Finance approval status breakdown for pie chart
  const financeStatusData = [
    { name: 'Approved', value: approvedFinanceJobs },
    { name: 'Pending', value: pendingFinanceJobs },
    { name: 'Rejected', value: jobPostings.filter(job => job.finance_approval_status === "Rejected").length }
  ].filter(item => item.value > 0);

  // Replace the current departmentData and departmentChartData code with this:
  // Jobs by department
  const departmentData = jobPostings.reduce((acc, job) => {
    const dept = job.dept_id || "Unspecified";
    const deptName = getDepartmentName(dept);
    acc[deptName] = (acc[deptName] || 0) + 1;
    return acc;
  }, {});
    
  const departmentChartData = Object.entries(departmentData)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  // Jobs by employment type
  const employmentTypeData = jobPostings.reduce((acc, job) => {
    const type = job.employment_type || "Regular";
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});
  
  const employmentTypeChartData = Object.entries(employmentTypeData)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
  
  // Base salary ranges for regular positions
  const salaryRanges = [
    { range: "< 10K", min: 0, max: 10000, count: 0 },
    { range: "10K-20K", min: 10000, max: 20000, count: 0 },
    { range: "20K-30K", min: 20000, max: 30000, count: 0 },
    { range: "30K-50K", min: 30000, max: 50000, count: 0 },
    { range: "50K-80K", min: 50000, max: 80000, count: 0 },
    { range: "80K+", min: 80000, max: Infinity, count: 0 },
  ];
  
  // Count positions in each salary range bucket
  jobPostings.forEach(job => {
    if (job.employment_type === "Regular" && job.base_salary) {
      const salary = parseFloat(job.base_salary);
      for (let range of salaryRanges) {
        if (salary >= range.min && salary < range.max) {
          range.count++;
          break;
        }
      }
    }
  });
  
  // Filter out empty ranges
  const salaryRangeChartData = salaryRanges.filter(range => range.count > 0);

  // Enhanced color palette
  const COLORS = [
    '#00a8a8', '#66bc6d', '#8884d8', '#ff8042', 
    '#ffc658', '#82ca9d', '#8dd1e1', '#a4de6c',
    '#d0ed57', '#97e3d5', '#f5a623', '#f78da7'
  ];

  // Define gradient IDs for each color
  const GRADIENTS = COLORS.map((color, index) => `jobPostingGradient-${index}`);

  // Helper function to create lighter/darker shade of a color
  const createShade = (hexColor, percent) => {
    const num = parseInt(hexColor.slice(1), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    
    return `#${(1 << 24 | (R < 255 ? (R < 0 ? 0 : R) : 255) << 16 | (G < 255 ? (G < 0 ? 0 : G) : 255) << 8 | (B < 255 ? (B < 0 ? 0 : B) : 255)).toString(16).slice(1)}`;
  };

  // Gradient definitions for charts
  const renderGradientDefs = () => (
    <defs>
      {COLORS.map((color, index) => (
        <linearGradient 
          key={`gradient-${index}`} 
          id={GRADIENTS[index]} 
          x1="0" y1="0" 
          x2="0" y2="1"
        >
          <stop offset="0%" stopColor={color} stopOpacity={0.9} />
          <stop offset="100%" stopColor={createShade(color, 15)} stopOpacity={0.7} />
        </linearGradient>
      ))}
      
      {/* Add radial gradient for pie chart */}
      {COLORS.map((color, index) => (
        <radialGradient 
          key={`radial-gradient-${index}`} 
          id={`pieJobGradient-${index}`} 
          cx="50%" cy="50%" r="50%" 
          fx="50%" fy="50%"
        >
          <stop offset="0%" stopColor={createShade(color, 20)} stopOpacity={0.9} />
          <stop offset="100%" stopColor={color} stopOpacity={1} />
        </radialGradient>
      ))}
    </defs>
  );

  // Calculate regular vs contractual/seasonal ratio
  const regularCount = employmentTypeData["Regular"] || 0;
  const contractualCount = (employmentTypeData["Contractual"] || 0) + (employmentTypeData["Seasonal"] || 0);
  const totalTypeCount = regularCount + contractualCount;
  const regularRatio = totalTypeCount > 0 ? (regularCount / totalTypeCount) * 100 : 0;
  
  // Calculate approval rate
  const financeApprovalRate = jobPostings.length > 0 ? (approvedFinanceJobs / jobPostings.length) * 100 : 0;

  return (
    <div className="hr-report-container">
      {/* Metrics Cards - Enhanced with better visuals */}
      <div className="hr-report-summary-cards">
        <div className="hr-report-summary-card" style={{
          boxShadow: '0 4px 12px rgba(0,169,172,0.08)',
          borderLeft: '4px solid #00a9ac'
        }}>
          <h3>Total Job Postings</h3>
          <div className="hr-report-value">{totalJobs}</div>
          <div className="hr-metric-trend">
            <i className="fas fa-briefcase" style={{ color: '#00a9ac', marginRight: '4px' }}></i>
            <span>Active postings</span>
          </div>
        </div>
        
        <div className="hr-report-summary-card" style={{
          boxShadow: '0 4px 12px rgba(0,169,172,0.08)',
          borderLeft: '4px solid #66bc6d'
        }}>
          <h3>Open Jobs</h3>
          <div className="hr-report-value">{openJobs}</div>
          <div className="hr-metric-trend">
            <i className="fas fa-door-open" style={{ color: '#66bc6d', marginRight: '4px' }}></i>
            <span>{openJobs > 0 ? Math.round((openJobs / totalJobs) * 100) : 0}% of total</span>
          </div>
        </div>
        
        <div className="hr-report-summary-card" style={{
          boxShadow: '0 4px 12px rgba(0,169,172,0.08)',
          borderLeft: '4px solid #8884d8'
        }}>
          <h3>Finance Approved</h3>
          <div className="hr-report-value">{approvedFinanceJobs}</div>
          <div className="hr-metric-trend">
            <i className="fas fa-check-circle" style={{ color: '#8884d8', marginRight: '4px' }}></i>
            <span>{Math.round(financeApprovalRate)}% approval rate</span>
          </div>
        </div>
        
        <div className="hr-report-summary-card" style={{
          boxShadow: '0 4px 12px rgba(0,169,172,0.08)',
          borderLeft: '4px solid #ff8042'
        }}>
          <h3>Draft Jobs</h3>
          <div className="hr-report-value">{draftJobs}</div>
          <div className="hr-metric-trend">
            <i className="fas fa-pencil-alt" style={{ color: '#ff8042', marginRight: '4px' }}></i>
            <span>Pending completion</span>
          </div>
        </div>
      </div>
      
      {/* Charts Container - Single Column Layout with enhanced styling */}
      <div className="hr-report-charts-single-column">
        {/* Job Status Section with optimized layout */}
        <div className="hr-report-chart-full" style={{
          boxShadow: '0 6px 16px rgba(0,169,172,0.08)',
          borderRadius: '12px',
          padding: '20px',
          background: 'white'
        }}>
          <h3 style={{ 
            borderBottom: '2px solid #f0f0f0', 
            paddingBottom: '12px',
            marginBottom: '20px',
            fontWeight: '600',
            color: '#333',
            display: 'flex',
            alignItems: 'center'
          }}>
            <i className="fas fa-chart-pie" style={{ marginRight: '10px', color: '#00a9ac' }}></i>
            Job Posting Status
          </h3>
          
          <div style={{
            height: "450px",
            display: "flex", 
            flexDirection: "row",
            position: "relative"
          }}>
            {jobPostings.length > 0 ? (
              <>
                {/* Status legend with improved layout */}
                <div style={{ 
                  width: "30%", 
                  padding: "10px 20px 10px 10px",
                  display: "flex",
                  flexDirection: "column",
                }}>
                  <h4 style={{ 
                    marginBottom: "15px", 
                    fontSize: "14px", 
                    fontWeight: "600",
                    color: '#00a9ac',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <i className="fas fa-tasks" style={{ marginRight: '8px' }}></i>
                    Posting Status
                  </h4>
                  
                  <div style={{ 
                    display: "flex", 
                    flexDirection: "column", 
                    gap: "10px",
                    maxHeight: "400px",
                    overflowY: "auto"
                  }}>
                    {statusData.map((status, index) => (
                      <div key={index} style={{ 
                        display: "flex", 
                        alignItems: "center",
                        padding: "10px",
                        borderRadius: "8px",
                        background: index % 2 === 0 ? "#f9fafb" : "white",
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                        transition: 'transform 0.2s ease',
                        cursor: 'pointer',
                        border: '1px solid #f0f0f0'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
                      }}>
                        <div style={{ 
                          width: "16px", 
                          height: "16px", 
                          backgroundColor: COLORS[index % COLORS.length],
                          borderRadius: "4px",
                          marginRight: "12px",
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ 
                            fontSize: "13px", 
                            fontWeight: "600",
                            marginBottom: "4px"
                          }}>
                            {status.name}
                          </div>
                          <div style={{ 
                            fontSize: "12px", 
                            color: "#687C7B",
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}>
                            <span>{status.value} jobs</span>
                            <span style={{
                              background: COLORS[index % COLORS.length] + '20',
                              color: COLORS[index % COLORS.length],
                              padding: '3px 8px',
                              borderRadius: '12px',
                              fontWeight: '600',
                              fontSize: '11px'
                            }}>
                              {((status.value / totalJobs) * 100).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status pie chart with enhanced visuals */}
                <div style={{ width: "40%", position: 'relative' }}>
                  <div style={{ position: 'absolute', top: 0, right: 0, left: 0, bottom: 0 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        {renderGradientDefs()}
                        <Pie
                          data={statusData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={130}
                          innerRadius={60}
                          paddingAngle={2}
                          dataKey="value"
                          label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {statusData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={`url(#pieJobGradient-${index % COLORS.length})`}
                              stroke="#fff"
                              strokeWidth={2}
                            />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value, name) => [
                            `${value} job postings (${((value / totalJobs) * 100).toFixed(1)}%)`, 
                            name
                          ]}
                          contentStyle={{
                            backgroundColor: 'white',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            border: 'none',
                            padding: '10px 15px'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Metrics and insights panel */}
                <div style={{ 
                  width: "30%", 
                  borderLeft: "1px dashed #e0e0e0",
                  paddingLeft: "20px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  gap: "15px"
                }}>
                  <h4 style={{ 
                    fontSize: "14px", 
                    color: "#00a9ac", 
                    marginBottom: "10px",
                    fontWeight: "600",
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <i className="fas fa-lightbulb" style={{ marginRight: '8px' }}></i>
                    Posting Insights
                  </h4>

                  {/* Metric Card: Finance Approval */}
                  <div style={{ 
                    padding: "12px",
                    borderRadius: "8px",
                    backgroundColor: "#f9fafb",
                    border: "1px solid #f0f0f0",
                    marginBottom: "8px"
                  }}>
                    <div style={{ 
                      fontSize: "12px", 
                      color: "#687C7B",
                      marginBottom: "5px" 
                    }}>
                      Finance Approval Rate
                    </div>
                    <div style={{ 
                      fontSize: "20px", 
                      fontWeight: "700",
                      color: "#00a9ac",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between"
                    }}>
                      {Math.round(financeApprovalRate)}%
                      <span style={{ 
                        fontSize: "11px",
                        padding: "3px 8px",
                        backgroundColor: "rgba(0, 169, 172, 0.1)",
                        color: "#00a9ac",
                        borderRadius: "12px" 
                      }}>
                        approval rate
                      </span>
                    </div>
                  </div>

                  {/* Metric Card: Employment Type Distribution */}
                  <div style={{ 
                    padding: "12px",
                    borderRadius: "8px",
                    backgroundColor: "#f9fafb", 
                    border: "1px solid #f0f0f0",
                    marginBottom: "8px"
                  }}>
                    <div style={{ 
                      fontSize: "12px", 
                      color: "#687C7B",
                      marginBottom: "5px" 
                    }}>
                      Employment Type Distribution
                    </div>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px"
                    }}>
                      <div style={{
                        width: "100%",
                        height: "8px",
                        backgroundColor: "#e9ecef",
                        borderRadius: "4px",
                        overflow: "hidden"
                      }}>
                        <div style={{
                          width: `${regularRatio}%`,
                          height: "100%",
                          backgroundColor: "#66bc6d"
                        }} />
                      </div>
                    </div>
                    <div style={{
                      marginTop: "8px",
                      fontSize: "11px",
                      color: "#687C7B",
                      display: "flex",
                      justifyContent: "space-between"
                    }}>
                      <span>Regular: {regularCount} ({Math.round(regularRatio)}%)</span>
                      <span>Contract/Seasonal: {contractualCount} ({Math.round(100 - regularRatio)}%)</span>
                    </div>
                  </div>

                  {/* Metric Card: Open vs Draft Jobs */}
                  <div style={{ 
                    padding: "12px",
                    borderRadius: "8px",
                    backgroundColor: "#f9fafb",
                    border: "1px solid #f0f0f0",
                    marginBottom: "8px"
                  }}>
                    <div style={{ 
                      fontSize: "12px", 
                      color: "#687C7B",
                      marginBottom: "5px" 
                    }}>
                      Job Posting Status
                    </div>
                    <div style={{
                      fontSize: "13px",
                      fontWeight: "500",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      marginBottom: "8px"
                    }}>
                      <span>{openJobs} of {totalJobs}</span>
                      <span style={{ color: "#687C7B" }}>jobs are open for applications</span>
                    </div>
                    <div style={{
                      width: "100%",
                      height: "8px",
                      backgroundColor: "#e9ecef",
                      borderRadius: "4px",
                      overflow: "hidden"
                    }}>
                      <div style={{
                        width: `${(openJobs / Math.max(1, totalJobs)) * 100}%`,
                        height: "100%",
                        background: "linear-gradient(90deg, #00a9ac 0%, #66bc6d 100%)"
                      }}/>
                    </div>
                  </div>

                  {/* Action button */}
                  <button style={{
                    marginTop: "10px",
                    padding: "8px 12px",
                    backgroundColor: "white",
                    border: "1px solid #00a9ac",
                    borderRadius: "6px",
                    color: "#00a9ac",
                    fontSize: "12px",
                    fontWeight: "500",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px"
                  }}>
                    <i className="fas fa-plus" style={{ fontSize: "11px" }}></i>
                    Create New Job Posting
                  </button>
                </div>
              </>
            ) : (
              <div className="hr-empty-chart" style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div className="hr-empty-chart-icon" style={{ fontSize: "48px", marginBottom: "15px" }}>📊</div>
                <p style={{ color: "#687C7B", fontSize: "16px" }}>No job posting data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Job Distribution Section */}
        <div className="hr-report-chart-full" style={{
          boxShadow: '0 6px 16px rgba(0,169,172,0.08)',
          borderRadius: '12px',
          padding: '20px',
          marginTop: '24px',
          background: 'white'
        }}>
          <h3 style={{ 
            borderBottom: '2px solid #f0f0f0', 
            paddingBottom: '12px',
            marginBottom: '20px',
            fontWeight: '600',
            color: '#333',
            display: 'flex',
            alignItems: 'center'
          }}>
            <i className="fas fa-layer-group" style={{ marginRight: '10px', color: '#00a9ac' }}></i>
            Job Posting Distribution
          </h3>
          
          <div style={{ display: "flex", flexDirection: "row", gap: "30px" }}>
            {/* Department Distribution Chart */}
            <div style={{ flex: 1 }}>
              <h4 style={{ 
                marginBottom: "15px", 
                fontSize: "14px", 
                fontWeight: "600",
                color: '#00a9ac',
                display: 'flex',
                alignItems: 'center'
              }}>
                <i className="fas fa-building" style={{ marginRight: '8px' }}></i>
                Job Postings by Department
              </h4>
              
              <div style={{ height: '350px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={departmentChartData} layout="vertical">
                    {renderGradientDefs()}
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      width={120}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip 
                      formatter={(value) => [`${value} job postings`, 'Count']}
                      contentStyle={{
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        border: 'none',
                        padding: '10px 15px'
                      }}
                    />
                    <Legend />
                    <Bar 
                      dataKey="count" 
                      name="Job Postings" 
                      fill={`url(#${GRADIENTS[0]})`}
                      radius={[0, 4, 4, 0]} 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Employment Type Distribution */}
            <div style={{ flex: 1 }}>
              <h4 style={{ 
                marginBottom: "15px", 
                fontSize: "14px", 
                fontWeight: "600",
                color: '#00a9ac',
                display: 'flex',
                alignItems: 'center'
              }}>
                <i className="fas fa-id-badge" style={{ marginRight: '8px' }}></i>
                Job Postings by Employment Type
              </h4>
              
              <div style={{ height: '350px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={employmentTypeChartData}>
                    {renderGradientDefs()}
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`${value} job postings`, 'Count']}
                      contentStyle={{
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        border: 'none',
                        padding: '10px 15px'
                      }}
                    />
                    <Legend />
                    <Bar 
                      dataKey="count" 
                      name="Job Postings" 
                      radius={[4, 4, 0, 0]}
                    >
                      {employmentTypeChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={`url(#${GRADIENTS[index % COLORS.length]})`}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          {/* Finance Approval Status Section */}
          <div style={{ marginTop: '24px' }}>
            <h4 style={{ 
              marginBottom: "15px", 
              fontSize: "14px", 
              fontWeight: "600",
              color: '#00a9ac',
              display: 'flex',
              alignItems: 'center'
            }}>
              <i className="fas fa-money-check-alt" style={{ marginRight: '8px' }}></i>
              Finance Approval Status
            </h4>
            
            <div style={{ height: '200px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  {renderGradientDefs()}
                  <Pie
                    data={financeStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {financeStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`url(#pieJobGradient-${index % COLORS.length})`} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value} job postings`, 'Count']}
                    contentStyle={{
                      backgroundColor: 'white',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      border: 'none',
                      padding: '10px 15px'
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Additional insights section */}
          <div style={{ 
            marginTop: '20px', 
            padding: '15px', 
            backgroundColor: '#f9fafb',
            borderRadius: '8px',
            border: '1px solid #eaeaea'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <h4 style={{ 
                  fontSize: '14px', 
                  margin: '0 0 8px 0',
                  color: '#00a9ac'
                }}>Job Posting Insights</h4>
                <p style={{ 
                  fontSize: '13px', 
                  margin: '0 0 5px 0',
                  color: '#555'
                }}>
                  <strong>Most recruited department:</strong> {
                    departmentChartData.length > 0 ? departmentChartData[0].name : 'N/A'
                  }
                </p>
                <p style={{ 
                  fontSize: '13px', 
                  margin: '0 0 5px 0',
                  color: '#555'
                }}>
                  <strong>Primary employment type:</strong> {
                    employmentTypeChartData.length > 0 ? employmentTypeChartData[0].name : 'N/A'
                  }
                </p>
                <p style={{ 
                  fontSize: '13px', 
                  margin: '0',
                  color: '#555'
                }}>
                  <strong>Average base salary:</strong> {
                    (() => {
                      const regularPositions = jobPostings.filter(job => 
                        job.employment_type === "Regular" && job.base_salary
                      );
                      if (regularPositions.length === 0) return 'N/A';
                      const avgSalary = regularPositions.reduce((sum, job) => 
                        sum + parseFloat(job.base_salary || 0), 0) / regularPositions.length;
                      return `₱${Math.round(avgSalary).toLocaleString()}`;
                    })()
                  }
                </p>
              </div>
              <button style={{
                padding: "8px 12px",
                backgroundColor: "rgba(0, 169, 172, 0.1)",
                border: "none",
                borderRadius: "6px",
                color: "#00a9ac",
                fontSize: "12px",
                fontWeight: "500",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                height: 'fit-content',
                gap: "6px"
              }}>
                <i className="fas fa-file-export" style={{ fontSize: "11px" }}></i>
                Export Job Posting Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobPostingSummaryReport;