import React, { useState, useEffect } from "react";
import "../styles/accounting-styling.css";
import Dropdown from "../components/Dropdown";
import Table from "../components/Table";
import Search from "../components/Search";

const BodyContent = () => {

    const columns = ["Entry Line ID", "GL Account ID", "Account name", "Journal ID", "Debit", "Credit", "Description"];
    const [data, setData] = useState([]);
    const [searching, setSearching] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");

    const fetchData = () => {
        fetch('http://127.0.0.1:8000/api/journal-entry-lines/')
            .then(response => response.json())
            .then(result => {
                console.log('API Response (fetchData):', result);
                if (result.length > 0) {
                    console.log('Keys in first entry:', Object.keys(result[0]));
                    console.log('First entry full object:', result[0]);
                    console.log('GL Account ID value:', result[0].gl_account_id);
                } else {
                    console.log('No data returned from API - Did JournalEntry save?');
                }
                setData(result.map(entry => {
                    const row = [
                        entry.entry_line_id || entry.id || '-',           // "Entry Line ID"
                        entry.gl_account_id || '-',                        // "GL Account ID"
                        entry.account_name || '-',                         // "Account name"
                        entry.journal_id || entry.journal_entry || '-',    // "Journal ID"
                        entry.debit_amount || '0.00',                      // "Debit"
                        entry.credit_amount || '0.00',                     // "Credit"
                        entry.description || '-'                           // "Description"
                    ];
                    console.log('Mapped row:', row);
                    return row;
                }));
            })
            .catch(error => console.error('Error fetching data:', error));
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Function to handle sorting (applies to both debit and credit columns)
    const handleSort = () => {
        const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
        setSortOrder(newSortOrder);

        const sortedData = [...data].sort((a, b) => {
            const debitA = parseFloat(a[4]) || 0;
            const debitB = parseFloat(b[4]) || 0;
            const creditA = parseFloat(a[5]) || 0;
            const creditB = parseFloat(b[5]) || 0;

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
        [row[0], row[1], row[2], row[3], row[6]]
            .filter(Boolean) // Remove null/undefined values
            .join(" ")
            .toLowerCase()
            .includes(searching.toLowerCase())
    );

    return (
        <div className="generalLedger">
            <div className="body-content-container">


                <div className="title-subtitle-container">
                    <h1 className="subModule-title">General Ledger</h1>
                    <h2 className="subModule-subTitle">The whole record of transactions.</h2>
                </div>


                <div className="parent-component-container">

                    <div className="component-container">
                        <Dropdown options={["Ascending", "Descending"]} style="selection" defaultOption="Sort Debit Credit.." onChange={handleSort} />
                        <Search type="text" placeholder="Search Entries.. " value={searching} onChange={(e) => setSearching(e.target.value)} />
                    </div>
                </div>

                <Table data={filteredData} columns={columns} />
            </div>
        </div>
    );
};

export default BodyContent;