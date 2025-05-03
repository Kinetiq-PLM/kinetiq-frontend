"use client"

import { useRef, useEffect, useState } from "react"
import ExitIcon from "/icons/SupportServices/ExitIcon.png"
import CalendarInputIcon from "/icons/SupportServices/CalendarInputIcon.png"
import ServiceAnalysisIcon from "/icons/SupportServices/ServiceAnalysisIcon.png"

import { GET } from "../../api/api"

const AddServiceAnalysisModal = ({ isOpen, onClose, request, onAdd, technician }) => {
  const [requestId, setRequestId] = useState(request.service_request_id)
  const [technicianId, setTechnicianId] = useState(technician)
  // const [technicianId, setTechnicianId] = useState('HR-EMP-2025-8d9f9b')
  const [analysisDate, setAnalysisDate] = useState("")
  const [analysisStatus, setAnalysisStatus] = useState("")
  const customerId = request?.customer?.customer_id || "";
  const name = request?.customer?.name || "";
  const emailAddress = request?.customer?.email_address || "";
  const phoneNumber = request?.customer?.phone_number || "";
  const address = request.customer
    ? `${request.customer.address_line1 || ""} ${request.customer.address_line2 || ""}`.trim()
    : "";
  const productId = request?.service_call?.product?.item_id || "";
  
  const [contractId, setContractId] = useState("")
  const [terminationDate, setTerminationDate] = useState("")
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [errorModalMessage, setErrorModalMessage] = useState("")

  const dateInputRef = useRef();

  const toggleDatePicker = () => {
    const dateInput = dateInputRef.current;

    if (!dateInput || dateInput.disabled || dateInput.readOnly) return;

    dateInput.showPicker?.();
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

  const statusRef = useRef(null);
  const contractRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
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
                <label htmlFor="requestId">Request ID</label>
                <div className="select-wrapper">
                  <input
                    type="text"
                    id="requestId"
                    value={requestId}
                    readOnly
                    placeholder="Enter request ID"
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="technicianId">Technician ID</label>
                <div className="select-wrapper">
                  <input
                    type="text"
                    id="technicianId"
                    value={technicianId}
                    readOnly
                    placeholder="Enter technician ID"
                  />
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
                      <ul className="dropdown-list dropdown-list">
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
                    placeholder="Enter termination date"
                  />
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
                    ref={dateInputRef}
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
                    <ul className="dropdown-list status-dropdown-list">
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
            Schedule
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

