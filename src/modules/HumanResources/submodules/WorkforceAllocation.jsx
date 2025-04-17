import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiSearch } from "react-icons/fi";
import "../styles/WorkforceAllocation.css";

const WorkforceAllocation = () => {
  // States for data
  const [allocations, setAllocations] = useState([]);
  const [archivedAllocations, setArchivedAllocations] = useState([]);
  const [availabilityData, setAvailabilityData] = useState([]);

  // UI States
  const [activeTab, setActiveTab] = useState("Allocation");
  const [showArchived, setShowArchived] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sortField, setSortField] = useState("all");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAllocation, setEditingAllocation] = useState(null);

  // Toast helper
  const showToast = (message, success = true) => {
    setToast({ message, success });
    setTimeout(() => setToast(null), 3000);
  };

  // Fetch data
  const fetchAllocations = async () => {
    setLoading(true);
    try {
      const [activeRes, archivedRes] = await Promise.all([
        axios.get("http://127.0.0.1:8000/api/workforce_allocation/"),
        axios.get("http://127.0.0.1:8000/api/workforce_allocation/archived/")
      ]);
      setAllocations(activeRes.data);
      setArchivedAllocations(archivedRes.data);
    } catch (err) {
      console.error("Fetch error:", err);
      showToast("Failed to fetch allocations", false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllocations();
  }, []);

  // Search and filter logic
  const filterAndPaginate = (dataArray) => {
    const filtered = dataArray.filter(item =>
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

  // CRUD operations
  const handleArchive = async (id) => {
    try {
      await axios.post(`http://127.0.0.1:8000/api/workforce_allocation/${id}/archive/`);
      showToast("Allocation archived successfully");
      fetchAllocations();
    } catch (err) {
      console.error("Archive error:", err);
      showToast("Failed to archive allocation", false);
    }
  };

  const handleUnarchive = async (id) => {
    try {
      await axios.post(`http://127.0.0.1:8000/api/workforce_allocation/${id}/unarchive/`);
      showToast("Allocation unarchived successfully");
      fetchAllocations();
    } catch (err) {
      console.error("Unarchive error:", err);
      showToast("Failed to unarchive allocation", false);
    }
  };

  // Render table
  const renderTable = () => {
    const data = showArchived ? archivedAllocations : allocations;
    const { paginated, totalPages } = filterAndPaginate(data);

    if (loading) return <div className="hr-no-results">Loading allocations...</div>;
    if (!paginated.length) return <div className="hr-no-results">No allocations found.</div>;

    return (
      <div className="hr-department-table-wrapper">
        <div className="hr-department-table-scrollable">
          <table className="hr-department-table">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Allocation ID</th>
                <th>Requesting Dept</th>
                <th>Current Dept</th>
                <th>Reason</th>
                <th>Approval Status</th>
                <th>Status</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Approval Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((allocation, index) => (
                <tr key={allocation.id}>
                  <td>{allocation.empId}</td>
                  <td>{allocation.allocationId}</td>
                  <td>{allocation.requestDeptId}</td>
                  <td>{allocation.currentDeptId}</td>
                  <td>{allocation.reason}</td>
                  <td>
                    <span className={`hr-tag ${allocation.approvalStatus.toLowerCase()}`}>
                      {allocation.approvalStatus}
                    </span>
                  </td>
                  <td>
                    <span className={`hr-tag ${allocation.status.toLowerCase()}`}>
                      {allocation.status}
                    </span>
                  </td>
                  <td>{allocation.startDate}</td>
                  <td>{allocation.endDate}</td>
                  <td>{allocation.approvalDate}</td>
                  <td className="hr-department-actions">
                    <button onClick={() => handleArchive(allocation.id)}>Archive</button>
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

  return (
    <div className="hr-department">
      <div className="hr-department-body-content-container">
        <div className="hr-department-scrollable">
          <div className="hr-department-heading">
            <h2><strong>Workforce Allocation</strong></h2>
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
              <button className="hr-department-add-btn">+ Add Allocation</button>
              <button
                className="hr-department-add-btn"
                onClick={() => setShowArchived(!showArchived)}
              >
                {showArchived ? "View Active" : "View Archived"}
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="hr-employee-header">
            <div className="hr-employee-tabs">
              <button
                className={activeTab === "Allocation" ? "active" : ""}
                onClick={() => {
                  setActiveTab("Allocation");
                  setShowArchived(false);
                  setCurrentPage(1);
                }}
              >
                Allocation <span className="hr-employee-count">{allocations.length}</span>
              </button>
              <button
                className={activeTab === "Availability" ? "active" : ""}
                onClick={() => {
                  setActiveTab("Availability");
                  setShowArchived(false);
                  setCurrentPage(1);
                }}
              >
                Employee Availability <span className="hr-employee-count">{availabilityData.length}</span>
              </button>
            </div>
          </div>

          {/* Render Table */}
          {renderTable()}
        </div>

        {/* Toast Notification */}
        {toast && (
          <div
            className="hr-department-toast"
            style={{ backgroundColor: toast.success ? "#4CAF50" : "#F44336" }}
          >
            {toast.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkforceAllocation;
