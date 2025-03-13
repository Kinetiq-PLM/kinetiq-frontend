import React, { useState } from "react";
import "../styles/ProjectPlanning.css";

const BodyContent = () => {
    return (
        <div className="body-content-container">
        <div className="projplan">
        <h1><b>New Project Plan</b></h1></div>
        <button className="projlist" ><b>Project List</b></button>
        <button className="sched"><b>Schedule</b></button>
        <button className="crplan"><b>Create Plan</b></button>
        <h1 className="projn"><b>Project Name *</b></h1>
        <div id="line"></div>
        <h1 className="wc"><b>Warranty Coverage</b></h1>
        <h1 id="Sdate"s><b>Start Date</b></h1>
        <h1 id="Edate"><b>End Date</b></h1>
        <h1 id="prg"><b>Progress</b></h1>
        <h1 id="prgid">Project Request ID</h1>
        <div id="bg6"> 
            <h1 id="prjrq"><b>Project Request</b></h1>
            <form>
                <input type="checkbox" id="docu1" name="docu1" value="documents1"/>
                <label for="docu1" id="pd">Project Details</label> <br></br>
                <input type="checkbox" id="docu2" name="docu2" value="documents2"/>
                <label for="docu2" id="oag">Objectives and Goals</label><br></br>
                <input type="checkbox" id="docu3" name="docu3" value="documents3"/>
                <label for="docu3" id="fdc">File and Document Completion</label> <br></br>
                <input type="checkbox" id="docu4" name="docu4" value="documents4"/>
                <label for="docu4" id="reqc">Requirements and Completions</label> <br></br>
            </form>
        </div>
        <div id="bg7"></div>
        <button id="Addtasksss"><b>Add task</b>=</button>
    
        </div>
            

    );
};

    

export default BodyContent;
