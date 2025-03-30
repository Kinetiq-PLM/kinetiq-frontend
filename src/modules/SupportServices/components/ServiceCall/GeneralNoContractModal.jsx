"use client"

import { useState, useEffect } from "react"
import ExitIcon from "/icons/SupportServices/ExitIcon.png"
import ServiceCallIcon from "/icons/SupportServices/ServiceCallIcon.png"

const GeneralNoContractModal = ({ isOpen, onClose, onUpdate, onShowResolution, callData }) => {
  const [customerId, setCustomerId] = useState("")
  const [name, setName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [productId, setProductId] = useState("")
  const [productName, setProductName] = useState("")
  const [callId, setCallId] = useState("")
  const [callType, setCallType] = useState("")
  const [ticketId, setTicketId] = useState("")
  const [ticketSubject, setTicketSubject] = useState("")
  const [ticketDescription, setTicketDescription] = useState("")
  const [status, setStatus] = useState("")
  const [priority, setPriority] = useState("")
  const [activeTab, setActiveTab] = useState("general")

  // Update form when callData changes
  useEffect(() => {
    if (callData) {
      // Reset all fields to empty to show placeholders
      setCallId("")
      setTicketId("")
      setName("")
      setStatus("")
      setPriority("")
      setCustomerId("")
      setPhoneNumber("")
      setProductId("")
      setProductName("")
      setCallType("")
      setTicketSubject("")
      setTicketDescription("")
    }
  }, [callData])

  const handleSubmit = () => {
    onUpdate({
      callId,
      customerId,
      name,
      phoneNumber,
      productId,
      productName,
      callType,
      ticketId,
      ticketSubject,
      ticketDescription,
      status,
      priority,
    })
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div className="modal-container service-call-modal">
        <div className="modal-header">
          <div className="modal-header-left">
            <img
              src={ServiceCallIcon || "/placeholder.svg?height=24&width=24"}
              alt="Service Call"
              className="modal-header-icon"
            />
            <h2>Service Call without contract</h2>
          </div>
          <button className="close-button" onClick={onClose}>
            <img src={ExitIcon || "/placeholder.svg?height=24&width=24"} alt="Close" />
          </button>
        </div>

        <div className="modal-header-divider"></div>

        <div className="modal-tabs">
          <div
            className={`modal-tab ${activeTab === "general" ? "active" : ""}`}
            onClick={() => setActiveTab("general")}
          >
            General
          </div>
          <div className={`modal-tab ${activeTab === "resolution" ? "active" : ""}`} onClick={() => onShowResolution()}>
            Resolution
          </div>
        </div>

        <div className="modal-content">
          <div className="modal-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="customerId">Customer ID</label>
                <input
                  type="text"
                  id="customerId"
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  placeholder="Enter customer ID"
                />
              </div>
              <div className="form-group">
                <label htmlFor="ticketId">Ticket ID</label>
                <input
                  type="text"
                  id="ticketId"
                  value={ticketId}
                  onChange={(e) => setTicketId(e.target.value)}
                  placeholder="Enter ticket ID"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="ticketSubject">Ticket Subject</label>
                <input
                  type="text"
                  id="ticketSubject"
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  placeholder="Enter ticket subject"
                />
              </div>
            </div>

            <div className="form-row aligned-row">
              <div className="form-group">
                <label htmlFor="phoneNumber">Phone Number</label>
                <input
                  type="text"
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter phone number"
                />
              </div>
              <div className="form-group">
                <label htmlFor="ticketDescription">Ticket Description</label>
                <textarea
                  id="ticketDescription"
                  value={ticketDescription}
                  onChange={(e) => setTicketDescription(e.target.value)}
                  placeholder="Enter ticket description"
                />
              </div>
            </div>

            <div className="form-row aligned-row">
              <div className="form-group">
                <label htmlFor="productId">Product ID</label>
                <div className="select-wrapper">
                  <input
                    type="text"
                    id="productId"
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    placeholder="Select product ID"
                  />
                  <span className="select-arrow">▼</span>
                </div>
              </div>
              <div className="form-group">{/* Empty div to maintain alignment */}</div>
            </div>

            <div className="form-row aligned-row">
              <div className="form-group">
                <label htmlFor="productName">Product Name</label>
                <input
                  type="text"
                  id="productName"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="Enter product name"
                />
              </div>
              <div className="form-group">{/* Empty div to maintain alignment */}</div>
            </div>

            <div className="form-divider"></div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="callId">Call ID</label>
                <input
                  type="text"
                  id="callId"
                  value={callId}
                  onChange={(e) => setCallId(e.target.value)}
                  placeholder="Enter call ID"
                />
              </div>
              <div className="form-group">
                <label htmlFor="status">Status</label>
                <div className="select-wrapper">
                  <input
                    type="text"
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    placeholder="Select status"
                  />
                  <span className="select-arrow">▼</span>
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="callType">Call Type</label>
                <div className="select-wrapper">
                  <input
                    type="text"
                    id="callType"
                    value={callType}
                    onChange={(e) => setCallType(e.target.value)}
                    placeholder="Select call type"
                  />
                  <span className="select-arrow">▼</span>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="priority">Priority</label>
                <div className="select-wrapper">
                  <input
                    type="text"
                    id="priority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    placeholder="Select priority"
                  />
                  <span className="select-arrow">▼</span>
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
            Update
          </button>
        </div>
      </div>
    </div>
  )
}

export default GeneralNoContractModal

