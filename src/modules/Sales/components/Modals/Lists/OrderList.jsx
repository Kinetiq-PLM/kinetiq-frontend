"use client";

import { useState, useEffect, useRef } from "react";

import { useAlert } from "../../Context/AlertContext.jsx";

import ORDER_LIST_DATA from "./../../../temp_data/order_list_data";

import Table from "../../Table";
import Button from "../../Button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getOrders } from "../../../api/api.jsx";

const OrderListModal = ({ isOpen, onClose, setOrder }) => {
  const { showAlert } = useAlert();

  const [orderList, setOrderList] = useState([]);

  const [selectedOrder, setSelectedOrder] = useState(null);

  // Filtered data is used to filter the data based on the search term
  const [filteredData, setFilteredData] = useState([]);
  const queryClient = useQueryClient();
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);

  const orderQuery = useQuery({
    queryKey: ["orders"],
    queryFn: async () => await getOrders(),
    enabled: isOpen,
  });
  const columns = [
    { key: "order_id", label: "Order ID" },
    { key: "customer_name", label: "Name" }, // Company Name
    { key: "total_price", label: "Total Amount" },
    { key: "date_issued", label: "Date" },
  ];

  const handleConfirm = () => {
    if (selectedOrder) {
      setOrder(selectedOrder); // Properly update the array
      onClose();
      showAlert({
        type: "success",
        title: "Order Selected",
      });
      setSelectedOrder(null);
    }
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        queryClient.invalidateQueries({ queryKey: ["orders"] });
        onClose();
      }
    };

    // Focus the close button when modal opens
    if (isOpen && closeButtonRef.current) {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
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
    if (orderQuery.status === "success") {
      const data = orderQuery.data;
      const formattedData = data.map((order) => ({
        ...order,
        customer_name: order.statement.customer.name,
        total_price: Number(order.order_total_amount).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
        date_issued: new Date(order.order_date).toLocaleString(),
      }));
      setFilteredData(formattedData);
      setOrderList(formattedData);
    }
  }, [orderQuery.data]);

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
            List Of Orders
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
                const filtered = orderList.filter((item) =>
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
              onSelect={setSelectedOrder}
            />
          </div>
          <div className="mt-4 flex justify-between">
            <div>
              <Button
                type="primary"
                onClick={handleConfirm}
                disabled={!selectedOrder}
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

export default OrderListModal;
