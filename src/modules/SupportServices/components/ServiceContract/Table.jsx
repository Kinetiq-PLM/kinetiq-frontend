"use client"

const Table = ({ contracts, onViewContract }) => {
  return (
    <div className="table-container">
      <div style={{ overflowX: "auto" }}>
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
            {contracts.map((contract) => (
              <tr key={contract.id}>
                <td>{contract.id}</td>
                <td>{contract.customerName}</td>
                <td>{contract.productName}</td>
                <td>{contract.startDate}</td>
                <td>{contract.endDate}</td>
                <td>{contract.status}</td>
                <td>
                  <button className="view-button" onClick={() => onViewContract(contract)}>
                    View
                  </button>
                </td>
              </tr>
            ))}
            {/* Empty rows to match the design */}
            {Array(5 - contracts.length)
              .fill()
              .map((_, index) => (
                <tr key={`empty-${index}`} className="empty-row">
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Table

