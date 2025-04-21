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
  const [calendarDatesData, setCalendarDatesData] = useState([]);
  const [loading, setLoading] = useState(true);

  // UI States
  const [activeTab, setActiveTab] = useState("Attendance");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [toast, setToast] = useState(null);

  const showToast = (message, success = true) => {
    setToast({ message, success });
    setTimeout(() => setToast(null), 3000);
  };

  /******************************************
   * 1) Fetch Data
   ******************************************/
  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://x0crs910m2.execute-api.ap-southeast-1.amazonaws.com/dev/api/attendance_tracking/attendance_tracking/");
      setAttendanceData(res.data);
    } catch (err) {
      console.error("Failed to fetch attendance:", err);
      showToast("Failed to fetch attendance data", false);
    } finally {
      setLoading(false);
    }
  };

  const fetchCalendarDates = async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://x0crs910m2.execute-api.ap-southeast-1.amazonaws.com/dev/api/calendar_dates/calendar_dates/");
      setCalendarDatesData(res.data);
    } catch (err) {
      console.error("Failed to fetch calendar dates:", err);
      showToast("Failed to fetch calendar dates", false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "Attendance") {
      fetchAttendance();
    } else {
      fetchCalendarDates();
    }
  }, [activeTab]);

  useEffect(() => {
    // Check if there's a selected date in sessionStorage
    const selectedDate = sessionStorage.getItem('selectedDate');
    if (selectedDate) {
      // Use the date to filter the table or navigate to that date
      setSearchTerm(selectedDate);
      // Clear it after use
      sessionStorage.removeItem('selectedDate');
    }
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
      Object.values(item).some((val) => 
        val?.toString().toLowerCase().includes(searchTerm)
      )
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
   * Render Tables
   ******************************************/
  const renderAttendanceTable = () => {
    if (loading) {
      return <div className="hr-attendance-no-results">Loading attendance...</div>;
    }

    const { paginated, totalPages } = filterAndPaginate(attendanceData);
    if (!paginated.length) {
      return <div className="hr-attendance-no-results">No attendance records found.</div>;
    }

    return (
      <>
        <div className="hr-attendance-no-scroll-wrapper">
          <div className="hr-attendance-table-scrollable">
            <table className="hr-attendance-table hr-attendance-no-scroll-table">
              <thead>
                <tr>
                  <th>Attendance ID</th>
                  <th>Employee ID</th>
                  <th>Employee Name</th>
                  <th>Date</th>
                  <th>Time In</th>
                  <th>Time Out</th>
                  <th>Status</th>
                  <th>Late Hours</th>
                  <th>Undertime Hours</th>
                  <th>Is Holiday</th>
                  <th>Created At</th>
                  <th>Updated At</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((att, index) => (
                  <tr key={att.attendance_id || index}>
                    <td>{att.attendance_id}</td>
                    <td>{att.employee_id}</td>
                    <td>{att.employee_name}</td>
                    <td>{att.date}</td>
                    <td>{att.time_in}</td>
                    <td>{att.time_out}</td>
                    <td>
                      <span className={`hr-attendance-tag ${att.status.toLowerCase()}`}>
                        {att.status}
                      </span>
                    </td>
                    <td>{att.late_hours}</td>
                    <td>{att.undertime_hours}</td>
                    <td>
                      <span className={`hr-attendance-tag holiday-${att.is_holiday ? "yes" : "no"}`}>
                        {att.is_holiday ? "Yes" : "No"}
                      </span>
                    </td>
                    <td>{att.created_at}</td>
                    <td>{att.updated_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {renderPagination(totalPages)}
      </>
    );
  };

  const renderCalendarDatesTable = () => {
    if (loading) {
      return <div className="hr-attendance-no-results">Loading calendar dates...</div>;
    }

    const { paginated, totalPages } = filterAndPaginate(calendarDatesData);
    if (!paginated.length) {
      return <div className="hr-attendance-no-results">No calendar dates found.</div>;
    }

    return (
      <>
        <div className="hr-attendance-no-scroll-wrapper">
          <div className="hr-attendance-table-scrollable">
            <table className="hr-attendance-table hr-attendance-no-scroll-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Is Workday</th>
                  <th>Is Holiday</th>
                  <th>Is Special</th>
                  <th>Holiday Name</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((date, index) => (
                  <tr key={date.date || index}>
                    <td>{date.date}</td>
                    <td>
                      <span className={`hr-attendance-tag workday-${date.is_workday ? "yes" : "no"}`}>
                        {date.is_workday ? "Yes" : "No"}
                      </span>
                    </td>
                    <td>
                      <span className={`hr-attendance-tag holiday-${date.is_holiday ? "yes" : "no"}`}>
                        {date.is_holiday ? "Yes" : "No"}
                      </span>
                    </td>
                    <td>
                      <span className={`hr-attendance-tag special-${date.is_special ? "yes" : "no"}`}>
                        {date.is_special ? "Yes" : "No"}
                      </span>
                    </td>
                    <td>{date.holiday_name || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {renderPagination(totalPages)}
      </>
    );
  };

  // Shared pagination component for both tables
  const renderPagination = (totalPages) => (
    <div className="hr-attendance-pagination">
      <button 
        className="hr-attendance-pagination-arrow" 
        onClick={() => setCurrentPage(1)} 
        disabled={currentPage === 1}
      >
        &#171; {/* Double left arrow */}
      </button>
      
      <button 
        className="hr-attendance-pagination-arrow" 
        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
        disabled={currentPage === 1}
      >
        &#8249; {/* Single left arrow */}
      </button>
      
      <div className="hr-attendance-pagination-numbers">
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
              pageNumbers.push(<span key="ellipsis1" className="hr-attendance-pagination-ellipsis">...</span>);
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
              pageNumbers.push(<span key="ellipsis2" className="hr-attendance-pagination-ellipsis">...</span>);
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
        className="hr-attendance-pagination-arrow" 
        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
        disabled={currentPage === totalPages}
      >
        &#8250; {/* Single right arrow */}
      </button>
      
      <button 
        className="hr-attendance-pagination-arrow" 
        onClick={() => setCurrentPage(totalPages)} 
        disabled={currentPage === totalPages}
      >
        &#187; {/* Double right arrow */}
      </button>
      
      <select
        className="hr-attendance-pagination-size"
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
  );

  /******************************************
   * Main Return
   ******************************************/
  return (
    <div className="hr-attendance">
      <div className="hr-attendance-body-content-container">
        <div className="hr-attendance-scrollable">
          <div className="hr-attendance-heading">
            <h2><strong>Attendance Tracking</strong></h2>
            <div className="hr-attendance-right-controls">
              <div className="hr-attendance-search-wrapper">
                <FiSearch className="hr-attendance-search-icon" />
                <input
                  type="text"
                  className="hr-attendance-search"
                  placeholder="Search..."
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
              <select
                className="hr-attendance-filter"
                value={sortField}
                onChange={(e) => setSortField(e.target.value)}
              >
                <option value="all">No Sorting</option>
                {activeTab === "Attendance" ? (
                  <>
                    <option value="attendance_id">Sort by Attendance ID</option>
                    <option value="employee_id">Sort by Employee ID</option>
                    <option value="employee_name">Sort by Employee Name</option>
                    <option value="date">Sort by Date</option>
                    <option value="status">Sort by Status</option>
                  </>
                ) : (
                  <>
                    <option value="date">Sort by Date</option>
                    <option value="is_holiday">Sort by Holiday Status</option>
                    <option value="is_workday">Sort by Workday Status</option>
                    <option value="holiday_name">Sort by Holiday Name</option>
                  </>
                )}
              </select>
            </div>
          </div>
          
          {/* Tab Navigation */}
          <div className="hr-attendance-header">
            <div className="hr-attendance-tabs">
              <button
                className={activeTab === "Attendance" ? "active" : ""}
                onClick={() => {
                  setActiveTab("Attendance");
                  setCurrentPage(1);
                  setSortField("all");
                }}
              >
                Attendance <span className="hr-attendance-count">{attendanceData.length}</span>
              </button>
              <button
                className={activeTab === "CalendarDates" ? "active" : ""}
                onClick={() => {
                  setActiveTab("CalendarDates");
                  setCurrentPage(1);
                  setSortField("all");
                }}
              >
                Calendar Dates <span className="hr-attendance-count">{calendarDatesData.length}</span>
              </button>
            </div>
          </div>
          
          <div className="hr-attendance-table-container">
            {activeTab === "Attendance" ? renderAttendanceTable() : renderCalendarDatesTable()}
          </div>
        </div>
      </div>
      
      {toast && (
        <div
          className="hr-attendance-toast"
          style={{ backgroundColor: toast.success ? "#4CAF50" : "#F44336" }}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default AttendanceTracking;
