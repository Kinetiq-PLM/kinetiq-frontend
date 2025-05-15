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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const response = await axios.put(
        `https://yi92cir5p0.execute-api.ap-southeast-1.amazonaws.com/dev/api/purchase_quotation/update/${quotation.quotation_id}/`,
        formData
      );
      console.log("Updated Quotation:", response.data);
      onSuccess(response.data); // Notify parent of the update
    } catch (error) {
      console.error("Error updating quotation:", error.response?.data || error.message);
      alert("Failed to update quotation. Check the console for details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle click outside to close
  const handleModalClick = (e) => {
    if (e.target.className === "purchasequot-edit-modal") {
      onClose();
    }
  };

  // Handle escape key to close
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <div 
      className="purchasequot-edit-modal" 
      onClick={handleModalClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="purchasequot-edit-content">
        <h3>Edit Quotation</h3>
        
        <div className="form-group">
          <label htmlFor="document_no">Document No</label>
          <input
            type="text"
            id="document_no"
            name="document_no"
            value={formData.document_no}
            onChange={handleInputChange}
            disabled
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
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
        
        <div className="form-group">
          <label htmlFor="document_date">Document Date</label>
          <input
            type="date"
            id="document_date"
            name="document_date"
            value={formData.document_date}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="form-actions">
          <button 
            onClick={onClose}
            type="button"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            type="button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PurchaseQuotEdit;