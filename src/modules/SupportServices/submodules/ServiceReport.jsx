"use client"

import { useState, useEffect } from "react"
import "../styles/ServiceReport.css"
import ServiceReportIcon from "/icons/SupportServices/ServiceReportIcon.png"
import GeneralIcon from "/icons/SupportServices/GeneralIcon.png"
import SearchIcon from "/icons/SupportServices/SearchIcon.png"
import CalendarFilterIcon from "/icons/SupportServices/CalendarFilterIcon.png"
import CalendarInputIcon from "/icons/SupportServices/CalendarInputIcon.png"

const ServiceReport = () => {
  // State for customer information
  const [customerInfo, setCustomerInfo] = useState({
    customerId: "",
    name: "",
    email: "",
    callId: "",
    contractNo: "",
    terminationDate: "",
  })

  // State for search and filter
  const [searchQuery, setSearchQuery] = useState("")
  const [filterBy, setFilterBy] = useState("")
  const [showFilterOptions, setShowFilterOptions] = useState(false)
  const [dateFilter, setDateFilter] = useState("Last 30 days")
  const [showDateOptions, setShowDateOptions] = useState(false)
  const [serviceReports, setServiceReports] = useState([])

  // Fetch service reports from API (mock function)
  useEffect(() => {
    // Replace with actual API call
    const fetchServiceReports = async () => {
      try {
        // Mock data for demo
        setServiceReports([
          {
            reportId: "SR001",
            serviceCall: "SC123",
            serviceBilling: "SB456",
            technicianId: "T001",
            description: "Routine maintenance",
            billingAmount: "$150.00",
            status: "Completed",
            submissionDate: "15/03/2023",
          },
          {
            reportId: "SR002",
            serviceCall: "SC124",
            serviceBilling: "SB457",
            technicianId: "T002",
            description: "Emergency repair",
            billingAmount: "$250.00",
            status: "Pending",
            submissionDate: "20/03/2023",
          },
        ])
      } catch (error) {
        console.error("Error fetching service reports:", error)
      }
    }

    fetchServiceReports()
  }, [])

  const handleFilterChange = (value) => {
    setFilterBy(value)
    setShowFilterOptions(false)
  }

  const handleDateFilterChange = (value) => {
    setDateFilter(value)
    setShowDateOptions(false)
  }

  const filterOptions = [
    { value: "all", label: "All" },
    { value: "completed", label: "Completed" },
    { value: "pending", label: "Pending" },
    { value: "cancelled", label: "Cancelled" },
  ]

  const dateOptions = [
    { value: "last30", label: "Last 30 days" },
    { value: "last60", label: "Last 60 days" },
    { value: "last90", label: "Last 90 days" },
    { value: "thisYear", label: "This year" },
  ]

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setCustomerInfo({
      ...customerInfo,
      [name]: value,
    })
  }

  const handleCloseTicket = () => {
    console.log("Close Ticket clicked")
    // Implement close ticket functionality
  }

  const handleSendToAccounting = () => {
    console.log("Send to Accounting clicked")
    // Implement send to accounting functionality
  }

  const handleCancel = () => {
    console.log("Cancel clicked")
    // Implement cancel functionality
  }

  const handleUpdate = () => {
    console.log("Update clicked")
    // Implement update functionality
  }

  return (
    <div className="servrepo">
      <div className="servrepo-container">
        <div className="servrepo-header">
          <div className="servrepo-title">
            <div className="servrepo-icon">
              <img src={ServiceReportIcon || "/placeholder.svg?height=24&width=24"} alt="Service Report" />
            </div>
            <div>
              <h1>Service Report</h1>
              <p>Comprehensive Record of Completed Service Tasks and Actions</p>
            </div>
          </div>
          <div className="servrepo-divider"></div>
        </div>

        <div className="servrepo-content">
          {/* Customer Information Form */}
          <div className="servrepo-form">
            <div className="servrepo-form-row">
              <div className="servrepo-form-group">
                <label>
                  Customer ID<span className="required">*</span>
                </label>
                <div className="servrepo-select-wrapper">
                  <input
                    type="text"
                    name="customerId"
                    value={customerInfo.customerId}
                    onChange={handleInputChange}
                    placeholder="CID#89423"
                    readOnly
                  />
                  <span className="servrepo-select-arrow">▼</span>
                </div>
              </div>
              <div className="servrepo-form-group">
                <label>
                  Call ID<span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="callId"
                  value={customerInfo.callId}
                  onChange={handleInputChange}
                  placeholder="1321"
                />
              </div>
            </div>
            <div className="servrepo-form-row">
              <div className="servrepo-form-group">
                <label>
                  Name<span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={customerInfo.name}
                  onChange={handleInputChange}
                  placeholder="Paula Manglo"
                />
              </div>
              <div className="servrepo-form-group">
                <label>
                  Contract No<span className="required">*</span>
                </label>
                <div className="servrepo-select-wrapper">
                  <input
                    type="text"
                    name="contractNo"
                    value={customerInfo.contractNo}
                    onChange={handleInputChange}
                    placeholder="124235"
                    readOnly
                  />
                  <span className="servrepo-select-arrow">▼</span>
                </div>
              </div>
            </div>
            <div className="servrepo-form-row">
              <div className="servrepo-form-group">
                <label>
                  Email Address<span className="required">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={customerInfo.email}
                  onChange={handleInputChange}
                  placeholder="user@gmail.com"
                />
              </div>
              <div className="servrepo-form-group">
                <label>
                  Termination Date<span className="required">*</span>
                </label>
                <div className="servrepo-date-wrapper">
                  <input
                    type="text"
                    name="terminationDate"
                    value={customerInfo.terminationDate}
                    onChange={handleInputChange}
                    placeholder="dd/mm/yy"
                  />
                  <img
                    src={CalendarInputIcon || "/placeholder.svg?height=16&width=16"}
                    alt="Calendar"
                    className="servrepo-calendar-icon"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* General Section */}
          <div className="servrepo-general-section">
            <div className="servrepo-section-header">
              <div className="servrepo-section-title">
                <img src={GeneralIcon || "/placeholder.svg?height=20&width=20"} alt="General" />
                <h2>General</h2>
              </div>
              <div className="servrepo-section-divider"></div>
            </div>

            <div className="servrepo-table-controls">
              <div className="servrepo-search">
                <img
                  src={SearchIcon || "/placeholder.svg?height=16&width=16"}
                  alt="Search"
                  className="servrepo-search-icon"
                />
                <input
                  type="text"
                  placeholder="Search or type a command (Ctrl + G)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="servrepo-filters">
                <div className="servrepo-date-filter">
                  <button className="servrepo-filter-button" onClick={() => setShowDateOptions(!showDateOptions)}>
                    <img
                      src={CalendarFilterIcon || "/placeholder.svg?height=16&width=16"}
                      alt="Calendar"
                      className="servrepo-calendar-icon-small"
                    />
                    {dateFilter}
                    <span className="servrepo-chevron">▼</span>
                  </button>
                  {showDateOptions && (
                    <div className="servrepo-filter-options">
                      {dateOptions.map((option) => (
                        <div
                          key={option.value}
                          className="servrepo-filter-option"
                          onClick={() => handleDateFilterChange(option.label)}
                        >
                          {option.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="servrepo-status-filter">
                  <button className="servrepo-filter-button" onClick={() => setShowFilterOptions(!showFilterOptions)}>
                    Filter by {filterBy ? `: ${filterOptions.find((opt) => opt.value === filterBy)?.label}` : ""}
                    <span className="servrepo-chevron">▼</span>
                  </button>
                  {showFilterOptions && (
                    <div className="servrepo-filter-options">
                      {filterOptions.map((option) => (
                        <div
                          key={option.value}
                          className="servrepo-filter-option"
                          onClick={() => handleFilterChange(option.value)}
                        >
                          {option.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Table with no container */}
            <table className="servrepo-table">
              <thead>
                <tr>
                  <th>Report ID</th>
                  <th>Service Call</th>
                  <th>Service Billing</th>
                  <th>Technician ID</th>
                  <th>Description</th>
                  <th>Service Billing Amount</th>
                  <th>Report Status</th>
                  <th>Submission Date</th>
                </tr>
              </thead>
              <tbody>
                {serviceReports.map((report) => (
                  <tr key={report.reportId}>
                    <td>{report.reportId}</td>
                    <td>{report.serviceCall}</td>
                    <td>{report.serviceBilling}</td>
                    <td>{report.technicianId}</td>
                    <td>{report.description}</td>
                    <td>{report.billingAmount}</td>
                    <td>{report.status}</td>
                    <td>{report.submissionDate}</td>
                  </tr>
                ))}
                {/* Empty rows to fill the table */}
                {Array(5 - serviceReports.length)
                  .fill()
                  .map((_, index) => (
                    <tr key={`empty-${index}`} className="servrepo-empty-row">
                      <td></td>
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

          <div className="servrepo-actions">
            <div className="servrepo-left-actions">
              <button className="servrepo-close-button" onClick={handleCloseTicket}>
                Close Ticket
              </button>
              <button className="servrepo-accounting-button" onClick={handleSendToAccounting}>
                Send to Accounting
              </button>
            </div>
            <div className="servrepo-right-actions">
              <button className="servrepo-cancel-button" onClick={handleCancel}>
                Cancel
              </button>
              <button className="servrepo-update-button" onClick={handleUpdate}>
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ServiceReport

