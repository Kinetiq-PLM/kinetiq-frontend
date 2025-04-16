import React, { useState } from "react";
import "../styles/QualityControl.css";

const BodyContent = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedValue, setSelectedValue] = useState("qualityChecked");
    const [tableData, setTableData] = useState(
        Array(11).fill().map(() => ({
            startDate: "",
            endDate: "",
            notes: "Notes...",
            status: "Completed",
            qualityChecked: "Checked",
        }))
    );


    const [projects, setProjects] = useState([
        { id: "P0OO1", taskId: "111401", endDate: "", status: "Finished" },
        { id: "P0OO2", taskId: "111601", endDate: "", status: "Finished" },
        { id: "P0OO3", taskId: "151201", endDate: "", status: "Finished" },
        { id: "P0OO4", taskId: "111601", endDate: "", status: "Finished" },
        { id: "P0OO5", taskId: "151201", endDate: "", status: "Finished" }
    ]);


    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleModalToggle = () => {
        setIsModalOpen(!isModalOpen);
    };

    const handleQCstatusChange = (index, value) => {
        handleChange(index, "status", value);
    };

    const handleChange = (index, field, value) => {
        const newData = [...tableData];
        newData[index][field] = value;
        setTableData(newData);
    };

    const handleDateChange = (projectId, newDate) => {
        setProjects((prevProjects) =>
            prevProjects.map((project) =>
                project.id === projectId ? { ...project, endDate: newDate } : project
            )
        );
    };

    const handleRemoveProject = (projectId) => {
        const updatedProjects = projects.filter((project) => project.id !== projectId);
        setProjects(updatedProjects);
    };

    return (
        <div className="qcprod">
            <div className="qcprod-columns">
                {/* Column 1 */}
                <div className="qcprodColumn1">
                    <div className="qcprodheader">Quality Control and Rework Process</div>
                    <div className="qc-box-container">
                        <div className="qc-box">4,970<div className="qc-textbox">Completed</div></div>
                        <div className="qc-box">515<div className="qc-textbox">Completed</div></div>
                        <div className="qc-box">2,435<div className="qc-textbox">Completed</div></div>
                    </div>
                </div>

                {/* Column 2 */}
                <div className="qcprodColumn2">
                    <div className="qcprodheader-container">
                        <div>
                            <div className="qcprodnumberview">7,536</div>
                            <h2>Sent to Project Management</h2>
                        </div>
                        <button className="viewlist-button" onClick={handleModalToggle}>View Finished Projects</button>
                    </div>

                    <div className="qcprodControls">
                        <div className="qcprodsearch-bar">
                            <img src="/icons/search-icon.png" alt="Search Icon" className="search-icon" />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button className="prodqcrefresh-button">Refresh</button>
                        <button className="prodqcsave-button">Save</button>
                    </div>
                </div>
            </div>

            {/* Editable Dashboard Table */}
            <div className="table-container">
                <table className="qcprodDashboard">
                    <thead>
                        <tr>
                            <th>Production Order Details ID</th>
                            <th>Task ID</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Notes</th>
                            <th>Status</th>
                            <th>Quality Checked</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.map((row, index) => (
                            <tr key={index} className="prodqcrp-row">
                                <td><h1>P0OO1</h1></td>
                                <td><h2>111201</h2></td>

                                <td>
                                    <input
                                        type="date"
                                        value={row.startDate}
                                        onChange={(e) => handleChange(index, "startDate", e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="date"
                                        value={row.endDate}
                                        onChange={(e) => handleChange(index, "endDate", e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        value={row.notes}
                                        onChange={(e) => handleChange(index, "notes", e.target.value)}
                                    />
                                </td>

                                <td>
                                    <select
                                        className={`prod-availability-dropdown ${row.status.toLowerCase().replace(/\s/g, '-')}`}
                                        value={row.status}
                                        onChange={(e) => handleQCstatusChange(index, e.target.value)}
                                    >
                                        <option value="Completed">Completed</option>
                                        <option value="Pending">Pending</option>
                                        <option value="In Progress">In Progress</option>
                                    </select>
                                </td>

                                <td>
                                    <select
                                        className={`prod-qc-dropdown ${row.qualityChecked.toLowerCase().replace(/\s/g, '-')}`}
                                        value={row.qualityChecked}
                                        onChange={(e) => handleChange(index, "qualityChecked", e.target.value)}
                                    >
                                        <option value="checked">Checked</option>
                                        <option value="rework">Rework</option>
                                        <option value="pending">Pending</option>
                                        <option value="rework-in-progress">Rework In Progress</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="qcmodal">
                    <div className="qcmodal-content">
                        <span className="close" onClick={handleModalToggle}>&times;</span>
                        <h1>List of Finished Projects</h1>
                        <div className="qcfinished-projects">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Production Order ID</th>
                                        <th>Task ID</th>
                                        <th>End Date</th>
                                        <th>Status</th>
                                        <th>Remove</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {projects.map((project) => (
                                        <tr key={project.id}>
                                            <td>{project.id}</td>
                                            <td>{project.taskId}</td>
                                            <td>
                                                <input className="qcFPdate"
                                                    type="date"
                                                    value={project.endDate}
                                                    onChange={(e) => handleDateChange(project.id, e.target.value)}
                                                />
                                            </td>
                                            <td>{project.status}</td>
                                            <td>
                                                <button onClick={() => handleRemoveProject(project.id)}>Remove</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BodyContent;
