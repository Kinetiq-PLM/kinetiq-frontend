import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, 
  BarChart, Bar, CartesianGrid, XAxis, YAxis, 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import '../styles/RecruitmentAnalytics.css';

const RecruitmentAnalytics = ({ navigateTo }) => {
  // State for data
  const [candidates, setCandidates] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalCandidates: 0,
    newApplications: 0,
    scheduledInterviews: 0,
    completedInterviews: 0,
    averageRating: 0,
    highPotentialCandidates: 0
  });

  // Kinetiq brand colors
  const kinetiqColors = {
    primary: "#00a9ac",
    secondary: "#66bc6d",
    accent1: "#8884d8",
    accent2: "#ff8042",
    accent3: "#da4c43",
    accent4: "#82ca9d",
    accent5: "#ffc658",
    accent6: "#7b68ee",
    accent7: "#a5d8ef",
    neutral: "#687C7B"
  };

  // Status colors
  const statusColors = {
    'Applied': kinetiqColors.primary,
    'Screening': kinetiqColors.accent1,
    'Interview': kinetiqColors.accent5,
    'Assessment': kinetiqColors.accent2,
    'Job Offer': kinetiqColors.secondary,
    'Hired': kinetiqColors.accent4,
    'Rejected': kinetiqColors.accent3,
    'Completed': kinetiqColors.secondary,
    'Scheduled': kinetiqColors.accent5,
    'Cancelled': kinetiqColors.neutral,
    'Pending': kinetiqColors.accent1,
  };

  // Helper function to create lighter/darker shade of a color
  const createShade = (hexColor, percent) => {
    const f = parseInt(hexColor.slice(1), 16);
    const t = percent < 0 ? 0 : 255;
    const p = percent < 0 ? percent * -1 : percent;
    const R = f >> 16;
    const G = (f >> 8) & 0x00ff;
    const B = f & 0x0000ff;
    
    return `#${(
      0x1000000 +
      (Math.round((t - R) * p) + R) * 0x10000 +
      (Math.round((t - G) * p) + G) * 0x100 +
      (Math.round((t - B) * p) + B)
    ).toString(16).slice(1)}`;
  };
  
  // Define gradient IDs for each color
  const statusGradients = Object.keys(statusColors).map((status, index) => 
    `statusGradient-${index}`);
  const barGradients = [1, 2, 3, 4, 5].map(rating => `ratingGradient-${rating}`);
  const positionGradients = Array(10).fill().map((_, i) => `positionGradient-${i}`);
  const radarGradient = "radarGradient";
  
  // SVG gradient definitions
  const renderGradientDefs = () => (
    <defs>
      {/* Status color gradients for pie charts */}
      {Object.entries(statusColors).map(([status, color], index) => (
        <radialGradient 
          key={`radial-gradient-${index}`} 
          id={statusGradients[index]} 
          cx="50%" cy="50%" r="50%" 
          fx="50%" fy="50%"
        >
          <stop offset="0%" stopColor={createShade(color, 0.2)} stopOpacity={0.9} />
          <stop offset="100%" stopColor={color} stopOpacity={1} />
        </radialGradient>
      ))}
      
      {/* Rating color gradients for bar charts */}
      {[1, 2, 3, 4, 5].map(rating => {
        const color = rating >= 4 ? kinetiqColors.secondary : 
                     rating === 3 ? kinetiqColors.accent5 : 
                     kinetiqColors.accent3;
        return (
          <linearGradient 
            key={`bar-gradient-${rating}`} 
            id={`ratingGradient-${rating}`} 
            x1="0" y1="0" 
            x2="0" y2="1"
          >
            <stop offset="0%" stopColor={color} stopOpacity={0.9} />
            <stop offset="100%" stopColor={createShade(color, 0.15)} stopOpacity={0.7} />
          </linearGradient>
        );
      })}
      
      {/* Position color gradients for bar charts */}
      {Array(10).fill().map((_, i) => (
        <linearGradient 
          key={`position-gradient-${i}`} 
          id={`positionGradient-${i}`} 
          x1="0" y1="0" 
          x2="0" y2="1"
        >
          <stop offset="0%" stopColor={kinetiqColors.accent6} stopOpacity={0.9} />
          <stop offset="100%" stopColor={createShade(kinetiqColors.accent6, 0.15)} stopOpacity={0.7} />
        </linearGradient>
      ))}
      
      {/* Radar chart gradient */}
      <linearGradient 
        id={radarGradient} 
        x1="0" y1="0" 
        x2="0" y2="1"
      >
        <stop offset="0%" stopColor={kinetiqColors.primary} stopOpacity={0.7} />
        <stop offset="100%" stopColor={createShade(kinetiqColors.primary, 0.2)} stopOpacity={0.5} />
      </linearGradient>
    </defs>
  );

  // Fetch data from APIs
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Use the provided API endpoints
        const candidatesResponse = await axios.get('https://x0crs910m2.execute-api.ap-southeast-1.amazonaws.com/dev/api/candidates/candidates/');
        const interviewsResponse = await axios.get('https://x0crs910m2.execute-api.ap-southeast-1.amazonaws.com/dev/api/interviews/');
        
        const candidatesData = candidatesResponse.data || [];
        const interviewsData = interviewsResponse.data || [];
        
        setCandidates(candidatesData);
        setInterviews(interviewsData);
        
        // Calculate statistics
        const today = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 30);
        
        const newApps = candidatesData.filter(candidate => {
          const createDate = new Date(candidate.created_at);
          return createDate >= thirtyDaysAgo;
        }).length;
        
        const scheduledInterviews = interviewsData.filter(interview => 
          interview.status === 'Scheduled').length;
        
        const completedInterviews = interviewsData.filter(interview => 
          interview.status === 'Completed').length;
        
        const ratings = interviewsData
          .filter(interview => interview.rating)
          .map(interview => interview.rating);
        
        const avgRating = ratings.length > 0 ? 
          ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length : 0;
        
        const highPotential = interviewsData.filter(interview => 
          interview.rating >= 4).length;
        
        setStats({
          totalCandidates: candidatesData.length,
          newApplications: newApps,
          scheduledInterviews,
          completedInterviews,
          averageRating: avgRating.toFixed(1),
          highPotentialCandidates: highPotential
        });
        
        setError(null);
      } catch (err) {
        console.error("Error fetching recruitment data:", err);
        setError("Failed to load recruitment data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Custom label formatter for pie charts
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius * 1.1;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    return (
      <text 
        x={x} 
        y={y} 
        fill="#333"
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
      >
        {`${name}: ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Generate candidate application status data for pie chart
  const generateCandidateStatusData = () => {
    const statusCounts = candidates.reduce((acc, candidate) => {
      const status = candidate.application_status || 'Unknown';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
    
    return Object.keys(statusCounts).map(status => ({
      name: status,
      value: statusCounts[status]
    }));
  };

  // Generate interview status data for pie chart
  const generateInterviewStatusData = () => {
    const statusCounts = interviews.reduce((acc, interview) => {
      const status = interview.status || 'Unknown';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
    
    return Object.keys(statusCounts).map(status => ({
      name: status,
      value: statusCounts[status]
    }));
  };

  // Generate interview ratings data for bar chart
  const generateInterviewRatingsData = () => {
    const ratingCounts = interviews.reduce((acc, interview) => {
      const rating = interview.rating;
      if (rating) {
        acc[rating] = (acc[rating] || 0) + 1;
      }
      return acc;
    }, {});
    
    return Object.keys(ratingCounts)
      .map(rating => ({
        rating: parseInt(rating),
        count: ratingCounts[rating],
        label: getRatingLabel(parseInt(rating))
      }))
      .sort((a, b) => a.rating - b.rating);
  };

  // Rating label mapping
  const getRatingLabel = (rating) => {
    const labels = {
      1: "Poor",
      2: "Fair",
      3: "Good",
      4: "Very Good",
      5: "Excellent"
    };
    return labels[rating] || `Rating ${rating}`;
  };

  // Generate top positions data
  const generateTopPositionsData = () => {
    const positionCounts = candidates.reduce((acc, candidate) => {
      const position = candidate.position_title || 'Unknown';
      acc[position] = (acc[position] || 0) + 1;
      return acc;
    }, {});
    
    return Object.keys(positionCounts)
      .map(position => ({
        name: position,
        count: positionCounts[position]
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  // Generate interview performance radar chart data
  const generateInterviewPerformanceData = () => {
    // Create mock criteria scores from ratings
    // In a real app, this would come from detailed interview feedback
    const interviewers = [...new Set(interviews.map(i => i.interviewer_name))];
    
    return interviewers.slice(0, 5).map(interviewer => {
      const interviewerData = interviews.filter(i => i.interviewer_name === interviewer);
      const avgRating = interviewerData.length > 0 ? 
        interviewerData.reduce((sum, i) => sum + (i.rating || 0), 0) / interviewerData.length : 0;
        
      return {
        interviewer,
        rating: avgRating,
        interviews: interviewerData.length,
        // Generate some mock criteria based on the rating
        technicalAssessment: Math.min(5, avgRating + (Math.random() * 0.6 - 0.3)),
        culturalFit: Math.min(5, avgRating + (Math.random() * 0.6 - 0.3)),
        communication: Math.min(5, avgRating + (Math.random() * 0.6 - 0.3)),
        problemSolving: Math.min(5, avgRating + (Math.random() * 0.6 - 0.3)),
        teamwork: Math.min(5, avgRating + (Math.random() * 0.6 - 0.3))
      };
    });
  };

  // If loading, show a loading spinner
  if (loading) {
    return (
      <div className="recruitment-loading">
        <div className="recruitment-spinner"></div>
        <p>Loading recruitment data...</p>
      </div>
    );
  }

  // If error, show an error message
  if (error) {
    return (
      <div className="recruitment-error">
        <i className="fas fa-exclamation-triangle"></i>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="recruitment-analytics-container">
      {/* Interview Analytics Section */}
      <div className="recruitment-section">
        <div className="section-header">
          <h2><i className="fas fa-chart-bar"></i> Interview Analytics</h2>
          <button 
            className="view-all-btn" 
            onClick={() => navigateTo('/recruitment')}
          >
            View All Interviews <i className="fas fa-arrow-right"></i>
          </button>
        </div>
        
        <div className="interview-analytics-grid">
          {/* Interview Ratings Bar Chart */}
          <div className="chart-container">
            <h3>Interview Ratings Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={generateInterviewRatingsData()}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                {renderGradientDefs()}
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name, props) => [`${value} interviews`, `${props.payload.label}`]}
                  labelFormatter={() => 'Rating Details'}
                />
                <Bar dataKey="count" name="Interviews">
                  {generateInterviewRatingsData().map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={`url(#ratingGradient-${entry.rating})`} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          {/* Interview Status Pie Chart */}
          <div className="chart-container">
            <h3>Interview Status Overview</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                {renderGradientDefs()}
                <Pie
                  data={generateInterviewStatusData()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {generateInterviewStatusData().map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={`url(#${statusGradients[index]})`} 
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value} interviews`, name]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          {/* Interview Performance Radar Chart */}
          <div className="chart-container wide">
            <h3>Interviewer Performance</h3>
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart outerRadius={90} data={generateInterviewPerformanceData()[0] ? 
                [{
                  subject: "Technical",
                  A: generateInterviewPerformanceData()[0].technicalAssessment,
                  fullMark: 5
                },
                {
                  subject: "Cultural Fit",
                  A: generateInterviewPerformanceData()[0].culturalFit,
                  fullMark: 5
                },
                {
                  subject: "Communication",
                  A: generateInterviewPerformanceData()[0].communication,
                  fullMark: 5
                },
                {
                  subject: "Problem Solving",
                  A: generateInterviewPerformanceData()[0].problemSolving,
                  fullMark: 5
                },
                {
                  subject: "Teamwork",
                  A: generateInterviewPerformanceData()[0].teamwork,
                  fullMark: 5
                }] : []}>
                {renderGradientDefs()}
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 5]} />
                <Radar name="Interviewer" dataKey="A" stroke={kinetiqColors.primary} 
                  fill={`url(#${radarGradient})`} />
                <Tooltip />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Candidate Pipeline Section */}
      <div className="recruitment-section">
        <div className="section-header">
          <h2><i className="fas fa-user-tie"></i> Candidate Pipeline</h2>
          <button 
            className="view-all-btn" 
            onClick={() => navigateTo('/recruitment')}
          >
            View All Candidates <i className="fas fa-arrow-right"></i>
          </button>
        </div>
        
        <div className="candidate-pipeline-grid">
          {/* Application Status Pie Chart */}
          <div className="chart-container">
            <h3>Application Status</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                {renderGradientDefs()}
                <Pie
                  data={generateCandidateStatusData()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {generateCandidateStatusData().map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={`url(#${statusGradients[index]})`} 
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value} candidates`, name]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          {/* Top Positions Bar Chart */}
          <div className="chart-container">
            <h3>Top Positions</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                layout="vertical"
                data={generateTopPositionsData()}
                margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
              >
                {renderGradientDefs()}
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={80} />
                <Tooltip formatter={(value) => [`${value} candidates`, 'Applications']} />
                <Bar dataKey="count" fill={`url(#positionGradient-0)`} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          {/* High Potential Candidates List */}
          <div className="chart-container wide">
            <h3>High Potential Candidates</h3>
            <div className="high-potential-list">
              {interviews
                .filter(i => i.rating >= 4)
                .slice(0, 5)
                .map(interview => {
                  const candidate = candidates.find(c => c.candidate_id === interview.candidate_id);
                  return (
                    <div key={interview.interview_id} className="high-potential-item">
                      <div className="candidate-info">
                        <div className="candidate-avatar">
                          <i className="fas fa-user-circle"></i>
                        </div>
                        <div className="candidate-details">
                          <h4>{candidate ? `${candidate.first_name} ${candidate.last_name}` : 'Unknown'}</h4>
                          <p>{candidate ? candidate.position_title : 'Unknown Position'}</p>
                        </div>
                      </div>
                      <div className="rating-info">
                        <div className="rating-score">
                          <span>{interview.rating}/5</span>
                        </div>
                        <div className="rating-stars">
                          {[1, 2, 3, 4, 5].map(star => (
                            <i key={star} className={`fas fa-star ${star <= interview.rating ? 'filled' : ''}`}></i>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruitmentAnalytics;