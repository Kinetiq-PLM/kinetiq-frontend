import React, { useState, useEffect } from 'react';
import './styles/Operations.css';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#2ab7b7', '#90f0f0', '#53c5d0', '#3187b3'];

const Operations = () => {
  const [chartSize, setChartSize] = useState({
    width: window.innerWidth > 600 ? 600 : 400,
    height: window.innerWidth > 600 ? 450 : 320
  });

  const [activeIndex, setActiveIndex] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [statusCounts, setStatusCounts] = useState({
    Draft: 0,
    Open: 0,
    Closed: 0,
    Cancelled: 0
  });
  const [totalValue, setTotalValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [timestamp, setTimestamp] = useState('');

  useEffect(() => {
    const handleResize = () => {
      setChartSize({
        width: window.innerWidth > 600 ? 600 : 400,
        height: window.innerWidth > 600 ? 450 : 320
      });
    };

    window.addEventListener('resize', handleResize);
    
    // Fetch data from API
    fetchData();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('https://js6s4geoo2.execute-api.ap-southeast-1.amazonaws.com/dev/operation/goods-tracking/');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      
      setDocuments(data);
      
      // Calculate status counts
      const counts = {
        Draft: 0,
        Open: 0,
        Closed: 0,
        Cancelled: 0
      };
      
      let total = 0;
      
      data.forEach(doc => {
        counts[doc.status] = (counts[doc.status] || 0) + 1;
        const amount = parseFloat(doc.transaction_cost) || 0;
        total += amount;
      });
      
      setStatusCounts(counts);
      setTotalValue(total);
      
      // Set current timestamp
      const now = new Date();
      setTimestamp(now.toLocaleString());
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handlePieClick = (_, index) => {
    setActiveIndex(index);
  };

  // Prepare data for pie chart
  const pieData = [
    { name: 'Draft', value: statusCounts.Draft },
    { name: 'Open', value: statusCounts.Open },
    { name: 'Closed', value: statusCounts.Closed },
    { name: 'Cancelled', value: statusCounts.Cancelled },
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="operations">
        <div className="body-content-container">
          <div className="operations-container">
          <div className="operations loading-center">
            <p>Loading data...</p>
          </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="operations">
      <div className="body-content-container">
        <div className="operations-container">
          <div className="operations-header">
            <h2 className="operations-welcome-text">Welcome back, Elena!</h2>
            <div className="operations-total-box">
              <p className="operations-total-label">Total Value</p>
              <p className="operations-total-amount">{formatCurrency(totalValue)}</p>
            </div>
          </div>

          <div className="operations-chart-section">
            <p className="operations-breadcrumb">Operations / Dashboard</p>
            <PieChart width={chartSize.width} height={chartSize.height}>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={100}
                outerRadius={180}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(1)}%`
                }
                activeIndex={activeIndex}
                onClick={handlePieClick}
                labelLine={{ strokeWidth: 2, stroke: '#066', strokeDasharray: '0' }}
                isAnimationActive={true}
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                    stroke={index === activeIndex ? 'transparent' : '#fff'}
                    strokeWidth={index === activeIndex ? 3 : 1}
                    cursor="pointer"
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
            <h3 className="operations-chart-title">Total Documents</h3>
            <p className="operations-timestamp">As of: {timestamp}</p>
          </div>

          <div className="operations-main">
            <div className="operations-status-section">
              <h3 className="operations-status-title">Document Status</h3>
              <div className="operations-status-cards">
                {pieData.map((item) => (
                  <div
                    key={item.name}
                    className={`operations-status-card operations-${item.name.toLowerCase()}-card`}
                  >
                    <p className="operations-status-count">{item.value}</p>
                    <p className="operations-status-label">{item.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Operations;