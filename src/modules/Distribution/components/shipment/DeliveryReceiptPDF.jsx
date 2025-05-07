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
          fetch('http://127.0.0.1:8000/api/carriers/'),
          fetch('http://127.0.0.1:8000/api/employees/')
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
    
    // Skip the check and force lookup in employees array
    const employee = employees.find(emp => emp.employee_id === employeeId);
    
    // ALWAYS return a name, never return the ID
    if (employee && employee.full_name) {
      return employee.full_name;
    }
    
    // If no match found, return a placeholder name
    return "Carrier #" + employeeId.substring(employeeId.length - 5);
  };
  
  // Modified function to get carrier name
  const getCarrierName = (carrierId) => {
    if (!carrierId) return 'Unassigned Carrier';
    
    const carrier = carriers.find(c => c.carrier_id === carrierId);
    
    if (!carrier || !carrier.carrier_name) {
      // If no carrier found, return a placeholder
      return "Carrier #" + carrierId.substring(carrierId.length - 5);
    }
    
    // Always use employee name function, never return raw IDs
    return getEmployeeNameById(carrier.carrier_name);
  };
  
  const generatePDF = () => {
    const element = document.getElementById('delivery-receipt');
    
    const options = {
      margin: [5, 10, 5, 10],
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
  
  // Format currency
  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return 'N/A';
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    let date;
    if (typeof dateString === 'string') {
      // Handle ISO date string
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
      fontFamily: 'Arial, Helvetica, sans-serif',
      color: '#333',
      fontSize: '12px',
      lineHeight: '1.4',
      padding: '0',
      margin: '0'
    },
    container: {
      maxWidth: '100%',
      padding: '15px 20px',
      boxSizing: 'border-box'
    },
    header: {
      borderBottom: '1px solid #e0e0e0',
      paddingBottom: '10px',
      marginBottom: '15px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    logo: {
      height: '40px',
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
      color: '#2563eb',
      margin: '0',
      flex: '1'
    },
    receiptMeta: {
      margin: '2px 0',
      color: '#64748b',
      fontSize: '11px',
      textAlign: 'right'
    },
    sectionTitle: {
      color: '#2563eb',
      fontSize: '16px',
      fontWeight: 'bold',
      margin: '15px 0 8px 0',
      borderBottom: '1px solid #e0e0e0',
      paddingBottom: '3px'
    },
    infoSection: {
      marginBottom: '15px'
    },
    infoGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '10px'
    },
    infoRow: {
      margin: '4px 0',
      display: 'flex'
    },
    label: {
      fontWeight: 'bold',
      color: '#64748b',
      width: '90px',
      display: 'inline-block',
      fontSize: '11px'
    },
    value: {
      fontWeight: '500'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      margin: '10px 0',
      fontSize: '11px'
    },
    th: {
      backgroundColor: '#f8fafc',
      padding: '8px 10px',
      textAlign: 'left',
      fontWeight: 'bold',
      color: '#2563eb',
      borderBottom: '2px solid #e2e8f0'
    },
    td: {
      padding: '8px 10px',
      borderBottom: '1px solid #e2e8f0'
    },
    evenRow: {
      backgroundColor: '#f8fafc'
    },
    footer: {
      marginTop: '20px',
      borderTop: '1px solid #e0e0e0',
      paddingTop: '15px'
    },
    signatures: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '15px'
    },
    signatureBox: {
      width: '45%'
    },
    signatureLine: {
      borderBottom: '1px solid #ccc',
      marginBottom: '5px',
      height: '25px'
    },
    signatureText: {
      textAlign: 'center',
      fontSize: '11px',
      color: '#64748b'
    },
    notes: {
      fontStyle: 'italic',
      color: '#64748b',
      fontSize: '11px',
      textAlign: 'center',
      marginTop: '15px'
    },
    badge: {
      display: 'inline-block',
      padding: '2px 8px',
      borderRadius: '4px',
      fontSize: '11px',
      fontWeight: 'bold',
      backgroundColor: '#dbeafe',
      color: '#2563eb'
    },
    button: {
      backgroundColor: '#2563eb',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '4px',
      cursor: 'pointer',
      fontWeight: 'bold',
      marginBottom: '15px'
    },
    warehouseList: {
      margin: '0',
      padding: '0',
      listStyle: 'none'
    },
    warehouseItem: {
      marginBottom: '4px',
      fontSize: '10px',
      color: '#64748b'
    }
  };

  const today = formatDate(new Date());

  return (
    <div>
      <button onClick={generatePDF} style={styles.button}>
        Download Receipt PDF
      </button>
      
      <div id="delivery-receipt" style={styles.page}>
        <div style={styles.container}>
          <div style={styles.header}>
            <div style={styles.titleContainer}>
              <img 
                src="/distribution-pdf-assets/kinetiq-logo.png" 
                alt="Kinetiq Logo"
                style={styles.logo}
              />
              <div style={styles.title}>Delivery Receipt</div>
            </div>
            <div>
              <div style={styles.receiptMeta}>Receipt #: {deliveryData.receipt_id || 'N/A'}</div>
              <div style={styles.receiptMeta}>Date: {formatDate(deliveryData.delivery_date) || today}</div>
              {deliveryData.tracking_number && (
                <div style={styles.receiptMeta}>Tracking: {deliveryData.tracking_number}</div>
              )}
            </div>
          </div>
          
          <div style={styles.infoSection}>
            <div style={styles.sectionTitle}>Customer Information</div>
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
          
          <div style={styles.infoSection}>
            <div style={styles.sectionTitle}>Delivery Details</div>
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
                <div style={styles.infoRow}>
                  <span style={styles.label}>Amount:</span>
                  <span style={styles.value}>{formatCurrency(deliveryData.total_amount)}</span>
                </div>
              )}
            </div>
          </div>
          
          <div style={styles.infoSection}>
            <div style={styles.sectionTitle}>Order Items</div>
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
                      <td style={styles.td}>{item.item_name || item.name}</td>
                      <td style={styles.td}>{item.quantity}</td>
                      <td style={styles.td}>
                        {item.warehouse_name || 'N/A'}
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="3" style={{...styles.td, textAlign: 'center'}}>No items listed</td>
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
              <div>{deliveryData.notes || 'Thank you for your business!'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryReceipt;