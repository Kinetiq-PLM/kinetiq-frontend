const BASE_API_URL = "http://localhost:8000/api/";
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
  });
  if (res.ok) {
    return await res.json();
  }
  return {};
}

export async function addStatement(newStatement) {
  const res = await fetch(BASE_API_URL + "sales/statement/", {
    method: "POST",
    body: JSON.stringify(newStatement),
    headers: { "Content-Type": "application/json" },
  });
  if (res.ok) {
    return await res.json();
  }
  return {};
}
export async function addStatementItem(newStatement) {
  const res = await fetch(BASE_API_URL + "sales/statement-item/", {
    method: "POST",
    body: JSON.stringify(newStatement),
    headers: { "Content-Type": "application/json" },
  });
  if (res.ok) {
    return await res.json();
  }
  return {};
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

export async function addCustomer(newCustomer) {
  const res = await fetch(BASE_API_URL + "sales/customer/", {
    method: "POST",
    body: JSON.stringify(newCustomer),
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
