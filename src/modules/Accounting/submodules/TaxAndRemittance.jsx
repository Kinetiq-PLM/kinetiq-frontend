import React, { useState, useEffect } from "react";
import "../styles/accounting-styling.css";
import Table from "../components/table/Table";
import Search from "../components/search/Search";
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
  const [employeeIds, setEmployeeIds] = useState([]);

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
      const empIds = [...new Set(result.map((item) => item.employee_id).filter(Boolean))];
      setEmployeeIds(empIds);
    } catch (error) {
      console.error("Error fetching tax remittance data:", error);
      setValidation({
        isOpen: true,
        type: "error",
        title: "Error",
        message: "Failed to fetch Tax and Remittance data. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTaxRemittanceData();
  }, []);

  const handleOpenModal = (row) => {
    console.log("Opening modal with row:", row);
    setSelectedRow(row);
    setIsCreating(false);
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

      console.log("Payload being sent to backend:", payload);

      // Validate status locally
      const validStatuses = ["Processing", "Completed"];
      if (!validStatuses.includes(payload.status)) {
        throw new Error(`Invalid status: ${payload.status}. Must be one of ${validStatuses.join(", ")}`);
      }

      const url = isNewRemittance
        ? TAXREMITTANCE_ENDPOINT
        : `${TAXREMITTANCE_ENDPOINT}${payload.remittance_id}/`;

      const response = await fetch(url, {
        method: isNewRemittance ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const contentType = response.headers.get("content-type");
      const responseText = await response.text();

      if (!response.ok) {
        console.error("Response Text:", responseText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${responseText}`);
      }

      if (contentType && contentType.includes("application/json")) {
        const newData = JSON.parse(responseText);
        console.log("Backend response data:", newData);

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
      } else {
        throw new Error("Unexpected response format: Expected JSON but received HTML");
      }

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
            console.log("Closing modal");
            setModalOpen(false);
            setIsCreating(false);
          }}
          selectedRow={selectedRow}
          handleSubmit={(data, isNewRemittance) => handleEditSubmit(data, isNewRemittance)}
          columnHeaders={columns}
          isCreating={isCreating}
          employeeIds={employeeIds}
          isNewRemittance={isCreating}
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