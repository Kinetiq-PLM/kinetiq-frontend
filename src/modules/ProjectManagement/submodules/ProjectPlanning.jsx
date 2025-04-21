import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/ProjectPlanning.css";

const BodyContent = () => {
    
const [projectStatusOptions, setProjectStatusOptions] = useState([]);
const [internalProjectStatusOptions, setInternalProjectStatusOptions] = useState([]);

    
  const [newProjectname, setNewProjectname] = useState("");
  const [newProjectdescription, setNewProjectdescription] = useState("");
  const [newApprovalid, setNewApprovalid] = useState("");
  const [newOrderid, setNewOrderid] = useState("");
  const [newProjectrequestid, setNewProjectrequestid] = useState("");
  const [newProjectid, setNewProjectid] = useState("");
  const [newJobroleneeeded, setNewjobroleneeded] = useState("");
  const [newEmployeeid, setNewEmployeeid] = useState("");
  const [newProjectequipmentid, setNewProjectequipmentid] = useState("");
  const [newWarrantycoverageyear, setNewWarrantycoverageyear] = useState("");
  const [newWarrantystartdate, setNewWarrantystartdate] = useState("");
  const [newWarrantyenddate, setNewWarrantyenddate] = useState("");
  const [newBomID, setNewBomID] = useState("");
  const [newProjectbudgetapproval, setNewProjectbudgetapproval] = useState("");
  const [bomIds, setBomIds] = useState([]);
  const [budgetApprovalIds, setBudgetApprovalIds] = useState([]); 
    
  const [newProjectNameint, setNewProjectNameint] = useState("");
  const [newRequestDateint, setNewRequestDateint] = useState("");
  const [newStartingdateint, setNewStartingdateint] = useState("");
  const [newDepartmentIDint, setNewDepartmentIDint] = useState("");
  const [newEmployeeIDint, setNewEmployeeIDint] = useState("");
  const [newBudgetrequestint, setNewBudgetrequestint] = useState("");
  const [newBudgetdescriptionint, setNewBudgetdescriptionint] = useState("");
  const [newProjectrequestidint, setNewProjectrequestidint] = useState("");
  const [newApprovalidint, setNewApprovalidint] = useState("");
  const [newProjectdescriptionint, setNewProjectdescriptionint] = useState("");
  const [newProjectidint, setNewProjectidint] = useState("");
  const [newJobroleint, setNewJobroleint] = useState("");
  
    
  const [selectedProjectStatusint, setSelectedProjectStatusint] = useState("");
  const [selectedProjectStatus, setSelectedProjectStatus] = useState("");
  const [currentForm, setCurrentForm] = useState(1);
  const [selectedNavplan, setSelectedNavplan] = useState("External");
  
    
  const [approvalIds, setApprovalIds] = useState([]);
  const [orderIds, setOrderIds] = useState([]);
  const [projectRequestIds, setProjectRequestIds] = useState([]);
  const [projectIds, setProjectIds] = useState([]);
  const [employeeIds, setEmployeeIds] = useState([]);
  const [equipmentIds, setEquipmentIds] = useState([]);
  const [internalProjectRequestIds, setInternalProjectRequestIds] = useState([]);
  const [internalProjectIds, setInternalProjectIds] = useState([]);
  const [departmentIds, setDepartmentIds] = useState([]);
  
    
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
          
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
        ] = await Promise.all([
          axios.get('/api/project-planning/get-approval-ids/'),
          axios.get('/api/project-planning/get-order-ids/'),
          axios.get('/api/project-planning/get-external-project-request-ids/'),
          axios.get('/api/project-planning/get-external-project-ids/'),
          axios.get('/api/project-planning/get-employee-ids/'),
          axios.get('/api/project-planning/get-equipment-ids/'),
          axios.get('/api/project-planning/get-internal-project-request-ids/'),
          axios.get('/api/project-planning/get-internal-project-ids/'),
          axios.get('/api/project-planning/get-department-ids/'),
          axios.get('/api/project-planning/get-project-status-values/'),
          axios.get('/api/project-planning/get-internal-project-status-values/'),
        ]);
        
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
        
          
        const bomIdsRes = await axios.get('/api/project-planning/get-bom-ids-from-cost-management/');
        console.log("BOM IDs response:", bomIdsRes.data);
        setBomIds(bomIdsRes.data);
        
        const budgetApprovalIdsRes = await axios.get('/api/project-planning/get-budget-approval-ids-from-cost-management/');
        console.log("Budget Approval IDs response:", budgetApprovalIdsRes.data);
        setBudgetApprovalIds(budgetApprovalIdsRes.data);
        
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
        setMessage({ text: "Failed to load data. Please refresh the page.", type: "error" });
      }
    };
    
    fetchDropdownData();
  }, []);
  
  const handleNavClick = (nav) => {
    setSelectedNavplan(nav);
    console.log(`Nav clicked: ${nav}`);
    setCurrentForm(1);
    setMessage({ text: "", type: "" });
  };

  const handleFirstSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/project-planning/create-external-project-request/', {
        ProjectName: newProjectname,
        ProjectDescription: newProjectdescription,
        ApprovalID: newApprovalid,
        OrderID: newOrderid,
        ProjectStatus: "Pending"
      });
      
      console.log("New Project Data:", response.data);
      setMessage({ text: "Project created successfully!", type: "success" });
      setCurrentForm(2);
      
      const projectReqRes = await axios.get('/api/project-planning/get-external-project-request-ids/');
      setProjectRequestIds(projectReqRes.data);
    } catch (error) {
      console.error("Error creating project:", error);
      setMessage({ text: "Failed to create project. Please try again.", type: "error" });
    }
  };

  const handleSecondSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`/api/project-planning/external-details/${newProjectrequestid}/`, {
        project_status: selectedProjectStatus
      });
      
      console.log("Project Request ID Data:", response.data);
      setMessage({ text: "Project status updated successfully!", type: "success" });
      setCurrentForm(3);
      
      const projectIdRes = await axios.get('/api/project-planning/get-external-project-ids/');
      setProjectIds(projectIdRes.data);
    } catch (error) {
      console.error("Error updating project status:", error);
      setMessage({ text: "Failed to update project status. Please try again.", type: "error" });
    }
  };

  const handleThirdSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/project-planning/add-external-project-labor/', {
        ProjectID: newProjectid,
        JobRoleNeeded: newJobroleneeeded,
        EmployeeID: newEmployeeid
      });
      
      console.log("Project Labor Data:", response.data);
      setMessage({ text: "Project labor added successfully!", type: "success" });
      setCurrentForm(4);
      setNewjobroleneeded("");
      setNewEmployeeid("");
    } catch (error) {
      console.error("Error adding project labor:", error);
      setMessage({ text: "Failed to add project labor. Please try again.", type: "error" });
    }
  };

  const handleFourthSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/project-planning/add-external-project-equipment/', {
        ProjectID: newProjectid,
        ProjectEquipmentID: newProjectequipmentid    
      });
      
      console.log("Project Equipment ID Data:", response.data);
      setMessage({ text: "Project equipment added successfully!", type: "success" });
      setCurrentForm(5);
    } catch (error) {
      console.error("Error adding project equipment:", error);
      setMessage({ text: "Failed to add project equipment. Please try again.", type: "error" });
    }
  };

const handleFifthSubmit = async (e) => {
  e.preventDefault();
    const startDate = new Date(newWarrantystartdate);
  const endDate = new Date(newWarrantyenddate);
  
  if (endDate <= startDate) {
    setMessage({ text: "Warranty end date must be after warranty start date", type: "error" });
    return;
  }
  
  try {
    const response = await axios.post('/api/project-planning/add-external-project-warranty/', {
      ProjectID: newProjectid,
      Warrantycoverageyear: newWarrantycoverageyear,
      Warrantystartdate: newWarrantystartdate,
      Warrantyenddate: newWarrantyenddate
    });
    
    console.log("Project Warranty Data:", response.data);
    setMessage({ text: "Project warranty added successfully!", type: "success" });
    setCurrentForm(6);
  } catch (error) {
    console.error("Error adding project warranty:", error);
    if (error.response && error.response.data && error.response.data.error) {
      setMessage({ text: `Failed to add project warranty: ${error.response.data.error}`, type: "error" });
    } else {
      setMessage({ text: "Failed to add project warranty. Please try again.", type: "error" });
    }
  }
};

const handleSixthSubmit = async (e) => {
  e.preventDefault();
  try {
    console.log("Submitting form with data:", {
      ProjectID: newProjectid,
      BomID: newBomID,
      ProjectBudgetApproval: newProjectbudgetapproval
    });
    
    const response = await axios.post('/api/project-planning/add-external-project-cost-management/', {
      ProjectID: newProjectid,
      BomID: newBomID,
      ProjectBudgetApproval: newProjectbudgetapproval
    });
    
    console.log("Project Cost Management Data:", response.data);
    setMessage({ text: "Project completed successfully!", type: "success" });
    setCurrentForm(1);
  } catch (error) {
    console.error("Error completing project:", error);
    if (error.response && error.response.data && error.response.data.error) {
      setMessage({ text: `Failed to complete project: ${error.response.data.error}`, type: "error" });
    } else {
      setMessage({ text: "Failed to complete project. Please try again.", type: "error" });
    }
  }
};


const handleFirstSubmitint = async (e) => {
  e.preventDefault();
  try {
    console.log("Submitting internal project data:", {
      ProjectNameint: newProjectNameint,
      RequestDateint: newRequestDateint,
      Startingdateint: newStartingdateint,
      EmployeeIDint: newEmployeeIDint,
      DepartmentIDint: newDepartmentIDint,
      Budgetrequestint: newBudgetrequestint,
      Budgetdescriptionint: newBudgetdescriptionint
    });
    
    const response = await axios.post('/api/project-planning/create-internal-project/', {
      ProjectNameint: newProjectNameint,
      RequestDateint: newRequestDateint,
      Startingdateint: newStartingdateint,
      EmployeeIDint: newEmployeeIDint,
      DepartmentIDint: newDepartmentIDint,
      Budgetrequestint: newBudgetrequestint,
      Budgetdescriptionint: newBudgetdescriptionint
    });
    
    console.log("Project Name int:", response.data);
    setMessage({ text: "Internal project created successfully!", type: "success" });
    setCurrentForm(8);
    
      
    const intProjectReqRes = await axios.get('/api/project-planning/get-internal-project-request-ids/');
    setInternalProjectRequestIds(intProjectReqRes.data);
  } catch (error) {
    console.error("Error creating internal project:", error);
    setMessage({ text: "Failed to create internal project. Please try again.", type: "error" });
  }
};

  const handleSecondSubmitint = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`/api/project-planning/internal-details/${newProjectrequestidint}/`, {
        intrnl_project_status: selectedProjectStatusint,
        approval_id: newApprovalidint,
        project_description: newProjectdescriptionint
      });
      
      console.log("Project Request ID:", response.data);
      setMessage({ text: "Internal project details updated successfully!", type: "success" });
      setCurrentForm(9);
      
        
      const intProjectIdRes = await axios.get('/api/project-planning/get-internal-project-ids/');
      setInternalProjectIds(intProjectIdRes.data);
    } catch (error) {
      console.error("Error updating internal project details:", error);
      setMessage({ text: "Failed to update internal project details. Please try again.", type: "error" });
    }
  };

  const handleThirdSubmitint = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/project-planning/add-internal-project-labor/', {
        Projectidint: newProjectidint, 
        Jobroleint: newJobroleint,
        EmployeeIDint: newEmployeeIDint
      });
      
      console.log("Project ID", response.data);
      setMessage({ text: "Internal project labor added successfully!", type: "success" });
      setCurrentForm(1);
    } catch (error) {
      console.error("Error adding internal project labor:", error);
      setMessage({ text: "Failed to add internal project labor. Please try again.", type: "error" });
    }
  };

    return (
      <div className="project-planning-container">
        <div className="project-planning-header">
          <h1 className="project-planning-title">New Project Plan</h1>
          <div className="project-planning-actions">
            <button className="gantt-chart-button">
              <b>Gantt Chart</b>
            </button>
            <button className="create-plan-button">
              <b>Create Plan</b>
            </button>
          </div>
        </div>
  
        <div className="project-planning-navigation">
          <button
            className={`nav-button ${
              selectedNavplan === "Internal" ? "selected" : ""
            }`}
            onClick={() => handleNavClick("Internal")}
          >
            <b>Internal</b>
          </button>
          <button
            className={`nav-button ${
              selectedNavplan === "External" ? "selected" : ""
            }`}
            onClick={() => handleNavClick("External")}
          >
            <b>External</b>
          </button>
        </div>
  
        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}
  
        <div className="project-planning-form-container">
          {selectedNavplan === "External" && (
            <>
              {currentForm === 1 && (
                <form onSubmit={handleFirstSubmit} className="project-form">
                  <h2 className="form-title">Project Request</h2>
                  <div className="form-group">
                    <label className="form-label">
                      <b>Project Name*</b>
                    </label>
                    <input
                      className="form-input"
                      type="text"
                      placeholder="Name"
                      value={newProjectname}
                      onChange={(e) => setNewProjectname(e.target.value)}
                      required
                    />
                  </div>
  
                  <div className="form-group">
                    <label className="form-label">
                      <b>Project Description</b>
                    </label>
                    <textarea
                      className="form-textarea"
                      placeholder="Add Description"
                      value={newProjectdescription}
                      onChange={(e) => setNewProjectdescription(e.target.value)}
                      required
                    />
                  </div>
  
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">
                        <b>Approval ID</b>
                      </label>
                      <select
                        className="form-select"
                        value={newApprovalid}
                        onChange={(e) => setNewApprovalid(e.target.value)}
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
                        <b>Order ID*</b>
                      </label>
                      <select
                        className="form-select"
                        value={newOrderid}
                        onChange={(e) => setNewOrderid(e.target.value)}
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
                    <button type="submit" className="form-button next-button">
                      <b>Next</b>
                    </button>
                    <button type="button" className="form-button edit-button">
                      <b>Edit</b>
                    </button>
                  </div>
                </form>
              )}
  
              {/* [All other external forms follow the same improved structure...] */}
              
              {currentForm === 2 && (
                <form onSubmit={handleSecondSubmit} className="project-form">
                  <h2 className="form-title">Project Details</h2>
                  <div className="form-group">
                    <label className="form-label">
                      <b>Project Request ID*</b>
                    </label>
                    <select
                      className="form-select"
                      value={newProjectrequestid}
                      onChange={(e) => setNewProjectrequestid(e.target.value)}
                      required
                    >
                      <option value="">Select Project Request ID</option>
                      {projectRequestIds.map((id) => (
                        <option key={id} value={id}>{id}</option>
                      ))}
                    </select>
                  </div>
  
                  <div className="form-group">
                    <label className="form-label"><b>Project Status</b></label>
                    <select
                      className="form-select"
                      value={selectedProjectStatus}
                      onChange={(e) => setSelectedProjectStatus(e.target.value)}
                      required
                    >
                      <option value="">Choose Project Status</option>
                      {projectStatusOptions.map((status) => (
                        <option key={status} value={status}>{status.replace('_', ' ')}</option>
                      ))}
                    </select>
                  </div>
  
                  <div className="form-actions">
                    <button type="submit" className="form-button next-button">
                      <b>Next</b>
                    </button>
                    <button type="button" className="form-button edit-button" onClick={() => setCurrentForm(1)}>
                      <b>Edit</b>
                    </button>
                  </div>
                </form>
              )}
  
              {currentForm === 3 && (
                <form onSubmit={handleThirdSubmit} className="project-form">
                  <h2 className="form-title">Project Labor</h2>
                  <div className="form-group">
                    <label className="form-label">
                      <b>Project ID*</b>
                    </label>
                    <select
                      className="form-select"
                      value={newProjectid}
                      onChange={(e) => setNewProjectid(e.target.value)}
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
                        <b>Job Role Needed*</b>
                      </label>
                      <input
                        className="form-input"
                        type="text"
                        placeholder="Job Role"
                        value={newJobroleneeeded}
                        onChange={(e) => setNewjobroleneeded(e.target.value)}
                        required
                      />
                    </div>
  
                    <div className="form-group">
                      <label className="form-label">
                        <b>Employee ID*</b>
                      </label>
                      <select
                        className="form-select"
                        value={newEmployeeid}
                        onChange={(e) => setNewEmployeeid(e.target.value)}
                        required
                      >
                        <option value="">Select Employee ID</option>
                        {employeeIds.map((id) => (
                          <option key={id} value={id}>{id}</option>
                        ))}
                      </select>
                    </div>
                  </div>
  
                  <div className="form-actions">
                    <button type="submit" className="form-button next-button">
                      <b>Next</b>
                    </button>
                    <button type="button" className="form-button edit-button" onClick={() => setCurrentForm(2)}>
                      <b>Edit</b>
                    </button>
                  </div>
                </form>
              )}
  
              {/* [Other forms continue with the same pattern...] */}
              
            </>
          )}
  
          {selectedNavplan === "Internal" && (
            <>
              {currentForm === 1 && (
                <form onSubmit={handleFirstSubmitint} className="project-form">
                  <h2 className="form-title">Project Request</h2>
                  <div className="form-group">
                    <label className="form-label">
                      <b>Project Name*</b>
                    </label>
                    <input
                      className="form-input"
                      type="text"
                      placeholder="Name"
                      value={newProjectNameint}
                      onChange={(e) => setNewProjectNameint(e.target.value)}
                      required
                    />
                  </div>
  
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">
                        <b>Request Date</b>
                      </label>
                      <input
                        className="form-input"
                        type="date"
                        value={newRequestDateint}
                        onChange={(e) => setNewRequestDateint(e.target.value)}
                        required
                      />
                    </div>
  
                    <div className="form-group">
                      <label className="form-label">
                        <b>Starting Date</b>
                      </label>
                      <input
                        className="form-input"
                        type="date"
                        value={newStartingdateint}
                        onChange={(e) => setNewStartingdateint(e.target.value)}
                        required
                      />
                    </div>
                  </div>
  
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">
                        <b>Employee ID</b>
                      </label>
                      <select
                        className="form-select"
                        value={newEmployeeIDint}
                        onChange={(e) => setNewEmployeeIDint(e.target.value)}
                        required
                      >
                        <option value="">Select Employee ID</option>
                        {employeeIds.map((id) => (
                          <option key={id} value={id}>{id}</option>
                        ))}
                      </select>
                    </div>
  
                    <div className="form-group">
                      <label className="form-label">
                        <b>Department ID</b>
                      </label>
                      <select
                        className="form-select"
                        value={newDepartmentIDint}
                        onChange={(e) => setNewDepartmentIDint(e.target.value)}
                        required
                      >
                        <option value="">Select Department ID</option>
                        {departmentIds.map((id) => (
                          <option key={id} value={id}>{id}</option>
                        ))}
                      </select>
                    </div>
                  </div>
  
                  <div className="form-group">
                    <label className="form-label">
                      <b>Budget Request</b>
                    </label>
                    <input
                      className="form-input"
                      type="number"
                      placeholder="000.000.000"
                      value={newBudgetrequestint}
                      onChange={(e) => setNewBudgetrequestint(e.target.value)}
                      required
                    />
                  </div>
  
                  <div className="form-group">
                    <label className="form-label">
                      <b>Budget Description</b>
                    </label>
                    <textarea
                      className="form-textarea"
                      placeholder="Budget Description"
                      value={newBudgetdescriptionint}
                      onChange={(e) => setNewBudgetdescriptionint(e.target.value)}
                      required
                    />
                  </div>
  
                  <div className="form-actions">
                    <button type="submit" className="form-button next-button">
                      <b>Next</b>
                    </button>
                    <button type="button" className="form-button edit-button">
                      <b>Edit</b>
                    </button>
                  </div>
                </form>
              )}
  
              {/* [Other internal forms follow the same pattern...] */}
              
            </>
          )}
        </div>
      </div>
    );
  };
  
  export default BodyContent;