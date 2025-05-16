import React, { useState, useEffect } from 'react';
import html2pdf from 'html2pdf.js';

const DeliveryReceipt = ({ deliveryData = {} }) => {
  const [carriers, setCarriers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [carriersResponse, employeesResponse] = await Promise.all([
          fetch('http://r7d8au0l77.execute-api.ap-southeast-1.amazonaws.com/dev/api/carriers/'),
          fetch('http://r7d8au0l77.execute-api.ap-southeast-1.amazonaws.com/dev/api/carrier-employees/')
        ]);
        
        const carriersData = await carriersResponse.json();
        const employeesData = await employeesResponse.json();
        
        setCarriers(carriersData);
        setEmployees(employeesData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const getEmployeeNameById = (employeeId) => {
    if (!employeeId) return 'Unassigned Carrier';
    
    const employee = employees.find(emp => emp.employee_id === employeeId);
    
    if (employee && employee.full_name) {
      return employee.full_name;
    }
    
    return "Carrier #" + employeeId.substring(employeeId.length - 5);
  };
  
  const getCarrierName = (carrierId) => {
    if (!carrierId) return 'Unassigned Carrier';
    
    const carrier = carriers.find(c => c.carrier_id === carrierId);
    
    if (!carrier || !carrier.carrier_name) {
      return "Carrier #" + carrierId.substring(carrierId.length - 5);
    }
    
    return getEmployeeNameById(carrier.carrier_name);
  };
  
  const generatePDF = () => {
    const element = document.getElementById('delivery-receipt');
    
    const options = {
      margin: [10, 15, 10, 15],
      filename: `delivery-receipt-${deliveryData.receipt_id || 'new'}.pdf`,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      enableLinks: true
    };
    
    html2pdf().from(element).set(options).save();
  };
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return 'N/A';
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    let date;
    if (typeof dateString === 'string') {
      date = new Date(dateString);
    } else {
      date = dateString;
    }
    
    if (isNaN(date.getTime())) return dateString;
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const styles = {
    page: {
      fontFamily: 'Roboto, Helvetica, sans-serif',
      color: '#334155',
      fontSize: '12px',
      lineHeight: '1.5',
      padding: '0',
      margin: '0',
      backgroundColor: '#ffffff'
    },
    container: {
      maxWidth: '100%',
      padding: '25px',
      boxSizing: 'border-box',
      boxShadow: '0 0 10px rgba(0,0,0,0.05)',
      borderRadius: '8px'
    },
    headerWrapper: {
      background: 'linear-gradient(to right, rgba(0,168,166,0.05), rgba(0,168,166,0.0))',
      borderRadius: '6px',
      padding: '15px 20px',
      marginBottom: '20px'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '2px solid rgba(0,168,166,0.3)',
      paddingBottom: '15px'
    },
    logo: {
      height: '45px',
      marginRight: '15px'
    },
    titleContainer: {
      display: 'flex',
      alignItems: 'center',
      flex: '1'
    },
    title: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: '#00a8a6',
      margin: '0',
      flex: '1',
      letterSpacing: '0.5px'
    },
    receiptMeta: {
      margin: '3px 0',
      color: '#64748b',
      fontSize: '12px',
      textAlign: 'right'
    },
    receiptId: {
      fontSize: '14px',
      fontWeight: 'bold',
      color: '#00a8a6',
      marginBottom: '5px'
    },
    sectionTitle: {
      color: '#00a8a6',
      fontSize: '16px',
      fontWeight: 'bold',
      margin: '20px 0 10px 0',
      borderBottom: '1px solid rgba(0,168,166,0.2)',
      paddingBottom: '5px',
      display: 'flex',
      alignItems: 'center',
      lineHeight: '24px' // Ensures consistent height for all section titles
    },
    sectionIcon: {
      marginRight: '8px',
      width: '18px',
      height: '18px'
    },
    card: {
      backgroundColor: '#f8fafc',
      borderRadius: '6px',
      padding: '15px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      marginBottom: '15px',
      border: '1px solid rgba(0,168,166,0.1)'
    },
    infoGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '12px'
    },
    infoRow: {
      margin: '6px 0',
      display: 'flex',
      alignItems: 'center' // Ensures vertical alignment within rows
    },
    label: {
      fontWeight: 'bold',
      color: '#475569',
      width: '100px',
      display: 'inline-block',
      fontSize: '12px',
      alignSelf: 'center' // Ensures vertical centering
    },
    value: {
      fontWeight: '500',
      color: '#334155'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      margin: '15px 0',
      fontSize: '12px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      borderRadius: '6px',
      overflow: 'hidden'
    },
    th: {
      backgroundColor: 'rgba(0,168,166,0.1)',
      padding: '10px 12px',
      textAlign: 'left',
      fontWeight: 'bold',
      color: '#00a8a6',
      borderBottom: '2px solid rgba(0,168,166,0.3)'
    },
    td: {
      padding: '10px 12px',
      borderBottom: '1px solid #e2e8f0'
    },
    evenRow: {
      backgroundColor: '#f8fafc'
    },
    footer: {
      marginTop: '25px',
      borderTop: '1px solid #e0e0e0',
      paddingTop: '20px',
      background: 'linear-gradient(to bottom, rgba(0,168,166,0.02), rgba(0,168,166,0.0))',
      borderRadius: '0 0 6px 6px',
      padding: '15px'
    },
    signatures: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '15px',
      gap: '25px'
    },
    signatureBox: {
      width: '45%',
      backgroundColor: 'white',
      padding: '10px',
      borderRadius: '4px',
      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
      border: '1px dashed #cbd5e1'
    },
    signatureLine: {
      borderBottom: '1px solid #94a3b8',
      marginBottom: '8px',
      height: '30px'
    },
    signatureText: {
      textAlign: 'center',
      fontSize: '11px',
      color: '#64748b',
      fontWeight: '500'
    },
    notes: {
      fontStyle: 'italic',
      color: '#64748b',
      fontSize: '11px',
      textAlign: 'center',
      marginTop: '20px',
      backgroundColor: 'rgba(0,168,166,0.03)',
      padding: '10px',
      borderRadius: '4px'
    },
    badge: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3px 10px',
      borderRadius: '999px',
      fontSize: '11px',
      fontWeight: 'bold',
      backgroundColor: 'rgba(0,168,166,0.15)',
      color: '#00a8a6',
      height: '22px', // Fixed height for consistent alignment
      lineHeight: '22px' // Consistent line height
    },
    button: {
      backgroundColor: '#00a8a6',
      color: 'white',
      border: 'none',
      padding: '12px 24px',
      borderRadius: '4px',
      cursor: 'pointer',
      fontWeight: 'bold',
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      boxShadow: '0 2px 4px rgba(0,168,166,0.3)',
      transition: 'all 0.2s ease'
    },
    warehouseList: {
      margin: '2px 0 0 0',
      padding: '0',
      listStyle: 'none'
    },
    warehouseItem: {
      marginBottom: '4px',
      fontSize: '11px',
      color: '#64748b',
      display: 'flex',
      alignItems: 'center', // Centers the dot with text
      lineHeight: '1.4' // Consistent line height
    },
    warehouseDot: {
      display: 'inline-block',
      width: '6px',
      height: '6px',
      borderRadius: '50%',
      backgroundColor: 'rgba(0,168,166,0.5)',
      marginRight: '6px',
      verticalAlign: 'middle', // Aligns dot with text
      marginTop: '-2px' // Fine-tune vertical position
    },
    brandAccent: {
      borderLeft: '3px solid #00a8a6',
      paddingLeft: '12px'
    },
    healthIcon: {
      width: '16px',
      height: '16px',
      marginRight: '8px',
      verticalAlign: 'text-bottom', // Fixed icon vertical alignment
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  };

  const today = formatDate(new Date());

  return (
    <div>
      <button onClick={generatePDF} style={styles.button}>
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Download Receipt PDF
      </button>
      
      <div id="delivery-receipt" style={styles.page}>
        <div style={styles.container}>
          <div style={styles.headerWrapper}>
            <div style={styles.header}>
              <div style={styles.titleContainer}>
                <img 
                  src="/distribution-pdf-assets/kinetiq-logo.png" 
                  alt="Kinetiq Logo"
                  style={styles.logo}
                />
                <div>
                  <div style={styles.title}>Delivery Receipt</div>
                  <div style={{fontSize: '12px', color: '#64748b'}}>Healthcare Logistics & Distribution</div>
                </div>
              </div>
              <div>
                <div style={styles.receiptId}>Receipt #: {deliveryData.receipt_id || 'N/A'}</div>
                <div style={styles.receiptMeta}>Date: {formatDate(deliveryData.delivery_date) || today}</div>
                {deliveryData.tracking_number && (
                  <div style={styles.receiptMeta}>Tracking: {deliveryData.tracking_number}</div>
                )}
              </div>
            </div>
          </div>
          
          <div style={styles.card}>
            <div style={{...styles.sectionTitle, marginTop: '0'}}>
              <svg style={styles.healthIcon} viewBox="0 0 24 24" fill="none" stroke="#00a8a6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Customer Information
            </div>
            <div style={styles.infoGrid}>
              <div style={styles.infoRow}>
                <span style={styles.label}>Name:</span>
                <span style={styles.value}>{deliveryData.customer_name || 'N/A'}</span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.label}>Address:</span>
                <span style={styles.value}>{deliveryData.delivery_address || 'N/A'}</span>
              </div>
            </div>
          </div>
          
          <div style={styles.card}>
            <div style={{...styles.sectionTitle, marginTop: '0'}}>
              <svg style={styles.healthIcon} viewBox="0 0 24 24" fill="none" stroke="#00a8a6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Delivery Details
            </div>
            <div style={styles.infoGrid}>
              <div style={styles.infoRow}>
                <span style={styles.label}>Order ID:</span>
                <span style={styles.value}>{deliveryData.order_id || 'N/A'}</span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.label}>Service:</span>
                <span style={styles.value}>
                  <span style={styles.badge}>
                    {deliveryData.carrier_service_type || 'Standard'}
                  </span>
                </span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.label}>Carrier:</span>
                <span style={styles.value}>
                  {deliveryData.carrier_id ? 
                    getCarrierName(deliveryData.carrier_id) : 
                    (deliveryData.carrier_name || 'N/A')}
                </span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.label}>Packed By:</span>
                <span style={styles.value}>{deliveryData.packer_id || 'N/A'}</span>
              </div>
              {deliveryData.source_warehouses && deliveryData.source_warehouses.length > 0 ? (
                <div style={{...styles.infoRow, gridColumn: '1 / span 2'}}>
                  <span style={styles.label}>From:</span>
                  <span style={styles.value}>
                    <ul style={styles.warehouseList}>
                      {deliveryData.source_warehouses.map((warehouse, idx) => (
                        <li key={idx} style={styles.warehouseItem}>
                          <span style={styles.warehouseDot}></span>
                          {warehouse.name || warehouse.location}
                        </li>
                      ))}
                    </ul>
                  </span>
                </div>
              ) : deliveryData.source_location ? (
                <div style={styles.infoRow}>
                  <span style={styles.label}>From:</span>
                  <span style={styles.value}>{deliveryData.source_location}</span>
                </div>
              ) : null}
              {deliveryData.total_amount && (
                <div style={{...styles.infoRow, fontWeight: 'bold'}}>
                  <span style={styles.label}>Amount:</span>
                  <span style={{...styles.value, color: '#00a8a6'}}>{formatCurrency(deliveryData.total_amount)}</span>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <div style={styles.sectionTitle}>
              <svg style={styles.healthIcon} viewBox="0 0 24 24" fill="none" stroke="#00a8a6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Order Items
            </div>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={{...styles.th, width: '50%'}}>Item</th>
                  <th style={{...styles.th, width: '15%'}}>Quantity</th>
                  <th style={{...styles.th, width: '35%'}}>Warehouse</th>
                </tr>
              </thead>
              <tbody>
                {deliveryData.items && deliveryData.items.length > 0 ? 
                  deliveryData.items.map((item, index) => (
                    <tr key={index} style={index % 2 === 1 ? styles.evenRow : {}}>
                      <td style={{...styles.td, fontWeight: '500'}}>{item.item_name || item.name}</td>
                      <td style={styles.td}>{item.quantity}</td>
                      <td style={styles.td}>
                        {item.warehouse_name || 'N/A'}
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="3" style={{...styles.td, textAlign: 'center', padding: '20px'}}>No items listed</td>
                    </tr>
                  )
                }
              </tbody>
            </table>
          </div>
          
          <div style={styles.footer}>
            <div style={styles.signatures}>
              <div style={styles.signatureBox}>
                <div style={styles.signatureLine}></div>
                <div style={styles.signatureText}>Customer Signature</div>
              </div>
              <div style={styles.signatureBox}>
                <div style={styles.signatureLine}></div>
                <div style={styles.signatureText}>Carrier Signature</div>
              </div>
            </div>
            <div style={styles.notes}>
              <svg style={{...styles.healthIcon, marginRight: '5px'}} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {deliveryData.notes || 'Thank you for choosing our healthcare delivery service!'}
            </div>
            
            <div style={{textAlign: 'center', marginTop: '20px', fontSize: '10px', color: '#94a3b8'}}>
              <div>Kinetiq Healthcare Distribution • Quality Medical Logistics</div>
              <div style={{marginTop: '4px'}}>For assistance: support@kinetiq.healthcare • 1-800-KINETIQ</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryReceipt;