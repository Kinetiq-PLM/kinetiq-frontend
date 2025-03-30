"use client"

const Table = ({ requests, onViewRequest }) => {
  return (
    <div className="table-container">
      <table className="requests-table">
        <thead>
          <tr>
            <th>Request ID</th>
            <th>Call ID</th>
            <th>Request Date</th>
            <th>Customer Name</th>
            <th>Type</th>
            <th>Status</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request, index) => (
            <tr key={request.id} className={index % 2 === 0 ? "" : "alternate-row"}>
              <td>{request.id}</td>
              <td>{request.callId}</td>
              <td>{request.requestDate}</td>
              <td>{request.customerName}</td>
              <td>{request.type}</td>
              <td>{request.status}</td>
              <td>
                <button className="view-button" onClick={() => onViewRequest(request)}>
                  View
                </button>
              </td>
            </tr>
          ))}
    
          {Array(5 - requests.length)
            .fill()
            .map((_, index) => (
              <tr
                key={`empty-${index}`}
                className={`empty-row ${(index + requests.length) % 2 === 0 ? "" : "alternate-row"}`}
              >
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
  )
}

export default Table

