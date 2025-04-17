//const API_BASE_URL = "https://eq7nxor488.execute-api.ap-southeast-1.amazonaws.com/";
const API_BASE_URL = "http://127.0.0.1:8000/";

export const GET = async (endpoint) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`);
    const result = await response.json();

    if (!response.ok) {
      console.error("GET error:", result);
      throw new Error(result?.detail || "Failed to fetch");
    }

    return result;
  } catch (error) {
    console.error("GET catch error:", error);
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

    const result = await response.json();

    if (!response.ok) {
      throw result;
    }

    return result;
  } catch (error) {
    console.error("POST catch error:", error);
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

    const result = await response.json();

    if (!response.ok) {
      throw result;
    }

    return result;
  } catch (error) {
    console.error("PATCH catch error:", error);
    throw error;
  }
};