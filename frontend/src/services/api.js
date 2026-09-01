import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "https://sih-bis-ai.onrender.com",
  timeout: 180000,
});

// -------------------------------------------
// Error Logger
// -------------------------------------------

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);

    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    } else {
      console.error("Backend server unreachable.");
    }

    return Promise.reject(error);
  }
);

// -------------------------------------------
// Upload
// -------------------------------------------

export const uploadTender = async (file) => {
  const form = new FormData();
  form.append("file", file);

  const res = await api.post("/upload/", form, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

// OCR
export const extractOCR = async (filename) => {
  const res = await api.get("/ocr/", {
    params: { filename },
  });

  return res.data;
};

// Validation
export const validateTender = async (filename) => {
  const res = await api.get("/validate/", {
    params: { filename },
  });

  return res.data;
};

// Recommendation
export const getRecommendations = async (filename) => {
  const res = await api.get("/recommend/", {
    params: { filename },
  });

  return res.data;
};

// AI Summary
export const getAISummary = async (filename) => {
  const res = await api.get("/assistant/summary", {
    params: { filename },
  });

  return res.data;
};

// AI Chat
export const askAssistant = async (filename, question) => {
  const res = await api.post("/assistant/ask", {
    filename,
    question,
  });

  return res.data;
};

// Report
export const generateReport = async (filename) => {
  const res = await api.get("/report/generate", {
    params: { filename },
  });

  return res.data;
};

export default api;