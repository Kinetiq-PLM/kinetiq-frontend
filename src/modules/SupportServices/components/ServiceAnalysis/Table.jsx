"use client"

const Table = ({ analyses, onViewAnalysis }) => {
  return (
    <div className="table-container">
      <div style={{ overflowX: "auto" }}>
        <table className="analyses-table">
          <thead>
            <tr>
              <th>Analysis ID</th>
              <th>Request ID</th>
              <th>Technician ID</th>
              <th>Analysis Date</th>
              <th>Analysis Status</th>
              <th>Analysis Description</th>
              <th>Labor Cost</th>
            </tr>
          </thead>
          <tbody>
            {analyses.map((analysis) => (
              <tr key={analysis.id}>
                <td>{analysis.id}</td>
                <td>{analysis.requestId}</td>
                <td>{analysis.technicianId}</td>
                <td>{analysis.analysisDate}</td>
                <td>{analysis.status}</td>
                <td>
                  <button className="view-button" onClick={() => onViewAnalysis(analysis)}>
                    View
                  </button>
                </td>
                <td>{analysis.laborCost}</td>
              </tr>
            ))}
            {/* Empty rows to match the design */}
            {Array(5 - analyses.length)
              .fill()
              .map((_, index) => (
                <tr key={`empty-${index}`} className="empty-row">
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
    </div>
  )
}

export default Table

