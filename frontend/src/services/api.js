import axios from "axios";

// ============================================
// Backend URL
// ============================================

const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "https://sih-bis-ai.onrender.com",
  timeout: 120000,
});

// ============================================
// Error Logging
// ============================================

API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);

    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    }

    return Promise.reject(error);
  }
);

// ============================================
// Upload Pipeline
// ============================================

export const uploadTender = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await API.post("/upload/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};

export const extractOCR = async (filename) => {
  const { data } = await API.get("/ocr/", {
    params: { filename },
  });

  return data;
};

export const validateTender = async (filename) => {
  const { data } = await API.get("/validate/", {
    params: { filename },
  });

  return data;
};

export const getRecommendations = async (filename) => {
  const { data } = await API.get("/recommend/", {
    params: { filename },
  });

  return data;
};

// ============================================
// AI Assistant
// ============================================

// AI Summary
export const getAISummary = async (filename) => {
  const { data } = await API.get("/assistant/summary", {
    params: { filename },
  });

  return data;
};

// Ask Gemini
export const askAssistant = async (filename, question) => {
  const { data } = await API.post("/assistant/chat", {
    filename,
    question,
  });

  return data;
};

// ============================================
// PDF Review
// ============================================

export const getTenderPDF = (filename) => {
  return `${
    import.meta.env.VITE_API_URL || "https://sih-bis-ai.onrender.com"
  }/pdf/${filename}`;
};

// ============================================
// OCR Download
// ============================================

export const downloadOCRText = (filename) => {
  return `${
    import.meta.env.VITE_API_URL || "https://sih-bis-ai.onrender.com"
  }/uploads/${filename.replace(".pdf", ".txt")}`;
};

// ============================================
// Compliance Report
// ============================================

export const downloadReport = async (filename) => {
  const { data } = await API.get("/report/", {
    params: { filename },
  });

  return data;
};

export default API;