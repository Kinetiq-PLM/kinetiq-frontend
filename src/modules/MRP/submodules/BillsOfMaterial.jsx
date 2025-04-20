import React from "react";
import "../styles/BillsOfMaterial.css";
import { useState, useEffect } from "react";

const BodyContent = ({loadSubModule, setActiveSubModule}) => {
    const [flag, setFlag] = useState(0);
    const [printBOM, setPrintBOM] = useState(false);
    const [printBOM2, setPrintBOM2] = useState(false);
    const [printBOM3, setPrintBOM3] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRowData, setSelectedRowData] = useState(null);
    const [principalOrder, setPrincipalItemOrder] = useState([]);
    const [pnpOrder, setPnpOrder] = useState([]);
    const [prinOrder, setPrincipalOrder] = useState([]);
    const [projectId, setProjectID] = useState([]);

    const baseurl = "http://127.0.0.1:8000";
    //const baseurl = "https://aw081x7836.execute-api.ap-southeast-1.amazonaws.com/dev"

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
                const response = await fetch(`${baseurl}/bills_of_material/orderlist/`);
                if (!response.ok) {
                    throw new Error("Failed to fetch BOM data");
                }
                const data = await response.json();

                const formattedData = data.map((item) => ({
                    number: item.order_no,
                    type: item.type,
                    date: item.date.trim(),
                }));

                setBomData(formattedData);
            } catch (error) {
                console.error("Error fetching BOM data:", error);
            }
        };

        fetchBomData();
    }, []);

    useEffect(() => {
            const fetchServiceOrderItems = async () => {
                try {
                    const response = await fetch(`${baseurl}/bills_of_material/principalorders/`);
                    if (!response.ok) {
                        throw new Error("Failed to fetch service order items");
                    }
                    const data = await response.json();
            
                    const formattedData = data.map((item) => ({
                        serviceOrderItemId: item.service_order_item_id,
                        type: item.type,
                        description: item.description,
                        date: item.date.trim(),
                    }));
            
                    setPrincipalItemOrder(formattedData);
                } catch (error) {
                    console.error("Error fetching service order items:", error);
                }
            };
            fetchServiceOrderItems();
    }, []);

    useEffect(() => {
        const fetchBomDetails = async () => {
            try {
                const response = await fetch(`${baseurl}/bills_of_material/product-costs/`);
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

    useEffect(() => {
        const fetchOrderPnp = async () => {
            try {
                const response = await fetch(`${baseurl}/bills_of_material/trackingnpop/`);
                if (!response.ok) throw new Error("Failed to fetch Project/Non-Project statuses");
                const data = await response.json();
                const formattedData = data.map(item => ({
                    pnp_orderID: item.order_id,
                    pnp_status: item.status
                }));
                setPnpOrder(formattedData);
            } catch (error) {
                console.error("Error fetching Project/Non-Project statuses:", error);
            }
        };
        fetchOrderPnp();
    }, []);
    
    useEffect(() => {
        const fetchPrincipalOrder = async () => {
            try {
                const response = await fetch(`${baseurl}/bills_of_material/trackingprincipal/`);
                if (!response.ok) throw new Error("Failed to fetch Principal statuses");
                const data = await response.json();
                const formattedData = data.map(item => ({
                    sr_orderID: item.service_order_item_id,
                    sr_status: item.status
                }));
                setPrincipalOrder(formattedData);
            } catch (error) {
                console.error("Error fetching Principal statuses:", error);
            }
        };
        fetchPrincipalOrder();
    }, []);

    const fetchProjectID = async (orderId) => {
        try {
            const response = await fetch(`${baseurl}/bills_of_material/orderproductioncost/${orderId}/`);
            if (!response.ok) {
                throw new Error("Failed to fetch project id");
            }
            const data = await response.json();
            const formattedData = data.map((item) => ({
                projectID: item.project_id,
            }));
    
            setProjectID(formattedData);
            
        } catch (error) {
            console.error("Error fetching production costs:", error);
        }
    };

    const fetchOrderStatement = async (orderId) => {
        try {
            const response = await fetch(`${baseurl}/bills_of_material/orderstatements/by-order/${orderId}/`); // Replace with your API endpoint
            if (!response.ok) {
                throw new Error("Failed to fetch order statements");
            }
            const data = await response.json(); 
            const statementIds = data.map((item) => item.statement_id);

            console.log(statementIds);

            if (statementIds.length > 0) {
                fetchBomDetails(statementIds[0]);
                fetchNonProjectProduct(statementIds[0])
                fetchProjectProductMats(statementIds[0])
            } else {
                console.warn("No statement IDs found.");
            }

            setSelectedOrderNo(statementIds);
        } catch (error) {
            console.error("Error fetching Order Statements", error);
        }
    };
    
    const fetchCostProduction = async (orderId) => {
    try {
        const response = await fetch(`${baseurl}/bills_of_material/orderproductioncost/${orderId}/`);
        if (!response.ok) {
            throw new Error("Failed to fetch production costs");
        }
        const data = await response.json();
        const formattedData = data.map((item) => ({
            productioncost: parseFloat(item.cost_of_production),
        }));

        setCostOfProduction(formattedData);

        const totalCost = formattedData.reduce((sum, item) => sum + item.productioncost, 0);
        setTotalCostOfProduction(totalCost);
        
    } catch (error) {
        console.error("Error fetching production costs:", error);
    }
    };

    const fetchCostLabor = async (orderId) => {
    try {
        const response = await fetch(`${baseurl}/bills_of_material/employeeorder/${orderId}/`);
        if (!response.ok) {
            throw new Error("Failed to fetch employee order");
        }
        const data = await response.json();
        const formattedData = data.map((item) => ({
            days_worked: item.days_worked,
            daily_rate: parseFloat(item.daily_rate)
        }));

        const totalCost = formattedData.reduce(
            (sum, item) => sum + item.days_worked * item.daily_rate,
            0
        );

        setTotalLaborCost(totalCost);
        
    } catch (error) {
        console.error("Error fetching labor costs:", error);
    }
    };

    const fetchPrincipalDetails = async (serviceorderID) => {
        try {
            const response = await fetch(`${baseurl}/bills_of_material/principalitemorder/by-serviceid/${serviceorderID}/`);
            if (!response.ok) {
                throw new Error("Failed to fetch BOM details");
            }
            const data = await response.json();

            const formattedData = data.map((item, index) => ({
                no: index + 1,
                prin_material_id: item.material_id,
                prin_uom: item.unit_of_measure,
                prin_item_name: item.item_name,
                prin_item_id: item.item_id,
                prin_quantity: item.item_quantity,
                prin_itemcost: parseFloat(item.item_price),
                prin_totalitemcost: parseFloat(item.total_item_price)
            }));

            setPrincipalItems(formattedData);
        } catch (error) {
            console.error("Error fetching BOM details:", error);
        }
    };


    const cellStyle = (width) => ({
        width, alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0)', borderLeft: '1px #E8E8E8 solid', borderTop: '1px #E8E8E8 solid', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px 12px', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: 400, textAlign: 'center', lineHeight: 1, wordWrap: 'break-word'
    });

    const getFilteredData = () => {
        return bomData.filter((item) => {
          const matchesFlag =
            flag === 0 ||
            (flag === 1 && item.type === "Project Based") ||
            (flag === 2 && item.type === "Non-Project Based") ||
            (flag === 3 && item.type === "Principal Items Based");
      
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

    function printBOMContent() {
        const printContents = document.getElementById("printable-bom").innerHTML;
        const originalContents = document.body.innerHTML;
        const originalScroll = window.scrollY;
      
        // Set body content to the printable section
        document.body.innerHTML = printContents;
      
        // Optional: Set print-safe styles manually here if needed
        document.body.style.margin = "0";
        document.body.style.padding = "0";
        document.body.style.overflow = "visible";
        
      
        // Delay print to allow DOM re-render
        setTimeout(() => {
          window.print();
      
          // Restore the original document
          document.body.innerHTML = originalContents;
          window.scrollTo(0, originalScroll); // Restore scroll position
          window.location.reload()
        }, 200); // 200ms delay to let DOM reflow before printing
    }
    
    const mergedRows2 = (
  flag === 0
    ? [...(filteredData || []), ...(principalOrder || [])]
    : flag === 3
    ? principalOrder
    : filteredData
)
  .map(item => {
    const number = item.number || item.serviceOrderItemId;
    const type = item.type;
    const details = item.details || item.description;
    const date = item.date;

    const pnpMatch = pnpOrder.find(p => p.pnp_orderID === number);
    const prinMatch = prinOrder.find(p => p.sr_orderID === number);

    const pnpStatus = pnpMatch?.pnp_status?.toLowerCase().trim();
    const prinStatus = prinMatch?.sr_status?.toLowerCase().trim();

    const isComplete = pnpStatus === "complete" || prinStatus === "complete";

    return {
      number,
      type,
      details,
      date,
      status: isComplete ? "Complete" : "", // Use capital "C" for display
    };
  })
  .filter(item => item.status === "Complete");

    const rowCellStyle = {
        flex: "1 1 25%",
        minWidth: 150,
        padding: "12px",
        textAlign: "center",
        fontFamily: "Inter",
        fontSize: 16,
        color: "#585757",
    };

    return (
        <div className="bom">
            <div style={{width: '100%', height: '100%', padding: '2rem', background: 'white', boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.08)', overflow: 'hidden', borderRadius: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', rowGap: 25,}}>
                <div className="title">BILLS OF MATERIAL LIST</div>
                <div style={{width: '100%', maxWidth: 1300, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', rowGap: 10,paddingLeft: 80, paddingRight: 80,}}>
                    <div className="tabs-container" style={{ display: 'flex', flexWrap: 'wrap', gap: 15,flex: '1 1 auto', minWidth: 200,}}>
                        {['All BOM', 'Project BOM', 'Non-Project BOM', 'Principal Items BOM'].map((label, i) => (
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
                    {['Order No.', 'Type', 'Created Date'].map((label, i) => (
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
                {mergedRows2
                    .filter(item => (item.status || "").toLowerCase().trim() === "complete")
                    .map((item, index) => (
                        <div
                        key={index}
                        className="table-row"
                        onClick={() => {
                            setSelectedRowData(item);
                            if (item.type === "Project Based") {
                            setPrintBOM(true);
                            } else if (item.type === "Non-Project Based") {
                            setPrintBOM2(true);
                            } else {
                            setPrintBOM3(true);
                            }
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(200, 200, 200, 0.2)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            cursor: "pointer",
                            borderBottom: "1px solid #E8E8E8",
                        }}
                        >
                        <div className="table-cell" style={rowCellStyle} data-label="Order No.">
                            {item.number}
                        </div>
                        <div className="table-cell" style={rowCellStyle} data-label="Type">
                            {item.type}
                        </div>
                        <div className="table-cell" style={rowCellStyle} data-label="Date">
                            {item.date}
                        </div>
                        </div>
                    ))}
                </div>
            </div>


            {printBOM && (
                <div id="printable-bom" className="bom-print-modal" onClick={(e) => e.stopPropagation()}>
                    <div className="bom-print-content" onClick={(e) => e.stopPropagation()}>
                        <div className="scroll-container" style={{maxHeight: '90vh', overflowY: 'auto'}}>
                            <div style={{width: 1128, position: 'relative', background: 'white'}}>
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
                                {selectedRowData && (
                                <div>
                                    {/* Left Labels */}
                                    <div style={{width: 135, left: 139, top: 473, position: 'absolute', color: '#1C1C1C', fontSize: 20, fontFamily: 'Inter', fontWeight: '700', textTransform: 'capitalize', lineHeight: 1, wordWrap: 'break-word'}}>Order No.</div>
                                    <div style={{width: 135, left: 139, top: 516, position: 'absolute', color: '#1C1C1C', fontSize: 20, fontFamily: 'Inter', fontWeight: '700', textTransform: 'capitalize', lineHeight: 1, wordWrap: 'break-word'}}>Date Created</div>

                                    {/* Left Data */}
                                    <div style={{width: 250, height: 16, left: 280, top: 472, position: 'absolute', textAlign: 'right', color: '#111111', fontSize: 20, fontFamily: 'Inter', fontWeight: '400', lineHeight: 1, wordWrap: 'break-word'}}>{selectedRowData.number}</div>
                                    <div style={{width: 144, left: 385, top: 515, position: 'absolute', textAlign: 'right', color: '#111111', fontSize: 20, fontFamily: 'Inter', fontWeight: '400', lineHeight: 1, wordWrap: 'break-word'}}>{selectedRowData.date}</div>

                                    {/* Right Labels */}
                                    <div style={{width: 135, left: 700, top: 473, position: 'absolute', color: '#1C1C1C', fontSize: 20, fontFamily: 'Inter', fontWeight: '700', textTransform: 'capitalize', lineHeight: 1, wordWrap: 'break-word'}}>Type</div>


                                    {/* Right Data */}
                                    <div style={{width: 250, left: 740, top: 472, position: 'absolute', textAlign: 'right', color: '#111111', fontSize: 20, fontFamily: 'Inter', fontWeight: '400', lineHeight: 1, wordWrap: 'break-word'}}>{selectedRowData.type}</div>
                                   
                                </div>
                                )}

                                
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
                                                <React.Fragment key={index}>
                                                    <div
                                                    className="print-row"
                                                    style={{alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0)', overflow: 'hidden', display: 'inline-flex'}}>
                                                    <div style={cellStyle(82)}>{item.no}</div>
                                                    <div style={cellStyle(145)}>{item.product}</div>
                                                    <div style={cellStyle(96)}>{item.qtyProduct}</div>
                                                    <div style={cellStyle(140)}>{item.rawMaterial}</div>
                                                    <div style={cellStyle(130)}>{item.qtyRawMaterial}</div>
                                                    <div style={cellStyle(87)}>{item.unit}</div>
                                                    <div style={cellStyle(183)}>₱{item.costPerUnit.toLocaleString()}</div>
                                                    <div style={cellStyle(183)}>₱{item.totalCost.toLocaleString()}</div>
                                                    </div>

                                                    {(index + 1) % 3000 === 0 && (
                                                    <div className="print-page-break" style={{ height: 1 }} />
                                                    )}
                                                </React.Fragment>
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
                                </div>
                                <div style={{width: '100%', marginTop: 30, display: 'flex', justifyContent: 'space-between', padding: '0 40px 40px 40px'}}>
                                    <div className="print-button-container2">    
                                    <button onClick={() => setPrintBOM(false)} style={{ background: '#fff', border: '1.5px solid #A4A4A4',borderRadius: 8, padding: '10px 24px', fontSize: 16, color: '#969696', fontWeight: '500', display: 'flex', alignItems: 'center', gap: 8}}>
                                        <div className="MRPIcon3" style={{ width: 15, height: 21 }} />
                                        Back
                                    </button>
                                    </div>
                                    <div className="print-button-container">                
                                    <button onClick={printBOMContent} style={{background: '#00A8A8', border: 'none', borderRadius: 10, padding: '10px 24px', fontSize: 16, color: 'white', fontWeight: '500'}}>
                                        Download
                                    </button>
                                    </div>
                                </div>
                                <img style={{width: 132.34, height: 196, left: 91, top: 170, position: 'absolute'}} src="/icons/module-icons/MRP-icons/MRPBOMLogo.png" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {printBOM2 && (
                <div id="printable-bom" className="bom-print-modal" onClick={(e) => e.stopPropagation()}>
                    <div className="bom-print-content" onClick={(e) => e.stopPropagation()}>
                        <div className="scroll-container" style={{maxHeight: '90vh', overflowY: 'auto'}}>
                            <div style={{width: 1128, position: 'relative', background: 'white'}}>
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
                                {selectedRowData && (
                                <div>
                                    {/* Left Labels */}
                                    <div style={{width: 135, left: 139, top: 473, position: 'absolute', color: '#1C1C1C', fontSize: 20, fontFamily: 'Inter', fontWeight: '700', textTransform: 'capitalize', lineHeight: 1, wordWrap: 'break-word'}}>Order No.</div>
                                    <div style={{width: 135, left: 139, top: 516, position: 'absolute', color: '#1C1C1C', fontSize: 20, fontFamily: 'Inter', fontWeight: '700', textTransform: 'capitalize', lineHeight: 1, wordWrap: 'break-word'}}>Date Created</div>

                                    {/* Left Data */}
                                    <div style={{width: 250, height: 16, left: 280, top: 472, position: 'absolute', textAlign: 'right', color: '#111111', fontSize: 20, fontFamily: 'Inter', fontWeight: '400', lineHeight: 1, wordWrap: 'break-word'}}>{selectedRowData.number}</div>
                                    <div style={{width: 144, left: 385, top: 515, position: 'absolute', textAlign: 'right', color: '#111111', fontSize: 20, fontFamily: 'Inter', fontWeight: '400', lineHeight: 1, wordWrap: 'break-word'}}>{selectedRowData.date}</div>

                                    {/* Right Labels */}
                                    <div style={{width: 135, left: 700, top: 473, position: 'absolute', color: '#1C1C1C', fontSize: 20, fontFamily: 'Inter', fontWeight: '700', textTransform: 'capitalize', lineHeight: 1, wordWrap: 'break-word'}}>Type</div>
                                   

                                    {/* Right Data */}
                                    <div style={{width: 250, left: 740, top: 472, position: 'absolute', textAlign: 'right', color: '#111111', fontSize: 20, fontFamily: 'Inter', fontWeight: '400', lineHeight: 1, wordWrap: 'break-word'}}>{selectedRowData.type}</div>

                                </div>
                                )}
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
                                                    <div data-type="Header" style={{width: 240, alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0.05)', borderLeft: '1px #E8E8E8 solid', borderTop: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                                        <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                                            <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '700', lineHeight: 1, wordWrap: 'break-word'}}>Product</div>
                                                        </div>
                                                    </div>
                                                    <div data-type="Header" style={{width: 96, alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0.05)', borderLeft: '1px #E8E8E8 solid', borderTop: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                                        <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                                            <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '700', lineHeight: 1, wordWrap: 'break-word'}}>Qty. Of Product</div>
                                                        </div>
                                                    </div>
                                                
                                                    <div data-type="Header" style={{width: 87, alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0.05)', borderLeft: '1px #E8E8E8 solid', borderTop: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                                        <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                                            <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '700', lineHeight: 1, wordWrap: 'break-word'}}>Units</div>
                                                        </div>
                                                    </div>
                                                    <div data-type="Header" style={{flex: '1 1 0', alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0.05)', borderLeft: '1px #E8E8E8 solid', borderTop: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                                        <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                                            <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '700', lineHeight: 1, wordWrap: 'break-word'}}>Cost Per Product</div>
                                                        </div>
                                                    </div>
                                                    <div data-type="Header" style={{flex: '1 1 0', alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0.05)', borderLeft: '1px #E8E8E8 solid', borderTop: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                                        <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                                            <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '700', lineHeight: 1, wordWrap: 'break-word'}}>Total Cost Per Product</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {bomDetails.map((item, index) => (
                                                <React.Fragment key={index}>
                                                    <div
                                                    className="print-row"
                                                    style={{alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0)', overflow: 'hidden', display: 'inline-flex'}}>
                                                    <div style={cellStyle(82)}>{item.no}</div>
                                                    <div style={cellStyle(240)}>{item.product}</div>
                                                    <div style={cellStyle(96)}>{item.qtyProduct}</div>
                                                    <div style={cellStyle(87)}>{item.unit}</div>
                                                    <div style={cellStyle(271)}>₱{item.costPerUnit.toLocaleString()}</div>
                                                    <div style={cellStyle(271)}>₱{item.totalCost.toLocaleString()}</div>
                                                    </div>

                                                    {(index + 1) % 3000 === 0 && (
                                                    <div className="print-page-break" style={{ height: 1 }} />
                                                    )}
                                                </React.Fragment>
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
                                </div>
                                <div style={{width: '100%', marginTop: 30, display: 'flex', justifyContent: 'space-between', padding: '0 40px 40px 40px'}}>
                                    <div className="print-button-container2">    
                                    <button onClick={() => setPrintBOM2(false)} style={{ background: '#fff', border: '1.5px solid #A4A4A4',borderRadius: 8, padding: '10px 24px', fontSize: 16, color: '#969696', fontWeight: '500', display: 'flex', alignItems: 'center', gap: 8}}>
                                        <div className="MRPIcon3" style={{ width: 15, height: 21 }} />
                                        Back
                                    </button>
                                    </div>
                                    <div className="print-button-container">                
                                    <button onClick={printBOMContent} style={{background: '#00A8A8', border: 'none', borderRadius: 10, padding: '10px 24px', fontSize: 16, color: 'white', fontWeight: '500'}}>
                                        Download
                                    </button>
                                    </div>
                                </div>
                                <img style={{width: 132.34, height: 196, left: 91, top: 170, position: 'absolute'}} src="/icons/module-icons/MRP-icons/MRPBOMLogo.png" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {printBOM3 && (
                <div id="printable-bom" className="bom-print-modal" onClick={(e) => e.stopPropagation()}>
                    <div className="bom-print-content" onClick={(e) => e.stopPropagation()}>
                        <div className="scroll-container" style={{maxHeight: '90vh', overflowY: 'auto'}}>
                            <div style={{width: 1128, position: 'relative', background: 'white'}}>
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
                                {selectedRowData && (
                                <div>
                                    {/* Left Labels */}
                                    <div style={{width: 135, left: 139, top: 473, position: 'absolute', color: '#1C1C1C', fontSize: 20, fontFamily: 'Inter', fontWeight: '700', textTransform: 'capitalize', lineHeight: 1, wordWrap: 'break-word'}}>Order No.</div>
                                    <div style={{width: 135, left: 139, top: 516, position: 'absolute', color: '#1C1C1C', fontSize: 20, fontFamily: 'Inter', fontWeight: '700', textTransform: 'capitalize', lineHeight: 1, wordWrap: 'break-word'}}>Date Created</div>

                                    {/* Left Data */}
                                    <div style={{width: 250, height: 16, left: 280, top: 472, position: 'absolute', textAlign: 'right', color: '#111111', fontSize: 20, fontFamily: 'Inter', fontWeight: '400', lineHeight: 1, wordWrap: 'break-word'}}>{selectedRowData.number}</div>
                                    <div style={{width: 144, left: 385, top: 515, position: 'absolute', textAlign: 'right', color: '#111111', fontSize: 20, fontFamily: 'Inter', fontWeight: '400', lineHeight: 1, wordWrap: 'break-word'}}>{selectedRowData.date}</div>

                                    {/* Right Labels */}
                                    <div style={{width: 135, left: 700, top: 473, position: 'absolute', color: '#1C1C1C', fontSize: 20, fontFamily: 'Inter', fontWeight: '700', textTransform: 'capitalize', lineHeight: 1, wordWrap: 'break-word'}}>Type</div>


                                    {/* Right Data */}
                                    <div style={{width: 250, left: 740, top: 472, position: 'absolute', textAlign: 'right', color: '#111111', fontSize: 20, fontFamily: 'Inter', fontWeight: '400', lineHeight: 1, wordWrap: 'break-word'}}>{selectedRowData.type}</div>
                    
                                </div>
                                )}
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
                                                    <div data-type="Header" style={{width: 240, alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0.05)', borderLeft: '1px #E8E8E8 solid', borderTop: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                                        <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                                            <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '700', lineHeight: 1, wordWrap: 'break-word'}}>Material</div>
                                                        </div>
                                                    </div>
                                                    <div data-type="Header" style={{width: 96, alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0.05)', borderLeft: '1px #E8E8E8 solid', borderTop: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                                        <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                                            <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '700', lineHeight: 1, wordWrap: 'break-word'}}>Qty. Of Material</div>
                                                        </div>
                                                    </div>
                                                
                                                    <div data-type="Header" style={{width: 87, alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0.05)', borderLeft: '1px #E8E8E8 solid', borderTop: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                                        <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                                            <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '700', lineHeight: 1, wordWrap: 'break-word'}}>Units</div>
                                                        </div>
                                                    </div>
                                                    <div data-type="Header" style={{flex: '1 1 0', alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0.05)', borderLeft: '1px #E8E8E8 solid', borderTop: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                                        <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                                            <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '700', lineHeight: 1, wordWrap: 'break-word'}}>Cost Per Material</div>
                                                        </div>
                                                    </div>
                                                    <div data-type="Header" style={{flex: '1 1 0', alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0.05)', borderLeft: '1px #E8E8E8 solid', borderTop: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                                        <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                                            <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '700', lineHeight: 1, wordWrap: 'break-word'}}>Total Cost Per Material</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {bomDetails.map((item, index) => (
                                                <React.Fragment key={index}>
                                                    <div
                                                    className="print-row"
                                                    style={{alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0)', overflow: 'hidden', display: 'inline-flex'}}>
                                                    <div style={cellStyle(82)}>{item.no}</div>
                                                    <div style={cellStyle(240)}>{item.product}</div>
                                                    <div style={cellStyle(96)}>{item.qtyProduct}</div>
                                                    <div style={cellStyle(87)}>{item.unit}</div>
                                                    <div style={cellStyle(271)}>₱{item.costPerUnit.toLocaleString()}</div>
                                                    <div style={cellStyle(271)}>₱{item.totalCost.toLocaleString()}</div>
                                                    </div>

                                                    {(index + 1) % 3000 === 0 && (
                                                    <div className="print-page-break" style={{ height: 1 }} />
                                                    )}
                                                </React.Fragment>
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
                                </div>
                                <div style={{width: '100%', marginTop: 30, display: 'flex', justifyContent: 'space-between', padding: '0 40px 40px 40px'}}>
                                    <div className="print-button-container2">    
                                    <button onClick={() => setPrintBOM3(false)} style={{ background: '#fff', border: '1.5px solid #A4A4A4',borderRadius: 8, padding: '10px 24px', fontSize: 16, color: '#969696', fontWeight: '500', display: 'flex', alignItems: 'center', gap: 8}}>
                                        <div className="MRPIcon3" style={{ width: 15, height: 21 }} />
                                        Back
                                    </button>
                                    </div>
                                    <div className="print-button-container">                
                                    <button onClick={printBOMContent} style={{background: '#00A8A8', border: 'none', borderRadius: 10, padding: '10px 24px', fontSize: 16, color: 'white', fontWeight: '500'}}>
                                        Download
                                    </button>
                                    </div>
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




    