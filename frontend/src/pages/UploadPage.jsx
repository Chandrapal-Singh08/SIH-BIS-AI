import { useState } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  UploadCloud,
  FileCheck2,
  Loader2,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

import {
  uploadTender,
  extractOCR,
  validateTender,
  getRecommendations,
} from "../services/api";

import { useTender } from "../context/TenderContext";

export default function UploadPage() {
  const {
    resetTender,
    setFilename,
    setOriginalFilename,
    setOCRPreview,
    setOCRMethod,
    setComplianceScore,
    setRiskLevel,
    setMatchedClauses,
    setMissingClauses,
    setRecommendations,
    setProductCategory,
    setSummary,
  } = useTender();

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("");
  const [progress, setProgress] = useState(0);

  // -----------------------------
  // File Selection
  // -----------------------------
  const handleFileChange = (event) => {
    const selected = event.target.files?.[0];

    if (!selected) return;

    if (selected.type !== "application/pdf") {
      toast.error("Please upload a PDF file only.");
      return;
    }

    resetTender();
    setFile(selected);
    toast.success("Tender PDF selected successfully.");
  };

  // -----------------------------
  // Complete AI Pipeline
  // -----------------------------
  const handleAnalyze = async () => {
    if (!file) {
      toast.error("Please choose a PDF first.");
      return;
    }

    try {
      setLoading(true);

      // ===============================
      // STEP 1 — Upload
      // ===============================
      setStep("Uploading Tender...");
      setProgress(15);

      const upload = await uploadTender(file);

      const uploadedFilename = upload.filename;

      if (!uploadedFilename) {
        throw new Error("Upload failed. Backend didn't return filename.");
      }

      console.log("Uploaded Filename:", uploadedFilename);

      setFilename(uploadedFilename);
      setOriginalFilename(upload.original_filename);

      toast.success("Tender uploaded successfully.");

      // ===============================
      // STEP 2 — OCR
      // ===============================
      setStep("Extracting OCR...");
      setProgress(35);

      const ocr = await extractOCR(uploadedFilename);

      setOCRPreview(ocr.preview || "");
      setOCRMethod(ocr.method || "");

      toast.success(`OCR completed using ${ocr.method}.`);

      // ===============================
      // STEP 3 — Validation
      // ===============================
      setStep("Validating BIS Clauses...");
      setProgress(65);

      const validation = await validateTender(uploadedFilename);

      setComplianceScore(validation.score || 0);
      setRiskLevel(validation.risk_level || "HIGH");
      setMatchedClauses(validation.matched_details || []);
      setMissingClauses(validation.missing_clauses || []);
      setSummary(validation.summary || "");

      toast.success(`Compliance Score: ${validation.score}%`);

      // ===============================
      // STEP 4 — Recommendation Engine
      // ===============================
      setStep("Generating AI Recommendations...");
      setProgress(90);

      const recommendation = await getRecommendations(uploadedFilename);

      setProductCategory(recommendation.product_category || "");
      setRecommendations(recommendation.recommended_standards || []);

      // ===============================
      // COMPLETED
      // ===============================
      setStep("Completed");
      setProgress(100);

      toast.success("AI Recommendation Engine completed.");
    } catch (error) {
      console.error("Pipeline Error:", error);

      const message =
        error?.response?.data?.detail ||
        error?.message ||
        "Analysis failed. Please try again.";

      toast.error(message);

      setProgress(0);
      setStep("");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Workflow Cards
  // -----------------------------
  const workflow = [
    {
      title: "Upload Tender",
      icon: UploadCloud,
      active: progress >= 15,
    },
    {
      title: "OCR Extraction",
      icon: ScanSearch,
      active: progress >= 35,
    },
    {
      title: "BIS Validation",
      icon: ShieldCheck,
      active: progress >= 65,
    },
    {
      title: "AI Recommendation",
      icon: Sparkles,
      active: progress >= 90,
    },
  ];

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Hero */}
      <div className="rounded-3xl bg-gradient-to-r from-[#003366] via-[#0055AA] to-[#0080D5] p-8 text-white shadow-xl">
        <p className="uppercase tracking-widest text-blue-200 text-sm">
          Bureau of Indian Standards
        </p>

        <h1 className="text-4xl font-bold mt-2">
          Upload Government Tender PDF
        </h1>

        <p className="mt-4 max-w-3xl text-blue-100 leading-7">
          Upload a procurement tender and let the AI Engine automatically perform
          OCR extraction, BIS compliance validation, AI recommendation generation,
          and prepare a downloadable compliance report.
        </p>
      </div>

      {/* Upload Card */}
      <div className="bg-white rounded-3xl shadow-lg border-2 border-dashed border-blue-300 p-10">
        <div className="flex flex-col items-center text-center">
          <UploadCloud size={70} className="text-[#003366] mb-4" />

          <h2 className="text-2xl font-bold text-gray-800">
            Drag & Drop Tender PDF
          </h2>

          <p className="text-gray-500 mt-2">
            Only Government Tender PDF files are supported.
          </p>

          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="mt-6 block w-full max-w-md text-sm text-gray-600 file:mr-4 file:px-5 file:py-3 file:border-0 file:rounded-xl file:bg-[#003366] file:text-white hover:file:bg-[#002244]"
          />

          {file && (
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="mt-6 bg-blue-50 border border-blue-200 rounded-2xl p-5 w-full max-w-xl"
            >
              <div className="flex items-center gap-4">
                <FileCheck2 size={36} className="text-green-600" />

                <div className="text-left">
                  <h3 className="font-semibold text-lg text-gray-800 break-all">
                    {file.name}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={loading || !file}
            className="mt-8 bg-[#003366] hover:bg-[#002244] disabled:bg-gray-400 text-white px-8 py-4 rounded-xl font-semibold flex items-center gap-3 transition"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={22} />
                {step}
              </>
            ) : (
              <>
                <Sparkles size={22} />
                Analyze Tender
              </>
            )}
          </button>

          {loading && (
            <div className="mt-8 w-full max-w-xl">
              <div className="flex justify-between text-sm mb-2">
                <span>{step}</span>
                <span>{progress}%</span>
              </div>

              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-green-500 to-blue-600"
                  animate={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {progress === 100 && (
            <div className="mt-8 bg-green-50 border border-green-300 rounded-xl px-6 py-4 flex items-center gap-3 text-green-700">
              <CheckCircle2 size={24} />

              <span className="font-semibold">
                Tender analyzed successfully.
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Workflow */}
      <div className="bg-white rounded-3xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-[#003366] mb-6">
          AI Processing Workflow
        </h2>

        <div className="grid md:grid-cols-4 gap-5">
          {workflow.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className={`rounded-2xl border p-6 text-center transition-all ${
                  item.active
                    ? "bg-green-50 border-green-400 shadow"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <Icon
                  size={36}
                  className={`mx-auto mb-3 ${
                    item.active ? "text-green-600" : "text-gray-400"
                  }`}
                />

                <h3 className="font-semibold">{item.title}</h3>

                <p className="text-xs mt-2 text-gray-500">
                  {item.active ? "Completed" : "Pending"}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-3xl p-8">
        <h2 className="text-2xl font-bold text-[#003366] mb-5">
          What happens after upload?
        </h2>

        <div className="grid md:grid-cols-2 gap-5 text-gray-700">
          <div className="flex gap-3">
            <UploadCloud className="text-blue-700 mt-1" />
            <p>PDF is securely uploaded to the FastAPI backend.</p>
          </div>

          <div className="flex gap-3">
            <ScanSearch className="text-blue-700 mt-1" />
            <p>OCR extracts embedded or scanned text using PyMuPDF and Tesseract.</p>
          </div>

          <div className="flex gap-3">
            <ShieldCheck className="text-blue-700 mt-1" />
            <p>Validator checks mandatory BIS clauses like IP66, Warranty, Surge Protection, etc.</p>
          </div>

          <div className="flex gap-3">
            <Sparkles className="text-blue-700 mt-1" />
            <p>AI Recommendation Engine identifies applicable BIS standards using PostgreSQL + RAG.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}