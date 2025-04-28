import React, { useState, useEffect } from "react";
import "../ModalInput.css";
import Forms from "../forms/Forms";
import Dropdown from "../dropdown/Dropdown";
import Button from "../button/Button";
import NotifModal from "../modalNotif/NotifModal";
import { accounts } from "../../submodules/ListOfAccounts";
import { accountCodeMapping } from "../../submodules/AccountMapping";
import axios from "axios";

const CoaModalInput = ({ isModalOpen, closeModal, coaForm, handleInputChange, handleSubmit }) => {
  const [selectedAccountType, setSelectedAccountType] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [validation, setValidation] = useState({
    isOpen: false,
    type: "warning",
    title: "",
    message: "",
  });

  // API endpoint
  const API_URL =
    import.meta.env.VITE_API_URL || "https://vyr3yqctq8.execute-api.ap-southeast-1.amazonaws.com/dev";
  const COA_ENDPOINT = `${API_URL}/api/chart-of-accounts/`;

  // Get current year for account code
  const currentYear = new Date().getFullYear();

  // Generate account code based on account type
  const generateAccountCode = async (accountType) => {
    console.log("Generating code for accountType:", accountType);
    if (!accountType) {
      console.warn("No account type provided");
      return "";
    }

    if (!accountCodeMapping[accountType]) {
      console.error(`No mapping found for account type: "${accountType}"`);
      setValidation({
        isOpen: true,
        type: "error",
        title: "Invalid Account Type",
        message: `No mapping found for account type: "${accountType}".`,
      });
      return "";
    }

    const { prefix, baseNumber } = accountCodeMapping[accountType];
    console.log(`Using prefix: ${prefix}, baseNumber: ${baseNumber}`);

    try {
      const response = await axios.get(COA_ENDPOINT);
      const existingAccounts = response.data.filter((acc) => acc.account_type === accountType);
      console.log("Existing accounts for type:", existingAccounts);

      let maxNumber = baseNumber - 10; // Adjust for increment by 10
      existingAccounts.forEach((acc) => {
        const code = acc.account_code; // e.g., ACC-COA-2025-CA1090
        console.log("Processing code:", code);
        const numberPart = parseInt(code.split("-")[3].replace(prefix, ""), 10);
        if (!isNaN(numberPart) && numberPart > maxNumber) {
          maxNumber = numberPart;
        }
      });

      // Round up to the next multiple of 10
      const newNumber = Math.ceil((maxNumber + 1) / 10) * 10;
      const newCode = `ACC-COA-${currentYear}-${prefix}${newNumber}`;
      console.log("Generated code:", newCode);
      return newCode;
    } catch (error) {
      console.error("Error fetching accounts for code generation:", error);
      setValidation({
        isOpen: true,
        type: "error",
        title: "Fetch Error",
        message: "Failed to fetch existing accounts for code generation.",
      });
      return `ACC-COA-${currentYear}-${prefix}${baseNumber}`; // Fallback
    }
  };

  // Update account code when account type changes
  useEffect(() => {
    console.log("selectedAccountType changed:", selectedAccountType);
    if (selectedAccountType) {
      generateAccountCode(selectedAccountType).then((code) => {
        setGeneratedCode(code);
        handleInputChange("account_code", code);
        handleInputChange("account_type", selectedAccountType);
      });
    } else {
      setGeneratedCode("");
      handleInputChange("account_code", "");
      handleInputChange("account_type", "");
    }
  }, [selectedAccountType]);

  // Reset states when modal is closed
  const handleCloseModal = () => {
    console.log("Closing modal, resetting states");
    setSelectedAccountType("");
    setGeneratedCode("");
    handleInputChange("account_name", "");
    handleInputChange("account_code", "");
    handleInputChange("account_type", "");
    closeModal();
  };

  // Reset states when modal is opened
  useEffect(() => {
    if (isModalOpen) {
      console.log("Modal opened, resetting states");
      setSelectedAccountType("");
      setGeneratedCode("");
      handleInputChange("account_name", "");
      handleInputChange("account_code", "");
      handleInputChange("account_type", "");
    }
  }, [isModalOpen]);

  return (
    <div className="accounting-modal">
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>Creating Account</h2>
              <img
                className="cursor-pointer hover:scale-110"
                src="./accounting/Close.svg"
                alt="x button"
                onClick={handleCloseModal}
              />
            </div>

            <div className="modal-body">
              {/* Account Name Input */}
              <Forms
                type="text"
                formName="Account Name*"
                placeholder="Enter account name"
                value={coaForm.account_name}
                onChange={(e) => handleInputChange("account_name", e.target.value)}
              />

              {/* Account Type Dropdown */}
              <div className="flex flex-col gap-y-1">
                <label>Account Type*</label>
                <Dropdown
                  options={accounts}
                  style="selection"
                  defaultOption="Select account type..."
                  value={selectedAccountType}
                  onChange={(value) => {
                    console.log("Dropdown selected:", value);
                    setSelectedAccountType(value);
                  }}
                />
              </div>

              {/* Auto-Generated Account Code (Read-Only) */}
              <Forms
                type="text"
                formName="Account Code*"
                placeholder="Auto-generated account code"
                value={generatedCode}
                readOnly
              />
            </div>

            <div className="modal-footer">
              <Button name="Cancel" variant="standard1" onclick={handleCloseModal} />
              <Button name="Add Account" variant="standard2" onclick={handleSubmit} />
            </div>
          </div>
        </div>
      )}
      {validation.isOpen && (
        <NotifModal
          isOpen={validation.isOpen}
          onClose={() => setValidation({ ...validation, isOpen: false })}
          type={validation.type}
          title={validation.title}
          message={validation.message}
        />
      )}
    </div>
  );
};

export default CoaModalInput;