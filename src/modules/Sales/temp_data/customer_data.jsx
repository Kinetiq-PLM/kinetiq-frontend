export const CUSTOMER_DATA = Array.from({ length: 30 }, (_, index) => ({
  customer_id: 1000 + index,
  gl_account_id: 200 + (index % 10), // Random GL Account IDs
  name: `Customer ${index + 1}`,
  email_address: `customer${index + 1}@example.com`,
  phone_number: `+1-555-01${index.toString().padStart(2, "0")}`,
  address_line1: `Street ${index + 1}`,
  address_line2: `Suite ${(index % 5) + 1}`,
  city: ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"][index % 5],
  postal_code: `1000${index}`,
  country: ["USA", "Canada", "UK", "Germany", "France"][index % 5],
  customer_type: ["Retail", "Wholesale", "Enterprise"][index % 3],
  status: ["Active", "Inactive", "Pending"][index % 3],
  debt: (Math.random() * 5000).toFixed(2), // Random debt between 0 and 5000
}));
