import React, { useState, useEffect } from "react";
import "../styles/accounting-styling.css";
import NotifModal from "../components/modalNotif/NotifModal";
import Table from "../components/table/Table";
import Button from "../components/button/Button";
import Search from "../components/search/Search";
import { data } from "autoprefixer";

const PayrollAccounting = () => {
  const [payrollAccountingData, setPayrollAccountingData] = useState([]);
  const [payrollData, setPayrollData] = useState([]);
  const [searching, setSearching] = useState("");
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

        // Sort data by date_approved (latest first)
        result.sort((a, b) => new Date(b.date_approved) - new Date(a.date_approved));

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


  // Handle row selection
  const handlePrintRow = (rowData) => {
    const printWindow = window.open('', '_blank');

    const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Kinetiq - PLM - Payroll Record</title>
        <style>
          @page {
            size: letter;
            margin: 0.5in;
          }
          body {
            font-family: Arial, sans-serif;
            padding: 0;
            margin: 0;
            background-color: #ffffff;
            color: #333333;
          }
          .container {
            max-width: 100%;
            margin: 0 auto;
          }
          .header {
            border-bottom: 2px solid #0055a5;
            padding-bottom: 15px;
            margin-bottom: 25px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .logo {
            font-size: 24px;
            font-weight: bold;
            color: #0055a5;
          }
          .logo-subtitle {
            font-size: 14px;
            color: #777;
          }
          .document-title {
            text-align: center;
            font-size: 20px;
            font-weight: bold;
            margin: 20px 0;
            color: #0055a5;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          th, td {
            padding: 10px 15px;
            border-bottom: 1px solid #ddd;
            text-align: left;
          }
          tr:nth-child(even) {
            background-color: #f9f9f9;
          }
          .footer {
            margin-top: 40px;
            padding-top: 15px;
            border-top: 1px solid #ddd;
            text-align: center;
            font-size: 12px;
            color: #777;
          }
          .confidential {
            color: #cc0000;
            font-style: italic;
            margin-bottom: 10px;
          }
          .watermark {
            position: absolute;
            top: 50%;
            left: 0;
            width: 100%;
            text-align: center;
            font-size: 100px;
            color: rgba(0, 0, 0, 0.03);
            transform: rotate(-45deg);
            z-index: -1;
          }
        </style>
      </head>
      <body>
        <div class="watermark">COPY</div>
        <div class="container">
          <div class="header">
            <div>
              <div class="logo">Kinetiq - PLM</div>
              <div class="logo-subtitle">Medical Equipment Manufacturing Company.</div>
            </div>
          </div>
  
          <div class="document-title">PAYROLL RECORD</div>
          
          <table>
            <tbody>
              ${payrollAccounting_columns.map((col, i) => `
                <tr>
                  <td><strong>${col}</strong></td>
                  <td>${rowData[i] ?? '-'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
  
          <div class="footer">
            <div class="confidential">CONFIDENTIAL - For Employee Use Only</div>
            <div>Kinetiq - PLM</div>
            <div>Printed on ${new Date().toLocaleString()}</div>
          </div>
        </div>
        <script>
          window.onload = () => {
            window.print();
          };
          window.onafterprint = () => {
            window.close();
          };
        </script>
      </body>
    </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };


  // Search Filter based on columns
  const filteredData = payrollAccountingData.filter((row) =>
    [row[0], row[1], row[2], row[3], row[4], row[5]]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(searching.toLowerCase())
  );


  // Loading spinner component
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center p-8 mt-30">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      <p className="ml-4 text-gray-600">Loading payroll data...</p>
    </div>
  );


  const handleEditRow = (row) => {
    // logic to open edit modal, or update state
    console.log("Edit this row:", row);
  };

  return (
    <div className="accountsPayable">
      <div className="body-content-container">
        <div className="title-subtitle-container">
          <h1 className="subModule-title">Payroll Accounting</h1>
        </div>

        <div className="parent-component-container">
          <div className="component-container">
          <Search
            type="text"
            placeholder="Search Record..."
            value={searching}
            onChange={(e) => setSearching(e.target.value)}
          />
          </div>

          <div className="component-container">
            <Button name="Update" variant="standard2" />

          </div>
        </div>

        {/* Payroll Accounting Data */}
        <div className="title-subtitle-container">
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <Table
              columns={payrollAccounting_columns}
              data={filteredData}
              handlePrintRow={handlePrintRow}
              handleEditRow={handleEditRow}
              showPrintButton={true}
              showEditButton={true}
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
    </div>
  );
};

export default PayrollAccounting;