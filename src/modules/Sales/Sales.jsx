import React from "react";
import { lazy } from "react";
import "./styles/Index.css";

const BodyContent = ({ loadSubModule, setActiveSubModule }) => {
  return (
    <div className="sales">
      <div className="body-content-container">
        <p>Hello Sales Module!</p>
        <p>
          Fill this container with your elements, change the display if need be.
        </p>
        <p>
          If you're going to style with css, use your unique namespace '.sales'
          at the start.
        </p>
        <button
          onClick={() => {
            setActiveSubModule("Invoices");
            loadSubModule("Invoices");
          }}
          className="sales-nav-button cursor-pointer bg-blue-400 mt-5"
        >
          Go to Invoices
        </button>
      </div>
    </div>
  );
};

export default BodyContent;
