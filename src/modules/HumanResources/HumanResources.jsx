import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles/HumanResources.css";
import Calendar from "./components/Calendar";
import { useNavigate } from "react-router-dom";

const HRDashboard = ({ loadSubModule, setActiveSubModule }) => {
  // Add navigation hook
  const navigate = useNavigate();
  
  // State for fetched data
  const [employeeStats, setEmployeeStats] = useState({
    total: 0,
    present: 0,
    absent: 0,
    late: 0,
    onLeave: 0,
  });
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [employeePerformance, setEmployeePerformance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Rating labels for display
  const RATING_LABELS = {
    5: "Outstanding",
    4: "Very Satisfactory",
    3: "Satisfactory",
    2: "Fair",
    1: "Poor"
  };

  // Enhanced navigateTo function to handle additional parameters
  const navigateTo = (submoduleName, params = {}) => {
    // Map path to the actual submodule name as defined in App.jsx
    const pathToSubmoduleMap = {
      '/attendance': 'Attendance Tracking',
      '/employees': 'Employees',
      '/leave-requests': 'Leave Requests',
      '/employee-performance': 'Employee Performance'
    };
    
    const submodule = pathToSubmoduleMap[submoduleName];
    if (submodule) {
      // Pass parameters to the submodule if needed
      // This could be stored in sessionStorage if there's no other way
      if (params.selectedDate) {
        sessionStorage.setItem('selectedDate', params.selectedDate);
      }
      
      setActiveSubModule(submodule);
      loadSubModule(submodule);
    }
  };

  // Fetch employee and attendance data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all employees for total count
        const employeesRes = await axios.get("https://x0crs910m2.execute-api.ap-southeast-1.amazonaws.com/dev/api/employees/");
        const totalEmployees = employeesRes.data.length;
        
        // Fetch attendance tracking data
        const attendanceRes = await axios.get("https://x0crs910m2.execute-api.ap-southeast-1.amazonaws.com/dev/api/attendance_tracking/attendance_tracking/");
        
        // Find the latest date in attendance records
        const attendanceData = attendanceRes.data;
        const dates = [...new Set(attendanceData.map(record => record.date))];
        const latestDate = dates.sort().reverse()[0];
        
        // Filter attendance data for the latest date
        const latestAttendance = attendanceData.filter(record => record.date === latestDate);
        
        // Count employees by status for the latest date
        const presentCount = latestAttendance.filter(record => record.status === "Present").length;
        const absentCount = latestAttendance.filter(record => record.status === "Absent").length;
        const lateCount = latestAttendance.filter(record => record.status === "Late").length;
        const onLeaveCount = latestAttendance.filter(record => record.status === "On Leave").length;
        
        // Fetch leave requests
        const leaveRequestsRes = await axios.get("https://x0crs910m2.execute-api.ap-southeast-1.amazonaws.com/dev/api/employee_leave_requests/leave_requests/");
        
        // Fetch employee performance data
        const performanceRes = await axios.get("https://x0crs910m2.execute-api.ap-southeast-1.amazonaws.com/dev/api/employee_performance/employee_performance/");
        
        // Update state with fetched data
        setEmployeeStats({
          total: totalEmployees,
          present: presentCount,
          absent: absentCount,
          late: lateCount,
          onLeave: onLeaveCount,
        });
        
        // Sort leave requests by start date (most recent first)
        const sortedLeaveRequests = leaveRequestsRes.data.sort((a, b) => 
          new Date(b.start_date) - new Date(a.start_date)
        );
        
        // Take only the most recent 5 leave requests
        setLeaveRequests(sortedLeaveRequests.slice(0, 5));
        
        // Sort employee performance by review date (most recent first)
        const sortedPerformance = performanceRes.data.sort((a, b) =>
          new Date(b.review_date) - new Date(a.review_date)
        );
        
        // Take only the most recent 5 performance records
        setEmployeePerformance(sortedPerformance.slice(0, 5));
        
        setError(null);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <div className="hr">
      <div className="hr-body-content-container">
        <div className="hr-dashboard-scrollable">
          <div className="hr-dashboard">
            <h2><strong>HR Dashboard</strong></h2>

            <div className="hr-layout">
              <div className="hr-left-column">
                <div className="hr-summary-container">
                  {/* Make this section clickable to navigate to Employees page */}
                  <div className="hr-summary-total" onClick={() => navigateTo('/employees')} style={{ cursor: 'pointer' }}>
                    <p className="hr-label">Total Employees</p>
                    <p className="hr-number">
                      {loading ? "Loading..." : employeeStats.total}
                    </p>
                  </div>
                  <div className="hr-summary-details">
                    {/* Make these boxes clickable to navigate to Attendance Tracking */}
                    <div className="hr-detail-box" onClick={() => navigateTo('/attendance')} style={{ cursor: 'pointer' }}>
                      <p className="hr-label">Present</p>
                      <p className="hr-number">
                        {loading ? "..." : employeeStats.present}
                      </p>
                      <p className="hr-sub-label">Employees</p>
                    </div>
                    <div className="hr-detail-box" onClick={() => navigateTo('/attendance')} style={{ cursor: 'pointer' }}>
                      <p className="hr-label">Absent</p>
                      <p className="hr-number">
                        {loading ? "..." : employeeStats.absent}
                      </p>
                      <p className="hr-sub-label">Employees</p>
                    </div>
                    <div className="hr-detail-box" onClick={() => navigateTo('/attendance')} style={{ cursor: 'pointer' }}>
                      <p className="hr-label">Late</p>
                      <p className="hr-number">
                        {loading ? "..." : employeeStats.late}
                      </p>
                      <p className="hr-sub-label">Employees</p>
                    </div>
                    <div className="hr-detail-box" onClick={() => navigateTo('/attendance')} style={{ cursor: 'pointer' }}>
                      <p className="hr-label">On Leave</p>
                      <p className="hr-number">
                        {loading ? "..." : employeeStats.onLeave}
                      </p>
                      <p className="hr-sub-label">Employees</p>
                    </div>
                  </div>
                </div>

                <div className="hr-candidates-section">
                  <div className="hr-section-header">
                    <h3><strong>Employee Performance</strong></h3>
                    <button 
                      className="hr-view-all-btn" 
                      onClick={() => navigateTo('/employee-performance')}
                    >
                      View All
                    </button>
                  </div>
                  <div className="hr-performance-table-container">
                    <table>
                      <thead>
                        <tr>
                          <th>Employee Name</th>
                          <th>Rating</th>
                          <th>Bonus Amount</th>
                          <th>Review Date</th>
                        </tr>
                      </thead>
                      <tbody className="hr-performance-tbody">
                        {loading ? (
                          <tr>
                            <td colSpan="4" style={{textAlign: "center"}}>Loading performance data...</td>
                          </tr>
                        ) : error ? (
                          <tr>
                            <td colSpan="4" style={{textAlign: "center"}}>Error loading performance data</td>
                          </tr>
                        ) : employeePerformance.length === 0 ? (
                          <tr>
                            <td colSpan="4" style={{textAlign: "center"}}>No performance records found</td>
                          </tr>
                        ) : (
                          employeePerformance.map((perf) => (
                            <tr key={perf.performance_id}>
                              <td>{perf.employee_name}</td>
                              <td>
                                <span className={`hr-tag rating-${perf.rating}`}>
                                  {RATING_LABELS[perf.rating] || perf.rating}
                                </span>
                              </td>
                              <td>{perf.bonus_amount}</td>
                              <td>{perf.review_date}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="hr-calendar-container">
                <div className="hr-section-header">
                  <h3><strong>Calendar</strong></h3>
                  <button 
                    className="hr-view-all-btn" 
                    onClick={() => navigateTo('/attendance')}
                  >
                    View All
                  </button>
                </div>
                <Calendar 
                  leaveRequests={leaveRequests} 
                  navigateTo={navigateTo} 
                />
              </div>
            </div>

            <div className="hr-leave-requests-section">
              <div className="hr-section-header">
                <h3><strong>Leave Requests</strong></h3>
                <button 
                  className="hr-view-all-btn" 
                  onClick={() => navigateTo('/leave-requests')}
                >
                  View All
                </button>
              </div>
              <div className="hr-leave-requests-table hr-table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th>Employee Name</th>
                      <th>Immediate Superior</th>
                      <th>Leave Type</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="6" style={{textAlign: "center"}}>Loading leave requests...</td>
                      </tr>
                    ) : error ? (
                      <tr>
                        <td colSpan="6" style={{textAlign: "center"}}>Error loading leave requests</td>
                      </tr>
                    ) : leaveRequests.length === 0 ? (
                      <tr>
                        <td colSpan="6" style={{textAlign: "center"}}>No leave requests found</td>
                      </tr>
                    ) : (
                      leaveRequests.map((lr) => (
                        <tr key={lr.leave_id}>
                          <td>{lr.employee_name}</td>
                          <td>{lr.immediate_superior_name}</td>
                          <td>
                            <span className={`hr-tag ${lr.leave_type.toLowerCase()}`}>
                              {lr.leave_type}
                            </span>
                          </td>
                          <td>{lr.start_date}</td>
                          <td>{lr.end_date}</td>
                          <td>
                            <span className={`hr-tag ${lr.status.toLowerCase().replace(/\s/g, "-")}`}>
                              {lr.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRDashboard;
