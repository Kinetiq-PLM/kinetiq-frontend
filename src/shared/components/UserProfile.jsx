import React from "react";
import "./UserProfile.css";
import { useState } from "react";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

const BodyContent = ({ employee_id }) => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const { first_name, last_name, email, status, type } = storedUser || {};

  const { role_name, description, permissions } = storedUser.role || {};
  const [showCurrPassword, setShowCurrPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConPassword, setShowConPassword] = useState(false);
  const [currPassword, setCurrPassword] = useState();
  const [newPassword, setNewPassword] = useState();
  const [conPassword, setConPassword] = useState();
  const [currPassErr, setCurrPassErr] = useState("");
  const [newPassErr, setNewPassErr] = useState("");
  const [conPassErr, setConPassErr] = useState("");
  const [openPopup, setOpenPopup] = useState(false);
  const [popupContent, setPopupContent] = useState(
    "Are you sure you want to change your password?"
  );
  const [isPassChanged, setIsPassChanged] = useState(false);

  const arePassFieldsValid = async () => {
    if (!newPassword || !conPassword || !currPassword) {
      if (!currPassword) {
        setCurrPassErr("* This field cannot be empty. *");
      }
      if (!newPassword) {
        setNewPassErr("* This field cannot be empty. *");
      }
      if (!conPassword) {
        setConPassErr("* This field cannot be empty. *");
      }
      return false;
    }
    if (newPassword.length < 8) {
      setNewPassErr("* Password must be at least 8 characters long. *");
      return false;
    }
    if (currPassword === newPassword) {
      setNewPassErr(
        "* New password cannot be the same as the current password. *"
      );
      return false;
    }
    if (newPassword !== conPassword) {
      setConPassErr("* Passwords do not match. *");
      return false;
    }
    const pass_valid = await checkPassword();
    console.log(pass_valid);
    if (!pass_valid) {
      setCurrPassErr("* Incorrect password. *");
      return false;
    }

    setOpenPopup(true);
    return true;
  };

  const handleChangePassword = async () => {
    if (!isPassChanged) {
      try {
        console.log("new pass " + newPassword);
        const res = await fetch("http://127.0.0.1:8001/reset-password/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email,
            newPassword: newPassword,
          }),
        });

        const result = await res.json();
        if (result.success) {
          setPopupContent("Password changed successfully.");
        } else {
          setCurrPassErr("* " + result.error + " *");
          setPopupContent("Failed to change password: " + result.error);
        }
      } catch (error) {
        setPopupContent("Something went wrong. Please try again.");
      }
    }
  };

  const checkPassword = async () => {
    console.log("checking password");
    const res = await fetch("http://127.0.0.1:8001/check-password/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        password: currPassword,
      }),
    });

    const result = await res.json();
    if (result.success) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <div className="usrprofile">
      <div className="user-details-container">
        <img
          className="usrprofile-design"
          src="/images/userProfileDesign.png"
        />
        <div className="user-info">
          <div className="user-image">{first_name?.charAt(0)}</div>
          <div className="user-details">
            <div className="user-name-pos">
              <div className="user-name-email-container">
                <div className="user-name">
                  {first_name} {last_name}
                </div>
                <div className="user-email">{email}</div>
              </div>
              <div className="user-position">{role_name}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="password-kinetiq-container">
        <div className="password-section">
          <h3>Change Password</h3>
          <div className="password-input-error-container">
            <div className="password-input-wrapper-item">
              <p className="login-error">{currPassErr}</p>
              <div className="password-input-wrapper">
                <input
                  type={showCurrPassword ? "text" : "password"}
                  name="curr-pass"
                  placeholder="Current Password"
                  className="input"
                  value={currPassword}
                  onChange={(e) => {
                    setCurrPassword(e.target.value);
                    setCurrPassErr("");
                  }}
                />
                <span
                  className="eye-icon"
                  onClick={() => setShowCurrPassword(!showCurrPassword)}
                >
                  {showCurrPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="20"
                      height="20"
                    >
                      <path
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        d="M3 3l18 18M10.5 10.5a3 3 0 004.5 4.5M12 5c-4.418 0-8.209 2.865-10 6.5a10.05 10.05 0 002.015 2.881M12 19c4.418 0 8.209-2.865 10-6.5a10.05 10.05 0 00-2.015-2.881"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="20"
                      height="20"
                    >
                      <path
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"
                      />
                      <circle
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        cx="12"
                        cy="12"
                        r="3"
                      />
                    </svg>
                  )}
                </span>
              </div>
            </div>

            <div className="password-input-wrapper-item">
              <p className="login-error">{newPassErr}</p>
              <div className="password-input-wrapper">
                <input
                  type={showNewPassword ? "text" : "password"}
                  name="new-pass"
                  placeholder="New Password"
                  className="input"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setNewPassErr("");
                  }}
                />
                <span
                  className="eye-icon"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="20"
                      height="20"
                    >
                      <path
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        d="M3 3l18 18M10.5 10.5a3 3 0 004.5 4.5M12 5c-4.418 0-8.209 2.865-10 6.5a10.05 10.05 0 002.015 2.881M12 19c4.418 0 8.209-2.865 10-6.5a10.05 10.05 0 00-2.015-2.881"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="20"
                      height="20"
                    >
                      <path
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"
                      />
                      <circle
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        cx="12"
                        cy="12"
                        r="3"
                      />
                    </svg>
                  )}
                </span>
              </div>
            </div>

            <div className="password-input-wrapper-item">
              <p className="login-error">{conPassErr}</p>
              <div className="password-input-wrapper">
                <input
                  type={showConPassword ? "text" : "password"}
                  name="con-pass"
                  placeholder="Confirm New Password"
                  className="input"
                  value={conPassword}
                  onChange={(e) => {
                    setConPassword(e.target.value);
                    setConPassErr("");
                  }}
                />
                <span
                  className="eye-icon"
                  onClick={() => setShowConPassword(!showConPassword)}
                >
                  {showConPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="20"
                      height="20"
                    >
                      <path
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        d="M3 3l18 18M10.5 10.5a3 3 0 004.5 4.5M12 5c-4.418 0-8.209 2.865-10 6.5a10.05 10.05 0 002.015 2.881M12 19c4.418 0 8.209-2.865 10-6.5a10.05 10.05 0 00-2.015-2.881"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="20"
                      height="20"
                    >
                      <path
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"
                      />
                      <circle
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        cx="12"
                        cy="12"
                        r="3"
                      />
                    </svg>
                  )}
                </span>
              </div>
            </div>
          </div>

          <button
            className="change-password-btn"
            onClick={() => arePassFieldsValid()}
          >
            Confirm
          </button>
        </div>
        <div className="role-details">
          <h3>EMPLOYEE DETAILS</h3>
          <p>
            <strong>&gt;&nbsp;Status:&nbsp;</strong> {status}
          </p>
          <p>
            <strong>&gt;&nbsp;Type:&nbsp;</strong> {type}
          </p>
          <p>
            <strong>&gt;&nbsp;Employee ID:&nbsp;</strong> {employee_id}
          </p>

          <div className="user-description-item">
            <p>
              <strong>&gt;&nbsp;Job Description:</strong>
            </p>
            <p className="user-desc">{description}</p>
          </div>
          <div className="user-description-item">
            <p>
              <strong>&gt;&nbsp;Module Permissions:</strong>
            </p>
            <p>
              {Array.isArray(permissions)
                ? permissions.join(", ")
                : permissions}
            </p>
          </div>
        </div>
      </div>

      <Popup
        open={openPopup}
        closeOnDocumentClick
        onClose={() => setOpenPopup(false)}
        modal
      >
        {(close) => (
          <div className="usrprofile-modal">
            <div className="header">Change Password Confirmation</div>
            <div className="content">{popupContent}</div>
            <div className="actions">
              {popupContent ===
              "Are you sure you want to change your password?" ? (
                <>
                  <button
                    className="confirm-btn"
                    onClick={() => {
                      handleChangePassword();
                    }}
                  >
                    Yes, Change Password
                  </button>
                  <button className="cancel-btn" onClick={() => close()}>
                    Cancel
                  </button>
                </>
              ) : (
                <button className="ok-btn" onClick={() => close()}>
                  OK
                </button>
              )}
            </div>
          </div>
        )}
      </Popup>
    </div>
  );
};

export default BodyContent;
