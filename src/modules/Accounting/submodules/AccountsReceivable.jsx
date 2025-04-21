import React, { useState, useEffect } from "react";
import "../styles/accounting-styling.css";
import Table from "../components/Table";
import Search from "../components/Search";

const AccountsReceivable = () => {
  // Use states
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


  // Fetch data
  const fetchData = () => {
    fetch("http://127.0.0.1:8000/api/general-ledger-jel-view/")
      .then((response) => response.json())
      .then((result) => {
        console.log("API Response:", result);
        const combinedData = result
          .filter(
            (entry) =>
              (entry.account_name === "Accounts Receivable" ||
                entry.account_name === "Sales Revenue") &&
              (entry.debit_amount != 0 || entry.credit_amount != 0)
          )
          .map((entry) => [
            entry.entry_line_id,
            entry.gl_account_id || "N/A", // 1: GL Account ID
            entry.account_name || "No Account", // 2: Account Name
            entry.journal_id || "-", // 3: Journal ID
            parseFloat(entry.debit_amount || "0.00").toFixed(2), // 4: Debit
            parseFloat(entry.credit_amount || "0.00").toFixed(2), // 5: Credit
            entry.description || "-", // 6: Description
          ]);
        console.log("Combined AR and Sales Data:", combinedData);
        setData(combinedData);
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  useEffect(() => {
    fetchData();
  }, []);


  // Calculates the total debit and credit
  const totalDebit = data.reduce((sum, row) => sum + (parseFloat(row[4]) || 0), 0); // Fixed to Debit (index 4)
  const totalCredit = data.reduce((sum, row) => sum + (parseFloat(row[5]) || 0), 0); // Fixed to Credit (index 5)
  

  // Search Filter based on columns
  const filteredData = data.filter((row) =>
    [row[0], row[1], row[2], row[3], row[6]] 
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(searching.toLowerCase())
  );


  // Format the total with comma
  const formatNumber = (num) =>
    num.toLocaleString("en-US", { minimumFractionDigits: 2 });
  const formattedTotalDebit = formatNumber(totalDebit);
  const formattedTotalCredit = formatNumber(totalCredit);

  return (
    <div className="accountsReceivable">
      <div className="body-content-container">
        <div className="title-subtitle-container">
          <h1 className="subModule-title">Accounts Receivable</h1>
        </div>
        <div className="parent-component-container">
          <Search
            type="text"
            placeholder="Search Record..."
            value={searching}
            onChange={(e) => setSearching(e.target.value)}
          />
        </div>
        <Table data={filteredData} columns={columns} enableCheckbox={false} />
        <div className="grid grid-cols-7 gap-4 mt-4 items-center border-t pt-2 font-light max-sm:text-[10px] max-sm:font-light max-md:text-[10px] max-md:font-light max-lg:text-[10px] max-lg:font-light max-xl:text-[10px] max-xl:font-light 2xl:text-[10px] 2xl:font-light">
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

export default AccountsReceivable;