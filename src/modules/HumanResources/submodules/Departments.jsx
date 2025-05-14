/*************************************
 *          DEPARTMENTS.JSX
 *   (UPDATED - PART 1 OF 2)
 *************************************/
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Departments.css";
import { FiSearch } from "react-icons/fi";

const Departments = () => {
  /**************************************
   * State: Departments
   **************************************/
  const [departments, setDepartments] = useState([]);
  const [archivedDepartments, setArchivedDepartments] = useState([]);
  const [selectedArchived, setSelectedArchived] = useState([]);
  const [deptDropdownOpen, setDeptDropdownOpen] = useState(null); // for 3-dot menu

  // Add/Edit modals for Departments
  const [showDeptModal, setShowDeptModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmUnarchive, setShowConfirmUnarchive] = useState(null);
  const [newDeptName, setNewDeptName] = useState("");
  const [newDeptId, setNewDeptId] = useState(""); // for 'Add Department ID' if needed
  const [editingDept, setEditingDept] = useState(null);

  /**************************************
   * State: Department Superiors
   **************************************/
  const [superiors, setSuperiors] = useState([]);
  const [archivedSuperiors, setArchivedSuperiors] = useState([]);
  const [selectedSuperiorArchived, setSelectedSuperiorArchived] = useState([]);
  const [superDropdownOpen, setSuperDropdownOpen] = useState(null); // 3-dot

  // Add/Edit modals for Department Superiors
  const [showSuperiorModal, setShowSuperiorModal] = useState(false);
  const [showEditSuperiorModal, setShowEditSuperiorModal] = useState(false);
  const [showConfirmUnarchiveSuperior, setShowConfirmUnarchiveSuperior] = useState(null);

  // The new superior being added
  const [newSuperior, setNewSuperior] = useState({
    dept_name: "",
    position_title: "",
    hierarchy_level: 1,
  });

  // The superior being edited
  const [editingSuperior, setEditingSuperior] = useState(null);

  /**************************************
   * Shared States & Logic
   **************************************/
  const [activeTab, setActiveTab] = useState("Departments");
  const [showArchived, setShowArchived] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sortField, setSortField] = useState("all");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // For autofilling department superiors
  const [positions, setPositions] = useState([]); // to store positions fetched from API

  const showToast = (message, success = true) => {
    setToast({ message, success });
    setTimeout(() => setToast(null), 3000);
  };

  /**************************************
   * 1) Fetch: Departments
   **************************************/
  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const [activeRes, archivedRes] = await Promise.all([
        axios.get("http://127.0.0.1:8000///api/departments/department/"),
        axios.get("http://127.0.0.1:8000///api/departments/department/archived/"),
      ]);
      setDepartments(activeRes.data);
      setArchivedDepartments(archivedRes.data);
    } catch (err) {
      console.error("Fetch departments error:", err);
      showToast("Failed to fetch departments", false);
    } finally {
      setLoading(false);
    }
  };

  /**************************************
   * 2) Fetch: Department Superiors
   **************************************/
  const fetchDepartmentSuperiors = async () => {
    setLoading(true);
    try {
      const [activeRes, archivedRes] = await Promise.all([
        axios.get("http://127.0.0.1:8000///api/department_superiors/department-superiors/"),
        axios.get("http://127.0.0.1:8000///api/department_superiors/department-superiors/archived/"),
      ]);
      setSuperiors(activeRes.data);
      setArchivedSuperiors(archivedRes.data);
    } catch (err) {
      console.error("Fetch superiors error:", err);
      showToast("Failed to fetch department superiors", false);
    } finally {
      setLoading(false);
    }
  };

  /**************************************
   * 3) Fetch: Positions for Autofill
   **************************************/
  const fetchPositions = async () => {
    try {
      // const res = await axios.get("http://127.0.0.1:8000///admin/positions/position/");
      const res = await axios.get("http://127.0.0.1:8000///api/positions/positions/");
      setPositions(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Fetch positions error:", err);
      showToast("Failed to fetch positions for autofill", false);
      setPositions([]); // Set to empty array on error
    }
  };

  useEffect(() => {
    fetchDepartments();
    fetchDepartmentSuperiors();
    fetchPositions();
  }, []);

  /**************************************
   * Searching + Debounce
   **************************************/
  const debounce = (fn, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn(...args), delay);
    };
  };
  const handleSearch = debounce((value) => {
    setSearchTerm((value || '').toLowerCase());
    setCurrentPage(1);
  }, 300);

  /**************************************
   * 4) Filter + Sort + Paginate
   **************************************/
  // Update the filterAndPaginate function to handle undefined values
  const filterAndPaginate = (data, sortField) => {
    // Handle undefined or null data
    if (!data || !Array.isArray(data)) {
      return { data: [], totalPages: 0, totalFiltered: 0 };
    }
    
    // Handle undefined searchTerm
    const term = (searchTerm || '').toLowerCase();
    
    let filtered = data.filter(item => {
      if (!item) return false;
      return Object.values(item).some(val => {
        if (val == null) return false;
        try {
          return val.toString().toLowerCase().includes(term);
        } catch (err) {
          return false;
        }
      });
    });
  
    // Sorting
    if (sortField !== "all") {
      filtered.sort((a, b) => {
        if (!a || !b) return 0;
        const valA = a[sortField] != null ? a[sortField].toString().toLowerCase() : '';
        const valB = b[sortField] != null ? b[sortField].toString().toLowerCase() : '';
        return valA.localeCompare(valB);
      });
    }
    
    // Pagination
    const start = (currentPage - 1) * itemsPerPage;
    const paginated = filtered.slice(start, start + itemsPerPage);
    const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
    
    return {
      data: paginated,
      totalPages,
      totalFiltered: filtered.length,
    };
  };

  /**************************************
   * 5) Departments CRUD
   **************************************/
  // a) Add Department
  const handleAddDept = () => {
    setNewDeptName("");
    setNewDeptId(""); // or something if you generate ID
    setShowDeptModal(true);
  };

  const submitDeptModal = async (e) => {
    e.preventDefault();
    if (!newDeptName.trim()) return;
    // if you need to handle newDeptId, do so here
    try {
      // If your backend auto-generates dept_id, you can just pass dept_name
      // await axios.post("http://127.0.0.1:8000///admin/departments/department/", { dept_name: newDeptName });
      await axios.post("http://127.0.0.1:8000///api/departments/department/", { dept_name: newDeptName });
      setShowDeptModal(false);
      showToast("Department added successfully");
      fetchDepartments();
    } catch (err) {
      console.error("Add department error:", err);
      showToast("Failed to add department", false);
    }
  };

  // b) Edit Department
  const openEditModal = (dept) => {
    setEditingDept({ ...dept });
    setShowEditModal(true);
  };
  const handleEditChange = (e) => {
    setEditingDept({ ...editingDept, dept_name: e.target.value });
  };
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`http://127.0.0.1:8000///api/departments/department/${editingDept.dept_id}/`, {
        dept_name: editingDept.dept_name,
      });
      setShowEditModal(false);
      showToast("Department updated successfully");
      fetchDepartments();
    } catch (err) {
      console.error("Update department error:", err);
      showToast("Failed to update department", false);
    }
  };

  // c) Archive Department
  const handleDeptArchive = async (id) => {
    if (!window.confirm("Archive this department?")) return;
    try {
      await axios.post(`http://127.0.0.1:8000///api/departments/department/${id}/archive/`);
      showToast("Department archived successfully");
      fetchDepartments();
    } catch (err) {
      console.error("Archive department error:", err);
      showToast("Failed to archive department", false);
    }
  };

  // d) Unarchive single
  const confirmUnarchive = (id) => {
    setShowConfirmUnarchive(id);
  };
  const handleDeptUnarchive = async (id) => {
    try {
      await axios.post(`http://127.0.0.1:8000///api/departments/department/${id}/unarchive/`);
      setShowConfirmUnarchive(null);
      showToast("Department unarchived successfully");
      fetchDepartments();
    } catch (err) {
      console.error("Unarchive department error:", err);
      showToast("Failed to unarchive department", false);
    }
  };

  // e) Bulk unarchive
  const toggleSelectArchived = (id) => {
    setSelectedArchived((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };
  const bulkUnarchive = async () => {
    try {
      await Promise.all(
        selectedArchived.map((id) => axios.post(`http://127.0.0.1:8000///api/departments/department/${id}/unarchive/`))
      );
      showToast("Departments unarchived successfully");
      setSelectedArchived([]);
      fetchDepartments();
    } catch (err) {
      console.error("Bulk unarchive error:", err);
      showToast("Failed to unarchive departments", false);
    }
  };

  /**************************************
   * 6) Department Superiors CRUD + Autofill
   **************************************/
  // a) handleAddSuperior
  const handleAddSuperior = () => {
    setNewSuperior({
      dept_name: "",
      position_title: "",
      hierarchy_level: 1,
    });
    setShowSuperiorModal(true);
  };

  const submitSuperiorModal = async (e) => {
    e.preventDefault();
    try {
      const formData = {
        dept_name: newSuperior.dept_name,
        position_title: newSuperior.position_title,
        hierarchy_level: parseInt(newSuperior.hierarchy_level),
        is_archived: false
      };

      await axios.post("http://127.0.0.1:8000///api/department_superiors/department-superiors/", formData);
      
      setShowSuperiorModal(false);
      showToast("Department superior added successfully");
      fetchDepartmentSuperiors();
    } catch (err) {
      console.error("Add superior error:", err);
      const errorMsg = err.response?.data?.detail || "Failed to add department superior";
      showToast(errorMsg, false);
    }
  };

  // b) Edit Superior
  const openEditSuperiorModal = (sup) => {
    setEditingSuperior({ ...sup });
    setShowEditSuperiorModal(true);
  };

  const handleSuperiorEditChange = (e) => {
    const { name, value } = e.target;
    setEditingSuperior({ ...editingSuperior, [name]: value });
  };

  const handleSuperiorEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = {
        hierarchy_level: parseInt(editingSuperior.hierarchy_level) // Only update hierarchy_level
      };

      await axios.patch(
        `http://127.0.0.1:8000///api/department_superiors/department-superiors/${editingSuperior.dept_superior_id}/`,
        formData
      );
      setShowEditSuperiorModal(false);
      showToast("Department superior updated successfully");
      fetchDepartmentSuperiors();
    } catch (err) {
      console.error("Update superior error:", err);
      const errorMsg = err.response?.data?.detail || "Failed to update department superior";
      showToast(errorMsg, false);
    }
  };

  // c) Archive Superior
  const handleSuperiorArchive = async (id) => {
    if (!id) {
      showToast("Cannot archive superior without an ID", false);
      return;
    }

    if (!window.confirm("Archive this department superior?")) return;
    try {
      await axios.post(`http://127.0.0.1:8000///api/department_superiors/department-superiors/${id}/archive/`);
      showToast("Department superior archived successfully");
      fetchDepartmentSuperiors();
    } catch (err) {
      console.error("Archive superior error:", err);
      showToast("Failed to archive department superior", false);
    }
  };

  // d) Unarchive single
  const confirmUnarchiveSuperior = (id) => {
    setShowConfirmUnarchiveSuperior(id);
  };
  const handleSuperiorUnarchive = async (id) => {
    try {
      await axios.post(`http://127.0.0.1:8000///api/department_superiors/department-superiors/${id}/unarchive/`);
      setShowConfirmUnarchiveSuperior(null);
      showToast("Department superior unarchived successfully");
      fetchDepartmentSuperiors();
    } catch (err) {
      console.error("Unarchive superior error:", err);
      showToast("Failed to unarchive department superior", false);
    }
  };

  // e) Bulk unarchive superiors
  const toggleSelectSuperiorArchived = (id) => {
    setSelectedSuperiorArchived((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };
  const bulkUnarchiveSuperiors = async () => {
    try {
      await Promise.all(
        selectedSuperiorArchived.map((id) =>
          axios.post(`http://127.0.0.1:8000///api/department_superiors/department-superiors/${id}/unarchive/`)
        )
      );
      showToast("Department superiors unarchived successfully");
      setSelectedSuperiorArchived([]);
      fetchDepartmentSuperiors();
    } catch (err) {
      console.error("Bulk unarchive superiors error:", err);
      showToast("Failed to unarchive selected superiors", false);
    }
  };

  /*************************************
 *        DEPARTMENTS.JSX
 *   (UPDATED - PART 2 OF 2)
 *************************************/
  /**************************************
   * RENDER TABLES
   **************************************/
// Update renderDeptTable function
const renderDeptTable = (rawData, isArchived = false) => {
  const { data, totalPages, totalFiltered } = filterAndPaginate(rawData, sortField);
  if (loading) return <div className="hr-no-results">Loading departments...</div>;
  if (totalFiltered === 0) return <div className="hr-no-results">No departments found.</div>;

  return (
    <>
      <div className="hr-department-no-scroll-wrapper">
        <div className="hr-department-table-scrollable">
          <table className="hr-department-table hr-department-no-scroll-table">
            <thead>
              <tr>
                {isArchived && <th>Select</th>}
                <th>Department ID</th>
                <th>Department Name</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.map((dept, index) => (
                <tr key={dept.dept_id} className={isArchived ? "hr-archived-row" : ""}>
                  {isArchived && (
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedArchived.includes(dept.dept_id)}
                        onChange={() => toggleSelectArchived(dept.dept_id)}
                      />
                    </td>
                  )}
                  <td>{dept.dept_id}</td>
                  <td>{dept.dept_name}</td>
                  <td className="hr-department-actions">
                    <div
                      className="hr-department-dots"
                      onClick={() => setDeptDropdownOpen(deptDropdownOpen === index ? null : index)}
                    >
                      ⋮
                      {deptDropdownOpen === index && (
                        <div className="hr-department-dropdown">
                          <div
                            className="hr-department-dropdown-item"
                            onClick={() => openEditModal(dept)}
                          >
                            Edit
                          </div>
                          {!isArchived ? (
                            <div
                              className="hr-department-dropdown-item"
                              onClick={() => handleDeptArchive(dept.dept_id)}
                            >
                              Archive
                            </div>
                          ) : (
                            <div
                              className="hr-department-dropdown-item"
                              onClick={() => confirmUnarchive(dept.dept_id)}
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
      
      {/* Enhanced Pagination */}
      <div className="hr-pagination">
        <button 
          className="hr-pagination-arrow" 
          onClick={() => setCurrentPage(1)} 
          disabled={currentPage === 1}
        >
          &#171; {/* Double left arrow */}
        </button>
        
        <button 
          className="hr-pagination-arrow" 
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
          disabled={currentPage === 1}
        >
          &#8249; {/* Single left arrow */}
        </button>
        
        <div className="hr-pagination-numbers">
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
                pageNumbers.push(<span key="ellipsis1" className="hr-pagination-ellipsis">...</span>);
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
                pageNumbers.push(<span key="ellipsis2" className="hr-pagination-ellipsis">...</span>);
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
          className="hr-pagination-arrow" 
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
          disabled={currentPage === totalPages}
        >
          &#8250; {/* Single right arrow */}
        </button>
        
        <button 
          className="hr-pagination-arrow" 
          onClick={() => setCurrentPage(totalPages)} 
          disabled={currentPage === totalPages}
        >
          &#187; {/* Double right arrow */}
        </button>
        
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
    </>
  );
};

const renderSuperiorTable = (rawData, isArchived = false) => {
  const { data, totalPages, totalFiltered } = filterAndPaginate(rawData, sortField);
  if (loading) return <div className="hr-no-results">Loading department superiors...</div>;
  if (totalFiltered === 0) return <div className="hr-no-results">No department superiors found.</div>;

  return (
    <>
      <div className="hr-superior-table-wrapper">
        <div className="hr-department-table-scrollable">
          <table className="hr-department-table superiors-table">
            <thead>
              <tr>
                {isArchived && <th>Select</th>}
                <th>Dept Superior ID</th>
                <th>Department ID</th>
                <th>Department Name</th>
                <th>Position ID</th>
                <th>Position Title</th>
                <th>Employee ID</th>
                <th>Superior Name</th>
                <th>Phone</th>
                <th>Employee Status</th>
                <th>Hierarchy Level</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.map((sup, index) => (
                <tr key={sup.dept_superior_id} className={isArchived ? "hr-archived-row" : ""}>
                  {isArchived && (
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedSuperiorArchived.includes(sup.dept_superior_id)}
                        onChange={() => toggleSelectSuperiorArchived(sup.dept_superior_id)}
                      />
                    </td>
                  )}
                  <td>{sup.dept_superior_id}</td>
                  <td>{sup.dept_id}</td>
                  <td>{sup.dept_name}</td>
                  <td>{sup.position_id}</td>
                  <td>{sup.position_title}</td>
                  <td>{sup.employee_id}</td>
                  <td>{sup.superior_name}</td>
                  <td>{sup.phone}</td>
                  <td>{sup.employee_status}</td>
                  <td>
                    <span className={`hr-tag level-${sup.hierarchy_level}`}>
                      {sup.hierarchy_level}
                    </span>
                  </td>
                  <td className="hr-department-actions">
                    <div
                      className="hr-department-dots"
                      onClick={() =>
                        setSuperDropdownOpen(superDropdownOpen === index ? null : index)
                      }
                    >
                      ⋮
                      {superDropdownOpen === index && (
                        <div className="hr-department-dropdown">
                          <div
                            className="hr-department-dropdown-item"
                            onClick={() => openEditSuperiorModal(sup)}
                          >
                            Edit
                          </div>
                          {!isArchived ? (
                            <div
                              className="hr-department-dropdown-item"
                              onClick={() => handleSuperiorArchive(sup.dept_superior_id)}
                            >
                              Archive
                            </div>
                          ) : (
                            <div
                              className="hr-department-dropdown-item"
                              onClick={() => confirmUnarchiveSuperior(sup.dept_superior_id)}
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

      {/* Enhanced Pagination */}
      <div className="hr-pagination">
        <button 
          className="hr-pagination-arrow" 
          onClick={() => setCurrentPage(1)} 
          disabled={currentPage === 1}
        >
          &#171; {/* Double left arrow */}
        </button>
        
        <button 
          className="hr-pagination-arrow" 
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
          disabled={currentPage === 1}
        >
          &#8249; {/* Single left arrow */}
        </button>
        
        <div className="hr-pagination-numbers">
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
                pageNumbers.push(<span key="ellipsis1" className="hr-pagination-ellipsis">...</span>);
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
                pageNumbers.push(<span key="ellipsis2" className="hr-pagination-ellipsis">...</span>);
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
          className="hr-pagination-arrow" 
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
          disabled={currentPage === totalPages}
        >
          &#8250; {/* Single right arrow */}
        </button>
        
        <button 
          className="hr-pagination-arrow" 
          onClick={() => setCurrentPage(totalPages)} 
          disabled={currentPage === totalPages}
        >
          &#187; {/* Double right arrow */}
        </button>
        
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
    </>
  );
};

  /**************************************
   * RENDER
   **************************************/
  return (
    <div className="hr-department">
      <div className="hr-department-body-content-container">
        <div className="hr-department-scrollable">
          <div className="hr-department-heading">
            <h2><strong>Departments</strong></h2>
            <div className="hr-department-right-controls">
              <div className="hr-department-search-wrapper">
                <FiSearch className="hr-department-search-icon" />
                <input
                  type="text"
                  className="hr-department-search"
                  placeholder="Search..."
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
              <select
                className="hr-department-filter"
                value={sortField}
                onChange={(e) => setSortField(e.target.value)}
              >
                <option value="all">No Sorting</option>
                <option value="dept_name">Sort by Name (A-Z)</option>
                <option value="dept_id">Sort by ID (A-Z)</option>
              </select>

              {activeTab === "Departments" && (
                <>
                  <button className="hr-department-add-btn" onClick={handleAddDept}>
                    + Add Department
                  </button>
                  <button
                    className="hr-department-add-btn"
                    onClick={() => setShowArchived(!showArchived)}
                  >
                    {showArchived ? "View Active" : "View Archived"}
                  </button>
                  {showArchived && selectedArchived.length > 0 && (
                    <button className="hr-department-add-btn" onClick={bulkUnarchive}>
                      Unarchive Selected
                    </button>
                  )}
                </>
              )}

              {activeTab === "Superiors" && (
                <>
                  <button className="hr-department-add-btn" onClick={handleAddSuperior}>
                    + Add Superior
                  </button>
                  <button
                    className="hr-department-add-btn"
                    onClick={() => setShowArchived(!showArchived)}
                  >
                    {showArchived ? "View Active" : "View Archived"}
                  </button>
                  {showArchived && selectedSuperiorArchived.length > 0 && (
                    <button className="hr-department-add-btn" onClick={bulkUnarchiveSuperiors}>
                      Unarchive Selected
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="hr-department-table-container">
            <div className="hr-department-header">
              <div className="hr-department-tabs">
                <button
                  className={activeTab === "Departments" ? "active" : ""}
                  onClick={() => {
                    setActiveTab("Departments");
                    setShowArchived(false);
                    setSelectedArchived([]);
                    setCurrentPage(1);
                  }}
                >
                  Departments <span className="hr-department-count">{departments.length}</span>
                </button>
                <button
                  className={activeTab === "Superiors" ? "active" : ""}
                  onClick={() => {
                    setActiveTab("Superiors");
                    setShowArchived(false);
                    setSelectedSuperiorArchived([]);
                    setCurrentPage(1);
                  }}
                >
                  Department Superiors <span className="hr-department-count">{superiors.length}</span>
                </button>
              </div>
            </div>

            <div className="hr-department-table-content">
              {activeTab === "Departments"
                ? renderDeptTable(showArchived ? archivedDepartments : departments, showArchived)
                : renderSuperiorTable(showArchived ? archivedSuperiors : superiors, showArchived)}
            </div>
          </div>
        </div>
      </div>

      {/* ------------ Department Add/Edit & Confirm Unarchive ------------ */}
      {showDeptModal && (
        <div className="hr-department-modal-overlay">
          <div className="hr-department-modal">
            <h3 style={{ marginBottom: "1rem" }}>Add New Department</h3>
            <form onSubmit={submitDeptModal} className="hr-department-modal-form">
              <div className="form-group">
                <label>Department ID (disabled if auto-gen)</label>
                <input type="text" value={newDeptId} disabled />
              </div>
              <div className="form-group">
                <label>Department Name</label>
                <input
                  type="text"
                  value={newDeptName}
                  onChange={(e) => setNewDeptName(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <div className="hr-department-modal-buttons">
                <button type="submit" className="submit-btn">Add</button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowDeptModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && editingDept && (
        <div className="hr-department-modal-overlay">
          <div className="hr-department-modal">
            <h3 style={{ marginBottom: "1rem" }}>Edit Department</h3>
            <form onSubmit={handleEditSubmit} className="hr-department-modal-form">
              <div className="form-group">
                <label>Department ID</label>
                <input
                  type="text"
                  value={editingDept.dept_id || ""}
                  disabled
                />
              </div>
              <div className="form-group">
                <label>Department Name</label>
                <input
                  type="text"
                  value={editingDept.dept_name || ""}
                  onChange={handleEditChange}
                  required
                  autoFocus
                />
              </div>

              <div className="hr-department-modal-buttons">
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

      {showConfirmUnarchive && (
        <div className="hr-department-modal-overlay">
          <div className="hr-department-modal">
            <h3>Unarchive Department</h3>
            <p>Are you sure you want to unarchive this department?</p>
            <div className="hr-department-modal-buttons">
              <button className="submit-btn" onClick={() => handleDeptUnarchive(showConfirmUnarchive)}>
                Yes
              </button>
              <button className="cancel-btn" onClick={() => setShowConfirmUnarchive(null)}>
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------ Department Superior Add/Edit & Confirm Unarchive ------------ */}
      {showSuperiorModal && (
        <div className="hr-department-modal-overlay">
          <div className="hr-department-modal" style={{ width: "700px" }}>
            <h3 style={{ marginBottom: "1rem" }}>Add New Department Superior</h3>
            <form onSubmit={submitSuperiorModal} className="hr-department-modal-form">
              <div className="hr-department-two-column-form">
                <div className="form-group">
                  <label>Department Name</label>
                  <select
                    value={newSuperior.dept_name || ""}
                    onChange={(e) => setNewSuperior({ ...newSuperior, dept_name: e.target.value })}
                    required
                  >
                    <option value="">-- Select --</option>
                    {departments.map((dept) => (
                      <option key={dept.dept_id} value={dept.dept_name}>
                        {dept.dept_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Position Title</label>
                  <select
                    value={newSuperior.position_title || ""}
                    onChange={(e) => setNewSuperior({ ...newSuperior, position_title: e.target.value })}
                    required
                  >
                    <option value="">-- Select --</option>
                    {Array.isArray(positions) ? positions.map((pos) => (
                      <option key={pos.position_id} value={pos.position_title}>
                        {pos.position_title}
                      </option>
                    )) : <option value="">Loading positions...</option>}
                  </select>
                </div>

                <div className="form-group">
                  <label>Hierarchy Level</label>
                  <input
                    type="number"
                    name="hierarchy_level"
                    value={newSuperior.hierarchy_level || 1}
                    onChange={(e) => setNewSuperior({ ...newSuperior, hierarchy_level: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="hr-department-modal-buttons">
                <button type="submit" className="submit-btn">Add</button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowSuperiorModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditSuperiorModal && editingSuperior && (
        <div className="hr-department-modal-overlay">
          <div className="hr-department-modal" style={{ width: "700px" }}>
            <h3 style={{ marginBottom: "1rem" }}>Edit Department Superior</h3>
            <form onSubmit={handleSuperiorEditSubmit} className="hr-department-modal-form">
              <div className="hr-department-two-column-form">
                <div className="form-group">
                  <label>Dept Superior ID</label>
                  <input type="text" value={editingSuperior.dept_superior_id} disabled />
                </div>
                <div className="form-group">
                  <label>Department Name</label>
                  <input type="text" value={editingSuperior.dept_name} disabled />
                </div>
                <div className="form-group">
                  <label>Position Title</label>
                  <input type="text" value={editingSuperior.position_title} disabled />
                </div>
                <div className="form-group">
                  <label>Hierarchy Level</label>
                  <input
                    type="number"
                    name="hierarchy_level"
                    value={editingSuperior.hierarchy_level || 1}
                    onChange={handleSuperiorEditChange}
                    required
                  />
                </div>
              </div>
              <div className="hr-department-modal-buttons">
                <button type="submit" className="submit-btn">Save</button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowEditSuperiorModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showConfirmUnarchiveSuperior && (
        <div className="hr-department-modal-overlay">
          <div className="hr-department-modal">
            <h3>Unarchive Department Superior</h3>
            <p>Are you sure you want to unarchive this department superior?</p>
            <div className="hr-department-modal-buttons">
              <button
                className="submit-btn"
                onClick={() => handleSuperiorUnarchive(showConfirmUnarchiveSuperior)}
              >
                Yes
              </button>
              <button
                className="cancel-btn"
                onClick={() => setShowConfirmUnarchiveSuperior(null)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

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
  );
};

export default Departments;