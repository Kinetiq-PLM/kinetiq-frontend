"use client"

import { useState, useEffect } from "react"
import "../styles/ServiceAnalysis.css"
import "../styles/SupportServices.css"
import ServiceAnalysisIcon from "/icons/SupportServices/ServiceAnalysisIcon.png"
import Table from "../components/ServiceAnalysis/Table"
import UpdateAnalysisModal from "../components/ServiceAnalysis/UpdateAnalysisModal"
import AddServiceAnalysisModal from "../components/ServiceAnalysis/AddServiceAnalysisModal"
import AddItemModal from "../components/ServiceAnalysis/AddItemModal"
import EditItemModal from "../components/ServiceAnalysis/EditItemModal"
import ViewInventoryModal from "../components/ServiceAnalysis/ViewInventoryModal"
import SearchIcon from "/icons/SupportServices/SearchIcon.png"
import CalendarInputIcon from "/icons/SupportServices/CalendarInputIcon.png"

import { GET } from "../api/api"
import { POST } from "../api/api"
import { PATCH } from "../api/api"

const ServiceAnalysis = () => {
  // State for analyses
  const [analyses, setAnalyses] = useState([])
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showAddItemModal, setShowAddItemModal] = useState(false)
  const [showEditItemModal, setShowEditItemModal] = useState(false)
  const [showViewInventoryModal, setShowViewInventoryModal] = useState(false)
  const [selectedAnalysis, setSelectedAnalysis] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterOption, setFilterOption] = useState("Filter by")
  const [showFilterOptions, setShowFilterOptions] = useState(false)
  const [activeTab, setActiveTab] = useState("General")

  // After Analysis state
  const [afterAnalysisInfo, setAfterAnalysisInfo] = useState({
    afterAnalysisId: "",
    analysisId: "",
    serviceStatus: "",
    serviceDate: "",
    description: "",
  })

  // Service Billing state
  const [serviceBillingInfo, setServiceBillingInfo] = useState({
    billingId: "",
    orderId: "",
    initialBillingAmount: "",
    totalOrderPrice: "",
    outsourceFee: "",
    totalPayable: "",
    billingStatus: "",
    datePaid: "",
  })

  // Delivery Order state
  const [deliveryOrderInfo, setDeliveryOrderInfo] = useState({
    deliveryOrderId: "",
    customerId: "",
    serviceOrderId: "",
    name: "",
    deliveryDate: "",
    address: "",
    deliveryStatus: "",
  })

  // Service order items
  const [serviceOrderItems, setServiceOrderItems] = useState([])

  // Customer information
  const [customerInfo, setCustomerInfo] = useState({
    customerId: "",
    name: "",
    address: "",
    phoneNumber: "",
    emailAddress: "",
    productId: "",
    productName: "",
    contractId: "",
    terminationDate: "",
    requestType: "",
  })

  // Service order information
  const [serviceOrderInfo, setServiceOrderInfo] = useState({
    serviceOrderId: "",
    orderDate: "",
    orderTotalPrice: "",
  })

  const fetchAnalyses = async () => {
    try {
      const data = await GET("service-analyses/");
      setAnalyses(data);
    } catch (error) {
      console.error("Error fetching analyses:", error)
    }
  }

  useEffect(() => {
    fetchAnalyses();
  }, []);

  const handleRowClick = async (analysis) => {
    try {
      const data = await GET(`service-analyses/${analysis.analysis_id}`); 
      console.log("Fetched data:", data);

      setSelectedAnalysis(data);

      setCustomerInfo({
        customerId: data.customer?.customer_id || "",
        name: data.customer?.name || "",
        address: data.customer ? `${data.customer.address_line1 || ""} ${data.customer.address_line2 || ""}`.trim() : "",
        phoneNumber: data.customer?.phone_number || "",
        emailAddress: data.customer?.email_address || "",
        productId: data.product?.product_id,
        productName: data.product?.product_name,
        contractId: data.contract?.contract_id,
        terminationDate: data.contract?.end_date,
        requestType: data.service_request?.request_type,
      })

      fetchOrder(data.analysis_id);

    } catch (error) {
      console.error("Error fetching service analysis details:", error);
    }
  };
  
  const fetchOrder = async (analysisId) => {
    try {
      const data = await GET(`orders/${analysisId}/`);
      const rawDate = data?.order_date;
  
      let formattedDate = "";
      if (rawDate) {
        const date = new Date(rawDate);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const seconds = String(date.getSeconds()).padStart(2, "0");
  
        formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      }
  
      setServiceOrderInfo({
        serviceOrderId: data?.service_order_id || "",
        orderDate: formattedDate,
        orderTotalPrice: data?.order_total_price || "",
      });

      fetchServiceOrderItems(data?.service_order_id);

    } catch (error) {
      console.error("Error fetching order:", error);
      setServiceOrderInfo({
        serviceOrderId: "",
        orderDate: "",
        orderTotalPrice: ""
      });
    }
  };

  const fetchServiceOrderItems = async (serviceOrderId) => {
    try {
      const data = await GET(`order-items/${serviceOrderId}/`);
      setServiceOrderItems(data)
    } catch (error) {
      console.error("Error fetching order items:", error);
    }
  };
  

  // Handle view analysis
  const handleViewAnalysis = (analysis) => {
      setSelectedAnalysis(analysis)
      setShowUpdateModal(true)
  }

  // Handle add new analysis
  const handleAddAnalysis = () => {
    setShowAddModal(true)
  }

  // Handle update analysis
  const handleUpdateAnalysis = async (analysisData) => {
    const analysisId = analysisData.analysis_id;
    if (!analysisId) {
      console.error("Error: analysis_id is undefined");
      return;
    }
    console.log("Updating analysis:", analysisData)
    try {
      await PATCH(`service-analyses/${analysisId}/update/`, analysisData);
      setShowUpdateModal(false);
      fetchAnalyses();
    } catch (error) {
        console.error("Error updating service analysis:", error.message);
    }
  }

  // Handle create analysis
  const handleCreateAnalysis = async (analysisData) => {
      console.log("Creating analysis:", analysisData)
      try {
        const data = await POST("/service-analyses/", analysisData);
        console.log("Analysis created successfully:", data);
        setShowAddModal(false);
        fetchAnalyses();
    } catch (error) {
        console.error("Error submitting analysis:", error.message);
    }
  }

  const handleAddOrder = async () => {
    const orderData = {
      analysis_id: selectedAnalysis.analysis_id,
      customer_id: customerInfo.customerId,
    }

    console.log("Creating analysis:", orderData)
      try {
        const data = await POST("/service-order/", orderData);
        console.log("Service order created successfully:", data);
        fetchOrder(selectedAnalysis.analysis_id);
    } catch (error) {
        console.error("Error submitting service order:", error.message);
    }
  }

  // Handle add item
  const handleAddItem = () => {
    if (activeTab === "Service Order") {
      setShowAddItemModal(true)
    }
  }

  const handleCreateOrderItem = async (orderItemData) => {
    console.log("Creating order item:", orderItemData)
    try {
      const data = await POST("service-order-item/", orderItemData);
      console.log("Order item created successfully:", data);
      setShowAddItemModal(false);
      fetchServiceOrderItems(serviceOrderInfo.serviceOrderId);
      
      try {
        const data = await GET(`orders/${selectedAnalysis.analysis_id}/`);
    
        setServiceOrderInfo({
          ...serviceOrderInfo,
          orderTotalPrice: data?.order_total_price || "",
        });

      } catch (error) {
        console.error("Error fetching order:", error);
        setServiceOrderInfo({
          ...serviceOrderInfo,
          orderTotalPrice: ""
        });
      }

  } catch (error) {
      console.error("Error submitting order item:", error.message);
  }
}

  // Handle edit item
  const handleEditItem = (item) => {
    if (activeTab === "Service Order") {
      setSelectedItem(item)
      setShowEditItemModal(true)
    }
  }

  // Handle view inventory
  const handleViewInventory = () => {
    if (activeTab === "Service Order") {
      setShowViewInventoryModal(true)
    }
  }

  const filterOptions = [
    { value: "all", label: "All" },
    { value: "scheduled", label: "Scheduled" },
    { value: "done", label: "Done" },
  ]

  // Handle filter selection
  const handleFilterSelect = (option) => {
    setFilterOption(option)
    setShowFilterOptions(false)
  }

  // Filter analyses based on search query and filter option
  const filteredAnalyses = analyses.filter((analysis) => {
    const matchesSearch =
    searchQuery === "" ||
    analysis.analysis_id?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
    analysis.service_request?.service_request_id?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
    (`${analysis.technician?.first_name ?? ""} ${analysis.technician?.last_name ?? ""}`
    .toLowerCase()
    .includes(searchQuery.toLowerCase()));

    if (filterOption !== "all") {
      if (filterOption === "scheduled" && analysis.analysis_status !== "Scheduled") return false;
      if (filterOption === "done" && analysis.analysis_status !== "Done") return false;
    }
  
    return matchesSearch;
  });

  return (
    <div className="serv servanal">
      <div className="body-content-container">
        <div className="header">
          <div className="icon-container">
            <img src={ServiceAnalysisIcon || "/placeholder.svg?height=24&width=24"} alt="Service Analysis" />
          </div>
          <div className="title-container">
            <h2>Service Analysis</h2>
            <p className="subtitle">Optimizing Service Operations Through Detailed Analysis</p>
          </div>
        </div>

        <div className="divider"></div>

        <div className="fixed-tabs-container">
          <div className="tabs-container">
            <div className={`tab ${activeTab === "General" ? "active" : ""}`} onClick={() => setActiveTab("General")}>
              General
            </div>
            <div
              className={`tab ${activeTab === "Service Order" ? "active" : ""}`}
              onClick={() => setActiveTab("Service Order")}
            >
              Service Order
            </div>
            <div
              className={`tab ${activeTab === "Delivery Order" ? "active" : ""}`}
              onClick={() => setActiveTab("Delivery Order")}
            >
              Delivery Order
            </div>
            <div
              className={`tab ${activeTab === "After Analysis" ? "active" : ""}`}
              onClick={() => setActiveTab("After Analysis")}
            >
              After Analysis
            </div>
            <div
              className={`tab ${activeTab === "Service Billing" ? "active" : ""}`}
              onClick={() => setActiveTab("Service Billing")}
            >
              Service Billing
            </div>
          </div>
        </div>

        <div className="content-scroll-area">
          {activeTab === "General" && (
            <div className="tab-content">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="customerId">Customer ID</label>
                  <input
                    type="text"
                    id="customerId"
                    value={customerInfo.customerId}
                    readOnly
                    onChange={(e) => setCustomerInfo({ ...customerInfo, customerId: e.target.value })}
                    placeholder="Enter customer ID"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="productId">Product ID</label>
                  <input
                    type="text"
                    id="productId"
                    value={customerInfo.productId}
                    readOnly
                    onChange={(e) => setCustomerInfo({ ...customerInfo, productId: e.target.value })}
                    placeholder="Enter product ID"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    value={customerInfo.name}
                    readOnly
                    onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                    placeholder="Enter name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="productName">Product Name</label>
                  <input
                    type="text"
                    id="productName"
                    value={customerInfo.productName}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, productName: e.target.value })}
                    placeholder="Enter product name"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="address">Address</label>
                  <input
                    type="text"
                    id="address"
                    value={customerInfo.address}
                    readOnly
                    onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                    placeholder="Enter address"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="contractId">Contract ID</label>
                  <input
                    type="text"
                    id="contractId"
                    value={customerInfo.contractId}
                    readOnly
                    onChange={(e) => setCustomerInfo({ ...customerInfo, contractId: e.target.value })}
                    placeholder="Enter contract ID"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phoneNumber">Number</label>
                  <input
                    type="text"
                    id="phoneNumber"
                    value={customerInfo.phoneNumber}
                    readOnly
                    onChange={(e) => setCustomerInfo({ ...customerInfo, phoneNumber: e.target.value })}
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="terminationDate">Termination Date</label>
                  <input
                    type="text"
                    id="terminationDate"
                    value={customerInfo.terminationDate}
                    readOnly
                    onChange={(e) => setCustomerInfo({ ...customerInfo, terminationDate: e.target.value })}
                    placeholder="dd/mm/yy"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="emailAddress">Email Address</label>
                  <input
                    type="email"
                    id="emailAddress"
                    value={customerInfo.emailAddress}
                    readOnly
                    onChange={(e) => setCustomerInfo({ ...customerInfo, emailAddress: e.target.value })}
                    placeholder="Enter email address"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="requestType">Request Type</label>
                  <input
                    type="text"
                    id="requestType"
                    value={customerInfo.requestType}
                    readOnly
                    onChange={(e) => setCustomerInfo({ ...customerInfo, requestType: e.target.value })}
                    placeholder="Enter request type"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "Service Order" && (
            <div className="tab-content">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="serviceOrderId">Service Order ID</label>
                  <input
                    type="text"
                    id="serviceOrderId"
                    readOnly
                    value={serviceOrderInfo.serviceOrderId}
                    onChange={(e) => setServiceOrderInfo({ ...serviceOrderInfo, serviceOrderId: e.target.value })}
                    placeholder="No service order issued yet..."
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="orderDate">Order Date</label>
                  <input
                    type="text"
                    id="orderDate"
                    readOnly
                    value={serviceOrderInfo.orderDate}
                    onChange={(e) => setServiceOrderInfo({ ...serviceOrderInfo, orderDate: e.target.value })}
                    placeholder="dd/mm/yy"
                  />
                </div>
              </div>

              <div className="service-order-items-section">
                <h3>Service Order Items</h3>
                <div className="service-order-table-container">
                  <table className="service-order-table">
                    <thead>
                      <tr>
                        <th>Item ID</th>
                        <th>Item Name</th>
                        <th>Unit Price</th>
                        <th>Quantity</th>
                        <th>Total Price</th>
                        <th>Principal Item ID</th>
                      </tr>
                    </thead>
                    <tbody>
                      {serviceOrderItems.length > 0 ? (
                        serviceOrderItems.map((item, index) => (
                          <tr key={index}>
                            <td>{item.item?.item_id || ""}</td>
                            <td>{item.item?.item_name || ""}</td>
                            <td>{item.item_price}</td>
                            <td>{item.item_quantity}</td>
                            <td>{item.total_price}</td>
                            <td>{item.principal_item?.principal_item_id || ""}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" style={{ textAlign: "center" }}></td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="item-buttons-container">
                  <div className="item-buttons-left">
                    {serviceOrderInfo.serviceOrderId === "" && (
                      <span className="no-order-label">No service order issued yet</span>
                    )}
                    <div className="inner-buttons-container">
                      <button 
                        className="delete-item-button"
                        disabled={serviceOrderInfo.serviceOrderId === ""}
                      >
                        Delete Item
                      </button>
                      <button 
                        className="edit-item-button" 
                        onClick={() => handleEditItem(serviceOrderItems[0])}
                        disabled={serviceOrderInfo.serviceOrderId === ""}
                      >
                        Edit Item
                      </button>
                      <button 
                        className="add-item-button" 
                        onClick={handleAddItem}
                        disabled={serviceOrderInfo.serviceOrderId === ""}
                      >
                        Add Item
                      </button>
                    </div>
                  </div>
                  <div className="items-button-right">
                    <div className="form-group">
                      <label htmlFor="orderTotalPrice">Service Order Total Price</label>
                      <input
                        type="text"
                        id="orderTotalPrice"
                        readOnly
                        value={serviceOrderInfo.orderTotalPrice}
                        onChange={(e) => setOrderTotalPrice({ ...serviceOrderInfo, orderTotalPrice: e.target.value })}
                        placeholder="₱ 0.00"
                      />
                  </div>
                  </div>
                </div>
                
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
                  <button 
                    className="add-button"
                    disabled={serviceOrderInfo.serviceOrderId !== "" || !selectedAnalysis }
                    onClick={handleAddOrder}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Delivery Order" && (
            <div className="tab-content">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="deliveryOrderId">Delivery Order ID</label>
                  <input
                    type="text"
                    id="deliveryOrderId"
                    value={deliveryOrderInfo.deliveryOrderId}
                    onChange={(e) => setDeliveryOrderInfo({ ...deliveryOrderInfo, deliveryOrderId: e.target.value })}
                    placeholder="No delivery order issued yet..."
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="customerId">Customer ID</label>
                  <input
                    type="text"
                    id="customerId"
                    value={deliveryOrderInfo.customerId}
                    onChange={(e) => setDeliveryOrderInfo({ ...deliveryOrderInfo, customerId: e.target.value })}
                    placeholder="Enter customer ID"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="serviceOrderId">Service Order ID</label>
                  <input
                    type="text"
                    id="serviceOrderId"
                    value={deliveryOrderInfo.serviceOrderId}
                    onChange={(e) => setDeliveryOrderInfo({ ...deliveryOrderInfo, serviceOrderId: e.target.value })}
                    placeholder="Enter service order ID"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    value={deliveryOrderInfo.name}
                    onChange={(e) => setDeliveryOrderInfo({ ...deliveryOrderInfo, name: e.target.value })}
                    placeholder="Enter name"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="deliveryDate">Delivery Date *</label>
                  <div className="date-input-wrapper">
                    <input
                      type="text"
                      id="deliveryDate"
                      value={deliveryOrderInfo.deliveryDate}
                      onChange={(e) => setDeliveryOrderInfo({ ...deliveryOrderInfo, deliveryDate: e.target.value })}
                      placeholder="dd/mm/yy"
                    />
                    <img
                      src={CalendarInputIcon || "/placeholder.svg?height=16&width=16"}
                      alt="Calendar"
                      className="calendar-icon"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="address">Address</label>
                  <input
                    type="text"
                    id="address"
                    value={deliveryOrderInfo.address}
                    onChange={(e) => setDeliveryOrderInfo({ ...deliveryOrderInfo, address: e.target.value })}
                    placeholder="Enter address"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="deliveryStatus">Delivery Status *</label>
                  <div className="select-wrapper">
                    <input
                      type="text"
                      id="deliveryStatus"
                      value={deliveryOrderInfo.deliveryStatus}
                      onChange={(e) => setDeliveryOrderInfo({ ...deliveryOrderInfo, deliveryStatus: e.target.value })}
                      placeholder="Pending"
                    />
                    <span className="select-arrow">▼</span>
                  </div>
                </div>
              </div>

              <div className="buttons-container-right">
                <button className="update-button">Update</button>
                <button className="add-button">Add</button>
              </div>
            </div>
          )}

          {activeTab === "After Analysis" && (
            <div className="tab-content">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="afterAnalysisId">After Analysis ID</label>
                  <input
                    type="text"
                    id="afterAnalysisId"
                    value={afterAnalysisInfo.afterAnalysisId}
                    onChange={(e) => setAfterAnalysisInfo({ ...afterAnalysisInfo, afterAnalysisId: e.target.value })}
                    placeholder="No after analysis scheduled yet..."
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="analysisId">Analysis ID</label>
                  <input
                    type="text"
                    id="analysisId"
                    value={afterAnalysisInfo.analysisId}
                    onChange={(e) => setAfterAnalysisInfo({ ...afterAnalysisInfo, analysisId: e.target.value })}
                    placeholder="Enter analysis ID"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="serviceStatus">Service Status *</label>
                  <div className="select-wrapper">
                    <input
                      type="text"
                      id="serviceStatus"
                      value={afterAnalysisInfo.serviceStatus}
                      onChange={(e) => setAfterAnalysisInfo({ ...afterAnalysisInfo, serviceStatus: e.target.value })}
                      placeholder="Pending"
                    />
                    <span className="select-arrow">▼</span>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="serviceDate">Service Date *</label>
                  <div className="date-input-wrapper">
                    <input
                      type="text"
                      id="serviceDate"
                      value={afterAnalysisInfo.serviceDate}
                      onChange={(e) => setAfterAnalysisInfo({ ...afterAnalysisInfo, serviceDate: e.target.value })}
                      placeholder="dd/mm/yy"
                    />
                    <img
                      src={CalendarInputIcon || "/placeholder.svg?height=16&width=16"}
                      alt="Calendar"
                      className="calendar-icon"
                    />
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    value={afterAnalysisInfo.description}
                    onChange={(e) => setAfterAnalysisInfo({ ...afterAnalysisInfo, description: e.target.value })}
                    placeholder="Enter description"
                    rows={5}
                  />
                </div>
              </div>

              <div className="buttons-container-right">
                <button className="update-button">Update</button>
                <button className="schedule-button">Schedule</button>
              </div>
            </div>
          )}

          {activeTab === "Service Billing" && (
            <div className="tab-content">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="billingId">Billing ID</label>
                  <input
                    type="text"
                    id="billingId"
                    value={serviceBillingInfo.billingId}
                    onChange={(e) => setServiceBillingInfo({ ...serviceBillingInfo, billingId: e.target.value })}
                    placeholder="No billing done yet..."
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="orderId">Order ID</label>
                  <input
                    type="text"
                    id="orderId"
                    value={serviceBillingInfo.orderId}
                    onChange={(e) => setServiceBillingInfo({ ...serviceBillingInfo, orderId: e.target.value })}
                    placeholder="Enter order ID"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="initialBillingAmount">Initial Billing Amount</label>
                  <input
                    type="text"
                    id="initialBillingAmount"
                    value={serviceBillingInfo.initialBillingAmount}
                    onChange={(e) =>
                      setServiceBillingInfo({
                        ...serviceBillingInfo,
                        initialBillingAmount: e.target.value,
                      })
                    }
                    placeholder="₱ 9999"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="totalOrderPrice">Total Order Price</label>
                  <input
                    type="text"
                    id="totalOrderPrice"
                    value={serviceBillingInfo.totalOrderPrice}
                    onChange={(e) =>
                      setServiceBillingInfo({
                        ...serviceBillingInfo,
                        totalOrderPrice: e.target.value,
                      })
                    }
                    placeholder="₱ 9999"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="outsourceFee">Outsource Fee</label>
                  <input
                    type="text"
                    id="outsourceFee"
                    value={serviceBillingInfo.outsourceFee}
                    onChange={(e) => setServiceBillingInfo({ ...serviceBillingInfo, outsourceFee: e.target.value })}
                    placeholder="₱ 9999"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="totalPayable">Total Payable</label>
                  <input
                    type="text"
                    id="totalPayable"
                    value={serviceBillingInfo.totalPayable}
                    onChange={(e) => setServiceBillingInfo({ ...serviceBillingInfo, totalPayable: e.target.value })}
                    placeholder="₱ 9999"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="billingStatus">Billing Status</label>
                  <div className="select-wrapper">
                    <input
                      type="text"
                      id="billingStatus"
                      value={serviceBillingInfo.billingStatus}
                      onChange={(e) => setServiceBillingInfo({ ...serviceBillingInfo, billingStatus: e.target.value })}
                      placeholder="Unpaid"
                    />
                    <span className="select-arrow">▼</span>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="datePaid">Date Paid</label>
                  <div className="date-input-wrapper">
                    <input
                      type="text"
                      id="datePaid"
                      value={serviceBillingInfo.datePaid}
                      onChange={(e) => setServiceBillingInfo({ ...serviceBillingInfo, datePaid: e.target.value })}
                      placeholder="dd/mm/yy"
                    />
                    <img
                      src={CalendarInputIcon || "/placeholder.svg?height=16&width=16"}
                      alt="Calendar"
                      className="calendar-icon"
                    />
                  </div>
                </div>
              </div>

              <div className="buttons-container-right">
                <button className="update-button">Update</button>
                <button className="add-button">Add</button>
              </div>
            </div>
          )}
          <div className="section-divider"></div>
          <div className="search-filter-container">
            <div className="search-container">
              <img src={SearchIcon || "/placeholder.svg?height=16&width=16"} alt="Search" className="search-icon" />
              <input
                type="text"
                placeholder="Search or type a command (Ctrl + G)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="filter-dropdown">
              <button className="filter-button" onClick={() => setShowFilterOptions(!showFilterOptions)}>
              {filterOptions.find(opt => opt.value === filterOption)?.label || "Filter by"}
                <span className="arrow">▼</span>
              </button>
              {showFilterOptions && (
                <div className="filter-options">
                  {filterOptions.map((option) => (
                    <div key={option.value} className="filter-option" onClick={() => handleFilterSelect(option.value)}>
                      {option.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Table Component */}
          <Table analyses={filteredAnalyses} onRowClick={handleRowClick} onViewAnalysis={handleViewAnalysis} />

          {
            <div className="buttons-container-right table-buttons">
              <button 
                type="button"
                className={`update-button ${selectedAnalysis ? "clickable" : "disabled"}`} 
                onClick={() => setShowUpdateModal(true)}
                disabled={!selectedAnalysis}
              >
                Update
              </button>
              <button className="add-button" onClick={() => setShowAddModal(true)}>
                Add
              </button>
            </div>
          }
        </div>
      </div>

      {/* Modals */}
      {showUpdateModal && (
        <UpdateAnalysisModal
          isOpen={showUpdateModal}
          onClose={() => setShowUpdateModal(false)}
          onUpdate={handleUpdateAnalysis}
          analysis={selectedAnalysis}
        />
      )}

      {showAddModal && (
        <AddServiceAnalysisModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAdd={handleCreateAnalysis}
        />
      )}

      {showAddItemModal && (
        <AddItemModal
          isOpen={showAddItemModal}
          onClose={() => setShowAddItemModal(false)}
          onAdd={handleCreateOrderItem}
          onViewInventory={handleViewInventory}
          order ={serviceOrderInfo.serviceOrderId}
        />
      )}

      {showEditItemModal && (
        <EditItemModal
          isOpen={showEditItemModal}
          onClose={() => setShowEditItemModal(false)}
          onEdit={(item) => {
            console.log("Editing item:", item)
            setShowEditItemModal(false)
          }}
          item={selectedItem}
          onViewInventory={handleViewInventory}
        />
      )}

      {showViewInventoryModal && (
        <ViewInventoryModal
          isOpen={showViewInventoryModal}
          onClose={() => setShowViewInventoryModal(false)}
          onSelectItem={(item) => {
            console.log("Selected item:", item)
            setShowViewInventoryModal(false)
          }}
        />
      )}
    </div>
  )
}

export default ServiceAnalysis

