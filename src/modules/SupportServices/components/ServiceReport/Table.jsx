const Table = ({ reports }) => {
  // Ensure we have at least 5 rows for the table
  const filledReports = [...reports]
  while (filledReports.length < 5) {
    filledReports.push({ empty: true })
  }

  return (
    <div className="table-container">
      <table className="reports-table">
        <thead>
          <tr>
            <th>Report ID</th>
            <th>Ticket ID</th>
            <th>Request ID</th>
            <th>Call ID</th>
            <th>Technician Name</th>
            <th>Submission Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filledReports.map((report, index) => (
            <tr
              key={report.empty ? `empty-${index}` : report.reportId}
              className={index % 2 === 0 ? "" : "alternate-row"}
            >
              {!report.empty ? (
                <>
                  <td>{report.reportId}</td>
                  <td>{report.ticketId}</td>
                  <td>{report.requestId}</td>
                  <td>{report.callId}</td>
                  <td>{report.technicianName}</td>
                  <td>{report.submissionDate}</td>
                  <td>{report.status}</td>
                </>
              ) : (
                <>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Table

