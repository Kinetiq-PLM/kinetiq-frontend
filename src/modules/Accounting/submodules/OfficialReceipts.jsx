import React, { useState } from 'react';
import "../styles/accounting-styling.css";
import Forms from "../components/Forms";
import Table from "../components/Table";



const OfficialReceipts = () => {
  const columns = ["OR ID", "Invoice ID", "Customer ID", "OR Date", "Settled Amount", "Remaining Amount", "Payment Method", "Reference #", "Created By"];
  const [data, setData] = useState([]);

  

  return (
    <div className="chartAccounts">
      <div className="body-content-container">

        <div className="title-subtitle-container">
          <h1 className="subModule-title">Official Receipts</h1>
          <h2 className="subModule-subTitle">List of receipts from different modules.</h2>
        </div>

        <div className="parent-component-container">
          <Forms type="text" placeholder="Search account..." />
        </div>

        <Table data={data} columns={columns} enableCheckbox={false} />

      </div>
    </div>
  )
}

export default OfficialReceipts