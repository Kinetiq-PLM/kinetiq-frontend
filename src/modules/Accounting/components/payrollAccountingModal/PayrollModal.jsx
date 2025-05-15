// Import necessary dependencies and components
import React, { useState, useEffect } from "react";
import "../ModalInput.css";
import Dropdown from "../dropdown/Dropdown";
import Button from "../button/Button";
import Forms from "../forms/Forms";
import NotifModal from "../modalNotif/NotifModal";

const PayrollModal = ({
  isModalOpen,
  closeModal,
  selectedRow,
  handleSubmit,
  columnHeaders,
  payrollHrIds,
  isNewPayroll,
}) => {
  const [formData, setFormData] = useState(selectedRow || []);
  const [notif, setNotif] = useState({
    isOpen: false,
    type: "",
    title: "",
    message: "",
  });
  const [approvedByOptions, setApprovedByOptions] = useState([]);
  const [isLoadingApprovers, setIsLoadingApprovers] = useState(true);

  const API_URL =
    import.meta.env.VITE_API_URL ||
    "https://vyr3yqctq8.execute-api.ap-southeast-1.amazonaws.com/dev";
  const PAYROLL_HR_ENDPOINT = `${API_URL}/api/payrolls/`;

  useEffect(() => {
    if (selectedRow) {
      setFormData([...selectedRow]);
    } else {
      setFormData(Array(columnHeaders.length).fill(""));
    }
  }, [selectedRow, columnHeaders]);

  useEffect(() => {
    const fetchEmployeeIds = async () => {
      try {
        const response = await fetch(PAYROLL_HR_ENDPOINT);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        const uniqueApprovers = [
          ...new Set(result.map((item) => item.employee_id).filter(Boolean)),
        ];
        setApprovedByOptions(uniqueApprovers);
      } catch (error) {
        setNotif({
          isOpen: true,
          type: "error",
          title: "Error",
          message: "Failed to fetch approver options. Please try again later.",
        });
        setApprovedByOptions([]);
      } finally {
        setIsLoadingApprovers(false);
      }
    };

    fetchEmployeeIds();
  }, [PAYROLL_HR_ENDPOINT]);

  const generateReferenceNumber = (paymentMethod) => {
    const randomNum = Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, "0");
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
    const isFieldEditable =
      index === 0 || index === 3 || index === 4 || index === 5; // Only editable fields

    if (!isFieldEditable) {
      return;
    }

    const updatedFormData = [...formData];
    updatedFormData[index] = value; // Store the value as-is

    if (index === 5 && isNewPayroll) {
      updatedFormData[6] = generateReferenceNumber(value);
    }

    setFormData(updatedFormData);
  };

  const showValidationModal = (type, title, message) => {
    setNotif({ isOpen: true, type, title, message });
  };

  const handleFormSubmit = () => {
    if (!formData[0]) {
      showValidationModal("error", "Missing Status", "Please select a Status.");
      return;
    }
    if (!formData[3] || !isValidDate(formData[3])) {
      showValidationModal(
        "error",
        "Invalid Date Approved",
        "Please select a valid Date Approved (YYYY-MM-DD)."
      );
      return;
    }
    // Validation: Ensure the approver is the Chief Accountant
    const chiefAccountantId = "HR-EMP-2025-f5eab3";
    if (formData[4] !== chiefAccountantId) {
      showValidationModal(
        "error",
        "Invalid Approver",
        "Approval is restricted to the Chief Accountant (ID: HR-EMP-2025-f5eab3)."
      );
      return;
    }
    if (!formData[5]) {
      showValidationModal(
        "error",
        "Missing Payment Method",
        "Please select a Payment Method."
      );
      return;
    }

    const updatedFormData = [...formData];
    handleSubmit(updatedFormData); // Pass the plain string for the date
  };

  if (!isModalOpen) return null;

  const renderFormField = (header, index) => {
    const isDisabled = !(index === 0 || index === 3 || index === 4 || index === 5);

    if (header === "Date Approved") {
      return (
        <Forms
          key={index}
          type="date"
          formName={header}
          value={formData[index] || ""} // Pass the value directly
          onChange={(e) => handleInputChange(index, e.target.value)} // Update formData with selected date
          disabled={isDisabled}
          required={true}
        />
      );
    }

    if (header === "Payroll Accounting ID" || header === "Payroll HR ID" || header === "Reference Number") {
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

    if (header === "Approved By") {
      return (
        <div key={index} className="flex flex-col gap-2">
          <label>{header}</label>
          <Dropdown
            style="selection"
            defaultOption={
              isLoadingApprovers ? "Loading approvers..." : "Select approver..."
            }
            options={approvedByOptions}
            value={formData[index] || ""}
            onChange={(val) => handleInputChange(index, val)}
            disabled={isDisabled || isLoadingApprovers}
            required={true}
          />
        </div>
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
            disabled={isDisabled}
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
        value={formData[index] || ""}
        onChange={(e) => handleInputChange(index, e.target.value)}
        disabled={isDisabled}
      />
    );
  };

  return (
    <>
      <NotifModal
        isOpen={notif.isOpen}
        onClose={() => setNotif({ ...notif, isOpen: false })}
        type={notif.type}
        title={notif.title}
        message={notif.message}
      />
      <div className="accounting-modal">
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>Update Payroll Record</h2>
              <img
                className="cursor-pointer hover:scale-110"
                src="/accounting/Close.svg"
                alt="Close"
                onClick={closeModal}
              />
            </div>

            <div className="modal-body">
              <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 mb-4">
                <div className="md:w-1/2">
                  {columnHeaders[0] && renderFormField(columnHeaders[0], 0)}
                </div>
                <div className="md:w-1/2">
                  {columnHeaders[1] && renderFormField(columnHeaders[1], 1)}
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 mb-4">
                <div className="md:w-1/2">
                  {columnHeaders[2] && renderFormField(columnHeaders[2], 2)}
                </div>
                <div className="md:w-1/2">
                  {columnHeaders[3] && renderFormField(columnHeaders[3], 3)}
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 mb-4">
                <div className="md:w-1/2">
                  {columnHeaders[4] && renderFormField(columnHeaders[4], 4)}
                </div>
                <div className="md:w-1/2">
                  {columnHeaders[5] && renderFormField(columnHeaders[5], 5)}
                </div>
              </div>

              <div className="mb-4">
                {columnHeaders[6] && renderFormField(columnHeaders[6], 6)}
              </div>
            </div>

            <div className="modal-footer mt-5 flex justify-end space-x-3">
              <Button name="Cancel" variant="standard1" onclick={closeModal} />
              <Button
                name="Submit"
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

export default PayrollModal;