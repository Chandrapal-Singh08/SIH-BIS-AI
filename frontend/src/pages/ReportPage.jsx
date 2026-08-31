import { useState } from "react";
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Download,
  FileText,
} from "lucide-react";

import { useTender } from "../context/TenderContext";
import { downloadReport } from "../services/api";

export default function ReportPage() {
  const {
    filename,
    originalFilename,
    complianceScore,
    riskLevel,
    matchedClauses,
    missingClauses,
    recommendedStandards,
    summary,
  } = useTender();

  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      setDownloading(true);

      const blob = await downloadReport(filename);

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "BIS_Compliance_Report.pdf";
      link.click();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Unable to download report.");
    } finally {
      setDownloading(false);
    }
  };

  if (!filename) {
    return (
      <div className="bg-white rounded-xl shadow p-10 text-center">
        <FileText size={60} className="mx-auto text-blue-700 mb-4" />

        <h2 className="text-2xl font-bold text-blue-700">
          No Compliance Report Available
        </h2>

        <p className="text-gray-500 mt-2">
          Upload and analyze a tender first.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow p-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#003366]">
            BIS Compliance Report
          </h1>

          <p className="text-gray-500 mt-2">
            AI Powered Tender Compliance Evaluation
          </p>
        </div>

        <button
          onClick={handleDownload}
          disabled={downloading}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg font-semibold"
        >
          <Download size={18} />

          {downloading ? "Generating PDF..." : "Download PDF"}
        </button>
      </div>

      {/* Tender Information */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="font-semibold text-xl mb-4">Tender Information</h2>

        <div className="grid md:grid-cols-2 gap-4 text-gray-700">
          <p>
            <strong>Original File:</strong> {originalFilename}
          </p>

          <p>
            <strong>Stored File:</strong> {filename}
          </p>

          <p>
            <strong>Evaluation Engine:</strong> BIS AI Engine
          </p>

          <p>
            <strong>Status:</strong> Completed
          </p>
        </div>
      </div>

      {/* Compliance Score */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="font-semibold text-xl mb-6">Compliance Overview</h2>

        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Progress Ring */}
          <div className="relative w-44 h-44">
            <svg className="w-44 h-44 rotate-[-90deg]" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="52"
                stroke="#E5E7EB"
                strokeWidth="10"
                fill="none"
              />

              <circle
                cx="60"
                cy="60"
                r="52"
                stroke="#16A34A"
                strokeWidth="10"
                fill="none"
                strokeDasharray={327}
                strokeDashoffset={327 - (327 * complianceScore) / 100}
                strokeLinecap="round"
              />
            </svg>

            <div className="absolute inset-0 flex items-center justify-center">
              <h2 className="text-3xl font-bold text-green-700">
                {complianceScore}%
              </h2>
            </div>
          </div>

          {/* Summary */}
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-green-700" />

              <span className="font-semibold">Compliance Score</span>
            </div>

            <div className="flex items-center gap-3">
              <AlertTriangle className="text-orange-600" />

              <span className="font-semibold">
                Risk Level:
                <span
                  className={`ml-2 px-3 py-1 rounded-full text-white text-sm ${
                    riskLevel === "LOW"
                      ? "bg-green-600"
                      : riskLevel === "MEDIUM"
                      ? "bg-yellow-500"
                      : "bg-red-600"
                  }`}
                >
                  {riskLevel}
                </span>
              </span>
            </div>

            <p className="text-gray-700 leading-7">{summary}</p>
          </div>
        </div>
      </div>

      {/* Clause Summary */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Matched */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle2 className="text-green-600" />

            <h2 className="text-xl font-semibold text-green-700">
              Compliant Clauses
            </h2>
          </div>

          <div className="space-y-3">
            {matchedClauses.map((item, index) => (
              <div
                key={index}
                className="border rounded-lg p-3 bg-green-50 border-green-200"
              >
                <p className="font-medium">{item.label}</p>

                <p className="text-sm text-gray-600">
                  Expected: {item.expected}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Missing */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="text-red-600" />

            <h2 className="text-xl font-semibold text-red-700">
              Missing Clauses
            </h2>
          </div>

          {missingClauses.length === 0 ? (
            <p className="text-green-700">
              All mandatory BIS clauses are present.
            </p>
          ) : (
            <div className="space-y-3">
              {missingClauses.map((item, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-3 bg-red-50 border-red-200"
                >
                  <p className="font-medium text-red-700">{item.label}</p>

                  <p className="text-sm mt-1">
                    Expected: {item.expected}
                  </p>

                  <p className="text-sm text-gray-700 mt-2">
                    {item.recommendation}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold text-purple-700 mb-4">
          AI Recommended BIS Standards
        </h2>

        {recommendedStandards.length === 0 ? (
          <p>No recommendations available.</p>
        ) : (
          <table className="w-full border rounded-lg overflow-hidden">
            <thead className="bg-[#003366] text-white">
              <tr>
                <th className="text-left p-3">BIS Standard</th>
                <th className="text-left p-3">Reason</th>
              </tr>
            </thead>

            <tbody>
              {recommendedStandards.map((item, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="p-3 font-medium">
                    {item.standard}
                  </td>

                  <td className="p-3 text-gray-700">
                    {item.reason}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Final AI Conclusion */}
      <div className="bg-gradient-to-r from-blue-700 to-green-700 text-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-3">
          AI Compliance Conclusion
        </h2>

        <p className="leading-7">
          The tender has achieved a compliance score of{" "}
          <strong>{complianceScore}%</strong>. The AI engine identified{" "}
          <strong>{missingClauses.length}</strong> missing BIS clauses and{" "}
          <strong>{recommendedStandards.length}</strong> relevant BIS standards
          for procurement compliance. Review the highlighted clauses before
          publishing the tender to improve regulatory compliance.
        </p>
      </div>
    </div>
  );
}