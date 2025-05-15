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
}) => {
  const [formData, setFormData] = useState(selectedRow || []);
  const [notif, setNotif] = useState({ isOpen: false, type: "", title: "", message: "" });

  useEffect(() => {
    if (selectedRow) {
      setFormData([...selectedRow]);
    } else {
      setFormData(Array(columnHeaders.length).fill(""));
    }
  }, [selectedRow, columnHeaders]);

  const generateReferenceNumber = (paymentMethod) => {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    switch (paymentMethod) {
      case "Cash":
        return `REF-Cash-${randomNum}`;
      case "Bank Transfer":
        return `REF-Bank Transfer-${randomNum}`;
      case "Credit Card":
        return `REF-Credit Credit-${randomNum}`;
      default:
        return "";
    }
  };

  const isValidDate = (dateString) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) return false;
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  };

  const handleInputChange = (index, value) => {
    const isFieldEditable = index === 2 || index === 3 || index === 4 || index === 5 || index === 7;

    if (!isFieldEditable) return;

    const updatedFormData = [...formData];
    updatedFormData[index] = value;

    if (index === 4) {
      updatedFormData[6] = generateReferenceNumber(value);
    }

    setFormData(updatedFormData);
  };

  const showValidationError = (type, title, message) => {
    setNotif({ isOpen: true, type, title, message });
  };

  const handleFormSubmit = () => {
    if (!formData[2] || isNaN(parseFloat(formData[2])) || parseFloat(formData[2]) <= 0) {
      showValidationError("error", "Invalid Amount", "Please enter a valid positive Amount.");
      return;
    }
    if (!formData[3] || !isValidDate(formData[3])) {
      showValidationError("error", "Invalid Payment Date", "Please select a valid Payment Date (YYYY-MM-DD).");
      return;
    }
    if (!formData[4]) {
      showValidationError("error", "Missing Payment Method", "Please select a Payment Method.");
      return;
    }
    if (!formData[5]) {
      showValidationError("error", "Missing Paid By", "Please enter a Paid By value.");
      return;
    }
    if (!formData[7]) {
      showValidationError("error", "Missing Status", "Please select a Status.");
      return;
    }

    handleSubmit(formData);
  };

  if (!isModalOpen) return null;

  // Group related fields for layout purposes
  const renderFormField = (header, index) => {
    const isDisabled = !(index === 2 || index === 3 || index === 4 || index === 5 || index === 7);

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
            value={formData[index] || ""}
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
            value={formData[index] || ""}
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
        required={true}
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
              <h2>Update Receipt Record</h2>
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
              <Button name="Save" variant="standard2" onclick={handleFormSubmit} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AccountsPayableReceiptModal;