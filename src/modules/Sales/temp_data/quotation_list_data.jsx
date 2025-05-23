const QUOTATION_LIST_DATA = [
  {
    customer_id: 1000,
    customer_name: "Customer 1",
    date_issued: "2025-03-21",
    discount: 5,
    quotation_id: "Q-781A84",
    selected_address: "Street 1",
    selected_delivery_date: "2025-03-24",
    selected_products: [
      {
        product_id: "P003",
        product_name: "Office Chair",
        description: "Ergonomic office chair with lumbar support",
        quantity: 50,
        unit_price: 140,
        unit_of_measure: "Piece",
        markup_price: 168,
        tax: 12,
        discount: 5,
        warranty_period: 12,
      },
      {
        product_id: "P006",
        product_name: "External Hard Drive",
        description: "1TB external SSD with USB-C connectivity",
        quantity: 20,
        unit_price: 95,
        unit_of_measure: "Piece",
        markup_price: 114,
        tax: 9.5,
        discount: 5,
        warranty_period: 24,
      },
      {
        product_id: "P001",
        product_name: "Laptop",
        description: "High-performance laptop with Intel i7 processor",
        quantity: 10,
        unit_price: 1364,
        unit_of_measure: "Piece",
        markup_price: 1440,
        tax: 0,
        discount: 0,
        warranty_period: 24,
      },
    ],
    shipping_fee: 300,
    total_before_discount: 18360,
    total_price: 17442,
    total_tax: 1542.48,
    warranty_fee: 1363.2,
  },
  {
    customer_id: 1001,
    customer_name: "Customer 2",
    date_issued: "2025-03-22",
    discount: 10,
    quotation_id: "Q-9B2C6D",
    selected_address: "Street 5",
    selected_delivery_date: "2025-03-26",
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
    shipping_fee: 500,
    total_before_discount: 13100,
    total_price: 11895,
    total_tax: 1095.6,
    warranty_fee: 785.0,
  },
  {
    customer_id: 1002,
    customer_name: "Customer 3",
    date_issued: "2025-03-23",
    discount: 7,
    quotation_id: "Q-4F2D9A",
    selected_address: "Street 12",
    selected_delivery_date: "2025-03-27",
    selected_products: [
      {
        product_id: "P005",
        product_name: "Monitor",
        description: "27-inch 4K UHD monitor",
        quantity: 30,
        unit_price: 480,
        unit_of_measure: "Piece",
        markup_price: 518,
        tax: 48,
        discount: 7,
        warranty_period: 24,
      },
      {
        product_id: "P007",
        product_name: "Mechanical Keyboard",
        description: "RGB backlit mechanical keyboard",
        quantity: 50,
        unit_price: 115,
        unit_of_measure: "Piece",
        markup_price: 127,
        tax: 11.5,
        discount: 7,
        warranty_period: 12,
      },
    ],
    shipping_fee: 700,
    total_before_discount: 19550,
    total_price: 18195.5,
    total_tax: 1725.8,
    warranty_fee: 1290.0,
  },
  {
    customer_id: 1003,
    customer_name: "Customer 4",
    date_issued: "2025-03-24",
    discount: 12,
    quotation_id: "Q-6C3F1B",
    selected_address: "Street 20",
    selected_delivery_date: "2025-03-29",
    selected_products: [
      {
        product_id: "P008",
        product_name: "Smartphone",
        description: "Flagship smartphone with 256GB storage",
        quantity: 25,
        unit_price: 950,
        unit_of_measure: "Piece",
        markup_price: 1045,
        tax: 95,
        discount: 12,
        warranty_period: 24,
      },
    ],
    shipping_fee: 250,
    total_before_discount: 23750,
    total_price: 21000,
    total_tax: 2025.0,
    warranty_fee: 1575.0,
  },
];

export default QUOTATION_LIST_DATA;
