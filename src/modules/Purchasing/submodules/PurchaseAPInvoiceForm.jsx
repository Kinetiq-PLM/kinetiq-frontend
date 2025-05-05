import React, { useEffect, useState } from "react";
import "../styles/PurchaseAPInvoiceForm.css";
import axios from "axios";

const PurchaseAPInvoiceForm = ({ invoiceData, onClose }) => {
    const [fetchedData, setFetchedData] = useState(null);
    const [purchaseQuotationData, setPurchaseQuotationData] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [companyName, setCompanyName] = useState("N/A");
    const [quotationItems, setQuotationItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [quotationContentData, setQuotationContentData] = useState([]);

    const handleBack = () => {
        onClose?.();
    };

    const { document_id } = invoiceData || {};

    const fetchEmployees = async (request_id) => {
        try {
            // Fetch PRF list to get employee_id
            const prfResponse = await axios.get("http://127.0.0.1:8000/api/prf/list/");
            const matchedPRF = prfResponse.data.find((prf) => prf.request_id === request_id);
    
            if (!matchedPRF) {
                setEmployees([]);
                return;
            }
    
            const { employee_id } = matchedPRF;
    
            // Fetch employees to get first_name and last_name
            const employeesResponse = await axios.get("http://127.0.0.1:8000/api/prf/employees/");
            const matchedEmployee = employeesResponse.data.filter((emp) => emp.employee_id === employee_id);
    
            setEmployees(matchedEmployee);
        } catch (err) {
            setEmployees([]);
        }
    };

    const fetchQuotationContent = async (request_id) => {
        try {
            console.log("Fetching quotation content for request_id:", request_id);

            // Fetch quotation content by request_id
            const quotationContentResponse = await axios.get("http://127.0.0.1:8000/api/quotation-content/list/");
            const matchedQuotationContent = quotationContentResponse.data.filter(
                (content) => content.request_id === request_id
            );

            if (matchedQuotationContent.length === 0) {
                console.log("No quotation content found for the given request_id");
                setQuotationItems([]);
                setQuotationContentData([]); // Reset quotationContentData
                return;
            }

            // Optionally, fetch item details if needed
            const itemResponse = await axios.get("http://127.0.0.1:8000/api/quotation-content/item/list/");
            const itemsWithDetails = matchedQuotationContent.map((content) => {
                const itemDetails = itemResponse.data.find((item) => item.item_id === content.item_id);
                return {
                    ...content,
                    item_name: itemDetails ? itemDetails.item_name : "N/A",
                };
            });

            setQuotationItems(itemsWithDetails);
            setQuotationContentData(itemsWithDetails); // Set the data for quotationContentData
            console.log("Fetched Quotation Items:", itemsWithDetails);
        } catch (error) {
            console.error("Error fetching quotation content:", error.message);
            setQuotationContentData([]); // Reset quotationContentData on error
        }
    };

    const fetchPurchaseQuotationData = async (document_id) => {
        try {
            setLoading(true);
            setError("");

            console.log("Fetching data for document_id:", document_id);
            // Use invoiceData directly!
        setFetchedData({ invoice: invoiceData });
        console.log("Updated Fetched Data:", { invoice: invoiceData });

            // Step 2: Fetch document header to get purchase_id
            const documentHeaderResponse = await axios.get("http://127.0.0.1:8000/api/invoices/document-header/");
            const matchedHeader = documentHeaderResponse.data.find((header) => header.document_id === document_id);

            if (!matchedHeader) {
                throw new Error("No document header found for the given document_id");
            }

            const { purchase_id } = matchedHeader;

            // Step 3: Fetch purchase orders to get quotation_id
            const purchaseOrdersResponse = await axios.get("http://127.0.0.1:8000/api/purchase-orders/list/");
            const matchedPurchaseOrder = purchaseOrdersResponse.data.find((order) => order.purchase_id === purchase_id);

            if (!matchedPurchaseOrder) {
                throw new Error("No purchase order found for the given purchase_id");
            }

            const { quotation_id } = matchedPurchaseOrder;

            // Step 4: Fetch purchase quotation details
            const purchaseQuotationResponse = await axios.get("http://127.0.0.1:8000/api/purchase_quotation/list/");
            const matchedQuotation = purchaseQuotationResponse.data.find((quotation) => quotation.quotation_id === quotation_id);

            if (!matchedQuotation) {
                throw new Error("No purchase quotation found for the given quotation_id");
            }

            setFetchedData({ invoice: invoiceData  });
            console.log("Updated Fetched Data:", { invoice: invoiceData  });

            setPurchaseQuotationData(matchedQuotation);
            console.log("Updated Purchase Quotation Data:", matchedQuotation);

            // Fetch vendor/company name using vendor_code
            
        // Step 5: Fetch vendor/company name using vendor_code from matchedQuotation
        if (matchedQuotation.vendor_code) {
            try {
                const vendorResponse = await axios.get("http://127.0.0.1:8000/api/purchase_quotation/vendor/list/");
                const matchedVendor = vendorResponse.data.find(
                    (vendor) => vendor.vendor_code === matchedQuotation.vendor_code
                );
                setCompanyName(matchedVendor ? matchedVendor.company_name : "N/A");
            } catch (err) {
                setCompanyName("N/A");
            }
        } else {
            setCompanyName("N/A");
        }

        // Step 6: Fetch employees using request_id
        fetchEmployees(matchedQuotation.request_id);

        // Step 7: Fetch quotation content
        fetchQuotationContent(matchedQuotation.request_id);

    } catch (error) {
        console.error("Error fetching purchase quotation data:", error.message);
        setError("Failed to fetch purchase quotation data. Please try again later.");
    } finally {
        setLoading(false);
    }
};

    useEffect(() => {
        
        if (invoiceData && invoiceData.document_id) {
            fetchPurchaseQuotationData(invoiceData.document_id);
        }
        
    }, [invoiceData]);

    console.log("Fetched Data State:", fetchedData);
    console.log("Purchase Quotation Data State:", purchaseQuotationData);
    return (
        <div className="purchase-ap-invoice-form">
            <div className="purchase-ap-invoice-scrollable-wrapper">
                <div className="purchase-ap-invoice-form-body-content-container">
                    {/* Header Section */}
                    <div className="purchase-ap-invoice-header">
                        <button className="purchase-ap-invoice-back-btn" onClick={handleBack}>
                            ← Back
                        </button>
                        <h1>Purchase Invoice</h1>
                    </div>

                    {/* Main Content */}
                    <div className="purchase-ap-invoice-content">
                        {loading ? (
                            <p>Loading...</p>
                        ) : error ? (
                            <p className="error-message">{error}</p>
                        ) : fetchedData && purchaseQuotationData ? (
                            <>
                                {/* Company Logo and Details Section */}
                                <div className="purchase-ap-invoice-company-section">
                                    <div className="purchase-ap-invoice-logo">
                                        <img src="../images/kinetiq.png" alt="Kinetiq Logo" />
                                    </div>
                                    <div className="purchase-ap-invoice-details">
                                        <div className="purchase-ap-invoice-info">
                                            <label>Status</label>
                                            <span>{fetchedData?.invoice?.status || "N/A"}</span>
                                        </div>
                                        <div className="purchase-ap-invoice-info">
                                            <label>Invoice No.</label>
                                            <span>{fetchedData?.invoice?.document_no || "N/A"}</span>
                                        </div>
                                        <div className="purchase-ap-invoice-info">
                                            <label>Invoice Date</label>
                                            <span>{fetchedData?.invoice?.document_date || "N/A"}</span>
                                        </div>
                                        <div className="purchase-ap-invoice-info">
                                            <label>Due</label>
                                            <span>{fetchedData?.invoice?.due_date || "N/A"}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* From and To Section */}
                                <div className="purchase-ap-invoice-addresses">
                                <div className="purchase-ap-invoice-from">
                                    <h3>From</h3>
                                    <h2>{companyName}</h2>
                                    {console.log("Rendering Company Name:", companyName, "Vendor Code:", purchaseQuotationData?.vendor_code)}
                                </div>
                                <div className="purchase-ap-invoice-to">
                                <div>
                                        <h3>Bill To</h3>
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
                                    <div>
                                        <h3>Ship To</h3>
                                        <p>{purchaseQuotationData?.delivery_loc || "N/A"}</p>
                                    </div>
                                </div>
                            </div>

                                 {/* Items Table */}
                                 <div className="purchase-ap-invoice-table">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Item ID</th>
                                                <th>Item Name</th>
                                                <th>Purchase Quantity</th>
                                                <th>Unit Price</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {quotationItems.length > 0 ? (
                                                quotationItems.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>{item.item_id || "N/A"}</td>
                                                        <td>{item.item_name || "N/A"}</td>
                                                        <td>{item.purchase_quantity || "N/A"}</td>
                                                        <td>{item.unit_price || "N/A"}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="4">No items found</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Payment and Total Section */}
                                <div className="purchase-ap-invoice-summary">
                                    <div className="purchase-ap-invoice-payment">
                                        <h3>Payment Instruction</h3>
                                        <div className="payment-details">
                                            <p>Ref. Number: {fetchedData?.invoice?.document_id || "N/A"}</p>
                                            <p>Tax Code: {quotationContentData?.[0]?.tax_code || fetchedData?.tax_code || "N/A"}</p>
                                        </div>
                                    </div>
                                    <div className="purchase-ap-invoice-totals">
                                        <div className="total-row">
                                            <span>Subtotal:</span>
                                            <span>{purchaseQuotationData?.total_before_discount || fetchedData?.total_before_discount || "N/A"}</span>
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
                                                    : "N/A"}
                                            </span>
                                        </div>
                                        <div className="total-row">
                                            <span>Downpayment Rate:</span>
                                            <span>{fetchedData?.invoice?.dpm_rate || "N/A"}</span>
                                        </div>
                                        <div className="total-row">
                                            <span>Total Downpayment:</span>
                                            <span>{purchaseQuotationData?.downpayment_request || fetchedData?.downpayment_request || "0.00"}</span>
                                        </div>
                                        <div className="total-row">
                                            <span>Shipping Cost:</span>
                                            <span>{purchaseQuotationData?.freight || fetchedData?.freight || "N/A"}</span>
                                        </div>
                                        <div className="total-row">
                                            <span>Tax Amount:</span>
                                            <span>{purchaseQuotationData?.tax || fetchedData?.tax || "N/A"}</span>
                                        </div>
                                        <div className="total-row">
                                            <span>Total:</span>
                                            <span>{purchaseQuotationData?.total_payment || fetchedData?.total_payment || "N/A"}</span>
                                        </div>
                                        <div className="total-row">
                                            <span>Amount Paid:</span>
                                            <span>{ fetchedData?.invoice?.applied_amount || "N/A"}</span>
                                        </div>
                                        <div className="total-row">
                                            <span>Credit Balance:</span>
                                            <span>{ fetchedData?.invoice?.credit_balance || "N/A"}</span>
                                        </div>
                                        <div className="total-row balance-due">
                                            <span>Balance Due:</span>
                                            <span>
                                                {purchaseQuotationData?.total_payment &&fetchedData?.invoice?.applied_amount
                                                    ? (
                                                        parseFloat(purchaseQuotationData?.total_payment || fetchedData?.invoice?.total_payment || 0) -
                                                        parseFloat(fetchedData?.invoice?.applied_amount || 0)
                                                    ).toFixed(2)
                                                    : "N/A"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <p>No data available</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PurchaseAPInvoiceForm;