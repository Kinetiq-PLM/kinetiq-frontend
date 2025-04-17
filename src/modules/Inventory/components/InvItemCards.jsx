import React from "react";

const InvItemCards = ({ items, onSelectItem, openModal }) => {
    return (
        <div className="sm:flex sm:flex-col sm:w-full sm:p-4 md:hidden">
            {items.map((item, index) => (
                <div
                    key={index}
                    className="flex justify-between border border-transparent items-center rounded-2xl p-4 mb-4 shadow-md cursor-pointer hover:shadow-lg transition-all w-max-sm"
                >
                    {/* Product Info */}
                    <div onClick={() => onSelectItem(item)} className="flex-1 min-w-0">
                        <h2 className="text-cyan-600 font-semibold text-sm mb-1 truncate">{item.Name}</h2>
                        <p className="text-gray-600 text-sm">Available Stock: {item["Available Stock"]}</p>
                    </div>

                    {/* "+" Button to Open Modal */}
                    <button
                        className="flex items-center justify-center bg-cyan-600 text-white rounded-xl w-8 h-8 text-lg shrink-0 hover:bg-cyan-700 transition-colors cursor-pointer"
                        aria-label="Add Item"
                        onClick={() => {
                            onSelectItem(item); // Set selected item
                            openModal(); // Open modal
                        }}
                    >
                        +
                    </button>
                </div>
            ))}
        </div>
    );
};

export default InvItemCards;
