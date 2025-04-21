import React from 'react';
import './ModalInput.css';
import Forms from './Forms';
import Button from '../components/Button';
import Dropdown from './Dropdown';

const JournalModalInput = ({ isModalOpen, closeModal, journalForm, handleInputChange, handleSubmit, currencyOptions }) => {
    return (
        <div className='accounting-modal'>
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <div className="modal-header">
                            <h2>Create Journal ID</h2>
                            <img
                                className="cursor-pointer hover:scale-110"
                                src="./accounting/Close.svg"
                                alt="x button"
                                onClick={closeModal}
                            />
                        </div>

                        <div className="modal-body">
                            <div className="form-group">
                                <label>Journal Date*</label>
                                <input
                                    type="date"
                                    value={journalForm.journalDate}
                                    onChange={(e) => handleInputChange("journalDate", e.target.value)}
                                    className="date-input"
                                />
                            </div>

                            <Forms
                                type="text"
                                formName="Description*"
                                placeholder="Enter Description"
                                value={journalForm.description}
                                onChange={(e) => handleInputChange("description", e.target.value)}
                            />
                            <Forms
                                type="text"
                                formName="Invoice ID"
                                placeholder="Enter invoice ID (optional)"
                                value={journalForm.invoiceId}
                                onChange={(e) => handleInputChange("invoiceId", e.target.value)}
                            />

                            {/* Currency Dropdown */}
                            <div className="flex gap-x-5 max-sm:flex-col max-sm:gap-3">
                            <div className="flex flex-col gap-y-1">
                                <label>Currency*</label>
                                <Dropdown
                                    style="selection"
                                    defaultOption="Select currency..."
                                    options={currencyOptions}
                                    value={journalForm.currencyId}
                                    onChange={(value) => handleInputChange("currencyId", value)}
                                />
                            </div>
                            </div>
                        </div>


                        <div className="modal-footer">
                            <Button name="Cancel" variant="standard1" onclick={closeModal} />
                            <Button name="Add" variant="standard2" onclick={handleSubmit} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JournalModalInput;