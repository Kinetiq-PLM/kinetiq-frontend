import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../styles/Warranties.css";

const BodyContent = () => {
  const [warranties, setWarranties] = useState([]);
  const [selectedWarranties, setSelectedWarranties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newWarranty, setNewWarranty] = useState({
    project_id: "",
    warranty_coverage_yr: "1",
    warranty_start_date: "",
    warranty_end_date: ""
  });
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null
  });
  
  const [projectSuggestions, setProjectSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const suggestionRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    fetchWarranties();
    
    // Load project suggestions when the form is shown
    if (showAddForm) {
      fetchProjectSuggestions("PROJ");
    }
    
    const handleClickOutside = (event) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showAddForm]);

  const fetchWarranties = async (url = '/api/warranties/') => {
    setIsLoading(true);
    try {
      const response = await axios.get(url);
      
      if (response.data.results !== undefined) {
        setWarranties(response.data.results);
        setPagination({
          count: response.data.count,
          next: response.data.next,
          previous: response.data.previous
        });
      } else {
        setWarranties(response.data);
      }
      
      setError("");
    } catch (err) {
      console.error("Error fetching warranties:", err);
      setError("Failed to load warranties. Please check the console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProjectSuggestions = async (query) => {
    console.log("Fetching project suggestions for:", query);
    setIsLoadingSuggestions(true);
    
    try {
      // Use the correct API endpoint
      const response = await axios.get(`/api/project-autocomplete/?query=${query}`);
      console.log("Project suggestions response:", response.data);
      
      if (response.data && response.data.length > 0) {
        setProjectSuggestions(response.data);
        setShowSuggestions(true);
      } else {
        setProjectSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (err) {
      console.error("Error fetching project suggestions:", err);
      setProjectSuggestions([]);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const handleProjectInputChange = (e) => {
    const value = e.target.value;
    setNewWarranty(prev => ({ ...prev, project_id: value }));
    
    if (value.length >= 2) {
      fetchProjectSuggestions(value);
    } else {
      setProjectSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleProjectSelect = (projectId) => {
    setNewWarranty(prev => ({ ...prev, project_id: projectId }));
    setShowSuggestions(false);
  };

  const handleCheckboxChange = (warrantyId) => {
    setSelectedWarranties(prev => {
      if (prev.includes(warrantyId)) {
        return prev.filter(id => id !== warrantyId);
      } else {
        return [...prev, warrantyId];
      }
    });
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = warranties.map(warranty => warranty.project_warranty_id);
      setSelectedWarranties(allIds);
    } else {
      setSelectedWarranties([]);
    }
  };

  const handleDeleteWarranties = async () => {
    if (selectedWarranties.length === 0) {
      setError("Please select at least one warranty to delete");
      return;
    }

    try {
      await axios.delete('/api/warranties/bulk-delete/', {
        data: { ids: selectedWarranties }
      });
      
      setWarranties(prev => prev.filter(
        warranty => !selectedWarranties.includes(warranty.project_warranty_id)
      ));
      setSelectedWarranties([]);
      setError("");
    } catch (err) {
      console.error("Error deleting warranties:", err);
      setError("Failed to delete warranties. Please try again.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewWarranty(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (name === "warranty_start_date" || name === "warranty_coverage_yr") {
      const startDate = new Date(name === "warranty_start_date" ? value : newWarranty.warranty_start_date);
      const years = parseInt(name === "warranty_coverage_yr" ? value : newWarranty.warranty_coverage_yr);
      
      if (!isNaN(startDate.getTime()) && !isNaN(years)) {
        const endDate = new Date(startDate);
        endDate.setFullYear(endDate.getFullYear() + years);
        
        setNewWarranty(prev => ({
          ...prev,
          warranty_end_date: endDate.toISOString().split('T')[0]
        }));
      }
    }
  };

  const handleAddWarranty = async (e) => {
    e.preventDefault();
    
    try {
      console.log("Sending warranty data:", newWarranty);
      
    const formattedWarranty = {
      ...newWarranty,
      warranty_start_date: newWarranty.warranty_start_date, // Should be in YYYY-MM-DD format
      warranty_end_date: newWarranty.warranty_end_date,     // Should be in YYYY-MM-DD format
      warranty_coverage_yr: parseInt(newWarranty.warranty_coverage_yr)
    };
      
      console.log("Formatted warranty data:", formattedWarranty);
      
      const response = await axios.post('/api/warranties/', formattedWarranty);
      console.log("Add warranty response:", response.data);
      
      setWarranties(prev => [...prev, response.data]);
      
      setNewWarranty({
        project_id: "",
        warranty_coverage_yr: "1",
        warranty_start_date: "",
        warranty_end_date: ""
      });
      setShowAddForm(false);
      setError("");
    } catch (err) {
      console.error("Error adding warranty:", err);
      if (err.response && err.response.data) {
        console.error("Error details:", err.response.data);
        
        if (typeof err.response.data === 'object') {
          const errorMessages = Object.entries(err.response.data)
            .map(([field, errors]) => `${field}: ${errors.join(', ')}`)
            .join('; ');
          setError(`Failed to add warranty: ${errorMessages}`);
        } else {
          setError(`Failed to add warranty: ${err.response.data}`);
        }
      } else {
        setError("Failed to add warranty. Please check your inputs.");
      }
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

  const handleDragStart = (e, projectId) => {
    e.dataTransfer.setData("text/plain", projectId);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const projectId = e.dataTransfer.getData("text/plain");
    setNewWarranty(prev => ({ ...prev, project_id: projectId }));
    setIsDragging(false);
    e.target.classList.remove('drag-over');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.target.classList.add('drag-over');
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.target.classList.remove('drag-over');
    setIsDragging(false);
  };

  const handleFocus = () => {
    if (newWarranty.project_id.length >= 2) {
      fetchProjectSuggestions(newWarranty.project_id);
    }
  };


    return (
      <div className="body-content-container">
        <div className="header-section">
          <h1 className="page-title">Warranty Management</h1>
          <div className="action-buttons">
            <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
              {showAddForm ? "Cancel" : "Add Warranty"}
            </button>
            <button className="btn btn-danger" onClick={handleDeleteWarranties}>
              Delete Selected
            </button>
          </div>
        </div>
  
        {error && <div className="alert alert-error">{error}</div>}
        
        {showAddForm && (
          <div className="card form-card" ref={formRef}>
            <div className="card-header">
              <h3>Add New Warranty</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleAddWarranty}>
                <div className="form-group">
                  <label>Project ID:</label>
                  <div className="autocomplete-container" ref={suggestionRef}>
                    <input 
                      type="text" 
                      name="project_id" 
                      value={newWarranty.project_id} 
                      onChange={handleProjectInputChange}
                      onFocus={handleFocus}
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onDragEnter={handleDragEnter}
                      onDragLeave={handleDragLeave}
                      className={`form-input ${isDragging ? 'drag-over' : ''}`}
                      placeholder="Type or drag a project ID here"
                      required 
                    />
                    <div className="input-hint">
                      Type to search for projects or drag from below
                    </div>
                    
                    {isLoadingSuggestions && (
                      <div className="loading-indicator">Loading projects...</div>
                    )}
                    
                    {showSuggestions && projectSuggestions.length > 0 && (
                      <ul className="suggestions-dropdown">
                        {projectSuggestions.map((project, index) => (
                          <li 
                            key={index} 
                            onClick={() => handleProjectSelect(project.project_id)}
                            className="suggestion-item"
                          >
                            <strong>{project.project_id}</strong>
                            {project.project_name && <span> - {project.project_name}</span>}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Warranty Coverage (Years):</label>
                    <input 
                      type="number" 
                      name="warranty_coverage_yr" 
                      value={newWarranty.warranty_coverage_yr} 
                      onChange={handleInputChange} 
                      min="1"
                      className="form-input"
                      required 
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Start Date:</label>
                    <input 
                      type="date" 
                      name="warranty_start_date" 
                      value={newWarranty.warranty_start_date} 
                      onChange={handleInputChange} 
                      className="form-input"
                      required 
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>End Date:</label>
                    <input 
                      type="date" 
                      name="warranty_end_date" 
                      value={newWarranty.warranty_end_date} 
                      onChange={handleInputChange} 
                      className="form-input"
                      required 
                    />
                  </div>
                </div>
                
                <div className="form-actions">
                  <button type="submit" className="btn btn-submit">Add Warranty</button>
                </div>
              </form>
            </div>
          </div>
        )}
        
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
                      <th className="checkbox-cell">
                        <input 
                          type="checkbox" 
                          onChange={handleSelectAll} 
                          checked={selectedWarranties.length === warranties.length && warranties.length > 0}
                        />
                      </th>
                      <th>Warranty ID</th>
                      <th>Project ID</th>
                      <th>Coverage (Years)</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {warranties.length > 0 ? (
                      warranties.map((warranty) => (
                        <tr key={warranty.project_warranty_id}>
                          <td className="checkbox-cell">
                            <input 
                              type="checkbox" 
                              checked={selectedWarranties.includes(warranty.project_warranty_id)} 
                              onChange={() => handleCheckboxChange(warranty.project_warranty_id)} 
                            />
                          </td>
                          <td>{warranty.project_warranty_id}</td>
                          <td 
                            draggable 
                            onDragStart={(e) => handleDragStart(e, warranty.project_id)}
                            className="draggable-cell"
                            title="Drag this project ID to the form"
                          >
                            {warranty.project_id}
                          </td>
                          <td>{warranty.warranty_coverage_yr}</td>
                          <td>{new Date(warranty.warranty_start_date).toLocaleDateString()}</td>
                          <td>{new Date(warranty.warranty_end_date).toLocaleDateString()}</td>
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