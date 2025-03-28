import React, { useState, useEffect } from 'react';
import '../styles/accounting-styling.css';
import { sortingChoices } from './ListOfAccounts';
import Button from '../components/Button';
import Dropdown from '../components/Dropdown';
import Table from '../components/Table';
import SearchBar from "../../../shared/components/SearchBar";
import JournalModalInput from '../components/JournalModalInput';

const Journal = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [journalForm, setJournalForm] = useState({
        journalId: '',
        journalDate: '',
        description: '',
        currencyId: '',
        invoiceId: ''
    });
    const columns = ["Journal Id", "Journal Date", "Description", "Debit", "Credit", "Invoice Id", "Currency Id"];
    const [data, setData] = useState([]);

    // Reusable function to format API data
    const formatData = (result) => result.map(entry => [
        entry.journal_id || entry.id || '-',
        entry.journal_date || entry.date || '-',
        entry.description || '-',
        entry.total_debit === 0 ? '-' : entry.total_debit, // Display '-' if 0.00
        entry.total_credit === 0 ? '-' : entry.total_credit, // Display '-' if 0.00
        entry.invoice_id || '-',
        entry.currency_id || '-'
    ]);

    // Reusable function to fetch data
    const fetchData = () => {
        fetch('http://127.0.0.1:8000/api/journal-entries/')
            .then(response => response.json())
            .then(result => {
                console.log('API Response (fetchData):', result);
                setData(formatData(result));
            })
            .catch(error => console.error('Error fetching data:', error));
    };

    useEffect(() => {
        fetchData();
    }, []);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleInputChange = (field, value) => {
        setJournalForm(prevState => ({ ...prevState, [field]: value }));
    };

    const handleSubmit = () => {
        // Validation: Ensure all required fields are filled
        if (!journalForm.journalDate || !journalForm.description || !journalForm.currencyId) {
            alert("Please fill in all required fields.");
            return;
        }

        // Prepare the new entry for optimistic update
        const newEntry = {
            journal_id: journalForm.journalId, // Use the user-entered Journal ID
            journal_date: journalForm.journalDate,
            description: journalForm.description,
            total_debit: '0.00', // Still send 0.00 to API
            total_credit: '0.00', // Still send 0.00 to API
            invoice_id: journalForm.invoiceId || null, // Keep it a string or null
            currency_id: journalForm.currencyId // Keep it a string
        };

        // Optimistically update the table (display '-' instead of 0.00)
        setData(prevData => [...prevData, [
            newEntry.journal_id || '-',
            newEntry.journal_date || '-',
            newEntry.description || '-',
            newEntry.total_debit === 0 ? '-' : newEntry.total_debit, // Display '-' if 0.00
            newEntry.total_credit === 0 ? '-' : newEntry.total_credit, // Display '-' if 0.00
            newEntry.invoice_id || '-',
            newEntry.currency_id || '-'
        ]]);

        // Log the payload for debugging
        const payload = {
            journal_id: journalForm.journalId, // Include the user-entered Journal ID
            journal_date: journalForm.journalDate,
            description: journalForm.description,
            total_debit: "0.00", // Required field, must send 0.00 to API
            total_credit: "0.00", // Required field, must send 0.00 to API
            invoice_id: journalForm.invoiceId || null, // Keep it a string or null
            currency_id: journalForm.currencyId // Keep it a string
        };
        console.log('Submitting payload:', payload);

        fetch('http://127.0.0.1:8000/api/journal-entries/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(response => {
                console.log('Response status:', response.status);
                console.log('Response headers:', response.headers);
                return response.json().then(data => ({ ok: response.ok, status: response.status, data }));
            })
            .then(({ ok, status, data }) => {
                if (ok) {
                    alert("Journal entry created successfully!");
                    fetchData(); // Sync with server
                    setJournalForm({ journalId: '', journalDate: '', description: '', currencyId: '', invoiceId: '' });
                    closeModal();
                } else {
                    console.error('Server error response:', data);
                    throw new Error(data.detail || JSON.stringify(data) || `Failed to create journal entry (Status: ${status})`);
                }
            })
            .catch(error => {
                console.error('Error submitting data:', error.message);
                alert(`Error: ${error.message}`);
                // Rollback optimistic update on error
                setData(prevData => prevData.filter(row => row[0] !== newEntry.journal_id));
            });
    };

    return (
        <div className='Journal'>
            <div className='body-content-container'>
                <div className="title-subtitle-container">
                    <h1 className="subModule-title">Journal</h1>
                    <h2 className="subModule-subTitle">A record that groups transactions under a unique journal ID for accounting purposes.</h2>
                </div>

                <div className="parent-component-container">

                    <div className="component-container">
                        <Dropdown options={sortingChoices} style="selection" defaultOption="Sort ID.." />
                        <SearchBar />
                    </div>

                    <div className='component-container'>
                        <Button name="Create Journal ID" variant="standard2" onclick={openModal} />
                    </div>

                </div>

                <Table data={data} columns={columns} />
            </div>

            <JournalModalInput
                isModalOpen={isModalOpen}
                closeModal={closeModal}
                journalForm={journalForm}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
            />

        </div>
    );
};

export default Journal;
