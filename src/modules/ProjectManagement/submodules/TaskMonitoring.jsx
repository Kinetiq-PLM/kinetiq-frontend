import React, { useState } from "react";
import "../styles/TaskMonitoring.css";

const BodyContent = () => {
  const [newProjectID, setNewProjectID] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskdeadline, setNewTaskdeadline] = useState("");
  const [selectedTaskstatus, setSelectedTaskstatus] = useState("");
  const [newLaborid, setNewLaborid] = useState("");
  const [newTaskid, setNewTaskid] = useState("");

  const [newProjectID2, setNewProjectID2] = useState("");
  const [newTaskDescription2, setNewTaskDescription2] = useState("");
  const [newTaskdeadline2, setNewTaskdeadline2] = useState("");
  const [selectedTaskstatus2, setSelectedTaskstatus2] = useState("");
  const [newLaborid2, setNewLaborid2] = useState("");
  const [newTaskid2, setNewTaskid2] = useState("");
  const [currentForm, setCurrentForm] = useState(1);
  const [selectedNavtask, setSelectedNavtask] = useState("External Task");
  const [showTasklist1, setShowTasklist1] = useState(false);
  const [showTasklist, setShowTasklist] = useState(false);
  const [taskdata, setTaskdata] = useState([]);
  const [taskdata2, setTaskdata2] = useState([]);
  const [selectedReports, setSelectedReports] = useState([]);

  const handleNavClick = (nav) => {
    setSelectedNavtask(nav);
    console.log(`Nav clicked: ${nav}`);
    setCurrentForm(1);
    setShowTasklist(false);
    setShowTasklist1(false); 
    setSelectedReports([]); 
  };

  const handleFirstSubmitTask = (e) => {
    e.preventDefault();
    const newData = {
      Taskid: newTaskid,
      ProjectID: newProjectID,
      TaskDescription: newTaskDescription,
      TaskStatus: selectedTaskstatus,
      Taskdeadline: newTaskdeadline,
      Laborid: newLaborid,
    };
    console.log("External", newData);
    setTaskdata([...taskdata, newData]);
    setShowTasklist1(true);
    setCurrentForm(null);
    setNewProjectID("");
    setNewTaskDescription("");
    setSelectedTaskstatus("");
    setNewTaskdeadline("");
    setNewLaborid("");
    setNewTaskid("");
  };

  const handleSecondSubmitTask = (e) => {
    e.preventDefault();
    const newData = {
      Taskid: newTaskid2, 
      ProjectID: newProjectID2,
      TaskDescription: newTaskDescription2,
      TaskStatus: selectedTaskstatus2,
      Taskdeadline: newTaskdeadline2,
      Laborid: newLaborid2,
    };
    console.log("Internal", newData);
    setTaskdata2([...taskdata2, newData]);
    setShowTasklist(true);
    setCurrentForm(null);
    setNewProjectID2("");
    setNewTaskDescription2("");
    setSelectedTaskstatus2("");
    setNewTaskdeadline2("");
    setNewLaborid2("");
    setNewTaskid2("");
  };

  const handleBackClick = () => {
    setShowTasklist(false);
    setShowTasklist1(false);
    setCurrentForm(1);
    setSelectedReports([]); 
  };

  const handleCheckboxChange = (index) => {
    const isSelected = selectedReports.includes(index);
    if (isSelected) {
      setSelectedReports(selectedReports.filter((item) => item !== index));
    } else {
      setSelectedReports([...selectedReports, index]);
    }
  };

  const handleRemoveReports = () => {
    if (selectedNavtask === "External Task") {
      const newTasks = taskdata.filter((_, index) => !selectedReports.includes(index));
      setTaskdata(newTasks);
    } else if (selectedNavtask === "Internal Task") {
      const newTasks2 = taskdata2.filter((_, index) => !selectedReports.includes(index));
      setTaskdata2(newTasks2);
    }
    setSelectedReports([]);
  };

  return (
    <div className="body-content-container">

      <div className="planningnav">
        <button
          className={`nav-button ${
            selectedNavtask === "Internal Task" ? "selected1" : ""
          }`}
          onClick={() => handleNavClick("Internal Task")}
        >
          <b>Internal</b>
        </button>

        <button
          className={`nav-button ${
            selectedNavtask === "External Task" ? "selected1" : ""
          }`}
          onClick={() => handleNavClick("External Task")}
        >
          <b>External</b>
        </button>
      </div>

      {selectedNavtask === "External Task" && currentForm === 1 && (
        <form onSubmit={handleFirstSubmitTask}>
          <h1 className="projecttask">
            <b>New Project Task</b>
          </h1>
          <label className="projectidtask">
            <b>Project ID*</b>
          </label>
          <br />
          <input
            className="projectidtask2"
            type="text"
            placeholder="Enter Project ID"
            value={newProjectID}
            onChange={(e) => setNewProjectID(e.target.value)}
            required
          />
          <br />

          <label className="taskdescrip">
            <b>Task Description</b>
          </label>
          <br />

          <input
            className="taskdescrip2"
            type="text"
            placeholder="Add Description"
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
            required
          />
          <br />

          <label className="taskstatus">
            <b>Task Status</b>
          </label>
          <br />
          <select
            name="Reporttype"
            className="taskstatus2"
            value={selectedTaskstatus}
            onChange={(e) => setSelectedTaskstatus(e.target.value)}
            required
          >
            <option value="">Status</option>
            <option value="Completed">Completed</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Pending">Pending</option>
          </select>
          <br />

          <label className="taskdeadline">
            <b>Task Deadline</b>
          </label>
          <br />

          <input
            className="taskdeadline2"
            type="date"
            placeholder="00/00/0000"
            value={newTaskdeadline}
            onChange={(e) => setNewTaskdeadline(e.target.value)}
            required
          />
          <br />

          <label className="laborid">
            <b>Labor ID*</b>
          </label>
          <br />

          <input
            className="laborid2"
            type="text"
            placeholder="Insert ID"
            value={newLaborid}
            onChange={(e) => setNewLaborid(e.target.value)}
            required
          />
          <br />

          <label className="taskid">
            <b>Task ID</b>
          </label>
          <br />

          <input
            className="taskid2"
            type="text"
            placeholder="Insert ID"
            value={newTaskid}
            onChange={(e) => setNewTaskid(e.target.value)}
            required
          />
          <br />

          <h1 className="projecttasklist">Project Task List</h1>

          <button type="submit" className="savetask"><b>Save</b></button>
          <button className="edittask"><b>Edit</b></button>
        </form>

      )}

      {selectedNavtask === "Internal Task" && currentForm === 1 && (
        <form onSubmit={handleSecondSubmitTask}>
          <h1 className="projecttask">
            <b>New Project Task</b>
          </h1>
          <label className="projectidtask">
            <b>Project ID*</b>
          </label>
          <br />
          <input
            className="projectidtask2"
            type="text"
            placeholder="Enter Project ID"
            value={newProjectID2}
            onChange={(e) => setNewProjectID2(e.target.value)}
            required
          />
          <br />

          <label className="taskdescrip">
            <b>Task Description</b>
          </label>
          <br />

          <input
            className="taskdescrip2"
            type="text"
            placeholder="Add Description"
            value={newTaskDescription2}
            onChange={(e) => setNewTaskDescription2(e.target.value)}
            required
          />
          <br />

          <label className="taskstatus">
            <b>Task Status</b>
          </label>
          <br />
          <select
            name="Reporttype"
            className="taskstatus2"
            value={selectedTaskstatus2}
            onChange={(e) => setSelectedTaskstatus2(e.target.value)}
            required
          >
            <option value="">Status</option>
            <option value="Completed">Completed</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Pending">Pending</option>
          </select>
          <br />

          <label className="taskdeadline">
            <b>Task Deadline</b>
          </label>
          <br />

          <input
            className="taskdeadline2"
            type="date"
            placeholder="00/00/0000"
            value={newTaskdeadline2}
            onChange={(e) => setNewTaskdeadline2(e.target.value)}
            required
          />
          <br />

          <label className="laborid">
            <b>Labor ID*</b>
          </label>
          <br />

          <input
            className="laborid2"
            type="text"
            placeholder="Insert ID"
            value={newLaborid2}
            onChange={(e) => setNewLaborid2(e.target.value)}
            required
          />
          <br />

          <label className="taskid">
            <b>Task ID</b>
          </label>
          <br />

          <input
            className="taskid2"
            type="text"
            placeholder="Insert ID"
            value={newTaskid2}
            onChange={(e) => setNewTaskid2(e.target.value)}
            required
          />
          <br />

          <h1 className="projecttasklist">Project Task List</h1>
          <button type="submit" className="savetask"><b>Save</b></button>
          <button className="edittask"><b>Edit</b></button>
        </form>
      )}

      {selectedNavtask === "External Task" && showTasklist1 && (
        <>
          <h1 className="reportmonitorlist">
            <b>Project List</b>
          </h1>
          <button onClick={handleBackClick} className="addreport">
            <b>Add Task</b>
          </button>
          <button onClick={handleRemoveReports} className="removereport">
            <b>Remove Task</b>
          </button>
          <div className="replisttable1">
            <table className="replist">
              <thead>
                <tr>
                  <th>
                    <input type="checkbox" disabled />
                  </th>
                  <th>
                    <b>TaskID</b>
                  </th>
                  <th>
                    <b>Project ID</b>
                  </th>
                  <th>
                    <b>Labor ID</b>
                  </th>
                  <th>
                    <b>Status</b>
                  </th>
                  <th>
                    <b>Deadline</b>
                  </th>
                  <th>
                    <b>Description</b>
                  </th>
                </tr>
              </thead>
              <tbody>
                {taskdata.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedReports.includes(index)}
                        onChange={() => handleCheckboxChange(index)}
                      />
                    </td>
                    <td>
                      <b>{item.Taskid}</b>
                    </td>
                    <td>{item.ProjectID}</td>
                    <td>{item.Laborid}</td>
                    <td>{item.TaskStatus}</td>
                    <td>{item.Taskdeadline}</td>
                    <td>{item.TaskDescription}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {selectedNavtask === "Internal Task" && showTasklist && (
        <>
          <h1 className="reportmonitorlist">
            <b>Project List</b>
          </h1>
          <button onClick={handleBackClick} className="addreport">
            <b>Add Task</b>
          </button>
          <button onClick={handleRemoveReports} className="removereport">
            <b>Remove Task</b>
          </button>
          <div className="replisttable1">
            <table className="replist">
              <thead>
                <tr>
                  <th>
                    <input type="checkbox" disabled />
                  </th>
                  <th>
                    <b>TaskID</b>
                  </th>
                  <th>
                    <b>Project ID</b>
                  </th>
                  <th>
                    <b>Labor ID</b>
                  </th>
                  <th>
                    <b>Status</b>
                  </th>
                  <th>
                    <b>Deadline</b>
                  </th>
                  <th>
                    <b>Description</b>
                  </th>
                </tr>
              </thead>
              <tbody>
                {taskdata2.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedReports.includes(index)}
                        onChange={() => handleCheckboxChange(index)}
                      />
                    </td>
                    <td>
                      <b>{item.Taskid}</b> 
                    </td>
                    <td>{item.ProjectID}</td> 
                    <td>{item.Laborid}</td> 
                    <td>{item.TaskStatus}</td> 
                    <td>{item.Taskdeadline}</td> 
                    <td>{item.TaskDescription}</td> 
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default BodyContent;