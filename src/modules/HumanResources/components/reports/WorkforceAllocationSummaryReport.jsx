import React from "react";
import {
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line
} from 'recharts';


const WorkforceAllocationSummaryReport = ({ allocations, trends }) => {
  const [uploadedFile, setUploadedFile] = React.useState(null);
  
  // Calculate metrics
  const totalAllocated = allocations?.reduce((sum, a) => sum + (a.allocated || 0), 0) || 0;
  const totalActual = allocations?.reduce((sum, a) => sum + (a.actual || 0), 0) || 0;
  const allocationRate = totalAllocated > 0 ? 
    ((totalActual / totalAllocated) * 100).toFixed(1) : 0;
  
  // Calculate departments with most under/over allocation
  const gapData = allocations?.map(dept => ({
    name: dept.department,
    gap: (dept.actual - dept.allocated) || 0,
    actual: dept.actual || 0,
    allocated: dept.allocated || 0
  })) || [];
  
  const COLORS = ['#00a9ac', '#66bc6d', '#8884d8', '#ff8042', '#ffc658'];

  const handleUploadSuccess = (fileData) => {
    setUploadedFile(fileData);
    console.log("File uploaded successfully:", fileData);
    alert(`Report applied successfully! File available at: ${fileData.filePath}`);
  };

  return (
    <div className="summary-report allocation-report">
      <div className="metrics-cards">
        <div className="metric-card">
          <h3>Total Allocated</h3>
          <div className="metric-value">{totalAllocated}</div>
        </div>
        <div className="metric-card">
          <h3>Total Actual</h3>
          <div className="metric-value">{totalActual}</div>
        </div>
        <div className="metric-card">
          <h3>Allocation Rate</h3>
          <div className="metric-value">{allocationRate}%</div>
        </div>
      </div>
      
      <div className="charts-container">
        <div className="chart-panel">
          <h3>Department Allocation vs. Actual</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={allocations?.slice(0, 7) || []} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="department" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="allocated" fill="#00a9ac" name="Allocated" />
              <Bar dataKey="actual" fill="#ff8042" name="Actual" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="chart-panel">
          <h3>Workforce Allocation Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trends || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="allocated" stroke="#00a9ac" name="Allocated" />
              <Line type="monotone" dataKey="actual" stroke="#ff8042" name="Actual" />
            </LineChart>
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

export default WorkforceAllocationSummaryReport;