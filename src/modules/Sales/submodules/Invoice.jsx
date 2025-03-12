import React from "react";
import "../styles/Index.css";

const BodyContent = ({ loadSubModule, setActiveSubModule }) => {
  return (
    <div className="invoice">
      <div className="body-content-container">
        <p>Hello Invoices SubModule!</p>
        <p>
          Fill this container with your elements, change the display if need be.
        </p>
        <p>
          If you're going to style with css, use your unique namespace
          '.invoices' at the start.
        </p>
        <button
          onClick={() => {
            setActiveSubModule("Quotation");
            loadSubModule("Quotation");
          }}
          className="sales-nav-button cursor-pointer bg-blue-400 mt-5"
        >
          Go to Quotations
        </button>
      </div>
    </div>
  );
};

export default BodyContent;
