import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./AuthPages.css";

export default function StandaloneLogin() {
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  });
  const [view, setView] = useState("login"); // login | forgot | reset
  const [resetData, setResetData] = useState({
    username: "",
    code: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState("");
  // localStorage.setItem('login_attemtps', '1')
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
    setLoginError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Logging in:", credentials);

    try {
      const lock_date = new Date(localStorage.getItem('login_lock_time'))
      if (new Date() < lock_date) {
        console.log('too many attempts timer, current attempts: ' + localStorage.getItem('login_attempts'))
        console.log('lock lifts at ' + lock_date.toString())
        setLoginError(`*Too many failed login attempts. Please try again in ${Math.ceil((lock_date - new Date())/1000)} seconds.*`)
        return;
      }

      const response = await axios.post("http://127.0.0.1:8000/login/", {
        email: credentials.email,
        password: credentials.password,
      });

      const data = response.data;

      if (data.success) {
        localStorage.setItem('login_attempts', '0');
        console.log("Login successful:", data);
        localStorage.setItem("user", JSON.stringify(data.data));
        navigate("/");
      }
    } catch (err) {
      if (err.response && err.response.data) {
        localStorage.setItem('login_attempts', (parseInt(localStorage.getItem('login_attempts')) + 1).toString())
        console.log('attempts' + localStorage.getItem('login_attempts'))
        if (parseInt(localStorage.getItem('login_attempts')) >= 5 && parseInt(localStorage.getItem('login_attempts')) < 10) {
          var lock_time = new Date();
          lock_time.setMinutes(lock_time.getMinutes() + 1)
          localStorage.setItem('login_lock_time', lock_time.toString())
        } else if (parseInt(localStorage.getItem('login_attempts')) >= 10) {
          console.log('sending to forgot page')
          localStorage.setItem('login_attempts', '0');
          setView('forgot')
        }
        // django error payload
        const { message } = err.response.data;
        console.error("Login failed:", message);
        setLoginError("*" + message + "*");
        //alert(message); // backend error
      } else {
        console.error("Login error:", err);
        alert("Something went wrong. Please try again.");
      }
    }

  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-left">
          <div className="login-card">

            <div className="login-form">
              <h2>
                {view === "login" && "Login"}
                {view === "forgot" && "Forgot your password?"}
                {view === "reset" && "Reset your password"}
              </h2>

              {view === "login" && (
                <>
                  <p className="login-error">{loginError}</p>
                  <form onSubmit={handleLogin}>
                    <input
                      type="text"
                      name="email"
                      placeholder="Username or Email"
                      value={credentials.email}
                      onChange={handleChange}
                      required
                    />
                    <div className="password-wrapper">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Password"
                        value={credentials.password}
                        onChange={handleChange}
                        required
                      />
                      <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? (
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
                    <div className="login-options">
                      <a href="#" className="forgot-password" onClick={() => setView("forgot")}>
                        Forgot password?
                      </a>
                    </div>
                    <button type="submit" className="login-btn">Login to Kinetiq</button>
                  </form>
                </>
              )}

              {view === "forgot" && (
                <>
                  <p>Enter a valid email, you will be sent a message with a code to reset your password.</p>
                  <input
                    type="text"
                    name="username"
                    placeholder="Email"
                    value={resetData.username}
                    onChange={(e) => setResetData({ ...resetData, username: e.target.value })}
                    required
                  />
                  <div className="login-options">
                    <button className="login-btn" onClick={() => setView("reset")}>
                      Reset password
                    </button>
                    <button className="login-btn" onClick={() => setView("login")}>
                      Back
                    </button>
                  </div>
                </>
              )}

              {view === "reset" && (
                <>
                  <input
                    type="text"
                    name="code"
                    placeholder="Enter email code"
                    value={resetData.code}
                    onChange={(e) => setResetData({ ...resetData, code: e.target.value })}
                    required
                  />
                  <input
                    type="password"
                    name="newPassword"
                    placeholder="Enter new password"
                    value={resetData.newPassword}
                    onChange={(e) => setResetData({ ...resetData, newPassword: e.target.value })}
                    required
                  />
                  <input
                    type="password"
                    name="confirmNewPassword"
                    placeholder="Confirm new password"
                    value={resetData.confirmNewPassword}
                    onChange={(e) => setResetData({ ...resetData, confirmNewPassword: e.target.value })}
                    required
                  />
                  <div className="login-options">
                    <button className="login-btn" onClick={() => {
                      console.log("Password changed:", resetData);
                      setView("login");
                    }}>
                      Change password
                    </button>
                    <button className="login-btn" onClick={() => setView("forgot")}>
                      Back
                    </button>
                  </div>
                </>
              )}
            </div>


          </div>


        </div>
        <div className="login-right">
          <img src="/icons/logo2.png" alt="Kinetiq Logo" className="kinetiq-logo" />
        </div>
      </div>
    </div>
  );
}