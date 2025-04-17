import React, { useState } from "react";
import "../styles/ManagementRecruitmentCandidates.css";

const RecruitmentCandidates = () => {
  const [filter, setFilter] = useState("All");

  const candidatesData = [
      { id: "R001", name: "Alice Smith", role: "Software Engineer", dept: "IT", date: "05-04-2025", status: "Shortlisted" },
      { id: "R002", name: "Bob Johnson", role: "Data Analyst", dept: "Finance", date: "10-04-2025", status: "Pending" },
      { id: "R003", name: "Charlie Brown", role: "HR Manager", dept: "Human Resources", date: "15-04-2025", status: "Rejected" },
      { id: "R004", name: "David Wilson", role: "Project Manager", dept: "Operations", date: "20-04-2025", status: "Shortlisted" },
      { id: "R005", name: "Eve Adams", role: "Marketing Lead", dept: "Marketing", date: "25-04-2025", status: "Pending" },
  ];

  const filteredCandidates = filter === "All" ? candidatesData : candidatesData.filter(c => c.status === filter);

  return (
      <div className="recruitment-container">
          <h2 className="title">Recruitment Candidates</h2>

          <div className="card">
              {/* Filter Section */}
              <div className="filter-section">
                  <label className="filter-label">Filter by Status:</label>
                  <select
                      className="filter-dropdown"
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                  >
                      <option value="All">All Candidates</option>
                      <option value="Shortlisted">Shortlisted</option>
                      <option value="Pending">Pending</option>
                      <option value="Rejected">Rejected</option>
                  </select>
              </div>

              {/* Scrollable Table */}
              <div className="table-container">
                  <table>
                      <thead>
                          <tr>
                              <th>Candidate ID</th>
                              <th>Full Name</th>
                              <th>Job Role</th>
                              <th>Department</th>
                              <th>Interview Date</th>
                              <th>Interview Score</th>
                              <th>Status</th>
                              <th>Remarks</th>
                          </tr>
                      </thead>
                      <tbody>
                          {filteredCandidates.map((candidate) => (
                              <tr key={candidate.id}>
                                  <td>{candidate.id}</td>
                                  <td>{candidate.name}</td>
                                  <td>{candidate.role}</td>
                                  <td>{candidate.dept}</td>
                                  <td>{candidate.date}</td>
                                  <td className="placeholder">-</td>
                                  <td>
                                      <select className={`status-dropdown ${candidate.status.toLowerCase()}`}>
                                          <option value="Shortlisted">Shortlisted</option>
                                          <option value="Pending">Pending</option>
                                          <option value="Rejected">Rejected</option>
                                      </select>
                                  </td>
                                  <td className="placeholder">-</td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>

              {/* Action Button */}
              <div className="actions">
                  <button className="btn-back">Back</button>
              </div>
          </div>
      </div>
  );
};

export default RecruitmentCandidates;