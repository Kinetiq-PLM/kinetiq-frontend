const ServTickTable = ({ filteredTickets, onRowClick, selectedTicket }) => {
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
            <tr 
              key={ticket.ticket_id || `ticket-${index}`} 
              className={`${
                selectedTicket?.ticket_id === ticket.ticket_id ? "selected-row" : ""
              } ${index % 2 !== 0 ? "alternate-row" : ""}`}
              onClick={() => onRowClick(ticket)} // makes table row clickable, function update the state fields
              style={{ cursor: "pointer" }} 
            >
              <td>{ticket.ticket_id}</td>
              <td>{ticket.customer ? ticket.customer.name : "Unknown"}</td>
              <td>{new Date(ticket.created_at).toISOString().split("T")[0]}</td>
              <td className={`priority-${ticket.priority.toLowerCase()}`}>{ticket.priority}</td>
              <td>{ticket.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ServTickTable;
