import { useEffect, useState } from "react";
import "../styles/Index.css";

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
import BlanketAgreementDateModal from "../components/Modals/BlanketAgreementDates.jsx";

import Button from "../components/Button";
import InfoField from "../components/InfoField";
import SalesDropup from "../components/SalesDropup.jsx";
import { useMutation } from "@tanstack/react-query";
import { addQuotation } from "../api/api";
import generateRandomID from "../components/GenerateID";

const Quotation = ({ loadSubModule, setActiveSubModule }) => {
  const { showAlert } = useAlert();

  const copyFromOptions = [];
  const copyToOptions = ["Order", "Blanket Agreement"];

  const quotationMutation = useMutation({
    mutationFn: addQuotation,
    onSuccess: (data, variables, context) => {
      console.log(data);
    },
  });

  const [copyToModal, setCopyToModal] = useState("");
  // save current info to local storage
  // navigate to selected modal
  // use local storage to populate the fields
  // remove local storage after use

  const [submitted, setSubmitted] = useState(false);

  const [copyFromModal, setCopyFromModal] = useState(""); // variable to set what list will be shown
  // show list modal
  // replace current info with selected info
  const [copyInfo, setCopyInfo] = useState({}); // Info from copyFromModal

  const [address, setAddress] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");

  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");

  const [quotationInfo, setQuotationInfo] = useState(
    localStorage.getItem("Transfer") || {
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
    }
  );

  // Modals
  const [isCustomerListOpen, setIsCustomerListOpen] = useState(false);
  const [isProductListOpen, setIsProductListOpen] = useState(false);
  const [isNewCustomerModalOpen, setIsNewCustomerModalOpen] = useState(false);
  const [isBlanketAgreementDateOpen, setIsBlanketAgreementDateOpen] =
    useState(false);

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

  const setProductsFix = (items) => {
    const newProd = items.map((item) => ({
      ...item,
      selling_price: !item.selling_price ? 0.0 : item.selling_price,
      tax: !item.tax ? 0.0 : item.tax,
      discount: !item.discount ? 0.0 : item.discount,
    }));
    setProducts(newProd);
  };
  // const [products, setProducts] = useState(
  //   SALES_DATA.map((item) => {
  //     const unitPrice = Number(item.selling_price); // Keep selling_price as a number
  //     const tax = TAX_RATE * unitPrice * item.quantity; // Correct tax calculation
  //     return {
  //       ...item,
  //       selling_price: unitPrice.toFixed(2), // Convert to string only for display
  //       tax: tax.toFixed(2), // Ensure tax is formatted properly
  //       total_price: (unitPrice * item.quantity + tax).toFixed(2), // Use converted unitPrice & tax
  //     };
  //   })
  // );

  const handleDelete = () => {
    if (selectedProduct === "") {
      return;
    }

    setProductsFix(
      products.filter(
        (product) => product.product_id != selectedProduct.product_id
      )
    );

    showAlert({
      type: "success",
      title: "Product Removed",
    });
  };

  useEffect(() => {
    if (copyToModal === "Order") {
      localStorage.setItem("Transfer", JSON.stringify(quotationInfo));
      console.log(quotationInfo);
      loadSubModule("Order");
      setActiveSubModule("Order");
    } else if (copyToModal === "Blanket Agreement") {
      setIsBlanketAgreementDateOpen(true);
    }
    setCopyToModal("");
  }, [copyToModal]);

  // const handleTransfer = () => {
  //   return false;
  // };

  // useEffect(() => {
  //   console.log("test");
  // }, []);

  // This useEffect updates the quotationInfo state when a customer is selected
  useEffect(() => {
    const totalBeforeDiscount = products.reduce(
      (acc, product) => acc + Number(product.selling_price) * product.quantity,
      0
    );
    const totalTax = Number(
      products.reduce(
        (acc, product) =>
          acc + TAX_RATE * (Number(product.selling_price) * product.quantity),
        0
      )
    ).toFixed(2);
    const totalDiscount = products.reduce(
      (acc, product) => acc + Number(product.discount),
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

    setQuotationInfo({
      ...quotationInfo,
      customer_id: selectedCustomer.customer_id,
      selected_products: products,
      total_before_discount: totalBeforeDiscount,
      total_tax: Number(totalTax),
      discount: totalDiscount,
      shipping_fee: shippingFee,
      warranty_fee: Number(warrantyFee),
      total_price: Number(totalPrice),
    });
  }, [selectedCustomer, products]);

  // useEffect(() => {
  //   console.log("Page: " + selectedProduct.product_id);
  // }, [selectedProduct]);

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
      title: "Quotation Submitted",
    });
  };

  useEffect(() => {
    setQuotationInfo({
      ...quotationInfo,
      selected_address: address,
    });
  }, [address]);

  useEffect(() => {
    setQuotationInfo({
      ...quotationInfo,
      selected_delivery_date: deliveryDate,
    });
  }, [deliveryDate]);

  // useEffect(() => {
  //   console.log(quotationInfo);
  // }, [quotationInfo]);

  const handleSubmit = () => {
    const request = {
      statement_data: {
        customer: selectedCustomer.customer_id,
        // salesrep: selectedEmployee.employee_id
        total_amount: quotationInfo.total_price,
        discount: quotationInfo.discount,
        total_tax: quotationInfo.total_tax,
        items: products.map((product) => ({
          product: product.product_id,
          quantity: product.quantity,
          unit_price: product.selling_price,
          total_price: Number(product.total_price),
          discount: product.discount,
          tax_amount: Number(product.tax),
        })),
      },
      quotation_data: {
        status: "Pending",
      },
    };

    // handle POST request to /api/sales/quotation
    console.log(request);
  };

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
          addProduct={setProductsFix}
          products={products}
        ></ProductListModal>
        <NewCustomerModal
          isOpen={isNewCustomerModalOpen}
          onClose={() => setIsNewCustomerModalOpen(false)}
        ></NewCustomerModal>
        <BlanketAgreementDateModal
          isOpen={isBlanketAgreementDateOpen}
          onClose={() => setIsBlanketAgreementDateOpen(false)}
          quotationInfo={quotationInfo}
        ></BlanketAgreementDateModal>
        {/* DETAILS */}
        <div>
          <SalesInfo
            type={"Quotation"}
            customer={selectedCustomer}
            customerListModal={setIsCustomerListOpen}
            setCustomerInfo={setQuotationInfo}
            operationID={quotationInfo.quotation_id}
            setDeliveryDate={setDeliveryDate}
            setAddress={setAddress}
          />
        </div>
        {/* TABLE */}
        <section className="border border-[#CBCBCB] w-full min-h-[350px] overflow-x-auto rounded-md mt-2 table-layout">
          <SalesTable
            columns={columns}
            data={products}
            updateData={setProductsFix}
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
              value={quotationInfo.total_before_discount}
            />
            <InfoField
              label={"Discount"}
              value={Number(quotationInfo.discount).toFixed(2)}
            />
            <InfoField
              label={"Shipping"}
              value={Number(quotationInfo.shipping_fee).toFixed(2)}
            />
            <InfoField
              label={"Warranty"}
              value={Number(quotationInfo.warranty_fee).toFixed(2)}
            />
            <InfoField
              label={"Tax"}
              value={Number(quotationInfo.total_tax).toFixed(2)}
            />
            <InfoField
              label={"Total"}
              value={Number(quotationInfo.total_price).toFixed(2)}
            />
            <div className="flex justify-center md:justify-end gap-2">
              <SalesDropup
                label=""
                placeholder="Copy From"
                options={copyFromOptions}
                disabled={true}
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
      <Quotation
        loadSubModule={loadSubModule}
        setActiveSubModule={setActiveSubModule}
      />
    </AlertProvider>
  );
};

export default BodyContent;
