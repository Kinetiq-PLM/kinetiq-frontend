"use client"

const ServTickInputField = ({
  ticketId,
  setTicketId,
  customerId,
  setCustomerId,
  subject,
  setSubject,
  name,
  setName,
  description,
  setDescription,
  email,
  setEmail,
  phone,
  setPhone,
}) => {
  return (
    <div className="input-fields-container">
      <div className="form-column">
        <div className="form-group">
          <label htmlFor="ticketId">Ticket ID</label>
          <input
            type="text"
            id="ticketId"
            value={ticketId}
            readOnly 
            onChange={(e) => setTicketId(e.target.value)}
            placeholder="Enter ticket ID"
          />
        </div>

        <div className="form-group">
          <label htmlFor="subject">Ticket Subject</label>
          <input
            type="text"
            id="subject"
            value={subject}
            readOnly 
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter ticket subject"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Ticket Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            readOnly 
            placeholder="Enter ticket description"
            style={{ height: "8.5rem" }} /* Align exactly with phone number */
          />
        </div>
      </div>

      <div className="form-column">
        <div className="form-group">
          <label htmlFor="customerId">Customer ID</label>
          <div className="select-wrapper">
            <input
              type="text"
              id="customerId"
              value={customerId}
              readOnly 
              onChange={(e) => setCustomerId(e.target.value)}
              placeholder="Enter customer ID"
            />
            {/* <span className="select-arrow">▼</span> */}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            readOnly 
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            value={email}
            readOnly 
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email address"
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            type="text"
            id="phone"
            value={phone}
            readOnly 
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter phone number"
          />
        </div>
      </div>
    </div>
  )
}

export default ServTickInputField

