import React, { useEffect, useState } from "react";
import "./styles/accounting-styling.css";
import NotifModal from "./components/modalNotif/NotifModal";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import Button from "./components/Button";

// Professional color palette
const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#6366f1",
];

const AccountingDashboard = () => {
  const [chartSeries, setChartSeries] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [summary, setSummary] = useState({
    debit: 0,
    credit: 0,
    payable: 0,
    receivable: 0,
    balance: 0,
  });
  const [data, setData] = useState([]);
  const [validation, setValidation] = useState({
    isOpen: false,
    type: "warning",
    title: "",
    message: "",
  });

  // API endpoint
  const API_URL =
    import.meta.env.VITE_API_URL ||
    "https://vyr3yqctq8.execute-api.ap-southeast-1.amazonaws.com/dev";
  const GENERAL_LEDGER_ENDPOINT = `${API_URL}/api/general-ledger-jel-view/`;
  const CHART_OF_ACCOUNTS_ENDPOINT = `${API_URL}/api/chart-of-accounts/`;

  const fetchData = async () => {
    try {
      // Fetch General Ledger data
      const glResponse = await axios.get(GENERAL_LEDGER_ENDPOINT);
      const glData = glResponse.data;

      const grouped = {};
      let totalDebit = 0;
      let totalCredit = 0;
      let accountsPayableTotal = 0;
      let accountsReceivableTotal = 0;

      glData.forEach((entry) => {
        const accountName = entry.account_name || "Unknown";
        const debit = parseFloat(entry.debit_amount || 0);
        const credit = parseFloat(entry.credit_amount || 0);

        // Grouping for bar chart
        if (!grouped[accountName]) {
          grouped[accountName] = { debit: 0, credit: 0 };
        }
        grouped[accountName].debit += debit;
        grouped[accountName].credit += credit;

        // Totals
        totalDebit += debit;
        totalCredit += credit;

        // Accounts Payable Summary
        if (
          accountName === "Accounts Payable" || accountName === "Cash in Bank"
        ) {
          accountsPayableTotal += debit; // Net Payable
        }

        // Accounts Receivable Summary
        if (
          accountName === "Accounts Receivable" || accountName === "Sales Revenue"
        ) {
          accountsReceivableTotal += credit; // Net Receivable
        }
      });

      // Set chart series
      const labels = Object.keys(grouped);
      const chartData = labels.map((label) => ({
        name: label,
        Debit: parseFloat(grouped[label].debit.toFixed(2)),
        Credit: parseFloat(grouped[label].credit.toFixed(2)),
      }));

      setChartSeries(chartData);
      setSummary({
        debit: totalDebit.toFixed(2),
        credit: totalCredit.toFixed(2),
        payable: accountsPayableTotal.toFixed(2),
        receivable: accountsReceivableTotal.toFixed(2),
        balance: (totalDebit - totalCredit).toFixed(2),
      });

      // Fetch Chart of Accounts data
      const coaResponse = await axios.get(CHART_OF_ACCOUNTS_ENDPOINT);
      const coaData = coaResponse.data;

      setData(
        coaData.map((acc, index) => ({
          id: index + 1,
          account_code: acc.account_code,
          account_name: acc.account_name,
          account_type: acc.account_type,
        }))
      );

      const typeCounts = {};
      coaData.forEach((acc) => {
        typeCounts[acc.account_type] = (typeCounts[acc.account_type] || 0) + 1;
      });

      const formattedPie = Object.entries(typeCounts).map(([label, value]) => ({
        name: label,
        value,
      }));

      setPieData(formattedPie);

    } catch (error) {
      console.error(
        "Error fetching data:",
        error.response ? error.response.data : error
      );
      setValidation({
        isOpen: true, // Ensure this is set to true
        type: "error",
        title: "Fetch Error",
        message: "Failed to load dashboard data. Please check your connection.",
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="accounting">
      <div className="body-content-container">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-6">
            <div className="flex gap-10 items-center justify-between max-sm:flex-col">
              <div>
                <h1 className="text-2xl font-bold text-gray-500">
                  Accounting Dashboard
                </h1>
                <p className="text-gray-500 mt-1">
                  Financial overview and analysis
                </p>
              </div>
              <div>
                <Button name="Refresh data" variant="standard2" onclick={fetchData} />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            
            <div className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-500 text-sm font-medium">
                  Total Debit
                </h3>
                <span className="p-2 bg-green-100 text-green-800 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                </span>
              </div>
              <p className="text-xl font-bold text-gray-900">
                {formatCurrency(summary.debit)}
              </p>
            </div>

            <div className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-500 text-sm font-medium">
                  Total Credit
                </h3>
                <span className="p-2 bg-red-100 text-red-800 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2V5h1v1H5zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zm2 2v-1h1v1H5zM13 3a1 1 0 00-1 1v3a1 1 0 001 1h3a1 1 0 001-1V4a1 1 0 00-1-1h-3zm1 2v1h1V5h-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </div>
              <p className="text-xl font-bold text-gray-900">
                {formatCurrency(summary.credit)}
              </p>
            </div>

            <div className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-500 text-sm font-medium">
                  Accounts Payable
                </h3>
                <span className="p-2 bg-orange-100 text-orange-800 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                    <path
                      fillRule="evenodd"
                      d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </div>
              <p className="text-xl font-bold text-gray-900">
                {formatCurrency(summary.payable)}
              </p>
            </div>

            <div className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-500 text-sm font-medium">
                  Accounts Receivable
                </h3>
                <span className="p-2 bg-blue-100 text-blue-800 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </div>
              <p className="text-xl font-bold text-gray-900">
                {formatCurrency(summary.receivable)}
              </p>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 max-sm:hidden">
            {/* Bar Chart */}
            <div className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition duration-300">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Debit and Credit by Account
              </h2>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart
                  data={chartSeries}
                  margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={70}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(value) => formatCurrency(value)}
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                    }}
                  />
                  <Legend wrapperStyle={{ paddingTop: 20 }} iconType="circle" />
                  <Bar dataKey="Debit" fill={COLORS[0]} radius={[4, 4, 0, 0]} />
                  <Bar
                    dataKey="Credit"
                    fill={COLORS[1]}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart */}
            <div className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition duration-300">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Chart of Accounts Distribution
              </h2>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    innerRadius={60}
                    fill="#8884d8"
                    paddingAngle={2}
                    label={({ name, percent }) =>
                      `${name} (${(percent * 100).toFixed(0)}%)`
                    }
                    labelLine={{
                      stroke: "#666",
                      strokeWidth: 1,
                      strokeDasharray: "2 2",
                    }}
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [`${value} accounts`, name]}
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Validation Modal */}
      {validation.isOpen && (
        <NotifModal
          isOpen={validation.isOpen}
          onClose={() => setValidation({ ...validation, isOpen: false })}
          type={validation.type}
          title={validation.title}
          message={validation.message}
        />
      )}
    </div>
  );
};

export default AccountingDashboard;
