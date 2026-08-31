import axios from "axios";

/* ======================================================
   AI Powered BIS Tender Compliance Engine
   Production API Service
====================================================== */

// Render Backend URL
const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://sih-bis-ai.onrender.com";

/* ======================================================
   Axios Instance
====================================================== */

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 180000, // 3 Minutes
  headers: {
    Accept: "application/json",
  },
});

/* ======================================================
   Global API Error Handler
====================================================== */

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);

    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Response:", error.response.data);
    } else if (error.request) {
      console.error("Backend server is unreachable.");
    } else {
      console.error(error.message);
    }

    return Promise.reject(error);
  }
);

export default api;

/* ======================================================
   Health Check
====================================================== */

export const checkBackendStatus = async () => {
  const { data } = await api.get("/health");
  return data;
};

/* ======================================================
   Upload Tender PDF
====================================================== */

export const uploadTender = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await api.post("/upload/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};

/* ======================================================
   OCR Extraction
====================================================== */

export const extractOCR = async (filename) => {
  const { data } = await api.get("/ocr/", {
    params: { filename },
  });

  return data;
};

/* ======================================================
   Download OCR Text
====================================================== */

export const downloadOCRText = async (filename) => {
  const response = await api.get("/ocr/download/", {
    params: { filename },
    responseType: "blob",
  });

  return response.data;
};

/* ======================================================
   BIS Validation
====================================================== */

export const validateTender = async (filename) => {
  const { data } = await api.get("/validate/", {
    params: { filename },
  });

  return data;
};

/* ======================================================
   AI Recommendation Engine
====================================================== */

export const getRecommendations = async (filename) => {
  const { data } = await api.get("/recommend/", {
    params: { filename },
  });

  return data;
};

/* ======================================================
   Gemini AI Tender Summary
====================================================== */

export const getAISummary = async (filename) => {
  const { data } = await api.get("/assistant/", {
    params: { filename },
  });

  return data;
};

/* ======================================================
   Gemini AI Chat Assistant
====================================================== */

export const askAssistant = async (filename, question) => {
  const { data } = await api.post("/assistant/", {
    filename,
    question,
  });

  return data;
};

/* ======================================================
   Download Compliance Report
====================================================== */

export const downloadReport = async (filename) => {
  const response = await api.get("/report/", {
    params: { filename },
    responseType: "blob",
  });

  return response.data;
};

/* ======================================================
   Helper URLs
====================================================== */

// Uploaded Tender PDF (PDF Review Page)
export const getTenderPDF = (filename) =>
  `${API_BASE_URL}/uploads/${encodeURIComponent(filename)}`;

// Compliance Report URL
export const getReportURL = (filename) =>
  `${API_BASE_URL}/report/?filename=${encodeURIComponent(filename)}`;

// OCR Text URL
export const getOCRTextURL = (filename) =>
  `${API_BASE_URL}/ocr/download/?filename=${encodeURIComponent(filename)}`;