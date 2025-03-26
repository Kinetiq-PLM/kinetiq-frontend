import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import "../styles/StockFlow.css";


ChartJS.register(ArcElement, Tooltip, Legend);

const BodyContent = () => {
    const tabs = ["Warehouse", "Transfer History"];
    const [activeTab, setActiveTab] = React.useState(tabs[0]);

    //  dummy direct data muna
    const sourceData = [
        { "label": "Category A", "value": 40 },
        { "label": "Category B", "value": 30 },
        { "label": "Category C", "value": 50 }
    ];

    const doughnutData = {
        labels: sourceData.map((item) => item.label || "Unknown"),
        datasets: [
            {
                label: "Count",
                data: sourceData.map((item) => item.value || 0),
                backgroundColor: [
                    "rgba(43, 63, 229, 0.8)",
                    "rgba(250, 192, 19, 0.8)",
                    "rgba(253, 135, 135, 0.8)",
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: "bottom" },
            title: {
                display: true,
                text: "Revenue Sources",
            },
        },
    };

    return (
        <div className="stockflow">
            <nav className="absolute top-0 left-0 flex flex-wrap justify-between space-x-8 w-full p-5">
                <div className="invNav flex border-b border-gray-200 space-x-8 md:w-auto mt-3 mb-1">
                    {tabs.map((tab) => (
                        <span
                            key={tab}
                            className={`cursor-pointer text:xs md:text-lg font-semibold transition-colors ${
                                activeTab === tab
                                    ? "text-cyan-600 border-b-2 border-cyan-600"
                                    : "text-gray-500"
                            }`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </span>
                    ))}
                </div>
            </nav>

            <div className="relative flex flex-col items-center justify-center w-full h-full p-5">
                <div className="w-60 h-60 grid grid-cols-2 gap-50">
                    <Doughnut data={doughnutData} options={options} />
                    <Doughnut data={doughnutData} options={options} />
                </div>
            </div>
        </div>
    );
};

export default BodyContent;
