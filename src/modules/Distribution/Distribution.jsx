// Distribution.jsx - Enhanced Dashboard for Distribution Module
import React, { useState, useEffect, useRef } from "react";
import "./styles/Distribution.css";
import { 
  TrendingUp, 
  Package, 
  Truck, 
  Calendar, 
  Users, 
  AlertCircle, 
  Box, 
  Search,
  CheckCircle,
  BarChart2,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  MapPin,
  Clock,
  DollarSign,
  Filter,
  ChevronsUp,
  ChevronsDown,
  Target,
  Award,
  ThumbsUp,
  Zap,
  TrendingDown,
  Activity,
  FileText,
  Layers,
  RefreshCw,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Chart, ArcElement, LineElement, BarElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, DoughnutController, LineController, BarController, RadialLinearScale, BarController as BarControllerRadial, RadarController, ScatterController } from 'chart.js';

// Register Chart.js components
Chart.register(
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  DoughnutController,
  LineController,
  BarController,
  RadialLinearScale,
  BarControllerRadial,
  RadarController,
  ScatterController
);

// Add gradient plugin for charts
const gradientPlugin = {
  id: 'customCanvasBackgroundColor',
  beforeDraw: (chart, args, options) => {
    if (options.color) {
      const {ctx} = chart;
      ctx.save();
      ctx.globalCompositeOperation = 'destination-over';
      ctx.fillStyle = options.color;
      ctx.fillRect(0, 0, chart.width, chart.height);
      ctx.restore();
    }
  }
};

Chart.register(gradientPlugin);

const Distribution = ({ loadSubModule, setActiveSubModule }) => {
  // Chart refs - Enhanced with more charts
  const onTimeDeliveryChartRef = useRef(null);
  const fulfillmentTimeChartRef = useRef(null);
  const returnRateChartRef = useRef(null);
  const statusDistributionChartRef = useRef(null);
  const deliveryTrendChartRef = useRef(null);
  const carrierPerformanceChartRef = useRef(null);
  const costEfficiencyChartRef = useRef(null);
  const deliveryDistanceChartRef = useRef(null);
  const timeOfDayChartRef = useRef(null);
  const accuracyChartRef = useRef(null);
  const regionalPerformanceChartRef = useRef(null);
  const processingTimeBreakdownChartRef = useRef(null);
  const customerSatisfactionChartRef = useRef(null);
  const topProductsChartRef = useRef(null);
  
  // State for data management - Enhanced with additional metrics
  const [dashboardData, setDashboardData] = useState({
    metrics: {
      totalDeliveries: 0,
      pendingDeliveries: 0,
      completedDeliveries: 0,
      inTransit: 0,
      failedDeliveries: 0,
      totalCost: 0,
      totalDistance: 0,
      totalWeight: 0,
      deliveryAccuracy: 0,
      customerSatisfaction: 0,
    },
    recentDeliveries: [],
    performanceMetrics: {
      onTimeDeliveryRate: 0,
      averageFulfillmentTime: 0,
      returnRate: 0,
      carrierPerformance: [],
      costPerDelivery: 0,
      avgDeliveryDistance: 0,
      avgDeliveryWeight: 0,
      weekOverWeekChange: 0,
      monthOverMonthChange: 0,
      timeToResolveIssues: 0,
      timeOfDayDistribution: [],
      deliveryAccuracyTrend: [],
      customerSatisfactionScore: 0,
      customerSatisfactionTrend: [],
      topPerformingRegions: [],
      bottomPerformingRegions: [],
    },
    pendingActivities: [],
    statusBreakdown: {
      pending: 0,
      inProgress: 0,
      shipped: 0,
      delivered: 0,
      failed: 0,
      reworks: 0
    },
    deliveryTrends: {
      labels: [],
      counts: []
    },
    processingTimeBreakdown: {
      picking: 0,
      packing: 0,
      shipping: 0,
      delivery: 0,
      total: 0
    },
    costBreakdown: {
      packaging: 0,
      shipping: 0,
      handling: 0,
      fuel: 0,
      other: 0
    },
    distanceBreakdown: {
      local: 0,
      regional: 0,
      national: 0,
      international: 0
    },
    topProducts: [],
    insights: []
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [timeRange, setTimeRange] = useState("week"); // today, week, month, quarter, year
  const [compareWithPrevious, setCompareWithPrevious] = useState(true);
  const [expandedSections, setExpandedSections] = useState({
    keyMetrics: true,
    performanceOverview: true,
    deliveryAnalysis: true,
    carrierAnalysis: false,
    customerSatisfaction: false,
    processingTime: false,
    costAnalysis: false
  });

  // Toggle expanded sections
  const toggleSection = (section) => {
    const newExpandedState = !expandedSections[section];
    
    setExpandedSections({
      ...expandedSections,
      [section]: newExpandedState
    });
    
    // Reinitialize charts when expanding relevant sections
    if (newExpandedState) {
      // Only reinitialize if expanding (not collapsing)
      setTimeout(() => {
        if (section === 'performanceOverview' || section === 'deliveryAnalysis' || 
            section === 'carrierAnalysis' || section === 'customerSatisfaction' || 
            section === 'processingTime' || section === 'costAnalysis') {
          initializeCharts(dashboardData);
        }
      }, 50); // Small timeout to ensure DOM elements are rendered
    }
  };

  // Handle navigation to submodule
  const navigateToSubmodule = (submoduleId) => {
    if (setActiveSubModule && loadSubModule) {
      setActiveSubModule(submoduleId);
      loadSubModule(submoduleId);
    }
  };

  // Helper for creating gradient backgrounds
  const createGradient = (ctx, startColor, endColor) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, startColor);
    gradient.addColorStop(1, endColor);
    return gradient;
  };

  // Initialize charts function - Enhanced with better chart configurations
  const initializeCharts = (data) => {
    // Destroy existing charts if they exist
    const chartRefs = [
      onTimeDeliveryChartRef, 
      fulfillmentTimeChartRef, 
      returnRateChartRef, 
      statusDistributionChartRef,
      deliveryTrendChartRef,
      carrierPerformanceChartRef,
      costEfficiencyChartRef,
      deliveryDistanceChartRef,
      timeOfDayChartRef,
      accuracyChartRef,
      regionalPerformanceChartRef,
      processingTimeBreakdownChartRef,
      customerSatisfactionChartRef,
      topProductsChartRef
    ];
    
    chartRefs.forEach(ref => {
      if (ref.current) {
        const chartInstance = Chart.getChart(ref.current);
        if (chartInstance) {
          chartInstance.destroy();
        }
      }
    });
    
    // Create On-Time Delivery Rate Gauge Chart - Enhanced with threshold indicators
    if (onTimeDeliveryChartRef.current) {
      const ctx = onTimeDeliveryChartRef.current.getContext('2d');
      const onTimeRate = parseFloat(data.performanceMetrics.onTimeDeliveryRate);
      const gradient = createGradient(ctx, 'rgba(40, 167, 69, 0.6)', 'rgba(40, 167, 69, 0.1)');
      
      new Chart(onTimeDeliveryChartRef.current, {
        type: 'doughnut',
        data: {
          labels: ['On-Time', 'Late'],
          datasets: [{
            data: [onTimeRate, 100 - onTimeRate],
            backgroundColor: [gradient, '#e9ecef'],
            borderWidth: 0,
            cutout: '75%',
            borderRadius: 5
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            tooltip: {
              callbacks: {
                label: function(context) {
                  return context.label + ': ' + context.raw + '%';
                }
              }
            },
            legend: {
              display: false
            }
          }
        }
      });
      
      // Add target indicator annotation
      // This would typically be done using Chart.js annotation plugin,
      // but we'll simulate it with a separate canvas overlay in a real implementation
    }
    
    // Create Average Fulfillment Time Chart - Enhanced with historical comparison
    if (fulfillmentTimeChartRef.current) {
      const ctx = fulfillmentTimeChartRef.current.getContext('2d');
      const avgTime = parseFloat(data.performanceMetrics.averageFulfillmentTime);
      
      // Generate simulated historical data (last 6 periods)
      const labels = ['6 periods ago', '5 periods ago', '4 periods ago', '3 periods ago', '2 periods ago', 'Current'];
      
      // Current period data
      const simulatedCurrentData = [
        avgTime * (1 + Math.random() * 0.3),
        avgTime * (1 + Math.random() * 0.2),
        avgTime * (1 + Math.random() * 0.1),
        avgTime * (1 - Math.random() * 0.05),
        avgTime * (1 - Math.random() * 0.1),
        avgTime
      ].map(val => parseFloat(val.toFixed(1)));
      
      // Previous period data for comparison
      const simulatedPreviousData = [
        avgTime * (1 + Math.random() * 0.4),
        avgTime * (1 + Math.random() * 0.35),
        avgTime * (1 + Math.random() * 0.3),
        avgTime * (1 + Math.random() * 0.25),
        avgTime * (1 + Math.random() * 0.2),
        avgTime * (1 + Math.random() * 0.15)
      ].map(val => parseFloat(val.toFixed(1)));
      
      // Target line
      const targetTime = avgTime * 0.85; // Example target: 15% faster than current avg
      const targetData = Array(labels.length).fill(targetTime);
      
      const gradient = createGradient(ctx, 'rgba(0, 168, 168, 0.6)', 'rgba(0, 168, 168, 0.1)');
      
      new Chart(fulfillmentTimeChartRef.current, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Current Period',
              data: simulatedCurrentData,
              borderColor: '#00a8a8',
              backgroundColor: gradient,
              tension: 0.2,
              fill: true
            },
            {
              label: 'Previous Period',
              data: compareWithPrevious ? simulatedPreviousData : [],
              borderColor: '#aaa',
              borderDash: [5, 5],
              backgroundColor: 'transparent',
              tension: 0.2,
              fill: false
            },
            {
              label: 'Target',
              data: targetData,
              borderColor: '#28a745',
              borderDash: [3, 3],
              borderWidth: 2,
              pointRadius: 0,
              fill: false
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: {
                boxWidth: 12,
                font: { size: 10 }
              }
            },
            tooltip: {
              mode: 'index',
              intersect: false
            }
          },
          scales: {
            y: {
              beginAtZero: false,
              title: {
                display: true,
                text: 'Days'
              }
            }
          }
        }
      });
    }
    
    // Create Return Rate Gauge Chart - Enhanced with better visuals
    if (returnRateChartRef.current) {
      const ctx = returnRateChartRef.current.getContext('2d');
      const returnRate = parseFloat(data.performanceMetrics.returnRate);
      
      // Create gradient for accepted (green)
      const acceptedGradient = createGradient(ctx, 'rgba(40, 167, 69, 0.6)', 'rgba(40, 167, 69, 0.1)');
      
      // Create gradient for rejected (red)
      const rejectedGradient = createGradient(ctx, 'rgba(220, 53, 69, 0.6)', 'rgba(220, 53, 69, 0.1)');
      
      new Chart(returnRateChartRef.current, {
        type: 'doughnut',
        data: {
          labels: ['Accepted', 'Rejected'],
          datasets: [{
            data: [100 - returnRate, returnRate],
            backgroundColor: [acceptedGradient, rejectedGradient],
            borderWidth: 0,
            cutout: '75%',
            borderRadius: 5
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            tooltip: {
              callbacks: {
                label: function(context) {
                  return context.label + ': ' + context.raw + '%';
                }
              }
            },
            legend: {
              display: false
            }
          }
        }
      });
    }
    
    // Create Status Distribution Chart - Enhanced with better colors and animation
    if (statusDistributionChartRef.current) {
      const { statusBreakdown } = data;
      
      new Chart(statusDistributionChartRef.current, {
        type: 'doughnut',
        data: {
          labels: ['Picking', 'Packing', 'Shipping', 'Delivered', 'Failed', 'Reworks'],
          datasets: [{
            data: [
              statusBreakdown.picking || 0,
              statusBreakdown.packing || 0,
              statusBreakdown.shipping || 0,
              statusBreakdown.delivered || 0,
              statusBreakdown.failed || 0,
              statusBreakdown.reworks || 0
            ],
            backgroundColor: [
              '#e9609b', // Picking
              '#5f27cd', // Packing
              '#00a8a8', // Shipping
              '#28a745', // Delivered
              '#dc3545', // Failed
              '#e38e05'  // Reworks
            ],
            borderWidth: 1,
            borderColor: '#ffffff',
            hoverOffset: 15,
            borderRadius: 3
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right',
              labels: {
                boxWidth: 12,
                font: {
                  size: 10
                }
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  const percentage = Math.round((context.raw / total) * 100);
                  return `${context.label}: ${context.raw} (${percentage}%)`;
                }
              }
            }
          },
          animation: {
            animateRotate: true,
            animateScale: true
          }
        }
      });
    }
    
    // Create Delivery Trend Chart - Enhanced with comparison
    if (deliveryTrendChartRef.current) {
      const ctx = deliveryTrendChartRef.current.getContext('2d');
      const { deliveryTrends } = data;
      
      // Generate previous period data for comparison
      const previousPeriod = deliveryTrends.counts.map(count => 
        Math.max(0, count * (1 + (Math.random() > 0.5 ? 1 : -1) * Math.random() * 0.3))
      );
      
      const gradient = createGradient(ctx, 'rgba(0, 168, 168, 0.8)', 'rgba(0, 168, 168, 0.1)');
      const prevGradient = createGradient(ctx, 'rgba(108, 117, 125, 0.6)', 'rgba(108, 117, 125, 0.1)');
      
      new Chart(deliveryTrendChartRef.current, {
        type: 'bar',
        data: {
          labels: deliveryTrends.labels,
          datasets: [
            {
              label: 'Current Period',
              data: deliveryTrends.counts,
              backgroundColor: gradient,
              borderColor: 'rgba(0, 168, 168, 1)',
              borderWidth: 1,
              borderRadius: 4,
              categoryPercentage: 0.6,
              barPercentage: 0.8
            },
            {
              label: 'Previous Period',
              data: compareWithPrevious ? previousPeriod : [],
              backgroundColor: prevGradient,
              borderColor: 'rgba(108, 117, 125, 1)',
              borderWidth: 1,
              borderRadius: 4,
              categoryPercentage: 0.6,
              barPercentage: 0.8
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: {
                boxWidth: 12,
                font: { size: 10 }
              }
            },
            tooltip: {
              mode: 'index',
              intersect: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Count'
              }
            }
          }
        }
      });
    }
    
    // Create Carrier Performance Chart - Enhanced with benchmarks
    if (carrierPerformanceChartRef.current) {
      const { carrierPerformance } = data.performanceMetrics;
      
      if (carrierPerformance && carrierPerformance.length > 0) {
        // Calculate industry average (simulated)
        const industryAvg = 85; // Example industry benchmark
        
        new Chart(carrierPerformanceChartRef.current, {
          type: 'bar',
          data: {
            labels: carrierPerformance.map(c => c.name),
            datasets: [
              {
                label: 'On-Time Rate (%)',
                data: carrierPerformance.map(c => c.onTimeRate),
                backgroundColor: carrierPerformance.map(c => 
                  c.onTimeRate >= 90 ? 'rgba(40, 167, 69, 0.8)' :
                  c.onTimeRate >= 70 ? 'rgba(255, 193, 7, 0.8)' :
                  'rgba(220, 53, 69, 0.8)'
                ),
                borderColor: carrierPerformance.map(c => 
                  c.onTimeRate >= 90 ? 'rgba(40, 167, 69, 1)' :
                  c.onTimeRate >= 70 ? 'rgba(255, 193, 7, 1)' :
                  'rgba(220, 53, 69, 1)'
                ),
                borderWidth: 1,
                borderRadius: 4
              },
              {
                label: 'Industry Average',
                data: Array(carrierPerformance.length).fill(industryAvg),
                type: 'line',
                borderColor: '#aaa',
                borderDash: [5, 5],
                borderWidth: 2,
                fill: false,
                pointRadius: 0
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: true,
                position: 'top',
                labels: {
                  boxWidth: 12,
                  font: { size: 10 }
                }
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    if (context.datasetIndex === 0) {
                      const carrier = carrierPerformance[context.dataIndex];
                      return `${context.dataset.label}: ${context.raw}% (${carrier.onTimeDeliveries}/${carrier.totalShipments})`;
                    }
                    return `${context.dataset.label}: ${context.raw}%`;
                  }
                }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                max: 100,
                title: {
                  display: true,
                  text: 'On-Time %'
                }
              }
            }
          }
        });
      }
    }
    
    // NEW CHART: Cost Efficiency Chart
    if (costEfficiencyChartRef.current) {
      const ctx = costEfficiencyChartRef.current.getContext('2d');
      
      // Simulate cost efficiency data (cost per delivery over time)
      const costLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      const costData = [12.5, 11.8, 12.2, 10.9, 10.5, 9.8];
      const targetCost = 10.0;
      
      const gradient = createGradient(ctx, 'rgba(94, 114, 228, 0.6)', 'rgba(94, 114, 228, 0.1)');
      
      new Chart(costEfficiencyChartRef.current, {
        type: 'line',
        data: {
          labels: costLabels,
          datasets: [
            {
              label: 'Cost per Delivery ($)',
              data: costData,
              borderColor: '#5e72e4',
              backgroundColor: gradient,
              tension: 0.3,
              fill: true
            },
            {
              label: 'Target Cost',
              data: Array(costLabels.length).fill(targetCost),
              borderColor: '#fb6340',
              borderDash: [5, 5],
              borderWidth: 2,
              pointRadius: 0,
              fill: false
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: {
                boxWidth: 12,
                font: { size: 10 }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: false,
              title: {
                display: true,
                text: 'Cost ($)'
              }
            }
          }
        }
      });
    }
    
    // NEW CHART: Delivery Distance Distribution
    if (deliveryDistanceChartRef.current) {
      // Simulate distance distribution
      const distanceData = {
        labels: ['0-5 miles', '5-10 miles', '10-20 miles', '20-50 miles', '50+ miles'],
        datasets: [{
          label: 'Number of Deliveries',
          data: [45, 32, 28, 15, 8],
          backgroundColor: [
            'rgba(111, 66, 193, 0.7)',
            'rgba(153, 102, 255, 0.7)',
            'rgba(201, 203, 207, 0.7)',
            'rgba(54, 162, 235, 0.7)',
            'rgba(75, 192, 192, 0.7)'
          ],
          borderColor: [
            'rgb(111, 66, 193)',
            'rgb(153, 102, 255)',
            'rgb(201, 203, 207)',
            'rgb(54, 162, 235)',
            'rgb(75, 192, 192)'
          ],
          borderWidth: 1,
          borderRadius: 4
        }]
      };
      
      new Chart(deliveryDistanceChartRef.current, {
        type: 'bar',
        data: distanceData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  const percentage = Math.round((context.raw / total) * 100);
                  return `${context.raw} deliveries (${percentage}%)`;
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Number of Deliveries'
              }
            }
          }
        }
      });
    }
    
    // NEW CHART: Time of Day Distribution
    if (timeOfDayChartRef.current) {
      // Simulate time of day distribution
      const timeLabels = ['6-9 AM', '9-12 PM', '12-3 PM', '3-6 PM', '6-9 PM'];
      const timeData = [15, 30, 25, 20, 10];
      
      new Chart(timeOfDayChartRef.current, {
        type: 'radar',
        data: {
          labels: timeLabels,
          datasets: [{
            label: 'Deliveries',
            data: timeData,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgb(75, 192, 192)',
            pointBackgroundColor: 'rgb(75, 192, 192)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(75, 192, 192)'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          elements: {
            line: {
              borderWidth: 3
            }
          },
          scales: {
            r: {
              angleLines: {
                display: true
              },
              suggestedMin: 0
            }
          }
        }
      });
    }
    
    // NEW CHART: Delivery Accuracy Trend
    if (accuracyChartRef.current) {
      // Simulate accuracy trend
      const accuracyLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      const accuracyData = [97.2, 97.5, 98.1, 98.3, 98.7, 99.1];
      const targetAccuracy = 99.5;
      
      new Chart(accuracyChartRef.current, {
        type: 'line',
        data: {
          labels: accuracyLabels,
          datasets: [
            {
              label: 'Delivery Accuracy (%)',
              data: accuracyData,
              borderColor: 'rgb(54, 162, 235)',
              backgroundColor: 'rgba(54, 162, 235, 0.5)',
              tension: 0.2,
              fill: true
            },
            {
              label: 'Target',
              data: Array(accuracyLabels.length).fill(targetAccuracy),
              borderColor: '#28a745',
              borderDash: [5, 5],
              borderWidth: 2,
              pointRadius: 0,
              fill: false
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: {
                boxWidth: 12,
                font: { size: 10 }
              }
            }
          },
          scales: {
            y: {
              min: 95,
              max: 100,
              title: {
                display: true,
                text: 'Accuracy (%)'
              }
            }
          }
        }
      });
    }
    
    // NEW CHART: Regional Performance Map or Chart
    if (regionalPerformanceChartRef.current) {
      // Simulate regional performance data
      const regions = ['North', 'South', 'East', 'West', 'Central'];
      const onTimeRates = [92.5, 87.3, 94.6, 89.8, 91.2];
      const returnRates = [2.1, 4.5, 1.8, 3.2, 2.6];
      
      new Chart(regionalPerformanceChartRef.current, {
        type: 'bar',
        data: {
          labels: regions,
          datasets: [
            {
              label: 'On-Time Rate (%)',
              data: onTimeRates,
              backgroundColor: 'rgba(54, 162, 235, 0.7)',
              borderColor: 'rgb(54, 162, 235)',
              borderWidth: 1,
              borderRadius: 4,
              yAxisID: 'y'
            },
            {
              label: 'Return Rate (%)',
              data: returnRates,
              backgroundColor: 'rgba(255, 99, 132, 0.7)',
              borderColor: 'rgb(255, 99, 132)',
              borderWidth: 1,
              borderRadius: 4,
              yAxisID: 'y1'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: {
                boxWidth: 12,
                font: { size: 10 }
              }
            }
          },
          scales: {
            y: {
              type: 'linear',
              display: true,
              position: 'left',
              title: {
                display: true,
                text: 'On-Time Rate (%)'
              },
              min: 80,
              max: 100
            },
            y1: {
              type: 'linear',
              display: true,
              position: 'right',
              title: {
                display: true,
                text: 'Return Rate (%)'
              },
              min: 0,
              max: 10,
              grid: {
                drawOnChartArea: false
              }
            }
          }
        }
      });
    }
    
    // NEW CHART: Processing Time Breakdown
    if (processingTimeBreakdownChartRef.current) {
      const { processingTimeBreakdown } = data;
      
      // Create stacked bar chart for time breakdown
      new Chart(processingTimeBreakdownChartRef.current, {
        type: 'bar',
        data: {
          labels: ['Average Delivery Timeline'],
          datasets: [
            {
              label: 'Picking',
              data: [processingTimeBreakdown.picking || 0.5],
              backgroundColor: '#e9609b',
              borderColor: '#e9609b',
              borderWidth: 1,
              borderRadius: {
                topLeft: 4,
                topRight: 0,
                bottomLeft: 4,
                bottomRight: 0
              }
            },
            {
              label: 'Packing',
              data: [processingTimeBreakdown.packing || 0.3],
              backgroundColor: '#5f27cd',
              borderColor: '#5f27cd',
              borderWidth: 1,
              borderRadius: 0
            },
            {
              label: 'Shipping',
              data: [processingTimeBreakdown.shipping || 1.2],
              backgroundColor: '#00a8a8',
              borderColor: '#00a8a8',
              borderWidth: 1,
              borderRadius: 0
            },
            {
              label: 'Delivery',
              data: [processingTimeBreakdown.delivery || 1.8],
              backgroundColor: '#28a745',
              borderColor: '#28a745', 
              borderWidth: 1,
              borderRadius: {
                topLeft: 0,
                topRight: 4,
                bottomLeft: 0,
                bottomRight: 4
              }
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          indexAxis: 'y',
          plugins: {
            legend: {
              position: 'top',
              labels: {
                boxWidth: 12,
                font: { size: 10 }
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return `${context.dataset.label}: ${context.raw} days`;
                }
              }
            }
          },
          scales: {
            x: {
              stacked: true,
              title: {
                display: true,
                text: 'Days'
              }
            },
            y: {
              stacked: true
            }
          }
        }
      });
    }
    
    // NEW CHART: Customer Satisfaction
    if (customerSatisfactionChartRef.current) {
      const ctx = customerSatisfactionChartRef.current.getContext('2d');
      
      // Simulate customer satisfaction trend
      const satisfactionLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      const satisfactionData = [4.2, 4.3, 4.3, 4.4, 4.5, 4.6];
      const gradient = createGradient(ctx, 'rgba(255, 159, 64, 0.6)', 'rgba(255, 159, 64, 0.1)');
      
      new Chart(customerSatisfactionChartRef.current, {
        type: 'line',
        data: {
          labels: satisfactionLabels,
          datasets: [{
            label: 'Customer Satisfaction (1-5)',
            data: satisfactionData,
            borderColor: 'rgb(255, 159, 64)',
            backgroundColor: gradient,
            tension: 0.3,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              min: 1,
              max: 5,
              title: {
                display: true,
                text: 'Rating (1-5)'
              }
            }
          }
        }
      });
    }
    
    // NEW CHART: Top Products
    if (topProductsChartRef.current) {
      // Simulate top products data
      const productsData = {
        labels: ['Product A', 'Product B', 'Product C', 'Product D', 'Product E'],
        datasets: [{
          label: 'Delivery Volume',
          data: [120, 95, 80, 75, 60],
          backgroundColor: [
            'rgba(54, 162, 235, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(153, 102, 255, 0.7)',
            'rgba(255, 159, 64, 0.7)',
            'rgba(255, 99, 132, 0.7)'
          ],
          borderColor: [
            'rgb(54, 162, 235)',
            'rgb(75, 192, 192)',
            'rgb(153, 102, 255)',
            'rgb(255, 159, 64)',
            'rgb(255, 99, 132)'
          ],
          borderWidth: 1,
          borderRadius: 4
        }]
      };
      
      new Chart(topProductsChartRef.current, {
        type: 'bar',
        data: productsData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          indexAxis: 'y',
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            x: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Number of Deliveries'
              }
            }
          }
        }
      });
    }
  };
  
  // Fetch dashboard data from APIs
  useEffect(() => {
    // Fetch data based on selected time range
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch data from all endpoints
        const [
          shipmentsResponse, 
          deliveryOrdersResponse,
          packingListsResponse,
          pickingListsResponse,
          reworksResponse
        ] = await Promise.all([
          fetch('https://r7d8au0l77.execute-api.ap-southeast-1.amazonaws.com/dev/api/shipments/'),
          fetch('https://r7d8au0l77.execute-api.ap-southeast-1.amazonaws.com/dev/api/delivery-orders/'),
          fetch('https://r7d8au0l77.execute-api.ap-southeast-1.amazonaws.com/dev/api/packing-lists/'),
          fetch('https://r7d8au0l77.execute-api.ap-southeast-1.amazonaws.com/dev/api/picking-lists/'),
          fetch('https://r7d8au0l77.execute-api.ap-southeast-1.amazonaws.com/dev/api/reworks/')
        ]);
        
        if (!shipmentsResponse.ok) throw new Error('Failed to fetch shipments');
        if (!deliveryOrdersResponse.ok) throw new Error('Failed to fetch delivery orders');
        if (!packingListsResponse.ok) throw new Error('Failed to fetch packing lists');
        if (!pickingListsResponse.ok) throw new Error('Failed to fetch picking lists');
        if (!reworksResponse.ok) throw new Error('Failed to fetch reworks');
        
        const shipments = await shipmentsResponse.json();
        const deliveryOrders = await deliveryOrdersResponse.json();
        const packingLists = await packingListsResponse.json();
        const pickingLists = await pickingListsResponse.json();
        const reworks = await reworksResponse.json();
        
        // Process metrics from shipments
        const totalDeliveries = shipments.length;
        const pendingDeliveries = shipments.filter(s => s.shipment_status === 'Pending').length;
        const inTransit = shipments.filter(s => s.shipment_status === 'Shipped').length;
        const completedDeliveries = shipments.filter(s => s.shipment_status === 'Delivered').length;
        const failedDeliveries = shipments.filter(s => s.shipment_status === 'Failed').length;
        
        // Calculate performance metrics
        const onTimeDeliveries = shipments.filter(s => 
          s.shipment_status === 'Delivered' && 
          s.actual_arrival_date && s.estimated_arrival_date &&
          new Date(s.actual_arrival_date) <= new Date(s.estimated_arrival_date)
        ).length;
        
        const deliveredShipments = shipments.filter(s => s.shipment_status === 'Delivered');
        const onTimeDeliveryRate = deliveredShipments.length > 0 
          ? ((onTimeDeliveries / deliveredShipments.length) * 100).toFixed(1)
          : 0;
        
        // Calculate average fulfillment time
        let totalFulfillmentDays = 0;
        let countWithBothDates = 0;
        
        for (const shipment of deliveredShipments) {
          if (shipment.shipment_date && shipment.actual_arrival_date) {
            const startDate = new Date(shipment.shipment_date);
            const endDate = new Date(shipment.actual_arrival_date);
            const diffTime = Math.abs(endDate - startDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            totalFulfillmentDays += diffDays;
            countWithBothDates++;
          }
        }
        
        const averageFulfillmentTime = countWithBothDates > 0 
          ? (totalFulfillmentDays / countWithBothDates).toFixed(1)
          : 0;
        
        // Calculate return rate
        const rejectedDeliveries = shipments.filter(s => 
          s.delivery_receipt_info && s.delivery_receipt_info.receipt_status === 'Rejected'
        ).length;
        
        const returnRate = totalDeliveries > 0 
          ? ((rejectedDeliveries / totalDeliveries) * 100).toFixed(1)
          : 0;
        
        // Calculate carrier performance
        const carrierPerformance = calculateCarrierPerformance(shipments);
        
        // Process costs (simulated for demonstration)
        const costData = simulateCostData(shipments);
        
        // Calculate customer satisfaction (simulated)
        const customerSatisfaction = simulateCustomerSatisfaction();
        
        // Calculate delivery distances (simulated)
        const distanceData = simulateDistanceData(shipments);
        
        // Calculate processing time breakdown (simulated)
        const processingTimeBreakdown = {
          picking: 0.5,   // days
          packing: 0.3,   // days
          shipping: 1.2,  // days
          delivery: 1.8,  // days
          total: 3.8      // days
        };
        
        // Simulate week-over-week and month-over-month changes
        const wowChange = (Math.random() * 20 - 10).toFixed(1); // -10% to +10%
        const momChange = (Math.random() * 30 - 10).toFixed(1); // -10% to +20%
        
        // Create insights based on metrics
        const insights = generateInsights({
          onTimeDeliveryRate,
          returnRate,
          averageFulfillmentTime,
          wowChange,
          momChange,
          costPerDelivery: costData.costPerDelivery
        });
        
        // Create recent deliveries for display (from shipments)
        const recentDeliveries = shipments
          .sort((a, b) => {
            // Sort by shipment date descending (newest first)
            const dateA = a.shipment_date ? new Date(a.shipment_date) : new Date(0);
            const dateB = b.shipment_date ? new Date(b.shipment_date) : new Date(0);
            return dateB - dateA;
          })
          .slice(0, 10) // Get top 10
          .map(shipment => ({
            id: shipment.shipment_id,
            date: shipment.shipment_date || 'N/A',
            destination: shipment.destination_location || 'Unknown',
            items: shipment.packing_list_info?.total_items_packed || 0,
            status: shipment.shipment_status,
            priority: getPriorityFromShipment(shipment),
            type: getShipmentType(shipment),
            carrier: shipment.carrier_name || 'N/A',
            cost: generateRandomCost(shipment), // Simulated for demo
            distance: generateRandomDistance(shipment) // Simulated for demo
          }));
        
        // Status breakdown for all activities
        const pendingPickings = pickingLists.filter(p => p.picked_status === 'Not Started').length;
        const inProgressPickings = pickingLists.filter(p => p.picked_status === 'In Progress').length;
        const pendingPackings = packingLists.filter(p => p.packing_status === 'Pending').length;
        const pendingShipments = shipments.filter(s => s.shipment_status === 'Pending').length;
        const shippedShipments = shipments.filter(s => s.shipment_status === 'Shipped').length;
        const deliveredShipmentCount = shipments.filter(s => s.shipment_status === 'Delivered').length;
        const failedShipmentCount = shipments.filter(s => s.shipment_status === 'Failed').length;
        const pendingReworks = reworks.filter(r => r.rework_status === 'Pending').length;
        
        // Create pending activities list
        const pendingActivities = [
          ...pickingLists
            .filter(p => p.picked_status !== 'Completed')
            .map(p => ({
              id: p.picking_list_id,
              type: 'Picking',
              status: p.picked_status,
              date: p.picked_date || 'N/A',
              assignedTo: p.picked_by || 'Unassigned'
            })),
          ...packingLists
            .filter(p => p.packing_status === 'Pending')
            .map(p => ({
              id: p.packing_list_id,
              type: 'Packing',
              status: p.packing_status,
              date: p.packing_date || 'N/A',
              assignedTo: p.packed_by || 'Unassigned'
            })),
          ...shipments
            .filter(s => s.shipment_status === 'Pending')
            .map(s => ({
              id: s.shipment_id,
              type: 'Shipment',
              status: s.shipment_status,
              date: s.shipment_date || 'N/A',
              assignedTo: s.carrier_name || 'Unassigned'
            })),
          ...reworks
            .filter(r => r.rework_status !== 'Completed')
            .map(r => ({
              id: r.rework_id,
              type: 'Rework',
              status: r.rework_status,
              date: r.rework_date || 'N/A',
              assignedTo: r.assigned_to || 'Unassigned'
            }))
        ]
        .sort((a, b) => {
          // Sort by date (if available) with newest first
          const dateA = a.date && a.date !== 'N/A' ? new Date(a.date) : new Date(0);
          const dateB = b.date && b.date !== 'N/A' ? new Date(b.date) : new Date(0);
          return dateB - dateA;
        })
        .slice(0, 5); // Take top 5 most recent
        
        // Status breakdown for charts
        const statusBreakdown = {
          picking: pendingPickings + inProgressPickings,
          packing: pendingPackings,
          shipping: pendingShipments + shippedShipments,
          delivered: deliveredShipmentCount,
          failed: failedShipmentCount,
          reworks: pendingReworks
        };
        
        // Calculate delivery trends (by date)
        const deliveryTrends = calculateDeliveryTrends(shipments);
        
        // Simulate top products data
        const topProducts = [
          { name: 'Product A', count: 120, trend: 'up' },
          { name: 'Product B', count: 95, trend: 'up' },
          { name: 'Product C', count: 80, trend: 'down' },
          { name: 'Product D', count: 75, trend: 'stable' },
          { name: 'Product E', count: 60, trend: 'up' }
        ];
        
        // Update dashboard data
        const dashboardData = {
          metrics: {
            totalDeliveries,
            pendingDeliveries,
            completedDeliveries,
            inTransit,
            failedDeliveries,
            totalCost: costData.totalCost,
            totalDistance: distanceData.totalDistance,
            totalWeight: distanceData.totalWeight
          },
          recentDeliveries,
          performanceMetrics: {
            onTimeDeliveryRate,
            averageFulfillmentTime,
            returnRate,
            carrierPerformance,
            costPerDelivery: costData.costPerDelivery,
            avgDeliveryDistance: distanceData.avgDistance,
            avgDeliveryWeight: distanceData.avgWeight,
            weekOverWeekChange: wowChange,
            monthOverMonthChange: momChange,
            timeToResolveIssues: 2.3, // simulated
            customerSatisfactionScore: customerSatisfaction.currentScore,
            customerSatisfactionTrend: customerSatisfaction.trend
          },
          pendingActivities,
          statusBreakdown,
          deliveryTrends,
          processingTimeBreakdown,
          costBreakdown: costData.breakdown,
          distanceBreakdown: distanceData.breakdown,
          topProducts,
          insights
        };
        
        setDashboardData(dashboardData);
        setLoading(false);
        
        // Initialize charts with data
        setTimeout(() => {
          initializeCharts(dashboardData);
        }, 0);
        
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [timeRange]);
  
  // Calculate delivery trends based on time range
  const calculateDeliveryTrends = (shipments) => {
    let daysToShow = 7; // default for weekly view
    let dateFormat = { month: 'short', day: 'numeric' };
    
    switch(timeRange) {
      case 'today':
        daysToShow = 1;
        dateFormat = { hour: '2-digit' };
        break;
      case 'week':
        daysToShow = 7;
        break;
      case 'month':
        daysToShow = 30;
        dateFormat = { month: 'short', day: 'numeric' };
        break;
      case 'quarter':
        daysToShow = 90;
        dateFormat = { month: 'short' };
        break;
      case 'year':
        daysToShow = 12;
        dateFormat = { month: 'short' };
        break;
      default:
        daysToShow = 7;
    }
    
    // Get dates for the period
    const dates = [];
    const counts = [];
    
    // For 'year' show months instead of days
    if (timeRange === 'year') {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      for (let i = 0; i < 12; i++) {
        dates.push(months[i]);
        
        // Count shipments in this month (simulated)
        const monthShipments = Math.floor(Math.random() * 50) + 30;
        counts.push(monthShipments);
      }
    } else {
      for (let i = daysToShow - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        // Format date according to time range
        const formattedDate = date.toLocaleDateString('en-US', dateFormat);
        dates.push(formattedDate);
        
        // For today, split by hours
        if (timeRange === 'today') {
          const hourlyShipments = Math.floor(Math.random() * 8) + 2;
          counts.push(hourlyShipments);
        } else {
          // Count shipments on this date (use actual data from shipments)
          const dateString = date.toISOString().split('T')[0];
          const dailyShipments = shipments.filter(s => 
            s.shipment_date && s.shipment_date.includes(dateString)
          ).length;
          
          // If no shipments, add a random value (for demo purposes)
          counts.push(dailyShipments || Math.floor(Math.random() * 15) + 5);
        }
      }
    }
    
    return { labels: dates, counts };
  };
  
  // Calculate carrier performance
  const calculateCarrierPerformance = (shipments) => {
    // Group shipments by carrier
    const carrierMap = new Map();
    
    shipments.forEach(shipment => {
      if (!shipment.carrier_name) return;
      
      if (!carrierMap.has(shipment.carrier_name)) {
        carrierMap.set(shipment.carrier_name, {
          totalShipments: 0,
          onTimeDeliveries: 0
        });
      }
      
      const carrierData = carrierMap.get(shipment.carrier_name);
      carrierData.totalShipments++;
      
      // Check if on-time
      if (
        shipment.shipment_status === 'Delivered' && 
        shipment.actual_arrival_date && 
        shipment.estimated_arrival_date &&
        new Date(shipment.actual_arrival_date) <= new Date(shipment.estimated_arrival_date)
      ) {
        carrierData.onTimeDeliveries++;
      }
    });
    
    // Convert map to array and calculate rates
    const carrierPerformance = [];
    carrierMap.forEach((data, carrierName) => {
      if (data.totalShipments > 0) {
        carrierPerformance.push({
          name: carrierName,
          totalShipments: data.totalShipments,
          onTimeDeliveries: data.onTimeDeliveries,
          onTimeRate: parseFloat(((data.onTimeDeliveries / data.totalShipments) * 100).toFixed(1))
        });
      }
    });
    
    // Sort by on-time rate descending
    return carrierPerformance.sort((a, b) => b.onTimeRate - a.onTimeRate);
  };
  
  // Simulate cost data
  const simulateCostData = (shipments) => {
    // Calculate cost per delivery (simulated)
    const baseCost = 8.50; // base cost per delivery
    const randomVariance = 3.50; // random variance in cost
    
    const costPerDelivery = parseFloat((baseCost + Math.random() * randomVariance).toFixed(2));
    const totalCost = parseFloat((costPerDelivery * shipments.length).toFixed(2));
    
    // Cost breakdown (simulated)
    const breakdown = {
      packaging: parseFloat((costPerDelivery * 0.15).toFixed(2)),
      shipping: parseFloat((costPerDelivery * 0.45).toFixed(2)),
      handling: parseFloat((costPerDelivery * 0.20).toFixed(2)),
      fuel: parseFloat((costPerDelivery * 0.15).toFixed(2)),
      other: parseFloat((costPerDelivery * 0.05).toFixed(2))
    };
    
    return { costPerDelivery, totalCost, breakdown };
  };
  
  // Simulate distance data
  const simulateDistanceData = (shipments) => {
    // Average distance per delivery (simulated)
    const baseDistance = 15.2; // miles
    const randomVariance = 5.8; // random variance in miles
    
    const avgDistance = parseFloat((baseDistance + Math.random() * randomVariance).toFixed(1));
    const totalDistance = parseFloat((avgDistance * shipments.length).toFixed(1));
    
    // Average weight per delivery (simulated)
    const avgWeight = parseFloat((12.5 + Math.random() * 7.5).toFixed(1));
    const totalWeight = parseFloat((avgWeight * shipments.length).toFixed(1));
    
    // Distance breakdown (simulated)
    const breakdown = {
      local: Math.floor(shipments.length * 0.45), // 0-10 miles
      regional: Math.floor(shipments.length * 0.30), // 10-25 miles
      national: Math.floor(shipments.length * 0.20), // 25-100 miles
      international: Math.floor(shipments.length * 0.05) // 100+ miles
    };
    
    return { avgDistance, totalDistance, avgWeight, totalWeight, breakdown };
  };
  
  // Simulate customer satisfaction
  const simulateCustomerSatisfaction = () => {
    const currentScore = parseFloat((4 + Math.random() * 1).toFixed(1)); // 4.0 - 5.0
    
    // Trend over last 6 months
    const trend = [
      parseFloat((currentScore - 0.3 - Math.random() * 0.2).toFixed(1)),
      parseFloat((currentScore - 0.2 - Math.random() * 0.2).toFixed(1)),
      parseFloat((currentScore - 0.1 - Math.random() * 0.1).toFixed(1)),
      parseFloat((currentScore - 0.1 + Math.random() * 0.1).toFixed(1)),
      parseFloat((currentScore - 0.05 + Math.random() * 0.1).toFixed(1)),
      currentScore
    ];
    
    return { currentScore, trend };
  };
  
  // Generate random cost for a shipment (for demo purposes)
  const generateRandomCost = (shipment) => {
    // Base cost depends on delivery type
    let baseCost = 0;
    if (shipment.delivery_type === 'sales') {
      baseCost = 15.0;
    } else if (shipment.delivery_type === 'service') {
      baseCost = 12.0;
    } else {
      baseCost = 10.0;
    }
    
    // Add random variance
    return parseFloat((baseCost + Math.random() * 5).toFixed(2));
  };
  
  // Generate random distance for a shipment (for demo purposes)
  const generateRandomDistance = (shipment) => {
    // Base distance based on delivery location (simulated)
    let baseDistance = 10.0;
    
    if (shipment.destination_location) {
      const location = shipment.destination_location.toLowerCase();
      if (location.includes('international') || location.includes('overseas')) {
        baseDistance = 500.0;
      } else if (location.includes('state') || location.includes('regional')) {
        baseDistance = 100.0;
      } else if (location.includes('city') || location.includes('local')) {
        baseDistance = 20.0;
      }
    }
    
    // Add random variance
    return parseFloat((baseDistance + Math.random() * baseDistance * 0.5).toFixed(1));
  };
  
  // Generate insights based on metrics
  const generateInsights = (metrics) => {
    const insights = [];
    
    // On-time delivery insight
    if (parseFloat(metrics.onTimeDeliveryRate) >= 90) {
      insights.push({
        type: 'positive',
        icon: <CheckCircle size={16} />,
        text: `High on-time delivery rate of ${metrics.onTimeDeliveryRate}% exceeds industry average of 85%.`
      });
    } else if (parseFloat(metrics.onTimeDeliveryRate) < 75) {
      insights.push({
        type: 'negative',
        icon: <AlertCircle size={16} />,
        text: `On-time delivery rate is at ${metrics.onTimeDeliveryRate}%, below the target of 85%.`
      });
    }
    
    // Return rate insight
    if (parseFloat(metrics.returnRate) <= 2) {
      insights.push({
        type: 'positive',
        icon: <CheckCircle size={16} />,
        text: `Low return rate of ${metrics.returnRate}% indicates high delivery quality.`
      });
    } else if (parseFloat(metrics.returnRate) > 5) {
      insights.push({
        type: 'negative',
        icon: <AlertCircle size={16} />,
        text: `Return rate of ${metrics.returnRate}% is above the acceptable threshold of 5%.`
      });
    }
    
    // Week-over-week change insight
    if (parseFloat(metrics.wowChange) > 5) {
      insights.push({
        type: 'positive',
        icon: <TrendingUp size={16} />,
        text: `Delivery volume increased by ${metrics.wowChange}% compared to last week.`
      });
    } else if (parseFloat(metrics.wowChange) < -5) {
      insights.push({
        type: 'negative',
        icon: <TrendingDown size={16} />,
        text: `Delivery volume decreased by ${Math.abs(parseFloat(metrics.wowChange))}% compared to last week.`
      });
    }
    
    // Cost per delivery insight
    if (parseFloat(metrics.costPerDelivery) < 10) {
      insights.push({
        type: 'positive',
        icon: <DollarSign size={16} />,
        text: `Cost per delivery of $${metrics.costPerDelivery} is below the target of $10.00.`
      });
    } else if (parseFloat(metrics.costPerDelivery) > 12) {
      insights.push({
        type: 'negative',
        icon: <DollarSign size={16} />,
        text: `Cost per delivery of $${metrics.costPerDelivery} exceeds the target of $10.00.`
      });
    }
    
    // Fulfillment time insight
    if (parseFloat(metrics.averageFulfillmentTime) < 3) {
      insights.push({
        type: 'positive',
        icon: <Clock size={16} />,
        text: `Average fulfillment time of ${metrics.averageFulfillmentTime} days is better than industry standard.`
      });
    } else if (parseFloat(metrics.averageFulfillmentTime) > 4) {
      insights.push({
        type: 'negative',
        icon: <Clock size={16} />,
        text: `Average fulfillment time of ${metrics.averageFulfillmentTime} days exceeds the target of 3 days.`
      });
    }
    
    return insights;
  };
  
  // Helper to determine priority from shipment data
  const getPriorityFromShipment = (shipment) => {
    if (shipment.delivery_type === 'sales') {
      return 'High';
    } else if (shipment.delivery_type === 'service') {
      return 'Medium';
    } else {
      return 'Low';
    }
  };
  
  // Helper to get readable shipment type
  const getShipmentType = (shipment) => {
    if (shipment.delivery_type === 'sales') {
      return 'Sales Order';
    } else if (shipment.delivery_type === 'service') {
      return 'Service Order';
    } else if (shipment.delivery_type === 'content') {
      return 'Content';
    } else if (shipment.delivery_type === 'stock') {
      return 'Stock Transfer';
    } else {
      return 'Other';
    }
  };
  
  // Filter recent deliveries based on search term
  const filteredDeliveries = dashboardData.recentDeliveries.filter(delivery => {
    if (!searchTerm) return true;
    
    return (
      delivery.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.carrier.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  // Filter by time range
  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
  };
  
  // Toggle comparison with previous period
  const toggleComparison = () => {
    setCompareWithPrevious(!compareWithPrevious);
  };
  
  // Get status color class for badges
  const getStatusColorClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'status-delivered';
      case 'shipped':
      case 'in transit':
        return 'status-in-transit';
      case 'pending':
      case 'processing':
      case 'not started':
        return 'status-processing';
      case 'failed':
        return 'status-failed';
      case 'in progress':
        return 'status-in-progress';
      case 'completed':
        return 'status-completed';
      default:
        return 'status-processing';
    }
  };
  
  // Get priority color class
  const getPriorityColorClass = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'priority-high';
      case 'medium':
        return 'priority-medium';
      case 'low':
        return 'priority-low';
      default:
        return 'priority-medium';
    }
  };
  
  // Get trend indicator icon and class
  const getTrendIndicator = (value, threshold = 0, isPositive = true) => {
    const numValue = parseFloat(value);
    
    if (isPositive) {
      // For metrics where higher is better (on-time rate)
      return numValue >= threshold 
        ? <ArrowUpRight size={16} className="trend-up" /> 
        : <ArrowDownRight size={16} className="trend-down" />;
    } else {
      // For metrics where lower is better (return rate)
      return numValue <= threshold 
        ? <ArrowUpRight size={16} className="trend-up" /> 
        : <ArrowDownRight size={16} className="trend-down" />;
    }
  };
  
  // Get insight type class
  const getInsightTypeClass = (type) => {
    switch (type) {
      case 'positive':
        return 'insight-positive';
      case 'negative':
        return 'insight-negative';
      case 'neutral':
        return 'insight-neutral';
      default:
        return 'insight-neutral';
    }
  };
  
  // Format dates
  const formatDate = (dateString) => {
    if (!dateString || dateString === 'N/A') return 'N/A';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  // Format number with commas
  const formatNumber = (number) => {
    return new Intl.NumberFormat('en-US').format(number);
  };
  
  // Format percentage
  const formatPercentage = (value) => {
    return `${parseFloat(value).toFixed(1)}%`;
  };
  
  return (
    <div className="distribution">
      <div className="body-content-container">
        <div className="dashboard-header">
          <h2 className="page-title">Distribution Dashboard</h2>
          
          <div className="dashboard-controls">
            <div className="time-range-selector">
              <div className="control-label">Time Range:</div>
              <div className="control-buttons">
                <button 
                  className={`control-button ${timeRange === 'today' ? 'active' : ''}`}
                  onClick={() => handleTimeRangeChange('today')}
                >
                  Today
                </button>
                <button 
                  className={`control-button ${timeRange === 'week' ? 'active' : ''}`}
                  onClick={() => handleTimeRangeChange('week')}
                >
                  Week
                </button>
                <button 
                  className={`control-button ${timeRange === 'month' ? 'active' : ''}`}
                  onClick={() => handleTimeRangeChange('month')}
                >
                  Month
                </button>
                <button 
                  className={`control-button ${timeRange === 'quarter' ? 'active' : ''}`}
                  onClick={() => handleTimeRangeChange('quarter')}
                >
                  Quarter
                </button>
                <button 
                  className={`control-button ${timeRange === 'year' ? 'active' : ''}`}
                  onClick={() => handleTimeRangeChange('year')}
                >
                  Year
                </button>
              </div>
            </div>
            
            <div className="dashboard-actions">
              <button 
                className={`comparison-toggle ${compareWithPrevious ? 'active' : ''}`}
                onClick={toggleComparison}
              >
                <RefreshCw size={16} />
                {compareWithPrevious ? 'Hide Comparison' : 'Show Comparison'}
              </button>
              
              <button className="refresh-button">
                <RefreshCw size={16} />
                Refresh
              </button>
            </div>
          </div>
        </div>
        
        {/* Quick Access Menu */}
        <div className="quick-access-section">
          <div className="quick-access-grid">
            <div 
              className="quick-access-card" 
              onClick={() => navigateToSubmodule("Internal Delivery")}
            >
              <div className="quick-access-icon">
                <Truck size={20} />
              </div>
              <span>Internal Delivery</span>
            </div>
            
            <div 
              className="quick-access-card" 
              onClick={() => navigateToSubmodule("External Delivery")}
            >
              <div className="quick-access-icon">
                <Truck size={20} />
              </div>
              <span>External Delivery</span>
            </div>
            
            <div 
              className="quick-access-card" 
              onClick={() => navigateToSubmodule("Picking")}
            >
              <div className="quick-access-icon">
                <Users size={20} />
              </div>
              <span>Picking</span>
            </div>
            
            <div 
              className="quick-access-card" 
              onClick={() => navigateToSubmodule("Packing")}
            >
              <div className="quick-access-icon">
                <Box size={20} />
              </div>
              <span>Packing</span>
            </div>
            
            <div 
              className="quick-access-card" 
              onClick={() => navigateToSubmodule("Shipment")}
            >
              <div className="quick-access-icon">
                <Package size={20} />
              </div>
              <span>Shipment</span>
            </div>
          </div>
        </div>
        
        {/* Dashboard Content */}
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading dashboard data...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <AlertCircle size={32} className="error-icon" />
            <p className="error-message">{error}</p>
          </div>
        ) : (
          <div className="dashboard-content">
            {/* Insights Section */}
            <div className="insights-section">
              <div className="insights-cards">
                {dashboardData.insights.map((insight, index) => (
                  <div key={index} className={`insight-card ${getInsightTypeClass(insight.type)}`}>
                    <div className="insight-icon">
                      {insight.icon}
                    </div>
                    <div className="insight-text">
                      {insight.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Key Metrics Section */}
            <div className="dashboard-section">
              <div className="section-header toggleable" onClick={() => toggleSection('keyMetrics')}>
                <h3 className="section-title">
                  <span className="section-icon"><BarChart2 size={18} /></span>
                  Key Metrics
                </h3>
                <div className="section-toggle">
                  {expandedSections.keyMetrics ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
              </div>
              
              {expandedSections.keyMetrics && (
                <div className="metrics-row">
                  <div className="metric-card">
                    <div className="metric-icon">
                      <Package size={24} />
                    </div>
                    <div className="metric-content">
                      <span className="metric-value">{formatNumber(dashboardData.metrics.totalDeliveries)}</span>
                      <span className="metric-label">Total Deliveries</span>
                    </div>
                    <div className="metric-trend">
                      <span className={parseFloat(dashboardData.performanceMetrics.weekOverWeekChange) >= 0 ? 'trend-up' : 'trend-down'}>
                        {dashboardData.performanceMetrics.weekOverWeekChange}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="metric-card">
                    <div className="metric-icon processing">
                      <Package size={24} />
                    </div>
                    <div className="metric-content">
                      <span className="metric-value">{dashboardData.metrics.pendingDeliveries}</span>
                      <span className="metric-label">Pending</span>
                    </div>
                  </div>
                  
                  <div className="metric-card">
                    <div className="metric-icon transit">
                      <Truck size={24} />
                    </div>
                    <div className="metric-content">
                      <span className="metric-value">{dashboardData.metrics.inTransit}</span>
                      <span className="metric-label">In Transit</span>
                    </div>
                  </div>
                  
                  <div className="metric-card">
                    <div className="metric-icon completed">
                      <CheckCircle size={24} />
                    </div>
                    <div className="metric-content">
                      <span className="metric-value">{dashboardData.metrics.completedDeliveries}</span>
                      <span className="metric-label">Completed</span>
                    </div>
                  </div>
                  
                  <div className="metric-card">
                    <div className="metric-icon failed">
                      <AlertCircle size={24} />
                    </div>
                    <div className="metric-content">
                      <span className="metric-value">{dashboardData.metrics.failedDeliveries}</span>
                      <span className="metric-label">Failed</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Performance Overview Section */}
            <div className="dashboard-section">
              <div className="section-header toggleable" onClick={() => toggleSection('performanceOverview')}>
                <h3 className="section-title">
                  <span className="section-icon"><Activity size={18} /></span>
                  Performance Overview
                </h3>
                <div className="section-toggle">
                  {expandedSections.performanceOverview ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
              </div>
              
              {expandedSections.performanceOverview && (
                <div className="charts-grid">
                  <div className="chart-card">
                    <h3 className="chart-title">On-Time Delivery Rate</h3>
                    <div className="chart-container gauge-chart">
                      <canvas ref={onTimeDeliveryChartRef}></canvas>
                      <div className="gauge-value">
                        {dashboardData.performanceMetrics.onTimeDeliveryRate}%
                        <div className="gauge-target">Target: 90%</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="chart-card">
                    <h3 className="chart-title">Delivery Status Breakdown</h3>
                    <div className="chart-container">
                      <canvas ref={statusDistributionChartRef}></canvas>
                    </div>
                  </div>
                  
                  <div className="chart-card">
                    <h3 className="chart-title">Return Rate</h3>
                    <div className="chart-container gauge-chart">
                      <canvas ref={returnRateChartRef}></canvas>
                      <div className="gauge-value">
                        {dashboardData.performanceMetrics.returnRate}%
                        <div className="gauge-target">Target: &lt;3%</div>
                      </div>
                    </div>
                  </div>

                </div>
                
              )}
            </div>
            
            {/* Delivery Analysis Section */}
            <div className="dashboard-section">
              <div className="section-header toggleable" onClick={() => toggleSection('deliveryAnalysis')}>
                <h3 className="section-title">
                  <span className="section-icon"><TrendingUp size={18} /></span>
                  Delivery Analysis
                </h3>
                <div className="section-toggle">
                  {expandedSections.deliveryAnalysis ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
              </div>
              
              {expandedSections.deliveryAnalysis && (
                <div className="charts-grid">
                  <div className="chart-card">
                    <h3 className="chart-title">Delivery Volume Trend</h3>
                    <div className="chart-container">
                      <canvas ref={deliveryTrendChartRef}></canvas>
                    </div>
                  </div>
                  
                  <div className="chart-card">
                    <h3 className="chart-title">Delivery Distance Distribution</h3>
                    <div className="chart-container">
                      <canvas ref={deliveryDistanceChartRef}></canvas>
                    </div>
                  </div>
                  
                  <div className="chart-card">
                    <h3 className="chart-title">Accuracy Trend</h3>
                    <div className="chart-container">
                      <canvas ref={accuracyChartRef}></canvas>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Pending Activities */}
            <div className="pending-activities-section">
              <div className="section-title">
              <h3 className="section-header">Pending Activities</h3>
              </div>
              <div className="activities-list">
                {dashboardData.pendingActivities.length > 0 ? (
                  dashboardData.pendingActivities.map((activity, index) => (
                    <div key={activity.id} className="activity-item">
                      <div className="activity-type">
                        <span className={`activity-badge ${activity.type.toLowerCase()}`}>
                          {activity.type}
                        </span>
                      </div>
                      <div className="activity-details">
                        <div className="activity-id">{activity.id}</div>
                        <div className="activity-meta">
                          <span className={`status-badge ${getStatusColorClass(activity.status)}`}>
                            {activity.status}
                          </span>
                          <span className="activity-date">{formatDate(activity.date)}</span>
                        </div>
                      </div>
                      <div className="activity-assigned">
                        {activity.assignedTo !== 'Unassigned' 
                          ? activity.assignedTo 
                          : <span className="unassigned">Unassigned</span>}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-activities">No pending activities</div>
                )}
              </div>
            </div>
            
            {/* Recent Deliveries (Full Width) */}
            <div className="recent-deliveries-section">
              <div className="section-header">
                <h3 className="section-title">Recent Deliveries</h3>
                <div className="search-container">
                  <Search className="search-icon" size={16} />
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Search deliveries..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                </div>
              </div>
              
              <div className="recent-deliveries-table-container">
                <table className="recent-deliveries-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Date</th>
                      <th>Type</th>
                      <th>Destination</th>
                      <th>Carrier</th>
                      <th>Items</th>
                      <th>Status</th>
                      <th>Priority</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDeliveries.length > 0 ? (
                      filteredDeliveries.map((delivery, index) => (
                        <tr key={delivery.id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                          <td>{delivery.id}</td>
                          <td>{formatDate(delivery.date)}</td>
                          <td>{delivery.type}</td>
                          <td className="destination-cell">{delivery.destination}</td>
                          <td>{delivery.carrier}</td>
                          <td className="centered-cell">{delivery.items}</td>
                          <td>
                            <span className={`status-badge ${getStatusColorClass(delivery.status)}`}>
                              {delivery.status}
                            </span>
                          </td>
                          <td>
                            <span className={`priority-badge ${getPriorityColorClass(delivery.priority)}`}>
                              {delivery.priority}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="no-data">No deliveries found matching your search.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Distribution;