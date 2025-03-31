import React, { useState } from "react";
import "../styles/VendorAppForm.css";

const VendorAppForm = () => {
    const [formData, setFormData] = useState({
        companyName: "",
        vendorCode: "",
        vendorName: "",
        taxNo: "",
        vendorAddress: "",
        taxExempt: "",
        contactPerson: "",
        fax: "",
        title: "",
        vendorEmail: "",
        phone: "",
        vendorWebsite: "",
        accountNo: "",
        routingNo: "",
        separateChecks: false,
        acceptPurchasingCard: false,
        requestor: "",
        dateRequested: ""
    });

    const [organizationType] = useState("");

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleCancel = () => {
        // Add cancel logic here
    };

    const handleSubmit = () => {
        // Add submit logic here
    };

    return (
        <div className="vendorappform">
            <div className="body-content-container">
                <div className="vendorappform-header">
                    <button className="vendorappform-back">Back</button>
                    <h2 className="vendorappform-title">Vendor Application Form</h2>
                    <button className="vendorappform-copy">Copy To</button>
                </div>

                <div className="vendorappform-content">
                    <div className="vendorappform-company-info">
                        <div className="vendorappform-company-details">
                            <h3 className="vendorappform-company-name">COMPANY NAME</h3>
                            <div className="vendorappform-address">
                                <div>Address</div>
                                <div>Address</div>
                            </div>
                        </div>
                        <div className="vendorappform-logo">
                            <img src="../images/kinetiq.png" alt="Kinetiq Logo" />
                        </div>
                    </div>

                    <div className="vendorappform-vendor-info">
                        <h3 className="vendorappform-section-title">VENDOR INFORMATION</h3>
                        <div className="vendorappform-grid">
                            <div className="form-group">
                                <label>Company Name</label>
                                <input 
                                    type="text"
                                    name="companyName"
                                    value={formData.companyName}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Vendor Code</label>
                                <input 
                                    type="text"
                                    name="vendorCode"
                                    value={formData.vendorCode}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Vendor Name</label>
                                <input 
                                    type="text"
                                    name="vendorName"
                                    value={formData.vendorName}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Tax No.</label>
                                <input 
                                    type="text"
                                    name="taxNo"
                                    value={formData.taxNo}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Vendor Address</label>
                                <input 
                                    type="text"
                                    name="vendorAddress"
                                    value={formData.vendorAddress}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Tax Exempt</label>
                                <input 
                                    type="text"
                                    name="taxExempt"
                                    value={formData.taxExempt}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Contact Person</label>
                                <input 
                                    type="text"
                                    name="contactPerson"
                                    value={formData.contactPerson}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Fax</label>
                                <input 
                                    type="text"
                                    name="fax"
                                    value={formData.fax}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Title</label>
                                <input 
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Vendor Email</label>
                                <input 
                                    type="email"
                                    name="vendorEmail"
                                    value={formData.vendorEmail}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Phone</label>
                                <input 
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Vendor Website</label>
                                <input 
                                    type="url"
                                    name="vendorWebsite"
                                    value={formData.vendorWebsite}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="vendorappform-org-type">
                        <h3 className="vendorappform-section-title">ORGANIZATION TYPE</h3>
                        <div className="vendorappform-org-grid">
                            <button className={`org-type-btn ${organizationType === 'corporation' ? 'active' : ''}`}>
                                Corporation
                            </button>
                            <button className={`org-type-btn ${organizationType === 'individual' ? 'active' : ''}`}>
                                Individual / Sole Proprietor
                            </button>
                            <button className={`org-type-btn ${organizationType === 'llc' ? 'active' : ''}`}>
                                LLC
                            </button>
                            <button className={`org-type-btn ${organizationType === 'joint' ? 'active' : ''}`}>
                                Joint Venture
                            </button>
                            <button className={`org-type-btn ${organizationType === 'partnership' ? 'active' : ''}`}>
                                Partnership / Limited Partnership
                            </button>
                            <button className={`org-type-btn ${organizationType === 'nonprofit' ? 'active' : ''}`}>
                                Non Profit
                            </button>
                        </div>
                    </div>

                    <div className="vendorappform-bottom">
                        <div className="vendorappform-checks">
                            <div className="check-group">
                                <h4>Separate Checks?</h4>
                                <div className="radio-group">
                                    <label>
                                        <input 
                                            type="radio" 
                                            name="separateChecks"
                                            value="yes"
                                            checked={formData.separateChecks}
                                            onChange={() => setFormData(prev => ({ ...prev, separateChecks: true }))}
                                        />
                                        Yes
                                    </label>
                                    <label>
                                        <input 
                                            type="radio" 
                                            name="separateChecks"
                                            value="no"
                                            checked={!formData.separateChecks}
                                            onChange={() => setFormData(prev => ({ ...prev, separateChecks: false }))}
                                        />
                                        No
                                    </label>
                                </div>
                            </div>
                            <div className="check-group">
                                <h4>Accept Purchasing Card?</h4>
                                <div className="radio-group">
                                    <label>
                                        <input 
                                            type="radio" 
                                            name="acceptPurchasingCard"
                                            value="yes"
                                            checked={formData.acceptPurchasingCard}
                                            onChange={() => setFormData(prev => ({ ...prev, acceptPurchasingCard: true }))}
                                        />
                                        Yes
                                    </label>
                                    <label>
                                        <input 
                                            type="radio" 
                                            name="acceptPurchasingCard"
                                            value="no"
                                            checked={!formData.acceptPurchasingCard}
                                            onChange={() => setFormData(prev => ({ ...prev, acceptPurchasingCard: false }))}
                                        />
                                        No
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="vendorappform-banking">
                            <h4>BANKING INFORMATION:</h4>
                            <div className="banking-inputs">
                                <div className="form-group">
                                    <label>Account No.</label>
                                    <input 
                                        type="text"
                                        name="accountNo"
                                        value={formData.accountNo}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Routing No.</label>
                                    <input 
                                        type="text"
                                        name="routingNo"
                                        value={formData.routingNo}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="vendorappform-requester">
                            <div className="form-group">
                                <label>Requestor</label>
                                <input 
                                    type="text"
                                    name="requestor"
                                    value={formData.requestor}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Date Requested</label>
                                <input 
                                    type="text"
                                    name="dateRequested"
                                    value={formData.dateRequested}
                                    onChange={handleInputChange}
                                    placeholder="MM/DD/YYYY"
                                    onFocus={(e) => e.target.type = 'date'}
                                    onBlur={(e) => e.target.type = 'text'}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="button-container">
                        <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
                        <button className="submit-btn" onClick={handleSubmit}>Submit</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorAppForm;
