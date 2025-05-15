const API_BASE_URL = "https://eq7nxor488.execute-api.ap-southeast-1.amazonaws.com/dev";
//const API_BASE_URL = "https://1wj5891jxg.execute-api.ap-southeast-1.amazonaws.com/dev/"; // Local development URL
//const uploadToS3Endpoint = 'https://s9v4t5i8ej.execute-api.ap-southeast-1.amazonaws.com/dev/api/upload-to-s3/'

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
/*
export const uploadToS3 = async (file, directory) => {
  if (!file || !directory) {
    alert("Please select a file and directory.");
    return null;
  }

  try {
    // Use the dedicated S3 upload endpoint
    const presignRes = await fetch(
      uploadToS3Endpoint,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          directory,
          contentType: file.type,
        }),
      }
    );

    if (!presignRes.ok) {
      const error = await presignRes.json();
      throw new Error(error?.detail || "Failed to get S3 presigned URL");
    }

    const { uploadUrl, fileUrl } = await presignRes.json();

    const s3UploadRes = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    });

    if (!s3UploadRes.ok) {
      throw new Error("Upload to S3 failed");
    }

    return fileUrl;
  } catch (err) {
    console.error("File upload failed:", err);
    alert("File upload failed. Check console for details.");
    return null;
  }
};
*/