import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiSearch } from "react-icons/fi";
import "./styles/WorkforceRequest.css";

const WorkforceRequest = () => {
  // States for form data
  const [formData, setFormData] = useState({
    requesting_dept_id: "",
    required_skills: "",
    task_description: "",
    start_date: "",
    end_date: "",
  });

  // States for list view and shared functionality 
  const [requests, setRequests] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [activeTab, setActiveTab] = useState("form");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sortField, setSortField] = useState("all");
  const [toast, setToast] = useState(null);

  // Toast notification helper
  const showToast = (message, success = true) => {
    setToast({ message, success });
    setTimeout(() => setToast(null), 3000);
  };

  // Fetch departments for dropdown
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/departments/");
        setDepartments(response.data.filter(dept => !dept.is_archived));
      } catch (err) {
        console.error("Error fetching departments:", err);
        showToast("Failed to load departments", false);
      }
    };

    const fetchRequests = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/workforce_requests/");
        setRequests(response.data);
      } catch (err) {
        console.error("Error fetching requests:", err);
        showToast("Failed to load requests", false);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
    fetchRequests();
  }, []);

  // Form handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await axios.post("http://127.0.0.1:8000/api/workforce_requests/", formData);
      showToast("Request submitted successfully");
      setFormData({
        requesting_dept_id: "",
        required_skills: "",
        task_description: "",
        start_date: "",
        end_date: "",
      });
      setActiveTab("list");
    } catch (err) {
      console.error("Submit error:", err);
      showToast("Failed to submit request", false);
    }
  };

  const handleCancel = () => {
    setFormData({
      requesting_dept_id: "",
      required_skills: "",
      task_description: "",
      start_date: "",
      end_date: "",
    });
  };

  // List filtering and pagination
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

    const start = (currentPage - 1) * itemsPerPage;
    const paginated = filtered.slice(start, start + itemsPerPage);
    const totalPages = Math.ceil(filtered.length / itemsPerPage);

    return { paginated, totalPages };
  };

  // Render request list
  const renderRequestList = () => {
    if (loading) return <div className="request-no-results">Loading requests...</div>;

    const { paginated, totalPages } = filterAndPaginate(requests);
    if (!paginated.length) return <div className="request-no-results">No requests found.</div>;

    return (
      <>
        <div className="request-table-wrapper">
          <div className="request-table-scrollable">
            <table className="request-table">
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Department</th>
                  <th>Required Skills</th>
                  <th>Task Description</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map(request => (
                  <tr key={request.request_id}>
                    <td>{request.request_id}</td>
                    <td>{request.requesting_dept_id}</td>
                    <td>{request.required_skills}</td>
                    <td>{request.task_description}</td>
                    <td>{request.start_date}</td>
                    <td>{request.end_date}</td>
                    <td>
                      <span className={`hr-tag ${request.status?.toLowerCase()}`}>
                        {request.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="request-pagination">
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
            className="request-pagination-size"
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
      </>
    );
  };

  return (
    <div className="request-workforce-request">
      <div className="request-workforce-request-body-content-container">
        <div className="request-workforce-request-scrollable">
          <div className="request-workforce-request-heading">
            <h2><strong>Workforce Request</strong></h2>
          </div>

          <div className="request-workforce-request-header">
            <div className="request-workforce-request-tabs">
              <button
                className={activeTab === "form" ? "active" : ""}
                onClick={() => setActiveTab("form")}
              >
                Workforce Request Form
              </button>
              <button
                className={activeTab === "list" ? "active" : ""}
                onClick={() => setActiveTab("list")}
              >
                Workforce Request List
              </button>
            </div>
          </div>

          {activeTab === "form" ? (
            <div className="request-workforce-request-form-container">
              <form onSubmit={handleSubmit} className="request-workforce-request-form">
                {/* Left Column */}
                <div className="left-column">
                  <div className="form-group">
                    <label>Requesting Department</label>
                    <select
                      name="requesting_dept_id"
                      value={formData.requesting_dept_id}
                      onChange={handleChange}
                      required
                    >
                      <option value="">-- Select Department --</option>
                      {departments.map(dept => (
                        <option key={dept.dept_id} value={dept.dept_id}>
                          {dept.dept_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Start Date</label>
                    <input
                      type="date"
                      name="start_date"
                      value={formData.start_date}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>End Date</label>
                    <input
                      type="date"
                      name="end_date"
                      value={formData.end_date}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="right-column">
                  <div className="form-group required-skills">
                    <label>Required Skills</label>
                    <textarea
                      name="required_skills"
                      value={formData.required_skills}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group task-description">
                    <label>Task Description</label>
                    <textarea
                      name="task_description"
                      value={formData.task_description}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="request-workforce-request-form-buttons">
                    <button type="button" onClick={handleCancel} className="cancel-btn">
                      Cancel
                    </button>
                    <button type="submit" className="submit-btn">
                      Save
                    </button>
                  </div>
                </div>
              </form>
            </div>
          ) : (
            <div className="request-workforce-request-list-container">
              <div className="request-workforce-request-controls">
                <div className="request-workforce-request-search-wrapper">
                  <FiSearch className="request-workforce-request-search-icon" />
                  <input
                    type="text"
                    className="request-workforce-request-search"
                    placeholder="Search..."
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </div>
                <select
                  className="request-workforce-request-filter"
                  value={sortField}
                  onChange={(e) => setSortField(e.target.value)}
                >
                  <option value="all">No Sorting</option>
                  <option value="request_id">Sort by Request ID</option>
                  <option value="requesting_dept_id">Sort by Department</option>
                  <option value="start_date">Sort by Start Date</option>
                </select>
              </div>
              {renderRequestList()}
            </div>
          )}
        </div>
      </div>

      {toast && (
        <div
          className="request-workforce-request-toast"
          style={{ backgroundColor: toast.success ? "#4CAF50" : "#F44336" }}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default WorkforceRequest;