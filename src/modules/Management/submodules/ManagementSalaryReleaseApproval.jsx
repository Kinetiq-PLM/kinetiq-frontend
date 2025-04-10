import React from 'react';
import "../styles/ManagementSalaryReleaseApproval.css";


function SalaryApproval() {
  return (
    <div className="salary-approval-container">
      <h1 className="salary-approval-header">Salary Release Approval</h1>
      <div className="salary-approval-search-bar">
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
      <div className="salary-approval-form">
        <div className="form-row">
          <div>
            <label>Employee ID</label>
            <input type="text" />
          </div>
          <div>
            <label>Name</label>
            <input type="text" />
          </div>
        </div>
        <div className="form-row">
          <div>
            <label>Position</label>
            <input type="text" />
          </div>
          <div>
            <label>Salary Amount</label>
            <input type="text" />
          </div>
        </div>
        <div className="form-row">
          <div>
            <label>Payment Date</label>
            <input type="text" />
          </div>
          <div>
            <label>Payroll Summary</label>
            <textarea rows="4"></textarea>
          </div>
        </div>
        <label>Compliance Status</label>
        <select>
          <option value="">Choices...</option>
          {/* Add compliance status options */}
        </select>
        <div className="form-actions">
          <button>Save</button>
        </div>
      </div>
      <table className="salary-approval-table">
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Employee Name</th>
            <th>Position</th>
            <th>Salary Amount</th>
            <th>Payment Date</th>
            <th>Payroll Summary</th>
            <th>Compliance Status</th>
          </tr>
        </thead>
        <tbody>
          {/* Table Data - Replace with actual data if needed */}
          <tr>
            <td>123</td>
            <td>John Doe</td>
            <td>Manager</td>
            <td>$5000</td>
            <td>2023-01-15</td>
            <td>Summary A</td>
            <td>Compliant</td>
          </tr>
         
 {/* Add more rows as needed */}
        </tbody>
      </table>
      <div className="salary-approval-actions">
        <button className="back">Back</button>
        <button className="select">Select</button>
      </div>
    </div>
  );
}


export default SalaryApproval;