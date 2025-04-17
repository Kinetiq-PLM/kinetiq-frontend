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

  const [selectedDate, setSelectedDate] = useState("Last 30 days");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showStatusFilter, setShowStatusFilter] = useState(false);

  const timeOptions = [
    "Last 30 days",
    "Last 20 days",
    "Last 10 days",
    "Last 3 days",
    "Last 1 day"
  ];
  const statusOptions = [
    "All",
    "Approved",
    "Pending",
    "Completed",
    "Rejected"
  ];

  const handleDateOptionSelect = (option) => {
    setSelectedDate(option);
    setShowDateDropdown(false);
  };
  const handleStatusSelect = (status) => {
    setSelectedStatus(status);
    setShowStatusFilter(false);
  };
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

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

  const handleBackToDashboard = () => {
    const event = new CustomEvent('purchasing-back-to-dashboard');
    window.dispatchEvent(event);
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
        onClose={handleBackToDashboard}
      />
    );
  }

  return (
    <div className="purchordstat">
      <div className="body-content-container">
        <div className="purchordstat-header">
          <button className="purchordstat-back" onClick={handleBackToDashboard}>← Back</button>
          <div className="purchordstat-filters" style={{ marginLeft: 'auto' }}>
            <div className="purchordstat-date-filter">
              <div className="date-display" onClick={() => setShowDateDropdown(!showDateDropdown)}>
                <span>{selectedDate}</span>
                <span>▼</span>
              </div>
              {showDateDropdown && (
                <div className="date-options-dropdown">
                  {timeOptions.map(option => (
                    <div
                      key={option}
                      className="date-option"
                      onClick={() => handleDateOptionSelect(option)}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="purchordstat-filter-btn" onClick={() => setShowStatusFilter(!showStatusFilter)}>
              <span>Filter by: {selectedStatus}</span>
              <span>▼</span>
              {showStatusFilter && (
                <div className="status-options-dropdown">
                  {statusOptions.map(status => (
                    <div
                      key={status}
                      className="status-option"
                      onClick={() => handleStatusSelect(status)}
                    >
                      {status}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="purchordstat-search">
              <input
                type="text"
                placeholder="Search by PO, RFQ, Status, Date"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>
        </div>
        {/* --- TABLE SECTION UPDATED --- */}
        <div className="purchordstat-content">
          <div className="purchordstat-table-header">
            <div className="purchordstat-checkbox"><input type="checkbox" /></div>
            <div>Purchase Order</div>
            <div>Ref: RFQ</div>
            <div>Status</div>
            <div>Order Date</div>
            <div>Delivery Date</div>
            <div>Actions</div>
          </div>
          <div className="purchordstat-table-scrollable">
            <div className="purchordstat-table-rows">
              {purchaseOrders.length > 0 ? purchaseOrders.map((order) => (
                <div
                  key={order.purchase_id}
                  className="purchordstat-row"
                  onClick={() => handleRowClick(order)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="purchordstat-checkbox"><input type="checkbox" /></div>
                  <div>{order.purchase_id}</div>
                  <div>{order.quotation_id}</div>
                  <div>
                    <span className={`status-${order.status?.toLowerCase()}`}>{order.status}</span>
                  </div>
                  <div>{order.order_date ? formatDate(order.order_date) : "N/A"}</div>
                  <div>{order.delivery_date ? formatDate(order.delivery_date) : "N/A"}</div>
                  <div className="purchordstat-actions">
                    <button
                      className="purchordstat-edit-button"
                      onClick={(e) => handleEditClick(order, e)}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              )) : (
                <div className="purchordstat-row">
                  <div style={{ gridColumn: 'span 7', textAlign: 'center', width: '100%' }}>
                    No purchase orders found
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* --- END TABLE SECTION UPDATED --- */}
        {/* Edit Modal */}
        {editingOrder && (
          <PurchaseOrderEdit
            purchaseOrder={editingOrder}
            onClose={() => setEditingOrder(null)}
            onSuccess={handleUpdateSuccess}
          />
        )}
      </div>
    </div>
  );
};

export default PurchaseOrdStatBody;