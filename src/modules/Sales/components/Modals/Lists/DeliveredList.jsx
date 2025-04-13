"use client";

import { useState, useEffect, useRef } from "react";

import { useAlert } from "../../Context/AlertContext.jsx";

import DELIVERY_LIST_DATA from "../../../temp_data/deliveries_list_data.jsx";

import Table from "../../Table";
import Button from "../../Button";
import { GET } from "../../../api/api.jsx";
import { useQuery } from "@tanstack/react-query";

const DeliveredList = ({
  isOpen,
  onClose,
  setDelivery,
  customerID,
  setProducts,
  setInitialProducts,
  setEditable,
  selectedCustomer,
  setSelectedEmployee,
}) => {
  // ALL DELIVERED ORDERS TO THE CUSTOMER
  // console.log("Customer ID:", customerID);
  const { showAlert } = useAlert();

  const [delivery_list, set_delivery_list] = useState([]);

  const [selectedDelivery, setSelectedDelivery] = useState(null);
  // Filtered data is used to filter the data based on the search term
  const [filteredData, setFilteredData] = useState([]);
  const deliveryQuery = useQuery({
    queryKey: ["deliveriesList"],
    queryFn: async () =>
      await GET(
        `sales/delivery?shipment_status=Delivered&customer_id=${selectedCustomer.customer_id}`
      ),
    enabled: isOpen,
    retry: 2,
  });

  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);

  const columns = [
    { key: "delivery_note_id", label: "Delivery ID" },
    { key: "customer_name", label: "Name" }, // Company Name
    { key: "date_shipped", label: "Shipped" },
    { key: "delivered_date", label: "Delivered" },
  ];

  const handleConfirm = () => {
    if (selectedDelivery) {
      const prods = selectedDelivery.statement.items.map((item) => ({
        product_id: item.product.product_id,
        product_name: item.product.product_name,
        quantity: Number(item.quantity),
        selling_price: Number(item.unit_price),
        discount: Number(item.discount),
        tax: Number(item.tax_amount),
        total_price: Number(item.total_price),
        reason: "",
      }));
      setDelivery(selectedDelivery); // Properly update the array
      setSelectedEmployee(selectedDelivery.statement.salesrep);
      setProducts(prods); // Set the selected products to the parent component
      setInitialProducts(prods); // Set the selected products to the parent component
      onClose();
      showAlert({
        type: "success",
        title: "Delivery Selected",
      });
      // setSelectedDelivery(null);
      setEditable(true);
    }
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    // Focus the close button when modal opens
    if (isOpen && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }

    // Prevent scrolling on body when modal is open
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (deliveryQuery.status === "success") {
      const data = deliveryQuery.data.map((delivery) => ({
        ...delivery,
        delivery_note_id: delivery.delivery_note_id,
        customer_name: delivery.statement?.customer?.name,
        date_shipped: new Date(delivery.shipping_date).toLocaleString(),
        delivered_date: new Date(
          delivery.actual_delivery_date
        ).toLocaleString(),
      }));
      set_delivery_list(data);
      setFilteredData(data);
    } else if (deliveryQuery.status === "error") {
      showAlert({
        type: "error",
        title:
          "An error occurred while fetching data: " +
          deliveryQuery.error.message,
      });
    }
  }, [deliveryQuery.data, deliveryQuery.status]);
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-1000"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className="bg-white pb-6 overflow-auto rounded-lg shadow-lg max-w-lg w-full relative animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        {/* HEADER */}
        <div className="w-full bg-[#EFF8F9] py-[20px] px-[30px] border-b border-[#cbcbcb]">
          <h2 id="modal-title" className="text-xl font-semibold">
            List Of Deliveries
          </h2>
        </div>

        {/* Close button */}
        <button
          ref={closeButtonRef}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-900 rounded-full p-1 text-3xl cursor-pointer transition-all duration-200"
          onClick={onClose}
          aria-label="Close modal"
        >
          &times;
        </button>

        {/* BODY */}
        <div className="px-6 mt-4">
          <div className="mb-4 flex items-center">
            <p className="mr-2">Search:</p>
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-2 py-1 border border-gray-300 rounded-md max-w-[300px]"
              onChange={(e) => {
                const searchTerm = e.target.value.toLowerCase();
                const filtered = delivery_list.filter((item) =>
                  item.customer_name.toLowerCase().includes(searchTerm)
                );
                setFilteredData(filtered);
              }}
            />
          </div>
          <div className="h-[300px] overflow-auto border border-[#CBCBCB] rounded-md">
            <Table
              columns={columns}
              data={filteredData}
              onSelect={setSelectedDelivery}
            />
          </div>
          <div className="mt-4 flex justify-between">
            <div>
              <Button
                type="primary"
                onClick={handleConfirm}
                disabled={!selectedDelivery}
              >
                Select
              </Button>
            </div>
            <div>
              <Button type="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveredList;
