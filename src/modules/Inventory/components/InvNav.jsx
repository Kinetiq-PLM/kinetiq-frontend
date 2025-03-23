import React from "react";
import SearchBar from "../../../shared/components/SearchBar";

const InvNav = ({ activeTab, onTabChange }) => {
    const tabs = [ "Products", "Assets", "Raw Materials"];

    return (
        <nav className=" md:flex md:flex-wrap justify-between items-center p-2 w-full ">


          <div className="flex flex-1 h-8.5 justify-start  md:flex-row-reverse md:order-2">
            <SearchBar className />
           </div>


            <div className="invNav flex border-b border-gray-300  mt-1 space-x-8 min-w-xs md:w-auto mt-3 mb-1 md:order-1" >
                {tabs.map((tab) => (
                    <span
                        key={tab}
                        className={`cursor-pointer text:xs md:text-lg font-semibold transition-colors  ${
                            activeTab === tab ? "text-cyan-600 border-b-2 border-cyan-600 " : "text-gray-500"
                        }`}
                        onClick={() => onTabChange(tab)}
                    >
                        {tab}
                    </span>
                ))}
                
            </div>
            
           
            


            
            
            
        </nav>



    );
};

export default InvNav;
