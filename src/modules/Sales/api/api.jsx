const BASE_API_URL = "http://localhost:8000/api/";
<<<<<<< HEAD

export async function GET(endpoint) {
  const res = await fetch(BASE_API_URL + endpoint, {
    method: "GET",
  });
  return await res.json();
}
export async function POST(endpoint, data) {
  const res = await fetch(BASE_API_URL + endpoint, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
=======
export async function getProducts() {
  const res = await fetch(BASE_API_URL + "misc/product/", {
    method: "GET",
  });
  if (res.ok) {
    return await res.json();
  }
  return {};
}
export async function getCustomers() {
  const res = await fetch(BASE_API_URL + "sales/customer/", {
    method: "GET",
>>>>>>> 308af98 (partially implement adding quotation)
  });
  return await res.json();
}

export async function addQuotation(newQuotation) {
  const res = await fetch(BASE_API_URL + "sales/quotation/", {
    method: "POST",
    body: JSON.stringify(newQuotation),
    headers: { "Content-Type": "application/json" },
  });
  if (res.ok) {
    return await res.json();
  }
  return {};
}
export async function getQuotations() {
  const res = await fetch(BASE_API_URL + "sales/quotation/", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (res.ok) {
    return await res.json();
  }
  return {};
}
export async function getBlanketAgreements() {
  const res = await fetch(BASE_API_URL + "sales/agreement/", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (res.ok) {
    return await res.json();
  }
  return {};
}
export async function getOrders() {
  const res = await fetch(BASE_API_URL + "sales/order/", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (res.ok) {
    return await res.json();
  }
  return {};
}
export async function getInvoices() {
  const res = await fetch(BASE_API_URL + "sales/invoice/", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (res.ok) {
    return await res.json();
  }
  return {};
}
