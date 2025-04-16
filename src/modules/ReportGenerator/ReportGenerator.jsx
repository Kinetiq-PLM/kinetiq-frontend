import React from "react";
import "./styles/ReportGenerator.css";

const BodyContent = () => {
    return (
        <div className="repgen">
            <div className="body-content-container">
                <p>Hello Report Generator / Solutions Customizing Module!</p>
                <p>Fill this container with your elements, change the display if need be.</p>
                <p>If you're going to style with css, use your unique namespace '.repgen' at the start.</p>
            </div>
        </div>
    );
};

export default BodyContent;
