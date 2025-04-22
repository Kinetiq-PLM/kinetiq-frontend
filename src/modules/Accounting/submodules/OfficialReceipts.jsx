import React, { useState, useEffect } from "react";
import "../styles/accounting-styling.css";
import Table from "../components/Table";
import Search from "../components/Search";
import Button from "../components/Button";
import CreateReceiptModal from "../components/CreateReceiptModal";
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
    "OR ID",
    "Invoice ID",
    "Customer ID",
    "OR Date",
    "Settled Amount",
    "Remaining Amount",
    "Payment Method",
    "Reference #",
    "Created By",
  ];
  const [data, setData] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [searching, setSearching] = useState("");
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
  const INVOICES_ENDPOINT = `${API_URL}/api/invoices/`;

  const openModal = () => setModalOpen(true);

  const closeModal = () => {
    setModalOpen(false);
    setReportForm({
      startDate: getCurrentDate(),
      salesInvoiceId: "",
      amountPaid: "",
      paymentMethod: "",
      bankAccount: "",
      createdBy: user ? user.name : "Admin",
    });
  };

  const [reportForm, setReportForm] = useState({
    startDate: getCurrentDate(),
    salesInvoiceId: "",
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
      setData(
        response.data.map((entry) => [
          entry.or_id || "-",
          entry.invoice_id || "-",
          entry.customer_id || "-",
          entry.or_date ? new Date(entry.or_date).toLocaleString() : "-",
          entry.settled_amount || "-",
          entry.remaining_amount || "-",
          entry.payment_method || "-",
          entry.reference_number || "-",
          entry.created_by || "-",
        ])
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

  const fetchInvoices = async () => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const response = await axios.get(INVOICES_ENDPOINT, config);
      setInvoices(response.data);
      if (response.data.length === 0) {
        // REVISED: Improved validation message
        setValidation({
          isOpen: true,
          type: "warning",
          title: "No Invoices Available",
          message: "No invoices with a remaining balance found. All invoices may be fully paid or returned.",
        });
      }
    } catch (error) {
      console.error("Error fetching invoices:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      let message = "Could not load invoice list. Please ensure the API is accessible.";
      if (error.response?.status === 404) {
        message = "Invoice endpoint not found. Verify the API configuration.";
      } else if (error.response?.status === 403) {
        message = "Access denied. Please check your authentication credentials.";
      } else if (error.code === "ERR_NETWORK") {
        message = "Network error. Please ensure the API is running.";
      } else if (error.response?.status === 504) {
        message = "Gateway timeout. Check the backend response time.";
      }
      setValidation({
        isOpen: true,
        type: "error",
        title: "Invoice Fetch Failed",
        message: error.response?.data?.detail || message,
      });
    }
  };

  useEffect(() => {
    fetchData();
    fetchInvoices();
  }, []);

  const calculateRemainingAmount = (invoiceId, newSettledAmount) => {
    const selectedInvoice = invoices.find((inv) => inv.invoice_id === invoiceId);
    if (!selectedInvoice) {
      throw new Error("Invalid invoice ID.");
    }

    const settledAmount = parseFloat(newSettledAmount);
    if (isNaN(settledAmount) || settledAmount <= 0) {
      throw new Error("Invalid settled amount. Please enter a valid positive number.");
    }

    const remainingBalance = parseFloat(selectedInvoice.remaining_balance);
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
    setReportForm((prevForm) => ({
      ...prevForm,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (
      !reportForm.startDate ||
      !reportForm.salesInvoiceId ||
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

    const selectedInvoice = invoices.find(
      (inv) => inv.invoice_id === reportForm.salesInvoiceId
    );
    if (!selectedInvoice) {
      setValidation({
        isOpen: true,
        type: "warning",
        title: "Invalid Invoice",
        message: "Please select a valid invoice.",
      });
      return;
    }

    try {
      const newRemainingAmount = calculateRemainingAmount(
        reportForm.salesInvoiceId,
        reportForm.amountPaid
      );

      if (
        parseFloat(reportForm.amountPaid) > parseFloat(selectedInvoice.remaining_balance)
      ) {
        setValidation({
          isOpen: true,
          type: "warning",
          title: "Invalid Payment",
          message: `The settled amount (${reportForm.amountPaid}) exceeds the remaining invoice balance (${selectedInvoice.remaining_balance}).`,
        });
        return;
      }

      const referenceNumber = generateReferenceNumber();
      const newReceipt = {
        or_id: generateCustomORID(),
        invoice_id: reportForm.salesInvoiceId,
        customer_id: selectedInvoice.customer_id || "SALES-CUST-2025",
        or_date: reportForm.startDate,
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
        fetchInvoices();
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

  const filteredData = data.filter((row) =>
    [row[0], row[1], row[2], row[6], row[7], row[8]]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(searching.toLowerCase())
  );

  return (
    <div className="officialReceipts">
      <div className="body-content-container">
        <div className="title-subtitle-container">
          <h1 className="subModule-title">Official Receipts</h1>
        </div>
        <div className="parent-component-container">
          <Search
            type="text"
            placeholder="Search Record.."
            value={searching}
            onChange={(e) => setSearching(e.target.value)}
          />
          <div>
            <Button
              name="Create Receipt"
              variant="standard2"
              onclick={openModal}
            />
          </div>
        </div>
        <Table data={filteredData} columns={columns} enableCheckbox={false} />
      </div>
      {modalOpen && (
        <CreateReceiptModal
          isModalOpen={modalOpen}
          closeModal={closeModal}
          reportForm={reportForm}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          setValidation={setValidation}
          invoiceOptions={invoices.map((inv) => inv.invoice_id)}
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