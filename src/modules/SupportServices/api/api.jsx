const BASE_API_URL = "http://localhost:8000/";

export async function GET(endpoint) {
  const res = await fetch(BASE_API_URL + endpoint, {
    method: "GET",
  });

  if (!res.ok) throw new Error(`GET request failed: ${res.status}`); // catch errors

  return await res.json();
}

export async function POST(endpoint, data) {
  const res = await fetch(BASE_API_URL + endpoint, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const errorText = await res.text(); // catch errors
    throw new Error(`POST request failed: ${res.status} - ${errorText}`);
  }

  return res.json(); 
}

export async function PATCH(endpoint, data) {
  const res = await fetch(BASE_API_URL + endpoint, {
    method: "PATCH",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error(`PATCH request failed: ${res.status}`); // catch errors

  return await res.json();
}
