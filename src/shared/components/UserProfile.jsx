import React from "react";
import "./UserProfile.css";

const BodyContent = ({ employee_id }) => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const {
        first_name,
        last_name,
        email,
        status,
        type,
        roles = []
    } = storedUser || {};

    const { role_name, description, permissions } = storedUser.role || {};

    return (
        <div className="usrprofile">
            <div className="body-content-container">
                <h2 className="title">User Profile</h2>

                <div className="user-details">
                    <p><strong>Name:</strong> {first_name} {last_name}</p>
                    <p><strong>Email:</strong> {email}</p>
                    <p><strong>Status:</strong> {status}</p>
                    <p><strong>Type:</strong> {type}</p>
                    <p><strong>Employee ID:</strong> {employee_id}</p>
                </div>

                <div className="role-details">
                    <h3>Role Details</h3>
                    <p><strong>Position:</strong> {role_name}</p>
                    <p><strong>Job Description:</strong> {description}</p>
                    <p><strong>Module Permissions:</strong> {Array.isArray(permissions) ? permissions.join(", ") : permissions}</p>
                </div>

                <div className="password-section">
                    <h3>Change Password</h3>
                    <input type="password" placeholder="Current Password" className="input" />
                    <input type="password" placeholder="New Password" className="input" />
                    <input type="password" placeholder="Confirm New Password" className="input" />
                    <button className="change-password-btn">Change Password</button>
                </div>
            </div>
        </div>
    );
};

export default BodyContent;
