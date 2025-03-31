import React, { useState, useEffect } from 'react';
import '../styles/accounting-styling.css';
import Button from '../components/Button';
import Dropdown from '../components/Dropdown';
import Table from '../components/Table';
import JournalModalInput from '../components/JournalModalInput';
import NotifModal from '../components/modalNotif/NotifModal';
import Search from '../components/Search';

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
    const [searching, setSearching] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");


    const formatData = (result) => result.map(entry => [
        entry.journal_id || entry.id || '-',
        entry.journal_date || entry.date || '-',
        entry.description || '-',
        entry.total_debit || 0, // Keep as numeric
        entry.total_credit || 0, // Keep as numeric
        entry.invoice_id || '-',
        entry.currency_id || '-'
    ]);

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

    const [validation, setValidation] = useState({
        isOpen: false,
        type: "warning",
        title: "",
        message: "",
    });

    const handleSubmit = () => {
        if (!journalForm.journalDate && !journalForm.journalId && !journalForm.description && !journalForm.invoiceId && !journalForm.currencyId) {
            setValidation({
                isOpen: true,
                type: "warning",
                title: "Missing Required Fields",
                message: "Please fill in all required fields.",
            });
            return;
        }

        if(!journalForm.journalDate) {
            setValidation({
                isOpen: true,
                type: "warning",
                title: "Missing Journal Date",
                message: "Please set the journal date.",
            });
            return;
        }

        if(!journalForm.journalId) {
            setValidation({
                isOpen: true,
                type: "warning",
                title: "Missing Journal ID",
                message: "Please fill in journal ID.",
            });
            return;
        }

        if(!journalForm.description) {
            setValidation({
                isOpen: true,
                type: "warning",
                title: "Missing Description",
                message: "Please fill in description.",
            });
            return;
        }

        if(!journalForm.invoiceId) {
            setValidation({
                isOpen: true,
                type: "warning",
                title: "Missing Invoice ID",
                message: "Please fill in invoice ID.",
            });
            return;
        }

        if(!journalForm.currencyId) {
            setValidation({
                isOpen: true,
                type: "warning",
                title: "Missing Currency ID",
                message: "Please fill in currency ID.",
            });
            return;
        }

        const payload = {
            journal_id: journalForm.journalId,
            journal_date: journalForm.journalDate,
            description: journalForm.description,
            total_debit: "0.00",
            total_credit: "0.00",
            invoice_id: journalForm.invoiceId || null,
            currency_id: journalForm.currencyId
        };
        console.log('Submitting payload:', payload);

        fetch('http://127.0.0.1:8000/api/journal-entries/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(response => response.json().then(data => ({ ok: response.ok, data })))
            .then(({ ok, data }) => {
                if (ok) {
                    fetchData();
                    setJournalForm({ journalId: '', journalDate: '', description: '', currencyId: '', invoiceId: '' });
                    closeModal();
                    setValidation({
                        isOpen: true,
                        type: "success",
                        title: "Journal ID Added",
                        message: "Journal ID added successfully!",
                    });
                } else {
                    throw new Error(data.detail || 'Failed to create journal');
                }
            })
            .catch(error => {
                console.error('Error submitting data:', error);
                setValidation({
                    isOpen: true,
                    type: "error",
                    title: "Error Adding Journal",
                    message: "Check you database connection.",
                });
            });
    };

    // Function to handle sorting (applies to both debit and credit columns)
    const handleSort = () => {
        const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
        setSortOrder(newSortOrder);

        const sortedData = [...data].sort((a, b) => {
            const debitA = parseFloat(a[3]) || 0;
            const debitB = parseFloat(b[3]) || 0;
            const creditA = parseFloat(a[4]) || 0;
            const creditB = parseFloat(b[4]) || 0;

            const sortByDebit = debitA - debitB;
            const sortByCredit = creditA - creditB;

            if (newSortOrder === "asc") {
                return sortByDebit !== 0 ? sortByDebit : sortByCredit;
            } else {
                return sortByDebit !== 0 ? -sortByDebit : -sortByCredit;
            }
        });

        setData(sortedData);
    };

    const filteredData = data.filter(row =>
        [row[0], row[1], row[2], row[5], row[6]]
            .filter(Boolean) 
            .join(" ")
            .toLowerCase()
            .includes(searching.toLowerCase())
    );

    return (
        <div className='Journal'>
            <div className='body-content-container'>
                <div className="title-subtitle-container">
                    <h1 className="subModule-title">Journal</h1>
                    <h2 className="subModule-subTitle">A record that groups transactions under a unique journal ID for accounting purposes.</h2>
                </div>

                <div className="parent-component-container">
                    <div className="component-container">
                        <Dropdown options={["Ascending", "Descending"]} style="selection" defaultOption="Sort Debit Credit.." onChange={handleSort} />
                        <Search type="text" placeholder="Search.. " value={searching} onChange={(e) => setSearching(e.target.value)} />
                    </div>

                    <div className='component-container'>
                        <Button name="Create Journal ID" variant="standard2" onclick={openModal} />
                    </div>
                </div>

                <Table data={filteredData} columns={columns} enableCheckbox={false} />
            </div>

            <JournalModalInput
                isModalOpen={isModalOpen}
                closeModal={closeModal}
                journalForm={journalForm}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
            />

            {validation.isOpen && (
                <NotifModal
                    isOpen={validation.isOpen}
                    onClose={() => setValidation({ ...validation, isOpen: false })}
                    type={validation.type}
                    title={validation.title}
                    message={validation.message}
                />
            )}
        </div>
    );
};

export default Journal;