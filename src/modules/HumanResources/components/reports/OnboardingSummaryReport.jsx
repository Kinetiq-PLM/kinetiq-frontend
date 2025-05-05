import React from "react";
import { 
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from 'recharts';

const OnboardingSummaryReport = ({ onboarding }) => {
  // Calculate metrics
  const totalOnboarding = onboarding.length;
  const completedOnboarding = onboarding.filter(o => o.status === "Completed").length;
  const inProgressOnboarding = onboarding.filter(o => o.status === "In Progress").length;
  const notStartedOnboarding = onboarding.filter(o => o.status === "Not Started").length;
  
  // Completion rate
  const completionRate = totalOnboarding > 0 ? 
    ((completedOnboarding / totalOnboarding) * 100).toFixed(1) : 0;
  
  // Status data
  const statusData = [
    { name: 'Completed', value: completedOnboarding },
    { name: 'In Progress', value: inProgressOnboarding },
    { name: 'Not Started', value: notStartedOnboarding }
  ];
  
  // Task completion data
  const taskData = onboarding.reduce((acc, o) => {
    // Skip if no tasks
    if (!o.tasks || !o.tasks.length) return acc;
    
    o.tasks.forEach(task => {
      if (!acc[task.name]) {
        acc[task.name] = { completed: 0, total: 0 };
      }
      acc[task.name].total += 1;
      if (task.completed) {
        acc[task.name].completed += 1;
      }
    });
    
    return acc;
  }, {});
  
  const taskChartData = Object.entries(taskData)
    .map(([name, data]) => ({
      name,
      completed: data.completed,
      pending: data.total - data.completed,
      rate: ((data.completed / data.total) * 100).toFixed(1)
    }))
    .sort((a, b) => b.completed - a.completed);
  
  const COLORS = ['#00a9ac', '#ff8042', '#66bc6d'];

  return (
    <div className="summary-report onboarding-report">
      <div className="metrics-cards">
        <div className="metric-card">
          <h3>Total Onboarding</h3>
          <div className="metric-value">{totalOnboarding}</div>
        </div>
        <div className="metric-card">
          <h3>Completed</h3>
          <div className="metric-value">{completedOnboarding}</div>
        </div>
        <div className="metric-card">
          <h3>In Progress</h3>
          <div className="metric-value">{inProgressOnboarding}</div>
        </div>
        <div className="metric-card">
          <h3>Completion Rate</h3>
          <div className="metric-value">{completionRate}%</div>
        </div>
      </div>
      
      <div className="charts-container">
        <div className="chart-panel">
          <h3>Onboarding Status</h3>
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
              <Tooltip formatter={(value) => [`${value} employees`, 'Count']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="chart-panel">
          <h3>Task Completion Rates</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={taskChartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" width={150} />
              <Tooltip />
              <Legend />
              <Bar dataKey="completed" stackId="a" fill="#00a9ac" name="Completed" />
              <Bar dataKey="pending" stackId="a" fill="#ff8042" name="Pending" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default OnboardingSummaryReport;