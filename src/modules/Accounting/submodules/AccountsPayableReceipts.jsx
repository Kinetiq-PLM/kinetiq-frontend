import React, { useState, useEffect } from "react";
import "../styles/accounting-styling.css";
import Table from "../components/table/Table";
import Search from "../components/search/Search";
import NotifModal from "../components/modalNotif/NotifModal";
import AccountsPayableReceiptModal from "../components/accountPayableReceipts/apModal";

const AccountsPayableReceipt = () => {
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
  const [invoiceIds, setInvoiceIds] = useState([]);

  const columns = [
    "AP ID",
    "Invoice ID",
    "Amount",
    "Payment Date",
    "Payment Method",
    "Paid By",
    "Reference Number",
    "Status",
  ];

  const API_URL =
    import.meta.env.VITE_API_URL ||
    "https://vyr3yqctq8.execute-api.ap-southeast-1.amazonaws.com/dev";
  const AP_RECEIPT_ENDPOINT = `${API_URL}/api/accounts-payable-receipts/`;

  const fetchAccountsPayableReceiptData = async () => {
    try {
      const response = await fetch(AP_RECEIPT_ENDPOINT);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      result.sort((a, b) => new Date(b.payment_date) - new Date(a.payment_date));
      const transformedData = result.map((item) => [
        item.ap_id,
        item.invoice_id,
        item.amount,
        item.payment_date,
        item.payment_method,
        item.paid_by,
        item.reference_number,
        item.status,
      ]);
      setData(transformedData);
      const invIds = [...new Set(result.map((item) => item.invoice_id).filter(Boolean))];
      setInvoiceIds(invIds);
    } catch (error) {
      console.error("Error fetching accounts payable receipt data:", error);
      setValidation({
        isOpen: true,
        type: "error",
        title: "Error",
        message: "Failed to fetch Accounts Payable Receipt data. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAccountsPayableReceiptData();
  }, []);

  const handleOpenModal = (row) => {
    console.log("Opening modal with row:", row);
    setSelectedRow(row);
    setIsCreating(false);
    setModalOpen(true);
  };

  const handleEditSubmit = async (updatedRow, isNewReceipt = false) => {
    try {
      const payload = {
        ap_id: updatedRow[0],
        invoice_id: updatedRow[1],
        amount: parseFloat(updatedRow[2]),
        payment_date: updatedRow[3],
        payment_method: updatedRow[4],
        paid_by: updatedRow[5],
        reference_number: updatedRow[6],
        status: updatedRow[7],
      };

      console.log("Payload being sent to backend:", payload);

      // Validate status locally
      const validStatuses = ["Processing", "Completed"];
      if (!validStatuses.includes(payload.status)) {
        throw new Error(`Invalid status: ${payload.status}. Must be one of ${validStatuses.join(", ")}`);
      }

      const url = isNewReceipt
        ? AP_RECEIPT_ENDPOINT
        : `${AP_RECEIPT_ENDPOINT}${payload.ap_id}/`;

      const response = await fetch(url, {
        method: isNewReceipt ? "POST" : "PUT",
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
          isNewReceipt
            ? [
                [
                  newData.ap_id,
                  newData.invoice_id,
                  newData.amount,
                  newData.payment_date,
                  newData.payment_method,
                  newData.paid_by,
                  newData.reference_number,
                  newData.status,
                ],
                ...prevData,
              ]
            : prevData.map((row) =>
                row[0] === updatedRow[0]
                  ? [
                      newData.ap_id,
                      newData.invoice_id,
                      newData.amount,
                      newData.payment_date,
                      newData.payment_method,
                      newData.paid_by,
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
          message: `Receipt record ${isNewReceipt ? "created" : "updated"} successfully.`,
        });
      } else {
        throw new Error("Unexpected response format: Expected JSON but received HTML");
      }

      setModalOpen(false);
      setIsCreating(false);
    } catch (error) {
      console.error("Error saving receipt record:", error);
      setValidation({
        isOpen: true,
        type: "error",
        title: "Error",
        message: `Failed to save receipt record: ${error.message}`,
      });
    }
  };

  const filteredData = data.filter((row) =>
    [row[0], row[1], row[4], row[5], row[6], row[7]]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(searching.toLowerCase())
  );

  const LoadingSpinner = () => (
    <div className="flex justify-center items-center p-8 mt-30">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      <p className="ml-4 text-gray-600">Loading Accounts Payable Receipt data...</p>
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
        <AccountsPayableReceiptModal
          isModalOpen={modalOpen}
          closeModal={() => {
            console.log("Closing modal");
            setModalOpen(false);
            setIsCreating(false);
          }}
          selectedRow={selectedRow}
          handleSubmit={handleEditSubmit}
          columnHeaders={columns.filter((col) => col !== "Action")}
          isCreating={isCreating}
          invoiceIds={invoiceIds}
          isNewReceipt={isCreating}
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

export default AccountsPayableReceipt;