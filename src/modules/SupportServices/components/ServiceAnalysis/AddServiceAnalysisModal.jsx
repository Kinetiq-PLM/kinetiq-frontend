"use client"

import { useRef, useEffect, useState } from "react"
import ExitIcon from "/icons/SupportServices/ExitIcon.png"
import CalendarInputIcon from "/icons/SupportServices/CalendarInputIcon.png"
import ServiceAnalysisIcon from "/icons/SupportServices/ServiceAnalysisIcon.png"

import { GET } from "../../api/api"

const AddServiceAnalysisModal = ({ isOpen, onClose, onAdd }) => {
  const [requestId, setRequestId] = useState("")
  const [technicianId, setTechnicianId] = useState("")
  const [analysisDate, setAnalysisDate] = useState("")
  const [analysisStatus, setAnalysisStatus] = useState("")
  const [customerId, setCustomerId] = useState("")
  const [name, setName] = useState("")
  const [emailAddress, setEmailAddress] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [address, setAddress] = useState("")
  const [productId, setProductId] = useState("")
  const [contractId, setContractId] = useState("")
  const [terminationDate, setTerminationDate] = useState("")
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [errorModalMessage, setErrorModalMessage] = useState("")

  const [requestStatus, setRequestStatus] = useState("")

  const [requests, setRequests] = useState([]);
  const [isReqDropdown, setOpenReqDD] = useState(false);
  
  const fetchRequests = async () => {
    try {
      const data = await GET("request/");
      setRequests(data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };
  
    const handleToggleRequests = () => {
      if (!isReqDropdown) {
        fetchRequests(); 
        setOpenReqDD(true);
      }
      setOpenReqDD(!isReqDropdown);
    };
  
    const handleSelectReq = (request) => {
      setRequestId(request.service_request_id);
      setCustomerId(request.customer?.customer_id || "");
      setName(request.customer?.name || "");
      setEmailAddress(request.customer?.email_address || "");
      setAddress(request.customer ? `${request.customer.address_line1 || ""} ${request.customer.address_line2 || ""}`.trim() : "")
      setPhoneNumber(request.customer?.phone_number || "");
      setProductId(request.service_call?.product?.product_id || "");

      setRequestStatus(request?.request_status || "")
      setOpenReqDD(false);
    };

    const [technicians, setTechnicians] = useState([]);
    const [isTechDropdown, setOpenTechDD] = useState(false);

    const fetchTechnicians = async () => {
      try {
        const response = await GET("call/calls/technicians/");;
        setTechnicians(response);
      } catch (error) {
        console.error("Error fetching technicians:", error);
      }
    }
  
    const handleToggleDropdownTech = () => {
      if (!isTechDropdown) {
        fetchTechnicians(); 
        setOpenTechDD(true);
      }
      setOpenTechDD(!isTechDropdown);
    };
  
    const handleSelectTechnician = (technician) => {
      setTechnicianId(technician.employee_id);
      setOpenTechDD(false);
    };

    const [isPickerOpen, setIsPickerOpen] = useState(false);

    const toggleDatePicker = () => {
      const dateInput = document.getElementById("analysisDate");
      if (isPickerOpen) {
        dateInput.blur(); 
      } else {
        dateInput.showPicker(); 
      }
      
      setIsPickerOpen(!isPickerOpen); 
    };

    const [isOpenStatusDD, setOpenStatusDD] = useState(false);

    const handleStatusDropdown = () => {
      setOpenStatusDD((prev) => !prev); 
    };
  
    const handleSelectStatus = (selectedStatus) => {
      setAnalysisStatus(selectedStatus); 
      setOpenStatusDD(false); 
    };

    const [contracts, setContracts] = useState([]);
    const [isContractDropdown, setOpenContractDD] = useState(false);

    const fetchContracts = async () => {
      try {
        const response = await GET(`contract/contracts/${productId}/${customerId}`); 
        console.log("contracts", response)
        setContracts(response);
      } catch (error) {
        console.error("Error fetching contracts:", error);
      }
    };
  
    const handleToggleDropdownContract = () => {
      if (!isContractDropdown) {
        fetchContracts(); 
      }
      setOpenContractDD(!isContractDropdown);
    };
  
    const handleSelectContract = (contract) => {
      setContractId(contract.contract_id); 
      setTerminationDate(contract.end_date)
      setOpenContractDD(false); 
    };

  const handleAdd = () => {
    if (requestStatus !== "Approved") {
      setErrorModalMessage("Cannot schedule a service analysis for a request that is not approved yet!"); 
      setShowErrorModal(true);  
    }

    onAdd({
      service_request_id: requestId,
      analysis_date: analysisDate,
      technician_id: technicianId,
      customer_id: customerId,
      analysis_status: analysisStatus,
      product_id: productId,
      contract_id: contractId,
    })
  }

  const requestRef = useRef(null);
  const statusRef = useRef(null);
  const techRef = useRef(null);
  const contractRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (requestRef.current && !requestRef.current.contains(event.target)) {
        setOpenReqDD(false); // Close the dropdown
      }
      if (techRef.current && !techRef.current.contains(event.target)) {
        setOpenTechDD(false); // Close the dropdown
      }
      if (statusRef.current && !statusRef.current.contains(event.target)) {
        setOpenStatusDD(false); // Close the dropdown
      }
      if (contractRef.current && !contractRef.current.contains(event.target)) {
        setOpenContractDD(false); // Close the dropdown
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
      <div className="modal-container">
        <div className="modal-header" style={{ borderBottom: "2px solid #00a8a8" }}>
          <div className="modal-header-left">
            <img
              src={ServiceAnalysisIcon || "/placeholder.svg?height=24&width=24"}
              alt="Service Analysis"
              className="modal-header-icon"
            />
            <h2>Add Service Analysis</h2>
          </div>
          <button className="close-button" onClick={onClose}>
            <img src={ExitIcon || "/placeholder.svg?height=20&width=20"} alt="Close" />
          </button>
        </div>

        <div className="modal-content">
          <div className="modal-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="requestId">Request ID <span className="required">*</span></label>
                <div className="select-wrapper" ref={requestRef}>
                  <input
                    type="text"
                    id="requestId"
                    value={requestId}
                    onChange={(e) => {
                      setRequestId(e.target.value);
                      setOpenReqDD(true)
                    }}
                    onClick={handleToggleRequests}
                    placeholder="Enter request ID"
                  />
                  <span className="select-arrow" onClick={handleToggleRequests} >▼</span>
                  {isReqDropdown && (
                  <ul className="dropdown-list">
                    {requests.length > 0 ? (
                      requests
                        .filter((request) =>
                        request.service_request_id.toLowerCase().includes(requestId.toLowerCase())
                        )
                        .map((request) => (
                          <li key={request.service_request_id} onClick={() => handleSelectReq(request)}>
                            {request.service_request_id}
                          </li>
                        ))
                    ) : (
                      <li>No request ID found</li>
                    )}
                  </ul>
                )}
                </div>
              </div>
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
                    placeholder="Enter technician ID"
                  />
                  <span className="select-arrow" onClick={handleToggleDropdownTech}>▼</span>
                      {isTechDropdown && (
                        <ul className="dropdown-list">
                          {technicians.length > 0 ? (
                            technicians
                              .filter((technician) =>
                                technician.employee_id.toLowerCase().includes(technicianId.toLowerCase())
                              )
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
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="analysisDate">Analysis Date <span className="required">*</span></label>
                <div className="date-input-wrapper">
                  <input
                    type="date"
                    id="analysisDate"
                    value={analysisDate}
                    onChange={(e) => setAnalysisDate(e.target.value)}
                    placeholder="Enter analysis date"
                  />
                  <img
                    src={CalendarInputIcon || "/placeholder.svg?height=16&width=16"}
                    alt="Calendar"
                    className="calendar-icon"
                    onClick={toggleDatePicker}
                    style={{ cursor: "pointer" }}
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="analysisStatus">Analysis Status <span className="required">*</span></label>
                <div className="select-wrapper" ref={statusRef}>
                  <input
                    type="text"
                    id="analysisStatus"
                    readOnly
                    value={analysisStatus}
                    onChange={(e) => setAnalysisStatus(e.target.value)}
                    placeholder="Enter analysis status"
                  />
                  <span className="select-arrow" onClick={handleStatusDropdown}>▼</span>
                  {isOpenStatusDD && (
                    <ul className="dropdown-list">
                      {["Scheduled", "Done"].map((status) => (
                        <li key={status} onClick={() => handleSelectStatus(status)}>
                          {status}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="customerId">Customer ID</label>
                <input
                  type="text"
                  id="customerId"
                  readOnly
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  placeholder="Enter customer ID"
                />
              </div>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  readOnly
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter name"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="emailAddress">Email Address</label>
                <input
                  type="email"
                  id="emailAddress"
                  readOnly
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  placeholder="Enter email address"
                />
              </div>
              <div className="form-group">
                <label htmlFor="productId">Product ID</label>
                <input
                  type="text"
                  id="productId"
                  readOnly
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  placeholder="Enter product ID"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phoneNumber">Number</label>
                <input
                  type="text"
                  id="phoneNumber"
                  readOnly
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter phone number"
                />
              </div>
              <div className="form-group">
                <label htmlFor="contractId">Contract ID</label>
                <div className="select-wrapper" ref={contractRef}>
                  <input
                    type="text"
                    id="contractId"
                    readOnly
                    value={contractId}
                    onChange={(e) => setContractId(e.target.value)}
                    placeholder="Enter contract ID"
                  />
                  <span className="select-arrow" onClick={handleToggleDropdownContract}>▼</span>
                    {isContractDropdown && (
                      <ul className="dropdown-list">
                        {contracts.length > 0 ? (
                          contracts.map((contract) => (
                            <li key={contract.contract_id} onClick={() => handleSelectContract(contract)}>
                              {contract.contract_id}
                            </li>
                          ))
                        ) : (
                          <li>No contracts found</li>
                        )}
                      </ul>
                    )}
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  id="address"
                  readOnly
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter address"
                />
              </div>
              <div className="form-group">
                <label htmlFor="terminationDate">Termination Date</label>
                <div className="date-input-wrapper">
                  <input
                    type="text"
                    id="terminationDate"
                    value={terminationDate}
                    readOnly
                    onChange={(e) => setTerminationDate(e.target.value)}
                    placeholder="Enter termination date"
                  />
                  {/* <img
                    src={CalendarInputIcon || "/placeholder.svg?height=16&width=16"}
                    alt="Calendar"
                    className="calendar-icon"
                  /> */}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button 
            className={`update-button ${
              requestId && analysisDate && technicianId && analysisStatus ? "clickable" : "disabled"
            }`}
            onClick={handleAdd}
            disabled={!(requestId && analysisDate && technicianId && analysisStatus)}
          >
            Add
          </button>
        </div>
      </div>
      {showErrorModal && (
        <div className="alert-modal-overlay">
          <div className="alert-modal-content">
            <h2>ERROR</h2>
            <p>{errorModalMessage}</p>
            <button className="alert-okay-button" onClick={() => setShowErrorModal(false)}>OK</button>
          </div>
        </div>
      )} 
    </div>
  )
}

export default AddServiceAnalysisModal

