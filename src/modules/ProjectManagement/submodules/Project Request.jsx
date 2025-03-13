import React from "react";
import "../styles/Project Request.css";

const BodyContent = () => {
    return (
            <div className="body-content-container">
             <div className="projreq">
             <h1><b>Project Request</b></h1></div>
             <div className="rectangle4"></div>
             <button className="remove">Remove Request</button>
             <div className="rectangle5"></div>
           <button className="filter"><b>Filter By</b></button>
            <h3 className="appr"><b>Approved</b></h3>
            <h3 className="nappr"><b>Not Approve</b></h3>
            <h3 className="og"><b>Ongoing</b></h3>
            <input id='check' type="checkbox" className=" check " ></input>
            
               </div>
            
       

    );
};

export default BodyContent;
