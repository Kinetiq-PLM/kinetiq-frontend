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
    const [boms, setBoms] = useState([]);
    const [bomsLoading, setBomsLoading] = useState(true);
    const [bomsError, setBomsError] = useState(null);

    useEffect(() => {
        const fetchProductionData = async () => {
            try {
                // Fetch production data
                const productionResponse = await axios.get("https://rhxktvfc29.execute-api.ap-southeast-1.amazonaws.com/dev/api/production/");
                const productionData = productionResponse.data;

                // Fetch rework notes data
                const reworkResponse = await axios.get("https://rhxktvfc29.execute-api.ap-southeast-1.amazonaws.com/dev/api/cost-of-production/");
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

    useEffect(() => {
        const fetchBOMs = async () => {
            try {
                const response = await axios.get("https://rhxktvfc29.execute-api.ap-southeast-1.amazonaws.com/dev/api/bom/");
                setBoms(response.data);
                setBomsLoading(false);
            } catch (error) {
                setBomsError("Failed to fetch BOMs.");
                setBomsLoading(false);
            }
        };
        fetchBOMs();
    }, []);

    const handleStatusChange = async (index, newStatus) => {
        // Find the corresponding order in the original productionData array
        const productionOrderId = filteredData[index].production_order_id;
        const updatedProduction = productionData.map((order) =>
            order.production_order_id === productionOrderId
                ? { ...order, status: newStatus.trim() }
                : order
        );

        // Update the local state immediately for a responsive UI
        setProductionData(updatedProduction);

        try {
            // Make an API call to update the status in the database
            await axios.patch(`https://rhxktvfc29.execute-api.ap-southeast-1.amazonaws.com/dev/api/production/${productionOrderId}/`, {
                status: newStatus.trim(),
            });
            console.log("Status updated successfully in the database.");
        } catch (error) {
            console.error("Failed to update status in the database:", error);

            // Revert the change in case of an error
            setProductionData(productionData);
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
                    `https://rhxktvfc29.execute-api.ap-southeast-1.amazonaws.com/dev/api/cost-of-production/${orderToUpdate.rework_id}/`,
                    payload,
                    { headers: { "Content-Type": "application/json" } }
                );
                console.log("rework_notes updated successfully in the database.");
            } else {
                await axios.patch(
                    `https://rhxktvfc29.execute-api.ap-southeast-1.amazonaws.com/dev/api/production/${productionOrderId}/`,
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
                `https://rhxktvfc29.execute-api.ap-southeast-1.amazonaws.com/dev/api/production/${productionOrderId}/`,
                { target_quantity: value },
                { headers: { "Content-Type": "application/json" } }
            );
            console.log("Target quantity updated successfully");
        } catch (error) {
            console.error("Failed to update target quantity", error);
        }
    };

    const handleAddProductionOrder = async (task, bom) => {
        // Generate a new unique production_order_id (e.g., using timestamp or uuid)
        const newProductionOrderId = `PO-${Date.now()}`;
        const now = new Date().toISOString();
        const newOrder = {
            production_order_id: newProductionOrderId,
            task_id: task.task_id,
            bom_id: bom.bom_id,
            start_date: now,
            end_date: now,
            status: "Pending",
            target_quantity: 0,
            notes: "",
        };

        try {
            // Send to backend
            await axios.post("https://rhxktvfc29.execute-api.ap-southeast-1.amazonaws.com/dev/api/production/", newOrder);
            // Add to local state
            setProductionData(prev => [...prev, newOrder]);
        } catch (error) {
            alert("Failed to add new production order.");
            console.error(error);
        }
    };

    const filteredData = productionData
        .slice() // Create a shallow copy to avoid mutating the original array
        .sort((a, b) => a.production_order_id.localeCompare(b.production_order_id)) // Sort by production_order_id
        .filter((order) => {
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

    const filteredTasks = tasks
        .filter(
            task =>
                task.task_id &&
                task.task_id.toLowerCase() !== "" &&
                // Exclude if project_id is null/undefined/"null"/empty string
                task.project_id !== null &&
                task.project_id !== undefined &&
                task.project_id.toLowerCase() !== "null" &&
                task.project_id !== "" &&
                // Only include if task_id is NOT present in any order.task_id
                !productionData.some(order => order.task_id === task.task_id)
        )
        .filter(task => {
            const search = searchQuery.toLowerCase();
            const bom = boms.find(bom => bom.project_id === task.project_id);
            const bomId = bom ? bom.bom_id : "";
            return (
                task.task_id.toLowerCase().includes(search) ||
                bomId.toLowerCase().includes(search)
            );
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
                                            <th style={{ textAlign: "center" }}>Project ID</th>
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
                    <h2>List of Projects</h2>
                    <div className="prodright-small-containers">
                        <div className="prodtasks-from-pm">
                            <div className="prod-listoftask-container">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Project ID</th>
                                            <th>BOM ID</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tasksLoading || bomsLoading ? (
                                            <tr>
                                                <td colSpan="3">Loading tasks...</td>
                                            </tr>
                                        ) : tasksError || bomsError ? (
                                            <tr>
                                                <td colSpan="3">{tasksError || bomsError}</td>
                                            </tr>
                                        ) : (
                                            filteredTasks.map((task, index) => (
                                                <tr key={task.task_id || index}>
                                                    <td>{task.task_id}</td>
                                                    <td>
                                                        {(boms.find(bom => bom.project_id === task.project_id) || {}).bom_id || ""}
                                                    </td>
                                                    <td className="rwaddbutton">
                                                        <button
                                                            onClick={() => {
                                                                const bom = boms.find(bom => bom.project_id === task.project_id);
                                                                if (bom) {
                                                                    handleAddProductionOrder(task, bom);
                                                                } else {
                                                                    alert("No BOM found for this project.");
                                                                }
                                                            }}
                                                        >
                                                            Add
                                                        </button>
                                                    </td>
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