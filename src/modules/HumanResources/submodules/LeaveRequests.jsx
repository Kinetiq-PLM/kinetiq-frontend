import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiSearch } from "react-icons/fi";
import "../styles/LeaveRequests.css";

const LeaveRequests = () => {
  // Data states
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [archivedLeaveRequests, setArchivedLeaveRequests] = useState([]);
  const [leaveBalances, setLeaveBalances] = useState([]);
  const [employees, setEmployees] = useState([]);

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
  const [showAddBalanceModal, setShowAddBalanceModal] = useState(false);
  const [showEditBalanceModal, setShowEditBalanceModal] = useState(false);
  const [editingBalance, setEditingBalance] = useState(null);

  // New Leave Request State
  const [newLeaveRequest, setNewLeaveRequest] = useState({
    employee_id: "",
    leave_type: "",
    start_date: "",
    end_date: "",
    is_paid: false
  });

  const handleLeaveRequestChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewLeaveRequest(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleAddLeaveRequest = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:8000/api/employee_leave_requests/leave_requests/", newLeaveRequest);
      setShowAddModal(false);
      showToast("Leave request added successfully");
      fetchData(); // Refresh data
    } catch (err) {
      console.error("Add leave request error:", err);
      showToast(err.response?.data?.detail || "Failed to add leave request", false);
    }
  };

  // Toast helper
  const showToast = (message, success = true) => {
    setToast({ message, success });
    setTimeout(() => setToast(null), 3000);
  };

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [requestsRes, archivedRes, balancesRes] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/employee_leave_requests/leave_requests/"),
          axios.get("http://127.0.0.1:8000/api/employee_leave_requests/leave_requests/archived/"),
          axios.get("http://127.0.0.1:8000/api/employee_leave_balances/employee_leave_balances/")
        ]);

        setLeaveRequests(requestsRes.data);
        setArchivedLeaveRequests(archivedRes.data);
        setLeaveBalances(balancesRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        showToast("Failed to fetch data", false);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/employees/employees/");
      setEmployees(res.data);
    } catch (err) {
      console.error("Failed to fetch employees:", err);
      showToast("Failed to fetch employees data", false);
    }
  };

  useEffect(() => {
    fetchEmployees();
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

  // Helper function for total days class
  const getTotalDaysClass = (days) => {
    if (days <= 3) return "short-leave";
    if (days <= 7) return "medium-leave";
    return "long-leave";
  };

  const getLeaveRemainingClass = (days) => {
    if (days <= 3) return "low-leave";
    if (days <= 10) return "medium-leave";
    return "high-leave";
  };

  const getUnpaidLeaveClass = (days) => {
    if (days <= 3) return "low-unpaid";
    if (days <= 7) return "medium-unpaid";
    return "high-unpaid";
  };

  // Render Leave Requests table
  const renderLeaveRequestsTable = (data, isArchived = false) => {
    const { paginated, totalPages } = filterAndPaginate(data);
    
    if (loading) return <div className="hr-leave-requests-no-results">Loading leave requests...</div>;
    if (!paginated.length) return <div className="hr-leave-requests-no-results">No leave requests found.</div>;

    return (
      <>
        <div className="hr-leave-requests-table-wrapper">
          <div className="hr-leave-requests-table-scrollable">
            <table className="hr-leave-requests-table">
              <thead>
                <tr>
                  {isArchived && <th>Select</th>}
                  <th>Leave ID</th>
                  <th>Employee ID</th>
                  <th>Employee Name</th>
                  <th>Immediate Superior ID</th>
                  <th>Immediate Superior Name</th>
                  <th>Management Approval ID</th>
                  <th>Management Approval Name</th>
                  <th>Leave Type</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Total Days</th>
                  <th>Is Paid</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th>Updated At</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((request, index) => (
                  <tr key={request.leave_id} className={isArchived ? "hr-leave-requests-archived-row" : ""}>
                    {isArchived && (
                      <td>
                        <input type="checkbox" />
                      </td>
                    )}
                    <td>{request.leave_id}</td>
                    <td>{request.employee_id}</td>
                    <td>{request.employee_name}</td>
                    <td>{request.immediate_superior_id}</td>
                    <td>{request.immediate_superior_name}</td>
                    <td>{request.management_approval_id}</td>
                    <td>{request.management_approval_name}</td>
                    <td>
                      <span className={`hr-tag ${request.leave_type.toLowerCase()}`}>
                        {request.leave_type}
                      </span>
                    </td>
                    <td>{request.start_date}</td>
                    <td>{request.end_date}</td>
                    <td>
                      <span className={`hr-tag ${getTotalDaysClass(request.total_days)}`}>
                        {request.total_days}
                      </span>
                    </td>
                    <td>
                      <span className={`hr-tag ${request.is_paid ? 'yes' : 'no'}`}>
                        {request.is_paid ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td>
                      <span className={`hr-tag ${request.status.toLowerCase().replace(/\s/g, '-')}`}>
                        {request.status}
                      </span>
                    </td>
                    <td>{request.created_at}</td>
                    <td>{request.updated_at}</td>
                    <td className="leave-requests-actions">
                      <div className="leave-requests-dots" onClick={() => setDotsMenuOpen(dotsMenuOpen === request.leave_id ? null : request.leave_id)}>
                        &#8942;
                      </div>
                      {dotsMenuOpen === request.leave_id && (
                        <div className="leave-requests-dropdown">
                          <div 
                            className="leave-requests-dropdown-item"
                            onClick={() => {
                              setEditingRequest(request);
                              setShowEditModal(true);
                              setDotsMenuOpen(null);
                            }}
                          >
                            Edit
                          </div>
                        </div>
                      )}
                    </td>
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

  // Render Leave Balances table
  const renderLeaveBalancesTable = (data) => {
    const { paginated, totalPages } = filterAndPaginate(data);
    
    if (loading) return <div className="hr-leave-requests-no-results">Loading leave balances...</div>;
    if (!paginated.length) return <div className="hr-leave-requests-no-results">No leave balances found.</div>;

    return (
      <>
        <div className="hr-leave-requests-table-wrapper">
          <div className="hr-leave-requests-table-scrollable">
            <table className="hr-leave-requests-table">
              <thead>
                <tr>
                  <th>Balance ID</th>
                  <th>Employee ID</th>
                  <th>Employee Name</th>
                  <th>Year</th>
                  <th>Sick Leave Remaining</th>
                  <th>Vacation Leave Remaining</th>
                  <th>Maternity Leave Remaining</th>
                  <th>Paternity Leave Remaining</th>
                  <th>Solo Parent Leave Remaining</th>
                  <th>Unpaid Leave Taken</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((balance, index) => (
                  <tr key={balance.balance_id}>
                    <td>{balance.balance_id}</td>
                    <td>{balance.employee_id}</td>
                    <td>{balance.employee_name}</td>
                    <td>{balance.year}</td>
                    <td>
                      <span className={`hr-tag ${getLeaveRemainingClass(balance.sick_leave_remaining)}`}>
                        {balance.sick_leave_remaining}
                      </span>
                    </td>
                    <td>
                      <span className={`hr-tag ${getLeaveRemainingClass(balance.vacation_leave_remaining)}`}>
                        {balance.vacation_leave_remaining}
                      </span>
                    </td>
                    <td>
                      <span className={`hr-tag ${getLeaveRemainingClass(balance.maternity_leave_remaining)}`}>
                        {balance.maternity_leave_remaining}
                      </span>
                    </td>
                    <td>
                      <span className={`hr-tag ${getLeaveRemainingClass(balance.paternity_leave_remaining)}`}>
                        {balance.paternity_leave_remaining}
                      </span>
                    </td>
                    <td>
                      <span className={`hr-tag ${getLeaveRemainingClass(balance.solo_parent_leave_remaining)}`}>
                        {balance.solo_parent_leave_remaining}
                      </span>
                    </td>
                    <td>
                      <span className={`hr-tag ${getUnpaidLeaveClass(balance.unpaid_leave_taken)}`}>
                        {balance.unpaid_leave_taken}
                      </span>
                    </td>
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

  // Render pagination controls
  const renderPagination = (totalPages) => (
    <div className="hr-leave-requests-pagination">
      <div className="hr-leave-requests-pagination-numbers">
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
        className="hr-leave-requests-pagination-size"
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

  return (
    <div className="hr-leave-requests">
      <div className="hr-leave-requests-body-content-container">
        <div className="hr-leave-requests-scrollable">
          <div className="hr-leave-requests-heading">
            <h2><strong>Leave Requests</strong></h2>
            <div className="hr-leave-requests-right-controls">
              <div className="hr-leave-requests-search-wrapper">
                <FiSearch className="hr-leave-requests-search-icon" />
                <input
                  type="text"
                  className="hr-leave-requests-search"
                  placeholder="Search..."
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <select
                className="hr-leave-requests-filter"
                value={sortField}
                onChange={(e) => setSortField(e.target.value)}
              >
                <option value="all">No Sorting</option>
                {activeTab === "LeaveRequests" ? (
                  <>
                    <option value="leave_id">Sort by Leave ID</option>
                    <option value="employee_name">Sort by Employee</option>
                    <option value="leave_type">Sort by Leave Type</option>
                    <option value="start_date">Sort by Start Date</option>
                    <option value="status">Sort by Status</option>
                    <option value="created_at">Sort by Created Date</option>
                  </>
                ) : (
                  <>
                    <option value="balance_id">Sort by Balance ID</option>
                    <option value="employee_name">Sort by Employee</option>
                    <option value="year">Sort by Year</option>
                    <option value="sick_leave_remaining">Sort by Sick Leave</option>
                    <option value="vacation_leave_remaining">Sort by Vacation Leave</option>
                  </>
                )}
              </select>
              
              {activeTab === "LeaveRequests" && (
                <>
                  <button 
                    className="hr-leave-requests-add-btn"
                    onClick={() => setShowAddModal(true)}
                  >
                    + Add Leave Request
                  </button>
                  <button
                    className="hr-leave-requests-add-btn"
                    onClick={() => setShowArchived(!showArchived)}
                  >
                    {showArchived ? "View Active" : "View Archived"}
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="hr-leave-requests-header">
            <div className="hr-leave-requests-tabs">
              <button
                className={activeTab === "LeaveRequests" ? "active" : ""}
                onClick={() => {
                  setActiveTab("LeaveRequests");
                  setShowArchived(false);
                  setCurrentPage(1);
                }}
              >
                Leave Requests
                <span className="hr-leave-requests-count">
                  {showArchived ? archivedLeaveRequests.length : leaveRequests.length}
                </span>
              </button>
              <button
                className={activeTab === "LeaveBalances" ? "active" : ""}
                onClick={() => {
                  setActiveTab("LeaveBalances");
                  setShowArchived(false);
                  setCurrentPage(1);
                }}
              >
                Leave Balances
                <span className="hr-leave-requests-count">{leaveBalances.length}</span>
              </button>
            </div>
          </div>

          <div className="hr-leave-requests-table-container">
            {activeTab === "LeaveRequests" 
              ? renderLeaveRequestsTable(showArchived ? archivedLeaveRequests : leaveRequests, showArchived)
              : renderLeaveBalancesTable(leaveBalances)
            }
          </div>
        </div>
      </div>

      {/* Leave Request Modals */}
      {showAddModal && (
        <div className="leave-requests-modal-overlay">
          <div className="leave-requests-modal">
            <h3>Add Leave Request</h3>
            <form onSubmit={handleAddLeaveRequest} className="leave-requests-modal-form">
              <div className="leave-requests-form-two-columns">
                <div className="form-column">
                  <div className="form-group">
                    <label>Employee ID</label>
                    <select 
                      name="employee_id"
                      value={newLeaveRequest.employee_id}
                      onChange={handleLeaveRequestChange}
                      required
                    >
                      <option value="">-- Select Employee --</option>
                      {employees.map(emp => (
                        <option key={emp.employee_id} value={emp.employee_id}>
                          {emp.employee_id} - {emp.first_name} {emp.last_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Leave Type</label>
                    <select 
                      name="leave_type"
                      value={newLeaveRequest.leave_type}
                      onChange={handleLeaveRequestChange}
                      required
                    >
                      <option value="">-- Select Leave Type --</option>
                      <option value="Sick">Sick</option>
                      <option value="Vacation">Vacation</option>
                      <option value="Personal">Personal</option>
                      <option value="Maternity">Maternity</option>
                      <option value="Paternity">Paternity</option>
                      <option value="Unpaid">Unpaid</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Start Date</label>
                    <input 
                      type="date" 
                      name="start_date" 
                      value={newLeaveRequest.start_date}
                      onChange={handleLeaveRequestChange}
                      required 
                    />
                  </div>
                </div>
                
                <div className="form-column">
                  <div className="form-group">
                    <label>End Date</label>
                    <input 
                      type="date" 
                      name="end_date"
                      value={newLeaveRequest.end_date}
                      onChange={handleLeaveRequestChange}
                      required 
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Is Paid</label>
                    <input 
                      type="checkbox" 
                      name="is_paid"
                      checked={newLeaveRequest.is_paid}
                      onChange={handleLeaveRequestChange} 
                    />
                  </div>
                </div>
              </div>

              <div className="leave-requests-modal-buttons">
                <button type="submit" className="submit-btn">Add</button>
                <button type="button" className="cancel-btn" onClick={() => setShowAddModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {showEditModal && editingRequest && (
        <div className="leave-requests-modal-overlay">
          <div className="leave-requests-modal">
            <h3>Edit Leave Request</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              // Add edit form submission logic here
              console.log("Edit form submitted");
              setShowEditModal(false);
              showToast("Leave request updated successfully");
            }} className="leave-requests-modal-form">
              <div className="leave-requests-form-two-columns">
                <div className="form-column">
                  <div className="form-group">
                    <label>Leave ID</label>
                    <input type="text" value={editingRequest.leave_id || ""} disabled />
                  </div>
                  
                  <div className="form-group">
                    <label>Employee</label>
                    <input type="text" value={`${editingRequest.employee_id || ""} - ${editingRequest.employee_name || ""}`} disabled />
                  </div>
                  
                  <div className="form-group">
                    <label>Leave Type</label>
                    <select name="leave_type" defaultValue={editingRequest.leave_type} required>
                      <option value="Sick">Sick</option>
                      <option value="Vacation">Vacation</option>
                      <option value="Personal">Personal</option>
                      <option value="Maternity">Maternity</option>
                      <option value="Paternity">Paternity</option>
                      <option value="Unpaid">Unpaid</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-column">
                  <div className="form-group">
                    <label>Start Date</label>
                    <input type="date" name="start_date" defaultValue={editingRequest.start_date} required />
                  </div>
                  
                  <div className="form-group">
                    <label>End Date</label>
                    <input type="date" name="end_date" defaultValue={editingRequest.end_date} required />
                  </div>
                  
                  <div className="form-group">
                    <label>Is Paid</label>
                    <input type="checkbox" name="is_paid" defaultChecked={editingRequest.is_paid} />
                  </div>
                  
                  <div className="form-group">
                    <label>Status</label>
                    <select name="status" defaultValue={editingRequest.status} required>
                      <option value="Pending">Pending</option>
                      <option value="Approved by Superior">Approved by Superior</option>
                      <option value="Rejected by Superior">Rejected by Superior</option>
                      <option value="Approved by Management">Approved by Management</option>
                      <option value="Rejected by Management">Rejected by Management</option>
                      <option value="Recorded in HRIS">Recorded in HRIS</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="leave-requests-modal-buttons">
                <button type="submit" className="submit-btn">Save</button>
                <button type="button" className="cancel-btn" onClick={() => setShowEditModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Leave Balance Modals */}
      {showAddBalanceModal && (
        <div className="leave-requests-modal-overlay">
          <div className="leave-requests-modal">
            <h3>Add Leave Balance</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              // Add form submission logic here
              console.log("Leave balance form submitted");
              setShowAddBalanceModal(false);
              showToast("Leave balance added successfully");
            }} className="leave-requests-modal-form">
              <div className="form-group">
                <label>Employee</label>
                <select name="employee_id" required>
                  <option value="">-- Select Employee --</option>
                  <option value="EMP001">John Doe</option>
                  <option value="EMP002">Jane Smith</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Year</label>
                <input type="number" name="year" min="2023" max="2030" defaultValue={new Date().getFullYear()} required />
              </div>
              
              <div className="form-group">
                <label>Sick Leave Remaining</label>
                <input type="number" name="sick_leave_remaining" min="0" step="0.5" defaultValue="0" required />
              </div>
              
              <div className="form-group">
                <label>Vacation Leave Remaining</label>
                <input type="number" name="vacation_leave_remaining" min="0" step="0.5" defaultValue="0" required />
              </div>
              
              <div className="form-group">
                <label>Maternity Leave Remaining</label>
                <input type="number" name="maternity_leave_remaining" min="0" step="0.5" defaultValue="0" required />
              </div>
              
              <div className="form-group">
                <label>Paternity Leave Remaining</label>
                <input type="number" name="paternity_leave_remaining" min="0" step="0.5" defaultValue="0" required />
              </div>
              
              <div className="form-group">
                <label>Solo Parent Leave Remaining</label>
                <input type="number" name="solo_parent_leave_remaining" min="0" step="0.5" defaultValue="0" required />
              </div>
              
              <div className="form-group">
                <label>Unpaid Leave Taken</label>
                <input type="number" name="unpaid_leave_taken" min="0" step="0.5" defaultValue="0" required />
              </div>
              
              <div className="leave-requests-modal-buttons">
                <button type="submit" className="submit-btn">Add</button>
                <button type="button" className="cancel-btn" onClick={() => setShowAddBalanceModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {showEditBalanceModal && editingBalance && (
        <div className="leave-requests-modal-overlay">
          <div className="leave-requests-modal">
            <h3>Edit Leave Balance</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              // Add edit form submission logic here
              console.log("Edit balance form submitted");
              setShowEditBalanceModal(false);
              showToast("Leave balance updated successfully");
            }} className="leave-requests-modal-form">
              <div className="form-group">
                <label>Balance ID</label>
                <input type="text" value={editingBalance.balance_id || ""} disabled />
              </div>
              
              <div className="form-group">
                <label>Employee</label>
                <input type="text" value={`${editingBalance.employee_id || ""} - ${editingBalance.employee_name || ""}`} disabled />
              </div>
              
              <div className="form-group">
                <label>Year</label>
                <input type="number" name="year" min="2023" max="2030" defaultValue={editingBalance.year} required />
              </div>
              
              <div className="form-group">
                <label>Sick Leave Remaining</label>
                <input type="number" name="sick_leave_remaining" min="0" step="0.5" defaultValue={editingBalance.sick_leave_remaining} required />
              </div>
              
              <div className="form-group">
                <label>Vacation Leave Remaining</label>
                <input type="number" name="vacation_leave_remaining" min="0" step="0.5" defaultValue={editingBalance.vacation_leave_remaining} required />
              </div>
              
              <div className="form-group">
                <label>Maternity Leave Remaining</label>
                <input type="number" name="maternity_leave_remaining" min="0" step="0.5" defaultValue={editingBalance.maternity_leave_remaining} required />
              </div>
              
              <div className="form-group">
                <label>Paternity Leave Remaining</label>
                <input type="number" name="paternity_leave_remaining" min="0" step="0.5" defaultValue={editingBalance.paternity_leave_remaining} required />
              </div>
              
              <div className="form-group">
                <label>Solo Parent Leave Remaining</label>
                <input type="number" name="solo_parent_leave_remaining" min="0" step="0.5" defaultValue={editingBalance.solo_parent_leave_remaining} required />
              </div>
              
              <div className="form-group">
                <label>Unpaid Leave Taken</label>
                <input type="number" name="unpaid_leave_taken" min="0" step="0.5" defaultValue={editingBalance.unpaid_leave_taken} required />
              </div>
              
              <div className="leave-requests-modal-buttons">
                <button type="submit" className="submit-btn">Save</button>
                <button type="button" className="cancel-btn" onClick={() => setShowEditBalanceModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast notification */}
      {toast && (
        <div
          className="hr-leave-requests-toast"
          style={{ backgroundColor: toast.success ? "#4CAF50" : "#F44336" }}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default LeaveRequests;