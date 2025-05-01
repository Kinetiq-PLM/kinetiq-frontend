import React, { useState } from 'react';
import "../styles/ManagementDashboard.css";

function ManagementDashboard() {
  // Dummy data for approvals (at least 10 entries)
  const approvals = [
    { approvalId: 'APP-001', requestId: 'REQ-101', externalId: 'EXT-501', issueDate: '2024-03-15', checkedBy: 'John Doe', checkedDate: '2024-03-16', status: 'Pending', dueDate: '2024-03-22', remarks: 'Awaiting final review' },
    { approvalId: 'APP-002', requestId: 'REQ-102', externalId: 'EXT-502', issueDate: '2024-03-16', checkedBy: 'Jane Smith', checkedDate: '2024-03-17', status: 'Pending', dueDate: '2024-03-23', remarks: 'Needs further clarification' },
    { approvalId: 'APP-003', requestId: 'REQ-103', externalId: 'EXT-503', issueDate: '2024-03-17', checkedBy: 'Alice Johnson', checkedDate: '2024-03-18', status: 'Pending', dueDate: '2024-03-24', remarks: 'Ready for final approval' },
    { approvalId: 'APP-004', requestId: 'REQ-104', externalId: 'EXT-504', issueDate: '2024-03-18', checkedBy: 'Bob Williams', checkedDate: '2024-03-19', status: 'Pending', dueDate: '2024-03-25', remarks: 'Pending document verification' },
    { approvalId: 'APP-005', requestId: 'REQ-105', externalId: 'EXT-505', issueDate: '2024-03-19', checkedBy: 'Charlie Brown', checkedDate: '2024-03-20', status: 'Pending', dueDate: '2024-03-26', remarks: 'Waiting for manager review' },
    { approvalId: 'APP-006', requestId: 'REQ-106', externalId: 'EXT-506', issueDate: '2024-03-20', checkedBy: 'Diana Miller', checkedDate: '2024-03-21', status: 'Pending', dueDate: '2024-03-27', remarks: 'Clarification required' },
    { approvalId: 'APP-007', requestId: 'REQ-107', externalId: 'EXT-507', issueDate: '2024-03-21', checkedBy: 'Eva Davis', checkedDate: '2024-03-22', status: 'Pending', dueDate: '2024-03-28', remarks: 'Ready for processing' },
    { approvalId: 'APP-008', requestId: 'REQ-108', externalId: 'EXT-508', issueDate: '2024-03-22', checkedBy: 'Frank Wilson', checkedDate: '2024-03-23', status: 'Pending', dueDate: '2024-03-29', remarks: 'Documentation incomplete' },
    { approvalId: 'APP-009', requestId: 'REQ-109', externalId: 'EXT-509', issueDate: '2024-03-23', checkedBy: 'Grace Moore', checkedDate: '2024-03-24', status: 'Pending', dueDate: '2024-03-30', remarks: 'Awaiting client feedback' },
    { approvalId: 'APP-010', requestId: 'REQ-110', externalId: 'EXT-510', issueDate: '2024-03-24', checkedBy: 'Henry Taylor', checkedDate: '2024-03-25', status: 'Pending', dueDate: '2024-03-31', remarks: 'Urgent review needed' },
    { approvalId: 'APP-011', requestId: 'REQ-111', externalId: 'EXT-511', issueDate: '2024-03-25', checkedBy: 'Isabella White', checkedDate: '2024-03-26', status: 'Pending', dueDate: '2024-04-01', remarks: 'Check for compliance' },
    { approvalId: 'APP-012', requestId: 'REQ-112', externalId: 'EXT-512', issueDate: '2024-03-26', checkedBy: 'Jack Harris', checkedDate: '2024-03-27', status: 'Pending', dueDate: '2024-04-02', remarks: 'Review payment details' },
  ];

  const handleApprovalClick = (approvalId) => {
    console.log(`Approval ID clicked: ${approvalId}`);
    // Implement your navigation or detail page logic here
  };

  return (
    <div className="dashboard-container">
      <div className="top-section">
        <div className="status-box approved">
          <p>Approved</p>
          <span>16</span>
        </div>
        <div className="status-box pending">
          <p>Pending</p>
          <span>{approvals.length}</span> {/* Display the actual number of pending approvals */}
        </div>
        <div className="status-box rejected">
          <p>Rejected</p>
          <span>8</span>
        </div>
      </div>

      <div className="requests-section">
        <h2>Latest Pending Approvals</h2>
        <div className="requests-table-container">
          <table className="requests-table">
            <thead>
              <tr>
                <th>Approval ID</th>
                <th>Request ID</th>
                <th>External ID</th>
                <th>Issue Date</th>
                <th>Checked By</th>
                <th>Checked Date</th>
                <th>Status</th>
                <th>Due Date</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody className="table-body-scroll">
              {approvals.map((approval) => (
                <tr key={approval.approvalId}>
                  <td>
                    <button 
                      className="approval-button" 
                      onClick={() => handleApprovalClick(approval.approvalId)}
                    >
                      {approval.approvalId}
                    </button>
                  </td>
                  <td>{approval.requestId}</td>
                  <td>{approval.externalId}</td>
                  <td>{approval.issueDate}</td>
                  <td>{approval.checkedBy}</td>
                  <td>{approval.checkedDate}</td>
                  <td>{approval.status}</td>
                  <td>{approval.dueDate}</td>
                  <td>{approval.remarks}</td>
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