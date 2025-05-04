import React, { useEffect } from "react";
import "./styles/Index.css";
import Heading from "./components/Heading";
import { BarChart, LineChart, PieChart } from "@mui/x-charts";
import { GET } from "./api/api";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useAlert } from "./components/Context/AlertContext";
import Dropdown from "./components/Dropdown";
import { AlertProvider } from "./components/Context/AlertContext";

const Sales = ({ loadSubModule, setActiveSubModule, employee_id }) => {
  const { showAlert } = useAlert();
  const [profitReportData, setProfitReportData] = useState([]);
  const [salesReportData, setSalesReportData] = useState([]);
  const [customerReportData, setCustomerReportData] = useState([]);
  const [productReportData, setProductReportData] = useState([]);
  const [employeeReportData, setEmployeeReportData] = useState([]);
  const [employeeDealsData, setEmployeeDealsData] = useState([]);
  const [commissionData, setCommissionData] = useState([]);
  const [quotaData, setQuotaData] = useState([]);
  const [profitPeriod, setProfitPeriod] = useState("day"); // day, month, year, all
  const [salesPeriod, setSalesPeriod] = useState("day"); // day, month, year, all
  const [salesReportPeriod, setSalesReportPeriod] = useState("Day"); // day, month, year, all
  const [dealsPeriod, setDealsPeriod] = useState("Day"); // day, month, year, all
  const [totalProfit, setTotalProfit] = useState(0);
  const [totalSold, setTotalSold] = useState(0);
  const [totalOperations, setTotalOperations] = useState(0);
  const [totalCommissions, setTotalCommissions] = useState(0);
  const [quotaReached, setQuotaReached] = useState(false);
  const [quotaRemaining, setQuotaRemaining] = useState(0);
  const [quotaPeriod, setQuotaPeriod] = useState("day"); // day, month, year, all
  const [commissionPeriod, setCommissionPeriod] = useState("day"); // day, month, year, all
  console.log("employee_id", employee_id);

  const profitQuery = useQuery({
    queryKey: ["profits"],
    queryFn: async () =>
      await GET(`sales/reporting/profit?period=${profitPeriod}`),
    retry: 2,
  });

  const salesQuery = useQuery({
    queryKey: ["sales"],
    queryFn: async () =>
      await GET(`sales/reporting/operations?period=${salesPeriod}`),
    retry: 2,
  });
  const customerQuery = useQuery({
    queryKey: ["customers"],
    queryFn: async () => await GET(`sales/reporting/top-customers`),
    retry: 2,
  });
  const productQuery = useQuery({
    queryKey: ["productReport"],
    queryFn: async () => await GET(`sales/reporting/top-products`),
    retry: 2,
  });
  const employeeQuery = useQuery({
    queryKey: ["employeeReport"],
    queryFn: async () =>
      await GET(`sales/reporting/top-employees?period=${salesReportPeriod}`),
    retry: 2,
  });
  const employeeDealsQuery = useQuery({
    queryKey: ["employeeDealsReport"],
    queryFn: async () =>
      await GET(
        `sales/reporting/top-employee-conversions?period=${dealsPeriod}`
      ),
    retry: 2,
  });
  const commissionQuery = useQuery({
    queryKey: ["commissions"],
    queryFn: async () =>
      await GET(
        `sales/reporting/commissions?period=${commissionPeriod}&salesrep=${employee_id}`
      ),
    retry: 2,
  });
  const quotaQuery = useQuery({
    queryKey: ["quota"],
    queryFn: async () =>
      await GET(`sales/reporting/quota?salesrep=${employee_id}`),
    retry: 2,
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
    } else if (profitQuery.status === "error") {
      showAlert({ type: "error", title: "Failed to fetch Profit Report." });
    }
  }, [profitQuery.data, profitQuery.status]);

  useEffect(() => {
    if (salesQuery.status === "success") {
      const data = salesQuery.data.data.map((sale) => {
        return {
          date: new Date(sale.date),
          quotations: sale.quotations,
          orders: sale.orders,
          invoices: sale.invoices,
          deliveries: sale.deliveries,
        };
      });
      setSalesReportData(data);
      setTotalOperations(salesQuery.data.total);
    } else if (salesQuery.status === "error") {
      showAlert({
        type: "error",
        title: "Failed to fetch Sales Operations Report.",
      });
    }
  }, [salesQuery.data, salesQuery.status]);

  useEffect(() => {
    if (customerQuery.status === "success") {
      const data = customerQuery.data.top_customers;
      setCustomerReportData(data);
    } else if (customerQuery.status === "error") {
      showAlert({
        type: "error",
        title: "Failed to fetch Top Customers Report.",
      });
    }
  }, [customerQuery.data, customerQuery.status]);

  useEffect(() => {
    if (productQuery.status === "success") {
      const data = productQuery.data.top_products;
      setProductReportData(data);
      setTotalSold(productQuery.data.total_sold);
    } else if (productQuery.status === "error") {
      showAlert({
        type: "error",
        title: "Failed to fetch Top Products Report.",
      });
    }
  }, [productQuery.data, productQuery.status]);

  useEffect(() => {
    if (employeeQuery.status === "success") {
      const data = employeeQuery.data.top_employees;
      setEmployeeReportData(data);
    } else if (employeeQuery.status === "error") {
      showAlert({
        type: "error",
        title: "Failed to fetch Top Employee Revenue Report.",
      });
    }
  }, [employeeQuery.data, employeeQuery.status]);

  useEffect(() => {
    if (employeeDealsQuery.status === "success") {
      const data = employeeDealsQuery.data.top_employees;
      setEmployeeDealsData(data);
    } else if (employeeDealsQuery.status === "error") {
      showAlert({
        type: "error",
        title: "Failed to fetch Top Employee Deals Report.",
      });
    }
  }, [employeeDealsQuery.data, employeeDealsQuery.status]);
  useEffect(() => {
    if (commissionQuery.status === "success") {
      const formattedData = commissionQuery.data.commission_data.map(
        (item) => ({
          date: new Date(item.date),
          commission: Number(item.commission), // Ensure commission is a number
        })
      );
      setCommissionData(formattedData);
      setTotalCommissions(commissionQuery.data.total_commission);
    } else if (commissionQuery.status === "error") {
      showAlert({
        type: "error",
        title: "Failed to fetch Commissions Report.",
      });
    }
  }, [commissionQuery.data, commissionQuery.status]);

  useEffect(() => {
    if (quotaQuery.status === "success") {
      const formattedData = quotaQuery.data.daily_progress.map((item) => ({
        date: new Date(item.date),
        orders: Number(item.orders), // Ensure commission is a number
      }));
      setQuotaData(formattedData);
      setQuotaReached(quotaQuery.data.quota_reached);
      setQuotaRemaining(quotaQuery.data.remaining);
    } else if (quotaQuery.status === "error") {
      showAlert({
        type: "error",
        title: "Failed to fetch Quota Report.",
      });
    }
  }, [quotaQuery.data, quotaQuery.status]);

  useEffect(() => {
    (async () => await profitQuery.refetch())();
  }, [profitPeriod]);

  useEffect(() => {
    (async () => await salesQuery.refetch())();
  }, [salesPeriod]);

  useEffect(() => {
    (async () => await employeeQuery.refetch())();
  }, [salesReportPeriod]);

  useEffect(() => {
    (async () => await employeeDealsQuery.refetch())();
  }, [dealsPeriod]);
  useEffect(() => {
    (async () => await commissionQuery.refetch())();
  }, [commissionPeriod]);

  return (
    <div className="reporting">
      <div className="flex flex-col gap-4 overflow-y-auto w-full body-content-container bg-[#eff8f9]">
        <div className="bg-white rounded-lg p-4 w-auto shadow">
          <Heading
            Title="Sales Dashboard"
            SubTitle="Compilation of usable data to further improve business."
          />
        </div>
        {/* FIRST ROW */}
        <div className="flex gap-4 flex-col lg:flex-row">
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
                series={[
                  {
                    dataKey: "profit",
                    color: "#16a34a",
                    curve: "linear",
                  },
                ]}
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
                    curve: "linear",
                  },
                  {
                    dataKey: "orders",
                    label: "Orders",
                    color: "#fb923c",
                    curve: "linear",
                  },
                  {
                    dataKey: "invoices",
                    label: "Invoices",
                    color: "#22c55e",
                    curve: "linear",
                  },
                  {
                    dataKey: "deliveries",
                    label: "Deliveries",
                    color: "#2563eb",
                    curve: "linear",
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
        <div className="flex gap-4 flex-col lg:flex-row">
          {/* Short Reports */}
          <div className="flex gap-4 flex-2/6 flex-col">
            {/* Customer Report */}
            <div className="bg-white rounded-lg p-6 shadow flex flex-col gap-2">
              <h1 className="font-bold text-2xl text-[#1c1c1c] mb-1">
                Customer Report
              </h1>
              <div className="justify-center items-center  border-[#f3f4f6] rounded-lg border-2">
                <div className="flex flex-col gap-2 font-medium mx-6 mt-5">
                  <span>Top Customer</span>
                  <span className="text-3xl">
                    {customerReportData.length > 0
                      ? customerReportData[0].customer
                      : "-"}
                  </span>
                </div>
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
            {/*  Personal Business Expenses REPORT */}
            {/* <div className="bg-white rounded-lg p-6 shadow flex flex-col gap-3">
              <h1 className="font-bold text-2xl text-[#1c1c1c]">
                Personal Business Expenses
              </h1>
              <div className="justify-center items-center  border-[#f3f4f6] rounded-lg border-2">
                <PieChart
                  colors={colors}
                  height={560}
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
            </div> */}
            {/*  PRODUCT REPORT */}
            <div className="bg-white rounded-lg p-6 shadow flex flex-col gap-3">
              <h1 className="font-bold text-2xl text-[#1c1c1c]">
                Product Report
              </h1>
              <div className="justify-center items-center  border-[#f3f4f6] rounded-lg border-2">
                <PieChart
                  colors={colors}
                  height={560}
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
            {/*  Sales Team Business Expenses REPORT */}
            {/* <div className="bg-white rounded-lg p-6 shadow flex flex-col gap-3">
              <h1 className="font-bold text-2xl text-[#1c1c1c]">
                Sales Team Business Expenses
              </h1>
              <div className="justify-center items-center  border-[#f3f4f6] rounded-lg border-2">
                <PieChart
                  colors={colors}
                  height={560}
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
            </div> */}
          </div>

          {/* BIG Reports */}
          <div className="flex gap-4 flex-col flex-4/6">
            {/* Commissions  REPORT */}
            <div className="bg-white rounded-lg p-6 shadow flex flex-col gap-3">
              <h1 className="font-bold text-2xl text-[#1c1c1c]">
                Commissions Report
              </h1>
              <div className="justify-center items-center border-[#f3f4f6] rounded-lg border-2 p-4">
                <div className="flex flex-col gap-2 px-4 font-medium">
                  <span>Total Commission</span>
                  <span className="text-3xl">
                    {totalCommissions.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                  <LineChart
                    height={325}
                    dataset={commissionData}
                    xAxis={[
                      {
                        dataKey: "date",
                        scaleType: "time",
                        valueFormatter: (value) =>
                          commissionPeriod === "day"
                            ? value.toLocaleString().split(",")[1]
                            : value.toLocaleDateString(),
                      },
                    ]}
                    series={[
                      {
                        dataKey: "commission",
                        color: "#8979FF",
                        curve: "linear",
                      },
                    ]}
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
                              checked={commissionPeriod === option}
                              onChange={() => setCommissionPeriod(option)}
                            />
                            <span
                              className={`px-4 py-1 rounded-md cursor-pointer ${
                                commissionPeriod === option
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
            </div>

            {/* Quota vs Completed Order Report */}
            <div className="bg-white rounded-lg p-6 shadow flex flex-col gap-2">
              <h1 className="font-bold text-2xl text-[#1c1c1c] mb-1">
                Quota Report
              </h1>
              <div className="justify-center items-center border-[#f3f4f6] rounded-lg border-2 p-4">
                <div className="flex flex-col gap-2 px-4 font-medium">
                  <span>Orders Remaining to Hit Quota</span>
                  <span className="text-3xl">
                    {quotaRemaining.toLocaleString("en-US")}
                  </span>
                </div>
                <LineChart
                  height={350}
                  dataset={quotaData}
                  xAxis={[
                    {
                      dataKey: "date",
                      scaleType: "time",
                      valueFormatter: (value) => value.toLocaleDateString(),
                    },
                  ]}
                  series={[
                    {
                      dataKey: "orders",
                      color: "#8979FF",
                      curve: "linear",
                    },
                  ]}
                  margin={{ top: 30, bottom: 30, left: 50, right: 50 }}
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

            {/* Top Sales Employee Report */}
            <div className="bg-white rounded-lg p-6 w-full flex flex-col gap-6 shadow">
              <h1 className="font-bold text-2xl text-[#1c1c1c] mt-2 mb-1 text-center">
                Top Sales Employee Report
              </h1>
              <div className="flex gap-4">
                <div className="flex flex-col gap-2 flex-1/2">
                  <div className="justify-center items-center  border-[#f3f4f6] rounded-lg border-2">
                    <div className="flex justify-between mx-6 mt-5">
                      <div className="flex flex-col gap-2 font-medium">
                        <span>Sales Revenue</span>
                        <span className="text-3xl">
                          {employeeReportData.length > 0
                            ? employeeReportData[0].employee
                            : "-"}
                        </span>
                      </div>
                      <div>
                        <Dropdown
                          options={options.map(
                            (p) => p.charAt(0).toUpperCase() + p.slice(1)
                          )}
                          onChange={setSalesReportPeriod}
                          value={
                            salesReportPeriod.charAt(0).toUpperCase() +
                            salesReportPeriod.slice(1)
                          }
                        />
                      </div>
                    </div>
                    <PieChart
                      colors={colors}
                      height={475}
                      series={[
                        {
                          data: employeeReportData.map((data, index) => ({
                            value: data.percentage,
                            label: data.employee,
                            color: colors[index],
                          })),
                          innerRadius: 100,
                          outerRadius: 165,
                        },
                      ]}
                      slotProps={{
                        legend: {
                          direction: "row", // Align items in a row
                          position: {
                            vertical: "bottom",
                            horizontal: "middle",
                          }, // Move to the bottom center
                        },
                      }}
                      margin={{ top: 20, bottom: 70, left: 50, right: 50 }}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2 flex-1/2">
                  <div className="justify-center items-center  border-[#f3f4f6] rounded-lg border-2">
                    <div className="flex justify-between mx-6 mt-5">
                      <div className="flex flex-col gap-2 font-medium">
                        <span>Closed Deals</span>
                        <span className="text-3xl">
                          {employeeDealsData.length > 0
                            ? employeeDealsData[0].employee
                            : "-"}
                        </span>
                      </div>
                      <div>
                        <Dropdown
                          options={options.map(
                            (p) => p.charAt(0).toUpperCase() + p.slice(1)
                          )}
                          onChange={setDealsPeriod}
                          value={
                            dealsPeriod.charAt(0).toUpperCase() +
                            dealsPeriod.slice(1)
                          }
                        />
                      </div>
                    </div>
                    <PieChart
                      colors={colors}
                      height={475}
                      series={[
                        {
                          data: employeeDealsData.map((data, index) => ({
                            value: data.percentage,
                            label: data.employee,
                            color: colors[index],
                          })),
                          innerRadius: 100,
                          outerRadius: 165,
                        },
                      ]}
                      slotProps={{
                        legend: {
                          direction: "row", // Align items in a row
                          position: {
                            vertical: "bottom",
                            horizontal: "middle",
                          }, // Move to the bottom center
                        },
                      }}
                      margin={{ top: 20, bottom: 70, left: 50, right: 50 }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BodyContent = ({ loadSubModule, setActiveSubModule, employee_id }) => {
  return (
    <AlertProvider>
      <Sales
        loadSubModule={loadSubModule}
        setActiveSubModule={setActiveSubModule}
        employee_id={employee_id}
      />
    </AlertProvider>
  );
};

export default BodyContent;
