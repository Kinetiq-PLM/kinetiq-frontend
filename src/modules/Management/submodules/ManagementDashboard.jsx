import React, { useState } from 'react';
import "../styles/ManagementDashboard.css";

function ManagementDashboard() {
  // Dummy data for requests (replace with your actual data)
  const requests = [
    { id: 'REQ-001', department: 'HR', decisionDate: '2024-03-15', dueDate: '2024-03-22', status: 'Pending' },
    { id: 'REQ-002', department: 'Finance', decisionDate: '2024-03-16', dueDate: '2024-03-23', status: 'Pending' },
    // Add more requests as needed
  ];

  return (
    <div className="dashboard-container">
      <div className="top-section">
        <div className="status-box approved">
          <p>Approved</p>
          <span>16</span>
        </div>
        <div className="status-box pending">
          <p>Pending</p>
          <span>2</span>
        </div>
        <div className="status-box denied">
          <p>Denied</p>
          <span>8</span>
        </div>
      </div>

      <div className="requests-section">
        <h2>Latest Pending Requests/Approvals</h2>
        <div className="requests-table-container">
          <table className="requests-table">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Department</th>
                <th>Decision Date</th>
                <th>Due Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.id}>
                  <td>{request.id}</td>
                  <td>{request.department}</td>
                  <td>{request.decisionDate}</td>
                  <td>{request.dueDate}</td>
                  <td>{request.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

 export default ManagementDashboard;