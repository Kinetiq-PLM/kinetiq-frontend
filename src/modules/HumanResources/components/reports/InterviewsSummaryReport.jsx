import React, { useState, useEffect } from "react";
import { 
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line
} from 'recharts';
import axios from 'axios';

const InterviewsSummaryReport = ({ interviews = [] }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [interviewData, setInterviewData] = useState(interviews || []);
  
  // Fetch interview data from API
  useEffect(() => {
    const fetchInterviews = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('http://127.0.0.1:8001/api/interviews/');
        console.log("Interview data fetched:", response.data);
        setInterviewData(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching interview data:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  // Calculate metrics
  const totalInterviews = interviewData.length;
  const completedInterviews = interviewData.filter(i => i.status === "Completed").length;
  const scheduledInterviews = interviewData.filter(i => i.status === "Scheduled").length;
  const cancelledInterviews = interviewData.filter(i => i.status === "Cancelled").length;
  
  // Calculate interviews this month
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const interviewsThisMonth = interviewData.filter(interview => {
    if (!interview.interview_date) return false;
    const date = new Date(interview.interview_date);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  }).length;
  
  // Calculate success rate (interviews that led to offers)
  const successfulInterviews = interviewData.filter(i => i.outcome === "Selected" || i.outcome === "Offer Extended").length;
  const successRate = completedInterviews > 0 ? Math.round((successfulInterviews / completedInterviews) * 100) : 0;
  
  // Calculate completion rate
  const completionRate = totalInterviews > 0 ? 
    Math.round((completedInterviews / totalInterviews) * 100) : 0;
  
  // Interview outcomes for pie chart
  const outcomeData = interviewData.reduce((acc, interview) => {
    if (interview.status !== "Completed") return acc;
    
    const outcome = interview.outcome || "Pending";
    acc[outcome] = (acc[outcome] || 0) + 1;
    return acc;
  }, {});
  
  const outcomeChartData = Object.entries(outcomeData)
    .map(([name, count]) => ({ name, count }));
  
  // Interviews by week day
  const weekdayData = interviewData.reduce((acc, interview) => {
    // Skip interviews without a date
    if (!interview.interview_date) return acc;
    
    const date = new Date(interview.interview_date);
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const day = weekdays[date.getDay()];
    
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {});
  
  // Sort weekdays in proper order
  const weekdayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const weekdayChartData = weekdayOrder.map(day => ({
    name: day,
    count: weekdayData[day] || 0
  }));
  
  // Department chart data
  const departmentData = interviewData.reduce((acc, interview) => {
    const dept = interview.department || "Unassigned";
    acc[dept] = (acc[dept] || 0) + 1;
    return acc;
  }, {});
  
  const departmentChartData = Object.entries(departmentData)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
  
  // Interviews by month for trend chart
  const monthlyData = interviewData.reduce((acc, interview) => {
    if (!interview.interview_date) return acc;
    
    const date = new Date(interview.interview_date);
    const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
    
    if (!acc[monthYear]) {
      acc[monthYear] = { 
        name: monthYear, 
        total: 0, 
        completed: 0, 
        scheduled: 0, 
        cancelled: 0 
      };
    }
    
    acc[monthYear].total += 1;
    
    if (interview.status === "Completed") acc[monthYear].completed += 1;
    else if (interview.status === "Scheduled") acc[monthYear].scheduled += 1;
    else if (interview.status === "Cancelled") acc[monthYear].cancelled += 1;
    
    return acc;
  }, {});
  
  // Convert to array and sort chronologically
  const monthlyChartData = Object.values(monthlyData)
    .sort((a, b) => {
      const [monthA, yearA] = a.name.split(' ');
      const [monthB, yearB] = b.name.split(' ');
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      if (yearA !== yearB) return parseInt(yearA) - parseInt(yearB);
      return months.indexOf(monthA) - months.indexOf(monthB);
    });
  
  // Interviewer participation data
  const interviewerData = interviewData.reduce((acc, interview) => {
    const interviewer = interview.interviewer_name || "Unassigned";
    if (!acc[interviewer]) acc[interviewer] = 0;
    acc[interviewer] += 1;
    return acc;
  }, {});
  
  const interviewerChartData = Object.entries(interviewerData)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
  
  // Get most common interview day
  const mostCommonDay = weekdayChartData.reduce(
    (max, day) => (day.count > max.count ? day : max),
    { name: "", count: 0 }
  );

  // Get most common outcome
  const mostCommonOutcome = outcomeChartData.length > 0 ? 
    outcomeChartData.reduce(
      (max, outcome) => (outcome.count > max.count ? outcome : max),
      { name: "", count: 0 }
    ) : { name: "N/A", count: 0 };
    
  // Get most active interviewer
  const mostActiveInterviewer = interviewerChartData.length > 0 ? 
    interviewerChartData[0] : { name: "N/A", count: 0 };
    
  // Get most active department
  const mostActiveDepartment = departmentChartData.length > 0 ?
    departmentChartData[0] : { name: "N/A", count: 0 };

  // Enhanced color palette matching department summary
  const COLORS = [
    '#00a8a8', '#66bc6d', '#8884d8', '#ff8042', 
    '#ffc658', '#82ca9d', '#8dd1e1', '#a4de6c',
    '#d0ed57', '#97e3d5', '#f5a623', '#f78da7'
  ];

  // Helper function to create lighter/darker shade of a color
  const createShade = (hexColor, percent) => {
    const num = parseInt(hexColor.slice(1), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    
    return `#${(1 << 24 | (R < 255 ? (R < 0 ? 0 : R) : 255) << 16 | (G < 255 ? (G < 0 ? 0 : G) : 255) << 8 | (B < 255 ? (B < 0 ? 0 : B) : 255)).toString(16).slice(1)}`;
  };

  // SVG gradient definitions for charts
  const renderGradientDefs = () => (
    <defs>
      {COLORS.map((color, index) => (
        <linearGradient 
          key={`gradient-${index}`} 
          id={`interviewGradient-${index}`} 
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
          id={`interviewPieGradient-${index}`} 
          cx="50%" cy="50%" r="50%" 
          fx="50%" fy="50%"
        >
          <stop offset="0%" stopColor={createShade(color, 20)} stopOpacity={0.9} />
          <stop offset="100%" stopColor={color} stopOpacity={1} />
        </radialGradient>
      ))}
    </defs>
  );

  // Custom tooltip for the bar chart
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
            <strong>Interviews:</strong> {data.count}
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for the line chart
  const CustomLineTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ 
          backgroundColor: 'white', 
          padding: '12px 15px', 
          border: '1px solid #e0e0e0',
          borderRadius: '6px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}>
          <p style={{ margin: '0 0 5px', fontWeight: 'bold', color: '#333' }}>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ 
              margin: '5px 0', 
              color: entry.color,
              display: 'flex',
              alignItems: 'center'
            }}>
              <span style={{
                display: 'inline-block',
                width: '8px',
                height: '8px',
                backgroundColor: entry.color,
                marginRight: '8px',
                borderRadius: '2px'
              }}></span>
              <span style={{ fontWeight: '500' }}>{entry.name}: {entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Calculate average interview score if available
  const avgScore = interviewData
    .filter(i => i.score !== undefined && i.score !== null)
    .reduce((acc, i, idx, arr) => {
      acc += i.score;
      return idx === arr.length - 1 ? acc / arr.length : acc;
    }, 0);
    
  // Format the average score
  const formattedAvgScore = avgScore ? avgScore.toFixed(1) : "N/A";

  // Loading and error handling
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading interview data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-banner">
        <p>Error loading interview data: {error.message}</p>
        <button className="reload-btn" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="hr-report-container">
      {/* Metrics Cards - Enhanced with better visuals */}
      <div className="hr-report-summary-cards" style={{ 
        display: 'flex', 
        gap: '20px', 
        marginBottom: '24px',
        flexWrap: 'wrap'
      }}>
        <div className="hr-report-summary-card" style={{
          flex: '1',
          minWidth: '200px',
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 4px 12px rgba(0,169,172,0.08)',
          borderLeft: '4px solid #00a9ac',
        }}>
          <h3 style={{ fontSize: '14px', color: '#687C7B', margin: '0 0 8px 0' }}>Total Interviews</h3>
          <div className="hr-report-value" style={{ fontSize: '28px', fontWeight: '700', color: '#212529' }}>{totalInterviews}</div>
          <div className="hr-metric-trend" style={{ fontSize: '12px', color: '#687C7B', marginTop: '8px', display: 'flex', alignItems: 'center' }}>
            <i className="fas fa-users" style={{ marginRight: '6px', color: '#00a9ac' }}></i>
            <span>All time interviews</span>
          </div>
        </div>
        
        <div className="hr-report-summary-card" style={{
          flex: '1',
          minWidth: '200px',
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 4px 12px rgba(0,169,172,0.08)',
          borderLeft: '4px solid #66bc6d'
        }}>
          <h3 style={{ fontSize: '14px', color: '#687C7B', margin: '0 0 8px 0' }}>Interviews This Month</h3>
          <div className="hr-report-value" style={{ fontSize: '28px', fontWeight: '700', color: '#212529' }}>{interviewsThisMonth}</div>
          <div className="hr-metric-trend" style={{ fontSize: '12px', color: '#687C7B', marginTop: '8px', display: 'flex', alignItems: 'center' }}>
            <i className="fas fa-calendar-check" style={{ marginRight: '6px', color: '#66bc6d' }}></i>
            <span>Current month activity</span>
          </div>
        </div>
        
        <div className="hr-report-summary-card" style={{
          flex: '1',
          minWidth: '200px',
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 4px 12px rgba(0,169,172,0.08)',
          borderLeft: '4px solid #8884d8'
        }}>
          <h3 style={{ fontSize: '14px', color: '#687C7B', margin: '0 0 8px 0' }}>Success Rate</h3>
          <div className="hr-report-value" style={{ fontSize: '28px', fontWeight: '700', color: '#212529' }}>{successRate}%</div>
          <div className="hr-metric-trend" style={{ fontSize: '12px', color: '#687C7B', marginTop: '8px', display: 'flex', alignItems: 'center' }}>
            <i className="fas fa-chart-line" style={{ marginRight: '6px', color: '#8884d8' }}></i>
            <span>Interviews leading to offer</span>
          </div>
        </div>
        
        <div className="hr-report-summary-card" style={{
          flex: '1',
          minWidth: '200px',
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 4px 12px rgba(0,169,172,0.08)',
          borderLeft: '4px solid #ff8042'
        }}>
          <h3 style={{ fontSize: '14px', color: '#687C7B', margin: '0 0 8px 0' }}>Completion Rate</h3>
          <div className="hr-report-value" style={{ fontSize: '28px', fontWeight: '700', color: '#212529' }}>{completionRate}%</div>
          <div className="hr-metric-trend" style={{ fontSize: '12px', color: '#687C7B', marginTop: '8px', display: 'flex', alignItems: 'center' }}>
            <i className="fas fa-check-circle" style={{ marginRight: '6px', color: '#ff8042' }}></i>
            <span>Completed interviews</span>
          </div>
        </div>
      </div>
      
      {/* Charts Container - Enhanced with insights panel */}
      <div className="hr-report-charts-single-column">
        {/* Interview Outcomes Chart with insights panel */}
        <div className="hr-report-chart-full" style={{
          boxShadow: '0 6px 16px rgba(0,169,172,0.08)',
          borderRadius: '12px',
          padding: '20px',
          background: 'white',
          marginBottom: '24px'
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
            Interview Outcomes Analysis
          </h3>
          
          <div style={{
            height: "450px",
            display: "flex", 
            flexDirection: "row",
            position: "relative"
          }}>
            {outcomeChartData.length > 0 ? (
              <>
                {/* Outcomes legend with improved layout */}
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
                    <i className="fas fa-list-ul" style={{ marginRight: '8px' }}></i>
                    Outcome Distribution
                  </h4>
                  
                  <div style={{ 
                    display: "flex", 
                    flexDirection: "column", 
                    gap: "10px",
                    maxHeight: "400px",
                    overflowY: "auto"
                  }}>
                    {outcomeChartData.map((outcome, index) => (
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
                            {outcome.name}
                          </div>
                          <div style={{ 
                            fontSize: "12px", 
                            color: "#687C7B",
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}>
                            <span>{outcome.count} interviews</span>
                            <span style={{
                              background: COLORS[index % COLORS.length] + '20',
                              color: COLORS[index % COLORS.length],
                              padding: '3px 8px',
                              borderRadius: '12px',
                              fontWeight: '600',
                              fontSize: '11px'
                            }}>
                              {((outcome.count / completedInterviews) * 100).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Chart on the middle */}
                <div style={{ width: "40%", position: 'relative' }}>
                  <div style={{ position: 'absolute', top: 0, right: 0, left: 0, bottom: 0 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart margin={{ top: 10, right: 30, bottom: 10, left: 30 }}> 
                        {renderGradientDefs()}
                        <Pie
                          data={outcomeChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          outerRadius={130}
                          innerRadius={40}
                          paddingAngle={1}
                          fill="#8884d8"
                          dataKey="count"
                          nameKey="name"
                          label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {outcomeChartData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={`url(#interviewPieGradient-${index % COLORS.length})`}
                              stroke="#fff"
                              strokeWidth={2}
                            />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value, name) => [
                            `${value} interviews (${((value / completedInterviews) * 100).toFixed(1)}%)`, 
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

                {/* Interview Outcomes Insights Panel */}
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
                    Interview Insights
                  </h4>

                  {/* Most Common Outcome */}
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
                      Most Common Outcome
                    </div>
                    <div style={{ 
                      fontSize: "20px", 
                      fontWeight: "700",
                      color: "#00a9ac",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between"
                    }}>
                      {mostCommonOutcome.name}
                      <span style={{ 
                        fontSize: "11px",
                        padding: "3px 8px",
                        backgroundColor: "rgba(0, 169, 172, 0.1)",
                        color: "#00a9ac",
                        borderRadius: "12px" 
                      }}>
                        {mostCommonOutcome.count} interviews
                      </span>
                    </div>
                  </div>

                  {/* Success vs Rejection Rate */}
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
                      Success vs Rejection
                    </div>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: "8px"
                    }}>
                      <div style={{
                        width: "100%",
                        height: "8px",
                        backgroundColor: "#e9ecef",
                        borderRadius: "4px",
                        overflow: "hidden",
                        display: "flex"
                      }}>
                        <div style={{
                          width: `${successRate}%`,
                          height: "100%",
                          backgroundColor: "#66bc6d"
                        }}/>
                        <div style={{
                          width: `${100 - successRate}%`,
                          height: "100%",
                          backgroundColor: "#ff8042"
                        }}/>
                      </div>
                    </div>
                    <div style={{
                      fontSize: "11px",
                      color: "#687C7B",
                      display: "flex",
                      justifyContent: "space-between"
                    }}>
                      <span style={{ color: "#66bc6d", fontWeight: "500" }}>
                        {successRate}% Success
                      </span>
                      <span style={{ color: "#ff8042", fontWeight: "500" }}>
                        {100 - successRate}% Rejection
                      </span>
                    </div>
                  </div>

                  {/* Average Interview Score */}
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
                      Average Candidate Score
                    </div>
                    <div style={{ 
                      fontSize: "20px", 
                      fontWeight: "700",
                      color: "#00a9ac",
                      marginBottom: "8px"
                    }}>
                      {formattedAvgScore} <span style={{ fontSize: "14px", fontWeight: "400", color: "#687C7B" }}>/10</span>
                    </div>
                    <div style={{
                      width: "100%",
                      height: "8px",
                      backgroundColor: "#e9ecef",
                      borderRadius: "4px",
                      overflow: "hidden"
                    }}>
                      <div style={{
                        width: `${avgScore ? (avgScore / 10) * 100 : 0}%`,
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
                    <i className="fas fa-chart-bar" style={{ fontSize: "11px" }}></i>
                    View Detailed Analysis
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
                <p style={{ color: "#687C7B", fontSize: "16px" }}>No interview outcome data available</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Interview Schedule Analysis with insights panel */}
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
            <i className="fas fa-calendar" style={{ marginRight: '10px', color: '#00a9ac' }}></i>
            Interview Schedule Analysis
          </h3>
          
          <div style={{
            height: "450px",
            display: "flex", 
            flexDirection: "row",
            position: "relative"
          }}>
            {weekdayChartData.some(day => day.count > 0) ? (
              <>
                {/* Weekday legend with improved layout */}
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
                    <i className="fas fa-calendar-day" style={{ marginRight: '8px' }}></i>
                    Interviews by Day
                  </h4>
                  
                  <div style={{ 
                    display: "flex", 
                    flexDirection: "column", 
                    gap: "10px",
                    maxHeight: "400px",
                    overflowY: "auto"
                  }}>
                    {weekdayChartData.map((day, index) => (
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
                            {day.name}
                          </div>
                          <div style={{ 
                            fontSize: "12px", 
                            color: "#687C7B",
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}>
                            <span>{day.count} interviews</span>
                            <span style={{
                              background: COLORS[index % COLORS.length] + '20',
                              color: COLORS[index % COLORS.length],
                              padding: '3px 8px',
                              borderRadius: '12px',
                              fontWeight: '600',
                              fontSize: '11px'
                            }}>
                              {totalInterviews > 0 ? ((day.count / totalInterviews) * 100).toFixed(1) : 0}%
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Chart in middle */}
                <div style={{ width: "40%", position: 'relative' }}>
                  <div style={{ position: 'absolute', top: 0, right: 0, left: 0, bottom: 0 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={weekdayChartData}>
                        {renderGradientDefs()}
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis 
                          dataKey="name" 
                          axisLine={false} 
                          tickLine={false}
                          tick={{ fontSize: 12, fill: '#687C7B' }}
                        />
                        <YAxis 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 12, fill: '#687C7B' }}
                        />
                        <Tooltip content={<CustomBarTooltip />} />
                        <Bar 
                          dataKey="count" 
                          fill={`url(#interviewGradient-0)`} 
                          name="Interviews" 
                          radius={[4, 4, 0, 0]}
                          maxBarSize={50}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Schedule Insights Panel */}
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
                    Scheduling Insights
                  </h4>

                  {/* Most Common Day */}
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
                      Most Popular Day
                    </div>
                    <div style={{ 
                      fontSize: "20px", 
                      fontWeight: "700",
                      color: "#00a9ac",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between"
                    }}>
                      {mostCommonDay.name}
                      <span style={{ 
                        fontSize: "11px",
                        padding: "3px 8px",
                        backgroundColor: "rgba(0, 169, 172, 0.1)",
                        color: "#00a9ac",
                        borderRadius: "12px" 
                      }}>
                        {mostCommonDay.count} interviews
                      </span>
                    </div>
                  </div>

                  {/* Weekly Distribution */}
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
                      Weekly Distribution
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
                        {weekdayChartData.map((day, idx) => (
                          <div 
                            key={idx} 
                            style={{
                              width: `${totalInterviews > 0 ? (day.count / totalInterviews) * 100 : 0}%`,
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
                      <span>Weekdays: {weekdayChartData.slice(0, 5).reduce((sum, day) => sum + day.count, 0)}</span>
                      <span>Weekend: {weekdayChartData.slice(5, 7).reduce((sum, day) => sum + day.count, 0)}</span>
                    </div>
                  </div>

                  {/* Department with Most Interviews */}
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
                      Most Active Department
                    </div>
                    <div style={{ 
                      fontSize: "20px", 
                      fontWeight: "700",
                      color: "#00a9ac",
                      display: "flex",
                      flexDirection: "column"
                    }}>
                      <div style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}>{mostActiveDepartment.name}</div>
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginTop: "5px"
                      }}>
                        <span style={{ 
                          fontSize: "12px", 
                          color: "#687C7B",
                          fontWeight: "400"
                        }}>
                          {mostActiveDepartment.count} interviews
                        </span>
                        <span style={{
                          fontSize: "11px",
                          padding: "3px 8px",
                          backgroundColor: "rgba(0, 169, 172, 0.1)",
                          color: "#00a9ac",
                          borderRadius: "12px",
                          fontWeight: "600" 
                        }}>
                          {totalInterviews > 0 ? ((mostActiveDepartment.count / totalInterviews) * 100).toFixed(1) : 0}%
                        </span>
                      </div>
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
                    <i className="fas fa-calendar-plus" style={{ fontSize: "11px" }}></i>
                    Schedule Optimization
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
                <div className="hr-empty-chart-icon" style={{ fontSize: "48px", marginBottom: "15px" }}>📅</div>
                <p style={{ color: "#687C7B", fontSize: "16px" }}>No interview schedule data available</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Monthly Trends Analysis */}
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
            Interview Trends Analysis
          </h3>
          
          <div style={{
            height: "350px",
            display: "flex", 
            flexDirection: "column",
            position: "relative"
          }}>
            {monthlyChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={monthlyChartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                >
                  {renderGradientDefs()}
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#687C7B' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#687C7B' }}
                  />
                  <Tooltip content={<CustomLineTooltip />} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="total" 
                    stroke={COLORS[0]} 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Total Interviews"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="completed" 
                    stroke={COLORS[1]} 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Completed"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="scheduled" 
                    stroke={COLORS[2]} 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Scheduled"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="cancelled" 
                    stroke={COLORS[3]} 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Cancelled"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="hr-empty-chart" style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div className="hr-empty-chart-icon" style={{ fontSize: "48px", marginBottom: "15px" }}>📈</div>
                <p style={{ color: "#687C7B", fontSize: "16px" }}>No monthly trend data available</p>
              </div>
            )}
          </div>
          
          {/* Trend Insights Cards */}
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "15px",
            marginTop: "20px"
          }}>
            {/* Most Active Month Card */}
            <div style={{ 
              flex: "1", 
              minWidth: "200px",
              padding: "12px",
              borderRadius: "8px",
              backgroundColor: "#f9fafb",
              border: "1px solid #f0f0f0",
            }}>
              <div style={{ 
                fontSize: "12px", 
                color: "#687C7B",
                marginBottom: "5px" 
              }}>
                Most Active Month
              </div>
              <div style={{ 
                fontSize: "16px", 
                fontWeight: "700",
                color: "#00a9ac",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                {monthlyChartData.length > 0 ? 
                  monthlyChartData.reduce((max, month) => 
                    month.total > max.total ? month : max, 
                    { name: "N/A", total: 0 }
                  ).name : 
                  "No Data"
                }
                <span style={{ 
                  fontSize: "11px",
                  padding: "3px 8px",
                  backgroundColor: "rgba(0, 169, 172, 0.1)",
                  color: "#00a9ac",
                  borderRadius: "12px",
                  fontWeight: "600" 
                }}>
                  {monthlyChartData.length > 0 ? 
                    monthlyChartData.reduce((max, month) => 
                      month.total > max.total ? month : max, 
                      { name: "N/A", total: 0 }
                    ).total + " interviews" : 
                    "0 interviews"
                  }
                </span>
              </div>
            </div>
            
            {/* Growth Rate Card */}
            <div style={{ 
              flex: "1", 
              minWidth: "200px",
              padding: "12px",
              borderRadius: "8px",
              backgroundColor: "#f9fafb",
              border: "1px solid #f0f0f0",
            }}>
              <div style={{ 
                fontSize: "12px", 
                color: "#687C7B",
                marginBottom: "5px" 
              }}>
                Month-over-Month Growth
              </div>
              <div style={{ 
                fontSize: "16px", 
                fontWeight: "700",
                color: "#00a9ac",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                {(() => {
                  if (monthlyChartData.length < 2) return "N/A";
                  
                  const lastMonth = monthlyChartData[monthlyChartData.length - 1];
                  const prevMonth = monthlyChartData[monthlyChartData.length - 2];
                  
                  if (!lastMonth || !prevMonth) return "N/A";
                  
                  const growth = prevMonth.total > 0 
                    ? ((lastMonth.total - prevMonth.total) / prevMonth.total) * 100 
                    : lastMonth.total > 0 ? 100 : 0;
                    
                  return (
                    <div style={{ 
                      display: "flex", 
                      alignItems: "center" 
                    }}>
                      {growth > 0 ? (
                        <i className="fas fa-arrow-up" style={{ 
                          color: "#66bc6d", 
                          marginRight: "5px"
                        }}></i>
                      ) : growth < 0 ? (
                        <i className="fas fa-arrow-down" style={{ 
                          color: "#ff8042", 
                          marginRight: "5px"
                        }}></i>
                      ) : (
                        <i className="fas fa-minus" style={{ 
                          color: "#687C7B", 
                          marginRight: "5px"
                        }}></i>
                      )}
                      {Math.abs(growth).toFixed(1)}%
                    </div>
                  );
                })()}
                <span style={{ 
                  fontSize: "11px",
                  padding: "3px 8px",
                  backgroundColor: "rgba(0, 169, 172, 0.1)",
                  color: "#00a9ac",
                  borderRadius: "12px",
                  fontWeight: "600" 
                }}>
                  Last period
                </span>
              </div>
            </div>
            
            {/* Most Active Interviewer */}
            <div style={{ 
              flex: "1", 
              minWidth: "200px",
              padding: "12px",
              borderRadius: "8px",
              backgroundColor: "#f9fafb",
              border: "1px solid #f0f0f0",
            }}>
              <div style={{ 
                fontSize: "12px", 
                color: "#687C7B",
                marginBottom: "5px" 
              }}>
                Most Active Interviewer
              </div>
              <div style={{ 
                fontSize: "16px", 
                fontWeight: "700",
                color: "#00a9ac",
                display: "flex",
                flexDirection: "column"
              }}>
                <div style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}>{mostActiveInterviewer.name}</div>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: "5px"
                }}>
                  <span style={{ 
                    fontSize: "12px", 
                    color: "#687C7B",
                    fontWeight: "400"
                  }}>
                    {mostActiveInterviewer.count} interviews
                  </span>
                  <span style={{
                    fontSize: "11px",
                    padding: "3px 8px",
                    backgroundColor: "rgba(0, 169, 172, 0.1)",
                    color: "#00a9ac",
                    borderRadius: "12px",
                    fontWeight: "600" 
                  }}>
                    {totalInterviews > 0 ? ((mostActiveInterviewer.count / totalInterviews) * 100).toFixed(1) : 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewsSummaryReport;