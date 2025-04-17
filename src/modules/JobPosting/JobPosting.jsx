import React from "react";
import "./styles/JobPosting.css";

const BodyContent = () => {
    return (
        <div className="job-post">
            <div className="body-content-container">
                <p>Hello Job Posting Module!</p>
                <p>Fill this container with your elements, change the display if need be.</p>
                <p>If you're going to style with css, use your unique namespace '.job-post' at the start.</p>
            </div>
        </div>
    );
};

export default BodyContent;