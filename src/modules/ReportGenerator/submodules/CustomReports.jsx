import React from "react";
import "../styles/CustomReports.css";

const BodyContent = () => {
    return (
        <div className="cusrep">
            <div className="body-content-container">
                <p>Hello Custom Reports SubModule!</p>
                <p>Fill this container with your elements, change the display if need be.</p>
                <p>If you're going to style with css, use your unique namespace '.cusrep' at the start.</p>
            </div>
        </div>

    );
};

export default BodyContent;
