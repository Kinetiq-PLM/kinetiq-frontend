import React, { useState, useEffect } from "react";
import axios from "axios";
import ProjectGanttChart from "./ProjectGanttChart.jsx";
import "../styles/ProjectPlanning.css";
axios.defaults.baseURL = 'https://hp0w1llp43.execute-api.ap-southeast-1.amazonaws.com/dev';

// Import icons individually
import { 
  FaClipboardList, 
  FaTasks, 
  FaUsersCog, 
  FaTools, 
  FaShieldAlt, 
  FaChartLine, 
  FaArrowLeft, 
  FaPlus, 
  FaRegCalendarAlt, 
  FaFilter, 
  FaExternalLinkAlt, 
  FaBuilding, 
  FaEdit, 
  FaEye, 
  FaCheckCircle, 
  FaExclamationCircle, 
  FaExclamationTriangle,
  FaTrash,
  FaPlusCircle
} from "react-icons/fa";

const ProjectPlanningDashboard = () => {
  // State for active view/form
  const [activeView, setActiveView] = useState("dashboard");
  const [selectedProjectType, setSelectedProjectType] = useState("external");
  
  const [showGanttChart, setShowGanttChart] = useState(false);

  
  const [message, setMessage] = useState({ text: "", type: "" });
  
  // Pagination states
  const [currentExternalPage, setCurrentExternalPage] = useState(1);
  const [currentInternalPage, setCurrentInternalPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Filter state
  const [filterStatus, setFilterStatus] = useState("all");
  
  // Data lists for dropdowns
  const [approvalIds, setApprovalIds] = useState([]);
  const [internalApprovalIds, setInternalApprovalIds] = useState([]);
  const [orderIds, setOrderIds] = useState([]);
  const [projectRequestIds, setProjectRequestIds] = useState([]);
  const [projectIds, setProjectIds] = useState([]);
  const [employeeIds, setEmployeeIds] = useState([]);
  const [equipmentIds, setEquipmentIds] = useState([]);
  const [equipmentNames, setEquipmentNames] = useState([]); // New state for equipment names
  const [internalProjectRequestIds, setInternalProjectRequestIds] = useState([]);
  const [internalProjectIds, setInternalProjectIds] = useState([]);
  const [departmentIds, setDepartmentIds] = useState([]);
  const [projectStatusOptions, setProjectStatusOptions] = useState([]);
  const [internalProjectStatusOptions, setInternalProjectStatusOptions] = useState([]);
  
  // Removed unused state variables
  // const [bomIds, setBomIds] = useState([]);
  // const [budgetApprovalIds, setBudgetApprovalIds] = useState([]);
  
  // Project lists
  const [externalProjectsList, setExternalProjectsList] = useState([]);
  const [internalProjectsList, setInternalProjectsList] = useState([]);
  
  // Form data states
  // External Project Request Form
  const [externalProjectRequestForm, setExternalProjectRequestForm] = useState({
    projectName: "",
    projectDescription: "",
    approvalId: "",
    orderId: ""
  });
  
  // External Project Details Form
  const [externalProjectDetailsForm, setExternalProjectDetailsForm] = useState({
    projectRequestId: "",
    projectStatus: ""
  });
  
  // External Project Labor Form
  const [externalProjectLaborForm, setExternalProjectLaborForm] = useState({
    projectId: "",
    jobRoleNeeded: "",
    employeeId: ""
  });
  
  // External Project Equipment Form - Updated to support multiple equipment items
  const [externalProjectEquipmentForm, setExternalProjectEquipmentForm] = useState({
    projectId: "",
    equipmentItems: [{ name: "" }]  // Array of equipment items
  });
  
  // External Project Warranty Form
  const [externalProjectWarrantyForm, setExternalProjectWarrantyForm] = useState({
    projectId: "",
    warrantyCoverageYear: "",
    warrantyStartDate: "",
    warrantyEndDate: ""
  });
  
  // External Project Cost Form
  const [externalProjectCostForm, setExternalProjectCostForm] = useState({
    projectId: "",
    bomId: "",
    projectBudgetApproval: ""
  });
  
  // Internal Project Request Form
  const [internalProjectRequestForm, setInternalProjectRequestForm] = useState({
    projectName: "",
    requestDate: "",
    startingDate: "",
    employeeId: "",
    departmentId: "",
    reasonForRequest: "",
    materialsNeeded: "",
    equipmentNeeded: "",
    projectType: ""
  });
  
  // Internal Project Details Form
  const [internalProjectDetailsForm, setInternalProjectDetailsForm] = useState({
    projectRequestId: "",
    projectStatus: "",
    approvalId: "",
    projectDescription: ""
  });
  
  // Internal Project Labor Form
  const [internalProjectLaborForm, setInternalProjectLaborForm] = useState({
    projectId: "",
    jobRole: "",
    employeeId: ""
  });

  // Fetch all dropdown data on component mount
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        // First fetch internal approval IDs separately
        const internalApprovalRes = await axios.get('/api/project-planning/get-internal-approval-ids/')
          .catch(e => {
            console.error("Error fetching internal approval IDs:", e);
            return { data: [] };
          });
        setInternalApprovalIds(internalApprovalRes.data);
        
        // Create an array of promises for all other API calls
        const apiCalls = [
          axios.get('/api/project-planning/get-external-approval-ids/').catch(e => ({ data: [] })),
          axios.get('/api/project-planning/get-order-ids/').catch(e => ({ data: [] })),
          axios.get('/api/project-planning/get-external-project-request-ids/').catch(e => ({ data: [] })),
          axios.get('/api/project-planning/get-external-project-ids/').catch(e => ({ data: [] })),
          axios.get('/api/project-planning/get-employee-ids/').catch(e => ({ data: [] })),
          axios.get('/api/project-planning/get-equipment-ids/').catch(e => ({ data: [] })),
          axios.get('/api/project-planning/get-internal-project-request-ids/').catch(e => ({ data: [] })),
          axios.get('/api/project-planning/get-internal-project-ids/').catch(e => ({ data: [] })),
          axios.get('/api/project-planning/get-department-ids/').catch(e => ({ data: [] })),
          axios.get('/api/project-planning/get-project-status-values/').catch(e => ({ data: ['not started', 'in progress', 'completed'] })),
          axios.get('/api/project-planning/get-internal-project-status-values/').catch(e => ({ data: ['not started', 'in progress', 'completed'] })),
          axios.get('/api/project-planning/get-external-project-requests-list/').catch(e => ({ data: [] })),
          axios.get('/api/project-planning/get-internal-project-requests-list/').catch(e => ({ data: [] }))
        ];
        
        // Execute all API calls in parallel
        const [
          approvalRes, 
          orderRes, 
          projectReqRes, 
          projectIdRes, 
          employeeRes, 
          equipmentRes,
          intProjectReqRes,
          intProjectIdRes,
          departmentRes,
          projectStatusRes,
          internalProjectStatusRes,
          externalListRes,
          internalListRes
        ] = await Promise.all(apiCalls);
        
        // Set state with the results
        setApprovalIds(approvalRes.data);
        setOrderIds(orderRes.data);
        setProjectRequestIds(projectReqRes.data);
        setProjectIds(projectIdRes.data);
        setEmployeeIds(employeeRes.data);
        setEquipmentIds(equipmentRes.data);
        setInternalProjectRequestIds(intProjectReqRes.data);
        setInternalProjectIds(intProjectIdRes.data);
        setDepartmentIds(departmentRes.data);
        setProjectStatusOptions(projectStatusRes.data);
        setInternalProjectStatusOptions(internalProjectStatusRes.data);
        setExternalProjectsList(externalListRes.data || []);
        setInternalProjectsList(internalListRes.data || []);
        setCurrentExternalPage(1);
        setCurrentInternalPage(1);
        
        // Fetch equipment names
        try {
          const equipmentNamesRes = await axios.get('/api/project-planning/get-equipment-names/');
          setEquipmentNames(equipmentNamesRes.data);
        } catch (error) {
          console.error("Error fetching equipment names:", error);
          // Create some mock equipment names if the API call fails
          setEquipmentNames([
            { id: "EQ-001", name: "Drill Machine" },
            { id: "EQ-002", name: "Welding Equipment" },
            { id: "EQ-003", name: "Forklift" },
            { id: "EQ-004", name: "Concrete Mixer" },
            { id: "EQ-005", name: "Excavator" }
          ]);
        }
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
        setMessage({ 
          text: "Some data could not be loaded. The application may have limited functionality.", 
          type: "warning" 
        });
      }
    };
    
    fetchDropdownData();
  }, []);

  // Handle form input changes
  const handleInputChange = (formName, fieldName, value) => {
    switch(formName) {
      case 'externalProjectRequest':
        setExternalProjectRequestForm({
          ...externalProjectRequestForm,
          [fieldName]: value
        });
        break;
      case 'externalProjectDetails':
        setExternalProjectDetailsForm({
          ...externalProjectDetailsForm,
          [fieldName]: value
        });
        break;
      case 'externalProjectLabor':
        setExternalProjectLaborForm({
          ...externalProjectLaborForm,
          [fieldName]: value
        });
        break;
      case 'externalProjectEquipment':
        // For the projectId field
        if (fieldName === 'projectId') {
          setExternalProjectEquipmentForm({
            ...externalProjectEquipmentForm,
            projectId: value
          });
        }
        break;
      case 'externalProjectWarranty':
        setExternalProjectWarrantyForm({
          ...externalProjectWarrantyForm,
          [fieldName]: value
        });
        break;
      case 'externalProjectCost':
        setExternalProjectCostForm({
          ...externalProjectCostForm,
          [fieldName]: value
        });
        break;
      case 'internalProjectRequest':
        setInternalProjectRequestForm({
          ...internalProjectRequestForm,
          [fieldName]: value
        });
        break;
      case 'internalProjectDetails':
        setInternalProjectDetailsForm({
          ...internalProjectDetailsForm,
          [fieldName]: value
        });
        break;
      case 'internalProjectLabor':
        setInternalProjectLaborForm({
          ...internalProjectLaborForm,
          [fieldName]: value
        });
        break;
      default:
        break;
    }
  };

  // Function to add another equipment field
  const addEquipmentField = () => {
    setExternalProjectEquipmentForm({
      ...externalProjectEquipmentForm,
      equipmentItems: [...externalProjectEquipmentForm.equipmentItems, { name: "" }]
    });
  };

  // Function to remove an equipment field
  const removeEquipmentField = (index) => {
    const updatedItems = [...externalProjectEquipmentForm.equipmentItems];
    updatedItems.splice(index, 1);
    setExternalProjectEquipmentForm({
      ...externalProjectEquipmentForm,
      equipmentItems: updatedItems
    });
  };

  // Function to update a specific equipment item
  const updateEquipmentItem = (index, value) => {
    const updatedItems = [...externalProjectEquipmentForm.equipmentItems];
    updatedItems[index].name = value;
    setExternalProjectEquipmentForm({
      ...externalProjectEquipmentForm,
      equipmentItems: updatedItems
    });
  };

 // Add these functions to your component, right before or after your other handler functions

// Function to handle viewing project details
  const handleViewProject = (projectId, isInternal = false) => {
  console.log(`Viewing ${isInternal ? 'internal' : 'external'} project with ID: ${projectId}`);
  
  // If the project is internal, set the form with the project data
  if (isInternal) {
    // Find the project in the internal projects list
    const project = internalProjectsList.find(p => p.project_request_id === projectId);
    if (project) {
      setInternalProjectDetailsForm({
        projectRequestId: project.project_request_id,
        projectStatus: project.project_status?.toLowerCase() || "",
        approvalId: project.approval_id || "",
        projectDescription: project.project_description || ""
      });
      setActiveView("internalProjectDetails");
    }
  } else {
    // Find the project in the external projects list
    const project = externalProjectsList.find(p => p.project_request_id === projectId);
    if (project) {
      setExternalProjectDetailsForm({
        projectRequestId: project.project_request_id,
        projectStatus: project.project_status?.toLowerCase() || ""
      });
      setActiveView("externalProjectDetails");
    }
  }
};

// Function to handle editing project details
const handleEditProject = (projectId, isInternal = false) => {
  console.log(`Editing ${isInternal ? 'internal' : 'external'} project with ID: ${projectId}`);
  
  // If the project is internal, set the form with the project data
  if (isInternal) {
    // Find the project in the internal projects list
    const project = Array.isArray(internalProjectsList) ? 
      internalProjectsList.find(p => p.project_request_id === projectId) : null;
    
    if (project) {
      setInternalProjectDetailsForm({
        projectRequestId: project.project_request_id,
        projectStatus: project.project_status?.toLowerCase() || "",
        approvalId: project.approval_id || "",
        projectDescription: project.project_description || ""
      });
      setActiveView("internalProjectDetails");
    }
  } else {
    // Find the project in the external projects list
    const project = Array.isArray(externalProjectsList) ? 
      externalProjectsList.find(p => p.project_request_id === projectId) : null;
    
    if (project) {
      setExternalProjectDetailsForm({
        projectRequestId: project.project_request_id,
        projectStatus: project.project_status?.toLowerCase() || ""
      });
      setActiveView("externalProjectDetails");
    }
  }
};

  // Form submission handlers with improved error handling
  const handleExternalProjectRequestSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting external project request form:", externalProjectRequestForm);
    
    try {
      const formData = {
        ProjectName: externalProjectRequestForm.projectName,
        ProjectDescription: externalProjectRequestForm.projectDescription,
        ApprovalID: externalProjectRequestForm.approvalId,
        OrderID: externalProjectRequestForm.orderId,
        ProjectStatus: "Pending"
      };
      
      console.log("Sending data to API:", formData);
      
      const response = await axios.post('/api/project-planning/create-external-project-request/', formData);
      
      console.log("API response:", response.data);
      
      setMessage({ 
        text: "External project request created successfully!", 
        type: "success" 
      });
      
      // Refresh project request IDs
      const projectReqRes = await axios.get('/api/project-planning/get-external-project-request-ids/');
      setProjectRequestIds(projectReqRes.data);
      
      // Refresh external projects list
      const externalListRes = await axios.get('/api/project-planning/get-external-project-requests-list/');
      setExternalProjectsList(externalListRes.data || []);
      
      // Reset form
      setExternalProjectRequestForm({
        projectName: "",
        projectDescription: "",
        approvalId: "",
        orderId: ""
      });
      
      // Return to dashboard
      setActiveView("dashboard");
    } catch (error) {
      console.error("Error creating project:", error);
      let errorMessage = "Failed to create project. Please try again.";
      
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        
        if (error.response.data && error.response.data.error) {
          errorMessage = `Failed to create project: ${error.response.data.error}`;
        }
      }
      
      setMessage({ 
        text: errorMessage, 
        type: "error" 
      });
    }
  };

  const handleExternalProjectDetailsSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting external project details form:", externalProjectDetailsForm);
    
    try {
      const formData = {
        project_status: externalProjectDetailsForm.projectStatus
      };
      
      console.log("Sending data to API:", formData);
      
      const response = await axios.put(
        `/api/project-planning/external-details/${externalProjectDetailsForm.projectRequestId}/`, 
        formData
      );
      
      console.log("API response:", response.data);
      
      setMessage({ 
        text: "Project details updated successfully!", 
        type: "success" 
      });
      
      // Refresh project IDs
      const projectIdRes = await axios.get('/api/project-planning/get-external-project-ids/');
      setProjectIds(projectIdRes.data);
      
      // Refresh external projects list
      const externalListRes = await axios.get('/api/project-planning/get-external-project-requests-list/');
      setExternalProjectsList(externalListRes.data || []);
      
      // Reset form
      setExternalProjectDetailsForm({
        projectRequestId: "",
        projectStatus: ""
      });
      
      // Return to dashboard
      setActiveView("dashboard");
    } catch (error) {
      console.error("Error updating project details:", error);
      let errorMessage = "Failed to update project details. Please try again.";
      
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        
        if (error.response.data && error.response.data.error) {
          errorMessage = `Failed to update project details: ${error.response.data.error}`;
        }
      }
      
      setMessage({ 
        text: errorMessage, 
        type: "error" 
      });
    }
  };

  const handleExternalProjectLaborSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting external project labor form:", externalProjectLaborForm);
    
    try {
      const formData = {
        ProjectID: externalProjectLaborForm.projectId,
        JobRoleNeeded: externalProjectLaborForm.jobRoleNeeded,
        EmployeeID: externalProjectLaborForm.employeeId
      };
      
      console.log("Sending data to API:", formData);
      
      const response = await axios.post('/api/project-planning/add-external-project-labor/', formData);
      
      console.log("API response:", response.data);
      
      setMessage({ 
        text: "Project labor added successfully!", 
        type: "success" 
      });
      
      // Reset form
      setExternalProjectLaborForm({
        projectId: "",
        jobRoleNeeded: "",
        employeeId: ""
      });
      
      // Return to dashboard
      setActiveView("dashboard");
    } catch (error) {
      console.error("Error adding project labor:", error);
      let errorMessage = "Failed to add project labor. Please try again.";
      
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        
        if (error.response.data && error.response.data.error) {
          errorMessage = `Failed to add project labor: ${error.response.data.error}`;
        }
      }
      
      setMessage({ 
        text: errorMessage, 
        type: "error" 
      });
    }
  };

  const handleExternalProjectEquipmentSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting external project equipment form:", externalProjectEquipmentForm);
    
    try {
      // Extract equipment names from the form
      const equipmentNames = externalProjectEquipmentForm.equipmentItems
        .map(item => item.name)
        .filter(name => name.trim() !== "");
      
      if (equipmentNames.length === 0) {
        setMessage({ 
          text: "Please add at least one equipment item", 
          type: "error" 
        });
        return;
      }
      
      const formData = {
        ProjectID: externalProjectEquipmentForm.projectId,
        EquipmentNames: equipmentNames
      };
      
      console.log("Sending data to API:", formData);
      
      const response = await axios.post('/api/project-planning/add-external-project-equipment/', formData);
      
      console.log("API response:", response.data);
      
      setMessage({ 
        text: `Successfully added ${equipmentNames.length} equipment items to the project!`, 
        type: "success" 
      });
      
      // Reset form
      setExternalProjectEquipmentForm({
        projectId: "",
        equipmentItems: [{ name: "" }]
      });
      
      // Return to dashboard
      setActiveView("dashboard");
    } catch (error) {
      console.error("Error adding project equipment:", error);
      let errorMessage = "Failed to add project equipment. Please try again.";
      
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        
        if (error.response.data && error.response.data.error) {
          errorMessage = `Failed to add project equipment: ${error.response.data.error}`;
        }
      }
      
      setMessage({ 
        text: errorMessage, 
        type: "error" 
      });
    }
  };

  const handleExternalProjectWarrantySubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting external project warranty form:", externalProjectWarrantyForm);
    
    // Validate dates
    const startDate = new Date(externalProjectWarrantyForm.warrantyStartDate);
    const endDate = new Date(externalProjectWarrantyForm.warrantyEndDate);
    
    if (endDate <= startDate) {
      setMessage({ 
        text: "Warranty end date must be after warranty start date", 
        type: "error" 
      });
      return;
    }
    
    try {
      const formData = {
        ProjectID: externalProjectWarrantyForm.projectId,
        Warrantycoverageyear: externalProjectWarrantyForm.warrantyCoverageYear,
        Warrantystartdate: externalProjectWarrantyForm.warrantyStartDate,
        Warrantyenddate: externalProjectWarrantyForm.warrantyEndDate
      };
      
      console.log("Sending data to API:", formData);
      
      const response = await axios.post('/api/project-planning/add-external-project-warranty/', formData);
      
      console.log("API response:", response.data);
      
      setMessage({ 
        text: "Project warranty added successfully!", 
        type: "success" 
      });
      
      // Reset form
      setExternalProjectWarrantyForm({
        projectId: "",
        warrantyCoverageYear: "",
        warrantyStartDate: "",
        warrantyEndDate: ""
      });
      
      // Return to dashboard
      setActiveView("dashboard");
    } catch (error) {
      console.error("Error adding project warranty:", error);
      let errorMessage = "Failed to add project warranty. Please try again.";
      
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        
        if (error.response.data && error.response.data.error) {
          errorMessage = `Failed to add project warranty: ${error.response.data.error}`;
        }
      }
      
      setMessage({ 
        text: errorMessage, 
        type: "error" 
      });
    }
  };

  const handleExternalProjectCostSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting external project cost form:", externalProjectCostForm);
    
    try {
      const formData = {
        ProjectID: externalProjectCostForm.projectId,
        BomID: externalProjectCostForm.bomId,
        ProjectBudgetApproval: externalProjectCostForm.projectBudgetApproval
      };
      
      console.log("Sending data to API:", formData);
      
      const response = await axios.post('/api/project-planning/add-external-project-cost-management/', formData);
      
      console.log("API response:", response.data);
      
      setMessage({ 
        text: "Project cost management added successfully!", 
        type: "success" 
      });
      
      // Reset form
      setExternalProjectCostForm({
        projectId: "",
        bomId: "",
        projectBudgetApproval: ""
      });
      
      // Return to dashboard
      setActiveView("dashboard");
    } catch (error) {
      console.error("Error adding project cost management:", error);
      let errorMessage = "Failed to add project cost management. Please try again.";
      
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        
        if (error.response.data && error.response.data.error) {
          errorMessage = `Failed to add project cost management: ${error.response.data.error}`;
        }
      }
      
      setMessage({ 
        text: errorMessage, 
        type: "error" 
      });
    }
  };

  const handleInternalProjectRequestSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting internal project request form:", internalProjectRequestForm);
    
    try {
      const formData = {
        ProjectNameint: internalProjectRequestForm.projectName,
        RequestDateint: internalProjectRequestForm.requestDate,
        Startingdateint: internalProjectRequestForm.startingDate,
        EmployeeIDint: internalProjectRequestForm.employeeId,
        DepartmentIDint: internalProjectRequestForm.departmentId,
        ReasonForRequest: internalProjectRequestForm.reasonForRequest,
        MaterialsNeeded: internalProjectRequestForm.materialsNeeded,
        EquipmentNeeded: internalProjectRequestForm.equipmentNeeded,
        ProjectType: internalProjectRequestForm.projectType
      };
      
      console.log("Sending data to API:", formData);
      
      const response = await axios.post('/api/project-planning/create-internal-project/', formData);
      
      console.log("API response:", response.data);
      
      setMessage({ 
        text: "Internal project request created successfully!", 
        type: "success" 
      });
      
      // Refresh internal project request IDs
      const intProjectReqRes = await axios.get('/api/project-planning/get-internal-project-request-ids/');
      setInternalProjectRequestIds(intProjectReqRes.data);
      
      // Refresh internal projects list
      const internalListRes = await axios.get('/api/project-planning/get-internal-project-requests-list/');
      setInternalProjectsList(internalListRes.data || []);
      
      // Reset form
      setInternalProjectRequestForm({
        projectName: "",
        requestDate: "",
        startingDate: "",
        employeeId: "",
        departmentId: "",
        reasonForRequest: "",
        materialsNeeded: "",
        equipmentNeeded: "",
        projectType: ""
      });
      
      // Return to dashboard
      setActiveView("dashboard");
    } catch (error) {
      console.error("Error creating internal project:", error);
      let errorMessage = "Failed to create internal project. Please try again.";
      
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        
        if (error.response.data && error.response.data.error) {
          errorMessage = `Failed to create internal project: ${error.response.data.error}`;
        }
      }
      
      setMessage({ 
        text: errorMessage, 
        type: "error" 
      });
    }
  };

  const handleInternalProjectDetailsSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting internal project details form:", internalProjectDetailsForm);
    
    try {
      const formData = {
        intrnl_project_status: internalProjectDetailsForm.projectStatus,
        approval_id: internalProjectDetailsForm.approvalId,
        project_description: internalProjectDetailsForm.projectDescription
      };
      
      console.log("Sending data to API:", formData);
      
      const response = await axios.put(
        `/api/project-planning/internal-details/${internalProjectDetailsForm.projectRequestId}/`, 
        formData
      );
      
      console.log("API response:", response.data);
      
      setMessage({ 
        text: "Internal project details updated successfully!", 
        type: "success" 
      });
      
      // Refresh internal project IDs
      const intProjectIdRes = await axios.get('/api/project-planning/get-internal-project-ids/');
      setInternalProjectIds(intProjectIdRes.data);
      
      // Refresh internal projects list
      const internalListRes = await axios.get('/api/project-planning/get-internal-project-requests-list/');
      setInternalProjectsList(internalListRes.data || []);
      
      // Reset form
      setInternalProjectDetailsForm({
        projectRequestId: "",
        projectStatus: "",
        approvalId: "",
        projectDescription: ""
      });
      
      // Return to dashboard
      setActiveView("dashboard");
    } catch (error) {
      console.error("Error updating internal project details:", error);
      let errorMessage = "Failed to update internal project details. Please try again.";
      
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        
        if (error.response.data && error.response.data.error) {
          errorMessage = `Failed to update internal project details: ${error.response.data.error}`;
        }
      }
      
      setMessage({ 
        text: errorMessage, 
        type: "error" 
      });
    }
  };

  const handleInternalProjectLaborSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting internal project labor form:", internalProjectLaborForm);
    
    try {
      const formData = {
        Projectidint: internalProjectLaborForm.projectId, 
        Jobroleint: internalProjectLaborForm.jobRole,
        EmployeeIDint: internalProjectLaborForm.employeeId
      };
      
      console.log("Sending data to API:", formData);
      
      const response = await axios.post('/api/project-planning/add-internal-project-labor/', formData);
      
      console.log("API response:", response.data);
      
      setMessage({ 
        text: "Internal project labor added successfully!", 
        type: "success" 
      });
      
      // Reset form
      setInternalProjectLaborForm({
        projectId: "",
        jobRole: "",
        employeeId: ""
      });
      
      // Return to dashboard
      setActiveView("dashboard");
    } catch (error) {
      console.error("Error adding internal project labor:", error);
      let errorMessage = "Failed to add internal project labor. Please try again.";
      
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        
        if (error.response.data && error.response.data.error) {
          errorMessage = `Failed to add internal project labor: ${error.response.data.error}`;
        }
      }
      
      setMessage({ 
        text: errorMessage, 
        type: "error" 
      });
    }
  };

  // Function to handle filter change
  const handleFilterChange = (status) => {
    console.log(`Filtering projects by status: ${status}`);
    setFilterStatus(status);
  };

  // Function to filter projects by status
  const filterProjectsByStatus = (projects) => {
    if (filterStatus === "all") return projects || [];
    
    // Make sure projects is an array before filtering
    if (!Array.isArray(projects)) return [];
    
    return projects.filter(project => {
      // Handle case insensitivity and normalize status values
      const projectStatus = project.project_status?.toLowerCase() || "";
      const filterValue = filterStatus.toLowerCase();
      
      return projectStatus.includes(filterValue);
    });
  };

  // Function to render Gantt Chart
  const renderGanttChart = () => {
    if (!showGanttChart) return null;
    
    return (
      <div className="gantt-chart-overlay">
        <div className="gantt-chart-container">
          <div className="gantt-header">
            <h2>Project Gantt Chart</h2>
            <button 
              className="close-gantt-button"
              onClick={() => setShowGanttChart(false)}
            >
              &times;
            </button>
          </div>
          <ProjectGanttChart />
        </div>
      </div>
    );
  };

  // Function to render the project lists for dashboard
  const renderProjectListsSection = () => {
    // Filter projects by status - ensure arrays exist before filtering
    const filteredExternalProjects = filterProjectsByStatus(Array.isArray(externalProjectsList) ? externalProjectsList : []);
    const filteredInternalProjects = filterProjectsByStatus(Array.isArray(internalProjectsList) ? internalProjectsList : []);
    
    // Calculate pagination indexes for external projects
    const externalLastIndex = currentExternalPage * itemsPerPage;
    const externalFirstIndex = externalLastIndex - itemsPerPage;
    const currentExternalProjects = filteredExternalProjects.slice(externalFirstIndex, externalLastIndex);
    const totalExternalPages = Math.ceil(filteredExternalProjects.length / itemsPerPage);
    
    // Calculate pagination indexes for internal projects
    const internalLastIndex = currentInternalPage * itemsPerPage;
    const internalFirstIndex = internalLastIndex - itemsPerPage;
    const currentInternalProjects = filteredInternalProjects.slice(internalFirstIndex, internalLastIndex);
    const totalInternalPages = Math.ceil(filteredInternalProjects.length / itemsPerPage);
    
    // Functions to handle pagination
    const nextExternalPage = () => {
      if (currentExternalPage < totalExternalPages) {
        setCurrentExternalPage(currentExternalPage + 1);
      }
    };
    
    const prevExternalPage = () => {
      if (currentExternalPage > 1) {
        setCurrentExternalPage(currentExternalPage - 1);
      }
    };
    
    const nextInternalPage = () => {
      if (currentInternalPage < totalInternalPages) {
        setCurrentInternalPage(currentInternalPage + 1);
      }
    };
    
    const prevInternalPage = () => {
      if (currentInternalPage > 1) {
        setCurrentInternalPage(currentInternalPage - 1);
      }
    };
    
    // Function to render status badge
    const renderStatusBadge = (status) => {
      if (!status) return <span className="status-badge">Not set</span>;
      
      let badgeClass = "";
      switch(status.toLowerCase()) {
        case "completed":
          badgeClass = "completed";
          break;
        case "in progress":
          badgeClass = "active";
          break;
        case "not started":
        case "pending":
          badgeClass = "pending";
          break;
        default:
          badgeClass = "";
      }
      
      return <span className={`status-badge ${badgeClass}`}>{status}</span>;
    };
  
    return (
      <div className="project-lists-section">
        <div className="section-header">
          <h2 className="section-title">Project Requests</h2>
            <div className="section-actions">
              <div className="filter-controls">
                <span className="filter-label">Filter by Status:</span>
                <div className="filter-buttons">
                  <button 
                    className={`filter-button ${filterStatus === "all" ? "active" : ""}`}
                    onClick={() => handleFilterChange("all")}
                  >
                    All
                  </button>
                  <button 
                    className={`filter-button ${filterStatus === "not started" ? "active" : ""}`}
                    onClick={() => handleFilterChange("not started")}
                  >
                    Not Started
                  </button>
                  <button 
                    className={`filter-button ${filterStatus === "in progress" ? "active" : ""}`}
                    onClick={() => handleFilterChange("in progress")}
                  >
                    In Progress
                  </button>
                  <button 
                    className={`filter-button ${filterStatus === "completed" ? "active" : ""}`}
                    onClick={() => handleFilterChange("completed")}
                  >
                    Completed
                  </button>
                </div>
              </div>
            </div>
        </div>
        
        <div className="project-list">
          <div className="list-header">
            <h3>
              <FaExternalLinkAlt className="list-icon" /> 
              External Project Requests
            </h3>
            <button 
              className="create-button" 
              onClick={() => setActiveView("externalProjectRequest")}
            >
              <FaPlus /> New Request
            </button>
          </div>
          
          <div className="table-responsive">
            <table className="project-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Project Name</th>
                  <th>Approval ID</th>
                  <th>Item ID</th>
                  <th>Start Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentExternalProjects.length > 0 ? (
                  currentExternalProjects.map(project => (
                    <tr key={project.project_request_id}>
                      <td>#{project.project_request_id || 'N/A'}</td>
                      <td className="project-name">{project.project_name || 'N/A'}</td>
                      <td>{project.approval_id || 'N/A'}</td>
                      <td>{project.item_id || 'N/A'}</td>
                      <td className="date-cell">{project.start_date || 'Not set'}</td>
                      <td>{renderStatusBadge(project.project_status)}</td>
                      <td className="actions-cell">
                            <button 
                              className="table-action-button edit"
                              onClick={() => handleEditProject(project.project_request_id, false)}
                            >
                              <FaEdit title="Edit" />
                            </button>
                          </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="no-data">No external project requests found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {filteredExternalProjects.length > itemsPerPage && (
            <div className="pagination-controls">
              <div className="pagination-info">
                Page {currentExternalPage} of {totalExternalPages} 
                ({externalFirstIndex + 1}-{Math.min(externalLastIndex, filteredExternalProjects.length)} of {filteredExternalProjects.length})
              </div>
              <div className="pagination-buttons">
                <button 
                  className="pagination-button" 
                  onClick={prevExternalPage} 
                  disabled={currentExternalPage === 1}
                >
                  Previous
                </button>
                <button 
                  className="pagination-button" 
                  onClick={nextExternalPage} 
                  disabled={currentExternalPage === totalExternalPages}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="project-list">
          <div className="list-header">
            <h3>
              <FaBuilding className="list-icon" /> 
              Internal Project Requests
            </h3>
            <button 
              className="create-button" 
              onClick={() => setActiveView("internalProjectRequest")}
            >
              <FaPlus /> New Request
            </button>
          </div>
          
          <div className="table-responsive">
            <table className="project-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Project Name</th>
                  <th>Approval ID</th>
                  <th>Request Date</th>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentInternalProjects.length > 0 ? (
                  currentInternalProjects.map(project => (
                    <tr key={project.project_request_id}>
                      <td>#{project.project_request_id || 'N/A'}</td>
                      <td className="project-name">{project.project_name || 'N/A'}</td>
                      <td>{project.approval_id || 'N/A'}</td>
                      <td className="date-cell">{project.request_date || 'Not set'}</td>
                      <td>{project.employee || 'Not assigned'}</td>
                      <td>{project.department || 'Not assigned'}</td>
                      <td>{renderStatusBadge(project.project_status)}</td>
                      <td className="actions-cell">
                          <button 
                            className="table-action-button edit"
                            onClick={() => handleEditProject(project.project_request_id, true)}
                          >
                            <FaEdit title="Edit" />
                          </button>
                        </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="no-data">No internal project requests found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {filteredInternalProjects.length > itemsPerPage && (
            <div className="pagination-controls">
              <div className="pagination-info">
                Page {currentInternalPage} of {totalInternalPages} 
                ({internalFirstIndex + 1}-{Math.min(internalLastIndex, filteredInternalProjects.length)} of {filteredInternalProjects.length})
              </div>
              <div className="pagination-buttons">
                <button 
                  className="pagination-button" 
                  onClick={prevInternalPage} 
                  disabled={currentInternalPage === 1}
                >
                  Previous
                </button>
                <button 
                  className="pagination-button" 
                  onClick={nextInternalPage} 
                  disabled={currentInternalPage === totalInternalPages}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Function to render the dashboard
  const renderDashboard = () => {
    // Calculate project statistics
    const totalExternalProjects = Array.isArray(externalProjectsList) ? externalProjectsList.length : 0;
    const totalInternalProjects = Array.isArray(internalProjectsList) ? internalProjectsList.length : 0;
    
    const externalInProgress = Array.isArray(externalProjectsList) ? externalProjectsList.filter(
      p => p.project_status && p.project_status.toLowerCase() === 'in progress'
    ).length : 0;
    
    const internalInProgress = Array.isArray(internalProjectsList) ? internalProjectsList.filter(
      p => p.project_status && p.project_status.toLowerCase() === 'in progress'
    ).length : 0;
    
    const externalCompleted = Array.isArray(externalProjectsList) ? externalProjectsList.filter(
      p => p.project_status && p.project_status.toLowerCase() === 'completed'
    ).length : 0;
    
    const internalCompleted = Array.isArray(internalProjectsList) ? internalProjectsList.filter(
      p => p.project_status && p.project_status.toLowerCase() === 'completed'
    ).length : 0;
    
    return (
      <div className="project-planning-dashboard">
        <div className="dashboard-overview">
          <div className="stats-card total-projects">
            <div className="stats-icon">
              <FaClipboardList />
            </div>
            <div className="stats-content">
              <h4>Total Projects</h4>
              <div className="stats-value">{totalExternalProjects + totalInternalProjects}</div>
              <div className="stats-details">
                <span>{totalExternalProjects} External</span> | 
                <span>{totalInternalProjects} Internal</span>
              </div>
            </div>
          </div>
          
          <div className="stats-card in-progress">
            <div className="stats-icon">
              <FaTasks />
            </div>
            <div className="stats-content">
              <h4>In Progress</h4>
              <div className="stats-value">{externalInProgress + internalInProgress}</div>
              <div className="stats-details">
                <span>{externalInProgress} External</span> | 
                <span>{internalInProgress} Internal</span>
              </div>
            </div>
          </div>
          
          <div className="stats-card completed">
            <div className="stats-icon">
              <FaRegCalendarAlt />
            </div>
            <div className="stats-content">
              <h4>Completed</h4>
              <div className="stats-value">{externalCompleted + internalCompleted}</div>
              <div className="stats-details">
                <span>{externalCompleted} External</span> | 
                <span>{internalCompleted} Internal</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="dashboard-tabs">
          <button 
            className={`dashboard-tab ${selectedProjectType === 'external' ? 'active' : ''}`}
            onClick={() => setSelectedProjectType('external')}
          >
            <FaExternalLinkAlt className="tab-icon" /> External Projects
          </button>
          <button 
            className={`dashboard-tab ${selectedProjectType === 'internal' ? 'active' : ''}`}
            onClick={() => setSelectedProjectType('internal')}
          >
            <FaBuilding className="tab-icon" /> Internal Projects
          </button>
        </div>
        
        <div className="dashboard-cards">
          {selectedProjectType === 'external' ? (
            <>
              <div className="dashboard-card" onClick={() => setActiveView("externalProjectRequest")}>
                <div className="card-icon">
                  <FaClipboardList />
                </div>
                <div className="card-content">
                  <h3>Project Request</h3>
                  <p>Create a new external project request</p>
                </div>
              </div>
              <div className="dashboard-card" onClick={() => setActiveView("externalProjectDetails")}>
                <div className="card-icon">
                  <FaTasks />
                </div>
                <div className="card-content">
                  <h3>Project Details</h3>
                  <p>Update external project details and status</p>
                </div>
              </div>
              <div className="dashboard-card" onClick={() => setActiveView("externalProjectLabor")}>
                <div className="card-icon">
                  <FaUsersCog />
                </div>
                <div className="card-content">
                  <h3>Project Labor</h3>
                  <p>Assign labor resources to external projects</p>
                </div>
              </div>
              <div className="dashboard-card" onClick={() => setActiveView("externalProjectEquipment")}>
                <div className="card-icon">
                  <FaTools />
                </div>
                <div className="card-content">
                  <h3>Project Equipment</h3>
                  <p>Assign equipment to external projects</p>
                </div>
              </div>
              <div className="dashboard-card" onClick={() => setActiveView("externalProjectWarranty")}>
                <div className="card-icon">
                  <FaShieldAlt />
                </div>
                <div className="card-content">
                  <h3>Project Warranty</h3>
                  <p>Set up warranty details for external projects</p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="dashboard-card" onClick={() => setActiveView("internalProjectRequest")}>
                <div className="card-icon">
                  <FaClipboardList />
                </div>
                <div className="card-content">
                  <h3>Project Request</h3>
                  <p>Create a new internal project request</p>
                </div>
              </div>
              <div className="dashboard-card" onClick={() => setActiveView("internalProjectDetails")}>
                <div className="card-icon">
                  <FaTasks />
                </div>
                <div className="card-content">
                  <h3>Project Details</h3>
                  <p>Update internal project details and status</p>
                </div>
              </div>
              <div className="dashboard-card" onClick={() => setActiveView("internalProjectLabor")}>
                <div className="card-icon">
                  <FaUsersCog />
                </div>
                <div className="card-content">
                  <h3>Project Labor</h3>
                  <p>Assign labor resources to internal projects</p>
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* Project Lists section directly on the dashboard */}
        {renderProjectListsSection()}
      </div>
    );
  };

  // Function to render External Project Request Form
  const renderExternalProjectRequestForm = () => {
    return (
      <div className="project-form-container">
        <h2 className="form-title">
          <FaClipboardList className="form-icon" /> External Project Request
        </h2>
        <form onSubmit={handleExternalProjectRequestSubmit} className="project-form">
          <div className="form-group">
            <label className="form-label">
              Project Name*
            </label>
            <input
              className="form-input"
              type="text"
              placeholder="Enter project name"
              value={externalProjectRequestForm.projectName}
              onChange={(e) => handleInputChange('externalProjectRequest', 'projectName', e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Project Description
            </label>
            <textarea
              className="form-textarea"
              placeholder="Describe the project scope and objectives"
              value={externalProjectRequestForm.projectDescription}
              onChange={(e) => handleInputChange('externalProjectRequest', 'projectDescription', e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                Approval ID
              </label>
              <select
                className="form-select"
                value={externalProjectRequestForm.approvalId}
                onChange={(e) => handleInputChange('externalProjectRequest', 'approvalId', e.target.value)}
                required
              >
                <option value="">Select Approval ID</option>
                {approvalIds.map((id) => (
                  <option key={id} value={id}>{id}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                Order ID*
              </label>
              <select
                className="form-select"
                value={externalProjectRequestForm.orderId}
                onChange={(e) => handleInputChange('externalProjectRequest', 'orderId', e.target.value)}
                required
              >
                <option value="">Select Order ID</option>
                {orderIds.map((id) => (
                  <option key={id} value={id}>{id}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="form-button save-button">
              <FaPlus /> Create Project
            </button>
            <button 
              type="button" 
              className="form-button cancel-button"
              onClick={() => {
                setActiveView("dashboard");
                setExternalProjectRequestForm({
                  projectName: "",
                  projectDescription: "",
                  approvalId: "",
                  orderId: ""
                });
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  };

  // Function to render External Project Details Form
  const renderExternalProjectDetailsForm = () => {
    return (
      <div className="project-form-container">
        <h2 className="form-title">
          <FaTasks className="form-icon" /> External Project Details
        </h2>
        <form onSubmit={handleExternalProjectDetailsSubmit} className="project-form">
          <div className="form-group">
            <label className="form-label">
              Project Request ID*
            </label>
            <select
              className="form-select"
              value={externalProjectDetailsForm.projectRequestId}
              onChange={(e) => handleInputChange('externalProjectDetails', 'projectRequestId', e.target.value)}
              required
            >
              <option value="">Select Project Request ID</option>
              {projectRequestIds.map((id) => (
                <option key={id} value={id}>{id}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Project Status</label>
            <select
              className="form-select"
              value={externalProjectDetailsForm.projectStatus}
              onChange={(e) => handleInputChange('externalProjectDetails', 'projectStatus', e.target.value)}
              required
            >
              <option value="">Choose Project Status</option>
              {projectStatusOptions.map((status) => (
                <option key={status} value={status}>{status.replace('_', ' ')}</option>
              ))}
            </select>
          </div>

          <div className="form-actions">
            <button type="submit" className="form-button save-button">
              <FaEdit /> Update Details
            </button>
            <button 
              type="button" 
              className="form-button cancel-button"
              onClick={() => {
                setActiveView("dashboard");
                setExternalProjectDetailsForm({
                  projectRequestId: "",
                  projectStatus: ""
                });
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  };

  // Function to render External Project Labor Form
  const renderExternalProjectLaborForm = () => {
    return (
      <div className="project-form-container">
        <h2 className="form-title">
          <FaUsersCog className="form-icon" /> External Project Labor
        </h2>
        <form onSubmit={handleExternalProjectLaborSubmit} className="project-form">
          <div className="form-group">
            <label className="form-label">
              Project ID*
            </label>
            <select
              className="form-select"
              value={externalProjectLaborForm.projectId}
              onChange={(e) => handleInputChange('externalProjectLabor', 'projectId', e.target.value)}
              required
            >
              <option value="">Select Project ID</option>
              {projectIds.map((id) => (
                <option key={id} value={id}>{id}</option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                Job Role Needed*
              </label>
              <input
                className="form-input"
                type="text"
                placeholder="e.g. Project Manager, Engineer, Technician"
                value={externalProjectLaborForm.jobRoleNeeded}
                onChange={(e) => handleInputChange('externalProjectLabor', 'jobRoleNeeded', e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Employee ID*
              </label>
              <select
                className="form-select"
                value={externalProjectLaborForm.employeeId}
                onChange={(e) => handleInputChange('externalProjectLabor', 'employeeId', e.target.value)}
                required
              >
                <option value="">Select Employee</option>
                {employeeIds.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.name} ({employee.id})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="form-button save-button">
              <FaUsersCog /> Assign Labor
            </button>
            <button 
              type="button" 
              className="form-button cancel-button"
              onClick={() => {
                setActiveView("dashboard");
                setExternalProjectLaborForm({
                  projectId: "",
                  jobRoleNeeded: "",
                  employeeId: ""
                });
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  };

  // Function to render External Project Equipment Form - Updated to support multiple equipment items
  const renderExternalProjectEquipmentForm = () => {
    return (
      <div className="project-form-container">
        <h2 className="form-title">
          <FaTools className="form-icon" /> External Project Equipment
        </h2>
        <form onSubmit={handleExternalProjectEquipmentSubmit} className="project-form">
          <div className="form-group">
            <label className="form-label">
              Project ID*
            </label>
            <select
              className="form-select"
              value={externalProjectEquipmentForm.projectId}
              onChange={(e) => handleInputChange('externalProjectEquipment', 'projectId', e.target.value)}
              required
            >
              <option value="">Select Project ID</option>
              {projectIds.map((id) => (
                <option key={id} value={id}>{id}</option>
              ))}
            </select>
          </div>

          <div className="form-section">
            <div className="form-section-header">
              <h3>Equipment Items</h3>
              <button 
                type="button" 
                className="add-item-button"
                onClick={addEquipmentField}
              >
                <FaPlusCircle /> Add Equipment
              </button>
            </div>
            
            {externalProjectEquipmentForm.equipmentItems.map((item, index) => (
              <div key={index} className="equipment-item">
                <div className="form-group">
                  <label className="form-label">
                    Equipment Name*
                  </label>
                  <div className="input-with-button">
                    <select
                      className="form-select"
                      value={item.name}
                      onChange={(e) => updateEquipmentItem(index, e.target.value)}
                      required
                    >
                      <option value="">Select Equipment</option>
                      {equipmentNames.map((equipment) => (
                        <option key={equipment.id} value={equipment.name}>
                          {equipment.name}
                        </option>
                      ))}
                    </select>
                    {index > 0 && (
                      <button 
                        type="button" 
                        className="remove-item-button"
                        onClick={() => removeEquipmentField(index)}
                      >
                        <FaTrash /> Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="form-actions">
            <button type="submit" className="form-button save-button">
              <FaTools /> Assign Equipment
            </button>
            <button 
              type="button" 
              className="form-button cancel-button"
              onClick={() => {
                setActiveView("dashboard");
                setExternalProjectEquipmentForm({
                  projectId: "",
                  equipmentItems: [{ name: "" }]
                });
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  };

  // Function to render External Project Warranty Form
  const renderExternalProjectWarrantyForm = () => {
    return (
      <div className="project-form-container">
        <h2 className="form-title">
          <FaShieldAlt className="form-icon" /> External Project Warranty
        </h2>
        <form onSubmit={handleExternalProjectWarrantySubmit} className="project-form">
          <div className="form-group">
            <label className="form-label">
              Project ID*
            </label>
            <select
              className="form-select"
              value={externalProjectWarrantyForm.projectId}
              onChange={(e) => handleInputChange('externalProjectWarranty', 'projectId', e.target.value)}
              required
            >
              <option value="">Select Project ID</option>
              {projectIds.map((id) => (
                <option key={id} value={id}>{id}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">
              Warranty Coverage Year*
            </label>
            <input
              className="form-input"
              type="number"
              placeholder="Enter coverage in years"
              value={externalProjectWarrantyForm.warrantyCoverageYear}
              onChange={(e) => handleInputChange('externalProjectWarranty', 'warrantyCoverageYear', e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                Warranty Start Date*
              </label>
              <input
                className="form-input"
                type="date"
                value={externalProjectWarrantyForm.warrantyStartDate}
                onChange={(e) => handleInputChange('externalProjectWarranty', 'warrantyStartDate', e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Warranty End Date*
              </label>
              <input
                className="form-input"
                type="date"
                value={externalProjectWarrantyForm.warrantyEndDate}
                onChange={(e) => handleInputChange('externalProjectWarranty', 'warrantyEndDate', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="form-button save-button">
              <FaShieldAlt /> Set Warranty
            </button>
            <button 
              type="button" 
              className="form-button cancel-button"
              onClick={() => {
                setActiveView("dashboard");
                setExternalProjectWarrantyForm({
                  projectId: "",
                  warrantyCoverageYear: "",
                  warrantyStartDate: "",
                  warrantyEndDate: ""
                });
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  };

  // Function to render Internal Project Request Form
  const renderInternalProjectRequestForm = () => {
    const validProjectTypes = ["Training Program", "Department Event", "Facility Maintenance"];
    return (
      <div className="project-form-container">
        <h2 className="form-title">
          <FaClipboardList className="form-icon" /> Internal Project Request
        </h2>
        <form onSubmit={handleInternalProjectRequestSubmit} className="project-form">
          <div className="form-group">
            <label className="form-label">
              Project Name*
            </label>
            <input
              className="form-input"
              type="text"
              placeholder="Enter project name"
              value={internalProjectRequestForm.projectName}
              onChange={(e) => handleInputChange('internalProjectRequest', 'projectName', e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                Request Date*
              </label>
              <input
                className="form-input"
                type="date"
                value={internalProjectRequestForm.requestDate}
                onChange={(e) => handleInputChange('internalProjectRequest', 'requestDate', e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Target Starting Date
              </label>
              <input
                className="form-input"
                type="date"
                value={internalProjectRequestForm.startingDate}
                onChange={(e) => handleInputChange('internalProjectRequest', 'startingDate', e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                Employee
              </label>
              <select
                className="form-select"
                value={internalProjectRequestForm.employeeId}
                onChange={(e) => handleInputChange('internalProjectRequest', 'employeeId', e.target.value)}
              >
                <option value="">Select Employee</option>
                {employeeIds.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.name} ({employee.id})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                Department
              </label>
              <select
                className="form-select"
                value={internalProjectRequestForm.departmentId}
                onChange={(e) => handleInputChange('internalProjectRequest', 'departmentId', e.target.value)}
              >
                <option value="">Select Department</option>
                {departmentIds.map((id) => (
                  <option key={id} value={id}>{id}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              Reason For Request
            </label>
            <textarea
              className="form-textarea"
              placeholder="Describe the reason for this project request"
              value={internalProjectRequestForm.reasonForRequest}
              onChange={(e) => handleInputChange('internalProjectRequest', 'reasonForRequest', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Materials Needed
            </label>
            <textarea
              className="form-textarea"
              placeholder="List any materials needed for this project"
              value={internalProjectRequestForm.materialsNeeded}
              onChange={(e) => handleInputChange('internalProjectRequest', 'materialsNeeded', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Equipment Needed
            </label>
            <textarea
              className="form-textarea"
              placeholder="List any equipment needed for this project"
              value={internalProjectRequestForm.equipmentNeeded}
              onChange={(e) => handleInputChange('internalProjectRequest', 'equipmentNeeded', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Project Type
            </label>
            <select
              className="form-select"
              value={internalProjectRequestForm.projectType}
              onChange={(e) => handleInputChange('internalProjectRequest', 'projectType', e.target.value)}
            >
              <option value="">Select Project Type</option>
              {validProjectTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="form-actions">
            <button type="submit" className="form-button save-button">
              <FaPlus /> Create Project
            </button>
            <button 
              type="button" 
              className="form-button cancel-button"
              onClick={() => {
                setActiveView("dashboard");
                setInternalProjectRequestForm({
                  projectName: "",
                  requestDate: "",
                  startingDate: "",
                  employeeId: "",
                  departmentId: "",
                  reasonForRequest: "",
                  materialsNeeded: "",
                  equipmentNeeded: "",
                  projectType: ""
                });
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  };

  // Function to render Internal Project Details Form
  const renderInternalProjectDetailsForm = () => {
    return (
      <div className="project-form-container">
        <h2 className="form-title">
          <FaTasks className="form-icon" /> Internal Project Details
        </h2>
        <form onSubmit={handleInternalProjectDetailsSubmit} className="project-form">
          <div className="form-group">
            <label className="form-label">
              Project Request ID*
            </label>
            <select
              className="form-select"
              value={internalProjectDetailsForm.projectRequestId}
              onChange={(e) => handleInputChange('internalProjectDetails', 'projectRequestId', e.target.value)}
              required
            >
              <option value="">Select Project Request ID</option>
              {internalProjectRequestIds.map((id) => (
                <option key={id} value={id}>{id}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">
              Project Status
            </label>
            <select
              className="form-select"
              value={internalProjectDetailsForm.projectStatus}
              onChange={(e) => handleInputChange('internalProjectDetails', 'projectStatus', e.target.value)}
              required
            >
              <option value="">Choose Project Status</option>
              {internalProjectStatusOptions.map((status) => (
                <option key={status} value={status}>{status.replace('_', ' ')}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">
              Approval ID
            </label>
            <select
              className="form-select"
              value={internalProjectDetailsForm.approvalId}
              onChange={(e) => handleInputChange('internalProjectDetails', 'approvalId', e.target.value)}
            >
              <option value="">Select Approval ID</option>
              {internalApprovalIds.map((id) => (
                <option key={id} value={id}>{id}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">
              Project Description
            </label>
            <textarea
              className="form-textarea"
              placeholder="Describe the project scope and objectives"
              value={internalProjectDetailsForm.projectDescription}
              onChange={(e) => handleInputChange('internalProjectDetails', 'projectDescription', e.target.value)}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="form-button save-button">
              <FaEdit /> Update Details
            </button>
            <button 
              type="button" 
              className="form-button cancel-button"
              onClick={() => {
                setActiveView("dashboard");
                setInternalProjectDetailsForm({
                  projectRequestId: "",
                  projectStatus: "",
                  approvalId: "",
                  projectDescription: ""
                });
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  };

  // Function to render Internal Project Labor Form
  const renderInternalProjectLaborForm = () => {
    return (
      <div className="project-form-container">
        <h2 className="form-title">
          <FaUsersCog className="form-icon" /> Internal Project Labor
        </h2>
        <form onSubmit={handleInternalProjectLaborSubmit} className="project-form">
          <div className="form-group">
            <label className="form-label">
              Project ID*
            </label>
            <select
              className="form-select"
              value={internalProjectLaborForm.projectId}
              onChange={(e) => handleInputChange('internalProjectLabor', 'projectId', e.target.value)}
              required
            >
              <option value="">Select Project ID</option>
              {internalProjectIds.map((id) => (
                <option key={id} value={id}>{id}</option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                Job Role*
              </label>
              <input
                className="form-input"
                type="text"
                placeholder="e.g. Project Manager, Engineer, Technician"
                value={internalProjectLaborForm.jobRole}
                onChange={(e) => handleInputChange('internalProjectLabor', 'jobRole', e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Employee*
              </label>
              <select
                className="form-select"
                value={internalProjectLaborForm.employeeId}
                onChange={(e) => handleInputChange('internalProjectLabor', 'employeeId', e.target.value)}
                required
              >
                <option value="">Select Employee</option>
                {employeeIds.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.name} ({employee.id})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                Job Role*
              </label>
              <input
                className="form-input"
                type="text"
                placeholder="e.g. Project Manager, Engineer, Technician"
                value={internalProjectLaborForm.jobRole}
                onChange={(e) => handleInputChange('internalProjectLabor', 'jobRole', e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Employee*
              </label>
              <select
                className="form-select"
                value={internalProjectLaborForm.employeeId}
                onChange={(e) => handleInputChange('internalProjectLabor', 'employeeId', e.target.value)}
                required
              >
                <option value="">Select Employee</option>
                {employeeIds.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.name} ({employee.id})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="form-button save-button">
              <FaUsersCog /> Assign Labor
            </button>
            <button 
              type="button" 
              className="form-button cancel-button"
              onClick={() => {
                setActiveView("dashboard");
                setInternalProjectLaborForm({
                  projectId: "",
                  jobRole: "",
                  employeeId: ""
                });
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  };

  // Main render function
  return (
    <div className="project-planning-container">
      <div className="project-planning-header">
        <h1 className="project-planning-title">Project Planning</h1>
        <div className="project-planning-actions">
        <button 
          className="gantt-chart-button"
          onClick={() => setShowGanttChart(true)}
        >
          <FaChartLine /> Gantt Chart
        </button>
          {activeView !== "dashboard" && (
            <button 
              className="back-to-dashboard-button"
              onClick={() => setActiveView("dashboard")}
            >
              <FaArrowLeft /> Back to Dashboard
            </button>
          )}
        </div>
      </div>

      {renderGanttChart()}

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.type === "success" && <FaCheckCircle className="message-icon" />}
          {message.type === "error" && <FaExclamationCircle className="message-icon" />}
          {message.type === "warning" && <FaExclamationTriangle className="message-icon" />}
          {message.text}
          <button 
            className="message-close" 
            onClick={() => setMessage({ text: "", type: "" })}
          >
            &times;
          </button>
        </div>
      )}

    {activeView === "dashboard" && renderDashboard()}
    {activeView === "externalProjectRequest" && renderExternalProjectRequestForm()}
    {activeView === "externalProjectDetails" && renderExternalProjectDetailsForm()}
    {activeView === "externalProjectLabor" && renderExternalProjectLaborForm()}
    {activeView === "externalProjectEquipment" && renderExternalProjectEquipmentForm()}
    {activeView === "externalProjectWarranty" && renderExternalProjectWarrantyForm()}
    {activeView === "internalProjectRequest" && renderInternalProjectRequestForm()}
    {activeView === "internalProjectDetails" && renderInternalProjectDetailsForm()}
    {activeView === "internalProjectLabor" && renderInternalProjectLaborForm()}
    {activeView === "ganttChart" && <ProjectGanttChart />}
    </div>
  );
};

export default ProjectPlanningDashboard;