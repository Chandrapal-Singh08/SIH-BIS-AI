import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL?.trim() ||
  "https://sih-bis-ai.onrender.com";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000,
  withCredentials: false,
});

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

// ---------------- Upload ----------------

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

// ---------------- OCR ----------------

export const extractOCR = async (filename) => {
  const { data } = await api.get("/ocr/", {
    params: { filename },
  });
  return data;
};

export const downloadOCRText = async (filename) => {
  const response = await api.get("/ocr/download/", {
    params: { filename },
    responseType: "blob",
  });

  return response.data;
};

// ---------------- Validation ----------------

export const validateTender = async (filename) => {
  const { data } = await api.get("/validate/", {
    params: { filename },
  });

  return data;
};

// ---------------- Recommendation ----------------

export const getRecommendations = async (filename) => {
  const { data } = await api.get("/recommend/", {
    params: { filename },
  });

  return data;
};

// ---------------- AI Assistant ----------------

export const getAISummary = async (filename) => {
  const { data } = await api.get("/assistant/", {
    params: { filename },
  });

  return data;
};

export const askAssistant = async (filename, question) => {
  const { data } = await api.post("/assistant/", {
    filename,
    question,
  });

  return data;
};

// ---------------- Report ----------------

export const downloadReport = async (filename) => {
  const response = await api.get("/report/", {
    params: { filename },
    responseType: "blob",
  });

  return response.data;
};

// ---------------- Helpers ----------------

export const getTenderPDF = (filename) =>
  `${API_BASE_URL}/pdf/${filename}`;

export const getReportURL = (filename) =>
  `${API_BASE_URL}/report/?filename=${encodeURIComponent(filename)}`;

export const getOCRTextURL = (filename) =>
  `${API_BASE_URL}/ocr/download/?filename=${encodeURIComponent(filename)}`;