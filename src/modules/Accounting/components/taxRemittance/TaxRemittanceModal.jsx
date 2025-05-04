import React, { useState, useEffect } from "react";
import "../ModalInput.css";
import Button from "../button/Button";
import Forms from "../forms/Forms";
import Dropdown from "../dropdown/Dropdown";

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

  // Fetch employee IDs from payroll journal API and remittance data from payroll remittances API
  useEffect(() => {
    if (isModalOpen) {
      // Fetch employee IDs
      const fetchEmployeeIds = async () => {
        try {
          const response = await fetch(
            "https://vyr3yqctq8.execute-api.ap-southeast-1.amazonaws.com/dev/api/payroll-journal/"
          );
          const data = await response.json();
          // Assuming the API returns an array of objects with an 'employee_id' field
          const ids = data.map((item) => item.employee_id).filter((id) => id);
          setEmployeeIds(ids);
        } catch (error) {
          console.error("Error fetching employee IDs:", error);
          setEmployeeIds([]);
        }
      };

      // Fetch remittance data
      const fetchRemittanceData = async () => {
        try {
          const response = await fetch(
            "https://vyr3yqctq8.execute-api.ap-southeast-1.amazonaws.com/dev/api/payroll-remittances/"
          );
          const data = await response.json();
          // Assuming the API returns an array of remittance records
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

  // Update formData when selectedRow or isCreating changes
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
      ? index !== 0 && index !== 6 // Allow all except remittance_id and reference_number
      : index === 7; // Only allow Status in edit mode

    if (!isFieldEditable) return;

    const updatedFormData = [...formData];
    updatedFormData[index] = value;
    setFormData(updatedFormData);
  };

  const handleFormSubmit = () => {
    if (isCreating) {
      if (!formData[1]) {
        alert("Please select an Employee ID.");
        return;
      }
      // Validate Employee ID exists in remittance data (optional, depending on requirements)
      const employeeExists = remittanceData.some(
        (remittance) => remittance.employee_id === formData[1]
      );
      if (!employeeExists && remittanceData.length > 0) {
        alert("Selected Employee ID does not have associated remittance records.");
        return;
      }
      if (!formData[2]) {
        alert("Please select a Deduction Type.");
        return;
      }
      if (!formData[3] || isNaN(parseFloat(formData[3]))) {
        alert("Please enter a valid Amount.");
        return;
      }
      if (!formData[4]) {
        alert("Please select a Payment Date.");
        return;
      }
      if (!formData[5]) {
        alert("Please select a Payment Method.");
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
            <h2>{isCreating ? "Create Remittance Record" : "Edit Remittance Record"}</h2>
            <img
              className="cursor-pointer hover:scale-110"
              src="/accounting/Close.svg"
              alt="Close"
              onClick={closeModal}
            />
          </div>
          <div className="modal-body">
            {columnHeaders.map((header, index) => {
              if (index === 8) return null; // Skip Actions column
              const isDisabled = isCreating
                ? header === "Remittance ID" || header === "Reference Number"
                : header !== "Status";

              if (header === "Remittance ID" || header === "Reference Number") {
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
              if (header === "Employee ID") {
                return (
                  <div key={index} className="form-group">
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
                  <div key={index} className="form-group">
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
                  <div key={index} className="form-group">
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
                  <div key={index} className="form-group">
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

export default TaxRemittanceModal;