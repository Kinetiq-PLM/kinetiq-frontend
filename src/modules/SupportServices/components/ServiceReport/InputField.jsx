"use client"

const InputField = ({
  ticketSubject,
  setTicketSubject,
  requestType,
  setRequestType,
  customerId,
  setCustomerId,
  name,
  setName,
  description,
  setDescription,
  renewalId,
  setRenewalId,
  billingId,
  setBillingId,
}) => {
  return (
    <div className="input-fields-container">
      <div className="input-column">
        <div className="form-group">
          <label htmlFor="ticketSubject">Ticket Subject</label>
          <input
            type="text"
            id="ticketSubject"
            value={ticketSubject}
            readOnly
            onChange={(e) => setTicketSubject(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="requestType">Request Type</label>
          <input
            type="text"
            id="requestType"
            value={requestType}
            readOnly
            onChange={(e) => setRequestType(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="customerId">Customer ID</label>
          <input
            type="text"
            id="customerId"
            value={customerId}
            readOnly
            onChange={(e) => setCustomerId(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            readOnly
            onChange={(e) => setName(e.target.value)}
          />
        </div>
      </div>

      <div className="input-column">
        <div className="form-group description-group">
          <label htmlFor="description">Description</label>
          <div className="textarea-container">
            <textarea
              id="description"
              value={description}
              readOnly
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              className="description-textarea"
            />
            <div className="custom-scrollbar-container">
              <button className="scroll-arrow scroll-up">▼</button>
              <div className="scroll-track">
                <div className="scroll-thumb"></div>
              </div>
              <button className="scroll-arrow scroll-down">▼</button>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="renewalId">Renewal ID</label>
          <input
            type="text"
            id="renewalId"
            value={renewalId}
            readOnly
            onChange={(e) => setRenewalId(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="billingId">Billing ID</label>
          <input
            type="text"
            id="billingId"
            value={billingId}
            onChange={(e) => setBillingId(e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}

export default InputField

