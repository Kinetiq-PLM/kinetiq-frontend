import JournalModalInput from "../components/journalModal/JournalModalInput";
import NotifModal from "../components/modalNotif/NotifModal";
import Dropdown from "../components/dropdown/Dropdown";
import React, { useState, useEffect } from "react";
import Button from "../components/button/Button";
import Search from "../components/search/Search";
import Table from "../components/table/Table";
import "../styles/accounting-styling.css";
import axios from "axios";

const Journal = () => {
  // Function: Set the date for the Journal Entry form
  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };



  // UseStates 
  const columns = ["Journal Id", "Journal Date", "Description", "Debit", "Credit", "Invoice Id", "Currency Id",];
  const [latestJournalId, setLatestJournalId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState("asc");
  const [currencies, setCurrencies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searching, setSearching] = useState("");
  const [sortBy, setSortBy] = useState("Debit");
  const [invoices, setInvoices] = useState([]);
  const [data, setData] = useState([]);
  const [journalForm, setJournalForm] = useState({
    journalDate: getCurrentDate(),
    description: "",
    currencyId: "",
    invoiceId: "",
  });
  const [validation, setValidation] = useState({
    isOpen: false,
    type: "warning",
    title: "",
    message: "",
  });



  // API Endpoints
  const API_URL =
    import.meta.env.VITE_API_URL ||
    "https://vyr3yqctq8.execute-api.ap-southeast-1.amazonaws.com/dev";
  const JOURNAL_ENTRIES_ENDPOINT = `${API_URL}/api/journal-entries/`;
  const INVOICES_ENDPOINT = `${API_URL}/api/invoices/`;
  const CURRENCIES_ENDPOINT = `${API_URL}/api/currencies/`;



  // Function: Open and Close the Modal
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);



  // Function: Fetching data from the API for the journal
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const response = await axios.get(JOURNAL_ENTRIES_ENDPOINT, config);
      const sortedResult = response.data.sort(
        (a, b) =>
          new Date(b.journal_date || b.date) -
          new Date(a.journal_date || a.date)
      );
      setData(
        sortedResult.map((entry) => [
          entry.journal_id || entry.id || "-",
          entry.journal_date || entry.date || "-",
          entry.description || "-",
          entry.total_debit || 0,
          entry.total_credit || 0,
          entry.invoice_id || "-",
          entry.currency_id || "-",
        ])
      );
      if (sortedResult.length > 0) {
        const latest = sortedResult[0];
        setLatestJournalId(latest.journal_id || "ACC-JOE-2025-A00000");
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching journal data:", error);
      setValidation({
        isOpen: true,
        type: "error",
        title: "Journal Fetch Failed",
        message: "Failed to load journal entries. Please check your connection.",
      });
      setIsLoading(false);
    }
  };



  // Function: Fetching currencies from the admin and invoices from the API
  const fetchCurrencies = async () => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const response = await axios.get(CURRENCIES_ENDPOINT, config);
      const activeCurrencies = response.data.filter((c) => c.is_active);
      setCurrencies(activeCurrencies);
    } catch (error) {
      console.error("Error fetching currencies:", error);
      setValidation({
        isOpen: true,
        type: "error",
        title: "Currency Fetch Failed",
        message: "Could not load currency list. Please check your connection.",
      });
    }
  };



  // ReactHook: Calls both the data for the journal and currency 
  useEffect(() => {
    fetchData();
    fetchCurrencies();
  }, []);



  // Generate currency options for the dropdown
  const currencyOptions = currencies.map((c) => c.currency_name);



  // Generate invoice options for the dropdown
  const generateNextJournalId = () => {
    if (!latestJournalId) return "ACC-JOE-2025-A00001";
    const matches = latestJournalId.match(/ACC-JOE-2025-([A-Z0-9]+)$/);
    if (matches && matches[1]) {
      const lastIncrement = matches[1];
      const nextIncrement = incrementAlphaNumeric(lastIncrement);
      return `ACC-JOE-2025-${nextIncrement}`;
    }
    return "ACC-JOE-2025-A00001";
  };



  // Increment the alphanumeric string
  const incrementAlphaNumeric = (str) => {
    if (!/^[A-Z0-9]+$/.test(str)) {
      throw new Error("Invalid alphanumeric string");
    }
    const chars = str.split("");
    for (let i = chars.length - 1; i >= 0; i--) {
      if (chars[i] === "Z") {
        chars[i] = "A";
      } else if (chars[i] === "9") {
        chars[i] = "0";
      } else {
        chars[i] = String.fromCharCode(chars[i].charCodeAt(0) + 1);
        break;
      }
    }
    return chars.join("");
  };



  // Function: Updates inputs from the modal
  const handleInputChange = (field, value) => {
    setJournalForm((prevState) => ({ ...prevState, [field]: value }));
  };


  // Handle form submission
  const handleSubmit = async () => {
    // User validations
    if (!journalForm.journalDate && !journalForm.description && !journalForm.currencyId && !journalForm.invoiceId) {
      setValidation({
        isOpen: true,
        type: "warning",
        title: "Missing Required Fields",
        message: "Please fill in all required fields, including Invoice ID.",
      });
      return;
    }

    if(!journalForm.description) {
      setValidation({
        isOpen: true,
        type: "warning",
        title: "Missing Description",
        message: "Please Enter a Description"
      })
      return;
    }

    if(!journalForm.invoiceId) {
      setValidation({
        isOpen: true,
        type: "warning",
        title: "Missing Invoice Id",
        message: "Please Enter a Invoice Id"
      })
      return;
    }

    if(!journalForm.currencyId) {
      setValidation({
        isOpen: true,
        type: "warning",
        title: "Missing Currency ID",
        message: "Please Enter a Currency ID"
      })
      return;
    }



    // Currency ID is now set to the selected currency's ID
    const nextJournalId = generateNextJournalId();
    const selectedCurrency = currencies.find(
      (c) => c.currency_name === journalForm.currencyId
    );



    // Prepare the payload for the API request
    const payload = {
      journal_id: nextJournalId,
      journal_date: journalForm.journalDate,
      description: journalForm.description,
      total_debit: "0.00",
      total_credit: "0.00",
      invoice_id: journalForm.invoiceId,
      currency_id: selectedCurrency?.currency_id || "",
    };


    // Check if the invoice ID is valid
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const response = await axios.post(JOURNAL_ENTRIES_ENDPOINT, payload, config);
      if (response.status === 201) {
        fetchData();
        setJournalForm({
          journalDate: getCurrentDate(),
          description: "",
          currencyId: "",
          invoiceId: "",
        });
        closeModal();
        setValidation({
          isOpen: true,
          type: "success",
          title: "Journal Added",
          message: "Journal added successfully!",
        });
      } else {
        setValidation({
          isOpen: true,
          type: "error",
          title: "Server Error",
          message: "Failed to create journal.",
        });
      }
    } catch (error) {
      console.error("Error submitting journal:", error);
      setValidation({
        isOpen: true,
        type: "error",
        title: "Submission Failed",
        message: error.response?.data?.detail || "Failed to connect to the API.",
      });
    }
  };



  // Handle sorting of the table data
  const handleSort = (value) => {
    let sortedData = [];
  
    if (value === "Default") {

      // Sort by Journal ID (alphanumeric sorting)
      sortedData = [...data].sort((a, b) => {
        const idA = a[columns.indexOf("Journal Id")] || "";
        const idB = b[columns.indexOf("Journal Id")] || "";
        return idA.localeCompare(idB, undefined, { numeric: true, sensitivity: 'base' });
      });
      setSortBy("Journal Id");


    } else {

      // Sort by Debit or Credit based on the selected value
      const criteria = "Debit"; 
      const newSortOrder = value === "Ascending" ? "asc" : "desc";
      setSortOrder(newSortOrder);
      setSortBy(criteria);
      sortedData = [...data].sort((a, b) => {
        const valueA = parseFloat(a[columns.indexOf(criteria)]) || 0;
        const valueB = parseFloat(b[columns.indexOf(criteria)]) || 0;
        return newSortOrder === "asc" ? valueA - valueB : valueB - valueA;
      });
    }
  
    setData(sortedData);
  };
  


  // Handle search input change
  const filteredData = data.filter((row) =>
    [row[0], row[1], row[2], row[5], row[6]]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(searching.trim().toLowerCase())
  );



  // Loading spinner component
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center p-8 mt-30">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      <p className="ml-4 text-gray-600">Loading journal data...</p>
    </div>
  );


  return (
    <div className="Journal">
      <div className="body-content-container">


        {/* Title Container */}
        <div className="title-subtitle-container">
          <h1 className="subModule-title">Journal</h1>
        </div>


        {/* Searching, sorting, and button */}
        <div className="parent-component-container">

          <div className="component-container">
            <Dropdown
              options={["Default","Ascending", "Descending"]}
              style="selection"
              defaultOption="Sort By debit and credit.."
              onChange={(value) => handleSort(value)}
            />
            <Search
              type="text"
              placeholder="Search.. "
              value={searching}
              onChange={(e) => setSearching(e.target.value)}
            />
          </div>


          <div className="component-container">
            <Button
              name="Create Journal ID"
              variant="standard2"
              onclick={openModal}
            />
          </div>
        </div>


        {/* Table Component */}
        {isLoading ? (<LoadingSpinner />) : (<Table data={filteredData} columns={columns} enableCheckbox={false} />)}
      </div>


      {/* Modal for Journal Entry Form */}
      <JournalModalInput
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        journalForm={journalForm}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        currencyOptions={currencyOptions}
      />


      {/* Modal for Notifications */}
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