"use client"

import { useState, useEffect } from "react"
import "../styles/ServiceAnalysis.css"
import ServiceAnalysisIcon from "/icons/SupportServices/ServiceAnalysisIcon.png"
import Table from "../components/ServiceAnalysis/Table"
import UpdateAnalysisModal from "../components/ServiceAnalysis/UpdateAnalysisModal"
import AddServiceAnalysisModal from "../components/ServiceAnalysis/AddServiceAnalysisModal"
import AddItemModal from "../components/ServiceAnalysis/AddItemModal"
import EditItemModal from "../components/ServiceAnalysis/EditItemModal"
import ViewInventoryModal from "../components/ServiceAnalysis/ViewInventoryModal"
import SearchIcon from "/icons/SupportServices/SearchIcon.png"
import CalendarInputIcon from "/icons/SupportServices/CalendarInputIcon.png"

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
  const [serviceOrderItems, setServiceOrderItems] = useState([
    {
      id: "123",
      name: "Battery",
      unitPrice: "₱ 18,900",
      markupPrice: "₱ 1,000,000",
      quantity: "1",
      totalPrice: "₱ 1,018,900",
      principalItemId: "12345679",
    },
    {
      id: "1234",
      name: "Power Supply",
      unitPrice: "₱ 12,500",
      markupPrice: "₱ 500,000",
      quantity: "2",
      totalPrice: "₱ 525,000",
      principalItemId: "98765432",
    },
    {
      id: "543",
      name: "Circuit Board",
      unitPrice: "₱ 35,000",
      markupPrice: "₱ 750,000",
      quantity: "1",
      totalPrice: "₱ 785,000",
      principalItemId: "45678912",
    },
  ])

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
  })

  // Fetch analyses from API (mock function)
  useEffect(() => {
    // Replace with actual API call
    const fetchAnalyses = async () => {
      try {
        // Sample data
        setAnalyses([
          {
            id: "123",
            requestId: "REQ-001",
            technicianId: "TECH-001",
            analysisDate: "dd/mm/yy",
            status: "Scheduled",
            description: "Initial assessment of X-ray machine",
            laborCost: "₱ 5,000",
          },
          {
            id: "1234",
            requestId: "REQ-002",
            technicianId: "TECH-002",
            analysisDate: "dd/mm/yy",
            status: "In Progress",
            description: "Troubleshooting power supply issues",
            laborCost: "₱ 7,500",
          },
          {
            id: "543",
            requestId: "REQ-003",
            technicianId: "TECH-003",
            analysisDate: "dd/mm/yy",
            status: "Completed",
            description: "Replacement of faulty components",
            laborCost: "₱ 12,000",
          },
        ])
      } catch (error) {
        console.error("Error fetching analyses:", error)
      }
    }

    fetchAnalyses()
  }, [])

  // Handle view analysis
  const handleViewAnalysis = (analysis) => {
    if (activeTab === "General") {
      setSelectedAnalysis(analysis)
      setShowUpdateModal(true)
    }
  }

  // Handle add new analysis
  const handleAddAnalysis = () => {
    if (activeTab === "General") {
      setShowAddModal(true)
    }
  }

  // Handle update analysis
  const handleUpdateAnalysis = (analysisData) => {
    console.log("Updating analysis:", analysisData)
    setShowUpdateModal(false)
  }

  // Handle create analysis
  const handleCreateAnalysis = (analysisData) => {
    console.log("Creating analysis:", analysisData)
    setShowAddModal(false)
  }

  // Handle add item
  const handleAddItem = () => {
    if (activeTab === "Service Order") {
      setShowAddItemModal(true)
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

  // Handle filter selection
  const handleFilterSelect = (option) => {
    setFilterOption(option)
    setShowFilterOptions(false)
  }

  // Filter analyses based on search query and filter option
  const filteredAnalyses = analyses.filter((analysis) => {
    // First apply the status filter if it's not "Filter by" or "All"
    if (filterOption !== "Filter by" && filterOption !== "All") {
      if (analysis.status !== filterOption) {
        return false
      }
    }

    // Then apply the search query filter
    if (!searchQuery) return true

    return (
      analysis.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      analysis.requestId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      analysis.technicianId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      analysis.status.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  return (
    <div className="servanal">
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
                    onChange={(e) => setCustomerInfo({ ...customerInfo, requestType: e.target.value })}
                    placeholder="Enter request type"
                  />
                </div>
              </div>

              <div className="section-divider"></div>
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
                    value={serviceOrderInfo.serviceOrderId}
                    onChange={(e) => setServiceOrderInfo({ ...serviceOrderInfo, serviceOrderId: e.target.value })}
                    placeholder="Enter service order ID"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="orderDate">Order Date</label>
                  <input
                    type="text"
                    id="orderDate"
                    value={serviceOrderInfo.orderDate}
                    onChange={(e) => setServiceOrderInfo({ ...serviceOrderInfo, orderDate: e.target.value })}
                    placeholder="dd/mm/yy"
                  />
                </div>
              </div>

              {/* No button here */}

              <div className="service-order-items-section">
                <h3>Service Order Items</h3>
                <div className="service-order-table-container">
                  <table className="service-order-table">
                    <thead>
                      <tr>
                        <th>Item ID</th>
                        <th>Item Name</th>
                        <th>Unit Price</th>
                        <th>Markup Price</th>
                        <th>Quantity</th>
                        <th>Total Price</th>
                        <th>Principal Item ID</th>
                      </tr>
                    </thead>
                    <tbody>
                      {serviceOrderItems.map((item) => (
                        <tr key={item.id}>
                          <td>{item.id}</td>
                          <td>{item.name}</td>
                          <td>{item.unitPrice}</td>
                          <td>{item.markupPrice}</td>
                          <td>{item.quantity}</td>
                          <td>{item.totalPrice}</td>
                          <td>{item.principalItemId}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="item-buttons-left">
                  <button className="delete-item-button">Delete Item</button>
                  <button className="edit-item-button" onClick={() => handleEditItem(serviceOrderItems[0])}>
                    Edit Item
                  </button>
                  <button className="add-item-button" onClick={handleAddItem}>
                    Add Item
                  </button>
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
                  <button className="add-button">Add</button>
                </div>
              </div>

              {/* No divider */}
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

              <div className="search-container">{/* Search and filter components would go here */}</div>

              <div className="table-container">{/* Table would go here */}</div>

              <div className="buttons-container-right table-buttons">
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

              <div className="search-container">{/* Search and filter components would go here */}</div>

              <div className="table-container">{/* Table would go here */}</div>

              <div className="buttons-container-right table-buttons">
                <button className="update-button">Update</button>
                <button className="add-button">Add</button>
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

              <div className="search-container">{/* Search and filter components would go here */}</div>

              <div className="table-container">{/* Table would go here */}</div>

              <div className="buttons-container-right table-buttons">
                <button className="update-button">Update</button>
                <button className="add-button">Add</button>
              </div>
            </div>
          )}

          <div className="search-container">
            <div className="search-input-wrapper">
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
                {filterOption}
                <span className="arrow">▼</span>
              </button>
              <div className={`filter-options ${showFilterOptions ? "show" : ""}`}>
                <div className="filter-option" onClick={() => handleFilterSelect("Scheduled")}>
                  Scheduled
                </div>
                <div className="filter-option" onClick={() => handleFilterSelect("In Progress")}>
                  In Progress
                </div>
                <div className="filter-option" onClick={() => handleFilterSelect("Completed")}>
                  Completed
                </div>
                <div className="filter-option" onClick={() => handleFilterSelect("All")}>
                  All
                </div>
              </div>
            </div>
          </div>

          {/* Table Component */}
          <Table analyses={filteredAnalyses} onViewAnalysis={handleViewAnalysis} />

          {activeTab === "General" && (
            <div className="buttons-container-right table-buttons">
              <button className="update-button" onClick={() => setShowUpdateModal(true)}>
                Update
              </button>
              <button className="add-button" onClick={() => setShowAddModal(true)}>
                Add
              </button>
            </div>
          )}
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
          onAdd={(item) => {
            console.log("Adding item:", item)
            setShowAddItemModal(false)
          }}
          onViewInventory={handleViewInventory}
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

