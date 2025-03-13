import React from "react";
import "../styles/TaskMonitoring.css";

const BodyContent = () => {
    return (
            <div className="body-content-container">
            <div className="taskss">  
            <h1 id="hdtask"><b>Tasks</b></h1>
            <div id="bg8"></div>
            <button className="attach"><b>Attach File</b></button>
            <button className="del"><b>Delete Task</b></button>
            <button className="atasks"><b>Add Task</b></button>
            <button id="sched"><b>Schedules</b></button>
            </div>
        </div>

    );
};

export default BodyContent;
