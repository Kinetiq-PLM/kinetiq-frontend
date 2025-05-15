"use client"

import { useRef, useState, useEffect } from "react"
import ExitIcon from "/icons/SupportServices/ExitIcon.png"
import ServiceReportIcon from "/icons/SupportServices/ServiceReportIcon.png"
import BillingDetails from "./BillingDetails"

import { GET } from "../../api/api"

const UpdateReportModal = ({ isOpen, onClose, onUpdate, report, technician }) => {
  const [tickets, setTickets] = useState([]);
  const [isTixDropdown, setOpenTixDD] = useState(false);
  const [calls, setCalls] = useState([]);
  const [isCallDropdown, setOpenCallDD] = useState(false);
  const [requests, setRequests] = useState([]);
  const [isReqDropdown, setOpenReqDD] = useState(false);
  const [renewals, setRenewals] = useState([]); 
  const [isRenewalDropdown, setOpenRenewalDD] = useState(false);
  const [billings, setBillings] = useState([]); 
  const [isBillingDropdown, setOpenBillingDD] = useState(false);
  const [isOpenStatusDD, setOpenStatusDD] = useState(false);
  const [technicians, setTechnicians] = useState([]);
  const [isTechDropdown, setOpenTechDD] = useState(false);
  
  const [formData, setFormData] = useState({
    ticketId: "",
    callId: "",
    requestId: "",
    requestType: "",
    renewalId: "",
    billingId: "",
    description: "",
    reportStatus: "",
    technicianId: "",
  })

  // Update form when report changes
  useEffect(() => {
    console.log("rep:", report)
    if (report) {
      setFormData({
        reportId: report.report_id || "",
        ticketId: report.service_ticket?.ticket_id || "",
        callId: report.service_call?.service_call_id || "",
        requestId: report.service_request?.service_request_id  || "",
        requestType: report.service_request?.request_type || "",
        renewalId: report.renewal?.renewal_id || "",
        billingId: report.service_billing?.service_billing_id || "",
        description: report.description || "",
        reportStatus: report.report_status  || "",
        technicianId: report.technician?.employee_id || ""
      })
    }
  }, [report])

  const fetchTickets = async () => {
    try {
      const data = await GET("ticket/");
      setTickets(data);
    } catch (error) {
      console.error("Error fetching tickets:", error)
    }
  }

  const handleToggleTickets = () => {
    if (!isTixDropdown) {
      fetchTickets(); 
    }
    setOpenTixDD(!isTixDropdown);
  };

  const handleSelectTix = (ticket) => {
    setFormData((prev) => ({
      ...prev,
      ticketId: ticket.ticket_id || ""
    }));
    setOpenTixDD(false);
  };

  const fetchCalls = async () => {
    try {
      const data = await GET(`call/ticket/${formData.ticketId}/`);
      setCalls(data);
    } catch (error) {
      console.error("Error fetching calls:", error)
    }
  }

  const handleToggleCalls = () => {
    if (!isCallDropdown) {
      fetchCalls(); 
    }
    setOpenCallDD(!isCallDropdown);
  };

  const handleSelectCall = (call) => {
    setFormData((prev) => ({
      ...prev,
      callId: call.service_call_id || ""
    }));
    setOpenCallDD(false);
  };

  const fetchRequests = async () => {
  try {
    const data = await GET(`request/call/${formData.callId}/`);
    setRequests(data);
  } catch (error) {
    console.error("Error fetching requests:", error);
  }
};

  const handleToggleRequests = () => {
    if (!isReqDropdown) {
      fetchRequests(); 
    }
    setOpenReqDD(!isReqDropdown);
  };

  const handleSelectReq = (request) => {
    setFormData((prev) => ({
      ...prev,
      requestId: request.service_request_id || "",
      requestType: request.request_type || "",
    }));
    setOpenReqDD(false);
  };

  const fetchRenewals = async () => {
    try {
      const data = await GET(`renewal/calls/${formData.callId}`);
      setRenewals(data);
    } catch (error) {
      console.error("Error fetching renewals:", error)
    }
  }

  const handleToggleRenewals = () => {
    if (!isRenewalDropdown) {
      fetchRenewals(); 
    }
    setOpenRenewalDD(!isRenewalDropdown);
  };

  const handleSelectRenewal = (renewal) => {
    setFormData((prev) => ({
      ...prev,
      renewalId: renewal.renewal_id || "",
    }));
    setOpenRenewalDD(false);
  };

  const fetchBillings = async () => {
    try {
      let data = await GET("billing/");
      if (formData.renewalId !== "") {
        data = await GET(`billing/billing-renewals/${formData.renewalId}/`);
      }  else if (formData.requestId !== "") {
        data = await GET(`billing/billing-requests/${formData.requestId}/`);
      }
      setBillings(data);
    } catch (error) {
      console.error("Error fetching service billings:", error)
    }
  }

  const handleToggleBillings = () => {
    if (!isBillingDropdown) {
      fetchBillings(); 
    }
    setOpenBillingDD(!isBillingDropdown);
  };

  const handleSelectBilling = (billing) => {
    setFormData((prev) => ({
      ...prev,
      billingId: billing.service_billing_id || "",
    }));
    setOpenBillingDD(false);
  };

  const handleToggleDropdownStatus = () => {
    setOpenStatusDD(!isOpenStatusDD);
  };
  
  const handleSelectStatus = (status) => {
    setFormData((prev) => ({
      ...prev,
      reportStatus: status,
    }));
    setOpenStatusDD(false); 
  };

  const fetchTechnicians = async () => {
    try {
      const response = await GET("call/calls/technicians/");
      setTechnicians(response);
    } catch (error) {
      console.error("Error fetching technicians:", error);
    }
  }

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  }

  const handleSubmit = () => {
    onUpdate({
      report_id: formData.reportId,
      service_ticket_id: formData.ticketId,
      service_call_id: formData.callId,
      service_request_id: formData.requestId,
      request_type: formData.requestType || "Other",
      renewal_id: formData.renewalId,
      service_billing_id: formData.billingId,
      description: formData.description,
      report_status: formData.reportStatus,
      technician_id: formData.technicianId
    })
  }

  const tixRef = useRef(null);
  const callRef = useRef(null);
  const reqRef = useRef(null);
  const renewalRef = useRef(null);
  const billingRef = useRef(null);
  const statusRef = useRef(null);
  const techRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tixRef.current && !tixRef.current.contains(event.target)) {
        setOpenTixDD(false);
      }
      if (callRef.current && !callRef.current.contains(event.target)) {
        setOpenCallDD(false); // Close the dropdown
      }
      if (reqRef.current && !reqRef.current.contains(event.target)) {
        setOpenReqDD(false); // Close the dropdown
      }
      if (renewalRef.current && !renewalRef.current.contains(event.target)) {
        setOpenRenewalDD(false); // Close the dropdown
      }
      if (billingRef.current && !billingRef.current.contains(event.target)) {
        setOpenBillingDD(false); // Close the dropdown
      }
      if (statusRef.current && !statusRef.current.contains(event.target)) {
        setOpenStatusDD(false); // Close the dropdown
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

  const [selectedBillingId, setSelectedBillingId] = useState("")
  const [showViewModal, setShowViewModal] = useState(false)

  const handleViewBilling = (billingId) => {
    setSelectedBillingId(billingId)
    setShowViewModal(true)
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <div className="modal-header-left">
            <img
              src={ServiceReportIcon || "/placeholder.svg?height=24&width=24"}
              alt="Service Report"
              className="modal-header-icon"
            />
            <h2>Update Report</h2>
          </div>
          <button className="close-button" onClick={onClose}>
            <img src={ExitIcon || "/placeholder.svg?height=16&width=16"} alt="Close" />
          </button>
        </div>
        <div className="modal-header-divider"></div>

        <div className="modal-content">
          <div className="modal-form">
            <div className="form-row">
              <div className="form-column">
                <div className="form-group">
                  <label htmlFor="ticketId">Ticket ID</label>
                  <div className="select-wrapper" ref={tixRef}>
                    <input
                      type="text"
                      id="ticketId"
                      value={formData.ticketId}
                      onChange={(e) => {
                        handleChange(e); 
                        setOpenTixDD(true);
                      }}
                      onClick={handleToggleTickets}
                      placeholder="Enter ticket ID"
                    />
                    <span className="select-arrow"  onClick={handleToggleTickets}>▼</span>
                    {isTixDropdown && (
                      <ul className="dropdown-list">
                        {tickets.length > 0 ? (
                          tickets
                            .filter((ticket) =>
                              ticket.ticket_id.toLowerCase().includes(formData.ticketId.toLowerCase())
                            )
                            .map((ticket) => (
                              <li key={ticket.ticket_id} onClick={() => handleSelectTix(ticket)}>
                                {ticket.ticket_id}
                              </li>
                            ))
                        ) : (
                          <li>No ticket ID found</li>
                        )}
                      </ul>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="callId">Call ID</label>
                  <div className="select-wrapper" ref={callRef}>
                    <input
                      type="text"
                      id="callId"
                      value={formData.callId}
                      onChange={handleChange}
                      placeholder="Enter Call ID"
                    />
                    <span className="select-arrow"  onClick={handleToggleCalls}>▼</span>
                    {isCallDropdown && (
                    <ul className="dropdown-list">
                      {calls.length > 0 ? (
                        calls.map((call) => (
                              <li key={call.service_call_id} onClick={() => handleSelectCall(call)}>
                                {call.service_call_id}
                              </li>
                            ))
                          ) : (
                            <li>No call ID found</li>
                          )}
                        </ul>
                  )}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="requestId">Request ID</label>
                  <div className="select-wrapper" ref={reqRef}>
                  <input
                    type="text"
                    id="requestId"
                    value={formData.requestId}
                    onChange={handleChange}
                    placeholder="Enter request ID"
                    disabled={formData.renewalId !== ""}
                    className={formData.renewalId !== "" ? "disabled-input" : ""}
                  />
                  <span className="select-arrow"  onClick={handleToggleRequests}>▼</span>
                    {isReqDropdown && (
                    <ul className="dropdown-list">
                      {requests.length > 0 ? (
                        requests.map((request) => (
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
                  <label htmlFor="requestType">Request Type</label>
                  <input
                    type="text"
                    id="requestType"
                    readOnly
                    value={formData.requestType}
                    onChange={handleChange}
                    placeholder="Enter request type"
                    disabled={formData.renewalId !== ""}
                    className={formData.renewalId !== "" ? "disabled-input" : ""}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="renewalId">Renewal ID</label>
                  <div className="select-wrapper" ref={renewalRef}>
                    <input
                      type="text"
                      id="renewalId"
                      value={formData.renewalId}
                      onChange={(e) => {
                        handleChange(e); 
                        setOpenRenewalDD(true);
                      }}
                      onClick={handleToggleRenewals}
                      placeholder="Enter renewal ID"
                      disabled={formData.requestId !== ""}
                      className={formData.requestId !== "" ? "disabled-input" : ""}
                    />
                    <span className="select-arrow"  onClick={handleToggleRenewals}>▼</span>
                    {isRenewalDropdown && (
                      <ul className="renewal-dropdown-list dropdown-list">
                        {renewals.length > 0 ? (
                          renewals
                            .filter((renewal) =>
                            renewal.renewal_id.toLowerCase().includes(formData.renewalId.toLowerCase())
                            )
                            .map((renewal) => (
                              <li key={renewal.renewal_id} onClick={() => handleSelectRenewal(renewal)}>
                                {renewal.renewal_id}
                              </li>
                            ))
                        ) : (
                          <li>No renewal ID found</li>
                        )}
                      </ul>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="billingId">Billing ID</label>
                  <div className="select-wrapper" ref={billingRef}>
                  <input
                    type="text"
                    id="billingId"
                    value={formData.billingId}
                    onChange={(e) => {
                      handleChange(e); 
                      setOpenBillingDD(true);
                    }}
                    onClick={handleToggleBillings}
                    placeholder="Enter billing ID"
                  />
                  <span className="select-arrow" onClick={handleToggleBillings}>▼</span>
                  {isBillingDropdown && (
                      <ul className="billing-dropdown-list dropdown-list">
                        {billings.length > 0 ? (
                          billings
                            .filter((billing) =>
                            billing.service_billing_id.toLowerCase().includes(formData.billingId.toLowerCase())
                            )
                            .map((billing) => (
                              <li key={billing.service_billing_id} onClick={() => handleSelectBilling(billing)}>
                                {billing.service_billing_id}
                              </li>
                            ))
                        ) : (
                          <li>No billing ID found</li>
                        )}
                      </ul>
                    )}
                  </div>
                  
                </div>
              </div>

              <div className="form-column">
                <div className="form-group description-group-submit">
                  <label htmlFor="description">Description</label>
                  <div className="textarea-container">
                    <textarea
                      id="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Enter description"
                      className="description-textarea"
                    />
                    <div className="custom-scrollbar-container">
                      <button className="scroll-arrow scroll-up">▼</button>
                      <div className="scroll-track">
                        <div className="scroll-thumb"></div>
                      </div>
                      <button className="scroll-arrow scroll-down">▼</button>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="reportStatus">Report Status</label>
                  <div className="select-wrapper" ref={statusRef}>
                    <input
                      type="text"
                      id="reportStatus"
                      readOnly
                      value={formData.reportStatus}
                      onChange={handleChange}
                      placeholder="Select status"
                    />
                    <span className="select-arrow" onClick={handleToggleDropdownStatus}>▼</span>
                    {isOpenStatusDD && (
                    <ul className="status-dropdown-list dropdown-list">
                      {["Draft", "Submitted"].map((status) => (
                        <li key={status} onClick={() => handleSelectStatus(status)}>
                          {status}
                        </li>
                      ))}
                    </ul>
                  )}
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="technicianId">
                    Technician ID
                  </label>
                  <div className="select-wrapper" ref={techRef}>
                    <input
                      type="text"
                      id="technicianId"
                      readOnly
                      value={formData.technicianId}
                      placeholder="Select technician ID"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="billingDetails">
                    Billing Details
                  </label>
                  <button 
                    className={`update-button ${formData.billingId !== "" ? "clickable" : "disabled"}`}
                    onClick={() => handleViewBilling(formData.billingId)}
                    disabled={formData.billingId === ""}  
                  >
                    View
                  </button>
              </div>
              </div>
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
      {showViewModal && (
        <BillingDetails
          isOpen={showViewModal}
          onClose={() => setShowViewModal(false)}
          billingId={selectedBillingId}
        />
      )}
    </div>
  )
}

export default UpdateReportModal

