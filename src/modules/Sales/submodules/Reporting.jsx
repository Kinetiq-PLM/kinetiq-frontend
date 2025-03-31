import React, { useEffect } from "react";
import "../styles/Index.css";
import Heading from "../components/Heading";
import { LineChart } from "@mui/x-charts";
import { GET } from "../api/api";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const BodyContent = ({ loadSubModule, setActiveSubModule }) => {
  const [profitReportData, setProfitReportData] = useState([]);
  const [salesReportData, setSalesReportData] = useState([]);
  const [customerReportData, setCustomerReportData] = useState([]);
  const [productReportData, setProductReportData] = useState([]);
  const [profitPeriod, setProfitPeriod] = useState("day"); // day, month, year, all
  const [salesPeriod, setSalesPeriod] = useState("day"); // day, month, year, all

  const profitQuery = useQuery({
    queryKey: ["profits"],
    queryFn: async () =>
      await GET(`sales/reporting/profit?period=${profitPeriod}`),
  });

  const salesQuery = useQuery({
    queryKey: ["sales"],
    queryFn: async () =>
      await GET(`sales/reporting/operations?period=${salesPeriod}`),
  });

  const profitOptions = ["day", "month", "year", "all"];

  useEffect(() => {
    if (profitQuery.status === "success") {
      setProfitReportData(
        profitQuery.data.profit_data.map((item) => ({
          ...item,
          date: new Date(item.date),
        }))
      );
    }
  }, [profitQuery.data]);

  useEffect(() => {
    if (salesQuery.status === "success") {
      const data = salesQuery.data.data.map((sale) => ({
        date: new Date(sale.date),
        quotations: sale.quotations,
        orders: sale.orders,
        invoices: sale.invoices,
      }));
      setSalesReportData(data);
    }
  }, [salesQuery.data]);
  return (
    <div className="reporting flex flex-col gap-4 overflow-y-auto">
      <div className="bg-white rounded-lg p-8 w-full shadow">
        <Heading
          Title="Reporting"
          SubTitle="Compilation of usable data to further improve business."
        />
      </div>
      <div className="flex gap-4">
        <div className="bg-white rounded-lg p-8 flex-2/5 shadow flex flex-col gap-2">
          <h1 className="font-bold text-2xl text-[#1c1c1c] mb-1">
            Profit Report
          </h1>
          <div className="justify-center items-center">
            <LineChart
              height={400}
              dataset={profitReportData}
              xAxis={[
                {
                  dataKey: "date",
                  scaleType: "time",
                  valueFormatter: (value) => value.toLocaleDateString(),
                },
              ]}
              series={[{ dataKey: "profit" }]}
            />
          </div>
          <div className="flex justify-center bg-[#f3f4f6] py-3 rounded-lg">
            <form>
              {profitOptions.map((option) => {
                return (
                  <label key={option}>
                    <input
                      type="radio"
                      name="time_range"
                      value={option}
                      className="hidden"
                      checked={profitPeriod === option}
                      onChange={() => setProfitPeriod(option)}
                    />
                    <span
                      className={`px-10 py-2 rounded-md cursor-pointer ${
                        profitPeriod === option
                          ? "bg-white text-black font-medium shadow"
                          : "text-gray-500"
                      }`}
                    >
                      {String(option).charAt(0).toUpperCase() +
                        String(option).slice(1)}
                    </span>
                  </label>
                );
              })}
            </form>
          </div>
        </div>
        <div className="bg-white rounded-lg p-8 w-full flex-3/5 shadow">
          <h1 className="font-bold text-2xl text-[#1c1c1c] mb-1">
            Sales Report
          </h1>
          <div className="justify-center items-center">
            <LineChart
              height={400}
              dataset={salesReportData}
              xAxis={[
                {
                  dataKey: "date",
                  scaleType: "time",
                  valueFormatter: (value) => value.toLocaleDateString(),
                },
              ]}
              series={[{ dataKey: "profit" }]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BodyContent;
