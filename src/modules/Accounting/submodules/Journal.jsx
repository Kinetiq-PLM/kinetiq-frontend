import React, { useState, useEffect } from 'react';
import '../styles/accounting-styling.css';
import Button from '../components/Button';
import Dropdown from '../components/Dropdown';
import Table from '../components/Table';
import JournalModalInput from '../components/JournalModalInput';
import NotifModal from '../components/modalNotif/NotifModal';
import Search from '../components/Search';

const Journal = () => {
    const columns = ["Journal Id", "Journal Date", "Description", "Debit", "Credit", "Invoice Id", "Currency Id"];
    const [latestJournalId, setLatestJournalId] = useState(""); 
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sortOrder, setSortOrder] = useState("asc");
    const [searching, setSearching] = useState("");
    const [sortBy, setSortBy] = useState("Debit");
    const [data, setData] = useState([]);
    const [journalForm, setJournalForm] = useState({
        journalDate: '',
        description: '',
        currencyId: '',
        invoiceId: ''
    });
    const [validation, setValidation] = useState({
        isOpen: false,
        type: "warning",
        title: "",
        message: "",
    });


    // Open modal function
    const openModal = () => setIsModalOpen(true);


    // Close modal function
    const closeModal = () => setIsModalOpen(false);


    // Fetch data from the API - Sort by: journal_date descending 
    const fetchData = () => {
        fetch('http://127.0.0.1:8000/api/journal-entries/')
            .then(response => response.json())
            .then(result => {
                console.log('API Response (fetchData):', result);
    
                // Sort result by journal_date descending (latest first)
                const sortedResult = result.sort((a, b) => new Date(b.journal_date || b.date) - new Date(a.journal_date || a.date));
    
                setData(sortedResult.map(entry => [
                    entry.journal_id || entry.id || '-',
                    entry.journal_date || entry.date || '-',
                    entry.description || '-',
                    entry.total_debit || 0,
                    entry.total_credit || 0,
                    entry.invoice_id || '-',
                    entry.currency_id || '-'
                ]));
    
                // Get the latest journal ID (first after sorting)
                if (sortedResult.length > 0) {
                    const latest = sortedResult[0];
                    setLatestJournalId(latest.journal_id || "ACC-JOE-2025-A00000");
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setValidation({
                    isOpen: true,
                    type: "error",
                    title: "Error Fetching Data",
                    message: "Unable to fetch journal entries. Please try again later.",
                });
            });
    };
    

    useEffect(() => {
        fetchData();
    }, []);


    // Generate the next Journal ID
    const generateNextJournalId = () => {
        if (!latestJournalId) return "ACC-JOE-2025-A00001"; // Default for the first journal ID

        // Extract the alphanumeric part (e.g., "A1B2C3")
        const matches = latestJournalId.match(/ACC-JOE-2025-([A-Z0-9]+)$/);
        if (matches && matches[1]) {
            const lastIncrement = matches[1];
            const nextIncrement = incrementAlphaNumeric(lastIncrement);
            return `ACC-JOE-2025-${nextIncrement}`;
        }

        return "ACC-JOE-2025-A00001"; // Fallback default
    };


    // Increment an alphanumeric string (e.g., "A1B2C3" -> "A1B2C4")
    const incrementAlphaNumeric = (str) => {
        // Validate input (only allow alphanumeric characters)
        if (!/^[A-Z0-9]+$/.test(str)) {
            throw new Error("Invalid alphanumeric string");
        }

        const chars = str.split('');
        for (let i = chars.length - 1; i >= 0; i--) {
            if (chars[i] === 'Z') {
                chars[i] = 'A';
            } else if (chars[i] === '9') {
                chars[i] = '0';
            } else {
                chars[i] = String.fromCharCode(chars[i].charCodeAt(0) + 1);
                break;
            }
        }
        return chars.join('');
    };


    // Update the journal form state when an input field changes
    const handleInputChange = (field, value) => {
        setJournalForm(prevState => ({ ...prevState, [field]: value }));
    };


    // Handle submit with user validations
    const handleSubmit = () => {
        if (!journalForm.journalDate || !journalForm.description || !journalForm.invoiceId || !journalForm.currencyId) {
            setValidation({
                isOpen: true,
                type: "warning",
                title: "Missing Required Fields",
                message: "Please fill in all required fields.",
            });
            return;
        }

        // Generate the next journal ID automatically
        const nextJournalId = generateNextJournalId();

        const payload = {
            journal_id: nextJournalId, // Auto-generate the journal ID
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
                    setJournalForm({ journalDate: '', description: '', currencyId: '', invoiceId: '' });
                    closeModal();
                    setValidation({
                        isOpen: true,
                        type: "success",
                        title: "Journal Added",
                        message: "Journal added successfully!",
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
                    message: "Check your database connection.",
                });
            });
    };


    // Handle sorting (applies to both Debit and Credit columns)
    const handleSort = (criteria) => {
        const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
        setSortOrder(newSortOrder);
        setSortBy(criteria);

        const sortedData = [...data].sort((a, b) => {
            const valueA = parseFloat(a[columns.indexOf(criteria)]) || 0; // Sort by selected criteria
            const valueB = parseFloat(b[columns.indexOf(criteria)]) || 0;

            if (newSortOrder === "asc") {
                return valueA - valueB;
            } else {
                return valueB - valueA;
            }
        });

        setData(sortedData);
    };

    
    // Search filtering
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
                </div>

                <div className="parent-component-container">
                    <div className="component-container">
                        <Dropdown
                            options={["Debit", "Credit"]}
                            style="selection"
                            defaultOption="Sort By.."
                            onChange={(e) => handleSort(e.target.value)} // Pass sorting criteria
                        />
                        <Search
                            type="text"
                            placeholder="Search.. "
                            value={searching}
                            onChange={(e) => setSearching(e.target.value)}
                        />
                    </div>

                    <div className='component-container'>
                        <Button name="Create Journal Entry" variant="standard2" onclick={openModal} />
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