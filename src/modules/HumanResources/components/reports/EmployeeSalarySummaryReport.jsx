import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';

const EmployeeSalarySummaryReport = ({ salaryData: propsSalaryData }) => {
  const [salaryData, setSalaryData] = useState([]);
  const [employeeTypes, setEmployeeTypes] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


useEffect(() => {
  const fetchData = async () => {
    // If props data is provided, use that
    if (propsSalaryData && propsSalaryData.length > 0) {
      setSalaryData(propsSalaryData);
      setLoading(false);
      return;
    }

    // Otherwise fetch from API
    try {
      const response = await axios.get("https://1wj5891jxg.execute-api.ap-southeast-1.amazonaws.com/dev/api/employee_salary/employee_salary/");
      console.log("Salary API response:", response.data);
      
      // Make sure we're properly handling the API response format
      const salaryRecords = Array.isArray(response.data) ? response.data : 
                           (response.data.results ? response.data.results : []);
      
      console.log(`Found ${salaryRecords.length} salary records`);
      setSalaryData(salaryRecords);
      
      // Fetch employment types for all employees to ensure accurate categorization
      const employeeIds = [...new Set(salaryRecords.map(salary => salary.employee_id))];
      const typesObj = {};
      
      for (const employeeId of employeeIds) {
        try {
          const empRes = await axios.get(`https://1wj5891jxg.execute-api.ap-southeast-1.amazonaws.com/dev/api/employees/${employeeId}/`);
          typesObj[employeeId] = empRes.data.employment_type;
        } catch (err) {
          console.error(`Failed to fetch employment type for ${employeeId}:`, err);
        }
      }
      
      setEmployeeTypes(typesObj);
    } catch (err) {
      console.error("Error fetching salary data:", err);
      if (err.response) {
        console.error("Error details:", err.response.data);
      }
      setError("Failed to load salary data");
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [propsSalaryData]);

  // Show loading state
  if (loading) {
    return (
      <div className="hr-report-container" style={{ textAlign: 'center', padding: '50px 0' }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
        <p style={{ fontSize: '18px', color: '#00a9ac' }}>Loading salary data...</p>
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
  
  // Calculate metrics with proper employment type handling
  const totalEmployees = salaryData.length || 0;
  
  // More accurately calculate salary values based on employment type
  const salaryValues = salaryData.map(e => {
    const empType = employeeTypes[e.employee_id];
    
    // For Regular employees, use base_salary
    if (empType === 'Regular' && e.base_salary) {
      return parseFloat(e.base_salary);
    }
    // For Contractual/Seasonal, calculate from daily_rate
    else if ((empType === 'Contractual' || empType === 'Seasonal') && e.daily_rate) {
      // Contractual typically uses 22 working days
      const workingDays = empType === 'Contractual' ? 22 : 15; // Adjust for Seasonal if needed
      return parseFloat(e.daily_rate) * workingDays;
    }
    // Fallback for unknown types - use whatever is available
    else if (e.base_salary) {
      return parseFloat(e.base_salary);
    } 
    else if (e.daily_rate) {
      return parseFloat(e.daily_rate) * 22;
    }
    return 0;
  }).filter(val => val > 0);
  
  const avgSalary = salaryValues.length > 0 ? 
    salaryValues.reduce((sum, val) => sum + val, 0) / salaryValues.length : 0;
  const minSalary = salaryValues.length > 0 ? Math.min(...salaryValues) : 0;
  const maxSalary = salaryValues.length > 0 ? Math.max(...salaryValues) : 0;
  
  // Salary distribution by bands
  const salaryRanges = [
    { range: '₱0-20K', min: 0, max: 20000, count: 0 },
    { range: '₱20K-40K', min: 20000, max: 40000, count: 0 },
    { range: '₱40K-60K', min: 40000, max: 60000, count: 0 },
    { range: '₱60K-80K', min: 60000, max: 80000, count: 0 },
    { range: '₱80K-100K', min: 80000, max: 100000, count: 0 },
    { range: '₱100K+', min: 100000, max: Infinity, count: 0 }
  ];
  
  // Count employees in each salary range
  salaryValues.forEach(salary => {
    const range = salaryRanges.find(r => salary >= r.min && salary < r.max);
    if (range) range.count++;
  });
  
  // Get department data using employee API info
  const departmentSalaries = {};
  
  salaryData.forEach(item => {
    const empType = employeeTypes[item.employee_id] || 
                  (item.base_salary ? 'Regular' : 
                  (item.daily_rate ? 'Contractual/Seasonal' : 'Unknown'));
    
    // Get department from employee_name if available, or use department_id if we had it
    // For now, extract from employee_name pattern: "Name - Department"
    const nameParts = item.employee_name?.split(' - ');
    const dept = nameParts && nameParts.length > 1 ? nameParts[1] : 'Unassigned';
    
    if (!departmentSalaries[dept]) {
      departmentSalaries[dept] = {
        totalSalary: 0,
        count: 0
      };
    }
    
    // Calculate appropriate salary based on employment type
    let salary = 0;
    if (empType === 'Regular' && item.base_salary) {
      salary = parseFloat(item.base_salary);
    } else if ((empType === 'Contractual' || empType === 'Seasonal') && item.daily_rate) {
      const workingDays = empType === 'Contractual' ? 22 : 15;
      salary = parseFloat(item.daily_rate) * workingDays;
    } else if (item.base_salary) {
      salary = parseFloat(item.base_salary);
    } else if (item.daily_rate) {
      salary = parseFloat(item.daily_rate) * 22;
    }
    
    if (salary > 0) {
      departmentSalaries[dept].totalSalary += salary;
      departmentSalaries[dept].count += 1;
    }
  });
  
  const departmentChartData = Object.entries(departmentSalaries)
    .map(([name, data]) => ({
      name,
      avgSalary: data.count > 0 ? Math.round(data.totalSalary / data.count) : 0
    }))
    .filter(item => item.avgSalary > 0)
    .sort((a, b) => b.avgSalary - a.avgSalary)
    .slice(0, 8); // Top 8 departments
  
  // Employment type salary comparison using accurate employment types
  const employmentTypeData = {};
  
  salaryData.forEach(item => {
    // Get employment type from our cached types or infer as fallback
    const empType = employeeTypes[item.employee_id] || 
                  (item.base_salary ? 'Regular' : 
                  (item.daily_rate ? 'Contractual/Seasonal' : 'Unknown'));
    
    if (!employmentTypeData[empType]) {
      employmentTypeData[empType] = {
        totalSalary: 0,
        count: 0
      };
    }
    
    // Calculate appropriate salary based on employment type
    let salary = 0;
    if (empType === 'Regular' && item.base_salary) {
      salary = parseFloat(item.base_salary);
    } else if ((empType === 'Contractual' || empType === 'Seasonal') && item.daily_rate) {
      const workingDays = empType === 'Contractual' ? 22 : 15;
      salary = parseFloat(item.daily_rate) * workingDays;
    } else if (item.base_salary) {
      salary = parseFloat(item.base_salary);
    } else if (item.daily_rate) {
      salary = parseFloat(item.daily_rate) * 22;
    }
    
    if (salary > 0) {
      employmentTypeData[empType].totalSalary += salary;
      employmentTypeData[empType].count += 1;
    }
  });
  
  const employmentTypeChartData = Object.entries(employmentTypeData)
    .map(([name, data]) => ({
      name,
      avgSalary: data.count > 0 ? Math.round(data.totalSalary / data.count) : 0,
      count: data.count
    }))
    .filter(item => item.avgSalary > 0);
  
  // Enhanced color palette to match other reports
  const COLORS = [
    '#00a9ac', '#66bc6d', '#8884d8', '#ff8042', 
    '#ffc658', '#82ca9d', '#8dd1e1', '#a4de6c'
  ];

  // Gradient definitions for charts
  const GRADIENTS = [
    "salaryGradient1",
    "salaryGradient2",
    "salaryGradient3"
  ];

  // Helper function to render gradient definitions
  const renderGradientDefs = () => (
    <defs>
      <linearGradient id={GRADIENTS[0]} x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#00a9ac" stopOpacity={0.8}/>
        <stop offset="95%" stopColor="#00a9ac" stopOpacity={0.2}/>
      </linearGradient>
      <linearGradient id={GRADIENTS[1]} x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#66bc6d" stopOpacity={0.8}/>
        <stop offset="95%" stopColor="#66bc6d" stopOpacity={0.2}/>
      </linearGradient>
      <linearGradient id={GRADIENTS[2]} x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
        <stop offset="95%" stopColor="#8884d8" stopOpacity={0.2}/>
      </linearGradient>
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
          <h3>Total Salary Records</h3>
          <div className="hr-report-value">{totalEmployees}</div>
          <div className="hr-metric-trend">
            <i className="fas fa-file-invoice-dollar" style={{ color: '#00a9ac', marginRight: '4px' }}></i>
            <span>Active salary entries</span>
          </div>
        </div>
        
        <div className="hr-report-summary-card" style={{
          boxShadow: '0 4px 12px rgba(0,169,172,0.08)',
          borderLeft: '4px solid #66bc6d'
        }}>
          <h3>Average Salary</h3>
          <div className="hr-report-value">₱{avgSalary.toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
          <div className="hr-metric-trend">
            <i className="fas fa-chart-line" style={{ color: '#66bc6d', marginRight: '4px' }}></i>
            <span>Monthly compensation</span>
          </div>
        </div>
        
        <div className="hr-report-summary-card" style={{
          boxShadow: '0 4px 12px rgba(0,169,172,0.08)',
          borderLeft: '4px solid #8884d8'
        }}>
          <h3>Salary Range</h3>
          <div className="hr-report-value">₱{minSalary.toLocaleString(undefined, {maximumFractionDigits: 0})} - ₱{maxSalary.toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
          <div className="hr-metric-trend">
            <i className="fas fa-exchange-alt" style={{ color: '#8884d8', marginRight: '4px' }}></i>
            <span>Min-max compensation</span>
          </div>
        </div>
      </div>
      
      {/* Charts Container - Single Column Layout with enhanced styling */}
      <div className="hr-report-charts-single-column">
        {/* Salary Distribution Section */}
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
            <i className="fas fa-chart-bar" style={{ marginRight: '10px', color: '#00a9ac' }}></i>
            Salary Distribution
          </h3>
          
          <div style={{
            height: "350px",
            display: "flex", 
            flexDirection: "row",
            position: "relative"
          }}>
            {salaryValues.length > 0 ? (
              <>
                {/* Salary Range breakdown with improved layout */}
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
                    <i className="fas fa-dollar-sign" style={{ marginRight: '8px' }}></i>
                    Salary Range Breakdown
                  </h4>
                  
                  <div style={{ 
                    display: "flex", 
                    flexDirection: "column", 
                    gap: "10px",
                    maxHeight: "400px",
                    overflowY: "auto"
                  }}>
                    {salaryRanges.map((range, index) => range.count > 0 && (
                      <div key={index} style={{ 
                        display: "flex", 
                        alignItems: "center",
                        padding: "10px",
                        borderRadius: "8px",
                        background: index % 2 === 0 ? "#f9fafb" : "white",
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                      }}>
                        <div style={{ 
                          width: "12px", 
                          height: "12px",
                          borderRadius: "50%",
                          backgroundColor: COLORS[index % COLORS.length],
                          marginRight: "10px",
                          flexShrink: 0,
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ 
                            fontSize: "13px", 
                            fontWeight: "600",
                            marginBottom: "4px"
                          }}>
                            {range.range}
                          </div>
                          <div style={{ 
                            fontSize: "12px", 
                            color: "#687C7B",
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}>
                            <span>{range.count} employees</span>
                            <span style={{
                              background: COLORS[index % COLORS.length] + '20',
                              color: COLORS[index % COLORS.length],
                              padding: '3px 8px',
                              borderRadius: '12px',
                              fontWeight: '600',
                              fontSize: '11px'
                            }}>
                              {((range.count / salaryValues.length) * 100).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Salary Distribution Chart */}
                <div style={{ width: "70%", position: 'relative' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={salaryRanges.filter(r => r.count > 0)}>
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
                        fill={`url(#${GRADIENTS[0]})`}
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
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
                <p style={{ color: "#687C7B", fontSize: "16px" }}>No salary data available</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Department & Employment Type Analysis Section */}
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
            Salary Analysis
          </h3>
          
          <div style={{ display: "flex", flexDirection: "row", gap: "30px" }}>
            {/* Department Salary Chart */}
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
                Average Salary by Department
              </h4>
              
              <div style={{ height: '350px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    layout="vertical"
                    data={departmentChartData}
                  >
                    {renderGradientDefs()}
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={120} />
                    <Tooltip 
                      formatter={(value) => [`₱${value.toLocaleString(undefined, {maximumFractionDigits: 0})}`, 'Average Salary']}
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
                      dataKey="avgSalary" 
                      name="Average Salary" 
                      fill={`url(#${GRADIENTS[1]})`}
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Employment Type Analysis */}
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
                Salary by Employment Type
              </h4>
              
              <div style={{ height: '350px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    {renderGradientDefs()}
                    <Pie
                      data={employmentTypeChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={130}
                      innerRadius={60}
                      paddingAngle={2}
                      dataKey="count"
                      nameKey="name"
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(1)}%`}
                    >
                      {employmentTypeChartData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[index % COLORS.length]} 
                          stroke="#fff"
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value, name, props) => {
                        const entry = props.payload;
                        return [`${value} employees (Avg: ₱${entry.avgSalary.toLocaleString()})`, entry.name];
                      }}
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
              }}>Salary Distribution Insights</h4>
              <p style={{ 
                fontSize: '13px', 
                margin: '0 0 5px 0',
                color: '#555'
              }}>
                <strong>Highest paying department:</strong> {
                  departmentChartData.length > 0 ? `${departmentChartData[0].name} (₱${departmentChartData[0].avgSalary.toLocaleString()})` : 'N/A'
                }
              </p>
              <p style={{ 
                fontSize: '13px', 
                margin: '0 0 5px 0',
                color: '#555'
              }}>
                <strong>Most common salary range:</strong> {
                  (() => {
                    const mostCommon = [...salaryRanges].sort((a, b) => b.count - a.count)[0];
                    return mostCommon && mostCommon.count > 0 ? 
                      `${mostCommon.range} (${mostCommon.count} employees)` : 
                      'N/A';
                  })()
                }
              </p>
              <p style={{ 
                fontSize: '13px', 
                margin: '0',
                color: '#555'
              }}>
                <strong>Regular vs Non-Regular ratio:</strong> {
                  (() => {
                    const regularCount = employmentTypeChartData.find(t => t.name === 'Regular')?.count || 0;
                    const total = employmentTypeChartData.reduce((sum, t) => sum + t.count, 0);
                    return total > 0 ? `${((regularCount / total) * 100).toFixed(1)}% regular employees` : 'N/A';
                  })()
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
              Export Salary Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeSalarySummaryReport;