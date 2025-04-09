"use client"

import { useState, useEffect } from "react"
import "../styles/ServiceContract.css"
import ServiceContractIcon from "/icons/SupportServices/ServiceContractIcon.png"
import Table from "../components/ServiceContract/Table"
import UpdateViewModal from "../components/ServiceContract/UpdateViewModal"
import CreateContractModal from "../components/ServiceContract/CreateContractModal"
import SearchIcon from "/icons/SupportServices/SearchIcon.png"

import { GET } from "../api/api"
import { PATCH } from "../api/api"
import { POST } from "../api/api"

const ServiceContract = () => {
  // State for contracts
  const [contracts, setContracts] = useState([])
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedContract, setSelectedContract] = useState(null)
  const [filterBy, setFilterBy] = useState("")
  const [showFilterOptions, setShowFilterOptions] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const fetchContracts = async () => {
    try {
      const data = await GET("service-contracts/");
      setContracts(data);
    } catch (error) {
      console.error("Error fetching contracts:", error)
    }
  }

  useEffect(() => {
    fetchContracts();
  }, []);

   // table row clicking func
   const handleRowClick = (contract) => {
    setSelectedContract(contract)
  };

  const handleUpdateClick = () => {
    if (selectedContract) {
      setShowUpdateModal(true); // Open modal
    }
  }

  const handleFilterChange = (value) => {
    setFilterBy(value)
    setShowFilterOptions(false)
  }

  const filterOptions = [
    { value: "all", label: "All" },
    { value: "pending", label: "Pending" },
    { value: "active", label: "Active" },
    { value: "terminated", label: "Terminated" }
  ]

  // Filter requests based on search query and selected filter
  const filteredContracts = contracts.filter((contract) => {
    const matchesSearch =
      searchQuery === "" ||
      (contract.contract_id?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      (contract.product?.product_name?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      (contract.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
  
    if (!filterBy || filterBy === "all") return matchesSearch;
  
    const matchesStatus = 
      (filterBy === "pending" && contract.contract_status === "Pending") ||
      (filterBy === "active" && contract.contract_status === "Active") ||
      (filterBy === "expired" && contract.contract_status === "Expired") ||
      (filterBy === "terminated" && contract.contract_status === "Terminated");

    return matchesSearch && (matchesStatus);
  });

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
  const handleUpdateContract = async (contractData) => {
    const contractId = contractData.contract_id;
    if (!contractId) {
      console.error("Error: contract_id is undefined");
      return;
    }
    console.log("Updating contract:", contractData)

    try {
      await PATCH(`update-contract/${contractId}/`, contractData);
      setShowUpdateModal(false);
      fetchContracts();
    } catch (error) {
        console.error("Error updating service contract:", error.message);
    }
  }

  // Handle create contract
  const handleCreateContract = async (contractData) => {
    console.log("Creating contract:", contractData)
    try {
      const data = await POST("/service-contracts/", contractData);
      console.log("Contract created successfully:", data);
      setShowCreateModal(false);
      fetchContracts();
    } catch (error) {
        console.error("Error submitting contract:", error.message);
    }
  }


  return (
    <div className="serv servcont">
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
            contracts={filteredContracts} 
            onRowClick={handleRowClick} 
            onViewContract={handleViewContract} 
            selectedContract={selectedContract}
          />

          <div className="buttons-container">
            <button 
              type="button" 
              className={`update-button ${selectedContract ? "clickable" : "disabled"}`}
              onClick={handleUpdateClick}
              disabled={!selectedContract}
            >
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

