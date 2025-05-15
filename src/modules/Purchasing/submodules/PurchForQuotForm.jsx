import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/PurchForQuotForm.css";

const PurchForQuotForm = ({ onClose, request, quotation, onSuccess }) => {
  const requestId = request?.request_id; // Access request_id from the passed request object
  const employeeName = request?.employee_name || "Unknown"; // Access employee_name from the request object

  const [vendors, setVendors] = useState([]);
  const [items, setItems] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [assets, setAssets] = useState([]);
  const [isDownpaymentEnabled, setIsDownpaymentEnabled] = useState(false);
  const [employeeMap, setEmployeeMap] = useState({}); // State to store employee data
  const [isPopupVisible, setIsPopupVisible] = useState(false); // Popup state
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    vendor: "",
    documentNumber: "",
    status: "Pending",
    contactPerson: "",
    documentDate: new Date().toISOString().split("T")[0],
    currency: "Philippine Peso",
    validUntil: "",
    requiredDate: "",
    buyer: employeeName,
    owner: "",
    deliveryLocation: "",
    remarks: "",
    delivery_loc: "",
    downpayment_request: { enabled: false, value: "" },
    totalAmount: "0.00",
    discountPercentage: "0",
    freight: "0.00",
    tax: "0.00",
    totalPaymentDue: "0.00",
    deliveryDate: "",
    popupStatus: "",
  });
  // Fetch employee data and map employee_id to employee_name
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get("https://yi92cir5p0.execute-api.ap-southeast-1.amazonaws.com/dev/api/prf/employees/");
        const employeeData = response.data.reduce((map, employee) => {
          const fullName = `${employee.first_name} ${employee.last_name}`.trim();
          map[employee.employee_id] = fullName;
          return map;
        }, {});
        setEmployeeMap(employeeData);
      } catch (error) {
        console.error("Error fetching employees:", error.response?.data || error.message);
      }
    };

    fetchEmployees();
  }, []);

  // Fetch the employee_id matching the request_id
  useEffect(() => {
    const fetchEmployeeIdForRequest = async () => {
      if (!requestId) return;

      try {
        const response = await axios.get("https://yi92cir5p0.execute-api.ap-southeast-1.amazonaws.com/dev/api/prf/list/");
        const matchingRequest = response.data.find((req) => req.request_id === requestId);

        if (matchingRequest?.employee_id) {
          const employeeName = employeeMap[matchingRequest.employee_id] || "Unknown Employee";
          setFormData((prev) => ({
            ...prev,
            buyer: employeeName, // Set the buyer field to the employee_name
          }));
        }
      } catch (error) {
        console.error("Error fetching request data:", error.response?.data || error.message);
      }
    };

    fetchEmployeeIdForRequest();
  }, [requestId, employeeMap]);

  

  // Fetch data when the component mounts or when requestId changes
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await axios.get("https://yi92cir5p0.execute-api.ap-southeast-1.amazonaws.com/dev/api/purchase_quotation/vendor/list/");
        setVendors(response.data);
      } catch (error) {
        console.error("Error fetching vendors:", error.response?.data || error.message);
      }
    };

    const fetchItems = async () => {
      try {
        let itemsResponse = [];
        let allItemsResponse = [];
    
        if (requestId) {
          // Fetch items filtered by request_id
          const response = await axios.get("https://yi92cir5p0.execute-api.ap-southeast-1.amazonaws.com/dev/api/quotation-content/list/");
          itemsResponse = response.data.filter((item) => item.request_id === requestId);
          console.log("Filtered Items by Request ID:", itemsResponse);
        } else {
          // Fetch all items from item/list/ endpoint
          const response = await axios.get("https://yi92cir5p0.execute-api.ap-southeast-1.amazonaws.com/dev/api/quotation-content/item/list/");
          itemsResponse = response.data;
          console.log("Fetched All Items:", itemsResponse);
        }
    
        // Fetch all items to map item_id to item_name
        const allItemsResponseData = await axios.get("https://yi92cir5p0.execute-api.ap-southeast-1.amazonaws.com/dev/api/quotation-content/item/list/");
        allItemsResponse = allItemsResponseData.data;
    
        // Map item_name to itemsResponse
        const mappedItems = itemsResponse.map((item) => {
          const matchedItem = allItemsResponse.find((i) => i.item_id === item.item_id);
          return {
            ...item,
            item_name: matchedItem ? matchedItem.item_name : "Unknown Item",
            unit_price: item.unit_price || 0, // Default to 0 if unit_price is missing
          };
        });
    
        setItems(mappedItems); // Set the items with item_name included
      } catch (error) {
        console.error("Error fetching items:", error.response?.data || error.message);
        setError("Failed to fetch items");
      }
    };

    const fetchDocumentNumber = async () => {
      if (formData.documentNumber) return; // Skip if document_no already exists

      try {
        const randomDocumentNumber = Math.floor(10000 + Math.random() * 90000)
          .toString()
          .padStart(5, "0");

        setFormData((prev) => ({
          ...prev,
          documentNumber: randomDocumentNumber,
        }));
      } catch (error) {
        console.error("Error generating document number:", error.message);
        setFormData((prev) => ({
          ...prev,
          documentNumber: "00001", // Default to "00001" if something goes wrong
        }));
      }
    };

    const handleRowClick = (quotation) => {
      console.log("Selected Quotation (PurchaseQuot):", quotation); // Debugging
      setSelectedQuotation(quotation);
      setView("form"); view
    };

    const fetchData = async () => {

      
      fetchVendors();
      fetchItems();
      fetchMaterials();
      fetchAssets();
      fetchDocumentNumber(); // Generate and set the document number
    };

    fetchData();
  }, [requestId]);

  // Calculate total amount whenever items change
  useEffect(() => {
    const total = items.reduce((sum, item) => {
        const unitPrice = item.material_id
            ? materials.find((m) => m.material_id === item.material_id)?.cost_per_unit || 0
            : assets.find((a) => a.asset_id === item.asset_id)?.purchase_price || 0;

        const quantity = item.purchase_quantity || 0;

        return sum + unitPrice * quantity;
    }, 0);

    setFormData((prev) => ({
        ...prev,
        totalAmount: total.toFixed(2), // Ensure the result is a string with 2 decimal places
    }));
}, [items, materials, assets]);

useEffect(() => {
  const computeTotalPaymentDue = () => {
    const totalBeforeDiscount = parseFloat(formData.totalAmount) || 0;
    const discount = (parseFloat(formData.discountPercentage) || 0) / 100;
    const downpayment = (parseFloat(formData.downpayment_request.value) || 0) / 100;
    const freight = parseFloat(formData.freight) || 0; // Parse freight as a number
    const tax = parseFloat(formData.tax) || 0; // Parse tax as a number

    const discountedAmount = totalBeforeDiscount - totalBeforeDiscount * discount;
    const totalPaymentDue = discountedAmount - discountedAmount * downpayment + freight + tax;

    setFormData((prev) => ({
      ...prev,
      totalPaymentDue: totalPaymentDue.toFixed(2), // Ensure the result is a string with 2 decimal places
    }));
  };

  computeTotalPaymentDue();
}, [formData.totalAmount, formData.discountPercentage, formData.downpayment_request.value, formData.freight, formData.tax]);

useEffect(() => {
  const fetchQuotationData = async () => {
    if (quotation) {
      console.log("Using passed quotation data:", quotation);

      // Find the vendor based on the vendor_code
      const selectedVendor = vendors.find((v) => v.vendor_code === quotation.vendor_code);

      setFormData({
        vendor: quotation.vendor_code || "",
        documentNumber: quotation.document_no || "",
        status: quotation.status || "",
        validUntil: quotation.valid_date || "",
        documentDate: quotation.document_date || "",
        requiredDate: quotation.required_date || "",
        totalAmount: quotation.total_before_discount || "",
        discountPercentage: quotation.discount_percent || "",
        freight: quotation.freight || "",
        tax: quotation.tax || "",
        totalPaymentDue: quotation.total_payment || "",
        request_id: quotation.request_id || null,
        remarks: quotation.remarks || "",
        delivery_loc: quotation.delivery_loc || "",
        downpayment_request: {
          enabled: !!quotation.downpayment_request,
          value: quotation.downpayment_request || "",
        },
        buyer: quotation.employee_name || "Unknown Employee",
        owner: selectedVendor?.company_name || "n/a", // Set the owner field
      });

      if (quotation.request_id) {
        await fetchItems();
      }
    } else if (request) {
      console.log("Using passed request data:", request);

      // Find the vendor based on the vendor_code
      const selectedVendor = vendors.find((v) => v.vendor_code === request.vendor_code);

      setFormData({
        vendor: request.vendor_code || "",
        documentNumber: request.document_no || "",
        status: request.status || "",
        validUntil: request.valid_date || "",
        documentDate: request.document_date || "",
        requiredDate: request.required_date || "",
        totalAmount: request.total_before_discount || "",
        discountPercentage: request.discount_percent || "",
        freight: request.freight || "",
        tax: request.tax || "",
        totalPaymentDue: request.total_payment || "",
        request_id: request.request_id || null,
        remarks: request.remarks || "",
        delivery_loc: request.delivery_loc || "",
        downpayment_request: {
          enabled: !!request.downpayment_request,
          value: request.downpayment_request || "",
        },
        buyer: request.employee_name || "Unknown Employee",
        owner: selectedVendor?.company_name || "n/a", // Set the owner field
      });

      if (request.request_id) {
        await fetchItems();
      }
    }
  };

  fetchQuotationData();
}, [quotation, request, vendors]);

const handleInputChange = (e) => {
  const { name, value } = e.target;

  if (name === "vendor") {
    // Find the selected vendor from the vendors array
    const selectedVendor = vendors.find((v) => v.vendor_code === value);
    console.log("Selected Vendor:", selectedVendor); // Debugging

    // Update the formData with the selected vendor details
    setFormData((prev) => ({
      ...prev,
      vendor: value,
      owner: selectedVendor?.company_name || "n/a", // Set the owner field to the company_name
      contactPerson: selectedVendor?.contact_person || "", // Set the contact person
    }));
  } else {
    // Update other fields
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
};

// Fetch vendors when the component mounts
useEffect(() => {
  const fetchVendors = async () => {
    try {
      const response = await axios.get("https://yi92cir5p0.execute-api.ap-southeast-1.amazonaws.com/dev/api/purchase_quotation/vendor/list/");
      console.log("Vendors fetched:", response.data); // Debugging
      setVendors(response.data);
    } catch (error) {
      console.error("Error fetching vendors:", error.response?.data || error.message);
    }
  };

  fetchVendors();
}, []);

// Log formData updates for debugging
useEffect(() => {
  console.log("Form Data Updated:", formData); // Debugging
}, [formData]);

const fetchQuotations = async () => {
  try {
    const response = await axios.get("https://yi92cir5p0.execute-api.ap-southeast-1.amazonaws.com/dev/api/purchase_quotation/list/");
    console.log("Fetched Quotations:", response.data);
  } catch (error) {
    console.error("Error fetching quotations:", error.response?.data || error.message);
  }
};

  const handleSubmit = async () => {
    const payload = {
      quotation_id: "",
      document_no: formData.documentNumber || null,
      status: formData.status || "Pending",
      valid_date: formData.validUntil || null,
      document_date: formData.documentDate || null,
      required_date: formData.requiredDate || null,
      total_before_discount: formData.totalAmount || null,
      discount_percent: formData.discountPercentage || null,
      freight: formData.freight || null,
      tax: formData.tax || null,
      total_payment: formData.totalPaymentDue || null,
      vendor_code: formData.vendor || null,
      request_id: requestId || null,
      remarks: formData.remarks || null, // New field
      delivery_loc: formData.delivery_loc || null, // New field
      downpayment_request: formData.downpayment_request || null, // New field
    };

    console.log("Request ID in formData:", formData.request_id);
    console.log("Payload being sent:", payload);

    console.log("📤 Submitting Payload:", payload);

    try {
      const response = await axios.post(
        "https://yi92cir5p0.execute-api.ap-southeast-1.amazonaws.com/dev/api/purchase_quotation/create/",
        payload
      );
      console.log("✅ Response from server:", response.data);
      alert("Quotation sent successfully!");
      window.location.reload();
    } catch (error) {
      console.error("❌ Error submitting quotation:", error.response?.data || error.message);
      alert("Failed to send quotation. Check the console for details.");
    }
  };

  const handleAddToList = async () => {
  try {
    // Check if a quotation already exists for the given request_id
    const listResponse = await axios.get("https://yi92cir5p0.execute-api.ap-southeast-1.amazonaws.com/dev/api/purchase_quotation/list/");
    const existingQuotation = listResponse.data.find(
      (quotation) => quotation.request_id === requestId
    );

    if (existingQuotation) {
      console.log("Existing Quotation Found:", existingQuotation);
      return existingQuotation; // Return the existing quotation without reloading
    }

    // If no existing quotation, create a new one
    const payload = {
      document_no: parseInt(formData.documentNumber),
      status: formData.status || "Pending",
      valid_date: formData.validUntil || null,
      document_date: formData.documentDate || null,
      required_date: formData.requiredDate || null,
      total_before_discount: formData.totalAmount || null,
      discount_percent: formData.discountPercentage || null,
      freight: formData.freight || null,
      tax: formData.tax || null,
      total_payment: formData.totalPaymentDue || null,
      vendor_code: formData.vendor || null,
      request_id: requestId || null,
      remarks: formData.remarks || null,
      delivery_loc: formData.delivery_loc || null,
      downpayment_request: formData.downpayment_request.enabled
        ? parseFloat(formData.downpayment_request.value) || 0
        : null,
    };

    console.log("Payload being sent:", payload);

    const createResponse = await axios.post(
      "https://yi92cir5p0.execute-api.ap-southeast-1.amazonaws.com/dev/api/purchase_quotation/create/",
      payload
    );

    console.log("New Quotation Created:", createResponse.data);
    return createResponse.data; // Return the newly created quotation
  } catch (error) {
    console.error("Error in handleAddToList:", error.response?.data || error.message);
    alert("Failed to add or fetch quotation. Check the console for details.");
    throw error;
  }
};
  

  const handleSendTo = async () => {
  try {
    setIsPopupVisible(false);

    // Fetch or create the quotation
    const quotationResponse = await handleAddToList();

    if (!quotationResponse?.quotation_id) {
      throw new Error("Failed to get valid quotation ID");
    }

    console.log("Fetched Quotation ID:", quotationResponse.quotation_id);

    // Prepare purchase order payload
    const poPayload = {
      quotation_id: quotationResponse.quotation_id,
      order_date: new Date().toISOString().split("T")[0],
      delivery_date: formData.deliveryDate || new Date().toISOString().split("T")[0],
      document_date: formData.documentDate || new Date().toISOString().split("T")[0],
      status: formData.popupStatus || "Ordered",
    };

    console.log("Purchase Order Payload:", JSON.stringify(poPayload, null, 2));

    // Create purchase order
    const response = await axios.post(
      "https://yi92cir5p0.execute-api.ap-southeast-1.amazonaws.com/dev/api/purchase-orders/list/",
      poPayload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Purchase Order Response:", response.data);
    alert("Purchase order created successfully!");
    window.location.reload(); // Reload the page after successful submission
  } catch (error) {
    console.error("Purchase Order Error Details:", {
      message: error.message,
      responseData: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers,
      config: error.config,
    });

    let errorMessage = "Failed to create purchase order. ";
    if (error.response?.data) {
      errorMessage += JSON.stringify(error.response.data);
    }

    alert(errorMessage);
    setIsPopupVisible(true); // Reopen popup to try again
  }
};

const getItemName = (id, type) => {
  if (type === "Raw Material") {
    const material = materials.find((m) => m.item_id === id);
    return material ? material.item_name : "Unknown Material";
  } else if (type === "Asset") {
    const asset = assets.find((a) => a.item_id === id);
    return asset ? asset.item_name : "Unknown Asset";
  }
  return "Unknown Item";
};

const handleAmountChange = async (e, index) => {
  const { value } = e.target;
  const updatedItems = [...items];
  updatedItems[index] = { ...updatedItems[index], unit_price: parseFloat(value) || 0 };

  // Calculate the total for the item
  updatedItems[index].total =
    (updatedItems[index].unit_price || 0) * (updatedItems[index].purchase_quantity || 0);

  setItems(updatedItems);

  // Optionally update the backend
  try {
    const payload = {
      unit_price: updatedItems[index].unit_price,
      discount: updatedItems[index].discount || 0, // Include discount if available
      total: updatedItems[index].total, // Save the total for the item
    };

    await axios.patch(
      `https://yi92cir5p0.execute-api.ap-southeast-1.amazonaws.com/dev/api/quotation-content/update/${updatedItems[index].quotation_content_id}/`,
      payload
    );

    console.log("Updated item:", payload);
  } catch (error) {
    console.error("Error updating item:", error.response?.data || error.message);
  }
};

useEffect(() => {
  const computeTotalAmount = () => {
    const total = items.reduce((sum, item) => {
      const unitPrice = parseFloat(item.unit_price) || 0;
      const quantity = parseFloat(item.purchase_quantity) || 0;
      return sum + unitPrice * quantity;
    }, 0);

    setFormData((prev) => ({
      ...prev,
      totalAmount: total.toFixed(2), // Ensure the result is a string with 2 decimal places
    }));
  };

  computeTotalAmount();
}, [items]);

  return (
    <div className="purchquoteform">
      <div className="purchquoteform-scrollable-wrapper">
        <div className="body-content-container">
          <div className="purchquoteform-header">
  <button className="purchquoteform-back" onClick={onClose}>← Back</button>
  <h2 className="purchquoteform-title">Request For Quotation Form</h2>
  {formData.status === "Approved" ? (
    <button
      className="purchquoteform-send"
      onClick={() => setIsPopupVisible(true)} // Proceed to Order
    >
      Proceed To Order
    </button>
  ) : (
    <button
      className="purchquoteform-send"
      onClick={handleAddToList} // Add to List
    >
      Add to List
    </button>
  )}
</div>

          <div className="purchquoteform-content">
            <div className="purchquoteform-grid">
            <div className="form-group">
              <div className="label-req">
                <label>Contact Person</label>
              </div>
              <select name="vendor" value={formData.vendor} onChange={handleInputChange}>
              <option value="">Select Vendor</option> {/* Default placeholder option */}
              {vendors
                .filter((v) => v.status === "Approved") // Filter vendors with status = "Approved"
                .map((v) => (
                  <option key={v.vendor_code} value={v.vendor_code}>
                    {v.contact_person || "No Contact Person"} {/* Show contact_person */}
                  </option>
                ))}
            </select>
            </div>
              <div className="form-group">
                <label>Document Number</label>
                <input 
                  type="text" 
                  name="documentNumber"
                  value={formData.documentNumber}
                  onChange={handleInputChange}
                  className="gray-bg"
                  disabled
                />
              </div>
              <div className="form-group">
                <div className="label-req">
                <label>Status</label><select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select></div>
                
              </div>

              <div className="form-group">
                <label>Vendor Code</label>
                <input 
                  type="text" 
                  name="vendor"
                  value={formData.vendor}
                  onChange={handleInputChange}
                  disabled
                />
              </div>
              <div className="form-group">
                <div className="label-req">
                <label>Document Date</label></div>
                <input 
                  type="date" 
                  name="documentDate"
                  value={formData.documentDate}
                  onChange={handleInputChange}
                  className="gray-bg, datepicker-input "
                />
              </div>
              <div className="form-group">
                <div className="label-req">
                <label>Currency</label></div>
                <input 
                  type="text" 
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <div className="label-req">
                <label>Valid until</label></div>
                <input 
                  type="date" 
                  name="validUntil"
                  value={formData.validUntil}
                  onChange={handleInputChange}
                  className="gray-bg, datepicker-input "
                />
              </div>
              <div className="form-group">
              <div className="label-req">
                <label>Required Date</label></div>
                <input 
                  type="date" 
                  name="requiredDate"
                  value={formData.requiredDate}
                  onChange={handleInputChange}datepicker-input 
                />
              </div>
            </div>

            <div className="purchquoteform-table">
            <table>
              <thead>
                <tr>
                  <th>Item Id</th>
                  <th>Item Name</th>
                  <th>Quantity</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => {
                  console.log("Item:", item); // Log each item to verify its structure
                  return (
                    <tr key={index}>
                      <td>{item.item_id}</td>
                      <td>{item.item_name || "Unknown Item"}</td>
                      <td>{item.purchase_quantity}</td>
                      <td>
                        <input
                          type="number"
                          value={item.unit_price !== undefined ? item.unit_price: 0} // Show saved unit_price if it exists
                          onChange={(e) => handleAmountChange(e, index)}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

            <div className="purchquoteform-details">
              <div className="details-left">
                <div className="form-group">
                  <div className="label-req">
                  <label>Buyer</label></div>
                  <input 
                    type="text" 
                    name="buyer"
                    value={formData.buyer}
                    onChange={handleInputChange}
                    disabled
                  />
                </div>
                <div className="form-group">
                  <div className="label-req">
                  <label>Owner</label></div>
                  <input 
                    type="text" 
                    name="owner"
                    value={formData.owner}
                    onChange={handleInputChange}
                    disabled
                  />
                </div>
                <div className="form-group">
                  <div className="label-req">
                  <label>Delivery Location</label></div>
                  <input 
                    type="text" 
                    name="delivery_loc"
                    value={formData.delivery_loc}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Remarks</label>
                  <textarea 
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleInputChange}
                  />
                </div>
                

              </div>
              
              <div className="details-right">
                <div className="form-group">
                  <label>Total Amount</label>
                  <input 
                    type="text" 
                    name="totalAmount"
                    value={formData.totalAmount}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                <div className="label-req">
                  <label className="downpayment-label" >
                    <input
                    className="input-with-symbol"
                      type="checkbox"
                      checked={formData.downpayment_request.enabled}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          downpayment_request: {
                            ...prev.downpayment_request,
                            enabled: e.target.checked, // Toggle the enabled state
                            value: e.target.checked ? prev.downpayment_request.value : "", // Reset value if unchecked
                          },
                        }))
                      }
                    />
                    Downpayment&nbsp;Request
                  </label></div>
                  <div className="input-with-symbol">
                  <input
                    type="text"
                    name="downpayment_request"
                    value={formData.downpayment_request.value}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        downpayment_request: {
                          ...prev.downpayment_request,
                          value: e.target.value, // Update the value
                        },
                      }))
                    }
                    disabled={!formData.downpayment_request.enabled} // Disable the input if the toggle is off
                  />
                  <span>%</span>
                </div>
                </div>
                <div className="form-group">
                  <div className="label-req">
                  <label>Discount Percentage</label></div>
                  <div className="input-with-symbol">
                    <input
                      type="text"
                      name="discountPercentage"
                      value={formData.discountPercentage}
                      onChange={handleInputChange}
                    />
                    <span>%</span>
                  </div>
                </div>
                <div className="form-group">
                  <div className="label-req">
                  <label>Freight</label></div>
                  <input 
                    type="text" 
                    name="freight"
                    value={formData.freight}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <div className="label-req">
                  <label>Tax</label></div>
                  <input 
                    type="text" 
                    name="tax"
                    value={formData.tax}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Total Payment Due</label>
                  <input 
                    type="text" 
                    name="totalPaymentDue"
                    value={formData.totalPaymentDue}
                    disabled
                    onChange={handleInputChange}
                  />
                </div>
                
              </div>
            </div>
          </div>

          {isPopupVisible && (
            <div className="popup-form">
              <div className="popup-form-content">
                <h3>Purchase Order</h3>
                <br />
                <p>Please confirm delivery details</p>
                <br />

                {/* Delivery Date Field */}
                <div className="form-group">
                  <label>Delivery Date</label>
                  <input
                    type="date"
                    name="deliveryDate"
                    value={formData.deliveryDate || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        deliveryDate: e.target.value,
                      }))
                    }
                  />
                </div>
                <br />

                {/* Status Field */}
                <div className="form-group">
                  <label>Status</label>
                  <select
                    name="popupStatus"
                    value={formData.popupStatus || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        popupStatus: e.target.value,
                      }))
                    }
                  >
                    <option value="Ordered">Ordered</option>
                  </select>
                </div>

                <div className="popup-buttons">
                  <button
                    className="popup-close-button"
                    onClick={() => setIsPopupVisible(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="popup-submit-button"
                    onClick={handleSendTo}
                  >
                    Confirm & Submit
                  </button>
                </div>
              </div>
            </div>
          )}
          <div className="purchquoteform-footer">
          </div>
        </div>
      </div>
    </div>
  );
};

  export default PurchForQuotForm;
