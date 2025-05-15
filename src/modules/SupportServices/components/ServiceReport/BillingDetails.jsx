"use client"

import { useState, useEffect } from "react"
import ExitIcon from "/icons/SupportServices/ExitIcon.png"
import CalendarInputIcon from "/icons/SupportServices/CalendarInputIcon.png"
import ServiceBillingIcon from "/icons/SupportServices/ServiceBillingIcon.svg"

import { GET } from "../../api/api"

const BillingDetails = ({ isOpen, onClose, billingId}) => {

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
    outsourceFee: "",
    totalPayable: "",
    billingStatus: "",
    datePaid: ""
  });

  const fetchBilling = async () => {
      try {
        const data = await GET(`billing/${billingId}/`);
        setFormData({
          renewalId: data.renewal?.renewal_id || "",
          renewalFee: data.renewal?.renewal_fee || "",
          requestId: data.service_request?.service_request_id  || "",
          requestType: data.service_request?.request_type  || "",
          analysisId: data.analysis?.analysis_id || "",
          laborCost: data.analysis?.labor_cost || "",
          orderId: data.service_order?.service_order_id || "",
          orderTotalPrice: data.service_order?.order_total_price  || "",
          operationalCostId: data.operational_cost?.operational_cost_id || "",
          totalOperationalCost: data.operational_cost?.total_operational_cost || "",
          billingAmount: data.service_billing_amount || "",
          outsourceFee: data.outsource_fee || "",
          totalPayable: data.total_payable || "",
          billingStatus: data.billing_status|| "",
          datePaid: data.date_paid || null
        });
      } catch (error) {
        console.error("Error fetching billings:", error)
      }
    }
  
    useEffect(() => {
      fetchBilling();
    }, []);

  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header" style={{ borderBottom: "2px solid #00a8a8" }}>
          <div className="modal-header-left">
            <img src={ServiceBillingIcon || "/placeholder.svg"} alt="Service Billing" className="modal-header-icon" />
            <h2>Service Billing</h2>
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
                <div className="select-wrapper">
                  <input
                    type="text"
                    id="renewalId"
                    readOnly
                    placeholder="Renewal ID"
                    disabled={!formData.requestId}
                  />
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
                  disabled={formData.renewalId !== ""} 
                  className={formData.renewalId !== "" ? "disabled-input" : ""}
                />  
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="requestId">Request ID</label>
                <div className="select-wrapper">
                <input
                  type="text"
                  id="requestId"
                  value={formData.requestId}
                  readOnly
                  placeholder="Request id"
                  disabled={formData.renewalId !== ""}
                  className={formData.renewalId !== "" ? "disabled-input" : ""}
                />
                </div>
                
              </div>

              <div className="form-group">
                <label htmlFor="requestType">Request Type</label>
                <input
                  type="text"
                  id="requestType"
                  value={formData.requestType}
                  readOnly
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
                    readOnly
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
                  placeholder="Order total price"
                  disabled={formData.renewalId !== ""}
                  className={formData.renewalId !== "" ? "disabled-input" : ""}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="operationalCostId">Operational Cost ID</label>
                  <div className="select-wrapper">
                  <input
                      type="text"
                      id="operationalCostId"
                      value={formData.operationalCostId}
                      readOnly
                      placeholder="Total operational cost"
                      disabled={formData.renewalId !== ""}
                      className={formData.renewalId !== "" ? "disabled-input" : ""}
                    />
                  </div>
              </div>

              <div className="form-group">
                <label htmlFor="totalOperationalCost">Total Operational Cost</label>
                  <input
                    type="text"
                    id="totalOperationalCost"
                    value={formData.totalOperationalCost}
                    readOnly
                    placeholder="Total operational cost"
                    disabled={formData.renewalId !== ""}
                    className={formData.renewalId !== "" ? "disabled-input" : ""}
                  />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="billingAmount">Initial Billing Amount</label>
                  <input
                    type="text"
                    id="billingAmount"
                    value={formData.billingAmount}
                    readOnly
                    placeholder="Initial billing amount"
                  />
              </div>

              <div className="form-group">
                <label htmlFor="outsourceFee">Outsource Fee</label>
                  <input
                    type="text"
                    id="outsourceFee"
                    value={formData.outsourceFee}
                    readOnly
                    placeholder="Outsource fee"
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
                    placeholder="Total payable"
                  />
              </div>

              <div className="form-group">
                <label htmlFor="billingStatus">Status</label>
                <div className="select-wrapper">
                  <input
                      type="text"
                      id="billingStatus"
                      value={formData.billingStatus}
                      readOnly
                      placeholder="Select billing status"
                    />
                    
                </div>
              </div>
            </div>
            <div className="form-row">
            <div className="form-group">
                <label htmlFor="datePaid">Date Paid</label>
                <div className="date-input-wrapper">
                  <input
                    type="text"
                    id="datePaid"
                    readOnly
                    value={formData.datePaid}
                    placeholder="dd/mm/yy"
                  />
                  <img
                    src={CalendarInputIcon || "/placeholder.svg?height=16&width=16"}
                    alt="Calendar"
                    className="calendar-icon"
                  />
                </div>
              </div>
              <button className="cancel-button close-cancel-button" onClick={onClose}>
                Close
              </button>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  )
}

export default BillingDetails

