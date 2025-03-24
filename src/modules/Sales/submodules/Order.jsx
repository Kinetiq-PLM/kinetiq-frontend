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
<<<<<<< HEAD
import EmployeeListModal from "../components/Modals/Lists/EmployeeListModal.jsx";
=======

>>>>>>> 760fd56b3517e9987a816ea7f76b05421d85304c
import NewCustomerModal from "../components/Modals/NewCustomer";
import SalesTable from "../components/SalesTable";
import SalesInfo from "../components/SalesInfo";
import Button from "../components/Button";
import InfoField from "../components/InfoField";
import SalesDropup from "../components/SalesDropup.jsx";
<<<<<<< HEAD
import { useMutation } from "@tanstack/react-query";
import { GET, POST } from "../api/api.jsx";
=======
>>>>>>> 760fd56b3517e9987a816ea7f76b05421d85304c

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
<<<<<<< HEAD
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [isEmployeeListOpen, setIsEmployeeListOpen] = useState(false);
=======
>>>>>>> 760fd56b3517e9987a816ea7f76b05421d85304c

  const [isBlanketAgreementListOpen, setIsBlanketAgreementListOpen] =
    useState(false);
  const [selectedBlanketAgreement, setSelectedBlanketAgreement] =
    useState(null);

<<<<<<< HEAD
  const copyFromMutation = useMutation({
    mutationFn: async (data) =>
      await GET(`sales/${data.transferOperation}/${data.transferID}`),
    onSuccess: (data, variables, context) => {
      const prods = data.statement.items.map((item) => ({
        product_id: item.product.product_id,
        product_name: item.product.product_name,
        quantity: Number(item.quantity),
        selling_price: Number(item.unit_price),
        discount: Number(item.discount),
        tax: Number(item.tax_amount),
        total_price: Number(item.total_price),
      }));
      setProducts(prods);
      setSelectedCustomer(data.statement.customer);
      setSelectedEmployee(data.statement.salesrep);
      transferData();

      localStorage.removeItem("TransferID");
      localStorage.removeItem("TransferOperation");
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const orderMutation = useMutation({
    mutationFn: async (data) => await POST("sales/order/", data),
    onSuccess: (data, variables, context) => {
      setOrderInfo({ ...orderInfo, order_id: data.order_id });
    },
  });

=======
>>>>>>> 760fd56b3517e9987a816ea7f76b05421d85304c
  // columns for table
  const columns = [
    { key: "product_id", label: "Product ID", editable: false },
    { key: "product_name", label: "Product Name", editable: false },
    { key: "quantity", label: "Quantity" },
<<<<<<< HEAD
    { key: "selling_price", label: "Price" },
=======
    { key: "markup_price", label: "Price" },
>>>>>>> 760fd56b3517e9987a816ea7f76b05421d85304c
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

<<<<<<< HEAD
    // INSERT LOGIC HERE TO ADD QUOTATION TO DATABASE
    setSubmitted(true);

    const request = {
      order_data: {
        quotation_id: selectedQuotation.quotation_id,
        order_date: new Date().toISOString(),
        order_status: "Pending",
        order_total_amount: orderInfo.total_price,
        order_type: "Direct", // temporary value
        items: products.map((product) => ({
          product: product.product_id,
          quantity: +parseInt(product.quantity),
          unit_price: +parseFloat(product.selling_price).toFixed(2),
          total_price: +parseFloat(product.total_price).toFixed(2),
          discount: +parseFloat(product.discount).toFixed(2),
          tax_amount: +parseFloat(product.tax).toFixed(2),
        })),
      },
      statement_data: {
        customer: selectedCustomer.customer_id,
        salesrep: selectedEmployee.employee_id,
        type: "Non-Project-Based", // make a variable
        total_amount: parseFloat(orderInfo.total_price),
        discount: parseFloat(orderInfo.discount),
        total_tax: parseFloat(orderInfo.total_tax),
      },
    };
    console.log(request);

    // orderMutation.mutate(request);
=======
    console.log(orderInfo);

    // INSERT LOGIC HERE TO ADD QUOTATION TO DATABASE
    setSubmitted(true);
>>>>>>> 760fd56b3517e9987a816ea7f76b05421d85304c
    showAlert({
      type: "success",
      title: "Order Submitted",
    });
  };

  const transferData = () => {
    if (!selectedCustomer || products.length === 0) return;
    const totalBeforeDiscount = products.reduce(
<<<<<<< HEAD
      (acc, product) => acc + product.selling_price * product.quantity,
=======
      (acc, product) => acc + product.markup_price * product.quantity,
>>>>>>> 760fd56b3517e9987a816ea7f76b05421d85304c
      0
    );

    const totalTax = Number(
      products.reduce(
        (acc, product) =>
<<<<<<< HEAD
          acc + TAX_RATE * (product.selling_price * product.quantity),
=======
          acc + TAX_RATE * (product.markup_price * product.quantity),
>>>>>>> 760fd56b3517e9987a816ea7f76b05421d85304c
        0
      )
    ).toFixed(2);

    const totalDiscount = products.reduce(
      (acc, product) => acc + product.discount,
      0
    );

    const shippingFee = products.length * 100;
<<<<<<< HEAD
    const warrantyFee = (totalBeforeDiscount * 0.1).toFixed(2);
=======
    const warrantyFee = products.reduce(
      (acc, product) =>
        acc +
        ((product.markup_price - product.unit_price) *
          product.quantity *
          product.warranty_period) /
          12,
      0
    );
>>>>>>> 760fd56b3517e9987a816ea7f76b05421d85304c
    const totalPrice =
      Number(totalBeforeDiscount) -
      Number(totalDiscount) +
      Number(totalTax) +
      Number(shippingFee) +
      Number(warrantyFee);
<<<<<<< HEAD
=======

>>>>>>> 760fd56b3517e9987a816ea7f76b05421d85304c
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
    if (copyFromModal === "Quotation") {
      setIsQuotationListOpen(true);
    } else if (copyFromModal === "Blanket Agreement") {
      setIsBlanketAgreementListOpen(true);
    }
  }, [copyFromModal]);

  useEffect(() => {
    if (copyFromModal === "Quotation" && selectedQuotation) {
<<<<<<< HEAD
      setCopyFromModal("");
      copyFromMutation.mutate({
        transferID: selectedQuotation.quotation_id,
        transferOperation: "quotation",
      });
      // setSelectedQuotation(null);  temp
=======
      setOrderInfo(selectedQuotation);
      setCopyFromModal("");
      console.log(selectedQuotation);
      setSelectedQuotation(null);
>>>>>>> 760fd56b3517e9987a816ea7f76b05421d85304c
      // fill out fields HERE
    } else if (
      copyFromModal === "Blanket Agreement" &&
      selectedBlanketAgreement
    ) {
      setOrderInfo(selectedBlanketAgreement);
      setCopyFromModal("");
<<<<<<< HEAD
      copyFromMutation.mutate({
        transferID: selectedBlanketAgreement.agreement_id,
        transferOperation: "agreement",
      });
      transferData();
      // setSelectedBlanketAgreement(null);
=======
      console.log(selectedBlanketAgreement);
      setSelectedBlanketAgreement(null);
>>>>>>> 760fd56b3517e9987a816ea7f76b05421d85304c
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
<<<<<<< HEAD

      console.log("Searching for ID: ", transferID);
      console.log("At Operation: ", transferOperation);

      copyFromMutation.mutate({ transferOperation, transferID });

=======
      console.log("Searching for ID: ", transferID);
      console.log("At Operation: ", transferOperation);
>>>>>>> 760fd56b3517e9987a816ea7f76b05421d85304c
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
<<<<<<< HEAD
        <EmployeeListModal
          isOpen={isEmployeeListOpen}
          onClose={() => setIsEmployeeListOpen(false)}
          setEmployee={setSelectedEmployee}
        ></EmployeeListModal>
=======
>>>>>>> 760fd56b3517e9987a816ea7f76b05421d85304c
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
<<<<<<< HEAD
            <div className="flex mb-2 w-full mt-4 gap-4 items-center">
              <p className="">Employee ID</p>
              <div
                className="border border-[#9a9a9a] flex-1 cursor-pointer p-1 flex hover:border-[#969696] transition-all duration-300 justify-between transform hover:opacity-60 items-center h-[30px] rounded"
                onClick={() => setIsEmployeeListOpen(true)}
              >
                <p className="text-sm">
                  {selectedEmployee ? selectedEmployee : ""}
                </p>
                <img
                  src="/icons/information-icon.svg"
                  className="h-[15px]"
                  alt="info icon"
                />
              </div>
=======
            <div className="flex items-center gap-2">
              <p className="text-gray-700 text-sm">Employee ID</p>
              <div className="border border-gray-400 flex-1 p-1 h-[30px] max-w-[250px] bg-gray-200 rounded"></div>
>>>>>>> 760fd56b3517e9987a816ea7f76b05421d85304c
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
                loadSubModule={loadSubModule}
                setActiveSubModule={setActiveSubModule}
                setOption={setCopyFromModal}
              />
              <SalesDropup
                label=""
                placeholder="Copy To"
                options={copyToOptions}
                disabled={!submitted}
                loadSubModule={loadSubModule}
                setActiveSubModule={setActiveSubModule}
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
