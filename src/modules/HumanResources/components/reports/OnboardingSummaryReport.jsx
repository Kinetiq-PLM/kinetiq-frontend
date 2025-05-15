import React, { useState, useEffect } from "react";
import { 
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line,
  Area, AreaChart
} from 'recharts';
import axios from 'axios';

const OnboardingSummaryReport = ({ onboarding: propsOnboarding = [] }) => {
  // State variables
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [onboarding, setOnboarding] = useState(propsOnboarding || []);
  const [period, setPeriod] = useState('monthly'); // monthly, quarterly, yearly

  // Enhanced color palette
  const COLORS = [
    '#00a8a8', '#66bc6d', '#8884d8', '#ff8042', 
    '#ffc658', '#82ca9d', '#8dd1e1', '#a4de6c',
    '#d0ed57', '#97e3d5', '#f5a623', '#f78da7'
  ];
  const GRADIENTS = COLORS.map((color, index) => `onboardingGradient-${index}`);

  // Helper function for color shading
  const createShade = (hexColor, percent) => {
    const num = parseInt(hexColor.slice(1), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    
    return `#${(1 << 24 | (R < 255 ? (R < 0 ? 0 : R) : 255) << 16 | (G < 255 ? (G < 0 ? 0 : G) : 255) << 8 | (B < 255 ? (B < 0 ? 0 : B) : 255)).toString(16).slice(1)}`;
  };

  // Fetch data on component mount if not provided through props
  useEffect(() => {
    const fetchData = async () => {
      // Use props data if available
      if (propsOnboarding && propsOnboarding.length > 0) {
        setOnboarding(propsOnboarding);
        setLoading(false);
        return;
      }

      // Otherwise fetch from API
      try {
        const response = await axios.get(
          "https://1wj5891jxg.execute-api.ap-southeast-1.amazonaws.com/dev/api/onboarding/"
        );
        setOnboarding(response.data || []);
      } catch (err) {
        console.error("Error fetching onboarding data:", err);
        setError("Failed to load onboarding data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [propsOnboarding]);

  // Show loading state
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading onboarding data...</p>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="error-banner">
        <p>{error}</p>
        <button className="reload-btn" onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    );
  }

  // Calculate metrics
  const totalOnboarding = onboarding.length;
  const completedOnboarding = onboarding.filter(o => o.status === "Completed").length;
  const inProgressOnboarding = onboarding.filter(o => o.status === "In Progress").length;
  const notStartedOnboarding = onboarding.filter(o => o.status === "Not Started").length;
  const offerPendingOnboarding = onboarding.filter(o => o.status === "Offer Pending").length;
  
  // Calculate onboarded this month
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  const onboardedThisMonth = onboarding.filter(o => {
    const startDate = new Date(o.created_at);
    return startDate.getMonth() === currentMonth && startDate.getFullYear() === currentYear;
  }).length;
  
  // Completion rate
  const completionRate = totalOnboarding > 0 ? 
    ((completedOnboarding / totalOnboarding) * 100).toFixed(1) : 0;
  
  // Status data for pie chart
  const statusData = [
    { name: 'Completed', value: completedOnboarding },
    { name: 'In Progress', value: inProgressOnboarding },
    { name: 'Not Started', value: notStartedOnboarding },
    { name: 'Offer Pending', value: offerPendingOnboarding }
  ].filter(item => item.value > 0);
  
  // Calculate average onboarding processing time (days between created_at and updated_at)
  const avgProcessingTime = onboarding.length > 0 
    ? onboarding.reduce((sum, o) => {
        const createdDate = new Date(o.created_at);
        const updatedDate = new Date(o.updated_at);
        return sum + (updatedDate - createdDate) / (1000 * 60 * 60 * 24);
      }, 0) / onboarding.length
    : 0;

  // Get status distribution by job for newer chart
  const getJobStatusData = () => {
    const jobData = onboarding.reduce((acc, o) => {
      const jobId = o.job || 'Unknown';
      
      if (!acc[jobId]) {
        acc[jobId] = { jobId, total: 0 };
      }
      
      acc[jobId].total += 1;
      acc[jobId][o.status] = (acc[jobId][o.status] || 0) + 1;
      
      return acc;
    }, {});
    
    return Object.values(jobData)
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);  // Get top 10 jobs
  };

  const jobStatusData = getJobStatusData();

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
      
      {/* Area chart gradients */}
      <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#00a8a8" stopOpacity={0.8}/>
        <stop offset="95%" stopColor="#00a8a8" stopOpacity={0.1}/>
      </linearGradient>
      <linearGradient id="colorOfferPending" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8}/>
        <stop offset="95%" stopColor="#ffc658" stopOpacity={0.1}/>
      </linearGradient>
      <linearGradient id="colorInProgress" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#ff8042" stopOpacity={0.8}/>
        <stop offset="95%" stopColor="#ff8042" stopOpacity={0.1}/>
      </linearGradient>
    </defs>
  );

  // Custom tooltip for the pie chart
  const CustomPieTooltip = ({ active, payload }) => {
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
          <p style={{ margin: '0', color: payload[0].color, fontWeight: '500' }}>
            {data.value} employees ({((data.value / totalOnboarding) * 100).toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="hr-report-container">
      {/* Summary Cards */}
      <div className="hr-report-summary-cards">
        <div className="hr-report-summary-card" style={{
          boxShadow: '0 4px 12px rgba(0,169,172,0.08)',
          borderLeft: '4px solid #00a8a8'
        }}>
          <h3>Total Onboarding</h3>
          <div className="hr-report-value">{totalOnboarding}</div>
          <div className="hr-metric-trend">
            <i className="fas fa-users" style={{ color: '#00a8a8', marginRight: '4px' }}></i>
            <span>Employee onboarding</span>
          </div>
        </div>
        
        <div className="hr-report-summary-card" style={{
          boxShadow: '0 4px 12px rgba(0,169,172,0.08)',
          borderLeft: '4px solid #66bc6d'
        }}>
          <h3>Onboarded This Month</h3>
          <div className="hr-report-value">{onboardedThisMonth}</div>
          <div className="hr-metric-trend">
            <i className="fas fa-calendar-check" style={{ color: '#66bc6d', marginRight: '4px' }}></i>
            <span>Current month</span>
          </div>
        </div>
        
        <div className="hr-report-summary-card" style={{
          boxShadow: '0 4px 12px rgba(0,169,172,0.08)',
          borderLeft: '4px solid #ff8042'
        }}>
          <h3>Avg. Processing Time</h3>
          <div className="hr-report-value">{avgProcessingTime.toFixed(1)}</div>
          <div className="hr-metric-trend">
            <i className="fas fa-hourglass-half" style={{ color: '#ff8042', marginRight: '4px' }}></i>
            <span>Days to process</span>
          </div>
        </div>
        
        <div className="hr-report-summary-card" style={{
          boxShadow: '0 4px 12px rgba(0,169,172,0.08)',
          borderLeft: '4px solid #8884d8'
        }}>
          <h3>Completion Rate</h3>
          <div className="hr-report-value">{completionRate}%</div>
          <div className="hr-metric-trend">
            <i className="fas fa-chart-line" style={{ color: '#8884d8', marginRight: '4px' }}></i>
            <span>Overall success rate</span>
          </div>
        </div>
      </div>
      
      {/* First row of charts */}
      <div className="hr-report-charts-single-column">
        {/* Onboarding Status Chart */}
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
            <i className="fas fa-chart-pie" style={{ marginRight: '10px', color: '#00a8a8' }}></i>
            Onboarding Status Overview
          </h3>
          
          <div style={{
            height: "450px",
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
                    <i className="fas fa-clipboard-list" style={{ marginRight: '8px' }}></i>
                    Onboarding Status
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
                            <span>{status.value} candidates</span>
                            <span style={{
                              background: COLORS[index % COLORS.length] + '20',
                              color: COLORS[index % COLORS.length],
                              padding: '3px 8px',
                              borderRadius: '12px',
                              fontWeight: '600',
                              fontSize: '11px'
                            }}>
                              {((status.value / totalOnboarding) * 100).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Chart on the middle - with improved layout and visibility */}
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
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
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
                        <Tooltip content={<CustomPieTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Insights Panel */}
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
                    Onboarding Insights
                  </h4>

                  {/* Metric Card: Offer Pending */}
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
                      Candidates with Pending Offers
                    </div>
                    <div style={{ 
                      fontSize: "20px", 
                      fontWeight: "700",
                      color: "#ffc658",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between"
                    }}>
                      {offerPendingOnboarding}
                      <span style={{ 
                        fontSize: "11px",
                        padding: "3px 8px",
                        backgroundColor: "rgba(255, 198, 88, 0.1)",
                        color: "#ffc658",
                        borderRadius: "12px" 
                      }}>
                        Awaiting action
                      </span>
                    </div>
                  </div>

                  {/* Metric Card: Archive rate */}
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
                      Active vs. Archived Candidates
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
                        <div 
                          style={{
                            width: `${onboarding.filter(o => !o.is_archived).length / totalOnboarding * 100}%`,
                            height: "100%",
                            background: "#00a8a8"
                          }}
                        />
                      </div>
                    </div>
                    <div style={{
                      marginTop: "8px",
                      fontSize: "11px",
                      color: "#687C7B",
                      display: "flex",
                      justifyContent: "space-between"
                    }}>
                      <span>Active: {onboarding.filter(o => !o.is_archived).length} candidates</span>
                      <span>Archived: {onboarding.filter(o => o.is_archived).length} candidates</span>
                    </div>
                  </div>

                  {/* Metric Card: Processing Time */}
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
                      Average Processing Time
                    </div>
                    <div style={{
                      fontSize: "13px",
                      fontWeight: "500",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      marginBottom: "8px"
                    }}>
                      <span>{avgProcessingTime.toFixed(1)} days</span>
                      <span style={{ color: "#687C7B" }}>from creation to update</span>
                    </div>
                    <div style={{
                      width: "100%",
                      height: "8px",
                      backgroundColor: "#e9ecef",
                      borderRadius: "4px",
                      overflow: "hidden"
                    }}>
                      <div style={{
                        width: `${Math.min(100, (avgProcessingTime / 30) * 100)}%`,
                        height: "100%",
                        background: "linear-gradient(90deg, #00a9ac 0%, #66bc6d 100%)"
                      }}/>
                    </div>
                    <div style={{
                      marginTop: "8px",
                      fontSize: "11px",
                      color: "#687C7B",
                      fontWeight: "500",
                      textAlign: "right"
                    }}>
                      {avgProcessingTime <= 7 ? 'Fast processing' : 
                       avgProcessingTime <= 14 ? 'Standard processing' : 'Extended processing'}
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
                    <i className="fas fa-file-export" style={{ fontSize: "11px" }}></i>
                    Export Onboarding Data
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
                <p style={{ color: "#687C7B", fontSize: "16px" }}>No onboarding data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Job Position Analysis (New chart replacing removed sections) */}
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
            <i className="fas fa-briefcase" style={{ marginRight: '10px', color: '#00a8a8' }}></i>
            Job Position Analysis
          </h3>

          {jobStatusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={jobStatusData}
                margin={{top: 20, right: 30, left: 20, bottom: 50}}
                barGap={0}
                barCategoryGap="20%"
              >
                {renderGradientDefs()}
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="jobId"
                  tick={{fontSize: 12}}
                  tickLine={false}
                  angle={-45}
                  textAnchor="end"
                  height={70}
                />
                <YAxis 
                  tick={{fontSize: 12}}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip />
                <Legend 
                  verticalAlign="top" 
                  height={36}
                  iconType="circle"
                />
                <Bar 
                  dataKey="Completed" 
                  name="Completed" 
                  fill={`url(#${GRADIENTS[0]})`}
                  stackId="a"
                />
                <Bar 
                  dataKey="In Progress" 
                  name="In Progress" 
                  fill={`url(#${GRADIENTS[1]})`}
                  stackId="a"
                />
                <Bar 
                  dataKey="Not Started" 
                  name="Not Started" 
                  fill={`url(#${GRADIENTS[2]})`}
                  stackId="a"
                />
                <Bar 
                  dataKey="Offer Pending" 
                  name="Offer Pending" 
                  fill={`url(#${GRADIENTS[3]})`}
                  stackId="a"
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="hr-empty-chart" style={{
              height: '300px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div className="hr-empty-chart-icon" style={{ fontSize: "48px", marginBottom: "15px" }}>💼</div>
              <p style={{ color: "#687C7B", fontSize: "16px" }}>No job position data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingSummaryReport;