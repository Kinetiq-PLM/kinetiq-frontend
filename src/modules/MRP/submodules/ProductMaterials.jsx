import React from "react";
import "../styles/ProductMaterials.css";
import { useState, useEffect } from "react";


const BodyContent = ({loadSubModule, setActiveSubModule}) => {

    const [rawmaterial, setRawMaterial] = useState(false);
    const [flag, setFlag] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [addProduct, setAddProduct] = useState(false);
    const [addRawMaterial, setAddRawMaterial] = useState(false);
    const [editRawMaterial, setEditRawMaterial] = useState(false);
    const [showHelpOptions, setShowHelpOptions] = useState(false);
    const [isProjectType, setIsProjectType] = useState(null);
    const [fetchMrpData, setFetchMrpData] = useState([]);

    const [productId, setProductId] = useState("");
    const [productName, setProductName] = useState("");
    const [productDescription, setProductDescription] = useState("");

    const [newRawMaterial, setNewRawMaterial] = useState("");
    const [newMaterialId, setNewMaterialId] = useState("");
    const [newQuantity, setNewQuantity] = useState("");
    const [newUnits, setNewUnits] = useState("");

    const [editRawMaterial2, setEditRawMaterial2] = useState("");
    const [editMaterialId, setEditMaterialId] = useState("");
    const [editQuantity, setEditQuantity] = useState("");
    const [editUnits, setEditUnits] = useState("");

    const [selectedRowData, setSelectedRowData] = useState(null); 
    const [selectedOrderNo, setSelectedOrderNo] = useState([]);
    const [bomDetails, setBomDetails] = useState([]);
    const [projPro, setProjMats] = useState([]);
    const [principalItems, setPrincipalItems] = useState([]);
    const [npProducts, setNPProducts] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [rawMaterials, setRawMaterials] = useState([]);
    const [mrpData, setMrpData] = useState([]);

    const materialIdOptions = rawMaterials.map(item => item.materialId);

    const [principalOrder, setPrincipalItemOrder] = useState([]);
    const [pnpOrder, setPnpOrder] = useState([]);
    const [prinOrder, setPrincipalOrder] = useState([]);
    const baseurl = "http://127.0.0.1:8000";
    //const baseurl = "https://aw081x7836.execute-api.ap-southeast-1.amazonaws.com/dev"

    useEffect(() => {
        const fetchMrpData = async () => {
            try {
                const response = await fetch(`${baseurl}/product_material/productmaterial/`);
                if (!response.ok) {
                    throw new Error("Failed to fetch Products data");
                }
                const data = await response.json();

                const formattedData = data.map((item) => ({
                    number: item.product_id,
                    type: item.item_name,
                    details: item.item_description,
                }));

                setMrpData(formattedData);
            } catch (error) {
                console.error("Error fetching Products data:", error);
            }
        };

        fetchMrpData();
    }, []);


    const fetchRawMaterials = async (productId) => {
        try {
            const response = await fetch(`${baseurl}/product_material/productrawmaterial/by-product/${productId}/`);
            if (!response.ok) {
                throw new Error("Failed to fetch raw materials");
            }
            const data = await response.json();
            const formattedData = data.map((item) => ({
                rawMaterial: item.item_name,
                materialId: item.material_id,
                rmquantity: item.quantity_required,
                rmunits: item.unit_of_measure,
            }));
    
            setRawMaterials(formattedData);
        } catch (error) {
            console.error("Error fetching raw materials:", error);
        }
    };

    const rawMats = [
        { "product_id": "ADMIN-PROD-2025-a6d292", "raw_material": "Carbon Fiber", "material_id": "ADMIN-MATERIAL-2025-fa9377", "rm_quantity": "80.70", "units": "kg", "unit_cost": "2500.00", "total_cost": "201750.00"},
        { "product_id": "ADMIN-PROD-2025-a6d292", "raw_material": "Hydraulic Oil", "material_id": "ADMIN-MATERIAL-2025-b1aac1", "rm_quantity": "22.22", "units": "kg", "unit_cost": "190.00", "total_cost": "4221.80"},
        { "product_id": "ADMIN-PROD-2025-a6d292", "raw_material": "Medical-Grade Silicone", "material_id": "ADMIN-MATERIAL-2025-23d783", "rm_quantity": "37.77", "units": "kg", "unit_cost": "2932.00", "total_cost": "110741.64"},
        { "product_id": "ADMIN-PROD-2025-a6d292", "raw_material": "Stainless Steel", "material_id": "ADMIN-MATERIAL-2025-37d86c", "rm_quantity": "109.90","units": "kg", "unit_cost": "100.00", "total_cost": "10990.00"}
    ]

    const getFilteredData = () => {
        const term = (searchTerm || "").toLowerCase();
      
        const filterItem = (item) => {
          const number = (item.number || item.serviceOrderItemId || "").toLowerCase();
          const date = (item.date || "").toLowerCase();
          const details = (item.details || item.description || "").toLowerCase();
      
          return (
            number.includes(term) ||
            date.includes(term) ||
            details.includes(term)
          );
        };
      
        const mrpFiltered = (mrpData || []).filter(item => {
          const matchesFlag =
            flag === 0 ||
            (flag === 1 && item.type === "Project") ||
            (flag === 2 && item.type === "Non Project");
          return matchesFlag && filterItem(item);
        });
      
        const principalFiltered = (principalOrder || []).filter(item => {
          const matchesFlag = flag === 0 || flag === 3;
          return matchesFlag && filterItem(item);
        }).map(item => ({
          number: item.serviceOrderItemId,
          type: item.type || "Principal Item",
          details: item.description || "—",
          date: item.date || ""
        }));
      
        return [...mrpFiltered, ...principalFiltered];
        };
      

    const filteredData = getFilteredData();

    const mergedRows2 = getFilteredData()
    .map(item => {
    const number = item.number || "";
    const type = item.type || "Unknown";
    const details = item.details || "—";
    const date = item.date || "";

    const pnpMatch = (pnpOrder || []).find(p => p.pnp_orderID === number);
    const prinMatch = (prinOrder || []).find(p => p.sr_orderID === number);

    const status = (pnpMatch?.pnp_status || prinMatch?.sr_status || "").toLowerCase().trim();

    return {
      number,
      type,
      details,
      date,
      status,
    };
    })
    .filter(item => item.status !== "complete");


    
    const buttonStyle = (bg, border, textColor = '#585757') => ({display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px 20px', borderRadius: 8, background: bg, color: textColor, fontSize: 16, fontWeight: '500', fontFamily: 'Inter', gap: 6, cursor: 'pointer', });
    const buttonStyle2 = (bg, textColor = '#585757') => ({display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px 20px', borderRadius: 8, background: bg, border: '0.5px solid #585757', color: textColor, fontSize: 16, fontWeight: '500', fontFamily: 'Inter', gap: 6, cursor: 'pointer',});
    const rowCellStyle = {flex: '1 1 14%', minWidth: 120, padding: '12px', textAlign: 'center', fontFamily: 'Inter', fontSize: 15, color: '#585757'};
    const tdStyle = {padding: '10px 12px', textAlign: 'center', fontSize: 18, color: '#585757', whiteSpace: 'nowrap'};

    const inputStyle = {
        background: '#F5F5F5',
        borderRadius: 10,
        outline: '1.5px solid #E5E5E5',
        padding: '10px',
        width: 290, 
        fontSize: 17,
        fontFamily: 'Inter',
        fontWeight: 400,
        color: '#585757',
        overflow: 'hidden',
    };

    useEffect(() => {
        if (!editRawMaterial) {
            setEditMaterialId("");
            setEditRawMaterial2("");
            setEditQuantity("");
            setEditUnits("");
        }
    }, [editRawMaterial]);

    return (      
        <div className="mats">
            <div style={{width: '100%', height: '100%', padding: '2rem', background: 'white', boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.08)', overflow: 'hidden', borderRadius: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', rowGap: 25,}}>
                <div className="title">PRODUCT MATERIALS</div>
                <div style={{width: '100%', maxWidth: 1300, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', rowGap: 10,paddingLeft: 80, paddingRight: 80,}}>
                    <div className="tabs-container" style={{ display: 'flex', flexWrap: 'wrap', gap: 15,flex: '1 1 auto', minWidth: 200,}}>
                        {['All Products'].map((label, i) => (
                        <div key={label}
                            onClick={() => {setFlag(i), setFlagType(i)}}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(200, 200, 200, 0.1)")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                            style={{ minWidth: 120, padding: '10px 16px', background: 'white', boxShadow: flag === i ? '0px -2px 0px #00A8A8 inset' : '0px -1px 0px #E8E8E8 inset', justifyContent: 'center', alignItems: 'center', display: 'flex', cursor: 'pointer'
                            }}>
                            <div className="text-tab" style={{textAlign: 'center', color: flag === i ? '#00A8A8' : '#585757', fontSize: 16, fontFamily: 'Inter', fontWeight: '500', lineHeight: 1}}>{label}</div>
                        </div>
                        ))}

                        <button onClick={() => { setAddProduct(true) }} style={buttonStyle('#00A8A8', '#00A8A8', 'white')}>
                                <span style={{paddingLeft: 10,paddingRight: 10 }}>Add Product</span>
                        </button>
                    </div>
    
                    <div className="search-container" style={{background: '#F7F9FB', borderRadius: 8, outline: '1px rgba(132,132,132,0.25) solid', padding: 5, display: 'flex', marginTop: 10, paddingRight: 100, alignItems: 'stretch',}}>
                        <input placeholder="Search Product ID..." type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{flex: 1, padding: '8px', border: 'none', outline: 'none', backgroundColor: 'transparent', color: '#969696', fontSize: 16, fontFamily: 'Inter'}}/>
                    </div>
                </div>

                <div className="reqplan-table-scroll" style={{width: '100%', maxWidth: 1159, background: 'white', boxShadow: '0px 4px 7.5px 1px rgba(0, 0, 0, 0.25)', overflowY: 'auto', maxHeight: '450px', borderRadius: 20, display: 'flex', flexDirection: 'column', gap: 0, padding: '1rem'}}>
                    <div className="table-header" style={{display: 'flex', flexWrap: 'wrap', borderBottom: '1px solid #E8E8E8'}}>
                        {['Product ID', 'Product', 'Product Description', 'Raw Materials'].map((label) => (
                            <div className="table-cell2" key={label} data-label={label} style={{flex: '1 1 25%', minWidth: 150, padding: '12px', fontWeight: 700, textAlign: 'center', color: '#585757', fontFamily: 'Inter', fontSize: 18}}>{label}</div>
                        ))}
                    </div>
                    {mrpData.map((item, index) => (
                        <div key={index} className="table-row" onClick={() => {setSelectedRowData(item);setIsOpen(true);}} onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(200, 200, 200, 0.2)")} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")} style={{display: "flex", flexWrap: "wrap", cursor: "pointer", borderBottom: "1px solid #E8E8E8"}}>
                            <div className="table-cell" style={rowCellStyle} data-label="Product ID">{item.number}</div>
                            <div className="table-cell" style={rowCellStyle} data-label="Product">{item.type}</div>
                            <div className="table-cell" style={rowCellStyle} data-label="Product Description">{item.details || '—'}</div>
                            <div className="table-cell" data-label="Raw Materials" onClick={() => {fetchRawMaterials(item.number);setRawMaterial(true);}} style={{ ...rowCellStyle, cursor: 'pointer', color: '#00A8A8' }}>Show List</div>
                        </div>
                    ))}
                </div>
            </div>

            {rawmaterial && (
            <div className="bom-print-modal2 fixed inset-0 flex items-center justify-center z-50 px-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.25)' }}>
                <div style={{width: 967, maxHeight: '90vh', background: 'white', boxShadow: '0px 4px 7.5px 1px rgba(0, 0, 0, 0.25)', borderRadius: 10, display: 'flex', flexDirection: 'column', padding: '25px 20px', overflow: 'hidden', position: 'relative',}}>
                    <div style={{width: '100%', textAlign: 'center', color: '#130101', fontSize: 35, fontFamily: 'Inter',fontWeight: '400', textTransform: 'capitalize', letterSpacing: 1.4, marginBottom: 25}}>List of Raw Materials</div>
                    <div className="reqplan-table-scroll2" style={{flex: 1, overflowY: 'auto', overflowX: 'auto', marginBottom: 30, borderRadius: 20, boxShadow: '0px 4px 7.5px 1px rgba(0, 0, 0, 0.15)', padding: 0}}>
                        <div style={{width: '100%', flex: 1, background: 'white', borderRadius: 20, display: 'flex', flexDirection: 'column', gap: 0, padding: '0.5rem'}}>
                            <div className="table-header" style={{display: 'flex', flexWrap: 'wrap', borderBottom: '1px solid #E8E8E8'}}>
                            {['Raw Material', 'Material ID', 'Quantity', 'Units'].map((label) => (
                                <div key={label} style={{flex: '1 1 14%', minWidth: 120, padding: '12px', fontWeight: 700, textAlign: 'center', color: '#585757', fontFamily: 'Inter', fontSize: 16}}>{label}</div>
                            ))}
                            </div>

                            {rawMaterials.map((item, idx) => (
                            <div key={idx} className="table-row" style={{display: 'flex', flexWrap: 'wrap', borderBottom: '1px solid #E8E8E8', padding: '12px 0'}}>
                                <div className="table-cell" style={rowCellStyle} data-label="Raw Material">{item.rawMaterial}</div>
                                <div className="table-cell" style={rowCellStyle} data-label="Material ID">{item.materialId}</div>
                                <div className="table-cell" style={rowCellStyle} data-label="Quantity">{item.rmquantity}</div>
                                <div className="table-cell" style={rowCellStyle} data-label="Units">{item.rmunits}</div>
                            </div>
                            ))}
                        </div>
                    </div>

                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12,width: '100%'}}>
                        <div style={{width: '100%', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem',}}>
                            <button onClick={() => { setAddRawMaterial(true) }} style={buttonStyle('#00A8A8', '#00A8A8', 'white')}>
                                    <span style={{paddingLeft: 10,paddingRight: 10 }}>Add Raw Material</span>
                            </button>

                            <button onClick={() => { setEditRawMaterial(true); }} style={buttonStyle('#00A8A8', '#00A8A8', 'white')}>
                                <span style={{paddingLeft: 10,paddingRight: 10 }}>Edit Raw Material</span>
                            </button>
                        </div>

                        <button onClick={() => { setRawMaterial(false); setSelectedProductId(null); }} style={{height: 40, padding: '8px 24px', background: 'white', borderRadius: 8, outline: '1.5px #A4A4A4 solid', display: 'flex', alignItems: 'center', gap: 10}}>
                            <div className="MRPIcon3" style={{ width: 15, height: 21 }} />
                            <span style={{ color: '#969696', fontSize: 20, fontFamily: 'Inter', fontWeight: '500', textTransform: 'capitalize'}}>Back</span>
                        </button>
                    </div>
                </div>
            </div>
            )}

            {addProduct && (
            <div className="bom-print-modal2 fixed inset-0 z-50 flex items-center justify-center px-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.25)' }}>
                <div className="modal-inner mats"
                style={{
                    width: '100%',
                    maxWidth: 480,
                    background: 'white',
                    boxShadow: '0px 4px 7.5px 1px rgba(0, 0, 0, 0.25)',
                    borderRadius: 10,
                    padding: '2rem 2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'stretch',
                    gap: 24
                }}
                >
                <div style={{ textAlign: 'center', fontSize: 32, fontWeight: 700, fontFamily: 'Inter', letterSpacing: 1.5, color: '#130101' }}>
                    Add Product
                </div>

                <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'center', width: '100%' }}>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%', maxWidth: 320 }}>
                        <label style={{ fontWeight: 500, fontSize: 16, color: '#585757' }}>Product ID:</label>
                        <input type="text" value={productId} onChange={(e) => setProductId(e.target.value)} style={{ ...inputStyle, width: '100%' }} />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%', maxWidth: 320 }}>
                        <label style={{ fontWeight: 500, fontSize: 16, color: '#585757' }}>Product:</label>
                        <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} style={{ ...inputStyle, width: '100%' }} />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%', maxWidth: 320 }}>
                        <label style={{ fontWeight: 500, fontSize: 16, color: '#585757' }}>Product Description:</label>
                        <textarea value={productDescription} onChange={(e) => setProductDescription(e.target.value)} style={{ ...inputStyle, width: '100%', height: 100, resize: 'none' }} />
                        </div>

                    </div>
                </div>




                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                    <button onClick={() => setAddProduct(false)} style={buttonStyle2('#fff', '#A4A4A4')}>
                    <div className="MRPIcon3" style={{ width: 15, height: 21, marginRight: 10 }} />
                    <span style={{ color: '#969696' }}>Close</span>
                    </button>
                    <button style={buttonStyle('#00A8A8', '#00A8A8', 'white')}>
                    <span>Add</span>
                    <div className="MRPIcon5" style={{ width: 13, height: 21, marginLeft: 8 }} />
                    </button>
                </div>
                </div>
            </div>
            )}

            {addRawMaterial && (
            <div className="bom-print-modal2 fixed inset-0 z-50 flex items-center justify-center px-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.25)' }}>
                <div className="modal-inner mats" style={{ width: '100%', maxWidth: 480, height: 590,  background: 'white', boxShadow: '0px 4px 7.5px 1px rgba(0, 0, 0, 0.25)', borderRadius: 10, padding: '2rem 2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'stretch', gap: 24 }}>
                <div style={{ textAlign: 'center', fontSize: 32, fontWeight: 700, fontFamily: 'Inter', letterSpacing: 1.5, color: '#130101', marginBottom:10}}>
                    Add Raw Material
                </div>

                <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'center', width: '100%' }}>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%', maxWidth: 320 }}>
                        <label style={{ fontWeight: 500, fontSize: 16, color: '#585757' }}>Raw Material:</label>
                        <input type="text" value={newRawMaterial} onChange={(e) => setNewRawMaterial(e.target.value)} style={{ ...inputStyle, width: '100%' }} />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%', maxWidth: 320 }}>
                        <label style={{ fontWeight: 500, fontSize: 16, color: '#585757' }}>Material ID:</label>
                        <input type="text" value={newMaterialId} onChange={(e) => setNewMaterialId(e.target.value)} style={{ ...inputStyle, width: '100%' }} />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%', maxWidth: 320 }}>
                        <label style={{ fontWeight: 500, fontSize: 16, color: '#585757' }}>Quantity:</label>
                        <input type="text" value={newQuantity} onChange={(e) => setNewQuantity(e.target.value)} style={{ ...inputStyle, width: '100%' }} />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%', maxWidth: 320 }}>
                        <label style={{ fontWeight: 500, fontSize: 16, color: '#585757' }}>Units:</label>
                        <input type="text" value={newUnits} onChange={(e) => setNewUnits(e.target.value)} style={{ ...inputStyle, width: '100%' }} />
                        </div>

                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginTop: 20, }}>
                    <button onClick={() => setAddRawMaterial(false)} style={buttonStyle2('#fff', '#A4A4A4')}>
                    <div className="MRPIcon3" style={{ width: 15, height: 21, marginRight: 10 }} />
                    <span style={{ color: '#969696' }}>Close</span>
                    </button>
                    <button style={buttonStyle('#00A8A8', '#00A8A8', 'white')}>
                    <span>Add</span>
                    <div className="MRPIcon5" style={{ width: 13, height: 21, marginLeft: 8 }} />
                    </button>
                </div>
                </div>
            </div>
            )}


            {editRawMaterial && (
            <div className="bom-print-modal2 fixed inset-0 z-50 flex items-center justify-center px-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.25)' }}>
                <div className="modal-inner mats" style={{ width: '100%', maxWidth: 480, height: 590,  background: 'white', boxShadow: '0px 4px 7.5px 1px rgba(0, 0, 0, 0.25)', borderRadius: 10, padding: '2rem 2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'stretch', gap: 24 }}>
                <div style={{ textAlign: 'center', fontSize: 32, fontWeight: 700, fontFamily: 'Inter', letterSpacing: 1.5, color: '#130101', marginBottom:10}}>
                    Edit Raw Material
                </div>

                <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'center', width: '100%' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%', maxWidth: 320 }}>
                        <label style={{ fontWeight: 500, fontSize: 16, color: '#585757' }}>Material ID:</label>
                        <select
                        value={editMaterialId}
                        onChange={(e) => {
                            const selectedId = e.target.value;
                            setEditMaterialId(selectedId);
                            
                            const selectedMaterial = rawMaterials.find(item => item.materialId === selectedId);
                            if (selectedMaterial) {
                                setEditRawMaterial2(selectedMaterial.rawMaterial);
                                setEditQuantity(selectedMaterial.rmquantity);
                                setEditUnits(selectedMaterial.rmunits);
                            }
                        }}
                        style={{...inputStyle, width: '100%', appearance: 'none', backgroundColor: '#F5F5F5', borderRadius: 10, outline: '1.5px solid #E5E5E5', padding: '10px', fontSize: 17, fontFamily: 'Inter', fontWeight: 400, color: '#585757', cursor: 'pointer'}}>
                        <option value="">Select Material ID</option>
                        {materialIdOptions.map((id, index) => (
                            <option key={index} value={id}>
                            {id}
                            </option>
                        ))}
                        </select>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%', maxWidth: 320 }}>
                        <label style={{ fontWeight: 500, fontSize: 16, color: '#585757' }}>Raw Material:</label>
                        <input type="text" value={editRawMaterial2} onChange={(e) => setEditRawMaterial2(e.target.value)} style={{ ...inputStyle, width: '100%' }} />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%', maxWidth: 320 }}>
                        <label style={{ fontWeight: 500, fontSize: 16, color: '#585757' }}>Quantity:</label>
                        <input type="text" value={editQuantity} onChange={(e) => setEditQuantity(e.target.value)} style={{ ...inputStyle, width: '100%' }} />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%', maxWidth: 320 }}>
                        <label style={{ fontWeight: 500, fontSize: 16, color: '#585757' }}>Units:</label>
                        <input type="text" value={editUnits} onChange={(e) => setEditUnits(e.target.value)} style={{ ...inputStyle, width: '100%' }} />
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginTop: 20, }}>
                    <button onClick={() => setEditRawMaterial(false)} style={buttonStyle2('#fff', '#A4A4A4')}>
                    <div className="MRPIcon3" style={{ width: 15, height: 21, marginRight: 10 }} />
                    <span style={{ color: '#969696' }}>Close</span>
                    </button>
                    <button style={buttonStyle('#00A8A8', '#00A8A8', 'white')}>
                    <span>Edit</span>
                    <div className="MRPIcon5" style={{ width: 13, height: 21, marginLeft: 8 }} />
                    </button>
                </div>
                </div>
            </div>
            )}



        </div>
    );
};

export default BodyContent;