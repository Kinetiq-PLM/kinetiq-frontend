import React, { useState, useEffect } from "react";
import "../styles/accounting-styling.css";
import NotifModal from "../components/modalNotif/NotifModal";
import Table from "../components/table/Table";

const PayrollAccounting = () => {
  const [data, setData] = useState([]); // State to store table data
  const [isLoading, setIsLoading] = useState(true); // State to manage loading state
  const [validation, setValidation] = useState({
    isOpen: false,
    type: "",
    title: "",
    message: "",
  });

  const columns = [
    "Payroll ID",
    "Employee ID",
    "Pay Period Start",
    "Pay Period End",
    "Employment Type",
    "Base Salary",
    "Overtime Hours",
    "Overtime Pay",
    "Holiday Pay",
    "Bonus Pay",
    "13th Month Pay",
    "Gross Pay",
    "SSS Contribution",
    "Philhealth Contribution",
    "Pagibig Contribution",
    "Tax",
    "Late Deduction",
    "Absent Deduction",
    "Undertime Deduction",
    "Total Deductions",
    "Net Pay",
    "Status",
    "Created At",
    "Updated At",
  ];


  // API Endpoint
  const API_URL =
    import.meta.env.VITE_API_URL ||
    "https://vyr3yqctq8.execute-api.ap-southeast-1.amazonaws.com/dev";
  const PAYROLL_ENDPOINT = `${API_URL}/api/payrolls/`;


  // Fetch data from the API
  useEffect(() => {
    const fetchPayrollData = async () => {
      try {

        // Store the data in a variable
        const response = await fetch(PAYROLL_ENDPOINT);


        // Convert the response to JSON then pass to the variable
        const result = await response.json();


        // Transform the data to match the table structure
        const transformedData = result.map((item) => [
          item.payroll_id,
          item.employee_id,
          item.pay_period_start,
          item.pay_period_end,
          item.employment_type,
          item.base_salary,
          item.overtime_hours,
          item.overtime_pay,
          item.holiday_pay,
          item.bonus_pay,
          item.thirteenth_month_pay,
          item.gross_pay,
          item.sss_contribution,
          item.philhealth_contribution,
          item.pagibig_contribution,
          item.tax,
          item.late_deduction,
          item.absent_deduction,
          item.undertime_deduction,
          item.total_deductions,
          item.net_pay,
          item.status,
          item.created_at,
          item.updated_at,
        ]);

        setData(transformedData); // Set the transformed data to state
      } catch (error) {
        console.error("Error fetching payroll data:", error); // Log any errors
        setValidation({
          isOpen: true,
          type: "error",
          title: "Error",
          message: "Failed to fetch payroll data. Please try again later.",
        });
      } finally {
        setIsLoading(false); // Set loading to false after data is fetched
      }
    };

    fetchPayrollData(); // Call the function to fetch data
  }, []); // Empty dependency array to run once on mount

  // Loading spinner component
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center p-8 mt-30">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      <p className="ml-4 text-gray-600">Loading general ledger accounts data...</p>
    </div>
  );

  return (
    <div className="accountsPayable">
      <div className="body-content-container">
        <div className="title-subtitle-container">
          <h1 className="subModule-title">Payroll Accounting</h1>
        </div>






        <div className="title-subtitle-container">
          <h1 className="subModule-title">Payroll</h1>
          {isLoading ? (
            <LoadingSpinner /> // Show loading spinner while data is being fetched
          ) : (
            <Table columns={columns} data={data} />
          )}
        </div>

      </div>
    </div>
  );
};

export default PayrollAccounting;