import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Authpages.css"; 

export default function StandaloneSignup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    termsAccepted: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSignup = (e) => {
    e.preventDefault();
    if (!formData.termsAccepted) {
      alert("Please agree to the terms and conditions.");
      return;
    }
    console.log("Signing up with:", formData);
    navigate("/"); // Redirect after signup
  };

  return (
    <div className="signup-container">
      <div className="signup-wrapper">
        <div className="signup-left">
          <div className="signup-card">
            <div className="signup-form">
              <h2>Sign up</h2>
              <form onSubmit={handleSignup}>
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <div className="password-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
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

                <label className="terms-checkbox">
                  <input
                    type="checkbox"
                    name="termsAccepted"
                    checked={formData.termsAccepted}
                    onChange={handleChange}
                  />
                  I agree to the <a href="#" onClick={(e) => { e.preventDefault(); setShowModal(true); }}>Terms & Conditions</a>
                </label>

                <button type="submit" className="signup-btn">
                  Create Account
                </button>
              </form>
              <p className="auth-switch">
                Already have an account? <Link to="/login">Log in</Link>
              </p>
            </div>
          </div>
        </div>

        <div className="signup-right">
          <img src="/icons/Login-background.png" alt="Kinetiq Logo" className="kinetiq-logo" />
        </div>
      </div>

      {/* Terms Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Terms & Conditions</h2>
            <div className="modal-body">
              <h3>1. Introduction</h3>
              <p>
                Our aim is to keep this agreement as readable as possible, but in some cases for
                legal reasons, some of the language is required "legalese".
              </p>
              <h3>2. Your Acceptance Of This Agreement</h3>
              <p>
                These terms of service are entered into by and between you and Enzuzo, Inc. (“Company”).
                Please read the terms of service carefully before you start to use the website.
              </p>
              <p>
                BY ACCESSING AND USING THIS WEBSITE, YOU ACCEPT AND AGREE TO BE BOUND...
              </p>
            </div>
            <button 
              className="accept-btn" 
              onClick={() => setShowModal(false)}
            >
              Accept
            </button>
          </div>
        </div>
      )}
    </div>
  );
}