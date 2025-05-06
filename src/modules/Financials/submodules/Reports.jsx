import React, { useState, useEffect, useMemo } from "react";
import { BarChart, Bar,XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Pie, PieChart, Cell, LabelList} from "recharts";
import "../styles/Reports.css";
import { GET } from "../api/api.jsx";

const data = [
    { name: "Asset", current: 500000, previous: 450000 },
    { name: "Liability", current: -50000, previous: -30000 },
    { name: "Equity", current: 200000, previous: 180000 },
    { name: "Revenue", current: 250000, previous: 230000 },
    { name: "Expense", current: -100000, previous: -120000 }
];

const tabs = ["Cash Flow", "Trial Balance", "Income Statement"];

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

  const [chartHeight, setChartHeight] = useState(600);
  const [chartMargin, setChartMargin] = useState({ top: 50, right: 50, left: 50, bottom: 45 });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setChartHeight(300);
        setChartMargin({ top: 30, right: 20, left: 20, bottom: 10}); 
      } else {
        setChartHeight(600);
        setChartMargin({ top: 50, right: 50, left: 50, bottom: 45 }); 
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
                backgroundColor: '#00A8A8', 
                borderRadius: '10px', 
                padding: '5px', 
              }}
              contentStyle={{
                fontSize: '13px',
                color: '#6C7676',
            }}
            />
            <Legend verticalAlign="top" align="center" wrapperStyle={{ top: 15, left: 65, padding: '20px' }} content={renderLegend} />
            <Bar dataKey="outflow" stackId="a" fill="#ACC3C3" name="Outflow" radius={[2, 2, 0, 0]} />
            <Bar dataKey="inflow" stackId="a" fill="#00A8A8" name="Inflow" radius={[2, 2, 0, 0]} />
            <Bar dataKey="net" stackId="a" fill="#C9E7E5" name="Net" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="summary-numbers" style={{ position: 'relative', display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ position: 'absolute', top: '-15px', left: '10px', width: 'calc(100% - 20px)', height: '2px', backgroundColor: '#00A8A8' }}></div>
        <div className="summary-item" style={{ position: 'relative' }}>
          <div className="summary-label">INFLOW</div>
          <div className="summary-value">₱{inflowTotal.toLocaleString()}</div>
          <div style={{ position: 'absolute', right: '-10px', top: '50%', transform: 'translateY(-50%)', width: '1px', height: '50px', backgroundColor: '#00A8A8' }}></div>
        </div>
        <div className="summary-item" style={{ position: 'relative' }}>
          <div className="summary-label">OUTFLOW</div>
          <div className="summary-value">-₱{outflowTotal.toLocaleString()}</div>
          <div style={{ position: 'absolute', right: '-10px', top: '50%', transform: 'translateY(-50%)', width: '1px', height: '50px', backgroundColor: '#00A8A8' }}></div>
        </div>
        <div className="summary-item">
          <div className="summary-label">NET</div>
          <div className="summary-value">₱{netTotal.toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
};
  
  
const InvoiceCollections = () => {
    const [collectedAmount, setCollectedAmount] = useState(0);
    const [openInvoicesAmount, setOpenInvoicesAmount] = useState(0);
    const [overdueAmount, setOverdueAmount] = useState(0);

    useEffect(() => {
        const fetchInvoiceCollections = async () => {
            try {
                const data = await GET("/reports/receivable-aging/");
                const today = new Date();

                let collected = 0;
                let open = 0;
                let overdue = 0;

                data.forEach(entry => {
                    // Collected: sum of settled_amount
                    collected += parseFloat(entry.settled_amount) || 0;

                    // Open: sum of remaining_amount where remaining_amount > 0
                    if ((parseFloat(entry.remaining_amount) || 0) > 0) {
                        open += parseFloat(entry.remaining_amount) || 0;

                        // Overdue: if or_date is before today and remaining_amount > 0
                        const dueDate = new Date(entry.or_date);
                        if (dueDate < today) {
                            overdue += parseFloat(entry.remaining_amount) || 0;
                        }
                    }
                });

                setCollectedAmount(collected);
                setOpenInvoicesAmount(open);
                setOverdueAmount(overdue);
            } catch (error) {
                console.error("Error fetching invoice collections:", error);
            }
        };
        fetchInvoiceCollections();
    }, []);

    const totalAmount = Math.abs(collectedAmount) + Math.abs(openInvoicesAmount) + Math.abs(overdueAmount);

    const collectedWidth = totalAmount ? (Math.abs(collectedAmount) / totalAmount) * 100 + '%' : '0%';
    const openInvoicesWidth = totalAmount ? (Math.abs(openInvoicesAmount) / totalAmount) * 100 + '%' : '0%';
    const overdueWidth = totalAmount ? (Math.abs(overdueAmount) / totalAmount) * 100 + '%' : '0%';
    
    const renderInvoiceCollections = () => {
        return (
            <InfoCard className="invoice-collections-card">
            <h2 className="invoice-collections-title">Invoice & Collections</h2>
            <div className="invoice-collections-bar">
                <div className="bar-section collected" style={{ width: collectedWidth }}>
                    <span className="amount">₱{collectedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="bar-section open-invoices" style={{ width: openInvoicesWidth }}>
                    <span className="amount">₱{openInvoicesAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="bar-section overdue" style={{ width: overdueWidth }}>
                    <span className="amount">₱{overdueAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
            </div>
            <div className="label-group">
                <span className="label" style={{ width: collectedWidth }}>COLLECTED</span>
                <span className="label" style={{ width: openInvoicesWidth }}>OPEN INVOICES</span>
                <span className="label" style={{ width: overdueWidth }}>OVERDUE</span>
            </div>
        </InfoCard>
    );
};

    return renderInvoiceCollections();
};

    const categories = [
        { name: 'Cost of Goods Sold (COGS)', amount: 11111, color: '#00A8A8' },
        { name: 'Operating Expenses', amount: 60040, color: '#469FC2' },
        { name: 'Other Expenses', amount: 40530, color: '#dad891' },
        { name: 'Contra-Revenue', amount: 20416, color: '#da9191' },
    ];
    

    const calculatePercentages = (categories) => {
        if (!categories || categories.length === 0) {
            return [];
        }
        const totalAmount = categories.reduce((sum, category) => sum + category.amount, 0);
        return categories.map((category) => ({
            ...category,
            percentage: (category.amount / totalAmount) * 100,
            formattedAmount: `P${category.amount.toLocaleString()}`,
        }));
    };

    const pieData = calculatePercentages(categories);

    

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
        const result = {};
        Object.keys(categoriesMap).forEach(cat => {
          result[cat] = {};
          categoriesMap[cat].forEach(sub => {
            result[cat][sub] = 0;
          });
        });
      
        entries.forEach(entry => {
          Object.entries(categoriesMap).forEach(([cat, subs]) => {
            subs.forEach(sub => {
              if (
                entry.account_name &&
                entry.account_name.toLowerCase().includes(sub.toLowerCase())
              ) {
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
      
        return Object.entries(result).map(([category, itemsObj]) => ({
          category,
          items: Object.entries(itemsObj).map(([name, value]) => ({
            name,
            value
          }))
        }));
      }
      

const incomeStatementData = [
        {
          category: "Revenue", 
          items: [
            { name: "Sales", year1: 500000.00, year2: 100000.00, year3: 400000.00 },
            { name: "Less Sales Return", year1: 400000.00, year2: 200000.00, year3: 200000.00 },
            { name: "Less Discounts and Allowances", year1: 200000.00, year2: 50000.00, year3: 150000.00,},
            { name: "Net Sales", year1: 300000.00, year2: 150000.00, year3: 150000.00 }
          ],
        },
        {
          category: "Cost of Goods Sold",
          items: [
            { name: "Materials", year1: 200000.00, year2: 50000.00, year3: 150000.00 },
            { name: "Labor", year1: 400000.00, year2: 250000.00, year3: 150000.00 },
            { name: "Overhead", year1: 200000.00, year2: 50000.00, year3: 150000.00 },
            { name: "Total Cost of Goods Sold", year1: 400000.00, year2: 250000.00, year3: 150000.00 },
            {name: "Gross Profit", year1: 400000.00, year2: 250000.00, year3: 150000.00 }
        ],
        },
        {
          category: "Operating Expenses",
          items: [
            { name: "Wages", year1: 400000.00, year2: 250000.00, year3: 150000.00 },
            { name: "Advertising", year1: 400000.00, year2: 250000.00, year3: 150000.00 },
            { name: "Repairs & Maintenance", year1: 400000.00, year2: 250000.00, year3: 150000.00 },
            { name: "Travel", year1: 400000.00, year2: 250000.00, year3: 150000.00 },
            { name: "Rent/Lease", year1: 400000.00, year2: 250000.00, year3: 150000.00 },
            { name: "Delivery/Freight Expense", year1: 400000.00, year2: 250000.00, year3: 150000.00 },
            { name: "Insurance", year1: 400000.00, year2: 250000.00, year3: 150000.00 },
            { name: "Mileage", year1: 400000.00, year2: 250000.00, year3: 150000.00 },
            { name: "Office Supplies", year1: 400000.00, year2: 250000.00, year3: 150000.00 },
            { name: "Depreciation", year1: 400000.00, year2: 250000.00, year3: 150000.00 },
            { name: "Interest", year1: 400000.00, year2: 250000.00, year3: 150000.00 },
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

      const getAgingBucket = (days) => {
        if (days <= 30) return '0 - 30';
        if (days <= 60) return '31 - 60';
        if (days <= 90) return '61 - 90';
        return '91+';
      };
    
        


      
const BodyContent = () => {
    const [activeTab, setActiveTab] = useState(tabs[0]);
    const [isCompact, setIsCompact] = useState(window.innerWidth < 768);

    const [incomeStatementDataSummary, setIncomeStatementDataSummary] = useState([]);    
    const [cashFlowData, setCashFlowData] = useState([]);
    const [periodBalance, setPeriodBalance] = useState([]);
    const [expenseOverviewData, setExpenseOverviewData] = useState([]);
    const [pieChartData, setPieChartData] = useState([
        { name: "Previous", value: 0, color: "#F4E1AE" },
        { name: "Current", value: 0, color: "#00A8A8" },
      ]);
      const [pieChartPercentages, setPieChartPercentages] = useState({ previous: 0, current: 0 });


    useEffect(() => {
        const handleResize = () => {
            setIsCompact(window.innerWidth < 768);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handlePageChange = (direction) => {
        const currentIndex = tabs.indexOf(activeTab);
        if (direction === "next" && currentIndex < tabs.length - 1) {
            setActiveTab(tabs[currentIndex + 1]);
        } else if (direction === "prev" && currentIndex > 0) {
            setActiveTab(tabs[currentIndex - 1]);
        }
    };

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
        const fetchExpenseOverview = async () => {
            try {
                const data = await GET("/reports/general-ledger/");
                const typeSummary = Array.isArray(data.type_summary) ? data.type_summary : [];
    
                // Define which account types to include and their display names/colors
                const expenseTypes = [
                    { key: "Cost of Goods Sold", name: "Cost of Goods Sold (COGS)", color: "#00A8A8" },
                    { key: "Operating Expense", name: "Operating Expenses", color: "#469FC2" },
                    { key: "Other Expense", name: "Other Expenses", color: "#dad891" },
                    { key: "Contra-Revenue", name: "Contra-Revenue", color: "#da9191" }
                ];
    
                // Map and sum the amounts
                const categories = expenseTypes.map(type => {
                    const found = typeSummary.find(item => item.account_type === type.key);
                    // For expenses, use total_debit; for Contra-Revenue, also use total_debit
                    const amount = found ? (parseFloat(found.total_debit) || 0) : 0;
                    return {
                        name: type.name,
                        amount,
                        color: type.color
                    };
                });
    
                // Calculate percentages and formatted amounts
                const totalAmount = categories.reduce((sum, cat) => sum + cat.amount, 0);
                const expenseOverviewData = categories.map(cat => ({
                    ...cat,
                    percentage: totalAmount ? (cat.amount / totalAmount) * 100 : 0,
                    formattedAmount: `₱${cat.amount.toLocaleString()}`
                }));
    
                setExpenseOverviewData(expenseOverviewData);
                console.log("Expense Overview Data:", expenseOverviewData);
                console.log("Type Summary:", typeSummary);
            } catch (error) {
                console.error("Error fetching expense overview:", error);
            }
        };
        fetchExpenseOverview();
    }, []);

    useEffect(() => {
        const fetchReceivableAging = async () => {
            try {
                const data = await GET("/reports/receivable-aging/");
                const today = new Date();
                const buckets = {
                    '0 - 30': 0,
                    '31 - 60': 0,
                    '61 - 90': 0,
                    '91+': 0,
                };
    
                data.forEach(entry => {
                    // Use amount_due and skip if invalid or in the future
                    if (!entry.amount_due || entry.amount_due <= 0) return;
                
                    const dueDate = new Date(entry.or_date);
                    if (dueDate > today) return; // <-- this line prevents future dates
                
                    const diffTime = today - dueDate;
                    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                
                    let bucket = '';
                    if (diffDays <= 30) bucket = '0 - 30';
                    else if (diffDays <= 60) bucket = '31 - 60';
                    else if (diffDays <= 90) bucket = '61 - 90';
                    else bucket = '91+';
                
                    buckets[bucket] += entry.amount_due;
                });
                setReceivableAgingData([
                    { name: '0 - 30', amount: buckets['0 - 30'] },
                    { name: '31 - 60', amount: buckets['31 - 60'] },
                    { name: '61 - 90', amount: buckets['61 - 90'] },
                    { name: '91+', amount: buckets['91+'] },
                ]);

                console.log("Receivable Aging Data:", data);
                //view the data per each bucket
                console.log("Receivable Aging Buckets:", buckets);
            } catch (error) {
                console.error("Error fetching receivable aging:", error);
            }
        };
        fetchReceivableAging();
    }, []);

     useEffect(() => {
        const fetchPeriodBalance = async () => {
            try {
                const data = await GET("/reports/general-ledger/");
                const period = data.period_balance?.[0] || {};
                const mapped = [
                    { name: "Asset", current: period.asset?.current_year || 0, previous: period.asset?.previous_year || 0 },
                    { name: "Liability", current: period.liability?.current_year || 0, previous: period.liability?.previous_year || 0 },
                    { name: "Equity", current: period.equity?.current_year || 0, previous: period.equity?.previous_year || 0 },
                    { name: "Revenue", current: period.revenue?.current_year || 0, previous: period.revenue?.previous_year || 0 },
                    { name: "Expense", current: period.expense?.current_year || 0, previous: period.expense?.previous_year || 0 }
                ];
                
                setPeriodBalance(mapped);
                console.log("Period Balance Data:", mapped);
            } catch (error) {
                console.error("Error fetching period balance:", error);
            }
        };
        fetchPeriodBalance();
    }, []);

    useEffect(() => {
        const fetchPieChartData = async () => {
          try {
            const data = await GET("/reports/period-balance/");
            const period = data.general_ledger?.[0] || {};
            const totalCurrent =
              (period.asset?.current_year || 0) +
              (period.liability?.current_year || 0) +
              (period.equity?.current_year || 0) +
              (period.revenue?.current_year || 0) +
              (period.expense?.current_year || 0);
            const totalPrevious =
              (period.asset?.previous_year || 0) +
              (period.liability?.previous_year || 0) +
              (period.equity?.previous_year || 0) +
              (period.revenue?.previous_year || 0) +
              (period.expense?.previous_year || 0);
      
            setPieChartData([
              { name: "Previous", value: totalPrevious, color: "#F4E1AE" },
              { name: "Current", value: totalCurrent, color: "#00A8A8" },
            ]);
            const total = Math.abs(totalCurrent) + Math.abs(totalPrevious);
            setPieChartPercentages({
              previous: total ? (Math.abs(totalPrevious) / total) * 100 : 0,
              current: total ? (Math.abs(totalCurrent) / total) * 100 : 0,
            });
            console.log("Pie chart data:", { totalCurrent, totalPrevious });
          } catch (error) {
            console.error("Error fetching pie chart period balance:", error);
          }
        };
        fetchPieChartData();
      }, []);

      const [periodSummary, setPeriodSummary] = useState({
        totalCurrent: 0,
        totalPrevious: 0,
        rows: []
      });
    
    useEffect(() => {
      const fetchPeriodSummary = async () => {
        try {
          const data = await GET("/reports/period-balance/");
          const period = data.general_ledger?.[0] || {};
          const rows = [
            {
              label: "Asset",
              current: period.asset?.current_year || 0,
              previous: period.asset?.previous_year || 0,
            },
            {
              label: "Liability",
              current: period.liability?.current_year || 0,
              previous: period.liability?.previous_year || 0,
            },
            {
              label: "Equity",
              current: period.equity?.current_year || 0,
              previous: period.equity?.previous_year || 0,
            },
            {
              label: "Revenue",
              current: period.revenue?.current_year || 0,
              previous: period.revenue?.previous_year || 0,
            },
            {
              label: "Expense",
              current: period.expense?.current_year || 0,
              previous: period.expense?.previous_year || 0,
            },
          ];
          const totalCurrent = rows.reduce((sum, r) => sum + (r.current || 0), 0);
          const totalPrevious = rows.reduce((sum, r) => sum + (r.previous || 0), 0);
          setPeriodSummary({ totalCurrent, totalPrevious, rows });
          console.log("Period Summary Data:", { totalCurrent, totalPrevious, rows });
          console.log("Total Current:", totalCurrent, "Total Previous:", totalPrevious);
        } catch (error) {
          console.error("Error fetching period summary:", error);
        }
      };
      fetchPeriodSummary();
    }, []);

    /*
    const trialBalanceData = [
        { AccountNo: 1, AccountName: "Marketing", Type: "Expense", CurrentPeriodBalance: 500000.00, PreviousPeriodBalance: 400000.00 },
        { AccountNo: 2, AccountName: "Operations", Type: "Expense", CurrentPeriodBalance: 400000.00, PreviousPeriodBalance: 200000.00 },
        { AccountNo: 3, AccountName: "IT Department", Type: "Expense", CurrentPeriodBalance: 200000.00, PreviousPeriodBalance: 50000.00 },
        { AccountNo: 4, AccountName: "Accounting", Type: "Expense", CurrentPeriodBalance: 300000.00, PreviousPeriodBalance: 150000.00 },
        { AccountNo: 5, AccountName: "Purchasing", Type: "Expense", CurrentPeriodBalance: 200000.00, PreviousPeriodBalance: 50000.00 },
        { AccountNo: 6, AccountName: "Support & Services", Type: "Expense", CurrentPeriodBalance: 400000.00, PreviousPeriodBalance: 250000.00 },
        { AccountNo: 7, AccountName: "Production", Type: "Expense", CurrentPeriodBalance: 200000.00, PreviousPeriodBalance: 50000.00 },
        { AccountNo: 8, AccountName: "MRP", Type: "Expense", CurrentPeriodBalance: 400000.00, PreviousPeriodBalance: 250000.00 },
        { AccountNo: 9, AccountName: "Inventory", Type: "Expense", CurrentPeriodBalance: 400000.00, PreviousPeriodBalance: 250000.00 },
        { AccountNo: 10, AccountName: "Project Management", Type: "Expense", CurrentPeriodBalance: 400000.00, PreviousPeriodBalance: 250000.00 },
        { AccountNo: 11, AccountName: "Human Resources", Type: "Expense", CurrentPeriodBalance: 400000.00, PreviousPeriodBalance: 250000.00 },
    ];
    */
    const [trialBalanceData, setTrialBalanceData] = useState([]);

    useEffect(() => {
        const fetchTrialBalanceData = async () => {
          try {
            const data = await GET("/reports/general-ledger/");
            const ledger = Array.isArray(data.general_ledger) ? data.general_ledger : [];
      
            const accountMap = new Map();
      
            ledger.forEach((entry) => {
              const key = `${entry.account_name}|${entry.account_type}`;
              if (!accountMap.has(key)) {
                accountMap.set(key, {
                  AccountNo: accountMap.size + 1,
                  AccountName: entry.account_name,
                  Type: entry.account_type,
                  CurrentPeriodBalance: 0,
                  PreviousPeriodBalance: 0,
                });
              }
              // balance = debit - credit
              const row = accountMap.get(key);
              row.CurrentPeriodBalance += (parseFloat(entry.debit_amount) || 0) - (parseFloat(entry.credit_amount) || 0);
              row.PreviousPeriodBalance += (parseFloat(entry.previous_debit_amount) || 0) - (parseFloat(entry.previous_credit_amount) || 0); // Added logic for PreviousPeriodBalance
            });
      
            setTrialBalanceData(Array.from(accountMap.values()));
            console.log("Trial Balance Data:", Array.from(accountMap.values()));
          } catch (error) {
            console.error("Error fetching trial balance data:", error);
          }
        };
        fetchTrialBalanceData();
      }, []);

    
    const [receivableAgingData, setReceivableAgingData] = useState([
        { name: '0 - 30', amount: 0 },
        { name: '31 - 60', amount: 0 },
        { name: '61 - 90', amount: 0 },
        { name: '91+', amount: 0 },
      ]);
    
    
      


// --- Fetch Income Statement Data ---
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

        const allCats = Object.keys(incomeStatementCategories);
        const merged = allCats.map(cat => {
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
      } catch (error) {
        console.error("Error fetching income statement:", error);
      }
    };
    fetchIncomeStatement();
  }, []);




    
    return (
        <div className="reports">
            <div className="body-content-container">
                <div className="tabs">
                    {isCompact ? (
                        <div className="compact-tabs">
                            <button className="tab-button active">{activeTab}</button>
                            <button onClick={() => handlePageChange("prev")} className="nav-button" disabled={activeTab === tabs[0]}>&#60;</button>
                            <button onClick={() => handlePageChange("next")} className="nav-button" disabled={activeTab === tabs[tabs.length - 1]}>&#62;</button>
                        </div>
                                ) : (
                        <div className="full-tabs">
                            {tabs.map(tab => (
                                <button key={tab} className={`tab-button ${activeTab === tab ? "active" : ""}`} onClick={() => setActiveTab(tab)}>
                                    {tab}
                                </button>
                            ))}
                            <button className="nav-button" onClick={() => handlePageChange("prev")}>&#60;</button>
                            {[1, 2, 3].map((num, index) => (
                                <button key={num} className={`page-button ${activeTab === tabs[index] ? "active" : ""}`} onClick={() => setActiveTab(tabs[index])}>
                                    {num}
                                </button>
                            ))}
                            <button className="nav-button" onClick={() => handlePageChange("next")}>&#62;</button>
                        </div>
                    )}
                </div>
                
                {activeTab === 'Cash Flow' && (
                    <div className="content-grid">
                                <CashFlowCard data={cashFlowData} />
                         
                            
                        
                        
                                <InvoiceCollections />
                            
                            <InfoCard className="receivable-aging-card">
                                <div className="receivable-aging-chart">
                                    <div className="title-container"> 
                                        <h2 className="receivable-aging-title">Receivable Aging</h2>
                                    </div>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={receivableAgingData} layout="vertical" margin={{ top: 15, right: 30, left: 50, bottom: 5 }}>
                                            <XAxis type="number" tick={false} axisLine={false} />
                                            <YAxis
                                                type="category"
                                                dataKey="name" 
                                                tick={(props) => {
                                                    const { x, y, payload } = props;
                                                    return (
                                                        <g transform={`translate(${x},${y})`}>
                                                            <text
                                                                x={-15}
                                                                y={0}
                                                                dy={5}
                                                                textAnchor="end"
                                                                className="custom-y-axis-label"
                                                            >
                                                                {payload.value}
                                                            </text>
                                                        </g>
                                                    );
                                                }}
                                            />
                                            <Bar
                                                dataKey="amount"
                                                fill="#00A8A8"
                                                label={({ value, x, y, width, height }) => (
                                                    <text
                                                        x={x + width - 5}
                                                        y={y + height / 2}
                                                        fill="white"
                                                        textAnchor="end"
                                                        dominantBaseline="middle"
                                                        fontWeight="600" 
                                                        fontStyle="italic" 
                                                    >
                                                        ₱{value.toFixed(2).toLocaleString()}
                                                    </text>
                                                )}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                    <div className="total-receivable">
                                        TOTAL RECEIVABLE: <span className="receivable-amount">₱{receivableAgingData.reduce((sum, item) => sum + item.amount, 0).toFixed(2).toLocaleString()}</span>
                                    </div>
                                </div>
                            </InfoCard>

                            <InfoCard className="expense-overview-card">
                                <h2 className="expense-overview-title">Expense Overview</h2>
                                <div className="expense-overview-content">
                                    <div className="expense-overview-chart">
                                        <ResponsiveContainer width="100%" height={400}>
                                            <PieChart>
                                            {pieData.length > 0 && (
                                                <Pie
                                                    data={expenseOverviewData}
                                                    dataKey="percentage"
                                                    nameKey="name"
                                                        cx="50%"
                                                        cy="50%"
                                                        outerRadius={160}
                                                        innerRadius={70}
                                                        fill="#8884d8"
                                                    >
                                                        <LabelList dataKey="percentage" position="inside" formatter={value => `${Math.round(value)}%`} />
                                                        {expenseOverviewData.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                                        ))}
                                                    </Pie>
                                                )}
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="expense-overview-categories">
                                        <h3 className="categories-title">TOP CATEGORIES</h3>
                                        <hr className="categories-divider" />
                                        <div className="category-list">
                                            {expenseOverviewData.map((category, index) => (
                                                <div key={index} className="category-item">
                                                    <div className="category-icon" style={{ backgroundColor: category.color }}></div>
                                                    <div className="category-details">
                                                        <span className="category-name">{`${category.name} / `}</span>
                                                        <span className="category-amount">{category.formattedAmount}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="categories-vertical-line"></div>
                                    </div>
                                </div>
                            </InfoCard>
                    </div>
                )}

{activeTab === "Trial Balance" && (
  <div className="content-grid">
    <div className="chart-container">
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
    </div>
                                                <InfoCard className="info-card-2">
                          <div className="pie-chart-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <ResponsiveContainer className="pie" width="100%" height={150}>
                              <PieChart>
                                <Pie
                                  ie
                                  data={pieChartData.map(d => ({ ...d, value: Math.abs(d.value) }))}
                                  dataKey="value"
                                  nameKey="name"
                                  cx="50%"
                                  cy="60%"
                                  outerRadius={55}
                                  innerRadius={0}
                                  startAngle={90}
                                  endAngle={-270}
                                  labelLine={false}
                                >
                                  <Cell key="previous" fill="#F4E1AE" />
                                  <Cell key="current" fill="#A0D3E8"/>
                                </Pie>
                              </PieChart>
                            </ResponsiveContainer>
                            <div className="pie-chart-labels" style={{ fontWeight: 'bold', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', marginTop: '-100px' }}>
                              <div style={{ textAlign: 'left', paddingLeft: '20px', position: 'relative' }}>
                                <div style={{ fontWeight: 'bold', position: 'absolute', top: '60%', transform: 'translateY(-60%)', right: '45px', width: '110px', height: '1px', backgroundColor: 'black' }}></div>
                                Previous Period Balance
                                <div style={{ color:'#C5C8C8', textAlign: 'left', marginTop: '10px' }}>
                                  {pieChartPercentages.previous.toFixed(1)}%
                                </div>
                              </div>
                              <div style={{ textAlign: 'right', paddingRight: '20px', position: 'relative' }}>
                                Current Period Balance
                                <div style={{ fontWeight: 'bold', position: 'absolute', top: '60%', transform: 'translateY(-50%)', left: '45px', width: '110px', height: '1px', backgroundColor: 'black' }}></div>
                                <div style={{ color:'#C5C8C8', textAlign: 'right', marginTop: '10px' }}>
                                  {pieChartPercentages.current.toFixed(1)}%
                                </div>
                              </div>
                            </div>
                          </div>
                        </InfoCard>
                        <InfoCard className="info-card-3-base">
                            <div className="period-container">
                                <div className="period-covered">Period Covered</div>
                            </div>
                            <div>
                                <InfoCard className="info-card-3">
                                    <table className="financial-table">
                                    <colgroup>
                                        <col style={{ width: '15%' }} />   
                                          
                                        <col style={{ width: '15%' }} />   
                                        <col style={{ width: '15%' }} /> 
                                        <col style={{ width: '15%' }} />
                                        </colgroup>
                                        <thead>
                                            <tr>
                                            </tr>
                                            <tr>
                                                <th>Account Name</th>
                                                
                                                <th>Type</th>
                                                <th>Current Period Balance</th>
                                                <th>Previous Period Balance</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {trialBalanceData.map((item, index) => (
                                                <tr 
                                                key={index}
                                                    className={index % 2 ===0 ? "even-row" : "odd-row"}
                                                    >
                                                    <td>{item.AccountName}</td>
                                                    
                                                    <td>{item.Type}</td>
                                                    <td>₱{item.CurrentPeriodBalance.toLocaleString()}</td>
                                                    <td>₱{item.PreviousPeriodBalance.toLocaleString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </InfoCard></div>
                        </InfoCard>
                                <InfoCard className="info-card-4">
                                  <div className="financial-summary">
                                    <div className="infocard-4-header-row">
                                      <div className="infocard-4-header-label"></div>
                                      <div className="infocard-4-header-label">Total</div>
                                      <div className="infocard-4-header-label1"></div>
                                      <div className="infocard-4-header-label"></div>
                                      <div className="infocard-4-header-cell1">₱ {periodSummary.totalPrevious.toLocaleString(undefined, {minimumFractionDigits:2})}</div>
                                      <div className="infocard-4-header-cell2">₱ {periodSummary.totalCurrent.toLocaleString(undefined, {minimumFractionDigits:2})}</div>
                                    </div>
                                    <div className="infocard-4-header-row-bottom">
                                      <div className="infocard-4-header-cell"></div>
                                      <div className="infocard-4-header-cell">Previous Period Balance</div>
                                      <div className="infocard-4-header-cell">Current Period Balance</div>
                                    </div>
                                    {periodSummary.rows.map((row, idx) => (
                                      <div className="infocard-4-row" key={row.label}>
                                        <div className="infocard-4-row-label">{row.label}</div>
                                        <div className="infocard-4-row-value">₱ {row.previous.toLocaleString(undefined, {minimumFractionDigits:2})}</div>
                                        <div className="infocard-4-row-value">₱ {row.current.toLocaleString(undefined, {minimumFractionDigits:2})}</div>
                                      </div>
                                    ))}
                                  </div>
                                </InfoCard>
                    </div>
                 )}
                            

                            {activeTab === "Income Statement" && (
          <div className="content-grid">
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
        )}
            </div>
        </div>
                            
    );
};
                        
export default BodyContent;