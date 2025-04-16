import React, { useEffect, useState } from "react";
import "../styles/PurchaseAPInvoiceForm.css";
import axios from "axios";

const PurchaseAPInvoiceForm = ({ invoiceData, onClose }) => {
    const [fetchedData, setFetchedData] = useState(null);
    const [externalModuleData, setExternalModuleData] = useState(null);
    const [purchaseQuotationData, setPurchaseQuotationData] = useState(null);
    const [quotationMaterials, setQuotationMaterials] = useState([]);
    const [quotationAssets, setQuotationAssets] = useState([]);
    const [quotationContentData, setQuotationContentData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [amountPaid, setAmountPaid] = useState(0); // New state for user input

    const handleBack = () => {
        onClose?.();
    };

    const handleDone = () => {
        console.log("Done button clicked");
    };

    const { content_id } = invoiceData || {};

    const fetchDataFromContentId = async (content_id) => {
        try {
            setLoading(true);
            setError("");

            console.log("Fetching data for content_id:", content_id);

            // Fetch all invoices
            const invoicesResponse = await axios.get("http://127.0.0.1:8000/api/invoices/list/");
            const invoice = invoicesResponse.data.find((inv) => inv.content_id === content_id);
            if (!invoice) throw new Error("Invoice not found for the given content_id");

            console.log("Matched Invoice:", invoice);

            // Fetch external_module data
            const externalModulesResponse = await axios.get("http://127.0.0.1:8000/api/invoices/external-modules/");
            const matchedExternalModule = externalModulesResponse.data.find(
                (module) => module.content_id === content_id
            );

            if (!matchedExternalModule) {
                console.log("No external module found for the given content_id");
            } else {
                console.log("Matched External Module:", matchedExternalModule);
                setExternalModuleData(matchedExternalModule);

                // Fetch purchase_quotation data using request_id from external_module
                const purchaseQuotationResponse = await axios.get("http://127.0.0.1:8000/api/purchase_quotation/list/");
                const matchedPurchaseQuotation = purchaseQuotationResponse.data.filter(
                    (quotation) => quotation.request_id === matchedExternalModule.request_id
                );

                if (matchedPurchaseQuotation.length === 0) {
                    console.log("No purchase quotation found for the given request_id");
                } else {
                    console.log("Matched Purchase Quotation:", matchedPurchaseQuotation);
                    setPurchaseQuotationData(matchedPurchaseQuotation);

                    // Fetch vendor data
                    const vendorResponse = await axios.get("http://127.0.0.1:8000/api/purchase_quotation/vendor/list/");
                    const matchedVendor = vendorResponse.data.find(
                        (vendor) => vendor.vendor_code === matchedPurchaseQuotation[0]?.vendor_code
                    );

                    if (matchedVendor) {
                        console.log("Matched Vendor:", matchedVendor);
                        setPurchaseQuotationData((prev) => ({
                            ...prev,
                            vendor_name: matchedVendor.vendor_name,
                            vendor_address: matchedVendor.vendor_address,
                        }));
                    } else {
                        console.log("No vendor found for the given vendor_code");
                    }

                    // Fetch materials and assets
                    const materialsResponse = await axios.get("http://127.0.0.1:8000/api/quotation-content/materials/list/");
                    const matchedMaterials = materialsResponse.data.filter(
                        (material) => material.request_id === matchedExternalModule.request_id
                    );

                    const assetsResponse = await axios.get("http://127.0.0.1:8000/api/quotation-content/assets/list/");
                    const matchedAssets = assetsResponse.data.filter(
                        (asset) => asset.request_id === matchedExternalModule.request_id
                    );

                    // Fetch quotation content data
                    const quotationContentResponse = await axios.get("http://127.0.0.1:8000/api/quotation-content/list/");
                    const matchedQuotationContent = quotationContentResponse.data.filter(
                        (content) => content.request_id === matchedExternalModule.request_id
                    );

                    // Merge with material/asset info
                    const enrichedItems = matchedQuotationContent.map((item) => {
                        if (item.material_id) {
                            const matchedMaterial = matchedMaterials.find(
                                (mat) => mat.material_id === item.material_id
                            );
                            return {
                                ...item,
                                material_name: matchedMaterial?.material_name || "N/A",
                                unit_price: matchedMaterial?.cost_per_unit || "N/A",
                            };
                        } else if (item.asset_id) {
                            const matchedAsset = matchedAssets.find(
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
                    invoice.items = enrichedItems; // Add enriched items to the invoice
                }
            }

            setFetchedData(invoice);
        } catch (error) {
            console.error("Error fetching data:", error.message);
            setError("Failed to fetch data. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (content_id) {
            fetchDataFromContentId(content_id);
        }
    }, [content_id]);

    const totalPayment = purchaseQuotationData?.[0]?.total_payment || fetchedData?.total_payment || 0;
    const balanceDue = totalPayment - fetchedData?.applied_amount;

    return (
        <div className="purchase-ap-invoice-form">
            <div className="purchase-ap-invoice-form-body-content-container">
                {/* Header Section */}
                <div className="purchase-ap-invoice-header">
                    <button className="purchase-ap-invoice-back-btn" onClick={handleBack}>← Back</button>
                    <h1>Purchase Invoice</h1>
                </div>

                {/* Main Content */}
                <div className="purchase-ap-invoice-content">
                    {loading ? (
                        <p>Loading...</p>
                    ) : error ? (
                        <p className="error-message">{error}</p>
                    ) : fetchedData ? (
                        <>
                            {/* Company Logo and Details Section */}
                            <div className="purchase-ap-invoice-company-section">
                                <div className="purchase-ap-invoice-logo">
                                    <img src="../images/kinetiq.png" alt="Kinetiq Logo" />
                                </div>
                                <div className="purchase-ap-invoice-details">
                                    <div className="purchase-ap-invoice-info">
                                        <label>Status</label>
                                        <span>{fetchedData.status || "N/A"}</span>
                                    </div>
                                    <div className="purchase-ap-invoice-info">
                                        <label>Invoice No.</label>
                                        <span>{fetchedData.document_no || "N/A"}</span>
                                    </div>
                                    <div className="purchase-ap-invoice-info">
                                        <label>Invoice Date</label>
                                        <span>{fetchedData.document_date || "N/A"}</span>
                                    </div>
                                    <div className="purchase-ap-invoice-info">
                                        <label>Due</label>
                                        <span>{fetchedData.due_date || "N/A"}</span>
                                    </div>
                                </div>
                            </div>

                            {/* From and To Section */}
                            <div className="purchase-ap-invoice-addresses">
                                <div className="purchase-ap-invoice-from">
                                    <h3>From</h3>
                                    <h2>{purchaseQuotationData?.vendor_code || "N/A"}</h2>
                                    <p>SoftwareTech.com</p>
                                    <p>8970678878898</p>
                                    <p>LA, U.S</p>
                                </div>
                                <div className="purchase-ap-invoice-to">
                                    <div>
                                        <h3>Bill To</h3>
                                        <h2></h2>
                                        <p>{purchaseQuotationData?.[0]?.delivery_loc || fetchedData.delivery_loc || "N/A"}</p>
                                        <p>SoftwareTech.com</p>
                                        <p>8970678878898</p>
                                        <p>LA, U.S</p>
                                        <p>Track #: RO123456789</p>
                                    </div>
                                    <div>
                                        <h3>Ship To</h3>
                                        <p>{purchaseQuotationData?.[0]?.delivery_loc || fetchedData.delivery_loc || "N/A"}</p>
                                        <p>Track #: RO123456789</p>
                                    </div>
                                </div>
                            </div>

                            {/* Items Table */}
                            <div className="purchase-ap-invoice-table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Item No.</th>
                                            <th>Material/Asset ID</th>
                                            <th>Material/Asset Name</th>
                                            <th>Unit Price</th>
                                            <th>Purchase Quantity</th>
                                            
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {fetchedData?.items?.length > 0 ? (
                                            fetchedData.items.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{item.material_id || item.asset_id || "N/A"}</td>
                                                    <td>{item.material_name || item.asset_name || "N/A"}</td>
                                                    <td>{item.unit_price || "N/A"}</td>
                                                    <td>{item.purchase_quantity || "N/A"}</td>
                                                    
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6">No items found</td>
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
                                        <p>Kinetiq</p>
                                        <p>Bank name: Kinetiq Bank</p>
                                        <p>Account Number: 1234567</p>
                                        <p>Ref. Number: {fetchedData.content_id || "N/A"}</p>
                                        <p>Routing: 1234567</p>
                                        <p>Tax Code: 1234567</p>
                                    </div>
                                </div>
                                <div className="purchase-ap-invoice-totals">
                                    <div className="total-row">
                                        <span>Subtotal:</span>
                                        <span>{purchaseQuotationData?.[0]?.total_before_discount || fetchedData.total_before_discount || "N/A"}</span>
                                    </div>
                                    <div className="total-row">
                                        <span>Discount (20%):</span>
                                        <span>{purchaseQuotationData?.[0]?.discount_percent || fetchedData.discount_percent || "N/A"}</span>
                                    </div>
                                    <div className="total-row">
                                        <span>Downpayment Rate:</span>
                                        <span>{fetchedData.dpm_rate || "N/A"}</span>
                                    </div>
                                    <div className="total-row">
                                        <span>Total Downpayment:</span>
                                        <span>{purchaseQuotationData?.[0]?.downpayment_request || fetchedData.downpayment_request || "N/A"}</span>
                                    </div>
                                    <div className="total-row">
                                        <span>Shipping Cost:</span>
                                        <span>{purchaseQuotationData?.[0]?.freight || fetchedData.freight || "N/A"}</span>
                                    </div>
                                    <div className="total-row">
                                        <span>Tax Amount:</span>
                                        <span>{purchaseQuotationData?.[0]?.tax || fetchedData.tax || "N/A"}</span>
                                    </div>
                                    <div className="total-row">
                                        <span>Total:</span>
                                        <span>{purchaseQuotationData?.[0]?.total_payment || fetchedData.total_payment || "N/A"}</span>
                                    </div>
                                    <div className="total-row">
                                        <span>Amount Paid:</span>
                                        <span>{fetchedData.applied_amount}</span>
                                    </div>
                                    <div className="total-row">
                                        <span>Credit Balance:</span>
                                        <span>{fetchedData.credit_balance || "N/A"}</span>
                                    </div>
                                    <div className="total-row balance-due">
                                        <span>Balance Due:</span>
                                        <span>{balanceDue >= 0 ? balanceDue : "Invalid Amount"}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Done Button */}
                            <button className="purchase-ap-invoice-done-btn" onClick={handleDone}>Done</button>
                        </>
                    ) : (
                        <p>No data available</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PurchaseAPInvoiceForm;