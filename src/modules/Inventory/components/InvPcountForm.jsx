import React, { useState, useEffect } from "react";
import "../styles/InvPcountForm.css";

const InvPcountForm = ({ onClose, selectedItem, warehouses = [], inventoryItems = {} }) => {
    const [inventoryItemId, setInventoryItemId] = useState("");
    const [quantity, setQuantity] = useState("");
    const [employeeId, setEmployeeId] = useState("");
    const [status, setStatus] = useState("");
    const [timePeriod, setTimePeriod] = useState("");
    const [warehouseId, setWarehouseId] = useState("");
    const [remarks, setRemarks] = useState("");
    const [localWarehouses, setLocalWarehouses] = useState([]);
    const [inventoryItemsList, setInventoryItemsList] = useState([]);
    const [selectedInventoryItem, setSelectedInventoryItem] = useState(null);

    // Fetch logged-in user's employee_id from localStorage on mount
    useEffect(() => {
        try {
            const rawStoredUser = localStorage.getItem("user");
            if (rawStoredUser) {
                const storedUser = JSON.parse(rawStoredUser);
                if (storedUser && storedUser.employee_id) {
                    setEmployeeId(storedUser.employee_id);
                    console.log("InvPcountForm: Auto-set employeeId from localStorage:", storedUser.employee_id);
                } else {
                    console.warn("InvPcountForm: employee_id not found in stored user data.");
                }
            } else {
                console.warn("InvPcountForm: No 'user' item found in localStorage for employee_id.");
            }
        } catch (error) {
            console.error("InvPcountForm: Error reading user data from localStorage for employee_id:", error);
        }
    }, []); // Empty dependency array means this runs once on mount

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const fetchWarehouses = async () => {
        try {
            // Using the updated API endpoint for warehouses
            const response = await fetch("http://127.0.0.1:8000/api/warehouse-list/");

            if (!response.ok) {
                throw new Error(`Error fetching warehouses: ${response.status}`);
            }

            const data = await response.json();
            console.log("Raw warehouse data:", data);

            let warehouseList = Array.isArray(data) ? data : [];

            if (warehouseList.length > 0) {

                const formattedWarehouses = warehouseList.map(warehouse => {
                    if (typeof warehouse === 'object' && warehouse !== null) {
                        return {
                            id: warehouse.id || warehouse.warehouse_id || '',
                            name: warehouse.name || warehouse.warehouse_location || 'Unknown Location'
                        };
                    } else if (typeof warehouse === 'string') {
                        return { id: warehouse, name: warehouse };
                    } else {
                        return { id: '', name: 'Unknown Warehouse' };
                    }
                });

                // Filter out entries with empty IDs
                const validWarehouses = formattedWarehouses.filter(w => w.id);
                console.log("Formatted warehouses:", validWarehouses);

                if (validWarehouses.length > 0) {
                    setLocalWarehouses(validWarehouses);
                    return;
                }
            }

            // Fallback warehouse data
            setLocalWarehouses([
                { id: "Warehouse 1", name: "Warehouse 1" },
                { id: "Warehouse 2", name: "Warehouse 2" },
                { id: "Warehouse 3", name: "Warehouse 3" }
            ]);
        } catch (err) {
            console.error("Failed to fetch warehouses:", err);
            setLocalWarehouses([
                { id: "Warehouse 1", name: "Warehouse 1" },
                { id: "Warehouse 2", name: "Warehouse 2" },
                { id: "Warehouse 3", name: "Warehouse 3" }
            ]);
        }
    };

    useEffect(() => {
        if (warehouses && warehouses.length > 0) {
            // Format incoming warehouses prop
            const formattedWarehouses = warehouses.map(warehouse => {
                if (typeof warehouse === 'object' && warehouse !== null) {
                    return {
                        id: warehouse.id || warehouse.warehouse_id || String(warehouse),
                        name: warehouse.name || warehouse.warehouse_location || 'Unknown Location'
                    };
                } else {
                    return { id: String(warehouse), name: String(warehouse) };
                }
            });
            setLocalWarehouses(formattedWarehouses);
        } else {
            // Fetch warehouse data
            fetchWarehouses();
        }
    }, [warehouses]);

    useEffect(() => {
        if (Object.keys(inventoryItems).length > 0) {
            const itemsList = Object.values(inventoryItems);
            // console.log("Inventory items from prop:", itemsList);
            setInventoryItemsList(itemsList);
        } else {
            // Using the updated local API endpoint for inventory items
            fetch("http://127.0.0.1:8000/api/inventory-items/")
                .then((res) => {
                    if (!res.ok) {
                        throw new Error(`Error fetching inventory items: ${res.status}`);
                    }
                    return res.json();
                })
                .then((data) => {
                    // console.log("Fetched inventory items:", data);
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
            if (selectedItem.inventory_item_id) {
                setInventoryItemId(selectedItem.inventory_item_id);

                let itemDetails = inventoryItems[selectedItem.inventory_item_id];

                if (!itemDetails) {
                    itemDetails = inventoryItemsList.find(item =>
                        item.inventory_item_id === selectedItem.inventory_item_id
                    );
                }

                if (itemDetails) {
                    setSelectedInventoryItem(itemDetails);

                    if (itemDetails.current_quantity) {
                        setQuantity(itemDetails.current_quantity.toString());
                    }
                }
            } else if (selectedItem.item_id) { // Fallback if inventory_item_id is not directly on selectedItem
                setInventoryItemId(selectedItem.item_id);
            }

            setQuantity(selectedItem.item_actually_counted || "");
            setStatus(selectedItem.status || "");
            setTimePeriod(selectedItem.time_period || "");

            if (selectedItem.warehouse_id && localWarehouses.length > 0) {
                const warehouse = localWarehouses.find(w =>
                    w.id === selectedItem.warehouse_id
                );

                if (warehouse) {
                    setWarehouseId(warehouse.id);
                } else {
                    setWarehouseId(selectedItem.warehouse_id); // Fallback if not found in formatted list
                }
            } else if (selectedItem.warehouse_id) { // Set if warehouses haven't loaded yet
                setWarehouseId(selectedItem.warehouse_id);
            }

            setRemarks(selectedItem.remarks || "");
        } else {
            handleClear();
        }
    }, [selectedItem, inventoryItems, inventoryItemsList, localWarehouses]);

    const handleInventoryItemChange = (e) => {
        const selectedId = e.target.value;
        setInventoryItemId(selectedId);

        const item = inventoryItemsList.find(item => item.inventory_item_id === selectedId);
        setSelectedInventoryItem(item || null);

        // Optionally clear or set quantity based on the new item
        // For now, it sets quantity if available, otherwise keeps current or clears
        if (item && item.current_quantity) {
            setQuantity(item.current_quantity.toString());
        } else {
            setQuantity(""); // Or keep existing: setQuantity(selectedInventoryItem?.current_quantity.toString() || "");
        }
    };

    const handleClear = () => {
        setInventoryItemId("");
        setQuantity("");
        setStatus("");
        setTimePeriod("");
        setWarehouseId("");
        setRemarks("");
        setSelectedInventoryItem(null);
        setSuccessMessage("");
        setErrorMessage("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");

        if (
            !inventoryItemId ||
            !quantity ||
            !employeeId ||
            !status ||
            !timePeriod ||
            !warehouseId
        ) {
            setErrorMessage("Please fill in all required fields.");
            return;
        }

        const itemOnHand = selectedInventoryItem?.current_quantity || 0;
        const actualCounted = Number(quantity);
        const diffQty = itemOnHand - actualCounted;

        const newRecord = {
            inventory_item_id: inventoryItemId,
            item_onhand: itemOnHand,
            item_actually_counted: actualCounted,
            difference_in_qty: diffQty,
            employee_id: employeeId, // Ensure your backend expects 'employee_id'
            status: status,
            time_period: timePeriod,
            remarks: remarks,
            warehouse_id: warehouseId, // Ensure your backend expects 'warehouse_id_input'
        };

        console.log("[InvPcountForm.jsx] Submitting new P-Count record:", newRecord); // Log data before sending

        try {
            // Using the original API endpoint for cyclic counts
            const response = await fetch("http://127.0.0.1:8000/api/cyclic_counts/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newRecord),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to insert record: ${errorText}`);
            }

            const data = await response.json();
            console.log("[InvPcountForm.jsx] Successfully inserted new record - Backend Response:", data); // Log backend response
            setSuccessMessage("Successfully inserted new record!");

            setTimeout(() => {
                handleClear();
                onClose();
            }, 1500);
        } catch (err) {
            console.error("Error inserting record:", err);
            setErrorMessage(err.message || "An unexpected error occurred.");
        }
    };

    useEffect(() => {
        if (localWarehouses.length === 0 && (!warehouses || warehouses.length === 0)) {
            fetchWarehouses();
        }
    }, [localWarehouses, warehouses]);


    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-xl font-semibold">Add P-count</h2>
                    <button onClick={onClose} className="close-btn">
                        ✕
                    </button>
                </div>

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

                <form className="flex flex-wrap" onSubmit={handleSubmit}>
                    <div className="max-h-[10rem]">
                        <label>
                            Inventory Item <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={inventoryItemId}
                            onChange={handleInventoryItemChange}
                            required
                            className="block w-full borde text-gray-400 border-gray-300 rounded-md p-2 mb-4"
                        >
                            <option value="">Select Inventory Item</option>
                            {inventoryItemsList.map((item) => (
                                <option key={item.inventory_item_id} value={item.inventory_item_id}>
                                    {/* CORRECTED LINE: Use item.item_name */}
                                    {(item.item_name || item.inventory_item_id)} - {item.item_type || "Unknown"}
                                </option>
                            ))}
                        </select>

                        <label>
                            Employee ID <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Employee ID (auto-filled)"
                            value={employeeId}
                            readOnly
                            required
                            className="block w-full border-gray-300 rounded-md p-2 mb-4 bg-gray-100 text-gray-500 cursor-not-allowed focus:ring-0 focus:outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                        <span>
                            <label>
                                Physical Count <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                placeholder="Enter Quantity"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                required
                            />
                        </span>

                        <span>
                            <label>
                                Time Period <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={timePeriod}
                                onChange={(e) => setTimePeriod(e.target.value)}
                                required
                                className="text-gray-400"
                            >
                                <option value="">Select Time Period</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                                <option value="quarterly">Quarterly</option>
                                <option value="yearly">Yearly</option>
                            </select>
                        </span>
                    </div>

                    <div className="grid grid-cols-2 space-x-5">
                        <span className="justify-start">
                            <label>
                                Status <span className="text-red-500">*</span>
                            </label>
                            <select value={status} onChange={(e) => setStatus(e.target.value)} required className="text-gray-400">
                                <option value="">Select Status</option>
                                <option value="Completed">Completed</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Open">Open</option>
                                <option value="Closed">Closed</option>
                            </select>
                        </span>

                        <span className="justify-start">
                            <label>
                                Warehouse Location <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={warehouseId}
                                onChange={(e) => setWarehouseId(e.target.value)}
                                required
                                className="text-gray-400"
                            >
                                <option value="">Select Warehouse</option>
                                {localWarehouses
                                    .filter(warehouse => !(warehouse.name && warehouse.name.startsWith("ARCHIVED_")))
                                    .map((warehouse) => (
                                        <option
                                            key={warehouse.id}
                                            value={warehouse.id}
                                        >
                                            {warehouse.name}
                                        </option>
                                    ))}
                            </select>
                        </span>
                    </div>

                    <div>
                        <label>Remarks</label>
                        <textarea
                            placeholder="Enter Remarks"
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                            rows="1"
                        />
                    </div>

                    <div className="form-actions flex justify-end gap-5">
                        <button type="button" onClick={handleClear} className="clear-clear-btn">
                            Clear
                        </button>
                        <button type="submit" className="submit-btn">
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InvPcountForm;