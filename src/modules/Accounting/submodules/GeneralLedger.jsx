import React, { useState, useEffect } from "react";
import "../styles/accounting-styling.css";
import Dropdown from "../components/dropdown/Dropdown";
import Table from "../components/table/Table";
import Search from "../components/search/Search";
import NotifModal from "../components/modalNotif/NotifModal";
import ReportModalInput from "../components/ReportModalInput";
import axios from "axios";

const BodyContent = () => {

  // Columns for the table
  const columns = [
    "Entry Line ID",
    "GL Account ID",
    "Account name",
    "Journal ID",
    "Date", // Added Date column
    "Debit",
    "Credit",
    "Description",
  ];


  // State variables
  const [data, setData] = useState([]);
  const [sortOption, setSortOption] = useState("");
  const [defaultSortedData, setDefaultSortedData] = useState([]);
  const [journalDateMap, setJournalDateMap] = useState({});
  const [searching, setSearching] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scopedData, setScopedData] = useState(null);
  const [reportForm, setReportForm] = useState({
    startDate: "",
    endDate: "",
    journalId: "",
    description: "",
    invoiceId: "",
    currencyId: "",
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
  const GENERAL_LEDGER_ENDPOINT = `${API_URL}/api/general-ledger-jel-view/`;
  const FINANCIAL_REPORTS_ENDPOINT = `${API_URL}/api/financial-reports/`;


  // Open Modal
  const openModal = () => setIsModalOpen(true);


  // Close Modal
  const closeModal = () => {
    setIsModalOpen(false);
    setScopedData(null);
  };


  // Fetch Journal Dates for Generate Report
  const fetchJournalDates = async () => {
    try {
      const response = await axios.get(JOURNAL_ENTRIES_ENDPOINT);
      const dateMap = {};
      response.data.forEach((entry) => {
        dateMap[entry.journal_id || entry.id] =
          entry.journal_date || entry.date;
      });
      setJournalDateMap(dateMap);
    } catch (error) {
      console.error(
        "Error fetching journal dates:",
        error.response ? error.response.data : error
      );
      setValidation({
        isOpen: true,
        type: "error",
        title: "Fetch Error",
        message:
          "Failed to load general ledger data. Please check your connection.",
      });
    }
  };


  // Fetch General Ledger Data
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(GENERAL_LEDGER_ENDPOINT);
      const enrichedData = response.data.map((entry) => {
        const journalId = entry.journal_id;
        const journalDate = journalDateMap[journalId] || null;

        return {
          row: [
            entry.entry_line_id,
            entry.gl_account_id || "N/A",
            entry.account_name || "No Account",
            journalId || "-",
            journalDate || "-", // Date column
            parseFloat(entry.debit_amount || "0.00").toFixed(2),
            parseFloat(entry.credit_amount || "0.00").toFixed(2),
            entry.description || "-",
          ],
          journalDate,
        };
      });


      // Sort by journalDate in descending order
      const sortedByDate = enrichedData.sort((a, b) => {
        const dateA = new Date(a.journalDate);
        const dateB = new Date(b.journalDate);
        return dateB - dateA; 
      });

      setData(sortedByDate); // Set the sorted data to state
      setDefaultSortedData(sortedByDate); // Store the default sorted data
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching GL data:", error.response ? error.response.data : error);
      setValidation({
        isOpen: true,
        type: "error",
        title: "Fetch Error",
        message: "Failed to load general ledger data. Please check your connection.",
      });
      setIsLoading(false);
    }
  };


  // Fetch data on component mount
  useEffect(() => {
    const fetchAll = async () => {
      await fetchJournalDates();
    };
    fetchAll();
  }, []);


  // Fetch data when journalDateMap is populated
  useEffect(() => {
    if (Object.keys(journalDateMap).length > 0) {
      // Get all dates and find the latest
      const dates = Object.values(journalDateMap).map(dateStr => new Date(dateStr));
      const latestDate = new Date(Math.max(...dates));
      const startDate = new Date(latestDate);
      startDate.setDate(latestDate.getDate() - 7); // last 7 days

      setReportForm(prev => ({
        ...prev,
        startDate: startDate.toISOString().split("T")[0],
        endDate: latestDate.toISOString().split("T")[0],
      }));

      fetchData();
    }

  }, [journalDateMap]);


  // Handle Input Change
  const handleInputChange = (field, value) => {
    setReportForm((prevState) => ({ ...prevState, [field]: value }));
  };


  // Handle Submit
  const handleSubmit = async () => {
    const { startDate, endDate } = reportForm;
    const start = new Date(startDate);
    const end = new Date(endDate);

    const filteredData = data.filter((item) => {
      const journalDate = new Date(item.journalDate);
      return journalDate >= start && journalDate <= end;
    });

    setScopedData(filteredData);

    const totalCost = filteredData.reduce(
      (sum, item) => sum + (parseFloat(item.row[5]) || 0),
      0
    );


    // Payload for the report
    const reportPayload = {
      report_id: `FR-${Date.now()}`,
      report_type: reportForm.typeOfReport,
      total_cost: totalCost.toFixed(2),
      start_date: startDate,
      end_date: endDate,
      generated_by: reportForm.generatedBy,
    };

    try {
      const response = await axios.post(
        FINANCIAL_REPORTS_ENDPOINT,
        reportPayload
      );

      if (response.status === 201) {
        setValidation({
          isOpen: true,
          type: "success",
          title: "Report Generated Successfully",
          message: "Kindly check it under the Financial Reports tab.",
        });
        closeModal();
      } else {
        setValidation({
          isOpen: true,
          type: "error",
          title: "Server Error",
          message: "Failed to submit report.",
        });
      }
    } catch (error) {
      console.error(
        "Error submitting report:",
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


  // Handle Search
  const filteredData = data.filter((item) => {
    const searchContent = [
      item.row[0], // Entry Line ID
      item.row[1], // GL Account ID
      item.row[2], // Account Name
      item.row[3], // Journal ID
      item.row[4], // Date
      item.row[7], // Description
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return searchContent.includes(searching.toLowerCase());
  });


  // Handle Sorting
  const dataToCalculate = scopedData || filteredData;
  const totalDebit = dataToCalculate.reduce(
    (sum, item) => sum + (parseFloat(item.row[5]) || 0),
    0
  );
  const totalCredit = dataToCalculate.reduce(
    (sum, item) => sum + (parseFloat(item.row[6]) || 0),
    0
  );


  // Sort function
  const handleSort = (selected) => {
    setSortOption(selected);

    if (selected === "Ascending" || selected === "Descending") {
      const order = selected === "Ascending" ? "asc" : "desc";
      setSortOrder(order);

      const sortedData = [...data].sort((a, b) => {
        const totalA = (parseFloat(a.row[5]) || 0) + (parseFloat(a.row[6]) || 0);
        const totalB = (parseFloat(b.row[5]) || 0) + (parseFloat(b.row[6]) || 0);
        return order === "asc" ? totalA - totalB : totalB - totalA;
      });

      setData(sortedData);
    } else {
      // Default option selected, revert to original date-sorted data
      setData(defaultSortedData);
    }
  };


  // Format numbers with commas and two decimal places
  const formatNumber = (num) =>
    num.toLocaleString("en-US", { minimumFractionDigits: 2 });
  const formattedTotalDebit = formatNumber(totalDebit);
  const formattedTotalCredit = formatNumber(totalCredit);


  // Loading spinner component
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center p-8 mt-30">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      <p className="ml-4 text-gray-600">Loading general ledger data...</p>
    </div>
  );


  
  return (
    <div className="generalLedger">
      <div className="body-content-container">


        {/* Title and Subtitle */}
        <div className="title-subtitle-container">
          <h1 className="subModule-title">General Ledger</h1>
        </div>



        {/* Parent Component Container */}
        <div className="parent-component-container">

          <div className="component-container">
            <Dropdown
              options={["Ascending", "Descending"]}
              style="selection"
              defaultOption="Sort Debit Credit.."
              value={sortOption}
              onChange={handleSort}
            />

            <Search
              type="text"
              placeholder="Search Entries.."
              value={searching}
              onChange={(e) => setSearching(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            <Table
              data={filteredData.map((item) => item.row)}
              columns={columns}
            />

            <div
              className="grid grid-cols-7 gap-4 mt-4 items-center border-t pt-2 
             font-light max-sm:text-[8px] max-sm:font-light max-md:text-[10px] max-md:font-light 
             max-lg:text-[10px] max-lg:font-light max-xl:text-[10px] max-xl:font-light 2xl:text-[10px] 2xl:font-light"
            >
              <div className="col-span-3"></div>
              <div className="font-bold">Total</div>
              <div className="break-words max-sm:break-all">{formattedTotalDebit}</div>
              <div className="break-words max-sm:break-all">{formattedTotalCredit}</div>
            </div>
          </>
        )}
      </div>

      <ReportModalInput
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        reportForm={reportForm}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
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

export default BodyContent;
