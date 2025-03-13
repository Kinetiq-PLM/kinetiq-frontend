import React from "react";
import "../styles/DashBoard.css";

const BodyContent = () => {
    return (
        <div className="body-content-container">
                <h1 className="overview"><b>Overview</b></h1>
                <h2 className="overdue"><b>Overdue Task</b></h2>
                <h2 className="tft"><b>Tasks for Today</b></h2>
                <h2 className="projsum"><b>Project Summary</b></h2>
        <div className="rectangle"></div>
        <div className="rectangle2"></div>
        <div className="rectangle3"></div>
        <button className="add"><b>New task</b></button>
        <button className="ALL"><b>All</b></button>
        <button className="dev"><b>Development</b></button>
        <button className="dep"><b>Department</b></button>
        <button className="prio"><b>Priority</b></button>
       


    


           </div>
           
        );
      };
    
      export default BodyContent;