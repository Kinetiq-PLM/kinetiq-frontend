import React, { useState, useEffect } from "react";
import "../ModalInput.css";
import Button from "../button/Button";
import Forms from "../forms/Forms";
import Dropdown from "../dropdown/Dropdown";

const TaxRemittance = ({ isModalOpen, closeModal, reportForm, handleInputChange, handleSubmit, setValidation, }) => {

    if (!isModalOpen) return null;

    return (
        <div className="accounting-modal">
            <div className="modal-overlay">
                <div className="modal-container">
                    <div className="modal-header">
                        <h2 className="text-lg font-semibold">Accounts Payable Receipt</h2>
                        <img
                            className="cursor-pointer hover:scale-110"
                            src="/accounting/Close.svg"
                            alt="Close"
                            onClick={closeModal}
                        />
                    </div>
                    <div className="modal-body mt-4">
                        <div className="flex flex-col gap-y-1">
                            <Forms
                                type="text"
                                formName="Accounts Payable ID*"
                                placeholder="Enter accounts payable ID"
                            />

                            <Forms
                                type="text"
                                formName="Invoice ID*"
                                placeholder="Enter invoice ID"
                            />
                        </div>

                        <Forms
                            type="number"
                            formName="Amount Paid*"
                            placeholder="Enter Amount paid"
                            value={reportForm.amountPaid}
                            onChange={(e) => handleInputChange("amountPaid", e.target.value)}
                        />

                        <div className="flex flex-col gap-y-1">
                            <Forms
                                type="text"
                                formName="Paid by*"
                                placeholder="paid by..."
                            />

                            <Forms
                                type="text"
                                formName="Reference Number*"
                                placeholder="Enter reference #"
                            />
                        </div>

                        <div className="flex flex-col md:flex-row md:space-x-5 space-y-5 md:space-y-0">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium">
                                    Select Payment Method*
                                </label>
                                <Dropdown
                                    style="selection"
                                    defaultOption="Select payment method..."
                                    options={["Cash", "Bank Transfer"]}
                                    value={reportForm.paymentMethod}
                                    onChange={(value) => {
                                        handleInputChange("paymentMethod", value);
                                        if (value !== "Bank Transfer") {
                                            handleInputChange("bankAccount", "");
                                        }
                                        if (value !== "Check") {
                                            handleInputChange("checkNumber", "");
                                        }
                                        if (value !== "Mobile Payment") {
                                            handleInputChange("transactionId", "");
                                        }
                                    }}
                                />
                            </div>

                            {reportForm.paymentMethod === "Bank Transfer" && (
                                <div className="md:w-2/3 border border-gray-300 rounded-lg p-4 bg-gray-100 space-y-4">
                                    <div className="flex flex-col sm:flex-row gap-y-2 sm:gap-x-6 text-sm">

                                        <label className="flex items-center gap-x-2">
                                            <input
                                                type="radio"
                                                checked={!showBankInput}
                                                onChange={() => setShowBankInput(false)}
                                            />
                                            <span>Bank accounts</span>
                                        </label>
                                        <label className="flex items-center gap-x-2">
                                            <input
                                                type="radio"
                                                checked={showBankInput}
                                                onChange={() => setShowBankInput(true)}
                                            />
                                            <span>Add new bank account</span>
                                        </label>
                                    </div>

                                    {!showBankInput ? (
                                        <div>
                                            <label className="block text-sm font-medium mb-1">
                                                Select Bank Account*
                                            </label>
                                            <Dropdown
                                                style="selection"
                                                defaultOption="Select bank account..."
                                                options={bankAccounts.map((account) => account.account_name)}
                                                value={reportForm.bankAccount}
                                                onChange={(value) => {
                                                    handleInputChange("bankAccount", value);
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            <Forms
                                                type="text"
                                                formName="Account Name*"
                                                placeholder="Enter account name"
                                                value={newBankAccount.accountName}
                                                onChange={(e) =>
                                                    setNewBankAccount({
                                                        ...newBankAccount,
                                                        accountName: e.target.value,
                                                    })
                                                }
                                            />
                                            <Forms
                                                type="text"
                                                formName="Account Code*"
                                                placeholder="Enter account code"
                                                value={newBankAccount.accountCode}
                                                onChange={(e) =>
                                                    setNewBankAccount({
                                                        ...newBankAccount,
                                                        accountCode: e.target.value,
                                                    })
                                                }
                                            />
                                            <Button
                                                name="Save Bank Account"
                                                variant="standard2"
                                                onclick={saveBankAccount}
                                            />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {reportForm.paymentMethod === "Check" && (
                            <Forms
                                type="text"
                                formName="Check Number*"
                                placeholder="Enter check number"
                                value={reportForm.checkNumber}
                                onChange={(e) => handleInputChange("checkNumber", e.target.value)}
                            />
                        )}

                        {reportForm.paymentMethod === "Mobile Payment" && (
                            <Forms
                                type="text"
                                formName="Transaction ID*"
                                placeholder="Enter transaction ID"
                                value={reportForm.transactionId}
                                onChange={(e) => handleInputChange("transactionId", e.target.value)}
                            />
                        )}

                        <Dropdown
                            style="selection"
                            defaultOption="Update Status..."
                            options={["Draft", "Processing", "Completed"]}
                        />

                    </div>
                    <div className="modal-footer mt-5 flex justify-end space-x-3">
                        <Button name="Cancel" variant="standard1" onclick={closeModal} />
                        <Button name="Add" variant="standard2" onclick={handleSubmit} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TaxRemittance
