import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell 
} from 'recharts';

const PositionsSummaryReport = ({ positions: propsPositions = [], employees: propsEmployees = [] }) => {
    // Add state variables for data management
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [positions, setPositionsData] = useState(propsPositions);
    const [employees, setEmployeesData] = useState(propsEmployees);
    const [departments, setDepartments] = useState([]);

    // Fetch data if not provided through props
    useEffect(() => {
      const fetchData = async () => {
        // If we already have sufficient data from props, use it
        if (propsPositions.length > 0 && propsEmployees.length > 0) {
          setPositionsData(propsPositions);
          setEmployeesData(propsEmployees);
          setLoading(false);
          return;
        }
  
        try {
          console.log("Fetching positions and employees data directly...");
          const [positionsRes, employeesRes, deptsRes] = await Promise.all([
            axios.get("http://127.0.0.1:8001/api/positions/positions/"),
            axios.get("http://127.0.0.1:8001/api/employees/"),
            axios.get("http://127.0.0.1:8001/api/departments/department/")
          ]);
          
          console.log("Positions data fetched:", positionsRes.data);
          console.log("Employees data fetched:", employeesRes.data);
          
          setPositionsData(positionsRes.data || []);
          setEmployeesData(employeesRes.data || []);
        } catch (err) {
          console.error("Error fetching positions data:", err);
          setError("Failed to load position data");
        } finally {
          setLoading(false);
        }
      };
  
      fetchData();
    }, [propsPositions, propsEmployees]);
  
    // Show loading state
    if (loading) {
      return (
        <div className="hr-report-container" style={{ textAlign: 'center', padding: '50px 0' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
          <p style={{ fontSize: '18px', color: '#687C7B' }}>Loading positions data...</p>
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
  const totalPositions = positions.length;
  const activePositions = positions.filter(pos => pos.is_active).length;
  const inactivePositions = totalPositions - activePositions;
  const filledPositions = positions.filter(pos => 
    employees.some(emp => emp.position_id === pos.position_id)
  ).length;
  const vacantPositions = activePositions - filledPositions;
  
  // Calculate fill rate
  const fillRate = activePositions > 0 ? Math.round((filledPositions / activePositions) * 100) : 0;
  
  // Calculate active rate
  const activeRate = totalPositions > 0 ? Math.round((activePositions / totalPositions) * 100) : 0;
  
  // Positions by employment type
  const employmentTypeData = positions.reduce((acc, pos) => {
    const type = pos.employment_type || "Regular";
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const employmentTypeChartData = Object.keys(employmentTypeData).map(key => ({
    name: key,
    value: employmentTypeData[key]
  }));
  
  // Salary grade distribution
  const salaryGradeData = positions.reduce((acc, pos) => {
    const grade = pos.salary_grade || "Unspecified";
    acc[grade] = (acc[grade] || 0) + 1;
    return acc;
  }, {});

  // Convert to array and sort by salary grade
  const salaryGradeChartData = Object.entries(salaryGradeData)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => {
      // Extract numeric part for proper sorting (e.g., "SG-10" -> 10)
      const getNumericPart = str => {
        const match = str.match(/\d+/);
        return match ? parseInt(match[0]) : 0;
      };
      return getNumericPart(a.name) - getNumericPart(b.name);
    });
    
  // Department distribution
  const departmentData = positions.reduce((acc, pos) => {
    // Check for dept_name first, then dept_id, and use "Unassigned" as last resort
    const dept = pos.dept_name || (pos.dept_id ? getDepartmentNameById(pos.dept_id) : "Unassigned");
    acc[dept] = (acc[dept] || 0) + 1;
    return acc;
  }, {});
    // Helper function to get department name from ID
    const getDepartmentNameById = (deptId) => {
      // If position has dept_id but no department name, try to find the name from employees data
      const empWithDept = employees.find(emp => emp.dept_id === deptId && emp.dept_name);
      if (empWithDept) return empWithDept.dept_name;
      
      // Try to find in departments directly if available
      const deptMatch = departments && departments.find(dept => dept.dept_id === deptId);
      if (deptMatch && deptMatch.dept_name) return deptMatch.dept_name;
      
      // If we can't find a proper name, return a formatted version of the ID
      return `Dept ${deptId.split('-').pop()}`;
    };
  const departmentChartData = Object.entries(departmentData)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 7); // Top 7 departments
  
  // Enhanced color palette to match department report
  const COLORS = [
    '#00a8a8', '#66bc6d', '#8884d8', '#ff8042', 
    '#ffc658', '#82ca9d', '#8dd1e1', '#a4de6c',
    '#d0ed57', '#97e3d5', '#f5a623', '#f78da7'
  ];
  
  // Define gradient IDs for each color
  const GRADIENTS = COLORS.map((color, index) => `positionGradient-${index}`);
  
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
          id={`piePosGradient-${index}`} 
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
          <h3>Total Positions</h3>
          <div className="hr-report-value">{totalPositions}</div>
          <div className="hr-metric-trend">
            <i className="fas fa-sitemap" style={{ color: '#00a9ac', marginRight: '4px' }}></i>
            <span>Defined positions</span>
          </div>
        </div>
        
        <div className="hr-report-summary-card" style={{
          boxShadow: '0 4px 12px rgba(0,169,172,0.08)',
          borderLeft: '4px solid #66bc6d'
        }}>
          <h3>Active Positions</h3>
          <div className="hr-report-value">{activePositions}</div>
          <div className="hr-metric-trend">
            <i className="fas fa-check-circle" style={{ color: '#66bc6d', marginRight: '4px' }}></i>
            <span>{activeRate}% active rate</span>
          </div>
        </div>
        
        <div className="hr-report-summary-card" style={{
          boxShadow: '0 4px 12px rgba(0,169,172,0.08)',
          borderLeft: '4px solid #8884d8'
        }}>
          <h3>Filled Positions</h3>
          <div className="hr-report-value">{filledPositions}</div>
          <div className="hr-metric-trend">
            <i className="fas fa-users" style={{ color: '#8884d8', marginRight: '4px' }}></i>
            <span>{fillRate}% fill rate</span>
          </div>
        </div>
        
        <div className="hr-report-summary-card" style={{
          boxShadow: '0 4px 12px rgba(0,169,172,0.08)',
          borderLeft: '4px solid #ff8042'
        }}>
          <h3>Vacant Positions</h3>
          <div className="hr-report-value">{vacantPositions}</div>
          <div className="hr-metric-trend">
            <i className="fas fa-user-plus" style={{ color: '#ff8042', marginRight: '4px' }}></i>
            <span>Open opportunities</span>
          </div>
        </div>
      </div>
      
      {/* Charts Container - Single Column Layout with enhanced styling */}
      <div className="hr-report-charts-single-column">
        {/* Position Structure with optimized layout */}
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
            <i className="fas fa-sitemap" style={{ marginRight: '10px', color: '#00a9ac' }}></i>
            Position Structure
          </h3>
          
          <div style={{
            height: "450px",
            display: "flex", 
            flexDirection: "row",
            position: "relative"
          }}>
            {employmentTypeChartData.length > 0 ? (
              <>
                {/* Employment Type legend with improved layout */}
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
                    <i className="fas fa-id-badge" style={{ marginRight: '8px' }}></i>
                    Employment Types
                  </h4>
                  
                  <div style={{ 
                    display: "flex", 
                    flexDirection: "column", 
                    gap: "10px",
                    maxHeight: "400px",
                    overflowY: "auto"
                  }}>
                    {employmentTypeChartData.map((type, index) => (
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
                            {type.name}
                          </div>
                          <div style={{ 
                            fontSize: "12px", 
                            color: "#687C7B",
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}>
                            <span>{type.value} positions</span>
                            <span style={{
                              background: COLORS[index % COLORS.length] + '20',
                              color: COLORS[index % COLORS.length],
                              padding: '3px 8px',
                              borderRadius: '12px',
                              fontWeight: '600',
                              fontSize: '11px'
                            }}>
                              {((type.value / totalPositions) * 100).toFixed(1)}%
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
                <PieChart margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  {renderGradientDefs()}
                  <Pie
                    data={employmentTypeChartData.sort((a, b) => b.value - a.value)}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={140}
                    innerRadius={60}
                    paddingAngle={2}
                    dataKey="value"
                    nameKey="name"
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(1)}%`}
                  >
                    {employmentTypeChartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={`url(#piePosGradient-${index % COLORS.length})`}
                        stroke="#fff"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name) => [
                      `${value} positions (${((value / totalPositions) * 100).toFixed(1)}%)`, 
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

                {/* NEW SECTION: Position Metrics Cards */}
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
                    Position Insights
                  </h4>

                  {/* Metric Card: Fill Rate */}
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
                      Position Fill Rate
                    </div>
                    <div style={{ 
                      fontSize: "20px", 
                      fontWeight: "700",
                      color: "#00a9ac",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between"
                    }}>
                      {fillRate}%
                      <span style={{ 
                        fontSize: "11px",
                        padding: "3px 8px",
                        backgroundColor: "rgba(0, 169, 172, 0.1)",
                        color: "#00a9ac",
                        borderRadius: "12px" 
                      }}>
                        occupancy rate
                      </span>
                    </div>
                  </div>

                  {/* Metric Card: Position Distribution */}
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
                        overflow: "hidden",
                        display: "flex"
                      }}>
                        {employmentTypeChartData.slice(0, 5).map((type, idx) => (
                          <div 
                            key={idx} 
                            style={{
                              width: `${(type.value / totalPositions) * 100}%`,
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
                      <span>Types: {employmentTypeChartData.length}</span>
                      <span>Most common: {
                        employmentTypeChartData.length > 0 ? 
                          employmentTypeChartData.sort((a, b) => b.value - a.value)[0].name : 
                          'N/A'
                      }</span>
                    </div>
                  </div>

                  {/* Metric Card: Vacancy Rate */}
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
                      Vacancy Status
                    </div>
                    <div style={{
                      fontSize: "13px",
                      fontWeight: "500",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      marginBottom: "8px"
                    }}>
                      <span>{vacantPositions} of {activePositions}</span>
                      <span style={{ color: "#687C7B" }}>positions are vacant</span>
                    </div>
                    <div style={{
                      width: "100%",
                      height: "8px",
                      backgroundColor: "#e9ecef",
                      borderRadius: "4px",
                      overflow: "hidden"
                    }}>
                      <div style={{
                        width: `${(vacantPositions / (activePositions || 1)) * 100}%`,
                        height: "100%",
                        background: vacantPositions > 0 ? 
                          "linear-gradient(90deg, #ff8042 0%, #ffc658 100%)" : 
                          "linear-gradient(90deg, #66bc6d 0%, #00a9ac 100%)"
                      }}/>
                    </div>
                    <div style={{
                      marginTop: "8px",
                      fontSize: "11px",
                      color: "#687C7B",
                      display: "flex",
                      justifyContent: "space-between"
                    }}>
                      <span>Vacancy rate: {activePositions > 0 ? ((vacantPositions / activePositions) * 100).toFixed(1) : 0}%</span>
                      <span style={{
                        color: vacantPositions > activePositions * 0.2 ? "#ff8042" : "#008a8c",
                        fontWeight: "500",
                        textAlign: "right"
                      }}>
                        {vacantPositions > activePositions * 0.2 ? 'High vacancies' : 'Healthy'}
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
                <p style={{ color: "#687C7B", fontSize: "16px" }}>No position data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Salary Grade and Department Distribution Section */}
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
            Position Distribution
          </h3>
          
          <div style={{ display: "flex", flexDirection: "row", gap: "30px" }}>
            {/* Salary Grade Chart */}
            <div style={{ flex: 1 }}>
              <h4 style={{ 
                marginBottom: "15px", 
                fontSize: "14px", 
                fontWeight: "600",
                color: '#00a9ac',
                display: 'flex',
                alignItems: 'center'
              }}>
                <i className="fas fa-money-bill-wave" style={{ marginRight: '8px' }}></i>
                Positions by Salary Grade
              </h4>
              
              <div style={{ height: '350px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salaryGradeChartData} layout="vertical">
                    {renderGradientDefs()}
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      width={100}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip 
                      formatter={(value) => [`${value} positions`, 'Count']}
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
                      name="Positions" 
                      fill={`url(#${GRADIENTS[0]})`}
                      radius={[0, 4, 4, 0]} 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Department Distribution Chart */}
            {/* Department Distribution Chart - REPLACING WITH SALARY RANGE DISTRIBUTION */}
            <div style={{ flex: 1 }}>
              <h4 style={{ 
                marginBottom: "15px", 
                fontSize: "14px", 
                fontWeight: "600",
                color: '#00a9ac',
                display: 'flex',
                alignItems: 'center'
              }}>
                <i className="fas fa-money-bill-alt" style={{ marginRight: '8px' }}></i>
                Positions by Salary Range
              </h4>
              
              <div style={{ height: '350px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  {(() => {
                    // Create salary range buckets
                    const salaryRanges = [
                      { range: "< 10K", min: 0, max: 10000, count: 0 },
                      { range: "10K-20K", min: 10000, max: 20000, count: 0 },
                      { range: "20K-30K", min: 20000, max: 30000, count: 0 },
                      { range: "30K-50K", min: 30000, max: 50000, count: 0 },
                      { range: "50K-80K", min: 50000, max: 80000, count: 0 },
                      { range: "80K+", min: 80000, max: Infinity, count: 0 },
                    ];
                    
                    // Count positions in each salary range bucket
                    positions.forEach(pos => {
                      const minSalary = parseFloat(pos.min_salary || 0);
                      for (let range of salaryRanges) {
                        if (minSalary >= range.min && minSalary < range.max) {
                          range.count++;
                          break;
                        }
                      }
                    });
                    
                    // Filter out empty ranges
                    const filteredRanges = salaryRanges.filter(range => range.count > 0);
                    
                    return (
                      <BarChart data={filteredRanges}>
                        {renderGradientDefs()}
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="range" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value) => [`${value} positions`, 'Count']}
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
                          name="Positions" 
                          radius={[4, 4, 0, 0]}
                        >
                          {filteredRanges.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={`url(#${GRADIENTS[index % COLORS.length]})`}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    );
                  })()}
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
                }}>Position Allocation Insights</h4>
                <p style={{ 
                  fontSize: '13px', 
                  margin: '0 0 5px 0',
                  color: '#555'
                }}>
                  <strong>Most staffed department:</strong> {
                    departmentChartData.length > 0 ? departmentChartData[0].name : 'N/A'
                  }
                </p>
                <p style={{ 
                  fontSize: '13px', 
                  margin: '0',
                  color: '#555'
                }}>
                  <strong>Top salary grade:</strong> {
                    salaryGradeChartData.length > 0 ? 
                      [...salaryGradeChartData]
                        .sort((a, b) => {
                          // First try to extract the grade number (e.g. SG-25-3 -> 25)
                          const getGradeNumber = str => {
                            const match = str.name.match(/SG-(\d+)/);
                            return match ? parseInt(match[1]) : 0;
                          };
                          // Sort by grade number (highest first)
                          const gradeA = getGradeNumber(a);
                          const gradeB = getGradeNumber(b);
                          if (gradeA !== gradeB) return gradeB - gradeA;
                          
                          // If same grade, sort by step/sublevel if present
                          const getSubLevel = str => {
                            const match = str.name.match(/SG-\d+-(\d+)/);
                            return match ? parseInt(match[1]) : 0;
                          };
                          return getSubLevel(b) - getSubLevel(a);
                        })[0].name : 
                      'N/A'
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
                Export Position Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PositionsSummaryReport;