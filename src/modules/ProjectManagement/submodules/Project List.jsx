import React, { useState } from "react";
import "../styles/Project List.css";
import ProjectPlanning from "../submodules/ProjectPlanning.jsx";

const BodyContent = () => {
  const [selectedNav, setSelectedNav] = useState("All");
  const [selectedRequests, setSelectedRequests] = useState([]);
  const [clickedRowIndexAll, setClickedRowIndexAll] = useState(null);
  const [clickedRowIndexInternal, setClickedRowIndexInternal] = useState(null);
  const [clickedRowIndexExternal, setClickedRowIndexExternal] = useState(null);
  const [showInternalRequest, setShowInernalRequest] = useState(false);
  const [showsProjectRequest, setShowsProjectrequest] = useState(true);
  const [showExternalRequest, setShowExternalRequest] = useState(false);

  const [datareq, setDatareq] = useState([
    {
      ProjectID: "Proj_0122123123",
      ProjectName: "Proj101",
      ApprovalID: "0000001",
      ItemID: "0000",
      Description: "None",
      RequestDate: "",
      StartDate: "",
      DeptID: "",
      EmployeeID: "",
    },
  ]);

  const [dataintreq2, setDataintreq2] = useState([
    {
      ProjectID: "Proj_0122123123",
      ProjectName: "Proj101",
      RequestDate: "0000001",
      ValidDate: "0000",
      Starting: "None",
      ApprovalID: "",
      EmployeeID: "",
      DeptID: "",
      Description: "",
    },
    {
      ProjectID: "Proj_0122123123",
      ProjectName: "Proj101",
      RequestDate: "0000001",
      ValidDate: "0000",
      Starting: "None",
      ApprovalID: "",
      EmployeeID: "",
      DeptID: "",
      Description: "",
    },
    {
      ProjectID: "Proj_0122123123",
      ProjectName: "Proj101",
      RequestDate: "0000001",
      ValidDate: "0000",
      Starting: "None",
      ApprovalID: "",
      EmployeeID: "",
      DeptID: "",
      Description: "",
    },
    {
      ProjectID: "Proj_0122123123",
      ProjectName: "Proj101",
      RequestDate: "0000001",
      ValidDate: "0000",
      Starting: "None",
      ApprovalID: "",
      EmployeeID: "",
      DeptID: "",
      Description: "",
    },
    {
      ProjectID: "Proj_0122123123",
      ProjectName: "Proj101",
      RequestDate: "0000001",
      ValidDate: "0000",
      Starting: "None",
      ApprovalID: "",
      EmployeeID: "",
      DeptID: "",
      Description: "",
    },
  ]);

  const [dataintreq3, setDataintreq3] = useState([
    {
      ExtProjectID: "Proj_0122123123",
      ProjectName: "Proj101",
      ApprovalID: "0000001",
      OrderID: "0000",
    },
  ]);

  const [datareqdetails, setDatareqdetails] = useState([
    {
      ExtProjectID: "Proj_0122123123",
      ProjectName: "Proj101",
      ProjectStatus: "0000001",
      ProductName: "0000",
      Qty: "0000",
      WarrantyEndDate: "0000",
      OverallProductionCost: "0000",
      BudgetApprovalStatus: "0000",
    },
  ]);

  const handleNavClick = (nav) => {
    setSelectedNav(nav);
    setSelectedRequests([]);
    setClickedRowIndexAll(null);
    setClickedRowIndexInternal(null);
    setClickedRowIndexExternal(null);
    setShowInernalRequest(false);
    setShowExternalRequest(false);
    setShowsProjectrequest(true);
  };

  const handleCheckboxChange = (index) => {
    const updatedSelection = [...selectedRequests];
    updatedSelection[index] = !updatedSelection[index];
    setSelectedRequests(updatedSelection);
  };

  const handleRemoveRequests = () => {
    if (selectedNav === "All") {
      setDatareq((prev) => prev.filter((_, index) => !selectedRequests[index]));
    } else if (selectedNav === "Internal Request") {
      setDataintreq2((prev) => prev.filter((_, index) => !selectedRequests[index]));
    } else if (selectedNav === "External Request") {
      setDataintreq3((prev) => prev.filter((_, index) => !selectedRequests[index]));
    }
    setSelectedRequests([]);
  };

  const handleRowClick = (index, nav) => {
    if (nav === "All") {
      setClickedRowIndexAll(index);
      setShowInernalRequest(false);
      setShowExternalRequest(false);
      setShowsProjectrequest(true);
    } else if (nav === "Internal Request") {
      setClickedRowIndexInternal(index);
      setShowInernalRequest(true);
      setShowExternalRequest(false);
      setShowsProjectrequest(false);
    } else if (nav === "External Request") {
      setClickedRowIndexExternal(index);
      setShowExternalRequest(true);
      setShowInernalRequest(false);
      setShowsProjectrequest(false);
    }
  };

  const handleBackClick = () => {
    setShowInernalRequest(false);
    setShowsProjectrequest(true);
    setShowExternalRequest(false);
    setClickedRowIndexInternal(null);
    setClickedRowIndexExternal(null);
  };
  

  return (
    <div className="body-content-container">
      {showsProjectRequest ? (
        <>
          <div className="projreq">
            <h1>
              <b>Project Request</b>
            </h1>
          </div>
          <h2 className="appr">
            <b>Approve</b>
          </h2>
          <h2 className="nappr">
            <b>Not Approve</b>
          </h2>
          <h2 className="og">
            <b>Ongoing</b>
          </h2>
          <div className="rectangle4"></div>
          <button className="filter">Filter By</button>
          <button className="remove" onClick={handleRemoveRequests}>
            Remove Request
          </button>
          <button className="addtask2">Add Task</button>

          <div className="topnavreq">
            
            <button
              className={`nav-button ${
                selectedNav === "Internal Request" ? "selected1" : ""
              }`}
              onClick={() => handleNavClick("Internal Request")}
            >
              <b>Internal Request</b>
            </button>

            <button
              className={`nav-button ${
                selectedNav === "External Request" ? "selected1" : ""
              }`}
              onClick={() => handleNavClick("External Request")}
            >
              <b>External Request</b>
            </button>
          </div>

          

          {selectedNav === "Internal Request" && (
            <div className="reqtable2">
              <table className="reqtable3">
                <thead>
                  <tr>
                    <th>
                      <input type="checkbox" onChange={() => handleCheckboxChange("all")} />
                    </th>
                    <th>
                      <b>Project ID</b>
                    </th>
                    <th>
                      <b>Project Name</b>
                    </th>
                    <th>
                      <b>Request Date</b>
                    </th>
                    <th>
                      <b>Valid Date</b>
                    </th>
                    <th>
                      <b>Starting Date</b>
                    </th>
                    <th>
                      <b>Approval ID</b>
                    </th>
                    <th>
                      <b>Employee ID</b>
                    </th>
                    <th>
                      <b>Dept ID</b>
                    </th>
                    <th>
                      <b>Description</b>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dataintreq2.map((item, index) => (
                    <tr
                      key={index}
                      onClick={() => handleRowClick(index, "Internal Request")}
                      style={{
                        display:
                          clickedRowIndexInternal !== null &&
                          index < clickedRowIndexInternal
                            ? "none"
                            : "",
                      }}
                    >
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedRequests[index] || false}
                          onChange={() => handleCheckboxChange(index)}
                        />
                      </td>
                      <td>{item.ProjectID}</td>
                      <td>{item.ProjectName}</td>
                      <td>{item.RequestDate}</td>
                      <td>{item.ValidDate}</td>
                      <td>{item.Starting}</td>
                      <td>{item.ApprovalID}</td>
                      <td>{item.EmployeeID}</td>
                      <td>{item.DeptID}</td>
                      <td>{item.Description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {selectedNav === "External Request" && (
            <div className="reqtable4">
              <table className="reqtable5">
                <thead>
                  <tr>
                    <th></th>
                    <th>
                      <b>ExtProject ID</b>
                    </th>
                    <th>
                      <b>Project Name</b>
                    </th>
                    <th>
                      <b>Approval ID</b>
                    </th>
                    <th>
                      <b>Order ID</b>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dataintreq3.map((item, index) => (
                    <tr
                      key={index}
                      onClick={() => handleRowClick(index, "External Request")}
                      style={{
                        display:
                          clickedRowIndexExternal !== null &&
                          index < clickedRowIndexExternal
                            ? "none"
                            : "",
                      }}
                    >
                      <td></td>
                      <td>{item.ExtProjectID}</td>
                      <td>{item.ProjectName}</td>
                      <td>{item.ApprovalID}</td>
                      <td>{item.OrderID}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div id="line5"></div>
          <div id="line6"></div>
        </>
      ) : showInternalRequest ? (
        <div className="internal-request-details">
          {clickedRowIndexInternal !== null && dataintreq2[clickedRowIndexInternal] && (
            <div>
              
            </div>
          )}
          <button onClick={handleBackClick} className="back1">
            <b>Back</b>
          </button>
        </div>
      ) : showExternalRequest ? (
        <div className="external-request-details">
          {clickedRowIndexExternal !== null && dataintreq3[clickedRowIndexExternal] && (
            <div className="externaldetails1">
              <table className="externaldetails">
                <thead>
                  <tr>
                    <th></th>
                    <th>
                      <b>ExtProject ID</b>
                    </th>
                    <th>
                      <b>Project Name</b>
                    </th>
                    <th>
                      <b>Project Status</b>
                    </th>
                    <th>
                      <b>Product Name</b>
                    </th>
                    <th>
                      <b>Qty</b>
                    </th>
                    <th>
                      <b>Warranty End Date</b>
                    </th>
                    <th>
                      <b>Overall Production Cost</b>
                    </th>
                    <th>
                      <b>Budget Approval Status</b>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {datareqdetails.map((item, index) => (
                    <tr key={index} >
                      <td></td>
                      <td>{item.ExtProjectID}</td>
                      <td>{item.ProjectName}</td>
                      <td>{item.ProjectStatus}</td>
                      <td>{item.ProductName}</td>
                      <td>{item.Qty}</td>
                      <td>{item.WarrantyEndDate}</td>
                      <td>{item.OverallProductionCost}</td>
                      <td>{item.BudgetApprovalStatus}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>      
          )}
          <button onClick={handleBackClick} className="back1">
            <b>Back</b>
          </button>
        </div>
        
      ) : null}
    </div>
  );
};

export default BodyContent;