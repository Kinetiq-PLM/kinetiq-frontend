import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiSearch } from "react-icons/fi";
import "../styles/WorkforceAllocation.css";

const WorkforceAllocation = () => {
  // States for data
  const [allocations, setAllocations] = useState([]);
  const [archivedAllocations, setArchivedAllocations] = useState([]);

  // UI States
  const [showArchived, setShowArchived] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sortField, setSortField] = useState("all");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [dotsMenuOpen, setDotsMenuOpen] = useState(null);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAllocation, setEditingAllocation] = useState(null);

  // New allocation state
  const [newAllocation, setNewAllocation] = useState({
    required_skills: "",
    task_description: "",
    requesting_dept_id: "",
    current_dept_id: "",
    hr_approver: "",
    status: "Draft",
    start_date: "",
    end_date: "",
    approval_status: "Pending",
    rejection_reason: ""
  });

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
        axios.get("http://127.0.0.1:8000/api/workforce_allocation/workforce_allocations/"),
        axios.get("http://127.0.0.1:8000/api/workforce_allocation/workforce_allocations/archived/")
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
      await axios.post(`http://127.0.0.1:8000/api/workforce_allocation/workforce_allocations/${id}/archive/`);
      showToast("Allocation archived successfully");
      fetchAllocations();
    } catch (err) {
      console.error("Archive error:", err);
      showToast("Failed to archive allocation", false);
    }
  };

  const handleUnarchive = async (id) => {
    try {
      await axios.post(`http://127.0.0.1:8000/api/workforce_allocation/workforce_allocations/${id}/unarchive/`);
      showToast("Allocation unarchived successfully");
      fetchAllocations();
    } catch (err) {
      console.error("Unarchive error:", err);
      showToast("Failed to unarchive allocation", false);
    }
  };

  const handleAddAllocationChange = (e) => {
    const { name, value } = e.target;
    setNewAllocation(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddAllocation = async (e) => {
    e.preventDefault();
    
    try {
      await axios.post("http://127.0.0.1:8000/api/workforce_allocation/workforce_allocations/", newAllocation);
      showToast("Allocation added successfully");
      setShowAddModal(false);
      fetchAllocations();
      
      // Reset form
      setNewAllocation({
        required_skills: "",
        task_description: "",
        requesting_dept_id: "",
        current_dept_id: "",
        hr_approver: "",
        status: "Draft",
        start_date: "",
        end_date: "",
        approval_status: "Pending",
        rejection_reason: ""
      });
    } catch (err) {
      console.error("Add allocation error:", err);
      showToast("Failed to add allocation", false);
    }
  };

  const handleEditAllocationChange = (e) => {
    const { name, value } = e.target;
    setEditingAllocation(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditAllocation = async (e) => {
    e.preventDefault();
    
    try {
      await axios.patch(
        `http://127.0.0.1:8000/api/workforce_allocation/workforce_allocations/${editingAllocation.allocation_id}/`, 
        {
          employee: editingAllocation.employee_id,
          hr_approver: editingAllocation.hr_approver,
          approval_status: editingAllocation.approval_status,
          status: editingAllocation.status,
          rejection_reason: editingAllocation.rejection_reason
        }
      );
      showToast("Allocation updated successfully");
      setShowEditModal(false);
      fetchAllocations();
    } catch (err) {
      console.error("Edit allocation error:", err);
      showToast("Failed to update allocation", false);
    }
  };

  // Render table
  const renderTable = () => {
    const data = showArchived ? archivedAllocations : allocations;
    const { paginated, totalPages } = filterAndPaginate(data);

    if (loading) return <div className="hr-no-results">Loading allocations...</div>;
    if (!paginated.length) return <div className="hr-no-results">No allocations found.</div>;

    return (
      <>
        <div className="workforceallocation-table-wrapper">
          <div className="workforceallocation-table-scrollable">
            <table className="workforceallocation-table">
              <thead>
                <tr>
                  <th>Allocation ID</th>
                  <th>Request ID</th>
                  <th>Requesting Dept ID</th>
                  <th>Current Dept ID</th>
                  <th>HR Approver</th>
                  <th>Employee ID</th>
                  <th>Employee Name</th>
                  <th>Required Skills</th>
                  <th>Task Description</th>
                  <th>Approval Status</th>
                  <th>Status</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Rejection Reason</th>
                  <th>Submitted At</th>
                  <th>Approved At</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((allocation, index) => (
                  <tr key={allocation.allocation_id || index}>
                    <td>{allocation.allocation_id}</td>
                    <td>{allocation.request_id}</td>
                    <td>{allocation.requesting_dept_id}</td>
                    <td>{allocation.current_dept_id}</td>
                    <td>{allocation.hr_approver}</td>
                    <td>{allocation.employee_id}</td>
                    <td>{allocation.employee_name}</td>
                    <td>{allocation.required_skills}</td>
                    <td>{allocation.task_description}</td>
                    <td>
                      <span className={`hr-tag ${allocation.approval_status?.toLowerCase() || 'pending'}`}>
                        {allocation.approval_status || 'Pending'}
                      </span>
                    </td>
                    <td>
                      <span className={`hr-tag ${allocation.status?.toLowerCase() || 'pending'}`}>
                        {allocation.status || 'Pending'}
                      </span>
                    </td>
                    <td>{allocation.start_date}</td>
                    <td>{allocation.end_date}</td>
                    <td>{allocation.rejection_reason}</td>
                    <td>{allocation.submitted_at}</td>
                    <td>{allocation.approved_at}</td>
                    <td className="workforceallocation-actions">
                      <div
                        className="workforceallocation-dots"
                        onClick={() => setDotsMenuOpen(dotsMenuOpen === allocation.allocation_id ? null : allocation.allocation_id)}
                      >
                        ⋮
                        {dotsMenuOpen === allocation.allocation_id && (
                          <div className="workforceallocation-dropdown">
                            <div 
                              className="workforceallocation-dropdown-item"
                              onClick={() => {
                                setEditingAllocation(allocation);
                                setShowEditModal(true);
                                setDotsMenuOpen(null);
                              }}
                            >
                              Edit
                            </div>
                            {!showArchived ? (
                              <div
                                className="workforceallocation-dropdown-item"
                                onClick={() => {
                                  handleArchive(allocation.allocation_id);
                                  setDotsMenuOpen(null);
                                }}
                              >
                                Archive
                              </div>
                            ) : (
                              <div
                                className="workforceallocation-dropdown-item"
                                onClick={() => {
                                  handleUnarchive(allocation.allocation_id);
                                  setDotsMenuOpen(null);
                                }}
                              >
                                Unarchive
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="workforceallocation-pagination">
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
            className="workforceallocation-pagination-size"
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
    <div className="workforceallocation">
      <div className="workforceallocation-body-content-container">
        <div className="workforceallocation-scrollable">
          <div className="workforceallocation-heading">
            <h2><strong>Workforce Allocation</strong></h2>
            <div className="workforceallocation-right-controls">
              <div className="workforceallocation-search-wrapper">
                <FiSearch className="workforceallocation-search-icon" />
                <input
                  type="text"
                  className="workforceallocation-search"
                  placeholder="Search..."
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {/* Sort dropdown */}
              <select
                className="workforceallocation-filter"
                value={sortField}
                onChange={(e) => setSortField(e.target.value)}
              >
                <option value="all">No Sorting</option>
                <option value="allocation_id">Sort by Allocation ID</option>
                <option value="request_id">Sort by Request ID</option>
                <option value="requesting_dept_id">Sort by Department</option>
                <option value="employee_name">Sort by Employee Name</option>
                <option value="approval_status">Sort by Approval Status</option>
                <option value="status">Sort by Status</option>
                <option value="start_date">Sort by Start Date</option>
                <option value="end_date">Sort by End Date</option>
              </select>
              
              <button className="workforceallocation-add-btn" onClick={() => setShowAddModal(true)}>
                + Add Allocation
              </button>
              <button
                className="workforceallocation-add-btn"
                onClick={() => setShowArchived(!showArchived)}
              >
                {showArchived ? "View Active" : "View Archived"}
              </button>
            </div>
          </div>

          {/* Render Table */}
          {renderTable()}
        </div>

        {/* Toast Notification */}
        {toast && (
          <div
            className="workforceallocation-toast"
            style={{ backgroundColor: toast.success ? "#4CAF50" : "#F44336" }}
          >
            {toast.message}
          </div>
        )}

        {/* Add Allocation Modal */}
        {showAddModal && (
          <div className="workforceallocation-modal-overlay">
            <div className="workforceallocation-modal">
              <h3>Add New Allocation</h3>
              <form onSubmit={handleAddAllocation} className="workforceallocation-modal-form">
                <div className="workforceallocation-form-two-columns">
                  <div className="form-column">
                    <div className="form-group">
                      <label>Requesting Department</label>
                      <input
                        type="text"
                        name="requesting_dept_id"
                        value={newAllocation.requesting_dept_id}
                        onChange={handleAddAllocationChange}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Current Department</label>
                      <input
                        type="text"
                        name="current_dept_id"
                        value={newAllocation.current_dept_id}
                        onChange={handleAddAllocationChange}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>HR Approver</label>
                      <input
                        type="text"
                        name="hr_approver"
                        value={newAllocation.hr_approver}
                        onChange={handleAddAllocationChange}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Status</label>
                      <select
                        name="status"
                        value={newAllocation.status}
                        onChange={handleAddAllocationChange}
                        required
                      >
                        <option value="Draft">Draft</option>
                        <option value="Active">Active</option>
                        <option value="Completed">Completed</option>
                        <option value="Canceled">Canceled</option>
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label>Approval Status</label>
                      <select
                        name="approval_status"
                        value={newAllocation.approval_status}
                        onChange={handleAddAllocationChange}
                        required
                      >
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Under Review">Under Review</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="form-column">
                    <div className="form-group">
                      <label>Start Date</label>
                      <input
                        type="date"
                        name="start_date"
                        value={newAllocation.start_date}
                        onChange={handleAddAllocationChange}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>End Date</label>
                      <input
                        type="date"
                        name="end_date"
                        value={newAllocation.end_date}
                        onChange={handleAddAllocationChange}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Rejection Reason</label>
                      <textarea
                        name="rejection_reason"
                        value={newAllocation.rejection_reason}
                        onChange={handleAddAllocationChange}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="form-group full-width">
                  <label>Required Skills</label>
                  <textarea
                    name="required_skills"
                    value={newAllocation.required_skills}
                    onChange={handleAddAllocationChange}
                    required
                  />
                </div>
                
                <div className="form-group full-width">
                  <label>Task Description</label>
                  <textarea
                    name="task_description"
                    value={newAllocation.task_description}
                    onChange={handleAddAllocationChange}
                    required
                  />
                </div>
                
                <div className="workforceallocation-modal-buttons">
                  <button type="submit" className="submit-btn">Add</button>
                  <button 
                    type="button" 
                    className="cancel-btn" 
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Allocation Modal */}
        {showEditModal && editingAllocation && (
          <div className="workforceallocation-modal-overlay">
            <div className="workforceallocation-modal">
              <h3>Edit Allocation</h3>
              <form onSubmit={handleEditAllocation} className="workforceallocation-modal-form">
                <div className="workforceallocation-form-two-columns">
                  <div className="form-column">
                    <div className="form-group">
                      <label>Allocation ID</label>
                      <input
                        type="text"
                        value={editingAllocation.allocation_id || ''}
                        disabled
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Employee ID</label>
                      <input
                        type="text"
                        name="employee_id"
                        value={editingAllocation.employee_id || ''}
                        onChange={handleEditAllocationChange}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>HR Approver</label>
                      <input
                        type="text"
                        name="hr_approver"
                        value={editingAllocation.hr_approver || ''}
                        onChange={handleEditAllocationChange}
                      />
                    </div>
                  </div>
                  
                  <div className="form-column">
                    <div className="form-group">
                      <label>Status</label>
                      <select
                        name="status"
                        value={editingAllocation.status || 'Draft'}
                        onChange={handleEditAllocationChange}
                        required
                      >
                        <option value="Draft">Draft</option>
                        <option value="Active">Active</option>
                        <option value="Completed">Completed</option>
                        <option value="Canceled">Canceled</option>
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label>Approval Status</label>
                      <select
                        name="approval_status"
                        value={editingAllocation.approval_status || 'Pending'}
                        onChange={handleEditAllocationChange}
                        required
                      >
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Under Review">Under Review</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="form-group full-width">
                  <label>Rejection Reason</label>
                  <textarea
                    name="rejection_reason"
                    value={editingAllocation.rejection_reason || ''}
                    onChange={handleEditAllocationChange}
                  />
                </div>
                
                <div className="workforceallocation-modal-buttons">
                  <button type="submit" className="submit-btn">Save</button>
                  <button 
                    type="button" 
                    className="cancel-btn" 
                    onClick={() => setShowEditModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkforceAllocation;
