import React, { useState, useEffect } from "react";
import "./ModalInput.css";
import Button from "./Button";
import Dropdown from "./Dropdown";
import { accounts, subAccounts } from "../submodules/ListOfAccounts";

const AddAccountModal = ({ isModalOpen, closeModal, reportForm, handleInputChange, handleSubmit, }) => {
  const [selectedAccount, setSelectedAccount] = useState("");
  const [selectedSubAccount, setSelectedSubAccount] = useState([]);
  const [availableSubAccounts, setAvailableSubAccounts] = useState([]);
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
    setSelectedSubAccount(""); // or [] based on how you store value
  }, [selectedAccount]);



  // Adapt the spacing and cases in the array for accounts and subAccounts
  const toCamelCaseKey = (str) =>
    str
      .replace(/[^a-zA-Z0-9 ]/g, "") // Remove symbols
      .replace(/\s(.)/g, (match, group1) => group1.toUpperCase()) // Capitalize after spaces
      .replace(/^(.)/, (match, group1) => group1.toLowerCase()); // Lowercase first



  // Modal UI
  return (
    <div className="modal-overlay">


      <div className="modal-container">


        {/* Modal Header */}
        <div className="modal-header">


          <h2 className="text-lg font-semibold">Select Account</h2>

          <img
            className="cursor-pointer hover:scale-110"
            src="/accounting/Close.svg"
            alt="Close"
            onClick={closeModal} />


        </div>



        {/* Modal Body */}
        <div className="modal-body mt-4">

          <div className="flex gap-x-5 max-sm:flex-col max-sm:gap-3">
            {/* Account Dropdown */}
            <div className="-mt-2">
              <Dropdown
                options={accounts}
                style="selection"
                defaultOption="Select account..."
                value={selectedAccount}
                onChange={(value) => setSelectedAccount(value)}
              />
            </div>

            {/* Sub-Account Dropdown */}
            <div className="-mt-2">
              <Dropdown
                options={availableSubAccounts}
                style="selection"
                defaultOption="Select sub-account..."
                value={selectedSubAccount}
                onChange={(value) => setSelectedSubAccount(value)}
              />
            </div>
          </div>



        </div>

        {/* Modal Footer */}
        <div className="modal-footer mt-5 flex justify-end space-x-3">
          <Button name="Cancel" variant="standard1" onclick={closeModal} />
          <Button name="Add" variant="standard2" onclick={handleSubmit} />
        </div>
      </div>
    </div>
  );
};

export default AddAccountModal;
