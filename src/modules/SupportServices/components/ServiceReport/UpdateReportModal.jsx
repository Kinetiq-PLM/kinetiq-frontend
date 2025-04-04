"use client"

import { useState, useEffect } from "react"
import ExitIcon from "/icons/SupportServices/ExitIcon.png"
import ServiceReportIcon from "/icons/SupportServices/ServiceReportIcon.png"

import { GET } from "../../api/api"

const UpdateReportModal = ({ isOpen, onClose, onUpdate, report }) => {
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
      const data = await GET("tickets/");
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
      const data = await GET(`service-calls/${formData.ticketId}/ticket`);
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
    const data = await GET(`service-requests/${formData.callId}/call`);
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
      const data = await GET("renewals/");
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
      const data = await GET("service-billings/");
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
      const response = await GET("/technicians/");;
      setTechnicians(response);
    } catch (error) {
      console.error("Error fetching technicians:", error);
    }
  }

  const handleToggleDropdownTech = () => {
    if (!isTechDropdown) {
      fetchTechnicians(); 
    }
    setOpenTechDD(!isTechDropdown);
  };

  const handleSelectTechnician = (technician) => {
    setFormData((prev) => ({
      ...prev,
      technicianId: technician.employee_id || "",
    }));
    setOpenTechDD(false);
  };

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
      request_type: formData.requestType,
      renewal_id: formData.renewalId,
      service_billing_id: formData.billingId,
      description: formData.description,
      report_status: formData.reportStatus,
      technician_id: formData.technicianId
    })
    setFormData({
      reportId: "",
      ticketId: "",
      callId: "",
      requestId: "",
      requestType: "",
      renewalId: "",
      billingId: "",
      technicianName: "",
      description: "",
      reportStatus: "",
      technicianId: ""
    });
  
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
            <h2>Submit Report</h2>
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
                  <div className="select-wrapper">
                    <input
                      type="text"
                      id="ticketId"
                      value={formData.ticketId}
                      readOnly
                      onChange={handleChange}
                      placeholder="Enter ticket ID"
                    />
                    <span className="select-arrow"  onClick={handleToggleTickets}>▼</span>
                    {isTixDropdown && (
                    <ul className="dropdown-list">
                      {tickets.length > 0 ? (
                        tickets.map((ticket) => (
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
                  <div className="select-wrapper">
                    <input
                      type="text"
                      id="callId"
                      value={formData.callId}
                      readOnly
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
                  <div className="select-wrapper">
                  <input
                    type="text"
                    id="requestId"
                    readOnly
                    value={formData.requestId}
                    onChange={handleChange}
                    placeholder="Enter request ID"
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
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="renewalId">Renewal ID</label>
                  <div className="select-wrapper">
                    <input
                      type="text"
                      id="renewalId"
                      value={formData.renewalId}
                      readOnly
                      onChange={handleChange}
                      placeholder="Enter renewal ID"
                    />
                    <span className="select-arrow"  onClick={handleToggleRenewals}>▼</span>
                    {isRenewalDropdown && (
                    <ul className="renewal-dropdown-list dropdown-list">
                      {renewals.length > 0 ? (
                        renewals.map((renewal) => (
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
                  <div className="select-wrapper">
                  <input
                    type="text"
                    id="billingId"
                    value={formData.billingId}
                    readOnly
                    onChange={handleChange}
                    placeholder="Enter billing ID"
                  />
                  <span className="select-arrow" onClick={handleToggleBillings}>▼</span>
                    {isBillingDropdown && (
                    <ul className="billing-dropdown-list dropdown-list">
                      {billings.length > 0 ? (
                        billings.map((billing) => (
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
                <div className="form-group description-group">
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
                  <div className="select-wrapper">
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
                      {["Draft", "Submitted", "Reviewed"].map((status) => (
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
                  Technician ID <span className="required">*</span>
                </label>
                <div className="select-wrapper">
                  <input
                    type="text"
                    id="technicianId"
                    value={formData.technicianId}
                    readOnly
                    onChange={handleChange}
                    placeholder="Select technician ID"
                  />
                  <span className="select-arrow" onClick={handleToggleDropdownTech}>▼</span>
                    {isTechDropdown && (
                      <ul className="technician-dropdown-list dropdown-list">
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
    </div>
  )
}

export default UpdateReportModal

