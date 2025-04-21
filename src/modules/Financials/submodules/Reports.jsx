import React, { useState, useEffect, useMemo } from "react";
import { BarChart, Bar,XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Pie, PieChart, Cell, LabelList} from "recharts";
import "../styles/Reports.css";

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

  const [chartHeight, setChartHeight] = useState(400);
  const [chartMargin, setChartMargin] = useState({ top: 50, right: 50, left: 50, bottom: 45 });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setChartHeight(300);
        setChartMargin({ top: 30, right: 20, left: 20, bottom: 10}); 
      } else {
        setChartHeight(400);
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
                backgroundColor: '#88B4B4', 
                borderRadius: '10px', 
                padding: '5px', 
              }}
              contentStyle={{
                fontSize: '13px',
                color: '#6C7676',
            }}
            />
            <Legend verticalAlign="top" align="center" wrapperStyle={{ top: 15, left: 0, padding: '20px' }} content={renderLegend} />
            <Bar dataKey="outflow" stackId="a" fill="#787878" name="Outflow" radius={[2, 2, 0, 0]} />
            <Bar dataKey="inflow" stackId="a" fill="#00BBBB" name="Inflow" radius={[2, 2, 0, 0]} />
            <Bar dataKey="net" stackId="a" fill="#DAE4E4" name="Net" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="summary-numbers" style={{ position: 'relative', display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ position: 'absolute', top: '-15px', left: '10px', width: 'calc(100% - 20px)', height: '2px', backgroundColor: '#00BBBB' }}></div>
        <div className="summary-item" style={{ position: 'relative' }}>
          <div className="summary-label">INFLOW</div>
          <div className="summary-value">₱{inflowTotal.toLocaleString()}</div>
          <div style={{ position: 'absolute', right: '-10px', top: '50%', transform: 'translateY(-50%)', width: '1px', height: '50px', backgroundColor: '#00BBBB' }}></div>
        </div>
        <div className="summary-item" style={{ position: 'relative' }}>
          <div className="summary-label">OUTFLOW</div>
          <div className="summary-value">-₱{outflowTotal.toLocaleString()}</div>
          <div style={{ position: 'absolute', right: '-10px', top: '50%', transform: 'translateY(-50%)', width: '1px', height: '50px', backgroundColor: '#00BBBB' }}></div>
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
    const collectedAmount = 180000.50; 
    const openInvoicesAmount = 120300.45; 
    const overdueAmount = 70550.00; 
    const avatarLetter = 'A';

    const totalAmount = collectedAmount + openInvoicesAmount + overdueAmount;

    const collectedWidth = (collectedAmount / totalAmount) * 100 + '%';
    const openInvoicesWidth = (openInvoicesAmount / totalAmount) * 100 + '%';
    const overdueWidth = (overdueAmount / totalAmount) * 100 + '%';

    const renderInvoiceCollections = () => {
        return (
            <InfoCard className="invoice-collections-card">
                <h2 className="invoice-collections-title">Invoice & Collections</h2>
                <div className="invoice-collections-bar">
                    <div
                        className="bar-section collected"
                        style={{ width: collectedWidth }}
                    >
                        <span className="amount">₱{collectedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div
                        className="bar-section open-invoices"
                        style={{ width: openInvoicesWidth }}
                    >
                        <span className="amount">₱{openInvoicesAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div
                        className="bar-section overdue"
                        style={{ width: overdueWidth }}
                    >
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
        { name: 'Payroll', amount: 120080, color: '#00BBBB' },
        { name: 'Marketing', amount: 60040, color: '#68A0F2' },
        { name: 'Rent or Lease', amount: 40530, color: '#E6D064' },
        { name: 'Miscellaneous', amount: 20416, color: '#E96062' },
        { name: 'Other Expenses', amount: 90060, color: '#D3D3D3' },
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


      
const BodyContent = () => {
    const [activeTab, setActiveTab] = useState(tabs[0]);
    const [isCompact, setIsCompact] = useState(window.innerWidth < 768);

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
    
    const cashFlowData = [
        { month: 'Jan', inflow: 519976.21, outflow: 10000 },
        { month: 'Feb', inflow: 450000, outflow: 50000 },
        { month: 'Mar', inflow: 600000, outflow: 200000 },
        { month: 'Apr', inflow: 550000, outflow: 350000 },
        { month: 'May', inflow: 480000, outflow: 410000 },
        { month: 'Jun', inflow: 520000, outflow: 230000 },
        { month: 'Jul', inflow: 490000, outflow: 120000 },
        { month: 'Aug', inflow: 530000, outflow: 40000 },
        { month: 'Sep', inflow: 500000, outflow: 25000 },
        { month: 'Oct', inflow: 540000, outflow: 10000 },
        { month: 'Nov', inflow: 510000, outflow: 50000 },
        { month: 'Dec', inflow: 550000, outflow: 10000 },
      ];
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
    
    const receivableAgingData = [
        { name: 'Current', amount: 30345.50 },
        { name: '0 - 30', amount: 20231.00 },
        { name: '31 - 60', amount: 10857.30 },
        { name: '61 - 90', amount: 8050.00 },
    ];

    const payableAgingData = [
  { name: 'Current', amount: 6050.00 },
  { name: '0 - 30', amount: 20231.00 },
  { name: '31 - 60', amount: 8050.43 },
  { name: '61 - 90', amount: 5000.00 },
];


    
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
                        <InfoCard className="infocard-cash-flow-base">
                            <InfoCard className="infocard-cash-flow">
                                <CashFlowCard data={cashFlowData} />
                            </InfoCard>
                            <div className="cash-flow-invoice-collections">
                                <InvoiceCollections />
                            </div>
                        </InfoCard>
                            <InfoCard className="receivable-aging-card">
                                <div className="receivable-aging-chart">
                                    <div className="title-container"> 
                                        <h2 className="receivable-aging-title">Receivable Aging</h2>
                                    </div>
                                    <ResponsiveContainer width="100%" height={200}>
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
                                                fill="#00BBBB"
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

                            <InfoCard className="payable-aging-card"> 
                                <div className="payable-aging-chart">
                                    <div className="title-container"> 
                                        <h2 className="payable-aging-title">Payable Aging</h2>
                                    </div>
                                    <ResponsiveContainer width="100%" height={200}>
                                        <BarChart data={payableAgingData} layout="vertical" margin={{ top: 15, right: 30, left: 50, bottom: 5 }}>
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
                                                fill="#E96062"
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
                                    <div className="total-payable">
                                        TOTAL PAYABLE: <span className="payable-amount">₱{payableAgingData.reduce((sum, item) => sum + item.amount, 0).toFixed(2).toLocaleString()}</span>
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
                                                        data={pieData}
                                                        dataKey="percentage"
                                                        nameKey="name"
                                                        cx="50%"
                                                        cy="50%"
                                                        outerRadius={160}
                                                        innerRadius={70}
                                                        fill="#8884d8"
                                                    >
                                                        <LabelList dataKey="percentage" position="inside" formatter={(value) => `${Math.round(value)}%`} />
                                                        {pieData.map((entry, index) => (
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
                                            {pieData.map((category, index) => (
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
                                <BarChart data={data} margin={{ top: 10, right: 20, left: 15, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="currentBarGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#469FC2" stopOpacity={100} />
                                            <stop offset="100%" stopColor="#F7FFFE" stopOpacity={100} />
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
          data={[
            { name: "Previous", value: 50.5, color: "#F4E1AE" },
            { name: "Current", value: 49.5, color: "#A0D3E8" },
          ]}
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
          <Cell key="current" fill="#A0D3E8" />
        </Pie>
      </PieChart>
    </ResponsiveContainer>
    <div className="pie-chart-labels" style={{ fontWeight: 'bold', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', marginTop: '-100px' }}>
      <div style={{ textAlign: 'left', paddingLeft: '20px', position: 'relative' }}>
        <div style={{ fontWeight: 'bold', position: 'absolute', top: '60%', transform: 'translateY(-60%)', right: '45px', width: '110px', height: '1px', backgroundColor: 'black' }}></div>
        Previous Period Balance
        <div style={{ color:'#C5C8C8', textAlign: 'left', marginTop: '10px' }}>50.5%</div>
      </div>
      <div style={{  textAlign: 'right', paddingRight: '20px', position: 'relative' }}>
        Current Period Balance
        <div style={{ fontWeight: 'bold', position: 'absolute', top: '60%', transform: 'translateY(-50%)', left: '45px', width: '110px', height: '1px', backgroundColor: 'black' }}></div>
        <div  style={{ color:'#C5C8C8', textAlign: 'right', marginTop: '10px' }}>49.5%</div>
      </div>
    </div>
  </div>
</InfoCard>
                        <InfoCard className="info-card-3-base">
                            <div className="period-container">
                                <div className="period-covered">Period Covered</div>
                                <div className="february-2023">February 2023</div>
                            </div>
                            <div>
                                <InfoCard className="info-card-3">
                                    <table className="financial-table">
                                        <col style={{ width: '15%' }} />   
                                        <col style={{ width: '15%' }} />  
                                        <col style={{ width: '15%' }} />   
                                        <col style={{ width: '15%' }} /> 
                                        <col style={{ width: '15%' }} />
                                        <thead>
                                            <tr>
                                            </tr>
                                            <tr>
                                                <th>Account Name</th>
                                                <th>Account No.</th>
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
                                                    <td>{item.AccountNo}</td>
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
                                            <div className="infocard-4-header-cell1">₱ 515,500.00</div>
                                            <div className="infocard-4-header-cell2">₱ 515,500.00</div>
                                        </div>
                                        <div className="infocard-4-header-row-bottom">
                                            <div className="infocard-4-header-cell"></div>
                                            <div className="infocard-4-header-cell">Previous Period Balance</div>
                                            <div className="infocard-4-header-cell">Current Period Balance</div>
                                        </div>

                                        <div className="infocard-4-row">
                                            <div className="infocard-4-row-label">Asset</div>
                                            <div className="infocard-4-row-value">₱ 418,000.00</div>
                                            <div className="infocard-4-row-value">₱ 418,000.00</div>
                                        </div>
                                        <div className="infocard-4-row">
                                            <div className="infocard-4-row-label">Liability</div>
                                            <div className="infocard-4-row-value">(₱ 38,000.00)</div>
                                            <div className="infocard-4-row-value">(₱ 35,000.00)</div>
                                        </div>
                                        <div className="infocard-4-row">
                                            <div className="infocard-4-row-label">Equity</div>
                                            <div className="infocard-4-row-value">₱ 102,000.00</div>
                                            <div className="infocard-4-row-value">(₱ 35,000.00)</div>
                                        </div>
                                        <div className="infocard-4-row">
                                            <div className="infocard-4-row-label">Revenue</div>
                                            <div className="infocard-4-row-value">₱ 110,000.00</div>
                                            <div className="infocard-4-row-value">₱ 120,000.00</div>
                                        </div>
                                        <div className="infocard-4-row">
                                            <div className="infocard-4-row-label">Expense</div>
                                            <div className="infocard-4-row-value">(₱ 76,500.00)</div>
                                            <div className="infocard-4-row-value">(₱ 85,000.00)</div>
                                        </div>
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
                                        <th></th>
                                        <th></th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <th>Revenue</th>
                                        <th>Year 1</th>
                                        <th>Year 2</th>
                                        <th>Year 3</th>
                                    </tr>
                                    {incomeStatementData
                                        .find((category) => category.category === "Revenue")
                                        ?.items.map((item, itemIndex) => (
                                        <tr key={itemIndex}>
                                            <td>{item.name}</td>
                                            <td>{item.year1 ? item.year1.toLocaleString() : ""}</td>
                                            <td>{item.year2 ? item.year2.toLocaleString() : ""}</td>
                                            <td>{item.year3 ? item.year3.toLocaleString() : ""}</td>
                                        </tr>
                                        ))}
                                        <tr>
                                            <th>Cost of Goods Sold</th>
                                            <th></th>
                                            <th></th>
                                            <th></th>
                                        </tr>
                                    {incomeStatementData
                                        .find((category) => category.category === "Cost of Goods Sold")
                                        ?.items.map((item, itemIndex) => (
                                        <tr key={itemIndex}>
                                            <td>{item.name}</td>
                                            <td>{item.year1 ? item.year1.toLocaleString() : ""}</td>
                                            <td>{item.year2 ? item.year2.toLocaleString() : ""}</td>
                                            <td>{item.year3 ? item.year3.toLocaleString() : ""}</td>
                                        </tr>
                                        ))}
                                        <tr>
                                            <th>Operating Expenses</th>
                                            <th></th>
                                            <th></th>
                                            <th></th>
                                        </tr>
                                    {incomeStatementData
                                        .find((category) => category.category === "Operating Expenses")
                                        ?.items.map((item, itemIndex) => (
                                        <tr key={itemIndex}>
                                            <td>{item.name}</td>
                                            <td>{item.year1 ? item.year1.toLocaleString() : ""}</td>
                                            <td>{item.year2 ? item.year2.toLocaleString() : ""}</td>
                                            <td>{item.year3 ? item.year3.toLocaleString() : ""}</td>
                                        </tr>
                                        ))}
                                        <tr>
                                            <th>Operating Profit (Loss)</th>
                                            <th></th>
                                            <th></th>
                                            <th></th>
                                        </tr>
                                    {incomeStatementData
                                        .find((category) => category.category === "Operating Profit (Loss)")
                                        ?.items.map((item, itemIndex) => (
                                        <tr key={itemIndex}>
                                            <td>{item.name}</td>
                                            <td>{item.year1 ? item.year1.toLocaleString() : ""}</td>
                                            <td>{item.year2 ? item.year2.toLocaleString() : ""}</td>
                                            <td>{item.year3 ? item.year3.toLocaleString() : ""}</td>
                                        </tr>
                                        ))}
                                        <tr>
                                            <th>Profit (Loss) Before Taxes</th>
                                            <th></th>
                                            <th></th>
                                            <th></th>
                                        </tr>
                                    {incomeStatementData
                                        .find((category) => category.category === "Profit (Loss) Before Taxes")
                                        ?.items.map((item, itemIndex) => (
                                        <tr key={itemIndex}>
                                            <td>{item.name}</td>
                                            <td>{item.year1 ? item.year1.toLocaleString() : ""}</td>
                                            <td>{item.year2 ? item.year2.toLocaleString() : ""}</td>
                                            <td>{item.year3 ? item.year3.toLocaleString() : ""}</td>
                                        </tr>
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