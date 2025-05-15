import React, { useState, useEffect } from "react";
import UserManagememnt from "./submodules/User";
import ItemMasterlist from "./submodules/ItemMasterlist";
import BusinessPartnerMasterlist from "./submodules/BusinessPartnerMasterlist";
import CountUp from "react-countup";
import {
  UserOutlined,
  HomeOutlined,
  FileTextOutlined,
  FileSearchOutlined,
  LoadingOutlined,
  DollarOutlined
} from "@ant-design/icons";

// Import only available API services
import {
  userAPI,
  roleAPI,
  policiesAPI,
  businessPartnerAPI,
  vendorAPI,
  auditLogAPI,
  currencyAPI,
  warehouseAPI
} from "../Administration/api/api";

// Import styles
import "./styles/Administration.css";

const Administration = ({ setActiveSubModule, loadSubModule }) => {
  // State variables for dashboard data
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState(0);
  const [policies, setPolicies] = useState(0);
  const [partners, setPartners] = useState(0);
  const [vendors, setVendors] = useState(0);
  const [auditLogs, setAuditLogs] = useState(0);
  const [warehouses, setWarehouses] = useState(0);
  const [exchangeRate, setExchangeRate] = useState(0);
  const [currency, setCurrency] = useState("PHP");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch all data in parallel - only using available APIs
        const [
          usersData,
          partnersData,
          vendorsData,
          policiesData,
          logsData,
          warehousesData,
          currenciesData
        ] = await Promise.all([
          userAPI.getUsers(),
          businessPartnerAPI.getBusinessPartners(),
          vendorAPI.getVendors(),
          policiesAPI.getPolicies(),
          auditLogAPI.getAuditLogs(),
          warehouseAPI.getWarehouses(),
          currencyAPI.getActiveCurrencies()
        ]);

        // Set state with fetched data counts
        setUsers(usersData.count || usersData.length || 0);
        setPartners(partnersData.count || partnersData.length || 0);
        setVendors(vendorsData.count || vendorsData.length || 0);
        setPolicies(policiesData.count || policiesData.length || 0);
        setAuditLogs(logsData.count || logsData.length || 0);
        setWarehouses(warehousesData.count || warehousesData.length || 0);

        // Find USD exchange rate
        const usdCurrency = currenciesData.results?.find(c => c.currency_name === "USD") ||
                           currenciesData.find(c => c.currency_name === "USD");
       
        if (usdCurrency) {
          setExchangeRate(usdCurrency.exchange_rate || 0);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        // Set loading to false immediately after data is fetched
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Function to navigate to modules
  const handleClick = (module, tab = null) => {
    setActiveSubModule(module);
    loadSubModule(module);
    if (tab) {
      setTimeout(() => {
        const tabBtn = document.querySelector(`[data-tab="${tab}"]`);
        if (tabBtn) tabBtn.click();
      }, 100);
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-container">
        <div className="admin-dashboard-container">
          <div className="page-header">
            <h1 className="text-2xl font-bold ml-6 mt-6 text-theme">Administration Dashboard</h1>
            <div className="header-divider"></div>
          </div>
          
          <div className="dashboard-content">
            <div className={`dashboard-cards grid grid-cols-1 ${windowWidth >= 768 ? 'md:grid-cols-2' : ''} ${windowWidth >= 1024 ? 'lg:grid-cols-3' : ''} gap-5`}>
            {/* Exchange Rate Card */}
            <div 
              onClick={() => handleClick("Currency")} 
              className="dashboard-card cursor-pointer border border-gray-200 rounded-lg shadow-sm p-5 flex items-center gap-4 bg-white hover:bg-blue-100 transition duration-300"
            >
              <div className="text-3xl p-3 rounded-full bg-green-100 text-green-600">
                <DollarOutlined />
              </div>
              <div>
                <p className="font-medium">Exchange Rate (PHP to USD)</p>
                <p className="text-2xl font-bold">
                  {loading ? <LoadingOutlined /> : <CountUp end={exchangeRate} decimals={6} />}
                </p>
                <p className="text-sm text-gray-500 flex items-center">
                  Latest Rate
                  <span className="ml-2 px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">Live</span>
                </p>
              </div>
            </div>

            {/* User Management */}
            <div 
              onClick={() => handleClick("User")} 
              className="dashboard-card cursor-pointer border border-gray-200 rounded-lg shadow-sm p-5 flex items-center gap-4 bg-white hover:bg-blue-100 transition duration-300"
            >
              <div className="text-3xl p-3 rounded-full bg-purple-100 text-purple-600">
                <UserOutlined />
              </div>
              <div>
                <p className="font-medium">Users</p>
                <p className="text-2xl font-bold">{loading ? <LoadingOutlined /> : users}</p>
                <p className="text-sm text-gray-500">Active Users</p>
              </div>
            </div>

            {/* Warehouse */}
            <div 
              onClick={() => handleClick("Warehouse")} 
              className="dashboard-card cursor-pointer border border-gray-200 rounded-lg shadow-sm p-5 flex items-center gap-4 bg-white hover:bg-blue-100 transition duration-300"
            >
              <div className="text-3xl p-3 rounded-full bg-green-100 text-green-600">
                <HomeOutlined />
              </div>
              <div>
                <p className="font-medium">Warehouse</p>
                <p className="text-2xl font-bold">{loading ? <LoadingOutlined /> : warehouses}</p>
                <p className="text-sm text-gray-500">Records</p>
              </div>
            </div>

            {/* Policy */}
            <div 
              onClick={() => handleClick("Policy")} 
              className="dashboard-card cursor-pointer border border-gray-200 rounded-lg shadow-sm p-5 flex items-center gap-4 bg-white hover:bg-blue-100 transition duration-300"
            >
              <div className="text-3xl p-3 rounded-full bg-cyan-100 text-cyan-600">
                <FileTextOutlined />
              </div>
              <div>
                <p className="font-medium">Policy</p>
                <p className="text-2xl font-bold">{loading ? <LoadingOutlined /> : policies}</p>
                <p className="text-sm text-gray-500">Records</p>
              </div>
            </div>

            {/* Audit Logs */}
            <div 
              onClick={() => handleClick("Audit Logs")} 
              className="dashboard-card cursor-pointer border border-gray-200 rounded-lg shadow-sm p-5 flex items-center gap-4 bg-white hover:bg-blue-100 transition duration-300"
            >
              <div className="text-3xl p-3 rounded-full bg-red-100 text-red-600">
                <FileSearchOutlined />
              </div>
              <div>
                <p className="font-medium">Audit Logs</p>
                <p className="text-2xl font-bold">{loading ? <LoadingOutlined /> : auditLogs}</p>
                <p className="text-sm text-gray-500">Records</p>
              </div>
            </div>

            {/* Business Partner Masterlist */}
            <div 
              onClick={() => handleClick("Business Partner Masterlist")} 
              className="dashboard-card cursor-pointer border border-gray-200 rounded-lg shadow-sm p-5 flex items-center gap-4 bg-white hover:bg-blue-100 transition duration-300"
            >
              <div className="text-3xl p-3 rounded-full bg-yellow-100 text-yellow-600">
                <UserOutlined />
              </div>
              <div>
                <p className="font-medium">Business Partner Masterlist</p>
                <p className="text-2xl font-bold">{loading ? <LoadingOutlined /> : partners}</p>
                <p className="text-sm text-gray-500">Records</p>
              </div>
            </div>
          </div>
          

            <UserManagememnt />

            <ItemMasterlist />

            <BusinessPartnerMasterlist />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Administration;