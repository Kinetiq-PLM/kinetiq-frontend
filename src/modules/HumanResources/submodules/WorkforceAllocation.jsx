import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiSearch } from "react-icons/fi";
import "../styles/WorkforceAllocation.css";

const WorkforceAllocation = () => {
  // States for data
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [archivedAllocations, setArchivedAllocations] = useState([]); 
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

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
    employee_id: "", // Added employee_id field
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
    const fetchDropdownData = async () => {
      try {
        const [employeesRes, deptsRes] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/employees/"),
          axios.get("http://127.0.0.1:8000/api/departments/department/")
        ]);
        setEmployees(employeesRes.data);
        setDepartments(deptsRes.data);
      } catch (err) {
        console.error("Failed to fetch dropdown data:", err);
      }
    };
    
    fetchDropdownData();
    fetchAllocations();
  }, []);

  const validateAddForm = () => {
    const errors = {};
    
    // Check date constraint
    if (newAllocation.start_date && newAllocation.end_date && 
        new Date(newAllocation.end_date) < new Date(newAllocation.start_date)) {
      errors.end_date = "End date must be after start date";
    }
    
    // Check employee constraint when approved
    if (newAllocation.approval_status === "Approved" && !newAllocation.employee_id) {
      errors.employee_id = "Employee is required when status is Approved";
    }
    
    // Check rejection reason when rejected
    if (newAllocation.approval_status === "Rejected" && !newAllocation.rejection_reason) {
      errors.rejection_reason = "Rejection reason is required when status is Rejected";
    }
    
    return errors;
  };

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
      await axios.post(
        `http://127.0.0.1:8000/api/workforce_allocation/workforce_allocations/${id}/unarchive/`,
        {}, // Empty payload
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
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
      
      // Prevent duplicate submissions
      if (submitting) {
          console.log("Submission already in progress");
          return;
      }
      
      // Validate form
      const errors = validateAddForm();
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }
      
      try {
        setSubmitting(true); // Start submission
        
        // Format payload with explicit field mapping
        const payload = {
          required_skills: newAllocation.required_skills,
          task_description: newAllocation.task_description,
          requesting_dept_id: newAllocation.requesting_dept_id,
          current_dept_id: newAllocation.current_dept_id,
          hr_approver: newAllocation.hr_approver || null,
          employee: newAllocation.employee_id || null,
          status: newAllocation.status,
          start_date: newAllocation.start_date,
          end_date: newAllocation.end_date,
          approval_status: newAllocation.approval_status,
          rejection_reason: newAllocation.rejection_reason || ""
        };
        
        console.log("Sending payload:", payload);
        
        const response = await axios.post(
          "http://127.0.0.1:8000/api/workforce_allocation/workforce_allocations/", 
          payload,
          {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          }
        );
        
        console.log("Response:", response);
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
          employee_id: "",
          status: "Draft",
          start_date: "",
          end_date: "",
          approval_status: "Pending",
          rejection_reason: ""
        });
        setFormErrors({});
      } catch (err) {
        console.error("Add allocation error:", err);
        
        if (err.response) {
          console.error("Error details:", err.response.data);
          setFormErrors(err.response.data || {});
          showToast(`Failed to add allocation: ${JSON.stringify(err.response.data)}`, false);
        } else {
          showToast(`Failed to add allocation: ${err.message}`, false);
        }
      } finally {
        setSubmitting(false);
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
    
    // Validate form
    const errors = {};
    if (editingAllocation.approval_status === "Approved" && !editingAllocation.employee_id) {
      errors.employee_id = "Employee is required when status is Approved";
    }
    if (editingAllocation.approval_status === "Rejected" && !editingAllocation.rejection_reason) {
      errors.rejection_reason = "Rejection reason is required when status is Rejected";
    }
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    try {
      await axios.patch(
        `http://127.0.0.1:8000/api/workforce_allocation/workforce_allocations/${editingAllocation.allocation_id}/`, 
        {
          employee: editingAllocation.employee_id, // This is correct, keep as is
          hr_approver: editingAllocation.hr_approver,
          approval_status: editingAllocation.approval_status,
          status: editingAllocation.status,
          rejection_reason: editingAllocation.rejection_reason
        }
      );
      showToast("Allocation updated successfully");
      setShowEditModal(false);
      fetchAllocations();
      setFormErrors({});
    } catch (err) {
      console.error("Edit allocation error:", err);
      if (err.response && err.response.data) {
        setFormErrors(err.response.data);
      }
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
          <button 
            className="workforceallocation-pagination-arrow" 
            onClick={() => setCurrentPage(1)} 
            disabled={currentPage === 1}
          >
            &#171; {/* Double left arrow */}
          </button>
          
          <button 
            className="workforceallocation-pagination-arrow" 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
            disabled={currentPage === 1}
          >
            &#8249; {/* Single left arrow */}
          </button>
          
          <div className="workforceallocation-pagination-numbers">
            {(() => {
              const pageNumbers = [];
              const maxVisiblePages = 5;
              
              if (totalPages <= maxVisiblePages + 2) {
                // Show all pages if there are few
                for (let i = 1; i <= totalPages; i++) {
                  pageNumbers.push(
                    <button
                      key={i}
                      className={i === currentPage ? "active" : ""}
                      onClick={() => setCurrentPage(i)}
                    >
                      {i}
                    </button>
                  );
                }
              } else {
                // Always show first page
                pageNumbers.push(
                  <button
                    key={1}
                    className={1 === currentPage ? "active" : ""}
                    onClick={() => setCurrentPage(1)}
                  >
                    1
                  </button>
                );
                
                // Calculate range around current page
                let startPage = Math.max(2, currentPage - Math.floor(maxVisiblePages / 2));
                let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);
                
                // Adjust if we're near the end
                if (endPage - startPage < maxVisiblePages - 1) {
                  startPage = Math.max(2, endPage - maxVisiblePages + 1);
                }
                
                // Add ellipsis after first page if needed
                if (startPage > 2) {
                  pageNumbers.push(<span key="ellipsis1" className="workforceallocation-pagination-ellipsis">...</span>);
                }
                
                // Add middle pages
                for (let i = startPage; i <= endPage; i++) {
                  pageNumbers.push(
                    <button
                      key={i}
                      className={i === currentPage ? "active" : ""}
                      onClick={() => setCurrentPage(i)}
                    >
                      {i}
                    </button>
                  );
                }
                
                // Add ellipsis before last page if needed
                if (endPage < totalPages - 1) {
                  pageNumbers.push(<span key="ellipsis2" className="workforceallocation-pagination-ellipsis">...</span>);
                }
                
                // Always show last page
                pageNumbers.push(
                  <button
                    key={totalPages}
                    className={totalPages === currentPage ? "active" : ""}
                    onClick={() => setCurrentPage(totalPages)}
                  >
                    {totalPages}
                  </button>
                );
              }
              
              return pageNumbers;
            })()}
          </div>
          
          <button 
            className="workforceallocation-pagination-arrow" 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
            disabled={currentPage === totalPages}
          >
            &#8250; {/* Single right arrow */}
          </button>
          
          <button 
            className="workforceallocation-pagination-arrow" 
            onClick={() => setCurrentPage(totalPages)} 
            disabled={currentPage === totalPages}
          >
            &#187; {/* Double right arrow */}
          </button>
          
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
                      <select
                        name="requesting_dept_id"
                        value={newAllocation.requesting_dept_id}
                        onChange={handleAddAllocationChange}
                        required
                      >
                        <option value="">Select Department</option>
                        {departments.map(dept => (
                          <option key={dept.dept_id} value={dept.dept_id}>
                            {dept.dept_name}
                          </option>
                        ))}
                      </select>
                      {formErrors.requesting_dept_id && (
                        <div className="form-error">{formErrors.requesting_dept_id}</div>
                      )}
                    </div>
                    
                    <div className="form-group">
                      <label>Current Department</label>
                      <select
                        name="current_dept_id"
                        value={newAllocation.current_dept_id}
                        onChange={handleAddAllocationChange}
                        required
                      >
                        <option value="">Select Department</option>
                        {departments.map(dept => (
                          <option key={dept.dept_id} value={dept.dept_id}>
                            {dept.dept_name}
                          </option>
                        ))}
                      </select>
                      {formErrors.current_dept_id && (
                        <div className="form-error">{formErrors.current_dept_id}</div>
                      )}
                    </div>
                    
                    <div className="form-group">
                      <label>HR Approver</label>
                      <select
                        name="hr_approver"
                        value={newAllocation.hr_approver}
                        onChange={handleAddAllocationChange}
                      >
                        <option value="">Select HR Approver</option>
                        {employees.map(emp => (
                          <option key={emp.employee_id} value={emp.employee_id}>
                            {emp.first_name} {emp.last_name}
                          </option>
                        ))}
                      </select>
                      {formErrors.hr_approver && (
                        <div className="form-error">{formErrors.hr_approver}</div>
                      )}
                    </div>
                    
                    <div className="form-group">
                      <label>Employee</label>
                      <select
                        name="employee_id"
                        value={newAllocation.employee_id}
                        onChange={handleAddAllocationChange}
                      >
                        <option value="">Select Employee</option>
                        {employees.map(emp => (
                          <option key={emp.employee_id} value={emp.employee_id}>
                            {emp.first_name} {emp.last_name}
                          </option>
                        ))}
                      </select>
                      {formErrors.employee_id && (
                        <div className="form-error">{formErrors.employee_id}</div>
                      )}
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
                        <option value="Submitted">Submitted</option>
                        <option value="Active">Active</option>
                        <option value="Completed">Completed</option>
                        <option value="Canceled">Canceled</option>
                      </select>
                      {formErrors.status && (
                        <div className="form-error">{formErrors.status}</div>
                      )}
                    </div>
                    
                  </div>
                  
                  <div className="form-column">
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
                      {formErrors.approval_status && (
                        <div className="form-error">{formErrors.approval_status}</div>
                      )}
                    </div>
                  
                    <div className="form-group">
                      <label>Start Date</label>
                      <input
                        type="date"
                        name="start_date"
                        value={newAllocation.start_date}
                        onChange={handleAddAllocationChange}
                        required
                      />
                      {formErrors.start_date && (
                        <div className="form-error">{formErrors.start_date}</div>
                      )}
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
                      {formErrors.end_date && (
                        <div className="form-error">{formErrors.end_date}</div>
                      )}
                    </div>
                    
                    <div className="form-group">
                      <label>Rejection Reason</label>
                      <textarea
                        name="rejection_reason"
                        value={newAllocation.rejection_reason}
                        onChange={handleAddAllocationChange}
                        disabled={newAllocation.approval_status !== 'Rejected'}
                      />
                      {formErrors.rejection_reason && (
                        <div className="form-error">{formErrors.rejection_reason}</div>
                      )}
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
                  {formErrors.required_skills && (
                    <div className="form-error">{formErrors.required_skills}</div>
                  )}
                </div>
                
                <div className="form-group full-width">
                  <label>Task Description</label>
                  <textarea
                    name="task_description"
                    value={newAllocation.task_description}
                    onChange={handleAddAllocationChange}
                    required
                  />
                  {formErrors.task_description && (
                    <div className="form-error">{formErrors.task_description}</div>
                  )}
                </div>
                
                {/* Show any non-field errors */}
                {formErrors.non_field_errors && (
                  <div className="form-error">{formErrors.non_field_errors}</div>
                )}
                
                <div className="workforceallocation-modal-buttons">
                  <button 
                    type="submit" 
                    className="submit-btn" 
                    disabled={submitting}
                  >
                    {submitting ? "Adding..." : "Add"}
                  </button>
                  <button 
                    type="button" 
                    className="cancel-btn" 
                    onClick={() => {
                      setShowAddModal(false);
                      setFormErrors({});
                    }}
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
                      <label>Employee</label>
                      <select
                        name="employee_id"
                        value={editingAllocation.employee_id || ''}
                        onChange={handleEditAllocationChange}
                      >
                        <option value="">Select Employee</option>
                        {employees.map(emp => (
                          <option key={emp.employee_id} value={emp.employee_id}>
                            {emp.first_name} {emp.last_name}
                          </option>
                        ))}
                      </select>
                      {formErrors.employee_id && (
                        <div className="form-error">{formErrors.employee_id}</div>
                      )}
                    </div>
                    
                    <div className="form-group">
                      <label>HR Approver</label>
                      <select
                        name="hr_approver"
                        value={editingAllocation.hr_approver || ''}
                        onChange={handleEditAllocationChange}
                      >
                        <option value="">Select HR Approver</option>
                        {employees.map(emp => (
                          <option key={emp.employee_id} value={emp.employee_id}>
                            {emp.first_name} {emp.last_name}
                          </option>
                        ))}
                      </select>
                      {formErrors.hr_approver && (
                        <div className="form-error">{formErrors.hr_approver}</div>
                      )}
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
                        <option value="Submitted">Submitted</option>
                        <option value="Active">Active</option>
                        <option value="Completed">Completed</option>
                        <option value="Canceled">Canceled</option>
                      </select>
                      {formErrors.status && (
                        <div className="form-error">{formErrors.status}</div>
                      )}
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
                      {formErrors.approval_status && (
                        <div className="form-error">{formErrors.approval_status}</div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="form-group full-width">
                  <label>Rejection Reason</label>
                  <textarea
                    name="rejection_reason"
                    value={editingAllocation.rejection_reason || ''}
                    onChange={handleEditAllocationChange}
                    disabled={editingAllocation.approval_status !== 'Rejected'}
                  />
                  {formErrors.rejection_reason && (
                    <div className="form-error">{formErrors.rejection_reason}</div>
                  )}
                </div>
                
                {/* Show any non-field errors */}
                {formErrors.non_field_errors && (
                  <div className="form-error">{formErrors.non_field_errors}</div>
                )}
                
                <div className="workforceallocation-modal-buttons">
                  <button type="submit" className="submit-btn">Save</button>
                  <button 
                    type="button" 
                    className="cancel-btn" 
                    onClick={() => {
                      setShowEditModal(false);
                      setFormErrors({});
                    }}
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
