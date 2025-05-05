import React from "react";
import { 
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from 'recharts';

const CandidatesSummaryReport = ({ candidates }) => {
  // Calculate metrics
  const totalCandidates = candidates.length;
  
  // Candidates by stage
  const stages = {
    'Application': candidates.filter(c => c.stage === 'Application').length,
    'Screening': candidates.filter(c => c.stage === 'Screening').length,
    'Interview': candidates.filter(c => c.stage === 'Interview').length,
    'Assessment': candidates.filter(c => c.stage === 'Assessment').length,
    'Job Offer': candidates.filter(c => c.stage === 'Job Offer').length,
    'Hired': candidates.filter(c => c.stage === 'Hired').length,
    'Rejected': candidates.filter(c => c.stage === 'Rejected').length
  };
  
  const stageData = Object.entries(stages).map(([name, value]) => ({ name, value }));
  
  // Source of candidates
  const sourceData = candidates.reduce((acc, candidate) => {
    const source = candidate.source || "Other";
    acc[source] = (acc[source] || 0) + 1;
    return acc;
  }, {});
  
  const sourceChartData = Object.entries(sourceData)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
  
  // Positions with most candidates
  const positionData = candidates.reduce((acc, candidate) => {
    const position = candidate.position_applied || "Unspecified";
    acc[position] = (acc[position] || 0) + 1;
    return acc;
  }, {});
  
  const positionChartData = Object.entries(positionData)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5); // Top 5 positions
  
  const COLORS = ['#00a9ac', '#66bc6d', '#8884d8', '#ff8042', '#a5d8ef', '#ffc658', '#d53e4f'];

  return (
    <div className="summary-report candidates-report">
      <div className="metrics-cards">
        <div className="metric-card">
          <h3>Total Candidates</h3>
          <div className="metric-value">{totalCandidates}</div>
        </div>
        <div className="metric-card">
          <h3>In Process</h3>
          <div className="metric-value">
            {stages.Application + stages.Screening + stages.Interview + stages.Assessment + stages['Job Offer']}
          </div>
        </div>
        <div className="metric-card">
          <h3>Hired</h3>
          <div className="metric-value">{stages.Hired}</div>
        </div>
        <div className="metric-card">
          <h3>Rejected</h3>
          <div className="metric-value">{stages.Rejected}</div>
        </div>
      </div>
      
      <div className="charts-container">
        <div className="chart-panel">
          <h3>Candidates by Recruitment Stage</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stageData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {stageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} candidates`, 'Count']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="chart-panel">
          <h3>Top 5 Positions with Most Applicants</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={positionChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#00a9ac" name="Candidates" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="chart-panel">
          <h3>Candidate Sources</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sourceChartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" width={120} />
              <Tooltip />
              <Bar dataKey="count" fill="#66bc6d" name="Candidates" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default CandidatesSummaryReport;