import React from "react";
import "./styles/MRP.css";
import { useState } from "react";

const BodyContent = () => {
    const [filter, setFilter] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isOpen2, setIsOpen2] = useState(false);
    const [flag, setFlag] = useState(1);
    return (
        
        <div className="mrp">
            <div style={{width: '100%', height: '100%', paddingLeft: 43, paddingRight: 43, paddingTop: 31, paddingBottom: 31, background: 'white', boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.08)', overflow: 'hidden', borderRadius: 10, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', rowGap: 25, display: 'inline-flex'}}>
            <div style={{width: 1300, justifyContent: 'space-between', alignItems: 'center', display: 'inline-flex'}}>
                    <div style={{justifyContent: 'flex-start', alignItems: 'flex-start', display: 'flex',paddingRight: 45}}>
                        <div onClick={() => setFlag(0)} onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(200, 200, 200, 0.1)")} onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0)")} style={{width: 185, padding: 13, background: 'white', boxShadow: flag === 0 ? '0px -2px 0px #00A8A8 inset' : '0px -1px 0px #E8E8E8 inset', overflow: 'hidden', justifyContent: 'center', alignItems: 'center', gap: 5, display: 'flex'}}>
                            <div style={{textAlign: 'center', color: flag === 0 ? '#00A8A8' : '#585757', fontSize: 16, fontFamily: 'Inter', fontWeight: '500', lineHeight: 1, wordWrap: 'break-word'}}>Total Orders</div>
                        </div>
                        <div onClick={() => setFlag(1)} onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(200, 200, 200, 0.1)")} onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0)")} style={{width: 190, height: 43, paddingTop: 8, paddingBottom: 8, background: 'white', boxShadow: flag === 1 ? '0px -2px 0px #00A8A8 inset' : '0px -1px 0px #E8E8E8 inset', overflow: 'hidden', justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
                            <div style={{textAlign: 'center', color: flag === 1 ? '#00A8A8' : '#585757', fontSize: 16, fontFamily: 'Inter', fontWeight: '500', lineHeight: 1, wordWrap: 'break-word'}}>Ongoing Orders</div>
                        </div>
                        <div onClick={() => setFlag(2)} onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(200, 200, 200, 0.1)")} onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0)")} style={{width: 190, height: 43, paddingTop: 8, paddingBottom: 8, background: 'white', boxShadow: flag === 2 ? '0px -2px 0px #00A8A8 inset' : '0px -1px 0px #E8E8E8 inset', overflow: 'hidden', justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
                            <div style={{textAlign: 'center', color: flag === 2 ? '#00A8A8' : '#585757', fontSize: 16, fontFamily: 'Inter', fontWeight: '500', lineHeight: 1, wordWrap: 'break-word'}}>Pending Orders</div>
                        </div>
                        <div onClick={() => setFlag(3)} onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(200, 200, 200, 0.1)")} onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0)")} style={{width: 190, height: 43, paddingTop: 8, paddingBottom: 8, background: 'white', boxShadow: flag === 3 ? '0px -2px 0px #00A8A8 inset' : '0px -1px 0px #E8E8E8 inset', overflow: 'hidden', justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
                            <div style={{textAlign: 'center', color: flag === 3 ? '#00A8A8' : '#585757', fontSize: 16, fontFamily: 'Inter', fontWeight: '500', lineHeight: 1, wordWrap: 'break-word'}}>Completed Orders</div>
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
                        <button onClick={() => setFilter(true)}><div style={{justifyContent: 'flex-end', alignItems: 'center', display: 'flex'}}>
                            <div style={{paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8, background: 'white', boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.06)', overflow: 'hidden', borderRadius: 8, outline: '1px #E8E8E8 solid', outlineOffset: '-1px', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 8, display: 'flex'}}>
                                <div style={{paddingTop: 3, textAlign: 'center', color: '#858585', fontSize: 16, fontFamily: 'Inter', fontWeight: '500', lineHeight: 1, wordWrap: 'break-word'}}>Filter by</div>
                                <div className="MRPIcon1" style={{width: 20, height: 20, position: 'relative'}}>
                                </div>
                            </div>
                        </div></button>
                    </div>
                </div>
                <div style={{width: 1156, height: 491, paddingLeft: 5, paddingRight: 5, paddingTop: 10, paddingBottom: 10, background: 'white', boxShadow: '0px 4px 7.5px 1px rgba(0, 0, 0, 0.25)', overflow: 'hidden', borderRadius: 20, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', gap: 20, display: 'flex'}}>
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
                            <div onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(200, 200, 200, 0.2)")} onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0)")} onClick={() => setIsOpen(true)} style={{cursor: 'pointer', alignSelf: 'stretch', paddingTop: 0.50, paddingBottom: 0.50, background: 'rgba(255, 255, 255, 0)', overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                <div data-type="Default" style={{flex: '1 1 0', alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0)', borderBottom: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                    <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                        <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '500', lineHeight: 1, wordWrap: 'break-word'}}>000000001</div>
                                    </div>
                                </div>
                                <div data-type="Default" style={{flex: '1 1 0', alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0)', borderLeft: '1px #E8E8E8 solid', borderBottom: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                    <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                        <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '500', lineHeight: 1, wordWrap: 'break-word'}}>Project</div>
                                    </div>
                                </div>
                                <div data-type="Default" style={{flex: '1 1 0', alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0)', borderLeft: '1px #E8E8E8 solid', borderBottom: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                    <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                        <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '500', lineHeight: 1, wordWrap: 'break-word'}}>Tondo Hospital - Package Ord</div>
                                    </div>
                                </div>
                                <div data-type="Default" style={{flex: '1 1 0', alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0)', borderLeft: '1px #E8E8E8 solid', borderBottom: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                    <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                        <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '500', lineHeight: 1, wordWrap: 'break-word'}}>July 3 2025</div>
                                    </div>
                                </div>
                            </div>
                            <div onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(200, 200, 200, 0.2)")} onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0)")} onClick={() => setIsOpen(true)} style={{cursor: 'pointer', alignSelf: 'stretch', paddingTop: 0.50, paddingBottom: 0.50, background: 'rgba(255, 255, 255, 0)', overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                <div data-type="Default" style={{flex: '1 1 0', alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0)', borderBottom: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                    <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                        <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '500', lineHeight: 1, wordWrap: 'break-word'}}>000000002</div>
                                    </div>
                                </div>
                                <div data-type="Default" style={{flex: '1 1 0', alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0)', borderLeft: '1px #E8E8E8 solid', borderBottom: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                    <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                        <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '500', lineHeight: 1, wordWrap: 'break-word'}}>Non Project</div>
                                    </div>
                                </div>
                                <div data-type="Default" style={{flex: '1 1 0', alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0)', borderLeft: '1px #E8E8E8 solid', borderBottom: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                    <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                        <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '500', lineHeight: 1, wordWrap: 'break-word'}}>Tondo Hospital - Package Ord</div>
                                    </div>
                                </div>
                                <div data-type="Default" style={{flex: '1 1 0', alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0)', borderLeft: '1px #E8E8E8 solid', borderBottom: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                    <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                        <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '500', lineHeight: 1, wordWrap: 'break-word'}}>July 3 2025</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{alignSelf: 'stretch', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 10, display: 'flex'}}>
                    <div style={{alignSelf: 'stretch', height: 40, justifyContent: 'center', alignItems: 'flex-end', gap: 8, display: 'inline-flex'}}>
                        <div style={{flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                            <div style={{padding: 10, background: 'white', boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.06)', overflow: 'hidden', borderRadius: 8, outline: '1px #E8E8E8 solid', outlineOffset: '-1px', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', gap: 8, display: 'flex'}}>
                                <div className="MRPIcon2" style={{width: 20, height: 20, position: 'relative'}}>
                                </div>
                            </div>
                        </div>
                        <div style={{width: 34, paddingLeft: 12, paddingRight: 12, paddingTop: 12, paddingBottom: 12, background: '#00A8A8', boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.08)', overflow: 'hidden', borderRadius: 8, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', gap: 8, display: 'inline-flex'}}>
                            <div style={{textAlign: 'center', color: 'white', fontSize: 16, fontFamily: 'Inter', fontWeight: '500', lineHeight: 1, wordWrap: 'break-word'}}>1</div>
                        </div>
                        <div style={{flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                            <div style={{paddingLeft: 12, paddingRight: 12, paddingTop: 12, paddingBottom: 12, background: 'white', boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.06)', overflow: 'hidden', borderRadius: 8, outline: '1px #E8E8E8 solid', outlineOffset: '-1px', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', gap: 8, display: 'flex'}}>
                                <div style={{textAlign: 'center', color: '#868686', fontSize: 16, fontFamily: 'Inter', fontWeight: '500', lineHeight: 1, wordWrap: 'break-word'}}>2</div>
                            </div>
                        </div>
                        <div style={{flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                            <div style={{paddingLeft: 12, paddingRight: 12, paddingTop: 12, paddingBottom: 12, background: 'white', boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.06)', overflow: 'hidden', borderRadius: 8, outline: '1px #E8E8E8 solid', outlineOffset: '-1px', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', gap: 8, display: 'flex'}}>
                                <div style={{textAlign: 'center', color: '#868686', fontSize: 16, fontFamily: 'Inter', fontWeight: '500', lineHeight: 1, wordWrap: 'break-word'}}>3</div>
                            </div>
                        </div>
                        <div style={{flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                            <div style={{paddingLeft: 12, paddingRight: 12, paddingTop: 12, paddingBottom: 12, background: 'white', boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.06)', overflow: 'hidden', borderRadius: 8, outline: '1px #E8E8E8 solid', outlineOffset: '-1px', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', gap: 8, display: 'flex'}}>
                                <div style={{textAlign: 'center', color: '#868686', fontSize: 16, fontFamily: 'Inter', fontWeight: '500', lineHeight: 1, wordWrap: 'break-word'}}>4</div>
                            </div>
                        </div>
                        <div style={{flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                            <div style={{padding: 10, background: 'white', boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.06)', overflow: 'hidden', borderRadius: 8, outline: '1px #E8E8E8 solid', outlineOffset: '-1px', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', gap: 8, display: 'flex'}}>
                                <div className="MRPIcon3" style={{width: 20, height: 20, position: 'relative'}}>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center">
                    <div style={{width: 953, height: 527, position: 'relative', background: 'white', boxShadow: '0px 4px 7.5px 1px rgba(0, 0, 0, 0.25)', overflow: 'hidden', borderRadius: 10}}>
                        <button onClick={() => setIsOpen(false)}><div style={{width: 115, height: 40, paddingTop: 8, paddingBottom: 8, paddingLeft: 72, paddingRight: 24, left: 37, top: 460, position: 'absolute', background: 'white', overflow: 'hidden', borderRadius: 8, outline: '1.50px #A4A4A4 solid', outlineOffset: '-1.50px', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 8, display: 'inline-flex'}}>
                            <div style={{width: 130, justifyContent: 'center', alignItems: 'center', gap: 13, display: 'inline-flex'}}>
                                <div className="MRPIcon3" style={{flex: '1 1 0', width: 13, height: 21}} />
                                <div style={{width: 104, paddingLeft: 2, paddingRight: 2, justifyContent: 'flex-start', alignItems: 'flex-start', gap: 8, display: 'flex'}}>
                                    <div style={{justifyContent: 'center', display: 'flex', flexDirection: 'column', color: '#969696', fontSize: 20, fontFamily: 'Inter', fontWeight: '500', textTransform: 'capitalize', lineHeight: 1, wordWrap: 'break-word'}}>back</div>
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
                        <button onClick={() => setIsOpen2(true)}><div style={{width: 110, height: 40, paddingTop: 8, paddingBottom: 8, paddingLeft: 24, paddingRight: 15, left: 813, top: 460, position: 'absolute', background: '#00A8A8', overflow: 'hidden', borderRadius: 8, flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', gap: 8, display: 'inline-flex'}}>
                            <div style={{justifyContent: 'center', alignItems: 'center', gap: 3, display: 'inline-flex'}}>
                                <div style={{width: 50, paddingLeft: 2, paddingRight: 10, justifyContent: 'flex-start', alignItems: 'flex-start', gap: 8, display: 'flex'}}>
                                    <div style={{justifyContent: 'center', display: 'flex', flexDirection: 'column', color: 'white', fontSize: 18, fontFamily: 'Inter', fontWeight: '500', textTransform: 'capitalize', lineHeight: 1, wordWrap: 'break-word'}}>Next</div>
                                </div>
                                <div className="MRPIcon5" style={{width: 13, height: 21, transformOrigin: 'top left'}} />
                            </div>
                        </div></button>
                    </div>
                </div>
            )}


            {isOpen2 && (
                <div className="fixed inset-0 flex items-center justify-center">
                    <div style={{width: 1361, height: 760, position: 'relative', background: 'white', boxShadow: '0px 4px 7.5px 1px rgba(0, 0, 0, 0.25)', overflow: 'hidden', borderRadius: 10}}>
                        <button onClick={() => setIsOpen2(false)}><div style={{width: 115, height: 40, paddingTop: 8, paddingBottom: 8, paddingLeft: 72, paddingRight: 24, left: 46, top: 683, position: 'absolute', background: 'white', overflow: 'hidden', borderRadius: 8, outline: '1.50px #A4A4A4 solid', outlineOffset: '-1.50px', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 8, display: 'inline-flex'}}>
                            <div style={{width: 130, justifyContent: 'center', alignItems: 'center', gap: 13, display: 'inline-flex'}}>
                                <div style={{flex: '1 1 0', height: 21, background: '#969696'}} />
                                <div style={{width: 104, paddingLeft: 2, paddingRight: 2, justifyContent: 'flex-start', alignItems: 'flex-start', gap: 8, display: 'flex'}}>
                                    <div style={{justifyContent: 'center', display: 'flex', flexDirection: 'column', color: '#969696', fontSize: 20, fontFamily: 'Inter', fontWeight: '500', textTransform: 'capitalize', lineHeight: 1, wordWrap: 'break-word'}}>Back</div>
                                </div>
                            </div>
                        </div></button>
                        <div style={{width: 110, height: 40, paddingTop: 8, paddingBottom: 8, paddingLeft: 24, paddingRight: 15, left: 1193, top: 683, position: 'absolute', background: '#00A8A8', overflow: 'hidden', borderRadius: 8, flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', gap: 8, display: 'inline-flex'}}>
                            <div style={{justifyContent: 'center', alignItems: 'center', gap: 3, display: 'inline-flex'}}>
                                <div style={{width: 49, paddingLeft: 2, paddingRight: 10, justifyContent: 'flex-start', alignItems: 'flex-start', gap: 8, display: 'flex'}}>
                                    <div style={{justifyContent: 'center', display: 'flex', flexDirection: 'column', color: 'white', fontSize: 18, fontFamily: 'Inter', fontWeight: '500', textTransform: 'capitalize', lineHeight: 1, wordWrap: 'break-word'}}>Next</div>
                                </div>
                                <div style={{width: 13, height: 21, transform: 'rotate(-180deg)', transformOrigin: 'top left', background: 'white'}} />
                            </div>
                        </div>
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
                                <div data-type="Default" style={{flex: '1 1 0', alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0)', borderLeft: '1px #E8E8E8 solid', borderBottom: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
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
                                <div data-type="Default" style={{flex: '1 1 0', alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0)', borderLeft: '1px #E8E8E8 solid', borderBottom: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
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
                        <div style={{width: 587, height: 50, paddingTop: 3, paddingBottom: 3, left: 649, top: 613, position: 'absolute', background: 'white', boxShadow: '0px 4px 7.5px 1px rgba(0, 0, 0, 0.25)', overflow: 'hidden', borderRadius: 20, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 9, display: 'inline-flex'}}>
                            <div style={{width: 283, paddingLeft: 24, paddingRight: 24, paddingTop: 8, paddingBottom: 8, background: 'white', overflow: 'hidden', justifyContent: 'center', alignItems: 'center', gap: 8, display: 'inline-flex'}}>
                                <div style={{width: 258, textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '500', lineHeight: 1, wordWrap: 'break-word'}}>Total Cost of Products:</div>
                            </div>
                            <div style={{width: 276, paddingLeft: 24, paddingRight: 24, paddingTop: 8, paddingBottom: 8, background: 'white', overflow: 'hidden', justifyContent: 'center', alignItems: 'center', gap: 8, display: 'inline-flex'}}>
                                <div style={{width: 227, textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '500', lineHeight: 1, wordWrap: 'break-word'}}>₱40,000.80</div>
                            </div>
                        </div>
                        <div style={{width: 472, height: 50, paddingTop: 3, paddingBottom: 3, left: 125, top: 613, position: 'absolute', background: 'white', boxShadow: '0px 4px 7.5px 1px rgba(0, 0, 0, 0.25)', overflow: 'hidden', borderRadius: 20, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 9, display: 'inline-flex' }}>
                            <div style={{width: 198, paddingLeft: 24, paddingRight: 24, paddingTop: 8, paddingBottom: 8, background: 'white', overflow: 'hidden', justifyContent: 'center', alignItems: 'center', gap: 8, display: 'inline-flex'}}>
                                <div style={{width: 177, textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '500', lineHeight: 1, wordWrap: 'break-word'}}>Total Quantity:</div>
                            </div>
                            <div style={{width: 221, paddingLeft: 24, paddingRight: 24, paddingTop: 8, paddingBottom: 8, background: 'white', overflow: 'hidden', justifyContent: 'center', alignItems: 'center', gap: 8, display: 'inline-flex'}}>
                                <div style={{width: 171, textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '500', lineHeight: 1, wordWrap: 'break-word'}}>12</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {filter && (
                <div className="absolute inset-0 flex items-topright justify-center" style={{left: 1130, top: 290,}}>
                    <div style={{width: 240, height: 160, position: 'relative', background: 'white', boxShadow: '0px 4px 7.5px 1px rgba(0, 0, 0, 0.25)', overflow: 'hidden', borderRadius: 20}}>
                        <div style={{width: 131, left: 31, top: 26, position: 'absolute', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '500', lineHeight: 1, wordWrap: 'break-word'}}>Type</div>
                        <div style={{width: 16, height: 16, left: 31, top: 72, position: 'absolute', background: 'white', borderRadius: 9999, border: '2px #C0C6CC solid'}} />
                        <div style={{width: 16, height: 16, left: 31, top: 103, position: 'absolute', background: '#00A8A8', borderRadius: 9999, border: '2px #C0C6CC solid'}} />
                        <div style={{width: 110, left: 58, top: 68, position: 'absolute', color: '#585757', fontSize: 16, fontFamily: 'Inter', fontWeight: '400', lineHeight: 1, wordWrap: 'break-word'}}>Project Based</div>
                        <div style={{width: 148, left: 58, top: 98, position: 'absolute', color: '#585757', fontSize: 16, fontFamily: 'Inter', fontWeight: '400', lineHeight: 1, wordWrap: 'break-word'}}>Non-Project Based</div>
                        <button onClick={() => setFilter(false)}><div className="MRPclose" style={{width: 26, height: 26, left: 191, top: 20, position: 'absolute',}} /></button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default BodyContent;



