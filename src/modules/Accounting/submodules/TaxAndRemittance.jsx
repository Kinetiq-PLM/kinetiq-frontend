import React, { useState, useEffect } from "react";
import "../styles/accounting-styling.css";
import Table from "../components/table/Table";
import Search from "../components/search/Search";
import Button from "../components/button/Button";
import NotifModal from "../components/modalNotif/NotifModal";
import TaxRemittanceModal from "../components/taxRemittance/TaxRemittanceModal"; // Imported component

const TaxAndRemittance = () => {
  const [data, setData] = useState([]);
  const [searching, setSearching] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
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
    "Action",
  ];

  const API_URL =
    import.meta.env.VITE_API_URL ||
    "https://vyr3yqctq8.execute-api.ap-southeast-1.amazonaws.com/dev";
  const TAXREMITTANCE_ENDPOINT = `${API_URL}/api/payroll-remittances/`;

  const fetchTaxRemittanceData = async () => {
    try {
      const response = await fetch(TAXREMITTANCE_ENDPOINT);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      result.sort((a, b) => new Date(b.payment_date) - new Date(a.payment_date));
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
      console.error("Error fetching tax remittance data:", error);
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

  const handleOpenModal = (row) => {
    setSelectedRow(row);
    setIsCreating(false);
    setModalOpen(true);
  };

  const handleCreateRemittance = () => {
    const initialRow = columns.map((col) =>
      col === "Status" ? "Processing" : col === "Deduction Type" ? "SSS" : ""
    );
    setSelectedRow(initialRow);
    setIsCreating(true);
    setModalOpen(true);
  };

  const handleEditSubmit = async (updatedRow, isNewRemittance = false) => {
    try {
      const payload = {
        remittance_id: updatedRow[0],
        employee_id: updatedRow[1],
        deduction_type: updatedRow[2],
        amount: parseFloat(updatedRow[3]),
        payment_date: updatedRow[4],
        payment_method: updatedRow[5],
        reference_number: updatedRow[6],
        status: updatedRow[7],
      };

      const response = await fetch(TAXREMITTANCE_ENDPOINT, {
        method: isNewRemittance ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newData = await response.json();
      setData((prevData) =>
        isNewRemittance
          ? [
              [
                newData.remittance_id,
                newData.employee_id,
                newData.deduction_type,
                newData.amount,
                newData.payment_date,
                newData.payment_method,
                newData.reference_number,
                newData.status,
              ],
              ...prevData,
            ]
          : prevData.map((row) =>
              row[0] === updatedRow[0]
                ? [
                    newData.remittance_id,
                    newData.employee_id,
                    newData.deduction_type,
                    newData.amount,
                    newData.payment_date,
                    newData.payment_method,
                    newData.reference_number,
                    newData.status,
                  ]
                : row
            )
      );

      setValidation({
        isOpen: true,
        type: "success",
        title: "Success",
        message: `Remittance record ${isNewRemittance ? "created" : "updated"} successfully.`,
      });

      setModalOpen(false);
      setIsCreating(false);
    } catch (error) {
      console.error("Error saving remittance record:", error);
      setValidation({
        isOpen: true,
        type: "error",
        title: "Error",
        message: `Failed to save remittance record: ${error.message}`,
      });
    }
  };

  const filteredData = data.filter((row) =>
    [row[0], row[1], row[2], row[5], row[6], row[7]]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(searching.toLowerCase())
  );

  const LoadingSpinner = () => (
    <div className="flex justify-center items-center p-8 mt-30">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      <p className="ml-4 text-gray-600">Loading Tax and Remittance data...</p>
    </div>
  );

  return (
    <div className="accountsPayable">
      <div className="body-content-container">
        <div className="title-subtitle-container">
          <h1 className="subModule-title">Tax and Remittance</h1>
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
          <Button
            name="Create New Remittance"
            variant="standard2"
            onclick={handleCreateRemittance}
          />
        </div>

        <div className="title-subtitle-container">
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <Table
              columns={columns}
              data={filteredData}
              showEditButton={true}
              handleEditRow={handleOpenModal}
            />
          )}
        </div>
      </div>

      {modalOpen && (
        <TaxRemittanceModal
          isModalOpen={modalOpen}
          closeModal={() => {
            setModalOpen(false);
            setIsCreating(false);
          }}
          selectedRow={selectedRow}
          handleSubmit={handleEditSubmit}
          columnHeaders={columns}
          isCreating={isCreating}
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

export default TaxAndRemittance;