import React, { useState, useEffect, useRef } from "react";
import "../ModalInput.css";
import Button from "../button/Button";
import NotifModal from "../modalNotif/NotifModal";
import axios from "axios";
import "./AddAccountModal.css";

const AddAccountModal = ({ isModalOpen, closeModal, handleSubmit }) => {
  const [allAccounts, setAllAccounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
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

  // Filter accounts based on search term
  const filteredAccounts = allAccounts.filter((a) =>
    `${a.account_name} ${a.gl_account_id}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // Handle clicks outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        inputRef.current && 
        !inputRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    setIsDropdownOpen(true);
    
    // If exact match found, select it
    const exactMatch = allAccounts.find(
      (a) => `${a.account_name} (ID: ${a.gl_account_id})` === e.target.value
    );
    
    if (exactMatch) {
      setSelectedAccount(exactMatch);
    } else {
      setSelectedAccount(null);
    }
  };

  const handleAccountSelect = (account) => {
    setSelectedAccount(account);
    setSearchTerm(`${account.account_name} (ID: ${account.gl_account_id})`);
    setIsDropdownOpen(false);
    inputRef.current.focus();
  };

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
      accountCode: selectedAccount.account_code,
    };
  
    handleSubmit(accountData);  
    setTimeout(() => closeModal(), 100);
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
            <div className="account-search-container">
              <label htmlFor="account-search">Search accounts</label>
              <div className="relative">
                <input
                  id="account-search"
                  ref={inputRef}
                  type="text"
                  className="account-search-input"
                  placeholder="Search by name or ID..."
                  value={searchTerm}
                  onChange={handleInputChange}
                  onFocus={() => setIsDropdownOpen(true)}
                  autoComplete="off"
                />
                {isDropdownOpen && filteredAccounts.length > 0 && (
                  <div ref={dropdownRef} className="account-dropdown scrollable">
                    {filteredAccounts.map((account) => (
                      <div
                        key={account.gl_account_id}
                        className={`account-item ${
                          selectedAccount?.gl_account_id === account.gl_account_id ? "selected" : ""
                        }`}
                        onClick={() => handleAccountSelect(account)}
                      >
                        <div className="account-name">{account.account_name}</div>
                        <div className="account-id">ID: {account.gl_account_id}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {selectedAccount && (
              <div className="mt-4 selected-account-details">
                <div className="detail-row">
                  <span className="detail-label">GL Account ID:</span>
                  <span className="detail-value">{selectedAccount.gl_account_id}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Account Code:</span>
                  <span className="detail-value">{selectedAccount.account_code || "N/A"}</span>
                </div>
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