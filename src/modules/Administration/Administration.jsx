import React, { useState, useEffect } from "react";
import UserManagememnt from  "./submodules/User";
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
          <div className="bg-white shadow-md rounded-lg overflow-y-auto overflow-x-hidden mt-10"
            style={{
              width: "calc(100% - 25px)",
              height: "850px",
              marginLeft: "10px",
              transition: "margin-left 1s ease, width 0.3s ease"
            }}
          >
            {/* Dashboard Title */}
            <h1 className="text-start text-2xl font-bold mb-6 w-full text-center flex ml-10 mt-7">
              Administration Dashboard
            </h1>
            <div className="p-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 ml-10 mr-10">
              {/* Exchange Rate Card */}
              <div className="border border-gray-200 rounded-sm shadow-sm p-5 flex items-center gap-4 bg-white bg-white hover:bg-blue-100 cursor-pointer transition duration-300">
                <div className="text-3xl p-3 rounded-full bg-green-100 text-green-600">
                  <DollarOutlined />
                </div>
                <div>
                  <p className="font-medium">Exchange Rate (PHP to USD)</p>
                  <p className="text-2xl font-bold">
                    {loading ? <LoadingOutlined /> : <CountUp end={exchangeRate} decimals={2} />}
                  </p>
                  <p className="text-sm text-gray-500 flex items-center">
                      Latest Rate
                      <span className="ml-2 px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">Live</span>
                  </p>
                </div>
              </div>


              {/* Item Masterlist */}
              <div onClick={() => handleClick("Item Masterlist", "Product")} className="cursor-pointer border border-gray-200 rounded-sm shadow-sm p-5 flex items-center gap-4 bg-white bg-white hover:bg-blue-100 cursor-pointer transition duration-300">
                <div className="text-3xl p-3 rounded-full bg-blue-100 text-blue-600">
                  <AppstoreOutlined />
                </div>
                <div>
                  <p className="font-medium">Item Masterlist</p>
                  <p className="text-2xl font-bold">{loading ? <LoadingOutlined /> : products}</p>
                  <p className="text-sm text-gray-500">Records</p>
                </div>
              </div>


              {/* Warehouse */}
              <div onClick={() => handleClick("Warehouse")} className="cursor-pointer border border-gray-200 rounded-sm shadow-sm p-5 flex items-center gap-4 bg-white bg-white hover:bg-blue-100 cursor-pointer transition duration-300">
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
              <div onClick={() => handleClick("Policy")} className="cursor-pointer border border-gray-200 rounded-sm shadow-sm p-5 flex items-center gap-4 bg-white bg-white hover:bg-blue-100 cursor-pointer transition duration-300">
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
              <div onClick={() => handleClick("Audit Logs")} className="cursor-pointer border border-gray-200 rounded-sm shadow-sm p-5 flex items-center gap-4 bg-white bg-white hover:bg-blue-100 cursor-pointer transition duration-300">
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
              <div onClick={() => handleClick("Business Partner Masterlist")} className="cursor-pointer border border-gray-200 rounded-sm shadow-sm p-5 flex items-center gap-4 bg-white bg-white hover:bg-blue-100 cursor-pointer transition duration-300">
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
            <div className="mt-12 flex ml-10 mr-10">
              <UserManagememnt />
            </div>
          </div>
        </div>
      </div>
  );
};


export default Administration;



