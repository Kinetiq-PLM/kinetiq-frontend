import React, { useState, useEffect } from 'react';
import './ModalInput.css';
import Forms from './Forms';
import Dropdown from './Dropdown';
import Button from '../components/Button';
import { accounts } from '../submodules/ListOfAccounts';

const CoaModalInput = ({ isModalOpen, closeModal, coaForm, handleInputChange, handleSubmit }) => {
    const [selectedAccount, setSelectedAccount] = useState("");
    const [accountCode, setAccountCode] = useState("ACC-COA-2025-<code>");
    

    return (
        <div>
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <div className="modal-header">
                            <h2>Creating Account</h2>
                            <img className="cursor-pointer hover:scale-110" src="./accounting/Close.svg" alt="x button" onClick={closeModal} />
                        </div>

                        <div className="modal-body">

                            <Forms
                                type="text"
                                formName="Account Name*"
                                placeholder="Enter account name"
                                value={coaForm.account_name}
                                onChange={(e) => handleInputChange("account_name", e.target.value)}
                            />

                            <Forms type="text"
                                formName="Account Code*"
                                placeholder="Enter account code"
                                value={accountCode}
                                onChange={(e) => {
                                    const maxLength = 19; // Set the character limit
                                    const limitedValue = e.target.value.substring(0, maxLength);
                                    setAccountCode(limitedValue);
                                    handleInputChange("account_code", e.target.value)
                                }}
                            />

                            <div className="flex gap-x-5 max-sm:flex-col max-sm:gap-3">
                                {/* Account Dropdown */}
                                <div className="flex flex-col gap-y-1">
                                    <label> Select Account*</label>
                                    <Dropdown
                                        options={accounts}
                                        style="selection"
                                        defaultOption="Select account..."
                                        value={selectedAccount}
                                        onChange={(value) => {
                                            const selectedAccountCode = value; // Assuming value is the account code
                                            setSelectedAccount(value);
                                            handleInputChange("account", value);
                                            handleInputChange("accountCode", selectedAccountCode); // Set account code in form data
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <Button name="Cancel" variant="standard1" onclick={closeModal} />
                            <Button name="Add Account" variant="standard2" onclick={handleSubmit} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CoaModalInput;