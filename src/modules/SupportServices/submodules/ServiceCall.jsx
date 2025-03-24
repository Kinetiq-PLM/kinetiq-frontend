"use client"

import { useState, useEffect } from "react"
import "../styles/ServiceCall.css"
import ServiceCallIcon from "/icons/SupportServices/ServiceCall.png"
import SearchIcon from "/icons/SupportServices/SearchIcon.png"

const ServiceCall = () => {
  // State for search and filter
  const [searchQuery, setSearchQuery] = useState("")
  const [filterBy, setFilterBy] = useState("")
  const [showFilterOptions, setShowFilterOptions] = useState(false)
  const [serviceCalls, setServiceCalls] = useState([])

  // Fetch service calls from API (mock function)
  useEffect(() => {
    // Replace with d actual API call
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

  const filterOptions = [
    { value: "all", label: "All" },
    { value: "open", label: "Open" },
    { value: "closed", label: "Closed" },
    { value: "pending", label: "Pending" },
    { value: "high", label: "High Priority" },
    { value: "critical", label: "Critical Priority" },
  ]

  // Filter service calls based on selected filter
  const filteredServiceCalls = serviceCalls.filter((call) => {
    if (!filterBy || filterBy === "all") return true
    if (filterBy === "open" && call.status === "Open") return true
    if (filterBy === "closed" && call.status === "Closed") return true
    if (filterBy === "pending" && call.status === "Pending") return true
    if (filterBy === "high" && call.priority === "High") return true
    if (filterBy === "critical" && call.priority === "Critical") return true
    return false
  })

  const handleViewDetails = (callId) => {
    console.log(`View details for call ID: ${callId}`)
    // Implement d view details functionality
  }

  const handleUpdate = () => {
    console.log("Update button clicked")
    // Implement d update functionality
  }

  return (
    <div className="servcall">
      <div className="servcall-container">
        <div className="servcall-header">
          <div className="servcall-title">
            <div className="servcall-icon">
              <img src={ServiceCallIcon || "/placeholder.svg?height=24&width=24"} alt="Service Call" />
            </div>
            <div>
              <h1>Service Call</h1>
              <p>Log and manage service calls with detailed customers and status tracking</p>
            </div>
          </div>
          <div className="servcall-divider"></div>
        </div>

        <div className="servcall-content">
          <div className="servcall-search-filter">
            <div className="servcall-search">
              <input
                type="text"
                placeholder="Search or type a command (Ctrl + G)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <img
                src={SearchIcon || "/placeholder.svg?height=16&width=16"}
                alt="Search"
                className="servcall-search-icon"
              />
            </div>
            <div className="servcall-filter">
              <button className="servcall-filter-button" onClick={() => setShowFilterOptions(!showFilterOptions)}>
                Filter by {filterBy ? `: ${filterOptions.find((opt) => opt.value === filterBy)?.label}` : ""}
                <span className="servcall-chevron">▼</span>
              </button>
              {showFilterOptions && (
                <div className="servcall-filter-options">
                  {filterOptions.map((option) => (
                    <div
                      key={option.value}
                      className="servcall-filter-option"
                      onClick={() => handleFilterChange(option.value)}
                    >
                      {option.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="servcall-table-container">
            <table className="servcall-table">
              <thead>
                <tr>
                  <th>Call ID</th>
                  <th>Ticket ID</th>
                  <th>Customer Name</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredServiceCalls.map((call) => (
                  <tr key={call.callId}>
                    <td>{call.callId}</td>
                    <td>{call.ticketId}</td>
                    <td>{call.customerName}</td>
                    <td className={`servcall-priority-${call.priority.toLowerCase()}`}>{call.priority}</td>
                    <td>{call.status}</td>
                    <td>
                      <button className="servcall-view-button" onClick={() => handleViewDetails(call.callId)}>
                        View
                      </button>
                    </td>
                  </tr>
                ))}
                {/* Empty rows to fill d table */}
                {Array(5 - filteredServiceCalls.length)
                  .fill()
                  .map((_, index) => (
                    <tr key={`empty-${index}`} className="servcall-empty-row">
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

          <div className="servcall-actions">
            <button className="servcall-update-button" onClick={handleUpdate}>
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ServiceCall

