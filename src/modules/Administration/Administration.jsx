import React from "react";
import "../Administration/styles/Administration.css";
import CountUp from "react-countup";

import {
    AppstoreOutlined,
    ToolOutlined,
    ShoppingOutlined,
    ExperimentOutlined,
    UserOutlined,
    ShopOutlined,
    HomeOutlined,
    FileTextOutlined,
    FileSearchOutlined,
} from "@ant-design/icons";

const Administration = ({ setActiveSubModule, loadSubModule }) => {
    const handleClick = (module, tab = null) => {
        setActiveSubModule(module);
        loadSubModule(module);
        if (tab) {
            setTimeout(() => {
                const tabBtn = document.querySelector(`[data-tab="${tab}"]`);
                if (tabBtn) tabBtn.click();
            }, 100);
        }
    };

    return (
        <div className="admin">
            {/* Dashboard Title */}
            <h1><p className="text-[#00A8A8]" /> Administration Dashboard</h1>

            {/* Top Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div onClick={() => handleClick("User")} className="module-card bg-teal group">
                    <UserOutlined className="anticon" />
                    <div>
                        <p className="text-label">User & Roles</p>
                        <p className="text-value"><CountUp end={101} duration={1.5} /></p>
                        <p className="text-sub">Employees</p>
                    </div>
                </div>

                <div className="module-card bg-teal group">
                    <img src="/icons/us.png" alt="US Dollar" className="group w-10 h-10" />
                    <div>
                        <p className="text-label">Exchange Rate (PH to USD)</p>
                        <p className="text-value">₱ <CountUp end={61.04} decimals={2} duration={1.5} /></p>
                        <p className="text-sub">Latest Rate <span className="text-badge">Live</span></p>
                    </div>
                </div>

                <div onClick={() => handleClick("Warehouse")} className="module-card bg-teal group">
                    <HomeOutlined className="text-2xl text-[#00A8A8]" />
                    <div>
                        <p className="text-label">Warehouse</p>
                        <p className="text-value"><CountUp end={14} duration={1.5} /></p>
                        <p className="text-sub">Locations</p>
                    </div>
                </div>
            </div>

            {/* Middle Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div onClick={() => handleClick("Item Masterlist")} className="module-card bg-sky-50 group">
                    <AppstoreOutlined className="text-2xl text-[#00A8A8] " />
                    <div>
                        <p className="text-label">Item Masterlist</p>
                        <p className="text-value"><CountUp end={57} duration={1.5} /></p>
                        <p className="text-sub">Records</p>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <div onClick={() => handleClick("Item Masterlist", "Assets")} className="module-card bg-amber-50 group">
                        <ToolOutlined className="text-xl text-[#00A8A8] " />
                        <div>
                            <p className="text-label">Assets</p>
                            <p className="text-value"><CountUp end={32} duration={1.5} /></p>
                            <p className="text-sub">Records</p>
                        </div>
                    </div>
                    <div onClick={() => handleClick("Item Masterlist", "Product")} className="module-card bg-green-50 group">
                        <ShoppingOutlined className="text-xl text-[#00A8A8] " />
                        <div>
                            <p className="text-label">Products</p>
                            <p className="text-value"><CountUp end={19} duration={1.5} /></p>
                            <p className="text-sub">Records</p>
                        </div>
                    </div>
                    <div onClick={() => handleClick("Item Masterlist", "Raw Materials")} className="module-card bg-yellow-50 group">
                        <ExperimentOutlined className="text-xl text-[#00A8A8]" />
                        <div>
                            <p className="text-label">Raw Materials</p>
                            <p className="text-value"><CountUp end={44} duration={1.5} /></p>
                            <p className="text-sub">Records</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <div onClick={() => handleClick("Business Partner Masterlist")} className="module-card bg-indigo-50 group">
                        <UserOutlined className="text-xl text-[#00A8A8]" />
                        <div>
                            <p className="text-label">Business Partner Masterlist</p>
                            <p className="text-value"><CountUp end={23} duration={1.5} /></p>
                            <p className="text-sub">Partners</p>
                        </div>
                    </div>
                    <div onClick={() => handleClick("Business Partner Masterlist", "Vendor")} className="module-card bg-purple-50 group">
                        <ShopOutlined className="text-xl text-[#00A8A8]" />
                        <div>
                            <p className="text-label">Vendors</p>
                            <p className="text-value"><CountUp end={18} duration={1.5} /></p>
                            <p className="text-sub">Partners</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div onClick={() => handleClick("Policy")} className="module-card bg-gray-100 group">
                    <FileTextOutlined className="text-2xl text-[#00A8A8]" />
                    <div>
                        <p className="text-label">Policy</p>
                        <p className="text-value"><CountUp end={26} duration={1.5} /></p>
                        <p className="text-sub">Documents</p>
                    </div>
                </div>

                <div onClick={() => handleClick("Audit Logs")} className="module-card bg-red-50 group">
                    <FileSearchOutlined className="text-2xl text-[#00A8A8]" />
                    <div>
                        <p className="text-label">Audit Logs</p>
                        <p className="text-value"><CountUp end={54} duration={1.5} /></p>
                        <p className="text-sub">System Records</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Administration;
