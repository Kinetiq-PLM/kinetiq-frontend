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

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const response = await axios.get(OFFICIAL_RECEIPTS_ENDPOINT, config);
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

  const calculateRemainingAmount = (newSettledAmount, amountDue) => {
    const settledAmount = parseFloat(newSettledAmount) || 0;
    if (isNaN(settledAmount)) {
      throw new Error("Invalid settled amount. Please enter a valid number.");
    }

    const remainingBalance = parseFloat(amountDue);
    if (isNaN(remainingBalance)) {
      throw new Error("Invalid amount due. Please enter a valid number.");
    }

    const newRemaining = remainingBalance - settledAmount;
    return newRemaining >= 0 ? newRemaining : 0;
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
      !reportForm.totalAmount ||
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
      const newRemainingAmount = calculateRemainingAmount(
        reportForm.amountPaid,
        reportForm.amountDue
      );

      if (
        parseFloat(reportForm.amountPaid) > parseFloat(reportForm.amountDue)
      ) {
        setValidation({
          isOpen: true,
          type: "warning",
          title: "Invalid Payment",
          message: `The settled amount (${reportForm.amountPaid}) exceeds the amount due (${reportForm.amountDue}).`,
        });
        return;
      }

      const referenceNumber = generateReferenceNumber();
      const newReceipt = {
        or_id: generateCustomORID(),
        invoice_id: reportForm.salesInvoiceId || null,
        customer_id: reportForm.customerId,
        or_date: reportForm.startDate,
        total_amount: parseFloat(reportForm.totalAmount).toFixed(2),
        amount_due: parseFloat(reportForm.amountDue).toFixed(2),
        settled_amount: parseFloat(reportForm.amountPaid).toFixed(2),
        remaining_amount: newRemainingAmount.toFixed(2),
        payment_method: reportForm.paymentMethod,
        reference_number: referenceNumber,
        created_by: reportForm.createdBy,
        bank_account:
          reportForm.paymentMethod === "Bank Transfer" ? reportForm.bankAccount : null,
      };

      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const response = await axios.post(OFFICIAL_RECEIPTS_ENDPOINT, newReceipt, config);
      if (response.status === 201) {
        fetchData();
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
        message: error.response?.data?.detail || "Failed to connect to the API.",
      });
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (sortOrder === "asc" || sortOrder === "desc") {
      const valA = parseFloat(a[5]);
      const valB = parseFloat(b[5]);
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
  
          <div class="document-title">OFFICIAL RECEIPT</div>
          
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
              name="Update Receipt"
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