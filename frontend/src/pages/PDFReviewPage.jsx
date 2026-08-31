import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { motion } from "framer-motion";
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { useTender } from "../context/TenderContext";
import { getTenderPDF } from "../services/api";

// ✅ Fix PDF.js worker version mismatch
pdfjs.GlobalWorkerOptions.workerSrc =
  `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PDFReviewPage() {
  const {
    filename,
    complianceScore,
    riskLevel,
    matchedClauses,
    missingClauses,
  } = useTender();

  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);

  if (!filename) {
    return (
      <div className="bg-white rounded-3xl shadow-lg p-12 text-center">
        <FileText className="mx-auto text-slate-400 mb-4" size={60} />
        <h2 className="text-2xl font-bold text-slate-700">
          No Tender Uploaded
        </h2>
        <p className="text-slate-500 mt-2">
          Upload and analyze a tender first to review the PDF.
        </p>
      </div>
    );
  }

  const pdfUrl = getTenderPDF(filename);

  const onLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  const nextPage = () => {
    if (pageNumber < numPages) setPageNumber(pageNumber + 1);
  };

  const prevPage = () => {
    if (pageNumber > 1) setPageNumber(pageNumber - 1);
  };

  const goToClause = (page) => {
    setPageNumber(page);
  };

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-r from-[#003366] to-[#0055AA] text-white p-8 shadow-xl">
        <div className="flex items-center gap-4">
          <FileText size={40} />
          <div>
            <h1 className="text-4xl font-bold">
              BIS Tender PDF Review
            </h1>
            <p className="text-blue-100 mt-2">
              Review the uploaded tender alongside AI-detected compliance clauses.
            </p>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="grid md:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <p className="text-sm text-gray-500">Compliance Score</p>
          <h2 className="text-3xl font-bold text-green-600 mt-2">
            {complianceScore}%
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <p className="text-sm text-gray-500">Risk Level</p>
          <h2
            className={`text-2xl font-bold mt-2 ${
              riskLevel === "LOW"
                ? "text-green-600"
                : riskLevel === "MEDIUM"
                ? "text-yellow-600"
                : "text-red-600"
            }`}
          >
            {riskLevel}
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <p className="text-sm text-gray-500">Total Issues</p>
          <h2 className="text-3xl font-bold text-red-600 mt-2">
            {missingClauses.length}
          </h2>
        </div>
      </div>

      {/* PDF + Sidebar */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* PDF Viewer */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-5">
          <div className="flex justify-between items-center mb-5">
            <h2 className="font-semibold text-[#003366] text-lg">
              Tender Document
            </h2>

            <div className="flex items-center gap-3">
              <button
                onClick={prevPage}
                disabled={pageNumber === 1}
                className="p-2 rounded-lg bg-slate-100 disabled:opacity-40"
              >
                <ChevronLeft size={18} />
              </button>

              <span className="font-medium">
                Page {pageNumber} / {numPages || "-"}
              </span>

              <button
                onClick={nextPage}
                disabled={pageNumber === numPages}
                className="p-2 rounded-lg bg-slate-100 disabled:opacity-40"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div className="flex justify-center bg-slate-100 rounded-xl p-3 overflow-auto">
            <Document
              file={pdfUrl}
              onLoadSuccess={onLoadSuccess}
              loading={<p className="text-blue-700">Loading PDF...</p>}
              error={<p className="text-red-600">Failed to load PDF.</p>}
            >
              <Page
                pageNumber={pageNumber}
                width={650}
                renderTextLayer
                renderAnnotationLayer
              />
            </Document>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Missing Clauses */}
          <div className="bg-white rounded-2xl shadow-lg p-5">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="text-red-600" />
              <h3 className="font-semibold text-red-700">
                Missing BIS Clauses
              </h3>
            </div>

            {missingClauses.length === 0 ? (
              <p className="text-green-600 text-sm">
                No missing clauses detected.
              </p>
            ) : (
              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {missingClauses.map((clause, index) => (
                  <button
                    key={index}
                    onClick={() => goToClause(clause.page)}
                    className="w-full text-left bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl p-3 transition"
                  >
                    <p className="font-semibold text-red-700">
                      {clause.label}
                    </p>

                    <p className="text-xs text-gray-600 mt-1">
                      Expected: {clause.expected}
                    </p>

                    <p className="text-xs text-blue-700 mt-2">
                      Page {clause.page}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Matched Clauses */}
          <div className="bg-white rounded-2xl shadow-lg p-5">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="text-green-600" />
              <h3 className="font-semibold text-green-700">
                Compliant Clauses
              </h3>
            </div>

            {matchedClauses.length === 0 ? (
              <p className="text-gray-500 text-sm">
                No matched clauses available.
              </p>
            ) : (
              <div className="space-y-2 max-h-[250px] overflow-y-auto">
                {matchedClauses.map((clause, index) => (
                  <div
                    key={index}
                    className="bg-green-50 border border-green-200 rounded-lg p-3"
                  >
                    <p className="font-medium text-green-700">
                      {clause.label}
                    </p>

                    <p className="text-xs text-gray-600">
                      {clause.expected}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* AI Note */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
            <h3 className="font-semibold text-blue-700 mb-2">
              AI Review Insight
            </h3>

            <p className="text-sm text-gray-700 leading-6">
              The validator compares OCR text against mandatory BIS clauses such
              as IP Rating, Warranty, Surge Protection, Power Factor, and Voltage
              Range. Clicking a missing clause jumps to the relevant PDF page.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}