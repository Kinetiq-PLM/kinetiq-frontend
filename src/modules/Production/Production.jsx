import React, { useState } from "react";
import "./styles/Production.css";
import EditIcon from "../../modules/Production/icons/Edit-Square-Icon.png";

const BodyContent = () => {
    const [selectedOption, setSelectedOption] = useState("All Projects");
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

   
    const handleSelectChange = (event) => {
        setSelectedOption(event.target.value);
    };

   
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };


    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const [isYes, setIsYes] = useState(false);

    const handleToggle = () => {
        setIsYes((prev) => !prev);
    };

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
    };

    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
    };

    return (
        <div className="prod">
            <div className="flex-container">
                <div className="left-column">
                    <div className="body-content-container">
                        <div className="purch-box-container">
                            {["Total Project", "In Progress", "Planned", "Completed"].map((label, index) => (
                                <div className="purch-box" key={index}>
                                    <span className="purch-number">-</span>
                                    <span className="purch-label">{label}</span>
                                </div>
                            ))}
                        </div>


                        <div className="search-dropdown-container">
                            <select className="dropdown" value={selectedOption} onChange={handleSelectChange}>
                                <option value="All Projects">All Projects</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Planned">Planned</option>
                                <option value="Completed">Completed</option>
                            </select>

                            <div className="search-wrapper">
                                <img src="/icons/search-icon.png" alt="Search" className="search-icon" />
                                <input
                                    type="text"
                                    className="search-bar"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                />
                                <button className="edit-btn" onClick={openModal}>
                                    <img src="/icons/Edit-Square-Icon.png" alt="Edit Icon" className="edit-icon" />
                                    Edit
                                </button>

                            </div>
                        </div>


                        <div className="big-container-wrapper">
                            <div className="dashboard-container">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Production Order ID</th>
                                            <th>Task ID</th>
                                            <th>BOM ID</th>
                                            <th>Start Date</th>
                                            <th>End Date</th>
                                            <th>Target Quantity</th>
                                            <th>Remarks</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                </table>
                                <table>
                                    <div className="table-container">
                                        <tr>
                                            <td style={{ fontWeight: "bold", }}>P0OO1</td>
                                            <td>111201</td>
                                            <td>null</td>
                                            <td>2024-03-05 </td>
                                            <td>2024-03-15 </td>
                                            <td>10</td>
                                            <td>Make it blue.</td>
                                            <td><button>Completed</button></td>

                                        </tr>
                                        <tr>
                                            <td style={{ fontWeight: "bold", }}>P0OO1</td>
                                            <td>111201</td>
                                            <td>null</td>
                                            <td>2024-03-05 </td>
                                            <td>2024-03-15 </td>
                                            <td>10</td>
                                            <td>Make it blue.</td>
                                            <td><button>Completed</button></td>

                                        </tr>
                                        <tr>
                                            <td style={{ fontWeight: "bold", }}>P0OO1</td>
                                            <td>111201</td>
                                            <td>null</td>
                                            <td>2024-03-05 </td>
                                            <td>2024-03-15 </td>
                                            <td>10</td>
                                            <td>Make it blue.</td>
                                            <td><button>Completed</button></td>

                                        </tr>
                                        <tr>
                                            <td style={{ fontWeight: "bold", }}>P0OO1</td>
                                            <td>111201</td>
                                            <td>null</td>
                                            <td>2024-03-05 </td>
                                            <td>2024-03-15 </td>
                                            <td>10</td>
                                            <td>Make it blue.</td>
                                            <td><button>Completed</button></td>

                                        </tr>
                                        <tr>
                                            <td style={{ fontWeight: "bold", }}>P0OO1</td>
                                            <td>111201</td>
                                            <td>null</td>
                                            <td>2024-03-05 </td>
                                            <td>2024-03-15 </td>
                                            <td>10</td>
                                            <td>Make it blue.</td>
                                            <td><button>Completed</button></td>

                                        </tr>
                                        <tr>
                                            <td style={{ fontWeight: "bold", }}>P0OO1</td>
                                            <td>111201</td>
                                            <td>null</td>
                                            <td>2024-03-05 </td>
                                            <td>2024-03-15 </td>
                                            <td>10</td>
                                            <td>Make it blue.</td>
                                            <td><button>Completed</button></td>
                                        </tr>

                                        <tr>
                                            <td style={{ fontWeight: "bold", }}>P0OO1</td>
                                            <td>111201</td>
                                            <td>null</td>
                                            <td>2024-03-05 </td>
                                            <td>2024-03-15 </td>
                                            <td>10</td>
                                            <td>Make it blue.</td>
                                            <td><button>Completed</button></td>
                                        </tr>

                                        <tr>
                                            <td style={{ fontWeight: "bold", }}>P0OO1</td>
                                            <td>111201</td>
                                            <td>null</td>
                                            <td>2024-03-05 </td>
                                            <td>2024-03-15 </td>
                                            <td>10</td>
                                            <td>Make it blue.</td>
                                            <td><button>Completed</button></td>
                                        </tr>

                                        <tr>
                                            <td style={{ fontWeight: "bold", }}>P0OO1</td>
                                            <td>111201</td>
                                            <td>null</td>
                                            <td>2024-03-05 </td>
                                            <td>2024-03-15 </td>
                                            <td>10</td>
                                            <td>Make it blue.</td>
                                            <td><button>Completed</button></td>
                                        </tr>

                                        <tr>
                                            <td style={{ fontWeight: "bold", }}>P0OO1</td>
                                            <td>111201</td>
                                            <td>null</td>
                                            <td>2024-03-05 </td>
                                            <td>2024-03-15 </td>
                                            <td>10</td>
                                            <td>Make it blue.</td>
                                            <td><button>Completed</button></td>
                                        </tr>

                                    </div>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="right-column">
                    <h2>List of Tasks</h2>
                    <div className="right-small-containers">
                        <div className="tasks-from-pm">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Task ID</th>
                                        <th>Date Ordered</th>
                                        <th></th>
                                    </tr>
                                </thead>
                            </table>


                            <div className="table-container">
                                <table>
                                    <tbody>
                                        {[...Array(7)].map((_, index) => (
                                            <tr key={index}>
                                                <td>11120{index + 1}</td>
                                                <td>2/1{index + 3}/2025</td>
                                                <td><button className="add-btn">Add</button></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="progress-container">


                        </div>
                    </div>
                </div>
            </div>


            {isModalOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>

                        <div className="modal-firstcolumn">
                            <h1>Production Order Detail ID</h1>
                            <h2>P0D001</h2>
                            <h1>Production Order ID</h1>
                            <h3>PO001</h3>
                            <h1>Date Ordered</h1>
                            <h3>2/13/2025</h3>
                            <h1>Description</h1>
                            <p>Custom welded frame for Project Delta with Custom Lorem Ipsum</p>
                            <h1>BOM ID</h1>
                            <h4>00000</h4>
                            <h1>Target Quantity</h1>
                            <h4>2</h4>
                            <h1>Labor</h1>
                            <input type="text-labor" />
                            <h1>Quality Check Status</h1>
                            <div className="qualitycheckstatus-dropdown">
                                < select className={`qcdropdown  ${selectedOption === 'Checked'
                                        ? 'checked'
                                        : selectedOption === 'Rework In Progress'
                                            ? 'rework-in-progress'
                                            : selectedOption === 'Pending'
                                                ? 'pending'
                                                : selectedOption === 'Rework'
                                                    ? 'rework'
                                                    : ''
                                    }`}
                                    value={selectedOption}
                                    onChange={handleSelectChange}>
                                    <option value="checked">Checked</option>
                                    <option value="rework">Rework</option>
                                    <option value="rework-in-progress">Rework In Progress</option>
                                    <option value="pending">Pending</option>

                                </select>
                            </div>


                        </div>
                        <div className="modal-secondcolumn">
                            <div className="dates-container">
                                <div className="dates-container">
                                    <div className="date-row">
                                        <div className="date-column">
                                            <h4>Start Date</h4>
                                            <input type="date" value={startDate} onChange={handleStartDateChange} />
                                        </div>
                                        <div className="date-column">
                                            <h4>End Date</h4>
                                            <input type="date" value={endDate} onChange={handleEndDateChange} />
                                        </div>
                                    </div>
                                </div>

                                <div className="component-dashboard">
                                    <table>
                                        <thead>
                                            <th>Material ID</th>
                                            <th>Quantity</th>
                                            <th>Unit of Measure</th>
                                            <th>Availability</th>
                                        </thead>
                                    </table>
                                    <table>

                                        <div className="table-container">
                                            <tr>
                                                <td>Polyester</td>
                                                <td>1</td>
                                                <td>Sheets</td>
                                                <td>

                                                    <div className="yes-no-container">

                                                        <label className="switch">
                                                            <input type="checkbox" checked={isYes} onChange={handleToggle} />
                                                            <span className="slider"></span>
                                                        </label>
                                                        <p>{isYes ? "Yes" : "No"}</p>
                                                    </div>
                                                </td>
                                            </tr>

                                            <tr>
                                                <td>Polyester</td>
                                                <td>1</td>
                                                <td>Sheets</td>
                                                <td>

                                                    <div className="yes-no-container">

                                                        <label className="switch">
                                                            <input type="checkbox" checked={isYes} onChange={handleToggle} />
                                                            <span className="slider"></span>
                                                        </label>
                                                        <p>{isYes ? "Yes" : "No"}</p>
                                                    </div>
                                                </td>
                                            </tr>

                                            <tr>
                                                <td>Polyester</td>
                                                <td>1</td>
                                                <td>Sheets</td>
                                                <td>

                                                    <div className="yes-no-container">

                                                        <label className="switch">
                                                            <input type="checkbox" checked={isYes} onChange={handleToggle} />
                                                            <span className="slider"></span>
                                                        </label>
                                                        <p>{isYes ? "Yes" : "No"}</p>
                                                    </div>
                                                </td>
                                            </tr>

                                            <tr>
                                                <td>Polyester</td>
                                                <td>1</td>
                                                <td>Sheets</td>
                                                <td>

                                                    <div className="yes-no-container">

                                                        <label className="switch">
                                                            <input type="checkbox" checked={isYes} onChange={handleToggle} />
                                                            <span className="slider"></span>
                                                        </label>
                                                        <p>{isYes ? "Yes" : "No"}</p>
                                                    </div>
                                                </td>
                                            </tr>

                                            <tr>
                                                <td>Polyester</td>
                                                <td>1</td>
                                                <td>Sheets</td>
                                                <td>

                                                    <div className="yes-no-container">

                                                        <label className="switch">
                                                            <input type="checkbox" checked={isYes} onChange={handleToggle} />
                                                            <span className="slider"></span>
                                                        </label>
                                                        <p>{isYes ? "Yes" : "No"}</p>
                                                    </div>
                                                </td>
                                            </tr>

                                            <tr>
                                                <td>Polyester</td>
                                                <td>1</td>
                                                <td>Sheets</td>
                                                <td>

                                                    <div className="yes-no-container">

                                                        <label className="switch">
                                                            <input type="checkbox" checked={isYes} onChange={handleToggle} />
                                                            <span className="slider"></span>
                                                        </label>
                                                        <p>{isYes ? "Yes" : "No"}</p>
                                                    </div>
                                                </td>
                                            </tr>

                                            <tr>
                                                <td>Polyester</td>
                                                <td>1</td>
                                                <td>Sheets</td>
                                                <td>

                                                    <div className="yes-no-container">

                                                        <label className="switch">
                                                            <input type="checkbox" checked={isYes} onChange={handleToggle} />
                                                            <span className="slider"></span>
                                                        </label>
                                                        <p>{isYes ? "Yes" : "No"}</p>
                                                    </div>
                                                </td>
                                            </tr>

                                            <tr>
                                                <td>Polyester</td>
                                                <td>1</td>
                                                <td>Sheets</td>
                                                <td>

                                                    <div className="yes-no-container">

                                                        <label className="switch">
                                                            <input type="checkbox" checked={isYes} onChange={handleToggle} />
                                                            <span className="slider"></span>
                                                        </label>
                                                        <p>{isYes ? "Yes" : "No"}</p>
                                                    </div>
                                                </td>
                                            </tr>

                                            <tr>
                                                <td>Polyester</td>
                                                <td>1</td>
                                                <td>Sheets</td>
                                                <td>

                                                    <div className="yes-no-container">

                                                        <label className="switch">
                                                            <input type="checkbox" checked={isYes} onChange={handleToggle} />
                                                            <span className="slider"></span>
                                                        </label>
                                                        <p>{isYes ? "Yes" : "No"}</p>
                                                    </div>
                                                </td>
                                            </tr>

                                            <tr>
                                                <td>Polyester</td>
                                                <td>1</td>
                                                <td>Sheets</td>
                                                <td>

                                                    <div className="yes-no-container">

                                                        <label className="switch">
                                                            <input type="checkbox" checked={isYes} onChange={handleToggle} />
                                                            <span className="slider"></span>
                                                        </label>
                                                        <p>{isYes ? "Yes" : "No"}</p>
                                                    </div>
                                                </td>
                                            </tr>

                                            <tr>
                                                <td>Polyester</td>
                                                <td>1</td>
                                                <td>Sheets</td>
                                                <td>

                                                    <div className="yes-no-container">

                                                        <label className="switch">
                                                            <input type="checkbox" checked={isYes} onChange={handleToggle} />
                                                            <span className="slider"></span>
                                                        </label>
                                                        <p>{isYes ? "Yes" : "No"}</p>
                                                    </div>
                                                </td>
                                            </tr>

                                            <tr>
                                                <td>Polyester</td>
                                                <td>1</td>
                                                <td>Sheets</td>
                                                <td>

                                                    <div className="yes-no-container">

                                                        <label className="switch">
                                                            <input type="checkbox" checked={isYes} onChange={handleToggle} />
                                                            <span className="slider"></span>
                                                        </label>
                                                        <p>{isYes ? "Yes" : "No"}</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        </div>

                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className="modal-thirdcolumn">
                            <div className="button-container">
                                <select
                                    className={`dropdown ${selectedOption === 'Planned'
                                            ? 'planned'
                                            : selectedOption === 'In Progress'
                                                ? 'in-progress'
                                                : selectedOption === 'Completed'
                                                    ? 'completed'
                                                    : ''
                                        }`}
                                    value={selectedOption}
                                    onChange={handleSelectChange}
                                >
                                    <option value="All Projects">All Projects</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Planned">Planned</option>
                                    <option value="Completed">Completed</option>
                                </select>

                                <div className="deletebutton">
                                    <button>Delete</button>
                                </div>
                            </div>
                            <div className="equipment-dashboard">

                                <table>
                                    <thead>
                                        <th>Equipment Needed</th>
                                        <th>Equipment Status</th>
                                    </thead>
                                </table>

                                <table>
                                    <tbody>
                                        <tr>
                                            <td>CNC Milling Machine</td>
                                            <td><div className="availability-status">Available</div></td>
                                        </tr>
                                        <tr>
                                            <td>Laser Cutter</td>
                                            <td><div className="availability-status">Available</div></td>
                                        </tr>

                                    </tbody>
                                </table>

                            </div>
                            <h1>Remarks:</h1>
                            <div className="remarks-container"><h2>Rework Notes will appear here...</h2></div>
                            <div className="prodsavebuttons">
                            <button className="cancel-btn">Cancel</button>
                            <button className="save-btn">Save</button>
                            </div>
                        </div>

                        <img
                            src="/src/modules/Production/icons/Close_square.png"
                            alt=""
                            className="close-icon"
                            onClick={closeModal}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default BodyContent;