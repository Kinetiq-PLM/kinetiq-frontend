import React from "react";
import { useState } from "react";
import "../styles/Index.css";
import Heading from "../../Sales/components/Heading";
import Button from "../../Sales/components/Button";
import Table from "../../Sales/components/Table";
import { AlertProvider } from "../../Sales/components/Context/AlertContext";
import OpportunityInfo from "../components/OpportunityInfo";

const BodyContent = ({ loadSubModule, setActiveSubModule }) => {
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [isCustomerListOpen, setIsCustomerListOpen] = useState(false);
  const [quotationInfo, setQuotationInfo] = useState({
    // Customer information
    customer_id: "",
    quotation_id: "",
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
  });
  const [address, setAddress] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");

  return (
    <div className="opportunity">
      <div className="body-content-container">
        <Heading
          Title="Opportunity"
          SubTitle="Tracking and nurturing sales opportunities to drive business success."
        />
        <main className="mt-4">
          <OpportunityInfo
            type={"Quotation"}
            customer={selectedCustomer}
            customerListModal={setIsCustomerListOpen}
            setCustomerInfo={setQuotationInfo}
            operationID={quotationInfo.quotation_id}
            setDeliveryDate={setDeliveryDate}
            setAddress={setAddress}
          />
        </main>
      </div>
    </div>
  );
};

export default BodyContent;
