import { useState } from "react";
import "./styles/Login.css";

function Login({ setActiveModule }) {
    const [credentials, setCredentials] = useState({ username: "", password: "" });
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials((prev) => ({ ...prev, [name]: value }));
    };

    const handleLogin = (e) => {
        e.preventDefault();
        console.log("Logging in:", credentials);
        setActiveModule("Management");
    };

    return (
        <div className="login-container">
            <div className="login-wrapper">
                <div className="login-left">
                    <div className="login-card">
                        <div className="login-form">
                            <h2>Sign in</h2>
                            <form onSubmit={handleLogin}>
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="Username or email"
                                    value={credentials.username}
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
                                <button type="submit" className="login-btn">LOGIN</button>
                            </form>
                            <div className="signup-link">
                                <a href="#">Sign up</a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="login-right">
                    <img src="/icons/Login-background.png" alt="Kinetiq Logo" className="kinetiq-logo" />
                </div>
            </div>
        </div>
    );
}

export default Login;
