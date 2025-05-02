import React, { useState, useEffect } from 'react';
import './styles/Operations.css';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Draft', value: 5 },
  { name: 'Open', value: 10 },
  { name: 'Closed', value: 9 },
  { name: 'Cancelled', value: 11 },
];

const COLORS = ['#2ab7b7', '#90f0f0', '#53c5d0', '#3187b3'];

const Operations = () => {
  const [chartSize, setChartSize] = useState({
    width: window.innerWidth > 600 ? 600 : 400,
    height: window.innerWidth > 600 ? 450 : 320
  });

  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setChartSize({
        width: window.innerWidth > 600 ? 600 : 400,
        height: window.innerWidth > 600 ? 450 : 320
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePieClick = (_, index) => {
    setActiveIndex(index);
  };

  return (
    <div className="operations">
      <div className="body-content-container">
        <div className="operations-container">
          <div className="operations-header">
            <h2 className="operations-welcome-text">Welcome back, Elena!</h2>
            <div className="operations-total-box">
              <p className="operations-total-label">Total Value</p>
              <p className="operations-total-amount">₱100,000,000.00</p>
            </div>
          </div>

          <div className="operations-chart-section">
            <p className="operations-breadcrumb">Operations / Dashboard</p>
            <PieChart width={chartSize.width} height={chartSize.height}>
              <Pie
                data={data}
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
                {data.map((entry, index) => (
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
            <p className="operations-timestamp">As of: mm/dd/yy 12:00 PM</p>
          </div>

          <div className="operations-main">
            <div className="operations-status-section">
              <h3 className="operations-status-title">Document Status</h3>
              <div className="operations-status-cards">
                {data.map((item) => (
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
