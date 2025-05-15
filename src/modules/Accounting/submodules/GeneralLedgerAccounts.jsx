import React, { useState, useEffect } from "react";
import "../styles/accounting-styling.css";
import Table from "../components/table/Table";
import Search from "../components/search/Search";
import Dropdown from "../components/dropdown/Dropdown";
import Button from "../components/button/Button";
import CreateGLAccountModal from "../components/glAccountsModal/CreateGLAccountModal";
import NotifModal from "../components/modalNotif/NotifModal";
import axios from "axios";

const GeneralLedgerAccounts = () => {

  // Column names for the table
  const columns = [
    "GL Account ID",
    "Account Name",
    "Account Code",
    "Account ID",
    "Status",
    "Created at",
  ];


  // State variables
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searching, setSearching] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const [statusFilter, setStatusFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusModal, setStatusModal] = useState({
    isOpen: false,
    rowIndex: null,
    newStatus: null,
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
  const GL_ACCOUNTS_ENDPOINT = `${API_URL}/api/general-ledger-accounts/`;

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const fetchData = async () => {
    setIsLoading(true); // Set loading to true when fetching starts
    try {
      const response = await axios.get(GL_ACCOUNTS_ENDPOINT);
      console.log("API Response (fetchData):", response.data);

      const sortedData = response.data
        .map((entry) => [
          entry.gl_account_id || "-",
          entry.account_name || "-",
          entry.account_code || "-",
          entry.account_id || "-",
          entry.status || "-",
          entry.created_at ? new Date(entry.created_at).toLocaleString() : "-",
        ])
        .sort((a, b) => a[0].localeCompare(b[0])); // Sort by GL Account ID

      setData(sortedData);
      setIsLoading(false); // Set loading to false when fetching is done
    } catch (error) {
      console.error(
        "Error fetching data:",
        error.response ? error.response.data : error
      );
      setValidation({
        isOpen: true,
        type: "error",
        title: "Fetch Error",
        message:
          "Failed to load general ledger accounts. Please check your connection.",
      });
      setIsLoading(false); // Set loading to false even if there's an error
    }
  };


  useEffect(() => {
    fetchData();
  }, []);


  // Status filter function
  const handleStatusFilter = (status) => {
    setStatusFilter(status === "" ? "All" : status);
  };

  const handleCreateAccount = async (newAccount) => {
    if (!newAccount.createdAt) {
      setValidation({
        isOpen: true,
        type: "warning",
        title: "Missing Required Fields",
        message: "Select start and End date.",
      });
      return;
    }

    if (!newAccount.accountName) {
      setValidation({
        isOpen: true,
        type: "warning",
        title: "Missing Required Fields",
        message: "Input Account Name.",
      });
      return;
    }

    if (!newAccount.accountID) {
      setValidation({
        isOpen: true,
        type: "warning",
        title: "Missing Required Fields",
        message: "Input Account ID.",
      });
      return;
    }

    if (!newAccount.status) {
      setValidation({
        isOpen: true,
        type: "warning",
        title: "Missing Required Fields",
        message: "Set Status.",
      });
      return;
    }

    const requiredFields = [
      newAccount.createdAt,
      newAccount.glAccountID,
      newAccount.accountName,
      newAccount.accountID,
      newAccount.status,
      newAccount.accountCode,
    ];

    if (
      requiredFields.includes("") ||
      requiredFields.includes(undefined) ||
      requiredFields.includes(null)
    ) {
      setValidation({
        isOpen: true,
        type: "warning",
        title: "Missing Required Fields",
        message: "Please fill in all required fields.",
      });
      return;
    }

    // Prepare payload for API
    const payload = {
      gl_account_id: newAccount.glAccountID,
      account_name: newAccount.accountName,
      account_code: newAccount.accountCode,
      account_id: newAccount.accountID,
      status: newAccount.status,
      created_at: newAccount.createdAt,
    };

    try {
      const response = await axios.post(GL_ACCOUNTS_ENDPOINT, payload);
      if (response.status === 201) {
        console.log("API Response (handleCreateAccount):", response.data);
        fetchData();
        closeModal();
        setValidation({
          isOpen: true,
          type: "success",
          title: "Account Created",
          message: "General Ledger Account created successfully!",
        });
      } else {
        setValidation({
          isOpen: true,
          type: "error",
          title: "Server Error",
          message: "Failed to create account.",
        });
      }
    } catch (error) {
      console.error(
        "Error creating account:",
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


  // Sorting function
  const handleSort = (value) => {
    let sortedData = [...data];

    if (value === "Default") {
      sortedData.sort((a, b) => a[0].localeCompare(b[0]));
    } else if (value === "Date Ascending") {
      sortedData.sort((a, b) => a[5].localeCompare(b[5]));
    } else if (value === "Date Descending") {
      sortedData.sort((a, b) => b[5].localeCompare(a[5]));
    }

    setData(sortedData);
  };



  // Filter data based on search input and status filter
  const filteredData = data.filter((row) => {
    const matchesSearch = [row[0], row[1], row[2], row[3], row[4], row[5]]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(searching.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      statusFilter === "" ||
      row[4].toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });


  // Handle status toggle function
  const handleStatusToggle = (rowIndex) => {
    const currentRow = filteredData[rowIndex];
    const currentStatus = currentRow[4];
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";

    setStatusModal({ isOpen: true, rowIndex, newStatus });
  };


  const confirmStatusChange = async () => {
    const { rowIndex, newStatus } = statusModal;
    const glAccountID = filteredData[rowIndex][0];

    try {
      await axios.patch(`${GL_ACCOUNTS_ENDPOINT}${glAccountID}/`, { status: newStatus });
      fetchData(); // Refresh data
      setValidation({
        isOpen: true,
        type: "success",
        title: "Status Updated",
        message: `Status successfully changed to ${newStatus}`,
      });
    } catch (error) {
      console.error("Error updating status:", error);
      setValidation({
        isOpen: true,
        type: "error",
        title: "Update Failed",
        message: "Failed to update status. Try again later.",
      });
    } finally {
      setStatusModal({ isOpen: false, rowIndex: null, newStatus: null });
    }
  };

  const cancelStatusChange = () => {
    setStatusModal({ isOpen: false, rowIndex: null, newStatus: null });
  };






  // Loading spinner component
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center p-8 mt-30">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      <p className="ml-4 text-gray-600">Loading general ledger accounts data...</p>
    </div>
  );


  return (
    <div className="generalLedgerAccounts">
      <div className="body-content-container">
        <div className="title-subtitle-container">
          <h1 className="subModule-title">General Ledger Accounts</h1>
        </div>

        <div className="parent-component-container">
          <div className="component-container">
            <Dropdown
              options={["Default", "Date Ascending", "Date Descending"]}
              style="selection"
              defaultOption="Sort by date.."
              onChange={(value) => handleSort(value)}
            />


            <Dropdown
              options={["All", "Active", "Inactive"]}
              style="selection"
              defaultOption="Filter by Status.."
              onChange={handleStatusFilter}
            />
            <Search
              type="text"
              placeholder="Search Entries.."
              value={searching}
              onChange={(e) => setSearching(e.target.value)}
            />
          </div>
          <div>
            <Button
              name="Create account"
              variant="standard2"
              onclick={openModal}
            />
          </div>
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <Table data={filteredData} columns={columns} enableCheckbox={false} handleStatusToggle={handleStatusToggle} />
        )}
      </div>

      {isModalOpen && (
        <CreateGLAccountModal
          isModalOpen={isModalOpen}
          closeModal={closeModal}
          handleSubmit={handleCreateAccount}
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

      {statusModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Change Status</h2>
            <p className="text-gray-600">
              Are you sure you want to change the status to{" "}
              <span className="font-bold">{statusModal.newStatus}</span>?
            </p>
            <div className="flex justify-end gap-4">
              <Button name="Cancel" variant="standard1" onclick={cancelStatusChange} />
              <Button name="Confirm" variant="standard2" onclick={confirmStatusChange} />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default GeneralLedgerAccounts;
