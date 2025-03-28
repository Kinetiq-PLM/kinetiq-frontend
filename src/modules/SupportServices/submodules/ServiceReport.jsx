"use client"

import { useState, useEffect } from "react"
import "../styles/ServiceReport.css"
import ServiceReportIcon from "/icons/SupportServices/ServiceReportIcon.png"
import CalendarFilterIcon from "/icons/SupportServices/CalendarFilterIcon.png"
import SearchIcon from "/icons/SupportServices/SearchIcon.png"
import Table from "../components/ServiceReport/Table"
import InputField from "../components/ServiceReport/InputField"
import UpdateReportModal from "../components/ServiceReport/UpdateReportModal"
import SubmitReportModal from "../components/ServiceReport/SubmitReportModal"

const ServiceReport = () => {
  // State for form fields
  const [ticketSubject, setTicketSubject] = useState("")
  const [requestType, setRequestType] = useState("")
  const [customerId, setCustomerId] = useState("")
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [renewalId, setRenewalId] = useState("")
  const [billingId, setBillingId] = useState("")
  const [reports, setReports] = useState([])
  const [filterPeriod, setFilterPeriod] = useState("Last 30 days")
  const [showFilterOptions, setShowFilterOptions] = useState(false)
  const [showFilterByOptions, setShowFilterByOptions] = useState(false)
  const [filterBy, setFilterBy] = useState("Filter by")

  // Modal states
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [selectedReport, setSelectedReport] = useState(null)

  // Fetch reports from API (mock function)
  useEffect(() => {
    // Replace with actual API call
    const fetchReports = async () => {
      try {
        // Mock data for demonstration
        setReports([
          {
            reportId: "SR-2023-001",
            ticketId: "TK-4872",
            requestId: "REQ-9283",
            callId: "CALL-5621",
            technicianName: "Edrill Baylan",
            submissionDate: "2025-03-20",
            status: "Submitted",
          },
          {
            reportId: "SR-2023-002",
            ticketId: "TK-4873",
            requestId: "REQ-9284",
            callId: "CALL-5622",
            technicianName: "Nicole Jokic",
            submissionDate: "2025-03-21",
            status: "Submitted",
          },
          {
            reportId: "SR-2023-003",
            ticketId: "TK-4875",
            requestId: "REQ-9286",
            callId: "CALL-5624",
            technicianName: "Michael Chen",
            submissionDate: "2025-03-22",
            status: "Draft",
          },
          {
            reportId: "SR-2023-004",
            ticketId: "TK-4878",
            requestId: "REQ-9290",
            callId: "CALL-5628",
            technicianName: "Sarah Johnson",
            submissionDate: "2025-03-23",
            status: "Pending",
          },
          {
            reportId: "SR-2023-005",
            ticketId: "TK-4880",
            requestId: "REQ-9292",
            callId: "CALL-5630",
            technicianName: "David Rodriguez",
            submissionDate: "2025-03-24",
            status: "Submitted",
          },
        ])
      } catch (error) {
        console.error("Error fetching reports:", error)
      }
    }

    fetchReports()
  }, [])

  // Handle update report
  const handleUpdate = () => {
    setSelectedReport({
      ticketId: "",
      requestId: "",
      requestType: "",
      renewalId: "",
      billingId: "",
      description: "",
      status: "",
    })
    setShowUpdateModal(true)
  }

  // Handle submit report
  const handleSubmit = () => {
    setSelectedReport({
      ticketId: "",
      requestId: "",
      requestType: "",
      renewalId: "",
      billingId: "",
      description: "",
      status: "",
    })
    setShowSubmitModal(true)
  }

  // Handle update from modal
  const handleUpdateReport = (reportData) => {
    console.log("Updating report:", reportData)
    setShowUpdateModal(false)
  }

  // Handle submit from modal
  const handleSubmitReport = (reportData) => {
    console.log("Submitting report:", reportData)
    setShowSubmitModal(false)
  }

  // Handle close ticket
  const handleCloseTicket = () => {
    console.log("Closing ticket")
  }

  // Handle filter change
  const handleFilterChange = (value) => {
    setFilterPeriod(value)
    setShowFilterOptions(false)
  }

  // Handle filter by change
  const handleFilterByChange = (value) => {
    setFilterBy(value)
    setShowFilterByOptions(false)
  }

  return (
    <div className="service-report">
      <div className="report-container">
        <div className="report-header">
          <div className="header-icon-title">
            <img
              src={ServiceReportIcon || "/placeholder.svg?height=24&width=24"}
              alt="Service Report"
              className="header-icon"
            />
            <div className="header-title">
              <h2>Service Report</h2>
              <p className="subtitle">Comprehensive Record of Completed Service Tasks and Actions</p>
            </div>
          </div>
        </div>

        <div className="report-divider"></div>

        <div className="report-content">
          {/* Input Fields Component */}
          <InputField
            ticketSubject={ticketSubject}
            setTicketSubject={setTicketSubject}
            requestType={requestType}
            setRequestType={setRequestType}
            customerId={customerId}
            setCustomerId={setCustomerId}
            name={name}
            setName={setName}
            description={description}
            setDescription={setDescription}
            renewalId={renewalId}
            setRenewalId={setRenewalId}
            billingId={billingId}
            setBillingId={setBillingId}
          />

          <div className="filter-container">
            <div className="search-box">
              <img src={SearchIcon || "/placeholder.svg?height=16&width=16"} alt="Search" className="search-icon" />
              <input type="text" placeholder="Search or type a command (Ctrl + G)" />
            </div>

            <div className="filter-dropdown">
              <button className="filter-button" onClick={() => setShowFilterOptions(!showFilterOptions)}>
                <img
                  src={CalendarFilterIcon || "/placeholder.svg?height=16&width=16"}
                  alt="Calendar"
                  className="filter-icon"
                />
                {filterPeriod}
                <span className="arrow">▼</span>
              </button>
              {showFilterOptions && (
                <div className="filter-options">
                  <div className="filter-option" onClick={() => handleFilterChange("Last 7 days")}>
                    Last 7 days
                  </div>
                  <div className="filter-option" onClick={() => handleFilterChange("Last 30 days")}>
                    Last 30 days
                  </div>
                  <div className="filter-option" onClick={() => handleFilterChange("Last 90 days")}>
                    Last 90 days
                  </div>
                </div>
              )}
            </div>

            <div className="filter-dropdown">
              <button className="filter-button" onClick={() => setShowFilterByOptions(!showFilterByOptions)}>
                {filterBy}
                <span className="arrow">▼</span>
              </button>
              {showFilterByOptions && (
                <div className="filter-options">
                  <div className="filter-option" onClick={() => handleFilterByChange("All Reports")}>
                    All Reports
                  </div>
                  <div className="filter-option" onClick={() => handleFilterByChange("Submitted")}>
                    Submitted
                  </div>
                  <div className="filter-option" onClick={() => handleFilterByChange("Draft")}>
                    Draft
                  </div>
                  <div className="filter-option" onClick={() => handleFilterByChange("Pending")}>
                    Pending
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Table Component */}
          <Table reports={reports} />

          <div className="action-buttons">
            <button className="close-ticket-button" onClick={handleCloseTicket}>
              Close Ticket
            </button>
            <div className="right-buttons">
              <button className="action-button" onClick={handleUpdate}>
                Update
              </button>
              <button className="action-button" onClick={handleSubmit}>
                Submit Report
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <UpdateReportModal
        isOpen={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        onUpdate={handleUpdateReport}
        report={selectedReport}
      />

      <SubmitReportModal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        onSubmit={handleSubmitReport}
        report={selectedReport}
      />
    </div>
  )
}

export default ServiceReport

