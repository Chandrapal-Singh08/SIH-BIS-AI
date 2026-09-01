import { createContext, useContext, useState } from "react";

const TenderContext = createContext(null);

// Safe JSON parser
const safeParse = (key, defaultValue) => {
  try {
    const value = localStorage.getItem(key);

    if (
      value === null ||
      value === undefined ||
      value === "undefined" ||
      value === "null"
    ) {
      return defaultValue;
    }

    return JSON.parse(value);
  } catch {
    return defaultValue;
  }
};

export function TenderProvider({ children }) {
  // Upload
  const [filename, setFilename] = useState(
    localStorage.getItem("filename") || ""
  );

  const [originalFilename, setOriginalFilename] = useState(
    localStorage.getItem("originalFilename") || ""
  );

  // OCR
  const [ocrPreview, setOCRPreview] = useState("");
  const [ocrMethod, setOCRMethod] = useState("");

  // Validation
  const [complianceScore, setComplianceScore] = useState(0);
  const [riskLevel, setRiskLevel] = useState("HIGH");

  const [matchedClauses, setMatchedClauses] = useState(
    safeParse("matchedClauses", [])
  );

  const [missingClauses, setMissingClauses] = useState(
    safeParse("missingClauses", [])
  );

  const [summary, setSummary] = useState("");

  // Recommendations
  const [productCategory, setProductCategory] = useState("");
  const [recommendations, setRecommendations] = useState(
    safeParse("recommendations", [])
  );

  // AI Assistant
  const [aiSummary, setAISummary] = useState("");
  const [chatHistory, setChatHistory] = useState(
    safeParse("chatHistory", [])
  );

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

    localStorage.clear();
  };

  return (
    <TenderContext.Provider
      value={{
        filename,
        setFilename,
        originalFilename,
        setOriginalFilename,
        ocrPreview,
        setOCRPreview,
        ocrMethod,
        setOCRMethod,
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
        productCategory,
        setProductCategory,
        recommendations,
        setRecommendations,
        aiSummary,
        setAISummary,
        chatHistory,
        setChatHistory,
        resetTender,
      }}
    >
      {children}
    </TenderContext.Provider>
  );
}

export function useTender() {
  const context = useContext(TenderContext);

  if (!context) {
    throw new Error("useTender must be used inside TenderProvider");
  }

  return context;
}