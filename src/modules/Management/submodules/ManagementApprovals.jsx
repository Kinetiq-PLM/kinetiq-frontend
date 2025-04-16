import React, { useState } from 'react';
import "../styles/ManagementApprovals.css";

function Approvals() {
  const [approvalStatus, setApprovalStatus] = useState('');

  const handleStatusChange = (event) => {
    setApprovalStatus(event.target.value);
  };

  return (
    <div className="approvals-container">
      <div className="header">
        <span className="management-text">Management</span>
        <span>&gt;</span>
        <span className="approvals-text">Approvals</span>
        <div className="search-bar">
          <input type="text" placeholder="Search..." />
        </div>
        <div className="notification">
          {/* Notification icon */}
        </div>
        <div className="user-profile">
          <span>ZodiacLover</span>
        </div>
      </div>

      <div className="content">
        <h1>Approvals</h1>

        <div className="search-id">
          <input type="text" placeholder="Search ID..." />
        </div>

        <div className="filter-options">
          <select>
            <option>Last 30 Days</option>
            {/* Add other date range options */}
          </select>
          <select>
            <option>Filter By...</option>
            {/* Add other filter options */}
          </select>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label>Approval ID</label>
            <input type="text" />
          </div>
          <div className="form-group">
            <label>Request ID</label>
            <select>
              <option>...</option>
              {/* Add request IDs */}
            </select>
          </div>
          <div className="form-group">
            <label>Decision Date</label>
            <input type="text" />
          </div>
          <div className="form-group">
            <label>External Module ID</label>
            <select>
              <option>...</option>
              {/* Add external module IDs */}
            </select>
          </div>
          <div className="form-group">
            <label>Issue Date</label>
            <input type="text" />
          </div>
          <div className="form-group">
            <label>Checked By</label>
            <input type="text" />
          </div>
          <div className="form-group">
            <label>Due Date</label>
            <input type="text" />
          </div>
          <div className="form-group">
            <label>Checked Date</label>
            <input type="text" />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select value={approvalStatus} onChange={handleStatusChange}>
              <option value="">Select Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="denied">Denied</option>
            </select>
          </div>
          <div className="form-group remarks">
            <label>Remarks</label>
            <textarea></textarea>
          </div>
        </div>

        <div className="form-actions">
          <button className="back-button">Back</button>
          <button className="save-button">Save</button>
        </div>
      </div>
    </div>
  );
}

 export default Approvals;