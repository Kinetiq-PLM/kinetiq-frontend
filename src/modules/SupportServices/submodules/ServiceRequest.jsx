"use client"

import { useState, useEffect } from "react"
import "../styles/ServiceRequest.css"
import ServiceRequestIcon from "/icons/SupportServices/ServiceRequestIcon.png"
import SearchIcon from "/icons/SupportServices/SearchIcon.png"
import Table from "../components/ServiceRequest/Table"
import UpdateViewModal from "../components/ServiceRequest/UpdateViewModal"

const ServiceRequest = () => {
  const [requests, setRequests] = useState([])
  const [filterBy, setFilterBy] = useState("")
  const [showFilterOptions, setShowFilterOptions] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState(null)

  // Fetch service requests from API (mock function)
  useEffect(() => {
    // Replace with actual API call
    const fetchRequests = async () => {
      try {
        // Mock data for demonstration
        setRequests([
          {
            id: "123",
            callId: "456",
            requestDate: "dd/mm/yy",
            customerName: "Paula Manalo",
            type: "Repair",
            status: "Pending",
          },
          {
            id: "124",
            callId: "789",
            requestDate: "dd/mm/yy",
            customerName: "Samantha Hospital",
            type: "Installation",
            status: "Approved",
          },
        ])
      } catch (error) {
        console.error("Error fetching service requests:", error)
      }
    }

    fetchRequests()
  }, [])

  const handleFilterChange = (value) => {
    setFilterBy(value)
    setShowFilterOptions(false)
  }

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleViewRequest = (request) => {
    setSelectedRequest(request)
    setShowUpdateModal(true)
  }

  const handleUpdateRequest = (updatedRequest) => {
    // Here will make an API call to update the request
    console.log("Updating request:", updatedRequest)

    // Update the local state
    const updatedRequests = requests.map((req) => (req.id === updatedRequest.id ? updatedRequest : req))
    setRequests(updatedRequests)
    setShowUpdateModal(false)
  }

  // Filter requests based on search query and selected filter
  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      searchQuery === "" ||
      request.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.customerName.toLowerCase().includes(searchQuery.toLowerCase())

    if (!filterBy || filterBy === "all") return matchesSearch
    if (filterBy === "pending" && request.status === "Pending") return matchesSearch
    if (filterBy === "approved" && request.status === "Approved") return matchesSearch
    if (filterBy === "repair" && request.type === "Repair") return matchesSearch
    if (filterBy === "installation" && request.type === "Installation") return matchesSearch
    return false
  })

  return (
    <div className="servrequ">
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
                onChange={handleSearch}
                className="search-input"
              />
              <img src={SearchIcon || "/placeholder.svg?height=16&width=16"} alt="Search" className="search-icon" />
            </div>

            <div className="filter-dropdown">
              <button className="filter-button" onClick={() => setShowFilterOptions(!showFilterOptions)}>
                Filter by
                <span className="arrow">▼</span>
              </button>
              {showFilterOptions && (
                <div className="filter-options">
                  <div className="filter-option" onClick={() => handleFilterChange("all")}>
                    All
                  </div>
                  <div className="filter-option" onClick={() => handleFilterChange("pending")}>
                    Pending
                  </div>
                  <div className="filter-option" onClick={() => handleFilterChange("approved")}>
                    Approved
                  </div>
                  <div className="filter-option" onClick={() => handleFilterChange("repair")}>
                    Repair
                  </div>
                  <div className="filter-option" onClick={() => handleFilterChange("installation")}>
                    Installation
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Table Component */}
          <Table requests={filteredRequests} onViewRequest={handleViewRequest} />

          <div className="update-container">
            <button type="button" className="update-button">
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
    </div>
  )
}

export default ServiceRequest

