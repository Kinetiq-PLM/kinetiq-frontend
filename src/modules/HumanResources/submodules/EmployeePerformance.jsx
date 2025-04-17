/*******************************************************
 *      EMPLOYEEPERFORMANCE.JSX
 * (FIRST HALF) - Imports, State, Fetch, Logic
 *******************************************************/
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/EmployeePerformance.css";
import { FiSearch } from "react-icons/fi";

const RATING_LABELS = {
  5: "Outstanding",
  4: "Very Satisfactory",
  3: "Satisfactory",
  2: "Fair",
  1: "Poor"
};

const EmployeePerformance = () => {
  /******************************************
   * State & Hooks
   ******************************************/
  const [performanceData, setPerformanceData] = useState([]);
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

  // Rating Modal
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedPerformance, setSelectedPerformance] = useState(null);
  const [dotsMenuOpen, setDotsMenuOpen] = useState(null);

  /******************************************
   * 1) Fetch Performance Data
   ******************************************/
  const fetchPerformanceData = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/employee_performance/");
      setPerformanceData(res.data);
    } catch (err) {
      console.error("Failed to fetch performance data:", err);
      showToast("Failed to fetch employee performance", false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPerformanceData();
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

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(
        `http://127.0.0.1:8000/api/employee_performance/${selectedPerformance.performance_id}/`,
        { rating: parseInt(selectedPerformance.rating) }
      );
      setShowRatingModal(false);
      showToast("Rating updated successfully");
      fetchPerformanceData();
    } catch (err) {
      console.error("Update rating error:", err);
      showToast("Failed to update rating", false);
    }
  };
/*******************************************************
 *      EMPLOYEEPERFORMANCE.JSX
 * (SECOND HALF) - Render & Export
 *******************************************************/

  /******************************************
   * Render Table
   ******************************************/
  const renderPerformanceTable = () => {
    if (loading) {
      return <div className="hr-no-results">Loading performance data...</div>;
    }

    const { paginated, totalPages, totalCount } = filterAndPaginate(performanceData);
    if (!paginated.length) {
      return <div className="hr-no-results">No performance records found.</div>;
    }

    return (
      <div className="hr-department-no-scroll-wrapper">
        <div className="hr-department-table-scrollable">
          <table className="hr-department-table hr-department-no-scroll-table">
            <thead>
              <tr>
                <th>Performance ID</th>
                <th>Employee ID</th>
                <th>Employee Name</th>
                <th>Immediate Superior ID</th>
                <th>Immediate Superior Name</th>
                <th>Rating</th>
                <th>Bonus Amount</th>
                <th>Review Date</th>
                <th>Bonus Payment Month</th>
                <th>Updated At</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((perf, index) => (
                <tr key={perf.performance_id || index}>
                  <td>{perf.performance_id}</td>
                  <td>{perf.employee_id}</td>
                  <td>{perf.employee_name}</td>
                  <td>{perf.immediate_superior_id}</td>
                  <td>{perf.immediate_superior_name}</td>
                  <td>{RATING_LABELS[perf.rating] || perf.rating}</td>
                  <td>{perf.bonus_amount}</td>
                  <td>{perf.review_date}</td>
                  <td>{perf.bonus_payment_month}</td>
                  <td>{perf.updated_at}</td>
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
                            onClick={() => {
                              setSelectedPerformance(perf);
                              setShowRatingModal(true);
                              setDotsMenuOpen(null);
                            }}
                          >
                            Rate
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

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
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
        </div>
      </div>
    );
  };

  /******************************************
   * Main Return
   ******************************************/
  return (
    <div className="hr-employee-performance">
      <div className="hr-employee-performance-body-content-container">
        <div className="hr-employee-performance-scrollable">
          {/* Page Heading */}
          <div className="hr-department-heading">
            <h2><strong>Employee Performance</strong></h2>
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
                <option value="review_date">Sort by Review Date</option>
              </select>

              {/* No Add Button, No Archive Button */}
            </div>
          </div>

          {/* Table Content */}
          <div className="hr-department-table-container">
            {renderPerformanceTable()}
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

      {/* Rating Modal */}
      {showRatingModal && selectedPerformance && (
        <div className="hr-department-modal-overlay">
          <div className="hr-department-modal">
            <h3 style={{ marginBottom: "1rem" }}>Update Rating</h3>
            <form onSubmit={handleRatingSubmit} className="hr-department-modal-form">
              <div className="form-group">
                <label>Performance ID</label>
                <input type="text" value={selectedPerformance.performance_id} disabled />
              </div>
              <div className="form-group">
                <label>Employee</label>
                <input type="text" value={selectedPerformance.employee_name} disabled />
              </div>
              <div className="form-group">
                <label>Rating *</label>
                <select 
                  value={selectedPerformance.rating}
                  onChange={(e) => setSelectedPerformance({
                    ...selectedPerformance,
                    rating: e.target.value
                  })}
                  required
                >
                  <option value="">Select Rating</option>
                  {Object.entries(RATING_LABELS).reverse().map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Review Date</label>
                <input type="text" value={selectedPerformance.review_date} disabled />
              </div>
              <div className="hr-department-modal-buttons">
                <button type="submit" className="submit-btn">Save</button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowRatingModal(false)}
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

export default EmployeePerformance;
