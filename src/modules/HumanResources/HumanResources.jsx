import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles/HumanResources.css";
import Calendar from "./components/Calendar";
import { useNavigate } from "react-router-dom";
import { EmployeeMetricsChart, TurnoverChart } from './components/Charts';
import { 
  ResponsiveContainer, PieChart, Pie, BarChart, Bar, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area, LineChart, Line,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ComposedChart,
  Scatter, ScatterChart, ZAxis
} from 'recharts';
// Import FontAwesome properly in React
import '@fortawesome/fontawesome-free/css/all.min.css';

// Import all summary report components
import DepartmentSummaryReport from './components/reports/DepartmentSummaryReport';
import WorkforceAllocationSummaryReport from './components/reports/WorkforceAllocationSummaryReport';
import LeaveRequestSummaryReport from './components/reports/LeaveRequestSummaryReport';
import EmployeePerformanceSummaryReport from './components/reports/EmployeePerformanceSummaryReport';
import EmployeeSalarySummaryReport from './components/reports/EmployeeSalarySummaryReport';
import AttendanceSummaryReport from './components/reports/AttendanceSummaryReport';
import CandidatesSummaryReport from './components/reports/CandidatesSummaryReport';
import EmployeesSummaryReport from './components/reports/EmployeesSummaryReport';
import InterviewsSummaryReport from './components/reports/InterviewsSummaryReport';
import JobPostingSummaryReport from './components/reports/JobPostingSummaryReport';
import OnboardingSummaryReport from './components/reports/OnboardingSummaryReport';
import OvertimeSummaryReport from './components/reports/OvertimeSummaryReport';
import PayrollSummaryReport from './components/reports/PayrollSummaryReport';
import PositionsSummaryReport from './components/reports/PositionsSummaryReport';
import ResignationsSummaryReport from './components/reports/ResignationsSummaryReport';
import RecruitmentAnalytics from './components/RecruitmentAnalytics';

// Define Kinetiq brand colors for charts
const kinetiqColors = {
  primary: "#00a9ac",
  secondary: "#66bc6d",
  accent1: "#8884d8",    // Adding missing accent1 color
  accent2: "#ff8042",    // Adding missing accent2 color
  accent3: "#8884d8",
  accent4: "#82ca9d",
  accent5: "#ffc658",
  accent6: "#ff8042",
  accent7: "#a5d8ef",
  neutral: "#687C7B"
};

// Add this helper function near the top of your component
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

// Custom label component to better position labels
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, name, value, percent }) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius * 1.2;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text 
      x={x} 
      y={y} 
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
      className="hr-chart-label"
    >
      {`${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
    </text>
  );
};

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
        <Bar dataKey="count" fill={kinetiqColors.primary} />
      </BarChart>
    </ResponsiveContainer>
  );
};

const FallbackReportContent = ({ title }) => (
  <div className="hr-report-fallback" style={{padding: '20px', textAlign: 'center'}}>
    <h3>{title} Report</h3>
    <p>This report is currently unavailable or being updated.</p>
    <p>Please check back later or contact the IT department for assistance.</p>
  </div>
);

const HRDashboard = ({ loadSubModule, setActiveSubModule }) => {
  // Add navigation hook
  const navigate = useNavigate();
  
  // State for fetched data
  const [employeeStats, setEmployeeStats] = useState({
    total: 0,
    present: 0,
    absent: 0,
    late: 0,
    onLeave: 0,
    regular: 0,
    contractual: 0,
    seasonal: 0,
  });
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [employeePerformance, setEmployeePerformance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [performanceDistribution, setPerformanceDistribution] = useState([]);
  const [leaveTypeData, setLeaveTypeData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [recruitmentData, setRecruitmentData] = useState([]);
  const [resignationData, setResignationData] = useState([]);
  const [turnoverData, setTurnoverData] = useState([]);
  const [payrollData, setPayrollData] = useState([]);
  const [workforceAllocation, setWorkforceAllocation] = useState([]);
  const [employeeGrowthData, setEmployeeGrowthData] = useState([]);
  const [trainingData, setTrainingData] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [overtimeRequestsData, setOvertimeRequestsData] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [positions, setPositions] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [jobPostings, setJobPostings] = useState([]);
  const [onboardingTasks, setOnboardingTasks] = useState([]);
  const [resignations, setResignations] = useState([]);
  const [departmentSuperiors, setDepartmentSuperiors] = useState([]);

  // Add state for managing report visibility
  const [activeReport, setActiveReport] = useState('department');

  // Add state for managing report period
  const [activePeriod, setActivePeriod] = useState('monthly'); // default to monthly

  // Rating labels for display
  const RATING_LABELS = {
    5: "Outstanding",
    4: "Very Satisfactory",
    3: "Satisfactory",
    2: "Fair",
    1: "Poor"
  };

  // Update your color arrays with the kinetiq branded colors
  const performanceColors = [
    kinetiqColors.primary, 
    kinetiqColors.secondary, 
    kinetiqColors.accent1, 
    kinetiqColors.accent2,
    kinetiqColors.accent3
  ];
  
  const departmentColors = [
    kinetiqColors.primary, 
    kinetiqColors.secondary, 
    kinetiqColors.accent1, 
    kinetiqColors.accent2,
    kinetiqColors.accent3
  ];

  // Enhanced navigateTo function to handle all HR submodules
  const navigateTo = (submoduleName, params = {}) => {
    // Map path to the actual submodule name as defined in App.jsx
    const pathToSubmoduleMap = {
      '/attendance': 'Attendance Tracking', // Changed from 'Attendance Tracking'
      '/employees': 'Employees',
      '/leave-requests': 'Leave Requests', // Changed from 'Leave Requests'
      '/employee-performance': 'Employee Performance', // Changed from 'Employee Performance'
      '/departments': 'Departments',
      '/payroll': 'Payroll',
      '/recruitment': 'Recruitment',
      '/workforce-allocation': 'Workforce Allocation', // Changed from 'Workforce Allocation'
      '/resignation': 'Resignation Request', // Changed from 'Resignation'
      '/job-posting': 'JobPosting', // Changed from 'Job Posting'
      '/leave-balances': 'Leave Balances', // Changed from 'Leave Balances'
    };
    
    const submodule = pathToSubmoduleMap[submoduleName];
    if (submodule) {
      try {
        // Pass parameters to the submodule if needed
        if (params.selectedDate) {
          sessionStorage.setItem('selectedDate', params.selectedDate);
        }
        if (params.filterValue) {
          sessionStorage.setItem('filterValue', JSON.stringify(params.filterValue));
        }
        if (params.employeeId) {
          sessionStorage.setItem('selectedEmployeeId', params.employeeId);
        }
        
        setActiveSubModule(submodule);
        loadSubModule(submodule);
      } catch (error) {
        console.error(`Error navigating to ${submodule}:`, error);
        // Provide visual feedback about the error
        alert(`Failed to load ${submodule} module. Please check the console for details.`);
      }
    } else {
      console.warn(`No mapping found for path: ${submoduleName}`);
    }
  };

  // Fetch employee and attendance data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 1. Fetch all employees first to ensure we have the total count
        const employeesRes = await axios.get("https://1wj5891jxg.execute-api.ap-southeast-1.amazonaws.com/dev/api/employees/");
        const employees = employeesRes.data;
        const totalEmployees = employees.length;
        
        // Count employees by employment type
        const regularCount = employees.filter(emp => emp.employment_type === "Regular").length;
        const contractualCount = employees.filter(emp => emp.employment_type === "Contractual").length;
        const seasonalCount = employees.filter(emp => emp.employment_type === "Seasonal").length;
        
        // Log employee counts for debugging
        console.log("Employee counts:", { total: totalEmployees, regular: regularCount, contractual: contractualCount, seasonal: seasonalCount });
        
        // 2. Fetch attendance data with error handling
        let presentCount = 0, absentCount = 0, lateCount = 0, onLeaveCount = 0;
        let latestDate = new Date().toISOString().split('T')[0]; // Default to today's date
        
        try {
          const attendanceRes = await axios.get("https://1wj5891jxg.execute-api.ap-southeast-1.amazonaws.com/dev/api/attendance_tracking/attendance_tracking/");
          const attendanceData = attendanceRes.data;
          setAttendanceData(attendanceData);
          
          if (attendanceData && attendanceData.length > 0) {
            // Find the latest date in attendance records
            const dates = [...new Set(attendanceData.map(record => record.date))];
            if (dates.length > 0) {
              latestDate = dates.sort().reverse()[0];
              console.log("Latest attendance date:", latestDate);
              
              // Filter attendance data for the latest date
              const latestAttendance = attendanceData.filter(record => record.date === latestDate);
              
              // Count employees by status for the latest date
              presentCount = latestAttendance.filter(record => record.status === "Present").length;
              absentCount = latestAttendance.filter(record => record.status === "Absent").length;
              lateCount = latestAttendance.filter(record => record.status === "Late").length;
              onLeaveCount = latestAttendance.filter(record => record.status === "On Leave").length;
              
              console.log("Attendance counts for date", latestDate, ":", { 
                present: presentCount, 
                absent: absentCount, 
                late: lateCount, 
                onLeave: onLeaveCount 
              });
            } else {
              console.warn("No dates found in attendance data");
            }
          } else {
            console.warn("Empty or invalid attendance data");
          }
        } catch (attendanceErr) {
          console.error("Error fetching attendance data:", attendanceErr);
        }

        // If no attendance records found, use employee count as a fallback for "Present"
        if (presentCount === 0 && absentCount === 0 && lateCount === 0 && onLeaveCount === 0 && totalEmployees > 0) {
          presentCount = totalEmployees; // Assume all employees are present if no attendance data
          console.log("Using fallback: All employees marked as present");
        }

        // Add this calculation to properly account for all employees
        let unaccountedEmployees = totalEmployees - (presentCount + absentCount + lateCount + onLeaveCount);
        if (unaccountedEmployees > 0) {
          // Add unaccounted employees to absent count since they aren't present
          absentCount += unaccountedEmployees;
          console.log(`Added ${unaccountedEmployees} unaccounted employees to absent count`);
        }
        
        // Update the state with the fetched data
        setEmployeeStats({
          total: totalEmployees,
          present: presentCount,
          absent: absentCount,
          late: lateCount,
          onLeave: onLeaveCount,
          regular: regularCount,
          contractual: contractualCount,
          seasonal: seasonalCount
        });

        // Continue with the rest of your data fetching...
        
        // 3. Fetch leave requests
        const leaveRequestsRes = await axios.get("https://1wj5891jxg.execute-api.ap-southeast-1.amazonaws.com/dev/api/employee_leave_requests/leave_requests/");
        const allLeaveRequests = leaveRequestsRes.data;
        
        // 4. Fetch employee performance data
        const performanceRes = await axios.get("https://1wj5891jxg.execute-api.ap-southeast-1.amazonaws.com/dev/api/employee_performance/employee_performance/");
        const allPerformanceData = performanceRes.data;
        
        // 5. Fetch departments data
        const departmentsRes = await axios.get("https://1wj5891jxg.execute-api.ap-southeast-1.amazonaws.com/dev/api/departments/department/");
        const departments = departmentsRes.data;

        // Make sure to fetch department superiors
        const departmentSuperiorsRes = await axios.get("https://1wj5891jxg.execute-api.ap-southeast-1.amazonaws.com/dev/api/department_superiors/department-superiors/");
        const departmentSuperiors = departmentSuperiorsRes.data;

        // Process department data for reports
        const depts = departmentsRes.data;
        if (Array.isArray(depts)) {
          // Count employees per department
          const deptCounts = employees.reduce((acc, emp) => {
            const deptId = emp.dept_id;
            if (deptId) {
              acc[deptId] = (acc[deptId] || 0) + 1;
            }
            return acc;
          }, {});
          
          // Transform departments with employee counts
          const transformedDepts = depts.map(dept => ({
            ...dept,
            name: dept.dept_name,
            id: dept.dept_id,
            value: deptCounts[dept.dept_id] || 0,
            employee_count: deptCounts[dept.dept_id] || 0
          }));
          
          setDepartmentData(transformedDepts);
        }

        setDepartmentSuperiors(departmentSuperiors);
        
        // 6. Fetch resignations data
        const resignationsRes = await axios.get("https://1wj5891jxg.execute-api.ap-southeast-1.amazonaws.com/dev/api/resignation/");
        const resignations = resignationsRes.data;
        
        // 7. Fetch recruitment data
        try {
          const candidatesResponse = await axios.get('https://1wj5891jxg.execute-api.ap-southeast-1.amazonaws.com/dev/api/candidates/candidates/');
          const interviewsResponse = await axios.get('https://1wj5891jxg.execute-api.ap-southeast-1.amazonaws.com/dev/api/interviews/');
          
          setCandidates(candidatesResponse.data || []);
          setInterviews(interviewsResponse.data || []);
        } catch (err) {
          console.error("Error fetching recruitment data:", err);
          // Don't set error state here to prevent the entire dashboard from showing an error
        }
        
        // 8. Fetch payroll data
        const payrollRes = await axios.get("https://1wj5891jxg.execute-api.ap-southeast-1.amazonaws.com/dev/api/payroll/payrolls/");
        const payroll = payrollRes.data;
        
        // 9. Fetch training data
        // const trainingRes = await axios.get("https://1wj5891jxg.execute-api.ap-southeast-1.amazonaws.com/dev/api/training/employee_trainings/");
        // const training = trainingRes.data;
        
        // Initialize training as empty array since API call is commented out
        const training = [];
        
        // 10. Fetch overtime data
        const overtimeResponse = await axios.get("https://1wj5891jxg.execute-api.ap-southeast-1.amazonaws.com/dev/api/overtime_requests/");
        setOvertimeRequestsData(overtimeResponse.data);
        
        // 11. Fetch positions data
        const positionsRes = await axios.get("https://1wj5891jxg.execute-api.ap-southeast-1.amazonaws.com/dev/api/positions/positions/");
        setPositions(positionsRes.data);
        
        // 12. Fetch candidates data
        const candidatesRes = await axios.get("https://1wj5891jxg.execute-api.ap-southeast-1.amazonaws.com/dev/api/candidates/candidates/");
        setCandidates(candidatesRes.data);

        // 13. Fetch interviews data
        const interviewsRes = await axios.get("https://1wj5891jxg.execute-api.ap-southeast-1.amazonaws.com/dev/api/interviews/");
        setInterviews(interviewsRes.data);

        // 14. Fetch job postings data
        const jobPostingsRes = await axios.get("https://1wj5891jxg.execute-api.ap-southeast-1.amazonaws.com/dev/api/job_posting/job_postings/");
        setJobPostings(jobPostingsRes.data);

        // 15. Fetch onboarding tasks data
        const onboardingTasksRes = await axios.get("https://1wj5891jxg.execute-api.ap-southeast-1.amazonaws.com/dev/api/onboarding/");
        setOnboardingTasks(onboardingTasksRes.data);

        // Process leave requests for table and chart
        const sortedLeaveRequests = allLeaveRequests.sort((a, b) => 
          new Date(b.start_date) - new Date(a.start_date)
        );
        setLeaveRequests(sortedLeaveRequests.slice(0, 5));
        
        // Process leave type data for chart
        const leaveTypeCounts = allLeaveRequests.reduce((acc, lr) => {
          acc[lr.leave_type] = (acc[lr.leave_type] || 0) + 1;
          return acc;
        }, {});
        setLeaveTypeData(Object.keys(leaveTypeCounts).map(key => ({
          name: key,
          count: leaveTypeCounts[key]
        })));
        
        // Process performance data for table and chart
        const sortedPerformance = allPerformanceData.sort((a, b) =>
          new Date(b.review_date) - new Date(a.review_date)
        );
        setEmployeePerformance(sortedPerformance.slice(0, 5));
        
        // Process performance distribution data
        const distribution = sortedPerformance.reduce((acc, perf) => {
          acc[perf.rating] = (acc[perf.rating] || 0) + 1;
          return acc;
        }, {});
        setPerformanceDistribution(Object.keys(distribution).map(key => ({
          name: RATING_LABELS[key],
          value: distribution[key]
        })));
        
        // Process department distribution data
        const deptCounts = employees.reduce((acc, emp) => {
          const deptName = departments.find(d => d.dept_id === emp.dept_id)?.dept_name || 'Unassigned';
          acc[deptName] = (acc[deptName] || 0) + 1;
          return acc;
        }, {});
        
        setDepartmentData(Object.keys(deptCounts).map(dept => ({
          name: dept,
          value: deptCounts[dept]
        })));
        
        // Process recruitment pipeline data
        const recruitmentStages = {
          'Application': 0,
          'Screening': 0,
          'Interview': 0,
          'Job Offer': 0,
          'Hired': 0
        };
        
        // Create a default empty array if recruitment data isn't available
        const recruitment = [];
        
        recruitment.forEach(applicant => {
          const stage = applicant.stage || 'Application';
          recruitmentStages[stage] = (recruitmentStages[stage] || 0) + 1;
        });
        
        const recruitmentData = Object.entries(recruitmentStages).map(([stage, count]) => ({
          stage,
          count
        }));
        
        setRecruitmentData(recruitmentData);
        
        // Process resignation data for turnover chart
        // Group resignations by month and count them
        const lastSixMonths = Array(6).fill().map((_, i) => {
          const d = new Date();
          d.setMonth(d.getMonth() - i);
          return d.toLocaleString('default', { month: 'short', year: 'numeric' });
        }).reverse();
        
        const resignationsByMonth = lastSixMonths.map(month => {
          const [monthName, yearStr] = month.split(' ');
          const year = parseInt(yearStr);
          
          const count = resignations.filter(r => {
            const date = new Date(r.resignation_date);
            return date.getFullYear() === year && 
                   date.toLocaleString('default', { month: 'short' }) === monthName;
          }).length;
          
          // Calculate turnover rate (monthly resignations / total employees * 100)
          const rate = totalEmployees > 0 ? ((count / totalEmployees) * 100).toFixed(1) : 0;
          
          return { 
            month, 
            count,
            rate: parseFloat(rate)
          };
        });
        
        setResignationData(resignationsByMonth);
        setTurnoverData(resignationsByMonth);
        
        // Process payroll data for chart
        // Group by month and calculate totals
        const payrollMonths = [...new Set(payroll.map(p => {
          const date = new Date(p.payment_date);
          return date.toLocaleString('default', { month: 'short', year: 'numeric' });
        }))].sort((a, b) => {
          return new Date(a) - new Date(b);
        }).slice(-6); // Get the last 6 months
        
        const payrollByMonth = payrollMonths.map(month => {
          const [monthName, yearStr] = month.split(' ');
          const year = parseInt(yearStr);
          
          const monthlyPayroll = payroll.filter(p => {
            const date = new Date(p.payment_date);
            return date.getFullYear() === year && 
                   date.toLocaleString('default', { month: 'short' }) === monthName;
          });
          
          const salary = monthlyPayroll.reduce((sum, p) => sum + parseFloat(p.base_salary || 0), 0);
          const benefits = monthlyPayroll.reduce((sum, p) => sum + parseFloat(p.benefits || 0), 0);
          const bonus = monthlyPayroll.reduce((sum, p) => sum + parseFloat(p.bonus || 0), 0);
          
          return {
            month: monthName,
            salary,
            benefits,
            bonus
          };
        });
        
        setPayrollData(payrollByMonth);
        
        // Process department workload allocation
        const workforceData = departments.map(dept => {
          const deptEmployees = employees.filter(e => e.dept_id === dept.dept_id);
          return {
            department: dept.dept_name,
            allocated: parseInt(dept.allocated_headcount || deptEmployees.length),
            actual: deptEmployees.length
          };
        });
        
        setWorkforceAllocation(workforceData);
        
        // Process employee growth data
        // Group employees by hire date to see growth over time
        const monthlyHeadcount = lastSixMonths.map((month, index) => {
          const [monthName, yearStr] = month.split(' ');
          const year = parseInt(yearStr);
          const monthIndex = new Date(`${monthName} 1, ${year}`).getMonth();
          
          // Count employees hired before or during this month
          const count = employees.filter(emp => {
            const hireDate = new Date(emp.hire_date);
            return hireDate <= new Date(year, monthIndex, 31);
          }).length;
          
          return {
            month: monthName,
            headcount: count
          };
        });
        
        setEmployeeGrowthData(monthlyHeadcount);
        
        // Process training data
        const trainingCategories = [...new Set(training.map(t => t.training_type))];
        
        const trainingStatus = trainingCategories.map(category => {
          const categoryTrainings = training.filter(t => t.training_type === category);
          const total = categoryTrainings.length;
          const completed = categoryTrainings.filter(t => t.status === 'Completed').length;
          
          return {
            name: category,
            completed,
            required: total
          };
        });
        
        setTrainingData(trainingStatus);

        setError(null);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Add this helper function inside the HRDashboard component
  const calculateTotalEmployeeTrend = () => {
    // Use employee type counts to calculate a trend
    const totalTyped = (employeeStats.regular || 0) + 
                      (employeeStats.contractual || 0) + 
                      (employeeStats.seasonal || 0);
                      
    // If there's a difference between total employees and sum of types,
    // it means there's been some change in employee count
    const diff = employeeStats.total - totalTyped;
    const percentChange = totalTyped > 0 
      ? ((diff / totalTyped) * 100).toFixed(1) 
      : "0.0";
    
    return `${percentChange}%`;
  };

  // Add this function at the component level
  const safeRenderReport = (Component, props) => {
    if (!Component) {
      console.error("Report Component is undefined for:", activeReport);
      return <FallbackReportContent title={activeReport} />;
    }
    
    try {
      // More robust check for required props
      if (!props || typeof props !== 'object') {
        console.error(`Invalid props object for ${activeReport} report`);
        return <FallbackReportContent title={activeReport} />;
      }
      
      console.log(`Rendering ${activeReport} report with props:`, props);
      // Render with extra error boundary
      return <Component {...props} />;
    } catch (error) {
      console.error(`Error rendering ${activeReport} report:`, error);
      return <FallbackReportContent title={activeReport} />;
    }
  };

  // Add this helper function to calculate average rating
  const calcAvgRating = () => {
    if (!interviews || interviews.length === 0) return 0;
    
    const ratings = interviews
      .filter(interview => interview && interview.rating)
      .map(interview => interview.rating);
    
    if (ratings.length === 0) return 0;
    
    const avgRating = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
    return avgRating.toFixed(1);
  };

  return (
    <div className="hr">
      <div className="hr-body-content-container">
        <div className="hr-dashboard-scrollable">
          <div className="hr-dashboard">
            <div className="hr-dashboard-header">
              <div className="hr-dashboard-title">
                <h2>Human Resources Dashboard</h2>
              </div>
              <div className="hr-dashboard-controls">
                <input type="date" className="hr-date-selector" defaultValue={new Date().toISOString().split('T')[0]} />
              </div>
            </div>
            
            {/* Key metrics row */}
            <div className="hr-key-metrics">
              <div className="hr-metric-card primary interactive" onClick={() => navigateTo('/employees')} title="View employee details">
                <div className="hr-metric-header">
                  <p className="hr-metric-title">Total Employees</p>
                  <div className="hr-metric-icon">
                    <i className="fas fa-users"></i>
                  </div>
                </div>
                <p className="hr-metric-value">{loading ? "..." : employeeStats.total}</p>
                <div className="hr-metric-trend">
                  <span className={employeeStats.total > 0 ? "hr-trend-up" : "hr-trend-down"}>
                    {loading ? "..." : `${((employeeStats.total / (employeeStats.total || 1)) * 100).toFixed(1)}%`}
                  </span> workforce capacity
                </div>
              </div>
              
              <div className="hr-metric-card success interactive" onClick={() => navigateTo('/attendance')} title="View attendance details">
                <div className="hr-metric-header">
                  <p className="hr-metric-title">Present Today</p>
                  <div className="hr-metric-icon">
                    <i className="fas fa-check-circle"></i>
                  </div>
                </div>
                <p className="hr-metric-value">{loading ? "..." : employeeStats.present}</p>
                <div className="hr-metric-trend">
                  <span className="hr-trend-up">
                    {loading ? "..." : `${((employeeStats.present / employeeStats.total) * 100).toFixed(1)}%`}
                  </span> attendance rate
                </div>
              </div>
              
              <div className="hr-metric-card warning interactive" onClick={() => navigateTo('/attendance')} title="View absent employees">
                <div className="hr-metric-header">
                  <p className="hr-metric-title">Absent Today</p>
                  <div className="hr-metric-icon">
                    <i className="fas fa-user-times"></i>
                  </div>
                </div>
                <p className="hr-metric-value">{loading ? "..." : employeeStats.absent}</p>
                <div className="hr-metric-trend">
                  <span className={employeeStats.absent === 0 ? "hr-trend-up" : "hr-trend-down"}>
                    {loading ? "..." : `${((employeeStats.absent / employeeStats.total) * 100).toFixed(1)}%`}
                  </span> absentee rate
                </div>
              </div>
              
              <div className="hr-metric-card accent1 interactive" onClick={() => navigateTo('/attendance')} title="View late employees">
                <div className="hr-metric-header">
                  <p className="hr-metric-title">Late Today</p>
                  <div className="hr-metric-icon">
                    <i className="fas fa-clock"></i>
                  </div>
                </div>
                <p className="hr-metric-value">{loading ? "..." : employeeStats.late}</p>
                <div className="hr-metric-trend">
                  <span className={employeeStats.late === 0 ? "hr-trend-up" : "hr-trend-down"}>
                    {loading ? "..." : `${((employeeStats.late / employeeStats.total) * 100).toFixed(1)}%`}
                  </span> late rate
                </div>
              </div>
              
              <div className="hr-metric-card info interactive" onClick={() => navigateTo('/leave-requests')} title="View leave requests">
                <div className="hr-metric-header">
                  <p className="hr-metric-title">On Leave</p>
                  <div className="hr-metric-icon">
                    <i className="fas fa-calendar-alt"></i>
                  </div>
                </div>
                <p className="hr-metric-value">{loading ? "..." : employeeStats.onLeave}</p>
                <div className="hr-metric-trend">
                  <span className={employeeStats.onLeave === 0 ? "hr-trend-up" : "hr-trend-down"}>
                    {loading ? "..." : `${((employeeStats.onLeave / employeeStats.total) * 100).toFixed(1)}%`}
                  </span> leave rate
                </div>
              </div>
            </div>
            
            {/* Main content grid */}
            <div className="hr-main-grid">
              <div className="hr-column-main">
                {/* Replace both sections with the new component */}
                <RecruitmentAnalytics navigateTo={navigateTo} />
              </div>
              
              <div className="hr-column-side">
                {/* Employee Breakdown */}
                <div className="hr-employee-breakdown interactive" onClick={() => navigateTo('/employees', { filterValue: 'employment_type' })}>
                  <div className="hr-breakdown-header">
                    <h3 className="hr-breakdown-title">Employee Breakdown</h3>
                    <div className="hr-chart-action">
                      <i className="fas fa-filter"></i>
                    </div>
                  </div>
                  
                  <div className="hr-donut-chart">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <defs>
                          <radialGradient id="employeeType-regular" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                            <stop offset="0%" stopColor={createShade(kinetiqColors.primary, 0.2)} stopOpacity={0.9} />
                            <stop offset="100%" stopColor={kinetiqColors.primary} stopOpacity={1} />
                          </radialGradient>
                          <radialGradient id="employeeType-contractual" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                            <stop offset="0%" stopColor={createShade(kinetiqColors.accent1, 0.2)} stopOpacity={0.9} />
                            <stop offset="100%" stopColor={kinetiqColors.accent1} stopOpacity={1} />
                          </radialGradient>
                          <radialGradient id="employeeType-seasonal" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                            <stop offset="0%" stopColor={createShade(kinetiqColors.secondary, 0.2)} stopOpacity={0.9} />
                            <stop offset="100%" stopColor={kinetiqColors.secondary} stopOpacity={1} />
                          </radialGradient>
                        </defs>
                        <Pie
                          data={[
                            { name: 'Regular', value: employeeStats.regular || 0 },
                            { name: 'Contractual', value: employeeStats.contractual || 0 },
                            { name: 'Seasonal', value: employeeStats.seasonal || 0 }
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={70}
                          fill="#8884d8"
                          dataKey="value"
                          label={renderCustomizedLabel}
                        >
                          <Cell fill="url(#employeeType-regular)" />
                          <Cell fill="url(#employeeType-contractual)" />
                          <Cell fill="url(#employeeType-seasonal)" />
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} employees`, '']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="hr-employee-type-list">
                    <div className="hr-employee-type-item">
                      <div className="hr-employee-type-info">
                        <span className="hr-employee-type-color regular"></span>
                        <span className="hr-employee-type-label">Regular</span>
                      </div>
                      <span className="hr-employee-type-count">{loading ? "..." : employeeStats.regular || 0}</span>
                    </div>
                    <div className="hr-employee-type-item">
                      <div className="hr-employee-type-info">
                        <span className="hr-employee-type-color contractual"></span>
                        <span className="hr-employee-type-label">Contractual</span>
                      </div>
                      <span className="hr-employee-type-count">{loading ? "..." : employeeStats.contractual || 0}</span>
                    </div>
                    <div className="hr-employee-type-item">
                      <div className="hr-employee-type-info">
                        <span className="hr-employee-type-color seasonal"></span>
                        <span className="hr-employee-type-label">Seasonal</span>
                      </div>
                      <span className="hr-employee-type-count">{loading ? "..." : employeeStats.seasonal || 0}</span>
                    </div>
                  </div>
                  
                  <div className="hr-overlay-hint">
                    <span>View detailed employee breakdown</span>
                  </div>
                </div>
                
                {/* Add Recruitment Metrics here */}
                <div className="hr-recruitment-metrics">
                  <div className="hr-section-header">
                    <h3><strong>Recruitment Metrics</strong></h3>
                    <button 
                      className="hr-view-all-btn" 
                      onClick={() => navigateTo('/recruitment')}
                    >
                      View All
                    </button>
                  </div>
                  
                  <div className="recruitment-metrics-row">
                    <div className="recruitment-metric-card primary">
                      <div className="metric-icon">
                        <i className="fas fa-users"></i>
                      </div>
                      <div className="metric-content">
                        <h3>{loading ? "..." : candidates?.length || 0}</h3>
                        <p>Total Candidates</p>
                      </div>
                      <div className="metric-trend">
                        <i className="fas fa-chart-line"></i>
                      </div>
                    </div>
                    
                    <div className="recruitment-metric-card accent1">
                      <div className="metric-icon">
                        <i className="fas fa-file-alt"></i>
                      </div>
                      <div className="metric-content">
                        <h3>{loading ? "..." : 
                          candidates?.filter(c => {
                            try {
                              const createDate = new Date(c.created_at);
                              const thirtyDaysAgo = new Date();
                              thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                              return createDate >= thirtyDaysAgo;
                            } catch(e) {
                              return false;
                            }
                          })?.length || 0
                        }</h3>
                        <p>New Applications</p>
                      </div>
                      <div className="metric-trend">
                        <i className="fas fa-arrow-up"></i>
                      </div>
                    </div>
                    
                    <div className="recruitment-metric-card accent5">
                      <div className="metric-icon">
                        <i className="fas fa-calendar-check"></i>
                      </div>
                      <div className="metric-content">
                        <h3>{loading ? "..." : interviews?.filter(i => i.status === 'Scheduled')?.length || 0}</h3>
                        <p>Scheduled Interviews</p>
                      </div>
                      <div className="metric-trend">
                        <i className="fas fa-clock"></i>
                      </div>
                    </div>
                    
                    <div className="recruitment-metric-card secondary">
                      <div className="metric-icon">
                        <i className="fas fa-star"></i>
                      </div>
                      <div className="metric-content">
                        <h3>{loading ? "..." : calcAvgRating()}/5.0</h3>
                        <p>Avg. Interview Rating</p>
                      </div>
                      <div className="metric-trend">
                        <div className="rating-stars">
                          {[1, 2, 3, 4, 5].map(star => (
                            <i key={star} className={`fas fa-star ${star <= Math.round(calcAvgRating()) ? 'filled' : ''}`}></i>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Calendar */}
                <div className="hr-calendar-container">
                  <div className="hr-section-header">
                    <h3><strong>Calendar</strong></h3>
                    <button 
                      className="hr-view-all-btn" 
                      onClick={() => navigateTo('/attendance')}
                    >
                      View All
                    </button>
                  </div>
                  <Calendar 
                    leaveRequests={leaveRequests} 
                    navigateTo={navigateTo} 
                  />
                </div>
              </div>
            </div>
            
            {/* Summary Reports Section */}
            <div className="hr-metrics-section">
              <div className="hr-section-header">
                <h3><strong>Summary Reports</strong></h3>
                <div className="hr-metrics-period-selector">
                  <button 
                    className={`hr-period-btn ${activePeriod === 'monthly' ? 'active' : ''}`}
                    onClick={() => setActivePeriod('monthly')}
                  >
                    Monthly
                  </button>
                  <button 
                    className={`hr-period-btn ${activePeriod === 'quarterly' ? 'active' : ''}`}
                    onClick={() => setActivePeriod('quarterly')}
                  >
                    Quarterly
                  </button>
                  <button 
                    className={`hr-period-btn ${activePeriod === 'yearly' ? 'active' : ''}`}
                    onClick={() => setActivePeriod('yearly')}
                  >
                    Yearly
                  </button>
                </div>
              </div>
              
              <div className="hr-metrics-grid">
                {/* Chart containers removed as requested */}
              </div>
              
              <div className="hr-reports-selector">
                <button 
                  className={`hr-report-tab ${activeReport === 'department' ? 'active' : ''}`} 
                  onClick={() => setActiveReport('department')}
                >
                  Department
                </button>
                <button 
                  className={`hr-report-tab ${activeReport === 'workforce' ? 'active' : ''}`} 
                  onClick={() => setActiveReport('workforce')}
                >
                  Workforce Allocation
                </button>
                <button 
                  className={`hr-report-tab ${activeReport === 'leave' ? 'active' : ''}`} 
                  onClick={() => setActiveReport('leave')}
                >
                  Leave Requests
                </button>
                <button 
                  className={`hr-report-tab ${activeReport === 'performance' ? 'active' : ''}`} 
                  onClick={() => setActiveReport('performance')}
                >
                  Employee Performance
                </button>
                <button 
                  className={`hr-report-tab ${activeReport === 'salary' ? 'active' : ''}`} 
                  onClick={() => setActiveReport('salary')}
                >
                  Employee Salary
                </button>
                {/* Add new report buttons */}
                <button 
                  className={`hr-report-tab ${activeReport === 'attendance' ? 'active' : ''}`} 
                  onClick={() => setActiveReport('attendance')}
                >
                  Attendance
                </button>
                <button 
                  className={`hr-report-tab ${activeReport === 'candidates' ? 'active' : ''}`} 
                  onClick={() => setActiveReport('candidates')}
                >
                  Candidates
                </button>
                <button 
                  className={`hr-report-tab ${activeReport === 'employees' ? 'active' : ''}`} 
                  onClick={() => setActiveReport('employees')}
                >
                  Employees
                </button>
                <button 
                  className={`hr-report-tab ${activeReport === 'interviews' ? 'active' : ''}`} 
                  onClick={() => setActiveReport('interviews')}
                >
                  Interviews
                </button>
                <button 
                  className={`hr-report-tab ${activeReport === 'jobPosting' ? 'active' : ''}`} 
                  onClick={() => setActiveReport('jobPosting')}
                >
                  Job Posting
                </button>
                <button 
                  className={`hr-report-tab ${activeReport === 'onboarding' ? 'active' : ''}`} 
                  onClick={() => setActiveReport('onboarding')}
                >
                  Onboarding
                </button>
                <button 
                  className={`hr-report-tab ${activeReport === 'overtime' ? 'active' : ''}`} 
                  onClick={() => setActiveReport('overtime')}
                >
                  Overtime
                </button>
                <button 
                  className={`hr-report-tab ${activeReport === 'payroll' ? 'active' : ''}`} 
                  onClick={() => setActiveReport('resignations')}
                >
                  Resignations
                </button>
              </div>
              
              <div className={`hr-report-container ${activePeriod}`}>
                {activeReport === 'department' && (
                  safeRenderReport(DepartmentSummaryReport, {
                    departments: departmentData,
                    superiors: departmentSuperiors,
                    period: activePeriod // Pass the active period to the report
                  })
                )}
                
                {activeReport === 'workforce' && (
                  safeRenderReport(WorkforceAllocationSummaryReport, {
                    allocations: workforceAllocation,
                    trends: employeeGrowthData,
                    period: activePeriod
                  })
                )}
                
                {activeReport === 'leave' && (
                  safeRenderReport(LeaveRequestSummaryReport, {
                    leaveRequests: leaveRequests,
                    period: activePeriod
                  })
                )}
                
                {activeReport === 'performance' && (
                  safeRenderReport(EmployeePerformanceSummaryReport, {
                    performanceData: employeePerformance,
                    period: activePeriod
                  })
                )}
                
                {activeReport === 'salary' && (
                  safeRenderReport(EmployeeSalarySummaryReport, {
                    salaryData: [
                      { employee_id: "Sample", employee_name: "Sample Employee", base_salary: 50000, employment_type: "Regular" }
                    ],
                    period: activePeriod
                  })
                )}
                
                {/* Add new report components */}
                {activeReport === 'attendance' && (
                  safeRenderReport(AttendanceSummaryReport, {
                    attendance: attendanceData && attendanceData.length > 0 ? attendanceData : [
                      { date: new Date().toISOString().split('T')[0], status: "Present", employee_name: "Sample" }
                    ],
                    totalEmployees: employeeStats.total || 0,
                    period: activePeriod
                  })
                )}
                
                {activeReport === 'candidates' && (
                  safeRenderReport(CandidatesSummaryReport, {
                    candidates: candidates || [],
                    period: activePeriod
                  })
                )}
                
                {activeReport === 'employees' && (
                  safeRenderReport(EmployeesSummaryReport, {
                    employees: employees || [],
                    period: activePeriod
                  })
                )}
                
                {activeReport === 'interviews' && (
                  safeRenderReport(InterviewsSummaryReport, {
                    interviews: interviews || [],
                    period: activePeriod
                  })
                )}
                
                {activeReport === 'jobPosting' && (
                  safeRenderReport(JobPostingSummaryReport, {
                    jobPostings: jobPostings || [],
                    period: activePeriod
                  })
                )}
                
                {activeReport === 'onboarding' && (
                  safeRenderReport(OnboardingSummaryReport, {
                    onboarding: onboardingTasks || [],
                    period: activePeriod
                  })
                )}
                
                {activeReport === 'overtime' && (
                  safeRenderReport(OvertimeSummaryReport, {
                    overtimeRequests: overtimeRequestsData || [],
                    period: activePeriod
                  })
                )}
                
                {activeReport === 'payroll' && (
                  safeRenderReport(PayrollSummaryReport, {
                    payroll: payrollData || [],
                    period: activePeriod
                  })
                )}
                
                {activeReport === 'positions' && (
                  safeRenderReport(PositionsSummaryReport, {
                    positions: positions || [],
                    employees: employees || [],
                    period: activePeriod
                  })
                )}
                
                {activeReport === 'resignations' && (
                  safeRenderReport(ResignationsSummaryReport, {
                    resignations: resignations || [],
                    employees: employees || [],
                    period: activePeriod
                  })
                )}
                
                {!activeReport && (
                  <div className="hr-no-report-selected">
                    <p>Select a report type above to view detailed summary</p>
                  </div>
                )}
              </div>
              
              <div className="hr-metrics-footer">
                <button className="hr-view-all-btn">View Detailed Analytics</button>
                <div className="hr-last-updated">
                  Last updated: {new Date().toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRDashboard;
