const Table = ({ reports, onRowClick }) => {
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
              key={report.report_id || `report-${index}`}
              className={index % 2 === 0 ? "" : "alternate-row"}
              onClick={() => onRowClick(report)} // makes table row clickable, function update the state fields
              style={{ cursor: "pointer" }} 
            >
              {!report.empty ? (
                <>
                  <td>{report.report_id}</td>
                  <td>{report.service_ticket?.ticket_id || "Null"}</td>
                  <td>{report.service_request?.service_request_id || "Null"}</td>
                  <td>{report.service_call?.service_call_id || "Null"}</td>
                  <td>{report.technician ? `${report.technician.first_name || ""} ${report.technician.last_name || ""}`.trim() : "Unknown"}</td>
                  <td>{report.submission_date || "Null"}</td>
                  <td>{report.report_status}</td>
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

