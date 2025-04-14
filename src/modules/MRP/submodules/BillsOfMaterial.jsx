import React from "react";
import "../styles/BillsOfMaterial.css";
import { useState } from "react";

const BodyContent = ({loadSubModule, setActiveSubModule}) => {
    const [flag, setFlag] = useState(0);
    const [printBOM, setPrintBOM] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

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

    const getFilteredData = () => {
        return bomData.filter((item) => {
          const matchesFlag =
            flag === 0 ||
            (flag === 1 && item.type === "Project") ||
            (flag === 2 && item.type === "Non Project");
      
          const term = (searchTerm || "").toLowerCase(); // prevent null error
      
          const number = (item.number || "").toLowerCase();
          const date = (item.date || "").toLowerCase();
          const status = (item.status || "").toLowerCase();
      
          const searchMatch =
            number.includes(term) ||
            date.includes(term) ||
            status.includes(term);
      
          return matchesFlag && searchMatch;
        });
      };
      
    const filteredData = getFilteredData();
    
    
    const dynamicHeight = 1191 + (bomDetails.length - 5) * 36;

    return (
        <div className="bom">
            <div className="body-content-container">
                <div className="title">BOM LIST</div>
                <div style={{
                width: '100%',
                maxWidth: 1300,
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                rowGap: 10,
                paddingLeft: 80,
                paddingRight: 80,
                }}>
                {/* Tabs */}
                <div className="tabs-container" style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 15,
                    flex: '1 1 auto',
                    minWidth: 200,
                }}>
                    {['All Orders', 'Project Orders', 'Non-Project Orders'].map((label, i) => (
                    <div key={label}
                        onClick={() => setFlag(i)}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(200, 200, 200, 0.1)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                        style={{
                        minWidth: 120,
                        padding: '10px 16px',
                        background: 'white',
                        boxShadow: flag === i ? '0px -2px 0px #00A8A8 inset' : '0px -1px 0px #E8E8E8 inset',
                        justifyContent: 'center',
                        alignItems: 'center',
                        display: 'flex',
                        cursor: 'pointer'
                        }}>
                        <div className="text-tab" style={{
                        textAlign: 'center',
                        color: flag === i ? '#00A8A8' : '#585757',
                        fontSize: 16,
                        fontFamily: 'Inter',
                        fontWeight: '500',
                        lineHeight: 1
                        }}>{label}</div>
                    </div>
                    ))}
                </div>

                {/* Search Box */}
                <div className="search-container" style={{
                    background: '#F7F9FB',
                    borderRadius: 8,
                    outline: '1px rgba(132,132,132,0.25) solid',
                    padding: 5,
                    display: 'flex',
                    alignItems: 'center',
                    marginTop: 10,
                    paddingRight: 100,
                    alignItems: 'stretch',
                }}>
                    <input
                    placeholder="Search Order Number..."
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        flex: 1,
                        padding: '8px',
                        border: 'none',
                        outline: 'none',
                        backgroundColor: 'transparent',
                        color: '#969696',
                        fontSize: 16,
                        fontFamily: 'Inter'
                    }}
                    />
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
                            {filteredData.map((item, index) => (
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
