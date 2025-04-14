import React, { useState, useRef } from "react";
import "../styles/Reports.css";

const BodyContent = () => {
  const [newProjectID, setNewProjectID] = useState("");
  const [newInternalprojectid, setNewInternalprojectid] = useState("");
  const [selectedReporttype, setSelectedReporttype] = useState("");
  const [newReporttitle, setNewReporttitle] = useState("");
  const [selectedReceivedform, setSelectedReceievedform] = useState("");
  const [newDatecreated, setNewDatecreated] = useState("");
  const [newDescriptionreport, setNewDescriptionreport] = useState("");
  const [selectedAssignedto, setSelectedAssignedto] = useState("");
  const [showReportList, setShowReportList] = useState(false);
  const [currentForm, setCurrentForm] = useState(1);
  const [reportData, setReportData] = useState([]);
  const [selectedReports, setSelectedReports] = useState([]);

  const handleFirstSubmit = (e) => {
    e.preventDefault();
    const newData = {
      ProjectID: newProjectID,
      Internalprojectid: newInternalprojectid,
      TypeofReport: selectedReporttype,
      ReportName: newReporttitle,
      Receivedfrom: selectedReceivedform,
      DateReceive: newDatecreated,
      assignmodule: selectedAssignedto,
      Description: newDescriptionreport,
      AttachedFile: "",
    };
    console.log("New Report Data:", newData);
    setReportData([...reportData, newData]);
    setShowReportList(true);
    setCurrentForm(null);
    setNewProjectID("");
    setNewInternalprojectid("");
    setSelectedReporttype("");
    setNewReporttitle("");
    setSelectedReceievedform("");
    setNewDatecreated("");
    setNewDescriptionreport("");
    setSelectedAssignedto("");
  };

  const handleBackClick = () => {
    setShowReportList(false);
    setCurrentForm(1);
  };

  const handleRemoveReports = () => {
    const newReportData = reportData.filter((_, index) => !selectedReports.includes(index));
    setReportData(newReportData);
    setSelectedReports([]);
  };

  const handleCheckboxChange = (index) => {
    if (selectedReports.includes(index)) {
      setSelectedReports(selectedReports.filter((i) => i !== index));
    } else {
      setSelectedReports([...selectedReports, index]);
    }
  };

  return (
    <div className="body-content-container">
      {currentForm === 1 && (
        <form onSubmit={handleFirstSubmit}>
          <label className="projectidrep">
            <b>Project ID*</b>
          </label>
          <br />
          <input
            className="projectidrep2"
            type="text"
            placeholder="Enter Project ID"
            value={newProjectID}
            onChange={(e) => setNewProjectID(e.target.value)}
            required
          />
          <br />

          <label className="internalprojid">
            <b>Internal Project ID</b>
          </label>
          <br />
          <input
            className="internalprojid2"
            type="text"
            placeholder="INTPRJ-0000"
            value={newInternalprojectid}
            onChange={(e) => setNewInternalprojectid(e.target.value)}
            required
          />
          <br />

          <label className="reporttype">
            <b>Report Type</b>
          </label>
          <br />
          <select
            name="Reporttype"
            className="reporttype2"
            value={selectedReporttype}
            onChange={(e) => setSelectedReporttype(e.target.value)}
            required
          >
            <option value="">Choose Report Type</option>
            <option value="Internal Report">Internal Report</option>
            <option value="External Report">External Report</option>
            <option value="Lateral Report">Lateral Report</option>
            <option value="Proposal Report">Proposal Report</option>
            <option value="Audit Report">Audit Report</option>
            <option value="Analytical Report">Analytical Report</option>
            <option value="Information Report">Information Report</option>
          </select>
          <br />

          <label className="reporttitle">
            <b>Report Title</b>
          </label>
          <br />
          <input
            className="reporttitle2"
            type="text"
            placeholder="Insert Title"
            value={newReporttitle}
            onChange={(e) => setNewReporttitle(e.target.value)}
            required
          />
          <br />

          <label className="receivedform">
            <b>Received From</b>
          </label>
          <br />
          <select
            name="Receivedfrom"
            className="receivedfrom2"
            value={selectedReceivedform}
            onChange={(e) => setSelectedReceievedform(e.target.value)}
            required
          >
            <option value="">Choose Department</option>
            <option value="Management">Management</option>
            <option value="Admin">Admin</option>
            <option value="Accounting">Accounting</option>
            <option value="Financials">Financials</option>
            <option value="Purchasing">Purchasing</option>
            <option value="Operations">Operations</option>
            <option value="Sales">Sales</option>
            <option value="CRM">CRM</option>
            <option value="Inventory">Inventory</option>
            <option value="Distribution">Distribution</option>
            <option value="MRP">MRP</option>
            <option value="Human Resources">Human Resources</option>
          </select>
          <br />

          <label className="datecreated">
            <b>Date Created</b>
          </label>
          <br />
          <input
            className="datecreated2"
            type="date"
            placeholder="00/00/0000"
            value={newDatecreated}
            onChange={(e) => setNewDatecreated(e.target.value)}
            required
          />
          <br />

          <label className="assignedto">
            <b>Assigned To:</b>
          </label>
          <br />
          <select
            name="Assigned to"
            className="assignedto2"
            value={selectedAssignedto}
            onChange={(e) => setSelectedAssignedto(e.target.value)}
            required
          >
            <option value="">Choose Department</option>
            <option value="Management">Management</option>
            <option value="Admin">Admin</option>
            <option value="Accounting">Accounting</option>
            <option value="Financials">Financials</option>
            <option value="Purchasing">Purchasing</option>
            <option value="Operations">Operations</option>
            <option value="Sales">Sales</option>
            <option value="CRM">CRM</option>
            <option value="Inventory">Inventory</option>
            <option value="Distribution">Distribution</option>
            <option value="MRP">MRP</option>
            <option value="Human Resources">Human Resources</option>
          </select>
          <br />

          <label className="descreport">
            <b>Description</b>
          </label>
          <br />
          <input
            className="descreport2"
            type="text"
            placeholder="Add Description"
            value={newDescriptionreport}
            onChange={(e) => setNewDescriptionreport(e.target.value)}
            required
          />
          <br />

          <button type="submit" className="saverep">
            <b>Save</b>
          </button>
          <button className="editrep">
            <b>Edit</b>
          </button>
          <button className="attachfile">
            <b>Attachfile</b>
          </button>
          <h1 className="attach2">
            <b>Attachments</b>
          </h1>
          <h1 className="newreport">
        <b>New Report</b>
      </h1>
      <h1 className="projectlist">Project Task List</h1>

        </form>
      )}


      {showReportList && (
        <>
          <h1 className="reportmonitorlist">
            <b>Report Monitoring List</b>
          </h1>
          <button onClick={handleBackClick} className="addreport">
              <b>Add Report</b>
            </button>
            <button onClick={handleRemoveReports} className="removereport">
              <b>Remove Report</b>
            </button>
          <div className="replisttable1">
            <table className="replist">
              <thead>
                <tr>
                  <th>
                    <input type="checkbox" disabled />
                  </th>
                  <th>
                    <b>Project ID</b>
                  </th>
                  <th>
                    <b>Internal Project ID</b>
                  </th>
                  <th>
                    <b>Report Type</b>
                  </th>
                  <th>
                    <b>Report Title:</b>
                  </th>
                  <th>
                    <b>Received From:</b>
                  </th>
                  <th>
                    <b>Date Created</b>
                  </th>
                  <th>
                    <b>Assigned to:</b>
                  </th>
                  <th>
                    <b>Description</b>
                  </th>
                  <th>
                    <b>Attached File</b>
                  </th>
                </tr>
              </thead>
              <tbody>
                {reportData.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedReports.includes(index)}
                        onChange={() => handleCheckboxChange(index)}
                      />
                    </td>
                    <td>
                      <b>{item.ProjectID}</b>
                    </td>
                    <td>{item.Internalprojectid}</td>
                    <td>{item.TypeofReport}</td>
                    <td>{item.ReportName}</td>
                    <td>{item.Receivedfrom}</td>
                    <td>{item.DateReceive}</td>
                    <td>{item.assignmodule}</td>
                    <td>{item.Description}</td>
                    <td>{item.AttachedFile}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {!showReportList && currentForm !== 1 && (
        <div>
          <button onClick={() => setShowReportList(true)}>View Report List</button>
        </div>
      )}
    </div>
  );
};

export default BodyContent;