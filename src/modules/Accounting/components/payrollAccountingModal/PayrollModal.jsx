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
        const uniqueId = generateLowercaseId(6); // Generate a 6-character lowercase + numeric ID
        updatedRow[0] = `ACC-PAY-${currentYear}-${uniqueId}`;
      }

      setFormData(updatedRow); // Create a new array to avoid mutation
    }
  }, [selectedRow, isCreating]);

  // Helper function to generate lowercase letters + numeric ID
  const generateLowercaseId = (length) => {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const generateReferenceNumber = (paymentMethod) => {
    const randomNum = Math.floor(100000 + Math.random() * 900000); // 6-digit random number
    switch (paymentMethod) {
      case "Cash":
        return `REF-Cash-${randomNum}`;
      case "Bank Transfer":
        return `REF-Bank Transfer-${randomNum}`;
      case "Credit Card":
        return `REF-Credit Card-${randomNum}`;
      default:
        return `REF-Cash-${randomNum}`; // Default if no payment method
    }
  };

  const isValidDate = (dateString) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) return false;
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  };

  const handleInputChange = (index, value) => {
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
              if (header === "Payroll Accounting ID") {
                return (
                  <Forms
                    key={index}
                    type="text"
                    formName={header}
                    value={formData[index] || ""}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    disabled={!isCreating} // Editable only when creating
                  />
                );
              }
              if (header === "Reference Number") {
                return (
                  <Forms
                    key={index}
                    type="text"
                    formName={header}
                    value={formData[index] || ""}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    disabled={isNewPayroll || !isCreating}
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
                        disabled={!isCreating}
                        required={true}
                      />
                    ) : (
                      <Forms
                        type="text"
                        formName={header}
                        value={formData[index]}
                        onChange={(e) => handleInputChange(index, e.target.value)}
                        disabled={!isCreating}
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
                    disabled={!isCreating}
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
                    disabled={!isCreating}
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
                      disabled={!isCreating}
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
                  disabled={!isCreating}
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