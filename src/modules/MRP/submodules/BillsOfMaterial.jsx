import React from "react";
import "../styles/BillsOfMaterial.css";
import { useState } from "react";

const BodyContent = ({loadSubModule, setActiveSubModule}) => {
    const [rawmaterial, setRawMaterial] = useState(false);
    const [additionalcost, setAdditionalCost] = useState(false);
    const [additionalcost2, setAdditionalCost2] = useState(false);
    const [checker, setChecker] = useState(false);
    const [created, setCreated] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isOpen2, setIsOpen2] = useState(false);
    const [flag, setFlag] = useState(0);
    const [printBOM, setPrintBOM] = useState(false);

    const bomData = [
        { number: "000000001", type: "Project", status: "Pending", date: "July 3 2025" },
        { number: "000000002", type: "Non Project", status: "Approved", date: "July 3 2025" },

    ];
    const bomDetails = [
        { no: 1, product: "Apple", qtyProduct: 100, rawMaterial: "Sugar",qtyRawMaterial: 50, unit: "kg", costPerUnit: 120, totalCost: 600},
        { no: 1, product: "Apple", qtyProduct: 100, rawMaterial: "Sugar",qtyRawMaterial: 50, unit: "kg", costPerUnit: 12000, totalCost: 6000},
    ];

    const bomCostDetails = {
        rawMaterial: 40000.80,
        subtotal: 10000,
        production: 40000.80,
        labor: 40000.80,
        total: 90001.60
    };

    const cellStyle = (width) => ({
        width, alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0)', borderLeft: '1px #E8E8E8 solid', borderTop: '1px #E8E8E8 solid', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px 12px', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: 400, textAlign: 'center', lineHeight: 1, wordWrap: 'break-word'
    });
    
    const dynamicHeight = 1191 + (bomDetails.length - 5) * 36;

    return (
        <div className="bom">
            <div className="body-content-container">
                <div className="title">BOM LIST</div>
                <div style={{width: 1300, justifyContent: 'space-between', alignItems: 'center', display: 'inline-flex'}}>
                    <div style={{justifyContent: 'flex-start', alignItems: 'flex-start', display: 'flex',paddingRight: 30}}>
                        <div onClick={() => setFlag(0)} onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(200, 200, 200, 0.1)")} onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0)")} style={{width: 185, padding: 13, background: 'white', boxShadow: flag === 0 ? '0px -2px 0px #00A8A8 inset' : '0px -1px 0px #E8E8E8 inset', overflow: 'hidden', justifyContent: 'center', alignItems: 'center', gap: 5, display: 'flex'}}>
                            <div style={{textAlign: 'center', color: flag === 0 ? '#00A8A8' : '#585757', fontSize: 16, fontFamily: 'Inter', fontWeight: '500', lineHeight: 1, wordWrap: 'break-word'}}>All BOM</div>
                        </div>
                        <div onClick={() => setFlag(1)} onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(200, 200, 200, 0.1)")} onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0)")} style={{width: 190, height: 43, paddingTop: 8, paddingBottom: 8, background: 'white', boxShadow: flag === 1 ? '0px -2px 0px #00A8A8 inset' : '0px -1px 0px #E8E8E8 inset', overflow: 'hidden', justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
                            <div style={{textAlign: 'center', color: flag === 1 ? '#00A8A8' : '#585757', fontSize: 16, fontFamily: 'Inter', fontWeight: '500', lineHeight: 1, wordWrap: 'break-word'}}>Project BOM</div>
                        </div>
                        <div onClick={() => setFlag(2)} onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(200, 200, 200, 0.1)")} onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0)")} style={{width: 190, height: 43, paddingTop: 8, paddingBottom: 8, background: 'white', boxShadow: flag === 2 ? '0px -2px 0px #00A8A8 inset' : '0px -1px 0px #E8E8E8 inset', overflow: 'hidden', justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
                            <div style={{textAlign: 'center', color: flag === 2 ? '#00A8A8' : '#585757', fontSize: 16, fontFamily: 'Inter', fontWeight: '500', lineHeight: 1, wordWrap: 'break-word'}}>Non-Project BOM</div>
                        </div>
                    </div>
                    <div style={{justifyContent: 'flex-end', alignItems: 'flex-start', gap: 25, display: 'flex'}}>
                        <div style={{width: 250, background: '#F7F9FB', overflow: 'hidden', borderRadius: 8, outline: '1px rgba(132.72, 132.72, 132.72, 0.25) solid', outlineOffset: '-1px', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-end', gap: 10, display: 'inline-flex'}}>
                            <div style={{alignSelf: 'stretch', height: 40, position: 'relative', overflow: 'hidden'}}>
                                <div className="MRPSearch" style={{width: 20, height: 20, left: 12, top: 10, position: 'absolute'}} />
                                <div style={{width: 210, height: 24, left: 40, top: 8, position: 'absolute'}}>
                                    <input placeholder="Search Order Number..." type="text" style={{width: 210, left: 0, top: 3, position: 'absolute', color: '#969696', fontSize: 16, fontFamily: 'Inter', fontWeight: '400', lineHeight: 1, wordWrap: 'break-word', border: 'none', outline: 'none', backgroundColor: 'transparent' }}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{width: 1156, height: 491, paddingTop: 10, paddingBottom: 10, background: 'white', boxShadow: '0px 4px 7.5px 1px rgba(0, 0, 0, 0.25)', overflow: 'hidden', borderRadius: 20, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', gap: 20, display: 'flex'}}>
                    <div style={{alignSelf: 'stretch', borderRadius: 20, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
                        <div style={{alignSelf: 'stretch', background: 'white', overflow: 'hidden', borderRadius: 4, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'flex'}}>
                            <div style={{alignSelf: 'stretch', paddingTop: 0.50, paddingBottom: 0.50, background: 'rgba(255, 255, 255, 0)', overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                <div data-type="Header" style={{flex: '1 1 0', alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0.05)', borderBottom: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                    <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                        <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '700', lineHeight: 1, wordWrap: 'break-word'}}>BOM No.</div>
                                    </div>
                                </div>
                                <div data-type="Header" style={{flex: '1 1 0', alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0.05)', borderBottom: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                    <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                        <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '700', lineHeight: 1, wordWrap: 'break-word'}}>Type</div>
                                    </div>
                                </div>
                                <div data-type="Header" style={{flex: '1 1 0', alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0.05)', borderBottom: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                    <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                        <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '700', lineHeight: 1, wordWrap: 'break-word'}}>Status</div>
                                    </div>
                                </div>
                                <div data-type="Header" style={{flex: '1 1 0', alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0.05)', borderBottom: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                    <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                        <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '700', lineHeight: 1, wordWrap: 'break-word'}}>Date Created</div>
                                    </div>
                                </div>
                            </div>
                            {bomData.map((item, index) => (
                                <div key={index}
                                onClick={() => setPrintBOM(true)}
                                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(200, 200, 200, 0.2)")}
                                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0)")}
                                style={{ cursor: 'pointer', alignSelf: 'stretch', paddingTop: 0.5, paddingBottom: 0.5, background: 'rgba(255, 255, 255, 0)', overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex' }}
                                >
                                <div data-type="Default" style={{ flex: '1 1 0', alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0)', borderBottom: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex' }}>
                                    <div style={{ alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex' }}>
                                    <div style={{ flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '500', lineHeight: 1, wordWrap: 'break-word' }}>{item.number}</div>
                                    </div>
                                </div>
                                <div data-type="Default" style={{ flex: '1 1 0', alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0)', borderLeft: '1px #E8E8E8 solid', borderBottom: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex' }}>
                                    <div style={{ alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex' }}>
                                    <div style={{ flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '500', lineHeight: 1, wordWrap: 'break-word' }}>{item.type}</div>
                                    </div>
                                </div>
                                <div data-type="Default" style={{ flex: '1 1 0', alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0)', borderLeft: '1px #E8E8E8 solid', borderBottom: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex' }}>
                                    <div style={{ alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex' }}>
                                    <div style={{ flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '500', lineHeight: 1, wordWrap: 'break-word' }}>{item.status}</div>
                                    </div>
                                </div>
                                <div data-type="Default" style={{ flex: '1 1 0', alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0)', borderLeft: '1px #E8E8E8 solid', borderBottom: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex' }}>
                                    <div style={{ alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex' }}>
                                    <div style={{ flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '500', lineHeight: 1, wordWrap: 'break-word' }}>{item.date}</div>
                                    </div>
                                </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            {printBOM && (
                <div className="bom-print-modal" onClick={(e) => e.stopPropagation()}>
                <div className="bom-print-content" onClick={(e) => e.stopPropagation()}>
                <div className="scroll-container">

                <div style={{width: 1128,height: dynamicHeight, position: 'relative', background: 'white', overflow: 'hidden'}}>
                    <div style={{width: 1128, left: 0, top: 104, position: 'absolute'}} />
                    <div style={{left: 663, top: 67, position: 'absolute', justifyContent: 'flex-start', alignItems: 'center', gap: 8, display: 'inline-flex'}}>
                        <div style={{justifyContent: 'flex-start', alignItems: 'center', gap: 387, display: 'flex'}}>
                            <div style={{width: 231, height: 28}} />
                        </div>
                    </div>
                    <div style={{left: 412, top: 39, position: 'absolute', color: '#1C1C1C', fontSize: 40, fontFamily: 'Inter', fontWeight: '600', lineHeight: 1, wordWrap: 'break-word'}}>Bill Of Materials</div>
                    <div style={{left: 722, top: 25, position: 'absolute', color: '#1C1C1C', fontSize: 20, fontFamily: 'Inter', fontWeight: '700', textTransform: 'capitalize', lineHeight: 16, wordWrap: 'break-word'}}>Buyer</div>
                    <div style={{width: 265, left: 721, top: 206, position: 'absolute', color: '#111111', fontSize: 18, fontFamily: 'Inter', fontWeight: '400', lineHeight: 1, wordWrap: 'break-word'}}>Dan Atencia</div>
                    <div style={{width: 265, left: 721, top: 356, position: 'absolute', color: '#111111', fontSize: 18, fontFamily: 'Inter', fontWeight: '400', lineHeight: 1, wordWrap: 'break-word'}}>buyerngkinetiqgmail.com</div>
                    <div style={{width: 265, left: 721, top: 326, position: 'absolute', color: '#111111', fontSize: 18, fontFamily: 'Inter', fontWeight: '400', lineHeight: 1, wordWrap: 'break-word'}}>09123456789</div>
                    <div style={{width: 265, left: 721, top: 236, position: 'absolute', color: '#111111', fontSize: 18, fontFamily: 'Inter', fontWeight: '400', lineHeight: 1, wordWrap: 'break-word'}}>123 Ermita St. Tondo Manila</div>
                    <div style={{width: 180, left: 721, top: 296, position: 'absolute', color: '#111111', fontSize: 18, fontFamily: 'Inter', fontWeight: '400', lineHeight: 1, wordWrap: 'break-word'}}>Philippines</div>
                    <div style={{width: 180, left: 721, top: 266, position: 'absolute', color: '#111111', fontSize: 18, fontFamily: 'Inter', fontWeight: '400', lineHeight: 1, wordWrap: 'break-word'}}>Metro Manila</div>
                    <div style={{left: 382, top: 25, position: 'absolute', color: '#1C1C1C', fontSize: 20, fontFamily: 'Inter', fontWeight: '700', textTransform: 'capitalize', lineHeight: 16, wordWrap: 'break-word'}}>Seller</div>
                    <div style={{width: 265, left: 381, top: 206, position: 'absolute', color: '#111111', fontSize: 18, fontFamily: 'Inter', fontWeight: '400', lineHeight: 1, wordWrap: 'break-word'}}>Kinetiq</div>
                    <div style={{width: 265, left: 381, top: 356, position: 'absolute', color: '#111111', fontSize: 18, fontFamily: 'Inter', fontWeight: '400', lineHeight: 1, wordWrap: 'break-word'}}>kinetiqgmail.com</div>
                    <div style={{width: 265, left: 381, top: 326, position: 'absolute', color: '#111111', fontSize: 18, fontFamily: 'Inter', fontWeight: '400', lineHeight: 1, wordWrap: 'break-word'}}>09123456789</div>
                    <div style={{width: 265, left: 381, top: 236, position: 'absolute', color: '#111111', fontSize: 18, fontFamily: 'Inter', fontWeight: '400', lineHeight: 1, wordWrap: 'break-word'}}>1975 Address of Company St.</div>
                    <div style={{width: 180, left: 381, top: 296, position: 'absolute', color: '#111111', fontSize: 18, fontFamily: 'Inter', fontWeight: '400', lineHeight: 1, wordWrap: 'break-word'}}>Philippines</div>
                    <div style={{width: 180, left: 381, top: 266, position: 'absolute', color: '#111111', fontSize: 18, fontFamily: 'Inter', fontWeight: '400', lineHeight: 1, wordWrap: 'break-word'}}>Metro Manila</div>
                    <div style={{width: 135, left: 139, top: 473, position: 'absolute', color: '#1C1C1C', fontSize: 20, fontFamily: 'Inter', fontWeight: '700', textTransform: 'capitalize', lineHeight: 1, wordWrap: 'break-word'}}>BOM No.</div>
                    <div style={{width: 135, left: 139, top: 516, position: 'absolute', color: '#1C1C1C', fontSize: 20, fontFamily: 'Inter', fontWeight: '700', textTransform: 'capitalize', lineHeight: 1, wordWrap: 'break-word'}}>Date Created</div>
                    <div style={{width: 119, height: 16, left: 313, top: 472, position: 'absolute', textAlign: 'right', color: '#111111', fontSize: 20, fontFamily: 'Inter', fontWeight: '400', lineHeight: 1, wordWrap: 'break-word'}}>000000001</div>
                    <div style={{width: 144, left: 288, top: 515, position: 'absolute', textAlign: 'right', color: '#111111', fontSize: 20, fontFamily: 'Inter', fontWeight: '400', lineHeight: 1, wordWrap: 'break-word'}}>April 1, 2025</div>
                    <div style={{width: 135, left: 728, top: 473, position: 'absolute', color: '#1C1C1C', fontSize: 20, fontFamily: 'Inter', fontWeight: '700', textTransform: 'capitalize', lineHeight: 1, wordWrap: 'break-word'}}>Type</div>
                    <div style={{width: 135, left: 728, top: 516, position: 'absolute', color: '#1C1C1C', fontSize: 20, fontFamily: 'Inter', fontWeight: '700', textTransform: 'capitalize', lineHeight: 1, wordWrap: 'break-word'}}>Status</div>
                    <div style={{width: 127, left: 861, top: 472, position: 'absolute', textAlign: 'right', color: '#111111', fontSize: 20, fontFamily: 'Inter', fontWeight: '400', lineHeight: 1, wordWrap: 'break-word'}}>Project</div>
                    <div style={{width: 125, left: 863, top: 514, position: 'absolute', textAlign: 'right', color: '#111111', fontSize: 20, fontFamily: 'Inter', fontWeight: '400', lineHeight: 1, wordWrap: 'break-word'}}>Pending</div>
                    
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 580}}>
                        <div style={{width: 1047, marginTop: 40, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                            <div style={{alignSelf: 'stretch', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'flex'}}>
                                <div style={{alignSelf: 'stretch', background: 'white', overflow: 'hidden', outline: '1px #E8E8E8 solid', outlineOffset: '-1px', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'flex'}}>
                                    <div style={{alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0)', overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                        <div data-type="Header" style={{width: 82, alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0.05)', borderLeft: '1px #E8E8E8 solid', borderTop: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                            <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                                <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '700', lineHeight: 1, wordWrap: 'break-word'}}>No.</div>
                                            </div>
                                        </div>
                                        <div data-type="Header" style={{width: 145, alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0.05)', borderLeft: '1px #E8E8E8 solid', borderTop: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                            <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                                <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '700', lineHeight: 1, wordWrap: 'break-word'}}>Product</div>
                                            </div>
                                        </div>
                                        <div data-type="Header" style={{width: 96, alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0.05)', borderLeft: '1px #E8E8E8 solid', borderTop: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                            <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                                <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '700', lineHeight: 1, wordWrap: 'break-word'}}>Qty. Of Product</div>
                                            </div>
                                        </div>
                                        <div data-type="Header" style={{width: 140, alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0.05)', borderLeft: '1px #E8E8E8 solid', borderTop: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                            <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                                <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '700', lineHeight: 1, wordWrap: 'break-word'}}>Raw Material</div>
                                            </div>
                                        </div>
                                        <div data-type="Header" style={{width: 130, alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0.05)', borderLeft: '1px #E8E8E8 solid', borderTop: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                            <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                                <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '700', lineHeight: 1, wordWrap: 'break-word'}}>Qty. Of Raw Material</div>
                                            </div>
                                        </div>
                                        <div data-type="Header" style={{width: 87, alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0.05)', borderLeft: '1px #E8E8E8 solid', borderTop: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                            <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                                <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '700', lineHeight: 1, wordWrap: 'break-word'}}>Units</div>
                                            </div>
                                        </div>
                                        <div data-type="Header" style={{flex: '1 1 0', alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0.05)', borderLeft: '1px #E8E8E8 solid', borderTop: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                            <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                                <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '700', lineHeight: 1, wordWrap: 'break-word'}}>Cost Per Raw Material</div>
                                            </div>
                                        </div>
                                        <div data-type="Header" style={{flex: '1 1 0', alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0.05)', borderLeft: '1px #E8E8E8 solid', borderTop: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                            <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                                <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '700', lineHeight: 1, wordWrap: 'break-word'}}>Total Cost Per Raw Material</div>
                                            </div>
                                        </div>
                                    </div>
                                    {bomDetails.map((item, index) => (
                                    <div key={index} style={{alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0)', overflow: 'hidden', display: 'inline-flex'}}>
                                        <div style={cellStyle(82)}>{item.no}</div>
                                        <div style={cellStyle(145)}>{item.product}</div>
                                        <div style={cellStyle(96)}>{item.qtyProduct}</div>
                                        <div style={cellStyle(140)}>{item.rawMaterial}</div>
                                        <div style={cellStyle(130)}>{item.qtyRawMaterial}</div>
                                        <div style={cellStyle(87)}>{item.unit}</div>
                                        <div style={cellStyle(183)}>₱{item.costPerUnit.toLocaleString()}</div>
                                        <div style={cellStyle(183)}>₱{item.totalCost.toLocaleString()}</div>
                                    </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div style={{ width: 391, marginTop: 30, alignSelf: 'flex-end', display: 'flex', flexDirection: 'column', paddingRight: 30}}>
                            <div style={{ background: 'white', overflow: 'hidden', borderRadius: 4, outline: '1px white solid', outlineOffset: '-1px', flexDirection: 'column', display: 'flex' }}>
                                {[
                                { label: 'Total Cost of Raw Materials', value: bomCostDetails.rawMaterial, strong: false },
                                { label: 'Subtotal:', value: bomCostDetails.subtotal, strong: true },
                                { label: 'Cost of Production', value: bomCostDetails.production, strong: false },
                                { label: 'Labor Cost', value: bomCostDetails.labor, strong: false },
                                { label: 'Total Cost:', value: bomCostDetails.total, strong: true }
                                ].map((item, index) => (
                                    <div key={index} style={{ display: 'flex', height: 36 }}>
                                        <div style={{width: 223,padding: '10px 12px',background: index % 2 === 1 ? 'rgba(255, 255, 255, 0.05)' : 'transparent',fontSize: item.strong ? 16 : 14,fontWeight: item.strong ? 600 : 400,color: item.strong ? '#1C1C1C' : '#111111',fontFamily: 'Inter',display: 'flex',alignItems: 'center'}}>
                                            {item.label}
                                        </div>
                                        <div style={{ width: 168,padding: '10px 12px',background: index % 2 === 1 ? 'rgba(255, 255, 255, 0.05)' : 'transparent',fontSize: item.strong ? 16 : 14,fontWeight: item.strong ? 600 : 400,textAlign: 'right',color: item.strong ? '#1C1C1C' : '#585757',fontFamily: 'Inter',display: 'flex',justifyContent: 'flex-end', alignItems: 'center'}}>
                                            ₱{item.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <button onClick={() => setPrintBOM(false)} style={{ marginTop: 30 }}><div style={{width: 115, height: 35, paddingTop: 8, paddingBottom: 8, paddingLeft: 72, paddingRight: 24, left: 52, position: 'absolute', background: 'white', overflow: 'hidden', borderRadius: 8, outline: '1.50px #A4A4A4 solid', outlineOffset: '-1.50px', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 8, display: 'inline-flex'}}>
                            <div style={{width: 130, justifyContent: 'center', alignItems: 'center', gap: 13, display: 'inline-flex'}}>
                                <div style={{justifyContent: 'center', alignItems: 'center', gap: 0, display: 'inline-flex'}}>
                                    <div className="MRPIcon3" style={{width: 15, height: 21, paddingRight: 25 }} />
                                    <div style={{width: 90, paddingLeft: 0, paddingRight: 2, justifyContent: 'flex-start', alignItems: 'flex-start', gap: 8, display: 'flex'}}>
                                        <div style={{justifyContent: 'center', display: 'flex', flexDirection: 'column', color: '#969696', fontSize: 18, fontFamily: 'Inter', fontWeight: '500', textTransform: 'capitalize', lineHeight: 1, wordWrap: 'break-word'}}>back</div>
                                    </div>
                                </div>
                            </div>
                        </div></button>
                        <button onClick={() => {window.print();}}><div data-property-1="Disabled" style={{width: 140, height: 35, padding: 10, left: 935, position: 'absolute', background: '#00A8A8', borderRadius: 10, justifyContent: 'center', alignItems: 'center', gap: 30, display: 'inline-flex'}}>
                            <div style={{color: 'white', fontSize: 17, fontFamily: 'Inter', fontWeight: '400', wordWrap: 'break-word'}}>Download</div>
                        </div></button>
                        
                    </div>
                    <img style={{width: 132.34, height: 196, left: 91, top: 170, position: 'absolute'}} src="/icons/module-icons/MRP-icons/MRPBOMLogo.png" />
                </div>
                </div>
                </div>
                </div>
            )}

        </div>

    );
};

export default BodyContent;
