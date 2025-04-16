import React from "react";
import "../styles/PurchaseCredMemoForm.css";

const PurchaseCredMemoForm = ({ memoData, onClose }) => {
    const handleBack = () => {
        onClose?.();
    };

    // Destructure the memoData to extract relevant fields
    const {
        credit_memo_id,
        purchase_order,
        document_no,
        document_date,
        due_date,
        total_credit,
        balance_due,
        items = []  // assuming the credit memo items are passed as an array
    } = memoData || {};

    return (
        <div className="purchase-cred-memo-form">
            <div className="purchase-cred-memo-form-body-content-container">
                {/* Header */}
                <div className="header">
                    <button className="back-btn" onClick={handleBack}>← Back</button>
                    <h1>Credit Memo</h1>
                </div>

                {/* Main Content */}
                <div className="content">
                    {/* Company and Customer Info */}
                    <div className="info-section">
                        <div className="company-info">
                            <h3>Kinetiq</h3>
                            <p>NCR</p>
                            <p>PH, Manila</p>
                        </div>

                        <div className="customer-info">
                            <div className="info-block">
                                <h3>CUSTOMER</h3>
                                <p>Goku</p>
                                <p>NCR</p>
                                <p>PH, Manila</p>
                            </div>

                            <div className="info-block">
                                <h3>SHIP TO</h3>
                                <p>Goku</p>
                                <p>NCR</p>
                                <p>Manila, PH</p>
                            </div>

                            <div className="info-block">
                                <div className="memo-details">
                                    <div className="detail-row">
                                        <span>CREDIT MEMO NO.</span>
                                        <span>{credit_memo_id}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span>CREDIT MEMO DATE</span>
                                        <span>{document_date}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span>DOCUMENT NO.</span>
                                        <span>{document_no}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span>DUE DATE</span>
                                        <span>{due_date}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Credit Memo Total */}
                    <div className="total-section">
                        <h2>Credit Memo Total</h2>
                        <h2>{total_credit}</h2>
                    </div>

                    {/* Items Table */}
                    <div className="table-container">
                        <table className="items-table">
                            <thead>
                                <tr>
                                    <th>Item No.</th>
                                    <th>Material Name</th>
                                    <th>Description</th>
                                    <th>Unit Price</th>
                                    <th>Quantity</th>
                                    <th>UoM</th>
                                    <th>Downpayment Rate</th>
                                    <th>Tax Rate</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.length > 0 ? items.map((item, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item.material_name}</td>
                                        <td>{item.description}</td>
                                        <td>{item.unit_price}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.uom}</td>
                                        <td>{item.downpayment_rate}</td>
                                        <td>{item.tax_rate}</td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="8">No items found</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer Section */}
                    <div className="footer-section">
                        <div className="terms-section">
                            <h3>TERMS & CONDITIONS</h3>
                            <p>Payment is due within 30 days</p>
                            <div className="bank-info">
                                <p>Bank Name</p>
                                <p>Account Number: 1234567</p>
                                <p>Routing: 1234567</p>
                            </div>
                        </div>

                        <div className="totals-section">
                            {/* Assuming all the totals data like subtotal, discount, etc., comes from the API as well */}
                            <div className="total-row">
                                <span>Subtotal:</span>
                                <span>{total_credit}</span>
                            </div>
                            <div className="total-row">
                                <span>Discount (20%):</span>
                                <span>{total_credit * 0.2}</span>
                            </div>
                            <div className="total-row">
                                <span>Total Credit:</span>
                                <span>{total_credit - total_credit * 0.2}</span>
                            </div>
                            <div className="total-row">
                                <span>Balance Due:</span>
                                <span>{balance_due}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PurchaseCredMemoForm;
