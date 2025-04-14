import { Link } from "react-router-dom";
import "./LandingPage.css";

export default function LandingPage() {
  return (
    <div className="landing-container">
      <div className="landing-content">
        <img src="/icons/landing logo.png" alt="Kinetiq Logo" className="landing-logo" />
        <p className="landing-subtext">
          idk what to put here<br />
        </p>
        <Link to="/login" className="landing-button">
          Get Started
        </Link>
      </div>
    </div>
  );
}