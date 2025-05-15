import React from "react";
import { 
  ResponsiveContainer, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell
} from 'recharts';

const ResignationsSummaryReport = ({ resignations, employees }) => {
  // Calculate metrics
  const totalResignations = resignations.length;
  const approvedResignations = resignations.filter(res => res.approval_status === "Approved").length;
  const pendingResignations = resignations.filter(res => res.approval_status === "Pending").length;
  
  // Calculate turnover rate
  const totalEmployees = employees.length;
  const turnoverRate = totalEmployees > 0 ? 
    ((totalResignations / totalEmployees) * 100).toFixed(1) : 0;
  
  // Group resignations by month for trend analysis
  const monthlyResignations = resignations.reduce((acc, res) => {
    const date = new Date(res.submission_date);
    const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
    
    if (!acc[monthYear]) {
      acc[monthYear] = { month: monthYear, count: 0, rate: 0 };
    }
    acc[monthYear].count += 1;
    // Calculate monthly turnover rate
    acc[monthYear].rate = parseFloat(((acc[monthYear].count / totalEmployees) * 100).toFixed(1));
    
    return acc;
  }, {});
  
  // Convert to array and sort by date
  const monthlyData = Object.values(monthlyResignations)
    .sort((a, b) => {
      const dateA = new Date(a.month);
      const dateB = new Date(b.month);
      return dateA - dateB;
    })
    .slice(-6); // Last 6 months
  
  // Clearance status breakdown
  const clearanceData = [
    { name: 'Completed', value: resignations.filter(res => res.clearance_status === "Completed").length },
    { name: 'In Progress', value: resignations.filter(res => res.clearance_status === "In Progress").length },
    { name: 'Not Started', value: resignations.filter(res => res.clearance_status === "Not Started").length }
  ];
  
  const COLORS = ['#00a9ac', '#66bc6d', '#ff8042'];

  return (
    <div className="summary-report resignations-report">
      <div className="metrics-cards">
        <div className="metric-card">
          <h3>Total Resignations</h3>
          <div className="metric-value">{totalResignations}</div>
        </div>
        <div className="metric-card">
          <h3>Approved</h3>
          <div className="metric-value">{approvedResignations}</div>
        </div>
        <div className="metric-card">
          <h3>Pending</h3>
          <div className="metric-value">{pendingResignations}</div>
        </div>
        <div className="metric-card">
          <h3>Turnover Rate</h3>
          <div className="metric-value">{turnoverRate}%</div>
        </div>
      </div>
      
      <div className="charts-container">
        <div className="chart-panel">
          <h3>Monthly Resignation Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Area yAxisId="left" type="monotone" dataKey="count" fill="#00a9ac" stroke="#00a9ac" name="Resignations" />
              <Line yAxisId="right" type="monotone" dataKey="rate" stroke="#ff8042" name="Turnover Rate (%)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className="chart-panel">
          <h3>Clearance Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={clearanceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {clearanceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} resignations`, 'Count']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ResignationsSummaryReport;