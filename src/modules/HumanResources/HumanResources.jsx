import React from "react";
import "./styles/HumanResources.css";

const HRDashboard = () => {
  const employees = {
    total: 143,
    present: 101,
    absent: 16,
    halfDay: 14,
    onLeave: 12,
  };

  const candidates = [
    { id: "C001", 
      firstName: "Miranda", 
      lastName: "Kerr", 
      applied: "2025-03-03 10:00:00" },
    { id: "C002", 
      firstName: "Chloe", 
      lastName: "Reyes", 
      applied: "2025-03-03 10:00:00" },
  ];

  const interviewsToday = [
    { name: "Miranda Kerr", time: "10:30–11:30 AM" },
    { name: "Jack Acosta", time: "12:00–01:00 PM" },
  ];

  const leaveRequests = [
    {
      empId: "E001",
      leaveId: "L001",
      type: "Vacation",
      start: "2025-03-12",
      end: "2025-03-14",
      status: "Rejected by Management",
    },
    {
      empId: "E002",
      leaveId: "L002",
      type: "Sick",
      start: "2025-03-12",
      end: "2025-03-13",
      status: "Approved by Management",
    },
    {
      empId: "E003",
      leaveId: "L003",
      type: "Sick",
      start: "2025-03-12",
      end: "2025-03-12",
      status: "Approved by Management",
    },
  ];

  return (
    <div className="hr">
      <div className="hr-body-content-container">
        <div className="hr-dashboard-scrollable">
          <div className="hr-dashboard">
            <h2><strong>HR Dashboard</strong></h2>

            <div className="hr-layout">
              <div className="hr-left-column">
                <div className="hr-summary-container">
                  <div className="hr-summary-total">
                    <p className="hr-label">Total Employees</p>
                    <p className="hr-number">{employees.total}</p>
                  </div>
                  <div className="hr-summary-details">
                    <div className="hr-detail-box">
                      <p className="hr-label">Present</p>
                      <p className="hr-number">{employees.present}</p>
                      <p className="hr-sub-label">Employees</p>
                    </div>
                    <div className="hr-detail-box">
                      <p className="hr-label">Absent</p>
                      <p className="hr-number">{employees.absent}</p>
                      <p className="hr-sub-label">Employees</p>
                    </div>
                    <div className="hr-detail-box">
                      <p className="hr-label">Half-Day</p>
                      <p className="hr-number">{employees.halfDay}</p>
                      <p className="hr-sub-label">Employees</p>
                    </div>
                    <div className="hr-detail-box">
                      <p className="hr-label">On Leave</p>
                      <p className="hr-number">{employees.onLeave}</p>
                      <p className="hr-sub-label">Employees</p>
                    </div>
                  </div>
                </div>

                <div className="hr-candidates-section">
                  <h3><strong>Candidates</strong></h3>
                  <div className="hr-table-scroll">
                    <table>
                      <thead>
                        <tr>
                          <th>Candidate ID</th>
                          <th>First Name</th>
                          <th>Last Name</th>
                          <th>Date Applied</th>
                        </tr>
                      </thead>
                      <tbody>
                        {candidates.map((c) => (
                          <tr key={c.id}>
                            <td>{c.id}</td>
                            <td>{c.firstName}</td>
                            <td>{c.lastName}</td>
                            <td>{c.applied}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="hr-interview-calendar">
                <h3><strong>Interviews</strong></h3>
                <div className="hr-calendar-box">
                  <p>[Calendar Component Here]</p>
                </div>
                <div className="hr-interviews-today">
                  <h4>Today</h4>
                  {interviewsToday.map((int, idx) => (
                    <div key={idx} className="hr-interview-item">
                      <span className="hr-tag">Job Interview</span>
                      <span>{int.name}</span>
                      <span>{int.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="hr-leave-requests-section">
              <h3><strong>Leave Requests</strong></h3>
              <div className="hr-leave-requests-table">
                <table>
                  <thead>
                    <tr>
                      <th>Emp ID</th>
                      <th>Leave ID</th>
                      <th>Leave Type</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaveRequests.map((lr, idx) => (
                      <tr key={idx}>
                        <td>{lr.empId}</td>
                        <td>{lr.leaveId}</td>
                        <td>
                          <span className={`hr-tag ${lr.type.toLowerCase()}`}>
                            {lr.type}
                          </span>
                        </td>
                        <td>{lr.start}</td>
                        <td>{lr.end}</td>
                        <td>
                          <span className={`hr-tag ${lr.status.toLowerCase().replace(/\s/g, "-")}`}>
                            {lr.status}
                          </span>
                        </td>
                      </tr>
                    ))}
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
