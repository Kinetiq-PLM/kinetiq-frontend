import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles/Production.css";

const BodyContent = () => {
    const [selectedOption, setSelectedOption] = useState("All Projects");
    const [searchQuery, setSearchQuery] = useState("");
    const [productionData, setProductionData] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [tasksLoading, setTasksLoading] = useState(true);
    const [tasksError, setTasksError] = useState(null);

    useEffect(() => {
        const fetchProductionData = async () => {
            try {
                const response = await axios.get("https://rhxktvfc29.execute-api.ap-southeast-1.amazonaws.com/dev/api/production/");
                setProductionData(response.data);
                setStatuses(response.data.map((order) => order.status));
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch production orders.");
                setLoading(false);
            }
        };
        fetchProductionData();
    }, []);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axios.get("https://rhxktvfc29.execute-api.ap-southeast-1.amazonaws.com/dev/api/tasks/");
                setTasks(response.data);
                setTasksLoading(false);
            } catch (error) {
                setTasksError("Failed to fetch tasks.");
                setTasksLoading(false);
            }
        };
        fetchTasks();
    }, []);

    const handleStatusChange = async (productionOrderId, newStatus) => {
        const index = productionData.findIndex(item => item.production_order_id === productionOrderId);
        if (index === -1) return;

        const originalStatus = productionData[index].status;
        const updatedProduction = productionData.map((item, i) =>
            i === index ? { ...item, status: newStatus.trim() } : item
        );
        setProductionData(updatedProduction);

        try {
            await axios.patch(
                `https://rhxktvfc29.execute-api.ap-southeast-1.amazonaws.com/dev/api/production/${productionOrderId}/`,
                { status: newStatus.trim() }
            );
            console.log("Status updated successfully in the database.");
        } catch (error) {
            console.error("Failed to update status in the database:", error);
            const revertedProduction = productionData.map((item, i) =>
                i === index ? { ...item, status: originalStatus } : item
            );
            setProductionData(revertedProduction);
        }
    };

    const handleStartDateChange = async (productionOrderId, value) => {
        const index = productionData.findIndex(item => item.production_order_id === productionOrderId);
        if (index === -1) return;

        const originalStartDate = productionData[index].start_date;
        const updatedProduction = productionData.map((item, i) =>
            i === index ? { ...item, start_date: value } : item
        );
        setProductionData(updatedProduction);

        try {
            await axios.patch(
                `https://rhxktvfc29.execute-api.ap-southeast-1.amazonaws.com/dev/api/production/${productionOrderId}/`,
                { start_date: value }
            );
            console.log("Start date updated successfully in the database.");
        } catch (error) {
            console.error("Failed to update start date in the database:", error);
            const revertedProduction = productionData.map((item, i) =>
                i === index ? { ...item, start_date: originalStartDate } : item
            );
            setProductionData(revertedProduction);
        }
    };

    const handleEndDateChange = async (productionOrderId, value) => {
        const index = productionData.findIndex(item => item.production_order_id === productionOrderId);
        if (index === -1) return;

        const originalEndDate = productionData[index].end_date;
        const updatedProduction = productionData.map((item, i) =>
            i === index ? { ...item, end_date: value } : item
        );
        setProductionData(updatedProduction);

        try {
            await axios.patch(
                `https://rhxktvfc29.execute-api.ap-southeast-1.amazonaws.com/dev/api/production/${productionOrderId}/`,
                { end_date: value }
            );
            console.log("End date updated successfully in the database.");
        } catch (error) {
            console.error("Failed to update end date in the database:", error);
            const revertedProduction = productionData.map((item, i) =>
                i === index ? { ...item, end_date: originalEndDate } : item
            );
            setProductionData(revertedProduction);
        }
    };

    const handleTargetQuantityChange = (productionOrderId, value) => {
        const index = productionData.findIndex(item => item.production_order_id === productionOrderId);
        if (index === -1) return;

        const updatedProduction = productionData.map((item, i) =>
            i === index ? { ...item, target_quantity: value } : item
        );
        setProductionData(updatedProduction);
    };

    const handleTargetQuantityBlur = async (productionOrderId, value) => {
        const index = productionData.findIndex(item => item.production_order_id === productionOrderId);
        if (index === -1) return;

        const originalTargetQuantity = productionData[index].target_quantity;
        const updatedValue = value === "" ? null : value;

        const updatedProduction = productionData.map((item, i) =>
            i === index ? { ...item, target_quantity: updatedValue } : item
        );
        setProductionData(updatedProduction);

        try {
            await axios.patch(
                `https://rhxktvfc29.execute-api.ap-southeast-1.amazonaws.com/dev/api/production/${productionOrderId}/`,
                { target_quantity: updatedValue }
            );
            console.log("Target quantity updated successfully in the database.");
        } catch (error) {
            console.error("Failed to update target quantity in the database:", error);
            const revertedProduction = productionData.map((item, i) =>
                i === index ? { ...item, target_quantity: originalTargetQuantity } : item
            );
            setProductionData(revertedProduction);
        }
    };

    const handleNotesChange = (productionOrderId, value) => {
        const index = productionData.findIndex(item => item.production_order_id === productionOrderId);
        if (index === -1) return;

        const updatedProduction = productionData.map((item, i) =>
            i === index ? { ...item, notes: value } : item
        );
        setProductionData(updatedProduction);
    };

    const handleNotesBlur = async (productionOrderId, value) => {
        const index = productionData.findIndex(item => item.production_order_id === productionOrderId);
        if (index === -1) return;

        const originalNotes = productionData[index].notes;
        const updatedValue = value === "" ? null : value;

        const updatedProduction = productionData.map((item, i) =>
            i === index ? { ...item, notes: updatedValue } : item
        );
        setProductionData(updatedProduction);

        try {
            await axios.patch(
                `https://rhxktvfc29.execute-api.ap-southeast-1.amazonaws.com/dev/api/production/${productionOrderId}/`,
                { notes: updatedValue }
            );
            console.log("Notes updated successfully in the database.");
        } catch (error) {
            console.error("Failed to update notes in the database:", error);
            const revertedProduction = productionData.map((item, i) =>
                i === index ? { ...item, notes: originalNotes } : item
            );
            setProductionData(revertedProduction);
        }
    };

    const filteredData = productionData.filter((order) => {
        const search = searchQuery.toLowerCase();
        const orderStatus = order.status ? order.status.trim().toLowerCase() : "";
        const selected = selectedOption.trim().toLowerCase();

        const statusMatch = selected === "all projects" || orderStatus === selected;

        const searchMatch =
            search === "" ||
            (order.production_order_id && order.production_order_id.toLowerCase().includes(search)) ||
            (order.task_id && order.task_id.toLowerCase().includes(search)) ||
            (order.bom_id && order.bom_id.toLowerCase().includes(search)) ||
            (order.start_date && order.start_date.toString().toLowerCase().includes(search)) ||
            (order.end_date && order.end_date.toString().toLowerCase().includes(search)) ||
            (order.target_quantity && order.target_quantity.toString().includes(search)) ||
            (order.notes && order.notes.toLowerCase().includes(search));

        return statusMatch && searchMatch;
    });

    const handleSelectChange = (e) => setSelectedOption(e.target.value);
    const handleSearchChange = (e) => setSearchQuery(e.target.value);

    const totalOrders = productionData.length;
    const inProgressCount = productionData.filter(o => o.status === "In Progress").length;
    const pendingCount = productionData.filter(o => o.status === "Pending").length;
    const completedCount = productionData.filter(o => o.status === "Completed").length;
    const inProgressPercentage = totalOrders ? (inProgressCount / totalOrders) * 100 : 0;
    const pendingPercentage = totalOrders ? (pendingCount / totalOrders) * 100 : 0;
    const completedPercentage = totalOrders ? (completedCount / totalOrders) * 100 : 0;

    return (
        <div className="prod">
            <div className="prodcontainer">
                <div className="prodflex-container">
                    <div className="prodbody-content-container">
                        <div className="prodpurch-box-container">
                            {["Total Project", "In Progress", "Pending", "Completed"].map((label, index) => (
                                <div className="prodpurch-box" key={index}>
                                    <span className="prodpurch-number">
                                        {label === "Total Project" ? totalOrders :
                                            label === "In Progress" ? inProgressCount :
                                                label === "Pending" ? pendingCount :
                                                    label === "Completed" ? completedCount :
                                                        "-"}
                                    </span>
                                    <span className="prodpurch-label">{label}</span>
                                </div>
                            ))}
                        </div>
                        <div className="prodsearch-dropdown-container">
                            <select className="proddropdown" value={selectedOption} onChange={handleSelectChange}>
                                <option value="all projects">All Projects</option>
                                <option value="in progress">In Progress</option>
                                <option value="pending">Pending</option>
                                <option value="completed">Completed</option>
                            </select>
                            <div className="prodsearch-wrapper">
                                <img src="/icons/search-icon.png" alt="Search" className="search-icon" />
                                <input
                                    type="text"
                                    className="prodsearch-bar"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                />
                            </div>
                        </div>
                        <div className="prodbig-container-wrapper">
                            <div className="proddashboard-container">
                                <div className="prodtable-container">
                                    <table className="production-table">
                                        <colgroup>
                                            <col style={{ width: "15%" }} />
                                            <col style={{ width: "12%" }} />
                                            <col style={{ width: "12%" }} />
                                            <col style={{ width: "15%" }} />
                                            <col style={{ width: "15%" }} />
                                            <col style={{ width: "10%" }} />
                                            <col style={{ width: "18%" }} />
                                            <col style={{ width: "13%" }} />
                                        </colgroup>
                                        <thead>
                                            <tr>
                                                <th style={{ textAlign: "center" }}>Production Order ID</th>
                                                <th style={{ textAlign: "center" }}>Task ID</th>
                                                <th style={{ textAlign: "center" }}>BOM ID</th>
                                                <th style={{ textAlign: "center" }}>Start Date</th>
                                                <th style={{ textAlign: "center" }}>End Date</th>
                                                <th style={{ textAlign: "center" }}>Target Quantity</th>
                                                <th style={{ textAlign: "center" }}>Remarks</th>
                                                <th style={{ textAlign: "center" }}>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredData.map((order) => (
                                                <tr key={order.production_order_id}>
                                                    <td style={{ fontWeight: "bold", textAlign: "left", wordWrap: "break-all", whiteSpace: "normal", fontSize: "12px" }}>{order.production_order_id}</td>
                                                    <td style={{ textAlign: "left", wordWrap: "break-all", whiteSpace: "normal", fontSize: "10px" }}>{order.task_id}</td>
                                                    <td style={{ textAlign: "left", wordWrap: "break-word", whiteSpace: "normal", fontSize: "10px" }}>{order.bom_id}</td>
                                                    <td style={{ textAlign: "center" }}>
                                                        <input
                                                            type="date"
                                                            value={order.start_date ? new Date(order.start_date).toISOString().split("T")[0] : ""}
                                                            onChange={(e) => handleStartDateChange(order.production_order_id, e.target.value)}
                                                            className="production-date-input"
                                                        />
                                                    </td>
                                                    <td style={{ textAlign: "center" }}>
                                                        <input
                                                            type="date"
                                                            value={order.end_date ? new Date(order.end_date).toISOString().split("T")[0] : ""}
                                                            onChange={(e) => handleEndDateChange(order.production_order_id, e.target.value)}
                                                            className="production-date-input"
                                                        />
                                                    </td>
                                                    <td style={{ textAlign: "center" }}>
                                                        <input
                                                            type="text"
                                                            value={order.target_quantity ?? ""}
                                                            onChange={(e) => handleTargetQuantityChange(order.production_order_id, e.target.value)}
                                                            onBlur={(e) => handleTargetQuantityBlur(order.production_order_id, e.target.value)}
                                                            onKeyDown={(e) => {
                                                                if (e.key === "Enter") {
                                                                    e.target.blur();
                                                                }
                                                            }}
                                                            className="production-number-input"
                                                            min="0"
                                                            placeholder={order.target_quantity == null || order.target_quantity === "" ? "N/A" : ""}
                                                        />
                                                    </td>
                                                    <td style={{ textAlign: "left" }}>
                                                        <textarea
                                                            value={order.notes ?? ""}
                                                            onChange={(e) => handleNotesChange(order.production_order_id, e.target.value)}
                                                            onBlur={(e) => handleNotesBlur(order.production_order_id, e.target.value)}
                                                            onKeyDown={(e) => {
                                                                if (e.key === "Enter" && !e.shiftKey) {
                                                                    e.preventDefault();
                                                                    e.target.blur();
                                                                }
                                                            }}
                                                            className="production-textarea"
                                                            rows="2"
                                                            placeholder={order.notes == null || order.notes === "" ? "N/A" : ""}
                                                        />
                                                    </td>
                                                    <td style={{ textAlign: "center" }}>
                                                        <select
                                                            className={`proddashboard-availability-dropdown ${order.status.toLowerCase().replace(/\s+/g, "-")}`}
                                                            value={order.status}
                                                            onChange={(e) => handleStatusChange(order.production_order_id, e.target.value)}
                                                        >
                                                            <option value="In Progress">In Progress</option>
                                                            <option value="Pending">Pending</option>
                                                            <option value="Completed">Completed</option>
                                                        </select>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="prodlist-of-tasks">
                        <h2>List of Tasks</h2>
                        <div className="prodright-small-containers">
                            <div className="prodtasks-from-pm">
                                <div className="prod-listoftask-container">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Task ID</th>
                                                <th>Task Deadline</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {tasksLoading ? (
                                                <tr>
                                                    <td colSpan="3">Loading tasks...</td>
                                                </tr>
                                            ) : tasksError ? (
                                                <tr>
                                                    <td colSpan="3">{tasksError}</td>
                                                </tr>
                                            ) : (
                                                tasks.map((task, index) => (
                                                    <tr key={task.task_id || index}>
                                                        <td style={{ fontWeight: "bold" }}>{task.task_id}</td>
                                                        <td>{new Date(task.task_deadline).toLocaleDateString()}</td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="prodprogress-container">
                                <div className="prodprogress-wheel">
                                    <svg className="prodcircular-progress" viewBox="0 0 36 36">
                                        <path
                                            className="prodcircle-background"
                                            d="M18 2.0845 a 15.9155 15.9155 0 1 1 0 31.831 a 15.9155 15.9155 0 1 1 0 -31.831"
                                        />
                                        <path
                                            className="prodcircle-progress"
                                            d="M18 2.0845 a 15.9155 15.9155 0 1 1 0 31.831 a 15.9155 15.9155 0 1 1 0 -31.831"
                                            strokeDasharray={`${completedPercentage}, 100`}
                                        />
                                    </svg>
                                    <div className="prodprogress-text">{Math.round(completedPercentage)}%</div>
                                </div>
                                <div className="prodprogress-details">
                                    <div className="prodprogress-item">
                                        <span>In Progress</span>
                                        <div className="prodbar-container">
                                            <div className="prodbar" style={{ width: `${inProgressPercentage}%` }}></div>
                                        </div>
                                        <span>{Math.round(inProgressPercentage)}%</span>
                                    </div>
                                    <div className="prodprogress-item">
                                        <span className="pending-text">Pending</span>
                                        <div className="prodbar-container">
                                            <div className="prodbar" style={{ width: `${pendingPercentage}%` }}></div>
                                        </div>
                                        <span>{Math.round(pendingPercentage)}%</span>
                                    </div>
                                    <div className="prodprogress-item">
                                        <span className="completed-text">Completed</span>
                                        <div className="prodbar-container">
                                            <div className="prodbar" style={{ width: `${completedPercentage}%` }}></div>
                                        </div>
                                        <span>{Math.round(completedPercentage)}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BodyContent;