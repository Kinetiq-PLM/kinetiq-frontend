import React, { useState } from "react";
import axios from "axios";
import "../styles/VendorAppForm.css";

const VendorAppForm = () => {
    const [formData, setFormData] = useState({
        vendor_code: "",
        status: null, // 'status' is set to null by default
        company_name: "",
        tax_number: "",
        vendor_address: "",
        tax_exempt: false,
        contact_person: "",
        vendor_email: "",
        phone: "",
        vendor_website: "",
        account_no: "",
        routing_no: "",
        purchasing_card: false,
        requestor: "",
        date_requested: "",
        payment_terms: "Corporation", // Default to "Corporation"
    });

    const [orgDropdownOpen, setOrgDropdownOpen] = useState(false);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleOrgTypeChange = (type) => {
        setFormData((prev) => ({
            ...prev,
            payment_terms: type,
        }));
    };

    const formatWebsite = (url) => {
        if (!url) return "";
        if (!/^https?:\/\//i.test(url)) {
            return "https://" + url;
        }
        return url;
    };

    const handleSubmit = async () => {
        // Validation: Ensure required fields are properly populated
        if (!formData.requestor.trim()) {
            alert("Please enter the name of the requestor.");
            return;
        }
    
        try {
            const payload = {
                vendor_code: formData.vendor_code || "",
                company_name: formData.company_name || "",
                tax_number: formData.tax_number || "",
                contact_person: formData.contact_person || "",
                vendor_address: formData.vendor_address || "",
                phone: formData.phone || "",
                vendor_email: formData.vendor_email || "",
                tax_exempt: formData.tax_exempt, // Boolean as required
                purchasing_card: formData.purchasing_card ? "Yes" : "No", // Convert to string
                account_no: formData.account_no || "",
                routing_no: formData.routing_no || "",
                requestor: formData.requestor || "",
                date_requested: formData.date_requested || null, // Null if not provided
                payment_terms: formData.payment_terms || null, // Null if not selected
                status: null, // Default to null
            };
    
            console.log("📤 Submitting Vendor Application Payload:", payload);
    
            const response = await axios.post(
                "https://yi92cir5p0.execute-api.ap-southeast-1.amazonaws.com/dev/api/VendorApp/create/",
                payload
            );
            console.log("✅ Response from server:", response.data);
            alert("Vendor application submitted!");
            window.location.reload();
        } catch (error) {
            console.error("❌ Error submitting form:", error.response?.data || error.message);
            alert("Failed to submit application. Check the console for details.");
        }
    };

    const handleCancel = () => {
        setFormData({
            company_name: "",
            vendor_name: "",
            tax_number: "",
            vendor_address: "",
            tax_exempt: false,
            contact_person: "",
            fax: "",
            title: "",
            vendor_email: "",
            phone: "",
            vendor_website: "",
            account_no: "",
            routing_no: "",
            separate_checks: false,
            purchasing_card: false,
            requestor: "",
            date_requested: "",
            payment_terms: "Corporation",
        });
        alert("Form reset.");
    };

    return (
        <div className="vendorappform">
            <div className="vendorappform-scrollable-wrapper">
                <div className="body-content-container">
                    <div className="vendorappform-header">
                        <button className="vendorappform-back">Back</button>
                        <h2 className="vendorappform-title">Vendor Application Form</h2>
                    </div>

                    <div className="vendorappform-content">

                        {/* Vendor Info */}
                        <div className="vendorappform-vendor-info">
                            <h3 className="vendorappform-section-title">VENDOR INFORMATION</h3>
                            <div className="vendorappform-grid">
                                {[ 
                                    { label: "Company Name", name: "company_name" },
                                    { label: "Tax No.", name: "tax_number" },
                                    { label: "Vendor Address", name: "vendor_address" },
                                    { label: "Contact Person", name: "contact_person" },
                                    { label: "Fax", name: "fax" },
                                    { label: "Title", name: "title" },
                                    { label: "Vendor Email", name: "vendor_email", type: "email" },
                                    { label: "Phone", name: "phone", type: "tel" },
                                    { label: "Vendor Website", name: "vendor_website", type: "url" },
                                ].map(({ label, name, type = "text" }) => (
                                    <div className="form-group" key={name}>
                                        <label>{label}</label>
                                        <input
                                            type={type}
                                            name={name}
                                            value={formData[name] || ""}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Org Type */}
                        <div className="vendorappform-org-type">
                            <h3 className="vendorappform-section-title">PAYMENT TERMS</h3>
                            <div className="org-type-dropdown">
                                <button
                                    type="button"
                                    className="org-type-toggle"
                                    onClick={() => setOrgDropdownOpen(!orgDropdownOpen)}
                                >
                                    {formData.payment_terms
                                        ? formData.payment_terms.charAt(0).toUpperCase() +
                                          formData.payment_terms.slice(1).replace("_", " ")
                                        : "Select organization type"}
                                    <span className="dropdown-arrow">{orgDropdownOpen ? "▲" : "▼"}</span>
                                </button>
                                {orgDropdownOpen && (
                                    <div className="org-type-options">
                                        {["80", "70", "50", "25"].map((type) => (
                                            <div
                                                key={type}
                                                className={`org-type-option ${formData.payment_terms === type ? "selected" : ""}`}
                                                onClick={() => {
                                                    handleOrgTypeChange(type);
                                                    setOrgDropdownOpen(false);
                                                }}
                                            >
                                                {type.charAt(0).toUpperCase() + type.slice(1)}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Tax Exempt, Checks and Card */}
                        <div className="vendorappform-bottom">
                            <div className="vendorappform-checks">
                            <div className="check-group">
                                    <h4>Tax Exempt</h4>
                                    <div className="radio-group">
                                        <label>
                                            <input
                                                type="radio"
                                                name="tax_exempt"
                                                checked={formData.tax_exempt}
                                                onChange={() =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        tax_exempt: true,
                                                    }))
                                                }
                                            />
                                            Yes
                                        </label>
                                        <label>
                                            <input
                                                type="radio"
                                                name="tax_exempt"
                                                checked={!formData.tax_exempt}
                                                onChange={() =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        tax_exempt: false,
                                                    }))
                                                }
                                            />
                                            No
                                        </label>
                                    </div>
                                </div>

                                <div className="check-group">
                                    <h4>Separate Checks?</h4>
                                    <div className="radio-group">
                                        <label>
                                            <input
                                                type="radio"
                                                name="separate_checks"
                                                checked={formData.separate_checks}
                                                onChange={() =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        separate_checks: true,
                                                    }))
                                                }
                                            />
                                            Yes
                                        </label>
                                        <label>
                                            <input
                                                type="radio"
                                                name="separate_checks"
                                                checked={!formData.separate_checks}
                                                onChange={() =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        separate_checks: false,
                                                    }))
                                                }
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
                                                name="purchasing_card"
                                                checked={formData.purchasing_card}
                                                onChange={() =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        purchasing_card: true,
                                                    }))
                                                }
                                            />
                                            Yes
                                        </label>
                                        <label>
                                            <input
                                                type="radio"
                                                name="purchasing_card"
                                                checked={!formData.purchasing_card}
                                                onChange={() =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        purchasing_card: false,
                                                    }))
                                                }
                                            />
                                            No
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Banking Info */}
                            <div className="vendorappform-banking">
                                <h4>BANKING INFORMATION:</h4>
                                <div className="banking-inputs">
                                    {["account_no", "routing_no"].map((name) => (
                                        <div className="form-group" key={name}>
                                            <label>{name === "account_no" ? "Account No." : "Routing No."}</label>
                                            <input
                                                type="text"
                                                name={name}
                                                value={formData[name]}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Requestor Info */}
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
                                        type="date"
                                        name="date_requested"
                                        value={formData.date_requested}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="button-container">
                            <button className="cancel-btn" onClick={handleCancel}>
                                Cancel
                            </button>
                            <button className="submit-btn" onClick={handleSubmit}>
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorAppForm;
