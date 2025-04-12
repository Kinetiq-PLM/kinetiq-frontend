import React, { useState, useEffect } from 'react';
import "../styles/accounting-styling.css";
import Table from "../components/Table";
import Search from "../components/Search";
import Button from "../components/Button";
import CreateReceiptModal from "../components/CreateReceiptModal";

const OfficialReceipts = () => {
  const columns = ["OR ID", "Invoice ID", "Customer ID", "OR Date", "Settled Amount", "Remaining Amount", "Payment Method", "Reference #", "Created By"];
  const [data, setData] = useState([]);
  const [searching, setSearching] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  }
  const closeModal = () => {
    setModalOpen(false);
  }


  const fetchData = () => {
    fetch('http://127.0.0.1:8000/api/official-receipts/')
      .then(response => response.json())
      .then(result => {
        console.log('API Response (fetchData):', result);

        if (result.length > 0) {
          console.log('Keys in first entry:', Object.keys(result[0]));
          console.log('First entry full object:', result[0]);
        } else {
          console.log('No data returned from API - Did JournalEntry save?');
        }

        setData(result.map(entry => {
          const row = [
            entry.or_id || "-", // OR ID
            entry.invoice_id || "-", // Invoice ID
            entry.customer_id || "-", // Customer ID
            entry.or_date ? new Date(entry.or_date).toLocaleString() : "-", // OR Date
            entry.settled_amount || "-", // Settled Amount
            entry.remaining_amount || "-", // Remaining Amount
            entry.payment_method || "-", // Payment Method
            entry.reference_number || "-", // Reference #
            entry.created_by || "-" // Created By
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

  // Filter based on OR ID (first column)
  const filteredData = data.filter(row =>
    [row[0], row[1], row[2], row[6], row[7], row[8]]
      .filter(Boolean) // Remove null/undefined values
      .join(" ")
      .toLowerCase()
      .includes(searching.toLowerCase())
  );


  return (
    <div className="chartAccounts">
      <div className="body-content-container">

        <div className="title-subtitle-container">
          <h1 className="subModule-title">Official Receipts</h1>
        </div>

        <div className="parent-component-container">
          <Search type="text" placeholder="Search Record.." value={searching} onChange={(e) => setSearching(e.target.value)} />
          <div><Button name="Create Receipt" variant="standard2" onclick={openModal} /></div>
        </div>

        <Table data={filteredData} columns={columns} enableCheckbox={false} />

      </div>

      {modalOpen && (
        <CreateReceiptModal isModalOpen={modalOpen} closeModal={closeModal} />)}

    </div>
  )
}

export default OfficialReceipts