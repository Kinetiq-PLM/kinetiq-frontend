import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { 
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from 'recharts';

const OvertimeSummaryReport = ({ overtimeRequests: initialOvertimeRequests = [] }) => {
  const [overtimeRequests, setOvertimeRequests] = useState(initialOvertimeRequests);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch overtime data from API if no data provided as props
  useEffect(() => {
    const fetchOvertimeData = async () => {
      if (initialOvertimeRequests.length > 0) return;
      
      setLoading(true);
      try {
        const response = await axios.get("https://1wj5891jxg.execute-api.ap-southeast-1.amazonaws.com/dev/api/overtime_requests/");
        setOvertimeRequests(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching overtime data:", err);
        setError("Failed to load overtime data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchOvertimeData();
  }, [initialOvertimeRequests]);

  // Calculate metrics
  const metrics = useMemo(() => {
    const totalRequests = overtimeRequests.length;
    const approvedRequests = overtimeRequests.filter(r => r.status === "Approved").length;
    const pendingRequests = overtimeRequests.filter(r => r.status === "Pending").length;
    const rejectedRequests = overtimeRequests.filter(r => r.status === "Rejected").length;
    
    // Calculate approval rate
    const approvalRate = totalRequests > 0 ? 
      ((approvedRequests / totalRequests) * 100).toFixed(1) : 0;
    
    // Calculate total overtime hours
    const totalHours = overtimeRequests.reduce((sum, req) => 
      sum + parseFloat(req.hours || 0), 0).toFixed(1);
    
    return {
      totalRequests,
      approvedRequests,
      pendingRequests,
      rejectedRequests,
      approvalRate,
      totalHours
    };
  }, [overtimeRequests]);

  // Status breakdown for pie chart
  const statusData = useMemo(() => [
    { name: 'Approved', value: metrics.approvedRequests },
    { name: 'Pending', value: metrics.pendingRequests },
    { name: 'Rejected', value: metrics.rejectedRequests }
  ], [metrics]);
  
  // Overtime hours by employee
  const employeeChartData = useMemo(() => {
    const employeeHours = overtimeRequests.reduce((acc, request) => {
      const employeeName = request.employee_name || "Unnamed Employee";
      const hours = parseFloat(request.overtime_hours || request.hours || 0);
      
      if (!acc[employeeName]) {
        acc[employeeName] = { name: employeeName, hours: 0, count: 0 };
      }
      
      acc[employeeName].hours += hours;
      acc[employeeName].count += 1;
      return acc;
    }, {});
    
    return Object.values(employeeHours)
      .map(data => ({ 
        name: data.name, 
        hours: data.hours, 
        count: data.count 
      }))
      .sort((a, b) => b.hours - a.hours)
      .slice(0, 10); // Show top 10 employees by overtime hours
  }, [overtimeRequests]);
  
  // Enhanced colors with gradients
  const COLORS = ['#00a9ac', '#66bc6d', '#ff8042', '#ffc658', '#8884d8'];

  // Define gradient IDs for each color
  const GRADIENTS = COLORS.map((color, index) => `overtimeGradient-${index}`);

  // Helper function to create lighter/darker shade of a color
  const createShade = (hexColor, percent) => {
    const num = parseInt(hexColor.slice(1), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    
    return `#${(1 << 24 | (R < 255 ? (R < 0 ? 0 : R) : 255) << 16 | (G < 255 ? (G < 0 ? 0 : G) : 255) << 8 | (B < 255 ? (B < 0 ? 0 : B) : 255)).toString(16).slice(1)}`;
  };

  // SVG gradient definitions
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
          id={`pieGradient-${index}`} 
          cx="50%" cy="50%" r="50%" 
          fx="50%" fy="50%"
        >
          <stop offset="0%" stopColor={createShade(color, 20)} stopOpacity={0.9} />
          <stop offset="100%" stopColor={color} stopOpacity={1} />
        </radialGradient>
      ))}
    </defs>
  );

  // Employee with most overtime
  const topEmployees = useMemo(() => {
    const employeeHours = overtimeRequests
      .filter(r => r.status === "Approved")
      .reduce((acc, request) => {
        const employeeId = request.employee_id || request.employee || 'unknown';
        const employeeName = request.employee_name || employeeId;
        
        if (!acc[employeeId]) {
          acc[employeeId] = {
            id: employeeId,
            name: employeeName,
            hours: 0,
            count: 0
          };
        }
        
        acc[employeeId].hours += parseFloat(request.hours || 0);
        acc[employeeId].count += 1;
        return acc;
      }, {});
    
    return Object.values(employeeHours)
      .sort((a, b) => b.hours - a.hours)
      .slice(0, 5);
  }, [overtimeRequests]);

  // Custom tooltip for charts
  const CustomBarTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{ 
          backgroundColor: 'white', 
          padding: '12px 15px', 
          border: '1px solid #e0e0e0',
          borderRadius: '6px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}>
          <p style={{ margin: '0 0 5px', fontWeight: 'bold', color: '#333' }}>{data.name}</p>
          <p style={{ margin: '0', color: '#00a9ac', fontWeight: '500' }}>
            <strong>Hours:</strong> {data.hours?.toFixed(1)}
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "50px" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "20px" }}>⏳</div>
          <p style={{ color: "#687C7B", fontSize: "16px" }}>Loading overtime data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "50px" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "20px" }}>⚠️</div>
          <p style={{ color: "#ff8042", fontSize: "16px" }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="hr-report-container">
      {/* Metrics Cards - Enhanced with better visuals */}
      <div className="hr-report-summary-cards">
        <div className="hr-report-summary-card" style={{
          boxShadow: '0 4px 12px rgba(0,169,172,0.08)',
          borderLeft: '4px solid #00a9ac'
        }}>
          <h3>Total Requests</h3>
          <div className="hr-report-value">{metrics.totalRequests}</div>
          <div className="hr-metric-trend">
            <i className="fas fa-file-alt" style={{ color: '#00a9ac', marginRight: '4px' }}></i>
            <span>Overtime requests</span>
          </div>
        </div>
        
        <div className="hr-report-summary-card" style={{
          boxShadow: '0 4px 12px rgba(0,169,172,0.08)',
          borderLeft: '4px solid #66bc6d'
        }}>
          <h3>Approved</h3>
          <div className="hr-report-value">{metrics.approvedRequests}</div>
          <div className="hr-metric-trend">
            <i className="fas fa-check-circle" style={{ color: '#66bc6d', marginRight: '4px' }}></i>
            <span>Approval rate: {metrics.approvalRate}%</span>
          </div>
        </div>
        
        <div className="hr-report-summary-card" style={{
          boxShadow: '0 4px 12px rgba(0,169,172,0.08)',
          borderLeft: '4px solid #ff8042'
        }}>
          <h3>Pending</h3>
          <div className="hr-report-value">{metrics.pendingRequests}</div>
          <div className="hr-metric-trend">
            <i className="fas fa-clock" style={{ color: '#ff8042', marginRight: '4px' }}></i>
            <span>Awaiting approval</span>
          </div>
        </div>
        
        <div className="hr-report-summary-card" style={{
          boxShadow: '0 4px 12px rgba(0,169,172,0.08)',
          borderLeft: '4px solid #8884d8'
        }}>
          <h3>Total Hours</h3>
          <div className="hr-report-value">{metrics.totalHours}</div>
          <div className="hr-metric-trend">
            <i className="fas fa-hourglass-half" style={{ color: '#8884d8', marginRight: '4px' }}></i>
            <span>Overtime hours</span>
          </div>
        </div>
      </div>
      
      {/* Charts Container - Single Column Layout with enhanced styling */}
      <div className="hr-report-charts-single-column">
        {/* Overtime Status Chart */}
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
            Overtime Request Status
          </h3>
          
          <div style={{
            height: "400px",
            display: "flex", 
            flexDirection: "row",
            position: "relative"
          }}>
            {statusData.length > 0 ? (
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
                    <i className="fas fa-clipboard-check" style={{ marginRight: '8px' }}></i>
                    Request Status Breakdown
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
                      }}
                      >
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
                            <span>{status.value} requests</span>
                            <span style={{
                              background: COLORS[index % COLORS.length] + '20',
                              color: COLORS[index % COLORS.length],
                              padding: '3px 8px',
                              borderRadius: '12px',
                              fontWeight: '600',
                              fontSize: '11px'
                            }}>
                              {metrics.totalRequests > 0 ? 
                                ((status.value / metrics.totalRequests) * 100).toFixed(1) : 0}%
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Chart on the right side - with improved layout and visibility */}
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
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
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
                        <Tooltip 
                          formatter={(value, name) => [
                            `${value} requests (${((value / metrics.totalRequests) * 100).toFixed(1)}%)`, 
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

                {/* Request Insights */}
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
                    Overtime Insights
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
                      Overtime Approval Rate
                    </div>
                    <div style={{ 
                      fontSize: "20px", 
                      fontWeight: "700",
                      color: "#00a9ac",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between"
                    }}>
                      {metrics.approvalRate}%
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

                  {/* Metric Card: Department Balance */}
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
                      Request Processing
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
                        overflow: "hidden",
                        display: "flex"
                      }}>
                        {statusData.map((status, idx) => (
                          <div 
                            key={idx} 
                            style={{
                              width: `${metrics.totalRequests > 0 ? 
                                (status.value / metrics.totalRequests) * 100 : 0}%`,
                              height: "100%",
                              backgroundColor: COLORS[idx % COLORS.length]
                            }}
                          />
                        ))}
                      </div>
                    </div>
                    <div style={{
                      marginTop: "8px",
                      fontSize: "11px",
                      color: "#687C7B",
                      display: "flex",
                      justifyContent: "space-between"
                    }}>
                      <span>Pending: {metrics.pendingRequests}</span>
                      <span>Approved: {metrics.approvedRequests}</span>
                    </div>
                  </div>

                  {/* Metric Card: Hours Stats */}
                  <div style={{ 
                    padding: "12px",
                    borderRadius: "8px",
                    backgroundColor: "#f9fafb",
                    border: "1px solid #f0f0f0"
                  }}>
                    <div style={{ 
                      fontSize: "12px", 
                      color: "#687C7B",
                      marginBottom: "5px" 
                    }}>
                      Average Hours per Request
                    </div>
                    <div style={{ 
                      fontSize: "20px", 
                      fontWeight: "700",
                      color: "#00a9ac",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between"
                    }}>
                      {metrics.totalRequests > 0 ? 
                        (metrics.totalHours / metrics.totalRequests).toFixed(1) : 0}
                      <span style={{ 
                        fontSize: "11px",
                        padding: "3px 8px",
                        backgroundColor: "rgba(0, 169, 172, 0.1)",
                        color: "#00a9ac",
                        borderRadius: "12px" 
                      }}>
                        hours/request
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
                    <i className="fas fa-chart-line" style={{ fontSize: "11px" }}></i>
                    View Detailed Analysis
                  </button>
                </div>
              </>
            ) : (
              <div style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{ fontSize: "48px", marginBottom: "15px" }}>📊</div>
                <p style={{ color: "#687C7B", fontSize: "16px" }}>No overtime request data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Overtime Hours by Employee Chart */}
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
            <i className="fas fa-user-clock" style={{ marginRight: '10px', color: '#00a9ac' }}></i>
            Overtime Hours by Employee
          </h3>
          
          <div style={{
            height: "400px",
            display: "flex", 
            flexDirection: "row",
            position: "relative"
          }}>
            {employeeChartData.length > 0 ? (
              <>
                {/* Employee Hours Chart */}
                <div style={{ width: "70%", position: 'relative' }}>
                  <ResponsiveContainer width="100%" height={380}>
                    <BarChart 
                      data={employeeChartData} 
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      {renderGradientDefs()}
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis 
                        type="category" 
                        dataKey="name" 
                        width={150}
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip content={<CustomBarTooltip />} />
                      <Legend />
                      <Bar 
                        dataKey="hours" 
                        name="Overtime Hours"
                        fill={`url(#${GRADIENTS[0]})`}
                        radius={[0, 4, 4, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Employee Statistics */}
                <div style={{ 
                  width: "30%", 
                  borderLeft: "1px dashed #e0e0e0",
                  paddingLeft: "20px",
                  display: "flex",
                  flexDirection: "column"
                }}>
                  <h4 style={{ 
                    fontSize: "14px", 
                    color: "#00a9ac", 
                    marginBottom: "15px",
                    fontWeight: "600",
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <i className="fas fa-chart-bar" style={{ marginRight: '8px' }}></i>
                    Employee Overtime Stats
                  </h4>
                  
                  <div style={{ 
                    padding: "12px",
                    borderRadius: "8px",
                    backgroundColor: "#f9fafb",
                    border: "1px solid #f0f0f0",
                    marginBottom: "15px"
                  }}>
                    <div style={{ 
                      fontSize: "12px", 
                      color: "#687C7B",
                      marginBottom: "5px" 
                    }}>
                      Average Overtime per Employee
                    </div>
                    <div style={{ 
                      fontSize: "20px", 
                      fontWeight: "700",
                      color: "#00a9ac"
                    }}>
                      {employeeChartData.length > 0 
                        ? (employeeChartData.reduce((sum, emp) => sum + emp.hours, 0) / employeeChartData.length).toFixed(1) 
                        : "0.0"}h
                    </div>
                  </div>
                  
                  <div style={{ 
                    padding: "12px",
                    borderRadius: "8px",
                    backgroundColor: "#f9fafb",
                    border: "1px solid #f0f0f0",
                    marginBottom: "15px"
                  }}>
                    <div style={{ 
                      fontSize: "12px", 
                      color: "#687C7B",
                      marginBottom: "5px" 
                    }}>
                      Most Overtime Requests
                    </div>
                    <div style={{ 
                      fontSize: "16px", 
                      fontWeight: "600",
                      color: "#333"
                    }}>
                      {employeeChartData.length > 0 
                        ? employeeChartData.reduce((max, emp) => emp.count > max.count ? emp : max, employeeChartData[0]).name
                        : "N/A"}
                    </div>
                    <div style={{ 
                      fontSize: "12px", 
                      color: "#687C7B",
                      marginTop: "3px"
                    }}>
                      {employeeChartData.length > 0 
                        ? `${employeeChartData.reduce((max, emp) => emp.count > max.count ? emp : max, employeeChartData[0]).count} requests`
                        : ""}
                    </div>
                  </div>
                  
                  <div style={{ 
                    padding: "12px",
                    borderRadius: "8px",
                    backgroundColor: "#f9fafb",
                    border: "1px solid #f0f0f0"
                  }}>
                    <div style={{ 
                      fontSize: "12px", 
                      color: "#687C7B",
                      marginBottom: "5px" 
                    }}>
                      Most Overtime Hours
                    </div>
                    <div style={{ 
                      fontSize: "16px", 
                      fontWeight: "600",
                      color: "#333"
                    }}>
                      {employeeChartData.length > 0 ? employeeChartData[0].name : "N/A"}
                    </div>
                    <div style={{ 
                      fontSize: "12px", 
                      color: "#687C7B",
                      marginTop: "3px"
                    }}>
                      {employeeChartData.length > 0 ? `${employeeChartData[0].hours.toFixed(1)} hours` : ""}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{ fontSize: "48px", marginBottom: "15px" }}>📊</div>
                <p style={{ color: "#687C7B", fontSize: "16px" }}>No employee overtime data available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OvertimeSummaryReport;