import React, { useState, useEffect } from "react";
import "../ModalInput.css";
import Button from "../button/Button";
import Forms from "../forms/Forms";
import Dropdown from "../dropdown/Dropdown";
import NotifModal from "../modalNotif/NotifModal"; // Adjust the path if needed

const AccountsPayableReceiptModal = ({
  isModalOpen,
  closeModal,
  selectedRow,
  handleSubmit,
  columnHeaders,
  isCreating,
}) => {
  const [formData, setFormData] = useState(selectedRow);
  const [notif, setNotif] = useState({ isOpen: false, type: "", title: "", message: "" });

  useEffect(() => {
    if (selectedRow) {
      const updatedRow = [...selectedRow];
      if (isCreating && !updatedRow[0]) {
        const currentYear = new Date().getFullYear();
        const uniqueId = generateLowercaseId(6);
        updatedRow[0] = `AP-APR-${currentYear}-${uniqueId}`;
        updatedRow[6] = `REF-AP-${Math.floor(100000 + Math.random() * 900000)}`;
      }
      setFormData(updatedRow);
    }
  }, [selectedRow, isCreating]);

  const generateLowercaseId = (length) => {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleInputChange = (index, value) => {
    const isFieldEditable = isCreating
      ? index !== 0 && index !== 6
      : index === 7;

    if (!isFieldEditable) return;

    const updatedFormData = [...formData];
    updatedFormData[index] = value;
    setFormData(updatedFormData);
  };

  const showValidationError = (message) => {
    setNotif({
      isOpen: true,
      type: "error",
      title: "Validation Error",
      message,
    });
  };

  const handleFormSubmit = () => {
    if (isCreating) {
      if (!formData[1]) {
        return showValidationError("Please enter an Invoice ID.");
      }
      if (!formData[2] || isNaN(parseFloat(formData[2]))) {
        return showValidationError("Please enter a valid Amount.");
      }
      if (!formData[3]) {
        return showValidationError("Please select a Payment Date.");
      }
      if (!formData[4]) {
        return showValidationError("Please select a Payment Method.");
      }
      if (!formData[5]) {
        return showValidationError("Please enter a Paid By value.");
      }
    }
    handleSubmit(formData, isCreating);
  };

  if (!isModalOpen) return null;

  // Group related fields for layout purposes
  const renderFormField = (header, index) => {
    const isDisabled = isCreating
      ? header === "AP ID" || header === "Reference Number"
      : header !== "Status";

    if (header === "AP ID" || header === "Reference Number") {
      return (
        <Forms
          key={index}
          type="text"
          formName={header}
          value={formData[index] || ""}
          onChange={(e) => handleInputChange(index, e.target.value)}
          disabled={true}
        />
      );
    }

    if (header === "Payment Method") {
      return (
        <div key={index} className="flex flex-col gap-2">
          <label>{header}</label>
          <Dropdown
            style="selection"
            defaultOption="Select payment method..."
            options={["Credit Card", "Bank Transfer", "Cash"]}
            value={formData[index]}
            onChange={(val) => handleInputChange(index, val)}
            disabled={isDisabled}
            required={true}
          />
        </div>
      );
    }

    if (header === "Status") {
      return (
        <div key={index} className="flex flex-col gap-2">
          <label>{header}</label>
          <Dropdown
            style="selection"
            defaultOption="Select status..."
            options={["Processing", "Completed"]}
            value={formData[index]}
            onChange={(val) => handleInputChange(index, val)}
            disabled={false}
            required={true}
          />
        </div>
      );
    }

    if (header === "Payment Date") {
      return (
        <Forms
          key={index}
          type="date"
          formName={header}
          value={formData[index] || ""}
          onChange={(e) => handleInputChange(index, e.target.value)}
          disabled={isDisabled}
          required={true}
        />
      );
    }

    if (header === "Amount") {
      return (
        <Forms
          key={index}
          type="number"
          formName={header}
          value={formData[index] || ""}
          onChange={(e) => handleInputChange(index, e.target.value)}
          disabled={isDisabled}
          required={true}
        />
      );
    }

    return (
      <Forms
        key={index}
        type="text"
        formName={header}
        value={formData[index] || ""}
        onChange={(e) => handleInputChange(index, e.target.value)}
        disabled={isDisabled}
        required={header.includes("*")}
      />
    );
  };

  return (
    <>
      <NotifModal
        isOpen={notif.isOpen}
        type={notif.type}
        title={notif.title}
        message={notif.message}
        onClose={() => setNotif({ ...notif, isOpen: false })}
      />

      <div className="accounting-modal">
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>{isCreating ? "Create Receipt Record" : "Update Receipt Record"}</h2>
              <img
                className="cursor-pointer hover:scale-110"
                src="/accounting/Close.svg"
                alt="Close"
                onClick={closeModal}
              />
            </div>
            
            <div className="modal-body">
              {/* Payment details section - third row */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                {columnHeaders[3] && renderFormField(columnHeaders[3], 3)} {/* Payment Date */}
                {columnHeaders[4] && renderFormField(columnHeaders[4], 4)} {/* Payment Method */}
              </div>
              
              {/* Section for identifiers - top row */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                {columnHeaders[0] && renderFormField(columnHeaders[0], 0)} {/* AP ID */}
                {columnHeaders[6] && renderFormField(columnHeaders[6], 6)} {/* Reference Number */}
              </div>

              {/* Invoice and amount section - second row */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                {columnHeaders[1] && renderFormField(columnHeaders[1], 1)} {/* Invoice ID */}
                {columnHeaders[2] && renderFormField(columnHeaders[2], 2)} {/* Amount */}
              </div>

              {/* Additional information - fourth row */}
              <div className="grid grid-cols-2 gap-4">
                {columnHeaders[5] && renderFormField(columnHeaders[5], 5)} {/* Paid By */}
                {columnHeaders[7] && renderFormField(columnHeaders[7], 7)} {/* Status */}
              </div>
            </div>
            
            <div className="modal-footer">
              <Button name="Cancel" variant="standard1" onclick={closeModal} />
              <Button
                name={isCreating ? "Create" : "Save"}
                variant="standard2"
                onclick={handleFormSubmit}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AccountsPayableReceiptModal;