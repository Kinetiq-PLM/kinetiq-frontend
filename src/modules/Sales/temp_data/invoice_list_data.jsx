const INVOICE_LIST_DATA = [
  {
    invoice_id: "I-1A2B3C",
    order_id: "O-3F5A1C",
    customer_id: 1000,
    customer_name: "Tech Solutions Inc.",
    date_issued: "2025-03-21",
    due_date: "2025-04-05",
    currency: "USD",
    total_before_discount: 18360,
    discount: 0,
    total_tax: 1542.48,
    shipping_fee: 300,
    warranty_fee: 1363.2,
    total_price: 17442,
    invoice_status: "Paid",
    payment_status: "Completed",
    notes: "Payment received in full.",
    selected_products: [
      {
        product_id: "P003",
        product_name: "Office Chair",
        description: "Ergonomic office chair with lumbar support",
        quantity: 2,
        unit_price: 150,
        unit_of_measure: "Piece",
        markup_price: 165,
        tax: 15,
        discount: 10,
        warranty_period: 12,
      },
      {
        product_id: "P006",
        product_name: "External Hard Drive",
        description: "1TB external SSD with USB-C connectivity",
        quantity: 1,
        unit_price: 100,
        unit_of_measure: "Piece",
        markup_price: 110,
        tax: 10,
        discount: 5,
        warranty_period: 12,
      },
      {
        product_id: "P001",
        product_name: "Laptop",
        description: "High-performance laptop with Intel i7 processor",
        quantity: 1,
        unit_price: 1436,
        unit_of_measure: "Piece",
        markup_price: 1579.6,
        tax: 143.6,
        discount: 50,
        warranty_period: 24,
      },
    ],
  },
  {
    invoice_id: "I-4D5E6F",
    order_id: "O-9D3E7F",
    customer_id: 1001,
    customer_name: "Global Enterprises Ltd.",
    date_issued: "2025-03-22",
    due_date: "2025-04-06",
    currency: "USD",
    total_before_discount: 13100,
    discount: 10,
    total_tax: 1095.6,
    shipping_fee: 500,
    warranty_fee: 785.0,
    total_price: 11895,
    invoice_status: "Pending",
    payment_status: "Awaiting Payment",
    notes: "Payment due within 14 days.",
    selected_products: [
      {
        product_id: "P002",
        product_name: "Standing Desk",
        description: "Adjustable height standing desk",
        quantity: 20,
        unit_price: 380,
        unit_of_measure: "Piece",
        markup_price: 418,
        tax: 38,
        discount: 10,
        warranty_period: 12,
      },
      {
        product_id: "P004",
        product_name: "Wireless Mouse",
        description: "Ergonomic wireless mouse",
        quantity: 100,
        unit_price: 45,
        unit_of_measure: "Piece",
        markup_price: 50,
        tax: 4.5,
        discount: 10,
        warranty_period: 12,
      },
    ],
  },
  {
    invoice_id: "I-7G8H9I",
    order_id: "O-5A1B2C",
    customer_id: 1002,
    customer_name: "NextGen Tech Corp.",
    date_issued: "2025-03-23",
    due_date: "2025-04-07",
    currency: "USD",
    total_before_discount: 19550,
    discount: 5,
    total_tax: 1725.8,
    shipping_fee: 700,
    warranty_fee: 1290.0,
    total_price: 18195.5,
    invoice_status: "Paid",
    payment_status: "Completed",
    notes: "Shipped via express delivery.",
    selected_products: [
      {
        product_id: "P005",
        product_name: "Monitor",
        description: "27-inch 4K UHD monitor",
        quantity: 1,
        unit_price: 500,
        unit_of_measure: "Piece",
        markup_price: 550,
        tax: 50,
        discount: 20,
        warranty_period: 24,
      },
      {
        product_id: "P007",
        product_name: "Mechanical Keyboard",
        description: "RGB backlit mechanical keyboard",
        quantity: 1,
        unit_price: 120,
        unit_of_measure: "Piece",
        markup_price: 132,
        tax: 12,
        discount: 5,
        warranty_period: 12,
      },
    ],
  },
  {
    invoice_id: "I-9J1K2L",
    order_id: "O-8E6D4B",
    customer_id: 1003,
    customer_name: "Innovatech Industries",
    date_issued: "2025-03-24",
    due_date: "2025-04-08",
    currency: "USD",
    total_before_discount: 23750,
    discount: 15,
    total_tax: 2025.0,
    shipping_fee: 250,
    warranty_fee: 1575.0,
    total_price: 21000,
    invoice_status: "Pending",
    payment_status: "Awaiting Payment",
    notes: "Customer requested an extension for payment.",
    selected_products: [
      {
        product_id: "P008",
        product_name: "Smartphone",
        description: "Flagship smartphone with 256GB storage",
        quantity: 1,
        unit_price: 999,
        unit_of_measure: "Piece",
        markup_price: 1099,
        tax: 99.9,
        discount: 30,
        warranty_period: 24,
      },
    ],
  },
];

export default INVOICE_LIST_DATA;
