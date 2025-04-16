"use client"

import { useState, useEffect } from "react"
import "../styles/ServiceCall.css"
import "../styles/SupportServices.css"
import ServiceCallIcon from "/icons/SupportServices/ServiceCallIcon.png"
import Table from "../components/ServiceCall/Table"
import ServiceRequestModal from "../components/ServiceCall/ServiceRequestModal"
import RenewalModal from "../components/ServiceCall/RenewalModal"
import GeneralWithContractModal from "../components/ServiceCall/GeneralWithContractModal"
import ResolutionModal from "../components/ServiceCall/ResolutionModal"
import SearchIcon from "/icons/SupportServices/SearchIcon.png"

import { GET } from "../api/api"
import { PATCH } from "../api/api"
import { POST } from "../api/api"

const ServiceCall = ({user_id, employee_id}) => {
  // State for service calls
  const [serviceCalls, setServiceCalls] = useState([])
  const [filterBy, setFilterBy] = useState("")
  const [showFilterOptions, setShowFilterOptions] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Modal states
  const [showWithContractModal, setShowWithContractModal] = useState(false)
  const [showResolutionModal, setShowResolutionModal] = useState(false)
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [showRenewalModal, setShowRenewalModal] = useState(false)
  const [selectedCall, setSelectedCall] = useState(null)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [errorModalMessage, setErrorModalMessage] = useState("")

  // Fetch service calls from API (mock function)
  const fetchServiceCalls = async () => {
    try {
      const data = await GET(`call/calls/technician/${employee_id}/`);

      // all calls version:
      // const data = await GET("call/");
      setServiceCalls(data);
    } catch (error) {
      console.error("Error fetching service calls:", error)
    }
  }

  useEffect(() => {
    fetchServiceCalls();
  }, []);

  // table row clicking func
  const handleRowClick = (call) => {
    setSelectedCall(call)
  };

  const handleUpdateClick = () => {
    if (selectedCall) {
      setShowWithContractModal(true); // Open modal
    }
  }

  const handleFilterChange = (value) => {
    setFilterBy(value)
    setShowFilterOptions(false)
  }

  const handleViewDetails = (call) => {
    setSelectedCall(call)
    setShowWithContractModal(true)
  }

  const handleUpdate = async (updatedData) => {
    const serviceCallId = updatedData.service_call_id;
    if (!serviceCallId) {
      console.error("Error: service_call_id is undefined");
      return;
    }
    console.log("Updating service call with:", updatedData);

    try {
      await PATCH(`call/${serviceCallId}/`, updatedData);
      setShowWithContractModal(false);
      setShowResolutionModal(false);
      fetchServiceCalls();
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

      console.error("Error updating service call:", error.message);
      setErrorModalMessage(firstError); 
      setShowErrorModal(true);  
  }
  }

  const handleShowResolution = () => {
    // Close the current modal and open the resolution modal
    setShowWithContractModal(false)
    setShowResolutionModal(true)
  }

  const handleReturnToGeneral = () => {
    // Close resolution modal and reopen the appropriate general modal
    setShowResolutionModal(false)
    setShowWithContractModal(true)
  }

  const handleOpenReq = () => {
    setShowResolutionModal(false)
    setShowWithContractModal(false);
    setShowRequestModal(true);
  }

  const closeReqModal = () => {
    setShowRequestModal(false);
    setShowResolutionModal(true);
  }

  const handleOpenRen = () => {
    setShowResolutionModal(false)
    setShowWithContractModal(false);
    setShowRenewalModal(true);
  }
  
  const closeRenModal = () => {
    setShowRenewalModal(false);
    setShowResolutionModal(true);
  }

  const updateCallStatus = async (serviceCallId) => {
    const updatedData = {
      call_status: "Closed"
    }

    console.log("Updating service call:", serviceCallId);

    try {
      await PATCH(`call/${serviceCallId}/`, updatedData);
      fetchServiceCalls();
      console.log("Updated service call successfully.")
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

      console.error("Error updating service call:", error.message);
      setErrorModalMessage(firstError); 
      setShowErrorModal(true);  
  }
  }

  const handleSubmitReq = async (reqData) => {
    // submit req
    console.log("Submitting request:", reqData)

    try {
      const data = await POST("request/", reqData);
      console.log("Service request created successfully:", data);
      updateCallStatus(data.service_call?.service_call_id);
      setShowRequestModal(false);
      setShowResolutionModal(true);
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

      console.error("Error creating service request:", error.message);
      setErrorModalMessage(firstError); 
      setShowErrorModal(true);  
    }
  }

  const handleSubmitRen = async (renData) => {
    // submit ren
    console.log("Submitting warranty renewal:", renData)

    try {
      const data = await POST("renewal/", renData);
      console.log("Warranty renewal created successfully:", data);
      updateCallStatus(data.service_call?.service_call_id);
      setShowRenewalModal(false);
      setShowResolutionModal(true);
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

      console.error("Error creating waranty renewal:", error.message);
      setErrorModalMessage(firstError); 
      setShowErrorModal(true);  
    }
  }

  const filterOptions = [
    { value: "all", label: "All" },
    { value: "open", label: "Open" },
    { value: "closed", label: "Closed" },
    { value: "pending", label: "Pending" },
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "urgent", label: "Urgent" },
  ]

  // Filter service calls based on selected filter and search query
  const filteredCalls = serviceCalls.filter((call) => {
    // Filter by status/priority
    let matchesFilter = true
    if (filterBy === "open" && call.call_status !== "Open") matchesFilter = false
    if (filterBy === "closed" && call.call_status !== "Closed") matchesFilter = false
    if (filterBy === "pending" && call.call_status !== "Pending") matchesFilter = false
    if (filterBy === "low" && call.priority_level !== "Low") matchesFilter = false
    if (filterBy === "medium" && call.priority_level !== "Medium") matchesFilter = false
    if (filterBy === "high" && call.priority_level !== "High") matchesFilter = false
    if (filterBy === "urgent" && call.priority_level !== "Urgent") matchesFilter = false

    // Filter by search query
    let matchesSearch = true
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      matchesSearch =
        (call.service_call_id?.toString().toLowerCase().includes(query) ?? false) ||  
        (call.service_ticket?.ticket_id?.toLowerCase().includes(query) ?? false) ||  
        (call.customer?.name?.toLowerCase().includes(query) ?? false);  
      }

    return matchesFilter && matchesSearch
  })

  return (
    <div className="serv servcall">
      <div className="body-content-container">
        <div className="header">
          <div className="icon-container">
            <img src={ServiceCallIcon || "/placeholder.svg?height=24&width=24"} alt="Service Call" />
          </div>
          <div className="title-container">
            <h2>Service Call</h2>
            <p className="subtitle">Log and manage service calls with detailed customers and status tracking</p>
          </div>
        </div>

        <div className="divider"></div>

        <div className="content-scroll-area">
          <div className="search-filter-container">
            <div className="search-container">
              <img src={SearchIcon || "/placeholder.svg?height=16&width=16"} alt="Search" className="search-icon" />
              <input
                type="text"
                placeholder="Search or type a command (Ctrl + G)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
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
            serviceCalls={filteredCalls} 
            onRowClick={handleRowClick} 
            onViewDetails={handleViewDetails} 
            selectedCall={selectedCall}
          />

          <div className="update-container">
            <button 
              type="button" 
              className={`update-button ${selectedCall ? "clickable" : "disabled"}`}
              onClick={handleUpdateClick} 
              disabled={!selectedCall}
            >
              Update
            </button>
          </div>
        </div>
      </div>

      <GeneralWithContractModal
        isOpen={showWithContractModal}
        onClose={() => setShowWithContractModal(false)}
        onUpdate={handleUpdate}
        onShowResolution={handleShowResolution}
        callData={selectedCall}
      />

      <ResolutionModal
        isOpen={showResolutionModal}
        onClose={() => setShowResolutionModal(false)}
        onUpdate={handleUpdate}
        onShowGeneral={handleReturnToGeneral}
        onShowRequest={handleOpenReq}
        onShowRenewal={handleOpenRen}
        callData={selectedCall}
      />

      <ServiceRequestModal
        isOpen={showRequestModal}
        onClose={closeReqModal}
        onSubmit={handleSubmitReq}
        callData={selectedCall}
      />

      <RenewalModal
        isOpen={showRenewalModal}
        onClose={closeRenModal}
        onSubmit={handleSubmitRen}
        callData={selectedCall}
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

export default ServiceCall

