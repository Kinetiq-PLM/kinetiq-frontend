import React, { useState, useEffect } from "react";
import "./ModalInput.css";
import Button from "./Button";
import Dropdown from "./Dropdown";
import Search from "./Search";

const AddAccountModal = ({ isModalOpen, closeModal, handleSubmit }) => {
  const [allAccounts, setAllAccounts] = useState([]);
  const [mainAccounts, setMainAccounts] = useState([]);
  const [subAccounts, setSubAccounts] = useState([]);
  const [selectedMainAccount, setSelectedMainAccount] = useState("");
  const [selectedSubAccount, setSelectedSubAccount] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMainAccounts, setFilteredMainAccounts] = useState([]);


  // Fetching the Data
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/general-ledger-accounts/");
        const result = await response.json();
        setAllAccounts(result);

        // Extract unique GL account IDs for main accounts
        const mains = [...new Set(result.map(a => a.account_code))];
        setMainAccounts(mains);
      } catch (error) {
        console.error("Error fetching accounts:", error);
      }
    };
    if (isModalOpen) fetchAccounts();
  }, [isModalOpen]);

  useEffect(() => {
    if (!selectedMainAccount) {
      setSubAccounts([]);
      setSelectedSubAccount("");
      return;
    }


    // Filter sub-accounts based on selected GL account ID
    const filteredSubAccounts = allAccounts
      .filter(a => a.account_code === selectedMainAccount)
      .map(a => ({
        account_code: a.account_code,
        name: a.account_name
      }));
    setSubAccounts(filteredSubAccounts);
    setSelectedSubAccount("");
  }, [selectedMainAccount, allAccounts]);

  const onAddAccount = () => {
    if (!selectedMainAccount || !selectedSubAccount) {
      alert("Please select both an account and a sub-account.");
      return;
    }


    const selectedAccount = subAccounts.find(a => a.name === selectedSubAccount);
    const accountData = {
      glAccountId: selectedAccount.account_code, // Use the actual account_code
      accountName: selectedAccount.name // Display purposes
    };

    handleSubmit(accountData);
    closeModal();
  };


  // Searching for account code
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredMainAccounts(mainAccounts);
    } else {
      const filtered = mainAccounts.filter(account =>
        account.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMainAccounts(filtered);
    }
  }, [searchTerm, mainAccounts]);

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

          {/* Search for account id */}
          <div className="modal-body mt-4">
            <div className="mb-3">
              <Search
                type="text"
                placeholder="Enter account code.."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

            </div>


            {/* Dropdown selection */}
            <div className="flex gap-x-5 max-sm:flex-col max-sm:gap-3">
              <div className="-mt-2">
                <Dropdown
                  options={filteredMainAccounts}
                  style="selection"
                  defaultOption="Select account code..."
                  value={selectedMainAccount}
                  onChange={(value) => setSelectedMainAccount(value)}
                />
              </div>

              <div className="-mt-2">
                <Dropdown
                  options={subAccounts.map(a => a.name)}
                  style="selection"
                  defaultOption="Select Account Name..."
                  value={selectedSubAccount}
                  onChange={(value) => setSelectedSubAccount(value)}
                />
              </div>
            </div>
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