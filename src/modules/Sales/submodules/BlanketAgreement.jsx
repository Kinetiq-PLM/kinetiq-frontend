import React, { use } from "react";
import { useEffect, useState } from "react";

import "../styles/Index.css";
import {
  AlertProvider,
  useAlert,
} from "../components/Context/AlertContext.jsx";

import ProductListModal from "../components/Modals/Lists/ProductList.jsx";
import QuotationListModal from "../components/Modals/Lists/QuotationList.jsx";
import BlanketAgreementListModal from "./../components/Modals/Lists/BlanketAgreementList";
import OrderListModal from "../components/Modals/Lists/OrderList.jsx";
import InvoiceListModal from "../components/Modals/Lists/InvoiceList.jsx";
import DeliveryListModal from "../components/Modals/Lists/DeliveryList.jsx";

import Button from "../components/Button";

const BlanketAgreement = ({ loadSubModule, setActiveSubModule }) => {
  const [isProductListOpen, setIsProductListOpen] = useState(false);
  const [products, setProducts] = useState([]);

  const [isQuotationListOpen, setIsQuotationListOpen] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState(null);

  const [isBlanketAgreementListOpen, setIsBlanketAgreementListOpen] =
    useState(false);
  const [selectedBlanketAgreement, setSelectedBlanketAgreement] =
    useState(null);

  const [isOrderListOpen, setIsOrderListOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [isInvoiceListOpen, setIsInvoiceListOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const [isDeliveryListOpen, setIsDeliveryListOpen] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);

  useEffect(() => {
    console.log(selectedBlanketAgreement);
  }, [selectedBlanketAgreement]);

  return (
    <div className="blanket-agreement">
      <div className="body-content-container">
        <ProductListModal
          isOpen={isProductListOpen}
          onClose={() => setIsProductListOpen(false)}
          addProduct={setProducts}
          products={products}
        ></ProductListModal>

        <QuotationListModal
          isOpen={isQuotationListOpen}
          onClose={() => setIsQuotationListOpen(false)}
          setQuotation={setSelectedQuotation}
        ></QuotationListModal>

        <BlanketAgreementListModal
          isOpen={isBlanketAgreementListOpen}
          onClose={() => setIsBlanketAgreementListOpen(false)}
          setBlanketAgreement={setSelectedBlanketAgreement}
        ></BlanketAgreementListModal>

        <OrderListModal
          isOpen={isOrderListOpen}
          onClose={() => setIsOrderListOpen(false)}
          setOrder={setSelectedOrder}
        ></OrderListModal>

        <InvoiceListModal
          isOpen={isInvoiceListOpen}
          onClose={() => setIsInvoiceListOpen(false)}
          setInvoice={setSelectedInvoice}
        ></InvoiceListModal>

        <DeliveryListModal
          isOpen={isDeliveryListOpen}
          onClose={() => setIsDeliveryListOpen(false)}
          setDelivery={setSelectedDelivery}
        ></DeliveryListModal>

        <div className="space-y-2 space-x-2">
          <Button type="primary" onClick={() => setIsProductListOpen(true)}>
            Product List
          </Button>
          <Button type="primary" onClick={() => setIsQuotationListOpen(true)}>
            Quotation List
          </Button>
          <Button
            type="primary"
            onClick={() => setIsBlanketAgreementListOpen(true)}
          >
            BA List
          </Button>
          <Button type="primary" onClick={() => setIsOrderListOpen(true)}>
            Order List
          </Button>
          <Button type="primary" onClick={() => setIsInvoiceListOpen(true)}>
            Invoice List
          </Button>
          <Button type="primary" onClick={() => setIsDeliveryListOpen(true)}>
            Delivery List
          </Button>
        </div>
      </div>
    </div>
  );
};

const BodyContent = ({ loadSubModule, setActiveSubModule }) => {
  return (
    <AlertProvider>
      <BlanketAgreement
        loadSubModule={loadSubModule}
        setActiveSubModule={setActiveSubModule}
      />
    </AlertProvider>
  );
};

export default BodyContent;
