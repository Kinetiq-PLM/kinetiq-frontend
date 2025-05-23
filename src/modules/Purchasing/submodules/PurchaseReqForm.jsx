import React, { useState, useEffect } from "react"; 
import "../styles/PurchaseReqForm.css";

const PurchaseReqForm = ({ onClose }) => {
    const [showPurchasePopup, setShowPurchasePopup] = useState(false);  
    const [isPurchasePopupOpen, setIsPurchasePopupOpen] = useState(false);
    const [purchaseForm, setPurchaseForm] = useState({
    documentNumber: "",
    deliveryDate: "",
    popupStatus: "Pending", // or default status
});

    const [formData, setFormData] = useState({
        name: "",
        department: "",
        email: "",
        requestType: "Material", // Default to Material
        dateRequested: new Date().toISOString().split("T")[0],
        dateValid: "",
        documentDate: new Date().toISOString().split("T")[0],
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
                const response = await fetch("https://yi92cir5p0.execute-api.ap-southeast-1.amazonaws.com/dev/api/prf/employees/");
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
                const response = await fetch("https://yi92cir5p0.execute-api.ap-southeast-1.amazonaws.com/dev/api/quotation-content/item/list/");
                const data = await response.json();
                setMaterials(data.filter((item) => item.item_type === "Raw Material"));
                setAssets(data.filter((item) => item.item_type === "Asset"));
            } catch {
                setError("Failed to fetch items");
            } finally {
                setIsLoading(false);
            }
        };
        fetchItems();
    }, []);

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
    const handleConfirmPurchase = async () => {
        setShowPurchasePopup(false);
        setIsLoading(true);
    
        const quotationId = generateQuotationId();
    
        const purchaseData = {
            quotation_id: quotationId,
            employee_id: formData.employeeId,
            valid_date: formData.dateValid,
            document_date: formData.documentDate,
            required_date: formData.dateRequested,
            items: formData.items,
        };
    
        try {
            const response = await fetch("https://yi92cir5p0.execute-api.ap-southeast-1.amazonaws.com/dev/api/purchase-order/list/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(purchaseData),
            });
    
            if (!response.ok) throw new Error("Failed to create purchase order");
    
            setSuccessMessage("Purchase order created successfully!");
            setTimeout(() => {
                setSuccessMessage("");
                onClose(); // close the form
            }, 3000);
        } catch (error) {
            setError(error.message || "An error occurred");
        } finally {
            setIsLoading(false);
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
                item_id: item.item_id, // Unified item_id
                item_type: item.item_type, // Differentiates between Raw Material and Asset
                request_id: item.request_id,
                purchase_quantity: item.purchase_quantity,
            };

            const response = await fetch("https://yi92cir5p0.execute-api.ap-southeast-1.amazonaws.com/dev/api/quotation-content/create/", {
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
          // Fetch all purchase requests
          const res = await fetch("https://yi92cir5p0.execute-api.ap-southeast-1.amazonaws.com/dev/api/prf/list/");
          const data = await res.json();
      
          // Filter requests that do not have quotation content
          const requestsWithoutQuotation = [];
          for (const request of data) {
            const checkRes = await fetch(`https://yi92cir5p0.execute-api.ap-southeast-1.amazonaws.com/dev/api/quotation-content/check/?request_id=${request.request_id}`);
            const checkData = await checkRes.json();
      
            // Only include requests where quotation content does not exist
            if (!checkData.exists) {
              requestsWithoutQuotation.push(request);
            }
          }
      
          if (requestsWithoutQuotation.length === 0) {
            setError("No available requests without quotation content.");
            return;
          }
      
          // Get the latest request without quotation content
          const latestRequest = requestsWithoutQuotation[requestsWithoutQuotation.length - 1];
          setLatestRequestId(latestRequest.request_id);
      
          console.log("Latest Request Without Quotation Content:", latestRequest);
      
          // Create a new item for the latest request
          const newItem = {
            item_id: "",
            item_type: formData.requestType, // Use the selected request type
            purchase_quantity: 1,
            request_id: latestRequest.request_id, // Associate with the latest request
          };
      
          setFormData((prev) => ({
            ...prev,
            items: [...prev.items, newItem],
          }));
        } catch (error) {
          console.error("Error fetching latest request:", error);
          setError("Failed to fetch the latest request without quotation content.");
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

            const res = await fetch("https://yi92cir5p0.execute-api.ap-southeast-1.amazonaws.com/dev/dev/api/prf/submit/", {
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

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        return () => {
            setIsMounted(false);
        };
    }, []);

    return (
        <div className="purchase-req-form">
            <div className="form-container">
                <div className="form-header">
                    <button className="back-btn" onClick={handleBack}>← Back</button>
                    <h1>PURCHASE REQUEST FORM</h1>
                </div>

                <div className="form-content">
                    <div className="form-left">
                        <div className="form-group">
                            <label>Name<span className="required"></span></label>
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
                            <label>Department<span className="required"></span></label>
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
                            <label>Document Date</label>
                            <input type="date" name="documentDate" value={formData.documentDate} onChange={handleInputChange} readOnly  />
                        </div>
                        <div className="form-group">
                            <label>Valid Date</label>
                            <input type="date" name="dateValid" value={formData.dateValid} onChange={handleInputChange} />
                        </div>
                    </div>
                </div>

                <div className="form-group">
                    <button className="save-item" onClick={handleSave}>Next</button>
                    <div className="centered-error-message">{error === "Fill up the form first" && error}</div>
                </div>

                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Item Name</th>
                                <th>Item Type</th>
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
                                            name="item_id"
                                            value={item.item_id}
                                            onChange={(e) => handleInputChange(e, index)}
                                        >
                                            <option value="">Select</option>
                                            {(item.item_type === "Raw Material" ? materials : assets).map((entry) => (
                                                <option key={entry.item_id} value={entry.item_id}>
                                                    {entry.item_name}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td>
                                        <select
                                            name="item_type"
                                            value={item.item_type}
                                            onChange={(e) => handleInputChange(e, index)}
                                        >
                                            <option value="Raw Material">Raw Material</option>
                                            <option value="Asset">Asset</option>
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
                    <button className="add-item-btn" onClick={handleAddRow}>Add Item</button>
                </div>

                <div className="button-container">
                    <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
                    <button className="submit-btn" onClick={handleSubmit}>Submit</button>
                    <button className="submit-btn" onClick={() => setIsPurchasePopupOpen(true)}>Purchase</button>
                </div>

                {successMessage && <div className="success-message">{successMessage}</div>} {/* Success message */}

                
            </div>
            {isMounted && isPurchasePopupOpen && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h3>Confirm Purchase</h3>
                        <p>Are you sure you want to make a purchase without filing a quotation?</p>
                        <div className="popup-fields-row">
                            <label className="popup-label">
                                Document Number:
                                <input
                                    type="text"
                                    value={purchaseForm.documentNumber}
                                    onChange={(e) => setPurchaseForm({ ...purchaseForm, documentNumber: e.target.value })}
                                />
                            </label>
                            <label className="popup-label">
                                Delivery Date:
                                <input
                                    type="date"
                                    value={purchaseForm.deliveryDate}
                                    onChange={(e) => setPurchaseForm({ ...purchaseForm, deliveryDate: e.target.value })}
                                />
                            </label>
                            <label className="popup-label">
                                Status:
                                <select
                                    value={purchaseForm.popupStatus}
                                    onChange={(e) => setPurchaseForm({ ...purchaseForm, popupStatus: e.target.value })}
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Ordered">Ordered</option>
                                    <option value="Delivered">Delivered</option>
                                </select>
                            </label>
                        </div>
                        <div className="popup-actions">
                            <button onClick={() => setIsPurchasePopupOpen(false)}>Cancel</button>
                            <button
                                className="popup-submit-button"
                                onClick={async () => {
                                    try {
                                        // Step 1: Create quotation first
                                        const quotationPayload = {
                                            document_date: new Date().toISOString().split("T")[0],
                                            valid_date: purchaseForm.deliveryDate || null,
                                            request_id: formData.requestId, // make sure this is set from the parent PR
                                            status: "Pending",
                                        };

                                        const quotationRes = await fetch("https://yi92cir5p0.execute-api.ap-southeast-1.amazonaws.com/dev/api/purchase_quotation/create/", {
                                            method: "POST",
                                            headers: { "Content-Type": "application/json" },
                                            body: JSON.stringify(quotationPayload),
                                        });

                                        if (!quotationRes.ok) {
                                            const errorDetail = await quotationRes.text(); // Get backend response text
                                            console.error("❌ Backend response:", errorDetail); // Log for debugging
                                            throw new Error("Failed to create quotation");
                                            
                                        }

                                        const quotationData = await quotationRes.json();
                                        const quotationId = quotationData.quotation_id;

                                        console.log("🧾 Created Quotation:", quotationId);

                                        // Step 2: Create purchase order using the generated quotation_id
                                        const orderPayload = {
                                            purchase_id: "",
                                            quotation_id: quotationId,
                                            order_date: new Date().toISOString().split("T")[0],
                                            delivery_date: purchaseForm.deliveryDate || null,
                                            document_date: new Date().toISOString().split("T")[0],
                                            status: purchaseForm.popupStatus || "Pending",
                                        };

                                        const orderRes = await fetch("https://yi92cir5p0.execute-api.ap-southeast-1.amazonaws.com/dev/api/purchase-orders/list/", {
                                            method: "POST",
                                            headers: { "Content-Type": "application/json" },
                                            body: JSON.stringify(orderPayload),
                                        });

                                        if (!orderRes.ok) {
                                            throw new Error("Failed to create purchase order");
                                        }

                                        const orderData = await orderRes.json();
                                        console.log("✅ Purchase Order Created:", orderData);

                                        alert("Purchase order created successfully!");
                                        setIsPurchasePopupOpen(false);
                                    } catch (error) {
                                        console.error("❌ Error during purchase creation:", error);
                                        alert("Failed to complete purchase. Check the console for details.");
                                    }
                                }}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PurchaseReqForm;
