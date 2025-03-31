import React, { useState, useEffect } from 'react';
import '../styles/accounting-styling.css';
import Table from '../components/Table';
import Search from '../components/Search';
import Dropdown from '../components/Dropdown';

const GeneralLedgerAccounts = () => {
  const columns = ["GL Account ID", "Account name", "Account code", "Account ID", "Status", "Created at.."];
  const [data, setData] = useState([]);
  const [searching, setSearching] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchData = () => {
    fetch('http://127.0.0.1:8000/api/general-ledger-accounts/')
      .then(response => response.json())
      .then(result => {
        console.log('API Response (fetchData):', result);
        setData(result.map(entry => [
          entry.gl_account_id || "-",
          entry.account_name || "-",
          entry.account_code || "-",
          entry.account_id || "-",
          entry.status || "-",
          entry.created_at ? new Date(entry.created_at).toLocaleString() : "-",
        ]));
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
      return newSortOrder === "asc" ? a[5].localeCompare(b[5]) : b[5].localeCompare(a[5]);
    });
    setData(sortedData);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
  };

  const filteredData = data.filter(row => {
    const matchesSearch = [row[0], row[1], row[2], row[3], row[4]]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(searching.toLowerCase());

    const matchesStatus = statusFilter === "All" || row[4] === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="generalLedger">
      <div className="body-content-container">
        <div className="title-subtitle-container">
          <h1 className="subModule-title">General Ledger Accounts</h1>
          <h2 className="subModule-subTitle">The whole record of accounts.</h2>
        </div>

        <div className="parent-component-container">
          <div className='component-container'>
            <Dropdown options={["Ascending", "Descending"]} style="selection" defaultOption="Sort by Date.." onChange={handleSort} />
            <Dropdown options={["All", "Active", "Inactive"]} style="selection" defaultOption="Filter by Status.." onChange={handleStatusFilter} />
            <Search type="text" placeholder="Search Entries.." value={searching} onChange={(e) => setSearching(e.target.value)} />
          </div>
        </div>

        <Table data={filteredData} columns={columns} enableCheckbox={false} />
      </div>
    </div>
  );
};

export default GeneralLedgerAccounts;