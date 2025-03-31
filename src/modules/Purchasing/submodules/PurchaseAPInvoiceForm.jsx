import React from "react";
import "../styles/PurchaseAPInvoiceForm.css";

const PurchaseAPInvoiceForm = ({ onClose }) => {
    const handleBack = () => {
        onClose();
    };

    const handleDone = () => {
        // Add done logic here
        console.log("Done button clicked");
    };

    return (
        <div className="purchase-ap-invoice-form">
            <div className="purchase-ap-invoice-form-body-content-container">
                {/* Header Section */}
                <div className="purchase-ap-invoice-header">
                    <button className="purchase-ap-invoice-back-btn" onClick={handleBack}>← Back</button>
                    <h1>Purchase Invoice</h1>
                </div>

                {/* Main Content */}
                <div className="purchase-ap-invoice-content">
                    {/* Company Logo and Details Section */}
                    <div className="purchase-ap-invoice-company-section">
                        <div className="purchase-ap-invoice-logo">
                            <img src="../images/kinetiq.png" alt="Kinetiq Logo" />
                        </div>
                        <div className="purchase-ap-invoice-details">
                            <div className="purchase-ap-invoice-info">
                                <label>Status</label>
                                <span>⊙ Pending</span>
                            </div>
                            <div className="purchase-ap-invoice-info">
                                <label>Invoice No.</label>
                                <span>001</span>
                            </div>
                            <div className="purchase-ap-invoice-info">
                                <label>Invoice Date</label>
                                <span>Jan. 01, 2025</span>
                            </div>
                            <div className="purchase-ap-invoice-info">
                                <label>Due</label>
                                <span>Jan. 01, 2025</span>
                            </div>
                        </div>
                    </div>

                    {/* From and To Section */}
                    <div className="purchase-ap-invoice-addresses">
                        <div className="purchase-ap-invoice-from">
                            <h3>From</h3>
                            <h2>Kinetiq</h2>
                            <p>Son Goku</p>
                            <p>SonGoku123@gmail.com</p>
                            <p>8970678878898</p>
                            <p>kinetiq.com</p>
                            <p>PH, Manila</p>
                        </div>
                        <div className="purchase-ap-invoice-to">
                            <div>
                                <h3>Bill To</h3>
                                <h2>Software Tech.</h2>
                                <p>SoftwareTech.com</p>
                                <p>8970678878898</p>
                                <p>LA, U.S</p>
                            </div>
                            <div>
                                <h3>Ship To</h3>
                                <p>LA, U.S</p>
                                <p>Track #: RO123456789</p>
                            </div>
                        </div>
                    </div>

                    {/* Items Table */}
                    <div className="purchase-ap-invoice-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Item No.</th>
                                    <th>Material Name</th>
                                    <th>Description</th>
                                    <th>Unit Price</th>
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
                                </tr>
                                <tr>
                                    <td>2</td>
                                    <td>Table</td>
                                    <td>Comfortable Wooden Table</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>-</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Payment and Total Section */}
                    <div className="purchase-ap-invoice-summary">
                        <div className="purchase-ap-invoice-payment">
                            <h3>Payment Instruction</h3>
                            <div className="payment-details">
                                <p>Kinetiq</p>
                                <p>Bank name: Kinetiq Bank</p>
                                <p>Account Number: 1234567</p>
                                <p>Ref. Number: 1234567</p>
                                <p>Routing: 1234567</p>
                                <p>Tax Code: 1234567</p>
                            </div>
                        </div>
                        <div className="purchase-ap-invoice-totals">
                            <div className="total-row">
                                <span>Subtotal:</span>
                                <span>1.00</span>
                            </div>
                            <div className="total-row">
                                <span>Discount (20%):</span>
                                <span>1.00</span>
                            </div>
                            <div className="total-row">
                                <span>Downpayment Rate:</span>
                                <span>1.00</span>
                            </div>
                            <div className="total-row">
                                <span>Total Downpayment:</span>
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
                                <span>Total Credit:</span>
                                <span>1.00</span>
                            </div>
                            <div className="total-row">
                                <span>Credit Balance:</span>
                                <span>1.00</span>
                            </div>
                            <div className="total-row balance-due">
                                <span>Balance Due:</span>
                                <span>1.00</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Done Button */}
                <button className="purchase-ap-invoice-done-btn" onClick={handleDone}>Done</button>
            </div>
        </div>
    );
};

export default PurchaseAPInvoiceForm;
