import React, { useState, useEffect } from "react";
import "../styles/Rework.css";

const BodyContent = () => {
    return (
        <div className="rework">
            <div className="body-content-container">
                <p>Hello Picking SubModule!</p>
                <p>Fill this container with your elements, change the display if need be.</p>
                <p>If you're going to style with css, use your unique namespace '.rework' at the start.</p>
            </div>
        </div>

    );
};

export default BodyContent;
