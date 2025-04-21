import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/PurchaseOrders.css";

const PurchaseOrderUI = ({
  quotation_id,
  order_date,
  delivery_date,
  status,
  document_date, 
  delivery_loc,
  items = [],
  onClose,
}) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [summaryData, setSummaryData] = useState({
    totalBeforeDiscount: 0,
    discount: 0,
    freight: 0,
    tax: 0,
    totalPaymentDue: 0,
    vendorCode: "N/A",
    vendorName: "N/A",
    documentNo: "N/A",
  });
  const [showQCModal, setShowQCModal] = useState(false);
  const [qcForm, setQcForm] = useState({
    inspection_date: new Date().toISOString().split("T")[0],
    inspection_result: "",
    remarks: "",
    shipment_id: "",
    employee_id: ""
  });
  const [shipments, setShipments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");
        
        // Fetch purchase quotation data
        const quotationResponse = await axios.get("https://yi92cir5p0.execute-api.ap-southeast-1.amazonaws.com/dev/api/purchase_quotation/list/");
        const quotation = quotationResponse.data.find((q) => q.quotation_id === quotation_id);

        if (!quotation) {
          throw new Error("Purchase quotation not found");
        }

        const requestId = quotation.request_id;

        // Fetch quotation content
        const quotationContentResponse = await axios.get("https://yi92cir5p0.execute-api.ap-southeast-1.amazonaws.com/dev/api/quotation-content/list/");
        const quotationContent = quotationContentResponse.data.filter((qc) => qc.request_id === requestId);

        // Fetch materials and assets
        const [materialsResponse, assetsResponse] = await Promise.all([
          axios.get("https://yi92cir5p0.execute-api.ap-southeast-1.amazonaws.com/dev/api/quotation-content/materials/list/"),
          axios.get("https://yi92cir5p0.execute-api.ap-southeast-1.amazonaws.com/dev/api/quotation-content/assets/list/")
        ]);

        // Process items
        const items = quotationContent.map((item, index) => {
          const price =
              materialsResponse.data.find((m) => m.material_id === item.material_id)?.cost_per_unit ||
              assetsResponse.data.find((a) => a.asset_id === item.asset_id)?.purchase_price ||
              0;
      
          return {
              id: item.id || `item-${index}`,
              name:
                  materialsResponse.data.find((m) => m.material_id === item.material_id)?.material_name ||
                  assetsResponse.data.find((a) => a.asset_id === item.asset_id)?.asset_name ||
                  "N/A",
              quantity: item.purchase_quantity || 0,
              price: price,
              discount: quotation.discount_percent || 0,
              taxCode: item.tax_code || "N/A",
              total: price * (item.purchase_quantity || 0),
          };
      });

        // Fetch vendor data
        const vendorCode = quotation.vendor_code || "N/A";
        let vendorName = "N/A";
        if (vendorCode !== "N/A") {
          const vendorResponse = await axios.get("https://yi92cir5p0.execute-api.ap-southeast-1.amazonaws.com/dev/api/purchase_quotation/vendor/list/");
          const vendor = vendorResponse.data.find((v) => v.vendor_code === vendorCode);
          vendorName = vendor ? vendor.vendor_name : "N/A";
        }

        // Fetch employee data
        let employeeName = "N/A";
        if (requestId) {
          const requestResponse = await axios.get("https://yi92cir5p0.execute-api.ap-southeast-1.amazonaws.com/dev/api/prf/list/");
          const request = requestResponse.data.find((r) => r.request_id === requestId);
          if (request) {
            const employeeResponse = await axios.get("https://yi92cir5p0.execute-api.ap-southeast-1.amazonaws.com/dev/api/prf/employees/");
            const employee = employeeResponse.data.find((e) => e.employee_id === request.employee_id);
            employeeName = employee ? `${employee.first_name} ${employee.last_name}` : "N/A";
          }
        }

        // Fetch shipments data
        const shipmentsResponse = await axios.get("https://yi92cir5p0.execute-api.ap-southeast-1.amazonaws.com/dev/api/received-shipment/list/");
        console.log("All shipments:", shipmentsResponse.data); // Debug log
        
        const filteredShipments = shipmentsResponse.data.filter((shipment) => {
          console.log("Shipment ID:", shipment.purchase_id, "Quotation ID:", quotation_id);
          return shipment.purchase_id && String(shipment.purchase_id) === String(quotation_id);
        });
        console.log("Filtered shipments:", filteredShipments); // Debug log

        // Set default shipment ID if available
        setShipments(filteredShipments);
        setQcForm((prev) => ({
          ...prev,
          shipment_id: filteredShipments.length > 0 ? filteredShipments[0].shipment_id : "",
        }));

        // Fetch employees for QC form
        const employeesResponse = await axios.get("https://yi92cir5p0.execute-api.ap-southeast-1.amazonaws.com/dev/api/prf/employees/");
        setEmployees(employeesResponse.data);

        // Update summary data
        setSummaryData({
          totalBeforeDiscount: quotation.total_before_discount || 0,
          discount: quotation.discount_percent || 0,
          freight: quotation.freight || 0,
          tax: quotation.tax || 0,
          totalPaymentDue: quotation.total_payment || 0,
          vendorCode: vendorCode,
          vendorName: vendorName,
          documentNo: quotation.document_no || "N/A",
          deliveryLoc: quotation.delivery_loc || "N/A",
          employeeName: employeeName,
          items: items,
        });

      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load purchase order data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [quotation_id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch purchase quotation data
        const quotationResponse = await axios.get("https://yi92cir5p0.execute-api.ap-southeast-1.amazonaws.com/dev/api/purchase_quotation/list/");
        const quotation = quotationResponse.data.find((q) => q.quotation_id === quotation_id);

        if (!quotation) {
          throw new Error("Purchase quotation not found");
        }

        const purchaseId = quotation.purchase_id; // Get the purchase_id from the quotation
        console.log("Purchase ID from Quotation:", purchaseId);

        // Fetch shipments data
        const shipmentsResponse = await axios.get("https://yi92cir5p0.execute-api.ap-southeast-1.amazonaws.com/dev/api/received-shipment/list/");
        console.log("All shipments:", shipmentsResponse.data); // Debug log

        // Filter shipments by purchase_id
        const filteredShipments = shipmentsResponse.data.filter((shipment) => {
          console.log("Shipment Purchase ID:", shipment.purchase_id, "Purchase ID:", purchaseId);
          return shipment.purchase_id && String(shipment.purchase_id) === String(purchaseId);
        });
        console.log("Filtered shipments:", filteredShipments); // Debug log

        // Set default shipment ID if available
        setShipments(filteredShipments);
        setQcForm((prev) => ({
          ...prev,
          shipment_id: filteredShipments.length > 0 ? filteredShipments[0].shipment_id : "",
        }));

        // Fetch employees for QC form
        const employeesResponse = await axios.get("https://yi92cir5p0.execute-api.ap-southeast-1.amazonaws.com/dev/api/prf/employees/");
        setEmployees(employeesResponse.data);

      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load purchase order data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [quotation_id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        // Step 1: Fetch purchase orders to get purchase_id and quotation_id
        const purchaseOrdersResponse = await axios.get("https://yi92cir5p0.execute-api.ap-southeast-1.amazonaws.com/dev/api/purchase-orders/list/");
        const purchaseOrder = purchaseOrdersResponse.data.find((po) => po.quotation_id === quotation_id);

        if (!purchaseOrder) {
          throw new Error("Purchase order not found for the given quotation ID");
        }

        const purchaseId = purchaseOrder.purchase_id; // Get the purchase_id
        console.log("Purchase ID from Purchase Orders:", purchaseId);

        // Step 2: Fetch shipments data
        const shipmentsResponse = await axios.get("https://yi92cir5p0.execute-api.ap-southeast-1.amazonaws.com/dev/api/received-shipment/list/");
        console.log("All shipments:", shipmentsResponse.data); // Debug log

        // Step 3: Filter shipments by purchase_id
        const filteredShipments = shipmentsResponse.data.filter((shipment) => {
          console.log("Shipment Purchase ID:", shipment.purchase_id, "Purchase ID:", purchaseId);
          return shipment.purchase_id && String(shipment.purchase_id) === String(purchaseId);
        });
        console.log("Filtered shipments:", filteredShipments); // Debug log

        // Step 4: Set default shipment ID if available
        setShipments(filteredShipments);
        setQcForm((prev) => ({
          ...prev,
          shipment_id: filteredShipments.length > 0 ? filteredShipments[0].shipment_id : "",
        }));

        // Step 5: Fetch employees for QC form
        const employeesResponse = await axios.get("https://yi92cir5p0.execute-api.ap-southeast-1.amazonaws.com/dev/api/prf/employees/");
        setEmployees(employeesResponse.data);

      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load purchase order data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [quotation_id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        // Step 1: Fetch purchase orders to get purchase_id and quotation_id
        const purchaseOrdersResponse = await axios.get("https://yi92cir5p0.execute-api.ap-southeast-1.amazonaws.com/dev/api/purchase-orders/list/");
        const purchaseOrder = purchaseOrdersResponse.data.find((po) => po.quotation_id === quotation_id);

        if (!purchaseOrder) {
          throw new Error("Purchase order not found for the given quotation ID");
        }

        const purchaseId = purchaseOrder.purchase_id; // Get the purchase_id
        console.log("Purchase ID from Purchase Orders:", purchaseId);

        // Step 2: Fetch shipments data
        const shipmentsResponse = await axios.get("https://yi92cir5p0.execute-api.ap-southeast-1.amazonaws.com/dev/api/received-shipment/list/");
        console.log("All shipments:", shipmentsResponse.data); // Debug log

        // Step 3: Filter shipments by purchase_id
        const filteredShipments = shipmentsResponse.data.filter((shipment) => {
          console.log("Shipment Purchase ID:", shipment.purchase_id, "Purchase ID:", purchaseId);
          return shipment.purchase_id && String(shipment.purchase_id) === String(purchaseId);
        });
        console.log("Filtered Shipments:", filteredShipments); // Debug log

        // Step 4: Set default shipment ID if available
        setShipments(filteredShipments);
        setQcForm((prev) => ({
          ...prev,
          shipment_id: filteredShipments.length > 0 ? filteredShipments[0].shipment_id : "",
        }));

        // Step 5: Fetch employees for QC form
        const employeesResponse = await axios.get("https://yi92cir5p0.execute-api.ap-southeast-1.amazonaws.com/dev/api/prf/employees/");
        setEmployees(employeesResponse.data);

      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load purchase order data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [quotation_id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        // Step 1: Fetch purchase orders to get purchase_id and quotation_id
        const purchaseOrdersResponse = await axios.get("https://yi92cir5p0.execute-api.ap-southeast-1.amazonaws.com/dev/api/purchase-orders/list/");
        const purchaseOrder = purchaseOrdersResponse.data.find((po) => po.quotation_id === quotation_id);

        if (!purchaseOrder) {
          throw new Error("Purchase order not found for the given quotation ID");
        }

        const purchaseId = purchaseOrder.purchase_id; // Get the purchase_id
        console.log("Purchase ID from Purchase Orders:", purchaseId);

        // Step 2: Fetch shipments data
        const shipmentsResponse = await axios.get("https://yi92cir5p0.execute-api.ap-southeast-1.amazonaws.com/dev/api/received-shipment/list/");
        console.log("All shipments:", shipmentsResponse.data); // Debug log

        // Step 3: Filter shipments by purchase_id
        const filteredShipments = shipmentsResponse.data.filter((shipment) => {
          return shipment.purchase_id && String(shipment.purchase_id) === String(purchaseId);
        });

        // Print only the shipment_id values
        filteredShipments.forEach((shipment) => {
          console.log("Shipment ID:", shipment.shipment_id);
        });

        // Step 4: Set filtered shipments and default shipment_id
        setShipments(filteredShipments);
        setQcForm((prev) => ({
          ...prev,
          shipment_id: filteredShipments.length > 0 ? filteredShipments[0].shipment_id : "",
        }));

    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load shipment data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [quotation_id]);

  useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      // Step 1: Fetch purchase orders to get purchase_id using quotation_id
      const purchaseOrdersResponse = await axios.get("https://yi92cir5p0.execute-api.ap-southeast-1.amazonaws.com/dev/api/purchase-orders/list/");
      const purchaseOrder = purchaseOrdersResponse.data.find((po) => po.quotation_id === quotation_id);

      if (!purchaseOrder) {
        throw new Error("Purchase order not found for the given quotation ID");
      }

      const purchaseId = purchaseOrder.purchase_id; // Get the purchase_id
      console.log("Purchase ID from Purchase Orders:", purchaseId);

      // Step 2: Fetch shipments data
      const shipmentsResponse = await axios.get("https://yi92cir5p0.execute-api.ap-southeast-1.amazonaws.com/dev/api/received-shipment/list/");
      console.log("All shipments:", shipmentsResponse.data); // Debug log

      // Step 3: Filter shipments by purchase_id
      const filteredShipments = shipmentsResponse.data.filter((shipment) => {
        console.log("Shipment Purchase ID:", shipment.purchase_id, "Purchase ID:", purchaseId);
        return shipment.purchase_id && String(shipment.purchase_id) === String(purchaseId);
      });

      // Print only the shipment_id values
      filteredShipments.forEach((shipment) => {
        console.log("Shipment ID:", shipment.shipment_id);
      });

      // Step 4: Set filtered shipments and default shipment_id
      setShipments(filteredShipments);
      setQcForm((prev) => ({
        ...prev,
        shipment_id: filteredShipments.length > 0 ? filteredShipments[0].shipment_id : "",
      }));

    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load shipment data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [quotation_id]);

  useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      // Step 1: Fetch purchase orders to get purchase_id using quotation_id
      const purchaseOrdersResponse = await axios.get("https://yi92cir5p0.execute-api.ap-southeast-1.amazonaws.com/dev/api/purchase-orders/list/");
      const purchaseOrder = purchaseOrdersResponse.data.find((po) => po.quotation_id === quotation_id);

      if (!purchaseOrder) {
        throw new Error("Purchase order not found for the given quotation ID");
      }

      const purchaseId = purchaseOrder.purchase_id; // Get the purchase_id
      console.log("Purchase ID from Purchase Orders:", purchaseId);

      // Step 2: Fetch shipments data
      const shipmentsResponse = await axios.get("https://yi92cir5p0.execute-api.ap-southeast-1.amazonaws.com/dev/api/received-shipment/list/");
      console.log("All shipments:", shipmentsResponse.data); // Debug log

      // Step 3: Filter shipments by purchase_id
      const filteredShipments = shipmentsResponse.data.filter((shipment) => {
        console.log("Shipment Purchase ID:", shipment.purchase_id, "Purchase ID:", purchaseId);
        return shipment.purchase_id && String(shipment.purchase_id) === String(purchaseId);
      });
      console.log("Filtered Shipments:", filteredShipments); // Debug log

      // Step 4: Set filtered shipments and default shipment_id
      setShipments(filteredShipments);
      setQcForm((prev) => ({
        ...prev,
        shipment_id: filteredShipments.length > 0 ? filteredShipments[0].shipment_id : "",
      }));

    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load shipment data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [quotation_id]);

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const handleQCSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setError("");
      console.log("Submitting QC with:", qcForm); // Debug log

      if (shipments.length === 0) {
        throw new Error("No shipments available for this purchase order");
      }
      if (!qcForm.shipment_id) {
        throw new Error("Please select a shipment");
      }
      if (!qcForm.inspection_result) {
        throw new Error("Please select an inspection result");
      }
      if (!qcForm.employee_id) {
        throw new Error("Please select an inspector");
      }

      const payload = {
        inspection_date: qcForm.inspection_date,
        inspection_result: qcForm.inspection_result,
        remarks: qcForm.remarks || "No remarks",
        shipment_id: qcForm.shipment_id,
        employee_id: qcForm.employee_id
      };

      const response = await axios.post(
        "https://yi92cir5p0.execute-api.ap-southeast-1.amazonaws.com/dev/api/batch-inspection/create/",
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      
      alert("Quality Check submitted successfully!");
      setShowQCModal(false);
      setQcForm({
        inspection_date: new Date().toISOString().split("T")[0],
        inspection_result: "",
        remarks: "",
        shipment_id: shipments.length > 0 ? shipments[0].shipment_id : "",
        employee_id: ""
      });
    } catch (error) {
      console.error("QC submission error:", error);
      setError(error.message || "Failed to submit quality check");
    }
  };

  const ItemDetailModal = ({ item, onClose }) => {
    if (!item) return null;

    return (
      <div className="purchord-modal-overlay" onClick={onClose}>
        <div className="purchord-modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="purchord-modal-close" onClick={onClose}>×</button>
          <div className="purchord-modal-header">
            <h2>{item.name}</h2>
          </div>
          <div className="purchord-modal-body">
            <div className="purchord-modal-details">
              <div className="purchord-modal-info">
                <h3>Material:</h3>
                <p>{item.material}</p>
              </div>
              <div className="purchord-modal-pricing">
                <div className="purchord-modal-price-item">
                  <span>Quantity</span>
                  <span>{item.quantity}</span>
                </div>
                <div className="purchord-modal-price-item">
                  <span>Unit Price</span>
                  <span>₱{item.price}</span>
                </div>
                <div className="purchord-modal-price-item">
                  <span>Discount</span>
                  <span>{item.discount}%</span>
                </div>
                <div className="purchord-modal-price-item">
                  <span>Tax Code</span>
                  <span>{item.taxCode}</span>
                </div>
                <div className="purchord-modal-price-item total">
                  <span>Total</span>
                  <span>₱{item.total}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="purchord">
      <div className="purchord-scrollable-wrapper">
      <div className="body-content-container">
  <div className="purchord-header">
    <button className="purchord-back-button" onClick={onClose}>← Back</button>
    <h2 className="purchord-title">Purchase Order</h2>
    <button 
      className="purchord-qc-button" 
      onClick={() => setShowQCModal(true)}
    >
      {loading ? "Loading..." : "Quality Check"}
    </button>
  </div>
        

        <div className="purchord-main-container">
          <div className="purchord-details-container">
            <div className="purchord-customer-container">
              <p><strong>Customer Name:</strong> <span>{summaryData.employeeName}</span></p>
              <p><strong>Customer Address:</strong> <span>{summaryData.deliveryLoc}</span></p>
              <p><strong>RFQ Number:</strong> {quotation_id}</p>
              <p><strong>Order Date:</strong> {order_date}</p>
              <p><strong>Delivery Date:</strong> {delivery_date}</p>
            </div>
            <div className="purchord-supplier-container">
              <p><strong>Vendor Name:</strong> {summaryData.vendorName}</p>
              <p><strong>Status:</strong> {status}</p>
              <p><strong>Document Date:</strong> {document_date}</p>
              <p><strong>Document No.:</strong> {summaryData.documentNo}</p>
            </div>
          </div>

          <div className="purchord-items-container">
            {summaryData.items?.length > 0 ? (
              summaryData.items.map((item) => (
                <div key={item.id} className="purchord-item-card">
                  <div className="purchord-item-details" onClick={() => handleItemClick(item)}>
                    <h3>{item.name}</h3>
                    <p><strong>Quantity:</strong> {item.quantity}</p>
                    <p><strong>Unit Price:</strong> ₱{item.price}</p>
                    <p><strong>Discount:</strong> {item.discount}%</p>
                    <p><strong>Tax Code:</strong> {item.taxCode}</p>
                    <p><strong>Total:</strong> ₱{item.total}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>No items available</p>
            )}
          </div>

          <div className="purchord-summary">
            <p><strong>Total Before Discount:</strong> ₱{summaryData.totalBeforeDiscount}</p>
            <p><strong>Discount ({summaryData.discount}%):</strong> ₱{(summaryData.totalBeforeDiscount * (summaryData.discount / 100)).toFixed(2)}</p>
            <p><strong>Freight:</strong> ₱{summaryData.freight}</p>
            <p><strong>Tax:</strong> ₱{summaryData.tax}</p>
            <h3><strong>Total Payment Due:</strong> ₱{summaryData.totalPaymentDue}</h3>
          </div>
        </div>

        {selectedItem && (
          <ItemDetailModal 
            item={selectedItem} 
            onClose={() => setSelectedItem(null)} 
          />
        )}

        {showQCModal && (
          <div className="purchord-modal-overlay" onClick={() => setShowQCModal(false)}>
            <div className="purchord-modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="purchord-modal-close" onClick={() => setShowQCModal(false)}>×</button>
              <h2>Quality Check</h2>
              {error && <div className="error-message">{error}</div>}
              <form onSubmit={handleQCSubmit}>
                <div className="purchord-qc-form">
                  <div className="label-req">
                  <div className="form-group"></div>
                    <label>Inspection Date</label>
                    <input
                      type="date"
                      value={qcForm.inspection_date}
                      onChange={(e) => setQcForm({...qcForm, inspection_date: e.target.value})}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <div className="label-req">
                    <label>Shipment ID</label></div>
                    {shipments.length > 0 ? (
                      <select
                        value={qcForm.shipment_id}
                        onChange={(e) => setQcForm({...qcForm, shipment_id: e.target.value})}
                        required
                      >
                        <option value="">Select Shipment</option>
                        {shipments.map(shipment => (
                          <option key={shipment.shipment_id} value={shipment.shipment_id}>
                            {shipment.shipment_id} - {new Date(shipment.shipment_date).toLocaleDateString()}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div>
                        <input 
                          type="text" 
                          value="No shipment available" 
                          readOnly 
                        />
                        <p className="error-message">No shipments found for this purchase order</p>
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <div className="label-req">
                    <label>Inspector</label></div>
                    <select
                      value={qcForm.employee_id}
                      onChange={(e) => setQcForm({...qcForm, employee_id: e.target.value})}
                      required
                    >
                      <option value="">Select Inspector</option>
                      {employees.map(employee => (
                        <option key={employee.employee_id} value={employee.employee_id}>
                          {employee.first_name} {employee.last_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <div className="label-req">
                    <label>Inspection Result</label></div>
                    <select
                      value={qcForm.inspection_result}
                      onChange={(e) => setQcForm({...qcForm, inspection_result: e.target.value})}
                      required
                    >
                      <option value="">Select Result</option>
                      <option value="Pass">Pass</option>
                      <option value="Fail">Fail</option>
                      
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Remarks</label>
                    <textarea
                      value={qcForm.remarks}
                      onChange={(e) => setQcForm({...qcForm, remarks: e.target.value})}
                      rows={3}
                    />
                  </div>

                  <div className="form-buttons">
                  <button 
  type="button"
  className="cancel-btn"
  onClick={() => setShowQCModal(false)}
>
  Cancel
</button>
<button 
  type="submit"
  className="submit-btn"
  disabled={!qcForm.shipment_id || !qcForm.inspection_result || !qcForm.employee_id}
>
  Submit Quality Check
</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

export default PurchaseOrderUI;