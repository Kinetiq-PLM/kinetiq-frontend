"use client"

const Table = ({ analyses, onRowClick, onViewAnalysis, selectedAnalysis }) => {
  return (
    <div className="table-container">
        <table className="analyses-table">
          <thead>
            <tr>
              <th>Analysis ID</th>
              <th>Request ID</th>
              <th>Technician Name</th>
              <th>Analysis Date</th>
              <th>Analysis Status</th>
              <th>Analysis Description</th>
              <th>Labor Cost</th>
            </tr>
          </thead>
          <tbody>
            {analyses.length > 0 ? (
              analyses.map((analysis, index) => (
                <tr 
                  key={analysis.analysis_id || `analysis-${index}`}
                  className={`${
                    selectedAnalysis?.analysis_id === analysis.analysis_id ? "selected-row" : ""
                  } ${index % 2 !== 0 ? "alternate-row" : ""}`}
                  onClick={() => onRowClick(analysis)}
                  style={{ cursor: "pointer" }} 
                >
                      <td>{analysis.analysis_id}</td>
                      <td>{analysis.service_request?.service_request_id || "None"}</td>
                      <td>{analysis.technician ? `${analysis.technician.first_name || ""} ${analysis.technician.last_name || ""}`.trim() : "Unknown"}</td>
                      <td>{analysis.analysis_date || "Null"}</td>
                      <td>{analysis.analysis_status}</td>
                      <td>
                        <button className="view-button" onClick={() => onViewAnalysis(analysis)}>
                          View
                        </button>
                      </td>
                      <td>{analysis.labor_cost || "None"}</td>
                </tr>
              ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: "1rem" }}>
                    No analyses available
                  </td>
                </tr>
              )}
          </tbody>
        </table>
      </div>
  )
}

export default Table

