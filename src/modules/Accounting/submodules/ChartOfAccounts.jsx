import "../styles/accounting-styling.css";
import React, { useState, useEffect } from "react";
import { accounts } from "./ListOfAccounts";
import axios from "axios";
import Search from "../components/Search";
import Button from "../components/Button";
import Dropdown from "../components/Dropdown";
import Table from "../components/Table";
import CoaModalInput from "../components/CoaModalInput";
import NotifModal from "../components/modalNotif/NotifModal";

const BodyContent = () => {
  // Use states
  const columns = ["Account code", "Account name", "Account type"];
  const [selectedAccountType, setSelectedAccountType] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [accountTypes, setAccountTypes] = useState([]);
  const [searching, setSearching] = useState("");
  const [data, setData] = useState([]);
  const [newAccount, setNewAccount] = useState({
    account_code: "",
    account_name: "",
    account_type: "",
  });

  // Open modal function
  const openModal = () => setIsModalOpen(true);

  // Close modal function
  const closeModal = () => setIsModalOpen(false);

  // Fetch data
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/chart-of-accounts/")
      .then((response) => {
        const rawData = response.data.map((acc) => [
          acc.account_code,
          acc.account_name,
          acc.account_type,
        ]);
        setData(rawData);

        // Extract unique account types from fetched data
        const uniqueTypes = [...new Set(response.data.map((acc) => acc.account_type))];
        setAccountTypes(uniqueTypes);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // Handle Input Change
  const handleInputChange = (field, value) => {
    setNewAccount((prev) => ({ ...prev, [field]: value }));
  };

  const [validation, setValidation] = useState({
    isOpen: false,
    type: "warning",
    title: "",
    message: "",
  });

  // Submit input with user validations
  const handleSubmit = async () => {
    // Check if required fields are filled
    if (!newAccount.account_code || !newAccount.account_name || !newAccount.account_type) {
      setValidation({
        isOpen: true,
        type: "warning",
        title: "All Fields Required",
        message: "Please fill in all the fields.",
      });
      return;
    }

    // Check if the account_code already exists
    const accountCodeExists = data.some((row) => row[0] === newAccount.account_code);
    if (accountCodeExists) {
      setValidation({
        isOpen: true,
        type: "warning",
        title: "Account Already Exists",
        message: "The account code is already used.",
      });
      return;
    }

    // Submit the new account to the backend
    try {
      console.log("Submitting data:", newAccount);

      const response = await axios.post("http://127.0.0.1:8000/api/chart-of-accounts/", newAccount);

      if (response.status === 201) {
        const addedAccount = response.data;
        setData((prevData) => [
          ...prevData,
          [addedAccount.account_code, addedAccount.account_name, addedAccount.account_type],
        ]);
        setNewAccount({ account_code: "", account_name: "", account_type: "" });
        closeModal();
        setValidation({
          isOpen: true,
          type: "success",
          title: "Account Added",
          message: "Successfully created account.",
        });
      } else {
        setValidation({
          isOpen: true,
          type: "error",
          title: "Server Error: Adding Account Failed",
          message: "Creating account failed.",
        });
      }
    } catch (error) {
      console.error("Error submitting data:", error.response ? error.response.data : error);
      setValidation({
        isOpen: true,
        type: "error",
        title: "Check Connection!",
        message: "Kindly check your connection to the database.",
      });
    }
  };

  // Filter data based on search and selected account type
  const filteredData = data.filter(([code, name, type]) => {
    const matchesSearch = [code, name, type]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(searching.toLowerCase());

    const matchesType = selectedAccountType ? type === selectedAccountType : true;

    return matchesSearch && matchesType;
  });

  return (
    <div className="chartAccounts">
      <div className="body-content-container">
        <div className="title-subtitle-container">
          <h1 className="subModule-title">Chart of Accounts</h1>
        </div>

        <div className="parent-component-container">
          <div className="component-container">
            <Dropdown
              options={accountTypes}
              style="selection"
              defaultOption="Sort accounts..."
              value={selectedAccountType}
              onChange={(value) => setSelectedAccountType(value)}
            />

            <Search
              type="text"
              placeholder="Search account.."
              onChange={(e) => setSearching(e.target.value)}
            />
          </div>

          <div className="component-container">
            <Button
              name={isModalOpen ? "Creating..." : "Create Account"}
              variant="standard2"
              onclick={openModal}
            />
          </div>
        </div>

        {/* Table Display */}
        <Table data={filteredData} columns={columns} enableCheckbox={false} />
      </div>

      <CoaModalInput
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        coaForm={newAccount}
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