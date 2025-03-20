"use client"

import { useState } from "react"
import "../styles/ServiceRequest.css"

const ServiceRequest = () => {
  const [currentPage, setCurrentPage] = useState(1)

  return (
    <div className="scroll-container">
      <div className="servrequ">
        <div className="body-content-container">
          {/* Header */}
          <div className="header">
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
            <div className="title-container">
              <h2>Service Request</h2>
              <p className="subtitle">Track and manage service requests efficiently</p>
            </div>
          </div>

          {/* First Line Divider */}
          <div className="first-divider"></div>

          {/* Form Section */}
          <div className="input-fields-container">
            <div className="input-fields-left">
              <div className="input-group">
                <label htmlFor="customerId">
                  Customer ID<span className="required">*</span>
                </label>
                <div className="select-wrapper">
                  <select id="customerId" defaultValue="">
                    <option value="" disabled>
                      Select Customer ID
                    </option>
                    <option value="CID#89423">CID#89423</option>
                    <option value="CID#89424">CID#89424</option>
                    <option value="CID#89425">CID#89425</option>
                  </select>
                </div>
              </div>
              <div className="input-group">
                <label htmlFor="name">
                  Name<span className="required">*</span>
                </label>
                <input type="text" id="name" placeholder="Enter name" />
              </div>
              <div className="input-group">
                <label htmlFor="emailAddress">
                  Email Address<span className="required">*</span>
                </label>
                <input type="email" id="emailAddress" placeholder="user@gmail.com" />
              </div>
            </div>
            <div className="input-fields-right">
              <div className="input-group">
                <label htmlFor="callId">
                  Call ID<span className="required">*</span>
                </label>
                <input type="text" id="callId" placeholder="Enter Call ID" />
              </div>
              <div className="input-group">
                <label htmlFor="contractNo">
                  Contract No<span className="required">*</span>
                </label>
                <div className="select-wrapper">
                  <select id="contractNo" defaultValue="">
                    <option value="" disabled>
                      Select Contract No
                    </option>
                    <option value="124235">124235</option>
                    <option value="124236">124236</option>
                    <option value="124237">124237</option>
                  </select>
                </div>
              </div>
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
          </div>

          {/* Second Line Divider */}
          <div className="second-divider"></div>

          {/* Table Section */}
          <div className="table-section">
            <div className="section-header">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M17.5 6.25H2.5C2.16848 6.25 1.85054 6.3817 1.61612 6.61612C1.3817 6.85054 1.25 7.16848 1.25 7.5V15C1.25 15.3315 1.3817 15.6495 1.61612 15.8839C1.85054 16.1183 2.16848 16.25 2.5 16.25H17.5C17.8315 16.25 18.1495 16.1183 18.3839 15.8839C18.6183 15.6495 18.75 15.3315 18.75 15V7.5C18.75 7.16848 18.6183 6.85054 18.3839 6.61612C18.1495 6.3817 17.8315 6.25 17.5 6.25Z"
                  stroke="#00A8A8"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>General</span>
            </div>

            <div className="search-filter-container">
              <div className="search-container">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z"
                    stroke="#666666"
                    strokeWidth="1.33333"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14 14L11 11"
                    stroke="#666666"
                    strokeWidth="1.33333"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <input type="text" placeholder="Search or type a command (Ctrl + G)" />
              </div>
              <div className="filter-container">
                <div className="date-filter">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M13.3333 2.66667H2.66667C1.93029 2.66667 1.33333 3.26363 1.33333 4.00001V13.3333C1.33333 14.0697 1.93029 14.6667 2.66667 14.6667H13.3333C14.0697 14.6667 14.6667 14.0697 14.6667 13.3333V4.00001C14.6667 3.26363 14.0697 2.66667 13.3333 2.66667Z"
                      stroke="#666666"
                      strokeWidth="1.33333"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>Last 30 days</span>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M3 4.5L6 7.5L9 4.5"
                      stroke="#666666"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="filter-by">
                  <span>Filter by</span>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M3 4.5L6 7.5L9 4.5"
                      stroke="#666666"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Request ID</th>
                    <th>Service Call ID</th>
                    <th>Request Date</th>
                    <th>Customer ID</th>
                    <th>Description</th>
                    <th>Technician ID</th>
                    <th>Request Type</th>
                    <th>Remarks</th>
                    <th>Request Status</th>
                    <th>Contract Type</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>123</td>
                    <td></td>
                    <td>05/12/25</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>
                      <span className="status completed">Completed</span>
                    </td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>1234</td>
                    <td></td>
                    <td>05/12/25</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>
                      <span className="status pending">Pending</span>
                    </td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>543</td>
                    <td></td>
                    <td>05/12/25</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>
                      <span className="status in-progress">In Progress</span>
                    </td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="pagination-container">
              <div className="pagination">
                <button className="pagination-arrow prev">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M10 12L6 8L10 4"
                      stroke="#666666"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <button
                  className={`pagination-number ${currentPage === 1 ? "active" : ""}`}
                  onClick={() => setCurrentPage(1)}
                >
                  1
                </button>
                <button
                  className={`pagination-number ${currentPage === 2 ? "active" : ""}`}
                  onClick={() => setCurrentPage(2)}
                >
                  2
                </button>
                <button
                  className={`pagination-number ${currentPage === 3 ? "active" : ""}`}
                  onClick={() => setCurrentPage(3)}
                >
                  3
                </button>
                <button
                  className={`pagination-number ${currentPage === 4 ? "active" : ""}`}
                  onClick={() => setCurrentPage(4)}
                >
                  4
                </button>
                <button className="pagination-arrow next">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M6 12L10 8L6 4"
                      stroke="#666666"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <div className="left-buttons">
              <button className="submit-approval">Submit for Approval</button>
              <button className="submit-sales">Submit to Sales</button>
            </div>
            <div className="right-buttons">
              <button className="cancel-button">Cancel</button>
              <button className="edit-button">Edit</button>
              <button className="add-button">Add</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ServiceRequest

