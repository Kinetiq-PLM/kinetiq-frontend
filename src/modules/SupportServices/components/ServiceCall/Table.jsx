"use client"

const Table = ({ serviceCalls, onRowClick, onViewDetails, selectedCall }) => {
  return (
    <div className="table-container">
      <table className="service-calls-table">
        <thead>
          <tr>
            <th>Call ID</th>
            <th>Ticket ID</th>
            <th>Customer Name</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
        {serviceCalls.length > 0 ? (
          [...serviceCalls]
            .sort((a, b) => new Date(b.date_created) - new Date(a.date_created))
            .map((call, index) => (
            <tr 
              key={call.service_call_id || `ticket-${index}`} 
              className={`${
                selectedCall?.service_call_id === call.service_call_id ? "selected-row" : ""
              } ${index % 2 !== 0 ? "alternate-row" : ""}`}
              onClick={() => onRowClick(call)} // makes table row clickable, function update the state fields
              style={{ cursor: "pointer" }} 
            >
                <td>{call.service_call_id}</td>
                <td>{call.service_ticket  ? call.service_ticket.ticket_id : "Null"}</td>
                <td>{call.customer ? call.customer.name : "Unknown"}</td>
                <td className={`priority-${call.priority_level.toLowerCase()}`}>{call.priority_level}</td>
                <td>{call.call_status}</td>
                <td>
                  <button className="view-button" onClick={() => onViewDetails(call)}>
                    View
                  </button>
                </td>
            </tr>
          ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center", padding: "1rem" }}>
                No calls available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Table

