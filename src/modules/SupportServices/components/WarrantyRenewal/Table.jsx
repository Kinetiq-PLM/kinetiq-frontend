"use client"

const Table = ({ renewals, onRowClick, selectedRenewal }) => {
  return (
    <div className="table-container">
      <table className="renewals-table">
        <thead>
          <tr>
            <th>Renewal ID</th>
            <th>Call ID</th>
            <th>Contract ID</th>
            <th>Duration</th>
            <th>Renewal Start</th>
            <th>Warranty End</th>
            <th>Renewal Fee</th>
          </tr>
        </thead>
        <tbody>
          {renewals.length > 0 ? (
            renewals.map((renewal, index) => (
              <tr 
                key={renewal.renewal_id || `renewal-${index}`} 
                className={`${
                  selectedRenewal?.renewal_id === renewal.renewal_id ? "selected-row" : ""
                } ${index % 2 !== 0 ? "alternate-row" : ""}`}
                onClick={() => onRowClick(renewal)} // makes table row clickable, function update the state fields
                style={{ cursor: "pointer" }} 
              >
                  <td>{renewal.renewal_id}</td>
                  <td>{renewal.service_call  ? renewal.service_call.service_call_id : "Null"}</td>
                  <td>{renewal.contract ? renewal.contract.contract_id : "Null"}</td>
                  <td>{renewal.duration}</td>
                  <td>{renewal.renewal_warranty_start}</td>
                  <td>{renewal.renewal_warranty_end}</td>
                  <td>{renewal.renewal_fee}</td>
              </tr>
            ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: "1rem" }}>
                  No renewals available
                </td>
              </tr>
            )}
        </tbody>
      </table>
    </div>
  )
}

export default Table

