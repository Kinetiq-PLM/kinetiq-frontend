import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  ResponsiveContainer, PieChart, Pie, Cell, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line
} from 'recharts';

const EmployeesSummaryReport = ({ employees: propsEmployees = [] }) => {
  // State variables
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [employees, setEmployees] = useState([]);

  // Enhanced color palette
  const COLORS = ['#00a9ac', '#66bc6d', '#8884d8', '#3498db', '#ffc658', '#82ca9d'];
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
      if (propsEmployees.length > 0) {
        setEmployees(propsEmployees);
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching employee data...");
        const response = await axios.get("http://127.0.0.1:8000/api/employees/employees/");
        setEmployees(response.data || []);
      } catch (err) {
        console.error("Error fetching employee data:", err);
        setError("Failed to load employee data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [propsEmployees]);

  // Show loading state
  if (loading) {
    return (
      <div className="hr-report-container" style={{ textAlign: 'center', padding: '50px 0' }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
        <p style={{ fontSize: '18px', color: '#687C7B' }}>Loading employee data...</p>
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
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(emp => emp.status === "Active").length;
  const inactiveEmployees = totalEmployees - activeEmployees;
  
  // Gender distribution
  const genderData = employees.reduce((acc, emp) => {
    const gender = emp.gender || "Not Specified";
    acc[gender] = (acc[gender] || 0) + 1;
    return acc;
  }, {});
  
  const genderChartData = Object.entries(genderData)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // Employment type breakdown
  const employmentTypeData = employees.reduce((acc, emp) => {
    const type = emp.employment_type || "Regular";
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const employmentTypeChartData = Object.entries(employmentTypeData)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // Department distribution data
  const departmentData = employees.reduce((acc, emp) => {
    const dept = emp.dept_name || "Unassigned";
    acc[dept] = (acc[dept] || 0) + 1;
    return acc;
  }, {});

  const departmentChartData = Object.entries(departmentData)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5); // Top 5 departments

  // Position distribution data
  const positionData = employees.reduce((acc, emp) => {
    const position = emp.job_title || "Unspecified";
    acc[position] = (acc[position] || 0) + 1;
    return acc;
  }, {});

  const positionChartData = Object.entries(positionData)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5); // Top 5 positions
  
  // Tenure data (years with company)
  const tenureData = employees.reduce((acc, emp) => {
    let tenureCategory = "Unknown";
    if (emp.hire_date) {
      const hireDate = new Date(emp.hire_date);
      const today = new Date();
      const tenureInYears = Math.floor((today - hireDate) / (365 * 24 * 60 * 60 * 1000));
      
      if (tenureInYears < 1) tenureCategory = "< 1 year";
      else if (tenureInYears < 3) tenureCategory = "1-2 years";
      else if (tenureInYears < 5) tenureCategory = "3-4 years";
      else if (tenureInYears < 10) tenureCategory = "5-9 years";
      else tenureCategory = "10+ years";
    }
    
    acc[tenureCategory] = (acc[tenureCategory] || 0) + 1;
    return acc;
  }, {});
  
  const tenureChartData = Object.entries(tenureData)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => {
      const order = ["< 1 year", "1-2 years", "3-4 years", "5-9 years", "10+ years", "Unknown"];
      return order.indexOf(a.name) - order.indexOf(b.name);
    });

  // Monthly hire trend
  const monthlyData = employees.reduce((acc, emp) => {
    let month = 'Unknown';
    
    if (emp.hire_date) {
      const date = new Date(emp.hire_date);
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

  // Skill set distribution
  const skillsData = employees.reduce((acc, emp) => {
    if (!emp.skills) return acc;
    
    const skills = emp.skills.split(/,\s*/).filter(Boolean);
    
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
          <h3>Total Employees</h3>
          <div className="hr-report-value">{totalEmployees}</div>
          <div className="hr-metric-trend">
            <i className="fas fa-users" style={{ color: '#00a9ac', marginRight: '4px' }}></i>
            <span>Current workforce</span>
          </div>
        </div>
        
        <div className="hr-report-summary-card" style={{
          boxShadow: '0 4px 12px rgba(0,169,172,0.08)',
          borderLeft: '4px solid #66bc6d'
        }}>
          <h3>Active Employees</h3>
          <div className="hr-report-value">{activeEmployees}</div>
          <div className="hr-metric-trend">
            <i className="fas fa-user-check" style={{ color: '#66bc6d', marginRight: '4px' }}></i>
            <span>{totalEmployees > 0 ? Math.round((activeEmployees / totalEmployees) * 100) : 0}% of workforce</span>
          </div>
        </div>
        
        <div className="hr-report-summary-card" style={{
          boxShadow: '0 4px 12px rgba(0,169,172,0.08)',
          borderLeft: '4px solid #8884d8'
        }}>
          <h3>Employment Types</h3>
          <div className="hr-report-value">{Object.keys(employmentTypeData).length}</div>
          <div className="hr-metric-trend">
            <i className="fas fa-id-card" style={{ color: '#8884d8', marginRight: '4px' }}></i>
            <span>Different contract types</span>
          </div>
        </div>
        
        <div className="hr-report-summary-card" style={{
          boxShadow: '0 4px 12px rgba(0,169,172,0.08)',
          borderLeft: '4px solid #ff8042'
        }}>
          <h3>Departments</h3>
          <div className="hr-report-value">{Object.keys(departmentData).length}</div>
          <div className="hr-metric-trend">
            <i className="fas fa-building" style={{ color: '#ff8042', marginRight: '4px' }}></i>
            <span>Organizational units</span>
          </div>
        </div>
      </div>
      
      {/* Employment Type Section */}
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
            <i className="fas fa-user-tie" style={{ marginRight: '10px', color: '#00a9ac' }}></i>
            Employment Type Distribution
          </h3>
          
          <div style={{
            height: "450px",
            display: "flex", 
            flexDirection: "row",
            position: "relative"
          }}>
            {employees.length > 0 ? (
              <>
                {/* Employment type legend */}
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
                    <i className="fas fa-briefcase" style={{ marginRight: '8px' }}></i>
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
                            {type.name}
                          </div>
                          <div style={{ 
                            fontSize: "12px", 
                            color: "#687C7B",
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}>
                            <span>{type.value} employees</span>
                            <span style={{
                              background: COLORS[index % COLORS.length] + '20',
                              color: COLORS[index % COLORS.length],
                              padding: '3px 8px',
                              borderRadius: '12px',
                              fontWeight: '600',
                              fontSize: '11px'
                            }}>
                              {((type.value / totalEmployees) * 100).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Employment type pie chart */}
                <div style={{ width: "40%", position: 'relative' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      {renderGradientDefs()}
                      <Pie
                        data={employmentTypeChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={130}
                        innerRadius={50}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                      >
                        {employmentTypeChartData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={`url(#${GRADIENTS[index % GRADIENTS.length]})`} 
                          />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} employees`, 'Count']} />
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
                    Workforce Insights
                  </h4>

                  {/* Metric Card: Primary Employment Type */}
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
                      Primary Employment Type
                    </div>
                    <div style={{ 
                      fontSize: "16px", 
                      fontWeight: "700",
                      color: "#00a9ac",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between"
                    }}>
                      {employmentTypeChartData.length > 0 ? employmentTypeChartData[0].name : 'N/A'}
                      <span style={{ 
                        fontSize: "11px",
                        padding: "3px 8px",
                        backgroundColor: "rgba(0, 169, 172, 0.1)",
                        color: "#00a9ac",
                        borderRadius: "12px" 
                      }}>
                        {employmentTypeChartData.length > 0 ? 
                          ((employmentTypeChartData[0].value / totalEmployees) * 100).toFixed(1) + '%' : '0%'}
                      </span>
                    </div>
                  </div>

                  {/* Metric Card: Status Distribution */}
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
                      Employee Status
                    </div>
                    <div style={{ 
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px"
                    }}>
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between"
                      }}>
                        <div style={{ fontSize: "13px", display: "flex", alignItems: "center" }}>
                          <div style={{
                            width: "8px",
                            height: "8px",
                            borderRadius: "50%",
                            background: COLORS[0],
                            marginRight: "8px"
                          }} />
                          Active
                        </div>
                        <div style={{
                          fontSize: "12px",
                          fontWeight: "600",
                          color: COLORS[0]
                        }}>
                          {((activeEmployees / totalEmployees) * 100).toFixed(1)}%
                        </div>
                      </div>
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between"
                      }}>
                        <div style={{ fontSize: "13px", display: "flex", alignItems: "center" }}>
                          <div style={{
                            width: "8px",
                            height: "8px",
                            borderRadius: "50%",
                            background: COLORS[1],
                            marginRight: "8px"
                          }} />
                          Inactive
                        </div>
                        <div style={{
                          fontSize: "12px",
                          fontWeight: "600",
                          color: COLORS[1]
                        }}>
                          {((inactiveEmployees / totalEmployees) * 100).toFixed(1)}%
                        </div>
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
                    <i className="fas fa-download" style={{ fontSize: "11px" }}></i>
                    Export Employee Data
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
                <p style={{ color: "#687C7B", fontSize: "16px" }}>No employee data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Organizational Distribution Section */}
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
            <i className="fas fa-sitemap" style={{ marginRight: '10px', color: '#00a9ac' }}></i>
            Organizational Distribution
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
                Employees by Department
              </h4>
              
              <div style={{ height: '350px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={departmentChartData}>
                    {renderGradientDefs()}
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
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
                      fill={`url(#${GRADIENTS[0]})`}
                      radius={[4, 4, 0, 0]} 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
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
                <i className="fas fa-id-badge" style={{ marginRight: '8px' }}></i>
                Top Positions
              </h4>
              
              <div style={{ height: '350px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={(() => {
                    // Process position data
                    const positionData = employees.reduce((acc, emp) => {
                      const position = emp.position_title || emp.position_name || 'Unspecified';
                      acc[position] = (acc[position] || 0) + 1;
                      return acc;
                    }, {});
                    
                    // Convert to array format for chart and get top positions
                    return Object.entries(positionData)
                      .map(([name, count]) => ({ name, count }))
                      .sort((a, b) => b.count - a.count)
                      .slice(0, 5); // Top 5 positions
                  })()}>
                    {renderGradientDefs()}
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
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
                      fill={`url(#${GRADIENTS[1]})`}
                      radius={[4, 4, 0, 0]} 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Workforce Analysis Section */}
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
            Workforce Analysis
          </h3>
          
          <div style={{ display: "flex", flexDirection: "row", gap: "30px" }}>
            {/* Supervisor Status Distribution */}
            <div style={{ flex: 1 }}>
              <h4 style={{ 
                marginBottom: "15px", 
                fontSize: "14px", 
                fontWeight: "600",
                color: '#00a9ac',
                display: 'flex',
                alignItems: 'center'
              }}>
                <i className="fas fa-user-tie" style={{ marginRight: '8px' }}></i>
                Supervisory Role Distribution
              </h4>
              
              <div style={{ height: '350px' }}>
                {employees.length > 0 && (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      {renderGradientDefs()}
                      <Pie
                        data={[
                          { 
                            name: "Supervisors", 
                            value: employees.filter(emp => emp.is_supervisor === true).length 
                          },
                          { 
                            name: "Staff", 
                            value: employees.filter(emp => emp.is_supervisor === false).length 
                          }
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={130}
                        innerRadius={50}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                      >
                        <Cell fill={`url(#${GRADIENTS[2]})`} />
                        <Cell fill={`url(#${GRADIENTS[3]})`} />
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} employees`, 'Count']} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
            
            {/* Salary Grade Distribution */}
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
                Salary Grade Distribution
              </h4>
              
              <div style={{ height: '350px' }}>
                {employees.length > 0 && (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={(() => {
                      // Process salary grade data
                      const salaryGradeData = employees.reduce((acc, emp) => {
                        if (!emp.salary_grade) return acc;
                        
                        // Extract the SG level (e.g., from "SG-3-8" extract "3")
                        const match = emp.salary_grade.match(/SG-(\d+)-\d+/);
                        if (!match) return acc;
                        
                        const level = `SG-${match[1]}`;
                        acc[level] = (acc[level] || 0) + 1;
                        return acc;
                      }, {});
                      
                      // Convert to array format for chart
                      return Object.entries(salaryGradeData)
                        .map(([name, count]) => ({ name, count }))
                        .sort((a, b) => {
                          // Sort by SG level numerically
                          const getLevel = (sg) => parseInt(sg.replace('SG-', ''));
                          return getLevel(a.name) - getLevel(b.name);
                        });
                    })()}>
                      {renderGradientDefs()}
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
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
                        fill={`url(#${GRADIENTS[3]})`} 
                        radius={[4, 4, 0, 0]} 
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeesSummaryReport;