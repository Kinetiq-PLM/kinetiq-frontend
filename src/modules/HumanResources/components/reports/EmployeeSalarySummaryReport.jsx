import React from "react";
import {
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';


const EmployeeSalarySummaryReport = ({ salaryData }) => {
  const [uploadedFile, setUploadedFile] = React.useState(null);
  
  // Calculate metrics
  const totalEmployees = salaryData?.length || 0;
  
  // Calculate average, min and max salary
  const salaryValues = salaryData?.map(e => parseFloat(e.salary || 0)) || [];
  const avgSalary = totalEmployees > 0 ? 
    salaryValues.reduce((sum, val) => sum + val, 0) / totalEmployees : 0;
  const minSalary = salaryValues.length > 0 ? Math.min(...salaryValues) : 0;
  const maxSalary = salaryValues.length > 0 ? Math.max(...salaryValues) : 0;
  
  // Salary distribution by bands
  const salaryRanges = [
    { range: '0-20k', min: 0, max: 20000, count: 0 },
    { range: '20k-40k', min: 20000, max: 40000, count: 0 },
    { range: '40k-60k', min: 40000, max: 60000, count: 0 },
    { range: '60k-80k', min: 60000, max: 80000, count: 0 },
    { range: '80k-100k', min: 80000, max: 100000, count: 0 },
    { range: '100k+', min: 100000, max: Infinity, count: 0 }
  ];
  
  salaryValues.forEach(salary => {
    const range = salaryRanges.find(r => salary >= r.min && salary < r.max);
    if (range) range.count++;
  });
  
  // Department salary averages
  const departmentSalaries = salaryData?.reduce((acc, item) => {
    if (!acc[item.department]) {
      acc[item.department] = {
        totalSalary: 0,
        count: 0
      };
    }
    
    acc[item.department].totalSalary += parseFloat(item.salary || 0);
    acc[item.department].count += 1;
    
    return acc;
  }, {}) || {};
  
  const departmentData = Object.entries(departmentSalaries)
    .map(([name, data]) => ({
      name,
      avgSalary: data.count > 0 ? (data.totalSalary / data.count).toFixed(0) : 0
    }))
    .sort((a, b) => b.avgSalary - a.avgSalary);
  
  // Employment type salary comparison
  const employmentTypeData = salaryData?.reduce((acc, item) => {
    if (!acc[item.employment_type]) {
      acc[item.employment_type] = {
        totalSalary: 0,
        count: 0
      };
    }
    
    acc[item.employment_type].totalSalary += parseFloat(item.salary || 0);
    acc[item.employment_type].count += 1;
    
    return acc;
  }, {}) || {};
  
  const typeData = Object.entries(employmentTypeData)
    .map(([name, data]) => ({
      name,
      avgSalary: data.count > 0 ? (data.totalSalary / data.count).toFixed(0) : 0,
      employeeCount: data.count
    }));
  
  const COLORS = ['#00a9ac', '#66bc6d', '#8884d8', '#ff8042', '#ffc658', '#d53e4f'];

  const handleUploadSuccess = (fileData) => {
    setUploadedFile(fileData);
    console.log("File uploaded successfully:", fileData);
    alert(`Report applied successfully! File available at: ${fileData.filePath}`);
  };

  return (
    <div className="summary-report salary-report">
      <div className="metrics-cards">
        <div className="metric-card">
          <h3>Average Salary</h3>
          <div className="metric-value">₱{avgSalary.toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
        </div>
        <div className="metric-card">
          <h3>Minimum Salary</h3>
          <div className="metric-value">₱{minSalary.toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
        </div>
        <div className="metric-card">
          <h3>Maximum Salary</h3>
          <div className="metric-value">₱{maxSalary.toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
        </div>
      </div>
      
      <div className="charts-container">
        <div className="chart-panel">
          <h3>Salary Range Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salaryRanges}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value} employees`, 'Count']} />
              <Legend />
              <Bar dataKey="count" fill="#00a9ac" name="Employees" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="chart-panel">
          <h3>Average Salary by Department</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`₱${Number(value).toLocaleString()}`, 'Average Salary']} />
              <Legend />
              <Bar dataKey="avgSalary" fill="#00a9ac" name="Average Salary" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="chart-panel">
          <h3>Salary by Employment Type</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={typeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="avgSalary"
                nameKey="name"
                label={({name, percent}) => `${name}`}
              >
                {typeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`₱${Number(value).toLocaleString()}`, 'Average Salary']} />
              <Legend />
            </PieChart>
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

export default EmployeeSalarySummaryReport;