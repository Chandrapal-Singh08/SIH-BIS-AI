import { createContext, useContext, useState } from "react";

const TenderContext = createContext(null);

export function TenderProvider({ children }) {
  /* ==========================================
      1. Uploaded Tender Information
  ========================================== */
  const [filename, setFilename] = useState("");
  const [originalFilename, setOriginalFilename] = useState("");

  /* ==========================================
      2. OCR Extraction
  ========================================== */
  const [ocrPreview, setOCRPreview] = useState("");
  const [ocrMethod, setOCRMethod] = useState("");

  /* ==========================================
      3. BIS Validation
  ========================================== */
  const [complianceScore, setComplianceScore] = useState(0);
  const [riskLevel, setRiskLevel] = useState("HIGH");
  const [matchedClauses, setMatchedClauses] = useState([]);
  const [missingClauses, setMissingClauses] = useState([]);
  const [summary, setSummary] = useState("");

  /* ==========================================
      4. AI Recommendation Engine
  ========================================== */
  const [productCategory, setProductCategory] = useState("");
  const [recommendations, setRecommendations] = useState([]);

  /* ==========================================
      5. Gemini AI Assistant
  ========================================== */
  const [aiSummary, setAISummary] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  /* ==========================================
      6. Reset Everything (New Tender Upload)
  ========================================== */
  const resetTender = () => {
    setFilename("");
    setOriginalFilename("");

    setOCRPreview("");
    setOCRMethod("");

    setComplianceScore(0);
    setRiskLevel("HIGH");
    setMatchedClauses([]);
    setMissingClauses([]);
    setSummary("");

    setProductCategory("");
    setRecommendations([]);

    setAISummary("");
    setChatHistory([]);
  };

  /* ==========================================
      Context Provider
  ========================================== */
  return (
    <TenderContext.Provider
      value={{
        // Upload
        filename,
        setFilename,
        originalFilename,
        setOriginalFilename,

        // OCR
        ocrPreview,
        setOCRPreview,
        ocrMethod,
        setOCRMethod,

        // Validation
        complianceScore,
        setComplianceScore,
        riskLevel,
        setRiskLevel,
        matchedClauses,
        setMatchedClauses,
        missingClauses,
        setMissingClauses,
        summary,
        setSummary,

        // Recommendation Engine
        productCategory,
        setProductCategory,
        recommendations,
        setRecommendations,

        // AI Assistant
        aiSummary,
        setAISummary,
        chatHistory,
        setChatHistory,

        // Utility
        resetTender,
      }}
    >
      {children}
    </TenderContext.Provider>
  );
}

/* ==========================================
    Custom Hook
========================================== */
export function useTender() {
  const context = useContext(TenderContext);

  if (!context) {
    throw new Error("useTender must be used inside TenderProvider");
  }

  return context;
}