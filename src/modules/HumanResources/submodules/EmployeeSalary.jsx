import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/EmployeeSalary.css";
import { FiSearch } from "react-icons/fi";

const EmployeeSalary = () => {
  // State management
  const [salaryData, setSalaryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [toast, setToast] = useState(null);
  const [editingSalary, setEditingSalary] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [dotsMenuOpen, setDotsMenuOpen] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [employeeTypes, setEmployeeTypes] = useState({});
  const [lockedSalaryIds, setLockedSalaryIds] = useState([]);
  
  // Toast notification helper
  const showToast = (message, success = true) => {
    setToast({ message, success });
    setTimeout(() => setToast(null), 3000);
  };

  // Fetch salary data
  const fetchSalaryData = async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://1wj5891jxg.execute-api.ap-southeast-1.amazonaws.com/dev/api/employee_salary/employee_salary/");
      setSalaryData(res.data);
      
      // Store employment types for each employee for easy reference
      const employeeIds = [...new Set(res.data.map(salary => salary.employee_id))];
      const typesObj = {};
      
      for (const employeeId of employeeIds) {
        try {
          const empRes = await axios.get(`https://1wj5891jxg.execute-api.ap-southeast-1.amazonaws.com/dev/api/employees/${employeeId}/`);
          typesObj[employeeId] = empRes.data.employment_type;
        } catch (err) {
          console.error(`Failed to fetch employment type for ${employeeId}:`, err);
        }
      }
      
      setEmployeeTypes(typesObj);
    } catch (err) {
      console.error("Failed to fetch salary data:", err);
      showToast("Failed to fetch salary data", false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalaryData();
  }, []);

  // Search functionality with debounce
  const debounce = (fn, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn(...args), delay);
    };
  };

  const handleSearch = debounce((value) => {
    setSearchTerm(value.toLowerCase());
    setCurrentPage(1);
  }, 300);

  // Filter, sort and paginate data
  const filterAndPaginate = (dataArray) => {
    // Filter by search term
    const filtered = dataArray.filter((item) =>
      Object.values(item).some((val) => 
        val?.toString().toLowerCase().includes(searchTerm)
      )
    );

    // Sort if needed
    if (sortField !== "all") {
      filtered.sort((a, b) => {
        const valA = a[sortField]?.toString().toLowerCase() || "";
        const valB = b[sortField]?.toString().toLowerCase() || "";
        return valA.localeCompare(valB);
      });
    }

    // Paginate
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginated = filtered.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(filtered.length / itemsPerPage);

    return { paginated, totalPages };
  };

  // Edit salary handlers
  const handleEditSalary = async (salary) => {
    setFormErrors({});
    
    // Get the employment type for this employee if we don't already have it
    let employeeType = employeeTypes[salary.employee_id];
    if (!employeeType) {
      try {
        const empRes = await axios.get(`https://1wj5891jxg.execute-api.ap-southeast-1.amazonaws.com/dev/api/employees/${salary.employee_id}/`);
        employeeType = empRes.data.employment_type;
        
        // Update our cache
        setEmployeeTypes(prev => ({
          ...prev,
          [salary.employee_id]: employeeType
        }));
      } catch (err) {
        console.error(`Failed to fetch employment type for ${salary.employee_id}:`, err);
        employeeType = null;
      }
    }
    
    setEditingSalary({
      ...salary,
      employment_type: employeeType
    });
    setShowEditModal(true);
    setDotsMenuOpen(null);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});
    
    try {
      let payload = {};
      const employmentType = editingSalary.employment_type;
      
      // Build appropriate payload based on employment type
      if (employmentType === 'Regular') {
        // For Regular employees: only base_salary is allowed
        if (!editingSalary.base_salary || parseFloat(editingSalary.base_salary) <= 0) {
          setFormErrors({base_salary: ["Regular employees must have a positive base salary"]});
          showToast("Please enter a valid base salary for regular employees", false);
          return;
        }
        
        payload = {
          base_salary: parseFloat(editingSalary.base_salary),
          daily_rate: null
        };
      } 
      else if (['Contractual', 'Seasonal'].includes(employmentType)) {
        // For Contractual/Seasonal employees: only daily_rate is allowed
        if (!editingSalary.daily_rate || parseFloat(editingSalary.daily_rate) <= 0) {
          setFormErrors({daily_rate: ["Contractual/Seasonal employees must have a positive daily rate"]});
          showToast("Please enter a valid daily rate for contractual/seasonal employees", false);
          return;
        }
        
        payload = {
          daily_rate: parseFloat(editingSalary.daily_rate),
          base_salary: null
        };
      }
      else {
        // Fallback for unknown employment type
        if (editingSalary.base_salary && parseFloat(editingSalary.base_salary) > 0) {
          payload = {
            base_salary: parseFloat(editingSalary.base_salary),
            daily_rate: null
          };
        } else if (editingSalary.daily_rate && parseFloat(editingSalary.daily_rate) > 0) {
          payload = {
            daily_rate: parseFloat(editingSalary.daily_rate),
            base_salary: null
          };
        } else {
          setFormErrors({general: ["Please provide either base salary or daily rate"]});
          showToast("Please provide either base salary or daily rate", false);
          return;
        }
      }

      await axios.patch(
        `https://1wj5891jxg.execute-api.ap-southeast-1.amazonaws.com/dev/api/employee_salary/employee_salary/${editingSalary.salary_id}/`,
        payload
      );
      
      setShowEditModal(false);
      showToast("Salary updated successfully");
      fetchSalaryData();
    } catch (err) {
      console.error("Update salary error:", err);
      
    // Handle error messages from backend
    if (err.response && err.response.data) {
      let errorFields = {};
      let errorMessage = "Failed to update salary";
      
      // Check for foreign key constraint errors from labor_cost
      if (err.response.data.non_field_errors && 
        err.response.data.non_field_errors.some(msg => msg.includes("labor cost"))) {
        setLockedSalaryIds(prev => [...prev, editingSalary.salary_id]);
        errorMessage = err.response.data.non_field_errors[0];
        errorFields.general = [errorMessage];
        
        // Add more helpful details in the UI
        showToast("This salary record cannot be modified because it's being used in labor cost records", false);
      }
      else if (typeof err.response.data === 'string') {
        errorMessage = err.response.data;
        errorFields.general = [errorMessage];
      } 
      else if (err.response.data.detail) {
        errorMessage = err.response.data.detail;
        errorFields.general = [errorMessage];
      } 
      else {
        // Process field-specific errors (existing code)
        errorFields = err.response.data;
        
        // Create a readable message from all errors
        const errorMessages = [];
        for (const field in err.response.data) {
          if (Array.isArray(err.response.data[field])) {
            errorMessages.push(err.response.data[field][0]);
          } else {
            errorMessages.push(err.response.data[field]);
          }
        }
        
        if (errorMessages.length > 0) {
          errorMessage = errorMessages.join('. ');
        }
      }
      
      setFormErrors(errorFields);
      showToast(errorMessage, false);
    } else {
      showToast("Failed to update salary", false);
    }
  }
};

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const employmentType = editingSalary.employment_type;
    
    // Clear form errors when user types
    setFormErrors(prev => {
      const updated = {...prev};
      delete updated[name];
      delete updated.general;
      return updated;
    });
    
    // Adjust inputs based on employment type
    if (employmentType === 'Regular') {
      // Regular employees should only have base_salary
      if (name === 'base_salary') {
        setEditingSalary(prev => ({
          ...prev,
          base_salary: value,
          daily_rate: null
        }));
      }
    } 
    else if (['Contractual', 'Seasonal'].includes(employmentType)) {
      // Contractual/Seasonal employees should only have daily_rate
      if (name === 'daily_rate') {
        setEditingSalary(prev => ({
          ...prev,
          daily_rate: value,
          base_salary: null
        }));
      }
    }
    else {
      // For unknown types or when employment_type is not available
      if (name === 'base_salary') {
        setEditingSalary(prev => ({
          ...prev,
          base_salary: value,
          daily_rate: null // Clear daily_rate when base_salary is set
        }));
      } else if (name === 'daily_rate') {
        setEditingSalary(prev => ({
          ...prev,
          daily_rate: value,
          base_salary: null // Clear base_salary when daily_rate is set
        }));
      } else {
        setEditingSalary(prev => ({
          ...prev,
          [name]: value
        }));
      }
    }
  };

  // Render salary table
  const renderSalaryTable = () => {
    if (loading) {
      return <div className="hr-employee-salary-no-results">Loading salary data...</div>;
    }

    const { paginated, totalPages } = filterAndPaginate(salaryData);

    if (!paginated.length) {
      return <div className="hr-employee-salary-no-results">No salary records found.</div>;
    }

    return (
      <>
        <div className="hr-employee-salary-no-scroll-wrapper">
          <div className="hr-employee-salary-table-scrollable">
            <table className="hr-employee-salary-table hr-employee-salary-no-scroll-table">
              <thead>
                <tr>
                  <th>Salary ID</th>
                  <th>Employee ID</th>
                  <th>Employee Name</th>
                  <th>Base Salary</th>
                  <th>Daily Rate</th>
                  <th>Effective Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
              {paginated.map((salary, index) => (
                <tr key={salary.salary_id} className={lockedSalaryIds.includes(salary.salary_id) ? "hr-employee-salary-locked" : ""}>
                  <td>{salary.salary_id}</td>
                  <td>{salary.employee_id}</td>
                  <td>{salary.employee_name}</td>
                  <td>{salary.base_salary || '-'}</td>
                  <td>{salary.daily_rate || '-'}</td>
                  <td>{salary.effective_date}</td>
                  <td className="hr-employee-salary-actions">
                    <div className="hr-employee-salary-dots"
                        onClick={() => setDotsMenuOpen(dotsMenuOpen === index ? null : index)}>
                      ⋮
                      {dotsMenuOpen === index && (
                        <div className="hr-employee-salary-dropdown">
                          <div className="hr-employee-salary-dropdown-item"
                              onClick={() => handleEditSalary(salary)}
                              title={lockedSalaryIds.includes(salary.salary_id) ? 
                                      "This salary record cannot be edited because it's used in labor costs" : ""}>
                            {lockedSalaryIds.includes(salary.salary_id) && <span className="lock-icon">🔒 </span>}
                            Edit
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="hr-employee-salary-pagination">
          <button 
            className="hr-employee-salary-pagination-arrow" 
            onClick={() => setCurrentPage(1)} 
            disabled={currentPage === 1}
          >
            &#171; {/* Double left arrow */}
          </button>
          
          <button 
            className="hr-employee-salary-pagination-arrow" 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
            disabled={currentPage === 1}
          >
            &#8249; {/* Single left arrow */}
          </button>
          
          <div className="hr-employee-salary-pagination-numbers">
            {(() => {
              const pageNumbers = [];
              const maxVisiblePages = 5;
              
              if (totalPages <= maxVisiblePages + 2) {
                // Show all pages if there are few
                for (let i = 1; i <= totalPages; i++) {
                  pageNumbers.push(
                    <button
                      key={i}
                      className={i === currentPage ? "active" : ""}
                      onClick={() => setCurrentPage(i)}
                    >
                      {i}
                    </button>
                  );
                }
              } else {
                // Always show first page
                pageNumbers.push(
                  <button
                    key={1}
                    className={1 === currentPage ? "active" : ""}
                    onClick={() => setCurrentPage(1)}
                  >
                    1
                  </button>
                );
                
                // Calculate range around current page
                let startPage = Math.max(2, currentPage - Math.floor(maxVisiblePages / 2));
                let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);
                
                // Adjust if we're near the end
                if (endPage - startPage < maxVisiblePages - 1) {
                  startPage = Math.max(2, endPage - maxVisiblePages + 1);
                }
                
                // Add ellipsis after first page if needed
                if (startPage > 2) {
                  pageNumbers.push(<span key="ellipsis1" className="hr-employee-salary-pagination-ellipsis">...</span>);
                }
                
                // Add middle pages
                for (let i = startPage; i <= endPage; i++) {
                  pageNumbers.push(
                    <button
                      key={i}
                      className={i === currentPage ? "active" : ""}
                      onClick={() => setCurrentPage(i)}
                    >
                      {i}
                    </button>
                  );
                }
                
                // Add ellipsis before last page if needed
                if (endPage < totalPages - 1) {
                  pageNumbers.push(<span key="ellipsis2" className="hr-employee-salary-pagination-ellipsis">...</span>);
                }
                
                // Always show last page
                pageNumbers.push(
                  <button
                    key={totalPages}
                    className={totalPages === currentPage ? "active" : ""}
                    onClick={() => setCurrentPage(totalPages)}
                  >
                    {totalPages}
                  </button>
                );
              }
              
              return pageNumbers;
            })()}
          </div>
          
          <button 
            className="hr-employee-salary-pagination-arrow" 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
            disabled={currentPage === totalPages}
          >
            &#8250; {/* Single right arrow */}
          </button>
          
          <button 
            className="hr-employee-salary-pagination-arrow" 
            onClick={() => setCurrentPage(totalPages)} 
            disabled={currentPage === totalPages}
          >
            &#187; {/* Double right arrow */}
          </button>
          
          <select
            className="hr-employee-salary-pagination-size"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(parseInt(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>
      </>
    );
  };

  return (
    <div className="hr-employee-salary">
      <div className="hr-employee-salary-body-content-container">
        <div className="hr-employee-salary-scrollable">
          <div className="hr-employee-salary-heading">
            <h2><strong>Employee Salary</strong></h2>
            <div className="hr-employee-salary-right-controls">
              <div className="hr-employee-salary-search-wrapper">
                <FiSearch className="hr-employee-salary-search-icon" />
                <input
                  type="text"
                  className="hr-employee-salary-search"
                  placeholder="Search..."
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
              <select
                className="hr-employee-salary-filter"
                value={sortField}
                onChange={(e) => setSortField(e.target.value)}
              >
                <option value="all">No Sorting</option>
                <option value="employee_id">Sort by Employee ID</option>
                <option value="employee_name">Sort by Employee Name</option>
                <option value="effective_date">Sort by Effective Date</option>
              </select>
            </div>
          </div>

          <div className="hr-employee-salary-table-container">
            {renderSalaryTable()}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && editingSalary && (
        <div className="hr-employee-salary-modal-overlay">
          <div className="hr-employee-salary-modal">
            <h3>Edit Salary Details</h3>
            
            {/* Employee info and guidance */}
            <div className="hr-employee-salary-employee-info">
              <p><strong>Employee:</strong> {editingSalary.employee_name}</p>
              {editingSalary.employment_type && (
                <p><strong>Employment Type:</strong> {editingSalary.employment_type}</p>
              )}
              
              {/* Guidance box */}
              <div className="hr-employee-salary-guidance">
                {editingSalary.employment_type === 'Regular' ? (
                  <p>Regular employees must have a base salary (no daily rate).</p>
                ) : editingSalary.employment_type === 'Contractual' || editingSalary.employment_type === 'Seasonal' ? (
                  <p>Contractual/Seasonal employees must have a daily rate (no base salary).</p>
                ) : (
                  <p>Please provide either base salary or daily rate based on the employee type.</p>
                )}
              </div>
            </div>
            
            <form onSubmit={handleEditSubmit} className="hr-employee-salary-modal-form">
              {/* Display general form errors */}
              {formErrors.general && formErrors.general[0].includes("labor cost") ? (
                <div className="error-box">
                  <h4>This Record Cannot Be Modified</h4>
                  <p>{formErrors.general[0]}</p>
                  <p>Please create a new salary record for this employee instead.</p>
                </div>
              ) : formErrors.general && (
                <div className="hr-employee-salary-form-error general-error">
                  {formErrors.general[0]}
                </div>
              )}
              
              {/* Base Salary Field */}
              <div className="form-group">
                <label>
                  Base Salary
                  {editingSalary.employment_type === 'Regular' && 
                    <span className="required-indicator">*</span>
                  }
                </label>
                <input
                  type="number"
                  name="base_salary"
                  value={editingSalary.base_salary || ''}
                  onChange={handleInputChange}
                  className={`${formErrors.base_salary ? 'input-error' : ''} ${editingSalary.employment_type === 'Contractual' || editingSalary.employment_type === 'Seasonal' ? 'disabled-input' : ''}`}
                  disabled={editingSalary.employment_type === 'Contractual' || editingSalary.employment_type === 'Seasonal'}
                  step="0.01"
                  min="0"
                  placeholder={editingSalary.employment_type === 'Regular' ? "Required for Regular employees" : "Not applicable"}
                />
                {formErrors.base_salary && (
                  <div className="hr-employee-salary-form-error">
                    {formErrors.base_salary[0]}
                  </div>
                )}
              </div>
              
              {/* Daily Rate Field */}
              <div className="form-group">
                <label>
                  Daily Rate
                  {(editingSalary.employment_type === 'Contractual' || editingSalary.employment_type === 'Seasonal') &&
                    <span className="required-indicator">*</span>
                  }
                </label>
                <input
                  type="number"
                  name="daily_rate"
                  value={editingSalary.daily_rate || ''}
                  onChange={handleInputChange}
                  className={`${formErrors.daily_rate ? 'input-error' : ''} ${editingSalary.employment_type === 'Regular' ? 'disabled-input' : ''}`}
                  disabled={editingSalary.employment_type === 'Regular'}
                  step="0.01"
                  min="0"
                  placeholder={(editingSalary.employment_type === 'Contractual' || editingSalary.employment_type === 'Seasonal') ? "Required for Contractual/Seasonal" : "Not applicable"}
                />
                {formErrors.daily_rate && (
                  <div className="hr-employee-salary-form-error">
                    {formErrors.daily_rate[0]}
                  </div>
                )}
              </div>
              
              <div className="hr-employee-salary-modal-buttons">
                <button type="submit" className="submit-btn">Save</button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div
          className="hr-employee-salary-toast"
          style={{ backgroundColor: toast.success ? "#4CAF50" : "#F44336" }}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default EmployeeSalary;