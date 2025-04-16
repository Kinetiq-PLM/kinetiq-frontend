import React from "react";
import "./styles/Administration.css";

const BodyContent = () => {
    return (
        <div className="admin">
            <div className="body-content-container">
                <p>Hello Administration Module!</p>
                <p>Fill this container with your elements, change the display if need be.</p>
                <p>If you're going to style with css, use your unique namespace '.admin' at the start.</p>
            </div>
        </div>
    );
};

export default BodyContent;
