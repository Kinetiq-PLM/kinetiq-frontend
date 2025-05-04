// Enhanced Warranties.jsx
import React, { useState, useEffect, useCallback } from "react";
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
  //const [selectedWarranties, setSelectedWarranties] = useState([]);
  const [statusCounts, setStatusCounts] = useState({
    active: 0,
    expired: 0,
    pending: 0
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isSearching, setIsSearching] = useState(false);

  const fetchWarranties = useCallback(async (url = '/api/warranties/') => {
    setIsLoading(true);
    try {
      const response = await axios.get(url);
      
      if (response.data.results !== undefined) {
        const warrantiesWithNames = await Promise.all(
          response.data.results.map(async (warranty) => {
            try {
              const projectResponse = await axios.get(`/api/warranties/project-warranty-details/${warranty.project_id}/`);
              return {
                ...warranty,
                ext_project_name: projectResponse.data.project_name || `Project ${warranty.project_id}`,
                warranty_status: projectResponse.data.warranty_status || 'Pending'
              };
            } catch (error) {
              console.error(`Error fetching details for project ${warranty.project_id}:`, error);
              return {
                ...warranty,
                ext_project_name: `Project ${warranty.project_id}`,
                warranty_status: 'Pending'
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
        const warrantiesWithNames = await Promise.all(
          response.data.map(async (warranty) => {
            try {
              const projectResponse = await axios.get(`/api/warranties/project-warranty-details/${warranty.project_id}/`);
              return {
                ...warranty,
                ext_project_name: projectResponse.data.project_name || `Project ${warranty.project_id}`,
                warranty_status: projectResponse.data.warranty_status || 'Pending'
              };
            } catch (error) {
              return {
                ...warranty,
                ext_project_name: `Project ${warranty.project_id}`,
                warranty_status: 'Pending'
              };
            }
          })
        );
        
        setWarranties(warrantiesWithNames);
      }
      
      setError("");
    } catch (error) {
      console.error("Error fetching warranties:", error);
      setError("Failed to load warranties. Please try refreshing the page.");
    } finally {
      setIsLoading(false);
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    fetchWarranties();
  }, [fetchWarranties]);

  useEffect(() => {
    // Calculate status counts whenever warranties change
    if (warranties.length > 0) {
      const counts = warranties.reduce((acc, warranty) => {
        const status = warranty.warranty_status?.toLowerCase() || '';
        if (status.includes('active')) acc.active++;
        else if (status.includes('expired')) acc.expired++;
        else acc.pending++;
        return acc;
      }, { active: 0, expired: 0, pending: 0 });
      
      setStatusCounts(counts);
    }
  }, [warranties]);

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

  // //const toggleWarrantySelection = (warrantyId) => {
  //   setSelectedWarranties(prev => {
  //     if (prev.includes(warrantyId)) {
  //       return prev.filter(id => id !== warrantyId);
  //     } else {
  //       return [...prev, warrantyId];
  //     }
  //   });
  // };

  const handleSearch = (e) => {
    e.preventDefault();
    setIsSearching(true);
    
    // Make API call with search parameter
    axios.get(`/api/warranties/?search=${encodeURIComponent(searchQuery)}`)
      .then(async (response) => {
        const results = response.data.results || response.data;
        
        // Process the results
        const warrantiesWithNames = await Promise.all(
          results.map(async (warranty) => {
            try {
              const projectResponse = await axios.get(`/api/warranties/project-warranty-details/${warranty.project_id}/`);
              return {
                ...warranty,
                ext_project_name: projectResponse.data.project_name || `Project ${warranty.project_id}`,
                warranty_status: projectResponse.data.warranty_status || 'Pending'
              };
            } catch (error) {
              return {
                ...warranty,
                ext_project_name: `Project ${warranty.project_id}`,
                warranty_status: 'Pending'
              };
            }
          })
        );
        
        setWarranties(warrantiesWithNames);
        if (response.data.count !== undefined) {
          setPagination({
            count: response.data.count,
            next: response.data.next,
            previous: response.data.previous
          });
        }
        setIsSearching(false);
      })
      .catch(error => {
        console.error("Error searching warranties:", error);
        setError("Failed to search warranties. Please try again.");
        setIsSearching(false);
      });
  };
  const handleFilterChange = (e) => {
    const status = e.target.value;
    setFilterStatus(status);
    
    if (status === 'all') {
      fetchWarranties();
      return;
    }
    
    // Filter by status
    setIsSearching(true);
    const filteredWarranties = warranties.filter(warranty => {
      const warrantyStatus = warranty.warranty_status?.toLowerCase() || '';
      if (status === 'active' && warrantyStatus.includes('active')) return true;
      if (status === 'expired' && warrantyStatus.includes('expired')) return true;
      if (status === 'pending' && 
          !warrantyStatus.includes('active') && 
          !warrantyStatus.includes('expired')) return true;
      return false;
    });
    
    setWarranties(filteredWarranties);
    setIsSearching(false);
  };

  const getStatusClass = (status) => {
    const statusLower = status?.toLowerCase() || '';
    if (statusLower.includes('active')) return 'status-active';
    if (statusLower.includes('expired')) return 'status-expired';
    return 'status-pending';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const getYearsRemaining = (endDate) => {
    if (!endDate) return null;
    
    const today = new Date();
    const end = new Date(endDate);
    
    // Calculate difference in years
    const diffTime = end - today;
    if (diffTime <= 0) return "Expired";
    
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffYears = Math.floor(diffDays / 365);
    const remainingDays = diffDays % 365;
    const diffMonths = Math.floor(remainingDays / 30);
    
    // Format the output based on years and months
    if (diffYears === 0) {
      return diffMonths === 1 ? "1 month left" : `${diffMonths} months left`;
    } else if (diffMonths === 0) {
      return diffYears === 1 ? "1 year left" : `${diffYears} years left`;
    } else {
      const yearText = diffYears === 1 ? "1 year" : `${diffYears} years`;
      const monthText = diffMonths === 1 ? "1 month" : `${diffMonths} months`;
      return `${yearText}, ${monthText} left`;
    }
  };

  return (
    <div className="body-content-container-warranty">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Warranty Management</h1>
      </div>
  
      {error && (
        <div className="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          {error}
        </div>
      )}
      
      <div className="warranty-stats">
        <div className="stat-item">
          <span className="stat-value">{statusCounts.active}</span>
          <span className="stat-label">Active Warranties</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{statusCounts.expired}</span>
          <span className="stat-label">Expired Warranties</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{statusCounts.pending}</span>
          <span className="stat-label">Pending Warranties</span>
        </div>
      </div>
      
      <div className="search-filter-bar">
        <form className="search-input-container" onSubmit={handleSearch}>
          <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Search by project ID or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
        
        <select 
          className="filter-select"
          value={filterStatus}
          onChange={handleFilterChange}
        >
          <option value="all">All Warranties</option>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
          <option value="pending">Pending</option>
        </select>
      </div>
        
      <div className="data-section">
        {isLoading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading warranties...</p>
          </div>
        ) : isSearching ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Searching...</p>
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>WARRANTY ID</th>
                    <th>PROJECT NAME</th>
                    <th>COVERAGE</th>
                    <th>START DATE</th>
                    <th>END DATE</th>
                    <th>REMAINING</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {warranties.length > 0 ? (
                    warranties.map((warranty) => (
                      <tr key={warranty.project_id}>
                        <td className="warranty-id">
                          <span className="warranty-code tooltip">
                            WARR-{String(warranty.project_id).padStart(6, '0')}
                            <span className="tooltip-text">Warranty ID for {warranty.ext_project_name}</span>
                          </span>
                        </td>
                        <td>{warranty.ext_project_name || `Project ${warranty.project_id}`}</td>
                        <td>{warranty.warranty_coverage_yr || 'N/A'} {warranty.warranty_coverage_yr === 1 ? 'Year' : 'Years'}</td>
                        <td>{formatDate(warranty.warranty_start_date)}</td>
                        <td>{formatDate(warranty.warranty_end_date)}</td>
                        <td>{getYearsRemaining(warranty.warranty_end_date)}</td>
                        <td>
                          <span className={`status-badge ${getStatusClass(warranty.warranty_status)}`}>
                            {warranty.warranty_status || 'Pending'}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="no-data">
                        <div className="empty-state">
                          <span className="icon">📋</span>
                          <p>No warranties found</p>
                          {searchQuery && (
                            <p>Try adjusting your search criteria</p>
                          )}
                          <button 
                            className="add-warranty-btn"
                            onClick={() => {
                              setSearchQuery("");
                              setFilterStatus("all");
                              fetchWarranties();
                            }}
                          >
                            View All Warranties
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {warranties.length > 0 && (pagination.next || pagination.previous) && (
              <div className="pagination-controls">
                <button 
                  onClick={handlePreviousPage} 
                  disabled={!pagination.previous}
                  className="pagination-btn"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                  Previous
                </button>
                <div className="pagination-info">
                  Showing {warranties.length} of {pagination.count} warranties
                </div>
                <button 
                  onClick={handleNextPage} 
                  disabled={!pagination.next}
                  className="pagination-btn"
                >
                  Next
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
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