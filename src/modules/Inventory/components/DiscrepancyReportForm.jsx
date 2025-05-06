import React, { useState, useEffect } from "react";
import "../styles/InvPcountForm.css"; // Reuse existing form styles

const DiscrepancyReportForm = ({ onClose, selectedItem, inventoryItems = {} }) => {
    const [inventoryItemId, setInventoryItemId] = useState("");
    const [discrepancyType, setDiscrepancyType] = useState("");
    const [severity, setSeverity] = useState("");
    const [employeeId, setEmployeeId] = useState("");
    const [description, setDescription] = useState("");
    const [inventoryItemsList, setInventoryItemsList] = useState([]);
    const [selectedInventoryItem, setSelectedInventoryItem] = useState(null);

    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [users, setUsers] = useState([]);
    const [recipientIds, setRecipientIds] = useState([]); // State to hold target recipient IDs

    // Define the roles that should be notified
    const targetRolesForNotification = [
        'Inventory Manager',
        'Warehouse Manager',
        'Inventory Control Specialist',
        'Warehouse Supervisor'
    ];

    // Fetch logged-in user's employee_id from localStorage on mount
    useEffect(() => {
        try {
            const rawStoredUser = localStorage.getItem("user");
            if (rawStoredUser) {
                const storedUser = JSON.parse(rawStoredUser);
                if (storedUser && storedUser.employee_id) {
                    setEmployeeId(storedUser.employee_id); // Auto-fill employeeId
                    console.log("DiscrepancyReportForm: Auto-set employeeId from localStorage:", storedUser.employee_id);
                } else {
                    console.warn("DiscrepancyReportForm: employee_id not found in stored user data.");
                }
            } else {
                console.warn("DiscrepancyReportForm: No 'user' item found in localStorage for employee_id.");
            }
        } catch (error) {
            console.error("DiscrepancyReportForm: Error reading user data from localStorage for employee_id:", error);
        }
    }, []); // Empty dependency array means this runs once on mount

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/users/")
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`Error fetching users: ${res.status}`);
                }
                return res.json();
            })
            .then((data) => {
                console.log("Users data:", data);
                if (data && data.length > 0) {
                    setUsers(data); // Keep full list if needed elsewhere

                    // Filter users based on target roles and update recipientIds state
                    const filteredUsers = data.filter(user => user.role_name && targetRolesForNotification.includes(user.role_name));
                    const ids = filteredUsers.map(user => user.user_id);
                    setRecipientIds(ids);
                    console.log("DiscrepancyReportForm: Target recipient IDs:", ids);
                }
            })
            .catch((err) => {
                console.error("Failed to fetch users:", err);
            });
    }, []);

    useEffect(() => {
        if (Object.keys(inventoryItems).length > 0) {

            const itemsList = Object.values(inventoryItems);
            setInventoryItemsList(itemsList);
        } else {
            fetch("https://y7jvlug8j6.execute-api.ap-southeast-1.amazonaws.com/dev/api/inventory-items/")
                .then((res) => {
                    if (!res.ok) {
                        throw new Error(`Error fetching inventory items: ${res.status}`);
                    }
                    return res.json();
                })
                .then((data) => {
                    if (data && data.length > 0) {
                        setInventoryItemsList(data);
                    }
                })
                .catch((err) => {
                    console.error("Failed to fetch inventory items:", err);
                });
        }
    }, [inventoryItems]);

    useEffect(() => {
        if (selectedItem) {
            // First, ensure the inventory item is set
            if (selectedItem.inventory_item_id) {
                setInventoryItemId(selectedItem.inventory_item_id);

                // Try to find the inventory item in our list if not in the map
                let itemDetails = inventoryItems[selectedItem.inventory_item_id];

                if (!itemDetails) {
                    // Try to find it in the inventory items list
                    itemDetails = inventoryItemsList.find(item =>
                        item.inventory_item_id === selectedItem.inventory_item_id
                    );
                }

                if (itemDetails) {
                    setSelectedInventoryItem(itemDetails);
                }
            } else if (selectedItem.item_id) {
                // If we have item_id instead of inventory_item_id
                setInventoryItemId(selectedItem.item_id);
            }

            // You can also prefill additional fields if desired
            // For example, if you have discrepancy details in the selected item
            if (selectedItem.remarks) {
                setDescription(selectedItem.remarks);
            }
        } else {
            handleClear();
        }
    }, [selectedItem, inventoryItems, inventoryItemsList]);

    // Handle inventory item selection
    const handleInventoryItemChange = (e) => {
        const selectedId = e.target.value;
        setInventoryItemId(selectedId);

        // Find the selected item in the list
        const item = inventoryItemsList.find(item => item.inventory_item_id === selectedId);
        setSelectedInventoryItem(item || null);
    };

    // Clear all form fields
    const handleClear = () => {
        setInventoryItemId("");
        setDiscrepancyType("");
        setSeverity("");
        setDescription("");
        setSelectedInventoryItem(null);
        setSuccessMessage("");
        setErrorMessage("");
    };

    // Submit form to create a notification
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");

        // Basic validation
        if (
            !inventoryItemId ||
            !discrepancyType ||
            !severity ||
            !employeeId ||
            !description
        ) {
            setErrorMessage("Please fill in all required fields.");
            return;
        }

        // --- Use recipientIds state ---
        if (recipientIds.length === 0) {
            setErrorMessage("Could not find any users with the target roles to notify. Please check configuration.");
            console.warn("DiscrepancyReportForm: No recipients found for roles:", targetRolesForNotification);
            return;
        }
        // console.log("DiscrepancyReportForm: Notifying recipient IDs:", recipientIds);
        // --- End check ---

        const itemDetails = selectedInventoryItem
            ? `${selectedInventoryItem.item_name || selectedInventoryItem.inventory_item_id || 'Item'} (${inventoryItemId})`
            : inventoryItemId;

        const formattedMessage = `Inventory Discrepancy Report: Item: ${itemDetails}, Type: ${discrepancyType}, Severity: ${severity}, Reported by Employee ID: ${employeeId}, Description: ${description}, Reported on: ${new Date().toISOString()}`;

        // Construct payload for the batch notification API
        const notificationPayload = {
            module: "Inventory", // Adjust if needed based on App.jsx
            submodule: "Discrepancy Report", // Adjust if needed, or set to null
            recipient_ids: recipientIds, // Use IDs from state
            msg: formattedMessage
        };

        console.log("[DiscrepancyReportForm] Sending Batch Notification: ", notificationPayload);

        try {
            // Use the batch notification API endpoint
            const response = await fetch("https://s9v4t5i8ej.execute-api.ap-southeast-1.amazonaws.com/dev/api/send-notif-batch/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(notificationPayload),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to submit discrepancy report: ${errorText}`);
            }

            const data = await response.json();
            console.log("Successfully submitted discrepancy report:", data);
            setSuccessMessage("Discrepancy report submitted successfully!");

            setTimeout(() => {
                handleClear();
                onClose();
            }, 1500);
        } catch (err) {
            console.error("Error submitting discrepancy report:", err);
            setErrorMessage(err.message || "An unexpected error occurred.");
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                {/* Header */}
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-xl font-semibold">Report a Discrepancy</h2>
                    <button onClick={onClose} className="close-btn">
                        ✕
                    </button>
                </div>

                {/* Success / Error messages */}
                {successMessage && (
                    <p style={{ color: "green", marginBottom: "1rem" }}>
                        {successMessage}
                    </p>
                )}
                {errorMessage && (
                    <p style={{ color: "red", marginBottom: "1rem" }}>
                        {errorMessage}
                    </p>
                )}

                {/* Form Fields */}
                <form onSubmit={handleSubmit} className="text-sm">
                    <label>
                        Inventory Item <span className="text-red-500">*</span>
                    </label>
                    <select
                        value={inventoryItemId}
                        onChange={handleInventoryItemChange}
                        required
                        className="block w-full border border-gray-300 rounded-md p-2 mb-4"
                    >
                        <option value="">Select Inventory Item</option>
                        {inventoryItemsList.map((item) => (
                            <option key={item.inventory_item_id} value={item.inventory_item_id}>
                                {/* Attempt to display item name, fallback to ID, then add type */}
                                {item.item_name || item.item_display_name || item.inventory_item_id} {item.item_type ? `- ${item.item_type}` : ''}
                            </option>
                        ))}
                    </select>

                    {/* Display which ROLES will be notified */}
                    {recipientIds.length > 0 && (
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Will Notify Roles:</label>
                            {/* Use tag-like elements for roles */}
                            <div className="flex flex-wrap gap-2 p-2 bg-gray-50 border border-gray-200 rounded-md">
                                {targetRolesForNotification.map((role) => (
                                    <span
                                        key={role}
                                        className="inline-block bg-cyan-100 text-cyan-800 text-xs font-medium px-2.5 py-0.5 rounded border border-cyan-300"
                                    >
                                        {role}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <label>
                        Discrepancy Type <span className="text-red-500">*</span>
                    </label>
                    <select
                        value={discrepancyType}
                        onChange={(e) => setDiscrepancyType(e.target.value)}
                        required
                    >
                        <option value="">Select Type</option>
                        <option value="Quantity Mismatch">Quantity Mismatch</option>
                        <option value="Damaged Items">Damaged Items</option>
                        <option value="Missing Items">Missing Items</option>
                        <option value="Incorrect Location">Incorrect Location</option>
                        <option value="Expiry Issues">Expiry Issues</option>
                        <option value="Other">Other</option>
                    </select>
                    <span className="grid grid-cols-2 gap-2">
                        <span>
                            <label>
                                Severity <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={severity}
                                onChange={(e) => setSeverity(e.target.value)}
                                required
                            >
                                <option value="">Select Severity</option>
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                                <option value="Critical">Critical</option>
                            </select>
                        </span>

                        <span>
                            <label>
                                Employee ID <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Enter Employee ID"
                                value={employeeId}
                                readOnly
                                required
                                className="block w-full border-gray-300 rounded-md p-2 mb-2 bg-gray-100 text-gray-500 cursor-not-allowed focus:ring-0 focus:outline-none"
                            />
                        </span>



                    </span>


                    <label>
                        Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        placeholder="Describe the discrepancy in detail"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        rows="1"
                    />

                    {/* Buttons */}
                    <div className="form-actions justify-between">
                        <button type="button" onClick={handleClear} className="clear-btn">
                            Clear
                        </button>
                        <button type="submit" className="submit-btn">
                            Submit Report
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DiscrepancyReportForm; 