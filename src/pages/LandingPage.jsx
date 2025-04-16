import { Link } from "react-router-dom";
import { useEffect } from 'react';
import "./LandingPage.css";

  export default function LandingPage() {
    useEffect(() => {
      const timer = setTimeout(() => {
        const popup = document.querySelector('.landing-popup');
        if (popup) {
          popup.style.opacity = '0';
          setTimeout(() => {
            popup.style.display = 'none';
          }, 300); // Matches CSS transition
        }
      }, 3000); // Auto-close after 3 seconds
  
      return () => clearTimeout(timer);
    }, []);

  return (
    // <div className="landing-container">
      <div className="landing-content">
        <img src="/icons/landing logo.png" alt="Kinetiq Logo" className="landing-logo" />
        <p className="landing-subtext">
        Precision medical equipment manufacturer advancing healthcare in the Philippines.<br />
        </p>
      </div>
    // </div>
  );
}