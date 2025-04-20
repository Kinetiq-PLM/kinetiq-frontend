import React from "react";
import "../styles/MaterialRequirementsPlanning.css";
import { useState, useEffect } from "react";


const BodyContent = ({loadSubModule, setActiveSubModule}) => {

    const [rawmaterial, setRawMaterial] = useState(false);
    const [additionalcost, setAdditionalCost] = useState(false);
    const [additionalcost2, setAdditionalCost2] = useState(false);
    const [checker, setChecker] = useState(false);
    const [created, setCreated] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isOpen2, setIsOpen2] = useState(false);
    const [isOpen3, setIsOpen3] = useState(false);
    const [isOpen4, setIsOpen4] = useState(false);
    const [flag, setFlag] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [showHelpOptions, setShowHelpOptions] = useState(false);
    const [isProjectType, setIsProjectType] = useState(null);
    const [fetchMrpData, setFetchMrpData] = useState([]);

    const costOfProducts = 40000.00;
    //const costOfProduction = 15000.00;
    const laborCost = 8000.00;

    const [selectedRowData, setSelectedRowData] = useState(null); 
    const [selectedOrderNo, setSelectedOrderNo] = useState([]);
    const [bomDetails, setBomDetails] = useState([]);
    const [projPro, setProjMats] = useState([]);
    const [principalItems, setPrincipalItems] = useState([]);
    const [npProducts, setNPProducts] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [rawMaterials, setRawMaterials] = useState([]);
    const [costOfProduction, setCostOfProduction] = useState([]);
    const totalCostofRawMaterial = rawMaterials.reduce((sum,item) => sum + parseFloat(item.rmtotalCost),0);
    const overallTotalCost = bomDetails.reduce((sum, item) => sum + parseFloat(item.totalCost),0).toFixed(2);
    const npOverallProductCost = npProducts.reduce((sum, item) => sum + parseFloat(item.np_totalCost),0).toFixed(2);
    const prinOverallCost = principalItems.reduce((sum, item) => sum + parseFloat(item.prin_totalitemcost), 0).toFixed(2);
    const [selectedStatementId, setSelectedStatementId] = useState(null);
    const [mrpData, setMrpData] = useState([]);

    const [principalOrder, setPrincipalItemOrder] = useState([]);
    const [pnpOrder, setPnpOrder] = useState([]);
    const [prinOrder, setPrincipalOrder] = useState([]);
    const [totalCostOfProduction, setTotalCostOfProduction] = useState(0);
    const [totalLaborCost, setTotalLaborCost] = useState(0);
    const [totalOrderCost, setTotalOrderCost] = useState(0);
    const baseurl = "http://127.0.0.1:8000";
    //const baseurl = "https://aw081x7836.execute-api.ap-southeast-1.amazonaws.com/dev"



    useEffect(() => {
        const fetchMrpData = async () => {
            try {
                const response = await fetch(`${baseurl}/bills_of_material/orderlist/`);
                if (!response.ok) {
                    throw new Error("Failed to fetch MRP data");
                }
                const data = await response.json();

                const formattedData = data.map((item) => ({
                    number: item.order_no,
                    type: item.type,
                    details: item.details,
                    date: item.date.trim(),
                }));

                setMrpData(formattedData);
            } catch (error) {
                console.error("Error fetching MRP data:", error);
            }
        };

        fetchMrpData();
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
        const fetchOrderPnp = async () => {
            try {
                const response = await fetch(`${baseurl}/bills_of_material/trackingnpop/`);
                if (!response.ok) {
                    throw new Error("Failed to fetch Project Non Project Orders");
                }
                const data = await response.json();

                const formattedData = data.map((item) => ({
                    pnp_orderID: item.order_id,
                    pnp_status: item.status,
                }));

                setPnpOrder(formattedData);
            } catch (error) {
                console.error("Error fetching Project Non Project Orders:", error);
            }
        };

        fetchOrderPnp();
    }, []);

    useEffect(() => {
        const fetchPrincipalOrder = async () => {
            try {
                const response = await fetch(`${baseurl}/bills_of_material/trackingprincipal/`);
                if (!response.ok) {
                    throw new Error("Failed to fetch Principal Orders");
                }
                const data = await response.json();

                const formattedData = data.map((item) => ({
                    sr_orderID: item.service_order_item_id,
                    sr_status: item.status,
                }));

                setPrincipalOrder(formattedData);
            } catch (error) {
                console.error("Error fetching Principal Orders:", error);
            }
        };

        fetchPrincipalOrder();
    }, []);

    const fetchOrderStatement = async (orderId) => {
        try {
            const response = await fetch(`${baseurl}/bills_of_material/orderstatements/by-order/${orderId}/`);
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
    
    const fetchBomDetails = async (statementId) => {
        try {
            const response = await fetch(`${baseurl}/bills_of_material/productpricing/by-statement/${statementId}/`);
            if (!response.ok) {
                throw new Error("Failed to fetch BOM details");
            }
            const data = await response.json();

            const formattedData = data.map((item, index) => ({
                no: index + 1,
                product_id: item.product_id,
                product_name: item.product_name,
                product_description: item.product_description,
                qtyProduct: item.quantity,
                totalCost: parseFloat(item.cost),
            }));

            setBomDetails(formattedData);
        } catch (error) {
            console.error("Error fetching BOM details:", error);
        }
    };

    const fetchNonProjectProduct = async (statementId) => {
        try {
            const response = await fetch(`${baseurl}/bills_of_material/npproductcost/statement/${statementId}/`);
            if (!response.ok) {
                throw new Error("Failed to fetch Products");
            }
            const data = await response.json();

            const formattedData = data.map((item, index) => ({
                number: index + 1,
                np_product_id: item.product_id,
                np_product_name: item.product_name,
                np_product_description: item.description,
                np_qtyProduct: item.quantity,
                np_totalCost: parseFloat(item.product_cost),
            }));

            setNPProducts(formattedData);
        } catch (error) {
            console.error("Error fetching Non Project Products:", error);
        }
    };


    const fetchRawMaterials = async (productId) => {
    try {
        const response = await fetch(`${baseurl}/bills_of_material/costofrawmats/by-product/${productId}/`);
        if (!response.ok) {
            throw new Error("Failed to fetch raw materials");
        }
        const data = await response.json();
        const formattedData = data.map((item) => ({
            rawMaterial: item.raw_material,
            materialId: item.material_id,
            rmquantity: item.rm_quantity,
            rmunits: item.units,
            rmunitCost: parseFloat(item.unit_cost).toFixed(2),
            rmtotalCost: parseFloat(item.total_cost).toFixed(2),
        }));

        setRawMaterials(formattedData);
    } catch (error) {
        console.error("Error fetching raw materials:", error);
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

    const [projectId, setProjectID] = useState([]);

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
        
    const fetchProjectProductMats = async (statementId) => {
        try {
            const response = await fetch(`${baseurl}/bills_of_material/projectproductmats/by-statement/${statementId}/`);
            if (!response.ok) {
                throw new Error("Failed to fetch Project Product Mats");
            }
            const data = await response.json();

            const formattedData = data.map((item) => ({
                proj_product_mats_id: item.product_mats_id,
                proj_quantity_required: item.quantity_required,
                proj_cost_per_raw_material: item.cost_per_raw_material,
                proj_total_cost_of_raw_materials: item.total_cost_of_raw_materials,
            }));

            setProjMats(formattedData);
        } catch (error) {
            console.error("Error fetching Project Product Mats:", error);
        }
    };

        const sendProjectData = async () => {
            try {

                const payload = projPro.map(item => ({
                    project_id: projectId[0]?.projectID || null,
                    product_mats_id: item.proj_product_mats_id,
                    overall_quantity_of_material: parseInt(item.proj_quantity_required) || 1,
                    cost_per_raw_material: parseFloat(item.proj_cost_per_raw_material) || 1.00,
                    total_cost_of_raw_materials: parseFloat(item.proj_total_cost_of_raw_materials) || 1.00,
                    production_order_detail_id: null,
                    labor_cost_id: null,
                    total_cost: parseFloat(totalOrderCost) || 1.00
                }));
        
                console.log("Payload:", payload);
        
                const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `BOM_Payload_${selectedRowData?.number || 'no-id'}.json`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
        
                const response = await fetch(`${baseurl}/insertbom/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
        
                if (!response.ok) throw new Error('Failed to submit BOM data');
                const data = await response.json();
                console.log('Successfully submitted BOM:', data);
            } catch (error) {
                console.error('Error sending BOM:', error);
            }
        };
        
    const sendNonProjectData = async () => {
        try {

            const payload = {
                order_id: selectedRowData.number,
                final_price: totalOrderCost
            };
            console.log('Payload:', payload);
            const response = await fetch('http://127.0.0.1:8000/insert_nonproject/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
    
            if (!response.ok) throw new Error('Failed to submit Non Project Data');
            const data = await response.json();
            console.log('Success:', data);


            const updateResponse = await fetch('http://127.0.0.1:8000/update_tracking_status/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ order_id: selectedRowData.number })
            });
    
            if (!updateResponse.ok) throw new Error('Failed to update tracking status');
            const updateData = await updateResponse.json();
            console.log('Tracking status updated:', updateData);
        } catch (error) {
            console.error('Error sending Non Project Data:', error);
        }
    };

    const sendPrincipalData = async () => {
        try {

            const payload = {
                service_order_item_id: selectedRowData.number,
                item_id: principalItems.prin_item_id,
                mark_up_price: totalOrderCost
            };
            console.log('Payload:', payload);
            const response = await fetch('http://127.0.0.1:8000/insert_principal/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
    
            if (!response.ok) throw new Error('Failed to submit Principal Item Data');
            const data = await response.json();
            console.log('Success:', data);
        } catch (error) {
            console.error('Error sending Principal Item:', error);
        }
    };

    useEffect(() => {
        let total = 0;

        if (isProjectType === "Project") {
            total = parseFloat(overallTotalCost || 0);
        } else if (isProjectType === "Non Project") {
            total = parseFloat(npOverallProductCost || 0);
        } else if (isProjectType === "Principal Item") {
            total = parseFloat(prinOverallCost * 1.2);
        }

        total += totalCostOfProduction + totalLaborCost;
        setTotalOrderCost(total.toFixed(2));
    }, [isProjectType, overallTotalCost, npOverallProductCost, prinOverallCost, totalCostOfProduction, totalLaborCost]);

    const rawMats = [
        { "product_id": "ADMIN-PROD-2025-a6d292", "raw_material": "Carbon Fiber", "material_id": "ADMIN-MATERIAL-2025-fa9377", "rm_quantity": "80.70", "units": "kg", "unit_cost": "2500.00", "total_cost": "201750.00"},
        { "product_id": "ADMIN-PROD-2025-a6d292", "raw_material": "Hydraulic Oil", "material_id": "ADMIN-MATERIAL-2025-b1aac1", "rm_quantity": "22.22", "units": "kg", "unit_cost": "190.00", "total_cost": "4221.80"},
        { "product_id": "ADMIN-PROD-2025-a6d292", "raw_material": "Medical-Grade Silicone", "material_id": "ADMIN-MATERIAL-2025-23d783", "rm_quantity": "37.77", "units": "kg", "unit_cost": "2932.00", "total_cost": "110741.64"},
        { "product_id": "ADMIN-PROD-2025-a6d292", "raw_material": "Stainless Steel", "material_id": "ADMIN-MATERIAL-2025-37d86c", "rm_quantity": "109.90","units": "kg", "unit_cost": "100.00", "total_cost": "10990.00"}
    ]

    const getFilteredData = () => {
        return mrpData.filter((item) => {
          const matchesFlag =
            flag === 0 ||
            (flag === 1 && item.type === "Project") ||
            (flag === 2 && item.type === "Non Project") ||
            (flag === 3 && item.type === "Item Principal");
      
          const term = (searchTerm || "").toLowerCase(); 
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

    const mergedRows2 = (
        flag === 0
          ? [...(filteredData || []), ...(principalOrder || [])]
          : flag === 3
          ? principalOrder
          : filteredData 
      ).map((item) => {
        const number = item.number || item.serviceOrderItemId;
        const type = item.type;
        const details = item.details || item.description;
        const date = item.date;
      
        const pnpMatch = pnpOrder.find(p => p.pnp_orderID === number);
        const prinMatch = prinOrder.find(p => p.sr_orderID === number);
      
        const status = pnpMatch?.pnp_status || prinMatch?.sr_status || "";
      
        return {
          number,
          type,
          details,
          date,
          status
        };
      }).filter(item => (item.status || "").toLowerCase() !== "complete");
    
    const buttonStyle = (bg, border, textColor = '#585757') => ({display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px 20px', borderRadius: 8, background: bg, color: textColor, fontSize: 16, fontWeight: '500', fontFamily: 'Inter', gap: 6, cursor: 'pointer', });
    const buttonStyle2 = (bg, textColor = '#585757') => ({display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px 20px', borderRadius: 8, background: bg, border: '0.5px solid #585757', color: textColor, fontSize: 16, fontWeight: '500', fontFamily: 'Inter', gap: 6, cursor: 'pointer',});
    const rowCellStyle = {flex: '1 1 14%', minWidth: 120, padding: '12px', textAlign: 'center', fontFamily: 'Inter', fontSize: 15, color: '#585757'};
    const tdStyle = {padding: '10px 12px', textAlign: 'center', fontSize: 18, color: '#585757', whiteSpace: 'nowrap'};

    const [additionalCosts, setAdditionalCosts] = useState([
        { type: "Cost of Production", amount: 0 }
    ]);
      
    const handleAddCostRow = () => {
        setAdditionalCosts([...additionalCosts, { type: "Cost of Production", amount: 0 }]);
    };
      
    const handleTypeChange = (index, newType) => {
        const updated = [...additionalCosts];
        updated[index].type = newType;
        setAdditionalCosts(updated);
    };
      
    const handleAmountChange = (index, newAmount) => {
        const updated = [...additionalCosts];
        updated[index].amount = parseFloat(newAmount || 0);
        setAdditionalCosts(updated);
    };
      
    const totalCost = additionalCosts.reduce((acc, item) => acc + item.amount, 0);
    const handleRemoveCostRow = (index) => {
        setAdditionalCosts((prev) => prev.filter((_, i) => i !== index));
    };

    const filteredMats = rawMats.filter(mat => mat.product_id === selectedProductId);
    const totalRawCost = filteredMats.reduce((sum, mat) => {
        const unitCost = parseFloat(mat.unit_cost) || 0;
        const quantity = parseFloat(mat.rm_quantity) || 0;
    return sum + (unitCost * quantity);
    }, 0);


    return (      
        <div className="reqplan">
            <div style={{width: '100%', height: '100%', padding: '2rem', background: 'white', boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.08)', overflow: 'hidden', borderRadius: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', rowGap: 25,}}>
                <div className="title">MATERIAL REQUIREMENTS PLANNING</div>
                <div style={{width: '100%', maxWidth: 1300, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', rowGap: 10,paddingLeft: 80, paddingRight: 80,}}>
                    <div className="tabs-container" style={{ display: 'flex', flexWrap: 'wrap', gap: 15,flex: '1 1 auto', minWidth: 200,}}>
                        {['All Orders', 'Project Orders', 'Non-Project Orders', 'Principal Items'].map((label, i) => (
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

                <div className="reqplan-table-scroll" style={{width: '100%', maxWidth: 1159, background: 'white', boxShadow: '0px 4px 7.5px 1px rgba(0, 0, 0, 0.25)', overflowY: 'auto', maxHeight: '450px', borderRadius: 20, display: 'flex', flexDirection: 'column', gap: 0, padding: '1rem'}}>
                    <div className="table-header" style={{display: 'flex', flexWrap: 'wrap', borderBottom: '1px solid #E8E8E8'}}>
                        {['Order No.', 'Type', 'Details', 'Date'].map((label) => (
                            <div className="table-cell2" key={label} data-label={label} style={{flex: '1 1 25%', minWidth: 150, padding: '12px', fontWeight: 700, textAlign: 'center', color: '#585757', fontFamily: 'Inter', fontSize: 18}}>{label}</div>
                        ))}
                    </div>
                    {mergedRows2.map((item, index) => (
                        <div key={index} className="table-row" onClick={() => {setSelectedRowData(item); fetchOrderStatement(item.number); fetchProjectID(item.number); fetchCostProduction(item.number); fetchCostLabor(item.number); fetchPrincipalDetails(item.number); setIsProjectType(item.type); setIsOpen(true);}} onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(200, 200, 200, 0.2)")} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")} style={{display: "flex", flexWrap: "wrap", cursor: "pointer", borderBottom: "1px solid #E8E8E8"}}>
                            <div className="table-cell" style={rowCellStyle} data-label="Order No.">{item.number}</div>
                            <div className="table-cell" style={rowCellStyle} data-label="Type">{item.type}</div>
                            <div className="table-cell" style={rowCellStyle} data-label="Details">{item.details || '—'}</div>
                            <div className="table-cell" style={rowCellStyle} data-label="Date">{item.date}</div>
                        </div>
                    ))}
                </div>

                
                <div className="reqplan-help-wrapper">
                    {showHelpOptions && (
                        <div className="reqplan-help-options">
                        <button onClick={() => alert('Purchase Request')} className="reqplan-help-option">📦 Purchase Request</button>
                        <button onClick={() => alert('Project Request')} className="reqplan-help-option">🏗️ Project Request</button>
                        <button onClick={() => alert('Workforce Request')} className="reqplan-help-option">👷 Workforce Request</button>
                        </div>
                    )}
                    <button className="reqplan-help-button"onClick={() => setShowHelpOptions(prev => !prev)} aria-label="Help">?</button>
                </div>
            </div>

            {isOpen && selectedRowData &&(
            <div className="bom-print-modal">
                <div className="fixed inset-0 flex items-center justify-center">
                <div className="modal-inner" style={{ width: '90%', maxWidth: 953, background: 'white', borderRadius: 10, boxShadow: '0px 4px 7.5px 1px rgba(0, 0, 0, 0.25)', padding: 24, display: 'flex', flexDirection: 'column', gap: 24, }}>
                    <div style={{fontSize: 'clamp(20px, 3vw, 35px)', fontFamily: 'Inter', fontWeight: 500, textAlign: 'center', color: '#130101', paddingTop: 30,}}>Order Details</div>

                    <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 20, padding: 20,}}>
                    {[
                        { label: 'Order No.', value: selectedRowData.number },
                        { label: 'Type', value: selectedRowData.type },
                        { label: 'Details', value: selectedRowData.details },
                        { label: 'Date', value: selectedRowData.date },
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

                    <div
                    style={{display: 'flex', justifyContent: 'space-between', marginTop: 'auto', flexWrap: 'wrap', gap: 10,}}>
                    <button onClick={() => setIsOpen(false)} style={buttonStyle2('#fff', '#A4A4A4')}>
                        <div className="MRPIcon3" style={{ width: 15, height: 21, marginRight: 10 }} />
                        <span style={{ color: '#969696' }}>Back</span>
                    </button>

                    <button
                        onClick={() => {if (isProjectType === "Project") {setIsOpen2(true);} else if (isProjectType === "Non Project") {setIsOpen3(true);} else {setIsOpen4(true);} setIsOpen(false); fetchPrincipalDetails(item.serviceorderID); setSelectedRowData(item);}}
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
                        <div style={{fontSize: 'clamp(24px, 3vw, 35px)', fontFamily: 'Inter', fontWeight: 500, textAlign: 'center',color: '#130101',}}>Product Pricing</div>
                        <div className="reqplan-table-scroll2" style={{flex: 1, overflowY: 'auto', overflowX: 'auto', marginBottom: 30, borderRadius: 20, boxShadow: '0px 4px 7.5px 1px rgba(0, 0, 0, 0.15)',padding: 0,}}>
                            <div style={{width: '100%', flex: 1, background: 'white',borderRadius: 20, display: 'flex', flexDirection: 'column', gap: 0, padding: '0.5rem',}}>
                                <div className="table-header" style={{ display: 'flex', flexWrap: 'wrap', borderBottom: '1px solid #E8E8E8',}}>
                                    {['No.', 'Product ID', 'Product', 'Product Description', 'Quantity', 'Raw Materials', 'Cost'].map(
                                    (label) => (
                                        <div
                                        key={label}
                                        style={{ flex: '1 1 14%', minWidth: 120, padding: '12px', fontWeight: 700, textAlign: 'center', color: '#585757', fontFamily: 'Inter', fontSize: 16 }}>
                                        {label}
                                        </div>
                                    )
                                    )}
                                </div>

                                {bomDetails.map((item, index) => (
                                    <div
                                    key={index}
                                    className="table-row"
                                    style={{display: 'flex', flexWrap: 'wrap',borderBottom: '1px solid #E8E8E8',}}>
                                    <div className="table-cell" style={rowCellStyle} data-label="No.">{item.no}</div>
                                    <div className="table-cell" data-label="Product ID" style={rowCellStyle}>{item.product_id}</div>
                                    <div className="table-cell" data-label="Product" style={rowCellStyle}>{item.product_name}</div>
                                    <div className="table-cell" data-label="Product Description" style={rowCellStyle}><span>{item.product_description}</span></div>
                                    <div className="table-cell" data-label="Quantity" style={rowCellStyle}>{item.qtyProduct} pcs</div>
                                    <div className="table-cell" data-label="Raw Materials" onClick={() => {setSelectedProductId(item.product_id); fetchRawMaterials(item.product_id); setRawMaterial(true);}} onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(200, 200, 200, 0.2)')} onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')} style={{ ...rowCellStyle, cursor: 'pointer', color: '#00A8A8' }}>Show List</div>
                                    <div className="table-cell" data-label="Cost" style={rowCellStyle}>₱{item.totalCost.toLocaleString()}</div>
                                    </div>
                                ))}
                                </div>
                            </div>

                            <div style={{width: '100%', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem',}}>
                           
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent:'center' }}>
                                    <div style={{padding: '6px 24px', background: 'white', borderRadius: 20, boxShadow: '0px 4px 7.5px 1px rgba(0, 0, 0, 0.25)', display: 'flex', alignItems: 'center', gap: 10,}}>
                                        <span style={{ fontWeight: 500, color: '#585757' }}><b>Total Cost of Products:</b></span>
                                        <span style={{ padding: '6px 24px', color: '#585757', fontFamily: 'Inter', fontWeight: 500 }}>₱{overallTotalCost}</span>
                                    </div>

                                    <div style={{padding: '8px 24px', background: 'white', borderRadius: 20, boxShadow: '0px 4px 7.5px 1px rgba(0, 0, 0, 0.25)', display: 'flex', alignItems: 'center', gap: 10,}}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10}}>
                                            <span style={{ fontWeight: 500, color: '#585757' }}><b>Order No.</b></span>
                                        <div
                                        style={{padding: '6px 24px', color: '#585757', fontFamily: 'Inter', fontWeight: 500}}>{selectedRowData.number}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{width: '100%',  display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto',}}>
                            <button onClick={() => { setIsOpen2(false); setIsOpen(true); }} style={buttonStyle2('#fff')}>
                                <div className="MRPIcon3" style={{ width: 15, height: 21, marginRight: 10 }} />
                                <span style={{ color: '#969696' }}>Back</span>
                            </button>

                            <button onClick={() => { setIsOpen2(false), setAdditionalCost(true); }} style={buttonStyle('#00A8A8', '#00A8A8', 'white')}>
                                <span>Next</span>
                                <div className="MRPIcon5" style={{ width: 13, height: 21, marginLeft: 8 }} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            )}

            {isOpen3 && (
            <div className="bom-print-modal">
                <div className="fixed inset-0 flex items-center justify-center">
                    <div style={{width: '90vw', maxWidth: 1360, height: '90vh', maxHeight: 760, background: 'white', borderRadius: 10, boxShadow: '0px 4px 7.5px 1px rgba(0, 0, 0, 0.25)', overflow: 'hidden', padding: '3rem', display: 'flex', flexDirection: 'column', gap: '1.5rem',}}>
                        <div style={{fontSize: 'clamp(24px, 3vw, 35px)', fontFamily: 'Inter', fontWeight: 500, textAlign: 'center',color: '#130101',}}>Product Pricing</div>
                        <div className="reqplan-table-scroll2" style={{flex: 1, overflowY: 'auto', overflowX: 'auto', marginBottom: 30, borderRadius: 20, boxShadow: '0px 4px 7.5px 1px rgba(0, 0, 0, 0.15)',padding: 0,}}>
                            <div style={{width: '100%', flex: 1, background: 'white',borderRadius: 20, display: 'flex', flexDirection: 'column', gap: 0, padding: '0.5rem',}}>
                                <div className="table-header" style={{ display: 'flex', flexWrap: 'wrap', borderBottom: '1px solid #E8E8E8',}}>
                                    {['No.', 'Product ID', 'Product', 'Product Description', 'Quantity', 'Cost'].map(
                                    (label) => (
                                        <div
                                        key={label}
                                        style={{ flex: '1 1 14%', minWidth: 120, padding: '12px', fontWeight: 700, textAlign: 'center', color: '#585757', fontFamily: 'Inter', fontSize: 16 }}>
                                        {label}
                                        </div>
                                    )
                                    )}
                                </div>

                                {npProducts.map((item, index) => (
                                    <div
                                    key={index}
                                    className="table-row"
                                    style={{display: 'flex', flexWrap: 'wrap',borderBottom: '1px solid #E8E8E8',}}>
                                    <div style={rowCellStyle}>{item.number}</div>
                                    <div style={rowCellStyle}>{item.np_product_id}</div>
                                    <div style={rowCellStyle}>{item.np_product_name}</div>
                                    <div style={rowCellStyle}>{item.np_product_description}</div>
                                    <div style={rowCellStyle}>{item.np_qtyProduct} pcs</div>
                                    <div style={rowCellStyle}>₱{item.np_totalCost.toLocaleString()}</div>
                                    </div>
                                ))}
                                </div>
                            </div>

                            <div style={{width: '100%', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem',}}>
                           
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent:'center' }}>
                                    <div style={{padding: '6px 24px', background: 'white', borderRadius: 20, boxShadow: '0px 4px 7.5px 1px rgba(0, 0, 0, 0.25)', display: 'flex', alignItems: 'center', gap: 10,}}>
                                        <span style={{ fontWeight: 500, color: '#585757' }}><b>Total Cost of Products:</b></span>
                                        <span style={{ padding: '6px 24px', color: '#585757', fontFamily: 'Inter', fontWeight: 500 }}>₱{npOverallProductCost}</span>
                                    </div>

                                    <div style={{padding: '8px 24px', background: 'white', borderRadius: 20, boxShadow: '0px 4px 7.5px 1px rgba(0, 0, 0, 0.25)', display: 'flex', alignItems: 'center', gap: 10,}}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10}}>
                                            <span style={{ fontWeight: 500, color: '#585757' }}><b>Order No.</b></span>
                                        <div
                                        style={{padding: '6px 24px', color: '#585757', fontFamily: 'Inter', fontWeight: 500}}>{selectedRowData.number}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{width: '100%',  display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto',}}>
                            <button onClick={() => { setIsOpen3(false); setIsOpen(true); }} style={buttonStyle2('#fff')}>
                                <div className="MRPIcon3" style={{ width: 15, height: 21, marginRight: 10 }} />
                                <span style={{ color: '#969696' }}>Back</span>
                            </button>

                            <button onClick={() => { setAdditionalCost(true); }} style={buttonStyle('#00A8A8', '#00A8A8', 'white')}>
                                <span>Next</span>
                                <div className="MRPIcon5" style={{ width: 13, height: 21, marginLeft: 8 }} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            )}

            {isOpen4 && (
            <div className="bom-print-modal">
                <div className="fixed inset-0 flex items-center justify-center">
                    <div style={{width: '90vw', maxWidth: 1360, height: '90vh', maxHeight: 760, background: 'white', borderRadius: 10, boxShadow: '0px 4px 7.5px 1px rgba(0, 0, 0, 0.25)', overflow: 'hidden', padding: '3rem', display: 'flex', flexDirection: 'column', gap: '1.5rem',}}>
                        <div style={{fontSize: 'clamp(24px, 3vw, 35px)', fontFamily: 'Inter', fontWeight: 500, textAlign: 'center',color: '#130101',}}>Product Pricing</div>
                        <div className="reqplan-table-scroll2" style={{flex: 1, overflowY: 'auto', overflowX: 'auto', marginBottom: 30, borderRadius: 20, boxShadow: '0px 4px 7.5px 1px rgba(0, 0, 0, 0.15)',padding: 0,}}>
                            <div style={{width: '100%', flex: 1, background: 'white',borderRadius: 20, display: 'flex', flexDirection: 'column', gap: 0, padding: '0.5rem',}}>
                                <div className="table-header" style={{ display: 'flex', flexWrap: 'wrap', borderBottom: '1px solid #E8E8E8',}}>
                                    {['No.', 'Item ID', 'Unit Of Measure', 'Item Name', 'Item Quantity', 'Item Price', 'Total Item Price'].map(
                                    (label) => (
                                        <div
                                        key={label}
                                        style={{ flex: '1 1 14%', minWidth: 120, padding: '12px', fontWeight: 700, textAlign: 'center', color: '#585757', fontFamily: 'Inter', fontSize: 16 }}>
                                        {label}
                                        </div>
                                    )
                                    )}
                                </div>

                                {principalItems.map((item, index) => (
                                    <div
                                    key={index}
                                    className="table-row"
                                    style={{display: 'flex', flexWrap: 'wrap',borderBottom: '1px solid #E8E8E8',}}>
                                    <div style={rowCellStyle}>{item.no}</div>
                                    <div style={rowCellStyle}>{item.prin_material_id}</div>
                                    <div style={rowCellStyle}>{item.prin_uom}</div>
                                    <div style={rowCellStyle}>{item.prin_item_name}</div>
                                    <div style={rowCellStyle}>{item.prin_quantity}</div>
                                    <div style={rowCellStyle}>₱{item.prin_itemcost} </div>
                                    <div style={rowCellStyle}>₱{item.prin_totalitemcost} </div>
                                    </div>
                                ))}
                                </div>
                            </div>

                            <div style={{width: '100%', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem',}}>
                           
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent:'center' }}>
                                    <div style={{padding: '6px 24px', background: 'white', borderRadius: 20, boxShadow: '0px 4px 7.5px 1px rgba(0, 0, 0, 0.25)', display: 'flex', alignItems: 'center', gap: 10,}}>
                                        <span style={{ fontWeight: 500, color: '#585757' }}><b>Total Cost of Products:</b></span>
                                        <span style={{ padding: '6px 24px', color: '#585757', fontFamily: 'Inter', fontWeight: 500 }}>₱{prinOverallCost}</span>
                                    </div>

                                    <div style={{padding: '8px 24px', background: 'white', borderRadius: 20, boxShadow: '0px 4px 7.5px 1px rgba(0, 0, 0, 0.25)', display: 'flex', alignItems: 'center', gap: 10,}}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10}}>
                                            <span style={{ fontWeight: 500, color: '#585757' }}><b>Order No.</b></span>
                                        <div
                                        style={{padding: '6px 24px', color: '#585757', fontFamily: 'Inter', fontWeight: 500}}>{selectedRowData.number}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{width: '100%',  display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto',}}>
                            <button onClick={() => { setIsOpen4(false); setIsOpen(true); }} style={buttonStyle2('#fff')}>
                                <div className="MRPIcon3" style={{ width: 15, height: 21, marginRight: 10 }} />
                                <span style={{ color: '#969696' }}>Back</span>
                            </button>

                            <button onClick={() => { setIsOpen4(false); setAdditionalCost(true); }} style={buttonStyle('#00A8A8', '#00A8A8', 'white')}>
                                <span>Next</span>
                                <div className="MRPIcon5" style={{ width: 13, height: 21, marginLeft: 8 }} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            )}

            {rawmaterial && (
            <div className="bom-print-modal2 fixed inset-0 flex items-center justify-center z-50 px-4">
                <div style={{width: 967, maxHeight: '90vh', background: 'white', boxShadow: '0px 4px 7.5px 1px rgba(0, 0, 0, 0.25)', borderRadius: 10, display: 'flex', flexDirection: 'column', padding: '25px 20px', overflow: 'hidden', position: 'relative',}}>
                    <div style={{width: '100%', textAlign: 'center', color: '#130101', fontSize: 35, fontFamily: 'Inter',fontWeight: '400', textTransform: 'capitalize', letterSpacing: 1.4, marginBottom: 25}}>Cost of Raw Materials</div>
                    <div className="reqplan-table-scroll2" style={{flex: 1, overflowY: 'auto', overflowX: 'auto', marginBottom: 30, borderRadius: 20, boxShadow: '0px 4px 7.5px 1px rgba(0, 0, 0, 0.15)', padding: 0}}>
                        <div style={{width: '100%', flex: 1, background: 'white', borderRadius: 20, display: 'flex', flexDirection: 'column', gap: 0, padding: '0.5rem'}}>
                            <div className="table-header" style={{display: 'flex', flexWrap: 'wrap', borderBottom: '1px solid #E8E8E8'}}>
                            {['Raw Material', 'Material ID', 'Quantity', 'Units', 'Unit Cost', 'Total Cost'].map((label) => (
                                <div key={label} style={{flex: '1 1 14%', minWidth: 120, padding: '12px', fontWeight: 700, textAlign: 'center', color: '#585757', fontFamily: 'Inter', fontSize: 16}}>{label}</div>
                            ))}
                            </div>

                            {rawMaterials.map((item, idx) => (
                            <div key={idx} className="table-row" style={{display: 'flex', flexWrap: 'wrap', borderBottom: '1px solid #E8E8E8', padding: '12px 0'}}>
                                <div className="table-cell" style={rowCellStyle} data-label="Raw Material">{item.rawMaterial}</div>
                                <div className="table-cell" style={rowCellStyle} data-label="Material ID">{item.materialId}</div>
                                <div className="table-cell" style={rowCellStyle} data-label="Quantity">{item.rmquantity}</div>
                                <div className="table-cell" style={rowCellStyle} data-label="Units">{item.rmunits}</div>
                                <div className="table-cell" style={rowCellStyle} data-label="Unit Cost">₱{parseFloat(item.rmunitCost).toFixed(2)}</div>
                                <div className="table-cell" style={rowCellStyle} data-label="Total Cost">₱{parseFloat(item.rmtotalCost).toFixed(2)}</div>
                            </div>
                            ))}
                        </div>
                    </div>

                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12,width: '100%'}}>
                        <div style={{width: '100%', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem',}}>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent:'center' }}>
                                    <div style={{padding: '6px 24px', background: 'white', borderRadius: 20, boxShadow: '0px 4px 7.5px 1px rgba(0, 0, 0, 0.25)', display: 'flex', alignItems: 'center', gap: 10,}}>
                                        <span style={{ fontWeight: 500, color: '#585757' }}><b>Total Cost Of Raw Material:</b></span>
                                        <span style={{ fontWeight: 500, color: '#585757' }}>₱{totalCostofRawMaterial}</span>

                                    </div>
                                </div>
                        </div>

                        <button onClick={() => { setRawMaterial(false); setSelectedProductId(null); }} style={{height: 40, padding: '8px 24px', background: 'white', borderRadius: 8, outline: '1.5px #A4A4A4 solid', display: 'flex', alignItems: 'center', gap: 10}}>
                            <div className="MRPIcon3" style={{ width: 15, height: 21 }} />
                            <span style={{ color: '#969696', fontSize: 20, fontFamily: 'Inter', fontWeight: '500', textTransform: 'capitalize'}}>Back</span>
                        </button>
                    </div>
                </div>
            </div>
            )}
            
            {additionalcost && (
            <div className="bom-print-modal">
                <div className="fixed inset-0 flex items-center justify-center">
                    <div style={{width: '90vw', maxWidth: 767, background: 'white', borderRadius: 10, padding: '2rem', boxShadow: '0px 4px 7.5px 1px rgba(0,0,0,0.25)', display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
                        <div style={{ fontSize: 'clamp(22px, 3vw, 35px)', fontWeight: 500, textAlign: 'center', color: '#130101' }}>Additional Costs</div>

                        <div className="reqplan-table-scroll2" style={{width: '100%', maxHeight: 450, overflowY: 'auto', background: 'white', borderRadius: 20, boxShadow: '0px 4px 7.5px 1px rgba(0,0,0,0.25)', padding: 0}}>
                            <div style={{alignSelf: 'stretch', background: 'rgba(255,255,255,0.05)', display: 'inline-flex', width: '100%'}}>
                                <div data-type="Header" style={{flex: '1 1 0', alignSelf: 'stretch', borderBottom: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                    <div style={{alignSelf: 'stretch', padding: '10px 12px', overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                        <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: 700, lineHeight: 1, wordWrap: 'break-word'}}>Type</div>
                                    </div>
                                </div>
                                <div data-type="Header" style={{flex: '1 1 0', alignSelf: 'stretch', borderLeft: '1px #E8E8E8 solid', borderBottom: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                    <div style={{alignSelf: 'stretch', padding: '10px 12px', overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                        <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 19, fontFamily: 'Inter', fontWeight: 700, lineHeight: 1, wordWrap: 'break-word'}}>Cost</div>
                                    </div>
                                </div>
                            </div>

                            <div style={{alignSelf: 'stretch', background: 'white', display: 'inline-flex', width: '100%'}}>
                                <div data-type="Default" style={{flex: '1 1 0', alignSelf: 'stretch', borderBottom: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                <div style={{alignSelf: 'stretch', padding: '10px 12px', overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                    <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: 500, lineHeight: 1, wordWrap: 'break-word'}}>Cost of Products</div>
                                </div>
                                </div>
                                <div data-type="Default" style={{flex: '1 1 0', alignSelf: 'stretch', borderLeft: '1px #E8E8E8 solid', borderBottom: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                <div style={{alignSelf: 'stretch', padding: '10px 12px', overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                    <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: 500, lineHeight: 1, wordWrap: 'break-word'}}>₱{isProjectType === "Project" ? overallTotalCost : isProjectType === "Non Project" ? npOverallProductCost : prinOverallCost}</div>
                                </div>
                                </div>
                            </div>

                            <div style={{alignSelf: 'stretch', background: 'white', display: 'inline-flex', width: '100%'}}>
                                <div data-type="Default" style={{flex: '1 1 0', alignSelf: 'stretch', borderBottom: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                <div style={{alignSelf: 'stretch', padding: '10px 12px', overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                    <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: 500, lineHeight: 1, wordWrap: 'break-word'}}>Cost of Production</div>
                                </div>
                                </div>
                                <div data-type="Default" style={{flex: '1 1 0', alignSelf: 'stretch', borderLeft: '1px #E8E8E8 solid', borderBottom: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                <div style={{alignSelf: 'stretch', padding: '10px 12px', overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                    <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: 500, lineHeight: 1, wordWrap: 'break-word'}}>₱{totalCostOfProduction}</div>
                                </div>
                                </div>
                            </div>

                            <div style={{alignSelf: 'stretch', background: 'white', display: 'inline-flex', width: '100%'}}>
                                <div data-type="Default" style={{flex: '1 1 0', alignSelf: 'stretch', borderBottom: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                    <div style={{alignSelf: 'stretch', padding: '10px 12px', overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                        <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: 500, lineHeight: 1, wordWrap: 'break-word'}}>Labor Cost</div>
                                    </div>
                                </div>
                                <div data-type="Default" style={{flex: '1 1 0', alignSelf: 'stretch', borderLeft: '1px #E8E8E8 solid', borderBottom: '1px #E8E8E8 solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                    <div style={{alignSelf: 'stretch', padding: '10px 12px', overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex'}}>
                                        <div style={{flex: '1 1 0', textAlign: 'center', color: '#585757', fontSize: 18, fontFamily: 'Inter', fontWeight: 500, lineHeight: 1, wordWrap: 'break-word'}}>₱{totalLaborCost}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div style={{width: '100%', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem',}}>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent:'center' }}>
                                    <div style={{padding: '6px 24px', background: 'white', borderRadius: 20, boxShadow: '0px 4px 7.5px 1px rgba(0, 0, 0, 0.25)', display: 'flex', alignItems: 'center', gap: 10,}}>
                                        <span style={{ fontWeight: 500, color: '#585757' }}><b>Total Cost of Whole Order: </b></span>
                                        <span style={{padding: '6px 24px', color: '#585757', fontFamily: 'Inter', fontWeight: 500, }}>₱{totalOrderCost}</span>
                                    </div>
                                    <div style={{padding: '6px 24px', background: 'white', borderRadius: 20, boxShadow: '0px 4px 7.5px 1px rgba(0, 0, 0, 0.25)', display: 'flex', alignItems: 'center', gap: 10,}}>
                                        <span style={{ fontWeight: 500, color: '#585757' }}><b>Order No.: </b></span>
                                        <span style={{padding: '6px 24px', color: '#585757', fontFamily: 'Inter', fontWeight: 500 }}>{selectedRowData.number}</span>
                                    </div>
                                </div>
                        </div>

                        <div
                        style={{width: '100%',  display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto',}}>
                            <button onClick={() => {if (isProjectType === "Project") {setIsOpen2(true);} else if (isProjectType === "Non Project") {setIsOpen3(true);} else {setIsOpen4(true);} setAdditionalCost(false);}} style={buttonStyle2('#fff')}>
                                <div className="MRPIcon3" style={{ width: 15, height: 21, marginRight: 10 }} />
                                <span style={{ color: '#969696' }}>Back</span>
                            </button>

                            <button onClick={() => { setChecker(true); }} style={buttonStyle('#00A8A8', '#00A8A8', 'white')}>
                                <span>Next</span>
                                <div className="MRPIcon5" style={{ width: 13, height: 21, marginLeft: 8 }} />
                            </button>
                        </div>
                        
                    </div>
                </div>
            </div>
            )}

            {checker && (
            <div className="bom-print-modal2">
                <div className="fixed inset-0 flex items-center justify-center px-4">
                <div style={{width: '100%', maxWidth: 660, background: 'white', boxShadow: '0px 4px 7.5px 1px rgba(0,0,0,0.25)', borderRadius: 10, padding: 24, display: 'flex', flexDirection: 'column', gap: 24}}>
                    <div style={{textAlign: 'center', fontSize: 55, fontFamily: 'Inter', fontWeight: 400, color: '#130101', lineHeight: 1.2, letterSpacing: 1.2}}>Are you sure you want <br></br> to create a BOM?</div>
                    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8}}>
                        <div style={{padding: '6px 24px', background: 'white', borderRadius: 20, boxShadow: '0px 4px 7.5px 1px rgba(0, 0, 0, 0.25)', display: 'flex', alignItems: 'center', gap: 10,}}>
                            <span style={{ fontWeight: 500, color: '#585757' }}><b>Order No.: </b></span>
                            <span style={{padding: '6px 24px', color: '#585757', fontFamily: 'Inter', fontWeight: 500 }}>{selectedRowData.number}</span>
                        </div>
                    </div>
                    <div style={{width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto'}}>
                    <button onClick={() => setChecker(false)} style={buttonStyle2('#fff')}>
                        <div className="MRPIcon3" style={{width: 15, height: 21, marginRight: 10}} />
                        <span style={{color: '#969696'}}>Back</span>
                    </button>
                    <button onClick={() => {isProjectType === "Project" ? sendProjectData() : isProjectType === "Non Project" ? sendNonProjectData() : sendPrincipalData(),setCreated(true), setChecker(false), setAdditionalCost(false), setAdditionalCost2(false), setIsOpen(false), setIsOpen2(false)}} style={buttonStyle('#00A8A8', '#00A8A8', 'white')}>
                        <span>Create BOM</span>
                        <div className="MRPIcon5" style={{width: 13, height: 21, marginLeft: 8}} />
                    </button>
                    </div>
                </div>
                </div>
            </div>
            )}

            {created && (
            <div className="bom-print-modal">
                <div className="fixed inset-0 flex items-center justify-center px-4">
                <div style={{width: '100%', maxWidth: 525, background: 'white', boxShadow: '0px 4px 7.5px 1px rgba(0,0,0,0.25)', borderRadius: 10, padding: 24, display: 'flex', flexDirection: 'column', gap: 24, position: 'relative'}}>
                    <img style={{width: 171, height: 171, margin: '0 auto'}} src="public/icons/module-icons/MRP-icons/MRPCheck.png" />
                    <div style={{textAlign: 'center', fontSize: 28, fontFamily: 'Inter', fontWeight: 400, color: '#130101', letterSpacing: 1.2, textTransform: 'capitalize'}}>Bills of Material Created</div>
                    <div style={{textAlign: 'center', fontSize: 14, fontFamily: 'Inter', fontWeight: 400, color: '#130101', textTransform: 'capitalize', letterSpacing: 0.56}}>The BOM is sent to the sales for approval, <br />go to pending for more information</div>
                    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8}}>
                        <div style={{padding: '6px 24px', background: 'white', borderRadius: 20, boxShadow: '0px 4px 7.5px 1px rgba(0, 0, 0, 0.25)', display: 'flex', alignItems: 'center', gap: 10,}}>
                            <span style={{ fontWeight: 500, color: '#585757' }}><b>Order No.: </b></span>
                            <span style={{padding: '6px 24px', color: '#585757', fontFamily: 'Inter', fontWeight: 500 }}>{selectedRowData.number}</span>
                        </div>
                    </div>
                    <div style={{width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto'}}>
                    <button onClick={() => setCreated(false)} style={buttonStyle2('#fff')}>
                        <div className="MRPIcon3" style={{width: 15, height: 21, marginRight: 10}} />
                        <span style={{color: '#969696'}}>Close</span>
                    </button>
                    <button onClick={() => {setIsOpen2(false), setIsOpen(false), setChecker(false), setCreated(false), setAdditionalCost(false), setAdditionalCost2(false), setRawMaterial(false), setActiveSubModule('Bills Of Material'), loadSubModule('Bills Of Material')}} style={buttonStyle('#00A8A8', '#00A8A8', 'white')}>
                        <span>Go to BOM</span>
                        <div className="MRPIcon5" style={{width: 13, height: 21, marginLeft: 8}} />
                    </button>
                    </div>
                </div>
                </div>
            </div>
            )}


            
        </div>
    );
};

export default BodyContent;