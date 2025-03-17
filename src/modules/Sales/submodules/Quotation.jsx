import { use, useEffect, useState } from "react";

import { SALES_DATA, TAX_RATE } from "../temp_data/sales_data";

import Table from "../components/Table";
import SalesTable from "../components/SalesTable";
import SalesInfo from "../components/SalesInfo";
import CustomerListModal from "../components/Modals/Lists/CustomerList";

const BodyContent = () => {
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [quotationInfo, setQuotationInfo] = useState({
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
  }); // Update customer information
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns = [
    { key: "product_id", label: "Product ID", editable: false },
    { key: "product_name", label: "Product Name", editable: false },
    { key: "quantity", label: "Quantity" },
    { key: "unit_price", label: "Unit Price" },
    { key: "tax", label: "Tax", editable: false }, // Default Tax: 12%
    { key: "discount", label: "Discount" }, // Default Discount: 0%
    { key: "total_price", label: "Total Price", editable: false },
  ];

  const [products, setProducts] = useState(
    SALES_DATA.map((item) => {
      const unitPrice = Number(item.unit_price); // Keep unit_price as a number
      const tax = TAX_RATE * unitPrice * item.quantity; // Correct tax calculation
      return {
        ...item,
        unit_price: unitPrice.toFixed(2), // Convert to string only for display
        tax: tax.toFixed(2), // Ensure tax is formatted properly
        total_price: (unitPrice * item.quantity + tax).toFixed(2), // Use converted unitPrice & tax
      };
    })
  );

  // This useEffect updates the quotationInfo state when a customer is selected
  useEffect(() => {
    setQuotationInfo((prev) => ({
      ...prev,
      customer_id: selectedCustomer.customer_id,
    }));
  }, [selectedCustomer]);

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
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          setSelectedCustomer={setSelectedCustomer}
          setCustomer={setSelectedCustomer}
        ></CustomerListModal>
        {/* DETAILS */}
        <div>
          <SalesInfo
            type={"Quotation"}
            customer={selectedCustomer}
            customerListModal={setIsModalOpen}
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
      </div>
    </div>
  );
};

export default BodyContent;
