import React, { useState, useEffect } from "react";
import "../styles/Accounting-Global-Styling.css";
import { accounts } from "./ListOfAccounts";
import SearchBar from "../../../shared/components/SearchBar";
import Button from "../components/Button";
import Dropdown from "../components/Dropdown";
import Table from "../components/Table";
import Forms from "../components/Forms";

const BodyContent = () => {
    const columns = ["Account code", "Account name", "Account type"];

    // State for account data and form handling
    const [data, setData] = useState([]);
    const [isAdding, setIsAdding] = useState(false);
    const [newAccount, setNewAccount] = useState({
        account_code: "",
        account_name: "",
        account_type: ""
    });

    // Handle Input Change
    const handleInputChange = (field, value) => {
        setNewAccount(prev => ({ ...prev, [field]: value }));
    };

    // Handle Add Account
    const handleAddAccount = () => {
        setIsAdding(true);
    };

    const handleRemoveNewRow = () => {
        setIsAdding(false);
        setNewAccount({ account_code: "", account_name: "", account_type: "" });
    };

    // Handle Submit
    const handleSubmit = async () => {
        if (!newAccount.account_code || !newAccount.account_name || !newAccount.account_type) {
            return;
        }

        // Check if the account_code already exists in the current data
        const accountCodeExists = data.some(row =>
            row[0] === newAccount.account_code // Compare as strings
        );

        if (accountCodeExists) {
            alert("Account code already exists."); // Alert user if duplicate found
            return;
        }

        // Submit new account data to the API when the Submit button is clicked
        try {
            console.log("Submitting data:", newAccount); // Debugging

            const response = await axios.post("http://127.0.0.1:8000/api/chart-of-accounts/", newAccount);

            console.log("Response:", response); // Check response

            if (response.status === 201) {
                const addedAccount = response.data;
                setData(prevData => [...prevData, [addedAccount.account_code, addedAccount.account_name, addedAccount.account_type]]);
                setNewAccount({ account_code: "", account_name: "", account_type: "" });
                setIsAdding(false);
            } else {
                alert("Failed to save data. Please try again.");
            }
        } catch (error) {
            console.error("Error submitting data:", error.response ? error.response.data : error);
            alert("An error occurred. Please check your connection.");
        }
    };

    const renderTableData = () => {
        if (isAdding) {
            return [
                [
                    <Forms type="text" placeholder="Enter account code" value={newAccount.account_code} onChange={(e) => handleInputChange("account_code", e.target.value)} />,
                    <Forms type="text" placeholder="Enter account name" value={newAccount.account_name} onChange={(e) => handleInputChange("account_name", e.target.value)} />,
                    <div className="flex gap-2">
                        <Dropdown options={accounts} style="selection" defaultOption="Select account type" value={newAccount.account_type} onChange={(value) => handleInputChange("account_type", value)} />
                        <button className="remove-btn" onClick={handleRemoveNewRow}>❌</button> 
                    </div>
                ],
                ...data
            ];
        } else {
            return data;
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
                        <Button name={isAdding ? "Creating..." : "Create Account"} variant="standard2" onclick={handleAddAccount} disabled={isAdding} />
                        <Button name="Submit" variant="standard1" onclick={handleSubmit} />
                    </div>

                </div>

                {/* Table Display */}
                <Table data={renderTableData()} columns={columns} enableCheckbox={true} enableActions={true} />
            </div>
        </div>
    );
};

export default BodyContent;