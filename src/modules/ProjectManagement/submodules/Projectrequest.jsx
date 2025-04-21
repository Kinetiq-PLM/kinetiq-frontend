import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Projectrequest.css";


axios.defaults.baseURL = 'http://localhost:8000';

const BodyContent = () => {
  
  const [newInternalprojectname, setNewInternalprojectname] = useState("");
  const [newInternalrequestdate, setNewInternalrequestdate] = useState("");
  const [newInternalstartingdate, setNewInternalstartingdate] = useState("");
  const [newInternalemployeeid, setNewInternalemployeeid] = useState("");
  const [newInternaldepartmentid, setNewInternaldepartmentid] = useState("");
  const [newInternalbudgetrequest, setNewInternalbudgetrequest] = useState("");
  const [newInternalbudgetdescription, setNewInternalbudgetdescription] = useState("");
  const [newInternalprojectdescription, setNewInternalprojectdescription] = useState("");
  
  
  const [showReportList, setShowReportList] = useState(false);
  const [currentForm, setCurrentForm] = useState(1);
  const [reportData, setReportData] = useState([]);
  const [selectedReports, setSelectedReports] = useState([]);
  const [loading, setLoading]= useState (false);
  const [submitLoading, setSubmitLoading] = useState(false);
  
  
  const [employeeSuggestions, setEmployeeSuggestions] = useState([]);
  const [departmentSuggestions, setDepartmentSuggestions] = useState([]);
  const [showEmployeeSuggestions, setShowEmployeeSuggestions] = useState(false);
  const [showDepartmentSuggestions, setShowDepartmentSuggestions] = useState(false);

  
  useEffect(() => {
    fetchProjectRequests();
  }, []);

  
  const fetchProjectRequests = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/project_request/project-requests/');
      console.log("Fetched project requests:", response.data);
      setReportData(response.data);
    } catch (error) {
      console.error("Error fetching project requests:", error);
    } finally {
      setLoading(false);
    }
  };

  
  const searchEmployees = async (query) => {
    if (query.length < 2) {
      setEmployeeSuggestions([]);
      setShowEmployeeSuggestions(false);
      return;
    }
    
    try {
      const response = await axios.get(`/api/project_request/search-employees/?query=${query}`);
      console.log("Employee search results:", response.data);
      setEmployeeSuggestions(response.data);
      setShowEmployeeSuggestions(true);
    } catch (error) {
      console.error("Error searching employees:", error);
    }
  };

  
  const searchDepartments = async (query) => {
    if (query.length < 2) {
      setDepartmentSuggestions([]);
      setShowDepartmentSuggestions(false);
      return;
    }
    
    try {
      const response = await axios.get(`/api/project_request/search-departments/?query=${query}`);
      console.log("Department search results:", response.data);
      setDepartmentSuggestions(response.data);
      setShowDepartmentSuggestions(true);
    } catch (error) {
      console.error("Error searching departments:", error);
    }
  };

  
  const handleEmployeeInputChange = (e) => {
    const value = e.target.value;
    setNewInternalemployeeid(value);
    searchEmployees(value);
  };

  
  const handleDepartmentInputChange = (e) => {
    const value = e.target.value;
    setNewInternaldepartmentid(value);
    searchDepartments(value);
  };

  
  const selectEmployee = (employee) => {
    setNewInternalemployeeid(employee.employee_id);
    setShowEmployeeSuggestions(false);
  };

  
  const selectDepartment = (department) => {
    setNewInternaldepartmentid(department.dept_id);
    setShowDepartmentSuggestions(false);
  };

  
  const handleFirstSubmitprojrequest = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    
    const projectRequestData = {
      project_name: newInternalprojectname,
      request_date: newInternalrequestdate,
      target_starting_date: newInternalstartingdate,
      employee_id: newInternalemployeeid,
      dept_id: newInternaldepartmentid,
      project_budget_request: parseFloat(newInternalbudgetrequest) || 0,
      project_budget_description: newInternalbudgetdescription,
      project_description: newInternalprojectdescription,
    };
    
    console.log("Submitting project request:", projectRequestData);
    
    try {
      const response = await axios.post('/api/project_request/project-requests/', projectRequestData);
      console.log("Project request created:", response.data);
      
      
      await fetchProjectRequests();
      
      
      setShowReportList(true);
      setCurrentForm(null);
      resetForm();
      
      alert("Project request created successfully!");
    } catch (error) {
      console.error("Error submitting project request:", error);
      alert("Failed to submit project request. Please try again.");
    } finally {
      setSubmitLoading(false);
    }
  };

  
  const resetForm = () => {
    setNewInternalprojectname("");
    setNewInternalrequestdate("");
    setNewInternalstartingdate("");
    setNewInternalemployeeid("");
    setNewInternaldepartmentid("");
    setNewInternalbudgetrequest("");
    setNewInternalbudgetdescription("");
    setNewInternalprojectdescription("");
  };

  
  const handleBackClick = () => {
    setShowReportList(false);
    setCurrentForm(1);
  };

  
  const handleRemoveReports = async () => {
    if (selectedReports.length === 0) {
      alert("Please select at least one project request to remove.");
      return;
    }
    
    if (!window.confirm(`Are you sure you want to delete ${selectedReports.length} project request(s)?`)) {
      return;
    }
    
    setLoading(true);
    try {
      
      for (const index of selectedReports) {
        const projectId = reportData[index].project_request_id;
        console.log(`Deleting project request with ID: ${projectId}`);
        await axios.delete(`/api/project_request/project-requests/${projectId}/`);
      }
      
      
      await fetchProjectRequests();
      setSelectedReports([]);
      alert("Selected project requests have been removed.");
    } catch (error) {
      console.error("Error removing project requests:", error);
      alert("Failed to remove project requests. Please try again.");
    } finally {
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

  
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="body-content-container">
      {currentForm === 1 && (
        <form onSubmit={handleFirstSubmitprojrequest} className="project-request-form">
          <div className="form-header">
            <h1 className="form-title">
              <b>Internal Project Request</b>
            </h1>
          </div>

          <div className="form-grid">
            {/* Project Name */}
            <div className="form-group">
              <label className="form-label">
                <b>Project Name</b>
              </label>
              <input
                className="form-input"
                type="text"
                placeholder="Enter Project Name"
                value={newInternalprojectname}
                onChange={(e) => setNewInternalprojectname(e.target.value)}
                required
              />
            </div>

            {/* Request Date */}
            <div className="form-group">
              <label className="form-label">
                <b>Request Date</b>
              </label>
              <input
                className="form-input"
                type="date"
                placeholder="00/00/0000"
                value={newInternalrequestdate}
                onChange={(e) => setNewInternalrequestdate(e.target.value)}
                required
              />
            </div>

            {/* Starting Date */}
            <div className="form-group">
              <label className="form-label">
                <b>Starting Date</b>
              </label>
              <input
                className="form-input"
                type="date"
                placeholder="00/00/0000"
                value={newInternalstartingdate}
                onChange={(e) => setNewInternalstartingdate(e.target.value)}
                required
              />
            </div>

            {/* Employee ID */}
            <div className="form-group">
              <label className="form-label">
                <b>Employee ID</b>
              </label>
              <div className="autocomplete-container">
                <input
                  className="form-input"
                  type="text"
                  placeholder="Insert Employee ID"
                  value={newInternalemployeeid}
                  onChange={handleEmployeeInputChange}
                  required
                />
                {showEmployeeSuggestions && employeeSuggestions.length > 0 && (
                  <ul className="suggestions-list">
                    {employeeSuggestions.map((employee) => (
                      <li 
                        key={employee.employee_id} 
                        onClick={() => selectEmployee(employee)}
                      >
                        {employee.employee_id} - {employee.first_name} {employee.last_name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Department ID */}
            <div className="form-group">
              <label className="form-label">
                <b>Department ID</b>
              </label>
              <div className="autocomplete-container">
                <input
                  className="form-input"
                  type="text"
                  placeholder="Insert Department ID"
                  value={newInternaldepartmentid}
                  onChange={handleDepartmentInputChange}
                  required
                />
                {showDepartmentSuggestions && departmentSuggestions.length > 0 && (
                  <ul className="suggestions-list">
                    {departmentSuggestions.map((department) => (
                      <li 
                        key={department.dept_id} 
                        onClick={() => selectDepartment(department)}
                      >
                        {department.dept_id} - {department.dept_name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Budget Request */}
            <div className="form-group">
              <label className="form-label">
                <b>Budget Request</b>
              </label>
              <input
                className="form-input"
                type="number"
                step="0.01"
                placeholder="Add Budget"
                value={newInternalbudgetrequest}
                onChange={(e) => setNewInternalbudgetrequest(e.target.value)}
                required
              />
            </div>

            {/* Budget Description */}
            <div className="form-group">
              <label className="form-label">
                <b>Budget Description</b>
              </label>
              <input
                className="form-input"
                type="text"
                placeholder="Add Description"
                value={newInternalbudgetdescription}
                onChange={(e) => setNewInternalbudgetdescription(e.target.value)}
                required
              />
            </div>

            {/* Project Description */}
            <div className="form-group full-width">
              <label className="form-label">
                <b>Project Description</b>
              </label>
              <textarea
                className="form-textarea"
                placeholder="Add Description"
                value={newInternalprojectdescription}
                onChange={(e) => setNewInternalprojectdescription(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-footer">
            <div className="button-group">
              <button type="submit" className="btn btn-primary" disabled={submitLoading}>
                <b>{submitLoading ? "Saving..." : "Save"}</b>
              </button>
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                <b>Reset</b>
              </button>
            </div>
            
            <div className="attachment-section">
              <h2 className="attachment-title">
                <b>Attachments</b>
              </h2>
              <button type="button" className="btn btn-attach">
                <b>Attach File</b>
              </button>
            </div>
          </div>
        </form>
      )}

      {showReportList && (
        <div className="report-list-container">
          <div className="list-header">
            <h1 className="list-title">
              <b>Internal Request Monitoring</b>
            </h1>
            <div className="list-controls">
              <button onClick={handleBackClick} className="btn btn-primary">
                <b>Add Request</b>
              </button>
              <button 
                onClick={handleRemoveReports} 
                className="btn btn-danger" 
                disabled={selectedReports.length === 0 || loading}
              >
                <b>{loading ? "Removing..." : "Remove Request"}</b>
              </button>
            </div>
          </div>

          <div className="table-responsive">
            {loading ? (
              <div className="loading-state">
                <p>Loading project requests...</p>
              </div>
            ) : reportData.length === 0 ? (
              <div className="empty-state">
                <p>No project requests found. Click "Add Request" to create one.</p>
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th className="checkbox-column">
                      <input 
                        type="checkbox" 
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedReports(reportData.map((_, index) => index));
                          } else {
                            setSelectedReports([]);
                          }
                        }}
                        checked={selectedReports.length === reportData.length && reportData.length > 0}
                      />
                    </th>
                    <th><b>Project Name</b></th>
                    <th><b>Request Date</b></th>
                    <th><b>Starting Date</b></th>
                    <th><b>Employee ID</b></th>
                    <th><b>Department ID</b></th>
                    <th><b>Budget Request</b></th>
                    <th><b>Budget Description</b></th>
                    <th><b>Project Description</b></th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((item, index) => (
                    <tr key={index} className={selectedReports.includes(index) ? "selected" : ""}>
                      <td className="checkbox-column">
                        <input
                          type="checkbox"
                          checked={selectedReports.includes(index)}
                          onChange={() => handleCheckboxChange(index)}
                        />
                      </td>
                      <td><b>{item.project_name}</b></td>
                      <td>{formatDate(item.request_date)}</td>
                      <td>{formatDate(item.target_starting_date)}</td>
                      <td>{item.employee_id}</td>
                      <td>{item.dept_id}</td>
                      <td>${parseFloat(item.project_budget_request).toFixed(2)}</td>
                      <td>{item.project_budget_description}</td>
                      <td className="description-column">{item.project_description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {!showReportList && currentForm !== 1 && (
        <div className="view-list-container">
          <button onClick={() => setShowReportList(true)} className="btn btn-primary">
            <b>View Request List</b>
          </button>
        </div>
      )}
    </div>
  );
};

export default BodyContent;