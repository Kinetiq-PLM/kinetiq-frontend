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
    const [searchTerm, setSearchTerm] = useState("");

    const mrpData = [
        { number: "000000001", type: "Project", details: "Tondo Hospital - Package..", date: "July 3 2025" },
        { number: "000000002", type: "Non Project", details: "Tondo Hospital - Package.. ", date: "July 3 2025" },
        { number: "000000001", type: "Project", details: "Tondo Hospital - Package..", date: "July 3 2025" },
        { number: "000000002", type: "Non Project", details: "Tondo Hospital - Package.. ", date: "July 3 2025" },
        { number: "000000001", type: "Project", details: "Tondo Hospital - Package..", date: "July 3 2025" },
    ];

    const bomDetails = [
        { no: 1, product: "Apple", qtyProduct: 100, rawMaterial: "Sugar", qtyRawMaterial: 50, unit: "kg", costPerUnit: 120, totalCost: 600 },
        { no: 2, product: "Apple", qtyProduct: 200, rawMaterial: "Starch", qtyRawMaterial: 80, unit: "kg", costPerUnit: 100, totalCost: 800 },
        { no: 1, product: "Apple", qtyProduct: 100, rawMaterial: "Sugar", qtyRawMaterial: 50, unit: "kg", costPerUnit: 120, totalCost: 600 },
        { no: 2, product: "Apple", qtyProduct: 200, rawMaterial: "Starch", qtyRawMaterial: 80, unit: "kg", costPerUnit: 100, totalCost: 800 },
        { no: 1, product: "Apple", qtyProduct: 100, rawMaterial: "Sugar", qtyRawMaterial: 50, unit: "kg", costPerUnit: 120, totalCost: 600 },
        { no: 2, product: "Apple", qtyProduct: 200, rawMaterial: "Starch", qtyRawMaterial: 80, unit: "kg", costPerUnit: 100, totalCost: 800 },
        { no: 1, product: "Apple", qtyProduct: 100, rawMaterial: "Sugar", qtyRawMaterial: 50, unit: "kg", costPerUnit: 120, totalCost: 600 },
        { no: 2, product: "Apple", qtyProduct: 200, rawMaterial: "Starch", qtyRawMaterial: 80, unit: "kg", costPerUnit: 100, totalCost: 800 },
    ];

    const cellStyle = (width) => ({width, padding: '10px 12px', textAlign: 'center', fontSize: 18, fontFamily: 'Inter', fontWeight: 500, color: '#585757', borderBottom: '1px solid #E8E8E8', borderLeft: '1px solid #E8E8E8', wordWrap: 'break-word', lineHeight: 1, });

    const getFilteredData = () => {
        return mrpData.filter((item) => {
          const matchesFlag =
            flag === 0 ||
            (flag === 1 && item.type === "Project") ||
            (flag === 2 && item.type === "Non Project");
      
          const term = (searchTerm || "").toLowerCase(); // prevent null error
      
          const number = (item.number || "").toLowerCase();
          const date = (item.date || "").toLowerCase();
          const details = (item.details || "").toLowerCase();
      
          const searchMatch =
            number.includes(term) ||
            date.includes(term) ||
            details.includes(term);
      
          return matchesFlag && searchMatch;
        });
      };
      
    const filteredData = getFilteredData();
    const buttonStyle = (bg, border, textColor = '#585757') => ({display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px 20px', borderRadius: 8, background: bg, color: textColor, fontSize: 16, fontWeight: '500', fontFamily: 'Inter', gap: 6, cursor: 'pointer', });
    const buttonStyle2 = (bg, textColor = '#585757') => ({display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px 20px', borderRadius: 8, background: bg, border: '0.5px solid #585757', color: textColor, fontSize: 16, fontWeight: '500', fontFamily: 'Inter', gap: 6, cursor: 'pointer',});
    const rowCellStyle = {flex: '1 1 14%', minWidth: 120, padding: '12px', textAlign: 'center', fontFamily: 'Inter', fontSize: 15, color: '#585757'};

    return (      
        <div className="reqplan">
            <div style={{width: '100%', height: '100%', padding: '2rem', background: 'white', boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.08)', overflow: 'hidden', borderRadius: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', rowGap: 25,}}>
                <div className="title">MRP LIST</div>
                {/* Tabs + Search */}
                <div style={{width: '100%', maxWidth: 1300, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', rowGap: 10,paddingLeft: 80, paddingRight: 80,}}>
                {/* Tabs */}
                <div className="tabs-container" style={{ display: 'flex', flexWrap: 'wrap', gap: 15,flex: '1 1 auto', minWidth: 200,}}>
                    {['All Orders', 'Project Orders', 'Non-Project Orders'].map((label, i) => (
                    <div key={label}
                        onClick={() => setFlag(i)}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(200, 200, 200, 0.1)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                        style={{ minWidth: 120, padding: '10px 16px', background: 'white', boxShadow: flag === i ? '0px -2px 0px #00A8A8 inset' : '0px -1px 0px #E8E8E8 inset', justifyContent: 'center', alignItems: 'center', display: 'flex', cursor: 'pointer'
                        }}>
                        <div className="text-tab" style={{textAlign: 'center', color: flag === i ? '#00A8A8' : '#585757', fontSize: 16, fontFamily: 'Inter', fontWeight: '500', lineHeight: 1}}>{label}</div>
                    </div>
                    ))}
                </div>

                {/* Search Box */}
                <div className="search-container" style={{background: '#F7F9FB', borderRadius: 8, outline: '1px rgba(132,132,132,0.25) solid', padding: 5, display: 'flex', alignItems: 'center', marginTop: 10, paddingRight: 100, alignItems: 'stretch',}}>
                    <input
                    placeholder="Search Order Number..."
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{flex: 1, padding: '8px', border: 'none', outline: 'none', backgroundColor: 'transparent', color: '#969696', fontSize: 16, fontFamily: 'Inter'}}/>
                </div>
                </div>

                {/* Table Container */}
                <div className="reqplan-table-scroll" style={{width: '100%', maxWidth: 1159, background: 'white', boxShadow: '0px 4px 7.5px 1px rgba(0, 0, 0, 0.25)', overflowY: 'auto', maxHeight: '450px', borderRadius: 20, display: 'flex', flexDirection: 'column', gap: 0, padding: '1rem'}}>
                {/* Header */}
                <div className="table-header" style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    borderBottom: '1px solid #E8E8E8',
                }}>
                    {['Order No.', 'Type', 'Details', 'Date'].map((label, i) => (
                    <div
                        className="table-cell2"
                        key={label}
                        data-label={label} 
                        style={{flex: '1 1 25%', minWidth: 150, padding: '12px', fontWeight: 700, textAlign: 'center', color: '#585757', fontFamily: 'Inter',fontSize: 18}}>
                        {label}
                    </div>
                    ))}
                </div>

                {/* Rows */}
                {filteredData.map((item, index) => (
                    <div
                    className="table-row"
                    key={index}
                    onClick={() => setIsOpen(true)}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(200, 200, 200, 0.2)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        cursor: 'pointer',
                        borderBottom: '1px solid #E8E8E8',
                    }}
                    >
                    {[item.number, item.type, item.details, item.date].map((val, idx) => (
                    <div
                        className="table-cell"
                        key={idx}
                        data-label={['Order No.', 'Type', 'Details', 'Date'][idx]}
                        style={{flex: '1 1 25%', minWidth: 150, padding: '12px', textAlign: 'center', fontFamily: 'Inter', fontSize: 16, color: '#585757'}}>
                        {val}
                    </div>
                    ))}
                    </div>
                ))}
                </div>
            </div>

            {isOpen && (
            <div className="bom-print-modal">
                <div className="fixed inset-0 flex items-center justify-center">
                <div className="modal-inner" style={{ width: '90%', maxWidth: 953, background: 'white', borderRadius: 10, boxShadow: '0px 4px 7.5px 1px rgba(0, 0, 0, 0.25)', padding: 24, display: 'flex', flexDirection: 'column', gap: 24, }}>
                    <div
                    style={{fontSize: 'clamp(20px, 3vw, 35px)', fontFamily: 'Inter', fontWeight: 500, textAlign: 'center', color: '#130101', paddingTop: 30,}}>Order Details</div>

                    {/* INFO SECTION */}
                    <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 20, padding: 20,}}>
                    {[
                        { label: 'Order No.', value: mrpData[0].number },
                        { label: 'Type', value: mrpData[0].type },
                        { label: 'Details', value: mrpData[0].details },
                        { label: 'Date', value: mrpData[0].date },
                    ].map((item) => (
                        <div key={item.label} style={{ flex: '1 1 45%', minWidth: 200}}>
                        <div style={{fontSize: 'clamp(14px, 2vw, 18px)', fontWeight: '500', color: '#585757', marginBottom: 5,}}>
                            {item.label}
                        </div>
                        <div style={{ padding: 15, background: '#E9E9E9', borderRadius: 10, fontSize: 'clamp(14px, 2vw, 17px)', color: '#585757', outline: '1.5px solid #E5E5E5',}}>
                            {item.value}
                        </div>
                        </div>
                    ))}
                    </div>

                    {/* BUTTONS */}
                    <div
                    style={{display: 'flex', justifyContent: 'space-between', marginTop: 'auto', flexWrap: 'wrap', gap: 10,}}>
                    <button onClick={() => setIsOpen(false)} style={buttonStyle2('#fff', '#A4A4A4')}>
                        <div className="MRPIcon3" style={{ width: 15, height: 21, marginRight: 10 }} />
                        <span style={{ color: '#969696' }}>Back</span>
                    </button>

                    <button
                        onClick={() => {setIsOpen2(true); setIsOpen(false);}}
                        style={buttonStyle('#00A8A8', '#00A8A8', 'white')}>
                        <span>Next</span>
                        <div className="MRPIcon5" style={{ width: 13, height: 21, marginLeft: 8 }} />
                    </button>
                    </div>
                </div>
                </div>
            </div>
            )}

            {isOpen2 && (
            <div className="bom-print-modal">
                <div className="fixed inset-0 flex items-center justify-center">
                    <div style={{width: '90vw', maxWidth: 1360, height: '90vh', maxHeight: 760, background: 'white', borderRadius: 10, boxShadow: '0px 4px 7.5px 1px rgba(0, 0, 0, 0.25)', overflow: 'hidden', padding: '3rem', display: 'flex', flexDirection: 'column', gap: '1.5rem',}}>
                        {/* Title */}
                        <div style={{fontSize: 'clamp(24px, 3vw, 35px)', fontFamily: 'Inter', fontWeight: 500, textAlign: 'center',color: '#130101',}}>Product Pricing</div>

                        {/* Table */}
                        <div className="reqplan-table-scroll" style={{width: '100%', flex: 1, background: 'white', boxShadow: '0px 4px 7.5px 1px rgba(0, 0, 0, 0.25)', overflowY: 'auto', borderRadius: 20, display: 'flex', flexDirection: 'column', gap: 0, padding: '1rem',}}>
                        {/* Header */}
                        <div className="table-header" style={{ display: 'flex', flexWrap: 'wrap', borderBottom: '1px solid #E8E8E8',}}>
                            {['No.', 'Product ID', 'Product', 'Product Description', 'Quantity', 'Raw Materials', 'Cost'].map(
                            (label) => (
                                <div
                                key={label}
                                style={{
                                    flex: '1 1 14%',
                                    minWidth: 120,
                                    padding: '12px',
                                    fontWeight: 700,
                                    textAlign: 'center',
                                    color: '#585757',
                                    fontFamily: 'Inter',
                                    fontSize: 16,
                                }}
                                >
                                {label}
                                </div>
                            )
                            )}
                        </div>

                        {/* Rows */}
                        {bomDetails.map((item, index) => (
                            <div
                            key={index}
                            className="table-row"
                            style={{display: 'flex', flexWrap: 'wrap',borderBottom: '1px solid #E8E8E8',}}>
                            <div style={rowCellStyle}>{item.no}</div>
                            <div style={rowCellStyle}>{`PROD${String(item.no).padStart(4, '0')}`}</div>
                            <div style={rowCellStyle}>{item.product}</div>
                            <div style={rowCellStyle}>{`Description of ${item.product}`}</div>
                            <div style={rowCellStyle}>{item.qtyProduct} pcs</div>
                            <div onClick={() => setRawMaterial(true)} onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(200, 200, 200, 0.2)')} onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')} style={{ ...rowCellStyle, cursor: 'pointer', color: '#00A8A8' }}>Show List</div>
                            <div style={rowCellStyle}>₱{item.totalCost.toLocaleString()}</div>
                            </div>
                        ))}

                        </div>
                            {/* Summary Section */}
                            <div style={{width: '100%', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem',}}>
                            {/* Left: Quantity + Total Cost */}
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent:'center' }}>
                                <div style={{padding: '6px 24px', background: 'white', borderRadius: 20, boxShadow: '0px 4px 7.5px 1px rgba(0, 0, 0, 0.25)', display: 'flex', alignItems: 'center', gap: 10,}}>
                                    <span style={{ fontWeight: 500, color: '#585757' }}>Total Quantity:</span>
                                    <span style={{ fontWeight: 500, color: '#585757' }}>12</span>
                                </div>
                                <div style={{padding: '6px 24px', background: 'white', borderRadius: 20, boxShadow: '0px 4px 7.5px 1px rgba(0, 0, 0, 0.25)', display: 'flex', alignItems: 'center', gap: 10,}}>
                                    <span style={{ fontWeight: 500, color: '#585757' }}>Total Cost of Products:</span>
                                    <span style={{ fontWeight: 500, color: '#585757' }}>₱40,000.80</span>
                                </div>

                                <div style={{padding: '8px 24px', background: 'white', borderRadius: 20, boxShadow: '0px 4px 7.5px 1px rgba(0, 0, 0, 0.25)', display: 'flex', alignItems: 'center', gap: 10,}}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10}}>
                                        <span style={{ fontWeight: 500, color: '#585757' }}>Order No.</span>
                                    <div
                                    style={{padding: '6px 24px', background: '#F5F5F5', borderRadius: 10,fontSize: 16, color: '#585757', fontFamily: 'Inter', fontWeight: 500, }}>000000002</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div
                    style={{width: '100%',  display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto',}}>
                        <button onClick={() => { setIsOpen2(false); setIsOpen(true); }} style={buttonStyle2('#fff')}>
                            <div className="MRPIcon3" style={{ width: 15, height: 21, marginRight: 10 }} />
                            <span style={{ color: '#969696' }}>Back</span>
                        </button>

                        <button onClick={() => { setIsOpen2(false); setAdditionalCost(true); }} style={buttonStyle('#00A8A8', '#00A8A8', 'white')}>
                            <span>Next</span>
                            <div className="MRPIcon5" style={{ width: 13, height: 21, marginLeft: 8 }} />
                        </button>
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
                            <div style={{color: '#D2D2D2', fontSize: 17, fontFamily: 'Inter', fontWeight: '400', wordWrap: 'break-word'}}>000000002</div>
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