import React from "react";
import "../Administration/styles/Administration.css";

import {
    AppstoreOutlined,
    ToolOutlined,
    ShoppingOutlined,
    ExperimentOutlined,
    UserOutlined,
    ShopOutlined,
    HomeOutlined,
    FileTextOutlined,
    FileSearchOutlined
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
        <div className="admin p-6 space-y-8 overflow-y-auto">
            {/* Dashboard Title */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-1">Administration Dashboard</h1>
                <p className="text-sm text-gray-500">Real-Time Admin Management Overview</p>
            </div>

            {/* Top Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* User & Roles */}
                <div onClick={() => handleClick("User")} className="module-card group">
                    <UserOutlined className="text-2xl text-[#00A8A8] group-hover:text-white" />
                    <div>
                        <p className="text-label group-hover:text-white">User & Roles</p>
                        <p className="text-value group-hover:text-white">101</p>
                        <p className="text-sub group-hover:text-white">Employees</p>
                    </div>
                </div>

                {/* Exchange Rate */}
                <div className="module-card">
                    <img src="/icons/us.png" alt="US Dollar" className="w-10 h-10" />
                    <div>
                        <p className="text-label">Exchange Rate (PH to USD)</p>
                        <p className="text-value">₱ 61.04</p>
                        <p className="text-sub">Latest Rate</p>
                    </div>
                </div>

                <div onClick={() => handleClick("Warehouse")} className="module-card group">
                    <HomeOutlined className="text-2xl text-[#00A8A8] group-hover:text-white" />
                    <div>
                        <p className="text-label group-hover:text-white">Warehouse</p>
                        <p className="text-value group-hover:text-white">14</p>
                        <p className="text-sub group-hover:text-white">Locations</p>
                    </div>
                </div>
            </div>

            {/* Middle Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Left: Item Masterlist */}
                <div onClick={() => handleClick("Item Masterlist")} className="module-card group">
                    <AppstoreOutlined className="text-2xl text-[#00A8A8] group-hover:text-white" />
                    <div>
                        <p className="text-label group-hover:text-white">Item Masterlist</p>
                        <p className="text-value group-hover:text-white">57</p>
                        <p className="text-sub group-hover:text-white">Records</p>
                    </div>
                </div>

                {/* Center: Vertical stack for Assets, Products, Raw Materials */}
                <div className="flex flex-col gap-2">
                    <div onClick={() => handleClick("Item Masterlist", "Assets")} className="module-card group">
                        <ToolOutlined className="text-xl text-[#00A8A8] group-hover:text-white" />
                        <div>
                            <p className="text-label group-hover:text-white">Assets</p>
                            <p className="text-value group-hover:text-white">32</p>
                            <p className="text-sub group-hover:text-white">Records</p>
                        </div>
                    </div>
                    <div onClick={() => handleClick("Item Masterlist", "Product")} className="module-card group">
                        <ShoppingOutlined className="text-xl text-[#00A8A8] group-hover:text-white" />
                        <div>
                            <p className="text-label group-hover:text-white">Products</p>
                            <p className="text-value group-hover:text-white">19</p>
                            <p className="text-sub group-hover:text-white">Records</p>
                        </div>
                    </div>
                    <div onClick={() => handleClick("Item Masterlist", "Raw Materials")} className="module-card group">
                        <ExperimentOutlined className="text-xl text-[#00A8A8] group-hover:text-white" />
                        <div>
                            <p className="text-label group-hover:text-white">Raw Materials</p>
                            <p className="text-value group-hover:text-white">44</p>
                            <p className="text-sub group-hover:text-white">Records</p>
                        </div>
                    </div>
                </div>

                {/* Right: Business Partner + Vendors */}
                <div className="flex flex-col gap-2">
                    <div onClick={() => handleClick("Business Partner Masterlist")} className="module-card group">
                        <UserOutlined className="text-xl text-[#00A8A8] group-hover:text-white" />
                        <div>
                            <p className="text-label group-hover:text-white">Business Partner Masterlist</p>
                            <p className="text-value group-hover:text-white">23</p>
                            <p className="text-sub group-hover:text-white">Partners</p>
                        </div>
                    </div>
                    <div onClick={() => handleClick("Business Partner Masterlist", "Vendor")} className="module-card group">
                        <ShopOutlined className="text-xl text-[#00A8A8] group-hover:text-white" />
                        <div>
                            <p className="text-label group-hover:text-white">Vendors</p>
                            <p className="text-value group-hover:text-white">18</p>
                            <p className="text-sub group-hover:text-white">Partners</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Policy */}
                <div onClick={() => handleClick("Policy")} className="module-card group">
                    <FileTextOutlined className="text-2xl text-[#00A8A8] group-hover:text-white" />
                    <div>
                        <p className="text-label group-hover:text-white">Policy</p>
                        <p className="text-value group-hover:text-white">26</p>
                        <p className="text-sub group-hover:text-white">Documents</p>
                    </div>
                </div>

                {/* Audit Logs */}
                <div onClick={() => handleClick("Audit Logs")} className="module-card group">
                    <FileSearchOutlined className="text-2xl text-[#00A8A8] group-hover:text-white" />
                    <div>
                        <p className="text-label group-hover:text-white">Audit Logs</p>
                        <p className="text-value group-hover:text-white">54</p>
                        <p className="text-sub group-hover:text-white">System Records</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Administration;
