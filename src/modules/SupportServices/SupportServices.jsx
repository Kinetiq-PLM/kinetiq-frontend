"use client"

import { useState, useEffect } from "react"
import "./styles/SupportServices.css"
import SupportServicesIcon from "/icons/SupportServices/Dashboard/SupportServicesIcon.png"
import DashboardTicketIcon from "/icons/SupportServices/Dashboard/DashboardTicketIcon.png"
import DashboardCallIcon from "/icons/SupportServices/Dashboard/DashboardCallIcon.png"
import DashboardRequestIcon from "/icons/SupportServices/Dashboard/DashboardRequestIcon.png"
import DashboardAnalysisIcon from "/icons/SupportServices/Dashboard/DashboardAnalysisIcon.svg"
import DashboardContractIcon from "/icons/SupportServices/Dashboard/DashboardContractIcon.png"
import DashboardReportIcon from "/icons/SupportServices/Dashboard/DashboardReportIcon.png"
import DashboardRenewalIcon from "/icons/SupportServices/Dashboard/DashboardRenewalIcon.svg"
import DashboardBillingIcon from "/icons/SupportServices/Dashboard/DashboardBillingIcon.svg"

import { GET } from "./api/api"

const SupportServices = ({ loadSubModule, setActiveSubModule }) => {
  // State for service metrics
  const [serviceMetrics, setServiceMetrics] = useState({
    tickets: { total: 0, open: 0, inProgress: 0, closed: 0 },
    calls: { total: 0, open: 0, inProgress: 0, closed: 0 },
    requests: { total: 0, approved: 0, inProgress: 0, pending: 0, rejected: 0 },
    renewals: { total: 0},
    analyses: { total: 0, scheduled: 0, done: 0 },
    billings: { total: 0, unpaid: 0, paid: 0},
    contracts: { total: 0, active: 0, expired: 0, terminated: 0 },
    reports: { total: 0, draft: 0, submitted: 0, reviewed: 0 },
  })

  const fetchDataAndUpdateMetrics = async (endpoint, statusField, metricType, statusValues = []) => {
    try {
      const data = await GET(endpoint);
      
      // Initialize an object to count the different statuses
      const statusCounts = statusValues.reduce((acc, status) => {
        acc[status] = data.filter(item => item[statusField].toLowerCase() === status).length;
        return acc;
      }, {});
  
      // Update service metrics
      setServiceMetrics(prev => ({
        ...prev,
        [metricType]: {
          ...prev[metricType],
          total: data.length,
          ...statusCounts,
        }
      }));
    } catch (error) {
      console.error(`Error fetching ${metricType}:`, error);
    }
  };
  
  const fetchServiceRenewals = async () => {
    try {
      const data = await GET("warranty-renewals/");
      setServiceMetrics(prev => ({
        ...prev,
        renewals: {
          ...prev.renewals,
          total: data.length,
        }
      }));
    } catch (error) {
      console.error("Error fetching renewals:", error)
    }
  }

  useEffect(() => {
    fetchDataAndUpdateMetrics("tickets/", "status", "tickets", ["open", "in progress", "closed"]);
    fetchDataAndUpdateMetrics("service-calls/", "call_status", "calls", ["open", "in progress", "closed"]);
    fetchDataAndUpdateMetrics("service-requests/", "request_status", "requests", ["approved", "in progress", "pending", "rejected"]);
    fetchDataAndUpdateMetrics("service-analyses/", "analysis_status", "analyses", ["scheduled", "done"]);
    fetchDataAndUpdateMetrics("service-billings/", "billing_status", "billings", ["paid", "unpaid"]);
    fetchDataAndUpdateMetrics("service-reports/", "report_status", "reports", ["draft", "submitted", "reviewed"]);
    fetchDataAndUpdateMetrics("service-contracts/", "contract_status", "contracts", ["active", "expired", "terminated"]);
    fetchServiceRenewals();
  }, []);

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
                {serviceMetrics.tickets.closed} closed
              </div>
            </div>
            <button className="view-all-button" 
            onClick={() => {
              loadSubModule("Service Ticket");
              setActiveSubModule("Service Ticket");
            }}
            >
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
                {serviceMetrics.calls.closed} closed
              </div>
            </div>
            <button className="view-all-button" 
              onClick={() => {
                loadSubModule("Service Call");
                setActiveSubModule("Service Call");
              }}
            >
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
                {serviceMetrics.requests.approved} open, {serviceMetrics.requests.inProgress} in progress,{" "}
                {serviceMetrics.requests.pending} pending, {serviceMetrics.requests.rejected} rejected
              </div>
            </div>
            <button className="view-all-button" 
              onClick={() => {
                loadSubModule("Service Request");
                setActiveSubModule("Service Request");
              }}
            >
              View all requests
            </button>
          </div>

          <div className="dashboard-card secondary">
            <div className="card-header">
              <h3>Warranty Renewals</h3>
              <img
                src={DashboardRenewalIcon || "/placeholder.svg?height=24&width=24"}
                alt="Renewals"
                className="card-icon"
              />
            </div>
            <div className="card-content">
              <div className="metric-value">{serviceMetrics.renewals.total}</div>
              <div className="metric-details">
              {serviceMetrics.renewals.total} total warranty renewals
              </div>
            </div>
            <button className="view-all-button" 
              onClick={() => {
                loadSubModule("Warranty Renewal");
                setActiveSubModule("Warranty Renewal");
              }}
            >
              View all renewals
            </button>
          </div>

          {/* Service Analysis Card */}
          <div className="dashboard-card primary">
            <div className="card-header">
              <h3>Service Analysis</h3>
              <img
                src={DashboardAnalysisIcon || "/placeholder.svg?height=24&width=24"}
                alt="Analysis"
                className="card-icon"
              />
            </div>
            <div className="card-content">
              <div className="metric-value">{serviceMetrics.analyses.total}</div>
              <div className="metric-details">
                {serviceMetrics.analyses.scheduled} scheduled, {serviceMetrics.analyses.done} done
              </div>
            </div>
            <button className="view-all-button" 
              onClick={() => {
                loadSubModule("Service Analysis");
                setActiveSubModule("Service Analysis");
              }}
            >
              View all analyses
            </button>
          </div>

          <div className="dashboard-card secondary">
            <div className="card-header">
              <h3>Service Billings</h3>
              <img
                src={DashboardBillingIcon || "/placeholder.svg?height=24&width=24"}
                alt="Billings"
                className="card-icon"
              />
            </div>
            <div className="card-content">
              <div className="metric-value">{serviceMetrics.billings.total}</div>
              <div className="metric-details">
                {serviceMetrics.billings.paid} paid, {serviceMetrics.billings.unpaid} unpaid
              </div>
            </div>
            <button className="view-all-button" 
              onClick={() => {
                loadSubModule("Service Billing");
                setActiveSubModule("Service Billing");
              }}
            >
              View all billings
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
                {serviceMetrics.contracts.active} active, {serviceMetrics.contracts.expired} expired,{" "}
                {serviceMetrics.contracts.terminated} terminated
              </div>
            </div>
            <button className="view-all-button" 
              onClick={() => {
                loadSubModule("Service Contract");
                setActiveSubModule("Service Contract");
              }}
            >
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
                {serviceMetrics.reports.draft} draft, {serviceMetrics.reports.submitted} submitted,{" "}
                {serviceMetrics.reports.reviewed} reviewed
              </div>
            </div>
            <button className="view-all-button" 
              onClick={() => {
                loadSubModule("Service Report");
                setActiveSubModule("Service Report");
              }}
            >
              View all reports
            </button>
          </div>
          
        </div>
      </div>
    </div>
  )
}

export default SupportServices