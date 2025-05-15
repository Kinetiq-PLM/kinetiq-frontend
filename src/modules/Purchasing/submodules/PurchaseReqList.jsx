import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/PurchaseReqList.css";
import PurchaseReqForm from "./PurchaseReqForm";
import PurchForQuotForm from "./PurchForQuotForm";

const PurchaseReqListBody = ({ onBackToDashboard, toggleDashboardSidebar }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewForm, setShowNewForm] = useState(false);
  const [showPurchQuot, setShowPurchQuot] = useState(false);
  const [purchaseRequests, setPurchaseRequests] = useState([]);
  const [employeeMap, setEmployeeMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [approvalFilter, setApprovalFilter] = useState("all"); // Default to show all
  const [sortOrder, setSortOrder] = useState("newest"); // Default to newest
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [pendingStatusUpdates, setPendingStatusUpdates] = useState({});

  const statusOptions = ["All", "Acknowledged", "Finished", "Approved", "Pending", "Returned", "Rejected", "Cancelled", "Expired"];

  const fetchPurchaseRequests = async (signal) => {
    try {
      // Fetch all purchase requests
      const prfResponse = await axios.get("https://yi92cir5p0.execute-api.ap-southeast-1.amazonaws.com/dev/api/prf/list/", { signal });
      const purchaseRequests = prfResponse.data;

      // Fetch all quotation contents
      const quotationResponse = await axios.get("https://yi92cir5p0.execute-api.ap-southeast-1.amazonaws.com/dev/api/quotation-content/list/", { signal });
      const quotationContents = quotationResponse.data;

      // Extract request_ids that have matching quotation_content_id
      const requestIdsWithQuotation = new Set(quotationContents.map((qc) => qc.request_id));

      // Filter purchase requests to include only those with matching request_ids
      const filteredRequests = purchaseRequests.filter((request) =>
        requestIdsWithQuotation.has(request.request_id)
      );

      // Sort filtered requests by document_date (newest first)
      const sortedRequests = filteredRequests.sort((a, b) => {
        const dateA = new Date(a.document_date);
        const dateB = new Date(b.document_date);
        return dateB - dateA;
      });

      setPurchaseRequests(sortedRequests);
    } catch (error) {
      if (!axios.isCancel(error)) {
        console.error("Error fetching purchase requests or quotation contents:", error);
        setError("Failed to load purchase requests.");
      }
    }
  };

  const fetchEmployees = async (signal) => {
    try {
      const response = await axios.get("https://yi92cir5p0.execute-api.ap-southeast-1.amazonaws.com/dev/api/prf/employees/", { signal });
      const employeeData = response.data.reduce((map, employee) => {
        const fullName = `${employee.first_name} ${employee.last_name}`.trim();
        map[employee.employee_id] = {
          name: fullName,
          dept_id: employee.dept_id,
        };
        return map;
      }, {});
      setEmployeeMap(employeeData);
    } catch (error) {
      if (!axios.isCancel(error)) {
        console.error("Error fetching employees:", error);
        setError("Failed to load employee data.");
      }
    }
  };

  useEffect(() => {
    // Create abort controllers for API calls
    const abortController = new AbortController();
    
    const fetchData = async () => {
      try {
        setLoading(true);
        await fetchPurchaseRequests(abortController.signal);
        await fetchEmployees(abortController.signal);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
    
    // Cleanup function to abort any pending requests when component unmounts
    return () => {
      abortController.abort();
    };
  }, []);

  // Sort purchase requests dynamically based on sortOrder
  const handleSortToggle = () => {
    const newSortOrder = sortOrder === "newest" ? "oldest" : "newest";
    setSortOrder(newSortOrder);

    const sortedRequests = [...purchaseRequests].sort((a, b) => {
      const dateA = new Date(a.document_date);
      const dateB = new Date(b.document_date);
      return newSortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    setPurchaseRequests(sortedRequests);
  };

  const handleBack = () => {
    if (showNewForm || showPurchQuot || selectedRequest) {
      setShowNewForm(false);
      setShowPurchQuot(false);
      setSelectedRequest(null);
    } else {
      if (onBackToDashboard) {
        onBackToDashboard();
      }
      if (toggleDashboardSidebar) {
        toggleDashboardSidebar();
      }
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleNewRequest = () => {
    setShowNewForm(true); // Show the new form
    setSelectedRequest(null); // Reset selectedRequest
  };

  const handleRequestClick = (request) => {
    console.log("Selected Request (PurchaseReqList):", request); // Debugging
    const employeeName = employeeMap[request.employee_id]?.name || "Unknown"; // Get employee_name from the map
    setSelectedRequest({ ...request, employee_name: employeeName }); // Set the clicked request
    setShowPurchQuot(true); // Show the quotation form
    setShowNewForm(false); // Hide the PurchaseReqForm if it was open
  };

  const handleStatusDropdownSelect = (status) => {
    setApprovalFilter(status === 'All' ? 'all' : status);
    setShowStatusDropdown(false);
  };

  const handleStatusChange = async (requestId, newStatus) => {
    try {
      // Mark this request as having a pending update
      setPendingStatusUpdates(prev => ({
        ...prev,
        [requestId]: true
      }));
      
      // First, update the local state immediately for instant UI feedback
      setPurchaseRequests(prevRequests => 
        prevRequests.map(request => 
          request.request_id === requestId 
            ? { ...request, status: newStatus }
            : request
        )
      );
      
      // Then update the backend
      await axios.patch(`https://yi92cir5p0.execute-api.ap-southeast-1.amazonaws.com/dev/api/prf/update/${requestId}/`, {
        status: newStatus,
      });

      console.log(`Status for request ${requestId} updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating status:", error);
      setError("Failed to update status.");
      
      // If the API call fails, revert only this specific request
      setPurchaseRequests(prevRequests => {
        return prevRequests.map(request => {
          if (request.request_id === requestId) {
            // Fetch the current status from the server for just this one request
            axios.get(`https://yi92cir5p0.execute-api.ap-southeast-1.amazonaws.com/dev/api/prf/detail/${requestId}/`)
              .then(response => {
                const currentStatus = response.data.status;
                setPurchaseRequests(latestRequests => 
                  latestRequests.map(req => 
                    req.request_id === requestId 
                      ? { ...req, status: currentStatus }
                      : req
                  )
                );
              })
              .catch(err => {
                console.error("Failed to fetch current status:", err);
              });
          }
          return request;
        });
      });
    } finally {
      // Clear the pending status regardless of success/failure
      setPendingStatusUpdates(prev => {
        const updated = { ...prev };
        delete updated[requestId];
        return updated;
      });
    }
  };

  const filteredRequests = purchaseRequests.filter((request) => {
    const searchLower = searchTerm.toLowerCase();
    const employee = employeeMap[request.employee_id];
    const employeeName = (employee && employee.name) || "";

    // Status filter (using approvalFilter as status)
    let matchesStatus = true;
    if (approvalFilter !== "all") {
      if (approvalFilter === "Completed") {
        matchesStatus = request.status === "Completed";
      } else {
        matchesStatus = request.status === approvalFilter;
      }
    }

    // Search filter (existing)
    const matchesSearch =
      (request.request_id || "").toLowerCase().includes(searchLower) ||
      employeeName.toLowerCase().includes(searchLower) ||
      (request.department || "").toLowerCase().includes(searchLower) ||
      (request.document_date || "").toLowerCase().includes(searchLower) ||
      (request.valid_date || "").toLowerCase().includes(searchLower);

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="purchreq">
      <div className="purchreq-body-content-container">
        <div className="purchreq-header">
          <div className="purchreq-header-left">
            {!showNewForm && !showPurchQuot && (
              <button className="purchreq-back-btn" onClick={handleBack}>← Back</button>
            )}
          </div>
          {/* Place filter and searchbar together, aligned right, with no wrapper or space between */}
          {!showNewForm && !showPurchQuot && (
            <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto', gap: '0.75rem' }}>
              <div
                className="purchreq-status-filter"
                onClick={() => setShowStatusDropdown((prev) => !prev)}
                onBlur={() => setShowStatusDropdown(false)}
                tabIndex={0}
              >
                <span>Filter by: {approvalFilter === 'all' ? 'All' : approvalFilter}</span>
                <span style={{ marginLeft: 4 }}>▼</span>
                {showStatusDropdown && (
                  <div className="status-options-dropdown">
                    {statusOptions.map((status) => (
                      <div
                        key={status}
                        className={`status-option${(approvalFilter === status || (status === 'All' && approvalFilter === 'all')) ? ' selected' : ''}`}
                        onMouseDown={(e) => {
                          e.preventDefault(); // Prevent blur before click
                          setApprovalFilter(status === 'All' ? 'all' : status);
                          setShowStatusDropdown(false);
                        }}
                      >
                        {status}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <input
                type="text"
                className="purchreq-search"
                placeholder="Search by PR No., Employee Name, Department, or Date..."
                value={searchTerm}
                onChange={handleSearch}
                style={{ marginLeft: 0 }}
              />
            </div>
          )}
        </div>
        {showNewForm && !showPurchQuot && (
  <PurchaseReqForm
    onClose={() => {
      setShowNewForm(false);
      setShowPurchQuot(false);
      setSelectedRequest(null);
    }}
  />
)}
{showPurchQuot && selectedRequest && !showNewForm && (
  <PurchForQuotForm
    request={selectedRequest} // Pass the selected request object
    onClose={() => {
      setShowPurchQuot(false);
      setShowNewForm(false);
      setSelectedRequest(null);
    }}
  />
)}
{!showNewForm && !showPurchQuot && (
  <div className="purchreq-table-container">
    <div className="purchreq-table-header">
      <div>PR No.</div>
      <div>Employee Name</div>
      <div>Status</div>
      <div>
        <span
          className="sortable-header"
          onClick={handleSortToggle}
          style={{ cursor: "pointer", textDecoration: "underline" }}
        >
          Document Date ({sortOrder === "newest" ? "Newest" : "Oldest"})
        </span>
      </div>
      <div>Valid Date</div>
    </div>
    <div className="purchreq-table-scrollable">
      <div className="purchreq-table-rows">
        {filteredRequests.length > 0 ? (
          filteredRequests.map((request, index) => (
            <div
              key={index}
              className="purchreq-row"
              onClick={() => handleRequestClick(request)}
            >
              <div>{request.request_id}</div>
              <div>{employeeMap[request.employee_id]?.name || " "}</div>
              <div>
                <select
                  className={`status-select status-${request.status?.toLowerCase() || 'pending'} ${pendingStatusUpdates[request.request_id] ? 'status-updating' : ''}`}
                  value={request.status || "Pending"}
                 onChange={(e) => {
    e.stopPropagation(); // Prevent the row's onClick from being triggered
    handleStatusChange(request.request_id, e.target.value);
  }}
                  disabled={pendingStatusUpdates[request.request_id]}
                >
                  <option value="Acknowledged">Acknowledged</option>
                  <option value="Finished">Finished</option>
                  <option value="Approved">Approved</option>
                  <option value="Pending">Pending</option>
                  <option value="Returned">Returned</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Expired">Expired</option>
                </select>
              </div>
              <div>{request.document_date}</div>
              <div>{request.valid_date}</div>
            </div>
          ))
        ) : (
          <div className="purchreq-no-results">No results found</div>
        )}
      </div>
    </div>
  </div>
)}
      </div>
    </div>
  );
};

export default PurchaseReqListBody;