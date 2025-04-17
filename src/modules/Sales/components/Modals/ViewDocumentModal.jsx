"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { BASE_API_URL, GET } from "../../api/api";
import { useAlert } from "../Context/AlertContext";
import loading from "../Assets/kinetiq-loading.gif";
import Button from "../Button";
import { Table } from "lucide-react";

const Header = () => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <img
          src="/icons/logo.png"
          alt="Kinetiq Logo"
          className="kinetiq-logo"
        />
      </div>
      <div className="flex flex-col items-end">
        <span className="font-bold text-xl">Kinetiq</span>
        <span>1975 Address of Company</span>
        <span>Street, Metro Manila</span>
        <span>Philippines</span>
      </div>
    </div>
  );
};

const CustomerDetails = ({ data }) => {
  return (
    <div className="flex gap-4">
      <div className="flex-1/5">
        <div className="flex flex-col text-sm gap-0.5">
          <span className="text-[#469fc2] font-bold text-md">Bill To</span>
          <span className="text-md font-bold">
            {data.statement.customer.name}
          </span>
          <span>{data.statement.customer.address_line1}</span>
          <span>{data.statement.customer.address_line2}</span>
          <span>{data.statement.customer.country}</span>
          <span>{data.statement.customer.phone_number}</span>
        </div>
      </div>
      <div className="flex-1/5">
        <div className="flex flex-col text-sm gap-0.5">
          <span className="text-[#469fc2] font-bold text-md">Ship To</span>
          <span>{data.statement.customer.address_line1}</span>
          <span>{data.statement.customer.address_line2}</span>
          <span>{data.statement.customer.country}</span>
          <span>{data.statement.customer.phone_number}</span>
        </div>
      </div>
      <div className="flex-1/5">
        <div className="items-end flex flex-col">
          {data.quotation_id && data.date_issued && (
            <>
              <span className="text-[#469fc2]">Quotation#</span>
              <span className="font-bold">{data.quotation_id}</span>
            </>
          )}
          {data.order_id && data.order_type && (
            <>
              <span className="text-[#469fc2]">Order#</span>
              <span className="font-bold">{data.order_id}</span>
            </>
          )}
          {data.delivery_note_id && data.preferred_delivery_date && (
            <>
              <span className="text-[#469fc2]">Delivery#</span>
              <span className="font-bold">{data.delivery_note_id}</span>
            </>
          )}
          {data.invoice_id && data.remaining_balance && (
            <>
              <span className="text-[#469fc2]">Invoice#</span>
              <span className="font-bold">{data.invoice_id}</span>
            </>
          )}
          {data.agreement_id && data.agreement_method && (
            <>
              <span className="text-[#469fc2]">Agreement#</span>
              <span className="font-bold">{data.agreement_id}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const OrdersTable = ({ data }) => {
  return (
    <table className="w-full text-sm font-light table-auto border border-black border-collapse">
      <thead className="bg-[#469fc2] border border-black">
        <tr>
          <th className="border border-black text-white font-light text-start p-2">
            Order No.
          </th>
          <th className="border border-black text-white font-light text-start  p-2 text-sm">
            Item & Description
          </th>
          <th className="border border-black text-white font-light text-start  p-2 text-sm">
            Qty
          </th>
          <th className="border border-black text-white font-light text-start  p-2 text-sm">
            Discount
          </th>
          <th className="border border-black text-white font-light text-start  p-2 text-sm">
            Unit Price
          </th>
          <th className="border border-black text-white font-light text-start  p-2 text-sm">
            Total
          </th>
        </tr>
      </thead>
      <tbody>
        {data.statement.items.map((item) => {
          return (
            <tr>
              <td className="border border-black text-black font-light text-start  p-2 text-xs">
                {item.product.product_id}
              </td>
              <td className="border border-black text-black font-light text-start  p-2 text-xs">
                <div className="flex flex-col">
                  <span>{item.product.product_name}</span>
                  <span className="text-gray-500">
                    {item.product.description}
                  </span>
                </div>
              </td>
              <td className="border border-black text-black font-light text-start  p-2 text-xs">
                {item.quantity}
              </td>
              <td className="border border-black text-black font-light text-start  p-2 text-xs">
                {Number(item.discount).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </td>
              <td className="border border-black text-black font-light text-start  p-2 text-xs">
                {Number(item.unit_price).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </td>
              <td className="border border-black text-black font-light text-start  p-2 text-xs">
                {Number(item.total_price - item.discount).toLocaleString(
                  "en-US",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

const Terms = () => {
  return (
    <div className="flex flex-col text-xs gap-1">
      <span className="text-sm">Terms & Conditions</span>
      <span>
        Full payment is due upon receipt of this invoice. Late payments may
        incur additional charges or interest as per the applicable laws.
      </span>
    </div>
  );
};
const ViewDocumentModal = ({ isOpen, onClose, documentToView = null }) => {
  const { showAlert } = useAlert();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({});
  const documentQuery = useQuery({
    queryKey: ["document"],
    queryFn: async () => await GET(`sales/${documentToView}`),
    enabled: isOpen,
    retry: 2,
  });

  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        setData({});
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
    if (documentQuery.status === "success") {
      setData(documentQuery.data);
      setIsLoading(false);
    } else if (documentQuery.status === "error") {
      showAlert({
        type: "error",
        title:
          "An error occurred while fetching data." +
          documentQuery.error.message,
      });
    }
  }, [documentQuery.data, documentQuery.status]);

  if (!isOpen || documentToView === null || !data) {
    return;
  }
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
        className="bg-white pb-6 overflow-y-auto rounded-lg shadow-lg max-w-2xl w-2xl max-h-[90%] h-[90%] relative animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        {/* HEADER */}
        <div className="w-full bg-[#EFF8F9] py-[20px] px-[30px] border-b border-[#cbcbcb]">
          <h2 id="modal-title" className="text-xl font-semibold">
            View Document
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
        <div className="px-10 mt-4 h-full">
          {data &&
            data.statement &&
            documentToView &&
            documentToView.includes("quotation") && (
              <div className="flex flex-col gap-4 text-sm">
                <Header />
                <div className="text-center">
                  <span className="font-light">QUOTATION</span>
                </div>
                <CustomerDetails data={data} />
                <div>
                  <table className="w-full text-sm font-light table-auto border border-black border-collapse">
                    <thead className="bg-[#469fc2] border border-black">
                      <tr>
                        <th className="border border-black text-white font-light text-start p-2">
                          Salesperson
                        </th>
                        <th className="border border-black text-white font-light text-start  p-2 text-sm">
                          Date Issued
                        </th>
                        <th className="border border-black text-white font-light text-start  p-2 text-sm">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tr>
                      <th className="border border-black text-black font-light text-start p-2">
                        {`${data.statement.salesrep.first_name} ${data.statement.salesrep.last_name}`}
                      </th>
                      <th className="border border-black text-black font-light text-start  p-2 text-sm">
                        {new Date(data.date_issued).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </th>
                      <th className="border border-black text-black font-light text-start  p-2 text-sm">
                        {data.status}
                      </th>
                    </tr>
                  </table>
                </div>
                <div>
                  <OrdersTable data={data} />
                </div>
                <div className="flex justify-between text-xs">
                  <div>Thank you for your business.</div>
                  <table>
                    <tbody>
                      <tr>
                        <td className="flex justify-between gap-10">
                          <span>Subtotal</span>
                          <span>
                            {Number(data.statement.subtotal).toLocaleString(
                              "en-US",
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }
                            )}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="flex justify-between gap-10">
                          <span>Sales Tax</span>
                          <span>
                            {Number(data.statement.total_tax).toLocaleString(
                              "en-US",
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }
                            )}
                          </span>
                        </td>
                      </tr>
                      <tr className="bg-[#eff8f9]">
                        <td className="flex justify-between font-bold p-1">
                          <span className="font-bold text-[#469fc2]">
                            Total
                          </span>
                          <span className="fold-bold text-[#469fc2]">
                            {Number(data.statement.total_amount).toLocaleString(
                              "en-US",
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }
                            )}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <Terms />
              </div>
            )}
          {data &&
            data.statement &&
            documentToView &&
            documentToView.includes("order") && (
              <div className="flex flex-col gap-4 text-sm">
                <Header />
                <div className="text-center">
                  <span className="font-light">SALES ORDER</span>
                </div>
                <CustomerDetails data={data} />
                <div>
                  <table className="w-full text-sm font-light table-auto border border-black border-collapse">
                    <thead className="bg-[#469fc2] border border-black">
                      <tr>
                        <th className="border border-black text-white font-light text-start p-2">
                          Salesperson
                        </th>
                        <th className="border border-black text-white font-light text-start  p-2 text-sm">
                          Type
                        </th>
                        <th className="border border-black text-white font-light text-start  p-2 text-sm">
                          Status
                        </th>
                        <th className="border border-black text-white font-light text-start  p-2 text-sm">
                          Order Date
                        </th>
                      </tr>
                    </thead>
                    <tr>
                      <th className="border border-black text-black font-light text-start p-2">
                        {`${data.statement.salesrep.first_name} ${data.statement.salesrep.last_name}`}
                      </th>
                      <th className="border border-black text-black font-light text-start  p-2 text-sm">
                        {data.order_type}
                      </th>
                      <th className="border border-black text-black font-light text-start  p-2 text-sm">
                        {data.completion_status}
                      </th>
                      <th className="border border-black text-black font-light text-start  p-2 text-sm">
                        {new Date(data.order_date).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </th>
                    </tr>
                  </table>
                </div>
                <div>
                  <OrdersTable data={data} />
                </div>
                <div className="flex justify-between text-xs">
                  <div>Thank you for your business.</div>
                  <table>
                    <tbody>
                      <tr>
                        <td className="flex justify-between gap-10">
                          <span>Subtotal</span>
                          <span>
                            {Number(data.statement.subtotal).toLocaleString(
                              "en-US",
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }
                            )}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="flex justify-between gap-10">
                          <span>Sales Tax</span>
                          <span>
                            {Number(data.statement.total_tax).toLocaleString(
                              "en-US",
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }
                            )}
                          </span>
                        </td>
                      </tr>
                      <tr className="bg-[#eff8f9]">
                        <td className="flex justify-between font-bold p-1">
                          <span className="font-bold text-[#469fc2]">
                            Total
                          </span>
                          <span className="fold-bold text-[#469fc2]">
                            {Number(data.statement.total_amount).toLocaleString(
                              "en-US",
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }
                            )}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <Terms />
              </div>
            )}
          {data &&
            data.statement &&
            documentToView &&
            documentToView.includes("delivery") && (
              <div className="flex flex-col gap-4 text-sm">
                <Header />
                <div className="text-center">
                  <span className="font-light">DELIVERY NOTE</span>
                </div>
                <CustomerDetails data={data} />
                <div>
                  <table className="w-full text-sm font-light table-auto border border-black border-collapse">
                    <thead className="bg-[#469fc2] border border-black">
                      <tr>
                        <th className="border border-black text-white font-light text-start p-2">
                          Salesperson
                        </th>
                        <th className="border border-black text-white font-light text-start  p-2 text-sm">
                          Tracking No.
                        </th>
                        <th className="border border-black text-white font-light text-start  p-2 text-sm">
                          Shipping Method
                        </th>
                        <th className="border border-black text-white font-light text-start  p-2 text-sm">
                          Payment Terms
                        </th>
                        <th className="border border-black text-white font-light text-start  p-2 text-sm">
                          Shipping Date
                        </th>
                        <th className="border border-black text-white font-light text-start  p-2 text-sm">
                          Delivery Date
                        </th>
                      </tr>
                    </thead>
                    <tr>
                      <th className="border border-black text-black font-light text-start p-2">
                        {`${data.statement.salesrep.first_name} ${data.statement.salesrep.last_name}`}
                      </th>
                      <th className="border border-black text-black font-light text-start  p-2 text-sm">
                        {data.tracking_num || "-"}
                      </th>
                      <th className="border border-black text-black font-light text-start  p-2 text-sm">
                        30% Downpayment, 70% After Delivery
                      </th>
                      <th className="border border-black text-black font-light text-start  p-2 text-sm">
                        {data.shipping_method}
                      </th>
                      <th className="border border-black text-black font-light text-start  p-2 text-sm">
                        {!data.shipping_date
                          ? "-"
                          : new Date(data.shipping_date).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                              }
                            )}
                      </th>
                      <th className="border border-black text-black font-light text-start  p-2 text-sm">
                        {!data.actual_delivery_date
                          ? "-"
                          : new Date(
                              data.actual_delivery_date
                            ).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                            })}
                      </th>
                    </tr>
                  </table>
                </div>
                <div>
                  <OrdersTable data={data} />
                </div>
                <div className="flex justify-between text-xs">
                  <div>Thank you for your business.</div>
                  <table>
                    <tbody>
                      <tr>
                        <td className="flex justify-between gap-10">
                          <span>Subtotal</span>
                          <span>
                            {Number(data.statement.subtotal).toLocaleString(
                              "en-US",
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }
                            )}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="flex justify-between gap-10">
                          <span>Sales Tax</span>
                          <span>
                            {Number(data.statement.total_tax).toLocaleString(
                              "en-US",
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }
                            )}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="flex justify-between gap-10">
                          <span>Shipping Fee</span>
                          <span>
                            {Number(data.statement.total_tax).toLocaleString(
                              "en-US",
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }
                            )}
                          </span>
                        </td>
                      </tr>
                      <tr className="bg-[#eff8f9]">
                        <td className="flex justify-between font-bold p-1">
                          <span className="font-bold text-[#469fc2]">
                            Total
                          </span>
                          <span className="fold-bold text-[#469fc2]">
                            {Number(data.statement.total_amount).toLocaleString(
                              "en-US",
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }
                            )}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <Terms />
              </div>
            )}
          {data &&
            data.statement &&
            documentToView &&
            documentToView.includes("invoice") && (
              <div className="flex flex-col gap-4 text-sm">
                <Header />
                <div className="text-center">
                  <span className="font-light">SALES INVOICE</span>
                </div>
                <CustomerDetails data={data} />
                <div>
                  <table className="w-full text-sm font-light table-auto border border-black border-collapse">
                    <thead className="bg-[#469fc2] border border-black">
                      <tr>
                        <th className="border border-black text-white font-light text-start p-2">
                          Invoice Date
                        </th>

                        <th className="border border-black text-white font-light text-start  p-2 text-sm">
                          Payment Terms
                        </th>

                        <th className="border border-black text-white font-light text-start  p-2 text-sm">
                          Payment Status
                        </th>
                      </tr>
                    </thead>
                    <tr>
                      <th className="border border-black text-black font-light text-start  p-2 text-sm">
                        {new Date(data.invoice_date).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </th>
                      <th className="border border-black text-black font-light text-start  p-2 text-sm">
                        30% Downpayment, 70% After Delivery
                      </th>
                      <th className="border border-black text-black font-light text-start  p-2 text-sm">
                        {data.payment_status}
                      </th>
                    </tr>
                  </table>
                </div>
                <div>
                  <OrdersTable data={data} />
                </div>
                <div className="flex justify-between text-xs">
                  <div>Thank you for your business.</div>
                  <table>
                    <tbody>
                      <tr>
                        <td className="flex justify-between gap-10">
                          <span>Subtotal</span>
                          <span>
                            {Number(data.statement.subtotal).toLocaleString(
                              "en-US",
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }
                            )}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="flex justify-between gap-10">
                          <span>Sales Tax</span>
                          <span>
                            {Number(data.statement.total_tax).toLocaleString(
                              "en-US",
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }
                            )}
                          </span>
                        </td>
                      </tr>
                      <tr className="bg-[#eff8f9]">
                        <td className="flex justify-between font-bold p-1">
                          <span className="font-bold text-[#469fc2]">
                            Total
                          </span>
                          <span className="fold-bold text-[#469fc2]">
                            {Number(data.statement.total_amount).toLocaleString(
                              "en-US",
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }
                            )}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <Terms />
              </div>
            )}
          {documentToView && documentToView.includes("agreement") && (
            <div>Agreement</div>
          )}

          <div className="mt-6 items-end">
            <a
              className="py-1 px-6 font-medium transition-all duration-300 ease-in-out transform bg-[#00A8A8] text-white hover:bg-[#008080] rounded-md hover:shadow-lg"
              href={`${BASE_API_URL}sales/${documentToView}/document`}
            >
              Download
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewDocumentModal;
