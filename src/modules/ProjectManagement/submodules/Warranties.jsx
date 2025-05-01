import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Warranties.css";

const BodyContent = () => {
  const [warranties, setWarranties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null
  });

  useEffect(() => {
    fetchWarranties();
  }, []);

  const fetchWarranties = async (url = 'https://c95i46nr4l.execute-api.ap-southeast-1.amazonaws.com/dev/api/warranties/') => {
    setIsLoading(true);
    try {
      // Use the warranties endpoint which should return projects with warranty data
      const response = await axios.get(url);
      
      if (response.data.results !== undefined) {
        // Get project names for each warranty
        const warrantiesWithNames = await Promise.all(
          response.data.results.map(async (warranty) => {
            try {
              // Try to get project details
              const projectResponse = await axios.get(`/api/warranties/project-warranty-details/${warranty.project_id}/`);
              return {
                ...warranty,
                ext_project_name: projectResponse.data.project_name || `Project ${warranty.project_id}`,
                warranty_status: projectResponse.data.warranty_status || 'not started'
              };
            } catch (error) {
              console.error(`Error fetching details for project ${warranty.project_id}:`, error);
              return {
                ...warranty,
                ext_project_name: `Project ${warranty.project_id}`,
                warranty_status: 'not started'
              };
            }
          })
        );
        
        setWarranties(warrantiesWithNames);
        setPagination({
          count: response.data.count,
          next: response.data.next,
          previous: response.data.previous
        });
      } else {
        // Handle non-paginated response
        const warrantiesWithNames = await Promise.all(
          response.data.map(async (warranty) => {
            try {
              const projectResponse = await axios.get(`/api/warranties/project-warranty-details/${warranty.project_id}/`);
              return {
                ...warranty,
                ext_project_name: projectResponse.data.project_name || `Project ${warranty.project_id}`,
                warranty_status: projectResponse.data.warranty_status || 'not started'
              };
            } catch (error) {
              return {
                ...warranty,
                ext_project_name: `Project ${warranty.project_id}`,
                warranty_status: 'not started'
              };
            }
          })
        );
        
        setWarranties(warrantiesWithNames);
      }
      
      setError("");
    } catch (error) {
      console.error("Error fetching warranties:", error);
      setError("Failed to load warranties. Please check the console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextPage = () => {
    if (pagination.next) {
      fetchWarranties(pagination.next);
    }
  };

  const handlePreviousPage = () => {
    if (pagination.previous) {
      fetchWarranties(pagination.previous);
    }
  };

  return (
    <div className="body-content-container">
      <div className="header-section">
        <h1 className="page-title">Warranty Management</h1>
      </div>
  
      {error && <div className="alert alert-error">{error}</div>}
        
      <div className="data-section">
        {isLoading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading warranties...</p>
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Project ID</th>
                    <th>Project Name</th>
                    <th>Coverage (Years)</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Warranty Status</th>
                  </tr>
                </thead>
                <tbody>
                  {warranties.length > 0 ? (
                    warranties.map((warranty) => (
                      <tr key={warranty.project_id}>
                        <td>{warranty.project_id}</td>
                        <td>{warranty.ext_project_name || `Project ${warranty.project_id}`}</td>
                        <td>{warranty.warranty_coverage_yr}</td>
                        <td>{warranty.warranty_start_date ? new Date(warranty.warranty_start_date).toLocaleDateString() : 'N/A'}</td>
                        <td>{warranty.warranty_end_date ? new Date(warranty.warranty_end_date).toLocaleDateString() : 'N/A'}</td>
                        <td>{warranty.warranty_status || 'Not specified'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="no-data">
                        <div className="empty-state">
                          <span className="icon">📋</span>
                          <p>No warranties found</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {(pagination.next || pagination.previous) && (
              <div className="pagination-controls">
                <button 
                  onClick={handlePreviousPage} 
                  disabled={!pagination.previous}
                  className="btn btn-pagination"
                >
                  Previous
                </button>
                <div className="pagination-info">
                  Showing {warranties.length} of {pagination.count} warranties
                </div>
                <button 
                  onClick={handleNextPage} 
                  disabled={!pagination.next}
                  className="btn btn-pagination"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BodyContent;