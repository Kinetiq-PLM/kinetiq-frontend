import React, { useState, useEffect} from "react";
import { BarChart, Bar,XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from "recharts";
import "./styles/Financials.css";

const data = [
    { name: "Asset", current: 500000, previous: 450000 },
    { name: "Liability", current: -50000, previous: -30000 },
    { name: "Equity", current: 200000, previous: 180000 },
    { name: "Revenue", current: 250000, previous: 230000 },
    { name: "Expense", current: -100000, previous: -120000 }
];

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
 
  const [chartHeight, setChartHeight] = useState(500);
  const [chartMargin, setChartMargin] = useState({ top: 10, right: 50, left: 50, bottom: 60 });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setChartHeight(500);
        setChartMargin({ top: 10, right: 20, left: 20, bottom: 30 }); 
      } else {
        setChartHeight(500);
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
            <Bar dataKey="outflow" stackId="a" fill="#787878" name="Outflow" radius={[2, 2, 0, 0]} />
            <Bar dataKey="inflow" stackId="a" fill="#00BBBB" name="Inflow" radius={[2, 2, 0, 0]} />
            <Bar dataKey="net" stackId="a" fill="#DAE4E4" name="Net" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};


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
    

const [selectedOption, setSelectedOption] = useState("All time"); 
    const [budgetBalance, setBudgetBalance] = useState({
        totalBalance: "278,992",
        cents:".00",
        earnedLastMonth: "93,116.00",
        totalBonus: "5,402.00",
      });

      const handleChange = (event) => {
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

     
    return (
        <div className="finance">
            <div className="body-content-container">
            <div className="content-grid">
                        <div className="all-reports-1">
                            <InfoCard className="budget-balance-card">
                                <div className="budget-balance-header">
                                        
                                    <span className="budget-balance-title">Budget Balance</span>
                                    <select
                                        className="budget-balance-select"
                                        value={selectedOption}
                                        onChange={handleChange}
                                        >
                                        <option>All time</option>
                                        <option>Last Month</option>
                                        <option>Last 3 Mos</option>
                                        <option>Last Year</option>
                                    </select>
                                </div>
                                    <div className="budget-balance-content">
                                        
                                        <div className="total-balance">
                                            <span className="total-balance-label">Total Balance</span>
                                        </div>
                                        <div  className="total-balance-amount">₱{budgetBalance.totalBalance}
                                            <span className="cents">{budgetBalance.cents}</span>
                                        </div>
                                        <div className="earned-last-month">
                                            <span className="earned-last-month-label">Total Earned Last Month</span>
                                            <span className="earned-last-month-amount">+₱{budgetBalance.earnedLastMonth}</span>
                                        </div>
                                        <div className="total-bonus">
                                            <span className="total-bonus-label">Total Bonus</span>
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
                            </InfoCard>
                        </div>
                        <div className="all-reports-4">
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
                                        {incomeStatementDataSummary
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
                                        {incomeStatementDataSummary
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
                                        {incomeStatementDataSummary
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
                                        {incomeStatementDataSummary
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
                                        {incomeStatementDataSummary
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
                        </div>
                        </div>
        </div>
    );
};

export default BodyContent;
