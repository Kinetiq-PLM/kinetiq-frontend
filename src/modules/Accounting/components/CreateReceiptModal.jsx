import React, { useState, useEffect } from "react";
import "./ModalInput.css";
import Button from "./Button";
import Forms from "./Forms";
import Dropdown from "./Dropdown";

const CreateReceiptModal = ({
  isModalOpen,
  closeModal,
  reportForm,
  handleInputChange,
  handleSubmit,
  setValidation,
  invoiceOptions, // Added prop for Sales Invoice ID dropdown
}) => {
  const [bankAccounts, setBankAccounts] = useState([]);
  const [showBankInput, setShowBankInput] = useState(false);
  const [newBankAccount, setNewBankAccount] = useState({
    accountName: "",
    accountCode: "",
  });

  const API_URL =
    import.meta.env.VITE_API_URL ||
    "https://vyr3yqctq8.execute-api.ap-southeast-1.amazonaws.com/dev";
  const GENERAL_LEDGER_ENDPOINT = `${API_URL}/api/general-ledger-accounts/`;

  const fetchData = () => {
    fetch(GENERAL_LEDGER_ENDPOINT)
      .then((response) => {
        if (!response.ok)
          throw new Error(
            `Failed to fetch general ledger accounts: ${response.status}`
          );
        return response.json();
      })
      .then((result) => {
        const filtered = result.filter(
          (entry) =>
            entry.account_name?.toLowerCase().includes("bank") ||
            entry.account_type?.toLowerCase() === "bank" ||
            entry.account_category?.toLowerCase() === "bank"
        );
        setBankAccounts(filtered);
        if (filtered.length === 0) {
          setValidation({
            isOpen: true,
            type: "warning",
            title: "No Bank Accounts",
            message: "No bank accounts found. Please add a new bank account.",
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setValidation({
          isOpen: true,
          type: "error",
          title: "Fetch Error",
          message: `Unable to load bank accounts: ${error.message}. Please try again.`,
        });
      });
  };

  useEffect(() => {
    if (isModalOpen) {
      fetchData();
    }
  }, [isModalOpen]);

  const saveBankAccount = () => {
    if (!newBankAccount.accountName || !newBankAccount.accountCode) {
      setValidation({
        isOpen: true,
        type: "warning",
        title: "Missing Fields",
        message: "Please provide both account name and account code.",
      });
      return;
    }

    const generateGLAccountID = () => {
      const prefix = "GL-BANK";
      const randomString = Math.random()
        .toString(36)
        .substring(2, 7)
        .toUpperCase();
      return `${prefix}-${randomString}`;
    };

    const payload = {
      gl_account_id: generateGLAccountID(),
      account_name: newBankAccount.accountName,
      account_code: newBankAccount.accountCode,
      account_type: "bank",
      account_category: "bank",
      status: "Active",
      created_by: reportForm.createdBy || "system",
    };

    fetch(GENERAL_LEDGER_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        fetchData();
        setNewBankAccount({ accountName: "", accountCode: "" });
        setShowBankInput(false);
        handleInputChange("bankAccount", data.account_name || newBankAccount.accountName);
        setValidation({
          isOpen: true,
          type: "success",
          title: "Bank Account Added",
          message: `Bank account "${data.account_name}" has been successfully added.`,
        });
      })
      .catch((error) => {
        console.error("Error saving bank account:", error);
        setValidation({
          isOpen: true,
          type: "error",
          title: "Save Error",
          message: `Unable to save the bank account: ${error.message}. Please try again.`,
        });
      });
  };

  if (!isModalOpen) return null;

  return (
    <div className="accounting-modal">
      <div className="modal-overlay">
        <div className="modal-container">
          <div className="modal-header">
            <h2 className="text-lg font-semibold">Create Receipt</h2>
            <img
              className="cursor-pointer hover:scale-110"
              src="/accounting/Close.svg"
              alt="Close"
              onClick={closeModal}
            />
          </div>
          <div className="modal-body mt-4">
            <div className="form-group">
              <label>Created at..*</label>
              <input
                type="date"
                value={reportForm.startDate}
                onChange={(e) => handleInputChange("startDate", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-y-1">
              <label>Sales Invoice ID*</label>
              <Dropdown
                style="selection"
                defaultOption="Select invoice..."
                options={invoiceOptions}
                value={reportForm.salesInvoiceId}
                onChange={(value) => handleInputChange("salesInvoiceId", value)}
              />
            </div>
            <Forms
              type="number"
              formName="Amount Paid*"
              placeholder="Enter Amount paid"
              value={reportForm.amountPaid}
              onChange={(e) => handleInputChange("amountPaid", e.target.value)}
            />
            <div className="flex flex-col gap-y-2">
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

            <Forms
              type="text"
              formName="Created By*"
              placeholder="Created by..."
              value={reportForm.createdBy}
              disabled={true}
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
};

export default CreateReceiptModal;