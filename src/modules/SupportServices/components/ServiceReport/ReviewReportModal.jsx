"use client"

import { useState, useEffect } from "react"
import ExitIcon from "/icons/SupportServices/ExitIcon.png"
import ServiceReportIcon from "/icons/SupportServices/ServiceReportIcon.png"
import BillingDetails from "./BillingDetails"

import { GET } from "../../api/api"

const ReviewReportModal = ({ isOpen, onClose, onUpdate, report, technician }) => {
    const [showModal, setShowModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
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

    const handleSubmit = () => {
        if (formData.reportStatus === "Draft") {
            setErrorMessage("Report is still in draft status.");
            setShowModal(true);
            return;
        } else if ( formData.reportStatus === "Reviewed") {
            setErrorMessage("Report already reviewed.");
            setShowModal(true);
            return;
        }
        onUpdate({
            report_id: formData.reportId,
            report_status: "Reviewed"
        })
    }

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
                    <div className="select-wrapper">
                        <input
                        type="text"
                        id="ticketId"
                        value={formData.ticketId}
                        readOnly
                        placeholder="Enter ticket ID"
                        />
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
                        placeholder="Enter Call ID"
                        />
                    </div>
                    </div>

                    <div className="form-group">
                    <label htmlFor="requestId">Request ID</label>
                    <div className="select-wrapper">
                    <input
                        type="text"
                        id="requestId"
                        value={formData.requestId}
                        readOnly
                        placeholder="Enter request ID"
                    />
                    </div>
                    </div>

                    <div className="form-group">
                    <label htmlFor="requestType">Request Type</label>
                    <input
                        type="text"
                        id="requestType"
                        readOnly
                        value={formData.requestType}
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
                        placeholder="Enter renewal ID"
                        />
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
                        placeholder="Enter billing ID"
                    />
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
                        readOnly
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
                        placeholder="Select status"
                        />
                    </div>
                    </div>
                    <div className="form-group">
                    <label htmlFor="technicianId">
                        Technician ID
                    </label>
                    <div className="select-wrapper">
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
            <button className="update-modal-button" onClick={handleSubmit}>
                Approve Report
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

        {showModal && (
            <div className="alert-modal-overlay">
            <div className="alert-modal-content">
                <h2>⚠  WARNING</h2>
                <p>{errorMessage}</p>
                <button className="alert-okay-button" onClick={() => setShowModal(false)}>OK</button>
            </div>
            </div>
        )}
        </div>
    )
}

export default ReviewReportModal

