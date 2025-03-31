"use client"

import { useState, useEffect } from "react"
import "./styles/SupportServices.css"
import SupportServicesIcon from "/icons/SupportServices/Dashboard/SupportServicesIcon.png"
import DashboardTicketIcon from "/icons/SupportServices/Dashboard/DashboardTicketIcon.png"
import DashboardCallIcon from "/icons/SupportServices/Dashboard/DashboardCallIcon.png"
import DashboardRequestIcon from "/icons/SupportServices/Dashboard/DashboardRequestIcon.png"
import DashboardAnalysisIcon from "/icons/SupportServices/Dashboard/DashboardAnalysisIcon.png"
import DashboardContractIcon from "/icons/SupportServices/Dashboard/DashboardContractIcon.png"
import DashboardReportIcon from "/icons/SupportServices/Dashboard/DashboardReportIcon.png"

const SupportServices = () => {
  // State for service metrics
  const [serviceMetrics, setServiceMetrics] = useState({
    tickets: { total: 0, open: 0, inProgress: 0, pending: 0 },
    calls: { total: 0, open: 0, inProgress: 0, pending: 0 },
    requests: { total: 0, open: 0, inProgress: 0, pending: 0 },
    analysis: { total: 0, open: 0, inProgress: 0, pending: 0 },
    contracts: { total: 0, open: 0, inProgress: 0, pending: 0 },
    reports: { total: 0, open: 0, inProgress: 0, pending: 0 },
  })

  // Fetch service metrics from API (mock function)
  useEffect(() => {
    // Replace with actual API call
    const fetchServiceMetrics = async () => {
      try {
        // Mock data for demonstration
        setServiceMetrics({
          tickets: { total: 24, open: 12, inProgress: 8, pending: 4 },
          calls: { total: 18, open: 12, inProgress: 8, pending: 4 },
          requests: { total: 24, open: 12, inProgress: 8, pending: 4 },
          analysis: { total: 18, open: 12, inProgress: 8, pending: 4 },
          contracts: { total: 24, open: 12, inProgress: 8, pending: 4 },
          reports: { total: 18, open: 12, inProgress: 8, pending: 4 },
        })
      } catch (error) {
        console.error("Error fetching service metrics:", error)
      }
    }

    fetchServiceMetrics()
  }, [])

  // Handle view all clicks
  const handleViewAll = (serviceType) => {
    console.log(`View all ${serviceType}`)
    // Navigate to respective service page
    // Example: router.push(`/services/${serviceType}`)
  }

  return (
    <div className="servdash">
      <div className="body-content-container fixed">
        <div className="header">
          <div className="icon-container">
            <img
              src={SupportServicesIcon || "/placeholder.svg?height=24&width=24"}
              alt="Support Services"
              className="header-icon"
            />
          </div>
          <div className="title-container">
            <h2>Support & Services Dashboard</h2>
            <p className="subtitle">Real-Time Service Management Overview</p>
          </div>
        </div>

        <div className="divider"></div>

        <div className="dashboard-grid">
          {/* Service Tickets Card */}
          <div className="dashboard-card primary">
            <div className="card-header">
              <h3>Service Tickets</h3>
              <img
                src={DashboardTicketIcon || "/placeholder.svg?height=24&width=24"}
                alt="Tickets"
                className="card-icon"
              />
            </div>
            <div className="card-content">
              <div className="metric-value">{serviceMetrics.tickets.total}</div>
              <div className="metric-details">
                {serviceMetrics.tickets.open} open, {serviceMetrics.tickets.inProgress} in progress,{" "}
                {serviceMetrics.tickets.pending} pending
              </div>
            </div>
            <button className="view-all-button" onClick={() => handleViewAll("tickets")}>
              View all tickets
            </button>
          </div>

          {/* Service Calls Card */}
          <div className="dashboard-card secondary">
            <div className="card-header">
              <h3>Service Calls</h3>
              <img src={DashboardCallIcon || "/placeholder.svg?height=24&width=24"} alt="Calls" className="card-icon" />
            </div>
            <div className="card-content">
              <div className="metric-value">{serviceMetrics.calls.total}</div>
              <div className="metric-details">
                {serviceMetrics.calls.open} open, {serviceMetrics.calls.inProgress} in progress,{" "}
                {serviceMetrics.calls.pending} pending
              </div>
            </div>
            <button className="view-all-button" onClick={() => handleViewAll("calls")}>
              View all calls
            </button>
          </div>

          {/* Service Requests Card */}
          <div className="dashboard-card primary">
            <div className="card-header">
              <h3>Service Requests</h3>
              <img
                src={DashboardRequestIcon || "/placeholder.svg?height=24&width=24"}
                alt="Requests"
                className="card-icon"
              />
            </div>
            <div className="card-content">
              <div className="metric-value">{serviceMetrics.requests.total}</div>
              <div className="metric-details">
                {serviceMetrics.requests.open} open, {serviceMetrics.requests.inProgress} in progress,{" "}
                {serviceMetrics.requests.pending} pending
              </div>
            </div>
            <button className="view-all-button" onClick={() => handleViewAll("requests")}>
              View all requests
            </button>
          </div>

          {/* Service Analysis Card */}
          <div className="dashboard-card secondary">
            <div className="card-header">
              <h3>Service Analysis</h3>
              <img
                src={DashboardAnalysisIcon || "/placeholder.svg?height=24&width=24"}
                alt="Analysis"
                className="card-icon"
              />
            </div>
            <div className="card-content">
              <div className="metric-value">{serviceMetrics.analysis.total}</div>
              <div className="metric-details">
                {serviceMetrics.analysis.open} open, {serviceMetrics.analysis.inProgress} in progress,{" "}
                {serviceMetrics.analysis.pending} pending
              </div>
            </div>
            <button className="view-all-button" onClick={() => handleViewAll("analysis")}>
              View all analysis
            </button>
          </div>

          {/* Service Contracts Card */}
          <div className="dashboard-card primary">
            <div className="card-header">
              <h3>Service Contracts</h3>
              <img
                src={DashboardContractIcon || "/placeholder.svg?height=24&width=24"}
                alt="Contracts"
                className="card-icon"
              />
            </div>
            <div className="card-content">
              <div className="metric-value">{serviceMetrics.contracts.total}</div>
              <div className="metric-details">
                {serviceMetrics.contracts.open} open, {serviceMetrics.contracts.inProgress} in progress,{" "}
                {serviceMetrics.contracts.pending} pending
              </div>
            </div>
            <button className="view-all-button" onClick={() => handleViewAll("contracts")}>
              View all contracts
            </button>
          </div>

          {/* Service Reports Card */}
          <div className="dashboard-card secondary">
            <div className="card-header">
              <h3>Service Reports</h3>
              <img
                src={DashboardReportIcon || "/placeholder.svg?height=24&width=24"}
                alt="Reports"
                className="card-icon"
              />
            </div>
            <div className="card-content">
              <div className="metric-value">{serviceMetrics.reports.total}</div>
              <div className="metric-details">
                {serviceMetrics.reports.open} open, {serviceMetrics.reports.inProgress} in progress,{" "}
                {serviceMetrics.reports.pending} pending
              </div>
            </div>
            <button className="view-all-button" onClick={() => handleViewAll("reports")}>
              View all reports
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SupportServices

