import React from 'react';
import "../styles/ManagementPolicyComplianceOversight.css";




function PolicyCompliance() {
  return (
    <div className="policy-compliance-container">
      <h1 className="policy-compliance-header">Policy & Compliance Oversight</h1>
      <div className="policy-compliance-search-bar">
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
      <div className="policy-compliance-form">
        <div className="form-row">
          <div>
            <label>Policy ID</label>
            <input type="text" />
          </div>
          <div>
            <label>Policy Name</label>
            <input type="text" />
          </div>
        </div>
        <div className="form-row">
          <div>
            <label>Effective Date</label>
            <input type="text" />
          </div>
          <div>
            <label>Last Update</label>
            <input type="text" />
          </div>
        </div>
        <label>Description</label>
        <textarea rows="4"></textarea>
        <label>Compliance Status</label>
        <select>
          <option value="">Choices...</option>
          {/* Add compliance status options */}
        </select>
        <div className="form-actions">
          <button>Save</button>
        </div>
      </div>
      <table className="policy-compliance-table">
        <thead>
          <tr>
            <th>Policy ID</th>
            <th>Policy Name</th>
            <th>Description</th>
            <th>Effective Date</th>
            <th>Last Update</th>
            <th>Compliance Status</th>
          </tr>
        </thead>
        <tbody>
          {/* Table Data - Replace with actual data if needed */}
          <tr>
            <td>123</td>
            <td>Policy A</td>
            <td>Description A</td>
            <td>2023-01-01</td>
            <td>2023-02-01</td>
            <td>Compliant</td>
          </tr>
          {/* Add more rows as needed */}
        </tbody>
      </table>
      <div className="policy-compliance-actions">
        <button className="back">Back</button>
        <button className="select">Select</button>
      </div>
    </div>
  );
}


export default PolicyCompliance;
