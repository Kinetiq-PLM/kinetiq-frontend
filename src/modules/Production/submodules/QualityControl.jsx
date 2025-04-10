import React, { useState } from "react";
import "../styles/QualityControl.css";

const BodyContent = () => {
    const [searchTerm, setSearchTerm] = useState("");

    return (
        <div className="prodqa">
            <div className="prodqc-columns">
                {/* Column 1 */}
                <div className="prodqcColumn1">
                    <div className="prodqcheader">Quality Control and Rework Process</div>
                    {/* Box Container Section */}
                    <div className="qc-box-container">
                        <div className="qc-box">4,970
                            <div className=" qc-textbox">Completed</div>
                        </div>
                        <div className="qc-box">515
                        <div className=" qc-textbox">Completed</div>
                        </div>
                        <div className="qc-box">2,435
                        <div className=" qc-textbox">Completed</div>
                        </div>
                    </div>
                </div>

                {/* Column 2 */}
                <div className="prodqcColumn2">
                    {/* Header Section */}
                    <div className="prodqcheader-container">
                        <div>
                            <div className="prodqcnumberview">7,536</div>
                            <p className="prodqctext">Sent to Project Management</p>
                        </div>
                        <button className="viewlist-button">View List</button>
                    </div>

                    {/* Search and Buttons Section */}
                    <div className="prodqcControls">
                        <input
                            className="prodqcsearch-bar"
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button className="prodqcrefresh-button">Refresh</button>
                        <button className="prodqcsend-operations-button">Send to Operations</button>
                    </div>
                </div>
            </div>

            {/* Dashboard Below */}
            <div className="prodqcDashboard">
            </div>
        </div>
    );
};

export default BodyContent;
