"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { BASE_API_URL, GET } from "../../api/api";
import { useAlert } from "../Context/AlertContext";
import loading from "../Assets/kinetiq-loading.gif";
import Button from "../Button";
import { Table } from "lucide-react";
import html2pdf from "html2pdf.js";

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

const CustomerDetails = ({ data, isInvoice = false }) => {
  return (
    <div className="flex gap-4">
      <div className="flex-1/5">
        <div className="flex flex-col text-sm gap-0.5">
          <span className="text-[#469fc2] font-bold text-md">Bill To</span>
          <span className="text-md font-bold">
            {isInvoice
              ? data.delivery_note.statement.customer.name
              : data.statement.customer.name}
          </span>
          {isInvoice ? (
            <>
              <span>{data.delivery_note.statement.customer.address_line1}</span>
              <span>{data.delivery_note.statement.customer.address_line2}</span>
              <span>{data.delivery_note.statement.customer.country}</span>
              <span>{data.delivery_note.statement.customer.phone_number}</span>
            </>
          ) : (
            <>
              <span>{data.statement.customer.address_line1}</span>
              <span>{data.statement.customer.address_line2}</span>
              <span>{data.statement.customer.country}</span>
              <span>{data.statement.customer.phone_number}</span>
            </>
          )}
        </div>
      </div>
      <div className="flex-1/5">
        <div className="flex flex-col text-sm gap-0.5">
          <span className="text-[#469fc2] font-bold text-md">Ship To</span>
          {isInvoice ? (
            <>
              <span>{data.delivery_note.statement.customer.address_line1}</span>
              <span>{data.delivery_note.statement.customer.address_line2}</span>
              <span>{data.delivery_note.statement.customer.country}</span>
              <span>{data.delivery_note.statement.customer.phone_number}</span>
            </>
          ) : (
            <>
              <span>{data.statement.customer.address_line1}</span>
              <span>{data.statement.customer.address_line2}</span>
              <span>{data.statement.customer.country}</span>
              <span>{data.statement.customer.phone_number}</span>
            </>
          )}
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
    <div className="flex flex-col text-xs gap-1 text-gray-500">
      <span className="text-sm">Terms & Conditions</span>
      <span>
        Full payment is due upon receipt of this invoice. Late payments may
        incur additional charges or interest as per the applicable laws.
      </span>
    </div>
  );
};

const Warranty = ({ data }) => {
  const addOneYear = (date) => {
    date.setFullYear(date.getFullYear() + 1);
    return date;
  };

  return (
    <div className="flex flex-col gap-4">
      <table className="w-full text-sm font-light table-auto border border-black border-collapse">
        <thead className="bg-[#469fc2] border border-black">
          <tr>
            <th className="border border-black text-white font-light text-center p-2">
              Warranty
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-black text-black font-bold text-center p-2">
              <div className="flex flex-col">
                <span>
                  {`
                ${new Date(data.invoice_date).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              - ${addOneYear(new Date(data.invoice_date)).toLocaleDateString(
                "en-GB",
                {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                }
              )}
              `}
                </span>
                <span className="font-normal text-xs">
                  Please retain this invoice as proof of warranty coverage.
                </span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div className="flex flex-col gap-2">
        <span className="font-bold">Warranty Policy</span>
        <span className="text-xs">
          Kinetiq offers a one-year warranty to the original purchaser against
          defects in materials and workmanship. If found defective within this
          period, Kinetiq will repair or replace the part with a new or
          remanufactured one at no cost, subject to the terms and conditions
          herein:
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <span className="font-bold">Terms and Conditions</span>
        <span className="text-xs">
          To receive warranty service, you must provide a proof of purchase and
          warranty certificate (or copies) as proof the product is within the
          warranty period. Without either document, labor and replacement part
          fees will apply.
        </span>
      </div>
      <div className="ml-4 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <span className="font-bold">Parts and Labor</span>
          <span className="text-xs">
            During the warranty period, parts and labor are free of charge.
            Replacements, at Kinetiq’s sole discretion, may be new or
            recertified and are covered for the remainder of the original
            warranty. Kinetiq’s decisions on defect-related complaints are final
            and binding. Replaced parts or units become Kinetiq’s property.
            After the warranty expires, labor and part replacement will incur
            charges.
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <span className="font-bold">Types of Service</span>
          <span className="text-xs">
            To obtain warranty service, defective products must be sent to a
            Kinetiq service center. Customers are responsible for both shipping
            to and from the center. Returns must use the original packaging or
            equivalent protective materials.
          </span>
          <span className="text-xs mt-2">
            For home service, a transportation fee will apply based on location.
            Kinetiq personnel may refuse service if equipment is in inaccessible
            or hazardous locations.
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <span className="font-bold">Limitations and Exclusions</span>
          <span className="text-xs">
            Kinetiq's one-year limited warranty only covers defects in materials
            and workmanship; however, this warranty does not cover the
            following:
          </span>
          <ol className="ml-6 text-xs list-decimal">
            <li>
              Damage from accidents, misuse, abuse, transportation, tampering,
              negligence, or poor maintenance.
            </li>
            <li>
              Issues caused by spills, improper electrical use, voltage
              fluctuations, or exposure to moisture.
            </li>
            <li>Damage from fire, flood, or other Acts of God.</li>
            <li>Normal wear-and-tear, rust, stains, or corrosion.</li>
            <li>
              Problems due to improper testing, use of wrong components, or
              unauthorized modifications.
            </li>
            <li>Scratches or surface damage from regular use.</li>
            <li>Routine maintenance or servicing.</li>
            <li>
              Claims for missing/damaged parts made after 7 days from purchase.
            </li>
            <li>
              If any part/s of the unit are replaced with a part or parts not
              supplied or approved by us or the unit has been dismantled or
              repaired by any person other than a Kinetiq authorized technician.
            </li>
            <li>
              Products with missing, tampered, or illegible serial numbers.
            </li>
          </ol>
        </div>
      </div>
      <div className="flex flex-col gap-2 text-gray-500">
        <span className="text-sm">Legal Disclaimers</span>
        <span className="text-xs">
          This warranty is governed by the laws of the Republic of the
          Philippines and complies with all regulations under Consumer Act of
          the Philippines (RA 7394). The remedies outlined in this policy are
          the sole recourse available under this warranty.
        </span>
      </div>
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

  const downloadPDF = async () => {
    const element = document.getElementById("document-content");

    if (!element) return;

    const opt = {
      margin: 1,
      filename: `${documentToView}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        logging: false,
        useCORS: true,
      },
      jsPDF: {
        unit: "in",
        format: "a4",
        orientation: "portrait",
      },
    };

    try {
      const pdf = await html2pdf().set(opt).from(element).save();
    } catch (error) {
      showAlert({
        type: "error",
        title: "Error generating PDF",
      });
    }
  };

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
    } else {
      setIsLoading(true);
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
        className="bg-white pb-10 overflow-y-auto rounded-lg shadow-lg max-w-2xl w-2xl max-h-[90%] h-[90%] relative animate-in fade-in zoom-in duration-200"
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

        {isLoading ? (
          <div className="h-full rounded-md flex justify-center items-center">
            <img src={loading} alt="loading" className="h-[100px]" />
          </div>
        ) : (
          <div className="px-10 mt-6">
            {data &&
              data.statement &&
              documentToView &&
              documentToView.includes("quotation") && (
                <div
                  id="document-content"
                  className="flex flex-col gap-4 text-sm"
                >
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
                        <tr>
                          <td className="flex justify-between gap-10">
                            <span>Total Discount</span>
                            <span>
                              {Number(data.statement.discount).toLocaleString(
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
                              {Number(
                                data.statement.total_amount
                              ).toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
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
                <div
                  id="document-content"
                  className="flex flex-col gap-4 text-sm"
                >
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
                          {new Date(data.order_date).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                            }
                          )}
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
                            <span>Total Discount</span>
                            <span>
                              {Number(data.statement.discount).toLocaleString(
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
                              {Number(
                                data.statement.total_amount
                              ).toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
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
                <div
                  id="document-content"
                  className="flex flex-col gap-4 text-sm"
                >
                  <Header />
                  <div className="text-center">
                    <span className="font-light">DELIVERY NOTE</span>
                  </div>
                  <CustomerDetails data={data} />
                  <div className="w-full">
                    <table className=" text-sm font-light table-fixed border border-black border-collapse w-full">
                      <thead className="bg-[#469fc2] border border-black">
                        <tr>
                          <th className="whitespace-normal break-words border border-black text-white font-light text-start p-2">
                            Salesperson
                          </th>
                          <th className="whitespace-normal break-words border border-black text-white font-light text-start  p-2 text-sm">
                            Order Fulfillment
                          </th>
                          <th className="whitespace-normal break-words border border-black text-white font-light text-start  p-2 text-sm">
                            Tracking No.
                          </th>
                          <th className="whitespace-normal break-words border border-black text-white font-light text-start  p-2 text-sm">
                            Shipping Method
                          </th>
                          <th className="whitespace-normal break-wordsborder border-black text-white font-light text-start  p-2 text-sm">
                            Payment Terms
                          </th>
                          <th className="whitespace-normal break-wordsborder border-black text-white font-light text-start  p-2 text-sm">
                            Shipping Date
                          </th>
                          <th className="whitespace-normal break-words border border-black text-white font-light text-start  p-2 text-sm">
                            Delivery Date
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="whitespace-normal break-words border border-black text-black font-light text-start p-2">
                            {`${data.statement.salesrep.first_name} ${data.statement.salesrep.last_name}`}
                          </td>
                          <td className="whitespace-normal break-words border border-black text-black font-light text-start  p-2 text-sm">
                            {data.order_fulfillment}
                          </td>
                          <td className="whitespace-normal break-words border border-black text-black font-light text-start  p-2 text-sm">
                            {data.tracking_num || "-"}
                          </td>
                          <td className="whitespace-normal break-words border border-black text-black font-light text-start  p-2 text-sm">
                            {data.shipping_method}
                          </td>
                          <td className="whitespace-normal break-words border border-black text-black font-light text-start  p-2 text-sm">
                            30% Downpayment, 70% After Delivery
                          </td>
                          <td className="whitespace-normal break-words border border-black text-black font-light text-start  p-2 text-sm">
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
                          </td>
                          <td className="whitespace-normal break-words border border-black text-black font-light text-start  p-2 text-sm">
                            {!data.actual_delivery_date
                              ? "-"
                              : new Date(
                                  data.actual_delivery_date
                                ).toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "long",
                                  year: "numeric",
                                })}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div>
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
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex justify-between text-xs">
                    <div>Thank you for your business.</div>
                  </div>
                </div>
              )}
            {data &&
              data.delivery_note &&
              documentToView &&
              documentToView.includes("invoice") && (
                <div
                  id="document-content"
                  className="flex flex-col gap-4 text-sm"
                >
                  <Header />
                  <div className="text-center">
                    <span className="font-light">SALES INVOICE</span>
                  </div>
                  <CustomerDetails data={data} isInvoice={true} />
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
                            Order Fulfillment
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
                          {data.order_fulfillment}
                        </th>
                        <th className="border border-black text-black font-light text-start  p-2 text-sm">
                          {data.payment_status}
                        </th>
                      </tr>
                    </table>
                  </div>
                  <div>
                    <OrdersTable data={data.delivery_note} />
                  </div>
                  <div className="flex justify-between text-xs">
                    <div>Thank you for your business.</div>
                    <table>
                      <tbody>
                        <tr>
                          <td className="flex justify-between gap-10">
                            <span>Subtotal</span>
                            <span>
                              {Number(
                                data.delivery_note.statement.subtotal
                              ).toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="flex justify-between gap-10">
                            <span>Sales Tax</span>
                            <span>
                              {Number(
                                data.delivery_note.statement.total_tax
                              ).toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="flex justify-between gap-10">
                            <span>Shipping Fee</span>
                            <span>
                              {Number(
                                data.delivery_note.shipping_fee
                              ).toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <tr>
                            <td className="flex justify-between gap-10">
                              <span>Total Discount</span>
                              <span>
                                {Number(
                                  data.delivery_note.statement.discount
                                ).toLocaleString("en-US", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </span>
                            </td>
                          </tr>
                          <td className="flex justify-between font-bold p-1">
                            <span className="font-bold">Total</span>
                            <span className="font-bold">
                              {Number(
                                data.delivery_note.statement.total_amount
                              ).toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </span>
                          </td>
                        </tr>
                        <tr className="bg-[#eff8f9]">
                          <td className="flex justify-between font-bold p-1">
                            <span className="text-[#469fc2]">Balance Due</span>
                            <span className="text-[#469fc2]">
                              {Number(data.remaining_balance).toLocaleString(
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
                  <hr />
                  <Warranty data={data} />
                </div>
              )}
            {data &&
              data.statement &&
              documentToView &&
              documentToView.includes("agreement") && (
                <div
                  id="document-content"
                  className="flex flex-col gap-4 text-sm"
                >
                  <div className="text-center">
                    <span className="font-light text-lg">
                      BLANKET AGREEMENT
                    </span>
                  </div>
                  <div>
                    This Agreement is made on{" "}
                    {new Date(data.signed_date).toLocaleDateString("en-US", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}{" "}
                    between:
                  </div>

                  <div className="flex justify-between">
                    <div className="flex flex-col">
                      <span className="font-bold">Customer:</span>
                      <span>{data.statement.customer.name}</span>
                      <span>{`${data.statement.customer.address_line1} ${data.statement.customer.address_line2}`}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold">Seller:</span>
                      <span>Kinetiq Company</span>
                      <span>
                        1975 Street Address of Company, NCR, Philippines
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 mt-2">
                    <span className="font-bold text-[#469fc2]">1. PURPOSE</span>
                    <span>
                      This Agreement sets forth the terms under which the Buyer
                      may procure goods/services from the Supplier as needed.
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="font-bold text-[#469fc2]">2. TERM</span>
                    <span>
                      This Agreement shall be effective from{" "}
                      <b>
                        {new Date(data.start_date).toLocaleDateString("en-US", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </b>{" "}
                      to{" "}
                      <b>
                        {new Date(data.end_date).toLocaleDateString("en-US", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </b>
                      .
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="font-bold text-[#469fc2]">3. PRICING</span>
                    <span>
                      The goods/services shall be provided at the following
                      rates:
                    </span>
                    <OrdersTable data={data} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="font-bold text-[#469fc2]">
                      4. ORDERING
                    </span>
                    <span>
                      Orders shall be placed by the Buyer via{" "}
                      <b>{data.agreement_method}</b> method, referencing this
                      Agreement Number: <b>{data.agreement_id}</b>.
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="font-bold text-[#469fc2]">
                      5. DELIVERY
                    </span>
                    <span>
                      All deliveries must be made to:{" "}
                      <b>
                        {data.statement.customer.address_line1}{" "}
                        {data.statement.customer.address_line2}
                      </b>
                      .
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="font-bold text-[#469fc2]">
                      6. TERMINATION
                    </span>
                    <span>
                      This Agreement is not subject to termination by either
                      party for convenience.
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="font-bold text-[#469fc2]">
                      7. CONFIDENTIALITY
                    </span>
                    <span>
                      Both parties agree to maintain confidentiality of shared
                      information.
                    </span>
                  </div>
                  <div className="mt-2">
                    <span>
                      <i>
                        IN WITNESS WHEREOF, the parties have executed this
                        Agreement as of the date first above written.
                      </i>
                    </span>
                  </div>
                  <div className="flex justify-between gap-12">
                    <div className="flex flex-col flex-1/2">
                      <span className="font-bold text-[#469fc2]">
                        Customer Representative
                      </span>
                      <div className="flex justify-between">
                        <span className="font-bold">Signature: </span>
                        <span className="text-end">______________</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-bold">Name: </span>
                        <span className="text-end">
                          <u>{data.statement.customer.contact_person}</u>
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-bold">Date Signed: </span>
                        <span className="text-end">
                          <u>
                            {new Date(data.signed_date).toLocaleDateString(
                              "en-US",
                              {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                              }
                            )}
                          </u>
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col flex-1/2">
                      <span className="font-bold text-[#469fc2]">
                        Seller Representative
                      </span>
                      <div className="flex justify-between">
                        <span className="font-bold">Signature: </span>
                        <span className="text-end">______________</span>
                      </div>
                      <div className="flex  justify-between">
                        <span className="font-bold ">Name: </span>
                        <span className="text-end">
                          <u>{`${data.statement.salesrep.first_name} ${data.statement.salesrep.last_name}`}</u>
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-bold">Date Signed: </span>
                        <span className="text-end ">
                          <u>
                            {new Date(data.signed_date).toLocaleDateString(
                              "en-US",
                              {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                              }
                            )}
                          </u>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            <div className="mt-10 justify-center items-center text-center">
              <button
                className="py-1 px-6 font-medium transition-all duration-300 ease-in-out transform bg-[#00A8A8] text-white hover:bg-[#008080] rounded-md hover:shadow-lg"
                onClick={downloadPDF}
              >
                Download
              </button>
              {/* <a
                className="py-1 px-6 font-medium transition-all duration-300 ease-in-out transform bg-[#00A8A8] text-white hover:bg-[#008080] rounded-md hover:shadow-lg"
                href={`${BASE_API_URL}sales/${documentToView}/document`}
              > */}
              {/* </a> */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewDocumentModal;
