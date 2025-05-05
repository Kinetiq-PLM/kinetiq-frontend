import React from 'react';
import {
  ResponsiveContainer, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';

const RecruitmentPipelineChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        layout="vertical"
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis dataKey="stage" type="category" width={100} />
        <Tooltip formatter={(value) => [`${value} candidates`, 'Count']} />
        <Legend />
        <Bar dataKey="count" fill="#00a9ac" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default RecruitmentPipelineChart;