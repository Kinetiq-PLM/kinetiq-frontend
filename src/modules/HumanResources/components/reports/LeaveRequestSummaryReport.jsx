import React from "react";
import {
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';


const LeaveRequestSummaryReport = ({ leaveRequests }) => {
  const [uploadedFile, setUploadedFile] = React.useState(null);
  
  // Calculate metrics
  const totalRequests = leaveRequests?.length || 0;
  const approvedRequests = leaveRequests?.filter(r => r.status === "Approved")?.length || 0;
  const pendingRequests = leaveRequests?.filter(r => r.status === "Pending")?.length || 0;
  const rejectedRequests = leaveRequests?.filter(r => r.status === "Rejected")?.length || 0;
  
  // Calculate approval rate
  const approvalRate = totalRequests > 0 ? 
    ((approvedRequests / totalRequests) * 100).toFixed(1) : 0;
  
  // Status breakdown
  const statusData = [
    { name: 'Approved', value: approvedRequests },
    { name: 'Pending', value: pendingRequests },
    { name: 'Rejected', value: rejectedRequests }
  ];
  
  // Leave type distribution
  const leaveTypeData = leaveRequests?.reduce((acc, request) => {
    const type = request.leave_type;
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {}) || {};
  
  const leaveTypeChartData = Object.entries(leaveTypeData)
    .map(([name, value]) => ({ name, value }));
  
  const COLORS = ['#00a9ac', '#ffc658', '#ff8042', '#8884d8', '#82ca9d'];

  const handleUploadSuccess = (fileData) => {
    setUploadedFile(fileData);
    console.log("File uploaded successfully:", fileData);
    alert(`Report applied successfully! File available at: ${fileData.filePath}`);
  };

  return (
    <div className="summary-report leave-report">
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
          <h3>Leave Request Status</h3>
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
          <h3>Leave Type Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={leaveTypeChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value} requests`, 'Count']} />
              <Legend />
              <Bar dataKey="value" fill="#00a9ac" name="Requests" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="report-actions">
      
        
        {uploadedFile && (
          <div className="file-uploaded-notice">
            Report applied and saved as: {uploadedFile.fileName}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaveRequestSummaryReport;