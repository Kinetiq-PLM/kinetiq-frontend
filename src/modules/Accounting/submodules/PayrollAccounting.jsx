import React, { useState, useEffect } from "react";
import "../styles/accounting-styling.css";
import NotifModal from "../components/modalNotif/NotifModal";
import Table from "../components/table/Table";
import Search from "../components/search/Search";
import PayrollModal from "../components/payrollAccountingModal/PayrollModal";
import Button from "../components/button/Button";

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
  const [isCreating, setIsCreating] = useState(false);
  const [hasProcessingStatus, setHasProcessingStatus] = useState(false);
  const [payrollHrIds, setPayrollHrIds] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);

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

    const fetchHRPayrollData = async () => {
      try {
        const response = await fetch(PAYROLL_HR_ENDPOINT);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        const hasProcessing = result.some((item) => item.status === "Processing");
        setHasProcessingStatus(hasProcessing);
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

  const handleCheckProcessingStatus = async () => {
    try {
      const response = await fetch(PAYROLL_HR_ENDPOINT);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      const hasProcessing = result.some((item) => item.status === "Processing");
      setValidation({
        isOpen: true,
        type: hasProcessing ? "success" : "error",
        title: hasProcessing ? "Processing Found" : "No Processing Found",
        message: hasProcessing
          ? "There are payrolls with a 'Processing' status."
          : "No payrolls with a 'Processing' status were found.",
      });
    } catch (error) {
      console.error("Error checking processing status:", error);
      setValidation({
        isOpen: true,
        type: "error",
        title: "Error",
        message: "Failed to check payroll processing status. Please try again later.",
      });
    }
  };

  const handlePrintRow = (rowData) => {
    if (rowData[6] === "Processing") {
      setValidation({
        isOpen: true,
        type: "error",
        title: "Print Error",
        message: "Cannot print payroll record with 'Processing' status.",
      });
      return;
    }

    const printWindow = window.open('', '_blank');
  
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
  
          <div class="document-title">PAYROLL</div>
          
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

  const openModal = (row) => {
    console.log("Opening modal with row:", row);
    setSelectedRow(row);
    setIsCreating(false);
    setModalOpen(true);
  };

  const handleCreatePayroll = (isNewPayroll = false) => {
    const initialRow = isNewPayroll
      ? [
          "", // payroll_accounting_id (generated in PayrollModal)
          "", // payroll_hr_id
          "", // date_approved
          "", // approved_by
          "", // payment_method
          "", // reference_number (generated in modal)
          "Processing", // status
        ]
      : payrollAccounting_columns.map((col) =>
          col === "Status" ? "Processing" : ""
        );
    console.log("Creating payroll, isNewPayroll:", isNewPayroll, "initialRow:", initialRow);
    setSelectedRow(initialRow);
    setIsCreating(true);
    setModalOpen(true);
  };

  const handleEditSubmit = async (updatedRow, isNewPayroll = false) => {
    try {
      const payload = {
        payroll_accounting_id: updatedRow[0],
        payroll_hr_id: updatedRow[1],
        date_approved: updatedRow[2],
        approved_by: updatedRow[3],
        payment_method: updatedRow[4],
        reference_number: updatedRow[5],
        status: updatedRow[6],
      };

      console.log("Payload being sent to backend:", payload);

      // Validate status locally
      const validStatuses = ["Processing", "Completed"];
      if (!validStatuses.includes(payload.status)) {
        throw new Error(`Invalid status: ${payload.status}. Must be one of ${validStatuses.join(", ")}`);
      }

      const url = isNewPayroll
        ? PAYROLL_ACCOUNTING_ENDPOINT
        : `${PAYROLL_ACCOUNTING_ENDPOINT}${payload.payroll_accounting_id}/`;

      const response = await fetch(url, {
        method: isNewPayroll ? "POST" : "PUT",
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
          isNewPayroll
            ? [
                [
                  newData.payroll_accounting_id,
                  newData.payroll_hr_id,
                  newData.date_approved,
                  newData.approved_by,
                  newData.payment_method,
                  newData.reference_number,
                  newData.status,
                ],
                ...prevData,
              ]
            : prevData.map((row) =>
                row[0] === updatedRow[0]
                  ? [
                      newData.payroll_accounting_id,
                      newData.payroll_hr_id,
                      newData.date_approved,
                      newData.approved_by,
                      newData.payment_method,
                      newData.reference_number,
                      newData.status,
                    ]
                  : row
              )
        );

        setValidation({
          isOpen: true,
          type: "success",
          title: "Success",
          message: `Payroll record ${isNewPayroll ? "created" : "updated"} successfully.`,
        });
      } else {
        throw new Error("Unexpected response format: Expected JSON but received HTML");
      }

      setModalOpen(false);
      setIsCreating(false);
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
          <div className="component-container">
            <Button
              name="Check Processing Status"
              variant="standard2"
              onclick={handleCheckProcessingStatus}
            />
            <Button
              name="Create New Payroll"
              variant="standard2"
              onclick={() => handleCreatePayroll(true)}
            />
            {hasProcessingStatus && (
              <Button
                name="Create Payroll"
                variant="standard2"
                onclick={() => handleCreatePayroll(false)}
              />
            )}
          </div>
        </div>

        <div className="title-subtitle-container">
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <Table
              columns={payrollAccounting_columns}
              data={filteredData}
              handlePrintRow={handlePrintRow}
              handleEditRow={openModal}
              showPrintButton={true}
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
            <Table columns={payroll_columns} data={payrollData} />
          )}
        </div>
      </div>

      {modalOpen && (
        <PayrollModal
          isModalOpen={modalOpen}
          closeModal={() => {
            console.log("Closing modal");
            setModalOpen(false);
            setIsCreating(false);
          }}
          selectedRow={selectedRow}
          handleSubmit={(data, isNewPayroll) => handleEditSubmit(data, isNewPayroll)}
          columnHeaders={payrollAccounting_columns}
          isCreating={isCreating}
          payrollHrIds={payrollHrIds}
          isNewPayroll={isCreating && selectedRow[1] === ""}
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