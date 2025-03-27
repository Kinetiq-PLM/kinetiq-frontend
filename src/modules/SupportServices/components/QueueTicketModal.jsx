"use client"

import { useState } from "react"
import ExitIcon from "/icons/SupportServices/ExitIcon.png"
import ServiceTicketIcon from "/icons/SupportServices/ServiceTicket.png"

const QueueTicketModal = ({ isOpen, onClose, onQueue }) => {
  const [ticketId, setTicketId] = useState("")
  const [customerId, setCustomerId] = useState("")
  const [name, setName] = useState("")
  const [emailAddress, setEmailAddress] = useState("")
  const [productId, setProductId] = useState("")
  const [technicianId, setTechnicianId] = useState("")
  const [technicianName, setTechnicianName] = useState("")
  const [callType, setCallType] = useState("")

  const handleQueue = () => {
    onQueue({
      ticketId,
      customerId,
      name,
      emailAddress,
      productId,
      technicianId,
      technicianName,
      callType,
    })
    // Reset form
    setTicketId("")
    setCustomerId("")
    setName("")
    setEmailAddress("")
    setProductId("")
    setTechnicianId("")
    setTechnicianName("")
    setCallType("")
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div className="modal-container queue-ticket-modal">
        <div className="modal-header">
          <div className="modal-header-left">
            <img src={ServiceTicketIcon || "/placeholder.svg"} alt="Service Ticket" className="modal-header-icon" />
            <h2>Queue Ticket</h2>
          </div>
          <button className="close-button" onClick={onClose}>
            <img src={ExitIcon || "/placeholder.svg"} alt="Close" />
          </button>
        </div>
        <div className="modal-header-divider"></div>

        <div className="modal-content">
          <div className="modal-form two-column">
            <div className="form-column">
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

              <div className="form-group">
                <label htmlFor="queueCustomerId">Customer ID</label>
                <input
                  type="text"
                  id="queueCustomerId"
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  placeholder="Enter customer ID"
                />
              </div>

              <div className="form-group">
                <label htmlFor="queueName">Name</label>
                <input
                  type="text"
                  id="queueName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="emailAddress">Email Address</label>
                <input
                  type="email"
                  id="emailAddress"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  placeholder="Enter email address"
                />
              </div>

              <div className="form-group">
                <label htmlFor="productId">
                  Product ID <span className="required">*</span>
                </label>
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
            </div>

            <div className="form-column">
              <h3 className="column-header">Assign To:</h3>

              <div className="form-group">
                <label htmlFor="assignTechnicianId">
                  Technician ID <span className="required">*</span>
                </label>
                <div className="select-wrapper">
                  <input
                    type="text"
                    id="assignTechnicianId"
                    value={technicianId}
                    onChange={(e) => setTechnicianId(e.target.value)}
                    placeholder="Enter technician ID"
                  />
                  <span className="select-arrow">▼</span>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="technicianName">Technician Name</label>
                <input
                  type="text"
                  id="technicianName"
                  value={technicianName}
                  onChange={(e) => setTechnicianName(e.target.value)}
                  placeholder="Enter technician name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="callType">
                  Call Type <span className="required">*</span>
                </label>
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

              <div className="notification-message">
                <p>
                  An automated email will be sent to the customer notifying them that a call will happen within 24
                  hours.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button className="queue-button" onClick={handleQueue}>
            Queue Call
          </button>
        </div>
      </div>
    </div>
  )
}

export default QueueTicketModal

