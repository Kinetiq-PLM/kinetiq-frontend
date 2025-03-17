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
