import { useEffect } from 'react';
import "./LandingPage.css";

export default function LandingPage() {
  return (
      <div className="landing-content">
        <img src="/icons/landing logo.png" alt="Kinetiq Logo" className="landing-logo" />
        <p className="landing-subtext">
          Precision medical equipment manufacturer advancing healthcare in the Philippines.<br />
        </p>
      </div>
  );
}
