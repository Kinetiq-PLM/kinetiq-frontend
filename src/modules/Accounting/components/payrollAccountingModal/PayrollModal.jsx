// Import necessary dependencies and components
import React, { useState, useEffect } from "react";
import "../ModalInput.css";
import Dropdown from "../dropdown/Dropdown";
import Button from "../button/Button";
import Forms from "../forms/Forms";

// PayrollModal component definition
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
  // Local state to manage form data
  const [formData, setFormData] = useState(selectedRow);

  // Populate and initialize formData when modal is opened or selection changes
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

  // Helper function to generate random lowercase alphanumeric ID
  const generateLowercaseId = (length) => {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // Helper function to generate a payment reference number based on payment method
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

  // Utility function to validate YYYY-MM-DD format
  const isValidDate = (dateString) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) return false;
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  };

  // Handles input changes based on the form index and conditions
  const handleInputChange = (index, value) => {
    // Prevent updates for disabled fields
    const isFieldEditable = isCreating
      ? index !== 0 && index !== 5 // In create mode, disable Payroll ID and Reference #
      : index === 6; // In edit mode, allow only Status field to be changed

    if (!isFieldEditable) return;

    const updatedFormData = [...formData];
    updatedFormData[index] = value;

    // Auto-generate Reference Number if Payment Method changes
    if (index === 4 && isNewPayroll) {
      updatedFormData[5] = generateReferenceNumber(value);
    }

    setFormData(updatedFormData);
  };

  // Validates inputs and submits the form
  const handleFormSubmit = () => {
    // Form validation for creation
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

    // Generate Reference Number and format date if it's a new payroll
    if (isNewPayroll) {
      if (!updatedFormData[5] && updatedFormData[4]) {
        updatedFormData[5] = generateReferenceNumber(updatedFormData[4]);
      }
      if (updatedFormData[2]) {
        updatedFormData[2] = `${updatedFormData[2]}T00:00:00Z`;
      }
    }

    // Trigger parent submit handler
    handleSubmit(updatedFormData, isNewPayroll);
  };

  // Do not render modal if it is not open
  if (!isModalOpen) {
    return null;
  }

  // Main modal return block
  return (
    <div className="accounting-modal">
      <div className="modal-overlay">
        <div className="modal-container">
          {/* Modal Header */}
          <div className="modal-header">
            <h2>{isCreating ? "Create Payroll Record" : "Edit Payroll Record"}</h2>
            <img
              className="cursor-pointer hover:scale-110"
              src="/accounting/Close.svg"
              alt="Close"
              onClick={closeModal}
            />
          </div>

          {/* Modal Body - Dynamic Form Fields */}
          <div className="modal-body">
            {columnHeaders.map((header, index) => {
              // Define disable logic per field
              const isDisabled = isCreating
                ? header === "Payroll Accounting ID" || header === "Reference Number"
                : header !== "Status";

              // Special rendering for Date Approved
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

              // Disable editing for auto-generated fields
              if (header === "Payroll Accounting ID" || header === "Reference Number") {
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

              // Dropdown for Payroll HR ID
              if (header === "Payroll HR ID") {
                return (
                  <div key={index} className="flex flex-col gap-2">
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

              // Text input for Approved By (only when new)
              if (header === "Approved By" && isNewPayroll) {
                return (
                  <Forms
                    key={index}
                    type="text"
                    placeholder="Enter Approved By..."
                    formName={header}
                    value={formData[index]}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    disabled={isDisabled}
                    required={true}
                  />
                );
              }

              // Payment Method dropdown
              if (header === "Payment Method" && isNewPayroll) {
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

              // Status dropdown (always editable)
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

              // Default form rendering for other fields
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

          {/* Modal Footer with Cancel and Submit Buttons */}
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