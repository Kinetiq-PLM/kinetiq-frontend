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
  const [departmentSuperiors, setDepartmentSuperiors] = useState([]);

  // Add/Edit modals for Employees
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showEditEmployeeModal, setShowEditEmployeeModal] = useState(false);
  const [showConfirmUnarchiveEmployee, setShowConfirmUnarchiveEmployee] = useState(null);

  // The new employee to add
  const [newEmployee, setNewEmployee] = useState({
    user_id: "", // Auto-generated
    dept_id: "",
    dept_name: "",
    position_id: "",
    position_title: "",
    first_name: "",
    last_name: "",
    phone: "",
    employment_type: "Regular",
    status: "Active",
    reports_to: "",
    is_supervisor: false,
    created_at: "", // Auto-generated
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

  // SALARY_GRADE_TABLE constant

  const DAILY_RATE_TABLE = {
    "DR-1-1": [500, 600],
    "DR-1-2": [600, 700],

    "DR-2-1": [700, 800],
    "DR-2-2": [800, 900],

    "DR-3-1": [900, 1100],
    "DR-3-2": [1100, 1300],

    "DR-4-1": [1300, 1500],
    "DR-4-2": [1500, 1700],

    "DR-5-1": [1700, 1850],
    "DR-5-2": [1850, 2000]
  };

  const SALARY_GRADE_TABLE = {
    "SG-1-1":  [14061, 14164],
    "SG-1-2":  [14164, 14278],
    "SG-1-3":  [14278, 14393],
    "SG-1-4":  [14393, 14509],
    "SG-1-5":  [14509, 14626],
    "SG-1-6":  [14626, 14743],
    "SG-1-7":  [14743, 14862],
    "SG-1-8":  [14862],
  
    "SG-2-1":  [14863, 15035],
    "SG-2-2":  [15035, 15146],
    "SG-2-3":  [15146, 15258],
    "SG-2-4":  [15258, 15371],
    "SG-2-5":  [15371, 15484],
    "SG-2-6":  [15484, 15599],
    "SG-2-7":  [15599, 15714],
    "SG-2-8":  [15714],
  
    "SG-3-1":  [15715, 15971],
    "SG-3-2":  [15971, 16088],
    "SG-3-3":  [16088, 16208],
    "SG-3-4":  [16208, 16329],
    "SG-3-5":  [16329, 16448],
    "SG-3-6":  [16448, 16571],
    "SG-3-7":  [16571, 16693],
    "SG-3-8":  [16693],
  
    "SG-4-1":  [16694, 16958],
    "SG-4-2":  [16958, 17084],
    "SG-4-3":  [17084, 17209],
    "SG-4-4":  [17209, 17337],
    "SG-4-5":  [17337, 17464],
    "SG-4-6":  [17464, 17594],
    "SG-4-7":  [17594, 17724],
    "SG-4-8":  [17724],
  
    "SG-5-1":  [17725, 18000],
    "SG-5-2":  [18000, 18133],
    "SG-5-3":  [18133, 18267],
    "SG-5-4":  [18267, 18401],
    "SG-5-5":  [18401, 18538],
    "SG-5-6":  [18538, 18676],
    "SG-5-7":  [18676, 18813],
    "SG-5-8":  [18813],
  
    "SG-6-1":  [18814, 19098],
    "SG-6-2":  [19098, 19239],
    "SG-6-3":  [19239, 19383],
    "SG-6-4":  [19383, 19526],
    "SG-6-5":  [19526, 19670],
    "SG-6-6":  [19670, 19816],
    "SG-6-7":  [19816, 19963],
    "SG-6-8":  [19963],
  
    "SG-7-1":  [19964, 20258],
    "SG-7-2":  [20258, 20408],
    "SG-7-3":  [20408, 20560],
    "SG-7-4":  [20560, 20711],
    "SG-7-5":  [20711, 20865],
    "SG-7-6":  [20865, 21019],
    "SG-7-7":  [21019, 21175],
    "SG-7-8":  [21175],
  
    "SG-8-1":  [21176, 21642],
    "SG-8-2":  [21642, 21839],
    "SG-8-3":  [21839, 22035],
    "SG-8-4":  [22035, 22234],
    "SG-8-5":  [22234, 22435],
    "SG-8-6":  [22435, 22638],
    "SG-8-7":  [22638, 22843],
    "SG-8-8":  [22843],
  
    "SG-9-1":  [22844, 23411],
    "SG-9-2":  [23411, 23599],
    "SG-9-3":  [23599, 23788],
    "SG-9-4":  [23788, 23978],
    "SG-9-5":  [23978, 24170],
    "SG-9-6":  [24170, 24364],
    "SG-9-7":  [24364, 24558],
    "SG-9-8":  [24558],
  
    "SG-10-1": [24559, 25790],
    "SG-10-2": [25790, 25996],
    "SG-10-3": [25996, 26203],
    "SG-10-4": [26203, 26412],
    "SG-10-5": [26412, 26623],
    "SG-10-6": [26623, 26835],
    "SG-10-7": [26835, 27050],
    "SG-10-8": [27050],
  
    "SG-11-1": [27051, 30308],
    "SG-11-2": [30308, 30597],
    "SG-11-3": [30597, 30889],
    "SG-11-4": [30889, 31185],
    "SG-11-5": [31185, 31486],
    "SG-11-6": [31486, 31790],
    "SG-11-7": [31790, 32099],
    "SG-11-8": [32099],
  
    "SG-12-1": [32100, 32529],
    "SG-12-2": [32529, 32817],
    "SG-12-3": [32817, 33108],
    "SG-12-4": [33108, 33403],
    "SG-12-5": [33403, 33702],
    "SG-12-6": [33702, 34004],
    "SG-12-7": [34004, 34310],
    "SG-12-8": [34310],
  
    "SG-13-1": [34311, 34733],
    "SG-13-2": [34733, 35049],
    "SG-13-3": [35049, 35369],
    "SG-13-4": [35369, 35694],
    "SG-13-5": [35694, 36022],
    "SG-13-6": [36022, 36354],
    "SG-13-7": [36354, 36691],
    "SG-13-8": [36691],
  
    "SG-14-1": [36692, 37384],
    "SG-14-2": [37384, 37749],
    "SG-14-3": [37749, 38118],
    "SG-14-4": [38118, 38491],
    "SG-14-5": [38491, 38869],
    "SG-14-6": [38869, 39252],
    "SG-14-7": [39252, 39640],
    "SG-14-8": [39640],
  
    "SG-15-1": [39641, 40604],
    "SG-15-2": [40604, 41006],
    "SG-15-3": [41006, 41413],
    "SG-15-4": [41413, 41824],
    "SG-15-5": [41824, 42241],
    "SG-15-6": [42241, 42662],
    "SG-15-7": [42662, 43090],
    "SG-15-8": [43090],
  
    "SG-16-1": [43091, 43996],
    "SG-16-2": [43996, 44438],
    "SG-16-3": [44438, 44885],
    "SG-16-4": [44885, 45338],
    "SG-16-5": [45338, 45796],
    "SG-16-6": [45796, 46261],
    "SG-16-7": [46261, 46730],
    "SG-16-8": [46730],
  
    "SG-17-1": [46731, 47727],
    "SG-17-2": [47727, 48213],
    "SG-17-3": [48213, 48705],
    "SG-17-4": [48705, 49203],
    "SG-17-5": [49203, 49708],
    "SG-17-6": [49708, 50218],
    "SG-17-7": [50218, 50735],
    "SG-17-8": [50735],
  
    "SG-18-1": [50736, 51832],
    "SG-18-2": [51832, 52367],
    "SG-18-3": [52367, 52907],
    "SG-18-4": [52907, 53456],
    "SG-18-5": [53456, 54010],
    "SG-18-6": [54010, 54572],
    "SG-18-7": [54572, 55140],
    "SG-18-8": [55140],
  
    "SG-19-1": [55141, 57165],
    "SG-19-2": [57165, 57953],
    "SG-19-3": [57953, 58753],
    "SG-19-4": [58753, 59567],
    "SG-19-5": [59567, 60394],
    "SG-19-6": [60394, 61235],
    "SG-19-7": [61235, 62089],
    "SG-19-8": [62089],
  
    "SG-20-1": [62090, 63842],
    "SG-20-2": [63842, 64732],
    "SG-20-3": [64732, 65637],
    "SG-20-4": [65637, 66557],
    "SG-20-5": [66557, 67479],
    "SG-20-6": [67479, 68409],
    "SG-20-7": [68409, 69342],
    "SG-20-8": [69342],
  
    "SG-21-1": [69343, 71000],
    "SG-21-2": [71000, 72004],
    "SG-21-3": [72004, 73024],
    "SG-21-4": [73024, 74061],
    "SG-21-5": [74061, 75115],
    "SG-21-6": [75115, 76151],
    "SG-21-7": [76151, 77239],
    "SG-21-8": [77239],
  
    "SG-22-1": [77240, 79277],
    "SG-22-2": [79277, 80411],
    "SG-22-3": [80411, 81564],
    "SG-22-4": [81564, 82735],
    "SG-22-5": [82735, 83887],
    "SG-22-6": [83887, 85096],
    "SG-22-7": [85096, 86324],
    "SG-22-8": [86324],
  
    "SG-23-1": [86325, 88574],
    "SG-23-2": [88574, 89855],
    "SG-23-3": [89855, 91163],
    "SG-23-4": [91163, 92592],
    "SG-23-5": [92592, 94043],
    "SG-23-6": [94043, 95518],
    "SG-23-7": [95518, 96955],
    "SG-23-8": [96955],
  
    "SG-24-1": [96956, 99721],
    "SG-24-2": [99721, 101283],
    "SG-24-3": [101283, 102871],
    "SG-24-4": [102871, 104483],
    "SG-24-5": [104483, 106123],
    "SG-24-6": [106123, 107739],
    "SG-24-7": [107739, 109431],
    "SG-24-8": [109431],
  
    "SG-25-1": [109432, 113476],
    "SG-25-2": [113476, 115254],
    "SG-25-3": [115254, 117062],
    "SG-25-4": [117062, 118899],
    "SG-25-5": [118899, 120766],
    "SG-25-6": [120766, 122664],
    "SG-25-7": [122664, 124591],
    "SG-25-8": [124591],
  
    "SG-26-1": [124592, 128228],
    "SG-26-2": [128228, 130238],
    "SG-26-3": [130238, 132280],
    "SG-26-4": [132280, 134356],
    "SG-26-5": [134356, 136465],
    "SG-26-6": [136465, 138608],
    "SG-26-7": [138608, 140788],
    "SG-26-8": [140788],
  
    "SG-27-1": [140789, 144897],
    "SG-27-2": [144897, 147169],
    "SG-27-3": [147169, 149407],
    "SG-27-4": [149407, 151752],
    "SG-27-5": [151752, 153850],
    "SG-27-6": [153850, 156267],
    "SG-27-7": [156267, 158723],
    "SG-27-8": [158723],
  
    "SG-28-1": [158724, 162988],
    "SG-28-2": [162988, 165548],
    "SG-28-3": [165548, 167994],
    "SG-28-4": [167994, 170634],
    "SG-28-5": [170634, 173320],
    "SG-28-6": [173320, 175803],
    "SG-28-7": [175803, 178572],
    "SG-28-8": [178572],
  
    "SG-29-1": [178573, 183332],
    "SG-29-2": [183332, 186218],
    "SG-29-3": [186218, 189151],
    "SG-29-4": [189151, 192131],
    "SG-29-5": [192131, 194797],
    "SG-29-6": [194797, 197870],
    "SG-29-7": [197870, 200993],
    "SG-29-8": [200993],
  
    "SG-30-1": [200994, 206401],
    "SG-30-2": [206401, 209558],
    "SG-30-3": [209558, 212766],
    "SG-30-4": [212766, 216022],
    "SG-30-5": [216022, 219434],
    "SG-30-6": [219434, 222797],
    "SG-30-7": [222797, 226319],
    "SG-30-8": [226319],
  
    "SG-31-1": [226320, 298773],
    "SG-31-2": [298773, 304464],
    "SG-31-3": [304464, 310119],
    "SG-31-4": [310119, 315883],
    "SG-31-5": [315883, 321846],
    "SG-31-6": [321846, 327895],
    "SG-31-7": [327895, 334059],
    "SG-31-8": [334059],
  
    "SG-32-1": [334060, 354743],
    "SG-32-2": [354743, 361736],
    "SG-32-3": [361736, 368694],
    "SG-32-4": [368694, 375969],
    "SG-32-5": [375969, 383391],
    "SG-32-6": [383391, 390963],
    "SG-32-7": [390963, 398686],
    "SG-32-8": [398686],
  
    "SG-33-1": [398687, 451713],
    "SG-33-2": [451713]
  };
  

  // Add this function after the existing SALARY_GRADE_TABLE constant
  const calculateContractualSalaryGrade = (minSalary, maxSalary) => {
    let tier = '';
    let sublevel = '';
    
    // Determine tier based on min_salary
    if (minSalary >= 500 && minSalary < 700) {
      tier = 'DR-1-';
      // Determine sublevel based on max_salary
      if (maxSalary <= 600) sublevel = '1';
      else if (maxSalary <= 700) sublevel = '2';
      else sublevel = '3';
    } 
    else if (minSalary >= 700 && minSalary < 900) {
      tier = 'DR-2-';
      if (maxSalary <= 800) sublevel = '1';
      else if (maxSalary <= 900) sublevel = '2';
      else sublevel = '3';
    }
    else if (minSalary >= 900 && minSalary < 1300) {
      tier = 'DR-3-';
      if (maxSalary <= 1100) sublevel = '1';
      else if (maxSalary <= 1300) sublevel = '2';
      else sublevel = '3';
    }
    else if (minSalary >= 1300 && minSalary < 1700) {
      tier = 'DR-4-';
      if (maxSalary <= 1500) sublevel = '1';
      else if (maxSalary <= 1700) sublevel = '2';
      else sublevel = '3';
    }
    else if (minSalary >= 1700 && minSalary <= 2000) {
      tier = 'DR-5-';
      if (maxSalary <= 1850) sublevel = '1';
      else if (maxSalary <= 2000) sublevel = '2';
      else sublevel = '3';
    }
    
    return tier && sublevel ? tier + sublevel : '';
  };

  // Add this function to format regular position salary grades
  const formatRegularSalaryGrade = (grade, salary) => {
    if (!grade || !salary) return '';
    
    // Convert grade to number for safety
    const gradeNum = parseInt(grade);
    if (isNaN(gradeNum) || gradeNum < 1 || gradeNum > 33) return '';
    
    // Get the salary steps for this grade
    const salarySteps = SALARY_GRADE_TABLE[gradeNum] || [];
    if (!salarySteps.length) return '';
    
    // Find which step the salary matches
    const step = salarySteps.findIndex(step => step === salary) + 1;
    
    // If found, return formatted SG-grade-step, otherwise just grade
    return step > 0 ? `SG-${gradeNum}-${step}` : `SG-${gradeNum}`;
  };

  // Add departments state
  const [departments, setDepartments] = useState([]);

  /***************************************************************************
   * 1) Fetch: Employees (active + archived)
   ***************************************************************************/
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const [activeRes, archivedRes] = await Promise.all([
        axios.get("http://127.0.0.1:8000/api/employees/employees/"),
        axios.get("http://127.0.0.1:8000/api/employees/employees/archived/")
      ]);
      setEmployees(activeRes.data);
      setArchivedEmployees(archivedRes.data);
    } catch (err) {
      console.error("Full error response:", err.response);
      const errorDetail = err.response?.data?.detail || 
                         JSON.stringify(err.response?.data || {});
      showToast(`Error: ${errorDetail}`, false);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartmentSuperiors = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/department_superiors/department-superiors/");
      setDepartmentSuperiors(response.data.filter(sup => !sup.is_archived && sup.status === "Active"));
    } catch (err) {
      console.error("Fetch department superiors error:", err);
      showToast("Failed to fetch department superiors", false);
    }
  };

  /***************************************************************************
   * 2) Fetch: Positions (active + archived)
   ***************************************************************************/
  const fetchPositions = async () => {
    setLoading(true);
    try {
      const [activeRes, archivedRes] = await Promise.all([
        axios.get("http://127.0.0.1:8000/api/positions/positions/"),
        axios.get("http://127.0.0.1:8000/api/positions/positions/archived/")
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

  const fetchDepartments = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/departments/department/");
      
      // Handle both array and object responses
      const departmentsData = response.data;
      let departments = [];
  
      if (Array.isArray(departmentsData)) {
        departments = departmentsData;
      } else if (departmentsData && typeof departmentsData === 'object') {
        // If response is an object, try to extract departments array
        // This handles cases where the data might be nested
        departments = departmentsData.departments || Object.values(departmentsData);
      }
  
      if (!Array.isArray(departments)) {
        throw new Error('Invalid departments data format');
      }
  
      // Filter out archived departments and update state
      setDepartments(departments.filter(dept => !dept.is_archived));
  
    } catch (err) {
      console.error("Fetch departments error:", err);
      showToast("Failed to fetch departments", false);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchPositions();
    fetchDepartments();
    fetchDepartmentSuperiors(); 
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
    const filtered = dataArray.filter((item) =>
      Object.values(item).some((val) =>
        val?.toString().toLowerCase().includes(searchTerm)
      )
    );

    // Sort if needed
    if (sortField !== "all") {
      filtered.sort((a, b) => {
        // Handle null/undefined values
        const valA = a[sortField]?.toString().toLowerCase() ?? "";
        const valB = b[sortField]?.toString().toLowerCase() ?? "";

        // Handle numeric fields
        if (sortField === "salary_grade" || sortField === "employee_id" || sortField === "position_id") {
          return Number(valA) - Number(valB);
        }

        // Handle date fields
        if (sortField === "created_at" || sortField === "updated_at") {
          return new Date(valA) - new Date(valB);
        }

        // Handle string fields with special consideration for nullable fields
        if (!valA && !valB) return 0;
        if (!valA) return 1;
        if (!valB) return -1;
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
      user_id: "", // Auto-generated
      dept_id: "",
      dept_name: "",
      position_id: "",
      position_title: "",
      first_name: "",
      last_name: "",
      phone: "",
      employment_type: "Regular",
      status: "Active",
      reports_to: "",
      is_supervisor: false,
      created_at: "", // Auto-generated
    });
    setShowEmployeeModal(true);
  };

  const handleEmployeeChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for phone field
    if (name === "phone") {
      // Only allow digits
      const digitsOnly = value.replace(/\D/g, '');
      
      // Ensure first digit is 0
      let formattedPhone = digitsOnly;
      if (formattedPhone.length > 0 && formattedPhone[0] !== '0') {
        formattedPhone = '0' + formattedPhone.substring(0, 10);
      } else {
        formattedPhone = formattedPhone.substring(0, 11);
      }
      
      setNewEmployee(prev => ({
        ...prev,
        [name]: formattedPhone
      }));
      return;
    }
    
    setNewEmployee((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitEmployeeModal = async (e) => {
    e.preventDefault();
  
    // Basic validation
    if (!newEmployee.first_name.trim() || !newEmployee.last_name.trim()) {
      showToast("First name and last name are required", false);
      return;
    }
  
    if (!newEmployee.dept_id || !newEmployee.position_id) {
      showToast("Department and Position are required", false);
      return;
    }
  
    try {
      const employeeData = {
        // user_id: newEmployee.user_id || `TEMP-USER-${Date.now().toString(36)}`,
        user_id: newEmployee.user_id || "",
        dept_id: newEmployee.dept_id,
        dept_name: newEmployee.dept_name || "",
        position_id: newEmployee.position_id,
        position_name: newEmployee.position_title || "",
        first_name: newEmployee.first_name.trim(),
        last_name: newEmployee.last_name.trim(),
        phone: newEmployee.phone.trim(),
        employment_type: newEmployee.employment_type,
        status: newEmployee.status,
        // Important: Make sure reports_to is null, not an empty string
        reports_to: newEmployee.reports_to || null, // Don't trim the ID, just use it as is
        is_supervisor: newEmployee.is_supervisor
      };
  
      // Add logging to debug
      console.log("Sending employee data:", JSON.stringify(employeeData));
  
      const response = await axios.post("http://127.0.0.1:8000/api/employees/employees/", employeeData);
      setShowEmployeeModal(false);
      showToast("Employee added successfully");
      fetchEmployees();
    } catch (err) {
      console.error("Add employee error:", err);
      // Improve error handling to show more details
      const errorMsg = err.response?.data?.detail || 
                      (err.response?.data ? JSON.stringify(err.response.data) : "Failed to add employee");
      showToast(errorMsg, false);
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
    
    // Special handling for phone field
    if (name === "phone") {
      // Only allow digits
      const digitsOnly = value.replace(/\D/g, '');
      
      // Ensure first digit is 0
      let formattedPhone = digitsOnly;
      if (formattedPhone.length > 0 && formattedPhone[0] !== '0') {
        formattedPhone = '0' + formattedPhone.substring(0, 10);
      } else {
        formattedPhone = formattedPhone.substring(0, 11);
      }
      
      setEditingEmployee(prev => ({
        ...prev,
        [name]: formattedPhone
      }));
      return;
    }
    
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
        `http://127.0.0.1:8000/api/employees/employees/${editingEmployee.employee_id}/`,
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
      await axios.post(`http://127.0.0.1:8000/api/employees/employees/${id}/archive/`);
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
      await axios.post(`http://127.0.0.1:8000/api/employees/employees/${id}/unarchive/`);
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
          axios.post(`http://127.0.0.1:8000/api/employees/employees/${id}/unarchive/`)
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
        salary_grade: "", // Reset salary grade when employment type changes
        min_salary: 0,
        max_salary: 0,
        typical_duration_days: value === "Regular" ? null : value === "Seasonal" ? 1 : 30,
      }));
      return;
    }

    if (name === "salary_grade") {
      if (newPosition.employment_type === "Regular") {
        const salaryRange = SALARY_GRADE_TABLE[value] || [];
        setNewPosition((prev) => ({
          ...prev,
          salary_grade: value,
          min_salary: salaryRange[0] || 0,
          max_salary: salaryRange[1] || 0,
        }));
      } else {
        // For Contractual/Seasonal
        const dailyRateRange = DAILY_RATE_TABLE[value] || [];
        setNewPosition((prev) => ({
          ...prev,
          salary_grade: value,
          min_salary: dailyRateRange[0] || 0,
          max_salary: dailyRateRange[1] || 0,
        }));
      }
      return;
    }

    if ((name === "min_salary" || name === "max_salary") && newPosition.employment_type !== "Regular") {
      const numValue = parseFloat(value);
      if (numValue >= 0) {
        const updatedPosition = {
          ...newPosition,
          [name]: numValue
        };
        
        // Update the other salary value if needed
        let otherField = name === "min_salary" ? "max_salary" : "min_salary";
        if (name === "min_salary" && numValue > newPosition.max_salary) {
          updatedPosition.max_salary = numValue;
        } else if (name === "max_salary" && numValue < newPosition.min_salary) {
          updatedPosition.min_salary = numValue;
        }
        
        // Calculate salary grade for contractual/seasonal positions
        if (updatedPosition.min_salary > 0 && updatedPosition.max_salary > 0) {
          updatedPosition.salary_grade = calculateContractualSalaryGrade(
            updatedPosition.min_salary, 
            updatedPosition.max_salary
          );
        }
        
        setNewPosition(updatedPosition);
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

    // Enhanced validation for all required fields
    const validationErrors = [];
    
    // Always required fields
    if (!newPosition.position_title) validationErrors.push("Position Title");
    if (!newPosition.employment_type) validationErrors.push("Employment Type");
    
    // Fields required based on employment type
    if (newPosition.employment_type === "Regular") {
      if (!newPosition.salary_grade) validationErrors.push("Salary Grade");
    } else {
      // For Contractual and Seasonal
      if (!newPosition.min_salary) validationErrors.push("Daily Rate (Min)");
      if (!newPosition.max_salary) validationErrors.push("Daily Rate (Max)");
      if (!newPosition.typical_duration_days) validationErrors.push("Typical Duration (Days)");
    }

    // Show validation errors if any
    if (validationErrors.length > 0) {
      showToast(`Please fill these required fields: ${validationErrors.join(", ")}`, false);
      return;
    }

    // Validate salary range
    if (Number(newPosition.min_salary) > Number(newPosition.max_salary)) {
      showToast("Minimum salary cannot be greater than maximum salary", false);
      return;
    }

    try {
      await axios.post("http://127.0.0.1:8000/api/positions/positions/", newPosition);
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

    if (name === "salary_grade") {
      if (editingPosition.employment_type === "Regular") {
        const salaryRange = SALARY_GRADE_TABLE[value] || [];
        setEditingPosition((prev) => ({
          ...prev,
          salary_grade: value,
          min_salary: salaryRange[0] || 0,
          max_salary: salaryRange[1] || 0,
        }));
      } else {
        // For Contractual/Seasonal
        const dailyRateRange = DAILY_RATE_TABLE[value] || [];
        setEditingPosition((prev) => ({
          ...prev,
          salary_grade: value,
          min_salary: dailyRateRange[0] || 0,
          max_salary: dailyRateRange[1] || 0,
        }));
      }
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
      
      const updatedPosition = {
        ...editingPosition,
        [name]: numValue
      };
      
      // Calculate salary grade for contractual/seasonal positions
      if (updatedPosition.min_salary > 0 && updatedPosition.max_salary > 0) {
        updatedPosition.salary_grade = calculateContractualSalaryGrade(
          updatedPosition.min_salary, 
          updatedPosition.max_salary
        );
      }
      
      setEditingPosition(updatedPosition);
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
        `http://127.0.0.1:8000/api/positions/positions/${editingPosition.position_id}/`,
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
      await axios.post(`http://127.0.0.1:8000/api/positions/positions/${id}/archive/`);
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
      await axios.post(`http://127.0.0.1:8000/api/positions/positions/${id}/unarchive/`);
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
          axios.post(`http://127.0.0.1:8000/api/positions/positions/${id}/unarchive/`)
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
  
    if (loading) return <div className="hr-employee-no-results">Loading employees...</div>;
    if (!paginated.length) return <div className="hr-employee-no-results">No employees found.</div>;
  
    return (
      <>
        <div className="hr-employee-table-wrapper">
          <div className="hr-employee-table-scrollable">
          <table className="hr-employee-table">
            <thead>
              <tr>
                {isArchived && <th>Select</th>}
                <th>Employee ID</th>
                <th>User ID</th>
                <th>Department ID</th>
                <th>Department Name</th>
                <th>Position ID</th>
                <th>Position Title</th>
                <th>Salary Grade</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Phone</th>
                <th>Employment Type</th> {/* Added column */}
                <th>Reports To</th> {/* Added column */}
                <th>Status</th>
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
                  <td>{emp.dept_name || "—"}</td>
                  <td>{emp.position_id || "—"}</td>
                  <td>{emp.position_title || "—"}</td>
                  <td>{emp.salary_grade || "—"}</td>
                  <td>{emp.first_name}</td>
                  <td>{emp.last_name}</td>
                  <td>{emp.phone}</td>
                  <td>
                    <span className={`hr-tag ${(emp.employment_type || 'regular').toLowerCase()}`}>
                      {emp.employment_type || 'Regular'} {/* Provide default text */}
                    </span>
                  </td>
                  <td>{emp.reports_to || "—"}</td>
                  <td>
                    <span className={`hr-tag ${emp.status.toLowerCase()}`}>
                      {emp.status}
                    </span>
                  </td>
                  <td>
                    <span className={`hr-tag ${emp.is_supervisor ? "yes" : "no"}`}>
                      {emp.is_supervisor ? "Yes" : "No"}
                    </span>
                  </td>
                  <td>{emp.created_at}</td>
                  <td>{emp.updated_at}</td>
                  <td className="hr-employee-actions">
                    <div
                      className="hr-employee-dots"
                      onClick={() => setDotsMenuOpen(dotsMenuOpen === index ? null : index)}
                    >
                      ⋮
                      {dotsMenuOpen === index && (
                        <div className="hr-employee-dropdown">
                          <div
                            className="hr-employee-dropdown-item"
                            onClick={() => openEditEmployeeModal(emp)}
                          >
                            Edit
                          </div>
                          {!isArchived ? (
                            <div
                              className="hr-employee-dropdown-item"
                              onClick={() => handleArchiveEmployee(emp.employee_id)}
                            >
                              Archive
                            </div>
                          ) : (
                            <div
                              className="hr-employee-dropdown-item"
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
          </div>
        </div>
        <div className="hr-employee-pagination">
          <button 
            className="hr-employee-pagination-arrow" 
            onClick={() => setCurrentPage(1)} 
            disabled={currentPage === 1}
          >
            &#171; {/* Double left arrow */}
          </button>
          
          <button 
            className="hr-employee-pagination-arrow" 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
            disabled={currentPage === 1}
          >
            &#8249; {/* Single left arrow */}
          </button>
          
          <div className="hr-employee-pagination-numbers">
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
                  pageNumbers.push(<span key="ellipsis1" className="hr-employee-pagination-ellipsis">...</span>);
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
                  pageNumbers.push(<span key="ellipsis2" className="hr-employee-pagination-ellipsis">...</span>);
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
            className="hr-employee-pagination-arrow" 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
            disabled={currentPage === totalPages}
          >
            &#8250; {/* Single right arrow */}
          </button>
          
          <button 
            className="hr-employee-pagination-arrow" 
            onClick={() => setCurrentPage(totalPages)} 
            disabled={currentPage === totalPages}
          >
            &#187; {/* Double right arrow */}
          </button>
          
          <select
            className="hr-employee-pagination-size"
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

  // 2) Positions Table
  const renderPositionsTable = (rawData, isArchived = false) => {
    const { paginated, totalPages } = filterAndPaginate(rawData);
  
    if (loading) return <div className="hr-employee-no-results">Loading positions...</div>;
    if (!paginated.length) return <div className="hr-employee-no-results">No positions found.</div>;
  
    return (
      <>
        <div className="hr-employee-table-wrapper">
          <div className="hr-employee-table-scrollable">
          <table className="hr-employee-table">
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
                  <td>
                    {pos.typical_duration_days ? (
                      <span className={`hr-tag ${pos.employment_type.toLowerCase()}-duration`}>
                        {pos.typical_duration_days} days
                      </span>
                    ) : "—"}
                  </td>
                  <td>
                    <span className={`hr-tag ${pos.is_active ? "yes" : "no"}`}>
                      {pos.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>{pos.created_at}</td>
                  <td>{pos.updated_at}</td>
                  <td className="hr-employee-actions">
                    <div
                      className="hr-employee-dots"
                      onClick={() => setDotsMenuOpen(dotsMenuOpen === index ? null : index)}
                    >
                      ⋮
                      {dotsMenuOpen === index && (
                        <div className="hr-employee-dropdown">
                          <div
                            className="hr-employee-dropdown-item"
                            onClick={() => openEditPositionModal(pos)}
                          >
                            Edit
                          </div>
                          {!isArchived ? (
                            <div
                              className="hr-employee-dropdown-item"
                              onClick={() => handleArchivePosition(pos.position_id)}
                            >
                              Archive
                            </div>
                          ) : (
                            <div
                              className="hr-employee-dropdown-item"
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
          </div>
        </div>
        <div className="hr-employee-pagination">
          <button 
            className="hr-employee-pagination-arrow" 
            onClick={() => setCurrentPage(1)} 
            disabled={currentPage === 1}
          >
            &#171; {/* Double left arrow */}
          </button>
          
          <button 
            className="hr-employee-pagination-arrow" 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
            disabled={currentPage === 1}
          >
            &#8249; {/* Single left arrow */}
          </button>
          
          <div className="hr-employee-pagination-numbers">
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
                  pageNumbers.push(<span key="ellipsis1" className="hr-employee-pagination-ellipsis">...</span>);
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
                  pageNumbers.push(<span key="ellipsis2" className="hr-employee-pagination-ellipsis">...</span>);
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
            className="hr-employee-pagination-arrow" 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
            disabled={currentPage === totalPages}
          >
            &#8250; {/* Single right arrow */}
          </button>
          
          <button 
            className="hr-employee-pagination-arrow" 
            onClick={() => setCurrentPage(totalPages)} 
            disabled={currentPage === totalPages}
          >
            &#187; {/* Double right arrow */}
          </button>
          
          <select
            className="hr-employee-pagination-size"
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

  /***************************************************************************
   * Main Render
   ***************************************************************************/
  return (
    <div className="hr-employee">
      <div className="hr-employee-body-content-container">
        <div className="hr-employee-scrollable">
          <div className="hr-employee-heading">
            <h2><strong>Employees</strong></h2>
            <div className="hr-employee-right-controls">
              <div className="hr-employee-search-wrapper">
                <FiSearch className="hr-employee-search-icon" />
                <input
                  type="text"
                  className="hr-employee-search"
                  placeholder="Search..."
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
              <select
                className="hr-employee-filter"
                value={sortField}
                onChange={(e) => setSortField(e.target.value)}
              >
                <option value="all">No Sorting</option>
                {activeTab === "Employees" ? (
                  <>
                    <option value="employee_id">Sort by Employee ID</option>
                    <option value="dept_name">Sort by Department</option>
                    <option value="position_title">Sort by Position</option>
                    <option value="first_name">Sort by First Name</option>
                    <option value="last_name">Sort by Last Name</option>
                    <option value="employment_type">Sort by Employment Type</option>
                    <option value="status">Sort by Status</option>
                    <option value="created_at">Sort by Created Date</option>
                  </>
                ) : (
                  <>
                    <option value="position_id">Sort by Position ID</option>
                    <option value="position_title">Sort by Position Title</option>
                    <option value="salary_grade">Sort by Salary Grade</option>
                    <option value="employment_type">Sort by Employment Type</option>
                    <option value="created_at">Sort by Created Date</option>
                  </>
                )}
              </select>

              {/* Add Button + View Archived + Bulk Unarchive if needed */}
              {activeTab === "Employees" && (
                <>
                  <button className="hr-employee-add-btn" onClick={handleAddEmployee}>
                    + Add Employee
                  </button>
                  <button
                    className="hr-employee-add-btn"
                    onClick={() => {
                      setShowArchived(!showArchived);
                      setSelectedArchivedEmployees([]);
                    }}
                  >
                    {showArchived ? "View Active" : "View Archived"}
                  </button>
                  {showArchived && selectedArchivedEmployees.length > 0 && (
                    <button className="hr-employee-add-btn" onClick={bulkUnarchiveEmployees}>
                      Unarchive Selected
                    </button>
                  )}
                </>
              )}

              {activeTab === "Positions" && (
                <>
                  <button className="hr-employee-add-btn" onClick={handleAddPosition}>
                    + Add Position
                  </button>
                  <button
                    className="hr-employee-add-btn"
                    onClick={() => {
                      setShowArchived(!showArchived);
                      setSelectedArchivedPositions([]);
                    }}
                  >
                    {showArchived ? "View Active" : "View Archived"}
                  </button>
                  {showArchived && selectedArchivedPositions.length > 0 && (
                    <button className="hr-employee-add-btn" onClick={bulkUnarchivePositions}>
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
          <div className="hr-employee-table-container">
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
        <div className="hr-employee-modal-overlay">
          <div className="hr-employee-modal">
            <h3 style={{ marginBottom: "1rem" }}>Add New Employee</h3>
            <form onSubmit={submitEmployeeModal} className="hr-employee-modal-form hr-two-col">
              {/* System Fields - Read Only */}
              <div className="form-group">
                <label>User ID</label>
                <input 
                  type="text"
                  name="user_id"
                  value={newEmployee.user_id}
                  disabled
                  placeholder="Auto-generated"
                />
              </div>
              
              {/* Department Selection */}
              <div className="form-group">
                <label>Department</label>
                <select
                  name="dept_id"
                  value={newEmployee.dept_id}
                  onChange={(e) => {
                    const selectedDept = departments.find(d => d.dept_id === e.target.value);
                    setNewEmployee(prev => ({
                      ...prev,
                      dept_id: e.target.value,
                      dept_name: selectedDept?.dept_name || ""
                      // Position fields are no longer reset
                    }));
                  }}
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

              {/* Position Selection */}
              <div className="form-group">
                <label>Position</label>
                <select
                  name="position_id"
                  value={newEmployee.position_id}
                  onChange={(e) => {
                    const selectedPos = positions.find(p => p.position_id === e.target.value);
                    setNewEmployee(prev => ({
                      ...prev,
                      position_id: e.target.value,
                      position_title: selectedPos?.position_title || ""
                    }));
                  }}
                  required
                >
                  <option value="">-- Select Position --</option>
                  {positions.map(pos => (
                    <option key={pos.position_id} value={pos.position_id}>
                      {pos.position_title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Personal Information */}
              <div className="form-group">
                <label>First Name *</label>
                <input
                  type="text"
                  name="first_name"
                  value={newEmployee.first_name}
                  onChange={handleEmployeeChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Last Name *</label>
                <input
                  type="text"
                  name="last_name"
                  value={newEmployee.last_name}
                  onChange={handleEmployeeChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={newEmployee.phone}
                  onChange={handleEmployeeChange}
                  placeholder="0XXXXXXXXXX (11 digits)"
                  maxLength="11"
                />
                <small>Must be 11 digits starting with 0</small>
              </div>

              {/* Employment Details */}
              <div className="form-group">
                <label>Employment Type *</label>
                <select
                  name="employment_type"
                  value={newEmployee.employment_type}
                  onChange={handleEmployeeChange}
                  required
                >
                  <option value="Regular">Regular</option>
                  <option value="Contractual">Contractual</option>
                  <option value="Seasonal">Seasonal</option>
                </select>
              </div>

              <div className="form-group">
                <label>Status *</label>
                <select
                  name="status"
                  value={newEmployee.status}
                  onChange={handleEmployeeChange}
                  required
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="form-group">
                <label>Reports To</label>
                <select
                  name="reports_to"
                  value={newEmployee.reports_to}
                  onChange={handleEmployeeChange}
                >
                  <option value="">-- Select Supervisor --</option>
                  {departmentSuperiors.map(superior => (
                    <option key={superior.dept_superior_id} value={superior.employee_id}>
                      {superior.superior_name} - {superior.dept_name} ({superior.position_title})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Is Supervisor</label>
                <input
                  type="checkbox"
                  name="is_supervisor"
                  checked={newEmployee.is_supervisor}
                  onChange={(e) => handleEmployeeChange({
                    target: {
                      name: 'is_supervisor',
                      value: e.target.checked
                    }
                  })}
                />
              </div>

              {/* System Timestamps */}
              <div className="form-group">
                <label>Created At</label>
                <input
                  type="text"
                  value={newEmployee.created_at}
                  disabled
                  placeholder="Auto-generated"
                />
              </div>

              {/* Form Buttons */}
              <div className="hr-employee-modal-buttons hr-two-col-buttons">
                <button type="submit" className="submit-btn">Add</button>
                <button
                  type="button"
                  className="hr-employee-cancel-btn"
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
        <div className="hr-employee-modal-overlay">
          <div className="hr-employee-modal">
            <h3 style={{ marginBottom: "1rem" }}>Edit Employee</h3>
            <form onSubmit={handleEditEmployeeSubmit} className="hr-department-modal-form hr-two-col">
              <div className="form-group">
                <label>Employee ID</label>
                <input
                  type="text"
                  value={editingEmployee.employee_id}
                  disabled
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

              {/* Commented out less frequently updated fields
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
                <label>Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={editingEmployee.phone}
                  onChange={handleEditEmployeeChange}
                />
              </div>
              <div className="form-group">
                <label>Reports To</label>
                <select
                  name="reports_to"
                  value={editingEmployee.reports_to || ""}
                  onChange={handleEditEmployeeChange}
                >
                  <option value="">-- No Supervisor --</option>
                  {departmentSuperiors.map(superior => (
                    <option key={superior.dept_superior_id} value={superior.employee_id}>
                      {superior.superior_name} - {superior.dept_name} ({superior.position_title})
                    </option>
                  ))}
                </select>
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
              <div className="form-group">
                <label>Created At</label>
                <input type="text" value={editingEmployee.created_at || ""} disabled />
              </div>
              <div className="form-group">
                <label>Updated At</label>
                <input type="text" value={editingEmployee.updated_at || ""} disabled />
              </div>
              */}

              <div className="hr-employee-modal-buttons hr-two-col-buttons">
                <button type="submit" className="submit-btn">Save</button>
                <button
                  type="button"
                  className="hr-employee-cancel-btn"
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
        <div className="hr-employee-modal-overlay">
          <div className="hr-employee-modal">
            <h3>Unarchive Employee</h3>
            <p>Are you sure you want to unarchive this employee?</p>
            <div className="hr-employee-modal-buttons">
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
        <div className="hr-employee-modal-overlay">
          <div className="hr-employee-modal">
            <h3 style={{ marginBottom: "1rem" }}>Add New Position</h3>
            <form onSubmit={submitPositionModal} className="hr-employee-modal-form hr-two-col">
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
                <label>Employment Type *</label>
                <select
                  name="employment_type"
                  value={newPosition.employment_type}
                  onChange={handleAddPositionChange}
                  required
                >
                  <option value="Regular">Regular</option>
                  <option value="Contractual">Contractual</option>
                  <option value="Seasonal">Seasonal</option>
                </select>
              </div>

              {newPosition.employment_type === "Regular" ? (
                <>
                  <div className="form-group">
                    <label>Salary Grade *</label>
                    <select
                      name="salary_grade"
                      value={newPosition.salary_grade}
                      onChange={handleAddPositionChange}
                      required
                    >
                      <option value="">Select Salary Grade</option>
                      {Object.keys(SALARY_GRADE_TABLE).map((grade) => (
                        <option key={grade} value={grade}>
                          {grade}
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
                    <label>Daily Rate Grade *</label>
                    <select
                      name="salary_grade"
                      value={newPosition.salary_grade}
                      onChange={handleAddPositionChange}
                      required
                    >
                      <option value="">Select Daily Rate Grade</option>
                      {Object.keys(DAILY_RATE_TABLE).map((grade) => (
                        <option key={grade} value={grade}>
                          {grade}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Daily Rate (Min)</label>
                    <input type="number" name="min_salary" value={newPosition.min_salary} disabled />
                  </div>
                  <div className="form-group">
                    <label>Daily Rate (Max)</label>
                    <input type="number" name="max_salary" value={newPosition.max_salary} disabled />
                  </div>
                </>
              )}

              {newPosition.employment_type !== "Regular" && (
                <div className="form-group">
                  <label>Typical Duration (Days) *</label>
                  <input
                    type="number"
                    name="typical_duration_days"
                    value={newPosition.typical_duration_days || ""}
                    onChange={handleAddPositionChange}
                    min={newPosition.employment_type === "Seasonal" ? 1 : 30}
                    max={newPosition.employment_type === "Seasonal" ? 29 : 180}
                    required
                  />
                </div>
              )}

              <div className="form-group">
                <label>Is Active *</label>
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
                  required
                />
              </div>

              <div className="hr-employee-modal-buttons hr-two-col-buttons">
                <button type="submit" className="submit-btn">Add</button>
                <button
                  type="button"
                  className="hr-employee-cancel-btn"
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
        <div className="hr-employee-modal-overlay">
          <div className="hr-employee-modal">
            <h3 style={{ marginBottom: "1rem" }}>Edit Position</h3>
            <form onSubmit={handleEditPositionSubmit} className="hr-employee-modal-form hr-two-col">
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
                      {Object.keys(SALARY_GRADE_TABLE).map((grade) => (
                        <option key={grade} value={grade}>
                          {grade}
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
                    <label>Daily Rate Grade</label>
                    <select
                      name="salary_grade"
                      value={editingPosition.salary_grade}
                      onChange={handleEditPositionChange}
                    >
                      <option value="">Select Daily Rate Grade</option>
                      {Object.keys(DAILY_RATE_TABLE).map((grade) => (
                        <option key={grade} value={grade}>
                          {grade}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Daily Rate (Min)</label>
                    <input type="number" name="min_salary" value={editingPosition.min_salary} disabled />
                  </div>
                  <div className="form-group">
                    <label>Daily Rate (Max)</label>
                    <input type="number" name="max_salary" value={editingPosition.max_salary} disabled />
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
              <div className="hr-employee-modal-buttons hr-two-col-buttons">
                <button type="submit" className="submit-btn">Save</button>
                <button
                  type="button"
                  className="hr-employee-cancel-btn"  // Use consistent class name 
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
        <div className="hr-employee-modal-overlay">
          <div className="hr-employee-modal">
            <h3>Unarchive Position</h3>
            <p>Are you sure you want to unarchive this position?</p>
            <div className="hr-employee-modal-buttons">
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
          className="hr-employee-toast"
          style={{ backgroundColor: toast.success ? "#4CAF50" : "#F44336" }}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default Employees;