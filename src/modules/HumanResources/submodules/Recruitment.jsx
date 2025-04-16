import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiSearch } from "react-icons/fi";
import "../styles/Recruitment.css";

const Recruitment = () => {
  // Data states for each section
  const [candidates, setCandidates] = useState([]);
  const [archivedCandidates, setArchivedCandidates] = useState([]);
  const [jobPostings, setJobPostings] = useState([]);
  const [archivedJobPostings, setArchivedJobPostings] = useState([]);
  const [resignations, setResignations] = useState([]);

  // UI States
  const [activeTab, setActiveTab] = useState("Candidates");
  const [showArchived, setShowArchived] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sortField, setSortField] = useState("all");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [dotsMenuOpen, setDotsMenuOpen] = useState(null);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [candidatesRes, archivedCandidatesRes] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/candidates/candidates/"),
          axios.get("http://127.0.0.1:8000/api/candidates/candidates/archived/")
        ]);

        const [jobPostingsRes, archivedJobPostingsRes] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/job_posting/job_postings/"),
          axios.get("http://127.0.0.1:8000/api/job_posting/job_postings/archived/")
        ]);

        const resignationsRes = await axios.get("http://127.0.0.1:8000/api/resignation/resignations/");

        setCandidates(candidatesRes.data);
        setArchivedCandidates(archivedCandidatesRes.data);
        setJobPostings(jobPostingsRes.data);
        setArchivedJobPostings(archivedJobPostingsRes.data);
        setResignations(resignationsRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        showToast("Failed to fetch data", false);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Utility functions
  const showToast = (message, success = true) => {
    setToast({ message, success });
    setTimeout(() => setToast(null), 3000);
  };

  const filterAndPaginate = (data) => {
    const filtered = data.filter(item =>
      Object.values(item).some(val =>
        val?.toString().toLowerCase().includes(searchTerm.toLowerCase())
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

  // Render functions for each table
  const renderJobPostingsTable = (data, isArchived = false) => {
    const { paginated, totalPages } = filterAndPaginate(data);
    
    if (loading) return <div className="recruitment-no-results">Loading job postings...</div>;
    if (!paginated.length) return <div className="recruitment-no-results">No job postings found.</div>;

    return (
      <div className="recruitment-table-wrapper">
        <div className="recruitment-table-scrollable">
          <table className="recruitment-table">
            <thead>
              <tr>
                {isArchived && <th>Select</th>}
                <th>Job ID</th>
                <th>Department</th>
                <th>Position</th>
                <th>Description</th>
                <th>Requirements</th>
                <th>Employment Type</th>
                <th>Base Salary</th>
                <th>Daily Rate</th>
                <th>Duration (Days)</th>
                <th>Finance Approval</th>
                <th>Posting Status</th>
                <th>Created At</th>
                <th>Updated At</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
                      {paginated.map((posting, index) => (
                    <tr key={posting.job_id} className={isArchived ? "recruitment-archived-row" : ""}>
                      {isArchived && (
                        <td>
                          <input type="checkbox" />
                        </td>
                      )}
                      <td>{posting.job_id}</td>
                      <td>{posting.dept_id}</td>
                      <td>{posting.position_title}</td>
                      <td>{posting.description}</td>
                      <td>{posting.requirements}</td>
                      <td>{posting.employment_type}</td>
                      <td>{posting.base_salary}</td>
                      <td>{posting.daily_rate}</td>
                      <td>{posting.duration_days}</td>
                      <td>{posting.finance_approval_status}</td>
                      <td>
                        <span className={`recruitment-tag ${posting.posting_status.toLowerCase()}`}>
                          {posting.posting_status}
                        </span>
                      </td>
                      <td>{posting.created_at}</td>
                      <td>{posting.updated_at}</td>
                      <td className="recruitment-actions">
                        <div
                          className="recruitment-dots"
                          onClick={() => setDotsMenuOpen(dotsMenuOpen === index ? null : index)}
                        >
                          ⋮
                          {dotsMenuOpen === index && (
                            <div className="recruitment-dropdown">
                              <div className="recruitment-dropdown-item">Edit</div>
                              <div className="recruitment-dropdown-item">
                                {isArchived ? "Restore" : "Archive"}
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
        {renderPagination(totalPages)}
      </div>
    );
  };

  const renderCandidatesTable = (data, isArchived = false) => {
    const { paginated, totalPages } = filterAndPaginate(data);
    if (loading) return <div className="recruitment-no-results">Loading candidates...</div>;
    if (!paginated.length) return <div className="recruitment-no-results">No candidates found.</div>;
    return (
      <div className="recruitment-table-wrapper">
        <div className="recruitment-table-scrollable">
          <table className="recruitment-table">
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
                <tr key={candidate.id} className={isArchived ? "recruitment-archived-row" : ""}>
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
                    <span className={`recruitment-tag ${candidate.status.toLowerCase()}`}>
                      {candidate.status}
                    </span>
                  </td>
                  <td>{candidate.applied_position}</td>
                  <td>{candidate.applied_date}</td>
                  <td className="recruitment-actions">
                    <div
                      className="recruitment-dots"
                      onClick={() => setDotsMenuOpen(dotsMenuOpen === index ? null : index)}
                    >
                      ⋮
                      {dotsMenuOpen === index && (
                        <div className="recruitment-dropdown">
                          <div className="recruitment-dropdown-item">Edit</div>
                          <div className="recruitment-dropdown-item">Archive</div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {renderPagination(totalPages)}
      </div>
    );
  };

  const renderResignationsTable = (data) => {
    const { paginated, totalPages } = filterAndPaginate(data);
    if (loading) return <div className="recruitment-no-results">Loading resignations...</div>;
    if (!paginated.length) return <div className="recruitment-no-results">No resignations found.</div>;
    return (
      <div className="recruitment-table-wrapper">
        <div className="recruitment-table-scrollable">
          <table className="recruitment-table">
            <thead>
              <tr>
                <th>Resignation ID</th>
                <th>Employee Name</th>
                <th>Department</th>
                <th>Reason</th>
                <th>Resignation Date</th>
                <th>Notice Period</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((resignation, index) => (
                <tr key={resignation.resignation_id}>
                  <td>{resignation.resignation_id}</td>
                  <td>{resignation.employee_name}</td>
                  <td>{resignation.department}</td>
                  <td>{resignation.reason}</td>
                  <td>{resignation.resignation_date}</td>
                  <td>{resignation.notice_period}</td>
                  <td>
                    <span className={`recruitment-tag ${resignation.status.toLowerCase()}`}>
                      {resignation.status}
                    </span>
                  </td>
                  <td className="recruitment-actions">
                    <div
                      className="recruitment-dots"
                      onClick={() => setDotsMenuOpen(dotsMenuOpen === index ? null : index)}
                    >
                      ⋮
                      {dotsMenuOpen === index && (
                        <div className="recruitment-dropdown">
                          <div className="recruitment-dropdown-item">View</div>
                          <div className="recruitment-dropdown-item">Archive</div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {renderPagination(totalPages)}
      </div>
    );
  };

  const renderPagination = (totalPages) => (
    <div className="recruitment-pagination">
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
        className="recruitment-pagination-size"
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
  );

  return (
    <div className="recruitment">
      <div className="recruitment-body-content-container">
        <div className="recruitment-scrollable">
          <div className="recruitment-heading">
            <h2><strong>Recruitment</strong></h2>
            <div className="recruitment-right-controls">
              <div className="recruitment-search-wrapper">
                <FiSearch className="recruitment-search-icon" />
                <input
                  type="text"
                  className="recruitment-search"
                  placeholder="Search..."
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="recruitment-filter"
                value={sortField}
                onChange={(e) => setSortField(e.target.value)}
              >
                <option value="all">No Sorting</option>
                <option value="id">Sort by ID</option>
                <option value="status">Sort by Status</option>
              </select>
              <button className="recruitment-add-btn">+ Add</button>
              <button
                className="recruitment-add-btn"
                onClick={() => setShowArchived(!showArchived)}
              >
                {showArchived ? "View Active" : "View Archived"}
              </button>
            </div>
          </div>

          <div className="recruitment-header">
            <div className="recruitment-tabs">
              <button
                className={activeTab === "Candidates" ? "active" : ""}
                onClick={() => {
                  setActiveTab("Candidates");
                  setShowArchived(false);
                  setCurrentPage(1);
                }}
              >
                Candidates <span className="recruitment-count">{candidates.length}</span>
              </button>
              <button
                className={activeTab === "Job Postings" ? "active" : ""}
                onClick={() => {
                  setActiveTab("Job Postings");
                  setShowArchived(false);
                  setCurrentPage(1);
                }}
              >
                Job Postings <span className="recruitment-count">{jobPostings.length}</span>
              </button>
              <button
                className={activeTab === "Resignations" ? "active" : ""}
                onClick={() => {
                  setActiveTab("Resignations");
                  setShowArchived(false);
                  setCurrentPage(1);
                }}
              >
                Resignations <span className="recruitment-count">{resignations.length}</span>
              </button>
            </div>
          </div>

          <div className="recruitment-table-container">
            {activeTab === "Candidates" && renderCandidatesTable(showArchived ? archivedCandidates : candidates, showArchived)}
            {activeTab === "Job Postings" && renderJobPostingsTable(showArchived ? archivedJobPostings : jobPostings, showArchived)}
            {activeTab === "Resignations" && renderResignationsTable(resignations)}
          </div>
        </div>
      </div>

      {toast && (
        <div 
          className="recruitment-toast"
          style={{ backgroundColor: toast.success ? "#4CAF50" : "#F44336" }}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default Recruitment;
