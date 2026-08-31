import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  FileDown,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Loader2,
} from "lucide-react";

import { downloadReport } from "../services/api";
import { useTender } from "../context/TenderContext";

export default function ComplianceReport() {
  const {
    filename,
    originalFilename,
    complianceScore,
    riskLevel,
    matchedClauses,
    missingClauses,
    recommendations,
    summary,
    productCategory,
  } = useTender();

  const handleDownload = async () => {
    try {
      const pdfBlob = await downloadReport(filename);

      const url = window.URL.createObjectURL(pdfBlob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${originalFilename || "BIS_Compliance_Report"}.pdf`;

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Compliance report downloaded.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to download report.");
    }
  };

  if (!filename) {
    return (
      <div className="bg-white rounded-3xl shadow-lg p-12 text-center">
        <FileDown className="mx-auto text-gray-400 mb-4" size={64} />

        <h2 className="text-2xl font-bold text-gray-700">
          No Compliance Report Available
        </h2>

        <p className="text-gray-500 mt-2">
          Upload and validate a tender first to generate an AI compliance report.
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
      <div className="rounded-3xl bg-gradient-to-r from-green-700 to-emerald-500 text-white p-8 shadow-xl">
        <div className="flex items-center gap-4">
          <FileDown size={42} />

          <div>
            <h1 className="text-4xl font-bold">
              AI BIS Compliance Report
            </h1>

            <p className="text-green-100 mt-2">
              Automatically generated procurement compliance report for the uploaded Government Tender.
            </p>
          </div>
        </div>
      </div>

      {/* Report Summary */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-sm text-gray-500">Compliance Score</p>

          <h2 className="text-3xl font-bold text-green-600 mt-2">
            {complianceScore}%
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
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

        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-sm text-gray-500">Matched Clauses</p>

          <h2 className="text-3xl font-bold text-blue-700 mt-2">
            {matchedClauses.length}
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-sm text-gray-500">Missing Clauses</p>

          <h2 className="text-3xl font-bold text-red-600 mt-2">
            {missingClauses.length}
          </h2>
        </div>
      </div>

      {/* Tender Info */}
      <div className="bg-white rounded-3xl shadow-lg p-7">
        <h2 className="text-2xl font-bold text-[#003366] mb-6">
          Tender Information
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-500 text-sm">Original Filename</p>

            <h3 className="font-semibold mt-2 break-all">
              {originalFilename}
            </h3>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Detected Product Category</p>

            <h3 className="font-semibold mt-2 text-[#003366]">
              {productCategory || "Unknown Product"}
            </h3>
          </div>
        </div>
      </div>

      {/* AI Summary */}
      <div className="bg-white rounded-3xl shadow-lg p-7">
        <div className="flex items-center gap-3 mb-5">
          <Sparkles className="text-purple-700" />

          <h2 className="text-2xl font-bold text-[#003366]">
            AI Compliance Summary
          </h2>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-xl p-5">
          <p className="text-gray-700 leading-7 whitespace-pre-line">
            {summary}
          </p>
        </div>
      </div>

      {/* Missing Clauses */}
      <div className="bg-white rounded-3xl shadow-lg p-7">
        <div className="flex items-center gap-3 mb-5">
          <AlertTriangle className="text-red-600" />

          <h2 className="text-2xl font-bold text-[#003366]">
            Missing BIS Clauses
          </h2>
        </div>

        {missingClauses.length === 0 ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-green-700">
            No missing clauses detected.
          </div>
        ) : (
          <div className="space-y-4">
            {missingClauses.map((clause, index) => (
              <div
                key={index}
                className="border border-red-200 bg-red-50 rounded-xl p-5"
              >
                <h3 className="font-bold text-red-700">
                  {clause.label}
                </h3>

                <p className="text-sm mt-2 text-gray-700">
                  Expected Value:
                  <span className="font-semibold ml-2">
                    {clause.expected}
                  </span>
                </p>

                <p className="text-sm mt-2 text-gray-700">
                  {clause.recommendation}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recommended Standards */}
      <div className="bg-white rounded-3xl shadow-lg p-7">
        <div className="flex items-center gap-3 mb-5">
          <ShieldCheck className="text-green-700" />

          <h2 className="text-2xl font-bold text-[#003366]">
            AI Recommended BIS Standards
          </h2>
        </div>

        {(recommendations || []).length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-5 text-yellow-700">
            No additional BIS recommendations available.
          </div>
        ) : (
          <div className="space-y-4">
            {(recommendations || []).map((item, index) => (
              <div
                key={index}
                className="border border-green-200 bg-green-50 rounded-xl p-5"
              >
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle2 className="text-green-700" />

                  <h3 className="font-bold text-green-700 text-lg">
                    {item.standard}
                  </h3>
                </div>

                <p className="text-gray-700">
                  {item.reason}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Download Button */}
      <div className="bg-gradient-to-r from-[#003366] to-[#0055AA] rounded-3xl shadow-xl p-8 text-white text-center">
        <h2 className="text-3xl font-bold mb-3">
          Download Official Compliance Report
        </h2>

        <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
          Generate and download a professional BIS compliance report containing
          validation results, missing clauses, AI recommendations, and compliance summary.
        </p>

        <button
          onClick={handleDownload}
          className="bg-white text-[#003366] px-8 py-4 rounded-xl font-semibold flex items-center gap-3 mx-auto hover:bg-blue-50 transition"
        >
          <FileDown size={22} />
          Download PDF Report
        </button>
      </div>
    </motion.div>
  );
}