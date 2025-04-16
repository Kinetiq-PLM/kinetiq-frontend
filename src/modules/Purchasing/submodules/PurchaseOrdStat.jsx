import React, { useState, useEffect } from "react";
import "../styles/PurchaseAPInvoice.css";
import "../styles/PurchaseOrdStat.css";
import PurchaseOrders from "./PurchaseOrders";
import PurchaseOrderEdit from "./PurchaseOrdedit"; // Import the edit component

// Define the formatDate function
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const PurchaseOrdStatBody = () => {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null); // State for the order being edited

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
    setSelectedOrder(null);
    setOrderDetails(null);
  };

  const handleRowClick = async (order) => {
    console.log("Selected Order (PurchaseOrdStat):", order);
    setSelectedOrder(order);
  
    try {
      const response = await fetch("http://127.0.0.1:8000/api/purchase-orders/list/");
      if (!response.ok) {
        throw new Error("Failed to fetch purchase orders");
      }
      const data = await response.json();
  
      const orderDetails = data.find((item) => item.purchase_id === order.purchase_id);
      if (!orderDetails) {
        throw new Error("Purchase order not found");
      }
  
      console.log("Fetched Order Details:", orderDetails);
      setOrderDetails(orderDetails);
    } catch (error) {
      console.error("Error fetching order details:", error);
      setError("Failed to load order details");
    }
  };

  const handleEditClick = (order, e) => {
    e.stopPropagation(); // Prevent row click from triggering
    setEditingOrder(order);
  };

  const handleUpdateSuccess = (updatedOrder) => {
    // Update the local state with the edited order
    setPurchaseOrders(prevOrders =>
      prevOrders.map(order =>
        order.purchase_id === updatedOrder.purchase_id ? updatedOrder : order
      )
    );
    setEditingOrder(null);
  };

  if (orderDetails) {
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
             
              <div>Purchase Order</div>
              <div>Ref: RFQ</div>
              <div>Status</div>
              <div>Delivery Date</div>
              <div>Order Date</div>
              <div>Actions</div> {/* New column for actions */}
            </div>

            <div className="apinvoice-table-rows">
              {purchaseOrders.map((order) => (
                <div
                  className="apinvoice-row"
                  key={order.purchase_id}
                  onClick={() => handleRowClick(order)}
                  style={{ cursor: "pointer" }}
                >
                  <div>{order.purchase_id}</div>
                  <div>{order.quotation_id}</div>
                  <div>
                    <span className={`status-${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </div>
                  <div>{order.delivery_date ? formatDate(order.delivery_date) : "N/A"}</div>
                  <div>{order.order_date ? formatDate(order.order_date) : "N/A"}</div>
                  <div className="apinvoice-actions">
                    <button 
                      className="apinvoice-edit-button"
                      onClick={(e) => handleEditClick(order, e)}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editingOrder && (
        <PurchaseOrderEdit
          purchaseOrder={editingOrder}
          onClose={() => setEditingOrder(null)}
          onSuccess={handleUpdateSuccess}
        />
      )}
    </div>
  );
};

export default PurchaseOrdStatBody;