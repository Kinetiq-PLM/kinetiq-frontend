import React, { useState } from "react";
import "../styles/ProjectPlanning.css";

const BodyContent = () => {
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

  const handleNavClick = (nav) => {
    setSelectedNavplan(nav);
    console.log(`Nav clicked: ${nav}`);
    setCurrentForm(1);
  };

  const handleFirstSubmit = (e) => {
    e.preventDefault();
    const newData = {
      ProjectName: newProjectname,
      ProjectDescription: newProjectdescription,
      ApprovalID: newApprovalid,
      OrderID: newOrderid,
    };

    console.log("New Project Data:", newData);
    setCurrentForm(2);
  };

  const handleSecondSubmit = (e) => {
    e.preventDefault();
    const requestIDData = {
      ProjectRequestID: newProjectrequestid,
      ProjectStatus: selectedProjectStatus,
    };
    console.log("Project Request ID Data:", requestIDData);
    setCurrentForm(3);
  };

  const handleThirdSubmit = (e) => {
    e.preventDefault();
    const ProjectLaborData = {
      ProjectID: newProjectid,
      JobRoleNeeded: newJobroleneeeded,
      EmployeeID: newEmployeeid,
    };
    console.log("Project Labor Data:", ProjectLaborData);
    setCurrentForm(4);
    setNewProjectid("");
    setNewjobroleneeded("");
    setNewEmployeeid("");
  };

  const handleFourthSubmit = (e) => {
    e.preventDefault();
    const ProjectequipmentidData = {
      Projectequipmentid: newProjectequipmentid,
    };
    console.log("Project Equipment ID Data:", ProjectequipmentidData);
    setCurrentForm(5);
  };

  const handleFifthSubmit = (e) => {
    e.preventDefault();
    const ProjectWarrantyData = {
      Warrantycoverageyear: newWarrantycoverageyear,
      Warrantystartdate: newWarrantystartdate,
      Warrantyenddate: newWarrantyenddate,
    };
    console.log("Project Warranty Data:", ProjectWarrantyData);
    setCurrentForm(6);
  };

  const handleSixthSubmit = (e) => {
    e.preventDefault();
    const BomidData = {
      BomID: newBomID,
      Projectbudgetapproval: newProjectbudgetapproval,
    };
    console.log("BOM ID Data:", BomidData);
    setCurrentForm(7);
  };

  const handleFirstSubmitint = (e) => {
    e.preventDefault();
    const newData = {
      ProjectNameint: newProjectNameint,
      RequestDateint: newRequestDateint,
      Startingdateint: newStartingdateint,
      EmployeeIDint: newEmployeeIDint,
      DepartmentIDint: newDepartmentIDint,
      Budgetrequestint: newBudgetrequestint,
      Budgetdescriptionint: newBudgetdescriptionint
    };
    console.log("Project Name int:", newData);
    setCurrentForm(8);
  };

  const handleSecondSubmitint = (e) => {
    e.preventDefault();
    const newData = {
      Projectrequestidint: newProjectrequestidint,
      ProjectStatusint: selectedProjectStatusint,
      Approvalidint: newApprovalidint,
      Projectdescriptionint: newProjectdescriptionint, 
    };
    console.log("Project Request ID:", newData);
    setCurrentForm(9);
  };

  const handleThirdSubmitint = (e) => {
    e.preventDefault();
    const newData = {
      Projectidint: newProjectidint, 
      Jobroleint: newJobroleint, 
    };
    console.log("Project ID", newData);
    setCurrentForm();
  };
  return (
    <div className="body-content-container">
      <h1 id="newprojplan">
        <b>New Project Plan</b>
      </h1>
      <button className="ganttchart">
        <b>Gantt Chart</b>
      </button>
      <button className="crplan">
        <b>Create Plan</b>
      </button>

      <div className="planningnav">
        <button
          className={`nav-button ${
            selectedNavplan === "Internal" ? "selected1" : ""
          }`}
          onClick={() => handleNavClick("Internal")}
        >
          <b>Internal</b>
        </button>

        <button
          className={`nav-button ${
            selectedNavplan === "External" ? "selected1" : ""
          }`}
          onClick={() => handleNavClick("External")}
        >
          <b>External</b>
        </button>
      </div>

      {selectedNavplan === "External" && (
        <>
          {currentForm === 1 && (
            <form onSubmit={handleFirstSubmit}>
              <h2 id="projrequest">Project Request</h2>
              <label className="projectname1">
                <b>Project Name*</b>
              </label>
              <br />
              <input
                className="projectname"
                type="text"
                placeholder="Name"
                value={newProjectname}
                onChange={(e) => setNewProjectname(e.target.value)}
                required
              />
              <br />

              <label className="projectdescription1">
                <b>Project Description</b>
              </label>
              <br />
              <input
                className="projectdescription"
                type="text"
                placeholder="Add Description"
                value={newProjectdescription}
                onChange={(e) => setNewProjectdescription(e.target.value)}
                required
              />
              <br />

              <label className="Approvalid1">
                <b>Approval ID</b>
              </label>
              <br />
              <input
                className="Approvalid"
                type="text"
                placeholder="Approval ID"
                value={newApprovalid}
                onChange={(e) => setNewApprovalid(e.target.value)}
                required
              />
              <br />

              <label className="Orderid1">
                <b>Order ID*</b>
              </label>
              <br />
              <input
                className="Orderid"
                type="text"
                placeholder="Order ID"
                value={newOrderid}
                onChange={(e) => setNewOrderid(e.target.value)}
                required
              />
              <br />
              <button type="submit" className="next">
                <b>Next</b>
              </button>
              <button className="edit"><b>Edit</b></button>
            </form>
          )}

          {currentForm === 2 && (
            <form onSubmit={handleSecondSubmit}>
              <h2 id="projrequest">Project Details</h2>
              <div>
                <label className="projectrequestid1">
                  <b>Project Request ID*</b>
                </label>
                <br />
                <input
                  className="projectrequestid"
                  type="text"
                  placeholder="Insert Request ID"
                  value={newProjectrequestid}
                  onChange={(e) => setNewProjectrequestid(e.target.value)}
                  required
                />
                <br />

                <label className="projectstatus1">Project Status</label>
                <br />
                <select
                  name="projectstatus"
                  className="projectstatus"
                  value={selectedProjectStatus}
                  onChange={(e) => setSelectedProjectStatus(e.target.value)}
                  required
                >
                  <option value="">Choose Project Status</option>
                  <option value="Approved">Approved</option>
                  <option value="Reject">Reject</option>
                  <option value="Ongoing">Ongoing</option>
                </select>
                <br />
                <button type="submit" className="next">
                  <b>Next</b>
                </button>
                <button className="edit"><b>Edit</b></button>
              </div>
            </form>
          )}

          {currentForm === 3 && (
            <form onSubmit={handleThirdSubmit}>
              <h2 id="projrequest">Project Labor</h2>
              <div>
                <label className="projectid1">
                  <b>Project ID*</b>
                </label>
                <br />
                <input
                  className="projectid"
                  type="text"
                  placeholder="Insert ID"
                  value={newProjectid}
                  onChange={(e) => setNewProjectid(e.target.value)}
                  required
                />
                <br />

                <label className="jobrole1">
                  <b>Job Role Needed*</b>
                </label>

                <br />
                <input
                  className="jobrole"
                  type="text"
                  placeholder=""
                  value={newJobroleneeeded}
                  onChange={(e) => setNewjobroleneeded(e.target.value)}
                  required
                /><h1 className="jobroleneeded"><b>Job Role:</b></h1>
                <br />

                <label className="employeeid1">
                  <b>Employee ID*</b>
                </label>
                <br />
                <input
                  className="employeeid"
                  type="text"
                  placeholder="Insert ID"
                  value={newEmployeeid}
                  onChange={(e) => setNewEmployeeid(e.target.value)}
                  required
                />
                <br />
                <button type="submit" className="next">
                  <b>Next</b>
                </button>
                <button className="edit"><b>Edit</b></button>
              </div>
            </form>
          )}

          {currentForm === 4 && (
            <form onSubmit={handleFourthSubmit}>
              <h2 id="projrequest">Project Equipments</h2>
              <div>
                <label className="projectid1">
                  <b>Project ID*</b>
                </label>
                <br />
                <input
                  className="projectid"
                  type="text"
                  placeholder="Insert ID"
                  value={newProjectid}
                  onChange={(e) => setNewProjectid(e.target.value)}
                  required
                />
                <br />
                <label className="projectequipid1">
                  <b>Project Equipment ID*</b>
                </label>
                <br />
                <input
                  className="projectequipid"
                  type="text"
                  placeholder="Insert ID"
                  value={newProjectequipmentid}
                  onChange={(e) => setNewProjectequipmentid(e.target.value)}
                  required
                />
                <h1 className="eqpid">
                  <b>EQP ID:</b>
                </h1>
                <br />
                <button type="submit" className="next">
                  <b>Next</b>
                </button>
                <button className="edit"><b>Edit</b></button>
              </div>
            </form>
          )}

          {currentForm === 5 && (
            <form onSubmit={handleFifthSubmit}>
              <h2 id="projrequest">Project Warranty</h2>
              <div>
                <label className="projectid1">
                  <b>Project ID*</b>
                </label>
                <br />
                <input
                  className="projectid"
                  type="text"
                  placeholder="Insert ID"
                  value={newProjectid}
                  onChange={(e) => setNewProjectid(e.target.value)}
                  required
                />
                <br />

                <label className="projectwarranty1">
                  <b>Warranty Coverage Year*</b>
                </label>
                <br />
                <input
                  className="projectwarranty"
                  type="text"
                  placeholder="Insert Year"
                  value={newWarrantycoverageyear}
                  onChange={(e) => setNewWarrantycoverageyear(e.target.value)}
                  required
                />
                <br />

                <label className="warrantystart1">
                  <b>Warranty Start Date</b>
                </label>
                <br />
                <input
                  className="warrantystart"
                  type="date"
                  placeholder="Insert Date"
                  value={newWarrantystartdate}
                  onChange={(e) => setNewWarrantystartdate(e.target.value)}
                  required
                />
                <br />

                <label className="warrantyend1">
                  <b>Warranty End Date</b>
                </label>
                <br />
                <input
                  className="warrantyend"
                  type="date"
                  placeholder="Insert Date"
                  value={newWarrantyenddate}
                  onChange={(e) => setNewWarrantyenddate(e.target.value)}
                  required
                />
                <br />
                <button type="submit" className="next">
                  <b>Next</b>
                </button>
                <button className="edit"><b>Edit</b></button>
              </div>
            </form>
          )}

          {currentForm === 6 && (
            <form onSubmit={handleSixthSubmit}>
              <h2 id="projrequest">Project Cost Management</h2>
              <div>
                <label className="projectid1">
                  <b>Project ID*</b>
                </label>
                <br />
                <input
                  className="projectid"
                  type="text"
                  placeholder="Insert ID"
                  value={newProjectid}
                  onChange={(e) => setNewProjectid(e.target.value)}
                  required
                />
                <br />

                <label className="Bomid1">
                  <b>BOM ID</b>
                </label>
                <br />
                <input
                  className="Bomid"
                  type="text"
                  placeholder="Insert ID"
                  value={newBomID}
                  onChange={(e) => setNewBomID(e.target.value)}
                  required
                />
                <br />

                <label className="projectbudget1">
                  <b>Project Budget Approval</b>
                </label>
                <br />
                <input
                  className="projectbudget"
                  type="text"
                  placeholder="Approval"
                  value={newProjectbudgetapproval}
                  onChange={(e) => setNewProjectbudgetapproval(e.target.value)}
                  required
                />
                <br />
                <button type="submit" className="next">
                  <b>Save </b>
                </button>
                <button className="edit"><b>Edit</b></button>
              </div>
            </form>
          )}
        </>
      )}

      {selectedNavplan === "Internal" && (
        <>
          {currentForm === 1 && (
            <form onSubmit={handleFirstSubmitint}>
              <h2 id="projrequest">Project Request</h2>
              <label className="projectname1">
                <b>Project Name*</b>
              </label>
              <br />
              <input
                className="projectname"
                type="text"
                placeholder="Name"
                value={newProjectNameint}
                onChange={(e) => setNewProjectNameint(e.target.value)}
                required
              />
              <br />

              <label className="Requesdate2">
                <b>Request Date</b>
              </label>
              <br />
              <input
                className="requestdateint"
                type="date"
                placeholder="00/00/0000"
                value={newRequestDateint}
                onChange={(e) => setNewRequestDateint(e.target.value)}
                required
              />
              <br />

              <label className="startingdate2">
                <b>Starting Date</b>
              </label>
              <br />
              <input
                className="startingdateint"
                type="date"
                placeholder="00/00/0000"
                value={newStartingdateint}
                onChange={(e) => setNewStartingdateint(e.target.value)}
                required
              />
              <br />

              <label className="employeeid2">
                <b>Employee ID</b>
              </label>
              <br />
              <input
                className="employeeidint"
                type="text" 
                placeholder="EMP-IT-0000-0000"
                value={newEmployeeIDint}
                onChange={(e) => setNewEmployeeIDint(e.target.value)}
                required
              />
              <br />

              <label className="departmentid2">
                <b>Department ID</b>
              </label>
              <br />
              <input className="departmentidint"
                type="text" 
                placeholder="DEPT-IT"
                value={newDepartmentIDint}
                onChange={(e) => setNewDepartmentIDint(e.target.value)}
                required
              />
              <br />

              <label className="budgetrequest2">
                <b>Budget Request</b>
              </label>
              <br />
              <input
                className="budgetrequestint"
                type="number"
                placeholder="000.000.000"
                value={newBudgetrequestint}
                onChange={(e) => setNewBudgetrequestint(e.target.value)}
                required
              />
              <br />

              <input
                className="budgetdescriptionint"
                type="text"
                placeholder="Budget Description"
                value={newBudgetdescriptionint}
                onChange={(e) => setNewBudgetdescriptionint(e.target.value)}
                required
              />
              <br />
              <button type="submit" className="next">
                <b>Next</b>
              </button>
              <button className="edit"><b>Edit</b></button>
            </form>
          )}

          {currentForm === 8 && (
            <form onSubmit={handleSecondSubmitint}>
              <h2 id="projrequest">Project Details</h2>
              <div>
                <label className="projectrequestid1">
                  <b>Project Request ID*</b>
                </label>
                <br />
                <input
                  className="projectrequestid"
                  type="text"
                  placeholder="Insert Request ID"
                  value={newProjectrequestidint}
                  onChange={(e) => setNewProjectrequestidint(e.target.value)}
                  required
                />
                <br />

                <label className="projectstatus2"><b>Project Status</b></label>
                <br />
                <select
                  name="projectstatus"
                  className="projectstatusint"
                  value={selectedProjectStatusint}
                  onChange={(e) => setSelectedProjectStatusint(e.target.value)}
                  required
                >
                  <option value="">Choose Project Status</option>
                  <option value="Approved">Approved</option>
                  <option value="Reject">Reject</option>
                  <option value="Ongoing">Ongoing</option>
                </select>
                <br />

                <label className="Approvalid2">
                  <b>Approval ID</b>
                </label>
                <br />
                <input
                  className="Approvalidint"
                  type="text"
                  placeholder="Approval ID"
                  value={newApprovalidint}
                  onChange={(e) => setNewApprovalidint(e.target.value)}
                  required
                />
                <br />

                <input
                  className="projectdescint"
                  type="text"
                  placeholder="Project Description"
                  value={newProjectdescriptionint}
                  onChange={(e) => setNewProjectdescriptionint(e.target.value)}
                  required
                />
                <h1 className="projectdesc2"><b>Project Description:</b></h1>
                <br />

                <button type="submit" className="next">
                  <b>Save</b>
                </button>
                <button className="edit"><b>Edit</b></button>
              </div>
            </form>
          )}
        </>
      )}

    {currentForm === 9 && (
            <form onSubmit={handleThirdSubmitint}>
              <h2 id="projrequest">Project Labor</h2>
              <div>
                <label className="projectrequestid1">
                  <b>Project ID*</b>
                </label>
                <br />
                <input
                  className="projectrequestid"
                  type="text"
                  placeholder="PRJ-0000-00000"
                  value={newProjectidint}
                  onChange={(e) => setNewProjectidint(e.target.value)}
                  required
                />

                <br />
                <label className="jobrole2">
                  <b>Job Role Needed</b>
                </label>
                <br />
                <input
                  className="jobroleint"
                  type="text"
                  placeholder="Job Role: "
                  value={newJobroleint}
                  onChange={(e) => setNewJobroleint(e.target.value)}
                  required
                />
                <br />

                <label className="employeeidplan2">
                  <b>Employee ID</b>
                </label>
                <br />
                <input
                  className="employeeidint2"
                  type="text"
                  placeholder="PRJ-0000-00000"
                  value={newEmployeeIDint}
                  onChange={(e) => setNewEmployeeIDint(e.target.value)}
                  required
                />

            <button type="submit" className="next">
                  <b>Save</b>
                </button>
                <button className="edit"><b>Edit</b></button>

                </div>
                </form>
              )}

    </div>
  );
};

export default BodyContent;