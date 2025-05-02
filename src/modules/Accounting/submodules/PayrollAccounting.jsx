import React, { useState, useEffect } from "react";
import "../styles/accounting-styling.css";
import NotifModal from "../components/modalNotif/NotifModal";
import Table from "../components/table/Table";
import Button from "../components/button/Button";
import Search from "../components/search/Search";

const PayrollAccounting = () => {
  const [payrollData, setPayrollData] = useState([]);
  const [payrollAccountingData, setPayrollAccountingData] = useState([]);
  const [selectedPayrollAccountingRow, setSelectedPayrollAccountingRow] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [validation, setValidation] = useState({
    isOpen: false,
    type: "",
    title: "",
    message: "",
  });

  // Updated columns to match PayrollJournalView fields
  const payroll_columns = [
    "Payroll Accounting ID",
    "Payroll HR ID",
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
    "Total Bonuses",
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
    "Date Approved",
    "Reference Number",
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
  const PAYROLL_ENDPOINT = `${API_URL}/api/payroll-journal/`; // Updated to payroll-journal
  const PAYROLL_ACCOUNTING_ENDPOINT = `${API_URL}/api/payroll-accounting/`;

  // Fetch data from the API
  useEffect(() => {
    // Fetch payroll data
    const fetchPayrollData = async () => {
      try {
        const response = await fetch(PAYROLL_ENDPOINT);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();

        // Transform the data to match the table structure
        const transformedData = result.map((item) => [
          item.payroll_accounting_id,
          item.payroll_hr_id,
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
          item.total_bonuses,
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
          item.date_approved,
          item.reference_number,
        ]);

        setPayrollData(transformedData);
      } catch (error) {
        console.error("Error fetching payroll data:", error);
        setValidation({
          isOpen: true,
          type: "error",
          title: "Error",
          message: "Failed to fetch payroll data. Please try again later.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    // Fetch payroll accounting data
    const fetchPayrollAccountingData = async () => {
      try {
        const response = await fetch(PAYROLL_ACCOUNTING_ENDPOINT);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
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

        setPayrollAccountingData(transformedData);
      } catch (error) {
        console.error("Error fetching payroll accounting data:", error);
        setValidation({
          isOpen: true,
          type: "error",
          title: "Error",
          message: "Failed to fetch payroll accounting data. Please try again later.",
        });
      } finally {
        setIsLoading(false);
      }
    };

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

  const handlePrintRow = (rowData) => {
    const printWindow = window.open('', '_blank');
    const html = `
        <html>
            <head>
                <title>Payroll Row</title>
                <style>
                    body { font-family: sans-serif; padding: 20px; }
                    table { width: 100%; border-collapse: collapse; }
                    td, th { border: 1px solid #ccc; padding: 8px; }
                </style>
            </head>
            <body>
                <h2>Payroll Row Details</h2>
                <table>
                    <tbody>
                        ${payrollAccounting_columns.map((col, index) => `
                            <tr>
                                <th>${col}</th>
                                <td>${rowData[index]}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <script>
                    window.onload = function() {
                        window.print();
                    }
                </script>
            </body>
        </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
  };


  const printPayrollContent = () => {
    if (!selectedPayrollAccountingRow) {
      alert("Please select a row to print.");
      return;
    }

    const printContents = document.getElementById("printable-payroll").innerHTML;
    const originalContents = document.body.innerHTML;
    const originalScroll = window.scrollY;

    document.body.innerHTML = printContents;
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.overflow = "visible";

    setTimeout(() => {
      window.print();
      document.body.innerHTML = originalContents;
      window.scrollTo(0, originalScroll);
      window.location.reload();
    }, 200);
  };


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
            <Button name="Print PDF" variant="standard2" onclick={printPayrollContent} />
          </div>
        </div>

        {/* Payroll Accounting Data */}
        <div className="title-subtitle-container">
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <Table
              columns={payrollAccounting_columns}
              data={payrollAccountingData}
              handlePrintRow={handlePrintRow}
            />

          )}
        </div>

        <div className="my-20"></div>

        {/* Payroll Data */}
        <div className="title-subtitle-container">
          <h1 className="subModule-title">Payroll</h1>
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <Table
              columns={payrollAccounting_columns}
              data={payrollAccountingData}
              onRowSelect={(rowData) => setSelectedPayrollAccountingRow(rowData)}
            />

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

      {/* Printable Container */}
      <div id="printable-payroll" style={{ display: "none" }}>
        <div className="a4-container">
          <div className="header">
            <img src="/icons/Kinetiq-Logo.png" alt="Kinetiq Logo" className="logo" />
            <h1>Payroll Accounting Report</h1>
            <p>Generated on: {new Date().toLocaleDateString()}</p>
            <p>Company Name: Your Company Name</p>
            <p>Address: Your Company Address, City, Country</p>
            <p>Contact: your.email@example.com | +123456789</p>
          </div>

          <h2>Payroll Accounting</h2>
          <table className="print-table">
            <thead>
              <tr>
                {payrollAccounting_columns.map((col, index) => (
                  <th key={index}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {selectedPayrollAccountingRow ? (
                <tr>
                  {selectedPayrollAccountingRow.map((cell, index) => (
                    <td key={index}>{cell}</td>
                  ))}
                </tr>
              ) : (
                <tr>
                  <td colSpan={payrollAccounting_columns.length}>No row selected</td>
                </tr>
              )}

            </tbody>
          </table>

          <div className="page-break"></div>

          <h2>Payroll Details</h2>
          <table className="print-table">
            <thead>
              <tr>
                {payroll_columns.map((col, index) => (
                  <th key={index}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {payrollData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PayrollAccounting;