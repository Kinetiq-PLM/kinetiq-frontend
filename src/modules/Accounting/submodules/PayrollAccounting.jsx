import React, { useState, useEffect } from "react";
import "../styles/accounting-styling.css";
import NotifModal from "../components/modalNotif/NotifModal";
import Table from "../components/table/Table";
import Search from "../components/search/Search";
import PayrollModal from "../components/payrollAccountingModal/PayrollModal";

const PayrollAccounting = () => {
  const [payrollAccountingData, setPayrollAccountingData] = useState([]);
  const [payrollData, setPayrollData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [searching, setSearching] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [validation, setValidation] = useState({
    isOpen: false,
    type: "",
    title: "",
    message: "",
  });
  const [payrollHrIds, setPayrollHrIds] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);

  const payroll_columns = [
    "Status",
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
    "Date Approved",
    "Reference Number",
  ];

  const payrollAccounting_columns = [
    "Status",
    "Payroll Accounting ID",
    "Payroll HR ID",
    "Date Approved",
    "Approved By",
    "Payment Method",
    "Reference Number",
  ];

  const API_URL =
    import.meta.env.VITE_API_URL ||
    "https://vyr3yqctq8.execute-api.ap-southeast-1.amazonaws.com/dev";
  const PAYROLL_HR_ENDPOINT = `${API_URL}/api/payrolls/`;
  const PAYROLL_JOURNAL_ENDPOINT = `${API_URL}/api/payroll-journal/`;
  const PAYROLL_ACCOUNTING_ENDPOINT = `${API_URL}/api/payroll-accounting/`;

  useEffect(() => {
    const fetchPayrollData = async () => {
      try {
        const response = await fetch(PAYROLL_JOURNAL_ENDPOINT);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        result.sort(
          (a, b) => new Date(b.date_approved) - new Date(a.date_approved)
        );
        const transformedData = result.map((item) => [
          item.status,
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
          item.date_approved,
          item.reference_number,
        ]);
        setPayrollData(transformedData);
        const hrIds = [
          ...new Set(result.map((item) => item.payroll_hr_id).filter(Boolean)),
        ];
        setPayrollHrIds(hrIds);
      } catch (error) {
        console.error("Error fetching payroll journal data:", error);
        setValidation({
          isOpen: true,
          type: "error",
          title: "Error",
          message:
            "Failed to fetch payroll journal data. Please try again later.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    const fetchPayrollAccountingData = async () => {
      try {
        const response = await fetch(PAYROLL_ACCOUNTING_ENDPOINT);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        result.sort(
          (a, b) => new Date(b.date_approved) - new Date(a.date_approved)
        );
        const transformedData = result.map((item) => [
          item.status,
          item.payroll_accounting_id,
          item.payroll_hr_id,
          item.date_approved,
          item.approved_by,
          item.payment_method,
          item.reference_number,
        ]);
        setPayrollAccountingData(transformedData);
      } catch (error) {
        console.error("Error fetching payroll accounting data:", error);
        setValidation({
          isOpen: true,
          type: "error",
          title: "Error",
          message:
            "Failed to fetch payroll accounting data. Please try again later.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    const fetchHRPayrollData = async () => {
      try {
        const response = await fetch(PAYROLL_HR_ENDPOINT);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
      } catch (error) {
        console.error("Error fetching HR payroll data:", error);
        setValidation({
          isOpen: true,
          type: "error",
          title: "Error",
          message: "Failed to fetch HR payroll data. Please try again later.",
        });
      }
    };

    fetchPayrollData();
    fetchPayrollAccountingData();
    fetchHRPayrollData();
  }, []);

  const handlePrintRow = (rowData) => {
    if (rowData[0] === "Processing") {
      setValidation({
        isOpen: true,
        type: "error",
        title: "Print Error",
        message: "Cannot print payroll record with 'Processing' status.",
      });
      return;
    }

    const payrollJournalRow = payrollData.find(
      (row) => row[1] === rowData[1] // Match on payroll_accounting_id
    );

    const printWindow = window.open("", "_blank");

    const renderRow = (label, value) => `
      <tr>
        <td><strong>${label}</strong></td>
        <td>${value ?? "-"}</td>
      </tr>
    `;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Kinetiq - PLM - Payroll</title>
          <style>
            @page {
              size: letter;
              margin: 0.5in;
            }
            body {
              font-family: 'Segoe UI', Roboto, Arial, sans-serif;
              background-color: #ffffff;
              color: #2c3e50;
              line-height: 1.5;
              margin: 0;
              padding: 0;
            }
            .container {
              margin: 0 auto;
              width: 100%;
              max-width: 1000px;
              box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
              padding: 25px;
              border-radius: 8px;
              background-color: #fff;
            }
            .header {
              border-bottom: 3px solid #0055a5;
              padding-bottom: 20px;
              margin-bottom: 30px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .logo {
              width: 6rem;
              height: auto;
            }
            .logo-subtitle {
              font-size: 15px;
              color: #546e7a;
              letter-spacing: 0.5px;
              font-weight: 500;
            }
            .document-title {
              text-align: center;
              font-size: 24px;
              font-weight: 600;
              margin: 25px 0;
              color: #0055a5;
              text-transform: uppercase;
              letter-spacing: 1px;
              position: relative;
            }
            .document-title:after {
              content: '';
              position: absolute;
              bottom: -10px;
              left: 50%;
              transform: translateX(-50%);
              width: 80px;
              height: 3px;
              background-color: #0055a5;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 25px 0;
              border-radius: 6px;
              overflow: hidden;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
            }
            th, td {
              padding: 12px 15px;
              border-bottom: 1px solid #e0e0e0;
              text-align: left;
            }
            th {
              background-color: #0055a5;
              color: #ffffff;
              font-weight: 600;
              text-transform: uppercase;
              font-size: 14px;
              letter-spacing: 0.5px;
            }
            tr:nth-child(even) {
              background-color: #f8f9fa;
            }
            tr:hover {
              background-color: #f1f7fd;
            }
            .section-title {
              font-size: 18px;
              font-weight: 600;
              margin-top: 35px;
              margin-bottom: 15px;
              padding-bottom: 10px;
              border-bottom: 2px solid #0055a5;
              color: #0055a5;
            }
            .section-title:before {
              content: '';
              position: absolute;
              left: 0;
              bottom: -2px;
              width: 50px;
              height: 2px;
              background-color: #0098db;
            }
            .footer {
              margin-top: 50px;
              font-size: 13px;
              text-align: center;
              color: #607d8b;
              padding-top: 20px;
              border-top: 1px solid #e0e0e0;
            }
            .footer div {
              margin: 5px 0;
            }
            .watermark {
              position: fixed;
              top: 50%;
              left: 0;
              width: 100%;
              text-align: center;
              font-size: 120px;
              color: rgba(0, 85, 165, 0.03);
              transform: rotate(-45deg);
              z-index: -1;
              font-weight: bold;
            }
            @media print {
              .container {
                box-shadow: none;
                padding: 0;
              }
              body {
                background-color: #fff;
              }
            }
          </style>
        </head>
        <body>
          <div class="watermark">COPY</div>
          <div class="container">
            <div class="header">
              <div>
                <img class="logo" src="../../public/images/kinetiq.png" alt="Kinetiq Logo" />
                <div class="logo-subtitle">Medical Equipment Manufacturing Company</div>
              </div>
              <div style="text-align: right; font-size: 14px; color: #546e7a;">
                <div><strong>Generated:</strong> ${new Date().toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'})}</div>
              </div>
            </div>
  
            <div class="document-title">Payroll Report</div>
  
            ${
              payrollJournalRow
                ? `
                <div class="section-title">Payroll Breakdown</div>
                <table>
                  <tbody>
                    ${payroll_columns
                      .map((col, i) => renderRow(col, payrollJournalRow[i]))
                      .join("")}
                  </tbody>
                </table>
                `
                : "<div style='padding: 20px; background-color: #f8f9fa; border-left: 4px solid #0055a5; border-radius: 4px;'><em>No payroll journal entry found for this accounting record.</em></div>"
            }
  
            <div class="footer">
              <div>Kinetiq - PLM - Confidential</div>
              <div>Generated on ${new Date().toLocaleString('en-US', {
                month: 'long',
                day: 'numeric', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</div>
            </div>
          </div>
  
          <script>
            window.onload = () => window.print();
            window.onafterprint = () => window.close();
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  const handleOpenModal = (row) => {
    console.log("Opening modal with row:", row);
    setSelectedRow(row);
    setModalOpen(true);
  };

  const handleEditSubmit = async (updatedRow) => {
    try {
      const payload = {
        status: updatedRow[0],
        payroll_accounting_id: updatedRow[1],
        payroll_hr_id: updatedRow[2],
        date_approved: updatedRow[3],
        approved_by: updatedRow[4],
        payment_method: updatedRow[5],
        reference_number: updatedRow[6],
      };

      console.log("Payload being sent to backend:", payload);

      const validStatuses = ["Processing", "Completed"];
      if (!validStatuses.includes(payload.status)) {
        throw new Error(
          `Invalid status: ${
            payload.status
          }. Must be one of ${validStatuses.join(", ")}`
        );
      }

      const url = `${PAYROLL_ACCOUNTING_ENDPOINT}${payload.payroll_accounting_id}/`;

      const response = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const contentType = response.headers.get("content-type");
      const responseText = await response.text();

      if (!response.ok) {
        console.error("Response Text:", responseText);
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${responseText}`
        );
      }

      if (contentType && contentType.includes("application/json")) {
        const newData = JSON.parse(responseText);
        console.log("Backend response data:", newData);

        setPayrollAccountingData((prevData) =>
          prevData.map((row) =>
            row[1] === updatedRow[1] // Match on payroll_accounting_id
              ? [
                  newData.status,
                  newData.payroll_accounting_id,
                  newData.payroll_hr_id,
                  newData.date_approved,
                  newData.approved_by,
                  newData.payment_method,
                  newData.reference_number,
                ]
              : row
          )
        );

        setValidation({
          isOpen: true,
          type: "success",
          title: "Success",
          message: "Payroll record updated successfully.",
        });
      } else {
        throw new Error(
          "Unexpected response format: Expected JSON but received HTML"
        );
      }

      setModalOpen(false);
    } catch (error) {
      console.error("Error saving payroll record:", error);
      setValidation({
        isOpen: true,
        type: "error",
        title: "Error",
        message: `Failed to save payroll record: ${error.message}`,
      });
    }
  };

  const filteredData = payrollAccountingData.filter((row) =>
    [row[0], row[1], row[2], row[3], row[4], row[5]]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(searching.toLowerCase().trim())
  );

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
            <Search
              type="text"
              placeholder="Search Record..."
              value={searching}
              onChange={(e) => setSearching(e.target.value)}
            />
          </div>
        </div>

        <div className="title-subtitle-container">
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <Table
              columns={payrollAccounting_columns}
              data={filteredData}
              handleEditRow={handleOpenModal}
              showEditButton={true}
            />
          )}
        </div>

        <div className="my-20"></div>

        <div className="title-subtitle-container">
          <h1 className="subModule-title">Payroll</h1>
        </div>

        <div className="title-subtitle-container">
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <Table
              columns={payroll_columns}
              data={payrollData}
              showPrintButton={true}
              handlePrintRow={handlePrintRow}
            />
          )}
        </div>
      </div>

      {modalOpen && (
        <PayrollModal
          isModalOpen={modalOpen}
          closeModal={() => {
            console.log("Closing modal");
            setModalOpen(false);
          }}
          selectedRow={selectedRow}
          handleSubmit={handleEditSubmit}
          columnHeaders={payrollAccounting_columns}
          payrollHrIds={payrollHrIds}
          isNewPayroll={true}
        />
      )}

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
