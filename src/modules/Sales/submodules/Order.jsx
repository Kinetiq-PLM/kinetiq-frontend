import React from "react";
import { useEffect, useState } from "react";
import { TAX_RATE } from "../temp_data/sales_data";
import "../styles/Index.css";

import {
  AlertProvider,
  useAlert,
} from "../components/Context/AlertContext.jsx";

import CustomerListModal from "../components/Modals/Lists/CustomerList";
import ProductListModal from "../components/Modals/Lists/ProductList";
import QuotationListModal from "../components/Modals/Lists/QuotationList";
import BlanketAgreementListModal from "../components/Modals/Lists/BlanketAgreementList";

import NewCustomerModal from "../components/Modals/NewCustomer";
import SalesTable from "../components/SalesTable";
import SalesInfo from "../components/SalesInfo";
import Button from "../components/Button";
import InfoField from "../components/InfoField";
import SalesDropup from "../components/SalesDropup.jsx";

const Order = ({ loadSubModule, setActiveSubModule }) => {
  const { showAlert } = useAlert();

  const copyFromOptions = ["Quotation", "Blanket Agreement"];
  const copyToOptions = ["Delivery"];

  const [copyToModal, setCopyToModal] = useState("");
  // save current info to local storage
  // navigate to selected modal
  // use local storage to populate the fields
  // remove local storage after use

  const [submitted, setSubmitted] = useState(false);

  const [copyFromModal, setCopyFromModal] = useState(""); // variable to set what list will be shown
  // show list modal
  // replace current info with selected info

  const [address, setAddress] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");

  const [selectedProduct, setSelectedProduct] = useState();
  const [selectedCustomer, setSelectedCustomer] = useState("");

  // Modals
  const [isCustomerListOpen, setIsCustomerListOpen] = useState(false);
  const [isProductListOpen, setIsProductListOpen] = useState(false);
  const [isNewCustomerModalOpen, setIsNewCustomerModalOpen] = useState(false);

  const [isQuotationListOpen, setIsQuotationListOpen] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState(null);

  const [isBlanketAgreementListOpen, setIsBlanketAgreementListOpen] =
    useState(false);
  const [selectedBlanketAgreement, setSelectedBlanketAgreement] =
    useState(null);

  // columns for table
  const columns = [
    { key: "product_id", label: "Product ID", editable: false },
    { key: "product_name", label: "Product Name", editable: false },
    { key: "quantity", label: "Quantity" },
    { key: "markup_price", label: "Price" },
    { key: "tax", label: "Tax", editable: false },
    { key: "discount", label: "Discount" },
    { key: "total_price", label: "Total Price", editable: false },
  ];

  // the products customer chose
  const [products, setProducts] = useState([]);

  const [orderInfo, setOrderInfo] = useState({
    customer_id: "",
    quotation_id: "",
    order_id: "",
    selected_products: products,
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

  const handleDelete = () => {
    if (!selectedProduct) {
      showAlert({
        type: "error",
        title: "Select a product to delete.",
      });
      return;
    }

    setProducts(
      products.filter(
        (product) => product.product_id != selectedProduct.product_id
      )
    );

    showAlert({
      type: "success",
      title: "Product removed.",
    });
  };

  const handleSubmit = () => {
    if (selectedCustomer.customer_id == undefined) {
      showAlert({
        type: "error",
        title: "Please select a customer.",
      });
      return;
    }
    if (products.length === 0) {
      showAlert({
        type: "error",
        title: "Please add products.",
      });
      return;
    }

    // INSERT LOGIC HERE TO ADD QUOTATION TO DATABASE
    setSubmitted(true);
    showAlert({
      type: "success",
      title: "Order Submitted",
    });
  };

  const transferData = () => {
    if (!selectedCustomer || products.length === 0) return;
    const totalBeforeDiscount = products.reduce(
      (acc, product) => acc + product.markup_price * product.quantity,
      0
    );

    const totalTax = Number(
      products.reduce(
        (acc, product) =>
          acc + TAX_RATE * (product.markup_price * product.quantity),
        0
      )
    ).toFixed(2);

    const totalDiscount = products.reduce(
      (acc, product) => acc + product.discount,
      0
    );

    const shippingFee = products.length * 100;
    const warrantyFee = products.reduce(
      (acc, product) =>
        acc +
        ((product.markup_price - product.unit_price) *
          product.quantity *
          product.warranty_period) /
          12,
      0
    );
    const totalPrice =
      Number(totalBeforeDiscount) -
      Number(totalDiscount) +
      Number(totalTax) +
      Number(shippingFee) +
      Number(warrantyFee);

    setOrderInfo((prevOrderInfo) => ({
      ...prevOrderInfo,
      customer_id: selectedCustomer.customer_id,
      selected_products: products,
      total_before_discount: totalBeforeDiscount,
      total_tax: Number(totalTax),
      discount: totalDiscount,
      shipping_fee: shippingFee,
      warranty_fee: Number(warrantyFee),
      total_price: Number(totalPrice),
    }));
  };

  // For copy from feature
  useEffect(() => {
    if (!copyFromModal) return;

    const modalActions = {
      Quotation: setIsQuotationListOpen,
      "Blanket Agreement": setIsBlanketAgreementListOpen,
    };

    modalActions[copyFromModal]?.(true);
    setCopyFromModal("");
  }, [copyFromModal]);

  useEffect(() => {
    if (copyFromModal === "Quotation" && selectedQuotation) {
      setOrderInfo(selectedQuotation);
      setCopyFromModal("");
      console.log(selectedQuotation);
      setSelectedQuotation(null);
      // fill out fields HERE
    } else if (
      copyFromModal === "Blanket Agreement" &&
      selectedBlanketAgreement
    ) {
      setOrderInfo(selectedBlanketAgreement);
      setCopyFromModal("");
      console.log(selectedBlanketAgreement);
      setSelectedBlanketAgreement(null);
      // fill out fields HERE
    }
  }, [selectedQuotation, selectedBlanketAgreement]);

  // For copy to feature
  useEffect(() => {
    if (copyToModal === "Delivery") {
      localStorage.setItem("TransferID", JSON.stringify(orderInfo.order_id));
      localStorage.setItem("TransferOperation", JSON.stringify("order"));
      console.log("Saved to local storage: operation and ID");
      loadSubModule("Delivery");
      setActiveSubModule("Delivery");
    }
  }, [copyToModal]);

  // FROM COPY TO FEATURE - EX: Quotation to Order
  useEffect(() => {
    const transferID = localStorage.getItem("TransferID");
    const transferOperation = localStorage.getItem("TransferOperation");

    if (transferID && transferOperation) {
      // SEARCH DB FOR TRANSFERID with TRANSFEROPERATION
      // FILL DETAILS WITH DATA
      console.log("Searching for ID: ", transferID);
      console.log("At Operation: ", transferOperation);
      localStorage.removeItem("TransferID");
      localStorage.removeItem("TransferOperation");
    }
  }, []);

  useEffect(() => {
    transferData();
  }, [selectedCustomer, products]);

  useEffect(() => {
    setOrderInfo({
      ...orderInfo,
      selected_address: address,
    });
  }, [selectedCustomer, address]);

  useEffect(() => {
    setOrderInfo({
      ...orderInfo,
      selected_delivery_date: deliveryDate,
    });
  }, [selectedCustomer, deliveryDate]);

  return (
    <div className="quotation">
      <div className="body-content-container">
        {/* Displays a table and can confirm what was selected */}
        <CustomerListModal
          isOpen={isCustomerListOpen}
          onClose={() => setIsCustomerListOpen(false)}
          newCustomerModal={setIsNewCustomerModalOpen}
          setSelectedCustomer={setSelectedCustomer}
          setCustomer={setSelectedCustomer}
        ></CustomerListModal>
        <ProductListModal
          isOpen={isProductListOpen}
          onClose={() => setIsProductListOpen(false)}
          addProduct={setProducts}
          products={products}
        ></ProductListModal>
        <NewCustomerModal
          isOpen={isNewCustomerModalOpen}
          onClose={() => setIsNewCustomerModalOpen(false)}
        ></NewCustomerModal>

        {/* For COPY FROM */}
        <QuotationListModal
          isOpen={isQuotationListOpen}
          onClose={() => setIsQuotationListOpen(false)}
          setQuotation={setSelectedQuotation}
        ></QuotationListModal>

        <BlanketAgreementListModal
          isOpen={isBlanketAgreementListOpen}
          onClose={() => setIsBlanketAgreementListOpen(false)}
          setBlanketAgreement={setSelectedBlanketAgreement}
        ></BlanketAgreementListModal>
        {/* DETAILS */}
        <div>
          <SalesInfo
            type={"Order"}
            customer={selectedCustomer}
            customerListModal={setIsCustomerListOpen}
            setCustomerInfo={setOrderInfo}
            operationID={orderInfo.order_id}
            setDeliveryDate={setDeliveryDate}
            setAddress={setAddress}
          />
        </div>
        {/* TABLE */}
        <section className="border border-[#CBCBCB] w-full min-h-[350px] overflow-x-auto rounded-md mt-2 table-layout">
          <SalesTable
            columns={columns}
            data={products}
            updateData={setProducts}
            onSelect={setSelectedProduct}
            minWidth={true}
          />
        </section>

        {/* OTHERS */}
        <section className="mt-4 flex justify-between flex-col lg:flex-row space-x-4">
          <div className="h-full flex flex-col gap-3 w-full">
            {/* Buttons Row */}
            <div className="flex gap-2">
              <Button type="primary" onClick={() => setIsProductListOpen(true)}>
                Add Item
              </Button>
              <Button type="outline" onClick={() => handleDelete()}>
                Delete Item
              </Button>
            </div>

            {/* Employee ID Input */}
            <div className="flex items-center gap-2">
              <p className="text-gray-700 text-sm">Employee ID</p>
              <div className="border border-gray-400 flex-1 p-1 h-[30px] max-w-[250px] bg-gray-200 rounded"></div>
            </div>

            {/* Submit Button Aligned Right */}
            <div className="mt-auto">
              <Button type="primary" className="" onClick={handleSubmit}>
                Submit Quotation
              </Button>
            </div>
          </div>

          <div className="w-full hidden xl:block"></div>
          <div className="w-full flex flex-col gap-3 mt-4 lg:mt-0">
            <InfoField
              label={"Total Before Discount"}
              value={orderInfo.total_before_discount}
            />
            <InfoField
              label={"Discount"}
              value={Number(orderInfo.discount).toFixed(2)}
            />
            <InfoField
              label={"Shipping"}
              value={Number(orderInfo.shipping_fee).toFixed(2)}
            />
            <InfoField
              label={"Warranty"}
              value={Number(orderInfo.warranty_fee).toFixed(2)}
            />
            <InfoField
              label={"Tax"}
              value={Number(orderInfo.total_tax).toFixed(2)}
            />
            <InfoField
              label={"Total"}
              value={Number(orderInfo.total_price).toFixed(2)}
            />
            <div className="flex justify-center md:justify-end gap-2">
              <SalesDropup
                label=""
                placeholder="Copy From"
                options={copyFromOptions}
                disabled={!copyFromOptions}
                setOption={setCopyFromModal}
              />
              <SalesDropup
                label=""
                placeholder="Copy To"
                options={copyToOptions}
                disabled={!submitted}
                setOption={setCopyToModal}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

const BodyContent = ({ loadSubModule, setActiveSubModule }) => {
  return (
    <AlertProvider>
      <Order
        loadSubModule={loadSubModule}
        setActiveSubModule={setActiveSubModule}
      />
    </AlertProvider>
  );
};

export default BodyContent;
