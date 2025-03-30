"use client"

import { useState, useEffect } from "react"
import ExitIcon from "/icons/SupportServices/ExitIcon.png"
import ServiceRequestIcon from "/icons/SupportServices/ServiceRequestIcon.png"
import CalendarInputIcon from "/icons/SupportServices/CalendarInputIcon.png"

const UpdateViewModal = ({ isOpen, onClose, request, onUpdate }) => {
  const [formData, setFormData] = useState({
    id: "",
    callId: "",
    customerId: "",
    name: "",
    technicianId: "",
    technicianName: "",
    requestDate: "",
    phoneNumber: "",
    emailAddress: "",
    requestType: "",
    requestStatus: "",
    requestDescription: "",
    requestRemarks: "",
  })

  useEffect(() => {
    if (request) {
    
      setFormData({
        id: "",
        callId: "",
        customerId: "",
        name: "",
        technicianId: "",
        technicianName: "",
        requestDate: "",
        phoneNumber: "",
        emailAddress: "",
        requestType: "",
        requestStatus: "",
        requestDescription: "",
        requestRemarks: "",
      })
    }
  }, [request])

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleSubmit = () => {
    onUpdate({
      ...request,
      id: formData.id,
      callId: formData.callId,
      customerName: formData.name,
      type: formData.requestType,
      status: formData.requestStatus,
    })
  }

  if (!isOpen || !request) return null

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <div className="modal-header-left">
            <img src={ServiceRequestIcon || "/placeholder.svg"} alt="Service Request" className="modal-header-icon" />
            <h2>Service Request</h2>
          </div>
          <button className="close-button" onClick={onClose}>
            <img src={ExitIcon || "/placeholder.svg"} alt="Close" />
          </button>
        </div>
        <div className="modal-header-divider"></div>

        <div className="modal-content">
          <div className="modal-form">
            <div className="form-group">
              <label htmlFor="id">Request ID</label>
              <input type="text" id="id" value={formData.id} onChange={handleChange} placeholder="Enter request ID" />
            </div>

            <div className="form-group">
              <label htmlFor="customerId">Customer ID</label>
              <input
                type="text"
                id="customerId"
                value={formData.customerId}
                onChange={handleChange}
                placeholder="Enter customer ID"
              />
            </div>

            <div className="form-group">
              <label htmlFor="callId">Service Call ID</label>
              <input
                type="text"
                id="callId"
                value={formData.callId}
                onChange={handleChange}
                placeholder="Enter service call ID"
              />
            </div>

            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input type="text" id="name" value={formData.name} onChange={handleChange} placeholder="Enter name" />
            </div>

            <div className="form-group">
              <label htmlFor="technicianId">Technician ID</label>
              <div className="select-wrapper">
                <input
                  type="text"
                  id="technicianId"
                  value={formData.technicianId}
                  onChange={handleChange}
                  placeholder="Select technician ID"
                />
                <span className="select-arrow">▼</span>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                type="text"
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Enter phone number"
              />
            </div>

            <div className="form-group">
              <label htmlFor="technicianName">Technician Name</label>
              <input
                type="text"
                id="technicianName"
                value={formData.technicianName}
                onChange={handleChange}
                placeholder="Enter technician name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="emailAddress">Email Address</label>
              <input
                type="email"
                id="emailAddress"
                value={formData.emailAddress}
                onChange={handleChange}
                placeholder="Enter email address"
              />
            </div>

            <div className="form-group">
              <label htmlFor="requestDate">Request Date</label>
              <div className="date-input-wrapper">
                <input
                  type="text"
                  id="requestDate"
                  value={formData.requestDate}
                  onChange={handleChange}
                  placeholder="dd/mm/y"
                />
                <img
                  src={CalendarInputIcon || "/placeholder.svg?height=16&width=16"}
                  alt="Calendar"
                  className="calendar-icon"
                />
              </div>
            </div>

            {/* Request Status */}
            <div className="form-group status-group">
              <label htmlFor="requestStatus">Request Status</label>
              <div className="select-wrapper">
                <input
                  type="text"
                  id="requestStatus"
                  value={formData.requestStatus}
                  onChange={handleChange}
                  placeholder="Select request status"
                />
                <span className="select-arrow">▼</span>
              </div>
            </div>

            {/* Request Description */}
            <div className="form-group description-group">
              <label htmlFor="requestDescription">Request Description</label>
              <textarea
                id="requestDescription"
                value={formData.requestDescription}
                onChange={handleChange}
                placeholder="Enter request description"
              />
            </div>

            <div className="form-group type-group">
              <label htmlFor="requestType">Request Type</label>
              <div className="select-wrapper">
                <input
                  type="text"
                  id="requestType"
                  value={formData.requestType}
                  onChange={handleChange}
                  placeholder="Select request type"
                />
                <span className="select-arrow">▼</span>
              </div>
            </div>

            <div className="form-group remarks-group">
              <label htmlFor="requestRemarks">Request Remarks</label>
              <textarea
                id="requestRemarks"
                value={formData.requestRemarks}
                onChange={handleChange}
                placeholder="Enter request remarks"
              />
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

export default UpdateViewModal

