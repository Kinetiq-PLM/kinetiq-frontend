import React, { useState } from 'react';
import "../styles/ManagementApprovals.css";

function Approvals() {
  const [approvalStatus, setApprovalStatus] = useState('');
  const [formData, setFormData] = useState({
    approvalId: '',
    requestId: '',
    decisionDate: '',
    externalModuleId: '',
    issueDate: '',
    checkedBy: '',
    dueDate: '',
    checkedDate: '',
    remarks: '',
  });
  const [searchId, setSearchId] = useState('');
  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [filterBy, setFilterBy] = useState('Filter By...');
  const [approvalList, setApprovalList] = useState([
    {
      approvalId: '123',
      requestId: 'REQ456',
      decisionDate: '2023-11-15',
      externalModuleId: 'MOD789',
      issueDate: '2023-11-10',
      checkedBy: 'John Doe',
      dueDate: '2023-11-30',
      checkedDate: '2023-11-12',
      remarks: 'Approved',
      status: 'approved',
    },
    {
      approvalId: '456',
      requestId: 'REQ789',
      decisionDate: '2023-11-16',
      externalModuleId: 'MOD101',
      issueDate: '2023-11-11',
      checkedBy: 'Jane Smith',
      dueDate: '2023-12-01',
      checkedDate: '2023-11-13',
      remarks: 'Rejected',
      status: 'rejected',
    },
    // Add more initial approval data as needed
  ]);

  const handleStatusChange = (event) => {
    setApprovalStatus(event.target.value);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    console.log('Form Data:', formData);
    console.log('Approval Status:', approvalStatus);
    // Add your save logic here (e.g., API call)
  };

  const handleBack = () => {
    // Add your back button logic here (e.g., navigation)
    console.log("Back button clicked");
  };

  const handleSearchIdChange = (event) => {
    setSearchId(event.target.value);
  };

  const handleDateRangeChange = (event) => {
    setDateRange(event.target.value);
  };

  const handleFilterByChange = (event) => {
    setFilterBy(event.target.value);
  }

  return (
    <div className="approvals-container">
      <div className="header">
        <div className="search-bar"></div>
        <div className="notification"></div>
        <div className="user-profile"></div>
      </div>


      <div className="content">
        <h1>Approvals</h1>


        <div className="search-id">
          <input type="text" placeholder="Search ID..." value={searchId} onChange={handleSearchIdChange} />
        </div>


        <div className="filter-options">
          <select value={dateRange} onChange={handleDateRangeChange}>
            <option>Last 30 Days</option>
            {/* Add other date range options */}
          </select>
          <select value={filterBy} onChange={handleFilterByChange}>
            <option>Filter By...</option>
            {/* Add other filter options */}
          </select>
        </div>


        <div className="form-grid">
          <div className="form-group">
            <label>Approval ID</label>
            <input type="text" name="approvalId" value={formData.approvalId} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label>Request ID</label>
            <input type="text" name="requestId" value={formData.requestId} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label>Decision Date</label>
            <input type="date" name="decisionDate" value={formData.decisionDate} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label>External Module ID</label>
            <input type="text" name="externalModuleId" value={formData.externalModuleId} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label>Issue Date</label>
            <input type="date" name="issueDate" value={formData.issueDate} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label>Checked By</label>
            <input type="text" name="checkedBy" value={formData.checkedBy} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label>Due Date</label>
            <input type="date" name="dueDate" value={formData.dueDate} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label>Checked Date</label>
            <input type="date" name="checkedDate" value={formData.checkedDate} onChange={handleInputChange} />
          </div>
          <div className="form-group status-group">
            <label>Status</label>
            <div className="status-select-container">
              <select value={approvalStatus} onChange={handleStatusChange}>
                <option value="">Select Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
                {/* Add more option for scroll test */}
                <option value="extra1">Extra Option 1</option>
                <option value="extra2">Extra Option 2</option>
                <option value="extra3">Extra Option 3</option>
                <option value="extra4">Extra Option 4</option>
                <option value="extra5">Extra Option 5</option>
                <option value="extra6">Extra Option 6</option>
                <option value="extra7">Extra Option 7</option>
                <option value="extra8">Extra Option 8</option>
                <option value="extra9">Extra Option 9</option>
                <option value="extra10">Extra Option 10</option>
              </select>
            </div>
          </div>
          <div className="form-group remarks">
            <label>Remarks</label>
            <textarea name="remarks" value={formData.remarks} onChange={handleInputChange}></textarea>
          </div>
        </div>


        <div className="form-actions">
          <button className="back-button" onClick={handleBack}>Back</button>
          <button className="save-button" onClick={handleSave}>Save</button>
        </div>


        {/* Table List */}
        <div className="Full-list">
          <h2>Full List</h2>
          <table className="requests-table-container">
            <thead>
              <tr>
                <th>Approval ID</th>
                <th>Request ID</th>
                <th>Decision Date</th>
                <th>External Module ID</th>
                <th>Issue Date</th>
                <th>Checked By</th>
                <th>Due Date</th>
                <th>Checked Date</th>
                <th>Remarks</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody className="table-body-scroll">
              {approvalList.map((approval) => (
                <tr key={approval.approvalId}>
                  <td>{approval.approvalId}</td>
                  <td>{approval.requestId}</td>
                  <td>{approval.decisionDate}</td>
                  <td>{approval.externalModuleId}</td>
                  <td>{approval.issueDate}</td>
                  <td>{approval.checkedBy}</td>
                  <td>{approval.dueDate}</td>
                  <td>{approval.checkedDate}</td>
                  <td>{approval.remarks}</td>
                  <td>{approval.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


export default Approvals;