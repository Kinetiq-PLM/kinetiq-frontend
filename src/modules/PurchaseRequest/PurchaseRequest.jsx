import React, { useState, useEffect } from "react";
import "./styles/PurchaseRequest.css";
import { format } from "date-fns";

const BodyContent = ({ onClose }) => {
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
    requestType: "Assets", // Default to Material
    dateRequested: format(new Date(), "yyyy-MM-dd"),
    dateValid: format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
    documentDate: format(new Date(), "yyyy-MM-dd"),
    employeeId: "",
    items: [],
  });

  const [employees, setEmployees] = useState([]);
  const [items, setItems] = useState([]); // Unified list of items
  const [assets, setAssets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [latestRequestId, setLatestRequestId] = useState(null);
  const [successMessage, setSuccessMessage] = useState(""); // Success message state
  const [isSaveClicked, setIsSaveClicked] = useState(false); // Track if Save button is clicked
  const [isDropdownEnabled, setIsDropdownEnabled] = useState(false); // State to enable/disable dropdown

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
        setItems(data); // Populate the unified items list
      } catch {
        setError("Failed to fetch items");
      } finally {
        setIsLoading(false);
      }
    };
    fetchItems();
  }, []);

  useEffect(() => {
    // Automatically populate user data on component mount
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setFormData((prev) => ({
        ...prev,
        name: `${user.first_name} ${user.last_name}`,
        email: user.email || "",
        department: user.department || "", 
        employeeId: user.employee_id || "", 
      }));
    } else {
      setError("Failed to load user data. Please log in again.");
    }
  }, []);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch("http://yi92cir5p0.execute-api.ap-southeast-1.amazonaws.com/dev/api/prf/departments/");
        const data = await response.json();
  
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          const userDept = data.find((dept) => dept.dept_id === user.department);
  
          if (userDept) {
            const isDropdownEnabled = ["Sales", "Support & Services"].includes(userDept.dept_name);
            setFormData((prev) => ({
              ...prev,
              requestType: isDropdownEnabled ? prev.requestType : "Assets", // Default to Assets if disabled
            }));
            setIsDropdownEnabled(isDropdownEnabled); // Enable or disable dropdown
          }
        } else {
          setError("Failed to load user data. Please log in again.");
        }
      } catch (error) {
        console.error("Failed to fetch departments:", error);
        setError("Failed to fetch departments.");
      }
    };
  
    fetchDepartments();
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

  const handleEmployeeChange = (e) => {
    const selected = employees.find((emp) => emp.employee_id === e.target.value);
    setFormData((prev) => ({
      ...prev,
      employeeId: e.target.value,
      email: selected?.email || "",
      department: selected?.department || "",
    }));
  };

  const handleAddRow = async () => {
    if (!isFormValid()) {
      setError("Please fill all required fields before adding items.");
      return;
    }
  
    try {
      const response = await fetch("https://yi92cir5p0.execute-api.ap-southeast-1.amazonaws.com/dev/api/prf/list/");
      const data = await response.json();
  
      // Filter the list to find matching requests with the same dates
      const matchingRequests = data.filter((request) => {
        return (
          request.employee_id === formData.employeeId &&
          request.document_date === formData.documentDate &&
          request.valid_date === formData.dateValid &&
          request.required_date === formData.dateRequested &&
          !request.quotation_content_id // Exclude requests with quotation_content_id
        );
      });
  
      if (matchingRequests.length > 0) {
        console.log("Matching Requests Without Quotation Content:", matchingRequests);
  
        // Sort matching requests by document_date to get the latest one
        const latestRequest = matchingRequests.reduce((latest, current) => {
          return new Date(latest.document_date) > new Date(current.document_date) ? latest : current;
        });
  
        console.log("Latest Request Without Quotation Content:", latestRequest);
  
        // Add the latest request to the table
        const newItem = {
          item_id: "",
          item_type: formData.requestType,
          purchase_quantity: 1,
          request_id: latestRequest.request_id,
        };
  
        setFormData((prev) => ({
          ...prev,
          items: [...prev.items, newItem],
        }));
  
        setLatestRequestId(latestRequest.request_id); // Set the latest request ID
      } else {
        setError("No matching requests found for the given criteria or all have quotation content.");
        setTimeout(() => setError(""), 3000);
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
      setError("Failed to fetch requests.");
    }
  };

  const isFormValid = () => {
    return formData.employeeId && formData.dateRequested && formData.dateValid && formData.documentDate;
  };

  const handleRemoveRow = (index) => {
    const items = formData.items.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, items }));
  };

  const createQuotationContent = async (item) => {
    try {
      const data = {
        unit_price: null, // Default to null
        discount: null, // Default to null
        tax_code: "", // Default to an empty string
        item_id: item.item_id || null, // Use item_id from the item
        request_id: item.request_id || null, // Use request_id from the item
        purchase_quantity: item.purchase_quantity || null, // Use purchase_quantity from the item
      };
  
      console.log("Payload being sent to backend:", data); // Debugging
  
      const response = await fetch("https://yi92cir5p0.execute-api.ap-southeast-1.amazonaws.com/dev/api/quotation-content/create/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        const errorDetail = await response.text();
        console.error("Backend error:", errorDetail);
        throw new Error("Failed to create quotation content");
      }
  
      const result = await response.json();
      console.log("Quotation created:", result);
    } catch (error) {
      console.error("Error in createQuotationContent:", error.message);
      throw error; // Re-throw the error to be handled in handleSubmit
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const body = {
        request_id: latestRequestId || "", // Ensure request_id is set
        employee_id: formData.employeeId || "",
        valid_date: formData.dateValid || null,
        document_date: formData.documentDate || null,
        required_date: formData.dateRequested || null,
    };

    console.log("Payload being sent to backend:", body); // Debugging

    const res = await fetch("https://yi92cir5p0.execute-api.ap-southeast-1.amazonaws.com/dev/api/prf/submit/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        const errorDetail = await res.text(); // Log backend error
        console.error("Backend error:", errorDetail);
        throw new Error("Fill up the form first");
    }

    const saved = await res.json();
    console.log("Saved response:", saved);

    setSuccessMessage("Purchase request saved successfully!");
    setIsSaveClicked(true);
    setTimeout(() => setSuccessMessage(""), 3000); // Clear success message after 3 seconds
} catch (error) {
    console.error("Error:", error.message); // Log the error
    setError(error.message);
    setTimeout(() => setError(""), 5000); // Clear error after 5 seconds
} finally {
    setIsLoading(false);
}
};

  const handleSubmit = async () => {
    if (!latestRequestId) {
      setError("Cannot submit an empty form. Please add at least one item.");
      setTimeout(() => {
        setError("");
      }, 2000);
      return;
    }
  
    try {
      for (const item of formData.items) {
        await createQuotationContent(item);
      }
  
      setSuccessMessage("Submitted successfully!");
      setTimeout(() => {
        setSuccessMessage("");
        window.location.reload(); // Refresh the page after showing the success message
      }, 3000);
    } catch (error) {
      setError(error.message || "Error submitting quotation content");
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };
  

  return (
    <div className="purch-req">
      <div className="purchreq-scrollable-wrapper">
        <div className="form-container">
          <div className="form-header">
            <h1>PURCHASE REQUEST FORM</h1>
          </div>

            <div className="form-content">
              <div className="form-section">
              <div className="form-group">
                <label>
                  Name<span className="required">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  disabled
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="readonly-input"
                />
              </div>

              <div className="form-group">
  <label>Request Type</label>
  <select
    name="requestType"
    value={formData.requestType}
    onChange={(e) => {
      const newRequestType = e.target.value;
      console.log("Selected Request Type:", newRequestType);

      // Update the request type and item_type for all items
      setFormData((prev) => ({
        ...prev,
        requestType: newRequestType,
        items: prev.items.map((item) => ({
          ...item,
          item_type: newRequestType, // Update item_type for all items
        })),
      }));
    }}
    disabled={!isDropdownEnabled} // Disable dropdown if not enabled
  >
    <option value="Assets">Assets</option>
    <option value="Material">Material</option>
  </select>
</div>
            </div>

            <div className="form-section">
            <div className="form-group">
                <label>Document Date</label>
                <input
                  type="date"
                  name="documentDate"
                  value={formData.documentDate} // Convert to `datetime-local` format
                  onChange={handleInputChange}
                  disabled={true}
                />
              </div>
              <div className="form-group">
                <label>
                  Date Required<span className="required">*</span>
                </label>
                <input type="date" name="dateRequested" value={formData.dateRequested} onChange={handleInputChange} />
              </div>
              
              <div className="form-group">
                <label>
                  Valid Date<span className="required">*</span>
                </label>
                <input type="date" name="dateValid" value={formData.dateValid} onChange={handleInputChange} />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button className="save-item" onClick={handleSave}>
              Next
            </button>
            <div className="centered-error-message">
              {error === "Fill up the form first" && error}
            </div>
            {successMessage && <div className="success-message">{successMessage}</div>}
          </div>

          <div className="table-container">
  <table>
    <thead>
      <tr>
        <th>Item Name</th>
        <th>Quantity</th>
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
              {items
                .filter((entry) => {
                  // Show Raw Material if requestType is Material, otherwise show Asset
                  return formData.requestType === "Material"
                    ? entry.item_type === "Raw Material"
                    : entry.item_type === "Asset";
                })
                .map((entry) => (
                  <option key={entry.item_id} value={entry.item_id}>
                    {entry.item_name}
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
          <td>
            <button className="remove-btn" onClick={() => handleRemoveRow(index)}>Remove</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
  <button className="add-item-btn" onClick={handleAddRow} disabled={!isSaveClicked}>
    Add Item
  </button>
</div>
          <div className="button-container">
            <button className="submit-btn" onClick={handleSubmit}>
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BodyContent;