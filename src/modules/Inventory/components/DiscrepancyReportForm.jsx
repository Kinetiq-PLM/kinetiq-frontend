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
    const [selectedUserId, setSelectedUserId] = useState("");

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
                    setUsers(data);
                    if (data.length > 0 && !selectedUserId) {
                        setSelectedUserId(data[0].user_id);
                    }
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
            fetch("http://127.0.0.1:8000/api/inventory-items/")
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
        setEmployeeId("");
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
            !description || !selectedUserId
        ) {
            setErrorMessage("Please fill in all required fields.");
            return;
        }

const itemDetails = selectedInventoryItem
? `${selectedInventoryItem.item_type || 'Item'} (${inventoryItemId})`
: inventoryItemId;

const formattedMessage = `Inventory Discrepancy Report: Item: ${itemDetails}, Type: ${discrepancyType}, Severity: ${severity}, Reported by: ${employeeId}, Description: ${description}, Reported on: ${new Date().toISOString()}`;

      
        const notification = {
            module: "INVENTORY",
            to_user_id: selectedUserId, 
            message: formattedMessage,
            notifications_status: "Unread"
        };

        try {
       
            const response = await fetch("http://127.0.0.1:8000/api/notifications/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(notification),
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
                <form onSubmit={handleSubmit}>
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
                                {item.inventory_item_id} - {item.item_type || "Unknown"}
                            </option>
                        ))}
                    </select>

                    {selectedInventoryItem && (
                        <div className="mb-4 p-3 bg-gray-50 rounded-md">
                            <h3 className="font-medium text-gray-700 mb-2">Selected Item Details</h3>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <p><span className="font-medium">Type:</span> {selectedInventoryItem.item_type}</p>
                                <p><span className="font-medium">Current Qty:</span> {selectedInventoryItem.current_quantity}</p>
                                {selectedInventoryItem.expiry && (
                                    <p className={new Date(selectedInventoryItem.expiry) < new Date() ? 'text-red-500' : ''}>
                                        <span className="font-medium">Expiry:</span> {formatDate(selectedInventoryItem.expiry)}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    <label>
                        Notify User <span className="text-red-500">*</span>
                    </label>
                    <select
                        value={selectedUserId}
                        onChange={(e) => setSelectedUserId(e.target.value)}
                        required
                    >
                        <option value="">Select User to Notify</option>
                        {users.map((user) => (
                            <option key={user.user_id} value={user.user_id}>
                                {user.name}
                            </option>
                        ))}
                    </select>

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

                    <label>
                        Employee ID <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        placeholder="Enter Employee ID"
                        value={employeeId}
                        onChange={(e) => setEmployeeId(e.target.value)}
                        required
                    />

                    <label>
                        Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        placeholder="Describe the discrepancy in detail"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        rows="4"
                    />

                    {/* Buttons */}
                    <div className="form-actions">
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