import React, { useState, useEffect } from "react";
import axios from "axios";

const EmployeePerformanceTable = ({ onViewAll }) => {
  const [performanceData, setPerformanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Define rating labels
  const RATING_LABELS = {
    5: "Outstanding",
    4: "Very Satisfactory",
    3: "Satisfactory",
    2: "Fair",
    1: "Poor"
  };

  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("https://1wj5891jxg.execute-api.ap-southeast-1.amazonaws.com/dev/api/employee_performance/employee_performance/");
        
        if (response.data && Array.isArray(response.data)) {
          // Sort by review date (newest first) and take top 5
          const sortedData = response.data.sort((a, b) => 
            new Date(b.review_date || '2000-01-01') - new Date(a.review_date || '2000-01-01')
          ).slice(0, 5);
          
          setPerformanceData(sortedData);
          setError(null);
        } else {
          console.error("Invalid data format:", response.data);
          setError("Invalid data format received");
        }
      } catch (err) {
        console.error("Failed to fetch performance data:", err);
        setError("Failed to load performance data");
      } finally {
        setLoading(false);
      }
    };

    fetchPerformanceData();
  }, []);

  return (
    <div className="hr-candidates-section">
      <div className="hr-section-header">
        <h3><strong>Employee Performance</strong></h3>
        <button 
          className="hr-view-all-btn" 
          onClick={onViewAll}
        >
          View All
        </button>
      </div>
      <div className="hr-performance-table-container">
        <table>
          <thead>
            <tr>
              <th>Employee Name</th>
              <th>Rating</th>
              <th>Review Date</th>
            </tr>
          </thead>
          <tbody className="hr-performance-tbody">
            {loading ? (
              <tr>
                <td colSpan="3" style={{textAlign: "center"}}>Loading performance data...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="3" style={{textAlign: "center"}}>{error}</td>
              </tr>
            ) : performanceData.length === 0 ? (
              <tr>
                <td colSpan="3" style={{textAlign: "center"}}>No performance records found</td>
              </tr>
            ) : (
              performanceData.map((perf) => (
                <tr key={perf.performance_id}>
                  <td>{perf.employee_name}</td>
                  <td>
                    <span className={`hr-tag rating-${perf.rating}`}>
                      {RATING_LABELS[perf.rating] || perf.rating}
                    </span>
                  </td>
                  <td>{perf.review_date}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeePerformanceTable;