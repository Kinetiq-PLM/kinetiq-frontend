import React from 'react';
import "../styles/ManagementPurchasingApproval.css";


function PurchasingApproval() {
  return (
    <div className="purchasing-approval-container">
      <h1 className="purchasing-approval-header">Purchasing Approval</h1>
      <div className="purchasing-approval-search-bar">
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
      <table className="purchasing-approval-table">
        <thead>
          <tr>
            <th></th> {/* Checkbox column */}
            <th>Purchase Req ID</th>
            <th>Vendor Details</th>
            <th>Item Description</th>
            <th>Quantity</th>
            <th>Cost Breakdown</th>
            <th>Approval Status</th>
            <th>Justification</th>
          </tr>
        </thead>
        <tbody>
          {/* Table Data - Replace with actual data if needed */}
          <tr>
            <td className="purchasing-approval-checkbox"><input type="checkbox" /></td>
            <td>123</td>
            <td>Vendor A</td>
            <td>Item X</td>
            <td>10</td>
            <td>$1000</td>
            <td>
              <div className="purchasing-approval-status-dropdown">
                <button>Pending</button>
                <div className="purchasing-approval-status-dropdown-content">
                  <a href="#">Pending</a>
                  <a href="#">Approved</a>
                  <a href="#">Denied</a>
                </div>
              </div>
            </td>
            <td>Need for project</td>
          </tr>
          {/* Add more rows as needed */}
          <tr>
            <td className="purchasing-approval-checkbox"><input type="checkbox" /></td>
            <td>456</td>
            <td>Vendor B</td>
            <td>Item Y</td>
            <td>5</td>
            <td>$500</td>
            <td>
              <div className="purchasing-approval-status-dropdown">
                <button>Approved</button>
                <div className="purchasing-approval-status-dropdown-content">
                  <a href="#">Pending</a>
                  <a href="#">Approved</a>
                  <a href="#">Denied</a>
                </div>
              </div>
            </td>
            <td>Stock replenishment</td>
          </tr>
          {/* Add more rows as needed */}
        </tbody>
      </table>
      <div className="purchasing-approval-actions">
        <button className="back">Back</button>
      </div>
    </div>
  );
}


export default PurchasingApproval;
