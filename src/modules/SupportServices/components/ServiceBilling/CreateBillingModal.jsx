"use client"

import { useRef, useState, useEffect } from "react"
import ExitIcon from "/icons/SupportServices/ExitIcon.png"
import ServiceBillingIcon from "/icons/SupportServices/ServiceBillingIcon.svg"

import { GET } from "../../api/api"

const CreateBillingModal = ({ isOpen, onClose, onCreate, technician }) => {
  const [isOpenStatusDD, setOpenStatusDD] = useState(false);

  const [formData, setFormData] = useState({
    renewalId: "",
    renewalFee: "",
    requestId: "",
    requestType: "",
    analysisId: "",
    laborCost: "",
    orderId: "",
    orderTotalPrice: "",
    operationalCostId: "",
    totalOperationalCost: "",
    billingAmount: "",
    outsourceFee: "0.00",
    totalPayable: "",
    billingStatus: ""
  });

  useEffect(() => {
    const {
      laborCost,
      orderTotalPrice,
      outsourceFee,
      totalOperationalCost,
    } = formData;
  
  
    // Parse numeric values safely
    const labor = parseFloat(laborCost) || 0;
    const order = parseFloat(orderTotalPrice) || 0;
    const outsource = parseFloat(outsourceFee) || 0;
    const operational = parseFloat(totalOperationalCost) || 0;
  
    // Compute billing amount
    const billingAmount = labor + order;
  
    // Compute total payable
    const totalPayable = billingAmount + outsource + operational;
  
    setFormData((prev) => ({
      ...prev,
      billingAmount: billingAmount.toFixed(2),
      totalPayable: totalPayable.toFixed(2),
    }));
  }, [
    formData.laborCost,
    formData.orderTotalPrice,
    formData.outsourceFee,
    formData.totalOperationalCost
  ]);

  useEffect(() => {
    const {
      renewalFee,
    } = formData;
  
    // If renewal fee exists, it overrides totalPayable
    if (renewalFee) {
      setFormData((prev) => ({
        ...prev,
        billingAmount: "", // reset since not applicable
        totalPayable: renewalFee
      }));
      return;
    }
  }, [formData.renewalFee]);


  const reqDropdownRef = useRef(null);
  const renewalDropdownRef = useRef(null);
  const opCostDropdownRef = useRef(null);
  const statusDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (renewalDropdownRef.current && !renewalDropdownRef.current.contains(event.target)) {
        setOpenRenewal(false);
      }
      if (reqDropdownRef.current && !reqDropdownRef.current.contains(event.target)) {
        setRequestDropdown(false); // Close the dropdown
      }
      if (opCostDropdownRef.current && !opCostDropdownRef.current.contains(event.target)) {
        setOpenOpCost(false); // Close the dropdown
      }
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target)) {
        setOpenStatusDD(false); // Close the dropdown
      }

    };
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

const handleToggleDropdownStatus = () => {
  setOpenStatusDD(!isOpenStatusDD);
};

const handleSelectStatus = (status) => {
  setFormData((prev) => ({
    ...prev,
    billingStatus: status,
  }));
  setOpenStatusDD(false); 
};

const [renewals, setRenewals] = useState([]);
const [isRenewalDropdown, setOpenRenewal] = useState(false);

const fetchRenewals = async () => {
  try {
    const response = await GET(`renewal/renewals/technician/${technician}/`);
    // const response = await GET(`renewal/renewals/technician/HR-EMP-2025-a66f9c/`);
    //const response = await GET(`renewal/`); 
    console.log("renewals", response)
    setRenewals(response);
  } catch (error) {
    console.error("Error fetching renewals:", error);
  }
}

const handleToggleRenewals = () => {
  if (!isRenewalDropdown) {
    fetchRenewals(); 
  }
  setOpenRenewal(!isRenewalDropdown);
};

const handleSelectRenewal = (renewal) => {
  setFormData((prev) => ({
    ...prev,
    renewalId: renewal.renewal_id,
    renewalFee: renewal.renewal_fee,
    requestId: "",
    requestType: "",
    analysisId: "",
    laborCost: "",
    orderId: "",
    orderTotalPrice: "",
    operationalCostId: "",
    totalOperationalCost: "",
    totalPayable: renewal.renewal_fee,
  }));
  setOpenRenewal(false);
};

const [requests, setRequests] = useState([]);
const [isRequestDropdown, setRequestDropdown] = useState(false);

const fetchRequests = async () => {
  try {
    const response = await GET(`request/requests/technician/${technician}/`);
    // const response = await GET(`request/requests/technician/HR-EMP-2025-8d9f9b/`);
    //const response = await GET(`request/`); 
    console.log("requests", response)
    setRequests(response);
  } catch (error) {
    console.error("Error fetching requests:", error);
  }
}

const handleToggleRequest = () => {
  if (!isRequestDropdown) {
    fetchRequests(); 
  }
  setRequestDropdown(!isRequestDropdown);
};

const handleSelectRequest = (request) => {
  setFormData((prev) => ({
    ...prev,
    requestId: request.service_request_id,
    requestType: request.request_type 
  }));
  fetchAnalysis(request.service_request_id);
  setRequestDropdown(false);
};


const fetchAnalysis = async (requestId) => {
  try {
    const response = await GET(`analysis/request/${requestId}/`); 
    console.log("analyses", response)
    setFormData((prev) => ({
      ...prev,
      analysisId: response.analysis_id || "",
      laborCost: response?.labor_cost || ""
    }));
    fetchOrder(response.analysis_id)
  } catch (error) {
    setFormData((prev) => ({
      ...prev,
      analysisId: "",
      laborCost:  ""
    }));
    if (formData.orderId) {
      setFormData((prev) => ({
        ...prev,
        orderId: "",
        orderTotalPrice:  ""
      }));
    }
    console.error("Error fetching analyses:", error);
  }
}

const fetchOrder = async (analysisId) => {
  try {
    const response = await GET(`order/orders/${analysisId}/`); 
    console.log("orders", response)
    const data = response[0]
    setFormData((prev) => ({
      ...prev,
      orderId: data.service_order_id || "",
      orderTotalPrice:  data.order_total_price || "",
    }));
  } catch (error) {
    console.error("Error fetching orders:", error);
    setFormData((prev) => ({
      ...prev,
      orderId: "",
      orderTotalPrice:  ""
    }));
  }
}

const [operationalCosts, setOperationalCosts] = useState([]);
const [isOpCostDropdown, setOpenOpCost] = useState(false);

const fetchOpCosts = async () => {
  try {
    const response = await GET(`billing/billings/operational-costs/`); 
    console.log("operational costs", response)
    setOperationalCosts(response);
  } catch (error) {
    console.error("Error fetching operational costs:", error);
  }
}

const handleToggleOpCost = () => {
  if (!isOpCostDropdown) {
    fetchOpCosts(); 
  }
  setOpenOpCost(!isOpCostDropdown);
};

const handleSelectOpCost = (operationalCost) => {
  setFormData((prev) => ({
    ...prev,
    operationalCostId: operationalCost.operational_cost_id,
    totalOperationalCost: operationalCost?.total_operational_cost || ""
  }));
  setOpenOpCost(false);
};

const handleCreate = () => {
  console.log(formData);
  onCreate({
    service_request_id: formData.requestId,
    analysis_id: formData.analysisId,
    renewal_id: formData.renewalId,
    service_order_id: formData.orderId,
    operational_cost_id: formData.operationalCostId,
    outsource_fee: formData.outsourceFee,
    billing_status: formData.billingStatus,
    date_paid: formData.billingStatus === 'Paid' ? new Date().toISOString().split('T')[0] : null
  });
};

  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header" style={{ borderBottom: "2px solid #00a8a8" }}>
          <div className="modal-header-left">
            <img src={ServiceBillingIcon || "/placeholder.svg"} alt="Service Billing" className="modal-header-icon" />
            <h2>Create Service Billing</h2>
          </div>
          <button className="close-button" onClick={onClose}>
            <img src={ExitIcon || "/placeholder.svg"} alt="Close" />
          </button>
        </div>

        <div className="modal-content">
          <div className="modal-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="renewalId">Renewal ID</label>
                <div className="select-wrapper" ref={renewalDropdownRef}>
                  <input
                    type="text"
                    id="renewalId"
                    value={formData.renewalId}
                    onChange={(e) => {
                      handleChange(e); 
                      if (!formData.requestId) setOpenRenewal(true);
                    }}
                    onClick={() => {
                      if (!formData.requestId) handleToggleRenewals(); 
                    }}
                    placeholder="Renewal ID"
                    disabled={!formData.requestId}
                  />
                  <span
                    className="select-arrow"
                    onClick={() => {
                      if (!formData.requestId) handleToggleRenewals();
                    }}
                    style={{ cursor: formData.requestId ? "not-allowed" : "pointer", opacity: formData.requestId ? 0.5 : 1 }}
                  >
                    ▼
                  </span>
                  {isRenewalDropdown && !formData.requestId && (
                    <ul className="dropdown-list">
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
                <label htmlFor="renewalFee">Renewal Fee</label>
                <input
                  type="text"
                  id="renewalFee"
                  value={formData.renewalId ? formData.renewalFee : ""} 
                  readOnly
                  placeholder="Renewal fee"
                  disabled={formData.renewalId == ""} 
                  className={formData.renewalId == "" ? "disabled-input" : ""}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="requestId">Request ID</label>
                <div className="select-wrapper" ref={reqDropdownRef}>
                <input
                  type="text"
                  id="requestId"
                  value={formData.requestId}
                  onChange={(e) => {
                    handleChange(e); 
                    setRequestDropdown(true);
                  }}
                  onClick={handleToggleRequest}
                  placeholder="Request id"
                  disabled={formData.renewalId !== ""}
                  className={formData.renewalId !== "" ? "disabled-input" : ""}
                />
                  <span className="select-arrow" onClick={handleToggleRequest}>▼</span>
                  {isRequestDropdown && formData.renewalId === "" && (
                    <ul className="dropdown-list">
                      {requests.length > 0 ? (
                        requests
                          .filter((request) =>
                            request.service_request_id
                              .toLowerCase()
                              .includes(formData.requestId.toLowerCase())
                          )
                          .map((request) => (
                            <li key={request.service_request_id} onClick={() => handleSelectRequest(request)}>
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
                  value={formData.requestType}
                  readOnly
                  onChange={handleChange} 
                  placeholder="Request type"
                  disabled={formData.renewalId !== ""}
                  className={formData.renewalId !== "" ? "disabled-input" : ""}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="analysisId">Analysis ID</label>
                <div className="select-wrapper">
                  <input
                    type="text"
                    id="analysisId"
                    value={formData.analysisId}
                    onChange={(e) => {
                      handleChange(e); 
                    }}
                    readOnly
                    placeholder="Analysis ID"
                    disabled={formData.renewalId !== ""}
                    className={formData.renewalId !== "" ? "disabled-input" : ""}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="laborCost">Labor Cost</label>
                <input
                  type="text"
                  id="laborCost"
                  value={formData.laborCost}
                  readOnly
                  onChange={handleChange} 
                  placeholder="Labor Cost"
                  disabled={formData.renewalId !== ""}
                  className={formData.renewalId !== "" ? "disabled-input" : ""}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="orderId">Order ID</label>
                <div className="select-wrapper">
                  <input
                    type="text"
                    id="orderId"
                    value={formData.orderId}
                    onChange={(e) => {
                      handleChange(e); 
                    }}
                    placeholder="Order ID"
                    disabled={formData.renewalId !== ""}
                    className={formData.renewalId !== "" ? "disabled-input" : ""}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="orderTotalPrice">Order Total Price</label>
                <input
                  type="text"
                  id="orderTotalPrice"
                  value={formData.orderTotalPrice}
                  readOnly
                  onChange={handleChange} 
                  placeholder="Order total price"
                  disabled={formData.renewalId !== ""}
                  className={formData.renewalId !== "" ? "disabled-input" : ""}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="operationalCostId">Operational Cost ID</label>
                  <div className="select-wrapper" ref={opCostDropdownRef}>
                  <input
                      type="text"
                      id="operationalCostId"
                      value={formData.operationalCostId}
                      onChange={(e) => {
                        handleChange(e); 
                        setOpenOpCost(true);
                      }}
                      onClick={handleToggleOpCost}
                      placeholder="Total operational cost"
                      disabled={formData.renewalId !== ""}
                      className={formData.renewalId !== "" ? "disabled-input" : ""}
                    />
                    <span className="select-arrow" onClick={handleToggleOpCost}>▼</span>
                      {isOpCostDropdown && formData.renewalId === "" && (
                              <ul className="dropdown-list">
                                {operationalCosts.length > 0 ? (
                                  operationalCosts
                                    .filter((operationalCost) =>
                                    operationalCost.operational_cost_id.toLowerCase().includes(formData.operationalCostId.toLowerCase())
                                    )
                                    .map((operationalCost) => (
                                      <li key={operationalCost.operational_cost_id} onClick={() => handleSelectOpCost(operationalCost)}>
                                        {operationalCost.operational_cost_id}
                                      </li>
                                    ))
                                ) : (
                                  <li>No operational cost ID found</li>
                                )}
                              </ul>
                            )}
                  </div>
              </div>

              <div className="form-group">
                <label htmlFor="totalOperationalCost">Total Operational Cost</label>
                  <input
                    type="text"
                    id="totalOperationalCost"
                    value={formData.totalOperationalCost}
                    readOnly
                    onChange={handleChange} 
                    placeholder="Total operational cost"
                    disabled={formData.renewalId !== ""}
                    className={formData.renewalId !== "" ? "disabled-input" : ""}
                  />
              </div>
            </div>

            <div className="form-divider"></div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="billingAmount">Initial Billing Amount</label>
                  <input
                    type="text"
                    id="billingAmount"
                    value={formData.billingAmount}
                    readOnly
                    onChange={handleChange} 
                    placeholder="Initial billing amount"
                  />
              </div>

              <div className="form-group">
                <label htmlFor="outsourceFee">Outsource Fee</label>
                  <input
                    type="text"
                    id="outsourceFee"
                    value={formData.outsourceFee}
                    onChange={handleChange} 
                    placeholder="Outsource fee"
                    disabled={formData.renewalId !== ""}
                    className={formData.renewalId !== "" ? "disabled-input" : ""}
                  />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="totalPayable">Total Payable</label>
                  <input
                    type="text"
                    id="totalPayable"
                    value={formData.totalPayable}
                    readOnly
                    onChange={handleChange} 
                    placeholder="Total payable"
                  />
              </div>

              <div className="form-group">
                <label htmlFor="billingStatus">Status</label>
                <div className="select-wrapper" ref={statusDropdownRef}>
                  <input
                      type="text"
                      id="billingStatus"
                      value={formData.billingStatus}
                      readOnly
                      onChange={handleChange} 
                      placeholder="Select billing status"
                    />
                    <span className="select-arrow" onClick={handleToggleDropdownStatus}>▼</span>
                      {isOpenStatusDD && (
                      <ul className="dropdown-list billing-status-dropdown-list">
                        {["Unpaid", "Paid"].map((status) => (
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
              <button className="update-modal-button" onClick={handleCreate}>
              Add
              </button>
        </div>
      </div>
    </div>
  )
}

export default CreateBillingModal

