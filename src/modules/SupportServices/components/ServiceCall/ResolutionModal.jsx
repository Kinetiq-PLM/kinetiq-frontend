"use client"

import { useState, useEffect } from "react"
import ExitIcon from "/icons/SupportServices/ExitIcon.png"
import ServiceCallIcon from "/icons/SupportServices/ServiceCallIcon.png"

const ResolutionModal = ({ isOpen, onClose, onUpdate, onShowGeneral, onShowRequest, onShowRenewal, callData }) => {
  const [resolutionDetails, setResolutionDetails] = useState("")
  const [wasResolved, setWasResolved] = useState("No")
  const [activeTab, setActiveTab] = useState("resolution")
  const [isResolvedDD, setOpenResolvedDD] = useState(false);
  const [callId, setCallId] = useState("")
  const [customerId, setCustomerId] = useState("")
  const [productId, setProductId] = useState("")
  const [contractNo, setContractNo] = useState("")
  const [callType, setCallType] = useState("")
  const [ticketId, setTicketId] = useState("")
  const [status, setStatus] = useState("")
  const [priority, setPriority] = useState("")

  useEffect(() => {
    if (callData) {
      console.log("asdasd", callData)
      // Reset all fields to empty to show placeholders
      setResolutionDetails(callData.resolution || "")
      setCallId(callData.service_call_id || "")
      setCustomerId(callData.customer?.customer_id || "")
      setStatus(callData.call_status || "")
      setPriority(callData.priority_level || "")
      setTicketId(callData.service_ticket?.ticket_id || "")
      setProductId(callData.product?.product_id || "");
      setContractNo(callData.contract?.contract_id || "")
      setCallType(callData.call_type || "")
    }
  }, [callData])

  const handleSubmit = () => {
    onUpdate({
      service_call_id: callId,
      customer_id: customerId,
      product_id: productId,
      contract_id: contractNo,
      call_type: callType,
      ticket_id: ticketId,
      call_status: status,
      priority_level: priority,
      resolution: resolutionDetails
    })
  }

  // handle status
  const handleResolvedDropdown = () => {
    setOpenResolvedDD((prev) => !prev); 
  };

  const handleSelectResolved = (selectedResolved) => {
    setWasResolved(selectedResolved); 
    setOpenResolvedDD(false); 
  };

  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div className="modal-container service-resolution-modal">
        <div className="modal-header">
          <div className="modal-header-left">
            <img
              src={ServiceCallIcon || "/placeholder.svg?height=24&width=24"}
              alt="Service Call"
              className="modal-header-icon"
            />
            <h2>Service Call</h2>
          </div>
          <button className="close-button" onClick={onClose}>
            <img src={ExitIcon || "/placeholder.svg?height=24&width=24"} alt="Close" />
          </button>
        </div>

        <div className="modal-header-divider"></div>

        <div className="modal-tabs">
          <div className={`modal-tab ${activeTab === "general" ? "active" : ""}`} onClick={onShowGeneral}>
            General
          </div>
          <div
            className={`modal-tab ${activeTab === "resolution" ? "active" : ""}`}
            onClick={() => setActiveTab("resolution")}
          >
            Resolution
          </div>
        </div>

        <div className="modal-content">
          <textarea
            className="resolution-textarea"
            placeholder="Enter any additional details..."
            value={resolutionDetails}
            onChange={(e) => setResolutionDetails(e.target.value)}
          />
        </div>

        <div className="resolution-footer">
          <label htmlFor="wasResolved">Was it resolved?</label>
          <div className="form-group">
            <div className="resolution-footer-left">
                <div className="select-wrapper">
                  <input
                    type="text"
                    id="wasResolved"
                    value={wasResolved}
                    readOnly
                    onChange={(e) => setWasResolved(e.target.value)}
                    placeholder="Select"
                  />
                  <span className="select-arrow" onClick={handleResolvedDropdown}>▼</span>
                  {isResolvedDD && (
                    <ul className="dropdown-list">
                      {["Yes", "No"].map((res) => (
                        <li key={res} onClick={() => handleSelectResolved(res)}>
                          {res}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <button 
                  className={`service-request-button ${wasResolved === "Yes" ? "disabled" : ""}`} 
                  onClick={onShowRequest}
                  disabled={wasResolved === "Yes"}
                >
                Service Request
              </button>
              <button 
                  className={`service-renewal-button ${wasResolved === "Yes" ? "disabled" : ""}`} 
                  onClick={onShowRenewal}
                  disabled={wasResolved === "Yes"}
                >
                Renewal
              </button>
              </div>
              <div className="resolution-footer-right">
                <button className="cancel-button" onClick={onClose}>
                  Cancel
                </button>
                <button className="update-modal-button" onClick={handleSubmit}>
                  Update
                </button>
              </div>                   
          </div>
          
        </div>
      </div>
    </div>
  )
}

export default ResolutionModal

