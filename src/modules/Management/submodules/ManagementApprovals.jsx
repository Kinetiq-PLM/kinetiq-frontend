import React, { useState } from 'react';
import "../styles/ManagementApprovals.css";
import "../styles/ManagementDashboard.css";

function ManagementApprovals() {
  const [formData, setFormData] = useState({
    formId: '',
    requisitionForm: '',
    name: '',
    position: '',
    department: '',
    date: '',
    requestTypes: [],
    otherRequest: '',
    policyAlignment: '',
    supportingDocuments: [],
    comments: '',
    decisionOutcome: '',
    remarks: '',
  });

  const [currentView, setCurrentView] = useState('form'); // Default view is the form

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (type, field) => {
    setFormData((prevState) => {
      const isSelected = prevState[field].includes(type);
      return {
        ...prevState,
        [field]: isSelected
          ? prevState[field].filter((item) => item !== type)
          : [...prevState[field], type],
      };
    });
  };

  const handleSave = () => {
    console.log('Form Data:', formData);
    alert('Form saved successfully!');
    setCurrentView('approvalProgress'); // Navigate to Approval Progress view
  };

  const handleNext = () => {
    console.log('Navigating to Compliance Validation...');
    setCurrentView('complianceValidation'); // Navigate to Compliance Validation view
  };

  const handleDecisionOutcome = () => {
    console.log('Navigating to Decision Outcome...');
    setCurrentView('decisionOutcome'); // Navigate to Decision Outcome view
  };

  const handleBack = () => {
    console.log('Navigating back...');
    setCurrentView('form'); // Navigate back to the form
  };

  if (currentView === 'approvalProgress') {
    return (
      <div className="management-approvals">
        <h2 className="section-title">Approval Progress</h2>
        <p>Approval progress details go here...</p>
        <div className="form-buttons">
          <button className="back-button" onClick={handleBack}>
            Back
          </button>
          <button className="save-button" onClick={handleNext}>
            Next
          </button>
        </div>
      </div>
    );
  }

  if (currentView === 'complianceValidation') {
    return (
      <div className="management-approvals">
        <h2 className="section-title">Compliance Validation</h2>
        <div className="form-row">
          <div className="form-group">
            <label>Policy Alignment:</label>
            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={formData.policyAlignment === 'Compliant'}
                  onChange={() =>
                    setFormData({ ...formData, policyAlignment: 'Compliant' })
                  }
                />
                Compliant
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={formData.policyAlignment === 'Not Compliant'}
                  onChange={() =>
                    setFormData({ ...formData, policyAlignment: 'Not Compliant' })
                  }
                />
                Not Compliant
              </label>
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Supporting Documents:</label>
            <div className="checkbox-group">
              {['Quotation', 'Project Plan', 'Budget Plan', 'Policy Copy', 'Others'].map(
                (doc) => (
                  <label key={doc}>
                    <input
                      type="checkbox"
                      checked={formData.supportingDocuments.includes(doc)}
                      onChange={() => handleCheckboxChange(doc, 'supportingDocuments')}
                    />
                    {doc}
                  </label>
                )
              )}
            </div>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="comments">Comments:</label>
          <textarea
            id="comments"
            name="comments"
            value={formData.comments}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-buttons">
          <button className="back-button" onClick={handleBack}>
            Cancel
          </button>
          <button className="save-button" onClick={handleDecisionOutcome}>
            Save
          </button>
        </div>
      </div>
    );
  }

  if (currentView === 'decisionOutcome') {
    return (
      <div className="management-approvals">
        <h2 className="section-title">Decision Outcome</h2>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="decisionOutcome">Decision Outcome:</label>
            <select
              id="decisionOutcome"
              name="decisionOutcome"
              value={formData.decisionOutcome}
              onChange={handleInputChange}
            >
              <option value="">Choices...</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="remarks">Remarks:</label>
          <textarea
            id="remarks"
            name="remarks"
            value={formData.remarks}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-buttons">
          <button className="back-button" onClick={handleBack}>
            Cancel
          </button>
          <button className="save-button" onClick={() => alert('Decision saved!')}>
            Save
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="management-approvals">
      {/* First Section */}
      <div className="form-section">
        <h2 className="section-title">Requisition Form</h2>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="formId">Form ID:</label>
            <input
              type="text"
              id="formId"
              name="formId"
              value={formData.formId}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="requisitionForm">Requisition Form:</label>
            <input
              type="text"
              id="requisitionForm"
              name="requisitionForm"
              value={formData.requisitionForm}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <h3 className="subsection-title">Requestor Information</h3>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="position">Position:</label>
            <input
              type="text"
              id="position"
              name="position"
              value={formData.position}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="department">Department/Section:</label>
            <select
              id="department"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
            >
              <option value="">Choices...</option>
              <option value="Purchase">Purchase</option>
              <option value="Project Proposal">Project Proposal</option>
              <option value="Service">Service</option>
              <option value="Salary Release">Salary Release</option>
              <option value="Stock Transfer">Stock Transfer</option>
              <option value="Asset Removal">Asset Removal</option>
              <option value="Delivery Request">Delivery Request</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="date">Date / Request:</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="form-buttons">
        <button className="back-button" onClick={handleBack}>
          Back
        </button>
        <button className="save-button" onClick={handleSave}>
          Save
        </button>
      </div>
    </div>
  );
}

export default ManagementApprovals;