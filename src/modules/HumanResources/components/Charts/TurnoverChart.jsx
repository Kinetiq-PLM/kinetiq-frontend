import React from 'react';
import {
  ResponsiveContainer, LineChart, Line, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';

const TurnoverChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip formatter={(value) => [`${value}%`, 'Turnover Rate']} />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="rate" 
          stroke="#ff7300" 
          activeDot={{ r: 8 }} 
          name="Turnover Rate"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default TurnoverChart;