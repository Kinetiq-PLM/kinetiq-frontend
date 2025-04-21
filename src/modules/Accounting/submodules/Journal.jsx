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
    return today.toISOString().split("T")[0]; // returns 'YYYY-MM-DD'
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
  const [isLoading, setIsLoading] = useState(true);
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

  // API endpoint
  const API_URL =
    import.meta.env.VITE_API_URL ||
    "https://vyr3yqctq8.execute-api.ap-southeast-1.amazonaws.com/dev";
  const JOURNAL_ENTRIES_ENDPOINT = `${API_URL}/api/journal-entries/`;

  // Open modal function
  const openModal = () => setIsModalOpen(true);

  // Close modal function
  const closeModal = () => setIsModalOpen(false);

  // Fetch data from the API - Sort by: journal_date descending
  const fetchData = () => {
    setIsLoading(true); // Set loading to true when fetching starts
    axios
      .get(JOURNAL_ENTRIES_ENDPOINT)
      .then((response) => {
        console.log("API Response (fetchData):", response.data);

        // Sort result by journal_date descending (latest first)
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

        // Get the latest journal ID (first after sorting)
        if (sortedResult.length > 0) {
          const latest = sortedResult[0];
          setLatestJournalId(latest.journal_id || "ACC-JOE-2025-A00000");
        }
        setIsLoading(false); // Set loading to false when fetching is done
      })
      .catch((error) => {
        console.error(
          "Error fetching data:",
          error.response ? error.response.data : error
        );
        setValidation({
          isOpen: true,
          type: "error",
          title: "Fetch Error",
          message:
            "Failed to load journal entries. Please check your connection.",
        });
        setIsLoading(false); // Set loading to false when fetching is done
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchCurrencies = () => {
    axios
      .get(`${API_URL}/api/currencies/`)
      .then((res) => {
        const activeCurrencies = res.data.filter((c) => c.is_active);
        setCurrencies(activeCurrencies);
      })
      .catch((err) => {
        console.error("Error fetching currencies:", err);
        setValidation({
          isOpen: true,
          type: "error",
          title: "Currency Fetch Failed",
          message: "Could not load currency list. Please try again.",
        });
      });
  };

  useEffect(() => {
    fetchData();
    fetchCurrencies(); // 👈 AWS API call
  }, []);

  const currencyOptions = currencies.map((c) => c.currency_name);

  // Generate the next Journal ID
  const generateNextJournalId = () => {
    if (!latestJournalId) return "ACC-JOE-2025-A00001"; // Default for the first journal ID

    // Extract the alphanumeric part (e.g., "A1B2C3")
    const matches = latestJournalId.match(/ACC-JOE-2025-([A-Z0-9]+)$/);
    if (matches && matches[1]) {
      const lastIncrement = matches[1];
      const nextIncrement = incrementAlphaNumeric(lastIncrement);
      return `ACC-JOE-2025-${nextIncrement}`;
    }

    return "ACC-JOE-2025-A00001"; // Fallback default
  };

  // Increment an alphanumeric string (e.g., "A1B2C3" -> "A1B2C4")
  const incrementAlphaNumeric = (str) => {
    // Validate input (only allow alphanumeric characters)
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

  // Update the journal form state when an input field changes
  const handleInputChange = (field, value) => {
    setJournalForm((prevState) => ({ ...prevState, [field]: value }));
  };

  // Handle submit with user validations
  const handleSubmit = async () => {
    if (
      !journalForm.journalDate ||
      !journalForm.description ||
      !journalForm.invoiceId ||
      !journalForm.currencyId
    ) {
      setValidation({
        isOpen: true,
        type: "warning",
        title: "Missing Required Fields",
        message: "Please fill in all required fields.",
      });
      return;
    }

    // Generate the next journal ID automatically
    const nextJournalId = generateNextJournalId();

    // Generate the next Journal ID
    const selectedCurrency = currencies.find(
      (c) => c.currency_name === journalForm.currencyId
    );

    const payload = {
      journal_id: nextJournalId,
      journal_date: journalForm.journalDate,
      description: journalForm.description,
      total_debit: "0.00",
      total_credit: "0.00",
      invoice_id: journalForm.invoiceId || null,
      currency_id: selectedCurrency?.currency_id || "", // send actual ID
    };

    console.log("Submitting payload:", payload);

    try {
      const response = await axios.post(JOURNAL_ENTRIES_ENDPOINT, payload);

      if (response.status === 201) {
        fetchData();
        setJournalForm({
          journalDate: "",
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
      console.error(
        "Error submitting data:",
        error.response ? error.response.data : error
      );
      setValidation({
        isOpen: true,
        type: "error",
        title: "Check Connection!",
        message:
          error.response?.data?.detail || "Failed to connect to the server.",
      });
    }
  };

  // Handle sorting (applies to both Debit and Credit columns)
  const handleSort = (criteria) => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);
    setSortBy(criteria);

    const sortedData = [...data].sort((a, b) => {
      const valueA = parseFloat(a[columns.indexOf(criteria)]) || 0;
      const valueB = parseFloat(b[columns.indexOf(criteria)]) || 0;

      if (newSortOrder === "asc") {
        return valueA - valueB;
      } else {
        return valueB - valueA;
      }
    });

    setData(sortedData);
  };

  // Search filtering
  const filteredData = data.filter((row) =>
    [row[0], row[1], row[2], row[5], row[6]]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(searching.toLowerCase())
  );

  // Loading spinner component
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center p-8 mt-30">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      <p className="ml-4 text-gray-600">Loading accounts payable data...</p>
    </div>
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
              options={["Debit", "Credit"]}
              style="selection"
              defaultOption="Sort By.."
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
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <Table data={filteredData} columns={columns} enableCheckbox={false} />
        )}
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
