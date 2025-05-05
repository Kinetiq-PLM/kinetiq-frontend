import React from "react";
import { 
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from 'recharts';

const PayrollSummaryReport = ({ payroll }) => {
  // Calculate metrics
  const totalEmployeesPaid = new Set(payroll.map(p => p.employee_id)).size;
  const totalSalary = payroll.reduce((sum, p) => sum + parseFloat(p.base_salary || 0), 0);
  const totalDeductions = payroll.reduce((sum, p) => sum + parseFloat(p.total_deductions || 0), 0);
  const totalNetPay = payroll.reduce((sum, p) => sum + parseFloat(p.net_pay || 0), 0);
  
  // Calculate average salary
  const avgSalary = totalEmployeesPaid > 0 ? 
    (totalSalary / totalEmployeesPaid).toFixed(2) : 0;
  
  // Salary distribution by pay components
  const payComponents = {
    'Base Salary': totalSalary,
    'Overtime Pay': payroll.reduce((sum, p) => sum + parseFloat(p.overtime_pay || 0), 0),
    'Holiday Pay': payroll.reduce((sum, p) => sum + parseFloat(p.holiday_pay || 0), 0),
    'Bonus Pay': payroll.reduce((sum, p) => sum + parseFloat(p.bonus_pay || 0), 0),
    '13th Month Pay': payroll.reduce((sum, p) => sum + parseFloat(p.thirteenth_month_pay || 0), 0)
  };
  
  const payComponentChartData = Object.entries(payComponents)
    .map(([name, value]) => ({ name, value }))
    .filter(item => item.value > 0);
  
  // Deduction breakdown
  const deductionComponents = {
    'SSS': payroll.reduce((sum, p) => sum + parseFloat(p.sss_contribution || 0), 0),
    'PhilHealth': payroll.reduce((sum, p) => sum + parseFloat(p.philhealth_contribution || 0), 0),
    'Pag-IBIG': payroll.reduce((sum, p) => sum + parseFloat(p.pagibig_contribution || 0), 0),
    'Tax': payroll.reduce((sum, p) => sum + parseFloat(p.tax || 0), 0),
    'Late': payroll.reduce((sum, p) => sum + parseFloat(p.late_deduction || 0), 0),
    'Absent': payroll.reduce((sum, p) => sum + parseFloat(p.absent_deduction || 0), 0),
    'Undertime': payroll.reduce((sum, p) => sum + parseFloat(p.undertime_deduction || 0), 0)
  };
  
  const deductionChartData = Object.entries(deductionComponents)
    .map(([name, value]) => ({ name, value }))
    .filter(item => item.value > 0);
  
  // Monthly payroll trend
  const monthlyData = payroll.reduce((acc, p) => {
    // Extract month-year from period end
    const date = new Date(p.pay_period_end);
    const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
    
    if (!acc[monthYear]) {
      acc[monthYear] = { 
        month: monthYear, 
        salary: 0,
        overtime: 0,
        benefits: 0,
        deductions: 0,
        netPay: 0
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
    
    return acc;
  }, {});
  
  const monthlyChartData = Object.values(monthlyData)
    .sort((a, b) => {
      const dateA = new Date(a.month);
      const dateB = new Date(b.month);
      return dateA - dateB;
    })
    .slice(-6); // Last 6 months
  
  const COLORS = ['#00a9ac', '#66bc6d', '#8884d8', '#ff8042', '#ffc658', '#a5d8ef', '#d53e4f'];

  return (
    <div className="summary-report payroll-report">
      <div className="metrics-cards">
        <div className="metric-card">
          <h3>Employees Paid</h3>
          <div className="metric-value">{totalEmployeesPaid}</div>
        </div>
        <div className="metric-card">
          <h3>Total Salary</h3>
          <div className="metric-value">₱{totalSalary.toLocaleString(undefined, {maximumFractionDigits: 2})}</div>
        </div>
        <div className="metric-card">
          <h3>Total Deductions</h3>
          <div className="metric-value">₱{totalDeductions.toLocaleString(undefined, {maximumFractionDigits: 2})}</div>
        </div>
        <div className="metric-card">
          <h3>Net Pay</h3>
          <div className="metric-value">₱{totalNetPay.toLocaleString(undefined, {maximumFractionDigits: 2})}</div>
        </div>
      </div>
      
      <div className="charts-container">
        <div className="chart-panel">
          <h3>Pay Components</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={payComponentChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {payComponentChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`₱${value.toLocaleString(undefined, {maximumFractionDigits: 2})}`, '']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="chart-panel">
          <h3>Deduction Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={deductionChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {deductionChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`₱${value.toLocaleString(undefined, {maximumFractionDigits: 2})}`, '']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="chart-panel">
          <h3>Monthly Payroll Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`₱${value.toLocaleString(undefined, {maximumFractionDigits: 2})}`, '']} />
              <Legend />
              <Area type="monotone" dataKey="salary" stackId="1" stroke="#00a9ac" fill="#00a9ac" name="Base Salary" />
              <Area type="monotone" dataKey="overtime" stackId="1" stroke="#66bc6d" fill="#66bc6d" name="Overtime Pay" />
              <Area type="monotone" dataKey="benefits" stackId="1" stroke="#8884d8" fill="#8884d8" name="Benefits" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default PayrollSummaryReport;