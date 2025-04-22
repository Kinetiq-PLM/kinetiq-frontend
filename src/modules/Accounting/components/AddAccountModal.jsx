import React, { useState, useEffect } from "react";
import "./ModalInput.css";
import Button from "./Button";
import Dropdown from "./Dropdown";
import Search from "./Search";
import NotifModal from "./modalNotif/NotifModal";
import axios from "axios";

const AddAccountModal = ({ isModalOpen, closeModal, handleSubmit }) => {
  const [allAccounts, setAllAccounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [validation, setValidation] = useState({
    isOpen: false,
    type: "warning",
    title: "",
    message: "",
  });

  // API endpoint
  const API_URL =
    import.meta.env.VITE_API_URL || "https://vyr3yqctq8.execute-api.ap-southeast-1.amazonaws.com/dev";
  const GL_ACCOUNTS_ENDPOINT = `${API_URL}/api/general-ledger-accounts/`;

  // Fetch accounts
  useEffect(() => {
    if (!isModalOpen) return;
    const fetchAccounts = async () => {
      try {
        const response = await axios.get(GL_ACCOUNTS_ENDPOINT);
        console.log("API Response (fetchAccounts):", response.data);
        setAllAccounts(response.data);
      } catch (error) {
        console.error("Error fetching accounts:", error.response ? error.response.data : error);
        setValidation({
          isOpen: true,
          type: "error",
          title: "Fetch Error",
          message: "Failed to load accounts. Please check your connection.",
        });
      }
    };
    fetchAccounts();
  }, [isModalOpen]);

  const filteredAccounts = allAccounts.filter((a) =>
    `${a.account_name} ${a.gl_account_id}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const onAddAccount = () => {
    if (!selectedAccount) {
      setValidation({
        isOpen: true,
        type: "warning",
        title: "No Account Selected",
        message: "Please select an account.",
      });
      return;
    }

    const accountData = {
      glAccountId: selectedAccount.gl_account_id,
      accountName: selectedAccount.account_name,
    };

    handleSubmit(accountData);
    closeModal();
  };

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

export default AddAccountModal;