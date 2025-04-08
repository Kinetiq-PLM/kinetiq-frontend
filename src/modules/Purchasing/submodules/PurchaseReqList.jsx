import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/PurchaseReqList.css";
import PurchaseReqForm from "./PurchaseReqForm";
import PurchForQuotForm from "./PurchForQuotForm";

const PurchaseReqListBody = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewForm, setShowNewForm] = useState(false);
  const [showPurchQuot, setShowPurchQuot] = useState(false);
  const [purchaseRequests, setPurchaseRequests] = useState([]);
  const [employeeMap, setEmployeeMap] = useState({}); // Map of employee_id to employee_name
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false); // Toggle for Load More
  const [selectedRequest, setSelectedRequest] = useState(null); // Store selected request

  // Fetch purchase requests and employee data from the API
  useEffect(() => {
    const fetchPurchaseRequests = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/prf/list/");
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
          const response = await axios.get("http://127.0.0.1:8000/api/prf/employees/");
          // Create a map of employee_id to full name (first_name + last_name)
          const employeeData = response.data.reduce((map, employee) => {
            const fullName = `${employee.first_name} ${employee.last_name}`.trim(); // Combine first_name and last_name
            map[employee.employee_id] = fullName;
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

  const handleBack = () => {
    console.log("Back button clicked");
    setSelectedRequest(null);
    setShowPurchQuot(false);
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
  };

  const handleCheckboxClick = (event) => {
    event.stopPropagation();
  };

  const handleLoadMore = () => {
    setShowAll(!showAll);
  };

  // Filter and limit requests
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

  const displayedRequests = showAll ? filteredRequests : filteredRequests.slice(0, 11);

  return (
    <div className="purchreq">
      {showNewForm ? (
        <PurchaseReqForm onClose={() => setShowNewForm(false)} />
      ) : showPurchQuot && selectedRequest ? (
        <PurchForQuotForm
          request={selectedRequest} // Pass the selected request object
          onClose={handleBack} // Pass the handleBack function to reset
        />
      ) : (
        <div className="purchreq-body-content-container">
          <div className="purchreq-header">
            <button className="purchreq-back-btn" onClick={handleBack}>← Back</button>
            <input
              type="text"
              className="purchreq-search"
              placeholder="Search by PR No., Employee Name, Department, or Date..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="error">{error}</p>
          ) : (
            <div className="purchreq-table-container">
              <table className="purchreq-table">
                <thead>
                  <tr>
                    <th><input type="checkbox" onClick={handleCheckboxClick} /></th>
                    <th>PR No.</th>
                    <th>Employee Name</th>
                    <th>Department</th>
                    <th>Document Date</th>
                    <th>Valid Date</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedRequests.length > 0 ? (
                    displayedRequests.map((request, index) => (
                      <tr key={index} onClick={() => handleRequestClick(request)}>
                        <td><input type="checkbox" onClick={handleCheckboxClick} /></td>
                        <td>{request.request_id}</td>
                        <td>{employeeMap[request.employee_id] || " "}</td> {/* Display employee_name */}
                        <td>{request.department}</td>
                        <td>{request.document_date}</td>
                        <td>{request.valid_date}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="purchreq-no-results">No results found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Buttons */}
          <div className="purchreq-button-container">
            <button className="purchreq-new-form" onClick={handleNewRequest}>New Form</button>
            {filteredRequests.length > 10 && (
              <button className="purchreq-load-more" onClick={handleLoadMore}>
                {showAll ? "Show Less" : "Load More"}
              </button>
            )}
            <button className="purchreq-send-to">Send to</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseReqListBody;