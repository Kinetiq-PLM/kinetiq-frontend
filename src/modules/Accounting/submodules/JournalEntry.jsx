import AddAccountModal from "../components/journalEntryModal/AddAccountModal";
import NotifModal from "../components/modalNotif/NotifModal";
import Dropdown from "../components/dropdown/Dropdown";
import React, { useState, useEffect } from "react";
import Button from "../components/button/Button";
import Forms from "../components/forms/Forms";
import "../styles/accounting-styling.css";
import "../styles/JournalEntry.css";
import axios from "axios";

const JournalEntry = () => {
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isLoadingPayroll, setIsLoadingPayroll] = useState(false);
  const [journalOptions, setJournalOptions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [totalCredit, setTotalCredit] = useState(0);
  const [totalDebit, setTotalDebit] = useState(0);
  const [journalForm, setJournalForm] = useState({
    journalId: "",
    transactions: [
      { type: "debit", glAccountId: "", amount: "", accountName: "" },
    ],
    description: "",
  });
  const [validation, setValidation] = useState({
    isOpen: false,
    type: "warning",
    title: "",
    message: "",
  });


  
  // API endpoints
  const API_URL =
    import.meta.env.VITE_API_URL || "https://vyr3yqctq8.execute-api.ap-southeast-1.amazonaws.com/dev";
  const JOURNAL_ENTRIES_ENDPOINT = `${API_URL}/api/journal-entries/`;
  const PAYROLL_ENDPOINT = `${API_URL}/api/payrolls/`;

  const handleInputChange = (index, field, value) => {
    // Allow numbers, a single decimal point, and a leading '-' for negative values
    const sanitizedValue = value.replace(/[^0-9.-]/g, "").replace(/(?!^)-/g, ""); // Ensures '-' is only at the start
    setJournalForm((prevState) => {
      const updatedTransactions = prevState.transactions.map((entry, i) =>
        i === index ? { ...entry, [field]: sanitizedValue } : entry
      );
      updateTotals(updatedTransactions);
      return { ...prevState, transactions: updatedTransactions };
    });
  };

  const addEntry = (type) => {
    setJournalForm((prevState) => {
      const updatedTransactions = [
        ...prevState.transactions,
        { type, glAccountId: "", amount: "", accountName: "" },
      ];
      updateTotals(updatedTransactions);
      return { ...prevState, transactions: updatedTransactions };
    });
  };

  const removeEntry = (index) => {
    setJournalForm((prevState) => {
      const updatedTransactions = prevState.transactions.filter(
        (_, i) => i !== index
      );
      updateTotals(updatedTransactions);
      return { ...prevState, transactions: updatedTransactions };
    });
  };

  const updateTotals = (transactions) => {
    const debitSum = transactions
      .filter((t) => t.type === "debit")
      .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
    const creditSum = transactions
      .filter((t) => t.type === "credit")
      .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
    setTotalDebit(debitSum);
    setTotalCredit(creditSum);
  };

  const handleAddAccount = async (accountData) => {
    setJournalForm((prevState) => {
      if (selectedIndex === null) return prevState;
  
      const updatedTransactions = prevState.transactions.map((entry, i) =>
        i === selectedIndex
          ? {
              ...entry,
              glAccountId: accountData.glAccountId,
              accountName: accountData.accountName,
              accountCode: accountData.accountCode,
              amount: "", // Initialize amount as empty
            }
          : entry
      );
  
      const isTargetDebit =
        accountData.glAccountId === "ACC-GLA-2025-ed2da5" && // Match the specific GL Account ID
        prevState.transactions[selectedIndex].type === "debit";
  
      if (isTargetDebit) {
        const creditEntries = [
          { accountName: "SSS Contribution", glAccountId: "ACC-GLA-2025-d7b748", field: "sss_contribution" },
          { accountName: "Philhealth Contribution", glAccountId: "ACC-GLA-2025-4d5181", field: "philhealth_contribution" },
          { accountName: "Pagibig Contribution", glAccountId: "ACC-GLA-2025-63f1b1", field: "pagibig_contribution" },
          { accountName: "Tax", glAccountId: "ACC-GLA-2025-d761c0", field: "tax" },
          { accountName: "Late Deduction", glAccountId: "ACC-GLA-2025-63550f", field: "late_deduction" },
          { accountName: "Absent Deduction", glAccountId: "ACC-GLA-2025-92225f", field: "absent_deduction" },
          { accountName: "Undertime Deduction", glAccountId: "ACC-GLA-2025-1a67b8", field: "undertime_deduction" },
          { accountName: "Net Pay (test)", glAccountId: "ACC-GLA-2025-253367", field: "net_pay" },
        ];
  
        // Add credit entries with empty amounts
        creditEntries.forEach((credit) => {
          updatedTransactions.push({
            type: "credit",
            glAccountId: credit.glAccountId,
            accountName: credit.accountName,
            amount: "",
            field: credit.field,
          });
        });
  
        // Fetch payroll data for the selected GL Account ID
        fetchPayrollDataForGLAccount(updatedTransactions, selectedIndex, accountData.glAccountId);
      }
  
      updateTotals(updatedTransactions);
      console.log("Updated transactions:", updatedTransactions);
      return { ...prevState, transactions: updatedTransactions };
    });
  
    setIsAccountModalOpen(false);
    setSelectedIndex(null);
  };
  
  const fetchPayrollDataForGLAccount = async (transactions, debitIndex, glAccountId) => {
    setIsLoadingPayroll(true);
    try {
      // Fetch the mapping of GL Account IDs to Account IDs
      const accountResponse = await axios.get(`${API_URL}/api/general-ledger-accounts/`);
      const accountData = accountResponse.data.find(
        (account) => account.gl_account_id === glAccountId
      );
  
      if (!accountData) {
        setValidation({
          isOpen: true,
          type: "info",
          title: "No Relevant Account",
          message: `No account found for GL Account ID: ${glAccountId}. Please check the account setup.`,
        });
        setIsLoadingPayroll(false);
        return;
      }
  
      const accountId = accountData.account_id; // Get the corresponding account_id (employee_id)
  
      // Fetch the payroll data using the account_id
      const payrollResponse = await axios.get(PAYROLL_ENDPOINT);
      const payrollData = payrollResponse.data.find(
        (payroll) =>
          payroll.employee_id === accountId && // To Match the employee_id
          payroll.status === "Processing" // To ensure the payroll status is "Processing"
      );
  
      if (!payrollData) {
        setValidation({
          isOpen: true,
          type: "info",
          title: "No Relevant Payroll",
          message: `No payroll record found for Account ID: ${accountId} with status 'Processing'. Please enter amounts manually.`,
        });
        setIsLoadingPayroll(false);
        // Reset all amounts to empty for manual entry
        setJournalForm((prevState) => ({
          ...prevState,
          transactions: transactions.map((t) => ({ ...t, amount: "" })),
        }));
        return;
      }
  
      // Populate amounts for the selected Payroll ID
      setJournalForm((prevState) => {
        const updatedTransactions = transactions
          .map((entry, i) => {
            if (i === debitIndex) {
              return {
                ...entry,
                amount: parseFloat(payrollData.gross_pay).toFixed(2),
              };
            }
            if (entry.type === "credit" && entry.field) {
              const amount = parseFloat(payrollData[entry.field] || 0).toFixed(2);
              return { ...entry, amount: amount !== "0.00" ? amount : "" };
            }
            return entry;
          })
          .filter((entry) => entry.type === "debit" || (entry.type === "credit" && entry.amount));
  
        updateTotals(updatedTransactions);
  
        return {
          ...prevState,
          transactions: updatedTransactions,
        };
      });
    } catch (error) {
      console.error("Error fetching payroll data:", error.response ? error.response.data : error);
      setValidation({
        isOpen: true,
        type: "error",
        title: "Fetch Error",
        message: "Failed to load payroll data. Please check your connection or enter amounts manually.",
      });
      setJournalForm((prevState) => ({
        ...prevState,
        transactions: transactions.map((t) => ({ ...t, amount: "" })),
      }));
    } finally {
      setIsLoadingPayroll(false);
    }
  };
  

  const handleSubmit = async () => {
    if (!journalForm.journalId || !journalForm.description) {
      setValidation({
        isOpen: true,
        type: "warning",
        title: "Missing Required Fields",
        message: "Please fill in all required fields: Journal ID and Description.",
      });
      return;
    }
  
    const invalidTransactions = journalForm.transactions.some(
      (t) =>
        !t.glAccountId || // GL Account ID must be present
        !t.accountName || // Account Name must be present
        isNaN(parseFloat(t.amount)) // Amount must be a valid number (positive or negative)
    );
  
    if (invalidTransactions) {
      setValidation({
        isOpen: true,
        type: "warning",
        title: "Missing Account Details",
        message: "All transactions must have a GL Account ID, Account Name, and a valid amount.",
      });
      return;
    }
  
    if (journalForm.transactions.length < 2) {
      setValidation({
        isOpen: true,
        type: "warning",
        title: "Insufficient Transactions",
        message: "A journal entry requires at least one debit and one credit transaction.",
      });
      return;
    }
  
    if (totalDebit !== totalCredit || totalDebit === 0) {
      setValidation({
        isOpen: true,
        type: "warning",
        title: "Unbalanced Entry",
        message: "Total Debit must equal Total Credit and cannot be zero.",
      });
      return;
    }
  
    const currentYear = new Date().getFullYear();
    const baseIdentifier = "YZ2020";
  
    const payload = {
      total_debit: totalDebit.toFixed(2),
      total_credit: totalCredit.toFixed(2),
      description: journalForm.description,
      transactions: journalForm.transactions.map((t, index) => ({
        entry_line_id: `ACC-JEL-${currentYear}-${baseIdentifier}-${index}`,
        gl_account_id: t.glAccountId,
        debit_amount: t.type === "debit" ? parseFloat(t.amount).toFixed(2) : "0.00",
        credit_amount: t.type === "credit" ? parseFloat(t.amount).toFixed(2) : "0.00",
        description: journalForm.description || null,
      })),
    };
  
    try {
      const response = await axios.patch(
        `${JOURNAL_ENTRIES_ENDPOINT}${journalForm.journalId}/`,
        payload
      );
  
      if (response.status === 200 || response.status === 201) {
        setValidation({
          isOpen: true,
          type: "success",
          title: "Journal Entry Updated",
          message: "Journal entry updated successfully!",
        });
        setJournalForm({
          journalId: "",
          transactions: [{ type: "debit", glAccountId: "", amount: "", accountName: "" }],
          description: "",
        });
        setTotalDebit(0);
        setTotalCredit(0);
      } else {
        throw new Error("Unexpected response status");
      }
    } catch (error) {
      console.error("Error updating journal entry:", error.response ? error.response.data : error);
      setValidation({
        isOpen: true,
        type: "error",
        title: "Check Connection!",
        message: error.response?.data?.detail || "Failed to connect to the server.",
      });
    }
  };
  

  useEffect(() => {
    const fetchJournalIDs = async () => {
      try {
        const response = await axios.get(JOURNAL_ENTRIES_ENDPOINT);
        const zeroBalanceJournals = response.data
          .filter((entry) => parseFloat(entry.total_debit) === 0 && parseFloat(entry.total_credit) === 0)
          .map((entry) => entry.journal_id || entry.id);
        setJournalOptions(zeroBalanceJournals);
      } catch (error) {
        console.error("Error fetching journal IDs:", error.response ? error.response.data : error);
        setValidation({
          isOpen: true,
          type: "error",
          title: "Fetch Error",
          message: "Failed to load journal IDs. Please check your connection.",
        });
      }
    };
    fetchJournalIDs();
  }, []);

  return (
    <div className="JournalEntry">
      <div className="body-content-container">
        <div className="title-subtitle-container">
          <h1 className="subModule-title">Journal Entry</h1>
        </div>

        <div className="parent-component-container">
          <div className="flex justify-between gap-x-5">
            <div className="flex items-end gap-x-5 w-auto">
              <div className="flex flex-col">
                <label htmlFor="journalId">Journal ID*</label>
                <Dropdown
                  options={journalOptions}
                  style="selection"
                  defaultOption="Select Journal ID"
                  value={journalForm.journalId}
                  onChange={(value) =>
                    setJournalForm({ ...journalForm, journalId: value })
                  }
                />
              </div>
              <Forms
                type="text"
                formName="Description*"
                placeholder="Enter Description"
                value={journalForm.description}
                onChange={(e) =>
                  setJournalForm({
                    ...journalForm,
                    description: e.target.value,
                  })
                }
              />
            </div>

            <div className="component-container">
              <Button
                name="+ Add debit"
                variant="standard2"
                onclick={() => addEntry("debit")}
              />
              <Button
                name="+ Add credit"
                variant="standard2"
                onclick={() => addEntry("credit")}
              />
            </div>
          </div>

          <div className="component-container">
            <Button name="Save" variant="standard1" onclick={handleSubmit} />
            <Button
              name="Cancel"
              variant="standard2"
              onclick={() =>
                setJournalForm({
                  journalId: "",
                  transactions: [
                    {
                      type: "debit",
                      glAccountId: "",
                      amount: "",
                      accountName: "",
                    },
                  ],
                  description: "",
                })
              }
            />
          </div>
        </div>

        {isLoadingPayroll && <div>Loading payroll data...</div>}

        <div className="journal-table">
          <div className="table-header">
            <div className="column account-column">Accounts Affected</div>
            <div className="column debit-column">Debit Input</div>
            <div className="column credit-column">Credit Input</div>
          </div>

          {journalForm.transactions.map((entry, index) => (
            <div
              key={index}
              className={`table-row ${
                entry.type === "credit" ? "credit-row" : ""
              }`}
            >
              <div
                className={`column account-column ${
                  entry.type === "credit" ? "ml-6" : ""
                }`}
              >
                <Button
                  name={
                    entry.glAccountId ? entry.accountName : "Select Account"
                  }
                  variant="standard2"
                  onclick={() => {
                    setSelectedIndex(index);
                    setIsAccountModalOpen(true);
                  }}
                />
              </div>

              <div className="column debit-column">
                {entry.type === "debit" && (
                  <Forms
                    type="text"
                    inputMode="decimal"
                    placeholder="Enter Debit"
                    value={entry.amount}
                    onChange={(e) =>
                      handleInputChange(index, "amount", e.target.value)
                    }
                    step="any"
                  />
                )}
              </div>

              <div className="column credit-column">
                {entry.type === "credit" && (
                  <Forms
                    type="text"
                    inputMode="decimal"
                    placeholder="Enter Credit"
                    value={entry.amount}
                    onChange={(e) =>
                      handleInputChange(index, "amount", e.target.value)
                    }
                    step="any"
                  />
                )}
              </div>

              <button className="remove-btn" onClick={() => removeEntry(index)}>
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="totals-row">
          <div className="column account-column">Totals</div>
          <div className="column debit-column">
            {totalDebit.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </div>
          <div className="column credit-column">
            {totalCredit.toLocaleString("en-US", { minimumFractionDigits: 2 })}
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

        {isAccountModalOpen && (
          <AddAccountModal
            isModalOpen={isAccountModalOpen}
            closeModal={() => setIsAccountModalOpen(false)}
            handleSubmit={handleAddAccount}
          />
        )}
      </div>
    </div>
  );
};

export default JournalEntry;