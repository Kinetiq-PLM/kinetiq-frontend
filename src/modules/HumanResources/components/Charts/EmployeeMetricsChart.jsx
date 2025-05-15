import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const EmployeeMetricsChart = ({ data }) => {
  const chartRef = useRef(null);
  let chartInstance = null;

  useEffect(() => {
    if (chartRef.current) {
      // Destroy existing chart to prevent memory leaks
      if (chartInstance) {
        chartInstance.destroy();
      }

      // Create new chart
      const ctx = chartRef.current.getContext('2d');
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Present', 'Absent', 'Late', 'On Leave'],
          datasets: [{
            label: 'Employee Metrics',
            data: [data.present, data.absent, data.late, data.onLeave],
            backgroundColor: [
              'rgba(0, 169, 172, 0.7)',
              'rgba(249, 166, 2, 0.7)',
              'rgba(255, 99, 132, 0.7)',
              'rgba(54, 162, 235, 0.7)'
            ],
            borderColor: [
              'rgba(0, 169, 172, 1)',
              'rgba(249, 166, 2, 1)',
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Daily Employee Attendance'
            }
          }
        }
      });
    }
    
    // Clean up on unmount
    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, [data]);

  return (
    <div className="hr-chart-wrapper">
      <canvas ref={chartRef} />
    </div>
  );
};

export default EmployeeMetricsChart;