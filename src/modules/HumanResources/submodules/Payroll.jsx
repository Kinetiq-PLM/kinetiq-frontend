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

  const showToast = (message, success = true) => {
    setToast({ message, success });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchPayroll = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/payroll/payrolls/");
      setPayrollData(res.data);
    } catch (err) {
      console.error("Failed to fetch payroll:", err);
      showToast("Failed to fetch payroll data", false);
    } finally {
      setLoading(false);
    }
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
                </tr>
              </thead>
              <tbody>
                {paginated.map((pay) => (
                  <tr key={pay.payroll_id}>
                    <td>{pay.payroll_id}</td>
                    <td>{pay.employee_id}</td>
                    <td>{pay.pay_period_start}</td>
                    <td>{pay.pay_period_end}</td>
                    <td>{pay.employment_type}</td>
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
                    <td>{pay.total_deductions}</td>
                    <td>{pay.net_pay}</td>
                    <td>
                      {pay.status === "processing" ? (
                        <span>-</span>
                      ) : (
                        <span className={`hr-tag ${pay.status.toLowerCase()}`}>
                          {pay.status}
                        </span>
                      )}
                    </td>
                    <td>{pay.created_at}</td>
                    <td>{pay.updated_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="hr-payroll-pagination">
          <div className="hr-payroll-pagination-numbers">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                className={i + 1 === currentPage ? "active" : ""}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
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
