import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  Loader2,
} from "lucide-react";

import { uploadTender, extractOCR } from "../services/api";
import { useTender } from "../context/TenderContext";

export default function UploadTender() {
  const navigate = useNavigate();

  // Global Tender Context
  const { saveTender } = useTender();

  // Local State
  const [file, setFile] = useState(null);
  const [savedFilename, setSavedFilename] = useState("");
  const [ocrText, setOcrText] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);

  // -----------------------------
  // Select PDF
  // -----------------------------
  const handleFile = (e) => {
    const selected = e.target.files[0];

    if (!selected) return;

    if (selected.type !== "application/pdf") {
      alert("Please upload a PDF file only.");
      return;
    }

    setFile(selected);
  };

  // -----------------------------
  // Upload PDF + OCR Extraction
  // -----------------------------
  const handleUpload = async () => {
    if (!file) {
      alert("Please choose a PDF first.");
      return;
    }

    try {
      setLoading(true);
      setProgress(15);

      // Upload Tender
      const uploadRes = await uploadTender(file);

      setProgress(45);

      // Save filename globally
      saveTender(uploadRes.filename);
      setSavedFilename(uploadRes.filename);

      setProgress(70);

      // OCR Extraction
      const ocrRes = await extractOCR(uploadRes.filename);

      setProgress(100);

      // Save OCR locally for preview
      setOcrText(ocrRes.preview);

      // Navigate after success
      setTimeout(() => {
        navigate("/recommendations");
      }, 1500);
    } catch (err) {
      console.error(err);
      alert("Upload failed. Please make sure the FastAPI backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 p-4">

      {/* ================= HEADER ================= */}

      <div>
        <p className="uppercase tracking-widest text-green-700 text-sm font-semibold">
          Smart India Hackathon 2026
        </p>

        <h1 className="text-4xl font-bold text-slate-800 mt-2">
          Upload Government Tender PDF
        </h1>

        <p className="mt-3 text-slate-600 text-lg leading-8 max-w-4xl">
          Upload a Government or GeM Tender PDF. The AI engine extracts OCR,
          identifies BIS standards, validates compliance, finds missing clauses,
          generates AI recommendations, and prepares an audit-ready report.
        </p>
      </div>

      {/* ================= DRAG & DROP ================= */}

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);

          const dropped = e.dataTransfer.files[0];

          if (dropped && dropped.type === "application/pdf") {
            setFile(dropped);
          } else {
            alert("Please drop a PDF file only.");
          }
        }}
        className={`rounded-3xl border-2 border-dashed p-14 text-center transition-all duration-300 cursor-pointer ${
          dragActive
            ? "border-green-700 bg-green-100 scale-[1.02]"
            : "border-green-500 bg-white hover:border-green-700 hover:bg-green-50"
        }`}
      >
        <UploadCloud size={70} className="mx-auto text-green-600" />

        <h2 className="mt-6 text-3xl font-bold text-slate-700">
          Drag & Drop Tender PDF
        </h2>

        <p className="text-slate-500 mt-3 text-lg">
          {file
            ? `Selected File: ${file.name}`
            : "or click below to browse your computer"}
        </p>

        <input
          id="pdf-upload"
          type="file"
          accept=".pdf"
          onChange={handleFile}
          className="hidden"
        />

        <label
          htmlFor="pdf-upload"
          className="inline-block mt-8 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-semibold cursor-pointer shadow-lg transition"
        >
          Browse PDF
        </label>
      </div>

      {/* ================= FILE DETAILS ================= */}

      {file && (
        <div className="bg-white rounded-3xl shadow-lg p-6 flex justify-between items-center">

          <div className="flex items-center gap-5">

            <div className="bg-red-100 p-4 rounded-2xl">
              <FileText className="text-red-600" size={34} />
            </div>

            <div>
              <h3 className="font-bold text-xl text-slate-800">
                {file.name}
              </h3>

              <p className="text-slate-500">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>

              {savedFilename && (
                <p className="text-green-600 text-sm mt-1">
                  Saved As: {savedFilename}
                </p>
              )}
            </div>

          </div>

          <CheckCircle2 size={36} className="text-green-600" />

        </div>
      )}

      {/* ================= PROGRESS BAR ================= */}

      {loading && (
        <div className="bg-white rounded-3xl shadow-lg p-6">

          <div className="flex justify-between items-center mb-4">

            <span className="font-semibold text-slate-700">
              Uploading Tender & Extracting OCR...
            </span>

            <Loader2 className="animate-spin text-green-600" />

          </div>

          <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden">

            <div
              className="bg-gradient-to-r from-green-500 to-green-700 h-4 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />

          </div>

          <p className="mt-3 text-green-700 font-medium">
            {progress}% Completed
          </p>

        </div>
      )}

      {/* ================= ACTION BUTTON ================= */}

      <button
        onClick={handleUpload}
        disabled={!file || loading}
        className="bg-green-600 hover:bg-green-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition"
      >
        {loading ? "Processing Tender..." : "Upload & Extract OCR"}
      </button>

      {/* ================= OCR PREVIEW ================= */}

      {ocrText && (
        <div className="bg-white rounded-3xl shadow-lg p-8">

          <div className="flex items-center gap-3 mb-6">

            <CheckCircle2 className="text-green-600" />

            <h2 className="text-3xl font-bold text-slate-800">
              OCR Preview
            </h2>

          </div>

          <div className="bg-slate-100 rounded-xl border p-5 h-96 overflow-y-auto whitespace-pre-wrap text-sm leading-7 text-slate-700">
            {ocrText}
          </div>

          <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">

            <CheckCircle2 className="text-green-600" />

            <div>
              <p className="font-semibold text-green-700">
                OCR Extraction Completed Successfully
              </p>

              <p className="text-green-600 text-sm">
                Redirecting to BIS Recommendation Engine...
              </p>
            </div>

          </div>

        </div>
      )}

      {/* ================= MANUAL NEXT BUTTON ================= */}

      {ocrText && (
        <div className="text-center">

          <button
            onClick={() => navigate("/recommendations")}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-4 rounded-xl font-bold text-lg shadow-lg transition"
          >
            Analyze Tender →
          </button>

        </div>
      )}

    </div>
  );
}