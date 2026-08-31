import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  Sparkles,
  BookOpen,
  BadgeCheck,
  Loader2,
  CheckCircle2,
  Layers,
} from "lucide-react";

import { getRecommendations } from "../services/api";
import { useTender } from "../context/TenderContext";

export default function RecommendationPage() {
  const {
    filename,
    productCategory,
    setProductCategory,
    recommendations,
    setRecommendations,
    complianceScore,
    riskLevel,
  } = useTender();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (filename && recommendations.length === 0) {
      fetchRecommendations();
    }
  }, [filename]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);

      const data = await getRecommendations(filename);

      setProductCategory(data.product_category || "Unknown Product");
      setRecommendations(data.recommended_standards || []);

      toast.success("AI BIS recommendations generated.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to load recommendations.");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Empty State ----------------

  if (!filename) {
    return (
      <div className="bg-white rounded-3xl shadow-lg p-12 text-center">
        <Sparkles className="mx-auto text-slate-400 mb-4" size={64} />

        <h2 className="text-3xl font-bold text-slate-700">
          No Tender Uploaded
        </h2>

        <p className="text-slate-500 mt-3">
          Upload and analyze a Government Tender first to generate BIS
          recommendations.
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

      <div className="rounded-3xl bg-gradient-to-r from-[#003366] to-[#0055AA] text-white p-8 shadow-xl">
        <div className="flex items-center gap-4">
          <Sparkles size={42} />

          <div>
            <h1 className="text-4xl font-bold">
              AI BIS Recommendation Engine
            </h1>

            <p className="mt-2 text-blue-100">
              AI identified the most relevant BIS standards using OCR text,
              PostgreSQL knowledge base, and the RAG recommendation engine.
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <p className="text-sm text-gray-500">Detected Product</p>

          <h2 className="text-xl font-bold text-[#003366] mt-2">
            {productCategory || "Unknown Product"}
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <p className="text-sm text-gray-500">Recommended Standards</p>

          <h2 className="text-3xl font-bold text-green-600 mt-2">
            {recommendations.length}
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <p className="text-sm text-gray-500">Tender Compliance</p>

          <h2 className="text-3xl font-bold text-blue-700 mt-2">
            {complianceScore}%
          </h2>

          <p className="text-xs mt-2 text-gray-500">
            Risk Level:{" "}
            <span className="font-semibold">{riskLevel}</span>
          </p>
        </div>
      </div>

      {/* Loading */}

      {loading ? (
        <div className="bg-white rounded-3xl shadow-lg p-16 text-center">
          <Loader2 className="animate-spin mx-auto text-blue-700 mb-4" size={44} />

          <p className="text-gray-600 font-medium">
            AI is generating BIS recommendations...
          </p>
        </div>
      ) : (
        <>
          {/* Recommendation Cards */}

          <div className="space-y-5">
            {(recommendations || []).length === 0 ? (
              <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-6 text-yellow-700">
                No BIS recommendations found for this tender.
              </div>
            ) : (
              (recommendations || []).map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.01 }}
                  className="bg-white rounded-3xl shadow-lg p-7 border-l-4 border-green-600"
                >
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                      <BookOpen className="text-green-600" size={34} />

                      <div>
                        <h3 className="text-2xl font-bold text-[#003366]">
                          {item.standard}
                        </h3>

                        <p className="text-green-700 text-sm mt-1 font-medium">
                          BIS Standard Recommendation
                        </p>
                      </div>
                    </div>

                    <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
                      Recommended
                    </span>
                  </div>

                  <div className="mt-6 bg-slate-50 rounded-xl p-5 border">
                    <p className="text-sm font-semibold text-gray-600 mb-2">
                      AI Reasoning
                    </p>

                    <p className="text-gray-700 leading-7">
                      {item.reason}
                    </p>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <span className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-sm">
                      <BadgeCheck size={16} />
                      Applicable BIS Standard
                    </span>

                    <span className="flex items-center gap-2 bg-purple-50 text-purple-700 px-3 py-2 rounded-lg text-sm">
                      <Layers size={16} />
                      AI RAG Recommendation
                    </span>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Why Recommended */}

          <div className="bg-white rounded-3xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-[#003366] mb-6">
              Why These BIS Standards Were Recommended
            </h2>

            <div className="grid md:grid-cols-2 gap-5">
              <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
                <h3 className="font-semibold text-blue-700 mb-2">
                  OCR Product Identification
                </h3>

                <p className="text-gray-700 text-sm leading-6">
                  AI extracts keywords such as LED, Luminaire, IP66, Surge
                  Protection, and Voltage Range from the tender.
                </p>
              </div>

              <div className="bg-green-50 rounded-xl p-5 border border-green-200">
                <h3 className="font-semibold text-green-700 mb-2">
                  PostgreSQL BIS Knowledge Base
                </h3>

                <p className="text-gray-700 text-sm leading-6">
                  Standards are retrieved from the BIS standards database based on
                  detected product category.
                </p>
              </div>

              <div className="bg-purple-50 rounded-xl p-5 border border-purple-200">
                <h3 className="font-semibold text-purple-700 mb-2">
                  AI Recommendation Engine
                </h3>

                <p className="text-gray-700 text-sm leading-6">
                  A RAG engine ranks the most relevant BIS standards using
                  semantic similarity.
                </p>
              </div>

              <div className="bg-yellow-50 rounded-xl p-5 border border-yellow-200">
                <h3 className="font-semibold text-yellow-700 mb-2">
                  Procurement Compliance
                </h3>

                <p className="text-gray-700 text-sm leading-6">
                  These recommendations help procurement officers include the
                  correct BIS specifications before publishing tenders.
                </p>
              </div>
            </div>
          </div>

          {/* AI Recommendation Footer */}

          <div className="bg-gradient-to-r from-green-600 to-emerald-500 rounded-3xl shadow-xl p-8 text-white">
            <div className="flex items-center gap-4 mb-4">
              <CheckCircle2 size={36} />

              <h2 className="text-3xl font-bold">
                AI Recommendation Completed
              </h2>
            </div>

            <p className="text-green-100 leading-7 max-w-3xl">
              The BIS AI Engine has identified applicable standards for this
              tender. These recommendations are generated using OCR text,
              PostgreSQL BIS metadata, and AI-powered semantic retrieval.
            </p>
          </div>
        </>
      )}
    </motion.div>
  );
}