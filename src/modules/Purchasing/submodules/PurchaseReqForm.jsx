import React, { useState } from "react";
import "../styles/PurchaseReqForm.css";

const PurchaseReqForm = ({ onClose }) => {
    const [formData, setFormData] = useState({
        name: "",
        department: "",
        email: "",
        requestType: "PROJECT",
        dateRequested: "",
        dateValid: "",
        documentDate: ""
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleBack = () => {
        onClose();
    };

    const handleSubmit = () => {
        // Add form submission logic here
        console.log("Form submitted:", formData);
    };

    const handleCancel = () => {
        onClose();
    };

    return (
        <div className="purchase-req-form">
            <div className="form-container">
                <div className="form-header">
                    <button className="back-btn" onClick={handleBack}>
                        <span>←</span> Back
                    </button>
                    <h1>PURCHASE REQUEST FORM</h1>
                </div>

                <div className="form-content">
                    <div className="form-left">
                        <div className="form-group">
                            <label>Name<span className="required">*</span></label>
                            <input 
                                type="text" 
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Enter name" 
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>Department<span className="required">*</span></label>
                            <select 
                                name="department"
                                value={formData.department}
                                onChange={handleInputChange}
                            >
                                <option value="">Select department</option>
                            </select>
                        </div>
                        
                        <div className="form-group">
                            <label>Email Address</label>
                            <input 
                                type="email" 
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="Enter email address" 
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>Request Type</label>
                            <select 
                                name="requestType"
                                value={formData.requestType}
                                onChange={handleInputChange}
                            >
                                <option value="PROJECT">PROJECT</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-right">
                        <div className="form-group">
                            <label>Date Requested</label>
                            <div className="date-input-wrapper">
                                <input 
                                    type="text" 
                                    name="dateRequested"
                                    value={formData.dateRequested}
                                    onChange={handleInputChange}
                                    placeholder="MM/DD/YYYY"
                                    onFocus={(e) => e.target.type = 'date'}
                                    onBlur={(e) => e.target.type = 'text'}
                                />
                                <span className="calendar-icon"></span>
                            </div>
                        </div>
                        
                        <div className="form-group">
                            <label>Date Valid</label>
                            <div className="date-input-wrapper">
                                <input 
                                    type="text" 
                                    name="dateValid"
                                    value={formData.dateValid}
                                    onChange={handleInputChange}
                                    placeholder="MM/DD/YYYY"
                                    onFocus={(e) => e.target.type = 'date'}
                                    onBlur={(e) => e.target.type = 'text'}
                                />
                                <span className="calendar-icon"></span>
                            </div>
                        </div>
                        
                        <div className="form-group">
                            <label>Document Date</label>
                            <div className="date-input-wrapper">
                                <input 
                                    type="text" 
                                    name="documentDate"
                                    value={formData.documentDate}
                                    onChange={handleInputChange}
                                    placeholder="MM/DD/YYYY"
                                    onFocus={(e) => e.target.type = 'date'}
                                    onBlur={(e) => e.target.type = 'text'}
                                />
                                <span className="calendar-icon"></span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Item No.</th>
                                <th>Material Name</th>
                                <th>Material Description</th>
                                <th>Quantity</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>Chair</td>
                                <td>Made Of Wood</td>
                                <td>1000</td>
                            </tr>
                            <tr>
                                <td>2</td>
                                <td>Wooden Table</td>
                                <td>Made Of Wood</td>
                                <td>1000</td>
                            </tr>
                            <tr>
                                <td>3</td>
                                <td>Door</td>
                                <td>Made Of Wood</td>
                                <td>1000</td>
                            </tr>
                            <tr className="empty-row">
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="button-container">
                    <button className="cancel-btn purchreqform-btn purchreqform-btn-cancel" onClick={handleCancel}>Cancel</button>
                    <button className="submit-btn purchreqform-btn purchreqform-btn-submit" onClick={handleSubmit}>Submit</button>
                </div>
            </div>
        </div>
    );
};

export default PurchaseReqForm;
