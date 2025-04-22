import React, { useState, useEffect } from "react";
import "../styles/Project List.css";
import listService from "../services/listService";

const BodyContent = () => {
  const [selectedNav, setSelectedNav] = useState("External Request");
  const [selectedNavdetails, setSelectedNavdetails] = useState("External Details");
  const [selectedRequests, setSelectedRequests] = useState([]);
  const [showProjectRequestList, setShowProjectRequestList] = useState(true);

  // State for data
  const [externalRequests, setExternalRequests] = useState([]);
  const [internalLabor, setInternalLabor] = useState([]);
  const [internalDetails, setInternalDetails] = useState([]);
  const [externalDetails, setExternalDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Add loading state for individual data types
  const [loadingExternal, setLoadingExternal] = useState(true);
  const [loadingLabor, setLoadingLabor] = useState(true);
  const [loadingInternalDetails, setLoadingInternalDetails] = useState(true);
  const [loadingExternalDetails, setLoadingExternalDetails] = useState(true);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      // Fetch external projects
      setLoadingExternal(true);
      try {
        const externalRes = await listService.getExternalProjects();
        // Handle both array and paginated responses
        const externalData = externalRes.data.results || externalRes.data;
        console.log('External projects data:', externalData);
        setExternalRequests(externalData);
      } catch (err) {
        console.error('Error loading external projects:', err);
        setError('Failed to load some data. Please try again later.');
      } finally {
        setLoadingExternal(false);
      }
      
      // Fetch external labor
      setLoadingLabor(true);
      try {
        const laborRes = await listService.getExternalLabor();
        // Handle both array and paginated responses
        const laborData = laborRes.data.results || laborRes.data;
        console.log('External labor data:', laborData);
        setInternalLabor(laborData);
      } catch (err) {
        console.error('Error loading external labor:', err);
        if (!error) setError('Failed to load some data. Please try again later.');
      } finally {
        setLoadingLabor(false);
      }
      
      // Fetch internal details only when needed
      if (selectedNavdetails === "Internal Details" || !showProjectRequestList) {
        setLoadingInternalDetails(true);
        try {
          const internalDetailedRes = await listService.getInternalProjectsDetailed();
          setInternalDetails(internalDetailedRes.data);
        } catch (err) {
          console.error('Error loading internal details:', err);
          if (!error) setError('Failed to load some data. Please try again later.');
        } finally {
          setLoadingInternalDetails(false);
        }
      }
      
      // Fetch external details only when needed
      if (selectedNavdetails === "External Details" || !showProjectRequestList) {
        setLoadingExternalDetails(true);
        try {
          const externalDetailedRes = await listService.getExternalProjectsDetailed();
          setExternalDetails(externalDetailedRes.data);
        } catch (err) {
          console.error('Error loading external details:', err);
          if (!error) setError('Failed to load some data. Please try again later.');
        } finally {
          setLoadingExternalDetails(false);
        }
      }
      
      setLoading(false);
    };

    fetchData();
    
    // Safety timeout
    const timer = setTimeout(() => {
      if (loading) {
        setLoading(false);
        if (!error) setError('Request timed out. Please try again.');
      }
    }, 60000);
    
    return () => clearTimeout(timer);
  }, [selectedNavdetails, showProjectRequestList]);

  // Load details data when switching tabs
  useEffect(() => {
    const loadDetailsData = async () => {
      if (!showProjectRequestList) {
        if (selectedNavdetails === "Internal Details" && internalDetails.length === 0 && !loadingInternalDetails) {
          setLoadingInternalDetails(true);
          try {
            const internalDetailedRes = await listService.getInternalProjectsDetailed();
            setInternalDetails(internalDetailedRes.data);
          } catch (err) {
            console.error('Error loading internal details:', err);
            if (!error) setError('Failed to load internal details. Please try again.');
          } finally {
            setLoadingInternalDetails(false);
          }
        } else if (selectedNavdetails === "External Details" && externalDetails.length === 0 && !loadingExternalDetails) {
          setLoadingExternalDetails(true);
          try {
            const externalDetailedRes = await listService.getExternalProjectsDetailed();
            setExternalDetails(externalDetailedRes.data);
          } catch (err) {
            console.error('Error loading external details:', err);
            if (!error) setError('Failed to load external details. Please try again.');
          } finally {
            setLoadingExternalDetails(false);
          }
        }
      }
    };
    
    loadDetailsData();
  }, [selectedNavdetails, showProjectRequestList]);

  useEffect(() => {
    if (externalRequests.length > 0) {
      console.log('External Requests Data Structure:', externalRequests[0]);
    }
    if (internalLabor.length > 0) {
      console.log('Internal Labor Data Structure:', internalLabor[0]);
    }
  }, [externalRequests, internalLabor]);

  // Handle navigation click
  const handleNavClick = (nav) => {
    setSelectedNav(nav);
    setSelectedRequests([]);
  };

  const handleNavDetailsClick = (navdetails) => {
    setSelectedNavdetails(navdetails);
  };

  const handleCheckboxChange = (index) => {
    const updatedSelection = [...selectedRequests];
    updatedSelection[index] = !updatedSelection[index];
    setSelectedRequests(updatedSelection);
  };

  const handleRemoveRequests = async () => {
    try {
      const selectedIds = [];
      
      if (selectedNav === "Internal Request") {
        internalLabor.forEach((item, index) => {
          if (selectedRequests[index]) {
            selectedIds.push(item.project_labor_id);
          }
        });
        
        if (selectedIds.length > 0) {
          await listService.deleteExternalLabor(selectedIds);
          setInternalLabor(prev => prev.filter((_, index) => !selectedRequests[index]));
        }
      } else if (selectedNav === "External Request") {
        externalRequests.forEach((item, index) => {
          if (selectedRequests[index]) {
            selectedIds.push(item.project_id);
          }
        });
        
        if (selectedIds.length > 0) {
          await listService.deleteExternalProjects(selectedIds);
          setExternalRequests(prev => prev.filter((_, index) => !selectedRequests[index]));
        }
      }
      
      setSelectedRequests([]);
    } catch (err) {
      console.error('Failed to remove requests:', err);
      setError('Failed to remove selected items');
    }
  };

  const handleBackClick = () => {
    setShowProjectRequestList(true);
  };

  const handleProjectRequestDetailsClick = () => {
    setShowProjectRequestList(false);
  };

  // Show loading indicator while initial data is being fetched
  if (loading && (loadingExternal && loadingLabor)) {
    return (
      <div className="body-content-container">
        <div className="loading-message">
          <p>Loading project data...</p>
        </div>
      </div>
    );
  }


  return (
    <div className="project-list-container">
      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="retry-button"
          >
            Retry
          </button>
        </div>
      )}
      
      <div className="content-wrapper">
        {showProjectRequestList ? (
          <>
            <div className="header-section">
              <h1 className="page-title">Project Request</h1>
              
              <div className="status-indicators">
                <span className="status-indicator approved">
                  <div className="status-dot"></div>
                  <span>Approved</span>
                </span>
                <span className="status-indicator not-approved">
                  <div className="status-dot"></div>
                  <span>Not Approved</span>
                </span>
                <span className="status-indicator ongoing">
                  <div className="status-dot"></div>
                  <span>Ongoing</span>
                </span>
              </div>
              
              <div className="action-buttons">
                <button className="btn btn-filter">
                  <i className="filter-icon"></i>
                  Filter By
                </button>
                <button className="btn btn-danger" onClick={handleRemoveRequests}>
                  <i className="remove-icon"></i>
                  Remove Request
                </button>
                <button className="btn btn-secondary" onClick={handleProjectRequestDetailsClick}>
                  <i className="details-icon"></i>
                  Project Request Details
                </button>
              </div>
            </div>

            <div className="tab-navigation">
              <button
                className={`tab-button ${selectedNav === "Internal Request" ? "active" : ""}`}
                onClick={() => handleNavClick("Internal Request")}
              >
                Internal Request
              </button>
              <button
                className={`tab-button ${selectedNav === "External Request" ? "active" : ""}`}
                onClick={() => handleNavClick("External Request")}
              >
                External Request
              </button>
            </div>

            <div className="table-container">
              {selectedNav === "Internal Request" && (
                <div className="data-table-wrapper">
                  {loadingLabor ? (
                    <div className="loading-message">
                      <div className="spinner"></div>
                      <p>Loading internal labor data...</p>
                    </div>
                  ) : (
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th className="select-col"></th>
                          <th>Int Project Labor ID</th>
                          <th>Project ID</th>
                          <th>Job Roles Needed</th>
                          <th>Employee ID</th>
                        </tr>
                      </thead>
                      <tbody>
                        {internalLabor.length > 0 ? (
                          internalLabor.map((item, index) => (
                            <tr key={index}>
                              <td className="select-col">
                                <input
                                  type="checkbox"
                                  checked={selectedRequests[index] || false}
                                  onChange={() => handleCheckboxChange(index)}
                                />
                              </td>
                              <td>{item.project_labor_id}</td>
                              <td>{item.project_id}</td>
                              <td>{item.job_role_needed}</td>
                              <td>{item.employee_id}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="no-data">
                              No internal labor data available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              {selectedNav === "External Request" && (
                <div className="data-table-wrapper">
                  {loadingExternal ? (
                    <div className="loading-message">
                      <div className="spinner"></div>
                      <p>Loading external request data...</p>
                    </div>
                  ) : (
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th className="select-col"></th>
                          <th>ExtProject ID</th>
                          <th>Project Request ID</th>
                          <th>Project Status</th>
                          <th>Job Role Needed</th>
                          <th>Employee ID</th>
                          <th>Project Equipment ID</th>
                        </tr>
                      </thead>
                      <tbody>
                        {externalRequests.length > 0 ? (
                          externalRequests.map((item, index) => (
                            <tr key={index}>
                              <td className="select-col">
                                <input
                                  type="checkbox"
                                  checked={selectedRequests[index] || false}
                                  onChange={() => handleCheckboxChange(index)}
                                />
                              </td>
                              <td>{item.project_id}</td>
                              <td>{item.ext_project_request_id}</td>
                              <td>
                                <span className={`status-badge ${item.project_status?.toLowerCase()}`}>
                                  {item.project_status}
                                </span>
                              </td>
                              <td>N/A</td>
                              <td>N/A</td>
                              <td>N/A</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="7" className="no-data">
                              No external request data available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="header-section">
              <h1 className="page-title">Project Details</h1>
              <button onClick={handleBackClick} className="btn btn-back">
                <i className="back-icon"></i>
                Back
              </button>
            </div>

            <div className="tab-navigation">
              <button
                className={`tab-button ${selectedNavdetails === "Internal Details" ? "active" : ""}`}
                onClick={() => handleNavDetailsClick("Internal Details")}
              >
                Internal Details
              </button>
              <button
                className={`tab-button ${selectedNavdetails === "External Details" ? "active" : ""}`}
                onClick={() => handleNavDetailsClick("External Details")}
              >
                External Details
              </button>
            </div>

            <div className="table-container">
              {selectedNavdetails === "Internal Details" && (
                <div className="data-table-wrapper">
                  {loadingInternalDetails ? (
                    <div className="loading-message">
                      <div className="spinner"></div>
                      <p>Loading internal details...</p>
                    </div>
                  ) : (
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th className="select-col"></th>
                          <th>Int Project ID</th>
                          <th>Project Request ID</th>
                          <th>Project Name</th>
                          <th>Project Status</th>
                          <th>Approval ID</th>
                          <th>Employee ID</th>
                          <th>Department ID</th>
                          <th>Budget Request</th>
                          <th>Budget Description</th>
                          <th>Project Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {internalDetails.length > 0 ? (
                          internalDetails.map((item, index) => (
                            <tr key={index}>
                              <td className="select-col"></td>
                              <td>{item.intrnl_project_id}</td>
                              <td>{item.project_request?.project_request_id}</td>
                              <td>{item.project_request?.project_name}</td>
                              <td>
                                <span className={`status-badge ${item.intrnl_project_status?.toLowerCase()}`}>
                                  {item.intrnl_project_status}
                                </span>
                              </td>
                              <td>{item.approval_id}</td>
                              <td>{item.project_request?.employee_id}</td>
                              <td>{item.project_request?.dept_id}</td>
                              <td>{item.project_request?.project_budget_request}</td>
                              <td>{item.project_request?.project_budget_description}</td>
                              <td>{item.project_request?.project_description}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="11" className="no-data">
                              No internal details available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              {selectedNavdetails === "External Details" && (
                <div className="data-table-wrapper">
                  {loadingExternalDetails ? (
                    <div className="loading-message">
                      <div className="spinner"></div>
                      <p>Loading external details...</p>
                    </div>
                  ) : (
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th className="select-col"></th>
                          <th>ExtProject ID</th>
                          <th>Project Name</th>
                          <th>Project Description</th>
                          <th>Approval Id</th>
                          <th>Item ID</th>
                          <th>Project Status</th>
                          <th>Warranty Coverage</th>
                          <th>Warranty Start Date</th>
                          <th>Warranty End Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {externalDetails.length > 0 ? (
                          externalDetails.map((item, index) => (
                            <tr key={index}>
                              <td className="select-col"></td>
                              <td>{item.project_id}</td>
                              <td>{item.ext_project_request?.ext_project_name}</td>
                              <td>{item.ext_project_request?.ext_project_description}</td>
                              <td>{item.ext_project_request?.approval_id}</td>
                              <td>{item.ext_project_request?.item_id}</td>
                              <td>
                                <span className={`status-badge ${item.project_status?.toLowerCase()}`}>
                                  {item.project_status}
                                </span>
                              </td>
                              <td>{item.warranty?.warranty_coverage_yr} {item.warranty?.warranty_coverage_yr ? 'Years' : ''}</td>
                              <td>{item.warranty?.warranty_start_date}</td>
                              <td>{item.warranty?.warranty_end_date}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="10" className="no-data">
                              No external details available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BodyContent;