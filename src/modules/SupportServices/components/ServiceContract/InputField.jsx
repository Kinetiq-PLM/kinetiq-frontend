"use client"

const InputField = ({
  contractId,
  setContractId,
  productId,
  setProductId,
  productName,
  setProductName,
  productQuantity,
  setProductQuantity,
  customerId,
  setCustomerId,
  phoneNumber,
  setPhoneNumber,
  name,
  setName,
  emailAddress,
  setEmailAddress,
}) => {
  return (
    <div className="input-fields-container">
      <div className="form-column">
        <div className="form-group">
          <label htmlFor="contractId">Contract ID</label>
          <input
            type="text"
            id="contractId"
            value={contractId}
            onChange={(e) => setContractId(e.target.value)}
            placeholder="Enter contract ID"
          />
        </div>

        <div className="form-group">
          <label htmlFor="productName">Product Name</label>
          <input
            type="text"
            id="productName"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="Enter product name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="customerId">Customer ID</label>
          <input
            type="text"
            id="customerId"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            placeholder="Enter customer ID"
          />
        </div>

        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name"
          />
        </div>
      </div>

      <div className="form-column">
        <div className="form-group">
          <label htmlFor="productId">Product ID</label>
          <input
            type="text"
            id="productId"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            placeholder="Enter product ID"
          />
        </div>

        <div className="form-group">
          <label htmlFor="productQuantity">Product Quantity</label>
          <input
            type="text"
            id="productQuantity"
            value={productQuantity}
            onChange={(e) => setProductQuantity(e.target.value)}
            placeholder="Enter product quantity"
          />
        </div>

        <div className="form-group">
          <label htmlFor="phoneNumber">Phone Number</label>
          <input
            type="text"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Enter phone number"
          />
        </div>

        <div className="form-group">
          <label htmlFor="emailAddress">Email Address</label>
          <input
            type="email"
            id="emailAddress"
            value={emailAddress}
            onChange={(e) => setEmailAddress(e.target.value)}
            placeholder="Enter email address"
          />
        </div>
      </div>
    </div>
  )
}

export default InputField

