"use client"

import { useState } from "react"
import "../styles/ServiceAnalysis.css"

const ServiceAnalysis = () => {
  const [activeTab, setActiveTab] = useState("service-order")
  const [emailNotification, setEmailNotification] = useState(true)

  const handleTabClick = (tab) => {
    setActiveTab(tab)
  }

  return (
    <div className="scroll-container">
      <div className="servanal">
        {/* Service Analysis Main Container */}
        <div className="body-content-container">
          {/* Header */}
          <div className="header">
            {/* Icon Container */}
            <div className="icon-container">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="24" height="24" rx="4" fill="#00A8A8" />
                <path
                  d="M17 10.5V7C17 6.45 16.55 6 16 6H8C7.45 6 7 6.45 7 7V10.5C7 11.05 7.45 11.5 8 11.5H16C16.55 11.5 17 11.05 17 10.5ZM14 10H10V7.5H14V10Z"
                  fill="white"
                />
                <path
                  d="M17 14V17C17 17.55 16.55 18 16 18H8C7.45 18 7 17.55 7 17V14C7 13.45 7.45 13 8 13H16C16.55 13 17 13.45 17 14ZM14 17H10V14.5H14V17Z"
                  fill="white"
                />
              </svg>
            </div>

            {/* Title Container */}
            <div className="title-container">
              <h2>Service Analysis</h2>
              <p className="subtitle">Optimizing Service Operations Through Detailed Analysis</p>
            </div>
          </div>

          {/* First Line Divider */}
          <div className="first-divider"></div>

          {/* Input Fields Container */}
          <div className="input-fields-container">
            {/* Left Column */}
            <div className="input-fields-left">
              {/* Customer ID */}
              <div className="input-group">
                <label htmlFor="customerId">
                  Customer ID<span className="required">*</span>
                </label>
                <div className="select-wrapper">
                  <select id="customerId">
                    <option value="CID#89423">CID#89423</option>
                    <option value="CID#89424">CID#89424</option>
                    <option value="CID#89425">CID#89425</option>
                  </select>
                </div>
              </div>

              {/* Name */}
              <div className="input-group">
                <label htmlFor="name">
                  Name<span className="required">*</span>
                </label>
                <input type="text" id="name" placeholder="Paula Manalo" />
              </div>

              {/* Email */}
              <div className="input-group">
                <label htmlFor="email">
                  Email Address<span className="required">*</span>
                </label>
                <input type="email" id="email" placeholder="user@gmail.com" />
              </div>
            </div>

            {/* Right Column */}
            <div className="input-fields-right">
              {/* Call ID */}
              <div className="input-group">
                <label htmlFor="callId">
                  Call ID<span className="required">*</span>
                </label>
                <input type="text" id="callId" placeholder="1321" />
              </div>

              {/* Contract No */}
              <div className="input-group">
                <label htmlFor="contractNo">
                  Contract No.<span className="required">*</span>
                </label>
                <div className="select-wrapper">
                  <select id="contractNo">
                    <option value="124235">124235</option>
                    <option value="124236">124236</option>
                    <option value="124237">124237</option>
                  </select>
                </div>
              </div>

              {/* Termination Date */}
              <div className="input-group">
                <label htmlFor="terminationDate">
                  Termination Date<span className="required">*</span>
                </label>
                <div className="date-input">
                  <input type="text" id="terminationDate" placeholder="dd/mm/y" />
                  <span className="calendar-icon">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M13.3333 2.66667H2.66667C1.93029 2.66667 1.33333 3.26363 1.33333 4.00001V13.3333C1.33333 14.0697 1.93029 14.6667 2.66667 14.6667H13.3333C14.0697 14.6667 14.6667 14.0697 14.6667 13.3333V4.00001C14.6667 3.26363 14.0697 2.66667 13.3333 2.66667Z"
                        stroke="#666666"
                        strokeWidth="1.33333"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M1.33333 6.66667H14.6667"
                        stroke="#666666"
                        strokeWidth="1.33333"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M4 1.33333V4"
                        stroke="#666666"
                        strokeWidth="1.33333"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 1.33333V4"
                        stroke="#666666"
                        strokeWidth="1.33333"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Second Line Divider */}
          <div className="second-divider"></div>

          {/* Tabs */}
          <div className="tabs-container">
            <div className="tabs">
              <div
                className={`tab ${activeTab === "general" ? "active" : ""}`}
                onClick={() => handleTabClick("general")}
              >
                {activeTab === "general" && <div className="tab-indicator"></div>}
                General
              </div>
              <div
                className={`tab ${activeTab === "remarks" ? "active" : ""}`}
                onClick={() => handleTabClick("remarks")}
              >
                {activeTab === "remarks" && <div className="tab-indicator"></div>}
                Remarks
              </div>
              <div
                className={`tab ${activeTab === "service-order" ? "active" : ""}`}
                onClick={() => handleTabClick("service-order")}
              >
                {activeTab === "service-order" && <div className="tab-indicator"></div>}
                Service Order
              </div>
              <div
                className={`tab ${activeTab === "service-purchase" ? "active" : ""}`}
                onClick={() => handleTabClick("service-purchase")}
              >
                {activeTab === "service-purchase" && <div className="tab-indicator"></div>}
                Service Purchase
              </div>
              <div
                className={`tab ${activeTab === "delivery-order" ? "active" : ""}`}
                onClick={() => handleTabClick("delivery-order")}
              >
                {activeTab === "delivery-order" && <div className="tab-indicator"></div>}
                Delivery Order
              </div>
              <div
                className={`tab ${activeTab === "after-analysis" ? "active" : ""}`}
                onClick={() => handleTabClick("after-analysis")}
              >
                {activeTab === "after-analysis" && <div className="tab-indicator"></div>}
                After Analysis
              </div>
              <div
                className={`tab ${activeTab === "service-billing" ? "active" : ""}`}
                onClick={() => handleTabClick("service-billing")}
              >
                {activeTab === "service-billing" && <div className="tab-indicator"></div>}
                Service Billing
              </div>
              <div
                className={`tab ${activeTab === "service-cost" ? "active" : ""}`}
                onClick={() => handleTabClick("service-cost")}
              >
                {activeTab === "service-cost" && <div className="tab-indicator"></div>}
                Service Cost
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {/* Search and Filter */}
            <div className="search-filter-container">
              <div className="search-container">
                <svg
                  className="search-icon"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z"
                    stroke="#666666"
                    strokeWidth="1.33333"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14 14L11.1 11.1"
                    stroke="#666666"
                    strokeWidth="1.33333"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <input type="text" placeholder="Search or type a command (Ctrl + G)" />
              </div>
              <div className="filter-container">
                <div className="dropdown-wrapper">
                  <select className="days-dropdown">
                    <option>Last 30 days</option>
                    <option>Last 60 days</option>
                    <option>Last 90 days</option>
                  </select>
                </div>
                <div className="dropdown-wrapper">
                  <select className="filter-dropdown">
                    <option>Filter by</option>
                    <option>Status</option>
                    <option>Date</option>
                    <option>Customer</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Table Content based on active tab */}
            {activeTab === "general" && (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Request ID</th>
                      <th>Customer ID</th>
                      <th>Analysis ID</th>
                      <th>Analysis Date</th>
                      <th>Analysis Description</th>
                      <th>Product ID</th>
                      <th>Technician ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>123</td>
                      <td>CID#89423</td>
                      <td>ANA123</td>
                      <td>15/03/2024</td>
                      <td>Initial Analysis</td>
                      <td>PRD456</td>
                      <td>TECH789</td>
                    </tr>
                    <tr>
                      <td>1234</td>
                      <td>CID#89423</td>
                      <td>ANA124</td>
                      <td>14/03/2024</td>
                      <td>Follow-up Check</td>
                      <td>PRD457</td>
                      <td>TECH790</td>
                    </tr>
                    <tr>
                      <td>543</td>
                      <td>CID#89423</td>
                      <td>ANA125</td>
                      <td>13/03/2024</td>
                      <td>Final Review</td>
                      <td>PRD458</td>
                      <td>TECH791</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "remarks" && (
              <div className="remarks-container">
                <div className="remarks-header">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M10 12.5C12.7614 12.5 15 10.2614 15 7.5C15 4.73858 12.7614 2.5 10 2.5C7.23858 2.5 5 4.73858 5 7.5C5 10.2614 7.23858 12.5 10 12.5Z"
                      stroke="#00A3A3"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8.4375 7.1875C8.57908 6.875 8.82203 6.61248 9.13033 6.44217C9.43864 6.27187 9.79801 6.20224 10.1508 6.24688C10.5036 6.29152 10.8304 6.44725 11.0777 6.68911C11.325 6.93098 11.4782 7.24447 11.5125 7.58125C11.5125 8.36875 10.3375 8.7625 10.3375 8.7625"
                      stroke="#00A3A3"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>Detailed Description of the Conducted Service Analysis</span>
                </div>
                <textarea className="remarks-textarea"></textarea>
              </div>
            )}

            {activeTab === "service-order" && (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Service Order ID</th>
                      <th>Analysis ID</th>
                      <th>Customer ID</th>
                      <th>Item ID</th>
                      <th>Item Name</th>
                      <th>Item Availability</th>
                      <th>Item Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>SO-001</td>
                      <td>ANA123</td>
                      <td>CID#89423</td>
                      <td>ITEM001</td>
                      <td>Service Part A</td>
                      <td>In Stock</td>
                      <td>$120.00</td>
                    </tr>
                    <tr>
                      <td>SO-002</td>
                      <td>ANA124</td>
                      <td>CID#89423</td>
                      <td>ITEM002</td>
                      <td>Service Part B</td>
                      <td>In Stock</td>
                      <td>$85.50</td>
                    </tr>
                    <tr>
                      <td>SO-003</td>
                      <td>ANA125</td>
                      <td>CID#89423</td>
                      <td>ITEM003</td>
                      <td>Service Part C</td>
                      <td>Out of Stock</td>
                      <td>$210.75</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "service-purchase" && (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Service Purchase ID</th>
                      <th>Service Order ID</th>
                      <th>Principal Item ID</th>
                      <th>Item ID</th>
                      <th>Item Name</th>
                      <th>Request Date</th>
                      <th>Quantity</th>
                      <th>Markup Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>SP-001</td>
                      <td>SO-001</td>
                      <td>PI-001</td>
                      <td>ITEM001</td>
                      <td>Service Part A</td>
                      <td>15/03/2024</td>
                      <td>2</td>
                      <td>$130.00</td>
                    </tr>
                    <tr>
                      <td>SP-002</td>
                      <td>SO-002</td>
                      <td>PI-002</td>
                      <td>ITEM002</td>
                      <td>Service Part B</td>
                      <td>14/03/2024</td>
                      <td>1</td>
                      <td>$95.00</td>
                    </tr>
                    <tr>
                      <td>SP-003</td>
                      <td>SO-003</td>
                      <td>PI-003</td>
                      <td>ITEM003</td>
                      <td>Service Part C</td>
                      <td>13/03/2024</td>
                      <td>3</td>
                      <td>$225.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "delivery-order" && (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Delivery Order ID</th>
                      <th>Service Purchase ID</th>
                      <th>Service Billing ID</th>
                      <th>Customer ID</th>
                      <th>Customer Address</th>
                      <th>Service Billing Amount</th>
                      <th>Delivery Status</th>
                      <th>Service Order ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>DO-001</td>
                      <td>SP-001</td>
                      <td>SB-001</td>
                      <td>CID#89423</td>
                      <td>123 Main St</td>
                      <td>$260.00</td>
                      <td>Delivered</td>
                      <td>SO-001</td>
                    </tr>
                    <tr>
                      <td>DO-002</td>
                      <td>SP-002</td>
                      <td>SB-002</td>
                      <td>CID#89423</td>
                      <td>123 Main St</td>
                      <td>$95.00</td>
                      <td>In Transit</td>
                      <td>SO-002</td>
                    </tr>
                    <tr>
                      <td>DO-003</td>
                      <td>SP-003</td>
                      <td>SB-003</td>
                      <td>CID#89423</td>
                      <td>123 Main St</td>
                      <td>$675.00</td>
                      <td>Pending</td>
                      <td>SO-003</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "after-analysis" && (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Analysis Schedule</th>
                      <th>Service Request ID</th>
                      <th>Service Date</th>
                      <th>Technician ID</th>
                      <th>Description</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>AS-001</td>
                      <td>SR-001</td>
                      <td>20/03/2024</td>
                      <td>TECH789</td>
                      <td>Initial Analysis</td>
                      <td>Scheduled</td>
                    </tr>
                    <tr>
                      <td>AS-002</td>
                      <td>SR-002</td>
                      <td>22/03/2024</td>
                      <td>TECH790</td>
                      <td>Follow-up Check</td>
                      <td>Pending</td>
                    </tr>
                    <tr>
                      <td>AS-003</td>
                      <td>SR-003</td>
                      <td>25/03/2024</td>
                      <td>TECH791</td>
                      <td>Final Review</td>
                      <td>Scheduled</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "service-billing" && (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Service Billing ID</th>
                      <th>Service Purchase ID</th>
                      <th>Service Order ID</th>
                      <th>Service Request ID</th>
                      <th>Charge Type</th>
                      <th>Product ID</th>
                      <th>Warranty Status</th>
                      <th>Service Billing Amount</th>
                      <th>Billing Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>SB-001</td>
                      <td>SP-001</td>
                      <td>SO-001</td>
                      <td>SR-001</td>
                      <td>Parts</td>
                      <td>PRD456</td>
                      <td>Valid</td>
                      <td>$260.00</td>
                      <td>Paid</td>
                    </tr>
                    <tr>
                      <td>SB-002</td>
                      <td>SP-002</td>
                      <td>SO-002</td>
                      <td>SR-002</td>
                      <td>Labor</td>
                      <td>PRD457</td>
                      <td>Expired</td>
                      <td>$95.00</td>
                      <td>Pending</td>
                    </tr>
                    <tr>
                      <td>SB-003</td>
                      <td>SP-003</td>
                      <td>SO-003</td>
                      <td>SR-003</td>
                      <td>Parts & Labor</td>
                      <td>PRD458</td>
                      <td>Valid</td>
                      <td>$675.00</td>
                      <td>Pending</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "service-cost" && (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Service Cost</th>
                      <th>Analysis ID</th>
                      <th>Service Billing</th>
                      <th>Cost Type</th>
                      <th>Outsource Fee</th>
                      <th>Cost Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>SC-001</td>
                      <td>ANA123</td>
                      <td>SB-001</td>
                      <td>Parts</td>
                      <td>$50.00</td>
                      <td>$200.00</td>
                    </tr>
                    <tr>
                      <td>SC-002</td>
                      <td>ANA124</td>
                      <td>SB-002</td>
                      <td>Labor</td>
                      <td>$0.00</td>
                      <td>$75.00</td>
                    </tr>
                    <tr>
                      <td>SC-003</td>
                      <td>ANA125</td>
                      <td>SB-003</td>
                      <td>Parts & Labor</td>
                      <td>$100.00</td>
                      <td>$500.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination - moved to the right */}
            <div className="pagination">
              <button className="pagination-arrow prev">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M10 12L6 8L10 4"
                    stroke="#666666"
                    strokeWidth="1.33333"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button className="pagination-number active">1</button>
              <button className="pagination-number">2</button>
              <button className="pagination-number">3</button>
              <button className="pagination-number">4</button>
              <button className="pagination-arrow next">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M6 12L10 8L6 4"
                    stroke="#666666"
                    strokeWidth="1.33333"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>

          {activeTab === "service-order" && (
    <div className="bottom-action-bar">
        <div className="not-in-stock-container">
            <span className="not-in-stock-text">Item not in stock? Request here:</span>
            <div className="button-container">
                <button className="submit-inventory-btn">Submit to Inventory</button>
                <div className="purchase-request-wrapper">
                    <button className="purchase-request-btn">Purchase Request</button>
                </div>
            </div>
        </div>
        <div className="action-buttons-right">
            <button className="cancel-button">Cancel</button>
            <button className="update-button">Update</button>
        </div>
    </div>
)}

          {/* Action Buttons based on active tab */}
          {activeTab === "service-purchase" && (
            <div className="action-buttons-container">
              <div className="left-buttons">
                <button className="action-button primary-button">Submit to MRP</button>
                <button className="action-button primary-button">Process Distribution</button>
              </div>
              <div className="right-buttons">
                <button className="action-button cancel-button">Cancel</button>
                <button className="action-button update-button">Update</button>
              </div>
            </div>
          )}

          {activeTab !== "service-purchase" && activeTab !== "service-order" && (
            <div className="action-buttons">
              <button className="cancel-button">Cancel</button>
              <button className="update-button">Update</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ServiceAnalysis

