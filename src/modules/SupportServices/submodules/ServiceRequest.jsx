"use client"

import { useState, useEffect } from "react"
import "../styles/ServiceRequest.css"
import ServiceRequestIcon from "/icons/SupportServices/ServiceRequestIcon.png"
import SearchIcon from "/icons/SupportServices/SearchIcon.png"

const ServiceRequest = () => {
  // State for search and filter
  const [searchQuery, setSearchQuery] = useState("")
  const [filterBy, setFilterBy] = useState("")
  const [showFilterOptions, setShowFilterOptions] = useState(false)
  const [serviceRequests, setServiceRequests] = useState([])

  // Fetch d service requests from API (mock function)
  useEffect(() => {
    // Replace ng actual API call
    const fetchServiceRequests = async () => {
      try {
        // Mock data for demo
        setServiceRequests([
          {
            requestId: "123",
            callId: "456",
            requestDate: "dd/mm/yy",
            customerName: "Paula Manalo",
            type: "Repair",
            status: "Pending",
          },
          {
            requestId: "124",
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

    fetchServiceRequests()
  }, [])

  const handleFilterChange = (value) => {
    setFilterBy(value)
    setShowFilterOptions(false)
  }

  const filterOptions = [
    { value: "all", label: "All" },
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
    { value: "repair", label: "Repair" },
    { value: "installation", label: "Installation" },
  ]

  // Filter service requests based on selected filter
  const filteredServiceRequests = serviceRequests.filter((request) => {
    if (!filterBy || filterBy === "all") return true
    if (filterBy === "pending" && request.status === "Pending") return true
    if (filterBy === "approved" && request.status === "Approved") return true
    if (filterBy === "rejected" && request.status === "Rejected") return true
    if (filterBy === "repair" && request.type === "Repair") return true
    if (filterBy === "installation" && request.type === "Installation") return true
    return false
  })

  const handleViewDetails = (requestId) => {
    console.log(`View details for request ID: ${requestId}`)
    // Implement d view details functionality
  }

  const handleUpdate = () => {
    console.log("Update button clicked")
    // Implement d update functionality
  }

  return (
    <div className="servrequ">
      <div className="servrequ-container">
        <div className="servrequ-header">
          <div className="servrequ-title">
            <div className="servrequ-icon">
              <img src={ServiceRequestIcon || "/placeholder.svg?height=24&width=24"} alt="Service Requests" />
            </div>
            <div>
              <h1>Service Requests</h1>
              <p>Review and update service requests</p>
            </div>
          </div>
          <div className="servrequ-divider"></div>
        </div>

        <div className="servrequ-content">
          <div className="servrequ-search-filter">
            <div className="servrequ-search">
              <input
                type="text"
                placeholder="Search or type a command (Ctrl + G)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <img
                src={SearchIcon || "/placeholder.svg?height=16&width=16"}
                alt="Search"
                className="servrequ-search-icon"
              />
            </div>
            <div className="servrequ-filter">
              <button className="servrequ-filter-button" onClick={() => setShowFilterOptions(!showFilterOptions)}>
                Filter by {filterBy ? `: ${filterOptions.find((opt) => opt.value === filterBy)?.label}` : ""}
                <span className="servrequ-chevron">▼</span>
              </button>
              {showFilterOptions && (
                <div className="servrequ-filter-options">
                  {filterOptions.map((option) => (
                    <div
                      key={option.value}
                      className="servrequ-filter-option"
                      onClick={() => handleFilterChange(option.value)}
                    >
                      {option.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="servrequ-table-container">
            <table className="servrequ-table">
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Call ID</th>
                  <th>Request Date</th>
                  <th>Customer Name</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredServiceRequests.map((request) => (
                  <tr key={request.requestId}>
                    <td>{request.requestId}</td>
                    <td>{request.callId}</td>
                    <td>{request.requestDate}</td>
                    <td>{request.customerName}</td>
                    <td>{request.type}</td>
                    <td>{request.status}</td>
                    <td>
                      <button className="servrequ-view-button" onClick={() => handleViewDetails(request.requestId)}>
                        View
                      </button>
                    </td>
                  </tr>
                ))}
                {/* Empty rows to fill the table */}
                {Array(10 - filteredServiceRequests.length)
                  .fill()
                  .map((_, index) => (
                    <tr key={`empty-${index}`} className="servrequ-empty-row">
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div className="servrequ-actions">
            <button className="servrequ-update-button" onClick={handleUpdate}>
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ServiceRequest

