import React from "react";
import "./styles/Operations.css";


const BodyContent = ({ setActiveModule, setActiveSubModule, loadSubModule }) => {
    const handleSubmoduleClick = (submoduleId) => {
        setActiveModule("Operations");
        setActiveSubModule(submoduleId);
        loadSubModule(submoduleId);
    };


    return (
        <div className="ops">
            <div className="body-content-container">
                <h2 className="ops-title">Operations Dashboard</h2>
                <p className="ops-subtitle">Your shortcut to all Operations submodules.</p>


                <div className="ops-grid-wrapper">
                    <div className="ops-row">
                        <button className="ops-card" onClick={() => {
                            setActiveSubModule("Goods Tracking");
                            loadSubModule("Goods Tracking");
                        }}>
                            Goods Tracking
                        </button>


                        <button className="ops-card" onClick={() => {
                            setActiveSubModule("Internal Transfer");
                            loadSubModule("Internal Transfer");
                        }}>
                            Internal Transfer
                        </button>


                        <button className="ops-card" onClick={() => {
                            setActiveSubModule("Delivery Approval");
                            loadSubModule("Delivery Approval");
                        }}>
                            Delivery Approval
                        </button>
                    </div>


                    <div className="ops-row">
                        <button className="ops-card" onClick={() => {
                            setActiveSubModule("Delivery Receipt");
                            loadSubModule("Delivery Receipt");
                        }}>
                            Delivery Receipt
                        </button>


                        <button className="ops-card" onClick={() => {
                            setActiveSubModule("Item Removal");
                            loadSubModule("Item Removal");
                        }}>
                            Item Removal
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default BodyContent;



