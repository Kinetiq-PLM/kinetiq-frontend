import React, { useState, useEffect } from 'react';
import './styles/Operations.css';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#2ab7b7', '#90f0f0', '#53c5d0', '#3187b3'];
const docTypes = ['Total', 'Goods Receipt', 'Goods Receipt PO', 'Goods Issue', 'A/R Credit Memo'];

const Operations = ({employee_id}) => {
  const [chartSize, setChartSize] = useState({
    width: Math.min(window.innerWidth - 40, 600), 
    height: window.innerWidth > 768 ? 450 : window.innerWidth > 480 ? 380 : 300
  });
  const PIE_ANIMATION_DURATION = 1000;
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
        width: Math.min(window.innerWidth - 40, 600),
        height: window.innerWidth > 768 ? 450 : window.innerWidth > 480 ? 380 : 300
      });
    };

    window.addEventListener('resize', handleResize);
    
    if (documents.length === 0) {
      fetchData();
    }
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  const [currentTypeIndex, setCurrentTypeIndex] = useState(0);
  const [statusByType, setStatusByType] = useState({});

  const fetchData = async () => {
    try {
      const response = await fetch('https://js6s4geoo2.execute-api.ap-southeast-1.amazonaws.com/dev/operation/goods-tracking/');
      if (!response.ok) throw new Error('Network response was not ok');
  
      const data = await response.json();
      setDocuments(data);
  
      const grouped = {
        Total: { Draft: 0, Open: 0, Closed: 0, Cancelled: 0 },
        'Goods Receipt': { Draft: 0, Open: 0, Closed: 0, Cancelled: 0 },
        'Goods Receipt PO': { Draft: 0, Open: 0, Closed: 0, Cancelled: 0 },
        'Goods Issue': { Draft: 0, Open: 0, Closed: 0, Cancelled: 0 },
        'A/R Credit Memo': { Draft: 0, Open: 0, Closed: 0, Cancelled: 0 },
      };
  
      let total = 0;
  
      data.forEach(doc => {
        const type = doc.document_type || 'Unknown';
        const status = doc.status;
        const amount = parseFloat(doc.transaction_cost) || 0;
  
        total += amount;
  
        if (grouped['Total'][status] !== undefined) {
          grouped['Total'][status]++;
        }
  
        if (grouped[type] && grouped[type][status] !== undefined) {
          grouped[type][status]++;
        }
      });
  
      setStatusByType(grouped);
      setTotalValue(total);
      setTimestamp(new Date().toLocaleString());
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTypeIndex(prev => (prev + 1) % docTypes.length);
    }, 10000); 
  
    return () => clearInterval(interval);
  }, []);
    
  const [fadeStatus, setFadeStatus] = useState(false);


  const handlePieClick = (_, index) => {
    setActiveIndex(index);
  };

  const currentType = docTypes[currentTypeIndex];
  const counts = statusByType[currentType] || { Draft: 0, Open: 0, Closed: 0, Cancelled: 0 };

  const pieData = [
    { name: 'Draft', value: counts.Draft },
    { name: 'Open', value: counts.Open },
    { name: 'Closed', value: counts.Closed },
    { name: 'Cancelled', value: counts.Cancelled },
  ];

  

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };
  const [employeeName, setEmployeeName] = useState('');
  useEffect(() => {
    fetch('https://js6s4geoo2.execute-api.ap-southeast-1.amazonaws.com/dev/operation/supplier/')
      .then(response => response.json())
      .then(data => {
        const match = data.employees.find(emp => emp.employee_id === employee_id);
        if (match) {
          setEmployeeName(match.first_name); 
        }
      })
      .catch(error => {
        console.error('Failed to fetch employee data:', error);
      });
  }, [employee_id]);
 
  if (loading) {
    return (
      <div className="operations">
        <div className="body-content-container">
          <div className="operations-container loading">
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
        <div className="operations-container dropdown-scrollbar">
          <div className="operations-header">
            <h2 className="operations-welcome-text">Welcome back, {employeeName}!</h2>
            <div className="operations-total-box">
              <p className="operations-total-label">Total Value</p>
              <p className="operations-total-amount">{formatCurrency(totalValue)}</p>
            </div>
          </div>

          <div className="operations-chart-section">
            <p className="operations-breadcrumb">Operations / Dashboard</p>
            <PieChart width={chartSize.width} height={chartSize.height}>
            <Pie
              key={currentTypeIndex}  
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={window.innerWidth > 768 ? 100 : window.innerWidth > 480 ? 80 : 60}
              outerRadius={window.innerWidth > 768 ? 180 : window.innerWidth > 480 ? 150 : 120}
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
            <h3 className="operations-chart-title">{currentType} Documents</h3>
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
                    style={{
                      transition: `all ${PIE_ANIMATION_DURATION}ms ease-out`,
                      opacity: currentTypeIndex % 2 ? 0.9 : 1  
                    }}
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