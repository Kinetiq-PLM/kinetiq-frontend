import React from "react";
import "../styles/StockFlow.css";

const BodyContent = () => {

        // Dummy data for 20 items
        const dummyData = Array.from({ length: 20 }, (_, i) => ({
            productName: `Product ${i + 1}`,
            pCount: Math.floor(Math.random() * 100),
            dateChecked: `2024-03-${String(i + 1).padStart(2, '0')}`,
            managerId: `MGR${1000 + i}`,
            status: i % 2 === 0 ? "Verified" : "Pending",
        }));

    const tabs = ["In Transit",  "Warehouse", "Transfer History"];
    const [activeTab, setActiveTab] = React.useState(tabs[0]);
    

    return (
        <div className="stockflow">
            <div className="body-content-container">
                
              
                {/* Navigation Tabs */}
                <nav className="top-0 left-0 flex flex-wrap justify-between space-x-8 w-full p-2">

                    <div className="invNav flex border-b border-gray-200 space-x-8 md:w-auto mt-3 mb-1" >
                            {tabs.map((tab) => (
                                <span
                                    key={tab}
                                    className={`cursor-pointer text:xs md:text-lg font-semibold transition-colors  ${
                                        activeTab === tab ? "text-cyan-600 border-b-2 border-cyan-600 " : "text-gray-500"
                                    }`}
                                    onClick={() => setActiveTab(tab)}
                                >
                                    {tab}
                                </span>
                            ))}
                    </div>           
                </nav>
                
                {/*  */}
                <section className="w-full h-100 overflow-y-auto rounded-lg grid ">
                    {/* time and warehouse filter */}
                    <div className="flex justify-between items-center p-3 rounded-t-lg">
                        {/* time */}
                        <h2 className="text-md font-semibold text-gray-600">00 - 00 - 0000 / 00:00 UTC</h2>
                        {/* Select: Warehouse Filter */}
                        <select name="stockflow_select/warehouse" id="stockflow_select/warehouse" className={`${activeTab === "Warehouse" ? "visible w-[300px] border border-gray-300 rounded-lg p-2 text-gray-500 cursor-pointer" : "hidden" }`}>
                            {/* Select Options */}
                            <option value="">Select Warehouse</option>
                            {["Warehouse 1", "Warehouse 2", "Warehouse 3"].map((warehouse)=>(
                                <option key={warehouse}>{warehouse}</option>
                            ))}
                        </select>
                    </div>

                    <div className="pcounts-table-container flex-2 border border-gray-300 rounded-lg scroll-container overflow-y-auto m-h-auto p-3">
                        <table className="w-full table-layout:fixed text-center cursor-pointer">
                                <thead>
                                    <tr className="border-b border-gray-300">
                                        {['Product Name', 'P-Count', 'Date Checked', 'Manager ID', 'Status'].map((header) => (
                                           <th key={header} className="p-2 text-gray-600">{header}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {dummyData.map((item, index) => (
                                        <tr key={index} className="border-b border-gray-300">
                                            <td className="p-2">{item.productName}</td>
                                            <td className="p-2">{item.pCount}</td>
                                            <td className="p-2">{item.dateChecked}</td>
                                            <td className="p-2">{item.managerId}</td>
                                            <td className={`p-2 ${item.status === 'Verified' ? 'text-green-600' : 'text-yellow-600'}`}>{item.status}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                </section>
                            

                   
             </div>               
        </div>
       
    );
};

export default BodyContent;



// {/* Warehouse Filter */}
{/* <select name="" id="" className="w-full border border-gray-300 rounded-lg p-2 text-gray-500 cursor-pointer">
<option>Select Warehouse</option>
{["Warehouse 1", "Warehouse 2", "Warehouse 3"].map((warehouse) => (
    <option key={warehouse}>{warehouse}</option>))}
</select> */}