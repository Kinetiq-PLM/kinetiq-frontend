import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles/Production.css";

const BodyContent = () => {
    const [selectedOption, setSelectedOption] = useState("All Projects");
    const [searchQuery, setSearchQuery] = useState("");
    const [productionData, setProductionData] = useState([]);
    const [statuses, setStatuses] = useState([]); // Initialize as an empty array
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [tasksLoading, setTasksLoading] = useState(true);
    const [tasksError, setTasksError] = useState(null);

    useEffect(() => {
        const fetchProductionData = async () => {
            try {
                // Fetch production data
                const productionResponse = await axios.get("http://127.0.0.1:8000/api/production/");
                const productionData = productionResponse.data;

                // Fetch rework notes data
                const reworkResponse = await axios.get("http://127.0.0.1:8000/api/cost-of-production/");
                const reworkData = reworkResponse.data;

                // Merge rework notes into production data
                const mergedData = productionData.map((order) => {
                    const rework = reworkData.find(
                        (reworkItem) => reworkItem.production_order_id === order.production_order_id
                    );
                    return {
                        ...order,
                        rework_notes: rework ? rework.rework_notes : "",
                        // Save the cost-of-production primary key
                        rework_id: rework ? rework.production_order_detail_id : null,
                    };
                });

                setProductionData(mergedData);
                setStatuses(mergedData.map((order) => order.status)); // Initialize statuses
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch production orders or rework notes.");
                setLoading(false);
            }
        };

        fetchProductionData();
    }, []);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/api/tasks/");
                setTasks(response.data);
                setTasksLoading(false);
            } catch (error) {
                setTasksError("Failed to fetch tasks.");
                setTasksLoading(false);
            }
        };
        fetchTasks();
    }, []);

    const handleStatusChange = async (index, newStatus) => {
        const updatedProduction = [...productionData];
        const updatedOrder = {
            ...updatedProduction[index],
            status: newStatus.trim(), // Trim the new status
        };

        // Update the local state immediately for a responsive UI
        updatedProduction[index] = updatedOrder;
        setProductionData(updatedProduction);

        try {
            // Make an API call to update the status in the database
            await axios.patch(`http://127.0.0.1:8000/api/production/${updatedOrder.production_order_id}/`, {
                status: newStatus.trim(),
            });
            console.log("Status updated successfully in the database.");
        } catch (error) {
            console.error("Failed to update status in the database:", error);

            // Revert the change in case of an error
            updatedProduction[index] = {
                ...updatedProduction[index],
                status: productionData[index].status, // Revert to the original status
            };
            setProductionData(updatedProduction);
        }
    };

    const handleFieldChange = async (productionOrderId, fieldName, newValue) => {
        const updatedProduction = productionData.map((order) =>
            order.production_order_id === productionOrderId
                ? { ...order, [fieldName]: newValue }
                : order
        );
        // Optimistically update the state
        setProductionData(updatedProduction);

        try {
            if (fieldName === "rework_notes") {
                // Find the record's rework_id (the primary key for cost-of-production)
                const orderToUpdate = updatedProduction.find(
                    (order) => order.production_order_id === productionOrderId
                );
                if (!orderToUpdate.rework_id) {
                    console.error("No cost-of-production record found for this order.");
                    return;
                }
                // When newValue is blank, send null
                const payload = { rework_notes: newValue.trim() === "" ? null : newValue };
                await axios.patch(
                    `http://127.0.0.1:8000/api/cost-of-production/${orderToUpdate.rework_id}/`,
                    payload,
                    { headers: { "Content-Type": "application/json" } }
                );
                console.log("rework_notes updated successfully in the database.");
            } else {
                await axios.patch(
                    `http://127.0.0.1:8000/api/production/${productionOrderId}/`,
                    { [fieldName]: newValue },
                    { headers: { "Content-Type": "application/json" } }
                );
                console.log(`${fieldName} updated successfully in the database.`);
            }
        } catch (error) {
            console.error(`Failed to update ${fieldName} in the database:`, error);
            // Revert the change on error
            setProductionData(productionData);
        }
    };

    const handleTargetQuantityChange = async (productionOrderId, value) => {
        const updatedData = productionData.map((order) =>
            order.production_order_id === productionOrderId
                ? { ...order, target_quantity: value }
                : order
        );
        setProductionData(updatedData);

        try {
            await axios.patch(
                `http://127.0.0.1:8000/api/production/${productionOrderId}/`,
                { target_quantity: value },
                { headers: { "Content-Type": "application/json" } }
            );
            console.log("Target quantity updated successfully");
        } catch (error) {
            console.error("Failed to update target quantity", error);
        }
    };

    const filteredData = productionData.filter((order) => {
        const search = searchQuery.toLowerCase();
        const orderStatus = order.status ? order.status.trim().toLowerCase() : "";
        const selected = selectedOption.trim().toLowerCase();

        // Exact equality for status after normalization
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

    // Calculate dynamic progress values from productionData counts.
    const totalOrders = productionData.length;
    const inProgressCount = productionData.filter(o => o.status === "In Progress").length;
    const pendingCount = productionData.filter(o => o.status === "Pending").length;
    const completedCount = productionData.filter(o => o.status === "Completed").length;
    const inProgressPercentage = totalOrders ? (inProgressCount / totalOrders) * 100 : 0;
    const pendingPercentage = totalOrders ? (pendingCount / totalOrders) * 100 : 0;
    const completedPercentage = totalOrders ? (completedCount / totalOrders) * 100 : 0;

    return (
        <div className="prod">
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
                                                    "-"
                                    }
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
                                    <thead>
                                        <tr>
                                            <th style={{ textAlign: "center" }}>Production Order ID</th>
                                            <th style={{ textAlign: "center" }}>Task ID</th>
                                            <th style={{ textAlign: "center" }}>BOM ID</th>
                                            <th style={{ textAlign: "center" }}>Start Date</th>
                                            <th style={{ textAlign: "center" }}>End Date</th>
                                            <th style={{ textAlign: "center" }}>Ordered Quantity</th>
                                            <th style={{ textAlign: "center" }}>Remarks</th>
                                            <th style={{ textAlign: "center" }}>Rework Notes</th>
                                            <th style={{ textAlign: "center" }}>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredData.map((order, index) => (
                                            <tr key={order.production_order_id}>
                                                <td style={{ fontWeight: "bold", textAlign: "left" }}>{order.production_order_id}</td>
                                                <td style={{ textAlign: "left" }}>{order.task_id}</td>
                                                <td style={{ textAlign: "left" }}>{order.bom_id}</td>
                                                <td className="start-date">
                                                    <input
                                                        type="date"
                                                        value={
                                                            order.start_date
                                                                ? new Date(order.start_date).toISOString().split("T")[0]
                                                                : ""
                                                        }
                                                        onChange={(e) => handleFieldChange(order.production_order_id, "start_date", e.target.value)}
                                                    />
                                                </td>
                                                <td className="end-date">
                                                    <input
                                                        type="date"
                                                        value={
                                                            order.end_date
                                                                ? new Date(order.end_date).toISOString().split("T")[0]
                                                                : ""
                                                        }
                                                        onChange={(e) => handleFieldChange(order.production_order_id, "end_date", e.target.value)}
                                                    />
                                                </td>
                                                <td className="target-quantity">
                                                    <input
                                                        type="text"
                                                        value={order.target_quantity || ""}
                                                        onChange={(e) => handleTargetQuantityChange(order.production_order_id, e.target.value)}
                                                    />
                                                </td>
                                                <td className="notes">
                                                    <textarea
                                                        className="notes-textarea"
                                                        value={order.notes || ""}
                                                        onChange={(e) => handleFieldChange(order.production_order_id, "notes", e.target.value)}
                                                    />
                                                </td>
                                                <td className="rework-notes">
                                                    <textarea
                                                        className="rework-notes-textarea"
                                                        value={order.rework_notes || ""}
                                                        onChange={(e) =>
                                                            handleFieldChange(order.production_order_id, "rework_notes", e.target.value)
                                                        }
                                                    />
                                                </td>
                                                <td style={{ textAlign: "center" }}>
                                                    <select
                                                        className={`proddashboard-availability-dropdown  ${order.status.toLowerCase().replace(/\s+/g, "-")}`}
                                                        value={order.status}
                                                        onChange={(e) => handleStatusChange(index, e.target.value)}
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
                                            <th>Start Date</th>
                                            <th>BOM ID</th>
                                            <th> </th>
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
                                                        <td>{task.task_id}</td>
                                                        <td>{new Date(task.task_deadline).toLocaleDateString()}</td>
                                                        <td>{task.bom_id}</td>
                                                        <td><button className="prod-listoftask-add-btn">Add</button></td>
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
                                        <span>Pending</span>
                                        <div className="prodbar-container prodbar-container-pending">
                                            <div className="prodbar" style={{ width: `${pendingPercentage}%` }}></div>
                                        </div>
                                        <span>{Math.round(pendingPercentage)}%</span>
                                    </div>
                                    <div className="prodprogress-item">
                                        <span>Completed</span>
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
        
    );
};

export default BodyContent;