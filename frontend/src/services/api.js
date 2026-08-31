import axios from "axios";

/* ======================================================
   AI Powered BIS Tender Compliance Engine (SIH 2026)
   Production API Service (Render Backend)
====================================================== */

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://sih-bis-ai.onrender.com";

/* ======================================================
   Axios Instance
====================================================== */

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000, // 2 minutes
  headers: {
    "Content-Type": "application/json",
  },
});

/* ======================================================
   Global Response / Error Handler
====================================================== */

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);

    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
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
   1. Backend Health Check
   GET /
====================================================== */

export const checkBackendStatus = async () => {
  const { data } = await api.get("/");
  return data;
};

/* ======================================================
   2. Upload Tender PDF
   POST /upload/
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
   3. OCR Extraction
   GET /ocr/?filename=
====================================================== */

export const extractOCR = async (filename) => {
  const { data } = await api.get("/ocr/", {
    params: { filename },
  });

  return data;
};

/* ======================================================
   4. Download OCR Text
   GET /ocr/download/
====================================================== */

export const downloadOCRText = async (filename) => {
  const response = await api.get("/ocr/download/", {
    params: { filename },
    responseType: "blob",
  });

  return response.data;
};

/* ======================================================
   5. BIS Compliance Validation
   GET /validate/
====================================================== */

export const validateTender = async (filename) => {
  const { data } = await api.get("/validate/", {
    params: { filename },
  });

  return data;
};

/* ======================================================
   6. AI Recommendation Engine
   GET /recommend/
====================================================== */

export const getRecommendations = async (filename) => {
  const { data } = await api.get("/recommend/", {
    params: { filename },
  });

  return data;
};

/* ======================================================
   7. Gemini AI Summary
   GET /assistant/
====================================================== */

export const getAISummary = async (filename) => {
  const { data } = await api.get("/assistant/", {
    params: { filename },
  });

  return data;
};

/* ======================================================
   8. Gemini AI Chat Assistant
   POST /assistant/
====================================================== */

export const askAssistant = async (filename, question) => {
  const { data } = await api.post("/assistant/", {
    filename,
    question,
  });

  return data;
};

/* ======================================================
   9. Download Compliance Report
   GET /report/
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

// Uploaded Tender PDF (for PDF Viewer)
export const getTenderPDF = (filename) =>
  `${API_BASE_URL}/uploads/${filename}`;

// Compliance Report URL
export const getReportURL = (filename) =>
  `${API_BASE_URL}/report/?filename=${encodeURIComponent(filename)}`;

// OCR Text URL
export const getOCRTextURL = (filename) =>
  `${API_BASE_URL}/ocr/download/?filename=${encodeURIComponent(filename)}`;