import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  CircleCheckBig,
  CircleX,
  MapPin,
} from "lucide-react";

import { validateTender } from "../services/api";
import { useTender } from "../context/TenderContext";
import ComplianceGauge from "../components/ComplianceGauge";

export default function ValidationPage() {
  const {
    filename,
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
  } = useTender();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (filename && complianceScore === 0) {
      fetchValidation();
    }
  }, [filename]);

  // ---------------- Validate Tender ----------------

  const fetchValidation = async () => {
    try {
      setLoading(true);

      const data = await validateTender(filename);

      setComplianceScore(data.score);
      setRiskLevel(data.risk_level);
      setMatchedClauses(data.matched_details);
      setMissingClauses(data.missing_clauses);
      setSummary(data.summary);

      toast.success("Tender validated successfully.");
    } catch (err) {
      console.error(err);
      toast.error("Validation failed.");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- No Tender ----------------

  if (!filename) {
    return (
      <div className="bg-white rounded-3xl shadow-lg p-12 text-center">
        <ShieldCheck className="mx-auto text-slate-400 mb-5" size={70} />

        <h2 className="text-3xl font-bold text-slate-700">
          No Tender Uploaded
        </h2>

        <p className="text-slate-500 mt-3">
          Upload and process a tender before running BIS validation.
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
          <ShieldCheck size={42} />

          <div>
            <h1 className="text-4xl font-bold">
              BIS Compliance Validation Engine
            </h1>

            <p className="mt-2 text-green-100">
              AI validated the uploaded tender against mandatory BIS procurement
              clauses.
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-3xl shadow-lg py-24 flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-green-600" size={45} />

          <p className="text-gray-500 font-medium">
            Validating BIS clauses...
          </p>
        </div>
      ) : (
        <>
          {/* KPI Section */}

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl shadow-lg p-6 flex justify-center">
              <ComplianceGauge score={complianceScore} />
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-6 flex flex-col justify-center">
              <p className="text-gray-500 text-sm">Risk Level</p>

              <span
                className={`mt-3 inline-block px-5 py-3 rounded-full font-bold text-lg w-fit ${
                  riskLevel === "LOW"
                    ? "bg-green-100 text-green-700"
                    : riskLevel === "MEDIUM"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {riskLevel}
              </span>

              <p className="text-gray-500 mt-5 text-sm">
                AI Risk Assessment based on mandatory BIS compliance clauses.
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-6 flex flex-col justify-center gap-4">
              <div className="flex items-center justify-between">
                <p className="text-gray-500">Matched Clauses</p>

                <CheckCircle2 className="text-green-600" />
              </div>

              <h2 className="text-4xl font-bold text-green-600">
                {matchedClauses.length}
              </h2>

              <hr />

              <div className="flex items-center justify-between">
                <p className="text-gray-500">Missing Clauses</p>

                <AlertTriangle className="text-red-600" />
              </div>

              <h2 className="text-4xl font-bold text-red-600">
                {missingClauses.length}
              </h2>
            </div>
          </div>

          {/* Summary */}

          <div className="bg-white rounded-3xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-[#003366] mb-4">
              AI Compliance Summary
            </h2>

            <p className="text-gray-700 leading-8">{summary}</p>
          </div>

          {/* Missing Clauses */}

          <div className="bg-white rounded-3xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="text-red-600" />

              <h2 className="text-2xl font-bold text-red-700">
                Missing BIS Clauses
              </h2>
            </div>

            {missingClauses.length === 0 ? (
              <div className="bg-green-50 border border-green-300 rounded-xl p-5 flex gap-3 items-center text-green-700">
                <CircleCheckBig size={26} />
                All mandatory BIS clauses are present.
              </div>
            ) : (
              <div className="space-y-4">
                {missingClauses.map((clause, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    className="border border-red-200 rounded-2xl p-5 bg-red-50"
                  >
                    <div className="flex justify-between items-start flex-wrap gap-3">
                      <div>
                        <h3 className="text-xl font-bold text-red-700">
                          {clause.label}
                        </h3>

                        <p className="text-gray-700 mt-2">
                          Expected Value:{" "}
                          <span className="font-semibold">
                            {clause.expected}
                          </span>
                        </p>
                      </div>

                      <CircleX className="text-red-600" size={28} />
                    </div>

                    <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                      <MapPin size={16} />

                      Page {clause.page} • Position ({clause.left},{" "}
                      {clause.top})
                    </div>

                    <div className="mt-4 bg-white rounded-lg p-4 border">
                      <p className="text-sm font-semibold text-gray-600 mb-2">
                        AI Recommendation
                      </p>

                      <p className="text-gray-700 text-sm">
                        {clause.recommendation}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Matched Clauses */}

          <div className="bg-white rounded-3xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle2 className="text-green-600" />

              <h2 className="text-2xl font-bold text-green-700">
                BIS Clauses Successfully Detected
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {matchedClauses.map((clause, index) => (
                <div
                  key={index}
                  className="bg-green-50 border border-green-200 rounded-2xl p-5"
                >
                  <div className="flex items-center gap-3">
                    <CircleCheckBig className="text-green-600" />

                    <h3 className="font-semibold text-green-700">
                      {clause.label}
                    </h3>
                  </div>

                  <p className="mt-3 text-gray-700">
                    Expected Value:{" "}
                    <span className="font-semibold">
                      {clause.expected}
                    </span>
                  </p>

                  <p className="mt-2 text-sm text-gray-500">
                    Located on Page {clause.page}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Compliance Breakdown */}

          <div className="bg-white rounded-3xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-[#003366] mb-6">
              Clause Compliance Breakdown
            </h2>

            {matchedClauses.concat(missingClauses).map((clause, index) => {
              const compliant = clause.status === "COMPLIANT";

              return (
                <div key={index} className="mb-5">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{clause.label}</span>

                    <span
                      className={`font-semibold ${
                        compliant ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {compliant ? "COMPLIANT" : "NON-COMPLIANT"}
                    </span>
                  </div>

                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        compliant ? "bg-green-500" : "bg-red-500"
                      }`}
                      style={{
                        width: compliant ? "100%" : "40%",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* AI Recommendation Box */}

          <div className="bg-yellow-50 border border-yellow-300 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-yellow-700 mb-4">
              AI Procurement Recommendation
            </h2>

            <p className="text-gray-700 leading-8">
              The AI recommends updating all missing clauses before publishing
              the tender. Including mandatory BIS specifications reduces
              procurement risk and ensures vendor eligibility during evaluation.
            </p>
          </div>
        </>
      )}
    </motion.div>
  );
}