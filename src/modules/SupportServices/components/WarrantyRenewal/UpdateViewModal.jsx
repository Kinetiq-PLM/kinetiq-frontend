"use client"

import { useState, useEffect } from "react"
import ExitIcon from "/icons/SupportServices/ExitIcon.png"
import ServiceCallIcon from "/icons/SupportServices/ServiceCallIcon.png"
import CalendarInputIcon from "/icons/SupportServices/CalendarInputIcon.png"

import { GET } from "../../api/api"

const UpdateViewModal = ({ isOpen, onClose, onUpdate, renewalData }) => {
  const [renewalId, setRenewalId] = useState("")
  const [callId, setCallId] = useState("")
  const [productId, setProductId] = useState("")
  const [productName, setProductName] = useState("")
  const [contractId, setContractId] = useState("")
  const [customerId, setCustomerId] = useState("")
  const [name, setName] = useState("")
  const [renewalFee, setRenewalFee] = useState("")
  const [duration, setDuration] = useState("")
  const [renewalContractStart, setRenewalContractStart] = useState("")
  const [contractStatus, setContractStatus] = useState("")
  const [sellingPrice, setSellingPrice] = useState("")

  const [contracts, setContracts] = useState([]);
  const [isContractDropdown, setOpenContractDD] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Update form when callData changes
  useEffect(() => {
    if (renewalData) {
      console.log("asdasd", renewalData)
      // Reset all fields to empty to show placeholders
      setRenewalId(renewalData.renewal_id || "")
      setCallId(renewalData.service_call?.service_call_id || "")
      setCustomerId(renewalData.service_call?.customer?.customer_id || "")
      setName(renewalData.service_call?.customer?.name || "")
      setProductName(renewalData.service_call?.product?.product_name || "")
      setProductId(renewalData.service_call?.product?.product_id || "")
      setSellingPrice(renewalData.service_call?.product?.selling_price || "")
      setContractId(renewalData.contract?.contract_id || "")
      setContractStatus(renewalData.contract?.contract_status || "")
      setDuration(renewalData.duration)
      setRenewalContractStart(renewalData.renewal_warranty_start)
      setRenewalFee(renewalData.renewal_fee)
    }
  }, [renewalData])

  useEffect(() => {
    if (duration && sellingPrice) {
      const renewalRate = 0.20;
      const computedFee = (parseFloat(sellingPrice) * renewalRate) * parseInt(duration);
      setRenewalFee(computedFee.toFixed(2)); 
    } else {
      setRenewalFee(""); 
    }
  }, [duration, sellingPrice]);

  

  // fetches a list of techs
  const fetchContracts = async () => {
      try {
        const response = await GET(`contracts/${productId}/${customerId}/`);
        console.log("contracts", response)
        setContracts(response);
      } catch (error) {
        console.error("Error fetching contracts:", error);
      }
    };
  
  const handleToggleDDContract = () => {
    if (!isContractDropdown) {
      fetchContracts();
      setOpenContractDD(true); 
    }
    setOpenContractDD(!isContractDropdown);
  };
  
  const handleSelectContract = (contract) => {
    setContractId(contract.contract_id); 
    setContractStatus(contract.contract_status)
    setOpenContractDD(false)
  };

  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const toggleDatePicker = () => {
    const dateInput = document.getElementById("renewalContractStart");
    if (isPickerOpen) { 
      dateInput.blur(); 
    } else {
      dateInput.showPicker(); 
    }
    
    setIsPickerOpen(!isPickerOpen); 
  };

  const handleUpdate = () => {
    onUpdate({
      renewal_id: renewalId,
      contract_id: contractId,
      duration: duration,
      renewal_warranty_start: renewalContractStart,
      renewal_fee: renewalFee
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
            <h2>Update Warranty Renewal</h2>
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
                <label htmlFor="callId">Renewal ID</label>
                <input
                  type="text"
                  id="renewalId"
                  value={renewalId}
                  readOnly
                  onChange={(e) => setRenewalId(e.target.value)}
                  placeholder="Renewal ID"
                />
              </div>
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
            </div>

            <div className="form-row">
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
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  readOnly
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter product name"
                />
              </div>
            </div>

            <div className="form-row aligned-row">
            <div className="form-group">
                <label htmlFor="productId">Product ID </label>
                <div className="select-wrapper">
                <input
                  type="text"
                  id="productId"
                  value={productId}
                  readOnly
                  onChange={(e) => setProductId(e.target.value)}
                  placeholder="Enter product ID"
                />
                </div>
                
              </div>
              <div className="form-group">
                <label htmlFor="productName">Product Name </label>
                <div className="select-wrapper">
                <input
                  type="text"
                  id="productName"
                  value={productName}
                  readOnly
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="Product name"
                />
                </div>
                
              </div>
            </div>

            <div className="form-row aligned-row">
              <div className="form-group">
                  <label htmlFor="contractId">Contract ID</label>
                    <div className="select-wrapper">
                    <input
                      type="text"
                      id="contractId"
                      value={contractId}
                      readOnly
                      onChange={(e) => {
                        setContractId(e.target.value);
                        setOpenContractDD(true);
                      }}
                      onClick = {handleToggleDDContract}
                      placeholder="Select contract ID"
                    />
                    <span className="select-arrow" onClick={handleToggleDDContract}>▼</span>
                    {isContractDropdown && (
                            <ul className="dropdown-list">
                              {contracts.length > 0 ? (
                                contracts
                                  .filter((contract) =>
                                  contract.contract_id.toLowerCase().includes(contractId.toLowerCase())
                                  )
                                  .map((contract) => (
                                    <li key={contract.contract_id} onClick={() => handleSelectContract(contract)}>
                                      {contract.contract_id}
                                    </li>
                                  ))
                              ) : (
                                <li>No contracts ID found</li>
                              )}
                            </ul>
                          )}
                    </div>
                  </div>
                
                  <div className="form-group">
                    <label htmlFor="contractStatus">Contract Status</label>
                    <div className="select-wrapper">
                    <input
                        type="text"
                        id="contractStatus"
                        value={contractStatus}
                        readOnly
                        onChange={(e) => setContractStatus(e.target.value)}
                        placeholder="Expired"
                    />
                    </div>
                </div>
            </div>
            <div className="form-row aligned-row">
            <div className="form-group">
                <label htmlFor="renewalContractStart">Renewal Contract Start</label>
                <div className="date-input-wrapper">
                <input
                  type="date"
                  id="renewalContractStart"
                  value={renewalContractStart}
                  onChange={(e) => setRenewalContractStart(e.target.value)}
                  placeholder="Enter renewal contract start"
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
                <label htmlFor="duration">Duration</label>
                <input
                  type="text"
                  id="duration"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="Contract duration"
                />
              </div>
            </div>

            <div className="form-row aligned-row">
            <div className="form-group">
                <label htmlFor="productName">Product Price</label>
                <input
                  type="text"
                  id="sellingPrice"
                  value={sellingPrice}
                  readOnly
                  onChange={(e) => setSellingPrice(e.target.value)}
                  placeholder="Product price"
                />
              </div>
              <div className="form-group">
                    <label htmlFor="renewalFee">Renewal Fee</label>
                    <div className="select-wrapper">
                    <input
                        type="text"
                        id="renewalFee"
                        value={renewalFee}
                        readOnly
                        onChange={(e) => setRenewalFee(e.target.value)}
                        placeholder="0.00"
                    />
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
            className="update-modal-button"
            onClick={handleUpdate}
          >
            Update
          </button>
        </div>
      </div>

      {showModal && (
        <div className="alert-modal-overlay">
          <div className="alert-modal-content">
            <h2>⚠  WARNING</h2>
            <p>Service contract still currently active, cannot issue a contract renewal.</p>
            <button className="alert-okay-button" onClick={() => setShowModal(false)}>OK</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default UpdateViewModal

