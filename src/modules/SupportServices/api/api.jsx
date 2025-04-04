const API_BASE_URL = "http://localhost:8000/";

export const GET = async (endpoint) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`);
    if (!response.ok) throw new Error("Failed to fetch");
    return await response.json();
  } catch (error) {
    console.error("GET error:", error);
    throw error;
  }
};

export const POST = async (endpoint, data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to post");
    return await response.json();
  } catch (error) {
    console.error("POST error:", error);
    throw error;
  }
};

export const PATCH = async (endpoint, data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to patch");
    return await response.json();
  } catch (error) {
    console.error("PATCH error:", error);
    throw error;
  }
};
