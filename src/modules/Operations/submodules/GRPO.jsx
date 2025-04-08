import React, { useState } from "react";
import "../styles/GRPO.css";

const GRPO = () => {
    const [activeTab, setActiveTab] = useState("document_details");
    const [vendorDetails, setVendorDetails] = useState({
        vendorCode: "0035",
        vendorName: "DuraWell Pro Ltd.",
        contactPerson: "Xzanelle Garcia",
        buyer: "Charlotte Dixon",
        owner: "Paul Robles"
    });
    const [documentDetails, setDocumentDetails] = useState({
        transactionId: "0035",
        postingDate: "2025-01-31",
        documentNo: "0043",
        deliveryDate: "2025-02-02",
        status: "Open",
        documentDate: "2025-01-31"
    });
    const [costDetails, setCostDetails] = useState({
        initialAmount: "1620.00",
        taxRate: "12%",
        discountRate: "5%",
        taxAmount: "194.40",
        discountAmount: "81.00",
        total: "1833.40",
        freight: "100.00"
    });

    const handleDocumentChange = (e) => {
        setDocumentDetails({ ...documentDetails, [e.target.name]: e.target.value });
    };

    const handleCostChange = (e) => {
        setCostDetails({ ...costDetails, [e.target.name]: e.target.value });
    };

    return (
        <div className="grpo">
        <div className="body-content-container">
            <div className="operation_details_container">
                <div className="operation_section operation_boxed" style={{ flexBasis: 'auto', maxWidth: '400px' }}>
                    <div className="vendor_details">
                        <label>Vendor Code</label>
                        <input type="text" name="vendorCode" value={vendorDetails.vendorCode} onChange={handleDocumentChange} />
                        <label>Vendor Name</label>
                        <input type="text" name="vendorName" value={vendorDetails.vendorName} onChange={handleDocumentChange} />
                        <label>Contact Person</label>
                        <input type="text" name="contactPerson" value={vendorDetails.contactPerson} onChange={handleDocumentChange} />
                        <label>Buyer</label>
                        <input type="text" name="buyer" value={vendorDetails.buyer} onChange={handleDocumentChange} />
                        <label>Owner</label>
                        <input type="text" name="owner" value={vendorDetails.owner} onChange={handleDocumentChange} />
                    </div>
                </div>

                <div className="operation_section document_cost_section operation_boxed">
                    <div className="operation_tabs">
                        <h3 className={`operation_tab ${activeTab === "document_details" ? "active" : ""}`} onClick={() => setActiveTab("document_details")}>Document Details</h3>
                        <h3 className={`operation_tab ${activeTab === "cost_details" ? "active" : ""}`} onClick={() => setActiveTab("cost_details")}>Cost Details</h3>
                    </div>

                    {activeTab === "document_details" && (
                        <div className="operation_box operation_document_grid">
                            <div><label>Transaction ID</label><input type="text" name="transactionId" value={documentDetails.transactionId} onChange={handleDocumentChange} /></div>
                            <div><label>Posting Date</label><input type="date" name="postingDate" value={documentDetails.postingDate} onChange={handleDocumentChange} /></div>
                            <div><label>Document No.</label><input type="text" name="documentNo" value={documentDetails.documentNo} onChange={handleDocumentChange} /></div>
                            <div><label>Delivery Date</label><input type="date" name="deliveryDate" value={documentDetails.deliveryDate} onChange={handleDocumentChange} /></div>
                            <div><label>Status</label><select name="status" value={documentDetails.status} onChange={handleDocumentChange}><option>Open</option><option>Closed</option></select></div>
                            <div><label>Document Date</label><input type="date" name="documentDate" value={documentDetails.documentDate} onChange={handleDocumentChange} /></div>
                        </div>
                    )}

                    {activeTab === "cost_details" && (
                        <div className="operation_box operation_cost_grid">
                            <div><label>Initial Amount</label><input type="text" name="initialAmount" value={costDetails.initialAmount} onChange={handleCostChange} /></div>
                            <div><label>Tax Rate</label><input type="text" name="taxRate" value={costDetails.taxRate} onChange={handleCostChange} /></div>
                            <div><label>Discount Rate</label><input type="text" name="discountRate" value={costDetails.discountRate} onChange={handleCostChange} /></div>
                            <div><label>Tax Amount</label><input type="text" name="taxAmount" value={costDetails.taxAmount} onChange={handleCostChange} /></div>
                            <div><label>Discount Amount</label><input type="text" name="discountAmount" value={costDetails.discountAmount} onChange={handleCostChange} /></div>
                            <div><label>Total</label><input type="text" name="total" value={costDetails.total} onChange={handleCostChange} /></div>
                            <div><label>Freight</label><input type="text" name="freight" value={costDetails.freight} onChange={handleCostChange} /></div>
                        </div>
                    )}
                </div>
            </div>

            
            
                <div className="operation_table_container">
                    <table className="operation_table">
                        <thead>
                            <tr>
                                <th></th>
                                <th>No.</th>
                                <th>Material ID <span className="required">*</span></th>
                                <th>Material Name <span className="required">*</span></th>
                                <th>UoM <span className="required">*</span></th>
                                <th>Quantity <span className="required">*</span></th>
                                <th>Cost Per Unit <span className="required">*</span></th>
                                <th>Total <span className="required">*</span></th>
                                <th>Manufacturing Date <span className="required">*</span></th>
                                <th>Expiry Date <span className="required">*</span></th>
                                <th>Warehouse Location <span className="required">*</span></th>
                                <th>Batch No. <span className="required">*</span></th>
                                <th>Serial No. <span className="required">*</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><input type="checkbox" /></td>
                                <td>1</td>
                                <td>RM039</td>
                                <td>Circuit Boards</td>
                                <td>PIECE</td>
                                <td>3</td>
                                <td>290.00</td>
                                <td>870.00</td>
                                <td>A1</td>
                                <td>B123</td>
                                <td>01-23-25</td>
                                <td>01-23-29</td>
                                <td>...</td>
                            </tr>
                            <tr>
                                <td><input type="checkbox" /></td>
                                <td>2</td>
                                <td>RM042</td>
                                <td>LCD Screen</td>
                                <td>PIECE</td>
                                <td>5</td>
                                <td>150.00</td>
                                <td>750.00</td>
                                <td>B2</td>
                                <td>B456</td>
                                 <td>01-23-29</td>
                                 <td>01-23-29</td>
                                <td>...</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            
            <div className="operation_buttons">
    <button className="operation_btn">Copy From</button>
    <button className="operation_btn">Copy To</button>
    <button className="operation_btn cancel">Cancel</button> {}
    <button className="operation_btn send">Send To</button>
</div>
    </div>
    </div>
     
    );
};

export default GRPO;