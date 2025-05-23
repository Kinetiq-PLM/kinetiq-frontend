import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Slide } from 'react-toastify';

import "../styles/DeliveryApproval.css";

const BodyContent = ({employee_id}) => {
    const [approvalStatus, setApprovalStatus] = useState("Pending");
    const [approvalDate, setApprovalDate] = useState("");
    const [approvedBy, setApprovedBy] = useState("");
    const [activeTab, setActiveTab] = useState("All");

    const current = new Date();
    const current_date = `${current.getFullYear()}-${(current.getMonth() + 1).toString().padStart(2, '0')}-${current.getDate().toString().padStart(2, '0')}`;

    const [deliveryapproval_data, setTableData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);
    const [selectedData, setSelectedData] = useState(null);
    const [employeeList, setEmployeeList] = useState([]);
    const [selectedApprovalBy, setSelectedApprovalBy] = useState("");

    const handleCheckboxChange = (index, row) => {
        setSelectedRow(index);
        setSelectedData(row);
    };


    //Update logistics
    const handleSubmit = async () => {

        if (!selectedData) {
            toast.error("Please select a record to update. ")
            return;
        }
        if (selectedData.approval_status != "Approved"){
            toast.error("Please set the status to 'Approved' before saving.")
            return
        }
        const approval_status = selectedData.approval_status;
        const approval_date = current_date;
        const approved_by = employee_id


        if (
            approval_date === "" ||
            approved_by === "" ||
            approved_by === null
        ) {
            toast.error("All fields must have a value." + approval_date + approved_by + approved_by);
            return;
        }


        const updatePayload = {
            approval_status,
            approval_date,
            approved_by
        };
        try {
            const response = await fetch(`https://js6s4geoo2.execute-api.ap-southeast-1.amazonaws.com/dev/operation/update-delivery-approval/${selectedData.approval_request_id}/`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updatePayload)
            });
   
            if (!response.ok) throw new Error("Failed to update record.");
            fetchData();
            toast.success("Data updated sucessfully");
        } catch (error) {
            toast.error("Error updating approval status:", error);
        }
        fetchData();
       
    };


    //Table Data
    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null); // Reset error state
   
            const response = await fetch("https://js6s4geoo2.execute-api.ap-southeast-1.amazonaws.com/dev/operation/delivery-approval/");
            if (!response.ok) throw new Error("Connection to database failed");
   
            const data = await response.json();
            if (!Array.isArray(data)) throw new Error("Invalid delivery approval data format");
   
            setTableData(data);
            if (data.length > 0){
                setSelectedRow(0);
                setSelectedData(data[0]);
            }
               
        } catch (error) {
            if (error.name !== "AbortError") setError(error.message);
        } finally {
            setLoading(false);
        }
    };
   
    useEffect(() => {
        fetchData();
    }, []);

    const fetchEmployee = async () => {
        try {
          setLoading(true);
          const response = await fetch("https://js6s4geoo2.execute-api.ap-southeast-1.amazonaws.com/dev/operation/supplier/");
          if (!response.ok) throw new Error("Connection to database failed");
   
          const data = await response.json();
   
          if (!Array.isArray(data.employees)) throw new Error("Invalid goods data format");
          setEmployeeList(data.employees)
   
        } catch (error) {
            toast.error(error.message);
        } finally {
          setLoading(false);
        }
      };
      useEffect(() => {
        fetchEmployee();
       
      }, []);

    return (
        <div className="deliveryApproval">
            <div className="body-content-container">
                {/* Table Container */}
                <div className="table-container">
                <ToastContainer transition={Slide} />
                    <div className="tabs-container">
                        <div 
                            className={`tab ${activeTab === "All" ? "active" : ""}`}
                            onClick={() => setActiveTab("All")}
                        >
                            All
                        </div>
                        <div 
                            className={`tab ${activeTab === "Approved" ? "active" : ""}`}
                            onClick={() => setActiveTab("Approved")}
                        >
                            Approved
                        </div>
                        <div 
                            className={`tab ${activeTab === "Pending" ? "active" : ""}`}
                            onClick={() => setActiveTab("Pending")}
                        >
                            Pending
                        </div>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th></th>
                                <th>Request ID</th>
                                <th>Date Requested</th>
                                <th>Approval Status</th>
                                <th>Approval Date</th>
                                <th>Approved By</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                <td colSpan="7" className="text-center">Loading...</td>
                                </tr>
                            ) : deliveryapproval_data.length > 0 ? (
                                deliveryapproval_data
                                .filter(row => activeTab === "All" || row.approval_status === activeTab)
                                .map((row, index) => (
                                <tr key = {row.approval_request_id}>
                                    <td>
                                        <input
                                            type="checkbox"  
                                            checked={selectedRow === index}
                                            onChange={() => handleCheckboxChange(index, row)}/>
                                    </td>
                                    <td>{row.approval_request_id}</td>
                                    <td>{row.request_date}</td>
                                    <td className={`approval-status ${row.approval_status}`}>{row.approval_status}</td>
                                    <td>{row.approval_date}</td>
                                    <td>
                                        {employeeList.find(employee => employee.employee_id === row.approved_by)?.employee_name || "-----"}
                                    </td>
                                </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center text-gray-500">No records found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {/* End of Table Container */}
                {/* Form Container */}
                <div className="form-container">
                    <div className="form-row">
                        <div className="form-group">
                            <label>Request ID</label>
                            <span style={{ cursor: 'default' }} readOnly>{selectedData?.approval_request_id || ""}</span>
                        </div>
                        <div className="form-group date-requested">
                            <label>Delivery Request</label>
                            <span style={{ cursor: 'default' }} readOnly>{selectedData?.request_date || ""}</span>
                        </div>
                        <div className="form-group spacer"></div> {/* Empty space for alignment */}
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Approval Status</label>
                            <select
                                value={selectedData?.approval_status || ""}
                                onChange={(e) => setSelectedData({ ...selectedData, approval_status: e.target.value })}
                            >
                                <option value="Pending">Pending</option>
                                <option value="Approved">Approved</option>
                            </select>
                        </div>
                        <div className="form-group approval-date">
                            <label>Approval Date</label>
                            <input
                                className="req-input"
                                type="date"
                                value={selectedData?.approval_date || current_date}
                                onChange={(e) => setSelectedData({ ...selectedData, approval_date: e.target.value })}
                                style={{ cursor: 'default' }} readOnly
                            />
                        </div>
                        <div className="form-group">
                            <label>Approved By</label>
                            <span style={{ cursor: 'default' }} readOnly>
                                {employeeList.find(emp => emp.employee_id === (selectedData?.approved_by ?? employee_id))
                                    ?.employee_name || "-----"}
                            </span>
                        </div>
                    </div>
                </div>  
                {/* End of Form Container */}

                {/* Button Container */}
                <div className="send-to-button-container">
                    <button className="send-to-button" onClick={handleSubmit}>Save</button>
                </div>

            </div>
        </div>
    );
};

export default BodyContent;





















            