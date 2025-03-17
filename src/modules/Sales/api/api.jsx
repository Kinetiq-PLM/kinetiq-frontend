export async function getProducts() {
  const res = await fetch("http://127.0.0.1:8000/api/misc/product/", {
    method: "GET",
  });
  console.log(res);
  if (res.ok) {
    return await res.json();
  }
  return {};
}
export async function getCustomers() {
  const res = await fetch("http://localhost:8000/api/sales/customer/", {
    method: "GET",
  });
  if (res.ok) {
    return await res.json();
  }
  return {};
}
