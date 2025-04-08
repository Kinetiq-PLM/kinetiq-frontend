import React, { useState, useEffect } from "react";
import "../styles/PurchaseAPInvoice.css";
import PurchaseOrders from "./PurchaseOrders"; // Import the PurchaseOrders component

// Define the formatDate function
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const PurchaseOrdStatBody = () => {
  const [purchaseOrders, setPurchaseOrders] = useState([]); // State to store purchase orders
  const [selectedOrder, setSelectedOrder] = useState(null); // State to store the selected order
  const [loading, setLoading] = useState(true); // State to manage loading status
  const [error, setError] = useState(null); // State to handle errors
  const [orderDetails, setOrderDetails] = useState(null); // State to store fetched order details

  // Fetch purchase orders from the API
  useEffect(() => {
    const fetchPurchaseOrders = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/purchase-orders/list/");
        if (!response.ok) {
          throw new Error("Failed to fetch purchase orders");
        }
        const data = await response.json();
        setPurchaseOrders(data);
      } catch (error) {
        console.error("Error fetching purchase orders:", error);
        setError("Failed to load purchase orders");
      } finally {
        setLoading(false);
      }
    };

    fetchPurchaseOrders();
  }, []);

  const handleBack = () => {
    setSelectedOrder(null); // Reset the selected order
    setOrderDetails(null); // Reset the fetched order details
  };

  const handleRowClick = async (order) => {
    console.log("Selected Order (PurchaseOrdStat):", order); // Debugging
    setSelectedOrder(order); // Set the clicked order
  
    try {
      // Fetch the list of purchase orders
      const response = await fetch("http://127.0.0.1:8000/api/purchase-orders/list/");
      if (!response.ok) {
        throw new Error("Failed to fetch purchase orders");
      }
      const data = await response.json();
  
      // Find the specific order by purchase_id
      const orderDetails = data.find((item) => item.purchase_id === order.purchase_id);
      if (!orderDetails) {
        throw new Error("Purchase order not found");
      }
  
      console.log("Fetched Order Details:", orderDetails); // Debugging
      setOrderDetails(orderDetails); // Store the fetched order details
    } catch (error) {
      console.error("Error fetching order details:", error);
      setError("Failed to load order details");
    }
  };
  
  if (orderDetails) {
    // If order details are fetched, render the PurchaseOrders component
    return (
      <PurchaseOrders
        quotation_id={orderDetails.quotation_id}
        order_date={orderDetails.order_date}
        delivery_date={orderDetails.delivery_date}
        vendor_name={orderDetails.vendor_name}
        status={orderDetails.status}
        document_date={orderDetails.document_date}
        document_no={orderDetails.document_no}
        delivery_loc={orderDetails.delivery_loc}
        onClose={handleBack}
      />
    );
  }

  return (
    <div className="apinvoice">
      <div className="body-content-container">
        <div className="apinvoice-header">
          <button className="purchord-back-button" onClick={handleBack}>← Back</button>
        </div>

        <div className="apinvoice-content">
          <div className="apinvoice-table">
            <div className="apinvoice-table-header">
              <div className="apinvoice-checkbox"><input type="checkbox" /></div>
              <div>Purchase Order</div>
              <div>Ref: RFQ</div>
              <div>Status</div>
              <div>Delivery Date</div>
              <div>Order Date</div>
            </div>

            <div className="apinvoice-table-rows">
              {purchaseOrders.map((order) => (
                <div
                  className="apinvoice-row"
                  key={order.purchase_id}
                  onClick={() => handleRowClick(order)} // Handle row click
                  style={{ cursor: "pointer" }} // Add pointer cursor for better UX
                >
                  <div className="apinvoice-checkbox">
                    <input type="checkbox" />
                  </div>
                  <div>{order.purchase_id}</div>
                  <div>{order.quotation_id}</div>
                  <div>
                    <span className={`status-${order.status.toLowerCase()}`}>{order.status}</span>
                  </div>
                  <div>{order.delivery_date ? formatDate(order.delivery_date) : "N/A"}</div>
                  <div>{order.order_date ? formatDate(order.order_date) : "N/A"}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrdStatBody;