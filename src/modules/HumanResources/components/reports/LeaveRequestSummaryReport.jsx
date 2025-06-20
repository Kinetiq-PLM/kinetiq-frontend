import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList
} from 'recharts';

const LeaveRequestSummaryReport = ({ leaveRequests: propsLeaveRequests = [] }) => {
  // State management
  const [leaveRequests, setLeaveRequests] = useState(propsLeaveRequests);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  
  // Enhanced color palette to match other reports
  const COLORS = ['#00a9ac', '#66bc6d', '#8884d8', '#ff8042', '#ffc658', '#82ca9d'];
  const GRADIENTS = COLORS.map((_, index) => `leaveGradient-${index}`);
  
  // Helper function for color shading
  const createShade = (hexColor, percent) => {
    const f = parseInt(hexColor.slice(1), 16);
    const t = percent < 0 ? 0 : 255;
    const p = percent < 0 ? percent * -1 : percent;
    const R = f >> 16;
    const G = (f >> 8) & 0x00FF;
    const B = f & 0x0000FF;
    
    return `#${(0x1000000 + (Math.round((t - R) * p) + R) * 0x10000 + 
      (Math.round((t - G) * p) + G) * 0x100 + 
      (Math.round((t - B) * p) + B)).toString(16).slice(1)}`;
  };

  // Fetch data if not provided through props
  useEffect(() => {
    const fetchData = async () => {
      if (propsLeaveRequests && propsLeaveRequests.length > 0) {
        setLeaveRequests(propsLeaveRequests);
        setLoading(false);
        return;
      }
      
      try {
        const response = await axios.get('http://127.0.0.1:8001/api/employee_leave_requests/leave_requests/');
        setLeaveRequests(response.data);
      } catch (err) {
        console.error("Error fetching leave requests:", err);
        setError("Failed to load leave request data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [propsLeaveRequests]);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      if (leaveRequests.length === 0) return;
      
      try {
        const response = await axios.get("https://yi92cir5p0.execute-api.ap-southeast-1.amazonaws.com/dev/api/prf/employees/");
        
        // Create employee map with department info
        const employeeData = response.data.reduce((map, employee) => {
          map[employee.employee_id] = {
            name: `${employee.first_name} ${employee.last_name}`.trim(),
            dept_id: employee.dept_id
          };
          return map;
        }, {});
        
        // Enhance leave requests with department info
        const enhancedLeaveRequests = leaveRequests.map(request => {
          if (!request.department && employeeData[request.employee_id]) {
            return {
              ...request,
              department: employeeData[request.employee_id].dept_id || "Unassigned"
            };
          }
          return request;
        });
        
        setLeaveRequests(enhancedLeaveRequests);
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };
    
    fetchEmployeeData();
  }, [leaveRequests.length]);
  
  // Show loading state
  if (loading) {
    return (
      <div className="hr-report-container" style={{ textAlign: 'center', padding: '50px 0' }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
        <p style={{ fontSize: '18px', color: '#00a9ac' }}>Loading leave request data...</p>
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
  const totalRequests = leaveRequests?.length || 0;
  const approvedRequests = leaveRequests?.filter(r => r.status === "Approved")?.length || 0;
  const pendingRequests = leaveRequests?.filter(r => r.status === "Pending")?.length || 0;
  const rejectedRequests = leaveRequests?.filter(r => r.status === "Rejected")?.length || 0;
  
  // Calculate approval rate
  const approvalRate = totalRequests > 0 ? 
    ((approvedRequests / totalRequests) * 100).toFixed(1) : 0;
  
  // Calculate average leave days
  const totalLeaveDays = leaveRequests?.reduce((sum, req) => {
    const days = req.total_days || 0;
    return sum + parseFloat(days);
  }, 0) || 0;
  const avgLeaveDays = totalRequests > 0 ? (totalLeaveDays / totalRequests).toFixed(1) : 0;
  
  // Status breakdown
  const statusData = [
    { name: 'Approved', value: approvedRequests },
    { name: 'Pending', value: pendingRequests },
    { name: 'Rejected', value: rejectedRequests }
  ];
  
  // Leave type distribution
  const leaveTypeData = leaveRequests?.reduce((acc, request) => {
    const type = request.leave_type || "Other";
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {}) || {};
  
  const leaveTypeChartData = Object.entries(leaveTypeData)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
  
  // Department distribution
  const departmentData = leaveRequests?.reduce((acc, request) => {
    // Get department from request or mark as "Unassigned"
    const dept = request.department || 
                 (request.dept_id ? request.dept_id : "Unassigned");
    
    // Track both count and related employee IDs
    if (!acc[dept]) {
      acc[dept] = { 
        count: 0, 
        employeeIds: [] 
      };
    }
    
    acc[dept].count += 1;
    if (request.employee_id && !acc[dept].employeeIds.includes(request.employee_id)) {
      acc[dept].employeeIds.push(request.employee_id);
    }
    
    return acc;
  }, {}) || {};
  
  const departmentChartData = Object.entries(departmentData)
    .map(([name, data]) => ({ 
      name, 
      value: data.count,
      employeeCount: data.employeeIds.length
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 7); // Show top 7 departments
  
  // Monthly leave request trends
  const monthlyData = leaveRequests?.reduce((acc, req) => {
    let month = "Unknown";
    if (req.start_date) {
      const date = new Date(req.start_date);
      month = date.toLocaleString('default', { month: 'short', year: '2-digit' });
    }
    
    if (!acc[month]) {
      acc[month] = { month, total: 0, approved: 0, pending: 0, rejected: 0 };
    }
    
    acc[month].total += 1;
    
    if (req.status === "Approved") acc[month].approved += 1;
    else if (req.status === "Pending") acc[month].pending += 1;
    else if (req.status === "Rejected") acc[month].rejected += 1;
    
    return acc;
  }, {}) || {};
  
  const monthlyChartData = Object.values(monthlyData)
    .sort((a, b) => {
      // Convert month names to dates for proper sorting
      const monthNames = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
      const [aMonth, aYear] = a.month.split(" ");
      const [bMonth, bYear] = b.month.split(" ");
      
      if (aYear !== bYear) return parseInt(aYear) - parseInt(bYear);
      return monthNames[aMonth] - monthNames[bMonth];
    })
    .slice(-6); // Show only the last 6 months
  
  // Render gradient definitions for charts
  const renderGradientDefs = () => (
    <defs>
      {COLORS.map((color, index) => (
        <linearGradient 
          key={`gradient-${index}`} 
          id={GRADIENTS[index]} 
          x1="0" y1="0" 
          x2="0" y2="1"
        >
          <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
          <stop offset="95%" stopColor={color} stopOpacity={0.2}/>
        </linearGradient>
      ))}
      
      {COLORS.map((color, index) => (
        <radialGradient 
          key={`radial-gradient-${index}`} 
          id={`pieGradient-${index}`} 
          cx="50%" cy="50%" r="50%" 
          fx="50%" fy="50%"
        >
          <stop offset="0%" stopColor={createShade(color, 0.2)} stopOpacity={0.9} />
          <stop offset="70%" stopColor={color} stopOpacity={0.95} />
          <stop offset="100%" stopColor={createShade(color, -0.1)} stopOpacity={1} />
        </radialGradient>
      ))}
    </defs>
  );

  const handleUploadSuccess = (fileData) => {
    setUploadedFile(fileData);
    console.log("File uploaded successfully:", fileData);
    alert(`Report applied successfully! File available at: ${fileData.filePath}`);
  };

  return (
    <div className="hr-report-container">
      {/* Metrics Cards */}
      <div className="hr-report-summary-cards">
        <div className="hr-report-summary-card" style={{
          boxShadow: '0 4px 12px rgba(0,169,172,0.08)',
          borderLeft: '4px solid #00a9ac'
        }}>
          <h3>Total Leave Requests</h3>
          <div className="hr-report-value">{totalRequests}</div>
          <div className="hr-metric-trend">
            <i className="fas fa-calendar-check" style={{ color: '#00a9ac', marginRight: '4px' }}></i>
            <span>All leave entries</span>
          </div>
        </div>
        
        <div className="hr-report-summary-card" style={{
          boxShadow: '0 4px 12px rgba(0,169,172,0.08)',
          borderLeft: '4px solid #66bc6d'
        }}>
          <h3>Approval Rate</h3>
          <div className="hr-report-value">{approvalRate}%</div>
          <div className="hr-metric-trend">
            <i className="fas fa-thumbs-up" style={{ color: '#66bc6d', marginRight: '4px' }}></i>
            <span>Of all requests</span>
          </div>
        </div>
        
        <div className="hr-report-summary-card" style={{
          boxShadow: '0 4px 12px rgba(0,169,172,0.08)',
          borderLeft: '4px solid #8884d8'
        }}>
          <h3>Pending Requests</h3>
          <div className="hr-report-value">{pendingRequests}</div>
          <div className="hr-metric-trend">
            <i className="fas fa-hourglass-half" style={{ color: '#8884d8', marginRight: '4px' }}></i>
            <span>Awaiting approval</span>
          </div>
        </div>
        
        <div className="hr-report-summary-card" style={{
          boxShadow: '0 4px 12px rgba(0,169,172,0.08)',
          borderLeft: '4px solid #ff8042'
        }}>
          <h3>Avg. Leave Days</h3>
          <div className="hr-report-value">{avgLeaveDays}</div>
          <div className="hr-metric-trend">
            <i className="fas fa-clock" style={{ color: '#ff8042', marginRight: '4px' }}></i>
            <span>Days per request</span>
          </div>
        </div>
      </div>
      
      {/* Charts Container - Single Column Layout */}
      <div className="hr-report-charts-single-column">
        {/* Status Distribution Section - Enhanced with Insights Panel */}
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
            Leave Request Status
          </h3>
          
          <div style={{
            height: "450px",
            display: "flex", 
            flexDirection: "row",
            position: "relative"
          }}>
            {leaveRequests.length > 0 ? (
              <>
                {/* Left Panel - Status List */}
                <div style={{ 
                  width: "30%", 
                  padding: "10px 20px 10px 10px",
                  display: "flex",
                  flexDirection: "column"
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
                    Request Status
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
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
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
                      }}
                      >
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
                            flexDirection: 'column',
                            gap: '5px'
                          }}>
                            <div style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center'
                            }}>
                              <span>{status.value} requests</span>
                              <span style={{
                                background: COLORS[index % COLORS.length] + '20',
                                color: COLORS[index % COLORS.length],
                                padding: '3px 8px',
                                borderRadius: '12px',
                                fontWeight: '600',
                                fontSize: '11px'
                              }}>
                                {totalRequests > 0 ? ((status.value / totalRequests) * 100).toFixed(1) : 0}%
                              </span>
                            </div>
                            <div style={{
                              width: "100%",
                              height: "6px",
                              backgroundColor: "#e9ecef",
                              borderRadius: "3px",
                              overflow: "hidden"
                            }}>
                              <div style={{
                                width: `${totalRequests > 0 ? ((status.value / totalRequests) * 100) : 0}%`,
                                height: "100%",
                                backgroundColor: COLORS[index % COLORS.length]
                              }}/>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Center - Pie Chart */}
                <div style={{ width: "40%", position: 'relative' }}>
                  <div style={{ position: 'absolute', top: 0, right: 0, left: 0, bottom: 0 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                        {renderGradientDefs()}
                        
                        <Pie
                          data={statusData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          outerRadius={130}
                          innerRadius={40}
                          paddingAngle={1}
                          dataKey="value"
                          nameKey="name"
                          fill="#8884d8"
                          label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          startAngle={90}
                          endAngle={-270}
                        >
                          {statusData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={`url(#pieGradient-${index % COLORS.length})`}
                              stroke="#fff"
                              strokeWidth={2}
                            />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Right - Insights Panel */}
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
                    Leave Request Insights
                  </h4>

                  {/* Most Common Leave Type */}
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
                      Most Common Leave Type
                    </div>
                    <div style={{ 
                      fontSize: "20px", 
                      fontWeight: "700",
                      color: "#00a9ac",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between"
                    }}>
                      {leaveTypeChartData.length > 0 ? leaveTypeChartData[0].name : 'N/A'}
                      <span style={{ 
                        fontSize: "11px",
                        padding: "3px 8px",
                        backgroundColor: "rgba(0, 169, 172, 0.1)",
                        color: "#00a9ac",
                        borderRadius: "12px" 
                      }}>
                        {leaveTypeChartData.length > 0 ? leaveTypeChartData[0].value : '0'} requests
                      </span>
                    </div>
                  </div>

                  {/* Department with Highest Leave */}
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
                      Department with Most Leaves
                    </div>
                    <div style={{ 
                      fontSize: "16px", 
                      fontWeight: "600",
                      color: "#00a9ac",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between"
                    }}>
                      {departmentChartData.length > 0 ? departmentChartData[0].name : 'N/A'}
                      <span style={{ 
                        fontSize: "11px",
                        padding: "3px 8px",
                        backgroundColor: "rgba(0, 169, 172, 0.1)",
                        color: "#00a9ac",
                        borderRadius: "12px" 
                      }}>
                        {departmentChartData.length > 0 ? departmentChartData[0].value : '0'} requests
                      </span>
                    </div>
                  </div>
                  
                  {/* Monthly Leave Spike */}
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
                      Month with Highest Requests
                    </div>
                    <div style={{ 
                      fontSize: "16px", 
                      fontWeight: "600",
                      color: "#00a9ac",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between"
                    }}>
                      {monthlyChartData.length > 0 ? 
                        monthlyChartData.reduce((max, month) => 
                          month.total > max.total ? month : max, monthlyChartData[0]).month 
                        : 'N/A'}
                      <span style={{ 
                        fontSize: "11px",
                        padding: "3px 8px",
                        backgroundColor: "rgba(0, 169, 172, 0.1)",
                        color: "#00a9ac",
                        borderRadius: "12px" 
                      }}>
                        {monthlyChartData.length > 0 ? 
                          monthlyChartData.reduce((max, month) => 
                            month.total > max.total ? month : max, monthlyChartData[0]).total 
                          : '0'} requests
                      </span>
                    </div>
                  </div>

                  {/* Export Button */}
                  <button style={{
                    marginTop: "10px",
                    padding: "10px 14px",
                    backgroundColor: "white",
                    border: "1px solid #00a9ac",
                    borderRadius: "6px",
                    color: "#00a9ac",
                    fontSize: "13px",
                    fontWeight: "500",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    width: "100%",
                    transition: "all 0.2s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(0, 169, 172, 0.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "white";
                  }}>
                    <i className="fas fa-file-export" style={{ fontSize: "12px" }}></i>
                    Download Report Data
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
                <p style={{ color: "#687C7B", fontSize: "16px" }}>No leave request data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Two-column layout for other charts */}
        <div style={{ display: 'flex', gap: '24px', marginTop: '24px' }}>
          {/* Leave Type Distribution Section */}
          <div className="hr-report-chart" style={{
            flex: 1,
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
              <i className="fas fa-chart-bar" style={{ marginRight: '10px', color: '#00a9ac' }}></i>
              Leave Type Distribution
            </h3>
            
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={leaveTypeChartData}>
                {renderGradientDefs()}
                
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12, fill: '#555' }}
                  tickLine={{ stroke: '#eee' }}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: '#555' }}
                  tickLine={{ stroke: '#eee' }}
                />
                <Tooltip 
                  formatter={(value) => [`${value} requests`, 'Count']}
                  contentStyle={{
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    border: 'none',
                    padding: '10px 15px'
                  }}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '10px' }}
                  formatter={(value) => <span style={{ color: '#555', fontSize: '12px' }}>{value}</span>}
                />
                <Bar 
                  dataKey="value" 
                  name="Requests" 
                  fill={`url(#${GRADIENTS[0]})`}
                  radius={[4, 4, 0, 0]}
                >
                  <LabelList dataKey="value" position="top" fill="#555" fontSize={12} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Department Distribution Section */}
          <div className="hr-report-chart" style={{
            flex: 1,
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
              <i className="fas fa-building" style={{ marginRight: '10px', color: '#00a9ac' }}></i>
              Leave Requests by Department
            </h3>
            
            <ResponsiveContainer width="100%" height={300}>
              <BarChart 
                layout="vertical"
                data={departmentChartData}
                margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
              >
                {renderGradientDefs()}
                
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  type="number"
                  tick={{ fontSize: 12, fill: '#555' }}
                  tickLine={{ stroke: '#eee' }}
                />
                <YAxis 
                  type="category"
                  dataKey="name" 
                  tick={{ fontSize: 12, fill: '#555' }}
                  tickLine={{ stroke: '#eee' }}
                  width={120}
                />
                <Tooltip 
                  formatter={(value, name, props) => {
                    if (name === "Requests") return [`${value} requests`, name];
                    return [`${value} employees`, name];
                  }}
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
                  dataKey="value" 
                  name="Requests" 
                  fill={`url(#${GRADIENTS[1]})`}
                  radius={[0, 4, 4, 0]}
                >
                  <LabelList dataKey="value" position="right" fill="#555" fontSize={12} />
                </Bar>
                <Bar 
                  dataKey="employeeCount" 
                  name="Employees" 
                  fill={`url(#${GRADIENTS[2]})`}
                  radius={[0, 4, 4, 0]}
                  barSize={10}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Trends Section */}
        <div className="hr-report-chart-full" style={{
          boxShadow: '0 6px 16px rgba(0,169,172,0.08)',
          borderRadius: '12px',
          padding: '20px',
          background: 'white',
          marginTop: '24px'
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
            Monthly Leave Request Trends
          </h3>
          
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyChartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              {renderGradientDefs()}
              
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12, fill: '#555' }}
                tickLine={{ stroke: '#eee' }}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#555' }}
                tickLine={{ stroke: '#eee' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  border: 'none',
                  padding: '10px 15px'
                }}
              />
              <Legend 
                wrapperStyle={{ paddingTop: '10px' }}
                formatter={(value) => <span style={{ color: '#555', fontSize: '12px' }}>{value}</span>}
              />
              <Line 
                type="monotone" 
                dataKey="total" 
                name="Total Requests" 
                stroke={COLORS[0]} 
                strokeWidth={3}
                dot={{ fill: COLORS[0], r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="approved" 
                name="Approved" 
                stroke={COLORS[1]} 
                strokeWidth={2} 
                dot={{ fill: COLORS[1], r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="pending" 
                name="Pending" 
                stroke={COLORS[2]} 
                strokeWidth={2}
                dot={{ fill: COLORS[2], r: 4 }} 
              />
              <Line 
                type="monotone" 
                dataKey="rejected" 
                name="Rejected" 
                stroke={COLORS[3]} 
                strokeWidth={2}
                dot={{ fill: COLORS[3], r: 4 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Analysis Summary Section */}
        <div style={{ 
          marginTop: '24px', 
          padding: '15px', 
          backgroundColor: '#f9fafb',
          borderRadius: '8px',
          border: '1px solid #eaeaea',
          boxShadow: '0 4px 12px rgba(0,169,172,0.08)'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start'
          }}>
            <div style={{ flex: 3 }}>
              <h3 style={{ 
                margin: '0 0 15px 0',
                fontSize: '18px',
                fontWeight: '600',
                color: '#333'
              }}>
                <i className="fas fa-lightbulb" style={{ marginRight: '8px', color: '#00a9ac' }}></i>
                Leave Request Insights
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <h4 style={{ 
                    margin: '0 0 8px 0',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#00a9ac'
                  }}>
                    Status Summary
                  </h4>
                  <p style={{ 
                    margin: '0 0 5px 0',
                    fontSize: '13px',
                    color: '#555'
                  }}>
                    <strong>Approved:</strong> {approvedRequests} requests ({approvalRate}%)
                  </p>
                  <p style={{ 
                    margin: '0 0 5px 0',
                    fontSize: '13px',
                    color: '#555'
                  }}>
                    <strong>Pending:</strong> {pendingRequests} requests ({totalRequests > 0 ? ((pendingRequests / totalRequests) * 100).toFixed(1) : 0}%)
                  </p>
                  <p style={{ 
                    margin: '0',
                    fontSize: '13px',
                    color: '#555'
                  }}>
                    <strong>Rejected:</strong> {rejectedRequests} requests ({totalRequests > 0 ? ((rejectedRequests / totalRequests) * 100).toFixed(1) : 0}%)
                  </p>
                </div>
                
                <div>
                  <h4 style={{ 
                    margin: '0 0 8px 0',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#00a9ac'
                  }}>
                    Leave Type Analysis
                  </h4>
                  <p style={{ 
                    margin: '0 0 5px 0',
                    fontSize: '13px',
                    color: '#555'
                  }}>
                    <strong>Most common type:</strong> {leaveTypeChartData.length > 0 ? leaveTypeChartData[0].name : 'N/A'}
                  </p>
                  <p style={{ 
                    margin: '0 0 5px 0',
                    fontSize: '13px',
                    color: '#555'
                  }}>
                    <strong>Total days requested:</strong> {totalLeaveDays.toFixed(1)} days
                  </p>
                  <p style={{ 
                    margin: '0',
                    fontSize: '13px',
                    color: '#555'
                  }}>
                    <strong>Departments with most requests:</strong> {departmentChartData.length > 0 ? departmentChartData[0].name : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Actions */}
            <div style={{ 
              flex: 1,
              display: 'flex',
              justifyContent: 'flex-end'
            }}>
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
                Export Report
              </button>
            </div>
          </div>
          
          {uploadedFile && (
            <div style={{
              marginTop: '15px',
              padding: '10px',
              backgroundColor: 'rgba(0, 169, 172, 0.1)',
              borderRadius: '6px',
              fontSize: '13px',
              color: '#00a9ac'
            }}>
              <i className="fas fa-check-circle" style={{ marginRight: '8px' }}></i>
              Report applied and saved as: {uploadedFile.fileName}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaveRequestSummaryReport;