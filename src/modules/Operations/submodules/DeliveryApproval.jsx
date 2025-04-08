import React, { useState, useEffect } from "react";
import "../styles/DeliveryApproval.css";




const BodyContent = () => {
    const [approvalStatus, setApprovalStatus] = useState("Pending");
    const [approvalDate, setApprovalDate] = useState("");
    const [approvedBy, setApprovedBy] = useState("");


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
            alert("Please select a record to update.");
            return;
        }
        const approval_status = selectedData.approval_status;
        const approval_date = current_date;
        const approved_by = selectedData.approved_by;

        if (
            approval_date === "" ||
            approved_by === "" ||
            approved_by === null
        ) {
            alert("All fields must have a value.");
            return;
        }

        const updatePayload = {
            approval_status,
            approval_date,
            approved_by
        };
        try {
            const response = await fetch(`http://127.0.0.1:8000/operation/update-delivery-approval/${selectedData.approval_request_id}/`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updatePayload)
            });
   
            if (!response.ok) throw new Error("Failed to update record.");
            fetchData();
        } catch (error) {
            console.error("Update error:", error);
            alert("Error updating approval status.");
        }
        fetchData();
        
    };

    //Table Data
    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null); // Reset error state
   
            const response = await fetch("http://127.0.0.1:8000/operation/delivery-approval/");
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
          const response = await fetch("http://127.0.0.1:8000/operation/supplier/");
          if (!response.ok) throw new Error("Connection to database failed");
    
          const data = await response.json();
    
          if (!Array.isArray(data.employees)) throw new Error("Invalid goods data format");
          setEmployeeList(data.employees)
    
        } catch (error) {
          alert(error.message);
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
                            {deliveryapproval_data.length > 0 ? (
                                deliveryapproval_data.map((row, index) => (
                                <tr>
                                    <td>
                                        <input
                                            type="checkbox"  
                                            checked={selectedRow === index}
                                            onChange={() => handleCheckboxChange(index, row)}/>
                                    </td>
                                    <td>{row.approval_request_id}</td>
                                    <td>{row.request_date}</td>
                                    <td>{row.approval_status}</td>
                                    <td>{row.approval_date}</td>
                                    <td>
                                        {employeeList.find(employee => employee.employee_id === row.approved_by)?.employee_name || "-----"}
                                    </td>
                                </tr>
                                ))
                            ) : (
                                <tr>
                                <td>No records found.</td>
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
                            <label>Delivery Request ID</label>
                            <span>{selectedData?.approval_request_id || ""}</span>
                        </div>
                        <div className="form-group date-requested">
                            <label>Delivery Request</label>
                            <span>{selectedData?.request_date || ""}</span>
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
                                type="date"
                                value={current_date}
                                onChange={(e) => setSelectedData({ ...selectedData, approval_date: e.target.value })}
                                readOnly
                            />
                            
                        </div>
                        <div className="form-group">
                            <label>Approved By</label>
                            <select
                                value={selectedData?.approved_by || ""}
                                onChange={(e) => setSelectedData({ ...selectedData, approved_by: e.target.value })}
                            >
                                <option value="">Approved by</option>
                                {loading ? (
                                    <option value="">Loading employees...</option>
                                ) : (
                                    employeeList.map((employee) => (
                                    <option key={employee.employee_id} value={employee.employee_id}>
                                        {employee.employee_name}
                                    </option>
                                    ))
                                )}
                            </select>
                        </div>
                    </div>
                </div>
                {/* End of Form Container */}




                {/* Send To Button (Outside Form Container) */}
                <div className="send-to-button-container">
                    <button className="send-to-button" onClick={handleSubmit}>Send</button>
                </div>




            </div>
        </div>
    );
};




export default BodyContent;









