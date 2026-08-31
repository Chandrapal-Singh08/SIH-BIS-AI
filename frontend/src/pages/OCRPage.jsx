import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  ScanSearch,
  Download,
  Search,
  Copy,
  FileText,
  CheckCircle2,
} from "lucide-react";

import { extractOCR, downloadOCRText } from "../services/api";
import { useTender } from "../context/TenderContext";

export default function OCRPage() {
  const {
    filename,
    ocrPreview,
    setOCRPreview,
    ocrMethod,
    setOCRMethod,
  } = useTender();

  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (filename && !ocrPreview) {
      fetchOCR();
    }
  }, [filename]);

  const fetchOCR = async () => {
    try {
      setLoading(true);

      const data = await extractOCR(filename);

      setOCRPreview(data.preview);
      setOCRMethod(data.method);

      toast.success("OCR extraction completed.");
    } catch (err) {
      console.error(err);
      toast.error("OCR extraction failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const blob = await downloadOCRText(filename);

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = filename.replace(".pdf", ".txt");

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);

      toast.success("OCR text downloaded.");
    } catch (err) {
      console.error(err);
      toast.error("Download failed.");
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(ocrPreview);
      toast.success("OCR text copied.");
    } catch {
      toast.error("Copy failed.");
    }
  };

  const highlightedText = searchTerm
    ? ocrPreview.replace(
        new RegExp(searchTerm, "gi"),
        (match) => `<<<${match}>>>`
      )
    : ocrPreview;

  if (!filename) {
    return (
      <div className="bg-white rounded-3xl shadow-lg p-12 text-center">
        <ScanSearch className="mx-auto text-gray-400 mb-4" size={64} />

        <h2 className="text-2xl font-bold text-gray-700">
          No OCR Available
        </h2>

        <p className="text-gray-500 mt-2">
          Upload a tender first to extract OCR text.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Hero */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-700 to-blue-600 text-white p-8 shadow-xl">
        <div className="flex items-center gap-4">
          <ScanSearch size={42} />

          <div>
            <h1 className="text-4xl font-bold">
              OCR Extraction Engine
            </h1>

            <p className="text-blue-100 mt-2">
              Extracted text from uploaded Government Tender PDF using PyMuPDF and Tesseract OCR.
            </p>
          </div>
        </div>
      </div>

      {/* OCR Info */}
      <div className="grid md:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-sm text-gray-500">OCR Engine</p>

          <h2 className="text-xl font-bold text-indigo-700 mt-2">
            {ocrMethod || "Not Extracted"}
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-sm text-gray-500">Characters Extracted</p>

          <h2 className="text-xl font-bold text-green-600 mt-2">
            {ocrPreview.length}
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-sm text-gray-500">Tender Status</p>

          <div className="flex items-center gap-2 mt-2 text-green-700">
            <CheckCircle2 size={18} />
            OCR Completed
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl shadow p-5 flex flex-wrap gap-4 justify-between items-center">
        <div className="relative flex-1 min-w-[260px]">
          <Search
            className="absolute left-3 top-3 text-gray-400"
            size={18}
          />

          <input
            type="text"
            placeholder="Search OCR text..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 px-4 py-3 rounded-xl"
          >
            <Copy size={18} />
            Copy
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-2 bg-[#003366] text-white hover:bg-[#002244] px-5 py-3 rounded-xl"
          >
            <Download size={18} />
            Download TXT
          </button>
        </div>
      </div>

      {/* OCR Preview */}
      <div className="bg-white rounded-3xl shadow-lg p-7">
        <div className="flex items-center gap-3 mb-5">
          <FileText className="text-indigo-700" />

          <h2 className="text-2xl font-bold text-[#003366]">
            OCR Preview
          </h2>
        </div>

        {loading ? (
          <p className="text-blue-700">Extracting OCR...</p>
        ) : (
          <div className="bg-slate-50 rounded-xl border p-5 max-h-[600px] overflow-y-auto whitespace-pre-wrap leading-7 text-gray-700">
            {highlightedText.split("<<<").map((part, index) => {
              if (part.includes(">>>")) {
                const [match, rest] = part.split(">>>");

                return (
                  <span key={index}>
                    <mark className="bg-yellow-300 px-1 rounded">
                      {match}
                    </mark>
                    {rest}
                  </span>
                );
              }

              return <span key={index}>{part}</span>;
            })}
          </div>
        )}
      </div>

      {/* OCR Workflow */}
      <div className="bg-blue-50 border border-blue-200 rounded-3xl p-7">
        <h2 className="text-2xl font-bold text-blue-700 mb-5">
          OCR Processing Workflow
        </h2>

        <div className="grid md:grid-cols-4 gap-5">
          {[
            ["PDF Upload", "Government Tender PDF uploaded."],
            ["PyMuPDF", "Extract embedded digital text."],
            ["Tesseract OCR", "Fallback for scanned documents."],
            ["OCR TXT Output", "Saved as uploads/filename.txt."],
          ].map(([title, desc], i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-5 shadow"
            >
              <h3 className="font-semibold text-[#003366]">
                {title}
              </h3>

              <p className="text-sm text-gray-600 mt-2 leading-6">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}