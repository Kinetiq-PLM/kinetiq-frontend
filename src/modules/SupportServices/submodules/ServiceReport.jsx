"use client"

import { useState, useEffect } from "react"
import "../styles/ServiceReport.css"
import "../styles/SupportServices.css"
import ServiceReportIcon from "/icons/SupportServices/ServiceReportIcon.png"
import CalendarFilterIcon from "/icons/SupportServices/CalendarFilterIcon.png"
import SearchIcon from "/icons/SupportServices/SearchIcon.png"
import Table from "../components/ServiceReport/Table"
import InputField from "../components/ServiceReport/InputField"
import UpdateReportModal from "../components/ServiceReport/UpdateReportModal"
import SubmitReportModal from "../components/ServiceReport/SubmitReportModal"

import { GET } from "../api/api"

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
  const [filterPeriod, setFilterPeriod] = useState("All Time")
  const [showFilterOptions, setShowFilterOptions] = useState(false)
  const [showFilterByOptions, setShowFilterByOptions] = useState(false)
  const [filterBy, setFilterBy] = useState("Filter by")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTicketStatus, setSelectedTicketStatus] = useState(null);

  // Modal states
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [selectedReport, setSelectedReport] = useState(null)

  const fetchReports = async () => {
    try {
      const data = await GET("service-reports/");
      setReports(data);
    } catch (error) {
      console.error("Error fetching reports:", error)
    }
  }

  useEffect(() => {
    fetchReports();
  }, []);

  // table row clicking func
  const handleRowClick = async (report) => {
    setSelectedReport(report);
    try {
      const data = await GET(`service-reports/${report.report_id}`); 
      console.log("Fetched data:", data);

      setTicketSubject(data.service_ticket?.ticketSubject || "");
      setDescription(data.description || ""); 
      setRequestType(data.request_type || "");
      setCustomerId(data.service_ticket?.customer?.customer_id || "");
      setRenewalId(data.renewal?.renewal_id || "");
      setName(data.service_ticket?.customer?.name || "");
      setBillingId(data.service_billing?.service_billing_id || "");

      setSelectedTicketStatus(data.service_ticket?.status || "");

    } catch (error) {
      console.error("Error fetching report details:", error);
    }
};

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

  const isWithinDays = (date, days) => {
    const reportDate = new Date(date);
    const today = new Date();
    const pastDate = new Date();
    pastDate.setDate(today.getDate() - days);
    return reportDate >= pastDate && reportDate <= today;
  };

  const filterOptions = [
    { value: "all", label: "All" },
    { value: "submitted", label: "Submitted" },
    { value: "draft", label: "Draft" },
    { value: "reviewed", label: "Reviewed" }
  ]

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
    searchQuery === "" ||
    report.report_id?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.service_ticket?.ticket_id?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.service_request?.service_request_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.service_call?.service_call_id?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (`${report.technician?.first_name ?? ""} ${report.technician?.last_name ?? ""}`
    .toLowerCase()
    .includes(searchQuery.toLowerCase()));

    if (filterBy !== "all") {
      if (filterBy === "submitted" && report.report_status !== "Submitted") return false;
      if (filterBy === "draft" && report.report_status !== "Draft") return false;
      if (filterBy === "reviewed" && report.report_status !== "Reviewed") return false;
    }

    if (filterPeriod !== "All Time") {
      if (filterPeriod === "Last 7 days" && !isWithinDays(report.submission_date, 7)) return false;
      if (filterPeriod === "Last 30 days" && !isWithinDays(report.submission_date, 30)) return false;
      if (filterPeriod === "Last 90 days" && !isWithinDays(report.submission_date, 90)) return false;
    }
  
    return matchesSearch;
  });

  

  return (
    <div className="serv service-report">
      <div className="body-content-container">
        <div className="header">
          <div className="icon-container">
            <img
              src={ServiceReportIcon || "/placeholder.svg?height=24&width=24"}
              alt="Service Report"
            />
          </div>  
          <div className="title-container">
              <h2>Service Report</h2>
              <p className="subtitle">Comprehensive Record of Completed Service Tasks and Actions</p>
          </div>
        </div>

        <div className="divider"></div>

        <div className="content-scroll-area">
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
            <div className="right-filters">
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
                  <div className="filter-option" onClick={() => handleFilterChange("All Time")}>All Time</div>
                  <div className="filter-option" onClick={() => handleFilterChange("Last 7 days")}>Last 7 days</div>
                  <div className="filter-option" onClick={() => handleFilterChange("Last 30 days")}>Last 30 days</div>
                  <div className="filter-option" onClick={() => handleFilterChange("Last 90 days")}>Last 90 days</div>
                </div>
              )}
            </div>

            <div className="filter-dropdown">
              <button className="filter-button" onClick={() => setShowFilterByOptions(!showFilterByOptions)}>
              {filterOptions.find(opt => opt.value === filterBy)?.label || "Filter by"}
                <span className="arrow">▼</span>
              </button>
              {showFilterByOptions && (
                <div className="filter-options">
                  {filterOptions.map((option) => (
                    <div key={option.value} className="filter-option" onClick={() => handleFilterByChange(option.value)}>
                      {option.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
            </div>
            
          </div>

          {/* Table Component */}
          <Table reports={filteredReports} onRowClick={handleRowClick}  />

          <div className="action-buttons">
          <button
              type="button"
              onClick={handleCloseTicket}
              className={`close-ticket-button ${selectedReport ? "clickable" : "disabled"}`}
              disabled={!selectedReport}
            >
              Close Ticket
            </button>
            <div className="right-buttons">
              <button 
                type="button" 
                className={`update-button ${selectedReport ? "clickable" : "disabled"}`}
                onClick={handleUpdate} 
                disabled={!selectedReport}
              >
                Update
              </button>
              <button className="add-button" onClick={handleSubmit}>
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

