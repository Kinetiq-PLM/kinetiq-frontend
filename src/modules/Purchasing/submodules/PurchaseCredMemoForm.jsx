import React from "react";
import "../styles/PurchaseCredMemoForm.css";

const PurchaseCredMemoForm = ({ onClose }) => {
    const handleBack = () => {
        onClose?.();
    };

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
                                        <span>INT-001</span>
                                    </div>
                                    <div className="detail-row">
                                        <span>CREDIT MEMO DATE</span>
                                        <span>01/01/2025</span>
                                    </div>
                                    <div className="detail-row">
                                        <span>DOCUMENT NO.</span>
                                        <span>00001</span>
                                    </div>
                                    <div className="detail-row">
                                        <span>DUE DATE</span>
                                        <span>01/01/2025</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Credit Memo Total */}
                    <div className="total-section">
                        <h2>Credit Memo Total</h2>
                        <h2>200.00</h2>
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
                                <tr>
                                    <td>1</td>
                                    <td>Chair</td>
                                    <td>Comfortable Wooden Chair</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>-</td>
                                </tr>
                                <tr>
                                    <td>2</td>
                                    <td>Table</td>
                                    <td>Comfortable Wooden Table</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>-</td>
                                </tr>
                                <tr>
                                    <td>3</td>
                                    <td>Door</td>
                                    <td>Comfortable Woode Door</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>-</td>
                                </tr>
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
                            <div className="total-row">
                                <span>Subtotal:</span>
                                <span>1.00</span>
                            </div>
                            <div className="total-row">
                                <span>Discount (20%):</span>
                                <span>1.00</span>
                            </div>
                            <div className="total-row">
                                <span>Downpayment Rate</span>
                                <span>1.00</span>
                            </div>
                            <div className="total-row">
                                <span>Total Downpayment</span>
                                <span>1.00</span>
                            </div>
                            <div className="total-row">
                                <span>Shipping Cost:</span>
                                <span>1.00</span>
                            </div>
                            <div className="total-row">
                                <span>Tax Amount:</span>
                                <span>1.00</span>
                            </div>
                            <div className="total-row">
                                <span>Total:</span>
                                <span>1.00</span>
                            </div>
                            <div className="total-row">
                                <span>Amount Paid:</span>
                                <span>1.00</span>
                            </div>
                            <div className="total-row">
                                <span>Total Credit</span>
                                <span>1.00</span>
                            </div>
                            <div className="total-row">
                                <span>Credit Balance</span>
                                <span>1.00</span>
                            </div>
                            <div className="total-row balance-due">
                                <span>Balance Due:</span>
                                <span>1.00</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PurchaseCredMemoForm;
