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
  const [isPopupVisible, setIsPopupVisible] = useState(false); // Popup state
  const [formData, setFormData] = useState({
    vendor: "",
    documentNumber: "",
    status: "",
    contactPerson: "Son Goku",
    documentDate: new Date().toISOString().split("T")[0],
    currency: "Philippine Peso",
    validUntil: "",
    requiredDate: "",
    buyer: employeeName, // Set the buyer to the employee_name
    owner: "Me",
    deliveryLocation: "Me",
    remarks: "Please Deliver ASAP", // New field
    delivery_loc: "", // New field
    downpayment_request: { enabled: false, value: "" }, // Add an object to track both the toggle and the value
    totalAmount: "",
    discountPercentage: "",
    freight: "1620.00",
    tax: "2.00",
    totalPaymentDue: "2.00",
  });

  // Fetch data when the component mounts or when requestId changes
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/purchase_quotation/vendor/list/");
        setVendors(response.data);
      } catch (error) {
        console.error("Error fetching vendors:", error.response?.data || error.message);
      }
    };

    const fetchItems = async () => {
      if (!requestId) {
        console.warn("No request_id provided. Cannot fetch items.");
        return;
    }

    try {
        const response = await axios.get(`http://127.0.0.1:8000/api/quotation-content/list/`);
        const filteredItems = response.data.filter((item) => item.request_id === requestId);
        console.log("Filtered Items for Request ID:", filteredItems); // Debugging
        setItems(filteredItems); // Set only the items related to the request_id
    } catch (error) {
        console.error("Error fetching quotation items:", error.response?.data || error.message);
    }
    };

    const fetchMaterials = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/quotation-content/materials/list/");
        setMaterials(response.data);
      } catch (error) {
        console.error("Error fetching materials:", error.response?.data || error.message);
      }
    };

    const fetchAssets = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/quotation-content/assets/list/");
        setAssets(response.data);
      } catch (error) {
        console.error("Error fetching assets:", error.response?.data || error.message);
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
                buyer: quotation.employee_name || "Unknown Employee", // Set buyer to employee_name
            });

            // Fetch items related to the quotation's request_id
            if (quotation.request_id) {
                await fetchItems();
            }
        } else if (request) {
            console.log("Using passed request data:", request);
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
                buyer: request.employee_name || "Unknown Employee", // Set buyer to employee_name
            });

            // Fetch items related to the request's request_id
            if (request.request_id) {
                await fetchItems();
            }
        }
    };

    fetchQuotationData();
}, [quotation, request]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "vendor") {
      const selectedVendor = vendors.find((v) => v.vendor_code === value);
      setFormData((prev) => ({
        ...prev,
        vendor: value,
        owner: selectedVendor?.vendor_name || "",
        contactPerson: selectedVendor?.contact_person || "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async () => {
    const payload = {
      quotation_id: "",
      document_no: formData.documentNumber || null,
      status: formData.status || null,
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
        "http://127.0.0.1:8000/api/purchase_quotation/create/",
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
    // 1. First get ALL existing quotations to check for duplicates
    const checkResponse = await axios.get(
      `http://127.0.0.1:8000/api/purchase_quotation/list/`
    );
    
    // 2. Find if this exact document_no exists (with same request_id)
    const existingQuotation = checkResponse.data.find(
      q => q.document_no === formData.documentNumber && 
           q.request_id === requestId
    );

    // 3. Prepare the payload
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

    // 4. Debug log before making the request
    console.log('Existing quotation check:', {
      exists: !!existingQuotation,
      document_no: formData.documentNumber,
      request_id: requestId
    });

    let apiResponse;
    if (existingQuotation) {
      console.log("Updating existing quotation ID:", existingQuotation.quotation_id);
      apiResponse = await axios.put(
        `http://127.0.0.1:8000/api/purchase_quotation/edit/${existingQuotation.quotation_id}/`,
        payload
      );
    } else {
      console.log("Creating new quotation");
      apiResponse = await axios.post(
        "http://127.0.0.1:8000/api/purchase_quotation/create/",
        payload
      );
    }

    console.log("API Response:", apiResponse.data);
    window.location.reload();
    alert("Quotation added successfully!");
    
    return apiResponse.data;

  } catch (error) {
    console.error("Full error details:", {
      message: error.message,
      response: error.response?.data,
      config: error.config
    });
    throw error; // Re-throw to be caught by the calling function
  }
};

  

const handleSendTo = async () => {
  try {
    setIsPopupVisible(false);
    
    // First update/create the quotation
    const quotationResponse = await handleAddToList();
    
    if (!quotationResponse?.quotation_id) {
      throw new Error("Failed to get valid quotation ID");
    }

    // Prepare purchase order payload with proper data types
    const poPayload = {
      quotation_id: quotationResponse.quotation_id,
      order_date: new Date().toISOString().split('T')[0],
      delivery_date: formData.deliveryDate || new Date().toISOString().split('T')[0],
      document_date: formData.documentDate || new Date().toISOString().split('T')[0],
      status: "Pending"
    };

    console.log("Purchase Order Payload:", JSON.stringify(poPayload, null, 2));

    // Create purchase order
    const response = await axios.post(
      "http://127.0.0.1:8000/api/purchase-orders/list/",
      poPayload,
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    console.log("Purchase Order Response:", response.data);
    alert("Purchase order created successfully!");

  } catch (error) {
    console.error("Purchase Order Error Details:", {
      message: error.message,
      responseData: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers,
      config: error.config
    });
    
    let errorMessage = "Failed to create purchase order. ";
    if (error.response?.data) {
      // Display backend validation errors if available
      errorMessage += JSON.stringify(error.response.data);
    }
    
    alert(errorMessage);
    setIsPopupVisible(true); // Reopen popup to try again
  }
};
  

  const getItemName = (id, type) => {
    if (type === "material") {
      const material = materials.find((m) => m.material_id === id);
      return material ? material.material_name : "Unknown Material";
    } else if (type === "asset") {
      const asset = assets.find((a) => a.asset_id === id);
      return asset ? asset.asset_name : "Unknown Asset";
    }
    return "Unknown Item";
  };

  return (
    <div className="purchquoteform">
      <div className="purchquoteform-scrollable-wrapper">
        <div className="body-content-container">
          <div className="purchquoteform-header">
            <button className="purchquoteform-back" onClick={onClose}>← Back</button>
            <h2 className="purchquoteform-title">Request For Quotation Form</h2>
            {formData.status === "Pending" || formData.status === "Rejected" ? (
              <button
                className="purchquoteform-send"
                onClick={handleAddToList}
              >
                Add to List
              </button>
            ) : (
              <button
                className="purchquoteform-send"
                onClick={() => setIsPopupVisible(true)}
              >
                Send To
              </button>
            )}
          </div>

          <div className="purchquoteform-content">
            <div className="purchquoteform-grid">
              <div className="form-group">
                <label>Contact Person</label>
                <select name="vendor" value={formData.vendor} onChange={handleInputChange}>
                  <option value="">Select Vendor</option>
                  {vendors.map((v) => (
                    <option key={v.vendor_code} value={v.vendor_code}>
                      {v.contact_person} - {v.vendor_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Document Number*</label>
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
                <label>Status</label>
                <select name="status" value={formData.status} onChange={handleInputChange}>
                  <option value="">Select Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
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
                <label>Document Date</label>
                <input 
                  type="date" 
                  name="documentDate"
                  value={formData.documentDate}
                  onChange={handleInputChange}
                  className="gray-bg, datepicker-input "
                />
              </div>
              <div className="form-group">
                <label>Currency</label>
                <input 
                  type="text" 
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Valid until</label>
                <input 
                  type="date" 
                  name="validUntil"
                  value={formData.validUntil}
                  onChange={handleInputChange}
                  className="gray-bg, datepicker-input "
                />
              </div>
              <div className="form-group">
                <label>Required Date</label>
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
                  {items.map((item, index) => (
                    <tr key={index}>
                      <td>{item.material_id || item.asset_id}</td>
                      <td>
                        {item.material_id
                          ? getItemName(item.material_id, "material")
                          : getItemName(item.asset_id, "asset")}
                      </td>
                      <td>{item.purchase_quantity}</td>
                      <td>{item.material_id
                           ? materials.find((m) => m.material_id === item.material_id)?.cost_per_unit || "N/A"
                           : assets.find((a) => a.asset_id === item.asset_id)?.purchase_price || "N/A"} </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="purchquoteform-details">
              <div className="details-left">
                <div className="form-group">
                  <label>Buyer</label>
                  <input 
                    type="text" 
                    name="buyer"
                    value={formData.buyer}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Owner</label>
                  <input 
                    type="text" 
                    name="owner"
                    value={formData.owner}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Delivery Location</label>
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
  </label>
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
                  <label>Discount Percentage</label>
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
                  <label>Freight</label>
                  <input 
                    type="text" 
                    name="freight"
                    value={formData.freight}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Tax</label>
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
      <br></br>
      <p>Please confirm delivery details</p>
      <br></br>

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
      <br></br>

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
          <option value="">Select Status</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
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
            <button className="purchquoteform-copy">Copy From</button>
          </div>
        </div>
      </div>
    </div>
  );
};

  export default PurchForQuotForm;
