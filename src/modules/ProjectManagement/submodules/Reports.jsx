import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Reports.css";
import GenerateReports from "./GenerateReports";
import ProjectForms from "./ProjectForms";

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

axios.interceptors.response.use(
  response => response,
  error => {
    console.error('Axios Error:', error);
    return Promise.reject(error);
  }
);

const BodyContent = () => {
  const [showProjectForms, setShowProjectForms] = useState(false);
  const [newProjectID, setNewProjectID] = useState("");
  const [newInternalprojectid, setNewInternalprojectid] = useState("");
  const [selectedReporttype, setSelectedReporttype] = useState("");
  const [newReporttitle, setNewReporttitle] = useState("");
  const [selectedReceivedform, setSelectedReceievedform] = useState("");
  const [newDatecreated, setNewDatecreated] = useState("");
  const [newDescriptionreport, setNewDescriptionreport] = useState("");
  const [selectedAssignedto, setSelectedAssignedto] = useState("");
  
  const [showReportList, setShowReportList] = useState(false);
  const [currentForm, setCurrentForm] = useState(1);
  const [reportData, setReportData] = useState([]);
  const [selectedReports, setSelectedReports] = useState([]);
  
  
  const [showGenerateReports, setShowGenerateReports] = useState(false);
  
  const [reportTypes, setReportTypes] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [externalProjects, setExternalProjects] = useState([]);
  const [internalProjects, setInternalProjects] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiErrors, setApiErrors] = useState({
    reports: false,
    reportTypes: false,
    departments: false,
    externalProjects: false,
    internalProjects: false
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        setApiErrors({
          reports: false,
          reportTypes: false,
          departments: false,
          externalProjects: false,
          internalProjects: false
        });
        
        console.log("Fetching data from API...");
        
        try {
          const reportsResponse = await axios.get('/api/reports/');
          console.log('Reports response:', reportsResponse.data);
          setReportData(Array.isArray(reportsResponse.data) ? 
            reportsResponse.data : reportsResponse.data.results || []);
        } catch (err) {
          console.error('Error fetching reports:', err);
          setApiErrors(prev => ({ ...prev, reports: true }));
        }
        
        try {
          const typesResponse = await axios.get('/api/reports/report_types/');
          console.log('Report types response:', typesResponse.data);
          setReportTypes(typesResponse.data || []);
        } catch (err) {
          console.error('Error fetching report types:', err);
          setApiErrors(prev => ({ ...prev, reportTypes: true }));
          setReportTypes([
            'Sales Order',
            'Resource Availability',
            'Bill of Material',
            'Information',
            'Progress Report',
            'Project Details',
            'Inventory Movement',
          ]);
        }
        
        try {
          const deptsResponse = await axios.get('/api/reports/departments/');
          console.log('Departments response:', deptsResponse.data);
          setDepartments(deptsResponse.data || []);
        } catch (err) {
          console.error('Error fetching departments:', err);
          setApiErrors(prev => ({ ...prev, departments: true }));
          setDepartments([
            'Accounting',
            'Admin',
            'Distribution',
            'Finance',
            'Human Resources',
            'Inventory',
            'Management',
            'MRP',
            'Operations',
            'Production',
            'Project Management',
            'Purchasing',
            'Sales',
            'Services',
            'Solution Customizing',
            'Department - IT Team',
            'Department - Project Management',
          ]);
        }
        
        try {
          const externalProjectsResponse = await axios.get('/api/external-projects/');
          console.log('External projects response:', externalProjectsResponse.data);
          setExternalProjects(externalProjectsResponse.data || []);
        } catch (err) {
          console.error('Error fetching external projects:', err);
          setApiErrors(prev => ({ ...prev, externalProjects: true }));
        }
        
        try {
          const internalProjectsResponse = await axios.get('/api/internal-projects/');
          console.log('Internal projects response:', internalProjectsResponse.data);
          setInternalProjects(internalProjectsResponse.data || []);
        } catch (err) {
          console.error('Error fetching internal projects:', err);
          setApiErrors(prev => ({ ...prev, internalProjects: true }));
        }
        
        setLoading(false);
      } catch (err) {
        console.error('API Error:', err);
        setError('Error fetching data: ' + (err.response?.data?.error || err.message));
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleFirstSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      const reportData = {
        project_id: newProjectID || null,
        intrnl_project_id: newInternalprojectid || null,
        report_type: selectedReporttype,
        report_title: newReporttitle,
        received_from: selectedReceivedform,
        date_created: newDatecreated,
        assigned_to: selectedAssignedto,
        description: newDescriptionreport
      };
      
      console.log("Submitting report data:", reportData);
      
      const response = await axios.post('/api/reports/', reportData);
      console.log('Create report response:', response.data);
      
      try {
        const reportsResponse = await axios.get('/api/reports/');
        setReportData(Array.isArray(reportsResponse.data) ? 
          reportsResponse.data : reportsResponse.data.results || []);
      } catch (err) {
        console.error('Error refreshing reports:', err);
      }
      
      setShowReportList(true);
      setCurrentForm(null);
      resetForm();
      setLoading(false);
      
    } catch (err) {
      console.error('API Error:', err);
      setError('Error creating report: ' + (err.response?.data?.error || err.message));
      setLoading(false);
    }
  };

  const resetForm = () => {
    setNewProjectID("");
    setNewInternalprojectid("");
    setSelectedReporttype("");
    setNewReporttitle("");
    setSelectedReceievedform("");
    setNewDatecreated("");
    setNewDescriptionreport("");
    setSelectedAssignedto("");
  };

  const handleBackClick = () => {
    setShowReportList(false);
    setCurrentForm(1);
  };

  
  const handleShowGenerateReports = () => {
    setShowReportList(false);
    setCurrentForm(null);
    setShowGenerateReports(true);
  };

  
  const handleBackFromGenerateReports = () => {
    setShowGenerateReports(false);
    setShowReportList(true);
  };

  const handleRemoveReports = async () => {
    if (selectedReports.length === 0) return;
    
    try {
      setLoading(true);
      setError(null);
      
      for (const index of selectedReports) {
        const reportId = reportData[index].report_monitoring_id;
        console.log(`Deleting report with ID: ${reportId}`);
        await axios.delete(`/api/reports/${reportId}/`);
      }
      
      try {
        const reportsResponse = await axios.get('/api/reports/');
        setReportData(Array.isArray(reportsResponse.data) ? 
          reportsResponse.data : reportsResponse.data.results || []);
      } catch (err) {
        console.error('Error refreshing reports after deletion:', err);
      }
      
      setSelectedReports([]);
      setLoading(false);
      
    } catch (err) {
      console.error('API Error:', err);
      setError('Error removing reports: ' + (err.response?.data?.error || err.message));
      setLoading(false);
    }
  };

  const handleCheckboxChange = (index) => {
    if (selectedReports.includes(index)) {
      setSelectedReports(selectedReports.filter((i) => i !== index));
    } else {
      setSelectedReports([...selectedReports, index]);
    }
  };

  const handleExternalProjectChange = (e) => {
    setNewProjectID(e.target.value);
    if (e.target.value) {
      setNewInternalprojectid("");
    }
  };

  const handleInternalProjectChange = (e) => {
    setNewInternalprojectid(e.target.value);
    if (e.target.value) {
      setNewProjectID("");
    }
  };

  const handleShowProjectForms = () => {
    setShowReportList(false);
    setCurrentForm(null);
    setShowGenerateReports(false);
    setShowProjectForms(true);
  };
  
  const handleBackFromProjectForms = () => {
    setShowProjectForms(false);
    setShowReportList(true);
  };
  

  if (loading && (!reportTypes.length && !departments.length)) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading data...</p>
      </div>
    );
  }
  
  const hasApiErrors = Object.values(apiErrors).some(val => val);
  
  
  return (
    <div className="body-content-container">
      {error && (
        <div className="error-banner">
          <p>{error}</p>
          <button className="dismiss-btn" onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}
      
      {hasApiErrors && (
        <div className="warning-banner">
          <p>Some data could not be loaded. The form may have limited functionality.</p>
          <button className="reload-btn" onClick={() => window.location.reload()}>Reload Page</button>
        </div>
      )}
      
      {showProjectForms ? (
        <div className="project-forms-view">
          <button onClick={handleBackFromProjectForms} className="back-button">
            <span className="back-arrow">←</span> Back to Report List
          </button>
          <div className="project-forms-content">
            <ProjectForms />
          </div>
        </div>
      ) : showGenerateReports ? (
        <div className="generate-reports-view">
          <button onClick={handleBackFromGenerateReports} className="back-button">
            <span className="back-arrow">←</span> Back to Report List
          </button>
          <div className="generate-reports-content">
            <GenerateReports 
              reportData={reportData}
              reportTypes={reportTypes}
              externalProjects={externalProjects}
              internalProjects={internalProjects}
            />
          </div>
        </div>
      ) : (
        <div className="main-content">
          {currentForm === 1 && (
            <div className="form-container">
              <div className="form-header">
                <h1 className="form-title">New Report</h1>
                <h2 className="form-subtitle">Project Task List</h2>
              </div>
              
              <form onSubmit={handleFirstSubmit} className="report-form">
                <div className="form-columns">
                  {/* Left Column */}
                  <div className="form-column left-column">
                    <div className="form-group">
                      <label className="form-label">
                        Project ID<span className="required">*</span>
                      </label>
                      <select
                        className="form-select"
                        value={newProjectID}
                        onChange={handleExternalProjectChange}
                        disabled={loading || newInternalprojectid !== "" || apiErrors.externalProjects}
                      >
                        <option value="">Select Project ID</option>
                        {externalProjects.map((project) => (
                          <option key={project.project_id} value={project.project_id}>
                            {project.project_id} {project.project_status ? `- ${project.project_status}` : ''}
                          </option>
                        ))}
                      </select>
                      {apiErrors.externalProjects && (
                        <div className="field-error">External projects could not be loaded</div>
                      )}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Internal Project ID</label>
                      <select
                        className="form-select"
                        value={newInternalprojectid}
                        onChange={handleInternalProjectChange}
                        disabled={loading || newProjectID !== "" || apiErrors.internalProjects}
                      >
                        <option value="">Select Internal Project ID</option>
                        {internalProjects.map((project) => (
                          <option key={project.intrnl_project_id} value={project.intrnl_project_id}>
                            {project.intrnl_project_id} {project.intrnl_project_status ? `- ${project.intrnl_project_status}` : ''}
                          </option>
                        ))}
                      </select>
                      {apiErrors.internalProjects && (
                        <div className="field-error">Internal projects could not be loaded</div>
                      )}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Report Type</label>
                      <select
                        name="Reporttype"
                        className="form-select"
                        value={selectedReporttype}
                        onChange={(e) => setSelectedReporttype(e.target.value)}
                        required
                        disabled={loading}
                      >
                        <option value="">Choose Report Type</option>
                        {reportTypes.map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Report Title</label>
                      <input
                        className="form-input"
                        type="text"
                        placeholder="Insert Title"
                        value={newReporttitle}
                        onChange={(e) => setNewReporttitle(e.target.value)}
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="form-column right-column">
                    <div className="form-group">
                      <label className="form-label">Received From</label>
                      <select
                        name="Receivedfrom"
                        className="form-select"
                        value={selectedReceivedform}
                        onChange={(e) => setSelectedReceievedform(e.target.value)}
                        required
                        disabled={loading}
                      >
                        <option value="">Choose Department</option>
                        {departments.map((dept) => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Date Created</label>
                      <input
                        className="form-input"
                        type="date"
                        placeholder="00/00/0000"
                        value={newDatecreated}
                        onChange={(e) => setNewDatecreated(e.target.value)}
                        required
                        disabled={loading}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Assigned To:</label>
                      <select
                        name="Assigned to"
                        className="form-select"
                        value={selectedAssignedto}
                        onChange={(e) => setSelectedAssignedto(e.target.value)}
                        required
                        disabled={loading}
                      >
                        <option value="">Choose Department</option>
                        {departments.map((dept) => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="form-group full-width">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-textarea"
                    placeholder="Add Description"
                    value={newDescriptionreport}
                    onChange={(e) => setNewDescriptionreport(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-actions">
                  <div className="attachment-section">
                    <h3 className="attachment-label">Attachments</h3>
                    <button type="button" className="action-btn attach-btn" disabled={loading}>
                      Attach File
                    </button>
                  </div>
                  <div className="form-buttons">
                    <button type="button" className="action-btn edit-btn" disabled={loading}>
                      Edit
                    </button>
                    <button type="submit" className="action-btn save-btn" disabled={loading}>
                      {loading ? "Saving..." : "Save"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {showReportList && (
            <div className="report-list-container">
              <div className="list-header">
                <h1 className="list-title">Report Monitoring List</h1>
                <div className="list-actions">
                  <button onClick={handleBackClick} className="action-btn add-btn" disabled={loading}>
                    Add Report
                  </button>
                  <button 
                    onClick={handleRemoveReports} 
                    className="action-btn remove-btn" 
                    disabled={selectedReports.length === 0 || loading}
                  >
                    {loading ? "Removing..." : "Remove Report"}
                  </button>
                  <button 
                    onClick={handleShowGenerateReports} 
                    className="action-btn generate-btn"
                    disabled={loading}
                  >
                    Generate Reports
                  </button>
                  <button 
                    onClick={handleShowProjectForms} 
                    className="action-btn project-forms-btn"
                    disabled={loading}
                  >
                    Project Forms
                  </button>
                </div>
              </div>

              <div className="report-table-container">
                <table className="report-table">
                  <thead>
                    <tr>
                      <th className="checkbox-cell">
                        <input 
                          type="checkbox" 
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedReports([...Array(reportData.length).keys()]);
                            } else {
                              setSelectedReports([]);
                            }
                          }} 
                          checked={selectedReports.length === reportData.length && reportData.length > 0}
                          disabled={loading || reportData.length === 0}
                        />
                      </th>
                      <th>Project ID</th>
                      <th>Internal Project ID</th>
                      <th>Report Type</th>
                      <th>Report Title:</th>
                      <th>Received From:</th>
                      <th>Date Created</th>
                      <th>Assigned to:</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.length > 0 ? (
                      reportData.map((item, index) => (
                        <tr key={index} className={selectedReports.includes(index) ? "selected-row" : ""}>
                          <td className="checkbox-cell">
                            <input
                              type="checkbox"
                              checked={selectedReports.includes(index)}
                              onChange={() => handleCheckboxChange(index)}
                              disabled={loading}
                            />
                          </td>
                          <td>{item.project_id || '-'}</td>
                          <td>{item.intrnl_project_id || '-'}</td>
                          <td>{item.report_type || '-'}</td>
                          <td>{item.report_title || '-'}</td>
                          <td>{item.received_from || '-'}</td>
                          <td>{item.date_created || '-'}</td>
                          <td>{item.assigned_to || '-'}</td>
                          <td className="description-cell">{item.description || '-'}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="9" className="no-data-message">
                          {apiErrors.reports ? "Could not load reports" : "No reports found"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="selection-info">
                <p>{selectedReports.length} of {reportData.length} reports selected</p>
              </div>
            </div>
          )}

          {!showReportList && currentForm !== 1 && (
            <div className="view-reports-container">
              <button 
                onClick={() => setShowReportList(true)} 
                disabled={loading}
                className="action-btn view-reports-btn"
              >
                View Report List
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BodyContent;