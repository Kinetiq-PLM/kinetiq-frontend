/*******************************************************
 *         EMPLOYEESALARY.JSX
 *******************************************************/
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

  // Toast notification helper
  const showToast = (message, success = true) => {
    setToast({ message, success });
    setTimeout(() => setToast(null), 3000);
  };

  // Fetch salary data
  const fetchSalaryData = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/employee_salary/employee_salary/");
      setSalaryData(res.data);
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
        `http://127.0.0.1:8000/api/employee_salary/employee_salary/${editingSalary.salary_id}/`,
        payload
      );
      setShowEditModal(false);
      showToast("Salary updated successfully");
      fetchSalaryData();
    } catch (err) {
      console.error("Update salary error:", err);
      showToast("Failed to update salary", false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingSalary(prev => ({
      ...prev,
      base_salary: name === 'base_salary' ? value : null,
      daily_rate: name === 'daily_rate' ? value : null,
      [name]: value === '' ? null : value
    }));
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
                  <tr key={salary.salary_id}>
                    <td>{salary.salary_id}</td>
                    <td>{salary.employee_id}</td>
                    <td>{salary.employee_name}</td>
                    <td>{salary.base_salary || '-'}</td>
                    <td>{salary.daily_rate || '-'}</td>
                    <td>{salary.effective_date}</td>
                    <td className="hr-employee-salary-actions">
                      <div 
                        className="hr-employee-salary-dots"
                        onClick={() => setDotsMenuOpen(dotsMenuOpen === index ? null : index)}
                      >
                        ⋮
                        {dotsMenuOpen === index && (
                          <div className="hr-employee-salary-dropdown">
                            <div 
                              className="hr-employee-salary-dropdown-item"
                              onClick={() => handleEditSalary(salary)}
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

        <div className="hr-employee-salary-pagination">
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
            <form onSubmit={handleEditSubmit} className="hr-employee-salary-modal-form">
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
                  disabled={editingSalary.daily_rate !== null}
                  step="0.01"
                  min="0"
                />
              </div>
              <div className="form-group">
                <label>Daily Rate</label>
                <input
                  type="number"
                  name="daily_rate"
                  value={editingSalary.daily_rate || ''}
                  onChange={handleInputChange}
                  disabled={editingSalary.base_salary !== null}
                  step="0.01"
                  min="0"
                />
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
