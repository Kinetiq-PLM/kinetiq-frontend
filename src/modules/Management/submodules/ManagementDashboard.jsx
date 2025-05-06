import React, { useState } from 'react';
import "../styles/ManagementDashboard.css";


function App() {
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [currentView, setCurrentView] = useState('requestInfo'); // Default view to Request Info

  // Dummy data for Request Info
  const [requestsData] = useState([
    { id: 'REQ-2024-001', type: 'Laptop Provision', description: 'Dell XPS 15', status: 'In Review', dateSubmitted: '2024-04-30', justification: 'Employee needs a new laptop for work.' },
    { id: 'REQ-2024-002', type: 'Software Installation', description: 'Adobe Photoshop', status: 'Pending', dateSubmitted: '2024-05-01', justification: 'Design team requires Photoshop.' },
    { id: 'REQ-2024-003', type: 'Hardware Repair', description: 'Printer Maintenance', status: 'Approved', dateSubmitted: '2024-04-28', justification: 'Printer is malfunctioning.' },
    { id: 'REQ-2024-004', type: 'Network Setup', description: 'Office Wi-Fi Configuration', status: 'Rejected', dateSubmitted: '2024-04-25', justification: 'Initial request was incomplete.' },
    { id: 'REQ-2024-005', type: 'Account Access', description: 'Reset Password for Employee', status: 'Completed', dateSubmitted: '2024-04-20', justification: 'Employee forgot their password.' },
    { id: 'REQ-2024-006', type: 'Office Supplies', description: 'Purchase of stationery', status: 'Pending', dateSubmitted: '2024-05-02', justification: 'Restocking office supplies.' },
  ]);

  // Dummy data for Approval Progress
  const [approvalProgressData] = useState([
    { id: 'REQ-2024-001', approver: 'John Doe', status: 'In Review', step: 'Step 1: Manager Approval' },
    { id: 'REQ-2024-002', approver: 'Jane Smith', status: 'Pending', step: 'Step 2: IT Approval' },
    { id: 'REQ-2024-003', approver: 'Michael Brown', status: 'Approved', step: 'Step 3: Final Approval' },
    { id: 'REQ-2024-004', approver: 'Emily Davis', status: 'Rejected', step: 'Step 1: Manager Approval' },
    { id: 'REQ-2024-005', approver: 'Sarah Wilson', status: 'Completed', step: 'Step 3: Final Approval' },
    { id: 'REQ-2024-006', approver: 'David Johnson', status: 'Pending', step: 'Step 1: Manager Approval' },
  ]);

  // Dummy data for Final Decision
  const [finalDecisionData] = useState([
    { id: 'REQ-2024-001', decision: 'Approved', comments: 'Approved by Manager.' },
    { id: 'REQ-2024-002', decision: 'Pending', comments: 'Awaiting IT approval.' },
    { id: 'REQ-2024-003', decision: 'Approved', comments: 'All steps completed successfully.' },
    { id: 'REQ-2024-004', decision: 'Rejected', comments: 'Incomplete justification provided.' },
    { id: 'REQ-2024-005', decision: 'Completed', comments: 'Request fulfilled and closed.' },
    { id: 'REQ-2024-006', decision: 'Pending', comments: 'Awaiting Manager approval.' },
  ]);

  const handleViewDetailsClick = (requestId) => {
    console.log(`View details clicked for: ${requestId}`);
    setSelectedRequestId(requestId);
  };

  const handleBackToList = () => {
    console.log('Navigating back to Request Info list');
    setSelectedRequestId(null);
    setCurrentView('requestInfo');
  };

  const handleActionClick = (view) => {
    console.log(`Navigating to: ${view}`);
    setCurrentView(view);
    setSelectedRequestId(null); // Reset detailed view
  };

  if (selectedRequestId) {
    const selectedRequest = requestsData.find(req => req.id === selectedRequestId);
    return (
      <div className="app-container">
        <div className="header">
          <div className="header-left">Management &gt; Approve &gt; Details</div>
          <div className="header-right">
            <input type="text" placeholder="Search..." className="search-input" />
          </div>
        </div>
        <div className="details-view">
          {selectedRequest ? (
            <>
              <h2 className="details-title">Request Details</h2>
              <div className="details-info">
                <p><strong>Request ID:</strong> {selectedRequest.id}</p>
                <p><strong>Type:</strong> {selectedRequest.type}</p>
                <p><strong>Description:</strong> {selectedRequest.description}</p>
                <p><strong>Status:</strong> <span className={`status ${selectedRequest.status.toLowerCase().replace(' ', '-')}`}>{selectedRequest.status}</span></p>
                <p><strong>Date Submitted:</strong> {selectedRequest.dateSubmitted}</p>
                <p><strong>Justification:</strong> {selectedRequest.justification}</p>
              </div>
              <button onClick={handleBackToList} className="back-to-list-button">Back to List</button>
            </>
          ) : (
            <p>Loading details...</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="header">
        <div className="header-left">Management &gt; Approve</div>
        <div className="header-right">
          <input type="text" placeholder="Search..." className="search-input" />
        </div>
      </div>

      <div className="approval-actions">
        <div
          className={`action-card ${currentView === 'requestInfo' ? 'active' : ''}`}
          onClick={() => handleActionClick('requestInfo')}
        >
          <div className="action-icon">👤</div>
          <h3 className="action-title">Request Info</h3>
          <p className="action-description">View, requestor name, request type, justification</p>
          <button className="view-button">View Info</button>
        </div>

        <div
          className={`action-card ${currentView === 'approvalProgress' ? 'active' : ''}`}
          onClick={() => handleActionClick('approvalProgress')}
        >
          <div className="action-icon">📊</div>
          <h3 className="action-title">Approval Progress</h3>
          <p className="action-description">Track validation results, current approver/route</p>
          <button className="view-button">Track Progress</button>
        </div>

        <div
          className={`action-card ${currentView === 'finalDecision' ? 'active' : ''}`}
          onClick={() => handleActionClick('finalDecision')}
        >
          <div className="action-icon">✅</div>
          <h3 className="action-title">Final Decision</h3>
          <p className="action-description">See approved/rejected status final comments</p>
          <button className="view-button">See Decision</button>
        </div>
      </div>

      <div className="main-content">
        {currentView === 'requestInfo' && (
          <div className="content-view request-info-view">
            <h2 className="section-title">Request Info</h2>
            <div className="table-container">
              <table className="request-table">
                <thead>
                  <tr>
                    <th>Request ID</th>
                    <th>Type</th>
                    <th>Date Submitted</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {requestsData.map(request => (
                    <tr key={request.id}>
                      <td>{request.id}</td>
                      <td>{request.type}</td>
                      <td>{request.dateSubmitted}</td>
                      <td className={`status ${request.status.toLowerCase().replace(' ', '-')}`}>
                        {request.status}
                      </td>
                      <td>
                        <button
                          className="view-details-button"
                          onClick={() => handleViewDetailsClick(request.id)}
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
        )}

        {currentView === 'approvalProgress' && (
          <div className="content-view">
            <h2 className="section-title">Approval Progress</h2>
            <div className="table-container">
              <table className="request-table">
                <thead>
                  <tr>
                    <th>Request ID</th>
                    <th>Approver</th>
                    <th>Status</th>
                    <th>Step</th>
                  </tr>
                </thead>
                <tbody>
                  {approvalProgressData.map(progress => (
                    <tr key={progress.id}>
                      <td>{progress.id}</td>
                      <td>{progress.approver}</td>
                      <td className={`status ${progress.status.toLowerCase().replace(' ', '-')}`}>
                        {progress.status}
                      </td>
                      <td>{progress.step}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {currentView === 'finalDecision' && (
          <div className="content-view">
            <h2 className="section-title">Final Decision</h2>
            <div className="table-container">
              <table className="request-table">
                <thead>
                  <tr>
                    <th>Request ID</th>
                    <th>Decision</th>
                    <th>Comments</th>
                  </tr>
                </thead>
                <tbody>
                  {finalDecisionData.map(decision => (
                    <tr key={decision.id}>
                      <td>{decision.id}</td>
                      <td className={`status ${decision.decision.toLowerCase().replace(' ', '-')}`}>
                        {decision.decision}
                      </td>
                      <td>{decision.comments}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;