import React from 'react';
import "../styles/ManagementAssetRemoval.css";

function AssetRemoval() {
  const assets = [
    { id: 'A001', name: 'Laptop Model X', type: 'Computer', location: 'Office A', status: 'Pending' },
    { id: 'A002', name: 'Printer Model Y', type: 'Printer', location: 'Office B', status: 'Approved' },
    { id: 'A003', name: 'Projector Model Z', type: 'Projector', location: 'Meeting Room', status: 'Denied' },
    // Add more assets as needed
  ];

  return (
    <div className="asset-removal-container">
      <h1 className="asset-removal-header">Asset Removal</h1>
      <div className="asset-removal-search">
        <input type="text" placeholder="Search Assets..." />
      </div>
      <table className="asset-removal-table">
        <thead>
          <tr>
            <th>Asset ID</th>
            <th>Name</th>
            <th>Type</th>
            <th>Location</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {assets.map(asset => (
            <tr key={asset.id}>
              <td>{asset.id}</td>
              <td>{asset.name}</td>
              <td>{asset.type}</td>
              <td>{asset.location}</td>
              <td>
                <div className="asset-removal-status-dropdown">
                  <button>{asset.status}</button>
                  <div className="asset-removal-status-dropdown-content">
                    <a href="#">Pending</a>
                    <a href="#">Approved</a>
                    <a href="#">Denied</a>
                  </div>
                </div>
              </td>
              <td>
                <button className="asset-removal-actions">Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AssetRemoval;