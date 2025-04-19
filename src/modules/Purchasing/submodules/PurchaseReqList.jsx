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
  const [employeeMap, setEmployeeMap] = useState({}); // Map of employee_id to employee_name
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null); // Store selected request

  // Fetch purchase requests and employee data from the API
  useEffect(() => {
    const fetchPurchaseRequests = async () => {
      try {
        const response = await axios.get("https://yi92cir5p0.execute-api.ap-southeast-1.amazonaws.com/dev/api/prf/list/");
        // Sort the purchase requests by request_id in descending order
        const sortedRequests = response.data.sort((a, b) => {
          const idA = parseInt(a.request_id, 10);
          const idB = parseInt(b.request_id, 10);
          return idB - idA; // Descending order
        });
        setPurchaseRequests(sortedRequests);
      } catch (error) {
        console.error("Error fetching purchase requests:", error);
        setError("Failed to load purchase requests");
      } finally {
        setLoading(false);
      }
    };

    const fetchEmployees = async () => {
        try {
          const response = await axios.get("https://yi92cir5p0.execute-api.ap-southeast-1.amazonaws.com/dev/api/prf/employees/");
          // Create a map of employee_id to full name (first_name + last_name)
          const employeeData = response.data.reduce((map, employee) => {
            const fullName = `${employee.first_name} ${employee.last_name}`.trim(); // Combine first_name and last_name
            map[employee.employee_id] = {
            name: fullName, 
            dept_id: employee.dept_id,
            }
            return map;
          }, {});
          setEmployeeMap(employeeData);
        } catch (error) {
          console.error("Error fetching employees:", error);
          setError("Failed to load employee data");
        }
      };

    fetchPurchaseRequests();
    fetchEmployees();
  }, []);

  // Safety net: never allow both forms to show at once
  useEffect(() => {
    if (showNewForm && showPurchQuot) {
      setShowNewForm(false); // Always prioritize PurchForQuotForm
    }
  }, [showNewForm, showPurchQuot]);

  const handleBack = () => {
    // If we're in a detail or form view, reset local state; otherwise, go back to dashboard and toggle sidebar
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
    const employeeName = employeeMap[request.employee_id] || "Unknown"; // Get employee_name from the map
    setSelectedRequest({...request, employee_name: employeeName}); // Set the clicked request
    setShowPurchQuot(true); // Show the quotation form
    setShowNewForm(false); // Hide the PurchaseReqForm if it was open
  };

  const handleCheckboxClick = (event) => {
    event.stopPropagation();
  };

  // Filter requests
  const filteredRequests = purchaseRequests.filter((request) => {
    const searchLower = searchTerm.toLowerCase();
    const employeeName = employeeMap[request.employee_id] || ""; // Get employee_name from the map
    return (
      (request.request_id || "").toLowerCase().includes(searchLower) ||
      employeeName.toLowerCase().includes(searchLower) || // Search by employee_name
      (request.department || "").toLowerCase().includes(searchLower) ||
      (request.document_date || "").toLowerCase().includes(searchLower) ||
      (request.valid_date || "").toLowerCase().includes(searchLower)
    );
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
          {!showNewForm && !showPurchQuot && (
            <input
              type="text"
              className="purchreq-search"
              placeholder="Search by PR No., Employee Name, Department, or Date..."
              value={searchTerm}
              onChange={handleSearch}
            />
          )}
        </div>
        {showNewForm && !showPurchQuot && (
          <PurchaseReqForm onClose={() => {
            setShowNewForm(false);
            setShowPurchQuot(false);
            setSelectedRequest(null);
          }} />
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
              <div className="purchreq-checkbox"><input type="checkbox" onClick={handleCheckboxClick} /></div>
              <div>PR No.</div>
              <div>Employee Name</div>
              <div>Department</div>
              <div>Document Date</div>
              <div>Valid Date</div>
            </div>
            <div className="purchreq-table-scrollable">
              <div className="purchreq-table-rows">
                {filteredRequests.length > 0 ? filteredRequests.map((request, index) => (
                  <div key={index} className="purchreq-row" onClick={() => handleRequestClick(request)}>
                    <div className="purchreq-checkbox"><input type="checkbox" onClick={handleCheckboxClick} /></div>
                    <div>{request.request_id}</div>
                    <div>{employeeMap[request.employee_id]?.name || " "}</div>
                    <div>{employeeMap[request.employee_id]?.dept_id || " "}</div>
                    <div>{request.document_date}</div>
                    <div>{request.valid_date}</div>
                  </div>
                )) : (
                  <div className="purchreq-no-results">No results found</div>
                )}
              </div>
            </div>
          </div>
        )}
        {!showNewForm && !showPurchQuot && (
          <div className="purchreq-footer">
            <button className="purchreq-new-form" onClick={handleNewRequest}>New Form</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchaseReqListBody;