import React, { useState, useEffect } from "react";
import "../styles/Accounting-Global-Styling.css";
import { currencies } from "./ListOfAccounts";
import Forms from "../components/Forms";
import Dropdown from "../components/Dropdown";
import Table from "../components/Table";

const BodyContent = () => {
    const columns = ["Currency ID", "Currency Name", "Exchange Rate", "Is Active"];

    const data = [
      ["AC-Dollar-123", "Dollar", "59.0", "True"]
    ];

    return (
        <div className="generalLedger">
            <div className="body-content-container">


                <div className="title-subtitle-container">
                    <h1 className="subModule-title">Currency</h1>
                    <h2 className="subModule-subTitle">List of currencies along with their exchange rates.</h2>
                </div>
                

                <div className="parent-component-container">
                    <div className="component-container">
                        <Dropdown
                            options={currencies}
                            style="selection"
                            defaultOption="Select currency..."
                        />
                    </div>
                </div>

                <Table data={data} columns={columns} />
            </div>
        </div>
    );
};

export default BodyContent;