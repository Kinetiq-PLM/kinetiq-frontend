import React from "react";
import "./styles/MRP.css";

const BodyContent = ({loadSubModule, setActiveSubModule}) => {
    return (
        <div className="mrp">
            <div className='body-content-container'>
                <div className="title">MRP NAVIGATION</div>
                <div className="card-container">
                    <div onClick={() => {setActiveSubModule("Material Requirements Planning");loadSubModule("Material Requirements Planning");}} className="card material">
                        <img className="MRPIcon6" src="/icons/module-icons/MRP-icons/MRPIcon6.png" alt="Material Resource Planning" />
                        <div className="card-text">MATERIAL RESOURCE PLANNING</div>
                    </div>
                    <div onClick={() => {setActiveSubModule("Bills Of Material");loadSubModule("Bills Of Material");}} className="card bills">
                        <img className="MRPIcon7" src="/icons/module-icons/MRP-icons/MRPIcon7.png" alt="Bills of Material" />
                        <div className="card-text">BILLS OF MATERIAL</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BodyContent;