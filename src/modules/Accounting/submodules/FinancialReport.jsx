import React, { useState, useEffect } from "react";
import "../styles/accounting-styling.css";
import Table from "../components/Table";
import Search from "../components/Search";

const FinancialReport = () => {
  const [data, setData] = useState([]);
  const [searching, setSearching] = useState("");

  const columns = [
    "Entry Line ID",
    "GL Account ID",
    "Account Name",
    "Journal ID",
    "Debit",
    "Credit",
    "Description",
  ];

  // Placeholder data
  useEffect(() => {
    const sampleData = [
      {
        entryLineId: "EL-1001",
        glAccountId: "GL-3001",
        accountName: "Cash",
        journalId: "J-001",
        debit: 1000,
        credit: 0,
        description: "Initial deposit",
      },
      {
        entryLineId: "EL-1002",
        glAccountId: "GL-4001",
        accountName: "Revenue",
        journalId: "J-002",
        debit: 0,
        credit: 500,
        description: "Product sale",
      },
    ];

    // Convert objects to arrays matching column order
    const rowData = sampleData.map((row) => [
      row.entryLineId,
      row.glAccountId,
      row.accountName,
      row.journalId,
      row.debit,
      row.credit,
      row.description,
    ]);

    setData(rowData);
  }, []);

  // Calculate totals from original structure
  const totalDebit = data.reduce((sum, row) => sum + (row[4] || 0), 0); // debit is index 4
  const totalCredit = data.reduce((sum, row) => sum + (row[5] || 0), 0); // credit is index 5
  const formattedTotalDebit = totalDebit.toLocaleString();
  const formattedTotalCredit = totalCredit.toLocaleString();

  return (
    <div className="FinancialReport">
      <div className="body-content-container">
        <div className="title-subtitle-container">
          <h1 className="subModule-title">Financial Report</h1>
        </div>
        <div className="parent-component-container">
          <Search
            type="text"
            placeholder="Search by Entry ID, Account, Journal ID..."
            value={searching}
            onChange={(e) => setSearching(e.target.value)}
          />
        </div>

        <Table data={data} columns={columns} enableCheckbox={false} />

        <div className="grid grid-cols-7 gap-4 mt-4 items-center border-t pt-2 font-light text-sm">
          <div className="col-span-3"></div>
          <div className="font-bold">Total</div>
          <div>{formattedTotalDebit}</div>
          <div>{formattedTotalCredit}</div>
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default FinancialReport;
