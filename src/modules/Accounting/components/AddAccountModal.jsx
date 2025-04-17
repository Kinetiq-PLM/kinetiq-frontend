import React, { useState, useEffect } from "react";
import "./ModalInput.css";
import Button from "./Button";
import Dropdown from "./Dropdown";
import Search from "./Search";

const AddAccountModal = ({ isModalOpen, closeModal, handleSubmit }) => {
  const [allAccounts, setAllAccounts] = useState([]);
  const [mainAccounts, setMainAccounts] = useState([]);
  const [availableSubAccounts, setAvailableSubAccounts] = useState([]);
  const [selectedMainAccount, setSelectedMainAccount] = useState("");
  const [selectedSubAccount, setSelectedSubAccount] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAccount, setSelectedAccount] = useState(null);

  // Fetch accounts
  useEffect(() => {
    if (!isModalOpen) return;
    fetch("http://127.0.0.1:8000/api/general-ledger-accounts/")
      .then((res) => res.json())
      .then((data) => setAllAccounts(data))
      .catch((err) => console.error("Error fetching accounts:", err));
  }, [isModalOpen]);

  const filteredAccounts = allAccounts.filter((a) =>
    `${a.account_name} ${a.gl_account_id}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );


  // Update sub-accounts when GL ID changes
  useEffect(() => {
    if (!selectedMainAccount) {
      setAvailableSubAccounts([]);
      setSelectedSubAccount("");
      return;
    }

    const subAccountsList = allAccounts
      .filter(a => a.gl_account_id === selectedMainAccount)
      .map(a => a.account_name);
    setAvailableSubAccounts(subAccountsList);
    setSelectedSubAccount("");
  }, [selectedMainAccount, allAccounts]);

  const onAddAccount = () => {
    if (!selectedAccount) {
      alert("Please select an account.");
      return;
    }

    const accountData = {
      glAccountId: selectedAccount.gl_account_id,
      accountName: selectedAccount.account_name,
    };

    handleSubmit(accountData);
    closeModal();
  };

  // Dynamic filtering
  const filteredMainAccounts = mainAccounts.filter(accountId =>
    accountId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSubAccounts = availableSubAccounts.filter(name =>
    name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isModalOpen) return null;

  return (
    <div className="accounting-modal">
      <div className="modal-overlay">
        <div className="modal-container">
          <div className="modal-header">
            <h2 className="text-lg font-semibold">Select Account</h2>
            <img
              className="cursor-pointer hover:scale-110"
              src="/accounting/Close.svg"
              alt="Close"
              onClick={closeModal}
            />
          </div>

          <div className="modal-body mt-4">
            <Search
              type="text"
              placeholder="Search by Name or GL Account ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />


            <div className="mt-3">
              <Dropdown
                options={filteredAccounts.map(
                  (a) => `${a.account_name} (ID: ${a.gl_account_id})`
                )}
                style="selection"
                defaultOption="Select Account..."
                value={
                  selectedAccount
                    ? `${selectedAccount.account_name} (ID: ${selectedAccount.gl_account_id})`
                    : ""
                }
                onChange={(label) => {
                  const matched = allAccounts.find(
                    (a) => `${a.account_name} (ID: ${a.gl_account_id})` === label
                  );
                  setSelectedAccount(matched || null);
                }}
              />

            </div>

            {selectedAccount && (
              <div className="mt-4 text-sm text-gray-600">
                <strong>GL Account ID:</strong> {selectedAccount.gl_account_id}
              </div>
            )}
          </div>

          <div className="modal-footer mt-5 flex justify-end space-x-3">
            <Button name="Cancel" variant="standard1" onclick={closeModal} />
            <Button name="Add" variant="standard2" onclick={onAddAccount} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAccountModal;
