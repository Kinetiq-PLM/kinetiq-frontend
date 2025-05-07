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

  // Enhanced gradient color palette - replace the existing COLORS array
  const COLORS = [
    '#00a8a8', '#66bc6d', '#8884d8', '#ff8042', 
    '#ffc658', '#82ca9d', '#8dd1e1', '#a4de6c',
    '#d0ed57', '#97e3d5', '#f5a623', '#f78da7'
  ];
  
  // Define gradient IDs for each color
  const GRADIENTS = COLORS.map((color, index) => `departmentGradient-${index}`);
  
  // Helper function to create lighter/darker shade of a color
  const createShade = (hexColor, percent) => {
    const num = parseInt(hexColor.slice(1), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    
    return `#${(1 << 24 | (R < 255 ? (R < 0 ? 0 : R) : 255) << 16 | (G < 255 ? (G < 0 ? 0 : G) : 255) << 8 | (B < 255 ? (B < 0 ? 0 : B) : 255)).toString(16).slice(1)}`;
  };
  
  // Then in your render, before your charts, add the SVG gradient definitions:
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
    
    // Create path with conditional logic based on department name
    const path = (name === "Purchasing") 
        ? `
          M311.6999970927677,95.58319302160913
          L309.8076889531935,75.67291502493362
          L339.8076889531935,75.67291502493362
        `
        : ["Support & Services", "Distribution", "Report Generator", "MRP", "Management"].includes(name)
        ? `
          M${outerPoint.x},${outerPoint.y}
          L${straightPoint.x},${straightPoint.y}
          L${horizontalPoint.x},${horizontalPoint.y}
        `
        : `
          M${outerPoint.x},${outerPoint.y}
          L${straightPoint.x},${straightPoint.y}
          L${horizontalPoint.x},${horizontalPoint.y}
          L${labelPoint.x},${labelPoint.y}
        `;
        
    // Text anchor based on which side of the chart
    const textAnchor = (name === "Support & Services" || name === "Distribution" || name === "Report Generator" || name === "MRP" || name === "Management" || name === "Purchasing") ? 'end' : (isRightSide ? 'start' : 'end');

    // Fixed position for specific labels, dynamic for others
    let labelX = labelPoint.x;
    let labelY = labelPoint.y;

    if (name === "Support & Services") {
      labelX = 145.2231257441751;
      labelY = 244.11652914800334;
    } else if (name === "Distribution") {
      labelX = 145.92130545571004;
      labelY = 200.06884411360636;
    } else if (name === "Report Generator") {
      labelX = 179.04279268613877;
      labelY = 128.6421228617093;
    } else if (name === "MRP") {
      labelX = 253.81723175730775;
      labelY = 78.39140226099033;
    } else if (name === "Management") {
      labelX = 204.45047303414822;
      labelY = 103.30779248080648;
    } else if (name === "Purchasing") {
      labelX = 429.8076889531935;
      labelY = 73.672915024933616;
    }
        
    return (
      <g>
        <path 
          d={path} 
          stroke="#666" 
          strokeWidth={1} 
          fill="none" 
        />
        <text 
          x={labelX}
          y={labelY}
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
                        {renderGradientDefs()}
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
                              fill={`url(#pieGradient-${index % COLORS.length})`}
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
                    {/* Calculate unique departments with superiors */}
                    {(() => {
                      // Get unique departments that have superiors
                      const departmentsWithSuperiors = new Set(superiors.map(sup => sup.dept_id)).size;
                      const coveragePercent = totalDepartments > 0 ? 
                        Math.min(100, Math.round((departmentsWithSuperiors / totalDepartments) * 100)) : 0;
                        
                      return (
                        <>
                          <div style={{
                            fontSize: "13px",
                            fontWeight: "500",
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                            marginBottom: "8px"
                          }}>
                            <span>{departmentsWithSuperiors} of {totalDepartments}</span>
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
                              width: `${coveragePercent}%`,
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
                            {coveragePercent}% coverage
                          </div>
                        </>
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

        {/* Department Superiors Section with enhanced styling matching Department Structure */}
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
            <i className="fas fa-user-tie" style={{ marginRight: '10px', color: '#00a9ac' }}></i>
            Department Leadership
          </h3>
          
          <div style={{
            height: "450px",
            display: "flex", 
            flexDirection: "row",
            position: "relative"
          }}>
            {superiors && superiors.length > 0 ? (
              <>
                {/* Department superiors list - styled like department list */}
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
                    <i className="fas fa-users-cog" style={{ marginRight: '8px' }}></i>
                    Department Superiors
                  </h4>
                  
                  <div style={{ 
                    display: "flex", 
                    flexDirection: "column", 
                    gap: "10px",
                    maxHeight: "400px",
                    overflowY: "auto"
                  }}>
                    {superiors.map((superior, index) => (
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
                            {superior.superior_name || 'Unassigned'}
                          </div>
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}>
                            <span style={{ 
                              fontSize: "12px", 
                              color: "#687C7B"
                            }}>
                              {superior.dept_name}
                            </span>
                            <span style={{
                              background: COLORS[index % COLORS.length] + '20',
                              color: COLORS[index % COLORS.length],
                              padding: '3px 8px',
                              borderRadius: '12px',
                              fontWeight: '600',
                              fontSize: '11px'
                            }}>
                              Level {superior.hierarchy_level}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Middle section - Hierarchy visualization with improved styling */}
                <div style={{ width: "40%", position: 'relative' }}>
                  <div style={{ position: 'absolute', top: 0, right: 0, left: 0, bottom: 0 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart margin={{ top: 10, right: 30, bottom: 10, left: 30 }}> 
                        {renderGradientDefs()}
                        <Pie
                          data={superiors.reduce((acc, sup) => {
                            const level = sup.hierarchy_level || 1;
                            const existingLevel = acc.find(item => item.level === level);
                            if (existingLevel) {
                              existingLevel.value += 1;
                            } else {
                              acc.push({ 
                                level, 
                                name: `Level ${level}`, 
                                value: 1,
                                departmentCount: 1
                              });
                            }
                            return acc;
                          }, []).sort((a, b) => a.level - b.level)}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          outerRadius={130}
                          innerRadius={40}
                          paddingAngle={2}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          startAngle={90}
                          endAngle={-270}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {superiors.reduce((acc, sup) => {
                            const level = sup.hierarchy_level || 1;
                            if (!acc.some(item => item.level === level)) {
                              acc.push({ level });
                            }
                            return acc;
                          }, []).sort((a, b) => a.level - b.level).map((entry, index) => (
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
                            `${value} superiors (${((value / superiors.length) * 100).toFixed(1)}%)`, 
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

                {/* Right section - Insights cards with matching styling */}
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
                    <i className="fas fa-chart-line" style={{ marginRight: '8px' }}></i>
                    Leadership Insights
                  </h4>

                  {/* Metric Card: Leadership Coverage */}
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
                      Leadership Coverage
                    </div>
                    <div style={{ 
                      fontSize: "20px", 
                      fontWeight: "700",
                      color: "#00a9ac",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between"
                    }}>
                       {(() => {
                      // Get unique departments that have superiors
                      const departmentsWithSuperiors = new Set(superiors.map(sup => sup.dept_id)).size;
                      const coveragePercent = totalDepartments > 0 ? 
                        Math.min(100, Math.round((departmentsWithSuperiors / totalDepartments) * 100)) : 0;
                      return coveragePercent;
                    })()}%
                      <span style={{ 
                        fontSize: "11px",
                        padding: "3px 8px",
                        backgroundColor: "rgba(0, 169, 172, 0.1)",
                        color: "#00a9ac",
                        borderRadius: "12px" 
                      }}>
                        coverage rate
                      </span>
                    </div>
                  </div>

                  {/* Metric Card: Department Distribution */}
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
                      Hierarchy Distribution
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
                        {[1, 2, 3, 4, 5].map(level => {
                          const count = superiors.filter(s => s.hierarchy_level === level).length;
                          if (count === 0) return null;
                          return (
                            <div 
                              key={level} 
                              style={{
                                width: `${(count / superiors.length) * 100}%`,
                                height: "100%",
                                backgroundColor: COLORS[(level - 1) % COLORS.length]
                              }}
                            />
                          );
                        })}
                      </div>
                    </div>
                    <div style={{
                      marginTop: "8px",
                      fontSize: "11px",
                      color: "#687C7B",
                      display: "flex",
                      justifyContent: "space-between"
                    }}>
                      {[1, 2, 3, 4, 5].filter(level => superiors.some(s => s.hierarchy_level === level)).map(level => {
                        const count = superiors.filter(s => s.hierarchy_level === level).length;
                        return (
                          <span key={level} style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "5px"
                          }}>
                            <span style={{
                              width: "8px",
                              height: "8px",
                              borderRadius: "2px",
                              backgroundColor: COLORS[(level - 1) % COLORS.length]
                            }}></span>
                            <span>L{level}</span>
                          </span>
                        );
                      })}
                    </div>
                  </div>

                    {/* Metric Card: Hierarchy Distribution */}
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
                        Superior Hierarchy Levels
                      </div>
                      <div style={{ 
                        fontSize: "20px", 
                        fontWeight: "700",
                        color: "#00a9ac",
                        marginBottom: "5px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between"
                      }}>
                        {superiors.filter(s => s.hierarchy_level === 1).length}
                        <span style={{ 
                          fontSize: "11px",
                          padding: "3px 8px",
                          backgroundColor: "rgba(0, 169, 172, 0.1)",
                          color: "#00a9ac",
                          borderRadius: "12px" 
                        }}>
                          top level managers
                        </span>
                      </div>
                      <div style={{
                        marginTop: "8px",
                        fontSize: "12px",
                        color: "#687C7B",
                        display: "flex",
                        justifyContent: "space-between"
                      }}>
                        <span>Total superiors: {superiors.length}</span>
                        <span>Levels: {[...new Set(superiors.map(s => s.hierarchy_level))].length}</span>
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
                    <i className="fas fa-user-plus" style={{ fontSize: "11px" }}></i>
                    Manage Department Leaders
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
                <div className="hr-empty-chart-icon" style={{ fontSize: "48px", marginBottom: "15px" }}>👥</div>
                <p style={{ color: "#687C7B", fontSize: "16px" }}>No department superiors data available</p>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default DepartmentSummaryReport;