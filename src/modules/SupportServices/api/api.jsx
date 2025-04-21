// const API_BASE_URL = "http://localhost:8000/";
const API_BASE_URL = "http://localhost:8001/";
// const API_BASE_URL = "https://wdsuewblda.execute-api.ap-southeast-1.amazonaws.com/dev/";
const API_BASE_URL_NOTIF = "https://s9v4t5i8ej.execute-api.ap-southeast-1.amazonaws.com/dev/";

export const GET = async (endpoint) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/services/${endpoint}`);
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
    const response = await fetch(`${API_BASE_URL}/api/services/${endpoint}`, {
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
    const response = await fetch(`${API_BASE_URL}/api/services/${endpoint}`, {
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

export const POST_NOTIF = async (endpoint, data) => {
  try {
    const response = await fetch(`${API_BASE_URL_NOTIF}/api/${endpoint}`, {
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