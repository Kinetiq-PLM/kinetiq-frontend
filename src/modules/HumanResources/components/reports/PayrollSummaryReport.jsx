import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Treemap, ComposedChart, Scatter
} from 'recharts';

const PayrollSummaryReport = ({ payroll: propPayroll = [] }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [payroll, setPayroll] = useState(propPayroll);
  
  // Fetch data if not provided through props
  useEffect(() => {
    const fetchData = async () => {
      // If we already have sufficient data from props, use it
      if (propPayroll.length > 0) {
        setPayroll(propPayroll);
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching payroll data directly...");
        const response = await axios.get("http://127.0.0.1:8000///api/payroll/payrolls/");
        setPayroll(response.data || []);
      } catch (err) {
        console.error("Error fetching payroll data:", err);
        setError("Failed to load payroll data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [propPayroll]);

  // Show loading state
  if (loading) {
    return (
      <div className="hr-report-container" style={{ textAlign: 'center', padding: '50px 0' }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
        <p style={{ fontSize: '18px', color: '#687C7B' }}>Loading payroll data...</p>
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
  const totalEmployeesPaid = new Set(payroll.map(p => p.employee_id)).size;
  const totalSalary = payroll.reduce((sum, p) => sum + parseFloat(p.base_salary || 0), 0);
  const totalDeductions = payroll.reduce((sum, p) => sum + parseFloat(p.total_deductions || 0), 0);
  const totalNetPay = payroll.reduce((sum, p) => sum + parseFloat(p.net_pay || 0), 0);
  const totalGrossPay = payroll.reduce((sum, p) => sum + parseFloat(p.gross_pay || 0), 0);
  
  // Calculate average values
  const avgSalary = totalEmployeesPaid > 0 ? (totalSalary / totalEmployeesPaid) : 0;
  const avgNetPay = totalEmployeesPaid > 0 ? (totalNetPay / totalEmployeesPaid) : 0;
  const avgDeduction = totalEmployeesPaid > 0 ? (totalDeductions / totalEmployeesPaid) : 0;
  
  // Overall Compensation Breakdown
  const compensationComponents = {
    'Base Salary': totalSalary,
    'Overtime Pay': payroll.reduce((sum, p) => sum + parseFloat(p.overtime_pay || 0), 0),
    'Holiday Pay': payroll.reduce((sum, p) => sum + parseFloat(p.holiday_pay || 0), 0),
    'Bonus Pay': payroll.reduce((sum, p) => sum + parseFloat(p.bonus_pay || 0), 0),
    '13th Month Pay': payroll.reduce((sum, p) => sum + parseFloat(p.thirteenth_month_pay || 0), 0)
  };
  
  const compensationChartData = Object.entries(compensationComponents)
    .map(([name, value]) => ({ name, value }))
    .filter(item => item.value > 0);
  
  // Deduction breakdown
  const deductionComponents = {
    'SSS': payroll.reduce((sum, p) => sum + parseFloat(p.sss_contribution || 0), 0),
    'PhilHealth': payroll.reduce((sum, p) => sum + parseFloat(p.philhealth_contribution || 0), 0),
    'Pag-IBIG': payroll.reduce((sum, p) => sum + parseFloat(p.pagibig_contribution || 0), 0),
    'Tax': payroll.reduce((sum, p) => sum + parseFloat(p.tax || 0), 0),
    'Late Deduction': payroll.reduce((sum, p) => sum + parseFloat(p.late_deduction || 0), 0),
    'Absent Deduction': payroll.reduce((sum, p) => sum + parseFloat(p.absent_deduction || 0), 0),
    'Undertime Deduction': payroll.reduce((sum, p) => sum + parseFloat(p.undertime_deduction || 0), 0)
  };
  
  const deductionChartData = Object.entries(deductionComponents)
    .map(([name, value]) => ({ name, value }))
    .filter(item => item.value > 0);
  
  // Employment Type Distribution
  const employmentTypeData = payroll.reduce((acc, p) => {
    const type = p.employment_type || 'Regular';
    if (!acc[type]) acc[type] = { count: 0, totalSalary: 0, totalNet: 0 };
    acc[type].count++;
    acc[type].totalSalary += parseFloat(p.base_salary || 0);
    acc[type].totalNet += parseFloat(p.net_pay || 0);
    return acc;
  }, {});
  
  const employmentTypeChartData = Object.entries(employmentTypeData)
    .map(([name, data]) => ({
      name,
      count: data.count,
      avgSalary: data.count > 0 ? (data.totalSalary / data.count) : 0,
      avgNetPay: data.count > 0 ? (data.totalNet / data.count) : 0
    }))
    .sort((a, b) => b.count - a.count);

  // Status Distribution
  const statusData = payroll.reduce((acc, p) => {
    const status = p.status || 'Pending';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});
  
  const statusChartData = Object.entries(statusData)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
  
  // Monthly payroll trend
  const monthlyData = payroll.reduce((acc, p) => {
    // Extract month-year from period end
    const date = new Date(p.pay_period_end || p.created_at);
    const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
    
    if (!acc[monthYear]) {
      acc[monthYear] = { 
        month: monthYear, 
        salary: 0,
        overtime: 0,
        benefits: 0,
        deductions: 0,
        netPay: 0,
        employees: new Set()
      };
    }
    
    acc[monthYear].salary += parseFloat(p.base_salary || 0);
    acc[monthYear].overtime += parseFloat(p.overtime_pay || 0);
    acc[monthYear].benefits += (
      parseFloat(p.holiday_pay || 0) + 
      parseFloat(p.bonus_pay || 0) + 
      parseFloat(p.thirteenth_month_pay || 0)
    );
    acc[monthYear].deductions += parseFloat(p.total_deductions || 0);
    acc[monthYear].netPay += parseFloat(p.net_pay || 0);
    acc[monthYear].employees.add(p.employee_id);
    
    return acc;
  }, {});
  
  const monthlyChartData = Object.entries(monthlyData)
    .map(([_, data]) => ({
      ...data,
      employeeCount: data.employees.size,
      total: data.salary + data.overtime + data.benefits
    }))
    .sort((a, b) => {
      const dateA = new Date(a.month);
      const dateB = new Date(b.month);
      return dateA - dateB;
    })
    .slice(-6); // Last 6 months
  
  // Overtime Analysis
  const overtimeData = payroll.reduce((acc, p) => {
    if (parseFloat(p.overtime_hours || 0) > 0) {
      acc.totalHours += parseFloat(p.overtime_hours || 0);
      acc.totalPay += parseFloat(p.overtime_pay || 0);
      acc.count++;
    }
    return acc;
  }, { totalHours: 0, totalPay: 0, count: 0 });
  
  const avgOvertimeHours = overtimeData.count > 0 ? overtimeData.totalHours / overtimeData.count : 0;
  const avgOvertimePay = overtimeData.count > 0 ? overtimeData.totalPay / overtimeData.count : 0;
  const overtimePercentage = totalGrossPay > 0 ? (overtimeData.totalPay / totalGrossPay) * 100 : 0;
  
  // Attendance Penalty Analysis
  const attendancePenalties = {
    'Late': payroll.reduce((sum, p) => sum + parseFloat(p.late_deduction || 0), 0),
    'Absent': payroll.reduce((sum, p) => sum + parseFloat(p.absent_deduction || 0), 0),
    'Undertime': payroll.reduce((sum, p) => sum + parseFloat(p.undertime_deduction || 0), 0)
  };
  
  const totalAttendancePenalties = Object.values(attendancePenalties).reduce((a, b) => a + b, 0);
  
  const attendancePenaltyData = Object.entries(attendancePenalties)
    .map(([name, value]) => ({ name, value }))
    .filter(item => item.value > 0);
  
  // Payroll Cost Structure
  const payrollCostStructureData = [
    { name: 'Base Salary', value: totalSalary },
    { name: 'Variable Pay', value: totalGrossPay - totalSalary },
    { name: 'Benefits Contributions', value: 
      payroll.reduce((sum, p) => sum + 
        parseFloat(p.sss_contribution || 0) + 
        parseFloat(p.philhealth_contribution || 0) + 
        parseFloat(p.pagibig_contribution || 0), 0) 
    },
    { name: 'Tax', value: payroll.reduce((sum, p) => sum + parseFloat(p.tax || 0), 0) }
  ].filter(item => item.value > 0);
  
  // Enhanced color palette
  const COLORS = [
    '#00a9ac', '#66bc6d', '#8884d8', '#ff8042', 
    '#ffc658', '#82ca9d', '#8dd1e1', '#a4de6c',
    '#d0ed57', '#97e3d5', '#f5a623', '#f78da7'
  ];
  
  // Define gradient IDs for each color
  const GRADIENTS = COLORS.map((color, index) => `payrollGradient-${index}`);
  
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
          id={`piePayrollGradient-${index}`} 
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
          <h3>Total Employees Paid</h3>
          <div className="hr-report-value">{totalEmployeesPaid}</div>
          <div className="hr-metric-trend">
            <i className="fas fa-users" style={{ color: '#00a9ac', marginRight: '4px' }}></i>
            <span>Received payroll</span>
          </div>
        </div>
        
        <div className="hr-report-summary-card" style={{
          boxShadow: '0 4px 12px rgba(0,169,172,0.08)',
          borderLeft: '4px solid #66bc6d'
        }}>
          <h3>Total Net Pay</h3>
          <div className="hr-report-value">₱{totalNetPay.toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
          <div className="hr-metric-trend">
            <i className="fas fa-money-bill-wave" style={{ color: '#66bc6d', marginRight: '4px' }}></i>
            <span>Total disbursed</span>
          </div>
        </div>
        
        <div className="hr-report-summary-card" style={{
          boxShadow: '0 4px 12px rgba(0,169,172,0.08)',
          borderLeft: '4px solid #8884d8'
        }}>
          <h3>Average Salary</h3>
          <div className="hr-report-value">₱{avgSalary.toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
          <div className="hr-metric-trend">
            <i className="fas fa-chart-line" style={{ color: '#8884d8', marginRight: '4px' }}></i>
            <span>Base compensation</span>
          </div>
        </div>
        
        <div className="hr-report-summary-card" style={{
          boxShadow: '0 4px 12px rgba(0,169,172,0.08)',
          borderLeft: '4px solid #ff8042'
        }}>
          <h3>Total Deductions</h3>
          <div className="hr-report-value">₱{totalDeductions.toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
          <div className="hr-metric-trend">
            <i className="fas fa-percentage" style={{ color: '#ff8042', marginRight: '4px' }}></i>
            <span>{totalGrossPay > 0 ? ((totalDeductions / totalGrossPay) * 100).toFixed(1) : 0}% of gross pay</span>
          </div>
        </div>
      </div>
      
      {/* Charts Container - Single Column Layout with enhanced styling */}
      <div className="hr-report-charts-single-column">
        {/* Payroll Structure Section */}
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
            Payroll Composition
          </h3>
          
          <div style={{
            height: "450px",
            display: "flex", 
            flexDirection: "row",
            position: "relative"
          }}>
            {payroll.length > 0 ? (
              <>
                {/* Compensation Components legend with improved layout */}
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
                    <i className="fas fa-money-check-alt" style={{ marginRight: '8px' }}></i>
                    Pay Components
                  </h4>
                  
                  <div style={{ 
                    display: "flex", 
                    flexDirection: "column", 
                    gap: "10px",
                    maxHeight: "400px",
                    overflowY: "auto"
                  }}>
                    {compensationChartData.map((comp, index) => (
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
                            {comp.name}
                          </div>
                          <div style={{ 
                            fontSize: "12px", 
                            color: "#687C7B",
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}>
                            <span>₱{comp.value.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                            <span style={{
                              background: COLORS[index % COLORS.length] + '20',
                              color: COLORS[index % COLORS.length],
                              padding: '3px 8px',
                              borderRadius: '12px',
                              fontWeight: '600',
                              fontSize: '11px'
                            }}>
                              {totalGrossPay > 0 ? ((comp.value / totalGrossPay) * 100).toFixed(1) : 0}%
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Compensation pie chart with enhanced visuals */}
                <div style={{ width: "40%", position: 'relative' }}>
                  <div style={{ position: 'absolute', top: 0, right: 0, left: 0, bottom: 0 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        {renderGradientDefs()}
                        <Pie
                          data={compensationChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={130}
                          innerRadius={60}
                          paddingAngle={2}
                          dataKey="value"
                          label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {compensationChartData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={`url(#piePayrollGradient-${index % COLORS.length})`}
                              stroke="#fff"
                              strokeWidth={2}
                            />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value) => [`₱${value.toLocaleString(undefined, {maximumFractionDigits: 0})}`, '']}
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

                {/* Payroll Metrics and insights panel */}
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
                    Payroll Insights
                  </h4>

                  {/* Metric Card: Take-Home Pay Ratio */}
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
                      Take-Home Pay Ratio
                    </div>
                    <div style={{ 
                      fontSize: "20px", 
                      fontWeight: "700",
                      color: "#00a9ac",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between"
                    }}>
                      {totalGrossPay > 0 ? ((totalNetPay / totalGrossPay) * 100).toFixed(1) : 0}%
                      <span style={{ 
                        fontSize: "11px",
                        padding: "3px 8px",
                        backgroundColor: "rgba(0, 169, 172, 0.1)",
                        color: "#00a9ac",
                        borderRadius: "12px" 
                      }}>
                        of gross pay
                      </span>
                    </div>
                  </div>

                  {/* Metric Card: Average Deduction */}
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
                      Deduction Per Employee
                    </div>
                    <div style={{
                      fontSize: "20px", 
                      fontWeight: "700",
                      color: "#00a9ac",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between"
                    }}>
                      ₱{avgDeduction.toLocaleString(undefined, {maximumFractionDigits: 0})}
                      <span style={{ 
                        fontSize: "11px",
                        padding: "3px 8px",
                        backgroundColor: "rgba(0, 169, 172, 0.1)",
                        color: "#00a9ac",
                        borderRadius: "12px" 
                      }}>
                        average
                      </span>
                    </div>
                  </div>

                  {/* Metric Card: Overtime Impact */}
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
                      Overtime Impact
                    </div>
                    <div style={{
                      fontSize: "13px",
                      fontWeight: "500",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      marginBottom: "8px"
                    }}>
                      <span>{overtimeData.count} of {totalEmployeesPaid}</span>
                      <span style={{ color: "#687C7B" }}>employees worked overtime</span>
                    </div>
                    <div style={{
                      width: "100%",
                      height: "8px",
                      backgroundColor: "#e9ecef",
                      borderRadius: "4px",
                      overflow: "hidden"
                    }}>
                      <div style={{
                        width: `${overtimePercentage}%`,
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
                      <span>OT: {overtimePercentage.toFixed(1)}% of total gross</span>
                      <span style={{
                        color: "#008a8c",
                        fontWeight: "500",
                        textAlign: "right"
                      }}>
                        {avgOvertimeHours.toFixed(1)} hrs avg
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
                    <i className="fas fa-download" style={{ fontSize: "11px" }}></i>
                    Export Payroll Report
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
                <p style={{ color: "#687C7B", fontSize: "16px" }}>No payroll data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Deductions and Monthly Trend Section */}
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
            Payroll Analysis
          </h3>
          
          <div style={{ display: "flex", flexDirection: "row", gap: "30px" }}>
            {/* Deduction Breakdown Chart */}
            <div style={{ flex: 1 }}>
              <h4 style={{ 
                marginBottom: "15px", 
                fontSize: "14px", 
                fontWeight: "600",
                color: '#00a9ac',
                display: 'flex',
                alignItems: 'center'
              }}>
                <i className="fas fa-percentage" style={{ marginRight: '8px' }}></i>
                Deduction Breakdown
              </h4>
              
              <div style={{ height: '350px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    {renderGradientDefs()}
                    <Pie
                      data={deductionChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {deductionChartData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={`url(#piePayrollGradient-${(index+3) % COLORS.length})`} 
                          stroke="#fff"
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [`₱${value.toLocaleString(undefined, {maximumFractionDigits: 0})}`, '']}
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
            
            {/* Monthly Trend Composite Chart */}
            <div style={{ flex: 1 }}>
              <h4 style={{ 
                marginBottom: "15px", 
                fontSize: "14px", 
                fontWeight: "600",
                color: '#00a9ac',
                display: 'flex',
                alignItems: 'center'
              }}>
                <i className="fas fa-chart-line" style={{ marginRight: '8px' }}></i>
                Monthly Payroll Trend
              </h4>
              
              <div style={{ height: '350px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={monthlyChartData}>
                    {renderGradientDefs()}
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip 
                      formatter={(value, name) => {
                        if (name === 'Employee Count') return [value, name];
                        return [`₱${value.toLocaleString(undefined, {maximumFractionDigits: 0})}`, name];
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
                      yAxisId="left"
                      type="monotone" 
                      dataKey="total" 
                      stackId="1" 
                      stroke="#00a9ac" 
                      fill={`url(#${GRADIENTS[0]})`} 
                      name="Gross Pay" 
                    />
                    <Area 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="netPay" 
                      stroke="#66bc6d" 
                      fill={`url(#${GRADIENTS[1]})`} 
                      name="Net Pay" 
                    />
                    <Line 
                      yAxisId="right" 
                      type="monotone" 
                      dataKey="employeeCount" 
                      stroke="#ff8042" 
                      name="Employee Count" 
                      strokeWidth={2} 
                      dot={{ fill: '#ff8042', r: 5 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          {/* Additional Charts Section */}
          <div style={{ marginTop: '30px', display: "flex", flexDirection: "row", gap: "30px" }}>
            {/* Employment Type Radar Chart */}
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
                Average Pay by Employment Type
              </h4>
              
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart outerRadius={90} data={employmentTypeChartData}>
                    {renderGradientDefs()}
                    <PolarGrid />
                    <PolarAngleAxis dataKey="name" />
                    <PolarRadiusAxis angle={30} domain={[0, 'auto']} />
                    <Radar 
                      name="Avg Base Salary" 
                      dataKey="avgSalary" 
                      stroke="#8884d8" 
                      fill={`url(#${GRADIENTS[2]})`} 
                      fillOpacity={0.6} 
                    />
                    <Radar 
                      name="Avg Net Pay" 
                      dataKey="avgNetPay" 
                      stroke="#00a9ac" 
                      fill={`url(#${GRADIENTS[0]})`} 
                      fillOpacity={0.6} 
                    />
                    <Legend />
                    <Tooltip 
                      formatter={(value) => [`₱${value.toLocaleString(undefined, {maximumFractionDigits: 0})}`, '']}
                      contentStyle={{
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        border: 'none',
                        padding: '10px 15px'
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Attendance Penalty Chart */}
            <div style={{ flex: 1 }}>
              <h4 style={{ 
                marginBottom: "15px", 
                fontSize: "14px", 
                fontWeight: "600",
                color: '#00a9ac',
                display: 'flex',
                alignItems: 'center'
              }}>
                <i className="fas fa-clock" style={{ marginRight: '8px' }}></i>
                Attendance Penalty Distribution
              </h4>
              
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={attendancePenaltyData}>
                    {renderGradientDefs()}
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`₱${value.toLocaleString(undefined, {maximumFractionDigits: 0})}`, 'Deduction']}
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
                      dataKey="value" 
                      name="Deduction Amount" 
                      radius={[4, 4, 0, 0]}
                    >
                      {attendancePenaltyData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={`url(#${GRADIENTS[(index+4) % COLORS.length]})`}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          {/* New Section: Salary Distribution and Department Analysis */}
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
              Salary Distribution & Department Analysis
            </h3>
            
            <div style={{ display: "flex", flexDirection: "row", gap: "30px" }}>
              {/* Salary Distribution Histogram */}
              <div style={{ flex: 1 }}>
                <h4 style={{ 
                  marginBottom: "15px", 
                  fontSize: "14px", 
                  fontWeight: "600",
                  color: '#00a9ac',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <i className="fas fa-dollar-sign" style={{ marginRight: '8px' }}></i>
                  Salary Distribution
                </h4>
                
                <div style={{ height: '350px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={(() => {
                      // Create salary range buckets
                      const ranges = [
                        { range: "< ₱15K", min: 0, max: 15000, count: 0 },
                        { range: "₱15K-25K", min: 15000, max: 25000, count: 0 },
                        { range: "₱25K-35K", min: 25000, max: 35000, count: 0 },
                        { range: "₱35K-50K", min: 35000, max: 50000, count: 0 },
                        { range: "₱50K-75K", min: 50000, max: 75000, count: 0 },
                        { range: "₱75K-100K", min: 75000, max: 100000, count: 0 },
                        { range: "₱100K+", min: 100000, max: Infinity, count: 0 }
                      ];
                      
                      // Count employees in each salary range
                      payroll.forEach(p => {
                        const salary = parseFloat(p.base_salary || 0);
                        for (let range of ranges) {
                          if (salary >= range.min && salary < range.max) {
                            range.count++;
                            break;
                          }
                        }
                      });
                      
                      return ranges.filter(range => range.count > 0);
                    })()}>
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
                        fill={`url(#${GRADIENTS[5]})`}
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              {/* Department-based Salary Comparison */}
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
                      data={(() => {
                        // Group by department
                        const deptData = payroll.reduce((acc, p) => {
                          const dept = p.department || 'Unspecified';
                          if (!acc[dept]) {
                            acc[dept] = { totalSalary: 0, count: 0 };
                          }
                          acc[dept].totalSalary += parseFloat(p.base_salary || 0);
                          acc[dept].count += 1;
                          return acc;
                        }, {});
                        
                        // Convert to array and sort
                        return Object.entries(deptData)
                          .map(([name, data]) => ({
                            name,
                            avgSalary: data.count > 0 ? data.totalSalary / data.count : 0,
                            employeeCount: data.count
                          }))
                          .sort((a, b) => b.avgSalary - a.avgSalary)
                          .slice(0, 8); // Top 8 departments
                      })()}>
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
            </div>
          </div>

          {/* New Section: Tax Analysis & Payroll Growth */}
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
              <i className="fas fa-receipt" style={{ marginRight: '10px', color: '#00a9ac' }}></i>
              Tax Analysis & Payroll Growth
            </h3>
            
            <div style={{ display: "flex", flexDirection: "row", gap: "30px" }}>
              {/* Tax Burden Analysis */}
              <div style={{ flex: 1 }}>
                <h4 style={{ 
                  marginBottom: "15px", 
                  fontSize: "14px", 
                  fontWeight: "600",
                  color: '#00a9ac',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <i className="fas fa-file-invoice" style={{ marginRight: '8px' }}></i>
                  Tax & Contribution Analysis
                </h4>
                
                <div style={{ height: '350px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      {renderGradientDefs()}
                      <Pie
                        data={[
                          { name: 'Income Tax', value: payroll.reduce((sum, p) => sum + parseFloat(p.tax || 0), 0) },
                          { name: 'SSS', value: payroll.reduce((sum, p) => sum + parseFloat(p.sss_contribution || 0), 0) },
                          { name: 'PhilHealth', value: payroll.reduce((sum, p) => sum + parseFloat(p.philhealth_contribution || 0), 0) },
                          { name: 'Pag-IBIG', value: payroll.reduce((sum, p) => sum + parseFloat(p.pagibig_contribution || 0), 0) }
                        ].filter(item => item.value > 0)}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={120}
                        innerRadius={60}
                        paddingAngle={2}
                        dataKey="value"
                        label={({name, percent}) => `${name}: ${(percent * 100).toFixed(1)}%`}
                      >
                        {[0, 1, 2, 3].map((index) => (
                          <Cell 
                            key={`cell-tax-${index}`} 
                            fill={`url(#piePayrollGradient-${(index+7) % COLORS.length})`} 
                            stroke="#fff"
                            strokeWidth={2}
                          />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [`₱${value.toLocaleString(undefined, {maximumFractionDigits: 0})}`, 'Amount']}
                        contentStyle={{
                          backgroundColor: 'white',
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                          border: 'none',
                          padding: '10px 15px'
                        }}
                      />
                      <Legend layout="vertical" align="right" verticalAlign="middle" />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              {/* Payroll Growth Trend - YoY or QoQ comparison */}
              <div style={{ flex: 1 }}>
                <h4 style={{ 
                  marginBottom: "15px", 
                  fontSize: "14px", 
                  fontWeight: "600",
                  color: '#00a9ac',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <i className="fas fa-chart-line" style={{ marginRight: '8px' }}></i>
                  Payroll Cost Metrics
                </h4>
                
                <div style={{ height: '350px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyChartData}>
                      {renderGradientDefs()}
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip 
                        formatter={(value, name) => {
                          if (name === 'Average Cost/Employee') 
                            return [`₱${value.toLocaleString(undefined, {maximumFractionDigits: 0})}`, name];
                          return [value, name];
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
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey={d => d.employeeCount > 0 ? (d.total / d.employeeCount) : 0}
                        name="Average Cost/Employee"
                        stroke="#8884d8"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey={d => d.total > 0 && d.netPay > 0 ? ((d.total - d.netPay) / d.total) * 100 : 0}
                        name="Deduction Rate (%)"
                        stroke="#ff8042"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* New Section: Overtime & Benefits Analysis */}
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
              <i className="fas fa-clock" style={{ marginRight: '10px', color: '#00a9ac' }}></i>
              Overtime & Benefits Analysis
            </h3>
            
            <div style={{ display: "flex", flexDirection: "row", gap: "30px" }}>
              {/* Overtime Hours Distribution */}
              <div style={{ flex: 1 }}>
                <h4 style={{ 
                  marginBottom: "15px", 
                  fontSize: "14px", 
                  fontWeight: "600",
                  color: '#00a9ac',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <i className="fas fa-user-clock" style={{ marginRight: '8px' }}></i>
                  Overtime Hours Distribution
                </h4>
                
                <div style={{ height: '350px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={(() => {
                      // Create overtime hours range buckets
                      const ranges = [
                        { range: "0 hours", min: 0, max: 0.1, count: 0 },
                        { range: "< 5 hours", min: 0.1, max: 5, count: 0 },
                        { range: "5-10 hours", min: 5, max: 10, count: 0 },
                        { range: "10-20 hours", min: 10, max: 20, count: 0 },
                        { range: "20-40 hours", min: 20, max: 40, count: 0 },
                        { range: "40+ hours", min: 40, max: Infinity, count: 0 }
                      ];
                      
                      // Count employees in each overtime range
                      payroll.forEach(p => {
                        const overtimeHours = parseFloat(p.overtime_hours || 0);
                        for (let range of ranges) {
                          if (overtimeHours >= range.min && overtimeHours < range.max) {
                            range.count++;
                            break;
                          }
                        }
                      });
                      
                      return ranges;
                    })()}>
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
                        fill={`url(#${GRADIENTS[6]})`}
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              {/* Benefits to Base Salary Ratio */}
              <div style={{ flex: 1 }}>
                <h4 style={{ 
                  marginBottom: "15px", 
                  fontSize: "14px", 
                  fontWeight: "600",
                  color: '#00a9ac',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <i className="fas fa-gift" style={{ marginRight: '8px' }}></i>
                  Benefits to Base Salary Ratio
                </h4>
                
                <div style={{ height: '350px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={monthlyChartData}>
                      {renderGradientDefs()}
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis 
                        yAxisId="left" 
                        label={{ value: 'Amount (₱)', angle: -90, position: 'insideLeft' }} 
                      />
                      <YAxis 
                        yAxisId="right" 
                        orientation="right" 
                        label={{ value: 'Ratio (%)', angle: 90, position: 'insideRight' }} 
                      />
                      <Tooltip 
                        formatter={(value, name) => {
                          if (name === 'Benefits Ratio') return [`${value.toFixed(2)}%`, name];
                          return [`₱${value.toLocaleString(undefined, {maximumFractionDigits: 0})}`, name];
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
                      <Bar 
                        yAxisId="left"
                        dataKey="salary" 
                        name="Base Salary" 
                        barSize={20}
                        fill={`url(#${GRADIENTS[2]})`}
                      />
                      <Bar 
                        yAxisId="left"
                        dataKey="benefits" 
                        name="Benefits" 
                        barSize={20}
                        fill={`url(#${GRADIENTS[3]})`}
                      />
                      <Line 
                        yAxisId="right"
                        type="monotone" 
                        dataKey={d => d.salary > 0 ? (d.benefits / d.salary) * 100 : 0}
                        name="Benefits Ratio" 
                        stroke="#ff8042"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                    </ComposedChart>
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
                }}>Payroll Distribution Insights</h4>
                <p style={{ 
                  fontSize: '13px', 
                  margin: '0 0 5px 0',
                  color: '#555'
                }}>
                  <strong>Net-to-gross ratio:</strong> {totalGrossPay > 0 ? ((totalNetPay / totalGrossPay) * 100).toFixed(1) : 0}% (target: 75-80%)
                </p>
                <p style={{ 
                  fontSize: '13px', 
                  margin: '0 0 5px 0',
                  color: '#555'
                }}>
                  <strong>Largest deduction category:</strong> {
                    deductionChartData.length > 0 ? `${deductionChartData.sort((a, b) => b.value - a.value)[0].name} (₱${deductionChartData.sort((a, b) => b.value - a.value)[0].value.toLocaleString(undefined, {maximumFractionDigits: 0})})` : 'N/A'
                  }
                </p>
                <p style={{ 
                  fontSize: '13px', 
                  margin: '0',
                  color: '#555'
                }}>
                  <strong>Attendance penalties impact:</strong> {
                    totalGrossPay > 0 ? `${((totalAttendancePenalties / totalGrossPay) * 100).toFixed(2)}% of gross payroll` : 'N/A'
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
                <i className="fas fa-chart-line" style={{ fontSize: "11px" }}></i>
                View Detailed Analysis
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayrollSummaryReport;