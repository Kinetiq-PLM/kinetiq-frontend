import React, { useState, useEffect } from "react";
import "../ModalInput.css";
import Button from "../button/Button";
import Forms from "../forms/Forms";
import Dropdown from "../dropdown/Dropdown";
import NotifModal from "../modalNotif/NotifModal"; // ✅ adjust the path as needed

const TaxRemittanceModal = ({
  isModalOpen,
  closeModal,
  selectedRow,
  handleSubmit,
  columnHeaders,
  isCreating,
}) => {
  const [formData, setFormData] = useState(selectedRow);
  const [employeeIds, setEmployeeIds] = useState([]);
  const [remittanceData, setRemittanceData] = useState([]);
  const [notif, setNotif] = useState({ isOpen: false, type: "error", title: "", message: "" });

  useEffect(() => {
    if (isModalOpen) {
      const fetchEmployeeIds = async () => {
        try {
          const response = await fetch(
            "https://vyr3yqctq8.execute-api.ap-southeast-1.amazonaws.com/dev/api/payroll-journal/"
          );
          const data = await response.json();
          const ids = data.map((item) => item.employee_id).filter((id) => id);
          setEmployeeIds(ids);
        } catch (error) {
          console.error("Error fetching employee IDs:", error);
          setEmployeeIds([]);
        }
      };

      const fetchRemittanceData = async () => {
        try {
          const response = await fetch(
            "https://vyr3yqctq8.execute-api.ap-southeast-1.amazonaws.com/dev/api/payroll-remittances/"
          );
          const data = await response.json();
          setRemittanceData(data);
        } catch (error) {
          console.error("Error fetching remittance data:", error);
          setRemittanceData([]);
        }
      };

      fetchEmployeeIds();
      fetchRemittanceData();
    }
  }, [isModalOpen]);

  useEffect(() => {
    if (selectedRow) {
      const updatedRow = [...selectedRow];
      if (isCreating && !updatedRow[0]) {
        const currentYear = new Date().getFullYear();
        const uniqueId = generateLowercaseId(6);
        updatedRow[0] = `REM-${currentYear}-${uniqueId}`;
        updatedRow[6] = `REF-REM-${Math.floor(100000 + Math.random() * 900000)}`;
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

  const showNotif = (type, title, message) => {
    setNotif({ isOpen: true, type, title, message });
  };

  const handleFormSubmit = () => {
    if (isCreating) {
      if (!formData[1]) {
        showNotif("error", "Missing Employee ID", "Please select an Employee ID.");
        return;
      }
      const employeeExists = remittanceData.some(
        (remittance) => remittance.employee_id === formData[1]
      );
      if (!employeeExists && remittanceData.length > 0) {
        showNotif("warning", "Employee Not Found", "Selected Employee ID has no remittance records.");
        return;
      }
      if (!formData[2]) {
        showNotif("error", "Missing Deduction Type", "Please select a Deduction Type.");
        return;
      }
      if (!formData[3] || isNaN(parseFloat(formData[3]))) {
        showNotif("error", "Invalid Amount", "Please enter a valid Amount.");
        return;
      }
      if (!formData[4]) {
        showNotif("error", "Missing Payment Date", "Please select a Payment Date.");
        return;
      }
      if (!formData[5]) {
        showNotif("error", "Missing Payment Method", "Please select a Payment Method.");
        return;
      }
    }
    handleSubmit(formData, isCreating);
  };

  // Function to render form fields based on their type
  const renderFormField = (header, index) => {
    const isDisabled = isCreating
      ? header === "Remittance ID" || header === "Reference Number"
      : header !== "Status";
    
    if (header === "Remittance ID" || header === "Reference Number") {
      return (
        <Forms
          type="text"
          formName={header}
          value={formData[index] || ""}
          onChange={(e) => handleInputChange(index, e.target.value)}
          disabled={true}
        />
      );
    }

    if (header === "Employee ID") {
      return (
        <div className="flex flex-col gap-y-2">
          <label>{header}</label>
          <Dropdown
            style="selection"
            defaultOption="Select employee ID..."
            options={employeeIds}
            value={formData[index] || ""}
            onChange={(val) => handleInputChange(index, val)}
            disabled={isDisabled}
            required={true}
          />
        </div>
      );
    }

    if (header === "Deduction Type") {
      return (
        <div className="flex flex-col gap-y-2">
          <label>{header}</label>
          <Dropdown
            style="selection"
            defaultOption="Select deduction type..."
            options={["SSS", "Philhealth", "Pagibig", "Tax"]}
            value={formData[index] || ""}
            onChange={(val) => handleInputChange(index, val)}
            disabled={isDisabled}
            required={true}
          />
        </div>
      );
    }

    if (header === "Payment Method") {
      return (
        <div className="flex flex-col gap-y-2">
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
        <div className="flex flex-col gap-y-2">
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
        type="text"
        formName={header}
        value={formData[index] || ""}
        onChange={(e) => handleInputChange(index, e.target.value)}
        disabled={isDisabled}
        required={true}
      />
    );
  };

  if (!isModalOpen) return null;

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
              <h2>{isCreating ? "Create Remittance Record" : "Edit Remittance Record"}</h2>
              <img
                className="cursor-pointer hover:scale-110"
                src="/accounting/Close.svg"
                alt="Close"
                onClick={closeModal}
              />
            </div>
            <div className="modal-body">
              {/* Third row: Payment Date and Payment Method */}
              <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 mb-4">
                <div className="md:w-1/2">
                  {columnHeaders[4] && 
                    <div key="payment-date">
                      {renderFormField(columnHeaders[4], 4)} {/* Payment Date */}
                    </div>
                  }
                </div>
                <div className="md:w-1/2">
                  {columnHeaders[5] && 
                    <div key="payment-method">
                      {renderFormField(columnHeaders[5], 5)} {/* Payment Method */}
                    </div>
                  }
                </div>
              </div>
              
              {/* First row: Remittance ID and Employee ID */}
              <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 mb-4">
                <div className="md:w-1/2">
                  {columnHeaders[0] && 
                    <div key="remittance-id">
                      {renderFormField(columnHeaders[0], 0)} {/* Remittance ID */}
                    </div>
                  }
                </div>
                <div className="md:w-1/2">
                  {columnHeaders[1] && 
                    <div key="employee-id">
                      {renderFormField(columnHeaders[1], 1)} {/* Employee ID */}
                    </div>
                  }
                </div>
              </div>
              
              {/* Second row: Deduction Type and Amount */}
              <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 mb-4">
                <div className="md:w-1/2">
                  {columnHeaders[2] && 
                    <div key="deduction-type">
                      {renderFormField(columnHeaders[2], 2)} {/* Deduction Type */}
                    </div>
                  }
                </div>
                <div className="md:w-1/2">
                  {columnHeaders[3] && 
                    <div key="amount">
                      {renderFormField(columnHeaders[3], 3)} {/* Amount */}
                    </div>
                  }
                </div>
              </div>
              
              {/* Fourth row: Reference Number and Status */}
              <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 mb-4">
                <div className="md:w-1/2">
                  {columnHeaders[6] && 
                    <div key="reference-number">
                      {renderFormField(columnHeaders[6], 6)} {/* Reference Number */}
                    </div>
                  }
                </div>
                <div className="md:w-1/2">
                  {columnHeaders[7] && 
                    <div key="status">
                      {renderFormField(columnHeaders[7], 7)} {/* Status */}
                    </div>
                  }
                </div>
              </div>
              
              {/* Any additional fields that might be in columnHeaders */}
              {columnHeaders.slice(9).map((header, idx) => (
                idx !== 8 && (
                  <div key={`additional-${idx}`} className="mb-4">
                    {renderFormField(header, idx + 9)}
                  </div>
                )
              ))}
            </div>
            <div className="modal-footer mt-5 flex justify-end space-x-3">
              <Button name="Cancel" variant="standard1" onclick={closeModal} />
              <Button name="Submit" variant="standard2" onclick={handleFormSubmit} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TaxRemittanceModal;