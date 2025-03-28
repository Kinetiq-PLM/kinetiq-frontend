import React from 'react';
import '../styles/Accounting-Global-Styling.css';
import Forms from '../components/Forms';
import Table from '../components/Table';

const GeneralLedgerAccounts = () => {
  const columns = ["GL Account ID", "Account name", "Account code", "Account ID", "Status", "Created at.."];

  const data = [
    ["GL-101", "Petty Cash", "1010", "ACC-101", "Active", "2024-02-18"],
    ["GL-102", "Bank Account", "1020", "ACC-102", "Active", "2024-03-01"],
    ["GL-103", "Office Equipment", "1501", "ACC-103", "Inactive", "2023-12-30"],
    ["GL-104", "Loan Payable", "2101", "ACC-104", "Active", "2024-01-22"],
    ["GL-105", "Consulting Revenue", "4201", "ACC-105", "Active", "2023-11-10"],
    ["GL-105", "Consulting Revenue", "4201", "ACC-105", "Active", "2023-11-10"],
  ];

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
