import React, { useState, useEffect } from 'react';
import "../styles/accounting-styling.css";
import Table from "../components/Table";
import Search from "../components/Search";
import Button from "../components/Button";
import CreateReceiptModal from "../components/CreateReceiptModal";
import NotifModal from "../components/modalNotif/NotifModal";

const OfficialReceipts = () => {
  // Use states
  const columns = ["OR ID", "Invoice ID", "Customer ID", "OR Date", "Settled Amount", "Remaining Amount", "Payment Method", "Reference #", "Created By"];
  const [data, setData] = useState([]);
  const [searching, setSearching] = useState("");
  const [modalOpen, setModalOpen] = useState(false);


  // Open modal function
  const openModal = () => setModalOpen(true);


  // Close modal function
  const closeModal = () => {
    setModalOpen(false);
    setReportForm({
      startDate: "",
      salesInvoiceId: "",
      amountPaid: "",
      createdBy: "",
    });
  };


  // State to store form data
  const [reportForm, setReportForm] = useState({
    startDate: "",
    salesInvoiceId: "",
    amountPaid: "",
    createdBy: ""
  });


  // State for validation and notifications
  const [validation, setValidation] = useState({
    isOpen: false,
    type: "warning",
    title: "",
    message: "",
  });

  
  // Fetch data from the backend
  const fetchData = () => {
    fetch('http://127.0.0.1:8000/api/official-receipts/')
      .then(response => response.json())
      .then(result => {
        setData(result.map(entry => [
          entry.or_id || "-", 
          entry.invoice_id || "-", 
          entry.customer_id || "-", 
          entry.or_date ? new Date(entry.or_date).toLocaleString() : "-", 
          entry.settled_amount || "-", 
          entry.remaining_amount || "-", 
          entry.payment_method || "-", 
          entry.reference_number || "-", 
          entry.created_by || "-"
        ]));
      })
      .catch(error => console.error('Error fetching data:', error));
  };

  useEffect(() => {
    fetchData();
  }, []);


  // Fetch the latest reference number and increment it
  const fetchLatestReferenceNumber = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/official-receipts/');
      const receipts = await response.json();
      if (receipts.length > 0) {
        const lastReceipt = receipts[receipts.length - 1]; // Get the last receipt
        const lastRef = lastReceipt.reference_number; // e.g., "REF-1021"

        // Validate the reference number format
        if (lastRef && lastRef.includes('-')) {
          const parts = lastRef.split('-');
          const numericPart = parseInt(parts[1], 10); // Parse the numeric part
          if (!isNaN(numericPart)) {
            const newRefNumber = numericPart + 1; // Increment by 1
            return `REF-${newRefNumber}`;
          }
        }
      }
      return "REF-0001"; // Default if no valid reference number exists
    } catch (error) {
      console.error("Error fetching latest reference number:", error);
      return "REF-0001"; // Fallback value
    }
  };


  // Generate custom OR ID
  const generateCustomORID = () => {
    const prefix = "ACC-OFR"; // Static prefix
    const year = new Date().getFullYear(); // Current year
    const randomString = Math.random().toString(36).substring(2, 7).toUpperCase(); // Random 5-character string
    return `${prefix}-${year}-${randomString}`;
  };


  // Handle input changes in the modal
  const handleInputChange = (field, value) => {
    setReportForm((prevForm) => ({
      ...prevForm,
      [field]: value
    }));
  };


  // Handle form submission
  const handleSubmit = async () => {
    if (!reportForm.startDate || !reportForm.salesInvoiceId || !reportForm.amountPaid || !reportForm.createdBy) {
      setValidation({
        isOpen: true,
        type: "warning",
        title: "All Fields Required",
        message: "Please fill in all the fields before submitting.",
      });
      return;
    }


    const referenceNumber = await fetchLatestReferenceNumber(); // Fetch and increment reference number


    const newReceipt = {
      or_id: generateCustomORID(), // Use the custom OR ID generator
      invoice_id: reportForm.salesInvoiceId,
      customer_id: "SALES-CUST-2025", // Default customer ID
      or_date: reportForm.startDate,
      settled_amount: reportForm.amountPaid,
      remaining_amount: "0.00", // Default remaining amount
      payment_method: "Cash", // Default payment method
      reference_number: referenceNumber, // Use the incremented reference number
      created_by: reportForm.createdBy,
    };

    console.log("Submitting receipt:", newReceipt); // Log the data being sent

    try {
      const response = await fetch('http://127.0.0.1:8000/api/official-receipts/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReceipt),
      });

      console.log("Response status:", response.status); // Log the response status

      if (response.ok) {
        const createdReceipt = await response.json();
        console.log("Created receipt:", createdReceipt); // Log the created receipt
        fetchData(); // Refresh the table data
        closeModal(); // Close the modal
        setValidation({
          isOpen: true,
          type: "success",
          title: "Receipt Created",
          message: "The receipt has been successfully created.",
        });
      } else {
        const errorData = await response.json();
        console.error("Error response from server:", errorData); // Log the error response
        setValidation({
          isOpen: true,
          type: "error",
          title: "Failed to Create Receipt",
          message: errorData.detail || "An error occurred while creating the receipt. Please try again.",
        });
      }
    } catch (error) {
      console.error('Error creating receipt:', error);
      setValidation({
        isOpen: true,
        type: "error",
        title: "Connection Error",
        message: "Unable to connect to the server. Please check your connection.",
      });
    }
  };


  // Filter the data based on the search input
  const filteredData = data.filter(row =>
    [row[0], row[1], row[2], row[6], row[7], row[8]]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(searching.toLowerCase())
  );

  
  return (
    <div className="officialReceipts">
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
        <CreateReceiptModal
          isModalOpen={modalOpen}
          closeModal={closeModal}
          reportForm={reportForm}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
        />
      )}
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

export default OfficialReceipts;