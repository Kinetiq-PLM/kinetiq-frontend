"use client";

import { useState, useEffect, useRef } from "react";

import { useAlert } from "../../Context/AlertContext.jsx";

import Table from "../../Table";
import { PRODUCTS_DATA } from "../../../temp_data/products_data";
import Button from "../../Button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { GET } from "../../../api/api";

const DeliveredProductList = ({
  isOpen,
  onClose,
  products,
  addProduct,
  setInitialProducts,
  delivery,
}) => {
  const { showAlert } = useAlert();

  const [selectedProduct, setSelectedProduct] = useState(null);

  // Filtered data is used to filter the data based on the search term
  // const [filteredData, setFilteredData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  // const [productList, setProductList] = useState([]); // ORIGINAL
  const [productList, setProductList] = useState([]); // TEMP

  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  const columns = [
    { key: "product_id", label: "Product ID" },
    { key: "product_name", label: "Name" }, // Company Name
    { key: "quantity", label: "Quantity" }, // Country
  ];

  const handleConfirm = () => {
    if (selectedProduct) {
      addProduct([...products, selectedProduct]); // Properly update the array
      setInitialProducts((prev) => [...prev, selectedProduct]);
      onClose();
      showAlert({
        type: "success",
        title: "Added product.",
      });
      setSelectedProduct(null);
    }
  };

  useEffect(() => {
    if (delivery.statement) {
      const res = delivery.statement.items.map((item) => ({
        product_id: item.product?.product_id,
        product_name: item.product?.product_name,
        quantity: Number(item.quantity),
        selling_price: Number(item.unit_price),
        discount: Number(item.discount),
        tax: Number(item.tax_amount),
        total_price: Number(item.total_price),
        reason: "",
      }));
      setProductList(res);
    }
  }, [delivery]);
  useEffect(() => {
    const filtered = productList.filter(
      (product) => !products.some((p) => p.product_id === product.product_id)
    );
    setFilteredData(filtered);
  }, [products]);

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
            List of Items
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
                if (searchTerm.trim().length > 0) {
                  const filtered = filteredData.filter((product) =>
                    product.product_name.toLowerCase().includes(searchTerm)
                  );
                  setFilteredData(filtered);
                } else {
                  const filtered = productList.filter(
                    (product) =>
                      !products.some((p) => p.product_id === product.product_id)
                  );
                  setFilteredData(filtered);
                }
              }}
            />
          </div>
          <div className="h-[300px] overflow-auto border border-[#CBCBCB] rounded-md">
            <Table
              columns={columns}
              data={filteredData}
              onSelect={setSelectedProduct}
            />
          </div>
          <div className="mt-4 flex justify-between">
            <div>
              <Button
                type="primary"
                onClick={handleConfirm}
                disabled={!selectedProduct}
              >
                Add
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

export default DeliveredProductList;
