import React from "react";
import { 
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList 
} from 'recharts';

const DepartmentSummaryReport = ({ departments = [], superiors = [], period }) => {
  // Transform the departments data for visualization
  const transformedDepartments = React.useMemo(() => {
    return Array.isArray(departments) 
      ? departments.map(dept => ({
          name: dept.dept_name || dept.name || "Unknown",
          id: dept.dept_id || dept.id || "",
          value: dept.employee_count || dept.value || 0
        }))
      : [];
  }, [departments]);

  // Calculate metrics with the transformed data
  const totalDepartments = transformedDepartments.length;
  const totalSuperiors = superiors?.length || 0;
  const avgEmployeesPerDept = totalDepartments > 0 
    ? transformedDepartments.reduce((sum, dept) => sum + (dept.value || 0), 0) / totalDepartments
    : 0;
  
  // Sort departments by size for better visualization and truncate names if needed
  const departmentSizeData = React.useMemo(() => {
    return [...transformedDepartments]
      .sort((a, b) => b.value - a.value)
      .map(dept => ({
        ...dept,
        // Shorten long department names for better display in bar chart
        displayName: dept.name.length > 15 ? dept.name.substring(0, 15) + '...' : dept.name
      }));
  }, [transformedDepartments]);

  // Prepare data for department structure pie chart
  const departmentStructureData = React.useMemo(() => {
    if (!transformedDepartments.length) return [];
    
    // Sort departments by size and filter out any with zero employees
    const sortedDepts = [...transformedDepartments]
      .filter(dept => dept.value > 0)
      .sort((a, b) => b.value - a.value);
    
    return sortedDepts;
  }, [transformedDepartments]);

  // Calculate midAngles for all segments to use in label positioning
  const midAngles = React.useMemo(() => {
    const total = departmentStructureData.reduce((sum, entry) => sum + entry.value, 0);
    let currentAngle = 90; // Start angle (in degrees)
    
    return departmentStructureData.map(entry => {
      const angle = (entry.value / total) * 360;
      const midAngle = currentAngle - (angle / 2);
      currentAngle -= angle;
      return midAngle;
    });
  }, [departmentStructureData]);

  // Department colors - using a consistent palette with teal primary color like in Distribution module
  const COLORS = [
    '#00a8a8', '#66bc6d', '#8884d8', '#ff8042', 
    '#ffc658', '#82ca9d', '#8dd1e1', '#a4de6c',
    '#d0ed57', '#97e3d5', '#f5a623', '#f78da7'
  ];

  // Calculate the total number of employees for percentage calculations
  const totalEmployees = departmentStructureData.reduce((sum, dept) => sum + dept.value, 0);

  // Render custom labels for pie chart with improved positioning and connecting lines
  const renderCustomPieLabel = ({ cx, cy, midAngle, outerRadius, percent, index, name }) => {
    const RADIAN = Math.PI / 180;
    
    // Calculate the outer point where the connector starts from the pie
    const outerPoint = {
      x: cx + (outerRadius) * Math.cos(-midAngle * RADIAN),
      y: cy + (outerRadius) * Math.sin(-midAngle * RADIAN)
    };
    
    // Create initial straight line segment
    const straightLength = 20; // Length of first straight segment
    const straightPoint = {
      x: cx + (outerRadius + straightLength) * Math.cos(-midAngle * RADIAN),
      y: cy + (outerRadius + straightLength) * Math.sin(-midAngle * RADIAN)
    };
    
    // Determine if the label should be on the right or left half
    const isRightSide = straightPoint.x >= cx;
    
    // Horizontal segment length
    const horizontalLength = 30; // Longer horizontal segment
    
    // Set end point for horizontal segment
    const horizontalPoint = {
      x: straightPoint.x + (isRightSide ? horizontalLength : -horizontalLength),
      y: straightPoint.y
    };
    
    // Add vertical offset for small slices to prevent overlap
    let verticalOffset = 0;
    if (percent < 0.05) { // For very small slices
      // Stagger small slices vertically based on their index
      verticalOffset = (index % 3 - 1) * 20;
    }
    
    // Final label position
    const labelPoint = {
      x: horizontalPoint.x + (isRightSide ? 5 : -5), // Small horizontal nudge
      y: horizontalPoint.y + verticalOffset // Apply vertical offset
    };
    
    // Create path for the multi-segment connector
    const path = `
      M${outerPoint.x},${outerPoint.y}
      L${straightPoint.x},${straightPoint.y}
      L${horizontalPoint.x},${horizontalPoint.y}
      L${labelPoint.x},${labelPoint.y}
    `;
    
    // Text anchor based on which side of the chart
    const textAnchor = isRightSide ? 'start' : 'end';
    
    return (
      <g>
        <path 
          d={path} 
          stroke="#666" 
          strokeWidth={1} 
          fill="none" 
        />
        <text 
          x={labelPoint.x}
          y={labelPoint.y}
          dy={5} // Vertical alignment
          fill="#333"
          textAnchor={textAnchor}
          fontSize={12}
          fontWeight="600"
        >
          {`${departmentStructureData[index].name} ${(percent * 100).toFixed(0)}%`}
        </text>
      </g>
    );
  };

  // Custom tooltip for the bar chart with enhanced styling
  const CustomBarTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="hr-custom-tooltip" style={{ 
          backgroundColor: 'white', 
          padding: '12px 15px', 
          border: '1px solid #e0e0e0',
          borderRadius: '6px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}>
          <p style={{ margin: '0 0 5px', fontWeight: 'bold', color: '#333' }}>{data.name}</p>
          <p style={{ margin: '0', color: '#00a9ac', fontWeight: '500' }}>
            <strong>Employees:</strong> {data.value}
          </p>
          {data.id && (
            <p style={{ 
              margin: '5px 0 0', 
              fontSize: '0.9em', 
              color: '#687C7B',
              borderTop: '1px dashed #eee', 
              paddingTop: '5px' 
            }}>
              ID: {data.id}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="hr-report-container">
      {/* Metrics Cards - Enhanced with better visuals */}
      <div className="hr-report-summary-cards">
        <div className="hr-report-summary-card" style={{
          boxShadow: '0 4px 12px rgba(0,169,172,0.08)',
          borderLeft: '4px solid #00a9ac'
        }}>
          <h3>Total Departments</h3>
          <div className="hr-report-value">{totalDepartments}</div>
          <div className="hr-metric-trend">
            <i className="fas fa-arrow-up hr-trend-up"></i>
            <span>Active departments</span>
          </div>
        </div>
        
        <div className="hr-report-summary-card" style={{
          boxShadow: '0 4px 12px rgba(0,169,172,0.08)',
          borderLeft: '4px solid #66bc6d'
        }}>
          <h3>Total Department Superiors</h3>
          <div className="hr-report-value">{totalSuperiors}</div>
          <div className="hr-metric-trend">
            <i className="fas fa-arrow-right" style={{ color: '#687C7B' }}></i>
            <span>Assigned superiors</span>
          </div>
        </div>
        
        <div className="hr-report-summary-card" style={{
          boxShadow: '0 4px 12px rgba(0,169,172,0.08)',
          borderLeft: '4px solid #8884d8'
        }}>
          <h3>Avg. Staff per Department</h3>
          <div className="hr-report-value">{avgEmployeesPerDept.toFixed(1)}</div>
          <div className="hr-metric-trend">
            <i className="fas fa-users" style={{ color: '#00a9ac', marginRight: '4px' }}></i>
            <span>Employees per dept</span>
          </div>
        </div>
        
        <div className="hr-report-summary-card" style={{
          boxShadow: '0 4px 12px rgba(0,169,172,0.08)',
          borderLeft: '4px solid #ff8042'
        }}>
          <h3>Largest Department</h3>
          <div className="hr-report-value">
            {departmentSizeData.length > 0 ? 
              Math.max(...departmentSizeData.map(dept => dept.value)) : 
              0}
          </div>
          <div className="hr-metric-trend">
            <i className="fas fa-users" style={{ color: '#ff8042', marginRight: '4px' }}></i>
            <span>Maximum employees</span>
          </div>
        </div>
      </div>
      
      {/* Charts Container - Single Column Layout with enhanced styling */}
      <div className="hr-report-charts-single-column">
        {/* Department Structure with optimized layout */}
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
            Department Structure
          </h3>
          
          <div style={{
            height: "450px",
            display: "flex", 
            flexDirection: "row",
            position: "relative"
          }}>
            {departmentStructureData.length > 0 ? (
              <>
                {/* Department legend with improved layout */}
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
                    <i className="fas fa-building" style={{ marginRight: '8px' }}></i>
                    Departments
                  </h4>
                  
                  <div style={{ 
                    display: "flex", 
                    flexDirection: "column", 
                    gap: "10px",
                    maxHeight: "400px",
                    overflowY: "auto"
                  }}>
                    {departmentStructureData.map((dept, index) => (
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
                            {dept.name}
                          </div>
                          <div style={{ 
                            fontSize: "12px", 
                            color: "#687C7B",
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}>
                            <span>{dept.value} employees</span>
                            <span style={{
                              background: COLORS[index % COLORS.length] + '20',
                              color: COLORS[index % COLORS.length],
                              padding: '3px 8px',
                              borderRadius: '12px',
                              fontWeight: '600',
                              fontSize: '11px'
                            }}>
                              {((dept.value / totalEmployees) * 100).toFixed(1)}%
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
                        <Pie
                          data={departmentStructureData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          outerRadius={130}
                          innerRadius={40}
                          paddingAngle={1}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={renderCustomPieLabel}
                          startAngle={90}
                          endAngle={-270}
                        >
                          {departmentStructureData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={COLORS[index % COLORS.length]}
                              stroke="#fff"
                              strokeWidth={2}
                            />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value, name) => [
                            `${value} employees (${((value / totalEmployees) * 100).toFixed(1)}%)`, 
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
                        <text 
                          x="50%" 
                          y="50%" 
                          textAnchor="middle" 
                          dominantBaseline="middle"
                          style={{ fill: "#333", fontSize: "16px", fontWeight: "600" }}
                        >
                          {totalEmployees}
                        </text>
                        <text 
                          x="50%" 
                          y="50%" 
                          dy="20" 
                          textAnchor="middle" 
                          style={{ fill: "#687C7B", fontSize: "12px" }}
                        >
                          employees
                        </text>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* NEW SECTION: Department Metrics Cards */}
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
                    Department Insights
                  </h4>

                  {/* Metric Card: Staffing Ratio */}
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
                      Staff-to-Department Ratio
                    </div>
                    <div style={{ 
                      fontSize: "20px", 
                      fontWeight: "700",
                      color: "#00a9ac",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between"
                    }}>
                      {avgEmployeesPerDept.toFixed(1)}
                      <span style={{ 
                        fontSize: "11px",
                        padding: "3px 8px",
                        backgroundColor: "rgba(0, 169, 172, 0.1)",
                        color: "#00a9ac",
                        borderRadius: "12px" 
                      }}>
                        per department
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
                      Department Distribution
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
                        {departmentStructureData.slice(0, 5).map((dept, idx) => (
                          <div 
                            key={idx} 
                            style={{
                              width: `${(dept.value / totalEmployees) * 100}%`,
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
                      <span>Min: {Math.min(...departmentStructureData.map(d => d.value)) || 0}</span>
                      <span>Max: {Math.max(...departmentStructureData.map(d => d.value)) || 0}</span>
                    </div>
                  </div>

                  {/* Metric Card: Department Growth */}
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
                      Department Coverage
                    </div>
                    <div style={{
                      fontSize: "13px",
                      fontWeight: "500",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      marginBottom: "8px"
                    }}>
                      <span>{superiors?.length || 0} of {totalDepartments}</span>
                      <span style={{ color: "#687C7B" }}>departments with managers</span>
                    </div>
                    <div style={{
                      width: "100%",
                      height: "8px",
                      backgroundColor: "#e9ecef",
                      borderRadius: "4px",
                      overflow: "hidden"
                    }}>
                      <div style={{
                        width: `${totalDepartments > 0 ? (superiors?.length / totalDepartments) * 100 : 0}%`,
                        height: "100%",
                        background: "linear-gradient(90deg, #00a9ac 0%, #66bc6d 100%)"
                      }}/>
                    </div>
                    <div style={{
                      marginTop: "8px",
                      fontSize: "11px",
                      color: "#008a8c",
                      fontWeight: "500",
                      textAlign: "right"
                    }}>
                      {totalDepartments > 0 ? 
                        Math.round((superiors?.length / totalDepartments) * 100) : 0}% coverage
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
                <p style={{ color: "#687C7B", fontSize: "16px" }}>No department data available</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Department Growth Trends - Enhanced with better visuals */}
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
            <i className="fas fa-chart-bar" style={{ marginRight: '10px', color: '#00a9ac' }}></i>
            Department Growth Trends
          </h3>
          
          <div style={{
            height: "400px",
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center"
          }}>
            {departmentStructureData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={departmentStructureData}
                  layout="vertical"
                  margin={{ top: 20, right: 80, left: 40, bottom: 40 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    width={120} 
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip content={<CustomBarTooltip />} />
                  <Legend wrapperStyle={{ paddingTop: 15 }} />
                  <Bar dataKey="value" name="Employees" fill="#00a9ac" barSize={30} radius={[0, 4, 4, 0]}>
                    {departmentStructureData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                    <LabelList dataKey="value" position="right" fill="#333" formatter={(value) => `${value}`} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="hr-empty-chart" style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%'
              }}>
                <div className="hr-empty-chart-icon" style={{ fontSize: "48px", marginBottom: "15px" }}>📈</div>
                <p style={{ color: "#687C7B", fontSize: "16px" }}>No trend data available for {period} period</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Department Leadership Status Section - Enhanced with better visuals */}
      {superiors && superiors.length > 0 && (
        <div className="hr-report-leadership-section" style={{ 
          marginTop: "30px", 
          background: "white", 
          padding: "20px", 
          borderRadius: "12px", 
          border: "1px solid #f0f0f0",
          boxShadow: '0 6px 16px rgba(0,169,172,0.08)'
        }}>
          <h3 style={{ 
            borderBottom: '2px solid #f0f0f0', 
            paddingBottom: '12px',
            fontWeight: '600',
            color: '#333',
            display: 'flex',
            alignItems: 'center'
          }}>
            <i className="fas fa-user-tie" style={{ marginRight: '10px', color: '#00a9ac' }}></i>
            Department Leadership Status
          </h3>
          
          <div className="hr-report-leadership-content" style={{ marginTop: "20px" }}>
            <div className="hr-report-leadership-coverage">
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center",
                marginBottom: "10px" 
              }}>
                <h4 style={{ 
                  fontSize: "14px", 
                  fontWeight: "600", 
                  color: "#333",
                  margin: 0
                }}>
                  Leadership Coverage
                </h4>
                <div className="hr-progress-percentage" style={{ 
                  fontSize: "16px", 
                  fontWeight: "600", 
                  color: "#00a9ac" 
                }}>
                  {totalDepartments > 0 ? 
                    `${Math.round((superiors.length / totalDepartments) * 100)}%` : '0%'}
                </div>
              </div>
              
              <div className="hr-progress-bar" style={{ 
                height: "10px", 
                backgroundColor: "#f0f0f0", 
                borderRadius: "5px", 
                overflow: "hidden", 
                marginBottom: "12px",
                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <div 
                  className="hr-progress-fill"
                  style={{ 
                    width: `${totalDepartments > 0 ? (superiors.length / totalDepartments) * 100 : 0}%`,
                    height: "100%",
                    borderRadius: "5px",
                    background: "linear-gradient(90deg, #00a9ac 0%, #66bc6d 100%)"
                  }}
                />
              </div>
              
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: totalDepartments === superiors.length ? "#e6f7f7" : "#f9f9f9",
                padding: "12px 15px",
                borderRadius: "6px",
                border: `1px solid ${totalDepartments === superiors.length ? "#c5e8e8" : "#eaeaea"}`
              }}>
                <div style={{ 
                  display: "flex", 
                  alignItems: "center" 
                }}>
                  <i 
                    className={totalDepartments === superiors.length ? "fas fa-check-circle" : "fas fa-info-circle"} 
                    style={{ 
                      color: totalDepartments === superiors.length ? "#00a9ac" : "#687C7B", 
                      marginRight: "8px",
                      fontSize: "16px"
                    }}
                  ></i>
                  <p style={{ 
                    margin: "0", 
                    fontSize: "14px", 
                    fontWeight: "500", 
                    color: totalDepartments === superiors.length ? "#00a9ac" : "#687C7B"
                  }}>
                    {superiors.length === totalDepartments ? 
                      "All departments have assigned leaders" : 
                      `${totalDepartments - superiors.length} departments need leadership assignment`
                    }
                  </p>
                </div>
                <i 
                  className="fas fa-arrow-right" 
                  style={{ 
                    color: totalDepartments === superiors.length ? "#00a9ac" : "#687C7B"
                  }}
                ></i>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentSummaryReport;