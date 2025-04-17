import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/LeaveRequests.css";
import { FiSearch } from "react-icons/fi";

const LeaveRequests = () => {
  // States matching Employees pattern
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [archivedLeaveRequests, setArchivedLeaveRequests] = useState([]);
  const [leaveBalances, setLeaveBalances] = useState([]);
  const [archivedLeaveBalances, setArchivedLeaveBalances] = useState([]);

  // UI States
  const [activeTab, setActiveTab] = useState("LeaveRequests");
  const [showArchived, setShowArchived] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sortField, setSortField] = useState("all");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [dotsMenuOpen, setDotsMenuOpen] = useState(null);

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);

  // Toast helper
  const showToast = (message, success = true) => {
    setToast({ message, success });
    setTimeout(() => setToast(null), 3000);
  };

  // Fetch data
  const fetchLeaveRequests = async () => {
    setLoading(true);
    try {
      const [activeRes, archivedRes] = await Promise.all([
        axios.get("http://127.0.0.1:8000/api/leave_requests/"),
        axios.get("http://127.0.0.1:8000/api/leave_requests/archived/")
      ]);
      setLeaveRequests(activeRes.data);
      setArchivedLeaveRequests(archivedRes.data);
    } catch (err) {
      console.error("Fetch error:", err);
      showToast("Failed to fetch leave requests", false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  // Search and filter logic
  const filterAndPaginate = (dataArray) => {
    const filtered = dataArray.filter(item => 
      Object.values(item).some(val => 
        val?.toString().toLowerCase().includes(searchTerm.toLowerCase())
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

  // Render main table
  const renderLeaveRequestsTable = (rawData, isArchived = false) => {
    const { paginated, totalPages } = filterAndPaginate(rawData);

    if (loading) return <div className="hr-no-results">Loading leave requests...</div>;
    if (!paginated.length) return <div className="hr-no-results">No leave requests found.</div>;

    return (
      <div className="hr-department-table-wrapper">
        <div className="hr-department-table-scrollable">
          <table className="hr-department-table">
            <thead>
              <tr>
                {isArchived && <th>Select</th>}
                <th>Leave ID</th>
                <th>Employee ID</th>
                <th>Type</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Total Days</th>
                <th>Status</th>
                <th>Updated At</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((leave, index) => (
                <tr key={leave.leaveId} className={isArchived ? "hr-archived-row" : ""}>
                  <td>{leave.leaveId}</td>
                  <td>{leave.empId}</td>
                  <td>
                    <span className={`hr-tag ${leave.type.toLowerCase()}`}>
                      {leave.type}
                    </span>
                  </td>
                  <td>{leave.start}</td>
                  <td>{leave.end}</td>
                  <td>{leave.totalDays}</td>
                  <td>
                    <span className={`hr-tag ${leave.status.toLowerCase().replace(/\s/g, "-")}`}>
                      {leave.status}
                    </span>
                  </td>
                  <td>{leave.updatedAt}</td>
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
                            onClick={() => handleEdit(leave)}
                          >
                            Edit
                          </div>
                          {!isArchived ? (
                            <div 
                              className="hr-department-dropdown-item"
                              onClick={() => handleArchive(leave.leaveId)}
                            >
                              Archive
                            </div>
                          ) : (
                            <div
                              className="hr-department-dropdown-item"
                              onClick={() => handleUnarchive(leave.leaveId)}
                            >
                              Unarchive
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
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

  // Render Leave Balances table
  const renderLeaveBalancesTable = (rawData, isArchived = false) => {
    const { paginated, totalPages } = filterAndPaginate(rawData);

    if (loading) return <div className="hr-no-results">Loading leave balances...</div>;
    if (!paginated.length) return <div className="hr-no-results">No leave balances found.</div>;

    return (
      <div className="hr-department-table-wrapper">
        <div className="hr-department-table-scrollable">
          <table className="hr-department-table">
            <thead>
              <tr>
                {isArchived && <th>Select</th>}
                <th>Employee ID</th>
                <th>Leave Type</th>
                <th>Balance</th>
                <th>Updated At</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((balance, index) => (
                <tr key={index} className={isArchived ? "hr-archived-row" : ""}>
                  <td>{balance.empId}</td>
                  <td>{balance.type}</td>
                  <td>{balance.balance}</td>
                  <td>{balance.updatedAt}</td>
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
                            onClick={() => handleEdit(balance)}
                          >
                            Edit
                          </div>
                          {!isArchived ? (
                            <div
                              className="hr-department-dropdown-item"
                              onClick={() => handleArchive(balance.empId)}
                            >
                              Archive
                            </div>
                          ) : (
                            <div
                              className="hr-department-dropdown-item"
                              onClick={() => handleUnarchive(balance.empId)}
                            >
                              Unarchive
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
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

  return (
    <div className="hr-employee">
      <div className="hr-employee-body-content-container">
        <div className="hr-employee-scrollable">
          <div className="hr-department-heading">
            <h2><strong>Leave Requests</strong></h2>
            <div className="hr-department-right-controls">
              <div className="hr-department-search-wrapper">
                <FiSearch className="hr-department-search-icon" />
                <input
                  type="text"
                  className="hr-department-search"
                  placeholder="Search..."
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="hr-department-filter"
                value={sortField}
                onChange={(e) => setSortField(e.target.value)}
              >
                <option value="all">No Sorting</option>
                <option value="leaveId">Sort by Leave ID</option>
                <option value="empId">Sort by Employee ID</option>
                <option value="type">Sort by Leave Type</option>
              </select>
              <button className="hr-department-add-btn" onClick={() => setShowAddModal(true)}>
                + Add Leave Request
              </button>
              <button className="hr-department-add-btn" onClick={() => setShowArchived(!showArchived)}>
                {showArchived ? "View Active" : "View Archived"}
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="hr-employee-header">
            <div className="hr-employee-tabs">
              <button
                className={activeTab === "LeaveRequests" ? "active" : ""}
                onClick={() => {
                  setActiveTab("LeaveRequests");
                  setShowArchived(false);
                  setCurrentPage(1);
                }}
              >
                Leave Requests <span className="hr-employee-count">{leaveRequests.length}</span>
              </button>
              <button
                className={activeTab === "LeaveBalances" ? "active" : ""}
                onClick={() => {
                  setActiveTab("LeaveBalances");
                  setShowArchived(false);
                  setCurrentPage(1);
                }}
              >
                Leave Balances <span className="hr-employee-count">{leaveBalances.length}</span>
              </button>
            </div>
          </div>

          {/* Render table based on active tab */}
          {activeTab === "LeaveRequests" ? (
            showArchived
              ? renderLeaveRequestsTable(archivedLeaveRequests, true)
              : renderLeaveRequestsTable(leaveRequests, false)
          ) : (
            showArchived
              ? renderLeaveBalancesTable(archivedLeaveBalances, true)
              : renderLeaveBalancesTable(leaveBalances, false)
          )}
        </div>
      </div>

      {/* Modal for Add/Edit */}
      {(showAddModal || showEditModal) && (
        <div className="hr-department-modal-overlay">
          <div className="hr-department-modal">
            <h3>{showAddModal ? "Add Leave Request" : "Edit Leave Request"}</h3>
            <form className="hr-department-modal-form hr-two-col">
              {/* Form fields */}
              <div className="hr-department-modal-buttons">
                <button type="submit" className="submit-btn">
                  {showAddModal ? "Add" : "Save"}
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => (showAddModal ? setShowAddModal(false) : setShowEditModal(false))}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast */}
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

export default LeaveRequests;