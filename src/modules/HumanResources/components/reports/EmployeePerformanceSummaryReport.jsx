import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, RadarChart,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  LineChart, Line, ComposedChart, Area
} from 'recharts';

const EmployeePerformanceSummaryReport = ({ performanceData: propsPerformanceData = [] }) => {
  // Add state variables for data management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [performanceData, setPerformanceData] = useState(propsPerformanceData);
  
  // Fetch data if not provided through props
  useEffect(() => {
    const fetchData = async () => {
      // If we already have sufficient data from props, use it
      if (propsPerformanceData.length > 0) {
        setPerformanceData(propsPerformanceData);
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching performance data directly...");
        const response = await axios.get("https://1wj5891jxg.execute-api.ap-southeast-1.amazonaws.com/dev/api/employee_performance/employee_performance/");
        setPerformanceData(response.data || []);
      } catch (err) {
        console.error("Error fetching performance data:", err);
        setError("Failed to load performance data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [propsPerformanceData]);

  // Show loading state
  if (loading) {
    return (
      <div className="hr-report-container" style={{ textAlign: 'center', padding: '50px 0' }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
        <p style={{ fontSize: '18px', color: '#687C7B' }}>Loading performance data...</p>
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
  const totalEvaluations = performanceData.length;
  
  // Calculate average rating
  const totalRating = performanceData.reduce((sum, p) => sum + parseFloat(p.rating || 0), 0);
  const avgRating = totalEvaluations > 0 ? (totalRating / totalEvaluations).toFixed(1) : 0;
  
  // Calculate total bonus amount
  const totalBonus = performanceData.reduce((sum, p) => sum + parseFloat(p.bonus_amount || 0), 0);
  
  // Rating distribution
  const ratingMap = {
    1: "Poor",
    2: "Below Average",
    3: "Average",
    4: "Above Average",
    5: "Excellent"
  };
  
  const ratingDistribution = performanceData.reduce((acc, item) => {
    const ratingValue = parseInt(item.rating);
    const ratingLabel = ratingMap[ratingValue] || `Rating ${ratingValue}`;
    
    acc[ratingLabel] = (acc[ratingLabel] || 0) + 1;
    return acc;
  }, {});
  
  const ratingData = Object.entries(ratingDistribution)
    .map(([name, value]) => ({ name, value }));
  
  // Department performance averages
  const departmentPerformance = performanceData.reduce((acc, item) => {
    if (!acc[item.department]) {
      acc[item.department] = {
        totalRating: 0,
        count: 0
      };
    }
    
    acc[item.department].totalRating += parseFloat(item.rating || 0);
    acc[item.department].count += 1;
    
    return acc;
  }, {});
  
  const departmentData = Object.entries(departmentPerformance)
    .map(([name, data]) => ({
      name,
      avgRating: data.count > 0 ? (data.totalRating / data.count).toFixed(1) : 0
    }))
    .sort((a, b) => b.avgRating - a.avgRating);
  
  // Top performers by rating
  const topPerformers = [...performanceData]
    .sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))
    .slice(0, 5);

  // Bonus distribution
  const bonusDistribution = performanceData.reduce((acc, item) => {
    const bonusRange = getBonusRange(parseFloat(item.bonus_amount || 0));
    acc[bonusRange] = (acc[bonusRange] || 0) + 1;
    return acc;
  }, {});

  const bonusChartData = Object.entries(bonusDistribution)
    .map(([range, count]) => ({ range, count }))
    .sort((a, b) => {
      // Sort by bonus range (numeric extraction)
      const aVal = parseInt(a.range.match(/\d+/)?.[0] || '0');
      const bVal = parseInt(b.range.match(/\d+/)?.[0] || '0');
      return aVal - bVal;
    });

  // Monthly rating trends
  const monthlyRatings = performanceData.reduce((acc, item) => {
    if (!item.review_date) return acc;
    
    const date = new Date(item.review_date);
    const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
    
    if (!acc[monthYear]) {
      acc[monthYear] = { month: monthYear, totalRating: 0, count: 0 };
    }
    
    acc[monthYear].totalRating += parseFloat(item.rating || 0);
    acc[monthYear].count++;
    
    return acc;
  }, {});
  
  const ratingTrendData = Object.values(monthlyRatings)
    .map(item => ({
      month: item.month,
      avgRating: item.count > 0 ? (item.totalRating / item.count).toFixed(1) : 0,
      count: item.count
    }))
    .sort((a, b) => {
      // Sort by date
      const dateA = new Date(a.month);
      const dateB = new Date(b.month);
      return dateA - dateB;
    })
    .slice(-6); // Last 6 months
  
  // Enhanced color palette
  const COLORS = [
    '#00a9ac', '#66bc6d', '#8884d8', '#ff8042', 
    '#ffc658', '#82ca9d', '#8dd1e1', '#a4de6c'
  ];
  
  // Gradients for charts
  const GRADIENTS = [
    'blueGradient',
    'greenGradient',
    'purpleGradient',
    'orangeGradient',
    'yellowGradient',
    'tealGradient',
    'pinkGradient'
  ];
  
  // Helper function to get bonus range
  function getBonusRange(amount) {
    if (amount === 0) return 'No Bonus';
    if (amount < 5000) return '< ₱5K';
    if (amount < 10000) return '₱5K-10K';
    if (amount < 25000) return '₱10K-25K';
    if (amount < 50000) return '₱25K-50K';
    return '₱50K+';
  }
  
  // Render gradient definitions for charts
  const renderGradientDefs = () => (
    <defs>
      {COLORS.map((color, index) => (
        <linearGradient 
          key={`gradient-${index}`} 
          id={GRADIENTS[index % GRADIENTS.length]} 
          x1="0" y1="0" x2="0" y2="1"
        >
          <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
          <stop offset="95%" stopColor={color} stopOpacity={0.2}/>
        </linearGradient>
      ))}
      
      {/* Add radial gradient for pie chart */}
      {COLORS.map((color, index) => (
        <radialGradient 
          key={`radial-gradient-${index}`} 
          id={`piePerformanceGradient-${index}`} 
          cx="50%" cy="50%" r="50%" 
          fx="50%" fy="50%"
        >
          <stop offset="0%" stopColor={createShade(color, 20)} stopOpacity={0.9} />
          <stop offset="100%" stopColor={color} stopOpacity={1} />
        </radialGradient>
      ))}
    </defs>
  );
  const createShade = (hexColor, percent) => {
    const num = parseInt(hexColor.slice(1), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    
    return `#${(1 << 24 | (R < 255 ? (R < 0 ? 0 : R) : 255) << 16 | (G < 255 ? (G < 0 ? 0 : G) : 255) << 8 | (B < 255 ? (B < 0 ? 0 : B) : 255)).toString(16).slice(1)}`;
  };
  return (
    <div className="hr-report-container">
      {/* Metrics Cards - Enhanced with better visuals */}
      <div className="hr-report-summary-cards">
        <div className="hr-report-summary-card" style={{
          boxShadow: '0 4px 12px rgba(0,169,172,0.08)',
          borderLeft: '4px solid #00a9ac'
        }}>
          <h3>Total Evaluations</h3>
          <div className="hr-report-value">{totalEvaluations}</div>
          <div className="hr-metric-trend">
            <i className="fas fa-clipboard-list" style={{ color: '#00a9ac', marginRight: '4px' }}></i>
            <span>Performance reviews</span>
          </div>
        </div>
        
        <div className="hr-report-summary-card" style={{
          boxShadow: '0 4px 12px rgba(0,169,172,0.08)',
          borderLeft: '4px solid #66bc6d'
        }}>
          <h3>Average Rating</h3>
          <div className="hr-report-value">{avgRating} <span style={{ fontSize: '14px', color: '#687C7B' }}>/ 5</span></div>
          <div className="hr-metric-trend">
            <i className="fas fa-star" style={{ color: '#66bc6d', marginRight: '4px' }}></i>
            <span>Overall performance</span>
          </div>
        </div>
        
        <div className="hr-report-summary-card" style={{
          boxShadow: '0 4px 12px rgba(0,169,172,0.08)',
          borderLeft: '4px solid #8884d8'
        }}>
          <h3>Total Bonus Amount</h3>
          <div className="hr-report-value">₱{totalBonus.toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
          <div className="hr-metric-trend">
            <i className="fas fa-trophy" style={{ color: '#8884d8', marginRight: '4px' }}></i>
            <span>Performance rewards</span>
          </div>
        </div>
      </div>
      
      {/* Charts Container - Single Column Layout with enhanced styling */}
      <div className="hr-report-charts-single-column">
        {/* Performance Rating Distribution Section */}
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
            Performance Rating Distribution
          </h3>
          
          <div style={{
            height: "450px",
            display: "flex", 
            flexDirection: "row",
            position: "relative"
          }}>
            {ratingData.length > 0 ? (
              <>
                {/* Rating legend with improved layout */}
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
                    <i className="fas fa-star" style={{ marginRight: '8px' }}></i>
                    Rating Categories
                  </h4>
                  
                  <div style={{ 
                    display: "flex", 
                    flexDirection: "column", 
                    gap: "10px",
                    maxHeight: "400px",
                    overflowY: "auto"
                  }}>
                    {ratingData.map((rating, index) => (
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
                        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.08)';
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
                          marginRight: "10px"
                        }}></div>
                        <div style={{ flex: 1 }}>
                          <div style={{ 
                            fontWeight: "600", 
                            fontSize: "14px",
                            marginBottom: "4px" 
                          }}>
                            {rating.name}
                          </div>
                          <div style={{ 
                            fontSize: "12px", 
                            color: "#687C7B",
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}>
                            <span>{rating.value} employees</span>
                            <span style={{
                              background: COLORS[index % COLORS.length] + '20',
                              color: COLORS[index % COLORS.length],
                              padding: '3px 8px',
                              borderRadius: '12px',
                              fontWeight: '600',
                              fontSize: '11px'
                            }}>
                              {((rating.value / totalEvaluations) * 100).toFixed(1)}%
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
                      <PieChart>
                        {renderGradientDefs()}
                        <Pie
                        data={ratingData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={130}
                        fill="#8884d8"
                        dataKey="value"
                        paddingAngle={2}
                        labelLine={true}
                        label={({name, percent, value}) => {
                          // Show name and percentage for segments that are large enough
                          const showName = percent > 0.05; // Only show name if segment is > 5%
                          return showName ? 
                            `${name}: ${(percent * 100).toFixed(0)}%` : 
                            `${(percent * 100).toFixed(0)}%`;
                        }}
                      >
                        {ratingData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={`url(#piePerformanceGradient-${index % COLORS.length})`}
                            stroke="#fff"
                            strokeWidth={2}
                          />
                        ))}
                      </Pie>
                        <Tooltip 
                          formatter={(value, name) => [
                            `${value} employees (${((value / totalEvaluations) * 100).toFixed(1)}%)`, 
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

                {/* Performance Metrics and insights panel */}
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
                    Performance Insights
                  </h4>

                  {/* Metric Card: Top Rating */}
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
                      Top Performance Rating
                    </div>
                    <div style={{ 
                      fontSize: "20px", 
                      fontWeight: "700",
                      color: "#00a9ac",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between"
                    }}>
                      {ratingData.length > 0 ? 
                        ratingData.sort((a, b) => b.value - a.value)[0].name : 'N/A'}
                      <span style={{ 
                        fontSize: "11px",
                        padding: "3px 8px",
                        backgroundColor: "rgba(0, 169, 172, 0.1)",
                        color: "#00a9ac",
                        borderRadius: "12px" 
                      }}>
                        most common
                      </span>
                    </div>
                  </div>

                  {/* Metric Card: Above Average % */}
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
                      Above Average Performers
                    </div>
                    <div style={{
                      fontSize: "13px",
                      fontWeight: "500",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      marginBottom: "8px"
                    }}>
                      <span>
                        {(() => {
                          const aboveAverage = performanceData.filter(p => parseFloat(p.rating) > 3).length;
                          return `${aboveAverage} of ${totalEvaluations}`;
                        })()}
                      </span>
                      <span style={{ color: "#687C7B" }}>employees rated highly</span>
                    </div>
                    <div style={{
                      width: "100%",
                      height: "8px",
                      backgroundColor: "#e9ecef",
                      borderRadius: "4px",
                      overflow: "hidden"
                    }}>
                      <div style={{
                        width: `${(() => {
                          const aboveAverage = performanceData.filter(p => parseFloat(p.rating) > 3).length;
                          return totalEvaluations > 0 ? (aboveAverage / totalEvaluations) * 100 : 0;
                        })()}%`,
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
                      <span>{(() => {
                        const aboveAverage = performanceData.filter(p => parseFloat(p.rating) > 3).length;
                        return totalEvaluations > 0 ? 
                          `${((aboveAverage / totalEvaluations) * 100).toFixed(1)}% above average` : 
                          'No data';
                      })()}</span>
                      <span style={{
                        color: "#008a8c",
                        fontWeight: "500",
                        textAlign: "right"
                      }}>
                        {avgRating >= 4 ? 'Excellent team' : avgRating >= 3 ? 'Good performance' : 'Needs improvement'}
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
              <div className="hr-empty-chart" style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div className="hr-empty-chart-icon" style={{ fontSize: "48px", marginBottom: "15px" }}>📊</div>
                <p style={{ color: "#687C7B", fontSize: "16px" }}>No performance data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Department Performance & Bonus Analysis Section */}
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
            Department Performance Analysis
          </h3>
          
          <div style={{ display: "flex", flexDirection: "row", gap: "30px" }}>
            {/* Department Performance Chart */}
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
                Average Rating by Department
              </h4>
              
              <div style={{ height: '350px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart outerRadius={130} data={departmentData}>
                  {renderGradientDefs()}
                  <PolarGrid />
                  <PolarAngleAxis dataKey="name" />
                  <PolarRadiusAxis domain={[0, 5]} />
                  <Tooltip 
                    formatter={(value) => [`${value} out of 5`, 'Average Rating']}
                    contentStyle={{
                      backgroundColor: 'white',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      border: 'none',
                      padding: '10px 15px'
                    }}
                  />
                  <Radar 
                    name="Average Rating" 
                    dataKey="avgRating" 
                    stroke="#00a9ac" 
                    fill={`url(#${GRADIENTS[0]})`} 
                    fillOpacity={0.6} 
                  />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
              </div>
            </div>
            
            {/* Bonus Distribution Chart */}
            <div style={{ flex: 1 }}>
              <h4 style={{ 
                marginBottom: "15px", 
                fontSize: "14px", 
                fontWeight: "600",
                color: '#00a9ac',
                display: 'flex',
                alignItems: 'center'
              }}>
                <i className="fas fa-trophy" style={{ marginRight: '8px' }}></i>
                Bonus Distribution
              </h4>
              
              <div style={{ height: '350px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={bonusChartData}>
                    {renderGradientDefs()}
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
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
                    <Legend />
                    <Bar 
                      dataKey="count" 
                      name="Employees" 
                      fill={`url(#${GRADIENTS[2]})`}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          {/* Performance Trends Over Time */}
          <div style={{ marginTop: '30px' }}>
            <h4 style={{ 
              marginBottom: "15px", 
              fontSize: "14px", 
              fontWeight: "600",
              color: '#00a9ac',
              display: 'flex',
              alignItems: 'center'
            }}>
              <i className="fas fa-chart-line" style={{ marginRight: '8px' }}></i>
              Performance Rating Trends
            </h4>
            
            <div style={{ height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={ratingTrendData}>
                {renderGradientDefs()}
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" domain={[0, 5]} />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip 
                  formatter={(value, name) => {
                    if (name === 'Average Rating') return [`${value} out of 5`, name];
                    return [`${value} evaluations`, name];
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
                <Area
                  yAxisId="right"
                  type="monotone" 
                  dataKey="count" 
                  name="Evaluations" 
                  fill={`url(#${GRADIENTS[1]})`} 
                  stroke="#66bc6d"
                  fillOpacity={0.6}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="avgRating"
                  name="Average Rating"
                  stroke="#00a9ac"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
            </div>
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
              }}>Performance Evaluation Insights</h4>
              <p style={{ 
                fontSize: '13px', 
                margin: '0 0 5px 0',
                color: '#555'
              }}>
                <strong>Top performing department:</strong> {
                  departmentData.length > 0 ? `${departmentData[0].name} (${departmentData[0].avgRating}/5)` : 'N/A'
                }
              </p>
              <p style={{ 
                fontSize: '13px', 
                margin: '0 0 5px 0',
                color: '#555'
              }}>
                <strong>Top bonus earners:</strong> {
                  bonusChartData.length > 0 ? 
                    `${bonusChartData.sort((a, b) => b.count - a.count)[0].range} range (${bonusChartData.sort((a, b) => b.count - a.count)[0].count} employees)` : 
                    'N/A'
                }
              </p>
              <p style={{ 
                fontSize: '13px', 
                margin: '0',
                color: '#555'
              }}>
                <strong>Performance quality:</strong> {
                  avgRating >= 4 ? 'Excellent (team exceeding expectations)' :
                  avgRating >= 3 ? 'Good (team meeting expectations)' :
                  'Needs improvement (below target performance)'
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
              <i className="fas fa-download" style={{ fontSize: "11px" }}></i>
              Export Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeePerformanceSummaryReport;