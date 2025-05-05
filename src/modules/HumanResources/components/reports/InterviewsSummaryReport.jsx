import React from "react";
import { 
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from 'recharts';

const InterviewsSummaryReport = ({ interviews }) => {
  // Calculate metrics
  const totalInterviews = interviews.length;
  const completedInterviews = interviews.filter(i => i.status === "Completed").length;
  const scheduledInterviews = interviews.filter(i => i.status === "Scheduled").length;
  const cancelledInterviews = interviews.filter(i => i.status === "Cancelled").length;
  
  // Interview outcomes
  const outcomeData = interviews.reduce((acc, interview) => {
    if (interview.status !== "Completed") return acc;
    
    const outcome = interview.outcome || "Pending";
    acc[outcome] = (acc[outcome] || 0) + 1;
    return acc;
  }, {});
  
  const outcomeChartData = Object.entries(outcomeData)
    .map(([name, count]) => ({ name, count }));
  
  // Interviews by week day
  const weekdayData = interviews.reduce((acc, interview) => {
    // Skip interviews without a date
    if (!interview.interview_date) return acc;
    
    const date = new Date(interview.interview_date);
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const day = weekdays[date.getDay()];
    
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {});
  
  // Sort weekdays in proper order
  const weekdayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const weekdayChartData = weekdayOrder.map(day => ({
    name: day,
    count: weekdayData[day] || 0
  }));
  
  const COLORS = ['#00a9ac', '#66bc6d', '#ff8042', '#8884d8', '#ffc658'];

  return (
    <div className="summary-report interviews-report">
      <div className="metrics-cards">
        <div className="metric-card">
          <h3>Total Interviews</h3>
          <div className="metric-value">{totalInterviews}</div>
        </div>
        <div className="metric-card">
          <h3>Completed</h3>
          <div className="metric-value">{completedInterviews}</div>
        </div>
        <div className="metric-card">
          <h3>Scheduled</h3>
          <div className="metric-value">{scheduledInterviews}</div>
        </div>
        <div className="metric-card">
          <h3>Cancelled</h3>
          <div className="metric-value">{cancelledInterviews}</div>
        </div>
      </div>
      
      <div className="charts-container">
        <div className="chart-panel">
          <h3>Interview Outcomes</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={outcomeChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
                label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {outcomeChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} interviews`, 'Count']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="chart-panel">
          <h3>Interviews by Day of Week</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weekdayChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#00a9ac" name="Interviews" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default InterviewsSummaryReport;