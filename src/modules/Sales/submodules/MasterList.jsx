import React from "react";
import "../styles/Index.css";

const BodyContent = ({ loadSubModule, setActiveSubModule }) => {
  return (
    <div className="master-list">
      <div className="body-content-container">
        <p>Hello Master List SubModule!</p>
        <p>
          Fill this container with your elements, change the display if need be.
        </p>
        <p>
          If you're going to style with css, use your unique namespace
          '.master-list' at the start.
        </p>
      </div>
    </div>
  );
};

export default BodyContent;
