"use client"

const Table = ({ requests, onRowClick, selectedRequest }) => {
  return (
    <div className="table-container">
        <table className="request-table">
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Request ID</th>
              <th>Call ID</th>
              <th>Request Date</th>
              <th>Type</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {requests.length > 0 ? (
              [...requests]
                .sort((a, b) => new Date(b.request_date) - new Date(a.request_date))
                .map((request, index) => (
                <tr 
                  key={request.service_request_id || `request-${index}`} 
                  className={`${  
                    selectedRequest?.service_request_id === request.service_request_id ? "selected-row" : ""
                  } ${index % 2 !== 0 ? "alternate-row" : ""}`}
                  onClick={() => onRowClick(request)} // makes table row clickable, function update the state fields
                  style={{ cursor: "pointer" }} 
                >
                  <td>{request.service_call? request.service_call.service_ticket.ticket_id : ""}</td>
                  <td>{request.service_request_id}</td>
                  <td>{request.service_call ? request.service_call.service_call_id : "Null"}</td>
                  <td>{new Date(request.request_date).toISOString().split("T")[0] || "Null"}</td>
                  <td>{request.request_type}</td>
                  <td>{request.request_status}</td>
                </tr>
              ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: "1rem" }}>
                    No requests available
                  </td>
                </tr>
              )}
          </tbody>
        </table>
      </div>
  )
}

export default Table

