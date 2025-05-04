import React, { useState } from "react";
import axios from "axios";

const PurchaseQuotEdit = ({ quotation, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    document_no: quotation.document_no || "",
    status: quotation.status || "Pending",
    valid_date: quotation.valid_date || "",
    document_date: quotation.document_date || "",
    required_date: quotation.required_date || "",
    total_before_discount: quotation.total_before_discount || "",
    discount_percent: quotation.discount_percent || "",
    freight: quotation.freight || "",
    tax: quotation.tax || "",
    total_payment: quotation.total_payment || "",
    remarks: quotation.remarks || "",
    vendor_code: quotation.vendor_code || "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/api/purchase_quotation/update/${quotation.quotation_id}/`,
        formData
      );
      console.log("Updated Quotation:", response.data);
      onSuccess(response.data); // Notify parent of the update
    } catch (error) {
      console.error("Error updating quotation:", error.response?.data || error.message);
      alert("Failed to update quotation. Check the console for details.");
    }
  };

  return (
    <div className="purchasequot-edit-modal">
      <div className="purchasequot-edit-content">
        <h3>Edit Quotation</h3>
        <div className="form-group">
          <label>Document No</label>
          <input
            type="text"
            name="document_no"
            value={formData.document_no}
            onChange={handleInputChange}
            disabled
          />
        </div>
        <div className="form-group">
          <label>Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
          >
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Quotation Sent">Quotation Sent</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
        {/* Add other fields as needed */}
        <div className="form-actions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSubmit}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default PurchaseQuotEdit;