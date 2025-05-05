import React from "react";
import {
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';

const EmployeePerformanceSummaryReport = ({ performanceData }) => {
  const [uploadedFile, setUploadedFile] = React.useState(null);
  
  // Calculate metrics
  const totalEvaluations = performanceData?.length || 0;
  
  // Calculate average rating
  const totalRating = performanceData?.reduce((sum, p) => sum + parseFloat(p.rating || 0), 0) || 0;
  const avgRating = totalEvaluations > 0 ? (totalRating / totalEvaluations).toFixed(1) : 0;
  
  // Calculate total bonus amount
  const totalBonus = performanceData?.reduce((sum, p) => sum + parseFloat(p.bonus_amount || 0), 0) || 0;
  
  // Rating distribution
  const ratingMap = {
    1: "Poor",
    2: "Below Average",
    3: "Average",
    4: "Above Average",
    5: "Excellent"
  };
  
  const ratingDistribution = performanceData?.reduce((acc, item) => {
    const ratingValue = parseInt(item.rating);
    const ratingLabel = ratingMap[ratingValue] || `Rating ${ratingValue}`;
    
    acc[ratingLabel] = (acc[ratingLabel] || 0) + 1;
    return acc;
  }, {}) || {};
  
  const ratingData = Object.entries(ratingDistribution)
    .map(([name, value]) => ({ name, value }));
  
  // Department performance averages
  const departmentPerformance = performanceData?.reduce((acc, item) => {
    if (!acc[item.department]) {
      acc[item.department] = {
        totalRating: 0,
        count: 0
      };
    }
    
    acc[item.department].totalRating += parseFloat(item.rating || 0);
    acc[item.department].count += 1;
    
    return acc;
  }, {}) || {};
  
  const departmentData = Object.entries(departmentPerformance)
    .map(([name, data]) => ({
      name,
      avgRating: data.count > 0 ? (data.totalRating / data.count).toFixed(1) : 0
    }))
    .sort((a, b) => b.avgRating - a.avgRating);
  
  const COLORS = ['#00a9ac', '#66bc6d', '#ffc658', '#ff8042', '#d53e4f'];

  const handleUploadSuccess = (fileData) => {
    setUploadedFile(fileData);
    console.log("File uploaded successfully:", fileData);
    alert(`Report applied successfully! File available at: ${fileData.filePath}`);
  };
  
  return (
    <div className="summary-report performance-report">
      <div className="metrics-cards">
        <div className="metric-card">
          <h3>Total Evaluations</h3>
          <div className="metric-value">{totalEvaluations}</div>
        </div>
        <div className="metric-card">
          <h3>Average Rating</h3>
          <div className="metric-value">{avgRating}</div>
        </div>
        <div className="metric-card">
          <h3>Total Bonus Amount</h3>
          <div className="metric-value">₱{totalBonus.toLocaleString(undefined, {maximumFractionDigits: 2})}</div>
        </div>
      </div>
      
      <div className="charts-container">
        <div className="chart-panel">
          <h3>Performance Rating Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={ratingData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {ratingData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} employees`, 'Count']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="chart-panel">
          <h3>Department Performance Average</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 5]} />
              <Tooltip formatter={(value) => [`${value} out of 5`, 'Average Rating']} />
              <Legend />
              <Bar dataKey="avgRating" fill="#00a9ac" name="Average Rating" />
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

export default EmployeePerformanceSummaryReport;