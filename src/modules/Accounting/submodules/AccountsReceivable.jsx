import React from 'react'
import '../styles/accounting-styling.css'
import Table from '../components/Table'
import Search from '../components/Search'

const AccountsReceivable = () => {
    const columns = ["JERICHO Lagay ka columns here."]

    const data = ["JERICHO Lagay ka data here."]

  return (
    <div className="accountsReceivable">
      <div className="body-content-container">

        <div className="title-subtitle-container">
          <h1 className="subModule-title">Official Receipts</h1>
          <h2 className="subModule-subTitle">List of receipts.</h2>
        </div>

        <div className="parent-component-container">
          <Search type="text" placeholder="Search Record.." />
        </div>

        {/* <Table data={data} columns={columns} enableCheckbox={false} /> */}

      </div>
    </div>
  )
}

export default AccountsReceivable