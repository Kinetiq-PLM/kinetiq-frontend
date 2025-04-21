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
}) => {
  const [data, setData] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [showBankInput, setShowBankInput] = useState(false);
  const [newBankAccount, setNewBankAccount] = useState({
    accountName: "",
    accountCode: "",
  });

  const fetchData = () => {
    fetch('http://127.0.0.1:8000/api/general-ledger-accounts/')
      .then(response => response.json())
      .then(result => {
        console.log('API Response (fetchData):', result);
        setData(result.map(entry => [
          entry.gl_account_id || "-",
          entry.account_name || "-",
          entry.account_code || "-",
          entry.account_id || "-",
          entry.status || "-",
          entry.created_at ? new Date(entry.created_at).toLocaleString() : "-",
        ]));

        const filtered = result.filter(entry =>
          entry.account_name?.toLowerCase().includes("bank")
        );
        setBankAccounts(filtered);
      })
      .catch(error => console.error('Error fetching data:', error));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const saveBankAccount = () => {
    const payload = {
      account_name: newBankAccount.accountName,
      account_code: newBankAccount.accountCode,
      status: "active",
    };

    fetch('http://127.0.0.1:8000/api/general-ledger-accounts/', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then(response => {
        if (!response.ok) throw new Error("Failed to save bank account.");
        return response.json();
      })
      .then(data => {
        console.log("Bank account saved:", data);
        fetchData();
        setNewBankAccount({ accountName: "", accountCode: "" });
        setShowBankInput(false);
        // Automatically select the newly added bank account
        handleInputChange("bankAccount", data.account_name);
      })
      .catch(error => console.error("Error saving bank account:", error));
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

            <Forms
              type="text"
              formName="Sales Invoice ID*"
              placeholder="Enter sales invoice ID"
              value={reportForm.salesInvoiceId}
              onChange={(e) => handleInputChange("salesInvoiceId", e.target.value)}
            />

            <Forms
              type="number"
              formName="Amount Paid*"
              placeholder="Enter Amount paid"
              value={reportForm.amountPaid}
              onChange={(e) => handleInputChange("amountPaid", e.target.value)}
            />

            <div className="flex flex-col md:flex-row md:space-x-5 space-y-5 md:space-y-0">
              <div className="space-y-2">
                <label className="block text-sm font-medium">Select Payment Method*</label>
                <Dropdown
                  style="selection"
                  defaultOption="Select payment method..."
                  options={["Cash", "Credit Card", "Bank Transfer", "Check", "Mobile Payment"]}
                  value={reportForm.paymentMethod}
                  onChange={(value) => {
                    handleInputChange("paymentMethod", value);
                    if (value !== "Bank Transfer") {
                      handleInputChange("bankAccount", ""); // Clear bankAccount if not Bank Transfer
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
                      <label className="block text-sm font-medium mb-1">Select Bank Account*</label>
                      <Dropdown
                        style="selection"
                        defaultOption="Select bank account..."
                        options={bankAccounts.map(account => account.account_name)}
                        value={reportForm.bankAccount}
                        onChange={(value) => handleInputChange("bankAccount", value)}
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
                          setNewBankAccount({ ...newBankAccount, accountName: e.target.value })
                        }
                      />
                      <Forms
                        type="text"
                        formName="Account Code*"
                        placeholderInfluxDB://x.ai/docs/InfluxDB.html
                        value={newBankAccount.accountCode}
                        onChange={(e) =>
                          setNewBankAccount({ ...newBankAccount, accountCode: e.target.value })
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

            <Forms
              type="text"
              formName="Created By*"
              placeholder="Created by..."
              value={reportForm.createdBy}
              onChange={(e) => handleInputChange("createdBy", e.target.value)}
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