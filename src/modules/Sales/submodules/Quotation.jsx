import { useEffect, useState } from "react";

import { SALES_DATA, TAX_RATE } from "../temp_data/sales_data";

import SalesTable from "../components/SalesTable";
import SalesInfo from "../components/SalesInfo";
import CustomerListModal from "../components/Modals/Lists/CustomerList";
import ProductListModal from "../components/Modals/Lists/ProductList";
import NewCustomerModal from "../components/Modals/NewCustomer";
import Button from "../components/Button";
import InfoField from "../components/InfoField";
import SalesDropdown from "../components/SalesDropdown";
import generateRandomID from "../components/GenerateID";

const BodyContent = () => {
  const copyFromOptions = [];
  const copyToOptions = ["Order", "Blanket Agreement"];

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
    shipping_fee: 0,
    warranty_fee: 0,
    total_price: 0,
  });

  // Modals
  const [isCustomerListOpen, setIsCustomerListOpen] = useState(false);
  const [isProductListOpen, setIsProductListOpen] = useState(false);
  const [isNewCustomerModalOpen, setIsNewCustomerModalOpen] = useState(false);

  const columns = [
    { key: "product_id", label: "Product ID", editable: false },
    { key: "product_name", label: "Product Name", editable: false },
    { key: "quantity", label: "Quantity" },
    { key: "unit_price", label: "Unit Price" },
    { key: "tax", label: "Tax", editable: false },
    { key: "discount", label: "Discount" },
    { key: "total_price", label: "Total Price", editable: false },
  ];

  const [products, setProducts] = useState([]);

  // const [products, setProducts] = useState(
  //   SALES_DATA.map((item) => {
  //     const unitPrice = Number(item.unit_price); // Keep unit_price as a number
  //     const tax = TAX_RATE * unitPrice * item.quantity; // Correct tax calculation
  //     return {
  //       ...item,
  //       unit_price: unitPrice.toFixed(2), // Convert to string only for display
  //       tax: tax.toFixed(2), // Ensure tax is formatted properly
  //       total_price: (unitPrice * item.quantity + tax).toFixed(2), // Use converted unitPrice & tax
  //     };
  //   })
  // );

  const handleDelete = () => {
    if (selectedProduct === "") {
      return;
    }

    setProducts(
      products.filter(
        (product) => product.product_id != selectedProduct.product_id
      )
    );
  };

  // This useEffect updates the quotationInfo state when a customer is selected
  useEffect(() => {
    const totalBeforeDiscount = products.reduce(
      (acc, product) => acc + product.unit_price * product.quantity,
      0
    );
    const totalTax = products.reduce(
      (acc, product) =>
        acc + TAX_RATE * (product.unit_price * product.quantity),
      0
    );
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

    const randomID = selectedCustomer ? generateRandomID("Q") : undefined;

    setQuotationInfo({
      ...quotationInfo,
      customer_id: selectedCustomer.customer_id,
      selected_products: products,
      quotation_id: randomID,
      total_before_discount: totalBeforeDiscount,
      total_tax: totalTax,
      discount: totalDiscount,
      shipping_fee: shippingFee,
      warranty_fee: warrantyFee,
      total_price: totalPrice,
    });
  }, [selectedCustomer, products]);

  // useEffect(() => {
  //   console.log("Page: " + selectedProduct.product_id);
  // }, [selectedProduct]);

  // useEffect(() => {
  //   console.log("Info: " + JSON.stringify(quotationInfo));
  // }, [quotationInfo]);

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
        {/* DETAILS */}
        <div>
          <SalesInfo
            type={"Quotation"}
            customer={selectedCustomer}
            customerListModal={setIsCustomerListOpen}
            setCustomerInfo={setQuotationInfo}
            operationID={quotationInfo.quotation_id}
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
        <section className="mt-4 flex justify-between flex-col lg:flex-row">
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
              <div className="border border-gray-400 flex-1 p-1 h-[30px] max-w-[300px] bg-gray-200 rounded"></div>
            </div>

            {/* Submit Button Aligned Right */}
            <div className="mt-auto">
              <Button
                type="primary"
                className=""
                onClick={() => console.log(quotationInfo)}
              >
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
            <InfoField label={"Discount"} value={quotationInfo.discount} />
            <InfoField label={"Shipping"} value={quotationInfo.shipping_fee} />
            <InfoField label={"Warranty"} value={quotationInfo.warranty_fee} />
            <InfoField label={"Tax"} value={quotationInfo.total_tax} />
            <InfoField label={"Total"} value={quotationInfo.total_price} />
            <div className="flex justify-center md:justify-end gap-2">
              <SalesDropdown
                label=""
                placeholder="Copy From"
                options={copyFromOptions}
                disabled={true}
              />
              <SalesDropdown
                label=""
                placeholder="Copy To"
                options={copyToOptions}
                disabled={
                  selectedCustomer.customer_id == undefined ||
                  products.length === 0
                }
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default BodyContent;
