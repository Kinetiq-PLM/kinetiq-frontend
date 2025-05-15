import React, { useState } from 'react';
import "../styles/ManagementDashboard.css";

function ManagementDashboard() {
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [currentView, setCurrentView] = useState('requestInfo'); // Default view to Request Info
  const [searchKeyword, setSearchKeyword] = useState(''); // State for search input

  // Dummy data for Request Info
  const requestsData = [
    { id: 'REQ-2024-001', type: 'Laptop Provision', description: 'Dell XPS 15', status: 'In Review', dateSubmitted: '2024-04-30', justification: 'Employee needs a new laptop for work.' },
    { id: 'REQ-2024-002', type: 'Software Installation', description: 'Adobe Photoshop', status: 'Pending', dateSubmitted: '2024-05-01', justification: 'Design team requires Photoshop.' },
    { id: 'REQ-2024-003', type: 'Hardware Repair', description: 'Printer Maintenance', status: 'Approved', dateSubmitted: '2024-04-28', justification: 'Printer is malfunctioning.' },
    { id: 'REQ-2024-004', type: 'Network Setup', description: 'Office Wi-Fi Configuration', status: 'Rejected', dateSubmitted: '2024-04-25', justification: 'Initial request was incomplete.' },
    { id: 'REQ-2024-005', type: 'Office Supplies', description: 'Purchase of stationery', status: 'Pending', dateSubmitted: '2024-05-02', justification: 'Restocking office supplies.' },
  ];

  // Dummy data for Approval Progress
  const approvalProgressData = [
    { id: 'REQ-2024-001', step: 'Manager Approval', status: 'Completed', approver: 'John Doe', date: '2024-04-28' },
    { id: 'REQ-2024-002', step: 'Finance Validation', status: 'Pending', approver: 'Jane Smith', date: '2024-05-01' },
    { id: 'REQ-2024-003', step: 'IT Approval', status: 'Completed', approver: 'Michael Brown', date: '2024-04-27' },
    { id: 'REQ-2024-004', step: 'HR Validation', status: 'Rejected', approver: 'Sarah Johnson', date: '2024-04-25' },
    { id: 'REQ-2024-005', step: 'Procurement Approval', status: 'Pending', approver: 'Emily Davis', date: '2024-05-02' },
  ];

  // Dummy data for Final Decisions
  const finalDecisions = [
    { id: 'REQ-2024-001', decision: 'Approved', comments: 'Laptop provision approved for work.' },
    { id: 'REQ-2024-002', decision: 'Rejected', comments: 'Incomplete request details.' },
    { id: 'REQ-2024-003', decision: 'Pending', comments: 'Awaiting manager approval.' },
    { id: 'REQ-2024-004', decision: 'Approved', comments: 'Wi-Fi configuration approved.' },
    { id: 'REQ-2024-005', decision: 'Rejected', comments: 'Budget exceeded for stationery.' },
  ];

  // Filtered data based on search keyword and current view
  const getFilteredData = () => {
    const data =
      currentView === 'requestInfo'
        ? requestsData
        : currentView === 'approvalProgress'
        ? approvalProgressData
        : finalDecisions;

    return data.filter((item) =>
      Object.values(item).some((value) =>
        value.toString().toLowerCase().includes(searchKeyword.toLowerCase())
      )
    );
  };

  const handleSearchChange = (e) => {
    setSearchKeyword(e.target.value); // Update search keyword state
  };

  const handleViewDetailsClick = (requestId) => { 
    setSelectedRequestId(requestId);
  };
 
  const handleBackToList = () => { 
    setSelectedRequestId(null);
  }; 

  const filteredData = getFilteredData();

  if (selectedRequestId) {
    const selectedRequest =
      currentView === 'requestInfo'
        ? requestsData.find((req) => req.id === selectedRequestId)
        : currentView === 'approvalProgress'
        ? approvalProgressData.find((req) => req.id === selectedRequestId)
        : finalDecisions.find((req) => req.id === selectedRequestId);

    return (
      <div className="app-container">
        <div className="header">
          <div className="header-left">Management &gt; {currentView} &gt; Details</div>
        </div>
        <div className="details-view">
          <h2 className="details-title">Details for {selectedRequestId}</h2>
          <div className="details-info">
            {Object.entries(selectedRequest).map(([key, value]) => (
              <p key={key}>
                <strong>{key.replace(/([A-Z])/g, ' $1').toUpperCase()}:</strong> {value}
              </p>
            ))}
          </div>
          <button onClick={handleBackToList} className="back-to-list-button">
            Back to List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="header">
        <div className="header-left">Management Dashboard</div>
        <div className="header-right">
          <input
            type="text"
            placeholder="Search..."
            className="search-input"
            value={searchKeyword}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <div className="approval-actions">
        <div
          className={`action-card ${currentView === 'requestInfo' ? 'active' : ''}`}
          onClick={() => setCurrentView('requestInfo')}
        >
          <div className="action-icon">👤</div>
          <h3 className="action-title">Request Info</h3>
          <p className="action-description">View, requestor name, request type, justification</p>
        </div> 

        <div
          className={`action-card ${currentView === 'approvalProgress' ? 'active' : ''}`}
          onClick={() => setCurrentView('approvalProgress')}
        >
          <div className="action-icon">📊</div>
          <h3 className="action-title">Approval Progress</h3>
          <p className="action-description">Track validation results, current approver/route</p>
        </div> 

        <div
          className={`action-card ${currentView === 'finalDecision' ? 'active' : ''}`}
          onClick={() => setCurrentView('finalDecision')}
        >
          <div className="action-icon">✅</div>
          <h3 className="action-title">Final Decision</h3>
          <p className="action-description">See approved/rejected status final comments</p>
        </div> 
      </div>

      <div className="main-content">
        <h2 className="section-title">{currentView === 'requestInfo' ? 'Request Info' : currentView === 'approvalProgress' ? 'Approval Progress' : 'Final Decision'}</h2>
        <div className="table-container">
          <table className="request-table">
            <thead>
              <tr>
                {Object.keys(filteredData[0] || {}).map((key) => (
                  <th key={key}>{key.replace(/([A-Z])/g, ' $1').toUpperCase()}</th>
                ))}
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id}>
                  {Object.values(item).map((value, idx) => (
                    <td key={idx}>{value}</td>
                  ))}
                  <td>
                    <button
                      className="view-details-button"
                      onClick={() => handleViewDetailsClick(item.id)}
                    >
                      View Details
                    </button>
                  </td>
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