import React, {useState} from "react";
import "../styles/StockFlow.css";

const BodyContent = () => {

        // Dummy data 
        const inTransitData = Array(20).fill({
            "Product Name": "Product Name",
            "Transaction Type": "Transfer",
            "Destination": "Manila",
            "Origin": "Cebu",
            "Stock in Transit": "000",
            "Delivery Team": "Avengers"
        });
    
        const warehouseData = Array(20).fill({
            "Warehouse Name": "Warehouse Name",
            "Total Capacity": "000",
            "Available Space": "000"
        });
    
        const transHistoryData = Array(20).fill({
            "Product Type": "Raw Material Name",
            "Transaction Type": "000",
            "Destination": "Raw Material Name",
            "Origin": "Manila",
            "Stock in Transit": "000",
            "Delivery Team": "Avengers"
        });

    // Table Configurations per Active Tab
    const stockFlowTableConfigs = {
        "In Transit" : { 
            Columns : ["Product Name", "Transaction Type", "Destination", "Origin", "Stock in Transit", "Delivery Team"],
            Data: inTransitData
            
        },

        "Warehouse" : {
            Columns : ["Warehouse Name", "Total Capacity", "Available Space"],
            Data: warehouseData
         },

        "Transfer History" : {
            Columns: ["Product Type", "Transaction Type", "Destination", "Origin", "Stock in Transit", "Delivery Team"],
            Data: transHistoryData
        }

    }
 

    const tabs = ["In Transit",  "Warehouse", "Transfer History"];
    const [activeTab, setActiveTab] = useState("In Transit");
    const activeConfig = stockFlowTableConfigs[activeTab];
    

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
                                        {activeConfig.Columns.map((header) => (
                                           <th key={header} className="p-2 text-gray-600">{header}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {activeConfig.Data.map((item, index) => (
                                        <tr key={index} className="border-b border-gray-300">
                                           {activeConfig.Columns.map((col) => (
                                            <td key={col} className="p-2">
                                                {item[col]}
                                            </td>
                                           ))}
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


