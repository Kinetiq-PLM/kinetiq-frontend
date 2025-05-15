import React from "react";
import { 
  ResponsiveContainer, PieChart, Pie, Cell, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';

const EmployeesSummaryReport = ({ employees }) => {
  // Calculate metrics
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(emp => emp.status === "Active").length;
  const inactiveEmployees = totalEmployees - activeEmployees;
  
  // Employment type breakdown
  const employmentTypeData = employees.reduce((acc, emp) => {
    const type = emp.employment_type || "Regular";
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const employmentTypeChartData = Object.keys(employmentTypeData).map(key => ({
    name: key,
    value: employmentTypeData[key]
  }));

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
  
  // Pie chart colors
  const COLORS = ['#00a9ac', '#66bc6d', '#8884d8', '#ff8042', '#a5d8ef'];

  return (
    <div className="summary-report employees-report">
      <div className="metrics-cards">
        <div className="metric-card">
          <h3>Total Employees</h3>
          <div className="metric-value">{totalEmployees}</div>
        </div>
        <div className="metric-card">
          <h3>Active</h3>
          <div className="metric-value">{activeEmployees}</div>
        </div>
        <div className="metric-card">
          <h3>Inactive</h3>
          <div className="metric-value">{inactiveEmployees}</div>
        </div>
      </div>
      
      <div className="charts-container">
        <div className="chart-panel">
          <h3>Employment Type Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={employmentTypeChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {employmentTypeChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} employees`, 'Count']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="chart-panel">
          <h3>Top Departments by Headcount</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#00a9ac" name="Employees" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default EmployeesSummaryReport;