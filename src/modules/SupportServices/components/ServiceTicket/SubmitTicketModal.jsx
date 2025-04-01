"use client"

import { useState } from "react"
import ExitIcon from "/icons/SupportServices/ExitIcon.png"
import CalendarInputIcon from "/icons/SupportServices/CalendarInputIcon.png"
import ServiceTicketIcon from "/icons/SupportServices/ServiceTicket.png"

const SubmitTicketModal = ({ isOpen, onClose, onSubmit }) => {
  const [customerId, setCustomerId] = useState("")
  const [name, setName] = useState("")
  const [technicianId, setTechnicianId] = useState("")
  const [priority, setPriority] = useState("")
  const [subject, setSubject] = useState("")
  const [description, setDescription] = useState("")
  const [createdAt, setCreatedAt] = useState("")

  const handleSubmit = () => {
    onSubmit({
      customerId,
      name,
      technicianId,
      priority,
      subject,
      description,
      createdAt,
    })
    // Reset form
    setCustomerId("")
    setName("")
    setTechnicianId("")
    setPriority("")
    setSubject("")
    setDescription("")
    setCreatedAt("")
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div className="modal-container submit-ticket-modal">
        <div className="modal-header">
          <div className="modal-header-left">
            <img src={ServiceTicketIcon || "/placeholder.svg"} alt="Service Ticket" className="modal-header-icon" />
            <h2>Submit a Ticket</h2>
          </div>
          <button className="close-button" onClick={onClose}>
            <img src={ExitIcon || "/placeholder.svg"} alt="Close" />
          </button>
        </div>
        <div className="modal-header-divider"></div>

        <div className="modal-content">
          <div className="modal-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="customerId">
                  Customer ID <span className="required">*</span>
                </label>
                <div className="select-wrapper">
                  <input
                    type="text"
                    id="customerId"
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value)}
                    placeholder="Enter customer ID"
                  />
                  <span className="select-arrow">▼</span>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="ticketSubject">
                  Ticket Subject <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="ticketSubject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter ticket subject"
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
                <label htmlFor="technicianId">Technician ID</label>
                <input
                  type="text"
                  id="technicianId"
                  value={technicianId}
                  onChange={(e) => setTechnicianId(e.target.value)}
                  placeholder="Enter technician ID"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="createdAt">Created at</label>
                <div className="date-input-wrapper">
                  <input
                    type="text"
                    id="createdAt"
                    value={createdAt}
                    onChange={(e) => setCreatedAt(e.target.value)}
                    placeholder="dd/mm/yy"
                  />
                  <img src={CalendarInputIcon || "/placeholder.svg"} alt="Calendar" className="calendar-icon" />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="priority">
                  Priority <span className="required">*</span>
                </label>
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

            <div className="form-row">
              <div className="form-group" style={{ flex: "1 1 100%" }}>
                <label htmlFor="ticketDescription">
                  Ticket Description <span className="required">*</span>
                </label>
                <textarea
                  id="ticketDescription"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter ticket description"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button className="submit-button" onClick={handleSubmit}>
            Submit Ticket
          </button>
        </div>
      </div>
    </div>
  )
}

export default SubmitTicketModal

