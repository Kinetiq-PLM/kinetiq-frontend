import React, { useEffect, useState } from "react";
import "../styles/PurchaseCredMemoForm.css";
import axios from "axios";

const PurchaseCredMemoForm = ({ memoData, onClose }) => {
    const [fetchedData, setFetchedData] = useState(null);
    const [quotationContentData, setQuotationContentData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleBack = () => {
        onClose?.();
    };

    const {
        credit_memo_id,
        document_no,
        document_date,
        due_date,
        total_credit,
        balance_due,
        dpm_rate,
    } = memoData || {};

    const fetchDataFromCreditMemoId = async (credit_memo_id) => {
        try {
            setLoading(true);
            setError("");
    
            console.log("Fetching data for credit_memo_id:", credit_memo_id);
    
            // Step 1: Fetch the credit memo to get the associated invoice_id
            const creditMemoResponse = await axios.get(
                "https://yi92cir5p0.execute-api.ap-southeast-1.amazonaws.com/dev/api/credit-memo/list/"
            );
            const matchedCreditMemo = creditMemoResponse.data.find(
                (memo) => memo.credit_memo_id === credit_memo_id
            );
    
            if (!matchedCreditMemo) {
                throw new Error("No credit memo found matching the given credit_memo_id");
            }
    
            const { invoice_id } = matchedCreditMemo;
    
            // Step 2: Fetch the invoice to get the content_id
            const invoiceResponse = await axios.get(
                "https://yi92cir5p0.execute-api.ap-southeast-1.amazonaws.com/dev/api/invoices/list/"
            );
            const matchedInvoice = invoiceResponse.data.find(
                (invoice) => invoice.invoice_id === invoice_id
            );
    
            if (!matchedInvoice) {
                throw new Error("No invoice found matching the given invoice_id");
            }
    
            const { content_id } = matchedInvoice;
    
            console.log("Content ID:", content_id);
    
            // Step 3: Fetch the external module to get the purchase_id and request_id
            const externalModulesResponse = await axios.get(
                "https://yi92cir5p0.execute-api.ap-southeast-1.amazonaws.com/dev/api/invoices/external-modules/"
            );
            const matchedExternalModule = externalModulesResponse.data.find(
                (module) => module.content_id === content_id
            );
    
            if (!matchedExternalModule) {
                throw new Error("No external module found matching the given content_id");
            }
    
            const { purchase_id, request_id } = matchedExternalModule;
    
            console.log("Purchase ID:", purchase_id);
    
            // Step 4: Fetch employees using request_id
            const prfResponse = await axios.get(
                "https://yi92cir5p0.execute-api.ap-southeast-1.amazonaws.com/dev/api/prf/list/"
            );
            const matchedPRF = prfResponse.data.find((prf) => prf.request_id === request_id);
    
            let employeeName = "N/A";
            if (matchedPRF) {
                const { employee_id } = matchedPRF;
                const employeesResponse = await axios.get(
                    "https://yi92cir5p0.execute-api.ap-southeast-1.amazonaws.com/dev/api/prf/employees/"
                );
                const matchedEmployee = employeesResponse.data.find(
                    (employee) => employee.employee_id === employee_id
                );
                employeeName = matchedEmployee
                    ? `${matchedEmployee.first_name} ${matchedEmployee.last_name}`
                    : "N/A";
            }
    
            // Step 5: Fetch purchase_quotation data using request_id
            const purchaseQuotationResponse = await axios.get(
                "https://yi92cir5p0.execute-api.ap-southeast-1.amazonaws.com/dev/api/purchase_quotation/list/"
            );
            const matchedPurchaseQuotation = purchaseQuotationResponse.data.find(
                (quotation) => quotation.request_id === request_id
            );
    
            let subtotal = "N/A";
            let discountPercent = "N/A";
            let tax = "N/A";
            let vendorCode = "N/A";
            let deliveryLoc = "N/A";
    
            if (matchedPurchaseQuotation) {
                subtotal = matchedPurchaseQuotation.total_before_discount || "N/A";
                discountPercent = matchedPurchaseQuotation.discount_percent || "N/A";
                tax = matchedPurchaseQuotation.tax || "N/A";
                vendorCode = matchedPurchaseQuotation.vendor_code || "N/A";
                deliveryLoc = matchedPurchaseQuotation.delivery_loc || "N/A";
            }
    
            // Step 6: Fetch vendor_name using vendor_code
            let vendorName = "N/A";
            if (vendorCode !== "N/A") {
                const vendorResponse = await axios.get(
                    "https://yi92cir5p0.execute-api.ap-southeast-1.amazonaws.com/dev/api/purchase_quotation/vendor/list/"
                );
                const matchedVendor = vendorResponse.data.find(
                    (vendor) => vendor.vendor_code === vendorCode
                );
                vendorName = matchedVendor ? matchedVendor.vendor_name : "N/A";
                console.log("Vendor Name:", vendorName);
            }
    
            // Step 7: Fetch materials and assets
            const materialsResponse = await axios.get(
                "https://yi92cir5p0.execute-api.ap-southeast-1.amazonaws.com/dev/api/quotation-content/materials/list/"
            );
            const assetsResponse = await axios.get(
                "https://yi92cir5p0.execute-api.ap-southeast-1.amazonaws.com/dev/api/quotation-content/assets/list/"
            );
            const materials = materialsResponse.data;
            const assets = assetsResponse.data;
    
            // Step 8: Fetch quotation content data using request_id
            const quotationContentResponse = await axios.get(
                "https://yi92cir5p0.execute-api.ap-southeast-1.amazonaws.com/dev/api/quotation-content/list/"
            );
            const matchedQuotationContent = quotationContentResponse.data.filter(
                (content) => content.request_id === request_id
            );
    
            // Step 9: Enrich quotation content with material/asset info
            const enrichedItems = matchedQuotationContent.map((item) => {
                if (item.material_id) {
                    const matchedMaterial = materials.find(
                        (mat) => mat.material_id === item.material_id
                    );
                    return {
                        ...item,
                        material_name: matchedMaterial?.material_name || "N/A",
                        unit_price: matchedMaterial?.cost_per_unit || "N/A",
                    };
                } else if (item.asset_id) {
                    const matchedAsset = assets.find(
                        (ast) => ast.asset_id === item.asset_id
                    );
                    return {
                        ...item,
                        asset_name: matchedAsset?.asset_name || "N/A",
                        unit_price: matchedAsset?.purchase_price || "N/A",
                    };
                }
                return item;
            });
    
            setQuotationContentData(enrichedItems);
    
            // Step 10: Set fetched data
            setFetchedData({
                creditMemo: matchedCreditMemo,
                invoice: matchedInvoice,
                externalModule: matchedExternalModule,
                employeeName,
                vendorCode,
                vendorName,
                deliveryLoc,
                subtotal,
                discountPercent,
                tax,
            });
        } catch (error) {
            console.error("Error fetching data:", error.message);
            setError("Failed to fetch data. Please check your network connection or try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (credit_memo_id) {
            fetchDataFromCreditMemoId(credit_memo_id);
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
<div className="content">
    {/* Company and Customer Info */}
    <div className="info-section">
        <div className="company-info">
            <h3>Supplier</h3>
            <p> {fetchedData?.vendorName || "N/A"}</p>
        </div>

        <div className="customer-info">
            <div className="info-block">
                <h3>CUSTOMER</h3>
                <p>{fetchedData?.employeeName || "N/A"}</p>
                <p>NCR</p>
                <p>PH, Manila</p>
            </div>

            <div className="info-block">
                <h3>SHIP TO</h3>
                <p>{fetchedData?.deliveryLoc || "N/A"}</p>
            </div>
        

                            <div className="info-block">
                                <div className="memo-details">
                                    <div className="detail-row">
                                        <span>CREDIT MEMO NO.</span>
                                        <span>{credit_memo_id}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span>CREDIT MEMO DATE</span>
                                        <span>{document_date}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span>DOCUMENT NO.</span>
                                        <span>{document_no}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span>DUE DATE</span>
                                        <span>{due_date}</span>
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
                <th>Material/Asset ID</th>
                <th>Material/Asset Name</th>
                <th>Unit Price</th>
                <th>Quantity</th>
            </tr>
        </thead>
        <tbody>
            {console.log("Rendering Quotation Content Data:", quotationContentData)} {/* Debugging */}
            {quotationContentData?.length > 0 ? (
                quotationContentData.map((item, index) => (
                    <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.material_id || item.asset_id || "N/A"}</td>
                        <td>{item.material_name || item.asset_name || "N/A"}</td>
                        <td>
                        {item.unit_price}
                        </td>
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
                                {document_date && due_date
                                    ? Math.ceil(
                                        (new Date(due_date) - new Date(document_date)) / (1000 * 60 * 60 * 24)
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
                        <span>{fetchedData.subtotal || "N/A"}</span>
                    </div>
                    <div className="detail-row">
                        <span>DownPayment Rate:({dpm_rate}%)</span>
                        <span>{dpm_rate || "N/A"}</span>
                    </div>
                    <div className="total-row">
                        <span>Discount ({fetchedData.discountPercent || "N/A"}%):</span>
                        <span>{fetchedData && fetchedData.subtotal && fetchedData.discountPercent
                            ? (
                                (parseFloat(fetchedData.subtotal) *
                                    parseFloat(fetchedData.discountPercent || 0)) /
                                100
                            ).toFixed(2)
                            : "N/A"}</span>
                    </div>
                    <div className="detail-row">
                        <span>Tax Amount:</span>
                        <span>{fetchedData.tax || "N/A"}</span>
                    </div>
                    <div className="total-row">
                        <span>Total Credit:</span>
                        <span>{fetchedData.invoice?.total_credit || "N/A"}</span>
                    </div>
                    <div className="total-row">
                        <span>Balance Due:</span>
                        <span>{fetchedData && fetchedData.subtotal
            ? (
                  parseFloat(fetchedData.subtotal || 0) -
                  (parseFloat(fetchedData.subtotal || 0) *
                      parseFloat(fetchedData.discountPercent || 0)) /
                      100 +
                  parseFloat(fetchedData.tax || 0) -
                  parseFloat(fetchedData.invoice?.total_credit || 0) -
                  (parseFloat(fetchedData.subtotal || 0) *
                      parseFloat(dpm_rate || 0)) /
                      100
              ).toFixed(2)
            : "N/A"}</span>
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