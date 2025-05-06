import React, { useEffect, useState } from "react";
import "../styles/PurchaseCredMemoForm.css";
import axios from "axios";

const PurchaseCredMemoForm = ({ memoData, onClose }) => {
    const [fetchedData, setFetchedData] = useState(null);
    const [purchaseQuotationData, setPurchaseQuotationData] = useState(null);
    const [quotationItems, setQuotationItems] = useState([]);
    const [companyName, setCompanyName] = useState("N/A");
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleBack = () => {
        onClose?.();
    };

    const { credit_memo_id } = memoData || {};

    const fetchEmployees = async (request_id) => {
        try {
            // Fetch PRF list to get employee_id
            const prfResponse = await axios.get("https://yi92cir5p0.execute-api.ap-southeast-1.amazonaws.com/dev/api/prf/list/");
            const matchedPRF = prfResponse.data.find((prf) => prf.request_id === request_id);

            if (!matchedPRF) {
                setEmployees([]);
                return;
            }

            const { employee_id } = matchedPRF;

            // Fetch employees to get first_name and last_name
            const employeesResponse = await axios.get("https://yi92cir5p0.execute-api.ap-southeast-1.amazonaws.com/dev/api/prf/employees/");
            const matchedEmployee = employeesResponse.data.filter((emp) => emp.employee_id === employee_id);

            setEmployees(matchedEmployee);
        } catch (err) {
            console.error("Error fetching employees:", err.message);
            setEmployees([]);
        }
    };

    const fetchQuotationContent = async (request_id) => {
        try {
            const quotationContentResponse = await axios.get("https://yi92cir5p0.execute-api.ap-southeast-1.amazonaws.com/dev/api/quotation-content/list/");
            const matchedQuotationContent = quotationContentResponse.data.filter(
                (content) => content.request_id === request_id
            );

            if (matchedQuotationContent.length === 0) {
                setQuotationItems([]);
                return;
            }

            const itemResponse = await axios.get("https://yi92cir5p0.execute-api.ap-southeast-1.amazonaws.com/dev/api/quotation-content/item/list/");
            const itemsWithDetails = matchedQuotationContent.map((content) => {
                const itemDetails = itemResponse.data.find((item) => item.item_id === content.item_id);
                return {
                    ...content,
                    item_name: itemDetails ? itemDetails.item_name : "N/A",
                };
            });

            setQuotationItems(itemsWithDetails);
        } catch (error) {
            console.error("Error fetching quotation content:", error.message);
            setQuotationItems([]);
        }
    };

    const fetchPurchaseQuotationData = async (document_id) => {
        try {
            console.log("Fetching data for document_id:", document_id);

            const documentHeaderResponse = await axios.get("https://yi92cir5p0.execute-api.ap-southeast-1.amazonaws.com/dev/api/invoices/document-header/");
            const matchedHeader = documentHeaderResponse.data.find((header) => header.document_id === document_id);

            if (!matchedHeader) {
                throw new Error("No document header found for the given document_id");
            }

            const { purchase_id } = matchedHeader;

            const purchaseOrdersResponse = await axios.get("https://yi92cir5p0.execute-api.ap-southeast-1.amazonaws.com/dev/api/purchase-orders/list/");
            const matchedPurchaseOrder = purchaseOrdersResponse.data.find((order) => order.purchase_id === purchase_id);

            if (!matchedPurchaseOrder) {
                throw new Error("No purchase order found for the given purchase_id");
            }

            const { quotation_id } = matchedPurchaseOrder;

            const purchaseQuotationResponse = await axios.get("https://yi92cir5p0.execute-api.ap-southeast-1.amazonaws.com/dev/api/purchase_quotation/list/");
            const matchedQuotation = purchaseQuotationResponse.data.find((quotation) => quotation.quotation_id === quotation_id);

            if (!matchedQuotation) {
                throw new Error("No purchase quotation found for the given quotation_id");
            }

            setPurchaseQuotationData(matchedQuotation);

            // Fetch vendor details
            if (matchedQuotation.vendor_code) {
                try {
                    const vendorResponse = await axios.get("https://yi92cir5p0.execute-api.ap-southeast-1.amazonaws.com/dev/api/purchase_quotation/vendor/list/");
                    const matchedVendor = vendorResponse.data.find(
                        (vendor) => vendor.vendor_code === matchedQuotation.vendor_code
                    );
                    setCompanyName(matchedVendor ? matchedVendor.company_name : "N/A");
                } catch (err) {
                    console.error("Error fetching vendor details:", err.message);
                    setCompanyName("N/A");
                }
            } else {
                setCompanyName("N/A");
            }

            // Fetch employees using request_id
            fetchEmployees(matchedQuotation.request_id);

            // Fetch quotation content
            if (matchedQuotation.request_id) {
                fetchQuotationContent(matchedQuotation.request_id);
            }
        } catch (error) {
            console.error("Error fetching purchase quotation data:", error.message);
            setError("Failed to fetch purchase quotation data. Please try again later.");
        }
    };

    const fetchCreditMemoData = async (credit_memo_id) => {
        try {
            setLoading(true);
            setError("");

            console.log("Fetching data for credit_memo_id:", credit_memo_id);

            const creditMemoResponse = await axios.get("https://yi92cir5p0.execute-api.ap-southeast-1.amazonaws.com/dev/api/credit-memo/list/");
            const matchedCreditMemo = creditMemoResponse.data.find(
                (memo) => memo.credit_memo_id === credit_memo_id
            );

            if (!matchedCreditMemo) {
                throw new Error("No credit memo found matching the given credit_memo_id");
            }

            const { invoice_id } = matchedCreditMemo;

            const invoiceResponse = await axios.get("https://yi92cir5p0.execute-api.ap-southeast-1.amazonaws.com/dev/api/invoices/list/");
            const matchedInvoice = invoiceResponse.data.find((invoice) => invoice.invoice_id === invoice_id);

            if (!matchedInvoice) {
                throw new Error("No invoice found matching the given invoice_id");
            }

            const { document_id } = matchedInvoice;

            await fetchPurchaseQuotationData(document_id);

            setFetchedData({
                creditMemo: matchedCreditMemo,
                invoice: matchedInvoice,
                document_date: matchedInvoice.document_date,
            });
        } catch (error) {
            console.error("Error fetching credit memo data:", error.message);
            setError("Failed to fetch credit memo data. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (credit_memo_id) {
            fetchCreditMemoData(credit_memo_id);
        }
    }, [credit_memo_id]);
    
    return (
        <div className="purchase-cred-memo-form">
            <div className="purchase-cred-memo-form-body-content-container">
                {/* Header */}
                <div className="header">
                    <button className="back-btn" onClick={handleBack}>← Back</button>
                    <h1>Credit Memo</h1>
                </div>

                {/* Main Content */}
<div className="purchcred-content">
    {/* Company and Customer Info */}
    <div className="info-section">
        <div className="company-info">
            <h3>Supplier</h3>
            <p> {companyName || "N/A"}</p>
        </div>

        <div className="customer-info">
            <div className="info-block">
                <h3>CUSTOMER</h3>
                {employees.length > 0 ? (
                                            employees.map((employee, index) => (
                                                <p key={index}>
                                                    {employee.first_name} {employee.last_name}
                                                </p>
                                            ))
                                        ) : (
                                            <p>No employees found</p>
                                        )}
                                    </div>

            <div className="info-block">
                <h3>SHIP TO</h3>
                <p>{purchaseQuotationData?.delivery_loc || "N/A"}</p>
            </div>
        

                            <div className="info-block">
                                <div className="memo-details">
                                    <div className="detail-row">
                                        <span>CREDIT MEMO NO.</span>
                                        <span>{credit_memo_id}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span>CREDIT MEMO DATE</span>
                                        <span>{fetchedData?.document_date}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span>DOCUMENT NO.</span>
                                        <span>{fetchedData?.invoice?.document_no}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span>DUE DATE</span>
                                        <span>{fetchedData?.invoice?.due_date}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Credit Memo Total */}
                    <div className="total-section">
                        <h2>Credit Memo Total</h2>
                        <h2>{fetchedData?.invoice?.total_credit || 0}</h2>
                    </div>

                   {/* Items Table */}
<div className="table-container">
    <table className="items-table"> 
        <thead>
            <tr>
                <th>Item No.</th>
                <th>Item ID</th>
                <th>Item Name</th>
                <th>Unit Price</th>
                <th>Quantity</th>
            </tr>
        </thead>
        <tbody>
        {quotationItems.length > 0 ? (
                quotationItems.map((item, index) => (
                    <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.item_id || "N/A"}</td>
                        <td>{item.item_name || "N/A"}</td>
                        <td>{item.unit_price || "N/A"}</td>
                        <td>{item.purchase_quantity || "N/A"}</td>
                    </tr>
                ))
            ) : (
                    <tr>
                        <td colSpan="5">No items found</td>
                    </tr>
                )}
        </tbody>
                        </table>
                    </div>

                    {/* Footer Section */}
                    <div className="footer-section">
                        <div className="terms-section">
                            <h3>TERMS & CONDITIONS</h3>
                            <p>
                                Payment is due in{" "}
                                {fetchedData?.document_date && fetchedData?.invoice?.due_date
                                    ? Math.ceil(
                                        (new Date(fetchedData.invoice?.due_date) - new Date(fetchedData?.document_date)) / (1000 * 60 * 60 * 24)
                                    )
                                    : "N/A"}{" "}
                                days
                            </p>
                            <div className="bank-info">

                            </div>
                        </div>

                        <div className="totals-section">
                    {fetchedData && fetchedData.invoice ? (
                        <>
                        <div className="total-row">
                        <span>Subtotal:</span>
                        <span>{purchaseQuotationData?.total_before_discount || fetchedData?.total_before_discount || "N/A"}</span>
                    </div>
                    <div className="detail-row">
                        <span>DownPayment Rate:({fetchedData?.invoice?.dpm_rate}%)</span>
                        <span>{fetchedData?.invoice?.dpm_rate && purchaseQuotationData?.total_before_discount
            ? (
                  (parseFloat(purchaseQuotationData?.total_before_discount || 0) *
                      parseFloat(fetchedData?.invoice?.dpm_rate || 0)) /
                  100
              ).toFixed(2)
            : "N/A"}</span>
                    </div>
                    <div className="total-row">
                    <span>Discount ({purchaseQuotationData?.discount_percent || fetchedData?.discount_percent || "N/A"}%):</span>
                                            <span>
                                                {purchaseQuotationData?.total_before_discount && purchaseQuotationData?.discount_percent
                                                    ? (
                                                        (parseFloat(purchaseQuotationData?.total_before_discount || 0) *
                                                            parseFloat(purchaseQuotationData?.discount_percent || 0)) /
                                                        100
                                                    ).toFixed(2)
                                                    : fetchedData?.total_before_discount && fetchedData?.discount_percent
                                                    ? (
                                                        (parseFloat(fetchedData?.total_before_discount || 0) *
                                                            parseFloat(fetchedData?.discount_percent || 0)) /
                                                        100
                                                    ).toFixed(2)
                                                    : "N/A"}</span>
                    </div>
                    <div className="detail-row">
                        <span>Tax Amount:</span>
                        <span>{purchaseQuotationData?.tax || "N/A"}</span>
                    </div>
                    <div className="total-row">
                        <span>Total Credit:</span>
                        <span>{fetchedData.invoice?.total_credit || "N/A"}</span>
                    </div>
                    <div className="total-row">
                        <span>Balance Due:</span>
                        <span>{(() => {
                        const totalBeforeDiscount = parseFloat(
                            purchaseQuotationData?.total_before_discount || fetchedData?.total_before_discount || 0
                        );
                        const discountPercent = parseFloat(
                            purchaseQuotationData?.discount_percent || fetchedData?.discount_percent || 0
                        );
                        const discount = (totalBeforeDiscount * discountPercent) / 100;
                        const tax = parseFloat(purchaseQuotationData?.tax || 0);
                        const totalCredit = parseFloat(fetchedData.invoice?.total_credit || 0);
                        const downPaymentRate = parseFloat(fetchedData?.invoice?.dpm_rate || 0);
                        const downPayment = (totalBeforeDiscount * downPaymentRate) / 100;

                        const balanceDue = totalBeforeDiscount - discount + tax - totalCredit - downPayment;

                        return balanceDue.toFixed(2);
                    })()}</span>
                    </div>
                </>
                    ) : (
                        <p>Loading invoice details...</p>
                    )}
                </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PurchaseCredMemoForm;