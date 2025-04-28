import React, { useMemo } from "react";
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
import EmployeeListModal from "../components/Modals/Lists/EmployeeListModal.jsx";
import ConfirmClear from "./../components/ConfirmClear";

import NewCustomerModal from "../components/Modals/NewCustomer";
import SalesTable from "../components/SalesTable";
import SalesInfo from "../components/SalesInfo";
import Button from "../components/Button";
import InfoField from "../components/InfoField";
import SalesDropup from "../components/SalesDropup.jsx";
import { useMutation } from "@tanstack/react-query";
import { GET, POST } from "../api/api.jsx";

const Order = ({ loadSubModule, setActiveSubModule, employee_id }) => {
  const { showAlert } = useAlert();

  const copyFromOptions = ["Quotation", "Blanket Agreement"];
  const copyToOptions = ["Delivery"];

  const [copyToModal, setCopyToModal] = useState("");
  // save current info to local storage
  // navigate to selected modal
  // use local storage to populate the fields
  // remove local storage after use

  const [submitted, setSubmitted] = useState(false);
  const [canClear, setCanClear] = useState(false);

  const [copyFromModal, setCopyFromModal] = useState(""); // variable to set what list will be shown
  // show list modal
  // replace current info with selected info

  const [address, setAddress] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");

  const [selectedProduct, setSelectedProduct] = useState();
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [orderID, setOrderID] = useState("");
  // Modals
  const [isConfirmClearOpen, setIsConfirmClearOpen] = useState(false);
  const [isCustomerListOpen, setIsCustomerListOpen] = useState(false);
  const [isProductListOpen, setIsProductListOpen] = useState(false);
  const [isNewCustomerModalOpen, setIsNewCustomerModalOpen] = useState(false);
  const [isQuotationListOpen, setIsQuotationListOpen] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [isEmployeeListOpen, setIsEmployeeListOpen] = useState(false);

  const [canEditTable, setCanEditTable] = useState(true);
  const [isBlanketAgreementListOpen, setIsBlanketAgreementListOpen] =
    useState(false);
  const [selectedBlanketAgreement, setSelectedBlanketAgreement] =
    useState(null);

  // const productPricingMutation = useMutation({
  //   mutationFn: async (data) =>
  //     await GET(`sales/products?admin_product=${data.product_id}`),
  // });
  const copyFromMutation = useMutation({
    mutationFn: async (data) =>
      await GET(`sales/${data.transferOperation}/${data.transferID}`),
    onSuccess: (data, variables, context) => {
      const prods = data.statement.items.map((item) => {
        return {
          product_id: item.inventory_item.item_id,
          product_name: item.inventory_item.item_name,
          special_requests: item.special_requests,
          quantity: Number(item.quantity),
          selling_price: Number(item.unit_price),
          discount: Number(item.discount),
          tax: Number(item.tax_amount),
          total_price: Number(item.total_price),
        };
      });
      setProducts(prods);
      if (data.quotation_id) {
        setSelectedQuotation(data);
      } else if (data.agreement_id) {
        setSelectedBlanketAgreement(data);
      }
      setSelectedCustomer(data.statement.customer);
      setSelectedEmployee(data.statement.salesrep);
      localStorage.removeItem("TransferID");
      localStorage.removeItem("TransferOperation");
    },
    onError: (error) => {
      showAlert({
        type: "error",
        title: "An error occurred while creating delivery: " + error.message,
      });
    },
  });

  const orderMutation = useMutation({
    mutationFn: async (data) => await POST("sales/order/", data),
    onSuccess: (data, variables, context) => {
      setOrderID(data.order_id);
    },
  });

  // columns for table
  const columns = [
    { key: "product_id", label: "Product ID", editable: false },
    { key: "product_name", label: "Product Name", editable: false },
    { key: "special_requests", label: "Specification", editable: canEditTable },
    { key: "quantity", label: "Quantity", editable: canEditTable },
    { key: "selling_price", label: "Price", editable: false },
    { key: "tax", label: "Tax", editable: false },
    { key: "discount", label: "Discount" },
    { key: "total_price", label: "Total Price", editable: false },
  ];

  const [selectedWarehouse, setSelectedWarehouse] = useState("");

  // the products customer chose
  const [products, setProducts] = useState([]);

  const [orderInfo, setOrderInfo] = useState({
    customer_id: "",
    quotation_id: "",
    selected_products: products,
    selected_address: "",
    selected_delivery_date: "",
    total_before_discount: 0,
    date_issued: new Date().toISOString().split("T")[0],
    discount: 0,
    total_tax: 0,
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
    const quotation_id = selectedQuotation
      ? selectedQuotation.quotation_id
      : null;
    const agreement_id = selectedBlanketAgreement
      ? selectedBlanketAgreement.agreement_id
      : null;
    let orderType = "Non-Project-Based";
    const items = products.map((product) => {
      if (product.special_requests) {
        orderType = "Project-Based";
      }
      return {
        inventory_item: selectedWarehouse,
        quantity: parseInt(product.quantity),
        special_requests: product.special_requests
          ? product.special_requests
          : null,
        unit_price: Number(parseFloat(product.selling_price).toFixed(2)),
        total_price: Number(parseFloat(product.total_price).toFixed(2)),
        discount: Number(parseFloat(product.discount).toFixed(2)),
        tax_amount: Number(parseFloat(product.tax).toFixed(2)),
      };
    });
    const request = {
      order_data: {
        quotation_id,
        agreement_id,
        order_date: new Date().toISOString(),
        order_type: orderType,
        items,
      },
      statement_data: {
        customer: selectedCustomer.customer_id,
        salesrep: employee_id,
        total_amount: Number(parseFloat(orderInfo.total_price).toFixed(2)),
        discount: Number(parseFloat(orderInfo.discount).toFixed(2)),
        subtotal: Number(orderInfo.total_before_discount.toFixed(2)),
        total_tax: Number(parseFloat(orderInfo.total_tax).toFixed(2)),
      },
    };
    console.log(request);

    orderMutation.mutate(request);
    showAlert({
      type: "success",
      title: "Order Submitted",
    });
  };

  // For copy from feature
  useEffect(() => {
    if (!copyFromModal) return;

    const modalActions = {
      Quotation: setIsQuotationListOpen,
      "Blanket Agreement": setIsBlanketAgreementListOpen,
    };

    modalActions[copyFromModal]?.(true);
  }, [copyFromModal]);

  useEffect(() => {
    if (copyFromModal === "Quotation" && selectedQuotation) {
      setCopyFromModal("");
      setOrderInfo((prev) => ({
        ...prev,
        quotation_id: selectedQuotation.quotation_id,
      }));
      copyFromMutation.mutate({
        transferID: selectedQuotation.quotation_id,
        transferOperation: "quotation",
      });
      setCanEditTable(false);
    } else if (
      copyFromModal === "Blanket Agreement" &&
      selectedBlanketAgreement
    ) {
      setOrderInfo(selectedBlanketAgreement);
      setCopyFromModal("");
      copyFromMutation.mutate({
        transferID: selectedBlanketAgreement.agreement_id,
        transferOperation: "agreement",
      });
      // setSelectedBlanketAgreement(null);
      // fill out fields HERE
    }
  }, [selectedQuotation, selectedBlanketAgreement]);

  // For copy to feature
  useEffect(() => {
    if (copyToModal === "Delivery") {
      localStorage.setItem("TransferID", JSON.stringify(orderID));
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
      copyFromMutation.mutate({
        transferOperation: JSON.parse(transferOperation),
        transferID: JSON.parse(transferID),
      });
    }
  }, []);

  useEffect(() => {
    if (!selectedCustomer || products.length === 0) return;
    const totalBeforeDiscount = products.reduce(
      (acc, product) => acc + product.selling_price * product.quantity,
      0
    );

    const totalTax = Number(
      products.reduce(
        (acc, product) =>
          acc + TAX_RATE * (product.selling_price * product.quantity),
        0
      )
    ).toFixed(2);

    const totalDiscount = products.reduce(
      (acc, product) => acc + Number(product.discount),
      0
    );

    const totalPrice =
      Number(totalBeforeDiscount) + Number(totalTax) - Number(totalDiscount);
    const order = {
      ...orderInfo,
      customer_id: selectedCustomer.customer_id,
      selected_products: [...products],
      total_before_discount: Number(totalBeforeDiscount),
      selected_delivery_date:
        orderInfo.selected_delivery_date || new Date().toISOString(),
      selected_address: selectedCustomer.address_line1,
      total_tax: Number(totalTax),
      discount: Number(totalDiscount),
      total_price: Number(totalPrice),
    };
    setOrderInfo(order);
  }, [products, selectedCustomer]);

  useEffect(() => {
    setOrderInfo({
      ...orderInfo,
      selected_address: address,
    });
  }, [address]);

  useEffect(() => {
    setOrderInfo({
      ...orderInfo,
      selected_delivery_date: deliveryDate,
    });
  }, [deliveryDate]);

  const handleClear = () => {
    setProducts([]);
    setSelectedCustomer("");
    setSelectedProduct("");
    setSelectedEmployee("");
    setAddress("");
    setDeliveryDate("");
    setCanEditTable(true);
    setOrderInfo({
      customer_id: "",
      quotation_id: "",
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
    setCanClear(false);
  };

  useEffect(() => {
    if (selectedCustomer != "") setCanClear(true);
  }, [selectedCustomer]);

  return (
    <div className="quotation">
      <div className="body-content-container">
        <ConfirmClear
          isOpen={isConfirmClearOpen}
          onClose={() => setIsConfirmClearOpen(false)}
          handleClear={handleClear}
        ></ConfirmClear>

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
          query={"status=Ready"}
        ></QuotationListModal>

        <BlanketAgreementListModal
          isOpen={isBlanketAgreementListOpen}
          onClose={() => setIsBlanketAgreementListOpen(false)}
          setBlanketAgreement={setSelectedBlanketAgreement}
        ></BlanketAgreementListModal>
        {/* <EmployeeListModal
          isOpen={isEmployeeListOpen}
          onClose={() => setIsEmployeeListOpen(false)}
          setEmployee={setSelectedEmployee}
        ></EmployeeListModal> */}
        {/* DETAILS */}
        <div>
          <SalesInfo
            type={"Order"}
            customer={selectedCustomer}
            customerListModal={setIsCustomerListOpen}
            setCustomerInfo={setOrderInfo}
            operationID={orderID}
            setDeliveryDate={setDeliveryDate}
            setAddress={setAddress}
            enabled={canEditTable}
            date={new Date().toISOString().split("T")[0]}
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
            isQuotation={canEditTable}
          />
        </section>

        {/* OTHERS */}
        <section className="mt-4 flex justify-between flex-col lg:flex-row space-x-4">
          <div className="h-full flex flex-col gap-3 w-full">
            {/* Buttons Row */}
            <div className="flex gap-2">
              <Button
                type="primary"
                onClick={() => {
                  setCanClear(true);
                  setIsProductListOpen(true);
                }}
                disabled={!canEditTable}
              >
                Add Item
              </Button>
              <Button
                type="outline"
                onClick={() => handleDelete()}
                disabled={!canEditTable}
              >
                Delete Item
              </Button>
            </div>

            {/* Employee ID Input */}
            <div className="flex mb-2 w-full mt-4 gap-4 items-center">
              <p className="">Employee ID</p>
              <div className="border border-[#9a9a9a] flex-1 p-1 flex transition-all duration-300 justify-between transform items-center h-[30px] rounded">
                <p className="text-sm">{employee_id || ""}</p>
              </div>
            </div>

            {/* Submit Button Aligned Right */}
            <div className="mt-auto gap-2 flex">
              <Button type="primary" className="" onClick={handleSubmit}>
                Submit Order
              </Button>
              <Button
                type="outline"
                className=""
                onClick={() => setIsConfirmClearOpen(true)}
                disabled={!canClear}
              >
                Clear
              </Button>
            </div>
          </div>

          <div className="w-full hidden xl:block"></div>
          <div className="w-full flex flex-col gap-3 mt-4 lg:mt-0">
            <InfoField
              label={"Total Before Discount"}
              value={Number(orderInfo.total_before_discount).toLocaleString(
                "en-US",
                { minimumFractionDigits: 2, maximumFractionDigits: 2 }
              )}
            />
            <InfoField
              label={"Discount"}
              value={Number(orderInfo.discount).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            />
            <InfoField
              label={"Tax"}
              value={Number(orderInfo.total_tax).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            />
            <InfoField
              label={"Total"}
              value={Number(orderInfo.total_price).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
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

const BodyContent = ({ loadSubModule, setActiveSubModule, employee_id }) => {
  return (
    <AlertProvider>
      <Order
        loadSubModule={loadSubModule}
        setActiveSubModule={setActiveSubModule}
        employee_id={employee_id}
      />
    </AlertProvider>
  );
};

export default BodyContent;
