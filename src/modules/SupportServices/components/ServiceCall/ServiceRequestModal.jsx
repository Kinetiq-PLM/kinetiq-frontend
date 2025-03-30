"use client"

import { useState, useEffect } from "react"
import ExitIcon from "/icons/SupportServices/ExitIcon.png"
import ServiceCallIcon from "/icons/SupportServices/ServiceCallIcon.png"

import { GET } from "../../api/api"

const ServiceRequestModal = ({ isOpen, onClose, onSubmit, callData }) => {
  const [callId, setCallId] = useState("")
  const [technicianId, setTechnicianId] = useState("")
  const [technicianName, setTechnicianName] = useState("")
  const [requestType, setRequestType] = useState("")
  const [customerId, setCustomerId] = useState("")
  const [name, setName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [emailAddress, setEmailAddress] = useState("")
  const [requestDescription, setRequestDescription] = useState("")

  const [technicians, setTechnicians] = useState([]);
  const [isTechDropdown, setOpenTechDD] = useState(false);
  const [isOpenTypeDD, setOpenTypeDD] = useState(false);

  // Update form when callData changes
  useEffect(() => {
    if (callData) {
      console.log("asdasd", callData)
      // Reset all fields to empty to show placeholders
      setCallId(callData.service_call_id || "")
      setCustomerId(callData.customer?.customer_id || "")
      setName(callData.customer?.name || "");
      setPhoneNumber(callData.customer?.phone_number || "");
      setEmailAddress(callData.customer?.email_address || "");
    }
  }, [callData])

  const handleSubmitReq = () => {
    onSubmit({
      service_call_id: callId,
      customer_id: customerId,
      technician_id: technicianId,
      request_type: requestType,
      request_status: "Pending",
      request_description: requestDescription,
    })
    // reset form
    setCallId("")
    setTechnicianId("")
    setTechnicianName("")
    setRequestType("")
    setCustomerId("")
    setName("")
    setPhoneNumber("")
    setEmailAddress("")
    setRequestDescription("")
  }

  // fetches a list of techs
const fetchTechnicians = async () => {
    try {
      const response = await GET("/technicians/");
      console.log("techs", response)
      setTechnicians(response);
    } catch (error) {
      console.error("Error fetching technicians:", error);
    }
  };
  
  const handleToggleDropdownTech = () => {
    if (!isTechDropdown) {
      fetchTechnicians(); 
    }
    setOpenTechDD(!isTechDropdown);
  };
  
  const handleSelectTechnician = (technician) => {
    setTechnicianId(technician.employee_id); 
    setTechnicianName(technician.first_name + " " + technician.last_name);
    setOpenTechDD(false); 
  };

  const handletechnicianInput = (input) => {
    setTechnicianId(input); 
  
    const matchedTechnician = technicians.find(technician => technician.employee_id === input);
  
    if (matchedTechnician) {
      handleSelectTechnician(matchedTechnician); 
    } else {
      setTechnicianName(""); 
    }
  };

  // handle type
  const handleTypeDropdown = () => {
    setOpenTypeDD((prev) => !prev); 
  };

  const handleSelectType = (selectedType) => {
    setRequestType(selectedType); 
    setOpenTypeDD(false); 
  };

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
            <h2>Create a Service Request</h2>
          </div>
          <button className="close-button" onClick={onClose}>
            <img src={ExitIcon || "/placeholder.svg?height=24&width=24"} alt="Close" />
          </button>
        </div>
        <div className="modal-header-divider"></div>

        <div className="modal-content">
          <div className="modal-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="callId">Service Call ID</label>
                <input
                  type="text"
                  id="callId"
                  value={callId}
                  readOnly
                  onChange={(e) => setCallId(e.target.value)}
                  placeholder="Service call ID"
                />
              </div>
              <div className="form-group">
                <label htmlFor="customerId">Customer ID</label>
                <input
                  type="text"
                  id="customerId"
                  value={customerId}
                  readOnly
                  onChange={(e) => setCustomerId(e.target.value)}
                  placeholder="Customer ID"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="technicianId">Technician ID <span className="required">*</span></label>
                <div className="select-wrapper">
                <input
                  type="text"
                  id="technicianId"
                  value={technicianId}
                  //readOnly
                  onChange={(e) => handletechnicianInput(e.target.value)}
                  placeholder="Select technician ID"
                />
                <span className="select-arrow" onClick={handleToggleDropdownTech}>▼</span>
                { /* Dropdown List */}
                    {isTechDropdown && (
                      <ul className="dropdown-list">
                        {technicians.length > 0 ? (
                          technicians.map((technician) => (
                            <li key={technician.employee_id} onClick={() => handleSelectTechnician(technician)}>
                              {technician.employee_id}
                            </li>
                          ))
                        ) : (
                          <li>No technicians found</li>
                        )}
                      </ul>
                    )}
                </div>
                
              </div>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  readOnly
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter name"
                />
              </div>
            </div>

            <div className="form-row aligned-row">
              <div className="form-group">
                <label htmlFor="technicianName">Technician Name</label>
                <input
                  type="text"
                  id="technicianName"
                  value={technicianName}
                  readOnly
                  onChange={(e) => setTechnicianName(e.target.value)}
                  placeholder="Technician name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="phoneNumber">Phone Number</label>
                <input
                  type="text"
                  id="phoneNumber"
                  value={phoneNumber}
                  readOnly
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            <div className="form-row aligned-row">
                <div className="form-group">
                    <label htmlFor="requestType">Request Type</label>
                    <div className="select-wrapper">
                    <input
                        type="text"
                        id="requestType"
                        value={requestType}
                        readOnly
                        onChange={(e) => setRequestType(e.target.value)}
                        placeholder="Select request type"
                    />
                    <span className="select-arrow" onClick={handleTypeDropdown}>▼</span>
                    {isOpenTypeDD && (
                        <ul className="dropdown-list type-dropdown-list">
                        {["Repair", "Installation", "Maintenance", "Renewal", "Other"].map((type) => (
                            <li key={type} onClick={() => handleSelectType(type)}>
                            {type}
                            </li>
                        ))}
                        </ul>
                    )}
                    </div>
                </div>
                <div className="form-group">
                <label htmlFor="emailAddress">Email Address</label>
                <input
                  type="text"
                  id="emailAddress"
                  value={emailAddress}
                  readOnly
                  onChange={(e) => setEmailAddress(e.target.value)}
                  placeholder="Customer email address"
                />
              </div>
            </div>
            <div className="form-group req-desc">
                <label htmlFor="requestDescription">Request Description</label>
                <textarea
                  type="text"
                  id="requestDescription"
                  value={requestDescription}
                  onChange={(e) => setRequestDescription(e.target.value)}
                  placeholder="Enter request description"
                />
              </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button className="update-modal-button" onClick={handleSubmitReq}>
            Submit for Approval
          </button>
        </div>
      </div>
    </div>
  )
}

export default ServiceRequestModal

