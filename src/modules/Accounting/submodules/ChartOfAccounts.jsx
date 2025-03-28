import React, { useState, useEffect } from "react";
// import axios from "axios";
import "../styles/accounting-styling.css";
import { accounts } from "./ListOfAccounts";
import SearchBar from "../../../shared/components/SearchBar";
import Button from "../components/Button";
import Dropdown from "../components/Dropdown";
import Table from "../components/Table";
import CoaModalInput from "../components/CoaModalInput";

const BodyContent = () => {
    const columns = ["Account code", "Account name", "Account type"];

    // State for account data and form handling
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const [data, setData] = useState([]);
    const [newAccount, setNewAccount] = useState({
        account_code: "",
        account_name: "",
        account_type: ""
    });

    // // Fetch data from API when the component mounts
    // useEffect(() => {
    //     axios.get("http://127.0.0.1:8000/api/chart-of-accounts/")
    //         .then(response => {
    //             setData(response.data.map(acc => [acc.account_code, acc.account_name, acc.account_type]));
    //         })
    //         .catch(error => console.error("Error fetching data:", error));
    // }, []);

    // Handle Input Change
    const handleInputChange = (field, value) => {
        setNewAccount(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        if (!newAccount.account_code || !newAccount.account_name || !newAccount.account_type) {
            alert("All fields are required.");
            return;
        }

        // Check if the account_code already exists
        const accountCodeExists = data.some(row => row[0] === newAccount.account_code);
        if (accountCodeExists) {
            alert("Account code already exists.");
            return;
        }

        try {
            console.log("Submitting data:", newAccount);

            const response = await axios.post("http://127.0.0.1:8000/api/chart-of-accounts/", newAccount);

            if (response.status === 201) {
                const addedAccount = response.data;
                setData(prevData => [...prevData, [addedAccount.account_code, addedAccount.account_name, addedAccount.account_type]]);
                setNewAccount({ account_code: "", account_name: "", account_type: "" });
                closeModal(); // ✅ Close modal after adding account
            } else {
                alert("Failed to save data. Please try again.");
            }
        } catch (error) {
            console.error("Error submitting data:", error.response ? error.response.data : error);
            alert("An error occurred. Please check your connection.");
        }
    };

    return (
        <div className="chartAccounts">
            <div className="body-content-container">

                <div className="title-subtitle-container">
                    <h1 className="subModule-title">Chart of Accounts</h1>
                    <h2 className="subModule-subTitle">A structured list of all accounts used to record financial transactions in the system.</h2>
                </div>

                <div className="parent-component-container">
                    <div className="component-container">
                        <Dropdown options={accounts} style="selection" defaultOption="Sort account.." />
                        <SearchBar />
                    </div>

                    <div className="component-container">
                        <Button name={isModalOpen ? "Creating..." : "Create Account"} variant="standard2" onclick={openModal} /> {/* ✅ Fixed onClick */}
                    </div>
                </div>

                {/* Table Display */}
                <Table data={data} columns={columns} enableCheckbox={false} /> {/* ✅ Fixed table rendering */}
            </div>

            <CoaModalInput
                isModalOpen={isModalOpen}
                closeModal={closeModal}
                coaForm={newAccount}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
            />
        </div>
    );
};

export default BodyContent;
