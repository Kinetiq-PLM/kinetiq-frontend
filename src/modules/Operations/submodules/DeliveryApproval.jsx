import React, { useState } from "react";
import "../styles/DeliveryApproval.css";


const BodyContent = () => {
    const [approvalStatus, setApprovalStatus] = useState("Pending");
    const [approvalDate, setApprovalDate] = useState("");
    const [approvedBy, setApprovedBy] = useState("");


    return (
        <div className="deliveryApproval">
            <div className="body-content-container">


                {/* Table Container */}
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th></th>
                                <th>ID</th>
                                <th>Date Requested</th>
                                <th>Approval Status</th>
                                <th>Approval Date</th>
                                <th>Approved By</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><input type="checkbox" className="custom-checkbox" /></td>
                                <td>1</td>
                                <td>03/20/25</td>
                                <td className="approval-status pending">Pending</td>
                                <td>--</td>
                                <td>--</td>
                            </tr>
                            <tr>
                                <td><input type="checkbox" className="custom-checkbox" /></td>
                                <td>2</td>
                                <td>03/18/25</td>
                                <td className="approval-status approved">Approved</td>
                                <td>03/19/25</td>
                                <td>Admin</td>
                            </tr>
                            <tr>
                                <td><input type="checkbox" className="custom-checkbox" /></td>
                                <td>3</td>
                                <td>03/22/25</td>
                                <td className="approval-status pending">Pending</td>
                                <td>--</td>
                                <td>--</td>
                            </tr>
                            <tr>
                                <td><input type="checkbox" className="custom-checkbox" /></td>
                                <td>4</td>
                                <td>03/21/25</td>
                                <td className="approval-status approved">Approved</td>
                                <td>03/22/25</td>
                                <td>Manager</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                {/* End of Table Container */}


                {/* Form Container */}
                <div className="form-container">
                    <div className="form-row">
                        <div className="form-group">
                            <label>ID</label>
                            <span>1</span>
                        </div>
                        <div className="form-group date-requested">
                            <label>Delivery Request</label>
                            <span>03/20/25</span>
                        </div>
                        <div className="form-group spacer"></div> {/* Empty space for alignment */}
                    </div>


                    <div className="form-row">
                        <div className="form-group">
                            <label>Approval Status</label>
                            <select
                                value={approvalStatus}
                                onChange={(e) => setApprovalStatus(e.target.value)}
                            >
                                <option value="Pending">Pending</option>
                                <option value="Approved">Approved</option>
                            </select>
                        </div>
                        <div className="form-group approval-date">
                            <label>Approval Date</label>
                            <input
                                type="date"
                                value={approvalDate}
                                onChange={(e) => setApprovalDate(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Approved By</label>
                            <input
                                type="text"
                                value={approvedBy}
                                onChange={(e) => setApprovedBy(e.target.value)}
                            />
                        </div>
                    </div>
                </div>  
                {/* End of Form Container */}
  

                {/* Send To Button (Outside Form Container) */}
                <div className="send-to-button-container">
                    <button className="send-to-button">Send To</button>
                </div>


            </div>
        </div>
    );
};


export default BodyContent;



