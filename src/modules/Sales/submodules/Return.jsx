import React from "react";
import { useEffect, useState } from "react";
import { TAX_RATE } from "../temp_data/sales_data";
import "../styles/Index.css";
import {
  AlertProvider,
  useAlert,
} from "../components/Context/AlertContext.jsx";

import CustomerListModal from "../components/Modals/Lists/CustomerList";
import DeliveredProductList from "../components/Modals/Lists/DeliveredProductList.jsx";
import EmployeeListModal from "../components/Modals/Lists/EmployeeListModal.jsx";
import DeliveredList from "./../components/Modals/Lists/DeliveredList";

import NewCustomerModal from "../components/Modals/NewCustomer";
import ReturnTable from "../components/ReturnTable.jsx";
import ReturnInfo from "../components/ReturnInfo.jsx";

import Button from "../components/Button";
import InfoField from "../components/InfoField";
import SalesDropup from "../components/SalesDropup.jsx";
import { POST } from "../api/api.jsx";
import { useQuery, useMutation } from "@tanstack/react-query";
import generateRandomID from "../components/GenerateID.jsx";

const Return = () => {
  const { showAlert } = useAlert();

  const [address, setAddress] = useState("");

  const [copyFromModal, setCopyFromModal] = useState("");
  const [selectedProduct, setSelectedProduct] = useState();
  const [selectedCustomer, setSelectedCustomer] = useState("");

  // Modals
  const [isCustomerListOpen, setIsCustomerListOpen] = useState(false);
  const [isProductListOpen, setIsProductListOpen] = useState(false); // TEMP
  const [isNewCustomerModalOpen, setIsNewCustomerModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [isEmployeeListOpen, setIsEmployeeListOpen] = useState(false);

  const [isDeliveredListOpen, setIsDeliveredListOpen] = useState(false);
  const [canEditList, setCanEditList] = useState(false);

  // columns for table
  const columns = [
    { key: "product_id", label: "Product ID", editable: false },
    { key: "product_name", label: "Product Name", editable: false },
    { key: "reason", label: "Reason", editable: true },
    { key: "quantity", label: "Quantity", editable: true },
    { key: "selling_price", label: "Price", editable: false },
    { key: "tax", label: "Tax", editable: false },
    { key: "discount", label: "Discount", editable: false },
    { key: "total_price", label: "Total Price", editable: false },
  ];

  // the products customer chose
  const [products, setProducts] = useState([]);
  const [initialProducts, setInitialProducts] = useState([]);

  const [returnID, setReturnID] = useState("");
  const returnMutation = useMutation({
    mutationFn: async (data) => await POST("sales/returns/", data),
    onSuccess: (data) => {
      showAlert({
        type: "success",
        title: "Return request submitted.",
      });
    },
    onError: (error) => {
      showAlert({
        type: "error",
        title:
          "An error occurred while submitting return request: " + error.message,
      });
    },
  });

  const [deliveryInfo, setDeliveryInfo] = useState({
    customer_id: "",
    order_id: "",
    delivery_note_id: "",
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

    setInitialProducts(
      initialProducts.filter(
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
    if (selectedEmployee == "") {
      showAlert({
        type: "error",
        title: "Please select employee.",
      });
      return;
    }
    // INSERT LOGIC HERE FOR RETURN
    const request = {
      return_data: {
        delivery_note: deliveryInfo.delivery_note_id,
        status: "Pending",
        items: products.map((product, index) => {
          return {
            product: product.product_id,
            quantity: parseInt(product.quantity),
            quantity_to_deliver: parseInt(product.quantity),
            unit_price: Number(parseFloat(product.selling_price).toFixed(2)),
            total_price: Number(parseFloat(product.total_price).toFixed(2)),
            discount: Number(parseFloat(product.discount).toFixed(2)),
            tax_amount: Number(parseFloat(product.tax).toFixed(2)),
            return_reason: product.reason,
            return_action: "Return", // make drop down
          };
        }),
      },
      statement_data: {
        customer: selectedCustomer.customer_id,
        salesrep: selectedEmployee.employee_id,
        total_amount: Number(parseFloat(deliveryInfo.total_price).toFixed(2)),
        discount: Number(parseFloat(deliveryInfo.discount).toFixed(2)),
        total_tax: Number(parseFloat(deliveryInfo.total_tax).toFixed(2)),
      },
    };
    returnMutation.mutate(request);
  };

  // Change customer
  useEffect(() => {
    setProducts([]);
    setDeliveryInfo({
      customer_id: "",
      order_id: "",
      delivery_note_id: "",
      selected_products: [],
      selected_address: "",
      selected_delivery_date: "",
      total_before_discount: 0,
      date_issued: new Date().toISOString().split("T")[0],
      discount: 0,
      total_tax: 0,
      total_price: 0,
    });
    setSelectedProduct(null);
    setCanEditList(false);
    setSelectedEmployee(null);
  }, [selectedCustomer]);

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
    const totalPrice =
      Number(totalBeforeDiscount) - Number(totalDiscount) + Number(totalTax);
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
      total_price: Number(totalPrice),
    };

    setDeliveryInfo(delivery);
  }, [products]);

  useEffect(() => {
    setDeliveryInfo({
      ...deliveryInfo,
      selected_address: address,
    });
  }, [address]);

  useEffect(() => {
    if (!copyFromModal) return;

    const modalActions = {
      Delivery: setIsDeliveredListOpen,
    };

    modalActions[copyFromModal]?.(true);
  }, [copyFromModal]);

  return (
    <div className="delivery">
      <div className="body-content-container">
        {/* Displays a table and can confirm what was selected */}
        <CustomerListModal
          isOpen={isCustomerListOpen}
          onClose={() => setIsCustomerListOpen(false)}
          newCustomerModal={setIsNewCustomerModalOpen}
          setSelectedCustomer={setSelectedCustomer}
          setCustomer={setSelectedCustomer}
        ></CustomerListModal>

        <DeliveredProductList
          isOpen={isProductListOpen}
          onClose={() => setIsProductListOpen(false)}
          addProduct={setProducts}
          products={products}
          setInitialProducts={setInitialProducts}
          // Pass customer and order ID to the product list modal and search for delivered products
          delivery={deliveryInfo}
        ></DeliveredProductList>

        <NewCustomerModal
          isOpen={isNewCustomerModalOpen}
          onClose={() => setIsNewCustomerModalOpen(false)}
        ></NewCustomerModal>

        {/* For COPY FROM */}
        <DeliveredList
          isOpen={isDeliveredListOpen}
          onClose={() => setIsDeliveredListOpen(false)}
          customerID={selectedCustomer.customer_id}
          setDelivery={setDeliveryInfo}
          setProducts={setProducts}
          setInitialProducts={setInitialProducts}
          setEditable={setCanEditList}
          selectedCustomer={selectedCustomer}
          setSelectedEmployee={setSelectedEmployee}
        ></DeliveredList>

        <EmployeeListModal
          isOpen={isEmployeeListOpen}
          onClose={() => setIsEmployeeListOpen(false)}
          setEmployee={setSelectedEmployee}
        ></EmployeeListModal>

        {/* DETAILS */}
        <div>
          <ReturnInfo
            type={"Delivery"}
            customer={selectedCustomer}
            customerListModal={setIsCustomerListOpen}
            delivery={deliveryInfo}
            deliveredListModal={setIsDeliveredListOpen}
            returnID={returnID}
          />
        </div>
        {/* TABLE */}
        <section className="border border-[#CBCBCB] w-full min-h-[350px] overflow-x-auto rounded-md mt-2 table-layout">
          <ReturnTable
            columns={columns}
            data={products}
            initialProducts={initialProducts}
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
                disabled={!canEditList}
                onClick={() => setIsProductListOpen(true)}
              >
                Add Item
              </Button>
              <Button
                type="outline"
                disabled={!canEditList}
                onClick={() => handleDelete()}
              >
                Delete Item
              </Button>
            </div>

            {/* Employee ID Input */}
            <div className="flex mb-2 w-full mt-4 gap-4 flex-col sm:flex-row">
              <p className="">Employee ID</p>
              <div
                className="border border-[#9a9a9a] flex-1 cursor-pointer p-1 flex hover:border-[#969696] transition-all duration-300 justify-between transform hover:opacity-60 items-center h-[30px] rounded max-w-[300px] sm:max-w-none"
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
            <div className="mt-auto">
              <Button type="primary" onClick={handleSubmit}>
                Submit Return Request
              </Button>
            </div>
          </div>

          <div className="w-full hidden xl:block"></div>
          <div className="w-full flex flex-col gap-3 mt-4 lg:mt-0 flex-wrap">
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
              label={"Tax"}
              value={Number(deliveryInfo.total_tax).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            />
            <InfoField
              label={"Total Amount to Return"}
              value={Number(deliveryInfo.total_price).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            />
            <div className="flex justify-center md:justify-end gap-2">
              <SalesDropup
                label=""
                placeholder="Copy From"
                options={[]}
                disabled={true}
                setOption={setCopyFromModal}
              />
              <SalesDropup
                label=""
                placeholder="Copy To"
                options={[]}
                disabled={true}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

const BodyContent = () => {
  return (
    <AlertProvider>
      <Return />
    </AlertProvider>
  );
};

export default BodyContent;
