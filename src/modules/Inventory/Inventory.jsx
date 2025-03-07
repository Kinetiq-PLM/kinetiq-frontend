import React from "react";
import "./styles/Inventory.css";

const BodyContent = () => {
    return (
        <div className="inv">
            <div className="body-content-container">
                <p>Hello Inventory Module!</p>
                <p>Fill this container with your elements, change the display if need be.</p>
                <p>If you're going to style with css, use your unique namespace '.inv' at the start.</p>
            </div>
        </div>
    );
};

export default BodyContent;
