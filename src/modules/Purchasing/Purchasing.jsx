import React, { useEffect, useState } from "react";
import "./styles/Purchasing.css";
import purchasereqImg from "./purchasing_imgs/purchasereq.png";
import purchasequoteImg from "./purchasing_imgs/purchasequote.png";
import purchaseordImg from "./purchasing_imgs/purchaseord.png";
import grpoImg from "./purchasing_imgs/grpo.png";
import apinvoiceImg from "./purchasing_imgs/apinvoice.png";
import creditmemoImg from "./purchasing_imgs/creditmemo.png";
import PurchaseReqListBody from "./submodules/PurchaseReqList";
import PurchaseQuot from "./submodules/PurchaseQuot";
import PurchaseOrdStat from "./submodules/PurchaseOrdStat";
import PurchaseAPInvoice from "./submodules/PurchaseAPInvoice";
import PurchaseCredMemo from "./submodules/PurchaseCredMemo";

const PurchasingDashboard = () => {
    const [activeModule, setActiveModule] = useState(null);

    useEffect(() => {
        const handleBackToDashboard = () => setActiveModule(null);
        window.addEventListener('purchasing-back-to-dashboard', handleBackToDashboard);
        return () => window.removeEventListener('purchasing-back-to-dashboard', handleBackToDashboard);
    }, []);

    const handleStepClick = (step) => {
        switch (step) {
            case "PurchaseReqList":
                setActiveModule("PurchaseReqList");
                break;
            case "PurchaseQuot":
                setActiveModule("PurchaseQuot");
                break;
            case "PurchaseOrdStat":
                setActiveModule("PurchaseOrdStat");
                break;
            case "GRPO":
                window.alert("This is for operation module");
                break;
            case "PurchaseAPInvoice":
                setActiveModule("PurchaseAPInvoice");
                break;
            case "PurchaseCredMemo":
                setActiveModule("PurchaseCredMemo");
                break;
            default:
                setActiveModule(null);
        }
    };

    // Add handler to return to dashboard
    const handleBackToDashboard = () => {
        setActiveModule(null);
    };

    return (
        <div className="purch">
            <div className="body-content-container">
                {activeModule === "PurchaseReqList" && <PurchaseReqListBody onBackToDashboard={handleBackToDashboard} />}
                {activeModule === "PurchaseQuot" && <PurchaseQuot onBackToDashboard={handleBackToDashboard} />}
                {activeModule === "PurchaseOrdStat" && <PurchaseOrdStat onBackToDashboard={handleBackToDashboard} />}
                {activeModule === "PurchaseAPInvoice" && <PurchaseAPInvoice onBackToDashboard={handleBackToDashboard} />}
                {activeModule === "PurchaseCredMemo" && <PurchaseCredMemo onBackToDashboard={handleBackToDashboard} />}
                {!activeModule && (
                    <>
                        <div className="purchasing-dashboard-title">PURCHASING DASHBOARD</div>
                        <div className="purchasing-steps-aligner">
                            <div className="purchasing-steps-row">
                                {/* Step 1: Purchase Request */}
                                <button type="button" className="purchasing-step-box" tabIndex={0} onClick={() => handleStepClick("PurchaseReqList")}> 
                                    <img src={purchasereqImg} alt="Purchase Request" width="38" height="38" style={{ objectFit: "contain" }} />
                                    <div className="purchasing-step-label">Purchase Request</div>
                                </button>
                                <div className="purchasing-arrow">
                                    <svg width="36" height="24" fill="none" stroke="#222" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 36 24">
                                        <line x1="2" y1="12" x2="32" y2="12" />
                                        <polyline points="26,6 32,12 26,18" />
                                    </svg>
                                </div>
                                {/* Step 2: Purchase Quotation */}
                                <button type="button" className="purchasing-step-box" tabIndex={0} onClick={() => handleStepClick("PurchaseQuot")}> 
                                    <img src={purchasequoteImg} alt="Purchase Quotation" width="38" height="38" style={{ objectFit: "contain" }} />
                                    <div className="purchasing-step-label">Purchase Quotation</div>
                                </button>
                                <div className="purchasing-arrow">
                                    <svg width="36" height="24" fill="none" stroke="#222" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 36 24">
                                        <line x1="2" y1="12" x2="32" y2="12" />
                                        <polyline points="26,6 32,12 26,18" />
                                    </svg>
                                </div>
                                {/* Step 3: Purchase Order */}
                                <button type="button" className="purchasing-step-box" tabIndex={0} onClick={() => handleStepClick("PurchaseOrdStat")}> 
                                    <img src={purchaseordImg} alt="Purchase Order" width="38" height="38" style={{ objectFit: "contain" }} />
                                    <div className="purchasing-step-label">Purchase Order</div>
                                </button>
                                <div className="purchasing-arrow">
                                    <svg width="36" height="24" fill="none" stroke="#222" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 36 24">
                                        <line x1="2" y1="12" x2="32" y2="12" />
                                        <polyline points="26,6 32,12 26,18" />
                                    </svg>
                                </div>
                                {/* Step 4: GRPO */}
                                <button type="button" className="purchasing-step-box" tabIndex={0} onClick={() => handleStepClick("GRPO")}> 
                                    <img src={grpoImg} alt="GRPO" width="38" height="38" style={{ objectFit: "contain" }} />
                                    <div className="purchasing-step-label">GRPO</div>
                                </button>
                                <div className="purchasing-arrow">
                                    <svg width="36" height="24" fill="none" stroke="#222" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 36 24">
                                        <line x1="2" y1="12" x2="32" y2="12" />
                                        <polyline points="26,6 32,12 26,18" />
                                    </svg>
                                </div>
                                {/* Step 5: A/P Invoice with vertical branch */}
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <button type="button" className="purchasing-step-box" tabIndex={0} onClick={() => handleStepClick("PurchaseAPInvoice")}> 
                                        <img src={apinvoiceImg} alt="A/P Invoice" width="38" height="38" style={{ objectFit: "contain" }} />
                                        <div className="purchasing-step-label">A/P Invoice</div>
                                    </button>
                                    <div className="purchasing-vertical-arrow">
                                        <svg width="24" height="36" fill="none" stroke="#222" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 36">
                                            <line x1="12" y1="2" x2="12" y2="32" />
                                            <polyline points="6,26 12,32 18,26" />
                                        </svg>
                                    </div>
                                    <button type="button" className="purchasing-step-box" tabIndex={0} onClick={() => handleStepClick("PurchaseCredMemo")}> 
                                        <img src={creditmemoImg} alt="Credit Memo" width="38" height="38" style={{ objectFit: "contain" }} />
                                        <div className="purchasing-step-label">Credit Memo</div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default PurchasingDashboard;
