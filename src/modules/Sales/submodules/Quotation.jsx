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
import EmployeeListModal from "../components/Modals/Lists/EmployeeListModal.jsx";

import Button from "../components/Button";
import InfoField from "../components/InfoField";
import SalesDropup from "../components/SalesDropup.jsx";
import { useMutation } from "@tanstack/react-query";
import { POST } from "../api/api";

import generateRandomID from "../components/GenerateID";

const Quotation = ({ loadSubModule, setActiveSubModule }) => {
  const { showAlert } = useAlert();

  const copyFromOptions = [];
  const copyToOptions = ["Order", "Blanket Agreement"];
  const [q_id, setQ_id] = useState("");
  const quotationMutation = useMutation({
    mutationFn: async (data) => await POST("sales/quotation/", data),
    onSuccess: (data, variables, context) => {
      setQ_id(data.quotation_id);
      showAlert({
        type: "success",
        title: "Quotation Submitted",
      });
      setSubmitted(true);
      localStorage.setItem("quotation_id", data.quotation_id);
    },
    onError: (error) => {
      showAlert({
        type: "error",
        title: "An error occurred while submitting quotation: " + error,
      });
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
  const [isEmployeeListOpen, setIsEmployeeListOpen] = useState(false);
  const [isNewCustomerModalOpen, setIsNewCustomerModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
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

  // const [products, setProducts] = useState(
  //   SALES_DATA.map((item) => {
  //     const unitPrice = Number(item.markup_price); // Keep markup_price as a number
  //     const tax = TAX_RATE * unitPrice * item.quantity; // Correct tax calculation
  //     return {
  //       ...item,
  //       markup_price: unitPrice.toFixed(2), // Convert to string only for display
  //       tax: tax.toFixed(2), // Ensure tax is formatted properly
  //       total_price: (unitPrice * item.quantity + tax).toFixed(2), // Use converted unitPrice & tax
  //     };
  //   })
  // );

  const handleDelete = () => {
    if (selectedProduct === "") {
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

  useEffect(() => {
    if (copyToModal === "Order") {
      localStorage.setItem("TransferID", JSON.stringify(q_id));
      localStorage.setItem("TransferOperation", JSON.stringify("quotation"));
      console.log("Saved to local storage: operation and ID");
      loadSubModule("Order");
      setActiveSubModule("Order");
    } else if (copyToModal === "Blanket Agreement") {
      setIsBlanketAgreementDateOpen(true);
      // Creates blanket agreement at BlanketAgreementDateModal
    }
  }, [copyToModal]);

  // const handleTransfer = () => {
  //   return false;
  // };

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
      quotation_id: q_id,
      total_before_discount: totalBeforeDiscount,
      total_tax: Number(totalTax),
      discount: totalDiscount,
      shipping_fee: shippingFee,
      warranty_fee: Number(warrantyFee),
      total_price: Number(totalPrice),
    });
  }, [selectedCustomer, products]);

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

  const handleSubmit = async () => {
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

    const request = {
      statement_data: {
        customer: selectedCustomer.customer_id,
        salesrep: selectedEmployee.employee_id,
        type: "Non-Project-Based", // make a variable
        total_amount: +parseFloat(quotationInfo.total_price).toFixed(2),
        discount: +parseFloat(quotationInfo.discount).toFixed(2),
        total_tax: +parseFloat(quotationInfo.total_tax).toFixed(2),
        items: products.map((product) => ({
          product: product.product_id,
          quantity: +parseInt(product.quantity),
          unit_price: +parseFloat(product.selling_price).toFixed(2),
          total_price: +parseFloat(product.total_price).toFixed(2),
          discount: +parseFloat(product.discount).toFixed(2),
          tax_amount: +parseFloat(product.tax).toFixed(2),
        })),
      },
      quotation_data: {
        status: "Pending",
        date_issued: new Date().toISOString(),
      },
    };

    quotationMutation.mutate(request);
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
        <BlanketAgreementDateModal
          isOpen={isBlanketAgreementDateOpen}
          onClose={() => setIsBlanketAgreementDateOpen(false)}
          quotationInfo={quotationInfo}
        ></BlanketAgreementDateModal>
        <EmployeeListModal
          isOpen={isEmployeeListOpen}
          onClose={() => setIsEmployeeListOpen(false)}
          setEmployee={setSelectedEmployee}
        ></EmployeeListModal>
        {/* DETAILS */}
        <div>
          <SalesInfo
            type={"Quotation"}
            customer={selectedCustomer}
            customerListModal={setIsCustomerListOpen}
            setCustomerInfo={setQuotationInfo}
            operationID={q_id}
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
            {/* <div className="flex items-center gap-2">
              <p className="text-gray-700 text-sm">Employee ID</p>
              <input
                type="text"
                className="border border-gray-400 flex-1 p-1 h-[30px] max-w-[250px] rounded"
                onChange={(e) => setSelectedEmployee(e.target.value)}
                value={selectedEmployee || ""}
              ></input>
            </div> */}

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
