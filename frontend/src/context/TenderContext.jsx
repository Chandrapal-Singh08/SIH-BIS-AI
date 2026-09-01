import { createContext, useContext, useState, useEffect } from "react";

const TenderContext = createContext(null);

export function TenderProvider({ children }) {
  // =====================================================
  // Upload Information
  // =====================================================

  const [filename, setFilenameState] = useState(
    localStorage.getItem("uploadedTender") || ""
  );

  const [originalFilename, setOriginalFilenameState] = useState(
    localStorage.getItem("originalTender") || ""
  );

  // =====================================================
  // OCR
  // =====================================================

  const [ocrPreview, setOCRPreviewState] = useState(
    localStorage.getItem("ocrPreview") || ""
  );

  const [ocrMethod, setOCRMethodState] = useState(
    localStorage.getItem("ocrMethod") || ""
  );

  // =====================================================
  // Validation
  // =====================================================

  const [complianceScore, setComplianceScoreState] = useState(
    Number(localStorage.getItem("complianceScore")) || 0
  );

  const [riskLevel, setRiskLevelState] = useState(
    localStorage.getItem("riskLevel") || "HIGH"
  );

  const [matchedClauses, setMatchedClausesState] = useState(() => {
    const data = localStorage.getItem("matchedClauses");
    return data ? JSON.parse(data) : [];
  });

  const [missingClauses, setMissingClausesState] = useState(() => {
    const data = localStorage.getItem("missingClauses");
    return data ? JSON.parse(data) : [];
  });

  const [summary, setSummaryState] = useState(
    localStorage.getItem("summary") || ""
  );

  // =====================================================
  // AI Recommendation Engine
  // =====================================================

  const [productCategory, setProductCategoryState] = useState(
    localStorage.getItem("productCategory") || ""
  );

  const [recommendations, setRecommendationsState] = useState(() => {
    const data = localStorage.getItem("recommendations");
    return data ? JSON.parse(data) : [];
  });

  // =====================================================
  // Gemini AI Assistant
  // =====================================================

  const [aiSummary, setAISummaryState] = useState(
    localStorage.getItem("aiSummary") || ""
  );

  const [chatHistory, setChatHistoryState] = useState(() => {
    const data = localStorage.getItem("chatHistory");
    return data ? JSON.parse(data) : [];
  });

  // =====================================================
  // Setter Functions (Save to LocalStorage)
  // =====================================================

  const setFilename = (value) => {
    localStorage.setItem("uploadedTender", value);
    setFilenameState(value);
  };

  const setOriginalFilename = (value) => {
    localStorage.setItem("originalTender", value);
    setOriginalFilenameState(value);
  };

  const setOCRPreview = (value) => {
    localStorage.setItem("ocrPreview", value);
    setOCRPreviewState(value);
  };

  const setOCRMethod = (value) => {
    localStorage.setItem("ocrMethod", value);
    setOCRMethodState(value);
  };

  const setComplianceScore = (value) => {
    localStorage.setItem("complianceScore", value);
    setComplianceScoreState(value);
  };

  const setRiskLevel = (value) => {
    localStorage.setItem("riskLevel", value);
    setRiskLevelState(value);
  };

  const setMatchedClauses = (value) => {
    localStorage.setItem("matchedClauses", JSON.stringify(value));
    setMatchedClausesState(value);
  };

  const setMissingClauses = (value) => {
    localStorage.setItem("missingClauses", JSON.stringify(value));
    setMissingClausesState(value);
  };

  const setSummary = (value) => {
    localStorage.setItem("summary", value);
    setSummaryState(value);
  };

  const setProductCategory = (value) => {
    localStorage.setItem("productCategory", value);
    setProductCategoryState(value);
  };

  const setRecommendations = (value) => {
    localStorage.setItem("recommendations", JSON.stringify(value));
    setRecommendationsState(value);
  };

  const setAISummary = (value) => {
    localStorage.setItem("aiSummary", value);
    setAISummaryState(value);
  };

  const setChatHistory = (value) => {
    localStorage.setItem("chatHistory", JSON.stringify(value));
    setChatHistoryState(value);
  };

  // =====================================================
  // Clear Everything
  // =====================================================

  const resetTender = () => {
    localStorage.removeItem("uploadedTender");
    localStorage.removeItem("originalTender");
    localStorage.removeItem("ocrPreview");
    localStorage.removeItem("ocrMethod");
    localStorage.removeItem("complianceScore");
    localStorage.removeItem("riskLevel");
    localStorage.removeItem("matchedClauses");
    localStorage.removeItem("missingClauses");
    localStorage.removeItem("summary");
    localStorage.removeItem("productCategory");
    localStorage.removeItem("recommendations");
    localStorage.removeItem("aiSummary");
    localStorage.removeItem("chatHistory");

    setFilenameState("");
    setOriginalFilenameState("");
    setOCRPreviewState("");
    setOCRMethodState("");
    setComplianceScoreState(0);
    setRiskLevelState("HIGH");
    setMatchedClausesState([]);
    setMissingClausesState([]);
    setSummaryState("");
    setProductCategoryState("");
    setRecommendationsState([]);
    setAISummaryState("");
    setChatHistoryState([]);
  };

  // =====================================================
  // Keep LocalStorage Updated
  // =====================================================

  useEffect(() => {
    localStorage.setItem("uploadedTender", filename);
  }, [filename]);

  // =====================================================
  // Context Provider
  // =====================================================

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

// =====================================================
// Custom Hook
// =====================================================

export function useTender() {
  const context = useContext(TenderContext);

  if (!context) {
    throw new Error("useTender must be used inside TenderProvider");
  }

  return context;
}