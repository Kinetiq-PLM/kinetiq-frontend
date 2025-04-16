// export const BASE_API_URL = "http://localhost:8001/api/";
export const BASE_API_URL =
  "https://ls9h09elei.execute-api.ap-southeast-1.amazonaws.com/dev/api/";

export async function GET(endpoint) {
  try {
    const res = await fetch(BASE_API_URL + endpoint, {
      method: "GET",
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText);
    }

    return await res.json();
  } catch (err) {
    console.error("Fetch error:", err);
    throw err; // rethrow so React Query knows it's an error
  }
}
export async function POST(endpoint, data) {
  try {
    const res = await fetch(BASE_API_URL + endpoint, {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText);
    }

    return await res.json();
  } catch (err) {
    console.error("Fetch error:", err);
    throw err; // rethrow so React Query knows it's an error
  }
}

export async function PATCH(endpoint, data) {
  try {
    const res = await fetch(BASE_API_URL + endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText);
    }

    return await res.json();
  } catch (err) {
    console.error("Fetch error:", err);
    throw err; // rethrow so React Query knows it's an error
  }
}

export async function DELETE(endpoint) {
  try {
    const res = await fetch(BASE_API_URL + endpoint, {
      method: "DELETE",
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText);
    }

    return res.ok;
  } catch (err) {
    console.error("Fetch error:", err);
    throw err; // rethrow so React Query knows it's an error
  }
}
