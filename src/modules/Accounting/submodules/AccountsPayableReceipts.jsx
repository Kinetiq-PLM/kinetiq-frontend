import React, { useState, useEffect } from "react";
import "../styles/accounting-styling.css";
import Table from "../components/table/Table";
import Search from "../components/search/Search";
import Button from "../components/button/Button";
import NotifModal from "../components/modalNotif/NotifModal";

const AccountsPayableReceipt = () => {
  const [data, setData] = useState([]); // State to store table data
  const [searching, setSearching] = useState("");
  const [isLoading, setIsLoading] = useState(true); // State to manage loading state
  const [validation, setValidation] = useState({
    isOpen: false,
    type: "",
    title: "",
    message: "",
  });

  const columns = [
    "Remittance ID",
    "Employee ID",
    "Deduction Type",
    "Amount",
    "Payment Date",
    "Payment Method",
    "Reference Number",
    "Status",
  ];

  // API Endpoint
  const API_URL =
    import.meta.env.VITE_API_URL ||
    "https://vyr3yqctq8.execute-api.ap-southeast-1.amazonaws.com/dev";
  const TAXREMITTANCE_ENDPOINT = `${API_URL}/api/payroll-remittances/`;

  const fetchTaxRemittanceData = async () => {
    try {
      const response = await fetch(TAXREMITTANCE_ENDPOINT);
      const result = await response.json();

      result.sort((a, b) => new Date(b.date_approved) - new Date(a.date_approved));

      const transformedData = result.map((item) => [
        item.remittance_id,
        item.employee_id,
        item.deduction_type,
        item.amount,
        item.payment_date,
        item.payment_method,
        item.reference_number,
        item.status,
      ]);

      setData(transformedData);
    } catch (error) {
      console.error("Error fetching payroll data:", error);
      setValidation({
        isOpen: true,
        type: "error",
        title: "Error",
        message: "Failed to fetch Tax and Remittance data.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTaxRemittanceData();
  }, []);

  // Search Filter based on columns
  const filteredData = data.filter((row) =>
    [row[0], row[1], row[2], row[3], row[4], row[5]]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(searching.toLowerCase())
  );

  // Loading spinner component
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center p-8 mt-30">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      <p className="ml-4 text-gray-600">Loading Account payable receipt data...</p>
    </div>
  );

  return (
    <div className="accountsPayable">
      <div className="body-content-container">
        <div className="title-subtitle-container">
          <h1 className="subModule-title">Accounts Payable Receipt</h1>
        </div>

        <div className="parent-component-container">
          <div className="component-container">
          <Search
            type="text"
            placeholder="Search Record..."
            value={searching}
            onChange={(e) => setSearching(e.target.value)}
          />
          </div>
        </div>

        {/* Accounts Payable Receipt Table */}
        <div className="title-subtitle-container">
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <Table columns={columns} data={filteredData} />
          )}
        </div>
      </div>

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

export default AccountsPayableReceipt;