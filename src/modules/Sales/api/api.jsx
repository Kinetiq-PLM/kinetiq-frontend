const BASE_API_URL = "http://localhost:8000/api/";

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
  });
  return await res.json();
}

export async function PATCH(endpoint, data) {
  const res = await fetch(BASE_API_URL + endpoint, {
    method: "PATCH",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
  return await res.json();
}
