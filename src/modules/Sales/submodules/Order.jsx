import React from "react";
import { useEffect, useState } from "react";
import { TAX_RATE } from "../temp_data/sales_data";

import {
  AlertProvider,
  useAlert,
} from "../components/Context/AlertContext.jsx";

import SalesTable from "../components/SalesTable";
import SalesInfo from "../components/SalesInfo";
import CustomerListModal from "../components/Modals/Lists/CustomerList";
import ProductListModal from "../components/Modals/Lists/ProductList";
import NewCustomerModal from "../components/Modals/NewCustomer";
import Button from "../components/Button";
import InfoField from "../components/InfoField";
import SalesDropup from "../components/SalesDropup.jsx";
import generateRandomID from "../components/GenerateID";
import "../styles/Index.css";

const BodyContent = ({ loadSubModule, setActiveSubModule }) => {
  const [orderInfo, setOrderInfo] = useState(
    JSON.parse(localStorage.getItem("Transfer")) || {
      // Customer information
      customer_id: "",
      quotation_id: "",
      order_id: "",
      selected_products: [],
      selected_address: "",
      selected_delivery_date: "",
      total_before_discount: 0,
      date_issued: new Date().toISOString().split("T")[0],
      discount: 0,
      total_tax: 0,
      shipping_fee: 0,
      warranty_fee: 0,
      total_price: 0,
    }
  );

  return (
    <div className="order">
      <div className="body-content-container">
        <p>Hello Order SubModule!</p>
        <p>
          Fill this container with your elements, change the display if need be.
        </p>
        <p>
          If you're going to style with css, use your unique namespace '.order'
          at the start.
        </p>
      </div>
    </div>
  );
};

export default BodyContent;
