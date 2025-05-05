import React from "react";
import { 
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from 'recharts';

const AttendanceSummaryReport = ({ attendance, totalEmployees }) => {
  // Get the latest date's attendance
  const dates = [...new Set(attendance.map(a => a.date))].sort().reverse();
  const latestDate = dates[0] || new Date().toISOString().split('T')[0];
  
  // Filter for latest date
  const latestAttendance = attendance.filter(a => a.date === latestDate);
  
  // Calculate today's metrics
  const presentCount = latestAttendance.filter(a => a.status === "Present").length;
  const absentCount = latestAttendance.filter(a => a.status === "Absent").length;
  const lateCount = latestAttendance.filter(a => a.status === "Late").length;
  const onLeaveCount = latestAttendance.filter(a => a.status === "On Leave").length;
  
  // Calculate attendance rates
  const presentRate = totalEmployees > 0 ? 
    ((presentCount / totalEmployees) * 100).toFixed(1) : 0;
  const absentRate = totalEmployees > 0 ? 
    ((absentCount / totalEmployees) * 100).toFixed(1) : 0;
  const lateRate = totalEmployees > 0 ? 
    ((lateCount / totalEmployees) * 100).toFixed(1) : 0;
  
  // Status breakdown for today
  const statusData = [
    { name: 'Present', value: presentCount },
    { name: 'Absent', value: absentCount },
    { name: 'Late', value: lateCount },
    { name: 'On Leave', value: onLeaveCount }
  ];
  
  // Attendance trend for last 30 days
  const attendanceTrend = dates.slice(0, 30).map(date => {
    const dayAttendance = attendance.filter(a => a.date === date);
    const present = dayAttendance.filter(a => a.status === "Present").length;
    const absent = dayAttendance.filter(a => a.status === "Absent").length;
    const late = dayAttendance.filter(a => a.status === "Late").length;
    const onLeave = dayAttendance.filter(a => a.status === "On Leave").length;
    
    return {
      date,
      present,
      absent,
      late,
      onLeave,
      total: present + absent + late + onLeave
    };
  }).reverse(); // Show oldest first
  
  const COLORS = ['#00a9ac', '#ff8042', '#ffc658', '#66bc6d'];

  return (
    <div className="summary-report attendance-report">
      <div className="metrics-cards">
        <div className="metric-card">
          <h3>Total Employees</h3>
          <div className="metric-value">{totalEmployees}</div>
        </div>
        <div className="metric-card">
          <h3>Present Today</h3>
          <div className="metric-value">{presentCount} ({presentRate}%)</div>
        </div>
        <div className="metric-card">
          <h3>Absent Today</h3>
          <div className="metric-value">{absentCount} ({absentRate}%)</div>
        </div>
        <div className="metric-card">
          <h3>Late Today</h3>
          <div className="metric-value">{lateCount} ({lateRate}%)</div>
        </div>
      </div>
      
      <div className="charts-container">
        <div className="chart-panel">
          <h3>Today's Attendance Status ({latestDate})</h3>
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
          <h3>Attendance Trend (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={attendanceTrend.slice(0, 7)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="present" stackId="a" fill="#00a9ac" name="Present" />
              <Bar dataKey="late" stackId="a" fill="#ffc658" name="Late" />
              <Bar dataKey="absent" stackId="a" fill="#ff8042" name="Absent" />
              <Bar dataKey="onLeave" stackId="a" fill="#66bc6d" name="On Leave" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="chart-panel">
          <h3>Attendance Rate Trend (Last 30 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={attendanceTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={date => new Date(date).getDate()} />
              <YAxis />
              <Tooltip labelFormatter={date => new Date(date).toLocaleDateString()} />
              <Legend />
              <Line type="monotone" dataKey="present" stroke="#00a9ac" name="Present" />
              <Line type="monotone" dataKey="late" stroke="#ffc658" name="Late" />
              <Line type="monotone" dataKey="absent" stroke="#ff8042" name="Absent" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AttendanceSummaryReport;