"use client"

import { useState, useEffect } from "react"
import "../styles/ServiceCall.css"
import ServiceCallIcon from "/icons/SupportServices/ServiceCallIcon.png"
import Table from "../components/ServiceCall/Table"
import GeneralNoContractModal from "../components/ServiceCall/GeneralNoContractModal"
import GeneralWithContractModal from "../components/ServiceCall/GeneralWithContractModal"
import ResolutionModal from "../components/ServiceCall/ResolutionModal"
import SearchIcon from "/icons/SupportServices/SearchIcon.png"

import { GET } from "../api/api"
import { PATCH } from "../api/api"

const ServiceCall = () => {
  // State for service calls
  const [serviceCalls, setServiceCalls] = useState([])
  const [filterBy, setFilterBy] = useState("")
  const [showFilterOptions, setShowFilterOptions] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Modal states
  const [showWithContractModal, setShowWithContractModal] = useState(false)
  const [showResolutionModal, setShowResolutionModal] = useState(false)
  const [selectedCall, setSelectedCall] = useState(null)

  // Fetch service calls from API (mock function)
  useEffect(() => {
    const fetchServiceCalls = async () => {
      try {
        const data = await GET("service-calls/");
        setServiceCalls(data);
      } catch (error) {
        console.error("Error fetching service calls:", error)
      }
    }

    fetchServiceCalls()
  }, [refreshTrigger])

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
      await PATCH(`/service-calls/${serviceCallId}/update/`, updatedData);
      setShowWithContractModal(false);
      setShowResolutionModal(false);
      setRefreshTrigger((prev) => prev + 1);
  } catch (error) {
      console.error("Error updating service call:", error.message);
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
    <div className="servcall">
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
                Filter by
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
          <Table serviceCalls={filteredCalls} onRowClick={handleRowClick} onViewDetails={handleViewDetails} />

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
        callData={selectedCall}
      />
    </div>
  )
}

export default ServiceCall

