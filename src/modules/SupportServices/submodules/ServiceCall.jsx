"use client"

import { useState, useEffect } from "react"
import "../styles/ServiceCall.css"
import ServiceCallIcon from "/icons/SupportServices/ServiceCallIcon.png"
import Table from "../components/ServiceCall/Table"
import GeneralNoContractModal from "../components/ServiceCall/GeneralNoContractModal"
import GeneralWithContractModal from "../components/ServiceCall/GeneralWithContractModal"
import ResolutionModal from "../components/ServiceCall/ResolutionModal"
import SearchIcon from "/icons/SupportServices/SearchIcon.png"

const ServiceCall = () => {
  // State for service calls
  const [serviceCalls, setServiceCalls] = useState([])
  const [filterBy, setFilterBy] = useState("")
  const [showFilterOptions, setShowFilterOptions] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Modal states
  const [showNoContractModal, setShowNoContractModal] = useState(false)
  const [showWithContractModal, setShowWithContractModal] = useState(false)
  const [showResolutionModal, setShowResolutionModal] = useState(false)
  const [selectedCall, setSelectedCall] = useState(null)
  const [lastGeneralModalType, setLastGeneralModalType] = useState(null) // Track which general modal was last open

  // Fetch service calls from API (mock function)
  useEffect(() => {
    // Replace with actual API call
    const fetchServiceCalls = async () => {
      try {
        // Mock data for demonstration
        setServiceCalls([
          {
            callId: "123",
            ticketId: "456",
            customerName: "Paula Manalo",
            priority: "High",
            status: "Open",
          },
          {
            callId: "124",
            ticketId: "789",
            customerName: "Samantha Hospital",
            priority: "Critical",
            status: "Open",
          },
        ])
      } catch (error) {
        console.error("Error fetching service calls:", error)
      }
    }

    fetchServiceCalls()
  }, [])

  const handleFilterChange = (value) => {
    setFilterBy(value)
    setShowFilterOptions(false)
  }

  const handleViewDetails = (call) => {
    setSelectedCall(call)
    // Determine which modal to show based on contract status
    // For demo purposes, we'll use a simple rule: even callIds have contracts
    if (Number.parseInt(call.callId) % 2 === 0) {
      setShowWithContractModal(true)
      setLastGeneralModalType("withContract")
    } else {
      setShowNoContractModal(true)
      setLastGeneralModalType("noContract")
    }
  }

  const handleUpdate = (callData) => {
    console.log("Updating service call:", callData)
    // Here you would typically make an API call to update the call

    // Close all modals
    setShowNoContractModal(false)
    setShowWithContractModal(false)
    setShowResolutionModal(false)

    // Refresh the call list
    // fetchServiceCalls()
  }

  const handleShowResolution = () => {
    // Close the current modal and open the resolution modal
    setShowNoContractModal(false)
    setShowWithContractModal(false)
    setShowResolutionModal(true)
  }

  const handleReturnToGeneral = () => {
    // Close resolution modal and reopen the appropriate general modal
    setShowResolutionModal(false)
    if (lastGeneralModalType === "withContract") {
      setShowWithContractModal(true)
    } else {
      setShowNoContractModal(true)
    }
  }

  const filterOptions = [
    { value: "all", label: "All" },
    { value: "open", label: "Open" },
    { value: "closed", label: "Closed" },
    { value: "high", label: "High Priority" },
    { value: "critical", label: "Critical Priority" },
  ]

  // Filter service calls based on selected filter and search query
  const filteredCalls = serviceCalls.filter((call) => {
    // Filter by status/priority
    let matchesFilter = true
    if (filterBy === "open" && call.status !== "Open") matchesFilter = false
    if (filterBy === "closed" && call.status !== "Closed") matchesFilter = false
    if (filterBy === "high" && call.priority !== "High") matchesFilter = false
    if (filterBy === "critical" && call.priority !== "Critical") matchesFilter = false

    // Filter by search query
    let matchesSearch = true
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      matchesSearch =
        call.callId.toLowerCase().includes(query) ||
        call.ticketId.toLowerCase().includes(query) ||
        call.customerName.toLowerCase().includes(query)
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
          <Table serviceCalls={filteredCalls} onViewDetails={handleViewDetails} />

          <div className="update-container">
            <button type="button" className="update-button">
              Update
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <GeneralNoContractModal
        isOpen={showNoContractModal}
        onClose={() => setShowNoContractModal(false)}
        onUpdate={handleUpdate}
        onShowResolution={handleShowResolution}
        callData={selectedCall}
      />

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

