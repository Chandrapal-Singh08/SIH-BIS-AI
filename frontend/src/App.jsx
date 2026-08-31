import { Routes, Route } from "react-router-dom";

// Layout
import Navbar from "./layout/Navbar";

// Pages
import Dashboard from "./pages/Dashboard";
import UploadPage from "./pages/UploadPage";
import OCRPage from "./pages/OCRPage";
import ValidationPage from "./pages/ValidationPage";
import RecommendationPage from "./pages/RecommendationPage";
import PDFReviewPage from "./pages/PDFReviewPage";
import AssistantPage from "./pages/AssistantPage";
import ComplianceReport from "./pages/ComplianceReport";

export default function App() {
  return (
    <div className="min-h-screen bg-[#F4F7FB]">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/ocr" element={<OCRPage />} />
          <Route path="/validation" element={<ValidationPage />} />
          <Route path="/recommendations" element={<RecommendationPage />} />
          <Route path="/review" element={<PDFReviewPage />} />
          <Route path="/assistant" element={<AssistantPage />} />
          <Route path="/report" element={<ComplianceReport />} />
        </Routes>
      </main>
    </div>
  );
}