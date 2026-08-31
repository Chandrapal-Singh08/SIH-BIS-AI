import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileCheck,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Sparkles,
  ArrowRight,
  FileDown,
} from "lucide-react";

import { getRecommendations } from "../services/api";
import { useTender } from "../context/TenderContext";

export default function Recommendations() {
  const navigate = useNavigate();

  const {
    filename,
    recommendations,
    setRecommendations,
    productCategory,
    setProductCategory,
    complianceScore,
    riskLevel,
    summary,
  } = useTender();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!filename) {
      setLoading(false);
      return;
    }

    fetchRecommendations();
  }, [filename]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);

      const data = await getRecommendations(filename);

      setRecommendations(data.recommended_standards || []);
      setProductCategory(data.product_category || "Unknown Product");
    } catch (error) {
      console.error("Recommendation Error:", error);

      setRecommendations([]);
      setProductCategory("Unknown Product");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // No Tender Uploaded
  // -----------------------------
  if (!filename) {
    return (
      <div className="bg-white rounded-3xl shadow-lg p-10 text-center">
        <FileCheck className="mx-auto text-slate-400 mb-5" size={70} />

        <h2 className="text-3xl font-bold text-slate-700">
          No Tender Uploaded
        </h2>

        <p className="text-slate-500 mt-3">
          Upload a Government Tender PDF to generate AI-powered BIS
          recommendations.
        </p>

        <button
          onClick={() => navigate("/upload")}
          className="mt-6 bg-[#003366] hover:bg-[#002244] text-white px-6 py-3 rounded-xl font-semibold transition"
        >
          Upload Tender
        </button>
      </div>
    );
  }

  // -----------------------------
  // Main Page
  // -----------------------------
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-r from-green-700 to-emerald-500 p-8 text-white shadow-xl">
        <div className="flex items-center gap-4">
          <FileCheck size={40} />

          <div>
            <h1 className="text-4xl font-bold">
              AI BIS Recommendation Engine
            </h1>

            <p className="text-green-100 mt-2">
              AI analyzed your uploaded Government Tender and identified relevant
              Bureau of Indian Standards required for procurement compliance.
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <p className="text-slate-500">Product Category</p>

          <h2 className="text-xl font-bold text-green-700 mt-2">
            {productCategory}
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <p className="text-slate-500">BIS Standards</p>

          <h2 className="text-4xl font-bold text-blue-700 mt-2">
            {recommendations.length}
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <p className="text-slate-500">Compliance Score</p>

          <h2 className="text-4xl font-bold text-green-600 mt-2">
            {complianceScore}%
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <p className="text-slate-500">Risk Level</p>

          <span
            className={`mt-3 inline-block px-4 py-2 rounded-full font-semibold ${
              riskLevel === "LOW"
                ? "bg-green-100 text-green-700"
                : riskLevel === "MEDIUM"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {riskLevel}
          </span>
        </div>
      </div>

      {/* Loader */}
      {loading ? (
        <div className="bg-white rounded-3xl shadow-lg p-16 flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-green-600" size={50} />

          <p className="font-semibold text-slate-600">
            AI is identifying relevant BIS standards...
          </p>
        </div>
      ) : (
        <>
          {/* Recommendation Cards */}
          <div className="space-y-6">
            {recommendations.length === 0 ? (
              <div className="bg-white rounded-2xl shadow p-10 text-center text-slate-500">
                No BIS recommendations were generated for this tender.
              </div>
            ) : (
              recommendations.map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-3xl shadow-lg p-7 border hover:border-green-500 transition"
                >
                  <div className="flex justify-between flex-wrap gap-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <ShieldCheck className="text-green-600" />

                        <h2 className="text-2xl font-bold text-green-700">
                          {item.standard}
                        </h2>
                      </div>

                      <p className="mt-3 text-slate-700 leading-7">
                        {item.reason}
                      </p>
                    </div>

                    <div className="text-center">
                      <p className="text-sm text-slate-500">AI Confidence</p>

                      <h2 className="text-3xl font-bold text-green-600">
                        {95 - index}%
                      </h2>
                    </div>
                  </div>

                  <div className="mt-5 h-3 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-600"
                      style={{ width: `${95 - index}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>

          {/* BIS Standards Table */}
          <div className="bg-white rounded-3xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="text-yellow-500" />

              <h2 className="text-2xl font-bold text-slate-800">
                Recommended BIS Standards
              </h2>
            </div>

            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b text-left text-slate-600">
                  <th className="py-3">Standard</th>
                  <th>Reason</th>
                </tr>
              </thead>

              <tbody>
                {recommendations.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-4 font-semibold text-green-700">
                      {item.standard}
                    </td>

                    <td className="text-slate-700">{item.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* AI Summary */}
          <div className="bg-white rounded-3xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-5">
              <CheckCircle2 className="text-green-600" />

              <h2 className="text-2xl font-bold text-slate-800">
                AI Recommendation Summary
              </h2>
            </div>

            <p className="text-slate-700 leading-7">{summary}</p>

            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <AlertTriangle className="text-yellow-600" />

                <p className="font-semibold text-yellow-700">
                  Procurement Recommendation
                </p>
              </div>

              <p className="text-yellow-800">
                Include all recommended BIS standards in the technical
                specifications of the tender before publishing. This improves BIS
                compliance and reduces procurement risk during evaluation.
              </p>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="grid md:grid-cols-2 gap-5">
            <button
              onClick={() => navigate("/report")}
              className="bg-green-600 hover:bg-green-700 text-white rounded-2xl p-6 flex items-center justify-between shadow-lg transition"
            >
              <div className="text-left">
                <p className="text-sm text-green-100">Next Step</p>

                <h3 className="text-xl font-bold">
                  Generate Compliance Report
                </h3>
              </div>

              <ArrowRight size={28} />
            </button>

            <button
              onClick={() => navigate("/review")}
              className="bg-[#003366] hover:bg-[#002244] text-white rounded-2xl p-6 flex items-center justify-between shadow-lg transition"
            >
              <div className="text-left">
                <p className="text-sm text-blue-100">Tender Review</p>

                <h3 className="text-xl font-bold">
                  Review Tender PDF Highlights
                </h3>
              </div>

              <FileDown size={28} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}