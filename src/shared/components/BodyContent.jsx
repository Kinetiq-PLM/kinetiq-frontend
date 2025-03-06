import React from "react";
import "./styles/BodyContent.css"; // Import the CSS file

const BodyContent = ({ activeModule }) => {
  return (
    <div className="body-content-container">
        <p>Hello {activeModule} Module!</p>
        <p>Fill this container with your elements, change the display if need be.</p>
    </div>
  );
};

export default BodyContent;
