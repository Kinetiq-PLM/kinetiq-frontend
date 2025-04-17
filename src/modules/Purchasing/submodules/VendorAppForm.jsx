import React, { useState } from "react";
import axios from "axios";
import "../styles/VendorAppForm.css";

const VendorAppForm = () => {
    const [formData, setFormData] = useState({
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
        organization_type: "Corporation", // Default to "Corporation"
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
            organization_type: type,
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
        // Validation: Ensure 'requestor' and other fields are properly populated
        if (!formData.requestor.trim()) {
            alert("Please enter the name of the requestor.");
            return;
        }

        try {
            const payload = {
                application_reference: `APP-${Date.now()}`,  // Automatically generated
                status: null,  // 'status' is set to null by default
                company_name: formData.company_name,
                tax_number: formData.tax_number,
                contact_person: formData.contact_person,
                title: formData.title,
                vendor_address: formData.vendor_address,
                phone: formData.phone,
                fax: formData.fax,
                vendor_email: formData.vendor_email,
                tax_exempt: formData.tax_exempt,
                vendor_website: formatWebsite(formData.vendor_website),
                organization_type: formData.organization_type,
                separate_checks: formData.separate_checks,
                purchasing_card: formData.purchasing_card,
                account_no: formData.account_no,
                routing_no: formData.routing_no,
                requestor: formData.requestor,
                date_requested: formData.date_requested ? formData.date_requested : null,
            };

            console.log("📤 Submitting Vendor Application Payload:", payload);

            const response = await axios.post(
                "http://127.0.0.1:8000/api/VendorApp/create/",
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
            organization_type: "Corporation",
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
                        <button className="vendorappform-copy">Copy To</button>
                    </div>

                    <div className="vendorappform-content">
                        {/* Company Info */}
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

                        {/* Vendor Info */}
                        <div className="vendorappform-vendor-info">
                            <h3 className="vendorappform-section-title">VENDOR INFORMATION</h3>
                            <div className="vendorappform-grid">
                                {[ 
                                    { label: "Company Name", name: "company_name" },
                                    { label: "Vendor Name", name: "vendor_name" },
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
                                <div className="form-group">
                                    <label>Tax Exempt</label>
                                    <input
                                        type="checkbox"
                                        name="tax_exempt"
                                        checked={formData.tax_exempt}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Org Type */}
                        <div className="vendorappform-org-type">
                            <h3 className="vendorappform-section-title">ORGANIZATION TYPE</h3>
                            <div className="org-type-dropdown">
                                <button
                                    type="button"
                                    className="org-type-toggle"
                                    onClick={() => setOrgDropdownOpen(!orgDropdownOpen)}
                                >
                                    {formData.organization_type
                                        ? formData.organization_type.charAt(0).toUpperCase() +
                                          formData.organization_type.slice(1).replace("_", " ")
                                        : "Select organization type"}
                                    <span className="dropdown-arrow">{orgDropdownOpen ? "▲" : "▼"}</span>
                                </button>
                                {orgDropdownOpen && (
                                    <div className="org-type-options">
                                        {["Corporation", "LLC", "Partnership", "Nonprofit"].map((type) => (
                                            <div
                                                key={type}
                                                className={`org-type-option ${formData.organization_type === type ? "selected" : ""}`}
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

                        {/* Checks and Card */}
                        <div className="vendorappform-bottom">
                            <div className="vendorappform-checks">
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
