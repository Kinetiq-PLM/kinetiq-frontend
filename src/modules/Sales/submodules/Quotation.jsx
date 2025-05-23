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
import BlanketAgreementDetailsModal from "../components/Modals/BlanketAgreementDetails.jsx";
import EmployeeListModal from "../components/Modals/Lists/EmployeeListModal.jsx";
import ConfirmClear from "./../components/ConfirmClear";

import Button from "../components/Button";
import InfoField from "../components/InfoField";
import SalesDropup from "../components/SalesDropup.jsx";
import { useMutation } from "@tanstack/react-query";
import { GET, POST } from "../api/api";

import generateRandomID from "../components/GenerateID";

const Quotation = ({
  loadSubModule,
  setActiveSubModule,
  employee_id,
  position_id,
}) => {
  // TEMPORARY CONSTANT VALUE FOR EMPLOYEE LOGGED IN
  const IS_SALES_REP = true;

  const { showAlert } = useAlert();
  const copyFromOptions = [];
  const copyToOptions = ["Order"];
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
  const [isSalesRep, setIsSalesRep] = useState(false);

  useEffect(() => {
    const get = async () => {
      try {
        const res = await GET(`misc/employee/${employee_id}`);
        if (res.position_id === "REG-2504-6039" || res.is_supervisor) {
          setIsSalesRep(true);
        }
      } catch (err) {
        showAlert({
          type: "error",
          title: "An error occurred while fetching employee data.",
        });
      }
    };
    get();
  }, []);
  // save current info to local storage
  // navigate to selected modal
  // use local storage to populate the fields
  // remove local storage after use

  const [submitted, setSubmitted] = useState(false);
  const [canClear, setCanClear] = useState(false);

  const [copyFromModal, setCopyFromModal] = useState(""); // variable to set what list will be shown
  // show list modal
  // replace current info with selected info
  const [copyInfo, setCopyInfo] = useState({}); // Info from copyFromModal

  const [address, setAddress] = useState("");
  const [dateIssued, setDateIssued] = useState("");

  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");

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
    total_price: 0,
  });

  // Modals
  const [isConfirmClearOpen, setIsConfirmClearOpen] = useState(false);
  const [isCustomerListOpen, setIsCustomerListOpen] = useState(false);
  const [isProductListOpen, setIsProductListOpen] = useState(false);
  const [isEmployeeListOpen, setIsEmployeeListOpen] = useState(false);
  const [isNewCustomerModalOpen, setIsNewCustomerModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [disableCopyTo, setDisableCopyTo] = useState(false);
  const [isBlanketAgreementDetailsOpen, setIsBlanketAgreementDetailsOpen] =
    useState(false);

  const [payload, setPayload] = useState({});
  // columns for table
  const columns = [
    { key: "product_id", label: "Product ID", editable: false },
    { key: "product_name", label: "Product Name", editable: false },
    { key: "special_requests", label: "Specification" },
    { key: "quantity", label: "Quantity" },
    { key: "selling_price", label: "Price", editable: false },
    { key: "tax", label: "Tax", editable: false },
    { key: "discount", label: "Discount" },
    { key: "total_price", label: "Total Price", editable: false },
  ];

  // the products customer chose
  const [products, setProducts] = useState([]);

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
      setIsBlanketAgreementDetailsOpen(true);
    }
  }, [copyToModal]);

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

    const totalPrice =
      Number(totalBeforeDiscount) + Number(totalTax) - Number(totalDiscount);

    setQuotationInfo({
      ...quotationInfo,
      customer_id: selectedCustomer.customer_id,
      selected_products: products,
      quotation_id: q_id,
      total_before_discount: Number(totalBeforeDiscount),
      total_tax: Number(totalTax),
      discount: Number(totalDiscount),
      total_price: Number(totalPrice),
    });
  }, [selectedCustomer, products]);

  useEffect(() => {
    setQuotationInfo({
      ...quotationInfo,
      selected_address: address,
    });
  }, [address]);

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
    console.log(products);

    const request = {
      statement_data: {
        customer: selectedCustomer.customer_id,
        salesrep: employee_id,
        total_amount: Number(parseFloat(quotationInfo.total_price).toFixed(2)),
        discount: Number(parseFloat(quotationInfo.discount).toFixed(2)),
        total_tax: Number(quotationInfo.total_tax.toFixed(2)),
        subtotal: Number(quotationInfo.total_before_discount.toFixed(2)),
        items: products.map((product) => {
          if (product.special_requests !== null) {
            setDisableCopyTo(true);
          }
          // console.log(product);
          return {
            inventory_item: product.inventory_items[0].inventory_item_id, // always select muna pinaka unang warehouse since quotation palang naman
            quantity: parseInt(product.quantity),
            special_requests: product.special_requests
              ? product.special_requests
              : null,
            unit_price: Number(parseFloat(product.selling_price).toFixed(2)),
            total_price:
              Number(parseFloat(product.selling_price).toFixed(2)) *
              parseInt(product.quantity),
            discount: Number(parseFloat(product.discount).toFixed(2)),
            tax_amount: Number(parseFloat(product.tax).toFixed(2)),
          };
        }),
      },
      // quotation_data: {
      //   date_issued: new Date().toISOString(),
      // },
    };
    setPayload({ ...request, name: selectedCustomer.name });
    console.log(request);
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
      selected_delivery_date: dateIssued,
    });
  }, [dateIssued]);

  const handleClear = () => {
    setProducts([]);
    setSelectedCustomer("");
    setSelectedProduct("");
    setSelectedEmployee("");
    setAddress("");
    setDateIssued("");
    setQ_id("");
    setQuotationInfo({
      customer_id: "",
      quotation_id: "",
      selected_products: [],
      selected_address: "",
      selected_delivery_date: "",
      total_before_discount: 0,
      date_issued: "",
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

  function handleCustomerSelection() {
    setIsCustomerListOpen(true);
  }

  useEffect(() => {
    if (!selectedEmployee) return;
    setIsCustomerListOpen(true);
  }, [selectedEmployee]);

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
          isNewCustomerModalOpen={isNewCustomerModalOpen}
          onClose={() => setIsCustomerListOpen(false)}
          newCustomerModal={setIsNewCustomerModalOpen}
          setCustomer={setSelectedCustomer}
          employee={selectedEmployee}
        ></CustomerListModal>

        <EmployeeListModal
          isOpen={isEmployeeListOpen}
          onClose={() => setIsEmployeeListOpen(false)}
          setEmployee={setSelectedEmployee}
        ></EmployeeListModal>

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
        <BlanketAgreementDetailsModal
          isOpen={isBlanketAgreementDetailsOpen}
          onClose={() => setIsBlanketAgreementDetailsOpen(false)}
          quotationInfo={payload}
        ></BlanketAgreementDetailsModal>
        {/* DETAILS */}
        <div>
          <SalesInfo
            type={"Quotation"}
            customer={selectedCustomer}
            customerListModal={setIsCustomerListOpen}
            setCustomerInfo={setQuotationInfo}
            operationID={q_id}
            setDateIssued={setDateIssued}
            dateIssued={new Date().toISOString().split("T")[0]}
            setAddress={setAddress}
            handleCustomerSelection={handleCustomerSelection}
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
            isQuotation={true}
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
                disabled={!isSalesRep}
              >
                Add Item
              </Button>
              <Button
                type="outline"
                onClick={() => handleDelete()}
                disabled={!isSalesRep}
              >
                Delete Item
              </Button>
            </div>

            {/* Employee ID Input */}
            <div className="flex mb-2 w-full mt-4 gap-4 items-center">
              <p className="">Sales Rep ID</p>
              <div className="border border-[#9a9a9a] flex-1 p-1 flex transition-all duration-300 justify-between transform items-center h-[30px] rounded truncate">
                <p className="text-sm">{employee_id}</p>
              </div>
            </div>

            {/*

            {IS_SALES_REP ? (
              ""
            ) : (
              <div className="flex mb-2 w-full mt-4 gap-4 items-center">
                <p className="">Processor ID</p>
                <div className="border border-[#9a9a9a] flex-1 p-1 flex transition-all duration-300 justify-between transform items-center h-[30px] rounded truncate">
                  <p className="text-sm">{employee_id || ""}</p>
                </div>
              </div>
            )} */}

            {/* Submit Button Aligned Right */}
            <div className="mt-auto gap-2 flex">
              <Button
                type="primary"
                className=""
                onClick={handleSubmit}
                disabled={!isSalesRep || products.length === 0}
              >
                Submit Quotation
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
              value={Number(quotationInfo.total_before_discount).toLocaleString(
                "en-US",
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }
              )}
            />
            <InfoField
              label={"Discount"}
              value={Number(quotationInfo.discount).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            />

            <InfoField
              label={"Tax"}
              value={Number(quotationInfo.total_tax).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            />
            <InfoField
              label={"Total"}
              value={Number(quotationInfo.total_price).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
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
                disabled={!submitted || disableCopyTo}
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

const BodyContent = ({
  loadSubModule,
  setActiveSubModule,
  employee_id,
  position_id,
}) => {
  return (
    <AlertProvider>
      <Quotation
        loadSubModule={loadSubModule}
        setActiveSubModule={setActiveSubModule}
        employee_id={employee_id}
        position_id={position_id}
      />
    </AlertProvider>
  );
};

export default BodyContent;
