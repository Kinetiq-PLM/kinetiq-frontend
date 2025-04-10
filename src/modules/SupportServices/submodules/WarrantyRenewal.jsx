"use client"

import { useState, useEffect } from "react"
import "../styles/WarrantyRenewal.css"
import "../styles/SupportServices.css"
import ServiceCallIcon from "/icons/SupportServices/ServiceCallIcon.png"
import Table from "../components/WarrantyRenewal/Table"
import UpdateViewModal from "../components/WarrantyRenewal/UpdateViewModal"
import SearchIcon from "/icons/SupportServices/SearchIcon.png"

import { GET } from "../api/api"
import { PATCH } from "../api/api"

const WarrantyRenewal = () => {
  // State for service calls
  const [renewals, setRenewals] = useState([])
  const [searchQuery, setSearchQuery] = useState("")

  // Modal states
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [selectedRenewal, setSelectedRenewal] = useState(null)

  // Fetch service calls from API (mock function)
  const fetchServiceRenewals = async () => {
    try {
      const data = await GET("warranty-renewals/");
      setRenewals(data);
    } catch (error) {
      console.error("Error fetching renewals:", error)
    }
  }

  useEffect(() => {
    fetchServiceRenewals();
  }, []);

  // table row clicking func
  const handleRowClick = (renewal) => {
    setSelectedRenewal(renewal)
  };

  const handleUpdateClick = () => {
    if (selectedRenewal) {
      setShowUpdateModal(true); // Open modal
    }
  }

  const handleUpdate = async (updatedData) => {
    const renewalId = updatedData.renewal_id;
    if (!renewalId) {
      console.error("Error: renewal_id is undefined");
      return;
    }
    console.log("Updating renewal with:", updatedData);

    try {
      await PATCH(`/renewal/${renewalId}/update/`, updatedData);
      setShowUpdateModal(false);
      fetchServiceRenewals();
  } catch (error) {
      console.error("Error updating renewal:", error.message);
  }
  }

  // Filter service calls based on selected filter and search query
  const filteredRenewals = renewals.filter((renewal) => {
    // Filter by search query
    let matchesSearch = true
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      matchesSearch =
        (renewal.renewal_id?.toString().toLowerCase().includes(query) ?? false) ||  
        (renewal.service_call?.service_call_id?.toLowerCase().includes(query) ?? false) ||  
        (renewal.contract?.contract_id?.toLowerCase().includes(query) ?? false);  
      }

    return matchesSearch
  })

  return (
    <div className="serv renew">
      <div className="body-content-container">
        <div className="header">
          <div className="icon-container">
            <img src={ServiceCallIcon || "/placeholder.svg?height=24&width=24"} alt="Service Call" /> 
          </div>
          <div className="title-container">
            <h2>Warranty Renewal</h2>
            <p className="subtitle">Manage and update warranty renewal services</p>
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
          </div>

          {/* Table Component */}
          <Table 
            renewals={filteredRenewals} 
            onRowClick={handleRowClick} 
            selectedRenewal={selectedRenewal}
          />

          <div className="update-container">
            <button 
              type="button" 
              className={`update-button ${selectedRenewal ? "clickable" : "disabled"}`}
              onClick={handleUpdateClick} 
              disabled={!selectedRenewal}
            >
              Update
            </button>
          </div>
        </div>
      </div>

      <UpdateViewModal
        isOpen={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        onUpdate={handleUpdate}
        renewalData={selectedRenewal}
      />
    </div>
  )
}

export default WarrantyRenewal

