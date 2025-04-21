import React, { useState, useEffect } from "react";
import CountUp from "react-countup";
import {
  AppstoreOutlined,
  ToolOutlined,
  ShoppingOutlined,
  ExperimentOutlined,
  UserOutlined,
  ShopOutlined,
  HomeOutlined,
  FileTextOutlined,
  FileSearchOutlined,
  LoadingOutlined,
  DollarOutlined
} from "@ant-design/icons";

// Import API services
import { 
  userAPI, 
  roleAPI,
  policiesAPI, 
  assetsAPI, 
  productsAPI, 
  rawMaterialsAPI, 
  businessPartnerAPI,
  vendorAPI,
  auditLogAPI,
  currencyAPI,
  warehouseAPI
} from "../Administration/api/api";

const Administration = ({ setActiveSubModule, loadSubModule }) => {
  // State variables for dashboard data
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState(0);
  const [assets, setAssets] = useState(0);
  const [products, setProducts] = useState(0);
  const [rawMaterials, setRawMaterials] = useState(0);
  const [partners, setPartners] = useState(0);
  const [vendors, setVendors] = useState(0);
  const [policies, setPolicies] = useState(0);
  const [auditLogs, setAuditLogs] = useState(0);
  const [warehouses, setWarehouses] = useState(0);
  const [exchangeRate, setExchangeRate] = useState(0);
  const [currency, setCurrency] = useState("PHP");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch all data in parallel
        const [
          usersData,
          assetsData,
          productsData,
          rawMaterialsData,
          partnersData,
          vendorsData,
          policiesData,
          logsData,
          warehousesData,
          currenciesData
        ] = await Promise.all([
          userAPI.getUsers(),
          assetsAPI.getAssets(),
          productsAPI.getProducts(),
          rawMaterialsAPI.getRawMaterials(),
          businessPartnerAPI.getBusinessPartners(),
          vendorAPI.getVendors(),
          policiesAPI.getPolicies(),
          auditLogAPI.getAuditLogs(),
          warehouseAPI.getWarehouses(),
          currencyAPI.getActiveCurrencies()
        ]);

        // Set state with fetched data counts
        setUsers(usersData.count || usersData.length || 0);
        setAssets(assetsData.count || assetsData.length || 0);
        setProducts(productsData.count || productsData.length || 0);
        setRawMaterials(rawMaterialsData.count || rawMaterialsData.length || 0);
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
    <div className="admin">
        <div className="admin custom-scroll">
          {/* Dashboard Title */}
          <h1 className="text-2xl font-bold mb-6 w-full text-center flex items-center justify-center">
            <span className="text-[#00A8A8] mr-2">Administration</span> Dashboard
          </h1>

          {loading ? (
            <div className="admin body-content-container flex items-center justify-center">
              <LoadingOutlined className="text-[#00A8A8] text-4xl" />
              <p className="ml-3">Loading dashboard data...</p>
            </div>
          ) : (
            <>
              {/* Top Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mb-4">
                <div onClick={() => handleClick("User")} className="admin module-card bg-white rounded-lg p-5 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] shadow-md border border-teal-200">
                  <div className="flex items-center">
                    <div className="bg-[#00A8A8] bg-opacity-10 rounded-full p-3 mr-4">
                      <UserOutlined className="text-2xl text-[#00A8A8]" />
                    </div>
                    <div>
                      <p className="text-gray-600 font-medium mb-1">User & Roles</p>
                      <p className="text-2xl font-bold"><CountUp end={users} duration={1.5} /></p>
                      <p className="text-sm text-gray-500">Employees</p>
                    </div>
                  </div>
                </div>

                <div onClick={() => handleClick("Currency")} className="admin module-card bg-white rounded-lg p-5 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] shadow-md border border-blue-200">
                    <div className="flex items-center">
                        <div className="bg-[#00A8A8] bg-opacity-10 rounded-full p-3 mr-4">
                        <DollarOutlined className="text-2xl text-[#00A8A8]" />
                        </div>
                        <div>
                        <p className="text-gray-600 font-medium mb-1">Exchange Rate (PHP to USD)</p>
                        <p className="text-2xl font-bold">₱ <CountUp end={exchangeRate} decimals={6} duration={1.5} preserveValue={true} /></p>
                        <p className="text-sm text-gray-500 flex items-center">
                            Latest Rate 
                            <span className="ml-2 px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">Live</span>
                        </p>
                        </div>
                    </div>
                </div>

                <div onClick={() => handleClick("Warehouse")} className="admin module-card bg-white rounded-lg p-5 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] shadow-md border border-teal-200">
                  <div className="flex items-center">
                    <div className="bg-[#00A8A8] bg-opacity-10 rounded-full p-3 mr-4">
                      <HomeOutlined className="text-2xl text-[#00A8A8]" />
                    </div>
                    <div>
                      <p className="text-gray-600 font-medium mb-1">Warehouse</p>
                      <p className="text-2xl font-bold"><CountUp end={warehouses} duration={1.5} /></p>
                      <p className="text-sm text-gray-500">Locations</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Middle Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mb-4">
                <div onClick={() => handleClick("Item Masterlist")} className="admin module-card bg-white rounded-lg p-5 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] shadow-md border border-sky-200">
                  <div className="flex items-center">
                    <div className="bg-[#00A8A8] bg-opacity-10 rounded-full p-3 mr-4">
                      <AppstoreOutlined className="text-2xl text-[#00A8A8]" />
                    </div>
                    <div>
                      <p className="text-gray-600 font-medium mb-1">Item Masterlist</p>
                      <p className="text-2xl font-bold"><CountUp end={assets + products + rawMaterials} duration={1.5} /></p>
                      <p className="text-sm text-gray-500">Records</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div onClick={() => handleClick("Item Masterlist", "Assets")} className="admin module-card bg-white rounded-lg p-3 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] shadow-md border border-amber-200">
                    <div className="flex items-center">
                      <div className="bg-[#00A8A8] bg-opacity-10 rounded-full p-2 mr-3">
                        <ToolOutlined className="text-xl text-[#00A8A8]" />
                      </div>
                      <div>
                        <p className="text-gray-600 font-medium mb-1">Assets</p>
                        <p className="text-xl font-bold"><CountUp end={assets} duration={1.5} /></p>
                        <p className="text-xs text-gray-500">Records</p>
                      </div>
                    </div>
                  </div>
                  
                  <div onClick={() => handleClick("Item Masterlist", "Product")} className="admin module-card bg-white rounded-lg p-3 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] shadow-md border border-green-200">
                    <div className="flex items-center">
                      <div className="bg-[#00A8A8] bg-opacity-10 rounded-full p-2 mr-3">
                        <ShoppingOutlined className="text-xl text-[#00A8A8]" />
                      </div>
                      <div>
                        <p className="text-gray-600 font-medium mb-1">Products</p>
                        <p className="text-xl font-bold"><CountUp end={products} duration={1.5} /></p>
                        <p className="text-xs text-gray-500">Records</p>
                      </div>
                    </div>
                  </div>
                  
                  <div onClick={() => handleClick("Item Masterlist", "Raw Materials")} className="admin module-card bg-white rounded-lg p-3 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] shadow-md border border-yellow-200">
                    <div className="flex items-center">
                      <div className="bg-[#00A8A8] bg-opacity-10 rounded-full p-2 mr-3">
                        <ExperimentOutlined className="text-xl text-[#00A8A8]" />
                      </div>
                      <div>
                        <p className="text-gray-600 font-medium mb-1">Raw Materials</p>
                        <p className="text-xl font-bold"><CountUp end={rawMaterials} duration={1.5} /></p>
                        <p className="text-xs text-gray-500">Records</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div onClick={() => handleClick("Business Partner Masterlist")} className="admin module-card bg-white rounded-lg p-3 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] shadow-md border border-indigo-200">
                    <div className="flex items-center">
                      <div className="bg-[#00A8A8] bg-opacity-10 rounded-full p-2 mr-3">
                        <UserOutlined className="text-xl text-[#00A8A8]" />
                      </div>
                      <div>
                        <p className="text-gray-600 font-medium mb-1">Business Partner Masterlist</p>
                        <p className="text-xl font-bold"><CountUp end={partners} duration={1.5} /></p>
                        <p className="text-xs text-gray-500">Partners</p>
                      </div>
                    </div>
                  </div>
                  
                  <div onClick={() => handleClick("Business Partner Masterlist", "Vendor")} className="admin module-card bg-white rounded-lg p-3 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] shadow-md border border-purple-200">
                    <div className="flex items-center">
                      <div className="bg-[#00A8A8] bg-opacity-10 rounded-full p-2 mr-3">
                        <ShopOutlined className="text-xl text-[#00A8A8]" />
                      </div>
                      <div>
                        <p className="text-gray-600 font-medium mb-1">Vendors</p>
                        <p className="text-xl font-bold"><CountUp end={vendors} duration={1.5} /></p>
                        <p className="text-xs text-gray-500">Partners</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <div onClick={() => handleClick("Policy")} className="admin module-card bg-white rounded-lg p-5 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] shadow-md border border-gray-200">
                  <div className="flex items-center">
                    <div className="bg-[#00A8A8] bg-opacity-10 rounded-full p-3 mr-4">
                      <FileTextOutlined className="text-2xl text-[#00A8A8]" />
                    </div>
                    <div>
                      <p className="text-gray-600 font-medium mb-1">Policy</p>
                      <p className="text-2xl font-bold"><CountUp end={policies} duration={1.5} /></p>
                      <p className="text-sm text-gray-500">Documents</p>
                    </div>
                  </div>
                </div>

                <div onClick={() => handleClick("Audit Logs")} className="admin module-card bg-white rounded-lg p-5 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] shadow-md border border-red-200">
                  <div className="flex items-center">
                    <div className="bg-[#00A8A8] bg-opacity-10 rounded-full p-3 mr-4">
                      <FileSearchOutlined className="text-2xl text-[#00A8A8]" />
                    </div>
                    <div>
                      <p className="text-gray-600 font-medium mb-1">Audit Logs</p>
                      <p className="text-2xl font-bold"><CountUp end={auditLogs} duration={1.5} /></p>
                      <p className="text-sm text-gray-500">System Records</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
  );
};

export default Administration;