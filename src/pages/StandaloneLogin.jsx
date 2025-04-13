import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./AuthPages.css";

export default function StandaloneLogin() {
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
    setLoginError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Logging in:", credentials);

    try {
      const response = await axios.post("http://127.0.0.1:8000/login/", {
        email: credentials.email,
        password: credentials.password,
      });

      const data = response.data;

      if (data.success) {
        console.log("Login successful:", data);
        localStorage.setItem("user", JSON.stringify(data.data));
        navigate("/");
      }
    } catch (err) {
      if (err.response && err.response.data) {
        // catches Django error payload
        const { message } = err.response.data;
        console.error("Login failed:", message);
        setLoginError("*" + message + "*"); // show error message to user
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
              <h2>Login</h2>
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
                  <span
                    className="eye-icon"
                    onClick={() => setShowPassword(!showPassword)}
                  >
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
                  <label className="remember-me">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={() => setRememberMe(!rememberMe)}
                    />
                    Remember me
                  </label>
                  <a href="#" className="forgot-password">Forgot password?</a>
                </div>
                <button type="submit" className="login-btn">Login to Kinetiq</button>
              </form>
            </div>
          </div>
        </div>
        <div className="login-right">
          <img src="/icons/basic logo.png" alt="Kinetiq Logo" className="kinetiq-logo" />
        </div>
      </div>
    </div>
  );
}