import React, { useEffect } from "react";
import "../Sales/styles/Index.css";
import { useState } from "react";
import { BarChart, LineChart, PieChart } from "@mui/x-charts";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

import Heading from "../Sales/components/Heading";
import { useAlert } from "../Sales/components/Context/AlertContext";
import StatusByOwnerChart from "./components/StatusByOwnerChart";
import { useQuery } from "@tanstack/react-query";
import { GET } from "../Sales/api/api";

const generateDummyData = (range) => {
  const { showAlert } = useAlert();
  const now = new Date();
  const data = [];

  const steps = {
    day: 12, // hourly data for 1 day
    month: 30, // daily
    year: 12, // monthly
    max: 6, // yearly
  };

  const stepCount = steps[range];

  for (let i = 0; i < stepCount; i++) {
    let date;
    if (range === "day") {
      date = new Date(now.getTime() - (stepCount - i) * 60 * 60 * 1000);
    } else if (range === "month") {
      date = new Date(now.getTime() - (stepCount - i) * 24 * 60 * 60 * 1000);
    } else if (range === "year") {
      date = new Date(now.getFullYear(), now.getMonth() - (stepCount - i), 1);
    } else {
      date = new Date(now.getFullYear() - (stepCount - i), 0, 1);
    }

    data.push({
      date,
      leads: 100 + Math.round(Math.random() * 100),
      prospects: 80 + Math.round(Math.random() * 100),
      opportunities: 40 + Math.round(Math.random() * 60),
      closed: 20 + Math.round(Math.random() * 40),
    });
  }

  return data;
};

const BodyContent = ({ loadSubModule, setActiveSubModule, employee_id }) => {
  const [totalLeads, setTotalLeads] = useState(365);
  const [totalProspects, setTotalProspects] = useState(28);
  const [totalActiveCampaigns, setTotalActiveCampaigns] = useState(12);
  const [totalOpportunities, setTotalOpportunities] = useState(5);
  const [totalClosed, setTotalClosed] = useState(912);

  const [avgDealAmount, setAvgDealAmount] = useState(120000);
  const [totalRevenue, setTotalRevenue] = useState(6900000);

  const [salesPeriod, setSalesPeriod] = useState("day");
  const [conversionData, setConversionData] = useState([]);

  const ownerStatusData = [
    { owner: "Gary V", leadIn: 70, contact: 100, closed: 180 },
    { owner: "Sympathetic Patty", leadIn: 90, contact: 110, closed: 150 },
    { owner: "Patrick Star", leadIn: 85, contact: 120, closed: 240 },
    { owner: "Eliza D", leadIn: 40, contact: 60, closed: 100 },
    { owner: "Adan Ayo", leadIn: 30, contact: 40, closed: 80 },
  ];

  const chartConfigs = [
    {
      title: "Lead Status by Owner",
      dataKeyLabels: [
        { key: "leadIn", label: "Lead In", color: "#22c55e" },
        { key: "contact", label: "Contact Made", color: "#fb923c" },
        { key: "closed", label: "Closed", color: "#2563eb" },
      ],
      data: ownerStatusData,
    },
    {
      title: "Prospect Status by Owner",
      dataKeyLabels: [
        { key: "leadIn", label: "Prospect In", color: "#22c55e" },
        { key: "contact", label: "Contact Made", color: "#fb923c" },
        { key: "closed", label: "Closed", color: "#2563eb" },
      ],
      data: ownerStatusData,
    },
    {
      title: "Opportunities Status by Owner",
      dataKeyLabels: [
        { key: "leadIn", label: "Opportunities In", color: "#22c55e" },
        { key: "contact", label: "Contact Made", color: "#fb923c" },
        { key: "closed", label: "Closed", color: "#2563eb" },
      ],
      data: ownerStatusData,
    },
  ];

  function formatNumber(num) {
    if (num < 1_000) return num.toString();
    if (num < 1_000_000)
      return (num / 1_000).toFixed(num >= 100_000 ? 0 : 1) + "k";
    if (num < 1_000_000_000)
      return (num / 1_000_000).toFixed(num >= 100_000_000 ? 0 : 1) + "M";
    return (num / 1_000_000_000).toFixed(num >= 100_000_000_000 ? 0 : 1) + "B";
  }

  const colors = ["#c084fc", "#2563eb", "#fb923c", "#22c55e"];

  const periodOptions = [
    { label: "1D", value: "day" },
    { label: "1M", value: "month" },
    { label: "1Y", value: "year" },
    { label: "All", value: "all" },
  ];

  const pipelineData = [
    {
      category: "Leads",
      value: totalLeads,
    },
    {
      category: "Prospects",
      value: totalProspects,
    },
    {
      category: "Closed",
      value: totalClosed,
    },
  ];

  const conversionQuery = useQuery({
    queryKey: ["conversionData"],
    queryFn: async () =>
      await GET(`crm/reporting/conversion?period=${salesPeriod}`),
  });

  const dashboardQuery = useQuery({
    queryKey: ["dashboardData"],
    queryFn: async () => await GET(`crm/reporting/dashboard`),
  });

  useEffect(() => {
    if (dashboardQuery.status === "success") {
      setTotalLeads(dashboardQuery.data.leads_count);
      setTotalProspects(dashboardQuery.data.prospects_count);
      setTotalOpportunities(dashboardQuery.data.total_opportunities);
      setTotalClosed(dashboardQuery.data.closed_opportunities);
      setTotalActiveCampaigns(dashboardQuery.data.active_campaigns_count);
    } else if (dashboardQuery.status === "error") {
      showAlert({
        type: "error",
        title: "Error fetching dashboard data:" + dashboardQuery.error,
      });
    }
  }, [dashboardQuery.data, dashboardQuery.status]);

  useEffect(() => {
    if (conversionQuery.status === "success") {
      const data = conversionQuery.data.customer_data.map((item) => ({
        date: new Date(item.date),
        leads: item.leads,
        prospects: item.prospects,
        opportunities: item.opportunities,
        won: item.won,
      }));
      setConversionData(data);
      setAvgDealAmount(conversionQuery.data.average_value);
      setTotalRevenue(conversionQuery.data.total_profit);
    } else if (conversionQuery.status === "error") {
      showAlert({
        type: "error",
        title: "Error fetching conversion data:" + conversionQuery.error,
      });
    }
  }, [conversionQuery.data, conversionQuery.status]);

  useEffect(() => {
    (async () => await conversionQuery.refetch())();
  }, [salesPeriod]);

  return (
    <div className="reporting">
      <div className="flex flex-col gap-4 overflow-y-auto w-full body-content-container bg-[#eff8f9]">
        <div className="bg-white rounded-lg p-4 w-auto shadow">
          <Heading
            Title="CRM Dashboard"
            SubTitle="Your shortcut to all CRM operations."
          />
        </div>
        <main>
          {/* Main Data Row */}
          <section className="flex gap-4 flex-wrap justify-center mb-4">
            <div>
              <div className="bg-white rounded-lg p-4 px-16 w-full shadow text-center">
                <h2 className="text-3xl font-light">
                  {formatNumber(totalLeads)}
                </h2>
                <p className="text-lg text-[#9FA1A6]">Total Leads</p>
              </div>
            </div>
            <div>
              <div className="bg-white rounded-lg p-4 px-16 w-full shadow text-center">
                <h2 className="text-3xl font-light">
                  {formatNumber(totalProspects)}
                </h2>
                <p className="text-lg text-[#9FA1A6]">Total Prospects</p>
              </div>
            </div>
            <div>
              <div className="bg-white rounded-lg p-4 px-16 w-full shadow text-center">
                <h2 className="text-3xl font-light">
                  {formatNumber(totalClosed)}
                </h2>
                <p className="text-lg text-[#9FA1A6]">Total Closed</p>
              </div>
            </div>
            <div>
              <div className="bg-white rounded-lg p-4 px-16 w-full shadow text-center">
                <h2 className="text-3xl font-light">
                  {formatNumber(totalActiveCampaigns)}
                </h2>
                <p className="text-lg text-[#9FA1A6]">Active Campaigns</p>
              </div>
            </div>
            <div>
              <div className="bg-white rounded-lg p-4 px-16 w-full shadow text-center">
                <h2 className="text-3xl font-light">
                  {formatNumber(totalOpportunities)}
                </h2>
                <p className="text-lg text-[#9FA1A6]">Opportunities</p>
              </div>
            </div>
          </section>

          {/* Rate and Pipeline */}
          <section className="flex gap-4 flex-col lg:flex-row flex-wrap">
            <div className="bg-white rounded-lg p-6 shadow flex-1 flex-col gap-3">
              <h1 className="font-bold text-2xl text-[#1c1c1c]">
                Prospects Conversion Rate
              </h1>
              <div className="justify-center items-center p-4 border-[#f3f4f6] rounded-lg border-2">
                <div className="flex flex-col gap-2 font-medium mx-6 mt-5">
                  <span>Total Prospects</span>
                  <span className="text-3xl">{totalProspects}</span>
                </div>
                <PieChart
                  colors={colors}
                  height={450}
                  series={[
                    {
                      data: [
                        {
                          value: totalProspects,
                          color: "#fb923c",
                          label: `Converted (${(
                            (totalProspects / (totalProspects + totalLeads)) *
                            100
                          ).toFixed(1)}%)`,
                        },
                        {
                          value: totalLeads,
                          color: "#2563EB",
                          label: `Not Converted (${(
                            100 -
                            (totalProspects / (totalProspects + totalLeads)) *
                              100
                          ).toFixed(1)}%)`,
                        },
                      ],
                      outerRadius: 165,
                      labelKey: "labelKey", // important to tell PieChart which label to use
                    },
                  ]}
                  slotProps={{
                    legend: {
                      direction: "column",
                      position: { vertical: "bottom", horizontal: "middle" },
                    },
                  }}
                  margin={{ top: 20, bottom: 70, left: 50, right: 50 }}
                />
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow flex-1 flex-col gap-3">
              <h1 className="font-bold text-2xl text-[#1c1c1c]">
                Leads Conversion Rate
              </h1>
              <div className="justify-center items-center p-4 border-[#f3f4f6] rounded-lg border-2">
                <div className="flex flex-col gap-2 font-medium mx-6 mt-5">
                  <span>Total Closed</span>
                  <span className="text-3xl">{totalClosed}</span>
                </div>
                <PieChart
                  colors={colors}
                  height={450}
                  series={[
                    {
                      data: [
                        {
                          value: totalClosed,
                          color: "#fb923c",
                          label: `Converted (${(
                            (totalClosed / (totalClosed + totalLeads)) *
                            100
                          ).toFixed(1)}%)`,
                        },
                        {
                          value: totalProspects,
                          color: "#2563EB",
                          label: `Not Converted (${(
                            100 -
                            (totalClosed / (totalClosed + totalLeads)) * 100
                          ).toFixed(1)}%)`,
                        },
                      ],
                      outerRadius: 165,
                      labelKey: "labelKey", // important to tell PieChart which label to use
                    },
                  ]}
                  slotProps={{
                    legend: {
                      direction: "column",
                      position: { vertical: "bottom", horizontal: "middle" },
                    },
                  }}
                  margin={{ top: 20, bottom: 70, left: 50, right: 50 }}
                />
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow flex-1 flex-col gap-3">
              <h1 className="font-bold text-2xl text-[#1c1c1c]">
                Business Pipeline
              </h1>
              <div className="justify-center items-stretch p-4 border-[#f3f4f6] rounded-lg border-2">
                <div className="flex flex-col gap-2 font-medium mx-6 mt-5 mb-5">
                  <span></span>
                </div>
                <div className="w-full h-[450px] ">
                  <ResponsiveContainer
                    width="100%"
                    height={450}
                    className={"mt-[70px]"}
                  >
                    <RadarChart
                      cx="50%"
                      cy="50%"
                      outerRadius="80%"
                      data={pipelineData}
                    >
                      <PolarGrid />
                      <PolarAngleAxis dataKey="category" />
                      <PolarRadiusAxis
                        angle={90}
                        domain={[
                          0,
                          Math.max([totalLeads, totalProspects, totalClosed]),
                        ]}
                      />
                      <Radar
                        name="Status"
                        dataKey="value"
                        stroke="#6366F1"
                        fill="#6366F1"
                        fillOpacity={0.4}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </section>

          {/* Further Details Two columns */}
          <section className="flex gap-4 my-4 w-full flex-col lg:flex-row">
            {/* Left Column */}
            <div className="gap-4 flex flex-col w-full">
              {/* Metrics */}
              <div className="flex gap-4 w-full">
                {/* Average Deal Amount */}
                <div className="flex-1">
                  <div className="bg-white rounded-lg p-4 px-16 w-full shadow text-center flex-1">
                    <h2 className="text-3xl font-light">
                      {formatNumber(avgDealAmount)}
                    </h2>
                    <p className="text-lg text-[#9FA1A6]">Avg Deal Amount</p>
                  </div>
                </div>
                {/* Total Revenue */}
                <div className="flex-1">
                  <div className="bg-white rounded-lg p-4 px-16 w-full shadow text-center flex-1">
                    <h2 className="text-3xl font-light">
                      {formatNumber(totalRevenue)}
                    </h2>
                    <p className="text-lg text-[#9FA1A6]">Total Revenue</p>
                  </div>
                </div>
              </div>

              {/* Deals Conversion */}
              <div className="bg-white rounded-lg p-6 shadow w-full flex flex-col gap-4">
                <h1 className="font-bold text-2xl text-[#1c1c1c]">
                  Deals Conversion
                </h1>

                <div className="justify-center items-center border-[#f3f4f6] rounded-lg border-2 p-4">
                  {/* Header and Toggle */}
                  <div className="flex justify-between px-4 mb-4 items-center">
                    <div className="flex flex-col gap-2 font-medium">
                      {/* <span>Sales Operations</span>
                      <span className="text-3xl">
                        {conversionData[conversionData.length - 1].closed}
                      </span> */}
                    </div>
                    <form className="bg-[#f3f4f6] p-2 rounded-lg">
                      {periodOptions.map((option) => (
                        <label key={option.label}>
                          <input
                            type="radio"
                            name="time_range"
                            value={option.value}
                            className="hidden"
                            checked={salesPeriod === option.value}
                            onChange={() => setSalesPeriod(option.value)}
                          />
                          <span
                            className={`px-4 py-1 rounded-md cursor-pointer ${
                              salesPeriod === option.value
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

                  {/* Chart */}
                  <LineChart
                    height={450}
                    dataset={conversionData}
                    xAxis={[
                      {
                        dataKey: "date",
                        scaleType: "time",
                        valueFormatter: (value) =>
                          salesPeriod === "day"
                            ? value.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : value.toLocaleDateString(undefined, {
                                month: "short",
                                day: "numeric",
                                year:
                                  salesPeriod === "max" ? "numeric" : undefined,
                              }),
                      },
                    ]}
                    series={[
                      {
                        dataKey: "leads",
                        label: "Leads",
                        color: "#c084fc",
                        curve: "linear",
                      },
                      {
                        dataKey: "prospects",
                        label: "Prospects",
                        color: "#fb923c",
                        curve: "linear",
                      },
                      {
                        dataKey: "opportunities",
                        label: "Opportunities",
                        color: "#2563eb",
                        curve: "linear",
                      },
                      {
                        dataKey: "won",
                        label: "Opportunities Won",
                        color: "#22c55e",
                        curve: "linear",
                      },
                    ]}
                    margin={{ top: 20, bottom: 80, left: 50, right: 50 }}
                    slotProps={{
                      legend: {
                        direction: "row",
                        position: { vertical: "bottom", horizontal: "middle" },
                        marker: { shape: "circle" },
                      },
                    }}
                  />
                </div>
              </div>
            </div>
            {/* Right Column w qualifications removed if none*/}
            <div className="gap-4 flex flex-col w-full hidden">
              {chartConfigs.map((config) => (
                <StatusByOwnerChart
                  key={config.title}
                  title={config.title}
                  dataKeyLabels={config.dataKeyLabels}
                  data={config.data}
                />
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default BodyContent;
