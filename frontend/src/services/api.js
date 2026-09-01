import axios from "axios";

const API = axios.create({
  baseURL: "https://sih-bis-ai.onrender.com",
  timeout: 60000,
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    throw error;
  }
);

// ---------------- Upload ----------------
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

// ---------------- OCR ----------------
export const extractOCR = async (filename) => {
  const { data } = await API.get("/ocr/", {
    params: { filename },
  });

  return data;
};

export const downloadOCRText = async (filename) => {
  const { data } = await API.get("/ocr/download/", {
    params: { filename },
  });

  return data;
};

// ---------------- Validator ----------------
export const validateTender = async (filename) => {
  const { data } = await API.get("/validate/", {
    params: { filename },
  });

  return data;
};

// ---------------- Recommendation ----------------
export const getRecommendations = async (filename) => {
  const { data } = await API.get("/recommend/", {
    params: { filename },
  });

  return data;
};

// ---------------- AI Assistant ----------------
export const askAssistant = async (filename, question) => {
  const { data } = await API.post("/assistant/", {
    filename,
    question,
  });

  return data;
};

// ---------------- PDF Preview ----------------
export const getTenderPDF = (filename) => {
  return `${API.defaults.baseURL}/pdf/${encodeURIComponent(filename)}`;
};

// ---------------- Report Download ----------------
export const downloadReport = (filename) => {
  return `${API.defaults.baseURL}/reports/${filename.replace(".pdf", "_report.pdf")}`;
};

export default API;