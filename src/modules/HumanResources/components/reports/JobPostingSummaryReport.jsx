import React from "react";
import { 
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from 'recharts';

const JobPostingSummaryReport = ({ jobPostings }) => {
  // Calculate metrics
  const totalJobs = jobPostings.length;
  const openJobs = jobPostings.filter(job => job.status === "Open").length;
  const closedJobs = jobPostings.filter(job => job.status === "Closed").length;
  const onHoldJobs = jobPostings.filter(job => job.status === "On Hold").length;
  
  // Job posting status breakdown
  const statusData = [
    { name: 'Open', value: openJobs },
    { name: 'Closed', value: closedJobs },
    { name: 'On Hold', value: onHoldJobs }
  ];
  
  // Jobs by department
  const departmentData = jobPostings.reduce((acc, job) => {
    const dept = job.department || "Unspecified";
    acc[dept] = (acc[dept] || 0) + 1;
    return acc;
  }, {});
  
  const departmentChartData = Object.entries(departmentData)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
  
  const COLORS = ['#00a9ac', '#ff8042', '#66bc6d', '#8884d8', '#a5d8ef'];

  return (
    <div className="summary-report job-posting-report">
      <div className="metrics-cards">
        <div className="metric-card">
          <h3>Total Job Postings</h3>
          <div className="metric-value">{totalJobs}</div>
        </div>
        <div className="metric-card">
          <h3>Open Jobs</h3>
          <div className="metric-value">{openJobs}</div>
        </div>
        <div className="metric-card">
          <h3>Closed Jobs</h3>
          <div className="metric-value">{closedJobs}</div>
        </div>
        <div className="metric-card">
          <h3>On Hold Jobs</h3>
          <div className="metric-value">{onHoldJobs}</div>
        </div>
      </div>
      
      <div className="charts-container">
        <div className="chart-panel">
          <h3>Job Posting Status</h3>
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
              <Tooltip formatter={(value) => [`${value} job postings`, 'Count']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="chart-panel">
          <h3>Job Postings by Department</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentChartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" width={150} />
              <Tooltip />
              <Bar dataKey="count" fill="#00a9ac" name="Job Postings" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default JobPostingSummaryReport;