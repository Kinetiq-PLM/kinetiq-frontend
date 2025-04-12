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
import OrderListModal from "./../components/Modals/Lists/OrderList";
import BlanketAgreementListModal from "../components/Modals/Lists/BlanketAgreementList";
import EmployeeListModal from "../components/Modals/Lists/EmployeeListModal.jsx";
import ConfirmClear from "./../components/ConfirmClear";

import NewCustomerModal from "../components/Modals/NewCustomer";
import SalesTable from "../components/SalesTable";
import SalesInfo from "../components/SalesInfo";
import Button from "../components/Button";
import InfoField from "../components/InfoField";
import SalesDropup from "../components/SalesDropup.jsx";
import { GET, POST } from "../api/api.jsx";
import { useQuery, useMutation } from "@tanstack/react-query";
import generateRandomID from "../components/GenerateID.jsx";

const Delivery = ({ loadSubModule, setActiveSubModule }) => {
  const { showAlert } = useAlert();

  const copyFromOptions = ["Order", "Blanket Agreement"];
  const copyToOptions = ["Return", "Invoice"];

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

  // Modals
  const [isConfirmClearOpen, setIsConfirmClearOpen] = useState(false);
  const [deliveryID, setDeliveryID] = useState("");
  const [isCustomerListOpen, setIsCustomerListOpen] = useState(false);
  const [isProductListOpen, setIsProductListOpen] = useState(false);
  const [isNewCustomerModalOpen, setIsNewCustomerModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [isEmployeeListOpen, setIsEmployeeListOpen] = useState(false);

  const [isOrderListOpen, setIsOrderListOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [isBlanketAgreementListOpen, setIsBlanketAgreementListOpen] =
    useState(false);
  const [selectedBlanketAgreement, setSelectedBlanketAgreement] =
    useState(null);

  // columns for table
  const columns = [
    { key: "product_id", label: "Product ID", editable: false },
    { key: "product_name", label: "Product Name", editable: false },
    { key: "quantity", label: "Quantity" },
    { key: "selling_price", label: "Price" },
    { key: "tax", label: "Tax", editable: false },
    { key: "discount", label: "Discount" },
    { key: "total_price", label: "Total Price", editable: false },
  ];

  // the products customer chose
  const [products, setProducts] = useState([]);

  const [deliveryInfo, setDeliveryInfo] = useState({
    customer_id: "",
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

  const copyFromMutation = useMutation({
    mutationFn: async (data) =>
      await GET(`sales/${data.transferOperation}/${data.transferID}`),
    onSuccess: async (data, variables, context) => {
      const prods = await Promise.all(
        data.statement.items.map(async (item) => {
          const price = (
            await GET(`sales/products?admin_product=${item.product.product_id}`)
          )[0];

          return {
            product_id: item.product.product_id,
            product_name: item.product.product_name,
            quantity: Number(item.quantity),
            selling_price: Number(price.selling_price),
            discount: Number(item.discount),
            tax: Number(item.tax_amount),
            total_price: Number(item.total_price),
          };
        })
      );
      console.log(prods);
      setProducts(prods);
      setSelectedOrder(data);
      setSelectedCustomer(data.statement.customer);
      setSelectedEmployee(data.statement.salesrep);
      localStorage.removeItem("TransferID");
      localStorage.removeItem("TransferOperation");
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const deliveryMutation = useMutation({
    mutationFn: async (data) => await POST("sales/delivery/", data),
    onSuccess: (data, variables, context) => {
      setDeliveryID(data.shipping_id);
    },
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
    const order_id = selectedOrder ? selectedOrder.order_id : null;
    const request = {
      shipping_data: {
        order_id,
        shipping_method: "Standard", // drop down needed
        tracking_num: generateRandomID("TRK"),
        estimated_delivery: deliveryDate,
        delivery_status: "Pending",
        items: products.map((product) => ({
          product: product.product_id,
          quantity: parseInt(product.quantity),
          unit_price: Number(parseFloat(product.selling_price).toFixed(2)),
          total_price: Number(parseFloat(product.total_price).toFixed(2)),
          discount: Number(parseFloat(product.discount).toFixed(2)),
          tax_amount: Number(parseFloat(product.tax).toFixed(2)),
        })),
      },
      statement_data: {
        customer: selectedCustomer.customer_id,
        salesrep: selectedEmployee.employee_id,
        type: "Non-Project-Based", // make a variable
        total_amount: Number(parseFloat(deliveryInfo.total_price).toFixed(2)),
        discount: Number(parseFloat(deliveryInfo.discount).toFixed(2)),
        total_tax: Number(parseFloat(deliveryInfo.total_tax).toFixed(2)),
      },
    };
    console.log(request);
    deliveryMutation.mutate(request);
    // INSERT LOGIC HERE TO ADD QUOTATION TO DATABASE
    setSubmitted(true);
    showAlert({
      type: "success",
      title: "Delivery Submitted",
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
        ((product.markup_price - product.selling_price) *
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

    setDeliveryInfo((prevOrderInfo) => ({
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
      Order: setIsOrderListOpen,
      "Blanket Agreement": setIsBlanketAgreementListOpen,
    };

    modalActions[copyFromModal]?.(true);
    // setCopyFromModal("");
  }, [copyFromModal]);

  useEffect(() => {
    if (copyFromModal === "Order" && selectedOrder) {
      setCopyFromModal("");
      setDeliveryInfo((prev) => ({
        ...prev,
        order_id: selectedOrder.order_id,
      }));
      copyFromMutation.mutate({
        transferID: selectedOrder.order_id,
        transferOperation: "order",
      });
      setSelectedOrder(null);
      // fill out fields HERE
    } else if (
      copyFromModal === "Blanket Agreement" &&
      selectedBlanketAgreement
    ) {
      setDeliveryInfo(selectedBlanketAgreement);
      copyFromMutation.mutate({
        transferID: selectedBlanketAgreement.agreement_id,
        transferOperation: "agreement",
      });
      setCopyFromModal("");
      setSelectedBlanketAgreement(null);
      // fill out fields HERE
    }
  }, [selectedOrder, selectedBlanketAgreement]);

  // For copy to feature
  useEffect(() => {
    if (copyToModal === "Returns") {
      localStorage.setItem("TransferID", JSON.stringify(deliveryID));
      localStorage.setItem("TransferOperation", JSON.stringify("order"));
      console.log("Saved to local storage: operation and ID");
      loadSubModule("Returns");
      setActiveSubModule("Returns");
    } else if (copyToModal === "Invoice") {
      localStorage.setItem("TransferID", JSON.stringify(deliveryID));
      localStorage.setItem("TransferOperation", JSON.stringify("order"));
      console.log("Saved to local storage: operation and ID");
      loadSubModule("Invoice");
      setActiveSubModule("Invoice");
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
      (acc, product) => acc + product.discount,
      0
    );

    const shippingFee = products.length * 100;
    const warrantyFee = (totalBeforeDiscount * 0.1).toFixed(2);
    const totalPrice =
      Number(totalBeforeDiscount) -
      Number(totalDiscount) +
      Number(totalTax) +
      Number(shippingFee) +
      Number(warrantyFee);
    const delivery = {
      ...deliveryInfo,
      customer_id: selectedCustomer.customer_id,
      selected_products: [...products],
      total_before_discount: Number(totalBeforeDiscount),
      selected_delivery_date:
        deliveryInfo.selected_delivery_date || new Date().toISOString(),
      selected_address: selectedCustomer.address_line1,
      total_tax: Number(totalTax),
      discount: Number(totalDiscount),
      shipping_fee: Number(shippingFee),
      warranty_fee: Number(warrantyFee),
      total_price: Number(totalPrice),
    };

    setDeliveryInfo(delivery);
  }, [products, selectedCustomer]);

  useEffect(() => {
    setDeliveryInfo({
      ...deliveryInfo,
      selected_address: address,
    });
  }, [address]);

  useEffect(() => {
    setDeliveryInfo({
      ...deliveryInfo,
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
    setDeliveryInfo({
      customer_id: "",
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
    setCanClear(false);
  };

  useEffect(() => {
    if (selectedCustomer != "") setCanClear(true);
  }, [selectedCustomer]);

  return (
    <div className="delivery">
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
        <OrderListModal
          isOpen={isOrderListOpen}
          onClose={() => setIsOrderListOpen(false)}
          setOrder={setSelectedOrder}
        ></OrderListModal>

        <EmployeeListModal
          isOpen={isEmployeeListOpen}
          onClose={() => setIsEmployeeListOpen(false)}
          setEmployee={setSelectedEmployee}
        ></EmployeeListModal>

        <BlanketAgreementListModal
          isOpen={isBlanketAgreementListOpen}
          onClose={() => setIsBlanketAgreementListOpen(false)}
          setBlanketAgreement={setSelectedBlanketAgreement}
        ></BlanketAgreementListModal>
        {/* DETAILS */}
        <div>
          <SalesInfo
            type={"Delivery"}
            customer={selectedCustomer}
            customerListModal={setIsCustomerListOpen}
            setCustomerInfo={setDeliveryInfo}
            operationID={deliveryID}
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
              <Button
                type="primary"
                onClick={() => {
                  setCanClear(true);
                  setIsProductListOpen(true);
                }}
              >
                Add Item
              </Button>
              <Button type="outline" onClick={() => handleDelete()}>
                Delete Item
              </Button>
            </div>

            {/* Employee ID Input */}
            <div className="flex mb-2 w-full mt-4 gap-4 items-center">
              <p className="">Employee ID</p>
              <div
                className="border border-[#9a9a9a] flex-1 cursor-pointer p-1 flex hover:border-[#969696] transition-all duration-300 justify-between transform hover:opacity-60 items-center h-[30px] rounded"
                onClick={() => setIsEmployeeListOpen(true)}
              >
                <p className="text-sm">
                  {selectedEmployee ? selectedEmployee.employee_id : ""}
                </p>
                <img
                  src="/icons/information-icon.svg"
                  className="h-[15px]"
                  alt="info icon"
                />
              </div>
            </div>

            {/* Submit Button Aligned Right */}
            <div className="mt-auto gap-2 flex">
              <Button type="primary" className="" onClick={handleSubmit}>
                Submit Delivery
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
              value={Number(deliveryInfo.total_before_discount).toLocaleString(
                "en-US",
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }
              )}
            />
            <InfoField
              label={"Discount"}
              value={Number(deliveryInfo.discount).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            />
            <InfoField
              label={"Shipping"}
              value={Number(deliveryInfo.shipping_fee).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            />
            <InfoField
              label={"Warranty"}
              value={Number(deliveryInfo.warranty_fee).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            />
            <InfoField
              label={"Tax"}
              value={Number(deliveryInfo.total_tax).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            />
            <InfoField
              label={"Total"}
              value={Number(deliveryInfo.total_price).toLocaleString("en-US", {
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

const BodyContent = ({ loadSubModule, setActiveSubModule }) => {
  return (
    <AlertProvider>
      <Delivery
        loadSubModule={loadSubModule}
        setActiveSubModule={setActiveSubModule}
      />
    </AlertProvider>
  );
};

export default BodyContent;
