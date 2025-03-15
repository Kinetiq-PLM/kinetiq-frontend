import { useEffect, useState } from "react";

import { SALES_DATA } from "../temp_data/sales_data";
import Table from "../components/Table";
import SalesInfo from "../components/SalesInfo";
import CustomerListModal from "../components/Modals/Lists/CustomerList";

const BodyContent = () => {
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns = [
    { key: "product_id", label: "Product ID" },
    { key: "product_name", label: "Product Name" },
    { key: "quantity", label: "Quantity" },
    { key: "unit_price", label: "Unit Price" },
    { key: "tax", label: "Tax" }, // Default Tax: 12%
    { key: "discount", label: "Discount" }, // Default Discount: 0%
    { key: "total_price", label: "Total Price" },
  ];

  const [data, setData] = useState(
    SALES_DATA.map((item) => ({
      ...item,
      unit_price: item.unit_price.toFixed(2),
      total_price: item.total_price.toFixed(2),
    }))
  );

  useEffect(() => {
    console.log("Page: " + selectedCustomer.customer_id);
  }, [selectedCustomer]);

  useEffect(() => {
    console.log("Page: " + selectedProduct.product_id);
  }, [selectedProduct]);

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
          />
        </div>

        {/* TABLE */}
        <section className="border border-[#CBCBCB] h-full max-h-[350px] overflow-auto rounded-md">
          <Table columns={columns} data={data} onSelect={setSelectedProduct} />
        </section>
      </div>
    </div>
  );
};

export default BodyContent;
