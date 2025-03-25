import React from "react";
import "../styles/Index.css";
import Heading from "../../Sales/components/Heading";
import Button from "../../Sales/components/Button";
import Table from "../../Sales/components/Table";
import { AlertProvider } from "../../Sales/components/Context/AlertContext";

const BodyContent = ({ loadSubModule, setActiveSubModule }) => {
  return (
    <div className="opportunity">
      <div className="body-content-container">
        <p>Hello Opportunity SubModule!</p>
        <p>
          Fill this container with your elements, change the display if need be.
        </p>
        <p>
          If you're going to style with css, use your unique namespace
          '.opportunity' at the start.
        </p>
      </div>
    </div>
  );
};

export default BodyContent;
