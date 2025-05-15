import React, { useMemo } from "react";
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
  const onLeaveRate = totalEmployees > 0 ?
    ((onLeaveCount / totalEmployees) * 100).toFixed(1) : 0;
  
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
  
  // Enhanced color palette to match department report
  const COLORS = ['#00a9ac', '#ff8042', '#ffc658', '#66bc6d'];
  const GRADIENTS = COLORS.map((color, index) => `attendanceGradient-${index}`);

  // Helper function to create lighter/darker shade of a color
  const createShade = (hexColor, percent) => {
    const num = parseInt(hexColor.slice(1), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    
    return `#${(1 << 24 | (R < 255 ? (R < 0 ? 0 : R) : 255) << 16 | (G < 255 ? (G < 0 ? 0 : G) : 255) << 8 | (B < 255 ? (B < 0 ? 0 : B) : 255)).toString(16).slice(1)}`;
  };
  
  // Gradient definitions for charts
  const renderGradientDefs = () => (
    <defs>
      {COLORS.map((color, index) => (
        <linearGradient 
          key={`gradient-${index}`} 
          id={GRADIENTS[index]} 
          x1="0" y1="0" 
          x2="0" y2="1"
        >
          <stop offset="0%" stopColor={color} stopOpacity={0.9} />
          <stop offset="100%" stopColor={createShade(color, 15)} stopOpacity={0.7} />
        </linearGradient>
      ))}
      
      {/* Add radial gradient for pie chart */}
      {COLORS.map((color, index) => (
        <radialGradient 
          key={`radial-gradient-${index}`} 
          id={`attendancePieGradient-${index}`} 
          cx="50%" cy="50%" r="50%" 
          fx="50%" fy="50%"
        >
          <stop offset="0%" stopColor={createShade(color, 20)} stopOpacity={0.9} />
          <stop offset="100%" stopColor={color} stopOpacity={1} />
        </radialGradient>
      ))}
    </defs>
  );
  
  // Calculate attendance performance metrics
  const avgAttendanceRate = useMemo(() => {
    if (attendanceTrend.length === 0) return 0;
    return attendanceTrend.reduce((sum, day) => 
      sum + (day.present / (day.total || 1)) * 100, 0) / attendanceTrend.length;
  }, [attendanceTrend]);
  
  // Calculate trend indicators (is attendance improving or declining)
  const attendanceTrend7Days = useMemo(() => {
    if (attendanceTrend.length < 7) return 0;
    
    const recent = attendanceTrend.slice(0, 3).reduce((sum, day) => 
      sum + (day.present / (day.total || 1)) * 100, 0) / 3;
      
    const earlier = attendanceTrend.slice(3, 7).reduce((sum, day) => 
      sum + (day.present / (day.total || 1)) * 100, 0) / 4;
      
    return recent - earlier;
  }, [attendanceTrend]);
  
  // Get consecutive perfect attendance days
  const consecutivePerfectDays = useMemo(() => {
    let count = 0;
    for (let i = 0; i < attendanceTrend.length; i++) {
      const day = attendanceTrend[i];
      if (day.absent === 0 && day.late === 0) {
        count++;
      } else {
        break;
      }
    }
    return count;
  }, [attendanceTrend]);
  
  // Custom tooltip component for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="hr-custom-tooltip" style={{ 
          backgroundColor: 'white', 
          padding: '12px 15px', 
          border: '1px solid #e0e0e0',
          borderRadius: '6px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}>
          <p style={{ margin: '0 0 8px', fontWeight: 'bold', color: '#333', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>
            {typeof label === 'string' && label.includes('-') ? 
              new Date(label).toLocaleDateString('en-US', {weekday: 'short', month: 'short', day: 'numeric'}) : 
              label}
          </p>
          {payload.map((entry, index) => (
            <div key={`item-${index}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '5px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ 
                  width: '10px', 
                  height: '10px', 
                  backgroundColor: entry.color, 
                  marginRight: '8px',
                  borderRadius: '2px'
                }} />
                <span style={{ color: '#687C7B' }}>{entry.name}: </span>
              </div>
              <span style={{ fontWeight: '500', color: '#333' }}>{entry.value}</span>
            </div>
          ))}
          {payload[0].payload.total && (
            <div style={{ 
              marginTop: '5px', 
              paddingTop: '5px', 
              borderTop: '1px dashed #eee',
              fontSize: '11px',
              color: '#687C7B',
              textAlign: 'right'
            }}>
              Total tracked: {payload[0].payload.total}
            </div>
          )}
        </div>
      );
    }
    return null;
  };
  
  // Calculate which day had the best and worst attendance
  const { bestDay, worstDay } = useMemo(() => {
    if (attendanceTrend.length === 0) return { bestDay: null, worstDay: null };
    
    let best = { date: null, rate: 0 };
    let worst = { date: null, rate: 100 };
    
    attendanceTrend.forEach(day => {
      const rate = (day.present / (day.total || 1)) * 100;
      if (rate > best.rate && day.total > 0) {
        best = { date: day.date, rate };
      }
      if (rate < worst.rate && day.total > 0) {
        worst = { date: day.date, rate };
      }
    });
    
    return { 
      bestDay: best.date ? { 
        date: best.date, 
        rate: best.rate.toFixed(1),
        formattedDate: new Date(best.date).toLocaleDateString('en-US', {month: 'short', day: 'numeric'})
      } : null,
      worstDay: worst.date ? { 
        date: worst.date, 
        rate: worst.rate.toFixed(1),
        formattedDate: new Date(worst.date).toLocaleDateString('en-US', {month: 'short', day: 'numeric'}) 
      } : null
    };
  }, [attendanceTrend]);

  return (
    <div className="hr-report-container">
      {/* Header Metrics Cards */}
      <div className="hr-report-summary-cards">
        <div className="hr-report-summary-card" style={{
          boxShadow: '0 4px 12px rgba(0,169,172,0.08)',
          borderLeft: '4px solid #00a9ac'
        }}>
          <h3>Present Today</h3>
          <div className="hr-report-value">{presentCount} <span style={{ fontSize: '16px', color: '#687C7B' }}>({presentRate}%)</span></div>
          <div className="hr-metric-trend">
            <i className="fas fa-user-check" style={{ marginRight: '8px', color: '#00a9ac' }}></i>
            <span>On-time employees</span>
          </div>
        </div>
        
        <div className="hr-report-summary-card" style={{
          boxShadow: '0 4px 12px rgba(0,169,172,0.08)',
          borderLeft: '4px solid #ff8042'
        }}>
          <h3>Absent Today</h3>
          <div className="hr-report-value">{absentCount} <span style={{ fontSize: '16px', color: '#687C7B' }}>({absentRate}%)</span></div>
          <div className="hr-metric-trend">
            <i className="fas fa-user-times" style={{ marginRight: '8px', color: '#ff8042' }}></i>
            <span>Missing employees</span>
          </div>
        </div>
        
        <div className="hr-report-summary-card" style={{
          boxShadow: '0 4px 12px rgba(0,169,172,0.08)',
          borderLeft: '4px solid #ffc658'
        }}>
          <h3>Late Today</h3>
          <div className="hr-report-value">{lateCount} <span style={{ fontSize: '16px', color: '#687C7B' }}>({lateRate}%)</span></div>
          <div className="hr-metric-trend">
            <i className="fas fa-clock" style={{ marginRight: '8px', color: '#ffc658' }}></i>
            <span>Tardy employees</span>
          </div>
        </div>
        
        <div className="hr-report-summary-card" style={{
          boxShadow: '0 4px 12px rgba(0,169,172,0.08)',
          borderLeft: '4px solid #66bc6d'
        }}>
          <h3>On Leave Today</h3>
          <div className="hr-report-value">{onLeaveCount} <span style={{ fontSize: '16px', color: '#687C7B' }}>({onLeaveRate}%)</span></div>
          <div className="hr-metric-trend">
            <i className="fas fa-calendar-alt" style={{ marginRight: '8px', color: '#66bc6d' }}></i>
            <span>Scheduled absences</span>
          </div>
        </div>
      </div>
      
      {/* Main charts container - First row */}
      <div className="hr-report-charts-single-column">
        {/* Today's Status Breakdown */}
        <div className="hr-report-chart-full" style={{
          boxShadow: '0 6px 16px rgba(0,169,172,0.08)',
          borderRadius: '12px',
          padding: '20px',
          background: 'white'
        }}>
          <h3 style={{ 
            borderBottom: '2px solid #f0f0f0', 
            paddingBottom: '12px',
            marginBottom: '20px',
            fontWeight: '600',
            color: '#333',
            display: 'flex',
            alignItems: 'center'
          }}>
            <i className="fas fa-chart-pie" style={{ marginRight: '10px', color: '#00a9ac' }}></i>
            Today's Attendance Status ({latestDate})
          </h3>
          
          <div style={{
            height: "450px", // Increased from 350px to 450px
            display: "flex", 
            flexDirection: "row",
            position: "relative"
          }}>
            {statusData.some(item => item.value > 0) ? (
              <>
                {/* Status Legend */}
                <div style={{ 
                  width: "30%", 
                  padding: "10px 20px 10px 10px",
                  display: "flex",
                  flexDirection: "column",
                }}>
                  <h4 style={{ 
                    marginBottom: "15px", 
                    fontSize: "14px", 
                    fontWeight: "600",
                    color: '#00a9ac',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <i className="fas fa-users" style={{ marginRight: '8px' }}></i>
                    Attendance Status
                  </h4>
                  
                  <div style={{ 
                    display: "flex", 
                    flexDirection: "column", 
                    gap: "10px",
                    maxHeight: "300px",
                    overflowY: "auto"
                  }}>
                    {statusData.map((item, index) => (
                      <div key={index} style={{ 
                        display: "flex", 
                        alignItems: "center",
                        padding: "10px",
                        borderRadius: "8px",
                        background: index % 2 === 0 ? "#f9fafb" : "white",
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                        transition: 'transform 0.2s ease',
                        cursor: 'pointer',
                        border: '1px solid #f0f0f0'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
                      }}
                      >
                        <div style={{ 
                          width: "16px", 
                          height: "16px", 
                          backgroundColor: COLORS[index % COLORS.length],
                          borderRadius: "4px",
                          marginRight: "12px",
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ 
                            fontSize: "13px", 
                            fontWeight: "600",
                            marginBottom: "4px"
                          }}>
                            {item.name}
                          </div>
                          <div style={{ 
                            fontSize: "12px", 
                            color: "#687C7B",
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}>
                            <span>{item.value} employees</span>
                            <span style={{
                              background: COLORS[index % COLORS.length] + '20',
                              color: COLORS[index % COLORS.length],
                              padding: '3px 8px',
                              borderRadius: '12px',
                              fontWeight: '600',
                              fontSize: '11px'
                            }}>
                              {totalEmployees > 0 ? ((item.value / totalEmployees) * 100).toFixed(1) : 0}%
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pie Chart */}
                <div style={{ width: "40%", position: 'relative' }}>
                  <div style={{ position: 'absolute', top: 0, right: 0, left: 0, bottom: 0 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart margin={{ top: 10, right: 30, bottom: 10, left: 30 }}> 
                        {renderGradientDefs()}
                        <Pie
                          data={statusData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          outerRadius={130}
                          innerRadius={40}
                          paddingAngle={1}
                          dataKey="value"
                          label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {statusData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={`url(#attendancePieGradient-${index % COLORS.length})`}
                              stroke="#fff"
                              strokeWidth={2}
                            />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value, name) => [
                            `${value} employees (${totalEmployees > 0 ? ((value / totalEmployees) * 100).toFixed(1) : 0}%)`, 
                            name
                          ]}
                          contentStyle={{
                            backgroundColor: 'white',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            border: 'none',
                            padding: '10px 15px'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Attendance Insights */}
                <div style={{ 
                  width: "30%", 
                  borderLeft: "1px dashed #e0e0e0",
                  paddingLeft: "20px",
                  display: "flex",
                  flexDirection: "column",
                  // justifyContent: "space-between",
                  height: "100%"
                }}>
                  <h4 style={{ 
                    fontSize: "14px", 
                    color: "#00a9ac", 
                    marginBottom: "10px",
                    fontWeight: "600",
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <i className="fas fa-lightbulb" style={{ marginRight: '8px' }}></i>
                    Attendance Insights
                  </h4>

                  <div style={{ 
                    display: "flex",
                    flexDirection: "column",
                    gap: "15px"
                  }}>
                    {/* Overall Attendance Rate Card */}
                    <div style={{ 
                      padding: "12px",
                      borderRadius: "8px",
                      backgroundColor: "#f9fafb",
                      border: "1px solid #f0f0f0"
                    }}>
                      <div style={{ 
                        fontSize: "12px", 
                        color: "#687C7B",
                        marginBottom: "5px" 
                      }}>
                        Overall Attendance Rate
                      </div>
                      <div style={{ 
                        fontSize: "20px", 
                        fontWeight: "700",
                        color: "#00a9ac",
                        display: "flex",
                        alignItems: "center",
                        // justifyContent: "space-between"
                      }}>
                        {presentRate}%
                        <span style={{ 
                          fontSize: "11px",
                          padding: "3px 8px",
                          backgroundColor: "rgba(0, 169, 172, 0.1)",
                          color: "#00a9ac",
                          borderRadius: "12px" 
                        }}>
                          today
                        </span>
                      </div>
                    </div>

                    {/* Today vs 30-Day Average Card */}
                    <div style={{ 
                      padding: "12px",
                      borderRadius: "8px",
                      backgroundColor: "#f9fafb", 
                      border: "1px solid #f0f0f0"
                    }}>
                      <div style={{ 
                        fontSize: "12px", 
                        color: "#687C7B",
                        marginBottom: "5px" 
                      }}>
                        Today vs 30-Day Average
                      </div>
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px"
                      }}>
                        <div style={{
                          width: "100%",
                          height: "8px",
                          backgroundColor: "#e9ecef",
                          borderRadius: "4px",
                          overflow: "hidden"
                        }}>
                          <div style={{
                            width: `${Math.min(100, Math.max(0, parseFloat(presentRate)))}%`,
                            height: "100%",
                            backgroundColor: parseFloat(presentRate) > avgAttendanceRate ? "#66bc6d" : "#ff8042"
                          }}/>
                        </div>
                      </div>
                      <div style={{
                        marginTop: "8px",
                        fontSize: "12px",
                        color: "#687C7B",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                      }}>
                        <span>30-day avg: {avgAttendanceRate.toFixed(1)}%</span>
                        <span style={{
                          color: parseFloat(presentRate) >= avgAttendanceRate ? "#66bc6d" : "#ff8042",
                          fontWeight: "500",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px"
                        }}>
                          <i className={`fas fa-${parseFloat(presentRate) >= avgAttendanceRate ? "arrow-up" : "arrow-down"}`} style={{ fontSize: "10px" }}></i>
                          {Math.abs(parseFloat(presentRate) - avgAttendanceRate).toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    {/* 7-Day Trend Card */}
                    <div style={{ 
                      padding: "12px",
                      borderRadius: "8px",
                      backgroundColor: "#f9fafb",
                      border: "1px solid #f0f0f0"
                    }}>
                      <div style={{ 
                        fontSize: "12px", 
                        color: "#687C7B",
                        marginBottom: "5px" 
                      }}>
                        7-Day Trend
                      </div>
                      <div style={{ 
                        fontSize: "14px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px"
                      }}>
                        <span style={{
                          color: attendanceTrend7Days >= 0 ? "#66bc6d" : "#ff8042",
                          fontWeight: "600",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px"
                        }}>
                          <i className={`fas fa-${attendanceTrend7Days >= 0 ? "arrow-up" : "arrow-down"}`} style={{ fontSize: "12px" }}></i>
                          {Math.abs(attendanceTrend7Days).toFixed(1)}%
                        </span>
                        <span style={{ color: "#687C7B" }}>
                          {attendanceTrend7Days >= 0 ? "improvement" : "decline"} in attendance
                        </span>
                      </div>
                      <div style={{
                        marginTop: "10px",
                        fontSize: "12px",
                        fontWeight: "500",
                        padding: "8px",
                        backgroundColor: "rgba(102, 188, 109, 0.1)",
                        color: "#66bc6d",
                        borderRadius: "6px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px"
                      }}>
                        <i className="fas fa-medal" style={{ fontSize: "11px" }}></i>
                        <span>
                          {consecutivePerfectDays} {consecutivePerfectDays === 1 ? 'day' : 'days'} of perfect attendance
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Export Button */}
                  <button style={{
                    marginTop: "15px",
                    padding: "8px 12px",
                    backgroundColor: "white",
                    border: "1px solid #00a9ac",
                    borderRadius: "6px",
                    color: "#00a9ac",
                    fontSize: "12px",
                    fontWeight: "500",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px"
                  }}>
                    <i className="fas fa-file-export" style={{ fontSize: "11px" }}></i>
                    Export Attendance Data
                  </button>
                </div>
              </>
            ) : (
              <div style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{ fontSize: "48px", marginBottom: "15px" }}>📊</div>
                <p style={{ color: "#687C7B", fontSize: "16px" }}>No attendance data available for today</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Bar Chart for 7-Day Trend */}
        <div className="hr-report-chart-full" style={{
          boxShadow: '0 6px 16px rgba(0,169,172,0.08)',
          borderRadius: '12px',
          padding: '20px',
          marginTop: '24px',
          background: 'white'
        }}>
          <h3 style={{ 
            borderBottom: '2px solid #f0f0f0', 
            paddingBottom: '12px',
            marginBottom: '20px',
            fontWeight: '600',
            color: '#333',
            display: 'flex',
            alignItems: 'center'
          }}>
            <i className="fas fa-chart-bar" style={{ marginRight: '10px', color: '#00a9ac' }}></i>
            Attendance Trend (Last 7 Days)
          </h3>
          
          <div style={{
            height: "480px", // Increased from 350px to 480px
            display: "flex", 
            flexDirection: "row",
            position: "relative"
          }}>
            {attendanceTrend.length > 0 ? (
              <>
                {/* Left side - Bar chart */}
                <div style={{ width: "65%", position: 'relative' }}>
                  <div style={{ position: 'absolute', top: 0, right: 20, left: 0, bottom: 0 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart 
                        data={attendanceTrend.slice(0, 7)}
                        margin={{ top: 10, right: 30, bottom: 20, left: 0 }}
                      >
                        {renderGradientDefs()}
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis 
                          dataKey="date" 
                          tickFormatter={date => new Date(date).toLocaleDateString('en-US', {weekday: 'short'})} 
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis 
                          axisLine={false}
                          tickLine={false}
                          tickCount={5}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend 
                          iconType="square"
                          iconSize={10}
                          wrapperStyle={{ paddingTop: 15 }}
                        />
                        <Bar dataKey="present" stackId="a" fill={`url(#${GRADIENTS[0]})`} name="Present" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="late" stackId="a" fill={`url(#${GRADIENTS[2]})`} name="Late" />
                        <Bar dataKey="absent" stackId="a" fill={`url(#${GRADIENTS[1]})`} name="Absent" />
                        <Bar dataKey="onLeave" stackId="a" fill={`url(#${GRADIENTS[3]})`} name="On Leave" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Right side - Weekly insights */}
                <div style={{ 
                  width: "35%", 
                  borderLeft: "1px dashed #e0e0e0",
                  paddingLeft: "20px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start", // Changed from center to flex-start
                  gap: "15px",
                  overflow: "auto", // Added to handle scrolling if content is too tall
                  paddingTop: "10px", // Added padding at the top
                  height: "100%" // Ensure it takes full height
                }}>
                  <h4 style={{ 
                    fontSize: "14px", 
                    color: "#00a9ac", 
                    marginBottom: "15px", // Increased bottom margin
                    fontWeight: "600",
                    display: 'flex',
                    alignItems: 'center',
                    position: "sticky", // Make the header sticky
                    top: 0,
                    backgroundColor: "white",
                    zIndex: 1,
                    paddingBottom: "5px"
                  }}>
                    <i className="fas fa-calendar-week" style={{ marginRight: '8px' }}></i>
                    Weekly Insights
                  </h4>

                  {/* Best/Worst Day Cards */}
                  <div style={{ 
                    padding: "12px",
                    borderRadius: "8px",
                    backgroundColor: "#f9fafb",
                    border: "1px solid #f0f0f0"
                  }}>
                    <div style={{
                      display: "flex",
                      gap: "10px",
                      marginBottom: "10px"
                    }}>
                      <div style={{
                        flex: 1,
                        padding: "10px",
                        borderRadius: "6px",
                        backgroundColor: "rgba(102, 188, 109, 0.1)",
                        border: "1px solid rgba(102, 188, 109, 0.2)"
                      }}>
                        <div style={{ 
                          fontSize: "11px", 
                          color: "#66bc6d",
                          fontWeight: "600",
                          marginBottom: "5px"
                        }}>
                          Best Day
                        </div>
                        <div style={{ 
                          fontSize: "14px", 
                          fontWeight: "700"
                        }}>
                          {bestDay ? bestDay.formattedDate : "N/A"}
                        </div>
                        <div style={{
                          fontSize: "11px",
                          color: "#66bc6d"
                        }}>
                          {bestDay ? `${bestDay.rate}% attendance` : ""}
                        </div>
                      </div>
                      
                      <div style={{
                        flex: 1,
                        padding: "10px",
                        borderRadius: "6px",
                        backgroundColor: "rgba(255, 128, 66, 0.1)",
                        border: "1px solid rgba(255, 128, 66, 0.2)"
                      }}>
                        <div style={{ 
                          fontSize: "11px", 
                          color: "#ff8042",
                          fontWeight: "600",
                          marginBottom: "5px"
                        }}>
                          Worst Day
                        </div>
                        <div style={{ 
                          fontSize: "14px", 
                          fontWeight: "700"
                        }}>
                          {worstDay ? worstDay.formattedDate : "N/A"}
                        </div>
                        <div style={{
                          fontSize: "11px",
                          color: "#ff8042"
                        }}>
                          {worstDay ? `${worstDay.rate}% attendance` : ""}
                        </div>
                      </div>
                    </div>
                    
                    {/* Weekly average */}
                    <div style={{
                      fontSize: "12px",
                      color: "#687C7B",
                      textAlign: "center",
                      padding: "6px 0"
                    }}>
                      7-day average attendance: <strong>{attendanceTrend.slice(0, 7).reduce((sum, day) => 
                        sum + (day.present / (day.total || 1)) * 100, 0) / Math.min(7, attendanceTrend.length)}%</strong>
                    </div>
                  </div>

                  {/* Late/Absence Analysis */}
                  <div style={{ 
                    padding: "12px",
                    borderRadius: "8px",
                    backgroundColor: "#f9fafb",
                    border: "1px solid #f0f0f0"
                  }}>
                    <div style={{ 
                      fontSize: "12px", 
                      color: "#687C7B",
                      marginBottom: "10px",
                      fontWeight: "500" 
                    }}>
                      Tardiness & Absences This Week
                    </div>
                    
                    <div style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px"
                    }}>
                      <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                      }}>
                        <div style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px"
                        }}>
                          <div style={{ 
                            width: "10px", 
                            height: "10px", 
                            backgroundColor: "#ffc658",
                            borderRadius: "2px" 
                          }} />
                          <span style={{ fontSize: "12px" }}>Late arrivals</span>
                        </div>
                        <span style={{ fontSize: "12px", fontWeight: "600" }}>
                          {attendanceTrend.slice(0, 7).reduce((sum, day) => sum + day.late, 0)}
                        </span>
                      </div>
                      
                      <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                      }}>
                        <div style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px"
                        }}>
                          <div style={{ 
                            width: "10px", 
                            height: "10px", 
                            backgroundColor: "#ff8042",
                            borderRadius: "2px" 
                          }} />
                          <span style={{ fontSize: "12px" }}>Absences</span>
                        </div>
                        <span style={{ fontSize: "12px", fontWeight: "600" }}>
                          {attendanceTrend.slice(0, 7).reduce((sum, day) => sum + day.absent, 0)}
                        </span>
                      </div>
                      
                      <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                      }}>
                        <div style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px"
                        }}>
                          <div style={{ 
                            width: "10px", 
                            height: "10px", 
                            backgroundColor: "#66bc6d",
                            borderRadius: "2px" 
                          }} />
                          <span style={{ fontSize: "12px" }}>Approved leaves</span>
                        </div>
                        <span style={{ fontSize: "12px", fontWeight: "600" }}>
                          {attendanceTrend.slice(0, 7).reduce((sum, day) => sum + day.onLeave, 0)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action button */}
                  <button style={{
                    marginTop: "10px",
                    padding: "8px 12px",
                    backgroundColor: "white",
                    border: "1px solid #00a9ac",
                    borderRadius: "6px",
                    color: "#00a9ac",
                    fontSize: "12px",
                    fontWeight: "500",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px"
                  }}>
                    <i className="fas fa-download" style={{ fontSize: "11px" }}></i>
                    Download Weekly Report
                  </button>
                </div>
              </>
            ) : (
              <div style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{ fontSize: "48px", marginBottom: "15px" }}>📈</div>
                <p style={{ color: "#687C7B", fontSize: "16px" }}>No attendance trend data available</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Line Chart for 30-Day Trend */}
        <div className="hr-report-chart-full" style={{
          boxShadow: '0 6px 16px rgba(0,169,172,0.08)',
          borderRadius: '12px',
          padding: '20px',
          marginTop: '24px',
          background: 'white'
        }}>
          <h3 style={{ 
            borderBottom: '2px solid #f0f0f0', 
            paddingBottom: '12px',
            marginBottom: '20px',
            fontWeight: '600',
            color: '#333',
            display: 'flex',
            alignItems: 'center'
          }}>
            <i className="fas fa-chart-line" style={{ marginRight: '10px', color: '#00a9ac' }}></i>
            Attendance Rate Trend (Last 30 Days)
          </h3>
          
          <div style={{
            height: "480px", // Increased from 350px to 480px
            display: "flex", 
            flexDirection: "row",
            position: "relative"
          }}>
            {attendanceTrend.length > 0 ? (
              <>
                {/* Left side - Line chart */}
                <div style={{ width: "65%", position: 'relative' }}>
                  <div style={{ position: 'absolute', top: 0, right: 20, left: 0, bottom: 0 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart 
                        data={attendanceTrend}
                        margin={{ top: 10, right: 30, bottom: 20, left: 0 }}
                      >
                        {renderGradientDefs()}
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis 
                          dataKey="date" 
                          tickFormatter={date => new Date(date).getDate()} 
                          axisLine={false}
                          tickLine={false}
                          interval="preserveStartEnd"
                        />
                        <YAxis 
                          axisLine={false}
                          tickLine={false}
                          tickCount={5}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend 
                          iconType="circle"
                          iconSize={8}
                          wrapperStyle={{ paddingTop: 15 }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="present" 
                          stroke="#00a9ac" 
                          strokeWidth={3}
                          name="Present" 
                          dot={{ stroke: '#00a9ac', strokeWidth: 2, r: 4, fill: 'white' }}
                          activeDot={{ stroke: '#00a9ac', strokeWidth: 2, r: 6, fill: 'white' }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="late" 
                          stroke="#ffc658" 
                          strokeWidth={2}
                          name="Late" 
                          dot={{ stroke: '#ffc658', strokeWidth: 2, r: 3, fill: 'white' }}
                          activeDot={{ stroke: '#ffc658', strokeWidth: 2, r: 5, fill: 'white' }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="absent" 
                          stroke="#ff8042" 
                          strokeWidth={2}
                          name="Absent" 
                          dot={{ stroke: '#ff8042', strokeWidth: 2, r: 3, fill: 'white' }}
                          activeDot={{ stroke: '#ff8042', strokeWidth: 2, r: 5, fill: 'white' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Right side - Monthly insights */}
                <div style={{ 
                  width: "35%", 
                  borderLeft: "1px dashed #e0e0e0",
                  paddingLeft: "20px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start", // Changed from center to flex-start
                  gap: "15px",
                  overflow: "auto", // Added to handle scrolling if content is too tall
                  paddingTop: "10px", // Added padding at the top
                  height: "100%" // Ensure it takes full height
                }}>
                  <h4 style={{ 
                    fontSize: "14px", 
                    color: "#00a9ac", 
                    marginBottom: "15px", // Increased bottom margin
                    fontWeight: "600",
                    display: 'flex',
                    alignItems: 'center',
                    position: "sticky", // Make the header sticky
                    top: 0,
                    backgroundColor: "white",
                    zIndex: 1,
                    paddingBottom: "5px"
                  }}>
                    <i className="fas fa-calendar-alt" style={{ marginRight: '8px' }}></i>
                    Monthly Overview
                  </h4>

                  {/* Monthly Stats Card */}
                  <div style={{ 
                    padding: "12px",
                    borderRadius: "8px",
                    backgroundColor: "#f9fafb",
                    border: "1px solid #f0f0f0",
                    marginBottom: "8px"
                  }}>
                    <div style={{ 
                      fontSize: "12px", 
                      color: "#687C7B",
                      marginBottom: "5px",
                      fontWeight: "500" 
                    }}>
                      30-Day Summary
                    </div>
                    
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "12px",
                      marginTop: "8px"
                    }}>
                      <div style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px",
                        alignItems: "center",
                        padding: "8px",
                        borderRadius: "6px",
                        backgroundColor: "rgba(0, 169, 172, 0.05)"
                      }}>
                        <div style={{ 
                          fontSize: "11px", 
                          color: "#687C7B" 
                        }}>
                          Avg. Attendance
                        </div>
                        <div style={{ 
                          fontSize: "18px", 
                          fontWeight: "700",
                          color: "#00a9ac" 
                        }}>
                          {avgAttendanceRate.toFixed(1)}%
                        </div>
                      </div>
                      
                      <div style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px",
                        alignItems: "center",
                        padding: "8px",
                        borderRadius: "6px",
                        backgroundColor: "rgba(255, 128, 66, 0.05)"
                      }}>
                        <div style={{ 
                          fontSize: "11px", 
                          color: "#687C7B" 
                        }}>
                          Avg. Absence
                        </div>
                        <div style={{ 
                          fontSize: "18px", 
                          fontWeight: "700",
                          color: "#ff8042" 
                        }}>
                          {(100 - avgAttendanceRate).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Monthly Trends */}
                  <div style={{ 
                    padding: "12px",
                    borderRadius: "8px",
                    backgroundColor: "#f9fafb",
                    border: "1px solid #f0f0f0"
                  }}>
                    <div style={{ 
                      fontSize: "12px", 
                      color: "#687C7B",
                      marginBottom: "10px",
                      fontWeight: "500" 
                    }}>
                      Month-to-Month Comparison
                    </div>
                    
                    {(() => {
                      // Calculate this month vs previous month
                      const halfwayPoint = Math.floor(attendanceTrend.length / 2);
                      const recentHalf = attendanceTrend.slice(0, halfwayPoint);
                      const previousHalf = attendanceTrend.slice(halfwayPoint, attendanceTrend.length);
                      
                      const recentAvg = recentHalf.length > 0 ? 
                        recentHalf.reduce((sum, day) => sum + (day.present / (day.total || 1)) * 100, 0) / recentHalf.length : 0;
                        
                      const previousAvg = previousHalf.length > 0 ?
                        previousHalf.reduce((sum, day) => sum + (day.present / (day.total || 1)) * 100, 0) / previousHalf.length : 0;
                        
                      const diff = recentAvg - previousAvg;
                      const isImproved = diff >= 0;
                      
                      return (
                        <>
                          <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            margin: "10px 0"
                          }}>
                            <div style={{
                              width: "100%",
                              height: "8px",
                              backgroundColor: "#e9ecef",
                              borderRadius: "4px",
                              overflow: "hidden",
                              position: "relative"
                            }}>
                              <div style={{
                                position: "absolute",
                                left: 0,
                                top: 0,
                                height: "100%",
                                width: `${Math.min(100, Math.max(0, previousAvg))}%`,
                                backgroundColor: "#d0d0d0"
                              }}/>
                              <div style={{
                                position: "absolute",
                                left: 0,
                                top: 0,
                                height: "100%",
                                width: `${Math.min(100, Math.max(0, recentAvg))}%`,
                                backgroundColor: isImproved ? "#66bc6d" : "#ff8042"
                              }}/>
                            </div>
                          </div>
                          
                          <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: "11px",
                            color: "#687C7B"
                          }}>
                            <div>Previous period: <strong>{previousAvg.toFixed(1)}%</strong></div>
                            <div>Current period: <strong>{recentAvg.toFixed(1)}%</strong></div>
                          </div>
                          
                          <div style={{
                            marginTop: "10px",
                            padding: "8px",
                            backgroundColor: isImproved ? "rgba(102, 188, 109, 0.1)" : "rgba(255, 128, 66, 0.1)",
                            color: isImproved ? "#66bc6d" : "#ff8042",
                            borderRadius: "6px",
                            fontSize: "12px",
                            fontWeight: "500",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "6px"
                          }}>
                            <i className={`fas fa-${isImproved ? "arrow-up" : "arrow-down"}`} style={{ fontSize: "11px" }}></i>
                            <span>
                              {isImproved ? "Improved by" : "Decreased by"} {Math.abs(diff).toFixed(1)}%
                            </span>
                          </div>
                        </>
                      );
                    })()}
                  </div>

                  {/* Action button */}
                  <button style={{
                    marginTop: "10px",
                    padding: "8px 12px",
                    backgroundColor: "white",
                    border: "1px solid #00a9ac",
                    borderRadius: "6px",
                    color: "#00a9ac",
                    fontSize: "12px",
                    fontWeight: "500",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px"
                  }}>
                    <i className="fas fa-file-alt" style={{ fontSize: "11px" }}></i>
                    View Detailed Report
                  </button>
                </div>
              </>
            ) : (
              <div style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{ fontSize: "48px", marginBottom: "15px" }}>📉</div>
                <p style={{ color: "#687C7B", fontSize: "16px" }}>No monthly attendance data available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceSummaryReport;