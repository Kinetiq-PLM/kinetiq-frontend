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
  items = [], // Default value for items
  onClose,
}) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [summaryData, setSummaryData] = useState({
    totalBeforeDiscount: 0,
    discount: 0,
    freight: 0,
    tax: 0,
    totalPaymentDue: 0,
    vendorCode: "N/A", // Default value for vendor_code
    vendorName: "N/A", // Default value for vendor_name
    documentNo: "N/A", // Default value for document_no
  });
  
  useEffect(() => {
    const fetchSummaryData = async () => {
      try {
        // Fetch quotation data
        const response = await axios.get("http://127.0.0.1:8000/api/purchase_quotation/list/");
        const quotation = response.data.find((q) => q.quotation_id === quotation_id);
  
        if (quotation) {
          const requestId = quotation.request_id;
  
          // Fetch quotation content using request_id
          const quotationContentResponse = await axios.get("http://127.0.0.1:8000/api/quotation-content/list/");
          const quotationContent = quotationContentResponse.data.filter((qc) => qc.request_id === requestId);
  
          // Fetch materials and assets
          const materialsResponse = await axios.get("http://127.0.0.1:8000/api/quotation-content/materials/list/");
          const assetsResponse = await axios.get("http://127.0.0.1:8000/api/quotation-content/assets/list/");
          const materials = materialsResponse.data;
          const assets = assetsResponse.data;
  
          // Map quotation content to display data
          const items = quotationContent.map((item) => {
            const material = materials.find((m) => m.material_id === item.material_id);
            const asset = assets.find((a) => a.asset_id === item.asset_id);
  
            return {
              id: item.id,
              name: material ? material.material_name : asset ? asset.asset_name : "N/A",
              quantity: item.purchase_quantity || 0,
              price: material?.cost_per_unit || asset?.purchase_price || 0,
              discount: quotation.discount_percent || 0, // Use discount from quotation
              taxCode: item.tax_code || "N/A",
              total: item.unit_price || 0, // Set total equal to unit_price
            };
          });
  
          // Fetch vendor name using vendor_code
          const vendorCode = quotation.vendor_code || "N/A";
          let vendorName = "N/A";
          if (vendorCode !== "N/A") {
            const vendorResponse = await axios.get("http://127.0.0.1:8000/api/purchase_quotation/vendor/list/");
            const vendor = vendorResponse.data.find((v) => v.vendor_code === vendorCode);
            vendorName = vendor ? vendor.vendor_name : "N/A";
          }
  
          // Fetch employee_id using request_id
          let employeeName = "N/A";
          if (requestId) {
            const requestResponse = await axios.get(`http://127.0.0.1:8000/api/prf/list/`);
            const request = requestResponse.data.find((r) => r.request_id === requestId);
  
            if (request) {
              const employeeId = request.employee_id;
  
              // Fetch employee_name using employee_id
              const employeeResponse = await axios.get(`http://127.0.0.1:8000/api/prf/employees/`);
              const employee = employeeResponse.data.find((e) => e.employee_id === employeeId);
              employeeName = employee ? `${employee.first_name} ${employee.last_name}` : "N/A";
            }
          }
  
          console.log("Employee Name:", employeeName); // Debugging
  
          // Update summaryData
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
            employeeName: employeeName, // Add employee_name to summaryData
            items: items, // Add mapped items
          });
        }
      } catch (error) {
        console.error("Error fetching summary data or vendor/employee data:", error);
      }
    };
  
    fetchSummaryData();
  }, [quotation_id]);

  const handleItemClick = (item) => {
    setSelectedItem(item);
    console.log("Item clicked:", item);
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
            <div className="purchord-modal-image-container">
              <img src={item.image} alt={item.name} className="purchord-modal-image" />
            </div>
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
      <div className="body-content-container">
      <button className="purchord-back-button" onClick={onClose}>← Back</button>
        <h2 className="purchord-title">Purchase Order</h2>

        {/* Display the fetched data */}
        <div className="purchord-main-container">
          <div className="purchord-details-container">
          <div className="purchord-customer-container">
          <p><strong>Customer Name:</strong> <span> {summaryData.employeeName} </span></p>
          <p><strong>Customer Address:</strong> <span> {summaryData.deliveryLoc}</span></p>
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
  

        {/* Items List */}
        <div className="purchord-items-container">
  {summaryData.items && summaryData.items.length > 0 ? (
    summaryData.items.map((item) => (
      <div key={item.id} className="purchord-item-card">
        <div className="purchord-item-details" onClick={() => handleItemClick(item)}>
        <img src={item.image} alt={item.name} className="purchord-item-image" />
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

        {/* Summary Section */}
        <div className="purchord-summary">
          <p><strong>Total Before Discount:</strong> ₱{summaryData.totalBeforeDiscount}</p>
          <p><strong>Discount ({summaryData.discount}%):</strong> ₱{(summaryData.totalBeforeDiscount * (summaryData.discount / 100)).toFixed(2)}</p>
          <p><strong>Freight:</strong> ₱{summaryData.freight}</p>
          <p><strong>Tax:</strong> ₱{summaryData.tax}</p>
          <h3><strong>Total Payment Due:</strong> ₱{summaryData.totalPaymentDue}</h3>
        </div>
      </div>
      </div>

      {/* Item Detail Modal */}
      <ItemDetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  );
};

export default PurchaseOrderUI;