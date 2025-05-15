import React from "react";
import "./styles/MRP.css";

const BodyContent = ({ loadSubModule, setActiveSubModule }) => {

    const notCompleteOrders = 80;
    const completeOrders = 20;

    const totalOrders = notCompleteOrders + completeOrders;
    const notCompletePercent = (notCompleteOrders / totalOrders) * 100;
    const completePercent = (completeOrders / totalOrders) * 100;

    return (
        <div className="mrp">
            <div className="body-content-container">
                <div className="title">MRP NAVIGATION</div>

                {/* Horizontal container (LEFT: buttons + RIGHT: graph) */}
                <div className="mrp-navigation-graph">
                    
                    {/* Left Side: 3 Navigation Cards */}
                    <div className="card-container-vertical">
                        <div className="mrp-table-scroll">
                            <div onClick={() => { setActiveSubModule("Material Requirements Planning"); loadSubModule("Material Requirements Planning"); }} className="card">
                                <div className="card-text">MATERIAL RESOURCE PLANNING</div>
                            </div>
                            <div onClick={() => { setActiveSubModule("Bills Of Material"); loadSubModule("Bills Of Material"); }} className="card">
                                <div className="card-text">BILLS OF MATERIALS</div>
                            </div>
                            <div onClick={() => { setActiveSubModule("Product Materials"); loadSubModule("Product Materials"); }} className="card">
                                <div className="card-text">PRODUCT MATERIALS</div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Graph */}
                    <div className="graph-card">
                        <div className="overview-title">Material Requirements Planning Overview</div>
                        <div className="doughnut">
                            <div className="circle" style={{ background: `conic-gradient(#4DB6AC ${notCompletePercent}%, #B2DFDB ${notCompletePercent}% 100%)` }}>
                                <div className="inner-circle"></div>
                            </div>
                        </div>
                        <div className="overview-legend">
                            <div className="legend-item">
                                <span className="legend-box complete"></span>Complete - 20%
                            </div>
                            <div className="legend-item">
                                <span className="legend-box not-complete"></span>Not Complete - 80%
                            </div>
                        </div>
                    </div>

                </div> {/* End mrp-navigation-graph */}
            </div> {/* End body-content-container */}
        </div> 
    );
};

export default BodyContent;
