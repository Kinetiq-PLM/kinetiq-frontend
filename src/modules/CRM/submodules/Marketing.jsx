import React from "react";
import "../styles/Marketing.css";

const BodyContent = () => {
    return (
        <div className="marketing">
            <div className="body-content-container">
                <p>Hello Marketing SubModule!</p>
                <p>Fill this container with your elements, change the display if need be.</p>
                <p>If you're going to style with css, use your unique namespace '.marketing' at the start.</p>
            </div>
        </div>

    );
};

export default BodyContent;
