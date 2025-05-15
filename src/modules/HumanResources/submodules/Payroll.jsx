import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Payroll.css";
import { FiSearch } from "react-icons/fi";

const Payroll = () => {
  const [payrollData, setPayrollData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [toast, setToast] = useState(null);
  // Add new state variables for edit functionality
  const [dotsMenuOpen, setDotsMenuOpen] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPayroll, setEditingPayroll] = useState(null);

  const showToast = (message, success = true) => {
    setToast({ message, success });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchPayroll = async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://x0crs910m2.execute-api.ap-southeast-1.amazonaws.com/dev/api/payroll/payrolls/");
      setPayrollData(res.data);
    } catch (err) {
      console.error("Failed to fetch payroll:", err);
      showToast("Failed to fetch payroll data", false);
    } finally {
      setLoading(false);
    }
  };
  // Add a function to handle opening edit modal
  const handleEditPayroll = (payroll) => {
    setEditingPayroll({
      ...payroll,
      pay_period_start: payroll.pay_period_start,
      pay_period_end: payroll.pay_period_end
    });
    setShowEditModal(true);
    setDotsMenuOpen(null);
  };
   // Add function to handle payroll edit form submission
   const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(
        `https://x0crs910m2.execute-api.ap-southeast-1.amazonaws.com/dev/api/payroll/payrolls/${editingPayroll.payroll_id}/`,
        {
          pay_period_start: editingPayroll.pay_period_start,
          pay_period_end: editingPayroll.pay_period_end
        }
      );
      setShowEditModal(false);
      showToast("Payroll updated successfully");
      fetchPayroll(); // Refresh data
    } catch (err) {
      console.error("Update payroll error:", err);
      showToast("Failed to update payroll", false);
    }
  };

  // Add function to handle edit form field changes
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingPayroll(prev => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {
    fetchPayroll();
  }, []);

  const handleSearch = (value) => {
    setSearchTerm(value.toLowerCase());
    setCurrentPage(1);
  };

  const filterAndPaginate = (dataArray) => {
    const filtered = dataArray.filter((item) =>
      Object.values(item).some((val) => 
        val?.toString().toLowerCase().includes(searchTerm)
      )
    );

    if (sortField !== "all") {
      filtered.sort((a, b) => {
        const valA = a[sortField]?.toString().toLowerCase() || "";
        const valB = b[sortField]?.toString().toLowerCase() || "";
        return valA.localeCompare(valB);
      });
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginated = filtered.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(filtered.length / itemsPerPage);

    return { paginated, totalPages };
  };

  const getPaymentTag = (amount) => {
    const value = typeof amount === 'string' ? parseFloat(amount) : amount;
    let category = 'low';
    if (value >= 30000) {
      category = 'high';
    } else if (value >= 15000) {
      category = 'medium';
    }
    return (
      <span className={`hr-tag payment-${category}`}>
        {amount}
      </span>
    );
  };

  const getDeductionTag = (amount) => {
    const value = typeof amount === 'string' ? parseFloat(amount) : amount;
    let category = 'low';
    if (value >= 5000) {
      category = 'high';
    } else if (value >= 2000) {
      category = 'medium';
    }
    return (
      <span className={`hr-tag deduction-${category}`}>
        {amount}
      </span>
    );
  };

  const renderPayrollTable = () => {
    if (loading) return <div className="hr-payroll-no-results">Loading payroll data...</div>;

    const { paginated, totalPages } = filterAndPaginate(payrollData);
    if (!paginated.length) return <div className="hr-payroll-no-results">No payroll records found.</div>;

    return (
      <>
        <div className="hr-payroll-table-wrapper">
          <div className="hr-payroll-table-scrollable">
            <table className="hr-payroll-table">
              <thead>
                <tr>
                  <th>Payroll ID</th>
                  <th>Employee ID</th>
                  <th>Pay Period Start</th>
                  <th>Pay Period End</th>
                  <th>Employment Type</th>
                  <th>Base Salary</th>
                  <th>Overtime Hours</th>
                  <th>Overtime Pay</th>
                  <th>Holiday Pay</th>
                  <th>Bonus Pay</th>
                  <th>13th Month Pay</th>
                  <th>Gross Pay</th>
                  <th>SSS</th>
                  <th>PhilHealth</th>
                  <th>Pag-IBIG</th>
                  <th>Tax</th>
                  <th>Late Deduction</th>
                  <th>Absent Deduction</th>
                  <th>Undertime Deduction</th>
                  <th>Total Deductions</th>
                  <th>Net Pay</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th>Updated At</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((pay, index) => (
                  <tr key={pay.payroll_id}>
                    <td>{pay.payroll_id}</td>
                    <td>{pay.employee_id}</td>
                    <td>{pay.pay_period_start}</td>
                    <td>{pay.pay_period_end}</td>
                    <td>
                      <span className={`hr-tag employment-${pay.employment_type?.toLowerCase() || 'unknown'}`}>
                        {pay.employment_type || 'Unknown'}
                      </span>
                    </td>
                    <td>{pay.base_salary}</td>
                    <td>{pay.overtime_hours}</td>
                    <td>{pay.overtime_pay}</td>
                    <td>{pay.holiday_pay}</td>
                    <td>{pay.bonus_pay}</td>
                    <td>{pay.thirteenth_month_pay}</td>
                    <td>{pay.gross_pay}</td>
                    <td>{pay.sss_contribution}</td>
                    <td>{pay.philhealth_contribution}</td>
                    <td>{pay.pagibig_contribution}</td>
                    <td>{pay.tax}</td>
                    <td>{pay.late_deduction}</td>
                    <td>{pay.absent_deduction}</td>
                    <td>{pay.undertime_deduction}</td>
                    <td>
                      {getDeductionTag(pay.total_deductions)}
                    </td>
                    <td>
                      {getPaymentTag(pay.net_pay)}
                    </td>
                    <td>
                      <span className={`hr-tag ${pay.status.toLowerCase()}`}>
                        {pay.status}
                      </span>
                    </td>
                    <td>{pay.created_at}</td>
                    <td>{pay.updated_at}</td>
                    <td className="hr-payroll-actions">
                      <div
                        className="hr-payroll-dots"
                        onClick={() => setDotsMenuOpen(dotsMenuOpen === index ? null : index)}
                      >
                        ⋮
                        {dotsMenuOpen === index && (
                          <div className="hr-payroll-dropdown">
                            <div
                              className="hr-payroll-dropdown-item"
                              onClick={() => handleEditPayroll(pay)}
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
        <div className="hr-payroll-pagination">
          <button 
            className="hr-payroll-pagination-arrow" 
            onClick={() => setCurrentPage(1)} 
            disabled={currentPage === 1}
          >
            &#171;
          </button>
          <button 
            className="hr-payroll-pagination-arrow" 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
            disabled={currentPage === 1}
          >
            &#8249;
          </button>
          <div className="hr-payroll-pagination-numbers">
            {(() => {
              const pageNumbers = [];
              const maxVisiblePages = 5;
              if (totalPages <= maxVisiblePages + 2) {
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
                pageNumbers.push(
                  <button
                    key={1}
                    className={1 === currentPage ? "active" : ""}
                    onClick={() => setCurrentPage(1)}
                  >
                    1
                  </button>
                );
                let startPage = Math.max(2, currentPage - Math.floor(maxVisiblePages / 2));
                let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);
                if (endPage - startPage < maxVisiblePages - 1) {
                  startPage = Math.max(2, endPage - maxVisiblePages + 1);
                }
                if (startPage > 2) {
                  pageNumbers.push(<span key="ellipsis1" className="hr-payroll-pagination-ellipsis">...</span>);
                }
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
                if (endPage < totalPages - 1) {
                  pageNumbers.push(<span key="ellipsis2" className="hr-payroll-pagination-ellipsis">...</span>);
                }
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
            className="hr-payroll-pagination-arrow" 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
            disabled={currentPage === totalPages}
          >
            &#8250;
          </button>
          <button 
            className="hr-payroll-pagination-arrow" 
            onClick={() => setCurrentPage(totalPages)} 
            disabled={currentPage === totalPages}
          >
            &#187;
          </button>
          <select
            className="hr-payroll-pagination-size"
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
    <div className="hr-payroll">
      <div className="hr-payroll-body-content-container">
        <div className="hr-payroll-scrollable">
          <div className="hr-payroll-heading">
            <h2><strong>Payroll</strong></h2>
            <div className="hr-payroll-right-controls">
              <div className="hr-payroll-search-wrapper">
                <FiSearch className="hr-payroll-search-icon" />
                <input
                  type="text"
                  className="hr-payroll-search"
                  placeholder="Search..."
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
              <select
                className="hr-payroll-filter"
                value={sortField}
                onChange={(e) => setSortField(e.target.value)}
              >
                <option value="all">No Sorting</option>
                <option value="payroll_id">Sort by Payroll ID</option>
                <option value="employee_id">Sort by Employee ID</option>
                <option value="pay_period_start">Sort by Pay Period</option>
                <option value="status">Sort by Status</option>
              </select>
            </div>
          </div>
          <div className="hr-payroll-table-container">
            {renderPayrollTable()}
          </div>
        </div>
      </div>
      {/* Add Edit Modal */}
      {showEditModal && editingPayroll && (
        <div className="hr-payroll-modal-overlay">
          <div className="hr-payroll-modal">
            <h3>Edit Payroll</h3>
            <form onSubmit={handleEditSubmit} className="hr-payroll-modal-form">
              <div className="form-group">
                <label>Payroll ID</label>
                <input
                  type="text"
                  value={editingPayroll.payroll_id || ""}
                  disabled
                />
              </div>
              <div className="form-group">
                <label>Employee ID</label>
                <input
                  type="text"
                  value={editingPayroll.employee_id || ""}
                  disabled
                />
              </div>
              <div className="form-group">
                <label>Pay Period Start</label>
                <input
                  type="date"
                  name="pay_period_start"
                  value={editingPayroll.pay_period_start || ""}
                  onChange={handleEditChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Pay Period End</label>
                <input
                  type="date"
                  name="pay_period_end"
                  value={editingPayroll.pay_period_end || ""}
                  onChange={handleEditChange}
                  required
                />
              </div>

              <div className="hr-payroll-modal-buttons">
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
      {toast && (
        <div
          className="hr-payroll-toast"
          style={{ backgroundColor: toast.success ? "#4CAF50" : "#F44336" }}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default Payroll;
