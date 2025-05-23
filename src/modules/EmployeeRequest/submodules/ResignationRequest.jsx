import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/ResignationRequest.css"; 

const ResignationRequest = () => {
  // Form state
  const [formData, setFormData] = useState({
    employee: "",
    submission_date: new Date().toISOString().split('T')[0], // Today's date
    notice_period_days: 30, // Default to 30 days
    reason: "",
  });

  // Document upload state
  const [resignationLetter, setResignationLetter] = useState(null);
  const [uploadingStatus, setUploadingStatus] = useState('idle');
  
  // UI states
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [employees, setEmployees] = useState([]); // New state for employees list
  const [fetchingEmployees, setFetchingEmployees] = useState(false); // Loading state for employees
  
  // Fetch employees on component mount
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setFetchingEmployees(true);
        const response = await axios.get("http://127.0.0.1:8000/api/employees");
        // Filter only active employees
        const activeEmployees = response.data.filter(emp => emp.status === "Active");
        setEmployees(activeEmployees);
      } catch (err) {
        console.error("Error fetching employees:", err);
        showToast("Failed to load employee list", false);
      } finally {
        setFetchingEmployees(false);
      }
    };
    
    fetchEmployees();
  }, []);
  
  // Toast message helper
  const showToast = (message, success = true) => {
    setToast({ message, success });
    setTimeout(() => setToast(null), 3000);
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for employee selection
    if (name === "employee" && value) {
      setFormData(prev => ({
        ...prev,
        employee: value
      }));
      return;
    }
    
    // Normal handling for other fields
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle file change
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setResignationLetter(e.target.files[0]);
    }
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.employee || !formData.notice_period_days || !formData.reason) {
      showToast("Please fill all required fields", false);
      return;
    }
    
    try {
      setLoading(true);
      setUploadingStatus('uploading');
      
      // Prepare documents data if a resignation letter is attached
      let documents = null;
      
      if (resignationLetter) {
        // Define S3 directory path for the document
        const S3_DIRECTORY = `Human_Resource_Management/Resignations/${formData.employee}/`;
        
        // Step 1: Get presigned URL from API
        const getUrlResponse = await axios.post(
          'https://s9v4t5i8ej.execute-api.ap-southeast-1.amazonaws.com/dev/api/upload-to-s3/', 
          {
            filename: resignationLetter.name,
            directory: S3_DIRECTORY,
            contentType: resignationLetter.type
          }
        );
        
        const { uploadUrl, fileUrl: documentUrl } = getUrlResponse.data;
        
        // Step 2: Upload file to S3 using the presigned URL
        await axios.put(uploadUrl, resignationLetter, {
          headers: {
            'Content-Type': resignationLetter.type
          }
        });
        
        // Create documents JSON object
        documents = {
          resignation_letter: documentUrl
        };
      }
      
      // Step 3: Submit resignation request with updated fields
      const payload = {
        employee: formData.employee,
        notice_period_days: parseInt(formData.notice_period_days),
        reason: formData.reason,
        documents: documents,
        submission_date: new Date().toISOString()
      };
      
      // Submit to the new API endpoint
      await axios.post(
        "http://127.0.0.1:8000/api/resignation/",
        payload
      );
      
      showToast("Resignation request submitted successfully", true);
      setSubmitted(true);
      
      // Reset form
      setFormData({
        employee: "",
        submission_date: new Date().toISOString().split('T')[0],
        notice_period_days: 30,
        reason: "",
      });
      setResignationLetter(null);
      
    } catch (err) {
      console.error("Error submitting resignation:", err);
      const errorMessage = err.response?.data?.detail || 
                         Object.values(err.response?.data || {}).flat().join(", ") || 
                         "Failed to submit resignation request";
      showToast(errorMessage, false);
    } finally {
      setLoading(false);
      setUploadingStatus('idle');
    }
  };

  return (
    <div className="resig-req">
      <div className="body-content-container">
        <div className="resig-req-scrollable">
          <div className="resig-req-heading">
            <h2><strong>Resignation Request Form</strong></h2>
          </div>
          
          {submitted ? (
            <div className="resig-req-success-container">
              <h3>Resignation Request Submitted</h3>
              <p>Your resignation request has been submitted successfully.</p>
              <button 
                onClick={() => setSubmitted(false)} 
                className="resig-req-new-button"
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <div className="resig-req-form-container">
              <form onSubmit={handleSubmit} className="resig-req-form">
                {/* Form fields - 2 column layout */}
                <div className="resig-req-form-columns">
                  <div className="resig-req-form-column">
                    <div className="resig-req-form-group">
                      <label>Employee *</label>
                      {fetchingEmployees ? (
                        <div className="resig-req-loading-dropdown">Loading employees...</div>
                      ) : (
                        <select
                          name="employee"
                          value={formData.employee}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">-- Select Employee --</option>
                          {employees.map(emp => (
                            <option key={emp.employee_id} value={emp.employee_id}>
                              {emp.first_name} {emp.last_name}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                    
                    <div className="resig-req-form-group">
                      <label>Submission Date</label>
                      <input
                        type="date"
                        name="submission_date"
                        value={formData.submission_date}
                        onChange={handleInputChange}
                        disabled
                      />
                    </div>
                  </div>
                  
                  <div className="resig-req-form-column">
                    <div className="resig-req-form-group">
                      <label>Notice Period (days) *</label>
                      <input
                        type="number"
                        name="notice_period_days"
                        value={formData.notice_period_days}
                        onChange={handleInputChange}
                        min="1"
                        required
                      />
                    </div>
                    
                    <div className="resig-req-form-group">
                      <label>Resignation Letter</label>
                      <div className="resig-req-file-upload-wrapper">
                        {!resignationLetter ? (
                          <>
                            <label className="resig-req-file-upload-button">
                              <span>Choose File</span>
                              <input
                                type="file"
                                onChange={handleFileChange}
                                accept=".pdf,.doc,.docx"
                                style={{ display: 'none' }}
                              />
                            </label>
                            <span className="resig-req-file-help">
                              Accepted formats: PDF, DOC, DOCX (Max size: 5MB)
                            </span>
                          </>
                        ) : (
                          <div className="resig-req-selected-file">
                            <span className="resig-req-file-name">
                              <i className="fas fa-file-alt"></i> {resignationLetter.name}
                            </span>
                            <button 
                              type="button" 
                              className="resig-req-file-remove" 
                              onClick={() => setResignationLetter(null)}
                            >
                              ✕
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="resig-req-form-group full-width">
                  <label>Reason for Resignation *</label>
                  <textarea
                    name="reason"
                    value={formData.reason}
                    onChange={handleInputChange}
                    rows="5"
                    required
                  />
                </div>
                
                <div className="resig-req-form-buttons">
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        employee: "",
                        submission_date: new Date().toISOString().split('T')[0],
                        notice_period_days: 30,
                        reason: "",
                      });
                      setResignationLetter(null);
                    }}
                    className="cancel-btn"
                  >
                    Clear Form
                  </button>
                  
                  <button
                    type="submit"
                    className="submit-btn"
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : "Submit Resignation"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
      
      {uploadingStatus === 'uploading' && (
        <div className="resig-req-loading-overlay">
          <div className="resig-req-spinner"></div>
          <p>Uploading document...</p>
        </div>
      )}
      
      {toast && (
        <div 
          className="resig-req-toast"
          style={{ backgroundColor: toast.success ? "#4CAF50" : "#F44336" }}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default ResignationRequest;