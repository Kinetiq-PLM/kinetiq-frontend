"use client"

import { useState } from "react"
import ExitIcon from "/icons/SupportServices/ExitIcon.png"
import CalendarInputIcon from "/icons/SupportServices/CalendarInputIcon.png"
import ServiceContractIcon from "/icons/SupportServices/ServiceContractIcon.png"

const CreateContractModal = ({ isOpen, onClose, onCreate }) => {
  const [contractId, setContractId] = useState("")
  const [productId, setProductId] = useState("")
  const [productName, setProductName] = useState("")
  const [productQuantity, setProductQuantity] = useState("")
  const [customerId, setCustomerId] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [name, setName] = useState("")
  const [emailAddress, setEmailAddress] = useState("")
  const [dateIssued, setDateIssued] = useState("")
  const [terminationDate, setTerminationDate] = useState("")
  const [contractDescription, setContractDescription] = useState("")
  const [contractStatus, setContractStatus] = useState("")
  const [additionalServices, setAdditionalServices] = useState([
    { id: "123", type: "Maintenance", dateIssued: "01/01/2023", duration: "1 year", status: "Active" },
    { id: "1234", type: "Priority Service", dateIssued: "01/01/2023", duration: "6 months", status: "Active" },
    { id: "543", type: "Extended Warranty", dateIssued: "01/01/2023", duration: "2 years", status: "Active" },
  ])

  const handleCreate = () => {
    onCreate({
      contractId,
      productId,
      productName,
      productQuantity,
      customerId,
      phoneNumber,
      name,
      emailAddress,
      dateIssued,
      terminationDate,
      contractDescription,
      contractStatus,
      additionalServices,
    })
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header" style={{ borderBottom: "2px solid #00a8a8" }}>
          <div className="modal-header-left">
            <img src={ServiceContractIcon || "/placeholder.svg"} alt="Service Contract" className="modal-header-icon" />
            <h2>Create a Service Contract</h2>
          </div>
          <button className="close-button" onClick={onClose}>
            <img src={ExitIcon || "/placeholder.svg"} alt="Close" />
          </button>
        </div>

        <div className="modal-content">
          <div className="modal-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="contractId">Sales Order ID</label>
                <input
                  type="text"
                  id="contractId"
                  value={contractId}
                  onChange={(e) => setContractId(e.target.value)}
                  placeholder="Enter sales order ID"
                />
              </div>

              <div className="form-group">
                <label htmlFor="productId">Product ID</label>
                <input
                  type="text"
                  id="productId"
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  placeholder="Enter product ID"
                />
              </div>
            </div>

            <div className="form-row">
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

              <div className="form-group">
                <label htmlFor="productQuantity">Product Quantity</label>
                <input
                  type="text"
                  id="productQuantity"
                  value={productQuantity}
                  onChange={(e) => setProductQuantity(e.target.value)}
                  placeholder="Enter product quantity"
                />
              </div>
            </div>

            <div className="form-divider"></div>

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
                <label htmlFor="phoneNumber">Phone Number</label>
                <input
                  type="text"
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter phone number"
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
                <label htmlFor="emailAddress">Email Address</label>
                <input
                  type="email"
                  id="emailAddress"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  placeholder="Enter email address"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="additionalServices">Additional Services</label>
              <div className="additional-services-table-container">
                <table className="additional-services-table">
                  <thead>
                    <tr>
                      <th>Additional Service ID</th>
                      <th>Service Type</th>
                      <th>Date Issued</th>
                      <th>Duration</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {additionalServices.map((service) => (
                      <tr key={service.id}>
                        <td>{service.id}</td>
                        <td>{service.type}</td>
                        <td>{service.dateIssued}</td>
                        <td>{service.duration}</td>
                        <td>{service.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="dateIssued">Date Issued</label>
                <div className="date-input-wrapper">
                  <input
                    type="text"
                    id="dateIssued"
                    value={dateIssued}
                    onChange={(e) => setDateIssued(e.target.value)}
                    placeholder="dd/mm/yy"
                  />
                  <img src={CalendarInputIcon || "/placeholder.svg"} alt="Calendar" className="calendar-icon" />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="terminationDate">Termination Date</label>
                <div className="date-input-wrapper">
                  <input
                    type="text"
                    id="terminationDate"
                    value={terminationDate}
                    onChange={(e) => setTerminationDate(e.target.value)}
                    placeholder="dd/mm/yy"
                  />
                  <img src={CalendarInputIcon || "/placeholder.svg"} alt="Calendar" className="calendar-icon" />
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="contractDescription">Contract Description</label>
                <textarea
                  id="contractDescription"
                  value={contractDescription}
                  onChange={(e) => setContractDescription(e.target.value)}
                  placeholder="Enter contract description"
                />
              </div>

              <div className="form-group">
                <label htmlFor="contractStatus">Contract Status</label>
                <div className="select-wrapper">
                  <input
                    type="text"
                    id="contractStatus"
                    value={contractStatus}
                    onChange={(e) => setContractStatus(e.target.value)}
                    placeholder="Select status"
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
          <button className="update-modal-button" onClick={handleCreate}>
            Create
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreateContractModal

