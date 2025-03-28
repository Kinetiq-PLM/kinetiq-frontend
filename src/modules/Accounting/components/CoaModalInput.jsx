import React from 'react';
import './ModalInput.css';
import Forms from './Forms';
import Dropdown from './Dropdown';
import Button from '../components/Button';
import { accounts } from '../submodules/ListOfAccounts';

const CoaModalInput = ({ isModalOpen, closeModal, coaForm, handleInputChange, handleSubmit }) => {
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
                            <Dropdown 
                                options={accounts}
                                style="selection"
                                defaultOption="Select account type"
                                value={coaForm.account_type}
                                onChange={(value) => handleInputChange("account_type", value)} 
                            />

                            <Forms
                                type="text"
                                formName="Account Code*"
                                placeholder="Enter Account Code"
                                value={coaForm.account_code} // ✅ Fixed key
                                onChange={(e) => handleInputChange("account_code", e.target.value)}
                            />

                            <Forms
                                type="text"
                                formName="Account Name*"
                                placeholder="Enter account name"
                                value={coaForm.account_name} // ✅ Fixed key
                                onChange={(e) => handleInputChange("account_name", e.target.value)}
                            />
                        </div>

                        <div className="modal-footer">
                            <Button name="Cancel" variant="standard1" onclick={closeModal} /> {/* ✅ Fixed onClick */}
                            <Button name="Add Account" variant="standard2" onclick={handleSubmit} /> {/* ✅ Fixed onClick */}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CoaModalInput;
