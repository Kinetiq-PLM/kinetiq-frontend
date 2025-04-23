import "../styles/accounting-styling.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "../components/Button";
import Dropdown from "../components/Dropdown";
import Table from "../components/Table";
import JournalModalInput from "../components/JournalModalInput";
import NotifModal from "../components/modalNotif/NotifModal";
import Search from "../components/Search";

const Journal = () => {
  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const columns = [
    "Journal Id",
    "Journal Date",
    "Description",
    "Debit",
    "Credit",
    "Invoice Id",
    "Currency Id",
  ];
  const [latestJournalId, setLatestJournalId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState("asc");
  const [currencies, setCurrencies] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [searching, setSearching] = useState("");
  const [sortBy, setSortBy] = useState("Debit");
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

  const API_URL =
    import.meta.env.VITE_API_URL ||
    "https://vyr3yqctq8.execute-api.ap-southeast-1.amazonaws.com/dev";
  const JOURNAL_ENTRIES_ENDPOINT = `${API_URL}/api/journal-entries/`;
  const INVOICES_ENDPOINT = `${API_URL}/api/invoices/`;
  const CURRENCIES_ENDPOINT = `${API_URL}/api/currencies/`;

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const fetchData = async () => {
    try {
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
    } catch (error) {
      console.error("Error fetching journal data:", error);
      setValidation({
        isOpen: true,
        type: "error",
        title: "Journal Fetch Failed",
        message: "Failed to load journal entries. Please check your connection or API configuration.",
      });
    }
  };

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
        message: "Could not load currency list. Please check your connection or API configuration.",
      });
    }
  };

  const fetchInvoices = async () => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      // Use require_receipt=false to include invoices without receipts
      const response = await axios.get(`${INVOICES_ENDPOINT}?for_journal=true&require_receipt=false`, config);
      setInvoices(response.data);
      if (response.data.length === 0) {
        // REVISED: Improved validation message
        setValidation({
          isOpen: true,
          type: "warning",
          title: "No Invoices Available",
          message: "No invoices with a remaining balance found. All invoices may be fully paid or returned.",
        });
      }
    } catch (error) {
      console.error("Error fetching invoices:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      let message = "Could not load invoice list. Please ensure the API is accessible.";
      if (error.response?.status === 404) {
        message = "Invoice endpoint not found. Verify the API configuration.";
      } else if (error.response?.status === 403) {
        message = "Access denied. Please check your authentication credentials.";
      } else if (error.code === "ERR_NETWORK") {
        message = "Network error. Please ensure the API is running.";
      } else if (error.response?.status === 504) {
        message = "Gateway timeout. Check the backend response time.";
      }
      setValidation({
        isOpen: true,
        type: "error",
        title: "Invoice Fetch Failed",
        message: error.response?.data?.detail || message,
      });
    }
  };

  useEffect(() => {
    fetchData();
    fetchCurrencies();
    fetchInvoices();
  }, []);

  const currencyOptions = currencies.map((c) => c.currency_name);

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

  const handleInputChange = (field, value) => {
    setJournalForm((prevState) => ({ ...prevState, [field]: value }));
  };

  const handleSubmit = async () => {
    if (
      !journalForm.journalDate ||
      !journalForm.description ||
      !journalForm.currencyId ||
      !journalForm.invoiceId
    ) {
      setValidation({
        isOpen: true,
        type: "warning",
        title: "Missing Required Fields",
        message: "Please fill in all required fields, including Invoice ID.",
      });
      return;
    }

    const nextJournalId = generateNextJournalId();
    const selectedCurrency = currencies.find(
      (c) => c.currency_name === journalForm.currencyId
    );

    const payload = {
      journal_id: nextJournalId,
      journal_date: journalForm.journalDate,
      description: journalForm.description,
      total_debit: "0.00",
      total_credit: "0.00",
      invoice_id: journalForm.invoiceId,
      currency_id: selectedCurrency?.currency_id || "",
    };

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
      const criteria = "Debit"; // Still fixed on Debit for Asc/Desc
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
  
  

  const filteredData = data.filter((row) =>
    [row[0], row[1], row[2], row[5], row[6]]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(searching.toLowerCase())
  );

  return (
    <div className="Journal">
      <div className="body-content-container">
        <div className="title-subtitle-container">
          <h1 className="subModule-title">Journal</h1>
        </div>
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
              name="Create Journal Entry"
              variant="standard2"
              onclick={openModal}
            />
          </div>
        </div>
        <Table data={filteredData} columns={columns} enableCheckbox={false} />
      </div>
      <JournalModalInput
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        journalForm={journalForm}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        currencyOptions={currencyOptions}
      />
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