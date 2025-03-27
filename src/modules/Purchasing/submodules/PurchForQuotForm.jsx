import React, { useState } from "react";
import "../styles/PurchForQuotForm.css";

const PurchForQuotForm = () => {
    const [formData, setFormData] = useState({
        partnerCode: "0035",
        documentNumber: "RFQ0000",
        vendorName: "Durowell Pro Ltd.",
        status: "Open",
        contactPerson: "Son Goku",
        documentDate: "01/25/2025",
        currency: "Philippine Peso",
        validUntil: "02/02/25",
        requiredDate: "01/31/25",
        buyer: "Peter Fanio",
        owner: "Me",
        deliveryLocation: "Me",
        remarks: "Please Deliver ASAP",
        totalAmount: "120.00",
        discountPercentage: "1%",
        freight: "1620.00",
        tax: "2.00",
        totalPaymentDue: "2.00"
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="purchquoteform">
            <div className="body-content-container">
                <div className="purchquoteform-header">
                    <button className="purchquoteform-back">← Back</button>
                    <h2 className="purchquoteform-title">Request For Quotation Form</h2>
                    <button className="purchquoteform-send">Send To</button>
                </div>

                <div className="purchquoteform-content">
                    <div className="purchquoteform-grid">
                        <div className="form-group">
                            <label>Partner Code*</label>
                            <input 
                                type="text" 
                                name="partnerCode"
                                value={formData.partnerCode}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Document Number*</label>
                            <input 
                                type="text" 
                                name="documentNumber"
                                value={formData.documentNumber}
                                onChange={handleInputChange}
                                className="gray-bg"
                            />
                        </div>
                        <div className="form-group">
                            <label>Vendor Name</label>
                            <input 
                                type="text" 
                                name="vendorName"
                                value={formData.vendorName}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Status</label>
                            <input 
                                type="text" 
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Contact Person</label>
                            <input 
                                type="text" 
                                name="contactPerson"
                                value={formData.contactPerson}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Document Date</label>
                            <input 
                                type="text" 
                                name="documentDate"
                                value={formData.documentDate}
                                onChange={handleInputChange}
                                className="gray-bg"
                            />
                        </div>
                        <div className="form-group">
                            <label>Currency</label>
                            <input 
                                type="text" 
                                name="currency"
                                value={formData.currency}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Valid until</label>
                            <input 
                                type="text" 
                                name="validUntil"
                                value={formData.validUntil}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Required Date</label>
                            <input 
                                type="text" 
                                name="requiredDate"
                                value={formData.requiredDate}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <div className="purchquoteform-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Item No.</th>
                                    <th>Material Name</th>
                                    <th>Material Quantity</th>
                                    <th>UoM</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1</td>
                                    <td>Chair</td>
                                    <td>1</td>
                                    <td>3</td>
                                    <td>-</td>
                                </tr>
                                <tr>
                                    <td>2</td>
                                    <td>Chair</td>
                                    <td>1</td>
                                    <td>3</td>
                                    <td>-</td>
                                </tr>
                                <tr>
                                    <td>3</td>
                                    <td>Chair</td>
                                    <td>1</td>
                                    <td>3</td>
                                    <td>-</td>
                                </tr>
                            </tbody>
                        </table>
                        <button className="purchquoteform-add-item">Add Item</button>
                    </div>

                    <div className="purchquoteform-details">
                        <div className="details-left">
                            <div className="form-group">
                                <label>Buyer</label>
                                <input 
                                    type="text" 
                                    name="buyer"
                                    value={formData.buyer}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Owner</label>
                                <input 
                                    type="text" 
                                    name="owner"
                                    value={formData.owner}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Delivery Location</label>
                                <input 
                                    type="text" 
                                    name="deliveryLocation"
                                    value={formData.deliveryLocation}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Remarks</label>
                                <textarea 
                                    name="remarks"
                                    value={formData.remarks}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <div className="details-right">
                            <div className="form-group">
                                <label>Total Amount</label>
                                <input 
                                    type="text" 
                                    name="totalAmount"
                                    value={formData.totalAmount}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Discount Percentage</label>
                                <input 
                                    type="text" 
                                    name="discountPercentage"
                                    value={formData.discountPercentage}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Freight</label>
                                <input 
                                    type="text" 
                                    name="freight"
                                    value={formData.freight}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Tax</label>
                                <input 
                                    type="text" 
                                    name="tax"
                                    value={formData.tax}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Total Payment Due</label>
                                <input 
                                    type="text" 
                                    name="totalPaymentDue"
                                    value={formData.totalPaymentDue}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="purchquoteform-footer">
                    <button className="purchquoteform-copy">Copy From</button>
                </div>
            </div>
        </div>
    );
};

export default PurchForQuotForm;
