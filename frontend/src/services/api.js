import axios from "axios";

/* ======================================================
   AI Powered BIS Tender Compliance Engine (SIH 2026)
   Central FastAPI Service Layer
====================================================== */

const API_BASE_URL = "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000, // 120 seconds (Gemini/RAG may take time)
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
      console.error("Backend server is not reachable.");
    } else {
      console.error("Error:", error.message);
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
   GET /ocr/download/?filename=
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
   GET /validate/?filename=
====================================================== */

export const validateTender = async (filename) => {
  const { data } = await api.get("/validate/", {
    params: { filename },
  });

  return data;
};

/* ======================================================
   6. AI Recommendation Engine
   GET /recommend/?filename=
====================================================== */

export const getRecommendations = async (filename) => {
  const { data } = await api.get("/recommend/", {
    params: { filename },
  });

  return data;
};

/* ======================================================
   7. Gemini AI Procurement Summary
   GET /assistant/?filename=
====================================================== */

export const getAISummary = async (filename) => {
  const { data } = await api.get("/assistant/", {
    params: { filename },
  });

  return data;
};

/* ======================================================
   8. Gemini Chat Assistant
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
   9. Generate & Download Compliance Report
   GET /report/?filename=
====================================================== */

export const downloadReport = async (filename) => {
  const response = await api.get("/report/", {
    params: { filename },
    responseType: "blob",
  });

  return response.data;
};

/* ======================================================
   Helper URLs (Used in React Components)
====================================================== */

// Uploaded Tender PDF URL (PDF Viewer)
export const getTenderPDF = (filename) => {
  return `${API_BASE_URL}/uploads/${filename}`;
};

// Compliance Report Download URL
export const getReportURL = (filename) => {
  return `${API_BASE_URL}/report/?filename=${encodeURIComponent(filename)}`;
};

// OCR Text Download URL (optional)
export const getOCRTextURL = (filename) => {
  return `${API_BASE_URL}/ocr/download/?filename=${encodeURIComponent(
    filename
  )}`;
};