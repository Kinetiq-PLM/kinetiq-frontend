import React from "react";
import "../styles/LeaveRequest.css"; 


const BodyContent = () => {
    return (
        <div className="leave-req">
            <div className="body-content-container">
                <p>Hello Leave Request SubModule!</p>
                <p>Fill this container with your elements, change the display if need be.</p>
                <p>If you're going to style with css, use your unique namespace '.leave-req' at the start.</p>
            </div>
        </div>
    );
};

export default BodyContent;