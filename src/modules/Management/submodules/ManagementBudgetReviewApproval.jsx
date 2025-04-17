import React from 'react';
import "../styles/ManagementBudgetReviewApproval.css";


function BudgetApproval() {
  return (
    <div className="budget-approval-container">
      <h1 className="budget-approval-header">Budget Review Approval</h1>
      <div className="budget-approval-search-bar">
        <input type="text" placeholder="Search ID..." />
        <select>
          <option value="last-30">Last 30 Days</option>
          {/* Add more filter options */}
        </select>
        <select>
          <option value="filter-by">Filter By...</option>
          {/* Add more filter options */}
        </select>
      </div>
      <div className="budget-approval-form">
        <div className="form-row">
          <div>
            <label>Budget ID</label>
            <input type="text" />
          </div>
          <div>
            <label>Department</label>
            <input type="text" />
          </div>
        </div>
        <div className="form-row">
          <div>
            <label>Requested Amount</label>
            <input type="text" />
          </div>
          <div>
            <label>Budget Date</label>
            <input type="text" />
          </div>
        </div>
        <div className="form-row">
          <div>
            <label>Allocated Budget</label>
            <input type="text" />
          </div>
          <div>
            <label>Justification</label>
            <textarea rows="4"></textarea>
          </div>
        </div>
        <label>Compliance Status</label>
        <select>
          <option value="">Choices...</option>
          <option value="compliant">Compliant</option>
          <option value="non-compliant">Non-Compliant</option>
          <option value="pending">Pending</option>
          {/* Add more compliance status options */}
        </select>
        <div className="form-actions">
          <button>Save</button>
        </div>
      </div>
      <table className="budget-approval-table">
        <thead>
          <tr>
            <th>Budget ID</th>
            <th>Department</th>
            <th>Request Amount</th>
            <th>Budget Date</th>
            <th>Allocated Budget</th>
            <th>Justification</th>
            <th>Compliance Status</th>
          </tr>
        </thead>
        <tbody>
          {/* Table Data - Replace with actual data if needed */}
          <tr>
            <td>123</td>
            <td>Finance</td>
            <td>$10000</td>
            <td>2023-01-15</td>
            <td>$9000</td>
            <td>Project budget</td>
            <td>Compliant</td>
          </tr>
          {/* Add more rows as needed */}
        </tbody>
      </table>
      <div className="budget-approval-actions">
        <button className="back">Back</button>
        <button className="select">Select</button>
      </div>
    </div>
  );
}

export default BudgetApproval;