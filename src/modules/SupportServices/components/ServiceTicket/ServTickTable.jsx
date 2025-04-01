const ServTickTable = ({ filteredTickets }) => {
  return (
    <div className="table-container">
      <table className="tickets-table">
        <thead>
          <tr>
            <th>Ticket ID</th>
            <th>Customer Name</th>
            <th>Created at</th>
            <th>Priority</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredTickets.map((ticket, index) => (
            <tr key={ticket.id} className={index % 2 === 0 ? "" : "alternate-row"}>
              <td>{ticket.id}</td>
              <td>{ticket.customerName}</td>
              <td>{ticket.createdAt}</td>
              <td className={`priority-${ticket.priority.toLowerCase()}`}>{ticket.priority}</td>
              <td>{ticket.status}</td>
            </tr>
          ))}
          {/* Empty rows to match the design */}
          {Array(5 - filteredTickets.length)
            .fill()
            .map((_, index) => (
              <tr
                key={`empty-${index}`}
                className={`empty-row ${(index + filteredTickets.length) % 2 === 0 ? "" : "alternate-row"}`}
              >
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

export default ServTickTable

