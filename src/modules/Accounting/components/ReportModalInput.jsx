import React, { useState, useEffect } from "react";
import "./ModalInput.css";
import Button from "../components/Button";
import Dropdown from "../components/Dropdown";
import { accounts, subAccounts } from "../submodules/ListOfAccounts";

const ReportModalInput = ({
  isModalOpen,
  closeModal,
  reportForm,
  handleInputChange,
  handleSubmit,
}) => {
  const [selectedAccount, setSelectedAccount] = useState("");
  const [selectedSubAccount, setSelectedSubAccount] = useState([]);
  const [availableSubAccounts, setAvailableSubAccounts] = useState([]);

  useEffect(() => {
    if (!selectedAccount) {
      setAvailableSubAccounts([]);
      return;
    }

    // Use the exact account name as the key
    const subAccountsList = subAccounts[selectedAccount] || [];

    setAvailableSubAccounts(subAccountsList);
    setSelectedSubAccount(""); // Reset sub-account on change
  }, [selectedAccount]);

  return (
    isModalOpen && (
      <div className="modal-overlay flex justify-center items-center">
        <div className="w-80 modal-container bg-white p-6 rounded-lg shadow-lg relative">
          {/* Modal Header */}
          <div className="modal-header flex justify-between items-center">
            <h2 className="text-lg font-semibold">Generate Financial Report</h2>
            <img
              className="cursor-pointer hover:scale-110"
              src="/accounting/Close.svg"
              alt="Close"
              onClick={closeModal}
            />
          </div>

          {/* Modal Body */}
          <div className="modal-body mt-4">
            {/* Start Date Input */}
            <div className="form-group">
              <label className="block text-sm font-medium">Start Date*</label>
              <input
                type="date"
                value={reportForm.startDate}
                onChange={(e) => handleInputChange("startDate", e.target.value)}
                className="date-input w-full p-2 border rounded"
              />
            </div>

            {/* End Date Input */}
            <div className="form-group mt-3">
              <label className="block text-sm font-medium">End Date*</label>
              <input
                type="date"
                value={reportForm.endDate}
                onChange={(e) => handleInputChange("endDate", e.target.value)}
                className="date-input w-full p-2 border rounded"
              />
            </div>

            {/* Account Dropdown */}
            <div className="form-group mt-3">
              <label className="block text-sm font-medium">Select Account*</label>
              <Dropdown
                options={Object.keys(subAccounts) || []} // Ensure account names match subAccounts keys
                style="selection"
                defaultOption="Select account..."
                value={selectedAccount}
                onChange={(value) => setSelectedAccount(value)}
              />
            </div>

            {/* Sub-Account Dropdown */}
            {availableSubAccounts.length > 0 && (
              <div className="form-group mt-3">
                <label className="block text-sm font-medium">Select Sub-Account*</label>
                <Dropdown
                  options={availableSubAccounts}
                  style="selection"
                  defaultOption="Select sub-account..."
                  value={selectedSubAccount}
                  onChange={(value) => setSelectedSubAccount(value)}
                />
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="modal-footer mt-5 flex justify-end space-x-3">
            <Button name="Cancel" variant="standard1" onClick={closeModal} />
            <Button name="Add" variant="standard2" onClick={handleSubmit} />
          </div>
        </div>
      </div>
    )
  );
};

export default ReportModalInput;
