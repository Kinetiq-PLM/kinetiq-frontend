"use client"

import { useState, useEffect } from "react"
import "../styles/ServiceContract.css"
import ServiceContractIcon from "/icons/SupportServices/ServiceContractIcon.png"
import SearchIcon from "/icons/SupportServices/SearchIcon.png"

const ServiceContract = () => {
  // State for search and filter
  const [searchQuery, setSearchQuery] = useState("")
  const [filterBy, setFilterBy] = useState("")
  const [showFilterOptions, setShowFilterOptions] = useState(false)
  const [serviceContracts, setServiceContracts] = useState([])

  // Fetch service contracts from API (mock function)
  useEffect(() => {
    // Replace with actual API call
    const fetchServiceContracts = async () => {
      try {
        // Mock data for demo
        setServiceContracts([
          {
            contractId: "123",
            customerId: "456",
            customerName: "JM Fernandez",
            startDate: "dd/mm/yy",
            endDate: "dd/mm/yy",
            status: "Pending",
          },
          {
            contractId: "124",
            customerId: "789",
            customerName: "Xairyl Sison",
            startDate: "dd/mm/yy",
            endDate: "dd/mm/yy",
            status: "Approved",
          },
        ])
      } catch (error) {
        console.error("Error fetching service contracts:", error)
      }
    }

    fetchServiceContracts()
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
  ]

  // Filter service contracts based on selected filter
  const filteredServiceContracts = serviceContracts.filter((contract) => {
    if (!filterBy || filterBy === "all") return true
    if (filterBy === "pending" && contract.status === "Pending") return true
    if (filterBy === "approved" && contract.status === "Approved") return true
    if (filterBy === "rejected" && contract.status === "Rejected") return true
    return false
  })

  const handleViewDetails = (contractId) => {
    console.log(`View details for contract ID: ${contractId}`)
    // Implement the view details functionality
  }

  const handleAdd = () => {
    console.log("Add button clicked")
    // Implement the add functionality
  }

  const handleUpdate = () => {
    console.log("Update button clicked")
    // Implement the update functionality
  }

  return (
    <div className="servcont">
      <div className="servcont-container">
        <div className="servcont-header">
          <div className="servcont-title">
            <div className="servcont-icon">
              <img src={ServiceContractIcon || "/placeholder.svg?height=24&width=24"} alt="Service Contracts" />
            </div>
            <div>
              <h1>Service Contract</h1>
              <p>Review and update service contracts</p>
            </div>
          </div>
          <div className="servcont-divider"></div>
        </div>

        <div className="servcont-content">
          <div className="servcont-search-filter">
            <div className="servcont-search">
              <input
                type="text"
                placeholder="Search or type a command (Ctrl + G)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <img
                src={SearchIcon || "/placeholder.svg?height=16&width=16"}
                alt="Search"
                className="servcont-search-icon"
              />
            </div>
            <div className="servcont-filter">
              <button className="servcont-filter-button" onClick={() => setShowFilterOptions(!showFilterOptions)}>
                Filter by {filterBy ? `: ${filterOptions.find((opt) => opt.value === filterBy)?.label}` : ""}
                <span className="servcont-chevron">▼</span>
              </button>
              {showFilterOptions && (
                <div className="servcont-filter-options">
                  {filterOptions.map((option) => (
                    <div
                      key={option.value}
                      className="servcont-filter-option"
                      onClick={() => handleFilterChange(option.value)}
                    >
                      {option.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="servcont-table-container">
            <table className="servcont-table">
              <thead>
                <tr>
                  <th>Contract ID</th>
                  <th>Customer ID</th>
                  <th>Customer Name</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Status</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredServiceContracts.map((contract) => (
                  <tr key={contract.contractId}>
                    <td>{contract.contractId}</td>
                    <td>{contract.customerId}</td>
                    <td>{contract.customerName}</td>
                    <td>{contract.startDate}</td>
                    <td>{contract.endDate}</td>
                    <td>{contract.status}</td>
                    <td>
                      <button className="servcont-view-button" onClick={() => handleViewDetails(contract.contractId)}>
                        View
                      </button>
                    </td>
                  </tr>
                ))}
                {/* Empty rows to fill the table */}
                {Array(10 - filteredServiceContracts.length)
                  .fill()
                  .map((_, index) => (
                    <tr key={`empty-${index}`} className="servcont-empty-row">
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

          <div className="servcont-actions">
            <button className="servcont-add-button" onClick={handleAdd}>
              Add
            </button>
            <button className="servcont-update-button" onClick={handleUpdate}>
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ServiceContract

