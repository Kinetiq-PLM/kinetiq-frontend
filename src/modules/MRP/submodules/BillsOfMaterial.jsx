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
    const [selectedOrderNo, setSelectedOrderNo] = useState([]);
    const [npProducts, setNPProducts] = useState([]);
    const [principalItems, setPrincipalItems] = useState([]);
    const prinOverallCost = principalItems.reduce((sum, item) => sum + parseFloat(item.prin_totalitemcost), 0).toFixed(2);
    const npOverallProductCost = npProducts.reduce((sum, item) => sum + parseFloat(item.np_totalCost),0).toFixed(2);
    const [costOfProduction, setCostOfProduction] = useState([]);
    const [totalCostOfProduction, setTotalCostOfProduction] = useState(0);
    const [totalLaborCost, setTotalLaborCost] = useState(0);
    const [totalOrderCost, setTotalOrderCost] = useState(0);

    const baseurl = "http://127.0.0.1:8000";
    //const baseurl = "https://aw081x7836.execute-api.ap-southeast-1.amazonaws.com/dev"

    const [bomData, setBomData] = useState([]);
    const [bomDetails, setBomDetails] = useState([]);
    
    const [totalCost, setTotalCost] = useState([]);
    const totalCostPerRM = totalCost.reduce((sum, item) => sum + (item.totalCost || 0), 0).toFixed(2);
    // const [bomCostDetails, setBomCostDetails] = useState({
    //     rawMaterial: 0,
    //     subtotal: 10000,
    //     production: 40000.80,
    //     labor: 40000.80,
    //     total: 90001.60,
    // });

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
                        serviceOrderItemId: item.service_order_id,
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

    const fetchOrderStatement = async (orderId, type) => {
        try {
            const response = await fetch(`${baseurl}/bills_of_material/orderstatements/by-order/${orderId}/`);
            if (!response.ok) {
                throw new Error("Failed to fetch order statements");
            }
            const data = await response.json(); 
            const statementIds = data.map((item) => item.statement_id);

            console.log(statementIds);

            if (statementIds.length > 0) {
                if(type === "Project"){
                    fetchProjectBom(statementIds[0]);
                    fetchTotalCost(statementIds[0]);
                } else if (type === "Non Project"){
                    fetchNonProjectBom(statementIds[0]);
                }
            } else {
                console.warn("No statement IDs found.");
            }

            setSelectedOrderNo(statementIds);
        } catch (error) {
            console.error("Error fetching Order Statements", error);
        }
    };

    const fetchProjectBom = async (statementId) => {
        try {
            const response = await fetch(`${baseurl}/bills_of_material/projectbomdetail/by-statement/${statementId}/`);
            if (!response.ok) {
                throw new Error("Failed to fetch Products");
            }
            const data = await response.json();

            const formattedData = data.map((item, index) => ({
                number: index + 1,
                p_product_name: item.product_name,
                p_qtyProduct: item.qty_of_product,
                p_raw_material_name: item.raw_material_name,
                p_qty_of_raw_material: item.qty_of_raw_material,
                p_units: item.units,
                p_cost_per_rm: parseFloat(item.cost_per_rm),
                p_total_cost_per_rm: parseFloat(item.total_cost_per_rm),
            }));

            setBomDetails(formattedData);
        } catch (error) {
            console.error("Error fetching Non Project Products:", error);
        }
    };

    const fetchTotalCost = async (statementId) => {
        try {
            const response = await fetch(`${baseurl}/bills_of_material/productpricing/by-statement/${statementId}/`);
            if (!response.ok) {
                throw new Error("Failed to fetch BOM details");
            }
            const data = await response.json();

            const formattedData = data.map((item, index) => ({
                totalCost: parseFloat(item.cost),
            }));

            setTotalCost(formattedData);
        } catch (error) {
            console.error("Error fetching BOM details:", error);
        }
    };

        const fetchNonProjectBom = async (statementId) => {
            try {
                const response = await fetch(`${baseurl}/bills_of_material/nonprojectbomdetail/by-statement/${statementId}/`);
                if (!response.ok) {
                    throw new Error("Failed to fetch Products");
                }
                const data = await response.json();
    
                const formattedData = data.map((item, index) => ({
                    number: index + 1,
                    np_product_name: item.product_name,
                    np_qtyProduct: item.quantity,
                    np_units: item.unit_of_measure,
                    np_cost_per_product: parseFloat(item.selling_price),
                    np_totalCost: parseFloat(item.product_cost),
                }));
    
                setNPProducts(formattedData);
            } catch (error) {
                console.error("Error fetching Non Project Products:", error);
            }
        };

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
                    sr_orderID: item.service_order_id,
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

    const fetchPrincipalBOM = async (serviceorderID) => {
        try {
            const response = await fetch(`${baseurl}/bills_of_material/principalbomdetail/by-serviceid/${serviceorderID}/`);
            if (!response.ok) {
                throw new Error("Failed to fetch BOM details");
            }
            const data = await response.json();

            const formattedData = data.map((item, index) => ({
                no: index + 1,
                prin_item_name: item.item_name,
                prin_quantity: item.item_quantity,
                prin_uom: item.unit_of_measure,
                prin_itemcost: parseFloat(item.item_price),
                prin_totalitemcost: parseFloat(item.total_item_price)
            }));

            setPrincipalItems(formattedData);
        } catch (error) {
            console.error("Error fetching BOM details:", error);
        }
    };

    useEffect(() => {
        let total = 0;
    
        if (selectedRowData?.type === "Project") {
            total = parseFloat(totalCostPerRM || 0);
        } else if (selectedRowData?.type === "Non Project") {
            total = parseFloat(npOverallProductCost || 0);
        } else {
            total = parseFloat(prinOverallCost || 0);
        }
    
        total += totalCostOfProduction + totalLaborCost;
        setTotalOrderCost(total.toFixed(2));
    }, [selectedRowData?.type, totalCostPerRM, npOverallProductCost, prinOverallCost, totalCostOfProduction, totalLaborCost]);

    const cellStyle = (width) => ({
        width, alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0)', borderLeft: '1px #E8E8E8 solid', borderTop: '1px #E8E8E8 solid', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px 12px', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: 400, textAlign: 'center', lineHeight: 1, wordWrap: 'break-word'
    });

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
      
        const bomFiltered = (bomData || []).filter(item => {
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
          type: item.type || "Principal Items",
          details: item.description || "—",
          date: item.date || ""
        }));
      
        return [...bomFiltered, ...principalFiltered];
      };
      
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
        .filter(item => item.status === "complete"); 
      
      
    const filteredData = getFilteredData();

    function printBOMContent() {
        const printContents = document.getElementById("printable-bom").innerHTML;
        const originalContents = document.body.innerHTML;
        const originalScroll = window.scrollY;
        
        document.body.innerHTML = printContents;
        document.body.style.margin = "0";
        document.body.style.padding = "0";
        document.body.style.overflow = "visible";
        
        setTimeout(() => {
          window.print();
          document.body.innerHTML = originalContents;
          window.scrollTo(0, originalScroll);
          window.location.reload()
        }, 200);
    }


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

                <div className="reqplan-table-scroll" style={{width: '100%', maxWidth: 1159, background: 'white', boxShadow: '0px 4px 7.5px 1px rgba(0, 0, 0, 0.25)', overflowY: 'auto', maxHeight: '450px', borderRadius: 20, display: 'flex', flexDirection: 'column', gap: 0, padding: '1rem'}}>
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

                {mergedRows2
                    .filter(item => (item.status || "").toLowerCase().trim() === "complete")
                    .map((item, index) => (
                        <div
                        key={index}
                        className="table-row"
                        onClick={() => {
                            setSelectedRowData(item);
                            if (item.type === "Project") {
                            setPrintBOM(true);
                                fetchOrderStatement(item.number, "Project");
                                fetchCostProduction(item.number);
                                fetchCostLabor(item.number);
                            } else if (item.type === "Non Project") {
                            setPrintBOM2(true);
                            fetchOrderStatement(item.number, "Non Project");
                            fetchCostProduction(item.number);
                            fetchCostLabor(item.number);
                            } else {
                            setPrintBOM3(true);
                            fetchPrincipalBOM(item.number);
                            fetchCostProduction(item.number);
                            fetchCostLabor(item.number);
                            }
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(200, 200, 200, 0.2)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                        style={{ display: "flex", flexWrap: "wrap", cursor: "pointer", borderBottom: "1px solid #E8E8E8"}}>
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
                                    <div style={{width: 135, left: 139, top: 473, position: 'absolute', color: '#1C1C1C', fontSize: 20, fontFamily: 'Inter', fontWeight: '700', textTransform: 'capitalize', lineHeight: 1, wordWrap: 'break-word'}}>Order No.</div>
                                    <div style={{width: 135, left: 139, top: 516, position: 'absolute', color: '#1C1C1C', fontSize: 20, fontFamily: 'Inter', fontWeight: '700', textTransform: 'capitalize', lineHeight: 1, wordWrap: 'break-word'}}>Date Created</div>

                                    <div style={{width: 250, height: 16, left: 280, top: 472, position: 'absolute', textAlign: 'right', color: '#111111', fontSize: 20, fontFamily: 'Inter', fontWeight: '400', lineHeight: 1, wordWrap: 'break-word'}}>{selectedRowData.number}</div>
                                    <div style={{width: 144, left: 385, top: 515, position: 'absolute', textAlign: 'right', color: '#111111', fontSize: 20, fontFamily: 'Inter', fontWeight: '400', lineHeight: 1, wordWrap: 'break-word'}}>{selectedRowData.date}</div>

                                    <div style={{width: 135, left: 700, top: 473, position: 'absolute', color: '#1C1C1C', fontSize: 20, fontFamily: 'Inter', fontWeight: '700', textTransform: 'capitalize', lineHeight: 1, wordWrap: 'break-word'}}>Type</div>

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
                                                    style={{alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0)', overflow: 'visible', display: 'inline-flex'}}>
                                                    <div style={cellStyle(82)}>{item.number}</div>
                                                    <div style={cellStyle(145)}>{item.p_product_name}</div>
                                                    <div style={cellStyle(96)}>{item.p_qtyProduct}</div>
                                                    <div style={cellStyle(140)}>{item.p_raw_material_name}</div>
                                                    <div style={cellStyle(130)}>{item.p_qty_of_raw_material}</div>
                                                    <div style={cellStyle(87)}>{item.p_units}</div>
                                                    <div style={cellStyle(183)}>₱{parseFloat(item.p_cost_per_rm).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                                                    <div style={cellStyle(183)}>₱{parseFloat(item.p_total_cost_per_rm).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div></div>

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
                                            { label: 'Total Cost of Raw Materials', value: totalCostPerRM, strong: false },
                                            { label: 'Subtotal:', value: totalCostPerRM, strong: true },
                                            { label: 'Cost of Production', value: totalCostOfProduction, strong: false },
                                            { label: 'Labor Cost', value: totalLaborCost, strong: false },
                                            { label: 'Total Cost:', value: totalOrderCost, strong: true }
                                            ].map((item, index) => (
                                                <div key={index} style={{ display: 'flex', height: 36 }}>
                                                    <div style={{width: 223,padding: '10px 12px',background: index % 2 === 1 ? 'rgba(255, 255, 255, 0.05)' : 'transparent',fontSize: item.strong ? 16 : 14,fontWeight: item.strong ? 600 : 400,color: item.strong ? '#1C1C1C' : '#111111',fontFamily: 'Inter',display: 'flex',alignItems: 'center'}}>
                                                        {item.label}
                                                    </div>
                                                    <div style={{ width: 168,padding: '10px 12px',background: index % 2 === 1 ? 'rgba(255, 255, 255, 0.05)' : 'transparent',fontSize: item.strong ? 16 : 14,fontWeight: item.strong ? 600 : 400,textAlign: 'right',color: item.strong ? '#1C1C1C' : '#585757',fontFamily: 'Inter',display: 'flex',justifyContent: 'flex-end', alignItems: 'center'}}>
                                                        ₱{parseFloat(item.value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
                                    <div style={{width: 135, left: 139, top: 473, position: 'absolute', color: '#1C1C1C', fontSize: 20, fontFamily: 'Inter', fontWeight: '700', textTransform: 'capitalize', lineHeight: 1, wordWrap: 'break-word'}}>Order No.</div>
                                    <div style={{width: 135, left: 139, top: 516, position: 'absolute', color: '#1C1C1C', fontSize: 20, fontFamily: 'Inter', fontWeight: '700', textTransform: 'capitalize', lineHeight: 1, wordWrap: 'break-word'}}>Date Created</div>

                                    <div style={{width: 250, height: 16, left: 280, top: 472, position: 'absolute', textAlign: 'right', color: '#111111', fontSize: 20, fontFamily: 'Inter', fontWeight: '400', lineHeight: 1, wordWrap: 'break-word'}}>{selectedRowData.number}</div>
                                    <div style={{width: 144, left: 385, top: 515, position: 'absolute', textAlign: 'right', color: '#111111', fontSize: 20, fontFamily: 'Inter', fontWeight: '400', lineHeight: 1, wordWrap: 'break-word'}}>{selectedRowData.date}</div>

                                    <div style={{width: 135, left: 700, top: 473, position: 'absolute', color: '#1C1C1C', fontSize: 20, fontFamily: 'Inter', fontWeight: '700', textTransform: 'capitalize', lineHeight: 1, wordWrap: 'break-word'}}>Type</div>
                                   
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
                                                    <div data-type="Header" style={{width: 250, alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0.05)', borderLeft: '1px #E8E8E8 solid', borderTop: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                                        <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                                            <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '700', lineHeight: 1, wordWrap: 'break-word'}}>Product</div>
                                                        </div>
                                                    </div>
                                                    <div data-type="Header" style={{width: 100, alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0.05)', borderLeft: '1px #E8E8E8 solid', borderTop: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                                        <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                                            <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '700', lineHeight: 1, wordWrap: 'break-word'}}>Qty. Of Product</div>
                                                        </div>
                                                    </div>
                                                
                                                    <div data-type="Header" style={{width: 100, alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0.05)', borderLeft: '1px #E8E8E8 solid', borderTop: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
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
                                                {npProducts.map((item, index) => (
                                                <React.Fragment key={index}>
                                                    <div
                                                    className="print-row"
                                                    style={{alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0)', overflow: 'hidden', display: 'inline-flex'}}>
                                                    <div style={cellStyle(82)}>{item.number}</div>
                                                    <div style={cellStyle(250)}>{item.np_product_name}</div>
                                                    <div style={cellStyle(100)}>{item.np_qtyProduct}</div>
                                                    <div style={cellStyle(100)}>{item.np_units}</div>
                                                    <div style={cellStyle(258)}>₱{parseFloat(item.np_cost_per_product).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                                                    <div style={cellStyle(257)}>₱{parseFloat(item.np_totalCost).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
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
                                            { label: 'Total Cost of Raw Materials', value: npOverallProductCost, strong: false },
                                            { label: 'Subtotal:', value: npOverallProductCost, strong: true },
                                            { label: 'Cost of Production', value: totalCostOfProduction, strong: false },
                                            { label: 'Labor Cost', value: totalLaborCost, strong: false },
                                            { label: 'Total Cost:', value: totalOrderCost, strong: true }
                                            ].map((item, index) => (
                                                <div key={index} style={{ display: 'flex', height: 36 }}>
                                                    <div style={{width: 223,padding: '10px 12px',background: index % 2 === 1 ? 'rgba(255, 255, 255, 0.05)' : 'transparent',fontSize: item.strong ? 16 : 14,fontWeight: item.strong ? 600 : 400,color: item.strong ? '#1C1C1C' : '#111111',fontFamily: 'Inter',display: 'flex',alignItems: 'center'}}>
                                                        {item.label}
                                                    </div>
                                                    <div style={{ width: 168,padding: '10px 12px',background: index % 2 === 1 ? 'rgba(255, 255, 255, 0.05)' : 'transparent',fontSize: item.strong ? 16 : 14,fontWeight: item.strong ? 600 : 400,textAlign: 'right',color: item.strong ? '#1C1C1C' : '#585757',fontFamily: 'Inter',display: 'flex',justifyContent: 'flex-end', alignItems: 'center'}}>
                                                        ₱{parseFloat(item.value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
                                    <div style={{width: 135, left: 139, top: 473, position: 'absolute', color: '#1C1C1C', fontSize: 20, fontFamily: 'Inter', fontWeight: '700', textTransform: 'capitalize', lineHeight: 1, wordWrap: 'break-word'}}>Order No.</div>
                                    <div style={{width: 135, left: 139, top: 516, position: 'absolute', color: '#1C1C1C', fontSize: 20, fontFamily: 'Inter', fontWeight: '700', textTransform: 'capitalize', lineHeight: 1, wordWrap: 'break-word'}}>Date Created</div>

                                    <div style={{width: 280, height: 16, left: 250, top: 472, position: 'absolute', textAlign: 'right', color: '#111111', fontSize: 20, fontFamily: 'Inter', fontWeight: '400', lineHeight: 1, wordWrap: 'break-word'}}>{selectedRowData.number}</div>
                                    <div style={{width: 144, left: 385, top: 515, position: 'absolute', textAlign: 'right', color: '#111111', fontSize: 20, fontFamily: 'Inter', fontWeight: '400', lineHeight: 1, wordWrap: 'break-word'}}>{selectedRowData.date}</div>

                                    <div style={{width: 135, left: 700, top: 473, position: 'absolute', color: '#1C1C1C', fontSize: 20, fontFamily: 'Inter', fontWeight: '700', textTransform: 'capitalize', lineHeight: 1, wordWrap: 'break-word'}}>Type</div>

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
                                                    <div data-type="Header" style={{width: 250, alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0.05)', borderLeft: '1px #E8E8E8 solid', borderTop: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                                        <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                                            <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '700', lineHeight: 1, wordWrap: 'break-word'}}>Material</div>
                                                        </div>
                                                    </div>
                                                    <div data-type="Header" style={{width: 100, alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0.05)', borderLeft: '1px #E8E8E8 solid', borderTop: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                                        <div style={{alignSelf: 'stretch', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10, overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                                            <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: '700', lineHeight: 1, wordWrap: 'break-word'}}>Qty. Of Material</div>
                                                        </div>
                                                    </div>
                                                
                                                    <div data-type="Header" style={{width: 100, alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0.05)', borderLeft: '1px #E8E8E8 solid', borderTop: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
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
                                                {principalItems.map((item, index) => (
                                                <React.Fragment key={index}>
                                                    <div
                                                    className="print-row"
                                                    style={{alignSelf: 'stretch', background: 'rgba(255, 255, 255, 0)', overflow: 'hidden', display: 'inline-flex'}}>
                                                    <div style={cellStyle(82)}>{item.no}</div>
                                                    <div style={cellStyle(250)}>{item.prin_item_name}</div>
                                                    <div style={cellStyle(100)}>{item.prin_quantity}</div>
                                                    <div style={cellStyle(100)}>{item.prin_uom}</div>
                                                    <div style={cellStyle(258)}>₱{parseFloat(item.prin_itemcost).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                                                    <div style={cellStyle(257)}>₱{parseFloat(item.prin_totalitemcost).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
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
                                            { label: 'Total Cost of Raw Materials', value: prinOverallCost, strong: false },
                                            { label: 'Subtotal:', value: prinOverallCost, strong: true },
                                            { label: 'Cost of Production', value: totalCostOfProduction, strong: false },
                                            { label: 'Labor Cost', value: totalLaborCost, strong: false },
                                            { label: 'Total Cost:', value: totalOrderCost, strong: true }
                                            ].map((item, index) => (
                                                <div key={index} style={{ display: 'flex', height: 36 }}>
                                                    <div style={{width: 223,padding: '10px 12px',background: index % 2 === 1 ? 'rgba(255, 255, 255, 0.05)' : 'transparent',fontSize: item.strong ? 16 : 14,fontWeight: item.strong ? 600 : 400,color: item.strong ? '#1C1C1C' : '#111111',fontFamily: 'Inter',display: 'flex',alignItems: 'center'}}>
                                                        {item.label}
                                                    </div>
                                                    <div style={{ width: 168,padding: '10px 12px',background: index % 2 === 1 ? 'rgba(255, 255, 255, 0.05)' : 'transparent',fontSize: item.strong ? 16 : 14,fontWeight: item.strong ? 600 : 400,textAlign: 'right',color: item.strong ? '#1C1C1C' : '#585757',fontFamily: 'Inter',display: 'flex',justifyContent: 'flex-end', alignItems: 'center'}}>
                                                        ₱{parseFloat(item.value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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




    