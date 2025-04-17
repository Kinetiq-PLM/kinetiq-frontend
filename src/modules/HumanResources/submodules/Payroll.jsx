import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiSearch } from "react-icons/fi";
import "../styles/Payroll.css";

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
      const res = await axios.get("http://127.0.0.1:8000/api/payroll/");
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
    if (loading) return <div className="hr-no-results">Loading payroll data...</div>;

    const { paginated, totalPages } = filterAndPaginate(payrollData);
    if (!paginated.length) return <div className="hr-no-results">No payroll records found.</div>;

    return (
      <div className="hr-department-table-wrapper">
        <div className="hr-department-table-scrollable">
          <table className="hr-department-table">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Payroll ID</th>
                <th>Employment Type</th>
                <th>Base Salary</th>
                <th>Work Days</th>
                <th>Pay Type</th>
                <th>Net Salary</th>
                <th>Status</th>
                <th>Payment Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((p, index) => (
                <tr key={p.payrollId || index}>
                  <td>{p.empId}</td>
                  <td>{p.payrollId}</td>
                  <td><span className={`hr-tag ${p.type.toLowerCase()}`}>{p.type}</span></td>
                  <td>{p.baseSalary.toFixed(2)}</td>
                  <td>{p.workDays}</td>
                  <td><span className={`hr-tag ${p.payType.toLowerCase()}`}>{p.payType}</span></td>
                  <td>{p.netSalary.toFixed(2)}</td>
                  <td>
                    <span className={`hr-tag ${p.paymentStatus.toLowerCase()}`}>
                      {p.paymentStatus}
                    </span>
                  </td>
                  <td>{p.paymentDate}</td>
                  <td className="hr-department-actions">
                    <div className="hr-department-dots">⋮</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
    );
  };

  return (
    <div className="hr-department">
      <div className="hr-department-body-content-container">
        <div className="hr-department-scrollable">
          <div className="hr-department-heading">
            <h2><strong>Payroll</strong></h2>
            <div className="hr-department-right-controls">
              <div className="hr-department-search-wrapper">
                <FiSearch className="hr-department-search-icon" />
                <input
                  type="text"
                  className="hr-department-search"
                  placeholder="Search..."
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
              <select
                className="hr-department-filter"
                value={sortField}
                onChange={(e) => setSortField(e.target.value)}
              >
                <option value="all">No Sorting</option>
                <option value="empId">Sort by Employee ID</option>
                <option value="paymentDate">Sort by Payment Date</option>
                <option value="paymentStatus">Sort by Status</option>
              </select>
            </div>
          </div>
          <div className="hr-department-table-container">
            {renderPayrollTable()}
          </div>
        </div>
      </div>
      {toast && (
        <div
          className="hr-department-toast"
          style={{ backgroundColor: toast.success ? "#4CAF50" : "#F44336" }}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default Payroll;
