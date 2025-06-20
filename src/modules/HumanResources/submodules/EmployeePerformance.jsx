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
      const res = await axios.get("http://127.0.0.1:8001/api/employee_performance/employee_performance/");
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
      // Make sure rating is a valid number
      const ratingValue = parseInt(selectedPerformance.rating);
      
      if (isNaN(ratingValue) || ratingValue < 1 || ratingValue > 5) {
        showToast("Please select a valid rating", false);
        return;
      }
      
      // Send the request with the correct data format
      await axios.patch(
        `http://127.0.0.1:8001/api/employee_performance/employee_performance/${selectedPerformance.performance_id}/`,
        { rating: ratingValue }
      );
      
      setShowRatingModal(false);
      showToast("Rating updated successfully");
      fetchPerformanceData();
    } catch (err) {
      console.error("Update rating error:", err);
      // More detailed error message for better debugging
      const errorMessage = err.response?.data?.detail || 
                          "Failed to update rating. Please try again.";
      showToast(errorMessage, false);
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
      return <div className="hr-employee-performance-no-results">Loading performance data...</div>;
    }
  
    const { paginated, totalPages, totalCount } = filterAndPaginate(performanceData);
    if (!paginated.length) {
      return <div className="hr-employee-performance-no-results">No performance records found.</div>;
    }
  
    return (
      <>
        <div className="hr-employee-performance-no-scroll-wrapper">
          <div className="hr-employee-performance-table-scrollable">
          <table className="hr-employee-performance-table hr-employee-performance-no-scroll-table">
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
                  <td>
                    <span className={`hr-rating-tag rating-${perf.rating}`}>
                      {RATING_LABELS[perf.rating] || perf.rating}
                    </span>
                  </td>
                  <td>{perf.bonus_amount}</td>
                  <td>{perf.review_date}</td>
                  <td>{perf.bonus_payment_month}</td>
                  <td>{perf.updated_at}</td>
                  <td className="hr-employee-performance-actions">
                    <div
                      className="hr-employee-performance-dots"
                      onClick={() => setDotsMenuOpen(dotsMenuOpen === index ? null : index)}
                    >
                      ⋮
                      {dotsMenuOpen === index && (
                        <div className="hr-employee-performance-dropdown">
                          <div
                            className="hr-employee-performance-dropdown-item"
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
          </div>
        </div>
  
        {/* Pagination moved outside */}
        <div className="hr-employee-performance-pagination">
          <button 
            className="hr-employee-performance-pagination-arrow" 
            onClick={() => setCurrentPage(1)} 
            disabled={currentPage === 1}
          >
            &#171; {/* Double left arrow */}
          </button>
          
          <button 
            className="hr-employee-performance-pagination-arrow" 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
            disabled={currentPage === 1}
          >
            &#8249; {/* Single left arrow */}
          </button>
          
          <div className="hr-employee-performance-pagination-numbers">
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
                  pageNumbers.push(<span key="ellipsis1" className="hr-employee-performance-pagination-ellipsis">...</span>);
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
                  pageNumbers.push(<span key="ellipsis2" className="hr-employee-performance-pagination-ellipsis">...</span>);
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
            className="hr-employee-performance-pagination-arrow" 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
            disabled={currentPage === totalPages}
          >
            &#8250; {/* Single right arrow */}
          </button>
          
          <button 
            className="hr-employee-performance-pagination-arrow" 
            onClick={() => setCurrentPage(totalPages)} 
            disabled={currentPage === totalPages}
          >
            &#187; {/* Double right arrow */}
          </button>
          
          <select
            className="hr-employee-performance-pagination-size"
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

  /******************************************
   * Main Return
   ******************************************/
  return (
    <div className="hr-employee-performance">
      <div className="hr-employee-performance-body-content-container">
        <div className="hr-employee-performance-scrollable">
          {/* Page Heading */}
          <div className="hr-employee-performance-heading">
            <h2><strong>Employee Performance</strong></h2>
            <div className="hr-employee-performance-right-controls">
              {/* Search Field */}
              <div className="hr-employee-performance-search-wrapper">
                <FiSearch className="hr-employee-performance-search-icon" />
                <input
                  type="text"
                  className="hr-employee-performance-search"
                  placeholder="Search..."
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>

              {/* Sort Dropdown */}
              <select
                className="hr-employee-performance-filter"
                value={sortField}
                onChange={(e) => setSortField(e.target.value)}
              >
                <option value="all">No Sorting</option>
                <option value="performance_id">Sort by Performance ID</option> 
                <option value="employee_id">Sort by Employee ID</option>
                <option value="employee_name">Sort by Employee Name</option>
                <option value="review_date">Sort by Review Date</option>
                <option value="rating">Sort by Rating</option>
              </select>

              {/* No Add Button, No Archive Button */}
            </div>
          </div>

          {/* Table Content */}
          <div className="hr-employee-performance-table-container">
            {renderPerformanceTable()}
          </div>
        </div>
      </div>

      {/* Optional Toast Notification */}
      {toast && (
        <div
          className="hr-employee-performance-toast"
          style={{ backgroundColor: toast.success ? "#4CAF50" : "#F44336" }}
        >
          {toast.message}
        </div>
      )}

      {/* Rating Modal */}
      {showRatingModal && selectedPerformance && (
        <div className="hr-employee-performance-modal-overlay">
          <div className="hr-employee-performance-modal">
            <h3 style={{ marginBottom: "1rem" }}>Update Rating</h3>
            <form onSubmit={handleRatingSubmit} className="hr-employee-performance-modal-form">
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
              <div className="hr-employee-performance-modal-buttons">
                <button type="submit" className="hr-employee-performance-submit-btn">Save</button>
                <button
                  type="button"
                  className="hr-employee-performance-cancel-btn"
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
