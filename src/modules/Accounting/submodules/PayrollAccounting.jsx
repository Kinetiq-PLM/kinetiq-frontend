import React, { useState, useEffect } from "react";
import "../styles/accounting-styling.css";
import NotifModal from "../components/modalNotif/NotifModal";
import Table from "../components/table/Table";
import Button from "../components/button/Button";
import Search from "../components/search/Search";

const PayrollAccounting = () => {
  const [payrollData, setPayrollData] = useState([]); // State to store table data
  const [payrollAccountingData, setPayrollAccountingData] = useState([]); // State to store table data
  const [isLoading, setIsLoading] = useState(true); // State to manage loading state
  const [validation, setValidation] = useState({
    isOpen: false,
    type: "",
    title: "",
    message: "",
  });

  const payroll_columns = [
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

  const payrollAccounting_columns = [
    "Payroll Accounting ID",
    "Payroll HR ID",
    "Date Approved",
    "Approved By",
    "Payment Method",
    "Reference Number",
    "Status",
  ];


  // API Endpoint
  const API_URL =
    import.meta.env.VITE_API_URL ||
    "https://vyr3yqctq8.execute-api.ap-southeast-1.amazonaws.com/dev";
  const PAYROLL_ENDPOINT = `${API_URL}/api/payrolls/`;
  const PAYROLL_ACCOUNTING_ENDPOINT = `${API_URL}/api/payroll_accounting/`;


  // Fetch data from the API
  useEffect(() => {

    // Fetch payroll data
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

        setPayrollData(transformedData); // Set the transformed data to state
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


    // Fetch payroll accounting data
    const fetchPayrollAccountingData = async () => {
      try {
        const response = await fetch(PAYROLL_ACCOUNTING_ENDPOINT);
        const result = await response.json();

        const transformedData = result.map((item) => [
          item.payroll_accounting_id,
          item.payroll_hr_id,
          item.date_approved,
          item.approved_by,
          item.payment_method,
          item.reference_number,
          item.status,
        ]);

        setPayrollAccountingData(transformedData); // Set the transformed data to state

      } catch (error) {
        console.error("Error fetching payroll accounting data:", error); // Log any errors
        setValidation({
          isOpen: true,
          type: "error",
          title: "Error",
          message: "Failed to fetch payroll accounting data. Please try again later.",
        });
      } finally {
        setIsLoading(false); // Set loading to false after data is fetched
      }
    }


    // Call the fetch functions
    fetchPayrollData();
    fetchPayrollAccountingData();
  }, []);


  // Loading spinner component
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center p-8 mt-30">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      <p className="ml-4 text-gray-600">Loading payroll data...</p>
    </div>
  );


  return (
    <div className="accountsPayable">
      <div className="body-content-container">
        <div className="title-subtitle-container">
          <h1 className="subModule-title">Payroll Accounting</h1>
        </div>


        <div className="parent-component-container">
          <div className="component-container">
            <Search />
          </div>

          <div className="component-container">
            <Button name="Update" variant="standard2" />
            <Button name="Print PDF" variant="standard2" />
          </div>
        </div>


        {/* Payroll Accounting Data */}
        <div className="title-subtitle-container">
          {isLoading ? (
            <LoadingSpinner /> 
          ) : (
            <Table columns={payrollAccounting_columns} data={payrollAccountingData} />
          )}
        </div>

        <div className="my-20"> </div>


        {/* Payroll Data */}
        <div className="title-subtitle-container">
          <h1 className="subModule-title">Payroll</h1>
          {isLoading ? (
            <LoadingSpinner /> 
          ) : (
            <Table columns={payroll_columns} data={payrollData} />
          )}
        </div>
      </div>

      {validation.isOpen && (
        <NotifModal
          isOpen={validation.isOpen}
          onClose={() => setValidation({ ...validation, isOpen: false })}
          type={validation.type}
          title={validation.title}
          message={validation.message}
        />
      )}
    </div>
  );
};

export default PayrollAccounting;