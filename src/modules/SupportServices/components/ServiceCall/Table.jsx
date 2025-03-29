"use client"

const Table = ({ serviceCalls, onViewDetails }) => {
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
          {serviceCalls.map((call, index) => (
            <tr key={call.callId} className={index % 2 === 0 ? "" : "alternate-row"}>
              <td>{call.callId}</td>
              <td>{call.ticketId}</td>
              <td>{call.customerName}</td>
              <td className={`priority-${call.priority.toLowerCase()}`}>{call.priority}</td>
              <td>{call.status}</td>
              <td>
                <button className="view-button" onClick={() => onViewDetails(call)}>
                  View
                </button>
              </td>
            </tr>
          ))}
          {/* Empty rows to match the design - reduced number */}
          {Array(5 - serviceCalls.length)
            .fill()
            .map((_, index) => (
              <tr
                key={`empty-${index}`}
                className={`empty-row ${(index + serviceCalls.length) % 2 === 0 ? "" : "alternate-row"}`}
              >
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

