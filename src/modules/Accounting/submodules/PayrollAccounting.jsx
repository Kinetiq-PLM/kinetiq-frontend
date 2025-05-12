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
        result.sort((a, b) => new Date(b.date_approved) - new Date(a.date_approved));
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
        const hrIds = [...new Set(result.map((item) => item.payroll_hr_id).filter(Boolean))];
        setPayrollHrIds(hrIds);
      } catch (error) {
        console.error("Error fetching payroll journal data:", error);
        setValidation({
          isOpen: true,
          type: "error",
          title: "Error",
          message: "Failed to fetch payroll journal data. Please try again later.",
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
        result.sort((a, b) => new Date(b.date_approved) - new Date(a.date_approved));
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
          message: "Failed to fetch payroll accounting data. Please try again later.",
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
              font-family: Arial, sans-serif;
              background-color: #ffffff;
              color: #333;
            }
            .container {
              margin: 0 auto;
              width: 100%;
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
              padding: 8px 12px;
              border-bottom: 1px solid #ccc;
              text-align: left;
            }
            tr:nth-child(even) {
              background-color: #f9f9f9;
            }
            .section-title {
              font-size: 16px;
              font-weight: bold;
              margin-top: 30px;
              border-bottom: 1px solid #0055a5;
              color: #0055a5;
            }
            .footer {
              margin-top: 40px;
              font-size: 12px;
              text-align: center;
              color: #777;
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
              <div class="logo">Kinetiq - PLM</div>
            </div>
  
            <div class="document-title">PAYROLL</div>
  
            ${payrollJournalRow
        ? `
                <div class="section-title">Payroll Breakdown</div>
                <table>
                  <tbody>
                    ${payroll_columns.map((col, i) => renderRow(col, payrollJournalRow[i])).join("")}
                  </tbody>
                </table>
                `
        : "<p><em>No payroll journal entry found for this accounting record.</em></p>"
      }
  
            <div class="footer">
              <div>Kinetiq - PLM</div>
              <div>Printed on ${new Date().toLocaleString()}</div>
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


  const openModal = (row) => {
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
        employee_id: updatedRow[3],
        pay_period_start: updatedRow[4],
        pay_period_end: updatedRow[5],
        employment_type: updatedRow[6],
        base_salary: updatedRow[7],
        overtime_hours: updatedRow[8],
        overtime_pay: updatedRow[9],
        holiday_pay: updatedRow[10],
        bonus_pay: updatedRow[11],
        thirteenth_month_pay: updatedRow[12],
        total_bonuses: updatedRow[13],
        gross_pay: updatedRow[14],
        sss_contribution: updatedRow[15],
        philhealth_contribution: updatedRow[16],
        pagibig_contribution: updatedRow[17],
        tax: updatedRow[18],
        late_deduction: updatedRow[19],
        absent_deduction: updatedRow[20],
        undertime_deduction: updatedRow[21],
        total_deductions: updatedRow[22],
        net_pay: updatedRow[23],
        date_approved: updatedRow[24],
        reference_number: updatedRow[25],
      };


      console.log("Payload being sent to backend:", payload);

      const validStatuses = ["Processing", "Completed"];
      if (!validStatuses.includes(payload.status)) {
        throw new Error(`Invalid status: ${payload.status}. Must be one of ${validStatuses.join(", ")}`);
      }

      const url = `${PAYROLL_JOURNAL_ENDPOINT}${payload.payroll_accounting_id}/`;

      const response = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const contentType = response.headers.get("content-type");
      const responseText = await response.text();

      if (!response.ok) {
        console.error("Response Text:", responseText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${responseText}`);
      }

      if (contentType && contentType.includes("application/json")) {
        const newData = JSON.parse(responseText);
        console.log("Backend response data:", newData);

        setPayrollAccountingData((prevData) =>
          prevData.map((row) =>
            row[0] === updatedRow[0]
              ? [
                newData.status,
                newData.payroll_accounting_id,
                newData.payroll_hr_id,
                newData.employee_id,
                newData.pay_period_start,
                newData.pay_period_end,
                newData.employment_type,
                newData.base_salary,
                newData.overtime_hours,
                newData.overtime_pay,
                newData.holiday_pay,
                newData.bonus_pay,
                newData.thirteenth_month_pay,
                newData.total_bonuses,
                newData.gross_pay,
                newData.sss_contribution,
                newData.philhealth_contribution,
                newData.pagibig_contribution,
                newData.tax,
                newData.late_deduction,
                newData.absent_deduction,
                newData.undertime_deduction,
                newData.total_deductions,
                newData.net_pay,
                newData.date_approved,
                newData.reference_number
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
        throw new Error("Unexpected response format: Expected JSON but received HTML");
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
      .includes(searching.toLowerCase())
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
              handleEditRow={openModal}
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
            <Table columns={payroll_columns} data={payrollData} showPrintButton={true} handlePrintRow={handlePrintRow} />
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
          handleSubmit={(data) => handleEditSubmit(data)}
          columnHeaders={payrollAccounting_columns}
          payrollHrIds={payrollHrIds}
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