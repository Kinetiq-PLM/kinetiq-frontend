"use client"

import { useState } from "react"
import "../styles/ServiceTicket.css"

const ServiceTicket = () => {
  const [emailNotification, setEmailNotification] = useState(true)

  return (
    <div className="scroll-container">

      {/* For namespace of CSS */}
        <div className="servtick">

      {/* Service Ticket Main Container */}
      <div className="body-content-container">

        {/* Header */}
        <div className="header">

          {/* Icon Container */}
          <div className="icon-container">
          <img 
            src="/icons/module-icons/SupportServices/ServiceTicket.png" 
            alt="Service Ticket" 
          />
          </div>

          {/* Title Container */}
          <div className="title-container">
            <h2>Service Ticket</h2>
            <p className="subtitle">Track and update the status of this service ticket.</p>
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
                  <option value="" disabled selected>Select Customer ID</option>
                  <option value="CUST89423">CUST89423</option>
                  <option value="CUST89424">CUST89424</option>
                  <option value="CUST89425">CUST89425</option>
                </select>
              </div>
            </div>

            {/* Name */}
            <div className="input-group">
              <label htmlFor="name">
                Name<span className="required">*</span>
              </label>
              <input type="text" id="name" placeholder="Enter name" />
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
              <input type="text" id="phone" placeholder="Enter Phone Number" />
            </div>

            {/* Contract Number */}
            <div className="input-group">
              <label htmlFor="contract">
                Contract No.<span className="required">*</span>
              </label>
              <input type="text" id="contract" placeholder="3456-434" />
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

            {/* Ticket */}
            <div className="input-group">
              <label htmlFor="ticket">
                Ticket<span className="required">*</span>
              </label>
              <input type="text" id="ticket" placeholder="123" />
            </div>

            {/* Ticket Status */}
            <div className="input-group">
              <label htmlFor="ticketStatus">
                Ticket Status<span className="required">*</span>
              </label>
              <div className="select-wrapper">
                <select id="ticketStatus">
                  <option value="" disabled selected>Select Ticket Status</option>
                  <option value="Completed">Completed</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
            </div>

            {/* Call Type*/}
            <div className="input-group">
              <label htmlFor="callType">
                Call Type<span className="required">*</span>
              </label>
              <div className="select-wrapper">
                <select id="callType">
                  <option value="">Select Call Type</option>
                  <option value="Chat">Chat</option>
                  <option value="Call">Call</option>
                </select>
              </div>
            </div>

            {/* FPriority Level */}
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

        {/* Second Line Divider */}
        <div className="second-divider"></div>

        {/* Ticket Subject and Customer Remarks Container */}
        <div className="ticket-details-container">
          <div className="ticket-details">
            <div className="ticket-section">
              <div className="section-header">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M17.5 6.25H2.5C2.16848 6.25 1.85054 6.3817 1.61612 6.61612C1.3817 6.85054 1.25 7.16848 1.25 7.5V15C1.25 15.3315 1.3817 15.6495 1.61612 15.8839C1.85054 16.1183 2.16848 16.25 2.5 16.25H17.5C17.8315 16.25 18.1495 16.1183 18.3839 15.8839C18.6183 15.6495 18.75 15.3315 18.75 15V7.5C18.75 7.16848 18.6183 6.85054 18.3839 6.61612C18.1495 6.3817 17.8315 6.25 17.5 6.25Z"
                    stroke="#00A3A3"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>Ticket Subject</span>
              </div>
              <input type="text" className="subject-input" />
                <div className="section-header">
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
                  <span>Customer Remarks</span>
                </div>
                <textarea
                  className="remarks-input"
                  placeholder="Enter any additional details about the request..."
                ></textarea>
            </div>

            {/* Support Agent and Validating Ticket Container */}
            <div className="ticket-section">
              <div className="section-header">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M10 12.5C12.7614 12.5 15 10.2614 15 7.5C15 4.73858 12.7614 2.5 10 2.5C7.23858 2.5 5 4.73858 5 7.5C5 10.2614 7.23858 12.5 10 12.5Z"
                    stroke="#00A3A3"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2.42188 17.5C2.42188 14.4625 5.85938 12 10.0156 12C10.8531 12 11.6594 12.1125 12.4062 12.3125"
                    stroke="#00A3A3"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>Support Agent Validating Ticket:</span>
              </div>
              <input type="text" className="agent-input" placeholder="TECH12345" />

              <div className="notification-section">
                <p>Automated email notifying the customer of a support call within 24 hours</p>
                <div className="toggle-container">
                  <span className="toggle-label">On</span>
                  <div className="toggle-switch">
                    <input
                      type="checkbox"
                      id="notification-toggle"
                      checked={emailNotification}
                      onChange={() => setEmailNotification(!emailNotification)}
                    />
                    <label htmlFor="notification-toggle"></label>
                  </div>
                </div>
              </div>

              <div className="input-group email-sent">
                <label>Date email was sent</label>
                <input type="text" />
              </div>
              
            </div>
            
            {/* Date Scheduled Call Container */}
            <div className="ticket-section">
                <div className="section-header">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M17.5 6.25H2.5C2.16848 6.25 1.85054 6.3817 1.61612 6.61612C1.3817 6.85054 1.25 7.16848 1.25 7.5V15C1.25 15.3315 1.3817 15.6495 1.61612 15.8839C1.85054 16.1183 2.16848 16.25 2.5 16.25H17.5C17.8315 16.25 18.1495 16.1183 18.3839 15.8839C18.6183 15.6495 18.75 15.3315 18.75 15V7.5C18.75 7.16848 18.6183 6.85054 18.3839 6.61612C18.1495 6.3817 17.8315 6.25 17.5 6.25Z"
                      stroke="#00A3A3"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>Additional Details</span>
                </div>

                <div className="input-group">
                  <label htmlFor="dateScheduledCall">
                    Date Scheduled Call<span className="required">*</span>
                  </label>
                  <div className="date-input">
                    <input type="text" id="dateScheduledCall" placeholder="dd/mm/yy" />
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

                <div className="input-group">
                  <label htmlFor="supportTechId">
                    Support Tech ID<span className="required">*</span>
                  </label>
                  <input type="text" id="supportTechId" placeholder="TECH12344" />
                </div>

                <div className="input-group">
                  <button
                    className="queue-ticket-button"
                    onClick={() => {
                      // Add your logic here for handling the Queue Ticket button click
                      console.log("Queue Ticket button clicked");
                    }}
                  >
                    Queue Ticket
                  </button>
                </div>
              </div>
          </div>
        </div>

        <div className="action-buttons">
          <button className="cancel-button">Cancel</button>
          <button className="add-button">Add</button>
        </div>
      </div>
    </div>

    </div>
  )
}

export default ServiceTicket
