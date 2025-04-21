import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiSearch } from "react-icons/fi";
import "../styles/Recruitment.css";

const Recruitment = () => {
  const [candidates, setCandidates] = useState([]);
  const [archivedCandidates, setArchivedCandidates] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [archivedInterviews, setArchivedInterviews] = useState([]);
  const [jobPostings, setJobPostings] = useState([]);
  const [archivedJobPostings, setArchivedJobPostings] = useState([]);
  const [activeTab, setActiveTab] = useState("Candidates");
  const [showArchived, setShowArchived] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sortField, setSortField] = useState("all");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [dotsMenuOpen, setDotsMenuOpen] = useState(null);

  useEffect(() => {
    const fetchRecruitmentData = async () => {
      setLoading(true);
      try {
        const [activeCandidates, archivedCandidatesRes] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/candidates/"),
          axios.get("http://127.0.0.1:8000/api/candidates/archived/"),
        ]);
        setCandidates(activeCandidates.data);
        setArchivedCandidates(archivedCandidatesRes.data);
        // ...fetch interviews and job postings similarly...
      } catch (err) {
        console.error("Error fetching recruitment data:", err);
        showToast("Failed to fetch recruitment data", false);
      } finally {
        setLoading(false);
      }
    };
    fetchRecruitmentData();
  }, []);

  const showToast = (message, success = true) => {
    setToast({ message, success });
    setTimeout(() => setToast(null), 3000);
  };

  const filterAndPaginate = (data) => {
    const filtered = data.filter((item) =>
      Object.values(item).some((val) =>
        val?.toString().toLowerCase().includes(searchTerm)
      )
    );
    if (sortField !== "all") {
      filtered.sort((a, b) => {
        const valA = a[sortField]?.toString().toLowerCase() || "";
        const valB = b[sortField]?.toString().toLowerCase() || "";
        return valA.localeCompare(valB);
      });
    }
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginated = filtered.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    return { paginated, totalPages };
  };

  const renderCandidatesTable = (data, isArchived = false) => {
    const { paginated, totalPages } = filterAndPaginate(data);
    if (loading) return <div className="hr-no-results">Loading candidates...</div>;
    if (!paginated.length) return <div className="hr-no-results">No candidates found.</div>;
    return (
      <div className="hr-department-table-wrapper">
        <div className="hr-department-table-scrollable">
          <table className="hr-department-table">
            <thead>
              <tr>
                {isArchived && <th>Select</th>}
                <th>ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Applied Position</th>
                <th>Applied Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((candidate, index) => (
                <tr key={candidate.id} className={isArchived ? "hr-archived-row" : ""}>
                  {isArchived && (
                    <td>
                      <input type="checkbox" />
                    </td>
                  )}
                  <td>{candidate.id}</td>
                  <td>{candidate.first_name}</td>
                  <td>{candidate.last_name}</td>
                  <td>{candidate.email}</td>
                  <td>{candidate.phone}</td>
                  <td>
                    <span className={`hr-tag ${candidate.status.toLowerCase()}`}>
                      {candidate.status}
                    </span>
                  </td>
                  <td>{candidate.applied_position}</td>
                  <td>{candidate.applied_date}</td>
                  <td className="hr-department-actions">
                    <div
                      className="hr-department-dots"
                      onClick={() => setDotsMenuOpen(dotsMenuOpen === index ? null : index)}
                    >
                      ⋮
                      {dotsMenuOpen === index && (
                        <div className="hr-department-dropdown">
                          <div className="hr-department-dropdown-item">Edit</div>
                          <div className="hr-department-dropdown-item">Archive</div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="hr-pagination">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={i + 1 === currentPage ? "active" : ""}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <select
            className="hr-pagination-size"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(parseInt(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>
      </div>
    );
  };

  const renderInterviewsTable = (data, isArchived = false) => {
    // Placeholder for rendering interviews table
    return <div>Interviews Table</div>;
  };

  const renderJobPostingsTable = (data, isArchived = false) => {
    // Placeholder for rendering job postings table
    return <div>Job Postings Table</div>;
  };

  return (
    <div className="hr-department">
      <div className="hr-department-body-content-container">
        <div className="hr-department-scrollable">
          <div className="hr-department-heading">
            <h2><strong>Recruitment</strong></h2>
            <div className="hr-department-right-controls">
              <div className="hr-department-search-wrapper">
                <FiSearch className="hr-department-search-icon" />
                <input
                  type="text"
                  className="hr-department-search"
                  placeholder="Search..."
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="hr-department-filter"
                value={sortField}
                onChange={(e) => setSortField(e.target.value)}
              >
                <option value="all">No Sorting</option>
                <option value="id">Sort by ID</option>
                <option value="status">Sort by Status</option>
              </select>
              <button className="hr-department-add-btn">+ Add</button>
              <button
                className="hr-department-add-btn"
                onClick={() => setShowArchived(!showArchived)}
              >
                {showArchived ? "View Active" : "View Archived"}
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="hr-employee-header">
            <div className="hr-employee-tabs">
              <button
                className={activeTab === "Candidates" ? "active" : ""}
                onClick={() => {
                  setActiveTab("Candidates");
                  setShowArchived(false);
                  setCurrentPage(1);
                }}
              >
                Candidates <span className="hr-employee-count">{candidates.length}</span>
              </button>
              <button
                className={activeTab === "Interviews" ? "active" : ""}
                onClick={() => {
                  setActiveTab("Interviews");
                  setShowArchived(false);
                  setCurrentPage(1);
                }}
              >
                Interviews <span className="hr-employee-count">{interviews.length}</span>
              </button>
              <button
                className={activeTab === "Job Postings" ? "active" : ""}
                onClick={() => {
                  setActiveTab("Job Postings");
                  setShowArchived(false);
                  setCurrentPage(1);
                }}
              >
                Job Postings <span className="hr-employee-count">{jobPostings.length}</span>
              </button>
            </div>
          </div>

          {/* Render content based on active tab */}
          <div className="hr-department-table-container">
            {activeTab === "Candidates" && renderCandidatesTable(showArchived ? archivedCandidates : candidates)}
            {activeTab === "Interviews" && renderInterviewsTable(showArchived ? archivedInterviews : interviews)}
            {activeTab === "Job Postings" && renderJobPostingsTable(showArchived ? archivedJobPostings : jobPostings)}
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className="hr-department-toast"
          style={{ backgroundColor: toast.success ? "#4CAF50" : "#F44336" }}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default Recruitment;
