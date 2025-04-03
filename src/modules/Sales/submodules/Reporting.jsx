import React, { useEffect } from "react";
import "../styles/Index.css";
import Heading from "../components/Heading";
import { BarChart, LineChart, PieChart } from "@mui/x-charts";
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
  const [totalProfit, setTotalProfit] = useState(0);
  const [totalSold, setTotalSold] = useState(0);
  const [totalOperations, setTotalOperations] = useState(0);

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
  const customerQuery = useQuery({
    queryKey: ["customers"],
    queryFn: async () => await GET(`sales/reporting/top-customers`),
  });
  const productQuery = useQuery({
    queryKey: ["productReport"],
    queryFn: async () => await GET(`sales/reporting/top-products`),
  });
  const colors = ["#c084fc", "#2563eb", "#fb923c", "#22c55e"];
  const options = ["day", "month", "year", "all"];
  const salesOptions = [
    { label: "1D", value: "day" },
    { label: "1M", value: "month" },
    { label: "1Y", value: "year" },
    { label: "All", value: "all" },
  ];

  useEffect(() => {
    if (profitQuery.status === "success") {
      const data = profitQuery.data.profit_data.map((item) => ({
        ...item,
        date: new Date(item.date),
      }));
      setProfitReportData(data);
      setTotalProfit(profitQuery.data.total_profit);
    }
  }, [profitQuery.data]);

  useEffect(() => {
    if (salesQuery.status === "success") {
      const data = salesQuery.data.data.map((sale) => {
        console.log(sale.date, new Date(sale.date));
        return {
          date: new Date(sale.date),
          quotations: sale.quotations,
          orders: sale.orders,
          invoices: sale.invoices,
          deliveries: sale.deliveries,
        };
      });
      console.log(data);
      setSalesReportData(data);
      setTotalOperations(salesQuery.data.total);
    }
  }, [salesQuery.data]);
  useEffect(() => {
    if (customerQuery.status === "success") {
      const data = customerQuery.data.top_customers;
      setCustomerReportData(data);
    }
  }, [customerQuery.data]);
  useEffect(() => {
    if (productQuery.status === "success") {
      const data = productQuery.data.top_products;
      setProductReportData(data);
      setTotalSold(productQuery.data.total_sold);
    }
  }, [productQuery.data]);

  useEffect(() => {
    profitQuery.refetch();
  }, [profitPeriod]);

  useEffect(() => {
    salesQuery.refetch();
  }, [salesPeriod]);

  return (
    <div className="reporting flex flex-col gap-4 overflow-y-auto w-full">
      <div className="bg-white rounded-lg p-4 w-auto shadow ">
        <Heading
          Title="Reporting"
          SubTitle="Compilation of usable data to further improve business."
        />
      </div>
      {/* FIRST ROW */}
      <div className="flex gap-4">
        {/* PROFIT REPORT */}
        <div className="bg-white rounded-lg p-6 flex-2/5 shadow flex flex-col gap-4">
          <h1 className="font-bold text-2xl text-[#1c1c1c]">Profit Report</h1>
          <div className="justify-center items-center border-[#f3f4f6] rounded-lg border-2 p-4">
            <div className="flex flex-col gap-2 px-4 font-medium">
              <span>Gross Profits</span>
              <span className="text-3xl">
                {totalProfit.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
            <LineChart
              height={325}
              dataset={profitReportData}
              xAxis={[
                {
                  dataKey: "date",
                  scaleType: "time",
                  valueFormatter: (value) =>
                    profitPeriod === "day"
                      ? value.toLocaleString().split(",")[1]
                      : value.toLocaleDateString(),
                },
              ]}
              series={[{ dataKey: "profit" }]}
              margin={{ top: 35, bottom: 45, left: 70, right: 50 }}
            />
            <div className="flex justify-center ">
              <form className="bg-[#f3f4f6] p-2 rounded-lg">
                {options.map((option) => {
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
                        className={`px-4 py-1 rounded-md cursor-pointer ${
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
        </div>
        {/* SALES REPORT */}
        <div className="bg-white rounded-lg p-6 w-full flex-3/5 shadow flex flex-col gap-4">
          <h1 className="font-bold text-2xl text-[#1c1c1c]">Sales Report</h1>
          <div className="justify-center items-center border-[#f3f4f6] rounded-lg border-2 p-4">
            <div className="flex justify-between px-4 mb-4 items-center">
              <div className="flex flex-col gap-2 font-medium">
                <span>Sales Operations</span>
                <span className="text-3xl">{totalOperations}</span>
              </div>
              <form className="bg-[#f3f4f6] p-2 rounded-lg">
                {salesOptions.map((option) => {
                  return (
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
                  );
                })}
              </form>
            </div>
            <LineChart
              height={350}
              dataset={salesReportData}
              xAxis={[
                {
                  dataKey: "date",
                  scaleType: "time",
                  valueFormatter: (value) =>
                    salesPeriod === "day"
                      ? value.toLocaleString().split(",")[1]
                      : value.toLocaleDateString(),
                },
              ]}
              series={[
                {
                  dataKey: "quotations",
                  label: "Quotations",
                  color: "#c084fc",
                },
                { dataKey: "orders", label: "Orders", color: "#fb923c" },
                {
                  dataKey: "invoices",
                  label: "Invoices",
                  color: "#22c55e",
                },
                {
                  dataKey: "deliveries",
                  label: "Deliveries",
                  color: "#2563eb",
                },
              ]}
              margin={{ top: 20, bottom: 80, left: 50, right: 50 }}
              slotProps={{
                legend: {
                  direction: "row", // Align items in a row
                  position: { vertical: "bottom", horizontal: "middle" }, // Move to the bottom center
                  marker: {
                    shape: "circle", // Makes legend markers circular
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* SECOND ROW */}
      <div className="flex gap-4">
        <div className="bg-white rounded-lg p-6 flex-2/5 shadow flex flex-col gap-4">
          <h1 className="font-bold text-2xl text-[#1c1c1c] mb-1">
            Customer Report
          </h1>
          <div className="justify-center items-center  border-[#f3f4f6] rounded-lg border-2">
            <BarChart
              height={475}
              dataset={customerReportData}
              xAxis={[
                {
                  dataKey: "customer",
                  scaleType: "band",
                },
              ]}
              series={[
                {
                  dataKey: "percentage",
                },
              ]}
            />
          </div>
        </div>
        {/*  PRODUCT REPORT */}
        <div className="bg-white rounded-lg p-6 flex-2/5 shadow flex flex-col gap-4">
          <h1 className="font-bold text-2xl text-[#1c1c1c] mb-1">
            Product Report
          </h1>
          <div className="justify-center items-center  border-[#f3f4f6] rounded-lg border-2">
            <PieChart
              colors={colors}
              height={475}
              series={[
                {
                  data: productReportData.map((data, index) => ({
                    value: data.percentage,
                    label: data.product,
                    color: colors[index],
                  })),
                  outerRadius: 165,
                },
              ]}
              slotProps={{
                legend: {
                  direction: "row", // Align items in a row
                  position: { vertical: "bottom", horizontal: "middle" }, // Move to the bottom center
                },
              }}
              margin={{ top: 20, bottom: 70, left: 50, right: 50 }}
            />
          </div>
        </div>

        <div className="flex-1/5">
          <div className="flex flex-col gap-4 font-medium text-sm">
            <div className="bg-white rounded-lg p-4 flex flex-col gap-2">
              <span>Gross Profits</span>
              <span className="text-xl">
                {totalProfit.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="bg-white rounded-lg p-4 flex flex-col">
              <span>Sold</span>
              <span className="text-xl">
                {totalSold.toLocaleString("en-US")}
              </span>
            </div>
            <div className="bg-white rounded-lg p-4 flex flex-col">
              <span>Top Customers</span>
              <span className="text-xl">
                {customerReportData.length > 0
                  ? customerReportData[0].customer
                  : ""}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BodyContent;
