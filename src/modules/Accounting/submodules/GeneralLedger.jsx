import React from "react";
import "../styles/GeneralLedger.css";

const BodyContent = () => {
    return (
        <div className="genled">
            <div className="body-content-container">
                <p>Hello General Ledger SubModule!</p>
                <p>Fill this container with your elements, change the display if need be.</p>
                <p>If you're going to style with css, use your unique namespace '.genled' at the start.</p>
            </div>
        </div>

    );
};

export default BodyContent;
