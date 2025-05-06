import React, { useState, useEffect } from "react";
import "../styles/accounting-styling.css";
import Table from "../components/table/Table";
import Search from "../components/search/Search";
import Button from "../components/button/Button";
import Dropdown from "../components/dropdown/Dropdown";
import CreateReceiptModal from "../components/officialReceiptModal/CreateReceiptModal";
import NotifModal from "../components/modalNotif/NotifModal";
import axios from "axios";

const OfficialReceipts = () => {
  const getLoggedInUser = () => {
    const keys = ["user", "authUser", "currentUser", "identity"];
    for (const key of keys) {
      const storedUser = localStorage.getItem(key) || sessionStorage.getItem(key);
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          return {
            name:
              parsed.name ||
              parsed.fullName ||
              parsed.displayName ||
              parsed.email ||
              "Unknown User",
          };
        } catch (e) {
          console.error(`Error parsing ${key}:`, e);
        }
      }
    }
    return { name: "Admin" };
  };

  const [user, setUser] = useState(getLoggedInUser());

  useEffect(() => {
    const fetchUserFromApi = async () => {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (token) {
        try {
          const API_URL =
            import.meta.env.VITE_API_URL ||
            "https://vyr3yqctq8.execute-api.ap-southeast-1.amazonaws.com/dev";
          const response = await axios.get(`${API_URL}/api/user`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser({ name: response.data.name || response.data.email || "Admin" });
        } catch (error) {
          console.error("Error fetching user from API:", error);
          setUser({ name: "Admin" });
        }
      }
    };
    fetchUserFromApi();
  }, []);

  useEffect(() => {
    const checkUser = () => {
      const newUser = getLoggedInUser();
      if (newUser.name !== user.name) {
        setUser(newUser);
      }
    };
    window.addEventListener("storage", checkUser);
    return () => window.removeEventListener("storage", checkUser);
  }, [user]);

  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const columns = [
    "Official Receipt ID",
    "Invoice ID",
    "Customer ID",
    "Official Receipt Date",
    "Total Amount",
    "Amount Due",
    "Settled Amount",
    "Remaining Amount",
    "Payment Method",
    "Reference #",
    "Created By",
  ];

  const [data, setData] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const [invoiceIds, setInvoiceIds] = useState([]);
  const [searching, setSearching] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [validation, setValidation] = useState({
    isOpen: false,
    type: "warning",
    title: "",
    message: "",
  });

  const API_URL =
    import.meta.env.VITE_API_URL ||
    "https://vyr3yqctq8.execute-api.ap-southeast-1.amazonaws.com/dev";
  const OFFICIAL_RECEIPTS_ENDPOINT = `${API_URL}/api/official-receipts/`;

  const openModal = () => setModalOpen(true);

  const closeModal = () => {
    setModalOpen(false);
    setReportForm({
      startDate: getCurrentDate(),
      salesInvoiceId: "",
      customerId: "SALES-CUST-2025",
      totalAmount: "",
      amountDue: "",
      amountPaid: "",
      paymentMethod: "",
      bankAccount: "",
      createdBy: user ? user.name : "Admin",
    });
  };

  const [reportForm, setReportForm] = useState({
    startDate: getCurrentDate(),
    salesInvoiceId: "",
    customerId: "SALES-CUST-2025",
    totalAmount: "",
    amountDue: "",
    amountPaid: "",
    paymentMethod: "",
    bankAccount: "",
    createdBy: user ? user.name : "Admin",
  });

  useEffect(() => {
    setReportForm((prevForm) => ({
      ...prevForm,
      createdBy: user ? user.name : "Admin",
    }));
  }, [user]);

  const fetchData = async (retries = 3, delay = 500) => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const response = await axios.get(OFFICIAL_RECEIPTS_ENDPOINT, config);
      console.log("Fetched receipts:", response.data);
      setReceipts(response.data);
      setData(
        response.data.map((entry) => [
          entry.or_id || "-",
          entry.invoice_id || "-",
          entry.customer_id || "-",
          entry.or_date ? new Date(entry.or_date).toLocaleString() : "-",
          entry.total_amount || "-",
          entry.amount_due || "-",
          entry.settled_amount || "-",
          entry.remaining_amount || "-",
          entry.payment_method || "-",
          entry.reference_number || "-",
          entry.created_by || "-",
        ])
      );
      setInvoiceIds(
        response.data
          .filter((entry) => entry.invoice_id)
          .map((entry) => entry.invoice_id)
      );
    } catch (error) {
      if (retries > 0) {
        console.warn(`Retrying fetchData (${retries} attempts left)...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        return fetchData(retries - 1, delay * 2);
      }
      console.error("Error fetching receipts:", error);
      setValidation({
        isOpen: true,
        type: "error",
        title: "Receipt Fetch Failed",
        message: "Failed to load official receipts. Please check your connection or API configuration.",
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const calculateRemainingAmount = (newSettledAmount, invoiceId, amountDue, totalAmount) => {
    const settledAmount = parseFloat(newSettledAmount) || 0;
    if (isNaN(settledAmount) || settledAmount < 0) {
      throw new Error("Invalid settled amount. Please enter a valid non-negative number.");
    }

    if (!invoiceId) {
      throw new Error("Invoice ID is required to calculate remaining amount.");
    }

    console.log("All receipts for invoiceId:", invoiceId, receipts.filter((r) => r.invoice_id === invoiceId));

    const invoiceReceipts = receipts
      .filter((r) => r.invoice_id === invoiceId && !isNaN(parseFloat(r.remaining_amount)))
      .sort((a, b) => {
        const amountA = parseFloat(a.remaining_amount);
        const amountB = parseFloat(b.remaining_amount);
        return amountA - amountB; // Lowest remaining_amount first
      });

    console.log("Sorted receipts by remaining_amount:", invoiceReceipts);

    const lowestReceipt = invoiceReceipts[0];
    let remainingBalance;

    if (lowestReceipt && !isNaN(parseFloat(lowestReceipt.remaining_amount))) {
      remainingBalance = parseFloat(lowestReceipt.remaining_amount);
      console.log(`Using lowest remaining_amount from ${lowestReceipt.or_id} (${lowestReceipt.or_date}): ${remainingBalance}`);
    } else {
      remainingBalance = parseFloat(amountDue) || parseFloat(totalAmount) || 0;
      console.log(`No valid receipts found. Falling back to amountDue: ${amountDue} or totalAmount: ${totalAmount}, remainingBalance: ${remainingBalance}`);
    }

    if (isNaN(remainingBalance) || remainingBalance < 0) {
      throw new Error("Invalid remaining balance. Please check the invoice receipts or input amounts.");
    }

    if (settledAmount > remainingBalance) {
      throw new Error(`Settled amount (${settledAmount}) exceeds remaining balance (${remainingBalance}).`);
    }

    const newRemaining = remainingBalance - settledAmount;
    return newRemaining;
  };

  const generateReferenceNumber = () => {
    const randomString = Math.random()
      .toString(36)
      .substring(2, 8)
      .toLowerCase();
    return `REF-${randomString}`;
  };

  const generateCustomORID = () => {
    const prefix = "ACC-OFR";
    const year = new Date().getFullYear();
    const randomString = Math.random()
      .toString(36)
      .substring(2, 7)
      .toUpperCase();
    return `${prefix}-${year}-${randomString}`;
  };

  const handleInputChange = (field, value) => {
    setReportForm((prevForm) => {
      const newForm = { ...prevForm, [field]: value };
      if (field === "salesInvoiceId") {
        const selectedReceipt = receipts.find((r) => r.invoice_id === value);
        newForm.customerId = selectedReceipt?.customer_id || "SALES-CUST-2025";
      }
      return newForm;
    });
  };

  const handleSubmit = async () => {
    if (
      !reportForm.startDate ||
      !reportForm.salesInvoiceId ||
      !reportForm.amountDue ||
      !reportForm.amountPaid ||
      !reportForm.paymentMethod ||
      !reportForm.createdBy
    ) {
      setValidation({
        isOpen: true,
        type: "warning",
        title: "Missing Fields",
        message: "Please fill in all required fields.",
      });
      return;
    }

    try {
      // Fallback for total_amount if blank
      let totalAmount = parseFloat(reportForm.totalAmount);
      if (isNaN(totalAmount) || !reportForm.totalAmount) {
        const invoiceReceipts = receipts
          .filter((r) => r.invoice_id === reportForm.salesInvoiceId && !isNaN(parseFloat(r.remaining_amount)))
          .sort((a, b) => parseFloat(a.remaining_amount) - parseFloat(b.remaining_amount));
        const lowestReceipt = invoiceReceipts[0];
        totalAmount = lowestReceipt ? parseFloat(lowestReceipt.total_amount) : 0;
        if (isNaN(totalAmount) || totalAmount <= 0) {
          throw new Error("Invalid total amount. Please ensure a valid invoice is selected.");
        }
      }

      const newRemainingAmount = calculateRemainingAmount(
        reportForm.amountPaid,
        reportForm.salesInvoiceId,
        reportForm.amountDue,
        totalAmount
      );

      const referenceNumber = generateReferenceNumber();
      const newReceipt = {
        or_id: generateCustomORID(),
        invoice_id: reportForm.salesInvoiceId,
        customer_id: reportForm.customerId,
        or_date: reportForm.startDate,
        total_amount: totalAmount.toFixed(2),
        amount_due: parseFloat(reportForm.amountDue).toFixed(2),
        settled_amount: parseFloat(reportForm.amountPaid).toFixed(2),
        remaining_amount: newRemainingAmount.toFixed(2),
        payment_method: reportForm.paymentMethod,
        reference_number: referenceNumber,
        created_by: reportForm.createdBy,
        bank_account:
          reportForm.paymentMethod === "Bank Transfer" ? reportForm.bankAccount : null,
      };

      console.log("Submitting receipt:", newReceipt);

      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const response = await axios.post(OFFICIAL_RECEIPTS_ENDPOINT, newReceipt, config);
      if (response.status === 201) {
        await fetchData();
        closeModal();
        setValidation({
          isOpen: true,
          type: "success",
          title: "Receipt Created",
          message: "The receipt has been successfully created.",
        });
      } else {
        setValidation({
          isOpen: true,
          type: "error",
          title: "Server Error",
          message: "Failed to create receipt.",
        });
      }
    } catch (error) {
      console.error("Error creating receipt:", error);
      setValidation({
        isOpen: true,
        type: "error",
        title: "Submission Failed",
        message: error.message || "Failed to connect to the API.",
      });
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (sortOrder === "asc" || sortOrder === "desc") {
      const valA = parseFloat(a[7]); // Sort by Remaining Amount
      const valB = parseFloat(b[7]);
      if (isNaN(valA) || isNaN(valB)) return 0;
      return sortOrder === "asc" ? valA - valB : valB - valA;
    }

    if (sortOrder === "default" || !sortOrder) {
      const idA = a[1]?.toString().toLowerCase() || "";
      const idB = b[1]?.toString().toLowerCase() || "";
      return idA.localeCompare(idB);
    }

    return 0;
  });

  const filteredData = sortedData.filter((row) =>
    [row[0], row[1], row[2], row[6], row[7], row[8]]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(searching.toLowerCase())
  );

  const handlePrintRow = (rowData) => {
    const printWindow = window.open('', '_blank');
  
    const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Kinetiq - PLM - Official Receipt</title>
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
          .receipt-number {
            font-size: 16px;
            color: #0055a5;
            font-weight: 600;
            margin-bottom: 15px;
            text-align: right;
          }
          .summary-section {
            margin-top: 30px;
            background-color: #f8fbff;
            border-left: 4px solid #0055a5;
            padding: 15px;
            border-radius: 4px;
          }
          .total-amount {
            text-align: right;
            font-size: 18px;
            font-weight: 600;
            color: #0055a5;
            margin: 15px 0;
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
          .confidential {
            color: #cc0000;
            font-style: italic;
            margin-bottom: 10px;
            font-weight: 500;
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
              <div><strong>Date:</strong> ${new Date().toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'})}</div>
            </div>
          </div>
          
          <div class="document-title">Official Receipt</div>
          
          <table>
            <tbody>
              ${columns.map((col, i) => `
                <tr>
                  <td><strong>${col}</strong></td>
                  <td>${rowData[i] ?? '-'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="footer">
            <div class="confidential">CONFIDENTIAL</div>
            <div>Kinetiq - PLM</div>
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

  return (
    <div className="officialReceipts">
      <div className="body-content-container">
        <div className="title-subtitle-container">
          <h1 className="subModule-title">Official Receipts</h1>
        </div>
        <div className="parent-component-container">
          <div className="component-container">
            <Dropdown
              options={["Default", "Ascending", "Descending"]}
              style="selection"
              defaultOption="Sort remaining amount by.."
              onChange={(selected) => {
                const selectedValue = selected.toLowerCase();
                if (selectedValue === "default") {
                  setSortOrder("default");
                } else if (selectedValue === "ascending") {
                  setSortOrder("asc");
                } else if (selectedValue === "descending") {
                  setSortOrder("desc");
                }
              }}
            />
            <Search
              type="text"
              placeholder="Search Record.."
              value={searching}
              onChange={(e) => setSearching(e.target.value)}
            />
          </div>
          <div>
            <Button
              name="Create Receipt"
              variant="standard2"
              onclick={openModal}
            />
          </div>
        </div>
        <Table data={filteredData} columns={columns} handlePrintRow={handlePrintRow} showPrintButton={true} />
      </div>
      {modalOpen && (
        <CreateReceiptModal
          isModalOpen={modalOpen}
          closeModal={closeModal}
          reportForm={reportForm}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          setValidation={setValidation}
          invoiceOptions={invoiceIds}
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

export default OfficialReceipts;