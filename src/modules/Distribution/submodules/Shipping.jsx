import React from "react";
import "../styles/Shipping.css";

const BodyContent = () => {
    return (
        <div className="shipping">
            <div className="body-content-container">
                <p>Hello Shipping SubModule!</p>
                <p>Fill this container with your elements, change the display if need be.</p>
                <p>If you're going to style with css, use your unique namespace '.shipping' at the start.</p>
            </div>
        </div>

    );
};

export default BodyContent;
