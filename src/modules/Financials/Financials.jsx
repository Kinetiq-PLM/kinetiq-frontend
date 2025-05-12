import React, { useState, useEffect, use} from "react";
import { BarChart, Bar,XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from "recharts";
import "./styles/Financials.css";
import { GET } from "./api/api";
/* 
const data = [
    { name: "Asset", current: 500000, previous: 450000 },
    { name: "Liability", current: -50000, previous: -30000 },
    { name: "Equity", current: 200000, previous: 180000 },
    { name: "Revenue", current: 250000, previous: 230000 },
    { name: "Expense", current: -100000, previous: -120000 }
];


const data = 
*/

const InfoCard = ({ title, value, color, children, className }) => (
    <div className={`info-card ${className}`}>
        {title && <h2 className="info-title">{title}</h2>}
        {value && <p className={`info-value ${color}`}>{value}</p>}
        {children}
    </div>
);

const CashFlowCard = ({ data }) => {
  const inflowTotal = data.reduce((sum, item) => sum + item.inflow, 0);
  const outflowTotal = data.reduce((sum, item) => sum + item.outflow, 0);
  const netTotal = data.reduce((sum, item) => sum + (item.inflow - item.outflow), 0);

  const processedData = data.map((item) => ({
    month: item.month,
    inflow: item.inflow,
    outflow: item.outflow,
    net: item.inflow - item.outflow,
  }));

  const renderLegend = (props) => {
    const { payload } = props;
    return (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {payload.map((entry, index) => (
          <div key={`item-${index}`} style={{ display: 'flex', alignItems: 'center', marginRight: '35px' }}>
            <div style={{ width: '15px', height: '15px', backgroundColor: entry.color, marginRight: '6px', borderRadius: '3px' }}></div>
            <span style={{ fontSize: '15px' }}>{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };
 
  const [chartHeight, setChartHeight] = useState(400);
  const [chartMargin, setChartMargin] = useState({ top: 10, right: 50, left: 50, bottom: 60 });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setChartHeight(500);
        setChartMargin({ top: 10, right: 20, left: 20, bottom: 30 }); 
      } else {
        setChartHeight(400);
        setChartMargin({ top: 10, right: 50, left: 50, bottom: 45 }); 
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  

  return (
    <div className="cash-flow-card">
      <div className="cash-flow-container">
        
        <ResponsiveContainer width="100%" height={chartHeight}>
          <BarChart data={processedData} margin={chartMargin} barCategoryGap=".8%" barGap="1%">
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip
              labelFormatter={(label) => label}
              formatter={(value, name, entry) => {
                if (name === "inflow") {
                  return [entry.payload.inflow, "Inflow"];
                } else if (name === "outflow") {
                  return [entry.payload.outflow, "Outflow"];
                } else if (name === "net") {
                  return [entry.payload.net, "Net"];
                }
                return [value, name];
              }}
              wrapperStyle={{
                backgroundColor: '#88B4B4', 
                borderRadius: '10px', 
                padding: '5px',
              }}
              contentStyle={{
                fontSize: '14px',
                color: '#6C7676',
            }}
            />
            <Legend verticalAlign="top" align="center" wrapperStyle={{ top: 15, left: 40, padding: '20px' }} content={renderLegend} />
            <Bar dataKey="outflow" stackId="a" fill="#ACC3C3" name="Outflow" radius={[2, 2, 0, 0]} />
            <Bar dataKey="inflow" stackId="a" fill="#00A8A8" name="Inflow" radius={[2, 2, 0, 0]} />
            <Bar dataKey="net" stackId="a" fill="#C9E7E5" name="Net" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};


/*
const incomeStatementDataSummary = [
    {
      category: "Revenue", 
      items: [
        { name: "Net Sales", year1: 300000.00, year2: 150000.00, year3: 150000.00 }
      ],
    },
    {
      category: "Cost of Goods Sold",
      items: [
        { name: "Total Cost of Goods Sold", year1: 400000.00, year2: 250000.00, year3: 150000.00 },
        {name: "Gross Profit", year1: 400000.00, year2: 250000.00, year3: 150000.00 }
    ],
    },
    {
      category: "Operating Expenses",
      items: [
        { name: "Other Expenses", year1: 400000.00, year2: 250000.00, year3: 150000.00 },
        { name: "Total Operating Expenses", year1: 400000.00, year2: 250000.00, year3: 150000.00 },
      ],
    },
    {
      category: "Operating Profit (Loss)",
      items: [
        { name: "Add Other Income"},
        { name: "Interest Income", year1: 400000.00, year2: 250000.00, year3: 150000.00 },
        { name: "Other Income", year1: 400000.00, year2: 250000.00, year3: 150000.00 },
      ],
    },
    {
      category: "Profit (Loss) Before Taxes",
      items: [
        { name: "Less Tax Expense", year1: 400000.00, year2: 250000.00, year3: 150000.00 },
        { name: "Net Profit (Loss)", year1: 400000.00, year2: 250000.00, year3: 150000.00 }],
    },
  ];
*/

const incomeStatementCategories = {
  "Revenue": [
    "Sales Revenue", "Service Revenue"
  ],
  "Cost of Goods Sold": [
    "Raw Materials Used", "Direct Labor", "Factory Overhead",
    "Work-in-Process Adjustments", "Cost of Finished Goods Sold"
  ],
  "Operating Expenses": [
    "Salaries & Wages", "Office Supplies & Equipment", "Rent & Utilities",
    "Depreciation", "Software & IT Expenses", "Legal & Professional Fees",
    "Bonus Expense", "Marketing & Advertising", "Sales Commissions",
    "Shipping & Freight Costs", "Packaging Costs"
  ],
  "Other Income": [
    "Interest Income", "Gain on Sale of Assets", "Investment Income"
  ],
  "Other Expense": [
    "Interest Expense", "Exchange Rate Losses", "Penalties & Fines"
  ],
  "Contra-Revenue": [
    "Discounts Allowed", "Rework Cost", "Sales Return"
  ]
};

function groupIncomeStatement(entries, categoriesMap) {
  // Prepare result structure
  const result = {};
  Object.keys(categoriesMap).forEach(cat => {
    result[cat] = {};
    categoriesMap[cat].forEach(sub => {
      result[cat][sub] = 0;
    });
  });

  // Go through each entry and assign to category/subcategory
  entries.forEach(entry => {
    Object.entries(categoriesMap).forEach(([cat, subs]) => {
      subs.forEach(sub => {
        // Match by account_name (case-insensitive, partial match allowed)
        if (
          entry.account_name &&
          entry.account_name.toLowerCase().includes(sub.toLowerCase())
        ) {
          // For Revenue and Other Income, use credit - debit
          // For Expenses, COGS, Contra-Revenue, use debit - credit
          let value = 0;
          if (["Revenue", "Other Income"].includes(cat)) {
            value = parseFloat(entry.credit_amount) - parseFloat(entry.debit_amount);
          } else {
            value = parseFloat(entry.debit_amount) - parseFloat(entry.credit_amount);
          }
          result[cat][sub] += value;
        }
      });
    });
  });

  // Convert to array format for your table
  return Object.entries(result).map(([category, itemsObj]) => ({
    category,
    items: Object.entries(itemsObj).map(([name, value]) => ({
      name,
      value
    }))
  }));
}

const BodyContent = () => {
    

const [selectedOption, setSelectedOption] = useState("All time"); 
    const [budgetBalance, setBudgetBalance] = useState({
        totalBalance: "0.00",
        cents:".00",
        earnedLastMonth: "0.00",
        totalBonus: "0.00",
      });
    
    
    // Fetch allocation info from Approvals submodule
    useEffect(() => {
      const fetchAllocation = async () => {
          try {
              const data = await GET("/approvals/budget-allocation/");
              // Sum up all allocations
              const totals = data.reduce(
                  (acc, item) => {
                      acc.allocated += parseFloat(item.allocated_budget) || 0;
                      acc.spent += parseFloat(item.total_allocated_spent) || 0;
                      acc.remaining += parseFloat(item.allocated_remaining_budget) || 0;
                      return acc;
                  },
                  { allocated: 0, spent: 0, remaining: 0 }
              );
              setBudgetBalance({
                  totalBalance: totals.allocated.toLocaleString(undefined, { minimumFractionDigits: 2 }),
                  cents: "",
                  earnedLastMonth: totals.spent.toLocaleString(undefined, { minimumFractionDigits: 2 }),
                  totalBonus: totals.remaining.toLocaleString(undefined, { minimumFractionDigits: 2 }),
              });
              console.log("Allocation data:", data);
              console.log("Total allocation:", totals);
          } catch (error) {
              console.error("Error fetching allocation:", error);
          }
      };
      fetchAllocation();
  }, []);

  // Fetch cash flow data from API
  useEffect(() => {
    const fetchCashFlow = async () => {
        try {
            const data = await GET("/reports/monthly-cashflow/");
            const months = [
                "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
            ];
            // Normalize API data months for matching (UPPERCASE is safest)
            const normalizedData = data.map(item => ({
                ...item,
                month: item.month.trim().toUpperCase()
            }));
            const mapped = months.map(month => {
                const found = normalizedData.find(item => item.month === month.toUpperCase());
                return found
                    ? {
                        month, // always use "Jan", "Feb", etc. for chart
                        inflow: found.inflow,
                        outflow: found.outflow,
                        net: found.net,
                    }
                    : { month, inflow: 0, outflow: 0, net: 0 };
            });
            setCashFlowData(mapped);
            console.log("API data:", data);
            console.log("Mapped cash flow data:", mapped);
        } catch (error) {
            console.error("Error fetching cash flow data:", error);
        }
    };
    fetchCashFlow();
}, []);

useEffect(() => {
  const fetchPeriodBalance = async () => {
      try {
          const data = await GET("/reports/general-ledger/");
          // Assuming data.period_balance is an array with one object as shown
          const period = data.period_balance[0];
          const mapped = [
              { name: "Asset", current: period.asset.current_year, previous: period.asset.previous_year },
              { name: "Liability", current: period.liability.current_year, previous: period.liability.previous_year },
              { name: "Equity", current: period.equity.current_year, previous: period.equity.previous_year },
              { name: "Revenue", current: period.revenue.current_year, previous: period.revenue.previous_year },
              { name: "Expense", current: period.expense.current_year, previous: period.expense.previous_year },
          ];
          setPeriodBalance(mapped);
          console.log("Mapped period balance:", mapped);
      } catch (error) {
          console.error("Error fetching period balance:", error);
      }
  };
  fetchPeriodBalance();
}, []);

useEffect(() => {
  const fetchIncomeStatement = async () => {
    try {
      const [current, last, last2] = await Promise.all([
        GET("/reports/general-ledger/?period=current_year"),
        GET("/reports/general-ledger/?period=last_year"),
        GET("/reports/general-ledger/?period=last_2_years"),
      ]);
      const currentSummary = groupIncomeStatement(current.general_ledger || [], incomeStatementCategories);
      const lastSummary = groupIncomeStatement(last.general_ledger || [], incomeStatementCategories);
      const last2Summary = groupIncomeStatement(last2.general_ledger || [], incomeStatementCategories);

      // Merge by category and subcategory
      const allCats = Object.keys(incomeStatementCategories);
      const merged = allCats.map(cat => {
        // Get all subcategories for this category
        const subs = incomeStatementCategories[cat];
        return {
          category: cat,
          items: subs.map(sub => ({
            name: sub,
            year1: (currentSummary.find(c => c.category === cat)?.items.find(i => i.name === sub)?.value) || 0,
            year2: (lastSummary.find(c => c.category === cat)?.items.find(i => i.name === sub)?.value) || 0,
            year3: (last2Summary.find(c => c.category === cat)?.items.find(i => i.name === sub)?.value) || 0,
          }))
        };
      });

      setIncomeStatementDataSummary(merged);
      console.log("Current Income Statement Summary:", currentSummary);
      console.log("Last Year Income Statement Summary:", lastSummary);
      console.log("Last 2 Years Income Statement Summary:", last2Summary);
      console.log("Income Statement Categories:", incomeStatementCategories);
      console.log("Income Statement Summary:", merged);
    } catch (error) {
      console.error("Error fetching income statement:", error);
    }
  };
  fetchIncomeStatement();
}, []);

      /*const handleChange = (event) => {
        const newOption = event.target.value;
        setSelectedOption(newOption);
    
        if (newOption === "Last Month") {
          setBudgetBalance({
            totalBalance: "123,456.00", 
            earnedLastMonth: "45,678.00",
            totalBonus: "1,234.00",
          });
        } else if (newOption === "Last 3 Mos") {
          setBudgetBalance({
            totalBalance: "345,678.00", 
            earnedLastMonth: "111,222.00",
            totalBonus: "3,456.00",
          });
        } else if (newOption === "Last Year") {
          setBudgetBalance({
            totalBalance: "987,654.00", 
            earnedLastMonth: "333,444.00",
            totalBonus: "9,012.00",
          });
        } else {
          setBudgetBalance({
            totalBalance: "278,992.00",
            earnedLastMonth: "93,116.00",
            totalBonus: "5,402.00",
          });
        }
      };*/

    const [totalApprovedBudget, setTotalApprovedBudget] = useState(0);
    const [cashFlowData, setCashFlowData] = useState([]);
    const [periodBalance, setPeriodBalance] = useState([]);
    const [incomeStatementDataSummary, setIncomeStatementDataSummary] = useState([]);


     
    return (
        <div className="finance">
            <div className="body-content-container">
            <div className="content-grid">
            <div className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-6">
            <div className="flex gap-10 items-center justify-between max-sm:flex-col">
              <div>
                <h1 className="text-2xl font-bold text-gray-500">
                  Financials Dashboard
                </h1>
                <p className="text-gray-500 mt-1">
                  Financial projections and summaries
                </p>
              </div>
            </div>
          </div>
        </div>
                        <div className="all-reports-1">
                            <InfoCard className="budget-balance-card">
                                <div className="budget-balance-header">
                                        
                                    <span className="budget-balance-title">Budget Allocation</span>
                                    
                                </div>
                                    <div className="budget-balance-content">
                                        
                                        <div className="total-balance">
                                            <span className="total-balance-label">Total Budget</span>
                                        </div>
                                        <div  className="total-balance-amount">₱{budgetBalance.totalBalance}
                                            <span className="cents">{budgetBalance.cents}</span>
                                        </div>
                                        <div className="earned-last-month">
                                            <span className="earned-last-month-label">Total Spent</span>
                                            <span className="earned-last-month-amount">+₱{budgetBalance.earnedLastMonth}</span>
                                        </div>
                                        <div className="total-bonus">
                                            <span className="total-bonus-label">Remaining Budget</span>
                                            <span className="total-bonus-amount">+₱{budgetBalance.totalBonus}</span>
                                        </div>
                                    </div>
                            </InfoCard>
                        </div>
                        <div className="all-reports-2">
                            <InfoCard className="infocard-cash-flow">
                                <CashFlowCard data={cashFlowData} />
                            </InfoCard>
                        </div>
                        <div className="all-reports-3">
                        <InfoCard className="chart-container">
                            <h2 className="chart-title">Current Period Balance And Previous Period Balance</h2>
                            <ResponsiveContainer width="100%" height="75%">
                                <BarChart data={periodBalance} margin={{ top: 10, right: 20, left: 15, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="currentBarGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#00A8A8" stopOpacity={100} />
                                            <stop offset="100%" stopColor="#C9E7E5" stopOpacity={100} />
                                        </linearGradient>
                                        <linearGradient id="previousBarGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#C9E7E5" stopOpacity={100} />
                                            <stop offset="100%" stopColor="#F7FFFE" stopOpacity={100} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="0" vertical={false} stroke="#00A8A8" strokeWidth={1}/> 
                                    <XAxis dataKey="name" tick={{ fill: "#4A4A4A" }} />
                                    <YAxis
                                        tickCount={8} 
                                        tick={{ fill: "#4A4A4A" }}
                                        tickFormatter={(value) => `₱${value.toLocaleString()}`}
                                        width={90}
                                    />
                                    <Legend
                                        verticalAlign="top"
                                        align="center"
                                        wrapperStyle={{ paddingBottom: 40 }}
                                    />
                                    <Tooltip 
                                        wrapperStyle={{
                                            backgroundColor: '#88B4B4', 
                                            borderRadius: '10px', 
                                            padding: '5px',
                                        }}
                                        contentStyle={{
                                            fontSize: '14px',
                                            color: '#6C7676',
                                        }}
                                    />
                                    <Bar dataKey="current" fill="url(#currentBarGradient)" name="Current Period Balance" radius={[3, 3, 0, 0]} />
                                    <Bar dataKey="previous" fill="url(#previousBarGradient)" name="Previous Period Balance" radius={[3, 3, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                            </InfoCard>
                        </div>
                        <div className="all-reports-4">
                            <InfoCard className="info-card-income-statement">
                                <table className="income-statement-table">
                                    <thead>
                                        <tr>
                                            <th>Income Statement</th>
                                            <th>Current Year</th>
                                            <th>Last Year</th>
                                            <th>Last 2 Years</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.keys(incomeStatementCategories).map((cat, catIdx) => (
                                            <React.Fragment key={catIdx}>
                                                <tr>
                                                    <th colSpan={4}>{cat}</th>
                                                </tr>
                                                {incomeStatementDataSummary
                                                    .find((category) => category.category === cat)
                                                    ?.items.map((item, itemIndex) => (
                                                        <tr key={itemIndex}>
                                                            <td>{item.name}</td>
                                                            <td>
                                                                {item.year1 !== undefined
                                                                    ? item.year1.toLocaleString(undefined, { minimumFractionDigits: 2 })
                                                                    : "0.00"}
                                                            </td>
                                                            <td>
                                                                {item.year2 !== undefined
                                                                    ? item.year2.toLocaleString(undefined, { minimumFractionDigits: 2 })
                                                                    : "0.00"}
                                                            </td>
                                                            <td>
                                                                {item.year3 !== undefined
                                                                    ? item.year3.toLocaleString(undefined, { minimumFractionDigits: 2 })
                                                                    : "0.00"}
                                                            </td>
                                                        </tr>
                                                    ))}
                                            </React.Fragment>
                                        ))}
                                    </tbody>
                                </table>
                            </InfoCard>
                        </div>
                        </div>
                        </div>
        </div>
    );
};

export default BodyContent;
