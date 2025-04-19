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
    const [employees, setEmployees] = useState([]); // State for employees
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

    const fetchEmployeesFromPRF = async (request_id) => {
        try {
            console.log("Fetching PRF data for request_id:", request_id); // Debugging
            const prfResponse = await axios.get("http://127.0.0.1:8000/api/prf/list/");
            console.log("PRF API Response:", prfResponse.data); // Debugging

            // Find the PRF entry matching the request_id
            const matchedPRF = prfResponse.data.find((prf) => prf.request_id === request_id);
            if (!matchedPRF) {
                console.log("No PRF entry found for the given request_id");
                setEmployees([]); // Clear employees if no match is found
                return;
            }

            console.log("Matched PRF Entry:", matchedPRF);

            // Extract the employee_id from the matched PRF entry
            const { employee_id } = matchedPRF;
            console.log("Employee ID:", employee_id);

            // Fetch employee details using employee_id
            const employeesResponse = await axios.get("http://127.0.0.1:8000/api/prf/employees/");
            const matchedEmployee = employeesResponse.data.find((employee) => employee.employee_id === employee_id);

            if (!matchedEmployee) {
                console.log("No employee found for the given employee_id");
                setEmployees([]); // Clear employees if no match is found
            } else {
                console.log("Matched Employee:", matchedEmployee);
                setEmployees([matchedEmployee]); // Set the matched employee in the state
            }
        } catch (error) {
            console.error("Error fetching employees from PRF:", error.message);
        }
    };
    const fetchVendorData = async (quotation_id) => {
        try {
            console.log("Fetching vendor data for quotation_id:", quotation_id);
    
            // Fetch vendor data using quotation_id
            const vendorResponse = await axios.get("http://127.0.0.1:8000/api/purchase_quotation/list/");
            const matchedVendor = vendorResponse.data.find(
                (vendor) => vendor.quotation_id === quotation_id
            );
    
            if (!matchedVendor) {
                console.log("No vendor found for the given quotation_id");
                return null;
            }
    
            console.log("Matched Vendor:", matchedVendor);
    
            // Return the vendor_code
            return matchedVendor.vendor_code;
        } catch (error) {
            console.error("Error fetching vendor data:", error.message);
            return null;
        }
    };
    
    const fetchVendorName = async (vendor_code) => {
        try {
            console.log("Fetching vendor name for vendor_code:", vendor_code);
    
            // Fetch vendor name using vendor_code
            const vendorListResponse = await axios.get("http://127.0.0.1:8000/api/purchase_quotation/vendor/list/");
            const matchedVendor = vendorListResponse.data.find(
                (vendor) => vendor.vendor_code === vendor_code
            );
    
            if (!matchedVendor) {
                console.log("No vendor found for the given vendor_code");
                return "N/A";
            }
    
            console.log("Matched Vendor Name:", matchedVendor.vendor_name);
    
            // Return the vendor_name
            return matchedVendor.vendor_name;
        } catch (error) {
            console.error("Error fetching vendor name:", error.message);
            return "N/A";
        }
    };

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
    
                // Fetch employees from PRF using request_id
                fetchEmployeesFromPRF(matchedExternalModule.request_id);
    
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
    
                    // Fetch vendor_code using quotation_id
                    const vendor_code = await fetchVendorData(matchedPurchaseQuotation[0]?.quotation_id);
                    console.log("Vendor Code:", vendor_code);
    
                    if (vendor_code) {
                        // Fetch vendor_name using vendor_code
                        const vendor_name = await fetchVendorName(vendor_code);
                        console.log("Vendor Name:", vendor_name);
    
                        // Update purchaseQuotationData with vendor_name
                        setPurchaseQuotationData((prevData) =>
                            prevData.map((item, index) =>
                                index === 0 ? { ...item, vendor_name } : item
                            )
                        );
                    }
    
                    // Fetch materials and assets
                    const materialsResponse = await axios.get("http://127.0.0.1:8000/api/quotation-content/materials/list/");
                    const assetsResponse = await axios.get("http://127.0.0.1:8000/api/quotation-content/assets/list/");
                    const materials = materialsResponse.data;
                    const assets = assetsResponse.data;
    
                    console.log("Materials:", materials); // Debugging
                    console.log("Assets:", assets); // Debugging
    
                    // Fetch quotation content data
                    const quotationContentResponse = await axios.get("http://127.0.0.1:8000/api/quotation-content/list/");
                    const matchedQuotationContent = quotationContentResponse.data.filter(
                        (content) => content.request_id === matchedExternalModule.request_id
                    );
    
                    // Merge with material/asset info
                    const enrichedItems = matchedQuotationContent.map((item) => {
                        if (item.material_id) {
                            const matchedMaterial = materials.find(
                                (mat) => mat.material_id === item.material_id
                            );
                            console.log("Matched Material:", matchedMaterial); // Debugging
                            return {
                                ...item,
                                material_name: matchedMaterial?.material_name || "N/A",
                                unit_price: matchedMaterial?.cost_per_unit || "N/A",
                            };
                        } else if (item.asset_id) {
                            const matchedAsset = assets.find(
                                (ast) => ast.asset_id === item.asset_id
                            );
                            console.log("Matched Asset:", matchedAsset); // Debugging
                            return {
                                ...item,
                                asset_name: matchedAsset?.asset_name || "N/A",
                                unit_price: matchedAsset?.purchase_price || "N/A",
                            };
                        }
                        return item;
                    });
    
                    console.log("Enriched Quotation Content:", enrichedItems); // Debugging
                    setQuotationContentData(enrichedItems);
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
            <div className="purchase-ap-invoice-scrollable-wrapper">
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
                                        <h2>{purchaseQuotationData?.[0]?.vendor_name || "N/A"}</h2>
                                            {console.log("Rendering Vendor Name:", purchaseQuotationData?.[0]?.vendor_name)}
                                        
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
                                            <p>{purchaseQuotationData?.[0]?.delivery_loc || fetchedData.delivery_loc || "N/A"}</p>
                                            
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
                                        {console.log("Rendering Quotation Content Data:", quotationContentData)} {/* Debugging */}   
                                        {quotationContentData?.length > 0 ? (
                                        quotationContentData.map((item, index) => (
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
                                            
                                            <p>Ref. Number: {fetchedData.content_id || "N/A"}</p>
                                            <p>Tax Code: {quotationContentData?.[0]?.tax_code || fetchedData.tax_code || "N/A"}</p>
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
                                            <span>{purchaseQuotationData?.[0]?.downpayment_request || fetchedData.downpayment_request || "0.00"}</span>
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
        </div>
    );
};

export default PurchaseAPInvoiceForm;