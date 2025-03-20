"use client"

import { useState } from "react"
import "../styles/ServiceCall.css"

const ServiceCall = () => {
  const [activeTab, setActiveTab] = useState("general")
  const [originDropdownOpen, setOriginDropdownOpen] = useState(false)
  const [selectedOrigin, setSelectedOrigin] = useState("")

  const handleOriginSelect = (value) => {
    setSelectedOrigin(value)
    setOriginDropdownOpen(false)
  }

  return (
    <div className="scroll-container">

      {/* For namespace of CSS */}
      <div className="servcall">

        {/* Service Call Main Container */}
        <div className="body-content-container">

          {/* Header */}
          <div className="header">

            {/* Icon Container */}
            <div className="icon-container">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="24" height="24" rx="4" fill="#00A3A3" />
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
              <h2>Service Call</h2>
              <p className="subtitle">Log and manage service calls with detailed customer and status tracking.</p>
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
                    <option value="CID#894232">CID#894232</option>
                    <option value="CID#894233">CID#894233</option>
                    <option value="CID#894234">CID#894234</option>
                  </select>
                </div>
              </div>

              {/* Name */}
              <div className="input-group">
                <label htmlFor="name">
                  Name<span className="required">*</span>
                </label>
                <input type="text" id="name" placeholder="Enter Name" />
              </div>

              {/* Email */}
              <div className="input-group">
                <label htmlFor="email">
                  Email Address<span className="required">*</span>
                </label>
                <input type="email" id="email" placeholder="user@gmail.com" />
              </div>

              {/* Phone Number */}
              <div className="input-group">
                <label htmlFor="phone">
                  Phone Number<span className="required">*</span>
                </label>
                <input type="text" id="phone" placeholder="Phone Number" />
              </div>

              {/* Contract Number */}
              <div className="input-group">
                <label htmlFor="contract">
                  Contract No.<span className="required">*</span>
                </label>
                <input type="text" id="contract" placeholder="3466-434" />
              </div>

              {/* End Date */}
              <div className="input-group">
                <label htmlFor="endDate">
                  End Date<span className="required">*</span>
                </label>
                <div className="date-input">
                  <input type="text" id="endDate" placeholder="dd/mm/yy" />
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

            {/* Right Column */}
            <div className="input-fields-right">

              {/* Service Call ID */}
              <div className="input-group">
                <label htmlFor="serviceCallId">
                  Service Call ID<span className="required">*</span>
                </label>
                <input type="text" id="serviceCallId" placeholder="1231" />
              </div>

              {/* Call Status */}
              <div className="input-group">
                <label htmlFor="callStatus">
                  Call Status<span className="required">*</span>
                </label>
                <div className="select-wrapper">
                  <select id="callStatus">
                    <option value="">Select Call Status</option>
                    <option value="OPEN/NEW">OPEN/NEW</option>
                    <option value="Completed">Completed</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>

              {/* Call Type */}
              <div className="input-group">
                <label htmlFor="callType">
                  Call Type<span className="required">*</span>
                </label>
                <div className="select-wrapper">
                  <select id="callType">
                    <option value="">Select Call Type</option>
                    <option value="Chat">Chat</option>
                    <option value="Call">Call</option>
                    <option value="Social">Social</option>
                  </select>
                </div>
              </div>

              {/* Priority Level */}
              <div className="input-group">
                <label htmlFor="priority">
                  Priority Level<span className="required">*</span>
                </label>
                <div className="select-wrapper">
                  <select id="priority">
                    <option value="">Select level</option>
                    <option value="Low">Low</option>
                    <option value="Normal">Normal</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              {/* Created On */}
              <div className="input-group">
                <label htmlFor="createdOn">
                  Created On<span className="required">*</span>
                </label>
                <div className="date-input">
                  <input type="text" id="createdOn" placeholder="dd/mm/yy" />
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

              {/* Closed On */}
              <div className="input-group">
                <label htmlFor="closedOn">
                  Closed On<span className="required">*</span>
                </label>
                <div className="date-input">
                  <input type="text" id="closedOn" placeholder="dd/mm/yy" />
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

          <div className="second-divider"></div>

              {/* TGeneral and Resolution Navigation */}
              <div className="tabs-container">
            <div className="tabs">
              <button
                className={`tab ${activeTab === "general" ? "active" : ""}`}
                onClick={() => setActiveTab("general")}
              >
                General
              </button>
              <button
                className={`tab ${activeTab === "resolution" ? "active" : ""}`}
                onClick={() => setActiveTab("resolution")}
              >
                Resolution
              </button>
            </div>

            <div className="tab-content">
              {activeTab === "general" && (
                <div className="general-content">

                  {/* Origin */}
                  <div className="input-group">
                    <label htmlFor="origin">
                      Origin<span className="required">*</span>
                    </label>
                    <div className="select-wrapper">
                      <select id="origin">
                        <option value="">Select origin</option>
                        <option value="Chat">Chat</option>
                        <option value="Call">Call</option>
                      </select>
                    </div>
                  </div>

                  {/* Handled By */}
                  <div className="input-group">
                    <label htmlFor="handledBy">
                      Handled by<span className="required">*</span>
                    </label>
                    <input type="text" id="handledBy" placeholder="Placeholder" />
                  </div>

                  {/* Queue */}
                  <div className="input-group">
                    <label htmlFor="queue">
                      Queue<span className="required">*</span>
                    </label>
                    <input type="text" id="queue" placeholder="Placeholder" />
                  </div>

                  {/* History Table in General Tab */}
                  <div className="history-container">
                    <div className="section-header">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M10 6V10L13 13M19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10Z"
                          stroke="#00A3A3"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span>History</span>
                    </div>

                    <div className="history-search-container">
                      <div className="search-box">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
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

                      <div className="filter-options">
                        <div className="date-filter">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
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
                          <span>Last 30 days</span>
                          <svg width="12" height="6" viewBox="0 0 12 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M1 1L6 5L11 1"
                              stroke="#666666"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>

                        <div className="filter-by">
                          <span>Filter by</span>
                          <svg width="12" height="6" viewBox="0 0 12 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M1 1L6 5L11 1"
                              stroke="#666666"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="history-table">
                      <table>
                        <thead>
                          <tr>
                            <th>Date of Update</th>
                            <th>Update Time</th>
                            <th>Updated By</th>
                            <th>Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>05/12/25</td>
                            <td>1:45 AM</td>
                            <td></td>
                            <td></td>
                          </tr>
                          <tr>
                            <td>05/12/25</td>
                            <td>1:45 AM</td>
                            <td></td>
                            <td></td>
                          </tr>
                          <tr>
                            <td>05/12/25</td>
                            <td>1:45 AM</td>
                            <td></td>
                            <td></td>
                          </tr>
                          <tr>
                            <td>05/12/25</td>
                            <td>1:45 AM</td>
                            <td></td>
                            <td></td>
                          </tr>
                          <tr>
                            <td>05/12/25</td>
                            <td>1:45 AM</td>
                            <td></td>
                            <td></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Page Numbers */}
                    <div className="pagination">
                      <div className="pagination-numbers">
                        <button className="pagination-arrow">&lt;</button>
                        <button className="pagination-number active">1</button>
                        <button className="pagination-number">2</button>
                        <button className="pagination-number">3</button>
                        <button className="pagination-number">4</button>
                        <button className="pagination-arrow">&gt;</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "resolution" && (
                <div className="resolution-content">
                  <textarea className="remarks-input" placeholder="Enter any additional details..."></textarea>
                  <div className="was-resolved-container">
                    <label htmlFor="wasResolved">
                      Was it resolved<span className="required">*</span>
                    </label>
                    <div className="select-wrapper small-select">
                      <select id="wasResolved">
                        <option value="">Select</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                  </div>

                  <div className="resolution-fields">
                    <button className="service-request-button">Service Request</button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button className="cancel-button">Cancel</button>
            <button className="add-button">Add</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ServiceCall