import React, { useState, useEffect } from "react";
import "./ModalInput.css";
import Button from "./Button";
import Dropdown from "./Dropdown";
import Forms from "./Forms";
import { accounts, subAccounts } from "../submodules/ListOfAccounts";

const CreateGLAccountModal = ({ isModalOpen, closeModal, handleSubmit }) => {
  const [selectedAccount, setSelectedAccount] = useState("");
  const [selectedSubAccount, setSelectedSubAccount] = useState("");
  const [availableSubAccounts, setAvailableSubAccounts] = useState([]);
  const [formData, setFormData] = useState({
    createdAt: "",
    glAccountID: "", // Will be auto-generated on submit
    accountName: "",
    accountID: "",
    status: "",
    account: "",
    subAccount: "",
  });

  if (!isModalOpen) return null;

  // Function for Selecting Accounts and Sub-Accounts
  useEffect(() => {
    if (!selectedAccount) {
      setAvailableSubAccounts([]);
      return;
    }

    const key = toCamelCaseKey(selectedAccount);
    const subAccountsList = subAccounts[key] || [];

    setAvailableSubAccounts(subAccountsList);
    setSelectedSubAccount("");
  }, [selectedAccount]);

  // Adapt the spacing and cases in the array for accounts and subAccounts
  const toCamelCaseKey = (str) =>
    str
      .replace(/[^a-zA-Z0-9 ]/g, "") // Remove symbols
      .replace(/\s(.)/g, (match, group1) => group1.toUpperCase()) // Capitalize after spaces
      .replace(/^(.)/, (match, group1) => group1.toLowerCase()); // Lowercase first

  // Handle input change
  const handleInputChange = (field, value) => {
    setFormData((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  // Generate alphanumeric glAccountID in the format ACC-GLA-2025-XXXXXX
  const generateGLAccountID = () => {
    const year = new Date().getFullYear(); // Get current year (2025)
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; // Alphanumeric characters
    let randomPart = '';
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomPart += characters[randomIndex];
    }
    return `ACC-GLA-${year}-${randomPart}`;
  };

  // Submit form data with auto-generated glAccountID
  const onSubmit = () => {
    const newGLAccountID = generateGLAccountID(); // Generate custom ID
    const updatedFormData = {
      ...formData,
      glAccountID: newGLAccountID, // Set the generated ID
    };
    handleSubmit(updatedFormData);
  };

  // Modal UI
  return (
    <div className="accounting-modal">
      <div className="modal-overlay">
        <div className="modal-container">
          {/* Modal Header */}
          <div className="modal-header">
            <h2 className="text-lg font-semibold">Create Account</h2>
            <img
              className="cursor-pointer hover:scale-110"
              src="/accounting/Close.svg"
              alt="Close"
              onClick={closeModal}
            />
          </div>

          {/* Modal Body */}
          <div className="modal-body mt-4">
            <div className="form-group">
              <label>Created at..*</label>
              <input
                type="date"
                onChange={(e) => handleInputChange("createdAt", e.target.value)}
              />
            </div>

            <Forms
              type="text"
              formName="Account Name*"
              placeholder="Enter Account Name*"
              onChange={(e) => handleInputChange("accountName", e.target.value)}
            />
            <Forms
              type="text"
              formName="Account ID*"
              placeholder="Enter Account ID"
              onChange={(e) => handleInputChange("accountID", e.target.value)}
            />

            <div className="flex flex-col gap-y-1">
              <label>Select status*</label>
              <Dropdown
                options={["Active", "Inactive"]}
                style="selection"
                defaultOption="Select status..."
                onChange={(value) => handleInputChange("status", value)}
              />
            </div>

            <div className="flex gap-x-5 max-sm:flex-col max-sm:gap-3">
              {/* Account Dropdown */}
              <div className="flex flex-col gap-y-1">
                <label>Select Account*</label>
                <Dropdown
                  options={accounts}
                  style="selection"
                  defaultOption="Select account..."
                  value={selectedAccount}
                  onChange={(value) => {
                    setSelectedAccount(value);
                    handleInputChange("account", value);
                  }}
                />
              </div>

              {/* Sub-Account Dropdown */}
              <div className="flex flex-col gap-y-1">
                <label>Select Sub-Account*</label>
                <Dropdown
                  options={availableSubAccounts}
                  style="selection"
                  defaultOption="Select sub-account..."
                  value={selectedSubAccount}
                  onChange={(value) => {
                    setSelectedSubAccount(value);
                    handleInputChange("subAccount", value);
                  }}
                />
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="modal-footer mt-5 flex justify-end space-x-3">
            <Button name="Cancel" variant="standard1" onclick={closeModal} />
            <Button name="Add" variant="standard2" onclick={onSubmit} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateGLAccountModal;