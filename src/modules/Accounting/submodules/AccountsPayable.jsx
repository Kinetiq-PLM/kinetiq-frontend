import React, { useState, useEffect } from "react";
import "../styles/accounting-styling.css";
import Table from "../components/Table";
import Search from "../components/Search";
import NotifModal from "../components/modalNotif/NotifModal";
import axios from "axios";

const AccountsPayable = () => {
  // Use States
  const [data, setData] = useState([]);
  const [searching, setSearching] = useState("");
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const [validation, setValidation] = useState({
    isOpen: false,
    type: "warning",
    title: "",
    message: "",
  });
  const columns = [
    "Entry Line ID",
    "GL Account ID",
    "Account Name",
    "Journal ID",
    "Debit",
    "Credit",
    "Description",
  ];

  // API endpoint
  const API_URL =
    import.meta.env.VITE_API_URL || "https://vyr3yqctq8.execute-api.ap-southeast-1.amazonaws.com/dev";
  const GENERAL_LEDGER_ENDPOINT = `${API_URL}/api/general-ledger-jel-view/`;

  // Fetch Data
  const fetchData = async () => {
    setIsLoading(true); // Set loading to true when fetching starts
    try {
      const response = await axios.get(GENERAL_LEDGER_ENDPOINT);
      console.log("API Response:", response.data);

      // Get journal IDs for entries involving "Accounts Payable" or "Cash in Bank"
      const relevantJournalIds = new Set(
        response.data
          .filter(
            (entry) =>
              (entry.account_name === "Accounts Payable" || entry.account_name === "Raw Material Used")
          )
          .map((entry) => entry.journal_id)
      );

      // Include all entries for those journal IDs to capture both debit and credit sides
      const combinedData = response.data
        .filter((entry) => relevantJournalIds.has(entry.journal_id))
        .map((entry) => [
          entry.entry_line_id || "N/A",
          entry.gl_account_id || "N/A",
          entry.account_name || "No Account",
          entry.journal_id || "-",
          parseFloat(entry.debit_amount || "0.00").toFixed(2),
          parseFloat(entry.credit_amount || "0.00").toFixed(2),
          entry.description || "-",
        ]);

      console.log("Combined AP and Cash Data:", combinedData);
      setData(combinedData);
      setIsLoading(false); // Set loading to false when data is loaded
    } catch (error) {
      console.error("Error fetching data:", error.response ? error.response.data : error);
      setValidation({
        isOpen: true,
        type: "error",
        title: "Fetch Error",
        message: "Failed to load accounts payable data. Please check your connection.",
      });
      setIsLoading(false); // Set loading to false even on error
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Calculates the total for debit and credit
  const totalDebit = data.reduce((sum, row) => sum + parseFloat(row[4] || 0), 0);
  const totalCredit = data.reduce((sum, row) => sum + parseFloat(row[5] || 0), 0);

  // Search Sorting
  const filteredData = data.filter((row) =>
    [row[0], row[1], row[2], row[3], row[6]]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(searching.toLowerCase())
  );

  // Format the money with comma
  const formatNumber = (num) =>
    num.toLocaleString("en-US", { minimumFractionDigits: 2 });
  const formattedTotalDebit = formatNumber(totalDebit);
  const formattedTotalCredit = formatNumber(totalCredit);

  // Log totals for debugging
  useEffect(() => {
    console.log("Total Debit:", totalDebit, "Total Credit:", totalCredit);
  }, [totalDebit, totalCredit]);

  // Loading spinner component
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center p-8 mt-30">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      <p className="ml-4 text-gray-600">Loading accounts payable data...</p>
    </div>
  );

  return (
    <div className="accountsPayable">
      <div className="body-content-container">
        <div className="title-subtitle-container">
          <h1 className="subModule-title">Accounts Payable</h1>
        </div>
        <div className="parent-component-container">
          <Search
            type="text"
            placeholder="Search Record..."
            value={searching}
            onChange={(e) => setSearching(e.target.value)}
          />
        </div>
        
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            <Table data={filteredData} columns={columns} enableCheckbox={false} />
            <div className="grid grid-cols-7 gap-4 mt-4 items-center border-t pt-2 font-light max-sm:text-[10px] max-sm:font-light max-md:text-[10px] max-md:font-light max-lg:text-[10px] max-lg:font-light max-xl:text-[10px] max-xl:font-light 2xl:text-[10px] 2xl:font-light">
              <div className="col-span-3"></div>
              <div className="font-bold">Total</div>
              <div>{formattedTotalDebit}</div>
              <div>{formattedTotalCredit}</div>
              <div></div>
            </div>
          </>
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
    </div>
  );
};

export default AccountsPayable;