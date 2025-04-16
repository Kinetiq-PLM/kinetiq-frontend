import React from "react";
import "./UserProfile.css";
import { useState } from "react";

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
  const [showCurrPassword, setShowCurrPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConPassword, setShowConPassword] = useState(false);

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
          <h3 className="reset-pass">Change Password</h3>
          <div className="pass-wrapper">
            <input type={showCurrPassword ? "text" : "password"} name="curr-pass" placeholder="Current Password" className="input" />
            <span className="eye-icon" onClick={() => setShowCurrPassword(!showCurrPassword)}>
              {showCurrPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                  <path fill="none" stroke="currentColor" strokeWidth="2" d="M3 3l18 18M10.5 10.5a3 3 0 004.5 4.5M12 5c-4.418 0-8.209 2.865-10 6.5a10.05 10.05 0 002.015 2.881M12 19c4.418 0 8.209-2.865 10-6.5a10.05 10.05 0 00-2.015-2.881" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                  <path fill="none" stroke="currentColor" strokeWidth="2" d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
                  <circle fill="none" stroke="currentColor" strokeWidth="2" cx="12" cy="12" r="3" />
                </svg>
              )}
            </span>
          </div>

          <div className="pass-wrapper">
            <input type={showNewPassword ? "text" : "password"} name="new-pass" placeholder="New Password" className="input" />
            <span className="eye-icon" onClick={() => setShowNewPassword(!showNewPassword)}>
              {showNewPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                  <path fill="none" stroke="currentColor" strokeWidth="2" d="M3 3l18 18M10.5 10.5a3 3 0 004.5 4.5M12 5c-4.418 0-8.209 2.865-10 6.5a10.05 10.05 0 002.015 2.881M12 19c4.418 0 8.209-2.865 10-6.5a10.05 10.05 0 00-2.015-2.881" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                  <path fill="none" stroke="currentColor" strokeWidth="2" d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
                  <circle fill="none" stroke="currentColor" strokeWidth="2" cx="12" cy="12" r="3" />
                </svg>
              )}
            </span>
          </div>
          <div className="pass-wrapper">
            <input type={showConPassword ? "text" : "password"} name="con-pass" placeholder="Confirm New Password" className="input" />
            <span className="eye-icon" onClick={() => setShowConPassword(!showConPassword)}>
              {showConPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                  <path fill="none" stroke="currentColor" strokeWidth="2" d="M3 3l18 18M10.5 10.5a3 3 0 004.5 4.5M12 5c-4.418 0-8.209 2.865-10 6.5a10.05 10.05 0 002.015 2.881M12 19c4.418 0 8.209-2.865 10-6.5a10.05 10.05 0 00-2.015-2.881" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                  <path fill="none" stroke="currentColor" strokeWidth="2" d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
                  <circle fill="none" stroke="currentColor" strokeWidth="2" cx="12" cy="12" r="3" />
                </svg>
              )}
            </span>
          </div>

          <button className="change-password-btn">Confirm</button>
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
