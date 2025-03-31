"use client"

const Table = ({ contracts, onRowClick, onViewContract }) => {
  return (
    <div className="table-container">
        <table className="contracts-table">
          <thead>
            <tr>
              <th>Contract ID</th>
              <th>Customer Name</th>
              <th>Product Name</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {contracts.map((contract, index) => (
              <tr 
                key={contract.id || `contract-${index}`} 
                className={index % 2 === 0 ? "" : "alternate-row"} 
                onClick={() => onRowClick(contract)} 
                style={{ cursor: "pointer" }} 
              >
                <td>{contract.contract_id}</td>
                <td>{contract.customer ? contract.customer.name : "Unknown"}</td>
                <td>{contract.product ? contract.product.product_name : "Unknown"}</td>
                <td>{contract.date_issued}</td>
                <td>{contract.end_date}</td>
                <td>{contract.contract_status}</td>
                <td>
                  <button className="view-button" onClick={() => onViewContract(contract)}>
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
    </div>
  )
}

export default Table

