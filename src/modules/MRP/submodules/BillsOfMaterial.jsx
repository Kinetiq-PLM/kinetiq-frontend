import React from "react";
import "../styles/BillsOfMaterial.css";
import { useState, useEffect } from "react";

const BodyContent = ({loadSubModule, setActiveSubModule}) => {
    const [flag, setFlag] = useState(0);
    const [printBOM, setPrintBOM] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const [bomData, setBomData] = useState([]);
    const [bomDetails, setBomDetails] = useState([]);
    const [bomCostDetails, setBomCostDetails] = useState({
        rawMaterial: 0,
        subtotal: 10000,
        production: 40000.80,
        labor: 40000.80,
        total: 90001.60,
    });

    useEffect(() => {
        const fetchBomData = async () => {
            try {
                const response = await fetch("https://bmd9yddtah.execute-api.ap-southeast-1.amazonaws.com/dev/bills_of_material/bomlist/"); // Replace with your API endpoint
                if (!response.ok) {
                    throw new Error("Failed to fetch BOM data");
                }
                const data = await response.json();

                const formattedData = data.map((item) => ({
                    number: item.bom_no,
                    type: item.type,
                    status: item.status,
                    date: new Date(item.date_created).toLocaleDateString(),
                }));

                setBomData(formattedData);
            } catch (error) {
                console.error("Error fetching BOM data:", error);
            }
        };

        fetchBomData();
    }, []);

    useEffect(() => {
        const fetchBomDetails = async () => {
            try {
                const response = await fetch("https://bmd9yddtah.execute-api.ap-southeast-1.amazonaws.com/dev/bills_of_material/product-costs/");
                if (!response.ok) {
                    throw new Error("Failed to fetch BOM details");
                }
                const data = await response.json();

                const formattedData = data.map((item, index) => ({
                    no: index + 1,
                    product: item.product || "N/A",
                    qtyProduct: item.quantity_of_product || "N/A",
                    rawMaterial: item.raw_material || "N/A",
                    qtyRawMaterial: item.quantity_of_raw_material || "N/A",
                    unit: item.unit_of_measure || "N/A",
                    costPerUnit: parseFloat(item.cost_per_raw_material),
                    totalCost: parseFloat(item.total_cost_of_raw_materials),
                }));

                setBomDetails(formattedData);
                const totalRawMaterialCost = formattedData.reduce((sum, item) => sum + item.totalCost, 0);

                setBomCostDetails((prevDetails) => ({
                    ...prevDetails,
                    rawMaterial: totalRawMaterialCost,
                }));
            } catch (error) {
                console.error("Error fetching BOM details:", error);
            }
        };

        fetchBomDetails();
    }, []);

    // const bomData = [
    //     { number: "000000001", type: "Project", status: "Pending", date: "July 3 2025" },
    //     { number: "000000002", type: "Non Project", status: "Approved", date: "July 3 2025" },

    // ];
    // const bomDetails = [
    //     { no: 1, product: "Apple", qtyProduct: 100, rawMaterial: "Sugar", qtyRawMaterial: 50, unit: "kg", costPerUnit: 120, totalCost: 600, bomId: "BOM001", projectId: "PRJ001", productMatsId: "MAT001", productionOrderDetailId: "POD001", laborCostId: "LAB001"},
    //     { no: 2, product: "Apple", qtyProduct: 200, rawMaterial: "Starch", qtyRawMaterial: 80, unit: "kg", costPerUnit: 100, totalCost: 800, bomId: "BOM002", projectId: "PRJ002", productMatsId: "MAT002", productionOrderDetailId: "POD002",laborCostId: "LAB002"},
    //     { no: 3, product: "Apple", qtyProduct: 100, rawMaterial: "Sugar", qtyRawMaterial: 50, unit: "kg", costPerUnit: 120, totalCost: 600, bomId: "BOM003", projectId: "PRJ001", productMatsId: "MAT003", productionOrderDetailId: "POD003", laborCostId: "LAB003"},
    //     { no: 4, product: "Apple", qtyProduct: 200, rawMaterial: "Starch", qtyRawMaterial: 80, unit: "kg", costPerUnit: 100, totalCost: 800, bomId: "BOM004", projectId: "PRJ002", productMatsId: "MAT004", productionOrderDetailId: "POD004", laborCostId: "LAB004"}
    // ];

    // const bomCostDetails = {
    //     rawMaterial: 40000.80,
    //     subtotal: 10000,
    //     production: 40000.80,
    //     labor: 40000.80,
    //     total: 90001.60
    // };

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
            <div style={{width: '100%', height: '100%', padding: '2rem', background: 'white', boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.08)', overflow: 'hidden', borderRadius: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', rowGap: 25,}}>
                <div className="title">BILLS OF MATERIAL LIST</div>
                <div style={{width: '100%', maxWidth: 1300, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', rowGap: 10,paddingLeft: 80, paddingRight: 80,}}>
                    <div className="tabs-container" style={{ display: 'flex', flexWrap: 'wrap', gap: 15,flex: '1 1 auto', minWidth: 200,}}>
                        {['All BOM', 'Project BOM', 'Non-Project BOM'].map((label, i) => (
                        <div key={label}
                            onClick={() => {setFlag(i), setFlagType(i)}}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(200, 200, 200, 0.1)")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                            style={{ minWidth: 120, padding: '10px 16px', background: 'white', boxShadow: flag === i ? '0px -2px 0px #00A8A8 inset' : '0px -1px 0px #E8E8E8 inset', justifyContent: 'center', alignItems: 'center', display: 'flex', cursor: 'pointer'
                            }}>
                            <div className="text-tab" style={{textAlign: 'center', color: flag === i ? '#00A8A8' : '#585757', fontSize: 16, fontFamily: 'Inter', fontWeight: '500', lineHeight: 1}}>{label}</div>
                        </div>
                        ))}
                    </div>

                    <div className="search-container" style={{background: '#F7F9FB', borderRadius: 8, outline: '1px rgba(132,132,132,0.25) solid', padding: 5, display: 'flex', marginTop: 10, paddingRight: 100, alignItems: 'stretch',}}>
                        <input placeholder="Search Order Number..." type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{flex: 1, padding: '8px', border: 'none', outline: 'none', backgroundColor: 'transparent', color: '#969696', fontSize: 16, fontFamily: 'Inter'}}/>
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
                    {['Bom No.', 'Type', 'Status', 'Created Date'].map((label, i) => (
                        <div
                            className="table-cell2"
                            key={label}
                            data-label={label}
                            style={{flex: '1 1 25%', minWidth: 150, padding: '12px', fontWeight: 700, textAlign: 'center', color: '#585757', fontFamily: 'Inter', fontSize: 18}}>
                            {label}
                        </div>
                    ))}
                </div>

                {/* Rows */}
                {filteredData.map((item, index) => (
                    <div
                    className="table-row"
                    key={index}
                    onClick={() => setPrintBOM(true)}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(200, 200, 200, 0.2)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    style={{display: 'flex', flexWrap: 'wrap', cursor: 'pointer', borderBottom: '1px solid #E8E8E8',}}>
                    {[item.number, item.type, item.status, item.date].map((val, idx) => (
                        <div
                            className="table-cell"
                            key={idx}
                            data-label={['Order No.', 'Type', 'Status', 'Date'][idx]}
                            style={{flex: '1 1 25%', minWidth: 150, padding: '12px', textAlign: 'center', fontFamily: 'Inter', fontSize: 16, color: '#585757'}}>
                            {val}
                        </div>
                    ))}
                    </div>
                ))}
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
                                <div style={{left: 521, top: 184, position: 'absolute', color: '#1C1C1C', fontSize: 25, fontFamily: 'Inter', fontWeight: '700', textTransform: 'capitalize', lineHeight: '16px', wordWrap: 'break-word'}}>Seller’s Information</div>
                                <div style={{width: 329, left: 316, top: 238, position: 'absolute', color: '#111111', fontSize: 18, fontFamily: 'Inter', fontWeight: '400', lineHeight: '20px', wordWrap: 'break-word'}}><b>Company Name: </b>Kinetiq</div>
                                <div style={{width: 344, left: 316, top: 293, position: 'absolute', color: '#111111', fontSize: 18, fontFamily: 'Inter', fontWeight: '400', lineHeight: '20px', wordWrap: 'break-word'}}><b>Address: </b>1975 Address of Company St.</div>
                                <div style={{width: 220, left: 716, top: 239, position: 'absolute', color: '#111111', fontSize: 18, fontFamily: 'Inter', fontWeight: '400', lineHeight: '20px', wordWrap: 'break-word'}}><b>City: </b>Metro Manila</div>
                                <div style={{width: 223, left: 316, top: 345, position: 'absolute', color: '#111111', fontSize: 18, fontFamily: 'Inter', fontWeight: '400', lineHeight: '20px', wordWrap: 'break-word'}}><b>Country: </b>Philippines</div>
                                <div style={{width: 324, left: 716, top: 292, position: 'absolute', color: '#111111', fontSize: 18, fontFamily: 'Inter', fontWeight: '400', lineHeight: '20px', wordWrap: 'break-word'}}><b>Contact Number.: </b>09123456789</div>
                                <div style={{width: 324, left: 716, top: 345, position: 'absolute', color: '#111111', fontSize: 18, fontFamily: 'Inter', fontWeight: '400', lineHeight: '20px', wordWrap: 'break-word'}}><b>Email Address: </b>kinetiq@gmail.com</div>
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




    