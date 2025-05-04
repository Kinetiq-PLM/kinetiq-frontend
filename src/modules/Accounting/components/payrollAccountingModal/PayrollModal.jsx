import React, { useState, useEffect } from "react";
import "../ModalInput.css";
import Dropdown from "../dropdown/Dropdown";
import Button from "../button/Button";
import Forms from "../forms/Forms";

const PayrollModal = ({
  isModalOpen,
  closeModal,
  selectedRow,
  handleSubmit,
  columnHeaders,
  isCreating,
  payrollHrIds,
  isNewPayroll,
}) => {
  const [formData, setFormData] = useState(selectedRow);

  useEffect(() => {
    if (selectedRow) {
      const updatedRow = [...selectedRow];

      // Auto-generate Payroll Accounting ID if creating a new record
      if (isCreating && !updatedRow[0]) {
        const currentYear = new Date().getFullYear();
        const uniqueId = generateLowercaseId(6);
        updatedRow[0] = `ACC-PAY-${currentYear}-${uniqueId}`;
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

  const generateReferenceNumber = (paymentMethod) => {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    switch (paymentMethod) {
      case "Cash":
        return `REF-Cash-${randomNum}`;
      case "Bank Transfer":
        return `REF-Bank Transfer-${randomNum}`;
      case "Credit Card":
        return `REF-Credit Card-${randomNum}`;
      default:
        return `REF-Cash-${randomNum}`;
    }
  };

  const isValidDate = (dateString) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) return false;
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  };

  const handleInputChange = (index, value) => {
    // Prevent updates for disabled fields
    const isFieldEditable = isCreating
      ? index !== 0 && index !== 5 // Allow all except Payroll Accounting ID and Reference Number in create mode
      : index === 6; // Only allow Status (index 6) in edit mode

    if (!isFieldEditable) return;

    const updatedFormData = [...formData];
    updatedFormData[index] = value;

    if (index === 4 && isNewPayroll) {
      updatedFormData[5] = generateReferenceNumber(value);
    }

    setFormData(updatedFormData);
  };

  const handleFormSubmit = () => {
    if (isCreating) {
      if (!formData[1]) {
        alert("Please select a Payroll HR ID.");
        return;
      }
      if (!formData[2] || !isValidDate(formData[2])) {
        alert("Please select a valid Date Approved (YYYY-MM-DD).");
        return;
      }
      if (!formData[3]) {
        alert("Please enter an Approved By value.");
        return;
      }
      if (!formData[4]) {
        alert("Please select a Payment Method.");
        return;
      }
    }

    const updatedFormData = [...formData];
    if (isNewPayroll) {
      if (!updatedFormData[5] && updatedFormData[4]) {
        updatedFormData[5] = generateReferenceNumber(updatedFormData[4]);
      }
      if (updatedFormData[2]) {
        updatedFormData[2] = `${updatedFormData[2]}T00:00:00Z`;
      }
    }

    handleSubmit(updatedFormData, isNewPayroll);
  };

  if (!isModalOpen) {
    return null;
  }

  return (
    <div className="accounting-modal">
      <div className="modal-overlay">
        <div className="modal-container">
          <div className="modal-header">
            <h2>{isCreating ? "Create Payroll Record" : "Edit Payroll Record"}</h2>
            <img
              className="cursor-pointer hover:scale-110"
              src="/accounting/Close.svg"
              alt="Close"
              onClick={closeModal}
            />
          </div>
          <div className="modal-body">
            {columnHeaders.map((header, index) => {
              // Determine if the field should be disabled
              const isDisabled = isCreating
                ? header === "Payroll Accounting ID" || header === "Reference Number" // Disable auto-generated fields in create mode
                : header !== "Status"; // Disable all except Status in edit mode

              if (header === "Payroll Accounting ID" || header === "Reference Number") {
                return (
                  <Forms
                    key={index}
                    type="text"
                    formName={header}
                    value={formData[index] || ""}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    disabled={true} // Always disabled
                  />
                );
              }
              if (header === "Payroll HR ID") {
                return (
                  <div key={index} className="form-group">
                    <label>{header}</label>
                    {isNewPayroll ? (
                      <Dropdown
                        style="selection"
                        defaultOption="Select Payroll HR ID..."
                        options={payrollHrIds}
                        value={formData[index]}
                        onChange={(val) => handleInputChange(index, val)}
                        disabled={isDisabled}
                        required={true}
                      />
                    ) : (
                      <Forms
                        type="text"
                        formName={header}
                        value={formData[index]}
                        onChange={(e) => handleInputChange(index, e.target.value)}
                        disabled={isDisabled}
                      />
                    )}
                  </div>
                );
              }
              if (header === "Date Approved" && isNewPayroll) {
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
              if (header === "Approved By" && isNewPayroll) {
                return (
                  <Forms
                    key={index}
                    type="text"
                    formName={header}
                    value={formData[index]}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    disabled={isDisabled}
                    required={true}
                  />
                );
              }
              if (header === "Payment Method" && isNewPayroll) {
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
                      disabled={false} // Always editable
                      required={true}
                    />
                  </div>
                );
              }
              return (
                <Forms
                  key={index}
                  type="text"
                  formName={header}
                  value={formData[index]}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  disabled={isDisabled}
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

export default PayrollModal;