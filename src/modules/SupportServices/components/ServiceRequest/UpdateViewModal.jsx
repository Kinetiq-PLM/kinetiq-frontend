"use client"

import { useState, useEffect } from "react"
import ExitIcon from "/icons/SupportServices/ExitIcon.png"
import ServiceRequestIcon from "/icons/SupportServices/ServiceRequestIcon.png"
import CalendarInputIcon from "/icons/SupportServices/CalendarInputIcon.png"

import { GET } from "../../api/api"

const UpdateViewModal = ({ isOpen, onClose, request, onUpdate }) => {
  const [technicians, setTechnicians] = useState([]);
  const [isTechDropdown, setOpenTechDD] = useState(false);
  const [isOpenStatusDD, setOpenStatusDD] = useState(false);
  const [isOpenTypeDD, setOpenTypeDD] = useState(false);

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
        console.log("request", request)
        let tech_name = ""; 
        if (request.technician) {
            tech_name = request.technician.first_name + " " + request.technician.last_name;
        }

        setFormData({
            id: request.service_request_id || "",
            callId: request.service_call?.service_call_id || "",
            customerId: request.customer?.customer_id || "",
            name: request.customer?.name || "",
            technicianId: request.technician?.employee_id || "",
            technicianName: tech_name, 
            requestDate: request.request_date || "",
            phoneNumber: request.customer?.phone_number || "",
            emailAddress: request.customer?.email_address || "",
            requestType: request.request_type || "",
            requestStatus: request.request_status || "",
            requestDescription: request.request_description || "",
            requestRemarks: request.request_remarks || "",
        });
    }
}, [request]);

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

  const handleChange = (e) => {
    const { id, value } = e.target;
  
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  
    if (id === "technicianId") {
      const matchedTechnician = technicians.find(
        (technician) => technician.employee_id === value
      );
  
      setFormData((prev) => ({
        ...prev,
        technicianId: value,
        technicianName: matchedTechnician
          ? `${matchedTechnician.first_name} ${matchedTechnician.last_name}`
          : "",
      }));
    }
  };
  
  const handleToggleDropdownTech = () => {
    if (!isTechDropdown) {
      fetchTechnicians();
    }
    setOpenTechDD(!isTechDropdown);
  };
  
  const handleSelectTechnician = (technician) => {
    setFormData((prev) => ({
      ...prev,
      technicianId: technician.employee_id,
      technicianName: `${technician.first_name} ${technician.last_name}`,
    }));
    setOpenTechDD(false);
  };

  const handleToggleDropdownStatus = () => {
    setOpenStatusDD(!isOpenStatusDD);
  };
  
  const handleSelectStatus = (status) => {
    setFormData((prev) => ({
      ...prev,
      requestStatus: status,
    }));
    setOpenStatusDD(false); 
  };

  const handleTypeDropdown = () => {
    setOpenTypeDD(!isOpenTypeDD);
  };
  
  const handleSelectType = (type) => {
    setFormData((prev) => ({
      ...prev,
      requestType: type,
    }));
    setOpenTypeDD(false); 
  };

  const handleSubmit = () => {
    onUpdate({
      ...request,
      service_request_id: formData.id,
      service_call_id: formData.callId,
      request_type: formData.requestType,
      request_status: formData.requestStatus,
      request_description: formData.requestDescription,
      request_remarks: formData.requestRemarks,
    })

    // reset form
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
  });
  }

  if (!isOpen || !request) return null

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <div className="modal-header-left">
            <img src={ServiceRequestIcon || "/placeholder.svg"} 
            alt="Service Request" 
            className="modal-header-icon" />
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
                readOnly
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
                 readOnly
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
                  onChange={(e) => {
                    handleChange(e); 
                    setOpenTechDD(true);
                  }}
                  onClick={handleToggleDropdownTech}
                  placeholder="Select technician ID"
                />
                <span className="select-arrow" onClick={handleToggleDropdownTech}>▼</span>
                {isTechDropdown && (
                      <ul className="dropdown-list">
                        {technicians.length > 0 ? (
                          technicians
                            .filter((technician) =>
                            technician.employee_id.toLowerCase().includes(formData.technicianId.toLowerCase())
                            )
                            .map((technician) => (
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
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                type="text"
                id="phoneNumber"
                value={formData.phoneNumber}
                readOnly
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
                readOnly
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
                readOnly
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
                  readOnly
                  onChange={handleChange}
                  placeholder="dd/mm/y"
                />
                {/* <img
                  src={CalendarInputIcon || "/placeholder.svg?height=16&width=16"}
                  alt="Calendar"
                  className="calendar-icon"
                /> */}
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
                  readOnly
                  placeholder="Select request status"
                />
                <span className="select-arrow" onClick={handleToggleDropdownStatus}>▼</span>
                {isOpenStatusDD && (
                    <ul className="dropdown-list">
                      {["Pending", "Approved", "Rejected", "In Progress"].map((status) => (
                        <li key={status} onClick={() => handleSelectStatus(status)}>
                          {status}
                        </li>
                      ))}
                    </ul>
                  )}
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
                  readOnly
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

