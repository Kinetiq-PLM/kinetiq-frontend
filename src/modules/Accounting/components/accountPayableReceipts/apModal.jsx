import React, { useState, useEffect } from "react";
import "../ModalInput.css";
import Button from "../button/Button";
import Forms from "../forms/Forms";
import Dropdown from "../dropdown/Dropdown";

const AccountsPayableReceiptModal = ({
  isModalOpen,
  closeModal,
  selectedRow,
  handleSubmit,
  columnHeaders,
  isCreating,
}) => {
  const [formData, setFormData] = useState(selectedRow);

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
      ? index !== 0 && index !== 6 // Allow all except ap_id and reference_number
      : index === 7; // Only allow Status in edit mode

    if (!isFieldEditable) return;

    const updatedFormData = [...formData];
    updatedFormData[index] = value;
    setFormData(updatedFormData);
  };

  const handleFormSubmit = () => {
    if (isCreating) {
      if (!formData[1]) {
        alert("Please enter an Invoice ID.");
        return;
      }
      if (!formData[2] || isNaN(parseFloat(formData[2]))) {
        alert("Please enter a valid Amount.");
        return;
      }
      if (!formData[3]) {
        alert("Please select a Payment Date.");
        return;
      }
      if (!formData[4]) {
        alert("Please select a Payment Method.");
        return;
      }
      if (!formData[5]) {
        alert("Please enter a Paid By value.");
        return;
      }
    }
    handleSubmit(formData, isCreating);
  };

  if (!isModalOpen) return null;

  return (
    <div className="accounting-modal">
      <div className="modal-overlay">
        <div className="modal-container">
          <div className="modal-header">
            <h2>{isCreating ? "Create Receipt Record" : "Edit Receipt Record"}</h2>
            <img
              className="cursor-pointer hover:scale-110"
              src="/accounting/Close.svg"
              alt="Close"
              onClick={closeModal}
            />
          </div>
          <div className="modal-body">
            {columnHeaders.map((header, index) => {
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
                  <div key={index} className="form-group">
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
                  <div key={index} className="form-group">
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
            })}
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
  );
};

export default AccountsPayableReceiptModal;