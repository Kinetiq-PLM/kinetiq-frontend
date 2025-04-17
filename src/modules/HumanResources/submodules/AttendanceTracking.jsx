/*******************************************************
 *        ATTENDANCETRACKING.JSX
 * (FIRST HALF) - Imports, State, Fetch, Logic
 *******************************************************/
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/AttendanceTracking.css";
import { FiSearch } from "react-icons/fi";

const AttendanceTracking = () => {
  /******************************************
   * State & Hooks
   ******************************************/
  const [attendanceData, setAttendanceData] = useState([]);
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

  /******************************************
   * 1) Fetch Attendance
   ******************************************/
  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/attendance_tracking/");
      setAttendanceData(res.data);
    } catch (err) {
      console.error("Failed to fetch attendance:", err);
      showToast("Failed to fetch attendance data", false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
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
/*******************************************************
 *        ATTENDANCETRACKING.JSX
 * (SECOND HALF) - Render & Export
 *******************************************************/

  /******************************************
   * Render Table
   ******************************************/
  const renderAttendanceTable = () => {
    if (loading) {
      return <div className="hr-no-results">Loading attendance...</div>;
    }

    const { paginated, totalPages } = filterAndPaginate(attendanceData);
    if (!paginated.length) {
      return <div className="hr-no-results">No attendance records found.</div>;
    }

    return (
      <div className="hr-department-no-scroll-wrapper">
        <div className="hr-department-table-scrollable">
          <table className="hr-department-table hr-department-no-scroll-table">
            <thead>
              <tr>
                <th>Attendance ID</th>
                <th>Employee ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Date</th>
                <th>Time In</th>
                <th>Time Out</th>
                <th>Status</th>
                <th>Late Hours</th>
                <th>Undertime Hours</th>
                <th>Is Holiday</th>
                <th>Work Hours</th>
                <th>Created At</th>
                <th>Updated At</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((att, index) => (
                <tr key={att.attendance_id || index}>
                  <td>{att.attendance_id}</td>
                  <td>{att.employee_id}</td>
                  <td>{att.first_name}</td>
                  <td>{att.last_name}</td>
                  <td>{att.date}</td>
                  <td>{att.time_in}</td>
                  <td>{att.time_out}</td>
                  <td>{att.status}</td>
                  <td>{att.late_hours}</td>
                  <td>{att.undertime_hours}</td>
                  <td>{att.is_holiday ? "Yes" : "No"}</td>
                  <td>{att.work_hours}</td>
                  <td>{att.created_at}</td>
                  <td>{att.updated_at}</td>
                </tr>
              ))}
            </tbody>
          </table>

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
          <div className="hr-department-heading">
            <h2><strong>Attendance Tracking</strong></h2>
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
                <option value="employee_id">Sort by Employee ID</option>
                <option value="date">Sort by Date</option>
                <option value="first_name">Sort by First Name</option>
              </select>
            </div>
          </div>
          <div className="hr-department-table-container">
            {renderAttendanceTable()}
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

export default AttendanceTracking;
