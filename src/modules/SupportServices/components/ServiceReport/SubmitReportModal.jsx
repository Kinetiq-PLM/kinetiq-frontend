"use client"

import { useState, useEffect } from "react"
import ExitIcon from "/icons/SupportServices/ExitIcon.png"
import ServiceReportIcon from "/icons/SupportServices/ServiceReportIcon.png"

import { GET } from "../api/api"

const SubmitReportModal = ({ isOpen, onClose, onSubmit, report }) => {
  const [tickets, setTickets] = useState([]);
  const [isTixDropdown, setOpenTixDD] = useState(false);
  
  const [formData, setFormData] = useState({
    ticketId: "",
    requestId: "",
    requestType: "",
    renewalId: "",
    billingId: "",
    technicianName: "",
    description: "",
    reportStatus: ""
  })

  const fetchTickets = async () => {
    try {
      const data = await GET("tickets/");
      setTickets(data);
    } catch (error) {
      console.error("Error fetching tickets:", error)
    }
  }

  const handleToggleTickets = () => {
    if (!isTixDropdown) {
      fetchTickets(); 
    }
    setOpenTixDD(!isTixDropdown);
  };

  const handleSelectTix = (ticket) => {
    

    setFormData((prev) => ({
      ...prev,
      ticketId: statementItem.statement_item_id || "",
      requestId: statementItem.product?.product_id || "",
      requestType: statementItem.product?.product_name || "",
    }));
    if (statementItem.additional_service) {
      fetchAddServices(statementItem.additional_service);
    } else {
      console.log("No additional service ID found.");
      setAdditionalServices([{}]); 
    }
    setOpenSTMDD(false);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  }

  const handleSubmit = () => {
    onSubmit({
      ticketId,
      requestId,
      requestType,
      renewalId,
      billingId,
      description,
      reportStatus,
    })
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <div className="modal-header-left">
            <img
              src={ServiceReportIcon || "/placeholder.svg?height=24&width=24"}
              alt="Service Report"
              className="modal-header-icon"
            />
            <h2>Submit Report</h2>
          </div>
          <button className="close-button" onClick={onClose}>
            <img src={ExitIcon || "/placeholder.svg?height=16&width=16"} alt="Close" />
          </button>
        </div>
        <div className="modal-header-divider"></div>

        <div className="modal-content">
          <div className="modal-form">
            <div className="form-row">
              <div className="form-column">
                <div className="form-group">
                  <label htmlFor="ticketId">Ticket ID *</label>
                  <div className="select-wrapper">
                    <input
                      type="text"
                      id="ticketId"
                      value={formData.ticketId}
                      onChange={handleChange}
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
                    readOnly
                    value={formData.requestId}
                    onChange={handleChange}
                    placeholder="Enter request ID"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="requestType">Request Type</label>
                  <input
                    type="text"
                    id="requestType"
                    readOnly
                    value={formData.requestType}
                    onChange={handleChange}
                    placeholder="Enter request type"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="renewalId">Renewal ID</label>
                  <div className="select-wrapper">
                    <input
                      type="text"
                      id="renewalId"
                      readOnly
                      value={formData.renewalId}
                      onChange={handleChange}
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
                    readOnly
                    value={formData.billingId}
                    onChange={handleChange}
                    placeholder="Enter billing ID"
                  />
                </div>
              </div>

              <div className="form-column">
                <div className="form-group description-group">
                  <label htmlFor="description">Description</label>
                  <div className="textarea-container">
                    <textarea
                      id="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Enter description"
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
                      readOnly
                      value={formData.reportStatus}
                      onChange={handleChange}
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
          <button className="update-modal-button" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  )
}

export default SubmitReportModal

