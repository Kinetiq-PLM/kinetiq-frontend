import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line
} from 'recharts';

const WorkforceAllocationSummaryReport = ({ allocations: propsAllocations = [], period }) => {
  // State variables
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allocations, setAllocations] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);

  // Enhanced color palette to match other reports
  const COLORS = ['#00a9ac', '#66bc6d', '#8884d8', '#ff8042', '#ffc658', '#82ca9d'];
  const GRADIENTS = ['gradient1', 'gradient2', 'gradient3', 'gradient4', 'gradient5', 'gradient6'];

  // Helper function for color shading
  const createShade = (hexColor, percent) => {
    const f = parseInt(hexColor.slice(1), 16),
      t = percent < 0 ? 0 : 255,
      p = percent < 0 ? percent * -1 : percent,
      R = f >> 16,
      G = (f >> 8) & 0x00ff,
      B = f & 0x0000ff;
    return `#${(
      0x1000000 +
      (Math.round((t - R) * p) + R) * 0x10000 +
      (Math.round((t - G) * p) + G) * 0x100 +
      (Math.round((t - B) * p) + B)
    )
      .toString(16)
      .slice(1)}`;
  };

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      // If we already have sufficient data from props, use it
      if (propsAllocations.length > 0) {
        setAllocations(propsAllocations);
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching workforce allocation data...");
        const [allocationsRes, employeesRes, deptsRes] = await Promise.all([
          axios.get("https://1wj5891jxg.execute-api.ap-southeast-1.amazonaws.com/dev/api/workforce_allocation/workforce_allocations/"),
          axios.get("https://1wj5891jxg.execute-api.ap-southeast-1.amazonaws.com/dev/api/employees/"),
          axios.get("https://1wj5891jxg.execute-api.ap-southeast-1.amazonaws.com/dev/api/departments/department/")
        ]);
        
        setAllocations(allocationsRes.data || []);
        setEmployees(employeesRes.data || []);
        setDepartments(deptsRes.data || []);
      } catch (err) {
        console.error("Error fetching workforce allocation data:", err);
        setError("Failed to load workforce allocation data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [propsAllocations]);

  // Show loading state
  if (loading) {
    return (
      <div className="hr-report-container" style={{ textAlign: 'center', padding: '50px 0' }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
        <p style={{ fontSize: '18px', color: '#687C7B' }}>Loading workforce allocation data...</p>
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
  const totalAllocations = allocations.length;
  const activeAllocations = allocations.filter(alloc => alloc.status === "Active").length;
  const completedAllocations = allocations.filter(alloc => alloc.status === "Completed").length;
  const pendingApproval = allocations.filter(alloc => alloc.approval_status === "Pending").length;
  
  // Departmental distribution of allocations
  const deptData = allocations.reduce((acc, alloc) => {
    const deptId = alloc.current_dept_id;
    const dept = departments.find(d => d.dept_id === deptId);
    const deptName = dept ? dept.dept_name : (deptId || 'Unknown');
    
    acc[deptName] = (acc[deptName] || 0) + 1;
    return acc;
  }, {});
  
  const departmentChartData = Object.entries(deptData)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
  
  // Status distribution
  const statusData = allocations.reduce((acc, alloc) => {
    const status = alloc.status || 'Draft';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});
  
  const statusChartData = Object.entries(statusData)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
  
  // Approval status distribution
  const approvalData = allocations.reduce((acc, alloc) => {
    const status = alloc.approval_status || 'Pending';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});
  
  const approvalChartData = Object.entries(approvalData)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
  
  // Skills distribution
  const skillsData = allocations.reduce((acc, alloc) => {
    if (!alloc.required_skills) return acc;
    
    const skills = alloc.required_skills.split(/,\s*/).filter(Boolean);
    
    skills.forEach(skill => {
      const normalizedSkill = skill.trim();
      if (normalizedSkill) {
        acc[normalizedSkill] = (acc[normalizedSkill] || 0) + 1;
      }
    });
    
    return acc;
  }, {});
  
  const skillsChartData = Object.entries(skillsData)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);  // Top 5 skills
  
  // Monthly allocation trend
  const monthlyData = allocations.reduce((acc, alloc) => {
    let month = 'Unknown';
    
    if (alloc.start_date) {
      const date = new Date(alloc.start_date);
      month = date.toLocaleString('default', { month: 'short', year: 'numeric' });
    }
    
    if (!acc[month]) {
      acc[month] = { month, count: 0 };
    }
    
    acc[month].count++;
    return acc;
  }, {});
  
  const trendChartData = Object.values(monthlyData)
    .sort((a, b) => {
      const dateA = new Date(a.month);
      const dateB = new Date(b.month);
      return dateA - dateB;
    });

  // Employee assignment metrics
  const employeeAssignmentCount = allocations.reduce((acc, alloc) => {
    if (alloc.employee_id) {
      acc[alloc.employee_id] = (acc[alloc.employee_id] || 0) + 1;
    }
    return acc;
  }, {});
  
  const assignedEmployees = Object.keys(employeeAssignmentCount).length;
  const employeeUtilRate = employees.length > 0 ? 
    ((assignedEmployees / employees.length) * 100).toFixed(1) : 0;

  // Approval efficiency
  const approvedAllocations = allocations.filter(alloc => alloc.approval_status === 'Approved').length;
  const approvalRate = totalAllocations > 0 ? 
    ((approvedAllocations / totalAllocations) * 100).toFixed(1) : 0;

  // Render gradient definitions for charts
  const renderGradientDefs = () => (
    <defs>
      {COLORS.map((color, index) => (
        <linearGradient 
          key={`grad-${index}`} 
          id={GRADIENTS[index % GRADIENTS.length]} 
          x1="0" y1="0" x2="0" y2="1"
        >
          <stop offset="0%" stopColor={createShade(color, -0.2)} stopOpacity={1} />
          <stop offset="100%" stopColor={color} stopOpacity={1} />
        </linearGradient>
      ))}
    </defs>
  );

  return (
    <div className="hr-report-container">
      {/* Metrics Cards */}
      <div className="hr-report-summary-cards">
        <div className="hr-report-summary-card" style={{
          boxShadow: '0 4px 12px rgba(0,169,172,0.08)',
          borderLeft: '4px solid #00a9ac'
        }}>
          <h3>Total Allocations</h3>
          <div className="hr-report-value">{totalAllocations}</div>
          <div className="hr-metric-trend">
            <i className="fas fa-project-diagram" style={{ color: '#00a9ac', marginRight: '4px' }}></i>
            <span>All workforce allocations</span>
          </div>
        </div>
        
        <div className="hr-report-summary-card" style={{
          boxShadow: '0 4px 12px rgba(0,169,172,0.08)',
          borderLeft: '4px solid #66bc6d'
        }}>
          <h3>Active Allocations</h3>
          <div className="hr-report-value">{activeAllocations}</div>
          <div className="hr-metric-trend">
            <i className="fas fa-user-clock" style={{ color: '#66bc6d', marginRight: '4px' }}></i>
            <span>{totalAllocations > 0 ? Math.round((activeAllocations / totalAllocations) * 100) : 0}% active rate</span>
          </div>
        </div>
        
        <div className="hr-report-summary-card" style={{
          boxShadow: '0 4px 12px rgba(0,169,172,0.08)',
          borderLeft: '4px solid #8884d8'
        }}>
          <h3>Completed Allocations</h3>
          <div className="hr-report-value">{completedAllocations}</div>
          <div className="hr-metric-trend">
            <i className="fas fa-check-circle" style={{ color: '#8884d8', marginRight: '4px' }}></i>
            <span>{totalAllocations > 0 ? Math.round((completedAllocations / totalAllocations) * 100) : 0}% completion rate</span>
          </div>
        </div>
        
        <div className="hr-report-summary-card" style={{
          boxShadow: '0 4px 12px rgba(0,169,172,0.08)',
          borderLeft: '4px solid #ff8042'
        }}>
          <h3>Pending Approval</h3>
          <div className="hr-report-value">{pendingApproval}</div>
          <div className="hr-metric-trend">
            <i className="fas fa-hourglass-half" style={{ color: '#ff8042', marginRight: '4px' }}></i>
            <span>Awaiting authorization</span>
          </div>
        </div>
      </div>
      
      {/* Allocation Status Section */}
      <div className="hr-report-charts-single-column">
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
            Workforce Allocation Status
          </h3>
          
          <div style={{
            height: "450px",
            display: "flex", 
            flexDirection: "row",
            position: "relative"
          }}>
            {allocations.length > 0 ? (
              <>
                {/* Status legend */}
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
                    Allocation Status
                  </h4>
                  
                  <div style={{ 
                    display: "flex", 
                    flexDirection: "column", 
                    gap: "10px",
                    maxHeight: "400px",
                    overflowY: "auto"
                  }}>
                    {statusChartData.map((status, index) => (
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
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'none';
                      }}>
                        <div style={{
                          width: "12px",
                          height: "12px",
                          borderRadius: "50%",
                          background: COLORS[index % COLORS.length],
                          marginRight: "12px"
                        }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ 
                            fontWeight: "600", 
                            fontSize: "14px",
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
                            <span>{status.value} allocations</span>
                            <span style={{
                              background: COLORS[index % COLORS.length] + '20',
                              color: COLORS[index % COLORS.length],
                              padding: '3px 8px',
                              borderRadius: '12px',
                              fontWeight: '600',
                              fontSize: '11px'
                            }}>
                              {((status.value / totalAllocations) * 100).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status pie chart */}
                <div style={{ width: "40%", position: 'relative' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      {renderGradientDefs()}
                      <Pie
                        data={statusChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={130}
                        innerRadius={50}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                      >
                        {statusChartData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={`url(#${GRADIENTS[index % GRADIENTS.length]})`} 
                          />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} allocations`, 'Count']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Insights and metrics panel */}
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
                    Allocation Insights
                  </h4>

                  {/* Metric Card: Approval Rate */}
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
                      Approval Rate
                    </div>
                    <div style={{ 
                      fontSize: "20px", 
                      fontWeight: "700",
                      color: "#00a9ac",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between"
                    }}>
                      {approvalRate}%
                      <span style={{ 
                        fontSize: "11px",
                        padding: "3px 8px",
                        backgroundColor: "rgba(0, 169, 172, 0.1)",
                        color: "#00a9ac",
                        borderRadius: "12px" 
                      }}>
                        approval efficiency
                      </span>
                    </div>
                  </div>

                  {/* Metric Card: Employee Utilization */}
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
                      Employee Allocation Distribution
                    </div>
                    <div style={{
                      fontSize: "13px",
                      fontWeight: "500",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      marginBottom: "8px"
                    }}>
                      <span>{assignedEmployees} of {employees.length}</span>
                      <span style={{ color: "#687C7B" }}>employees are assigned</span>
                    </div>
                    <div style={{
                      width: "100%",
                      height: "8px",
                      backgroundColor: "#e9ecef",
                      borderRadius: "4px",
                      overflow: "hidden"
                    }}>
                      <div style={{
                        width: `${employeeUtilRate}%`,
                        height: "100%",
                        background: "linear-gradient(90deg, #00a9ac 0%, #66bc6d 100%)"
                      }}/>
                    </div>
                    <div style={{
                      marginTop: "8px",
                      fontSize: "11px",
                      color: "#687C7B",
                      display: "flex",
                      justifyContent: "space-between"
                    }}>
                      <span>Utilization rate: {employeeUtilRate}%</span>
                      <span style={{
                        color: employeeUtilRate > 75 ? "#008a8c" : "#ff8042",
                        fontWeight: "500",
                        textAlign: "right"
                      }}>
                        {employeeUtilRate > 75 ? 'Optimal' : 'Underutilized'}
                      </span>
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
                    Create New Allocation
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
                <p style={{ color: "#687C7B", fontSize: "16px" }}>No allocation data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Distribution Section */}
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
            Workforce Allocation Distribution
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
                Allocations by Department
              </h4>
              
              <div style={{ height: '350px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={departmentChartData}>
                    {renderGradientDefs()}
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`${value} allocations`, 'Count']}
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
                      name="Allocations" 
                      fill={`url(#${GRADIENTS[0]})`}
                      radius={[4, 4, 0, 0]} 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Skills Distribution Chart */}
            <div style={{ flex: 1 }}>
              <h4 style={{ 
                marginBottom: "15px", 
                fontSize: "14px", 
                fontWeight: "600",
                color: '#00a9ac',
                display: 'flex',
                alignItems: 'center'
              }}>
                <i className="fas fa-tools" style={{ marginRight: '8px' }}></i>
                Top Required Skills
              </h4>
              
              <div style={{ height: '350px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={skillsChartData}>
                    {renderGradientDefs()}
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`${value} allocations`, 'Count']}
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
                      name="Skills" 
                      fill={`url(#${GRADIENTS[1]})`}
                      radius={[4, 4, 0, 0]} 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
        
        {/* Allocation Trends Section */}
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
            <i className="fas fa-chart-line" style={{ marginRight: '10px', color: '#00a9ac' }}></i>
            Allocation Trends & Analysis
          </h3>
          
          <div style={{ display: "flex", flexDirection: "row", gap: "30px" }}>
            {/* Monthly Allocation Trend */}
            <div style={{ flex: 1 }}>
              <h4 style={{ 
                marginBottom: "15px", 
                fontSize: "14px", 
                fontWeight: "600",
                color: '#00a9ac',
                display: 'flex',
                alignItems: 'center'
              }}>
                <i className="fas fa-calendar-alt" style={{ marginRight: '8px' }}></i>
                Monthly Allocation Trend
              </h4>
              
              <div style={{ height: '350px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendChartData}>
                    {renderGradientDefs()}
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`${value} allocations`, 'Count']}
                      contentStyle={{
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        border: 'none',
                        padding: '10px 15px'
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="count" 
                      name="Allocations" 
                      stroke="#00a9ac" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Approval Status Distribution */}
            <div style={{ flex: 1 }}>
              <h4 style={{ 
                marginBottom: "15px", 
                fontSize: "14px", 
                fontWeight: "600",
                color: '#00a9ac',
                display: 'flex',
                alignItems: 'center'
              }}>
                <i className="fas fa-clipboard-check" style={{ marginRight: '8px' }}></i>
                Approval Status Distribution
              </h4>
              
              <div style={{ height: '350px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    {renderGradientDefs()}
                    <Pie
                      data={approvalChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={130}
                      innerRadius={50}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                    >
                      {approvalChartData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={`url(#${GRADIENTS[(index + 2) % GRADIENTS.length]})`} 
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} allocations`, 'Count']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
        
        {/* Additional insights section */}
        <div style={{ 
          marginTop: '24px', 
          padding: '15px', 
          backgroundColor: '#f9fafb',
          borderRadius: '8px',
          border: '1px solid #eaeaea',
          boxShadow: '0 4px 12px rgba(0,169,172,0.08)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <h4 style={{ 
                fontSize: '14px', 
                margin: '0 0 8px 0',
                color: '#00a9ac'
              }}>Workforce Allocation Insights</h4>
              <p style={{ 
                fontSize: '13px', 
                margin: '0 0 5px 0',
                color: '#555'
              }}>
                <strong>Most allocated department:</strong> {
                  departmentChartData.length > 0 ? departmentChartData[0].name : 'N/A'
                }
              </p>
              <p style={{ 
                fontSize: '13px', 
                margin: '0 0 5px 0',
                color: '#555'
              }}>
                <strong>Most required skill:</strong> {
                  skillsChartData.length > 0 ? skillsChartData[0].name : 'N/A'
                }
              </p>
              <p style={{ 
                fontSize: '13px', 
                margin: '0',
                color: '#555'
              }}>
                <strong>Employee utilization:</strong> {
                  employeeUtilRate > 75 
                    ? `Optimal (${employeeUtilRate}%)`
                    : `Room for improvement (${employeeUtilRate}%)`
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
              Export Allocation Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkforceAllocationSummaryReport;