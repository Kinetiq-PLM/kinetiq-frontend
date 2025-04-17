import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Employees.css";
import { FiSearch } from "react-icons/fi";

const Employees = () => {
  /*************************************
   * States for Employees
   *************************************/
  const [employees, setEmployees] = useState([]);
  const [archivedEmployees, setArchivedEmployees] = useState([]);
  const [selectedArchivedEmployees, setSelectedArchivedEmployees] = useState([]);

  // Add/Edit modals for Employees
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showEditEmployeeModal, setShowEditEmployeeModal] = useState(false);
  const [showConfirmUnarchiveEmployee, setShowConfirmUnarchiveEmployee] = useState(null);

  // The new employee to add
  const [newEmployee, setNewEmployee] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    employment_type: "Regular", // Required with default
    status: "Active", // Required with default
    reports_to: "",
    is_supervisor: false,
  });

  // The employee currently being edited
  const [editingEmployee, setEditingEmployee] = useState(null);

  /*************************************
   * States for Positions
   *************************************/
  const [positions, setPositions] = useState([]);
  const [archivedPositions, setArchivedPositions] = useState([]);
  const [selectedArchivedPositions, setSelectedArchivedPositions] = useState([]);

  // Add/Edit modals for Positions
  const [showPositionModal, setShowPositionModal] = useState(false);
  const [showEditPositionModal, setShowEditPositionModal] = useState(false);
  const [showConfirmUnarchivePosition, setShowConfirmUnarchivePosition] = useState(null);

  // The new position to add
  const [newPosition, setNewPosition] = useState({
    position_title: "",
    salary_grade: "",
    min_salary: 0, // Changed from empty string
    max_salary: 0, // Changed from empty string
    employment_type: "Regular", // Default to a valid choice
    typical_duration_days: null,
    is_active: true,
  });

  // The position currently being edited
  const [editingPosition, setEditingPosition] = useState(null);

  /*************************************
   * Shared UI States
   *************************************/
  const [activeTab, setActiveTab] = useState("Employees");
  const [showArchived, setShowArchived] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sortField, setSortField] = useState("all");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  // for 3-dot menus in the table
  const [dotsMenuOpen, setDotsMenuOpen] = useState(null);

  // Helper to show toast messages
  const showToast = (message, success = true) => {
    setToast({ message, success });
    setTimeout(() => setToast(null), 3000);
  };

  const SALARY_GRADE_TABLE = {
    1: [14061, 14164, 14278, 14393, 14509, 14626, 14743, 14862],
    2: [14925, 15035, 15146, 15258, 15371, 15484, 15599, 15714],
    3: [15852, 15971, 16088, 16208, 16329, 16448, 16571, 16693],
    4: [16833, 16958, 17084, 17209, 17337, 17464, 17591, 17718],
    5: [17866, 18000, 18133, 18267, 18401, 18534, 18668, 18813],
    6: [18957, 19098, 19239, 19383, 19526, 19670, 19816, 19963],
    7: [20110, 20258, 20408, 20560, 20711, 20865, 21021, 21175],
    8: [21410, 21621, 21831, 22045, 22260, 22475, 22693, 22910],
    9: [23226, 23411, 23599, 23788, 23978, 24170, 24364, 24558],
    10: [25586, 25790, 25996, 26203, 26412, 26622, 26833, 27046],
    11: [30024, 30308, 30592, 30889, 31184, 31483, 31782, 32084],
    12: [32245, 32529, 32817, 33108, 33403, 33700, 34000, 34310],
    13: [34421, 34733, 35049, 35369, 35694, 36022, 36356, 36691],
    14: [37024, 37384, 37749, 38118, 38491, 38869, 39249, 39634],
    15: [40620, 40641, 41006, 41413, 41824, 42241, 42662, 43099],
    16: [43560, 43996, 44438, 44885, 45338, 45796, 46261, 46730],
    17: [47247, 47727, 48213, 48705, 49203, 49708, 50218, 50735],
    18: [51304, 51832, 52367, 52907, 53456, 54010, 54572, 55142],
    19: [56390, 57165, 57953, 58753, 59567, 60394, 61235, 62089],
    20: [62967, 63842, 64732, 65637, 66557, 67479, 68409, 69342],
    21: [70013, 71001, 72004, 73024, 74061, 75116, 76185, 77271],
    22: [78162, 79277, 80411, 81564, 82735, 83927, 85137, 86324],
    23: [87315, 88574, 89855, 91163, 92592, 94043, 95518, 96955],
    24: [98185, 99572, 101283, 102871, 104483, 106123, 107739, 109431],
    25: [111727, 113476, 115254, 117062, 118899, 120766, 122664, 124591],
    26: [126252, 128228, 130238, 132280, 134356, 136465, 138608, 140788],
    27: [142653, 144897, 147169, 149407, 151752, 153850, 156267, 158723],
    28: [160469, 162898, 165548, 167994, 170421, 172805, 175307, 177872],
    29: [180492, 183332, 186218, 189151, 192131, 195172, 198270, 200993],
    30: [203200, 206401, 209558, 212766, 216022, 219434, 222797, 226319],
    31: [293191, 298778, 304464, 310119, 315888, 321846, 327895, 334059],
    32: [347888, 354743, 361736, 368694, 375969, 383391, 390963, 398686],
    33: [314782, 317930, 321109, 324320, 327563, 330839, 334147, 337488]
  };

  /***************************************************************************
   * 1) Fetch: Employees (active + archived)
   ***************************************************************************/
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const [activeRes, archivedRes] = await Promise.all([
        axios.get("http://127.0.0.1:8000/api/employees/"),
        axios.get("http://127.0.0.1:8000/api/employees/archived/")
      ]);
      setEmployees(activeRes.data);
      setArchivedEmployees(archivedRes.data);
    } catch (err) {
      console.error("Fetch employees error", err);
      showToast("Failed to fetch employees", false);
    } finally {
      setLoading(false);
    }
  };

  /***************************************************************************
   * 2) Fetch: Positions (active + archived)
   ***************************************************************************/
  const fetchPositions = async () => {
    setLoading(true);
    try {
      const [activeRes, archivedRes] = await Promise.all([
        axios.get("http://127.0.0.1:8000/api/positions/"),
        axios.get("http://127.0.0.1:8000/api/positions/archived/")
      ]);
      setPositions(activeRes.data);
      setArchivedPositions(archivedRes.data);
    } catch (err) {
      console.error("Fetch positions error", err);
      showToast("Failed to fetch positions", false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchPositions();
  }, []);

  /***************************************************************************
   * Searching + Debounce
   ***************************************************************************/
  const debounce = (fn, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn(...args), delay);
    };
  };

  const handleSearch = debounce((value) => {
    setSearchTerm(value.toLowerCase());
    setCurrentPage(1);
  }, 300);

  /***************************************************************************
   * Sorting + Pagination + Filtering
   ***************************************************************************/
  const filterAndPaginate = (dataArray) => {
    // Filter by searchTerm
    const filtered = dataArray.filter((item) => {
      // check all relevant fields for partial match
      return Object.values(item).some((val) =>
        val?.toString().toLowerCase().includes(searchTerm)
      );
    });

    // Sort if needed
    if (sortField !== "all") {
      filtered.sort((a, b) => {
        const valA = a[sortField]?.toString().toLowerCase() || "";
        const valB = b[sortField]?.toString().toLowerCase() || "";
        return valA.localeCompare(valB);
      });
    }

    // Pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginated = filtered.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(filtered.length / itemsPerPage);

    return { paginated, totalPages, totalCount: filtered.length };
  };

  /***************************************************************************
   * 3) Employees CRUD: Add, Edit, Archive, Unarchive
   ***************************************************************************/

  // a) Add
  const handleAddEmployee = () => {
    setNewEmployee({
      first_name: "",
      last_name: "",
      phone: "",
      employment_type: "Regular",
      status: "Active",
      reports_to: "",
      is_supervisor: false,
    });
    setShowEmployeeModal(true);
  };

  const submitEmployeeModal = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!newEmployee.first_name.trim() || !newEmployee.last_name.trim()) {
      showToast("First name and last name are required", false);
      return;
    }

    try {
      const employeeData = {
        first_name: newEmployee.first_name.trim(),
        last_name: newEmployee.last_name.trim(),
        phone: newEmployee.phone.trim(),
        employment_type: newEmployee.employment_type,
        status: newEmployee.status,
        reports_to: newEmployee.reports_to.trim() || null,
        is_supervisor: newEmployee.is_supervisor,
      };

      await axios.post("http://127.0.0.1:8000/api/employees/", employeeData);
      setShowEmployeeModal(false);
      showToast("Employee added successfully");
      fetchEmployees();
    } catch (err) {
      console.error("Add employee error:", err);
      showToast(err.response?.data?.detail || "Failed to add employee", false);
    }
  };

  // b) Edit
  const openEditEmployeeModal = (emp) => {
    // We fill editingEmployee with all the fields from the DB:
    setEditingEmployee({
      employee_id: emp.employee_id,
      user_id: emp.user_id || "",
      dept_id: emp.dept_id || "",
      first_name: emp.first_name || "",
      last_name: emp.last_name || "",
      phone: emp.phone || "",
      employment_type: emp.employment_type || "Regular",
      status: emp.status || "Active",
      reports_to: emp.reports_to || "",
      is_supervisor: emp.is_supervisor || false,
      created_at: emp.created_at,
      updated_at: emp.updated_at
    });
    setShowEditEmployeeModal(true);
  };

  const handleEditEmployeeChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditingEmployee((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleEditEmployeeSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!editingEmployee.first_name.trim() || !editingEmployee.last_name.trim()) {
      showToast("First name and last name are required", false);
      return;
    }

    try {
      const employeeData = {
        first_name: editingEmployee.first_name.trim(),
        last_name: editingEmployee.last_name.trim(),
        phone: editingEmployee.phone.trim(),
        employment_type: editingEmployee.employment_type,
        status: editingEmployee.status,
        reports_to: editingEmployee.reports_to.trim() || null,
        is_supervisor: editingEmployee.is_supervisor,
      };

      await axios.patch(
        `http://127.0.0.1:8000/api/employees/${editingEmployee.employee_id}/`,
        employeeData
      );
      setShowEditEmployeeModal(false);
      showToast("Employee updated successfully");
      fetchEmployees();
    } catch (err) {
      console.error("Update employee error", err);
      const errorMsg = err.response?.data?.detail || "Failed to update employee";
      showToast(errorMsg, false);
    }
  };

  // c) Archive (single)
  const handleArchiveEmployee = async (id) => {
    if (!window.confirm("Archive this employee?")) return;
    try {
      await axios.post(`http://127.0.0.1:8000/api/employees/${id}/archive/`);
      showToast("Employee archived successfully");
      fetchEmployees();
    } catch (err) {
      console.error("Archive employee error", err);
      showToast("Failed to archive employee", false);
    }
  };

  // d) Unarchive (single)
  const confirmUnarchiveEmployee = (id) => {
    setShowConfirmUnarchiveEmployee(id);
  };

  const handleUnarchiveEmployee = async (id) => {
    try {
      await axios.post(`http://127.0.0.1:8000/api/employees/${id}/unarchive/`);
      setShowConfirmUnarchiveEmployee(null);
      showToast("Employee unarchived successfully");
      fetchEmployees();
    } catch (err) {
      console.error("Unarchive employee error", err);
      showToast("Failed to unarchive employee", false);
    }
  };

  // e) Bulk unarchive
  const toggleSelectArchivedEmployee = (id) => {
    setSelectedArchivedEmployees((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const bulkUnarchiveEmployees = async () => {
    try {
      await Promise.all(
        selectedArchivedEmployees.map((id) =>
          axios.post(`http://127.0.0.1:8000/api/employees/${id}/unarchive/`)
        )
      );
      showToast("Employees unarchived successfully");
      setSelectedArchivedEmployees([]);
      fetchEmployees();
    } catch (err) {
      console.error("Bulk unarchive employees error", err);
      showToast("Failed to unarchive employees", false);
    }
  };

  /***************************************************************************
   * 4) Positions CRUD: Add, Edit, Archive, Unarchive
   ***************************************************************************/

  // a) Add
  const handleAddPosition = () => {
    setNewPosition({
      position_title: "",
      salary_grade: "",
      min_salary: 0,
      max_salary: 0,
      employment_type: "Regular",
      typical_duration_days: null,
      is_active: true
    });
    setShowPositionModal(true);
  };

  const handleAddPositionChange = (e) => {
    const { name, value } = e.target;

    if (name === "employment_type") {
      setNewPosition((prev) => ({
        ...prev,
        employment_type: value,
        salary_grade: value === "Regular" ? prev.salary_grade : "",
        min_salary: 0,
        max_salary: 0,
        typical_duration_days: value === "Regular" ? null : value === "Seasonal" ? 1 : 30,
      }));
      return;
    }

    if (name === "salary_grade" && newPosition.employment_type === "Regular") {
      const salarySteps = SALARY_GRADE_TABLE[value] || [];
      setNewPosition((prev) => ({
        ...prev,
        salary_grade: value,
        min_salary: salarySteps[0] || 0,
        max_salary: salarySteps[salarySteps.length - 1] || 0,
      }));
      return;
    }

    if ((name === "min_salary" || name === "max_salary") && newPosition.employment_type !== "Regular") {
      const numValue = parseFloat(value);
      if (numValue >= 0) {
        setNewPosition((prev) => ({
          ...prev,
          [name]: numValue,
        }));
      }
      return;
    }

    setNewPosition((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitPositionModal = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (
      !newPosition.position_title ||
      !newPosition.min_salary ||
      !newPosition.max_salary ||
      !newPosition.employment_type
    ) {
      showToast("Please fill all required fields", false);
      return;
    }

    try {
      await axios.post("http://127.0.0.1:8000/api/positions/", newPosition);
      setShowPositionModal(false);
      showToast("Position added successfully");
      fetchPositions();
    } catch (err) {
      console.error("Add position error:", err);
      showToast("Failed to add position", false);
    }
  };

  // b) Edit
  const openEditPositionModal = (pos) => {
    setEditingPosition({
      position_id: pos.position_id,
      position_title: pos.position_title || "",
      salary_grade: pos.salary_grade || "",
      min_salary: pos.min_salary || "",
      max_salary: pos.max_salary || "",
      employment_type: pos.employment_type || "Regular",
      typical_duration_days: pos.typical_duration_days || "",
      is_active: pos.is_active || false,
      created_at: pos.created_at,
      updated_at: pos.updated_at
    });
    setShowEditPositionModal(true);
  };

  const handleEditPositionChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setEditingPosition((prev) => ({
        ...prev,
        [name]: checked,
      }));
      return;
    }

    if (name === "employment_type") {
      setEditingPosition((prev) => ({
        ...prev,
        employment_type: value,
        salary_grade: value === "Regular" ? prev.salary_grade : "",
        min_salary: 0,
        max_salary: 0,
        typical_duration_days: value === "Regular" ? null : value === "Seasonal" ? 1 : 30,
      }));
      return;
    }

    if (name === "salary_grade" && editingPosition.employment_type === "Regular") {
      const salarySteps = SALARY_GRADE_TABLE[value] || [];
      setEditingPosition((prev) => ({
        ...prev,
        salary_grade: value,
        min_salary: salarySteps[0] || 0,
        max_salary: salarySteps[salarySteps.length - 1] || 0,
      }));
      return;
    }

    if (name === "typical_duration_days") {
      const numValue = parseInt(value);
      if (editingPosition.employment_type === "Seasonal" && (numValue < 1 || numValue > 29)) return;
      if (editingPosition.employment_type === "Contractual" && (numValue < 30 || numValue > 180)) return;
    }

    if ((name === "min_salary" || name === "max_salary") && editingPosition.employment_type !== "Regular") {
      const numValue = parseFloat(value);
      if (numValue < 0) return;
      setEditingPosition((prev) => ({
        ...prev,
        [name]: numValue,
      }));
      return;
    }

    setEditingPosition((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditPositionSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!editingPosition.employment_type) {
      showToast("Employment type is required", false);
      return;
    }

    // Validate salary range
    if (Number(editingPosition.min_salary) > Number(editingPosition.max_salary)) {
      showToast("Minimum salary cannot be greater than maximum salary", false);
      return;
    }

    // Validate duration days based on employment type
    if (
      editingPosition.employment_type === "Seasonal" &&
      (editingPosition.typical_duration_days < 1 || editingPosition.typical_duration_days > 29)
    ) {
      showToast("Seasonal positions must have duration between 1-29 days", false);
      return;
    }

    if (
      editingPosition.employment_type === "Contractual" &&
      (editingPosition.typical_duration_days < 30 || editingPosition.typical_duration_days > 180)
    ) {
      showToast("Contractual positions must have duration between 30-180 days", false);
      return;
    }

    try {
      // Format data before sending
      const formattedData = {
        ...editingPosition,
        min_salary: Number(editingPosition.min_salary),
        max_salary: Number(editingPosition.max_salary),
        typical_duration_days: editingPosition.typical_duration_days
          ? Number(editingPosition.typical_duration_days)
          : null,
      };

      await axios.patch(
        `http://127.0.0.1:8000/api/positions/${editingPosition.position_id}/`,
        formattedData
      );
      setShowEditPositionModal(false);
      showToast("Position updated successfully");
      fetchPositions();
    } catch (err) {
      console.error("Update position error", err);
      const errorMsg = err.response?.data?.detail || "Failed to update position";
      showToast(errorMsg, false);
    }
  };

  // c) Archive (single)
  const handleArchivePosition = async (id) => {
    if (!window.confirm("Archive this position?")) return;
    try {
      await axios.post(`http://127.0.0.1:8000/api/positions/${id}/archive/`);
      showToast("Position archived successfully");
      fetchPositions();
    } catch (err) {
      console.error("Archive position error", err);
      showToast("Failed to archive position", false);
    }
  };

  // d) Unarchive (single)
  const confirmUnarchivePosition = (id) => {
    setShowConfirmUnarchivePosition(id);
  };

  const handleUnarchivePosition = async (id) => {
    try {
      await axios.post(`http://127.0.0.1:8000/api/positions/${id}/unarchive/`);
      setShowConfirmUnarchivePosition(null);
      showToast("Position unarchived successfully");
      fetchPositions();
    } catch (err) {
      console.error("Unarchive position error", err);
      showToast("Failed to unarchive position", false);
    }
  };

  // e) Bulk unarchive
  const toggleSelectArchivedPosition = (id) => {
    setSelectedArchivedPositions((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const bulkUnarchivePositions = async () => {
    try {
      await Promise.all(
        selectedArchivedPositions.map((id) =>
          axios.post(`http://127.0.0.1:8000/api/positions/${id}/unarchive/`)
        )
      );
      showToast("Positions unarchived successfully");
      setSelectedArchivedPositions([]);
      fetchPositions();
    } catch (err) {
      console.error("Bulk unarchive positions error", err);
      showToast("Failed to unarchive positions", false);
    }
  };

  /***************************************************************************
   * Render Table for Employees or Positions
   ***************************************************************************/

  // 1) Employees Table
  const renderEmployeesTable = (rawData, isArchived = false) => {
    const { paginated, totalPages } = filterAndPaginate(rawData);

    if (loading) return <div className="hr-no-results">Loading employees...</div>;
    if (!paginated.length) return <div className="hr-no-results">No employees found.</div>;

    return (
      <div className="hr-department-table-wrapper">
        <div className="hr-department-table-scrollable">
          <table className="hr-department-table">
            <thead>
              <tr>
                {isArchived && <th>Select</th>}
                <th>Employee ID</th>
                <th>User ID</th>
                <th>Department ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Phone</th>
                <th>Employment Type</th>
                <th>Status</th>
                <th>Reports To</th>
                <th>Is Supervisor</th>
                <th>Created At</th>
                <th>Updated At</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((emp, index) => (
                <tr key={emp.employee_id} className={isArchived ? "hr-archived-row" : ""}>
                  {isArchived && (
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedArchivedEmployees.includes(emp.employee_id)}
                        onChange={() => toggleSelectArchivedEmployee(emp.employee_id)}
                      />
                    </td>
                  )}
                  <td>{emp.employee_id}</td>
                  <td>{emp.user_id}</td>
                  <td>{emp.dept_id}</td>
                  <td>{emp.first_name}</td>
                  <td>{emp.last_name}</td>
                  <td>{emp.phone}</td>
                  <td>
                    <span className={`hr-tag ${emp.employment_type.toLowerCase()}`}>
                      {emp.employment_type}
                    </span>
                  </td>
                  <td>
                    <span className={`hr-tag ${emp.status.toLowerCase()}`}>
                      {emp.status}
                    </span>
                  </td>
                  <td>{emp.reports_to || "—"}</td>
                  <td>
                    <span className={`hr-tag ${emp.is_supervisor ? 'yes' : 'no'}`}>
                      {emp.is_supervisor ? "Yes" : "No"}
                    </span>
                  </td>
                  <td>{emp.created_at}</td>
                  <td>{emp.updated_at}</td>
                  <td className="hr-department-actions">
                    <div
                      className="hr-department-dots"
                      onClick={() => setDotsMenuOpen(dotsMenuOpen === index ? null : index)}
                    >
                      ⋮
                      {dotsMenuOpen === index && (
                        <div className="hr-department-dropdown">
                          <div
                            className="hr-department-dropdown-item"
                            onClick={() => openEditEmployeeModal(emp)}
                          >
                            Edit
                          </div>
                          {!isArchived ? (
                            <div
                              className="hr-department-dropdown-item"
                              onClick={() => handleArchiveEmployee(emp.employee_id)}
                            >
                              Archive
                            </div>
                          ) : (
                            <div
                              className="hr-department-dropdown-item"
                              onClick={() => confirmUnarchiveEmployee(emp.employee_id)}
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
          {/* Pagination */}
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
      </div>
    );
  };

  // 2) Positions Table
  const renderPositionsTable = (rawData, isArchived = false) => {
    const { paginated, totalPages } = filterAndPaginate(rawData);

    if (loading) return <div className="hr-no-results">Loading positions...</div>;
    if (!paginated.length) return <div className="hr-no-results">No positions found.</div>;

    return (
      <div className="hr-department-table-wrapper">
        <div className="hr-department-table-scrollable">
          <table className="hr-department-table">
            <thead>
              <tr>
                {isArchived && <th>Select</th>}
                <th>Position ID</th>
                <th>Position Title</th>
                <th>Salary Grade</th>
                <th>Min Salary</th>
                <th>Max Salary</th>
                <th>Employment Type</th>
                <th>Typical Duration (Days)</th>
                <th>Is Active</th>
                <th>Created At</th>
                <th>Updated At</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((pos, index) => (
                <tr key={pos.position_id} className={isArchived ? "hr-archived-row" : ""}>
                  {isArchived && (
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedArchivedPositions.includes(pos.position_id)}
                        onChange={() => toggleSelectArchivedPosition(pos.position_id)}
                      />
                    </td>
                  )}
                  <td>{pos.position_id}</td>
                  <td>{pos.position_title}</td>
                  <td>{pos.salary_grade}</td>
                  <td>{pos.min_salary}</td>
                  <td>{pos.max_salary}</td>
                  <td>
                    <span className={`hr-tag ${pos.employment_type.toLowerCase()}`}>
                      {pos.employment_type}
                    </span>
                  </td>
                  <td>{pos.typical_duration_days}</td>
                  <td>
                    <span className={`hr-tag ${pos.is_active ? 'yes' : 'no'}`}>
                      {pos.is_active ? "Yes" : "No"}
                    </span>
                  </td>
                  <td>{pos.created_at}</td>
                  <td>{pos.updated_at}</td>
                  <td className="hr-department-actions">
                    <div
                      className="hr-department-dots"
                      onClick={() => setDotsMenuOpen(dotsMenuOpen === index ? null : index)}
                    >
                      ⋮
                      {dotsMenuOpen === index && (
                        <div className="hr-department-dropdown">
                          <div
                            className="hr-department-dropdown-item"
                            onClick={() => openEditPositionModal(pos)}
                          >
                            Edit
                          </div>
                          {!isArchived ? (
                            <div
                              className="hr-department-dropdown-item"
                              onClick={() => handleArchivePosition(pos.position_id)}
                            >
                              Archive
                            </div>
                          ) : (
                            <div
                              className="hr-department-dropdown-item"
                              onClick={() => confirmUnarchivePosition(pos.position_id)}
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
          {/* Pagination */}
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
      </div>
    );
  };

  /***************************************************************************
   * Main Render
   ***************************************************************************/
  return (
    <div className="hr-employee">
      <div className="hr-employee-body-content-container">
        <div className="hr-employee-scrollable">
          {/* Page Heading */}
          <div className="hr-department-heading">
            <h2><strong>Employees</strong></h2>
            <div className="hr-department-right-controls">
              {/* Search Field */}
              <div className="hr-department-search-wrapper">
                <FiSearch className="hr-department-search-icon" />
                <input
                  type="text"
                  className="hr-department-search"
                  placeholder="Search..."
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>

              {/* Sort Dropdown */}
              <select
                className="hr-department-filter"
                value={sortField}
                onChange={(e) => setSortField(e.target.value)}
              >
                <option value="all">No Sorting</option>
                {/* For example, you can do sort by 'first_name', 'position_title', etc. */}
                <option value="first_name">Sort by First Name (A-Z)</option>
                <option value="position_title">Sort by Position Title (A-Z)</option>
              </select>

              {/* Add Button + View Archived + Bulk Unarchive if needed */}
              {activeTab === "Employees" && (
                <>
                  <button className="hr-department-add-btn" onClick={handleAddEmployee}>
                    + Add Employee
                  </button>
                  <button
                    className="hr-department-add-btn"
                    onClick={() => {
                      setShowArchived(!showArchived);
                      setSelectedArchivedEmployees([]);
                    }}
                  >
                    {showArchived ? "View Active" : "View Archived"}
                  </button>
                  {showArchived && selectedArchivedEmployees.length > 0 && (
                    <button className="hr-department-add-btn" onClick={bulkUnarchiveEmployees}>
                      Unarchive Selected
                    </button>
                  )}
                </>
              )}

              {activeTab === "Positions" && (
                <>
                  <button className="hr-department-add-btn" onClick={handleAddPosition}>
                    + Add Position
                  </button>
                  <button
                    className="hr-department-add-btn"
                    onClick={() => {
                      setShowArchived(!showArchived);
                      setSelectedArchivedPositions([]);
                    }}
                  >
                    {showArchived ? "View Active" : "View Archived"}
                  </button>
                  {showArchived && selectedArchivedPositions.length > 0 && (
                    <button className="hr-department-add-btn" onClick={bulkUnarchivePositions}>
                      Unarchive Selected
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="hr-employee-header">
            <div className="hr-employee-tabs">
              <button
                className={activeTab === "Employees" ? "active" : ""}
                onClick={() => {
                  setActiveTab("Employees");
                  setShowArchived(false);
                  setSelectedArchivedEmployees([]);
                  setCurrentPage(1);
                }}
              >
                Employees <span className="hr-employee-count">{employees.length}</span>
              </button>
              <button
                className={activeTab === "Positions" ? "active" : ""}
                onClick={() => {
                  setActiveTab("Positions");
                  setShowArchived(false);
                  setSelectedArchivedPositions([]);
                  setCurrentPage(1);
                }}
              >
                Positions <span className="hr-employee-count">{positions.length}</span>
              </button>
            </div>
          </div>

          {/* Table Content */}
          <div className="hr-department-table-container">
            {activeTab === "Employees"
              ? renderEmployeesTable(
                  showArchived ? archivedEmployees : employees,
                  showArchived
                )
              : renderPositionsTable(
                  showArchived ? archivedPositions : positions,
                  showArchived
                )}
          </div>
        </div>
      </div>

      {/* ========== Employees: Add Modal ========== */}
      {showEmployeeModal && (
        <div className="hr-department-modal-overlay">
          <div className="hr-department-modal">
            <h3 style={{ marginBottom: "1rem" }}>Add New Employee</h3>
            <form onSubmit={submitEmployeeModal} className="hr-department-modal-form hr-two-col">
              <div className="form-group">
                <label>User ID</label>
                <input
                  type="text"
                  name="user_id"
                  value={newEmployee.user_id}
                  onChange={(e) => setNewEmployee({ ...newEmployee, user_id: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Department ID</label>
                <input
                  type="text"
                  name="dept_id"
                  value={newEmployee.dept_id}
                  onChange={(e) => setNewEmployee({ ...newEmployee, dept_id: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>First Name *</label>
                <input
                  type="text"
                  name="first_name"
                  value={newEmployee.first_name}
                  onChange={(e) => setNewEmployee({ ...newEmployee, first_name: e.target.value })}
                  required
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label>Last Name *</label>
                <input
                  type="text"
                  name="last_name"
                  value={newEmployee.last_name}
                  onChange={(e) => setNewEmployee({ ...newEmployee, last_name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={newEmployee.phone}
                  onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Employment Type</label>
                <select
                  name="employment_type"
                  value={newEmployee.employment_type}
                  onChange={(e) => setNewEmployee({ ...newEmployee, employment_type: e.target.value })}
                >
                  <option value="Regular">Regular</option>
                  <option value="Contractual">Contractual</option>
                  <option value="Seasonal">Seasonal</option>
                </select>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  name="status"
                  value={newEmployee.status}
                  onChange={(e) => setNewEmployee({ ...newEmployee, status: e.target.value })}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="form-group">
                <label>Reports To</label>
                <input
                  type="text"
                  name="reports_to"
                  value={newEmployee.reports_to}
                  onChange={(e) => setNewEmployee({ ...newEmployee, reports_to: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Is Supervisor?</label>
                <input
                  type="checkbox"
                  name="is_supervisor"
                  checked={newEmployee.is_supervisor}
                  onChange={(e) => setNewEmployee({ ...newEmployee, is_supervisor: e.target.checked })}
                />
              </div>

              <div className="hr-department-modal-buttons hr-two-col-buttons">
                <button type="submit" className="submit-btn">Add</button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowEmployeeModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========== Employees: Edit Modal ========== */}
      {showEditEmployeeModal && editingEmployee && (
        <div className="hr-department-modal-overlay">
          <div className="hr-department-modal">
            <h3 style={{ marginBottom: "1rem" }}>Edit Employee</h3>
            <form onSubmit={handleEditEmployeeSubmit} className="hr-department-modal-form hr-two-col">
              <div className="form-group">
                <label>Employee ID (read-only)</label>
                <input
                  type="text"
                  value={editingEmployee.employee_id}
                  disabled
                />
              </div>
              <div className="form-group">
                <label>User ID</label>
                <input
                  type="text"
                  name="user_id"
                  value={editingEmployee.user_id}
                  onChange={handleEditEmployeeChange}
                />
              </div>
              <div className="form-group">
                <label>Department ID</label>
                <input
                  type="text"
                  name="dept_id"
                  value={editingEmployee.dept_id}
                  onChange={handleEditEmployeeChange}
                />
              </div>
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={editingEmployee.first_name}
                  onChange={handleEditEmployeeChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={editingEmployee.last_name}
                  onChange={handleEditEmployeeChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={editingEmployee.phone}
                  onChange={handleEditEmployeeChange}
                />
              </div>
              <div className="form-group">
                <label>Employment Type</label>
                <select
                  name="employment_type"
                  value={editingEmployee.employment_type}
                  onChange={handleEditEmployeeChange}
                >
                  <option value="Regular">Regular</option>
                  <option value="Contractual">Contractual</option>
                  <option value="Seasonal">Seasonal</option>
                </select>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  name="status"
                  value={editingEmployee.status}
                  onChange={handleEditEmployeeChange}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="form-group">
                <label>Reports To</label>
                <input
                  type="text"
                  name="reports_to"
                  value={editingEmployee.reports_to}
                  onChange={handleEditEmployeeChange}
                />
              </div>
              <div className="form-group">
                <label>Is Supervisor?</label>
                <input
                  type="checkbox"
                  name="is_supervisor"
                  checked={editingEmployee.is_supervisor}
                  onChange={handleEditEmployeeChange}
                />
              </div>
              {/* If you wish to show created_at and updated_at read-only fields */}
              <div className="form-group">
                <label>Created At</label>
                <input type="text" value={editingEmployee.created_at || ""} disabled />
              </div>
              <div className="form-group">
                <label>Updated At</label>
                <input type="text" value={editingEmployee.updated_at || ""} disabled />
              </div>

              <div className="hr-department-modal-buttons hr-two-col-buttons">
                <button type="submit" className="submit-btn">Save</button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowEditEmployeeModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Unarchive (Employee) */}
      {showConfirmUnarchiveEmployee && (
        <div className="hr-department-modal-overlay">
          <div className="hr-department-modal">
            <h3>Unarchive Employee</h3>
            <p>Are you sure you want to unarchive this employee?</p>
            <div className="hr-department-modal-buttons">
              <button
                className="submit-btn"
                onClick={() => handleUnarchiveEmployee(showConfirmUnarchiveEmployee)}
              >
                Yes
              </button>
              <button
                className="cancel-btn"
                onClick={() => setShowConfirmUnarchiveEmployee(null)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========== Positions: Add Modal ========== */}
      {showPositionModal && (
        <div className="hr-department-modal-overlay">
          <div className="hr-department-modal">
            <h3 style={{ marginBottom: "1rem" }}>Add New Position</h3>
            <form onSubmit={submitPositionModal} className="hr-department-modal-form hr-two-col">
              <div className="form-group">
                <label>Position Title *</label>
                <input
                  type="text"
                  name="position_title"
                  value={newPosition.position_title}
                  onChange={handleAddPositionChange}
                  required
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label>Employment Type</label>
                <select
                  name="employment_type"
                  value={newPosition.employment_type}
                  onChange={handleAddPositionChange}
                >
                  <option value="Regular">Regular</option>
                  <option value="Contractual">Contractual</option>
                  <option value="Seasonal">Seasonal</option>
                </select>
              </div>

              {newPosition.employment_type === "Regular" ? (
                <>
                  <div className="form-group">
                    <label>Salary Grade</label>
                    <select
                      name="salary_grade"
                      value={newPosition.salary_grade}
                      onChange={handleAddPositionChange}
                    >
                      <option value="">Select Salary Grade</option>
                      {[...Array(33)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Minimum Salary</label>
                    <input type="number" name="min_salary" value={newPosition.min_salary} disabled />
                  </div>
                  <div className="form-group">
                    <label>Maximum Salary</label>
                    <input type="number" name="max_salary" value={newPosition.max_salary} disabled />
                  </div>
                </>
              ) : (
                <>
                  <div className="form-group">
                    <label>Daily Rate (Min)</label>
                    <input
                      type="number"
                      name="min_salary"
                      value={newPosition.min_salary}
                      onChange={handleAddPositionChange}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="form-group">
                    <label>Daily Rate (Max)</label>
                    <input
                      type="number"
                      name="max_salary"
                      value={newPosition.max_salary}
                      onChange={handleAddPositionChange}
                      min="0"
                      step="0.01"
                    />
                  </div>
                </>
              )}

              {newPosition.employment_type !== "Regular" && (
                <div className="form-group">
                  <label>Typical Duration (Days)</label>
                  <input
                    type="number"
                    name="typical_duration_days"
                    value={newPosition.typical_duration_days || ""}
                    onChange={handleAddPositionChange}
                    min={newPosition.employment_type === "Seasonal" ? 1 : 30}
                    max={newPosition.employment_type === "Seasonal" ? 29 : 180}
                  />
                </div>
              )}

              <div className="form-group">
                <label>Is Active?</label>
                <input
                  type="checkbox"
                  name="is_active"
                  checked={newPosition.is_active}
                  onChange={(e) =>
                    setNewPosition((prev) => ({
                      ...prev,
                      is_active: e.target.checked,
                    }))
                  }
                />
              </div>

              <div className="hr-department-modal-buttons hr-two-col-buttons">
                <button type="submit" className="submit-btn">Add</button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowPositionModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========== Positions: Edit Modal ========== */}
      {showEditPositionModal && editingPosition && (
        <div className="hr-department-modal-overlay">
          <div className="hr-department-modal">
            <h3 style={{ marginBottom: "1rem" }}>Edit Position</h3>
            <form onSubmit={handleEditPositionSubmit} className="hr-department-modal-form hr-two-col">
              <div className="form-group">
                <label>Position ID</label>
                <input type="text" value={editingPosition.position_id} disabled />
              </div>
              <div className="form-group">
                <label>Position Title</label>
                <input type="text" value={editingPosition.position_title} disabled />
              </div>
              <div className="form-group">
                <label>Employment Type</label>
                <select
                  name="employment_type"
                  value={editingPosition.employment_type}
                  onChange={handleEditPositionChange}
                >
                  <option value="Regular">Regular</option>
                  <option value="Contractual">Contractual</option>
                  <option value="Seasonal">Seasonal</option>
                </select>
              </div>

              {editingPosition.employment_type === "Regular" ? (
                <>
                  <div className="form-group">
                    <label>Salary Grade</label>
                    <select
                      name="salary_grade"
                      value={editingPosition.salary_grade}
                      onChange={handleEditPositionChange}
                    >
                      <option value="">Select Salary Grade</option>
                      {[...Array(33)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Minimum Salary</label>
                    <input type="number" name="min_salary" value={editingPosition.min_salary} disabled />
                  </div>
                  <div className="form-group">
                    <label>Maximum Salary</label>
                    <input type="number" name="max_salary" value={editingPosition.max_salary} disabled />
                  </div>
                </>
              ) : (
                <>
                  <div className="form-group">
                    <label>Daily Rate (Min)</label>
                    <input
                      type="number"
                      name="min_salary"
                      value={editingPosition.min_salary}
                      onChange={handleEditPositionChange}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="form-group">
                    <label>Daily Rate (Max)</label>
                    <input
                      type="number"
                      name="max_salary"
                      value={editingPosition.max_salary}
                      onChange={handleEditPositionChange}
                      min="0"
                      step="0.01"
                    />
                  </div>
                </>
              )}

              {editingPosition.employment_type !== "Regular" && (
                <div className="form-group">
                  <label>Typical Duration (Days)</label>
                  <input
                    type="number"
                    name="typical_duration_days"
                    value={editingPosition.typical_duration_days || ""}
                    onChange={handleEditPositionChange}
                    min={editingPosition.employment_type === "Seasonal" ? 1 : 30}
                    max={editingPosition.employment_type === "Seasonal" ? 29 : 180}
                  />
                </div>
              )}

              <div className="form-group">
                <label>Is Active</label>
                <input
                  type="checkbox"
                  name="is_active"
                  checked={editingPosition.is_active}
                  onChange={handleEditPositionChange}
                />
              </div>
              <div className="form-group">
                <label>Created At</label>
                <input type="text" value={editingPosition.created_at || ""} disabled />
              </div>
              <div className="form-group">
                <label>Updated At</label>
                <input type="text" value={editingPosition.updated_at || ""} disabled />
              </div>
              <div className="hr-department-modal-buttons hr-two-col-buttons">
                <button type="submit" className="submit-btn">Save</button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowEditPositionModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Unarchive (Position) */}
      {showConfirmUnarchivePosition && (
        <div className="hr-department-modal-overlay">
          <div className="hr-department-modal">
            <h3>Unarchive Position</h3>
            <p>Are you sure you want to unarchive this position?</p>
            <div className="hr-department-modal-buttons">
              <button
                className="submit-btn"
                onClick={() => handleUnarchivePosition(showConfirmUnarchivePosition)}
              >
                Yes
              </button>
              <button
                className="cancel-btn"
                onClick={() => setShowConfirmUnarchivePosition(null)}
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

export default Employees;