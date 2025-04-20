"use client"

import { useState, useEffect } from "react"
import "../styles/ServiceRequest.css"
import "../styles/SupportServices.css"
import ServiceRequestIcon from "/icons/SupportServices/ServiceRequestIcon.png"
import SearchIcon from "/icons/SupportServices/SearchIcon.png"
import Table from "../components/ServiceRequest/Table"
import UpdateViewModal from "../components/ServiceRequest/UpdateViewModal"

import { GET } from "../api/api"
import { PATCH } from "../api/api"

const ServiceRequest = ({employee_id}) => {
  const [requests, setRequests] = useState([])
  const [filterBy, setFilterBy] = useState("")
  const [showFilterOptions, setShowFilterOptions] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [errorModalMessage, setErrorModalMessage] = useState("")

  const fetchRequests = async () => {
    try {
      // this filters out requests so that only the service requests assigned to the one currently logged in will show:
      const data = await GET(`request/requests/technician/${employee_id}/`);
      // const data = await GET(`request/requests/technician/HR-EMP-2025-8d9f9b/`);

      // all calls version:
      // const data = await GET("request/");
      setRequests(data);
    } catch (error) {
      console.error("Error fetching requests:", error)
    }
  }

  useEffect(() => {
    fetchRequests();
  }, []);

  // table row clicking func
  const handleRowClick = (request) => {
    setSelectedRequest(request)
  };

  const handleUpdateClick = () => {
    if (selectedRequest) {
      setShowUpdateModal(true); // Open modal
    }
  }

  const handleFilterChange = (value) => {
    setFilterBy(value)
    setShowFilterOptions(false)
  }

  const handleViewRequest = (request) => {
    setSelectedRequest(request)
    setShowUpdateModal(true)
  }

  const handleUpdateRequest = async (updatedRequest) => {
    const requestId = updatedRequest.service_request_id;
    if (!requestId) {
      console.error("Error: service_request_id is undefined");
      return;
    }
    console.log("Updating request:", updatedRequest)

    try {
      await PATCH(`request/${requestId}/`, updatedRequest);
      setShowUpdateModal(false);
      fetchRequests();
    } catch (error) {
      let firstError = "An unknown error occurred.";
      if (error && typeof error === "object") {
        const keys = Object.keys(error);
        if (keys.length > 0) {
          const firstKey = keys[0];
          const firstValue = error[firstKey];
          if (Array.isArray(firstValue)) {
            firstError = `${firstKey}: ${firstValue[0]}`;
          }
        } else if (typeof error.detail === "string") {
          firstError = error.detail;
        }
      }

        console.error("Error updating service request:", error.message);
        setErrorModalMessage(firstError); 
        setShowErrorModal(true);  
    }
  }

  const filterOptions = [
    { value: "all", label: "All" },
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
    { value: "in progress", label: "In Progress" },
    { value: "repair", label: "Repair" },
    { value: "installation", label: "Installation" },
    { value: "maintenance", label: "Maintenance" },
    { value: "renewal", label: "Renewal" },
    { value: "other", label: "Other" },
  ]

  // Filter requests based on search query and selected filter
  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      searchQuery === "" ||
      (request.service_request_id?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      (request.service_call?.service_call_id?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      (request.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
  
    if (!filterBy || filterBy === "all") return matchesSearch;
  
    const matchesStatus = 
      (filterBy === "pending" && request.request_status === "Pending") ||
      (filterBy === "approved" && request.request_status === "Approved") ||
      (filterBy === "rejected" && request.request_status === "Rejected") ||
      (filterBy === "in progress" && request.request_status === "In Progress");
  
    const matchesType = 
      (filterBy === "repair" && request.request_type === "Repair") ||
      (filterBy === "installation" && request.request_type === "Installation") ||
      (filterBy === "maintenance" && request.request_type === "Maintenance") ||
      (filterBy === "renewal" && request.request_type === "Renewal") ||
      (filterBy === "other" && request.request_type === "Other");
  
    return matchesSearch && (matchesStatus || matchesType);
  });

  return (
    <div className="serv servrequ">
      <div className="body-content-container">
        <div className="header">
          <div className="icon-container">
            <img src={ServiceRequestIcon || "/placeholder.svg?height=24&width=24"} alt="Service Request" />
          </div>
          <div className="title-container">
            <h2>Service Requests</h2>
            <p className="subtitle">Review and update service requests</p>
          </div>
        </div>

        <div className="divider"></div>

        <div className="content-scroll-area">
          <div className="search-filter-container">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search or type a command (Ctrl + G)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <img src={SearchIcon || "/placeholder.svg?height=16&width=16"} alt="Search" className="search-icon" />
            </div>

            <div className="filter-dropdown">
              <button className="filter-button" onClick={() => setShowFilterOptions(!showFilterOptions)}>
                {filterOptions.find(opt => opt.value === filterBy)?.label || "Filter by"}
                <span className="arrow">▼</span>
              </button>
              {showFilterOptions && (
                <div className="filter-options">
                  {filterOptions.map((option) => (
                    <div key={option.value} className="filter-option" onClick={() => handleFilterChange(option.value)}>
                      {option.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Table Component */}
          <Table 
            requests={filteredRequests} 
            onRowClick={handleRowClick}  
            onViewRequest={handleViewRequest} 
            selectedRequest={selectedRequest}
          />

          <div className="update-container">
            <button 
              type="button" 
              className={`update-button ${selectedRequest ? "clickable" : "disabled"}`}
              onClick={handleUpdateClick} 
              disabled={!selectedRequest}
            >
              Update
            </button>
          </div>
        </div>
      </div>

      {/* Update/View Modal */}
      <UpdateViewModal
        isOpen={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        request={selectedRequest}
        onUpdate={handleUpdateRequest}
      />

{showErrorModal && (
        <div className="alert-modal-overlay">
          <div className="alert-modal-content">
            <h2>ERROR</h2>
            <p>{errorModalMessage}</p>
            <button className="alert-okay-button" onClick={() => setShowErrorModal(false)}>OK</button>
          </div>
        </div>
      )}  
    </div>
  )
}

export default ServiceRequest

