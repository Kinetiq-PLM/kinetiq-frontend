import React from "react";
import "../styles/AccessControl.css";

const BodyContent = () => {
    return (
        <div className="acccon">
            <div className="body-content-container">
                <p>Hello Access Control SubModule!</p>
                <p>Fill this container with your elements, change the display if need be.</p>
                <p>If you're going to style with css, use your unique namespace '.acccon' at the start.</p>
            </div>
        </div>

    );
};

export default BodyContent;
