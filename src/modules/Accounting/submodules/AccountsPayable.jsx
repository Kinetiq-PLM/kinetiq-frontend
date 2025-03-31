import React from 'react'
import '../styles/accounting-styling.css'
import Table from '../components/Table'
import Search from '../components/Search'

const AccountsPayable = () => {
    const columns = ["JERICHO Lagay ka columns here."]

    const data = ["JERICHO Lagay ka data here."]
    return (
        <div className="accountsPayable">
            <div className="body-content-container">

                <div className="title-subtitle-container">
                    <h1 className="subModule-title">Accounts Payable</h1>
                    <h2 className="subModule-subTitle">List of accounts payable in this system.</h2>
                </div>

                <div className="parent-component-container">
                    <Search type="text" placeholder="Search Record.." />
                </div>

                {/* <Table data={data} columns={columns} enableCheckbox={false} /> */}

            </div>
        </div>
    )
}

export default AccountsPayable