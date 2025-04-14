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
    } = storedUser || {};

    const { role_name, description, permissions } = storedUser.role || {};

    return (
        <div className="usrprofile">

            <div className="user-details-container">
                <img src="/images/userProfileDesign.png" />
                <div className="user-image">{first_name?.charAt(0)}</div>
                <div className="user-details">
                    <div className="user-name-email">
                        <div className="user-name">{first_name} {last_name}</div>
                        <div className="user-email">{email}</div>
                    </div>
                    <div className="user-position">{role_name}</div>
                </div>

            </div>
            <div className="password-kinetiq-container">
                <div className="password-section">
                    <h3>Change Password</h3>
                    <input type="password" placeholder="Current Password" className="input" />
                    <input type="password" placeholder="New Password" className="input" />
                    <input type="password" placeholder="Confirm New Password" className="input" />
                    <button className="change-password-btn">Change Password</button>
                </div>
                <div className="role-details">
                    <h3>EMPLOYEE DETAILS</h3>
                    <p><strong>&gt;&nbsp;Status:&nbsp;</strong> {status}</p>
                    <p><strong>&gt;&nbsp;Type:&nbsp;</strong> {type}</p>
                    <p><strong>&gt;&nbsp;Employee ID:&nbsp;</strong> {employee_id}</p>

                    <div className="user-description-item">
                        <p><strong>&gt;&nbsp;Job Description:</strong></p>
                        <p className="user-desc">{description}</p>
                    </div>
                    <div className="user-description-item">
                        <p><strong>&gt;&nbsp;Module Permissions:</strong></p>
                        <p>{Array.isArray(permissions) ? permissions.join(", ") : permissions}</p>
                    </div>
                </div>
            </div>



        </div>
    );
};

export default BodyContent;
