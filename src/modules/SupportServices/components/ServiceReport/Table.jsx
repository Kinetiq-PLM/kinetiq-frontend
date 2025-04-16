const Table = ({ reports, onRowClick, selectedReport }) => {
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
          {reports.length > 0 ? (
            reports.map((report, index) => (
              <tr
                key={report.report_id || `report-${index}`}
                className={`${
                  selectedReport?.report_id === report.report_id ? "selected-row" : ""
                } ${index % 2 !== 0 ? "alternate-row" : ""}`}
                onClick={() => onRowClick(report)}
                style={{ cursor: "pointer" }} 
              >
                <td>{report.report_id}</td>
                <td>{report.service_ticket?.ticket_id || "Null"}</td>
                <td>{report.service_request?.service_request_id || "Null"}</td>
                <td>{report.service_call?.service_call_id || "Null"}</td>
                <td>{report.technician ? `${report.technician.first_name || ""} ${report.technician.last_name || ""}`.trim() : "Unknown"}</td>
                <td>{report.submission_date || "Null"}</td>
                <td>{report.report_status}</td>    
              </tr>
            ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: "1rem" }}>
                  No reports available
                </td>
              </tr>
            )}
        </tbody>
      </table>
    </div>
  )
}

export default Table

