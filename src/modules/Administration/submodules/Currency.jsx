import React, { useState, useEffect } from "react";
import { currencyAPI } from "../api/api";
import "../styles/Currency.css";
import {
  Table,
  Button,
  message,
  Typography,
  Divider,
  Input,
  Pagination,
  Tag,
  Tabs,
  notification
} from "antd";
import { 
  SearchOutlined, 
  SyncOutlined,
  DollarOutlined,
  CheckCircleOutlined
} from "@ant-design/icons";

const { TabPane } = Tabs;
const { Title } = Typography;

const Currency = () => {
  // State variables
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [updatingRates, setUpdatingRates] = useState(false);
  
  // Pagination state
  const [activeTab] = useState("currency");
  const [currencyPagination, setCurrencyPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  // Notification API
  const [api, contextHolder] = notification.useNotification();

  // Fetch data when component mounts
  useEffect(() => {
    fetchCurrencies();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchCurrencies = async (searchTerm = "", orderField = "", orderDirection = "") => {
    setLoading(true);
    try {
      // Add timestamp as cache busting parameter
      const timestamp = new Date().getTime();
      
      const data = await currencyAPI.getCurrencies({ 
        search: searchTerm,
        ordering: orderDirection === "descend" ? `-${orderField}` : orderField,
        _cache: timestamp // Cache busting parameter
      });
      
      setCurrencies(data.results || data);
      setCurrencyPagination(prev => ({
        ...prev,
        total: (data.results || data).length
      }));
    } catch (error) {
      message.error("Failed to fetch currencies");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Function to update exchange rates with notification
  const handleUpdateExchangeRates = async () => {
    setUpdatingRates(true);
    try {
      await currencyAPI.updateExchangeRates();
      
      // Show success notification that disappears automatically
      api.success({
        message: 'Exchange Rates Updated',
        description: 'All currency exchange rates have been successfully updated.',
        icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
        placement: 'topRight',
        duration: 4 // Automatically disappears after 4 seconds
      });
      
      fetchCurrencies(); // Refresh the data after update
    } catch (error) {
      message.error(`Failed to update exchange rates: ${error.response?.data?.message || error.message}`);
    } finally {
      setUpdatingRates(false);
    }
  };

  const handleTableChange = (pagination, filters, sorter, extra) => {
    if (sorter && sorter.field) {
      const orderField = sorter.field;
      const orderDirection = sorter.order;
      fetchCurrencies(searchValue, orderField, orderDirection);
    }
  };

  // Handle pagination changes
  const handleCurrencyPaginationChange = (page, pageSize) => {
    setCurrencyPagination(prev => ({
      ...prev,
      current: page,
      pageSize
    }));
  };

  // Handle search
  const handleSearch = (value) => {
    setSearchValue(value);
    fetchCurrencies(value);
  };

  // Table columns definition
  const currencyColumns = [
    {
      title: "Currency ID",
      dataIndex: "currency_id",
      key: "currency_id",
      sorter: true,
      width: 200,
    },
    {
      title: "Currency Name",
      dataIndex: "currency_name",
      key: "currency_name",
      sorter: true,
      width: 150,
    },
    {
      title: "Exchange Rate",
      dataIndex: "exchange_rate",
      key: "exchange_rate",
      sorter: true,
      width: 150,
      render: (rate) => Number(rate).toFixed(6)
    },
    {
      title: "Status",
      dataIndex: "is_active",
      key: "is_active",
      sorter: true,
      width: 100,
      render: (status) => (
        <Tag color={status === "Active" ? "green" : "red"}>
          {status}
        </Tag>
      ),
    }
  ];

  // Calculate table data for pagination
  const getCurrencyTableData = () => {
    const { current, pageSize } = currencyPagination;
    const start = (current - 1) * pageSize;
    const end = start + pageSize;
    return currencies.slice(start, end);
  };

  // Render component
  return (
    <div className="currency">
      {contextHolder} {/* This renders the notification component */}
      <div className="currency-container">
        <Title level={4} className="page-title">
          Currency Exchange Rates
        </Title>
        <Divider className="title-divider" />
        
        <div className="tabs-wrapper">
          <Tabs
            activeKey={activeTab}
            size="middle"
            tabBarGutter={8}
            className="currency-tabs"
            type={windowWidth <= 768 ? "card" : "line"}
            tabPosition="top"
            destroyInactiveTabPane={false}
            tabBarExtraContent={{
              right: (
                <div className="header-right-content">
                  <div className="search-container">
                    <Input.Search
                      placeholder="Search currencies..."
                      allowClear
                      onSearch={handleSearch}
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      prefix={<SearchOutlined />}
                    />
                  </div>
                  <div className="update-button-container">
                    <Button 
                      type="primary"
                      icon={<SyncOutlined spin={updatingRates} />}
                      onClick={handleUpdateExchangeRates}
                      loading={updatingRates}
                      disabled={updatingRates}
                    >
                      Update Rates
                    </Button>
                  </div>
                </div>
              )
            }}
          >
            <TabPane
              tab={<span><DollarOutlined /> {windowWidth > 576 ? "Currencies" : ""}</span>}
              key="currency"
            >
              <div className="table-meta-info">
                <span className="record-count">Total Currencies: {currencies.length}</span>
                <div className="table-pagination">
                  <Pagination 
                    current={currencyPagination.current}
                    pageSize={currencyPagination.pageSize}
                    total={currencies.length}
                    onChange={handleCurrencyPaginationChange}
                    showSizeChanger={false}
                    size="small"
                  />
                </div>
              </div>
              
              <div className="table-container">
                <Table 
                  dataSource={getCurrencyTableData()} 
                  columns={currencyColumns} 
                  rowKey="currency_id"
                  loading={loading}
                  scroll={{ x: true, y: 400 }}
                  pagination={false}
                  bordered
                  size="middle"
                  showSorterTooltip={false}
                  sortDirections={['ascend', 'descend']}
                  onChange={handleTableChange}
                  className="scrollable-table"
                />
              </div>
            </TabPane>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Currency;