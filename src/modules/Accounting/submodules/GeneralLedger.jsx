import React, { useState, useEffect } from "react";
import "../styles/accounting-styling.css";
import Button from "../components/Button";
import Dropdown from "../components/Dropdown";
import Table from "../components/Table";
import Search from "../components/Search";
import ReportModalInput from "../components/ReportModalInput";

const BodyContent = () => {
    const columns = ["Entry Line ID", "GL Account ID", "Account name", "Journal ID", "Debit", "Credit", "Description"];
    const [data, setData] = useState([]);
    const [searching, setSearching] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [reportForm, setReportForm] = useState({
        startDate: "",
        endDate: "",
        journalId: "",
        description: "",
        invoiceId: "",
        currencyId: ""
    });

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleInputChange = (field, value) => {
        setReportForm(prevState => ({ ...prevState, [field]: value }));
    };

    const handleSubmit = () => {
        console.log("Form submitted with data: ", reportForm);
        closeModal();
    };

    const fetchData = () => {
        fetch('http://127.0.0.1:8000/api/journal-entry-lines/')
            .then(response => response.json())
            .then(result => {
                console.log('API Response:', result); // Log the API response for debugging

                // Extract the highest numeric part of entry_line_id
                let maxEntryLineId = 0;

                result.forEach(entry => {
                    const match = (entry.entry_line_id || "").match(/(\d+)$/); // Extract numeric part
                    if (match) {
                        const numericPart = parseInt(match[1], 10);
                        if (numericPart > maxEntryLineId) {
                            maxEntryLineId = numericPart;
                        }
                    }
                });

                const transformedData = result.flatMap(entry => {
                    // Ensure GL Account ID is the same as Account Name if missing or invalid
                    const glAccountId = entry.gl_account_id || entry.account_name || '-';
                    const accountName = entry.account_name || '-';

                    const baseRow = [
                        glAccountId, // GL Account ID
                        accountName, // Account Name
                        entry.journal_id || entry.journal_entry || '-', // Journal ID
                    ];

                    const description = entry.description || '-'; // Description

                    // Increment the entry_line_id for each new row
                    const nextDebitEntryLineId = `ACC-JEL-2025-YZ${String(++maxEntryLineId).padStart(4, '0')}`;
                    const nextCreditEntryLineId = `ACC-JEL-2025-YZ${String(++maxEntryLineId).padStart(4, '0')}`;

                    const debitRow = [nextDebitEntryLineId, ...baseRow, parseFloat(entry.debit_amount || '0.00').toFixed(2), '0.00', description];
                    const creditRow = [nextCreditEntryLineId, ...baseRow, '0.00', parseFloat(entry.credit_amount || '0.00').toFixed(2), description];

                    return [
                        ...(parseFloat(entry.debit_amount || '0.00') > 0 ? [debitRow] : []),
                        ...(parseFloat(entry.credit_amount || '0.00') > 0 ? [creditRow] : [])
                    ];
                });

                console.log('Transformed Data:', transformedData); // Log the transformed data for debugging
                setData(transformedData);
            })
            .catch(error => console.error('Error fetching data:', error));
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSort = () => {
        const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
        setSortOrder(newSortOrder);

        const sortedData = [...data].sort((a, b) => {
            const debitA = parseFloat(a[4]) || 0;
            const creditA = parseFloat(a[5]) || 0;
            const debitB = parseFloat(b[4]) || 0;
            const creditB = parseFloat(b[5]) || 0;

            const totalA = debitA + creditA;
            const totalB = debitB + creditB;

            if (newSortOrder === "asc") {
                return totalA - totalB; // Sort in ascending order based on the combined debit/credit amount
            } else {
                return totalB - totalA; // Sort in descending order based on the combined debit/credit amount
            }
        });

        setData(sortedData);
    };

    const filteredData = data.filter(row =>
        [row[0], row[1], row[2], row[3], row[6]]
            .filter(Boolean)
            .join(" ")
            .toLowerCase()
            .includes(searching.toLowerCase())
    );

    const totalDebit = data.reduce((sum, row) => sum + (parseFloat(row[4]) || 0), 0);
    const totalCredit = data.reduce((sum, row) => sum + (parseFloat(row[5]) || 0), 0);

    const formatNumber = (num) => num.toLocaleString("en-US", { minimumFractionDigits: 2 });
    const formattedTotalDebit = formatNumber(totalDebit);
    const formattedTotalCredit = formatNumber(totalCredit);

    return (
        <div className="generalLedger">
            <div className="body-content-container">
                <div className="title-subtitle-container">
                    <h1 className="subModule-title">General Ledger</h1>
                </div>
                <div className="parent-component-container">
                    <div className="component-container">
                        <Dropdown options={["Ascending", "Descending"]} style="selection" defaultOption="Sort Debit Credit.." onChange={handleSort} />
                        <Search type="text" placeholder="Search Entries.." value={searching} onChange={(e) => setSearching(e.target.value)} />
                    </div>
                    <div><Button name="Generate report" variant="standard2" onclick={openModal} /></div>
                </div>

                <Table data={filteredData} columns={columns} />
                <div className="grid grid-cols-7 gap-4 mt-4 items-center border-t pt-2 
                 font-light max-sm:text-[10px] max-sm:font-light max-md:text-[10px] max-md:font-light 
                max-lg:text-[10px] max-lg:font-light max-xl:text-[10px] max-xl:font-light 2xl:text-[10px] 2xl:font-light">
                    <div className="col-span-3"></div>
                    <div className="font-bold">Total</div>
                    <div>{formattedTotalDebit}</div>
                    <div>{formattedTotalCredit}</div>
                </div>
            </div>

            <ReportModalInput
                isModalOpen={isModalOpen}
                closeModal={closeModal}
                reportForm={reportForm}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
            />
        </div>
    );
};

export default BodyContent;
