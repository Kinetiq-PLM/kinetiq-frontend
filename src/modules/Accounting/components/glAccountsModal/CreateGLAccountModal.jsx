import React, { useState, useEffect } from "react";
import "./ModalInput.css";
import Button from "./Button";
import Dropdown from "./Dropdown";
import Forms from "./Forms";
import { accounts, subAccounts } from "../../submodules/ListOfAccounts";
import { accountCodeMapping2 } from "../../submodules/AccountMapping";

const CreateGLAccountModal = ({ isModalOpen, closeModal, handleSubmit }) => {
  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // returns 'YYYY-MM-DD'
  };

  const [selectedAccount, setSelectedAccount] = useState("");
  const [selectedSubAccount, setSelectedSubAccount] = useState("");
  const [availableSubAccounts, setAvailableSubAccounts] = useState([]);
  const [formData, setFormData] = useState({
    createdAt: getCurrentDate(),
    glAccountID: "",
    accountName: "",
    accountID: "", // User-provided Account ID (e.g., "test")
    status: "",
    account: "",
    subAccount: "",
    accountCode: "", // Auto-generated Account Code (hidden)
  });

  if (!isModalOpen) return null;

  // Convert string to camelCase for accessing subAccounts object
  const toCamelCaseKey = (str) =>
    str
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .replace(/\s(.)/g, (match, group1) => group1.toUpperCase())
      .replace(/^(.)/, (match, group1) => group1.toLowerCase());

  // Validate that subAccount belongs to selected account
  const isValidAccountAndSubAccount = (account, subAccount) => {
    const key = toCamelCaseKey(account);
    const validSubs = subAccounts[key] || [];
    console.log("Validating account:", account, "subAccount:", subAccount, "validSubs:", validSubs);
    return validSubs.includes(subAccount); // Fixed typo: validubs -> validSubs
  };

  // Update sub-account options when account changes
  useEffect(() => {
    if (!selectedAccount) {
      setAvailableSubAccounts([]);
      setSelectedSubAccount("");
      setFormData((prev) => ({ ...prev, accountCode: "", subAccount: "" }));
      return;
    }
    const key = toCamelCaseKey(selectedAccount);
    const subAccountsList = subAccounts[key] || [];
    console.log("Selected Account:", selectedAccount, "Sub-Accounts:", subAccountsList);
    setAvailableSubAccounts(subAccountsList);
    setSelectedSubAccount("");
    setFormData((prev) => ({ ...prev, subAccount: "" }));
  }, [selectedAccount]);

  // Generate Account Code when account and sub-account are selected
  useEffect(() => {
    if (selectedAccount && selectedSubAccount) {
      const year = new Date().getFullYear();
      const accountMapping = accountCodeMapping2[selectedAccount] || {};
      const subAccountMapping = accountMapping[selectedSubAccount] || {
        prefix: "XX",
        baseNumber: 9999,
      };
      const accountCode = `ACC-COA-${year}-${subAccountMapping.prefix}${subAccountMapping.baseNumber}`;
      console.log("Generated Account Code:", accountCode);
      setFormData((prev) => ({
        ...prev,
        accountCode,
      }));
    } else {
      setFormData((prev) => ({ ...prev, accountCode: "" }));
    }
  }, [selectedAccount, selectedSubAccount]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Generate GL Account ID
  const generateGLAccountID = () => {
    const year = new Date().getFullYear();
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let randomPart = "";
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomPart += characters[randomIndex];
    }
    return `ACC-GLA-${year}-${randomPart}`;
  };

  // Handle form submission
  const onSubmit = () => {
    const requiredFields = {
      createdAt: formData.createdAt,
      accountName: formData.accountName.trim(),
      accountID: formData.accountID.trim(),
      status: formData.status,
      account: formData.account,
      subAccount: formData.subAccount,
      accountCode: formData.accountCode,
    };

    console.log("Form Data on Submit:", requiredFields);

    const newGLAccountID = generateGLAccountID();
    const submissionData = {
      glAccountID: newGLAccountID,
      accountName: formData.accountName,
      accountID: formData.accountID,
      status: formData.status,
      createdAt: formData.createdAt,
      accountCode: formData.accountCode,
      account: formData.account, // Included for validation but not sent to API
      subAccount: formData.subAccount, // Included for validation but not sent to API
    };

    console.log("Submission Data:", submissionData);
    handleSubmit(submissionData);
  };

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
                value={formData.createdAt}
                onChange={(e) => handleInputChange("createdAt", e.target.value)}
              />
            </div>

            <Forms
              type="text"
              formName="Account Name*"
              placeholder="Enter Account Name"
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
            {/* Account Code input is removed to hide it from the UI */}
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