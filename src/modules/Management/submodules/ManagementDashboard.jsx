import React, { useState, useEffect } from 'react';
import { approvalService } from '../components/Approvals/API.jsx';
import "../styles/ManagementDashboard.css";

function ManagementDashboard() {
  const [approvals, setApprovals] = useState([]);
  const [stats, setStats] = useState({ approved: 0, pending: 0, rejected: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchApprovals = async () => {
    try {
      setLoading(true);
      const data = await approvalService.fetchAll();

      // Map backend data to frontend structure
      const mappedData = data.map(item => ({
        approvalId: item.approval_id,
        requestId: item.request_id_all,
        externalId: item.external_id,
        issueDate: item.issue_date,
        checkedBy: item.checked_by,
        checkedDate: item.checked_date,
        status: item.status,
        dueDate: item.due_date,
        remarks: item.remarks
      }));

      setApprovals(mappedData);

      // Calculate stats
      const newStats = data.reduce((acc, curr) => {
        const status = curr.status.toLowerCase();
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, { approved: 0, pending: 0, rejected: 0 });

      setStats(newStats);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprovalClick = async (approvalId) => {
    try {
      const data = await approvalService.getById(approvalId);
      console.log('Approval details:', data);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="dashboard-container">
      <div className="top-section">
        <div className="status-box approved">
          <p>Approved</p>
          <span>{stats.approved}</span>
        </div>
        <div className="status-box pending">
          <p>Pending</p>
          <span>{stats.pending}</span>
        </div>
        <div className="status-box rejected">
          <p>Rejected</p>
          <span>{stats.rejected}</span>
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
