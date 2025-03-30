"use client"

import { useState, useEffect } from "react"
import "../styles/ServiceContract.css"
import ServiceContractIcon from "/icons/SupportServices/ServiceContractIcon.png"
import Table from "../components/ServiceContract/Table"
import UpdateViewModal from "../components/ServiceContract/UpdateViewModal"
import CreateContractModal from "../components/ServiceContract/CreateContractModal"
import SearchIcon from "/icons/SupportServices/SearchIcon.png"

const ServiceContract = () => {
  // State for contracts
  const [contracts, setContracts] = useState([])
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedContract, setSelectedContract] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterOption, setFilterOption] = useState("Filter by")
  const [showFilterOptions, setShowFilterOptions] = useState(false)

  // Fetch contracts from API (mock function)
  useEffect(() => {
    // Replace with actual API call
    const fetchContracts = async () => {
      try {
        // Updated mock data
        setContracts([
          {
            id: "SC-001",
            customerName: "ABC Corporation",
            productName: "Medical Scanner X1",
            startDate: "01/05/23",
            endDate: "01/05/24",
            status: "Active",
          },
          {
            id: "SC-002",
            customerName: "City Hospital",
            productName: "Patient Monitor Pro",
            startDate: "15/03/23",
            endDate: "15/03/25",
            status: "Active",
          },
          {
            id: "SC-003",
            customerName: "Metro Clinic",
            productName: "Diagnostic System",
            startDate: "10/06/23",
            endDate: "10/06/24",
            status: "Pending",
          },
          {
            id: "SC-004",
            customerName: "Health Center Inc.",
            productName: "Laboratory Equipment",
            startDate: "22/04/23",
            endDate: "22/04/24",
            status: "Expired",
          },
        ])
      } catch (error) {
        console.error("Error fetching contracts:", error)
      }
    }

    fetchContracts()
  }, [])

  // Handle view contract
  const handleViewContract = (contract) => {
    setSelectedContract(contract)
    setShowUpdateModal(true)
  }

  // Handle add new contract
  const handleAddContract = () => {
    setShowCreateModal(true)
  }

  // Handle update contract
  const handleUpdateContract = (contractData) => {
    console.log("Updating contract:", contractData)

    // Here you would typically make an API call to update the contract
    setShowUpdateModal(false)

    // Optionally refresh the contract list
    // fetchContracts()
  }

  // Handle create contract
  const handleCreateContract = (contractData) => {
    console.log("Creating contract:", contractData)

    // Here you would typically make an API call to create the contract
    setShowCreateModal(false)

    // Optionally refresh the contract list
    // fetchContracts()
  }

  // Handle filter selection
  const handleFilterSelect = (option) => {
    setFilterOption(option)
    setShowFilterOptions(false)
  }

  // Filter contracts based on search query and filter option
  const filteredContracts = contracts.filter((contract) => {
    // First apply the status filter if it's not "Filter by" or "All"
    if (filterOption !== "Filter by" && filterOption !== "All") {
      if (contract.status !== filterOption) {
        return false
      }
    }

    // Then apply the search query filter
    if (!searchQuery) return true

    return (
      contract.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.status.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  return (
    <div className="servcont">
      <div className="body-content-container">
        <div className="header">
          <div className="icon-container">
            <img src={ServiceContractIcon || "/placeholder.svg?height=24&width=24"} alt="Service Contract" />
          </div>
          <div className="title-container">
            <h2>Service Contract</h2>
            <p className="subtitle">Review and update service contracts</p>
          </div>
        </div>

        <div className="divider"></div>

        <div className="content-scroll-area">
          <div className="search-container">
            <div className="search-input-wrapper">
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
                {filterOption}
                <span className="arrow">▼</span>
              </button>
              <div className={`filter-options ${showFilterOptions ? "show" : ""}`}>
                <div className="filter-option" onClick={() => handleFilterSelect("Active")}>
                  Active
                </div>
                <div className="filter-option" onClick={() => handleFilterSelect("Pending")}>
                  Pending
                </div>
                <div className="filter-option" onClick={() => handleFilterSelect("Expired")}>
                  Expired
                </div>
                <div className="filter-option" onClick={() => handleFilterSelect("All")}>
                  All
                </div>
              </div>
            </div>
          </div>

          {/* Table Component */}
          <Table contracts={filteredContracts} onViewContract={handleViewContract} />

          <div className="buttons-container">
            <button className="update-button" onClick={() => setShowUpdateModal(true)}>
              Update
            </button>
            <button className="add-button" onClick={handleAddContract}>
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showUpdateModal && (
        <UpdateViewModal
          isOpen={showUpdateModal}
          onClose={() => setShowUpdateModal(false)}
          onUpdate={handleUpdateContract}
          contract={selectedContract}
        />
      )}

      {showCreateModal && (
        <CreateContractModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateContract}
        />
      )}
    </div>
  )
}

export default ServiceContract

