import { use, useEffect, useState } from "react";

import { SALES_DATA, TAX_RATE } from "../temp_data/sales_data";

import SalesTable from "../components/SalesTable";
import SalesInfo from "../components/SalesInfo";
import CustomerListModal from "../components/Modals/Lists/CustomerList";
import ProductListModal from "../components/Modals/Lists/ProductList";
import Button from "../components/Button";
import SalesDropdown from "../components/SalesDropdown";

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
    discount: 0,
    total_tax: 0,
    shipping_fee: 0,
    warranty_fee: 0,
    total_price: 0,
  });

  // Modals
  const [isCustomerListOpen, setIsCustomerListOpen] = useState(false);
  const [isProductListOpen, setIsProductListOpen] = useState(false);

  const columns = [
    { key: "product_id", label: "Product ID", editable: false },
    { key: "product_name", label: "Product Name", editable: false },
    { key: "quantity", label: "Quantity" },
    { key: "unit_price", label: "Unit Price" },
    { key: "tax", label: "Tax", editable: false }, // Default Tax: 12%
    { key: "discount", label: "Discount" }, // Default Discount: 0%
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

  // This useEffect updates the quotationInfo state when a customer is selected
  useEffect(() => {
    setQuotationInfo((prev) => ({
      ...prev,
      customer_id: selectedCustomer.customer_id,
      selected_products: products,
    }));
  }, [selectedCustomer, products]);

  useEffect(() => {
    console.log("added: " + JSON.stringify(products));
  }, [products]);

  // useEffect(() => {
  //   console.log("Page: " + selectedProduct.product_id);
  // }, [selectedProduct]);

  // useEffect(() => {
  //   console.log("Info: " + quotationInfo.customer_id);
  //   console.log("Info: " + quotationInfo.selected_address);
  //   console.log("Info: " + quotationInfo.selected_delivery_date);
  // }, [quotationInfo]);

  return (
    <div className="quotation">
      <div className="body-content-container">
        {/* Displays a table and can confirm what was selected */}
        <CustomerListModal
          isOpen={isCustomerListOpen}
          onClose={() => setIsCustomerListOpen(false)}
          setSelectedCustomer={setSelectedCustomer}
          setCustomer={setSelectedCustomer}
        ></CustomerListModal>
        <ProductListModal
          isOpen={isProductListOpen}
          onClose={() => setIsProductListOpen(false)}
          addProduct={setProducts}
          products={products}
        ></ProductListModal>
        {/* DETAILS */}
        <div>
          <SalesInfo
            type={"Quotation"}
            customer={selectedCustomer}
            customerListModal={setIsCustomerListOpen}
            setCustomerInfo={setQuotationInfo}
          />
        </div>
        {/* TABLE */}
        <section className="border border-[#CBCBCB] w-full h-[350px] overflow-x-auto rounded-md mt-2 table-layout">
          <SalesTable
            columns={columns}
            data={products}
            updateData={setProducts}
            onSelect={setSelectedProduct}
            minWidth={true}
          />
        </section>

        {/* OTHERS */}
        <section className="mt-4 flex justify-between flex-col md:flex-row">
          <div className="h-full flex flex-col gap-3 w-full">
            {/* Buttons Row */}
            <div className="flex gap-2">
              <Button type="primary" onClick={() => setIsProductListOpen(true)}>
                Add Item
              </Button>
              <Button type="outline">Delete Item</Button>
            </div>

            {/* Employee ID Input */}
            <div className="flex items-center gap-2">
              <p className="text-gray-700">Employee ID</p>
              <div className="border border-gray-400 flex-1 p-1 h-[30px] max-w-[300px] bg-gray-200 rounded"></div>
            </div>

            {/* Submit Button Aligned Right */}
            <div className="mt-auto">
              <Button type="primary" className="">
                Submit Quotation
              </Button>
            </div>
          </div>

          <div className="w-full hidden xl:block"></div>

          <div className="w-full flex flex-col gap-3 mt-4 md:mt-0">
            <div className="flex items-center gap-2 justify-between">
              <p className="text-gray-700">Total Before Discount</p>
              <div className="border border-gray-400 flex-1 p-1 h-[30px] w-full max-w-[300px] bg-gray-200 rounded"></div>
            </div>
            <div className="flex items-center gap-2 justify-between">
              <p className="text-gray-700">Discount</p>
              <div className="border border-gray-400 flex-1 p-1 h-[30px] w-full max-w-[300px] bg-gray-200 rounded"></div>
            </div>
            <div className="flex items-center gap-2 justify-between">
              <p className="text-gray-700">Shipping</p>
              <div className="border border-gray-400 flex-1 p-1 h-[30px] w-full max-w-[300px] bg-gray-200 rounded"></div>
            </div>
            <div className="flex items-center gap-2 justify-between">
              <p className="text-gray-700">Warranty</p>
              <div className="border border-gray-400 flex-1 p-1 h-[30px] w-full max-w-[300px] bg-gray-200 rounded"></div>
            </div>
            <div className="flex items-center gap-2 justify-between">
              <p className="text-gray-700">Total</p>
              <div className="border border-gray-400 flex-1 p-1 h-[30px] w-full max-w-[300px] bg-gray-200 rounded"></div>
            </div>
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
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default BodyContent;
