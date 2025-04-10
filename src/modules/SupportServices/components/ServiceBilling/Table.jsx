"use client"

const Table = ({ billings, onRowClick, onViewBilling, selectedBilling }) => {
  return (
    <div className="table-container">
        <table className="billings-table">
          <thead>
            <tr>
              <th>Billing ID</th>
              <th>Customer Name</th>
              <th>Billing Amount</th>
              <th>Total Payable</th>
              <th>Status</th>
              <th>Date Paid</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {billings.map((billing, index) => (
              <tr 
                key={billing.service_billing_id || `billing-${index}`} 
                className={`${
                  selectedBilling?.service_billing_id === billing.service_billing_id ? "selected-row" : ""
                } ${index % 2 !== 0 ? "alternate-row" : ""}`}
                onClick={() => onRowClick(billing)} 
                style={{ cursor: "pointer" }} 
              >
                <td>{billing.service_billing_id}</td>
                <td>
                  {
                    billing.service_request
                      ? billing.service_request.customer?.name
                      : billing.renewal
                        ? billing.renewal.service_call?.customer?.name
                        : "Unknown"
                  }
                </td>
                <td>{billing.service_billing_amount}</td>
                <td>{billing.total_payable}</td>
                <td>{billing.billing_status}</td>
                <td>{billing.date_paid}</td>
                <td>
                  <button className="view-button" onClick={() => onViewBilling(billing)}>
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
    </div>
  )
}

export default Table

