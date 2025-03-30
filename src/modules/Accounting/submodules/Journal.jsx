import React, { useState, useEffect } from 'react';
import '../styles/accounting-styling.css';
import { sortingChoices } from './ListOfAccounts';
import Button from '../components/Button';
import Dropdown from '../components/Dropdown';
import Table from '../components/Table';
import SearchBar from "../../../shared/components/SearchBar";
import JournalModalInput from '../components/JournalModalInput';
import NotifModal from '../components/modalNotif/NotifModal';

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

    const [validation, setValidation] = useState ({
        isOpen: false,
        type: "warning",
        title: "",
        message: "",
    });

    const handleSubmit = () => {
        // Validation: Ensure all required fields are filled
        if (!journalForm.journalDate && !journalForm.journalId && !journalForm.description && !journalForm.invoiceId && !journalForm.currencyId) {
            setValidation({
                isOpen: true,
                type: "warning",
                title: "All Fields are Required.",
                message: "Fill up all the forms.",
            });
            return;
        }

        if (!journalForm.journalDate) {
            setValidation({
                isOpen: true,
                type: "warning",
                title: "Missing Journal Date",
                message: "Please enter the journal date.",
            });
            return;
        }

        if (!journalForm.journalId) {
            setValidation({
                isOpen: true,
                type: "warning",
                title: "Missing Journal ID",
                message: "Please provide a valid journal ID.",
            });
            return;
        }

        if (!journalForm.description) {
            setValidation({
                isOpen: true,
                type: "warning",
                title: "Missing Description",
                message: "Please enter a description for the journal entry.",
            });
            return;
        }

        if (!journalForm.invoiceId) {
            setValidation({
                isOpen: true,
                type: "warning",
                title: "Missing Invoice ID",
                message: "Please link the journal entry to an invoice ID.",
            });
            return;
        }

        if (!journalForm.currencyId) {
            setValidation({
                isOpen: true,
                type: "warning",
                title: "Missing Currency",
                message: "Please select a currency for the journal entry.",
            });
            return;
        }

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
                    fetchData(); // Sync with server
                    setJournalForm({ journalId: '', journalDate: '', description: '', currencyId: '', invoiceId: '' });
                    closeModal();
                    setValidation({
                        isOpen: true,
                        type: "success",
                        title: "Journal ID Added",
                        message: "Journal ID added successfully!",
                    });
                } else {
                    console.error('Server error response:', data);
                    setValidation({
                        isOpen: true,
                        type: "error",
                        title: "Server Error: Adding Account failed",
                        message: "Creating account failed",
                    });
                }
            })
            .catch(error => {
                console.error('Error submitting data:', error.message);
                setValidation({
                    isOpen: true,
                    type: "error",
                    title: "Check Connection!",
                    message: "Kindly check your connection to the database.",
                });
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

            {validation && (
                <NotifModal 
                    isOpen={validation.isOpen}
                    onClose={ () => {setValidation({ ...validation, isOpen: false })}}
                    type={validation.type}
                    title={validation.title}
                    message={validation.message}
                />
            )}

        </div>
    );
};

export default Journal;
