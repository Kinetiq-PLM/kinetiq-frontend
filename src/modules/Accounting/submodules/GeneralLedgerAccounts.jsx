import React, { useState, useEffect } from 'react';
import '../styles/accounting-styling.css';
import Forms from '../components/Forms';
import Table from '../components/Table';

const GeneralLedgerAccounts = () => {
  const columns = ["GL Account ID", "Account name", "Account code", "Account ID", "Status", "Created at.."];
  const [data, setData] = useState([]);

  const fetchData = () => {
    fetch('http://127.0.0.1:8000/api/general-ledger-accounts/')
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
            entry.gl_account_id || "-",
            entry.account_name || "-",
            entry.account_code || "-",
            entry.account_id || "-", // Can be null, handled safely
            entry.status || "-",
            entry.created_at ? new Date(entry.created_at).toLocaleString() : "-",
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

  return (
    <div className="generalLedger">
      <div className="body-content-container">

        <div className="title-subtitle-container">
          <h1 className="subModule-title">General Ledger Accounts</h1>
          <h2 className="subModule-subTitle">The whole record of accounts.</h2>
        </div>

        <div className="parent-component-container">
          <Forms type="text" placeholder="Search account..." />
        </div>

        <Table data={data} columns={columns} enableCheckbox={false} />

      </div>
    </div>
  );
};

export default GeneralLedgerAccounts;
