import React, { useState, useEffect } from 'react';
import '../styles/JournalEntry.css';
import '../styles/accounting-styling.css';
import Button from '../components/Button';
import Forms from '../components/Forms';
import NotifModal from '../components/modalNotif/NotifModal'; // Import NotifModal
import Dropdown from '../components/Dropdown';
import AddAccountModal from '../components/AddAccountModal';

const JournalEntry = () => {
    const [journalForm, setJournalForm] = useState({
        journalId: '',
        transactions: [{ type: 'debit', glAccountId: '', amount: '' }],
        description: '',
    });
    const [totalDebit, setTotalDebit] = useState(0);
    const [totalCredit, setTotalCredit] = useState(0);
    const [journalOptions, setJournalOptions] = useState([]);
    const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

    // New state for modal notification
    const [validation, setValidation] = useState({
        isOpen: false,
        type: "warning",
        title: "",
        message: "",
    });

    const handleInputChange = (index, field, value) => {
        // Remove commas from input before storing in state
        const sanitizedValue = value.replace(/,/g, '');

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
                { type, glAccountId: '', amount: '' },
            ];
            updateTotals(updatedTransactions);
            return { ...prevState, transactions: updatedTransactions };
        });
    };

    const removeEntry = (index) => {
        setJournalForm((prevState) => {
            const updatedTransactions = prevState.transactions.filter((_, i) => i !== index);
            updateTotals(updatedTransactions);
            return { ...prevState, transactions: updatedTransactions };
        });
    };

    const updateTotals = (transactions) => {
        const debitSum = transactions
            .filter((t) => t.type === 'debit')
            .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
        const creditSum = transactions
            .filter((t) => t.type === 'credit')
            .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
        setTotalDebit(debitSum);
        setTotalCredit(creditSum);
    };

    const handleAddAccount = () => {
        console.log("handleAddAccount called");
        setIsAccountModalOpen(false); // closes the modal after submission
    };
    

    const handleSubmit = async () => {
        if (!journalForm.journalId && !journalForm.description) {
            setValidation({
                isOpen: true,
                type: "warning",
                title: "Missing Required Fields",
                message: "Please fill in all required fields: Journal ID and Description.",
            });
            return;
        }

        if (!journalForm.journalId) {
            setValidation({
                isOpen: true,
                type: "warning",
                title: "Missing Journal ID",
                message: "Please fill in Journal ID.",
            });
            return;
        }

        if (!journalForm.description) {
            setValidation({
                isOpen: true,
                type: "warning",
                title: "Missing Description",
                message: "Please fill in Description.",
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

        // Numbers comma formatted
        const payload = {
            total_debit: totalDebit.toFixed(2),
            total_credit: totalCredit.toFixed(2),
            description: journalForm.description,
            transactions: journalForm.transactions.map((t, index) => ({
                entry_line_id: `${journalForm.journalId}-${index}-${Date.now()}`,
                gl_account_id: t.glAccountId || null,
                debit_amount: t.type === 'debit' ? parseFloat(t.amount).toFixed(2) : '0.00',
                credit_amount: t.type === 'credit' ? parseFloat(t.amount).toFixed(2) : '0.00',
                description: journalForm.description || null,
            })),
        };
        console.log('Submitting payload to PATCH /journal-entries:', payload);

        // Display the Data to the Table
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/journal-entries/${journalForm.journalId}/`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to update journal: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            console.log('PATCH response:', data);

            setValidation({
                isOpen: true,
                type: "success",
                title: "Journal Entry Updated",
                message: "Journal entry updated successfully!",
            });
            setJournalForm({
                journalId: '',
                transactions: [{ type: 'debit', glAccountId: '', amount: '' }],
                description: '',
            });
            setTotalDebit(0);
            setTotalCredit(0);
        } catch (error) {
            console.error('Error submitting data:', error);
            setValidation({
                isOpen: true,
                type: "error",
                title: "Error Updating Journal Entry",
                message: error.message,
            });
        }
    };

    // Checking if the journal ID is already in use
    useEffect(() => {
        const fetchJournalIDs = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/journal-entries/');
                const result = await response.json();
                const zeroBalanceJournals = result
                    .filter(entry => parseFloat(entry.total_debit) === 0 && parseFloat(entry.total_credit) === 0)
                    .map(entry => entry.journal_id || entry.id);
                setJournalOptions(zeroBalanceJournals);
            } catch (error) {
                console.error('Error fetching journal IDs:', error);
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


                        {/* Top Buttons */}
                        <div className="flex gap-x-5 w-auto">

                            <div className="flex flex-col">
                                <label htmlFor="journalId">Journal ID*</label>
                                <Dropdown
                                    options={journalOptions}
                                    style="selection"
                                    defaultOption="Select Journal ID"
                                    value={journalForm.journalId}
                                    onChange={(value) => setJournalForm({ ...journalForm, journalId: value })}
                                />
                            </div>

                            <Forms
                                type="text"
                                formName="Description*"
                                placeholder="Enter Description"
                                value={journalForm.description}
                                onChange={(e) => setJournalForm({ ...journalForm, description: e.target.value })}
                            />
                        </div>

                        {/* Add Debit and Credit Buttons */}
                        <div className="component-container">
                            <Button name="+ Add debit" variant="standard2" onclick={() => addEntry('debit')} />
                            <Button name="+ Add credit" variant="standard2" onclick={() => addEntry('credit')} />
                        </div>
                    </div>

                    <div className="component-container">
                        <Button name="Save" variant="standard1" onclick={handleSubmit} />
                        <Button
                            name="Cancel"
                            variant="standard2"
                            onclick={() =>
                                setJournalForm({
                                    journalId: '',
                                    transactions: [{ type: 'debit', glAccountId: '', amount: '' }],
                                    description: '',
                                })
                            }
                        />
                    </div>
                </div>


                {/* Debit and Credit table  */}
                <div className="journal-table">
                    <div className="table-header">
                        <div className="column account-column">Accounts Affected</div>
                        <div className="column debit-column">Debit Input</div>
                        <div className="column credit-column">Credit Input</div>
                    </div>

                    {journalForm.transactions.map((entry, index) => (
                        <div key={index} className={`table-row ${entry.type === 'credit' ? 'credit-row' : ''}`}>
                            <div
                                className={`column account-column ${entry.type === 'credit' ? 'ml-6' : ''}`}>
                                <Button
                                    name={entry.type === 'credit' ? 'Select Account' : 'Select Account'}
                                    variant="standard2"
                                    onclick={() => {
                                        console.log('Opening Account Modal');
                                        setIsAccountModalOpen(true);
                                    }}
                                />

                            </div>

                            <div className="column debit-column">
                                {entry.type === 'debit' && (
                                    <Forms
                                        type="number" // Keep it text to allow formatted display
                                        placeholder="Enter Debit"
                                        value={entry.amount ? Number(entry.amount).toLocaleString() : ''}
                                        onChange={(e) => handleInputChange(index, 'amount', e.target.value)}
                                    />
                                )}
                            </div>

                            <div className="column credit-column">
                                {entry.type === 'credit' && (
                                    <Forms
                                        type="number" // Keep it text to allow formatted display
                                        placeholder="Enter Credit"
                                        value={entry.amount ? Number(entry.amount).toLocaleString() : ''}
                                        onChange={(e) => handleInputChange(index, 'amount', e.target.value)}
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
                    <div className="column debit-column">{totalDebit.toLocaleString("en-US", { minimumFractionDigits: 2 })}</div>
                    <div className="column credit-column">{totalCredit.toLocaleString("en-US", { minimumFractionDigits: 2 })}</div>
                </div>

                {/* Add NotifModal for feedback */}
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
                        isModalOpen={isAccountModalOpen} // ✅ match the expected prop name
                        closeModal={() => setIsAccountModalOpen(false)}
                        reportForm={{}} // dummy placeholder
                        handleInputChange={() => { }}
                        handleSubmit={handleAddAccount} // ❌ This function is never defined in your component!
                    />

                )}

            </div>
        </div>
    );
};

export default JournalEntry;