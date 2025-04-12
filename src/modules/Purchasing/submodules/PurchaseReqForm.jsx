import React, { useState, useEffect } from "react"; 
import "../styles/PurchaseReqForm.css";

const PurchaseReqForm = ({ onClose }) => {
    const [formData, setFormData] = useState({
        name: "",
        department: "",
        email: "",
        requestType: "Material", // Default to Material
        dateRequested: "",
        dateValid: "",
        documentDate: "",
        employeeId: "",
        items: [],
    });

    const [employees, setEmployees] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [assets, setAssets] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [latestRequestId, setLatestRequestId] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");  // Success message state
    const [isSaveClicked, setIsSaveClicked] = useState(false);  // Track if Save button is clicked

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8000/api/prf/employees/");
                const data = await response.json();
                setEmployees(data);
            } catch {
                setError("Failed to fetch employees");
            }
        };
        fetchEmployees();
    }, []);

    useEffect(() => {
        const fetchItems = async () => {
            setIsLoading(true);
            try {
                const url = formData.requestType === "Material"
                    ? "http://127.0.0.1:8000/api/quotation-content/materials/list/"
                    : "http://127.0.0.1:8000/api/quotation-content/assets/list/";
                const response = await fetch(url);
                const data = await response.json();
                formData.requestType === "Material" ? setMaterials(data) : setAssets(data);
            } catch {
                setError("Failed to fetch items");
            } finally {
                setIsLoading(false);
            }
        };
        fetchItems();
    }, [formData.requestType]);

    const handleInputChange = (e, index = null) => {
        const { name, value } = e.target;
        if (index !== null) {
            const updatedItems = [...formData.items];
            updatedItems[index] = { ...updatedItems[index], [name]: value };
            setFormData((prev) => ({ ...prev, items: updatedItems }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleEmployeeChange = (e) => {
        const selected = employees.find(emp => emp.employee_id === e.target.value);
        setFormData((prev) => ({
            ...prev,
            employeeId: e.target.value,
            email: selected?.email || "",
            department: selected?.department || "",
        }));
    };

    const createQuotationContent = async (item) => {
        try {
            const data = {
                unit_price: null,
                discount: null,
                tax_code: "",
                total: null,
                material_id: item.material_id || null,
                asset_id: item.asset_id || null,
                request_id: item.request_id,
                purchase_quantity: item.purchase_quantity,
            };

            const response = await fetch("http://127.0.0.1:8000/api/quotation-content/create/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            console.log("Quotation created:", result);
        } catch {
            setError("Failed to create quotation content");
        }
    };

    const handleAddRow = async () => {
        // Check if the form is completely filled
        if (!isFormValid()) {
            setError("Please fill all required fields before adding items.");
            return;
        }

        try {
            const res = await fetch("http://127.0.0.1:8000/api/prf/list/");
            const data = await res.json();
            const latest = data[data.length - 1]?.request_id;
            setLatestRequestId(latest);

            // Now, create the new item after fetching the request_id
            const newItem = {
                material_id: formData.requestType === "Material" ? "" : null,
                asset_id: formData.requestType === "Assets" ? "" : null,
                purchase_quantity: 1,
                request_id: latest, // Using the fetched request_id
            };

            setFormData((prev) => ({
                ...prev,
                items: [...prev.items, newItem],
            }));
        } catch {
            setError("Failed to fetch latest request_id");
        }
    };

    const isFormValid = () => {
        return formData.employeeId && formData.dateRequested && formData.dateValid && formData.documentDate;
    };

    const handleRemoveRow = (index) => {
        const items = formData.items.filter((_, i) => i !== index);
        setFormData((prev) => ({ ...prev, items }));
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            const body = {
                request_id: "",
                employee_id: formData.employeeId,
                approval_id: null,
                valid_date: formData.dateValid,
                document_date: formData.documentDate,
                required_date: formData.dateRequested,
                quotation_content_id: null,
                items: formData.items,
            };

            const res = await fetch("http://127.0.0.1:8000/api/prf/submit/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (!res.ok) throw new Error("Fill up the form first");

            const saved = await res.json();
            console.log(" ", saved);

            setSuccessMessage("Purchase request saved successfully!"); // Set success message
            setIsSaveClicked(true); // Set Save clicked to true
            setTimeout(() => {
                setSuccessMessage(""); // Reset after 3 seconds
            }, 3000);
        } catch (error) {
            setError(error.message); 
            setTimeout(() => {
                setError(""); 
            }, 2000); 
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!latestRequestId) {
            setError("Cannot submit an empty form"); 
            setTimeout(() => {
                setError(""); 
            }, 2000); 
            return;
        }

        try {
            for (const item of formData.items) {
                await createQuotationContent(item);
            }
            setSuccessMessage("Submitted successfully!"); // Success message after submission
            setTimeout(() => {
                setSuccessMessage(""); // Reset success message
                onClose(); // Close the form after submission
            }, 3000);
        } catch {
            setError("Error submitting quotation content");
        }
    };

    const handleBack = () => onClose();
    const handleCancel = () => { 
        setFormData({
            name: "",
            department: "",
            email: "",
            requestType: "Material",
            dateRequested: "",
            dateValid: "",
            documentDate: "",
            employeeId: "",
            items: [],
        });
    };

    return (
        <div className="purchase-req-form">
            <div className="form-container">
                <div className="form-header">
                    <button className="back-btn" onClick={handleBack}><span>←</span> Back</button>
                    <h1>PURCHASE REQUEST FORM</h1>
                </div>

                <div className="form-content">
                    <div className="form-left">
                        <div className="form-group">
                            <label>Name<span className="required">*</span></label>
                            <select name="employeeId" value={formData.employeeId} onChange={handleEmployeeChange}>
                                <option value="">Select employee</option>
                                {employees.map(emp => (
                                    <option key={emp.employee_id} value={emp.employee_id}>
                                        {emp.first_name} {emp.last_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange} // Allow user input
                            />
                        </div>

                        <div className="form-group">
                            <label>Department<span className="required">*</span></label>
                            <input type="text" name="department" value={formData.department} readOnly />
                        </div>

                        <div className="form-group">
                            <label>Request Type</label>
                            <select
                                name="requestType"
                                value={formData.requestType}
                                onChange={(e) => {
                                    const newRequestType = e.target.value;
                                    console.log("Selected Request Type:", newRequestType);  // Debugging
                                    setFormData((prev) => ({
                                        ...prev,
                                        requestType: newRequestType,
                                        items: [], // Clear items on request type change
                                    }));
                                }}
                            >
                                <option value="Material">Material</option>
                                <option value="Assets">Assets</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-right">
                        <div className="form-group">
                            <label>Date Requested</label>
                            <input type="date" name="dateRequested" value={formData.dateRequested} onChange={handleInputChange} />
                        </div>
                        <div className="form-group">
                            <input type="date" name="documentDate" value={formData.documentDate} onChange={handleInputChange} />
                        </div>
                        <div className="form-group">
                            <input type="date" name="dateValid" value={formData.dateValid} onChange={handleInputChange} />
                        </div>
                    </div>
                </div>

                <div className="form-group">
                    <button className="save-item" onClick={handleSave}>Next</button>
                </div>

                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>{formData.requestType === "Material" ? "Material Name" : "Asset Name"}</th>
                                <th>Quantity</th>
                                <th>Request ID</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {formData.items.map((item, index) => (
                                <tr key={index}>
                                    <td>
                                        <select
                                            name={formData.requestType === "Material" ? "material_id" : "asset_id"}
                                            value={formData.requestType === "Material" ? item.material_id : item.asset_id}
                                            onChange={(e) => handleInputChange(e, index)}
                                        >
                                            <option value="">Select</option>
                                            {(formData.requestType === "Material" ? materials : assets).map((entry) => (
                                                <option key={entry.material_id || entry.asset_id} value={entry.material_id || entry.asset_id}>
                                                    {entry.material_name || entry.asset_name}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            name="purchase_quantity"
                                            value={item.purchase_quantity}
                                            onChange={(e) => handleInputChange(e, index)}
                                        />
                                    </td>
                                    <td>{item.request_id || "N/A"}</td>
                                    <td>
                                        <button onClick={() => handleRemoveRow(index)}>Remove</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button className="add-item-btn" onClick={handleAddRow} disabled={!isSaveClicked}>Add Item</button>
                </div>

                <div className="button-container">
                    <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
                    <button className="submit-btn" onClick={handleSubmit}>Submit</button>
                </div>

                {error && <div className="error-message">{error}</div>}
                {successMessage && <div className="success-message">{successMessage}</div>} {/* Success message */}
            </div>
        </div>
    );
};

export default PurchaseReqForm;
