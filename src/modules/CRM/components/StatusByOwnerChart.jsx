// crm_dashboard_layout.jsx

import React, { useState, useMemo } from "react";
import { BarChart } from "@mui/x-charts";

const generateDummyOwnerData = (period) => {
  const baseValues = {
    day: 1,
    month: 5,
    year: 12,
    max: 20,
  }[period];

  const scale = baseValues || 1;

  return [
    {
      owner: "Gary V",
      leadIn: 20 * scale,
      contact: 25 * scale,
      closed: 30 * scale,
    },
    {
      owner: "Sympathetic Patty",
      leadIn: 18 * scale,
      contact: 22 * scale,
      closed: 27 * scale,
    },
    {
      owner: "Patrick Star",
      leadIn: 15 * scale,
      contact: 28 * scale,
      closed: 40 * scale,
    },
    {
      owner: "Eliza D",
      leadIn: 10 * scale,
      contact: 15 * scale,
      closed: 18 * scale,
    },
    {
      owner: "Adan Ayo",
      leadIn: 8 * scale,
      contact: 12 * scale,
      closed: 16 * scale,
    },
  ];
};

const StatusByOwnerChart = ({ title, dataKeyLabels }) => {
  const [period, setPeriod] = useState("week");

  const periodOptions = [
    { label: "1D", value: "day" },
    { label: "1M", value: "month" },
    { label: "1Y", value: "year" },
    { label: "Max", value: "max" },
  ];

  const data = useMemo(() => generateDummyOwnerData(period), [period]);

  return (
    <div className="bg-white rounded-lg p-6 shadow w-full flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-2xl text-[#1c1c1c]">{title}</h1>
        <form className="bg-[#f3f4f6] p-2 rounded-lg">
          {periodOptions.map((option) => (
            <label key={option.label}>
              <input
                type="radio"
                name={`period_${title}`}
                value={option.value}
                className="hidden"
                checked={period === option.value}
                onChange={() => setPeriod(option.value)}
              />
              <span
                className={`px-4 py-1 rounded-md cursor-pointer ${
                  period === option.value
                    ? "bg-white text-black font-medium shadow"
                    : "text-gray-500"
                }`}
              >
                {option.label}
              </span>
            </label>
          ))}
        </form>
      </div>

      <div className="justify-center items-center border-[#f3f4f6] rounded-lg border-2 p-4">
        <BarChart
          height={500}
          series={dataKeyLabels.map((item) => ({
            dataKey: item.key,
            label: item.label,
            color: item.color,
            stack: "a",
          }))}
          yAxis={[{ scaleType: "band", dataKey: "owner" }]}
          xAxis={[{ scaleType: "linear" }]}
          dataset={data}
          layout="horizontal"
          margin={{ top: 20, bottom: 80, left: 100, right: 30 }}
          grid={{ horizontal: true }}
          slotProps={{
            legend: {
              direction: "row",
              position: { vertical: "bottom", horizontal: "middle" },
            },
          }}
        />
      </div>
    </div>
  );
};

export default StatusByOwnerChart;
