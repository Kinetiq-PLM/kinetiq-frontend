"use client"

import { useRef, useState, useEffect } from "react"
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
  const [showModal, setShowModal] = useState(false);
  const [userId, setUserId] = useState("")

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
    if (callData?.call_status === "Closed") {
        setShowModal(true);
        return; // Stop execution
    }
    
    const today = new Date().toISOString().split("T")[0];

    onSubmit({
      service_call_id: callId,
      customer_id: customerId,
      technician_id: technicianId,
      request_type: requestType,
      request_status: "Pending",
      request_date: today,
      request_description: requestDescription,
      userId: userId
    })
  }

  // fetches a list of techs
  const fetchTechnicians = async () => {
      try {
        // all:
        // const response = await GET("call/calls/technicians/");
        // only field techs
        const response = await GET("call/calls/field-techs/");
        console.log("techs", response)
        setTechnicians(response);
      } catch (error) {
        console.error("Error fetching technicians:", error);
      }
    };

    const fetchUserId = async (techId) => {
      try {
        const response = await GET(`call/calls/user/${techId}`); 
        setUserId(response.user_id);
        console.log("user id", response.user_id)
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
  
  const handleToggleDropdownTech = () => {
    if (!isTechDropdown) {
      fetchTechnicians();
      setOpenTechDD(true); 
    }
    setOpenTechDD(!isTechDropdown);
  };
  
  const handleSelectTechnician = (technician) => {
    fetchUserId(technician.employee_id)
    setTechnicianId(technician.employee_id); 
    setTechnicianName(technician.first_name + " " + technician.last_name);
    setOpenTechDD(false); 
  };

  // handle type
  const handleTypeDropdown = () => {
    setOpenTypeDD((prev) => !prev); 
  };

  const handleSelectType = (selectedType) => {
    setRequestType(selectedType); 
    setOpenTypeDD(false); 
  };

  const techRef = useRef(null);
  const typeRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (typeRef.current && !typeRef.current.contains(event.target)) {
        setOpenTypeDD(false); // Close the dropdown
      }
      if (techRef.current && !techRef.current.contains(event.target)) {
        setOpenTechDD(false); // Close the dropdown
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
                <div className="select-wrapper" ref={techRef}>
                <input
                  type="text"
                  id="technicianId"
                  value={technicianId}
                  onChange={(e) => {
                    setTechnicianId(e.target.value);
                    setOpenTechDD(true);
                  }}
                  onClick = {handleToggleDropdownTech}
                  placeholder="Select technician ID"
                />
                <span className="select-arrow" onClick={handleToggleDropdownTech}>▼</span>
                {isTechDropdown && (
                        <ul className="dropdown-list">
                          {technicians.length > 0 ? (
                            technicians
                              .filter((technician) =>
                                technician.employee_id.toLowerCase().includes(technicianId.toLowerCase())
                              )
                              .slice(0, 1)
                              .map((technician) => (
                                <li key={technician.employee_id} onClick={() => handleSelectTechnician(technician)}>
                                  {technician.employee_id}
                                </li>
                              ))
                          ) : (
                            <li>No technicians ID found</li>
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
                    <label htmlFor="requestType">Request Type <span className="required">*</span></label>
                    <div className="select-wrapper" ref={typeRef}>
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
                        {["Repair", "Installation", "Maintenance", "Other"].map((type) => (
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
                <label htmlFor="requestDescription">Request Description <span className="required">*</span></label>
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
          <button 
            className={`update-button ${
              technicianId && requestType ? "clickable" : "disabled"
            }`}
            onClick={handleSubmitReq}
            disabled={!(technicianId && requestType )}
          >
            Submit for Approval
          </button>
        </div>
      </div>

      {showModal && (
        <div className="alert-modal-overlay">
          <div className="alert-modal-content">
            <h2>⚠  WARNING</h2>
            <p>Service call already has an existing service request.</p>
            <button className="alert-okay-button" onClick={() => setShowModal(false)}>OK</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ServiceRequestModal

