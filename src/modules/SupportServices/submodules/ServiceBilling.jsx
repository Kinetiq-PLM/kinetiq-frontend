"use client"

import { useState, useEffect } from "react"
import "../styles/ServiceBilling.css"
import ServiceBillingIcon from "/icons/SupportServices/ServiceBillingIcon.svg"
import Table from "../components/ServiceBilling/Table"
import UpdateViewModal from "../components/ServiceBilling/UpdateViewModal"
import CreateBillingModal from "../components/ServiceBilling/CreateBillingModal"
import SearchIcon from "/icons/SupportServices/SearchIcon.png"

import { GET } from "../api/api"
import { PATCH } from "../api/api"
import { POST } from "../api/api"

const ServiceBilling = ({employee_id}) => {
  // State for contracts
  const [billings, setBillings] = useState([])
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedBilling, setSelectedBilling] = useState(null)
  const [filterBy, setFilterBy] = useState("")
  const [showFilterOptions, setShowFilterOptions] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [errorModalMessage, setErrorModalMessage] = useState("")

  const fetchBillings = async () => {
    try {
      // this filters out billings so that only the service billings assigned to the one currently logged in will show:
      // const data = await GET(`billing/billings/technician/HR-EMP-2025-8d9f9b/`);
      const data = await GET(`billing/billings/technician/${employee_id}/`);

      // all billings version:
      // const data = await GET("billing/");
      setBillings(data);
    } catch (error) {
      console.error("Error fetching billings:", error)
    }
  }

  useEffect(() => {
    fetchBillings();
  }, []);

   // table row clicking func
   const handleRowClick = (billing) => {
    setSelectedBilling(billing)
  };

  const handleUpdateClick = () => {
    if (selectedBilling) {
      setShowUpdateModal(true); // Open modal
    }
  }

  const handleFilterChange = (value) => {
    setFilterBy(value)
    setShowFilterOptions(false)
  }

  const filterOptions = [
    { value: "all", label: "All" },
    { value: "paid", label: "Paid" },
    { value: "unpaid", label: "Unpaid" }
  ]

  // Filter requests based on search query and selected filter
  const filteredBillings = billings.filter((billing) => {
    const matchesSearch =
      searchQuery === "" ||
      (billing.service_billing_id?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      (
        billing.service_request?.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        billing.renewal?.service_call?.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
  
    if (!filterBy || filterBy === "all") return matchesSearch;
  
    const matchesStatus = 
      (filterBy === "paid" && billing.billing_status === "Paid") ||
      (filterBy === "unpaid" && billing.billing_status === "Unpaid");

    return matchesSearch && (matchesStatus);
  });

  // Handle view contract
  const handleViewBilling = (billing) => {
    setSelectedBilling(billing)
    setShowUpdateModal(true)
  }

  // Handle add new contract
  const handleAddContract = () => {
    setShowCreateModal(true)
  }

  // Handle update contract
  const handleUpdateBilling = async (billingData) => {
    const billingId = billingData.service_billing_id;
    if (!billingId) {
      console.error("Error: service_billing_id is undefined");
      return;
    }
    console.log("Updating billing:", billingData)

    try {
      await PATCH(`billing/${billingId}/`, billingData);
      setShowUpdateModal(false);
      fetchBillings();
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
        console.error("Error updating billing:", error.message);
        setErrorModalMessage(firstError); 
        setShowErrorModal(true);  
    }
  }

  // Handle create contract
  const handleCreateBilling = async (billingData) => {
    console.log("Creating billing:", billingData)
    try {
      const data = await POST("billing/", billingData);
      console.log("Service billing created successfully:", data);
      setShowCreateModal(false);
      fetchBillings();
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
        console.error("Error submitting service billing:", error.message);
        setErrorModalMessage(firstError); 
        setShowErrorModal(true);  
    }
  }

  return (
    <div className="serv billing">
      <div className="body-content-container">
        <div className="header">
          <div className="icon-container">
            <img src={ServiceBillingIcon || "/placeholder.svg?height=24&width=24"} alt="Service Billing" />
          </div>
          <div className="title-container">
            <h2>Service Billing</h2>
            <p className="subtitle">Log and update service billings</p>
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
            billings={filteredBillings} 
            onRowClick={handleRowClick} 
            onViewBilling={handleViewBilling} 
            selectedBilling={selectedBilling}
          />

          <div className="buttons-container">
            <button 
              type="button" 
              className={`update-button ${selectedBilling ? "clickable" : "disabled"}`}
              onClick={handleUpdateClick}
              disabled={!selectedBilling}
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
          onUpdate={handleUpdateBilling}
          billing={selectedBilling}
          technician={employee_id}
        />
      )}

      {showCreateModal && (
        <CreateBillingModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateBilling}
          technician={employee_id}
        />
      )}

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

export default ServiceBilling

