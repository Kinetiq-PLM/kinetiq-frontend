import React from "react";
import "../styles/MaterialRequirementsPlanning.css";
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

    const bomData = [
        { number: "000000001", type: "Project", status: "Pending", date: "July 3 2025" },
        { number: "000000002", type: "Non Project", status: "Approved", date: "July 3 2025" },

    ];

    return (
        
        <div className="reqplan">
            
            <div style={{width: '100%', height: '100%', paddingLeft: 43, paddingRight: 43, paddingTop: 31, paddingBottom: 31, background: 'white', boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.08)', overflow: 'hidden', borderRadius: 10, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', rowGap: 25, display: 'inline-flex'}}>
            <div className="title">MRP LIST</div>
            <div style={{width: 1300, justifyContent: 'space-between', alignItems: 'center', display: 'inline-flex'}}>
                    <div style={{justifyContent: 'flex-start', alignItems: 'flex-start', display: 'flex',paddingRight: 30}}>
                        <div onClick={() => setFlag(0)} onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(200, 200, 200, 0.1)")} onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0)")} style={{width: 185, padding: 13, background: 'white', boxShadow: flag === 0 ? '0px -2px 0px #00A8A8 inset' : '0px -1px 0px #E8E8E8 inset', overflow: 'hidden', justifyContent: 'center', alignItems: 'center', gap: 5, display: 'flex'}}>
                            <div style={{textAlign: 'center', color: flag === 0 ? '#00A8A8' : '#585757', fontSize: 16, fontFamily: 'Inter', fontWeight: '500', lineHeight: 1, wordWrap: 'break-word'}}>All Orders</div>
                        </div>
                        <div onClick={() => setFlag(1)} onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(200, 200, 200, 0.1)")} onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0)")} style={{width: 190, height: 43, paddingTop: 8, paddingBottom: 8, background: 'white', boxShadow: flag === 1 ? '0px -2px 0px #00A8A8 inset' : '0px -1px 0px #E8E8E8 inset', overflow: 'hidden', justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
                            <div style={{textAlign: 'center', color: flag === 1 ? '#00A8A8' : '#585757', fontSize: 16, fontFamily: 'Inter', fontWeight: '500', lineHeight: 1, wordWrap: 'break-word'}}>Project Orders</div>
                        </div>
                        <div onClick={() => setFlag(2)} onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(200, 200, 200, 0.1)")} onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0)")} style={{width: 190, height: 43, paddingTop: 8, paddingBottom: 8, background: 'white', boxShadow: flag === 2 ? '0px -2px 0px #00A8A8 inset' : '0px -1px 0px #E8E8E8 inset', overflow: 'hidden', justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
                            <div style={{textAlign: 'center', color: flag === 2 ? '#00A8A8' : '#585757', fontSize: 16, fontFamily: 'Inter', fontWeight: '500', lineHeight: 1, wordWrap: 'break-word'}}>Non-Project Orders</div>
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
                                        <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '700', lineHeight: 1, wordWrap: 'break-word'}}>Order No.</div>
                                    </div>
                                </div>
                                <div data-type="Header" style={{flex: '1 1 0', alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0.05)', borderBottom: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                    <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                        <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '700', lineHeight: 1, wordWrap: 'break-word'}}>Type</div>
                                    </div>
                                </div>
                                <div data-type="Header" style={{flex: '1 1 0', alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0.05)', borderBottom: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                    <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                        <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '700', lineHeight: 1, wordWrap: 'break-word'}}>Details</div>
                                    </div>
                                </div>
                                <div data-type="Header" style={{flex: '1 1 0', alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0.05)', borderBottom: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                    <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                        <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '700', lineHeight: 1, wordWrap: 'break-word'}}>Date</div>
                                    </div>
                                </div>
                            </div>
                            {bomData.map((item, index) => (
                                <div key={index}
                                onClick={() => setIsOpen(true)}
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
            {isOpen && (
                <div className="bom-print-modal">
                <div className="fixed inset-0 flex items-center justify-center">
                    <div style={{width: 953, height: 527, position: 'relative', background: 'white', boxShadow: '0px 4px 7.5px 1px rgba(0, 0, 0, 0.25)', overflow: 'hidden', borderRadius: 10}}>
                        <button onClick={() => setIsOpen(false)}><div style={{width: 110, height: 40, paddingTop: 8, paddingBottom: 8, paddingLeft: 72, paddingRight: 24, left: 37, top: 460, position: 'absolute', background: 'white', overflow: 'hidden', borderRadius: 8, outline: '1.50px #A4A4A4 solid', outlineOffset: '-1.50px', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 8, display: 'inline-flex'}}>
                            <div style={{justifyContent: 'center', alignItems: 'center', gap: 0, display: 'inline-flex'}}>
                                <div className="MRPIcon3" style={{width: 15, height: 21, paddingRight: 25 }} />
                                <div style={{width: 90, paddingLeft: 0, paddingRight: 2, justifyContent: 'flex-start', alignItems: 'flex-start', gap: 8, display: 'flex'}}>
                                    <div style={{justifyContent: 'center', display: 'flex', flexDirection: 'column', color: '#969696', fontSize: 18, fontFamily: 'Inter', fontWeight: '500', textTransform: 'capitalize', lineHeight: 1, wordWrap: 'break-word'}}>back</div>
                                </div>
                            </div>
                        </div></button>
                        <div style={{width: 92, height: 29, left: 528, top: 161, position: 'absolute', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '500', lineHeight: 1, wordWrap: 'break-word'}}>Type</div>
                        <div data-property-1="Disabled" style={{width: 201, height: 40, padding: 10, left: 528, top: 194, position: 'absolute', background: '#E9E9E9', borderRadius: 10, outline: '1.50px #E5E5E5 solid', outlineOffset: '-1.50px', justifyContent: 'center', alignItems: 'center', gap: 30, display: 'inline-flex'}}>
                            <div style={{color: '#585757', fontSize: 17, fontFamily: 'Inter', fontWeight: '400', wordWrap: 'break-word'}}>Project</div>
                        </div>
                        <div style={{width: 92, height: 29, left: 528, top: 268, position: 'absolute', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '500', lineHeight: 1, wordWrap: 'break-word'}}>Date</div>
                        <div data-property-1="Disabled" style={{width: 201, height: 40, padding: 10, left: 528, top: 301, position: 'absolute', background: '#E9E9E9', borderRadius: 10, outline: '1.50px #E5E5E5 solid', outlineOffset: '-1.50px', justifyContent: 'center', alignItems: 'center', gap: 30, display: 'inline-flex'}}>
                            <div style={{color: '#585757', fontSize: 17, fontFamily: 'Inter', fontWeight: '400', wordWrap: 'break-word'}}>July 3 2025</div>
                        </div>
                        <div style={{width: 92, height: 29, left: 95, top: 276, position: 'absolute', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '500', lineHeight: 1, wordWrap: 'break-word'}}>Details</div>
                        <div data-property-1="Disabled" style={{width: 326, height: 92, padding: 10, left: 95, top: 305, position: 'absolute', background: '#E9E9E9', borderRadius: 10, outline: '1.50px #E5E5E5 solid', outlineOffset: '-1.50px', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 30, display: 'inline-flex'}}>
                            <div style={{color: '#585757', fontSize: 17, fontFamily: 'Inter', fontWeight: '400', wordWrap: 'break-word'}}>Tondo Hospital - Package Order</div>
                        </div>
                        <div style={{width: 92, height: 29, left: 95, top: 161, position: 'absolute', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '500', lineHeight: 1, wordWrap: 'break-word'}}>Order No.</div>
                        <div data-property-1="Disabled" style={{width: 201, height: 40, padding: 10, left: 95, top: 194, position: 'absolute', background: '#E9E9E9', borderRadius: 10, outline: '1.50px #E5E5E5 solid', outlineOffset: '-1.50px', justifyContent: 'center', alignItems: 'center', gap: 30, display: 'inline-flex'}}>
                            <div style={{color: '#585757', fontSize: 17, fontFamily: 'Inter', fontWeight: '400', wordWrap: 'break-word'}}>000000001</div>
                        </div>
                        <div style={{left: 360, top: 60, position: 'absolute', justifyContent: 'center', display: 'flex', flexDirection: 'column', color: '#130101', fontSize: 35, fontFamily: 'Inter', fontWeight: '400', textTransform: 'capitalize', lineHeight: 1, letterSpacing: 1.40, wordWrap: 'break-word'}}>Order Details</div>
                        <button onClick={() => {setIsOpen2(true),setIsOpen(false) }}><div style={{width: 110, height: 40, paddingTop: 8, paddingBottom: 8, paddingLeft: 24, paddingRight: 15, left: 813, top: 460, position: 'absolute', background: '#00A8A8', overflow: 'hidden', borderRadius: 8, flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', gap: 8, display: 'inline-flex'}}>
                            <div style={{justifyContent: 'center', alignItems: 'center', gap: 3, display: 'inline-flex'}}>
                                <div style={{width: 50, paddingLeft: 2, paddingRight: 10, justifyContent: 'flex-start', alignItems: 'flex-start', gap: 8, paddingTop: 1, display: 'flex'}}>
                                    <div style={{justifyContent: 'center', display: 'flex', flexDirection: 'column', color: 'white', fontSize: 18, fontFamily: 'Inter', fontWeight: '500', textTransform: 'capitalize', lineHeight: 1, wordWrap: 'break-word'}}>Next</div>
                                </div>
                                <div className="MRPIcon5" style={{width: 13, height: 21, transformOrigin: 'top left'}} />
                            </div>
                        </div></button>
                    </div>
                </div>
                </div>
            )}

            {isOpen2 && (
                <div className="bom-print-modal">
                <div className="fixed inset-0 flex items-center justify-center">
                    <div style={{width: 1361, height: 760, position: 'relative', background: 'white', boxShadow: '0px 4px 7.5px 1px rgba(0, 0, 0, 0.25)', overflow: 'hidden', borderRadius: 10}}>
                        <button onClick={() => {setIsOpen2(false),setIsOpen(true) }}><div style={{width: 115, height: 40, paddingTop: 8, paddingBottom: 8, paddingLeft: 72, paddingRight: 24, left: 46, top: 683, position: 'absolute', background: 'white', overflow: 'hidden', borderRadius: 8, outline: '1.50px #A4A4A4 solid', outlineOffset: '-1.50px', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 8, display: 'inline-flex'}}>
                            <div style={{justifyContent: 'center', alignItems: 'center', gap: 0, display: 'inline-flex'}}>
                                <div className="MRPIcon3" style={{width: 15, height: 21, paddingRight: 25 }} />
                                <div style={{width: 90, paddingLeft: 0, paddingRight: 2, justifyContent: 'flex-start', alignItems: 'flex-start', gap: 8, display: 'flex'}}>
                                    <div style={{justifyContent: 'center', display: 'flex', flexDirection: 'column', color: '#969696', fontSize: 18, fontFamily: 'Inter', fontWeight: '500', textTransform: 'capitalize', lineHeight: 1, wordWrap: 'break-word'}}>back</div>
                                </div>
                            </div>
                        </div></button>
                        <button onClick={() => {setIsOpen2(false), setAdditionalCost(true)}}><div style={{width: 110, height: 40, paddingTop: 8, paddingBottom: 8, paddingLeft: 24, paddingRight: 15, left: 1193, top: 683, position: 'absolute', background: '#00A8A8', overflow: 'hidden', borderRadius: 8, flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', gap: 8, display: 'inline-flex'}}>
                            <div style={{justifyContent: 'center', alignItems: 'center', gap: 3, display: 'inline-flex'}}>
                                <div style={{width: 50, paddingLeft: 2, paddingRight: 10, justifyContent: 'flex-start', alignItems: 'flex-start', gap: 8, paddingTop: 2,  display: 'flex'}}>
                                    <div style={{justifyContent: 'center', display: 'flex', flexDirection: 'column', color: 'white', fontSize: 18, fontFamily: 'Inter', fontWeight: '500', textTransform: 'capitalize', lineHeight: 1, wordWrap: 'break-word'}}>Next</div>
                                </div>
                                <div className="MRPIcon5" style={{width: 13, height: 21, transformOrigin: 'center'}} />
                            </div>
                        </div></button>
                        <div style={{width: 452, height: 70, left: 477, top: 22, position: 'absolute', textAlign: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column', color: '#130101', fontSize: 35, fontFamily: 'Inter', fontWeight: '400', textTransform: 'capitalize', lineHeight: 16, letterSpacing: 1.40, wordWrap: 'break-word'}}>Product Pricing</div>
                        <div style={{width: 1256, height: 486, paddingTop: 3, paddingBottom: 3, left: 47, top: 106, position: 'absolute', background: 'white', boxShadow: '0px 4px 7.5px 1px rgba(0, 0, 0, 0.25)', overflow: 'hidden', borderRadius: 20, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', gap: 0, display: 'inline-flex'}}>
                            <div style={{width: 1256, background: 'white', overflow: 'hidden', borderRadius: 4, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
                                <div style={{alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0)', overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                    <div data-type="Header" style={{width: 96, alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0.05)', borderBottom: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                        <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                            <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '700', lineHeight: 1, wordWrap: 'break-word'}}>No.</div>
                                        </div>
                                    </div>
                                    <div data-type="Header" style={{width: 175, alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0.05)', borderBottom: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                        <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                            <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '700', lineHeight: 1, wordWrap: 'break-word'}}>Product ID</div>
                                        </div>
                                    </div>
                                    <div data-type="Header" style={{width: 176, alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0.05)', borderBottom: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                        <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                            <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '700', lineHeight: 1, wordWrap: 'break-word'}}>Product</div>
                                        </div>
                                    </div>
                                    <div data-type="Header" style={{width: 303, alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0.05)', borderBottom: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                        <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                            <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '700', lineHeight: 1, wordWrap: 'break-word'}}>Product Description</div>
                                        </div>
                                    </div>
                                    <div data-type="Header" style={{width: 139, alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0.05)', borderBottom: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                        <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                            <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 19, fontFamily: 'Inter', fontWeight: '700', lineHeight: 1, wordWrap: 'break-word'}}>Quantity</div>
                                        </div>
                                    </div>
                                    <div data-type="Header" style={{flex: '1 1 0', alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0.05)', borderBottom: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                        <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                            <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 19, fontFamily: 'Inter', fontWeight: '700', lineHeight: 1, wordWrap: 'break-word'}}>Raw Materials</div>
                                        </div>
                                    </div>
                                    <div data-type="Header" style={{flex: '1 1 0', alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0.05)', borderBottom: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                        <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                            <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 19, fontFamily: 'Inter', fontWeight: '700', lineHeight: 1, wordWrap: 'break-word'}}>Cost</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div style={{alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0)', overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                <div data-type="Default" style={{width: 96, alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0)', borderBottom: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                    <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                        <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '500', lineHeight: 1, wordWrap: 'break-word'}}>1</div>
                                    </div>
                                </div>
                                <div data-type="Default" style={{width: 175, alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0)', borderLeft: '1px #E8E8E8 solid', borderBottom: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                    <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                        <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '500', lineHeight: 1, wordWrap: 'break-word'}}>PROD0001</div>
                                    </div>
                                </div>
                                <div data-type="Default" style={{width: 176, alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0)', borderLeft: '1px #E8E8E8 solid', borderBottom: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                    <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                        <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '500', lineHeight: 1, wordWrap: 'break-word'}}>Hospital Bed</div>
                                    </div>
                                </div>
                                <div data-type="Default" style={{width: 303, alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0)', borderLeft: '1px #E8E8E8 solid', borderBottom: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                    <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                        <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '500', lineHeight: 1, wordWrap: 'break-word'}}>A sturdy bed</div>
                                    </div>
                                </div>
                                <div data-type="Default" style={{width: 139, alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0)', borderLeft: '1px #E8E8E8 solid', borderBottom: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                    <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                        <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '500', lineHeight: 1, wordWrap: 'break-word'}}>12 pcs</div>
                                    </div>
                                </div>
                                <div onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(200, 200, 200, 0.2)")} onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0)")} onClick={() => setRawMaterial(true)} data-type="Default" style={{flex: '1 1 0', alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0)', borderLeft: '1px #E8E8E8 solid', borderBottom: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                    <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                        <div style={{flex: '1 1 0', textAlign: 'center', color: '#858585', fontSize: 16, fontFamily: 'Inter', fontWeight: '500', lineHeight: 1, wordWrap: 'break-word'}}>Show List</div>
                                    </div>
                                </div>
                                <div data-type="Default" style={{flex: '1 1 0', alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0)', borderLeft: '1px #E8E8E8 solid', borderBottom: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                    <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                        <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '500', lineHeight: 1, wordWrap: 'break-word'}}>₱10,000.20</div>
                                    </div>
                                </div>
                            </div>
                            <div style={{alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0)', overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                <div data-type="Default" style={{width: 96, alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0)', borderBottom: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                    <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                        <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '500', lineHeight: 1, wordWrap: 'break-word'}}>1</div>
                                    </div>
                                </div>
                                <div data-type="Default" style={{width: 175, alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0)', borderLeft: '1px #E8E8E8 solid', borderBottom: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                    <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                        <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '500', lineHeight: 1, wordWrap: 'break-word'}}>PROD0001</div>
                                    </div>
                                </div>
                                <div data-type="Default" style={{width: 176, alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0)', borderLeft: '1px #E8E8E8 solid', borderBottom: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                    <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                        <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '500', lineHeight: 1, wordWrap: 'break-word'}}>Hospital Bed</div>
                                    </div>
                                </div>
                                <div data-type="Default" style={{width: 303, alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0)', borderLeft: '1px #E8E8E8 solid', borderBottom: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                    <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                        <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '500', lineHeight: 1, wordWrap: 'break-word'}}>A sturdy bed</div>
                                    </div>
                                </div>
                                <div data-type="Default" style={{width: 139, alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0)', borderLeft: '1px #E8E8E8 solid', borderBottom: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                    <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                        <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '500', lineHeight: 1, wordWrap: 'break-word'}}>12 pcs</div>
                                    </div>
                                </div>
                                <div onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(200, 200, 200, 0.2)")} onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0)")} onClick={() => setRawMaterial(true)} data-type="Default" style={{flex: '1 1 0', alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0)', borderLeft: '1px #E8E8E8 solid', borderBottom: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                    <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                        <div style={{flex: '1 1 0', textAlign: 'center', color: '#858585', fontSize: 16, fontFamily: 'Inter', fontWeight: '500', lineHeight: 1, wordWrap: 'break-word'}}>Show List</div>
                                    </div>
                                </div>
                                <div data-type="Default" style={{flex: '1 1 0', alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0)', borderLeft: '1px #E8E8E8 solid', borderBottom: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                    <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                        <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '500', lineHeight: 1, wordWrap: 'break-word'}}>₱10,000.20</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div data-property-1="Disabled" style={{width: 201, height: 40, padding: 10, left: 625, top: 683, position: 'absolute', background: '#F5F5F5', borderRadius: 10, outline: '1.50px #E5E5E5 solid', outlineOffset: '-1.50px', justifyContent: 'center', alignItems: 'center', gap: 30, display: 'inline-flex'}}>
                            <div style={{color: '#585757', fontSize: 17, fontFamily: 'Inter', fontWeight: '400', wordWrap: 'break-word'}}>000000002</div>
                        </div>
                        <div style={{width: 92, height: 29, left: 528, top: 688, position: 'absolute', textAlign: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '500', lineHeight: 1, wordWrap: 'break-word'}}>Order No.</div>
                        <div style={{width: 587, height: 50, left: 649, top: 613, position: 'absolute', background: 'white', boxShadow: '0px 4px 7.5px 1px rgba(0, 0, 0, 0.25)', overflow: 'hidden', borderRadius: 20}}>
                            <div style={{width: 283, height: 40, left: 0, top: 10, position: 'absolute', background: 'white', overflow: 'hidden'}}>
                                <div style={{width: 258, left: 12.50, top: 8, position: 'absolute', textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '500', lineHeight: 1, wordWrap: 'break-word'}}>Total Cost of Products:</div>
                            </div>
                            <div style={{width: 276, paddingLeft: 24, paddingRight: 24, paddingTop: 8, paddingBottom: 8, left: 277.46, top: 10, position: 'absolute', background: 'white', overflow: 'hidden', justifyContent: 'center', alignItems: 'center', gap: 8, display: 'inline-flex'}}>
                                <div style={{width: 227, textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '500', lineHeight: 1, wordWrap: 'break-word'}}>₱40,000.80</div>
                            </div>
                        </div>
                        <div style={{width: 472, height: 50, left: 125, top: 613, position: 'absolute', background: 'white', boxShadow: '0px 4px 7.5px 1px rgba(0, 0, 0, 0.25)', overflow: 'hidden', borderRadius: 20}}>
                            <div style={{width: 444, left: 15, top: 10, position: 'absolute', justifyContent: 'space-between', alignItems: 'center', display: 'inline-flex'}}>
                                <div style={{width: 198, height: 40, position: 'relative', background: 'white', overflow: 'hidden'}}>
                                    <div style={{width: 177, left: 10.50, top: 8, position: 'absolute', textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '500', lineHeight: 1, wordWrap: 'break-word'}}>Total Quantity:</div>
                                </div>
                                <div style={{width: 221, height: 40, position: 'relative', background: 'white', overflow: 'hidden'}}>
                                    <div style={{width: 171, left: 25, top: 8, position: 'absolute', textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '500', lineHeight: 1, wordWrap: 'break-word'}}>12</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
            )}

            {rawmaterial && (
                <div className="bom-print-modal2">
                <div className="fixed inset-0 flex items-center justify-center">
                    <div style={{width: 967, height: 527, position: 'relative', background: 'white', boxShadow: '0px 4px 7.5px 1px rgba(0, 0, 0, 0.25)', overflow: 'hidden', borderRadius: 10}}>
                        <button onClick={() => setRawMaterial(false)}><div style={{width: 115, height: 40, paddingTop: 8, paddingBottom: 8, paddingLeft: 72, paddingRight: 24, left: 37, top: 460, position: 'absolute', background: 'white', overflow: 'hidden', borderRadius: 8, outline: '1.50px #A4A4A4 solid', outlineOffset: '-1.50px', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 8, display: 'inline-flex'}}>
                            <div style={{justifyContent: 'center', alignItems: 'center', gap: 0, display: 'inline-flex'}}>
                                <div className="MRPIcon3" style={{width: 15, height: 21, paddingRight: 25 }} />
                                <div style={{width: 90, paddingLeft: 0, paddingRight: 2, justifyContent: 'flex-start', alignItems: 'flex-start', gap: 8, display: 'flex'}}>
                                    <div style={{justifyContent: 'center', display: 'flex', flexDirection: 'column', color: '#969696', fontSize: 20, fontFamily: 'Inter', fontWeight: '500', textTransform: 'capitalize', lineHeight: 1, wordWrap: 'break-word'}}>back</div>
                                </div>
                            </div>
                        </div></button>
                        <div style={{width: 510, left: 229, top: 25, position: 'absolute', textAlign: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column', color: '#130101', fontSize: 35, fontFamily: 'Inter', fontWeight: '400', textTransform: 'capitalize', lineHeight: 1, letterSpacing: 1.40, wordWrap: 'break-word'}}>Cost of Raw Materials</div>
                        <div style={{width: 911, height: 354, left: 28, top: 83, position: 'absolute', background: 'white', boxShadow: '0px 4px 7.5px 1px rgba(0, 0, 0, 0.25)', overflow: 'hidden', borderRadius: 20}}>
                            <div style={{width: 911, left: 0, top: 2, position: 'absolute', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', display: 'inline-flex'}}>
                                <div style={{width: 911, background: 'white', overflow: 'hidden', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'flex'}}>
                                    <div style={{alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0)', overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                        <div data-type="Header" style={{width: 184, alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0.05)', borderBottom: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                            <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                                <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '700', lineHeight: 1, wordWrap: 'break-word'}}>Raw Material</div>
                                            </div>
                                        </div>
                                        <div data-type="Header" style={{width: 138, alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0.05)', borderBottom: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                            <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                                <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '700', lineHeight: 1, wordWrap: 'break-word'}}>Material ID</div>
                                            </div>
                                        </div>
                                        <div data-type="Header" style={{width: 117, alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0.05)', borderBottom: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                            <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                                <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 19, fontFamily: 'Inter', fontWeight: '700', lineHeight: 1, wordWrap: 'break-word'}}>Quantity</div>
                                            </div>
                                        </div>
                                        <div data-type="Header" style={{width: 129, alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0.05)', borderBottom: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                            <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                                <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 19, fontFamily: 'Inter', fontWeight: '700', lineHeight: 1, wordWrap: 'break-word'}}>Units</div>
                                            </div>
                                        </div>
                                        <div data-type="Header" style={{width: 163, alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0.05)', borderBottom: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                            <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                                <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 19, fontFamily: 'Inter', fontWeight: '700', lineHeight: 1, wordWrap: 'break-word'}}>Unit Cost</div>
                                            </div>
                                        </div>
                                        <div data-type="Header" style={{width: 180, alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0.05)', borderBottom: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                            <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                                <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 19, fontFamily: 'Inter', fontWeight: '700', lineHeight: 1, wordWrap: 'break-word'}}> Total Cost</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{alignSelf: 'stretch', background: 'white', overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                        <div data-type="Default" style={{width: 184, alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0)', borderBottom: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                            <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                                <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '500', lineHeight: 1, wordWrap: 'break-word'}}>Wood</div>
                                            </div>
                                        </div>
                                        <div data-type="Default" style={{width: 138, alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0)', borderLeft: '1px #E8E8E8 solid', borderBottom: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                            <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                                <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '500', lineHeight: 1, wordWrap: 'break-word'}}>MAT0001</div>
                                            </div>
                                        </div>
                                        <div data-type="Default" style={{width: 117, alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0)', borderLeft: '1px #E8E8E8 solid', borderBottom: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                            <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                                <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '500', lineHeight: 1, wordWrap: 'break-word'}}>4</div>
                                            </div>
                                        </div>
                                        <div data-type="Default" style={{width: 129, alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0)', borderLeft: '1px #E8E8E8 solid', borderBottom: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                            <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                                <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '500', lineHeight: 1, wordWrap: 'break-word'}}>pcs</div>
                                            </div>
                                        </div>
                                        <div data-type="Default" style={{width: 163, alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0)', borderLeft: '1px #E8E8E8 solid', borderBottom: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                            <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                                <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '500', lineHeight: 1, wordWrap: 'break-word'}}>₱150</div>
                                            </div>
                                        </div>
                                        <div data-type="Default" style={{width: 180, alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0)', borderLeft: '1px #E8E8E8 solid', borderBottom: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                            <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                                <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '500', lineHeight: 1, wordWrap: 'break-word'}}>₱600</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{alignSelf: 'stretch', background: 'white', overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                        <div data-type="Default" style={{width: 184, alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0)', borderBottom: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                            <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                                <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '500', lineHeight: 1, wordWrap: 'break-word'}}>Screw</div>
                                            </div>
                                        </div>
                                        <div data-type="Default" style={{width: 138, alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0)', borderLeft: '1px #E8E8E8 solid', borderBottom: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                            <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                                <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '500', lineHeight: 1, wordWrap: 'break-word'}}>MAT0002</div>
                                            </div>
                                        </div>
                                        <div data-type="Default" style={{width: 117, alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0)', borderLeft: '1px #E8E8E8 solid', borderBottom: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                            <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                                <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '500', lineHeight: 1, wordWrap: 'break-word'}}>10</div>
                                            </div>
                                        </div>
                                        <div data-type="Default" style={{width: 129, alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0)', borderLeft: '1px #E8E8E8 solid', borderBottom: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                            <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                                <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '500', lineHeight: 1, wordWrap: 'break-word'}}>pcs</div>
                                            </div>
                                        </div>
                                        <div data-type="Default" style={{width: 163, alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0)', borderLeft: '1px #E8E8E8 solid', borderBottom: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                            <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                                <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '500', lineHeight: 1, wordWrap: 'break-word'}}>₱5</div>
                                            </div>
                                        </div>
                                        <div data-type="Default" style={{width: 180, alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0)', borderLeft: '1px #E8E8E8 solid', borderBottom: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                            <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                                <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '500', lineHeight: 1, wordWrap: 'break-word'}}>₱50</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{alignSelf: 'stretch', background: 'white', overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                        <div data-type="Default" style={{width: 184, alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0)', borderBottom: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                            <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                                <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '500', lineHeight: 1, wordWrap: 'break-word'}}>Can of Barnish</div>
                                            </div>
                                        </div>
                                        <div data-type="Default" style={{width: 138, alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0)', borderLeft: '1px #E8E8E8 solid', borderBottom: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                            <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                                <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '500', lineHeight: 1, wordWrap: 'break-word'}}>MAT0003</div>
                                            </div>
                                        </div>
                                        <div data-type="Default" style={{width: 117, alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0)', borderLeft: '1px #E8E8E8 solid', borderBottom: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                            <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                                <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '500', lineHeight: 1, wordWrap: 'break-word'}}>1</div>
                                            </div>
                                        </div>
                                        <div data-type="Default" style={{width: 129, alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0)', borderLeft: '1px #E8E8E8 solid', borderBottom: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                            <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                                <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '500', lineHeight: 1, wordWrap: 'break-word'}}>can</div>
                                            </div>
                                        </div>
                                        <div data-type="Default" style={{width: 163, alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0)', borderLeft: '1px #E8E8E8 solid', borderBottom: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                            <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                                <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '500', lineHeight: 1, wordWrap: 'break-word'}}>₱200</div>
                                            </div>
                                        </div>
                                        <div data-type="Default" style={{width: 180, alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0)', borderLeft: '1px #E8E8E8 solid', borderBottom: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                            <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                                <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '500', lineHeight: 1, wordWrap: 'break-word'}}>₱200</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style={{width: 600, height: 37, left: 328, top: 462, position: 'absolute', background: 'white', boxShadow: '0px 4px 7.5px 1px rgba(0, 0, 0, 0.25)', overflow: 'hidden', borderRadius: 20}}>
                            <div style={{width: 300, paddingLeft: 20, paddingRight: 24, paddingTop: 10, paddingBottom: 8, left: 33, top: 0, position: 'absolute', background: 'white', overflow: 'hidden', justifyContent: 'space-between', alignItems: 'center', display: 'inline-flex'}}>
                                <div style={{width: 244, textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '500', lineHeight: 1, wordWrap: 'break-word'}}>Total Cost of Raw Materials:</div>
                            </div>
                            <div style={{width: 196, paddingLeft: 24, paddingRight: 24, paddingTop: 10, paddingBottom: 8, left: 367, top: 0, position: 'absolute', background: 'white', overflow: 'hidden', justifyContent: 'center', alignItems: 'center', gap: 8, display: 'inline-flex'}}>
                                <div style={{width: 134, textAlign: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '500', lineHeight: 1, wordWrap: 'break-word'}}>₱850</div>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
            )}

            {additionalcost && (
                <div className="bom-print-modal">
                <div className="fixed inset-0 flex items-center justify-center">
                    <div style={{width: 767, height: 727, position: 'relative', background: 'white', boxShadow: '0px 4px 7.5px 1px rgba(0, 0, 0, 0.25)', overflow: 'hidden', borderRadius: 10}}>
                        <div style={{width: 115, height: 40, paddingTop: 12, paddingBottom: 8, paddingLeft: 72, paddingRight: 24, left: 46, top: 656, position: 'absolute', background: 'white', overflow: 'hidden', borderRadius: 8, outline: '1.50px #A4A4A4 solid', outlineOffset: '-1.50px', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 8, display: 'inline-flex'}}>
                            <button onClick={() => {setIsOpen2(true),setAdditionalCost(false)}}><div style={{width: 130, justifyContent: 'center', alignItems: 'center', gap: 13, display: 'inline-flex'}}>
                                <div style={{justifyContent: 'center', alignItems: 'center', gap: 0, display: 'inline-flex'}}>
                                    <div className="MRPIcon3" style={{width: 15, height: 21, paddingRight: 25 }} />
                                    <div style={{width: 90, paddingLeft: 0, paddingRight: 2, justifyContent: 'flex-start', alignItems: 'flex-start', gap: 8, display: 'flex'}}>
                                        <div style={{justifyContent: 'center', display: 'flex', flexDirection: 'column', color: '#969696', fontSize: 20, fontFamily: 'Inter', fontWeight: '500', textTransform: 'capitalize', lineHeight: 1, wordWrap: 'break-word'}}>back</div>
                                    </div>
                                </div>
                            </div></button>
                        </div>
                        <div style={{width: 452, height: 70, left: 154, top: 17, position: 'absolute', textAlign: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column', color: '#130101', fontSize: 35, fontFamily: 'Inter', fontWeight: '400', textTransform: 'capitalize', lineHeight: 1, letterSpacing: 1.40, wordWrap: 'break-word'}}>Additional Costs</div>
                        <div style={{width: 671, height: 440, left: 47, top: 106, position: 'absolute', background: 'white', boxShadow: '0px 4px 7.5px 1px rgba(0, 0, 0, 0.25)', overflow: 'hidden', borderRadius: 20}}>
                            <div style={{width: 671, height: 485, left: 0, top: 0, position: 'absolute'}}>
                                <div style={{width: 671, left: 0, top: 0, position: 'absolute', background: 'white', overflow: 'hidden', outline: '1px #E8E8E8 solid', outlineOffset: '-1px', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', display: 'inline-flex'}}>
                                    <div style={{alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0)', overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                        <div data-type="Header" style={{flex: '1 1 0', alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0.05)', borderBottom: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                            <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                                <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '700', lineHeight: 1, wordWrap: 'break-word'}}>Type</div>
                                            </div>
                                        </div>
                                        <div data-type="Header" style={{flex: '1 1 0', alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0.05)', borderLeft: '1px #E8E8E8 solid', borderBottom: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                            <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                                <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 19, fontFamily: 'Inter', fontWeight: '700', lineHeight: 1, wordWrap: 'break-word'}}>Cost</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0)', overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                        <div data-type="Default" style={{flex: '1 1 0', alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0)', borderBottom: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                            <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                                <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '500', lineHeight: 1, wordWrap: 'break-word'}}>Cost of Products</div>
                                            </div>
                                        </div>
                                        <div data-type="Default" style={{flex: '1 1 0', alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0)', borderLeft: '1px #E8E8E8 solid', borderBottom: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                            <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                                <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '500', lineHeight: 1, wordWrap: 'break-word'}}>₱40,000.80</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(200, 200, 200, 0.2)")} onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0)")} onClick={() => setAdditionalCost(false)} style={{alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0)', overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                        <div style={{width: '100%', height: '100%', background: 'rgba(255, 255, 255, 0)', outline: '1px #E8E8E8 solid', outlineOffset: '-1px', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                            <div style={{width: '100%', height: '100%', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                                <div style={{width: '100%', textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '500', lineHeight: 1, wordWrap: 'break-word'}}>Add +</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style={{width: 600, height: 37, left: 84, top: 582, position: 'absolute', background: 'white', boxShadow: '0px 4px 7.5px 1px rgba(0, 0, 0, 0.25)', overflow: 'hidden', borderRadius: 20}}>
                            <div style={{width: 257, paddingLeft: 24, paddingRight: 24, paddingTop: 8, paddingBottom: 8, left: 33, top: 0, position: 'absolute', background: 'white', overflow: 'hidden', justifyContent: 'space-between', alignItems: 'center', display: 'inline-flex'}}>
                                <div style={{width: 244, textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '500', lineHeight: 1, wordWrap: 'break-word'}}>Total Cost of Order:</div>
                            </div>
                            <div style={{width: 234, paddingLeft: 24, paddingRight: 24, paddingTop: 8, paddingBottom: 8, left: 329, top: 0, position: 'absolute', background: 'white', overflow: 'hidden', justifyContent: 'center', alignItems: 'center', gap: 8, display: 'inline-flex'}}>
                                <div style={{width: 191, textAlign: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '500', lineHeight: 1, wordWrap: 'break-word'}}>₱850,000,000,000</div>
                            </div>
                        </div>
                        <button onClick={() => {setAdditionalCost(false), setAdditionalCost2(true)}} ><div style={{width: 110, height: 40, paddingTop: 8, paddingBottom: 8, paddingLeft: 24, paddingRight: 15, left: 601, top: 656, position: 'absolute', background: '#00A8A8', overflow: 'hidden', borderRadius: 8, flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', gap: 8, display: 'inline-flex'}}>
                            <div style={{justifyContent: 'center', alignItems: 'center', gap: 3, display: 'inline-flex'}}>
                                <div style={{width: 50, paddingLeft: 2, paddingRight: 10, justifyContent: 'flex-start', alignItems: 'flex-start', gap: 8, paddingTop: 2,  display: 'flex'}}>
                                    <div style={{justifyContent: 'center', display: 'flex', flexDirection: 'column', color: 'white', fontSize: 18, fontFamily: 'Inter', fontWeight: '500', textTransform: 'capitalize', lineHeight: 1, wordWrap: 'break-word'}}>Next</div>
                                </div>
                                <div className="MRPIcon5" style={{width: 13, height: 21, transformOrigin: 'center'}} />
                            </div>
                        </div></button>
                        <div data-property-1="Disabled" style={{width: 201, height: 40, padding: 10, left: 331, top: 656, position: 'absolute', background: '#F5F5F5', borderRadius: 10, outline: '1.50px #E5E5E5 solid', outlineOffset: '-1.50px', justifyContent: 'center', alignItems: 'center', gap: 30, display: 'inline-flex'}}>
                            <div style={{color: '#585757', fontSize: 17, fontFamily: 'Inter', fontWeight: '400', wordWrap: 'break-word'}}>000000002</div>
                        </div>
                        <div style={{width: 92, height: 29, left: 234, top: 661, position: 'absolute', textAlign: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '500', lineHeight: 1, wordWrap: 'break-word'}}>Order No.</div>
                    </div>
                </div>
                </div>
            )}

            {additionalcost2 && (
                <div className="bom-print-modal">
                <div className="fixed inset-0 flex items-center justify-center">
                    <div style={{width: 767, height: 727, position: 'relative', background: 'white', boxShadow: '0px 4px 7.5px 1px rgba(0, 0, 0, 0.25)', overflow: 'hidden', borderRadius: 10}}>
                        <div style={{width: 115, height: 40, paddingTop: 12, paddingBottom: 8, paddingLeft: 72, paddingRight: 24, left: 46, top: 656, position: 'absolute', background: 'white', overflow: 'hidden', borderRadius: 8, outline: '1.50px #A4A4A4 solid', outlineOffset: '-1.50px', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 8, display: 'inline-flex'}}>
                            <button onClick={() => {setAdditionalCost(true), setAdditionalCost2(false)}}><div style={{width: 130, justifyContent: 'center', alignItems: 'center', gap: 13, display: 'inline-flex'}}>
                                <div style={{justifyContent: 'center', alignItems: 'center', gap: 0, display: 'inline-flex'}}>
                                    <div className="MRPIcon3" style={{width: 15, height: 21, paddingRight: 25 }} />
                                    <div style={{width: 90, paddingLeft: 0, paddingRight: 2, justifyContent: 'flex-start', alignItems: 'flex-start', gap: 8, display: 'flex'}}>
                                        <div style={{justifyContent: 'center', display: 'flex', flexDirection: 'column', color: '#969696', fontSize: 20, fontFamily: 'Inter', fontWeight: '500', textTransform: 'capitalize', lineHeight: 1, wordWrap: 'break-word'}}>back</div>
                                    </div>
                                </div>
                            </div></button>
                        </div>
                        <div style={{width: 452, height: 70, left: 154, top: 17, position: 'absolute', textAlign: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column', color: '#130101', fontSize: 35, fontFamily: 'Inter', fontWeight: '400', textTransform: 'capitalize', lineHeight: 1, letterSpacing: 1.40, wordWrap: 'break-word'}}>Additional Costs</div>
                        <div style={{width: 671, height: 440, left: 47, top: 106, position: 'absolute', background: 'white', boxShadow: '0px 4px 7.5px 1px rgba(0, 0, 0, 0.25)', overflow: 'hidden', borderRadius: 20}}>
                            <div style={{width: 671, height: 485, left: 0, top: 0, position: 'absolute'}}>
                                <div style={{width: 671, left: 0, top: 0, position: 'absolute', background: 'white', overflow: 'hidden', outline: '1px #E8E8E8 solid', outlineOffset: '-1px', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', display: 'inline-flex'}}>
                                    <div style={{alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0)', overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                        <div data-type="Header" style={{flex: '1 1 0', alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0.05)', borderBottom: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                            <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                                <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '700', lineHeight: 1, wordWrap: 'break-word'}}>Type</div>
                                            </div>
                                        </div>
                                        <div data-type="Header" style={{flex: '1 1 0', alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0.05)', borderLeft: '1px #E8E8E8 solid', borderBottom: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                            <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                                <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 19, fontFamily: 'Inter', fontWeight: '700', lineHeight: 1, wordWrap: 'break-word'}}>Cost</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0)', overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                        <div data-type="Default" style={{flex: '1 1 0', alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0)', borderBottom: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                            <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                                <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '500', lineHeight: 1, wordWrap: 'break-word'}}>Cost of Products</div>
                                            </div>
                                        </div>
                                        <div data-type="Default" style={{flex: '1 1 0', alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0)', borderLeft: '1px #E8E8E8 solid', borderBottom: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                            <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                                <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '500', lineHeight: 1, wordWrap: 'break-word'}}>₱40,000.80</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style={{width: 600, height: 37, left: 84, top: 582, position: 'absolute', background: 'white', boxShadow: '0px 4px 7.5px 1px rgba(0, 0, 0, 0.25)', overflow: 'hidden', borderRadius: 20}}>
                            <div style={{width: 257, paddingLeft: 24, paddingRight: 24, paddingTop: 8, paddingBottom: 8, left: 33, top: 0, position: 'absolute', background: 'white', overflow: 'hidden', justifyContent: 'space-between', alignItems: 'center', display: 'inline-flex'}}>
                                <div style={{width: 244, textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '500', lineHeight: 1, wordWrap: 'break-word'}}>Total Cost of Order:</div>
                            </div>
                            <div style={{width: 234, paddingLeft: 24, paddingRight: 24, paddingTop: 8, paddingBottom: 8, left: 329, top: 0, position: 'absolute', background: 'white', overflow: 'hidden', justifyContent: 'center', alignItems: 'center', gap: 8, display: 'inline-flex'}}>
                                <div style={{width: 191, textAlign: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '500', lineHeight: 1, wordWrap: 'break-word'}}>₱850,000,000,000</div>
                            </div>
                        </div>
                        <button onClick={() => {setChecker(true)}}><div style={{width: 166, height: 40, paddingTop: 8, paddingBottom: 8, paddingLeft: 17, paddingRight: 15, left: 545, top: 656, position: 'absolute', background: '#00A8A8', overflow: 'hidden', borderRadius: 8, flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', gap: 8, display: 'inline-flex'}}>
                            <div style={{justifyContent: 'center', alignItems: 'center', gap: 3, display: 'inline-flex'}}>
                                <div style={{width: 116, paddingLeft: 0, paddingRight: 10, justifyContent: 'flex-end', alignItems: 'center', gap: 8, display: 'flex'}}>
                                    <div style={{justifyContent: 'center', display: 'flex', flexDirection: 'column', color: 'white', fontSize: 18, fontFamily: 'Inter', fontWeight: '500', textTransform: 'capitalize', lineHeight: 1, wordWrap: 'break-word'}}>Create BOM</div>
                                </div>
                                <div className="MRPIcon5" style={{width: 13, height: 21, transformOrigin: 'center'}} />
                            </div>
                        </div></button>
                        <div data-property-1="Disabled" style={{width: 201, height: 40, padding: 10, left: 331, top: 656, position: 'absolute', background: '#F5F5F5', borderRadius: 10, outline: '1.50px #E5E5E5 solid', outlineOffset: '-1.50px', justifyContent: 'center', alignItems: 'center', gap: 30, display: 'inline-flex'}}>
                            <div style={{color: '#585757', fontSize: 17, fontFamily: 'Inter', fontWeight: '400', wordWrap: 'break-word'}}>000000002</div>
                        </div>
                        <div style={{width: 92, height: 29, left: 234, top: 661, position: 'absolute', textAlign: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '500', lineHeight: 1, wordWrap: 'break-word'}}>Order No.</div>
                    </div>  
                </div>
                </div>
            )}

            {checker && (
                <div className="bom-print-modal2">
                <div className="fixed inset-0 flex items-center justify-center">
                    <div style={{width: 660, height: 345, position: 'relative', background: 'white', boxShadow: '0px 4px 7.5px 1px rgba(0, 0, 0, 0.25)', overflow: 'hidden', borderRadius: 10}}>
                        <div style={{width: 618, height: 153, left: 21, top: 31, position: 'absolute', textAlign: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column', color: '#130101', fontSize: 45, fontFamily: 'Inter', fontWeight: '400', textTransform: 'capitalize', lineHeight: 1, letterSpacing: 1.80, wordWrap: 'break-word'}}>Are you sure you want to create a BOM?</div>
                        <button onClick={() => {setCreated(true), setChecker(false), setAdditionalCost(false), setAdditionalCost2(false), setIsOpen(false), setIsOpen2(false)}}><div style={{width: 166, height: 40, paddingTop: 8, paddingBottom: 8, paddingLeft: 18, paddingRight: 15, left: 452, top: 273, position: 'absolute', background: '#00A8A8', overflow: 'hidden', borderRadius: 8, flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', gap: 8, display: 'inline-flex'}}>
                            <div style={{justifyContent: 'center', alignItems: 'center', gap: 3, display: 'inline-flex'}}>
                                <div style={{width: 116, paddingLeft: 0, paddingRight: 10, justifyContent: 'flex-end', alignItems: 'center', gap: 8, display: 'flex'}}>
                                    <div style={{justifyContent: 'center', display: 'flex', flexDirection: 'column', color: 'white', fontSize: 18, fontFamily: 'Inter', fontWeight: '500', textTransform: 'capitalize', lineHeight: 1, wordWrap: 'break-word'}}>Create BOM</div>
                                </div>
                                <div className="MRPIcon5" style={{width: 13, height: 21, transformOrigin: 'center'}} />
                            </div>
                        </div></button>
                        <button onClick={() => {setChecker(false)}}><div style={{width: 115, height: 40, paddingTop: 8, paddingBottom: 8, paddingLeft: 72, paddingRight: 24, left: 41, top: 273, position: 'absolute', background: 'white', overflow: 'hidden', borderRadius: 8, outline: '1.50px #A4A4A4 solid', outlineOffset: '-1.50px', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 8, display: 'inline-flex'}}>
                            <div style={{justifyContent: 'center', alignItems: 'center', gap: 0, display: 'inline-flex'}}>
                                <div className="MRPIcon3" style={{width: 15, height: 21, paddingRight: 25 }} />
                                <div style={{width: 90, paddingLeft: -5, paddingRight: 2, justifyContent: 'flex-start', alignItems: 'flex-start', gap: 8, display: 'flex'}}>
                                    <div style={{justifyContent: 'center', display: 'flex', flexDirection: 'column', color: '#969696', fontSize: 20, fontFamily: 'Inter', fontWeight: '500', textTransform: 'capitalize', lineHeight: 1, wordWrap: 'break-word'}}>back</div>
                                </div>
                            </div>
                        </div></button>
                        <div data-property-1="Disabled" style={{width: 201, height: 40, padding: 10, left: 281, top: 193, position: 'absolute', background: '#F5F5F5', borderRadius: 10, outline: '1.50px #E5E5E5 solid', outlineOffset: '-1.50px', justifyContent: 'center', alignItems: 'center', gap: 30, display: 'inline-flex'}}>
                            <div style={{color: '#585757', fontSize: 17, fontFamily: 'Inter', fontWeight: '400', wordWrap: 'break-word'}}>000000002</div>
                        </div>
                        <div style={{width: 92, height: 29, left: 178, top: 199, position: 'absolute', textAlign: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '500', lineHeight: 1, wordWrap: 'break-word'}}>Order No.</div>
                    </div>
                </div>
                </div>
            )}

            {created && (
                <div className="bom-print-modal">
                <div className="fixed inset-0 flex items-center justify-center">
                    <div style={{width: 525, height: 485, position: 'relative', background: 'white', boxShadow: '0px 4px 7.5px 1px rgba(0, 0, 0, 0.25)', overflow: 'hidden', borderRadius: 10}}>
                        <button onClick={() => {setCreated(false)}}><div style={{width: 115, height: 40, paddingTop: 8, paddingBottom: 8, paddingLeft: 62, paddingRight: 24, left: 39, top: 414, position: 'absolute', background: 'white', overflow: 'hidden', borderRadius: 8, outline: '1.50px #A4A4A4 solid', outlineOffset: '-1.50px', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 8, display: 'inline-flex'}}>
                            <div style={{justifyContent: 'center', alignItems: 'center', gap: 0, display: 'inline-flex'}}>
                                <div className="MRPIcon3" style={{width: 15, height: 21, paddingRight: 25 }} />
                                <div style={{width: 90, paddingLeft: 0, paddingRight: 2, justifyContent: 'flex-start', alignItems: 'flex-start', gap: 8, display: 'flex'}}>
                                    <div style={{justifyContent: 'center', display: 'flex', flexDirection: 'column', color: '#969696', fontSize: 20, fontFamily: 'Inter', fontWeight: '500', textTransform: 'capitalize', lineHeight: 1, wordWrap: 'break-word'}}>Close</div>
                                </div>
                            </div>
                        </div></button>
                        <button onClick={() => {setIsOpen2(false); setIsOpen(false); setChecker(false); setCreated(false); setAdditionalCost(false); setAdditionalCost2(false); setRawMaterial(false); setCreated(false); setActiveSubModule("Bills Of Material"); loadSubModule("Bills Of Material"); }}><div style={{width: 156, height: 40, paddingTop: 8, paddingBottom: 8, paddingLeft: 12, paddingRight: 15, left: 327, top: 414, position: 'absolute', background: '#00A8A8', overflow: 'hidden', borderRadius: 8, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 8, display: 'inline-flex'}}>
                            <div style={{justifyContent: 'center', alignItems: 'center', gap: 3, display: 'inline-flex'}}>
                                <div style={{width: 116, paddingTop: 2, paddingLeft: 0, paddingRight: 10, justifyContent: 'flex-end', alignItems: 'center', gap: 8, display: 'flex'}}>
                                    <div style={{justifyContent: 'center', display: 'flex', flexDirection: 'column', color: 'white', fontSize: 18, fontFamily: 'Inter', fontWeight: '500', textTransform: 'capitalize', lineHeight: 1, wordWrap: 'break-word'}}>Go to BOM</div>
                                </div>
                                <div className="MRPIcon5" style={{width: 13, height: 21, transformOrigin: 'center'}} />
                            </div>
                        </div></button>
                        <div style={{width: 452, height: 70, left: 39, top: 218, position: 'absolute', textAlign: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column', color: '#130101', fontSize: 35, fontFamily: 'Inter', fontWeight: '400', textTransform: 'capitalize', lineHeight: 1, letterSpacing: 1.40, wordWrap: 'break-word'}}>Bills of Material Created</div>
                        <div style={{width: 423, height: 35, left: 53, top: 288, position: 'absolute', textAlign: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column', color: '#130101', fontSize: 14, fontFamily: 'Inter', fontWeight: '400', textTransform: 'capitalize', lineHeight: 1, letterSpacing: 0.56, wordWrap: 'break-word'}}>The BOM is sent to the sales for approval, <br/>go to pending for more information</div>
                        <div data-property-1="Disabled" style={{width: 201, height: 40, padding: 10, left: 212, top: 349, position: 'absolute', background: '#F5F5F5', borderRadius: 10, outline: '1.50px #E5E5E5 solid', outlineOffset: '-1.50px', justifyContent: 'center', alignItems: 'center', gap: 30, display: 'inline-flex'}}>
                            <div style={{color: '#585757', fontSize: 17, fontFamily: 'Inter', fontWeight: '400', wordWrap: 'break-word'}}>000000002</div>
                        </div>
                        <div style={{width: 92, height: 29, left: 109, top: 355, position: 'absolute', textAlign: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '500', lineHeight: 1, wordWrap: 'break-word'}}>Order No.</div>
                        <img style={{width: 171, height: 171, left: 175, top: 35, position: 'absolute'}} src="public/icons/module-icons/MRP-icons/MRPCheck.png" />
                    </div>
                </div>
                </div>
            )}


            
        </div>
    );
};

export default BodyContent;