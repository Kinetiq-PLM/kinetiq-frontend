import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/VendorAppForm.css";

const VendorAppForm = () => {
    const [formData, setFormData] = useState({
        vendor_code: "",
        status: null,
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
        payment_terms: "Corporation",
    });
    const handleCancel = () => {
        // Reset the form to its initial state
        setFormData({
            vendor_code: "",
            status: null,
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
            payment_terms: "Corporation",
        });
    };

    const [vendorList, setVendorList] = useState([]); // State to store vendor list
    const [orgDropdownOpen, setOrgDropdownOpen] = useState(false);

    useEffect(() => {
        // Fetch vendor list from the API
        const fetchVendors = async () => {
            try {
                const response = await axios.get("https://yi92cir5p0.execute-api.ap-southeast-1.amazonaws.com/dev/api/VendorApp/list/");
                setVendorList(response.data);
            } catch (error) {
                console.error("Error fetching vendor list:", error);
            }
        };

        fetchVendors();
    }, []);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleRowClick = (vendor) => {
        // Populate the form with the selected vendor's data
        setFormData({
            vendor_code: vendor.vendor_code || "",
            status: vendor.status || null,
            company_name: vendor.company_name || "",
            tax_number: vendor.tax_number || "",
            vendor_address: vendor.vendor_address || "",
            tax_exempt: vendor.tax_exempt || false,
            contact_person: vendor.contact_person || "",
            vendor_email: vendor.vendor_email || "",
            phone: vendor.phone || "",
            vendor_website: vendor.vendor_website || "",
            account_no: vendor.account_no || "",
            routing_no: vendor.routing_no || "",
            purchasing_card: vendor.purchasing_card || false,
            requestor: vendor.requestor || "",
            date_requested: vendor.date_requested || "",
            payment_terms: vendor.payment_terms || "Corporation",
        });
    };

    const handleSubmit = async () => {
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
                tax_exempt: formData.tax_exempt,
                purchasing_card: formData.purchasing_card ? "Yes" : "No",
                account_no: formData.account_no || "",
                routing_no: formData.routing_no || "",
                requestor: formData.requestor || "",
                date_requested: formData.date_requested || null,
                payment_terms: formData.payment_terms || null,
                status: formData.status || null,
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

    return (
        <div className="vendorappform">
            <div className="vendorappform-scrollable-wrapper">
                <div className="body-content-container">
                    <div className="vendorappform-header">
                        <button className="vendorappform-back">Back</button>
                        <h2 className="vendorappform-title">Vendor Management</h2>
                    </div>

                    {/* Vendor List Table */}
                    <div className="vaf-table-container">
                        <div className="vaf-table-header">
                            <div>Vendor Name</div>
                            <div>Contact Person</div>
                            <div>Status</div>
                            <div>Date Requested</div>
                            <div>Requestor</div>
                        </div>
                        <div className="vaf-table-scrollable">
                            <div className="vaf-table-rows">
                                {vendorList.length > 0 ? (
                                    vendorList.map((vendor) => (
                                        <div
                                            key={vendor.vendor_code}
                                            className="vaf-row"
                                            onClick={() => handleRowClick(vendor)}
                                            style={{ cursor: "pointer" }}
                                        >
                                            <div>{vendor.company_name}</div>
                                            <div>{vendor.contact_person}</div>
                                            <div>
                                                <select
                                                    value={vendor.status || "Pending"}
                                                    disabled
                                                >
                                                    <option value="Approved">Approved</option>
                                                    <option value="Pending">Pending</option>
                                                    <option value="Rejected">Rejected</option>
                                                </select>
                                            </div>
                                            <div>{vendor.date_requested}</div>
                                            <div>{vendor.requestor}</div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="vaf-no-results">No results found</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Vendor Application Form */}
                    <div className="vendorappform-content">
                        <h3 className="vendorappform-section-title">VENDOR INFORMATION</h3>
                        <div className="vendorappform-grid">
                            {[
                                { label: "Company Name", name: "company_name" },
                                { label: "Tax No.", name: "tax_number" },
                                { label: "Vendor Address", name: "vendor_address" },
                                { label: "Contact Person", name: "contact_person" },
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
