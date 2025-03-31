"use client"

import { useState, useEffect } from "react"
import ExitIcon from "/icons/SupportServices/ExitIcon.png"
import ServiceReportIcon from "/icons/SupportServices/ServiceReportIcon.png"

const UpdateReportModal = ({ isOpen, onClose, onUpdate, report }) => {
  const [ticketId, setTicketId] = useState("")
  const [requestId, setRequestId] = useState("")
  const [requestType, setRequestType] = useState("")
  const [renewalId, setRenewalId] = useState("")
  const [billingId, setBillingId] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState("")

  // Update form when report changes
  useEffect(() => {
    if (report) {
      setTicketId(report.ticketId || "")
      setRequestId(report.requestId || "")
      setRequestType(report.requestType || "")
      setRenewalId(report.renewalId || "")
      setBillingId(report.billingId || "")
      setDescription(report.description || "")
      setStatus(report.status || "")
    }
  }, [report])

  const handleSubmit = () => {
    onUpdate({
      ticketId,
      requestId,
      requestType,
      renewalId,
      billingId,
      description,
      status,
    })
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div className="modal-container update-report-modal">
        <div className="modal-header">
          <div className="modal-title">
            <img
              src={ServiceReportIcon || "/placeholder.svg?height=24&width=24"}
              alt="Service Report"
              className="modal-icon"
            />
            <h2>Update Report</h2>
          </div>
          <button className="close-button" onClick={onClose}>
            <img src={ExitIcon || "/placeholder.svg?height=16&width=16"} alt="Close" />
          </button>
        </div>
        <div className="modal-divider"></div>

        <div className="modal-content">
          <div className="modal-form">
            <div className="form-row">
              <div className="form-column">
                <div className="form-group">
                  <label htmlFor="ticketId">Ticket ID</label>
                  <div className="select-wrapper">
                    <input
                      type="text"
                      id="ticketId"
                      value={ticketId}
                      onChange={(e) => setTicketId(e.target.value)}
                      placeholder="Enter ticket ID"
                    />
                    <span className="select-arrow">▼</span>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="requestId">Request ID</label>
                  <input
                    type="text"
                    id="requestId"
                    value={requestId}
                    onChange={(e) => setRequestId(e.target.value)}
                    placeholder="Enter request ID"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="requestType">Request Type</label>
                  <input
                    type="text"
                    id="requestType"
                    value={requestType}
                    onChange={(e) => setRequestType(e.target.value)}
                    placeholder="Enter request type"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="renewalId">Renewal ID</label>
                  <div className="select-wrapper">
                    <input
                      type="text"
                      id="renewalId"
                      value={renewalId}
                      onChange={(e) => setRenewalId(e.target.value)}
                      placeholder="Enter renewal ID"
                    />
                    <span className="select-arrow">▼</span>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="billingId">Billing ID</label>
                  <input
                    type="text"
                    id="billingId"
                    value={billingId}
                    onChange={(e) => setBillingId(e.target.value)}
                    placeholder="Enter billing ID"
                  />
                </div>
              </div>

              <div className="form-column">
                <div className="form-group description-group">
                  <label htmlFor="updateDescription">Description</label>
                  <div className="textarea-container">
                    <textarea
                      id="updateDescription"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Enter description"
                      rows={4}
                      className="description-textarea"
                    />
                    <div className="custom-scrollbar-container">
                      <button className="scroll-arrow scroll-up">▼</button>
                      <div className="scroll-track">
                        <div className="scroll-thumb"></div>
                      </div>
                      <button className="scroll-arrow scroll-down">▼</button>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="reportStatus">Report Status</label>
                  <div className="select-wrapper">
                    <input
                      type="text"
                      id="reportStatus"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      placeholder="Select status"
                    />
                    <span className="select-arrow">▼</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button className="action-button" onClick={handleSubmit}>
            Update
          </button>
        </div>
      </div>
    </div>
  )
}

export default UpdateReportModal

