import React, { useState, useEffect } from "react";
import "./ModalInput.css";
import Forms from "./Forms";
import Dropdown from "./Dropdown";
import Button from "../components/Button";
import { accounts } from "../submodules/ListOfAccounts";
import { accountCodeMapping } from "../submodules/AccountMapping";
import axios from "axios";

const CoaModalInput = ({ isModalOpen, closeModal, coaForm, handleInputChange, handleSubmit }) => {
  const [selectedAccountType, setSelectedAccountType] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");

  // Get current year for account code
  const currentYear = new Date().getFullYear();

  // Generate account code based on account type
  const generateAccountCode = async (accountType) => {
    console.log("Generating code for accountType:", accountType); // Debug log
    if (!accountType) {
      console.warn("No account type provided");
      return "";
    }

    if (!accountCodeMapping[accountType]) {
      console.error(`No mapping found for account type: "${accountType}"`);
      console.log("Available mappings:", Object.keys(accountCodeMapping));
      return "";
    }

    const { prefix, baseNumber } = accountCodeMapping[accountType];
    console.log(`Using prefix: ${prefix}, baseNumber: ${baseNumber}`); // Debug log

    try {
      // Fetch existing accounts to find the highest code
      const response = await axios.get("http://127.0.0.1:8000/api/chart-of-accounts/");
      const existingAccounts = response.data.filter((acc) => acc.account_type === accountType);
      console.log("Existing accounts for type:", existingAccounts); // Debug log

      let maxNumber = baseNumber - 1; // Start below baseNumber
      existingAccounts.forEach((acc) => {
        const code = acc.account_code; // e.g., ACC-COA-2025-IB8010
        console.log("Processing code:", code); // Debug log
        const numberPart = parseInt(code.split("-")[3].replace(prefix, ""), 10);
        if (!isNaN(numberPart) && numberPart >= maxNumber) {
          maxNumber = numberPart;
        }
      });

      // Increment the highest number
      const newNumber = maxNumber + 1;
      const newCode = `ACC-COA-${currentYear}-${prefix}${newNumber}`;
      console.log("Generated code:", newCode); // Debug log
      return newCode;
    } catch (error) {
      console.error("Error fetching accounts for code generation:", error);
      return `ACC-COA-${currentYear}-${prefix}${baseNumber}`; // Fallback to base number
    }
  };

  // Update account code when account type changes
  useEffect(() => {
    console.log("selectedAccountType changed:", selectedAccountType); // Debug log
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
    console.log("Closing modal, resetting states"); // Debug log
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
      console.log("Modal opened, resetting states"); // Debug log
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
                                onClick={closeModal}
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
                    console.log("Dropdown selected:", value); // Debug log
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
    </div>
  );
};

export default CoaModalInput;