import React from "react";
import "./styles/CRM.css";

const BodyContent = () => {
    return (
        <div className="crm">
            <div className="body-content-container">
                <p>Hello CRM Module!</p>
                <p>Fill this container with your elements, change the display if need be.</p>
                <p>If you're going to style with css, use your unique namespace '.crm' at the start.</p>
            </div>
        </div>
    );
};

export default BodyContent;
