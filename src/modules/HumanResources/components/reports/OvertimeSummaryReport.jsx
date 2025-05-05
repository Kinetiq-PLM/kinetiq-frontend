import React from "react";
import { 
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from 'recharts';

const OvertimeSummaryReport = ({ overtimeRequests }) => {
  // Calculate metrics
  const totalRequests = overtimeRequests.length;
  const approvedRequests = overtimeRequests.filter(r => r.status === "Approved").length;
  const pendingRequests = overtimeRequests.filter(r => r.status === "Pending").length;
  const rejectedRequests = overtimeRequests.filter(r => r.status === "Rejected").length;
  
  // Calculate approval rate
  const approvalRate = totalRequests > 0 ? 
    ((approvedRequests / totalRequests) * 100).toFixed(1) : 0;
  
  // Status breakdown
  const statusData = [
    { name: 'Approved', value: approvedRequests },
    { name: 'Pending', value: pendingRequests },
    { name: 'Rejected', value: rejectedRequests }
  ];
  
  // Overtime hours by department
  const departmentHours = overtimeRequests.reduce((acc, request) => {
    // Skip if not approved
    if (request.status !== "Approved") return acc;
    
    const department = request.department || "Unspecified";
    acc[department] = (acc[department] || 0) + parseFloat(request.hours || 0);
    return acc;
  }, {});
  
  const departmentChartData = Object.entries(departmentHours)
    .map(([name, hours]) => ({ name, hours }))
    .sort((a, b) => b.hours - a.hours);
  
  // Monthly overtime trend
  const monthlyData = overtimeRequests.reduce((acc, request) => {
    const date = new Date(request.date);
    const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
    
    if (!acc[monthYear]) {
      acc[monthYear] = { 
        month: monthYear, 
        requests: 0,
        hours: 0,
        approved: 0
      };
    }
    
    acc[monthYear].requests += 1;
    acc[monthYear].hours += parseFloat(request.hours || 0);
    if (request.status === "Approved") {
      acc[monthYear].approved += 1;
    }
    
    return acc;
  }, {});
  
  const monthlyChartData = Object.values(monthlyData)
    .sort((a, b) => {
      const dateA = new Date(a.month);
      const dateB = new Date(b.month);
      return dateA - dateB;
    })
    .slice(-6); // Last 6 months
  
  const COLORS = ['#00a9ac', '#ffc658', '#ff8042'];

  return (
    <div className="summary-report overtime-report">
      <div className="metrics-cards">
        <div className="metric-card">
          <h3>Total Requests</h3>
          <div className="metric-value">{totalRequests}</div>
        </div>
        <div className="metric-card">
          <h3>Approved</h3>
          <div className="metric-value">{approvedRequests}</div>
        </div>
        <div className="metric-card">
          <h3>Pending</h3>
          <div className="metric-value">{pendingRequests}</div>
        </div>
        <div className="metric-card">
          <h3>Approval Rate</h3>
          <div className="metric-value">{approvalRate}%</div>
        </div>
      </div>
      
      <div className="charts-container">
        <div className="chart-panel">
          <h3>Overtime Request Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} requests`, 'Count']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="chart-panel">
          <h3>Overtime Hours by Department</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentChartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" width={150} />
              <Tooltip formatter={(value) => [`${value.toFixed(1)} hours`, 'Overtime']} />
              <Bar dataKey="hours" fill="#00a9ac" name="Hours" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="chart-panel">
          <h3>Monthly Overtime Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="hours" stroke="#00a9ac" name="Hours" />
              <Line yAxisId="right" type="monotone" dataKey="requests" stroke="#ff8042" name="Requests" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default OvertimeSummaryReport;