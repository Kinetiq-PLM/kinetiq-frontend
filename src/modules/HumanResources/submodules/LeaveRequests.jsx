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
  const [currentEmployeeBalance, setCurrentEmployeeBalance] = useState(null);

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
    is_paid: false,
    reason: ""
  });

  // Add this to your state declarations at the top
  const [selectedLeaveRequests, setSelectedLeaveRequests] = useState([]);

  // Toast helper with longer timeout for errors
  const showToast = (message, success = true) => {
    setToast({ message, success });
    setTimeout(() => setToast(null), success ? 3000 : 5000); // Show errors longer
  };

  // Fetch data
  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch all leave requests
      const leaveResponse = await axios.get("https://x0crs910m2.execute-api.ap-southeast-1.amazonaws.com/dev/api/employee_leave_requests/leave_requests/");
      
      // Explicitly filter active requests - make sure is_archived exists before using it
      const activeLeaveRequests = leaveResponse.data.filter(request => {
        return request.is_archived === false || request.is_archived === undefined;
      });
      setLeaveRequests(activeLeaveRequests);
  
      // Fetch archived leave requests separately
      const archivedResponse = await axios.get("https://x0crs910m2.execute-api.ap-southeast-1.amazonaws.com/dev/api/employee_leave_requests/leave_requests/archived/");
      setArchivedLeaveRequests(archivedResponse.data);
  
      // Fetch leave balances
      const balancesResponse = await axios.get("https://x0crs910m2.execute-api.ap-southeast-1.amazonaws.com/dev/api/employee_leave_balances/employee_leave_balances/");
      setLeaveBalances(balancesResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      showToast("Failed to load data", false);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await axios.get("https://x0crs910m2.execute-api.ap-southeast-1.amazonaws.com/dev/api/employees/employees/");
      setEmployees(res.data);
    } catch (err) {
      console.error("Failed to fetch employees:", err);
      showToast("Failed to fetch employees data", false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchEmployees();
  }, []);

  // Calculate total days between two dates
  const calculateTotalDays = (startDate, endDate) => {
    if (!startDate || !endDate) return null;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Reset time part to avoid time zone issues
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    
    // Calculate the difference in milliseconds
    const differenceMs = end - start;
    
    // Convert to days and add 1 to include both start and end date
    return Math.floor(differenceMs / (1000 * 60 * 60 * 24)) + 1;
  };

  // Check if employee has sufficient leave balance
  const checkLeaveBalance = (employeeId, leaveType, totalDays) => {
    if (!employeeId || !leaveType || !totalDays) return { valid: true, message: "" };
    
    const balance = leaveBalances.find(b => b.employee_id === employeeId);
    if (!balance) return { valid: true, message: "No balance record found. Will be validated by the server." };
    
    switch (leaveType) {
      case "Sick":
        if (totalDays > balance.sick_leave_remaining) {
          return { 
            valid: false, 
            message: `Insufficient sick leave balance. Requested: ${totalDays} days, Available: ${balance.sick_leave_remaining} days` 
          };
        }
        break;
      case "Vacation":
        if (totalDays > balance.vacation_leave_remaining) {
          return { 
            valid: false, 
            message: `Insufficient vacation leave balance. Requested: ${totalDays} days, Available: ${balance.vacation_leave_remaining} days` 
          };
        }
        break;
      case "Maternity":
        if (totalDays > 105) {
          return { valid: false, message: `Maternity leave cannot exceed 105 days` };
        }
        if (totalDays > balance.maternity_leave_remaining) {
          return { 
            valid: false, 
            message: `Insufficient maternity leave balance. Requested: ${totalDays} days, Available: ${balance.maternity_leave_remaining} days` 
          };
        }
        break;
      case "Paternity":
        if (totalDays > 7) {
          return { valid: false, message: `Paternity leave cannot exceed 7 days` };
        }
        if (totalDays > balance.paternity_leave_remaining) {
          return { 
            valid: false, 
            message: `Insufficient paternity leave balance. Requested: ${totalDays} days, Available: ${balance.paternity_leave_remaining} days` 
          };
        }
        break;
      case "Solo Parent":
        if (totalDays > 7) {
          return { valid: false, message: `Solo parent leave cannot exceed 7 days per year` };
        }
        if (totalDays > balance.solo_parent_leave_remaining) {
          return { 
            valid: false, 
            message: `Insufficient solo parent leave balance. Requested: ${totalDays} days, Available: ${balance.solo_parent_leave_remaining} days` 
          };
        }
        break;
      default:
        // For other leave types like unpaid
        break;
    }
    
    return { valid: true, message: "" };
  };

  // Update current employee balance when employee selection changes
  useEffect(() => {
    if (newLeaveRequest.employee_id) {
      const selectedBalance = leaveBalances.find(b => b.employee_id === newLeaveRequest.employee_id);
      setCurrentEmployeeBalance(selectedBalance || null);
    } else {
      setCurrentEmployeeBalance(null);
    }
  }, [newLeaveRequest.employee_id, leaveBalances]);

  const handleLeaveRequestChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewLeaveRequest(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleAddLeaveRequest = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!newLeaveRequest.employee_id || !newLeaveRequest.leave_type || 
        !newLeaveRequest.start_date || !newLeaveRequest.end_date) {
      showToast("Please fill out all required fields", false);
      return;
    }
    
    // Validate dates
    const startDate = new Date(newLeaveRequest.start_date);
    const endDate = new Date(newLeaveRequest.end_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time portion for fair comparison
    
    if (endDate < startDate) {
      showToast("End date must be after start date", false);
      return;
    }
    
    // Uncomment this check if you want to enforce the no-past-dates rule in the frontend
    if (startDate < today) {
      showToast("Start date cannot be in the past", false);
      return;
    }
    
    // Calculate total days for client-side validation
    const totalDays = calculateTotalDays(newLeaveRequest.start_date, newLeaveRequest.end_date);
    
    // Check leave balance on client side first
    const balanceCheck = checkLeaveBalance(
      newLeaveRequest.employee_id,
      newLeaveRequest.leave_type,
      totalDays
    );
    
    if (!balanceCheck.valid) {
      showToast(balanceCheck.message, false);
      return;
    }
    
    // Create the request payload
    const requestPayload = {
      employee_id: newLeaveRequest.employee_id,
      leave_type: newLeaveRequest.leave_type,
      start_date: newLeaveRequest.start_date,
      end_date: newLeaveRequest.end_date,
      is_paid: newLeaveRequest.is_paid
    };
    
    // Add immediate_superior_id and management_approval_id only if they're not empty
    // if (newLeaveRequest.immediate_superior_id) {
    //   requestPayload.immediate_superior_id = newLeaveRequest.immediate_superior_id;
    // }
    
    // if (newLeaveRequest.management_approval_id) {
    //   requestPayload.management_approval_id = newLeaveRequest.management_approval_id;
    // }
    
    // Console log for debugging
    console.log("Sending leave request payload:", requestPayload);
    
    try {
      setLoading(true); // Show loading state
      
      const response = await axios.post(
        "https://x0crs910m2.execute-api.ap-southeast-1.amazonaws.com/dev/api/employee_leave_requests/leave_requests/", 
        requestPayload,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      
      // Clear form
      setNewLeaveRequest({
        employee_id: "",
        leave_type: "",
        start_date: "",
        end_date: "",
        is_paid: false,
        immediate_superior_id: "",
        // management_approval_id: ""
      });
      
      setShowAddModal(false);
      showToast("Leave request added successfully");
      fetchData(); // Refresh data
    } catch (err) {
      console.error("Add leave request error:", err);
      
      // Better error handling to show the specific backend error
      let errorMessage = "Failed to add leave request";
      
      if (err.response) {
        if (err.response.data.detail) {
          errorMessage = err.response.data.detail;
        } else if (err.response.data.errors) {
          // Handle structured validation errors
          const errorsObj = err.response.data.errors;
          const errorMessages = [];
          
          // Convert the errors object to an array of error messages
          Object.keys(errorsObj).forEach(key => {
            if (Array.isArray(errorsObj[key])) {
              errorMessages.push(`${key}: ${errorsObj[key].join(' ')}`);
            } else {
              errorMessages.push(`${key}: ${errorsObj[key]}`);
            }
          });
          
          // Join all error messages with line breaks
          errorMessage = errorMessages.join('\n');
        } else if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        }
      }
      
      showToast(errorMessage, false);
    } finally {
      setLoading(false); // Hide loading state
    }
  };

  // Add this function near your other handler functions
  const handleArchiveLeaveRequest = async (leaveId) => {
    if (!window.confirm("Are you sure you want to archive this leave request?")) return;
    
    try {
      await axios.post(`https://x0crs910m2.execute-api.ap-southeast-1.amazonaws.com/dev/api/employee_leave_requests/leave_requests/${leaveId}/archive/`);
      showToast("Leave request archived successfully");
      fetchData(); // Refresh data after archiving
    } catch (err) {
      console.error("Archive leave request error:", err);
      showToast("Failed to archive leave request", false);
    }
  };

  const handleUnarchiveLeaveRequest = async (leaveId) => {
    if (!window.confirm("Are you sure you want to unarchive this leave request?")) return;
    
    try {
      await axios.post(`https://x0crs910m2.execute-api.ap-southeast-1.amazonaws.com/dev/api/employee_leave_requests/leave_requests/${leaveId}/unarchive/`);
      showToast("Leave request unarchived successfully");
      fetchData(); // Refresh data after unarchiving
    } catch (err) {
      console.error("Unarchive leave request error:", err);
      showToast("Failed to unarchive leave request", false);
    }
  };

  // Add these functions for handling checkbox selection
  const handleCheckboxChange = (leaveId) => {
    setSelectedLeaveRequests(prev => {
      if (prev.includes(leaveId)) {
        return prev.filter(id => id !== leaveId);
      } else {
        return [...prev, leaveId];
      }
    });
  };

  const handleSelectAllChange = (e) => {
    if (e.target.checked) {
      // Get all visible leave request IDs from the current page
      const allIds = paginated.map(request => request.leave_id);
      setSelectedLeaveRequests(allIds);
    } else {
      setSelectedLeaveRequests([]);
    }
  };

  // Add this function to handle bulk unarchiving
  const handleBulkUnarchive = async () => {
    if (selectedLeaveRequests.length === 0) return;
    
    if (!window.confirm(`Are you sure you want to unarchive ${selectedLeaveRequests.length} selected leave request(s)?`)) return;
    
    setLoading(true);
    let successCount = 0;
    
    try {
      // Process each selected leave request
      for (const leaveId of selectedLeaveRequests) {
        try {
          await axios.post(`https://x0crs910m2.execute-api.ap-southeast-1.amazonaws.com/dev/api/employee_leave_requests/leave_requests/${leaveId}/unarchive/`);
          successCount++;
        } catch (err) {
          console.error(`Failed to unarchive leave request ${leaveId}:`, err);
        }
      }
      
      showToast(`Successfully unarchived ${successCount} of ${selectedLeaveRequests.length} leave requests`);
      setSelectedLeaveRequests([]);
      fetchData(); // Refresh data
    } catch (err) {
      showToast("An error occurred during bulk unarchive operation", false);
    } finally {
      setLoading(false);
    }
  };

  // Display leave balance information in the form
  const renderLeaveBalanceInfo = () => {
    if (!currentEmployeeBalance) return null;
    
    const selectedLeaveType = newLeaveRequest.leave_type;
    let balanceToShow = null;
    
    switch (selectedLeaveType) {
      case "Sick":
        balanceToShow = {
          label: "Sick Leave Balance",
          value: currentEmployeeBalance.sick_leave_remaining
        };
        break;
      case "Vacation":
        balanceToShow = {
          label: "Vacation Leave Balance",
          value: currentEmployeeBalance.vacation_leave_remaining
        };
        break;
      case "Maternity":
        balanceToShow = {
          label: "Maternity Leave Balance",
          value: currentEmployeeBalance.maternity_leave_remaining
        };
        break;
      case "Paternity":
        balanceToShow = {
          label: "Paternity Leave Balance",
          value: currentEmployeeBalance.paternity_leave_remaining
        };
        break;
      case "Solo Parent":
        balanceToShow = {
          label: "Solo Parent Leave Balance",
          value: currentEmployeeBalance.solo_parent_leave_remaining
        };
        break;
      default:
        return null;
    }
    
    if (!balanceToShow) return null;
    
    // Calculate days for selected dates
    const startDate = newLeaveRequest.start_date;
    const endDate = newLeaveRequest.end_date;
    const totalDays = calculateTotalDays(startDate, endDate);
    
    return (
      <div className="leave-balance-info">
        <div className="balance-row">
          <span className="balance-label">{balanceToShow.label}:</span>
          <span className={`balance-value ${balanceToShow.value <= 3 ? 'low-balance' : ''}`}>
            {balanceToShow.value} days
          </span>
        </div>
        {totalDays && (
          <div className="balance-row">
            <span className="balance-label">Requested Leave:</span>
            <span className="balance-value">{totalDays} days</span>
          </div>
        )}
        {totalDays && balanceToShow && (
          <div className="balance-row">
            <span className="balance-label">Remaining After Request:</span>
            <span className={`balance-value ${balanceToShow.value - totalDays < 0 ? 'negative-balance' : ''}`}>
              {balanceToShow.value - totalDays} days
            </span>
          </div>
        )}
      </div>
    );
  };

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
                  {isArchived && (
                    <th>
                      <input 
                        type="checkbox" 
                        onChange={handleSelectAllChange}
                        checked={selectedLeaveRequests.length > 0 && selectedLeaveRequests.length === paginated.length}
                      />
                    </th>
                  )}
                  <th>Leave ID</th>
                  <th>Employee ID</th>
                  <th>Employee Name</th>
                  <th>Immediate Superior ID</th>
                  <th>Immediate Superior Name</th>
                  <th>Leave Type</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Total Days</th>
                  <th>Is Paid</th>
                  <th>Reason</th>
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
                        <input 
                          type="checkbox" 
                          checked={selectedLeaveRequests.includes(request.leave_id)}
                          onChange={() => handleCheckboxChange(request.leave_id)}
                        />
                      </td>
                    )}
                    <td>{request.leave_id}</td>
                    <td>{request.employee_id}</td>
                    <td>{request.employee_name}</td>
                    <td>{request.immediate_superior_id}</td>
                    <td>{request.immediate_superior_name}</td>
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
                    <td>{request.reason || "-"}</td>
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
                              initializeEditForm(request);
                              setDotsMenuOpen(null);
                            }}
                          >
                            Edit
                          </div>
                          {isArchived ? (
                            <div
                              className="leave-requests-dropdown-item"
                              onClick={() => handleUnarchiveLeaveRequest(request.leave_id)}
                            >
                              Unarchive
                            </div>
                          ) : (
                            <div
                              className="leave-requests-dropdown-item"
                              onClick={() => handleArchiveLeaveRequest(request.leave_id)}
                            >
                              Archive
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {isArchived && selectedLeaveRequests.length > 0 && (
          <button
            className="bulk-unarchive-btn"
            onClick={handleBulkUnarchive}
          >
            Bulk Unarchive
          </button>
        )}
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
      <button 
        className="hr-leave-requests-pagination-arrow" 
        onClick={() => setCurrentPage(1)} 
        disabled={currentPage === 1}
      >
        &#171; {/* Double left arrow */}
      </button>
      
      <button 
        className="hr-leave-requests-pagination-arrow" 
        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
        disabled={currentPage === 1}
      >
        &#8249; {/* Single left arrow */}
      </button>
      
      <div className="hr-leave-requests-pagination-numbers">
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
              pageNumbers.push(<span key="ellipsis1" className="hr-leave-requests-pagination-ellipsis">...</span>);
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
              pageNumbers.push(<span key="ellipsis2" className="hr-leave-requests-pagination-ellipsis">...</span>);
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
        className="hr-leave-requests-pagination-arrow" 
        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
        disabled={currentPage === totalPages}
      >
        &#8250; {/* Single right arrow */}
      </button>
      
      <button 
        className="hr-leave-requests-pagination-arrow" 
        onClick={() => setCurrentPage(totalPages)} 
        disabled={currentPage === totalPages}
      >
        &#187; {/* Double right arrow */}
      </button>
      
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

// Add this state to store edited leave request data
const [editedLeaveRequest, setEditedLeaveRequest] = useState({
  leave_type: "",
  start_date: "",
  end_date: "",
  is_paid: false,
  status: ""
});

const initializeEditForm = (request) => {
  setEditingRequest(request);
  setEditedLeaveRequest({
    employee_id: request.employee_id,  
    leave_type: request.leave_type,
    start_date: request.start_date,
    end_date: request.end_date,
    is_paid: request.is_paid,
    status: request.status,
    reason: request.reason || ""
  });
  setShowEditModal(true);
};
// Add this function to handle edit form changes
const handleEditLeaveRequestChange = (e) => {
  const { name, value, type, checked } = e.target;
  setEditedLeaveRequest(prev => ({
    ...prev,
    [name]: type === "checkbox" ? checked : value
  }));
};

const handleEditLeaveRequest = async (e) => {
  e.preventDefault();
  setLoading(true);
  
  try {
    // Only send fields that we want to update
    const requestData = {
      leave_type: editedLeaveRequest.leave_type,
      start_date: editedLeaveRequest.start_date,
      end_date: editedLeaveRequest.end_date,
      is_paid: editedLeaveRequest.is_paid,
      status: editedLeaveRequest.status
    };
    
    // Do not include employee_id in the PATCH request
    
    // Make API call with only the fields we want to update
    await axios.patch(
      `https://x0crs910m2.execute-api.ap-southeast-1.amazonaws.com/dev/api/employee_leave_requests/leave_requests/${editingRequest.leave_id}/`,
      requestData
    );
    
    setShowEditModal(false);
    showToast("Leave request updated successfully");
    fetchData(); // Refresh data after update
  } catch (err) {
    console.error("Update leave request error:", err);
    
    let errorMessage = "Failed to update leave request";
    if (err.response?.data) {
      if (err.response.data.detail) {
        errorMessage = err.response.data.detail;
      } else if (err.response.data.errors) {
        errorMessage = Object.entries(err.response.data.errors)
          .map(([key, value]) => `${key}: ${value}`)
          .join('\n');
      }
    }
    
    showToast(errorMessage, false);
  } finally {
    setLoading(false);
  }
};

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
                    onClick={() => {
                      setShowArchived(!showArchived);
                      setSelectedLeaveRequests([]); // Clear selections when toggling view
                    }}
                  >
                    {showArchived ? "View Active" : "View Archived"}
                  </button>
                  {showArchived && selectedLeaveRequests.length > 0 && (
                    <button
                      className="hr-leave-requests-add-btn"
                      onClick={handleBulkUnarchive}
                    >
                      Unarchive Selected ({selectedLeaveRequests.length})
                    </button>
                  )}
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
                      <option value="Solo Parent">Solo Parent</option>
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
                  <div className="form-group">
                    <label>Reason</label>
                    <select 
                      name="reason"
                      value={newLeaveRequest.reason || ""}
                      onChange={handleLeaveRequestChange}
                    >
                      <option value="">-- Select Reason --</option>
                      <option value="Project Canceled">Project Canceled</option>
                      <option value="Unused Funds">Unused Funds</option>
                      <option value="Medical">Medical</option>
                      <option value="Family Emergency">Family Emergency</option>
                      <option value="Personal Time">Personal Time</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>
                  {/* Balance information showing current values */}
                  {renderLeaveBalanceInfo()}
                </div>
              </div>

              <div className="leave-requests-modal-buttons">
                <button type="submit" className="submit-btn">Add</button>
                <button 
                  type="button" 
                  className="cancel-btn" 
                  onClick={() => {
                    setShowAddModal(false);
                    setNewLeaveRequest({
                      employee_id: "",
                      leave_type: "",
                      start_date: "",
                      end_date: "",
                      is_paid: false
                    });
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {showEditModal && editingRequest && (
        <div className="leave-requests-modal-overlay">
          <div className="leave-requests-modal">
            <h3>Edit Leave Request</h3>
            <form onSubmit={handleEditLeaveRequest} className="leave-requests-modal-form">
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
                    <select 
                      name="leave_type" 
                      value={editedLeaveRequest.leave_type} 
                      onChange={handleEditLeaveRequestChange}
                      required
                    >
                      <option value="Sick">Sick</option>
                      <option value="Vacation">Vacation</option>
                      <option value="Emergency">Emergency</option>
                      <option value="Maternity">Maternity</option>
                      <option value="Paternity">Paternity</option>
                      <option value="Solo Parent">Solo Parent</option>
                      <option value="Unpaid">Unpaid</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-column">
                  <div className="form-group">
                    <label>Start Date</label>
                    <input 
                      type="date" 
                      name="start_date" 
                      value={editedLeaveRequest.start_date} 
                      onChange={handleEditLeaveRequestChange} 
                      required 
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>End Date</label>
                    <input 
                      type="date" 
                      name="end_date" 
                      value={editedLeaveRequest.end_date} 
                      onChange={handleEditLeaveRequestChange} 
                      required 
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Is Paid</label>
                    <input 
                      type="checkbox" 
                      name="is_paid" 
                      checked={editedLeaveRequest.is_paid} 
                      onChange={handleEditLeaveRequestChange} 
                    />
                  </div>
                  <div className="form-group">
                    <label>Reason</label>
                    <select 
                      name="reason" 
                      value={editedLeaveRequest.reason || ""} 
                      onChange={handleEditLeaveRequestChange}
                    >
                      <option value="">-- Select Reason --</option>
                      <option value="Project Canceled">Project Canceled</option>
                      <option value="Unused Funds">Unused Funds</option>
                      <option value="Medical">Medical</option>
                      <option value="Family Emergency">Family Emergency</option>
                      <option value="Personal Time">Personal Time</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select 
                      name="status" 
                      value={editedLeaveRequest.status} 
                      onChange={handleEditLeaveRequestChange}
                      required
                    >
                      <option value="Pending">Pending</option>
                      <option value="Approved by Superior">Approved by Superior</option>
                      <option value="Rejected by Superior">Rejected by Superior</option>
                      {/* <option value="Approved by Management">Approved by Management</option>
                      <option value="Rejected by Management">Rejected by Management</option> */}
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
                  {employees.map(emp => (
                    <option key={emp.employee_id} value={emp.employee_id}>
                      {emp.employee_id} - {emp.first_name} {emp.last_name}
                    </option>
                  ))}
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