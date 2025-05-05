import React from "react";
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell 
} from 'recharts';

const PositionsSummaryReport = ({ positions, employees }) => {
  // Calculate metrics
  const totalPositions = positions.length;
  const activePositions = positions.filter(pos => pos.is_active).length;
  const inactivePositions = totalPositions - activePositions;
  const filledPositions = positions.filter(pos => 
    employees.some(emp => emp.position_id === pos.position_id)
  ).length;
  const vacantPositions = activePositions - filledPositions;
  
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

  const COLORS = ['#00a9ac', '#66bc6d', '#8884d8', '#ff8042', '#a5d8ef'];

  return (
    <div className="summary-report positions-report">
      <div className="metrics-cards">
        <div className="metric-card">
          <h3>Total Positions</h3>
          <div className="metric-value">{totalPositions}</div>
        </div>
        <div className="metric-card">
          <h3>Active Positions</h3>
          <div className="metric-value">{activePositions}</div>
        </div>
        <div className="metric-card">
          <h3>Filled Positions</h3>
          <div className="metric-value">{filledPositions}</div>
        </div>
        <div className="metric-card">
          <h3>Vacant Positions</h3>
          <div className="metric-value">{vacantPositions}</div>
        </div>
      </div>
      
      <div className="charts-container">
        <div className="chart-panel">
          <h3>Positions by Employment Type</h3>
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
              <Tooltip formatter={(value) => [`${value} positions`, 'Count']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="chart-panel">
          <h3>Positions by Salary Grade</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salaryGradeChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#00a9ac" name="Positions" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default PositionsSummaryReport;