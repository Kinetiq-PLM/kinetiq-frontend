import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from 'recharts';

const CandidatesSummaryReport = ({ candidates: propsCandidates = [] }) => {
  // Add state variables for data management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [candidates, setCandidates] = useState(propsCandidates);

  // Fetch data if not provided through props
  useEffect(() => {
    const fetchData = async () => {
      // If we already have sufficient data from props, use it
      if (propsCandidates.length > 0) {
        setCandidates(propsCandidates);
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching candidates data directly...");
        const response = await axios.get("http://127.0.0.1:8000/api/candidates/candidates/");
        setCandidates(response.data || []);
      } catch (err) {
        console.error("Error fetching candidates data:", err);
        setError("Failed to load candidates data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [propsCandidates]);

  // Show loading state
  if (loading) {
    return (
      <div className="hr-report-container" style={{ textAlign: 'center', padding: '50px 0' }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
        <p style={{ fontSize: '18px', color: '#687C7B' }}>Loading candidates data...</p>
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
  const totalCandidates = candidates.length;
  
  // Application status mapping
  const stages = {
    'Applied': candidates.filter(c => c.application_status === 'Applied').length,
    'Screening': candidates.filter(c => c.application_status === 'Screening').length,
    'Interview': candidates.filter(c => c.application_status === 'Interview').length,
    'Technical Assessment': candidates.filter(c => c.application_status === 'Technical Assessment').length,
    'Offer Extended': candidates.filter(c => c.application_status === 'Offer Extended').length,
    'Offer Accepted': candidates.filter(c => c.application_status === 'Offer Accepted').length,
    'Hired': candidates.filter(c => c.application_status === 'Hired').length,
    'Rejected': candidates.filter(c => c.application_status === 'Rejected').length,
    'Withdrawn': candidates.filter(c => c.application_status === 'Withdrawn').length
  };
  
  const inProcessCount = stages.Applied + stages.Screening + stages.Interview + 
                        stages['Technical Assessment'] + stages['Offer Extended'];
  const hiredCount = stages.Hired + stages['Offer Accepted'];
  const rejectedCount = stages.Rejected + stages.Withdrawn;
  const conversionRate = totalCandidates > 0 ? ((hiredCount / totalCandidates) * 100).toFixed(1) : 0;

  // Prepare chart data
  const stageData = Object.entries(stages)
    .filter(([_, value]) => value > 0) // Only include stages with candidates
    .map(([name, value]) => ({ name, value }));

  // Positions with most candidates
  const positionData = candidates.reduce((acc, candidate) => {
    const position = candidate.position_title || "Unspecified";
    acc[position] = (acc[position] || 0) + 1;
    return acc;
  }, {});
  
  const positionChartData = Object.entries(positionData)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5); // Top 5 positions

  // Source of candidates (using job_id as a proxy since source isn't specified)
  const sourceData = candidates.reduce((acc, candidate) => {
    const source = candidate.job_id ? `Job #${candidate.job_id}` : "Direct Application";
    acc[source] = (acc[source] || 0) + 1;
    return acc;
  }, {});
  
  const sourceChartData = Object.entries(sourceData)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  // Enhanced color palette
  const COLORS = [
    '#00a8a8', '#66bc6d', '#8884d8', '#ff8042', 
    '#ffc658', '#82ca9d', '#8dd1e1', '#a4de6c',
    '#d0ed57', '#97e3d5', '#f5a623', '#f78da7'
  ];
  
  // Define gradient IDs for each color
  const GRADIENTS = COLORS.map((color, index) => `candidateGradient-${index}`);
  
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
          id={`pieCandidateGradient-${index}`} 
          cx="50%" cy="50%" r="50%" 
          fx="50%" fy="50%"
        >
          <stop offset="0%" stopColor={createShade(color, 20)} stopOpacity={0.9} />
          <stop offset="100%" stopColor={color} stopOpacity={1} />
        </radialGradient>
      ))}
    </defs>
  );

  return (
    <div className="hr-report-container">
      {/* Metrics Cards - Enhanced with better visuals */}
      <div className="hr-report-summary-cards">
        <div className="hr-report-summary-card" style={{
          boxShadow: '0 4px 12px rgba(0,169,172,0.08)',
          borderLeft: '4px solid #00a9ac'
        }}>
          <h3>Total Candidates</h3>
          <div className="hr-report-value">{totalCandidates}</div>
          <div className="hr-metric-trend">
            <i className="fas fa-user-tie" style={{ color: '#00a9ac', marginRight: '4px' }}></i>
            <span>All applications</span>
          </div>
        </div>
        
        <div className="hr-report-summary-card" style={{
          boxShadow: '0 4px 12px rgba(0,169,172,0.08)',
          borderLeft: '4px solid #66bc6d'
        }}>
          <h3>In Process</h3>
          <div className="hr-report-value">{inProcessCount}</div>
          <div className="hr-metric-trend">
            <i className="fas fa-spinner" style={{ color: '#66bc6d', marginRight: '4px' }}></i>
            <span>{totalCandidates > 0 ? Math.round((inProcessCount / totalCandidates) * 100) : 0}% of total</span>
          </div>
        </div>
        
        <div className="hr-report-summary-card" style={{
          boxShadow: '0 4px 12px rgba(0,169,172,0.08)',
          borderLeft: '4px solid #8884d8'
        }}>
          <h3>Hired</h3>
          <div className="hr-report-value">{hiredCount}</div>
          <div className="hr-metric-trend">
            <i className="fas fa-check-circle" style={{ color: '#8884d8', marginRight: '4px' }}></i>
            <span>{conversionRate}% conversion rate</span>
          </div>
        </div>
        
        <div className="hr-report-summary-card" style={{
          boxShadow: '0 4px 12px rgba(0,169,172,0.08)',
          borderLeft: '4px solid #ff8042'
        }}>
          <h3>Rejected/Withdrawn</h3>
          <div className="hr-report-value">{rejectedCount}</div>
          <div className="hr-metric-trend">
            <i className="fas fa-times-circle" style={{ color: '#ff8042', marginRight: '4px' }}></i>
            <span>{totalCandidates > 0 ? Math.round((rejectedCount / totalCandidates) * 100) : 0}% rejection rate</span>
          </div>
        </div>
      </div>
      
      {/* Charts Container - Single Column Layout with enhanced styling */}
      <div className="hr-report-charts-single-column">
        {/* Candidate Status Section */}
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
            Candidate Application Status
          </h3>
          
          <div style={{
            height: "450px",
            display: "flex", 
            flexDirection: "row",
            position: "relative"
          }}>
            {candidates.length > 0 ? (
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
                    Application Status
                  </h4>
                  
                  <div style={{ 
                    display: "flex", 
                    flexDirection: "column", 
                    gap: "10px",
                    maxHeight: "400px",
                    overflowY: "auto"
                  }}>
                    {stageData.map((status, index) => (
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
                            <span>{status.value} candidates</span>
                            <span style={{
                              background: COLORS[index % COLORS.length] + '20',
                              color: COLORS[index % COLORS.length],
                              padding: '3px 8px',
                              borderRadius: '12px',
                              fontWeight: '600',
                              fontSize: '11px'
                            }}>
                              {((status.value / totalCandidates) * 100).toFixed(1)}%
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
                          data={stageData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={130}
                          innerRadius={60}
                          paddingAngle={2}
                          dataKey="value"
                          label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {stageData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={`url(#pieCandidateGradient-${index % COLORS.length})`}
                              stroke="#fff"
                              strokeWidth={2}
                            />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value, name) => [
                            `${value} candidates (${((value / totalCandidates) * 100).toFixed(1)}%)`, 
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
                    Recruitment Insights
                  </h4>

                  {/* Metric Card: Conversion Rate */}
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
                      Hire Conversion Rate
                    </div>
                    <div style={{ 
                      fontSize: "20px", 
                      fontWeight: "700",
                      color: "#00a9ac",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between"
                    }}>
                      {conversionRate}%
                      <span style={{ 
                        fontSize: "11px",
                        padding: "3px 8px",
                        backgroundColor: "rgba(0, 169, 172, 0.1)",
                        color: "#00a9ac",
                        borderRadius: "12px" 
                      }}>
                        hire rate
                      </span>
                    </div>
                  </div>

                  {/* Metric Card: Application Progress */}
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
                      Application Progress
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
                        {/* Progress bar segments */}
                        <div style={{
                          width: `${(stages.Applied / totalCandidates) * 100}%`,
                          height: "100%",
                          backgroundColor: COLORS[0]
                        }} />
                        <div style={{
                          width: `${(stages.Screening / totalCandidates) * 100}%`,
                          height: "100%",
                          backgroundColor: COLORS[1]
                        }} />
                        <div style={{
                          width: `${(stages.Interview / totalCandidates) * 100}%`,
                          height: "100%",
                          backgroundColor: COLORS[2]
                        }} />
                        <div style={{
                          width: `${((stages['Technical Assessment'] + stages['Offer Extended']) / totalCandidates) * 100}%`,
                          height: "100%",
                          backgroundColor: COLORS[3]
                        }} />
                        <div style={{
                          width: `${(hiredCount / totalCandidates) * 100}%`,
                          height: "100%",
                          backgroundColor: COLORS[4]
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
                      <span>Applied → Hired</span>
                      <span>{Math.round((hiredCount / (totalCandidates || 1)) * 100)}% completion</span>
                    </div>
                  </div>

                  {/* Metric Card: Success Rate */}
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
                      Candidates Distribution
                    </div>
                    <div style={{
                      fontSize: "13px",
                      fontWeight: "500",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      marginBottom: "8px"
                    }}>
                      <span>{inProcessCount} of {totalCandidates}</span>
                      <span style={{ color: "#687C7B" }}>candidates still in process</span>
                    </div>
                    <div style={{
                      width: "100%",
                      height: "8px",
                      backgroundColor: "#e9ecef",
                      borderRadius: "4px",
                      overflow: "hidden"
                    }}>
                      <div style={{
                        width: `${(inProcessCount / (totalCandidates || 1)) * 100}%`,
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
                      <span>Active rate: {((inProcessCount / (totalCandidates || 1)) * 100).toFixed(1)}%</span>
                      <span style={{
                        color: "#008a8c",
                        fontWeight: "500",
                        textAlign: "right"
                      }}>
                        {inProcessCount > 0 ? 'Active pipeline' : 'No active candidates'}
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
                    Add New Candidate
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
                <p style={{ color: "#687C7B", fontSize: "16px" }}>No candidates data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Candidate Distribution Section */}
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
            Candidate Distribution
          </h3>
          
          <div style={{ display: "flex", flexDirection: "row", gap: "30px" }}>
            {/* Top Positions Chart */}
            <div style={{ flex: 1 }}>
              <h4 style={{ 
                marginBottom: "15px", 
                fontSize: "14px", 
                fontWeight: "600",
                color: '#00a9ac',
                display: 'flex',
                alignItems: 'center'
              }}>
                <i className="fas fa-briefcase" style={{ marginRight: '8px' }}></i>
                Top 5 Positions with Most Applicants
              </h4>
              
              <div style={{ height: '350px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={positionChartData}>
                    {renderGradientDefs()}
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`${value} candidates`, 'Count']}
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
                      name="Candidates" 
                      fill={`url(#${GRADIENTS[0]})`}
                      radius={[4, 4, 0, 0]} 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Qualification Distribution Chart - replacing Application Trends */}
            <div style={{ flex: 1 }}>
              <h4 style={{ 
                marginBottom: "15px", 
                fontSize: "14px", 
                fontWeight: "600",
                color: '#00a9ac',
                display: 'flex',
                alignItems: 'center'
              }}>
                <i className="fas fa-award" style={{ marginRight: '8px' }}></i>
                Candidate Qualification Distribution
              </h4>
              
              <div style={{ height: '350px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    layout="vertical"
                    data={[
                      { name: "Technical Skills", excellent: 45, good: 35, average: 20 },
                      { name: "Experience", excellent: 30, good: 42, average: 28 },
                      { name: "Education", excellent: 55, good: 30, average: 15 },
                      { name: "Communication", excellent: 38, good: 47, average: 15 },
                      { name: "Cultural Fit", excellent: 42, good: 38, average: 20 }
                    ]}
                    margin={{ top: 20, right: 20, bottom: 20, left: 100 }}
                  >
                    {renderGradientDefs()}
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip 
                      formatter={(value) => [`${value} candidates`, 'Count']}
                      contentStyle={{
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        border: 'none',
                        padding: '10px 15px'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="excellent" name="Excellent Match" stackId="a" fill={`url(#${GRADIENTS[1]})`} />
                    <Bar dataKey="good" name="Good Match" stackId="a" fill={`url(#${GRADIENTS[2]})`} />
                    <Bar dataKey="average" name="Average Match" stackId="a" fill={`url(#${GRADIENTS[3]})`} />
                  </BarChart>
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
                }}>Candidate Recruitment Insights</h4>
                <p style={{ 
                  fontSize: '13px', 
                  margin: '0 0 5px 0',
                  color: '#555'
                }}>
                  <strong>Most popular position:</strong> {
                    positionChartData.length > 0 ? positionChartData[0].name : 'N/A'
                  }
                </p>
                <p style={{ 
                  fontSize: '13px', 
                  margin: '0 0 5px 0',
                  color: '#555'
                }}>
                  <strong>Current pipeline strength:</strong> {
                    inProcessCount > 0 ? `${inProcessCount} active candidates` : 'No active candidates'
                  }
                </p>
                <p style={{ 
                  fontSize: '13px', 
                  margin: '0',
                  color: '#555'
                }}>
                  <strong>Conversion efficiency:</strong> {
                    totalCandidates > 0 ? 
                      `${conversionRate}% (Hired ${hiredCount} out of ${totalCandidates})` : 
                      'No data'
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
                Export Candidates Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidatesSummaryReport;