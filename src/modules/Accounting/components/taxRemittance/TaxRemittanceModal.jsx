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
  employeeIds,
}) => {
  const [formData, setFormData] = useState(selectedRow || []);
  const [remittanceData, setRemittanceData] = useState([]);
  const [notif, setNotif] = useState({ isOpen: false, type: "error", title: "", message: "" });
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(false);

  const API_URL =
    import.meta.env.VITE_API_URL ||
    "https://vyr3yqctq8.execute-api.ap-southeast-1.amazonaws.com/dev";
  const TAXREMITTANCE_ENDPOINT = `${API_URL}/api/payroll-remittances/`;

  useEffect(() => {
    if (isModalOpen) {
      const fetchRemittanceData = async () => {
        try {
          const response = await fetch(TAXREMITTANCE_ENDPOINT);
          const data = await response.json();
          setRemittanceData(data);
        } catch (error) {
          console.error("Error fetching remittance data:", error);
          setRemittanceData([]);
        } finally {
          setIsLoadingEmployees(false);
        }
      };

      fetchRemittanceData();
    }

    if (selectedRow) {
      setFormData([...selectedRow]);
    } else {
      setFormData(Array(columnHeaders.length).fill(""));
    }
  }, [isModalOpen, selectedRow, columnHeaders]);

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
    const isFieldEditable = index === 1 || index === 2 || index === 3 || index === 4 || index === 5 || index === 7;

    if (!isFieldEditable) return;

    const updatedFormData = [...formData];
    updatedFormData[index] = value;

    if (index === 5) {
      updatedFormData[6] = generateReferenceNumber(value);
    }

    setFormData(updatedFormData);
  };

  const showNotif = (type, title, message) => {
    setNotif({ isOpen: true, type, title, message });
  };

  const handleFormSubmit = () => {
    if (!formData[1]) {
      showNotif("error", "Missing Employee ID", "Please select an Employee ID.");
      return;
    }
    const chiefAccountantId = "HR-EMP-2025-f5eab3";
    if (formData[1] !== chiefAccountantId) {
      showNotif(
        "error",
        "Invalid Employee ID",
        "Remittance is restricted to the Chief Accountant (ID: HR-EMP-2025-f5eab3)."
      );
      return;
    }
    if (!formData[2]) {
      showNotif("error", "Missing Deduction Type", "Please select a Deduction Type.");
      return;
    }
    if (!formData[3] || isNaN(parseFloat(formData[3])) || parseFloat(formData[3]) <= 0) {
      showNotif("error", "Invalid Amount", "Please enter a valid positive Amount.");
      return;
    }
    if (!formData[4] || !isValidDate(formData[4])) {
      showNotif("error", "Invalid Payment Date", "Please select a valid Payment Date (YYYY-MM-DD).");
      return;
    }
    if (!formData[5]) {
      showNotif("error", "Missing Payment Method", "Please select a Payment Method.");
      return;
    }
    if (!formData[7]) {
      showNotif("error", "Missing Status", "Please select a Status.");
      return;
    }

    const updatedFormData = [...formData];
    handleSubmit(updatedFormData);
  };

  const renderFormField = (header, index) => {
    const isDisabled = !(index === 1 || index === 2 || index === 3 || index === 4 || index === 5 || index === 7);

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
            defaultOption={isLoadingEmployees ? "Loading employees..." : "Select employee ID..."}
            options={employeeIds}
            value={formData[index] || ""}
            onChange={(val) => handleInputChange(index, val)}
            disabled={isDisabled || isLoadingEmployees}
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
              <h2>Update Remittance Record</h2>
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