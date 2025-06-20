import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { 
  ResponsiveContainer, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell,
  BarChart, Bar
} from 'recharts';

const ResignationsSummaryReport = () => {
  // State management
  const [resignations, setResignations] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch resignations data
        const resignationsResponse = await axios.get(
          "http://127.0.0.1:8001/api/resignation/resignations/"
        );
        setResignations(resignationsResponse.data);
        
        // For demo purposes, mock the employees data (in production, fetch from employee API)
        // Assuming 100 employees total for turnover calculations
        setEmployees(Array(100).fill({}));
      } catch (err) {
        console.error("Error fetching resignation data:", err);
        setError("Failed to load resignation data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate metrics
  const totalResignations = resignations.length;
  
  // Calculate turnover rate
  const totalEmployees = employees.length;
  const turnoverRate = totalEmployees > 0 ? 
    ((totalResignations / totalEmployees) * 100).toFixed(1) : 0;
    
  // Average notice period
  const averageNoticePeriod = resignations.length > 0 ? 
    Math.round(
      resignations.reduce((sum, res) => sum + (parseInt(res.notice_period_days) || 0), 0) / 
      resignations.length
    ) : 0;
  
  // Group resignations by month for trend analysis
  const monthlyResignations = useMemo(() => {
    const months = {};
    resignations.forEach(res => {
      // Assuming submission_date is ISO format
      const date = new Date(res.submission_date);
      const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
      
      if (!months[monthYear]) {
        months[monthYear] = { month: monthYear, count: 0, rate: 0 };
      }
      months[monthYear].count += 1;
      // Calculate monthly turnover rate
      months[monthYear].rate = parseFloat(((months[monthYear].count / totalEmployees) * 100).toFixed(1));
    });
    
    // Convert to array and sort by date
    return Object.values(months)
      .sort((a, b) => {
        const dateA = new Date(a.month);
        const dateB = new Date(b.month);
        return dateA - dateB;
      })
      .slice(-6); // Last 6 months
  }, [resignations, totalEmployees]);
  
  // Group by clearance status
  const clearanceStatusData = useMemo(() => {
    const statusCounts = {
      'Completed': 0,
      'In Progress': 0,
      'Not Started': 0
    };
    
    resignations.forEach(res => {
      if (statusCounts[res.clearance_status] !== undefined) {
        statusCounts[res.clearance_status] += 1;
      } else {
        statusCounts['Not Started'] += 1; // Default for unknown status
      }
    });
    
    return [
      { name: 'Completed', value: statusCounts['Completed'] },
      { name: 'In Progress', value: statusCounts['In Progress'] },
      { name: 'Not Started', value: statusCounts['Not Started'] }
    ];
  }, [resignations]);
  
  // Group by notice period buckets
  const noticePeriodData = useMemo(() => {
    const buckets = {
      '0-7 days': 0,
      '8-14 days': 0,
      '15-30 days': 0,
      '31+ days': 0
    };
    
    resignations.forEach(res => {
      const days = parseInt(res.notice_period_days) || 0;
      if (days <= 7) buckets['0-7 days'] += 1;
      else if (days <= 14) buckets['8-14 days'] += 1;
      else if (days <= 30) buckets['15-30 days'] += 1;
      else buckets['31+ days'] += 1;
    });
    
    return Object.entries(buckets).map(([name, value]) => ({ name, value }));
  }, [resignations]);
  
  // Group by reason (if available)
  const reasonData = useMemo(() => {
    const reasons = {};
    
    resignations.forEach(res => {
      const reason = res.reason || 'Not Specified';
      if (!reasons[reason]) {
        reasons[reason] = 0;
      }
      reasons[reason] += 1;
    });
    
    return Object.entries(reasons)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [resignations]);
  
  // Enhanced color palette with gradients
  const COLORS = [
    '#00a8a8', '#66bc6d', '#8884d8', '#ff8042', 
    '#ffc658', '#82ca9d', '#8dd1e1', '#a4de6c'
  ];
  const GRADIENTS = COLORS.map((color, index) => `resignationGradient-${index}`);
  
  // Helper function to create shade of a color
  const createShade = (hexColor, percent) => {
    const num = parseInt(hexColor.slice(1), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    
    return `#${(1 << 24 | (R < 255 ? (R < 0 ? 0 : R) : 255) << 16 | (G < 255 ? (G < 0 ? 0 : G) : 255) << 8 | (B < 255 ? (B < 0 ? 0 : B) : 255)).toString(16).slice(1)}`;
  };
  
  // Calculate complete vs incomplete clearance percentage
  const clearanceCompletionRate = resignations.length > 0 ?
    (clearanceStatusData[0].value / resignations.length * 100).toFixed(0) : 0;
  
  // Render gradient definitions
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

  // Custom tooltip for area chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ 
          backgroundColor: 'white', 
          padding: '12px 15px', 
          borderRadius: '6px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          border: '1px solid #f0f0f0'
        }}>
          <p style={{ margin: '0 0 8px', fontWeight: 'bold' }}>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ 
              margin: '4px 0', 
              color: entry.color,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{ 
                display: 'inline-block', 
                width: '8px', 
                height: '8px', 
                backgroundColor: entry.color, 
                borderRadius: '2px' 
              }}></span>
              <span>{`${entry.name}: ${entry.value}${entry.name.includes('Rate') ? '%' : ''}`}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Loading state
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '400px',
        color: '#00a9ac'
      }}>
        <div>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: '24px', marginRight: '10px' }}></i>
          <span>Loading resignation data...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '400px',
        color: '#ff8042'
      }}>
        <div style={{ textAlign: 'center' }}>
          <i className="fas fa-exclamation-triangle" style={{ fontSize: '24px', marginBottom: '10px' }}></i>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '8px 12px',
              backgroundColor: '#00a9ac',
              border: 'none',
              borderRadius: '4px',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Empty data state
  if (resignations.length === 0) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '400px',
        color: '#687C7B'
      }}>
        <i className="fas fa-file-alt" style={{ fontSize: '36px', marginBottom: '15px', color: '#00a9ac' }}></i>
        <p style={{ fontSize: '18px', fontWeight: '500', marginBottom: '10px' }}>No resignation data available</p>
        <p style={{ fontSize: '14px' }}>There are no resignation records to display at this time.</p>
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
          <h3>Total Resignations</h3>
          <div className="hr-report-value">{totalResignations}</div>
          <div className="hr-metric-trend">
            <i className="fas fa-user-minus" style={{ color: '#00a9ac', marginRight: '4px' }}></i>
            <span>Last 12 months</span>
          </div>
        </div>
        
        <div className="hr-report-summary-card" style={{
          boxShadow: '0 4px 12px rgba(0,169,172,0.08)',
          borderLeft: '4px solid #66bc6d'
        }}>
          <h3>Avg. Notice Period</h3>
          <div className="hr-report-value">{averageNoticePeriod} days</div>
          <div className="hr-metric-trend">
            <i className="fas fa-calendar-alt" style={{ color: '#66bc6d', marginRight: '4px' }}></i>
            <span>Standard is 30 days</span>
          </div>
        </div>
        
        <div className="hr-report-summary-card" style={{
          boxShadow: '0 4px 12px rgba(0,169,172,0.08)',
          borderLeft: '4px solid #8884d8'
        }}>
          <h3>Turnover Rate</h3>
          <div className="hr-report-value">{turnoverRate}%</div>
          <div className="hr-metric-trend">
            <i className="fas fa-chart-line" style={{ color: '#8884d8', marginRight: '4px' }}></i>
            <span>Of total workforce</span>
          </div>
        </div>
        
        <div className="hr-report-summary-card" style={{
          boxShadow: '0 4px 12px rgba(0,169,172,0.08)',
          borderLeft: '4px solid #ff8042'
        }}>
          <h3>Clearance Complete</h3>
          <div className="hr-report-value">{clearanceCompletionRate}%</div>
          <div className="hr-metric-trend">
            <i className="fas fa-tasks" style={{ color: '#ff8042', marginRight: '4px' }}></i>
            <span>Exit process completed</span>
          </div>
        </div>
      </div>
      
      {/* Charts Container - Single column layout matching department report */}
      <div className="hr-report-charts-single-column">
        {/* Monthly Trend Chart with optimized layout */}
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
            <i className="fas fa-chart-area" style={{ marginRight: '10px', color: '#00a9ac' }}></i>
            Monthly Resignation Trend
          </h3>
          
          <div style={{
            height: "350px",
            display: "flex", 
            flexDirection: "row",
            position: "relative"
          }}>
            <div style={{ width: "70%" }}>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyResignations}>
                  {renderGradientDefs()}
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={{ stroke: '#e0e0e0' }} 
                    tickLine={{ stroke: '#e0e0e0' }}
                    tick={{ fontSize: 12, fill: '#687C7B' }}
                  />
                  <YAxis 
                    yAxisId="left" 
                    axisLine={{ stroke: '#e0e0e0' }} 
                    tickLine={{ stroke: '#e0e0e0' }}
                    tick={{ fontSize: 12, fill: '#687C7B' }}
                  />
                  <YAxis 
                    yAxisId="right" 
                    orientation="right" 
                    axisLine={{ stroke: '#e0e0e0' }} 
                    tickLine={{ stroke: '#e0e0e0' }}
                    tick={{ fontSize: 12, fill: '#687C7B' }}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    wrapperStyle={{ paddingTop: '10px' }} 
                    iconType="circle"
                    iconSize={8}
                  />
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00a9ac" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#00a9ac" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <Area 
                    yAxisId="left" 
                    type="monotone" 
                    dataKey="count" 
                    fill="url(#colorCount)" 
                    stroke="#00a9ac" 
                    strokeWidth={2}
                    name="Resignations" 
                  />
                  <Line 
                    yAxisId="right" 
                    type="monotone" 
                    dataKey="rate" 
                    stroke="#ff8042" 
                    strokeWidth={2}
                    dot={{ r: 4, strokeWidth: 2 }}
                    activeDot={{ r: 6, stroke: '#ff8042', strokeWidth: 2 }}
                    name="Turnover Rate (%)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            {/* Side panel with insights */}
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
                Trend Insights
              </h4>
              
              {/* Monthly Trend Insights */}
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
                  Peak Resignation Month
                </div>
                <div style={{ 
                  fontSize: "20px", 
                  fontWeight: "700",
                  color: "#00a9ac",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}>
                  {monthlyResignations.length > 0 ? 
                    monthlyResignations.reduce((prev, curr) => 
                      prev.count > curr.count ? prev : curr, { count: 0 }
                    ).month : 'N/A'}
                  <span style={{ 
                    fontSize: "11px",
                    padding: "3px 8px",
                    backgroundColor: "rgba(0, 169, 172, 0.1)",
                    color: "#00a9ac",
                    borderRadius: "12px" 
                  }}>
                    highest volume
                  </span>
                </div>
              </div>
              
              {/* Average Monthly Rate */}
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
                  Avg. Monthly Resignations
                </div>
                <div style={{ 
                  fontSize: "20px", 
                  fontWeight: "700",
                  color: "#66bc6d",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}>
                  {monthlyResignations.length > 0 ? 
                    (monthlyResignations.reduce((sum, month) => sum + month.count, 0) / 
                    monthlyResignations.length).toFixed(1) : '0'}
                  <span style={{ 
                    fontSize: "11px",
                    padding: "3px 8px",
                    backgroundColor: "rgba(102, 188, 109, 0.1)",
                    color: "#66bc6d",
                    borderRadius: "12px" 
                  }}>
                    per month
                  </span>
                </div>
              </div>
              
              {/* 3-Month Trend */}
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
                  3-Month Trend
                </div>
                {(() => {
                  // Calculate the trend over the last 3 months
                  const last3Months = monthlyResignations.slice(-3);
                  let trendIcon = <i className="fas fa-equals" style={{ color: '#687C7B' }}></i>;
                  let trendColor = '#687C7B';
                  let trendLabel = 'Stable';
                  
                  if (last3Months.length >= 2) {
                    const firstMonth = last3Months[0].count;
                    const lastMonth = last3Months[last3Months.length - 1].count;
                    
                    if (lastMonth > firstMonth) {
                      trendIcon = <i className="fas fa-arrow-up" style={{ color: '#ff8042' }}></i>;
                      trendColor = '#ff8042';
                      trendLabel = 'Increasing';
                    } else if (lastMonth < firstMonth) {
                      trendIcon = <i className="fas fa-arrow-down" style={{ color: '#66bc6d' }}></i>;
                      trendColor = '#66bc6d';
                      trendLabel = 'Decreasing';
                    }
                  }
                  
                  return (
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px"
                    }}>
                      <div style={{
                        width: "35px",
                        height: "35px",
                        borderRadius: "50%",
                        backgroundColor: `${trendColor}20`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: trendColor,
                        fontSize: "14px"
                      }}>
                        {trendIcon}
                      </div>
                      <div>
                        <div style={{ fontWeight: "600", color: trendColor }}>{trendLabel}</div>
                        <div style={{ fontSize: "12px", color: "#687C7B" }}>Resignation volume</div>
                      </div>
                    </div>
                  );
                })()}
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
          </div>
        </div>
          
        {/* Bottom section with two charts */}
        <div style={{ 
          display: 'flex', 
          gap: '24px', 
          marginTop: '24px' 
        }}>
          {/* Clearance Status Chart */}
          <div style={{
            flex: '1',
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
              <i className="fas fa-tasks" style={{ marginRight: '10px', color: '#00a9ac' }}></i>
              Clearance Status
            </h3>
            
            <div style={{ height: '300px', display: 'flex' }}>
              <div style={{ width: '60%' }}>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    {renderGradientDefs()}
                    <Pie
                      data={clearanceStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      innerRadius={40}
                      paddingAngle={2}
                      dataKey="value"
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {clearanceStatusData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={`url(#pieGradient-${index % COLORS.length})`}
                          stroke="#fff"
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [`${value} resignations`, 'Count']}
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
              
              {/* Status breakdown list */}
              <div style={{ 
                width: '40%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: '10px'
              }}>
                {clearanceStatusData.map((status, index) => (
                  <div key={index} style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px',
                    borderRadius: '8px',
                    backgroundColor: index % 2 === 0 ? '#f9fafb' : '#fff',
                    border: '1px solid #f0f0f0'
                  }}>
                    <div style={{ 
                      width: '12px',
                      height: '12px',
                      borderRadius: '3px',
                      backgroundColor: COLORS[index % COLORS.length],
                      marginRight: '12px'
                    }}></div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: '600' }}>{status.name}</div>
                      <div style={{ 
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginTop: '4px'
                      }}>
                        <span style={{ fontSize: '12px', color: '#687C7B' }}>{status.value} resignations</span>
                        <span style={{
                          fontSize: '11px',
                          padding: '2px 8px',
                          backgroundColor: `${COLORS[index % COLORS.length]}20`,
                          color: COLORS[index % COLORS.length],
                          borderRadius: '12px',
                          fontWeight: '500'
                        }}>
                          {((status.value / totalResignations) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Notice Period Distribution Chart */}
          <div style={{
            flex: '1',
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
              <i className="fas fa-calendar-alt" style={{ marginRight: '10px', color: '#00a9ac' }}></i>
              Notice Period Distribution
            </h3>
            
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={noticePeriodData} layout="vertical" barSize={25}>
                  {renderGradientDefs()}
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis 
                    type="number" 
                    axisLine={{ stroke: '#e0e0e0' }} 
                    tickLine={{ stroke: '#e0e0e0' }}
                    tick={{ fontSize: 12, fill: '#687C7B' }}
                  />
                  <YAxis 
                    dataKey="name" 
                    type="category"
                    axisLine={{ stroke: '#e0e0e0' }} 
                    tickLine={{ stroke: '#e0e0e0' }}
                    tick={{ fontSize: 12, fill: '#687C7B' }}
                    width={80}
                  />
                  <Tooltip
                    formatter={(value) => [`${value} employees`, 'Count']}
                    contentStyle={{
                      backgroundColor: 'white',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      border: 'none',
                      padding: '10px 15px'
                    }}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="url(#resignationGradient-1)" 
                    radius={[0, 4, 4, 0]}
                    label={{ 
                      position: 'right', 
                      fill: '#66bc6d',
                      fontSize: 12,
                      formatter: (value) => value > 0 ? value : ''
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResignationsSummaryReport;