/*******************************************************
 *         EMPLOYEESALARY.JSX
 * (FIRST HALF) - Imports, State, Fetch, Logic
 *******************************************************/
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/EmployeeSalary.css";
import { FiSearch } from "react-icons/fi";

const EmployeeSalary = () => {
  /******************************************
   * State & Hooks
   ******************************************/
  const [salaryData, setSalaryData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Sort
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Toast (optional, if needed)
  const [toast, setToast] = useState(null);
  const showToast = (message, success = true) => {
    setToast({ message, success });
    setTimeout(() => setToast(null), 3000);
  };

  // Edit Modal
  const [editingSalary, setEditingSalary] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false); // Fix typo in state declaration
  const [dotsMenuOpen, setDotsMenuOpen] = useState(null);

  /******************************************
   * 1) Fetch Salary Data
   ******************************************/
  const fetchSalaryData = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/employee_salary/");
      setSalaryData(res.data);
    } catch (err) {
      console.error("Failed to fetch employee salary data:", err);
      showToast("Failed to fetch salary data", false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalaryData();
  }, []);

  /******************************************
   * 2) Searching + Debounce
   ******************************************/
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

  /******************************************
   * 3) Sorting + Pagination + Filtering
   ******************************************/
  const filterAndPaginate = (dataArray) => {
    // Filter by searchTerm
    const filtered = dataArray.filter((item) =>
      Object.values(item).some((val) => val?.toString().toLowerCase().includes(searchTerm))
    );

    // Sorting if needed
    if (sortField !== "all") {
      filtered.sort((a, b) => {
        const valA = a[sortField]?.toString().toLowerCase() || "";
        const valB = b[sortField]?.toString().toLowerCase() || "";
        return valA.localeCompare(valB);
      });
    }

    // Pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginated = filtered.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(filtered.length / itemsPerPage);

    return { paginated, totalPages, totalCount: filtered.length };
  };

  /******************************************
   * 4) Edit Salary Logic
   ******************************************/
  const handleEditSalary = (salary) => {
    setEditingSalary(salary);
    setShowEditModal(true);
    setDotsMenuOpen(null);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        base_salary: editingSalary.base_salary ? Number(editingSalary.base_salary) : null,
        daily_rate: editingSalary.daily_rate ? Number(editingSalary.daily_rate) : null
      };

      if (payload.base_salary && payload.daily_rate) {
        showToast("Please provide either base salary or daily rate, not both", false);
        return;
      }

      if (!payload.base_salary && !payload.daily_rate) {
        showToast("Please provide either base salary or daily rate", false);
        return;
      }

      await axios.patch(
        `http://127.0.0.1:8000/api/employee_salary/${editingSalary.salary_id}/`,
        payload
      );
      setShowEditModal(false);
      showToast("Salary updated successfully");
      fetchSalaryData();
    } catch (err) {
      console.error("Update salary error:", err.response?.data || err); // Log detailed error
      showToast(err.response?.data?.detail || "Failed to update salary", false); // Show detailed error message
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setEditingSalary(prev => ({
      ...prev,
      base_salary: name === 'base_salary' ? value : null,
      daily_rate: name === 'daily_rate' ? value : null,
      [name]: value === '' ? null : value // Convert empty string to null
    }));
  };

/*******************************************************
 *         EMPLOYEESALARY.JSX
 * (SECOND HALF) - Render & Export
 *******************************************************/

  /******************************************
   * Render Table
   ******************************************/
  const renderSalaryTable = () => {
    if (loading) {
      return <div className="hr-no-results">Loading salary data...</div>;
    }
  
    const { paginated, totalPages, totalCount } = filterAndPaginate(salaryData);
  
    if (!paginated.length) {
      return <div className="hr-no-results">No salary records found.</div>;
    }
  
    return (
      <>
        <div className="hr-department-no-scroll-wrapper">
          <div className="hr-department-table-scrollable">
            <table className="hr-department-table hr-department-no-scroll-table">
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
                {paginated.map((sal, index) => (
                  <tr key={sal.salary_id || index}>
                    <td>{sal.salary_id}</td>
                    <td>{sal.employee_id}</td>
                    <td>{sal.employee_name}</td>
                    <td>{sal.base_salary || '-'}</td>
                    <td>{sal.daily_rate || '-'}</td>
                    <td>{sal.effective_date}</td>
                    <td className="hr-department-actions">
                      <div
                        className="hr-department-dots"
                        onClick={() => setDotsMenuOpen(dotsMenuOpen === index ? null : index)}
                      >
                        ⋮
                        {dotsMenuOpen === index && (
                          <div className="hr-department-dropdown">
                            <div
                              className="hr-department-dropdown-item"
                              onClick={() => handleEditSalary(sal)}
                            >
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
  
        {/* Pagination Controls */}
        <div className="hr-pagination">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={i + 1 === currentPage ? "active" : ""}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <select
            className="hr-pagination-size"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(parseInt(e.target.value));
              setCurrentPage(1);
            }}
          >
            {[5, 10, 20].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>
      </>
    );
  };
  

  /******************************************
   * Main Return
   ******************************************/
  return (
    <div className="hr-employee-salary">
      <div className="hr-employee-salary-body-content-container">
        <div className="hr-employee-salary-scrollable">
          {/* Page Heading */}
          <div className="hr-department-heading">
            <h2><strong>Employee Salary</strong></h2>
            <div className="hr-department-right-controls">
              {/* Search Field */}
              <div className="hr-department-search-wrapper">
                <FiSearch className="hr-department-search-icon" />
                <input
                  type="text"
                  className="hr-department-search"
                  placeholder="Search..."
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>

              {/* Sort Dropdown */}
              <select
                className="hr-department-filter"
                value={sortField}
                onChange={(e) => setSortField(e.target.value)}
              >
                <option value="all">No Sorting</option>
                <option value="employee_id">Sort by Employee ID</option>
                <option value="employee_name">Sort by Employee Name</option>
                <option value="effective_date">Sort by Effective Date</option>
              </select>

              {/* No Add Button, No Archive Button */}
            </div>
          </div>

          {/* Table Content */}
          <div className="hr-department-table-container">
            {renderSalaryTable()}
          </div>
        </div>
      </div>

      {/* Optional Toast Notification */}
      {toast && (
        <div
          className="hr-department-toast"
          style={{ backgroundColor: toast.success ? "#4CAF50" : "#F44336" }}
        >
          {toast.message}
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingSalary && (
        <div className="hr-department-modal-overlay">
          <div className="hr-department-modal">
            <h3>Edit Salary Details</h3>
            <form onSubmit={handleEditSubmit} className="hr-department-modal-form">
              <div className="form-group">
                <label>Employee</label>
                <input type="text" value={editingSalary.employee_name} disabled />
              </div>
              <div className="form-group">
                <label>Base Salary</label>
                <input
                  type="number"
                  name="base_salary"
                  value={editingSalary.base_salary || ''}
                  onChange={handleInputChange}
                  disabled={editingSalary.daily_rate !== null && editingSalary.daily_rate !== ''}
                  step="0.01"
                  placeholder="Enter base salary"
                />
              </div>
              <div className="form-group">
                <label>Daily Rate</label>
                <input
                  type="number"
                  name="daily_rate"
                  value={editingSalary.daily_rate || ''}
                  onChange={handleInputChange}
                  disabled={editingSalary.base_salary !== null && editingSalary.base_salary !== ''}
                  step="0.01"
                  placeholder="Enter daily rate"
                />
              </div>
              <div className="form-group">
                <label>Effective Date</label>
                <input type="text" value={editingSalary.effective_date} disabled />
              </div>
              <div className="hr-department-modal-buttons">
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
    </div>
  );
};

export default EmployeeSalary;
